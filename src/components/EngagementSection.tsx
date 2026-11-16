import Image from "next/image";
import Link from "next/link";
import type { Dict } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

export default function EngagementSection({
  lang,
  t,
}: {
  lang: Locale;
  t: Dict;
}) {
  const e = t.engagement;

  // Selected landscape & perfectly proportioned photos that do not crop heads or faces
  const photos = [
    {
      src: "/images/rohit-pandey-akhilesh-shivpal-bouquet.webp",
      alt: lang === "hi" ? "श्री अखिलेश यादव व श्री शिवपाल सिंह यादव जी के साथ" : "With Akhilesh Yadav and Shivpal Singh Yadav",
      width: 1024,
      height: 682,
    },
    {
      src: "/images/rohit-pandey-party-colleagues-gathering.webp",
      alt: lang === "hi" ? "पार्टी सहयोगियों और कार्यकर्ताओं के साथ" : "With party colleagues and supporters",
      width: 1280,
      height: 854,
    },
    {
      src: "/images/rohit-pandey-village-supporters.webp",
      alt: lang === "hi" ? "विधानसभा क्षेत्र में ग्रामीणों के साथ" : "With village residents",
      width: 1024,
      height: 684,
    },
    {
      src: "/images/rohit-pandey-mohanbara-rajbhar-samaj-welcome.webp",
      alt: lang === "hi" ? "मोहनबरा में समाज द्वारा स्वागत" : "Community welcome in Mohanbara",
      width: 1504,
      height: 1004,
    },
    {
      src: "/images/rohit-pandey-sp-office-group-photo-01.webp",
      alt: lang === "hi" ? "पार्टी कार्यालय में साथियों के साथ" : "Group photo at party office",
      width: 1280,
      height: 853,
    },
    {
      src: "/images/rohit-pandey-akhilesh-yadav-meeting.webp",
      alt: lang === "hi" ? "राष्ट्रीय अध्यक्ष अखिलेश यादव जी से भेंट" : "Meeting with Akhilesh Yadav",
      width: 764,
      height: 782,
    },
  ];

  return (
    <section
      aria-labelledby="engagement-title"
      className="surface-ivory border-t border-line/60 py-16 sm:py-20 md:py-24"
    >
      <div className="shell">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          {/* Left Column: Fixed / Sticky at top, non-scrollable */}
          <div className="flex flex-col items-start lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <h2
              id="engagement-title"
              className="font-heading text-3xl font-bold leading-[1.2] tracking-tight text-ink sm:text-4xl lg:text-[2.65rem]"
            >
              {e.title}
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {e.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={`/${lang}/media`}
                className="inline-flex items-center gap-2.5 rounded-full border border-ink/20 bg-paper px-6 py-3 font-display text-sm font-semibold text-ink shadow-xs transition-all duration-200 hover:border-red hover:bg-red hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-4.5"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 0v9.5c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-9.5a.75.75 0 0 0-.75-.75H3.25a.75.75 0 0 0-.75.75ZM5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm8.72 2.22a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1-1.06 1.06L14.25 11.81l-2.47 2.47a.75.75 0 0 1-1.06 0L8.25 11.81l-3.47 3.47a.75.75 0 0 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0l2.47 2.47 3.47-3.47Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{e.cta}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Scrollable Images Gallery */}
          <div className="lg:col-span-7">
            <div className="scroll-smooth lg:max-h-[640px] lg:overflow-y-auto lg:pr-2.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-ink/15 hover:[&::-webkit-scrollbar-thumb]:bg-red/50">
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:gap-5 pb-2">
                {photos.map((photo, i) => (
                  <div
                    key={photo.src}
                    className="group relative aspect-[3/2] sm:aspect-[4/3] overflow-hidden rounded-xl bg-tint shadow-xs ring-1 ring-black/5 transition-all duration-300 hover:shadow-md sm:rounded-2xl md:rounded-3xl"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 48vw"
                      priority={i < 2}
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
