import { RASHIS, rashiMukhis } from '../content/rashi.js'
import { LAB_LINE, RETURN_WINDOW_DAYS } from '../config/site.js'
import { cleanName, productKind } from '../seo/meta.js'

/**
 * Rule-based shopping assistant: turns what a visitor types ("rudraksha for tula rashi under 1000",
 * "something for money", "is it original?") into an answer and matching products from the live catalogue.
 * No external AI service: everything runs in the browser on the product list from /api/products.
 */

const PURPOSES = [
  { key: 'peace', label: 'peace and calm', words: ['peace', 'calm', 'stress', 'anxiety', 'shanti', 'sukoon', 'sleep', 'tension', 'relax'], tags: ['peace', 'calm', 'balance'] },
  { key: 'wealth', label: 'wealth and business', words: ['money', 'wealth', 'dhan', 'business', 'finance', 'prosperity', 'paisa', 'rich', 'income', 'lakshmi'], tags: ['wealth', 'prosperity', 'success', 'luck'] },
  { key: 'career', label: 'career and success', words: ['career', 'job', 'promotion', 'success', 'naukri', 'growth', 'leader'], tags: ['success', 'leadership', 'prosperity', 'confidence'] },
  { key: 'study', label: 'study and focus', words: ['study', 'student', 'exam', 'focus', 'padhai', 'concentration', 'memory', 'education'], tags: ['wisdom', 'clarity', 'focus'], mukhis: [4, 6] },
  { key: 'protection', label: 'protection', words: ['protection', 'protect', 'evil eye', 'nazar', 'negative', 'raksha', 'black magic', 'drishti'], tags: ['protection'] },
  { key: 'health', label: 'health', words: ['health', 'swasthya', 'healing', 'energy'], tags: ['health'] },
  { key: 'love', label: 'love and marriage', words: ['love', 'marriage', 'relationship', 'shaadi', 'vivah', 'husband', 'wife', 'partner'], tags: ['love', 'harmony'] },
  { key: 'courage', label: 'courage and confidence', words: ['courage', 'confidence', 'fear', 'himmat', 'strength'], tags: ['courage', 'confidence', 'strength'] },
  { key: 'devotion', label: 'japa and devotion', words: ['japa', 'jaap', 'jap', 'meditation', 'puja', 'pooja', 'devotion', 'bhakti', 'chant', 'dhyan'], tags: ['devotion', 'purification', 'calm'] },
]

// Materials are required when named; forms (mala, bracelet, combo) narrow within them.
const FORMS = new Set(['mala', 'bracelet', 'combo'])
const TYPES = [
  { key: 'rudraksha', label: 'Rudraksha', words: ['rudraksha', 'rudraksh', 'rudrakhsa', 'rudrakash'] },
  { key: 'karungali', label: 'Karungali', words: ['karungali', 'karungli', 'ebony', 'kali mala'] },
  { key: 'tulsi', label: 'Tulsi', words: ['tulsi', 'tulasi', 'kanthi'] },
  { key: 'sphatik', label: 'Sphatik', words: ['sphatik', 'crystal', 'quartz'] },
  { key: 'pyrite', label: 'Pyrite', words: ['pyrite', 'money magnet'] },
  { key: 'bracelet', label: 'bracelets', words: ['bracelet', 'braclet', 'wrist', 'kada'] },
  { key: 'spray', label: 'sprays', words: ['spray', 'room', 'fragrance', 'smell', 'aroma'] },
  { key: 'combo', label: 'combos and gifts', words: ['combo', 'gift', 'gifting', 'set', 'hamper', 'diwali'] },
  { key: 'mala', label: 'malas', words: ['mala', 'necklace', 'chain', 'pendant', 'locket'] },
]

const WORD_NUMBERS = { ek: 1, do: 2, teen: 3, char: 4, panch: 5, chhe: 6, saat: 7, aath: 8, nau: 9, das: 10, gyarah: 11, barah: 12, terah: 13, chaudah: 14 }

const has = (text, word) => new RegExp(`(^|[^a-z])${word.replace(/\s+/g, '\\s+')}`, 'i').test(text)

