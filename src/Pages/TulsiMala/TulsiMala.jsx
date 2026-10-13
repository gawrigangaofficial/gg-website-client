import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import ExploreSectionsBlock from '../../components/ExploreSectionsBlock';
import tulsiBanner from '../../assets/TulsiMala/tcm.webp';
import { apiFetch } from '../../config/api.js';
import { pricingFromProduct } from '../../utils/productPricing';
import { getCardReviewCount } from '../../utils/reviewDisplayCount.js';
import CollectionSortSelect, { sortProducts } from '../../components/CollectionSortSelect';

/** Must match `categories.name` in your database (comparison is case-insensitive). */
const TULSI_CATEGORY = 'Tulsi Mala';
const TULSI_MALA_SUBCATEGORIES = [
  { id: 1, name: 'Mala' },
  { id: 2, name: 'Necklace' },
  { id: 3, name: 'Bracelet' },
];
const TulsiMala = () => {
  const [searchParams] = useSearchParams();
  const prevSearchQsRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    subcategories: [],
    deities: [],
    planets: [],
    rarities: [],
  });
  const [filters, setFilters] = useState({
    subcategory: 'all',
    deity: 'all',
    planet: 'all',
    rarity: 'all',
    search: '',
    priceMin: 0,
    priceMax: 100000,
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const qs = searchParams.toString();
    const prevQs = prevSearchQsRef.current;
    prevSearchQsRef.current = qs;
    if (prevQs && prevQs.length > 0 && qs.length === 0) {
      setFilters((prev) => ({ ...prev, subcategory: 'all' }));
      return;
    }
    const subParam = searchParams.get('subcategory');
    if (subParam && String(subParam).trim()) {
      const decoded = decodeURIComponent(String(subParam).trim());
      setFilters((prev) => ({
        ...prev,
        subcategory: decoded,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters.subcategory, filters.deity, filters.planet, filters.rarity, filters.search]);

  useEffect(() => {
    const filtered = allProducts.filter((product) => {
      const price = product.price || 0;
      return price >= filters.priceMin && price <= filters.priceMax;
    });
    setProducts(sortProducts(filtered, sortBy));
  }, [filters.priceMin, filters.priceMax, allProducts, sortBy]);

  const fetchFilterOptions = async () => {
    try {
      const response = await apiFetch(
        `/api/products/filters?category=${encodeURIComponent(TULSI_CATEGORY)}`,
      );
      if (!response.ok) throw new Error('Failed to fetch filter options');
      const result = await response.json();
      if (result.success) {
        setFilterOptions(result.data);
      }
    } catch (_error) {
      // Silent error handling
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        category: TULSI_CATEGORY,
        limit: '100',
        ...(filters.subcategory !== 'all' && { subcategory: filters.subcategory }),
        ...(filters.deity !== 'all' && { deity: filters.deity }),
        ...(filters.planet !== 'all' && { planet: filters.planet }),
        ...(filters.rarity !== 'all' && { rarity: filters.rarity }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await apiFetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const result = await response.json();
      if (result.success) {
        setAllProducts(result.data);
        const filtered = result.data.filter((product) => {
          const price = product.price || 0;
          return price >= filters.priceMin && price <= filters.priceMax;
        });
        setProducts(sortProducts(filtered, sortBy));
      } else {
        setAllProducts([]);
        setProducts([]);
      }
    } catch (_error) {
      setAllProducts([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      subcategory: 'all',
      deity: 'all',
      planet: 'all',
      rarity: 'all',
      search: '',
      priceMin: 0,
      priceMax: 100000,
    });
  };

  const maxPrice =
    allProducts.length > 0
      ? Math.max(...allProducts.map((p) => p.price || 0), 100000)
      : 100000;

  return (
    <div className="min-h-screen bg-[#FFFAEB] py-4 sm:py-6 lg:py-8">
      <div className="mx-auto w-full max-w-[1920px] px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        {/* Header with Banner */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="w-full overflow-hidden rounded-2xl shadow-md">
            <img
              src={tulsiBanner}
              alt="Explore variety of Tulsi Mala"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>

        {/* Filter Toggle for Mobile */}
        <div className="mb-4 flex items-center gap-3 sm:mb-6 lg:hidden">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
            aria-label="Toggle filters"
          >
            <FiFilter className="text-base" />
            Filters
          </button>
        </div>

        {/* Mobile Overlay */}
        <div
          className={`fixed inset-x-0 top-[var(--mobile-header-h,5.5rem)] bottom-0 z-[60] bg-black/40 backdrop-blur-sm transition-all duration-300 ease-out lg:hidden ${
            showFilters ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={() => setShowFilters(false)}
        ></div>

        {/* Main Content with Sidebar */}
        <div className="relative flex flex-col gap-4 sm:gap-6 lg:flex-row">
          {/* Sidebar Filters */}
          <aside
            className={`
            fixed lg:static
            top-[var(--mobile-header-h,5.5rem)] lg:top-auto left-0
            bottom-[var(--gg-tabbar-offset)] lg:bottom-auto
            h-auto lg:h-auto
            w-72 sm:w-80 lg:w-72 xl:w-80
            bg-[#FFFAEB] lg:bg-white
            z-[65] lg:z-auto
            transform transition-all duration-300 ease-out
            ${showFilters ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100'}
            ${showFilters ? 'visible' : 'invisible lg:visible'}
            shadow-2xl lg:shadow-md
            overflow-y-auto lg:overflow-visible
          `}
          >
            <div className="h-full p-4 sm:p-6 lg:sticky lg:top-4 lg:h-auto lg:rounded-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="text-2xl text-gray-500 hover:text-gray-700 lg:hidden"
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-gray-700">Price Range</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={maxPrice}
                      value={filters.priceMin}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        handleFilterChange('priceMin', Math.min(val, filters.priceMax));
                      }}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      min={filters.priceMin}
                      max={maxPrice}
                      value={filters.priceMax}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || maxPrice;
                        handleFilterChange('priceMax', Math.max(val, filters.priceMin));
                      }}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Max"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <label className="mb-1 block text-xs text-gray-600">Min Price</label>
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={filters.priceMin}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          handleFilterChange('priceMin', Math.min(val, filters.priceMax));
                        }}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-orange-500"
                      />
                    </div>
                    <div className="relative">
                      <label className="mb-1 block text-xs text-gray-600">Max Price</label>
                      <input
                        type="range"
                        min={filters.priceMin}
                        max={maxPrice}
                        value={filters.priceMax}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          handleFilterChange('priceMax', Math.max(val, filters.priceMin));
                        }}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-orange-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between pt-2 text-xs font-medium text-gray-600">
                    <span>₹{filters.priceMin.toLocaleString('en-IN')}</span>
                    <span>₹{filters.priceMax.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Subcategory Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Subcategory</label>
                <select
                  value={filters.subcategory}
                  onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Subcategories</option>
                  {TULSI_MALA_SUBCATEGORIES.map((subcat) => (
                    <option key={subcat.id} value={subcat.name}>
                      {subcat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deity Filter */}
              {filterOptions.deities.length > 0 && (
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Deity</label>
                  <select
                    value={filters.deity}
                    onChange={(e) => handleFilterChange('deity', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  <label className="mb-2 block text-sm font-medium text-gray-700">Planet</label>
                  <select
                    value={filters.planet}
                    onChange={(e) => handleFilterChange('planet', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  <label className="mb-2 block text-sm font-medium text-gray-700">Rarity</label>
                  <select
                    value={filters.rarity}
                    onChange={(e) => handleFilterChange('rarity', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                type="button"
                onClick={clearFilters}
                className="mt-4 w-full rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
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
      </div>
      <ExploreSectionsBlock excludeCategory="Tulsi Mala" />
    </div>
  );
};

export default TulsiMala;
