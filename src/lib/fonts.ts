import { Fraunces, Manrope, Mukta } from "next/font/google";

/**
 * Type system
 * - Fraunces (display serif, variable with an optical size axis) carries every
 *   heading. It gives the site an editorial, print-like voice instead of the
 *   generic geometric sans look.
 * - Manrope carries body text, buttons and navigation: a calm humanist sans
 *   with open counters that stays readable at small sizes.
 * - Mukta covers Devanagari for /hi. Neither Latin face has Devanagari, so
 *   Hindi text falls through to Mukta in each stack.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
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

export const fontVars = `${fraunces.variable} ${manrope.variable} ${mukta.variable}`;
