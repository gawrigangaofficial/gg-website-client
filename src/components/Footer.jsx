import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaInstagram,
  FaFacebookF,
  FaEnvelope,
  FaYoutube,
  FaArrowRight,
} from 'react-icons/fa'
import { FOOTER_COLUMNS } from '../content/footerNav'
import { useAuth } from '../context/AuthContext'

function FooterLink({ item, trackHref }) {
  const href = item.track ? trackHref : item.href
  return (
    <li>
      <Link to={href} className="inline-block py-0.5 text-sm leading-snug text-white/90 hover:text-white">
        {item.name}
      </Link>
    </li>
  )
}

function LinkList({ links, trackHref }) {
  return (
    <ul className="space-y-1.5">
      {links.map((item) => (
        <FooterLink key={item.name} item={item} trackHref={trackHref} />
      ))}
    </ul>
  )
}

const Footer = () => {
  const [email, setEmail] = useState('')
  const { isAuthenticated } = useAuth()
  const trackHref = isAuthenticated ? '/profile' : '/login'

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) setEmail('')
  }

  return (
    <footer id="site-footer" className="mt-auto bg-[#7f1d2e] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 xl:grid-cols-7">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className={column.wide ? 'col-span-2' : ''}>
              <h3 className="mb-3 font-heading text-sm font-bold">{column.title}</h3>
              {column.groups ? (
                <div className="grid grid-cols-2 gap-x-4">
                  {column.groups.map((group) => (
                    <LinkList key={group[0].href} links={group} trackHref={trackHref} />
                  ))}
                </div>
              ) : (
                <LinkList links={column.links} trackHref={trackHref} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 border-t border-white/25 pt-6 md:grid-cols-[1.4fr_1fr] md:items-end">
          <form onSubmit={handleNewsletterSubmit} className="flex max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="min-w-0 flex-1 rounded-xl bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Email for newsletter"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#7f1d2e]"
            >
              Subscribe
              <FaArrowRight aria-hidden />
            </button>
          </form>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a href="https://www.facebook.com/profile.php?id=61589197491701" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full border border-white/60 hover:bg-white hover:text-[#7f1d2e]">
              <FaFacebookF className="text-sm" />
            </a>
            <a href="https://www.instagram.com/gawriganga.in" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-white/60 hover:bg-white hover:text-[#7f1d2e]">
              <FaInstagram className="text-sm" />
            </a>
            <a href="https://www.youtube.com/@gawri-ganga" aria-label="YouTube" className="grid h-9 w-9 place-items-center rounded-full border border-white/60 hover:bg-white hover:text-[#7f1d2e]">
              <FaYoutube className="text-sm" />
            </a>
            <a href="mailto:support@gawriganga.com" aria-label="Email" className="grid h-9 w-9 place-items-center rounded-full border border-white/60 hover:bg-white hover:text-[#7f1d2e]">
              <FaEnvelope className="text-sm" />
            </a>
          </div>
        </div>

        <div className="mt-6 text-sm text-white/80">
          <p>© {new Date().getFullYear()} Gawri Ganga. All rights reserved.</p>
          <p className="mt-1 text-xs">Gawri Ganga is owned by BNB Basket and Boxes Gifting Solutions Private Limited. Sector 27, Noida, Uttar Pradesh, 201301. support@gawriganga.com</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
