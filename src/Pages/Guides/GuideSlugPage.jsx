import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Loader from '../../components/Loader'
import { getCard } from '../../content/guides/lookup'
import { resolveGuideSlug } from '../../content/guides/topics'
import GuidePage from './GuidePage'

// Each guide is its own file; Vite splits them into separate chunks, so a guide page downloads only its own text.
const loaders = import.meta.glob('../../content/guides/*.js')

/** /guides/:slug. A merged guide's old address goes to the fuller guide; an unknown address goes to the guides page. */
const GuideSlugPage = () => {
  const { slug } = useParams()
  const target = resolveGuideSlug(slug)
  const known = target === slug && getCard(slug)
  const [loaded, setLoaded] = useState({ slug: '', guide: null })

  useEffect(() => {
    const load = loaders[`../../content/guides/${slug}.js`]
    if (!known || !load) return undefined
    let cancelled = false
    load().then((m) => {
      if (!cancelled) setLoaded({ slug, guide: m.default })
    })
    return () => {
      cancelled = true
    }
  }, [slug, known])

  if (target !== slug) return <Navigate to={`/guides/${target}`} replace />
  if (!known) return <Navigate to="/guides" replace />
  if (loaded.slug !== slug || !loaded.guide) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FFFAEB]">
        <Loader />
      </div>
    )
  }
  return <GuidePage key={slug} guide={loaded.guide} />
}

export default GuideSlugPage
