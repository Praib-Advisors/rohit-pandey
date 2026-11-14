"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useMemo, type ComponentProps, type ReactNode } from "react";
import { translate, translateDeep, type Lang } from "./translate";

export type { Lang };

/** The language comes from the page address (/hi/... or /en/...), so there is nothing to remember in the browser. */
const LangContext = createContext<{ lang: Lang }>({ lang: "hi" });

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const value = useMemo(() => ({ lang }), [lang]);
  return <LangContext value={value}>{children}</LangContext>;
}

export const useLang = () => useContext(LangContext);

/** `const tr = useTr(); tr("परिचय")` for attributes and other non-JSX text. */
export function useTr() {
  const { lang } = useLang();
  return useCallback((s: string) => translate(s, lang), [lang]);
}

/** Translate a data object (portal copy, site data) inside a client component. */
export function useDeep<T>(v: T): T {
  const { lang } = useLang();
  return useMemo(() => translateDeep(v, lang), [v, lang]);
}

/** `<T>परिचय</T>`: works inside server components too. */
export function T({ children }: { children: string }) {
  const { lang } = useLang();
  return <>{translate(children, lang)}</>;
}

/** Text that carries both languages: `<TB v={{ hi, en }} />`. */
export function TB({ v }: { v: { hi: string; en: string } }) {
  const { lang } = useLang();
  return <>{lang === "en" ? v.en : v.hi}</>;
}

/** The same for attributes (alt text and so on). */
export function useBi() {
  const { lang } = useLang();
  return useCallback((v: { hi: string; en: string }) => (lang === "en" ? v.en : v.hi), [lang]);
}

/** `const h = useHref(); h("/ideals")` gives "/en/ideals" or "/hi/ideals". */
export function useHref() {
  const { lang } = useLang();
  return useCallback((path: string) => `/${lang}${path === "/" ? "" : path}`, [lang]);
}

/** A link that stays in the current language: `<LocalLink href="/ideals">` goes to /en/ideals or /hi/ideals. */
export function LocalLink({ href, ...rest }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const h = useHref();
  return <Link href={h(href)} {...rest} />;
}
