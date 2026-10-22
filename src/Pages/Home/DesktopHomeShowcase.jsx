import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { apiFetch } from '../../config/api.js';
import { pricingFromProduct } from '../../utils/productPricing';
import { getCardReviewCount } from '../../utils/reviewDisplayCount.js';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../components/Toaster';
import WebsiteCarousel from '../../components/WebsiteCarousel';

function formatInr(value) {
  return `₹${Math.round(Number(value) || 0).toLocaleString('en-IN')}`;
}

function DealCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const toast = useToast();
  const pricing = pricingFromProduct(product);
  const inWishlist = isInWishlist(product.id);
  const reviewCount = getCardReviewCount(product.id);
  const label = product.subcategory || product.category || 'Sacred';

  const onCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const onWish = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const added = toggleWishlist(product);
    toast[added ? 'success' : 'info'](
      added ? `${product.name} added to wishlist!` : `${product.name} removed from wishlist`,
    );
  };

  return (
    <Link to={`/product/${product.slug || product.id}`} className="w-[196px] shrink-0">
      <div className="relative rounded-2xl bg-white p-2 shadow-sm ring-1 ring-orange-100">
        {pricing.discount > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-[#ff914d] px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
            Sale
          </span>
        )}
        <button
          type="button"
          onClick={onWish}
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#e07830]"
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {inWishlist ? <FaHeart className="text-xs" /> : <FaRegHeart className="text-xs" />}
        </button>
        <div className="relative">
          <div className="gg-arch-photo">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-stone-400">No image</div>
            )}
          </div>
          <button
            type="button"
            onClick={onCart}
            className="absolute -bottom-3 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl leading-none text-[#e07830] shadow-md ring-1 ring-orange-100"
            aria-label="Add to cart"
          >
            +
          </button>
        </div>
        <div className="px-1 pb-2 pt-3">
          <p className="text-[11px] font-medium text-stone-500">{label}</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-base font-bold text-stone-900">{formatInr(pricing.currentPrice)}</span>
            {pricing.discount > 0 && (
              <>
                <span className="text-xs text-stone-400 line-through">{formatInr(pricing.originalPrice)}</span>
                <span className="text-xs font-bold text-[#e07830]">{pricing.discount}% OFF</span>
              </>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-snug text-stone-800">{product.name}</p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-stone-600">
            <FaStar className="text-[10px] text-emerald-600" aria-hidden />
            <span className="font-semibold text-stone-700">4.9</span>
            <span>({reviewCount})</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

function PickRow({ product }) {
  const { addToCart } = useCart();
  const toast = useToast();
  const pricing = pricingFromProduct(product);

  return (
    <div className="flex items-center gap-2 border-b border-black/5 py-2 last:border-0">
      <Link to={`/product/${product.slug || product.id}`} className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        ) : null}
      </Link>
      <div className="min-w-0 flex-1">
        <Link to={`/product/${product.slug || product.id}`} className="line-clamp-1 text-sm font-semibold text-stone-800">
          {product.name}
        </Link>
        <p className="text-sm font-bold text-stone-900">
          {formatInr(pricing.currentPrice)}
          {pricing.discount > 0 && (
            <span className="ml-1 text-xs font-medium text-stone-400 line-through">{formatInr(pricing.originalPrice)}</span>
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          addToCart(product, 1);
          toast.success(`${product.name} added to cart!`);
        }}
        className="shrink-0 rounded-full border border-[#c2410c] px-3 py-1 text-xs font-bold text-[#c2410c]"
      >
        Add
      </button>
    </div>
  );
}

const PRICE_CHIPS = [
  { id: '499', label: 'Under ₹499', max: 499 },
  { id: '999', label: 'Under ₹999', max: 999 },
  { id: '1999', label: 'Under ₹1,999', max: 1999 },
];

const OFFER_KEY = 'gg-offer-end-4d';
const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;

function readOfferEnd() {
  const next = Date.now() + FOUR_DAYS_MS;
  try {
    const saved = Number(localStorage.getItem(OFFER_KEY));
    if (saved > Date.now()) return saved;
    localStorage.setItem(OFFER_KEY, String(next));
  } catch (_error) {
    return next;
  }
  return next;
}

function padTime(value) {
  return String(value).padStart(2, '0');
}

