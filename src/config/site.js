/**
 * Business facts used for page meta, structured data and the build-time prerender.
 * Plain values only (no JSX, no asset imports) so scripts/prerender.mjs can import this file in Node.
 * Keep these in line with the policy pages; Google compares schema with what the page says.
 */

export const SITE_URL = (import.meta.env?.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '')

export const BRAND = 'Gawri Ganga'
export const LEGAL_ENTITY = 'BNB Basket and Boxes Gifting Solutions Private Limited'

export const ADDRESS = {
  street: 'Sector 27',
  city: 'Noida',
  region: 'Uttar Pradesh',
  postalCode: '201301',
  country: 'IN',
  full: 'Sector 27, Noida, Uttar Pradesh 201301',
}

export const EMAIL = 'support@gawriganga.com'
export const WHATSAPP_NUMBER = '919717568740'

export const SOCIAL = [
  'https://www.instagram.com/gawriganga.in',
  'https://www.youtube.com/@gawri-ganga',
  'https://www.facebook.com/profile.php?id=61589197491701',
]

/** Return window in days (owner confirmed 2 days, Oct 2026). RefundCancellation.jsx, product pages and schema all read this. */
export const RETURN_WINDOW_DAYS = 2

/** Matches src/Pages/Policies/ShippingPolicy.jsx: dispatch in 2–4 business days, delivery in 5–14. */
export const HANDLING_DAYS = [2, 4]
export const TRANSIT_DAYS = [5, 14]

/** Default share image (1200×630 recommended). */
export const OG_IMAGE = '/favicon.png'

/** Testing labs that certify our beads (owner confirmed, Oct 2026). Both are ISO-certified. */
export const LABS = ['Kailasa Rudraksha and Gemological Lab', 'Rudraksha and Gems Testing Lab']
export const LAB_LINE = `${LABS.join(' and ')} (ISO-certified labs)`

/** The family business has served devotees since 1982 (owner confirmed, Oct 2026). */
export const FOUNDED_YEAR = 1982
