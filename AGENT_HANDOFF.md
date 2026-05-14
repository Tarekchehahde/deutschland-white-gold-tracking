# Agent Handoff — Deutschland White Gold Tracking

## Zweck

Öffentliches, kostenfreies **Nachrichten- und Behörden-Signal-Monitoring** rund um **Lithium / deutsche Rohstoffprojekte / EU-Rohstoffpolitik** mit Bezug zu Deutschland. Zielgruppe: informierte Leser (z. B. Investoren-Interesse), **ohne** Anlageberatung.

## Hard Constraints

- **Eigenes Repo**: Dieser Ordner ist die **Repo-Wurzel** für ein separates GitHub-Projekt (nicht Transtek-Business-Website).
- **Budget 0 €**: GitHub Actions + Pages + öffentliches Repo.
- **Recht**: Nur RSS/API gemäß ToS; Disclaimer und Quellen immer sichtbar.
- **Sprache UI v1**: **Deutsch**; Keywords für Matching können deutsch + feste EU-Terme sein.

## Architektur (vereinbart)

| Teil | Stack |
|------|--------|
| Ingest + Metriken | **Python** |
| Speicherung | Committed **JSON** auf **`gh-pages`** (Dashboard + `data/`) |
| Dashboard | **Static HTML + JS** (Plotly oder Vega) |
| Zeitplan | 2× täglich — lokale Zeiten **Berlin 07:00 und 20:00** → in Actions als **UTC-Cron** abbilden (DST beachten) |

## Verzeichnis-Lage (Ist)

```
/
├── README.md, DISCLAIMER.md, SOURCES.md, METRICS.md
├── FLIGHT_PLAN.md, AGENT_HANDOFF.md
├── pipeline/           # run.py, archive_merge.py, requirements.txt, README.md
├── config/             # feeds.yaml, keywords.yaml
├── dashboard/          # index.html, app.js, styles.css; historie.html → Redirect #archiv
├── data/fixtures/, data/archive/, data/schema/
└── .github/workflows/ingest-and-pages.yml
```

**Deploy:** Workflow baut **`site/`** (Dashboard-Assets + kopiert `data/archive/*`, Fixtures vom Ingest) → **`peaceiris/actions-gh-pages`** → Branch **`gh-pages`**. Same-Origin für `fetch` zur gleichen Pages-URL.

## Wo weitermachen

1. Phasen 0–5 siehe **`FLIGHT_PLAN.md`** (Dashboard + Archiv + Tabs sind umgesetzt).  
2. **Phase 6** / Pflege: Feed-/Keyword-Tuning (`config/*.yaml`), gegebenenfalls **Cron-Verhalten** in den Repo-**Actions**-Settings prüfen wenn `schedule`-Läufe ausbleiben.  
3. Optional: **`workflow_dispatch`** mit Epochen-Merge für Archiv-Backfill (`pipeline/README.md`).  

## Bekannte fallweise Verwechslungen

- **Altmark / Sachsen-Anhalt** (Neptune, tiefe Brinen/Gasfeld-Kontext) vs **Oberrheingraben** (Geothermie-Lithium, andere Akteure) — im Datenmodell **Projekt-/Regions-Tags** trennen.

## Kontakt / Maintainer

*(Erganzen: GitHub-Handle des Owners.)*
