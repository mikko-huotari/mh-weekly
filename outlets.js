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
  // ── fetched logos (2026-06-11, max-coverage pass) ──
  "BBC":                      { iconUrl: "assets/icons/bbc.png",            mono: "BBC", bg: "#000000", fg: "#FFFFFF" },
  "Bitter Winter":            { iconUrl: "assets/icons/bitterwinter.png",   mono: "BW",  bg: "#1A1916", fg: "#FFFFFF" },
  "CECC":                     { iconUrl: "assets/icons/cecc.png",           mono: "CE",  bg: "#0F2D59", fg: "#FFFFFF" },
  "Chosun Ilbo":              { iconUrl: "assets/icons/chosunilbo.png",     mono: "CI",  bg: "#1A1916", fg: "#FFFFFF" },
  "China Leadership Monitor": { iconUrl: "assets/icons/clm.png",            mono: "CLM", bg: "#7A1F1F", fg: "#FFFFFF" },
  "HKFP":                     { iconUrl: "assets/icons/hkfp.png",           mono: "HK",  bg: "#C8102E", fg: "#FFFFFF" },
  "Hudson":                   { iconUrl: "assets/icons/hudson.png",         mono: "H",   bg: "#0F2D59", fg: "#FFFFFF" },
  "Just Security":            { iconUrl: "assets/icons/justsecurity.png",   mono: "JS",  bg: "#1A1916", fg: "#FFFFFF" },
  "KrASIA":                   { iconUrl: "assets/icons/krasia.png",         mono: "Kr",  bg: "#1A1916", fg: "#FFFFFF" },
  "Lowy Institute":           { iconUrl: "assets/icons/lowy.png",           mono: "LI",  bg: "#0F2D59", fg: "#FFFFFF" },
  "Asia Society":             { iconUrl: "assets/icons/asiasociety.png",    mono: "AS",  bg: "#FFFFFF", fg: "#1B1B1B" },
  "The Economic Times":       { iconUrl: "assets/icons/economictimes.png",  mono: "ET",  bg: "#E4002B", fg: "#FFFFFF", font: "serif" },
  "International Business Times SG": { iconUrl: "assets/icons/ibtimes.png", mono: "IBT", bg: "#1A1916", fg: "#FFFFFF", font: "serif" },
  "elDiarioAR":               { iconUrl: "assets/icons/eldiario.png",       mono: "eD",  bg: "#0F4C81", fg: "#FFFFFF" },
  "ESB":                      { iconUrl: "assets/icons/esb.png",            mono: "ESB", bg: "#1B7EA0", fg: "#FFFFFF" },
  "International Economic Law and Policy Blog": { iconUrl: "assets/icons/ielp.jpg", mono: "IELP", bg: "#F5F0E6", fg: "#1B1B1B", font: "serif", size: 7 },
  "MarketWatch":              { iconUrl: "assets/icons/marketwatch.png",    mono: "MW",  bg: "#00853D", fg: "#FFFFFF" },
  "North Africa Post":        { iconUrl: "assets/icons/northafricapost.png",mono: "NAP", bg: "#1A1916", fg: "#FFFFFF" },
  "OECD":                     { iconUrl: "assets/icons/oecd.png",           mono: "OE",  bg: "#0F4C81", fg: "#FFFFFF" },
  "PIIE":                     { iconUrl: "assets/icons/piie.png",           mono: "PI",  bg: "#0F2D59", fg: "#FFFFFF" },
  "Sinification":             { iconUrl: "assets/icons/sinification.png",   mono: "Si",  bg: "#1A1916", fg: "#FFFFFF" },
  "Stanford":                 { iconUrl: "assets/icons/stanford.png",       mono: "St",  bg: "#8C1515", fg: "#FFFFFF" },
  "US State Dept":            { iconUrl: "assets/icons/statedept.png",      mono: "DoS", bg: "#0F2D59", fg: "#FFFFFF" },
  "US War Dept":              { iconUrl: "assets/icons/wardept.png",        mono: "DoD", bg: "#1A1916", fg: "#FFFFFF" },
  "The Information":          { iconUrl: "assets/icons/theinformation.png", mono: "Inf", bg: "#000000", fg: "#FFFFFF" },
  "Uyghur Times":             { iconUrl: "assets/icons/uyghurtimes.png",    mono: "UT",  bg: "#1A1916", fg: "#FFFFFF" },
  "Xinhua":                   { iconUrl: "assets/icons/xinhua.png",         mono: "XH",  bg: "#C8102E", fg: "#FFFFFF" },
  "Yicai":                    { iconUrl: "assets/icons/yicai.png",          mono: "YC",  bg: "#C8102E", fg: "#FFFFFF" },
  // alias fixes -> reuse existing logos
  "The New York Times":       { iconUrl: "assets/icons/nyt.png",            mono: "NYT", bg: "#000000", fg: "#FFFFFF", font: "serif", size: 8 },
  "WP":                       { iconUrl: "assets/icons/wapo.png",           mono: "WP",  bg: "#000000", fg: "#FFFFFF", font: "serif" },
  // recreated from MH-provided brand marks (SVG)
  "SCMP":                     { iconUrl: "assets/icons/scmp.svg",           mono: "SCMP",bg: "#001A4B", fg: "#FFC629" },
  "Carnegie":                 { iconUrl: "assets/icons/carnegie.svg",       mono: "C",   bg: "#003A5D", fg: "#FFFFFF" },
  // ---------------- Wires & dailies ----------------
  "FT":              { iconUrl: "assets/icons/ft.png",          mono: "FT",   bg: "#FFF1E5", fg: "#1B1B1B", font: "serif" },
  "NYT":             { iconUrl: "assets/icons/nyt.png",         mono: "NYT",  bg: "#000000", fg: "#FFFFFF", font: "serif", size: 8 },
  "WSJ":             { iconUrl: "assets/icons/wsj.png",         mono: "WSJ",  bg: "#000000", fg: "#FFFFFF", font: "serif", size: 8 },
  "Reuters":         { iconUrl: "assets/icons/reuters.png",     mono: "R",    bg: "#FF8000", fg: "#FFFFFF" },
  "AP":              { iconUrl: "assets/icons/ap.png",          mono: "AP",   bg: "#FA0000", fg: "#FFFFFF" },
  "Bloomberg":       { iconUrl: "assets/icons/bloomberg.png",   mono: "B",    bg: "#000000", fg: "#FA7E1E" },
  "The Guardian":    { iconUrl: "assets/icons/guardian.png",    mono: "G",    bg: "#052962", fg: "#FFFFFF" },
  "Guardian":        { iconUrl: "assets/icons/guardian.png",    mono: "G",    bg: "#052962", fg: "#FFFFFF" },

  // ---------------- China-focused ------------------
  "SCMP":            { mono: "SCMP", bg: "#A11626", fg: "#FFFFFF", size: 7 }, // favicon too small; keep mono
  "Caixin":          { iconUrl: "assets/icons/caixin.png",      mono: "Cx",   bg: "#9C1010", fg: "#FFFFFF" },
  "Caixin Global":   { iconUrl: "assets/icons/caixin.png",      mono: "Cx",   bg: "#9C1010", fg: "#FFFFFF" },
  "Nikkei":          { iconUrl: "assets/icons/nikkei.png",      mono: "N",    bg: "#D4202C", fg: "#FFFFFF" },
  "ChinaTalk":       { iconUrl: "assets/icons/chinatalk.png",   mono: "CT",   bg: "#C41E1E", fg: "#FFFFFF" },
  "Wire China":      { iconUrl: "assets/icons/wirechina.png",   mono: "WC",   bg: "#971418", fg: "#FFFFFF" },
  "Trivium":         { iconUrl: "assets/icons/trivium.png",     mono: "T",    bg: "#7A6F47", fg: "#FFFFFF" },
  "Straits Times":   { iconUrl: "assets/icons/straitstimes.png",mono: "ST",   bg: "#0B3D91", fg: "#FFFFFF" },
  "China Daily":     { iconUrl: "assets/icons/chinadaily.png",  mono: "CD",   bg: "#A91024", fg: "#FFFFFF" },
  "Eastisread":      { iconUrl: "assets/icons/eastisread.png",  mono: "EiR",  bg: "#1A1916", fg: "#FFFFFF", size: 7 },
  "Qiushi":          { mono: "QS",  bg: "#C41E1E", fg: "#FFFFFF" },
  "Guancha":         { mono: "GC",  bg: "#C41E1E", fg: "#FFFFFF" },
  "Yicai":           { mono: "Yi",  bg: "#0F2D59", fg: "#FFFFFF" },
  "Beijing News":    { mono: "BJ",  bg: "#1A1916", fg: "#FFFFFF" },
  "The Diplomat":    { iconUrl: "assets/icons/diplomat.svg", mono: "Dip", bg: "#0F2D59", fg: "#FFFFFF" },
  "Diplomat":        { iconUrl: "assets/icons/diplomat.svg", mono: "Dip", bg: "#0F2D59", fg: "#FFFFFF" },
  "Fortune":         { iconUrl: "assets/icons/fortune.svg",  mono: "F",   bg: "#000000", fg: "#FFFFFF" },
  "Xinhua":          { mono: "XH",  bg: "#003399", fg: "#FFFFFF" },
  "huanqiu.com":     { mono: "GT",  bg: "#C41E1E", fg: "#FFFFFF" },
  "Aisixiang":       { mono: "Ais", bg: "#003366", fg: "#FFFFFF" },
  "21st Century Business Herald": { mono: "21", bg: "#E20000", fg: "#FFFFFF" },
  "ce.cn":           { mono: "CE",  bg: "#005580", fg: "#FFFFFF" },
  "Recodechinaai":   { mono: "Rai", bg: "#1A1916", fg: "#FFFFFF" },

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
  "PIIE":            { mono: "PIIE", bg: "#0B2E5B", fg: "#FFFFFF", size: 7 },
  "Carnegie":        { mono: "Cg",  bg: "#1A1916", fg: "#FFFFFF" }, // favicon too small
  "Carnegie Politika Podcast": { mono: "Cg", bg: "#1A1916", fg: "#FFFFFF" },
  "Carnegie Politika":         { mono: "Cg", bg: "#1A1916", fg: "#FFFFFF" },
  "ECFR":            { mono: "ECF", bg: "#002F6C", fg: "#FFFFFF" },
  "EUISS":           { mono: "EUI", bg: "#0C2340", fg: "#FFFFFF" },
  "Lowy Institute":  { mono: "L",   bg: "#B11226", fg: "#FFFFFF" }, // favicon too small
  "Hudson":          { mono: "Hu",  bg: "#003A70", fg: "#FFFFFF" }, // favicon too small
  "Rhodium":         { iconUrl: "assets/icons/rhodium.png",         mono: "Rh",   bg: "#1A1916", fg: "#FFFFFF" },
  "Rhodium Group × MERICS": { iconUrl: "assets/icons/rhodium.png", mono: "Rh", bg: "#1A1916", fg: "#FFFFFF" },
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
  "ZDF heute":       { mono: "ZDF", bg: "#FF6600", fg: "#FFFFFF" },
  "ZDF":             { mono: "ZDF", bg: "#FF6600", fg: "#FFFFFF" },

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
  "Generalbundesanwalt": { mono: "GBA", bg: "#000000", fg: "#FFFFFF" },
  "European Parliament": { mono: "EP", bg: "#003399", fg: "#FFCC00" },
  "European Commission": { mono: "EC", bg: "#003399", fg: "#FFCC00" },
  "FMPRC":           { mono: "MFA", bg: "#003A70", fg: "#FFFFFF" },
  "MFA":             { mono: "MFA", bg: "#003A70", fg: "#FFFFFF" },
  "Gov.cn":          { mono: "Gov", bg: "#003A70", fg: "#FFFFFF" },
  "Euobserver":      { mono: "EUo", bg: "#0C2340", fg: "#FFFFFF" },

  // ---------------- German press -------------------
  "FAZ — op-ed":      { iconUrl: "assets/icons/faz.png",      mono: "FAZ", bg: "#000000", fg: "#FFFFFF", font: "serif", size: 7 },
  "NZZ — interview":  { iconUrl: "assets/icons/nzz.png",      mono: "NZZ", bg: "#000000", fg: "#FFFFFF", font: "serif", size: 7 },
  "taz":              { mono: "taz", bg: "#C40000", fg: "#FFFFFF" },
  "taz - die tageszeitung": { mono: "taz", bg: "#C40000", fg: "#FFFFFF" },

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
  "Australian":                      { mono: "Aus", bg: "#002F6C", fg: "#FFFFFF" },
  "Github":                          { mono: "Git", bg: "#1A1916", fg: "#FFFFFF" },

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

  // ---------------- W22 review: name variants + missing brands ----------------
  // Real logos that already ship — names just didn't match the key:
  "Die Zeit":         { iconUrl: "assets/icons/zeit.png",          mono: "Z",    bg: "#000000", fg: "#FFFFFF", font: "serif" },
  "New York Times":   { iconUrl: "assets/icons/nyt.png",           mono: "NYT",  bg: "#000000", fg: "#FFFFFF", font: "serif", size: 8 },
  "Handelsblatt Greentech": { iconUrl: "assets/icons/handelsblatt.png", mono: "H", bg: "#E84E0E", fg: "#FFFFFF" },
  "Strait Times":     { iconUrl: "assets/icons/straitstimes.png",  mono: "ST",   bg: "#0B3D91", fg: "#FFFFFF" },
  "Nikkei Asia ":     { iconUrl: "assets/icons/nikkei.png",        mono: "N",    bg: "#D4202C", fg: "#FFFFFF" },
  // Mono variants of existing keys:
  "Aisixiang 爱思想": { mono: "Ais", bg: "#003366", fg: "#FFFFFF" },
  "Qiushi 求是":      { mono: "QS",  bg: "#C41E1E", fg: "#FFFFFF" },
  "Xinhua News":      { mono: "XH",  bg: "#003399", fg: "#FFFFFF" },
  "Global Times":     { mono: "GT",  bg: "#C41E1E", fg: "#FFFFFF" },
  "gov.cn":           { mono: "Gov", bg: "#003A70", fg: "#FFFFFF" },
  "mfa.gov.cn":       { mono: "MFA", bg: "#003A70", fg: "#FFFFFF" },
  "china.com.cn":     { mono: "中",  bg: "#C41E1E", fg: "#FFFFFF" },
  // Chinese government / state bodies:
  "State Council 国务院": { mono: "SC",   bg: "#C41E1E", fg: "#FFFFFF" },
  "State Council":    { mono: "SC",   bg: "#C41E1E", fg: "#FFFFFF" },
  "State Council / MOFCOM": { mono: "SC",  bg: "#C41E1E", fg: "#FFFFFF", size: 7 },
  "NDRC 国家发改委":   { mono: "NDRC", bg: "#C41E1E", fg: "#FFFFFF", size: 7 },
  "NDRC (via NPCSC)": { mono: "NDRC", bg: "#C41E1E", fg: "#FFFFFF", size: 7 },
  "NPCSC":            { mono: "NPC",  bg: "#C41E1E", fg: "#FFFFFF" },
  "MOFCOM":           { mono: "MOF",  bg: "#003A70", fg: "#FFFFFF" },
  "SAMR":             { mono: "SAMR", bg: "#003A70", fg: "#FFFFFF", size: 7 },
  "SASAC / CCP Organization Department": { mono: "SASAC", bg: "#C41E1E", fg: "#FFFFFF", size: 6 },
  "MCA / CCP Organization Department":   { mono: "MCA",   bg: "#C41E1E", fg: "#FFFFFF", size: 7 },
  "PBoC / SAFE / HKMA": { mono: "PBoC", bg: "#003A70", fg: "#FFFFFF", size: 7 },
  "National Audit Office": { mono: "NAO", bg: "#003A70", fg: "#FFFFFF" },
  "Central Military Commission": { mono: "CMC", bg: "#8B0000", fg: "#FFFFFF" },
  "CCP Central Committee":  { mono: "CCP", bg: "#C41E1E", fg: "#FFFFFF" },
  "Xi Jinping / CCP":  { mono: "Xi",  bg: "#C41E1E", fg: "#FFFFFF" },
  "People's Daily (opinion)": { mono: "PD", bg: "#C41E1E", fg: "#FFFFFF" },
  "Xinhua (Global Times echo)": { mono: "XH", bg: "#003399", fg: "#FFFFFF" },
  "China Military":   { mono: "PLA",  bg: "#8B0000", fg: "#FFFFFF" },
  "证券时报":         { mono: "证",  bg: "#C41E1E", fg: "#FFFFFF" },
  "RIPE":             { mono: "RIPE", bg: "#0C2340", fg: "#FFFFFF", size: 7 },
  "NEA 国家能源局":    { mono: "NEA",  bg: "#C41E1E", fg: "#FFFFFF" },
  "CSRC + 7 agencies": { mono: "CSRC", bg: "#003A70", fg: "#FFFFFF", size: 7 },
  "MFA spokesperson Mao Ning": { mono: "MFA", bg: "#003A70", fg: "#FFFFFF" },
  "MFA spokesperson Guo Jiakun 郭嘉昆": { mono: "MFA", bg: "#003A70", fg: "#FFFFFF" },
  "PRC + Serbia":     { mono: "中塞", bg: "#C41E1E", fg: "#FFFFFF", size: 7 },
  "PRC + Pakistan":   { mono: "中巴", bg: "#C41E1E", fg: "#FFFFFF", size: 7 },
  "US State Dept":            { mono: "St",  bg: "#1A1916", fg: "#FFFFFF" },
  // Western / international press + think tanks (no shipped logo — branded mono):
  "Berliner Zeitung": { iconUrl: "assets/icons/berlinerzeitung.png", mono: "BZ",  bg: "#E2001A", fg: "#FFFFFF" },
  "CNBC":             { iconUrl: "assets/icons/cnbc.png",         mono: "CNBC", bg: "#005594", fg: "#FFFFFF", size: 7 },
  "Washington Post":               { iconUrl: "assets/icons/wapo.png",         mono: "WP",  bg: "#000000", fg: "#FFFFFF", font: "serif" },
  "Taipei Times":     { iconUrl: "assets/icons/taipeitimes.png",  mono: "TT",  bg: "#0B5394", fg: "#FFFFFF" },
  "The Information":   { mono: "Inf", bg: "#000000", fg: "#FFFFFF" },
  "Carbon Brief":     { mono: "CB",  bg: "#F39C12", fg: "#FFFFFF" },
  "CREA":             { mono: "CREA", bg: "#1A7A4C", fg: "#FFFFFF", size: 7 },
  "CNAS":             { iconUrl: "assets/icons/cnas.png",         mono: "CNAS", bg: "#0B2E5B", fg: "#FFFFFF", size: 7 },
  "Jamestown":        { iconUrl: "assets/icons/jamestown.png",    mono: "JF",  bg: "#7A1F2B", fg: "#FFFFFF" },
  "Jiemian":          { mono: "JM",  bg: "#0F2D59", fg: "#FFFFFF" },
  "Le Figaro":         { iconUrl: "assets/icons/lefigaro.png",     mono: "LF",  bg: "#0B3D91", fg: "#FFFFFF" },
  "Chosun Ilbo":           { mono: "CI",  bg: "#003366", fg: "#FFFFFF" },
  "Defensenews":      { iconUrl: "assets/icons/defensenews.png",  mono: "DN",  bg: "#1A1916", fg: "#FFFFFF" },
  "Militarytimes":    { iconUrl: "assets/icons/militarytimes.png", mono: "MT",  bg: "#1A1916", fg: "#FFFFFF" },
  "Substack":         { mono: "Sub", bg: "#FF6719", fg: "#FFFFFF" },
  "The Tibet Post":     { mono: "TP",  bg: "#7A1F2B", fg: "#FFFFFF" },
  "Uyghur Times":      { mono: "UT",  bg: "#1A7A8C", fg: "#FFFFFF" },
  "US War Dept":              { mono: "War", bg: "#1A1916", fg: "#FFFFFF" },
  "CREA ":            { mono: "CREA", bg: "#1A7A4C", fg: "#FFFFFF", size: 7 },

  // ---------------- Catch-alls ---------------------
  "Media":           { svg: "news", mono: "···", bg: "#7A786F", fg: "#FFFFFF" }
};

