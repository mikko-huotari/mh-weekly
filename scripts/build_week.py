"""
Convert a 'W-XX — Export.md' file into data/W{N}-{Y}.js for the archive site.

Usage:
    python scripts/build_week.py W18-2026

Reads:  "2 ROKU/ROUTINE - Update MH@MERICS/W18-2026 — Export.md"
Writes: data/W18-2026.js  (and data/W18-2026-wochenbericht.js if Wochenbericht section present)

Mirrors the schema produced by Claude Design for W19. The output is intentionally
mechanical — editorial polish (Spotlight bylines, GER/EU/G7 grouping, custom
short labels) must be applied by hand after running this.
"""
from __future__ import annotations

import json
import re
import sys
from datetime import date
from pathlib import Path

VAULT = Path.home() / "OneDrive - Mercator Institute for China Studies gGmbH" / "Dokumente" / "MH"
EXPORT_DIR = VAULT / "2 ROKU" / "ROUTINE - Update MH@MERICS"
REPO = Path(__file__).resolve().parent.parent
DATA_DIR = REPO / "data"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def js_string(s: str) -> str:
    """Encode a Python string as a JavaScript double-quoted literal."""
    return json.dumps(s, ensure_ascii=False)


WEEK_START_OF_2026 = date(2025, 12, 29)  # ISO week 1 of 2026 starts on Mon 29 Dec 2025.


def week_date_range(year: int, week: int) -> str:
    """Return e.g. '4 - 10 May 2026' for week 19 of 2026."""
    # ISO week 1 contains the first Thursday of the year.
    from datetime import timedelta
    # Find Jan 4 of the year (always in week 1 per ISO 8601)
    jan4 = date(year, 1, 4)
    week1_monday = jan4 - timedelta(days=jan4.weekday())
    monday = week1_monday + timedelta(weeks=week - 1)
    sunday = monday + timedelta(days=6)
    if monday.month == sunday.month:
        return f"{monday.day} – {sunday.day} {sunday.strftime('%b %Y')}"
    return f"{monday.day} {monday.strftime('%b')} – {sunday.day} {sunday.strftime('%b %Y')}"


# ---------------------------------------------------------------------------
# Parse export
# ---------------------------------------------------------------------------

ARTICLE_HEADER_RE = re.compile(
    r"^###\s+"
    r"\*\*(?P<outlet>[^*]+)\*\*"
    r"(?:\s*\((?P<author>[^)]+)\))?"
    r":\s*"
    r'"\s*\*\*(?P<title>[^*]+)\*\*\s*"'
    r"\s*,\s*"
    r"(?P<date>[\d\-]*)"
    r"\s*,\s*"
    r"(?:\[Link\]\((?P<url1>[^)]+)\)|<(?P<url2>[^>]+)>)",
    re.IGNORECASE | re.MULTILINE,
)

# Matches: "- **Bold lead-in**: rest of bullet"
BULLET_RE = re.compile(
    r"^-\s+\*\*(?P<lead>[^*]+?)\*\*\s*:\s*(?P<rest>.+?)\s*$",
    re.MULTILINE,
)

# Matches a plain link bullet in the German policy context section.
PLAIN_BULLET_RE = re.compile(r"^-\s+(.+?)$", re.MULTILINE)
INLINE_LINK_RE = re.compile(r"\[(?P<text>[^\]]+)\]\((?P<url>https?://[^)\s]+)\)")


def parse_article_block(block: str) -> dict | None:
    """Parse one '### header + bullets' block into an entry dict."""
    m = ARTICLE_HEADER_RE.search(block)
    if not m:
        return None
    outlet = m.group("outlet").strip()
    title = m.group("title").strip()
    raw_date = (m.group("date") or "").strip()
    url = (m.group("url1") or m.group("url2") or "").strip()
    # Bullets follow the header
    body = block[m.end():]
    bullets: list[list[str]] = []
    for bm in BULLET_RE.finditer(body):
        bullets.append([bm.group("lead").strip(), bm.group("rest").strip()])
    entry = {
        "outlet": outlet,
        "title": title,
        "date": raw_date,
        "url": url,
        "bullets": bullets,
    }
    return entry


