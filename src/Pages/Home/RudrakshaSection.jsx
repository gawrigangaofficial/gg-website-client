import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import rudrakshaSection from '../../assets/HomePage/HomeImg1.png'

const RudrakshaSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center border-t border-stone-200/80 overflow-hidden bg-amber-50/70">
      {/* Premium background */}
      <div className="absolute inset-0 bg-linear-to-b from-amber-50/90 via-primary/5 to-stone-100/90"/>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,var(--color-primary)/0.08,transparent_50%)]" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Image left – bordered frame, padding so border doesn’t touch image */}
          <div className="flex justify-center lg:justify-end">
            <div className="rounded-3xl lg:rounded-4xl border-4 border-amber-400/90 p-3 sm:p-4 lg:p-5 shadow-2xl">
              <img
                src={rudrakshaSection}
                alt="Rudraksha Mala – sacred beads in premium packaging by Gawri Ganga"
                className="w-full max-w-2xl lg:max-w-none lg:w-2xl xl:w-3xl h-auto object-contain object-center rounded-3xl lg:rounded-4xl"
              />
            </div>
          </div>

          {/* Text right – large typography */}
          <div className="text-center lg:text-left">
            <p className="text-sm md:text-base font-medium tracking-[0.35em] uppercase text-primary/90 mb-4">
              Sacred Mala · Premium Packaging
            </p>
            <h2 className="font-heading font-bold text-stone-800 text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl tracking-tight mb-6 leading-tight">
              Rudraksha Mala
            </h2>
            <p className="text-stone-600 text-xl md:text-2xl lg:text-3xl leading-relaxed font-heading mb-4">
              Handpicked beads, presented with care. Each mala arrives in elegant packaging, worthy of gifting and daily practice.
            </p>
            <p className="text-stone-500 text-lg md:text-xl mb-10">
              Meditation · Yoga · Spiritual wellness
            </p>
            <Link
              to="/rudraksha"
              className="inline-flex items-center gap-3 py-4 px-10 rounded-full bg-primary text-white font-semibold text-base md:text-lg tracking-[0.2em] uppercase hover:bg-primary/90 transition-all duration-200 group shadow-lg hover:shadow-xl"
            >
              <span>Discover the collection</span>
              <FaArrowRight className="text-lg shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RudrakshaSection
