"use client";

import Image from "next/image";
import { useState } from "react";
import { useBi } from "@/lib/lang";
import type { Ideal } from "@/data/ideals";

/**
 * The portrait in a fixed 4:5 frame with rounded corners. Photographs fill the frame and keep the top (the
 * face); drawings and stamps (`imageFit: "contain"`) are shown whole on a soft backdrop. If the file fails
 * to load, a designed placeholder with the name's first letter takes its place.
 */
export default function IdealImage({ person, sizes, priority = false }: { person: Ideal; sizes: string; priority?: boolean }) {
  const bi = useBi();
  const [failed, setFailed] = useState(false);
  const contain = person.imageFit === "contain";
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-sand">
      {failed ? (
        <span aria-hidden="true" className="absolute inset-0 grid place-items-center bg-gradient-to-br from-brand-green to-brand-green-deep font-display text-7xl text-white/80">
          {person.nameHindi.replace(/^(श्री|डॉ\.|लोकनायक|जननायक|महात्मा)\s*/, "").slice(0, 1)}
        </span>
      ) : (
        <Image
          src={person.image}
          alt={bi(person.imageAlt)}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className={contain ? "object-contain p-3" : `object-cover ${person.imagePosition ?? "object-top"}`}
        />
      )}
    </div>
  );
}
