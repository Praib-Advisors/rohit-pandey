"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ActivityCategory, ServiceIssue, ServiceItem } from "@/lib/socialService";
import TablerIcon from "./icons";

export type BoardLabels = {
  issuesTitle: string;
  workTitle: string;
  countOne: string;
  countMany: string;
  filterAll: string;
  filterPeople: string;
  filterOrg: string;
  filterParty: string;
  chipPeople: string;
  chipOrg: string;
  chipOffice: string;
  chipParty: string;
  share: string;
  empty: string;
  clear: string;
  filterLabel: string;
  readMore: string;
};

type Filter = "all" | "people" | "org" | "party";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red";

/** Chip colours per kind of work, all from the flag palette */
const chipTone: Record<ActivityCategory, string> = {
  people: "bg-green-dk/10 text-green-dk",
  org: "bg-ink/[0.06] text-ink",
  office: "bg-red-tint text-red-dk",
  party: "bg-red-tint text-red-dk",
};

function SubHeading({ id, index, children }: { id?: string; index: string; children: React.ReactNode }) {
  return (
    <div className="flex items-end gap-5">
      <span aria-hidden className="numeral text-[3.5rem] text-red/25 md:text-[4.5rem]">
        {index}
      </span>
      <h3 id={id} className="title-md pb-2 text-ink">
        {children}
      </h3>
      <span aria-hidden className="mb-4 hidden h-px flex-1 bg-line sm:block" />
    </div>
  );
}

async function shareItem(item: ServiceItem) {
  const data = { title: item.title, url: item.shareUrl };
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share(data);
    } catch {
      /* the person closed the share sheet */
    }
    return;
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${item.title} ${item.shareUrl}`)}`, "_blank", "noopener,noreferrer");
}

export type ExtraPhoto = { src: string; width: number; height: number; alt: string };

