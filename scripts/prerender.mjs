/**
 * Post-build step (runs after `vite build`): writes route-specific HTML for every public page,
 * plus sitemap.xml, robots.txt, _redirects and _headers.
 *
 * Why: the site is a client-side React app, so every URL used to return the same HTML shell with the
 * home page's title and canonical. Google, Bing, WhatsApp and Facebook saw every page as the home page.
 * For each route this writes dist/<route>.html with that page's own title, description, canonical,
 * Open Graph tags and JSON-LD, and a plain HTML version of the page inside #root (H1, text, links).
 * React replaces it as soon as the app loads (createRoot), so visitors get the normal app.
 *
 * Cloudflare serves dist/<route>.html at /<route>. URLs with no file get dist/404.html with status 404
 * (wrangler.jsonc: not_found_handling "404-page"). That file is the normal app shell, so account pages
 * such as /orders/123, and products added after the last build, still work in the browser.
 *
 * Data comes from the live API (PRERENDER_API_URL, default https://api.gawriganga.com). If products
 * cannot be loaded the build fails, so a bad build never replaces the live site with empty pages.
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = path.resolve('.')
const DIST = fs.existsSync(path.join(ROOT, 'dist', 'client', 'index.html')) ? path.join(ROOT, 'dist', 'client') : path.join(ROOT, 'dist')
const API = (process.env.PRERENDER_API_URL || 'https://api.gawriganga.com').replace(/\/$/, '')
const BUILD_DATE = new Date().toISOString().slice(0, 10)

const load = (rel) => import(pathToFileURL(path.join(ROOT, rel)).href)
const meta = await load('src/seo/meta.js')
const site = await load('src/config/site.js')
const { mukhiInfo, mukhiFaqs, mukhiRashi } = await load('src/content/mukhi.js')
const { GUIDES, GUIDE_REDIRECTS, GUIDE_TOPICS, guideText, relatedCards } = await load('src/content/guides/index.js')
const { RASHIS, rashiMukhis, rashiPageMeta, rashiFaqs } = await load('src/content/rashi.js')
const { CATEGORY_FAQS } = await load('src/content/categoryFaqs.js')
const { MOVED_POSTS, blogFaqs } = await load('src/content/blog.js')
// FAQs shown at the end of each static page (same lists as the React pages).
const PAGE_FAQS = { '/rudraksha': CATEGORY_FAQS.rudraksha, '/tulsimala': CATEGORY_FAQS.tulsi, '/accessories': CATEGORY_FAQS.accessories, '/combos': CATEGORY_FAQS.combos, '/sprays': CATEGORY_FAQS.sprays, '/rashi': CATEGORY_FAQS.rashi }
const { SHOP_COLLECTIONS } = await load('src/content/shopCollections.js')

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const text = (s = '') =>
  String(s)
    .replace(/<(style|script|head|title)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

async function getJson(apiPath) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(`${API}${apiPath}`, { signal: AbortSignal.timeout(20000) })
      if (r.ok) return await r.json()
    } catch {
      /* retry */
    }
  }
  return null
}

// ---------- data ----------
const CATEGORIES = [
  ['Rudraksha', '/rudraksha'],
  ['Tulsi Mala', '/tulsimala'],
  ['Accessories', '/accessories'],
  ['Combos', '/combos'],
  ['Sprays', '/sprays'],
]
const products = new Map()
const byCategoryPath = {}
for (const [cat, route] of CATEGORIES) {
  const j = await getJson(`/api/products?category=${encodeURIComponent(cat)}&limit=200`)
  byCategoryPath[route] = j?.data || []
  for (const p of byCategoryPath[route]) products.set(p.slug, { ...p, category: cat })
}
const all = await getJson('/api/products?limit=200')
for (const p of all?.data || []) if (!products.has(p.slug)) products.set(p.slug, p)
if (products.size < 10) throw new Error(`prerender: only ${products.size} products loaded from ${API}; refusing to publish empty product pages`)

