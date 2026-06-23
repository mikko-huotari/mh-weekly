// ----------------------------------------------------------------------------
// Search across all weeks. Builds a flat index of every searchable entry
// (spotlight, context items, MERICS publications/media, numbered-section
// items, Wochenbericht quotes/facts/themes) and renders a results list
// under the search modal.
// ----------------------------------------------------------------------------

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const slugify = (s) => String(s).toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // -------- Build a flat search index from every loaded week. -------------
  // Discover weeks dynamically — any `window.W<NN>_<YYYY>` global counts, so
  // newly-added weeks don't need a code change here.
  function discoverWeeks() {
    const pat = /^W(\d+)_(\d{4})$/;
    const found = [];
    for (const key in window) {
      const m = key.match(pat);
      if (!m) continue;
      const w = window[key];
      if (w && typeof w === "object" && w.id) found.push(w);
    }
    return found.sort((a, b) => (b.year - a.year) || (b.week - a.week));
  }
  function buildIndex() {
    const weeks = discoverWeeks();
    const entries = [];

    weeks.forEach(w => {
      const weekLabel = `Week ${w.week} \u00b7 ${w.year}`;

      // Spotlight
      if (w.spotlight && w.spotlight.items) {
        w.spotlight.items.forEach(it => entries.push(buildEntry(it, {
          week: w, weekLabel, slug: "hl-spotlight",
          crumb: ["I. Highlights", w.spotlight.title || "Spotlight"]
        })));
      }

      // Context sections (German policy in context)
      (w.contextSections || []).forEach(sec => {
        const sub = "hl-" + slugify(sec.label);
        (sec.groups || []).forEach(g => {
          (g.items || []).forEach(it => entries.push(buildEntry(it, {
            week: w, weekLabel, slug: sub,
            crumb: ["I. Highlights", sec.label, g.label]
          })));
        });
      });

      // Research sections (Publications, Media Insights, Briefings)
      (w.researchSections || []).forEach(sec => {
        (sec.groups || []).forEach(g => {
          const sub = "mr-" + slugify(g.label);
          (g.items || []).forEach(it => entries.push(buildEntry(it, {
            week: w, weekLabel, slug: sub,
            crumb: ["II. MERICS", sec.label, g.label]
          })));
        });
        (sec.items || []).forEach(it => entries.push(buildEntry(it, {
          week: w, weekLabel, slug: "mr-" + slugify(sec.label),
          crumb: ["II. MERICS", sec.label]
        })));
      });

      // Numbered sections (International tab) - includes CN debates
      (w.numberedSections || []).forEach(sec => {
        (sec.items || []).forEach(it => entries.push(buildEntry(it, {
          week: w, weekLabel, slug: sec.slug,
          crumb: ["III. International", (sec.number ? sec.number + ". " : "") + sec.label]
        })));
      });

      // Wochenbericht (German Lens)
      const wb = w.wochenbericht;
      if (wb) {
        (wb.sections || []).forEach(sec => {
          (sec.items || []).forEach(it => entries.push(buildWBEntry(it, {
            week: w, weekLabel, slug: sec.slug,
            crumb: ["IV. German lens", sec.label]
          })));
        });
      }
    });

    return entries;
  }

  // Build a search entry for a regular item (with title/bullets or note).
  function buildEntry(it, ctx) {
    const parts = [];
    if (it.outlet) parts.push(it.outlet);
    if (it.title) parts.push(it.title);
    if (it.note) parts.push(it.note);
    if (it.bullets) {
      it.bullets.forEach(b => {
        if (Array.isArray(b)) parts.push((b[0] || "") + " " + (b[1] || ""));
      });
    }
    // Include tags so the archive is searchable by tag \u2014 both the id ("twn")
    // and the human label ("Taiwan") match.
    if (it.tags && it.tags.length) {
      const vocab = (window.TAGS && window.TAGS.tags) || [];
      it.tags.forEach(id => {
        parts.push(id);
        const t = vocab.find(x => x.id === id);
        if (t && t.label) parts.push(t.label);
      });
    }
    const text = parts.join(" \u00b7 ");
    const preview = it.note || it.title || (it.bullets && it.bullets[0] && (it.bullets[0][0] || it.bullets[0][1])) || "";
    return {
      weekId: ctx.week.id,
      weekLabel: ctx.weekLabel,
      slug: ctx.slug,
      crumb: ctx.crumb,
      outlet: it.outlet || "",
      date: it.date || "",
      title: it.title || it.note || preview,
      preview: preview,
      tags: (it.tags || []).slice(),
      haystack: (ctx.week.id + " " + text).toLowerCase()
    };
  }

  // Wochenbericht items have a different shape (lead/text + source).
  function buildWBEntry(it, ctx) {
    const tagText = [];
    if (it.tags && it.tags.length) {
      const vocab = (window.TAGS && window.TAGS.tags) || [];
      it.tags.forEach(id => {
        tagText.push(id);
        const t = vocab.find(x => x.id === id);
        if (t && t.label) tagText.push(t.label);
      });
    }
    if (it.kind === "theme") {
      const text = [it.title, it.text, (it.sources || []).map(s => s.title).join(" "), tagText.join(" ")].join(" ");
      return {
        weekId: ctx.week.id,
        weekLabel: ctx.weekLabel,
        slug: ctx.slug,
        crumb: ctx.crumb,
        outlet: (it.sources && it.sources[0] && it.sources[0].outlet) || "",
        date: "",
        title: it.title || "",
        preview: it.text || "",
        tags: (it.tags || []).slice(),
        haystack: (ctx.week.id + " " + text).toLowerCase()
      };
    }
    const src = it.source || {};
    const text = [it.lead, it.text, src.title, tagText.join(" ")].join(" ");
    return {
      weekId: ctx.week.id,
      weekLabel: ctx.weekLabel,
      slug: ctx.slug,
      crumb: ctx.crumb,
      outlet: src.outlet || "",
      date: src.date || "",
      title: (it.lead ? it.lead + " \u2014 " : "") + (it.text || "").slice(0, 80),
      preview: it.text || "",
      tags: (it.tags || []).slice(),
      haystack: (ctx.week.id + " " + text).toLowerCase()
    };
  }

  // -------- Search + render ------------------------------------------------
  let INDEX = null;
  let activeIdx = -1;
  let lastResults = [];
  // Tag-filter state: ids of currently-active filter chips. Empty = no filter.
  // Logic is OR within: an entry passes if any of its tags is in the active set.
  const activeFilters = new Set();

  function ensureIndex() {
    if (!INDEX) INDEX = buildIndex();
    return INDEX;
  }

  function passesTagFilter(e) {
    if (!activeFilters.size) return true;
    if (!e.tags || !e.tags.length) return false;
    for (const t of e.tags) if (activeFilters.has(t)) return true;
    return false;
  }

  function search(q) {
    const idx = ensureIndex();
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    // No text query: if filters are on, list filtered entries; else empty.
    if (!tokens.length) {
      if (!activeFilters.size) return [];
      return idx.filter(passesTagFilter).slice(0, 60);
    }
    const scored = [];
    for (const e of idx) {
      if (!passesTagFilter(e)) continue;
      let score = 0;
      let ok = true;
      for (const t of tokens) {
        if (!e.haystack.includes(t)) { ok = false; break; }
        // Bonus for hits in title/outlet
        if (e.title && e.title.toLowerCase().includes(t)) score += 3;
        if (e.outlet && e.outlet.toLowerCase().includes(t)) score += 2;
        score += 1;
      }
      if (ok) scored.push({ e, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 60).map(s => s.e);
  }

  function highlight(text, q) {
    if (!text) return "";
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return esc(text);
    let safe = esc(text);
    tokens.forEach(t => {
      if (!t) return;
      const re = new RegExp(`(${escapeRegExp(t)})`, "gi");
      safe = safe.replace(re, "<mark>$1</mark>");
    });
    return safe;
  }
  function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  function fmtDate(d) {
    if (typeof d !== "string") return "";
    const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return d;
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${parseInt(m[3], 10)} ${months[parseInt(m[2], 10) - 1]} ${m[1]}`;
  }

  function renderResults(query) {
    const host = $("#searchResults");
    if (!query.trim() && !activeFilters.size) {
      host.innerHTML = `<div class="search-hint">Type to search across all issues \u2014 titles, outlets, content. Or filter by tag below.</div>`;
      lastResults = [];
      activeIdx = -1;
      return;
    }
    const results = search(query);
    lastResults = results;
    activeIdx = results.length ? 0 : -1;
    if (!results.length) {
      host.innerHTML = `<div class="search-empty">No matches.</div>`;
      return;
    }
    host.innerHTML = results.map((r, i) => {
      const badge = window.outletBadge ? window.outletBadge(r.outlet) : "";
      const dateStr = fmtDate(r.date);
      const crumb = r.crumb.map(c => esc(c)).join(" \u203a ");
      const titleH = highlight(r.title, query);
      const previewH = r.preview && r.preview !== r.title ? highlight(r.preview, query) : "";
      return `<button type="button" class="search-result ${i === 0 ? 'is-active' : ''}" data-i="${i}">
        ${badge}
        <div class="sr-meta">
          <span class="sr-week">${esc(r.weekLabel)}</span>
          <span class="sr-crumb">${crumb}</span>
          ${r.outlet ? `<span class="sr-outlet">${esc(r.outlet)}</span>` : ""}
          ${dateStr ? `<span class="sr-crumb">${esc(dateStr)}</span>` : ""}
        </div>
        <div class="sr-text">${titleH}${previewH ? ` \u2014 ${previewH}` : ""}</div>
      </button>`;
    }).join("");
    // Bind result clicks
    host.querySelectorAll(".search-result").forEach(btn => {
      btn.addEventListener("click", () => openResult(parseInt(btn.dataset.i, 10)));
      btn.addEventListener("mouseenter", () => setActive(parseInt(btn.dataset.i, 10)));
    });
  }

  function setActive(i) {
    if (i < 0 || i >= lastResults.length) return;
    activeIdx = i;
    const items = $("#searchResults").querySelectorAll(".search-result");
    items.forEach((el, idx) => el.classList.toggle("is-active", idx === i));
    items[i] && items[i].scrollIntoView({ block: "nearest" });
  }

  function openResult(i) {
    const r = lastResults[i];
    if (!r) return;
    closeModal();
    location.hash = `#${r.weekId}/${r.slug}`;
  }

  // Render the tag-filter chip row. Chips are grouped (geo / sector / etc.).
  // Only chips that actually appear in the indexed entries are shown — keeps
  // the bar tight as the vocabulary grows. Vocab ids/labels are escaped even
  // though they come from data/tags.js (controlled), not user input.
  function renderFilterChips() {
    const host = $("#searchTags");
    if (!host) return;
    const T = window.TAGS;
    if (!T || !T.tags || !T.groups) { host.innerHTML = ""; return; }
    const idx = ensureIndex();
    const present = new Set();
    idx.forEach(e => (e.tags || []).forEach(t => present.add(t)));
    const byGroup = {};
    T.tags.forEach(t => {
      if (!present.has(t.id)) return;
      (byGroup[t.group] = byGroup[t.group] || []).push(t);
    });
    const html = T.groups
      .filter(g => byGroup[g.id] && byGroup[g.id].length)
      .map(g => {
        const chips = byGroup[g.id].map(t => {
          const on = activeFilters.has(t.id);
          return `<button type="button" class="st-chip${on ? " is-on" : ""}" data-tag="${esc(t.id)}" aria-pressed="${on}">${esc(t.label)}</button>`;
        }).join("");
        return `<div class="st-group" title="${esc(g.label)}"><span class="st-glabel">${esc(g.label)}</span>${chips}</div>`;
      }).join("");
    const clear = activeFilters.size
      ? `<button type="button" class="st-clear" data-clear-filters>Clear ${activeFilters.size}</button>`
      : "";
    host.innerHTML = html + clear;
    host.querySelectorAll(".st-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.tag;
        if (activeFilters.has(id)) activeFilters.delete(id); else activeFilters.add(id);
        renderFilterChips();
        renderResults($("#searchInput").value || "");
      });
    });
    const clr = host.querySelector("[data-clear-filters]");
    if (clr) clr.addEventListener("click", () => {
      activeFilters.clear();
      renderFilterChips();
      renderResults($("#searchInput").value || "");
    });
  }

  // -------- Modal open/close ----------------------------------------------
  let lastFocus = null;
  function openModal() {
    const modal = $("#searchModal");
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const input = $("#searchInput");
    input.value = "";
    renderFilterChips();
    renderResults("");
    setTimeout(() => input.focus(), 30);
  }
  function closeModal() {
    const modal = $("#searchModal");
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // -------- Wire up --------------------------------------------------------
  // Same readyState guard as render.js. Without it, the manifest bootstrap's
  // dynamic injection would mean this listener never fires.
  function _wire() {
    const btn = $("#searchBtn");
    const input = $("#searchInput");
    const modal = $("#searchModal");
    if (!btn || !input || !modal) return;

    btn.addEventListener("click", openModal);

    modal.addEventListener("click", (e) => {
      if (e.target.closest("[data-search-close]")) closeModal();
    });

    input.addEventListener("input", (e) => renderResults(e.target.value));

    // Bind keyboard nav on the modal (not just the input) so arrow keys
    // still work if focus drifts to a result button after a hover.
    modal.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (lastResults.length) setActive(Math.min(Math.max(activeIdx, -1) + 1, lastResults.length - 1));
        input.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (lastResults.length) setActive(Math.max(activeIdx - 1, 0));
        input.focus();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIdx >= 0) openResult(activeIdx);
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
    });

    // Cmd/Ctrl+K to open search from anywhere.
    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openModal();
      }
      if (e.key === "Escape" && !modal.hidden) {
        e.preventDefault();
        closeModal();
      }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _wire);
  } else {
    _wire();
  }
})();
