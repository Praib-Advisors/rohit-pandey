import { en } from "@/i18n/en";

export type Lang = "hi" | "en";

/**
 * The service pages (ई-शिकायत, ई-कार्ड, हमारे आदर्श) are written in Hindi and carry an English
 * entry per string in src/i18n/en.ts. Hindi text in, the page's language out; a string without an
 * English entry stays as written, so nothing ever disappears.
 */
export const translate = (s: string, lang: Lang): string => (lang === "en" ? (en[s] ?? s) : s);

/** The same for a whole object: every string inside it is translated, the shape stays. */
export function translateDeep<T>(v: T, lang: Lang): T {
  if (lang === "hi") return v;
  if (typeof v === "string") return translate(v, lang) as T;
  if (Array.isArray(v)) return v.map((x) => translateDeep(x, lang)) as T;
  if (v && typeof v === "object" && !("src" in v && "width" in v)) {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, translateDeep(x, lang)])) as T;
  }
  return v;
}
