import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import ExploreSectionsBlock from '../../components/ExploreSectionsBlock';
import combosHeaderBanner from '../../assets/Combos/combos-header.webp';
import { pricingFromProduct } from '../../utils/productPricing';
import { getCardReviewCount } from '../../utils/reviewDisplayCount.js';
import { fetchAllProductsByCategory } from '../../utils/shopProductFetch';

/** Must match `categories.name` in your database (comparison is case-insensitive on the API). */
const COMBOS_CATEGORY = 'Combos';

const Combos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const list = await fetchAllProductsByCategory(COMBOS_CATEGORY);
        if (!cancelled) setProducts(list);
      } catch (_err) {
        if (!cancelled) {
          setError('Unable to load combos right now.');
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFAEB] py-4 sm:py-6 lg:py-8">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <h1 className="sr-only">Combos</h1>
        <div className="mb-6 sm:mb-8 text-center">
          <div className="w-full overflow-hidden rounded-2xl shadow-md">
            <img
              src={combosHeaderBanner}
              alt="Gawri Ganga — curated combo packs and bundles"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <p className="text-stone-600">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center px-4">
            <p className="text-stone-600">
              No combo products found. If you use a different category name in the admin (for example
              &quot;Combo&quot;), update <code className="text-sm bg-stone-100 px-1 rounded">COMBOS_CATEGORY</code>{' '}
              in <code className="text-sm bg-stone-100 px-1 rounded">Combos.jsx</code> to match your database.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-7 xl:grid-cols-5"
            role="list"
          >
            {products.map((product) => (
              <div key={product.id} role="listitem" className="relative min-w-0">
                <ProductCard
                  product={product}
                  variant="rudraksh"
                  size="default"
                  calculatePricing={pricingFromProduct}
                  getReviewCount={getCardReviewCount}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <ExploreSectionsBlock excludeCategory="Combos" />
    </div>
  );
};

export default Combos;
