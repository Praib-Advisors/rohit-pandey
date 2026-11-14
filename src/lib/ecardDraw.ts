/**
 * Draws an e-card onto a canvas, entirely in the browser: no upload, no server. The card is
 * 1080 × 1350 (the 4:5 shape WhatsApp and Instagram show without cropping).
 */
import type { Motif } from "@/content/ecards";
import { drawScene, type Scene } from "./ecardScenes";

export const CARD_W = 1080;
export const CARD_H = 1350;
/** Scenes are drawn for a picture band centred on y 340; this lifts them to line up with the motifs. */
const SCENE_LIFT = 45;

export type CardInput = {
  palette: [string, string, string, string];
  motif: Motif;
  /** The occasion's greeting; the big headline is this without "हार्दिक" / "Warm". */
  greeting: string;
  /** The small line above the headline. */
  kicker?: string;
  /** The message under the headline. */
  line: string;
  /** Where the greeting is meant for, e.g. "… क्षेत्र के सभी परिवारों को हार्दिक शुभकामनाएँ". */
  area: string;
  /** The picture behind the lower part of the card, themed to the occasion. */
  scene?: Scene;
  leader: { name: string; role: string; photo: HTMLImageElement | null };
  sender: { name: string; place: string; photo: HTMLImageElement | null; fromLabel: string; placeholder: string };
  footer: string;
  fonts: { display: string; sans: string };
};

type Ctx = CanvasRenderingContext2D;

const TAU = Math.PI * 2;

function rgba(hex: string, a: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** Deterministic pseudo-random numbers, so a card looks the same every time it is drawn. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function wrap(ctx: Ctx, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function circleImage(ctx: Ctx, img: HTMLImageElement, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TAU);
  ctx.closePath();
  ctx.clip();
  // Cover-fit, biased to the top so faces stay in the circle.
  const scale = Math.max((r * 2) / img.width, (r * 2) / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, cx - w / 2, cy - r - (h - r * 2) * 0.15, w, h);
  ctx.restore();
}

function ring(ctx: Ctx, cx: number, cy: number, r: number, color: string, width: number) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TAU);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
}

/**
 * A transparent cut-out standing on the card, its foot and cropped sides faded out, so the
 * straight edges of the photograph never show.
 */
function standingImage(ctx: Ctx, img: HTMLImageElement, cx: number, bottom: number, h: number, maxAspect = 0.68) {
  // A wide photograph is cropped evenly at the sides so the figure keeps to its column and never reaches the text.
  const cropW = img.width / img.height > maxAspect ? img.height * maxAspect : img.width;
  const sx = (img.width - cropW) / 2;
  const w = (h * cropW) / img.height;
  const off = document.createElement("canvas");
  off.width = Math.round(w);
  off.height = Math.round(h);
  const o = off.getContext("2d");
  if (!o) return;
  o.drawImage(img, sx, 0, cropW, img.height, 0, 0, w, h);
  o.globalCompositeOperation = "destination-in";
  const foot = o.createLinearGradient(0, 0, 0, h);
  foot.addColorStop(0, "#000");
  foot.addColorStop(0.82, "#000");
  foot.addColorStop(1, "rgba(0,0,0,0)");
  o.fillStyle = foot;
  o.fillRect(0, 0, w, h);
  const sides = o.createLinearGradient(0, 0, w, 0);
  sides.addColorStop(0, "rgba(0,0,0,0)");
  sides.addColorStop(0.1, "#000");
  sides.addColorStop(0.9, "#000");
  sides.addColorStop(1, "rgba(0,0,0,0)");
  o.fillStyle = sides;
  o.fillRect(0, 0, w, h);
  ctx.drawImage(off, cx - w / 2, bottom - h);
}