function OfferTimer() {
  const [end] = useState(readOfferEnd);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remain = Math.max(0, end - now);
  const days = Math.ceil(remain / 86400000);
  const hours = Math.floor((remain % 86400000) / 3600000);
  const minutes = Math.floor((remain % 3600000) / 60000);
  const seconds = Math.floor((remain % 60000) / 1000);

  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white px-2.5 py-2 shadow-sm ring-1 ring-orange-100" aria-label="Offer ends in 4 days">
      <span className="flex h-14 min-w-14 flex-col items-center justify-center rounded-xl bg-linear-to-b from-[#7f1d2e] to-[#ff7a2f] px-2 text-white shadow-sm">
        <span className="font-heading text-2xl font-bold leading-none">{padTime(days)}</span>
        <span className="text-[9px] font-bold uppercase tracking-wider">days</span>
      </span>
      <span className="pr-1 font-heading text-xl font-bold tabular-nums tracking-wide text-[#7f1d2e]">
        {padTime(hours)}:{padTime(minutes)}:{padTime(seconds)}
      </span>
    </div>
  );
}

async function loadProducts(query) {
  const response = await apiFetch(query);
  if (!response.ok) return [];
  const result = await response.json();
  return result?.success && Array.isArray(result.data) ? result.data : [];
}

