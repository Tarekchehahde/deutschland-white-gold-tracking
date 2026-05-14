/**
 * Lädt bundle_7d JSON (gleiche Origin auf gh-pages: ../data/ oder /data/).
 */
const DATA_URL = "data/fixtures/bundle_7d.example.json";

function fmtMeta(meta) {
  const gen = meta.generated_at_utc || "?";
  const days = meta.window_days ?? "?";
  return `Stand (UTC): ${gen} — Fenster: ${days} Tage — Schema ${meta.schema_version || "?"}`;
}

async function main() {
  const metaLine = document.getElementById("meta-line");
  const list = document.getElementById("article-list");

  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const bundle = await res.json();

    metaLine.textContent = fmtMeta(bundle.meta);

    list.innerHTML = "";
    for (const a of bundle.articles || []) {
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
    list.innerHTML = "";
  }
}

main();
