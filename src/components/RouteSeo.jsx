import { Helmet } from 'react-helmet-async';
import { matchPath, useLocation, useSearchParams } from 'react-router-dom';

const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '');
const OG_LOCALE = 'en_IN';
const OG_IMAGE_PATH = import.meta.env.VITE_OG_IMAGE_PATH || '/favicon.png';
const DEFAULT_DESC =
  'Shop authentic Rudraksha, japa & meditation malas, aura sprays, Tulsi malas, and spiritual accessories at Gawri Ganga—secure checkout and delivery across India.';

/** Rich copy for the home page (SEO + social). ~155–165 characters for description snippet. */
const HOME_DESCRIPTION =
  'Gawri Ganga: Nepali Rudraksha, japa malas, Tulsi malas, aura sprays & spiritual products online in India. Natural beads, ethical sourcing, guides—meditation, puja & daily practice.';

/** Long-tail + adjacent intent (meta keywords; align with on-page copy). */
const HOME_KEYWORDS =
  'Gawri Ganga, authentic Rudraksha India, Nepali Rudraksha, Rudraksha mala online, spiritual products India, Tulsi mala online, aura spray India, buy rudraksha online India, rudraksha bracelet, japa mala';

/** Dedicated /rudraksha collection — core long-tails + related searches (mukhi, japa, authenticity, astrology). */
const RUDRAKSHA_PAGE_TITLE =
  'Nepali Rudraksha Mala & Original Beads Online India | Gawri Ganga';

const RUDRAKSHA_PAGE_DESCRIPTION =
  'Original Nepali Rudraksha—1 Mukhi to 8+ Mukhi, 5 & 7 Mukhi, japa & wrist malas, 108 beads & bracelets. Natural beads, clear prices, India delivery (Delhi, Noida & nationwide).';

const RUDRAKSHA_PAGE_KEYWORDS =
  'rudraksha, rudraksha mala, original rudraksha mala, 1 mukhi rudraksha benefits, 2 mukhi rudraksha benefits, 3 mukhi rudraksha, 5 mukhi rudraksha price, 7 mukhi rudraksha price, 9 mukhi rudraksh, panchmukhi rudraksha, rudraksha chain, kumbh rashi rudraksha, rudraksha bracelet for men, rudraksha bracelet for women, rudraksha wearing rules for females, रुद्राक्ष का पेड़, rudraksh ka ped';

const TULSI_KEYWORDS =
  'tulsi mala, tulsi mala online India, tulsi japa mala, japa mala, holy basil mala, tulsi kanthi mala, vaishnav mala, prayer beads';

const RASHI_KEYWORDS =
  'rudraksha by rashi, rudraksha for zodiac, astrology consultation, online astrologer consultation, online astrology consultation, 2026 horoscope, 2026 predictions, 2026 predictions astrology';

const ACCESSORIES_KEYWORDS =
  'spiritual accessories India, rudraksha bracelet, pyrite bracelet, tiger eye bracelet, carnelian bracelet, pyrite stone bracelet, raw pyrite bracelet, golden pyrite bracelet, pyrite bracelet for men, money bracelet, money attraction bracelet, money magnet bracelet, money magnet crystal bracelet, dhan yog bracelet, dhanyog bracelet, karungali bracelet, pyrite anklet, pyrite anklet for women, lava stone benefits';

const PURPOSE_KEYWORDS =
  'spiritual products by purpose, meditation essentials, puja items online, spiritual wellness products, money magnet bracelet benefits, pyrite bracelet benefits, karungali mala benefits, karungali malai benefits, 5 mukhi rudraksha side effects';

const SPRAYS_KEYWORDS =
  'aura spray India, spiritual room spray, meditation spray, chakra spray, energy cleansing spray, lavender spiritual spray, sacred space spray';

const BLOG_KEYWORDS =
  'shiv mantra, shiva mantra, shiv mantra in hindi, shiv mantra in sanskrit, shiv mantra in english, shiv mantra lyrics, shiv mantra list, shiva mantras list, lord shiva mantra, lord shiva mantras, lord shiva mantra in english, lord shiva powerful mantra, most powerful mantra of lord shiva, powerful mantra of lord shiva, powerful shiva mantra, mahadev mantra, mahadev mantra in hindi, mahadev mantra in sanskrit, shiv shlok, shiv shlok in hindi, shiv ji mantra, shiv ji ka mantra, shiv ji ke mantra, शिव मंत्र, शिव मंत्र लिस्ट, महादेव मंत्र, सर्व शक्तिशाली शिव मंत्र, who is ashwathama, aswathama god, aswathama mahabharata, divine meaning in hindi, ருத்ராட்சம் அணிந்து அசைவம் சாப்பிடலாமா';

