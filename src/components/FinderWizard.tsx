"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayTypeIcon } from "./icons/PlayTypeIcon";
import { WeightIcon } from "./icons/WeightIcon";
import type { FinderAnswers } from "@/lib/finder";

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
    headline: "Wie oft und wie lange spielst du schon Padel?",
    options: [
      { value: "einsteiger", label: "Einsteiger", description: "Ich fange gerade an oder spiele gelegentlich", icon: <LevelIcon bars={1} /> },
      { value: "fortgeschritten", label: "Fortgeschritten", description: "Ich spiele regelmäßig und beherrsche die Grundschläge", icon: <LevelIcon bars={2} /> },
      { value: "turnier", label: "Turnier", description: "Ich spiele ambitioniert, in Ligen oder Turnieren", icon: <LevelIcon bars={3} /> },
    ],
  },
  {
    key: "style",
    kicker: "Dein Spielstil",
    headline: "Was beschreibt dein Spiel am besten?",
    options: [
      { value: "control", label: "Kontrolle", description: "Präzise Bälle, sichere Platzierung, wenig Fehler", icon: <PlayTypeIcon type="control" /> },
      { value: "allround", label: "Allround", description: "Von allem etwas, flexibel in jeder Situation", icon: <PlayTypeIcon type="allround" /> },
      { value: "power", label: "Power", description: "Druck machen, Smashes, den Punkt erzwingen", icon: <PlayTypeIcon type="power" /> },
    ],
  },
  {
    key: "weight",
    kicker: "Das Gewicht",
    headline: "Wie schwer darf dein Schläger sein?",
    options: [
      { value: "leicht", label: "Leicht", description: "Bis ca. 355 g, handlich und armschonend", icon: <WeightIcon /> },
      { value: "mittel", label: "Mittel", description: "Ca. 360-370 g, guter Mix aus Stabilität und Tempo", icon: <WeightIcon /> },
      { value: "egal", label: "Egal", description: "Ich habe keine Präferenz", icon: <WeightIcon /> },
    ],
  },
  {
    key: "budget",
    kicker: "Dein Budget",
    headline: "Wie viel möchtest du ausgeben?",
    options: [
      { value: "100", label: "Bis 100 €", description: "Solide Qualität zum Einstiegspreis" },
      { value: "200", label: "Bis 200 €", description: "Gehobene Mittelklasse mit Top-Material" },
      { value: "offen", label: "Offen", description: "Zeig mir die beste Empfehlung, egal was sie kostet" },
    ],
  },
];

export function FinderWizard() {
  const router = useRouter();
  const [step, setStep] = useState(-1); // -1 = Intro
  const [answers, setAnswers] = useState<Partial<FinderAnswers>>({});

  const question = step >= 0 ? QUESTIONS[step] : null;

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

  /* ---------- Intro ---------- */
  if (!question) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-14 pb-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pp-blue mb-4">
          Schlägerberater
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-pp-charcoal leading-tight mb-5">
          Finde den Schläger,<br />der zu deinem Spiel passt.
        </h1>
        <p className="text-base md:text-lg text-pp-gray-500 mb-10 max-w-md mx-auto">
          Vier kurze Fragen, so wie sie dir auch ein guter Verkäufer stellen würde. Am Ende stehen deine fünf besten Schläger nebeneinander.
        </p>
        <button
          onClick={() => setStep(0)}
          className="px-10 py-4 bg-pp-blue text-white text-base font-semibold hover:bg-pp-blue-light transition-colors"
        >
          Los geht&apos;s
        </button>
        <div className="mt-6">
          <Link href="/katalog" className="text-sm text-pp-gray-400 hover:text-pp-charcoal underline underline-offset-4 transition-colors">
            Ich weiß schon, was ich suche - zum Katalog
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- Frage-Screens ---------- */
  return (
    <div className="max-w-3xl mx-auto px-4 pt-10 pb-20">
      {/* Fortschritt */}
      <div className="flex items-center gap-3 mb-10">
        <button
          onClick={() => setStep(step - 1)}
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

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pp-blue mb-3">
        {question.kicker}
      </p>
      <h2 className="text-2xl md:text-4xl font-bold text-pp-charcoal leading-tight mb-8">
        {question.headline}
      </h2>

      <div className="grid gap-3 md:grid-cols-3">
        {question.options.map((option) => {
          const selected = answers[question.key] === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`group text-left p-5 border-2 transition-all hover:border-pp-blue hover:shadow-md ${
                selected ? "border-pp-blue bg-pp-blue/5" : "border-pp-gray-200 bg-white"
              }`}
            >
              {option.icon && (
                <span className={`block mb-3 ${selected ? "text-pp-blue" : "text-pp-gray-400 group-hover:text-pp-blue"} transition-colors`}>
                  {option.icon}
                </span>
              )}
              <span className="block text-lg font-bold text-pp-charcoal mb-1">
                {option.label}
              </span>
              <span className="block text-sm text-pp-gray-500 leading-snug">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
