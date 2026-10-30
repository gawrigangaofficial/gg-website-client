import { Link } from 'react-router-dom'

const LINKS = [
  { to: '/rudraksha', label: 'Original Nepali Rudraksha' },
  { to: '/shop/karungali-mala', label: 'Karungali Mala' },
  { to: '/tulsimala', label: 'Tulsi Mala' },
  { to: '/accessories', label: 'Rudraksha Bracelets' },
  { to: '/guides', label: 'Guides' },
]

/** Shown for any URL without a route. The server returns status 404 for these URLs (see scripts/prerender.mjs). */
const NotFound = () => (
  <div className="min-h-[60vh] bg-[#FFFAEB] px-4 py-16">
    <div className="mx-auto max-w-xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">404</p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-stone-900 sm:text-4xl">This page does not exist</h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">
        The link may be old or mistyped. These are the pages most people are looking for:
      </p>
      <ul className="mt-6 flex flex-wrap justify-center gap-2">
        {LINKS.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="inline-flex rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-orange-50"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white">
        Go to the home page
      </Link>
    </div>
  </div>
)

export default NotFound
