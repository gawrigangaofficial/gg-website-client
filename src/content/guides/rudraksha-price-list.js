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
  seoTitle: 'Rudraksha Price List 2026: 1 to 14 Mukhi',
  description:
    'Live 2026 price list for 1 to 14 Mukhi original Nepali Rudraksha in India, what makes one bead cost more than another, and how to avoid overpaying.',
  excerpt:
    'Every mukhi from 1 to 14 with its deity, planet and our current price, plus the four things that decide what a Rudraksha should cost.',
  category: 'Rudraksha',
  keywords: {
    primary: 'rudraksha price list',
    secondary: [
      'rudraksha price in india',
      '1 to 14 mukhi rudraksha price',
      'original rudraksha price',
      '5 mukhi rudraksha price',
      'rudraksha ka rate',
    ],
  },
  readMinutes: 8,
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
        `Common beads such as the 2 to 6 Mukhi cost the least. The price climbs fast for rare beads: a genuine 14 Mukhi is one of the rarest beads in the trade, so it costs many times more than a 5 Mukhi. The 13 and 14 Mukhi are shown for reference and may not be in stock.`,
      ],
    },
    {
      h2: 'How to read this price list',
      body: [
        `Read the table in three bands, because the jumps between bands are bigger than the steps inside one.`,
        {
          ul: [
            `**Common beads, 2 to 6 Mukhi.** The 2, 3, 4 and 6 Mukhi sit close together at {{amount:2-mukhi-rudraksha}} to {{amount:6-mukhi-rudraksha}}, and the [5 Mukhi Rudraksha](/product/5-mukhi-rudraksha) is {{amount:5-mukhi-rudraksha}}. These are the usual first beads.`,
            `**Middle beads, 7 to 12 Mukhi.** Prices rise with each step: the [7 Mukhi](/product/7-mukhi-rudraksha) is {{amount:7-mukhi-rudraksha}}, the 8 Mukhi {{amount:8-mukhi-rudaksha}}, the 9 Mukhi {{amount:9-mukhi-rudraksha}}. These are scarcer, so the certificate matters more.`,
            `**Rare beads, 1, 13 and 14 Mukhi.** The [1 Mukhi](/product/1-mukhi-rudraksha) is {{amount:1-mukhi-rudraksha}}. Whatever the seller, read the bead details and certificate closely for a 1 Mukhi, because this is the mukhi most often faked.`,
          ],
        },
        `The price is for one bead on its thread or loose, not a mala. A full 108-bead mala is a different product and is priced by bead size, count and origin. See [Rudraksha mala 108 beads](/guides/rudraksha-mala-108-beads) for how that works.`,
        `Price does not tell you how suitable a bead is for you. A costly bead is not a stronger or better choice by that fact alone. Tradition links each mukhi with a deity and a purpose, and that is what you should choose by. Our guide on [which mukhi to wear](/guides/which-mukhi-rudraksha-to-wear) starts from purpose, not from price.`,
      ],
    },
    {
      h2: 'What decides the price of a Rudraksha',
      subs: [
        {
          h3: '1. The number of mukhis',
          body: [
            `Most trees produce four, five and six mukhi beads. Higher mukhis are far rarer, and rarity sets the price more than anything else. A 1 Mukhi (round Nepali) is so rare that most "1 Mukhi" beads sold cheaply are half-moon Indonesian or Indian beads, or fakes. See [how to identify an original Rudraksha](/guides/how-to-identify-original-rudraksha) and our note on the [1 Mukhi Rudraksha](/guides/1-mukhi-rudraksha).`,
          ],
        },
        {
          h3: '2. Origin: Nepal or Indonesia',
          body: [
            `Nepali beads are larger, with deep, well-defined lines, and cost more. Indonesian beads are small, smooth and even, which makes them good for malas and cheaper per bead. Read [Nepali vs Indonesian Rudraksha](/guides/nepali-vs-indonesian-rudraksha) before you compare prices from two sellers.`,
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
            `A certificate from a testing lab adds to the cost, and it is worth it for anything above a 7 Mukhi. A good certificate names the lab, carries a number and describes the bead you are buying. Our guide to the [lab certificate and X-ray](/guides/rudraksha-lab-certificate-xray) shows what each part means.`,
          ],
        },
        {
          h3: '5. Finish, thread and form',
          body: [
            `A bead on a plain thread costs less than the same bead set in a gold-plated cap or silver. A bracelet or pendant adds the cost of the setting. Compare the bead first, then the setting.`,
          ],
        },
      ],
    },
    {
      h2: 'Fair price or too cheap?',
      body: [
        `A fair price is one that fits the mukhi, size and proof together. The table above is our own price for tested Nepali beads, and it gives you a useful anchor: if another seller lists the same mukhi at a fraction of it, ask what is different.`,
        {
          table: {
            head: ['What you see', 'What it usually means', 'What to do'],
            rows: [
              ['A rare mukhi at the price of a 5 Mukhi', 'Often a look-alike, a carved bead or a bead from another region', 'Ask for the lab certificate and X-ray before paying'],
              ['A large Nepali bead at an Indonesian price', 'The origin may be misstated', 'Ask for origin in writing and the size in millimetres'],
              ['A price far above the table with no certificate', 'You pay for a name, not for proof', 'Compare with a certified bead of the same size'],
              ['A price close to the table, with certificate and clear photos', 'Usually in the fair range', 'Check the return terms and the photos, then decide'],
            ],
          },
        },
        `Cheap is not the same as bad, and costly is not the same as good. A 5 Mukhi is common and affordable, and that is why it is the first bead for most people. The warning is a price that does not fit what is promised.`,
      ],
    },
    {
      h2: 'How to avoid overpaying',
      body: [
        {
          ul: [
            'Compare the same mukhi, origin and size, not just the name.',
            'Compare the price you actually pay at the end, including delivery, not a headline number.',
            'For rare beads, ask which lab issued the certificate before you pay.',
            'A rare mukhi at the price of a common one is almost never genuine.',
            'Be careful with "combo" prices: check what each bead in the set is.',
          ],
        },
        `If you want a single bead and a mala, our [Rudraksha and mala combo](/product/best-rudraksha-mala-combo-2-mukhi-5-mukhi-rudraksha-mala) is priced at {{amount:best-rudraksha-mala-combo-2-mukhi-5-mukhi-rudraksha-mala}}, and the full range is in the [Rudraksha collection](/rudraksha).`,
      ],
    },
    {
      h2: 'Ordering and payment',
      body: [
        `Cash on delivery is available for most pin codes. A ₹100 advance confirms the order and is adjusted at delivery. We dispatch in 2 to 4 business days, and delivery takes 5 to 7 business days within the same state and 7 to 14 elsewhere. If a bead arrives damaged, defective or not as described, ask for a return within 2 days of delivery. Details are on the [shipping policy](/shipping-policy) page.`,
        `We have served devotees since 1982 from Noida. If you are unsure which bead to buy, message us on [WhatsApp](wa:), Monday to Saturday.`,
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
    {
      q: 'Why do two sellers show different prices for the same mukhi?',
      a: 'Size, origin, certificate and finish can all differ even when the mukhi is the same. Compare beads of the same size and origin, with proof, before you say one is cheaper.',
    },
    {
      q: 'Which mukhi gives the best value to start with?',
      a: 'Most people begin with the 5 Mukhi because it is common, affordable and worn by tradition for daily practice. Choose by purpose first, and by price second.',
    },
    {
      q: 'Do prices change?',
      a: 'Yes. Supply and season move prices, especially for rare beads. The table on this page reads the current price from our shop, so it is always up to date.',
    },
    {
      q: 'Is a higher price a sign of a better Rudraksha?',
      a: 'Not by itself. A higher price usually reflects rarity, size or proof. Whether a bead suits you depends on the practice you follow, not on how much it costs.',
    },
  ],
  related: {
    productSlugs: ['5-mukhi-rudraksha', '1-mukhi-rudraksha', '7-mukhi-rudraksha'],
    pages: [
      { label: 'All Rudraksha beads', to: '/rudraksha' },
      { label: 'Which mukhi should I wear?', to: '/guides/which-mukhi-rudraksha-to-wear' },
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
