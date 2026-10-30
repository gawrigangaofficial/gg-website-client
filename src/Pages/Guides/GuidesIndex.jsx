import React, { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaArrowRight, FaWhatsapp } from 'react-icons/fa'
import Breadcrumbs, { ExploreLinks } from '../../components/Breadcrumbs'
import { CollectionSchema } from '../../components/CategorySeo'
import { WHATSAPP_NUMBER, FOUNDED_YEAR } from '../../config/site'
import { GUIDE_CARDS as GUIDES, getCard } from '../../content/guides/lookup'
import { GUIDE_TOPICS, HINDI_KEY, START_HERE } from '../../content/guides/topics'
import { STATIC_META } from '../../seo/meta'

function GuideCard({ guide, large = false }) {
  return (
    <article
      lang={guide.lang || undefined}
      className="group flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <Link to={`/guides/${guide.slug}`} className="block" tabIndex={-1} aria-hidden="true">
        <img
          src={guide.heroImage}
          alt=""
          loading="lazy"
          className={`w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${large ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          {guide.category}
          {guide.lang === 'hi' ? <span className="rounded-full bg-orange-100 px-2 py-0.5 normal-case tracking-normal">हिंदी</span> : null}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-snug text-stone-900">
          <Link to={`/guides/${guide.slug}`} className="hover:text-primary">
            {guide.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-600">{guide.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-stone-500">{guide.readMinutes} min read</span>
          <Link to={`/guides/${guide.slug}`} className="inline-flex items-center gap-2 font-semibold text-primary" aria-label={`Read: ${guide.title}`}>
            {guide.lang === 'hi' ? 'पूरा पढ़ें' : 'Read guide'}
            <FaArrowRight aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  )
}

/** /guides: every guide, with topic filters. Each topic is a labelled section, so all links are in the page for crawlers. */
const GuidesIndex = () => {
  const [params, setParams] = useSearchParams()
  const selected = params.get('topic') || ''
  const meta = STATIC_META['/guides']

  const startHere = useMemo(() => START_HERE.map(getCard).filter(Boolean), [])
  const hindi = useMemo(() => GUIDES.filter((g) => g.lang === 'hi'), [])
  const sections = useMemo(
    () =>
      GUIDE_TOPICS.map((topic) => ({ ...topic, guides: GUIDES.filter((g) => g.category === topic.key && g.lang !== 'hi') })).filter(
        (s) => s.guides.length,
      ),
    [],
  )
  const choose = (topic) => setParams(topic ? { topic } : {}, { replace: true })
  const showHindi = selected === HINDI_KEY
  const visible = selected && !showHindi ? sections.filter((s) => s.key === selected) : showHindi ? [] : sections

  return (
    <div className="min-h-screen bg-[#FFFAEB]">
      <CollectionSchema name={meta.h1} description={meta.description} path="/guides" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Breadcrumbs items={[{ name: 'Guides', href: '/guides' }]} />
        <ExploreLinks />

        <header className="mt-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Gawri Ganga guides</p>
          <h1 className="mt-2 font-heading text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">{meta.h1}</h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            Plain-English guides to what we sell: how to choose, check, wear and care for Rudraksha, Karungali and Tulsi malas, bracelets and aura sprays, from a family business serving devotees since{' '}
            {FOUNDED_YEAR}. {GUIDES.length} guides, {hindi.length} of them in Hindi.
          </p>
        </header>

        <section className="mt-10" aria-labelledby="start-here-heading">
          <h2 id="start-here-heading" className="font-heading text-2xl font-bold text-stone-900">
            Start here
          </h2>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            {startHere.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} large />
            ))}
          </div>
        </section>

        <nav className="mt-12" aria-label="Guide topics">
          <ul className="flex flex-wrap gap-2">
            {[{ key: '', label: `All (${GUIDES.length})` }, ...sections.map((s) => ({ key: s.key, label: `${s.key} (${s.guides.length})` })), { key: HINDI_KEY, label: `${HINDI_KEY} (${hindi.length})` }].map(
              (chip) => (
                <li key={chip.key || 'all'}>
                  <button
                    type="button"
                    onClick={() => choose(chip.key)}
                    aria-pressed={selected === chip.key}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      selected === chip.key ? 'border-primary bg-primary text-white' : 'border-orange-200 bg-white text-stone-700 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {chip.label}
                  </button>
                </li>
              ),
            )}
          </ul>
        </nav>

        {visible.map((section) => (
          <section key={section.key} className="mt-10" aria-labelledby={`topic-${section.key.replace(/\s+/g, '-').toLowerCase()}`}>
            <h2 id={`topic-${section.key.replace(/\s+/g, '-').toLowerCase()}`} className="font-heading text-2xl font-bold text-stone-900">
              {section.key}
            </h2>
            <p className="mt-1 text-stone-600">{section.blurb}</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {section.guides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </section>
        ))}

        {!selected || showHindi ? (
          <section className="mt-12" aria-labelledby="hindi-guides-heading" lang="hi">
            <h2 id="hindi-guides-heading" className="font-heading text-2xl font-bold text-stone-900">
              हिंदी गाइड
            </h2>
            <p className="mt-1 text-stone-600">रुद्राक्ष, करुंगली और तुलसी माला के बारे में हिंदी में जानकारी।</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {hindi.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-14 grid gap-4 rounded-2xl border border-orange-200 bg-white p-6 shadow-sm md:grid-cols-2">
          <div>
            <h2 className="font-heading text-xl font-bold text-stone-900">Looking for news and festival posts?</h2>
            <p className="mt-2 text-stone-600">Festival dates, puja vidhi, traditions and gifting ideas live on our blog.</p>
            <Link to="/blog" className="mt-4 inline-flex items-center gap-2 font-semibold text-primary">
              Read the blog <FaArrowRight aria-hidden />
            </Link>
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-stone-900">Can&apos;t find your question?</h2>
            <p className="mt-2 text-stone-600">Ask us on WhatsApp and we will help you choose the right bead.</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Namaste! I read your guides and have a question.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              <FaWhatsapp aria-hidden /> Chat on WhatsApp
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default GuidesIndex
