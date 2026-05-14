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

function fixturesBaseHref() {
  if (typeof window.__DWG_DATA_FIXTURES__ === "string" && window.__DWG_DATA_FIXTURES__.trim()) {
    const segment = window.__DWG_DATA_FIXTURES__.trim().replace(/\/?$/, "/");
    return new URL(segment, window.location.href).href;
  }
  if (window.location.pathname.includes("/dashboard")) {
    return new URL("../data/fixtures/", window.location.href).href;
  }
  return new URL("data/fixtures/", siteBaseDirHref()).href;
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
  paper_bgcolor: "#ffffff",
  plot_bgcolor: "#fafbfc",
  font: { family: "system-ui, Segoe UI, Roboto, sans-serif", size: 13, color: "#1a1a1a" },
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
          type: "bar",
          x: dates,
          y: counts,
          marker: { color: "#2563eb", line: { width: 0 } },
          hovertemplate: "%{x}<br>Anzahl: %{y}<extra></extra>",
        },
      ],
      {
        ...plotlyBaseLayout,
        title: { text: "Treffer pro Kalendertag", font: { size: 15 } },
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
          marker: { color: "#0d9488" },
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
          marker: { color: "#7c3aed" },
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