const CORPORATE_BULK_KEYWORDS =
  'corporate bulk rudraksha, wholesale rudraksha India, bulk rudraksha mala, B2B spiritual products, temple rudraksha supply, corporate gifting rudraksha, bulk tulsi mala India, wellness studio wholesale, bulk order spiritual gifts, Gawri Ganga wholesale';

const PRODUCT_META_OVERRIDES = {
  '1-mukhi-rudraksha': {
    title: '1 Mukhi Rudraksha | Original Bead Online India | Gawri Ganga',
    keywords: '1 mukhi rudraksha benefits, 1 mukhi rudraksha price, original rudraksha mala',
  },
  '2-mukhi-rudraksha': {
    title: '2 Mukhi Rudraksha | Authentic Bead Online India | Gawri Ganga',
    keywords: '2 mukhi rudraksha benefits, 2 mukhi rudraksha, rudraksha mala',
  },
  '3-mukhi-rudraksha': {
    title: '3 Mukhi Rudraksha | Original Bead Online India | Gawri Ganga',
    keywords: '3 mukhi rudraksha, original rudraksha mala, rudraksha',
  },
  '5-mukhi-rudraksha': {
    title: '5 Mukhi Rudraksha | Price & Benefits | Gawri Ganga',
    keywords: '5 mukhi rudraksha price, panchmukhi rudraksha, 5 mukhi rudraksha side effects',
  },
  '7-mukhi-rudraksha': {
    title: '7 Mukhi Rudraksha | Price & Uses Online India | Gawri Ganga',
    keywords: '7 mukhi rudraksha price, 7 mukhi rudraksha, rudraksha mala',
  },
  '9-mukhi-rudraksha': {
    title: '9 Mukhi Rudraksha | Original Bead Online India | Gawri Ganga',
    keywords: '9 mukhi rudraksh, 9 mukhi rudraksha, rudraksha',
  },
  'karungli-mala': {
    title: 'Karungali Mala | Original Karungali Malai Online | Gawri Ganga',
    keywords:
      'karungali mala, karungali malai, karungali mala original, original karungali mala, karungali malai original, karungali mala original price, original karungali malai, original karungali malai price, karungali malai price, karungali mala silver, karungali mala benefits, karungali malai benefits, karingali mala, karikali mala, கருங்காலி மாலை, ebony wood mala, kalinga mala',
  },
  'rudraksha-mala': {
    title: 'Rudraksha Mala | Original Japa Mala Online | Gawri Ganga',
    keywords: 'rudraksha mala, original rudraksha mala, japa mala, rudraksha mala for men',
  },
  'sacred-rudraksha-japa-mala': {
    title: 'Sacred Rudraksha Japa Mala | 108 Beads | Gawri Ganga',
    keywords: 'japa mala, rudraksha mala, original rudraksha mala, rudraksha chain',
  },
  'shiva-bracelet': {
    title: 'Shiva Bracelet | Rudraksha & Healing Bracelet | Gawri Ganga',
    keywords:
      'rudraksha bracelet, rudraksha bracelet for men, rudraksha bracelet for women, pyrite bracelet, pyrite bracelet for men, tiger eye bracelet, carnelian bracelet, money bracelet, money attraction bracelet, money magnet bracelet, money magnet crystal bracelet, money magnet bracelet benefits, dhan yog bracelet, dhanyog bracelet, pyrite stone bracelet, raw pyrite bracelet, golden pyrite bracelet, pyrite bracelet benefits',
  },
  'original-thick-tulsi-kanthi-mala': {
    title: 'Original Thick Tulsi Kanthi Mala | Gawri Ganga',
    keywords: 'tulsi mala, tulsi mala online India, tulsi japa mala, japa mala',
  },
  'original-tulsi-kanthi-mala': {
    title: 'Original Tulsi Kanthi Mala | Gawri Ganga',
    keywords: 'tulsi mala, tulsi mala online India, tulsi japa mala',
  },
  'sacred-radhe-engraved-tulsi-mala': {
    title: 'Sacred Radhe Engraved Tulsi Mala | Gawri Ganga',
    keywords: 'tulsi mala, tulsi japa mala, devotional tulsi mala',
  },
  'shri-radha-tulsi-mala-pendant': {
    title: 'Shri Radha Tulsi Mala Pendant | Gawri Ganga',
    keywords: 'tulsi mala pendant, tulsi mala, devotional necklace',
  },
  'sitaram-hanumanji-tulsi-necklace': {
    title: 'Sitaram Hanumanji Tulsi Necklace | Gawri Ganga',
    keywords: 'tulsi necklace, tulsi mala, spiritual necklace',
  },
  'tulsi-bead-mala': {
    title: 'Tulsi Bead Mala | Japa Mala Online India | Gawri Ganga',
    keywords: 'tulsi bead mala, tulsi mala, japa mala, tulsi japa mala',
  },
};

