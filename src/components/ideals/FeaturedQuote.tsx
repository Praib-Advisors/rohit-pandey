"use client";

import Image from "next/image";
import { LocalLink as Link } from "@/lib/lang";
import Reveal from "@/components/PortalReveal";
import { ideals, nameOf } from "@/data/ideals";
import { T, TB, useBi } from "@/lib/lang";
import IdealQuoteView from "./IdealQuote";

/** The block at the top of the page: Netaji Mulayam Singh Yadav's thought (a labelled summary) with his portrait. It is fixed, it does not rotate. */
export default function FeaturedQuote() {
  const bi = useBi();
  const person = ideals.find((p) => p.id === "mulayam-singh-yadav");
  if (!person) return null;
  return (
    <section aria-labelledby="thought-title" className="section bg-sand">
      <div className="shell grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-7">
          <h2 id="thought-title" className="h-section">
            <T>नेताजी का विचार</T>
          </h2>
          <div className="mt-5">
            <IdealQuoteView quote={person.quote} size="large" showOriginal />
          </div>
          <p className="mt-6 font-display text-2xl text-brand-red-deep">
            <TB v={nameOf(person)} />
          </p>
          <Link href={`/ideals/${person.id}`} className="btn btn-primary mt-6">
            <T>और जानें</T>
          </Link>
        </Reveal>
        <Reveal className="lg:col-span-4 lg:col-start-9" delay={80}>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-card bg-white lg:ml-auto lg:mr-0">
            <Image
              src={person.image}
              alt={bi(person.imageAlt)}
              fill
              sizes="(min-width: 1024px) 28vw, 70vw"
              className={person.imageFit === "contain" ? "object-contain p-3" : `object-cover ${person.imagePosition ?? "object-top"}`}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