function glow(ctx: Ctx, x: number, y: number, r: number, color: string, a = 0.55) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(color, a));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function flame(ctx: Ctx, x: number, y: number, h: number) {
  glow(ctx, x, y - h * 0.4, h * 1.6, "#ffb627", 0.5);
  const g = ctx.createLinearGradient(x, y - h, x, y);
  g.addColorStop(0, "#fff6c2");
  g.addColorStop(0.45, "#ffc93c");
  g.addColorStop(1, "#ff7a00");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x, y - h);
  ctx.bezierCurveTo(x + h * 0.42, y - h * 0.45, x + h * 0.32, y, x, y);
  ctx.bezierCurveTo(x - h * 0.32, y, x - h * 0.42, y - h * 0.45, x, y - h);
  ctx.fill();
}

function diya(ctx: Ctx, x: number, y: number, w: number) {
  flame(ctx, x, y - w * 0.12, w * 0.55);
  const g = ctx.createLinearGradient(x, y - w * 0.15, x, y + w * 0.3);
  g.addColorStop(0, "#e8833a");
  g.addColorStop(1, "#8a3a10");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y - w * 0.08);
  ctx.quadraticCurveTo(x, y + w * 0.5, x + w / 2, y - w * 0.08);
  ctx.quadraticCurveTo(x + w * 0.62, y - w * 0.16, x + w * 0.72, y - w * 0.2);
  ctx.quadraticCurveTo(x + w * 0.5, y - w * 0.02, x, y - w * 0.04);
  ctx.quadraticCurveTo(x - w * 0.5, y - w * 0.02, x - w / 2, y - w * 0.08);
  ctx.fill();
  ctx.fillStyle = "rgba(255,220,150,0.35)";
  ctx.beginPath();
  ctx.ellipse(x, y - w * 0.06, w * 0.44, w * 0.06, 0, 0, TAU);
  ctx.fill();
}

function petals(ctx: Ctx, cx: number, cy: number, r: number, n: number, color: string, inner: string) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a);
    ctx.fillStyle = i % 2 ? color : inner;
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.55, r * 0.22, r * 0.5, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}

function lotus(ctx: Ctx, cx: number, cy: number, s: number, accent: string) {
  const layers: [number, number, string][] = [
    [0.95, 0.9, rgba(accent, 0.55)],
    [0.62, 0.95, rgba(accent, 0.8)],
    [0.3, 1, accent],
  ];
  for (const [spread, height, color] of layers) {
    for (const dir of [-1, 1, 0]) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(dir * spread);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(s * 0.32, -s * 0.5 * height, 0, -s * height);
      ctx.quadraticCurveTo(-s * 0.32, -s * 0.5 * height, 0, 0);
      ctx.fill();
      ctx.restore();
    }
  }
}

function marigoldString(ctx: Ctx, x1: number, x2: number, y: number, sag: number, r: number) {
  const n = Math.max(0, Math.floor((x2 - x1) / (r * 1.5)));
  for (let i = 0; i <= n; i++) {
    const t = n === 0 ? 0 : i / n;
    const x = x1 + (x2 - x1) * t;
    const yy = y + Math.sin(t * Math.PI) * sag;
    const g = ctx.createRadialGradient(x - r * 0.3, yy - r * 0.3, 1, x, yy, r);
    g.addColorStop(0, i % 3 === 0 ? "#ffd84d" : "#ffb11a");
    g.addColorStop(1, i % 3 === 0 ? "#e89a00" : "#e2620a");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, yy, r, 0, TAU);
    ctx.fill();
  }
}

function chakra(ctx: Ctx, cx: number, cy: number, r: number) {
  ctx.strokeStyle = "#0b3d91";
  ctx.lineWidth = r * 0.08;
  ring(ctx, cx, cy, r, "#0b3d91", r * 0.08);
  ctx.lineWidth = r * 0.035;
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * TAU;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.stroke();
  }
  ctx.fillStyle = "#0b3d91";
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.14, 0, TAU);
  ctx.fill();
}

/** Ghat steps across the bottom of the motif band. */
function ghatSteps(ctx: Ctx, y: number, color: string) {
  ctx.fillStyle = color;
  const steps = 7;
  for (let i = 0; i < steps; i++) {
    const h = 12;
    const inset = i * 26;
    ctx.fillRect(inset, y + i * h, CARD_W - inset * 2, h - 3);
  }
}

