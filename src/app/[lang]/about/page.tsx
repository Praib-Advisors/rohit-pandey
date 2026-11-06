import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProfileIntro from "@/components/ProfileIntro";
import ContactStrip from "@/components/ContactStrip";
import JourneySection from "@/components/JourneySection";
import JsonLd from "@/components/JsonLd";
import { resolveLang } from "@/lib/page";
import { pageMetadata, personJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang, t } = await resolveLang(params);
  return pageMetadata({ lang, path: "/about", title: t.meta.about.title, description: t.meta.about.description });
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang, t } = await resolveLang(params);
  return (
    <>
      <JsonLd data={personJsonLd(lang)} />
      <PageHeader
        lang={lang}
        trail={[{ name: t.nav.about, path: "/about" }]}
        title={t.person.name}
        titleSize="xl"
        intro={`${t.person.role}, ${t.person.placeLong}`}
        tone="gradient"
      />
      <ProfileIntro t={t} />
      <JourneySection t={t} />
      <ContactStrip lang={lang} t={t} />
    </>
  );
}
