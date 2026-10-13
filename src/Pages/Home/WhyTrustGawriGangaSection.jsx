import React from 'react';
import whyGgBg from '../../assets/HomePage/whygg.webp';

const POINTS = [
  'Quality tested & spiritually sanctified',
  'Trusted by Shiv devotees nationwide',
  'Energized for positivity & protection',
];

const WhyTrustGawriGangaSection = () => {
  return (
    <section className="w-full bg-[#FFFAEB]" aria-labelledby="why-trust-gawri-ganga-heading">
      <div className="relative mx-auto w-full max-w-[1920px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat md:bg-[center_bottom]"
          style={{ backgroundImage: `url(${whyGgBg})` }}
          role="presentation"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[#FFFAEB] to-transparent md:h-56" aria-hidden />

        <div className="relative z-10 px-4 pb-[68vw] pt-7 sm:px-12 sm:pb-80 sm:pt-11 lg:px-20 lg:pb-96 lg:pt-12">
          <h2
            id="why-trust-gawri-ganga-heading"
            className="mx-auto max-w-4xl text-center font-heading text-[1.65rem] font-bold uppercase leading-tight tracking-[0.06em] text-[#2a1810] sm:text-4xl sm:tracking-[0.09em] lg:text-5xl"
          >
            Why trust Gawri Ganga?
          </h2>

          <ul className="mx-auto mt-5 flex w-full max-w-6xl flex-col gap-3 sm:mt-16 sm:grid sm:grid-cols-3 sm:gap-8 lg:mt-20 lg:max-w-7xl">
            {POINTS.map((label) => (
              <li key={label} className="text-center">
                <p className="font-heading text-[0.95rem] font-semibold leading-snug text-[#2a1810] sm:text-lg md:text-xl">
                  {label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhyTrustGawriGangaSection;
