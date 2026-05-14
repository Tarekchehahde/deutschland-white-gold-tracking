# Flight Plan — Deutschland White Gold Tracking

## Festgelegte Entscheidungen (nicht ohne Absprache ändern)

| Thema | Entscheidung |
|-------|----------------|
| Repo | **Öffentlich** |
| Pipeline-Sprache | **Python** (R nur Fallback bei Bedarf) |
| Dashboard | **Plain HTML + JS** (Plotly/Vega o. ä.) |
| UI-Sprache v1 | **Deutsch** |
| Nachrichten-Fokus v1 | **National + regional (DE)**; EU-Behörden-Feeds zusätzlich |
| Später | Internationale / EU-Medien erweiterbar |
| GitHub Pages | Branch **`gh-pages`**, Update durch **GitHub Actions** |
| Rechtliches | **Disclaimer** + **Quellenliste** sichtbar im Dashboard |
| Hauptansicht | ~**7 Tage**; Historie **separat** |

## Architektur-Kurzform

```
GitHub Actions (Cron 2×/Tag, UTC aus Berlin 07:00 / 20:00)
       → Python ingest + metrics
       → JSON schreiben
       → Commit / Push zu gh-pages (Dashboard + data/)
```

Same-Origin: Dashboard lädt JSON von derselben Pages-URL (`/data/...`).

## Phasen

### Phase 0 — Foundation

- [x] README, Disclaimer, SOURCES-, METRICS-, FLIGHT_PLAN, AGENT_HANDOFF  
- [x] JSON-Schema-Stubs  
- [x] Dashboard-Stub (DE), Hinweis Disclaimer  
- [x] Eigenes GitHub-Repo anlegen und diesen Ordner als Root pushen  

### Phase 1 — Data Contract

- [x] `articles_recent.json`, `metrics_7d.json`, `meta.json` finalisieren (Schema **0.2.0**, getrennte Dateien)  
- [x] Beispiel-JSON mit Fixture-Daten unter `data/fixtures/`  

### Phase 2 — Pipeline v0

- [ ] Python: RSS fetch, normalize, dedupe, keyword buckets  
- [ ] Konfiguration: `config/feeds.yaml` aus SOURCES.md  

### Phase 3 — Actions + gh-pages

- [ ] Workflow: Zeitplan UTC, Secrets nur falls nötig  
- [ ] Deploy-Schritt: Branch `gh-pages`  

### Phase 4 — Dashboard v1

- [ ] Charts: Volumen, Themenmix, Tabelle  
- [ ] „Zuletzt aktualisiert“, Links zu Originalartikeln  

### Phase 5 — Historie

- [ ] Archiv-JSON oder partitionierte Dateien  
- [ ] Zweite HTML-Seite `historie.html`  

### Phase 6 — Härten

- [ ] Feed-Fehler tolerant; Workflow-Zusammenfassung  
- [ ] Repo-Größe beobachten (Kompression, Retention)  

## Offene Punkte (vor Infrastructure)

- ~~Konkrete RSS-URLs für v1-Whitelist eintragen (`SOURCES.md`).~~ (breite Liste liegt vor; Pipeline kuratiert später.)  
- Keyword-Listen für DE (und EU-Behörden-Terminologie) abstimmen.  
