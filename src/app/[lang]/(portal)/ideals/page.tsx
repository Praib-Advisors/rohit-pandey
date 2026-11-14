import type { Metadata } from "next";
import FeaturedQuote from "@/components/ideals/FeaturedQuote";
import IdealTile from "@/components/ideals/IdealTile";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/PortalReveal";
import { ideals } from "@/data/ideals";
import { T } from "@/lib/lang";
import { resolveLang } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { translate } from "@/lib/translate";

const TITLE = "हमारे आदर्श";
const SUBTITLE = "महान विचारों से प्रेरणा, बेहतर समाज की दिशा में एक कदम।";
const LEAD =
  "यह अनुभाग उन महान व्यक्तित्वों के जीवन, विचारों और योगदान को प्रस्तुत करता है, जिन्होंने भारतीय समाज, राजनीति, सामाजिक न्याय और राष्ट्र निर्माण को प्रभावित किया। उनके विचारों और जीवन-संघर्ष से प्रेरणा लेते हुए उनके योगदान को जानने का एक प्रयास।";
const DESCRIPTION =
  "भारतीय इतिहास, राजनीति, सामाजिक न्याय और राष्ट्र निर्माण में योगदान देने वाले महान व्यक्तित्वों के जीवन, विचारों और प्रेरणादायक उद्धरणों को जानें।";

export async function generateMetadata({ params }: PageProps<"/[lang]/ideals">): Promise<Metadata> {
  const { lang } = await resolveLang(params);
  return pageMetadata({ lang, path: "/ideals", title: translate(TITLE, lang), description: translate(DESCRIPTION, lang) });
}

export default async function IdealsPage({ params }: PageProps<"/[lang]/ideals">) {
  const { lang } = await resolveLang(params);
  const tr = (s: string) => translate(s, lang);
  return (
    <>
      <PageHeader
        lang={lang}
        trail={[{ name: tr(TITLE), path: "/ideals" }]}
        meta={tr(SUBTITLE)}
        title={tr(TITLE)}
        intro={tr(LEAD)}
        titleSize="lg"
      />

      <FeaturedQuote />

      <section aria-labelledby="ideals-title" className="section">
        <div className="shell">
          <h2 id="ideals-title" className="h-section text-center">
            <T>हमारे आदर्श</T>
          </h2>
          {/* The order is fixed (see data/ideals.ts); the ideals are listed one under the other. */}
          <ol className="mx-auto mt-8 max-w-4xl divide-y divide-line border-y border-line">
            {ideals.map((p) => (
              <li key={p.id} className="py-6 sm:py-8">
                <Reveal>
                  <IdealTile person={p} />
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
