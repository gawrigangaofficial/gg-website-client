import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaCheckCircle, FaChevronDown, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/Toaster';
import { useAuth } from '../../context/AuthContext';
import CheckoutModal from '../../components/CheckoutModal';
import { apiFetch } from '../../config/api.js';
import { cartDiscountTotals, pricingFromProduct } from '../../utils/productPricing';
import { getMaxOrderQuantity, productCanBePurchased } from '../../utils/productPreorder';
import { DEFAULT_DELIVERY_CHARGES, fetchDeliveryCharges, resolveShippingAmount } from '../../utils/deliveryCharges.js';
import EazebuzzLogo from '../../assets/eazebuzz.png';

const CONFETTI_PIECES = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${(index * 97) % 100}%`,
  delay: `${(index % 8) * 0.08}s`,
  duration: `${1.2 + (index % 5) * 0.2}s`,
  rotation: `${(index * 37) % 360}deg`,
}));

const formatMoney = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const formatRupee = (value) => {
  const amount = Number(value || 0);
  const digits = Number.isInteger(amount) ? 0 : 2;
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: digits })}`;
};
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

const Cart = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    includeBlessing,
    setIncludeBlessing,
    blessingCharge,
    OPTIONAL_BLESSING_CHARGE,
  } = useCart();
  const toast = useToast();
  const { isAuthenticated, userId, user } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [walletToUse, setWalletToUse] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCouponCode, setSelectedCouponCode] = useState('');
  const [privateCouponCode, setPrivateCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showCouponCelebration, setShowCouponCelebration] = useState(false);
  const [couponsExpanded, setCouponsExpanded] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [deliveryCharges, setDeliveryCharges] = useState(DEFAULT_DELIVERY_CHARGES);

  const closeCart = useCallback(() => {
    const idx = window.history.state?.idx;
    if (typeof idx === 'number' && idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setPanelOpen(true));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !showCheckout) closeCart();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeCart, showCheckout]);

  useEffect(() => {
    let cancelled = false;
    fetchDeliveryCharges().then((settings) => {
      if (!cancelled) setDeliveryCharges(settings);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadSuggestions = async () => {
      try {
        const res = await apiFetch('/api/products?limit=40');
        const result = res.ok ? await res.json() : { data: [] };
        const list = result.success && Array.isArray(result.data) ? result.data : [];
        if (cancelled) return;
        const cartIds = new Set(cartItems.map((item) => String(item.id)));
        const candidates = list.filter(
          (product) => product?.id != null && !cartIds.has(String(product.id)) && productCanBePurchased(product),
        );
        for (let i = candidates.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }
        setSuggestedProducts(candidates.slice(0, 8));
      } catch {
        if (!cancelled) setSuggestedProducts([]);
      }
    };
    loadSuggestions();
    return () => {
      cancelled = true;
    };
  }, [cartItems]);

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
  const prepaidDelivery = deliveryCharges.prepaid;
  const shippingCharges = resolveShippingAmount(deliveryCharges, 'upi', 70);
  const shippingReason =
    prepaidDelivery && !prepaidDelivery.is_standard ? prepaidDelivery.reason_message : null;
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
    const fetchWallet = async () => {
      if (!isAuthenticated) {
        setWalletBalance(0);
        setUseWallet(false);
        setWalletToUse(0);
        return;
      }
      try {
        const walletRes = await apiFetch('/api/wallet/balance');
        const walletJson = await walletRes.json().catch(() => ({}));
        setWalletBalance(Number(walletJson?.data?.balance || 0));
      } catch (_error) {
        setWalletBalance(0);
      }
    };
    fetchWallet();
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

  const handleAddSuggestion = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const goToLogin = () => {
    navigate('/login', { state: { from: { pathname: '/cart' } } });
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.info('Your cart is empty. Add items to proceed to checkout.');
      return;
    }
    setShowCheckout(true);
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {showCouponCelebration && (
        <div className="pointer-events-none fixed inset-0 z-[155] overflow-hidden">
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

      <div className="fixed inset-0 z-[140]" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <button
          type="button"
          className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${panelOpen ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Close cart"
          onClick={showCheckout ? () => setShowCheckout(false) : closeCart}
        />

        <aside
          className={`absolute inset-y-0 right-0 flex w-full flex-col bg-[#FFF6EE] shadow-2xl transition-transform duration-300 ease-out sm:w-[440px] ${
            panelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {showCheckout ? (
            <CheckoutModal
              embedded
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
          ) : (
          <>
          <header className="flex items-center gap-3 border-b border-orange-100 bg-[#FFF6EE] px-4 py-3.5">
            <button
              type="button"
              onClick={closeCart}
              className="rounded-full p-1.5 text-stone-800 transition-colors hover:bg-white"
              aria-label="Close cart"
            >
              <FaArrowLeft className="text-base" />
            </button>
            <h1 className="text-lg font-bold text-stone-900">Your Cart</h1>
          </header>

          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
            <p className="text-center text-xs font-medium text-stone-500">
              Trusted by Shiv devotees nationwide
            </p>

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-10 text-center shadow-sm">
                <FaShoppingCart className="mb-3 text-5xl text-primary/25" />
                <h2 className="text-lg font-bold text-stone-800">Your cart is empty</h2>
                <p className="mt-1 text-sm text-stone-500">Add something you love to get started.</p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const pricing = pricingFromProduct(item);
                  const lineTotal = pricing.currentPrice * item.quantity;
                  const lineOriginal = pricing.originalPrice * item.quantity;
                  const showOriginal = lineOriginal - lineTotal > 0.5;
                  return (
                    <article key={item.id} className="rounded-2xl bg-white p-3 shadow-sm">
                      <div className="flex gap-3">
                        <Link
                          to={`/product/${item.slug || item.id}`}
                          className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100"
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
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-stone-400">
                              No Image
                            </div>
                          )}
                        </Link>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/product/${item.slug || item.id}`}
                              className="line-clamp-2 text-sm font-semibold text-stone-900"
                            >
                              {item.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id, item.name)}
                              className="shrink-0 rounded-full border border-red-200 p-1.5 text-red-500"
                              aria-label={`Remove ${item.name}`}
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                          {(item.subcategory || item.deity) && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-stone-500">
                              {[item.subcategory, item.deity, item.planet].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-stone-900">
                              {formatRupee(lineTotal)}
                              {showOriginal && (
                                <span className="ml-1.5 text-xs font-medium text-stone-400 line-through">
                                  {formatRupee(lineOriginal)}
                                </span>
                              )}
                            </p>
                            <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                className="px-2.5 py-1.5 text-stone-600 disabled:opacity-40"
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <FaMinus className="text-[10px]" />
                              </button>
                              <span className="min-w-5 text-center text-sm font-semibold text-stone-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                className="px-2.5 py-1.5 text-stone-600 disabled:opacity-40"
                                disabled={item.quantity >= getMaxOrderQuantity(item)}
                                aria-label="Increase quantity"
                              >
                                <FaPlus className="text-[10px]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {availableCoupons.length > 0 && (
              <section>
                <button
                  type="button"
                  onClick={() => setCouponsExpanded((open) => !open)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-base font-bold text-stone-900">Offers and Coupons</span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    {appliedCoupon ? appliedCoupon.code : `${availableCoupons.length} Offers`}
                    <FaChevronRight className={`text-xs transition-transform ${couponsExpanded ? 'rotate-90' : ''}`} />
                  </span>
                </button>
                {couponsExpanded && (
                  <div className="mt-3 space-y-2 rounded-2xl bg-white p-3 shadow-sm">
                    {availableCoupons.map((coupon) => {
                      const isSelected = selectedCouponCode === coupon.code;
                      const minAmount = Number(coupon.minimum_order_amount || 0);
                      const meetsMin = meetsMinimumOrder(totalPrice, minAmount);
                      const isLive = isCouponLive(coupon);
                      return (
                        <button
                          key={coupon.id}
                          type="button"
                          onClick={() => setSelectedCouponCode(coupon.code)}
                          className={`w-full rounded-xl border p-2.5 text-left ${
                            isSelected ? 'border-primary bg-primary/5' : 'border-stone-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-bold text-stone-900">{coupon.code}</p>
                              <p className="text-xs text-stone-500">{getCouponHeadline(coupon)}</p>
                            </div>
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              isLive && meetsMin ? 'bg-primary/10 text-primary' : 'bg-stone-100 text-stone-500'
                            }`}
                            >
                              {meetsMin ? 'Available' : `Min ${formatMoney(minAmount)}`}
                            </span>
                          </div>
                          {isSelected && (
                            <p className="mt-1 text-[11px] text-stone-500">
                              Valid till {formatCouponExpiry(coupon)}
                            </p>
                          )}
                        </button>
                      );
                    })}
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
                          <div className="flex flex-1 items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                            <FaCheckCircle aria-hidden />
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
                          className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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
              </section>
            )}

            {suggestedProducts.length > 0 && (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-bold text-stone-900">Frequently Bought Together</h2>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
                  >
                    See All
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {suggestedProducts.slice(0, 4).map((product) => {
                    const pricing = pricingFromProduct(product);
                    const showOriginal = pricing.originalPrice - pricing.currentPrice > 0.5;
                    return (
                      <article key={product.id} className="min-w-0">
                        <Link to={`/product/${product.slug || product.id}`} className="relative block">
                          {pricing.discount > 0 && (
                            <span className="absolute left-2 top-2 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                              {pricing.discount}% OFF
                            </span>
                          )}
                          <span className="block h-28 overflow-hidden rounded-xl bg-white">
                            {product.images && product.images.length > 0 ? (
                              <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="flex h-full items-center justify-center text-[10px] text-stone-400">No Image</span>
                            )}
                          </span>
                        </Link>
                        <p className="mt-2 line-clamp-2 text-xs font-semibold text-stone-900">{product.name}</p>
                        <p className="mt-1 text-sm font-bold text-stone-900">
                          {formatRupee(pricing.currentPrice)}
                          {showOriginal && (
                            <span className="ml-1 text-[11px] font-medium text-stone-400 line-through">
                              {formatRupee(pricing.originalPrice)}
                            </span>
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleAddSuggestion(product)}
                          className="mt-2 w-full rounded-lg bg-primary py-1.5 text-xs font-semibold text-white"
                        >
                          Add to Cart
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {cartItems.length > 0 && (
              <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setSummaryOpen((open) => !open)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-base font-bold text-stone-900">Payment Summary</span>
                  {summaryOpen ? <FaChevronDown className="text-xs text-stone-500" /> : <FaPlus className="text-xs text-stone-500" />}
                </button>
                {summaryOpen && (
                  <div className="space-y-2 border-t border-stone-100 px-4 py-3 text-sm text-stone-600">
                    <div className="flex justify-between gap-4">
                      <span>Subtotal ({itemCount} items)</span>
                      <span className="font-medium text-stone-900">{formatRupee(originalTotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between gap-4">
                        <span>Product discount</span>
                        <span className="font-semibold text-primary">-{formatRupee(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between gap-4">
                      <span>Shipping</span>
                      <span className="font-medium text-stone-900">{formatRupee(shippingCharges)}</span>
                    </div>
                    {shippingReason ? <p className="text-xs text-amber-800">{shippingReason}</p> : null}
                    {appliedCoupon && (
                      <div className="flex justify-between gap-4">
                        <span>Coupon ({appliedCoupon.code})</span>
                        <span className="font-semibold text-primary">-{formatMoney(couponDiscount)}</span>
                      </div>
                    )}
                    {hasRudrakshaInCart && includeBlessing && (
                      <div className="flex justify-between gap-4">
                        <span>Shuddhi / Pran Pratishtha</span>
                        <span className="font-medium text-stone-900">{formatRupee(blessingCharge)}</span>
                      </div>
                    )}
                    {useWallet && walletAppliedAmount > 0 && (
                      <div className="flex justify-between gap-4 text-primary">
                        <span>Wallet applied</span>
                        <span className="font-semibold">-{formatMoney(walletAppliedAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between gap-4 border-t border-stone-100 pt-2 text-base font-bold text-stone-900">
                      <span>Total</span>
                      <span className="text-primary">{formatMoney(payableAfterWallet)}</span>
                    </div>
                  </div>
                )}
              </section>
            )}

            <section className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="text-base font-bold text-stone-900">Wallet</h2>
              {isAuthenticated ? (
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-sm text-stone-600">
                    Available balance
                    <span className="mt-0.5 block text-base font-bold text-stone-900">{formatMoney(walletBalance)}</span>
                  </p>
                  {walletBalance > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = !useWallet;
                        setUseWallet(next);
                        if (next) setWalletToUse(walletBalance);
                      }}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        useWallet ? 'bg-primary/10 text-primary' : 'bg-primary text-white'
                      }`}
                    >
                      {useWallet ? 'Applied' : 'Use'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-sm text-stone-600">Log in to use your wallet amount.</p>
                  <button
                    type="button"
                    onClick={goToLogin}
                    className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                  >
                    Login
                  </button>
                </div>
              )}
            </section>

            {hasRudrakshaInCart && (
              <button
                type="button"
                onClick={() => setIncludeBlessing(!includeBlessing)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-left shadow-sm"
              >
                <span className="inline-flex items-center gap-3 text-sm font-semibold text-stone-800">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      includeBlessing ? 'border-primary' : 'border-stone-300'
                    }`}
                  >
                    {includeBlessing && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                  </span>
                  Shuddhi / Pran Pratishtha
                </span>
                <span className="shrink-0 text-sm text-stone-500">+{formatRupee(OPTIONAL_BLESSING_CHARGE)}</span>
              </button>
            )}

            {availableCoupons.length > 0 && !couponsExpanded && (
              <button
                type="button"
                onClick={() => setCouponsExpanded(true)}
                className="w-full text-center text-sm font-semibold text-primary"
              >
                Choose one eligible offer
              </button>
            )}
          </div>

          {cartItems.length > 0 && (
            <footer className="border-t border-orange-100 bg-[#FFF6EE] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
              <div className="flex items-end justify-between gap-3">
                <div>
                  {originalTotal - payableAfterWallet > 0.5 && (
                    <p className="text-sm text-stone-400 line-through">{formatRupee(originalTotal)}</p>
                  )}
                  <p className="text-2xl font-bold leading-none text-stone-900">{formatRupee(payableAfterWallet)}</p>
                  <p className="mt-1 text-[11px] text-stone-500">Includes shipping</p>
                </div>
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="min-w-[132px] rounded-xl bg-primary px-5 py-3 text-base font-semibold text-white shadow-md hover:bg-primary/90"
                >
                  Confirm
                </button>
              </div>
              <div className="mt-3 border-t border-stone-200 pt-2">
                <p className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
                  Payment secured by
                  <img
                    src={EazebuzzLogo}
                    alt="Eazebuzz"
                    className="h-5 w-auto object-contain"
                  />
                </p>
              </div>
            </footer>
          )}
          </>
          )}
        </aside>
      </div>
    </>
  );
};

export default Cart;
