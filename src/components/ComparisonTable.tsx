"use client";

import { PadelRacket, HEAD_SHAPE_LABELS, BALANCE_LABELS, HARDNESS_LABELS, PLAY_TYPE_LABELS } from "@/lib/types";
import { HeadShapeIcon } from "./icons/HeadShapeIcon";
import { BalanceIcon } from "./icons/BalanceIcon";
import { SurfaceMaterialIcon, CoreMaterialIcon } from "./icons/MaterialIcon";
import { PlayTypeIcon } from "./icons/PlayTypeIcon";
import { WeightIcon } from "./icons/WeightIcon";

interface ComparisonTableProps {
  rackets: PadelRacket[];
  onRemove: (id: string) => void;
}

interface AttributeRowProps {
  label: string;
  icon: React.ReactNode;
  values: string[];
}

function getMostCommon(values: string[]): string | null {
  if (values.length === 0) return null;
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let maxCount = 0;
  let mostCommon = values[0];
  for (const [val, count] of counts) {
    if (count > maxCount) { maxCount = count; mostCommon = val; }
  }
  // If all values are unique, nothing is "most common" — highlight all
  if (maxCount === 1 && counts.size > 1) return null;
  return mostCommon;
}

function AttributeRow({ label, icon, values }: AttributeRowProps) {
  const allSame = new Set(values).size === 1;
  const common = getMostCommon(values);

  return (
    <div className="flex border-b border-pp-gray-100 last:border-b-0">
      {/* Label */}
      <div className="w-40 shrink-0 flex items-center gap-2 px-4 py-3 bg-pp-gray-50 border-r border-pp-gray-100">
        <span className="text-pp-gray-500">{icon}</span>
        <span className="text-xs font-medium text-pp-gray-600 uppercase tracking-wider">{label}</span>
      </div>
      {/* Values */}
      {values.map((v, i) => {
        const isDifferent = !allSame && (common === null || v !== common);
        return (
          <div
            key={i}
            className={`flex-1 min-w-[160px] flex items-center justify-center px-4 py-3 text-sm font-medium ${
              isDifferent ? "text-pp-blue font-semibold" : "text-pp-charcoal"
            }`}
          >
            {v}
          </div>
        );
      })}
    </div>
  );
}

export function ComparisonTable({ rackets, onRemove }: ComparisonTableProps) {
  const weightValues = rackets.map((r) => `${r.weight}g`);
  const headShapeValues = rackets.map((r) => HEAD_SHAPE_LABELS[r.headShape]);
  const balanceValues = rackets.map((r) => BALANCE_LABELS[r.balance]);
  const surfaceValues = rackets.map((r) => HARDNESS_LABELS[r.surfaceHardness]);
  const coreValues = rackets.map((r) => HARDNESS_LABELS[r.coreHardness]);
  const playTypeValues = rackets.map((r) => PLAY_TYPE_LABELS[r.playType]);

  const surfaceFullValues = rackets.map((r) => `${HARDNESS_LABELS[r.surfaceHardness]} (${r.surfaceMaterial})`);
  const coreFullValues = rackets.map((r) => `${HARDNESS_LABELS[r.coreHardness]} (${r.coreMaterial})`);

  return (
    <div className="w-full overflow-x-auto scrollbar-thin">
      <div className="min-w-fit">
        {/* Header: Product images + info */}
        <div className="flex border-b-2 border-pp-gray-200">
          {/* Spacer for label column */}
          <div className="w-40 shrink-0" />

          {rackets.map((racket) => (
            <div
              key={racket.id}
              className="flex-1 min-w-[160px] flex flex-col items-center p-4 relative group"
            >
              {/* Remove button */}
              <button
                onClick={() => onRemove(racket.id)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-pp-gray-100 hover:bg-pp-gray-200 text-pp-gray-400 hover:text-pp-charcoal flex items-center justify-center text-xs transition-all opacity-0 group-hover:opacity-100"
                aria-label={`${racket.title} entfernen`}
              >
                ✕
              </button>

              {/* Product image */}
              <div className="w-20 h-28 bg-pp-gray-100 rounded flex items-center justify-center mb-3 overflow-hidden">
                {racket.imageUrl ? (
                  <img src={racket.imageUrl} alt={`${racket.brand} ${racket.title}`} className="w-full h-full object-contain" />
                ) : (
                  <svg width="40" height="60" viewBox="0 0 24 36" fill="none" className="text-pp-gray-300">
                    <ellipse cx="12" cy="12" rx="9" ry="12" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.08" />
                    <rect x="10" y="24" width="4" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.08" />
                  </svg>
                )}
              </div>

              {/* Brand */}
              <span className="text-[10px] text-pp-gray-400 uppercase tracking-wider mb-0.5">
                {racket.brand}
              </span>

              {/* Name */}
              <span className="text-sm font-semibold text-pp-charcoal text-center">
                {racket.title}
              </span>

              {/* Price */}
              <span className="text-lg font-bold text-pp-charcoal mt-1">
                {racket.price.toFixed(2).replace(".", ",")} €
              </span>
            </div>
          ))}
        </div>

        {/* Attributes */}
        <AttributeRow
          label="Gewicht"
          icon={<WeightIcon size={20} />}
          values={weightValues}
        />
        <AttributeRow
          label="Kopfform"
          icon={<HeadShapeIcon shape={rackets[0]?.headShape ?? "round"} size={20} />}
          values={headShapeValues}
        />
        <AttributeRow
          label="Balance"
          icon={<BalanceIcon balance="balanced" size={20} />}
          values={balanceValues}
        />
        <AttributeRow
          label="Schlagfläche"
          icon={<SurfaceMaterialIcon hardness="medium" size={20} />}
          values={surfaceFullValues}
        />
        <AttributeRow
          label="Kern"
          icon={<CoreMaterialIcon hardness="medium" size={20} />}
          values={coreFullValues}
        />
        <AttributeRow
          label="Spieltyp"
          icon={<PlayTypeIcon type="allround" size={20} />}
          values={playTypeValues}
        />
      </div>
    </div>
  );
}
