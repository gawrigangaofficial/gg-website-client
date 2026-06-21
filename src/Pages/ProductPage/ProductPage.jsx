import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaHeart,
  FaRegHeart,
  FaTruck,
  FaShieldAlt,
  FaCertificate,
  FaCompass,
  FaCheckCircle,
  FaTrashAlt,
  FaTimes,
  FaShareAlt,
  FaPlay,
  FaGem,
  FaEye,
  FaRulerHorizontal,
  FaAward,
  FaBoxOpen,
  FaGift,
  FaUserFriends,
} from "react-icons/fa";
import Loader from "../../components/Loader";
import { useToast } from "../../components/Toaster";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import CheckoutModal from "../../components/CheckoutModal";
import PreorderEmailModal from "../../components/PreorderEmailModal";
import ProductCard from "../../components/ProductCard";
import { apiFetch } from "../../config/api.js";
import idrImage from "../../assets/ProductPage/idr.webp";
import rdcImage from "../../assets/ProductPage/rdc.webp";
import { pricingFromProduct } from "../../utils/productPricing";
import { isProductPreorder, productCanBePurchased, getMaxOrderQuantity } from "../../utils/productPreorder";
import { submitPreorderRequest } from "../../utils/preorderRequest";
import { trackBeginCheckout, trackViewContent } from "../../utils/analytics.js";
import { getCardReviewCount } from "../../utils/reviewDisplayCount.js";
import { buildBreadcrumbJsonLd, buildProductJsonLd } from "../../utils/productJsonLd.js";
import { normalizeProductMedia } from "../../utils/productMedia.js";
import { getGalleryViewLabel, getProductStoryContext } from "../../utils/productPageCopy.js";
import PaymentTrustBadges from "../../components/PaymentTrustBadges.jsx";

const LOW_STOCK_THRESHOLD = 5;

function getStockStatus(product) {
  const stock = Number(product?.stock) || 0;
  if (stock <= 0) return { kind: "out", stock: 0 };
  if (stock <= LOW_STOCK_THRESHOLD) return { kind: "low", stock };
  return { kind: "in", stock };
}

function getStockLabel(status, { compact = false } = {}) {
  if (status.kind === "out") return compact ? "No Stock" : "Out of Stock";
  if (status.kind === "low") return `Only ${status.stock} left`;
  return compact ? "Stock" : "In Stock";
}

const VIDEO_SIDE_HIGHLIGHTS = [
  {
    Icon: FaEye,
    title: "Texture & finish",
    desc: "See the bead surface, polish, and craft, not just a catalog photo.",
  },
  {
    Icon: FaRulerHorizontal,
    title: "Size & drape",
    desc: "Understand true length and how it sits before you order.",
  },
  {
    Icon: FaGem,
    title: "Colour & detail",
    desc: "Natural tone, spacing, and workmanship in real light.",
  },
];

const VIDEO_SIDE_STANDARDS = [
  {
    Icon: FaCertificate,
    title: "Lab-verified",
    desc: "Quality checked",
  },
  {
    Icon: FaAward,
    title: "Authentic",
    desc: "Genuine sourcing",
  },
  {
    Icon: FaBoxOpen,
    title: "Safe packing",
    desc: "Careful dispatch",
  },
  {
    Icon: FaTruck,
    title: "Fast delivery",
    desc: "Across India",
  },
];

