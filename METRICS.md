# Metrik-Definitionen

Alle Zahlen im Dashboard beziehen sich auf die **aktuell ingesteten Artikel** und **regelbasierte** Tags — keine proprietären NLP-APIs (v1).

## Zeitfenster

| Ansicht | Daten |
|---------|--------|
| Haupt-Dashboard | Rollierend **letzte 7 Tage** (konfigurierbar, Datum nach Erscheinen/Fetch) |
| Historie | Separates Dashboard / zusätzliche JSON-Archive |

## Geplante Basismetriken (v1)

1. **Artikelvolumen** — Anzahl pro Kalendertag (und gleitender Durchschnitt optional später).  
2. **Schwerpunktthemen** — Anteil nach Keyword-Clustern (z. B. `exploration`, `genehmigung`, `umwelt`, `politik`, `industrie`).  
3. **Regionaler Bezug** — Treffer auf konfigurierte Region/Land-Kürzel oder Projekt-Namen (regelbasiert).  
4. **Quellenmix** — Verteilung nach Outlet-Kategorie (national / regional / EU-Behörde).  

## Qualität

- **Dedupe**: gleiche canonical URL oder stabiler Hash aus Titel+Datum.  
- **Transparenz**: Jede Metrik verlinkt auf Rohliste der zugrunde liegenden Artikel-IDs in JSON.

*(Schema-Versionierung in `data/schema/` ergänzen.)*
