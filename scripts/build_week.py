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

def parse_context_section(text: str) -> dict | None:
    pat = re.compile(r"^##\s+German China policy in context\s*$", re.MULTILINE)
    m = pat.search(text)
    if not m:
        return None
    start = m.end()
    nxt = re.search(r"^(##\s|#\s)", text[start:], re.MULTILINE)
    end = start + nxt.start() if nxt else len(text)
    body = text[start:end].strip()

    items = []
    for line in body.splitlines():
        line = line.strip()
        if not line.startswith("- "):
            continue
        line = line[2:].strip()
        link = INLINE_LINK_RE.search(line)
        if link:
            text_part = link.group("text")
            url = link.group("url")
            outlet = text_part.split("|")[-1].strip() if "|" in text_part else text_part.split("—")[-1].strip() or text_part
            # Replace the link with the link text, then strip ` — ` prefix on note
            stripped = INLINE_LINK_RE.sub(lambda mm: mm.group("text"), line)
            note = stripped.strip(" -—")
            items.append({"outlet": outlet[:40], "date": "", "url": url, "note": note})
        else:
            items.append({"outlet": "—", "date": "", "url": "", "note": line})

    return {
        "label": "German China policy in context",
        "groups": [{"label": "All", "items": items}],
    }


# ---------------------------------------------------------------------------
# Research section
# ---------------------------------------------------------------------------

def parse_research_section(text: str) -> dict | None:
    pat = re.compile(r"^##\s+MERICS research and \(media\) insights\s*$", re.MULTILINE)
    m = pat.search(text)
    if not m:
        return None
    start = m.end()
    nxt = re.search(r"^(##\s|#\s)", text[start:], re.MULTILINE)
    end = start + nxt.start() if nxt else len(text)
    body = text[start:end].strip()

    # Sub-groups identified by **Bold** label lines
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
    context = parse_context_section(text)
    research = parse_research_section(text)

    numbered = []
    for num in ["1", "2", "3", "3a", "3b", "4", "5"]:
        sec = parse_numbered_section(text, num)
        if sec and sec["items"]:
            numbered.append(sec)

    payload = {
        "id": week_id,
        "week": week_no,
        "year": year,
        "dateRange": week_date_range(year, week_no),
        "pdf": f"pdfs/{week_id}.pdf",
        "spotlight": {"title": "Spotlight", "intro": "", "items": []},
        "contextSections": [context] if context else [],
        "researchSections": [research] if research else [],
        "numberedSections": numbered,
        "topCharts": [],
    }

    out = DATA_DIR / f"{week_id}.js"
    write_data_file(week_id, payload, out)

    counts = {
        "context": len(context["groups"][0]["items"]) if context else 0,
        "research_groups": len(research["groups"]) if research else 0,
        "research_items": sum(len(g["items"]) for g in (research["groups"] if research else [])),
        "numbered_sections": len(numbered),
        "numbered_items": sum(len(s["items"]) for s in numbered),
    }
    print(f"\n[{week_id}] " + ", ".join(f"{k}={v}" for k, v in counts.items()))


if __name__ == "__main__":
    main()