function ProductVideoSidePanel() {
  return (
    <div className="hidden h-full min-w-0 flex-col gap-3 lg:flex xl:gap-4">
      <div className="rounded-2xl border border-amber-300/70 bg-linear-to-br from-[#FFFAEB] via-white to-orange-50/80 p-4 shadow-sm xl:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/85 xl:text-[11px]">
          In the video
        </p>
        <h3 className="mt-1.5 font-heading text-lg font-bold leading-tight text-stone-900 xl:text-xl">
          What you&apos;ll notice
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Shot to help you decide with confidence, with the same care we put into every piece we send.
        </p>
        <ul className="mt-4 space-y-3">
          {VIDEO_SIDE_HIGHLIGHTS.map(({ Icon, title, desc }) => (
            <li key={title} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15">
                <Icon className="text-sm" aria-hidden />
              </span>
              <span className="min-w-0 pt-0.5">
                <span className="block text-sm font-semibold text-stone-900">{title}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-stone-600">{desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 rounded-2xl border border-primary/15 bg-white p-4 shadow-sm xl:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/85 xl:text-[11px]">
          Our standard
        </p>
        <h3 className="mt-1.5 font-heading text-lg font-bold leading-tight text-stone-900 xl:text-xl">
          The Gawri Ganga promise
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-2.5 xl:gap-3">
          {VIDEO_SIDE_STANDARDS.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-stone-200/90 bg-[#FFFAEB]/50 p-3 transition-colors hover:border-primary/25 hover:bg-primary/5"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="text-sm" aria-hidden />
              </span>
              <p className="mt-2 text-xs font-bold text-stone-900 xl:text-sm">{title}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-stone-500 xl:text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductLabCertificateBlock() {
  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-linear-to-br from-[#FFFAEB] via-white to-amber-50/90 p-3 shadow-md sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="mx-auto w-full max-w-[140px] shrink-0 sm:mx-0 sm:max-w-[120px] md:max-w-[140px]">
          <img
            src={rdcImage}
            alt="Lab-tested authenticity certificate, Gawri Ganga"
            loading="eager"
            decoding="async"
            className="w-full rounded-lg border border-primary/25 object-contain shadow-sm"
          />
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:text-[11px]">
            Lab-tested authenticity
          </p>
          <h2 className="mt-1 font-heading text-base font-bold leading-snug text-stone-900 sm:text-lg">
            Certificate-backed. Not just claimed.
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-stone-600 sm:text-sm">
            Every piece goes through verified quality checks. You receive genuine spiritual goods with
            documentation you can trust, not marketplace guesswork.
          </p>
          <ul className="mt-2.5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] font-semibold text-stone-700 sm:justify-start sm:text-xs">
            <li className="inline-flex items-center gap-1.5">
              <FaCertificate className="text-primary" aria-hidden />
              Lab verification
            </li>
            <li className="inline-flex items-center gap-1.5">
              <FaCheckCircle className="text-emerald-600" aria-hidden />
              Sourced authentically
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ProductStoryBlock({ product, stockStatus }) {
  const { whoFor, occasions, openingLine, urgency } = getProductStoryContext(product, stockStatus);

  return (
    <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80 sm:text-[11px]">
          Why devotees choose this
        </p>
        <p className="mt-2 text-sm leading-relaxed text-stone-700 sm:text-base">{openingLine}</p>
      </div>
      {urgency ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 sm:text-sm">
          {urgency}
        </p>
      ) : null}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-bold text-stone-900 sm:text-base">
          <FaUserFriends className="text-primary" aria-hidden />
          Who this is for
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{whoFor}</p>
      </div>
      <div>
        <h3 className="flex items-center gap-2 text-sm font-bold text-stone-900 sm:text-base">
          <FaGift className="text-primary" aria-hidden />
          Perfect for
        </h3>
        <ul className="mt-2 space-y-1.5">
          {occasions.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ProductBelowGalleryMedia({ videoUrl, posterUrl, productName, className = "" }) {
  const rdcFrameClass =
    "block w-full rounded-xl border-2 border-primary/20 object-contain";

  if (videoUrl) {
    return (
      <div className={`w-full max-w-[min(100%,700px)] mx-auto min-w-0 ${className}`}>
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-5 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <div className="mx-auto w-full max-w-[360px] lg:mx-0 lg:max-w-none">
            <div className="relative overflow-hidden rounded-2xl bg-stone-950 shadow-[0_16px_44px_-14px_rgba(62,47,28,0.45)] ring-1 ring-stone-900/10">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full scale-105 object-cover opacity-35 blur-md"
                />
              ) : null}
              <div
                className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/50"
                aria-hidden
              />
              <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md sm:text-[11px]">
                <FaPlay className="text-[9px] sm:text-[10px]" aria-hidden />
                Product video
              </div>
              <video
                src={videoUrl}
                controls
                playsInline
                preload="metadata"
                poster={posterUrl || undefined}
                className="relative z-10 block w-full aspect-9/16 object-cover rounded-2xl"
                aria-label={`${productName} product video`}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <ProductVideoSidePanel />
        </div>
        <p className="mt-2.5 text-center text-xs leading-relaxed text-stone-500 lg:hidden">
          Tap play for a closer look at size, finish, and detail.
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-[min(100%,700px)] mx-auto min-w-0 ${className}`}>
      <img
        src={rdcImage}
        alt="Additional product information"
        loading="lazy"
        decoding="async"
        className={rdcFrameClass}
      />
    </div>
  );
}

function ProductStickyCtaBar({
  visible,
  productName,
  price,
  canPurchase,
  isPreorder,
  onBuyNow,
  onAddToCart,
}) {
  if (!visible) return null;

  const priceLabel = `₹${Number(price || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-130 pointer-events-none px-3 pb-3 sm:px-4 sm:pb-4 lg:px-6 lg:pb-5">
      <div className="pointer-events-auto mx-auto w-full max-w-7xl overflow-hidden rounded-2xl border border-stone-200/90 bg-white/95 shadow-[0_16px_48px_-12px_rgba(62,47,28,0.28)] backdrop-blur-md ring-1 ring-black/[0.04] sm:rounded-3xl">
        <div className="flex w-full flex-col gap-2 px-3 py-2.5 sm:px-5 sm:py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-6 lg:py-3.5">
          <p className="text-center text-xs font-semibold text-emerald-700 lg:hidden">
            ✓ Cash on Delivery Available Across India
          </p>
          <div className="hidden min-w-0 flex-1 lg:block">
            <p className="truncate text-sm font-semibold text-stone-800">{productName}</p>
            <p className="text-xl font-bold text-primary">{priceLabel}</p>
          </div>
          <div className="flex w-full flex-col gap-2 lg:w-auto lg:min-w-[340px] lg:flex-row lg:gap-3">
            <button
              type="button"
              onClick={onBuyNow}
              disabled={!canPurchase}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-300 lg:min-h-[48px] lg:min-w-[160px] lg:px-8 lg:text-base"
            >
              <span>{isPreorder ? "Preorder Now" : "Buy Now"}</span>
              {!isPreorder ? <FaChevronRight className="text-sm opacity-90" aria-hidden /> : null}
            </button>
            <button
              type="button"
              onClick={onAddToCart}
              disabled={!canPurchase}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-primary/30 bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 lg:min-h-[48px] lg:px-6"
            >
              <FaShoppingCart className="text-base shrink-0" aria-hidden />
              {canPurchase ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    addToCart,
    cartItems,
    includeBlessing,
    setIncludeBlessing,
    blessingCharge,
    OPTIONAL_BLESSING_CHARGE,
  } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, userId, user, loading: authLoading } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPreorderModal, setShowPreorderModal] = useState(false);
  const [preorderEmail, setPreorderEmail] = useState("");
  const [preorderSubmitting, setPreorderSubmitting] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(() => new Set(["description"]));
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSort, setReviewSort] = useState("recent");
  const [reviewPerPage, setReviewPerPage] = useState(10);
  const [reviewPage, setReviewPage] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewImageFile, setReviewImageFile] = useState(null);
  const [reviewImagePreview, setReviewImagePreview] = useState("");
  const [reviewDeletingId, setReviewDeletingId] = useState(null);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const ctaAnchorRef = useRef(null);
  const isRudrakshaProduct =
    product?.category === "Rudraksha" || product?.category === "Rudrakshas";
  const isComboProduct = product?.category === "Combos";

  // Normalize API review to UI shape
  const normalizeReview = (r) => ({
    id: r.id,
    name: r.reviewer_name,
    rating: r.rating,
    date: r.created_at
      ? new Date(r.created_at).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
      : "",
    created_at: r.created_at,
    text: r.comment || "",
    verified: !!r.verified,
    pendingApproval: !r.verified,
    imageUrl: r.image_url || null,
    user_id: r.user_id || null,
  });
  const allReviews = reviews.map(normalizeReview);

  // Rating summary: distribution and average
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: allReviews.filter((r) => r.rating === star).length,
  }));
  const totalReviews = allReviews.length;
  const maxCount = Math.max(1, ...ratingDistribution.map((d) => d.count));
  const avgRating = totalReviews
    ? (() => {
        const sum = allReviews.reduce((s, r) => {
          const x = Number(r.rating);
          return s + (Number.isFinite(x) ? x : 0);
        }, 0);
        const avg = sum / totalReviews;
        return Number.isFinite(avg) ? Math.round(avg * 10) / 10 : 0;
      })()
    : 0;
  const avgRatingFull = Math.floor(avgRating);
  const avgRatingHalf = avgRating % 1 >= 0.3 && avgRating % 1 < 0.8;

  const getReviewSortDate = (r) => {
    if (r.created_at) return new Date(r.created_at);
    const d = r.date;
    if (!d) return new Date();
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const sortedReviews = [...allReviews].sort((a, b) => {
    if (reviewSort === "recent") return getReviewSortDate(b) - getReviewSortDate(a);
    if (reviewSort === "highest") return b.rating - a.rating;
    if (reviewSort === "lowest") return a.rating - b.rating;
    return 0;
  });
  const totalPages = Math.max(1, Math.ceil(sortedReviews.length / reviewPerPage));
  const paginatedReviews = sortedReviews.slice(
    (reviewPage - 1) * reviewPerPage,
    reviewPage * reviewPerPage
  );

  // Map API category name to app route for breadcrumbs
  const categoryToPath = {
    Rudrakshas: "/rudraksha",
    Rudraksha: "/rudraksha",
    Sprays: "/sprays",
    Rashi: "/rashi",
    Accessories: "/accessories",
    Combos: "/combos",
  };

  // Rashi → recommended Rudraksha Mukhi (matches Rashi page logic)
  const rashiToRudrakshaMapping = {
    Aries: ["1 Mukhi", "3 Mukhi", "11 Mukhi"],
    Taurus: ["2 Mukhi", "6 Mukhi", "14 Mukhi"],
    Gemini: ["3 Mukhi", "5 Mukhi", "12 Mukhi"],
    Cancer: ["2 Mukhi", "4 Mukhi", "7 Mukhi"],
    Leo: ["1 Mukhi", "5 Mukhi", "9 Mukhi"],
    Virgo: ["6 Mukhi", "10 Mukhi", "14 Mukhi"],
    Libra: ["2 Mukhi", "7 Mukhi", "11 Mukhi"],
    Scorpio: ["3 Mukhi", "8 Mukhi", "13 Mukhi"],
    Sagittarius: ["4 Mukhi", "9 Mukhi", "12 Mukhi"],
    Capricorn: ["6 Mukhi", "10 Mukhi", "14 Mukhi"],
    Aquarius: ["5 Mukhi", "11 Mukhi", "13 Mukhi"],
    Pisces: ["4 Mukhi", "7 Mukhi", "12 Mukhi"],
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!isRudrakshaProduct && includeBlessing) {
      setIncludeBlessing(false);
    }
  }, [isRudrakshaProduct, includeBlessing, setIncludeBlessing]);

  useEffect(() => {
    if (user?.full_name && !reviewName.trim()) {
      setReviewName(user.full_name);
    }
  }, [user?.full_name]);

  useEffect(() => {
    if (user?.email) {
      setPreorderEmail(user.email);
    }
  }, [user?.email]);

  // Fetch reviews for this product
  useEffect(() => {
    if (!product?.id) return;
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await apiFetch(`/api/reviews/product/${product.id}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setReviews(json.data);
        } else {
          setReviews([]);
        }
      } catch (err) {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [product?.id]);

  // Fetch related products (same category, exclude current)
  useEffect(() => {
    if (!product?.category) return;

    const fetchRelated = async () => {
      setRelatedLoading(true);
      try {
        const res = await apiFetch(
          `/api/products?category=${encodeURIComponent(product.category)}`
        );
        const result = res.ok ? await res.json() : { data: [] };
        const list = result.success && result.data ? result.data : [];
        const related = list
          .filter((p) => p.id !== product.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelated();
  }, [product?.id, product?.category]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch(`/api/products/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Product not found");
        } else {
          setError("Failed to load product");
        }
        return;
      }

      const result = await response.json();
      if (result.success) {
        const data = normalizeProductMedia(result.data || {});
        setProduct({
          ...data,
          elements: String(data.elements ?? data.Elements ?? "").trim(),
          benefits: String(data.benefits ?? data.Benefits ?? "").trim(),
          who_can_use: String(data.who_can_use ?? data.whoCanUse ?? "").trim(),
        });
        // Reset image index when product changes
        setSelectedImageIndex(0);
        setImagePreviewOpen(false);
      } else {
        setError("Failed to load product");
      }
    } catch (err) {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} of ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (isProductPreorder(product)) {
      setShowPreorderModal(true);
      return;
    }
    if (authLoading) {
      toast.info('Please wait, checking authentication...');
      return;
    }
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/product/${slug}` } } });
      return;
    }
    const existingItem = cartItems.find(item => item.id === product.id);
    const checkoutItems = existingItem
      ? cartItems
      : [
          ...cartItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
          },
        ];
    const checkoutValue = checkoutItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );
    trackBeginCheckout(checkoutValue, checkoutItems);
    if (!existingItem) {
      addToCart(product, quantity);
    }
    setShowCheckout(true);
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
  
  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    const added = toggleWishlist(product);
    if (added) {
      toast.success(`${product.name} added to wishlist!`);
    } else {
      toast.info(`${product.name} removed from wishlist`);
    }
  };

  const handleShareProduct = async () => {
    if (!product || !slug) return;
    const url = `${window.location.origin}/product/${encodeURIComponent(slug)}`;
    const sharePayload = {
      title: product.name,
      text: `Check out ${product.name} on Gawri Ganga`,
      url,
    };
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share(sharePayload);
        return;
      }
    } catch (err) {
      if (err?.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not share or copy link");
    }
  };

  const toggleAccordion = (section) => {
    setAccordionOpen((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const fetchReviewsForProduct = async () => {
    if (!product?.id) return;
    try {
      const res = await apiFetch(`/api/reviews/product/${product.id}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setReviews(json.data);
      }
    } catch (err) {
    }
  };

  const clearReviewImage = () => {
    if (reviewImagePreview && reviewImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(reviewImagePreview);
    }
    setReviewImageFile(null);
    setReviewImagePreview("");
  };

  const handleReviewImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5MB or smaller.");
      return;
    }
    if (reviewImagePreview && reviewImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(reviewImagePreview);
    }
    setReviewImageFile(file);
    setReviewImagePreview(URL.createObjectURL(file));
  };

  const ensureReviewAuth = () => {
    if (authLoading) {
      toast.info("Please wait, checking authentication...");
      return false;
    }
    if (!isAuthenticated) {
      toast.info("Please sign in to write a review.");
      navigate("/login", { state: { from: { pathname: `/product/${slug}` } } });
      return false;
    }
    return true;
  };

  const handleReviewFormToggle = () => {
    if (!showReviewForm) {
      if (!ensureReviewAuth()) return;
      if (!reviewName.trim() && user?.full_name) {
        setReviewName(user.full_name);
      }
    }
    setShowReviewForm((v) => !v);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!product?.id) return;
    if (!ensureReviewAuth()) return;
    if (!reviewName.trim() || reviewRating < 1) {
      toast.error("Please add your name and select a rating.");
      return;
    }
    setReviewSubmitting(true);
    try {
      let uploadedImageUrl = null;
      if (reviewImageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", reviewImageFile);
        const uploadRes = await apiFetch("/api/reviews/upload-image", {
          method: "POST",
          body: imageFormData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.success) {
          throw new Error(uploadJson.message || "Failed to upload review image.");
        }
        uploadedImageUrl = uploadJson.data?.image_url || null;
      }

      const res = await apiFetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          product_id: product.id,
          reviewer_name: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim() || null,
          image_url: uploadedImageUrl,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setReviewName("");
        setReviewComment("");
        setReviewRating(0);
        clearReviewImage();
        setShowReviewForm(false);
        setReviewPage(1);
        await fetchReviewsForProduct();
        toast.success(
          json.message || "Thank you! Your review has been submitted. It will appear publicly after approval.",
        );
      } else {
        toast.error(json.message || "Failed to submit review.");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId, reviewUserId) => {
    if (!userId || reviewUserId !== userId) return;
    setReviewDeletingId(reviewId);
    try {
      const res = await apiFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        await fetchReviewsForProduct();
        toast.success("Review deleted.");
      } else {
        toast.error(json.message || "Failed to delete review.");
      }
    } catch (_err) {
      toast.error("Failed to delete review.");
    } finally {
      setReviewDeletingId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (reviewImagePreview && reviewImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(reviewImagePreview);
      }
    };
  }, [reviewImagePreview]);

  const handleQuantityChange = (delta) => {
    if (!product) return;
    const max = getMaxOrderQuantity(product);
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (newQuantity > max) return max;
      return newQuantity;
    });
  };

  useEffect(() => {
    if (!product) return;
    const max = getMaxOrderQuantity(product);
    setQuantity((q) => Math.min(Math.max(1, q), max));
  }, [product?.id, product?.stock, product?.sale_type]);

  useEffect(() => {
    if (!product?.id) return;
    trackViewContent(product, quantity);
  }, [product?.id]);

  const nextImage = () => {
    if (product?.images && product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 0) {
      setSelectedImageIndex(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  useEffect(() => {
    if (!imagePreviewOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setImagePreviewOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [imagePreviewOpen]);

  useEffect(() => {
    if (!product?.id) {
      setShowStickyCta(false);
      return undefined;
    }

    const el = ctaAnchorRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCta(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [product?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Product not found"}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const pricing = pricingFromProduct(product);
  const reviewCount = totalReviews;
  const stockStatus = getStockStatus(product);
  const productJsonLd = buildProductJsonLd({
    product,
    pricing,
    avgRating,
    reviewCount: totalReviews,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    ...(product.category && categoryToPath[product.category]
      ? [{ name: product.category, url: categoryToPath[product.category] }]
      : []),
    { name: product.name, url: `/product/${product.slug || product.id}` },
  ]);
  const hasMultipleImages = product.images && product.images.length > 1;
  const isPreorder = isProductPreorder(product);
  const canPurchase = productCanBePurchased(product);
  const maxOrderQty = getMaxOrderQuantity(product);

  // For Rudraksha: which Rashis recommend this product (by matching mukhi in subcategory/name)
  const isRudraksha = isRudrakshaProduct;
  const getRashisForThisProduct = () => {
    if (!isRudraksha) return [];
    const text = `${product.subcategory || ""} ${product.name || ""}`.toLowerCase();
    const rashis = [];
    Object.entries(rashiToRudrakshaMapping).forEach(([rashi, mukhis]) => {
      const matches = mukhis.some((m) => {
        const mLower = m.toLowerCase();
        const num = m.replace(/\s*mukhi$/i, "").trim();
        return (
          text.includes(mLower) ||
          text.includes(num + " mukhi") ||
          text.includes(num + "mukhi")
        );
      });
      if (matches) rashis.push(rashi);
    });
    return rashis;
  };
  const recommendedRashis = getRashisForThisProduct();

  return (
    <div
      className={`min-h-screen py-4 sm:py-6 lg:py-8 bg-linear-to-br from-orange-50/30 to-white overflow-x-hidden ${
        showStickyCta ? "pb-32 sm:pb-36 lg:pb-32" : "pb-24 sm:pb-6 lg:pb-8"
      }`}
    >
      <Helmet>
        {productJsonLd ? (
          <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
        ) : null}
        {breadcrumbJsonLd ? (
          <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        ) : null}
      </Helmet>
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-4 md:px-6 lg:px-8 xl:px-12 min-w-0">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-2 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <FaArrowLeft className="text-sm sm:text-base" />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        {/* Breadcrumbs */}
        <nav className="mb-4 sm:mb-6 flex items-center gap-2 text-xs sm:text-sm text-gray-600 flex-wrap min-w-0">
          <Link to="/" className="hover:text-primary transition-colors shrink-0">Home</Link>
          <span className="text-gray-400 shrink-0">/</span>
          {product.category && categoryToPath[product.category] ? (
            <>
              <Link
                to={categoryToPath[product.category]}
                className="hover:text-primary transition-colors capitalize shrink-0"
              >
                {product.category}
              </Link>
              <span className="text-gray-400 shrink-0">/</span>
            </>
          ) : null}
          <span className="text-gray-900 font-medium truncate min-w-0 max-w-[55vw] sm:max-w-none" title={product.name}>
            {product.name}
          </span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 min-w-0">
          {/* Left: Image Gallery + Element & Benefits images (vertical, no text) */}
          <div className="flex flex-col gap-3 sm:gap-6 min-w-0">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 min-w-0">
              {/* Thumbnail Images - Left Side on Desktop, horizontal scroll on Mobile */}
              {hasMultipleImages && (
                <div className="flex flex-row md:flex-col gap-2 sm:gap-3 shrink-0 justify-start md:justify-start order-1 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0 scrollbar-thin min-w-0">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      title={getGalleryViewLabel(index, product.images.length)}
                      className={`relative w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 touch-manipulation ${
                        selectedImageIndex === index
                          ? "border-primary ring-2 ring-primary/50"
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name}, ${getGalleryViewLabel(index, product.images.length)}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150x150?text=No+Image";
                        }}
                      />
                      {hasMultipleImages && product.images.length > 1 ? (
                        <span className="absolute inset-x-0 bottom-0 bg-black/65 px-0.5 py-0.5 text-[8px] font-semibold leading-tight text-white sm:text-[9px]">
                          {index + 1}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              )}

              {/* Main image + Element & Benefits – same width (flex-1), same box style */}
              <div className="flex-1 flex flex-col gap-4 sm:gap-6 min-w-0 order-2">
                {/* Main Image – edge-to-edge below lg; constrained gallery box on lg+ */}
                <div className="relative aspect-square min-w-0 bg-gray-100 overflow-hidden border-primary/20 group max-lg:w-screen max-lg:max-w-[100vw] max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:rounded-none max-lg:border-y-2 max-lg:border-x-0 lg:left-0 lg:translate-x-0 lg:w-full lg:max-w-[min(100%,700px)] lg:mx-auto lg:max-h-[700px] lg:rounded-xl lg:border-2 lg:border-primary/20">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <img
                        src={product.images[selectedImageIndex]}
                        alt={`${product.name}, ${getGalleryViewLabel(selectedImageIndex, product.images.length)}`}
                        loading="eager"
                        decoding="async"
                        className="pointer-events-none relative z-0 block h-full w-full object-contain object-center"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/600x600?text=No+Image";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreviewOpen(true)}
                        className="absolute inset-0 z-[1] cursor-zoom-in bg-transparent max-lg:rounded-none lg:rounded-xl"
                        aria-label="View larger image"
                      />
                      {/* Image Navigation Arrows */}
                      {hasMultipleImages && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              prevImage();
                            }}
                            className="absolute left-1 sm:left-2 top-1/2 z-[2] -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-2 rounded-full transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
                            aria-label="Previous image"
                          >
                            <FaChevronLeft className="text-sm sm:text-base" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              nextImage();
                            }}
                            className="absolute right-1 sm:right-2 top-1/2 z-[2] -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-2 rounded-full transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
                            aria-label="Next image"
                          >
                            <FaChevronRight className="text-sm sm:text-base" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-lg">No Image Available</span>
                    </div>
                  )}
                </div>
                {hasMultipleImages ? (
                  <p className="text-center text-[11px] leading-relaxed text-stone-500 lg:text-left sm:text-xs">
                    Browse photos for close-ups, bead texture, and size reference before you buy.
                  </p>
                ) : null}
                <ProductBelowGalleryMedia
                  videoUrl={product.video_url}
                  posterUrl={product.images?.[0]}
                  productName={product.name}
                  className="hidden lg:block"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6 min-w-0">
            {/* Product Name with Share & Like (wishlist) */}
            <div className="flex items-start justify-between gap-3 sm:gap-4 min-w-0">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex-1 min-w-0 break-words pr-1">
                {product.name}
              </h1>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pt-0.5">
                <button
                  type="button"
                  onClick={handleShareProduct}
                  className="inline-flex flex-col items-center gap-0.5 rounded-xl border border-stone-200 bg-white px-2.5 py-2 sm:px-3 sm:py-2.5 text-stone-600 shadow-sm transition-colors hover:border-primary/30 hover:bg-stone-50 hover:text-primary touch-manipulation min-w-12"
                  aria-label="Share product"
                  title="Share"
                >
                  <FaShareAlt className="text-lg sm:text-xl" aria-hidden />
                  <span className="text-[10px] sm:text-xs font-semibold leading-none">Share</span>
                </button>
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className="inline-flex flex-col items-center gap-0.5 rounded-xl border border-stone-200 bg-white px-2.5 py-2 sm:px-3 sm:py-2.5 text-primary shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 touch-manipulation min-w-12"
                  aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  title={isInWishlist(product.id) ? "Saved" : "Like / Save"}
                >
                  {isInWishlist(product.id) ? (
                    <FaHeart className="text-lg sm:text-xl fill-primary" aria-hidden />
                  ) : (
                    <FaRegHeart className="text-lg sm:text-xl" aria-hidden />
                  )}
                  <span className="text-[10px] sm:text-xs font-semibold leading-none">Like</span>
                </button>
              </div>
            </div>

            {/* Star Rating and Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className="text-primary text-base sm:text-lg fill-current"
                  />
                ))}
              </div>
              <span className="text-sm sm:text-base text-gray-600 font-medium">
                {reviewCount} Reviews
              </span>
            </div>

            {/* Pricing – wraps on very small screens */}
            <div className="space-y-2 pb-2 border-b border-gray-200 min-w-0">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <span className="text-2xl sm:text-4xl font-bold text-primary">
                  ₹
                  {pricing.currentPrice.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </span>
                {pricing.discount > 0 && (
                  <>
                    <span className="text-lg sm:text-xl text-gray-400 line-through font-medium">
                      ₹
                      {pricing.originalPrice.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs sm:text-sm font-bold rounded">
                      {pricing.discount}% OFF
                    </span>
                  </>
                )}
              </div>
              {pricing.discount > 0 && (
                <p className="text-sm sm:text-base text-gray-600">
                  You save ₹
                  {(pricing.originalPrice - pricing.currentPrice).toLocaleString(
                    "en-IN",
                    { maximumFractionDigits: 0 }
                  )}
                </p>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.subcategory && (
                <span className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-md text-xs sm:text-sm font-semibold">
                  {product.subcategory}
                </span>
              )}
              {product.deity && (
                <span className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-md text-xs sm:text-sm font-semibold">
                  {product.deity}
                </span>
              )}
              {product.planet && (
                <span className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-md text-xs sm:text-sm font-semibold">
                  {product.planet}
                </span>
              )}
              {product.rarity && (
                <span className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-xs sm:text-sm font-semibold">
                  {product.rarity}
                </span>
              )}
            </div>

            {/* Measurements (product_measure_value + product_measure_unit) */}
            {Array.isArray(product.measures) && product.measures.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 px-3 py-2 bg-gray-50 border-b border-gray-200">
                  Measurements
                </p>
                <div className="divide-y divide-gray-100">
                  {product.measures.map((m, idx) => (
                    <div
                      key={`${m.unit_name || ''}-${m.value || ''}-${idx}`}
                      className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                    >
                      <span className="text-gray-600 shrink-0">
                        {(m.unit_name || "Unit").trim() || "Unit"}
                      </span>
                      <span className="font-semibold text-gray-900 text-right tabular-nums">
                        {(m.value != null ? String(m.value) : "").trim() || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended for Rashis (Rudraksha only) */}
            {isRudraksha && recommendedRashis.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 py-2">
                <span className="text-sm font-semibold text-gray-700">Recommended for:</span>
                <div className="flex flex-wrap gap-1.5">
                  {recommendedRashis.map((r) => (
                    <span
                      key={r}
                      className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/30 rounded-md text-xs font-semibold"
                    >
                      {r}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">(by Rashi)</span>
              </div>
            )}

            {/* Short Description */}
            {product.short_description && (
              <div className="pb-2">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">
                  {product.short_description}
                </p>
              </div>
            )}

            <ProductStoryBlock product={product} stockStatus={stockStatus} />

            {/* Quantity Selector + Stock – responsive: wrap on mobile */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <label className="text-sm sm:text-base font-semibold text-gray-700 w-full sm:w-auto">
                Quantity:
              </label>
              <div className="flex items-center border-2 border-primary rounded-lg shrink-0">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-3 sm:px-4 py-2.5 sm:py-2 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[44px] sm:min-h-0"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 sm:px-6 py-2 text-base sm:text-lg font-semibold text-gray-900 min-w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={!canPurchase || quantity >= maxOrderQty}
                  className="px-3 sm:px-4 py-2.5 sm:py-2 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[44px] sm:min-h-0"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {/* Stock Status */}
              <div className="w-full sm:w-auto">
                {isPreorder ? (
                  <span className="inline-flex items-center text-sm sm:text-base font-semibold text-amber-800">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 shrink-0"></span>
                    {product.stock > 0
                      ? `Pre-order: ${product.stock} available now`
                      : 'Pre-order: ships when ready'}
                  </span>
                ) : stockStatus.kind !== 'out' ? (
                  <span className={`inline-flex items-center text-sm sm:text-base font-semibold ${
                    stockStatus.kind === 'low' ? 'text-amber-700' : 'text-primary'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 shrink-0 ${
                      stockStatus.kind === 'low' ? 'bg-amber-500' : 'bg-primary'
                    }`}></span>
                    {stockStatus.kind === 'low'
                      ? getStockLabel(stockStatus)
                      : `In Stock (${stockStatus.stock} available)`}
                  </span>
                ) : (
                  <span className="inline-flex items-center text-sm sm:text-base font-semibold text-red-600">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 shrink-0"></span>
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Optional blessing add-on (only for Rudraksha) */}
            {isRudraksha && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-4">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeBlessing}
                    onChange={(e) => setIncludeBlessing(e.target.checked)}
                    className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 accent-primary shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-gray-900">
                      Add Special Blessing Service - shuddhi/pran pratishtha (+₹{OPTIONAL_BLESSING_CHARGE})
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      If selected, ₹{OPTIONAL_BLESSING_CHARGE} will be added to your final bill.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Buy Now (primary) + Add to Cart (secondary) */}
            <div className="flex flex-col gap-2.5 pt-2 sm:gap-3">
              <button
                onClick={handleBuyNow}
                disabled={!canPurchase}
                className="w-full px-6 py-4 min-h-[52px] bg-primary text-white rounded-xl hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-bold text-lg sm:text-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl touch-manipulation ring-2 ring-primary/20"
              >
                <span>{isPreorder ? "Preorder Now" : "Buy Now"}</span>
                {!isPreorder ? <FaChevronRight className="text-base opacity-90 sm:text-lg" aria-hidden /> : null}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!canPurchase}
                className="w-full px-6 py-3 min-h-[44px] border-2 border-primary/40 bg-white text-primary rounded-xl hover:bg-primary/5 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-base flex items-center justify-center gap-2 touch-manipulation"
              >
                <FaShoppingCart className="text-lg shrink-0" />
                <span>{canPurchase ? "Add to Cart" : "Out of Stock"}</span>
              </button>
              {!isPreorder ? <PaymentTrustBadges compact className="pt-0.5" /> : null}
            </div>

            <div ref={ctaAnchorRef} className="h-px w-full" aria-hidden />

            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs text-stone-500 sm:justify-start">
              <span className="inline-flex items-center gap-1">
                <FaTruck className="text-primary" aria-hidden />
                Dispatch in 3–7 days
              </span>
              <span className="hidden sm:inline text-stone-300" aria-hidden>|</span>
              <span className="inline-flex items-center gap-1">
                <FaShieldAlt className="text-primary" aria-hidden />
                Secure checkout
              </span>
            </p>
            <ProductLabCertificateBlock />


            <ProductBelowGalleryMedia
              videoUrl={product.video_url}
              posterUrl={product.images?.[0]}
              productName={product.name}
              className="lg:hidden"
            />

            {/* Accordion */}
            <div className="pt-2">
              <section>
                  {[
                    {
                      key: "description",
                      title: "Description",
                      content: product.description || product.short_description || "No detailed description available for this product.",
                    },
                    {
                      key: "benefits",
                      title: "Benefits",
                      content: product.benefits || "This product is traditionally valued for its spiritual and wellness benefits. Use as per your belief and practice.",
                    },
                    {
                      key: "elements",
                      title: "Elements",
                      content:
                        String(product.elements ?? "").trim() ||
                        "No element information available for this product.",
                    },
                    ...(isComboProduct
                      ? [
                          {
                            key: "who_can_use",
                            title: "Who Can Use It",
                            content:
                              product.who_can_use?.trim() ||
                              "No who-can-use information available for this combo.",
                          },
                        ]
                      : []),
                    {
                      key: "care",
                      title: "Care Information",
                      content: (
                        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-700 leading-relaxed">
                          <li>
                            Keep away from water, dishwashing soap, lotions, perfumes, silver
                            cleaners, and harsh chemicals.
                          </li>
                          <li>Remove before swimming, bathing, or exercising.</li>
                          <li>
                            Store separately in a zip lock bag to prevent moisture and tarnishing.
                          </li>
                        </ul>
                      ),
                    },
                  ].map(({ key, title, icon, content }) => (
                    <div key={key} className="border-b border-gray-100 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => toggleAccordion(key)}
                        className="w-full flex items-center justify-between gap-3 py-3.5 sm:py-4 min-h-[48px] sm:min-h-0 text-left font-bold text-gray-900 hover:text-primary transition-colors touch-manipulation text-sm sm:text-base"
                        aria-expanded={accordionOpen.has(key)}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="text-lg sm:text-xl shrink-0" aria-hidden>{icon}</span>
                          <span className="truncate">{title}</span>
                        </span>
                        <FaChevronDown
                          className={`text-primary shrink-0 transition-transform duration-200 ${accordionOpen.has(key) ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                      {accordionOpen.has(key) && (
                        <div className="pb-4 sm:pb-5 pt-0 pl-8 pr-0 min-w-0 max-w-full overflow-hidden">
                          {typeof content === "string" ? (
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line break-words [overflow-wrap:anywhere]">
                              {content}
                            </p>
                          ) : (
                            content
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </section>
            </div>

            {isRudrakshaProduct ? (
              <Link
                to="/rashi"
                className="mt-3 flex items-center gap-3 rounded-2xl border border-primary/30 bg-linear-to-r from-primary/8 to-primary/5 px-4 py-3.5 shadow-sm transition-all hover:border-primary/45 hover:from-primary/12 hover:to-primary/8 hover:shadow-md active:scale-[0.99]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/20">
                  <FaCompass className="text-lg" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-stone-900 sm:text-base">
                    Find your Rashi
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-stone-600 sm:text-sm">
                    Not sure which mukhi? Match your sign and choose with confidence.
                  </span>
                </span>
                <FaChevronRight className="shrink-0 text-primary text-sm sm:text-base" aria-hidden />
              </Link>
            ) : null}

          </div>
        </div>

        {isRudrakshaProduct && (
          <div className="mt-4 sm:mt-6">
            <img
              src={idrImage}
              alt="IDR information"
              loading="lazy"
              decoding="async"
              className="block w-full rounded-lg border-2 border-primary/40 shadow-sm"
            />
          </div>
        )}

        {/* Reviews Section – match provided design */}
        <section className="mt-6 sm:mt-12 min-w-0">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header: Reviews title */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 px-4 sm:px-6 pt-4 sm:pt-6 pb-4">
              Reviews
            </h2>

            {/* Summary row: avg rating + distribution + Click to review */}
            <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 pb-6 border-b border-gray-100">
              {/* Left: Average rating + star distribution */}
              <div className="flex flex-col sm:flex-row gap-6 flex-1 min-w-0">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-primary">
                        {i < avgRatingFull ? (
                          <FaStar className="text-xl sm:text-2xl fill-current inline" />
                        ) : i === avgRatingFull && avgRatingHalf ? (
                          <FaStarHalfAlt className="text-xl sm:text-2xl fill-current inline" />
                        ) : (
                          <FaRegStar className="text-xl sm:text-2xl inline" />
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm sm:text-base">{totalReviews} reviews</span>
                </div>
                <div className="flex-1 min-w-0 w-full sm:max-w-xs">
                  {ratingDistribution.map(({ star, count }) => (
                    <div key={star} className="flex items-center gap-2 py-0.5">
                      <span className="text-gray-700 text-sm w-8 shrink-0">{star}★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden min-w-0">
                        <div
                          className="h-full bg-gray-600 rounded-full transition-all"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-600 text-sm w-8 sm:w-10 text-right shrink-0">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right: Click to review */}
              <div className="flex flex-col items-start lg:items-end shrink-0">
                <button
                  type="button"
                  onClick={handleReviewFormToggle}
                  className="text-gray-900 font-semibold text-sm sm:text-base mb-2 hover:text-primary transition-colors"
                >
                  Click to review
                </button>
                <div className="flex gap-0.5 cursor-pointer" onClick={handleReviewFormToggle} aria-hidden>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaRegStar
                      key={star}
                      className="text-xl sm:text-2xl text-gray-400 hover:text-primary transition-colors"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Write a review form (collapsible) */}
            {showReviewForm && (
              <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-100">
                <form onSubmit={handleSubmitReview} className="space-y-3 sm:space-y-4 max-w-xl">
                  <div className="min-w-0">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Your name</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full min-w-0 px-3 sm:px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-0.5 sm:gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setReviewHover(star)}
                          onMouseLeave={() => setReviewHover(0)}
                          className="p-2 sm:p-1 focus:outline-none touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center -m-1 sm:m-0"
                          aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        >
                          <FaStar
                            className={`text-2xl transition-colors ${
                              star <= (reviewHover || reviewRating) ? "text-primary fill-primary" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Your review</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      className="w-full min-w-0 px-3 sm:px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-y"
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                      Upload product image (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleReviewImageChange}
                      className="w-full min-w-0 px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-primary file:font-medium"
                    />
                    <p className="mt-1 text-xs text-gray-500">JPG, PNG, WEBP (max 5MB)</p>
                    {reviewImagePreview && (
                      <div className="mt-3 flex items-start gap-3">
                        <img
                          src={reviewImagePreview}
                          alt="Review upload preview"
                          className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                        />
                        <button
                          type="button"
                          onClick={clearReviewImage}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                          Remove image
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors touch-manipulation min-h-[48px] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {reviewSubmitting ? "Submitting…" : "Submit review"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false);
                        clearReviewImage();
                      }}
                      className="px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Toolbar: Sort, per page, pagination */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <select
                  value={reviewSort}
                  onChange={(e) => { setReviewSort(e.target.value); setReviewPage(1); }}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none min-w-0"
                >
                  <option value="recent">Recent</option>
                  <option value="highest">Highest rated</option>
                  <option value="lowest">Lowest rated</option>
                </select>
                <select
                  value={reviewPerPage}
                  onChange={(e) => { setReviewPerPage(Number(e.target.value)); setReviewPage(1); }}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none min-w-0"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                  disabled={reviewPage <= 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <FaChevronLeft className="text-sm" />
                </button>
                <span className="text-sm text-gray-700 min-w-[4rem] text-center">Page {reviewPage}</span>
                <button
                  type="button"
                  onClick={() => setReviewPage((p) => Math.min(totalPages, p + 1))}
                  disabled={reviewPage >= totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            </div>

            {/* Review cards grid */}
            <div className="p-4 sm:p-6">
              {reviewsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader size="md" />
                </div>
              ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 [column-gap:1rem] sm:[column-gap:1.25rem]">
                  {paginatedReviews.map((review) => (
                    <div
                      key={review.id}
                      className="mb-4 break-inside-avoid bg-white border border-gray-200 rounded-xl p-4 shadow-sm min-w-0 overflow-hidden relative"
                    >
                      {review.user_id && userId === review.user_id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(review.id, review.user_id)}
                          disabled={reviewDeletingId === review.id}
                          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          aria-label="Delete review"
                        >
                          <FaTrashAlt className="text-sm" />
                        </button>
                      )}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <div className="flex items-center gap-0.5 shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`text-sm ${
                                i < review.rating ? "text-primary fill-primary" : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-500 text-xs sm:text-sm">{review.date}</span>
                      </div>
                      {review.imageUrl && (
                        <div className="mb-3 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={review.imageUrl}
                            alt="Review"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      )}
                      <p className="font-bold text-gray-900 text-sm sm:text-base mb-1 break-words">{review.name}</p>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs text-gray-500">🇮🇳</span>
                        {review.pendingApproval ? (
                          <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-amber-700 font-medium">
                            Pending approval
                          </span>
                        ) : review.verified ? (
                          <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-green-600 font-medium">
                            <FaCheckCircle className="shrink-0" />
                            Verified
                          </span>
                        ) : null}
                      </div>
                      <p className="text-gray-700 text-xs sm:text-base leading-relaxed break-words">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-8 sm:mt-16 pt-6 sm:pt-12 border-t border-gray-200 min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              You may also like
            </h2>
            {relatedLoading ? (
              <div className="flex justify-center py-8 sm:py-12">
                <Loader size="md" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    variant="default"
                    calculatePricing={pricingFromProduct}
                    getReviewCount={getCardReviewCount}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cartItems={cartItems}
        totalAmount={calculateTotalAmount()}
        blessingCharge={isRudraksha ? blessingCharge : 0}
        userId={userId}
        userPhone={user?.phone_number}
        userName={user?.full_name}
      />

      <PreorderEmailModal
        isOpen={showPreorderModal}
        onClose={() => setShowPreorderModal(false)}
        onSubmit={handlePreorderSubmit}
        loading={preorderSubmitting}
        defaultEmail={preorderEmail}
        productName={product?.name}
      />

      {/* Full-screen image preview */}
      {imagePreviewOpen && product.images && product.images.length > 0 && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-white p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Product image preview"
          onClick={() => setImagePreviewOpen(false)}
        >
          <button
            type="button"
            onClick={() => setImagePreviewOpen(false)}
            className="absolute right-3 top-3 z-[202] flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-800 transition-colors hover:bg-gray-100 touch-manipulation"
            aria-label="Close preview"
          >
            <FaTimes className="text-xl" />
          </button>
          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 z-[202] -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-800 transition-colors hover:bg-gray-100 sm:left-4 sm:h-12 sm:w-12 touch-manipulation"
                aria-label="Previous image"
              >
                <FaChevronLeft className="text-lg sm:text-xl" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 z-[202] -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-800 transition-colors hover:bg-gray-100 sm:right-4 sm:h-12 sm:w-12 touch-manipulation"
                aria-label="Next image"
              >
                <FaChevronRight className="text-lg sm:text-xl" />
              </button>
            </>
          )}
          <div
            className="relative z-[201] max-h-[90vh] max-w-[min(1200px,calc(100vw-2rem))]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={product.images[selectedImageIndex]}
              alt={`${product.name} — enlarged`}
              className="max-h-[90vh] w-auto max-w-full object-contain"
              decoding="async"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/800x800?text=No+Image";
              }}
            />
          </div>
        </div>
      )}

      <ProductStickyCtaBar
        visible={showStickyCta}
        productName={product.name}
        price={pricing.currentPrice}
        canPurchase={canPurchase}
        isPreorder={isPreorder}
        onBuyNow={handleBuyNow}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default ProductPage;
