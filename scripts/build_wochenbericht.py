#!/usr/bin/env python3
"""Extract Part III (German Lens / Wochenbericht) from a W-XX — Export.md
and emit data/W-XX-wochenbericht.js for the online edition.

ONLINE-ONLY — the source MD, PDF and email draft remain untouched.

Usage:
    python scripts/build_wochenbericht.py W18-2026
    python scripts/build_wochenbericht.py W18-2026 --vault "/path/to/vault"
    python scripts/build_wochenbericht.py W18-2026 --dry-run     # print, do not write
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"

DEFAULT_VAULT = Path(
    r"C:\Users\Mikko.Huotari\OneDrive - Mercator Institute for China Studies gGmbH\Dokumente\MH"
)
VAULT_SUBDIR = "2 ROKU/ROUTINE - Update MH@MERICS"

GEMINI_MODEL = "gemini-2.0-flash"

# Headers that signal the start of each Part III section.
SECTION_HINTS = [
    ("Prominente Zitate",          "quotes",  "Zitate",  "Prominente Zitate und Positionen zu China-bezogenen Angelegenheiten"),
    ("Wichtige China-bezogene Entwicklungen", "facts", "Fakten", "Wichtige China-bezogene Entwicklungen in Fakten und Zahlen"),
    ("zentrale Themen",            "themes",  "Themen",  "Fünf zentrale Themen in der deutschen China-Politik Diskussion"),
]

EXPECTED_KEYS_BY_SLUG = {
    "quotes": ("quote", {"lead", "text", "source"}),
    "facts":  ("fact",  {"lead", "text", "source"}),
    "themes": ("theme", {"title", "text", "sources"}),
}


def find_export(vault: Path, week_id: str) -> Path:
    folder = vault / VAULT_SUBDIR
    candidates = [p for p in folder.iterdir() if p.name.startswith(week_id) and "Export" in p.name and p.suffix == ".md"]
    if not candidates:
        sys.exit(f"No Export.md found for {week_id} in {folder}")
    # Prefer 'W-XX — Export.md' over '— Export FULL.md' etc.
    candidates.sort(key=lambda p: ("FULL" in p.name, len(p.name)))
    return candidates[0]


def slice_part3(text: str) -> str:
    """Return everything from the first Part III section onward."""
    for hint, *_ in SECTION_HINTS:
        m = re.search(rf"^##\s+\d+\.\s+.*{re.escape(hint)}.*$", text, flags=re.MULTILINE)
        if m:
            return text[m.start():]
    sys.exit("Could not locate Part III in the export markdown")


def gemini_call(prompt: str) -> str:
    from google import genai
    from google.genai import types
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        sys.exit("GEMINI_API_KEY not set in environment.")
    client = genai.Client(api_key=api_key)
    # Force JSON output so Gemini doesn't wrap or interleave prose.
    config = types.GenerateContentConfig(response_mime_type="application/json")
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=prompt, config=config)
    return resp.text or ""


def extract_json(raw: str) -> dict:
    """Strip code fences and parse a JSON object. Dumps raw on failure."""
    raw = raw.strip()
    m = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw, re.DOTALL)
    candidate = m.group(1) if m else None
    if candidate is None:
        a = raw.find("{")
        b = raw.rfind("}")
        if a < 0 or b < 0 or b <= a:
            dump = DATA / ".wochenbericht_debug.txt"
            dump.write_text(raw, encoding="utf-8")
            raise ValueError(f"No JSON object in response. Raw saved to {dump}")
        candidate = raw[a:b + 1]
    try:
        return json.loads(candidate)
    except json.JSONDecodeError as e:
        dump = DATA / ".wochenbericht_debug.txt"
        dump.write_text(candidate, encoding="utf-8")
        raise ValueError(f"JSON parse failed: {e}. Raw saved to {dump}") from e


def caveat_for(week_id: str) -> str:
    """Build a Caveat string. Defaults to the week's Sunday in German format."""
    m = re.match(r"W(\d+)-(\d{4})", week_id)
    if not m:
        return "Caveat: nur stichprobenartig auf Qualität / Richtigkeit überprüft."
    import datetime as _dt
    week, year = int(m.group(1)), int(m.group(2))
    # ISO week Sunday is weekday 7 in ISO calendar
    sunday = _dt.date.fromisocalendar(year, week, 7)
    months_de = ["", "Januar", "Februar", "März", "April", "Mai", "Juni",
                 "Juli", "August", "September", "Oktober", "November", "Dezember"]
    nice = f"{sunday.day}. {months_de[sunday.month]} {sunday.year}"
    return f"Caveat: nur stichprobenartig auf Qualität / Richtigkeit überprüft — Coverage nur bis {nice}."


