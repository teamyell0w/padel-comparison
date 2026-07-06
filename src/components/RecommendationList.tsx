"use client";

import type { Recommendation } from "@/lib/finder";

const SHOP_BASE = "https://www.padel-point.de/products";

interface RecommendationListProps {
  recommendations: Recommendation[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  return (
    <div className="space-y-3">
      {recommendations.map((rec, i) => (
        <div
          key={rec.racket.id}
          id={`empfehlung-${i + 1}`}
          className={`scroll-mt-24 flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-6 p-4 md:p-5 bg-white border transition-shadow hover:shadow-md animate-fade-up ${
            i === 0 ? "border-pp-blue border-2" : "border-pp-gray-200"
          }`}
          style={{ animationDelay: `${0.9 + i * 0.12}s` }}
        >
          {/* Rang */}
          <span
            className={`w-7 h-7 md:w-8 md:h-8 shrink-0 rounded-full text-sm font-bold flex items-center justify-center ${
              i === 0 ? "bg-pp-blue text-white" : "bg-pp-gray-100 text-pp-gray-500"
            }`}
          >
            {i + 1}
          </span>

          {/* Bild */}
          <div className="w-16 h-20 md:w-20 md:h-24 shrink-0 bg-pp-gray-50 rounded flex items-center justify-center overflow-hidden">
            <img
              src={rec.racket.imageUrl}
              alt={`${rec.racket.brand} ${rec.racket.title}`}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {i === 0 && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-pp-blue mb-0.5">
                Top-Empfehlung
              </span>
            )}
            <p className="text-[10px] md:text-[11px] text-pp-gray-400 uppercase tracking-wider">
              {rec.racket.brand}
            </p>
            <h3 className="text-sm md:text-base font-bold text-pp-charcoal leading-snug line-clamp-2">
              {rec.racket.title}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {rec.reasons.map((reason) => (
                <span
                  key={reason}
                  className="text-[10px] md:text-[11px] font-medium text-pp-gray-600 bg-pp-gray-100 rounded-full px-2 py-0.5 whitespace-nowrap"
                >
                  ✓ {reason}
                </span>
              ))}
              {rec.overBudget && (
                <span className="text-[10px] md:text-[11px] font-medium text-amber-700 bg-amber-50 rounded-full px-2 py-0.5">
                  Leicht über Budget
                </span>
              )}
            </div>
          </div>

          {/* Preis + CTA: mobil eigene Zeile, ab md rechte Spalte */}
          <div className="w-full flex items-center justify-between gap-3 md:w-auto md:block md:shrink-0 md:text-right">
            <p className="text-base md:text-lg font-bold text-pp-charcoal md:mb-2">
              {rec.racket.price.toFixed(2).replace(".", ",")} €
            </p>
            <a
              href={`${SHOP_BASE}/${rec.racket.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-pp-blue text-white text-xs md:text-sm font-semibold hover:bg-pp-blue-light transition-colors whitespace-nowrap"
            >
              Im Shop ansehen
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
