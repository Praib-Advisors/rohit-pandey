import type { MetadataRoute } from "next";
import { ideals } from "@/data/ideals";
import { updates } from "@/lib/content";
import { isoDate } from "@/lib/dates";
import { href, htmlLang, locales } from "@/lib/i18n";
import { SHOW_SOCIAL_SERVICE, SITE_URL } from "@/lib/site";

const staticPaths = [
  "/",
  "/about",
  "/public-life",
  "/khalilabad",
  "/media",
  "/ideals",
  "/e-card",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...(SHOW_SOCIAL_SERVICE ? ["/social-service"] : []),
    ...ideals.map((p) => `/ideals/${p.id}`), ...updates.map((u) => `/updates/${u.slug}`)];
  const lastModified = new Date(isoDate(updates[0].date));

  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${SITE_URL}${href(lang, path)}`,
      lastModified,
      changeFrequency: path === "/" || path === "/public-life" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/privacy" || path === "/terms" ? 0.2 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `${SITE_URL}${href(l, path)}`])),
      },
    })),
  );
}
