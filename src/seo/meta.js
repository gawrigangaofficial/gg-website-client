/**
 * Single source of truth for page titles, descriptions, canonicals and structured data.
 * Used by RouteSeo / ProductPage in the browser and by scripts/prerender.mjs at build time,
 * so it must stay plain JavaScript: no JSX, no asset imports, no bare import.meta.env.
 *
 * Titles: 50–60 characters, the searched phrase first, "| Gawri Ganga" last.
 * Descriptions: 140–160 characters, keyword early, then a fact, then COD.
 * Keyword targets come from the October 2026 keyword research (one primary keyword per page).
 */
import {
  SITE_URL,
  BRAND,
  LEGAL_ENTITY,
  ADDRESS,
  EMAIL,
  WHATSAPP_NUMBER,
  SOCIAL,
  RETURN_WINDOW_DAYS,
  HANDLING_DAYS,
  TRANSIT_DAYS,
  OG_IMAGE,
  FOUNDED_YEAR,
} from '../config/site.js'
import { mukhiInfo } from '../content/mukhi.js'
import { getRashi, rashiPageMeta } from '../content/rashi.js'
import { getShopCollection } from '../content/shopCollections.js'

export const SUFFIX = ` | ${BRAND}`
export const absUrl = (path = '/') => (String(path).startsWith('http') ? path : `${SITE_URL}${path === '/' ? '/' : path}`)

