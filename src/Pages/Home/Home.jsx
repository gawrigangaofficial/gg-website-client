import React from 'react'
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
import HomeReviewsSection from './HomeReviewsSection'
import TestimonialsSection from './TestimonialsSection'
import TrustStrip from './TrustStrip'
import Combos from './Combos'
import MobileAppHome from './MobileAppHome'
import DesktopHomeShowcase from './DesktopHomeShowcase'
import RelatedGuides from '../../components/RelatedGuides'


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
      <section className="mx-auto w-[92%] max-w-7xl py-6">
        <h2 className="font-heading text-2xl font-bold text-stone-900 md:text-3xl">
          Why people wear Rudraksha, Karungali, and Tulsi
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-700 md:text-base">
          Nepali Rudraksha is worn for japa and daily practice. A Rudraksha bracelet is the shorter wrist form. A Tulsi mala is holy basil wood for naam jap. A Karungali mala is ebony wood worn for steadiness. Aura sprays freshen a room without smoke. Each guide below explains the importance of that piece and how to care for it.
        </p>
        <RelatedGuides
          slugs={[
            'importance-of-wearing-rudraksha',
            'why-wear-a-rudraksha-bracelet',
            'benefits-of-wearing-karungali-mala',
            'importance-of-tulsi-mala',
          ]}
          title="Guides on this site"
        />
      </section>
      <TrustStrip />
      {/* <GawriGangaIntroSection /> */}
      <SectionDivider />
      <AccessoriesProd />
      <RudrakhshaProd />
      <TulsiProd />
      <Combos />
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
      <div className="hidden md:block">
        <HomeReviewsSection />
      </div>
      <SectionDivider />
      <TestimonialsSection />
      <SectionDivider />
      <AuthenticCertifiedSection />
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
    </div>
  )
}

export default Home