import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import SocialService from "@/components/social-service/SocialService";
import { resolveLang } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { SHOW_SOCIAL_SERVICE } from "@/lib/site";
import { getSocialService } from "@/lib/socialService";

export async function generateMetadata({ params }: PageProps<"/[lang]/social-service">): Promise<Metadata> {
  if (!SHOW_SOCIAL_SERVICE) return {};
  const { lang, t } = await resolveLang(params);
  return pageMetadata({
    lang,
    path: "/social-service",
    title: t.meta.socialService.title,
    description: t.meta.socialService.description,
  });
}

export default async function SocialServicePage({ params }: PageProps<"/[lang]/social-service">) {
  // Switched off for now (see SHOW_SOCIAL_SERVICE in lib/site.ts)
  if (!SHOW_SOCIAL_SERVICE) notFound();
  const { lang, t } = await resolveLang(params);
  const s = t.socialService;
  const { items, issues } = getSocialService(lang);
  const stats = [
    { n: issues.length, label: s.statIssues },
    { n: items.length, label: s.statUpdates },
    { n: new Set(items.map((i) => i.place)).size, label: s.statPlaces },
  ];

  return (
    <>
      <PageHeader
        lang={lang}
        trail={[{ name: t.nav.socialService, path: "/social-service" }]}
        title={s.title}
        intro={s.lead}
        tone="gradient"
        titleSize="xl"
        aside={
          <dl className="grid grid-cols-3 gap-3 md:grid-cols-1 md:gap-4 lg:grid-cols-3">
            {stats.map((st, i) => (
              <div
                key={st.label}
                className="hero-line flex flex-col-reverse justify-end rounded-2xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-sm md:p-5"
                style={{ ["--i" as string]: i + 2 }}
              >
                <dt className="mt-2 text-[0.8125rem] leading-snug text-white/75 md:text-[0.875rem]">{st.label}</dt>
                <dd className="numeral text-[2.5rem] text-white md:text-[3.25rem]">{String(st.n).padStart(2, "0")}</dd>
              </div>
            ))}
          </dl>
        }
      />
      <SocialService lang={lang} t={t} heading={false} />
    </>
  );
}
