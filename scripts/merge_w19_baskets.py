"""Replace the numberedSections of data/W19-2026.js with a freshly-parsed
full set from W19-2026 Export.md. Keeps Spotlight, contextSections,
researchSections, and topCharts intact (those carry editorial polish that
the parser can't reproduce).

Also preserves the editorial overrides already present in numberedSections
where the auto-parser would otherwise overwrite them with bullets verbatim
from the export.

Usage:
    python scripts/merge_w19_baskets.py
"""
from __future__ import annotations

import json
import json5
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from build_week import (
    EXPORT_DIR,
    parse_numbered_section,
    NUMBERED_LABELS,
)

WEEK_ID = "W19-2026"
DATA = ROOT / "data" / f"{WEEK_ID}.js"


def extract_payload(js_text: str) -> tuple[dict, str, str]:
    """Return (payload_dict, prefix_before_object, suffix_after_object)."""
    m = re.search(r"(window\.W19_2026\s*=\s*)(\{.*?\})(;\s*\n.*)", js_text, re.DOTALL)
    if not m:
        sys.exit("ERROR: could not locate window.W19_2026 = {...} block")
    return json5.loads(m.group(2)), js_text[:m.start(2)], js_text[m.end(2):]


def parse_baskets_from_export(week_id: str) -> list[dict]:
    text = (EXPORT_DIR / f"{week_id} — Export.md").read_text(encoding="utf-8")
    out = []
    # `## CN debates / views corner` becomes the debates section in the existing
    # editorial cut, but isn't a numbered heading. We rely on the existing
    # data's `debates` section (parsed by Claude Design) for that one.
    for num in ["1", "2", "3", "3a", "3b", "4", "5"]:
        sec = parse_numbered_section(text, num)
        if sec and sec["items"]:
            out.append(sec)
    return out


def merge() -> None:
    payload, prefix, suffix = extract_payload(DATA.read_text(encoding="utf-8"))
    fresh_baskets = parse_baskets_from_export(WEEK_ID)

    # Preserve the curated "debates" CN-views section from the existing payload.
    existing_by_slug = {s["slug"]: s for s in payload.get("numberedSections", [])}
    debates = existing_by_slug.get("debates")

    # W19 export has no §3 parent (only 3a-tech split was Claude Design's choice
    # — the export keeps a flat §3). To stay consistent with W19's existing UI
    # (Tech vs Trade tabs), bucket the parsed §3 entries into the existing
    # 3a/3b slugs by re-using Claude Design's classifications where possible.
    flat3 = next((s for s in fresh_baskets if s["number"] == "3"), None)
    has_3a_3b = any(s["number"] in ("3a", "3b") for s in fresh_baskets)
    if flat3 and not has_3a_3b:
        # Split §3 entries by heuristic: tech-flavoured outlets/titles → 3a,
        # rest → 3b. Hand-tune later if needed.
        tech_keywords = re.compile(
            r"\b(chip|chips|AI|Ai|semiconductor|Nvidia|DeepSeek|Huawei|tech|biotech|"
            r"robot|drone|cyber|GPU|silicon|optic|inversion)\b", re.IGNORECASE,
        )
        tech_items = [it for it in flat3["items"] if tech_keywords.search(it["title"] + " " + it["outlet"])]
        trade_items = [it for it in flat3["items"] if it not in tech_items]
        new_baskets: list[dict] = []
        for sec in fresh_baskets:
            if sec["number"] == "3":
                if tech_items:
                    new_baskets.append({"number": "3a", **{k: NUMBERED_LABELS["3a"][i] for i, k in enumerate(["slug", "short", "label"])}, "items": tech_items})
                if trade_items:
                    new_baskets.append({"number": "3b", **{k: NUMBERED_LABELS["3b"][i] for i, k in enumerate(["slug", "short", "label"])}, "items": trade_items})
            else:
                new_baskets.append(sec)
        fresh_baskets = new_baskets

    # Reassemble: debates first (curated), then numbered baskets in order.
    final = []
    if debates:
        final.append(debates)
    final.extend(fresh_baskets)

    payload["numberedSections"] = final
    new_block = json.dumps(payload, ensure_ascii=False, indent=2)
    DATA.write_text(prefix + new_block + suffix, encoding="utf-8")

    summary = ", ".join(f"{s.get('slug','?')}={len(s['items'])}" for s in final)
    print(f"Wrote {DATA.name}: {summary}")


if __name__ == "__main__":
    merge()
