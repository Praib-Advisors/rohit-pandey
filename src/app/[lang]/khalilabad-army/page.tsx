import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import InfiniteCardSlider from "@/components/InfiniteCardSlider";
import ArmySocialSection from "@/components/khalilabad-army/ArmySocialSection";
import JoinArmySection from "@/components/khalilabad-army/JoinArmySection";
import ScrollToButton from "@/components/ScrollToButton";
import Wave from "@/components/Wave";
import { href } from "@/lib/i18n";
import { resolveLang } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

type IconProps = { className?: string };

function Stroke({
  className,
  children,
  width = 2,
}: IconProps & { children: React.ReactNode; width?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
} 

function ArrowDownIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </Stroke>
  );
}

function ArrowRightIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Stroke>
  );
}

function GraduationCapIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </Stroke>
  );
}

function HeartPulseIcon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l1.5-3 2 6.5 1.5-3.5h5.28" />
    </Stroke>
  );
}

function Building2Icon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v8h4" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11h-4" />
      <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
    </Stroke>
  );
}

function Users2Icon({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Stroke>
  );
}

const priorityIcons: Record<string, (p: IconProps) => React.JSX.Element> = {
  education: GraduationCapIcon,
  healthcare: HeartPulseIcon,
  development: Building2Icon,
  welfare: Users2Icon,
};

const priorityImages: Record<string, string> = {
  education: "/images/khalilabad-army/education.webp",
  healthcare: "/images/khalilabad-army/healthcare.webp",
  development: "/images/khalilabad-army/development.png",
  welfare: "/images/khalilabad-army/welfare.webp",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang, t } = await resolveLang(params);
  return pageMetadata({
    lang,
    path: "/khalilabad-army",
    title: t.meta.khalilabadArmy.title,
    description: t.meta.khalilabadArmy.description,
  });
}

