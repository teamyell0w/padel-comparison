"use client";

import { useMemo } from "react";
import { matchesPartial } from "@/lib/finder";
import type { FinderAnswers } from "@/lib/finder";
import type { PadelRacket } from "@/lib/types";

interface RacketWallProps {
  products: PadelRacket[];
  partial: Partial<FinderAnswers>;
}

/** Shopify-CDN: kleine Thumbs anfordern statt Originalgroesse */
function thumb(url: string): string {
  if (!url) return url;
  return url.includes("?") ? `${url}&width=160` : `${url}?width=160`;
}

/**
 * Die Schlaegerwand: das gesamte Sortiment als Buehne.
 * Mit jeder Antwort fallen die Schlaeger sichtbar raus, die nicht passen.
 */
export function RacketWall({ products, partial }: RacketWallProps) {
  // Nur empfehlbare Schlaeger an die Wand (Test-/Junior-Modelle raus)
  const wall = useMemo(
    () => products.filter((p) => matchesPartial(p, {})),
    [products]
  );

  return (
    <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-1.5 content-start">
      {wall.map((racket) => {
        const active = matchesPartial(racket, partial);
        return (
          <div
            key={racket.id}
            className={`relative aspect-[3/4] bg-white rounded-sm overflow-hidden transition-all duration-500 ${
              active ? "opacity-100" : "opacity-[0.13] grayscale"
            }`}
          >
            <img
              src={thumb(racket.imageUrl)}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain p-0.5"
            />
          </div>
        );
      })}
    </div>
  );
}
