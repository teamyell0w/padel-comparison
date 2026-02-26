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

function extractId(gid: string): string {
  return gid.split("/").pop() || gid;
}

function parseHeadShape(value: string | null | undefined): HeadShape {
  if (!value) return "round";
  const v = value.toLowerCase();
  if (v.includes("diamond") || v.includes("diamant")) return "diamond";
  if (v.includes("teardrop") || v.includes("tropfen") || v.includes("träne")) return "teardrop";
  if (v.includes("hybrid")) return "hybrid";
  if (v.includes("geometric") || v.includes("geometr")) return "geometric";
  return "round";
}

function parseBalance(value: string | null | undefined): Balance {
  if (!value) return "balanced";
  const v = value.toLowerCase();
  if (v.includes("head") || v.includes("kopf")) return "head-heavy";
  if (v.includes("grip") || v.includes("griff")) return "grip-heavy";
  return "balanced";
}

function parseHardness(value: string | null | undefined): MaterialHardness {
  if (!value) return "medium";
  const v = value.toLowerCase();
  if (v.includes("hard") || v.includes("hart")) return "hard";
  if (v.includes("soft") || v.includes("weich")) return "soft";
  return "medium";
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
  const playType = node.playType?.value
    ? (node.playType.value as PlayType)
    : parsePlayTypeFromTitle(node.title, node.vendor);
  const playerLevel = node.playerLevel?.value
    ? (node.playerLevel.value as PlayerLevel)
    : parsePlayerLevelFromTags(node.tags, price);
  const { matrixX, matrixY } = computeMatrixPosition(playType, playerLevel, node.handle);

  return {
    id: extractId(node.id),
    handle: node.handle,
    title: cleanTitle(node.title, node.vendor),
    brand: node.vendor,
    price,
    currency: node.priceRange.minVariantPrice.currencyCode,
    imageUrl: node.images.edges[0]?.node.url || "",
    weight: node.weight ? parseInt(node.weight.value, 10) : 0,
    headShape: parseHeadShape(node.headShape?.value),
    balanceRaw: node.balanceRaw ? parseInt(node.balanceRaw.value, 10) : 0,
    balance: parseBalance(node.balance?.value),
    surfaceMaterial: node.surfaceMaterial?.value || "–",
    surfaceHardness: parseHardness(node.surfaceHardness?.value),
    coreMaterial: node.coreMaterial?.value || "–",
    coreHardness: parseHardness(node.coreHardness?.value),
    playType,
    playerLevel,
    matrixX,
    matrixY,
  };
}

// --- Fetch ---

export async function getProducts(): Promise<PadelRacket[]> {
  if (!isShopifyConfigured()) {
    console.log("[products] No Shopify token configured, using test data");
    return testProducts;
  }

  try {
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

    console.log(`[products] Loaded ${allProducts.length} rackets from Shopify`);
    return allProducts;
  } catch (error) {
    console.error("[products] Shopify fetch failed, using test data:", error);
    return testProducts;
  }
}
