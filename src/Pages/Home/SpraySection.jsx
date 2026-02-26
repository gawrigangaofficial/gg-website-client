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
        {/* Slide 0 – Amrat Dhara */}
        {activeSlide === 0 && (
          <div
            className="spray-panel-fade absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${AmratDhara})`,
              backgroundPosition: "left center",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-end px-4 md:px-8">
              <div
                className="spray-slide-content spray-text-panel max-w-lg px-8 md:px-10 lg:px-12 py-10 md:py-12 text-right rounded-2xl mr-[250px]"
              >
                <div className="flex items-center justify-end gap-4 mb-4">
                  <span className="spray-tag text-[#1a6ba0]/80">Aura Spray</span>
                  <div className="spray-accent bg-[#2283c7]" />
                </div>
                <h2 className="spray-hero text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#1a6ba0]">
                  Amrat Dhara
                </h2>
                <p className="spray-body mt-6 text-[#333] text-xl md:text-2xl leading-relaxed max-w-md ml-auto">
                  Amrat Dhara Lavender Aura Spray surrounds your space with a soft, calming floral fragrance that eases stress and restores balance. Perfect for relaxation, meditation, or winding down after a long day, it refreshes the air and creates a peaceful, soothing atmosphere instantly.
                </p>
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="px-8 py-3.5 rounded-full font-medium text-sm uppercase tracking-[0.2em] text-white bg-[#1a6ba0] hover:bg-[#155a8a] transition-all duration-300 shadow-md"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 1 – Chakra Balance */}
        {activeSlide === 1 && (
          <div
            className="spray-panel-fade absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${ChakraBalance})`,
              backgroundPosition: "right center",
            }}
            >
            <div className="absolute inset-0 flex items-center justify-start px-4 md:px-8">
              <div
                className="spray-slide-content spray-text-panel max-w-lg px-8 md:px-10 lg:px-12 py-10 md:py-12 text-left rounded-2xl ml-[250px]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="spray-accent bg-[#582683]" />
                  <span className="spray-tag text-[#582683]/80">Aura Spray</span>
                </div>
                <h2 className="spray-hero text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#582683]">
                  Chakra Balance
                </h2>
                <p className="spray-body mt-6 text-[#333] text-xl md:text-2xl leading-relaxed max-w-md">
                  ChakraBalance Gurhal Aura Spray carries the vibrant, uplifting essence of hibiscus to energize your surroundings. Its refreshing floral notes inspire positivity, emotional harmony, and inner strength, making it ideal for yoga, spiritual rituals, and mindful living.
                </p>
                <div className="mt-8 flex justify-start">
                  <button
                    type="button"
                    className="px-8 py-3.5 rounded-full font-medium text-sm uppercase tracking-[0.2em] text-white bg-[#582683] hover:bg-[#47206b] transition-all duration-300 shadow-md"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 2 – Maitri */}
        {activeSlide === 2 && (
          <div
            className="spray-panel-fade absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${Maitri})`,
              backgroundPosition: "left center",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-end px-4 md:px-8">
              <div
                className="spray-slide-content spray-text-panel max-w-lg px-8 md:px-10 lg:px-12 py-10 md:py-12 text-right rounded-2xl mr-[250px]"
              >
                <div className="flex items-center justify-end gap-4 mb-4">
                  <span className="spray-tag text-[#c9689a]/90">Aura Spray</span>
                  <div className="spray-accent bg-[#E27BB1]" />
                </div>
                <h2 className="spray-hero text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#c9689a]">
                  Maitri
                </h2>
                <p className="spray-body mt-6 text-[#333] text-xl md:text-2xl leading-relaxed max-w-md ml-auto">
                  Maitri Lavender Aura Spray spreads gentle warmth and serenity with its comforting floral aroma. Crafted to promote calmness and emotional connection, it refreshes your environment while creating a welcoming, tranquil vibe for your home or workspace.
                </p>
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="px-8 py-3.5 rounded-full font-medium text-sm uppercase tracking-[0.2em] text-white bg-[#E27BB1] hover:bg-[#c9689a] transition-all duration-300 shadow-md"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 3 – Shuddhi */}
        {activeSlide === 3 && (
          <div
            className="spray-panel-fade absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${Shuddhi})`,
              backgroundPosition: "right center",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-start px-4 md:px-8">
              <div
                className="spray-slide-content spray-text-panel max-w-lg px-8 md:px-10 lg:px-12 py-10 md:py-12 text-left rounded-2xl  ml-[250px]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="spray-accent bg-[#597B2C]" />
                  <span className="spray-tag text-[#597B2C]/80">Aura Spray</span>
                </div>
                <h2 className="spray-hero text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#486323]">
                  Shuddhi
                </h2>
                <p className="spray-body mt-6 text-[#333] text-xl md:text-2xl leading-relaxed max-w-md">
                  Shuddhi Aura Spray blends the rich sweetness of mogra with the fresh elegance of kewda to purify and elevate your space. Its divine fragrance refreshes the air, enhances spiritual focus, and leaves a lasting sense of clarity and positivity.
                </p>
                <div className="mt-8 flex justify-start">
                  <button
                    type="button"
                    className="px-8 py-3.5 rounded-full font-medium text-sm uppercase tracking-[0.2em] text-white bg-[#597B2C] hover:bg-[#486323] transition-all duration-300 shadow-md"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeSlide === i
                  ? "bg-gray-800 scale-125 shadow-md"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
              onClick={() => setActiveSlide(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpraySection;
