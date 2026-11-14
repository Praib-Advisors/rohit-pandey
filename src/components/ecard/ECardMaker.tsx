"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { CheckCircleIcon, CloseIcon, DownloadIcon, ImagePlusIcon, LoaderIcon, MessageCircleIcon } from "@/components/icons";
import { portal } from "@/content/portal";
import { useDeep, useLang } from "@/lib/lang";
import type { ECardTemplate } from "@/content/ecards";
import { CARD_H, CARD_W, drawCard, fontFromVar, loadImage } from "@/lib/ecardDraw";

export type CardOption = {
  id: string;
  label: string;
  greeting: string;
  kicker?: string;
  line: string;
  motif: ECardTemplate["motif"];
  palette: ECardTemplate["palette"];
  scene?: ECardTemplate["scene"];
};

// The URL query (?occasion=diwali) is browser state, so it is read with useSyncExternalStore: the server
// and the first client render see "no choice" and the page stays static. The query only changes with a
// navigation, which remounts the page, so there is nothing to subscribe to.
const noSubscription = () => () => {};
const readOccasion = () => new URLSearchParams(window.location.search).get("occasion") ?? "";
const noOccasion = () => "";

/** Tiro for headings on the card, Noto Serif (Latin first, then Devanagari) for the rest: the same faces as the site. */
const displayFamily = () => fontFromVar("--font-tiro", "serif");
const sansFamily = () => {
  const latin = fontFromVar("--font-serif-latin", "");
  const deva = fontFromVar("--font-serif-deva", "serif");
  return latin ? `${latin.replace(/,\s*$/, "")}, ${deva}` : deva;
};

/** Reads a photo the visitor picks and shrinks it, entirely in the browser. */
function readPhoto(file: File) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const url = URL.createObjectURL(file);
    loadImage(url).then((img) => {
      URL.revokeObjectURL(url);
      resolve(img);
    });
  });
}