def split_article_blocks(text: str) -> list[str]:
    """Split text into blocks delimited by '### **...' article headers."""
    parts = re.split(r"(?=^###\s+\*\*)", text, flags=re.MULTILINE)
    return [p for p in parts if p.strip()]


def parse_section(text: str, header: str) -> tuple[str | None, str]:
    """Return (section_body, remaining_text) for the next '## header' block.

    `header` is a substring that must appear in the section title.
    """
    pattern = re.compile(rf"^##\s+.*{re.escape(header)}.*$", re.MULTILINE)
    m = pattern.search(text)
    if not m:
        return None, text
    start = m.end()
    # Find the next '##' or '#' (basket separator)
    nxt = re.search(r"^(##\s|#\s)", text[start:], re.MULTILINE)
    end = start + nxt.start() if nxt else len(text)
    return text[start:end].strip(), text


def find_section(text: str, header_re: str) -> tuple[int, int]:
    """Return (start_of_body, end_of_body) for a `## ... header_re ...` block."""
    pattern = re.compile(rf"^##\s+.*{header_re}.*$", re.MULTILINE)
    m = pattern.search(text)
    if not m:
        return -1, -1
    start = m.end()
    nxt = re.search(r"^(##\s|#\s)", text[start:], re.MULTILINE)
    end = start + nxt.start() if nxt else len(text)
    return start, end


# ---------------------------------------------------------------------------
# Numbered sections
# ---------------------------------------------------------------------------

NUMBERED_LABELS = {
    "1": ("econ",      "Econ",          "Domestic economic situation and policy"),
    "2": ("domestic",  "Domestic",      "Politics and society"),
    "3":  ("geoecon",   "Geoecon",       "Geoeconomics: trade, tech, finance, investment"),
    "3a": ("tech",     "Geoecon · Tech","Geoeconomics — tech & innovation"),
    "3b": ("trade",    "Geoecon · Trade","Geoeconomics — trade, finance & industrial policy"),
    "4":  ("foreign",  "Foreign",       "Foreign policy and 'Global China'"),
    "5":  ("responses","Responses",     "Strategic implications and responses"),
}


def parse_chinese_debates_section(text: str) -> dict | None:
    """Parse `## Chinese debates` under Part III as another tabbable section."""
    m = re.search(r"^##\s+Chinese debates\s*$", text, re.MULTILINE)
    if not m:
        return None
    start = m.end()
    nxt = re.search(r"^(##\s+(?:\d+[a-z]?|[IVX]+)|#\s+[IVX]+\.)", text[start:], re.MULTILINE)
    end = start + nxt.start() if nxt else len(text)
    body = text[start:end]
    items: list[dict] = []
    for block in split_article_blocks(body):
        entry = parse_article_block(block)
        if entry is None and "_parse_relaxed_article_block" in globals():
            entry = _parse_relaxed_article_block(block)
        if entry:
            items.append(entry)
    if not items:
        return None
    return {
        "number": "",
        "slug": "debates",
        "short": "CN Debates",
        "label": "Chinese debates",
        "items": items,
    }


def parse_numbered_section(text: str, number: str) -> dict | None:
    """Find `## N. ...` heading and extract article entries underneath."""
    # Accept e.g. '## 1.' or '## 3a.' allowing punctuation variants.
    pat = re.compile(rf"^##\s+{re.escape(number)}\.\s+(?P<label>.+)$", re.MULTILINE)
    m = pat.search(text)
    if not m:
        return None
    start = m.end()
    # End at next `## N.` heading at the same level OR `# III.`
    nxt = re.search(r"^(##\s+(?:\d+[a-z]?|[IVX]+)|#\s+[IVX]+\.)", text[start:], re.MULTILINE)
    end = start + nxt.start() if nxt else len(text)
    body = text[start:end]

    items = []
    for block in split_article_blocks(body):
        entry = parse_article_block(block)
        if entry:
            items.append(entry)

    slug, short, label = NUMBERED_LABELS.get(number, (number, number, m.group("label").strip()))
    return {
        "number": number,
        "slug": slug,
        "short": short,
        "label": label,
        "items": items,
    }


