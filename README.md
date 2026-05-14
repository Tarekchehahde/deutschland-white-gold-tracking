# Deutschland White Gold Tracking

Öffentliches Monitoring-Projekt: **deutsche und regionale Nachrichtenquellen** sowie ausgewählte **EU-Behörden-Feeds** zum Thema **Lithium / Rohstoffe / Batteriewertschöpfung / Energie-Geothermie-Brinen** mit Bezug zu Deutschland. Daten werden in **JSON** für ein statisches **GitHub-Pages-Dashboard** (HTML + JavaScript) aufbereitet.

## Eigenständiges Repository

Dieser Ordner ist als **Wurzel eines eigenen öffentlichen GitHub-Repositories** gedacht (nicht Teil der Transtek-Website). Nach dem Anlegen des Repos auf GitHub diesen Inhalt als Root verwenden oder hier entwickeln und per Remote pushen.

## Architektur (Zielbild)

| Komponente | Technik |
|------------|---------|
| Pipeline | Python (zeitgesteuert GitHub Actions, später 2× täglich) |
| Daten | Versionierte JSON-Artefakte |
| Dashboard | Statisches HTML + JS (z. B. Plotly/Vega), UI **Deutsch (v1)** |
| Hosting | Branch **`gh-pages`**, Aktualisierung durch Actions |
| Kosten | 0 € (öffentliches Repo + GitHub Pages + Actions) |

## Rechtlicher Hinweis

Siehe [DISCLAIMER.md](DISCLAIMER.md). Das Dashboard ist **keine Anlageberatung**.

## Dokumentation

- [FLIGHT_PLAN.md](FLIGHT_PLAN.md) — Phasenplan und festgelegte Entscheidungen  
- [AGENT_HANDOFF.md](AGENT_HANDOFF.md) — Kontext für andere Agenten  
- [SOURCES.md](SOURCES.md) — Feed-Whitelist und EU-Stellen (Pflege)  
- [METRICS.md](METRICS.md) — Metrik-Definitionen (transparent)

## Lokales Dashboard (Entwurf)

Ordner `dashboard/` — auf `gh-pages` als Site-Root deployt; lädt **`meta.json`**, **`articles_recent.json`**, **`metrics_7d.json`** unter `data/fixtures/` (lokal: gleicher Pfad relativ zum Repo).

**GitHub Pages:** Im Branch **`gh-pages`** eine leere Datei **`.nojekyll`** im Root halten, damit die Site **nicht durch Jekyll gebaut** wird und statische JSON unter `data/` zuverlässig ausgeliefert werden.
