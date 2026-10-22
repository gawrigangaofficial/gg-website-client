import { writeFileSync } from 'node:fs'
import { SEO_GUIDES } from '../src/content/seoGuides.js'
import { SHOP_COLLECTIONS } from '../src/content/shopCollections.js'

const products = [
  '1-mukhi-rudraksha',
  '2-mukhi-rudraksha',
  '3-mukhi-rudraksha',
  '4-mukhi-rudraksha',
  '5-mukhi-rudraksha',
  '6-mukhi-rudraksha',
  '7-mukhi-rudraksha',
  '8-mukhi-rudaksha',
  '9-mukhi-rudraksha',
  '10-mukhi-rudraksha',
  '11-mukhi-rudraksha',
  '12-mukhi-rudraksha',
  '13-mukhi-rudraksha',
  '14-mukhi-rudraksha',
  'karungli-mala',
  'original-thick-tulsi-kanthi-mala',
  'original-tulsi-kanthi-mala',
  'rudraksha-mala',
  'sacred-radhe-engraved-tulsi-mala',
  'sacred-rudraksha-japa-mala',
  'shiva-bracelet',
  'shri-radha-tulsi-mala-pendant',
  'sitaram-hanumanji-tulsi-necklace',
  'tulsi-bead-mala',
]

const blogs = ['7-mukhi-rudraksha-blog', 'amrat-bindu-blog', 'gawri-ganga-blog']

const paths = [
  '/',
  '/sprays',
  '/rudraksha',
  '/tulsimala',
  '/rashi',
  '/accessories',
  '/purpose-products',
  '/about',
  '/blog',
  '/contact',
  '/combos',
  '/corporate-bulk-orders',
  '/sprays/amrat-bindu',
  '/sprays/maitri',
  '/sprays/chakra-balance',
  '/sprays/shuddhi',
  '/terms-of-service',
  '/refund-cancellation',
  '/return-policy',
  '/terms-and-conditions',
  '/shipping-policy',
  '/privacy-policy',
  '/faq',
  ...SHOP_COLLECTIONS.map((item) => `/shop/${item.slug}`),
  '/json.html',
  ...blogs.map((slug) => `/blog/${slug}`),
  ...SEO_GUIDES.map((guide) => `/guides/${guide.slug}`),
  ...products.map((slug) => `/product/${slug}`),
]

const unique = [...new Set(paths)]
const body = unique
  .map(
    (path) =>
      `  <url><loc>https://www.gawriganga.com${path === '/' ? '/' : path}</loc><changefreq>weekly</changefreq></url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)
console.log(`sitemap urls: ${unique.length}`)
