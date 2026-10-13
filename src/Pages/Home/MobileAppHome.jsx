import { Link } from 'react-router-dom';
import RashiIconStrip from '../../components/RashiIconStrip';
import rudrakshaImg from '../../assets/HomePage/Our-collection/rudraksha.webp';
import tulsiImg from '../../assets/HomePage/Our-collection/Tulsi.webp';
import malaImg from '../../assets/HomePage/Our-collection/Mala.webp';
import spraysImg from '../../assets/HomePage/Our-collection/Maitri.webp';

const MobileAppHome = () => (
  <section id="diwali-offers" className="gg-mobile-stage md:bg-transparent" aria-label="Diwali offers">
    <h1 className="sr-only">
      Gawri Ganga Diwali offers — Nepali Rudraksha, Tulsi malas, and spiritual products in India
    </h1>
    <div className="px-3 pb-2 pt-3 md:hidden">
      <article className="gg-diwali-panel relative overflow-hidden rounded-[1.4rem] px-4 pb-4 pt-5 text-white">
        <span className="gg-diya gg-diya-left" aria-hidden />
        <span className="gg-diya gg-diya-right" aria-hidden />
        <span className="gg-spark gg-spark-a" aria-hidden />
        <span className="gg-spark gg-spark-b" aria-hidden />
        <span className="gg-spark gg-spark-c" aria-hidden />
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="pl-5">
            <p className="text-sm font-semibold text-amber-100">Diwali special</p>
            <p className="mt-1 font-heading text-[2.6rem] font-bold leading-none text-white">₹1,000</p>
            <p className="mt-1 text-lg font-semibold text-white">wallet cashback</p>
            <p className="mt-2 text-xs text-amber-100/90">For the first 100 users</p>
          </div>
          <div className="relative h-28 w-28 shrink-0">
            <img
              src={malaImg}
              alt="Tulsi mala"
              className="h-full w-full rounded-full object-cover ring-4 ring-amber-200/80"
            />
            <span className="absolute -bottom-1 -right-1 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[#e07830]">
              Mala
            </span>
          </div>
        </div>
      </article>
      <div className="mt-4">
        <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ffe7c2]">
          Shop by rashi
        </p>
        <div className="-mx-3 mt-2">
          <RashiIconStrip />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { src: rudrakshaImg, alt: 'Rudraksha', to: '/rudraksha' },
          { src: tulsiImg, alt: 'Tulsi mala', to: '/tulsimala' },
          { src: spraysImg, alt: 'Aura spray', to: '/sprays' },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-orange-100">
            <img src={item.src} alt={item.alt} className="h-24 w-full object-cover" />
          </Link>
        ))}
      </div>
    </div>
    <div className="gg-mobile-stage-scallop md:hidden" aria-hidden />
  </section>
);

export default MobileAppHome;