# ---------------------------------------------------------------------------
# Context section (German China policy in context)
# ---------------------------------------------------------------------------

def _rewrite_bold_link_lead(match: "re.Match[str]") -> str:
    """Rewrite `**Title** ([Outlet](url){tail})` so the bold headline carries the
    link and the redundant outlet name (already shown as a badge) is dropped.
    Any additional content after the outlet (e.g. "praise by [Global Times](url2)")
    is preserved inside parens."""
    title = match.group(1)
    url = match.group(3)
    tail = match.group(4).lstrip(",").strip()
    if tail:
        return f"**[{title}]({url})** ({tail})"
    return f"**[{title}]({url})**"


def _context_item_from_line(raw_line: str) -> dict:
    line = raw_line.strip()[2:].strip()  # drop leading '- '
    link = INLINE_LINK_RE.search(line)
    if not link:
        return {"outlet": "", "date": "", "url": "", "note": line}
    text_part = link.group("text")
    url = link.group("url")
    outlet = text_part.split("|")[-1].strip() if "|" in text_part else text_part.split("—")[-1].strip() or text_part
    note = line.strip(" -—")
    note = re.sub(
        r"\*\*([^*]+?)\*\*\s+\(\[([^\]]+)\]\((https?://[^)\s]+)\)((?:[^()]|\([^)]*\))*)\)",
        _rewrite_bold_link_lead,
        note, count=1,
    )
    return {"outlet": outlet[:40], "date": "", "url": url, "note": note}


def parse_context_section(text: str) -> dict | None:
    pat = re.compile(r"^##\s+German China policy in context\s*$", re.MULTILINE)
    m = pat.search(text)
    if not m:
        return None
    start = m.end()
    nxt = re.search(r"^(##\s|#\s)", text[start:], re.MULTILINE)
    end = start + nxt.start() if nxt else len(text)
    body = text[start:end].strip()

    # Honor `### Subgroup` headings if present (e.g. GER / EU / G7); otherwise
    # fall back to a single ungrouped list.
    h3_iter = list(re.finditer(r"^###\s+(.+?)\s*$", body, re.MULTILINE))
    if h3_iter:
        groups = []
        for i, h in enumerate(h3_iter):
            label = h.group(1).strip()
            sub_start = h.end()
            sub_end = h3_iter[i + 1].start() if i + 1 < len(h3_iter) else len(body)
            sub_items = [
                _context_item_from_line(line)
                for line in body[sub_start:sub_end].splitlines()
                if line.strip().startswith("- ")
            ]
            if sub_items:
                groups.append({"label": label, "items": sub_items})
    else:
        items = [
            _context_item_from_line(line)
            for line in body.splitlines()
            if line.strip().startswith("- ")
        ]
        groups = [{"label": "", "items": items}]

    return {
        "label": "German China policy in context",
        "groups": groups,
    }


# ---------------------------------------------------------------------------
# Research section
# ---------------------------------------------------------------------------

def _parse_relaxed_article_block(block: str) -> dict | None:
    """Permissive '### ...' parser for Publications-style headers that don't
    match the strict ARTICLE_HEADER_RE (e.g. MERICS China Industries Brief
    where the title sits inside the bold span)."""
    m = re.search(r"^###\s+(.+?)$", block, re.MULTILINE)
    if not m:
        return None
    header = m.group(1).strip()
    bold_m = re.search(r"\*\*([^*]+)\*\*", header)
    outlet = (bold_m.group(1).split(":")[0].strip() if bold_m else "MERICS")[:60]
    link_m = INLINE_LINK_RE.search(header)
    url = link_m.group("url") if link_m else ""
    date_m = re.search(r"(\d{4}-\d{2}-\d{2})", header)
    raw_date = date_m.group(1) if date_m else ""
    title_m = re.search(r'"\s*\*\*([^*]+)\*\*\s*"', header) or re.search(r'"\s*([^"]+)\s*"', header)
    if title_m:
        title = title_m.group(1).strip()
    elif bold_m and ":" in bold_m.group(1):
        title = bold_m.group(1).split(":", 1)[1].strip(' "')
    else:
        title = header
    body = block[m.end():]
    bullets: list[list[str]] = []
    for bm in BULLET_RE.finditer(body):
        bullets.append([bm.group("lead").strip(), bm.group("rest").strip()])
    if not bullets:
        for line in body.splitlines():
            ls = line.strip()
            if ls.startswith("- "):
                bullets.append(["", ls[2:].strip()])
    return {"outlet": outlet, "title": title, "date": raw_date, "url": url, "bullets": bullets}


