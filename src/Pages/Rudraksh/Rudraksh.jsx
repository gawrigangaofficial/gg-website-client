import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import ExploreSectionsBlock from '../../components/ExploreSectionsBlock';
import rudrakshBanner from '../../assets/RudraksPageImg/rd1.webp';
import { apiFetch } from '../../config/api.js';
import { pricingFromProduct } from '../../utils/productPricing';
import { getCardReviewCount } from '../../utils/reviewDisplayCount.js';
import CollectionSortSelect, { sortProducts } from '../../components/CollectionSortSelect';

const MUKHI_SUBCATEGORIES = Array.from({ length: 14 }, (_, i) => `${i + 1} Mukhi`);

function subcategoryFromSearchParams(sp) {
  const raw = sp.get('subcategory') ?? sp.get('mukhi');
  if (raw == null || !String(raw).trim()) return 'all';
  try {
    return decodeURIComponent(String(raw).trim());
  } catch {
    return String(raw).trim();
  }
}

const Rudraksh = () => {
  const [searchParams] = useSearchParams();
  const prevSearchQsRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    subcategories: [],
    deities: [],
    planets: [],
    rarities: [],
    purposes: [],
  });
  const [filters, setFilters] = useState(() => ({
    subcategory: subcategoryFromSearchParams(searchParams),
    deity: 'all',
    planet: 'all',
    rarity: 'all',
    purpose: searchParams.get('purpose') || 'all',
    availability: 'in_stock',
    search: '',
    priceMin: 0,
    priceMax: 100000
  }));
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (filters.subcategory === 'all') return;
    const list = filterOptions.subcategories;
    if (!list.length) return;
    const match = list.find(
      (s) => s.trim().toLowerCase() === filters.subcategory.trim().toLowerCase(),
    );
    if (match && match !== filters.subcategory) {
      setFilters((prev) => ({ ...prev, subcategory: match }));
    }
  }, [filterOptions.subcategories, filters.subcategory]);

  useEffect(() => {
    const qs = searchParams.toString();
    const prevQs = prevSearchQsRef.current;
    prevSearchQsRef.current = qs;
    if (prevQs && prevQs.length > 0 && qs.length === 0) {
      setFilters((prev) =>
        prev.subcategory === 'all' ? prev : { ...prev, subcategory: 'all' },
      );
      return;
    }
    const sub = searchParams.get('subcategory') || searchParams.get('mukhi');
    if (!sub || !String(sub).trim()) return;
    const decoded = decodeURIComponent(String(sub).trim());
    setFilters((prev) =>
      prev.subcategory === decoded ? prev : { ...prev, subcategory: decoded },
    );
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters.subcategory, filters.deity, filters.planet, filters.rarity, filters.purpose, filters.search]);

  useEffect(() => {
    const filtered = allProducts.filter((product) => {
      const price = product.price || 0;
      if (price < filters.priceMin || price > filters.priceMax) return false;
      if (filters.availability === 'in_stock') {
        const stock = Number(product.stock ?? product.stock_quantity ?? 0);
        if (stock <= 0 && product.sale_type !== 'preorder' && !product.is_preorder) return false;
      }
      return true;
    });
    setProducts(sortProducts(filtered, sortBy));
  }, [filters.priceMin, filters.priceMax, filters.availability, allProducts, sortBy]);

  const fetchFilterOptions = async () => {
    try {
      const response = await apiFetch('/api/products/filters?category=Rudraksha');
      if (!response.ok) throw new Error('Failed to fetch filter options');
      const result = await response.json();
      if (result.success) {
        setFilterOptions({
          subcategories: result.data?.subcategories || [],
          deities: result.data?.deities || [],
          planets: result.data?.planets || [],
          rarities: result.data?.rarities || [],
          purposes: result.data?.purposes || [],
        });
      }
    } catch (_error) {
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        category: 'Rudraksha',
        ...(filters.subcategory !== 'all' && { subcategory: filters.subcategory }),
        ...(filters.deity !== 'all' && { deity: filters.deity }),
        ...(filters.planet !== 'all' && { planet: filters.planet }),
        ...(filters.rarity !== 'all' && { rarity: filters.rarity }),
        ...(filters.purpose !== 'all' && { purpose: filters.purpose }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await apiFetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const result = await response.json();
      if (result.success) {
        setAllProducts(result.data);
        const filtered = result.data.filter((product) => {
          const price = product.price || 0;
          if (price < filters.priceMin || price > filters.priceMax) return false;
          if (filters.availability === 'in_stock') {
            const stock = Number(product.stock ?? product.stock_quantity ?? 0);
            if (stock <= 0 && product.sale_type !== 'preorder' && !product.is_preorder) return false;
          }
          return true;
        });
        setProducts(sortProducts(filtered, sortBy));
      }
    } catch (_error) {
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      subcategory: 'all',
      deity: 'all',
      planet: 'all',
      rarity: 'all',
      purpose: 'all',
      availability: 'in_stock',
      search: '',
      priceMin: 0,
      priceMax: 100000
    });
  };

  // Calculate max price from products
  const maxPrice = allProducts.length > 0 
    ? Math.max(...allProducts.map(p => p.price || 0), 100000)
    : 100000;

  return (
    <div className="min-h-screen py-4 sm:py-6 lg:py-8">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        {/* Header with Banner */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="w-full rounded-lg overflow-hidden shadow-md">
            <img
              src={rudrakshBanner}
              alt="Nepali Rudraksha mala and original beads — 1 to 8+ Mukhi collection at Gawri Ganga, India"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Filter Toggle for Mobile */}
        <div className="mb-4 sm:mb-6 lg:hidden flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
            aria-label="Toggle filters"
          >
            <FiFilter className="text-xl" />
          </button>
        </div>

        {/* Mobile Overlay */}
        <div
          className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ease-out ${
            showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setShowFilters(false)}
        ></div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 relative">
          {/* Sidebar Filters */}
          <aside className={`
            fixed lg:static
            top-0 left-0
            h-full lg:h-auto
            w-72 sm:w-80 lg:w-72 xl:w-80
            bg-white
            z-50 lg:z-auto
            transform transition-all duration-300 ease-out
            ${showFilters ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100'}
            ${showFilters ? 'visible' : 'invisible lg:visible'}
            shadow-2xl lg:shadow-md
            overflow-y-auto lg:overflow-visible
          `}>
            <div className="p-4 sm:p-6 lg:rounded-lg lg:sticky lg:top-4 h-full lg:h-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 text-2xl"
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Price Range
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={maxPrice}
                      value={filters.priceMin}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        handleFilterChange('priceMin', Math.min(val, filters.priceMax));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      min={filters.priceMin}
                      max={maxPrice}
                      value={filters.priceMax}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || maxPrice;
                        handleFilterChange('priceMax', Math.max(val, filters.priceMin));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <label className="text-xs text-gray-600 mb-1 block">Min Price</label>
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={filters.priceMin}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          handleFilterChange('priceMin', Math.min(val, filters.priceMax));
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                    </div>
                    <div className="relative">
                      <label className="text-xs text-gray-600 mb-1 block">Max Price</label>
                      <input
                        type="range"
                        min={filters.priceMin}
                        max={maxPrice}
                        value={filters.priceMax}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          handleFilterChange('priceMax', Math.max(val, filters.priceMin));
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 font-medium pt-2">
                    <span>₹{filters.priceMin.toLocaleString('en-IN')}</span>
                    <span>₹{filters.priceMax.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Mukhi (subcategory) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mukhi
                </label>
                <select
                  value={filters.subcategory}
                  onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                >
                  <option value="all">All Mukhi</option>
                  {MUKHI_SUBCATEGORIES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Purpose */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose
                </label>
                <select
                  value={filters.purpose}
                  onChange={(e) => handleFilterChange('purpose', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                >
                  <option value="all">All Purposes</option>
                  {(filterOptions.purposes || []).map((purpose) => (
                    <option key={purpose} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                >
                  <option value="in_stock">In stock only</option>
                  <option value="all">Include out of stock</option>
                </select>
              </div>

              {/* Deity Filter */}
              {filterOptions.deities.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deity
                  </label>
                  <select
                    value={filters.deity}
                    onChange={(e) => handleFilterChange('deity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    <option value="all">All Deities</option>
                    {filterOptions.deities.map((deity) => (
                      <option key={deity} value={deity}>
                        {deity}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Planet Filter */}
              {filterOptions.planets.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Planet
                  </label>
                  <select
                    value={filters.planet}
                    onChange={(e) => handleFilterChange('planet', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    <option value="all">All Planets</option>
                    {filterOptions.planets.map((planet) => (
                      <option key={planet} value={planet}>
                        {planet}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Rarity Filter */}
              {filterOptions.rarities.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rarity
                  </label>
                  <select
                    value={filters.rarity}
                    onChange={(e) => handleFilterChange('rarity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    <option value="all">All Rarities</option>
                    {filterOptions.rarities.map((rarity) => (
                      <option key={rarity} value={rarity}>
                        {rarity}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={clearFilters}
                className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Products Section */}
          <div className="flex-1">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                {loading ? 'Loading…' : `${products.length} product${products.length === 1 ? '' : 's'}`}
              </p>
              <CollectionSortSelect value={sortBy} onChange={setSortBy} />
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-600">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-5 xl:gap-6">
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
      </div>
      <ExploreSectionsBlock excludeCategory="Rudraksha" />
      <section
        className="mx-auto w-full max-w-[1920px] px-3 pb-8 pt-2 sm:px-4 sm:pb-10 md:px-6 lg:px-8 xl:px-12"
        aria-labelledby="rudraksha-collection-heading"
      >
        <div className="mx-auto max-w-5xl rounded-2xl border border-amber-200/70 bg-linear-to-br from-amber-50 via-white to-orange-50 p-5 shadow-sm sm:p-7 md:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
            Rudraksha Guide
          </p>
          <h1
            id="rudraksha-collection-heading"
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-stone-900"
          >
            Nepali Rudraksha &amp; Rudraksha mala online in India
          </h1>

          <div className="mt-4 grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
            <div className="rounded-xl border border-amber-100 bg-white/80 p-4 sm:p-5">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-stone-900">
                Natural beads, japa &amp; meditation malas
              </h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-stone-700">
                Choose <strong className="font-semibold text-stone-800">natural rudraksha beads</strong> for naam jap, dhyan, and daily
                wear <strong className="font-semibold text-stone-800">rudraksha japa malas</strong>, wrist malas, and{' '}
                <strong className="font-semibold text-stone-800">Lord Shiva rudraksha</strong> traditions.
              </p>
            </div>

            <div className="rounded-xl border border-amber-100 bg-white/80 p-4 sm:p-5">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-stone-900">
                Compare, choose, and shop confidently
              </h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-stone-700">
                We highlight clear origins, transparent pricing, and trusted delivery across India. Looking for{' '}
                <strong className="font-semibold text-stone-800">rudraksha by rashi</strong>? Visit our{' '}
                <Link to="/rashi" className="font-semibold text-primary underline-offset-2 hover:underline">
                  shop by Rashi
                </Link>{' '}
                guide and browse by Mukhi to match your practice.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rudraksh;

