import type { PadelRacket, PlayType, PlayerLevel } from "./types";

export type FinderLevel = "einsteiger" | "fortgeschritten" | "turnier";
export type FinderWeight = "leicht" | "mittel" | "egal";
export type FinderBudget = "100" | "200" | "offen";

export interface FinderAnswers {
  level: FinderLevel;
  style: PlayType;
  weight: FinderWeight;
  budget: FinderBudget;
}

export interface Recommendation {
  racket: PadelRacket;
  score: number;
  reasons: string[];
  overBudget: boolean;
}

export const FINDER_LEVEL_LABELS: Record<FinderLevel, string> = {
  einsteiger: "Einsteiger",
  fortgeschritten: "Fortgeschritten",
  turnier: "Turnier",
};

export const FINDER_WEIGHT_LABELS: Record<FinderWeight, string> = {
  leicht: "Leicht",
  mittel: "Mittel",
  egal: "Egal",
};

export const FINDER_BUDGET_LABELS: Record<FinderBudget, string> = {
  "100": "Bis 100 €",
  "200": "Bis 200 €",
  offen: "Offen",
};

/** Level-Antwort → Punkte pro Produkt-Level */
const LEVEL_SCORES: Record<FinderLevel, Record<PlayerLevel, number>> = {
  einsteiger: { recreational: 3, intermediate: 2, advanced: 0, tournament: -2 },
  fortgeschritten: { intermediate: 3, advanced: 2.5, recreational: 0.5, tournament: 0.5 },
  turnier: { tournament: 3, advanced: 2, intermediate: 0, recreational: -2 },
};

/** Spielstil-Antwort → Punkte pro Produkt-Spieltyp (Allround grenzt an beide) */
const STYLE_SCORES: Record<PlayType, Record<PlayType, number>> = {
  control: { control: 3, allround: 1, power: -1 },
  allround: { allround: 3, control: 1, power: 1 },
  power: { power: 3, allround: 1, control: -1 },
};

function weightScore(pref: FinderWeight, grams: number): number {
  if (pref === "egal") return 0;
  if (!grams) return 0; // Gewicht nicht gepflegt → neutral
  if (pref === "leicht") {
    if (grams <= 355) return 2;
    if (grams <= 365) return 1;
    return -0.5;
  }
  // mittel
  if (grams >= 358 && grams <= 372) return 2;
  return 0.5;
}

function budgetLimit(budget: FinderBudget): number | null {
  if (budget === "100") return 100;
  if (budget === "200") return 200;
  return null;
}

/** Test- und Junior-Schlaeger gehoeren nicht in eine Kauf-Empfehlung */
function isRecommendable(r: PadelRacket): boolean {
  const t = r.title.toLowerCase();
  if (t.includes("testschläger") || t.includes("test racket")) return false;
  if (/\b(junior|jr\.?|kids)\b/.test(t)) return false;
  if (!r.imageUrl) return false;
  return true;
}

function buildReasons(r: PadelRacket, answers: FinderAnswers): string[] {
  const reasons: string[] = [];
  if (LEVEL_SCORES[answers.level][r.playerLevel] >= 2) {
    reasons.push(`Passt zu ${FINDER_LEVEL_LABELS[answers.level]}`);
  }
  if (r.playType === answers.style) {
    reasons.push(
      answers.style === "control" ? "Kontrolle" : answers.style === "power" ? "Power" : "Allround"
    );
  }
  if (answers.weight !== "egal" && r.weight && weightScore(answers.weight, r.weight) >= 2) {
    reasons.push(`${r.weight} g`);
  }
  const limit = budgetLimit(answers.budget);
  if (limit && r.price <= limit) {
    reasons.push("Im Budget");
  }
  return reasons.slice(0, 3);
}

/**
 * Kern des Beraters: bewertet alle Schlaeger gegen die Antworten
 * und liefert die Top 5. Budget ist hart, alles andere weich.
 * Finden sich im Budget weniger als 3 Kandidaten, fuellen die
 * naechstguenstigen darueber auf (markiert mit overBudget).
 */
