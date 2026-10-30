/**
 * Mukhi reference data shared by product pages, rashi/purpose pages and the quiz.
 * Deity, planet and beej mantra follow the attributions most commonly cited from the Shiva Purana /
 * Padma Purana tradition (sources differ slightly). Uses are phrased as tradition, never as promises.
 * Product data from the API wins when it has a value; this file fills the gaps.
 */

export const MUKHI = {
  1: {
    deity: 'Lord Shiva',
    planet: 'Sun',
    mantra: 'Om Hreem Namah',
    day: 'Monday',
    tradition: 'Traditionally linked with focus, inner stillness and self-awareness. Revered as the bead of Shiva himself.',
    goodFor: ['Meditation', 'Leadership', 'Spiritual practice'],
  },
  2: {
    deity: 'Ardhanarishvara (Shiva–Parvati)',
    planet: 'Moon',
    mantra: 'Om Namah',
    day: 'Monday',
    tradition: 'Traditionally worn for harmony and understanding in relationships, and for emotional balance.',
    goodFor: ['Relationships', 'Emotional balance', 'Family harmony'],
  },
  3: {
    deity: 'Agni (the fire deity)',
    planet: 'Mars',
    mantra: 'Om Kleem Namah',
    day: 'Monday',
    tradition: 'Associated with Agni, the purifying fire. Traditionally worn to let go of the past and build confidence.',
    goodFor: ['Confidence', 'Fresh starts', 'Courage'],
  },
  4: {
    deity: 'Lord Brahma',
    planet: 'Mercury',
    mantra: 'Om Hreem Namah',
    day: 'Monday',
    tradition: 'Associated with Brahma, the creator. A traditional choice for students, writers and speakers.',
    goodFor: ['Study', 'Communication', 'Creativity'],
  },
  5: {
    deity: 'Kalagni Rudra',
    planet: 'Jupiter',
    mantra: 'Om Hreem Namah',
    day: 'Monday',
    tradition: 'The most widely worn Rudraksha and the usual first bead. Traditionally used for japa, calm and everyday practice.',
    goodFor: ['Daily wear', 'Japa and meditation', 'Calm'],
  },
  6: {
    deity: 'Lord Kartikeya',
    planet: 'Venus',
    mantra: 'Om Hreem Hum Namah',
    day: 'Monday',
    tradition: 'Associated with Kartikeya. Traditionally worn for willpower, steadiness and grace in expression.',
    goodFor: ['Willpower', 'Arts and expression', 'Steadiness'],
  },
  7: {
    deity: 'Goddess Mahalakshmi',
    planet: 'Saturn',
    mantra: 'Om Hum Namah',
    day: 'Monday',
    tradition: 'Associated with Mahalakshmi. A traditional choice for those seeking abundance and steadiness at work.',
    goodFor: ['Prosperity', 'Business', 'Patience'],
  },
  8: {
    deity: 'Lord Ganesha',
    planet: 'Rahu',
    mantra: 'Om Hum Namah',
    day: 'Monday',
    tradition: 'Associated with Ganesha, the remover of obstacles. Traditionally worn at the start of new ventures.',
    goodFor: ['New beginnings', 'Clearing obstacles', 'Focus'],
  },
  9: {
    deity: 'Goddess Durga',
    planet: 'Ketu',
    mantra: 'Om Hreem Hum Namah',
    day: 'Monday',
    tradition: 'Associated with the nine forms of Durga. Traditionally worn for inner strength and fearlessness.',
    goodFor: ['Inner strength', 'Protection', 'Devotion to Shakti'],
  },
  10: {
    deity: 'Lord Vishnu',
    planet: 'All planets',
    mantra: 'Om Hreem Namah Namah',
    day: 'Monday',
    tradition: 'Associated with Vishnu, the preserver. Traditionally worn as a protective bead.',
    goodFor: ['Protection', 'Peace at home', 'Stability'],
  },
  11: {
    deity: 'Ekadasha Rudra (Lord Hanuman)',
    planet: 'All planets',
    mantra: 'Om Hreem Hum Namah',
    day: 'Tuesday',
    tradition: 'Associated with the eleven Rudras and Hanuman. Traditionally worn for courage and disciplined practice.',
    goodFor: ['Courage', 'Discipline', 'Meditation'],
  },
  12: {
    deity: 'Surya (the Sun)',
    planet: 'Sun',
    mantra: 'Om Kraum Sraum Raum Namah',
    day: 'Sunday',
    tradition: 'Associated with Surya. Traditionally worn by people in leadership roles for radiance and authority.',
    goodFor: ['Leadership', 'Confidence', 'Vitality'],
  },
  13: {
    deity: 'Indra / Kamadeva',
    planet: 'Venus',
    mantra: 'Om Hreem Namah',
    day: 'Monday',
    tradition: 'Associated with Indra and Kamadeva. Traditionally worn for charm, influence and fulfilment of wishes.',
    goodFor: ['Attraction', 'Influence', 'Fulfilment'],
  },
  14: {
    deity: 'Lord Shiva / Hanuman',
    planet: 'Saturn',
    mantra: 'Om Namah',
    day: 'Monday',
    tradition: 'Called Deva Mani, the divine gem. A rare bead traditionally linked with intuition and protection.',
    goodFor: ['Intuition', 'Protection', 'Spiritual practice'],
  },
}

