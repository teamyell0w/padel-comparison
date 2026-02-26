"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import type { PlayType, HeadShape, PlayerLevel } from "@/lib/types";

export type PriceBracket = "all" | "under150" | "150to250" | "250to350" | "over350";

interface CatalogFilters {
  playType: PlayType | "all";
  headShape: HeadShape | "all";
  playerLevel: PlayerLevel | "all";
  priceBracket: PriceBracket;
}

interface CatalogContextType {
  filters: CatalogFilters;
  setFilter: <K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) => void;
  resetFilters: () => void;
  selectedIds: Set<string>;
  toggleId: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
}

const defaultFilters: CatalogFilters = {
  playType: "all",
  headShape: "all",
  playerLevel: "all",
  priceBracket: "all",
};

const CatalogContext = createContext<CatalogContextType | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<CatalogFilters>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const setFilter = useCallback(
    <K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const toggleId = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const value = useMemo(
    () => ({
      filters,
      setFilter,
      resetFilters,
      selectedIds,
      toggleId,
      selectAll,
      clearSelection,
      isSelected,
    }),
    [filters, setFilter, resetFilters, selectedIds, toggleId, selectAll, clearSelection, isSelected]
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}

export function matchesPriceBracket(price: number, bracket: PriceBracket): boolean {
  switch (bracket) {
    case "all": return true;
    case "under150": return price < 150;
    case "150to250": return price >= 150 && price < 250;
    case "250to350": return price >= 250 && price < 350;
    case "over350": return price >= 350;
  }
}
