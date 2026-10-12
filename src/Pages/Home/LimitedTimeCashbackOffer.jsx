import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaGift,
  FaWallet,
  FaUsers,
  FaArrowRight,
  FaBolt,
  FaGem,
  FaStar,
  FaSun,
  FaLeaf,
  FaPrayingHands,
} from 'react-icons/fa';
import rudrakshaSection from '../../assets/HomePage/HomeImg1.webp';

const LimitedTimeCashbackOffer = () => {
  const location = useLocation();
  return (
    <section
      className="relative overflow-hidden bg-[#FFFAEB]"
      aria-labelledby="limited-cashback-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-20%,var(--color-primary)/0.12,transparent_55%)]" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-amber-300/20 blur-2xl" />
      {/* Soft lotus-inspired pattern (SVG) */}
      <svg
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 -translate-y-1/2 text-primary/[0.07] lg:block hidden"
        viewBox="0 0 200 200"
        fill="currentColor"
        aria-hidden
      >
        <path d="M100 20c8 24 32 40 58 40-26 0-50 16-58 40-8-24-32-40-58-40 26 0 50-16 58-40z" />
        <path d="M100 180c8-24 32-40 58-40-26 0-50-16-58-40-8 24-32 40-58 40 26 0 50 16 58 40z" />
        <path d="M20 100c24-8 40-32 40-58 0 26 16 50 40 58-24 8-40 32-40 58 0-26-16-50-40-58z" />
        <path d="M180 100c-24 8-40 32-40 58 0-26-16-50-40-58 24-8 40-32 40-58 0 26 16 50 40 58z" />
      </svg>
      <svg
        className="pointer-events-none absolute -right-16 bottom-8 h-56 w-56 text-amber-400/25 md:block hidden rotate-12"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        aria-hidden
      >
        <circle cx="50" cy="50" r="38" />
        <circle cx="50" cy="50" r="28" />
        <circle cx="50" cy="50" r="18" />
      </svg>

      {/* Decorative spiritual elements */}
      <div className="pointer-events-none absolute left-4 top-6 hidden h-16 w-16 -rotate-12 overflow-hidden rounded-full border-2 border-amber-300/80 bg-white/80 shadow-md sm:block">
        <img
          src={rudrakshaSection}
          alt="Rudraksha bead"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="pointer-events-none absolute right-8 bottom-6 hidden h-14 w-14 rotate-6 rounded-full border border-primary/40 bg-amber-50/90 shadow-sm sm:block">
        <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-primary/90">
          ॐ
        </div>
      </div>
      <div className="pointer-events-none absolute top-40 left-58 hidden h-10 w-10 rounded-full border border-amber-300/80 bg-white/90 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 shadow-sm sm:flex items-center justify-center">
        शुद्ध
      </div>
      <div className="pointer-events-none absolute left-1/4 top-3 hidden text-2xl text-primary/25 md:block" aria-hidden>
        ✦
      </div>
      <div className="pointer-events-none absolute right-1/4 top-1/3 hidden text-xl text-amber-600/30 lg:block" aria-hidden>
        ❋
      </div>
      <div className="pointer-events-none absolute bottom-16 left-[12%] hidden rounded-full border border-amber-200/90 bg-white/70 px-3 py-1 text-[10px] font-semibold tracking-widest text-amber-800 shadow-sm md:flex">
        गंगा
      </div>
      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 text-primary/35 lg:flex" aria-hidden>
        <FaStar className="h-4 w-4 rotate-12" />
        <FaSun className="h-5 w-5 -rotate-6" />
        <FaLeaf className="h-4 w-4 rotate-18" />
      </div>
      <div className="pointer-events-none absolute left-[8%] bottom-10 hidden h-11 w-11 items-center justify-center rounded-full border border-amber-300/70 bg-linear-to-br from-amber-50 to-white text-amber-700 shadow-sm md:flex">
        <FaGem className="h-5 w-5 opacity-80" aria-hidden />
      </div>
      <div className="pointer-events-none absolute right-[18%] top-8 hidden h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/5 text-primary/70 shadow-sm lg:flex">
        <FaPrayingHands className="h-6 w-6" aria-hidden />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-3 py-7 sm:px-4 sm:py-9 md:px-6 md:py-10 lg:px-8 xl:px-10 xl:py-11">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border-2 border-primary/25 bg-white/80 p-4 shadow-lg shadow-primary/10 backdrop-blur-sm sm:p-6 md:p-8 lg:p-10">
          {/* Inner corner flourishes */}
          <div
            className="pointer-events-none absolute left-0 top-0 h-16 w-16 border-l-2 border-t-2 border-amber-300/50 rounded-tl-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-16 w-16 border-r-2 border-t-2 border-amber-300/50 rounded-tr-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-16 w-16 border-b-2 border-l-2 border-primary/20 rounded-bl-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 border-b-2 border-r-2 border-primary/20 rounded-br-2xl"
            aria-hidden
          />
          <div className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 text-5xl text-primary/6 lg:block" aria-hidden>
            ॐ
          </div>
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:gap-8 md:text-left">
            <div className="mb-5 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-md sm:h-20 sm:w-20">
              <FaGift className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden />
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900 sm:text-sm">
                <FaBolt className="text-amber-600" aria-hidden />
                Limited time offer
              </p>
              <h2
                id="limited-cashback-heading"
                className="font-heading text-xl font-bold tracking-tight text-stone-900 sm:text-2xl md:text-3xl lg:text-[2rem]"
              >
                ₹1,000 cashback in your wallet
              </h2>
              <p className="mt-2.5 text-sm text-stone-600 sm:mt-3 sm:text-base md:text-lg">
                We’re crediting <strong className="text-stone-800">₹1,000</strong> to your Gawri Ganga wallet for the{' '}
                <strong className="text-primary">first 100 customers</strong> only. Use it on your next purchase and shop
                more on Rudraksha, sprays, and more.
              </p>

              <ul className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
                <li className="flex items-center gap-2 text-sm font-medium text-stone-700 sm:text-base">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <FaWallet aria-hidden />
                  </span>
                  Credited directly to your wallet
                </li>
                <li className="flex items-center gap-2 text-sm font-medium text-stone-700 sm:text-base">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <FaUsers aria-hidden />
                  </span>
                  First 100 users — while slots last
                </li>
              </ul>

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center md:justify-start">
                <Link
                  to="/rudraksha"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-primary/90 hover:shadow-lg"
                >
                  Shop the collection
                  <FaArrowRight className="text-sm" aria-hidden />
                </Link>
                <Link
                  to="/cart"
                  state={{ backgroundLocation: location }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary/40 bg-white px-8 py-3.5 text-base font-semibold text-primary transition hover:border-primary hover:bg-primary/5"
                >
                  View cart
                </Link>
              </div>

              <p className="mt-5 text-xs text-stone-500 sm:text-sm">
                Eligibility and campaign rules apply. Cashback is subject to our active campaign terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LimitedTimeCashbackOffer;
