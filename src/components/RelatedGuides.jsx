import { Link } from 'react-router-dom'
import { guideCard } from '../content/seoGuides'

const RelatedGuides = ({ slugs = [], title = 'Related guides' }) => {
  // guideCard follows merged /guides pages to the /blog guide that replaced them.
  const guides = slugs
    .map(guideCard)
    .filter(Boolean)
    .filter((guide, i, all) => all.findIndex((g) => g.href === guide.href) === i)
  if (!guides.length) return null

  return (
    <section className="mt-8" aria-labelledby="related-guides-heading">
      <h2 id="related-guides-heading" className="font-heading text-xl font-bold text-stone-900">
        {title}
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {guides.map((guide) => (
          <article key={guide.href} className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
            <h3 className="text-base font-bold text-stone-900">{guide.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-stone-600">{guide.description}</p>
            <Link to={guide.href} className="mt-2 inline-flex text-sm font-semibold text-primary">
              Read guide
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RelatedGuides
