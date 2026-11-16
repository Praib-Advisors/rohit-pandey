"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PressClipping } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export type PressSectionLabels = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  viewClipping: string;
  close: string;
  prev: string;
  next: string;
  of: string;
  dialog: string;
};

export default function PressSection({
  items,
  lang,
  labels,
}: {
  items: PressClipping[];
  lang: Locale;
  labels: PressSectionLabels;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  const step = (dir: 1 | -1) => {
    if (index === null) return;
    setIndex((index + dir + items.length) % items.length);
  };

  const activeItem = index !== null ? items[index] : null;

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h2 id="press-title" className="title-lg text-ink">
          {labels.title}
        </h2>
        {labels.subtitle && (
          <p className="max-w-2xl text-base text-muted md:text-lg">
            {labels.subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {items.map((item, i) => (
          <article
            key={item.id}
            className="group relative flex flex-col overflow-hidden rounded-md border border-line bg-paper shadow-xs transition-all duration-300 hover:border-red/40 hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${labels.viewClipping}: ${item.title[lang]}`}
              className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-tint/40 text-left"
            >
              <Image
                src={item.src}
                alt={item.title[lang]}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover object-top p-1 transition-transform duration-300 group-hover:scale-105"
              />
              <span
                aria-hidden
                className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-white/90 text-xs text-ink opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
              >
                ⤢
              </span>
            </button>

            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5 text-[0.75rem]">
                <span className="rounded bg-red/10 px-2 py-0.5 font-medium text-red">
                  {item.outlet[lang]}
                </span>
                {item.location && (
                  <span className="text-[0.7rem] text-muted">{item.location[lang]}</span>
                )}
              </div>

              <h3 className="font-heading text-sm font-bold leading-snug text-ink transition-colors group-hover:text-red md:text-[0.9375rem]">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="line-clamp-2 cursor-pointer text-left"
                >
                  {item.title[lang]}
                </button>
              </h3>

              {item.summary && (
                <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-muted">
                  {item.summary[lang]}
                </p>
              )}

              <div className="mt-4 border-t border-line/50 pt-3">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-red transition-colors hover:text-red-dk"
                >
                  <span>{labels.viewClipping}</span>
                  <span aria-hidden>→</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox on-dark"
        aria-label={labels.dialog}
        onClose={() => setIndex(null)}
        onCancel={() => setIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIndex(null);
        }}
      >
        {activeItem && (
          <div className="flex h-full flex-col">
            <div className="shell flex h-[var(--nav-h)] shrink-0 items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/90">
                  {activeItem.outlet[lang]}
                </span>
                <p className="text-sm tabular-nums text-muted" aria-live="polite">
                  {index! + 1} {labels.of} {items.length}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIndex(null)}
                autoFocus
                className="flex cursor-pointer items-center gap-2.5 rounded-full border border-line py-2 pl-4 pr-3 text-sm font-semibold hover:border-red hover:text-red"
              >
                {labels.close}
                <span aria-hidden className="relative block size-4">
                  <span className="absolute left-0 top-1/2 h-[1.5px] w-4 rotate-45 bg-current" />
                  <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -rotate-45 bg-current" />
                </span>
              </button>
            </div>

            <div
              className="relative min-h-0 flex-1"
              onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
                touchX.current = null;
              }}
            >
              <Image
                key={activeItem.id}
                src={activeItem.src}
                alt={activeItem.title[lang]}
                fill
                sizes="100vw"
                quality={95}
                className="object-contain px-4 md:px-20"
              />

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label={labels.prev}
                    onClick={() => step(-1)}
                    className="absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-line bg-paper/80 hover:border-red hover:text-red md:grid"
                  >
                    <span aria-hidden className="inline-block rotate-180">
                      →
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={labels.next}
                    onClick={() => step(1)}
                    className="absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-line bg-paper/80 hover:border-red hover:text-red md:grid"
                  >
                    <span aria-hidden>→</span>
                  </button>
                </>
              )}
            </div>

            <div className="shell flex shrink-0 flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <h4 className="font-heading text-base font-semibold text-white md:text-lg">
                  {activeItem.title[lang]}
                </h4>
                {activeItem.summary && (
                  <p className="mt-1 text-sm text-ink-soft">
                    {activeItem.summary[lang]}
                  </p>
                )}
              </div>

              {items.length > 1 && (
                <div className="flex gap-2 md:hidden">
                  <button
                    type="button"
                    aria-label={labels.prev}
                    onClick={() => step(-1)}
                    className="grid size-11 place-items-center rounded-full border border-line"
                  >
                    <span aria-hidden className="inline-block rotate-180">
                      →
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={labels.next}
                    onClick={() => step(1)}
                    className="grid size-11 place-items-center rounded-full border border-line"
                  >
                    <span aria-hidden>→</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
