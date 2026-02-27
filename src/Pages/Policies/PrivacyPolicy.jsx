import React from 'react'
import { Link } from 'react-router-dom'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-stone-50/95">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link to="/" className="about-body text-primary hover:underline text-sm mb-6 inline-block">
          ← Back to Home
        </Link>
        <h1 className="about-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-stone-800 tracking-tight">
          Privacy Policy
        </h1>
        <p className="about-body mt-4 text-stone-600 text-lg">
          Last updated: {new Date().toLocaleDateString('en-IN')}
        </p>
        <div className="mt-10 space-y-10 about-body text-stone-700 leading-relaxed">
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide when you register, place an order, subscribe to our newsletter, or contact us. This may include your name, email address, phone number, shipping and billing address, and payment-related information. We may also collect usage data (e.g. IP address, browser type, pages visited) to improve our website and services.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              2. How We Use Your Information
            </h2>
            <p>
              We use your information to process orders, send order and shipping updates, respond to enquiries, send promotional communications (with your consent), improve our website and products, and comply with legal obligations. We do not sell your personal information to third parties.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              3. Sharing and Disclosure
            </h2>
            <p>
              We may share your information with service providers who assist in payment processing, delivery, and marketing (e.g. courier partners, email service providers). These parties are required to protect your data and use it only for the purposes we specify. We may disclose information if required by law or to protect our rights and safety.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              4. Data Security
            </h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, or loss. Payment details are processed through secure gateways; we do not store your full card number on our servers.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              5. Cookies and Tracking
            </h2>
            <p>
              Our website may use cookies and similar technologies to enhance your experience, remember preferences, and analyse traffic. You can manage cookie settings through your browser. Disabling certain cookies may affect site functionality.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              6. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal data where applicable. You may opt out of marketing emails at any time. For requests or questions about your data, contact us at{' '}
              <a href="mailto:support@gawriganga.com" className="text-primary hover:underline">
                support@gawriganga.com
              </a>.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              7. Contact
            </h2>
            <p>
              For privacy-related queries, email{' '}
              <a href="mailto:support@gawriganga.com" className="text-primary hover:underline">
                support@gawriganga.com
              </a>{' '}
              or use our <Link to="/contact" className="text-primary hover:underline">Contact</Link> page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
