import type { Metadata } from "next";
import Image from "next/image";
import FeaturedVideo from "@/components/FeaturedVideo";
import MediaGallery, { type GalleryItem } from "@/components/MediaGallery";
import PressSection from "@/components/PressSection";
import { galleryLabels, toGalleryItems } from "@/components/galleryItems";
import PageHeader from "@/components/PageHeader";
import { getVideoItems } from "@/components/VideoSection";
import YouTubePlayer from "@/components/YouTubePlayer";
import { fullGallery, images, pressClippings, updates } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { resolveLang } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { YOUTUBE_CHANNEL_URL } from "@/lib/site";
import { getPlayerVideos } from "@/lib/youtube";

export async function generateMetadata({ params }: PageProps<"/[lang]/media">): Promise<Metadata> {
  const { lang, t } = await resolveLang(params);
  return pageMetadata({ lang, path: "/media", title: t.meta.media.title, description: t.meta.media.description });
}

/**
 * Every photograph used on the site: the photos from each update (newest
 * first), then the party photographs. A photograph is listed once. The
 * Akhilesh Yadav photograph is moved to the front as the feature.
 */
function allPhotos(lang: Locale, curated: GalleryItem[]): GalleryItem[] {
  const seen = new Set(curated.map((c) => c.src));
  const fromUpdates: GalleryItem[] = [];
  for (const u of updates) {
    [u.image, ...(u.gallery ?? [])].forEach((photo, i) => {
      if (!photo || seen.has(photo.src)) return;
      seen.add(photo.src);
      fromUpdates.push({
        id: `${u.slug}-${i}`,
        src: photo.src,
        width: photo.width,
        height: photo.height,
        alt: photo.alt[lang],
        caption: photo.alt[lang],
      });
    });
  }
  const all = [...fromUpdates, ...curated];
  // The photograph with Samajwadi Party national president Akhilesh Yadav always leads the page.
  const lead = all.findIndex((p) => p.src === images.joining.src);
  return lead > 0 ? [all[lead], ...all.slice(0, lead), ...all.slice(lead + 1)] : all;
}

export default async function MediaPage({ params }: PageProps<"/[lang]/media">) {
  const { lang, t } = await resolveLang(params);
  const m = t.media;
  const photos = allPhotos(lang, toGalleryItems(t, fullGallery));
  const fieldVideos = getVideoItems(lang);
  const { items: channelVideos } = await getPlayerVideos(lang, 8);

  return (
    <>
      <PageHeader
        lang={lang}
        trail={[{ name: t.nav.media, path: "/media" }]}
        title={m.label}
        intro={m.intro}
        description={m.description}
        titleSize="lg"
        mediaSide="left"
        media={
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-tint shadow-[0_24px_60px_-32px_rgb(22_24_28/0.55)] ring-1 ring-black/5">
            <Image
              src="/images/rohit-pandey-media-meeting.png"
              alt={m.heroAlt}
              fill
              priority
              sizes="(min-width: 768px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
        }
        actions={
          <nav aria-label={t.nav.media} className="flex flex-wrap gap-3">
            <a
              href="#photos"
              className="inline-flex min-h-14 items-center border border-ink px-6 py-3 font-display text-base text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {m.title}
            </a>
            <a
              href="#press"
              className="inline-flex min-h-14 items-center border border-ink px-6 py-3 font-display text-base text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {m.newsTitle}
            </a>
            <a
              href="#videos"
              className="inline-flex min-h-14 items-center border border-ink px-6 py-3 font-display text-base text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {m.videosTitle}
            </a>
          </nav>
        }
      />

      <section id="photos" aria-labelledby="photos-title" className="shell scroll-mt-28 py-16 md:py-24">
        <h2 id="photos-title" className="title-lg text-ink">
          {m.title}
        </h2>
        <div className="mt-10">
          <MediaGallery items={photos} labels={galleryLabels(t)} />
        </div>
      </section>

      <section id="press" aria-labelledby="press-title" className="scroll-mt-28 border-t border-line/60 bg-tint/30 py-16 md:py-24">
        <div className="shell">
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
        </div>
      </section>

      <section id="videos" aria-labelledby="videos-title" className="surface-tint scroll-mt-28 py-16 md:py-24">
        <div className="shell">
          <h2 id="videos-title" className="title-lg text-ink">
            {m.videosTitle}
          </h2>

          {fieldVideos.length > 0 && (
            <div className="mt-12">
              <h3 className="mb-8 font-heading text-[1.5rem] leading-tight">{m.fieldVideos}</h3>
              <FeaturedVideo
                items={fieldVideos}
                labels={{ play: t.videos.play, readMore: t.videos.readMore, more: t.videos.more }}
              />
            </div>
          )}

          <div className="mt-20">
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
              <h3 className="font-heading text-[1.5rem] leading-tight">{t.social.youtube}</h3>
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw min-h-11 items-center text-sm text-red-dk"
              >
                {t.social.openChannel}
                <span className="sr-only"> ({t.footer.newTab})</span>
              </a>
            </div>
            <div className="max-w-4xl">
              <YouTubePlayer
                videos={channelVideos}
                labels={{ latest: t.social.latestVideo, more: t.social.moreVideos, play: t.social.play }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
