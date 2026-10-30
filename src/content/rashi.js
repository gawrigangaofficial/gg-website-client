import { MUKHI } from './mukhi.js'

/**
 * The twelve rashis, Hindi name first because that is how people search
 * ("rudraksha for tula rashi", not "libra rashi").
 */
export const RASHIS = [
  { value: 'Aries', english: 'Aries', name: 'Mesh', hindi: 'मेष', planet: 'Mars', element: 'Fire' },
  { value: 'Taurus', english: 'Taurus', name: 'Vrishabh', hindi: 'वृषभ', planet: 'Venus', element: 'Earth' },
  { value: 'Gemini', english: 'Gemini', name: 'Mithun', hindi: 'मिथुन', planet: 'Mercury', element: 'Air' },
  { value: 'Cancer', english: 'Cancer', name: 'Kark', hindi: 'कर्क', planet: 'Moon', element: 'Water' },
  { value: 'Leo', english: 'Leo', name: 'Simha', hindi: 'सिंह', planet: 'Sun', element: 'Fire' },
  { value: 'Virgo', english: 'Virgo', name: 'Kanya', hindi: 'कन्या', planet: 'Mercury', element: 'Earth' },
  { value: 'Libra', english: 'Libra', name: 'Tula', hindi: 'तुला', planet: 'Venus', element: 'Air' },
  { value: 'Scorpio', english: 'Scorpio', name: 'Vrishchik', hindi: 'वृश्चिक', planet: 'Mars', element: 'Water' },
  { value: 'Sagittarius', english: 'Sagittarius', name: 'Dhanu', hindi: 'धनु', planet: 'Jupiter', element: 'Fire' },
  { value: 'Capricorn', english: 'Capricorn', name: 'Makar', hindi: 'मकर', planet: 'Saturn', element: 'Earth' },
  { value: 'Aquarius', english: 'Aquarius', name: 'Kumbh', hindi: 'कुम्भ', planet: 'Saturn', element: 'Air' },
  { value: 'Pisces', english: 'Pisces', name: 'Meen', hindi: 'मीन', planet: 'Jupiter', element: 'Water' },
].map((r) => ({ ...r, slug: r.name.toLowerCase(), label: `${r.name} (${r.hindi}) · ${r.english}` }))

/**
 * Mukhis for a rashi: the beads linked with its ruling planet (src/content/mukhi.js), plus the 5 Mukhi,
 * which tradition treats as suitable for every sign. The rudraksha-by-rashi guide and product FAQs use the same rule.
 */
export function rashiMukhis(value) {
  const rashi = RASHIS.find((r) => r.value === value)
  if (!rashi) return []
  const byPlanet = Object.entries(MUKHI)
    .filter(([, m]) => m.planet === rashi.planet)
    .map(([n]) => `${n} Mukhi`)
  return byPlanet.includes('5 Mukhi') ? byPlanet : [...byPlanet, '5 Mukhi']
}

export function getRashi(slug) {
  return RASHIS.find((r) => r.slug === slug) || null
}

/** Page copy for /rashi/<slug>. Tradition only; no promises of results. */
export function rashiPageMeta(rashi) {
  const mukhis = rashiMukhis(rashi.value)
  return {
    title: `${rashi.name} Rashi Rudraksha (${rashi.english}): Which Mukhi | Gawri Ganga`,
    description: `Which Rudraksha suits ${rashi.name} rashi (${rashi.hindi})? ${rashi.planet} rules ${rashi.english}, so tradition suggests ${mukhis.join(', ')}. How to wear it, and lab-tested beads.`,
    h1: `Rudraksha for ${rashi.name} Rashi (${rashi.hindi} राशि)`,
  }
}

const PLANET_HI = { Mars: 'मंगल', Venus: 'शुक्र', Mercury: 'बुध', Moon: 'चंद्र', Sun: 'सूर्य', Jupiter: 'गुरु', Saturn: 'शनि' }

export function rashiFaqs(rashi) {
  const mukhis = rashiMukhis(rashi.value)
  const mukhisHi = mukhis.map((m) => m.replace('Mukhi', 'मुखी')).join(', ')
  return [
    {
      q: `Which Rudraksha is best for ${rashi.name} rashi?`,
      a: `${rashi.name} (${rashi.english}) is ruled by ${rashi.planet}. Tradition links ${mukhis.filter((m) => m !== '5 Mukhi').join(' and ') || 'the 5 Mukhi'} with ${rashi.planet}, and the 5 Mukhi suits every rashi, so it is a safe first bead.`,
    },
    {
      q: `${rashi.hindi} राशि के लिए कौन सा रुद्राक्ष पहनें?`,
      a: `${rashi.hindi} राशि का स्वामी ग्रह ${PLANET_HI[rashi.planet]} है। परंपरा के अनुसार ${mukhisHi} रुद्राक्ष पहना जाता है। 5 मुखी हर राशि के लिए उपयुक्त है।`,
    },
    {
      q: 'Should I use my Moon sign or Sun sign?',
      a: 'Vedic tradition uses your Moon sign (rashi) from a birth chart, which can differ from the Western Sun sign. If you do not know it, start with a 5 Mukhi.',
    },
    {
      q: 'Can I wear a Rudraksha that is not for my rashi?',
      a: 'Yes. Anyone can wear any Rudraksha. Matching by rashi is one traditional way to choose, not a rule.',
    },
  ]
}