def _parse_part_ii_new_schema(text: str) -> dict | None:
    """W20+ Part II: `# II. MERICS` containing `## Publications`, `## Selected
    insights for media by colleagues`, etc. Top Charts is skipped."""
    m = re.search(r"^#\s+II\.\s+MERICS\s*$", text, re.MULTILINE)
    if not m:
        return None
    start = m.end()
    nxt = re.search(r"^#\s+III\.", text[start:], re.MULTILINE)
    end = start + nxt.start() if nxt else len(text)
    body = text[start:end]

    sub_headers = list(re.finditer(r"^##\s+(.+?)\s*$", body, re.MULTILINE))
    groups = []
    for i, sh in enumerate(sub_headers):
        label = sh.group(1).strip()
        if "Top Chart" in label or "Visual" in label:
            continue
        sub_start = sh.end()
        sub_end = sub_headers[i + 1].start() if i + 1 < len(sub_headers) else len(body)
        sub_body = body[sub_start:sub_end]

        items: list[dict] = []
        for block in split_article_blocks(sub_body):
            entry = parse_article_block(block) or _parse_relaxed_article_block(block)
            if entry:
                items.append(entry)
        if not items:
            for line in sub_body.splitlines():
                ls = line.strip()
                if not ls.startswith("- "):
                    continue
                content = ls[2:].strip()
                links = list(INLINE_LINK_RE.finditer(content))
                url = links[0].group("url") if links else ""
                if len(links) > 1:
                    # Multi-source bullet — use the generic Media badge so we
                    # don't misleadingly pin the entry to the first outlet in
                    # the list.
                    outlet = "Media"
                elif links:
                    outlet = links[0].group("text")[:40]
                else:
                    outlet = "MERICS"
                # Keep `[text](url)` markdown so inlineMd renders each outlet
                # name as its own clickable link in the rendered bullet.
                items.append({
                    "outlet": outlet, "title": "", "date": "", "url": url,
                    "bullets": [["", content]],
                })
        if items:
            groups.append({"label": label, "items": items})

    if not groups:
        return None
    return {"label": "MERICS", "groups": groups}


def parse_research_section(text: str) -> dict | None:
    new_schema = _parse_part_ii_new_schema(text)
    if new_schema:
        return new_schema
    # Legacy W19 schema: `## MERICS research and (media) insights` with **Bold** group labels
    pat = re.compile(r"^##\s+MERICS research and \(media\) insights\s*$", re.MULTILINE)
    m = pat.search(text)
    if not m:
        return None
    start = m.end()
    nxt = re.search(r"^(##\s|#\s)", text[start:], re.MULTILINE)
    end = start + nxt.start() if nxt else len(text)
    body = text[start:end].strip()

    groups = []
    current_label = None
    current_items: list[dict] = []
    for line in body.splitlines():
        ls = line.strip()
        if re.fullmatch(r"\*\*[^*]+\*\*", ls):
            if current_label and current_items:
                groups.append({"label": current_label, "items": current_items})
            current_label = ls.strip("*").strip()
            current_items = []
        elif ls.startswith("- "):
            content = ls[2:].strip()
            link = INLINE_LINK_RE.search(content)
            url = link.group("url") if link else ""
            outlet = (link.group("text") if link else "MERICS")[:40]
            note = INLINE_LINK_RE.sub(lambda mm: mm.group("text"), content)
            current_items.append({
                "outlet": outlet, "title": "", "date": "", "url": url,
                "bullets": [["", note]],
            })
    if current_label and current_items:
        groups.append({"label": current_label, "items": current_items})

    return {"label": "MERICS research and (media) insights", "groups": groups}


