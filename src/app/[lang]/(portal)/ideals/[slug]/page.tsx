import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IdealDetail from "@/components/ideals/IdealDetail";
import { idealBySlug, ideals } from "@/data/ideals";
import { hasLocale, locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => ideals.map((p) => ({ lang, slug: p.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const person = idealBySlug(slug);
  if (!hasLocale(lang) || !person) return {};
  return pageMetadata({
    lang,
    path: `/ideals/${person.id}`,
    title: lang === "en" ? person.nameEnglish : person.nameHindi,
    description: person.intro[lang].slice(0, 160),
  });
}

export default async function IdealPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const person = idealBySlug(slug);
  if (!hasLocale(lang) || !person) notFound();
  return <IdealDetail person={person} />;
}
