import React from 'react'
import { Link } from 'react-router-dom'
import RashiSection from '../Home/RashiSection'
import FAQAccordion from '../Home/FAQAccordion'
import SpraySection from '../Home/SpraySection'
import AuthenticCertifiedSection from './AuthenticCertifiedSection'
import RudrakshaSection from './RudrakshaSection'
import RudrakhshaProd from './RudrakhshaProd'
import AccessoriesProd from './AccessoriesProd'
import TulsiProd from './TulsiProd'
import OriginImg from '../../assets/HomePage/origin.webp'
import StartupIndiaImg from '../../assets/HomePage/SIC.webp'
import LimitedTimeCashbackOffer from './LimitedTimeCashbackOffer'
import FeaturedProductsSection from './FeaturedProductsSection'
import ShopByPurposeSection from './ShopByPurposeSection'
import GawriGangaIntroSection from './GawriGangaIntroSection'
import WhyTrustGawriGangaSection from './WhyTrustGawriGangaSection'
import OurCollection from './OurCollection'
import InstagramFeedSection from './InstagramFeedSection'
import YouTubePodcastSection from './YouTubePodcastSection'
import LatestPostsSection from './LatestPostsSection'
import TestimonialsSection from './TestimonialsSection'
import TrustStrip from './TrustStrip'
import Combos from './Combos'
import MobileAppHome from './MobileAppHome'
import DesktopHomeShowcase from './DesktopHomeShowcase'
import BhaiDoojSection from './BhaiDoojSection'
import { FOUNDED_YEAR, LAB_LINE } from '../../config/site'
import { STATIC_META } from '../../seo/meta'


function StoryPanel({ title, tone = 'white', wide = false, children }) {
  const background = tone === 'cream' ? 'bg-[#FFF6E4]' : 'bg-white'
  return (
    <details className={`group h-full rounded-xl border border-orange-200 shadow-sm ${background} ${wide ? 'md:col-span-2' : ''}`}>
      <summary className="flex h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 [&::-webkit-details-marker]:hidden">
        <h2 className="min-w-0 truncate font-heading text-sm font-bold leading-none text-stone-900">{title}</h2>
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-sm leading-none font-bold text-white" aria-hidden="true">
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
      </summary>
      <div className="px-4 pb-4 text-sm leading-relaxed text-stone-700">{children}</div>
    </details>
  )
}

/** The page H1 and the reason to buy, right under the banner. Same H1 as the prerendered HTML (src/seo/meta.js). */
function HomeIntro() {
  return (
    <section className="mx-auto w-[92%] max-w-5xl py-6 text-center md:py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Since {FOUNDED_YEAR} · Lab-tested · COD across India</p>
      <h1 className="mt-2 font-heading text-2xl font-bold leading-tight text-stone-900 md:text-4xl">{STATIC_META['/'].h1}</h1>
      <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-stone-600 md:text-base">
        Original Nepali Rudraksha from 1 to 14 Mukhi, Karungali and Tulsi malas. Every bead is tested by {LAB_LINE}, and the certificate comes with your order.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Link to="/rudraksha" className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white">
          Shop original Rudraksha
        </Link>
        <Link to="/blog/rudraksha-price-list" className="inline-flex rounded-full border border-orange-300 bg-white px-5 py-2.5 text-sm font-semibold text-primary">
          See the price list
        </Link>
      </div>
    </section>
  )
}

const SectionDivider = () => (
  <div className="mx-auto hidden w-[92%] max-w-7xl items-center justify-center py-3 sm:py-4 md:flex">
    <div className="h-[2px] w-full rounded-full bg-linear-to-r from-transparent via-orange-300/90 to-transparent" />
  </div>
)

