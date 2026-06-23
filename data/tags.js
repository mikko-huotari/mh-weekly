// Controlled vocabulary for entry tags — ONLINE VERSION ONLY.
//
// Tags must NEVER be propagated to:
//   - 2 ROKU/ROUTINE - Update MH@MERICS/W-XX.md
//   - W-XX — Export.md
//   - the weekly PDF
//   - the email draft
//   - any SharePoint upload
//
// Tags live exclusively in data/W-XX-2026.js so they only appear on
// https://mikko-huotari.github.io/mh-weekly/.
//
// Schema:
//   - `id`    : URL-safe slug (used in data files and in filter hash)
//   - `label` : display string (rendered on chips)
//   - `group` : id of one of the groups below

window.TAGS = {
  version: 1,
  groups: [
    { id: "geo",       label: "Bilateral & geographic" },
    { id: "sector",    label: "Sectors / tech" },
    { id: "domestic",  label: "Domestic CN" },
    { id: "geoecon",   label: "Geoeconomics tools" },
    { id: "defense",   label: "Defense & external" },
    { id: "discourse", label: "Discourse" }
  ],
  tags: [
    // Bilateral & geographic
    { id: "us-cn",        label: "US-CN",        group: "geo" },
    { id: "eu-cn",        label: "EU-CN",        group: "geo" },
    { id: "de-cn",        label: "DE-CN",        group: "geo" },
    { id: "uk-cn",        label: "UK-CN",        group: "geo" },
    { id: "jp-cn",        label: "JP-CN",        group: "geo" },
    { id: "india-cn",     label: "IN-CN",        group: "geo" },
    { id: "twn",          label: "Taiwan",       group: "geo" },
    { id: "hk",           label: "Hong Kong",    group: "geo" },
    { id: "mid-east",     label: "Mid-East",     group: "geo" },
    { id: "ru-cn",        label: "RU-CN",        group: "geo" },
    { id: "sea",          label: "SEA",          group: "geo" },
    { id: "latam",        label: "LatAm",        group: "geo" },
    { id: "afr",          label: "Africa",       group: "geo" },
    { id: "sco",          label: "SCO",          group: "geo" },
    { id: "brics",        label: "BRICS",        group: "geo" },

    // Sectors / tech
    { id: "semcon",       label: "Semcon",       group: "sector" },
    { id: "ai",           label: "AI",           group: "sector" },
    { id: "auto",         label: "Auto",         group: "sector" },
    { id: "batteries",    label: "Batteries",    group: "sector" },
    { id: "robotics",     label: "Robotics",     group: "sector" },
    { id: "bio-pharma",   label: "Bio/Pharma",   group: "sector" },
    { id: "rare-earths",  label: "Rare earths",  group: "sector" },
    { id: "energy",       label: "Energy",       group: "sector" },
    { id: "mil-tech",     label: "Mil-tech",     group: "sector" },
    { id: "aerospace",    label: "Aerospace",    group: "sector" },

    // Domestic CN
    { id: "macro",        label: "Macro",        group: "domestic" },
    { id: "property",     label: "Property",     group: "domestic" },
    { id: "society",      label: "Society",      group: "domestic" },
    { id: "ideology",     label: "Ideology",     group: "domestic" },
    { id: "corruption",   label: "Corruption",   group: "domestic" },
    { id: "security",     label: "Security",     group: "domestic" },
    { id: "climate",      label: "Climate",      group: "domestic" },
    { id: "markets",      label: "Markets",      group: "domestic" },

    // Geoeconomics tools
    { id: "trade",            label: "Trade",             group: "geoecon" },
    { id: "export-controls",  label: "Export controls",   group: "geoecon" },
    { id: "investment-screening", label: "Inv. screening", group: "geoecon" },
    { id: "sanctions",        label: "Sanctions",         group: "geoecon" },
    { id: "investment",       label: "Investment",        group: "geoecon" },
    { id: "supply-chain",     label: "Supply chain",      group: "geoecon" },
    { id: "bri",              label: "BRI",               group: "geoecon" },
    { id: "industrial-policy", label: "Industrial policy", group: "geoecon" },

    // Defense & external
    { id: "pla",          label: "PLA",          group: "defense" },
    { id: "fimi",         label: "FIMI",         group: "defense" },
    { id: "cyber",        label: "Cyber",        group: "defense" },
    { id: "nuclear",      label: "Nuclear",      group: "defense" },
    { id: "maritime",     label: "Maritime",     group: "defense" },
    { id: "espionage",    label: "Espionage",    group: "defense" },
    { id: "diplomacy",    label: "Diplomacy",    group: "defense" },

    // Discourse
    { id: "cn-discourse", label: "CN discourse", group: "discourse" },
    { id: "propaganda",   label: "Propaganda",   group: "discourse" },

    // Domestic CN (continued)
    { id: "human-rights", label: "Human rights", group: "domestic" }
  ]
};
