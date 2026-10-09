import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from './Toaster';
import { pricingFromProduct } from '../utils/productPricing';
import { formatMeasuresSummary } from '../utils/productMeasures';

const SPRAY_THEMES = {
  amratDhara: {
    accent: '#2283c7',
    heading: '#1a6ba0',
    gradient: 'linear-gradient(90deg, #dff4fb 0%, #eaf7ff 50%, #fffaf1 100%)',
    imageOverlay: 'linear-gradient(90deg, rgba(15, 79, 116, 0.32) 0%, rgba(26, 107, 160, 0.1) 45%, rgba(255, 255, 255, 0) 100%)',
    subcategoryBg: '#eefafd',
    subcategoryBorder: '#bfe8f5',
    essenceBg: '#f2f7ff',
    essenceBorder: '#d4e7fb',
    essenceText: '#2d6ea1'
  },
  chakraBalance: {
    accent: '#582683',
    heading: '#582683',
    gradient: 'linear-gradient(90deg, #f0e7fb 0%, #f7edff 50%, #fff8f2 100%)',
    imageOverlay: 'linear-gradient(90deg, rgba(56, 21, 88, 0.32) 0%, rgba(88, 38, 131, 0.1) 45%, rgba(255, 255, 255, 0) 100%)',
    subcategoryBg: '#f4edfb',
    subcategoryBorder: '#ddc9f2',
    essenceBg: '#f9f2ff',
    essenceBorder: '#ead8fb',
    essenceText: '#6a3e95'
  },
  maitri: {
    accent: '#E27BB1',
    heading: '#c9689a',
    gradient: 'linear-gradient(90deg, #ffeaf3 0%, #fff2f8 50%, #fff9ef 100%)',
    imageOverlay: 'linear-gradient(90deg, rgba(120, 40, 85, 0.28) 0%, rgba(201, 104, 154, 0.1) 45%, rgba(255, 255, 255, 0) 100%)',
    subcategoryBg: '#fff2f8',
    subcategoryBorder: '#f5cde0',
    essenceBg: '#fff6fb',
    essenceBorder: '#f6ddec',
    essenceText: '#a15580'
  },
  shuddhi: {
    accent: '#597B2C',
    heading: '#486323',
    gradient: 'linear-gradient(90deg, #edf6e3 0%, #f4fbe7 50%, #fffaf1 100%)',
    imageOverlay: 'linear-gradient(90deg, rgba(49, 79, 18, 0.32) 0%, rgba(72, 99, 35, 0.1) 45%, rgba(255, 255, 255, 0) 100%)',
    subcategoryBg: '#f0f8e7',
    subcategoryBorder: '#d5e8bd',
    essenceBg: '#f6fcea',
    essenceBorder: '#e2efce',
    essenceText: '#4f6f29'
  },
  default: {
    accent: '#1a6ba0',
    heading: '#1a6ba0',
    gradient: 'linear-gradient(90deg, #dff4fb 0%, #f6edf8 50%, #fff8ee 100%)',
    imageOverlay: 'linear-gradient(90deg, rgba(15, 79, 116, 0.35) 0%, rgba(26, 107, 160, 0.1) 45%, rgba(255, 255, 255, 0) 100%)',
    subcategoryBg: '#eefafd',
    subcategoryBorder: '#bfe8f5',
    essenceBg: '#fff2f8',
    essenceBorder: '#f1d2e4',
    essenceText: '#a15580'
  }
};

const resolveSprayTheme = (product = {}) => {
  const label = `${product.name || ''} ${product.subcategory || ''}`.toLowerCase();
  if (label.includes('amrat bindu') || label.includes('amrat dhara')) return SPRAY_THEMES.amratDhara;
  if (label.includes('chakra balance')) return SPRAY_THEMES.chakraBalance;
  if (label.includes('maitri')) return SPRAY_THEMES.maitri;
  if (label.includes('shuddhi')) return SPRAY_THEMES.shuddhi;
  return SPRAY_THEMES.default;
};

function getSprayEssence(subcategory) {
  if (!subcategory) return null;
  const essenceMap = {
    'Chakra Balance': 'Gurhal',
    'Amrat Bindu': 'Lavandur',
    'Amrat Dhara': 'Lavandur',
    Maitri: 'Levandur',
    Shuddhi: 'Kewda/Mogra',
  };
  if (essenceMap[subcategory]) return essenceMap[subcategory];
  const match = subcategory.match(/\(Essence\s*-\s*([^)]+)\)/i);
  if (match) return match[1].trim();
  const match2 = subcategory.match(/\(([^)]+)\)/);
  if (match2) return match2[1].trim();
  return null;
}

