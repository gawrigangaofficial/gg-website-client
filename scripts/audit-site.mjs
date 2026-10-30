/**
 * Audits the built site in dist/ (run `npm run build` first):
 *
 *   npm run audit
 *
 * For every page: title and description length, one H1, canonical, Open Graph, JSON-LD validity, image alt text,
 * thin content, and internal links that lead nowhere. Across the site: duplicate titles, descriptions and H1s,
 * sitemap against files, redirects. Exits 1 when it finds an error. Reads files only; makes no network requests.
 */
import fs from 'node:fs'
import path from 'node:path'

const DIST = path.resolve('dist')
const SITE = 'https://www.gawriganga.com'
if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/ not found. Run npm run build first.')
  process.exit(2)
}

const errors = []
const warnings = []
const err = (page, msg) => errors.push({ page, msg })
const warn = (page, msg) => warnings.push({ page, msg })

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) return e.name === 'assets' ? [] : walk(p)
    return p.endsWith('.html') ? [p] : []
  })
const files = walk(DIST)
const routeOf = (file) => {
  const rel = path.relative(DIST, file).replace(/\\/g, '/').replace(/\.html$/, '')
  return rel === 'index' ? '/' : `/${rel}`
}
const routes = new Set(files.map(routeOf))

const decode = (s = '') => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
const grab = (html, re) => (html.match(re) || [])[1]
const textOf = (html) => decode(html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

// _redirects: exact and splat rules
const redirects = []
const redirectFile = path.join(DIST, '_redirects')
if (fs.existsSync(redirectFile)) {
  for (const line of fs.readFileSync(redirectFile, 'utf8').split(/\r?\n/)) {
    const [from, to, code] = line.trim().split(/\s+/)
    if (from && to) redirects.push({ from, to, code })
  }
}
const redirected = (p) =>
  redirects.some((r) => (r.from.endsWith('/*') ? p.startsWith(r.from.slice(0, -1)) || p === r.from.slice(0, -2) : r.from === p))
for (const r of redirects) {
  const target = r.to.split('?')[0].replace(/:splat$/, '')
  if (!r.to.includes(':splat') && !routes.has(target) && target !== '/') err('_redirects', `${r.from} redirects to ${r.to}, which is not a page`)
}

const pages = []
for (const file of files) {
  const route = routeOf(file)
  const html = fs.readFileSync(file, 'utf8')
  const head = html.slice(0, html.indexOf('</head>'))
  const body = html.slice(html.indexOf('<body'))
  const title = decode(grab(head, /<title[^>]*>([^<]*)<\/title>/) || '')
  const description = decode(grab(head, /<meta[^>]*name="description"[^>]*content="([^"]*)"/) || '')
  const robots = grab(head, /<meta[^>]*name="robots"[^>]*content="([^"]*)"/) || ''
  const canonicals = [...head.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/g)].map((m) => m[1])
  const noindex = /noindex/i.test(robots)
  const h1s = [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => textOf(m[1]))
  const root = body.slice(0, body.indexOf('<script'))
  const words = textOf(root).split(/\s+/).filter(Boolean).length
  pages.push({ route, file, html, head, body, title, description, robots, canonicals, noindex, h1s, words })
}

const indexable = pages.filter((p) => !p.noindex && p.route !== '/404')
const LEGAL = /^\/(privacy-policy|terms-of-service|terms-and-conditions|refund-cancellation|shipping-policy|contact|corporate-bulk-orders)$/