window.outletBadge = function (name) {
  const map = window.OUTLET_MAP || {};
  let m = map[name];
  // Pattern fallbacks for product variants not enumerated above:
  //  - anything "Soapbox …" -> Soapbox mark (check first; it also contains MERICS)
  //  - any other "MERICS …" product (Podcast, China Tech Observatory, …) -> MERICS logo
  if (!m && name) {
    if (/soapbox/i.test(name)) m = { iconUrl: "assets/icons/soapbox.png", mono: "S", bg: "#0A0A0A", fg: "#FFFFFF" };
    else if (/merics/i.test(name)) m = map["MERICS"];
  }
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
      + `<img src="${escape(m.iconUrl)}" alt="" loading="eager" />`
      + `</span>`;
  }

  // Inline-SVG glyphs (currently only the generic "news" icon for multi-source
  // bullets). Keeps the asset tree tidy — no extra PNG to ship.
  if (m && m.svg === "news") {
    const svg = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" '
      + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" '
      + 'aria-hidden="true"><rect x="3" y="5" width="14" height="11" rx="1"/>'
      + '<line x1="6" y1="9" x2="14" y2="9"/><line x1="6" y1="12" x2="14" y2="12"/>'
      + '<line x1="6" y1="14.5" x2="11" y2="14.5"/></svg>';
    return `<span class="outlet-badge has-svg" style="background:${m.bg};color:${m.fg}" `
      + `aria-label="${escape(name)}">${svg}</span>`;
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
