import { MUKHI } from '../mukhi.js'

// {{NEEDS REAL EXAMPLE}}: if an astrologer or customer has shared a real rashi-based pick, the owner can add it.
const planetMukhis = (planet) =>
  Object.entries(MUKHI)
    .filter(([, m]) => m.planet === planet)
    .map(([n]) => `${n} Mukhi`)
    .join(' and ')

const SIGNS = [
  ['Aries', 'Mesha', 'Mars', 'aries'],
  ['Taurus', 'Vrishabha', 'Venus', 'taurus'],
  ['Gemini', 'Mithuna', 'Mercury', 'gemini'],
  ['Cancer', 'Karka', 'Moon', 'cancer'],
  ['Leo', 'Simha', 'Sun', 'leo'],
  ['Virgo', 'Kanya', 'Mercury', 'virgo'],
  ['Libra', 'Tula', 'Venus', 'libra'],
  ['Scorpio', 'Vrishchika', 'Mars', 'scorpio'],
  ['Sagittarius', 'Dhanu', 'Jupiter', 'sagittarius'],
  ['Capricorn', 'Makara', 'Saturn', 'capricorn'],
  ['Aquarius', 'Kumbha', 'Saturn', 'aquarius'],
  ['Pisces', 'Meena', 'Jupiter', 'pisces'],
]

const signRows = SIGNS.map(([en, sa, planet]) => [
  `[${en}](/rashi)`,
  sa,
  planet,
  planetMukhis(planet),
])

