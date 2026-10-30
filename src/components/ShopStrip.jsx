import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import { cleanName } from '../seo/meta'
import { pricingFromProduct } from '../utils/productPricing'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

/**
 * Product cards placed inside an article (a guide or blog post) so a reader can go straight to a product.
 * `compact` is the slim row after the intro; the default is the fuller grid at the end of the article.
 */
const ShopStrip = ({ products = [], title, id, compact = false, lang }) => {
  if (!products.length) return null
  const view = lang === 'hi' ? 'देखें' : 'View'
  return (
    <section className={compact ? 'my-8' : 'mt-10'} aria-labelledby={id}>
      {/* The slim row is a label inside the article, not a section of it, so it does not add a heading. */}
      {compact ? (
        <p id={id} className="!m-0 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          {title}
        </p>
      ) : (
        <h2 id={id} className="text-2xl font-bold text-stone-900">
          {title}
        </h2>
      )}
      <ul
        className={
          compact
            ? '-mx-1 mt-3 flex snap-x gap-3 overflow-x-auto px-1 pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible'
            : 'mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3'
        }
      >
        {products.map((p) => {
          const { currentPrice, originalPrice, discount } = pricingFromProduct(p)
          const name = cleanName(p.name)
          return (
            <li key={p.slug} className={compact ? 'w-40 shrink-0 snap-start sm:w-auto' : ''}>
              <Link
                to={`/product/${p.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-orange-100 bg-white p-3 shadow-sm transition hover:border-primary/40 hover:shadow-md"
              >
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={name} loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
                ) : null}
                <span className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-stone-900">{name}</span>
                <span className="mt-1 text-sm">
                  <span className="font-bold text-primary">{inr(currentPrice)}</span>
                  {discount > 0 && originalPrice > currentPrice ? (
                    <span className="ml-1.5 text-xs text-stone-400 line-through">{inr(originalPrice)}</span>
                  ) : null}
                </span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-primary">
                  {view} <FaArrowRight aria-hidden className="text-xs transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default ShopStrip
