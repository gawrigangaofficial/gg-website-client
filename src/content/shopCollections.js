const practice =
  'These are practice pieces from Gawri Ganga. A bead, a wood mala, or a spray is not a medicine and does not promise money, health, or a planetary result.'

export const SHOP_COLLECTIONS = [
  {
    slug: 'karungali-mala',
    title: 'Karungali mala for protection',
    description: `Karungali, or ebony wood, malas from Gawri Ganga, worn for steadiness and a traditional sense of protection. ${practice}`,
    test: (product) => /karung/i.test(`${product.name} ${product.slug}`),
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