// PRERENDER_DRAFTS=1 builds unpublished posts too, to audit them before they go live. Never use it for a deploy build.
const withDrafts = process.env.PRERENDER_DRAFTS === '1'
const blogJson = await getJson(`/api/blogs${withDrafts ? '?include_drafts=true' : ''}`)
const posts = (blogJson?.data || []).filter((b) => b.slug && (withDrafts || b.is_published !== false) && !MOVED_POSTS[b.slug.toLowerCase()])
const charges = await getJson('/api/delivery-charges')
const shippingAmount = (charges?.data || []).find((r) => String(r.payment_type).toLowerCase() === 'prepaid')?.amount ?? null

// ---------- html ----------
const NAV = [
  ['/rudraksha', 'Rudraksha'],
  ['/shop/karungali-mala', 'Karungali Mala'],
  ['/tulsimala', 'Tulsi Mala'],
  ['/accessories', 'Bracelets'],
  ['/combos', 'Combos'],
  ['/sprays', 'Sprays'],
  ['/rashi', 'Rudraksha by Rashi'],
  ['/guides', 'Guides'],
  ['/blog', 'Blog'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
]
const link = (to, label) => `<a href="${to}">${esc(label)}</a>`
const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`
const productHref = (p) => meta.SPRAY_PAGES[p.slug] || `/product/${p.slug}`
const productLinks = (arr) => list(arr.map((p) => `${link(productHref(p), meta.cleanName(p.name))} – ₹${Number(p.price).toLocaleString('en-IN')}`))
const faqHtml = (faqs = []) =>
  faqs.length ? `<h2>Frequently asked questions</h2>${faqs.map((f) => `<h3>${esc(f.q || f.question)}</h3><p>${esc(f.a || f.answer)}</p>`).join('')}` : ''
const crumbHtml = (items) =>
  `<nav aria-label="Breadcrumb"><p>${items.map((c, i) => (i < items.length - 1 ? link(c.path, c.name) : esc(c.name))).join(' / ')}</p></nav>`

const shell = (inner) => `<div style="max-width:960px;margin:0 auto;padding:24px 16px;font-family:Georgia,serif;color:#1c1917;line-height:1.6;background:#fffaeb">
<header><nav aria-label="Main">${list(NAV.map(([h, l]) => link(h, l)))}</nav></header>
<main>${inner}</main>
<footer><p>${esc(site.BRAND)} · ${esc(site.ADDRESS.full)} · ${esc(site.EMAIL)} · WhatsApp +${site.WHATSAPP_NUMBER}</p></footer></div>`

function headTags({ title, description, path: p, canonicalPath, image, type, noindex, jsonLd = [] }) {
  const canonical = meta.absUrl(canonicalPath || p)
  const img = meta.absUrl(image || site.OG_IMAGE)
  const ogType = type === 'product' ? 'product' : type === 'article' ? 'article' : 'website'
  // data-prerender: src/main.jsx removes these when the app starts; RouteSeo then renders the live set.
  return [
    `<title data-prerender>${esc(title)}</title>`,
    `<meta data-prerender name="description" content="${esc(description)}" />`,
    `<meta data-prerender name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
    noindex ? '' : `<link data-prerender rel="canonical" href="${canonical}" />`,
    `<meta data-prerender property="og:type" content="${ogType}" />`,
    `<meta data-prerender property="og:url" content="${canonical}" />`,
    `<meta data-prerender property="og:title" content="${esc(title)}" />`,
    `<meta data-prerender property="og:description" content="${esc(description)}" />`,
    `<meta data-prerender property="og:image" content="${esc(img)}" />`,
    '<meta data-prerender property="og:site_name" content="Gawri Ganga" />',
    '<meta data-prerender property="og:locale" content="en_IN" />',
    '<meta data-prerender name="twitter:card" content="summary_large_image" />',
    `<meta data-prerender name="twitter:title" content="${esc(title)}" />`,
    `<meta data-prerender name="twitter:description" content="${esc(description)}" />`,
    `<meta data-prerender name="twitter:image" content="${esc(img)}" />`,
    ...jsonLd.filter(Boolean).map((b) => `<script data-prerender type="application/ld+json">${JSON.stringify(b).replace(/</g, '\\u003c')}</script>`),
  ]
    .filter(Boolean)
    .join('\n    ')
}

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
const base = template.replace(/\s*<title>[\s\S]*?<\/title>/i, '')
if (!base.includes('<div id="root"></div>')) throw new Error('prerender: <div id="root"></div> not found in dist/index.html')

