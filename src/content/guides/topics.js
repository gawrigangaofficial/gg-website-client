/**
 * Guide topics, old-address redirects and the "start here" list. Plain data (no JSX), shared by the React pages,
 * the prerender and the checker. The guides themselves are registered in ./index.js.
 */

/** Topics in display order. A guide's `category` must be one of these keys. */
export const GUIDE_TOPICS = [
  { key: 'Rudraksha', blurb: 'How to choose, check and wear original Rudraksha: mukhi, price, rules and care.' },
  { key: 'Karungali', blurb: 'Karungali (ebony) malas: how to spot a real one, price, rules and care.' },
  { key: 'Tulsi', blurb: 'Tulsi kanthi and japa malas: tradition, rules and how to buy an original.' },
  { key: 'Bracelets and stones', blurb: 'Rudraksha, Sphatik and pyrite bracelets and malas: what they are and how to wear them.' },
  { key: 'Rashi and purpose', blurb: 'Which Rudraksha for your rashi, for study, or for work, as tradition describes it.' },
  { key: 'Sprays', blurb: 'Smoke-free aura and pooja room sprays: what is in each one, how to use it and where it fits.' },
  { key: 'Gifts and combos', blurb: 'Hampers and combos of malas, bracelets and sprays for festivals, weddings and housewarmings.' },
]

/** Older guide addresses that were merged into a fuller guide. They redirect (301 in production). */
export const GUIDE_REDIRECTS = {
  'how-to-check-original-rudraksha-bracelet': 'how-to-identify-original-rudraksha',
  'benefits-of-wearing-karungali-mala': 'karungali-mala-benefits-and-how-to-wear',
  '5-mukhi-rudraksha-how-to-choose': '5-mukhi-rudraksha-benefits',
  'rudraksha-bracelet-for-daily-wear': 'rudraksha-bracelet-for-men',
  'why-wear-a-rudraksha-bracelet': 'rudraksha-bracelet-for-men',
  'why-rudraksha-karungali-and-tulsi-matter': 'wearing-rudraksha-tulsi-and-karungali',
}

/** The three guides shown first on /guides and offered to a visitor who is not sure where to begin. */
export const START_HERE = ['rudraksha-price-list', 'how-to-identify-original-rudraksha', 'which-mukhi-rudraksha-to-wear']

export const HINDI_KEY = 'हिंदी'

/** Follows a merged guide's old address to the guide that replaced it; returns the slug unchanged otherwise. */
export function resolveGuideSlug(slug) {
  return GUIDE_REDIRECTS[slug] || slug
}

/** Plain-text form of a guide paragraph: links keep their label, tokens use the given price lookup. */
export function guideText(text, priceOf = () => '') {
  return String(text)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\{\{price:([a-z0-9-]+)\}\}/g, (_, slug) => (priceOf(slug) ? ` (${priceOf(slug)})` : ''))
    .replace(/\{\{amount:([a-z0-9-]+)\}\}/g, (_, slug) => priceOf(slug) || '')
}
