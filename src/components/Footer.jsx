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
    <footer className="bg-primary mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Company info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block bg-[#FFEEE5] rounded-lg p-2 shadow-md">
              <img src={logo} alt="Gawri Ganga" className="w-14 h-14 md:w-16 md:h-16" />
            </Link>
            <p className="mt-3 font-heading font-semibold text-white text-sm">
              Authentic · Spiritual · Lifestyle
            </p>
            <p className="mt-3 text-white/95 text-sm leading-relaxed max-w-xs">
              Discover authentic rudraksha, aura sprays and spiritual accessories at Gawri Ganga.
            </p>
            <div className="mt-4 space-y-1.5 text-white/95 text-sm">
              <p>Gawri Ganga</p>
              <p className="text-white font-medium">GST: [To be added]</p>
              <p>CIN: [To be added]</p>
              <p>Head Office — A-59, Sector-27, Noida-201301, New Delhi, India</p>
              <p>Grievance Officer — [Name to be added]</p>
              <p>Mon–Sat, 10 AM–6 PM</p>
              <a
                href="mailto:support@gawriganga.com"
                className="inline-block text-white font-semibold hover:underline mt-1"
              >
                support@gawriganga.com
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-white/95 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div>
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Policies
            </h3>
            <ul className="space-y-2.5">
              {policies.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-white/95 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Social */}
          <div>
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Get our exclusive offers
            </h3>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="flex-1 min-w-0 px-3 py-2.5 text-sm text-gray-900 bg-white border border-white rounded-l-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-white text-primary rounded-r-lg hover:bg-white/95 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                aria-label="Subscribe"
              >
                <FaArrowRight className="text-lg" />
              </button>
            </form>
            <p className="mt-2 text-white/95 text-xs">
              Get exclusive coupons in your mailbox.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border-2 border-white/60 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
              >
                <FaFacebookF className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="Pinterest"
                className="w-9 h-9 rounded-full border-2 border-white/60 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
              >
                <FaPinterest className="text-sm" />
              </a>
              <a
                href="https://www.instagram.com/gawriganga.in?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border-2 border-white/60 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
              >
                <FaInstagram className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border-2 border-white/60 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
              >
                <FaYoutube className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border-2 border-white/60 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
              >
                <FaLinkedinIn className="text-sm" />
              </a>
              <a
                href="mailto:support@gawriganga.com"
                aria-label="Email"
                className="w-9 h-9 rounded-full border-2 border-white/60 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
              >
                <FaEnvelope className="text-sm" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/95 text-sm">
            © {new Date().getFullYear()} Gawri Ganga. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/privacy-policy" className="text-white/95 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-white/95 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