const Home = () => {
  return (
    <div className="bg-[#FFFAEB]">
      <MobileAppHome />
      <DesktopHomeShowcase />
      <BhaiDoojSection />
      <HomeIntro />
      <TrustStrip />
      {/* <GawriGangaIntroSection /> */}
      <SectionDivider />
      <RudrakhshaProd />
      <AccessoriesProd />
      <TulsiProd />
      <Combos />
      <SectionDivider />
      <TestimonialsSection />
      <SectionDivider />
      <AuthenticCertifiedSection />
      <SectionDivider />
      <FeaturedProductsSection />
      {/* <SectionDivider />
      <LimitedTimeCashbackOffer /> */}
      <SectionDivider />
      <SpraySection />
      <SectionDivider />
      <OurCollection />
      <SectionDivider />
      <RudrakshaSection />
      <SectionDivider />
      <div className="hidden md:block">
        <RashiSection />
      </div>
      <SectionDivider />
      <WhyTrustGawriGangaSection />
      <SectionDivider />
      <ShopByPurposeSection />
      <SectionDivider />
      <InstagramFeedSection />
      <SectionDivider />
      <YouTubePodcastSection />
      <SectionDivider />
      <LatestPostsSection />
      <SectionDivider />
      <SectionDivider />
      <section className="w-full bg-[#FFFAEB]">
        <img
          src={OriginImg}
          alt="Gawri Ganga origin story — Nepali Rudraksha and sacred malas"
          className="block h-auto w-full max-w-none object-contain object-center"
          loading="lazy"
        />
      </section>
      <FAQAccordion />
      <section className="w-full bg-[#FFFAEB]">
        <img
          src={StartupIndiaImg}
          alt="Startup India recognition for Gawri Ganga"
          className="block h-auto w-full max-w-none object-contain object-center"
          loading="lazy"
        />
      </section>
      <section className="mx-auto w-[92%] max-w-6xl py-8 md:py-12">
        <header className="mb-5 text-center md:mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">From the Noida studio</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-stone-900 md:text-4xl">
            Nepali Rudraksha, Tulsi and Karungali at Gawri Ganga
          </h2>
        </header>
        <div className="grid grid-cols-1 items-stretch gap-2 md:grid-cols-2">
          <StoryPanel title="The shop">
            <p>
              Gawri Ganga is a Noida shop for Nepali Rudraksha, Tulsi malas, Karungali malas, Rudraksha bracelets, and smoke-free aura sprays.
              People wear Nepali Rudraksha for japa and daily practice. A Rudraksha bracelet is the shorter wrist form of the same bead, worn by men and women through an ordinary day.
              A Tulsi mala is holy basil wood used for naam jap. A Karungali mala is ebony wood worn for steadiness and a traditional sense of protection.
              These are practice pieces from Gawri Ganga. They are not medicines, and a bead or wood does not replace rest, study, or a doctor.
            </p>
          </StoryPanel>
          <StoryPanel title="Care before you wear" tone="cream">
            <p>
              The Rudraksha pages list the mukhi count in the product title, including the widely worn 5 Mukhi Rudraksha.
              Read that title, compare it with the photo, and rinse a Rudraksha with clean water before the first wear.
              Take Rudraksha off for soap and swimming. Tulsi and Karungali should stay drier than Rudraksha.
              Wipe those wood malas instead of soaking them, and do not leave them in a hot closed car.
              Gawri Ganga packs these malas and bracelets in Noida and sends them to serviceable pin codes across India.
            </p>
          </StoryPanel>
          <StoryPanel title="Shop Rudraksha, Tulsi and Karungali">
            <p>
              Start with <Link to="/rudraksha" className="font-semibold text-primary">Nepali Rudraksha beads and malas</Link>, then look at <Link to="/accessories" className="font-semibold text-primary">Rudraksha bracelets and Karungali malas</Link>.
              The <Link to="/tulsimala" className="font-semibold text-primary">original Tulsi malas</Link> include kanthi and bead strands for japa.
              {' '}<Link to="/sprays" className="font-semibold text-primary">Aura sprays</Link> freshen a room when dhoop or sage smoke is not practical.
              Amrat Bindu is a lavender mist, Maitri is floral, Chakra Balance uses hibiscus, and Shuddhi uses mogra and kewda.
              Shake the bottle and spray the air, not the beads, the fabric, or your face.
              Choose <Link to="/rashi" className="font-semibold text-primary">Rudraksha by rashi</Link> when you want a traditional mukhi match for a zodiac sign.
              That match is a custom, not a financial or medical result.
            </p>
          </StoryPanel>
          <StoryPanel title="Gifts and the studio" tone="cream">
            <p>
              <Link to="/combos" className="font-semibold text-primary">Spiritual gift sets</Link> pair a mala or bracelet with a spray for Diwali, weddings, and home use.
              Offices, temples, and wedding counts above a normal checkout can use the <Link to="/corporate-bulk-orders" className="font-semibold text-primary">corporate and festival gifting</Link> quote.
              {' '}<Link to="/purpose-products" className="font-semibold text-primary">Products by purpose</Link> group the same catalog by how you plan to use it.
              Read <Link to="/about" className="font-semibold text-primary">about Gawri Ganga</Link> and <Link to="/contact" className="font-semibold text-primary">contact the Noida studio</Link> if you want help before you order.
              Shipping times are on the <Link to="/shipping-policy" className="font-semibold text-primary">shipping policy</Link>.
            </p>
          </StoryPanel>
          <StoryPanel title="Why people wear Rudraksha">
            <p>
              The importance of wearing Rudraksha is the habit it supports: a seed linked with Shiva that you can hold, count, and keep with you.
              A guide explains <Link to="/guides/importance-of-wearing-rudraksha" className="font-semibold text-primary">why people wear Rudraksha</Link> and how a mukhi count is only a face count, not a promise.
              {' '}<Link to="/guides/why-wear-a-rudraksha-bracelet" className="font-semibold text-primary">Why wear a Rudraksha bracelet</Link> covers daily wrist wear, metal caps, and how to check the lines on the bead.
              {' '}<Link to="/guides/how-to-check-original-rudraksha-bracelet" className="font-semibold text-primary">How to check an original Rudraksha bracelet</Link> and <Link to="/guides/5-mukhi-rudraksha-how-to-choose" className="font-semibold text-primary">how to choose a 5 Mukhi Rudraksha</Link> sit beside it.
              {' '}<Link to="/guides/can-you-wear-rudraksha-while-bathing" className="font-semibold text-primary">Wearing Rudraksha while bathing</Link> explains soap, sweat, and the washroom.
            </p>
          </StoryPanel>
          <StoryPanel title="Karungali, Tulsi, and sprays" tone="cream">
            <p>
              People wear a Karungali mala because the dark ebony beads are smooth and traditionally kept for steadiness.
              Read <Link to="/guides/benefits-of-wearing-karungali-mala" className="font-semibold text-primary">why wear a Karungali mala</Link> and <Link to="/guides/karungali-mala-price-and-care" className="font-semibold text-primary">Karungali mala price and care</Link> before you order the wood.
              A Tulsi mala matters for japa in the Vishnu tradition.
              {' '}<Link to="/guides/importance-of-tulsi-mala" className="font-semibold text-primary">The importance of a Tulsi mala</Link>, <Link to="/guides/shyam-tulsi-vs-rama-tulsi-mala" className="font-semibold text-primary">Shyam Tulsi and Rama Tulsi</Link>, and the <Link to="/guides/original-tulsi-mala-buying-guide" className="font-semibold text-primary">original Tulsi mala buying guide</Link> explain colour and care.
              Colour alone is not a certificate.
              {' '}<Link to="/guides/why-rudraksha-karungali-and-tulsi-matter" className="font-semibold text-primary">Why Rudraksha, Karungali, Tulsi, and aura sprays matter</Link> keeps each item in its own job.
              {' '}<Link to="/guides/smoke-free-aura-cleansing-sprays" className="font-semibold text-primary">Smoke-free aura sprays</Link> and <Link to="/guides/spiritual-gift-hampers-india" className="font-semibold text-primary">spiritual gift sets</Link> cover the room mist and the hamper.
              Every guide is listed on the <Link to="/blog" className="font-semibold text-primary">Gawri Ganga guides</Link> page.
            </p>
          </StoryPanel>
        <StoryPanel title="How an order leaves Noida" tone="cream" wide>
          <p>
            Shop Nepali Rudraksha when you want a bead for japa. Shop a Tulsi mala when the practice is naam jap. Shop a Karungali mala when you want the dark ebony wood. Shop a Rudraksha bracelet when the bead should stay on the wrist through work and travel. Each product page names the piece, shows the photo, and lists the price in rupees before you pay. Compare that name with the picture. A mukhi count belongs in the title, not only in a caption under the image.
            Gawri Ganga dispatches from Sector 27, Noida, Uttar Pradesh, to serviceable pin codes across India. The <Link to="/shipping-policy" className="font-semibold text-primary">shipping policy</Link> explains the timeline. Cash on delivery is offered on most of those pin codes. If a pin code is outside the service area, the checkout says so before the order is placed.
            Keep the parcel closed until you are ready to look at the bead or the wood in daylight. Rinse a Rudraksha with clean water and dry it fully. Do not soak a Tulsi mala or a Karungali mala. Store each strand in a cloth pouch, away from perfume and a closed hot car. Wear the piece with a short mantra you already know. Take Rudraksha off for soap and swimming.
            Gift sets are for Diwali, weddings, and a home puja shelf. A larger run for an office, a temple, or a wedding count uses the bulk quote, where you share the city, the date, and the quantity. The about page tells the studio story. The contact page reaches support at support@gawriganga.com on weekdays. Guides on this domain explain why each piece is worn, how to check a bracelet, and how to care for the wood. Read those pages, then return to the shop and choose the bead, the mala, or the spray that matches the practice.
          </p>
        </StoryPanel>
        <StoryPanel title="Share Gawri Ganga" wide>
          <p className="text-sm text-stone-600">Share this page with someone choosing a mala, a bracelet, or a spray.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ['Share on Facebook', 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.gawriganga.com%2F'],
              ['Share on X', 'https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.gawriganga.com%2F&text=Nepali%20Rudraksha%2C%20Tulsi%20and%20Karungali%20at%20Gawri%20Ganga'],
              ['Share on LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.gawriganga.com%2F'],
              ['Share on Pinterest', 'https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fwww.gawriganga.com%2F&description=Nepali%20Rudraksha%20Tulsi%20Karungali%20Gawri%20Ganga'],
              ['Share on WhatsApp', 'https://wa.me/?text=Nepali%20Rudraksha%20at%20Gawri%20Ganga%20https%3A%2F%2Fwww.gawriganga.com%2F'],
            ].map(([label, href]) => (
              <a key={label} href={href} rel="noopener noreferrer" className="rounded-full bg-[#FFF6E4] px-4 py-2 text-sm font-semibold text-stone-900 ring-1 ring-orange-200 hover:text-primary">
                {label}
              </a>
            ))}
          </div>
        </StoryPanel>
        </div>
      </section>
    </div>
  )
}

export default Home