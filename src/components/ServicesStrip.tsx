import Link from "next/link";
import type { Dict } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";

/** Home: the public services (e-Card, ideals) as plain cards under a thin rule. Shown only when SHOW_SERVICES is on (lib/site.ts). */
export default function ServicesStrip({ lang, t }: { lang: Locale; t: Dict }) {
  const s = t.servicesStrip;
  return (
    <section aria-labelledby="services-title" className="surface-ivory pb-20 md:pb-28">
      <div className="shell">
        <div className="flex flex-col gap-4 border-t border-line pt-12 md:flex-row md:items-end md:justify-between md:gap-12">
          <h2 id="services-title" className="title-md">
            {s.title}
          </h2>
          <p className="max-w-[34rem] text-left text-ink-soft">{s.lead}</p>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {s.items.map((item, i) => (
            <li key={item.path}>
              <Link
                href={href(lang, item.path)}
                className={`group flex h-full flex-col rounded-lg border-t-4 bg-white p-7 shadow-[0_18px_36px_-28px_rgb(22_24_28/0.35)] ring-1 ring-line transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-30px_rgb(110_11_18/0.45)] ${
                  i % 2 === 0 ? "border-brand-red" : "border-green"
                }`}
              >
                <span className="text-sm font-semibold tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-[1.5rem] leading-snug text-ink">{item.title}</h3>
                <p className="mt-3 flex-1 text-left text-[0.9375rem] leading-relaxed text-ink-soft">{item.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-red-dk">
                  {item.cta}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
