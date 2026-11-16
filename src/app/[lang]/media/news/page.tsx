import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PressSection from "@/components/PressSection";
import { pressClippings } from "@/lib/content";
import { resolveLang } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/media">): Promise<Metadata> {
  const { lang, t } = await resolveLang(params);
  return pageMetadata({
    lang,
    path: "/media/news",
    title: t.media.newsTitle,
    description: t.media.newsSubtitle,
  });
}

export default async function NewsPage({ params }: PageProps<"/[lang]/media">) {
  const { lang, t } = await resolveLang(params);
  const m = t.media;

  return (
    <>
      <PageHeader
        lang={lang}
        trail={[
          { name: t.nav.media, path: "/media" },
          { name: m.newsTitle, path: "/media/news" },
        ]}
        title={m.newsTitle}
        intro={m.newsSubtitle}
        titleSize="lg"
      />

      <section aria-labelledby="press-title" className="shell py-16 md:py-24">
        <PressSection
          items={pressClippings}
          lang={lang}
          labels={{
            title: m.newsTitle,
            subtitle: m.newsSubtitle,
            viewClipping: m.viewClipping,
            close: m.close,
            prev: m.prev,
            next: m.next,
            of: m.of,
            dialog: m.dialog,
          }}
        />
      </section>
    </>
  );
}
