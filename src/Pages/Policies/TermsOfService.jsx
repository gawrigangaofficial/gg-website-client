import React from 'react'
import { Link } from 'react-router-dom'

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-stone-50/95">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link to="/" className="about-body text-primary hover:underline text-sm mb-6 inline-block">
          ← Back to Home
        </Link>
        <h1 className="about-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-stone-800 tracking-tight">
          Terms of Service
        </h1>
        <p className="about-body mt-4 text-stone-600 text-lg">
          Last updated: {new Date().toLocaleDateString('en-IN')}
        </p>
        <div className="mt-10 space-y-10 about-body text-stone-700 leading-relaxed">
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the Gawri Ganga website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or purchase our products.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              2. Use of Our Services
            </h2>
            <p>
              Our website offers authentic rudraksha, aura sprays, and spiritual accessories. You agree to use our services only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the site. You must not use the site to transmit harmful, offensive, or illegal content.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              3. Account and Orders
            </h2>
            <p>
              When you create an account or place an order, you are responsible for providing accurate information. You must be at least 18 years of age (or the age of majority in your jurisdiction) to make a purchase. We reserve the right to refuse or cancel orders at our discretion.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              4. Intellectual Property
            </h2>
            <p>
              All content on this website, including text, images, logos, and design, is the property of Gawri Ganga or its licensors. You may not copy, reproduce, or use any content without our prior written permission.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              5. Contact
            </h2>
            <p>
              For questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:support@gawriganga.com" className="text-primary hover:underline">
                support@gawriganga.com
              </a>{' '}
              or visit our <Link to="/contact" className="text-primary hover:underline">Contact</Link> page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
