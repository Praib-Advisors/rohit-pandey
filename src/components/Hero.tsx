import Link from "next/link";
import type { Dict } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";

/**
 * Home hero built around the supplied artwork: a warm cream studio ground with
 * the portrait, flag arc, crowd and flag ribbon all in the image (nothing is
 * drawn over the person). The section uses the artwork's own cream so the
 * image edges disappear, and the text is dark on it.
 * Every breakpoint keeps the same reading: identity on the LEFT, beside the
 * portrait on the RIGHT.
 *
 * - xl and up: the hero is exactly one screen tall (screen height,
 *   capped at the artwork's own height) and the artwork is shown whole in it,
 *   never cropped: portrait, crowd and the flag ribbon along the bottom are
 *   all visible without scrolling. On screens wider than the artwork the
 *   spare room is cream on the left, where the artwork fades in. The text
 *   sits in its empty cream left half.
 * - md to xl (tablets): the artwork stands at the bottom of the stage at its
 *   own ratio, never cropped. Name, designation and the Khalilabad line run
 *   down the left beside the portrait, over a soft cream shade on the crowd;
 *   the introduction and buttons follow full width.
 * - phones: a dedicated tall (9:16) artwork. The portrait sits in its lower
 *   half and all the text (name, designation, line, buttons) sits in the empty
 *   cream area above the portrait.
 *
 * A single <picture> carries the artwork, so each breakpoint downloads one
 * image: the tall phone file below 768px, the desktop file from 768px up.
 */
export default function Hero({ lang, t }: { lang: Locale; t: Dict }) {
  const { person, hero } = t;
  const parts = person.name.split(" ");
  const lastName = parts.pop() ?? "";
  const firstName = parts.join(" ");

  const details = (
    <>
      <span aria-hidden className="rule-grow block h-[3px] w-16 rounded-full bg-[linear-gradient(90deg,var(--red)_0_60%,var(--green)_60%_100%)]" />
      <p className="hero-line text-left mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-soft [--i:4] max-md:hidden">{hero.intro}</p>
      <div className="hero-line mt-8 flex flex-col gap-3 [--i:5] max-md:mt-5 xs:flex-row xs:flex-wrap xs:items-center">
        <Link
          href={href(lang, "/about")}
          className="btn group min-h-12 justify-center rounded-full bg-brand-red px-7 text-white shadow-[0_14px_30px_-14px_rgb(224_38_47/0.8)] transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-red-dk hover:shadow-[0_20px_40px_-16px_rgb(158_16_24/0.8)]"
        >
          {hero.ctaProfile}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
        <Link
          href={href(lang, "/contact")}
          className="btn min-h-12 justify-center rounded-full border border-ink/20 bg-white/70 px-7 text-ink backdrop-blur transition-[transform,background-color,border-color,color] duration-300 hover:-translate-y-0.5 hover:border-green-dk hover:bg-white hover:text-green-dk"
        >
          {hero.ctaContact}
        </Link>
      </div>
    </>
  );

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-[#f6ece2]">
      <div className="relative">
        {/* Artwork: one picture. Phones and tablets sit it at the bottom of the
            stage at its own ratio; from xl it is shown whole (never cropped) at full width. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 aspect-[9/16] md:aspect-video xl:inset-x-auto xl:right-0 xl:h-[calc(100%-var(--nav-h))] xl:w-auto xl:max-w-full"
        >
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/rohit-pandey-hero-light.jpg" />
            <img
              src="/images/rohit-pandey-hero-portrait.jpg"
              alt=""
              width={1080}
              height={1920}
              fetchPriority="high"
              decoding="async"
              className="hero-art size-full object-cover object-right xl:[mask-image:linear-gradient(to_right,transparent,#000_10%)]"
            />
          </picture>
          {/* soft cream shade so the text stays readable over the crowd on phones and tablets */}
          <div className="absolute inset-y-0 left-0 w-[62%] bg-linear-to-r from-[#f6ece2] via-[#f6ece2]/70 to-transparent max-md:hidden md:w-[52%] xl:hidden" />
        </div>

        <div className="shell relative flex min-h-[calc(var(--nav-h)+177.78vw)] items-start pb-6 pt-[calc(var(--nav-h)+1.25rem)] md:min-h-[calc(var(--nav-h)+56.25vw+2rem)] xl:h-[clamp(34rem,100svh,calc(var(--nav-h)+56.25vw))] xl:min-h-0 xl:items-center xl:pb-[4%] xl:pt-[var(--nav-h)]">
          <div className="w-full xl:w-auto xl:max-w-[min(36vw,34rem)]">

            {/* Name, designation and the Khalilabad line keep to the left, beside the portrait */}
            <div className="md:w-[46%] xl:w-auto">
              <h1
                id="hero-title"
                className="hero-line font-heading [--i:0] text-[clamp(2rem,9vw,3.5rem)] leading-[1.02] xl:text-[clamp(3rem,1.6rem+4vw,5.75rem)] tracking-[-0.035em] [&:lang(hi)]:leading-[1.2] [&:lang(hi)]:tracking-normal"
              >
                {firstName}{" "}
                <span className="text-brand-red">{lastName}</span>
              </h1>

              <p className="hero-line text-left mt-3 font-display text-[clamp(1rem,3.8vw,1.375rem)] italic [--i:1] leading-snug text-ink-soft xl:mt-4 xl:text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] [&:lang(hi)]:not-italic [&:lang(hi)]:tracking-normal">
                {person.role}
              </p>

              <p className="hero-line text-left mt-4 text-[0.9375rem] leading-snug text-ink-soft [--i:2] sm:text-base xl:text-[1.0625rem]">{hero.line}</p>
            </div>

            {/* phones: the actions sit in the cream area above the portrait */}
            <div className="mt-5 md:hidden">{details}</div>
            <div className="mt-6 hidden xl:block">{details}</div>
          </div>
        </div>
      </div>

      {/* Introduction and actions, full width below the stage (phones, tablets) */}
      <div className="shell relative hidden pb-12 pt-6 sm:pb-14 md:block xl:hidden">{details}</div>
    </section>
  );
}
