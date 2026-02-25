"use client";

import { ProductMatrix } from "@/components/ProductMatrix";
import { CompareBar } from "@/components/CompareBar";
import { testProducts } from "@/data/products";

export default function Home() {
  return (
    <div className="min-h-screen bg-pp-gray-50">
      {/* Header */}
      <header className="bg-pp-charcoal text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">PADEL-POINT</h1>
            <p className="text-[11px] text-pp-gray-400 uppercase tracking-wider">Schläger Vergleich</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 pb-24">
        {/* Instructions */}
        <div className="max-w-6xl mx-auto mb-6">
          <h2 className="text-xl font-bold text-pp-charcoal mb-1">
            Finde deinen perfekten Padel-Schläger
          </h2>
          <p className="text-sm text-pp-gray-500">
            Klicke auf bis zu 5 Schläger, um sie miteinander zu vergleichen. Die Position in der Matrix zeigt den Spieltyp (Control vs. Power) und das Spiellevel.
          </p>
        </div>

        {/* Matrix */}
        <ProductMatrix products={testProducts} />
      </main>

      {/* Sticky Compare Bar */}
      <CompareBar />
    </div>
  );
}