export default async function KhalilabadArmyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang, t } = await resolveLang(params);
  const army = t.khalilabadArmy;

  return (
    <div className="relative overflow-hidden">
      {/* ------------------------------------------------------------ */}
      {/* 1. Hero Section                                              */}
      {/* ------------------------------------------------------------ */}
      <section
        aria-label={army.hero.title}
        className="relative flex min-h-[92vh] items-start overflow-hidden bg-black pb-14 pt-32 text-white sm:min-h-[85vh] sm:pb-16 sm:pt-36 md:min-h-[80vh] md:items-center md:py-28 lg:min-h-[85vh] lg:py-32"
      >
        {/* Full-width Background Image: Desktop and Mobile separate */}
        <div className="pointer-events-none absolute inset-0">
          {/* Mobile Background Banner */}
          <Image
            src="/images/rohit-pandey-khalilabad-army-hero-mobile.jpg"
            alt={army.hero.title}
            fill
            priority
            sizes="100vw"
            className="hero-art object-cover object-bottom md:hidden"
          />

          {/* Desktop Background Banner */}
          <Image
            src="/images/rohit-pandey-hero-banner.jpg"
            alt={army.hero.title}
            fill
            priority
            sizes="100vw"
            className="hero-art hidden object-cover object-[right_top] md:block"
          />

          {/* Overlays */}
          {/* Mobile Overlay: dark at top for text readability, subtle over portrait, dark at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/85 md:hidden" />

          {/* Desktop Overlay: left-to-right gradient for text readability while keeping portrait crisp */}
          <div className="absolute inset-0 hidden bg-gradient-to-t from-black/90 via-black/40 to-black/60 md:block" />
          <div className="absolute inset-y-0 left-0 hidden w-[72%] bg-gradient-to-r from-black/95 via-black/80 to-transparent md:block" />
        </div>

        {/* Content Container */}
        <div className="shell relative z-20 w-full pointer-events-auto">
          <div className="max-w-2xl text-left md:max-w-xl lg:max-w-2xl">
            {/* Title / Eyebrow */}
            {army.hero.title ? (
              <span
                className="hero-line inline-block text-xs font-semibold uppercase tracking-widest text-red-tint/90 sm:text-sm"
                style={{ "--i": 0 } as React.CSSProperties}
              >
                {army.hero.title}
              </span>
            ) : null}

            {/* Main Heading */}
            <h1
              className="hero-line mt-2 font-heading text-2xl font-normal tracking-tight text-white sm:mt-3 sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              {army.hero.heading}
            </h1>

            {/* Description */}
            <p
              className="hero-line mt-3 text-sm font-normal leading-relaxed text-white/85 sm:mt-5 sm:text-xl"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              {army.hero.description}
            </p>

            {/* Single CTA Button (Compact on mobile so it never overlaps the portrait) */}
            <div
              className="hero-line mt-4 flex items-center sm:mt-6 md:mt-8"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <ScrollToButton
                targetId="about"
                label={army.hero.cta}
                className="inline-flex items-center gap-2 rounded-md bg-red-dk px-4.5 py-2 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:bg-red-deep hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:gap-2.5 sm:px-6 sm:py-3 sm:text-sm md:px-7 md:py-3.5 md:text-base cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Signature Flag Strip */}
      <div aria-hidden className="flag-strip" />

      {/* ------------------------------------------------------------ */}
      {/* 2. About Khalilabad Army                                     */}
      {/* ------------------------------------------------------------ */}
      <section
        id="about"
        aria-labelledby="about-army-heading"
        className="surface-ivory py-20 md:py-28 scroll-mt-24 md:scroll-mt-28"
      >
        <div className="shell">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Image Column */}
            <div className="lg:col-span-6" data-reveal="left">
              <div className="group relative overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-soft">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-tint sm:aspect-[16/11]">
                  <Image
                    src="/images/rohit-pandey-youth-march.jpg"
                    alt={army.about.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-3 text-center sm:text-left">
                  <span className="text-xs font-semibold text-red-dk uppercase tracking-wider">
                    {lang === "hi" ? "सामूहिक सहभागिता" : "Community Participation"}
                  </span>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {army.about.imageAlt}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-6" data-reveal="right">
              <h2
                id="about-army-heading"
                className="font-heading text-2xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl"
              >
                {lang === "hi" ? (
                  <>
                    <span className="block">एक सोच, एक उद्देश्य,</span>
                    <span className="block">एक परिवार</span>
                  </>
                ) : (
                  army.about.heading
                )}
              </h2>

              <p className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg">
                {army.about.description}
              </p>

              <div className="mt-8 space-y-3 border-t border-line pt-6">
                <div className="flex items-start gap-3">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-green-dk" />
                  <p className="text-sm font-medium text-ink">
                    {lang === "hi"
                      ? "युवाओं, नागरिकों और सामाजिक कार्यकर्ताओं का साझा मंच"
                      : "A shared platform connecting youth, citizens, and social workers"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-green-dk" />
                  <p className="text-sm font-medium text-ink">
                    {lang === "hi"
                      ? "क्षेत्रीय समस्याओं की पहचान और समाधान के सामूहिक प्रयास"
                      : "Collective efforts toward identifying and resolving local issues"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-green-dk" />
                  <p className="text-sm font-medium text-ink">
                    {lang === "hi"
                      ? "सकारात्मक सामाजिक बदलाव और जनसेवा को प्रोत्साहन"
                      : "Encouraging positive social transformation and public welfare"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 3. Khalilabad Army - Cinematic Community Initiative Hero     */}
      {/* ------------------------------------------------------------ */}
      <section
        id="vision"
        aria-labelledby="vision-army-heading"
        className="relative flex min-h-[78vh] sm:min-h-[82vh] md:min-h-[86vh] lg:min-h-[90vh] items-center overflow-hidden bg-[#201D1D] text-white py-16 sm:py-24 md:py-28 lg:py-32"
      >
        {/* Full-width Background Image: Authentic Group Photograph */}
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/images/khalilabad-army/khalilabad-army-march-night-v2.jpg"
            alt={lang === "hi" ? "खलीलाबाद में युवाओं के साथ पदयात्रा करते रोहित पाण्डेय" : "Rohit Pandey walking with youth collective in Khalilabad"}
            fill
            sizes="100vw"
            priority
            className="hero-art object-cover object-[center_15%] sm:object-[center_15%] md:object-[62%_15%] lg:object-[65%_18%]"
          />

          {/* Subtle base tint */}
          <div className="absolute inset-0 bg-[#201D1D]/20" />

          {/* Smooth, natural continuous gradient: dark on left for text, completely clear on right for photograph */}
          <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#201D1D] via-[#201D1D]/90 via-40% via-[#201D1D]/35 to-transparent to-85%" />

          {/* Smooth mobile overlay: dark at text area, bright on group photograph */}
          <div className="absolute inset-0 md:hidden bg-gradient-to-b from-[#201D1D]/95 via-[#201D1D]/75 via-55% to-[#201D1D]/35" />

          {/* Soft top & bottom edge blends */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#201D1D]/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#201D1D]/90 to-transparent" />
        </div>

        {/* Content Container (Left / Left-of-Center) */}
        <div className="shell relative z-20 w-full pointer-events-auto">
          <div className="max-w-2xl text-left md:max-w-xl lg:max-w-2xl" data-reveal="fade">
            {/* Main Heading */}
            <h2
              id="vision-army-heading"
              className="font-heading text-2xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.25] sm:leading-[1.2]"
            >
              {lang === "hi" ? (
                <>
                  <span className="block text-white">एकजुट युवा,</span>
                  <span className="block text-[#C7A56A] mt-2 sm:mt-3 md:mt-4">विकसित खलीलाबाद</span>
                </>
              ) : (
                <>
                  <span className="block text-white">United Youth,</span>
                  <span className="block text-[#C7A56A] mt-2 sm:mt-3 md:mt-4">Stronger Khalilabad.</span>
                </>
              )}
            </h2>

            {/* Description */}
            <p className="mt-5 sm:mt-6 text-left text-sm sm:text-base md:text-lg leading-relaxed text-[#F5F1EA]/90 font-normal max-w-xl [hyphens:none] [word-break:normal] break-normal">
              {lang === "hi"
                ? "खलीलाबाद आर्मी युवाओं, नागरिकों और सामाजिक कार्यकर्ताओं को एक साथ जोड़ने वाला साझा मंच है, जो क्षेत्र के बेहतर भविष्य के लिए जनभागीदारी, सामाजिक सहयोग और सामूहिक प्रयासों को बढ़ावा देता है।"
                : "Khalilabad Army is a shared platform connecting youth, citizens, and social workers, fostering public participation, social cooperation, and collective efforts for a better future for the region."}
            </p>

            {/* Primary CTA */}
            <div className="mt-6 sm:mt-9 flex items-center">
              <a
                href="#join-army"
                className="group inline-flex w-full sm:w-auto justify-center items-center gap-3 rounded-md bg-[#7F1725] px-7 py-3.5 text-sm sm:text-base font-semibold text-[#F5F1EA] shadow-xl transition-all duration-300 hover:bg-[#9e1018] hover:shadow-2xl hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C7A56A] cursor-pointer"
              >
                <span>
                  {lang === "hi" ? "खलीलाबाद आर्मी से जुड़ें" : "Join Khalilabad Army"}
                </span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1.5 font-bold text-base leading-none"
                >
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 4. Development Priorities                                    */}
      {/* ------------------------------------------------------------ */}
      <Wave tone="ivory" />
      <section
        id="priorities"
        aria-labelledby="priorities-army-heading"
        className="surface-ivory py-20 md:py-28"
      >
        <div className="shell">
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center" data-reveal="fade">
            <h2
              id="priorities-army-heading"
              className="font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl"
            >
              {army.priorities.heading}
            </h2>

            <p className="mt-4 text-base text-ink-soft sm:text-lg sm:translate-x-6 md:translate-x-8">
              {army.priorities.intro}
            </p>
          </div>

          {/* Four Priority Cards (2 cards per line) */}
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-7">
            {army.priorities.items.map((item, idx) => {
              const Icon = priorityIcons[item.id] ?? GraduationCapIcon;
              const bgImage = priorityImages[item.id];
              return (
                <article
                  key={item.id}
                  className="group relative flex aspect-[16/11] min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl border border-line/30 bg-ink p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-raised sm:min-h-[350px] sm:rounded-3xl sm:p-8"
                  data-reveal="zoom"
                  style={{ "--reveal-i": idx } as React.CSSProperties}
                >
                  {/* Background Image */}
                  {bgImage && (
                    <Image
                      src={bgImage}
                      alt={item.title}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="pointer-events-none object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}

                  {/* Dark Gradient Overlay for Readability */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent transition-opacity duration-300 group-hover:from-black/95 group-hover:via-black/55" />

                  {/* Card Content at bottom-left */}
                  <div className="relative z-10">
                    <Icon className="mb-2 size-6 text-white stroke-[1.8] drop-shadow" />

                    <h3 className="font-heading text-2xl font-bold tracking-tight text-white drop-shadow-md sm:text-3xl">
                      {item.title}
                    </h3>

                    <p className="mt-2 max-w-xl text-xs leading-relaxed text-white/85 drop-shadow sm:text-sm">
                      {item.desc}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 5. Activities & Initiatives                                  */}
      {/* ------------------------------------------------------------ */}
      <Wave tone="sand" />
      <section
        id="activities"
        aria-labelledby="activities-army-heading"
        className="surface-tint py-20 md:py-28"
      >
        <div className="shell">
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center" data-reveal="fade">
            <h2
              id="activities-army-heading"
              className="font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl"
            >
              {army.activities.heading}
            </h2>

            <p className="mt-4 text-base text-ink-soft sm:text-lg">
              {army.activities.intro}
            </p>
          </div>
        </div>

        {/* Activities Infinite Card Slider */}
        <div className="mt-12 w-full" data-reveal="fade">
          <InfiniteCardSlider items={army.activities.items} lang={lang} />
        </div>

        <div className="shell">
          {/* View More Button */}
          <div className="mt-10 flex justify-center" data-reveal="fade">
            <Link
              href={href(lang, "/media")}
              className="inline-flex items-center gap-2 rounded-md bg-green-dk px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-green-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-dk"
            >
              <span>{army.activities.cta}</span>
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 6. Join Khalilabad Army Registration Section                 */}
      {/* ------------------------------------------------------------ */}
      <JoinArmySection lang={lang} />

      {/* ------------------------------------------------------------ */}
      {/* 7. Connect With Khalilabad Army - Social Media Section       */}
      {/* ------------------------------------------------------------ */}
      <ArmySocialSection lang={lang} />
    </div>
  );
}
