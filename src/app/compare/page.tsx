"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { ComparisonTable } from "@/components/ComparisonTable";
import { getProducts } from "@/lib/products";
import type { PadelRacket } from "@/lib/types";

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");
  const ids = idsParam ? idsParam.split(",") : [];

  const [allProducts, setAllProducts] = useState<PadelRacket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setAllProducts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-pp-gray-400 text-sm">
        Schläger werden geladen...
      </div>
    );
  }

  const rackets = ids
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean) as PadelRacket[];

  if (rackets.length < 2) {
    return (
      <div className="min-h-screen bg-white">
        <Header backLink={{ href: "/matrix", label: "Zurück zur Matrix" }} />
        <div className="flex flex-col items-center justify-center p-16">
          <p className="text-pp-gray-500 mb-4">
            Bitte wähle mindestens 2 Schläger zum Vergleichen aus.
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

  const handleRemove = (id: string) => {
    const newIds = ids.filter((i) => i !== id);
    if (newIds.length < 2) {
      window.location.href = "/matrix";
    } else {
      window.location.href = `/compare?ids=${newIds.join(",")}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header backLink={{ href: "/matrix", label: "Zurück zur Matrix" }} />

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
            href="/matrix"
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
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-pp-gray-400 text-sm">Laden...</div>}>
      <CompareContent />
    </Suspense>
  );
}
