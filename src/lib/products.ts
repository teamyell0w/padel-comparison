import type {
  PadelRacket,
  HeadShape,
  Balance,
  MaterialHardness,
  PlayType,
  PlayerLevel,
} from "./types";
import { shopifyFetch, isShopifyConfigured } from "./shopify";
import { GET_COLLECTION_PRODUCTS } from "./queries";
import { testProducts } from "@/data/products";

// --- Shopify Response Types ---

interface ShopifyMetafield {
  value: string;
}

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  productType: string;
  tags: string[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: { node: { url: string; altText: string | null } }[];
  };
  // Metafields — aktuell nicht gepflegt, aber vorbereitet
  weight: ShopifyMetafield | null;
  headShape: ShopifyMetafield | null;
  balanceRaw: ShopifyMetafield | null;
  balance: ShopifyMetafield | null;
  surfaceMaterial: ShopifyMetafield | null;
  surfaceHardness: ShopifyMetafield | null;
  coreMaterial: ShopifyMetafield | null;
  coreHardness: ShopifyMetafield | null;
  playType: ShopifyMetafield | null;
  playerLevel: ShopifyMetafield | null;
}

interface CollectionResponse {
  collection: {
    products: {
      edges: { node: ShopifyProduct }[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  };
}

// --- Tag-basiertes Mapping (echte padel-point.de Tags) ---

/**
 * Leitet PlayerLevel aus den Shopify-Tags ab.
 *
 * Echte Tags im Shop:
 *   campaigns_beginner_rackets    → recreational
 *   campaigns_intermediate_rackets → intermediate
 *   campaigns_pro_rackets          → advanced
 *   campaigns_top_rackets          → tournament
 *
 * Ein Schlaeger kann mehrere Tags haben — wir nehmen das hoechste Level.
 */
function parsePlayerLevelFromTags(tags: string[], price: number): PlayerLevel {
  if (tags.includes("campaigns_top_rackets")) return "tournament";
  if (tags.includes("campaigns_pro_rackets")) return "advanced";
  if (tags.includes("campaigns_intermediate_rackets")) return "intermediate";
  if (tags.includes("campaigns_beginner_rackets")) return "recreational";

  // Fallback: Preis-Heuristik
  if (price >= 280) return "tournament";
  if (price >= 180) return "advanced";
  if (price >= 100) return "intermediate";
  return "recreational";
}

/**
 * Versucht PlayType aus Titel-Keywords abzuleiten.
 * Shopify hat kein Metafield dafuer, aber viele Schlaeger-
 * Serien haben den Typ im Namen.
 */
function parsePlayTypeFromTitle(title: string, vendor: string): PlayType {
  const t = title.toLowerCase();
  const v = vendor.toLowerCase();

  // HEAD Serien
  if (v === "head") {
    if (t.includes("extreme") || t.includes("delta")) return "power";
    if (t.includes("gravity") || t.includes("radical")) return "control";
    if (t.includes("speed") || t.includes("flash") || t.includes("evo")) return "allround";
  }

  // Bullpadel Serien
  if (v === "bullpadel") {
    if (t.includes("vertex") || t.includes("hack")) return "power";
    if (t.includes("flow") || t.includes("paquito")) return "control";
  }

  // adidas Serien
  if (v === "adidas") {
    if (t.includes("metalbone") || t.includes("adipower")) return "power";
    if (t.includes("lightpadel") || t.includes("light")) return "control";
    if (t.includes("cross")) return "allround";
  }

  // Babolat Serien
  if (v === "babolat") {
    if (t.includes("viper") || t.includes("technical")) return "power";
    if (t.includes("counter") || t.includes("reflex")) return "control";
    if (t.includes("air")) return "allround";
  }

  // Wilson Serien
  if (v === "wilson") {
    if (t.includes("bela")) return "power";
    if (t.includes("carbon force")) return "control";
  }

  // Generische Keywords
  if (t.includes("power") || t.includes("attack") || t.includes("smash")) return "power";
  if (t.includes("control") || t.includes("soft") || t.includes("touch")) return "control";

  return "allround";
}

// --- Weitere Mapping-Helpers ---

/**
 * Extrahiert den lesbaren Wert aus einem Shopify-Metafield.
 * Die PIM schreibt Werte oft als JSON-Array mit Suffix-IDs:
 *   '["Fortgeschritten_33129"]' → "Fortgeschritten"
 *   '["Power_33130"]'           → "Power"
 *   '["EVA Control"]'           → "EVA Control"
 *   '"272"'                     → "272"
 */
function extractMetafieldValue(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Entferne PIM-Suffix wie "_33129"
      return String(parsed[0]).replace(/_\d+$/, "");
    }
    return String(parsed);
  } catch {
    // Kein JSON — Rohwert zurueckgeben, Suffix entfernen
    return raw.replace(/_\d+$/, "");
  }
}

