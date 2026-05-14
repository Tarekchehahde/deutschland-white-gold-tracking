#!/usr/bin/env python3
"""Merge aktuelle Fenster-Artikel in persistiertes Archiv (Dedupe nach URL).

Schreibt:
  data/archive/archive.json     — alle Artikel (gedeckelt)
  data/archive/summary.json    — Kennzahlen + recent_for_ui für historie.html
  data/archive/months/YYYY-MM.json — Partition pro Monat (Erscheinungsdatum UTC)
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ARCHIVE_SCHEMA = "0.3.0"
MAX_ARTICLES = 3500
RECENT_UI = 400


def _repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def load_recent(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        print(f"recent-json fehlt: {path}", file=sys.stderr)
        return []
    data = json.loads(path.read_text(encoding="utf-8"))
    return list(data.get("articles") or [])


def load_archive(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    data = json.loads(path.read_text(encoding="utf-8"))
    return list(data.get("articles") or [])


def merge_articles(existing: list[dict[str, Any]], incoming: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_url: dict[str, dict[str, Any]] = {}
    for a in existing:
        url = a.get("url")
        if isinstance(url, str) and url:
            by_url[url] = a
    for a in incoming:
        url = a.get("url")
        if not isinstance(url, str) or not url:
            continue
        by_url[url] = a
    merged = sorted(by_url.values(), key=lambda x: x.get("published_at") or "", reverse=True)
    return merged[:MAX_ARTICLES]


def write_month_partitions(months_dir: Path, articles: list[dict[str, Any]]) -> dict[str, int]:
    if months_dir.exists():
        shutil.rmtree(months_dir)
    months_dir.mkdir(parents=True, exist_ok=True)

    by_month: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for a in articles:
        pub = a.get("published_at") or ""
        if len(pub) >= 7:
            ym = pub[:7]
            by_month[ym].append(a)

    counts: dict[str, int] = {}
    for ym in sorted(by_month.keys()):
        chunk = sorted(by_month[ym], key=lambda x: x.get("published_at") or "", reverse=True)
        counts[ym] = len(chunk)
        payload = {
            "schema_version": ARCHIVE_SCHEMA,
            "month": ym,
            "article_count": len(chunk),
            "articles": chunk,
        }
        (months_dir / f"{ym}.json").write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    return counts


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--recent-json",
        type=Path,
        required=True,
        help="Pfad zu articles_recent.json (aktueller Ingest)",
    )
    parser.add_argument(
        "--archive-dir",
        type=Path,
        default=_repo_root() / "data" / "archive",
        help="Zielverzeichnis für archive.json, summary.json, months/",
    )
    args = parser.parse_args()

    archive_dir = args.archive_dir.resolve()
    archive_dir.mkdir(parents=True, exist_ok=True)
    archive_path = archive_dir / "archive.json"
    months_dir = archive_dir / "months"

    existing = load_archive(archive_path)
    incoming = load_recent(args.recent_json)
    merged = merge_articles(existing, incoming)

    archive_payload = {"schema_version": ARCHIVE_SCHEMA, "articles": merged}
    archive_path.write_text(json.dumps(archive_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    per_month = write_month_partitions(months_dir, merged)

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    summary = {
        "schema_version": ARCHIVE_SCHEMA,
        "generated_at_utc": now,
        "archive_article_cap": MAX_ARTICLES,
        "total_in_archive": len(merged),
        "articles_per_month": dict(sorted(per_month.items())),
        "recent_for_ui": merged[:RECENT_UI],
    }
    (archive_dir / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(
        f"Archiv: {len(merged)} Artikel, {len(per_month)} Monats-Dateien unter {months_dir}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