const sitemap = []
function emit(routePath, page, body = '') {
  // Hindi guides declare their language so search engines and screen readers treat the page as Hindi.
  const doc = page.lang === 'hi' ? base.replace('<html lang="en-IN">', '<html lang="hi-IN">') : base
  const html = doc
    .replace('</head>', `    ${headTags({ ...page, path: routePath })}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body ? shell(body) : ''}</div>`)
  const file = routePath === '/' ? path.join(DIST, 'index.html') : path.join(DIST, `${routePath.slice(1)}.html`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)
  if (!page.noindex && !page.canonicalPath) sitemap.push({ path: routePath, lastmod: page.lastmod || BUILD_DATE, priority: page.priority ?? 0.5 })
}

const crumbs = (...items) => [{ name: 'Home', path: '/' }, ...items]
const page = (m, extra = {}) => ({ title: m.title, description: m.description, type: m.type, ...extra })

// ---------- static and category pages ----------
const PRIORITY = { '/': 1, '/rudraksha': 0.9, '/tulsimala': 0.8, '/accessories': 0.8, '/combos': 0.7, '/sprays': 0.7, '/rashi': 0.7, '/guides': 0.8, '/blog': 0.6 }
const mukhiProducts = (byCategoryPath['/rudraksha'] || []).filter((p) => meta.productKind(p) === 'mukhi')

