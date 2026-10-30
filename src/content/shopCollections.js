const practice =
  'These are practice pieces from Gawri Ganga. A bead, a wood mala, or a spray is not a medicine and does not promise money, health, or a planetary result.'

export const SHOP_COLLECTIONS = [
  {
    slug: 'karungali-mala',
    title: 'Karungali mala for protection',
    description: `Karungali, or ebony wood, malas from Gawri Ganga, worn for steadiness and a traditional sense of protection. ${practice}`,
    test: (product) => /karung/i.test(`${product.name} ${product.slug}`),
    // Buying guide under the grid; keyword targets: karungali mala original, 108 beads, rules for men, ke fayde.
    sections: [
      {
        heading: "What an original Karungali mala is",
        body: "Karungali is ebony wood (Diospyros ebenum), dense and naturally black. An original Karungali mala has 108 beads plus one guru bead, feels heavy for its size and shows fine wood grain under light. Our malas are lab tested and the certificate comes with your order.",
      },
      {
        heading: "How to spot a fake Karungali mala",
        body: "Fakes are usually dyed rosewood or other light woods painted black. Rub a bead with a damp white cloth: dye comes off, real ebony does not. Real Karungali is heavy and sinks in water, the black runs right through the wood when you look inside the drill hole, and the grain is fine and even. A very light or very cheap mala is a warning sign.",
      },
      {
        heading: "Karungali mala rules for men and women",
        body: "Anyone can wear a Karungali mala; there is no rule against women wearing it. Many people start wearing it on a Saturday or Tuesday after a short prayer to Lord Murugan or Lord Shiva. Take it off for bathing with soap, swimming and sleep, keep it away from perfume, and store it in a cloth pouch.",
      },
      {
        heading: "Karungali mala ke fayde (benefits)",
        body: "In South Indian and Tamil tradition, Karungali is worn for steadiness, focus and a sense of protection, and it is linked with Mars (Mangal) and Saturn (Shani). These are traditional beliefs, not medical results.",
      },
    ],
    faqs: [
      { question: "How do I know a Karungali mala is original?", answer: "Real Karungali is heavy, black right through and does not leave colour on a damp cloth. Our malas are lab tested and the certificate comes with your order." },
      { question: "How many beads are in a Karungali japa mala?", answer: "A japa mala has 108 beads plus one guru (sumeru) bead, written as 108+1." },
      { question: "Can women wear a Karungali mala?", answer: "Yes. There is no rule against women wearing Karungali. Follow any family custom you already keep." },
      { question: "Which day should I start wearing Karungali?", answer: "Many people start on a Saturday or Tuesday after a short prayer. Any calm morning after bathing is fine." },
      { question: "Can I wear Karungali and Rudraksha together?", answer: "Yes. Many people wear a Rudraksha bead with a Karungali mala; we also sell them as a combo." },
    ],
  },
  {
    slug: 'pyrite',
    title: 'Pyrite for wealth',
    description: `Natural pyrite bracelets, and the combos that include them. People wear pyrite as a reminder around work and money. ${practice}`,
    test: (product) => /pyrite/i.test(`${product.name} ${product.slug}`),
  },
  {
    slug: 'evil-eye',
    title: 'Evil eye for protection',
    description: `Black bead evil eye bracelets and the combos that include them. ${practice}`,
    test: (product) => /evil eye/i.test(`${product.name} ${product.slug}`),
  },
  {
    slug: 'sphatik',
    title: 'Sphatik',
    description: `Sphatik, or clear quartz, as a bracelet and as a 108-bead mala. ${practice}`,
    test: (product) => /sphatik/i.test(`${product.name} ${product.slug}`),
  },
  {
    slug: 'wealth-bracelets',
    title: 'Bracelets for wealth and career',
    description: `Pyrite and money-magnet bracelets for daily wear. ${practice}`,
    test: (product) =>
      /bracelet/i.test(`${product.name} ${product.subcategory}`) &&
      /pyrite|money magnet/i.test(`${product.name} ${product.slug}`),
  },
  {
    slug: 'japa-malas',
    title: 'Japa malas',
    description: `Tulsi, Karungali, Sphatik, and Rudraksha malas for japa. ${practice}`,
    test: (product) => {
      const text = `${product.name} ${product.subcategory} ${product.slug}`
      if (/bracelet/i.test(`${product.subcategory} ${product.name}`)) return false
      return /mala|japa|kanthi/i.test(text)
    },
  },
  {
    slug: 'pendants',
    title: 'Pendants',
    description: `Rudraksha and Tulsi pieces that include a pendant. ${practice}`,
    test: (product) => /pendant/i.test(`${product.name} ${product.slug}`),
  },
  {
    slug: 'festivals',
    title: 'Festivals and gifting',
    description:
      'Gift sets for Diwali, Bhai Dooj, weddings, and a home puja shelf. Larger counts for an office or a wedding use the corporate quote.',
    test: (product) => /combo/i.test(`${product.name} ${product.slug}`),
  },
  ...['Peace', 'Protection', 'Wealth', 'Health', 'Love', 'Luck', 'Courage', 'Balance'].map((purpose) => ({
    slug: purpose.toLowerCase(),
    title: purpose,
    description: `Gawri Ganga products tagged ${purpose}. ${practice}`,
    purpose,
  })),
]

export function getShopCollection(slug) {
  return SHOP_COLLECTIONS.find((item) => item.slug === slug) || null
}
