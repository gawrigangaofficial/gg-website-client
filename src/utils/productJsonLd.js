const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '');

export function buildProductJsonLd({ product, pricing, avgRating = 0, reviewCount = 0 }) {
  if (!product?.id) return null;

  const slug = product.slug || product.id;
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const inStock = Number(product.stock) > 0;

  const json = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description || product.description || product.name,
    image: images.length ? images : undefined,
    sku: String(product.id),
    brand: {
      '@type': 'Brand',
      name: 'Gawri Ganga',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE}/product/${slug}`,
      priceCurrency: 'INR',
      price: Number(pricing?.currentPrice) || Number(product.price) || 0,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  if (reviewCount > 0 && avgRating > 0) {
    json.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return json;
}

export function buildBreadcrumbJsonLd(items) {
  if (!items?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${SITE}${item.url}` : undefined,
    })),
  };
}