for (const [p, m] of Object.entries(meta.STATIC_META)) {
  if (m.noindex) {
    emit(p, page(m, { noindex: true }))
    continue
  }
  const items = byCategoryPath[p] || []
  const jsonLd = []
  let inner = `<h1>${esc(m.h1 || m.title)}</h1><p>${esc(m.description)}</p>`
  if (p === '/') {
    jsonLd.push(meta.organizationJsonLd(), meta.websiteJsonLd())
    inner += `<h2>Shop by mukhi</h2>${productLinks(mukhiProducts)}<h2>Shop by category</h2>${list(NAV.slice(0, 6).map(([h, l]) => link(h, l)))}`
    inner += `<h2>Guides</h2>${list(GUIDES.filter((g) => g.lang !== "hi").slice(0, 8).map((g) => link(`/guides/${g.slug}`, g.title)))}<p>${link("/guides", "All guides")}</p>`
  }
  if (items.length) {
    jsonLd.push(meta.itemListJsonLd(items, m.h1))
    inner += `<h2>Products</h2>${productLinks(items)}`
  }
  if (p === '/rudraksha') {
    const rows = mukhiProducts
      .map((x) => ({ x, mk: mukhiInfo(meta.cleanName(x.name)) }))
      .filter((r) => r.mk)
      .sort((a, b) => a.mk.number - b.mk.number)
    inner += `<h2>Rudraksha by mukhi: deity, planet and price</h2>${list(
      rows.map(({ x, mk }) => `${link(productHref(x), `${mk.number} Mukhi`)}: ${esc(mk.deity)}, ${esc(mk.planet)}, ₹${Number(x.price).toLocaleString('en-IN')}`),
    )}`
  }
  if (p === '/rashi') inner += `<h2>Rudraksha for your rashi</h2>${list(RASHIS.map((r) => link(`/rashi/${r.slug}`, `${r.name} (${r.hindi}) · ${r.english}`)))}`
  if (p === '/guides') {
    // Every guide, grouped by topic, so all guide links are in the page for crawlers.
    for (const topic of GUIDE_TOPICS) {
      const inTopic = GUIDES.filter((g) => g.category === topic.key && g.lang !== 'hi')
      if (inTopic.length) inner += `<h2>${esc(topic.key)}</h2><p>${esc(topic.blurb)}</p>${list(inTopic.map((g) => `${link(`/guides/${g.slug}`, g.title)}: ${esc(g.excerpt)}`))}`
    }
    const hindi = GUIDES.filter((g) => g.lang === 'hi')
    if (hindi.length) inner += `<h2>हिंदी गाइड</h2>${list(hindi.map((g) => `${link(`/guides/${g.slug}`, g.title)}: ${esc(g.excerpt)}`))}`
    inner += `<p>${link('/blog', 'Blog: festivals, rituals and spiritual living')}</p>`
  }
  if (p === '/blog') {
    inner += `<h2>Posts</h2>${list(posts.map((b) => `${link(`/blog/${b.slug}`, meta.blogPostMeta(b).h1)}${b.excerpt ? `: ${esc(b.excerpt)}` : ''}`))}<p>${link('/guides', 'Read our guides')}</p>`
  }
  if (p === '/about') {
    inner += `<h2>Since ${site.FOUNDED_YEAR}</h2><p>Gawri Ganga is a family business from Noida that has served devotees since ${site.FOUNDED_YEAR}. Every bead is tested by the Kailasa Rudraksha and Gemological Lab and the Rudraksha and Gems Testing Lab, both ISO-certified, and the lab certificate comes with your order.</p>`
    inner += `<h2>Shopping with us</h2>${list([
      'Cash on delivery for most pin codes, with a ₹100 advance adjusted at delivery.',
      `Returns within 2 days of delivery for damaged, defective or not-as-described items (${link('/refund-cancellation', 'returns policy')}).`,
      `Answers on WhatsApp, Monday to Saturday, or through our ${link('/contact', 'contact page')}.`,
    ])}<h2>Start here</h2>${list([link('/rudraksha', 'Rudraksha'), link('/tulsimala', 'Tulsi malas'), link('/guides/how-to-identify-original-rudraksha', 'How to identify an original Rudraksha'), link('/guides/rudraksha-lab-certificate-xray', 'What a Rudraksha lab certificate shows')])}`
  }
  // Spray pages are product pages with their own address: give crawlers the product text, price and FAQs.
  const spray = [...products.values()].find((x) => meta.SPRAY_PAGES[x.slug] === p)
  if (spray) {
    inner += `<p>Price: ₹${Number(spray.price).toLocaleString('en-IN')}</p>`
    if (spray.description) inner += `<h2>About this spray</h2><p>${esc(text(spray.description))}</p>`
    inner += `<p>${link('/sprays', 'All aura sprays')} · ${link('/guides/smoke-free-aura-cleansing-sprays', 'Guide: smoke-free aura cleansing sprays')}</p>`
    inner += faqHtml(CATEGORY_FAQS.sprays)
    jsonLd.push(meta.productJsonLd(spray, { shippingAmount }), meta.faqJsonLd(CATEGORY_FAQS.sprays))
  }
  if (PAGE_FAQS[p]) {
    inner += faqHtml(PAGE_FAQS[p])
    jsonLd.push(meta.faqJsonLd(PAGE_FAQS[p]))
  }
  if (p !== '/') jsonLd.push(meta.breadcrumbJsonLd(crumbs({ name: m.h1 || m.title, path: p })))
  emit(p, page(m, { jsonLd, priority: PRIORITY[p] ?? 0.4 }), inner)
}

