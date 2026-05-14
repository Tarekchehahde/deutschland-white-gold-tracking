# Pipeline (Python)

## Ausführung

```bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r pipeline/requirements.txt
python pipeline/run.py --output-dir data/fixtures
```

Konfiguration:

- `config/feeds.yaml` — RSS-URLs und `category`
- `config/keywords.yaml` — Filter-Termini und Tag-Heuristiken

Ausgabe (Schema `0.2.0`): `meta.json`, `articles_recent.json`, `metrics_7d.json`

### Epochen-Ingest (`--since-date`)

Für einen **unteren Zeitpunkt** statt rollierendem Fenster (z. B. Backfill ab 2025):

```bash
python pipeline/run.py \
  --output-dir tmp_epoch_out \
  --since-date 2025-01-01 \
  --max-entries-per-feed 400
```

**RSS-Grenze:** Feeds enthalten nur die letzten N Einträge; `--since-date` filtert nach unten, kann aber keine älteren Artikel wiederherstellen, die nicht mehr im Feed stehen. Einträge ohne parsierbares Datum werden im Epochen-Modus verworfen.

CI: Workflow **Ingest RSS and publish Pages** → `workflow_dispatch` mit Option „Epoch ingest into archive“ (gleiche Parameter wie oben, dann `archive_merge.py`).

## Archiv-Merge (Historie, Schema `0.3.0`)

Nach einem Ingest die Fenster-Artikel ins persistente Archiv mergen (Dedupe nach URL, Deckel 3500, Monats-Partitionen):

```bash
python pipeline/run.py --output-dir data/fixtures
python pipeline/archive_merge.py --recent-json data/fixtures/articles_recent.json --archive-dir data/archive
```

GitHub Actions (`.github/workflows/ingest-and-pages.yml`) baut die Site unter `site/` und deployt nach Branch **`gh-pages`**.
