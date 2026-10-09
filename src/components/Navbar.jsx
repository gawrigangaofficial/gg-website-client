import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaRegHeart, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { CgShoppingBag } from "react-icons/cg";
import { GiPrayerBeads } from "react-icons/gi";
import logo from "../assets/gglogo.svg";
import mobileLogo from "../assets/m-logo.png";
import mobileIcon from "../assets/icon-m.png";
import {
  LuCircleUserRound,
  LuGem,
  LuHouse,
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

const BOTTOM_NAV_ITEMS = [
  { name: "Home", href: "/", icon: LuHouse },
  { name: "Sprays", href: "/sprays", icon: LuSparkles },
  { name: "Rudraksha", href: "/rudraksha", icon: GiPrayerBeads },
  { name: "Tulsi", href: "/tulsimala", icon: LuLeaf },
  { name: "Accessories", href: "/accessories", icon: LuGem },
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
                        <img src={image} alt="" className="h-full w-full object-cover" />
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

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef(null);
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
    const el = headerRef.current;
    if (!el) return undefined;
    const update = () => {
      el.style.setProperty("--mobile-header-h", `${el.offsetHeight}px`);
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
              inset: 0;
              z-index: 30;
              background: rgba(15, 23, 42, 0.4);
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
              padding-bottom: calc(4.75rem + env(safe-area-inset-bottom));
            }
          }
        `}</style>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-[#E9DFC4] bg-[#FFFAEB] pt-[env(safe-area-inset-top)] shadow-md md:static md:z-auto md:pt-0"
      >
        {/* Top Banner */}
        <div className="hidden md:flex h-10 items-center justify-between gap-4 bg-primary px-6 text-sm text-white">
          <p className="shrink-0">Authentic · Lab-Tested · Fast Delivery</p>
          <p className="text-center font-medium">
            ₹1,000 wallet cashback for first 100 users
          </p>
          {/* TEMP: WhatsApp hidden — re-enable when ready (restore grid-cols-3 layout)
          <a
            href={getWhatsAppHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center shrink-0 gap-1.5 hover:underline"
          >
            <FaWhatsapp aria-hidden />
            WhatsApp
          </a>
          */}
        </div>

        {/* Mobile Top Banner - Simplified */}
        <div className="grid h-8 grid-cols-2 items-center gap-2 bg-primary px-3 text-[10px] text-white sm:text-xs md:hidden">
          <p className="truncate">Authentic · Lab-Tested</p>
          <p className="truncate text-right font-medium">
            ₹1,000 cashback — first 100 users
          </p>
          {/* TEMP: WhatsApp hidden — re-enable when ready (restore grid-cols-3 layout)
          <a
            href={getWhatsAppHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-self-end gap-1 font-semibold underline-offset-2 hover:underline"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp aria-hidden />
            WhatsApp
          </a>
          */}
        </div>

        {/* Mobile bar: menu, centered logo, search / cart / profile */}
        <nav
          className="relative grid h-16 grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center px-1.5 md:hidden"
          aria-label="Mobile"
        >
          <button
            type="button"
            onClick={toggleMenu}
            className={mobileIconBtn}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>

          <Link
            to="/"
            onClick={closeMenu}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1"
            aria-label="Home"
          >
            <img src={mobileIcon} alt="" className="h-9 w-9 shrink-0 object-contain" />
            <span
              className="relative block w-[3.5rem] shrink-0 overflow-hidden"
              style={{ aspectRatio: "400 / 296" }}
            >
              <img
                src={mobileLogo}
                alt=""
                className="absolute left-1/2 max-w-none -translate-x-1/2"
                style={{ width: "118%", top: "-23%" }}
              />
            </span>
          </Link>

          <div className="col-start-3 flex items-center">
            <button
              type="button"
              onClick={toggleSearch}
              className={`${mobileIconBtn} ${searchOpen ? "bg-primary/15" : ""}`}
              aria-label={searchOpen ? "Close search" : "Search"}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <FaTimes className="text-xl" /> : <LuSearch className="text-xl" />}
            </button>
            <Link to="/cart" onClick={closeMenu} className={mobileIconBtn} aria-label="Cart">
              <CgShoppingBag className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              state={isAuthenticated ? undefined : { from: location }}
              onClick={closeMenu}
              className={mobileIconBtn}
              title={isAuthenticated ? "Account" : "Sign in"}
              aria-label={isAuthenticated ? "Account" : "Sign in or sign up"}
            >
              <LuCircleUserRound className="text-xl" />
            </Link>
          </div>
        </nav>

        {searchOpen && <MobileSearchPanel onNavigate={closeMenu} />}

        {/* Main Navigation */}
        <nav className="hidden h-20 w-full items-center justify-between px-4 md:flex md:h-28 md:px-8 lg:h-32 lg:px-10">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img
              src={logo}
              alt="logo"
              className="w-16 h-16 md:w-24 md:h-24 lg:w-42 lg:h-42"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12 w-full justify-center">
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
                    ref={rudrakshaDesktopRef}
                    className="relative list-none"
                    onMouseEnter={() => setDesktopRudrakshaOpen(true)}
                    onMouseLeave={() => setDesktopRudrakshaOpen(false)}
                  >
                    <Link
                      to={item.href}
                      className={`flex cursor-pointer items-center gap-1 font-semibold transition-all text-base xl:text-lg ${
                        rudrakshaActive
                          ? "text-primary font-bold border-b-2 border-primary pb-1"
                          : "text-gray-700 hover:text-primary"
                      }`}
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
                      className={`flex cursor-pointer items-center gap-1 font-semibold transition-all text-base xl:text-lg ${
                        accActive
                          ? "text-primary font-bold border-b-2 border-primary pb-1"
                          : "text-gray-700 hover:text-primary"
                      }`}
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
                      className={`flex cursor-pointer items-center gap-1 font-semibold transition-all text-base xl:text-lg ${
                        tulsiActive
                          ? "text-primary font-bold border-b-2 border-primary pb-1"
                          : "text-gray-700 hover:text-primary"
                      }`}
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
                  className={`list-none cursor-pointer font-semibold transition-all text-base xl:text-lg ${
                    isSprayTab
                      ? `relative px-3 py-1.5 rounded-full ${
                          active
                            ? "text-primary font-bold"
                            : "text-primary hover:text-primary/80"
                        }`
                      : active
                        ? "text-primary font-bold border-b-2 border-primary pb-1"
                        : "text-gray-700 hover:text-primary"
                  }`}
                >
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
          <div className="flex items-center gap-5 md:gap-7 lg:gap-9">
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <Link to="/wishlist" className="relative">
                <FaRegHeart className="text-primary text-2xl lg:text-3xl cursor-pointer hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative">
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
              className={`${mobileIconBtn} lg:hidden`}
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

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E9DFC4] bg-[#FFFAEB]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_28px_-16px_rgba(62,47,28,0.45)] backdrop-blur-md md:hidden"
        aria-label="Primary"
      >
        <ul className="grid h-16 grid-cols-5">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={closeMenu}
                  className={`flex h-full flex-col items-center justify-center gap-0.5 ${
                    active ? "text-primary" : "text-stone-500"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={`flex h-7 w-8 items-center justify-center rounded-full ${
                      active ? "bg-primary/15 text-primary" : "text-stone-600"
                    }`}
                  >
                    <Icon className="text-[1.15rem]" aria-hidden />
                  </span>
                  <span
                    className={`max-w-full truncate px-0.5 text-[10px] font-semibold leading-none ${
                      active ? "text-primary" : "text-stone-600"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