# ---------------------------------------------------------------------------
# Spotlight section
# ---------------------------------------------------------------------------

def _split_spotlight_subsection(body: str) -> tuple[list[str], list[dict]]:
    """Split a Spotlight sub-section body into intro paragraphs and bullet items."""
    intro_parts: list[str] = []
    items: list[dict] = []
    in_bullets = False
    for line in body.splitlines():
        ls = line.strip()
        if not ls:
            continue
        if ls.startswith("- "):
            in_bullets = True
            items.append({"note": ls[2:].strip()})
        elif not in_bullets:
            intro_parts.append(ls)
    return intro_parts, items


def _parse_one_spotlight(title: str, body: str) -> dict:
    """Parse a single (already-sliced) Spotlight body into its dict."""
    # Split off the trailing `Sources:` block (sits inside the Spotlight section
    # but is a flat link list, not part of any H3 sub-section).
    sources_items: list[dict] = []
    sources_m = re.search(r"^Sources?:\s*$", body, re.MULTILINE)
    if sources_m:
        for line in body[sources_m.end():].splitlines():
            ls = line.strip()
            if ls.startswith("- "):
                sources_items.append({"note": ls[2:].strip()})
        body = body[:sources_m.start()]

    h3_iter = list(re.finditer(r"^###\s+(.+?)\s*$", body, re.MULTILINE))
    top_end = h3_iter[0].start() if h3_iter else len(body)
    intro_parts, items = _split_spotlight_subsection(body[:top_end])

    subsections: list[dict] = []
    for i, h in enumerate(h3_iter):
        label = h.group(1).strip()
        sub_start = h.end()
        sub_end = h3_iter[i + 1].start() if i + 1 < len(h3_iter) else len(body)
        sub_intro, sub_items = _split_spotlight_subsection(body[sub_start:sub_end])
        subsections.append({
            "label": label,
            "intro": " ".join(sub_intro).strip(),
            "items": sub_items,
        })

    if sources_items:
        subsections.append({
            "label": "Selected sources",
            "intro": "",
            "items": sources_items,
        })

    return {
        "title": title,
        "intro": " ".join(intro_parts).strip(),
        "items": items,
        "subsections": subsections,
    }


def parse_spotlight_sections(text: str) -> list[dict]:
    """Parse every `## Spotlight ...` heading into its own spotlight dict.
    Each spotlight's body runs to the next `##`/`#` heading (including the next
    Spotlight), so multiple spotlights stay separate."""
    heads = list(re.finditer(r"^##\s+(Spotlight[^\n]*)$", text, re.MULTILINE))
    out: list[dict] = []
    for m in heads:
        title = m.group(1).strip()
        start = m.end()
        nxt = re.search(r"^(##\s|#\s)", text[start:], re.MULTILINE)
        end = start + nxt.start() if nxt else len(text)
        out.append(_parse_one_spotlight(title, text[start:end]))
    return out


def parse_spotlight_section(text: str) -> dict:
    """First Spotlight only (back-compat). Prefer parse_spotlight_sections()."""
    sections = parse_spotlight_sections(text)
    if not sections:
        return {"title": "Spotlight", "intro": "", "items": [], "subsections": []}
    return sections[0]


# ---------------------------------------------------------------------------
# Top Charts section
# ---------------------------------------------------------------------------

# Match either '![alt](path)' or a bold label line preceding it.
_IMG_RE = re.compile(r"!\[(?P<alt>[^\]]*)\]\((?P<src>[^)\s]+)(?:\s+\"[^\"]*\")?\)")