function drawMotif(ctx: Ctx, input: CardInput) {
  const [, , accent] = input.palette;
  const rand = seeded(input.motif.length * 97 + input.greeting.length);
  const cx = CARD_W / 2;

  switch (input.motif) {
    case "diya": {
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = rgba(accent, 0.15 + rand() * 0.35);
        ctx.beginPath();
        ctx.arc(rand() * CARD_W, 160 + rand() * 300, 1.5 + rand() * 3, 0, TAU);
        ctx.fill();
      }
      diya(ctx, cx - 260, 420, 140);
      diya(ctx, cx + 260, 420, 140);
      diya(ctx, cx, 400, 220);
      break;
    }
    case "ghat-lamps": {
      // Crescent moon, river, floating lamps and the ghat steps.
      ctx.fillStyle = "#fff4d6";
      ctx.beginPath();
      ctx.arc(cx + 300, 210, 46, 0, TAU);
      ctx.fill();
      ctx.fillStyle = input.palette[0];
      ctx.beginPath();
      ctx.arc(cx + 322, 196, 42, 0, TAU);
      ctx.fill();
      for (let i = 0; i < 60; i++) {
        const x = rand() * CARD_W;
        const y = 300 + rand() * 100;
        glow(ctx, x, y, 16, accent, 0.6);
        ctx.fillStyle = "#ffd36b";
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, TAU);
        ctx.fill();
      }
      ghatSteps(ctx, 420, rgba("#e7d2b0", 0.22));
      // Lamps on the top step.
      for (let i = 0; i < 9; i++) flame(ctx, 120 + i * 105, 418, 30);
      break;
    }
    case "sun": {
      glow(ctx, cx, 290, 300, "#fff1b0", 0.7);
      ctx.fillStyle = "#ffe08a";
      ctx.beginPath();
      ctx.arc(cx, 290, 110, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = rgba("#fff7d6", 0.8);
      ctx.lineWidth = 6;
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * TAU;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 138, 290 + Math.sin(a) * 138);
        ctx.lineTo(cx + Math.cos(a) * 180, 290 + Math.sin(a) * 180);
        ctx.stroke();
      }
      ctx.strokeStyle = rgba("#ffffff", 0.45);
      ctx.lineWidth = 4;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        for (let x = 0; x <= CARD_W; x += 20) ctx.lineTo(x, 440 + i * 16 + Math.sin(x / 40 + i) * 5);
        ctx.stroke();
      }
      break;
    }
    case "colours": {
      const cols = ["#ff4fa3", "#ffd54f", "#4fc3f7", "#7cdb5a", "#ff7043", "#b388ff"];
      for (let i = 0; i < 26; i++) {
        glow(ctx, rand() * CARD_W, 120 + rand() * 380, 60 + rand() * 120, cols[i % cols.length], 0.55);
      }
      break;
    }
    case "flag": {
      const bands = ["#ff9933", "#ffffff", "#138808"];
      for (let b = 0; b < 3; b++) {
        ctx.fillStyle = bands[b];
        ctx.beginPath();
        for (let x = 0; x <= CARD_W; x += 10) ctx.lineTo(x, 200 + b * 70 + Math.sin(x / 120) * 26);
        for (let x = CARD_W; x >= 0; x -= 10) ctx.lineTo(x, 270 + b * 70 + Math.sin(x / 120) * 26);
        ctx.closePath();
        ctx.fill();
      }
      ctx.strokeStyle = "rgba(0,0,0,0.06)";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, 0, 0);
      chakra(ctx, cx, 305 + Math.sin(cx / 120) * 26, 32);
      break;
    }
    case "shiva": {
      // Crescent, trishul and damru.
      glow(ctx, cx, 300, 260, accent, 0.35);
      ctx.strokeStyle = "#e8f6fb";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx, 470);
      ctx.lineTo(cx, 170);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 70, 190);
      ctx.quadraticCurveTo(cx - 70, 270, cx, 280);
      ctx.quadraticCurveTo(cx + 70, 270, cx + 70, 190);
      ctx.stroke();
      ctx.fillStyle = "#e8f6fb";
      for (const dx of [-70, 0, 70]) {
        ctx.beginPath();
        ctx.moveTo(cx + dx, 140);
        ctx.lineTo(cx + dx - 14, 185);
        ctx.lineTo(cx + dx + 14, 185);
        ctx.closePath();
        ctx.fill();
      }
      // Damru.
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(cx - 34, 320);
      ctx.lineTo(cx + 34, 320);
      ctx.lineTo(cx - 34, 380);
      ctx.lineTo(cx + 34, 380);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#fff4d6";
      ctx.beginPath();
      ctx.arc(cx + 210, 200, 54, 0, TAU);
      ctx.fill();
      ctx.fillStyle = input.palette[0];
      ctx.beginPath();
      ctx.arc(cx + 236, 186, 50, 0, TAU);
      ctx.fill();
      break;
    }
    case "rakhi": {
      ctx.strokeStyle = "#ffd27a";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(40, 330);
      ctx.bezierCurveTo(300, 280, 780, 380, CARD_W - 40, 320);
      ctx.stroke();
      petals(ctx, cx, 325, 150, 16, "#ffcf5a", "#ff8a3d");
      ctx.fillStyle = "#c2185b";
      ctx.beginPath();
      ctx.arc(cx, 325, 54, 0, TAU);
      ctx.fill();
      ring(ctx, cx, 325, 54, "#ffe9a8", 6);
      break;
    }
    case "kite": {
      const kite = (x: number, y: number, s: number, c1: string, c2: string, rot: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillStyle = c1;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.7, 0);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.7, 0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = c2;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.7, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y + s);
        ctx.quadraticCurveTo(x - 60, y + s + 100, x - 160, 470);
        ctx.stroke();
      };
      kite(cx - 180, 250, 100, "#f2a51a", "#e8630a", -0.2);
      kite(cx + 220, 200, 80, "#ffffff", "#ff4f7a", 0.25);
      kite(cx + 60, 360, 55, "#7cdb5a", "#2e9e4f", 0.1);
      break;
    }
    case "lotus": {
      glow(ctx, cx, 330, 280, accent, 0.4);
      lotus(ctx, cx, 450, 230, accent);
      break;
    }
    case "garland": {
      marigoldString(ctx, -20, CARD_W + 20, 140, 90, 20);
      marigoldString(ctx, -20, CARD_W / 2, 148, 40, 15);
      marigoldString(ctx, CARD_W / 2, CARD_W + 20, 148, 40, 15);
      for (let i = 0; i < 9; i++) {
        const x = 80 + i * 115;
        const len = 70 + (i % 2) * 50;
        ctx.strokeStyle = "#d9a441";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 160);
        ctx.lineTo(x, 160 + len);
        ctx.stroke();
        marigoldString(ctx, x, x + 0.01, 160 + len, 0, 13);
      }
      lotus(ctx, cx, 480, 140, accent);
      break;
    }
  }
}