function slugToReadableName(slug = '') {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

const ROUTE_META = [
  {
    path: '/',
    title: 'Gawri Ganga | Authentic Rudraksha & Spiritual Wellness Online India',
    description: HOME_DESCRIPTION,
    keywords: HOME_KEYWORDS,
  },
  {
    path: '/sprays',
    title: 'Aura & Spiritual Sprays Online India | Gawri Ganga',
    description:
      'Aura and spiritual sprays for meditation, calm, and sacred space. Shop Amrat Bindu, Maitri, Chakra Balance & Shuddhi at Gawri Ganga—delivery across India.',
    keywords: SPRAYS_KEYWORDS,
  },
  {
    path: '/sprays/amrat-bindu',
    title: 'Amrat Bindu Aura Spray | Gawri Ganga',
    description: 'Discover Amrat Bindu Lavender Aura Spray for calmness, relaxation, and a peaceful spiritual atmosphere.',
  },
  {
    path: '/sprays/maitri',
    title: 'Maitri Aura Spray | Gawri Ganga',
    description: 'Explore Maitri Aura Spray for emotional warmth, balance, and a soothing spiritual ambience.',
  },
  {
    path: '/sprays/chakra-balance',
    title: 'Chakra Balance Aura Spray | Gawri Ganga',
    description: 'Explore Chakra Balance Aura Spray for energy alignment, positivity, and spiritual harmony.',
  },
  {
    path: '/sprays/shuddhi',
    title: 'Shuddhi Aura Spray | Gawri Ganga',
    description: 'Explore Shuddhi Aura Spray for purification, freshness, and spiritual clarity.',
  },
  {
    path: '/rudraksha',
    title: RUDRAKSHA_PAGE_TITLE,
    description: RUDRAKSHA_PAGE_DESCRIPTION,
    keywords: RUDRAKSHA_PAGE_KEYWORDS,
  },
  {
    path: '/tulsimala',
    title: 'Tulsi Mala & Japa Mala Online India | Gawri Ganga',
    description:
      'Authentic Tulsi (holy basil) malas and japa malas for naam jaap and meditation. Clear details, secure checkout—Gawri Ganga, India-wide delivery.',
    keywords: TULSI_KEYWORDS,
  },
  {
    path: '/rashi',
    title: 'Rudraksha by Rashi & Zodiac | Shop Online India | Gawri Ganga',
    description:
      'Find rudraksha aligned with your rashi and spiritual goals—curated picks, trusted quality, and delivery across India from Gawri Ganga.',
    keywords: RASHI_KEYWORDS,
  },
  {
    path: '/accessories',
    title: 'Spiritual Accessories & Mala Supplies | Gawri Ganga',
    description:
      'Spiritual accessories, bracelets, and companion pieces for your practice—pair with Rudraksha and malas. Shop Gawri Ganga with India delivery.',
    keywords: ACCESSORIES_KEYWORDS,
  },
  {
    path: '/purpose-products',
    title: 'Spiritual Products by Purpose | Meditation & Puja | Gawri Ganga',
    description:
      'Browse spiritual products by intention—meditation, daily practice, and puja. Ethical sourcing and clear product stories at Gawri Ganga.',
    keywords: PURPOSE_KEYWORDS,
  },
  { path: '/product/:slug', title: 'Product | Gawri Ganga', description: DEFAULT_DESC },
  { path: '/cart', title: 'Shopping Cart | Gawri Ganga', description: 'Review your cart and proceed to checkout.' },
  { path: '/wishlist', title: 'Wishlist | Gawri Ganga', description: 'Your saved products.' },
  { path: '/profile', title: 'My Profile | Gawri Ganga', description: 'Account and orders.' },
  { path: '/orders/:id', title: 'Order Details | Gawri Ganga', description: 'View your order status and items.' },
  { path: '/about', title: 'About Us | Gawri Ganga', description: 'Learn about Gawri Ganga and our mission.' },
  {
    path: '/blog',
    title: 'Blog | Rudraksha Care, Japa & Spiritual Wellness | Gawri Ganga',
    description:
      'Guides on Nepali Rudraksha, mukhi meanings, japa malas, meditation, and daily spiritual practice—from Gawri Ganga, India.',
    keywords: BLOG_KEYWORDS,
  },
  {
    path: '/blog/:slug',
    title: 'Blog Article | Gawri Ganga',
    description:
      'Spiritual wellness and Rudraksha guides—care, japa, and mindful practice from Gawri Ganga.',
    keywords: BLOG_KEYWORDS,
  },
  { path: '/contact', title: 'Contact | Gawri Ganga', description: 'Get in touch with Gawri Ganga support.' },
  {
    path: '/corporate-bulk-orders',
    title: 'Corporate & Bulk Orders | Wholesale Rudraksha & Malas | Gawri Ganga',
    description:
      'Request volume pricing for authentic Nepali Rudraksha, Tulsi malas, aura sprays, and spiritual accessories—corporate gifting, temples, retailers, and institutions across India.',
    keywords: CORPORATE_BULK_KEYWORDS,
  },
  { path: '/privacy-policy', title: 'Privacy Policy | Gawri Ganga', description: 'How we handle your data.' },
  { path: '/terms-of-service', title: 'Terms of Service | Gawri Ganga', description: 'Terms of using our website.' },
  { path: '/terms-and-conditions', title: 'Terms & Conditions | Gawri Ganga', description: 'Purchase and site terms.' },
  { path: '/shipping-policy', title: 'Shipping Policy | Gawri Ganga', description: 'Delivery timelines and charges.' },
  { path: '/refund-cancellation', title: 'Refund & Cancellation | Gawri Ganga', description: 'Returns and refunds policy.' },
  { path: '/login', title: 'Sign In | Gawri Ganga', description: 'Sign in with your mobile number and OTP.' },
  { path: '/order-success', title: 'Order Confirmed | Gawri Ganga', description: 'Thank you for your order.' },
  { path: '/order-failed', title: 'Payment Issue | Gawri Ganga', description: 'We could not complete payment.' },
];

function decodeSubcategoryParam(raw) {
  if (raw == null || !String(raw).trim()) return null;
  try {
    return decodeURIComponent(String(raw).trim());
  } catch {
    return String(raw).trim();
  }
}

function matchRouteMeta(pathname, searchParams) {
  const productMatch = matchPath({ path: '/product/:slug', end: true }, pathname);
  if (productMatch?.params?.slug) {
    const slug = productMatch.params.slug;
    const override = PRODUCT_META_OVERRIDES[slug];
    if (override) {
      return {
        path: '/product/:slug',
        title: override.title,
        description: DEFAULT_DESC,
        keywords: override.keywords,
      };
    }

    const readableName = slugToReadableName(slug);
    return {
      path: '/product/:slug',
      title: `${readableName} | Buy Online India | Gawri Ganga`,
      description: DEFAULT_DESC,
      keywords: `${readableName.toLowerCase()}, spiritual products India, Gawri Ganga`,
    };
  }

  if (matchPath({ path: '/rudraksha', end: true }, pathname)) {
    const subRaw = searchParams?.get('subcategory') ?? searchParams?.get('mukhi');
    const sub = decodeSubcategoryParam(subRaw);
    if (sub) {
      return {
        path: '/rudraksha',
        title: `${sub} Nepali Rudraksha | Mala & Beads Online India | Gawri Ganga`,
        description: `Shop authentic ${sub} Nepali Rudraksha—beads, japa & wrist malas (108-bead), bracelets. Natural Nepal rudraksha, clear pricing, rashi-friendly picks, delivery across India including Delhi & Noida.`,
        keywords: RUDRAKSHA_PAGE_KEYWORDS,
      };
    }
  }

  const exact = ROUTE_META.find((r) => matchPath({ path: r.path, end: true }, pathname));
  if (exact) return exact;
  return ROUTE_META.find((r) => matchPath({ path: r.path, end: false }, pathname)) || ROUTE_META[0];
}

function organizationJsonLd(siteUrl, description) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gawri Ganga',
    url: siteUrl,
    logo: `${siteUrl}${OG_IMAGE_PATH}`,
    description,
  };
}

const RouteSeo = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const meta = matchRouteMeta(pathname, searchParams);
  const url = `${SITE}${pathname}`;
  const ogImage =
    import.meta.env.VITE_OG_IMAGE_URL?.trim() ||
    (OG_IMAGE_PATH.startsWith('http')
      ? OG_IMAGE_PATH
      : `${SITE}${OG_IMAGE_PATH.startsWith('/') ? '' : '/'}${OG_IMAGE_PATH}`);
  const isHome = pathname === '/';
  const orgLd = isHome ? organizationJsonLd(SITE, HOME_DESCRIPTION) : null;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.keywords ? <meta name="keywords" content={meta.keywords} /> : null}
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Gawri Ganga" />
      <meta property="og:locale" content={OG_LOCALE} />
      <meta property="og:image:alt" content="Gawri Ganga logo" />
      <meta property="og:image:type" content="image/png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Gawri Ganga logo" />
      {orgLd ? (
        <script type="application/ld+json">{JSON.stringify(orgLd)}</script>
      ) : null}
    </Helmet>
  );
};

export default RouteSeo;
