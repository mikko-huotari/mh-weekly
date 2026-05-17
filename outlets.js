// Outlet badge map. Each entry produces a small typographic tile placed
// next to the outlet name on an entry. The marks are intentionally generic
// (1–3 letter monograms in the outlet's brand color) rather than copied
// logos.
//
// Keys are matched case-sensitively against the entry's `outlet` field;
// unknown outlets fall back to a graphite tile with the first letter.
//
// Fields:
//   mono   — letters/chars rendered in the tile (1–4)
//   bg     — background color
//   fg     — text color
//   font   — "serif" | "sans" (default sans)
//   size   — override font-size in px when mono is wide (e.g. "SCMP")
//   border — optional inset border color (rare; for white-on-color marks)

window.OUTLET_MAP = {
  // ---------------- Wires & dailies ----------------
  "FT":              { mono: "FT",   bg: "#FFF1E5", fg: "#1B1B1B", font: "serif" },
  "NYT":             { mono: "NYT",  bg: "#000000", fg: "#FFFFFF", font: "serif", size: 8 },
  "WSJ":             { mono: "WSJ",  bg: "#000000", fg: "#FFFFFF", font: "serif", size: 8 },
  "Reuters":         { mono: "R",    bg: "#FF8000", fg: "#FFFFFF" },
  "AP":              { mono: "AP",   bg: "#FA0000", fg: "#FFFFFF" },
  "Bloomberg":       { mono: "B",    bg: "#000000", fg: "#FA7E1E" },

  // ---------------- China-focused ------------------
  "SCMP":            { mono: "SCMP", bg: "#A11626", fg: "#FFFFFF", size: 7 },
  "Caixin":          { mono: "Cx",   bg: "#9C1010", fg: "#FFFFFF" },
  "Nikkei":          { mono: "N",    bg: "#D4202C", fg: "#FFFFFF" },
  "ChinaTalk":       { mono: "CT",   bg: "#C41E1E", fg: "#FFFFFF" },
  "Wire China":      { mono: "WC",   bg: "#971418", fg: "#FFFFFF" },
  "Trivium":         { mono: "T",    bg: "#7A6F47", fg: "#FFFFFF" },
  "Straits Times":   { mono: "ST",   bg: "#0B3D91", fg: "#FFFFFF" },

  // ---------------- Magazines ----------------------
  "The Economist":   { mono: "E",    bg: "#E3120B", fg: "#FFFFFF", font: "serif" },
  "Foreign Affairs": { mono: "FA",   bg: "#1B365C", fg: "#FFFFFF" },
  "Foreign Policy":  { mono: "FP",   bg: "#111111", fg: "#FF3B30" },
  "New Yorker":      { mono: "TNY",  bg: "#000000", fg: "#FFFFFF", size: 7 },
  "Time":            { mono: "T",    bg: "#E10000", fg: "#FFFFFF", border: "#FFFFFF" },
  "Semafor":         { mono: "S",    bg: "#F5C518", fg: "#000000" },

  // ---------------- Think tanks --------------------
  "Brookings":       { mono: "Bk",   bg: "#003A70", fg: "#FFFFFF" },
  "Atlantic Council":{ mono: "AC",   bg: "#A11D33", fg: "#FFFFFF" },
  "CFR":             { mono: "CFR",  bg: "#0B2E5B", fg: "#FFFFFF", size: 7 },
  "Lowy Institute":  { mono: "L",    bg: "#B11226", fg: "#FFFFFF" },
  "HRW":             { mono: "HRW",  bg: "#F7941D", fg: "#FFFFFF", size: 7 },
  "Noah Barkin":     { mono: "NB",   bg: "#444444", fg: "#FFFFFF" },

  // ---------------- Govt / EU ----------------------
  "Eurostat":        { mono: "ES",   bg: "#003399", fg: "#FFCC00" },
  "EEAS":            { mono: "EU",   bg: "#003399", fg: "#FFCC00" },
  "POLITICO":        { mono: "P",    bg: "#E5102D", fg: "#FFFFFF" },
  "Climate Action":  { mono: "CA",   bg: "#3F8A3F", fg: "#FFFFFF" },
  "US News":         { mono: "US",   bg: "#003366", fg: "#FFFFFF" },
  "DIHK":            { mono: "D",    bg: "#005580", fg: "#FFFFFF" },
  "heise":           { mono: "h",    bg: "#CC0000", fg: "#FFFFFF" },
  "Business Insider":{ mono: "BI",   bg: "#000000", fg: "#FFFFFF" },

  // ---------------- German press -------------------
  "FAZ — op-ed":      { mono: "FAZ", bg: "#000000", fg: "#FFFFFF", font: "serif", size: 7 },
  "NZZ — interview":  { mono: "NZZ", bg: "#000000", fg: "#FFFFFF", font: "serif", size: 7 },

  // ---------------- German press (Wochenbericht) ---
  "FAZ":              { mono: "F",   bg: "#000000", fg: "#FFFFFF", font: "serif" },
  "Handelsblatt":     { mono: "H",   bg: "#E84E0E", fg: "#FFFFFF" },
  "Der Tagesspiegel": { mono: "T",   bg: "#003D7A", fg: "#FFFFFF" },
  "Die Welt":         { mono: "W",   bg: "#000000", fg: "#FFFFFF", font: "serif" },
  "BILD":             { mono: "B!",  bg: "#E10000", fg: "#FFFFFF", size: 8 },
  "DIE ZEIT":         { mono: "Z",   bg: "#000000", fg: "#FFFFFF", font: "serif" },
  "Spiegel":          { mono: "S",   bg: "#E10000", fg: "#FFFFFF" },
  "WirtschaftsWoche": { mono: "WW",  bg: "#000000", fg: "#FFFFFF" },
  "S\u00fcddeutsche Zeitung": { mono: "SZ",  bg: "#161616", fg: "#FFFFFF", font: "serif" },
  "Welt am Sonntag":  { mono: "WaS", bg: "#000000", fg: "#FFFFFF", font: "serif", size: 7 },

  // ---------------- MERICS — house red -------------
  "MERICS":                          { mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "MERICS Europe China 360°":        { mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "MERICS China Essentials":         { mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "MERICS briefings":                { mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "MERICS — Future China Conversation": { mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "MERICS — China in 26 podcast":    { mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "MERICS — online briefing":        { mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "Soapbox × MERICS":                { mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "Soapbox–MERICS Data Highlight":   { mono: "M", bg: "#E8412B", fg: "#FFFFFF" },

  // ---------------- Bylines (analyst quotes) -------
  "Jacob Gunter":    { mono: "JG", bg: "#1A1916", fg: "#FFFFFF" },
  "Helena Legarda":  { mono: "HL", bg: "#1A1916", fg: "#FFFFFF" },
  "Johanna Krebs":   { mono: "JK", bg: "#1A1916", fg: "#FFFFFF" },
  "Wendy Chang":     { mono: "WC", bg: "#1A1916", fg: "#FFFFFF" },

  // ---------------- Aisixiang authors --------------
  "Zhang Ying (BFSU)":                                    { mono: "张",  bg: "#1A1916", fg: "#FFFFFF" },
  "Zhou Fangyin (SYSU)":                                  { mono: "周",  bg: "#1A1916", fg: "#FFFFFF" },
  "Lin Yifu (former World Bank chief economist)":         { mono: "林",  bg: "#1A1916", fg: "#FFFFFF" },

  // ---------------- Catch-alls ---------------------
  "Media":           { mono: "·",   bg: "#7A786F", fg: "#FFFFFF" }
};

window.outletBadge = function (name) {
  const map = window.OUTLET_MAP || {};
  const m = map[name];
  const escape = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  // Real outlet logos take precedence over the typographic monogram fallback.
  // Drop an SVG or PNG at assets/icons/<slug>.svg (or .png) and reference it
  // via `iconUrl` on the map entry. The renderer wraps it in the standard
  // 22x22 badge frame.
  if (m && m.iconUrl) {
    return `<span class="outlet-badge has-img" aria-label="${escape(name)}">`
      + `<img src="${escape(m.iconUrl)}" alt="" loading="lazy" />`
      + `</span>`;
  }

  if (!m) {
    const fallback = (name || "?").trim().replace(/[^A-Za-z\u4e00-\u9fff]/g, "").charAt(0).toUpperCase() || "·";
    return `<span class="outlet-badge" style="background:#7A786F;color:#FFF">${escape(fallback)}</span>`;
  }
  const fontFamily = m.font === "serif"
    ? '"Source Serif Pro", Georgia, "Times New Roman", serif'
    : '"Neo Sans Pro", "Helvetica Neue", Arial, sans-serif';
  const parts = [
    `background:${m.bg}`,
    `color:${m.fg}`,
    `font-family:${fontFamily}`,
  ];
  if (m.size) parts.push(`font-size:${m.size}px`);
  if (m.border) parts.push(`box-shadow:inset 0 0 0 1px ${m.border}`);
  return `<span class="outlet-badge" style="${parts.join(';')}">${escape(m.mono)}</span>`;
};