for (const p of pages) {
  const { route } = p
  if (!p.title) err(route, 'no title')
  if (p.noindex) continue

  if (p.title.length < 25 || p.title.length > 65) warn(route, `title is ${p.title.length} characters: "${p.title}"`)
  if (!p.description) err(route, 'no meta description')
  else if (p.description.length < 110 || p.description.length > 165) warn(route, `description is ${p.description.length} characters`)
  if (p.h1s.length !== 1) err(route, `${p.h1s.length} H1 tags (should be 1)`)
  if (p.canonicals.length !== 1) err(route, `${p.canonicals.length} canonical tags (should be 1)`)
  else if (!p.canonicals[0].startsWith(SITE)) err(route, `canonical is not on ${SITE}: ${p.canonicals[0]}`)
  else {
    const c = p.canonicals[0].slice(SITE.length) || '/'
    if (c !== route) {
      const known = c.startsWith('/sprays/') && route.startsWith('/product/')
      if (!known) warn(route, `canonical points to ${c}`)
    }
  }
  if (!/property="og:image"/.test(p.head)) warn(route, 'no og:image')
  if (!/property="og:title"/.test(p.head)) warn(route, 'no og:title')

  // JSON-LD
  const blocks = [...p.head.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1])
  const types = []
  for (const b of blocks) {
    try {
      const j = JSON.parse(b)
      types.push(j['@type'])
    } catch {
      err(route, 'a JSON-LD block is not valid JSON')
    }
  }
  p.types = types
  if (route.startsWith('/product/') && !types.includes('Product')) err(route, 'product page without Product schema')
  if (route.startsWith('/guides/') && !types.includes('Article')) err(route, 'guide without Article schema')
  if (route !== '/' && !types.includes('BreadcrumbList')) warn(route, 'no BreadcrumbList schema')

  // Thin content
  if (p.words < 150 && !LEGAL.test(route) && route !== "/") warn(route, `only ${p.words} words in the first HTML`)

  // Images
  const imgs = [...p.body.matchAll(/<img\b[^>]*>/g)].map((m) => m[0])
  const noAlt = imgs.filter((i) => !/\balt="/.test(i)).length
  if (noAlt) warn(route, `${noAlt} image(s) without alt text`)

  // Internal links in the first HTML
  const seen = new Set()
  for (const m of p.body.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    let href = decode(m[1])
    if (!href.startsWith('/') || href.startsWith('//')) continue
    href = href.split('#')[0].split('?')[0].replace(/\/$/, '') || '/'
    if (seen.has(href)) continue
    seen.add(href)
    if (/^\/(assets|favicon|manifest|robots|sitemap|llms?)/.test(href) || /\.(png|jpg|webp|svg|ico|xml|txt|json|webmanifest)$/.test(href)) continue
    if (!routes.has(href) && !redirected(href)) err(route, `link to ${href} leads nowhere`)
  }
}

// Duplicates
const dupes = (label, pick) => {
  const map = new Map()
  for (const p of indexable) {
    const v = pick(p)
    if (!v) continue
    const key = v.trim().toLowerCase()
    ;(map.get(key) || map.set(key, []).get(key)).push(p.route)
  }
  for (const [v, routesWith] of map) {
    const real = routesWith.filter((r) => !(r.startsWith('/product/') && routesWith.some((x) => x.startsWith('/sprays/'))))
    if (real.length > 1) err(real.join(' + '), `same ${label}: "${v.slice(0, 80)}"`)
  }
}
dupes('title', (p) => p.title)
dupes('meta description', (p) => p.description)
dupes('H1', (p) => p.h1s[0])

// Sitemap
const sitemapFile = path.join(DIST, 'sitemap.xml')
const sitemapUrls = new Set()
if (fs.existsSync(sitemapFile)) {
  for (const m of fs.readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) sitemapUrls.add(m[1].replace(SITE, '') || '/')
  for (const u of sitemapUrls) {
    if (!routes.has(u)) err('sitemap.xml', `${u} has no page`)
    const page = pages.find((p) => p.route === u)
    if (page?.noindex) err('sitemap.xml', `${u} is noindex but listed`)
  }
  for (const p of indexable) {
    const canonicalOther = p.canonicals[0] && p.canonicals[0].slice(SITE.length) !== p.route
    if (!sitemapUrls.has(p.route) && !canonicalOther) warn(p.route, 'indexable page missing from sitemap')
  }
} else err('sitemap.xml', 'missing')

const robots = fs.existsSync(path.join(DIST, 'robots.txt')) ? fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8') : ''
if (!/Sitemap:/i.test(robots)) err('robots.txt', 'no Sitemap line')
if (/Disallow:\s*\/\s*$/m.test(robots)) err('robots.txt', 'blocks the whole site')

// Report
const byType = {}
for (const p of indexable) {
  const key = p.route === '/' ? 'home' : p.route.split('/')[1] || 'other'
  byType[key] = (byType[key] || 0) + 1
}
console.log(`Pages: ${pages.length} (${indexable.length} indexable, ${pages.length - indexable.length} noindex) · sitemap URLs: ${sitemapUrls.size} · redirects: ${redirects.length}`)
console.log(`By section: ${Object.entries(byType).map(([k, v]) => `${k} ${v}`).join(', ')}`)
const avgWords = Math.round(indexable.reduce((a, p) => a + p.words, 0) / indexable.length)
console.log(`Average words in first HTML (indexable pages): ${avgWords}`)

const show = (label, list) => {
  if (!list.length) return console.log(`\n${label}: none`)
  console.log(`\n${label} (${list.length}):`)
  for (const x of list.slice(0, 60)) console.log(`  ${x.page}: ${x.msg}`)
  if (list.length > 60) console.log(`  ... and ${list.length - 60} more`)
}
show('Errors', errors)
show('Warnings', warnings)
fs.writeFileSync(path.join(DIST, '..', 'audit-report.json'), JSON.stringify({ pages: pages.length, indexable: indexable.length, errors, warnings }, null, 2))
process.exit(errors.length ? 1 : 0)
