import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import ExploreSectionsBlock from '../../components/ExploreSectionsBlock';
import accessoriesBanner from '../../assets/Accessories/as1.webp';
import { apiFetch } from '../../config/api.js';
import { pricingFromProduct } from '../../utils/productPricing';
import { getCardReviewCount } from '../../utils/reviewDisplayCount.js';
import CollectionSortSelect, { sortProducts } from '../../components/CollectionSortSelect';
import { CategoryFaq, CollectionSchema } from '../../components/CategorySeo';
import RelatedGuides from '../../components/RelatedGuides';
import Breadcrumbs, { ExploreLinks } from '../../components/Breadcrumbs';
import { STATIC_META } from '../../seo/meta';

const ACCESSORY_FAQS = [
  {
    question: 'Is it fine to wear a Rudraksha bracelet every day?',
    answer:
      'Yes. Many people wear one through the day. Take it off for soap, swimming, and strong perfume so the bead and thread last longer.',
  },
  {
    question: 'Can women wear Rudraksha bracelets and Karungali malas?',
    answer:
      'Yes. Gawri Ganga does not restrict these beads by gender. Wear them clean and dry, and follow any family rule you already keep.',
  },
  {
    question: 'How do I look after a Karungali mala?',
    answer:
      'Karungali is dense ebony wood. Keep it dry, wipe it instead of soaking it, and store it away from heat so the beads do not crack.',
  },
];

