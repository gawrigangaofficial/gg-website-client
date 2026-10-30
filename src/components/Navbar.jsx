import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaRegHeart, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { CgShoppingBag } from "react-icons/cg";
import { GiPrayerBeads } from "react-icons/gi";
import logo from "../assets/gglogo.svg";
import mobileIcon from "../assets/icon-m.png";
import {
  LuCircleUserRound,
  LuGem,
  LuHouse,
  LuLayoutGrid,
  LuLeaf,
  LuSearch,
  LuSparkles,
} from "react-icons/lu";
import { apiFetch } from "../config/api";
// TEMP: WhatsApp hidden — re-enable when ready
// import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

// const WHATSAPP_NUMBER = String(import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");

// TEMP: WhatsApp hidden — re-enable when ready
/*
function getWhatsAppNumber() {
  return WHATSAPP_NUMBER || "919717568740";
}

function getWhatsAppHref(message = "Hi, I need help choosing the right Rudraksha.") {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
}
*/

const ACCESSORY_TYPE_LINKS = [
  {
    label: "Mala",
    to: `/accessories?subcategory=${encodeURIComponent("Mala")}`,
  },
  {
    label: "Bracelet",
    to: `/accessories?subcategory=${encodeURIComponent("Bracelet")}`,
  },
  {
    label: "Necklace",
    to: `/accessories?subcategory=${encodeURIComponent("Necklace")}`,
  },
  {
    label: "Earring",
    to: `/accessories?subcategory=${encodeURIComponent("Earring")}`,
  },
  {
    label: "Ring",
    to: `/accessories?subcategory=${encodeURIComponent("Ring")}`,
  },
  {
    label: "Other",
    to: `/accessories?subcategory=${encodeURIComponent("Other")}`,
  },
];
const TULSI_MALA_LINKS = [
  { label: "Mala", to: `/tulsimala?subcategory=${encodeURIComponent("Mala")}` },
  {
    label: "Necklace",
    to: `/tulsimala?subcategory=${encodeURIComponent("Necklace")}`,
  },
  {
    label: "Bracelet",
    to: `/tulsimala?subcategory=${encodeURIComponent("Bracelet")}`,
  },
];

const MUKHI_NAV_LINKS = Array.from({ length: 14 }, (_, i) => {
  const label = `${i + 1} Mukhi`;
  return {  
    label,
    to: `/product/${i+1}-mukhi-rudraksha`,
  };
});

/** Desktop mega-menu: high contrast panel + clear sections */
const megaPanel =
  "overflow-hidden rounded-2xl border border-gray-200/95 bg-white shadow-[0_22px_56px_-14px_rgba(15,23,42,0.28)] ring-1 ring-gray-950/[0.06]";
const megaHero =
  "mx-3 my-3 block rounded-xl bg-primary/12 px-4 py-3 text-center text-sm font-bold text-primary shadow-sm ring-1 ring-primary/15 transition-colors hover:bg-primary/18";
const megaSectionTitle =
  "mb-2.5 px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500";
const megaListLink =
  "block rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-primary/10 hover:text-primary";
const megaGridLink =
  "flex min-h-[2.75rem] items-center justify-center rounded-xl border border-gray-100 bg-gray-50/95 px-2 text-sm font-semibold text-gray-800 shadow-sm transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-md";
const desktopPill =
  "gg-desk-pill inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-[15px] font-semibold text-stone-700 transition-colors hover:bg-orange-50 hover:text-primary";
const desktopPillActive =
  "gg-desk-pill-active inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-[15px] font-semibold text-white";

const BOTTOM_NAV_ITEMS = [
  { name: "Home", href: "/", icon: LuHouse },
  { name: "Accessories", href: "/accessories", icon: LuGem },
  { name: "Search", action: "search", icon: LuSearch },
  { name: "Rudraksha", href: "/rudraksha", icon: GiPrayerBeads },
  { name: "Sprays", href: "/sprays", icon: LuSparkles },
];

const MOBILE_CHIPS = [
  { name: "All", href: "/", icon: LuLayoutGrid },
  { name: "Diwali", href: "/#diwali-offers", icon: LuSparkles },
  { name: "Rudraksha", href: "/rudraksha", icon: GiPrayerBeads },
  { name: "Tulsi", href: "/tulsimala", icon: LuLeaf },
  { name: "Sprays", href: "/sprays", icon: LuSparkles },
];

