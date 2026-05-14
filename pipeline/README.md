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

## Archiv-Merge (Historie, Schema `0.3.0`)

Nach einem Ingest die Fenster-Artikel ins persistente Archiv mergen (Dedupe nach URL, Deckel 3500, Monats-Partitionen):

```bash
python pipeline/run.py --output-dir data/fixtures
python pipeline/archive_merge.py --recent-json data/fixtures/articles_recent.json --archive-dir data/archive
```

GitHub Actions (`.github/workflows/ingest-and-pages.yml`) baut die Site unter `site/` und deployt nach Branch **`gh-pages`**.
