import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import ExploreSectionsBlock from '../../components/ExploreSectionsBlock';
import Heading from '../../assets/Sprayelem/Header.webp';
import { pricingFromProduct } from '../../utils/productPricing';
import { getCardReviewCount } from '../../utils/reviewDisplayCount.js';
import { fetchAllProductsByCategory } from '../../utils/shopProductFetch';

const Spray = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const list = await fetchAllProductsByCategory('Sprays');
        setProducts(list);
      } catch (_error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFAEB] py-4 sm:py-6 lg:py-8">
      <div className="mx-auto w-full max-w-[1920px] px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <img src={Heading} alt="" className="mb-4 w-full rounded-3xl sm:mb-6" />
        <header className="mb-4 max-w-2xl sm:mb-6">
          <h1 className="font-heading text-2xl font-bold text-stone-900 sm:text-3xl">Aura sprays</h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
            Amrat Bindu, Maitri, Chakra Balance, and Shuddhi — room sprays for calm, focus, and a clean space.
          </p>
        </header>
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-stone-600">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="spray"
                calculatePricing={pricingFromProduct}
                getReviewCount={getCardReviewCount}
              />
            ))}
          </div>
        )}
      </div>
      <ExploreSectionsBlock excludeCategory="Sprays" />
    </div>
  );
};

export default Spray;