/** Reads a message into structured needs. */
export function parseQuery(raw = '') {
  const text = String(raw).toLowerCase().replace(/(\d),(\d{3})/g, '$1$2').replace(/[,!?]/g, ' ')
  const mukhis = new Set()
  for (const m of text.matchAll(/(\d{1,2})\s*-?\s*(mukhi|mukh|face)/g)) mukhis.add(Number(m[1]))
  for (const [word, n] of Object.entries(WORD_NUMBERS)) if (has(text, `${word}\\s*mukhi`)) mukhis.add(n)

  const rashi = RASHIS.find((r) =>
    [r.name, r.english, r.hindi, r.value].some((n) => n && (has(text, n.toLowerCase()) || text.includes(n))),
  )

  const budgetMatch =
    text.match(/(?:under|below|less than|upto|up to|within|max|maximum|budget)\s*(?:rs\.?|₹|inr)?\s*(\d{3,6})/) ||
    text.match(/(?:rs\.?|₹)\s*(\d{3,6})/) ||
    text.match(/(\d{3,6})\s*(?:rs|rupees|ka|ke andar|tak)/)
  const budget = budgetMatch ? Number(budgetMatch[1]) : /cheap|budget|sasta|affordable|low price/.test(text) ? 1000 : null

  return {
    text,
    mukhis: [...mukhis].filter((n) => n >= 1 && n <= 14),
    rashi,
    purposes: PURPOSES.filter((p) => p.words.some((w) => has(text, w))),
    types: TYPES.filter((t) => t.words.some((w) => has(text, w))),
    budget,
    women: /\b(women|woman|female|ladies|lady|girl|wife|mother)\b/.test(text),
  }
}

/** Short answers for service questions; each carries a link to the page with the full answer. */
const FAQ_RULES = [
  {
    test: /original|fake|real|asli|nakli|certificate|certified|lab|genuine|authentic/,
    answer: `Every bead we sell is tested by ${LAB_LINE}, and the certificate comes with your order. You can also check a bead yourself: natural lines run top to bottom and the colour does not rub off.`,
    link: { label: 'How to identify an original Rudraksha', to: '/guides/how-to-identify-original-rudraksha' },
  },
  {
    test: /\bcod\b|cash on delivery|cash/,
    answer: 'Yes, cash on delivery is available for most pin codes in India. A ₹100 advance confirms a COD order and is adjusted from the amount you pay at delivery.',
    link: { label: 'Shipping policy', to: '/shipping-policy' },
  },
  {
    test: /deliver|shipping|ship|dispatch|how many days|kab tak|kitne din|track/,
    answer: 'We dispatch from Noida in 2 to 4 business days. Delivery usually takes 5 to 7 business days within the same state and 7 to 14 days elsewhere in India.',
    link: { label: 'Shipping policy', to: '/shipping-policy' },
  },
  {
    test: /return|refund|exchange|replace|cancel/,
    answer: `You can raise a return or refund request within ${RETURN_WINDOW_DAYS} days of delivery if a product is damaged, defective or not as described. Keep the packaging and share photos.`,
    link: { label: 'Refund and cancellation policy', to: '/refund-cancellation' },
  },
  {
    test: /how to wear|kaise pehne|kaise pahne|wearing|dharan|vidhi|mantra|which day/,
    answer: 'Wear it after bathing, ideally on a Monday morning: rinse the bead, chant its mantra or "Om Namah Shivaya" 108 times, and wear it on a thread or chain so it touches the skin.',
    link: { label: 'How to wear Rudraksha', to: '/guides/how-to-wear-rudraksha' },
  },
  {
    test: /price list|rate list|kitne ka|price of|cost of|how much/,
    answer: 'Here is our live price list for 1 to 14 Mukhi Rudraksha, with deity and planet for each bead.',
    link: { label: 'Rudraksha price list', to: '/guides/rudraksha-price-list' },
  },
]