const SprayProductCard = ({
  product,
  calculatePricing,
  getReviewCount,
  onAddToCart
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const toast = useToast();
  const inWishlist = isInWishlist(product.id);

  const pricing = calculatePricing ? calculatePricing(product) : pricingFromProduct(product);
  const reviewCount = getReviewCount ? getReviewCount(product.id) : 5;
  const essence = getSprayEssence(product.subcategory);
  const theme = resolveSprayTheme(product);
  const descriptionText = String(
    product.description ||
      product.short_description ||
      product.shortDescription ||
      ''
  ).trim();
  const sprayLabel = `${product?.name || ''} ${product?.subcategory || ''}`.toLowerCase();
  const isAmratDhara = sprayLabel.includes('amrat bindu') || sprayLabel.includes('amrat dhara') || String(product?.slug || '').toLowerCase() === 'amrat-bindu-aura-spray';
  const isMaitri = `${product?.name || ''} ${product?.subcategory || ''}`.toLowerCase().includes('maitri');
  const isChakraBalance = `${product?.name || ''} ${product?.subcategory || ''}`.toLowerCase().includes('chakra balance');
  const isShuddhi = `${product?.name || ''} ${product?.subcategory || ''}`.toLowerCase().includes('shuddhi');
  const productLink = isAmratDhara
    ? '/sprays/amrat-bindu'
    : isMaitri
      ? '/sprays/maitri'
      : isChakraBalance
        ? '/sprays/chakra-balance'
        : isShuddhi
          ? '/sprays/shuddhi'
          : `/product/${product.slug || product.id}`;

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (addToCart) {
      addToCart(product, 1);
      toast.success(`${product.name} added to cart!`);
    } else if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    if (added) {
      toast.success(`${product.name} added to wishlist!`);
    } else {
      toast.info(`${product.name} removed from wishlist`);
    }
  };

  return (
    <Link
      to={productLink}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1"
      style={{
        border: `1px solid ${theme.accent}55`,
        boxShadow: `0 8px 24px ${theme.accent}24`
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_1fr]">
        <div
          className="relative aspect-16/10 w-full overflow-hidden sm:aspect-auto sm:min-h-[290px]"
          style={{ background: theme.gradient }}
        >
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/700x440?text=No+Image';
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-base text-gray-400">
              No Image
            </div>
          )}

          <div className="pointer-events-none absolute inset-0" style={{ background: theme.imageOverlay }} />

          <div
            className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] sm:text-xs"
            style={{ border: `1px solid ${theme.accent}66`, color: theme.heading }}
          >
            Aura Spray
          </div>

          {pricing.discount > 0 && (
            <div
              className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white shadow-md sm:text-sm"
              style={{ backgroundColor: theme.heading }}
            >
              {pricing.discount}% OFF
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col bg-linear-to-b from-white via-[#fffdfc] to-[#f9feff] p-4 sm:p-5">
          <div className="mb-2 flex flex-wrap gap-2">
            {product.subcategory && (
              <span
                className="rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{
                  border: `1px solid ${theme.subcategoryBorder}`,
                  backgroundColor: theme.subcategoryBg,
                  color: theme.heading
                }}
              >
                {product.subcategory}
              </span>
            )}
            {essence && (
              <span
                className="rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{
                  border: `1px solid ${theme.essenceBorder}`,
                  backgroundColor: theme.essenceBg,
                  color: theme.essenceText
                }}
              >
                {essence}
              </span>
            )}
          </div>

          <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-gray-900 sm:text-xl">
            {product.name}
          </h3>

          {Array.isArray(product.measures) && product.measures.length > 0 ? (
            <p className="mb-2 text-xs font-semibold text-gray-800 sm:text-sm" title={formatMeasuresSummary(product.measures)}>
              {formatMeasuresSummary(product.measures)}
            </p>
          ) : null}

          <div className="mb-4 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-sm fill-current" style={{ color: theme.accent }} />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-500 sm:text-sm">({reviewCount})</span>
          </div>

          {descriptionText ? (
            <div className="mb-2 min-w-0">
              <p
                className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs"
                style={{ color: theme.essenceText }}
              >
                Description
              </p>
              <p className="line-clamp-4 text-sm leading-relaxed text-gray-600 sm:line-clamp-5 sm:text-base">
                {descriptionText}
              </p>
            </div>
          ) : null}

          <div className="mt-auto pt-3" style={{ borderTop: `1px solid ${theme.accent}33` }}>
            <div className="mb-3 flex items-end justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="shrink-0 text-xl font-bold sm:text-2xl" style={{ color: theme.heading }}>
                    ₹{pricing.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                  {pricing.discount > 0 && (
                    <span className="hidden shrink-0 text-sm font-medium text-gray-400 line-through sm:inline">
                      ₹{pricing.originalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  )}
                </div>
                {!(Number(product.stock) > 0) && (
                  <span className="inline-flex items-center text-xs font-semibold text-red-600 sm:text-sm">
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleWishlistClick}
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 hover:scale-105"
                style={{ border: `1px solid ${theme.accent}66`, color: theme.heading }}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {inWishlist ? (
                  <FaHeart className="text-lg fill-current" style={{ color: theme.heading }} />
                ) : (
                  <FaRegHeart className="text-lg" style={{ color: theme.heading }} />
                )}
              </button>
              <button
                onClick={handleCartClick}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-transparent transition-all duration-200 hover:text-white"
                style={{ border: `1px solid ${theme.heading}`, color: theme.heading }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.heading;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label="Add to cart"
              >
                <FaShoppingCart className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SprayProductCard;