export default function ECardMaker({
  options: optionsHi,
  leader: leaderHi,
  footer,
  fileStem,
}: {
  options: CardOption[];
  leader: { name: string; role: string; photo: string; area: string };
  footer: string;
  fileStem: string;
}) {
  const { lang } = useLang();
  const t = useDeep(portal.ecard);
  const options = useDeep(optionsHi);
  const leader = useDeep(leaderHi);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linked = useSyncExternalStore(noSubscription, readOccasion, noOccasion);
  const [picked, setPicked] = useState<string | null>(null);
  const selected = picked ?? (options.some((o) => o.id === linked) ? linked : options[0].id);
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [assets, setAssets] = useState<{ photo: HTMLImageElement | null } | null>(null);
  const [busy, setBusy] = useState<"download" | "share" | null>(null);
  const [notice, setNotice] = useState("");
  const option = useMemo(() => options.find((o) => o.id === selected) ?? options[0], [options, selected]);

  // Load the portrait and the fonts once.
  useEffect(() => {
    let alive = true;
    const display = displayFamily();
    const sans = sansFamily();
    Promise.all([
      loadImage(leader.photo),
      document.fonts?.load(`64px ${display}`, "शुभकामनाएँ Aa").catch(() => []),
      document.fonts?.load(`600 32px ${sans}`, "अजीत Aa").catch(() => []),
      document.fonts?.load(`400 32px ${sans}`, "अजीत Aa").catch(() => []),
    ]).then(([p]) => alive && setAssets({ photo: p }));
    return () => {
      alive = false;
    };
  }, [leader.photo]);

  // Redraw on every change.
  useEffect(() => {
    if (!assets || !canvasRef.current) return;
    drawCard(canvasRef.current, {
      palette: option.palette,
      motif: option.motif,
      greeting: option.greeting,
      kicker: option.kicker,
      line: option.line,
      area: leader.area,
      scene: option.scene,
      leader: { name: leader.name, role: leader.role, photo: assets.photo },
      sender: { name, place, photo, // "की तरफ़ से" follows the name in Hindi; in English the line is left out
      fromLabel: lang === "en" ? "" : t.from, placeholder: t.yourName },
      footer,
      fonts: { display: displayFamily(), sans: sansFamily() },
    });
  }, [assets, option, name, place, photo, leader.name, leader.role, leader.area, footer, t.from, t.yourName, lang]);

  // canvas.toBlob returns nothing and calls back later, so the promise resolves in the callback.
  const toBlob = () =>
    new Promise<Blob | null>((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return resolve(null);
      try {
        canvas.toBlob((b) => resolve(b), "image/png");
      } catch {
        resolve(null);
      }
    });

  const fileName = `${fileStem}-${option.id}.png`;

  const download = async () => {
    setBusy("download");
    setNotice("");
    const blob = await toBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }
    setBusy(null);
  };

  const share = async () => {
    setBusy("share");
    setNotice("");
    const blob = await toBlob();
    if (!blob) return setBusy(null);
    const file = new File([blob], fileName, { type: "image/png" });
    // Phones: the share sheet sends the image itself to WhatsApp.
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text: option.greeting });
      } catch {
        /* The visitor closed the share sheet. */
      }
      return setBusy(null);
    }
    // Computers: download the card and open WhatsApp with the greeting text.
    await download();
    setNotice(t.shareFallback);
    window.open(`https://wa.me/?text=${encodeURIComponent(`${option.greeting} 🙏`)}`, "_blank", "noopener,noreferrer");
    setBusy(null);
  };

  const step = (n: number, title: string, hint: string) => (
    <div className="mb-5 flex items-center gap-3 border-b border-line pb-4">
      <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-semibold text-white">
        {n}
      </span>
      <div>
        <h2 className="h-card text-[1.15rem]">{title}</h2>
        <p className="text-sm text-muted">{hint}</p>
      </div>
    </div>
  );
  const block = "rounded-card border border-line bg-white p-5 sm:p-7";

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="grid content-start gap-6 lg:col-span-7">
        <fieldset className={block}>
          <legend className="sr-only">{t.occasion}</legend>
          {step(1, t.occasion, t.occasionHint)}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {options.map((o) => {
              const on = o.id === selected;
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPicked(o.id)}
                  className={`relative flex flex-col gap-2 rounded-card border bg-white p-2 text-left transition-colors duration-200 ${
                    on ? "border-brand-red ring-1 ring-brand-red" : "border-line hover:border-ink/40"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-full place-items-center rounded-soft"
                    style={{ background: `linear-gradient(135deg, ${o.palette[0]}, ${o.palette[1]} 55%, ${o.palette[2]})` }}
                  >
                    <span className="h-2.5 w-2.5 rotate-45" style={{ background: o.palette[2], boxShadow: "0 0 0 2px rgba(255,255,255,0.5)" }} />
                  </span>
                  <span className="px-1 pb-1 text-[0.95rem] leading-snug text-ink">{o.label}</span>
                  {on && <CheckCircleIcon className="absolute right-1.5 top-1.5 h-5 w-5 rounded-full bg-white text-brand-red" />}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className={block}>
          {step(2, t.stepNameTitle, t.stepNameHint)}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ec-name" className="field-label">{t.yourName}</label>
              <input id="ec-name" className="field" value={name} maxLength={40} autoComplete="name" placeholder={t.namePlaceholder} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="ec-place" className="field-label">{t.yourPlace}</label>
              <input id="ec-place" className="field" value={place} maxLength={50} placeholder={t.placePlaceholder} onChange={(e) => setPlace(e.target.value)} />
            </div>
          </div>

          <div className="mt-5">
            <span className="field-label">{t.photo}</span>
            <div className="flex flex-wrap items-center gap-3">
              <label className="btn btn-ghost cursor-pointer">
                <ImagePlusIcon className="h-4 w-4" />
                {t.choosePhoto}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) setPhoto(await readPhoto(f));
                    e.target.value = "";
                  }}
                />
              </label>
              {photo && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPhoto(null)}>
                  <CloseIcon className="h-4 w-4" />
                  {t.removePhoto}
                </button>
              )}
            </div>
            <p className="mt-2 text-sm text-muted">{t.photoHint}</p>
          </div>
        </div>

        <div className={block}>
          {step(3, t.stepSendTitle, t.stepSendHint)}
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={share}
              disabled={!assets || busy !== null}
              className="btn border-[#1fa855] bg-[#1fa855] text-white hover:!bg-[#178a45] hover:!border-[#178a45]"
            >
              {busy === "share" ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <MessageCircleIcon className="h-4 w-4" />}
              {busy === "share" ? t.preparing : t.share}
            </button>
            <button type="button" onClick={download} disabled={!assets || busy !== null} className="btn btn-ghost">
              {busy === "download" ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
              {busy === "download" ? t.preparing : t.download}
            </button>
          </div>
          <p role="status" className="mt-3 min-h-6 text-sm text-brand-green-deep">{notice}</p>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="rounded-panel bg-night p-4 text-white sm:p-5 lg:sticky lg:top-24">
          <div className="mb-3 flex items-center justify-between gap-3 text-sm font-semibold">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#39d98a]" />
              {t.live}
            </span>
            <span className="text-brand-red-soft">{option.label}</span>
          </div>
          <div className="relative overflow-hidden rounded-card bg-sand" style={{ aspectRatio: `${CARD_W} / ${CARD_H}` }}>
            {!assets && (
              <div className="absolute inset-0 grid place-items-center text-muted">
                <LoaderIcon className="h-8 w-8 animate-spin" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              width={CARD_W}
              height={CARD_H}
              role="img"
              aria-label={`${t.preview}: ${option.greeting}`}
              className="block h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
