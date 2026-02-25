export type HeadShape = "diamond" | "teardrop" | "round" | "hybrid" | "geometric";
export type Balance = "head-heavy" | "grip-heavy" | "balanced";
export type MaterialHardness = "hard" | "medium" | "soft";
export type PlayType = "allround" | "control" | "power";
export type PlayerLevel = "tournament" | "advanced" | "intermediate" | "recreational";

export interface PadelRacket {
  id: string;
  handle: string;
  title: string;
  brand: string;
  price: number;
  currency: string;
  imageUrl: string;
  weight: number; // in grams
  headShape: HeadShape;
  balanceRaw: number; // in mm
  balance: Balance;
  surfaceMaterial: string;
  surfaceHardness: MaterialHardness;
  coreMaterial: string;
  coreHardness: MaterialHardness;
  playType: PlayType;
  playerLevel: PlayerLevel;
  // Matrix positioning (0-100 scale)
  matrixX: number; // 0 = Control, 100 = Power
  matrixY: number; // 0 = Tournament, 100 = Recreational
}

export const HEAD_SHAPE_LABELS: Record<HeadShape, string> = {
  diamond: "Diamant",
  teardrop: "Träne",
  round: "Rund",
  hybrid: "Hybrid",
  geometric: "Geometrisch",
};

export const BALANCE_LABELS: Record<Balance, string> = {
  "head-heavy": "Kopflastig",
  "grip-heavy": "Grifflastig",
  balanced: "Ausgewogen",
};

export const HARDNESS_LABELS: Record<MaterialHardness, string> = {
  hard: "Hart",
  medium: "Mittel",
  soft: "Weich",
};

export const PLAY_TYPE_LABELS: Record<PlayType, string> = {
  allround: "Allround",
  control: "Kontrolle",
  power: "Power",
};

export const PLAYER_LEVEL_LABELS: Record<PlayerLevel, string> = {
  tournament: "Tournament",
  advanced: "Advanced",
  intermediate: "Intermediate",
  recreational: "Recreational",
};
