# Deutschland White Gold Tracking

Öffentliches Monitoring-Projekt: **deutsche und regionale Nachrichtenquellen** sowie ausgewählte **EU-Behörden-Feeds** zum Thema **Lithium / Rohstoffe / Batteriewertschöpfung / Energie-Geothermie-Brinen** mit Bezug zu Deutschland. Daten werden in **JSON** für ein statisches **GitHub-Pages-Dashboard** (HTML + JavaScript) aufbereitet.

## Eigenständiges Repository

Dieser Ordner ist als **Wurzel eines eigenen öffentlichen GitHub-Repositories** gedacht (nicht Teil der Transtek-Website). Nach dem Anlegen des Repos auf GitHub diesen Inhalt als Root verwenden oder hier entwickeln und per Remote pushen.

## Architektur (Zielbild)

| Komponente | Technik |
|------------|---------|
| Pipeline | Python (zeitgesteuert GitHub Actions, später 2× täglich) |
| Daten | Versionierte JSON-Artefakte |
| Dashboard | Statisches HTML + JS (**Plotly.js** CDN für Diagramme), UI **Deutsch (v1)** |
| Hosting | Branch **`gh-pages`**, Aktualisierung durch **GitHub Actions** (RSS-Ingest → Deploy) |
| Kosten | 0 € (öffentliches Repo + GitHub Pages + Actions) |

## Rechtlicher Hinweis

Siehe [DISCLAIMER.md](DISCLAIMER.md). Das Dashboard ist **keine Anlageberatung**.

## Dokumentation

- [FLIGHT_PLAN.md](FLIGHT_PLAN.md) — Phasenplan und festgelegte Entscheidungen  
- [AGENT_HANDOFF.md](AGENT_HANDOFF.md) — Kontext für andere Agenten  
- [SOURCES.md](SOURCES.md) — Feed-Whitelist und EU-Stellen (Pflege)  
- [METRICS.md](METRICS.md) — Metrik-Definitionen (transparent)

## Lokales Dashboard

Ordner `dashboard/` — auf `gh-pages` als Site-Root deployt; **`index.html`** lädt **`meta.json`**, **`articles_recent.json`**, **`metrics_7d.json`** unter **`site/data/fixtures/`** (Pfad auf Pages gleicher Origin unter `/data/fixtures/`).

**GitHub Pages:** Branch **`gh-pages`**, Root enthält **`.nojekyll`** (kein Jekyll), damit `/data/...` JSON zuverlässig ausgeliefert wird.

**Navigation:** Ein SPA-artiges Layout auf **`index.html`**: Registerkarten **Zeitfenster** vs **Archiv-Historie**; im Zeitfenster Unter-Tabs **Live (7 Tage)** und **Zeitreise-Demos**. URLs: **`#zeitfenster`** / **`#archiv`**, optional **`?demo=<slug>`** für Demo-Fixtures (siehe `data/fixtures/demo/`).

**Zeitreise (Demo):** Statische Snapshots unter `data/fixtures/demo/<slug>/` — keine echte RSS-Zeitreihe.

**Historie / Archiv:** Panel auf derselben Seite; Daten aus **`data/archive/summary.json`**. **`historie.html`** leitet nur noch nach **`index.html#archiv`** weiter (Bookmarks). Archiv-Pflege im Workflow — siehe `METRICS.md` und **`pipeline/README.md`** (`archive_merge.py`, optional `workflow_dispatch` Epochen-Ingest).

**CI:** `.github/workflows/ingest-and-pages.yml` — Cron **05:15 / 18:15 UTC** (sommers grob Berlin-Morgen/Abend, DST nicht automatisch korrigiert); **`workflow_dispatch`** inkl. optionalem Epochen-Schritt.