const DesktopHomeShowcase = () => {
  const scroller = useRef(null);
  const [deals, setDeals] = useState([]);
  const [rudraksha, setRudraksha] = useState([]);
  const [sprays, setSprays] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [priceMax, setPriceMax] = useState(1999);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [featured, beads, mist, extras] = await Promise.all([
          loadProducts('/api/products?featured=true&limit=12'),
          loadProducts('/api/products?category=Rudraksha'),
          loadProducts('/api/products?category=Sprays'),
          loadProducts('/api/products?category=Accessories'),
        ]);
        if (cancelled) return;
        const featuredOnly = featured.filter((item) => item?.is_featured === true);
        setDeals((featuredOnly.length ? featuredOnly : featured).slice(0, 10));
        setRudraksha(beads.slice(0, 4));
        setSprays(mist.slice(0, 4));
        setAccessories(extras);
      } catch (_error) {
        if (!cancelled) {
          setDeals([]);
          setRudraksha([]);
          setSprays([]);
          setAccessories([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const accessoryRows = accessories
    .filter((product) => pricingFromProduct(product).currentPrice <= priceMax)
    .slice(0, 4);

  return (
    <div className="hidden bg-[#FFFAEB] md:block">
      <section className="gg-hero-stage" aria-label="Diwali banner">
        <div className="mx-auto max-w-6xl">
          <div className="gg-hero-banner overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_50px_-28px_rgba(80,10,20,0.65)]">
            <WebsiteCarousel forcedDevice="desktop" />
          </div>
          <div className="relative z-10 -mt-5 flex justify-center">
            <Link
              to="/rudraksha"
              className="inline-flex items-center gap-2 rounded-full bg-[#FFE7C2] px-5 py-2.5 text-sm font-bold text-[#7f1d2e] shadow-md"
            >
              Explore Diwali offers
              <FaChevronRight className="text-xs" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
      <div className="gg-hero-scallop" aria-hidden />
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-6" aria-labelledby="deals-live-heading">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-44">
            <h2 id="deals-live-heading" className="flex items-center gap-2 font-heading text-xl font-bold text-stone-900">
              <span className="h-2.5 w-2.5 rounded-full bg-[#c2410c]" aria-hidden />
              Deals live now
            </h2>
            <Link to="/rudraksha" className="mt-1 inline-block text-sm font-semibold text-[#c2410c]">
              Explore all
            </Link>
            <p className="mt-1 text-sm font-semibold text-stone-700">₹1,000 cashback · first 100 users</p>
          </div>
          <nav className="flex items-center gap-1 rounded-full bg-white px-2 py-1.5 shadow-[0_10px_30px_-18px_rgba(120,50,10,0.45)] ring-1 ring-orange-100" aria-label="Primary">
            <Link to="/" className="rounded-full bg-[#ff914d] px-4 py-2 text-sm font-semibold text-white">Home</Link>
            <Link to="/accessories" className="rounded-full px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-orange-50">Categories</Link>
            <a href="#site-search" className="rounded-full px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-orange-50">Search</a>
            <Link to="/rudraksha" className="rounded-full px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-orange-50">Rudraksha</Link>
            <Link to="/sprays" className="rounded-full px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-orange-50">Sprays</Link>
          </nav>
          <OfferTimer />
        </div>
        <div className="relative mt-5">
          <button
            type="button"
            className="absolute -left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#c2410c] shadow-md ring-1 ring-orange-100"
            aria-label="Previous deals"
            onClick={() => scroller.current?.scrollBy({ left: -420, behavior: 'smooth' })}
          >
            <FaChevronLeft />
          </button>
          <div ref={scroller} className="gg-deals-scroll flex gap-4 overflow-x-auto px-6 pb-2">
            {deals.map((product) => (
              <DealCard key={product.id} product={product} />
            ))}
          </div>
          <button
            type="button"
            className="absolute -right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#c2410c] shadow-md ring-1 ring-orange-100"
            aria-label="Next deals"
            onClick={() => scroller.current?.scrollBy({ left: 420, behavior: 'smooth' })}
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="mt-6 flex justify-center">
          <Link to="/rudraksha" className="rounded-full bg-[#FFE7C2] px-6 py-2.5 text-sm font-bold text-[#c2410c]">
            See all Rudraksha
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-4" aria-labelledby="gg-picks-heading">
        <div className="mb-6 text-center">
          <h2 id="gg-picks-heading" className="font-heading text-3xl font-bold text-[#c2410c]">
            Gawri Ganga picks
          </h2>
          <p className="mx-auto mt-1 w-fit border-b-2 border-[#ff914d] pb-1 text-sm text-stone-600">
            Rudraksha, malas, and sprays in one place
          </p>
        </div>
        <div className="grid items-start gap-4 lg:grid-cols-4">
          <article className="overflow-hidden rounded-[1.6rem] bg-[#e07830] px-4 pb-5 pt-6 text-white">
            <p className="text-center text-xs font-bold tracking-[0.2em]">DIWALI</p>
            <p className="mt-2 text-center font-heading text-3xl font-bold leading-none">₹1,000</p>
            <p className="mt-1 text-center text-sm font-semibold">wallet cashback</p>
            <p className="mt-1 text-center text-xs text-amber-100">First 100 users</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                ['Rudraksha', '/rudraksha'],
                ['Tulsi mala', '/tulsimala'],
                ['Sprays', '/sprays'],
                ['Accessories', '/accessories'],
              ].map(([label, to]) => (
                <Link key={to} to={to} className="rounded-xl bg-[#FFE7C2] px-2 py-3 text-center text-sm font-bold text-[#c2410c]">
                  {label}
                </Link>
              ))}
            </div>
            <Link to="/rudraksha" className="mt-4 block text-center text-sm font-bold text-amber-50">
              Explore offers
            </Link>
          </article>

          <article className="rounded-[1.6rem] bg-[#fff6e4] p-4 ring-1 ring-orange-100">
            <h3 className="font-heading text-lg font-bold text-stone-900">Everyday rudraksha</h3>
            <p className="text-xs text-stone-500">Nepali beads and malas</p>
            <div className="mt-2">
              {rudraksha.map((product) => (
                <PickRow key={product.id} product={product} />
              ))}
            </div>
            <Link to="/rudraksha" className="mt-3 block text-center text-sm font-bold text-[#c2410c]">See all</Link>
          </article>

          <article className="rounded-[1.6rem] bg-[#eef6e8] p-4 ring-1 ring-green-100">
            <h3 className="font-heading text-lg font-bold text-stone-900">Aura sprays</h3>
            <p className="text-xs text-stone-500">Amrat, Maitri, Shuddhi, Chakra</p>
            <div className="mt-2">
              {sprays.map((product) => (
                <PickRow key={product.id} product={product} />
              ))}
            </div>
            <Link to="/sprays" className="mt-3 block text-center text-sm font-bold text-[#c2410c]">See all</Link>
          </article>

          <article className="rounded-[1.6rem] bg-[#fff3d6] p-4 ring-1 ring-amber-100">
            <h3 className="font-heading text-lg font-bold text-stone-900">Lowest prices every day</h3>
            <p className="text-xs text-stone-500">Bracelets, malas, and accessories</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {PRICE_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setPriceMax(chip.max)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    priceMax === chip.max ? 'bg-[#e07830] text-white' : 'bg-white text-stone-700'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <div className="mt-2">
              {accessoryRows.map((product) => (
                <PickRow key={product.id} product={product} />
              ))}
            </div>
            <Link to="/accessories" className="mt-3 block text-center text-sm font-bold text-[#c2410c]">See all</Link>
          </article>
        </div>
      </section>
      <div className="gg-scallop-edge mt-2" aria-hidden />
    </div>
  );
};

export default DesktopHomeShowcase;
