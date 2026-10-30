import identify from './how-to-identify-original-rudraksha.js'
import whichMukhi from './which-mukhi-rudraksha-to-wear.js'
import fiveMukhi from './5-mukhi-rudraksha-benefits.js'
import howToWear from './how-to-wear-rudraksha.js'
import byRashi from './rudraksha-by-rashi.js'
import nepaliIndonesian from './nepali-vs-indonesian-rudraksha.js'
import karungali from './karungali-mala-benefits-and-how-to-wear.js'
import tulsi from './tulsi-mala-rules-and-benefits.js'
import priceList from './rudraksha-price-list.js'
import asliPehchan from './asli-rudraksha-ki-pehchan.js'
import panchMukhiHindi from './5-mukhi-rudraksha-ke-fayde.js'
import karungaliHindi from './karungali-mala-ke-fayde.js'
import tulsiHindi from './tulsi-mala-ke-niyam.js'

/**
 * Long-form guides served at /blog/<slug>, newest first. They render without an API call,
 * so scripts/prerender.mjs writes their full text into the HTML.
 */
export const GUIDES = [identify, whichMukhi, fiveMukhi, howToWear, byRashi, nepaliIndonesian, karungali, tulsi, priceList, asliPehchan, panchMukhiHindi, karungaliHindi, tulsiHindi].sort(
  (a, b) => String(b.published).localeCompare(String(a.published)),
)

export function getGuide(slug) {
  return GUIDES.find((g) => g.slug === slug) || null
}

/** Plain-text form of a guide paragraph: links keep their label, tokens use the given price lookup. */
export function guideText(text, priceOf = () => '') {
  return String(text)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\{\{price:([a-z0-9-]+)\}\}/g, (_, slug) => (priceOf(slug) ? ` (${priceOf(slug)})` : ''))
    .replace(/\{\{amount:([a-z0-9-]+)\}\}/g, (_, slug) => priceOf(slug) || '')
}
