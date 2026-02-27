import React from 'react'
import { Link } from 'react-router-dom'

const RefundCancellation = () => {
  return (
    <div className="min-h-screen bg-stone-50/95">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link to="/" className="about-body text-primary hover:underline text-sm mb-6 inline-block">
          ← Back to Home
        </Link>
        <h1 className="about-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-stone-800 tracking-tight">
          Refund & Cancellation Policy
        </h1>
        <p className="about-body mt-4 text-stone-600 text-lg">
          Last updated: {new Date().toLocaleDateString('en-IN')}
        </p>
        <div className="mt-10 space-y-10 about-body text-stone-700 leading-relaxed">
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              1. Order Cancellation
            </h2>
            <p>
              You may cancel your order free of charge before it has been shipped. Once the order has been dispatched, we cannot guarantee cancellation. To cancel, please contact us as soon as possible at{' '}
              <a href="mailto:support@gawriganga.com" className="text-primary hover:underline">
                support@gawriganga.com
              </a>.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              2. Refund Eligibility
            </h2>
            <p>
              We offer refunds or replacements for products that are defective, damaged in transit, or not as described. Refund requests must be raised within 7 days of receiving the product. Please retain the original packaging and share images of the issue where applicable.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              3. Refund Process
            </h2>
            <p>
              Once your return or refund request is approved, we will process the refund to your original payment method within 7–10 business days. The exact time may vary depending on your bank or payment provider. For cash on delivery (COD) orders, refunds will be issued via bank transfer or another method we communicate to you.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              4. Non-Refundable Items
            </h2>
            <p>
              Certain items may be non-refundable due to hygiene or customisation (e.g. personalised rudraksha malas). Such exceptions will be clearly mentioned on the product page. Change of mind or incorrect size/choice may not qualify for a full refund unless otherwise stated.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              5. Contact
            </h2>
            <p>
              For refund or cancellation requests, email us at{' '}
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

export default RefundCancellation
