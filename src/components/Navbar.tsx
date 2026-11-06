"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";
import { isActive, navItems, scrollTopIfCurrent } from "@/lib/nav";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import SectionLink from "./SectionLink";
import SocialLinks from "./SocialLinks";

/**
 * Fixed white header so the red/green signature logo reads cleanly on every
 * page. A flag line (red | green) runs along its lower edge, and a soft shadow
 * appears once the page scrolls. Each page's coloured top band starts below it.
 */
export default function Navbar({
  lang,
  t,
  name,
  role,
}: {
  lang: Locale;
  t: Dict["nav"];
  name: string;
  role: string;
}) {
  const pathname = usePathname() ?? `/${lang}`;
  const [scrolled, setScrolled] = useState(false);
  const lastPath = useRef(pathname);

  // A reload always starts fresh at the top: stop the browser restoring the
  // previous scroll position (a #section link still lands on its section).
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A new route always opens at its top, never part-way down.
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  const links = navItems.filter((item) => item.key !== "contact");
  const contactActive = isActive(pathname, lang, "/contact");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled ? "bg-white/85 shadow-[0_12px_28px_-18px_rgb(22_24_28/0.35)] backdrop-blur-xl backdrop-saturate-150" : "bg-white shadow-[0_1px_0_rgb(22_24_28/0.06)]"
      }`}
    >
      <div aria-hidden className="flag-strip absolute inset-x-0 bottom-0 h-[3px]" />
      <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-6">
        <Link
          href={href(lang)}
          onClick={(e) => scrollTopIfCurrent(e, isActive(pathname, lang, "/"))}
          className="min-w-0 shrink-0"
          aria-label={`${name}, ${role}. ${t.home}`}
        >
          <Logo />
        </Link>

        <nav aria-label={t.primary} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((item) => {
              const active = isActive(pathname, lang, item.path);
              const subs =
                item.key === "media"
                  ? [
                      { path: "/media#photos", label: t.mediaPhotos },
                      { path: "/media#videos", label: t.mediaVideos },
                    ]
                  : [];
              return (
                <li key={item.key} className="group relative">
                  <SectionLink
                    href={href(lang, item.path)}
                    onClick={(e) => scrollTopIfCurrent(e, active)}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex min-h-11 items-center whitespace-nowrap px-3.5 text-[0.9375rem] font-medium transition-colors duration-300 after:absolute after:inset-x-3.5 after:bottom-1.5 after:h-[2px] after:origin-left after:rounded-full after:bg-brand-red after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.2,0.8,0.2,1)] xl:px-4 xl:after:inset-x-4 ${
                      active ? "text-brand-red after:scale-x-100" : "text-ink-soft after:scale-x-0 hover:text-ink hover:after:scale-x-100"
                    }`}
                  >
                    {t[item.key]}
                  </SectionLink>
                  {subs.length > 0 && (
                    <div className="invisible absolute left-0 top-full z-10 min-w-48 pt-2 opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      <ul className="rounded-2xl bg-white p-1.5 shadow-[0_18px_40px_-18px_rgb(22_24_28/0.45)] ring-1 ring-line">
                        {subs.map((sub) => (
                          <li key={sub.path}>
                            <SectionLink
                              href={href(lang, sub.path)}
                              className="flex min-h-11 items-center whitespace-nowrap rounded-xl px-4 text-[0.9375rem] text-ink-soft transition-colors hover:bg-tint hover:text-brand-red"
                            >
                              {sub.label}
                            </SectionLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-4 sm:gap-5">
          <div className="hidden xl:block [&_a]:size-10">
            <SocialLinks />
          </div>
          <div className="hidden sm:block">
            <LanguageSwitcher lang={lang} label={t.language} />
          </div>
          <div className="hidden md:block">
            <Link
              href={href(lang, "/contact")}
              onClick={(e) => scrollTopIfCurrent(e, contactActive)}
              aria-current={contactActive ? "page" : undefined}
              className={`btn min-h-11 rounded-full py-2.5 pl-6 pr-6 text-[0.875rem] shadow-[0_10px_24px_-14px_rgb(224_38_47/0.9)] hover:-translate-y-0.5 ${
                contactActive
                  ? "bg-green-dk text-white"
                  : "bg-brand-red text-white hover:bg-red-dk"
              }`}
            >
              {t.connect}
            </Link>
          </div>
          <MobileMenu lang={lang} t={t} pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
