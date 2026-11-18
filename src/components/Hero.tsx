import type { Dict } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

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
export default function Hero({ lang: _lang, t }: { lang: Locale; t: Dict }) {
  const { person, hero } = t;
  const parts = person.name.split(" ");
  const lastName = parts.pop() ?? "";
  const firstName = parts.join(" ");

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

        <div className="shell relative flex min-h-[calc(var(--nav-h)+177.78vw)] items-start pb-6 pt-[calc(var(--nav-h)+3.25rem)] sm:pt-[calc(var(--nav-h)+2rem)] md:min-h-[calc(var(--nav-h)+56.25vw+2rem)] md:pt-[calc(var(--nav-h)+1.25rem)] xl:h-[clamp(34rem,100svh,calc(var(--nav-h)+56.25vw))] xl:min-h-0 xl:items-center xl:pb-[4%] xl:pt-[var(--nav-h)]">
          <div className="w-full xl:w-auto xl:max-w-[min(54vw,54rem)]">

            {/* Name, designation and the Khalilabad line keep to the left, beside the portrait */}
            <div className="md:w-[58%] xl:w-auto">
              <h1
                id="hero-title"
                className="hero-line font-heading [--i:0] text-[clamp(2.75rem,10.5vw,4.5rem)] sm:text-6xl md:text-6xl xl:text-[clamp(4.25rem,2rem+4.5vw,6.75rem)] leading-[1.02] tracking-[-0.035em] [&:lang(hi)]:leading-[1.2] [&:lang(hi)]:tracking-normal"
              >
                {firstName}{" "}
                <span className="text-brand-red">{lastName}</span>
              </h1>

              <p className="hero-line text-left mt-5 sm:mt-6 font-heading text-[clamp(1.6rem,6vw,2.65rem)] sm:text-4xl md:text-[2.5rem] xl:mt-7 xl:text-[3.25rem] font-bold tracking-tight text-ink leading-[1.18] xl:leading-[1.12]">
                {person.role}
              </p>

              <p className="hero-line text-left mt-3.5 sm:mt-4.5 font-heading text-[clamp(1.6rem,6vw,2.65rem)] sm:text-4xl md:text-[2.5rem] xl:mt-5 xl:text-[3.25rem] font-bold tracking-tight text-[#7F1725] leading-[1.18] xl:leading-[1.12]">
                {hero.line}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
