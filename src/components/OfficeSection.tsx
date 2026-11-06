import Link from "next/link";
import type { Dict } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";
import { office, SHOW_CONTENT_SLOTS } from "@/lib/site";
import ContactForm from "./ContactForm";
import ContentSlot from "./ContentSlot";

/** Office address with a map, the ways to reach the office, the volunteer call to action and the enquiry form. */
export default function OfficeSection({
  lang,
  t,
  heading = true,
}: {
  lang: Locale;
  t: Dict;
  heading?: boolean;
}) {
  const c = t.contact;
  const o = c.office;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(office.mapQuery)}&hl=${lang}&z=16&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapQuery)}`;
  const hasChannels = Boolean(office.phone || office.whatsapp || office.email);
  const joinHref = office.joinUrl || `${href(lang, "/contact")}#contact-form`;

  return (
    <section id="office" aria-labelledby="office-title" className="surface-ivory grain py-24 md:py-32">
      <div className="shell">
        <h2 id="office-title" className={heading ? "title-lg text-ink" : "sr-only"}>
          {c.title}
        </h2>

        <div className={`${heading ? "mt-12" : ""} grid gap-12 lg:grid-cols-12 lg:gap-14`}>
          <div className="min-w-0 lg:col-span-5">
            <h3 className="font-heading text-[1.5rem] leading-tight">{o.label}</h3>
            <address className="mt-3 not-italic text-ink-soft">{o.address}</address>

            {hasChannels && (
              <ul className="mt-5 space-y-1 text-ink-soft">
                {(office.phone || office.whatsapp) && (
                  <li className="flex flex-wrap gap-x-6">
                    {office.phone && (
                      <a href={`tel:+${office.phone}`} className="inline-flex min-h-11 items-center font-semibold text-red-dk">
                        {o.call}: +{office.phone}
                      </a>
                    )}
                    {office.whatsapp && (
                      <a
                        href={`https://wa.me/${office.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center font-semibold text-red-dk"
                      >
                        {o.whatsapp}
                        <span className="sr-only"> ({t.footer.newTab})</span>
                      </a>
                    )}
                  </li>
                )}
                {office.email && (
                  <li>
                    <a href={`mailto:${office.email}`} className="inline-flex min-h-11 items-center font-semibold text-red-dk">
                      {office.email}
                    </a>
                  </li>
                )}
              </ul>
            )}
            {!hasChannels && SHOW_CONTENT_SLOTS && (
              <ContentSlot label={t.slot.label} className="mt-5">
                {c.slot}
              </ContentSlot>
            )}

            <div className="zoom-media mt-6 overflow-hidden rounded-2xl border border-line bg-sand shadow-[0_24px_50px_-34px_rgb(22_24_28/0.5)]">
              <iframe
                title={o.map}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block aspect-[4/3] w-full border-0"
              />
            </div>
            <a href={mapLink} target="_blank" rel="noopener noreferrer" className="link-draw mt-3 min-h-11 items-center text-sm text-red-dk">
              {o.openMap}
              <span className="sr-only"> ({t.footer.newTab})</span>
            </a>

            <div className="mt-10 rounded-2xl bg-green-deep p-7 text-white on-dark [--color-ink:white] md:p-8">
              <h3 className="font-heading text-[1.5rem] leading-tight">{c.join.title}</h3>
              <p className="mt-2 text-ink-soft">{c.join.body}</p>
              {office.joinUrl ? (
                <a href={joinHref} target="_blank" rel="noopener noreferrer" className="btn mt-6 rounded-full bg-white px-6 text-green-deep hover:-translate-y-0.5 hover:bg-white/90">
                  {c.join.cta}
                  <span className="sr-only"> ({t.footer.newTab})</span>
                </a>
              ) : (
                <Link href={joinHref} className="btn mt-6 rounded-full bg-white px-6 text-green-deep hover:-translate-y-0.5 hover:bg-white/90">
                  {c.join.cta}
                </Link>
              )}
            </div>
          </div>

          <div id="contact-form" className="min-w-0 scroll-mt-28 rounded-[1.75rem] bg-white p-6 shadow-[0_40px_90px_-50px_rgb(110_11_18/0.45)] ring-1 ring-black/5 md:p-10 lg:col-span-7">
            <ContactForm t={c.form} />
          </div>
        </div>
      </div>
    </section>
  );
}
