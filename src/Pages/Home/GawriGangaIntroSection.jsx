import React from 'react';
import { Link } from 'react-router-dom';
import ggLogo from '../../assets/gglogo-full.webp';

const HL =
  'font-semibold text-primary underline decoration-primary/40 decoration-2 underline-offset-[5px] transition-colors hover:text-primary/85 hover:decoration-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFAEB] rounded-sm';

const GawriGangaIntroSection = () => {
  return (
    <section
      className="relative border-b border-amber-200/50 bg-[#FFFAEB] pb-16 pt-14 sm:pb-20 sm:pt-16 md:pb-24 md:pt-20"
      aria-labelledby="gawri-ganga-intro-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,rgba(251,191,36,0.12),transparent_55%)]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Logo — large, sharp on white */}
        <div className="mx-auto mb-10 max-w-lg sm:mb-12 sm:max-w-xl md:max-w-2xl">
          <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-stone-200/90 sm:rounded-3xl sm:p-8 md:p-10">
            <img
              src={ggLogo}
              alt="Gawri Ganga logo"
              className="mx-auto h-auto w-full object-contain object-center"
              width={640}
              height={240}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <header className="text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-stone-600 sm:text-sm sm:tracking-[0.32em]">
            Authentic Rudraksha · Spiritual wellness
          </p>
          <p className="font-heading text-[clamp(1.25rem,3.5vw,2rem)] font-medium text-stone-600">Welcome to</p>
          <h2
            id="gawri-ganga-intro-heading"
            className="font-heading mt-2 text-[clamp(2.75rem,10vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-stone-900 sm:mt-3"
          >
            Gawri Ganga
          </h2>
        </header>

        <div className="mx-auto mt-12 max-w-2xl space-y-6 text-pretty sm:mt-14">
          <p className="text-center text-base leading-relaxed text-stone-700 sm:text-lg">
            <strong className="font-semibold text-stone-900">Gawri Ganga</strong> offers lab-checked Rudraksha,
            sacred malas, and aura products online—rooted in decades of care.
          </p>
          <p className="text-center text-base leading-relaxed text-stone-700 sm:text-lg">
            Learn more in{' '}
            <Link to="/about" className={HL}>
              our story
            </Link>
            , shop the{' '}
            <Link to="/rudraksha" className={HL}>
              Rudraksha collection
            </Link>
            , or read{' '}
            <Link to="/blog" className={HL}>
              articles &amp; guides
            </Link>{' '}
            on the blog.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GawriGangaIntroSection;
