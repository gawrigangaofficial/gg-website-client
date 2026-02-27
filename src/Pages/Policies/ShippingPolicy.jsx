import React from 'react'
import { Link } from 'react-router-dom'

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-stone-50/95">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link to="/" className="about-body text-primary hover:underline text-sm mb-6 inline-block">
          ← Back to Home
        </Link>
        <h1 className="about-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-stone-800 tracking-tight">
          Shipping Policy
        </h1>
        <p className="about-body mt-4 text-stone-600 text-lg">
          Last updated: {new Date().toLocaleDateString('en-IN')}
        </p>
        <div className="mt-10 space-y-10 about-body text-stone-700 leading-relaxed">
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              1. Delivery Areas
            </h2>
            <p>
              We ship across India. Delivery timelines and charges may vary by location. Pin code availability is confirmed at checkout. We do not currently ship internationally unless otherwise announced.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              2. Processing and Dispatch
            </h2>
            <p>
              Orders are processed on business days (Monday–Saturday). After you place an order, we aim to dispatch within 2–4 business days. You will receive an email/SMS with tracking details once the order is shipped. Custom or bulk orders may take longer; we will inform you of any delay.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              3. Delivery Time
            </h2>
            <p>
              Standard delivery typically takes 5–7 business days within the same state and 7–14 business days for other regions, depending on the courier and your location. Express delivery options may be available at checkout where applicable.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              4. Shipping Charges
            </h2>
            <p>
              Shipping charges are calculated at checkout based on your delivery address and order value. Free shipping may apply for orders above a certain amount as per ongoing offers. Cash on delivery (COD) may carry an additional charge.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              5. Lost or Delayed Shipments
            </h2>
            <p>
              If your order is delayed or lost in transit, please contact us with your order number. We will coordinate with the courier and assist with tracking or replacement as per our Refund & Cancellation Policy.
            </p>
          </section>
          <section>
            <h2 className="about-heading text-xl sm:text-2xl font-semibold text-stone-800 mb-3">
              6. Contact
            </h2>
            <p>
              For shipping-related queries, email{' '}
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

export default ShippingPolicy
