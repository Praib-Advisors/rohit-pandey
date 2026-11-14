import type { Metadata } from "next";
import ECardMaker, { type CardOption } from "@/components/ecard/ECardMaker";
import PageHeader from "@/components/PageHeader";
import { portal } from "@/content/portal";
import { ecardTemplates } from "@/content/ecards";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { facebookPage } from "@/lib/site";
import { translate } from "@/lib/translate";

const t = portal.ecard;

export async function generateMetadata({ params }: PageProps<"/[lang]/e-card">): Promise<Metadata> {
  const { lang } = await resolveLang(params);
  return pageMetadata({ lang, path: "/e-card", title: translate(t.seoTitle, lang), description: translate(t.description, lang) });
}

const options: CardOption[] = ecardTemplates.map((c) => ({
  id: c.id,
  label: c.label,
  greeting: c.greeting,
  kicker: t.kicker,
  line: c.line,
  motif: c.motif,
  scene: c.scene,
  palette: c.palette,
}));

export default async function ECardPage({ params }: PageProps<"/[lang]/e-card">) {
  const { lang } = await resolveLang(params);
  const tr = (s: string) => translate(s, lang);
  // The card's foot line: the Facebook page address, which stays the same wherever the site runs.
  const footer = facebookPage.replace(/^https?:\/\/(www\.)?/, "");
  // The name and role printed on the card follow the page language (Hindi script on /hi).
  const person = getDictionary(lang).person;

  return (
    <>
      <PageHeader
        lang={lang}
        trail={[{ name: tr(portal.nav.ecard), path: "/e-card" }]}
        title={tr(t.title)}
        intro={tr(t.lead)}
        titleSize="md"
      />
      <section className="section">
        <div className="shell">
          <ECardMaker
            options={options}
            leader={{ name: person.name, role: person.role, photo: "/images/leader-card.webp", area: t.area }}
            footer={footer}
            fileStem="shubhkamna"
          />
        </div>
      </section>
    </>
  );
}
