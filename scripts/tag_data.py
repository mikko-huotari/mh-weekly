#!/usr/bin/env python3
"""Tag entries in data/W-XX-YYYY.js using the controlled vocabulary in data/tags.js.

ONLINE-ONLY — writes tags into the JS data file only. Never touches the source
W-XX.md, W-XX — Export.md, the PDF, or the email draft.

Usage:
    python scripts/tag_data.py W19-2026
    python scripts/tag_data.py W19-2026 --sample 10        # dry-run, print sample
    python scripts/tag_data.py W19-2026 W18-2026           # tag multiple weeks
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
BATCH_SIZE = 20
MAX_TAGS_PER_ENTRY = 3
GEMINI_MODEL = "gemini-2.0-flash"


def load_vocab() -> list[str]:
    """Parse data/tags.js to extract the tag IDs (from the `tags:` array only)."""
    text = (DATA / "tags.js").read_text(encoding="utf-8")
    m = re.search(r"tags\s*:\s*\[(.*?)\]\s*\};", text, re.DOTALL)
    if not m:
        sys.exit("Could not find tags array in data/tags.js")
    return [m.group(1) for m in re.finditer(r'\{\s*id:\s*"([^"]+)"', m.group(1))]


def load_week(week_id: str) -> tuple[Path, str, str, dict[str, Any], str, str]:
    """Return (path, var_name, prefix, data, suffix, raw_obj_text).

    prefix = everything before `{` of the main object (header comment + assignment).
    suffix = everything after the matching `};` (trailing helper lines).
    """
    path = DATA / f"{week_id}.js"
    text = path.read_text(encoding="utf-8")
    m = re.search(
        r"^(?P<prefix>.*?window\.(?P<var>W\d+_\d+)\s*=\s*)"
        r"(?P<obj>\{.*?\n\})\s*;\s*\n"
        r"(?P<suffix>.*)$",
        text,
        re.DOTALL,
    )
    if not m:
        sys.exit(f"Could not parse top-level object in {path.name}")
    var = m.group("var")
    obj_text = m.group("obj")
    data = json.loads(obj_text)
    return path, var, m.group("prefix"), data, m.group("suffix"), obj_text


def load_wb(week_id: str) -> tuple[Path, str, dict[str, Any], str] | None:
    """Return (path, prefix, data, suffix) for the wochenbericht side file if present, else None."""
    path = DATA / f"{week_id}-wochenbericht.js"
    if not path.exists():
        return None
    text = path.read_text(encoding="utf-8")
    m = re.search(
        r"^(?P<prefix>.*?window\.W\d+_\d+_WOCHENBERICHT\s*=\s*)"
        r"(?P<obj>\{.*\n\})\s*;\s*\n?"
        r"(?P<suffix>.*)$",
        text,
        re.DOTALL,
    )
    if not m:
        sys.exit(f"Could not parse top-level object in {path.name}")
    data = json.loads(m.group("obj"))
    return path, m.group("prefix"), data, m.group("suffix")


def collect_entries(data: dict[str, Any]) -> list[tuple[list, dict]]:
    """Yield (path, entry_dict) for every taggable entry."""
    out: list[tuple[list, dict]] = []

    def walk_items(parent_path: list, items: list | None):
        for i, item in enumerate(items or []):
            if not isinstance(item, dict):
                continue
            out.append((parent_path + [i], item))

    if data.get("spotlight"):
        walk_items(["spotlight", "items"], data["spotlight"].get("items"))
    for s, sec in enumerate(data.get("contextSections", []) or []):
        walk_items(["contextSections", s, "items"], sec.get("items"))
        for g, grp in enumerate(sec.get("groups", []) or []):
            walk_items(["contextSections", s, "groups", g, "items"], grp.get("items"))
    for s, sec in enumerate(data.get("researchSections", []) or []):
        walk_items(["researchSections", s, "items"], sec.get("items"))
        for g, grp in enumerate(sec.get("groups", []) or []):
            walk_items(["researchSections", s, "groups", g, "items"], grp.get("items"))
    for s, sec in enumerate(data.get("numberedSections", []) or []):
        walk_items(["numberedSections", s, "items"], sec.get("items"))
    return out


def collect_wb_entries(data: dict[str, Any]) -> list[tuple[list, dict]]:
    """Yield (path, entry_dict) for every Wochenbericht item.

    Items in sections[*].items have two shapes:
      - quote/fact:  {lead, text, source: {outlet, date, title}, kind}
      - theme:       {title, text, sources: [{outlet, title}, ...], kind: "theme"}
    Both are taggable.
    """
    out: list[tuple[list, dict]] = []
    for s, sec in enumerate(data.get("sections", []) or []):
        for i, item in enumerate(sec.get("items", []) or []):
            if isinstance(item, dict):
                out.append((["sections", s, "items", i], item))
    return out


def entry_text(e: dict) -> str:
    outlet = e.get("outlet", "")
    title = e.get("title") or ""
    if e.get("note"):
        body = e["note"]
    else:
        bullets = []
        for b in e.get("bullets") or []:
            if isinstance(b, list):
                bullets.append(" ".join(str(x) for x in b if x))
            elif isinstance(b, str):
                bullets.append(b)
        body = " | ".join(bullets)
    body = re.sub(r"\s+", " ", body).strip()[:500]
    return f"[{outlet}] {title} :: {body}".strip()


def wb_entry_text(e: dict) -> str:
    """Render a Wochenbericht item as a single line for the LLM."""
    if e.get("kind") == "theme":
        srcs = ", ".join((s.get("outlet") or "") for s in (e.get("sources") or []) if isinstance(s, dict))
        return f"[Theme · {srcs}] {e.get('title','')} :: {(e.get('text','') or '')[:500]}".strip()
    src = e.get("source") or {}
    return (
        f"[{src.get('outlet','')}] {e.get('lead','')} :: {(e.get('text','') or '')[:500]} "
        f"(src: {src.get('title','')})"
    ).strip()


_GEMINI_CLIENT = None


def _gemini_client():
    global _GEMINI_CLIENT
    if _GEMINI_CLIENT is None:
        from google import genai
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            sys.exit("GEMINI_API_KEY not set in environment.")
        _GEMINI_CLIENT = genai.Client(api_key=api_key)
    return _GEMINI_CLIENT


def call_llm(prompt: str) -> str:
    """Send `prompt` to Gemini Flash and return the text response."""
    client = _gemini_client()
    resp = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )
    return resp.text or ""


def extract_json_obj(text: str) -> dict:
    """Pull the first {...} JSON object out of LLM output."""
    m = re.search(r"\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}", text, re.DOTALL)
    if not m:
        m = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
        if not m:
            raise ValueError(f"No JSON found in claude output:\n{text[:500]}")
        return json.loads(m.group(1))
    return json.loads(m.group(0))


def tag_batch(batch: list[tuple[int, dict]], vocab: list[str], textfn=entry_text) -> dict[int, list[str]]:
    """Tag a single batch of entries.  Returns {batch_index_1based: [tag_ids]}."""
    numbered = []
    for idx, (_, e) in enumerate(batch, start=1):
        numbered.append(f"{idx}. {textfn(e)}")
    prompt = f"""You are tagging news entries for a China-policy weekly archive.

