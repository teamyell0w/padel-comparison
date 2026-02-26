"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { ProductMatrix } from "@/components/ProductMatrix";
import { CompareBar } from "@/components/CompareBar";
import { testProducts } from "@/data/products";

function MatrixContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");
  const ids = idsParam ? idsParam.split(",") : [];

  const products = ids.length > 0
    ? testProducts.filter((p) => ids.includes(p.id))
    : testProducts;

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-pp-gray-50">
        <Header backLink={{ href: "/", label: "Zurück zum Katalog" }} />
        <div className="flex flex-col items-center justify-center p-16">
          <p className="text-pp-gray-500 mb-4">
            Keine Schläger ausgewählt.
          </p>
          <Link
            href="/"
            className="px-5 py-2 bg-pp-blue text-white font-semibold hover:bg-pp-blue-light transition-colors"
          >
            Zum Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pp-gray-50">
      <Header backLink={{ href: "/", label: "Zurück zum Katalog" }} />

      <main className="px-4 py-8 pb-24">
        <div className="max-w-6xl mx-auto mb-6">
          <h2 className="text-xl font-bold text-pp-charcoal mb-1">
            Schläger-Matrix ({products.length} Schläger)
          </h2>
          <p className="text-sm text-pp-gray-500">
            Klicke auf bis zu 5 Schläger, um sie miteinander zu vergleichen. Die Position zeigt Spieltyp und Level.
          </p>
        </div>

        <ProductMatrix products={products} />
      </main>

      <CompareBar />
    </div>
  );
}

export default function MatrixPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-pp-gray-50 flex items-center justify-center">Laden...</div>}>
      <MatrixContent />
    </Suspense>
  );
}
