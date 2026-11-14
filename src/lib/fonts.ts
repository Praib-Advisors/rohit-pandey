import { Cormorant_Garamond, Inter, Mukta } from "next/font/google";

/**
 * Type system
 * - Cormorant Garamond (display serif) carries every heading, in light,
 *   editorial weights.
 * - Inter carries body text, buttons and navigation.
 * - Mukta covers Devanagari for /hi. Neither Latin face has Devanagari, so
 *   Hindi text falls through to Mukta in each stack.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Devanagari, for /hi. 800 is its heaviest weight and carries the headings. */
export const mukta = Mukta({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mukta",
  display: "swap",
  preload: false,
});

export const fontVars = `${cormorant.variable} ${inter.variable} ${mukta.variable}`;
