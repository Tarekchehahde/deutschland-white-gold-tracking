# Metrik-Definitionen

Alle Zahlen im Dashboard beziehen sich auf die **aktuell ingesteten Artikel** und **regelbasierte** Tags — keine proprietären NLP-APIs (v1).

## Zeitfenster

| Ansicht | Daten |
|---------|--------|
| Zeitfenster (Live) | Rollierend **letzte 7 Tage** (`pipeline/run.py`, konfigurierbar; Datum nach Erscheinen/Fetch) |
| Zeitfenster (Demo) | Fixierte Snapshots unter `data/fixtures/demo/<slug>/` (Registerkarten + `?demo=` auf **`index.html`**) |
| Archiv-Historie | Gleiche **`index.html`**, Panel „Archiv“ (`#archiv`); **`data/archive/summary.json`** + Monats-JSON unter `data/archive/months/` |

## Geplante Basismetriken (v1)

1. **Artikelvolumen** — Anzahl pro Kalendertag (und gleitender Durchschnitt optional später).  
2. **Schwerpunktthemen** — Anteil nach Keyword-Clustern (z. B. `exploration`, `genehmigung`, `umwelt`, `politik`, `industrie`).  
3. **Regionaler Bezug** — Treffer auf konfigurierte Region/Land-Kürzel oder Projekt-Namen (regelbasiert).  
4. **Quellenmix** — Verteilung nach Outlet-Kategorie (national / regional / EU-Behörde).  

## Qualität

- **Dedupe**: gleiche canonical URL oder stabiler Hash aus Titel+Datum.  
- **Transparenz**: Jede Metrik verlinkt auf Rohliste der zugrunde liegenden Artikel-IDs in JSON.
- **Filter**: `config/keywords.yaml` — `match_substrings`, optional `match_regex`, sowie `exclude_substrings` (z. B. Quecksilber, „Stellenabbau“, irrelevanter Regionalstoff). Feintuning ohne Code möglich.

### Rohstoff / Geologie / Fluide

Die Keyword-Logik deckt neben Batterien und E-Mobilität auch **natürliche Vorkommen** und verwandte Begriffe ab, z. B. **Lagerstätten**, **Rohstoffvorkommen**, **Thermalsole/Tiefenwasser**, **Salzlauge**, **Pegmatit/Spodumen**, sowie kombinierte Regex für englische Texte (**reservoir**, **pocket** nahe „Lithium“). Es gilt weiterhin: Treffer nur, wenn Titel oder RSS-Kurztext eines konfigurierten Feeds die Regeln erfüllen.

## Artefakte (Dashboard, Schema 0.2.0)

| Datei | Inhalt |
|-------|--------|
| `data/fixtures/meta.json` (Prod: z. B. gleicher Pfad ohne `fixtures`) | Fenster, Zeitstempel, `sources_revision` |
| `data/fixtures/articles_recent.json` | Liste der Artikel im Fenster |
| `data/fixtures/metrics_7d.json` | Aggregierte Kennzahlen (`articles_per_day`, `tag_counts`, …) |

JSON Schemas: `data/schema/meta.schema.json`, `articles_recent.schema.json`, `metrics_7d.schema.json`, `article.schema.json`, `archive_summary.schema.json`.

## Archiv (Historie, Schema 0.3.0)

| Datei | Inhalt |
|-------|--------|
| `data/archive/archive.json` | Alle archivierten Artikel (Dedupe nach URL, Obergrenze aktuell 3500) |
| `data/archive/summary.json` | Kennzahlen, `articles_per_month`, `recent_for_ui` für das Archiv-Panel in **`index.html`** |
| `data/archive/months/YYYY-MM.json` | Partition je Kalendermonat (Erscheinungsdatum UTC) |

Nach jedem erfolgreichen Ingest aktualisiert der Workflow das Archiv und committed Änderungen nach `main` mit `[skip ci]`. Die gleichen Dateien werden nach `site/data/archive/` kopiert und auf **GitHub Pages** ausgeliefert.
