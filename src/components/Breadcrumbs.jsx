import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'

const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '')

const EXPLORE = [
  { href: '/rudraksha', label: 'Nepali Rudraksha' },
  { href: '/tulsimala', label: 'Tulsi malas' },
  { href: '/accessories', label: 'Bracelets and Karungali' },
  { href: '/sprays', label: 'Aura sprays' },
  { href: '/rashi', label: 'Rudraksha by rashi' },
  { href: '/combos', label: 'Gift sets' },
  { href: '/guides', label: 'Guides' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/corporate-bulk-orders', label: 'Bulk gifting' },
]

export default function Breadcrumbs({ items }) {
  const list = [{ name: 'Home', href: '/' }, ...items]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE}${item.href === '/' ? '/' : item.href}`,
    })),
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-stone-600">
        {list.map((item, index) => {
          const current = index === list.length - 1
          return (
            <span key={`${item.href}-${item.name}`} className="inline-flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {current ? (
                <span className="font-medium text-stone-900" aria-current="page">{item.name}</span>
              ) : (
                <Link to={item.href} className="font-semibold text-primary">{item.name}</Link>
              )}
            </span>
          )
        })}
      </nav>
    </>
  )
}

export function ExploreLinks() {
  const { pathname } = useLocation()
  const links = EXPLORE.filter((item) => pathname !== item.href && !pathname.startsWith(`${item.href}/`))
  if (!links.length) return null

  return (
    <nav aria-label="More pages" className="mb-6 flex flex-wrap gap-2">
      {links.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 ring-1 ring-orange-200 hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
