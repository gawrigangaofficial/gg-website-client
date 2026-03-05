import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaInstagram,
  FaFacebookF,
  FaEnvelope,
  FaPhone,
  FaPinterest,
  FaYoutube,
  FaLinkedinIn,
  FaArrowRight,
} from 'react-icons/fa'
import logo from '../assets/gglogo.svg'

const Footer = () => {
  const [email, setEmail] = useState('')

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Rashi', href: '/rashi' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Terms of Service', href: '/terms-of-service' },
  ]

  const policies = [
    { name: 'Refund & Cancellation', href: '/refund-cancellation' },
    { name: 'Terms & Conditions', href: '/terms-and-conditions' },
    { name: 'Shipping Policy', href: '/shipping-policy' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
  ]

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) {
      // TODO: connect to backend when ready
      setEmail('')
    }
  }

  return (
    <footer className="bg-primary mt-auto overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-14 min-w-0">
        {/* Mobile: stacked layout with clear sections; Desktop: 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-8 lg:gap-10">
          {/* Column 1: Company info – compact on mobile */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left pb-6 sm:pb-0 border-b border-white/20 sm:border-b-0">
            <Link to="/" className="inline-block bg-[#FFEEE5] rounded-lg p-2 shadow-md">
              <img src={logo} alt="Gawri Ganga" className="w-14 h-14 sm:w-14 sm:h-14 md:w-16 md:h-16" />
            </Link>
            <p className="mt-3 font-heading font-semibold text-white text-sm">
              Authentic · Spiritual · Lifestyle
            </p>
            <p className="mt-2 text-white/95 text-sm leading-relaxed max-w-[280px] sm:max-w-xs mx-auto lg:mx-0">
              Discover authentic rudraksha, aura sprays and spiritual accessories at Gawri Ganga.
            </p>
            <a
              href="mailto:support@gawriganga.com"
              className="mt-3 text-white font-semibold hover:underline text-sm break-all"
            >
              gawrigangaofficial@gmail.com
            </a>
            {/* Full address block – hidden on mobile, visible from sm */}
            <div className="mt-4 space-y-1.5 text-white/95 text-xs sm:text-sm text-left max-w-xs mx-auto lg:mx-0 lg:max-w-none break-words hidden sm:block">
              <p>Gawri Ganga</p>
              <p className="text-white font-medium">GST: 09AAFCE9670A1ZL</p>
              <p>Head Office — A-59, Sector-27, Noida-201301, New Delhi, India</p>
              <p>Mon–Sat, 10 AM–6 PM</p>
            </div>
          </div>

          {/* Mobile: Quick Links + Policies in one row, 2 columns */}
          <div className="grid grid-cols-2 gap-6 sm:gap-0 sm:contents">
            <div className="text-left sm:text-left">
              <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-3">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-white/95 hover:text-white transition-colors text-sm inline-block py-1 active:opacity-80"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-left sm:text-left">
              <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-3">
                Policies
              </h3>
              <ul className="space-y-2">
                {policies.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-white/95 hover:text-white transition-colors text-sm inline-block py-1 active:opacity-80"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Newsletter & Social – full width on mobile/sm */}
          <div className="max-w-sm w-full mx-auto sm:mx-0 sm:col-span-2 lg:col-span-1 lg:max-w-none pt-4 sm:pt-0 border-t border-white/20 sm:border-t-0">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-3 text-center sm:text-left">
              Get our exclusive offers
            </h3>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 min-w-0 px-4 py-3.5 sm:py-2.5 text-sm text-gray-900 bg-white border border-white rounded-xl sm:rounded-l-xl sm:rounded-r-none placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="px-5 py-3.5 sm:py-2.5 bg-white text-primary rounded-xl sm:rounded-r-xl sm:rounded-l-none hover:bg-white/95 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary flex items-center justify-center gap-2 min-h-[48px] sm:min-h-0 font-medium text-sm"
                aria-label="Subscribe"
              >
                <span className="sm:hidden">Subscribe</span>
                <FaArrowRight className="text-lg shrink-0" />
              </button>
            </form>
            <p className="mt-2 text-white/90 text-xs text-center sm:text-left">
              Get exclusive coupons in your mailbox.
            </p>
            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 sm:w-9 sm:h-9 rounded-full border-2 border-white/60 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors shrink-0"
              >
                <FaFacebookF className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="Pinterest"
                className="w-10 h-10 sm:w-9 sm:h-9 rounded-full border-2 border-white/60 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors shrink-0"
              >
                <FaPinterest className="text-sm" />
              </a>
              <a
                href="https://www.instagram.com/gawriganga.in?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                aria-label="Instagram"
                className="w-10 h-10 sm:w-9 sm:h-9 rounded-full border-2 border-white/60 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors shrink-0"
              >
                <FaInstagram className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-10 h-10 sm:w-9 sm:h-9 rounded-full border-2 border-white/60 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors shrink-0"
              >
                <FaYoutube className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 sm:w-9 sm:h-9 rounded-full border-2 border-white/60 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors shrink-0"
              >
                <FaLinkedinIn className="text-sm" />
              </a>
              <a
                href="mailto:gawrigangaofficial@gmail.com"
                aria-label="Email"
                className="w-10 h-10 sm:w-9 sm:h-9 rounded-full border-2 border-white/60 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors shrink-0"
              >
                <FaEnvelope className="text-sm" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 sm:mt-10 md:mt-12 pt-6 border-t border-white/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-white/90 text-sm">
            © {new Date().getFullYear()} Gawri Ganga. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-sm">
            <Link to="/privacy-policy" className="text-white/90 hover:text-white transition-colors py-1">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-white/90 hover:text-white transition-colors py-1">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
