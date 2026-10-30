import { MUKHI } from '../mukhi.js'

const planetMukhis = (planet) =>
  Object.entries(MUKHI)
    .filter(([, m]) => m.planet === planet)
    .map(([n]) => `${n} Mukhi`)
    .join(' and ')

const SIGNS = [
  ['Aries', 'Mesha', 'Mars', 'aries'],
  ['Taurus', 'Vrishabha', 'Venus', 'taurus'],
  ['Gemini', 'Mithuna', 'Mercury', 'gemini'],
  ['Karka (the crab)', 'Karka', 'Moon', 'karka'],
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
  category: 'Rashi and purpose',
  keywords: {
    primary: 'rudraksha by rashi',
    secondary: [
      'which rudraksha for my zodiac sign',
      'rudraksha according to rashi',
      'rudraksha for moon sign',
      'rashi ke anusar rudraksha',
      'mukhi and ruling planet',
    ],
  },
  readMinutes: 8,
  published: '2026-10-08',
  updated: '2026-10-30',
  heroImage:
    'https://ggimg-images.s3.ap-south-1.amazonaws.com/products/94bbb179887f4a85b4d7d539bee5956b-1.webp',
  heroAlt: 'A 6 Mukhi Rudraksha bead, the bead traditionally linked with Venus',
  sections: [
    {
      h2: 'Rudraksha by rashi: the short answer',
      body: [
        `In Vedic tradition every rashi (zodiac sign) is ruled by a planet, and every mukhi is linked with a planet. To choose a Rudraksha by rashi, find the ruling planet of your sign and wear the mukhi linked with that planet. If your sign is Aries or Scorpio, the ruling planet is Mars and the linked bead is the 3 Mukhi. A 5 Mukhi suits every sign, so it is the safe first choice.`,
        `This is a tradition, not a rule you must follow. Anyone can wear any Rudraksha. Matching by rashi is one way to choose among the beads. If you prefer to choose by purpose, see our guide on [which mukhi to wear](/guides/which-mukhi-rudraksha-to-wear).`,
      ],
    },
    {
      h2: 'What is a rashi?',
      body: [
        `Rashi is the Sanskrit word for a zodiac sign. In Vedic (Jyotish) astrology your rashi is usually your Moon sign, the sign the Moon was in at your birth, and it can differ from the Sun sign used in Western astrology. Because the Vedic system uses the sidereal zodiac, many people find their Vedic sign is different from the one they know. Check your Moon sign with a birth chart before you choose.`,
        `In everyday Hindi talk, people say "meri rashi kya hai" and mean the Moon sign printed on the janam kundli. If your family has a kundli made at birth, the rashi is already written on it, and that is the one to use here.`,
      ],
    },
    {
      h2: 'Rashi, ruling planet and linked mukhi',
      body: [
        `The table follows the standard ruling planets used in Vedic astrology and the planet attributions for each mukhi from the Shiva Purana and Padma Purana tradition. Sources differ slightly on a few beads, which is why we always suggest you take this as guidance.`,
        { table: { head: ['Rashi', 'Sanskrit name', 'Ruling planet', 'Linked mukhi'], rows: signRows } },
        `Open the [rashi pages](/rashi) to see the beads suggested for each sign, for example [Gemini (Mithun)](/rashi/mithun) or [Karka](/rashi/kark).`,
      ],
    },
    {
      h2: 'How the matching works',
      body: [
        `Each mukhi is attributed to a planet. A 1 Mukhi and 12 Mukhi are linked with the Sun, a 2 Mukhi with the Moon, a 3 Mukhi with Mars, a 4 Mukhi with Mercury, a 5 Mukhi with Jupiter, a 6 Mukhi and 13 Mukhi with Venus, and a 7 Mukhi and 14 Mukhi with Saturn. The 8 Mukhi is linked with Rahu and the 9 Mukhi with Ketu. The 10 and 11 Mukhi are linked with all planets.`,
        `Rahu and Ketu are not the ruling planet of any of the twelve signs in the table, so the 8 and 9 Mukhi do not appear against a rashi. People who wear them usually do so because of a chart reading or because they are drawn to Ganesha or Durga, the deities tradition links with those beads.`,
        `If your sign has two choices, such as Venus with a 6 or 13 Mukhi, the 6 Mukhi is easier to find and costs less, so most people begin there. The 13 Mukhi is rare. For the Sun (Leo), the 1 Mukhi is the rarest and costliest, and the 12 Mukhi is the more reachable bead. Our [price list](/guides/rudraksha-price-list) shows how far apart these beads sit.`,
      ],
    },
    {
      h2: 'Questions people have when matching',
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
            `Yes. It is linked with Jupiter and Kalagni Rudra, and tradition holds it as suitable for all signs, ages and genders. If you are unsure, the [5 Mukhi Rudraksha](/product/5-mukhi-rudraksha){{price:5-mukhi-rudraksha}} is the standard first bead, and our [5 Mukhi guide](/guides/5-mukhi-rudraksha-benefits) explains why.`,
          ],
        },
        {
          h3: 'Is the rare bead of my planet a better match?',
          body: [
            `No. Rarity and suitability are different things. A 14 Mukhi is not a stronger match for Saturn than a 7 Mukhi, it is just harder to find. Our guide on the [most powerful Rudraksha](/guides/most-powerful-rudraksha) goes into this honestly.`,
          ],
        },
      ],
    },
    {
      h2: 'What we suggest in practice',
      body: [
        `Start with a 5 Mukhi. If you want a second bead tied to your rashi, add the one from the table. Wear one or two beads you will actually look after, not a heap. Learn [how to wear Rudraksha](/guides/how-to-wear-rudraksha) properly and check each bead against our guide to [spotting an original](/guides/how-to-identify-original-rudraksha).`,
        `For a bead linked with Mars, a [3 Mukhi Rudraksha](/product/3-mukhi-rudraksha){{price:3-mukhi-rudraksha}} is among the easier beads to find. If you want a human opinion before you buy, message us on [WhatsApp](wa:), Monday to Saturday.`,
      ],
    },
    {
      h2: 'A worked example',
      body: [
        `Say your Moon sign is Gemini. Gemini is ruled by Mercury, and the mukhi linked with Mercury is the 4 Mukhi, which tradition associates with Brahma, study and communication. You would begin with a 5 Mukhi for daily wear and could add a 4 Mukhi if study or speaking is a big part of your life. If your sign is Karka, ruled by the Moon, the linked bead is the 2 Mukhi, associated with Ardhanarishvara. The same logic works for every row in the table.`,
        `Notice what the example does not do. It does not tell you the bead will change anything about your exams, your job or your marriage. It only tells you which bead tradition connects with your planet, so that your choice has a reason behind it.`,
      ],
    },
    {
      h2: 'What this guide does not claim',
      body: [
        `Rudraksha does not change your birth chart and does not guarantee any outcome. Tradition describes it as an aid to your practice, calm and focus. It is a spiritual practice, not a remedy for illness, and it is not a substitute for a doctor. We do not make medical, financial or relationship promises, and neither should any seller.`,
      ],
    },
  ],
  faqs: [
    {
      q: 'Which Rudraksha is best for Aries?',
      a: 'Aries is ruled by Mars, and the mukhi linked with Mars is the 3 Mukhi. A 5 Mukhi suits every sign, so many people begin with that and add the 3 Mukhi later.',
    },
    {
      q: 'Can I wear a Rudraksha that does not match my rashi?',
      a: 'Yes. Anyone can wear any Rudraksha. Matching by rashi is a traditional method of choosing, not a requirement, and many people choose by purpose or simply by what draws them.',
    },
    {
      q: 'Is my rashi the same as my Sun sign?',
      a: 'Not always. In Vedic astrology your rashi is usually your Moon sign, and the Vedic zodiac is offset from the Western one. Check with a birth chart or the janam kundli your family has.',
    },
    {
      q: 'Which Rudraksha suits all zodiac signs?',
      a: 'The 5 Mukhi. Tradition holds it as suitable for every sign, age and gender, which is why it is the usual first bead and the one most families keep at home.',
    },
    {
      q: 'Do I need an astrologer to choose?',
      a: 'No. The table in this guide is enough to choose a bead. An astrologer can add advice based on your full chart if you want it, which a sign alone cannot give.',
    },
    {
      q: 'Which mukhi goes with Saturn signs like Makar and Kumbh?',
      a: 'Saturn is linked with the 7 Mukhi and the very rare 14 Mukhi. Most people begin with the 7 Mukhi. Tradition links it with Mahalakshmi and steadiness at work, not with any promised result.',
    },
    {
      q: 'Can I wear more than one mukhi?',
      a: 'Yes. A common pattern is a 5 Mukhi for daily wear plus one bead linked with your planet. Keep the number small so you can look after each bead and keep it clean.',
    },
  ],
  related: {
    productSlugs: ['5-mukhi-rudraksha', '3-mukhi-rudraksha', '6-mukhi-rudraksha'],
    pages: [
      { label: 'Rudraksha by zodiac sign', to: '/rashi' },
      { label: 'Which mukhi should I wear?', to: '/guides/which-mukhi-rudraksha-to-wear' },
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
