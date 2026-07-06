# Session Log — padel-comparison

## 2026-07-06 (spaet) — Signature-Interaktion: Schlaegerwand + Drag-Matrix

**Was:** Nach Christophs zweiter Kritik ("immer noch schwach und uninnovativ, Awwwards-Level gefordert") das Paradigma gewechselt statt weiter poliert: (1) Das gesamte Sortiment als **reaktive Schlaegerwand** - Opener "244 SCHLÄGER. FÜNF SIND DEINS.", nicht-passende Schlaeger werden live entsaettigt. (2) Die **Matrix als Eingabeinstrument**: Spielstil x Level ist keine Klickfrage mehr, sondern eine Drag-Geste ("WO STEHST DU?"), die Wand reagiert in Echtzeit. (3) Grosser Fugaz-Zaehler auf der Wand. 3 Schritte statt 4 Fragen. Neue Komponenten: MatrixInput.tsx, RacketWall.tsx. Screenshots: design-review-2026-07/v4-wand/.

**Warum:** Kernkritik war berechtigt: Klick-Karten mit Foto = Versicherungs-Funnel. Award-Level-Berater machen das Produkt zur Buehne und die Antwort zur Geste (Apple-Konfigurator-Prinzip). Die Matrix war schon unser Kernvisual - jetzt ist sie Input UND Output.

**Wie/Learnings:**
- Shopify-CDN-Thumbs via `?width=160` an imageUrl - 231 Bilder im Grid laufen fluessig, matchesPartial() pro Schlaeger bei jedem Drag-Move ist unkritisch.
- Produktabfrage faengt Zubehoer ("Schlägertasche" enthaelt "Schläger") - isRecommendable filtert jetzt tasche/bag/grip/etc.
- Drag via Pointer Events + setPointerCapture + touch-none funktioniert fuer Maus und Touch identisch.

**Nachtraege gleiche Session:** (1) Wording-Fix: Intro-Line jetzt "231 Schläger. Einer passt." - digitale Schwester der freigegebenen Store-Line "2.000 Schlaeger. Einer passt." aus der Tagline-Bibliothek (tone-of-voice.md). ToV-Quelle: direkt/nahbar/selbstbewusst/mutig, trockene Selbstsicherheit, KEINE Wortspiele. (2) Lade-Kaskade statt Spinner: Kacheln skeletonen und blenden per onLoad ein. (3) Mobile-Fix: Wand ist beim Draggen jetzt sticky Band oben (h-44, z-30) - vorher war die Reaktion ausserhalb des Viewports. (4) Zahlen geklaert: Collection "padelschlaeger" = 348 Produkte, davon 90 Testschlaeger, 14 Junior, 13 Taschen-Zubehoer -> 231 echte Schlaeger auf der Wand.

**Stunner-Finale (Nachtrag, auf Christophs "am Ende fehlt ein Stunner"):** Reveal-Stage im Wizard statt Seitenwechsel. Nach der Budget-Antwort: alle Nicht-Treffer faden aus, die Top 5 fliegen per FLIP (Ist-Rect messen, Ziel berechnen, transform mit Spring-Easing + Stagger) aus ihren Wand-Positionen in eine grosse zentrierte Reihe, links landet das Spielerprofil ("Die Wand hat entschieden. Diese fünf bleiben.") mit CTA zur Detailseite. Cleanup beim Verlassen setzt alle Tile-Styles zurueck. Screenshots 09/10 in v4-wand/.

**Chronologische Abarbeitung (Nachtrag):** (1) Politur ERLEDIGT: Rang-Badges ploppen nach Landung auf den Top 5, Tiefenstaffelung beim Drag (unpassende Kacheln schrumpfen auf 0.82) - bewusst statt Live-Umsortierung, die wuerde flackern. (2) Vercel-Prod-Deploy vom Auto-Mode-Klassifizierer geblockt (2x, auch ein harmloser ls danach als Fehlgriff) - Christoph macht ihn per !-Befehl selbst. (3) Journey-Visual ERLEDIGT: journey-visual.md + .html (on-brand, Fugaz-Versalien-Subset 3,2KB via fonttools-venv eingebettet, offline, Light+Dark). Branch feature/berater-flow zu GitHub gepusht.

