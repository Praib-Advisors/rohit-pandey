import type { Dict } from "@/lib/dictionary";
import { href, type Locale } from "@/lib/i18n";
import { navItems } from "@/lib/nav";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import SectionLink from "./SectionLink";
import SocialLinks from "./SocialLinks";
import Wave from "./Wave";

export default function Footer({ lang, t }: { lang: Locale; t: Dict }) {
  return (
    <>
      <Wave tone="deep" />
      <footer className="on-dark relative isolate overflow-hidden bg-[linear-gradient(160deg,#4a0a10_0%,#6e0b12_55%,#3a070c_100%)] pb-14 [--color-ink-soft:rgb(255_255_255/0.78)] md:pb-0">
        {/* colour-only glows, no photographs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_0%,rgb(255_255_255/0.08),transparent_65%)]" />
          <div className="absolute -bottom-40 -left-24 size-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(18_161_80/0.22),transparent)]" />
        </div>

        <div className="shell grid gap-12 pb-14 pt-16 md:grid-cols-12 md:pb-16 md:pt-24">
          <div className="md:col-span-5">
            <p className="w-fit">
              <Logo size="lg" plate alt={t.person.name} />
            </p>
            <p className="mt-6 font-display text-[1.5rem] leading-snug text-ink">{t.person.role}</p>
            <p className="mt-1 text-ink-soft">{t.person.placeLong}</p>
            <SocialLinks className="mt-7" />
          </div>

          <nav aria-label={t.footer.navigate} className="md:col-span-4">
            <p className="eyebrow border-b border-line pb-3">{t.footer.navigate}</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 text-[0.9375rem]">
              {[...navItems, { key: "khalilabad", path: "/khalilabad" } as const].map((item) => (
                <li key={item.key}>
                  <SectionLink href={href(lang, item.path)} className="inline-flex min-h-11 items-center text-ink-soft transition-colors hover:text-ink">
                    {t.nav[item.key]}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow border-b border-line pb-3">{t.footer.language}</p>
            <LanguageSwitcher lang={lang} label={t.footer.language} className="mt-3 text-base" />
          </div>
        </div>

        <div className="border-t border-line">
          <div className="shell flex flex-col gap-1 py-5 text-[0.8125rem] text-ink-soft sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 {t.person.name}</span>
            <span className="flex items-center gap-5">
              <SectionLink href={href(lang, "/privacy")} className="inline-flex min-h-11 items-center hover:text-ink">
                {t.footer.privacy}
              </SectionLink>
              <SectionLink href={href(lang, "/terms")} className="inline-flex min-h-11 items-center hover:text-ink">
                {t.footer.terms}
              </SectionLink>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
