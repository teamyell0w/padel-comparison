"use client";

import { PadelRacket } from "@/lib/types";
import { useComparison } from "@/context/ComparisonContext";

export function ProductCard({ racket }: { racket: PadelRacket }) {
  const { toggleRacket, isSelected, canAdd } = useComparison();
  const selected = isSelected(racket.id);
  const disabled = !selected && !canAdd;

  return (
    <button
      onClick={() => !disabled && toggleRacket(racket)}
      disabled={disabled}
      className={`
        group relative flex flex-col items-center gap-1 p-2 rounded transition-all cursor-pointer
        ${selected
          ? "bg-pp-blue/10 ring-2 ring-pp-blue shadow-md"
          : disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-pp-gray-100 hover:shadow-sm"
        }
      `}
    >
      {/* Selection indicator */}
      <div
        className={`
          absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
          ${selected
            ? "bg-pp-blue text-white scale-100"
            : "bg-pp-gray-200 text-pp-gray-400 scale-0 group-hover:scale-100"
          }
        `}
      >
        {selected ? "✓" : "+"}
      </div>

      {/* Racket image */}
      <div className="w-14 h-20 bg-pp-gray-100 rounded flex items-center justify-center text-pp-gray-300 text-[10px] overflow-hidden">
        {racket.imageUrl ? (
          <img src={racket.imageUrl} alt={racket.title} className="w-full h-full object-contain" />
        ) : (
          <svg width="32" height="48" viewBox="0 0 24 36" fill="none">
            <ellipse cx="12" cy="12" rx="9" ry="12" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.08" />
            <rect x="10" y="24" width="4" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.08" />
          </svg>
        )}
      </div>

      {/* Name */}
      <span className="text-[11px] font-medium text-pp-charcoal text-center leading-tight max-w-[80px] truncate">
        {racket.title}
      </span>
      <span className="text-[9px] text-pp-gray-400 uppercase tracking-wider">
        {racket.brand}
      </span>
    </button>
  );
}
