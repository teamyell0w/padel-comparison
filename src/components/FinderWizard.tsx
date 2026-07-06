"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayTypeIcon } from "./icons/PlayTypeIcon";
import { WeightIcon } from "./icons/WeightIcon";
import { getProducts } from "@/lib/products";
import { countPool } from "@/lib/finder";
import type { FinderAnswers } from "@/lib/finder";
import type { PadelRacket } from "@/lib/types";

interface Option {
  value: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

interface Question {
  key: keyof FinderAnswers;
  kicker: string;
  headline: string;
  motiv: string;
  options: Option[];
}

function LevelIcon({ bars, size = 28 }: { bars: 1 | 2 | 3; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={4 + i * 6}
          y={18 - (i + 1) * 4.5}
          width="4"
          height={(i + 1) * 4.5 + 2}
          rx="1"
          fill="currentColor"
          opacity={i < bars ? 0.8 : 0.15}
        />
      ))}
    </svg>
  );
}

const QUESTIONS: Question[] = [
  {
    key: "level",
    kicker: "Dein Spielniveau",
    headline: "Wie viel Padel steckt in dir?",
    motiv: "/motive/level.jpg",
    options: [
      { value: "einsteiger", label: "Einsteiger", description: "Ich fange gerade an oder spiele gelegentlich", icon: <LevelIcon bars={1} /> },
      { value: "fortgeschritten", label: "Fortgeschritten", description: "Ich spiele regelmäßig und beherrsche die Grundschläge", icon: <LevelIcon bars={2} /> },
      { value: "turnier", label: "Turnier", description: "Ich spiele ambitioniert, in Ligen oder Turnieren", icon: <LevelIcon bars={3} /> },
    ],
  },
  {
    key: "style",
    kicker: "Dein Spielstil",
    headline: "Was ist dein Spiel?",
    motiv: "/motive/stil.jpg",
    options: [
      { value: "control", label: "Kontrolle", description: "Präzise Bälle, sichere Platzierung, wenig Fehler", icon: <PlayTypeIcon type="control" /> },
      { value: "allround", label: "Allround", description: "Von allem etwas, flexibel in jeder Situation", icon: <PlayTypeIcon type="allround" /> },
      { value: "power", label: "Power", description: "Druck machen, Smashes, den Punkt erzwingen", icon: <PlayTypeIcon type="power" /> },
    ],
  },
  {
    key: "weight",
    kicker: "Das Gewicht",
    headline: "Wie liegt er am besten?",
    motiv: "/motive/gewicht.jpg",
    options: [
      { value: "leicht", label: "Leicht", description: "Bis ca. 355 g, handlich und armschonend", icon: <WeightIcon /> },
      { value: "mittel", label: "Mittel", description: "Ca. 360-370 g, guter Mix aus Stabilität und Tempo", icon: <WeightIcon /> },
      { value: "egal", label: "Egal", description: "Ich habe keine Präferenz", icon: <WeightIcon /> },
    ],
  },
  {
    key: "budget",
    kicker: "Dein Budget",
    headline: "Was ist er dir wert?",
    motiv: "/motive/budget.jpg",
    options: [
      { value: "100", label: "Bis 100 €", description: "Solide Qualität zum Einstiegspreis" },
      { value: "200", label: "Bis 200 €", description: "Gehobene Mittelklasse mit Top-Material" },
      { value: "offen", label: "Offen", description: "Zeig mir die beste Empfehlung, egal was sie kostet" },
    ],
  },
];

