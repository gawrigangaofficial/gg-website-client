import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft, FaTag, FaCheckCircle, FaChevronDown } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/Toaster';
import { useAuth } from '../../context/AuthContext';
import CheckoutModal from '../../components/CheckoutModal';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api.js';
import { pricingFromProduct, cartDiscountTotals } from '../../utils/productPricing';
import { getMaxOrderQuantity } from '../../utils/productPreorder';
import { getCardReviewCount } from '../../utils/reviewDisplayCount.js';
import PaymentTrustBadges from '../../components/PaymentTrustBadges';

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SUGGESTIONS_COUNT = 8;
const CONFETTI_PIECES = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${(index * 97) % 100}%`,
  delay: `${(index % 8) * 0.08}s`,
  duration: `${1.2 + (index % 5) * 0.2}s`,
  rotation: `${(index * 37) % 360}deg`,
}));

const formatMoney = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const toPaise = (value) => Math.round(Number(value || 0) * 100);
const meetsMinimumOrder = (subtotal, minimum) => {
  const min = Number(minimum || 0);
  const sub = Number(subtotal || 0);
  if (Number.isInteger(min)) {
    return Math.round(sub) >= min;
  }
  return toPaise(sub) >= toPaise(min);
};

function getCouponHeadline(coupon) {
  if (!coupon) return '';
  return String(coupon.discount_type).toLowerCase() === 'percentage'
    ? `${coupon.discount_value}% OFF`
    : `${formatMoney(coupon.discount_value)} OFF`;
}

function formatCouponExpiry(coupon) {
  if (!coupon?.expiry_date) return 'No expiry';
  return new Date(coupon.expiry_date).toLocaleDateString('en-IN');
}

function isCouponLive(coupon) {
  if (!coupon) return false;
  if (coupon.is_currently_valid !== undefined && coupon.is_currently_valid !== null) {
    return Boolean(coupon.is_currently_valid);
  }
  const now = Date.now();
  const start = coupon.start_date ? new Date(coupon.start_date).getTime() : null;
  const end = coupon.expiry_date ? new Date(coupon.expiry_date).getTime() : null;
  return (!start || now >= start) && (!end || now <= end);
}

function CartMoreProductsSection({ loading, products, calculatePricing, getReviewCount, sectionClassName = '' }) {
  if (!loading && products.length === 0) return null;
  return (
    <section className={`border-t border-gray-200 ${sectionClassName}`}>
      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Add more products to your cart
      </h2>
      {loading ? (
        <div className="flex justify-center py-8 sm:py-12">
          <Loader size="md" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              variant="default"
              calculatePricing={calculatePricing}
              getReviewCount={getReviewCount}
            />
          ))}
        </div>
      )}
    </section>
  );
}

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    includeBlessing,
    setIncludeBlessing,
    blessingCharge,
    OPTIONAL_BLESSING_CHARGE,
  } = useCart();
  const toast = useToast();
  const { isAuthenticated, userId, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [walletToUse, setWalletToUse] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCouponCode, setSelectedCouponCode] = useState('');
  const [privateCouponCode, setPrivateCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showCouponCelebration, setShowCouponCelebration] = useState(false);
  const [couponsExpanded, setCouponsExpanded] = useState(false);

  const getReviewCount = useCallback((productId) => getCardReviewCount(productId), []);

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleQuantityChange = (productId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    clearCart();
    toast.success('Cart cleared');
  };

  const totalPrice = getTotalPrice();
  const hasRudrakshaInCart = cartItems.some((item) => {
    const category = String(item.category || '').toLowerCase();
    const name = String(item.name || '').toLowerCase();
    const subcategory = String(item.subcategory || '').toLowerCase();
    return (
      category.includes('rudraksha') ||
      name.includes('rudraksha') ||
      subcategory.includes('mukhi')
    );
  });
  const couponDiscount = Number(appliedCoupon?.discount_amount || 0);
  const subtotalAfterCoupon = Math.max(0, totalPrice - couponDiscount);
  const totalWithBlessing = subtotalAfterCoupon + (hasRudrakshaInCart ? blessingCharge : 0);
  const shippingCharges = 70;
  const walletAppliedAmount = useWallet
    ? Math.min(walletToUse || walletBalance, walletBalance, totalWithBlessing + shippingCharges)
    : 0;
  const payableAfterWallet = Math.max(0, totalWithBlessing + shippingCharges - walletAppliedAmount);
  const { originalTotal, discountAmount } = cartDiscountTotals(cartItems);
  const selectedCoupon = availableCoupons.find((coupon) => coupon.code === selectedCouponCode) || null;
  const selectedCouponMinAmount = Number(selectedCoupon?.minimum_order_amount || 0);
  const selectedCouponMeetsMinimum =
    !selectedCoupon || meetsMinimumOrder(totalPrice, selectedCouponMinAmount);
  const selectedCouponMissingAmount = Math.max(0, selectedCouponMinAmount - totalPrice);
  const selectedCouponIsLive = !selectedCoupon || isCouponLive(selectedCoupon);

  useEffect(() => {
    if (!hasRudrakshaInCart && includeBlessing) {
      setIncludeBlessing(false);
    }
  }, [hasRudrakshaInCart, includeBlessing, setIncludeBlessing]);

  useEffect(() => {
    const fetchWalletAndCampaigns = async () => {
      if (!isAuthenticated) {
        setWalletBalance(0);
        setUseWallet(false);
        setWalletToUse(0);
        setActiveCampaigns([]);
        return;
      }
      try {
        const [walletRes, campaignsRes] = await Promise.all([
          apiFetch('/api/wallet/balance'),
          apiFetch('/api/cashback-campaigns/active'),
        ]);
        const walletJson = await walletRes.json().catch(() => ({}));
        const campaignsJson = await campaignsRes.json().catch(() => ({}));
        setWalletBalance(Number(walletJson?.data?.balance || 0));
        setActiveCampaigns(Array.isArray(campaignsJson?.data) ? campaignsJson.data : []);
      } catch (_error) {
        setWalletBalance(0);
      }
    };
    fetchWalletAndCampaigns();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await apiFetch('/api/coupons/public');
        const data = await res.json().catch(() => ({}));
        setAvailableCoupons(Array.isArray(data?.data) ? data.data : []);
      } catch (_error) {
        setAvailableCoupons([]);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadSuggestions = async () => {
      setSuggestionsLoading(true);
      try {
        const res = await apiFetch('/api/products?limit=100');
        const result = res.ok ? await res.json() : { data: [] };
        const list = result.success && Array.isArray(result.data) ? result.data : [];
        if (cancelled) return;
        const cartIds = new Set(cartItems.map((i) => String(i.id)));
        const candidates = list.filter((p) => p?.id != null && !cartIds.has(String(p.id)));
        shuffleInPlace(candidates);
        setSuggestedProducts(candidates.slice(0, SUGGESTIONS_COUNT));
      } catch {
        if (!cancelled) setSuggestedProducts([]);
      } finally {
        if (!cancelled) setSuggestionsLoading(false);
      }
    };
    loadSuggestions();
    return () => {
      cancelled = true;
    };
  }, [cartItems]);

  useEffect(() => {
    setAppliedCoupon(null);
    setSelectedCouponCode('');
    setPrivateCouponCode('');
  }, [cartItems, totalPrice]);

  const applyCouponByCode = async (couponCode) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }
    setCouponLoading(true);
    try {
      const payloadItems = cartItems.map((item) => ({
        product_id: item.id,
        product_price: item.price,
        quantity: item.quantity,
      }));
      const res = await apiFetch('/api/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({
          code: couponCode,
          items: payloadItems,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data?.message || 'Failed to apply coupon');
      }
      setAppliedCoupon({
        code: data.data.code,
        discount_amount: Number(data.data.discount_amount || 0),
      });
      setShowCouponCelebration(true);
      setTimeout(() => setShowCouponCelebration(false), 1800);
      setCouponsExpanded(false);
      setPrivateCouponCode(data.data.code || '');
      setSelectedCouponCode(data.data.code || selectedCouponCode);
      toast.success(`Coupon ${data.data.code} applied`);
    } catch (error) {
      setAppliedCoupon(null);
      toast.error(error.message || 'Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!selectedCouponCode) {
      toast.info('Please select a coupon first');
      return;
    }
    if (selectedCoupon && !selectedCouponMeetsMinimum) {
      toast.error(
        `Minimum purchase for ${selectedCoupon.code} is ₹${selectedCouponMinAmount.toLocaleString('en-IN')}`,
      );
      return;
    }
    if (selectedCoupon && !selectedCouponIsLive) {
      toast.error('This coupon is not active yet or already expired');
      return;
    }
    await applyCouponByCode(selectedCouponCode);
  };

  const handleApplyPrivateCoupon = async () => {
    const code = String(privateCouponCode || '').trim().toUpperCase();
    if (!code) {
      toast.info('Please enter a coupon code');
      return;
    }
    await applyCouponByCode(code);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPrivateCouponCode('');
    toast.success('Coupon removed');
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.info('Your cart is empty. Add items to proceed to checkout.');
      return;
    }
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }
    setShowCheckout(true);
  };

  const showEmptyCart = cartItems.length === 0 && !showCheckout;

  if (showEmptyCart) {
    return (
      <div className="min-h-screen py-8 sm:py-12 bg-linear-to-br from-amber-50 via-white to-orange-50/40">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <Link
            to="/"
            className="mb-6 sm:mb-8 inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            <FaArrowLeft className="text-sm sm:text-base" />
            <span className="text-sm sm:text-base">Continue Shopping</span>
          </Link>

          <div className="rounded-2xl border border-primary/10 bg-white/80 backdrop-blur-sm shadow-lg flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
            <FaShoppingCart className="text-6xl sm:text-8xl text-primary/20 mb-6" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              to="/"
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-semibold text-base sm:text-lg shadow-md"
            >
              Start Shopping
            </Link>
          </div>

          <CartMoreProductsSection
            loading={suggestionsLoading}
            products={suggestedProducts}
            calculatePricing={pricingFromProduct}
            getReviewCount={getReviewCount}
            sectionClassName="mt-12 sm:mt-16 pt-8 w-full text-left"
          />
        </div>
      </div>
    );
  }

  return (
    <>
    {showCouponCelebration && (
      <div className="pointer-events-none fixed inset-0 z-100 overflow-hidden">
        {CONFETTI_PIECES.map((piece) => (
          <span
            key={piece.id}
            className="cart-confetti-piece"
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              transform: `rotate(${piece.rotation})`,
            }}
          />
        ))}
      </div>
    )}
    <div className="min-h-screen bg-linear-to-br from-[#f7f7fb] via-white to-[#fff6ec] pb-24 lg:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* Header */}
        <div className="mb-5 sm:mb-6">
          <Link
            to="/"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            <FaArrowLeft className="text-xs" />
            Continue Shopping
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Shopping Cart
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} · Secure checkout
              </p>
            </div>
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={handleClearCart}
                className="text-sm font-medium text-gray-500 transition-colors hover:text-red-600"
              >
                Clear cart
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] lg:items-start">
          {/* Cart Items */}
          <div className="space-y-3">
            <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_auto_auto_auto] gap-4 border-b border-gray-200 px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <span>Product</span>
              <span className="w-28 text-center">Quantity</span>
              <span className="w-20 text-right">Total</span>
              <span className="w-8" />
            </div>
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="relative rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:grid sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center sm:gap-4"
              >
                <div className="flex gap-3 sm:gap-4 min-w-0 pr-8 sm:pr-0">
                  <Link
                    to={`/product/${item.slug || item.id}`}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200/80 sm:h-24 sm:w-24"
                  >
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/product/${item.slug || item.id}`}
                      className="mb-1 block line-clamp-2 text-base font-semibold text-gray-900 transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    {item.subcategory && (
                      <p className="mb-2 line-clamp-1 text-xs text-gray-500 sm:text-sm">
                        {item.subcategory}
                        {item.deity && ` · ${item.deity}`}
                        {item.planet && ` · ${item.planet}`}
                      </p>
                    )}
                    <p className="text-base font-bold text-primary sm:hidden">
                      ₹{item.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      <span className="ml-1 text-xs font-normal text-gray-500">each</span>
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 sm:mt-0 sm:w-28 sm:justify-center">
                  <span className="text-xs font-medium text-gray-500 sm:hidden">Qty</span>
                  <div className="inline-flex items-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                      className="px-3 py-2 text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="min-w-10 px-2 text-center text-sm font-semibold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                      className="px-3 py-2 text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={item.quantity >= getMaxOrderQuantity(item)}
                      aria-label="Increase quantity"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between sm:mt-0 sm:w-20 sm:flex-col sm:items-end sm:justify-center sm:text-right">
                  <span className="text-xs text-gray-500 sm:hidden">Line total</span>
                  <p className="text-base font-bold text-gray-900 sm:text-lg">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="hidden text-xs text-gray-500 sm:block">
                    ₹{item.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })} each
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id, item.name)}
                  className="absolute right-3 top-3 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 sm:static sm:flex sm:w-8 sm:justify-center"
                  aria-label={`Remove ${item.name}`}
                >
                  <FaTrash className="text-sm" />
                </button>
              </article>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_12px_40px_rgba(17,24,39,0.08)]">
              <div className="border-b border-gray-100 bg-linear-to-r from-amber-50/80 to-white px-4 py-3 sm:px-5 sm:py-4">
                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              </div>

              <div className="space-y-3 px-4 py-4 sm:px-5">
                <div className="rounded-xl bg-gray-50 px-3 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{payableAfterWallet.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <p className="mt-1 text-xs text-gray-500">
                      You save ₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })} on this order
                    </p>
                  )}
                </div>

                <div className="space-y-2 border-t border-gray-100 pt-3 text-sm text-gray-600">
                  <div className="flex justify-between gap-4">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="font-medium text-gray-900">
                      ₹{originalTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between gap-4">
                      <span>Product discount</span>
                      <span className="font-semibold text-green-600">
                        -₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-900">
                      ₹{shippingCharges.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between gap-4">
                      <span>Coupon ({appliedCoupon.code})</span>
                      <span className="font-semibold text-green-600">
                        -₹{couponDiscount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  {hasRudrakshaInCart && includeBlessing && (
                    <div className="flex justify-between gap-4">
                      <span>Blessing service</span>
                      <span className="font-medium text-gray-900">₹{blessingCharge.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {useWallet && walletAppliedAmount > 0 && (
                    <div className="flex justify-between gap-4 text-emerald-700">
                      <span>Wallet applied</span>
                      <span className="font-semibold">
                        -₹{walletAppliedAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>

                {hasRudrakshaInCart && (
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2.5 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={includeBlessing}
                      onChange={(e) => setIncludeBlessing(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                    />
                    <span>Add blessing service (+₹{OPTIONAL_BLESSING_CHARGE})</span>
                  </label>
                )}

                {isAuthenticated && walletBalance > 0 && (
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2.5 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={useWallet}
                      onChange={(e) => {
                        setUseWallet(e.target.checked);
                        if (e.target.checked) setWalletToUse(walletBalance);
                      }}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                    />
                    <span>
                      Use wallet balance
                      <span className="mt-0.5 block text-xs text-emerald-700">
                        Available: ₹{walletBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </span>
                  </label>
                )}

                {availableCoupons.length > 0 && (
                  <div className="overflow-hidden rounded-xl border border-amber-200/80">
                    <button
                      type="button"
                      onClick={() => setCouponsExpanded((open) => !open)}
                      className="flex w-full items-center justify-between gap-2 bg-amber-50/90 px-3 py-2.5 text-left text-sm font-semibold text-gray-800"
                    >
                      <span className="inline-flex items-center gap-2">
                        <FaTag className="text-primary" aria-hidden />
                        {appliedCoupon ? `Coupon applied · ${appliedCoupon.code}` : 'Apply coupon'}
                        {!appliedCoupon && (
                          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-500">
                            {availableCoupons.length}
                          </span>
                        )}
                      </span>
                      <FaChevronDown
                        className={`text-xs text-gray-500 transition-transform ${couponsExpanded ? 'rotate-180' : ''}`}
                        aria-hidden
                      />
                    </button>

                    {couponsExpanded && (
                      <div className="max-h-64 space-y-2 overflow-y-auto border-t border-amber-100 bg-white p-3">
                        <div className="space-y-2">
                          {availableCoupons.map((coupon) => {
                            const isSelected = selectedCouponCode === coupon.code;
                            const minAmount = Number(coupon.minimum_order_amount || 0);
                            const meetsMin = meetsMinimumOrder(totalPrice, minAmount);
                            const isLive = isCouponLive(coupon);
                            const isSelectable = isLive && meetsMin;
                            return (
                              <div
                                key={coupon.id}
                                className={`overflow-hidden rounded-lg border transition ${
                                  isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 bg-white'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => setSelectedCouponCode(coupon.code)}
                                  className="w-full p-2.5 text-left text-sm"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <p className="font-bold text-gray-900">{coupon.code}</p>
                                      <p className="text-xs text-gray-600">{getCouponHeadline(coupon)}</p>
                                    </div>
                                    <span
                                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                        isSelectable
                                          ? 'bg-emerald-100 text-emerald-700'
                                          : 'bg-gray-100 text-gray-500'
                                      }`}
                                    >
                                      {meetsMin ? 'Available' : `Min ${formatMoney(minAmount)}`}
                                    </span>
                                  </div>
                                </button>

                                {isSelected && (
                                  <div className="border-t border-gray-200 bg-white px-2.5 pb-2.5 pt-2 text-[11px] text-gray-700 sm:text-xs">
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                                      <p>
                                        Offer:{' '}
                                        <span className="font-semibold text-gray-900">
                                          {getCouponHeadline(coupon)}
                                        </span>
                                      </p>
                                      <p>
                                        Min order:{' '}
                                        <span className="font-semibold text-gray-900">
                                          {formatMoney(minAmount)}
                                        </span>
                                      </p>
                                      <p className="col-span-2">
                                        Valid till:{' '}
                                        <span className="font-semibold text-gray-900">
                                          {formatCouponExpiry(coupon)}
                                        </span>
                                      </p>
                                    </div>
                                    {!meetsMin && (
                                      <p className="mt-2 font-semibold text-red-600">
                                        Add {formatMoney(Math.max(0, minAmount - totalPrice))} more to unlock this coupon.
                                      </p>
                                    )}
                                    {!isLive && (
                                      <p className="mt-2 font-semibold text-amber-700">
                                        This coupon is not active for the current date/time.
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex gap-2">
                          {!appliedCoupon ? (
                            <button
                              type="button"
                              onClick={handleApplyCoupon}
                              disabled={couponLoading || !selectedCouponCode || !selectedCouponMeetsMinimum || !selectedCouponIsLive}
                              className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                            >
                              {couponLoading ? 'Applying...' : 'Apply selected'}
                            </button>
                          ) : (
                            <>
                              <div className="flex flex-1 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                                <FaCheckCircle className="shrink-0" aria-hidden />
                                Saved {formatMoney(couponDiscount)}
                              </div>
                              <button
                                type="button"
                                onClick={handleRemoveCoupon}
                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                              >
                                Remove
                              </button>
                            </>
                          )}
                        </div>

                        {!appliedCoupon && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={privateCouponCode}
                              onChange={(e) => setPrivateCouponCode(e.target.value.toUpperCase())}
                              placeholder="Enter code"
                              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <button
                              type="button"
                              onClick={handleApplyPrivateCoupon}
                              disabled={couponLoading || !String(privateCouponCode || '').trim()}
                              className="shrink-0 rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary disabled:opacity-50"
                            >
                              Apply
                            </button>
                          </div>
                        )}

                        {selectedCoupon && !selectedCouponMeetsMinimum && (
                          <p className="text-xs font-medium text-red-600">
                            Add {formatMoney(selectedCouponMissingAmount)} more to use {selectedCoupon.code}.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  disabled={cartItems.length === 0}
                  className="hidden w-full rounded-xl bg-linear-to-r from-primary to-orange-400 px-4 py-3 text-base font-semibold text-white shadow-lg transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:bg-gray-300 lg:block"
                >
                  Proceed to Checkout
                </button>

                <PaymentTrustBadges compact className="hidden w-full lg:block" />
                <p className="hidden text-center text-xs text-gray-500 lg:block">
                  Delivery in 3–7 business days across India
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile sticky checkout */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Total payable</p>
              <p className="text-xl font-bold text-primary">
                ₹{payableAfterWallet.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
            </div>
            <button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={cartItems.length === 0}
              className="ml-auto min-w-[148px] rounded-xl bg-linear-to-r from-primary to-orange-400 px-4 py-3 text-sm font-semibold text-white shadow-md disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Checkout
            </button>
          </div>
        </div>

        <CartMoreProductsSection
          loading={suggestionsLoading}
          products={suggestedProducts}
          calculatePricing={pricingFromProduct}
          getReviewCount={getReviewCount}
          sectionClassName="mt-10 sm:mt-14 pt-8 sm:pt-10"
        />
      </div>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cartItems={cartItems}
        totalAmount={totalPrice}
        couponCode={appliedCoupon?.code || null}
        couponDiscount={couponDiscount}
        blessingCharge={hasRudrakshaInCart ? blessingCharge : 0}
        walletBalance={walletBalance}
        useWallet={useWallet}
        walletAmountToUse={walletAppliedAmount}
        userId={userId}
        userPhone={user?.phone_number}
        userName={user?.full_name}
      />
    </div>
    </>
  );
};

export default Cart;
