import { useEffect, useState } from 'react';
import { apiFetch } from '../config/api.js';

/**
 * Real ratings for product cards, built from approved reviews (/api/reviews/public).
 * Fetched once per page load and shared by every card. A product with no approved review shows no stars.
 */
let statsPromise = null;
let statsCache = null;

function loadStats() {
  if (!statsPromise) {
    statsPromise = apiFetch('/api/reviews/public?limit=500')
      .then((r) => r.json())
      .then((json) => {
        const map = {};
        for (const review of json?.data || []) {
          const id = String(review.product_id);
          const entry = map[id] || (map[id] = { sum: 0, count: 0 });
          entry.sum += Number(review.rating) || 0;
          entry.count += 1;
        }
        statsCache = map;
        return map;
      })
      .catch(() => {
        statsCache = {};
        return statsCache;
      });
  }
  return statsPromise;
}

/** { average, count } for a product id; count is 0 until approved reviews exist. */
export function useProductRating(productId) {
  const [stats, setStats] = useState(statsCache);

  useEffect(() => {
    if (statsCache) return undefined;
    let cancelled = false;
    loadStats().then((map) => {
      if (!cancelled) setStats(map);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const entry = stats?.[String(productId)];
  return entry ? { average: entry.sum / entry.count, count: entry.count } : { average: 0, count: 0 };
}

/** Kept for existing callers that pass getReviewCount; cards now read useProductRating directly. */
export function getCardReviewCount() {
  return 0;
}
