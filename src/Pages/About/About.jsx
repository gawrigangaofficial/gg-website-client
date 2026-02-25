import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/gglogo.svg'
import founderImage from '../../assets/Webimg/Sk.png'
import {
  FaCertificate,
  FaLeaf,
  FaCheckCircle,
  FaHeart,
} from 'react-icons/fa'

const GOLD_DIVIDER = 'border-amber-800/40'
const GOLD_ACCENT = 'text-amber-800/90'

const About = () => {
  return (
    <div className="min-h-screen bg-stone-50/95">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Logo */}
        <div className="flex justify-center mb-10 sm:mb-14">
          <Link to="/" className="inline-block" aria-label="Gawri Ganga Home">
            <img
              src={logo}
              alt="Gawri Ganga"
              className="w-36 h-auto sm:w-44 md:w-52"
            />
          </Link>
        </div>

        {/* Headline */}
        <header className="text-center mb-12 sm:mb-16">
          <h1 className="about-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-stone-800 tracking-tight">
            40 Years of Sacred Trust
          </h1>
          <div
            className={`mt-6 mx-auto w-24 sm:w-32 h-px border-t ${GOLD_DIVIDER}`}
            aria-hidden
          />
          <p className="about-body mt-6 text-stone-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Four decades of devotion to authentic Rudraksha—bringing tradition,
            purity, and trust to every bead we offer.
          </p>
        </header>

        {/* Founder Section */}
        <section className="mb-16 sm:mb-20">
          <div
            className={`w-full h-px border-t ${GOLD_DIVIDER} mb-10 sm:mb-12`}
            aria-hidden
          />
          <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center">
            <div className="shrink-0 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-lg overflow-hidden border-2 border-primary p-2 sm:p-2.5 md:p-3 bg-stone-100 shadow-sm">
              <img
                src={founderImage}
                alt="Shobhi Kulshreshta, Founder of Gawri Ganga"
                className="w-full h-full object-cover object-top rounded-md"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="about-heading text-2xl sm:text-3xl font-semibold text-stone-800 mb-3">
                Shobhi Kulshreshta
              </h2>
              <p className="about-body text-stone-600 text-base sm:text-lg leading-relaxed">
                Founder of Gawri Ganga, Shobhi Kulshreshta has spent over forty
                years in the sacred trade of Rudraksha. What began as a deep
                personal connection to these beads has grown into a legacy of
                trust—ensuring every piece we offer is authentic, certified, and
                ethically sourced. Today, that same commitment extends to our
                online presence, so you can experience the same integrity
                wherever you are.
              </p>
            </div>
          </div>
        </section>

        {/* Authenticity & Certification */}
        <section className="mb-16 sm:mb-20">
          <div
            className={`w-full h-px border-t ${GOLD_DIVIDER} mb-10 sm:mb-12`}
            aria-hidden
          />
          <h2 className="about-heading text-2xl sm:text-3xl font-semibold text-stone-800 text-center mb-8 sm:mb-10">
            Authenticity & Certification
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="flex gap-4 p-5 sm:p-6 rounded-lg bg-white/70 border border-stone-200/80 shadow-sm">
              <div
                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${GOLD_ACCENT} bg-amber-50`}
              >
                <FaCertificate className="text-xl" aria-hidden />
              </div>
              <div>
                <h3 className="about-heading font-semibold text-stone-800 text-lg mb-1">
                  Certified
                </h3>
                <p className="about-body text-stone-600 text-sm sm:text-base leading-relaxed">
                  Every Rudraksha is certified for authenticity and quality, so
                  you can trust what you wear.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-5 sm:p-6 rounded-lg bg-white/70 border border-stone-200/80 shadow-sm">
              <div
                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${GOLD_ACCENT} bg-amber-50`}
              >
                <FaLeaf className="text-xl" aria-hidden />
              </div>
              <div>
                <h3 className="about-heading font-semibold text-stone-800 text-lg mb-1">
                  Ethically Sourced
                </h3>
                <p className="about-body text-stone-600 text-sm sm:text-base leading-relaxed">
                  Sourced with care and respect for tradition and the
                  communities behind each bead.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-5 sm:p-6 rounded-lg bg-white/70 border border-stone-200/80 shadow-sm sm:col-span-2">
              <div
                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${GOLD_ACCENT} bg-amber-50`}
              >
                <FaCheckCircle className="text-xl" aria-hidden />
              </div>
              <div>
                <h3 className="about-heading font-semibold text-stone-800 text-lg mb-1">
                  Pure & Authentic
                </h3>
                <p className="about-body text-stone-600 text-sm sm:text-base leading-relaxed">
                  We deal only in genuine Rudraksha—no imitations. Our reputation
                  is built on purity and transparency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="mb-16 sm:mb-20">
          <div
            className={`w-full h-px border-t ${GOLD_DIVIDER} mb-10 sm:mb-12`}
            aria-hidden
          />
          <h2 className="about-heading text-2xl sm:text-3xl font-semibold text-stone-800 text-center mb-6 sm:mb-8">
            Our Mission
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="about-body text-stone-600 text-base sm:text-lg leading-relaxed text-center">
              To honour the spiritual and cultural significance of Rudraksha by
              making authentic, certified beads accessible to seekers everywhere.
              As a traditional spiritual brand now going online, we aim to carry
              forward the same values of trust, authenticity, and devotion that
              have defined us for forty years—so that every customer can hold a
              piece of that legacy in their hands.
            </p>
          </div>
        </section>

        {/* Closing Legacy */}
        <section>
          <div
            className={`w-full h-px border-t ${GOLD_DIVIDER} mb-10 sm:mb-12`}
            aria-hidden
          />
          <div className="text-center">
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 ${GOLD_ACCENT} mb-6`}
              aria-hidden
            >
              <FaHeart className="text-xl" />
            </div>
            <p className="about-heading text-xl sm:text-2xl font-medium text-stone-800 italic max-w-2xl mx-auto">
              A legacy of trust, one bead at a time.
            </p>
            <p className="about-body mt-4 text-stone-600 text-base sm:text-lg">
              Thank you for being part of our journey.
            </p>
            <p className="about-body mt-3 text-stone-500 text-sm sm:text-base">
              Visit us: A-59, Sector-27, Noida-201301, New Delhi, India
            </p>
            <Link
              to="/"
              className="inline-block mt-8 px-6 py-3 bg-primary text-white rounded-lg about-body font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Explore our collection
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
