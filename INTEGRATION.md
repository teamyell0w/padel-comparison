# Shopify-Integration: Optionen fuer den Schlaeger-Vergleich

## Status Quo

Das Vergleichs-Tool laeuft als **eigenstaendige Next.js-App auf Vercel**.
Produktdaten kommen aktuell aus Testdaten, die Shopify Storefront API Anbindung ist vorbereitet.

**Ziel**: Das Tool in den padel-point.de Shop integrieren, sodass Kunden direkt aus dem Schlaeger-Sortiment in den Vergleichs-Flow einsteigen koennen.

**Flow**: Katalog (filtern/auswaehlen) → Matrix (2D-Positionierung) → Vergleich (Detail-Tabelle)

---

## Option A: Standalone auf Subdomain

```
vergleich.padel-point.de  →  Vercel (Next.js App)
                                ↓
                          Storefront API (read-only)
                                ↓
                          padel-point.de (Produktdaten)
```

### Umsetzung

- App bleibt auf Vercel
- Subdomain `vergleich.padel-point.de` als CNAME auf Vercel
- Produktdaten via Shopify Storefront API (GraphQL, kostenloser Token)
- "Im Shop ansehen" Links fuehren zurueck zu `padel-point.de/products/{handle}`
- Im Shop: Button/Link "Schlaeger vergleichen →" der zur Subdomain fuehrt

### Vorteile

- **Sofort umsetzbar** — Infrastruktur steht, kein Shopify-Theme anfassen
- **Volle Kontrolle** ueber Layout, Routing, Performance
- **Unabhaengig** vom Shop-Team — kein Blocker durch andere Abteilungen
- **Next.js Features** voll nutzbar (SSR, ISR, Server Components)
- **Schnelle Iteration** — `git push` = deployed

### Nachteile

- **Medienbruch** — User verlaesst kurz die Shop-Domain
- **Kein shared State** — Warenkorb, Login nicht verbunden
- **Separates Hosting** — Vercel muss gewartet werden (aktuell kostenlos)
- **SEO** — Inhalte auf Subdomain statt Hauptdomain

### Kosten

| Posten | Kosten |
|--------|--------|
| Vercel Hobby | 0 € |
| Storefront API | 0 € (in jedem Shopify-Plan) |
| Subdomain-Setup | 0 € (DNS CNAME) |
| **Gesamt** | **0 €** |

---

## Option B: Shopify App Proxy

```
padel-point.de/tools/vergleich  →  Shopify Proxy  →  Vercel (Next.js App)
```

### Umsetzung

- Eine **Shopify App** erstellen (Private App reicht)
- App Proxy konfigurieren: `padel-point.de/tools/vergleich/*` → Vercel-URL
- Shopify leitet Requests transparent an die Vercel-App weiter
- Der User bleibt auf `padel-point.de` (gleiche Domain, gleiche Session)
- Optional: Shopify Liquid-Template als Wrapper (Header/Footer vom Shop)

### Vorteile

- **Gleiche Domain** — kein Medienbruch, User bleibt auf padel-point.de
- **SEO-freundlich** — Inhalte leben unter der Hauptdomain
- **Shop-Header/Footer** koennen per Liquid-Wrapper eingebunden werden
- **Zugriff auf Customer-Session** moeglich (eingeloggter User)
- **Weiterhin Vercel** als Hosting — gleiche Dev-Experience wie Option A

### Nachteile

- **Shopify App noetig** — muss im Partner-Dashboard erstellt werden (einmalig)
- **Proxy-Latenz** — Requests gehen ueber Shopify, minimal langsamer
- **Liquid-Wrapper** muss gebaut und gepflegt werden (Header/Footer Sync)
- **Abhaengigkeit** vom Webshop-Team fuer die App-Installation
- **Debugging komplexer** — Proxy-Layer zwischen User und App

### Kosten

| Posten | Kosten |
|--------|--------|
| Vercel Hobby | 0 € |
| Storefront API | 0 € |
| Shopify App (Private) | 0 € |
| **Gesamt** | **0 €** |

---

## Option C: Shopify Theme App Extension

