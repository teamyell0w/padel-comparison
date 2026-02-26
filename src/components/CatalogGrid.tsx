"use client";

import { useRouter } from "next/navigation";
import { PadelRacket } from "@/lib/types";
import { useCatalog, matchesPriceBracket } from "@/context/CatalogContext";
import { CatalogCard } from "./CatalogCard";
import { CatalogFilterBar } from "./CatalogFilterBar";

interface CatalogGridProps {
  products: PadelRacket[];
}

export function CatalogGrid({ products }: CatalogGridProps) {
  const router = useRouter();
  const { filters, selectedIds, toggleId, selectAll, clearSelection, isSelected } = useCatalog();

  const filtered = products.filter((p) => {
    if (filters.playType !== "all" && p.playType !== filters.playType) return false;
    if (filters.headShape !== "all" && p.headShape !== filters.headShape) return false;
    if (filters.playerLevel !== "all" && p.playerLevel !== filters.playerLevel) return false;
    if (!matchesPriceBracket(p.price, filters.priceBracket)) return false;
    return true;
  });

  const filteredIds = filtered.map((p) => p.id);
  const allFilteredSelected = filtered.length > 0 && filtered.every((p) => selectedIds.has(p.id));

  const handleOpenMatrix = () => {
    const ids = Array.from(selectedIds).join(",");
    router.push(`/matrix?ids=${ids}`);
  };

  const handleToggleAll = () => {
    if (allFilteredSelected) {
      clearSelection();
    } else {
      selectAll(filteredIds);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <CatalogFilterBar totalCount={products.length} filteredCount={filtered.length} />

      {/* Select all toggle */}
      <div className="flex items-center gap-3 text-sm">
        <button
          onClick={handleToggleAll}
          className="text-pp-blue hover:text-pp-blue-light transition-colors"
        >
          {allFilteredSelected ? "Alle abwählen" : "Alle auswählen"}
        </button>
        {selectedIds.size > 0 && (
          <span className="text-pp-gray-400">
            {selectedIds.size} ausgewählt
          </span>
        )}
      </div>

      {/* Grid — tight gaps like padel-point.de (8px = gap-2) */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-pp-gray-400">
          Keine Schläger gefunden. Versuche andere Filter.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {filtered.map((product) => (
            <CatalogCard
              key={product.id}
              racket={product}
              selected={isSelected(product.id)}
              onToggle={() => toggleId(product.id)}
            />
          ))}
        </div>
      )}

      {/* Sticky action bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-pp-charcoal text-white shadow-2xl border-t border-pp-gray-700">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-pp-gray-400">
              {selectedIds.size} Schläger ausgewählt
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={clearSelection}
                className="text-sm text-pp-gray-400 hover:text-white transition-colors px-3 py-1.5"
              >
                Leeren
              </button>
              <button
                onClick={handleOpenMatrix}
                className="px-5 py-2 text-sm font-semibold bg-pp-blue text-white hover:bg-pp-blue-light transition-colors"
              >
                In Matrix anzeigen ({selectedIds.size})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