const ACCESSORIES_SUBCATEGORIES = [
  { id: 1, name: 'Mala' },
  { id: 2, name: 'Bracelet' },
];
const Accessories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const prevSearchQsRef = useRef(null);
  const fetchSeqRef = useRef(0);
  const subcategoryFromQuery = (() => {
    const subParam = searchParams.get('subcategory');
    if (!subParam || !String(subParam).trim()) return 'all';
    return decodeURIComponent(String(subParam).trim());
  })();
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    subcategories: [],
    deities: [],
    planets: [],
    rarities: []
  });
  const [filters, setFilters] = useState({
    subcategory: subcategoryFromQuery,
    deity: 'all',
    planet: 'all',
    rarity: 'all',
    search: '',
    priceMin: 0,
    priceMax: 100000
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
    prevSearchQsRef.current = qs;
    const subParam = searchParams.get('subcategory');
    const decoded = subParam && String(subParam).trim()
      ? decodeURIComponent(String(subParam).trim())
      : 'all';
    setFilters((prev) => (
      prev.subcategory === decoded
        ? prev
        : { ...prev, subcategory: decoded }
    ));
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters.subcategory, filters.deity, filters.planet, filters.rarity, filters.search]);

  useEffect(() => {
    const filtered = allProducts.filter(product => {
      const price = product.price || 0;
      return price >= filters.priceMin && price <= filters.priceMax;
    });
    setProducts(sortProducts(filtered, sortBy));
  }, [filters.priceMin, filters.priceMax, allProducts, sortBy]);

  const fetchFilterOptions = async () => {
    try {
      const response = await apiFetch('/api/products/filters?category=Accessories');
      if (!response.ok) throw new Error('Failed to fetch filter options');
      const result = await response.json();
      if (result.success) {
        setFilterOptions(result.data);
      }
    } catch (error) {
      // Silent error handling
    }
  };

  const fetchProducts = async () => {
    const requestId = ++fetchSeqRef.current;
    try {
      setLoading(true);
      const params = new URLSearchParams({
        category: 'Accessories',
        ...(filters.subcategory !== 'all' && { subcategory: filters.subcategory }),
        ...(filters.deity !== 'all' && { deity: filters.deity }),
        ...(filters.planet !== 'all' && { planet: filters.planet }),
        ...(filters.rarity !== 'all' && { rarity: filters.rarity }),
        ...(filters.search && { search: filters.search })
      });

      const response = await apiFetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const result = await response.json();
      if (requestId !== fetchSeqRef.current) return;
      if (result.success) {
        const rows = Array.isArray(result.data) ? result.data : [];
        const visible = filters.subcategory === 'all'
          ? rows.filter((product) => {
              const type = String(product.subcategory || '').trim().toLowerCase();
              return type === 'mala' || type === 'bracelet';
            })
          : rows;
        setAllProducts(visible);
        const filtered = visible.filter(product => {
          const price = product.price || 0;
          return price >= filters.priceMin && price <= filters.priceMax;
        });
        setProducts(sortProducts(filtered, sortBy));
      } else {
        setAllProducts([]);
        setProducts([]);
      }
    } catch (error) {
      if (requestId !== fetchSeqRef.current) return;
      setAllProducts([]);
      setProducts([]);
    } finally {
      if (requestId === fetchSeqRef.current) {
        setLoading(false);
      }
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    if (filterType === 'subcategory') {
      if (!value || value === 'all') setSearchParams({});
      else setSearchParams({ subcategory: value });
    }
  };

  const typeChips = [
    { name: 'all', label: 'All' },
    { name: 'Mala', label: 'Malas' },
    { name: 'Bracelet', label: 'Bracelets' },
  ];

  const clearFilters = () => {
    setSearchParams({});
    setFilters({
      subcategory: 'all',
      deity: 'all',
      planet: 'all',
      rarity: 'all',
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
    <div className="min-h-screen bg-[#FFFAEB] py-4 sm:py-6 lg:py-8">
      <CollectionSchema
        name="Rudraksha bracelets and Karungali malas"
        description="Rudraksha bracelets, Karungali wood malas, and sacred bead accessories from Gawri Ganga."
        path="/accessories"
        faqs={ACCESSORY_FAQS}
      />
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <Breadcrumbs items={[{ name: 'Bracelets and Karungali', href: '/accessories' }]} />
        <ExploreLinks />
        <div className="mb-6 sm:mb-8 text-center">
          <div className="w-full overflow-hidden rounded-2xl shadow-md">
            <img
              src={accessoriesBanner}
              alt="Rudraksha bracelets, malas, and Karungali at Gawri Ganga"
              className="w-full h-auto object-cover"
            />
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-stone-900 sm:text-3xl">{STATIC_META['/accessories'].h1}</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
            Rudraksha bracelets for daily wear and Karungali malas in ebony wood. A bracelet is the shorter wrist form of a Rudraksha bead. A Karungali mala is worn for steadiness and a traditional sense of protection. Keep both dry, and take them off for soap.
          </p>
        </div>

        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {typeChips.map((chip) => {
            const active = filters.subcategory === chip.name;
            return (
              <button
                key={chip.name}
                type="button"
                onClick={() => handleFilterChange('subcategory', chip.name)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  active ? 'bg-primary text-white' : 'bg-white text-stone-700 ring-1 ring-orange-200'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Filter Toggle for Mobile */}
        <div className="mb-4 sm:mb-6 lg:hidden flex items-center gap-3">
          <button
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
            showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setShowFilters(false)}
        ></div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 relative">
          {/* Sidebar Filters */}
          <aside className={`
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

              {/* Subcategory Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  value={filters.subcategory}
                  onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                >
                  <option value="all">Malas &amp; bracelets</option>
                  {ACCESSORIES_SUBCATEGORIES.map((subcat) => (
                    <option key={subcat.id} value={subcat.name}>
                      {subcat.name}
                    </option>
                  ))}
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
        <CategoryFaq faqs={ACCESSORY_FAQS} />
        <RelatedGuides
          slugs={[
            'why-wear-a-rudraksha-bracelet',
            'benefits-of-wearing-karungali-mala',
            'how-to-check-original-rudraksha-bracelet',
            'rudraksha-bracelet-for-daily-wear',
          ]}
        />
      </div>
      <ExploreSectionsBlock excludeCategory="Accessories" />
    </div>
  );
};

export default Accessories;
