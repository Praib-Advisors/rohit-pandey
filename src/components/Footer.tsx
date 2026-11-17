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
          <div className="shell flex flex-col items-center justify-between gap-4 py-5 text-[0.8125rem] text-ink-soft sm:flex-row">
            <span>© 2026 {t.person.name}</span>

            <a
              href="https://praibadvisors.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PRAIB Advisors LLP: Digital Experience Partner"
              className="group inline-flex items-center gap-3.5 rounded-full border border-white/20 bg-black/30 py-1.5 pl-4 pr-2 backdrop-blur-xs transition-all duration-200 hover:border-white/40 hover:bg-black/50"
            >
              <span className="flex flex-col text-left leading-tight">
                <span className="font-sans text-[10px] font-bold tracking-wider text-white/70 uppercase">
                  Digital Experience Partner
                </span>
                <span className="font-heading text-sm font-bold tracking-wide text-white transition-colors group-hover:text-white">
                  PRAIB Advisors LLP
                </span>
              </span>
              <span
                aria-hidden
                className="grid size-7 place-items-center rounded-full border border-amber-300/60 text-amber-200 transition-transform duration-200 group-hover:scale-110 group-hover:border-amber-200 group-hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </a>

          
          </div>
        </div>
      </footer>
    </>
  );
}
