import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { FaChevronDown, FaWhatsapp } from 'react-icons/fa'
import RelatedGuides from './RelatedGuides'
import { WHATSAPP_NUMBER } from '../config/site'

const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '')

export function CollectionSchema({ name, description, path, faqs = [] }) {
  const url = `${SITE}${path}`
  // BreadcrumbList comes from <Breadcrumbs>, which every collection page renders.
  const graph = [
    {
      '@type': 'CollectionPage',
      name,
      description,
      url,
      isPartOf: { '@type': 'WebSite', name: 'Gawri Ganga', url: SITE },
    },
  ]

  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    })
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
    </Helmet>
  )
}

/** FAQ accordion: one open at a time, numbered cards, smooth open and close. */
export function CategoryFaq({ faqs, title = 'Questions buyers ask' }) {
  const [open, setOpen] = useState(0)
  if (!faqs?.length) return null

  return (
    <section className="mt-8" aria-labelledby="category-faq-heading">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">FAQ</p>
      <h2 id="category-faq-heading" className="mt-1 font-heading text-2xl font-bold text-stone-900 md:text-3xl">
        {title}
      </h2>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_300px]">
        <ul className="space-y-3">
          {faqs.map((item, index) => {
            const isOpen = open === index
            const id = `faq-${index}`
            return (
              <li
                key={item.question}
                className={`rounded-2xl border bg-white shadow-sm transition-colors ${isOpen ? 'border-primary/50' : 'border-orange-100 hover:border-orange-200'}`}
              >
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5"
                  aria-expanded={isOpen}
                  aria-controls={id}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isOpen ? 'bg-primary text-white' : 'bg-orange-50 text-primary'}`}
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <span className="flex-1 text-[15px] font-semibold text-stone-900">{item.question}</span>
                  <FaChevronDown className={`shrink-0 text-sm text-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
                </button>
                <div id={id} className={`grid transition-[grid-template-rows] duration-200 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <p className="overflow-hidden px-4 text-[15px] leading-relaxed text-stone-600 sm:px-5 sm:pl-[3.75rem]">
                    <span className="block pb-4">{item.answer}</span>
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
        <aside className="h-fit rounded-2xl border border-orange-200 bg-linear-to-br from-orange-50 to-amber-50 p-5 lg:sticky lg:top-28">
          <p className="font-heading text-lg font-bold text-stone-900">Still have a question?</p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Ask us on WhatsApp. We help you choose the right bead, check sizes and track your order, Monday to Saturday.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Namaste! I have a question about a product.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <FaWhatsapp aria-hidden /> Chat on WhatsApp
          </a>
          <Link to="/faq" className="mt-3 block text-center text-sm font-semibold text-primary hover:underline">
            See all FAQs
          </Link>
        </aside>
      </div>
    </section>
  )
}

/**
 * End-of-page block for category pages: FAQs first, then related guides. Place it after every product section.
 * Pass withSchema on pages that do not already send these FAQs through CollectionSchema.
 */
export function PageEndFaq({ faqs, guides = [], title, withSchema = false }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-4 md:px-8">
      {withSchema && faqs?.length ? (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
            })}
          </script>
        </Helmet>
      ) : null}
      <CategoryFaq faqs={faqs} title={title} />
      {guides.length ? <RelatedGuides slugs={guides} /> : null}
    </section>
  )
}

export function SeoCta({ to, children }) {
  return (
    <Link to={to} className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
      {children}
    </Link>
  )
}