/** Product names in the database carry typos and stray characters; fix them for titles, H1s and schema. */
export function cleanName(name = '') {
  return String(name)
    .split('|')[0]
    .replace(/[“”"]/g, '')
    .replace(/\bRudaksha\b/gi, 'Rudraksha')
    .replace(/\bBraclet\b/gi, 'Bracelet')
    .replace(/\bOrignal\b/gi, 'Original')
    .replace(/\bKarungli\b/gi, 'Karungali')
    .replace(/\bBeed\b/gi, 'Bead')
    .replace(/\brudraksha\b/g, 'Rudraksha')
    .replace(/\s+/g, ' ')
    .trim()
}

function clip(text, max = 160) {
  const s = String(text).replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  const cut = s.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

/** Static routes. `noindex` pages stay out of search and the sitemap. */
export const STATIC_META = {
  '/': {
    title: 'Original Nepali Rudraksha Online, 1 to 14 Mukhi | Gawri Ganga',
    description:
      'Buy original Nepali Rudraksha, 1 to 14 Mukhi, with an authenticity certificate. Plus Karungali and Tulsi malas, Rudraksha bracelets and COD across India.',
    h1: 'Original Nepali Rudraksha, with a certificate for every bead',
  },
  '/rudraksha': {
    title: 'Buy Original Rudraksha Online, 1 to 14 Mukhi | Gawri Ganga',
    description:
      'Original Nepali Rudraksha from 1 to 14 Mukhi, plus Rudraksha malas. Every bead comes with an authenticity certificate. Clear prices and COD across India.',
    h1: 'Original Nepali Rudraksha, 1 to 14 Mukhi',
  },
  '/tulsimala': {
    title: 'Tulsi Mala Original: Kanthi & Japa Mala Price | Gawri Ganga',
    description:
      'Original Tulsi kanthi malas, 108-bead Tulsi japa malas and Tulsi pendants for daily devotion. Natural Tulsi wood, honest prices and COD across India.',
    h1: 'Original Tulsi Mala: Kanthi and Japa Malas',
  },
  '/accessories': {
    title: 'Rudraksha Bracelets, Pyrite & Sphatik Malas | Gawri Ganga',
    description:
      'Rudraksha bracelets, natural pyrite and evil eye bracelets, Sphatik and Karungali japa malas. Natural materials, honest prices and COD across India.',
    h1: 'Rudraksha Bracelets, Pyrite and Sphatik',
  },
  '/sprays': {
    title: 'Pooja Room Spray & Space Cleansing Sprays | Gawri Ganga',
    description:
      'Smoke-free pooja room and space cleansing sprays: Shuddhi, Maitri, Chakra Balance and Amrat Bindu. For home, office and travel, with COD across India.',
    h1: 'Smoke-free Pooja Room and Space Sprays',
  },
  '/sprays/shuddhi': {
    title: 'Shuddhi Spray: Negative Energy Cleansing Spray | Gawri Ganga',
    description:
      'Shuddhi is a smoke-free space cleansing spray for the pooja room, home and office, when dhoop or sage smoke is not practical. How to use it, and COD.',
    h1: 'Shuddhi Space Cleansing Spray',
  },
  '/sprays/maitri': {
    title: 'Maitri Spray: Calming Pooja Room Spray | Gawri Ganga',
    description:
      'Maitri is a calming, smoke-free room spray for a warm, peaceful pooja room or home. How to use it, what it is made with, and COD across India.',
    h1: 'Maitri Calming Room Spray',
  },
  '/sprays/chakra-balance': {
    title: 'Chakra Balance Spray for Meditation & Yoga | Gawri Ganga',
    description:
      'Chakra Balance is a smoke-free spray to set a calm, centred mood before meditation, yoga or japa. How to use it, what it is made with, and COD.',
    h1: 'Chakra Balance Meditation Spray',
  },
  '/sprays/amrat-bindu': {
    title: 'Amrat Bindu Lavender Spray for Calm | Gawri Ganga',
    description:
      'Amrat Bindu is a smoke-free lavender room spray for a peaceful, uplifting space at home or work. How to use it, what it is made with, and COD.',
    h1: 'Amrat Bindu Lavender Room Spray',
  },
  '/combos': {
    title: 'Rudraksha Combo, Tulsi & Bracelet Combos | Gawri Ganga',
    description:
      'Rudraksha, Karungali, Tulsi and bracelet combos chosen to be worn together, at a better price than buying separately. COD and delivery across India.',
    h1: 'Rudraksha, Tulsi and Bracelet Combos',
  },
  '/rashi': {
    title: 'Rudraksha According to Rashi: Which Mukhi to Wear | Gawri Ganga',
    description:
      'Which Rudraksha suits your rashi? From Mesh to Meen, see the mukhi traditionally linked with your ruling planet, its mantra and how to wear it.',
    h1: 'Rudraksha According to Rashi',
  },
  '/purpose-products': {
    title: 'Best Rudraksha by Purpose: Peace, Career, Study | Gawri Ganga',
    description:
      'Shop Rudraksha, malas and bracelets by what you want them for: peace, career, study, protection or relationships. Simple guidance and COD across India.',
    h1: 'Rudraksha and Malas by Purpose',
  },
  '/faq': {
    title: 'Rudraksha FAQ: Original Beads, COD & Returns | Gawri Ganga',
    description:
      'Answers about original Nepali Rudraksha, Tulsi and Karungali malas, the authenticity certificate, cash on delivery, shipping and returns.',
    h1: 'Frequently asked questions',
  },
  '/about': {
    title: 'About Gawri Ganga: Nepali Rudraksha Store, Noida | Gawri Ganga',
    description:
      'Serving devotees since 1982: original Nepali Rudraksha, Tulsi and Karungali malas from Noida, lab-tested and shipped with a certificate across India.',
    h1: 'About Gawri Ganga',
  },
  '/guides': {
    title: 'Rudraksha Guides: Price, Rules & How to Wear | Gawri Ganga',
    description:
      'Product guides for Rudraksha, Karungali, Tulsi malas, bracelets and aura sprays: price, how to identify, which to choose, how to wear or use. English and Hindi.',
    h1: 'Product Guides: Rudraksha, Karungali, Tulsi and Sprays',
  },
  '/blog': {
    title: 'Blog: Festivals, Rituals & Spiritual Living | Gawri Ganga',
    description:
      'Festival dates, puja vidhi, traditions and gifting ideas from the Gawri Ganga family in Noida. Looking for product advice? See our guides.',
    h1: 'Gawri Ganga Blog',
  },
  '/contact': {
    title: 'Contact Gawri Ganga: WhatsApp, Email & Address | Gawri Ganga',
    description:
      'Questions about a bead, an order or a certificate? Contact Gawri Ganga on WhatsApp or by email. Store in Sector 27, Noida. Support Monday to Saturday.',
    h1: 'Contact Gawri Ganga',
  },
  '/corporate-bulk-orders': {
    title: 'Bulk Rudraksha & Corporate Gifting Orders | Gawri Ganga',
    description:
      'Bulk Rudraksha, Tulsi malas, sprays and gift sets for corporate gifting, temples, weddings and festivals. GST invoice and delivery across India.',
    h1: 'Corporate, wedding and festival gifting',
  },
  '/refund-cancellation': {
    title: 'Refund & Cancellation Policy | Gawri Ganga',
    description: `How to cancel an order, request a refund within ${RETURN_WINDOW_DAYS} days of delivery, and how long refunds take to reach your original payment method.`,
    h1: 'Refund and cancellation policy',
  },
  '/shipping-policy': {
    title: 'Shipping Policy: Delivery Times in India | Gawri Ganga',
    description:
      'How Gawri Ganga ships across India: dispatch in 2 to 4 business days, delivery estimates by region, cash on delivery and order tracking.',
    h1: 'Shipping policy',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Gawri Ganga',
    description: 'How Gawri Ganga collects, uses and protects your personal data when you browse, order or contact us, and the rights you have over it.',
    h1: 'Privacy policy',
  },
  '/terms-of-service': {
    title: 'Terms of Service | Gawri Ganga',
    description: 'The terms that apply when you use the Gawri Ganga website, including accounts, acceptable use and limits of liability.',
    h1: 'Terms of service',
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions of Sale | Gawri Ganga',
    description: 'The conditions that apply to orders placed with Gawri Ganga: pricing, payment, delivery, cancellations and returns.',
    h1: 'Terms and conditions',
  },
  '/cart': { title: `Your Cart${SUFFIX}`, description: 'Review your cart and check out.', noindex: true },
  '/wishlist': { title: `Your Wishlist${SUFFIX}`, description: 'Your saved products.', noindex: true },
  '/profile': { title: `My Account${SUFFIX}`, description: 'Your account and orders.', noindex: true },
  '/login': { title: `Sign In${SUFFIX}`, description: 'Sign in with your mobile number and OTP.', noindex: true },
  '/order-success': { title: `Order Confirmed${SUFFIX}`, description: 'Thank you for your order.', noindex: true },
  '/order-failed': { title: `Payment Not Completed${SUFFIX}`, description: 'Your payment did not go through.', noindex: true },
}

export const NOT_FOUND_META = {
  title: `Page Not Found${SUFFIX}`,
  description: 'This page does not exist. Browse original Nepali Rudraksha, Tulsi and Karungali malas instead.',
  noindex: true,
}

/** /shop/:slug pages. Karungali is the primary page for "karungali mala original". */
const COLLECTION_META = {
  'karungali-mala': {
    title: 'Karungali Mala Original, 108 Beads: Price | Gawri Ganga',
    description:
      'Original Karungali (ebony wood) malas and japa malas, 108+1 beads. How to spot a fake, wearing rules for men and women, and COD across India.',
    h1: 'Original Karungali Mala',
  },
  pyrite: {
    title: 'Natural Pyrite Bracelet Original: Price | Gawri Ganga',
    description: 'Natural pyrite bracelets and pyrite combos, worn as a reminder around work and money. Honest prices, real stone, and COD across India.',
    h1: 'Natural Pyrite Bracelets',
  },
  'evil-eye': {
    title: 'Evil Eye Bracelet: Black Bead Nazar Bracelet | Gawri Ganga',
    description: 'Black bead evil eye (nazar) bracelets and combos, worn for a traditional sense of protection. Honest prices and COD across India.',
    h1: 'Evil Eye Bracelets',
  },
  sphatik: {
    title: 'Sphatik Mala Original & Sphatik Bracelet | Gawri Ganga',
    description: 'Sphatik (clear quartz) 108-bead diamond cut mala and Sphatik bracelet for japa and daily wear. Honest prices and COD across India.',
    h1: 'Sphatik Mala and Bracelet',
  },
  'japa-malas': {
    title: 'Japa Mala 108 Beads: Rudraksha, Tulsi, Karungali | Gawri Ganga',
    description: 'Japa malas with 108 beads in Rudraksha, Tulsi, Karungali and Sphatik for chanting and meditation. How to choose one, and COD across India.',
    h1: 'Japa Malas, 108 Beads',
  },
  'wealth-bracelets': {
    title: 'Money Magnet & Pyrite Bracelets | Gawri Ganga',
    description: 'Money magnet and pyrite bracelets for daily wear, traditionally kept as a reminder around work and money. Honest prices and COD across India.',
    h1: 'Bracelets for Wealth and Career',
  },
  pendants: {
    title: 'Rudraksha & Tulsi Pendant Malas | Gawri Ganga',
    description: 'Rudraksha malas with a Mahadev pendant and Tulsi malas with Radha and Sitaram pendants. Honest prices and COD across India.',
    h1: 'Rudraksha and Tulsi Pendants',
  },
  festivals: {
    title: 'Spiritual Gift Sets for Diwali & Weddings | Gawri Ganga',
    description: 'Rudraksha, Tulsi and bracelet gift sets for Diwali, Bhai Dooj, weddings and a home puja shelf. Bulk quotes for offices and events.',
    h1: 'Festival and Gift Sets',
  },
}

function collectionMeta(slug) {
  const c = getShopCollection(slug)
  if (!c) return null
  const m = COLLECTION_META[slug]
  if (m) return m
  return {
    title: `Rudraksha & Malas for ${c.title}${SUFFIX}`,
    description: clip(`Rudraksha, malas and bracelets traditionally worn for ${c.title.toLowerCase()}. ${c.description}`),
    h1: `Rudraksha and Malas for ${c.title}`,
  }
}

/** Meta for a guide object from src/content/guides. Used by the prerender and the guide page; takes the guide as an argument so the main bundle does not carry guide text. */
export function guidePageMeta(g) {
  return { title: `${g.seoTitle || g.title}${SUFFIX}`, description: clip(g.description), h1: g.title, type: 'article' }
}

/** Hand-written titles for the products that carry the main buying keywords. */
const PRODUCT_TITLES = {
  'spiritual-rudraksha-mala-with-mahadev-pendant': 'Rudraksha Mala with Mahadev Pendant: Price | Gawri Ganga',
  'original-karungali-wood-mala': 'Original Karungali Mala, 108 Beads: Price | Gawri Ganga',
  'karungali-spiritual-black-stone-japa-mala': 'Karungali Japa Mala, Original Ebony Beads | Gawri Ganga',
  'shri-radha-tulsi-mala-pendant': 'Tulsi Mala with Shri Radha Pendant: Price | Gawri Ganga',
  'sitaram-hanumanji-tulsi-necklace': 'Bageshwar Dham Sitaram Tulsi Necklace | Gawri Ganga',
  'tulsi-bead-mala': 'Original Tulsi Bead Mala for Japa: Price | Gawri Ganga',
  'original-thick-tulsi-kanthi-mala': 'Thick Tulsi Kanthi Mala, Original: Price | Gawri Ganga',
  'original-tulsi-kanthi-mala': 'Tulsi Kanthi Mala Original: Price & Rules | Gawri Ganga',
  'tulsi-sacred-japa-mala-108-beads': 'Tulsi Japa Mala 108 Beads, Original: Price | Gawri Ganga',
  'sacred-radhe-engraved-tulsi-mala': 'Radhe Engraved Tulsi Mala, Original Kanthi | Gawri Ganga',
  'om-namah-shivaya-gold-bracelet-with-rudraksha': 'Om Namah Shivaya Rudraksha Bracelet, Gold | Gawri Ganga',
  'rudraksha-bracelet': 'Rudraksha Bracelet for Men, Gold-Plated | Gawri Ganga',
  'multi-stone-money-magnet-bracelet': 'Money Magnet Bracelet, Multi-Stone: Price | Gawri Ganga',
  'black-bead-evil-eye-bracelet': 'Black Evil Eye Bracelet (Nazar): Price | Gawri Ganga',
  'sphatik-clear-quartz-bracelet': 'Sphatik Bracelet, Clear Quartz: Price | Gawri Ganga',
  'sphatik-mala-charged-diamond-cut-108-beads': 'Sphatik Mala Diamond Cut 108 Beads: Price | Gawri Ganga',
  'natural-pyrite-bracelet': 'Natural Pyrite Bracelet, Original: Price | Gawri Ganga',
  'tulsi-braclet': 'Tulsi Bracelet, Original Tulsi Beads: Price | Gawri Ganga',
  'maitri-aura-spray': 'Maitri Spray: Calming Pooja Room Spray | Gawri Ganga',
  'chakra-balance-aura-spray': 'Chakra Balance Spray for Meditation | Gawri Ganga',
  'shuddhi-aura-spray': 'Shuddhi Spray: Space Cleansing Spray | Gawri Ganga',
  'amrat-bindu-aura-spray': 'Amrat Bindu Lavender Room Spray | Gawri Ganga',
  'orignal-karungli-wood-mala-rudraksha-mala-karungli-rudraksha-mala-combo': 'Karungali Mala & Rudraksha Mala Combo | Gawri Ganga',
  '5-mukhi-1-mukhi-rudraksha-combo-deal-rudraksha-combo': '5 Mukhi & 1 Mukhi Rudraksha Combo: Price | Gawri Ganga',
  'tulsi-kanthi-mala-tulsi-beed-mala-tulsi-mala-combo': 'Tulsi Kanthi Mala & Tulsi Bead Mala Combo | Gawri Ganga',
  '3-bracelet-combo-evil-eye-bracelet-natural-pyrite-money-magnet': 'Evil Eye, Pyrite & Money Magnet Bracelet Combo | Gawri Ganga',
  '2-bracelets-combo-black-evil-eye-natural-pyrite': 'Evil Eye & Pyrite Bracelet Combo: Price | Gawri Ganga',
  'tulsi-kanthi-mala-tulsi-bracelet-combo-tulsi-combo': 'Tulsi Kanthi Mala & Tulsi Bracelet Combo | Gawri Ganga',
  'best-rudraksha-mala-combo-2-mukhi-5-mukhi-rudraksha-mala': '2 Mukhi, 5 Mukhi & Rudraksha Mala Combo | Gawri Ganga',
}

/** Spray products also exist as /sprays/<name>; that page is the canonical one. */
export const SPRAY_PAGES = {
  'shuddhi-aura-spray': '/sprays/shuddhi',
  'maitri-aura-spray': '/sprays/maitri',
  'chakra-balance-aura-spray': '/sprays/chakra-balance',
  'amrat-bindu-aura-spray': '/sprays/amrat-bindu',
}

export function productKind(product = {}) {
  const t = `${product.name} ${product.slug} ${product.subcategory} ${product.category || ''}`.toLowerCase()
  if (/combo/.test(t)) return 'combo'
  if (/spray/.test(t)) return 'spray'
  if (/karung/.test(t)) return 'karungali'
  if (/sphatik/.test(t)) return 'sphatik'
  if (/tulsi/.test(t)) return 'tulsi'
  if (/bracelet|braclet/.test(t)) return 'bracelet'
  if (/mukhi/.test(t) && !/mala/.test(t)) return 'mukhi'
  if (/rudraksha/.test(t)) return 'rudraksha-mala'
  return 'other'
}

const KIND_LEAD = {
  karungali: 'natural Karungali (ebony wood), traditionally worn for steadiness and protection.',
  tulsi: 'natural Tulsi wood for japa and daily devotion.',
  sphatik: 'Sphatik (clear quartz) for japa and daily wear.',
  bracelet: 'a bracelet for everyday wear, with natural beads.',
  spray: 'a smoke-free pooja room and space spray for home, office and travel.',
  combo: 'a set chosen to be worn together, at a better price than buying each piece.',
  'rudraksha-mala': 'Nepali Rudraksha for japa and daily wear.',
  other: 'from the Gawri Ganga collection.',
}

/** Category page each kind belongs to, for breadcrumbs. */
export function productCategory(product = {}) {
  const kind = productKind(product)
  if (kind === 'combo') return { name: 'Combos', path: '/combos' }
  if (kind === 'spray') return { name: 'Sprays', path: '/sprays' }
  if (kind === 'karungali') return { name: 'Karungali Mala', path: '/shop/karungali-mala' }
  if (kind === 'tulsi') return { name: 'Tulsi Mala', path: '/tulsimala' }
  if (kind === 'mukhi' || kind === 'rudraksha-mala') return { name: 'Rudraksha', path: '/rudraksha' }
  return { name: 'Bracelets and Malas', path: '/accessories' }
}

// Short product descriptions get the shop's trust line, so every snippet reaches a useful length.
const withTrust = (d) => (d.length < 120 ? `${d} Since 1982, with 2-day returns.` : d)

export function productMeta(product = {}) {
  const name = cleanName(product.name)
  const price = Number(product.price) || 0
  const mk = productKind(product) === 'mukhi' ? mukhiInfo(name) : null
  const canonicalPath = SPRAY_PAGES[product.slug] || `/product/${product.slug}`

  if (mk) {
    return {
      title: `${mk.number} Mukhi Rudraksha Price: Original Nepali${SUFFIX}`,
      description: clip(
        `Buy original Nepali ${mk.number} Mukhi Rudraksha at ${inr(price)} with a lab-tested certificate. Linked with ${mk.deity} and ${mk.planet}. How to wear it, and COD.`,
      ),
      h1: `${mk.number} Mukhi Rudraksha (Nepali)`,
      canonicalPath,
      type: 'product',
    }
  }

  const title = PRODUCT_TITLES[product.slug] || `${name}: Price${SUFFIX}`
  const lead = KIND_LEAD[productKind(product)]
  return {
    title,
    description: clip(withTrust(`${name} at ${inr(price)}: ${lead} COD and delivery across India.`)),
    h1: name,
    canonicalPath,
    type: 'product',
  }
}

// ---------- route lookup (browser) ----------

const PRIVATE_PREFIXES = ['/orders/', '/auth/']

export function isPrivatePath(pathname) {
  if (PRIVATE_PREFIXES.some((p) => pathname.startsWith(p))) return true
  return Boolean(STATIC_META[pathname]?.noindex) || ['/signup', '/auth'].includes(pathname)
}

/** Canonical path for a URL: /blogs/* duplicates /blog/*, spray product URLs point at /sprays/*. */
export function canonicalPath(pathname) {
  if (pathname === '/blogs' || pathname.startsWith('/blogs/')) return pathname.replace(/^\/blogs/, '/blog')
  const productSlug = pathname.match(/^\/product\/([^/]+)$/)?.[1]
  if (productSlug && SPRAY_PAGES[productSlug]) return SPRAY_PAGES[productSlug]
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

/**
 * Meta for any path. Product pages get a slug-based placeholder here; ProductPage replaces it
 * with productMeta(product) once the product has loaded (the prerendered HTML already has the real one).
 */
export function routeMeta(pathname) {
  const path = canonicalPath(pathname)
  if (STATIC_META[path]) return STATIC_META[path]

  const shop = path.match(/^\/shop\/([^/]+)$/)?.[1]
  if (shop && collectionMeta(shop)) return collectionMeta(shop)

  // The guide page replaces this placeholder with the guide's own title and description once it has loaded.
  const guideSlug = path.match(/^\/guides\/([^/]+)$/)?.[1]
  if (guideSlug) {
    const name = guideSlug.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
    return { title: `${name}${SUFFIX}`, description: STATIC_META['/guides'].description, type: 'article' }
  }

  const rashi = getRashi(path.match(/^\/rashi\/([^/]+)$/)?.[1])
  if (rashi) return rashiPageMeta(rashi)

  const product = path.match(/^\/product\/([^/]+)$/)?.[1]
  if (product) {
    const name = cleanName(product.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    return { title: PRODUCT_TITLES[product] || `${name}${SUFFIX}`, description: STATIC_META['/'].description, type: 'product' }
  }

  if (path.startsWith('/blog/')) return { title: `Blog${SUFFIX}`, description: STATIC_META['/blog'].description, type: 'article' }
  return NOT_FOUND_META
}

export { collectionMeta }

const decode = (s = '') => String(s).replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').trim()

/**
 * Blog posts from the database. Their `title` is an internal name such as "7 mukhi rudraksha blog";
 * the real title and description sit inside the stored HTML document, so those win when present.
 */
export function blogPostMeta(post = {}) {
  const html = String(post.html_content || '')
  const docTitle = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').replace(/\s*\|\s*Gawri Ganga\s*$/i, '')
  const docDesc = decode(html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1] || '')
  // A real title is used as written; only a title made from the slug is capitalised word by word.
  const fallback = post.title
    ? String(post.title).trim()
    : String(post.slug || '')
        .replace(/[-_]/g, ' ')
        .replace(/\s+blog$/i, '')
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim()
  const h1 = docTitle || fallback
  const description = clip(docDesc || post.excerpt || `${h1}: a guide from Gawri Ganga.`)
  // The brand suffix is dropped when it would push the title past what search results show (about 60 characters).
  const title = h1.length + SUFFIX.length <= 62 ? `${h1}${SUFFIX}` : h1
  return { title, description, h1, type: 'article' }
}

// ---------- structured data ----------

const ORG_ID = `${SITE_URL}/#organization`

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: BRAND,
    legalName: LEGAL_ENTITY,
    foundingDate: String(FOUNDED_YEAR),
    url: `${SITE_URL}/`,
    logo: absUrl(OG_IMAGE),
    email: EMAIL,
    telephone: `+${WHATSAPP_NUMBER}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.city,
      addressRegion: ADDRESS.region,
      postalCode: ADDRESS.postalCode,
      addressCountry: ADDRESS.country,
    },
    sameAs: SOCIAL,
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: BRAND,
    url: `${SITE_URL}/`,
    inLanguage: 'en-IN',
    publisher: { '@id': ORG_ID },
  }
}

export function breadcrumbJsonLd(items = []) {
  if (!items.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absUrl(item.path),
    })),
  }
}

export function faqJsonLd(faqs = []) {
  const list = faqs
    .map((f) => ({ q: f.q || f.question, a: f.a || f.answer }))
    .filter((f) => f.q && f.a)
  if (!list.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}

export function itemListJsonLd(products = [], name) {
  if (!products.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absUrl(SPRAY_PAGES[p.slug] || `/product/${p.slug}`),
      name: cleanName(p.name),
    })),
  }
}

export function articleJsonLd({ path, title, description, image, published, updated }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image ? [absUrl(image)] : [absUrl(OG_IMAGE)],
    datePublished: published || undefined,
    dateModified: updated || published || undefined,
    mainEntityOfPage: absUrl(path),
    author: { '@type': 'Organization', name: BRAND, url: `${SITE_URL}/` },
    publisher: { '@id': ORG_ID },
  }
}

/**
 * Product schema with shipping and return details (needed for Google merchant listings).
 * `shippingAmount` is the live delivery charge; pass null to leave shipping out.
 */
export function productJsonLd(product = {}, { price, rating, reviewCount, shippingAmount = null } = {}) {
  if (!product?.slug) return null
  const name = cleanName(product.name)
  const images = (Array.isArray(product.images) ? product.images : []).filter(Boolean)
  const mk = mukhiInfo(name)
  const props = []
  if (mk) {
    props.push({ '@type': 'PropertyValue', name: 'Mukhi', value: String(mk.number) })
    props.push({ '@type': 'PropertyValue', name: 'Origin', value: 'Nepal' })
  }
  const offer = {
    '@type': 'Offer',
    url: absUrl(SPRAY_PAGES[product.slug] || `/product/${product.slug}`),
    priceCurrency: 'INR',
    price: Number(price ?? product.price) || 0,
    itemCondition: 'https://schema.org/NewCondition',
    availability: Number(product.stock) > 0 ? 'https://schema.org/InStock' : product.sale_type === 'preorder' ? 'https://schema.org/PreOrder' : 'https://schema.org/OutOfStock',
    seller: { '@id': ORG_ID },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'IN',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: RETURN_WINDOW_DAYS,
      returnMethod: 'https://schema.org/ReturnByMail',
      merchantReturnLink: absUrl('/refund-cancellation'),
    },
  }
  if (shippingAmount != null) {
    offer.shippingDetails = {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', value: Number(shippingAmount) || 0, currency: 'INR' },
      shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IN' },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: HANDLING_DAYS[0], maxValue: HANDLING_DAYS[1], unitCode: 'DAY' },
        transitTime: { '@type': 'QuantitativeValue', minValue: TRANSIT_DAYS[0], maxValue: TRANSIT_DAYS[1], unitCode: 'DAY' },
      },
    }
  }
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: clip(product.short_description || product.description || name, 500),
    image: images.length ? images : undefined,
    sku: String(product.id || product.slug),
    brand: { '@type': 'Brand', name: BRAND },
    category: productCategory(product).name,
    additionalProperty: props.length ? props : undefined,
    offers: offer,
  }
  if (rating > 0 && reviewCount > 0) {
    json.aggregateRating = { '@type': 'AggregateRating', ratingValue: rating, reviewCount, bestRating: 5, worstRating: 1 }
  }
  return json
}
