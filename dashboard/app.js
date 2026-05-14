/**
 * Lädt meta.json, articles_recent.json, metrics_7d.json und zeigt Diagramme (Plotly).
 */

function siteBaseDirHref() {
  const { origin, pathname } = window.location;
  if (pathname.endsWith("/")) {
    return origin + pathname;
  }
  if (/\.html$/i.test(pathname)) {
    const dir = pathname.replace(/[^/]+$/, "");
    return origin + dir;
  }
  return origin + pathname + "/";
}

/** Optional ?demo=slug loads frozen JSON from data/fixtures/demo/<slug>/ (Zeitreise). */
function readDemoSlug() {
  const raw = new URLSearchParams(window.location.search).get("demo");
  if (!raw) return null;
  const s = raw.trim();
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/i.test(s)) return null;
  return s;
}

function fixturesBaseHref() {
  let base;
  if (typeof window.__DWG_DATA_FIXTURES__ === "string" && window.__DWG_DATA_FIXTURES__.trim()) {
    const segment = window.__DWG_DATA_FIXTURES__.trim().replace(/\/?$/, "/");
    base = new URL(segment, window.location.href).href;
  } else if (window.location.pathname.includes("/dashboard")) {
    base = new URL("../data/fixtures/", window.location.href).href;
  } else {
    base = new URL("data/fixtures/", siteBaseDirHref()).href;
  }
  const demo = readDemoSlug();
  if (demo) {
    return new URL(`demo/${demo}/`, base).href;
  }
  return base;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Klickbare Demo-URLs relativ zur aktuellen GitHub-Pages-Adresse. */
function fillZeitreiseExamples() {
  const el = document.getElementById("zeitreise-example-links");
  if (!el) return;
  try {
    el.innerHTML = "";
    const demos = [
      ["oberrhein-april-2023", "April 2023 (Oberrheingraben / Studienlage)"],
      ["oberrhein-november-2023", "November 2023 (Landau / LEOP)"],
    ];
    for (const [slug, label] of demos) {
      const u = new URL(window.location.href);
      u.searchParams.set("demo", slug);
      const p = document.createElement("p");
      p.style.margin = "0.25rem 0 0";
      const a = document.createElement("a");
      a.href = u.href;
      a.textContent = `${label} — ${u.pathname}${u.search}`;
      p.appendChild(a);
      el.appendChild(p);
    }
    const note = document.createElement("p");
    note.className = "muted";
    note.style.marginTop = "0.65rem";
    note.textContent =
      "Erwartung: gelber Demo-Kasten unter der Überschrift und deutlich mehr Einträge unter „Letzte Artikel“ als bei Live-Daten.";
    el.appendChild(note);
  } catch (_) {
    el.textContent =
      "Parameter an die Adresse anhängen: ?demo=oberrhein-april-2023 oder ?demo=oberrhein-november-2023";
  }
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
  let line = `Stand (UTC): ${gen} — Fenster: ${days} Tage — Schema ${meta.schema_version || "?"}`;
  const feeds = meta.feeds_ok;
  if (typeof feeds === "number") {
    line += `\nRSS-Feeds (konfiguriert): ${feeds}`;
  }
  if (meta.demo_mode && meta.demo_period_label) {
    line += `\nZeitreise (Demo): ${meta.demo_period_label}`;
  }
  return line;
}

/** Wenige Treffer sind bei einem engen Thema üblich — Hinweis nur Live-Daten. */
function applySparseHint(articleCount, meta) {
  const el = document.getElementById("sparse-hint");
  if (!el) return;
  const demo = meta && meta.demo_mode;
  el.hidden = !!(demo || articleCount > 3);
}

function applyDemoBanner(meta) {
  const el = document.getElementById("demo-banner");
  if (!el) return;
  if (meta.demo_mode && meta.demo_period_label) {
    el.hidden = false;
    const note = meta.demo_note ? `${escapeHtml(meta.demo_note)} ` : "";
    el.innerHTML =
      `<p class="demo-banner__title"><strong>Zeitreise (Demo)</strong> — ${escapeHtml(meta.demo_period_label)}</p>` +
      `<p class="demo-banner__note muted">${note}<a href="./">Zurück zu Live-Daten</a></p>`;
  } else {
    el.hidden = true;
    el.innerHTML = "";
  }
}

function fmtMetricsSnippet(metrics, articleCount) {
  const tags = metrics.tag_counts || {};
  const parts = Object.entries(tags).map(([k, v]) => `${k}: ${v}`);
  const tagStr = parts.length ? parts.join(" · ") : "Themen-Tags: keine Regeltreffer";
  const n = typeof articleCount === "number" ? articleCount : "?";
  return `Treffer im Fenster: ${n} — ${tagStr}`;
}

const CATEGORY_DE = {
  national: "National",
  regional: "Regional",
  broadcast: "Öffentlich-rechtlich",
  eu_agency: "EU / Fach",
  unknown: "Sonstige",
};

const plotlyBaseLayout = {
  paper_bgcolor: "#f8fafc",
  plot_bgcolor: "#f1f5f9",
  font: { family: "system-ui, Segoe UI, Roboto, sans-serif", size: 13, color: "#0f172a" },
  margin: { l: 48, r: 24, t: 44, b: 56 },
  showlegend: false,
};

const plotlyConfig = { responsive: true, displayModeBar: false };

function purgeOrClear(el) {
  if (!el) return;
  if (typeof Plotly !== "undefined") {
    Plotly.purge(el);
  }
  el.innerHTML = "";
}

function renderCharts(metrics) {
  const volumeEl = document.getElementById("chart-volume");
  const sourcesEl = document.getElementById("chart-sources");
  const tagsEl = document.getElementById("chart-tags");
  [volumeEl, sourcesEl, tagsEl].forEach(purgeOrClear);

  if (typeof Plotly === "undefined") {
    volumeEl.innerHTML = '<p class="muted">Diagrammbibliothek nicht geladen.</p>';
    return;
  }

  const daily = metrics.articles_per_day || {};
  const dates = Object.keys(daily).sort();
  const counts = dates.map((d) => daily[d]);

  if (dates.length === 0) {
    volumeEl.innerHTML = '<p class="muted">Keine Treffer nach Datum — noch keine Artikel im Fenster.</p>';
  } else {
    Plotly.newPlot(
      volumeEl,
      [
        {
          type: "scatter",
          mode: "lines+markers",
          x: dates,
          y: counts,
          line: { color: "#0284c7", width: 3, shape: "linear" },
          marker: { color: "#0ea5e9", size: 10, line: { color: "#ffffff", width: 2 } },
          hovertemplate: "%{x}<br>Anzahl: %{y}<extra></extra>",
          connectgaps: false,
        },
      ],
      {
        ...plotlyBaseLayout,
        title: { text: "Treffer pro Kalendertag (Verlauf)", font: { size: 15 } },
        xaxis: { title: "Datum (UTC)", tickangle: dates.length > 5 ? -35 : 0 },
        yaxis: { title: "Artikel", rangemode: "tozero", dtick: 1 },
      },
      plotlyConfig,
    );
  }

  const srcRaw = metrics.by_source_category || {};
  const srcKeys = Object.keys(srcRaw).sort((a, b) => srcRaw[b] - srcRaw[a]);
  if (srcKeys.length === 0) {
    sourcesEl.innerHTML = '<p class="muted">Kein Quellenmix — keine Treffer.</p>';
  } else {
    const labels = srcKeys.map((k) => CATEGORY_DE[k] || k);
    const values = srcKeys.map((k) => srcRaw[k]);
    Plotly.newPlot(
      sourcesEl,
      [
        {
          type: "bar",
          orientation: "h",
          y: labels,
          x: values,
          marker: { color: "#059669" },
          hovertemplate: "%{y}: %{x}<extra></extra>",
        },
      ],
      {
        ...plotlyBaseLayout,
        title: { text: "Treffer nach Feed-Kategorie", font: { size: 15 } },
        xaxis: { title: "Anzahl", rangemode: "tozero", dtick: 1 },
        yaxis: { automargin: true },
        margin: { ...plotlyBaseLayout.margin, l: 140 },
      },
      plotlyConfig,
    );
  }

  const tagRaw = metrics.tag_counts || {};
  const tagKeys = Object.keys(tagRaw).sort((a, b) => tagRaw[b] - tagRaw[a]);
  if (tagKeys.length === 0) {
    tagsEl.innerHTML = '<p class="muted">Keine Themen-Tags — Regeln haben nicht gematcht.</p>';
  } else {
    const tlabels = tagKeys;
    const tvals = tagKeys.map((k) => tagRaw[k]);
    Plotly.newPlot(
      tagsEl,
      [
        {
          type: "bar",
          orientation: "h",
          y: tlabels,
          x: tvals,
          marker: { color: "#8b5cf6" },
          hovertemplate: "%{y}: %{x}<extra></extra>",
        },
      ],
      {
        ...plotlyBaseLayout,
        title: { text: "Themen-Tags (Heuristik)", font: { size: 15 } },
        xaxis: { title: "Anzahl", rangemode: "tozero", dtick: 1 },
        yaxis: { automargin: true },
        margin: { ...plotlyBaseLayout.margin, l: 100 },
      },
      plotlyConfig,
    );
  }
}

async function main() {
  fillZeitreiseExamples();
  const metaLine = document.getElementById("meta-line");
  const metricsLine = document.getElementById("metrics-line");
  const list = document.getElementById("article-list");

  try {
    const [meta, articlesRecent, metrics] = await Promise.all([
      loadJson("meta.json"),
      loadJson("articles_recent.json"),
      loadJson("metrics_7d.json"),
    ]);

    const ac = (articlesRecent.articles || []).length;
    metaLine.textContent = fmtMeta(meta);
    metaLine.style.whiteSpace = "pre-line";
    applyDemoBanner(meta);
    applySparseHint(ac, meta);
    metricsLine.textContent = fmtMetricsSnippet(metrics, ac);

    renderCharts(metrics);

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
    metaLine.style.whiteSpace = "";
    applyDemoBanner({});
    applySparseHint(999, {});
    metricsLine.textContent = "";
    list.innerHTML = "";
    ["chart-volume", "chart-sources", "chart-tags"].forEach((id) => {
      const el = document.getElementById(id);
      purgeOrClear(el);
      if (el) el.innerHTML = "";
    });
  }
}

main();
