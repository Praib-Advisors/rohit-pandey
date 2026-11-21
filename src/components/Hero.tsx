"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

/**
 * 2-Slide Hero Slider:
 * - Slide 1: Original Hero with artwork, name, role and political affiliation.
 * - Slide 2: Pure image slide with leadership collage banner.
 * Auto-advances every 5 seconds; supports touch swipe, arrows, and pagination dots.
 * Consistent locked height across mobile, tablet, and desktop viewports.
 */
export default function Hero({ t }: { lang: Locale; t: Dict }) {
  const { person, hero } = t;
  const parts = person.name.split(" ");
  const lastName = parts.pop() ?? "";
  const firstName = parts.join(" ");

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const totalSlides = 2;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      aria-label="Hero Slider"
      className="relative w-full overflow-hidden bg-[#f6ece2] select-none h-[calc(100vh-var(--nav-h))] h-[calc(100dvh-var(--nav-h))] mt-[var(--nav-h)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Track */}
      <div
        className="flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {/* ============================================================== */}
        {/* SLIDE 1: Existing Hero Content                                */}
        {/* ============================================================== */}
        <div className="relative w-full h-full shrink-0 overflow-hidden bg-[#f6ece2] flex items-center">
          {/* Artwork: complete original image, object-contain, aspect ratio preserved */}
          <div
            aria-hidden
            className="absolute inset-0 flex items-end justify-end md:items-center pointer-events-none"
          >
            <picture className="flex size-full items-end justify-end md:items-center">
              <source media="(min-width: 768px)" srcSet="/images/rohit-pandey-hero-light.jpg" />
              <img
                src="/images/rohit-pandey-hero-portrait.jpg"
                alt=""
                width={1080}
                height={1920}
                fetchPriority="high"
                decoding="async"
                className="h-[56%] sm:h-[62%] md:h-full w-auto max-w-full max-h-full object-contain object-bottom md:object-right"
              />
            </picture>
            {/* Soft cream shade to keep text readable on phones and tablets */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#f6ece2]/60 to-[#f6ece2] md:hidden" />
            <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-[#f6ece2] via-[#f6ece2]/70 to-transparent max-md:hidden xl:hidden" />
          </div>

          <div className="shell relative z-10 flex h-full items-start pt-[13%] sm:pt-[14%] md:items-center md:pt-0 md:py-6">
            <div className="w-full xl:w-auto xl:max-w-[min(54vw,54rem)]">
              {/* Name, designation and the line keep to the left, beside the portrait */}
              <div className="w-full max-w-[92%] sm:max-w-[85%] md:w-[58%] xl:w-auto text-left">
                <h1
                  id="hero-title"
                  className="hero-line font-heading [--i:0] text-[clamp(2rem,7vw,2.75rem)] sm:text-5xl md:text-6xl xl:text-[clamp(4.25rem,2rem+4vw,6.5rem)] leading-[1.08] md:leading-[1.03] tracking-[-0.035em] [&:lang(hi)]:leading-[1.2] [&:lang(hi)]:tracking-normal text-left"
                >
                  {firstName}{" "}
                  <span className="text-brand-red">{lastName}</span>
                </h1>

                <p className="hero-line text-left mt-2 sm:mt-3 md:mt-3.5 xl:mt-4 font-heading text-[clamp(1.125rem,3.8vw,1.45rem)] sm:text-2xl md:text-[2.1rem] xl:text-[2.85rem] font-bold tracking-tight text-ink leading-[1.25] sm:leading-[1.2] xl:leading-[1.16] whitespace-pre-line">
                  {person.role}
                </p>

                <p className="hero-line text-left mt-1.5 sm:mt-2.5 md:mt-3.5 xl:mt-4 font-heading text-[clamp(1.125rem,3.8vw,1.45rem)] sm:text-2xl md:text-[2.1rem] xl:text-[2.85rem] font-bold tracking-tight text-[#7F1725] leading-[1.25] sm:leading-[1.2] xl:leading-[1.16]">
                  {hero.line}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SLIDE 2: Full Image Slide (No Text, No Overlays, No Captions)  */}
        {/* ============================================================== */}
        <div className="relative w-full h-full shrink-0 overflow-hidden bg-[#f6ece2]">
          <picture className="block size-full">
            <source media="(min-width: 768px)" srcSet="/hero-slide-leaders-desktop.jpg" />
            <img
              src="/hero-slide-leaders-mobile.jpg"
              alt="Rohit Pandey and Leaders"
              className="size-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
      </div>

      {/* ============================================================== */}
      {/* Navigation Controls: Subtle Arrows & Pagination Dots           */}
      {/* ============================================================== */}
      {/* Previous Button */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex size-9 sm:size-11 items-center justify-center rounded-full bg-black/20 hover:bg-black/45 text-white backdrop-blur-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="size-4.5 sm:size-5"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex size-9 sm:size-11 items-center justify-center rounded-full bg-black/20 hover:bg-black/45 text-white backdrop-blur-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="size-4.5 sm:size-5"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination Dots */}
      <div
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2"
        role="tablist"
        aria-label="Slide Selection"
      >
        {Array.from({ length: totalSlides }).map((_, idx) => {
          const isActive = currentSlide === idx;
          return (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-dk ${
                isActive
                  ? "w-7 sm:w-8 h-2 sm:h-2.5 bg-red-dk shadow-xs"
                  : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-black/25 hover:bg-black/50"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
