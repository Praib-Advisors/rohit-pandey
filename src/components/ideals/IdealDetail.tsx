import { LocalLink as Link } from "@/lib/lang";
import { ArrowRight, ChevronLeft } from "@/components/icons";
import Reveal from "@/components/PortalReveal";
import { ideals, nameOf, type Ideal } from "@/data/ideals";
import { jsonLdHtml } from "@/lib/jsonLd";
import { T, TB } from "@/lib/lang";
import Crumbs from "./Crumbs";
import IdealImage from "./IdealImage";
import IdealQuoteView from "./IdealQuote";

/** The full profile: portrait and key dates beside the story, contributions, thought, quote and sources. */
export default function IdealDetail({ person }: { person: Ideal }) {
  const i = ideals.findIndex((p) => p.id === person.id);
  const prev = ideals[(i - 1 + ideals.length) % ideals.length];
  const next = ideals[(i + 1) % ideals.length];
  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.nameEnglish,
    alternateName: person.nameHindi,
    description: person.intro.hi,
  };
  return (
    <>
      <header className="border-b border-line bg-sand/60 pt-[var(--nav-h)]">
        <div className="shell pb-6 pt-6">
          <Crumbs name={<TB v={nameOf(person)} />} />
        </div>
      </header>

      <article className="section">
        <div className="shell grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:sticky lg:top-28 lg:col-span-4">
            <div className="mx-auto max-w-sm">
              <IdealImage person={person} sizes="(min-width: 1024px) 32vw, 90vw" priority />
              <dl className="mt-5 divide-y divide-line border-y border-line text-[1rem]">
                <div className="py-3">
                  <dt className="text-muted">
                    <T>जन्म</T>
                  </dt>
                  <dd className="mt-0.5 text-ink">
                    <TB v={person.born} />
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-muted">
                    <T>निधन</T>
                  </dt>
                  <dd className="mt-0.5 text-ink">
                    <TB v={person.died} />
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-muted">
                    <T>क्षेत्र</T>
                  </dt>
                  <dd className="mt-0.5 text-ink">
                    <TB v={person.category} />
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <div className="lg:col-span-8">
            <Reveal>
              <h1 className="h-page">
                <TB v={nameOf(person)} />
              </h1>
              <p className="mt-2 text-lg font-semibold text-brand-red-deep">{person.years}</p>
              <div className="mt-6">
                <IdealQuoteView quote={person.quote} size="detail" showOriginal />
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="h-section">
                <T>पृष्ठभूमि</T>
              </h2>
              <div className="justify-text mt-4 space-y-4 text-[1.1rem] leading-[1.85] text-ink-2">
                {person.background.map((p, k) => (
                  <p key={k}>
                    <TB v={p} />
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="h-section">
                <T>प्रमुख योगदान</T>
              </h2>
              <ul className="mt-4 grid gap-3">
                {person.contributions.map((c, k) => (
                  <li key={k} className="flex gap-3 text-[1.05rem] leading-relaxed text-ink-2">
                    <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand-red" />
                    <span>
                      <TB v={c} />
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="h-section">
                <T>विचार एवं दर्शन</T>
              </h2>
              <p className="justify-text mt-4 text-[1.1rem] leading-[1.85] text-ink-2">
                <TB v={person.philosophy} />
              </p>
            </Reveal>

            <nav aria-label="आदर्श / Ideals" className="mt-12 grid gap-3 border-t border-line pt-6 sm:grid-cols-3">
              <Link href={`/ideals/${prev.id}`} className="btn btn-ghost btn-sm justify-start">
                <ChevronLeft className="h-4 w-4" />
                <span className="truncate">
                  <TB v={nameOf(prev)} />
                </span>
              </Link>
              <Link href="/ideals" className="btn btn-primary btn-sm">
                <T>सभी आदर्श देखें</T>
              </Link>
              <Link href={`/ideals/${next.id}`} className="btn btn-ghost btn-sm justify-end">
                <span className="truncate">
                  <TB v={nameOf(next)} />
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          </div>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(ld) }} />
    </>
  );
}
