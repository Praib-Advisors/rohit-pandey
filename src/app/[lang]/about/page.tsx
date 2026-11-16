import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import ProfileIntro from "@/components/ProfileIntro";
import BiographySection from "@/components/BiographySection";
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
        media={
          <div className="relative aspect-[3/2] w-full max-w-[37rem]">
            <Image
              src="/images/image.jpg"
              alt={lang === "hi" ? "रोहित पाण्डेय स्थानीय लोगों के साथ" : "Rohit Pandey walking with local residents"}
              fill
              sizes="(min-width: 768px) 38vw, 100vw"
              preload
              className="object-contain"
            />
          </div>
        }
      />
      <BiographySection t={t} lang={lang} />
      <ProfileIntro t={t} />
      <JourneySection t={t} />
      <ContactStrip lang={lang} t={t} />
    </>
  );
}
