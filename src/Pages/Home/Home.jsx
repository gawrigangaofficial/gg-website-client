import React from 'react'
import WebsiteCarousel from '../../components/WebsiteCarousel'
import RashiSection from '../Home/RashiSection'
import FAQAccordion from '../Home/FAQAccordion'
import SpraySection from '../Home/SpraySection'

const Home = () => {
  return (
    <>
      <WebsiteCarousel />
      <SpraySection />
      <RashiSection />
      <FAQAccordion />
    </>
  )
}

export default Home