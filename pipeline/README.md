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

GitHub Actions (`.github/workflows/ingest-and-pages.yml`) baut die Site unter `site/` und deployt nach Branch **`gh-pages`**.
