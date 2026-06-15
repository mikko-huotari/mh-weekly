// ----------------------------------------------------------------------------
// MH@MERICS Weekly Update — archive renderer
// Tabs:  I. Highlights · II. Research · III. International sources
// Hash format:
//   #W19-2026                  -> default tab (highlights)
//   #W19-2026/highlights
//   #W19-2026/research
//   #W19-2026/{econ|domestic|tech|trade|foreign|responses}  -> intl tab + sub
// ----------------------------------------------------------------------------

(function () {
  "use strict";

  // Discover weeks dynamically — every window.W<NN>_<YYYY> global counts.
  // Adding a new week now means dropping the data file + registering in
  // data/manifest.json, no edits here or in index.html.
  const WEEKS = (function () {
    const pat = /^W(\d+)_(\d{4})$/;
    const out = [];
    for (const key in window) {
      if (!pat.test(key)) continue;
      const w = window[key];
      if (w && typeof w === "object" && w.id) out.push(w);
    }
    return out.sort((a, b) => (b.year - a.year) || (b.week - a.week));
  })();

  if (!WEEKS.length) { console.error("No week data loaded."); return; }

  // -------- tag vocabulary (online-only) -----------------------------------
  // window.TAGS comes from data/tags.js — { version, groups: [...], tags: [...] }
  const TAG_LOOKUP = (() => {
    const m = new Map();
    ((window.TAGS && window.TAGS.tags) || []).forEach(t => m.set(t.id, t));
    return m;
  })();
  // Stable order from the curated vocabulary (geo → sectors → domestic → ...).
  // Used to sort the filter bar so chips appear in a meaningful sequence
  // rather than jumping around by frequency.
  const TAG_ORDER = new Map(
    ((window.TAGS && window.TAGS.tags) || []).map((t, i) => [t.id, i])
  );
  // Per-tab filter state. Cleared whenever the tab or week changes.
  const activeFilters = new Set();
  let filterExpanded = false;
  let lastTabKey = null; // "weekId|tab"

  // -------- tabs definition -------------------------------------------------
  const TABS = [
    { id: "highlights", num: "I",   label: "Highlights",       short: "Highlights" },
    { id: "research",   num: "II",  label: "MERICS",           short: "MERICS" },
    { id: "intl",       num: "III", label: "International",    short: "Intl." },
    { id: "cnsources",  num: "IV",  label: "Chinese Sources",  short: "CN Sources" },
    { id: "lens",       num: "V",   label: "German lens",      short: "GER Lens" },
  ];
  const SUB_ORDER = ["econ", "domestic", "tech", "trade", "foreign", "responses"];
  const SUB_LABELS = {
    econ:      "Econ",
    domestic:  "Politics",
    tech:      "Geoecon · Tech",
    trade:     "Geoecon · Trade",
    foreign:   "Foreign",
    responses: "Responses",
  };
  // Chinese Sources sub-chips (Part IV) — one per CN-Sources slot.
  const CN_SUB_ORDER = ["cn-authoritative", "cn-regulatory", "cn-journalism", "cn-mfa", "cn-thinktanks", "cn-media"];
  const CN_SUB_LABELS = {
    "cn-authoritative": "Authoritative",
    "cn-regulatory":    "Regulatory",
    "cn-journalism":    "CN journalism",
    "cn-mfa":           "Positions",
    "cn-thinktanks":    "Thinking",
    "cn-media":         "CN coverage EU/GER",
  };
  // Wochenbericht sub-chips (German Lens tab)
  const LENS_SUB_ORDER = ["quotes", "facts", "themes"];
  const LENS_SUB_LABELS = { quotes: "Zitate", facts: "Fakten", themes: "Themen" };
  const ALL_SUBS = [...SUB_ORDER, ...CN_SUB_ORDER, ...LENS_SUB_ORDER];

  // -------- helpers ---------------------------------------------------------
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  // Typographic curly quotes (operate on the already-HTML-escaped string,
  // so we replace `&quot;` and `&#39;` entities, not raw ASCII quotes).
  // Double-quote `"` alternates open/close; apostrophe always becomes right
  // single quote. State is per-call so paragraphs don't bleed polarity.
  const curlify = (s) => {
    let open = true;
    return s
      .replace(/&#39;/g, "’")
      .replace(/&quot;/g, () => { const ch = open ? "“" : "”"; open = !open; return ch; });
  };
  // HTML-escape then convert minimal inline Markdown (`**bold**`, `*italic*`,
  // `[text](url)`) for note-style entries that carry source-side formatting.
  // STRIP HTML comments FIRST — they're MH-internal curation notes (e.g.
  // <!-- pub date not set in Dynamics -->) and must never reach readers.
  const inlineMd = (s) => curlify(esc((s || "").replace(/<!--[\s\S]*?-->/g, "")))
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
             '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, "$1<em>$2</em>");
  const fmtDate = (d) => {
    if (typeof d !== "string") return "";
    const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return d;
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${parseInt(m[3],10)} ${months[parseInt(m[2],10)-1]} ${m[1]}`;
  };
  // Slugify a label so it survives the URL & DOM-id round trip.
  const slugify = (s) => String(s).toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  // Build the MERICS chip list — one chip per group across all research
  // sections, plus Top Charts. Section-level chips are skipped because the
  // section header ("MERICS research and (media) insights") is shared across
  // all groups beneath it.
  function mericsChips(w) {
    const chips = [];
    (w.researchSections || []).forEach(sec => {
      (sec.groups || []).forEach(g => {
        chips.push({ sub: "mr-" + slugify(g.label), label: g.label });
      });
    });
    if (w.topCharts && w.topCharts.length) {
      chips.push({ sub: "mr-top-charts", label: `Top charts and visuals W${w.week}` });
    }
    return chips;
  }

  // Build the Highlights chip list dynamically from the week's content.
  // The Spotlight section is its own chip; each context section gets one chip
  // (e.g. "German China policy in context"), not its inner sub-groups.
  function highlightsChips(w) {
    const chips = [];
    const spots = spotlightsOf(w);
    spots.forEach((s, i) => {
      // Show a short topic in the chip, e.g. "Spotlight 1: Putin-Xi summit".
      let topic = (s.title || "").replace(/^\s*Spotlight\s*\d*\s*:?\s*/i, "").split(/\s+[–—-]\s+/)[0].trim();
      let acc = "";
      for (const w of topic.split(/\s+/)) { if ((acc + " " + w).trim().length > 18) break; acc = (acc + " " + w).trim(); }
      acc = acc.replace(/\s+(in|the|of|at|on|and)$/i, "");
      // Single spotlight: just "Spotlight" (front-truncating one long title is
      // meaningless). Multi-spotlight weeks keep a short topic to disambiguate.
      const single = spots.length === 1;
      const n = single ? "Spotlight" : `Spotlight ${i + 1}`;
      chips.push({
        sub: i === 0 ? "hl-spotlight" : `hl-spotlight-${i + 1}`,
        label: s.short || ((!single && acc) ? `${n}: ${acc}` : n),
      });
    });
    (w.contextSections || []).forEach(sec => {
      chips.push({ sub: "hl-" + slugify(sec.label), label: sec.short || sec.label });
    });
    return chips;
  }
  // All spotlights for a week — new builds carry `spotlights[]`; older data
  // files only have a single `spotlight`, so fall back to wrapping it.
  function spotlightsOf(w) {
    return w.spotlights || (w.spotlight ? [w.spotlight] : []);
  }

  // Render the row of clickable tag chips beneath an entry. Only tags in the
  // controlled vocabulary render; unknown ids are silently dropped.
  function renderEntryTags(tags) {
    if (!tags || !tags.length) return "";
    const chips = tags
      .filter(id => TAG_LOOKUP.has(id))
      .map(id => {
        const t = TAG_LOOKUP.get(id);
        const active = activeFilters.has(id) ? "is-active" : "";
        return `<button type="button" class="tag-chip ${active}" data-tag="${esc(id)}">${esc(t.label)}</button>`;
      }).join("");
    return chips ? `<div class="entry-tags">${chips}</div>` : "";
  }

  // -------- entry render ----------------------------------------------------
  function renderEntry(e) {
    const url = e.url || "#";
    const date = fmtDate(e.date);
    const badge = (window.outletBadge ? window.outletBadge(e.outlet || "") : "");

    const meta = `
        <div class="entry-meta">
          ${badge}
          <span class="entry-outlet">${esc(e.outlet || "")}</span>
          ${e.author ? `<span class="entry-sep">&middot;</span><span class="entry-author">${esc(e.author)}</span>` : ""}
          ${date ? `<span class="entry-sep">&middot;</span><span class="entry-date">${esc(date)}</span>` : ""}
        </div>`;

    const tagsHtml = renderEntryTags(e.tags);

    // Compact note style \u2014 used for the brief context items that mirror the
    // PDF's one-line "ticker" entries (German Lens etc). Spotlight bullets and
    // similar note items without an outlet/date skip the meta line entirely.
    if (e.note) {
      const hasMeta = (e.outlet && e.outlet.trim()) || date;
      return `<article class="entry entry-note">${hasMeta ? meta : ""}<p class="entry-note-text">${inlineMd(e.note)}</p>${tagsHtml}</article>`;
    }

    const titleInner = e.title
      ? `<a class="entry-title-link" href="${esc(url)}" target="_blank" rel="noopener">${esc(e.title)}<span class="arrow"> \u2192</span></a>`
      : "";

    const head = `
      <header class="entry-head">
        ${meta}
        ${titleInner ? `<h3 class="entry-title">${titleInner}</h3>` : ""}
      </header>`;

    const bullets = (e.bullets || [])
      .filter(b => b && (b[0] || b[1]))
      .map(b => {
        const lead = b[0] ? `<b>${esc(b[0])}</b>` : "";
        // BULLET_RE drops the "**lead**: rest" colon as a delimiter — re-insert it
        // so the bold lead-in is clearly separated from the sentence.
        const rest = b[1] ? `${b[0] ? ": " : ""}${inlineMd(b[1])}` : "";
        return `<li>${lead}${rest}</li>`;
      }).join("");

    const related = (e.related || []).filter(r => r && r.url);
    const relHtml = related.length
      ? `<div class="entry-related"><span class="rel-label">Related</span> ${related.map(r =>
          `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.text)}</a>`
        ).join(' <span class="rel-sep">·</span> ')}</div>`
      : "";
    const linkOnly = !bullets && !relHtml;
    const cls = linkOnly ? "entry entry-link-only" : "entry";
    return `<article class="${cls}">${head}${bullets ? `<ul class="bullets">${bullets}</ul>` : ""}${relHtml}${tagsHtml}</article>`;
  }

  // Does an entry pass the current filter set? OR-semantics; entries with no
  // tags are hidden when any filter is active.
  function entryPassesFilter(e) {
    if (activeFilters.size === 0) return true;
    const tags = e.tags || [];
    if (!tags.length) return false;
    for (const t of tags) if (activeFilters.has(t)) return true;
    return false;
  }

  // Walk every entry visible in (tab) and return { entries, tagCounts }.
  function entriesForTab(week, tab) {
    const out = [];
    function pushItems(items) { (items || []).forEach(it => out.push(it)); }
    if (tab === "highlights") {
      spotlightsOf(week).forEach(s => pushItems(s.items));
      (week.contextSections || []).forEach(sec => {
        pushItems(sec.items);
        (sec.groups || []).forEach(g => pushItems(g.items));
      });
    } else if (tab === "research") {
      (week.researchSections || []).forEach(sec => {
        pushItems(sec.items);
        (sec.groups || []).forEach(g => pushItems(g.items));
      });
    } else if (tab === "intl") {
      (week.numberedSections || []).forEach(sec => pushItems(sec.items));
    } else if (tab === "cnsources") {
      (week.chineseSourcesSections || []).forEach(sec => pushItems(sec.items));
    }
    const counts = new Map();
    out.forEach(e => (e.tags || []).forEach(t => {
      if (!TAG_LOOKUP.has(t)) return;
      counts.set(t, (counts.get(t) || 0) + 1);
    }));
    return { entries: out, counts };
  }

  // Filter helper used by block renderers — applies activeFilters to a list.
  const filtered = (items) => (items || []).filter(entryPassesFilter);

  // -------- block renderers -------------------------------------------------
  // Spotlight items come in two shapes:
  //  - note-style commentary (W20 style): render as a real bulleted list.
  //  - byline items with outlet/title/bullets (W19 style): render through
  //    the regular entry-card pipeline so the outlet badge, title link and
  //    bullets all show.
  function renderSpotlightItems(items) {
    const list = (items || []).filter(it => it);
    if (!list.length) return "";
    const allNotes = list.every(it => it.note && !it.title && !it.bullets);
    if (allNotes) {
      const lis = list.map(it => `<li>${inlineMd(it.note)}</li>`).join("");
      return `<ul class="spotlight-bullets">${lis}</ul>`;
    }
    return list.map(renderEntry).join("");
  }
  function renderSpotlightTable(t) {
    if (!t || !(t.rows || []).length) return "";
    const head = (t.headers || []).map(h => `<th>${inlineMd(h)}</th>`).join("");
    const body = t.rows.map(r => `<tr>${r.map(c => `<td>${inlineMd(c)}</td>`).join("")}</tr>`).join("");
    // 2-column tables are typically numeric (label + value); 3+ columns are prose.
    const cls = (t.headers || []).length <= 2 ? "spotlight-table numeric" : "spotlight-table";
    return `<table class="${cls}"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
  }
  function renderSpotlight(s, idx = 0) {
    if (!s) return "";
    const items = filtered(s.items);
    const subs = (s.subsections || []).map(sub => {
      const subItems = filtered(sub.items || []);
      if (!subItems.length && !(sub.intro || "").trim() && !sub.table && activeFilters.size) return "";
      return `
      <div class="spotlight-sub">
        <h3 class="spotlight-sub-h">${curlify(esc(sub.label))}</h3>
        ${sub.intro ? sub.intro.split(/\n{2,}/).map(p => `<p class="section-intro">${inlineMd(p)}</p>`).join("") : ""}
        ${renderSpotlightItems(subItems)}
        ${renderSpotlightTable(sub.table)}
      </div>`;
    }).join("");
    if (!items.length && !subs.trim() && !s.table && activeFilters.size) return "";
    return `
      <section class="section" id="${idx === 0 ? "hl-spotlight" : `hl-spotlight-${idx + 1}`}">
        <header class="section-h">
          <h2 class="label">${curlify(esc(s.title || "Spotlight"))}</h2>
        </header>
        ${s.intro ? s.intro.split(/\n{2,}/).map(p => `<p class="section-intro">${inlineMd(p)}</p>`).join("") : ""}
        ${renderSpotlightItems(items)}
        ${renderSpotlightTable(s.table)}
        ${subs}
      </section>`;
  }
  function renderContext(sec) {
    const groups = (sec.groups || []).map(g => {
      const items = filtered(g.items);
      if (!items.length) return "";
      const label = (g.label || "").trim();
      // German China policy items are one-line notes — render as a bulleted
      // list. Any richer entries (with title) still fall back to renderEntry.
      const notes = items.filter(it => it.note);
      const rich  = items.filter(it => !it.note);
      const list = notes.length
        ? `<ul class="context-list">${notes.map(it => `<li>${inlineMd(it.note)}</li>`).join("")}</ul>`
        : "";
      return `
      <div class="group">
        ${label ? `<h3 class="group-label">${esc(label)}</h3>` : ""}
        ${list}${rich.map(renderEntry).join("")}
      </div>`;
    }).join("");
    if (!groups.trim() && activeFilters.size) return "";
    return `
      <section class="section" id="hl-${esc(slugify(sec.label))}">
        <header class="section-h">
          <h2 class="label">${curlify(esc(sec.label))}</h2>
        </header>
        ${sec.note ? `<p class="section-note">${esc(sec.note)}</p>` : ""}
        ${groups}
      </section>`;
  }
  // Compact one-line research/insights row: [icon] [outlet link] — mini info.
  // bullets[0] already carries "[outlet](url): title", so we render it inline
  // (no separate outlet header = no duplication) and keep only sub-bullets that
  // are themselves links (e.g. China Tech Observatory's component pieces).
  function renderResearchItem(e) {
    const badge = window.outletBadge ? window.outletBadge(e.outlet || "") : "";
    const bl = (e.bullets || []).map(b => (b && (b[1] || b[0])) || "").filter(Boolean);
    const main = bl[0] || e.title || (e.outlet ? `[${e.outlet}](${e.url || "#"})` : "");
    const subs = bl.slice(1).filter(s => /\]\(/.test(s)); // keep only nested links
    const tagsHtml = renderEntryTags(e.tags);
    const subHtml = subs.map(s => `<li class="mr-sub">${inlineMd(s)}</li>`).join("");
    return `<li class="mr-row"><span class="mr-badge">${badge}</span>` +
           `<span class="mr-text">${inlineMd(main)}${tagsHtml}</span></li>${subHtml}`;
  }
  function renderResearch(sec) {
    const groupsHtml = (sec.groups || []).map(g => {
      const items = filtered(g.items);
      if (!items.length) return "";
      return `
      <div class="group" id="mr-${esc(slugify(g.label))}">
        <h3 class="group-label">${curlify(esc(g.label))}</h3>
        ${g.note ? `<p class="section-note">${esc(g.note)}</p>` : ""}
        <ul class="mr-list">${items.map(renderResearchItem).join("")}</ul>
      </div>`;
    }).join("");
    const items = filtered(sec.items);
    const itemsHtml = items.length ? `<ul class="mr-list">${items.map(renderResearchItem).join("")}</ul>` : "";
    if (!groupsHtml.trim() && !itemsHtml && activeFilters.size) return "";
    return `
      <section class="section">
        <header class="section-h">
          <h2 class="label">${curlify(esc(sec.label))}</h2>
        </header>
        ${sec.note ? `<p class="section-note">${esc(sec.note)}</p>` : ""}
        ${groupsHtml}
        ${itemsHtml}
      </section>`;
  }
  function renderNumbered(sec, anchorPrefix = "intl-") {
    const items = filtered(sec.items);
    if (!items.length && activeFilters.size) return "";
    const numHtml = sec.number ? `<span class="num">${esc(sec.number)}.</span>` : "";
    const anchorId = sec.slug ? `${anchorPrefix}${esc(sec.slug)}` : "";
    return `
      <section class="section" ${anchorId ? `id="${anchorId}"` : ""}>
        <header class="section-h">
          ${numHtml}
          <h2 class="label">${curlify(esc(sec.label))}</h2>
        </header>
        ${sec.note ? `<p class="section-note">${esc(sec.note)}</p>` : ""}
        ${items.map(renderEntry).join("")}
      </section>`;
  }

  // -------- Top Charts -----------------------------------------------------
  // Structured supplement table replaces the old chart.supplementHtml (raw
  // HTML sink — a typo or unsanitised paste could inject markup). Each cell
  // is escaped. Legacy supplementHtml fields are silently ignored.
  function renderSupplementTable(t) {
    if (!t || !Array.isArray(t.rows) || !t.rows.length) return "";
    const head = (t.headers || []).length
      ? `<thead><tr>${t.headers.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead>`
      : "";
    const body = `<tbody>${t.rows.map(r =>
      `<tr>${(r || []).map(c => `<td>${esc(c == null ? "" : c)}</td>`).join("")}</tr>`
    ).join("")}</tbody>`;
    return `<div class="chart-supplement"><table class="chart-table">${head}${body}</table></div>`;
  }
  function renderTopCharts(charts, w) {
    const items = charts.map((c, i) => `
      <figure class="chart">
        ${c.caption ? `<figcaption class="chart-caption">${inlineMd(c.caption)}</figcaption>` : ""}
        <img src="${esc(c.src)}" alt="${esc(c.alt || ('Top Chart ' + (i+1)))}" loading="eager" />
        ${renderSupplementTable(c.supplementTable)}
      </figure>
    `).join("");
    return `
      <section class="section" id="mr-top-charts">
        <header class="section-h">
          <h2 class="label">Top charts and visuals W${w.week}</h2>
        </header>
        <div class="charts-grid">${items}</div>
      </section>`;
  }

  // -------- Wochenbericht --------------------------------------------------
  function renderWBSection(sec) {
    const items = (sec.items || []).map(item =>
      item.kind === "theme" ? renderWBTheme(item) : renderWBItem(item)
    ).join("");
    return `
      <section class="section" id="lens-${esc(sec.slug)}">
        <header class="section-h">
          ${sec.number ? `<span class="num">${esc(sec.number)}.</span>` : ""}
          <h2 class="label">${curlify(esc(sec.label))}</h2>
        </header>
        ${items}
      </section>`;
  }
  function renderWBItem(item) {
    const src = item.source || {};
    const badge = window.outletBadge ? window.outletBadge(src.outlet) : "";
    const date = fmtDate(src.date);
    const display = src.outletDisplay || src.outlet || "";
    return `<article class="entry wb-item">
      <div class="entry-meta">
        ${badge}
        <span class="entry-outlet">${esc(display)}</span>
        ${date ? `<span class="entry-sep">&middot;</span><span class="entry-date">${esc(date)}</span>` : ""}
      </div>
      <p class="wb-text">${(() => {
        let lead = (item.lead || "").trim();
        let text = item.text || "";
        // If the lead ends with "(verb/role)", the bracket content is sentence
        // material — unwrap it and move it to the start of the body so the
        // bold stays just the name and the sentence reads correctly.
        const m = lead.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
        if (m) {
          lead = m[1].trim();
          text = (m[2].trim() + " " + text).trim();
        }
        // Facts read "Thesis: detail" (colon); quotes read "Name verb …" (space).
        const sep = (item.kind === "fact" && lead) ? ": " : " ";
        return `<strong>${esc(lead)}</strong>${sep}${esc(text)}`;
      })()}</p>
      ${src.title ? `<p class="wb-source">“${esc(src.title)}”</p>` : ""}
    </article>`;
  }
  function renderWBTheme(item) {
    const sources = (item.sources || []).map(s => {
      const date = fmtDate(s.date);
      const badge = window.outletBadge ? window.outletBadge(s.outlet) : "";
      return `<li class="wb-theme-source">
        ${badge}
        <span class="wb-theme-source-meta">${esc(s.outletDisplay || s.outlet || "")}${date ? ` <span class="entry-sep">&middot;</span> ${esc(date)}` : ""}</span>
        <span class="wb-theme-source-title">“${esc(s.title || "")}”</span>
      </li>`;
    }).join("");
    return `<article class="wb-theme">
      <h3 class="wb-theme-title">${esc(item.title || "")}</h3>
      <p class="wb-theme-text">${esc(item.text || "")}</p>
      <div class="wb-theme-prom">Prominente Quellen</div>
      <ul class="wb-theme-sources">${sources}</ul>
    </article>`;
  }

  // -------- tab-aware view --------------------------------------------------
  function viewForTab(w, tab, sub) {
    if (tab === "highlights") {
      const parts = [];
      spotlightsOf(w).forEach((s, i) => parts.push(renderSpotlight(s, i)));
      (w.contextSections || []).forEach(s => parts.push(renderContext(s)));
      return parts.join("") || empty("Nothing in the highlights this week.");
    }
    if (tab === "research") {
      const parts = (w.researchSections || []).map(renderResearch);
      if (w.topCharts && w.topCharts.length) parts.push(renderTopCharts(w.topCharts, w));
      return parts.join("") || empty("No MERICS research entries in this issue.");
    }
    if (tab === "intl") {
      // NB: arrow wrapper — bare .map(renderNumbered) would pass the array index
      // as anchorPrefix, producing ids like "0econ" instead of "intl-econ", so
      // the sub-chip jump targets never resolve.
      const sections = (w.numberedSections || []).map(s => renderNumbered(s)).join("");
      return sections || empty("No international-sources entries in this issue.");
    }
    if (tab === "cnsources") {
      const sections = (w.chineseSourcesSections || []).map(s => renderNumbered(s, "")).join("");
      return sections || empty("No Chinese-sources entries in this issue.");
    }
    if (tab === "lens") {
      if (!w.wochenbericht) return empty("No Wochenbericht for this issue.");
      const wb = w.wochenbericht;
      const caveat = wb.caveat ? `<p class="wb-caveat">${esc(wb.caveat)}</p>` : "";
      const sections = (wb.sections || []).map(renderWBSection).join("");
      return caveat + sections;
    }
    return "";
  }
  function empty(msg) {
    return `<div class="empty-state">${esc(msg)}</div>`;
  }

  // -------- nav rendering ---------------------------------------------------
  function renderNav(w, tab, sub) {
    const primary = TABS.map(t => {
      const isActive = t.id === tab;
      const longLabel = esc(t.label);
      const shortLabel = esc(t.short || t.label);
      return `<button type="button" class="tab-btn ${isActive ? 'is-active' : ''}" data-tab="${t.id}">
        <span class="tab-num">${esc(t.num)}.</span>
        <span class="tab-label-long">${longLabel}</span><span class="tab-label-short">${shortLabel}</span>
      </button>`;
    }).join("");

    // Build sub-bar: highlights, intl and lens all use stacked sections
    // with chips acting as scroll anchors.
    let subs = "";
    if (tab === "highlights") {
      const chips = highlightsChips(w);
      subs = chips.map(c => {
        const isActive = sub === c.sub;
        return `<button type="button" class="chip ${isActive ? 'is-active' : ''}" data-sub="${esc(c.sub)}">${esc(c.label)}</button>`;
      }).join("");
    } else if (tab === "research") {
      const chips = mericsChips(w);
      subs = chips.map(c => {
        const isActive = sub === c.sub;
        return `<button type="button" class="chip ${isActive ? 'is-active' : ''}" data-sub="${esc(c.sub)}">${esc(c.label)}</button>`;
      }).join("");
    } else if (tab === "intl") {
      const bySlug = {};
      (w.numberedSections || []).forEach(s => { bySlug[s.slug] = s; });
      subs = SUB_ORDER
        .filter(id => bySlug[id])
        .map(id => {
          const sec = bySlug[id];
          const isActive = sub === id;
          const label = SUB_LABELS[id] || id;
          const numPrefix = sec.number ? `${sec.number}. ` : "";
          return `<button type="button" class="chip ${isActive ? 'is-active' : ''}" data-sub="${id}">${esc(numPrefix + label)}</button>`;
        }).join("");
    } else if (tab === "cnsources") {
      const bySlug = {};
      (w.chineseSourcesSections || []).forEach(s => { bySlug[s.slug] = s; });
      subs = CN_SUB_ORDER
        .filter(id => bySlug[id])
        .map(id => {
          const isActive = sub === id;
          const label = CN_SUB_LABELS[id] || id;
          return `<button type="button" class="chip ${isActive ? 'is-active' : ''}" data-sub="${id}">${esc(label)}</button>`;
        }).join("");
    } else if (tab === "lens") {
      const bySlug = {};
      ((w.wochenbericht && w.wochenbericht.sections) || []).forEach(s => { bySlug[s.slug] = s; });
      subs = LENS_SUB_ORDER
        .filter(id => bySlug[id])
        .map(id => {
          const sec = bySlug[id];
          const isActive = sub === id;
          const label = LENS_SUB_LABELS[id] || id;
          const numPrefix = sec.number ? `${sec.number}. ` : "";
          return `<button type="button" class="chip ${isActive ? 'is-active' : ''}" data-sub="${id}">${esc(numPrefix + label)}</button>`;
        }).join("");
    }
    const showSubs = tab === "highlights" || tab === "research" || tab === "intl" || tab === "cnsources" || tab === "lens";

    // Filter bar: tag chips for the tags present in this tab's entries.
    // The Wochenbericht ("lens") is excluded — its entries are untagged.
    // Collapsed by default. Collapsed view still shows any active chips
    // and the Clear button so the user can act without expanding.
    let filterBarHtml = "";
    if (tab !== "lens") {
      const { counts } = entriesForTab(w, tab);
      const tagList = [...counts.entries()]
        .sort((a, b) => {
          const oa = TAG_ORDER.has(a[0]) ? TAG_ORDER.get(a[0]) : 9999;
          const ob = TAG_ORDER.has(b[0]) ? TAG_ORDER.get(b[0]) : 9999;
          return oa - ob;
        });
      if (tagList.length) {
        const visible = filterExpanded
          ? tagList
          : tagList.filter(([id]) => activeFilters.has(id));
        // Insert a thin separator between groups when expanded.
        let lastGroup = null;
        const chips = visible.map(([id, n]) => {
          const meta = TAG_LOOKUP.get(id);
          if (!meta) return "";
          const active = activeFilters.has(id) ? "is-active" : "";
          let sep = "";
          if (filterExpanded && lastGroup !== null && meta.group !== lastGroup) {
            sep = `<span class="filter-group-sep" aria-hidden="true"></span>`;
          }
          lastGroup = meta.group;
          return `${sep}<button type="button" class="tag-chip ${active}" data-tag="${esc(id)}">${esc(meta.label)}<span class="tag-count">${n}</span></button>`;
        }).join("");
        const clear = activeFilters.size
          ? `<button type="button" class="filter-clear" data-clear-filters>Clear</button>`
          : "";
        const toggle = `<button type="button" class="filter-toggle ${filterExpanded ? 'is-open' : ''}" data-filter-toggle aria-expanded="${filterExpanded}">
            Filter
            ${activeFilters.size ? `<span class="filter-toggle-count">${activeFilters.size}</span>` : ""}
            <span class="filter-toggle-chev" aria-hidden="true">&#9662;</span>
          </button>`;
        filterBarHtml = `
          <div class="filter-bar is-open" role="toolbar" aria-label="Filter by tag">
            ${toggle}
            ${clear}
            ${chips}
          </div>`;
      }
    }

    return `
      <nav class="tabs" aria-label="Issue navigation">
        <div class="tabs-primary" role="tablist">${primary}</div>
        <div class="tabs-sub ${showSubs ? 'is-open' : ''}" role="tablist" aria-hidden="${!showSubs}">${subs}</div>
        ${filterBarHtml}
      </nav>`;
  }

  // -------- masthead --------------------------------------------------------
  function setMasthead(w) {
    $("#weekTitle").innerHTML = `Week <em>${w.week}</em> &middot; ${w.year}<span class="chev">&#9662;</span>`;
    const footer = $("#footerMeta");
    if (footer) {
      footer.innerHTML =
        `<span>Week ${w.week} &middot; ${esc(w.dateRange)}</span>` +
        `<span class="sep">&middot;</span>` +
        `<span>By Mikko Huotari, Mercator Institute for China Studies, Berlin</span>`;
    }
    document.title = `Week ${w.week} \u00b7 ${w.year} \u2014 MH@MERICS`;
  }

  function populateSelect() {
    const sel = $("#weekSelect");
    sel.innerHTML = WEEKS.map(w =>
      `<option value="${esc(w.id)}">Week ${w.week} · ${w.year}  —  ${esc(w.dateRange)}</option>`
    ).join("");
    sel.addEventListener("change", () => {
      // Keep current slug if compatible with new week; else reset.
      const cur = parseHash();
      writeHash(sel.value, currentSlugFor(WEEKS.find(w => w.id === sel.value), cur.slug));
    });
  }

  // -------- scrollspy ------------------------------------------------------
  // When the user scrolls inside a tab whose sub-sections are stacked,
  // update the active chip + URL based on which section is most prominent
  // at the top of the viewport. Cleaned up on every re-render.
  let scrollSpyDispose = null;
  function setupScrollSpy(tab, weekId) {
    if (scrollSpyDispose) { scrollSpyDispose(); scrollSpyDispose = null; }
    if (tab !== "highlights" && tab !== "research" && tab !== "intl" && tab !== "cnsources" && tab !== "lens") return;
    const prefix = tab === "highlights" ? "hl-" :
                   tab === "research"   ? "mr-" :
                   tab === "intl"       ? "intl-" :
                   tab === "cnsources"  ? "cn-" : "lens-";
    const sections = [...document.querySelectorAll(`[id^="${prefix}"]`)];
    if (!sections.length) return;

    const anchorToSlug = (id) => {
      if (id.startsWith("hl-") || id.startsWith("mr-") || id.startsWith("cn-")) return id;
      if (id.startsWith("intl-")) return id.slice(5);
      if (id.startsWith("lens-")) return id.slice(5);
      return id;
    };

    let lastSlug = null;
    function onScroll() {
      const topbarH = document.querySelector(".topbar")?.getBoundingClientRect().height || 56;
      const navH = $("#nav")?.getBoundingClientRect().height || 0;
      const threshold = topbarH + navH + 24;
      let active = sections[0];
      for (const sec of sections) {
        if (sec.getBoundingClientRect().top <= threshold) active = sec;
        else break;
      }
      const slug = anchorToSlug(active.id);
      if (slug === lastSlug) return;
      lastSlug = slug;
      document.querySelectorAll(".chip").forEach(c => {
        c.classList.toggle("is-active", c.dataset.sub === slug);
      });
      const newHash = `#${weekId}/${slug}`;
      if (location.hash !== newHash) history.replaceState(null, "", newHash);
    }

    let ticking = false;
    function handler() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { onScroll(); ticking = false; });
    }
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    onScroll();
    scrollSpyDispose = () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }

  // -------- hash routing ----------------------------------------------------
  function parseHash() {
    const raw = (location.hash || "").replace(/^#/, "").trim();
    if (!raw) return { weekId: WEEKS[0].id, slug: "highlights" };
    const parts = raw.split("/").map(s => s.trim()).filter(Boolean);
    const weekId = WEEKS.some(w => w.id === parts[0]) ? parts[0] : WEEKS[0].id;
    const slug = parts[1] || "highlights";
    return { weekId, slug };
  }
  function writeHash(weekId, slug) {
    const wanted = "#" + weekId + (slug && slug !== "highlights" ? "/" + slug : "");
    if (location.hash !== wanted) {
      location.hash = wanted;          // triggers hashchange -> render
    } else {
      render();                         // no change in hash, but still refresh
    }
  }
  function currentSlugFor(week, slug) {
    // When swapping weeks, prefer to keep the user's current slug if the new
    // week has it. Otherwise fall back to highlights.
    if (!week) return "highlights";
    if (slug === "highlights" || slug === "research") return slug;
    if (slug.startsWith("hl-")) {
      const chips = highlightsChips(week).map(c => c.sub);
      return chips.includes(slug) ? slug : "highlights";
    }
    if (slug.startsWith("mr-")) {
      const chips = mericsChips(week).map(c => c.sub);
      return chips.includes(slug) ? slug : "research";
    }
    const intlSubs = new Set((week.numberedSections || []).map(s => s.slug));
    if (intlSubs.has(slug)) return slug;
    const cnSubs = new Set((week.chineseSourcesSections || []).map(s => s.slug));
    if (cnSubs.has(slug)) return slug;
    const lensSubs = new Set(((week.wochenbericht && week.wochenbericht.sections) || []).map(s => s.slug));
    if (lensSubs.has(slug)) return slug;
    return "highlights";
  }
  function tabAndSubFromSlug(slug) {
    if (slug === "highlights" || slug === "research") return { tab: slug, sub: null };
    if (slug.startsWith("hl-"))                       return { tab: "highlights", sub: slug };
    if (slug.startsWith("mr-"))                       return { tab: "research",   sub: slug };
    if (SUB_ORDER.includes(slug))                     return { tab: "intl", sub: slug };
    if (CN_SUB_ORDER.includes(slug))                  return { tab: "cnsources", sub: slug };
    if (LENS_SUB_ORDER.includes(slug))                return { tab: "lens", sub: slug };
    return { tab: "highlights", sub: null };
  }

  // -------- main render -----------------------------------------------------
  function render() {
    const { weekId, slug } = parseHash();
    const week = WEEKS.find(w => w.id === weekId) || WEEKS[0];
    const { tab, sub } = tabAndSubFromSlug(slug);

    // Reset tag filter whenever tab or week changes (per-tab semantics).
    const tabKey = `${week.id}|${tab}`;
    if (tabKey !== lastTabKey) {
      activeFilters.clear();
      filterExpanded = false;
      lastTabKey = tabKey;
    }

    setMasthead(week);
    $("#weekSelect").value = week.id;

    // Nav
    const navHost = $("#nav");
    navHost.innerHTML = renderNav(week, tab, sub);

    // Wire up clicks (event delegation per render — DOM is fresh)
    navHost.querySelectorAll("[data-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        const t = btn.dataset.tab;
        if (t === "intl") {
          const subs = (week.numberedSections || []).map(s => s.slug);
          const first = SUB_ORDER.find(s => subs.includes(s)) || "econ";
          writeHash(week.id, first);
        } else if (t === "cnsources") {
          const subs = (week.chineseSourcesSections || []).map(s => s.slug);
          const first = CN_SUB_ORDER.find(s => subs.includes(s)) || "cn-authoritative";
          writeHash(week.id, first);
        } else if (t === "lens") {
          const subs = ((week.wochenbericht && week.wochenbericht.sections) || []).map(s => s.slug);
          const first = LENS_SUB_ORDER.find(s => subs.includes(s)) || "quotes";
          writeHash(week.id, first);
        } else if (t === "research") {
          const chips = mericsChips(week);
          writeHash(week.id, chips.length ? chips[0].sub : "research");
        } else if (t === "highlights") {
          // Default to first highlights chip if any (usually Spotlight)
          const chips = highlightsChips(week);
          writeHash(week.id, chips.length ? chips[0].sub : "highlights");
        } else {
          writeHash(week.id, t);
        }
      });
    });
    navHost.querySelectorAll("[data-sub]").forEach(btn => {
      btn.addEventListener("click", () => writeHash(week.id, btn.dataset.sub));
    });

    // Filter-bar chip clicks + clear + expand/collapse toggle
    navHost.querySelectorAll(".filter-bar [data-tag]").forEach(btn => {
      btn.addEventListener("click", () => toggleFilter(btn.dataset.tag));
    });
    const clearBtn = navHost.querySelector("[data-clear-filters]");
    if (clearBtn) clearBtn.addEventListener("click", () => {
      activeFilters.clear();
      render();
    });
    const toggleBtn = navHost.querySelector("[data-filter-toggle]");
    if (toggleBtn) toggleBtn.addEventListener("click", () => {
      filterExpanded = !filterExpanded;
      render();
    });

    // Content with a quick fade swap.
    const main = $("#content");
    main.style.transition = "opacity .14s ease";
    main.style.opacity = "0";
    setTimeout(() => {
      let html = viewForTab(week, tab, sub);
      // If filters are active and nothing matched, show a small empty state.
      if (activeFilters.size && !html.trim()) {
        const sel = [...activeFilters].map(id => (TAG_LOOKUP.get(id) || {}).label || id).join(", ");
        html = `<div class="empty-filter">No entries match the active filter: ${esc(sel)}.</div>`;
      }
      main.innerHTML = html;
      // Entry-level tag chips open the filter on click.
      main.querySelectorAll(".entry-tags [data-tag]").forEach(btn => {
        btn.addEventListener("click", () => toggleFilter(btn.dataset.tag));
      });
      main.style.opacity = "1";
      // Only auto-scroll the body on user-initiated changes after first paint.
      // Anchor-scroll for tabs that stack their sub-sections (highlights, intl, lens).
      // Runs on every render — including the initial paint for deep links.
      //
      // BUT: if the active sub is the FIRST sub of the tab, scroll to page top
      // instead of the anchor — so any preamble (caveat, intro paragraph) is
      // visible above the first section.
      let anchorId = null;
      let isFirstSub = false;
      if (tab === "highlights" && sub) {
        anchorId = sub; // sub already has hl- prefix
        const chips = highlightsChips(week);
        isFirstSub = chips.length > 0 && chips[0].sub === sub;
      } else if (tab === "research" && sub) {
        anchorId = sub;
        const chips = mericsChips(week);
        isFirstSub = chips.length > 0 && chips[0].sub === sub;
      } else if (tab === "intl" && sub) {
        anchorId = `intl-${sub}`;
        const intlSubs = (week.numberedSections || []).map(s => s.slug);
        const first = SUB_ORDER.find(s => intlSubs.includes(s));
        isFirstSub = first === sub;
      } else if (tab === "cnsources" && sub) {
        anchorId = sub;
        const cnSubs = (week.chineseSourcesSections || []).map(s => s.slug);
        const first = CN_SUB_ORDER.find(s => cnSubs.includes(s));
        isFirstSub = first === sub;
      } else if (tab === "lens" && sub) {
        anchorId = `lens-${sub}`;
        const lensSubs = ((week.wochenbericht && week.wochenbericht.sections) || []).map(s => s.slug);
        const first = LENS_SUB_ORDER.find(s => lensSubs.includes(s));
        isFirstSub = first === sub;
      }
      if (isFirstSub) {
        // Show preamble — scroll to top.
        window.scrollTo({ top: 0, behavior: "auto" });
      } else if (anchorId) {
        const target = document.getElementById(anchorId);
        if (target) {
          const topbarH = document.querySelector(".topbar")?.getBoundingClientRect().height || 56;
          const navH = $("#nav")?.getBoundingClientRect().height || 0;
          // Extra breathing room above the section heading.
          const breathingRoom = 8;
          const top = target.getBoundingClientRect().top + window.scrollY - topbarH - navH - breathingRoom;
          window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
        }
      } else if (window.__mhInit) {
        // Non-anchored tab change — reset scroll to top of page.
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      // (See setupScrollSpy call below.)
      window.__mhInit = true;
    }, 60);
    // After paint, install the scrollspy for stacked-section tabs.
    setTimeout(() => setupScrollSpy(tab, week.id), 120);
  }

  function toggleFilter(id) {
    if (!TAG_LOOKUP.has(id)) return;
    if (activeFilters.has(id)) activeFilters.delete(id);
    else activeFilters.add(id);
    // Auto-expand when the user adds a filter from an entry chip, so they can
    // see the full list and add/remove more easily.
    if (activeFilters.size) filterExpanded = true;
    render();
  }

  // ======================================================================
  // Print / PDF
  // Builds a clean, paginated document for the selected parts in a dedicated
  // window and hands it to the browser's print dialog (→ Save as PDF). Page
  // breaks, page numbers and running headers come from Paged.js, loaded only
  // inside that window so the archive itself stays lightweight.
  // ======================================================================
  function currentWeek() {
    return WEEKS.find(w => w.id === parseHash().weekId) || WEEKS[0];
  }
  function tabHasContent(w, id) {
    if (id === "highlights") return spotlightsOf(w).length > 0 || (w.contextSections || []).length > 0;
    if (id === "research")   return (w.researchSections || []).length > 0 || (w.topCharts || []).length > 0;
    if (id === "intl")       return (w.numberedSections || []).length > 0;
    if (id === "cnsources")  return (w.chineseSourcesSections || []).length > 0;
    if (id === "lens")       return !!w.wochenbericht;
    return false;
  }
  function printableParts(w) {
    return TABS.filter(t => tabHasContent(w, t.id))
               .map(t => ({ id: t.id, num: t.num, label: t.label }));
  }
  // Render every selected part in full and unfiltered into one HTML string.
  function buildPrintBody(w, selected) {
    const saved = new Set(activeFilters);
    activeFilters.clear();
    const chosen = printableParts(w).filter(p => selected.has(p.id));
    const toc = chosen.map(p =>
      `<div><span class="pc-toc-num">${esc(p.num)}.</span>${esc(p.label)}</div>`).join("");
    let html =
      `<div class="print-cover">
         <div class="pc-rule"></div>
         <div class="print-doctitle">MH@MERICS &middot; Week ${esc(w.week)} &middot; ${esc(w.year)}</div>
         <div class="pc-title">Weekly Update</div>
         <div class="pc-range">${esc(w.dateRange)}</div>
         <div class="pc-toc">${toc}</div>
         <div class="pc-by">Mikko Huotari &middot; Mercator Institute for China Studies, Berlin</div>
       </div>`;
    for (const p of chosen) {
      html +=
        `<section class="print-part">
           <h1 class="print-part-h"><span class="pp-num">${esc(p.num)}.</span> ${esc(p.label)}</h1>
           ${viewForTab(w, p.id)}
         </section>`;
    }
    activeFilters.clear();
    saved.forEach(x => activeFilters.add(x));
    return html;
  }
  // Render the selected parts into the (screen-hidden) #print-root, then let
  // the browser's own print engine paginate it via the @media print rules in
  // index.html. Page numbers come from the browser's native print header/footer.
  async function runPrint(w, selected) {
    if (!selected.size) return;
    const root = document.getElementById("print-root");
    if (!root) return;
    // Parse the assembled HTML into nodes via DOMParser (not innerHTML).
    const parsed = new DOMParser().parseFromString(buildPrintBody(w, selected), "text/html");
    root.replaceChildren(...document.importNode(parsed.body, true).childNodes);
    // Wait for chart images to finish loading before printing — otherwise the
    // print engine snapshots them blank (they were inserted this same tick).
    const imgs = Array.from(root.querySelectorAll("img"));
    const loaded = Promise.all(imgs.map(img =>
      (img.complete && img.naturalWidth) ? Promise.resolve()
        : new Promise(res => {
            img.addEventListener("load", res, { once: true });
            img.addEventListener("error", res, { once: true });
          })));
    // Safety cap so a hung/slow asset can never block printing indefinitely.
    await Promise.race([loaded, new Promise(res => setTimeout(res, 4000))]);
    const cleanup = () => { root.replaceChildren(); window.removeEventListener("afterprint", cleanup); };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }
  function setupPrint() {
    const btn  = document.getElementById("printBtn");
    const menu = document.getElementById("printMenu");
    if (!btn || !menu) return;
    const parts = document.getElementById("pmParts");
    const all   = document.getElementById("pmAll");
    const close = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };
    const open  = () => {
      parts.replaceChildren();
      printableParts(currentWeek()).forEach(p => {
        const row  = document.createElement("label"); row.className = "pm-row";
        const cb   = document.createElement("input");
        cb.type = "checkbox"; cb.className = "pm-part"; cb.value = p.id; cb.checked = true;
        const span = document.createElement("span");
        const num  = document.createElement("b"); num.textContent = p.num + ".";
        span.append(num, " " + p.label);
        row.append(cb, span);
        parts.appendChild(row);
      });
      all.checked = true;
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
    };
    btn.addEventListener("click", (e) => { e.stopPropagation(); menu.hidden ? open() : close(); });
    all.addEventListener("change", () => {
      parts.querySelectorAll(".pm-part").forEach(cb => { cb.checked = all.checked; });
    });
    parts.addEventListener("change", () => {
      const boxes = [...parts.querySelectorAll(".pm-part")];
      all.checked = boxes.length > 0 && boxes.every(cb => cb.checked);
    });
    document.getElementById("pmCancel").addEventListener("click", close);
    document.getElementById("pmPrint").addEventListener("click", () => {
      const selected = new Set([...parts.querySelectorAll(".pm-part:checked")].map(cb => cb.value));
      if (!selected.size) return;
      close();
      runPrint(currentWeek(), selected);
    });
    document.addEventListener("click", (e) => {
      if (!menu.hidden && !menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) close();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) close(); });
  }

  window.addEventListener("hashchange", render);
  // The manifest bootstrap loads this file AFTER DOMContentLoaded fires, so a
  // plain addEventListener would never run init. Guard with readyState.
  // (This bug took the site down once — see revert b05d918.)
  function _init() { populateSelect(); setupPrint(); render(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _init);
  } else {
    _init();
  }
})();
