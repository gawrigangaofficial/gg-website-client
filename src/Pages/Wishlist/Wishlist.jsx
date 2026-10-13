import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/Toaster';
import ProductCard from '../../components/ProductCard';
import { pricingFromProduct } from '../../utils/productPricing';
import { getCardReviewCount } from '../../utils/reviewDisplayCount.js';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const toast = useToast();

  const handleRemoveItem = (productId, productName) => {
    removeFromWishlist(productId);
    toast.info(`${productName} removed from wishlist`);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleClearWishlist = () => {
    if (wishlistItems.length === 0) return;
    clearWishlist();
    toast.info('Wishlist cleared');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen py-8 sm:py-12 bg-[#FFFAEB]">
        <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
          <Link
            to="/"
            className="mb-6 sm:mb-8 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <FaArrowLeft className="text-sm sm:text-base" />
            <span className="text-sm sm:text-base">Continue Shopping</span>
          </Link>

          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <FaHeart className="text-6xl sm:text-8xl text-gray-300 mb-6" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Your Wishlist is Empty
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md">
              Start adding products to your wishlist to save them for later!
            </p>
            <Link
              to="/"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-base sm:text-lg"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 lg:py-8 bg-[#FFFAEB]">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/"
            className="mb-4 sm:mb-6 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <FaArrowLeft className="text-sm sm:text-base" />
            <span className="text-sm sm:text-base">Continue Shopping</span>
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
              My Wishlist
            </h1>
            <button
              onClick={handleClearWishlist}
              className="text-sm sm:text-base text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear Wishlist
            </button>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-5 xl:gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="relative group">
              <ProductCard
                product={item}
                calculatePricing={pricingFromProduct}
                getReviewCount={getCardReviewCount}
                onAddToCart={handleAddToCart}
              />
              {/* Remove from Wishlist Button */}
              <button
                onClick={() => handleRemoveItem(item.id, item.name)}
                className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                aria-label="Remove from wishlist"
              >
                <FaTrash className="text-red-600 text-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
