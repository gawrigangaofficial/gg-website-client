import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaRegHeart, FaShoppingCart, FaStar, FaPlus, FaMinus, FaLeaf } from 'react-icons/fa';
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
import maitriBg from '../../assets/Sprayelem/Maitri/maitribg.png';
import clipGroup from '../../assets/Sprayelem/Maitri/Clip path group.png';
import clipGroup2 from '../../assets/Sprayelem/Maitri/Clip path group (2).png';
import groupImg from '../../assets/Sprayelem/Maitri/Group.png';
import usageCloths from '../../assets/Sprayelem/Maitri/Usage/M-Cloths.webp';
import usageHankey from '../../assets/Sprayelem/Maitri/Usage/M-Hankey.webp';
import usageMask from '../../assets/Sprayelem/Maitri/Usage/M-Mask.webp';
import usageRoom from '../../assets/Sprayelem/Maitri/Usage/M-Room.webp';

const MaitriProductPage = () => {
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
  const [isProductInfoExpanded, setIsProductInfoExpanded] = useState(false);

  useEffect(() => {
    const fetchMaitri = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('/api/products?category=Sprays&search=Maitri');
        if (!response.ok) throw new Error('Failed to load Maitri');
        const result = await response.json();
        const list = Array.isArray(result?.data) ? result.data : [];
        const matched = list.find((item) => `${item?.name || ''}`.toLowerCase().includes('maitri')) || list[0] || null;
        if (!matched) {
          setError('Maitri product not found');
          return;
        }
        setProduct(matched);
      } catch (_err) {
        setError('Unable to load Maitri right now');
      } finally {
        setLoading(false);
      }
    };
    fetchMaitri();
  }, []);

  useEffect(() => {
    if (!product?.id) return;
    trackViewContent(product, quantity);
  }, [product?.id]);

  const pricing = useMemo(() => (product ? pricingFromProduct(product) : null), [product]);
  const inWishlist = product ? isInWishlist(product.id) : false;
  const productImages = product?.images?.length ? product.images : ['https://via.placeholder.com/1200x900?text=Maitri'];

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
      'Supports harmony between loving partners and close friendships',
      'Encourages calmer communication during conflicts',
      'Helps maintain a positive tone before personal and business meetings'
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
    if (product?.id) fetchReviews(product.id);
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
    if (!isAuthenticated) return toast.info('Please login to submit your review.');
    if (!reviewName.trim() || !reviewComment.trim() || reviewRating < 1) return toast.error('Please add name, rating, and comment.');
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
        <p className="text-2xl font-bold text-[#c9689a]">Maitri aura spray</p>
        <p className="mt-3 text-gray-600">{error || 'Product not available'}</p>
        <Link to="/sprays" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E27BB1] px-5 py-2.5 text-sm font-semibold text-white">
          <FaArrowLeft />
          Back to Sprays
        </Link>
      </section>
    );
  }

  const isPreorder = isProductPreorder(product);
  const canPurchase = productCanBePurchased(product);
  const maxOrderQty = getMaxOrderQuantity(product);
  const productDescription = product.description || product.short_description || 'A comforting aura spray designed for emotional connection and serene ambience.';
  const mobileProductDescription = isProductInfoExpanded || productDescription.length <= 140
    ? productDescription
    : `${productDescription.slice(0, 140).trim()}...`;

  return (
    <section className="relative pb-[calc(4.5rem+var(--gg-tabbar-offset))] md:overflow-hidden md:pb-0">
      <img src={maitriBg} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-white/40" />
      <div className="pointer-events-none absolute inset-0 z-0">
        <img src={clipGroup} alt="" className="absolute left-0 top-8 hidden w-[360px] opacity-55 lg:block" />
        <img src={clipGroup2} alt="" className="absolute right-0 top-16 hidden w-[250px] opacity-45 lg:block" />
        <img src={groupImg} alt="" className="absolute left-0 top-[48%] hidden w-[160px] opacity-50 lg:block" />
        <img src={clipGroup2} alt="" className="absolute right-4 bottom-20 hidden w-[180px] opacity-40 lg:block" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-4 py-6 sm:px-6 lg:px-10 xl:px-14">
        <Link to="/sprays" className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c9689a]/35 bg-white px-4 py-2 text-sm font-semibold text-[#c9689a]">
          <FaArrowLeft />
          Back to Sprays
        </Link>

        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-3 xl:grid-cols-[minmax(0,820px)_minmax(0,420px)] xl:items-start xl:justify-center xl:gap-3">
          <div className="min-w-0 space-y-6">
            <div className="mx-auto w-fit overflow-hidden rounded-3xl border border-[#e8bfd5] bg-white/95 p-4">
              <div className="relative overflow-hidden rounded-2xl">
                <img src={groupImg} alt="" className="pointer-events-none absolute -left-4 top-12 hidden w-16 opacity-45 md:block" />
                <img src={clipGroup2} alt="" className="pointer-events-none absolute -right-5 top-1/2 hidden w-20 -translate-y-1/2 opacity-45 md:block" />
                <img src={productImages[selectedImageIndex]} alt={product.name} className="mx-auto block h-auto w-full max-w-[760px] object-contain" />
              </div>
            </div>
          </div>

          <aside className="min-w-0">
            <div className="sticky top-24 rounded-3xl border border-[#e8bfd5] bg-white/97 p-5 shadow-[0_12px_30px_rgba(201,104,154,0.18)]">
              <p className="text-xs uppercase tracking-[0.18em] text-[#c9689a]">Aura Spray</p>
              <h1 className="mt-1 text-3xl font-bold text-[#c9689a]">{product.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#fff1f8] px-3 py-1 text-xs font-semibold text-[#c9689a]">{product.category || 'Sprays'}</span>
                {product.subcategory ? <span className="rounded-full bg-[#fff1f8] px-3 py-1 text-xs font-semibold text-[#c9689a]">{product.subcategory}</span> : null}
              </div>

              <div className="mt-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => <FaStar key={i} className="text-[#E27BB1]" />)}
                <span className="ml-1 text-sm text-gray-500">{averageRating} ({sortedReviews.length})</span>
              </div>

              <p className="mt-4 wrap-break-word text-sm leading-relaxed text-[#704d61]">
                {product.short_description || product.shortDescription || 'Maitri aura spray for emotional warmth and balanced surroundings.'}
              </p>

              <div className="mt-4 border-t border-[#f2ddeb] pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#c9689a]">₹{pricing.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  {pricing.discount > 0 ? <span className="text-sm text-gray-400 line-through">₹{pricing.originalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span> : null}
                </div>
                {product.stock > 0 ? (
                  <p className="text-sm font-semibold text-[#c9689a]">In Stock</p>
                ) : (
                  <p className="text-sm font-semibold text-red-600">Out of Stock</p>
                )}
              </div>

              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-[#c9689a]">Quantity</p>
                <div className="inline-flex items-center rounded-xl border border-[#e8bfd5]">
                  <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="h-10 w-10 text-[#c9689a]"><FaMinus className="mx-auto text-xs" /></button>
                  <span className="min-w-12 text-center font-semibold text-[#c9689a]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxOrderQty, q + 1))}
                    disabled={!canPurchase || quantity >= maxOrderQty}
                    className="h-10 w-10 text-[#c9689a] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FaPlus className="mx-auto text-xs" />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 max-md:fixed max-md:inset-x-3 max-md:bottom-[var(--gg-tabbar-offset)] max-md:z-130 max-md:mt-0 max-md:rounded-2xl max-md:border max-md:border-stone-200 max-md:bg-white/95 max-md:p-1.5 max-md:shadow-lg max-md:backdrop-blur sm:gap-3">
                <button type="button" onClick={handleWishlist} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e8bfd5] text-[#c9689a]">
                  {inWishlist ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canPurchase}
                  className="inline-flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#E27BB1] px-4 py-2 text-xs font-semibold text-white max-md:h-9 max-md:rounded-full md:px-5 md:py-3 md:text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaShoppingCart />
                  {isPreorder ? 'Preorder' : canPurchase ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-3xl border border-[#e8bfd5] bg-white/97 p-4 shadow-[0_12px_30px_rgba(201,104,154,0.16)]">
                <div className="mb-2 flex items-center gap-2 text-[#c9689a]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fff1f8]">
                    <FaLeaf />
                  </span>
                  <h3 className="text-sm font-bold">Ingredients</h3>
                </div>
                <ul className="list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-[#6b3f56]">
                  <li>Ancient Ayurvedic wellness base formula</li>
                  <li>Mogra</li>
                  <li>Gulab</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-[#e8bfd5] bg-white/97 p-4 shadow-[0_12px_30px_rgba(201,104,154,0.16)]">
                <div className="mb-2 flex items-center gap-2 text-[#c9689a]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fff1f8]">
                    <FaLeaf />
                  </span>
                  <h3 className="text-sm font-bold">Essence</h3>
                </div>
                <p className="rounded-lg bg-[#fff1f8] px-3 py-2 text-[15px] font-semibold text-[#c9689a]">
                  Lavender
                </p>
              </div>
            </div>
          </aside>
        </div>
        <section className="relative mx-auto mt-6 max-w-[1500px] rounded-3xl border border-[#e8bfd5] bg-white/97 p-4 shadow-[0_10px_24px_rgba(201,104,154,0.12)] sm:p-6">
          <div className="mb-4 border-b border-[#f2ddeb] pb-3">
            <h3 className="text-2xl font-bold text-[#c9689a]">Can Be Used As</h3>
            <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[#9a6c84]">Usage Examples</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { title: 'On Cloth', image: usageCloths },
              { title: 'On Hankey', image: usageHankey },
              { title: 'In Room', image: usageRoom },
              { title: 'On Mask', image: usageMask }
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-[#e8bfd5] bg-white p-2 sm:p-2.5">
                <img
                  src={item.image}
                  alt={`${item.title} usage`}
                  className="aspect-square w-full rounded-xl object-contain"
                />
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto mt-6 grid max-w-[1500px] grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#e8bfd5] bg-white/95 p-6 shadow-[0_10px_24px_rgba(201,104,154,0.12)]">
            <div className="mb-4 border-b border-[#f2ddeb] pb-3">
              <h3 className="text-2xl font-bold text-[#c9689a]">Product Information</h3>
              <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[#9a6c84]">Details and Specifications</p>
            </div>
            <div className="rounded-xl bg-[#fff5fa] p-4">
              <p className="mb-1 text-sm font-semibold uppercase tracking-[0.12em] text-[#9a6c84]">Description</p>
              <p className="hidden wrap-break-word text-base leading-relaxed text-[#704d61] md:block">{productDescription}</p>
              <p className="wrap-break-word text-base leading-relaxed text-[#704d61] md:hidden">{mobileProductDescription}</p>
              {productDescription.length > 140 ? (
                <button
                  type="button"
                  onClick={() => setIsProductInfoExpanded((value) => !value)}
                  className="mt-3 block w-full text-center text-xs font-medium tracking-wide text-[#c9689a] md:hidden"
                >
                  Read more
                </button>
              ) : null}
            </div>
          </div>
          <div className="rounded-3xl border border-[#e8bfd5] bg-white/95 p-6 shadow-[0_10px_24px_rgba(201,104,154,0.12)]">
            <div className="mb-4 border-b border-[#f2ddeb] pb-3">
              <h3 className="text-2xl font-bold text-[#c9689a]">How to Use</h3>
              <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[#9a6c84]">Simple Ritual Steps</p>
            </div>
            <ol className="space-y-3 wrap-break-word text-base text-[#704d61]">
              <li className="rounded-xl bg-[#fff5fa] p-3"><span className="font-semibold text-[#c9689a]">Step 1:</span> Spray 2-3 pumps in room, aura, or meditation space.</li>
              <li className="rounded-xl bg-[#fff5fa] p-3"><span className="font-semibold text-[#c9689a]">Step 2:</span> Inhale deeply and set a positive intention.</li>
              <li className="rounded-xl bg-[#fff5fa] p-3"><span className="font-semibold text-[#c9689a]">Step 3:</span> Reuse before prayer, journaling, yoga, or sleep.</li>
            </ol>
          </div>
        </div>

        <section className="relative mx-auto mt-6 max-w-[1500px] rounded-3xl border border-[#e8bfd5] bg-white/97 p-6 shadow-[0_10px_24px_rgba(201,104,154,0.12)]">
          <div className="mb-5 border-b border-[#f2ddeb] pb-3">
            <h3 className="text-2xl font-bold text-[#c9689a]">Maitri Wellness Guide</h3>
            <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[#9a6c84]">Relationship Harmony and Emotional Warmth</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <article className="rounded-xl bg-[#fff5fa] p-4">
              <h4 className="text-base font-bold text-[#c9689a]">Purpose</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-[#6b3f56]">
                <li>Supports loving relationships between partners</li>
                <li>Helps maintain warmth in friendships</li>
                <li>Suitable for husband-wife harmony rituals</li>
                <li>Supports smoother relationships between business partners</li>
              </ul>
            </article>

            <article className="rounded-xl bg-[#fff7fb] p-4">
              <h4 className="text-base font-bold text-[#c9689a]">Best Time to Use</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-[#6b3f56]">
                <li>Before meeting your loving partner</li>
                <li>When you and your friend/partner are in conflict</li>
                <li>Before a business meeting</li>
                <li>After returning from a negative environment to avoid carrying that energy home</li>
              </ul>
            </article>

            <article className="rounded-xl bg-[#fff7fb] p-4">
              <h4 className="text-base font-bold text-[#c9689a]">Benefits</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-[#6b3f56]">
                {formattedBenefits.map((benefit, idx) => (
                  <li key={`${benefit}-${idx}`}>{benefit}</li>
                ))}
              </ul>
            </article>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
              <h4 className="text-base font-bold text-amber-900">Precautions</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-amber-900/90">
                <li>Use carefully for children</li>
                <li>Apply carefully on body</li>
                <li>Do not consume directly</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="relative mx-auto mt-6 max-w-[1500px] rounded-3xl border border-[#e8bfd5] bg-white/97 p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#c9689a]">Customer Reviews</h3>
              <p className="text-sm text-[#704d61]">{averageRating} average rating from {sortedReviews.length} review{sortedReviews.length === 1 ? '' : 's'}</p>
            </div>
            <select value={reviewSort} onChange={(e) => setReviewSort(e.target.value)} className="rounded-lg border border-[#e8bfd5] bg-white px-3 py-2 text-sm text-[#c9689a] outline-none">
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          <form onSubmit={handleSubmitReview} className="mb-6 rounded-2xl border border-[#e8bfd5] bg-[#fff7fb] p-4">
            <p className="mb-3 text-sm font-semibold text-[#c9689a]">Write a review</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Your Name" className="rounded-lg border border-[#e8bfd5] bg-white px-3 py-2 text-sm outline-none" />
              <div className="flex items-center gap-1 rounded-lg border border-[#e8bfd5] bg-white px-3 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewRating(star)} onMouseEnter={() => setReviewHover(star)} onMouseLeave={() => setReviewHover(0)}>
                    <FaStar className={(reviewHover || reviewRating) >= star ? 'text-[#E27BB1]' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
            </div>
            <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={4} placeholder="Share your experience with Maitri..." className="mt-3 w-full rounded-lg border border-[#e8bfd5] bg-white px-3 py-2 text-sm outline-none" />
            <button type="submit" disabled={reviewSubmitting} className="mt-3 rounded-lg bg-[#E27BB1] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>

          {reviewsLoading ? (
            <div className="flex justify-center py-4"><Loader /></div>
          ) : sortedReviews.length === 0 ? (
            <p className="text-sm text-[#704d61]">No reviews yet. Be the first to review this spray.</p>
          ) : (
            <div className="space-y-3">
              {sortedReviews.map((r) => (
                <article key={r.id} className="rounded-xl border border-[#f0d8e7] bg-white p-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#c9689a]">{r.reviewer_name || 'Customer'}</p>
                      {!r.verified ? (
                        <p className="text-xs font-medium text-amber-800">Pending approval</p>
                      ) : null}
                    </div>
                    <p className="text-xs text-gray-500 shrink-0">{r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN') : ''}</p>
                  </div>
                  <div className="mb-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} className={Number(r.rating) >= star ? 'text-[#E27BB1]' : 'text-gray-300'} />
                    ))}
                  </div>
                  <p className="wrap-break-word text-sm leading-relaxed text-[#704d61]">{r.comment}</p>
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

export default MaitriProductPage;
