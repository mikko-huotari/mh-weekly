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

GEMINI_MODEL = "gemini-2.5-flash"

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


# --- Structured-output schema --------------------------------------------
# Gemini's `response_schema` enforces a Pydantic shape — it cannot emit
# unescaped quotes inside string values because the SDK validates the
# response against the schema before returning it.
from pydantic import BaseModel


class _Source(BaseModel):
    outlet: str
    outletDisplay: str
    date: str
    title: str


class _QuoteItem(BaseModel):
    lead: str
    text: str
    source: _Source


class _FactItem(BaseModel):
    lead: str
    text: str
    source: _Source


class _ThemeItem(BaseModel):
    title: str
    text: str
    sources: list[_Source]


class _WochenberichtPayload(BaseModel):
    quotes: list[_QuoteItem]
    facts: list[_FactItem]
    themes: list[_ThemeItem]


def gemini_call_structured(prompt: str) -> dict:
    """Call Claude CLI (Max plan) returning structured JSON. Replaces Gemini
    to avoid per-token billing + spend caps. JSON schema is communicated via
    prompt suffix since `claude -p` lacks SDK-level schema enforcement."""
    import subprocess, shutil
    claude_bin = shutil.which("claude") or shutil.which("claude.cmd")
    if not claude_bin:
        import os as _os
        for cand in [_os.path.expandvars(r'%APPDATA%\npm\claude.cmd'),
                     _os.path.expandvars(r'%APPDATA%\npm\claude')]:
            if _os.path.isfile(cand):
                claude_bin = cand; break
    if not claude_bin:
        sys.exit("claude CLI not found")
    schema_hint = (
        "\n\nReturn ONLY a single JSON object, no prose, no fences. Top-level keys: "
        "`label` (string), `caveat` (string), `quotes` (array of {lead, text, "
        "source:{outlet,outletDisplay,date,title}, kind}), `facts` (array of "
        "{lead, text, source:{...}, kind}), `themes` (array of {title, text, "
        "sources:[{outlet,outletDisplay,date,title}], kind})."
    )
    try:
        proc = subprocess.run(
            [claude_bin, "-p"], input=prompt + schema_hint,
            capture_output=True, text=True, timeout=600, encoding="utf-8"
        )
    except subprocess.TimeoutExpired:
        sys.exit("claude CLI timeout (600s)")
    if proc.returncode != 0:
        sys.exit(f"claude CLI rc={proc.returncode}: {proc.stderr[:300]}")
    raw = (proc.stdout or "").strip()
    # Strip code fences if present
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        debug_path = Path("data/.wochenbericht_debug.txt")
        debug_path.write_text(raw, encoding="utf-8")
        sys.exit(f"claude JSON parse failed ({e}); raw saved to {debug_path}")
    # Pydantic post-validation removed (no schema enforcement w/ CLI)
    parsed = None
    if parsed is not None:
        try:
            return parsed.model_dump()
        except AttributeError:
            return dict(parsed) if isinstance(parsed, dict) else json.loads(resp.text or "{}")
    # Fallback: validate text against the schema manually.
    try:
        return _WochenberichtPayload.model_validate_json(resp.text or "").model_dump()
    except Exception as e:
        dump = DATA / ".wochenbericht_debug.txt"
        dump.write_text(resp.text or "", encoding="utf-8")
        raise ValueError(f"Gemini structured response invalid: {e}. Raw saved to {dump}") from e


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