// ---------- /shop collections ----------
for (const c of SHOP_COLLECTIONS) {
  const m = meta.collectionMeta(c.slug)
  const items = [...products.values()].filter((p) =>
    c.test ? c.test(p) : (Array.isArray(p.purposes) ? p.purposes : String(p.purposes || '').split(',')).some((x) => String(x).trim().toLowerCase() === String(c.purpose).toLowerCase()),
  )
  const route = `/shop/${c.slug}`
  const inner = `${crumbHtml(crumbs({ name: m.h1, path: route }))}<h1>${esc(m.h1)}</h1><p>${esc(m.description)}</p>${items.length ? `<h2>Products</h2>${productLinks(items)}` : ''}${(c.sections || []).map((x) => `<h2>${esc(x.heading)}</h2><p>${esc(x.body)}</p>`).join('')}${faqHtml(c.faqs || CATEGORY_FAQS.general)}`
  emit(route, page(m, { jsonLd: [meta.itemListJsonLd(items, m.h1), meta.breadcrumbJsonLd(crumbs({ name: m.h1, path: route })), meta.faqJsonLd(c.faqs || CATEGORY_FAQS.general)], priority: c.slug === 'karungali-mala' ? 0.8 : 0.5 }), inner)
}

// ---------- products ----------
for (const p of products.values()) {
  const pm = meta.productMeta(p)
  const name = meta.cleanName(p.name)
  const cat = meta.productCategory(p)
  const mk = meta.productKind(p) === 'mukhi' ? mukhiInfo(name) : null
  const faqs = mk ? mukhiFaqs(mk.number, { returnDays: site.RETURN_WINDOW_DAYS, labLine: site.LAB_LINE }) : []
  const route = `/product/${p.slug}`
  const trail = crumbs(cat, { name, path: pm.canonicalPath })
  let inner = `${crumbHtml(trail)}<h1>${esc(pm.h1)}</h1><p>₹${Number(p.price).toLocaleString('en-IN')} · ${Number(p.stock) > 0 ? 'In stock' : 'Out of stock'} · Cash on delivery available</p>`
  if (p.short_description) inner += `<p>${esc(text(p.short_description))}</p>`
  if (mk) {
    const rashi = mukhiRashi(mk.number)
    inner += `<h2>${esc(name)} facts</h2>${list([
      `Mukhi: ${mk.number}`,
      'Origin: Nepal',
      `Deity: ${esc(mk.deity)}`,
      `Planet: ${esc(mk.planet)}`,
      rashi.length ? `Rashi: ${esc(rashi.join(', '))}` : '',
      `Beej mantra: ${esc(mk.mantra)}`,
    ].filter(Boolean))}<p>${esc(mk.tradition)}</p>`
  }
  if (p.description) inner += `<h2>About this product</h2><p>${esc(text(p.description))}</p>`
  inner += faqHtml(faqs)
  inner += `<p>${link(cat.path, `More ${cat.name}`)} · ${link('/guides', 'Guides')}</p>`
  const images = (p.images || []).filter(Boolean)
  emit(
    route,
    page(pm, {
      // Spray products live at /sprays/<name>; this URL points there and stays out of the sitemap.
      canonicalPath: pm.canonicalPath !== route ? pm.canonicalPath : undefined,
      image: images[0],
      jsonLd: [meta.productJsonLd(p, { shippingAmount }), meta.breadcrumbJsonLd(trail), meta.faqJsonLd(faqs)],
      priority: mk ? 0.8 : 0.7,
    }),
    inner,
  )
}

// ---------- guides and blog posts ----------
// Guides (src/content/guides) at /guides/<slug>, with live prices written into the text.
const priceOf = (slug) => (products.get(slug) ? `₹${Number(products.get(slug).price).toLocaleString('en-IN')}` : '')
const gtext = (s) => esc(guideText(s, priceOf))
const guideBlock = (b) =>
  typeof b === 'string'
    ? `<p>${gtext(b)}</p>`
    : b?.ul
      ? list(b.ul.map(gtext))
      : b?.table
        ? `<table><thead><tr>${b.table.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.table.rows
            .map((r) => `<tr>${r.map((c) => `<td>${gtext(c)}</td>`).join('')}</tr>`)
            .join('')}</tbody></table>`
        : ''
