import React from 'react'
import { Link } from 'react-router-dom'
import {
  FaInstagram,
  FaFacebookF,
  FaEnvelope,
  FaYoutube,
  FaWhatsapp,
  FaMapMarkerAlt,
} from 'react-icons/fa'
import logoWhite from '../assets/gglogo-white.webp'
import { ADDRESS, EMAIL, FOUNDED_YEAR, LABS, WHATSAPP_NUMBER } from '../config/site'
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
  const { isAuthenticated } = useAuth()
  const trackHref = isAuthenticated ? '/profile' : '/login'
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Namaste! I need help choosing a Rudraksha.')}`

  return (
    <footer id="site-footer" className="mt-auto bg-[#7f1d2e] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        {/* Brand: logo, promise and how to reach us */}
        <div>
          <Link to="/" aria-label="Gawri Ganga home" className="inline-block">
            <img src={logoWhite} alt="Gawri Ganga" width="154" height="111" className="h-auto w-36" loading="lazy" />
          </Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            Since {FOUNDED_YEAR} · Lab-tested · COD across India
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/85">
            Original Nepali Rudraksha, Karungali and Tulsi malas. Every bead is tested by {LABS.join(' and ')}.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#7f1d2e] hover:bg-amber-50"
          >
            <FaWhatsapp aria-hidden /> Chat on WhatsApp
          </a>
          <ul className="mt-5 space-y-2 text-sm text-white/85">
            <li>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 hover:text-white">
                <FaEnvelope className="shrink-0 text-xs" aria-hidden /> {EMAIL}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-xs" aria-hidden /> {ADDRESS.full}
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4 xl:grid-cols-7">
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
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-white/25 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-white/80">© {new Date().getFullYear()} Gawri Ganga. All rights reserved.</p>
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

        <div className="mt-4 text-xs text-white/70">
          <p>Gawri Ganga is owned by BNB Basket and Boxes Gifting Solutions Private Limited. Sector 27, Noida, Uttar Pradesh, 201301. support@gawriganga.com</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
