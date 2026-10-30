import { useParams } from 'react-router-dom'
import { getGuide } from '../../content/guides'
import GuidePage from './GuidePage'
import BlogPostPage from './BlogPostPage'

/** /blog/:slug serves a long-form guide from src/content/guides when one exists, otherwise a post from the API. */
const BlogSlugPage = () => {
  const { slug } = useParams()
  const guide = getGuide(slug)
  return guide ? <GuidePage key={guide.slug} guide={guide} /> : <BlogPostPage />
}

export default BlogSlugPage
