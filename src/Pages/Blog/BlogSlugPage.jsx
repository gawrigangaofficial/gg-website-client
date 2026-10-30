import { Navigate, useParams } from 'react-router-dom'
import { getCard } from '../../content/guides/lookup'
import { resolveGuideSlug } from '../../content/guides/topics'
import { MOVED_POSTS } from '../../content/blog'
import BlogPostPage from './BlogPostPage'

/** /blog/:slug shows a post from the admin. A guide's slug here is sent to /guides/<slug>, where guides live. */
const BlogSlugPage = () => {
  const { slug } = useParams()
  const moved = MOVED_POSTS[String(slug || '').toLowerCase()]
  if (moved) return <Navigate to={moved} replace />
  const card = getCard(resolveGuideSlug(slug))
  if (card) return <Navigate to={`/guides/${card.slug}`} replace />
  return <BlogPostPage />
}

export default BlogSlugPage
