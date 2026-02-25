"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { PadelRacket } from "@/lib/types";

const MAX_COMPARE = 5;

interface ComparisonContextType {
  selected: PadelRacket[];
  toggleRacket: (racket: PadelRacket) => void;
  removeRacket: (id: string) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
  canAdd: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | null>(null);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<PadelRacket[]>([]);

  const isSelected = useCallback(
    (id: string) => selected.some((r) => r.id === id),
    [selected]
  );

  const toggleRacket = useCallback(
    (racket: PadelRacket) => {
      setSelected((prev) => {
        if (prev.some((r) => r.id === racket.id)) {
          return prev.filter((r) => r.id !== racket.id);
        }
        if (prev.length >= MAX_COMPARE) return prev;
        return [...prev, racket];
      });
    },
    []
  );

  const removeRacket = useCallback((id: string) => {
    setSelected((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setSelected([]);
  }, []);

  return (
    <ComparisonContext.Provider
      value={{
        selected,
        toggleRacket,
        removeRacket,
        clearAll,
        isSelected,
        canAdd: selected.length < MAX_COMPARE,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const ctx = useContext(ComparisonContext);
  if (!ctx) throw new Error("useComparison must be used within ComparisonProvider");
  return ctx;
}
