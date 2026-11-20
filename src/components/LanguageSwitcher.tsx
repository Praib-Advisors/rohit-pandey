"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchLocalePath, type Locale } from "@/lib/i18n";

const labels: Record<Locale, { short: string; lang: string }> = {
  en: { short: "EN", lang: "en" },
  hi: { short: "हिंदी", lang: "hi" },
};

export default function LanguageSwitcher({
  lang,
  label,
  className = "",
}: {
  lang: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname() ?? `/${lang}`;
  const [extraQueryHash, setExtraQueryHash] = useState("");

  // Sync hash and query parameters from client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search || "";
      const hash = window.location.hash || "";
      setExtraQueryHash(`${search}${hash}`);
    }
  }, [pathname]);

  // Restore scroll position after language switch so the user stays on the exact same section
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("lang_switch_scroll");
      if (saved !== null) {
        sessionStorage.removeItem("lang_switch_scroll");
        const top = parseFloat(saved);
        if (!Number.isNaN(top)) {
          window.scrollTo({ top, behavior: "instant" });
          requestAnimationFrame(() => {
            window.scrollTo({ top, behavior: "instant" });
          });
          setTimeout(() => {
            window.scrollTo({ top, behavior: "instant" });
          }, 60);
        }
      }
    } catch {
      // ignore
    }
  }, [pathname, lang]);

  const handleSaveScroll = () => {
    try {
      sessionStorage.setItem("lang_switch_scroll", window.scrollY.toString());
    } catch {
      // ignore
    }
  };

  return (
    <nav aria-label={label} className={`flex items-center text-sm ${className}`}>
      {(Object.keys(labels) as Locale[]).map((l, i) => {
        const active = l === lang;
        const targetUrl = `${switchLocalePath(pathname, l)}${extraQueryHash}`;
        return (
          <span key={l} className="flex items-center">
            {i > 0 && (
              <span aria-hidden className="h-3.5 w-px bg-line" />
            )}
            {active ? (
              <span aria-current="true" lang={labels[l].lang} className="inline-flex min-h-11 min-w-11 items-center justify-center font-semibold text-ink">
                {labels[l].short}
              </span>
            ) : (
              <Link
                href={targetUrl}
                scroll={false}
                onClick={handleSaveScroll}
                hrefLang={labels[l].lang}
                lang={labels[l].lang}
                className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted transition-colors hover:text-red"
              >
                {labels[l].short}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