Choose 1-{MAX_TAGS_PER_ENTRY} tags PER ENTRY, drawn ONLY from this fixed vocabulary:

{", ".join(vocab)}

Hard rules:
- Output strictly a JSON object: keys are entry numbers as strings, values are arrays of tag ids.
- Never invent tags. If an entry only fits one tag, return one. Prefer specificity (e.g. "semcon" over "trade" when both apply).
- Skip generic catch-alls like "macro" unless the entry is about CN macro indicators (GDP, fiscal, monetary, PMI).
- "us-cn" / "eu-cn" / "de-cn" / "jp-cn" / "india-cn" / "ru-cn" apply only when the entry is *about* that bilateral relationship, not when a US/EU outlet writes about CN.
- "cn-discourse" = Chinese-language sources or Chinese scholar/official views; do not use for Western analysis of China.
- "cyber" = digital governance, cybersecurity, data localization, AI cyber risks. Reserve "security" for CCP-internal security, surveillance, foreign-policy security.
- "bri" = overseas infrastructure / Belt & Road projects. Do NOT use "bri" for generic outbound M&A or FDI — use "investment" for those.
- "investment-screening" = inbound screening regimes (CFIUS, EU FDI screening, GER foreign-investment review). Use "investment" for actual deals.
- "export-controls" = chip / dual-use / tech export restrictions. Use "sanctions" only for designated-entity actions and financial sanctions.
- "climate" = emissions, carbon markets, energy transition policy (CN domestic or international).
- No prose, no explanations, no markdown — JSON object only.