export default function SocialServiceBoard({
  issues,
  items,
  labels,
  photos,
}: {
  issues: ServiceIssue[];
  items: ServiceItem[];
  labels: BoardLabels;
  /** More photographs from the featured story, shown as a small gallery under it */
  photos: ExtraPhoto[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [issueId, setIssueId] = useState<string | null>(null);

  const [featured, ...others] = items;
  const issue = issues.find((i) => i.id === issueId);

  const chip: Record<ActivityCategory, string> = {
    people: labels.chipPeople,
    org: labels.chipOrg,
    office: labels.chipOffice,
    party: labels.chipParty,
  };

  const counts: Record<Filter, number> = {
    all: others.length,
    people: others.filter((i) => i.category === "people").length,
    org: others.filter((i) => i.category === "org").length,
    party: others.filter((i) => i.category === "party").length,
  };
  const filterButtons: { key: Filter; label: string }[] = [
    { key: "all", label: labels.filterAll },
    { key: "people", label: labels.filterPeople },
    { key: "org", label: labels.filterOrg },
    { key: "party", label: labels.filterParty },
  ];

  const visible = others.filter(
    (i) => (filter === "all" || i.category === filter) && (!issueId || i.issues.includes(issueId)),
  );
  const months: { key: string; label: string; entries: ServiceItem[] }[] = [];
  for (const entry of visible) {
    const last = months[months.length - 1];
    if (last && last.key === entry.monthKey) last.entries.push(entry);
    else months.push({ key: entry.monthKey, label: entry.monthLabel, entries: [entry] });
  }

  const pickIssue = (id: string) => {
    setIssueId((current) => (current === id ? null : id));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("social-work")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const meta = (item: ServiceItem, onDark = false) => (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.875rem] ${onDark ? "text-white/85" : "text-muted"}`}>
      <span
        className={`rounded-full px-3 py-1 text-[0.75rem] font-semibold ${onDark ? "bg-white/15 text-white backdrop-blur" : chipTone[item.category]}`}
      >
        {chip[item.category]}
      </span>
      <time dateTime={item.date} className="inline-flex items-center gap-1.5">
        <TablerIcon name="calendar" size={15} />
        {item.dateLabel}
      </time>
      <span className={`inline-flex items-center gap-1 font-semibold ${onDark ? "text-white" : "text-green-dk"}`}>
        <TablerIcon name="map-pin" size={15} />
        {item.place}
      </span>
    </p>
  );

  const shareButton = (item: ServiceItem) => (
    <button
      type="button"
      onClick={() => shareItem(item)}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-[0.9375rem] font-semibold text-muted transition-colors hover:text-red ${focus}`}
    >
      <TablerIcon name="share" size={17} />
      {labels.share}
    </button>
  );

  return (
    <>
      {/* Issues */}
      <div className="mt-4">
        <SubHeading index="01">{labels.issuesTitle}</SubHeading>
        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {issues.map((it, i) => {
            const active = issueId === it.id;
            return (
              <li key={it.id} className="flex">
                <button
                  type="button"
                  onClick={() => pickIssue(it.id)}
                  aria-pressed={active}
                  className={`card-lux group flex w-full flex-col p-7 text-left md:p-8 ${focus}`}
                >
                  <span className="flex items-start justify-between gap-4">
                    <span
                      className={`grid size-14 place-items-center rounded-2xl transition-colors duration-300 ${
                        active ? "bg-brand-red text-white" : "bg-red-tint text-red group-hover:bg-brand-red group-hover:text-white"
                      }`}
                    >
                      <TablerIcon name={it.icon} size={26} />
                    </span>
                    <span aria-hidden className="numeral text-[2.75rem] text-ink/10 transition-colors duration-300 group-hover:text-red/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span
                    className={`mt-7 block font-heading text-[1.4375rem] leading-snug transition-colors [&:lang(hi)]:leading-[1.35] ${
                      active ? "text-red-dk" : "text-ink"
                    }`}
                  >
                    {it.title}
                  </span>
                  <span className="mt-3 block flex-1 text-[1rem] leading-relaxed text-ink-soft [text-align:justify] [hyphens:auto] [text-align-last:start]">
                    {it.text}
                  </span>
                  <span className="mt-6 flex items-center justify-between border-t border-line pt-5 text-[0.875rem]">
                    <span className="font-medium text-muted">
                      {it.count > 0 ? `${it.count} ${it.count === 1 ? labels.countOne : labels.countMany}` : " "}
                    </span>
                    <span
                      aria-hidden
                      className={`grid size-9 place-items-center rounded-full border transition-all duration-300 ${
                        active
                          ? "border-red bg-brand-red text-white"
                          : "border-line text-ink group-hover:translate-x-1 group-hover:border-red group-hover:text-red"
                      }`}
                    >
                      <TablerIcon name="arrow-right" size={16} />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Recent work */}
      <div id="social-work" className="mt-24 scroll-mt-28 md:mt-32">
        <SubHeading index="02" id="social-work-title">
          {labels.workTitle}
        </SubHeading>

        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          {featured && (
            <article className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
              <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_90px_-50px_rgb(22_24_28/0.55)] ring-1 ring-black/5">
                {(featured.image || photos[0]) && (
                  <Link
                    href={featured.href}
                    tabIndex={-1}
                    aria-hidden
                    className="zoom-media relative block aspect-[16/10] bg-sand"
                  >
                    <Image
                      src={featured.image ?? photos[0].src}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 52vw, 92vw"
                      className="object-cover"
                    />
                    <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-6 md:p-8">{meta(featured, true)}</span>
                  </Link>
                )}
                {!(featured.image || photos[0]) && (
                  <Link
                    href={featured.href}
                    tabIndex={-1}
                    aria-hidden
                    className="surface-gradient on-dark relative flex aspect-[16/9] flex-col justify-between overflow-hidden p-6 md:p-8"
                  >
                    {/* editorial cover when the story has no photograph: the date set large */}
                    <span aria-hidden className="absolute -right-16 -top-16 size-72 rounded-full border border-white/10" />
                    <span aria-hidden className="absolute -right-4 -top-4 size-44 rounded-full border border-white/10" />
                    <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-[linear-gradient(90deg,var(--white)_0_50%,var(--green)_50%_100%)]" />
                    <span className="relative">{meta(featured, true)}</span>
                    <span className="relative flex items-end gap-4">
                      {featured.date.length >= 10 && (
                        <span className="numeral text-[5.5rem] text-white md:text-[7.5rem]">{featured.date.slice(8, 10)}</span>
                      )}
                      <span className="pb-3 font-display text-[1.375rem] italic text-white/85 md:pb-5 md:text-[1.75rem]">{featured.monthLabel}</span>
                    </span>
                  </Link>
                )}
                <div className="p-6 md:p-9">
                  <h4 className="font-heading text-[1.75rem] leading-[1.15] tracking-[-0.02em] md:text-[2.25rem] [&:lang(hi)]:leading-[1.3]">
                    <Link href={featured.href} className={`transition-colors hover:text-red ${focus}`}>
                      {featured.title}
                    </Link>
                  </h4>
                  <p className="mt-4 text-[1.0625rem] text-ink-soft">{featured.summary}</p>
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-4">
                    <Link
                      href={featured.href}
                      className={`group inline-flex min-h-11 items-center gap-2 font-semibold text-red-dk ${focus}`}
                    >
                      <span className="link-draw">{labels.readMore}</span>
                      <TablerIcon name="arrow-up-right" size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                    {shareButton(featured)}
                  </div>
                </div>
              </div>

              {photos.length > 1 && (
                <ul className="mt-5 grid grid-cols-2 gap-4">
                  {photos.slice(1, 5).map((p, i, arr) => (
                    <li
                      key={p.src}
                      className={`zoom-media relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand ring-1 ring-black/5 ${
                        arr.length % 2 === 1 && i === arr.length - 1 ? "col-span-2 aspect-[16/8]" : ""
                      }`}
                    >
                      <Image src={p.src} alt={p.alt} fill loading="lazy" sizes="(min-width: 1024px) 26vw, 46vw" className="object-cover" />
                    </li>
                  ))}
                </ul>
              )}
            </article>
          )}

          <div className="min-w-0">
            <div role="group" aria-label={labels.filterLabel} className="flex flex-wrap gap-2 rounded-full">
              {filterButtons
                .filter((b) => b.key === "all" || counts[b.key] > 0)
                .map((b) => {
                  const on = filter === b.key;
                  return (
                    <button
                      key={b.key}
                      type="button"
                      onClick={() => setFilter(b.key)}
                      aria-pressed={on}
                      className={`inline-flex h-11 items-center gap-2 rounded-full border px-5 text-[0.9375rem] font-medium transition-all duration-300 ${focus} ${
                        on
                          ? "border-ink bg-ink text-white shadow-[0_10px_24px_-14px_rgb(22_24_28/0.8)]"
                          : "border-ink/15 bg-white text-ink hover:-translate-y-0.5 hover:border-ink/40"
                      }`}
                    >
                      {b.label}
                      <span
                        className={`grid min-w-6 place-items-center rounded-full px-1.5 text-[0.75rem] ${on ? "bg-white/20" : "bg-ink/[0.06]"}`}
                      >
                        {counts[b.key]}
                      </span>
                    </button>
                  );
                })}
              {issue && (
                <button
                  type="button"
                  onClick={() => setIssueId(null)}
                  aria-label={`${labels.clear}: ${issue.title}`}
                  className={`inline-flex h-11 items-center gap-2 rounded-full border border-red bg-red-tint px-5 text-[0.9375rem] font-medium text-red-dk ${focus}`}
                >
                  {issue.title}
                  <TablerIcon name="x" size={16} />
                </button>
              )}
            </div>

            <div aria-live="polite" className="mt-10">
              {months.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-ink/20 p-8 text-center text-ink-soft">{labels.empty}</p>
              ) : (
                <ol className="relative">
                  <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-linear-to-b from-red via-red/30 to-green/40" />
                  {months.map((m) => (
                    <li key={m.key} className="relative pb-10 pl-10 last:pb-0">
                      <span aria-hidden className="absolute left-0 top-[0.55rem] size-[15px] rounded-full border-[3px] border-white bg-brand-red shadow-[0_0_0_1px_rgb(224_38_47/0.4)]" />
                      <h4 className="font-display text-[1.375rem] italic leading-tight text-ink">{m.label}</h4>
                      <ol className="mt-5 space-y-4">
                        {m.entries.map((e) => (
                          <li key={e.slug}>
                            <article className="card-lux group flex gap-5 p-5 md:p-6">
                              <div className="min-w-0 flex-1">
                                {meta(e)}
                                <h5 className="mt-3 font-heading text-[1.25rem] leading-snug [&:lang(hi)]:leading-[1.35]">
                                  <Link href={e.href} className={`transition-colors hover:text-red ${focus}`}>
                                    {e.title}
                                  </Link>
                                </h5>
                                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{e.summary}</p>
                                <div className="mt-2 -mb-2">{shareButton(e)}</div>
                              </div>
                              {e.image && (
                                <Link
                                  href={e.href}
                                  tabIndex={-1}
                                  aria-hidden
                                  className="zoom-media relative hidden aspect-square w-28 shrink-0 self-start overflow-hidden rounded-xl bg-sand sm:block"
                                >
                                  <Image src={e.image} alt="" fill loading="lazy" sizes="7rem" className="object-cover" />
                                </Link>
                              )}
                            </article>
                          </li>
                        ))}
                      </ol>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