export default {
  slug: 'rudraksha-by-rashi',
  title: 'Rudraksha by Rashi: Which Mukhi for Your Zodiac Sign',
  seoTitle: 'Rudraksha by Rashi: Which Mukhi for Your Sign',
  description:
    'Rudraksha by rashi: find the mukhi linked with the ruling planet of your zodiac sign, how the tradition works, and why the 5 Mukhi suits every sign.',
  excerpt:
    'In Vedic tradition each rashi has a ruling planet, and each mukhi is linked with a planet. Here is the full table for all twelve signs.',
  category: 'Rashi',
  readMinutes: 7,
  published: '2026-10-08',
  updated: '2026-10-12',
  heroImage:
    'https://ggimg-images.s3.ap-south-1.amazonaws.com/products/94bbb179887f4a85b4d7d539bee5956b-1.webp',
  heroAlt: 'A 6 Mukhi Rudraksha bead, the bead traditionally linked with Venus',
  sections: [
    {
      h2: 'The short answer',
      body: [
        `In Vedic tradition every rashi (zodiac sign) is ruled by a planet, and every mukhi is linked with a planet. To choose a Rudraksha by rashi, find the ruling planet of your sign and wear the mukhi linked with that planet. If your sign is Aries or Scorpio, the ruling planet is Mars and the linked bead is the 3 Mukhi. A 5 Mukhi suits every sign, so it is the safe first choice.`,
        `This is a tradition, not a rule you must follow. Anyone can wear any Rudraksha. Matching by rashi is one way to choose among the beads. If you prefer to choose by purpose, see our guide on [which mukhi to wear](/blog/which-mukhi-rudraksha-to-wear).`,
      ],
    },
    {
      h2: 'What is a rashi?',
      body: [
        `Rashi is the Sanskrit word for a zodiac sign. In Vedic (Jyotish) astrology your rashi is usually your Moon sign, the sign the Moon was in at your birth, and it can differ from the Sun sign used in Western astrology. Because the Vedic system uses the sidereal zodiac, many people find their Vedic sign is different from the one they know. Check your Moon sign with a birth chart before you choose.`,
      ],
    },
    {
      h2: 'Rashi, ruling planet and linked mukhi',
      body: [
        `The table follows the standard ruling planets used in Vedic astrology and the planet attributions for each mukhi from the Shiva Purana and Padma Purana tradition. Sources differ slightly on a few beads, which is why we always suggest you treat this as guidance.`,
        { table: { head: ['Rashi', 'Sanskrit name', 'Ruling planet', 'Linked mukhi'], rows: signRows } },
        `Click your sign to see the beads we suggest for it on its own page.`,
      ],
    },
    {
      h2: 'How the matching works',
      body: [
        `Each mukhi is attributed to a planet. A 1 Mukhi and 12 Mukhi are linked with the Sun, a 2 Mukhi with the Moon, a 3 Mukhi with Mars, a 4 Mukhi with Mercury, a 5 Mukhi with Jupiter, a 6 Mukhi and 13 Mukhi with Venus, and a 7 Mukhi and 14 Mukhi with Saturn. The 8 Mukhi is linked with Rahu and the 9 Mukhi with Ketu. The 10 and 11 Mukhi are linked with all planets.`,
        `If your sign has two choices, such as Venus with a 6 or 13 Mukhi, the 6 Mukhi is easier to find and costs less, so most people begin there.`,
      ],
    },
    {
      h2: 'Common questions people have when matching',
      subs: [
        {
          h3: 'What if I do not know my Moon sign?',
          body: [
            `Use a free birth-chart tool with your date, time and place of birth, or ask a family astrologer. If you cannot find it, choose by purpose instead, or begin with a 5 Mukhi.`,
          ],
        },
        {
          h3: 'Should I wear the bead of a weak planet?',
          body: [
            `This is where astrologers give personal advice that depends on your whole chart, not just your sign. We cannot do that from a sign alone. If you follow astrology seriously, ask your astrologer which planet matters in your chart, then pick the mukhi from the table above.`,
          ],
        },
        {
          h3: 'Is the 5 Mukhi really for everyone?',
          body: [
            `Yes. It is linked with Jupiter and Kalagni Rudra, and tradition treats it as suitable for all signs, ages and genders. If you are unsure, the [5 Mukhi Rudraksha](/blog/5-mukhi-rudraksha-benefits) is the standard first bead.`,
          ],
        },
      ],
    },
    {
      h2: 'What we recommend in practice',
      body: [
        `Start with a 5 Mukhi. If you want a second bead tied to your rashi, add the one from the table. Wear one or two beads you will actually look after, not a heap. Learn [how to wear Rudraksha](/blog/how-to-wear-rudraksha) properly and check each bead against our guide to [spotting an original](/blog/how-to-identify-original-rudraksha).`,
        `You can also use [Rudraksha by rashi](/rashi) or browse the [rashi pages](/rashi) for suggestions by sign. If you want a human opinion, message us on [WhatsApp](wa:).`,
      ],
    },
    {
      h2: 'A worked example',
      body: [
        `Say your Moon sign is Gemini. Gemini is ruled by Mercury, and the mukhi linked with Mercury is the 4 Mukhi, which tradition associates with Brahma, study and communication. You would begin with a 5 Mukhi for daily wear and could add a 4 Mukhi if study or speaking is a big part of your life. If your sign is Cancer, ruled by the Moon, the linked bead is the 2 Mukhi. The same logic works for every row in the table.`,
      ],
    },
    {
      h2: 'What this guide does not claim',
      body: [
        `Rudraksha does not change your birth chart and does not guarantee any outcome. Tradition describes it as an aid to your practice, calm and focus. We do not make medical, financial or relationship promises, and neither should any seller.`,
      ],
    },
  ],
  faqs: [
    {
      q: 'Which Rudraksha is best for Aries?',
      a: 'Aries is ruled by Mars, and the mukhi linked with Mars is the 3 Mukhi. A 5 Mukhi suits every sign, so many people begin with that.',
    },
    {
      q: 'Can I wear a Rudraksha that does not match my rashi?',
      a: 'Yes. Anyone can wear any Rudraksha. Matching by rashi is a traditional method of choosing, not a requirement.',
    },
    {
      q: 'Is my rashi the same as my Sun sign?',
      a: 'Not always. In Vedic astrology your rashi is usually your Moon sign, and the Vedic zodiac is offset from the Western one. Check with a birth chart.',
    },
    {
      q: 'Which Rudraksha suits all zodiac signs?',
      a: 'The 5 Mukhi. Tradition treats it as suitable for every sign, age and gender.',
    },
    {
      q: 'Do I need an astrologer to choose?',
      a: 'No. The table in this guide is enough to choose a bead. An astrologer can add advice based on your full chart if you want it.',
    },
  ],
  related: {
    productSlugs: ['5-mukhi-rudraksha', '3-mukhi-rudraksha', '6-mukhi-rudraksha'],
    pages: [
      { label: 'Rudraksha by zodiac sign', to: '/rashi' },
      { label: 'Rudraksha by rashi', to: '/rashi' },
    ],
  },
  midCta: {
    title: 'See beads suggested for your sign',
    text: 'Pick your rashi and we will show the beads tradition links with it.',
    label: 'Choose your rashi',
    to: '/rashi',
  },
  parent: { label: 'Rudraksha by rashi', to: '/rashi' },
}
