import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api';
import BlogExploreProductsSection from './BlogExploreProductsSection';
import Breadcrumbs, { ExploreLinks } from '../../components/Breadcrumbs';
import { Helmet } from 'react-helmet-async';
import { articleJsonLd, blogPostMeta, faqJsonLd } from '../../seo/meta';
import ShopStrip from '../../components/ShopStrip';
import { SHOW_DRAFTS, blogFaqs, splitIntro } from '../../content/blog';
import { linkedProductSlugs, useProductsBySlug } from '../../hooks/useProductsBySlug';
import { usePageSeo } from '../../seo/SeoContext';

const DEFAULT_HERO_IMAGE = 'https://via.placeholder.com/1200x630?text=Gawri+Ganga+Blog';

function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (_error) {
    return '';
  }
}

function sanitizeBlogHtml(input) {
  const raw = String(input || '').trim();
  if (!raw) return '';
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return raw;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, 'text/html');

    // Remove tags that can alter app-wide behavior or styling.
    doc.querySelectorAll('script, style, link, meta, base, iframe, object, embed').forEach((node) => {
      node.remove();
    });

    // Remove inline styles and event handlers from pasted rich HTML.
    doc.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('style');
      [...el.attributes].forEach((attr) => {
        if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
      });
    });

    return doc.body?.innerHTML || raw;
  } catch (_error) {
    return raw;
  }
}

const PROSE = 'max-w-none text-[17px] leading-8 text-stone-700 [&_h2]:mt-10 [&_h2]:border-b [&_h2]:border-stone-200 [&_h2]:pb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-primary [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-primary [&_h4]:mt-6 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-primary [&_p]:my-4 [&_p]:leading-8 [&_strong]:font-semibold [&_strong]:text-stone-900 [&_em]:text-stone-800 [&_a]:font-semibold [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:text-primary/80 hover:[&_a]:underline [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_li]:pl-1 [&_blockquote]:my-8 [&_blockquote]:rounded-r-xl [&_blockquote]:border-l-4 [&_blockquote]:border-primary/70 [&_blockquote]:bg-orange-50 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote]:text-stone-800 [&_img]:my-8 [&_img]:w-full [&_img]:rounded-2xl [&_img]:border [&_img]:border-stone-200 [&_hr]:my-10 [&_hr]:border-stone-200';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coverImage, setCoverImage] = useState(DEFAULT_HERO_IMAGE);
  const contentRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await apiFetch(`/api/blogs/${encodeURIComponent(slug || '')}${SHOW_DRAFTS ? '?include_drafts=true' : ''}`);
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || 'Failed to load blog post');
        }
        if (!cancelled) {
          setPost(payload.data || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Unable to load this blog post.');
          setPost(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPost();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!contentRef.current) return;
    const links = contentRef.current.querySelectorAll('a');
    links.forEach((anchor) => {
      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('http://') || href.startsWith('https://')) {
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }, [post?.id]);

  const displayDate = useMemo(
    () => formatDate(post?.published_at || post?.created_at),
    [post?.published_at, post?.created_at],
  );
  // The page already has one H1 (the title); headings inside the stored article start at H2.
  const renderedHtml = useMemo(
    () => sanitizeBlogHtml(post?.html_content).replace(/<(\/?)h1(\b[^>]*)>/gi, '<$1h2$2>'),
    [post?.html_content],
  );
  const [intro, rest] = useMemo(() => splitIntro(renderedHtml), [renderedHtml]);
  const faqLd = useMemo(() => faqJsonLd(blogFaqs(renderedHtml)), [renderedHtml]);
  const products = useProductsBySlug();
  const shop = linkedProductSlugs(`${post?.primary_link_url || ''} ${renderedHtml}`).map((s) => products[s]).filter(Boolean);
  const seoMeta = useMemo(() => (post ? blogPostMeta(post) : null), [post]);
  usePageSeo(seoMeta ? { ...seoMeta, image: post?.header_image_url || post?.hero_image_url } : null);

  useEffect(() => {
    setCoverImage(post?.header_image_url || post?.hero_image_url || DEFAULT_HERO_IMAGE);
  }, [post?.header_image_url, post?.hero_image_url]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
          <FaArrowLeft aria-hidden />
          Back to the blog
        </Link>
        <p className="mt-8 text-center text-base text-red-600">{error || 'Blog post not found.'}</p>
      </div>
    );
  }

  const articleLd = articleJsonLd({
    path: `/blog/${post.slug}`,
    title: seoMeta.h1,
    description: seoMeta.description,
    image: post.header_image_url || post.hero_image_url,
    published: post.published_at || post.created_at,
    updated: post.updated_at,
  });

  return (
    <div className="bg-[#FFFAEB]">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleLd)}</script>
        {faqLd ? <script type="application/ld+json">{JSON.stringify(faqLd)}</script> : null}
      </Helmet>
      <article className="w-full bg-[#FFFAEB]">
        <div className="border-b border-stone-200 bg-[#FFFAEB] py-6 sm:py-8">
          <img
            src={coverImage}
            alt={post.title}
            className="mx-auto h-56 w-4/5 rounded-2xl object-cover shadow-sm sm:h-72 lg:h-[420px]"
            loading="eager"
            onError={() => setCoverImage(DEFAULT_HERO_IMAGE)}
          />
        </div>

        <div className="mx-auto w-full max-w-3xl px-5 py-6 sm:px-8 sm:py-10">
          <Breadcrumbs items={[{ name: 'Blog', href: '/blog' }, { name: seoMeta.h1, href: `/blog/${post.slug}` }]} />
          <ExploreLinks />

          <h1 className="mt-5 text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">{seoMeta.h1}</h1>
          {displayDate ? <p className="mt-3 text-sm font-medium text-stone-500">{displayDate}</p> : null}
          {!post.is_published ? <p className="mt-3 inline-block rounded-full bg-amber-200 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-900">Draft, not live</p> : null}
          {post.excerpt ? <p className="mt-5 rounded-xl bg-orange-50 px-4 py-3 text-base leading-relaxed text-stone-700">{post.excerpt}</p> : null}

          <div ref={contentRef} className="mt-8">
            {intro ? <div className={PROSE} dangerouslySetInnerHTML={{ __html: intro }} /> : null}
            <ShopStrip compact products={shop.slice(0, 3)} id="blog-shop-top" title="Shop this post" />
            <div className={PROSE} dangerouslySetInnerHTML={{ __html: rest }} />
          </div>

          {post.primary_link_url && post.primary_link_label ? (
            <div className="mt-10 rounded-2xl border border-orange-200 bg-orange-50 p-6">
              <p className="font-heading text-xl font-bold text-stone-900">Ready to choose?</p>
              <p className="mt-1 text-stone-600">Lab-tested with a certificate, cash on delivery and 2-day returns.</p>
              <Link to={post.primary_link_url} className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white">
                {post.primary_link_label}
              </Link>
            </div>
          ) : null}

          <ShopStrip products={shop.slice(0, 6)} id="blog-products" title="Products in this post" />

          <BlogExploreProductsSection headingId="blog-post-explore-products-heading" />
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
