"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ComparisonTable } from "@/components/ComparisonTable";
import { testProducts } from "@/data/products";

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");
  const ids = idsParam ? idsParam.split(",") : [];

  const rackets = ids
    .map((id) => testProducts.find((p) => p.id === id))
    .filter(Boolean) as typeof testProducts;

  if (rackets.length < 2) {
    return (
      <div className="min-h-screen bg-pp-gray-50 flex flex-col items-center justify-center p-8">
        <p className="text-pp-gray-500 mb-4">
          Bitte wähle mindestens 2 Schläger zum Vergleichen aus.
        </p>
        <Link
          href="/"
          className="px-5 py-2 bg-pp-blue text-white font-semibold hover:bg-pp-blue-light transition-colors"
        >
          Zurück zur Matrix
        </Link>
      </div>
    );
  }

  const handleRemove = (id: string) => {
    const newIds = ids.filter((i) => i !== id);
    if (newIds.length < 2) {
      window.location.href = "/";
    } else {
      window.location.href = `/compare?ids=${newIds.join(",")}`;
    }
  };

  return (
    <div className="min-h-screen bg-pp-gray-50">
      {/* Header */}
      <header className="bg-pp-charcoal text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">PADEL-POINT</h1>
            <p className="text-[11px] text-pp-gray-400 uppercase tracking-wider">
              Schläger Vergleich
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-pp-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            ← Zurück zur Matrix
          </Link>
        </div>
      </header>

      {/* Comparison */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-pp-charcoal mb-1">
          Vergleich ({rackets.length} Schläger)
        </h2>
        <p className="text-sm text-pp-gray-500 mb-6">
          Unterschiede werden farblich hervorgehoben.
        </p>

        <div className="bg-white border border-pp-gray-200 rounded overflow-hidden">
          <ComparisonTable rackets={rackets} onRemove={handleRemove} />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-pp-blue text-white font-semibold hover:bg-pp-blue-light transition-colors"
          >
            Zurück zur Matrix
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-pp-gray-50 flex items-center justify-center">Laden...</div>}>
      <CompareContent />
    </Suspense>
  );
}
