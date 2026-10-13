import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api.js';
import { pricingFromProduct } from '../../utils/productPricing';
import { getCardReviewCount } from '../../utils/reviewDisplayCount.js';

const CATEGORY_OPTIONS = [
  { label: 'All', value: 'all', apiValue: null },
  { label: 'Rudraksha', value: 'rudraksha', apiValue: 'Rudraksha' },
  { label: 'Sprays', value: 'sprays', apiValue: 'Sprays' },
  { label: 'Tulsi Mala', value: 'tulsimala', apiValue: 'Tulsi Mala' },
  { label: 'Accessories', value: 'accessories', apiValue: 'Accessories' },
];

const PurposeProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const purpose = (searchParams.get('purpose') || '').trim();
  const selectedCategory = (searchParams.get('category') || 'all').trim().toLowerCase();
  const activeCategory =
    CATEGORY_OPTIONS.find((opt) => opt.value === selectedCategory) || CATEGORY_OPTIONS[0];

  const pageTitle = useMemo(
    () => (purpose ? `${purpose} Products` : 'Products By Purpose'),
    [purpose],
  );

  useEffect(() => {
    if (!purpose) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          purpose,
          limit: '100',
        });
        if (activeCategory.apiValue) {
          params.set('category', activeCategory.apiValue);
        }

        const response = await apiFetch(`/api/products?${params}`);
        if (!response.ok) throw new Error('Failed to fetch purpose products');
        const result = await response.json();
        if (result?.success && Array.isArray(result.data)) {
          setProducts(result.data);
        } else {
          setProducts([]);
        }
      } catch (_error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [purpose, activeCategory.apiValue]);

  const onCategoryChange = (value) => {
    const next = new URLSearchParams(searchParams);
    next.set('category', value);
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-[#FFFAEB] py-4 sm:py-6 lg:py-8">
      <div className="mx-auto w-full max-w-[1920px] px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="mb-6 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:p-6">
          <h1 className="font-heading text-2xl font-bold text-stone-900 sm:text-3xl">
            {pageTitle}
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Showing products for purpose: <span className="font-semibold">{purpose || 'N/A'}</span>
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((option) => {
              const active = option.value === activeCategory.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onCategoryChange(option.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? 'border-primary bg-primary text-white'
                      : 'border-stone-300 bg-white text-stone-700 hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-gray-600">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 lg:gap-5 xl:grid-cols-3 xl:gap-6 2xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="rudraksh"
                calculatePricing={pricingFromProduct}
                getReviewCount={getCardReviewCount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurposeProducts;
