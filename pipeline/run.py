#!/usr/bin/env python3
"""Fetch RSS feeds, filter by keywords, emit meta.json / articles_recent.json / metrics_7d.json."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlparse, urlunparse

import feedparser
import requests
import yaml

UA = (
    "DeutschlandWhiteGoldBot/0.1 (+https://github.com/Tarekchehahde/"
    "deutschland-white-gold-tracking)"
)
SCHEMA_VERSION = "0.2.0"
MAX_ENTRIES_DEFAULT = 80


def parse_since_date(raw: str) -> datetime | None:
    """Untere Datumsgrenze für Epochen-Ingest (UTC, Tagesbeginn)."""
    s = (raw or "").strip()
    if not s:
        return None
    try:
        return datetime.strptime(s, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    except ValueError:
        print(f"Ungültiges --since-date {raw!r}, erwarte YYYY-MM-DD", file=sys.stderr)
        return None


def _repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def load_yaml(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as f:
        return yaml.safe_load(f)


def normalize_url(url: str) -> str:
    try:
        parts = urlparse(url.strip())
        q = []
        for pair in parts.query.split("&"):
            if not pair:
                continue
            k = pair.split("=")[0].lower()
            if k.startswith("utm_"):
                continue
            q.append(pair)
        new_query = "&".join(q)
        return urlunparse(
            (parts.scheme, parts.netloc.lower(), parts.path, parts.params, new_query, "")
        )
    except Exception:
        return url.strip()


def parse_dt(entry: dict[str, Any]) -> datetime | None:
    if entry.get("published_parsed"):
        t = entry["published_parsed"]
        try:
            return datetime(t.tm_year, t.tm_mon, t.tm_mday, t.tm_hour, t.tm_min, t.tm_sec, tzinfo=timezone.utc)
        except (ValueError, TypeError):
            pass
    if entry.get("updated_parsed"):
        t = entry["updated_parsed"]
        try:
            return datetime(t.tm_year, t.tm_mon, t.tm_mday, t.tm_hour, t.tm_min, t.tm_sec, tzinfo=timezone.utc)
        except (ValueError, TypeError):
            pass
    for key in ("published", "updated"):
        raw = entry.get(key)
        if not raw or not isinstance(raw, str):
            continue
        try:
            dt = parsedate_to_datetime(raw)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc)
        except (TypeError, ValueError):
            continue
    return None


def text_matches(text: str, needles: list[str]) -> bool:
    folded = text.casefold()
    return any(n.casefold() in folded for n in needles)


def compile_regex_list(patterns: list[str]) -> list[re.Pattern[str]]:
    out: list[re.Pattern[str]] = []
    for p in patterns:
        if not p or not isinstance(p, str):
            continue
        try:
            out.append(re.compile(p, re.IGNORECASE))
        except re.error as ex:
            print(f"Ungültiges match_regex: {p!r} ({ex})", file=sys.stderr)
    return out


def matches_focus(blob: str, kw_cfg: dict[str, Any], regex_list: list[re.Pattern[str]]) -> bool:
    folded_blob = blob.casefold()
    for ex in kw_cfg.get("exclude_substrings") or []:
        if isinstance(ex, str) and ex.casefold() in folded_blob:
            return False
    needles = kw_cfg.get("match_substrings") or []
    if text_matches(blob, needles):
        return True
    return any(rx.search(blob) for rx in regex_list)


def classify_tags(summary: str, rules: dict[str, Any]) -> list[str]:
    found: list[str] = []
    tag_rules = rules.get("tag_rules") or {}
    for tag, cfg in tag_rules.items():
        subs = (cfg or {}).get("substrings") or []
        if text_matches(summary, subs):
            found.append(tag)
    return sorted(set(found))


def classify_regions(summary: str, hints: list[dict[str, str]]) -> list[str]:
    codes: list[str] = []
    folded = summary.casefold()
    for h in hints:
        sub = (h.get("substring") or "").casefold()
        code = h.get("code") or ""
        if sub and code and sub in folded:
            codes.append(code)
    return sorted(set(codes))


def fetch_feed(url: str, timeout: float = 25.0) -> feedparser.FeedParserDict:
    r = requests.get(url, headers={"User-Agent": UA}, timeout=timeout)
    r.raise_for_status()
    return feedparser.parse(r.content)


def entry_link(entry: dict[str, Any]) -> str | None:
    if entry.get("link"):
        return entry["link"]
    links = entry.get("links") or []
    for L in links:
        if L.get("rel") == "alternate" and L.get("href"):
            return L["href"]
    if links and links[0].get("href"):
        return links[0]["href"]
    return None


def entry_summary(entry: dict[str, Any], title: str) -> str:
    raw = entry.get("summary") or entry.get("description") or ""
    if isinstance(raw, str):
        text = re.sub(r"<[^>]+>", " ", raw)
        text = re.sub(r"\s+", " ", text).strip()
        return f"{title} {text}".strip()
    return title


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=_repo_root() / "data" / "fixtures",
        help="Directory for meta.json, articles_recent.json, metrics_7d.json",
    )
    parser.add_argument("--window-days", type=int, default=7)
    parser.add_argument(
        "--since-date",
        default="",
        help="Untere Grenze YYYY-MM-DD (UTC). Wenn gesetzt, wird das Zeitfenster nicht über "
        "--window-days begrenzt (Epochen-/Archiv-Ingest). RSS liefert jedoch nur die letzten N Einträge pro Feed.",
    )
    parser.add_argument(
        "--max-entries-per-feed",
        type=int,
        default=MAX_ENTRIES_DEFAULT,
        metavar="N",
        help=f"Max. Einträge pro Feed (Standard {MAX_ENTRIES_DEFAULT}). Für Epochen-Läufe oft 300–400.",
    )
    args = parser.parse_args()

    root = _repo_root()
    feeds_cfg = load_yaml(root / "config" / "feeds.yaml")
    kw_cfg = load_yaml(root / "config" / "keywords.yaml")
    regex_list = compile_regex_list(kw_cfg.get("match_regex") or [])
    region_hints = kw_cfg.get("region_hints") or []

    now = datetime.now(timezone.utc)
    since_raw = (args.since_date or "").strip()
    since_dt = parse_since_date(since_raw) if since_raw else None
    if since_raw and since_dt is None:
        return 2

    if since_dt is not None:
        earliest = since_dt
    else:
        earliest = now - timedelta(days=args.window_days)

    max_entries = max(1, int(args.max_entries_per_feed))

    raw_items: list[dict[str, Any]] = []
    errors: list[str] = []

    for feed in feeds_cfg.get("feeds") or []:
        fid = feed.get("id", "unknown")
        url = feed.get("url")
        cat = feed.get("category", "unknown")
        lang = feed.get("language") if isinstance(feed.get("language"), str) else ""
        lang = (lang.strip()[:8] or "de").lower()
        if not url:
            continue
        try:
            parsed = fetch_feed(url)
            entries = (parsed.entries or [])[:max_entries]
            for e in entries:
                link = entry_link(e)
                if not link:
                    continue
                title = (e.get("title") or "").strip() or "(ohne Titel)"
                published = parse_dt(e)
                if published is None:
                    if since_dt is not None:
                        continue
                    published = now
                if published < earliest:
                    continue
                if published > now:
                    published = now
                blob = entry_summary(e, title)
                if not matches_focus(blob, kw_cfg, regex_list):
                    continue
                raw_items.append(
                    {
                        "title": title,
                        "url": normalize_url(link),
                        "published_at": published,
                        "source_id": fid,
                        "feed_category": cat,
                        "language": lang,
                        "summary_text": blob[:500],
                        "tags": classify_tags(blob, kw_cfg),
                        "regions": classify_regions(blob, region_hints),
                    }
                )
        except Exception as ex:
            errors.append(f"{fid}: {ex}")

    seen: dict[str, dict[str, Any]] = {}
    for it in sorted(raw_items, key=lambda x: x["published_at"], reverse=True):
        if it["url"] in seen:
            continue
        seen[it["url"]] = it

    articles = []
    for url, it in seen.items():
        aid = hashlib.sha256(url.encode("utf-8")).hexdigest()[:24]
        articles.append(
            {
                "id": aid,
                "title": it["title"],
                "url": url,
                "published_at": it["published_at"].strftime("%Y-%m-%dT%H:%M:%SZ"),
                "source_id": it["source_id"],
                "language": it.get("language") or "de",
                "summary": it["summary_text"][:400],
                "tags": it["tags"],
                "regions": it["regions"],
                "_feed_category": it["feed_category"],
            }
        )

    articles.sort(key=lambda a: a["published_at"], reverse=True)

    articles_per_day: dict[str, int] = defaultdict(int)
    tag_counts: dict[str, int] = defaultdict(int)
    by_cat: dict[str, int] = defaultdict(int)
    for a in articles:
        day = a["published_at"][:10]
        articles_per_day[day] += 1
        by_cat[a["_feed_category"]] += 1
        for t in a["tags"]:
            tag_counts[t] += 1

    for a in articles:
        a.pop("_feed_category", None)

    sha = os.environ.get("GITHUB_SHA", "") or os.environ.get("SOURCE_COMMIT", "")
    sources_revision = sha[:12] if sha else "local"

    meta = {
        "schema_version": SCHEMA_VERSION,
        "generated_at_utc": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "window_days": args.window_days,
        "locale_ui": "de",
        "sources_revision": sources_revision,
        "feeds_ok": len(feeds_cfg.get("feeds") or []),
        "feeds_errors": len(errors),
        "max_entries_per_feed": max_entries,
    }
    if since_dt is not None:
        meta["epoch_since_utc"] = since_dt.strftime("%Y-%m-%dT00:00:00Z")
        meta["epoch_mode"] = True

    out = args.output_dir
    out.mkdir(parents=True, exist_ok=True)

    (out / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (out / "articles_recent.json").write_text(
        json.dumps({"schema_version": SCHEMA_VERSION, "articles": articles}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    metrics = {
        "schema_version": SCHEMA_VERSION,
        "articles_per_day": dict(sorted(articles_per_day.items())),
        "tag_counts": dict(sorted(tag_counts.items())),
        "by_source_category": dict(sorted(by_cat.items())),
    }
    (out / "metrics_7d.json").write_text(
        json.dumps(metrics, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Wrote {len(articles)} articles to {out}", file=sys.stderr)
    if errors:
        print("Feed warnings:", file=sys.stderr)
        for e in errors[:20]:
            print(f"  {e}", file=sys.stderr)
        if len(errors) > 20:
            print(f"  … {len(errors) - 20} more", file=sys.stderr)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
