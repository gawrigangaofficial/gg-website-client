import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/gglogo.svg'
import { FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa'

const GOLD_DIVIDER = 'border-amber-800/40'
const GOLD_ACCENT = 'text-amber-800/90'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: connect to backend when ready
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-stone-50/95">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Logo */}
        <div className="flex justify-center mb-10 sm:mb-14">
          <Link to="/" className="inline-block" aria-label="Gawri Ganga Home">
            <img
              src={logo}
              alt="Gawri Ganga"
              className="w-36 h-auto sm:w-44 md:w-52"
            />
          </Link>
        </div>

        {/* Headline */}
        <header className="text-center mb-12 sm:mb-16">
          <h1 className="about-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-stone-800 tracking-tight">
            Get in Touch
          </h1>
          <div
            className={`mt-6 mx-auto w-24 sm:w-32 h-px border-t ${GOLD_DIVIDER}`}
            aria-hidden
          />
          <p className="about-body mt-6 text-stone-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            We would love to hear from you. Reach out for queries, orders, or
            anything related to our Rudraksha and spiritual offerings.
          </p>
        </header>

        {/* Contact info + Form */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Contact details */}
          <div className="lg:w-80 shrink-0 space-y-8">
            <div
              className={`w-full h-px border-t ${GOLD_DIVIDER} lg:hidden`}
              aria-hidden
            />
            <div className="flex gap-4">
              <div
                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${GOLD_ACCENT} bg-amber-50`}
              >
                <FaMapMarkerAlt className="text-xl" aria-hidden />
              </div>
              <div>
                <h3 className="about-heading font-semibold text-stone-800 text-lg mb-1">
                  Visit us
                </h3>
                <p className="about-body text-stone-600 text-sm sm:text-base leading-relaxed">
                  A-59, Sector-27, Noida-201301,
                  <br />
                  New Delhi, India
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div
                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${GOLD_ACCENT} bg-amber-50`}
              >
                <FaEnvelope className="text-xl" aria-hidden />
              </div>
              <div>
                <h3 className="about-heading font-semibold text-stone-800 text-lg mb-1">
                  Email
                </h3>
                <a
                  href="mailto:support@gawriganga.com"
                  className="about-body text-stone-600 text-sm sm:text-base hover:text-primary transition-colors break-all"
                >
                  support@gawriganga.com
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <div
                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${GOLD_ACCENT} bg-amber-50`}
              >
                <FaClock className="text-xl" aria-hidden />
              </div>
              <div>
                <h3 className="about-heading font-semibold text-stone-800 text-lg mb-1">
                  Hours
                </h3>
                <p className="about-body text-stone-600 text-sm sm:text-base leading-relaxed">
                  Mon–Sat, 10 AM–6 PM
                </p>
              </div>
            </div>
          </div>

          {/* Divider (vertical on large) */}
          <div
            className={`w-full h-px border-t lg:w-px lg:h-auto lg:border-l ${GOLD_DIVIDER}`}
            aria-hidden
          />

          {/* Contact form */}
          <div className="flex-1 min-w-0">
            <h2 className="about-heading text-2xl font-semibold text-stone-800 mb-6">
              Send a message
            </h2>
            {submitted ? (
              <div className="p-6 rounded-lg bg-amber-50/80 border border-amber-200/60">
                <p className="about-body text-stone-700">
                  Thank you for your message. We will get back to you soon.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="about-body mt-4 text-primary font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="about-body block text-sm font-medium text-stone-700 mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="about-body w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800/50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="about-body block text-sm font-medium text-stone-700 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="about-body w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800/50"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="about-body block text-sm font-medium text-stone-700 mb-1.5"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="about-body w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800/50"
                    placeholder="What is this regarding?"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="about-body block text-sm font-medium text-stone-700 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="about-body w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800/50 resize-y min-h-[120px]"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg about-body font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <FaPaperPlane className="text-sm" aria-hidden />
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-14 sm:mt-16 text-center">
          <div
            className={`w-full h-px border-t ${GOLD_DIVIDER} mb-8`}
            aria-hidden
          />
          <Link
            to="/"
            className="about-body text-stone-600 hover:text-primary transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Contact
