"""
Extract title -> URL map from a W-XX — Export.md file and patch a data/W{N}-{Y}.js
file in place by replacing url: "#" placeholders with the matched URLs.

Usage:
    python scripts/extract_urls.py W19-2026

Looks for export at:  "2 ROKU/ROUTINE - Update MH@MERICS/W19-2026 — Export.md"
Patches:              data/W19-2026.js  (and W19-2026-wochenbericht.js if present)
"""

import re
import sys
import json
import difflib
import unicodedata
from pathlib import Path

VAULT = Path.home() / "OneDrive - Mercator Institute for China Studies gGmbH" / "Dokumente" / "MH"
EXPORT_DIR = VAULT / "2 ROKU" / "ROUTINE - Update MH@MERICS"
REPO = Path(__file__).resolve().parent.parent
DATA_DIR = REPO / "data"


def norm(s: str) -> str:
    """Normalise titles for fuzzy matching: NFKC, strip punctuation/whitespace."""
    s = unicodedata.normalize("NFKC", s)
    s = s.replace("‘", "'").replace("’", "'")
    s = s.replace("“", '"').replace("”", '"')
    s = s.replace("—", "-").replace("–", "-")
    s = re.sub(r"[^a-zA-Z0-9]+", " ", s).strip().lower()
    return s


# ---------------------------------------------------------------------------
# Parse export
# ---------------------------------------------------------------------------

ARTICLE_HEADER_RE = re.compile(
    r"^###\s+"
    r"\*\*(?P<outlet>[^*]+)\*\*"            # **Outlet** or **Outlet** (...)
    r"(?:\s*\([^)]+\))?"                     # optional (Author) parenthetical
    r":\s*"
    r'"\s*\*\*(?P<title>[^*]+)\*\*\s*"'      # "**Title**"
    r"\s*,\s*"
    r"(?P<date>[\d\-]*)"                     # date (may be empty)
    r"\s*,\s*"
    r"(?:\[Link\]\((?P<url1>[^)]+)\)|<(?P<url2>[^>]+)>)",
    re.IGNORECASE | re.MULTILINE,
)

MARKDOWN_LINK_RE = re.compile(r"\[(?P<text>[^\]]+)\]\((?P<url>https?://[^)]+)\)")


def extract_from_export(path: Path) -> dict[str, str]:
    """Return {normalized_title: url} for every recognised article."""
    text = path.read_text(encoding="utf-8")
    mapping: dict[str, str] = {}

    # Pattern 1: basket article headers (most reliable)
    for m in ARTICLE_HEADER_RE.finditer(text):
        title = m.group("title").strip()
        url = (m.group("url1") or m.group("url2") or "").strip()
        if url and url != "#":
            mapping[norm(title)] = url

    # Pattern 2: markdown links — index by link text (catches highlights/context)
    for m in MARKDOWN_LINK_RE.finditer(text):
        text_key = norm(m.group("text"))
        url = m.group("url").strip()
        if not text_key or text_key in {"link", "pdf"}:
            continue
        mapping.setdefault(text_key, url)

    return mapping


# ---------------------------------------------------------------------------
# Patch data file
# ---------------------------------------------------------------------------

# Matches an entry object literal:
#   { outlet: "...", title: "...", date: "...", url: "#", ... }
# The leading `outlet:` anchors us inside an entry, so we don't accidentally
# match the surrounding spotlight/section container's own `title:` field.
ENTRY_RE = re.compile(
    r'(?P<head>outlet:\s*"[^"]+",\s*'
    r'(?:kind:\s*"[^"]+",\s*)?'
    r'title:\s*"(?P<title>(?:\\.|[^"\\])*)"[^}]*?)'
    r'url:\s*"#"',
    re.DOTALL,
)


def patch_data_file(js_path: Path, url_map: dict[str, str]) -> tuple[int, int]:
    """Replace url: "#" with matched URL when title can be resolved.

    Returns (patched, missed)."""
    src = js_path.read_text(encoding="utf-8")
    patched = 0
    missed = 0

    def _sub(m: re.Match) -> str:
        nonlocal patched, missed
        title = m.group("title")
        # Decode JS \uXXXX escapes without corrupting UTF-8 bytes
        clean = re.sub(
            r"\\u([0-9a-fA-F]{4})",
            lambda mm: chr(int(mm.group(1), 16)),
            title,
        )
        key = norm(clean)
        url = url_map.get(key)
        if not url:
            # Try a looser key (drop leading word like "Opinion: ")
            looser = re.sub(r"^[a-z]+\s+", "", key)
            url = url_map.get(looser)
        if not url:
            # Fuzzy fallback: words differ ("two"/"2", "USD"/"$", "U.S."/"US")
            candidates = difflib.get_close_matches(
                key, url_map.keys(), n=1, cutoff=0.82
            )
            if candidates:
                url = url_map[candidates[0]]
        if url:
            patched += 1
            return m.group("head") + f'url: "{url}"'
        missed += 1
        return m.group(0)

    new_src = ENTRY_RE.sub(_sub, src)
    if new_src != src:
        js_path.write_text(new_src, encoding="utf-8")
    return patched, missed


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    week_id = sys.argv[1]  # e.g. "W19-2026"
    export_path = EXPORT_DIR / f"{week_id} — Export.md"
    if not export_path.exists():
        print(f"ERROR: export not found at {export_path}")
        sys.exit(2)
    url_map = extract_from_export(export_path)
    print(f"[{week_id}] extracted {len(url_map)} title->url mappings from export")

    targets = [DATA_DIR / f"{week_id}.js", DATA_DIR / f"{week_id}-wochenbericht.js"]
    for js in targets:
        if not js.exists():
            continue
        patched, missed = patch_data_file(js, url_map)
        print(f"  {js.name}: patched {patched}, still '#' for {missed}")


if __name__ == "__main__":
    main()
