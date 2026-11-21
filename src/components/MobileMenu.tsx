"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Dict } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";
import { isActive, navItems, navSubs, scrollTopIfCurrent } from "@/lib/nav";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import SectionLink from "./SectionLink";

export default function MobileMenu({
  lang,
  t,
  pathname,
}: {
  lang: Locale;
  t: Dict["nav"];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>("a,button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1280) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      root.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  const menuPanel =
    open && mounted ? (
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.primary}
        className="on-dark surface-gradient fixed inset-0 z-[9999] flex flex-col overflow-y-auto bg-[linear-gradient(160deg,#6e0b12_0%,#4a0a10_100%)] text-white shadow-2xl"
      >
        <div className="shell flex h-[var(--nav-h)] shrink-0 items-center justify-between border-b border-white/10">
          <Logo plate />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="flex items-center gap-2.5 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 active:bg-white/30 cursor-pointer"
          >
            {t.close}
            <span aria-hidden className="relative block size-4">
              <span className="absolute left-0 top-1/2 h-[1.5px] w-4 rotate-45 bg-white" />
              <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -rotate-45 bg-white" />
            </span>
          </button>
        </div>

        <nav aria-label={t.primary} className="shell flex-1 pb-8 pt-4">
          <ol className="border-t border-white/15">
            {navItems.map((item, i) => {
              const active = isActive(pathname, lang, item.path);
              const subs = navSubs(item.key, t);
              return (
                <li key={item.key} className="border-b border-white/15">
                  <SectionLink
                    href={href(lang, item.path)}
                    onClick={(e) => {
                      close();
                      scrollTopIfCurrent(e, active);
                    }}
                    aria-current={active ? "page" : undefined}
                    className="flex items-baseline gap-4 py-3.5"
                  >
                    <span className={`w-6 text-xs tabular-nums ${active ? "text-red-200" : "text-white/60"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-[1.75rem] leading-tight ${
                        active ? "font-semibold text-white" : "text-white/85 hover:text-white"
                      }`}
                    >
                      {t[item.key]}
                    </span>
                    {active && <span aria-hidden className="ml-auto size-2 self-center rounded-full bg-white" />}
                  </SectionLink>
                  {subs.length > 0 && (
                    <ul className="mb-3 ml-10 flex flex-wrap gap-x-6 text-base">
                      {subs.map((sub) => (
                        <li key={sub.path}>
                          <SectionLink
                            href={href(lang, sub.path)}
                            onClick={close}
                            className="inline-flex min-h-11 items-center text-white/80 hover:text-white"
                          >
                            {sub.label}
                          </SectionLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="shell flex shrink-0 items-center justify-between gap-4 border-t border-white/10 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <LanguageSwitcher lang={lang} label={t.language} className="text-base text-white" />
        </div>
      </div>
    ) : null;

  return (
    <div className="xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="flex items-center gap-2.5 rounded-md border border-line bg-transparent py-2 pl-4 pr-3 text-sm font-semibold text-ink hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
      >
        {t.menu}
        <span aria-hidden className="flex w-4 flex-col gap-[4px]">
          <span className="h-[1.5px] w-full bg-ink" />
          <span className="h-[1.5px] w-2/3 self-end bg-ink" />
        </span>
      </button>

      {mounted && typeof document !== "undefined" && menuPanel
        ? createPortal(menuPanel, document.body)
        : null}
    </div>
  );
}