function score(product, q) {
  const name = `${product.name} ${product.slug}`.toLowerCase()
  const kind = productKind(product)
  const tags = (Array.isArray(product.purposes) ? product.purposes : String(product.purposes || '').split(','))
    .map((t) => String(t).toLowerCase().replace(/[^a-z ]/g, '').trim())
  let s = 0

  if (q.types.length) {
    const fits = (t) =>
      t.key === 'mala'
        ? /mala|necklace|pendant/.test(name)
        : t.key === 'bracelet'
          ? kind === 'bracelet' || /bracelet|braclet/.test(name)
          : t.key === 'combo'
            ? kind === 'combo'
            : t.key === 'rudraksha'
              ? /rudrak|mukhi/.test(name)
              : name.includes(t.key) || kind === t.key
    const materials = q.types.filter((t) => !FORMS.has(t.key))
    const forms = q.types.filter((t) => FORMS.has(t.key))
    if (materials.length && !materials.some(fits)) return -1
    if (forms.length && !forms.some(fits)) return -1
    s += 5
  }

  const wantMukhis = new Set([...q.mukhis, ...(q.rashi ? rashiMukhis(q.rashi.value).map((m) => Number.parseInt(m, 10)) : []), ...q.purposes.flatMap((p) => p.mukhis || [])])
  if (wantMukhis.size) {
    const n = Number(name.match(/(?:^|\D)(\d{1,2})\s*-?\s*mukhi/)?.[1])
    // Once a mukhi, rashi or study need names specific beads, other single beads drop out.
    if (kind === 'mukhi' && !wantMukhis.has(n)) return -1
    if (kind === 'mukhi' && wantMukhis.has(n)) s += q.mukhis.includes(n) ? 8 : 6
    else if ((q.mukhis.length || q.rashi) && !q.purposes.length && !q.types.length) return -1
  }

  for (const p of q.purposes) if (tags.some((t) => p.tags.some((w) => t.includes(w)))) s += 4

  if (q.budget && Number(product.price) > q.budget) return -1
  if (Number(product.stock) <= 0) s -= 5
  return s
}

const BESTSELLERS = ['5-mukhi-rudraksha', 'karungali-spiritual-black-stone-japa-mala', 'original-tulsi-kanthi-mala', 'rudraksha-bracelet']

/** The assistant's reply: text, product suggestions and links. */
export function answer(message, products = []) {
  const q = parseQuery(message)
  const faq = FAQ_RULES.find((r) => r.test.test(q.text))
  const wantsProducts = q.mukhis.length || q.rashi || q.purposes.length || q.types.length || q.budget || /suggest|recommend|best|which|kaun|konsa|buy|kharid|want|need|chahiye|show/.test(q.text)

  if (faq && !wantsProducts) return { text: faq.answer, products: [], links: [faq.link] }

  const ranked = products
    .map((p) => ({ p, s: score(p, q) }))
    .filter((x) => x.s > 0 || (x.s === 0 && !q.mukhis.length && !q.rashi && !q.purposes.length && !q.types.length && q.budget))
    .sort((a, b) => b.s - a.s || Number(a.p.price) - Number(b.p.price))
    .slice(0, 4)
    .map((x) => x.p)

  const parts = []
  if (q.rashi) {
    parts.push(`${q.rashi.name} (${q.rashi.english}) is ruled by ${q.rashi.planet}, so tradition suggests ${rashiMukhis(q.rashi.value).join(', ')}.`)
  }
  if (q.purposes.length) parts.push(`For ${q.purposes.map((p) => p.label).join(' and ')}, these are traditionally worn:`)
  if (q.women) parts.push('Women can wear Rudraksha, Tulsi and Karungali; there is no rule against it.')
  if (faq) parts.push(faq.answer)

  if (ranked.length) {
    const budgetNote = q.budget ? `, all under ₹${q.budget.toLocaleString('en-IN')}` : ''
    const lead = parts.length ? `${parts.join(' ')}${budgetNote ? ` Showing options${budgetNote}.` : ''}` : `Here is what I found${budgetNote}:`
    const links = [faq?.link, q.rashi ? { label: `Rudraksha for ${q.rashi.name} rashi`, to: `/rashi/${q.rashi.slug}` } : null].filter(Boolean)
    return { text: lead, products: ranked, links }
  }

  const fallback = BESTSELLERS.map((slug) => products.find((p) => p.slug === slug)).filter(Boolean)
  return {
    text: `${parts.length ? `${parts.join(' ')} ` : ''}I could not find an exact match${q.budget ? ` under ₹${q.budget.toLocaleString('en-IN')}` : ''}. Here are our most loved pieces, or ask us on WhatsApp and we will help you choose.`,
    products: fallback,
    links: faq ? [faq.link] : [],
  }
}

/** Display helpers shared with the chat window. */
export const productTitle = (p) => cleanName(p.name)
export const QUICK_REPLIES = [
  'Rudraksha for my rashi',
  'Something for peace',
  'For money and business',
  'For study and focus',
  'For protection',
  'Karungali mala',
  'Tulsi mala',
  'Under ₹1,000',
  'Is it original?',
  'Delivery and COD',
]
