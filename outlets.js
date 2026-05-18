// Outlet badge map. iconUrl wins over typographic monogram. shape: "round"
// renders the badge with a circular crop (used for author headshots).
//
// To override a monogram with a real logo, drop a square PNG/SVG at
// assets/icons/<slug>.png (or assets/people/<slug>.jpg) and reference it via
// `iconUrl`. Asset specs: outlet logos 128px+ square; headshots 350px+ square.
//
// Keys are matched case-sensitively against the entry's `outlet` field;
// unknown outlets fall back to a graphite tile with the first letter.

window.OUTLET_MAP = {
  // ---------------- Wires & dailies ----------------
  "FT":              { iconUrl: "assets/icons/ft.png",          mono: "FT",   bg: "#FFF1E5", fg: "#1B1B1B", font: "serif" },
  "NYT":             { iconUrl: "assets/icons/nyt.png",         mono: "NYT",  bg: "#000000", fg: "#FFFFFF", font: "serif", size: 8 },
  "WSJ":             { iconUrl: "assets/icons/wsj.png",         mono: "WSJ",  bg: "#000000", fg: "#FFFFFF", font: "serif", size: 8 },
  "Reuters":         { iconUrl: "assets/icons/reuters.png",     mono: "R",    bg: "#FF8000", fg: "#FFFFFF" },
  "AP":              { iconUrl: "assets/icons/ap.png",          mono: "AP",   bg: "#FA0000", fg: "#FFFFFF" },
  "Bloomberg":       { iconUrl: "assets/icons/bloomberg.png",   mono: "B",    bg: "#000000", fg: "#FA7E1E" },
  "The Guardian":    { iconUrl: "assets/icons/guardian.png",    mono: "G",    bg: "#052962", fg: "#FFFFFF" },

  // ---------------- China-focused ------------------
  "SCMP":            { mono: "SCMP", bg: "#A11626", fg: "#FFFFFF", size: 7 }, // favicon too small; keep mono
  "Caixin":          { iconUrl: "assets/icons/caixin.png",      mono: "Cx",   bg: "#9C1010", fg: "#FFFFFF" },
  "Nikkei":          { iconUrl: "assets/icons/nikkei.png",      mono: "N",    bg: "#D4202C", fg: "#FFFFFF" },
  "ChinaTalk":       { iconUrl: "assets/icons/chinatalk.png",   mono: "CT",   bg: "#C41E1E", fg: "#FFFFFF" },
  "Wire China":      { iconUrl: "assets/icons/wirechina.png",   mono: "WC",   bg: "#971418", fg: "#FFFFFF" },
  "Trivium":         { iconUrl: "assets/icons/trivium.png",     mono: "T",    bg: "#7A6F47", fg: "#FFFFFF" },
  "Straits Times":   { iconUrl: "assets/icons/straitstimes.png",mono: "ST",   bg: "#0B3D91", fg: "#FFFFFF" },
  "China Daily":     { iconUrl: "assets/icons/chinadaily.png",  mono: "CD",   bg: "#A91024", fg: "#FFFFFF" },
  "Eastisread":      { iconUrl: "assets/icons/eastisread.png",  mono: "EiR",  bg: "#1A1916", fg: "#FFFFFF", size: 7 },

  // ---------------- Magazines ----------------------
  "The Economist":   { iconUrl: "assets/icons/economist.png",       mono: "E",    bg: "#E3120B", fg: "#FFFFFF", font: "serif" },
  "Economist":       { iconUrl: "assets/icons/economist.png",       mono: "E",    bg: "#E3120B", fg: "#FFFFFF", font: "serif" },
  "Foreign Affairs": { iconUrl: "assets/icons/foreignaffairs.png",  mono: "FA",   bg: "#1B365C", fg: "#FFFFFF" },
  "Foreign Policy":  { iconUrl: "assets/icons/foreignpolicy.png",   mono: "FP",   bg: "#111111", fg: "#FF3B30" },
  "New Yorker":      { iconUrl: "assets/icons/newyorker.png",       mono: "TNY",  bg: "#000000", fg: "#FFFFFF", size: 7 },
  "The Atlantic":    { iconUrl: "assets/icons/theatlantic.png",     mono: "A",    bg: "#E22D00", fg: "#FFFFFF", font: "serif" },
  "Time":            { mono: "T",   bg: "#E10000", fg: "#FFFFFF", border: "#FFFFFF" }, // favicon too small
  "Semafor":         { iconUrl: "assets/icons/semafor.png",         mono: "S",    bg: "#F5C518", fg: "#000000" },

  // ---------------- Think tanks --------------------
  "Brookings":       { iconUrl: "assets/icons/brookings.png",       mono: "Bk",   bg: "#003A70", fg: "#FFFFFF" },
  "Atlantic Council":{ iconUrl: "assets/icons/atlanticcouncil.png", mono: "AC",   bg: "#A11D33", fg: "#FFFFFF" },
  "CFR":             { iconUrl: "assets/icons/cfr.png",             mono: "CFR",  bg: "#0B2E5B", fg: "#FFFFFF", size: 7 },
  "Carnegie":        { mono: "Cg",  bg: "#1A1916", fg: "#FFFFFF" }, // favicon too small
  "Lowy Institute":  { mono: "L",   bg: "#B11226", fg: "#FFFFFF" }, // favicon too small
  "Hudson":          { mono: "Hu",  bg: "#003A70", fg: "#FFFFFF" }, // favicon too small
  "Rhodium":         { iconUrl: "assets/icons/rhodium.png",         mono: "Rh",   bg: "#1A1916", fg: "#FFFFFF" },
  "HRW":             { mono: "HRW", bg: "#F7941D", fg: "#FFFFFF", size: 7 },
  "Noah Barkin":     { mono: "NB",  bg: "#444444", fg: "#FFFFFF" },
  "Choosingvictory": { iconUrl: "assets/icons/choosingvictory.png", mono: "CV",   bg: "#1A1916", fg: "#FFFFFF" },

  // ---------------- Broadcast / radio --------------
  "BBC":             { mono: "BBC", bg: "#B80000", fg: "#FFFFFF", size: 7 }, // favicon too small
  "NPR":             { iconUrl: "assets/icons/npr.png",             mono: "NPR",  bg: "#222222", fg: "#FFFFFF", size: 7 },
  "Deutschlandfunk": { iconUrl: "assets/icons/deutschlandfunk.png", mono: "DLF",  bg: "#005E8C", fg: "#FFFFFF", size: 7 },
  "NDR":             { iconUrl: "assets/icons/ndr.png",             mono: "NDR",  bg: "#000B72", fg: "#FFFFFF", size: 7 },
  "Tagesschau":      { iconUrl: "assets/icons/tagesschau.png",      mono: "TS",   bg: "#001E50", fg: "#FFFFFF" },
  "tagesschau.de":   { iconUrl: "assets/icons/tagesschau.png",      mono: "TS",   bg: "#001E50", fg: "#FFFFFF" },

  // ---------------- Govt / EU ----------------------
  "Eurostat":        { mono: "ES",  bg: "#003399", fg: "#FFCC00" },
  "EEAS":            { mono: "EU",  bg: "#003399", fg: "#FFCC00" },
  "POLITICO":        { iconUrl: "assets/icons/politico.png",        mono: "P",    bg: "#E5102D", fg: "#FFFFFF" },
  "Politico":        { iconUrl: "assets/icons/politico.png",        mono: "P",    bg: "#E5102D", fg: "#FFFFFF" },
  "Climate Action":  { mono: "CA",  bg: "#3F8A3F", fg: "#FFFFFF" },
  "US News":         { iconUrl: "assets/icons/usnews.png",          mono: "US",   bg: "#003366", fg: "#FFFFFF" },
  "DIHK":            { mono: "D",   bg: "#005580", fg: "#FFFFFF" }, // favicon too small
  "heise":           { iconUrl: "assets/icons/heise.png",           mono: "h",    bg: "#CC0000", fg: "#FFFFFF" },
  "Business Insider":{ iconUrl: "assets/icons/businessinsider.png", mono: "BI",   bg: "#000000", fg: "#FFFFFF" },
  "Anadolu":         { iconUrl: "assets/icons/anadolu.png",         mono: "AA",   bg: "#102D69", fg: "#FFFFFF" },
  "ICIJ":            { iconUrl: "assets/icons/icij.png",            mono: "ICIJ", bg: "#1A1916", fg: "#FFFFFF", size: 7 },
  "Euronews":        { iconUrl: "assets/icons/euronews.png",        mono: "EN",   bg: "#003791", fg: "#FFFFFF" },

  // ---------------- German press -------------------
  "FAZ — op-ed":      { iconUrl: "assets/icons/faz.png",      mono: "FAZ", bg: "#000000", fg: "#FFFFFF", font: "serif", size: 7 },
  "NZZ — interview":  { iconUrl: "assets/icons/nzz.png",      mono: "NZZ", bg: "#000000", fg: "#FFFFFF", font: "serif", size: 7 },

  // ---------------- German press (Wochenbericht) ---
  "FAZ":              { iconUrl: "assets/icons/faz.png",          mono: "F",   bg: "#000000", fg: "#FFFFFF", font: "serif" },
  "Handelsblatt":     { iconUrl: "assets/icons/handelsblatt.png", mono: "H",   bg: "#E84E0E", fg: "#FFFFFF" },
  "Der Tagesspiegel": { iconUrl: "assets/icons/tagesspiegel.png", mono: "T",   bg: "#003D7A", fg: "#FFFFFF" },
  "Die Welt":         { iconUrl: "assets/icons/welt.png",         mono: "W",   bg: "#000000", fg: "#FFFFFF", font: "serif" },
  "BILD":             { iconUrl: "assets/icons/bild.png",         mono: "B!",  bg: "#E10000", fg: "#FFFFFF", size: 8 },
  "DIE ZEIT":         { iconUrl: "assets/icons/zeit.png",         mono: "Z",   bg: "#000000", fg: "#FFFFFF", font: "serif" },
  "Spiegel":          { iconUrl: "assets/icons/spiegel.png",      mono: "S",   bg: "#E10000", fg: "#FFFFFF" },
  "WirtschaftsWoche": { mono: "WW",  bg: "#000000", fg: "#FFFFFF" }, // favicon too small
  "Süddeutsche Zeitung": { iconUrl: "assets/icons/sueddeutsche.png", mono: "SZ",  bg: "#161616", fg: "#FFFFFF", font: "serif" },
  "SZ":               { iconUrl: "assets/icons/sueddeutsche.png", mono: "SZ",  bg: "#161616", fg: "#FFFFFF", font: "serif" },
  "Welt am Sonntag":  { iconUrl: "assets/icons/welt-am-sonntag.png", mono: "WaS", bg: "#000000", fg: "#FFFFFF", font: "serif", size: 7 },
  "NZZ":              { iconUrl: "assets/icons/nzz.png",          mono: "N",   bg: "#000000", fg: "#FFFFFF", font: "serif" },

  // ---------------- MERICS — house red -------------
  "MERICS":                          { iconUrl: "assets/merics_logo_short.png", mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "MERICS Europe China 360°":        { iconUrl: "assets/merics_logo_short.png", mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "MERICS China Essentials":         { iconUrl: "assets/merics_logo_short.png", mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "MERICS briefings":                { iconUrl: "assets/merics_logo_short.png", mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "MERICS China Industries Brief":   { iconUrl: "assets/merics_logo_short.png", mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "MERICS Comment":                  { iconUrl: "assets/merics_logo_short.png", mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "MERICS — Future China Conversation": { iconUrl: "assets/merics_logo_short.png", mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "MERICS — China in 26 podcast":    { iconUrl: "assets/merics_logo_short.png", mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "MERICS — online briefing":        { iconUrl: "assets/merics_logo_short.png", mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "Soapbox × MERICS":                { iconUrl: "assets/merics_logo_short.png", mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "Soapbox–MERICS Data Highlight":   { iconUrl: "assets/merics_logo_short.png", mono: "M", bg: "#E8412B", fg: "#FFFFFF" },
  "Soapbox Trade":                   { mono: "S", bg: "#0A0A0A", fg: "#FFFFFF" },

  // ---------------- Additional broadcast/digital --
  "Nikkei Asia":                     { iconUrl: "assets/icons/nikkei.png", mono: "N",  bg: "#D4202C", fg: "#FFFFFF" },
  "Deutsche Welle":                  { mono: "DW", bg: "#003366", fg: "#FFFFFF", size: 8 },
  "DW":                              { mono: "DW", bg: "#003366", fg: "#FFFFFF", size: 8 },
  "Global News Morning Toronto":     { mono: "GN", bg: "#0033A0", fg: "#FFFFFF", size: 8 },
  "Global News":                     { mono: "GN", bg: "#0033A0", fg: "#FFFFFF", size: 8 },
  "Newsweek":                        { mono: "NW", bg: "#E20000", fg: "#FFFFFF", size: 8 },

  // ---------------- MERICS staff headshots ---------
  "Jacob Gunter":      { iconUrl: "assets/people/gunter.jpg",     shape: "round", mono: "JG", bg: "#1A1916", fg: "#FFFFFF" },
  "Helena Legarda":    { iconUrl: "assets/people/legarda.jpg",    shape: "round", mono: "HL", bg: "#1A1916", fg: "#FFFFFF" },
  "Johanna Krebs":     { iconUrl: "assets/people/krebs.jpg",      shape: "round", mono: "JK", bg: "#1A1916", fg: "#FFFFFF" },
  "Wendy Chang":       { iconUrl: "assets/people/chang.jpg",      shape: "round", mono: "WC", bg: "#1A1916", fg: "#FFFFFF" },
  "Claus Soong":       { iconUrl: "assets/people/soong.jpg",      shape: "round", mono: "CS", bg: "#1A1916", fg: "#FFFFFF" },
  "Katja Drinhausen":  { iconUrl: "assets/people/drinhausen.jpg", shape: "round", mono: "KD", bg: "#1A1916", fg: "#FFFFFF" },
  "Bernhard Bartsch":  { iconUrl: "assets/people/bartsch.png",    shape: "round", mono: "BB", bg: "#1A1916", fg: "#FFFFFF" },
  "Eva Seiwert":       { iconUrl: "assets/people/seiwert.jpg",    shape: "round", mono: "ES", bg: "#1A1916", fg: "#FFFFFF" },

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

  // Real outlet logos and headshots take precedence over the typographic
  // monogram fallback. Drop an SVG or PNG at assets/icons/<slug>.png (or a
  // headshot at assets/people/<slug>.jpg) and reference it via `iconUrl`.
  // `shape: "round"` crops the badge into a circle (for people).
  if (m && m.iconUrl) {
    const cls = "outlet-badge has-img" + (m.shape === "round" ? " is-round" : "");
    return `<span class="${cls}" aria-label="${escape(name)}">`
      + `<img src="${escape(m.iconUrl)}" alt="" loading="lazy" />`
      + `</span>`;
  }

  if (!m) {
    const fallback = (name || "?").trim().replace(/[^A-Za-z一-鿿]/g, "").charAt(0).toUpperCase() || "·";
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
