"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type SliderItem = {
  title?: string;
  category?: string;
  src: string;
  alt: string;
};

type Props = {
  items: SliderItem[];
  lang?: string;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
  autoplayInterval?: number;
};

type Dimensions = {
  cardWidth: number;
  cardHeight: number;
  centerBonusWidth: number;
  spacing: number;
  containerHeight: number;
};

export default function InfiniteCardSlider({
  items,
  lang = "hi",
  prevLabel,
  nextLabel,
  className = "",
  autoplayInterval = 3000,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalCount = items.length;

  const prevText = prevLabel ?? (lang === "en" ? "Previous" : "पिछला");
  const nextText = nextLabel ?? (lang === "en" ? "Next" : "अगला");

  // Continuous animation refs
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const startXRef = useRef(0);
  const startProgressRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const [dimensions, setDimensions] = useState<Dimensions>({
    cardWidth: 320,
    cardHeight: 400,
    centerBonusWidth: 170,
    spacing: 285,
    containerHeight: 470,
  });

  const [renderProgress, setRenderProgress] = useState(0);
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Responsive dimensions with extra width for center card to display full landscape photos
  const updateDimensions = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    if (w < 640) {
      setDimensions({
        cardWidth: 200,
        cardHeight: 290,
        centerBonusWidth: 95,
        spacing: 165,
        containerHeight: 340,
      });
    } else if (w < 1024) {
      setDimensions({
        cardWidth: 260,
        cardHeight: 350,
        centerBonusWidth: 125,
        spacing: 230,
        containerHeight: 410,
      });
    } else if (w < 1280) {
      setDimensions({
        cardWidth: 310,
        cardHeight: 390,
        centerBonusWidth: 160,
        spacing: 275,
        containerHeight: 460,
      });
    } else {
      setDimensions({
        cardWidth: 330,
        cardHeight: 410,
        centerBonusWidth: 180,
        spacing: 300,
        containerHeight: 480,
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // Main 60fps lerp animation loop
  useEffect(() => {
    const tick = () => {
      if (!isDraggingRef.current) {
        // Smoothly interpolate towards targetProgress with spring lerp
        const diff = targetProgressRef.current - currentProgressRef.current;
        if (Math.abs(diff) > 0.0005) {
          currentProgressRef.current += diff * 0.14;
        } else {
          currentProgressRef.current = targetProgressRef.current;
        }
      }

      setRenderProgress(currentProgressRef.current);
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Autoplay timer: advance every 3 seconds (or custom interval) when not hovering
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      if (!isHoveredRef.current && !isDraggingRef.current) {
        targetProgressRef.current = Math.round(targetProgressRef.current) + 1;
      }
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplayInterval]);

  // Navigation handlers
  const handlePrev = () => {
    targetProgressRef.current = Math.round(targetProgressRef.current) - 1;
  };

  const handleNext = () => {
    targetProgressRef.current = Math.round(targetProgressRef.current) + 1;
  };

  const handleCardClick = (cardIndex: number, relativeDiff: number) => {
    if (Math.abs(relativeDiff) > 0.3) {
      targetProgressRef.current =
        Math.round(targetProgressRef.current) + Math.round(relativeDiff);
    }
  };

  // Pointer drag gestures
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    setIsGrabbing(true);
    startXRef.current = e.clientX;
    startProgressRef.current = currentProgressRef.current;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = Math.max(now - lastTimeRef.current, 1);
    const dx = e.clientX - lastXRef.current;

    velocityRef.current = -dx / dt;
    lastXRef.current = e.clientX;
    lastTimeRef.current = now;

    // Convert pixel delta to progress delta
    const dragDelta = (startXRef.current - e.clientX) / dimensions.spacing;
    const nextProg = startProgressRef.current + dragDelta;
    currentProgressRef.current = nextProg;
    targetProgressRef.current = nextProg;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsGrabbing(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    // Apply inertia fling to snap to target card
    const fling = velocityRef.current * 0.18;
    const snapped = Math.round(currentProgressRef.current + fling);
    targetProgressRef.current = snapped;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none ${className}`}
      onPointerEnter={() => {
        isHoveredRef.current = true;
      }}
      onPointerLeave={() => {
        isHoveredRef.current = false;
      }}
      style={{ touchAction: "pan-y" }}
      role="region"
      aria-roledescription="carousel"
      aria-label="3D Coverflow Slider"
    >
      {/* 3D Stage */}
      <div
        className={`relative mx-auto flex w-full items-center justify-center ${
          isGrabbing ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ height: dimensions.containerHeight }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {items.map((item, idx) => {
          // Calculate relative circular difference between card index and current progress
          let diff = ((idx - renderProgress) % totalCount + totalCount) % totalCount;
          if (diff > totalCount / 2) {
            diff -= totalCount;
          }

          const absDiff = Math.abs(diff);

          // Card is hidden if it wraps far in the back
          const isVisible = absDiff <= 2.6;
          if (!isVisible) return null;

          // Non-linear horizontal position for curved coverflow effect
          const sign = diff < 0 ? -1 : 1;
          const x =
            sign *
            (Math.min(absDiff, 1) * dimensions.spacing +
              Math.max(0, absDiff - 1) * (dimensions.spacing * 0.72));

          // Scale: 1.05 for center card, smoothly down to 0.68 for outer
          const scale = Math.max(0.64, 1.04 - absDiff * 0.17);

          // Opacity: 1.0 for center, down to 0.5 for outer
          const opacity = Math.max(0.3, 1 - Math.pow(absDiff / 2.6, 1.5));

          // Z-index: center card has highest
          const zIndex = Math.round(50 - absDiff * 10);

          // Active center card styling
          const isCenter = absDiff < 0.45;

          // Dynamic width: center card expands smoothly so landscape photos are clearly visible without heavy cropping
          const cardWidth =
            dimensions.cardWidth +
            Math.max(0, 1 - absDiff) * dimensions.centerBonusWidth;

          return (
            <div
              key={`${item.src}-${idx}`}
              onClick={() => handleCardClick(idx, diff)}
              className="absolute left-1/2 top-1/2 will-change-transform"
              style={{
                width: cardWidth,
                height: dimensions.cardHeight,
                transform: `translate3d(calc(-50% + ${x}px), -50%, 0) scale(${scale})`,
                zIndex,
                opacity,
                transition: isDraggingRef.current
                  ? "none"
                  : "box-shadow 0.3s ease, border-color 0.3s ease",
              }}
            >
              <div
                className={`group relative size-full overflow-hidden rounded-2xl bg-sand-deep transition-all duration-300 ${
                  isCenter
                    ? "border-2 border-[#e65c00] shadow-2xl ring-2 ring-[#e65c00]/30"
                    : "border border-black/10 shadow-lg"
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  draggable={false}
                  sizes="(min-width: 1024px) 340px, (min-width: 640px) 280px, 230px"
                  className="pointer-events-none object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  priority={idx < 3}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls: "पिछला" / "अगला" Pill Buttons */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={handlePrev}
          aria-label={prevText}
          className="rounded-full border border-ink/40 bg-white/70 px-8 py-2 text-sm font-medium text-ink shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-ink hover:bg-white hover:shadow focus-visible:outline-2 focus-visible:outline-ink active:scale-95"
        >
          {prevText}
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label={nextText}
          className="rounded-full border border-ink/40 bg-white/70 px-8 py-2 text-sm font-medium text-ink shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-ink hover:bg-white hover:shadow focus-visible:outline-2 focus-visible:outline-ink active:scale-95"
        >
          {nextText}
        </button>
      </div>
    </div>
  );
}