for (const g of GUIDES) {
  const route = `/guides/${g.slug}`
  const trail = crumbs({ name: 'Guides', path: '/guides' }, { name: g.title, path: route })
  const sections = g.sections
    .map((s) => `<h2>${esc(s.h2)}</h2>${(s.body || []).map(guideBlock).join('')}${(s.subs || []).filter((sub) => sub && typeof sub === 'object').map((sub) => `<h3>${esc(sub.h3)}</h3>${(sub.body || []).map(guideBlock).join('')}`).join('')}`)
    .join('')
  const shop = [...new Set([...(g.related?.productSlugs || []), ...[...JSON.stringify(g.sections).matchAll(/\/product\/([a-z0-9-]+)/g)].map((m) => m[1])])].filter((x) => products.has(x)).slice(0, 6)
  const shopHtml = shop.length ? `<h2>Products in this guide</h2>${list(shop.map((x) => `${link(`/product/${x}`, meta.cleanName(products.get(x).name))} ${priceOf(x)}`))}` : ''
  const inner = `${crumbHtml(trail)}<h1>${esc(g.title)}</h1><p>${esc(g.excerpt)}</p>${sections}${faqHtml(g.faqs)}${shopHtml}<h2>Keep reading</h2>${list(relatedCards(g.slug, 3).map((r) => link(`/guides/${r.slug}`, r.title)))}${list((g.related?.pages || []).map((p) => link(p.to, p.label)))}`
  emit(
    route,
    page(
      meta.guidePageMeta(g),
      {
        lang: g.lang,
        image: g.heroImage,
        lastmod: g.updated || g.published,
        jsonLd: [
          meta.articleJsonLd({ path: route, title: g.title, description: g.description, image: g.heroImage, published: g.published, updated: g.updated }),
          meta.breadcrumbJsonLd(trail),
          meta.faqJsonLd(g.faqs || []),
        ],
        priority: 0.8,
      },
    ),
    inner,
  )
}
const guideSlugs = new Set(GUIDES.map((g) => g.slug))

for (const b of posts) {
  if (guideSlugs.has(b.slug)) continue
  const bm = meta.blogPostMeta(b)
  const route = `/blog/${b.slug}`
  const trail = crumbs({ name: 'Blog', path: '/blog' }, { name: bm.h1, path: route })
  const clean = String(b.html_content || '')
    .replace(/<(style|script|head|title|iframe|object|embed)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/?(html|body|meta|link|base|img)[^>]*>/gi, ' ')
    .replace(/\s(style|class|on\w+)="[^"]*"/gi, '')
    .replace(/<(\/?)h1\b/gi, '<$1h2')
  const postShop = [...new Set([...`${b.primary_link_url || ''} ${clean}`.matchAll(/\/product\/([a-z0-9-]+)/g)].map((m) => m[1]))].filter((x) => products.has(x)).slice(0, 6)
  const postShopHtml = postShop.length ? `<h2>Products in this post</h2>${list(postShop.map((x) => `${link(`/product/${x}`, meta.cleanName(products.get(x).name))} ${priceOf(x)}`))}` : ''
  const updated = (b.updated_at || b.published_at || BUILD_DATE).slice(0, 10)
  const inner = `${crumbHtml(trail)}<h1>${esc(bm.h1)}</h1>${b.excerpt ? `<p>${esc(b.excerpt)}</p>` : ''}${clean}${postShopHtml}<p>${link('/blog', 'More posts')} · ${link('/guides', 'Guides')}</p>`
  emit(
    route,
    page(bm, {
      image: b.header_image_url || b.hero_image_url,
      lastmod: updated,
      jsonLd: [
        meta.articleJsonLd({ path: route, title: bm.h1, description: bm.description, image: b.header_image_url || b.hero_image_url, published: b.published_at || b.created_at, updated: b.updated_at }),
        meta.breadcrumbJsonLd(trail),
        meta.faqJsonLd(blogFaqs(clean)),
      ],
      priority: 0.6,
    }),
    inner,
  )
}

