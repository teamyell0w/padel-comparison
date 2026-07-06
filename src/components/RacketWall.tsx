"use client";

import { useMemo, useState } from "react";
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
 * Eine Kachel der Wand. Kein Spinner: Die Kachel steht als Skeleton
 * und das Bild blendet ein, sobald es geladen ist. Bei 231 Kacheln
 * entsteht so von selbst eine Lade-Kaskade ueber die Wand.
 */
function WallTile({ racket, active }: { racket: PadelRacket; active: boolean }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative aspect-[3/4] rounded-sm overflow-hidden transition-all duration-500 ${
        loaded ? "bg-white" : "bg-pp-gray-100"
      } ${active ? "opacity-100" : "opacity-[0.13] grayscale"}`}
    >
      <img
        src={thumb(racket.imageUrl)}
        alt=""
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-contain p-0.5 transition-all duration-500 ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      />
    </div>
  );
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
      {wall.map((racket) => (
        <WallTile key={racket.id} racket={racket} active={matchesPartial(racket, partial)} />
      ))}
    </div>
  );
}
