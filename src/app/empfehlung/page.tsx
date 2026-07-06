"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { ResultMatrix } from "@/components/ResultMatrix";
import { RecommendationList } from "@/components/RecommendationList";
import { getProducts } from "@/lib/products";
import {
  parseAnswers,
  recommend,
  profilePosition,
  archetype,
  FINDER_LEVEL_LABELS,
  FINDER_WEIGHT_LABELS,
  FINDER_BUDGET_LABELS,
} from "@/lib/finder";
import { PLAY_TYPE_LABELS } from "@/lib/types";
import type { PadelRacket } from "@/lib/types";

function FinderHeader() {
  return (
    <header className="bg-white">
      <div className="bg-pp-blue text-white text-center py-1.5">
        <span className="text-[11px] tracking-wide">
          Jetzt <strong>15% Extra-Rabatt</strong> sichern. Code: <strong>SALE15</strong>
        </span>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between border-b border-pp-gray-100">
        <Link href="/" className="block">
          <img src="/logos/PadelPoint_Logo_Dark.svg" alt="Padel-Point" className="h-7" />
        </Link>
        <Link href="/katalog" className="text-sm text-pp-gray-500 hover:text-pp-charcoal transition-colors">
          Zum Katalog →
        </Link>
      </div>
    </header>
  );
}

function EmpfehlungContent() {
  const searchParams = useSearchParams();
  const answers = parseAnswers(new URLSearchParams(searchParams.toString()));

  const [allProducts, setAllProducts] = useState<PadelRacket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setAllProducts)
      .finally(() => setLoading(false));
  }, []);

  if (!answers) {
    return (
      <div className="min-h-screen bg-white">
        <FinderHeader />
        <div className="flex flex-col items-center justify-center p-16">
          <p className="text-pp-gray-500 mb-4">Da fehlen noch ein paar Antworten.</p>
          <Link href="/" className="px-5 py-2 bg-pp-blue text-white font-semibold hover:bg-pp-blue-light transition-colors">
            Zum Schlägerberater
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-pp-gray-400 text-sm">
        Deine Empfehlung wird berechnet...
      </div>
    );
  }

  const recommendations = recommend(allProducts, answers);
  const profile = profilePosition(answers);
  const compareIds = recommendations.map((r) => r.racket.id).join(",");

  const answerChips = [
    FINDER_LEVEL_LABELS[answers.level],
    PLAY_TYPE_LABELS[answers.style],
    `Gewicht: ${FINDER_WEIGHT_LABELS[answers.weight]}`,
    FINDER_BUDGET_LABELS[answers.budget],
  ];

  return (
    <div className="min-h-screen bg-white">
      <FinderHeader />

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        {/* Kopf */}
        <div className="animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pp-blue mb-3">
            Dein Spielerprofil
          </p>
          <h1
            className="font-statement text-4xl md:text-6xl text-pp-dark uppercase leading-[1.05] mb-3"
           
          >
            {archetype(answers)}.
          </h1>
          <p className="text-base md:text-lg text-pp-gray-500 mb-5">
            Diese {recommendations.length} Schläger passen zu deinem Spiel.
          </p>
        </div>

        {/* Antworten + Anpassen */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {answerChips.map((chip) => (
            <span key={chip} className="text-xs font-medium text-pp-gray-600 bg-pp-gray-100 rounded-full px-3 py-1">
              {chip}
            </span>
          ))}
          <Link href="/" className="text-xs font-medium text-pp-blue hover:underline underline-offset-2 ml-1">
            Antworten ändern
          </Link>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-pp-gray-500 mb-4">
              Für diese Kombination haben wir gerade keinen passenden Schläger auf Lager.
            </p>
            <Link href="/" className="px-5 py-2 bg-pp-blue text-white font-semibold hover:bg-pp-blue-light transition-colors">
              Antworten anpassen
            </Link>
          </div>
        ) : (
          <>
            {/* Matrix */}
            <div className="mb-4">
              <ResultMatrix recommendations={recommendations} profile={profile} />
            </div>
            <p className="text-xs text-pp-gray-400 text-center mb-12">
              Die Position zeigt Spielstil und Level. Der gestrichelte Kreis bist du.
            </p>

            {/* Liste */}
            <RecommendationList recommendations={recommendations} />

            {/* Abschluss */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {recommendations.length >= 2 && (
                <Link
                  href={`/compare?ids=${compareIds}`}
                  className="px-8 py-3.5 bg-pp-charcoal text-white text-sm font-semibold hover:bg-pp-dark transition-colors"
                >
                  Alle {recommendations.length} im Detail vergleichen
                </Link>
              )}
              <Link href="/katalog" className="text-sm text-pp-gray-400 hover:text-pp-charcoal underline underline-offset-4 transition-colors">
                Lieber selbst stöbern
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function EmpfehlungPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-pp-gray-400 text-sm">
          Laden...
        </div>
      }
    >
      <EmpfehlungContent />
    </Suspense>
  );
}