// ---------- rashi landing pages ----------
for (const r of RASHIS) {
  const m = rashiPageMeta(r)
  const route = `/rashi/${r.slug}`
  const trail = crumbs({ name: 'Rudraksha by rashi', path: '/rashi' }, { name: `${r.name} rashi`, path: route })
  const nums = rashiMukhis(r.value).map((x) => Number.parseInt(x, 10))
  const items = (byCategoryPath['/rudraksha'] || []).filter((p) => meta.productKind(p) === 'mukhi' && nums.includes(mukhiInfo(meta.cleanName(p.name))?.number))
  const faqs = rashiFaqs(r)
  const inner = `${crumbHtml(trail)}<h1>${esc(m.h1)}</h1><p>${esc(m.description)}</p><h2>Rudraksha traditionally suggested for ${esc(r.name)}</h2>${list(
    nums.map((n) => { const k = mukhiInfo(n); return `${n} Mukhi: ${esc(k.deity)}, ${esc(k.planet)}, mantra ${esc(k.mantra)}` }),
  )}${items.length ? `<h2>Shop Rudraksha for ${esc(r.name)} rashi</h2>${productLinks(items)}` : ''}${faqHtml(faqs)}${list(RASHIS.filter((x) => x !== r).map((x) => link(`/rashi/${x.slug}`, `Rudraksha for ${x.name} rashi`)))}`
  emit(route, page(m, { jsonLd: [meta.itemListJsonLd(items, m.h1), meta.breadcrumbJsonLd(trail), meta.faqJsonLd(faqs)], priority: 0.6 }), inner)
}

// ---------- 404 (also the app shell for /orders/<id> and products added after this build) ----------
emit('/404', page(meta.NOT_FOUND_META, { noindex: true }))

// ---------- sitemap, robots, redirects, headers ----------
const seen = new Set()
const urls = sitemap.filter((u) => (seen.has(u.path) ? false : seen.add(u.path)))
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${meta.absUrl(u.path)}</loc><lastmod>${u.lastmod}</lastmod><priority>${Number(u.priority).toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`,
)

fs.writeFileSync(
  path.join(DIST, 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /cart
Disallow: /wishlist
Disallow: /profile
Disallow: /orders/
Disallow: /order-success
Disallow: /order-failed
Disallow: /login
Disallow: /auth

Sitemap: ${site.SITE_URL}/sitemap.xml
# LLM site guide: ${site.SITE_URL}/llms.txt
`,
)

fs.writeFileSync(
  path.join(DIST, '_redirects'),
  `/blogs /blog 301
/blogs/* /blog/:splat 301
/return-policy /refund-cancellation 301
/sprays/amrat-dhara /sprays/amrat-bindu 301
/signup /login 302
/json.html / 301
${Object.entries(GUIDE_REDIRECTS).map(([from, to]) => `/guides/${from} /guides/${to} 301`).join('\n')}
${Object.entries(MOVED_POSTS).map(([from, to]) => `/blog/${from} ${to} 301`).join('\n')}
`,
)

fs.writeFileSync(
  path.join(DIST, '_headers'),
  `/assets/*
  Cache-Control: public, max-age=31536000, immutable
`,
)

for (const stale of ['json.html']) fs.rmSync(path.join(DIST, stale), { force: true })

console.log(
  `prerender: ${urls.length} URLs in sitemap · ${products.size} products · ${GUIDES.length} long guides · ${posts.length} blog posts · shipping ${shippingAmount ?? 'unknown'} · out: ${path.relative(ROOT, DIST)}`,
)