/** Like `fit`, but also keeps every line inside `maxWidth` (a long single word shrinks the type instead of overflowing). */
function fitStrict(ctx: Ctx, text: string, family: string, weight: number, start: number, min: number, maxWidth: number, maxLines: number) {
  let lines: string[] = [];
  for (let size = start; size >= min; size -= 2) {
    ctx.font = `${weight} ${size}px ${family}`;
    lines = wrap(ctx, text, maxWidth);
    if (lines.length <= maxLines && lines.every((l) => ctx.measureText(l).width <= maxWidth)) return { size, lines, ok: true };
  }
  ctx.font = `${weight} ${min}px ${family}`;
  return { size: min, lines: wrap(ctx, text, maxWidth), ok: false };
}

/** The occasion's picture band (drawn for y 120-480, centred on x 540) is scaled down and set across the card, above the sender panel. */
const ART = { x: 540, y: 842, scale: 0.86, fromY: 300 };
const LEFT = 88;
const TEXT_W = 440;
/** The leader's photo stands on the right; his nameplate sits at its foot. */
const LEADER_X = 783;
const PLATE_X = 545;
const PLATE_W = 475;
const PLATE_BOTTOM = 800;
/** The sender's panel along the foot of the card. */
const PANEL = { x: 74, y: 935, w: 932, h: 300 };

