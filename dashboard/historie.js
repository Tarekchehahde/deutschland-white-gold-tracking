/**
 * Historie: lädt data/archive/summary.json — Monatsaggregat + Liste neuester Archiv-Artikel.
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

function archiveBaseHref() {
  return new URL("data/archive/", siteBaseDirHref()).href;
}

async function loadSummary() {
  const url = new URL("summary.json", archiveBaseHref());
  const res = await fetch(url.href, { cache: "no-store" });
  if (!res.ok) throw new Error(`summary.json: HTTP ${res.status}`);
  return res.json();
}

const plotlyBaseLayout = {
  paper_bgcolor: "#ffffff",
  plot_bgcolor: "#fafbfc",
  font: { family: "system-ui, Segoe UI, Roboto, sans-serif", size: 13, color: "#1a1a1a" },
  margin: { l: 48, r: 24, t: 44, b: 72 },
  showlegend: false,
};

const plotlyConfig = { responsive: true, displayModeBar: false };

function renderMonthChart(containerEl, articlesPerMonth) {
  if (!containerEl || typeof Plotly === "undefined") {
    if (containerEl) containerEl.innerHTML = '<p class="muted">Diagrammbibliothek nicht geladen.</p>';
    return;
  }
  const months = Object.keys(articlesPerMonth || {}).sort();
  const counts = months.map((m) => articlesPerMonth[m]);

  if (months.length === 0) {
    containerEl.innerHTML =
      '<p class="muted">Noch keine Archiv-Treffer — nach den ersten Ingest-Läufen füllt sich die Historie.</p>';
    return;
  }

  Plotly.newPlot(
    containerEl,
    [
      {
        type: "scatter",
        mode: "lines+markers",
        x: months,
        y: counts,
        line: { color: "#0369a1", width: 2.5 },
        marker: { color: "#0369a1", size: 9, line: { color: "#ffffff", width: 1.5 } },
        hovertemplate: "%{x}<br>Artikel: %{y}<extra></extra>",
      },
    ],
    {
      ...plotlyBaseLayout,
      title: { text: "Archiv: Treffer pro Monat (Erscheinungsdatum UTC)", font: { size: 15 } },
      xaxis: { title: "Monat", tickangle: months.length > 8 ? -45 : 0 },
      yaxis: { title: "Artikel", rangemode: "tozero", dtick: 1 },
    },
    plotlyConfig,
  );
}

async function main() {
  const metaEl = document.getElementById("historie-meta");
  const listEl = document.getElementById("historie-article-list");
  const chartEl = document.getElementById("chart-archive-months");

  try {
    const summary = await loadSummary();
    const gen = summary.generated_at_utc || "?";
    const total = summary.total_in_archive ?? "?";
    const cap = summary.archive_article_cap ?? "?";
    metaEl.textContent = `Stand Archiv (UTC): ${gen} — Einträge gesamt: ${total} (Obergrenze ${cap}) — Schema ${summary.schema_version || "?"}`;

    renderMonthChart(chartEl, summary.articles_per_month);

    listEl.innerHTML = "";
    const recent = summary.recent_for_ui || [];
    if (recent.length === 0) {
      const li = document.createElement("li");
      li.className = "muted";
      li.textContent = "Noch keine Artikel im Archiv.";
      listEl.appendChild(li);
      return;
    }
    for (const a of recent) {
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
      listEl.appendChild(li);
    }
  } catch (e) {
    metaEl.textContent = `Archiv konnte nicht geladen werden (${e.message}).`;
    listEl.innerHTML = "";
    if (chartEl) chartEl.innerHTML = "";
  }
}

main();
