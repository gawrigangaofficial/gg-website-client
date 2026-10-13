import React from 'react'
import { Link } from 'react-router-dom'

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-[#FFFAEB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link to="/" className="about-body text-primary hover:underline text-sm mb-6 inline-block">
          ← Back to Home
        </Link>
        <h1 className="about-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-stone-800 tracking-tight">
          Return Policy
        </h1>
        <p className="about-body mt-4 text-stone-600 text-lg">
          Last updated: {new Date().toLocaleDateString('en-IN')}
        </p>

        <div className="mt-8 space-y-6 about-body text-stone-700 leading-relaxed">
          <div className="bg-amber-50/50 p-5 rounded-lg border border-amber-800/10">
            <p className="text-stone-700">
              We currently do not have an active return policy.
            </p>
          </div>

          <p>
            Our team is actively working on creating a clear and fair return policy for all customers.
            Once finalized, this page will be updated with complete details.
          </p>

          <p>
            For any order-related help in the meantime, please contact us at{' '}
            <a href="mailto:support@gawriganga.com" className="text-primary hover:underline">
              support@gawriganga.com
            </a>{' '}
            or visit our <Link to="/contact" className="text-primary hover:underline">Contact</Link> page.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReturnPolicy
