import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import Loader from '../../components/Loader'
import Breadcrumbs, { ExploreLinks } from '../../components/Breadcrumbs'
import { CategoryFaq, CollectionSchema } from '../../components/CategorySeo'
import { apiFetch } from '../../config/api.js'
import { LAB_LINE } from '../../config/site'
import { MUKHI } from '../../content/mukhi'
import { RASHIS, getRashi, rashiFaqs, rashiMukhis, rashiPageMeta } from '../../content/rashi'
import { pricingFromProduct } from '../../utils/productPricing'

/** /rashi/<name>: one landing page per rashi, e.g. /rashi/tula for "rudraksha for tula rashi". */
const RashiSignPage = () => {
  const { slug } = useParams()
  const rashi = getRashi(slug)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!rashi) return undefined
    let cancelled = false
    const mukhis = rashiMukhis(rashi.value).map((m) => Number.parseInt(m, 10))
    apiFetch('/api/products?category=Rudraksha&limit=100')
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        const list = (json?.data || []).filter((p) =>
          mukhis.some((n) => new RegExp(`(^|\\D)${n}\\s*-?\\s*mukhi`, 'i').test(`${p.name} ${p.slug}`) && !/combo|mala/i.test(p.name)),
        )
        setProducts(list)
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [rashi])

  if (!rashi) return <Navigate to="/rashi" replace />

  const meta = rashiPageMeta(rashi)
  const mukhis = rashiMukhis(rashi.value)
  const faqs = rashiFaqs(rashi).map((f) => ({ question: f.q, answer: f.a }))

  return (
    <div className="min-h-screen bg-[#FFFAEB] py-6">
      <CollectionSchema name={meta.h1} description={meta.description} path={`/rashi/${rashi.slug}`} faqs={faqs} />
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <Breadcrumbs items={[{ name: 'Rudraksha by rashi', href: '/rashi' }, { name: `${rashi.name} rashi`, href: `/rashi/${rashi.slug}` }]} />
        <ExploreLinks />
        <header className="max-w-3xl">
          <h1 className="font-heading text-3xl font-bold text-stone-900 md:text-4xl">{meta.h1}</h1>
          <p className="mt-3 text-base leading-relaxed text-stone-700">
            {rashi.name} ({rashi.english}) is ruled by {rashi.planet}. In Vedic tradition the Rudraksha linked with {rashi.planet} is
            worn by people of this rashi, and the 5 Mukhi suits every sign. Every bead is tested by {LAB_LINE}.
          </p>
        </header>

        <section className="mt-8" aria-labelledby="rashi-mukhi-heading">
          <h2 id="rashi-mukhi-heading" className="font-heading text-2xl font-bold text-stone-900">
            Rudraksha traditionally suggested for {rashi.name}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {mukhis.map((m) => {
              const info = MUKHI[Number.parseInt(m, 10)]
              return (
                <li key={m} className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
                  <p className="text-lg font-bold text-primary">{m}</p>
                  <p className="mt-1 text-sm text-stone-700">
                    {info.deity} · {info.planet}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">Mantra: {info.mantra}</p>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="mt-10" aria-labelledby="rashi-products-heading">
          <h2 id="rashi-products-heading" className="font-heading text-2xl font-bold text-stone-900">
            Shop Rudraksha for {rashi.name} rashi
          </h2>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader />
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} variant="rudraksh" calculatePricing={pricingFromProduct} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 max-w-3xl" aria-labelledby="rashi-wear-heading">
          <h2 id="rashi-wear-heading" className="font-heading text-2xl font-bold text-stone-900">How to wear it</h2>
          <p className="mt-2 text-base leading-relaxed text-stone-700">
            Start on a calm morning after bathing, chant the bead&apos;s mantra 108 times and wear it on a thread or chain so it touches the skin.
            Read the full steps in <Link to="/blog/how-to-wear-rudraksha" className="font-semibold text-primary">how to wear Rudraksha</Link> and{' '}
            <Link to="/blog/rudraksha-by-rashi" className="font-semibold text-primary">Rudraksha by rashi</Link>.
          </p>
        </section>

        <div className="max-w-3xl">
          <CategoryFaq faqs={faqs} />
        </div>

        <nav className="mt-10" aria-label="Other rashis">
          <h2 className="font-heading text-xl font-bold text-stone-900">Rudraksha for other rashis</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {RASHIS.filter((r) => r.slug !== rashi.slug).map((r) => (
              <li key={r.slug}>
                <Link to={`/rashi/${r.slug}`} className="inline-flex rounded-full border border-orange-200 bg-white px-3 py-1.5 text-sm font-semibold text-primary">
                  {r.name} ({r.hindi})
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default RashiSignPage