Entries:
{chr(10).join(numbered)}
"""
    raw = call_llm(prompt)
    obj = extract_json_obj(raw)
    out: dict[int, list[str]] = {}
    vocab_set = set(vocab)
    for k, v in obj.items():
        try:
            i = int(k)
        except (TypeError, ValueError):
            continue
        if not isinstance(v, list):
            continue
        cleaned = [t for t in v if isinstance(t, str) and t in vocab_set]
        out[i] = cleaned[:MAX_TAGS_PER_ENTRY]
    return out


def set_at_path(data: dict, path: list, entry_with_tags: dict) -> None:
    """Walk `data` along `path` and replace the dict at the end."""
    cur: Any = data
    for step in path[:-1]:
        cur = cur[step]
    cur[path[-1]] = entry_with_tags


def serialize_data(data: dict, prefix: str, suffix: str) -> str:
    """Re-emit `prefix + json(data) + ;\n + suffix` with stable formatting."""
    body = json.dumps(data, indent=2, ensure_ascii=False)
    return f"{prefix}{body};\n{suffix}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("weeks", nargs="+", help="Week IDs, e.g. W19-2026")
    ap.add_argument("--sample", type=int, default=0,
                    help="Dry-run: tag only first N entries, print, do NOT write file.")
    args = ap.parse_args()

    vocab = load_vocab()
    print(f"Vocabulary loaded: {len(vocab)} tags")

    for wk in args.weeks:
        print(f"\n=== {wk} ===")
        path, var, prefix, data, suffix, _ = load_week(wk)
        entries = collect_entries(data)
        print(f"{len(entries)} taggable entries")

        if args.sample:
            entries = entries[: args.sample]
            print(f"--sample {args.sample}: dry-run on first {len(entries)} entries")

        all_tags: dict[tuple, list[str]] = {}
        for start in range(0, len(entries), BATCH_SIZE):
            batch = entries[start:start + BATCH_SIZE]
            print(f"  batch {start // BATCH_SIZE + 1}: entries {start+1}-{start+len(batch)}")
            batch_pairs = list(enumerate(batch))
            try:
                tags = tag_batch(batch, vocab)
            except Exception as ex:
                print(f"    ! batch failed: {ex}")
                continue
            for i, (path_, entry) in enumerate(batch, start=1):
                t = tags.get(i, [])
                all_tags[tuple(path_)] = t

        if args.sample:
            print("\n--- sample output ---")
            for path_, entry in entries:
                t = all_tags.get(tuple(path_), [])
                ot = entry.get("outlet", "")
                ti = (entry.get("title") or entry.get("note") or "")[:90]
                print(f"  {ot:<18} | {ti:<92} -> {t}")
            print("\n(dry-run: file NOT modified)")
            continue

        for path_, entry in entries:
            t = all_tags.get(tuple(path_), [])
            entry["tags"] = t
            set_at_path(data, path_, entry)

        tag_counts: dict[str, int] = {}
        for t in all_tags.values():
            for tag in t:
                tag_counts[tag] = tag_counts.get(tag, 0) + 1

        new_text = serialize_data(data, prefix, suffix)
        path.write_text(new_text, encoding="utf-8")
        print(f"  wrote {path.name}")
        print("  tag counts:")
        for tag, n in sorted(tag_counts.items(), key=lambda x: -x[1]):
            print(f"    {tag:<14} {n}")

        # ---- Wochenbericht side file (Module E, Part V) ----
        wb = load_wb(wk)
        if wb is None:
            print(f"  (no wochenbericht side file for {wk}, skipping)")
            continue
        wb_path, wb_prefix, wb_data, wb_suffix = wb
        wb_entries = collect_wb_entries(wb_data)
        print(f"  wochenbericht: {len(wb_entries)} items")
        if args.sample:
            wb_entries = wb_entries[: args.sample]
        wb_tags: dict[tuple, list[str]] = {}
        for start in range(0, len(wb_entries), BATCH_SIZE):
            batch = wb_entries[start:start + BATCH_SIZE]
            print(f"    batch {start // BATCH_SIZE + 1}: items {start+1}-{start+len(batch)}")
            try:
                tags = tag_batch(batch, vocab, textfn=wb_entry_text)
            except Exception as ex:
                print(f"    ! batch failed: {ex}")
                continue
            for i, (path_, _entry) in enumerate(batch, start=1):
                wb_tags[tuple(path_)] = tags.get(i, [])
        if args.sample:
            print("    --- wochenbericht sample ---")
            for path_, entry in wb_entries:
                t = wb_tags.get(tuple(path_), [])
                lead = entry.get("lead") or entry.get("title") or ""
                print(f"      {lead[:60]:<60} -> {t}")
            print("    (dry-run: wochenbericht NOT modified)")
            continue
        for path_, entry in wb_entries:
            entry["tags"] = wb_tags.get(tuple(path_), [])
            set_at_path(wb_data, path_, entry)
        wb_path.write_text(serialize_data(wb_data, wb_prefix, wb_suffix), encoding="utf-8")
        print(f"  wrote {wb_path.name}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
