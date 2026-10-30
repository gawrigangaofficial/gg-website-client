import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaQuoteLeft, FaStar, FaPen, FaCheckCircle } from 'react-icons/fa';
import { apiFetch } from '../../config/api.js';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toaster';
import { cleanName } from '../../seo/meta';

/** Testimonials from customers before the review system existed (owner confirmed these are real). */
const TESTIMONIALS = [
  {
    id: 't-priya',
    name: 'Priya S.',
    location: 'Pune',
    product: 'Rudraksha Mala',
    quote:
      'The bead quality and lab certificate gave me real confidence. Daily japa feels calmer and more focused since I started wearing it.',
    rating: 5,
  },
  {
    id: 't-rajesh',
    name: 'Rajesh K.',
    location: 'Delhi',
    product: 'Karungali Mala',
    quote:
      'Packaging was careful, delivery was on time, and the pendant matches the photos. You can tell they care about authenticity.',
    rating: 5,
  },
  {
    id: 't-meera',
    name: 'Meera V.',
    location: 'Bengaluru',
    product: 'Kanthi Mala',
    quote:
      'Shuddhi has become part of my morning routine—subtle, calming, and not overpowering. Will order again for family.',
    rating: 5,
  },
  {
    id: 't-arjun',
    name: 'Arjun T.',
    location: 'Jaipur',
    product: 'Tulsi Mala',
    quote:
      'Genuine tulsi beads, neatly strung. The team answered my sizing questions before purchase. Very happy with the mala.',
    rating: 5,
  },
];

function StarRow({ rating, size = 'text-sm' }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar key={i} className={`${size} ${i < Math.round(rating) ? 'text-amber-500' : 'text-stone-300'}`} aria-hidden />
      ))}
    </div>
  );
}

function ReviewCard({ item }) {
  return (
    <article className="flex h-full w-[280px] shrink-0 flex-col rounded-2xl border-2 border-amber-300/85 bg-white p-5 shadow-[0_8px_24px_-6px_rgba(62,47,28,0.22)] sm:w-[320px]">
      <div className="flex items-center justify-between gap-2">
        <StarRow rating={item.rating} />
        {item.verified ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <FaCheckCircle aria-hidden /> Verified buyer
          </span>
        ) : null}
      </div>
      {item.image ? (
        <img src={item.image} alt={`Photo from ${item.name}`} loading="lazy" className="mt-3 h-36 w-full rounded-xl object-cover" />
      ) : null}
      <blockquote className="mt-3 line-clamp-6 flex-1 text-sm leading-relaxed text-stone-700">&ldquo;{item.quote}&rdquo;</blockquote>
      <footer className="mt-4 border-t border-amber-200/60 pt-3">
        <p className="font-heading text-sm font-bold text-stone-900">{item.name}</p>
        {item.location ? <p className="mt-0.5 text-xs text-stone-500">{item.location}</p> : null}
        {item.product ? (
          item.slug ? (
            <Link
              to={`/product/${item.slug}`}
              className="mt-2 inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200/80 hover:bg-amber-100"
            >
              {item.product}
            </Link>
          ) : (
            <p className="mt-2 inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200/80">
              {item.product}
            </p>
          )
        ) : null}
      </footer>
    </article>
  );
}

