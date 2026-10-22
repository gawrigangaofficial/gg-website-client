import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '')

export function CollectionSchema({ name, description, path, faqs = [] }) {
  const url = `${SITE}${path}`
  const graph = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name, item: url },
      ],
    },
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

export function CategoryFaq({ faqs, title = 'Questions buyers ask' }) {
  const [open, setOpen] = useState(0)
  if (!faqs?.length) return null

  return (
    <section className="mt-8 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="font-heading text-xl font-bold text-stone-900">{title}</h2>
      <div className="mt-3 divide-y divide-orange-100">
        {faqs.map((item, index) => {
          const isOpen = open === index
          return (
            <div key={item.question}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-semibold text-stone-900"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : index)}
              >
                {item.question}
                <span className="text-primary" aria-hidden>{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen ? <p className="pb-3 text-sm leading-relaxed text-stone-600">{item.answer}</p> : null}
            </div>
          )
        })}
      </div>
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