function extractId(gid: string): string {
  return gid.split("/").pop() || gid;
}

function parseHeadShape(value: string | null | undefined): HeadShape {
  const v = extractMetafieldValue(value)?.toLowerCase();
  if (!v) return "round";
  if (v.includes("diamond") || v.includes("diamant")) return "diamond";
  if (v.includes("teardrop") || v.includes("tropfen") || v.includes("träne")) return "teardrop";
  if (v.includes("hybrid")) return "hybrid";
  if (v.includes("geometric") || v.includes("geometr")) return "geometric";
  return "round";
}

/**
 * Parst Balance aus Metafield.
 * Kann als Label ("Kopflastig") oder als mm-Wert ("272") kommen.
 * Balance in mm: < 260 → grip-heavy, 260-275 → balanced, > 275 → head-heavy
 */
function parseBalance(value: string | null | undefined): Balance {
  const v = extractMetafieldValue(value);
  if (!v) return "balanced";

  // Numerisch? → mm-basiertes Mapping
  const mm = parseInt(v, 10);
  if (!isNaN(mm) && mm > 0) {
    if (mm > 275) return "head-heavy";
    if (mm < 260) return "grip-heavy";
    return "balanced";
  }

  const lower = v.toLowerCase();
  if (lower.includes("head") || lower.includes("kopf")) return "head-heavy";
  if (lower.includes("grip") || lower.includes("griff")) return "grip-heavy";
  return "balanced";
}

function parseHardness(value: string | null | undefined): MaterialHardness {
  const v = extractMetafieldValue(value)?.toLowerCase();
  if (!v) return "medium";
  if (v.includes("hard") || v.includes("hart")) return "hard";
  if (v.includes("soft") || v.includes("weich")) return "soft";
  return "medium";
}

/**
 * Parst PlayType aus dem PIM-Metafield.
 * Werte: "Power", "Kontrolle"/"Control", "Allround", "Defensiv"/"Defensive"
 */
function parsePlayType(value: string | null | undefined): PlayType | null {
  const v = extractMetafieldValue(value)?.toLowerCase();
  if (!v) return null;
  if (v.includes("power") || v.includes("angriff") || v.includes("attack")) return "power";
  if (v.includes("control") || v.includes("kontroll")) return "control";
  if (v.includes("allround") || v.includes("vielseitig")) return "allround";
  if (v.includes("defen")) return "control"; // Defensiv → control-nahe
  return null;
}

/**
 * Parst PlayerLevel aus dem PIM-Metafield.
 * Werte: "Einsteiger", "Fortgeschritten", "Turnier", "Profi"
 */
function parsePlayerLevel(value: string | null | undefined): PlayerLevel | null {
  const v = extractMetafieldValue(value)?.toLowerCase();
  if (!v) return null;
  if (v.includes("turnier") || v.includes("tournament")) return "tournament";
  if (v.includes("profi") || v.includes("pro")) return "advanced";
  if (v.includes("fortgeschritten") || v.includes("intermediate") || v.includes("advanced")) return "intermediate";
  if (v.includes("einsteiger") || v.includes("beginner") || v.includes("anfänger")) return "recreational";
  return null;
}

/**
 * Berechnet Matrix-Position aus PlayType und PlayerLevel.
 * Verwendet den Handle als Seed fuer deterministische Streuung,
 * damit Positionen bei jedem Laden stabil bleiben.
 */
function computeMatrixPosition(
  playType: PlayType,
  playerLevel: PlayerLevel,
  handle: string
): { matrixX: number; matrixY: number } {
  const xBase: Record<PlayType, number> = {
    control: 20,
    allround: 50,
    power: 80,
  };
  const yBase: Record<PlayerLevel, number> = {
    tournament: 10,
    advanced: 30,
    intermediate: 55,
    recreational: 85,
  };

  // Deterministische Streuung basierend auf Handle-Hash
  let hash = 0;
  for (let i = 0; i < handle.length; i++) {
    hash = ((hash << 5) - hash + handle.charCodeAt(i)) | 0;
  }
  const jitterX = ((hash & 0xff) / 255 - 0.5) * 16;
  const jitterY = (((hash >> 8) & 0xff) / 255 - 0.5) * 16;

  return {
    matrixX: Math.max(5, Math.min(95, Math.round(xBase[playType] + jitterX))),
    matrixY: Math.max(5, Math.min(95, Math.round(yBase[playerLevel] + jitterY))),
  };
}

