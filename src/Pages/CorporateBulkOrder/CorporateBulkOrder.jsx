import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import logo from '../../assets/gglogo.svg'
import { FaCheckCircle, FaBuilding, FaHandshake, FaTruck } from 'react-icons/fa'
import CorporateBulkInquiryForm from '../../components/CorporateBulkInquiryForm'

const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '')
const PAGE_PATH = '/corporate-bulk-orders'
const PAGE_URL = `${SITE}${PAGE_PATH}`

const GOLD_DIVIDER = 'border-amber-800/40'

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Corporate & bulk orders | Gawri Ganga',
  description:
    'Wholesale and corporate bulk orders for authentic Nepali Rudraksha, Tulsi malas, aura sprays, and spiritual accessories—better pricing for businesses, temples, and institutions.',
  url: PAGE_URL,
  isPartOf: {
    '@type': 'WebSite',
    name: 'Gawri Ganga',
    url: SITE,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Gawri Ganga',
    url: SITE,
  },
}

const bullets = [
  'Volume pricing for Rudraksha malas, bracelets, Tulsi malas, sprays, and curated combos',
  'Support for corporates, wellness studios, temples, retailers, and gifting programs',
  'Clear timelines, dispatch from Noida, and help with GST documentation when required',
]

export default function CorporateBulkOrder() {
  return (
    <div className="min-h-screen bg-[#FFFAEB]">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(webPageJsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="flex justify-center mb-10 sm:mb-12">
          <Link to="/" className="inline-block" aria-label="Gawri Ganga Home">
            <img src={logo} alt="Gawri Ganga" className="w-36 h-auto sm:w-44 md:w-52" />
          </Link>
        </div>

        <header className="text-center mb-10 sm:mb-14">
          <h1 className="about-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-stone-800 tracking-tight">
            Corporate &amp; bulk orders
          </h1>
          <div className={`mt-6 mx-auto w-24 sm:w-32 h-px border-t ${GOLD_DIVIDER}`} aria-hidden />
          <p className="about-body mt-6 text-stone-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Better pricing for teams, retailers, temples, and wellness brands—authentic Nepali Rudraksha, Tulsi malas,
            aura sprays, and spiritual accessories with reliable dispatch across India.
          </p>
        </header>

        <section className="mb-12 sm:mb-14" aria-labelledby="bulk-why-heading">
          <h2 id="bulk-why-heading" className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-6">
            Why businesses choose Gawri Ganga for bulk
          </h2>
          <ul className="space-y-4">
            {bullets.map((text) => (
              <li key={text} className="flex gap-3 about-body text-stone-700">
                <FaCheckCircle className="text-amber-800/90 shrink-0 mt-0.5" aria-hidden />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className={`w-full h-px border-t ${GOLD_DIVIDER} mb-10 sm:mb-12`} aria-hidden />

        <section className="grid sm:grid-cols-3 gap-6 mb-12 sm:mb-14" aria-label="How it works">
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center text-amber-800/90 mb-3">
              <FaBuilding className="text-lg" aria-hidden />
            </div>
            <h3 className="about-heading font-semibold text-stone-800 mb-2">Tell us your need</h3>
            <p className="about-body text-stone-600 text-sm leading-relaxed">
              Share products, quantities, delivery region, and whether you need GST invoicing or repeat supply.
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center text-amber-800/90 mb-3">
              <FaHandshake className="text-lg" aria-hidden />
            </div>
            <h3 className="about-heading font-semibold text-stone-800 mb-2">Receive a quote</h3>
            <p className="about-body text-stone-600 text-sm leading-relaxed">
              Our team responds with tiered pricing, lead times, and any customization options that apply.
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:col-span-1">
            <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center text-amber-800/90 mb-3">
              <FaTruck className="text-lg" aria-hidden />
            </div>
            <h3 className="about-heading font-semibold text-stone-800 mb-2">Confirm &amp; dispatch</h3>
            <p className="about-body text-stone-600 text-sm leading-relaxed">
              Once approved, we align on payment terms and ship with the same quality checks as our retail orders.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm" aria-labelledby="bulk-form-heading">
          <h2 id="bulk-form-heading" className="about-heading text-2xl font-semibold text-stone-800 mb-2">
            Request a bulk quote
          </h2>
          <p className="about-body text-stone-600 mb-6 text-sm sm:text-base">
            The more specific you are about SKUs and quantities, the faster we can quote. We typically reply within 1–2
            business days (Mon–Sat).
          </p>
          <CorporateBulkInquiryForm source="corporate_bulk_page" />
        </section>

        <div className="mt-12 sm:mt-14 text-center">
          <div className={`w-full h-px border-t ${GOLD_DIVIDER} mb-8`} aria-hidden />
          <p className="about-body text-stone-600 mb-3">
            Prefer email? Write to{' '}
            <a href="mailto:support@gawriganga.com?subject=Bulk%20order%20inquiry" className="text-primary font-medium hover:underline break-all">
              support@gawriganga.com
            </a>
          </p>
          <Link to="/" className="about-body text-stone-600 hover:text-primary transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
