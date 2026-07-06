"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MatrixInput } from "./MatrixInput";
import { RacketWall } from "./RacketWall";
import { getProducts } from "@/lib/products";
import { countPool, positionToAnswers, FINDER_LEVEL_LABELS } from "@/lib/finder";
import type { FinderAnswers, FinderWeight, FinderBudget } from "@/lib/finder";
import { PLAY_TYPE_LABELS } from "@/lib/types";
import type { PadelRacket } from "@/lib/types";

type Stage = "intro" | "position" | "weight" | "budget";

const WEIGHT_OPTIONS: { value: FinderWeight; label: string; description: string }[] = [
  { value: "leicht", label: "Leicht", description: "Bis ca. 355 g, handlich und armschonend" },
  { value: "mittel", label: "Mittel", description: "Ca. 360-370 g, guter Mix aus Stabilität und Tempo" },
  { value: "egal", label: "Egal", description: "Ich habe keine Präferenz" },
];

const BUDGET_OPTIONS: { value: FinderBudget; label: string; description: string }[] = [
  { value: "100", label: "Bis 100 €", description: "Solide Qualität zum Einstiegspreis" },
  { value: "200", label: "Bis 200 €", description: "Gehobene Mittelklasse mit Top-Material" },
  { value: "offen", label: "Offen", description: "Zeig mir die beste Empfehlung, egal was sie kostet" },
];

const STAGES: Stage[] = ["position", "weight", "budget"];

