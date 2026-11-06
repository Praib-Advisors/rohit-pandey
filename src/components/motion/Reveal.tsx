"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll reveal for the whole site. Headings, pictures and cards that start
 * below the fold are tagged with data-reveal and rise into place as they
 * enter the screen. Anything already on screen at load is left alone, so
 * nothing flickers. Siblings are staggered a little. Elements can opt in
 * with their own data-reveal value (fade, left, right, zoom, clip), or opt
 * out with data-reveal-skip.
 */
const AUTO = [
  "main section h2",
  "main section h3",
  "main section .lede",
  "main section figure",
  "main section article",
  "main section .card-lux",
  "main section .card-flip",
  "main section dl > div",
  "main section ol > li",
  "main section iframe",
  "main [data-reveal]",
].join(",");

export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("js");

    const fold = window.innerHeight * 0.92;
    const tagged: Element[] = [];
    document.querySelectorAll<HTMLElement>(AUTO).forEach((el) => {
      if (el.closest("[data-reveal-skip], dialog, header, nav")) return;
      if (el.classList.contains("is-in")) return;
      // never nest: an ancestor already animates this one
      const parent = el.parentElement?.closest("[data-reveal]");
      if (parent && parent !== el) return;
      const top = el.getBoundingClientRect().top;
      if (top < fold) {
        el.classList.add("is-in");
        return;
      }
      if (!el.dataset.reveal) el.dataset.reveal = "";
      tagged.push(el);
    });

    // stagger siblings that share a parent
    const groups = new Map<Element | null, HTMLElement[]>();
    for (const el of tagged as HTMLElement[]) {
      const key = el.parentElement;
      const list = groups.get(key) ?? [];
      list.push(el);
      groups.set(key, list);
    }
    groups.forEach((list) => list.forEach((el, i) => el.style.setProperty("--reveal-i", String(Math.min(i, 6)))));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    tagged.forEach((el) => io.observe(el));

    // title rules that start on screen still draw in
    document.querySelectorAll(".title-lg").forEach((el) => {
      if (!el.hasAttribute("data-reveal")) requestAnimationFrame(() => el.classList.add("is-in"));
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
