import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGem } from 'react-icons/fa';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api.js';
import { pricingFromProduct } from '../../utils/productPricing';
import { getCardReviewCount } from '../../utils/reviewDisplayCount.js';

const MOBILE_FEATURED_COUNT = 6;
const DESKTOP_FEATURED_COUNT = 5;
const TULSI_CATEGORY = 'Tulsi Mala';

const getRandomProducts = (items, count) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

const TulsiProd = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileCarousel, setIsMobileCarousel] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 639px)').matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)');
    const onChange = () => setIsMobileCarousel(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(
          `/api/products?category=${encodeURIComponent(TULSI_CATEGORY)}`
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        const list = result.success && Array.isArray(result.data) ? result.data : [];
        const featuredCount = isMobileCarousel ? MOBILE_FEATURED_COUNT : DESKTOP_FEATURED_COUNT;
        setProducts(getRandomProducts(list, featuredCount));
      } catch (_err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [isMobileCarousel]);

  if (loading) {
    return (
      <section className="py-5 md:py-12 bg-[#FFFAEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Loader />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section
      className="relative py-5 md:py-12 overflow-x-clip overflow-y-visible bg-[#FFFAEB]"
      aria-labelledby="tulsi-featured-heading"
    >
      <div className="relative max-w-400 mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-3xl mx-auto mb-4 md:mb-8">
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-3">
            <FaGem className="text-primary text-sm" aria-hidden />
            Handpicked for you
          </p>
          <h2
            id="tulsi-featured-heading"
            className="font-heading font-bold text-stone-800 text-2xl sm:text-3xl md:text-4xl tracking-tight mb-3"
          >
            Our Tulsi Mala Collection
          </h2>
        </div>

        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-5 lg:gap-7"
          role="list"
          aria-label="Featured Tulsi products"
        >
          {products.map((product) => (
            <div key={product.id} role="listitem" className="min-w-0">
                <ProductCard
                  product={product}
                  variant="rudraksh"
                  size={isMobileCarousel ? 'default' : 'lg'}
                  calculatePricing={pricingFromProduct}
                  getReviewCount={getCardReviewCount}
                />
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-10 flex justify-center">
          <Link
            to="/tulsimala"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm sm:text-base hover:text-primary/80 transition-colors"
          >
            View full Tulsi Mala collection
            <FaArrowRight className="text-sm" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TulsiProd;