## 2026-07-06 (Abend) — Brand-Design-Pass: vom Formular zum Markenerlebnis

**Was:** Design-Session direkt angeschlossen (Christophs Feedback "zu bekannt, zu unaufgeregt"). Wizard v2: Split-Screen mit echter Padel-Bildwelt (5 Motive aus ~/Documents, visuell verifiziert, weboptimiert in public/motive/), Fugaz-One-Versalien-Statements als Headlines, Live-Pool-Zaehler ("Noch 31 von 244 im Rennen"), Spielerprofil-Archetypen (Stil x Level, z.B. "Stratege mit System"), inszenierter Reveal (Punkte poppen gestaffelt, Profil-Ring zuletzt). Screenshots: design-review-2026-07/v3-brand/.

**Warum:** Brandbox/Open Brain: "Die Typografie IST das Branding" (Fugaz One Versalien = Markencode), Blau nur Akzent, Bildwelt traegt die Farbe. Genau die drei Hebel gegen den Formular-Look.

**Wie/Learnings:**
- @theme-inline-Variablen (Tailwind v4) existieren zur Laufzeit NICHT als CSS-Custom-Properties → font-Klassen in globals.css definieren, die direkt auf next/font-Variablen zeigen.
- Fugaz One Versalien + leading unter 1.0 = Umlaut-Punkte ragen in die Zeile darueber → leading-[1.05].
- Bild-Verifikation zahlt sich aus: racket_blanc.jpg war ein TENNIS-Schlaeger (Dateiname suggeriert Padel).
- Motiv-Zuordnung: intro=Nacht-Court-Selfie (Nike-Shirt prominent - ggf. tauschen), level=Gruppe auf PP-Court (PP-Branding im Bild!), stil=Volley, gewicht=Smash, budget=Sommer-Overhead.

**Offene Punkte:** Journey-Visual fuer internen Pitch steht noch aus. Intro-Motiv mit grossem Nike-Branding ggf. ersetzen. Rest siehe Eintrag unten.

## 2026-07-06 — Berater-Flow: vom Explorer zum Verkaufsgespraech

**Was:** Design-Review des alten Drafts mit echten Shop-Daten (Screenshots in `design-review-2026-07/`), danach kompletter Umbau auf Branch `feature/berater-flow`: 4-Fragen-Wizard als neue Startseite (Spielniveau, Spielstil, Gewicht, Budget), Empfehlungs-Engine (`src/lib/finder.ts`), Ergebnisseite mit abgespeckter Matrix (5 Punkte + "Dein Profil"-Marker) und Rangliste mit Begruendungs-Chips, Shop-CTAs ueberall, Katalog nach `/katalog` verschoben. Screenshots v2 in `design-review-2026-07/v2-berater/`.

**Warum:** Der alte Draft kollabierte mit echten Daten - 348 Schlaeger in einer Scatter-Matrix sind unlesbar, die Position war ohnehin nur Kategorie + Zufalls-Jitter (Pseudo-Praezision). Ausserdem endete der Flow im Nichts (kein Link zum Produkt). Neue Logik: Berater fragt wie ein Verkaeufer, Matrix wird zur Ergebnis-Visualisierung degradiert und dadurch gerettet, Abschluss ist Conversion.

