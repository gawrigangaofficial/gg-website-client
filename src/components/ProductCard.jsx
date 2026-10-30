import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from './Toaster';
import { pricingFromProduct } from '../utils/productPricing';
import { isProductPreorder } from '../utils/productPreorder';
import { useProductRating } from '../utils/reviewDisplayCount.js';

const LOW_STOCK_THRESHOLD = 5;

function getStockStatus(product) {
  const stock = Number(product?.stock) || 0;
  if (stock <= 0) return { kind: 'out', stock: 0 };
  if (stock <= LOW_STOCK_THRESHOLD) return { kind: 'low', stock };
  return { kind: 'in', stock };
}

const ProductCard = ({
  product, 
  calculatePricing,
  onAddToCart
}) => {
  const isPreorder = isProductPreorder(product);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const toast = useToast();
  const inWishlist = isInWishlist(product.id);
  const stockStatus = getStockStatus(product);
  // Calculate pricing
  const pricing = calculatePricing ? calculatePricing(product) : pricingFromProduct(product);

  // Get review count
  const { average: ratingAverage, count: reviewCount } = useProductRating(product.id);



  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use cart context if available, otherwise use prop callback
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

  const categoryLabel = product.subcategory || product.category || 'Sacred';
  const outOfStock = !isPreorder && stockStatus.kind === 'out';

  return (
    <>
    <Link
      to={`/product/${product.slug || product.id}`}
      className="flex h-full flex-col"
    >
      <div className="relative">
        <div className="relative aspect-square overflow-hidden rounded-[1.15rem] bg-[#f6efe6]">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-stone-400">No image</div>
          )}
          {pricing.discount > 0 && (
            <span className="absolute left-2 top-2 rounded-md bg-[#ff914d] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Sale
            </span>
          )}
          <button
            type="button"
            onClick={handleWishlistClick}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#e07830]"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {inWishlist ? <FaHeart className="text-xs" /> : <FaRegHeart className="text-xs" />}
          </button>
        </div>
        <button
          type="button"
          onClick={handleCartClick}
          disabled={outOfStock}
          className="absolute -bottom-3.5 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl leading-none text-[#e07830] shadow-md ring-1 ring-orange-100 disabled:opacity-40"
          aria-label="Add to cart"
        >
          +
        </button>
      </div>
      <div className="flex flex-1 flex-col px-0.5 pb-1 pt-5">
        <p className="text-[11px] font-medium text-stone-600">{categoryLabel}</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-base font-bold text-stone-900">
            ₹{pricing.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          {pricing.discount > 0 && (
            <>
              <span className="text-xs text-stone-400 line-through">
                ₹{pricing.originalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              <span className="text-xs font-bold text-[#e07830]">{pricing.discount}% OFF</span>
            </>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-[13px] font-medium leading-snug text-stone-800">
          {product.name}
        </p>
        {reviewCount > 0 ? (
          <p className="mt-1 flex items-center gap-1 text-[11px] text-stone-600">
            <FaStar className="text-[10px] text-emerald-600" aria-hidden />
            <span className="font-semibold text-stone-700">{ratingAverage.toFixed(1)}</span>
            <span>({reviewCount})</span>
          </p>
        ) : null}
        {outOfStock ? (
          <p className="mt-1 text-[11px] font-semibold text-red-600">Out of stock</p>
        ) : null}
      </div>
    </Link>
    </>
  );
};

export default ProductCard;

