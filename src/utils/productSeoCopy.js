function blob(product) {
  return `${product?.name || ''} ${product?.category || ''} ${product?.subcategory || ''}`.toLowerCase();
}

function pack(lead, faqs, guide, related = []) {
  return { lead, faqs, guide, related };
}

export function productSeoCopy(product) {
  const name = product?.name || 'This product';
  const text = blob(product);

  if (text.includes('spray') || text.includes('amrat') || text.includes('maitri') || text.includes('shuddhi')) {
    return pack(
      `${name} is a smoke-free aura spray from Gawri Ganga. Use it when dhoop or sage smoke is not practical at home, in an office, or while travelling. Shake the bottle and spray a short arc into the air, not onto beads, fabric, or your face.`,
      [
        {
          question: `How do I use ${name}?`,
          answer: 'Shake the bottle. Spray a short arc into the air of the room. Leave a window slightly open if the room is small, then sit and set one intention.',
        },
        {
          question: 'Is an aura spray a replacement for sage or dhoop?',
          answer: 'It is a smoke-free room mist for apartments and travel. It does not burn herbs and it is not a medicine.',
        },
        {
          question: 'Can I spray it on Rudraksha or a wood mala?',
          answer: 'No. Spray the air around you. Rudraksha and wood malas last longer when they stay dry.',
        },
      ],
      { href: '/guides/smoke-free-aura-cleansing-sprays', label: 'Aura spray guide' },
      ['smoke-free-aura-cleansing-sprays', 'why-rudraksha-karungali-and-tulsi-matter'],
    );
  }

  if (text.includes('karung')) {
    return pack(
      `${name} is a Karungali, or ebony wood, mala from Gawri Ganga. People wear it for a steady daily practice and a sense of protection. Keep the wood dry and wipe it instead of soaking it.`,
      [
        {
          question: 'Who can wear a Karungali mala?',
          answer: 'Anyone can wear it. Gawri Ganga does not limit Karungali by gender. Follow any family rule you already keep.',
        },
        {
          question: 'How do I care for Karungali wood?',
          answer: 'Do not soak the beads, spray perfume on them, or leave them in a hot car. Wipe them dry and store them in a cloth pouch.',
        },
      ],
      { href: '/guides/benefits-of-wearing-karungali-mala', label: 'Why wear a Karungali mala' },
      ['benefits-of-wearing-karungali-mala', 'karungali-mala-price-and-care', 'why-rudraksha-karungali-and-tulsi-matter'],
    );
  }

  if (text.includes('tulsi')) {
    return pack(
      `${name} is a Tulsi wood mala from Gawri Ganga for japa and daily wear. Lighter beads are often called Rama Tulsi and darker beads Shyam Tulsi. Colour is not, by itself, proof that the wood is genuine.`,
      [
        {
          question: 'How should I care for this Tulsi mala?',
          answer: 'Take it off for soap, swimming, and perfume. Wipe it dry and keep it away from heat.',
        },
        {
          question: 'What is the difference between Rama and Shyam Tulsi?',
          answer: 'Rama-style beads are lighter and often chosen for a calm japa practice. Shyam-style beads are darker and chosen for a more protective feel.',
        },
      ],
      { href: '/guides/importance-of-tulsi-mala', label: 'Why a Tulsi mala matters' },
      ['importance-of-tulsi-mala', 'shyam-tulsi-vs-rama-tulsi-mala', 'original-tulsi-mala-buying-guide'],
    );
  }

  if (text.includes('bracelet') || text.includes('wrist')) {
    return pack(
      `${name} is a bracelet from Gawri Ganga for daily wear. Check the bead lines, the hole, and the product details before you buy. Take it off for soap and swimming so the thread and bead last longer.`,
      [
        {
          question: 'Can I wear this bracelet every day?',
          answer: 'Yes. Remove it for soap, swimming, and strong perfume.',
        },
        {
          question: 'How do I check a Rudraksha bracelet?',
          answer: 'Look for natural mukhi lines from top to bottom and a clean drill hole. A water test is not proof of origin.',
        },
      ],
      { href: '/guides/why-wear-a-rudraksha-bracelet', label: 'Why wear a Rudraksha bracelet' },
      ['why-wear-a-rudraksha-bracelet', 'how-to-check-original-rudraksha-bracelet', 'rudraksha-bracelet-for-daily-wear'],
    );
  }

  if (text.includes('rudraksha') || text.includes('mukhi')) {
    return pack(
      `${name} is a Nepali Rudraksha from Gawri Ganga for japa, malas, and daily wear. Rinse it with clean water, dry it fully, and start with a mantra you already know, such as Om Namah Shivaya.`,
      [
        {
          question: `How do I start wearing ${name}?`,
          answer: 'Rinse with clean water, dry it completely, and wear it with a short mantra. Keep it off while using soap.',
        },
        {
          question: 'Can I wear Rudraksha with Tulsi or Karungali?',
          answer: 'Many people do. Use the neck for the mala you chant with and the wrist for a bracelet. If your family keeps them separate, follow that.',
        },
        {
          question: 'Can I wear Rudraksha in the washroom?',
          answer: 'Take it off for bathing with soap. A quick rinse of your hands is fine. Do not leave the bead soaking.',
        },
      ],
      { href: '/guides/importance-of-wearing-rudraksha', label: 'Importance of Rudraksha' },
      ['importance-of-wearing-rudraksha', '5-mukhi-rudraksha-how-to-choose', 'can-you-wear-rudraksha-while-bathing'],
    );
  }

  return pack(
    `${name} is part of the Gawri Ganga collection of Rudraksha, Tulsi malas, Karungali, aura sprays, and spiritual gift sets, with delivery across India.`,
    [
      {
        question: `What is ${name} for?`,
        answer: product?.short_description || product?.benefits || 'It is a spiritual product for daily practice or gifting. Read the description on this page for the exact details of this piece.',
      },
      {
        question: 'Do you ship across India?',
        answer: 'Yes. Gawri Ganga dispatches from Noida to serviceable pin codes across India. Cash on delivery is available for most of those pin codes. A ₹100 advance confirms the order and is adjusted from the amount due at delivery.',
      },
    ],
    { href: '/guides/why-rudraksha-karungali-and-tulsi-matter', label: 'Why these products matter' },
    ['why-rudraksha-karungali-and-tulsi-matter', 'importance-of-wearing-rudraksha', 'benefits-of-wearing-karungali-mala'],
  );
}
