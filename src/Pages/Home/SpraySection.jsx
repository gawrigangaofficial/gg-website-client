import React, { useCallback, useEffect, useRef, useState } from "react";

import Heading from "../../assets/Sprayelem/Header.png";
import AmratDhara from "../../assets/Sprayelem/AmratDhara.png";
import ChakraBalance from "../../assets/Sprayelem/ChakraBalance.png";
import Maitri from "../../assets/Sprayelem/Maitri.png";
import Shuddhi from "../../assets/Sprayelem/Shuddhi.png";
// Mobile backgrounds (same text content, blank space for copy + CTA)
import AmratMobileBg from "../../assets/Sprayelem/MobileSprayBg/AmratMobileBg.png";
import ChakraMobileBg from "../../assets/Sprayelem/MobileSprayBg/ChakraMobileBg.png";
import MaitriMobileBg from "../../assets/Sprayelem/MobileSprayBg/MaitriMobileBg.png";
import ShuddhiMobileBg from "../../assets/Sprayelem/MobileSprayBg/ShuddhiMobileBg.png";

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
      if (typeof window !== "undefined" && window.innerWidth < 768) return;

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

  const mobileCards = [
    {
      bg: AmratMobileBg,
      tag: "Aura Spray",
      title: "Amrat Dhara",
      accentColor: "#2283c7",
      textColor: "#1a6ba0",
      description:
        "Soft, calming lavender that eases stress and restores balance. Perfect for relaxation and meditation.",
      btnBg: "#1a6ba0",
      btnHover: "#155a8a",
    },
    {
      bg: ChakraMobileBg,
      tag: "Aura Spray",
      title: "Chakra Balance",
      accentColor: "#582683",
      textColor: "#582683",
      description:
        "Vibrant hibiscus essence to energize your space. Inspires positivity and inner strength for mindful living.",
      btnBg: "#582683",
      btnHover: "#47206b",
    },
    {
      bg: MaitriMobileBg,
      tag: "Aura Spray",
      title: "Maitri",
      accentColor: "#E27BB1",
      textColor: "#c9689a",
      description:
        "Gentle warmth and serenity with comforting floral aroma. Promotes calmness for home or workspace.",
      btnBg: "#E27BB1",
      btnHover: "#c9689a",
    },
    {
      bg: ShuddhiMobileBg,
      tag: "Aura Spray",
      title: "Shuddhi",
      accentColor: "#597B2C",
      textColor: "#486323",
      description:
        "Mogra and kewda blend to purify and elevate your space. Divine fragrance brings clarity and positivity.",
      btnBg: "#597B2C",
      btnHover: "#486323",
    },
  ];

  return (
    <section className="relative w-full" ref={sectionRef}>
      <img src={Heading} alt="" className="w-full" />

      {/* Desktop: keep current bg and styling exactly as is */}
      <div className="relative w-full h-screen overflow-hidden max-md:hidden">
        {/* Horizontal scroll track: 4 slides in a row, translateX on wheel */}
        <div
          className="spray-horizontal-track flex h-full"
          style={{
            width: "400%",
            transform: `translateX(-${activeSlide * 25}%)`,
            transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {/* Slide 0 – Amrat Dhara */}
          <div
            className="relative shrink-0 w-1/4 h-full bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${AmratDhara})`,
              backgroundPosition: "left center",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-end px-4 md:px-8">
              <div
                className="spray-text-panel max-w-lg px-8 md:px-10 lg:px-12 py-10 md:py-12 text-right rounded-2xl mr-[250px]"
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

          {/* Slide 1 – Chakra Balance */}
          <div
            className="relative shrink-0 w-1/4 h-full bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${ChakraBalance})`,
              backgroundPosition: "right center",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-start px-4 md:px-8">
              <div
                className="spray-text-panel max-w-lg px-8 md:px-10 lg:px-12 py-10 md:py-12 text-left rounded-2xl ml-[250px]"
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

          {/* Slide 2 – Maitri */}
          <div
            className="relative shrink-0 w-1/4 h-full bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${Maitri})`,
              backgroundPosition: "left center",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-end px-4 md:px-8">
              <div
                className="spray-text-panel max-w-lg px-8 md:px-10 lg:px-12 py-10 md:py-12 text-right rounded-2xl mr-[250px]"
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

          {/* Slide 3 – Shuddhi */}
          <div
            className="relative shrink-0 w-1/4 h-full bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${Shuddhi})`,
              backgroundPosition: "right center",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-start px-4 md:px-8">
              <div
                className="spray-text-panel max-w-lg px-8 md:px-10 lg:px-12 py-10 md:py-12 text-left rounded-2xl ml-[250px]"
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
        </div>

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

      {/* Mobile: images as-is, vertical stack (2 cards in view), text + Buy Now in blank space */}
      <div className="md:hidden w-full flex flex-col gap-6 px-3 py-4">
        {mobileCards.map((card, i) => (
          <div key={i} className="relative w-full">
            <img
              src={card.bg}
              alt={card.title}
              className="w-full h-auto block"
            />
            <div className="absolute bottom-0 left-0 right-0 px-5 pt-6 pb-5 mx-3">
              <div className="px-2 py-3 text-center max-w-[85%] mx-auto">
                <h2
                  className="spray-hero text-xl font-bold uppercase tracking-wider text-center"
                  style={{ color: card.textColor }}
                >
                  {card.title}
                </h2>
                <p className="spray-body mt-2 text-[#333] text-sm leading-snug text-center">
                  {card.description}
                </p>
                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    className="px-5 py-1.5 rounded-full font-medium text-[10px] uppercase tracking-widest text-white transition-all duration-300"
                    style={{
                      backgroundColor: card.btnBg,
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpraySection;