export function recommend(products: PadelRacket[], answers: FinderAnswers, count = 5): Recommendation[] {
  const limit = budgetLimit(answers.budget);
  const pool = products.filter(isRecommendable);

  // Bei Punktgleichheit soll der Preis Richtung Budget zaehlen duerfen:
  // gleicher Fit + hochwertigeres Material = bessere Empfehlung.
  const priceAnchor = limit ?? 250;

  const scored = pool.map((racket) => ({
    racket,
    score:
      LEVEL_SCORES[answers.level][racket.playerLevel] +
      STYLE_SCORES[answers.style][racket.playType] +
      weightScore(answers.weight, racket.weight) +
      Math.min(racket.price / priceAnchor, 1) * 0.8,
    reasons: buildReasons(racket, answers),
    overBudget: limit !== null && racket.price > limit,
  }));

  // Pro Modellname nur die beste Variante behalten (Shop fuehrt teils Farbvarianten als eigene Produkte)
  const byTitle = new Map<string, Recommendation>();
  for (const s of scored.sort((a, b) => b.score - a.score || a.racket.price - b.racket.price)) {
    const key = `${s.racket.brand} ${s.racket.title}`.toLowerCase();
    if (!byTitle.has(key)) byTitle.set(key, s);
  }
  const unique = Array.from(byTitle.values());

  const inBudget = unique.filter((s) => !s.overBudget);
  const result = inBudget.slice(0, count);

  if (result.length < 3) {
    const overflow = unique
      .filter((s) => s.overBudget)
      .sort((a, b) => b.score - a.score || a.racket.price - b.racket.price);
    result.push(...overflow.slice(0, count - result.length));
  }

  return result;
}

/**
 * Wie viele Schlaeger nach den bisherigen Antworten noch in Frage kommen.
 * Fuer die Live-Verdichtung im Wizard ("348 → 74 → 18 → 5").
 */
export function countPool(products: PadelRacket[], partial: Partial<FinderAnswers>): number {
  return products.filter((r) => {
    if (!isRecommendable(r)) return false;
    if (partial.level && LEVEL_SCORES[partial.level][r.playerLevel] < 2) return false;
    if (partial.style && STYLE_SCORES[partial.style][r.playType] < 3) return false;
    if (partial.weight && partial.weight !== "egal" && r.weight > 0 && weightScore(partial.weight, r.weight) < 1) return false;
    const limit = partial.budget ? budgetLimit(partial.budget) : null;
    if (limit && r.price > limit) return false;
    return true;
  }).length;
}

/**
 * Spielerprofil-Archetyp aus Spielstil x Level.
 * Ohne Artikel, damit es in Versalien als Statement funktioniert
 * und fuer alle Geschlechter traegt.
 */
export function archetype(answers: FinderAnswers): string {
  const base: Record<PlayType, string> = {
    control: "Stratege",
    allround: "Alleskönner",
    power: "Angreifer",
  };
  const suffix: Record<FinderLevel, string> = {
    einsteiger: "auf dem Sprung",
    fortgeschritten: "mit System",
    turnier: "mit Matchhunger",
  };
  return `${base[answers.style]} ${suffix[answers.level]}`;
}

/** Position des Nutzerprofils in der Ergebnis-Matrix (0-100) */
export function profilePosition(answers: FinderAnswers): { x: number; y: number } {
  const x: Record<PlayType, number> = { control: 20, allround: 50, power: 80 };
  const y: Record<FinderLevel, number> = { turnier: 15, fortgeschritten: 45, einsteiger: 78 };
  return { x: x[answers.style], y: y[answers.level] };
}

/** Antworten aus URL-Parametern lesen (null wenn unvollstaendig) */
export function parseAnswers(params: URLSearchParams): FinderAnswers | null {
  const level = params.get("level") as FinderLevel | null;
  const style = params.get("style") as PlayType | null;
  const weight = params.get("weight") as FinderWeight | null;
  const budget = params.get("budget") as FinderBudget | null;

  if (!level || !["einsteiger", "fortgeschritten", "turnier"].includes(level)) return null;
  if (!style || !["control", "allround", "power"].includes(style)) return null;
  if (!weight || !["leicht", "mittel", "egal"].includes(weight)) return null;
  if (!budget || !["100", "200", "offen"].includes(budget)) return null;

  return { level, style, weight, budget };
}