**Wie:**
- Scoring: Level/Spielstil hart gewichtet, Gewicht weich, Budget als harter Filter mit Auffuell-Fallback ("Leicht ueber Budget"-Chip). Preis-Richtung-Budget-Bonus (0.8 * price/limit) damit bei Punktgleichheit nicht die billigsten gewinnen. Testschlaeger + Junior-Modelle + Farbvarianten-Duplikate ausgefiltert.
- Ergebnis-Matrix: Kollisions-Spread mit Profil-Marker als festem Repeller. Drei Bugs nacheinander: (1) Oszillation Profil-Repel vs. Paar-Spread → bei Gleichstand horizontal ausweichen, (2) Rand-Clamp NACH der Schleife presste getrennte Punkte wieder aufeinander → Clamp in die Iteration, (3) Mobile-Labels kollidieren → auf Mobile ausblenden, Liste traegt die Namen.
- Selbst-Check-Loop: Playwright (chrome-headless-shell aus ms-playwright-Cache) + Screenshots Desktop/Mobile pro Iteration.

**Learnings:**
- Turbopack-Dev-Server lieferte nach Ersetzen von `page.tsx` die ALTE Seite aus - `.next` loeschen + Neustart noetig, HMR reicht bei Datei-Ersetzung nicht immer.
- `const URL = ...` in Node-Scripts schattet die globale URL-Klasse und crasht undici.
- Storefront-Token in `.env.local` funktioniert weiter; Metafields inzwischen 4/5 gepflegt, nur head-shape leer (deshalb Kopfform nicht im Berater-Scoring).

**Offene Punkte:**
- Christophs Review des Prototyps (Dev-Server laeuft auf localhost:3000, Branch nicht gepusht)
- Optional: Vercel-Deploy fuer teilbaren Link
- head-shape-Datenpflege oder dauerhaft ohne Kopfform beraten
- Feintuning Fragen-Wording + Empfehlungs-Erklaertexte
- Integration (App Proxy, siehe INTEGRATION.md) ist bewusst spaeterer Schritt
- Idee fuer spaeter (06.07., im Open Brain): optionaler KI-Video-Level-Check als Vorstufe zur Level-Frage - nicht als Pflicht-Schritt (Upload-Friction), erst Machbarkeit mit Beispiel-Clips testen. Details im Open-Brain-Eintrag.
- Christoph-Feedback (06.07.): Wizard-Stil "zu bekannt und unaufgeregt" - naechste Runde = Design-Session: (1) Split-Screen mit PP-Bildwelt, Motiv wechselt mit Antwort, (2) Live-Verdichtung des Pools (348 → ... → 5) als tickender Zaehler, (3) inszenierter Reveal der Ergebnis-Matrix, (4) benannte Spielerprofil-Archetypen als Ergebnis-Aufhaenger, (5) Fragen-Wording in PP-Voice (Brandbox als Quelle, nicht nur Shop-Look). Logik bleibt.
- Journey-Klaerung (06.07.): Zielort padel-point.de/schlaegerberater via App Proxy. Einstiege nach Prio: Kategorieseite-Banner (Muster = Katalog-Kachel im Prototyp), PDP-Check ("Passt dieser Schlaeger zu dir?", betrachteten Schlaeger mitnehmen), Nav-Flyout Padelschlaeger (ist bei PP duenn bestueckt), Homepage-Slot, QR auf Court-Bannern/Store. Journey-Visual fuer internen Pitch noch bauen.

## 2026-07-06 — Projekt wiedergefunden + Zugangs-Klaerung

**Was:** Projekt auf Anfrage wiedergefunden (hiess nicht "Racket-Matrix" sondern `padel-comparison`), Storefront-Token live getestet (funktioniert), Metafield-Befuellung geprueft (9/10 Schlaeger mit 4/5 Feldern), Confluence "APP API credentials" ausgewertet: Dev-Dashboard-Organisation existiert (Org 145468051, Dev-Team Marius Grewe/Marco Loos/Felix). Kein Admin-Login auf der Seite, aber laut Open Brain hat Christoph seit 05/2026 Shop-Admin-Zugriff.

**Offen davon:** Dev-Team um App-Eintrag mit Proxy-Config bitten, wenn Integration ansteht.