PROMPT = """Du konvertierst eine deutsche Wochen-Presseschau (Wochenbericht zur China-Berichterstattung) aus Markdown in eine strukturierte JSON-Form.

Schema (dies ist die ZIELSTRUKTUR):
{
  "sections": [
    {
      "number": "1", "slug": "quotes", "short": "Zitate",
      "label": "Prominente Zitate und Positionen zu China-bezogenen Angelegenheiten",
      "items": [
        {"kind": "quote",
         "lead": "Name (Rolle, falls genannt)",
         "text": "Verbphrase mit Originalwortlaut und Anführungszeichen",
         "source": {"outlet": "FAZ", "outletDisplay": "FAZ", "date": "YYYY-MM-DD", "title": "Originaltitel"}}
      ]
    },
    {
      "number": "2", "slug": "facts", "short": "Fakten",
      "label": "Wichtige China-bezogene Entwicklungen in Fakten und Zahlen",
      "items": [
        {"kind": "fact",
         "lead": "Kurzer Fett-Titel",
         "text": "Beschreibender Satz",
         "source": {"outlet": "...", "outletDisplay": "...", "date": "YYYY-MM-DD", "title": "..."}}
      ]
    },
    {
      "number": "3", "slug": "themes", "short": "Themen",
      "label": "Fünf zentrale Themen in der deutschen China-Politik Diskussion",
      "items": [
        {"kind": "theme",
         "title": "Themen-Titel",
         "text": "Analyseabsatz",
         "sources": [
           {"outlet": "FAZ", "outletDisplay": "faz.net", "date": "YYYY-MM-DD", "title": "Originaltitel"}
         ]}
      ]
    }
  ]
}

Regeln (zwingend):
1. Behalte den deutschen Text WORT-WÖRTLICH. Keine Übersetzung, keine Paraphrase, keine Zusammenfassung.
2. Entferne führende "- " und "**" Bold-Marker bei den Zitaten/Fakten/Themen.
3. Zitate: `lead` = fett markierter Name (inkl. Rolle in Klammern). `text` = alles zwischen Lead und "(Source:".
4. Fakten: `lead` = fett markierter Kurz-Titel. `text` = Body bis "(Source:".
5. Themen: `title` = fett markierter Titel. `text` = alles zwischen Titel und "Prominente Quellen:". `sources` = die Liste danach.
6. Deutsche Daten "27. April 2026" → ISO "2026-04-27". Monate: Januar=01, Februar=02, März=03, April=04, Mai=05, Juni=06, Juli=07, August=08, September=09, Oktober=10, November=11, Dezember=12.
7. `outlet` = kanonische Kurzform (FAZ, Handelsblatt, Spiegel, Die Welt, DIE ZEIT, NZZ, Tagesspiegel, Welt am Sonntag, Süddeutsche Zeitung, WirtschaftsWoche, BILD). `outletDisplay` = wie in der Quelle erscheint (oft lowercase domain wie "faz.net", "handelsblatt.com").
8. Gib AUSSCHLIESSLICH das JSON-Objekt zurück. Keine Prosa, keine Markdown-Code-Fences.

Markdown-Quelle:
%s
"""


def build_js(week_id: str, data: dict) -> str:
    var = f"W{week_id.split('-')[0][1:]}_{week_id.split('-')[1]}_WOCHENBERICHT"  # e.g. W18_2026_WOCHENBERICHT
    week_var = f"W{week_id.split('-')[0][1:]}_{week_id.split('-')[1]}"             # e.g. W18_2026
    body = json.dumps(data, indent=2, ensure_ascii=False)
    return (
        f"// {week_id} — Wochenbericht (German media review).\n"
        f"// Generated by scripts/build_wochenbericht.py from the W-XX — Export.md.\n"
        f"// Online-only artefact — never propagated to the PDF or email.\n"
        f"\n"
        f"window.{var} = {body};\n"
        f"\n"
        f"// Late-attach if the main week file has already executed; otherwise\n"
        f"// the main file's tail picks this up when it runs.\n"
        f"if (window.{week_var}) window.{week_var}.wochenbericht = window.{var};\n"
    )


def validate(parsed: dict) -> None:
    secs = parsed.get("sections")
    if not isinstance(secs, list) or len(secs) != 3:
        raise ValueError(f"Expected 3 sections, got {len(secs) if isinstance(secs, list) else type(secs)}")
    for sec in secs:
        slug = sec.get("slug")
        if slug not in EXPECTED_KEYS_BY_SLUG:
            raise ValueError(f"Unexpected slug: {slug}")
        kind, req_keys = EXPECTED_KEYS_BY_SLUG[slug]
        items = sec.get("items") or []
        if not items:
            raise ValueError(f"Section {slug} has no items")
        for it in items:
            if it.get("kind") != kind:
                raise ValueError(f"Section {slug}: item kind {it.get('kind')!r} != {kind!r}")
            missing = req_keys - set(it.keys())
            if missing:
                raise ValueError(f"Section {slug} item missing keys: {missing}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("week_id", help="e.g. W18-2026")
    ap.add_argument("--vault", default=str(DEFAULT_VAULT))
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    vault = Path(args.vault)
    export_md = find_export(vault, args.week_id)
    print(f"Source: {export_md}")
    raw = export_md.read_text(encoding="utf-8")
    part3 = slice_part3(raw)
    print(f"Part III: {len(part3):,} chars")

    prompt = PROMPT % part3
    print("Calling Gemini…")
    resp = gemini_call(prompt)
    parsed = extract_json(resp)

    # Fill in number / slug / short / label per our canonical mapping, since
    # the LLM sometimes drops them or restyles them.
    by_slug = {h[1]: h for h in SECTION_HINTS}
    for sec in parsed.get("sections", []):
        slug = sec.get("slug") or ""
        if slug in by_slug:
            _, _, short, label = by_slug[slug]
            sec["number"] = {"quotes": "1", "facts": "2", "themes": "3"}[slug]
            sec["short"] = short
            sec["label"] = label

    parsed["label"] = "Wochenbericht: CN-Beziehungen durch die DE-Medien-Brille"
    parsed["caveat"] = caveat_for(args.week_id)

    # Reorder top-level keys to match W19 file style.
    ordered = {"label": parsed["label"], "caveat": parsed["caveat"], "sections": parsed["sections"]}

    validate(ordered)

    counts = {sec["slug"]: len(sec["items"]) for sec in ordered["sections"]}
    print(f"Counts: {counts}")

    js = build_js(args.week_id, ordered)
    if args.dry_run:
        print("\n--- generated JS (dry-run) ---")
        print(js[:1500] + ("…" if len(js) > 1500 else ""))
        return 0

    out = DATA / f"{args.week_id}-wochenbericht.js"
    out.write_text(js, encoding="utf-8")
    print(f"Wrote {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
