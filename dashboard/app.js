/**
 * Lädt die drei Artefakte aus FLIGHT_PLAN Phase 1:
 * meta.json, articles_recent.json, metrics_7d.json
 *
 * Basis-Pfad: ./data/fixtures/ (GitHub Pages Root).
 * Lokal unter …/dashboard/: automatisch ../data/fixtures/
 * Optional: window.__DWG_DATA_FIXTURES__ = "../data/fixtures/" überschreibt.
 */

function fixturesBaseHref() {
  if (typeof window.__DWG_DATA_FIXTURES__ === "string" && window.__DWG_DATA_FIXTURES__.trim()) {
    const segment = window.__DWG_DATA_FIXTURES__.trim().replace(/\/?$/, "/");
    return new URL(segment, window.location.href).href;
  }
  if (window.location.pathname.includes("/dashboard")) {
    return new URL("../data/fixtures/", window.location.href).href;
  }
  return new URL("./data/fixtures/", window.location.href).href;
}

async function loadJson(filename) {
  const url = new URL(filename, fixturesBaseHref());
  const res = await fetch(url.href, { cache: "no-store" });
  if (!res.ok) throw new Error(`${filename}: HTTP ${res.status}`);
  return res.json();
}

function fmtMeta(meta) {
  const gen = meta.generated_at_utc || "?";
  const days = meta.window_days ?? "?";
  return `Stand (UTC): ${gen} — Fenster: ${days} Tage — Schema ${meta.schema_version || "?"}`;
}

function fmtMetricsSnippet(metrics) {
  const tags = metrics.tag_counts || {};
  const parts = Object.entries(tags).map(([k, v]) => `${k}: ${v}`);
  return parts.length ? parts.join(" · ") : "(keine Tag-Zähler im Fixture)";
}

async function main() {
  const metaLine = document.getElementById("meta-line");
  const metricsLine = document.getElementById("metrics-line");
  const list = document.getElementById("article-list");

  try {
    const [meta, articlesRecent, metrics] = await Promise.all([
      loadJson("meta.json"),
      loadJson("articles_recent.json"),
      loadJson("metrics_7d.json"),
    ]);

    metaLine.textContent = fmtMeta(meta);
    metricsLine.textContent = fmtMetricsSnippet(metrics);

    list.innerHTML = "";
    for (const a of articlesRecent.articles || []) {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = a.url;
      link.textContent = a.title;
      link.rel = "noopener noreferrer";
      link.target = "_blank";
      li.appendChild(link);
      const sub = document.createElement("span");
      sub.className = "muted";
      sub.textContent = ` — ${a.source_id}, ${a.published_at}`;
      li.appendChild(sub);
      list.appendChild(li);
    }
  } catch (e) {
    metaLine.textContent = `Daten konnten nicht geladen werden (${e.message}).`;
    metricsLine.textContent = "";
    list.innerHTML = "";
  }
}

main();