export function FinderWizard() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("intro");
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [weight, setWeight] = useState<FinderWeight | null>(null);
  const [products, setProducts] = useState<PadelRacket[]>([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => {});
  }, []);

  const { style, level } = positionToAnswers(pos.x, pos.y);

  // Was die Wand gerade "weiss": waechst mit jedem Schritt
  const partial: Partial<FinderAnswers> = useMemo(() => {
    if (stage === "intro") return {};
    if (stage === "position" || stage === "weight") return { style, level };
    return { style, level, ...(weight ? { weight } : {}) };
  }, [stage, style, level, weight]);

  const total = products.length ? countPool(products, {}) : 0;
  const remaining = products.length ? countPool(products, partial) : 0;
  const stepIndex = STAGES.indexOf(stage as (typeof STAGES)[number]);

  const finish = (budget: FinderBudget) => {
    const params = new URLSearchParams({ level, style, weight: weight ?? "egal", budget });
    router.push(`/empfehlung?${params.toString()}`);
  };

  return (
    <div className="grid md:grid-cols-[2fr_3fr] md:h-[calc(100vh-110px)]">
      {/* ---------- Interaktion links ---------- */}
      <div className="flex flex-col px-5 md:px-10 lg:px-14 py-8 md:py-10 order-2 md:order-1 md:overflow-y-auto">
        {stage === "intro" ? (
          <div className="my-auto animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pp-blue mb-4">
              Schlägerberater
            </p>
            <h1 className="font-statement text-5xl md:text-6xl text-pp-dark uppercase leading-[1.05] mb-6">
              {total > 0 ? total : "Alle"} Schläger.<br />
              <span className="text-pp-blue">Einer passt.</span>
            </h1>
            <p className="text-base md:text-lg text-pp-gray-500 mb-10 max-w-md">
              Zeig uns dein Spiel. Die Wand erledigt den Rest.
            </p>
            <button
              onClick={() => setStage("position")}
              className="px-10 py-4 bg-pp-blue text-white text-base font-bold hover:bg-pp-blue-light transition-colors"
            >
              Los geht&apos;s
            </button>
            <div className="mt-6">
              <Link href="/katalog" className="text-sm text-pp-gray-400 hover:text-pp-charcoal underline underline-offset-4 transition-colors">
                Ich weiß schon, was ich suche - zum Katalog
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Fortschritt */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => {
                  const prev = stepIndex <= 0 ? "intro" : STAGES[stepIndex - 1];
                  if (prev === "position" || prev === "intro") setWeight(null);
                  setStage(prev);
                }}
                className="text-sm text-pp-gray-400 hover:text-pp-charcoal transition-colors shrink-0"
              >
                ← Zurück
              </button>
              <div className="flex-1 h-1 bg-pp-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pp-blue rounded-full transition-all duration-300"
                  style={{ width: `${((stepIndex + 1) / STAGES.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-pp-gray-400 shrink-0 tabular-nums">
                {stepIndex + 1} / {STAGES.length}
              </span>
            </div>

            {stage === "position" && (
              <div key="position" className="animate-fade-up">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pp-blue mb-3">
                  Dein Spiel
                </p>
                <h2 className="font-statement text-4xl md:text-5xl text-pp-dark uppercase leading-[1.05] mb-6">
                  Wo stehst du?
                </h2>

                <MatrixInput x={pos.x} y={pos.y} onChange={(x, y) => setPos({ x, y })} />

                <p className="font-statement text-lg md:text-xl text-pp-charcoal uppercase mt-5 mb-6 text-center">
                  {PLAY_TYPE_LABELS[style]} <span className="text-pp-gray-300">×</span> {FINDER_LEVEL_LABELS[level]}
                </p>

                <button
                  onClick={() => setStage("weight")}
                  className="w-full px-8 py-3.5 bg-pp-blue text-white text-sm font-bold hover:bg-pp-blue-light transition-colors"
                >
                  Das bin ich →
                </button>
              </div>
            )}

            {stage === "weight" && (
              <div key="weight" className="animate-fade-up my-auto">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pp-blue mb-3">
                  Das Gewicht
                </p>
                <h2 className="font-statement text-4xl md:text-5xl text-pp-dark uppercase leading-[1.05] mb-8">
                  Wie liegt er am besten?
                </h2>
                <div className="grid gap-3">
                  {WEIGHT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setWeight(option.value);
                        setStage("budget");
                      }}
                      className="group flex items-center gap-4 text-left px-5 py-4 border-2 border-pp-gray-200 bg-white transition-all hover:border-pp-blue hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <span className="flex-1">
                        <span className="block text-base md:text-lg font-bold text-pp-charcoal">{option.label}</span>
                        <span className="block text-sm text-pp-gray-500 leading-snug">{option.description}</span>
                      </span>
                      <span className="shrink-0 text-pp-gray-300 group-hover:text-pp-blue group-hover:translate-x-1 transition-all">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {stage === "budget" && (
              <div key="budget" className="animate-fade-up my-auto">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pp-blue mb-3">
                  Dein Budget
                </p>
                <h2 className="font-statement text-4xl md:text-5xl text-pp-dark uppercase leading-[1.05] mb-8">
                  Was ist er dir wert?
                </h2>
                <div className="grid gap-3">
                  {BUDGET_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => finish(option.value)}
                      className="group flex items-center gap-4 text-left px-5 py-4 border-2 border-pp-gray-200 bg-white transition-all hover:border-pp-blue hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <span className="flex-1">
                        <span className="block text-base md:text-lg font-bold text-pp-charcoal">{option.label}</span>
                        <span className="block text-sm text-pp-gray-500 leading-snug">{option.description}</span>
                      </span>
                      <span className="shrink-0 text-pp-gray-300 group-hover:text-pp-blue group-hover:translate-x-1 transition-all">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ---------- Die Schlaegerwand: mobil sticky Band oben, ab md volle Buehne rechts ---------- */}
      <div
        className={`relative overflow-hidden order-1 md:order-2 bg-pp-gray-50 px-2 pt-2 md:h-auto md:static ${
          stage === "intro" ? "h-72" : "h-44 sticky top-0 z-30 shadow-md md:shadow-none"
        }`}
      >
        <RacketWall products={products} partial={partial} />

        {/* Zaehler-Overlay */}
        {stage !== "intro" && products.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 pt-10 md:pt-16 pb-3 md:pb-4 px-4 md:px-6 bg-gradient-to-t from-white via-white/85 to-transparent flex items-end gap-2 md:gap-3 pointer-events-none">
            <span className="font-statement text-4xl md:text-6xl text-pp-blue leading-none tabular-nums">
              {remaining}
            </span>
            <span className="text-xs md:text-sm text-pp-gray-500 pb-1">
              von {total} Schlägern passen noch zu dir
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
