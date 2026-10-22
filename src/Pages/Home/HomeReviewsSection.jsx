import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaStar } from 'react-icons/fa';
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api';

const INITIAL_VISIBLE = 12;

function formatReviewDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function normalizeReview(row) {
  return {
    id: row.id,
    name: row.reviewer_name || 'Customer',
    rating: Number(row.rating) || 0,
    text: row.comment || '',
    imageUrl: row.image_url || null,
    date: formatReviewDate(row.created_at),
    productName: row.product_name || 'Product',
    productSlug: row.product_slug || row.product_id,
  };
}

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={i}
          className={`text-sm ${i < rating ? 'text-amber-500' : 'text-stone-200'}`}
          aria-hidden
        />
      ))}
    </div>
  );
}

const cardClass =
  'mb-4 break-inside-avoid rounded-2xl border-2 border-amber-300/85 bg-white p-4 shadow-[0_8px_24px_-6px_rgba(62,47,28,0.18)] sm:p-5';

const HomeReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    let cancelled = false;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await apiFetch('/api/reviews/public?limit=200');
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || 'Failed to load reviews');
        }
        if (!cancelled) {
          setReviews(Array.isArray(payload.data) ? payload.data.map(normalizeReview) : []);
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load customer reviews right now.');
          setReviews([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchReviews();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleReviews = useMemo(
    () => reviews.slice(0, visibleCount),
    [reviews, visibleCount],
  );

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + (review.rating || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  if (!loading && !error && reviews.length === 0) {
    return null;
  }

  return (
    <section
      className="w-full overflow-x-hidden bg-[#FFFAEB] py-10 sm:py-14 md:py-16 lg:py-20"
      aria-labelledby="home-reviews-heading"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <span
            className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-[#FFFAEB] shadow-md sm:mx-0 sm:h-16 sm:w-16"
            aria-hidden
          >
            <FaStar className="text-2xl text-amber-400 sm:text-3xl" />
          </span>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2
              id="home-reviews-heading"
              className="font-heading text-[clamp(1.375rem,4.5vw,2rem)] font-bold leading-tight tracking-tight text-stone-900 sm:text-3xl md:text-[2rem]"
            >
              Customer reviews
            </h2>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-stone-600 sm:text-base">
              Verified reviews from devotees across Rudraksha, malas, sprays, and sacred accessories.
            </p>
            {!loading && reviews.length > 0 ? (
              <p className="mt-2 text-sm font-semibold text-amber-800">
                {averageRating} average · {reviews.length} verified review{reviews.length === 1 ? '' : 's'}
              </p>
            ) : null}
          </div>
        </div>

        {loading ? (
          <div className="mt-10 flex justify-center py-8">
            <Loader />
          </div>
        ) : error ? (
          <p className="mt-10 text-center text-sm font-medium text-red-600">{error}</p>
        ) : (
          <>
            <div className="mt-8 columns-1 sm:mt-10 sm:columns-2 lg:columns-3 xl:columns-4 [column-gap:1rem] sm:[column-gap:1.25rem]">
              {visibleReviews.map((review) => (
                <article key={review.id} className={`${cardClass} min-w-0`}>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <StarRow rating={review.rating} />
                    {review.date ? (
                      <span className="text-xs text-stone-500">{review.date}</span>
                    ) : null}
                  </div>

                  {review.imageUrl ? (
                    <div className="mb-3 overflow-hidden rounded-xl bg-stone-100">
                      <img
                        src={review.imageUrl}
                        alt="Customer photo with a Gawri Ganga product"
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <p className="font-heading text-sm font-bold text-stone-900 sm:text-base">{review.name}</p>
                  <div className="mb-2 mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 sm:text-sm">
                      <FaCheckCircle className="shrink-0" aria-hidden />
                      Verified purchase
                    </span>
                  </div>

                  {review.text ? (
                    <p className="text-sm leading-relaxed text-stone-700">{review.text}</p>
                  ) : null}

                  {review.productSlug ? (
                    <Link
                      to={`/product/${review.productSlug}`}
                      className="mt-3 inline-block text-xs font-semibold text-primary hover:text-primary/80 sm:text-sm"
                    >
                      {review.productName}
                    </Link>
                  ) : (
                    <p className="mt-3 text-xs font-semibold text-stone-500 sm:text-sm">{review.productName}</p>
                  )}
                </article>
              ))}
            </div>

            {reviews.length > visibleCount ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + INITIAL_VISIBLE)}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-stone-900 bg-white px-6 py-2.5 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-900 hover:text-white"
                >
                  Show more reviews
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
};

export default HomeReviewsSection;
