"use client";

import { PadelRacket, PLAY_TYPE_LABELS } from "@/lib/types";

interface CatalogCardProps {
  racket: PadelRacket;
  selected: boolean;
  onToggle: () => void;
}

export function CatalogCard({ racket, selected, onToggle }: CatalogCardProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        group relative w-full text-left transition-all
        ${selected ? "ring-2 ring-pp-blue" : ""}
      `}
    >
      {/* Selection indicator — subtle top-right check */}
      <div
        className={`
          absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all
          ${selected
            ? "bg-pp-blue text-white scale-100"
            : "bg-white/80 text-pp-gray-400 scale-0 group-hover:scale-100 shadow-sm"
          }
        `}
      >
        {selected ? "✓" : "+"}
      </div>

      {/* Product image — square, white bg, no radius, no padding (like padel-point.de) */}
      <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
        <svg width="64" height="96" viewBox="0 0 24 36" fill="none" className="text-pp-gray-200">
          <ellipse cx="12" cy="12" rx="9" ry="12" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.08" />
          <rect x="10" y="24" width="4" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.08" />
        </svg>
      </div>

      {/* Text content — left-aligned, minimal */}
      <div className="pt-2 pb-3">
        {/* Brand */}
        <span className="text-[10px] text-pp-gray-400 uppercase tracking-wider">
          {racket.brand}
        </span>

        {/* Title */}
        <h3 className="text-sm font-medium text-pp-charcoal leading-tight mt-0.5">
          {racket.brand} {racket.title}
        </h3>

        {/* Play type — single subtle label */}
        <span className="text-[11px] text-pp-gray-500 mt-1 block">
          {PLAY_TYPE_LABELS[racket.playType]}
        </span>

        {/* Price */}
        <span className="text-sm font-bold text-pp-charcoal mt-1.5 block">
          {racket.price.toFixed(2).replace(".", ",")} €
        </span>
      </div>
    </button>
  );
}
