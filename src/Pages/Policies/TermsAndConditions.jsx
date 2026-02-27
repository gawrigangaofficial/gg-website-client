import React from 'react'
import { Link } from 'react-router-dom'

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-stone-50/95">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link to="/" className="about-body text-primary hover:underline text-sm mb-6 inline-block">
          ← Back to Home
        </Link>
        <h1 className="about-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-stone-800 tracking-tight">
          Terms and Conditions
        </h1>
        <p className="about-body mt-4 text-stone-600 text-lg">
          Last updated: {new Date().toLocaleDateString('en-IN')}
        </p>
        <div className="mt-10 space-y-10 about-body text-stone-700 leading-relaxed">
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              1. General
            </h2>
            <p>
              These Terms and Conditions govern your use of the Gawri Ganga website and any purchase of products from us. By placing an order or using the site, you agree to these terms in full.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              2. Products and Pricing
            </h2>
            <p>
              We strive to display accurate product descriptions and prices. We reserve the right to correct pricing errors and to modify or discontinue products without notice. All prices are in Indian Rupees (INR) unless otherwise stated and may be subject to applicable taxes.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              3. Payment and Security
            </h2>
            <p>
              Payment can be made via the methods offered at checkout (e.g. card, UPI, net banking, cash on delivery where available). You are responsible for ensuring that your payment details are correct. We use secure payment gateways; we do not store your full card details on our servers.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              4. Limitation of Liability
            </h2>
            <p>
              Gawri Ganga shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website or products. Our liability is limited to the amount you paid for the product in question. Spiritual and wellness products are used at your own discretion.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              5. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Noida/National Capital Region, India.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              6. Contact
            </h2>
            <p>
              For any queries regarding these Terms and Conditions, contact us at{' '}
              <a href="mailto:support@gawriganga.com" className="text-primary hover:underline">
                support@gawriganga.com
              </a>{' '}
              or through our <Link to="/contact" className="text-primary hover:underline">Contact</Link> page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions
