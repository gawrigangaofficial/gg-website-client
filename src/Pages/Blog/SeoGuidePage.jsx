import { Link, Navigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaArrowLeft } from 'react-icons/fa'
import { getSeoGuide, relatedGuideSlugs } from '../../content/seoGuides'
import RelatedGuides from '../../components/RelatedGuides'
import Breadcrumbs, { ExploreLinks } from '../../components/Breadcrumbs'

const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '')

const SeoGuidePage = () => {
  const { slug } = useParams()
  const guide = getSeoGuide(slug)
  if (!guide) return <Navigate to="/blog" replace />

  const url = `${SITE}/guides/${guide.slug}`
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    keywords: guide.keyword,
    author: { '@type': 'Organization', name: 'Gawri Ganga', url: SITE },
    publisher: {
      '@type': 'Organization',
      name: 'Gawri Ganga',
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/favicon.png` },
    },
    mainEntityOfPage: url,
    about: guide.keyword,
  }

  return (
    <article className="min-h-screen bg-[#FFFAEB]">
      {/* Title, description and canonical come from RouteSeo; only the article schema is added here. */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleLd)}</script>
      </Helmet>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Breadcrumbs items={[{ name: 'Guides', href: '/blog' }, { name: guide.title, href: `/guides/${guide.slug}` }]} />
        <ExploreLinks />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Gawri Ganga guide</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-stone-900 sm:text-4xl">{guide.title}</h1>
        <p className="mt-4 text-base leading-relaxed text-stone-700">{guide.description}</p>
        <p className="mt-3 text-sm text-stone-500">Topics: {guide.keyword}</p>
        <div className="mt-8 space-y-4">
          {guide.sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-stone-900">{section.heading}</h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-700 sm:text-base">{section.body}</p>
            </section>
          ))}
        </div>
        <Link
          to={guide.cta.href}
          className="mt-8 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          {guide.cta.label}
        </Link>
        <RelatedGuides slugs={relatedGuideSlugs(guide.slug)} />
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <FaArrowLeft aria-hidden />
          All guides
        </Link>
      </div>
    </article>
  )
}

export default SeoGuidePage
