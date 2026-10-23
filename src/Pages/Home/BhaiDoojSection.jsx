import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../config/api.js'
import { pricingFromProduct } from '../../utils/productPricing'

const FALLBACK = [
  {
    key: 'bracelets',
    label: 'Bracelets',
    href: '/accessories?subcategory=Bracelet',
    price: 499,
    image: 'https://ggimg-images.s3.ap-south-1.amazonaws.com/products/596a6c56cdd24330abdb19108d00b495-1.webp',
    alt: 'Rudraksha and bead bracelets',
  },
  {
    key: 'karungali',
    label: 'Karungali mala',
    href: '/product/karungali-spiritual-black-stone-japa-mala',
    price: 520,
    image: 'https://ggimg-images.s3.ap-south-1.amazonaws.com/products/d6b9d9c1468e46cd8425d0bbcba455f7-1.webp',
    alt: 'Karungali mala',
  },
]

function rupee(value) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(value) || 0)
}

function isRing(product) {
  return /ring/i.test(`${product?.name || ''} ${product?.slug || ''} ${product?.subcategory || ''}`)
}

function cheapest(products, test) {
  return products
    .filter((product) => test(product) && !isRing(product) && product?.images?.[0])
    .sort((a, b) => pricingFromProduct(a).currentPrice - pricingFromProduct(b).currentPrice)[0]
}

function tileFromProduct(product, label, href) {
  if (!product) return null
  return {
    label,
    href: href || `/product/${product.slug}`,
    price: pricingFromProduct(product).currentPrice,
    image: product.images[0],
    alt: product.name,
  }
}

const BhaiDoojSection = () => {
  const [tiles, setTiles] = useState(FALLBACK)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const response = await apiFetch('/api/products?category=Accessories&limit=80')
        if (!response.ok) return
        const result = await response.json()
        const products = result?.success && Array.isArray(result.data) ? result.data : []
        const bracelet = cheapest(products, (product) => /bracelet/i.test(product.subcategory || product.name || ''))
        const karungali = cheapest(
          products,
          (product) => /karung/i.test(`${product.name} ${product.slug}`) && /mala/i.test(`${product.subcategory} ${product.name}`) && !/bracelet/i.test(product.name || ''),
        )
        const next = [
          tileFromProduct(bracelet, 'Bracelets', '/accessories?subcategory=Bracelet'),
          tileFromProduct(karungali, 'Karungali mala'),
        ].filter(Boolean)
        if (!cancelled && next.length === 2) setTiles(next)
      } catch {
        /* keep the known catalog tiles */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="bg-[#FFFAEB] px-3 py-6 md:px-6 md:py-10" aria-labelledby="bhai-dooj-heading">
      <div className="gg-bhai-panel mx-auto max-w-5xl overflow-hidden rounded-2xl px-4 py-5 text-center md:px-8 md:py-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f3d78a] md:text-xs">
          Gifts for your brother
        </p>
        <h2 id="bhai-dooj-heading" className="mt-1 font-heading text-3xl font-bold text-[#f8e7b0] md:text-4xl">
          Bhai Dooj
        </h2>
        <div className="mx-auto mt-4 max-w-3xl rounded-xl border border-[#d7e4d4] bg-[#f4f8f2] px-4 py-6 md:px-10 md:py-8">
          <div className="mx-auto grid max-w-md grid-cols-2 gap-4 md:max-w-lg md:gap-10">
            {tiles.map((tile) => (
              <Link key={tile.label} to={tile.href} className="group flex flex-col items-center">
                <span className="grid h-28 w-28 place-items-center rounded-full bg-[#f7f1e4] p-1 ring-[3px] ring-[#e7c56a] transition group-hover:ring-[#f3d78a] md:h-36 md:w-36">
                  <img src={tile.image} alt={tile.alt} className="h-full w-full rounded-full object-cover" />
                </span>
                <span className="mt-3 text-sm font-bold text-stone-900 md:text-base">{tile.label}</span>
                <span className="text-xs text-stone-500 md:text-sm">From ₹{rupee(tile.price)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BhaiDoojSection
