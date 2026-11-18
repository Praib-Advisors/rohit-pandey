import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";
import { breadcrumbJsonLd } from "@/lib/seo";
import BlurBackdrop from "./BlurBackdrop";
import JsonLd from "./JsonLd";

type Crumb = { name: string; path: string };

/**
 * Inner-page introduction. Always a dark band (the fixed navbar is white on
 * transparent at the top), sized to its content. Pages vary the composition:
 * - `media`: a photograph or other visual beside the title
 * - `aside`: supporting facts or an index beside the title
 * - neither: a compact text-only band
 */
export default function PageHeader({
  lang,
  trail,
  meta,
  title,
  intro,
  description,
  actions,
  aside,
  media,
  mediaSide = "right",
  backdrop,
  bgImage,
  bgImageAlt,
  bgImagePosition,
  bgTone = "dark",
  titleSize = "lg",
}: {
  lang: Locale;
  trail: Crumb[];
  /** A quiet line under the title (date, place), set in normal case */
  meta?: string;
  title: string;
  intro?: string;
  description?: string;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  media?: React.ReactNode;
  /** Which side the media sits on from md up. On phones it always follows the title. */
  mediaSide?: "left" | "right";
  /** A film that fills the whole header from md up (text sits on top of it). On phones it follows the text at its own 9:16 ratio. */
  backdrop?: React.ReactNode;
  bgImage?: string;
  bgImageAlt?: string;
  bgImagePosition?: string;
  bgTone?: "dark" | "light";
  tone?: "deep" | "gradient" | string;
  titleSize?: "xl" | "lg" | "md";
}) {
  const t = getDictionary(lang);
  const crumbs = [{ name: t.nav.home, path: "/" }, ...trail];
  const side = media ?? aside;

  const isDark = bgImage ? bgTone !== "light" : !!backdrop;
  const isLightBgImage = bgImage && bgTone === "light";

  const titleClass =
    titleSize === "xl"
      ? "font-heading text-[clamp(2.75rem,1.6rem+5vw,5.5rem)] leading-[1.02] [&:lang(hi)]:leading-[1.2] [&:lang(hi)]:tracking-normal"
      : titleSize === "md"
        ? "title-md"
        : "title-lg";

  return (
    <header
      className={`relative isolate flex flex-col justify-between overflow-hidden ${
        isDark
          ? backdrop
            ? "on-dark bg-red-deep md:min-h-[100svh]"
            : "on-dark bg-black text-white min-h-[65vh] sm:min-h-[74vh] md:min-h-[82vh] lg:min-h-[88vh]"
          : isLightBgImage
            ? "bg-[#faf7f2] text-ink min-h-[50vh] sm:min-h-[58vh] md:min-h-[64vh]"
            : "bg-ivory"
      } ${
        media && mediaSide === "right" ? "flag-wedge [--wb-x:40%] [--wt-x:100%] [--wt-y:62%] md:[--wb-x:74%] md:[--wt-x:100%] md:[--wt-y:calc(var(--nav-h)+0.75rem)]" : ""
      }`}
    >
      {!bgImage && <BlurBackdrop tone={backdrop ? "deep" : "light"} />}
      <JsonLd data={breadcrumbJsonLd(lang, trail)} />

      {/* Light-tone background image (e.g. Ideals artwork with light ground) */}
      {isLightBgImage && (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* Desktop & Tablet: artwork is on the right side, completely uncropped */}
          <div className="absolute inset-y-0 right-0 hidden md:block w-[55%] lg:w-[50%] xl:w-[46%]">
            <Image
              src={bgImage}
              alt={bgImageAlt ?? ""}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="hero-art size-full object-contain object-right"
            />
            {/* Soft fade on the left edge so it blends into the page background */}
            <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#faf7f2] to-transparent" />
          </div>
        </div>
      )}

      {/* Dark-tone full-bleed Background Photograph */}
      {bgImage && !isLightBgImage && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src={bgImage}
            alt={bgImageAlt ?? ""}
            fill
            priority
            sizes="100vw"
            className={`hero-art size-full object-cover ${bgImagePosition ?? "object-[center_20%] md:object-[center_25%]"}`}
          />
          {/* Subtle gradient overlays for high text contrast while keeping photo visible */}
          <div className="absolute inset-0 hidden md:block bg-gradient-to-r md:from-black/92 md:via-black/65 md:to-transparent" />
          <div className="absolute inset-0 md:hidden bg-gradient-to-b from-black/90 via-black/65 to-black/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />
        </div>
      )}

      <div className={`shell flex flex-1 flex-col justify-center pt-[calc(var(--nav-h)+1.75rem)] pb-12 sm:pb-16 md:pb-20 ${backdrop || bgImage ? "relative z-10" : ""}`}>
        <nav aria-label={t.nav.breadcrumb}>
          <ol className={`flex flex-wrap items-center gap-2 text-sm ${isDark ? "text-white/60" : "text-muted"}`}>
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={c.path} className="flex min-w-0 items-center gap-2">
                  {last ? (
                    <span aria-current="page" className={`max-w-[60vw] truncate ${isDark ? "text-white/95" : "text-ink-soft"}`}>
                      {c.name}
                    </span>
                  ) : (
                    <Link href={href(lang, c.path)} className={`inline-flex min-h-11 items-center ${isDark ? "hover:text-white text-white/70" : "hover:text-ink"}`}>
                      {c.name}
                    </Link>
                  )}
                  {!last && <span aria-hidden>/</span>}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className={`grid gap-10 md:grid-cols-12 md:gap-8 ${media ? "items-end" : "md:items-end"}`}>
          <div
            className={`pb-12 pt-10 md:pb-16 md:pt-14 ${
              media && mediaSide === "left"
                ? "order-1 md:order-2 md:col-span-6"
                : isLightBgImage
                  ? "md:col-span-7 lg:col-span-6"
                  : side
                    ? "md:col-span-7"
                    : "md:col-span-9"
            }`}
          >
            <h1 className={`hero-line ${titleClass} ${isDark ? "text-white" : ""}`}>{title}</h1>
            {meta && <p className={`hero-line mt-4 font-display text-[1.125rem] italic [--i:1] ${isDark ? "text-white/80" : "text-ink-soft"}`}>{meta}</p>}
            <span aria-hidden className={`rule-grow mt-7 block h-[3px] w-16 rounded-full ${isDark ? "bg-[linear-gradient(90deg,var(--white)_0_60%,var(--green)_60%_100%)]" : "bg-[linear-gradient(90deg,var(--red)_0_60%,var(--green)_60%_100%)]"}`} />
            {intro && <p className={`hero-line lede mt-6 max-w-2xl [--i:2] ${isDark ? "text-white/90" : ""}`}>{intro}</p>}
            {description && <p className={`hero-line mt-4 max-w-xl text-base leading-relaxed [--i:3] ${isDark ? "text-white/80" : "text-ink-soft"}`}>{description}</p>}
            {actions && <div className="hero-line mt-7 [--i:4]">{actions}</div>}

            {/* Mobile image preview when using light background image */}
            {isLightBgImage && (
              <div className="mt-8 overflow-hidden rounded-xl border border-line bg-white shadow-xs md:hidden">
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    src={bgImage}
                    alt={bgImageAlt ?? ""}
                    fill
                    sizes="100vw"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            )}
          </div>
          {media && mediaSide === "left" && (
            <div className="order-2 pb-12 md:order-1 md:col-span-6 md:pb-16 md:pt-14">{media}</div>
          )}
          {media && mediaSide === "right" && <div className="-mt-4 flex w-full justify-end self-stretch md:col-span-5 md:mt-0 md:self-end">{media}</div>}
          {!media && aside && <div className="pb-12 md:col-span-5 md:pb-16">{aside}</div>}
        </div>
      </div>
      {backdrop && (
        <div className="relative aspect-[9/16] w-full md:absolute md:inset-0 md:aspect-auto">
          {backdrop}
          {/* keeps the title and text readable over the film; the captions at the bottom stay clear */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 hidden h-3/4 bg-linear-to-b from-red-deep/90 via-red-deep/55 to-transparent md:block"
          />
        </div>
      )}
      <div aria-hidden className={`flag-strip ${backdrop ? "relative z-10 md:absolute md:inset-x-0 md:bottom-0" : ""}`} />
    </header>
  );
}