/** "5 Mukhi Rudraksha", "5-mukhi-rudraksha", "Panch Mukhi" → 5. Returns null when no mukhi is present. */
export function mukhiNumber(text = '') {
  const m = String(text).match(/(\d{1,2})\s*-?\s*mukhi/i)
  if (!m) return null
  const n = Number(m[1])
  return n >= 1 && n <= 21 ? n : null
}

export function mukhiInfo(text) {
  const n = typeof text === 'number' ? text : mukhiNumber(text)
  return n && MUKHI[n] ? { number: n, ...MUKHI[n] } : null
}

/** Generic wearing guidance, the same for every bead. */
export const HOW_TO_WEAR = [
  'Wear it on a Monday morning after bathing, or on any auspicious day that suits you.',
  'Hold the bead, sit quietly for a minute and chant its beej mantra (or "Om Namah Shivaya") 108 times, or as many times as feels right.',
  'Wear it on a red or yellow thread, or a silver or gold chain, so the bead touches the skin.',
  'Take it off before sleeping, bathing with soap, swimming or visiting a cremation ground, and keep it in a clean place.',
]

export const CARE = [
  'Wipe it with a soft dry cloth. Avoid soap, perfume and chemicals.',
  'Once every few months, brush it gently and apply a drop of sandalwood or mustard oil, then wipe off the excess.',
  'Store it in its box or a clean cloth pouch when you are not wearing it.',
]

/** Rashi (Hindi name first, as people search) for each ruling planet. */
const PLANET_RASHI = {
  Sun: ["Simha (Leo)"],
  Moon: ["Karka (Cancer)"],
  Mars: ["Mesh (Aries)", "Vrishchik (Scorpio)"],
  Mercury: ["Mithun (Gemini)", "Kanya (Virgo)"],
  Jupiter: ["Dhanu (Sagittarius)", "Meen (Pisces)"],
  Venus: ["Vrishabh (Taurus)", "Tula (Libra)"],
  Saturn: ["Makar (Capricorn)", "Kumbh (Aquarius)"],
}

export function mukhiRashi(n) {
  const info = MUKHI[n]
  return info ? PLANET_RASHI[info.planet] || [] : []
}

/**
 * Product-page FAQs. The questions mirror what people type into Google for every mukhi
 * (which rashi, which planet, which god, who can wear, how many, side effects).
 * Answers describe tradition only and make no policy promises beyond src/config/site.js.
 */
export function mukhiFaqs(n, { returnDays } = {}) {
  const info = n ? MUKHI[n] : null
  if (!info) return []
  const name = `${n} Mukhi Rudraksha`
  const rashi = mukhiRashi(n)
  const faqs = [
    {
      q: `Which rashi should wear ${name}?`,
      a: rashi.length
        ? `${name} is ruled by ${info.planet}, so it is traditionally suggested for ${rashi.join(" and ")} rashi. Anyone can still wear it; the rashi is a starting point, not a rule.`
        : `${name} is linked with ${info.planet} rather than one rashi, so it is traditionally worn by people of any rashi.`,
    },
    {
      q: `Which god and planet are linked with ${name}?`,
      a: `Tradition links ${name} with ${info.deity} and the planet ${info.planet}. ${info.tradition}`,
    },
    {
      q: `Who can wear ${name}?`,
      a: "Anyone can wear Rudraksha, whatever their age, gender or belief. Many people start with a 5 Mukhi bead and add others later.",
    },
    {
      q: `What is the mantra and day to start wearing ${name}?`,
      a: `Traditionally it is first worn on a ${info.day} after bathing, while chanting "${info.mantra}" 108 times.`,
    },
    {
      q: `How many ${n} Mukhi beads should I wear?`,
      a: "One bead is enough. Some people wear 3, 27, 54 or 108 beads as a mala; the count is a personal and family choice.",
    },
    {
      q: `Does ${name} have side effects?`,
      a: "Rudraksha is a natural dried seed and has no medical effects, good or bad. Remove it for soap and swimming so the bead and thread last longer.",
    },
  ]
  if (returnDays) {
    faqs.push({
      q: "Can I return it?",
      a: `Return requests can be raised within ${returnDays} days of delivery. See the refund and cancellation policy for the conditions.`,
    })
  }
  return faqs
}
