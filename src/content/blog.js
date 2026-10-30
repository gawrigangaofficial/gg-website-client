/**
 * Blog rules shared by the blog pages and the prerender.
 * The blog is for timely posts (festivals, seasons, launches). Evergreen "how to / which / price" answers are guides.
 */

/** Posts that were really guides or product pages, and where they now live. Their old addresses redirect (301). */
export const MOVED_POSTS = {
  '7-mukhi-rudraksha-blog': '/guides/7-mukhi-rudraksha',
  'amrat-bindu-blog': '/sprays/amrat-bindu',
  'maitri-aura-spray-blog': '/sprays/maitri',
  'gawri-ganga-blog': '/about',
}

export const isMovedPost = (slug) => Boolean(MOVED_POSTS[String(slug || '').toLowerCase()])

/** Splits post HTML at its first <h2>, so products can be shown right after the opening answer. */
export function splitIntro(html = '') {
  const i = String(html).search(/<h2[\s>]/i)
  return i > 0 ? [html.slice(0, i), html.slice(i)] : ['', html]
}

const plain = (s) =>
  String(s)
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

/** Question and answer pairs from a post's "Frequently asked questions" section (<h3> question, then <p> answer). */
export function blogFaqs(html = '') {
  const m = String(html).match(/<h2[^>]*>[^<]*(frequently asked|faq)[\s\S]*?<\/h2>([\s\S]*?)(?=<h2[\s>]|$)/i)
  if (!m) return []
  return [...m[2].matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((x) => ({ q: plain(x[1]), a: plain(x[2]) }))
    .filter((f) => f.q && f.a)
}

/** Local review only: `VITE_BLOG_DRAFTS=true` in .env.development.local makes the dev server show unpublished posts. */
export const SHOW_DRAFTS = Boolean(import.meta.env?.DEV && import.meta.env?.VITE_BLOG_DRAFTS === 'true')
