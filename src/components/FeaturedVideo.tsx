"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type FeaturedVideoItem = {
  slug: string;
  href: string;
  src: string;
  poster: string;
  blur: string;
  width: number;
  height: number;
  label: string;
  date: string;
  dateLabel: string;
  location?: string;
  category: string;
  title: string;
  summary: string;
};

export type FeaturedVideoLabels = {
  play: string;
  readMore: string;
  more: string;
};

/** One large player with the video's details beside it; further videos are picked from a short list. */
export default function FeaturedVideo({ items, labels }: { items: FeaturedVideoItem[]; labels: FeaturedVideoLabels }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const v = items[active];
  if (!v) return null;

  const pick = (i: number) => {
    setActive(i);
    setPlaying(false);
  };

  return (
    <div className="grid items-center gap-10 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-5">
        <div
          className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[1.5rem] bg-sand shadow-[0_40px_80px_-40px_rgb(22_24_28/0.6)] ring-1 ring-black/5"
          style={{ aspectRatio: `${v.width} / ${v.height}` }}
        >
          {playing ? (
            <video
              key={v.src}
              src={v.src}
              poster={v.poster}
              style={{ backgroundImage: `url(${v.blur})`, backgroundSize: "cover" }}
              controls
              autoPlay
              playsInline
              aria-label={v.label}
              className="absolute inset-0 size-full object-contain"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`${labels.play}: ${v.title}`}
              className="group absolute inset-0 block size-full"
            >
              <Image src={v.poster} alt="" fill sizes="(min-width: 768px) 24rem, 90vw" placeholder="blur" blurDataURL={v.blur} className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
              <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent transition-colors group-hover:from-black/60" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="relative grid size-20 place-items-center rounded-full bg-white/95 text-xl text-red shadow-2xl transition-transform duration-500 group-hover:scale-110">
                  <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-white/40 [animation-duration:2.4s]" />
                  <span className="relative pl-1">▶</span>
                </span>
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="md:col-span-7">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <time dateTime={v.date} className="font-semibold text-red">
            {v.dateLabel}
          </time>
          {v.location && <span className="text-muted">{v.location}</span>}
          <span className="text-muted">{v.category}</span>
        </p>
        <h3 className="mt-4 font-heading text-[1.875rem] leading-[1.15] tracking-[-0.02em] md:text-[2.5rem] [&:lang(hi)]:leading-normal [&:lang(hi)]:tracking-normal">
          {v.title}
        </h3>
        <p className="mt-5 max-w-xl text-[1.0625rem] text-ink-soft">{v.summary}</p>
        <Link href={v.href} className="link-draw mt-5 min-h-11 items-center text-red-dk">
          {labels.readMore}
        </Link>

        {items.length > 1 && (
          <div className="mt-10">
            <p className="font-display text-[1.25rem] italic text-ink">{labels.more}</p>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {items.map((it, i) =>
                i === active ? null : (
                <li key={it.slug}>
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    className="group flex min-h-11 w-full items-center gap-4 py-4 text-left transition-colors hover:text-red"
                  >
                    <span className="zoom-media relative block h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                      <Image src={it.poster} alt="" fill sizes="3rem" placeholder="blur" blurDataURL={it.blur} className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-muted">{it.dateLabel}</span>
                      <span className="line-clamp-2 mt-0.5 block font-display text-[1.125rem] leading-snug [&:lang(hi)]:leading-normal">
                        {it.title}
                      </span>
                    </span>
                  </button>
                </li>
                ),
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
