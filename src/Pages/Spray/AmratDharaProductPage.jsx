import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaRegHeart, FaShoppingCart, FaStar, FaPlus, FaMinus, FaTruck, FaShieldAlt, FaLeaf } from 'react-icons/fa';
import { apiFetch } from '../../config/api';
import { pricingFromProduct } from '../../utils/productPricing';
import { getMaxOrderQuantity, isProductPreorder, productCanBePurchased } from '../../utils/productPreorder';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toaster';
import Loader from '../../components/Loader';
import PreorderEmailModal from '../../components/PreorderEmailModal';
import OtherSpraysSection from '../../components/OtherSpraysSection';
import { submitPreorderRequest } from '../../utils/preorderRequest';
import { trackViewContent } from '../../utils/analytics.js';
import amratDharaBg from '../../assets/Sprayelem/Amratdhara/amratdharabg.png';
import bigWave from '../../assets/Sprayelem/Amratdhara/bigwave.png';
import smallWave from '../../assets/Sprayelem/Amratdhara/small wave.png';
import smallWave2 from '../../assets/Sprayelem/Amratdhara/smallwave2.png';

const AmratDharaProductPage = () => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSort, setReviewSort] = useState('recent');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [showPreorderModal, setShowPreorderModal] = useState(false);
  const [preorderEmail, setPreorderEmail] = useState('');
  const [preorderSubmitting, setPreorderSubmitting] = useState(false);

  useEffect(() => {
    const fetchAmratBindu = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await apiFetch('/api/products?category=Sprays&search=Amrat%20Bindu');
        if (!response.ok) throw new Error('Failed to load Amrat Bindu');
        const result = await response.json();
        const list = Array.isArray(result?.data) ? result.data : [];
        const matched =
          list.find((item) => {
            const name = `${item?.name || ''}`.toLowerCase();
            const slug = String(item?.slug || '').toLowerCase();
            return name.includes('amrat bindu') || name.includes('amrat dhara') || slug === 'amrat-bindu-aura-spray';
          }) || list[0] || null;
        if (!matched) {
          setError('Amrat Bindu product not found');
          return;
        }
        setProduct(matched);
        setSelectedImageIndex(0);
      } catch (err) {
        setError('Unable to load Amrat Bindu right now');
      } finally {
        setLoading(false);
      }
    };
    fetchAmratBindu();
  }, []);

  useEffect(() => {
    if (!product?.id) return;
    trackViewContent(product, quantity);
  }, [product?.id]);

  const pricing = useMemo(() => (product ? pricingFromProduct(product) : null), [product]);
  const inWishlist = product ? isInWishlist(product.id) : false;
  const productImages = product?.images?.length ? product.images : ['https://via.placeholder.com/1200x900?text=Amrat+Bindu'];

  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    if (reviewSort === 'highest') return list.sort((a, b) => b.rating - a.rating);
    if (reviewSort === 'lowest') return list.sort((a, b) => a.rating - b.rating);
    return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [reviews, reviewSort]);

  const averageRating = (() => {
    if (!sortedReviews.length) return '0.0';
    const sum = sortedReviews.reduce((acc, r) => {
      const x = Number(r.rating);
      return acc + (Number.isFinite(x) ? x : 0);
    }, 0);
    const avg = sum / sortedReviews.length;
    return Number.isFinite(avg) ? avg.toFixed(1) : '0.0';
  })();
  const formattedBenefits = useMemo(() => {
    const fallback = [
      'Promotes calmness and mental clarity',
      'Supports a harmonious and uplifting atmosphere'
    ];
    const source = `${product?.benefits || ''}`.trim();
    if (!source) return fallback;
    const parts = source
      .split(/[•\n]+/g)
      .map((item) => item.trim().replace(/^[\-*]\s*/, ''))
      .filter(Boolean);
    return parts.length ? parts : fallback;
  }, [product?.benefits]);

  const fetchReviews = async (productId) => {
    if (!productId) return;
    setReviewsLoading(true);
    try {
      const res = await apiFetch(`/api/reviews/product/${productId}`);
      const json = await res.json();
      setReviews(json.success && Array.isArray(json.data) ? json.data : []);
    } catch (_err) {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (!product?.id) return;
    fetchReviews(product.id);
  }, [product?.id]);

  useEffect(() => {
    if (user?.email) {
      setPreorderEmail(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!product) return;
    const max = getMaxOrderQuantity(product);
    setQuantity((q) => Math.min(Math.max(1, q), max));
  }, [product?.id, product?.stock, product?.sale_type]);

  const handleAddToCart = () => {
    if (!product || !productCanBePurchased(product)) return;
    if (isProductPreorder(product)) {
      setShowPreorderModal(true);
      return;
    }
    addToCart(product, quantity);
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} of ${product.name} added to cart!`);
  };

  const handlePreorderSubmit = async (email) => {
    if (!product) return;
    setPreorderSubmitting(true);
    try {
      await submitPreorderRequest({ product, quantity, email });
      setPreorderEmail(email);
      setShowPreorderModal(false);
      toast.success('Preorder request saved. We will notify you by email.');
    } catch (error) {
      toast.error(error?.message || 'Failed to save preorder request');
    } finally {
      setPreorderSubmitting(false);
    }
  };

  const handleWishlist = () => {
    if (!product) return;
    const added = toggleWishlist(product);
    if (added) toast.success(`${product.name} added to wishlist!`);
    else toast.info(`${product.name} removed from wishlist`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!product?.id) return;
    if (!isAuthenticated) {
      toast.info('Please login to submit your review.');
      return;
    }
    if (!reviewName.trim() || !reviewComment.trim() || reviewRating < 1) {
      toast.error('Please add name, rating, and comment.');
      return;
    }
    setReviewSubmitting(true);
    try {
      const res = await apiFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          product_id: product.id,
          reviewer_name: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim()
        })
      });
      const json = await res.json();
      if (json.success) {
        setReviewName('');
        setReviewComment('');
        setReviewRating(0);
        setReviewHover(0);
        await fetchReviews(product.id);
        toast.success(
          json.message || 'Thank you! Your review has been submitted. It will appear publicly after approval.',
        );
      } else {
        toast.error(json.message || 'Failed to submit review.');
      }
    } catch (_err) {
      toast.error('Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !product || !pricing) {
    return (
      <section className="mx-auto max-w-[1920px] px-4 py-16 text-center sm:px-6 lg:px-10 xl:px-14">
        <h1 className="text-2xl font-bold text-[#1a6ba0]">Amrat Bindu</h1>
        <p className="mt-3 text-gray-600">{error || 'Product not available'}</p>
        <Link to="/sprays" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1a6ba0] px-5 py-2.5 text-sm font-semibold text-white">
          <FaArrowLeft />
          Back to Sprays
        </Link>
      </section>
    );
  }

  const isPreorder = isProductPreorder(product);
  const canPurchase = productCanBePurchased(product);
  const maxOrderQty = getMaxOrderQuantity(product);

  return (
    <section className="relative pb-[calc(4.5rem+var(--gg-tabbar-offset))] md:overflow-hidden md:pb-0">
      <img src={amratDharaBg} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-white/35" />
      <div className="pointer-events-none absolute inset-0 z-0">
        <img src={bigWave} alt="" className="absolute -right-24 top-8 hidden w-[520px] -rotate-90 opacity-55 drop-shadow-[0_10px_18px_rgba(11,96,154,0.35)] lg:block" />
        <img src={smallWave2} alt="" className="absolute -left-20 top-4 hidden w-[300px] -scale-x-100 opacity-55 drop-shadow-[0_10px_18px_rgba(11,96,154,0.3)] lg:block" />
        <img src={smallWave} alt="" className="absolute -left-10 top-56 hidden w-48 opacity-60 drop-shadow-[0_8px_14px_rgba(11,96,154,0.3)] lg:block" />
        <img src={smallWave2} alt="" className="absolute -left-8 top-[34%] hidden w-40 -scale-x-100 opacity-55 drop-shadow-[0_8px_14px_rgba(11,96,154,0.28)] lg:block" />
        <img src={smallWave} alt="" className="absolute -left-14 bottom-28 hidden w-44 opacity-40 drop-shadow-[0_8px_14px_rgba(11,96,154,0.25)] lg:block" />
        <img src={smallWave2} alt="" className="absolute right-6 top-[44%] hidden w-44 opacity-55 drop-shadow-[0_8px_14px_rgba(11,96,154,0.3)] lg:block" />
        <img src={smallWave} alt="" className="absolute -right-8 bottom-24 hidden w-44 rotate-180 opacity-45 drop-shadow-[0_8px_14px_rgba(11,96,154,0.28)] lg:block" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-4 py-6 sm:px-6 lg:px-10 xl:px-14">
        <Link to="/sprays" className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1a6ba0]/35 bg-white px-4 py-2 text-sm font-semibold text-[#1a6ba0]">
          <FaArrowLeft />
          Back to Sprays
        </Link>

        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-3 xl:grid-cols-[minmax(0,820px)_minmax(0,420px)] xl:items-start xl:justify-center xl:gap-3">
          <div className="min-w-0 space-y-6">
            <div className="mx-auto w-fit overflow-hidden rounded-3xl border border-[#1a6ba0]/15 bg-white/95 p-4">
                <div className="relative overflow-hidden rounded-2xl">
                  <img src={smallWave} alt="" className="pointer-events-none absolute -left-8 top-10 hidden w-20 opacity-45 md:block" />
                  <img src={smallWave2} alt="" className="pointer-events-none absolute -left-6 bottom-10 hidden w-16 -scale-x-100 opacity-40 md:block" />
                  <img
                    src={productImages[selectedImageIndex]}
                    alt={product.name}
                    className="mx-auto block w-full max-w-[760px] h-auto object-contain"
                  />
                </div>
            </div>
          </div>

          <aside className="min-w-0">
            <div className="sticky top-24 rounded-3xl border border-[#1a6ba0]/20 bg-white/97 p-5 shadow-[0_12px_30px_rgba(26,107,160,0.14)]">
              <p className="text-xs uppercase tracking-[0.18em] text-[#2f81b5]">Aura Spray</p>
              <h1 className="mt-1 text-3xl font-bold text-[#1a6ba0]">{product.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#eefafd] px-3 py-1 text-xs font-semibold text-[#1a6ba0]">{product.category || 'Sprays'}</span>
                {product.subcategory ? <span className="rounded-full bg-[#eefafd] px-3 py-1 text-xs font-semibold text-[#1a6ba0]">{product.subcategory}</span> : null}
                {product.rarity ? <span className="rounded-full bg-[#fff2f8] px-3 py-1 text-xs font-semibold text-[#a15580]">{product.rarity}</span> : null}
              </div>

              <div className="mt-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => <FaStar key={i} className="text-[#2283c7]" />)}
                <span className="ml-1 text-sm text-gray-500">{averageRating} ({sortedReviews.length})</span>
              </div>

              <p className="mt-4 wrap-break-word text-sm leading-relaxed text-[#3d687f]">
                {product.short_description || product.shortDescription || 'Lavender aura spray for calm, emotional balance, and elevated space energy.'}
              </p>

              <div className="mt-4 border-t border-[#d7edf7] pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#1a6ba0]">₹{pricing.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  {pricing.discount > 0 ? <span className="text-sm text-gray-400 line-through">₹{pricing.originalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span> : null}
                </div>
                {!isPreorder ? (
                  product.stock > 0 ? (
                    <p className="text-sm font-semibold text-[#1a6ba0]">In Stock</p>
                  ) : (
                    <p className="text-sm font-semibold text-red-600">Out of Stock</p>
                  )
                ) : null}
              </div>

              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-[#1a6ba0]">Quantity</p>
                <div className="inline-flex items-center rounded-xl border border-[#1a6ba0]/30">
                  <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="h-10 w-10 text-[#1a6ba0]"><FaMinus className="mx-auto text-xs" /></button>
                  <span className="min-w-12 text-center font-semibold text-[#1a6ba0]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxOrderQty, q + 1))}
                    disabled={!canPurchase || quantity >= maxOrderQty}
                    className="h-10 w-10 text-[#1a6ba0] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FaPlus className="mx-auto text-xs" />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 max-md:fixed max-md:inset-x-3 max-md:bottom-[var(--gg-tabbar-offset)] max-md:z-130 max-md:mt-0 max-md:rounded-2xl max-md:border max-md:border-stone-200 max-md:bg-white/95 max-md:p-1.5 max-md:shadow-lg max-md:backdrop-blur sm:gap-3">
                <button type="button" onClick={handleWishlist} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1a6ba0]/35 text-[#1a6ba0]">
                  {inWishlist ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canPurchase}
                  className="inline-flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#1a6ba0] px-4 py-2 text-xs font-semibold text-white max-md:h-9 max-md:rounded-full md:px-5 md:py-3 md:text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaShoppingCart />
                  {isPreorder ? 'Preorder' : canPurchase ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-3xl border border-[#1a6ba0]/20 bg-white/97 p-4 shadow-[0_12px_30px_rgba(26,107,160,0.14)]">
                <div className="mb-2 flex items-center gap-2 text-[#1a6ba0]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f6fd]">
                    <FaLeaf />
                  </span>
                  <h3 className="text-sm font-bold">Ingredients</h3>
                </div>
                <ul className="list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-[#245472]">
                  <li>Ancient Ayurvedic wellness base formula</li>
                  <li>Camphor</li>
                  <li>Sat Giloi / Sat Ajwain blend</li>
                  <li>Peppermint</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-[#1a6ba0]/20 bg-white/97 p-4 shadow-[0_12px_30px_rgba(26,107,160,0.14)]">
                <div className="mb-2 flex items-center gap-2 text-[#1a6ba0]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f6fd]">
                    <FaLeaf />
                  </span>
                  <h3 className="text-sm font-bold">Essence</h3>
                </div>
                <p className="rounded-lg bg-[#e8f6fd] px-3 py-2 text-[15px] font-semibold text-[#1a6ba0]">
                  Lavender
                </p>
              </div>
              {/* <div className="rounded-3xl border border-[#1a6ba0]/20 bg-white/97 p-4 shadow-[0_12px_30px_rgba(26,107,160,0.14)]">
                <div className="mb-2 flex items-center gap-2 text-[#1a6ba0]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f6fd]">
                    <FaTruck />
                  </span>
                  <h3 className="text-sm font-bold">Delivery</h3>
                </div>
                <p className="wrap-break-word text-sm leading-relaxed text-[#3d687f]">
                  Fast dispatch with secure packaging to maintain fragrance quality.
                </p>
              </div> */}
              {/* <div className="rounded-3xl border border-[#1a6ba0]/20 bg-white/97 p-4 shadow-[0_12px_30px_rgba(26,107,160,0.14)]">
                <div className="mb-2 flex items-center gap-2 text-[#1a6ba0]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f6fd]">
                    <FaShieldAlt />
                  </span>
                  <h3 className="text-sm font-bold">Quality Promise</h3>
                </div>
                <p className="wrap-break-word text-sm leading-relaxed text-[#3d687f]">
                  Carefully curated aroma profile designed for daily mindful use.
                </p>
              </div> */}
            </div>
          </aside>
        </div>

        <div className="relative mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#1a6ba0]/20 bg-white/95 p-6 shadow-[0_10px_24px_rgba(26,107,160,0.1)]">
            <div className="mb-4 border-b border-[#d8edf7] pb-3">
              <h3 className="text-2xl font-bold text-[#1a6ba0]">Product Information</h3>
              <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[#5e889f]">Details and Specifications</p>
            </div>

            <div className="rounded-xl bg-[#f3fbfe] p-4">
              <p className="mb-1 text-sm font-semibold uppercase tracking-[0.12em] text-[#5e889f]">Description</p>
              <p className="wrap-break-word text-base leading-relaxed text-[#3d687f]">
                {product.description || product.short_description || 'A soothing lavender aura spray designed to create emotional ease and cleaner space energy.'}
              </p>
            </div>
          </div>

          <div className="relative rounded-3xl border border-[#1a6ba0]/20 bg-white/95 p-6 shadow-[0_10px_24px_rgba(26,107,160,0.1)]">
            <div className="mb-4 border-b border-[#d8edf7] pb-3">
              <h3 className="text-2xl font-bold text-[#1a6ba0]">How to Use</h3>
              <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[#5e889f]">Simple Ritual Steps</p>
            </div>

            <ol className="space-y-3 wrap-break-word text-base text-[#3d687f]">
              <li className="rounded-xl bg-[#f3fbfe] p-3"><span className="font-semibold text-[#1a6ba0]">Step 1:</span> Spray 2-3 pumps in room, aura field, or meditation space.</li>
              <li className="rounded-xl bg-[#f3fbfe] p-3"><span className="font-semibold text-[#1a6ba0]">Step 2:</span> Take a deep breath and set your intention.</li>
              <li className="rounded-xl bg-[#f3fbfe] p-3"><span className="font-semibold text-[#1a6ba0]">Step 3:</span> Reuse before yoga, prayer, journaling, or sleep.</li>
            </ol>

            <div className="mt-5 rounded-xl bg-[#f8fdff] p-4">
              <h4 className="text-lg font-bold text-[#1a6ba0]">Why Amrat Bindu</h4>
              <p className="mt-2 wrap-break-word text-base leading-relaxed text-[#3d687f]">
                The lavender profile helps calm the mind while uplifting the space, making it ideal for rituals and daily mindfulness.
              </p>
            </div>
          </div>
        </div>

        <section className="relative mt-6 rounded-3xl border border-[#1a6ba0]/20 bg-white/97 p-6 shadow-[0_10px_24px_rgba(26,107,160,0.1)]">
          <div className="mb-5 border-b border-[#d8edf7] pb-3">
            <h3 className="text-2xl font-bold text-[#1a6ba0]">Amrat Bindu Wellness Guide</h3>
            <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[#5e889f]">Traditional Everyday Support</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <article className="rounded-xl bg-[#f3fbfe] p-4">
              <h4 className="text-base font-bold text-[#1a6ba0]">Essence</h4>
              <p className="mt-2 text-[15px] leading-relaxed text-[#245472]">
                Lavender essence with a refreshing and balancing aroma profile.
              </p>
            </article>

            <article className="rounded-xl bg-[#f3fbfe] p-4">
              <h4 className="text-base font-bold text-[#1a6ba0]">Purpose</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-[#245472]">
                <li>General wellness and daily freshness support</li>
                <li>Supportive use during seasonal viral discomfort</li>
                <li>Helpful for cold and mild fever-time care routines</li>
              </ul>
            </article>

            <article className="rounded-xl bg-[#f8fdff] p-4">
              <h4 className="text-base font-bold text-[#1a6ba0]">Can Be Used As</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-[#245472]">
                <li>Spray on clothes</li>
                <li>Spray on handkerchief during cold discomfort</li>
                <li>Spray in room for a fresh environment</li>
                <li>Spray on mask</li>
                <li>Mix half a spoon with massage oil and apply on body</li>
              </ul>
            </article>

            <article className="rounded-xl bg-[#f8fdff] p-4">
              <h4 className="text-base font-bold text-[#1a6ba0]">Best Time to Use</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-[#245472]">
                <li>As part of general daily use</li>
                <li>During cold and fever related discomfort phases</li>
              </ul>
            </article>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <article className="rounded-xl bg-[#f8fdff] p-4">
              <h4 className="text-base font-bold text-[#1a6ba0]">Benefits</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-[#245472]">
                {formattedBenefits.map((benefit, idx) => (
                  <li key={`${benefit}-${idx}`}>{benefit}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
              <h4 className="text-base font-bold text-amber-900">Precautions</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-amber-900/90">
                <li>Use carefully for children and in small quantity</li>
                <li>When applying on body, dilute properly with massage oil</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="relative mt-6 rounded-3xl border border-[#1a6ba0]/20 bg-white/97 p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#1a6ba0]">Customer Reviews</h3>
              <p className="text-sm text-[#3d687f]">{averageRating} average rating from {sortedReviews.length} review{sortedReviews.length === 1 ? '' : 's'}</p>
            </div>
            <select value={reviewSort} onChange={(e) => setReviewSort(e.target.value)} className="rounded-lg border border-[#1a6ba0]/25 bg-white px-3 py-2 text-sm text-[#1a6ba0] outline-none">
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          <form onSubmit={handleSubmitReview} className="mb-6 rounded-2xl border border-[#1a6ba0]/15 bg-[#f7fcff] p-4">
            <p className="mb-3 text-sm font-semibold text-[#1a6ba0]">Write a review</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Your Name" className="rounded-lg border border-[#1a6ba0]/20 bg-white px-3 py-2 text-sm outline-none" />
              <div className="flex items-center gap-1 rounded-lg border border-[#1a6ba0]/20 bg-white px-3 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewRating(star)} onMouseEnter={() => setReviewHover(star)} onMouseLeave={() => setReviewHover(0)}>
                    <FaStar className={(reviewHover || reviewRating) >= star ? 'text-[#2283c7]' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={4}
              placeholder="Share your experience with Amrat Bindu..."
              className="mt-3 w-full rounded-lg border border-[#1a6ba0]/20 bg-white px-3 py-2 text-sm outline-none"
            />
            <button type="submit" disabled={reviewSubmitting} className="mt-3 rounded-lg bg-[#1a6ba0] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>

          {reviewsLoading ? (
            <div className="flex justify-center py-4"><Loader /></div>
          ) : sortedReviews.length === 0 ? (
            <p className="text-sm text-[#3d687f]">No reviews yet. Be the first to review this spray.</p>
          ) : (
            <div className="space-y-3">
              {sortedReviews.map((r) => (
                <article key={r.id} className="rounded-xl border border-[#1a6ba0]/12 bg-white p-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1a6ba0]">{r.reviewer_name || 'Customer'}</p>
                      {!r.verified ? (
                        <p className="text-xs font-medium text-amber-800">Pending approval</p>
                      ) : null}
                    </div>
                    <p className="text-xs text-gray-500 shrink-0">{r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN') : ''}</p>
                  </div>
                  <div className="mb-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} className={Number(r.rating) >= star ? 'text-[#2283c7]' : 'text-gray-300'} />
                    ))}
                  </div>
                  <p className="wrap-break-word text-sm leading-relaxed text-[#3d687f]">{r.comment}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <OtherSpraysSection excludeProductId={product?.id} />

        <PreorderEmailModal
          isOpen={showPreorderModal}
          onClose={() => setShowPreorderModal(false)}
          onSubmit={handlePreorderSubmit}
          loading={preorderSubmitting}
          defaultEmail={preorderEmail}
          productName={product?.name}
        />
      </div>
    </section>
  );
};

export default AmratDharaProductPage;
