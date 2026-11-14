"use client";

import type { IdealQuote } from "@/data/ideals";
import { T, TB, useLang } from "@/lib/lang";

const QuoteMark = ({ className = "" }: { className?: string }) => (
  <svg aria-hidden="true" viewBox="0 0 32 32" className={className} fill="currentColor">
    <path d="M13 6C7.5 8 4 12.5 4 18.5V26h9v-9H8.5C8.7 13.8 10.4 11.6 13 10V6zm15 0c-5.5 2-9 6.5-9 12.5V26h9v-9h-4.5c.2-3.2 1.9-5.4 4.5-7V6z" />
  </svg>
);

/**
 * A quotation or a paraphrase, labelled for what it is:
 * - direct / translation: shown inside quotation marks with a quotation icon. In Hindi a translation says so
 *   and the original English words are shown beneath; in English the original words are the quotation;
 * - paraphrase: shown as plain text under the label "विचारों का भावार्थ", never in quotation marks.
 */
export default function IdealQuoteView({
  quote,
  size = "card",
  showOriginal = false,
}: {
  quote: IdealQuote;
  size?: "card" | "large" | "detail" | "row";
  showOriginal?: boolean;
}) {
  const { lang } = useLang();
  const isPara = quote.type === "paraphrase";
  const textClass =
    size === "large"
      ? "font-display text-2xl leading-relaxed text-ink sm:text-3xl"
      : size === "row"
        ? "font-display text-xl leading-[1.7] text-ink sm:text-2xl"
        : size === "detail"
        ? "font-display text-xl leading-relaxed text-ink sm:text-2xl"
        : "line-clamp-5 text-[1.02rem] leading-relaxed text-ink-2";
  const label = isPara ? "विचारों का भावार्थ" : quote.type === "translation" && lang === "hi" ? "हिंदी अनुवाद" : "उद्धरण";
  return (
    <figure>
      <figcaption className="flex items-center gap-2 text-base font-semibold text-muted">
        {!isPara && <QuoteMark className="h-4 w-4 text-brand-red" />}
        <T>{label}</T>
      </figcaption>
      <blockquote className={`mt-2 ${size === "row" ? "" : "border-l-4 border-brand-red pl-4"} ${textClass}`}>
        {isPara ? (
          <p>
            <TB v={quote.text} />
          </p>
        ) : (
          <p>
            “<TB v={quote.text} />”
          </p>
        )}
      </blockquote>
      {showOriginal && quote.type !== "paraphrase" && lang === "hi" && (
        <p className="mt-3 pl-5 text-sm text-muted">
          <span className="font-semibold">
            <T>मूल कथन:</T>
          </span>{" "}
          “{quote.original}”
        </p>
      )}
    </figure>
  );
}
