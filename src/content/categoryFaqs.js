import { LAB_LINE, RETURN_WINDOW_DAYS } from '../config/site.js'

/**
 * FAQs for the category pages. Questions follow what people search (keyword research, Oct 2026);
 * answers describe tradition, not promises. The last four (certificate, COD, delivery, returns)
 * are shared and must stay in line with the policy pages.
 */
const SHARED = [
  {
    question: 'Do your products come with a lab certificate?',
    answer: `Yes. Our beads are tested by ${LAB_LINE}, and the certificate comes with your order.`,
  },
  {
    question: 'Is cash on delivery available?',
    answer:
      'Yes, for most pin codes in India. A ₹100 advance confirms a COD order and is adjusted from the amount you pay at delivery.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'We dispatch from Noida in 2 to 4 business days. Delivery usually takes 5 to 7 business days within the same state and 7 to 14 days for other regions.',
  },
  {
    question: 'What is your return policy?',
    answer: `Raise a return or refund request within ${RETURN_WINDOW_DAYS} days of delivery for a product that is damaged, defective or not as described. Keep the original packaging and share photos of the issue.`,
  },
]

export const CATEGORY_FAQS = {
  general: SHARED,
  rudraksha: [
    {
      question: 'How do I know a Rudraksha is original?',
      answer:
        'Look for natural mukhi lines that run from top to bottom, a rough natural surface and colour that does not rub off. Water and coin tests are not reliable. For rare beads, ask for a lab certificate.',
    },
    {
      question: 'Which mukhi Rudraksha should I wear first?',
      answer:
        'Most people start with a 5 Mukhi. It is the most common bead and tradition treats it as suitable for everyone, whatever their rashi.',
    },
    {
      question: 'What is the price of an original Rudraksha?',
      answer:
        'It depends on the mukhi, origin and size. Common beads such as 2 to 6 Mukhi cost the least; rare beads such as 1, 13 and 14 Mukhi cost far more. See our Rudraksha price list for current prices.',
    },
    {
      question: 'How do I start wearing a Rudraksha at home?',
      answer:
        'Rinse the bead with clean water, dry it fully, and wear it on a Monday morning with a mantra you know, such as Om Namah Shivaya. Take it off for soap and swimming.',
    },
    {
      question: 'Can women wear Rudraksha?',
      answer: 'Yes. The scriptures do not stop women from wearing Rudraksha. Follow any family custom you already keep.',
    },
    {
      question: 'Can I wear Rudraksha with a Tulsi or Karungali mala?',
      answer:
        'Many people do. Use the neck for the mala you chant with and the wrist for a bracelet. If your family keeps them separate, follow that.',
    },
    ...SHARED,
  ],
  tulsi: [
    {
      question: 'How do I identify an original Tulsi mala?',
      answer:
        'Real Tulsi wood is light, has a faint natural fragrance and small differences between beads. Very glossy, heavy, perfectly uniform beads are often a different wood.',
    },
    {
      question: 'Can anyone wear a Tulsi mala?',
      answer: 'Yes. Men, women, married and unmarried can all wear it. If your family follows a stricter rule, follow that.',
    },
    {
      question: 'What are the rules for wearing a Tulsi mala?',
      answer:
        'Wear it after bathing, keep it clean and dry, and take it off for soap and perfume. In Vaishnav tradition wearers keep a sattvic diet and avoid meat and alcohol.',
    },
    {
      question: 'What is the difference between Rama and Shyam Tulsi beads?',
      answer:
        'Lighter beads are called Rama Tulsi and darker beads Shyam Tulsi. It is a colour difference of the wood; colour alone does not prove the wood is genuine.',
    },
    {
      question: 'What should I do if my Tulsi mala breaks?',
      answer: 'Restring the beads, or respectfully place the mala under a sacred tree or in flowing water. It is not a bad omen; old thread simply wears out.',
    },
    ...SHARED,
  ],
  accessories: [
    {
      question: 'Is it fine to wear a Rudraksha bracelet every day?',
      answer: 'Yes. Many people wear one all day. Take it off for soap, swimming and strong perfume so the bead and thread last longer.',
    },
    {
      question: 'Which hand should I wear a bracelet on?',
      answer: 'Most people wear it on the right hand, though either is fine in everyday practice. Follow your family or astrologer if they suggest one.',
    },
    {
      question: 'How do I check that a pyrite bracelet is natural?',
      answer: 'Natural pyrite is heavy, cool to the touch and has an uneven metallic shine. Very light, plastic-feeling beads are usually imitations.',
    },
    {
      question: 'Can women wear Rudraksha bracelets and Karungali malas?',
      answer: 'Yes. We do not restrict these beads by gender. Wear them clean and dry, and follow any family rule you already keep.',
    },
    {
      question: 'How do I look after a Karungali mala?',
      answer: 'Karungali is dense ebony wood. Keep it dry, wipe it instead of soaking it, and store it away from heat so the beads do not crack.',
    },
    ...SHARED,
  ],
  combos: [
    {
      question: 'Why buy a combo instead of single pieces?',
      answer: 'A combo pairs pieces that are worn together, such as a Rudraksha and a Karungali mala, at a lower price than buying each one separately.',
    },
    {
      question: 'Can these sets be used as festival or wedding gifts?',
      answer: 'Yes. Combos work well for Diwali, Bhai Dooj, weddings and return gifts. For a larger order, use the corporate quote form.',
    },
    {
      question: 'Do you take bulk or corporate orders?',
      answer: 'Yes. Share the quantity, date and delivery city on the bulk order page and the team will reply with a quote and GST invoice.',
    },
    ...SHARED,
  ],
  rashi: [
    {
      question: 'How do I choose a Rudraksha by rashi?',
      answer:
        'Find the ruling planet of your rashi and wear the mukhi linked with that planet. For example, Mesh and Vrishchik are ruled by Mars, so the 3 Mukhi is suggested. The 5 Mukhi suits every rashi.',
    },
    {
      question: 'Should I use my Moon sign or Sun sign?',
      answer: 'Vedic tradition uses your Moon sign (rashi) from a birth chart, which can differ from the Western Sun sign. If you do not know it, start with a 5 Mukhi.',
    },
    {
      question: 'Can I wear more than one Rudraksha?',
      answer: 'Yes. Many people wear the bead for their rashi together with a 5 Mukhi, on one thread or as a mala.',
    },
    {
      question: 'Can I wear a Rudraksha that is not for my rashi?',
      answer: 'Yes. Anyone can wear any Rudraksha. Matching by rashi is one traditional way to choose, not a rule.',
    },
    ...SHARED,
  ],
  sprays: [
    {
      question: 'How do these sprays work without dhoop or sage smoke?',
      answer:
        'They are room mists. Shake the bottle and spray a short arc into the air. Useful in apartments, offices and while travelling, where smoke is not practical.',
    },
    {
      question: 'Which spray should I start with?',
      answer:
        'Amrat Bindu is a lavender mist for quieter evenings. Maitri is warm and floral. Chakra Balance is a brighter hibiscus spray. Shuddhi uses mogra and kewda for a fresher pooja room.',
    },
    {
      question: 'Can I use it in the pooja room every day?',
      answer: 'Yes. A few sprays in the air before puja or meditation is enough. Leave a window slightly open in a small room.',
    },
    {
      question: 'Can I spray it on Rudraksha or wood malas?',
      answer: 'No. Spray the air around you, not beads, fabric or your face. Wood malas and Rudraksha last longer when they stay dry.',
    },
    ...SHARED.filter((f) => !/lab certificate/i.test(f.question)),
  ],
}
