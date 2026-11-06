import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/content";
import type { Dict } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";

/** A short introduction on the left with a photograph on the right, and the facts a voter looks for first. */
export default function HomeIntro({ lang, t }: { lang: Locale; t: Dict }) {
  const { about, location } = t;
  const facts = [location.facts[0], location.facts[1], about.facts[0], about.facts[3], about.facts[4]];

  return (
    <section aria-labelledby="about-title" className="grain relative overflow-hidden bg-white py-24 md:py-36">
      {/* soft red glow behind the photograph */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 -z-10 size-[38rem] rounded-full bg-[radial-gradient(closest-side,rgb(224_38_47/0.08),transparent)]"
      />
      <div className="shell">
        <div className="grid items-center gap-14 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7 lg:col-span-6">
            <h2 id="about-title" className="title-lg text-ink">
              {about.title}
            </h2>
            <div className="mt-9 max-w-[38rem] space-y-5">
              <p className="lede text-ink">{about.bio[0]}</p>
              <p className="text-ink-soft">{about.bio[1]}</p>
            </div>
            <Link
              href={href(lang, "/about")}
              className="group mt-10 inline-flex min-h-12 items-center gap-3 rounded-full border border-ink/15 py-2 pl-6 pr-2 font-semibold text-ink transition-colors duration-300 hover:border-red hover:text-red-dk"
            >
              {about.readMore}
              <span
                aria-hidden
                className="grid size-9 place-items-center rounded-full bg-brand-red text-white transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>

          <figure className="md:col-span-5 lg:col-span-5 lg:col-start-8" data-reveal="right">
            <div className="relative mx-auto w-full max-w-[26rem] md:ml-auto md:mr-0">
              {/* offset frame behind the photograph */}
              <span
                aria-hidden
                className="absolute -bottom-5 -left-5 h-full w-full rounded-[1.75rem] border-2 border-green/40 md:-bottom-6 md:-left-6"
              />
              <div className="zoom-media relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sand shadow-[0_40px_80px_-40px_rgb(110_11_18/0.55)]">
                <Image
                  src={images.aboutHome.src}
                  alt={about.portraitAlt}
                  fill
                  sizes="(min-width: 768px) 26rem, 92vw"
                  className="object-cover object-[62%_30%]"
                />
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/35 to-transparent" />
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-[linear-gradient(90deg,var(--red)_0_50%,var(--green)_50%_100%)]" />
              </div>
            </div>
          </figure>
        </div>

        <dl className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {facts.map((f) => (
            <div key={f.k} className="bg-white px-6 py-6 sm:last:col-span-2 lg:last:col-span-1 transition-colors duration-300 hover:bg-[#fbf7f2]">
              <dt className="text-[0.875rem] font-medium text-muted">{f.k}</dt>
              <dd className="mt-1.5 font-display text-[1.25rem] leading-snug text-ink">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
