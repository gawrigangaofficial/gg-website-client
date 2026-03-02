import React from 'react'
import WebsiteCarousel from '../../components/WebsiteCarousel'
import RashiSection from '../Home/RashiSection'
import FAQAccordion from '../Home/FAQAccordion'
import SpraySection from '../Home/SpraySection'
import RudrakshaSection from './RudrakshaSection'

const Home = () => {
  return (
    <>
      <WebsiteCarousel />
      <RudrakshaSection />
      <SpraySection />
      <RashiSection />
      <FAQAccordion />
    </>
  )
}

export default Home