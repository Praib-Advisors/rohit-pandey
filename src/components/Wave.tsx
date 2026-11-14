const FILL = {
  ivory: "fill-[#f5f3ee]",
  sand: "fill-[#eae6dd]",
  deep: "fill-[#4a0a10]",
} as const;

/**
 * A gently wavy top edge for a section, with a fine red line along the curve.
 * Place it directly before the section it belongs to: it draws that section's
 * own colour rising over the one above, so it never needs to know the colour
 * of the previous section.
 */
export default function Wave({ tone }: { tone: keyof typeof FILL }) {
  return (
    <div aria-hidden className="pointer-events-none relative z-[1] h-0">
      <svg
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[-1px] block h-6 w-full md:h-9"
      >
        <path d="M0 40V22C240 4 480 36 720 22S1200 6 1440 24V40Z" className={FILL[tone]} />
        <path
          d="M0 22C240 4 480 36 720 22S1200 6 1440 24"
          fill="none"
          className="stroke-red-dk/35"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