/**
 * The card, laid out like a poster: the greeting on the left (kicker, headline, divider, message, area line), the
 * leader large on the right with a gold nameplate, the occasion's picture below the text, the sender's panel
 * along the foot (round photo, name, "की तरफ़ से") and a double gold frame with corner ornaments.
 */
export function drawCard(canvas: HTMLCanvasElement, input: CardInput) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const [top, bottom, accent, ink] = input.palette;
  const { display, sans } = input.fonts;
  const lightBg = isLight(top);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  // Background, a faint diagonal weave, and a large soft mandala behind the headline.
  const bg = ctx.createLinearGradient(0, 0, 0, CARD_H);
  bg.addColorStop(0, top);
  bg.addColorStop(1, bottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  ctx.save();
  ctx.strokeStyle = lightBg ? "rgba(0,0,0,0.028)" : "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  for (let x = -CARD_H; x < CARD_W; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + CARD_H, CARD_H);
    ctx.stroke();
  }
  ctx.translate(235, 360);
  ctx.strokeStyle = rgba(accent, lightBg ? 0.16 : 0.1);
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 16; i++) {
    ctx.rotate(Math.PI / 16);
    ctx.beginPath();
    ctx.ellipse(0, 0, 270, 125, 0, 0, TAU);
    ctx.stroke();
  }
  ctx.restore();

  // The occasion's picture, moved to the lower left and faded in from above so it never cuts across the text.
  const art = document.createElement("canvas");
  art.width = CARD_W;
  art.height = CARD_H;
  const a = art.getContext("2d");
  if (a) {
    a.save();
    a.translate(ART.x, ART.y);
    a.scale(ART.scale, ART.scale);
    a.translate(-CARD_W / 2, -ART.fromY);
    drawMotif(a, input);
    if (input.scene) {
      a.translate(0, -SCENE_LIFT);
      drawScene(a, input.scene, accent, ink, display);
    }
    a.restore();
    a.globalCompositeOperation = "destination-in";
    const fade = a.createLinearGradient(0, 700, 0, 790);
    fade.addColorStop(0, "rgba(0,0,0,0)");
    fade.addColorStop(1, "#000");
    a.fillStyle = fade;
    a.fillRect(0, 0, CARD_W, CARD_H);
    // soft edges, so the band reads as one picture set across the card
    const edge = a.createLinearGradient(0, 0, CARD_W, 0);
    edge.addColorStop(0, "rgba(0,0,0,0)");
    edge.addColorStop(0.1, "#000");
    edge.addColorStop(0.9, "#000");
    edge.addColorStop(1, "rgba(0,0,0,0)");
    a.fillStyle = edge;
    a.fillRect(0, 0, CARD_W, CARD_H);
    ctx.drawImage(art, 0, 0);
  }

  // A soft vignette, so the background is not flat.
  const vg = ctx.createRadialGradient(CARD_W / 2, CARD_H * 0.45, CARD_W * 0.45, CARD_W / 2, CARD_H * 0.45, CARD_H * 0.8);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, lightBg ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.28)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Double gold frame with a leaf and a short rule in each corner.
  ctx.save();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(27, 27, CARD_W - 54, CARD_H - 54);
  ctx.strokeStyle = rgba(accent, 0.45);
  ctx.lineWidth = 1.2;
  ctx.strokeRect(41, 41, CARD_W - 82, CARD_H - 82);
  const corner = (x: number, y: number, sx: number, sy: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sx, sy);
    ctx.fillStyle = accent;
    ctx.strokeStyle = rgba(accent, 0.85);
    ctx.lineWidth = 1.6;
    for (const flip of [false, true]) {
      ctx.save();
      if (flip) ctx.transform(0, 1, 1, 0, 0, 0);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(34, -4, 52, 18);
      ctx.quadraticCurveTo(24, 30, 0, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(66, 4);
      ctx.lineTo(132, 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(138, 4, 3, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  };
  corner(46, 46, 1, 1);
  corner(CARD_W - 46, 46, -1, 1);
  corner(46, CARD_H - 46, 1, -1);
  corner(CARD_W - 46, CARD_H - 46, -1, -1);
  ctx.restore();

  // ---- Left column: kicker, headline, divider, message, area line. ----
  const headline = input.greeting.replace(/हार्दिक\s+|warm\s+/gi, "").replace(/^./, (c) => c.toUpperCase());
  const KICK_Y = 176;
  const place = (k: number) => {
    // Two lines when they fit at a good size, as on a poster; three only for long names.
    const two = fitStrict(ctx, headline, display, 400, Math.round(126 * k), 80, TEXT_W, 2);
    const t = two.ok ? two : fitStrict(ctx, headline, display, 400, Math.round(112 * k), 44, TEXT_W, 3);
    const m = fitStrict(ctx, input.line, sans, 400, Math.round(44 * k), 24, TEXT_W, 3);
    const ar = fitStrict(ctx, input.area, sans, 500, Math.round(26 * k), 18, TEXT_W, 3);
    const tBase = 222 + t.size * 0.98;
    const tLast = tBase + (t.lines.length - 1) * t.size * 1.17;
    const divY = tLast + t.size * 0.3 + 14;
    const mBase = divY + 44 + m.size * 0.9;
    const mLast = mBase + (m.lines.length - 1) * m.size * 1.4;
    const aBase = mLast + 36 + ar.size * 0.9;
    const aLast = aBase + (ar.lines.length - 1) * ar.size * 1.36;
    return { t, m, ar, tBase, tLast, divY, mBase, aBase, aLast };
  };
  let k = 1;
  let L = place(k);
  while (L.aLast > 750 && k > 0.55) {
    k -= 0.05;
    L = place(k);
  }

  // Kicker: a rule, a diamond, the words.
  ctx.fillStyle = accent;
  ctx.fillRect(LEFT, KICK_Y - 10, 46, 2);
  ctx.beginPath();
  ctx.moveTo(LEFT + 52, KICK_Y - 17);
  ctx.lineTo(LEFT + 59, KICK_Y - 10);
  ctx.lineTo(LEFT + 52, KICK_Y - 3);
  ctx.lineTo(LEFT + 45, KICK_Y - 10);
  ctx.closePath();
  ctx.fill();
  ctx.font = `500 27px ${sans}`;
  ctx.fillText(input.kicker ?? "", LEFT + 72, KICK_Y);

  // Headline.
  ctx.save();
  ctx.font = `${L.t.size}px ${display}`;
  if (lightBg) {
    ctx.fillStyle = ink;
  } else {
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    const tg = ctx.createLinearGradient(0, L.tBase - L.t.size, 0, L.tLast + L.t.size * 0.25);
    tg.addColorStop(0, "#ffefb5");
    tg.addColorStop(1, accent);
    ctx.fillStyle = tg;
  }
  L.t.lines.forEach((line, i) => ctx.fillText(line, LEFT, L.tBase + i * L.t.size * 1.17));
  ctx.restore();

  // Divider: rule, diamond, rule.
  ctx.fillStyle = accent;
  ctx.fillRect(LEFT, L.divY - 1, 150, 2);
  ctx.fillRect(LEFT + 170, L.divY - 1, 62, 2);
  ctx.beginPath();
  ctx.moveTo(LEFT + 160, L.divY - 8);
  ctx.lineTo(LEFT + 168, L.divY);
  ctx.lineTo(LEFT + 160, L.divY + 8);
  ctx.lineTo(LEFT + 152, L.divY);
  ctx.closePath();
  ctx.fill();

  // Message, then the area line.
  ctx.fillStyle = ink;
  ctx.font = `400 ${L.m.size}px ${sans}`;
  L.m.lines.forEach((line, i) => ctx.fillText(line, LEFT, L.mBase + i * L.m.size * 1.4));
  ctx.fillStyle = accent;
  ctx.font = `500 ${L.ar.size}px ${sans}`;
  L.ar.lines.forEach((line, i) => ctx.fillText(line, LEFT, L.aBase + i * L.ar.size * 1.36));

  // ---- Right: the leader, large, with a gold nameplate at his foot. ----
  glow(ctx, LEADER_X, 380, 330, accent, 0.32);
  // A round backdrop with two fine rings behind the figure, so the photograph sits on a ground of its own.
  const bx = LEADER_X;
  const by = 430;
  const br = 262;
  const disc = ctx.createRadialGradient(bx, by - 40, 20, bx, by, br);
  disc.addColorStop(0, rgba(accent, lightBg ? 0.32 : 0.42));
  disc.addColorStop(0.65, rgba(accent, lightBg ? 0.16 : 0.2));
  disc.addColorStop(1, rgba(accent, 0.05));
  ctx.fillStyle = disc;
  ctx.beginPath();
  ctx.arc(bx, by, br, 0, TAU);
  ctx.fill();
  ring(ctx, bx, by, br, rgba(accent, 0.7), 2.5);
  ring(ctx, bx, by, br + 18, rgba(accent, 0.3), 1.5);
  if (input.leader.photo) standingImage(ctx, input.leader.photo, LEADER_X, 840, 710);

  ctx.textAlign = "center";
  const name = fitStrict(ctx, input.leader.name, display, 400, 54, 30, PLATE_W - 60, 1);
  // The post breaks at its dash ("… विधानसभा" / "समाजवादी पार्टी"), each part on its own line.
  const roleLines = input.leader.role.split(/\s+[-]\s+/);
  let roleSize = 24;
  for (; roleSize > 15; roleSize -= 1) {
    ctx.font = `400 ${roleSize}px ${sans}`;
    if (roleLines.every((l) => ctx.measureText(l).width <= PLATE_W - 50)) break;
  }
  const role = { size: roleSize, lines: roleLines };
  const plateH = 26 + name.size * 1.05 + 8 + role.lines.length * role.size * 1.32 + 16;
  const plateY = PLATE_BOTTOM - plateH;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  const gold = ctx.createLinearGradient(PLATE_X, 0, PLATE_X + PLATE_W, 0);
  gold.addColorStop(0, "#f6dc88");
  gold.addColorStop(0.5, "#d9a032");
  gold.addColorStop(1, "#f3d683");
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.roundRect(PLATE_X, plateY, PLATE_W, plateH, 14);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(PLATE_X + 5, plateY + 5, PLATE_W - 10, plateH - 10, 10);
  ctx.stroke();
  const plateCx = PLATE_X + PLATE_W / 2;
  ctx.fillStyle = "#2a1806";
  ctx.font = `${name.size}px ${display}`;
  ctx.fillText(name.lines[0], plateCx, plateY + 22 + name.size * 0.9);
  ctx.fillStyle = "#4b3310";
  ctx.font = `400 ${role.size}px ${sans}`;
  role.lines.forEach((line, i) => ctx.fillText(line, plateCx, plateY + 22 + name.size * 1.05 + 14 + role.size * 0.95 + i * role.size * 1.32));

  // ---- Foot: the sender's panel. ----
  ctx.textAlign = "left";
  ctx.fillStyle = lightBg ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.78)";
  ctx.beginPath();
  ctx.roundRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h, 42);
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = rgba(accent, 0.85);
  ctx.stroke();

  const ax = PANEL.x + 170;
  const ay = PANEL.y + PANEL.h / 2;
  const ar = 104;
  const sender = input.sender.name.trim();
  ring(ctx, ax, ay, ar + 22, rgba(accent, 0.4), 2);
  ctx.fillStyle = lightBg ? rgba(accent, 0.25) : "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.arc(ax, ay, ar, 0, TAU);
  ctx.fill();
  if (input.sender.photo) {
    circleImage(ctx, input.sender.photo, ax, ay, ar);
  } else if (sender) {
    const ig = ctx.createLinearGradient(0, ay - 60, 0, ay + 60);
    ig.addColorStop(0, "#ffefb5");
    ig.addColorStop(1, accent);
    ctx.fillStyle = ig;
    ctx.textAlign = "center";
    ctx.font = `120px ${display}`;
    ctx.fillText(sender.slice(0, 1), ax, ay + 42);
    ctx.textAlign = "left";
  } else {
    // An empty portrait: a head and shoulders, so it is clear where the visitor's photo goes.
    ctx.save();
    ctx.beginPath();
    ctx.arc(ax, ay, ar, 0, TAU);
    ctx.clip();
    ctx.fillStyle = rgba(accent, 0.8);
    ctx.beginPath();
    ctx.arc(ax, ay - 25, 36, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(ax, ay + 78, 68, 56, 0, Math.PI, TAU);
    ctx.fill();
    ctx.restore();
  }
  const rg = ctx.createLinearGradient(ax - ar, ay - ar, ax + ar, ay + ar);
  rg.addColorStop(0, "#fbe39a");
  rg.addColorStop(0.5, "#d49a2c");
  rg.addColorStop(1, "#f6dc88");
  ring(ctx, ax, ay, ar + 7, rg as unknown as string, 8);

  const tx = ax + ar + 62;
  const tw = PANEL.x + PANEL.w - 44 - tx;
  ctx.fillStyle = accent;
  ctx.font = `500 29px ${sans}`;
  ctx.fillText(input.kicker ?? "", tx, ay - 58);
  ctx.fillRect(tx, ay - 44, 92, 2);
  const nm = fitStrict(ctx, sender || input.sender.placeholder, sans, 700, 74, 34, tw, 1);
  ctx.fillStyle = sender ? ink : rgba(ink, 0.45);
  ctx.font = `700 ${nm.size}px ${sans}`;
  ctx.fillText(nm.lines[0], tx, ay + 32);
  const sub = input.sender.place.trim() || input.sender.fromLabel;
  if (sub) {
    const sb = fitStrict(ctx, sub, sans, 400, 28, 18, tw, 1);
    ctx.fillStyle = rgba(ink, 0.85);
    ctx.font = `400 ${sb.size}px ${sans}`;
    ctx.fillText(sb.lines[0], tx, ay + 82);
  }

  // Footer: the page address between two diamonds.
  ctx.textAlign = "center";
  ctx.font = `500 22px ${sans}`;
  const fw = ctx.measureText(input.footer).width;
  ctx.fillStyle = rgba(ink, 0.85);
  ctx.fillText(input.footer, CARD_W / 2, CARD_H - 62);
  ctx.fillStyle = accent;
  for (const dx of [-(fw / 2 + 26), fw / 2 + 26]) {
    ctx.beginPath();
    ctx.moveTo(CARD_W / 2 + dx, CARD_H - 76);
    ctx.lineTo(CARD_W / 2 + dx + 6, CARD_H - 70);
    ctx.lineTo(CARD_W / 2 + dx, CARD_H - 64);
    ctx.lineTo(CARD_W / 2 + dx - 6, CARD_H - 70);
    ctx.closePath();
    ctx.fill();
  }
  ctx.textAlign = "left";
}

function isLight(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 170;
}

export function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Resolve the real family name next/font gave a CSS variable, for use in canvas `font`. */
export function fontFromVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!v) return fallback;
  return fallback ? `${v}, ${fallback}` : v;
}
