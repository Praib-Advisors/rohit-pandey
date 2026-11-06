import Image from "next/image";

const LOGO = { src: "/images/rohit-pandey-signature-logo.webp", width: 1495, height: 491 };

/**
 * The client's signature wordmark (red "Rohit", green "Pandey") on a transparent
 * ground. On the white header it stands bare. On red surfaces (footer, mobile
 * menu) pass `plate` so the red/green lettering sits on a white card instead of
 * vanishing into the background.
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
        sizes={big ? "280px" : "200px"}
        className={`block w-auto ${big ? "h-14 md:h-16" : plate ? "h-9" : "h-11 md:h-14"}`}
      />
    </span>
  );
}
