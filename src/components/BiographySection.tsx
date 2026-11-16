import Image from "next/image";
import type { Dict } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

/** A concise personal profile, kept separate from the existing About copy. */
export default function BiographySection({ t, lang }: { t: Dict; lang: Locale }) {
  const { biography } = t;

  return (
    <section aria-labelledby="biography-title" className="shell py-16 md:py-24">
      <div className="grid items-start gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
        <figure
          className="relative mx-auto w-full max-w-[32rem] overflow-hidden rounded-[1.5rem] bg-tint md:col-span-5 md:max-w-none"
          data-reveal="clip"
        >
          <Image
            src="/images/rohit-pandey-white-kurta-scarf-portrait.webp"
            width={755}
            height={1100}
            alt={biography.portraitAlt}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="block h-auto w-full object-contain"
            quality={88}
          />
        </figure>

        <div className="md:col-span-7">
          <p className="eyebrow text-green-dk" data-reveal="fade">{biography.eyebrow}</p>
          <h2 id="biography-title" className="title-md mt-3 text-ink" data-reveal>
            {biography.title}
          </h2>
          <p className="mt-2 font-display text-2xl leading-tight text-ink md:text-3xl" data-reveal="fade">
            {biography.name}
          </p>

          <dl className="mt-7 grid border-t  border-line sm:grid-cols-2" data-reveal="fade">
            {biography.facts.map((fact, index) => (
              <div key={fact.k} className={`border-b border-line py-3.5 ${index % 2 === 0 ? "sm:pr-5" : "sm:border-l sm:pl-5"}`}>
                <dt className="text-sm font-medium text-muted">{fact.k}</dt>
                <dd className="mt-1 font-display text-lg leading-snug text-ink">{fact.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 space-y-4 text-[1rem] leading-7 text-ink-soft md:mt-8" lang={lang}>
            {biography.paragraphs.map((paragraph) => (
              <p key={paragraph} data-reveal="fade">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