def _md_table_to_html(table_md: str) -> str:
    """Convert a GitHub-style markdown table block into an HTML <table>."""
    lines = [l for l in table_md.splitlines() if l.strip().startswith("|")]
    if len(lines) < 2:
        return ""
    def cells(row: str) -> list[str]:
        return [c.strip() for c in row.strip().strip("|").split("|")]
    header = cells(lines[0])
    data_rows = [cells(l) for l in lines[2:]] if len(lines) >= 3 else []
    def esc(s: str) -> str:
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    thead = "".join(f"<th>{esc(c)}</th>" for c in header)
    tbody = "".join(
        "<tr>" + "".join(f"<td>{esc(c)}</td>" for c in row) + "</tr>"
        for row in data_rows
    )
    return (
        f'<table class="chart-table">'
        f'<thead><tr>{thead}</tr></thead>'
        f'<tbody>{tbody}</tbody></table>'
    )


def parse_top_charts_section(text: str, week_id: str) -> list[dict]:
    """Parse `## Top Charts/Visuals` images plus the bold caption preceding
    each image AND any supplement (e.g. markdown reference table) immediately
    following the image. Copies any locally-referenced PNG into
    `assets/charts/W{NN}-chart-{N}.png` and returns the topCharts payload."""
    m = re.search(r"^##\s+Top Charts(?:/Visuals)?\s*$", text, re.MULTILINE)
    if not m:
        return []
    start = m.end()
    nxt = re.search(r"^(##\s|#\s)", text[start:], re.MULTILINE)
    end = start + nxt.start() if nxt else len(text)
    body = text[start:end]

    repo_root = Path(__file__).resolve().parents[1]
    assets_dir = repo_root / "assets" / "charts"
    assets_dir.mkdir(parents=True, exist_ok=True)

    paragraphs = re.split(r"\n\s*\n", body)
    charts: list[dict] = []
    pending_caption = ""
    chart_n = 0
    last_chart: dict | None = None

    for para in paragraphs:
        para_stripped = para.strip()
        if not para_stripped:
            continue
        imgs = list(_IMG_RE.finditer(para))
        if not imgs:
            # Markdown table → supplement attached to the previous chart.
            if para_stripped.startswith("|"):
                if last_chart is not None:
                    last_chart["supplementHtml"] = _md_table_to_html(para_stripped)
                continue
            pending_caption = para_stripped
            continue
        # Same-paragraph text takes precedence over the pending caption.
        para_text = _IMG_RE.sub("", para).strip()
        caption_src = para_text or pending_caption
        pending_caption = ""

        for img in imgs:
            chart_n += 1
            alt = img.group("alt").strip() or f"Top chart {chart_n}"
            src = img.group("src").strip()
            caption = caption_src.strip() if caption_src else ""

            from urllib.parse import unquote
            if src.startswith("http://") or src.startswith("https://"):
                chart = {"src": src, "alt": alt, "caption": caption}
                charts.append(chart)
                last_chart = chart
                continue
            rel = unquote(src)
            src_path = (EXPORT_DIR / rel).resolve()
            if not src_path.exists():
                print(f"  WARN: chart {chart_n} source not found: {src_path}")
                continue
            out_name = f"{week_id}-chart-{chart_n}.png"
            out_path = assets_dir / out_name
            try:
                import shutil
                shutil.copyfile(src_path, out_path)
                chart = {"src": f"assets/charts/{out_name}", "alt": alt, "caption": caption}
                charts.append(chart)
                last_chart = chart
                print(f"  copied chart {chart_n}: {src_path.name} -> {out_name}")
            except Exception as e:
                print(f"  WARN: failed to copy chart {chart_n}: {e}")
    return charts


# ---------------------------------------------------------------------------
# JS serialization
# ---------------------------------------------------------------------------

def write_data_file(week_id: str, payload: dict, out: Path) -> None:
    var_name = f"window.{week_id.replace('-', '_')}"
    lines = [
        f"// {week_id} — generated by scripts/build_week.py",
        f"// Hand-edit Spotlight, group labels, and short slugs after regeneration.",
        "",
        f"{var_name} = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";",
        "",
        f"if (window.{week_id.replace('-', '_')}_WOCHENBERICHT) "
        f"{var_name}.wochenbericht = window.{week_id.replace('-', '_')}_WOCHENBERICHT;",
    ]
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"  wrote {out.name} ({out.stat().st_size:,} bytes)")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

