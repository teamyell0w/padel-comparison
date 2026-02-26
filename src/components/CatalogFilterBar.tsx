"use client";

import { useCatalog, PriceBracket } from "@/context/CatalogContext";
import type { PlayType, HeadShape, PlayerLevel } from "@/lib/types";

const PLAY_TYPE_OPTIONS: { value: PlayType | "all"; label: string }[] = [
  { value: "all", label: "Spieltyp" },
  { value: "control", label: "Kontrolle" },
  { value: "allround", label: "Allround" },
  { value: "power", label: "Power" },
];

const HEAD_SHAPE_OPTIONS: { value: HeadShape | "all"; label: string }[] = [
  { value: "all", label: "Kopfform" },
  { value: "round", label: "Rund" },
  { value: "teardrop", label: "Träne" },
  { value: "diamond", label: "Diamant" },
  { value: "hybrid", label: "Hybrid" },
];

const PLAYER_LEVEL_OPTIONS: { value: PlayerLevel | "all"; label: string }[] = [
  { value: "all", label: "Level" },
  { value: "tournament", label: "Tournament" },
  { value: "advanced", label: "Advanced" },
  { value: "intermediate", label: "Intermediate" },
  { value: "recreational", label: "Recreational" },
];

const PRICE_OPTIONS: { value: PriceBracket; label: string }[] = [
  { value: "all", label: "Preis" },
  { value: "under150", label: "Unter 150 €" },
  { value: "150to250", label: "150 – 250 €" },
  { value: "250to350", label: "250 – 350 €" },
  { value: "over350", label: "Über 350 €" },
];

function FilterChip<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const isActive = value !== "all";
  const activeLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={`
          appearance-none text-sm pl-3 pr-7 py-1.5 cursor-pointer transition-colors
          ${isActive
            ? "bg-pp-charcoal text-white"
            : "bg-pp-gray-100 text-pp-charcoal hover:bg-pp-gray-200"
          }
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${isActive ? "text-white" : "text-pp-gray-500"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

export function CatalogFilterBar({ totalCount, filteredCount }: { totalCount: number; filteredCount: number }) {
  const { filters, setFilter, resetFilters } = useCatalog();
  const hasActiveFilters = Object.values(filters).some((v) => v !== "all");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterChip
        value={filters.playType}
        options={PLAY_TYPE_OPTIONS}
        onChange={(v) => setFilter("playType", v)}
      />
      <FilterChip
        value={filters.headShape}
        options={HEAD_SHAPE_OPTIONS}
        onChange={(v) => setFilter("headShape", v)}
      />
      <FilterChip
        value={filters.playerLevel}
        options={PLAYER_LEVEL_OPTIONS}
        onChange={(v) => setFilter("playerLevel", v)}
      />
      <FilterChip
        value={filters.priceBracket}
        options={PRICE_OPTIONS}
        onChange={(v) => setFilter("priceBracket", v)}
      />

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="text-sm text-pp-gray-500 hover:text-pp-charcoal transition-colors ml-1"
        >
          ✕ Zurücksetzen
        </button>
      )}

      <span className="text-xs text-pp-gray-400 ml-auto">
        {filteredCount} Schläger
      </span>
    </div>
  );
}
