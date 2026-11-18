"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

export default function Hero({ lang: _lang, t }: { lang: Locale; t: Dict }) {
  const { person, hero } = t;
  const parts = person.name.split(" ");
  const lastName = parts.pop() ?? "";
  const firstName = parts.join(" ");

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;
  const touchStartX = useRef<number | null>(null);

  // Auto-play slider: advances every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      aria-label="Hero Banner"
      className="relative overflow-hidden bg-[#f6ece2] select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Locked height container across all breakpoints to ensure hero height never increases */}
      <div className="relative w-full min-h-[calc(var(--nav-h)+177.78vw)] md:min-h-[calc(var(--nav-h)+56.25vw+2rem)] xl:h-[clamp(34rem,100svh,calc(var(--nav-h)+56.25vw))]">
        {/* ============================================================ */}
        {/* SLIDE 0: Main Portrait Artwork + Identity & Titles           */}
        {/* ============================================================ */}
        <div
          aria-hidden={currentSlide !== 0}
          className={`absolute inset-0 size-full transition-opacity duration-700 ease-in-out ${
            currentSlide === 0 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Portrait artwork container */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 aspect-[9/16] md:aspect-video xl:inset-x-auto xl:right-0 xl:h-[calc(100%-var(--nav-h))] xl:w-auto xl:max-w-full"
          >
            <picture>
              <source media="(min-width: 768px)" srcSet="/images/rohit-pandey-hero-light.jpg" />
              <img
                src="/images/rohit-pandey-hero-portrait.jpg"
                alt=""
                width={1080}
                height={1920}
                fetchPriority="high"
                decoding="async"
                className="hero-art size-full object-cover object-right xl:[mask-image:linear-gradient(to_right,transparent,#000_10%)]"
              />
            </picture>
            {/* Soft cream shade so text stays readable over crowd on phones and tablets */}
            <div className="absolute inset-y-0 left-0 w-[62%] bg-linear-to-r from-[#f6ece2] via-[#f6ece2]/70 to-transparent max-md:hidden md:w-[52%] xl:hidden" />
          </div>

          {/* Text Content */}
          <div className="shell relative flex size-full items-start pb-6 pt-[calc(var(--nav-h)+3.25rem)] sm:pt-[calc(var(--nav-h)+2rem)] md:items-start md:pt-[calc(var(--nav-h)+1.25rem)] xl:items-center xl:pb-[4%] xl:pt-[var(--nav-h)]">
            <div className="w-full xl:w-auto xl:max-w-[min(54vw,54rem)]">
              <div className="md:w-[58%] xl:w-auto">
                <h1
                  id="hero-title"
                  className="hero-line font-heading [--i:0] text-[clamp(2.75rem,10.5vw,4.5rem)] sm:text-6xl md:text-6xl xl:text-[clamp(4.25rem,2rem+4.5vw,6.75rem)] leading-[1.02] tracking-[-0.035em] [&:lang(hi)]:leading-[1.2] [&:lang(hi)]:tracking-normal"
                >
                  {firstName}{" "}
                  <span className="text-brand-red">{lastName}</span>
                </h1>

                <p className="hero-line text-left mt-5 sm:mt-6 font-heading text-[clamp(1.6rem,6vw,2.65rem)] sm:text-4xl md:text-[2.5rem] xl:mt-7 xl:text-[3.25rem] font-bold tracking-tight text-ink leading-[1.18] xl:leading-[1.12]">
                  {person.role}
                </p>

                <p className="hero-line text-left mt-3.5 sm:mt-4.5 font-heading text-[clamp(1.6rem,6vw,2.65rem)] sm:text-4xl md:text-[2.5rem] xl:mt-5 xl:text-[3.25rem] font-bold tracking-tight text-[#7F1725] leading-[1.18] xl:leading-[1.12]">
                  {hero.line}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SLIDE 1: Photographic Leadership Collage Banner              */}
        {/* ============================================================ */}
        <div
          aria-hidden={currentSlide !== 1}
          className={`absolute inset-0 size-full transition-opacity duration-700 ease-in-out bg-white ${
            currentSlide === 1 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <div className="relative size-full overflow-hidden">
            <picture className="block size-full">
              <source media="(min-width: 768px)" srcSet="/images/hero-slide-leaders-desktop.jpg" />
              <img
                src="/images/hero-slide-leaders-mobile.jpg"
                alt="Rohit Pandey with Samajwadi Party Leadership"
                width={1024}
                height={576}
                className="size-full object-cover object-center"
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CONTROLS: Previous / Next Arrows                             */}
        {/* ============================================================ */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex size-9 sm:size-11 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md transition-all duration-200 hover:bg-black/55 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <svg className="size-4.5 sm:size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex size-9 sm:size-11 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md transition-all duration-200 hover:bg-black/55 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <svg className="size-4.5 sm:size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* ============================================================ */}
        {/* CONTROLS: Bottom Indicator Dots / Pills                      */}
        {/* ============================================================ */}
        <div className="absolute bottom-3.5 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentSlide === idx
                  ? "w-8 h-2.5 bg-brand-red shadow-sm"
                  : "w-2.5 h-2.5 bg-ink/30 hover:bg-ink/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
