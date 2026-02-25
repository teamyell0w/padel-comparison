"use client";

import Link from "next/link";
import { useComparison } from "@/context/ComparisonContext";

export function CompareBar() {
  const { selected, removeRacket, clearAll } = useComparison();

  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-pp-charcoal text-white shadow-2xl border-t border-pp-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Selected rackets */}
        <div className="flex items-center gap-3 flex-1 overflow-x-auto">
          {selected.map((racket) => (
            <div
              key={racket.id}
              className="flex items-center gap-2 bg-pp-gray-700 rounded px-3 py-1.5 shrink-0"
            >
              <span className="text-sm font-medium">{racket.title}</span>
              <button
                onClick={() => removeRacket(racket.id)}
                className="text-pp-gray-400 hover:text-white transition-colors text-xs ml-1"
                aria-label={`${racket.title} entfernen`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Count */}
        <span className="text-sm text-pp-gray-400 shrink-0">
          {selected.length} / 5
        </span>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearAll}
            className="text-sm text-pp-gray-400 hover:text-white transition-colors px-3 py-1.5"
          >
            Alle entfernen
          </button>
          <Link
            href={`/compare?ids=${selected.map((r) => r.id).join(",")}`}
            className={`
              px-5 py-2 text-sm font-semibold transition-all
              ${selected.length >= 2
                ? "bg-pp-blue text-white hover:bg-pp-blue-light"
                : "bg-pp-gray-600 text-pp-gray-400 pointer-events-none"
              }
            `}
          >
            Vergleichen ({selected.length})
          </Link>
        </div>
      </div>
    </div>
  );
}
