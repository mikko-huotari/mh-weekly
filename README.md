# MH@MERICS Weekly Update — Archive

Personal weekly China brief by Mikko Huotari, archived as a single-page interactive
website. Each issue lives as one JavaScript data file under `data/`; the renderer
assembles them into a navigable archive with four tabs, scrollspy sub-navigation,
search, and per-issue PDF links.

---

## Hosting

- **`main` branch** → deployed to https://mh-weekly.pages.dev/ via Cloudflare Pages, gated by Cloudflare Access (Email OTP, allowlist from `.w20_bcc.json`).
- **`redirect-stub` branch** → deployed to https://mikko-huotari.github.io/mh-weekly/ via GitHub Pages. Contains only a tiny `index.html` that 302s to `mh-weekly.pages.dev` (preserves `#W…` hash). Keeps the old sent URLs alive.

Do not merge `redirect-stub` into `main`. It exists only so the legacy GH Pages URL keeps working without serving the archive content publicly.

## Repo layout

```
index.html                       # Page shell + all CSS inline
render.js                        # Renderer: tabs, scrollspy, hash routing
search.js                        # Search modal + cross-week index
outlets.js                       # Outlet → badge mapping (logo / monogram)

data/
  W19-2026.js                    # One issue per file
  W16-2026.js
  W19-2026-wochenbericht.js      # Wochenbericht in a companion file (size only)

assets/
  charts/W19-chart-{1..5}.jpg    # Top Charts extracted from PDFs
  icons/                         # (optional) outlet logos: ft.svg, nyt.svg, ...
  people/                        # (optional) author headshots: gunter.jpg, ...
  merics_logo_short.png

fonts/                           # Neo Sans Pro OTFs
pdfs/                            # Source PDFs linked from the Download PDF button
```

The site is static — open `index.html` in a browser and it works. No build
step, no backend.

---

## Adding a new week

Three options, in order of how much code you want to touch.

### Option A — send the PDF to me (easiest)

Open a new chat **in this project** and attach the new week's PDF. The project
preserves all files between chats. I'll:

1. Extract content from the PDF
2. Create `data/W{N}-{Y}.js` (and a wochenbericht companion if applicable)
3. Register it in `render.js`
4. Drop the source PDF in `pdfs/`
5. Extract Top Charts to `assets/charts/`

Estimated round-trip: 15–30 minutes for one week, assuming the PDF structure
matches W19.

### Option B — edit the data files yourself

Copy `data/W19-2026.js` → `data/W{N}-{Y}.js` and overwrite the strings. Update
the `WEEKS` array in `render.js`:

```js
const WEEKS = [window.W20_2026, window.W19_2026, window.W16_2026]
  .filter(Boolean)
  .sort((a, b) => (b.year - a.year) || (b.week - a.week));
```

Add a `<script src="data/W{N}-{Y}.js"></script>` to `index.html` (next to the
existing data files). Drop the PDF in `pdfs/`, set `pdf:` on the week object.

### Option C — GitHub + Claude Code

Use the GitHub connector to push this project to a repo, then maintain via
Claude Code with the repo open locally. Same content work as A/B but with PR
review and rollback. Recommended once the archive is shipped.

---

## Issue data shape

Every week file exports one global:

```js
window.W19_2026 = {
  id: "W19-2026",
  week: 19,
  year: 2026,
  dateRange: "4 – 10 May 2026",
  pdf: "pdfs/W19-2026.pdf",

  spotlight: { title, intro, items: [...] },
  contextSections: [{ label, groups: [{ label, items }] }],
  researchSections: [{ label, groups: [{ label, note, items }] }],
  numberedSections: [{ number, slug, short, label, note, items }],
  topCharts: [{ src, alt, caption }]
};
```

### Entry shapes

| Variant | Used by | Shape |
|---|---|---|
| Article-style | Spotlight, MERICS research, Numbered sections | `{ outlet, title, date, url, bullets: [[lead, rest], …] }` |
| One-line note | German policy in context | `{ outlet, date, url, note }` |
| Quote / fact | Wochenbericht §1, §2 | `{ kind: "quote"\|"fact", lead, text, source: { outlet, title, date } }` |
| Theme | Wochenbericht §3 | `{ kind: "theme", title, text, sources: [{ outlet, title, date }, …] }` |

### Sub-section slugs

`numberedSections[].slug` controls the URL hash and chip nav. Stable slugs
across weeks: `debates`, `econ`, `domestic` ("Politics" label), `tech`, `trade`,
`foreign`, `responses`.

Tab III chips render in that fixed order; only the slugs present in a given
week show up. Wochenbericht uses `quotes`, `facts`, `themes`.

---

## Outlet logos & author headshots

`outlets.js` is the master map of outlet name → badge styling. Two ways to
override the typographic monogram:

```js
// Real outlet logo (square)
"FT": {
  iconUrl: "assets/icons/ft.svg",
  mono: "FT", bg: "#FFF1E5", fg: "#1B1B1B", font: "serif"
},

// Author headshot (round)
"Jacob Gunter": {
  iconUrl: "assets/people/gunter.jpg",
  shape: "round",
  mono: "JG", bg: "#1A1916", fg: "#fff"
},
```

The renderer uses `iconUrl` when present; the monogram becomes the fallback
for outlets you haven't sourced. Asset specs:

- **Outlet logos**: SVG preferred (sharp at any size); PNG ≥48×48 works
- **Headshots**: JPG/PNG ≥400×400, square crop, ~80 KB each

---

## URL / hash routing

| Hash | Lands on |
|---|---|
| `#W19-2026` | Tab I default |
| `#W19-2026/hl-spotlight` | Tab I, Spotlight section |
| `#W19-2026/mr-publications` | Tab II, Publications group |
| `#W19-2026/econ` | Tab III, §1 Econ |
| `#W19-2026/quotes` | Tab IV, §1 Zitate |

Hash format: `#{weekId}/{slug}`. Hashes update silently as you scroll past
sections (scrollspy via `replaceState`). Deep-linkable.

---

## Shipping / hosting

The site is static. Three reasonable paths:

- **Standalone HTML**: ask me to bundle into one self-contained
  `MH-MERICS-archive.html` (~3 MB, works offline, email-attachable).
- **Static hosting**: GitHub Pages / Netlify / Cloudflare Pages — free, custom
  domain, auto-deploy on push. Recommended for ongoing use.
- **MERICS intranet**: copy the folder to any static webserver. No backend.

### If it shouldn't be public

Front the site with Cloudflare Access or your existing MERICS SSO. Don't try
JS-side gating — it's not auth, just obfuscation.

---

## Key files at a glance

- `index.html` — page chrome, CSS, script tags. Edit here for layout/style.
- `render.js` — tab logic, scrollspy, anchor scrolling, hash routing.
- `search.js` — search modal, builds an in-memory cross-week index on first
  open.
- `outlets.js` — outlet → badge mapping. The most-edited file as logos arrive.
- `data/W{N}-{Y}.js` — content per week. Largest churn over time.

## Browser support

Tested on Chrome / Safari / Firefox current versions. Uses `position: sticky`,
`IntersectionObserver` (search), `history.replaceState`, ES2018+. No
transpiler.

---

Built by Claude for MERICS. Edit freely.
