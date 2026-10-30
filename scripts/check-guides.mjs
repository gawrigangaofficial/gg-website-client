/**
 * Quality gate for long-form guides in src/content/guides/*.js.
 *
 *   node scripts/check-guides.mjs                      check every guide file
 *   node scripts/check-guides.mjs slug-a slug-b        check only these guides
 *
 * Env: GUIDE_PLAN=<json file with an array of planned slugs>  (links to guides not written yet are then allowed)
 *      PRODUCT_SNAPSHOT=<json file of /api/products>          (default: fetched live from api.gawriganga.com)
 *
 * Checks per guide: required fields, title/description length, visible word count, valid internal links and
 * product slugs, banned claims and filler. With no slug arguments it also reports sentences repeated across guides.
 * Exits 1 when any error is found.
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = path.resolve('.')
const DIR = path.join(ROOT, 'src', 'content', 'guides')
const only = process.argv.slice(2)

const CATEGORIES = ['Rudraksha', 'Karungali', 'Tulsi', 'Bracelets and stones', 'Rashi and purpose', 'Sprays and gifts']
const STATIC_PATHS = new Set(['/', '/rudraksha', '/tulsimala', '/accessories', '/combos', '/sprays', '/rashi', '/about', '/faq', '/contact', '/guides', '/blog', '/shipping-policy', '/refund-cancellation', '/corporate-bulk-orders', '/purpose-products', '/shop/karungali-mala', '/shop/sphatik', '/shop/pyrite', '/shop/evil-eye', '/shop/japa-malas', '/shop/wealth-bracelets', '/shop/pendants', '/shop/festivals'])
const RASHI_SLUGS = ['mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya', 'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen']
const SPRAY_PAGES = ['/sprays/shuddhi', '/sprays/maitri', '/sprays/chakra-balance', '/sprays/amrat-bindu']

const BANNED = [
  [/\b(cures?|cured|heals?|healed|treats?|treatment of)\b/i, 'medical claim'],
  [/\bwill (bring|make you|give you|attract|solve|fix|remove)\b/i, 'promise of a result'],
  [/\b(miracle|miraculous|guaranteed (result|success|money|wealth))\b/i, 'miracle or guarantee claim'],
  [/\b(blood pressure|cancer|diabetes|heart disease|infertility|depression)\b/i, 'named medical condition'],
  [/\b100\s?%\s?(original|genuine|safe|natural|pure)\b/i, 'unprovable 100% claim'],
  [/\b(get rich|become rich|lottery|jackpot)\b/i, 'wealth promise'],
  [/\b(delve|tapestry|unlock the|elevate your|ever-evolving|dive into|in conclusion|in today's fast-paced|game-changer|navigate the world)\b/i, 'filler phrase'],
  [/divine ?hindu|japam|rudrakailash|rudraksha ?ratna|gemsmantra/i, 'competitor name'],
]
// "does not guarantee" / "no guarantee" are honest disclaimers, so a negation right before is fine.
const NEGATED_GUARANTEE = /\b(not|no|nor|never|without|neither|cannot|can't|doesn't|does not|do not|don't)\b[^.]{0,40}\bguarantee/i

const errors = []
const warnings = []
const err = (slug, msg) => errors.push(`${slug}: ${msg}`)
const warn = (slug, msg) => warnings.push(`${slug}: ${msg}`)

async function productSlugs() {
  try {
    if (process.env.PRODUCT_SNAPSHOT) return new Set(JSON.parse(fs.readFileSync(process.env.PRODUCT_SNAPSHOT, 'utf8')).data.map((p) => p.slug))
    const r = await fetch('https://api.gawriganga.com/api/products?limit=200', { signal: AbortSignal.timeout(20000) })
    return new Set((await r.json()).data.map((p) => p.slug))
  } catch (e) {
    console.error(`Could not load products (${e.message}); set PRODUCT_SNAPSHOT.`)
    process.exit(2)
  }
}

const visibleText = (g) => {
  const parts = []
  const block = (b) => {
    if (typeof b === 'string') parts.push(b)
    else if (b?.ul) parts.push(...b.ul)
    else if (b?.table) parts.push(b.table.head.join(' '), ...b.table.rows.map((r) => r.join(' ')))
  }
  for (const s of g.sections || []) {
    parts.push(s.h2 || '')
    ;(s.body || []).forEach(block)
    for (const sub of s.subs || []) {
      parts.push(sub.h3 || '')
      ;(sub.body || []).forEach(block)
    }
  }
  for (const f of g.faqs || []) parts.push(f.q, f.a)
  return parts.join('\n')
}
const clean = (t) => t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\{\{(?:price|amount):[a-z0-9-]+\}\}/g, '₹0')

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.js') && !['index.js', 'topics.js', 'cards.js', 'lookup.js'].includes(f))
const plan = process.env.GUIDE_PLAN ? JSON.parse(fs.readFileSync(process.env.GUIDE_PLAN, 'utf8')) : []
const guideSlugs = new Set([...files.map((f) => f.replace(/\.js$/, '')), ...plan])
const products = await productSlugs()
const sentences = new Map()
let checked = 0

for (const file of files) {
  const slug = file.replace(/\.js$/, '')
  if (only.length && !only.includes(slug)) continue
  checked++
  let g
  try {
    g = (await import(`${pathToFileURL(path.join(DIR, file)).href}?t=${Date.now()}`)).default
  } catch (e) {
    err(slug, `does not load: ${e.message.split('\n')[0]}`)
    continue
  }
  if (!g || typeof g !== 'object') {
    err(slug, 'file has no default export')
    continue
  }
  const hi = g.lang === 'hi'

  if (g.slug !== slug) err(slug, `slug field "${g.slug}" must equal the file name`)
  for (const k of ['title', 'seoTitle', 'description', 'excerpt', 'category', 'heroImage', 'heroAlt', 'published', 'updated']) if (!g[k]) err(slug, `missing ${k}`)
  if (!CATEGORIES.includes(g.category)) err(slug, `category "${g.category}" must be one of: ${CATEGORIES.join(' | ')}`)
  if (g.seoTitle && g.seoTitle.length > 48) err(slug, `seoTitle is ${g.seoTitle.length} characters; max 48 (the site adds " | Gawri Ganga")`)
  if (g.description && (g.description.length < 120 || g.description.length > 160)) err(slug, `description is ${g.description.length} characters; use 120 to 160`)
  if (g.heroImage && !g.heroImage.startsWith('https://ggimg-images.s3.ap-south-1.amazonaws.com/')) err(slug, 'heroImage must be an image URL from the product table')
  if (!Number.isFinite(g.readMinutes)) err(slug, 'readMinutes must be a number')
  if (!g.keywords?.primary || (g.keywords?.secondary || []).length < 4) err(slug, 'keywords needs { primary, secondary: [4 or more] }')
  if (!(g.sections || []).length || g.sections.length < 5) err(slug, 'needs at least 5 sections')
  if ((g.sections || []).some((s) => !s.h2)) err(slug, 'every section needs an h2')
  for (const s of g.sections || []) {
    if (s.body !== undefined && !Array.isArray(s.body)) err(slug, `section "${s.h2}": body must be an array`)
    for (const sub of s.subs || []) {
      if (!sub || typeof sub !== 'object' || !sub.h3 || !Array.isArray(sub.body)) err(slug, `section "${s.h2}": every item in subs must be { h3, body: [...] } (found ${typeof sub === 'string' ? `text "${sub.slice(0, 40)}..."` : 'an invalid item'})`)
    }
  }
  if (!g.midCta?.to || !g.midCta?.label) err(slug, 'midCta needs title, text, label and to')
  const faqs = g.faqs || []
  if (faqs.length < 6 || faqs.length > 9) err(slug, `needs 6 to 9 FAQs (has ${faqs.length})`)
  if (faqs.some((f) => !f.q || !f.a)) err(slug, 'every FAQ needs q and a')
  // FAQ text is shown and sent to Google as plain text, so no markdown links, bold or price tokens in it.
  for (const f of faqs) if (/\]\(|\*\*|\{\{/.test(`${f.q} ${f.a}`)) err(slug, `FAQ has markdown or a token (plain text only): "${String(f.q).slice(0, 60)}"`)

  const raw = visibleText(g)
  const words = clean(raw).split(/\s+/).filter(Boolean).length
  const min = hi ? 700 : 1100
  if (words < min) err(slug, `only ${words} visible words; need at least ${min}`)
  if (words > 2600) warn(slug, `${words} words is very long; check for padding`)

  // Links: every markdown link, midCta, related pages
  const links = [...raw.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1])
  links.push(g.midCta?.to, ...(g.related?.pages || []).map((p) => p.to))
  for (const l of links.filter(Boolean)) {
    const p = l.split(/[?#]/)[0].replace(/\/$/, '') || '/'
    const ok =
      STATIC_PATHS.has(p) ||
      SPRAY_PAGES.includes(p) ||
      (p.startsWith('/product/') && products.has(p.slice(9))) ||
      (p.startsWith('/guides/') && guideSlugs.has(p.slice(8))) ||
      (p.startsWith('/rashi/') && RASHI_SLUGS.includes(p.slice(7)))
    if (!ok) err(slug, `link to ${l} does not exist`)
    if (p.startsWith('/blog/')) err(slug, `${l}: guides live at /guides/, not /blog/`)
  }
  const unique = new Set(links.map((l) => l.split(/[?#]/)[0]))
  if (unique.size < 6) err(slug, `only ${unique.size} different internal links; use at least 6 (products, category pages, other guides)`)
  if (![...unique].some((l) => l.startsWith('/product/'))) err(slug, 'link to at least one product page')
  if (![...unique].some((l) => l.startsWith('/guides/'))) err(slug, 'link to at least one other guide')
  for (const s of g.related?.productSlugs || []) if (!products.has(s)) err(slug, `related product "${s}" does not exist`)
  for (const t of raw.matchAll(/\{\{(?:price|amount):([a-z0-9-]+)\}\}/g)) if (!products.has(t[1])) err(slug, `price token for unknown product "${t[1]}"`)

  // Claims and filler
  for (const [re, label] of BANNED) {
    const m = raw.match(re)
    if (m) err(slug, `${label}: "${m[0]}"`)
  }
  for (const m of raw.matchAll(/guarantee[sd]?/gi)) {
    const around = raw.slice(Math.max(0, m.index - 60), m.index + 12)
    if (!NEGATED_GUARANTEE.test(around)) err(slug, `"guarantee" without a negation near: "...${around.replace(/\n/g, ' ').trim()}"`)
  }
  if (/[—–]/.test(raw)) warn(slug, 'contains em/en dashes; prefer commas, colons or full stops')

  for (const s of clean(raw).split(/(?<=[.!?।])\s+/)) {
    const t = s.trim().toLowerCase()
    if (t.length >= 70) (sentences.get(t) || sentences.set(t, new Set()).get(t)).add(slug)
  }
}

if (!only.length) {
  for (const [s, slugs] of sentences) if (slugs.size > 1) warn([...slugs].join(' + '), `repeated sentence: "${s.slice(0, 90)}..."`)
}

console.log(`Checked ${checked} guide${checked === 1 ? '' : 's'}.`)
if (warnings.length) console.log(`\nWarnings (${warnings.length}):\n  ${warnings.join('\n  ')}`)
if (errors.length) {
  console.log(`\nErrors (${errors.length}):\n  ${errors.join('\n  ')}`)
  process.exit(1)
}
console.log('\nAll checks passed.')
