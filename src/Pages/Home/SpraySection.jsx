import React, { useCallback, useEffect, useRef, useState } from "react";

import Heading from "../../assets/Sprayelem/Header.png";
import AmratDhara from "../../assets/Sprayelem/AmratDhara.png";
import ChakraBalance from "../../assets/Sprayelem/ChakraBalance.png";
import Maitri from "../../assets/Sprayelem/Maitri.png";
import Shuddhi from "../../assets/Sprayelem/Shuddhi.png";

const SpraySection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [inSprayZone, setInSprayZone] = useState(false);
  const sectionRef = useRef(null);
  const isScrollingRef = useRef(false);
  const lastWheelRef = useRef(0);
  const WHEEL_COOLDOWN_MS = 1000;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (isScrollingRef.current) return;
        const ratio = entry.intersectionRatio;
        if (ratio >= 0.6 && !inSprayZone) {
          setInSprayZone(true);
          setActiveSlide(0);
          requestAnimationFrame(() => {
            const headingHeight = el.firstElementChild?.offsetHeight ?? 0;
            const top = el.offsetTop + headingHeight;
            window.scrollTo({ top, behavior: "smooth" });
          });
        } else if (ratio < 0.3) {
          setInSprayZone(false);
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inSprayZone]);

  const handleWheel = useCallback(
    (e) => {
      if (!inSprayZone) return;

      e.preventDefault();

      const now = Date.now();
      if (now - lastWheelRef.current < WHEEL_COOLDOWN_MS) return;
      lastWheelRef.current = now;

      if (e.deltaY > 0) {
        if (activeSlide < 3) {
          setActiveSlide((prev) => prev + 1);
        } else {
          setInSprayZone(false);
          isScrollingRef.current = true;
          const el = sectionRef.current;
          if (el) {
            const scrollTarget = el.offsetTop + el.offsetHeight;
            window.scrollTo({ top: scrollTarget, behavior: "smooth" });
          }
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 800);
        }
      } else {
        if (activeSlide > 0) {
          setActiveSlide((prev) => prev - 1);
        } else {
          setInSprayZone(false);
          isScrollingRef.current = true;
          const el = sectionRef.current;
          if (el) {
            const scrollTarget = Math.max(0, el.offsetTop - window.innerHeight);
            window.scrollTo({ top: scrollTarget, behavior: "smooth" });
          }
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 800);
        }
      }
    },
    [inSprayZone, activeSlide],
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return (
    <section className="relative w-full" ref={sectionRef}>
      <img src={Heading} alt="" className="w-full" />

      <div className="relative w-full h-screen">
        {/* Slide 0 – Amrat Dhara (image from right) */}
        {activeSlide === 0 && (
          <div
            className="spray-panel-fade absolute inset-0 bg-cover bg-no-repeat flex items-center"
            style={{
              backgroundImage: `url(${AmratDhara})`,
              backgroundPosition: "left center",
            }}
          >
            <div className="relative z-10 w-full max-w-8xl mx-auto px-4 md:px-8 py-10 md:py-14 flex justify-end">
              <div className="max-w-2xl spray-slide-content text-right md:ml-12 lg:ml-16 mr-42">
                <h2 className="font-dm-serif text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#2283c7]">
                  Amrat Dhara
                </h2>
                <p className="mt-4 md:mt-5 text-[#333333] text-xl md:text-2xl leading-relaxed text-center">
                  Amrat Dhara Lavender Aura Spray surrounds your space with a
                  soft, calming floral fragrance that eases stress and restores
                  balance. Perfect for relaxation, meditation, or winding down
                  after a long day, it refreshes the air and creates a peaceful,
                  soothing atmosphere instantly.
                </p>
                <div className="mt-6 md:mt-8 flex justify-center">
                  <button
                    type="button"
                    className="px-9 py-4.5 rounded-2xl font-semibold text-lg md:text-xl uppercase tracking-wider text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] bg-[#1a6ba0] hover:bg-[#155a8a]"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 1 – Chakra Balance (image from left) */}
        {activeSlide === 1 && (
          <div
            className="spray-panel-fade absolute inset-0 bg-cover bg-no-repeat flex items-center"
            style={{
              backgroundImage: `url(${ChakraBalance})`,
              backgroundPosition: "right center",
            }}
          >
            <div className="relative z-10 w-full max-w-8xl mx-auto px-4 md:px-8 py-10 md:py-14 flex justify-start">
              <div className="max-w-2xl spray-slide-content text-left mr-8 md:mr-12 lg:mr-16 ml-42">
                <h2 className="font-dm-serif text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#582683]">
                  Chakra Balance
                </h2>
                <p className="mt-4 md:mt-5 text-[#333333] text-xl md:text-2xl leading-relaxed text-center">
                  ChakraBalance Gurhal Aura Spray carries the vibrant, uplifting
                  essence of hibiscus to energize your surroundings. Its
                  refreshing floral notes inspire positivity, emotional harmony,
                  and inner strength, making it ideal for yoga, spiritual
                  rituals, and mindful living.
                </p>
                <div className="mt-6 md:mt-8 flex justify-center">
                  <button
                    type="button"
                    className="px-9 py-4.5 rounded-2xl font-semibold text-lg md:text-xl uppercase tracking-wider text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] bg-[#582683] hover:bg-[#47206b]"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 2 – Maitri (image from right) */}
        {activeSlide === 2 && (
          <div
            className="spray-panel-fade absolute inset-0 bg-cover bg-no-repeat flex items-center"
            style={{
              backgroundImage: `url(${Maitri})`,
              backgroundPosition: "left center",
            }}
          >
            <div className="relative z-10 w-full max-w-8xl mx-auto px-4 md:px-8 py-10 md:py-14 flex justify-end">
              <div className="max-w-2xl spray-slide-content text-right md:ml-12 lg:ml-16 mr-42">
                <h2 className="font-dm-serif text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#E27BB1]">
                  Maitri
                </h2>
                <p className="mt-4 md:mt-5 text-[#333333] text-xl md:text-2xl leading-relaxed text-center">
                  Maitri Lavender Aura Spray spreads gentle warmth and serenity
                  with its comforting floral aroma. Crafted to promote calmness
                  and emotional connection, it refreshes your environment while
                  creating a welcoming, tranquil vibe for your home or
                  workspace.
                </p>
                <div className="mt-6 md:mt-8 flex justify-center">
                  <button
                    type="button"
                    className="px-9 py-4.5 rounded-2xl font-semibold text-lg md:text-xl uppercase tracking-wider text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] bg-[#E27BB1] hover:bg-[#c9689a]"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 3 – Shuddhi (image from left) */}
        {activeSlide === 3 && (
          <div
            className="spray-panel-fade absolute inset-0 bg-cover bg-no-repeat flex items-center"
            style={{
              backgroundImage: `url(${Shuddhi})`,
              backgroundPosition: "right center",
            }}
          >
            <div className="relative z-10 w-full max-w-8xl mx-auto px-4 md:px-8 py-10 md:py-14 flex justify-start">
              <div className="max-w-2xl spray-slide-content text-left mr-8 md:mr-12 lg:mr-16 ml-42">
                <h2 className="font-dm-serif text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#597B2C]">
                  Shuddhi
                </h2>
                <p className="mt-4 md:mt-5 text-[#333333] text-xl md:text-2xl leading-relaxed text-center">
                  Shuddhi Aura Spray blends the rich sweetness of mogra with the
                  fresh elegance of kewda to purify and elevate your space. Its
                  divine fragrance refreshes the air, enhances spiritual focus,
                  and leaves a lasting sense of clarity and positivity.
                </p>
                <div className="mt-6 md:mt-8 flex justify-center">
                  <button
                    type="button"
                    className="px-9 py-4.5 rounded-2xl font-semibold text-lg md:text-xl uppercase tracking-wider text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] bg-[#597B2C] hover:bg-[#486323]"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dot indicators – separate buttons */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          <button
            type="button"
            aria-label="Go to slide 1"
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeSlide === 0
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => setActiveSlide(0)}
          />
          <button
            type="button"
            aria-label="Go to slide 2"
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeSlide === 1
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => setActiveSlide(1)}
          />
          <button
            type="button"
            aria-label="Go to slide 3"
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeSlide === 2
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => setActiveSlide(2)}
          />
          <button
            type="button"
            aria-label="Go to slide 4"
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeSlide === 3
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => setActiveSlide(3)}
          />
        </div>
      </div>
    </section>
  );
};

export default SpraySection;
