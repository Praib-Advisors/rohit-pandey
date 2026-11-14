import { LocalLink as Link } from "@/lib/lang";
import { ArrowRight } from "@/components/icons";
import { nameOf, type Ideal } from "@/data/ideals";
import { T, TB } from "@/lib/lang";
import IdealImage from "./IdealImage";
import IdealQuoteView from "./IdealQuote";

/**
 * One row of the "हमारे आदर्श" list: a small portrait on the left; the name, years, the labelled quotation or
 * summary and the link to the full profile on the right. Rows are stacked one under the other, no card around
 * them. The whole portrait and the name open the full profile.
 */
export default function IdealTile({ person }: { person: Ideal }) {
  const href = `/ideals/${person.id}`;
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[12rem_minmax(0,1fr)]">
      <Link href={href} aria-label={person.nameHindi} className="block">
        <IdealImage person={person} sizes="(min-width: 1024px) 192px, (min-width: 640px) 160px, 104px" />
      </Link>
      <div>
        <h3 className="font-display text-[1.3rem] leading-snug text-ink sm:text-[1.6rem]">
          <Link href={href} className="transition-colors hover:text-brand-red-deep">
            <TB v={nameOf(person)} />
          </Link>
        </h3>
        <p className="mt-0.5 text-muted">{person.years}</p>
        <div className="mt-3 hidden sm:block">
          <IdealQuoteView quote={person.quote} size="card" />
        </div>
        <Link href={href} className="group mt-3 inline-flex items-center gap-1.5 font-semibold text-brand-red-deep">
          <T>और जानें</T>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
