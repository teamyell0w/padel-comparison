"use client";

import { Header } from "@/components/Header";
import { ShopSidebar } from "@/components/ShopSidebar";
import { CatalogGrid } from "@/components/CatalogGrid";
import { testProducts } from "@/data/products";

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-[1920px] mx-auto px-4 md:px-8 py-6 pb-24">
        {/* Breadcrumb */}
        <nav className="text-xs text-pp-gray-400 mb-5">
          <span className="hover:text-pp-charcoal cursor-default">Home</span>
          <span className="mx-1.5">/</span>
          <span className="hover:text-pp-charcoal cursor-default">Padelschläger</span>
          <span className="mx-1.5">/</span>
          <span className="text-pp-charcoal">Alle Schläger</span>
        </nav>

        {/* Page title */}
        <h1 className="text-2xl font-bold text-pp-charcoal mb-1">
          Alle Padelschläger
        </h1>
        <p className="text-sm text-pp-gray-500 mb-6">
          Wähle Schläger aus und vergleiche sie in der Matrix.
        </p>

        {/* Sidebar + Grid */}
        <div className="flex gap-8">
          <ShopSidebar />
          <div className="flex-1 min-w-0">
            <CatalogGrid products={testProducts} />
          </div>
        </div>
      </main>
    </div>
  );
}