/** Zahl weich zum Zielwert animieren (Live-Verdichtung) */
function useAnimatedNumber(target: number): number {
  const [value, setValue] = useState(target);
  const raf = useRef<number>(0);

  useEffect(() => {
    const from = value;
    const diff = target - from;
    if (diff === 0) return;
    const start = performance.now();
    const DURATION = 550;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + diff * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

export function FinderWizard() {
  const router = useRouter();
  const [step, setStep] = useState(-1); // -1 = Intro
  const [answers, setAnswers] = useState<Partial<FinderAnswers>>({});
  const [products, setProducts] = useState<PadelRacket[]>([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => {});
  }, []);

  const total = products.length ? countPool(products, {}) : 0;
  const poolCount = products.length ? countPool(products, answers) : 0;
  const animatedPool = useAnimatedNumber(products.length ? poolCount : 0);

  const question = step >= 0 ? QUESTIONS[step] : null;
  const motiv = question ? question.motiv : "/motive/intro.jpg";

  const handleSelect = (value: string) => {
    const next = { ...answers, [QUESTIONS[step].key]: value };
    setAnswers(next);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const params = new URLSearchParams(next as Record<string, string>);
      router.push(`/empfehlung?${params.toString()}`);
    }
  };

  const goBack = () => {
    // Antwort des vorigen Schritts verwerfen, damit der Zaehler wieder hochgeht
    const prevKey = step > 0 ? QUESTIONS[step - 1].key : null;
    if (prevKey) {
      const next = { ...answers };
      delete next[prevKey];
      setAnswers(next);
    }
    setStep(step - 1);
  };

  return (
    <div className="grid md:grid-cols-[11fr_9fr] md:min-h-[calc(100vh-110px)]">
      {/* ---------- Content links ---------- */}
      <div className="flex flex-col px-5 md:px-12 lg:px-16 py-8 md:py-12 order-2 md:order-1">
        {question ? (
          <>
            {/* Fortschritt */}
            <div className="flex items-center gap-3 mb-10 md:mb-14">
              <button
                onClick={goBack}
                className="text-sm text-pp-gray-400 hover:text-pp-charcoal transition-colors shrink-0"
              >
                ← Zurück
              </button>
              <div className="flex-1 h-1 bg-pp-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pp-blue rounded-full transition-all duration-300"
                  style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-pp-gray-400 shrink-0 tabular-nums">
                {step + 1} / {QUESTIONS.length}
              </span>
            </div>

            <div key={step} className="animate-fade-up">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pp-blue mb-3">
                {question.kicker}
              </p>
              <h2
                className="font-statement text-4xl md:text-5xl lg:text-6xl text-pp-dark uppercase leading-[1.05] mb-10"
               
              >
                {question.headline}
              </h2>

              <div className="grid gap-3">
                {QUESTIONS[step].options.map((option) => {
                  const selected = answers[question.key] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={`group flex items-center gap-4 text-left px-5 py-4 border-2 transition-all hover:border-pp-blue hover:-translate-y-0.5 hover:shadow-md ${
                        selected ? "border-pp-blue bg-pp-blue/5" : "border-pp-gray-200 bg-white"
                      }`}
                    >
                      {option.icon && (
                        <span className={`shrink-0 ${selected ? "text-pp-blue" : "text-pp-gray-400 group-hover:text-pp-blue"} transition-colors`}>
                          {option.icon}
                        </span>
                      )}
                      <span className="flex-1">
                        <span className="block text-base md:text-lg font-bold text-pp-charcoal">
                          {option.label}
                        </span>
                        <span className="block text-sm text-pp-gray-500 leading-snug">
                          {option.description}
                        </span>
                      </span>
                      <span className="shrink-0 text-pp-gray-300 group-hover:text-pp-blue group-hover:translate-x-1 transition-all">→</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live-Verdichtung */}
            <div className="mt-auto pt-10">
              <p className="text-sm text-pp-gray-500">
                {products.length > 0 && (
                  <>
                    Noch{" "}
                    <span className="inline-block min-w-[2.2em] text-center font-bold text-pp-blue text-lg tabular-nums">
                      {animatedPool}
                    </span>{" "}
                    von {total} Schlägern im Rennen.
                  </>
                )}
              </p>
            </div>
          </>
        ) : (
          /* ---------- Intro ---------- */
          <div className="my-auto max-w-xl animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pp-blue mb-4">
              Schlägerberater
            </p>
            <h1
              className="font-statement text-5xl md:text-6xl lg:text-7xl text-pp-dark uppercase leading-[1.05] mb-6"
             
            >
              Finde deinen Schläger.
            </h1>
            <p className="text-base md:text-lg text-pp-gray-500 mb-10 max-w-md">
              {total > 0 ? `${total} Schläger im Shop. Fünf davon passen zu deinem Spiel.` : "Fünf Schläger passen zu deinem Spiel."}{" "}
              Vier Fragen, dann kennst du sie.
            </p>
            <button
              onClick={() => setStep(0)}
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
        )}
      </div>

      {/* ---------- Motiv rechts ---------- */}
      <div className="relative h-52 md:h-auto overflow-hidden order-1 md:order-2 bg-pp-gray-100">
        <img
          key={motiv}
          src={motiv}
          alt=""
          className="absolute inset-0 w-full h-full object-cover animate-motiv-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>
    </div>
  );
}
