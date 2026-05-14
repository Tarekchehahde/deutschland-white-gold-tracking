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

## Verzeichnis-Lage (Ziel nach Ausrollen)

```
/
├── README.md, DISCLAIMER.md, SOURCES.md, METRICS.md
├── FLIGHT_PLAN.md, AGENT_HANDOFF.md
├── pipeline/           # Python (noch zu füllen)
├── dashboard/          # index.html, JS, CSS → Root von gh-pages Deploy
├── data/               # generierte JSON (auf gh-pages neben dashboard oder unter /data)
└── .github/workflows/  # später
```

**Deploy-Detail klären**: Entweder gesamter Repo-Inhalt auf `gh-pages` oder nur `dashboard/` + `data/`; Same-Origin für `fetch('/data/...')` sicherstellen.

## Wo weitermachen

1. `FLIGHT_PLAN.md` Phase 0 abschließen (Repo auf GitHub).  
2. `SOURCES.md` mit echten Feed-URLs füllen.  
3. JSON-Schema aus `data/schema/` implementieren und Fixtures schreiben.  
4. Ersten Workflow nur „generate fixtures → push gh-pages“ testen.  

## Bekannte fallweise Verwechslungen

- **Altmark / Sachsen-Anhalt** (Neptune, tiefe Brinen/Gasfeld-Kontext) vs **Oberrheingraben** (Geothermie-Lithium, andere Akteure) — im Datenmodell **Projekt-/Regions-Tags** trennen.

## Kontakt / Maintainer

*(Erganzen: GitHub-Handle des Owners.)*
