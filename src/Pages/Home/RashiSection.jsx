import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'

const ZODIAC_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

const SUPABASE_STORAGE_BASE = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const buildImageUrl = (folder, file_name) =>
  SUPABASE_STORAGE_BASE
    ? `${SUPABASE_STORAGE_BASE}/storage/v1/object/public/GGIMG/StaticImg/${encodeURIComponent(folder)}/${encodeURIComponent(file_name)}`
    : null

const RashiSection = ({ hideCta = false }) => {
  const [zodiacImages, setZodiacImages] = useState({})

  useEffect(() => {
    const fetchZodiacImages = async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      try {
        const res = await fetch(`${API_URL}/api/static-images?folder=Zodiac`)
        if (!res.ok) return
        const data = await res.json()
        const byKey = (data || []).reduce((acc, item) => {
          const url = item.url || buildImageUrl(item.folder, item.file_name)
          if (url) acc[item.key] = url
          return acc
        }, {})
        setZodiacImages(byKey)
      } catch (err) {
        console.error('Error fetching zodiac images:', err)
      }
    }
    fetchZodiacImages()
  }, [])

  const zodiacItems = ZODIAC_ORDER.map((key) => ({
    key,
    url: zodiacImages[key] || `https://via.placeholder.com/80x80?text=${key.slice(0, 2)}`,
    label: key
  }))

  return (
    <section className="relative bg-linear-to-b from-primary/5 to-gray-50 border-t border-gray-200 overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary/30" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* Section header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="font-heading font-bold text-gray-800 text-xl md:text-2xl mb-1">
            Discover by your Rashi
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto">
            Find the Rudraksha that aligns with your zodiac sign
          </p>
        </div>

        {/* Moving zodiac row with edge fade */}
        <div className="relative py-4 md:py-5">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-linear-to-r from-gray-50 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-linear-to-l from-gray-50 to-transparent z-10" />
          <div className="rashi-scroll-container overflow-hidden">
            <div className="flex animate-zodiac-scroll w-max">
              {[1, 2].map((copy) => (
                <div key={copy} className="flex items-center gap-6 md:gap-10 pr-6 md:pr-10 shrink-0">
                  {zodiacItems.map((item) => (
                    <Link
                      key={`${copy}-${item.key}`}
                      to="/rashi"
                      className="flex flex-col items-center gap-2.5 shrink-0 group group/zodiac"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-primary/20 bg-white shadow-md ring-2 ring-white group-hover/zodiac:border-primary group-hover/zodiac:shadow-lg group-hover/zodiac:scale-105 transition-all duration-300 shrink-0">
                        <img
                          src={item.url}
                          alt={item.key}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-gray-700 group-hover/zodiac:text-primary transition-colors whitespace-nowrap">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {!hideCta && (
          <div className="mt-6 md:mt-8 flex justify-center">
            <Link
              to="/rashi"
              className="inline-flex flex-wrap items-center justify-center gap-2 md:gap-3 py-4 px-6 md:px-8 rounded-2xl bg-primary text-white font-semibold text-sm md:text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
            >
              <span className="font-heading">Find your Rashi Rudraksha</span>
              <span className="opacity-90">— beads for your zodiac</span>
              <FaArrowRight className="text-lg shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default RashiSection
