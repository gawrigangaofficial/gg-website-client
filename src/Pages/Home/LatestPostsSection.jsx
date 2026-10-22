import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBookOpen } from 'react-icons/fa';
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api';
import { formatBlogListDate, stripHtmlForExcerpt } from '../../utils/blogListDisplay';

const LATEST_COUNT = 3;
const DEFAULT_HERO_IMAGE = 'https://via.placeholder.com/1200x630?text=Gawri+Ganga+Blog';

const cardClass =
  'flex h-full flex-col overflow-hidden rounded-2xl border-2 border-amber-300/85 bg-white shadow-[0_8px_24px_-6px_rgba(62,47,28,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/70 hover:shadow-[0_16px_36px_-10px_rgba(62,47,28,0.18)]';

const LatestPostsSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await apiFetch('/api/blogs');
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || 'Failed to load blogs');
        }
        if (!cancelled) {
          const list = Array.isArray(payload.data) ? payload.data : [];
          const sorted = [...list].sort((a, b) => {
            const da = new Date(a.published_at || a.created_at || 0).getTime();
            const db = new Date(b.published_at || b.created_at || 0).getTime();
            return db - da;
          });
          setPosts(sorted.slice(0, LATEST_COUNT));
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load posts right now.');
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
        const excerpt = rawExcerpt.length > 90 ? `${rawExcerpt.slice(0, 90)}...` : rawExcerpt;
        return {
          ...post,
          excerpt,
          displayDate: formatBlogListDate(post.published_at || post.created_at),
          heroUrl: post.hero_image_url || DEFAULT_HERO_IMAGE,
        };
      }),
    [posts],
  );

  if (!loading && !error && cards.length === 0) {
    return null;
  }

  return (
    <section
      className="w-full overflow-x-hidden bg-[#FFFAEB] py-4 md:py-8"
      aria-labelledby="latest-posts-heading"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-900 text-[#FFFAEB]"
              aria-hidden
            >
              <FaBookOpen className="text-sm" />
            </span>
            <h2
              id="latest-posts-heading"
              className="font-heading text-lg font-bold leading-tight text-stone-900 md:text-2xl"
            >
              Latest posts
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary"
          >
            View all
            <FaArrowRight className="text-xs" aria-hidden />
          </Link>
        </div>

        {loading ? (
          <div className="mt-3 flex justify-center py-3">
            <Loader />
          </div>
        ) : error ? (
          <p className="mt-3 text-center text-sm font-medium text-red-600">{error}</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2 md:grid md:grid-cols-3 md:gap-4">
            {cards.map((post) => (
              <article key={post.id} className={`${cardClass} min-w-0`}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="flex min-w-0 items-center gap-3 p-2 md:flex-col md:items-stretch md:p-0"
                >
                  <img
                    src={post.heroUrl}
                    alt={post.title || 'Gawri Ganga guide'}
                    className="h-14 w-14 shrink-0 rounded-xl object-cover md:h-32 md:w-full md:rounded-none"
                    loading="lazy"
                  />
                  <span className="min-w-0 flex-1 md:p-3">
                    {post.displayDate ? (
                      <span className="block text-[10px] font-medium uppercase tracking-wide text-stone-500">
                        {post.displayDate}
                      </span>
                    ) : null}
                    <span className="mt-0.5 line-clamp-2 block font-heading text-sm font-bold leading-snug text-stone-900 md:text-base">
                      {post.title}
                    </span>
                    <span className="mt-1 hidden line-clamp-2 text-xs leading-snug text-stone-600 md:block">
                      {post.excerpt || 'Read the full article.'}
                    </span>
                  </span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestPostsSection;
