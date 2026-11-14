import Image from "next/image";

const LOGO = { src: "/images/rohit-pandey-sp-logo.webp", width: 1654, height: 412 };

/**
 * The client's logo: Samajwadi Party emblem beside the red/green Devanagari name,
 * on a transparent ground. On the ivory header it stands bare. On red surfaces
 * (footer, mobile menu) pass `plate` so it sits on a white card.
 */
export default function Logo({
  size = "md",
  alt = "",
  plate = false,
}: {
  size?: "md" | "lg";
  alt?: string;
  plate?: boolean;
}) {
  const big = size === "lg";
  return (
    <span
      className={`inline-flex items-center ${
        plate ? `rounded-md bg-white shadow-[0_6px_18px_-8px_rgb(0_0_0/0.45)] ${big ? "px-5 py-3" : "px-3 py-1.5"}` : ""
      }`}
    >
      <Image
        src={LOGO.src}
        width={LOGO.width}
        height={LOGO.height}
        alt={alt}
        preload={!big}
        quality={90}
        sizes={big ? "300px" : "200px"}
        className={`block w-auto ${big ? "h-12 md:h-14" : plate ? "h-9" : "h-10 md:h-12"}`}
      />
    </span>
  );
}
