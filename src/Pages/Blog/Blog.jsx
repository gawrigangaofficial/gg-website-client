import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import ggLogo from '../../assets/gglogo.svg';
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api';
import { formatBlogListDate, stripHtmlForExcerpt } from '../../utils/blogListDisplay';
import BlogExploreProductsSection from './BlogExploreProductsSection';
import Breadcrumbs, { ExploreLinks } from '../../components/Breadcrumbs';
import { STATIC_META } from '../../seo/meta';
import { SHOW_DRAFTS, isMovedPost } from '../../content/blog';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await apiFetch(`/api/blogs${SHOW_DRAFTS ? '?include_drafts=true' : ''}`);
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || 'Failed to load blogs');
        }
        if (!cancelled) {
          setPosts((Array.isArray(payload.data) ? payload.data : []).filter((p) => !isMovedPost(p.slug)));
        }
      } catch (_error) {
        if (!cancelled) {
          setError('Unable to load blog posts right now.');
          setPosts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBlogs();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = useMemo(
    () =>
      posts.map((post) => {
        const rawExcerpt = post.excerpt || stripHtmlForExcerpt(post.html_content);
        const excerpt = rawExcerpt.length > 180 ? `${rawExcerpt.slice(0, 180)}...` : rawExcerpt;
        return {
          ...post,
          excerpt,
          displayDate: formatBlogListDate(post.published_at || post.created_at),
        };
      }),
    [posts],
  );

  return (
    <div className="min-h-screen bg-[#FFFAEB]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Breadcrumbs items={[{ name: 'Blog', href: '/blog' }]} />
        <ExploreLinks />
        <div className="mb-10 flex justify-center">
          <img src={ggLogo} alt="Gawri Ganga" className="h-auto w-40 sm:w-48" loading="lazy" />
        </div>
        <header className="text-center">
          <h1 className="font-heading text-3xl font-bold text-stone-900 sm:text-4xl">{STATIC_META['/blog'].h1}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
            Festival dates and puja vidhi, traditions, seasons and gifting ideas from the Gawri Ganga family.
          </p>
        </header>

        <aside className="mx-auto mt-8 max-w-3xl rounded-2xl border border-orange-200 bg-white p-5 text-center shadow-sm">
          <p className="text-stone-700">
            Choosing, checking or wearing a Rudraksha, Karungali, Tulsi mala or spray?{' '}
            <Link to="/guides" className="font-semibold text-primary hover:underline">
              Read our guides
            </Link>
            .
          </p>
        </aside>

        {loading ? (
          <div className="mt-12 flex items-center justify-center">
            <Loader />
          </div>
        ) : error ? (
          <p className="mt-12 text-center text-sm font-medium text-red-600">{error}</p>
        ) : cards.length === 0 ? (
          <p className="mt-12 text-center text-stone-600">No blog posts yet. Please check back soon, or read our guides.</p>
        ) : (
          <section className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <Link to={`/blog/${post.slug}`} className="block">
                  <img
                    src={post.hero_image_url}
                    alt={post.title}
                    className="h-52 w-full object-cover"
                    loading="lazy"
                  />
                </Link>
                <div className="p-5">
                  {post.displayDate ? <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{post.displayDate}</p> : null}
                  <h2 className="mt-2 line-clamp-2 text-xl font-bold text-stone-900">{post.title}</h2>
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-stone-600">{post.excerpt || 'Read the full article for more details.'}</p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    Read more
                    <FaArrowRight aria-hidden />
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}

        <BlogExploreProductsSection headingId="blog-explore-products-heading" />
      </div>
    </div>
  );
};

export default Blog;
