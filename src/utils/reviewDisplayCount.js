/**
 * Review count for product cards. The products API does not return review totals, so cards show no
 * rating: a made-up count breaks Google's review-snippet rules and India's 2022 fake-review guidelines.
 * Product pages show real ratings from /api/reviews. Return a real count here once the API provides one.
 */
export function getCardReviewCount(product) {
  return Number(product?.review_count) || 0;
}
