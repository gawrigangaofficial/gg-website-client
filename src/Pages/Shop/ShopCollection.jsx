import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import Loader from '../../components/Loader'
import Breadcrumbs, { ExploreLinks } from '../../components/Breadcrumbs'
import { CategoryFaq, CollectionSchema } from '../../components/CategorySeo'
import { apiFetch } from '../../config/api.js'
import { pricingFromProduct } from '../../utils/productPricing'
import { getCardReviewCount } from '../../utils/reviewDisplayCount.js'
import { getShopCollection } from '../../content/shopCollections'
import { collectionMeta } from '../../seo/meta'
import { CATEGORY_FAQS } from '../../content/categoryFaqs'

const ShopCollection = () => {
  const { slug } = useParams()
  const collection = getShopCollection(slug)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!collection) {
      setLoading(false)
      setProducts([])
      return undefined
    }
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({ limit: '100' })
        if (collection.purpose) params.set('purpose', collection.purpose)
        const response = await apiFetch(`/api/products?${params}`)
        if (!response.ok) throw new Error('Failed to load')
        const result = await response.json()
        const list = result?.success && Array.isArray(result.data) ? result.data : []
        const next = collection.test ? list.filter(collection.test) : list
        if (!cancelled) setProducts(next)
      } catch {
        if (!cancelled) setProducts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [collection])

  if (!collection) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold text-stone-900">This collection is not in the shop</h1>
        <Link to="/" className="mt-4 inline-block font-semibold text-primary">Back to home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFAEB] py-6">
      <CollectionSchema name={collection.title} description={collection.description} path={`/shop/${collection.slug}`} faqs={collection.faqs || CATEGORY_FAQS.general} />
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
        <Breadcrumbs items={[{ name: collection.title, href: `/shop/${collection.slug}` }]} />
        <ExploreLinks />
        <header className="mb-6 max-w-3xl">
          <h1 className="font-heading text-3xl font-bold text-stone-900 md:text-4xl">{collectionMeta(collection.slug)?.h1 || collection.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-700 md:text-base">{collection.description}</p>
        </header>
        {loading ? (
          <div className="flex h-64 items-center justify-center"><Loader size="lg" /></div>
        ) : products.length === 0 ? (
          <p className="text-stone-600">No products in this collection right now.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="rudraksh"
                calculatePricing={pricingFromProduct}
                getReviewCount={getCardReviewCount}
              />
            ))}
          </div>
        )}
        {collection.sections?.length ? (
          <section className="mt-10 max-w-3xl space-y-6" aria-label="Buying guide">
            {collection.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-heading text-xl font-bold text-stone-900 md:text-2xl">{section.heading}</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-700 md:text-base">{section.body}</p>
              </div>
            ))}
          </section>
        ) : null}
        <CategoryFaq faqs={collection.faqs || CATEGORY_FAQS.general} />
      </div>
    </div>
  )
}

export default ShopCollection
