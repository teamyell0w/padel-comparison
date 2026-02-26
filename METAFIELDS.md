# Shopify Metafield Mappings

Metafield-Definitionen wie sie in Shopify Custom Data existieren.

## Bestehende Definitionen

| Anzeigename | Namespace.Key | Unser Alias | Beschreibung |
|---|---|---|---|
| level-of-play | `rackets.level-of-play_3786` | `playerLevel` | Spielniveau (Einsteiger/Fortgeschritten/Turnier) |
| players-type | `rackets.players-type_3788` | `playType` | Spielertyp (Angriff/Allround/Kontrolle/Defensiv) |
| core-material | `rackets.core-material_3867` | `coreMaterial` | Kernmaterial (EVA, Foam, etc.) |
| global-weight | `global.weight_3619` | `weight` | Gewicht in Gramm |
| playing-style | `rackets.playing-style_3845` | `playingStyle` | Spielstil |
| head-size | `rackets.head-size_3553` | `headSize` | Kopfgroesse |
| head-shape | `rackets.head-shape_3734` | `headShape` | Kopfform (Rund/Diamant/Tropfen/Hybrid) |
| balance | `rackets.balance_3537` | `balance` | Balance (Kopf-/Grifflastig/Ausgewogen) |
| structure-surface | `rackets.structure-surface_3866` | `surfaceMaterial` | Oberflaeche/Schlagflaechenmaterial |

## Fehlende Definitionen (manuell anlegen)

| Key | Namespace | Typ | Beschreibung |
|---|---|---|---|
| `core_hardness` | `custom` | Single line text | Haerte Kern (hard/medium/soft) |
| `surface_hardness` | `custom` | Single line text | Haerte Schlagflaeche (hard/medium/soft) |

## Hinweise

- Namespace `rackets.*` wurde von einer App/PIM automatisch erstellt (Suffix ist auto-generierte ID)
- Namespace `global.*` kommt ebenfalls aus einem externen System
- Storefront API Access muss fuer alle Definitionen aktiviert sein
- Aktuell sind die Werte bei den meisten Produkten **nicht befuellt**
