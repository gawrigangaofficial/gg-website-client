import { MUKHI } from '../mukhi.js'

// Token {{amount:<product-slug>}} renders the live price ("₹851"); the prerender writes the same number into the HTML.
const MUKHI_SLUGS = {
  1: '1-mukhi-rudraksha',
  2: '2-mukhi-rudraksha',
  3: '3-mukhi-rudraksha',
  4: '4-mukhi-rudraksha',
  5: '5-mukhi-rudraksha',
  6: '6-mukhi-rudraksha',
  7: '7-mukhi-rudraksha',
  8: '8-mukhi-rudaksha',
  9: '9-mukhi-rudraksha',
  10: '10-mukhi-rudraksha',
  11: '11-mukhi-rudraksha',
  12: '12-mukhi-rudraksha',
  13: '13-mukhi-rudraksha',
  14: '14-mukhi-rudraksha',
}

const rows = Object.entries(MUKHI_SLUGS).map(([n, slug]) => [
  `[${n} Mukhi](/product/${slug})`,
  `{{amount:${slug}}}`,
  MUKHI[n].deity,
  MUKHI[n].planet,
])

export default {
  slug: 'rudraksha-price-list',
  title: 'Rudraksha Price List 2026: 1 to 14 Mukhi Prices in India',
  seoTitle: 'Rudraksha Price List 2026: 1 to 14 Mukhi Price in India',
  description:
    'Live 2026 price list for 1 to 14 Mukhi original Nepali Rudraksha in India, what makes one bead cost more than another, and how to avoid overpaying.',
  excerpt:
    'Every mukhi from 1 to 14 with its deity, planet and our current price, plus the four things that decide what a Rudraksha should cost.',
  category: 'Rudraksha',
  readMinutes: 6,
  published: '2026-10-30',
  updated: '2026-10-30',
  heroImage: 'https://ggimg-images.s3.ap-south-1.amazonaws.com/products/1c61ddfe039240c28e53aaac1945b704-1.webp',
  heroAlt: 'Original Nepali 5 Mukhi Rudraksha bead',
  sections: [
    {
      h2: 'Rudraksha price list: 1 to 14 Mukhi',
      body: [
        `These are the prices of the original Nepali beads we sell today. Each bead is lab tested and its certificate comes with your order. Prices change with season and supply, so this table reads the current price from our shop every time you open it.`,
        { table: { head: ['Mukhi', 'Price', 'Deity', 'Planet'], rows } },
        `Common beads such as the 2 to 6 Mukhi cost the least. The price climbs fast for rare beads: a genuine 14 Mukhi is one of the rarest beads in the trade, so it costs many times more than a 5 Mukhi.`,
      ],
    },
    {
      h2: 'What decides the price of a Rudraksha',
      subs: [
        {
          h3: '1. The number of mukhis',
          body: [
            `Most trees produce four, five and six mukhi beads. Higher mukhis are far rarer, and rarity sets the price more than anything else. A 1 Mukhi (round Nepali) is so rare that most "1 Mukhi" beads sold cheaply are half-moon Indonesian or Indian beads, or fakes. See [how to identify an original Rudraksha](/blog/how-to-identify-original-rudraksha).`,
          ],
        },
        {
          h3: '2. Origin: Nepal or Indonesia',
          body: [
            `Nepali beads are larger, with deep, well-defined lines, and cost more. Indonesian beads are small, smooth and even, which makes them good for malas and cheaper per bead. Read [Nepali vs Indonesian Rudraksha](/blog/nepali-vs-indonesian-rudraksha) before you compare prices from two sellers.`,
          ],
        },
        {
          h3: '3. Size in millimetres',
          body: [
            `For the same mukhi and origin, a bigger bead costs more. Always compare beads of the same size. A low price for a "large" bead usually means the photo is not of the bead you will get.`,
          ],
        },
        {
          h3: '4. Proof: X-ray and lab certificate',
          body: [
            `A certificate from a testing lab adds to the cost, and it is worth it for anything above a 7 Mukhi. A good certificate names the lab, carries a number and describes the bead you are buying.`,
          ],
        },
      ],
    },
    {
      h2: 'How to avoid overpaying',
      body: [
        {
          ul: [
            'Compare the same mukhi, origin and size, not just the name.',
            'Ignore big "90% OFF" tags on an inflated MRP. Look at the price you actually pay.',
            'For rare beads, ask which lab issued the certificate before you pay.',
            'A rare mukhi at the price of a common one is almost never genuine.',
          ],
        },
      ],
    },
  ],
  faqs: [
    {
      q: 'What is the price of an original 5 Mukhi Rudraksha?',
      a: 'Our original Nepali 5 Mukhi Rudraksha is listed in the price table above, with its lab certificate included. 5 Mukhi is the most common bead, so it is the most affordable.',
    },
    {
      q: 'Why is 1 Mukhi Rudraksha so expensive?',
      a: 'A round Nepali 1 Mukhi is extremely rare. Most low-priced 1 Mukhi beads are half-moon beads from other regions or carved fakes, so always ask for a lab certificate.',
    },
    {
      q: 'Is Nepali Rudraksha costlier than Indonesian?',
      a: 'Yes. Nepali beads are larger with deeper lines, and fewer are harvested, so the same mukhi costs more from Nepal than from Indonesia.',
    },
    {
      q: 'Does the certificate cost extra?',
      a: 'No. Our beads are lab tested and the certificate is included in the price shown.',
    },
  ],
  related: {
    productSlugs: ['5-mukhi-rudraksha', '1-mukhi-rudraksha', '7-mukhi-rudraksha'],
    pages: [
      { label: 'All Rudraksha beads', to: '/rudraksha' },
      { label: 'Which mukhi should I wear?', to: '/blog/which-mukhi-rudraksha-to-wear' },
    ],
  },
  midCta: {
    title: 'Every bead is lab tested',
    text: 'Our beads are tested by ISO-certified labs, and the certificate comes with your order.',
    label: 'Shop original Rudraksha',
    to: '/rudraksha',
  },
  parent: { label: 'Rudraksha beads', to: '/rudraksha' },
}
