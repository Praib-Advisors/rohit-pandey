import type { Dict } from "@/lib/dictionary";
import ContentSlot from "./ContentSlot";

/** About page profile: the biography beside verified facts. The portrait already leads the page header. */
export default function ProfileIntro({ t }: { t: Dict }) {
  const { about } = t;

  return (
    <section aria-label={about.label} className="shell py-16 md:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-5 lg:col-span-7">
          <h2 className="title-md text-ink">{about.title}</h2>
          {about.bio.map((p, i) => (
            <p key={p} className={i === 0 ? "lede" : "text-ink-soft"}>
              {p}
            </p>
          ))}
          <div className="grid gap-3 pt-4">
            <ContentSlot label={t.slot.label}>{about.slotLegal}</ContentSlot>
            <ContentSlot label={t.slot.label}>{about.slotEducation}</ContentSlot>
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <dl className="grid border-t border-line sm:grid-cols-2">
            {about.facts.map((f, i) => (
              <div
                key={f.k}
                className={`border-b border-line py-4 ${i % 2 === 0 ? "sm:pr-6" : "sm:border-l sm:pl-6"} ${
                  i === about.facts.length - 1 && i % 2 === 0 ? "sm:col-span-2" : ""
                }`}
              >
                <dt className="text-[0.875rem] font-medium text-muted">
                  {f.k}
                </dt>
                <dd className="mt-1 font-display text-[1.1875rem] leading-snug">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