const mobileIconBtn =
  "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10 active:bg-primary/15";

function MobileSearchPanel({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiFetch(
          `/api/products?search=${encodeURIComponent(q)}&limit=8`,
          { signal: ctrl.signal },
        );
        const json = await res.json();
        if (!ctrl.signal.aborted) setResults(Array.isArray(json?.data) ? json.data : []);
      } catch (error) {
        if (error?.name !== "AbortError" && !ctrl.signal.aborted) setResults([]);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [query]);

  return (
    <div className="mobile-search-panel border-t border-[#E9DFC4] bg-white md:hidden">
      <form
        className="sticky top-0 z-10 border-b border-[#E9DFC4] bg-white px-3 py-3"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <LuSearch
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-primary"
            aria-hidden
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rudraksha, malas, sprays..."
            className="h-11 w-full rounded-full border border-[#E9DFC4] bg-[#FFFAEB] pl-10 pr-4 text-sm text-stone-800 outline-none ring-primary/30 placeholder:text-stone-400 focus:ring-2"
          />
        </label>
      </form>
      <div className="px-3 py-2">
        {query.trim().length < 2 ? (
          <p className="px-1 py-6 text-center text-sm text-stone-500">
            Type at least 2 letters to search the store.
          </p>
        ) : loading ? (
          <p className="px-1 py-6 text-center text-sm text-stone-500">Searching...</p>
        ) : results.length === 0 ? (
          <p className="px-1 py-6 text-center text-sm text-stone-500">
            No products found for “{query.trim()}”.
          </p>
        ) : (
          <ul className="flex flex-col">
            {results.map((product) => {
              const image = product.images?.[0];
              return (
                <li key={product.id}>
                  <Link
                    to={`/product/${product.slug || product.id}`}
                    onClick={onNavigate}
                    className="flex items-center gap-3 rounded-xl px-1 py-2.5 active:bg-primary/10"
                  >
                    <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                      {image ? (
                        <img src={image} alt={product.name} className="h-full w-full object-cover" />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-stone-800">
                        {product.name}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function DesktopSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiFetch(
          `/api/products?search=${encodeURIComponent(q)}&limit=8`,
          { signal: ctrl.signal },
        );
        const json = await res.json();
        if (!ctrl.signal.aborted) setResults(Array.isArray(json?.data) ? json.data : []);
      } catch (error) {
        if (error?.name !== "AbortError" && !ctrl.signal.aborted) setResults([]);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [query]);

  return (
    <div className="gg-desk-search relative mx-auto hidden w-full max-w-md md:block">
      <span className="gg-search-lights" aria-hidden>
        <i /><i /><i /><i /><i /><i />
      </span>
      <label className="relative block">
        <span className="sr-only">Search products</span>
        <LuSearch
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg text-primary"
          aria-hidden
        />
        <input
          type="search"
          id="site-search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder='Search "Rudraksha"'
          className="gg-search-input h-11 w-full rounded-full border border-[#E9DFC4] bg-white pl-11 pr-4 text-sm text-stone-800 outline-none ring-primary/30 placeholder:text-stone-400 focus:ring-2"
        />
      </label>
      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-60 max-h-80 overflow-y-auto rounded-2xl border border-orange-100 bg-white p-2 shadow-xl">
          {loading ? (
            <p className="px-3 py-4 text-sm text-stone-500">Searching...</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-4 text-sm text-stone-500">No products found.</p>
          ) : (
            <ul>
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/product/${product.slug || product.id}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-orange-50"
                  >
                    <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-stone-800">
                      {product.name}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      ₹{Number(product.price || 0).toLocaleString("en-IN")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerCompact, setHeaderCompact] = useState(false);
  const headerRef = useRef(null);
  const headerHeightRef = useRef(0);
  const [mobileAccessoriesOpen, setMobileAccessoriesOpen] = useState(false);
  const [mobileTulsiOpen, setMobileTulsiOpen] = useState(false);
  const [mobileRudrakshaOpen, setMobileRudrakshaOpen] = useState(false);
  const [desktopAccessoriesOpen, setDesktopAccessoriesOpen] = useState(false);
  const [desktopTulsiOpen, setDesktopTulsiOpen] = useState(false);
  const [desktopRudrakshaOpen, setDesktopRudrakshaOpen] = useState(false);
  const accessoriesDesktopRef = useRef(null);
  const rudrakshaDesktopRef = useRef(null);
  const tulsiDesktopRef = useRef(null);
  const { getTotalItems } = useCart();
  const { getTotalItems: getWishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const cartCount = getTotalItems();
  const wishlistCount = getWishlistCount();
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Sprays",
      href: "/sprays",
    },
    {
      name: "Rudraksha",
      href: "/rudraksha",
    },
    {
      name: "Tulsi Mala",
      href: "/tulsimala",
    },
    {
      name: "Accessories",
      href: "/accessories",
    },
    {
      name: "Combos",
      href: "/combos",
    },
    {
      name: "Rashi",
      href: "/rashi",
    },
    {
      name: "About",
      href: "/about",
    },
  ];

  const desktopPills = [
    { name: "Diwali offers", href: "/#diwali-offers", badge: "Sale" },
    { name: "Rudraksha", href: "/rudraksha" },
    { name: "Tulsi Mala", href: "/tulsimala" },
    { name: "Bracelets", href: `/accessories?subcategory=${encodeURIComponent("Bracelet")}` },
    { name: "Malas", href: `/accessories?subcategory=${encodeURIComponent("Mala")}` },
    { name: "Sprays", href: "/sprays" },
    { name: "Accessories", href: "/accessories" },
    { name: "Combos", href: "/combos", badge: "New" },
    { name: "Rashi", href: "/rashi" },
    { name: "About", href: "/about" },
  ];

  const toggleMenu = () => {
    setSearchOpen(false);
    setIsMenuOpen((open) => !open);
  };

  const toggleSearch = () => {
    setIsMenuOpen(false);
    setMobileAccessoriesOpen(false);
    setMobileTulsiOpen(false);
    setMobileRudrakshaOpen(false);
    setSearchOpen((open) => !open);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setSearchOpen(false);
    setMobileAccessoriesOpen(false);
    setMobileTulsiOpen(false);
    setMobileRudrakshaOpen(false);
  };

  useEffect(() => {
    if (!desktopAccessoriesOpen && !desktopRudrakshaOpen && !desktopTulsiOpen)
      return;
    const onDown = (e) => {
      if (
        desktopAccessoriesOpen &&
        accessoriesDesktopRef.current &&
        !accessoriesDesktopRef.current.contains(e.target)
      ) {
        setDesktopAccessoriesOpen(false);
      }
      if (
        desktopRudrakshaOpen &&
        rudrakshaDesktopRef.current &&
        !rudrakshaDesktopRef.current.contains(e.target)
      ) {
        setDesktopRudrakshaOpen(false);
      }
      if (
        desktopTulsiOpen &&
        tulsiDesktopRef.current &&
        !tulsiDesktopRef.current.contains(e.target)
      ) {
        setDesktopTulsiOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [desktopAccessoriesOpen, desktopRudrakshaOpen, desktopTulsiOpen]);

  useEffect(() => {
    setDesktopAccessoriesOpen(false);
    setDesktopTulsiOpen(false);
    setDesktopRudrakshaOpen(false);
    setIsMenuOpen(false);
    setSearchOpen(false);
    setMobileAccessoriesOpen(false);
    setMobileTulsiOpen(false);
    setMobileRudrakshaOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    let compact = false;
    const onScroll = () => {
      if (window.innerWidth >= 768) {
        if (compact) {
          compact = false;
          setHeaderCompact(false);
        }
        return;
      }
      const y = window.scrollY;
      // Stay in the current size until the user is clearly past the header
      // or back at the top. A single threshold fights the height change and jumps.
      const next = compact ? y > 16 : y > 180;
      if (next !== compact) {
        compact = next;
        setHeaderCompact(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el || window.innerWidth >= 768) return undefined;
    const next = el.offsetHeight;
    const prev = headerHeightRef.current;
    headerHeightRef.current = next;
    if (prev && next < prev) {
      window.scrollTo(0, Math.max(0, window.scrollY - (prev - next)));
    }
    return undefined;
  }, [headerCompact]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const update = () => {
      const height = `${el.offsetHeight}px`;
      el.style.setProperty("--mobile-header-h", height);
      document.documentElement.style.setProperty("--mobile-header-h", height);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    if (!mq.matches || (!isMenuOpen && !searchOpen)) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMenuOpen, searchOpen]);

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const spraySparkles = [
    {
      id: "sp-1",
      top: "-7px",
      right: "-8px",
      delay: "0s",
      duration: "1.2s",
      scale: 0.75,
    },
    {
      id: "sp-2",
      top: "-10px",
      right: "22px",
      delay: "0.35s",
      duration: "1.45s",
      scale: 0.55,
    },
    {
      id: "sp-3",
      top: "19px",
      right: "-7px",
      delay: "0.75s",
      duration: "1.35s",
      scale: 0.62,
    },
  ];

  return (
    <>
      <style>{`
          @keyframes spraySparkleTwinkle {
            0% { opacity: 0; transform: scale(0) rotate(70deg); }
            35% { opacity: 1; transform: scale(var(--sparkle-scale, .7)) rotate(120deg); }
            100% { opacity: 0; transform: scale(0) rotate(155deg); }
          }
          .spray-sparkle {
            animation-name: spraySparkleTwinkle;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
          }
          @media (max-width: 767px) {
            .mobile-nav-backdrop {
              position: fixed;
              top: var(--mobile-header-h, 5.5rem);
              right: 0;
              bottom: 0;
              left: 0;
              z-index: 30;
              background: rgba(15, 23, 42, 0.4);
            }
            .gg-diwali-header {
              z-index: 45;
            }
            .mobile-nav-drawer,
            .mobile-search-panel {
              position: fixed;
              top: var(--mobile-header-h, 5.5rem);
              right: 0;
              bottom: 0;
              left: 0;
              z-index: 40;
              overflow-y: auto;
              overscroll-behavior: contain;
              padding-bottom: var(--gg-tabbar-offset);
            }
          }
        `}</style>
      <header
        ref={headerRef}
        className={`gg-mobile-chrome sticky top-0 z-50 pt-[env(safe-area-inset-top)] shadow-md transition-colors md:static md:z-auto md:pt-0 ${
          location.pathname === "/"
            ? "gg-home-header md:border-0 md:shadow-none"
            : "md:border-b md:border-[#E9DFC4] md:bg-[#FFFAEB] md:shadow-md"
        } ${
          headerCompact ? "bg-[#ff914d]/70 backdrop-blur-md" : "bg-[#ff914d]"
        }`}
      >
        {/* Top Banner */}
        <div className="gg-topbar hidden h-10 items-center justify-between gap-4 bg-primary px-6 text-sm text-white md:flex">
          <p className="shrink-0">Authentic · Lab-Tested · COD across India</p>
          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            state={isAuthenticated ? undefined : { from: location }}
            className="font-medium hover:underline"
          >
            Track your order
          </Link>
        </div>

        <div className={`gg-diwali-header md:hidden ${headerCompact ? "gg-diwali-header-compact" : ""}`}>
          <nav
            className="relative grid h-14 grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center px-1.5"
            aria-label="Mobile"
          >
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
            <Link
              to="/"
              onClick={closeMenu}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
              aria-label="Gawri Ganga home"
            >
              <img src={mobileIcon} alt="Gawri Ganga" className="h-9 w-9 object-contain" />
            </Link>
            <div className="col-start-3 flex items-center text-white">
              <Link
                to={isAuthenticated ? "/profile" : "/login"}
                state={isAuthenticated ? undefined : { from: location }}
                onClick={closeMenu}
                className="inline-flex h-10 w-10 items-center justify-center"
                aria-label={isAuthenticated ? "Account" : "Sign in or sign up"}
              >
                <LuCircleUserRound className="text-xl" />
              </Link>
              <Link
                to="/cart"
                state={{ backgroundLocation: location }}
                onClick={closeMenu}
                className="relative inline-flex h-10 w-10 items-center justify-center"
                aria-label="Cart"
              >
                <CgShoppingBag className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold leading-none text-[#9a2740]">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>
          {!headerCompact && (
            <ul className="flex gap-2 overflow-x-auto px-3 pb-3">
              {MOBILE_CHIPS.map((chip) => {
                const Icon = chip.icon;
                const chipPath = chip.href.split('#')[0] || '/'
                const chipHash = chip.href.includes('#') ? `#${chip.href.split('#')[1]}` : ''
                const active = chipHash
                  ? location.pathname === chipPath && location.hash === chipHash
                  : chip.href === '/'
                    ? location.pathname === '/' && !location.hash
                    : location.pathname.startsWith(chipPath)
                return (
                  <li key={chip.name} className="shrink-0">
                    <Link
                      to={chip.href}
                      onClick={closeMenu}
                      className={`flex min-w-16 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[10px] font-semibold ${
                        active ? "bg-white text-[#9a2740] shadow-sm" : "text-amber-50"
                      }`}
                    >
                      <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${active ? "bg-[#fff1e4]" : "bg-white/15"}`}>
                        <Icon className="text-base" aria-hidden />
                      </span>
                      {chip.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {searchOpen && <MobileSearchPanel onNavigate={closeMenu} />}

        {/* Main Navigation */}
        <nav className="relative hidden w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 px-6 pt-3 md:grid">
          {/* Logo */}
          <Link to="/" className="gg-desk-logo-wrap shrink-0 rounded-2xl bg-white px-3 py-1.5 shadow-sm">
            <img
              src={logo}
              alt="Gawri Ganga"
              className="gg-desk-logo h-14 w-auto md:h-16"
            />
          </Link>

          <DesktopSearch />

          {/* Desktop Navigation Links */}
          <div className="col-span-3 row-start-2 flex items-center justify-center gap-2 overflow-x-auto py-3">
            {desktopPills.map((item) => {
              const subcategory = item.href.includes("subcategory=")
                ? decodeURIComponent(item.href.split("subcategory=")[1])
                : "";
              const active = subcategory
                ? location.search.includes(subcategory)
                : isActive(item.href);
              const isSprayTab = item.href === "/sprays";
              const isRudraksha = item.href === "/rudraksha";
              const isTulsi = item.href === "/tulsimala";
              const isAccessories = item.href === "/accessories";

              if (isRudraksha) {
                const rudrakshaActive =
                  location.pathname.startsWith("/rudraksha");
                return (
                  <div
                    key={item.name}
                    ref={rudrakshaDesktopRef}
                    className="relative list-none"
                    onMouseEnter={() => setDesktopRudrakshaOpen(true)}
                    onMouseLeave={() => setDesktopRudrakshaOpen(false)}
                  >
                    <Link
                      to={item.href}
                      className={rudrakshaActive ? desktopPillActive : desktopPill}
                      aria-expanded={desktopRudrakshaOpen}
                      aria-haspopup="true"
                    >
                      {item.name}
                      <FaChevronDown
                        className={`text-xs transition-transform ${desktopRudrakshaOpen ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </Link>
                    {desktopRudrakshaOpen && (
                      <div
                        className="absolute left-1/2 top-full z-60 w-[min(100vw-2rem,24rem)] -translate-x-1/2 pt-2 xl:left-0 xl:translate-x-0 xl:w-80"
                        role="presentation"
                      >
                        <div className={megaPanel} role="menu">
                          <Link
                            to="/rudraksha"
                            className={megaHero}
                            onClick={() => setDesktopRudrakshaOpen(false)}
                          >
                            View all Rudraksha
                          </Link>
                          <div className="border-t border-gray-100 bg-[#FFFAF5] px-3 pb-4 pt-3">
                            <p className={megaSectionTitle}>By Mukhi (1–14)</p>
                            <div className="max-h-[min(18rem,50vh)] overflow-y-auto overscroll-contain pr-0.5">
                              <div className="grid grid-cols-2 gap-2">
                                {MUKHI_NAV_LINKS.map((l) => (
                                  <Link
                                    key={l.label}
                                    to={l.to}
                                    className={megaGridLink}
                                    onClick={() =>
                                      setDesktopRudrakshaOpen(false)
                                    }
                                    role="menuitem"
                                  >
                                    {l.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (isAccessories) {
                const accActive = location.pathname.startsWith("/accessories");
                return (
                  <div
                    key={item.name}
                    ref={accessoriesDesktopRef}
                    className="relative list-none"
                    onMouseEnter={() => setDesktopAccessoriesOpen(true)}
                    onMouseLeave={() => setDesktopAccessoriesOpen(false)}
                  >
                    <Link
                      to={item.href}
                      className={accActive ? desktopPillActive : desktopPill}
                      aria-expanded={desktopAccessoriesOpen}
                      aria-haspopup="true"
                    >
                      {item.name}
                      <FaChevronDown
                        className={`text-xs transition-transform ${desktopAccessoriesOpen ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </Link>
                    {desktopAccessoriesOpen && (
                      <div
                        className="absolute left-1/2 top-full z-60 w-[min(100vw-2rem,20rem)] -translate-x-1/2 pt-2 xl:left-0 xl:translate-x-0 xl:w-64"
                        role="presentation"
                      >
                        <div className={megaPanel} role="menu">
                          <Link
                            to="/accessories"
                            className={megaHero}
                            onClick={() => setDesktopAccessoriesOpen(false)}
                          >
                            View all accessories
                          </Link>
                          <div className="space-y-1 border-t border-gray-100 bg-[#FFFAF5] px-2 py-3">
                            <p className={`${megaSectionTitle} px-2`}>
                              By type
                            </p>
                            {ACCESSORY_TYPE_LINKS.map((l) => (
                              <Link
                                key={l.label}
                                to={l.to}
                                className={megaListLink}
                                onClick={() => setDesktopAccessoriesOpen(false)}
                                role="menuitem"
                              >
                                {l.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              if (isTulsi) {
                const tulsiActive = location.pathname.startsWith("/tulsimala");
                return (
                  <div
                    key={item.name}
                    ref={tulsiDesktopRef}
                    className="relative list-none"
                    onMouseEnter={() => setDesktopTulsiOpen(true)}
                    onMouseLeave={() => setDesktopTulsiOpen(false)}
                  >
                    <Link
                      to={item.href}
                      className={tulsiActive ? desktopPillActive : desktopPill}
                      aria-expanded={desktopTulsiOpen}
                      aria-haspopup="true"
                    >
                      {item.name}
                      <FaChevronDown
                        className={`text-xs transition-transform ${desktopTulsiOpen ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </Link>
                    {desktopTulsiOpen && (
                      <div
                        className="absolute left-1/2 top-full z-60 w-[min(100vw-2rem,20rem)] -translate-x-1/2 pt-2 xl:left-0 xl:translate-x-0 xl:w-64"
                        role="presentation"
                      >
                        <div className={megaPanel} role="menu">
                          <Link
                            to="/tulsimala"
                            className={megaHero}
                            onClick={() => setDesktopTulsiOpen(false)}
                          >
                            View all Tulsi Mala
                          </Link>
                          <div className="space-y-1 border-t border-gray-100 bg-[#FFFAF5] px-2 py-3">
                            <p className={`${megaSectionTitle} px-2`}>
                              By type
                            </p>
                            {TULSI_MALA_LINKS.map((l) => (
                              <Link
                                key={l.label}
                                to={l.to}
                                className={megaListLink}
                                onClick={() => setDesktopTulsiOpen(false)}
                                role="menuitem"
                              >
                                {l.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${active ? desktopPillActive : desktopPill} relative list-none`}
                >
                  {item.badge ? (
                    <span className={`gg-nav-badge ${item.badge === "New" ? "gg-nav-badge-new" : ""}`}>
                      {item.badge}
                    </span>
                  ) : null}
                  {isSprayTab && (
                    <>
                      {spraySparkles.map((s) => (
                        <span
                          key={s.id}
                          className="pointer-events-none absolute z-20 spray-sparkle text-primary"
                          style={{
                            top: s.top,
                            right: s.right,
                            animationDelay: s.delay,
                            animationDuration: s.duration,
                            "--sparkle-scale": s.scale,
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 21 21"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      ))}
                    </>
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Icons */}
          <div className="gg-desk-icons col-start-3 row-start-1 flex items-center gap-5 md:gap-7 lg:gap-9">
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <Link to="/corporate-bulk-orders" className="gg-desk-bulk rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-[#c2410c] shadow-sm">
                Corporate / Bulk
              </Link>
              <Link to="/cart" state={{ backgroundLocation: location }} className="relative">
                <CgShoppingBag className="text-primary text-2xl lg:text-3xl cursor-pointer hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
              <Link
                to={isAuthenticated ? "/profile" : "/login"}
                state={isAuthenticated ? undefined : { from: location }}
                className="rounded-lg text-primary p-1 transition-colors hover:bg-primary/10 hover:scale-105"
                title={isAuthenticated ? "Account" : "Sign in"}
                aria-label={isAuthenticated ? "Account" : "Sign in or sign up"}
              >
                <LuCircleUserRound className="text-2xl lg:text-3xl" />
              </Link>
            </div>

            {/* Tablet menu button. Phones use the bar above. */}
            <button
              type="button"
              onClick={toggleMenu}
              className="hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <button
            type="button"
            className="mobile-nav-backdrop md:hidden"
            aria-label="Close menu"
            onClick={closeMenu}
          />
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-nav-drawer border-t border-gray-200 bg-white shadow-lg lg:hidden">
            <div className="flex flex-col py-4">
              <div className="grid grid-cols-2 gap-2 px-4 pb-3">
                <Link
                  to={`/accessories?subcategory=${encodeURIComponent("Bracelet")}`}
                  onClick={closeMenu}
                  className="rounded-xl bg-primary/10 px-3 py-3 text-center text-sm font-bold text-primary"
                >
                  Bracelets
                </Link>
                <Link
                  to={`/accessories?subcategory=${encodeURIComponent("Mala")}`}
                  onClick={closeMenu}
                  className="rounded-xl bg-primary/10 px-3 py-3 text-center text-sm font-bold text-primary"
                >
                  Malas
                </Link>
              </div>
              {navItems.map((item) => {
                const active = isActive(item.href);
                const isSprayTab = item.href === "/sprays";
                const isRudraksha = item.href === "/rudraksha";
                const isTulsi = item.href === "/tulsimala";
                const isAccessories = item.href === "/accessories";

                if (isRudraksha) {
                  const rudrakshaActive =
                    location.pathname.startsWith("/rudraksha");
                  return (
                    <div
                      key={item.name}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <button
                        type="button"
                        onClick={() => setMobileRudrakshaOpen((o) => !o)}
                        className={`flex w-full items-center justify-between px-6 py-3.5 text-left text-lg font-semibold transition-colors ${
                          rudrakshaActive || mobileRudrakshaOpen
                            ? "text-primary font-bold bg-primary/10 border-l-4 border-primary"
                            : "text-gray-700 hover:bg-primary/5"
                        }`}
                        aria-expanded={mobileRudrakshaOpen}
                      >
                        {item.name}
                        <FaChevronDown
                          className={`shrink-0 text-sm transition-transform ${mobileRudrakshaOpen ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                      {mobileRudrakshaOpen && (
                        <div className="mx-4 mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-md ring-1 ring-gray-950/5">
                          <Link
                            to="/rudraksha"
                            onClick={closeMenu}
                            className="mb-4 block rounded-xl bg-primary/12 py-3.5 text-center text-base font-bold text-primary ring-1 ring-primary/15"
                          >
                            View all Rudraksha
                          </Link>
                          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                            By Mukhi (1–14)
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {MUKHI_NAV_LINKS.map((l) => (
                              <Link
                                key={l.label}
                                to={l.to}
                                onClick={closeMenu}
                                className="flex min-h-12 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 py-2 text-sm font-semibold text-gray-800 active:bg-primary/15 active:text-primary"
                              >
                                {l.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                if (isAccessories) {
                  const accActive =
                    location.pathname.startsWith("/accessories");
                  return (
                    <div
                      key={item.name}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <button
                        type="button"
                        onClick={() => setMobileAccessoriesOpen((o) => !o)}
                        className={`flex w-full items-center justify-between px-6 py-3.5 text-left text-lg font-semibold transition-colors ${
                          accActive || mobileAccessoriesOpen
                            ? "text-primary font-bold bg-primary/10 border-l-4 border-primary"
                            : "text-gray-700 hover:bg-primary/5"
                        }`}
                        aria-expanded={mobileAccessoriesOpen}
                      >
                        {item.name}
                        <FaChevronDown
                          className={`shrink-0 text-sm transition-transform ${mobileAccessoriesOpen ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                      {mobileAccessoriesOpen && (
                        <div className="mx-4 mb-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-md ring-1 ring-gray-950/5">
                          <Link
                            to="/accessories"
                            onClick={closeMenu}
                            className="mb-3 block rounded-xl bg-primary/12 py-3.5 text-center text-base font-bold text-primary ring-1 ring-primary/15"
                          >
                            View all accessories
                          </Link>
                          <p className="mb-1 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                            By type
                          </p>
                          <div className="flex flex-col gap-1">
                            {ACCESSORY_TYPE_LINKS.map((l) => (
                              <Link
                                key={l.label}
                                to={l.to}
                                onClick={closeMenu}
                                className="rounded-xl px-4 py-3 text-base font-semibold text-gray-800 active:bg-primary/10 active:text-primary"
                              >
                                {l.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                if (isTulsi) {
                  const tulsiActive =
                    location.pathname.startsWith("/tulsimala");
                  return (
                    <div
                      key={item.name}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <button
                        type="button"
                        onClick={() => setMobileTulsiOpen((o) => !o)}
                        className={`flex w-full items-center justify-between px-6 py-3.5 text-left text-lg font-semibold transition-colors ${
                          tulsiActive || mobileTulsiOpen
                            ? "text-primary font-bold bg-primary/10 border-l-4 border-primary"
                            : "text-gray-700 hover:bg-primary/5"
                        }`}
                        aria-expanded={mobileTulsiOpen}
                      >
                        {item.name}
                        <FaChevronDown
                          className={`shrink-0 text-sm transition-transform ${mobileTulsiOpen ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                      {mobileTulsiOpen && (
                        <div className="mx-4 mb-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-md ring-1 ring-gray-950/5">
                          <Link
                            to="/tulsimala"
                            onClick={closeMenu}
                            className="mb-3 block rounded-xl bg-primary/12 py-3.5 text-center text-base font-bold text-primary ring-1 ring-primary/15"
                          >
                            View all Tulsi Mala
                          </Link>
                          <p className="mb-1 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                            By type
                          </p>
                          <div className="flex flex-col gap-1">
                            {TULSI_MALA_LINKS.map((l) => (
                              <Link
                                key={l.label}
                                to={l.to}
                                onClick={closeMenu}
                                className="rounded-xl px-4 py-3 text-base font-semibold text-gray-800 active:bg-primary/10 active:text-primary"
                              >
                                {l.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeMenu}
                    className={`px-6 py-3.5 font-semibold transition-colors text-lg ${
                      isSprayTab
                        ? active
                          ? "text-primary font-bold"
                          : "text-primary font-semibold hover:bg-primary/5"
                        : active
                          ? "text-primary font-bold bg-primary/10 border-l-4 border-primary"
                          : "text-gray-700 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {item.name}
                      {isSprayTab && (
                        <span
                          className="spray-sparkle inline-flex text-primary"
                          style={{ animationDuration: "1.2s" }}
                        >
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 21 21"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
              {isAuthenticated && (
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="block border-b border-gray-100 px-6 py-3.5 text-lg font-semibold text-primary hover:bg-primary/5"
                >
                  My account
                </Link>
              )}
              {/* Mobile Menu Heart Icon */}
              <Link
                to="/wishlist"
                onClick={closeMenu}
                className="flex items-center gap-3 px-6 py-3.5 text-gray-700 font-semibold hover:text-primary hover:bg-primary/5 transition-colors text-lg relative"
              >
                <FaRegHeart className="text-primary" />
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="ml-auto bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </header>

      <nav className="gg-tabbar md:hidden" aria-label="Primary">
        <ul className="grid grid-cols-5">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.action === "menu"
                ? isMenuOpen
                : item.action === "search"
                  ? searchOpen
                  : item.href === "/cart"
                    ? location.pathname === "/cart"
                    : item.href === "/profile"
                      ? location.pathname.startsWith("/profile") || location.pathname.startsWith("/orders")
                      : isActive(item.href);
            const className = `flex min-w-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-[1.15rem] px-0.5 py-1.5 text-[9px] font-semibold leading-none tracking-tight ${
              active ? "gg-tab-active" : "text-stone-500"
            }`;
            const label = <span className="w-full truncate text-center">{item.name}</span>;
            const icon = (
              <span className="relative text-[1.15rem]">
                <Icon aria-hidden />
                {item.href === "/cart" && cartCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#9a2740] px-0.5 text-[8px] font-bold text-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </span>
            );
            return (
              <li key={item.name}>
                {item.action === "menu" ? (
                  <button
                    type="button"
                    onClick={toggleMenu}
                    className={`${className} w-full`}
                    aria-label={isMenuOpen ? "Close categories" : "Open categories"}
                    aria-expanded={isMenuOpen}
                  >
                    {icon}
                    {label}
                  </button>
                ) : item.action === "search" ? (
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className={`${className} w-full`}
                    aria-label={searchOpen ? "Close search" : "Search products"}
                    aria-expanded={searchOpen}
                  >
                    {icon}
                    {label}
                  </button>
                ) : (
                  <Link
                    to={item.href === "/profile" && !isAuthenticated ? "/login" : item.href}
                    state={
                      item.href === "/cart"
                        ? { backgroundLocation: location }
                        : item.href === "/profile" && !isAuthenticated
                          ? { from: location }
                          : undefined
                    }
                    onClick={closeMenu}
                    className={className}
                    aria-current={active ? "page" : undefined}
                  >
                    {icon}
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
