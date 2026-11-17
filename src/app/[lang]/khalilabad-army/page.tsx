import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactStrip from "@/components/ContactStrip";
import Wave from "@/components/Wave";
import {
  ArrowDown,
  ArrowRight,
  Building2Icon,
  GraduationCapIcon,
  HeartPulseIcon,
  Users2Icon,
} from "@/components/icons";
import { href } from "@/lib/i18n";
import { resolveLang } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

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

  const priorityIcons = {
    education: GraduationCapIcon,
    healthcare: HeartPulseIcon,
    development: Building2Icon,
    welfare: Users2Icon,
  };

  return (
    <div className="relative overflow-hidden">
      {/* ------------------------------------------------------------ */}
      {/* 1. Hero Section                                              */}
      {/* ------------------------------------------------------------ */}
      <section
        aria-label={army.hero.title}
        className="relative flex min-h-[82vh] items-center justify-center overflow-hidden bg-black py-28 text-white md:min-h-[88vh] md:py-36"
      >
        {/* Full-width Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/rohit-pandey-hero-banner.jpg"
            alt={army.hero.title}
            fill
            priority
            sizes="100vw"
            className="hero-art object-cover object-center"
          />
          {/* Dark transparent gradient overlay for optimal readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/75 to-black/80" />
          <div className="absolute inset-0 bg-radial-[at_center_center] from-transparent via-black/40 to-black/80" />
        </div>

        {/* Content Container */}
        <div className="shell relative z-10 mx-auto flex flex-col items-center text-center">
          {/* Subtitle Badge */}
          <span
            className="hero-line inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-white/95 backdrop-blur-md md:text-sm"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <span className="size-2 rounded-full bg-red animate-pulse" />
            {army.hero.subtitle}
          </span>

          {/* Main Title */}
          <h1
            className="hero-line mt-6 font-heading text-4xl font-normal tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            {army.hero.title}
          </h1>

          {/* Description */}
          <p
            className="hero-line mt-6 max-w-2xl text-base font-normal leading-relaxed text-white/85 sm:text-xl"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            {army.hero.description}
          </p>

          {/* Single CTA Button */}
          <div
            className="hero-line mt-8 flex items-center justify-center"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            <a
              href="#about"
              className="inline-flex items-center gap-2.5 rounded-md bg-red-dk px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-red-deep hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>{army.hero.cta}</span>
              <ArrowDown className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 2. About Khalilabad Army                                     */}
      {/* ------------------------------------------------------------ */}
      <Wave tone="ivory" />
      <section
        id="about"
        aria-labelledby="about-army-heading"
        className="surface-ivory py-20 md:py-28"
      >
        <div className="shell">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Image Column */}
            <div className="lg:col-span-6" data-reveal="left">
              <div className="group relative overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-soft">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-tint sm:aspect-[16/11]">
                  <Image
                    src="/images/rohit-pandey-village-supporters.webp"
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
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-red-dk" />
                <span className="text-xs font-semibold uppercase tracking-wider text-red-dk">
                  {army.about.eyebrow}
                </span>
              </div>

              <h2
                id="about-army-heading"
                className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl"
              >
                {army.about.heading}
              </h2>

              <p className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg">
                {army.about.description}
              </p>

              <div className="mt-8 space-y-3 border-t border-line pt-6">
                <div className="flex items-start gap-3">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-red-dk" />
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
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-red-dk" />
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
      {/* 3. Rohit Pandey's Vision                                     */}
      {/* ------------------------------------------------------------ */}
      <Wave tone="sand" />
      <section
        id="vision"
        aria-labelledby="vision-army-heading"
        className="surface-tint py-20 md:py-28"
      >
        <div className="shell">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Text Column (Left) */}
            <div className="order-2 lg:order-1 lg:col-span-7" data-reveal="left">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-red-dk" />
                <span className="text-xs font-semibold uppercase tracking-wider text-red-dk">
                  {army.vision.eyebrow}
                </span>
              </div>

              <h2
                id="vision-army-heading"
                className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl"
              >
                {army.vision.heading}
              </h2>

              <div className="mt-6 rounded-xl border-l-4 border-red-dk bg-white/70 p-6 shadow-soft backdrop-blur-sm sm:p-8">
                <p className="text-base font-normal leading-relaxed text-ink sm:text-lg">
                  &ldquo;{army.vision.description}&rdquo;
                </p>
              </div>

              <p className="mt-5 text-sm text-ink-soft">
                {lang === "hi"
                  ? "यह दृष्टिकोण खलीलाबाद के नागरिकों के अधिकारों, बुनियादी सुविधाओं और समावेशी विकास के प्रति संवेदनशील सोच को रेखांकित करता है।"
                  : "This proposed vision reflects a commitment toward inclusive development, public rights, and essential civic amenities for Khalilabad."}
              </p>
            </div>

            {/* Image Column (Right) */}
            <div className="order-1 lg:order-2 lg:col-span-5" data-reveal="right">
              <div className="group relative overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-soft">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-tint sm:aspect-[3/4]">
                  <Image
                    src="/images/rohit-pandey-speaking-podium-hd.webp"
                    alt={army.vision.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-3 text-center sm:text-left">
                  <span className="text-xs font-semibold text-ink">
                    {t.person.name}
                  </span>
                  <p className="text-xs text-ink-soft">
                    {t.person.roleLine}
                  </p>
                </div>
              </div>
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
            <div className="inline-flex items-center justify-center gap-2">
              <span className="h-px w-6 bg-red-dk" />
              <span className="text-xs font-semibold uppercase tracking-wider text-red-dk">
                {army.priorities.eyebrow}
              </span>
              <span className="h-px w-6 bg-red-dk" />
            </div>

            <h2
              id="priorities-army-heading"
              className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl"
            >
              {army.priorities.heading}
            </h2>

            <p className="mt-4 text-base text-ink-soft sm:text-lg">
              {army.priorities.intro}
            </p>
          </div>

          {/* Four Priority Cards */}
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {army.priorities.items.map((item, idx) => {
              const Icon = priorityIcons[item.id as keyof typeof priorityIcons] ?? GraduationCapIcon;
              return (
                <article
                  key={item.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-red-dk/40 hover:shadow-raised"
                  data-reveal="zoom"
                  style={{ "--reveal-i": idx } as React.CSSProperties}
                >
                  <div>
                    {/* Icon container */}
                    <div className="flex size-13 items-center justify-center rounded-lg bg-red-tint text-red-dk transition-colors duration-300 group-hover:bg-red-dk group-hover:text-white">
                      <Icon className="size-6.5" />
                    </div>

                    <span className="mt-4 block text-xs font-medium text-ink-soft">
                      {item.titleHi}
                    </span>

                    <h3 className="mt-1 font-heading text-xl font-semibold text-ink sm:text-2xl">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {item.desc}
                    </p>
                  </div>

                  {/* Card bottom accent rule */}
                  <div className="mt-6 h-0.5 w-8 bg-line transition-all duration-300 group-hover:w-full group-hover:bg-red-dk" />
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
            <div className="inline-flex items-center justify-center gap-2">
              <span className="h-px w-6 bg-red-dk" />
              <span className="text-xs font-semibold uppercase tracking-wider text-red-dk">
                {army.activities.eyebrow}
              </span>
              <span className="h-px w-6 bg-red-dk" />
            </div>

            <h2
              id="activities-army-heading"
              className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl"
            >
              {army.activities.heading}
            </h2>

            <p className="mt-4 text-base text-ink-soft sm:text-lg">
              {army.activities.intro}
            </p>
          </div>

          {/* Activities Photo Grid */}
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {army.activities.items.map((activity, idx) => (
              <figure
                key={activity.title}
                className="group relative overflow-hidden rounded-xl border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-raised"
                data-reveal="zoom"
                style={{ "--reveal-i": idx } as React.CSSProperties}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-deep">
                  <Image
                    src={activity.src}
                    alt={activity.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  {/* Category Pill Tag */}
                  <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {activity.category}
                  </span>
                </div>

                <figcaption className="p-4">
                  <h3 className="font-heading text-lg font-semibold text-ink sm:text-xl">
                    {activity.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-soft">
                    {activity.alt}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* View More Button */}
          <div className="mt-12 flex justify-center" data-reveal="fade">
            <Link
              href={href(lang, "/media")}
              className="inline-flex items-center gap-2 rounded-md bg-green-dk px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-green-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-dk"
            >
              <span>{army.activities.cta}</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Contact Strip                                                */}
      {/* ------------------------------------------------------------ */}
      <ContactStrip lang={lang} t={t} />
    </div>
  );
}