PROMPT = """Du konvertierst eine deutsche Wochen-Presseschau (Wochenbericht zur China-Berichterstattung) aus Markdown in eine strukturierte JSON-Form. Das Schema wird vom SDK über response_schema erzwungen — du musst exakt die drei Felder `quotes`, `facts`, `themes` mit den jeweils typisierten Items liefern.

Regeln (zwingend):
1. Behalte den deutschen Text WORT-WÖRTLICH. Keine Übersetzung, keine Paraphrase, keine Zusammenfassung.
2. Entferne führende "- " und "**" Bold-Marker bei den Zitaten/Fakten/Themen.
3. Zitate (`quotes[]`): `lead` = NUR der Name der Person (z.B. "Donald Trump", "Xi Jinping"). KEINE Rolle, KEIN Verb, KEINE Klammern im Lead. `text` = der gesamte Body-Satz (inklusive eventueller Verben wie "bekräftigte"/"warnte" und Rollenangaben) bis "(Source:".
4. Fakten (`facts[]`): `lead` = fett markierter Kurz-Titel. `text` = Body bis "(Source:".
5. Themen (`themes[]`): `title` = fett markierter Titel. `text` = alles zwischen Titel und "Prominente Quellen:". `sources` = die Liste danach.
6. Deutsche Daten "27. April 2026" → ISO "2026-04-27". Monate: Januar=01, Februar=02, März=03, April=04, Mai=05, Juni=06, Juli=07, August=08, September=09, Oktober=10, November=11, Dezember=12.
7. `outlet` = kanonische Kurzform (FAZ, Handelsblatt, Spiegel, Die Welt, DIE ZEIT, NZZ, Tagesspiegel, Welt am Sonntag, Süddeutsche Zeitung, WirtschaftsWoche, BILD). `outletDisplay` = wie in der Quelle erscheint (oft lowercase domain wie "faz.net", "handelsblatt.com").
8. ALLE inneren Anführungszeichen im Fließtext MÜSSEN als ASCII `"` korrekt mit Backslash escaped werden — sonst bricht das JSON. Im Zweifel verwende deutsche Gänsefüßchen „…" für innere Zitate.

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
    print("Calling Gemini (response_schema=_WochenberichtPayload)…")
    payload = gemini_call_structured(prompt)

    # Assemble the legacy {sections: [{slug, items, ...}]} shape the renderer
    # expects from the flat {quotes, facts, themes} payload.
    by_slug = {h[1]: h for h in SECTION_HINTS}
    section_specs = [
        ("quotes", "1", "quote",  payload.get("quotes", [])),
        ("facts",  "2", "fact",   payload.get("facts",  [])),
        ("themes", "3", "theme",  payload.get("themes", [])),
    ]
    sections = []
    for slug, number, kind, items in section_specs:
        _, _, short, label = by_slug[slug]
        # Re-attach `kind` (the renderer dispatches on it); Pydantic dropped it
        # since the discriminator lives in the per-section schema.
        for it in items:
            it["kind"] = kind
        sections.append({"number": number, "slug": slug, "short": short, "label": label, "items": items})

    # Safety net A: even with structured output, a Zitate lead can still
    # contain a parenthetical ("Donald Trump (bekräftigte)"). Unwrap to keep
    # bold = name only AND preserve the verb in the body. Never drop content.
    for sec in sections:
        if sec["slug"] != "quotes":
            continue
        for it in sec["items"]:
            lead = (it.get("lead") or "").strip()
            m = re.match(r"^(.*?)\s*\(([^)]+)\)\s*$", lead)
            if m:
                it["lead"] = m.group(1).strip()
                it["text"] = (m.group(2).strip() + " " + (it.get("text") or "")).strip()

    # Safety net B: strip any trailing "(Source: ...)" Gemini left dangling in
    # the body text. The source is already structured in `item.source`, so the
    # raw inline tail just looks like hanging garbage on the page.
    # Allow either a complete "(Source: …)" or a truncated "(Source:" tail.
    _src_tail = re.compile(r"\s*\(\s*Source\s*:[^)]*\)?\.?\s*$", re.IGNORECASE)
    for sec in sections:
        for it in sec["items"]:
            v = it.get("text")
            if isinstance(v, str):
                it["text"] = _src_tail.sub("", v).rstrip()

    ordered = {
        "label": "Wochenbericht: CN-Beziehungen durch die DE-Medien-Brille",
        "caveat": caveat_for(args.week_id),
        "sections": sections,
    }

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
