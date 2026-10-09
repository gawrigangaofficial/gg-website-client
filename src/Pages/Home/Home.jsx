import React from 'react'
import WebsiteCarousel from '../../components/WebsiteCarousel'
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


const SectionDivider = () => (
  <div className="mx-auto flex w-[92%] max-w-7xl items-center justify-center py-3 sm:py-4">
    <div className="h-[2px] w-full rounded-full bg-linear-to-r from-transparent via-orange-300/90 to-transparent" />
  </div>
)

const Home = () => {
  return (
    <div className="bg-[#FFFAEB]">
      <WebsiteCarousel />
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
      <RashiSection />
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
      <HomeReviewsSection />
      <SectionDivider />
      <TestimonialsSection />
      <SectionDivider />
      <AuthenticCertifiedSection />
      <section className="w-full bg-[#FFFAEB]">
        <img
          src={OriginImg}
          alt="Why Gawri Ganga — our story and values"
          className="block h-auto w-full max-w-none object-contain object-center"
          loading="lazy"
        />
      </section>
      <FAQAccordion />
      <section className="w-full bg-[#FFFAEB]">
        <img
          src={StartupIndiaImg}
          alt="Why Gawri Ganga — our story and values"
          className="block h-auto w-full max-w-none object-contain object-center"
          loading="lazy"
        />
      </section>
    </div>
  )
}

export default Home