/**
 * Bereinigt den Produkttitel.
 * Entfernt "Padelschläger" Suffix und Vendor-Prefix falls vorhanden.
 */
function cleanTitle(title: string, vendor: string): string {
  let t = title
    .replace(/\s*Padelschläger\s*/gi, " ")
    .replace(/\s*Padel\s*Racket\s*/gi, " ")
    .trim();

  // Vendor am Anfang entfernen falls doppelt
  if (t.toLowerCase().startsWith(vendor.toLowerCase())) {
    t = t.slice(vendor.length).trim();
  }

  return t || title;
}

// --- Main Mapping ---

function mapShopifyProduct(node: ShopifyProduct): PadelRacket {
  const price = parseFloat(node.priceRange.minVariantPrice.amount);

  const playType = parsePlayType(node.playType?.value)
    ?? parsePlayTypeFromTitle(node.title, node.vendor);
  const playerLevel = parsePlayerLevel(node.playerLevel?.value)
    ?? parsePlayerLevelFromTags(node.tags, price);
  const { matrixX, matrixY } = computeMatrixPosition(playType, playerLevel, node.handle);

  const weightVal = extractMetafieldValue(node.weight?.value);
  const balanceRaw = extractMetafieldValue(node.balance?.value);

  return {
    id: extractId(node.id),
    handle: node.handle,
    title: cleanTitle(node.title, node.vendor),
    brand: node.vendor,
    price,
    currency: node.priceRange.minVariantPrice.currencyCode,
    imageUrl: node.images.edges[0]?.node.url || "",
    weight: weightVal ? parseInt(weightVal, 10) : 0,
    headShape: parseHeadShape(node.headShape?.value),
    balanceRaw: balanceRaw ? parseInt(balanceRaw, 10) : 0,
    balance: parseBalance(node.balance?.value),
    surfaceMaterial: extractMetafieldValue(node.surfaceMaterial?.value) || "–",
    surfaceHardness: parseHardness(node.surfaceHardness?.value),
    coreMaterial: extractMetafieldValue(node.coreMaterial?.value) || "–",
    coreHardness: parseHardness(node.coreHardness?.value),
    playType,
    playerLevel,
    matrixX,
    matrixY,
  };
}

// --- Cache ---

const CACHE_KEY = "pp_rackets_cache";
const CACHE_TTL = 30 * 60 * 1000; // 30 Minuten

interface CacheEntry {
  data: PadelRacket[];
  timestamp: number;
}

function getCached(): PadelRacket[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    console.log(`[products] Cache hit (${Math.round((Date.now() - entry.timestamp) / 1000)}s alt)`);
    return entry.data;
  } catch {
    return null;
  }
}

function setCache(data: PadelRacket[]): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage voll oder blockiert — ignorieren
  }
}

// --- Fetch ---

async function fetchFromShopify(): Promise<PadelRacket[]> {
  const allProducts: PadelRacket[] = [];
  let after: string | null = null;

  do {
    const variables: Record<string, unknown> = {
      handle: "padelschlaeger",
      first: 250,
    };
    if (after) variables.after = after;

    const data = await shopifyFetch<CollectionResponse>(
      GET_COLLECTION_PRODUCTS,
      variables
    );

    const edges = data.collection.products.edges;
    allProducts.push(...edges.map((e) => mapShopifyProduct(e.node)));

    after = data.collection.products.pageInfo.hasNextPage
      ? data.collection.products.pageInfo.endCursor
      : null;
  } while (after);

  return allProducts;
}

export async function getProducts(): Promise<PadelRacket[]> {
  if (!isShopifyConfigured()) {
    console.log("[products] No Shopify token configured, using test data");
    return testProducts;
  }

  // Cache pruefen
  const cached = getCached();
  if (cached) return cached;

  try {
    const products = await fetchFromShopify();
    setCache(products);
    console.log(`[products] Loaded ${products.length} rackets from Shopify (cached for 30min)`);
    return products;
  } catch (error) {
    console.error("[products] Shopify fetch failed, using test data:", error);
    return testProducts;
  }
}
