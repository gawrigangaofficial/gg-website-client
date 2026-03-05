import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  FaUndo,
  FaCertificate,
  FaCompass,
  FaCheckCircle,
  FaTrashAlt,
  FaRocket,
} from "react-icons/fa";
import Loader from "../../components/Loader";
import { useToast } from "../../components/Toaster";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import ProductCard from "../../components/ProductCard";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, userId, loading: authLoading } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [elementImages, setElementImages] = useState([]);
  const [benefitImages, setBenefitImages] = useState([]);
  const [staticImagesLoading, setStaticImagesLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(() => new Set(["description"])); // Set of open keys
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [userReviews, setUserReviews] = useState([]);
  const [reviewSort, setReviewSort] = useState("recent");
  const [reviewPerPage, setReviewPerPage] = useState(10);
  const [reviewPage, setReviewPage] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewDeletingId, setReviewDeletingId] = useState(null);

  // In dev, use same origin so Vite proxy can forward /api to the backend
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "" : "http://localhost:3001");

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
    ? Math.round((allReviews.reduce((s, r) => s + r.rating, 0) / totalReviews) * 10) / 10
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

  const SUPABASE_STORAGE_BASE = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
  const buildStaticImgUrl = (folder, file_name) =>
    SUPABASE_STORAGE_BASE
      ? `${SUPABASE_STORAGE_BASE}/storage/v1/object/public/GGIMG/StaticImg/${encodeURIComponent(folder)}/${encodeURIComponent(file_name)}`
      : null;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Fetch reviews for this product
  useEffect(() => {
    if (!product?.id) return;
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/reviews/product/${product.id}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setReviews(json.data);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [product?.id, API_URL]);

  // Fetch Elements and Benifits static images when product is loaded (for rudraksha matching)
  useEffect(() => {
    if (!product) return;

    const fetchStaticImages = async () => {
      setStaticImagesLoading(true);
      try {
        const [elementsRes, benefitsRes] = await Promise.all([
          fetch(`${API_URL}/api/static-images?folder=Elements`),
          fetch(`${API_URL}/api/static-images?folder=Benifits`),
        ]);
        const elementsData = elementsRes.ok ? await elementsRes.json() : [];
        const benefitsData = benefitsRes.ok ? await benefitsRes.json() : [];

        const withUrls = (items) =>
          (items || []).map((item) => ({
            ...item,
            url: item.url || buildStaticImgUrl(item.folder, item.file_name),
          }));

        setElementImages(withUrls(elementsData));
        setBenefitImages(withUrls(benefitsData));
      } catch (err) {
        console.error("Error fetching element/benefit images:", err);
      } finally {
        setStaticImagesLoading(false);
      }
    };

    fetchStaticImages();
  }, [product?.id, API_URL]);

  // Fetch related products (same category, exclude current)
  useEffect(() => {
    if (!product?.category) return;

    const fetchRelated = async () => {
      setRelatedLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/api/products?category=${encodeURIComponent(product.category)}`
        );
        const result = res.ok ? await res.json() : { data: [] };
        const list = result.success && result.data ? result.data : [];
        const related = list
          .filter((p) => p.id !== product.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        console.error("Error fetching related products:", err);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelated();
  }, [product?.id, product?.category, API_URL]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/products/${id}`);

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
        setProduct(result.data);
        // Reset image index when product changes
        setSelectedImageIndex(0);
      } else {
        setError("Failed to load product");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = (price) => {
    const discountPercent = 25;
    const originalPrice = price / (1 - discountPercent / 100);
    return {
      currentPrice: price,
      originalPrice: originalPrice,
      discount: discountPercent,
    };
  };

  const getReviewCount = (productId) => {
    return 5 + (productId % 3);
  };

  const handlePreorder = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to preorder. Go to cart and click "Notify Me" when ready!`);
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
      const res = await fetch(`${API_URL}/api/reviews/product/${product.id}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setReviews(json.data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!product?.id) return;
    if (!reviewName.trim() || !reviewComment.trim() || reviewRating < 1) {
      toast.error("Please fill name, comment and select a rating.");
      return;
    }
    setReviewSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          user_id: userId || null,
          reviewer_name: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setReviewName("");
        setReviewComment("");
        setReviewRating(0);
        setShowReviewForm(false);
        setReviewPage(1);
        await fetchReviewsForProduct();
        toast.success("Thank you! Your review has been submitted.");
      } else {
        toast.error(json.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Submit review:", err);
      toast.error("Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId, reviewUserId) => {
    if (!userId || reviewUserId !== userId) return;
    setReviewDeletingId(reviewId);
    try {
      const res = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchReviewsForProduct();
        toast.success("Review deleted.");
      } else {
        toast.error(json.message || "Failed to delete review.");
      }
    } catch (err) {
      console.error("Delete review:", err);
      toast.error("Failed to delete review.");
    } finally {
      setReviewDeletingId(null);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (newQuantity > (product?.stock || 1)) return product?.stock || 1;
      return newQuantity;
    });
  };

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

  const pricing = calculatePricing(product.price);
  const reviewCount = getReviewCount(product.id);
  const hasMultipleImages = product.images && product.images.length > 1;

  // Derive possible keys to match rudraksha with element/benefit images (e.g. "1 Mukhi" or "1")
  const getMatchKeys = () => {
    const keys = [];
    const sub = (product.subcategory || "").trim();
    const name = (product.name || "").trim();
    if (sub) keys.push(sub, sub.toLowerCase());
    const numMatch = (sub || name).match(/^(\d+)|(\d+)\s*[Mm]ukhi|(\d+)\s*[Ee]lement/);
    const num = numMatch && (numMatch[1] || numMatch[2] || numMatch[3]);
    if (num) keys.push(num, `${num}E`);
    return keys;
  };

  const matchKeys = getMatchKeys();
  const matchedElementImage = elementImages.find((img) =>
    matchKeys.some((k) => String(img.key).toLowerCase() === String(k).toLowerCase())
  );
  const matchedBenefitImage = benefitImages.find((img) =>
    matchKeys.some((k) => String(img.key).toLowerCase() === String(k).toLowerCase())
  );
  const showElementOrBenefit = Boolean(matchedElementImage || matchedBenefitImage);

  // For Rudraksha: which Rashis recommend this product (by matching mukhi in subcategory/name)
  const isRudraksha = product.category === "Rudraksha" || product.category === "Rudrakshas";
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
    <div className="min-h-screen py-4 sm:py-6 lg:py-8 bg-linear-to-br from-orange-50/30 to-white overflow-x-hidden">
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
                      className={`w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 touch-manipulation ${
                        selectedImageIndex === index
                          ? "border-primary ring-2 ring-primary/50"
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150x150?text=No+Image";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image + Element & Benefits – same width (flex-1), same box style */}
              <div className="flex-1 flex flex-col gap-4 sm:gap-6 min-w-0 order-2">
                {/* Main Image */}
                <div className="relative aspect-[4/3] max-h-[280px] sm:max-h-[400px] md:max-h-[550px] lg:max-h-[700px] w-full min-w-0 bg-gray-100 rounded-xl overflow-hidden border-2 border-primary/20 group">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <img
                        src={product.images[selectedImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/600x600?text=No+Image";
                        }}
                      />
                      {/* Image Navigation Arrows */}
                      {hasMultipleImages && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-2 rounded-full transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
                            aria-label="Previous image"
                          >
                            <FaChevronLeft className="text-sm sm:text-base" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-2 rounded-full transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
                            aria-label="Next image"
                          >
                            <FaChevronRight className="text-sm sm:text-base" />
                          </button>
                        </>
                      )}
                      {/* Discount Badge */}
                      <div className="absolute top-3 right-3 bg-black text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded shadow-lg">
                        {pricing.discount}% OFF
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-lg">No Image Available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6 min-w-0">
            {/* Product Name with Wishlist */}
            <div className="flex items-start justify-between gap-3 sm:gap-4 min-w-0">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex-1 min-w-0 break-words pr-1">
                {product.name}
              </h1>
              <button
                onClick={handleWishlistToggle}
                className="p-2 sm:p-3 transition-all hover:scale-110 shrink-0"
                aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isInWishlist(product.id) ? (
                  <FaHeart className="text-2xl sm:text-3xl text-primary fill-primary" />
                ) : (
                  <FaRegHeart className="text-2xl sm:text-3xl text-primary hover:text-primary/80" />
                )}
              </button>
            </div>

            {/* Launching soon – preorder CTA */}
            <div className="mb-4 p-3 sm:p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-sm sm:text-base font-semibold text-primary flex items-center gap-2">
                <FaRocket className="shrink-0" />
                We&apos;re launching very soon! Preorder now and we&apos;ll email you when we&apos;re live so you can buy.
              </p>
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
                <span className="text-lg sm:text-xl text-gray-400 line-through font-medium">
                  ₹
                  {pricing.originalPrice.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs sm:text-sm font-bold rounded">
                  {pricing.discount}% OFF
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                You save ₹
                {(pricing.originalPrice - pricing.currentPrice).toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 0 }
                )}
              </p>
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
              <div className="pb-4 border-b border-gray-200">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  {product.short_description}
                </p>
              </div>
            )}

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
                  disabled={quantity >= product.stock}
                  className="px-3 sm:px-4 py-2.5 sm:py-2 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[44px] sm:min-h-0"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {/* Stock Status */}
              <div className="w-full sm:w-auto">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center text-sm sm:text-base font-semibold text-primary">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2 shrink-0"></span>
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center text-sm sm:text-base font-semibold text-red-600">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 shrink-0"></span>
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Preorder button – adds to cart; user can then click Notify Me in cart */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handlePreorder}
                className="w-full sm:flex-1 px-6 py-4 min-h-[48px] sm:min-h-0 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl touch-manipulation"
              >
                <FaShoppingCart className="text-xl shrink-0" />
                <span>Preorder</span>
              </button>
            </div>

            {/* Trust / Delivery info – 2 per line on mobile, 4 cols on sm+ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 py-3 sm:py-4 border-y border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700 min-w-0 overflow-hidden">
                <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 text-primary shrink-0">
                  <FaTruck className="text-xs sm:text-lg" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="font-semibold text-[11px] sm:text-sm truncate">Free Delivery</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate">On orders above ₹999</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700 min-w-0 overflow-hidden">
                <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 text-primary shrink-0">
                  <FaShieldAlt className="text-xs sm:text-lg" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="font-semibold text-[11px] sm:text-sm truncate">Secure Payment</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate">100% secure</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700 min-w-0 overflow-hidden">
                <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 text-primary shrink-0">
                  <FaUndo className="text-xs sm:text-lg" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="font-semibold text-[11px] sm:text-sm truncate">Easy Returns</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate">Hassle-free</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-gray-700 min-w-0 overflow-hidden">
                <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 text-primary shrink-0">
                  <FaCertificate className="text-xs sm:text-lg" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="font-semibold text-[11px] sm:text-sm truncate">Certified</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate">Authentic</p>
                </div>
              </div>
            </div>

            {/* Check your Rashi – CTA: stacked on mobile, row on sm+ */}
            <Link
              to="/rashi"
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-5 rounded-xl border-2 border-primary/30 bg-linear-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 hover:border-primary/50 transition-all group min-w-0 active:opacity-90"
            >
              <div className="flex items-center gap-3 sm:contents min-w-0">
                <div className="p-2.5 sm:p-3 rounded-full bg-primary/20 text-primary shrink-0 group-hover:scale-105 transition-transform">
                  <FaCompass className="text-xl sm:text-3xl" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-lg mb-0.5 break-words">
                    Find your Rashi & choose the right Rudraksha
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block break-words">
                    Not sure which Rudraksha suits you? Check your Rashi (zodiac sign) and get personalized recommendations to buy the best Rudraksha for you.
                  </p>
                </div>
              </div>
              <span className="text-primary font-semibold text-sm sm:text-base shrink-0 group-hover:underline self-start sm:self-auto">
                Check Rashi →
              </span>
            </Link>

            {/* Accordion – under Check Rashi */}
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
                      content: (
                        <div className="space-y-3 min-w-0 max-w-full">
                          {matchedElementImage ? (
                            <div className="flex flex-col sm:flex-row gap-4 items-start min-w-0">
                              <img
                                src={matchedElementImage.url}
                                alt="Element"
                                className="w-full sm:w-40 h-40 object-contain rounded-lg border border-gray-200 bg-gray-50 shrink-0"
                              />
                              <p className="text-gray-700 flex-1 min-w-0 break-words">
                                This product is associated with natural elements and traditional symbolism. The element representation above reflects its spiritual significance.
                              </p>
                            </div>
                          ) : (
                            <p className="text-gray-700 break-words min-w-0">
                              Elements and natural associations for this product are part of traditional knowledge. This item carries the essence of natural, sacred materials.
                            </p>
                          )}
                        </div>
                      ),
                    },
                    {
                      key: "other",
                      title: "Other Information",
                      content: (
                        <div className="grid gap-2 text-sm sm:text-base text-gray-700 min-w-0 max-w-full break-words">
                          {product.subcategory && <p><span className="font-semibold text-gray-900">Subcategory:</span> {product.subcategory}</p>}
                          {product.deity && <p><span className="font-semibold text-gray-900">Deity:</span> {product.deity}</p>}
                          {product.planet && <p><span className="font-semibold text-gray-900">Planet:</span> {product.planet}</p>}
                          {product.rarity && <p><span className="font-semibold text-gray-900">Rarity:</span> {product.rarity}</p>}
                          {product.category && <p><span className="font-semibold text-gray-900">Category:</span> {product.category}</p>}
                          {!product.subcategory && !product.deity && !product.planet && !product.rarity && (
                            <p>No additional information available.</p>
                          )}
                        </div>
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
          </div>
        </div>

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
                  onClick={() => setShowReviewForm((v) => !v)}
                  className="text-gray-900 font-semibold text-sm sm:text-base mb-2 hover:text-primary transition-colors"
                >
                  Click to review
                </button>
                <div className="flex gap-0.5 cursor-pointer" onClick={() => setShowReviewForm(true)} aria-hidden>
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
                      onClick={() => setShowReviewForm(false)}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {paginatedReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm min-w-0 overflow-hidden flex flex-col relative"
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
                        <div className="mb-3 rounded-lg overflow-hidden aspect-square max-h-40 bg-gray-100">
                          <img
                            src={review.imageUrl}
                            alt="Review"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <p className="font-bold text-gray-900 text-sm sm:text-base mb-1 break-words">{review.name}</p>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs text-gray-500">🇮🇳</span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-green-600 font-medium">
                            <FaCheckCircle className="shrink-0" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 text-xs sm:text-base leading-relaxed break-words mt-auto">
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
                    calculatePricing={calculatePricing}
                    getReviewCount={getReviewCount}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

    </div>
  );
};

export default ProductPage;