```
padel-point.de/pages/vergleich  →  Shopify Theme  →  React-Bundle (Theme Extension)
                                                          ↓
                                                    Storefront API
```

### Umsetzung

- **Shopify App** mit Theme App Extension erstellen
- React-App als Bundle in die Extension packen
- Extension rendert als Block innerhalb einer Shopify-Seite
- Komplett nativ im Shop — gleicher Header, Footer, Warenkorb, Login
- Hosting ueber **Oxygen** (Shopify's Edge-CDN, kostenlos)

### Vorteile

- **Vollstaendig nativ** — lebt im Shop, kein externer Host
- **Shared State** — Warenkorb, Customer-Login, alles verbunden
- **Kein separates Hosting** — Oxygen ist kostenlos, kein Vercel noetig
- **Ein Deployment-Pipeline** — alles ueber Shopify CLI
- **Keine Domain/Proxy-Konfiguration** noetig

### Nachteile

- **Theme-Block Einschraenkung** — kein Full-Page-Control, React lebt in einem Container innerhalb des Liquid-Themes
- **Multi-Page State** — Shopify = Multi-Page Architecture (Liquid). Jeder Seitenwechsel = Full Page Reload = React-State weg. Entweder alles als SPA in einen Block quetschen oder State ueber URL-Params/localStorage retten
- **Bundle-Size** — React + ReactDOM (~45KB gzip) wird zusaetzlich zum Theme-JS geladen, drueckt Lighthouse-Score
- **Dev-Experience langsamer** — `shopify app dev` statt `npm run dev`, braucht Dev-Store, kein schnelles Hot Reload
- **Kein SSR** — Theme Extensions sind rein client-side
- **Setup-Overhead** — Shopify Partner Account, App CLI, OAuth, Dev-Store
- **Abhaengigkeit** vom Webshop-Team fuer Installation und Theme-Anpassungen

### Kosten

| Posten | Kosten |
|--------|--------|
| Oxygen Hosting | 0 € (in jedem Shopify-Plan) |
| Storefront API | 0 € |
| Shopify App (Private) | 0 € |
| **Gesamt** | **0 €** |

---

## Vergleichsmatrix

| Kriterium | A: Subdomain | B: App Proxy | C: Theme Extension |
|-----------|:---:|:---:|:---:|
| Time-to-Market | schnell | mittel | langsam |
| Kosten | 0 € | 0 € | 0 € |
| Dev-Experience | sehr gut | gut | maessig |
| Shop-Integration | gering | gut | nativ |
| SEO | Subdomain | Hauptdomain | Hauptdomain |
| Warenkorb-Anbindung | nein | moeglich | ja |
| Unabhaengigkeit | hoch | mittel | gering |
| Performance | sehr gut | gut | gut* |
| Full-Page-Control | ja | ja | eingeschraenkt |

*\* Zusaetzliches JS-Bundle auf Shop-Seiten*

---

## Empfohlener Weg

```
Jetzt                    Validiert                  Skaliert
  │                         │                          │
  ▼                         ▼                          ▼
Option A                Option B                  Option C
Subdomain               App Proxy              Theme Extension
(sofort live)      (gleiche Domain)          (nativ im Shop)
```

1. **Starte mit A** — Tool ist sofort nutzbar, keine Blocker, schnelle Iteration
2. **Upgrade auf B** wenn das Tool validiert ist — nahtlose Integration, gleiche Domain, weiterhin Vercel als Host
3. **Optional C** wenn der Vergleich ein Kern-Feature des Shops wird und native Warenkorb-Integration gebraucht wird

**Die Storefront API Anbindung bleibt bei allen drei Optionen identisch** — kein Wegwerf-Aufwand.

---

## Naechste Schritte

- [ ] Storefront API Token im Shopify Admin erstellen (Headless Channel)
- [ ] Token in `.env.local` eintragen, Metafield-Keys pruefen
- [ ] Echte Produktdaten testen
- [ ] Subdomain `vergleich.padel-point.de` einrichten (DNS CNAME → cname.vercel-dns.com)
- [ ] Link im Shop platzieren ("Schlaeger vergleichen →")