# Map Chinese Sources slot headings -> (slug, short, label) for the web tabs.
CN_SOURCES_SLOTS = {
    "authoritative texts":                 ("cn-authoritative", "Authoritative", "Authoritative texts"),
    "regulatory & policy primary sources": ("cn-regulatory", "Regulatory", "Regulatory & policy primary sources"),
    "quality cn journalism":               ("cn-journalism", "CN journalism", "Quality CN journalism"),
    "government positions & readouts":     ("cn-mfa", "Positions", "Government positions & readouts"),
    "chinese thinking":                    ("cn-thinktanks", "Thinking", "Chinese thinking"),
    "eu / ger in cn media":                ("cn-media", "EU/GER media", "EU / GER in CN media"),
}


def parse_chinese_sources_part(text: str) -> list[dict]:
    """Parse `# IV. Chinese Sources` (numeral-agnostic) into one section per
    `## <slot>` subsection — each renders as its own tab on the site."""
    m = re.search(r"^#\s+[IVX]+\.\s+Chinese Sources\s*$", text, re.MULTILINE)
    if not m:
        return []
    start = m.end()
    nxt = re.search(r"^#\s+[IVX]+\.", text[start:], re.MULTILINE)
    body = text[start:(start + nxt.start()) if nxt else len(text)]
    sections: list[dict] = []
    for sm in re.finditer(r"^##\s+(?P<label>.+?)\s*$", body, re.MULTILINE):
        s2 = sm.end()
        n2 = re.search(r"^##\s+", body[s2:], re.MULTILINE)
        sub_body = body[s2:(s2 + n2.start()) if n2 else len(body)]
        label = sm.group("label").strip()
        slug, short, disp = CN_SOURCES_SLOTS.get(
            label.lower(),
            ("cn-" + re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-"), label[:14], label),
        )
        items = []
        for block in split_article_blocks(sub_body):
            entry = parse_article_block(block)
            if entry:
                items.append(entry)
        if items:
            sections.append({"number": "", "slug": slug, "short": short, "label": disp, "items": items})
    return sections


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    week_id = sys.argv[1]
    week_no = int(week_id[1:3])
    year = int(week_id.split("-")[1])
    export_path = EXPORT_DIR / f"{week_id} — Export.md"
    if not export_path.exists():
        print(f"ERROR: export not found at {export_path}")
        sys.exit(2)
    text = export_path.read_text(encoding="utf-8")

    # ---- Sections
    spotlights = parse_spotlight_sections(text)
    spotlight = spotlights[0] if spotlights else {
        "title": "Spotlight", "intro": "", "items": [], "subsections": []}
    context = parse_context_section(text)
    research = parse_research_section(text)
    top_charts = parse_top_charts_section(text, week_id)

    numbered = []
    for num in ["1", "2", "3", "3a", "3b", "4", "5"]:
        sec = parse_numbered_section(text, num)
        if sec and sec["items"]:
            numbered.append(sec)

    chinese_sources = parse_chinese_sources_part(text)

    payload = {
        "id": week_id,
        "week": week_no,
        "year": year,
        "dateRange": week_date_range(year, week_no),
        "pdf": f"pdfs/{week_id}.pdf",
        "spotlight": spotlight,
        "spotlights": spotlights,
        "contextSections": [context] if context else [],
        "researchSections": [research] if research else [],
        "numberedSections": numbered,
        "chineseSourcesSections": chinese_sources,
        "topCharts": top_charts,
    }

    out = DATA_DIR / f"{week_id}.js"
    write_data_file(week_id, payload, out)

    counts = {
        "context": len(context["groups"][0]["items"]) if context else 0,
        "research_groups": len(research["groups"]) if research else 0,
        "research_items": sum(len(g["items"]) for g in (research["groups"] if research else [])),
        "numbered_sections": len(numbered),
        "numbered_items": sum(len(s["items"]) for s in numbered),
        "cn_sources_tabs": len(chinese_sources),
        "cn_sources_items": sum(len(s["items"]) for s in chinese_sources),
    }
    print(f"\n[{week_id}] " + ", ".join(f"{k}={v}" for k, v in counts.items()))


if __name__ == "__main__":
    main()