/** Auto-scrolling row of reviews. Pauses on hover and focus; static for people who prefer reduced motion. */
function ReviewMarquee({ items }) {
  const loop = items.length > 2 ? [...items, ...items] : items;
  return (
    <div className="gg-marquee group relative mt-8 overflow-hidden" aria-label="Customer reviews">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-[#FFFAEB] to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-[#FFFAEB] to-transparent sm:w-20" />
      <div
        className="gg-marquee-track flex w-max gap-5 py-2"
        style={{ '--gg-marquee-duration': `${Math.max(30, items.length * 7)}s` }}
      >
        {loop.map((item, i) => (
          <div key={`${item.id}-${i}`} aria-hidden={i >= items.length ? true : undefined}>
            <ReviewCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

function WriteReviewForm({ products, onDone }) {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [productId, setProductId] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState(user?.full_name || '');
  const [comment, setComment] = useState('');
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.full_name) setName((current) => current || user.full_name);
  }, [user?.full_name]);

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-orange-100 bg-white p-6 text-center shadow-sm">
        <p className="text-base font-semibold text-stone-900">Bought from Gawri Ganga? Tell others how it went.</p>
        <p className="mt-2 text-sm text-stone-600">Sign in with the mobile number you ordered with, so we can mark your review as a verified purchase.</p>
        <button
          type="button"
          onClick={() => navigate('/login', { state: { from: { pathname: '/', hash: '#reviews' } } })}
          className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          Sign in to write a review
        </button>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!productId || rating < 1 || !name.trim()) {
      toast.error('Please choose the product, a rating and your name.');
      return;
    }
    setSubmitting(true);
    try {
      let imageUrl = null;
      if (image) {
        const form = new FormData();
        form.append('image', image);
        const up = await apiFetch('/api/reviews/upload-image', { method: 'POST', body: form });
        const upJson = await up.json();
        if (!up.ok || !upJson.success) throw new Error(upJson.message || 'Could not upload the photo.');
        imageUrl = upJson.data?.image_url || null;
      }
      const res = await apiFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          product_id: productId,
          reviewer_name: name.trim(),
          rating,
          comment: comment.trim() || null,
          image_url: imageUrl,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Could not submit your review.');
      toast.success('Thank you! Your review will appear after we check it against your order.');
      setRating(0);
      setComment('');
      setImage(null);
      onDone();
    } catch (err) {
      toast.error(err?.message || 'Could not submit your review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-8 grid max-w-xl gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
      <label className="grid gap-1.5 text-sm font-semibold text-stone-800">
        Which product did you buy?
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-normal"
          required
        >
          <option value="">Choose a product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {cleanName(p.name)}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-1.5 text-sm font-semibold text-stone-800">
        Your rating
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              className="p-0.5"
            >
              <FaStar className={`text-2xl ${star <= (hover || rating) ? 'text-amber-500' : 'text-stone-300'}`} />
            </button>
          ))}
        </div>
      </div>
      <label className="grid gap-1.5 text-sm font-semibold text-stone-800">
        Your name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm font-normal"
          maxLength={80}
          required
        />
      </label>
      <label className="grid gap-1.5 text-sm font-semibold text-stone-800">
        Your review
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="How did the bead or mala look and feel? How was packing and delivery?"
          className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm font-normal"
        />
      </label>
      <label className="grid gap-1.5 text-sm font-semibold text-stone-800">
        Add a photo (optional)
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="text-sm font-normal"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Submit review'}
      </button>
    </form>
  );
}

const TestimonialsSection = () => {
  const [tab, setTab] = useState('read');
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    apiFetch('/api/reviews/public?limit=200')
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && json?.success) setReviews(json.data || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (tab !== 'write' || products.length) return;
    apiFetch('/api/products?limit=200')
      .then((r) => r.json())
      .then((json) => setProducts(json?.data || []))
      .catch(() => {});
  }, [tab, products.length]);

  const items = useMemo(() => {
    const fromDb = reviews
      .filter((r) => r.comment && r.rating >= 1)
      .map((r) => ({
        id: r.id,
        name: r.reviewer_name,
        product: r.product_name ? cleanName(r.product_name) : '',
        slug: r.product_slug,
        quote: r.comment,
        rating: r.rating,
        image: r.image_url,
        verified: r.verified,
      }));
    return [...fromDb, ...TESTIMONIALS];
  }, [reviews]);

  const average = items.length ? items.reduce((sum, r) => sum + Number(r.rating), 0) / items.length : 0;

  return (
    <section id="reviews" className="w-full overflow-x-hidden bg-[#FFFAEB] py-10 sm:py-14 md:py-16" aria-labelledby="testimonials-heading">
      <div className="mx-auto w-full min-w-0 max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-[#FFFAEB] shadow-md sm:h-16 sm:w-16" aria-hidden>
            <FaQuoteLeft className="text-2xl sm:text-3xl" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="testimonials-heading" className="font-heading text-[clamp(1.375rem,4.5vw,2rem)] font-bold leading-tight tracking-tight text-stone-900">
              What devotees are saying
            </h2>
            {items.length ? (
              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-stone-600 sm:justify-start">
                <StarRow rating={average} />
                <span>
                  {average.toFixed(1)} from {items.length} customer {items.length === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            ) : null}
          </div>
          <div className="flex shrink-0 rounded-full border border-amber-200 bg-white p-1 shadow-sm" role="tablist" aria-label="Reviews">
            {[
              ['read', 'Read reviews'],
              ['write', 'Write a review'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === key ? 'bg-primary text-white' : 'text-stone-700 hover:bg-amber-50'
                }`}
              >
                {key === 'write' ? <FaPen className="text-xs" aria-hidden /> : null}
                {label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'read' ? <ReviewMarquee items={items} /> : <WriteReviewForm products={products} onDone={() => setTab('read')} />}
      </div>
    </section>
  );
};

export default TestimonialsSection;
