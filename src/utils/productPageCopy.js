/** Category-aware storytelling and gallery labels for ProductPage. */

const GALLERY_VIEW_LABELS = [
  "Overview",
  "Close-up",
  "Texture & beads",
  "Size on neck/hand",
  "Individual beads",
  "Detail shot",
];

export function getGalleryViewLabel(index, total) {
  if (!total || total <= 1) return "Product photo";
  return GALLERY_VIEW_LABELS[index % GALLERY_VIEW_LABELS.length];
}

function normCategory(product) {
  return String(product?.category || "").trim().toLowerCase();
}

export function getProductStoryContext(product, stockStatus) {
  const cat = normCategory(product);
  const name = String(product?.name || "this piece").trim();

  let whoFor =
    "Anyone building a sincere daily spiritual practice who wants a trusted, authentic piece.";
  let occasions = [
    "Daily japa, meditation, or temple visits",
    "A meaningful gift for family or friends",
    "Starting or deepening your spiritual journey",
  ];
  let openingLine = `This is more than a purchase. ${name} is a companion for your practice, chosen for devotees who value authenticity as much as devotion.`;

  if (cat.includes("rudraksha")) {
    whoFor =
      "Devotees seeking a genuine Rudraksha for japa, meditation, or wearing with faith — from beginners to daily practitioners.";
    occasions = [
      "Daily japa and meditation",
      "Wearing for spiritual protection & focus",
      "Gifting on festivals, birthdays, or milestones",
    ];
    openingLine = `Every mukhi carries tradition and intention. ${name} is for you if you want a Rudraksha you can trust, verified, blessed, and ready for your practice.`;
  } else if (cat.includes("tulsi")) {
    whoFor =
      "Devotees of Vishnu and Krishna, daily kanthi wearers, and anyone seeking sacred Tulsi close to the heart.";
    occasions = [
      "Daily kanthi or japa mala",
      "Personal sadhana and temple visits",
      "A thoughtful gift for a spiritual seeker",
    ];
    openingLine = `Sacred Tulsi deserves to be seen before it is worn. ${name} is for devotees who want real bead quality, not guesswork.`;
  } else if (cat.includes("spray")) {
    whoFor = "Homes, altars, and personal spaces where you want ritual-grade sprays for cleansing and devotion.";
    occasions = ["Daily puja and space cleansing", "Gifting for housewarming or festivals", "Personal wellness rituals"];
    openingLine = `${name} is crafted for moments of shuddhi and intention, at home, at your altar, or on the go.`;
  } else if (cat.includes("combo")) {
    whoFor = "Practitioners who want a curated set without guessing what pairs well together.";
    occasions = ["Starting a complete practice kit", "Festival or milestone gifting", "Value bundles for daily use"];
    openingLine = `${name} brings together pieces that work as one, ideal when you want clarity, not clutter.`;
  }

  let urgency = null;
  if (stockStatus?.kind === "low") {
    urgency = `Only ${stockStatus.stock} left in stock — popular pieces go fast.`;
  } else if (stockStatus?.kind === "in" && Number(stockStatus.stock) > 0 && Number(stockStatus.stock) <= 15) {
    urgency = "In stock now. Dispatch in 3–7 business days across India.";
  }

  return { whoFor, occasions, openingLine, urgency };
}
