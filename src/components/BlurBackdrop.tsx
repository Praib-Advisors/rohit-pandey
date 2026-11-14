/**
 * Soft, out-of-focus background for page headers, built from colour only (no
 * photographs): an ivory ground with blurred red and green glows. "deep" is the
 * same idea on dark red, for headers with white text over a film. Decorative
 * only. The parent must be `relative isolate overflow-hidden`.
 */
export default function BlurBackdrop({ tone = "light" }: { tone?: "light" | "deep" }) {
  if (tone === "deep") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-red-deep">
        <div className="absolute inset-0 bg-[radial-gradient(60%_90%_at_100%_0%,rgb(255_255_255/0.1),transparent_65%)]" />
        <div className="absolute -right-24 -top-24 size-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(18_161_80/0.3),transparent)]" />
        <div className="absolute -bottom-32 left-[8%] size-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(224_38_47/0.35),transparent)]" />
      </div>
    );
  }
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-[#f5f3ee]">
      <div className="absolute -left-32 -top-44 size-[36rem] rounded-full bg-[radial-gradient(closest-side,rgb(224_38_47/0.16),transparent)]" />
      <div className="absolute -right-32 -top-32 size-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(18_161_80/0.15),transparent)]" />
      <div className="absolute -bottom-44 left-[32%] size-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(184_150_97/0.22),transparent)]" />
    </div>
  );
}
