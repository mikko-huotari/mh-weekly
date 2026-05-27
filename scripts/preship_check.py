"""preship_check - advisory pre-deploy checks for the ONLINE edition.

The vault has 22 markdown validators (5 SYSTEM/newsletter_checks). This is the
missing companion for the WEB build: run it in ~/dev/mh-weekly before pushing a
new week so the bugs that cost the W21 online-first rollout get caught by a gate,
not by eye. Advisory only (non-zero exit on FAIL so CI/hooks can opt in).

Usage:  python scripts/preship_check.py W21-2026
"""
from __future__ import annotations
import json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UNIT_TOKENS = ("%", " bn", " mn", "billion", "million", "€", "eur", "us$", "usd",
               "yuan", "rmb", "$", "share", "index", "ppt", "pp ", "per cent", "percent")

oks, warns, fails = [], [], []
def ok(m):   oks.append(m)
def warn(m): warns.append(m)
def fail(m): fails.append(m)


def load_payload(week: str) -> dict:
    p = ROOT / "data" / f"{week}.js"
    if not p.exists():
        fail(f"data/{week}.js missing"); return {}
    t = p.read_text(encoding="utf-8")
    i, j = t.find("{"), t.rfind("}")
    return json.loads(t[i:j + 1]) if i >= 0 and j > i else {}


def check_parts(w: dict):
    # Every section that has a tab must be non-empty (catches parser schema drift).
    counts = {
        "spotlights": len(w.get("spotlights") or []),
        "context (German policy)": len((w.get("contextSections") or [{}])[0].get("groups", [{}])[0].get("items", [])) if w.get("contextSections") else 0,
        "MERICS/research": sum(len(g.get("items", [])) for s in (w.get("researchSections") or []) for g in s.get("groups", [])),
        "International (numbered)": sum(len(s.get("items", [])) for s in (w.get("numberedSections") or [])),
        "Chinese Sources": sum(len(s.get("items", [])) for s in (w.get("chineseSourcesSections") or [])),
        "Top Charts": len(w.get("topCharts") or []),
    }
    for name, n in counts.items():
        (ok if n > 0 else fail)(f"part '{name}': {n} items")


def check_charts(w: dict):
    for i, c in enumerate(w.get("topCharts") or [], 1):
        src = c.get("src", "")
        if not src:
            fail(f"chart {i}: no src"); continue
        if not (ROOT / src).exists():
            fail(f"chart {i}: asset missing ({src})")
        else:
            ok(f"chart {i}: asset present")
        cap = (c.get("caption", "") + " " + c.get("alt", "")).lower()
        if not any(tok in cap for tok in UNIT_TOKENS):
            warn(f"chart {i}: caption/alt has no unit token - confirm the chart shows its unit ({(c.get('caption') or '')[:50]!r})")


def check_cache_bump(week: str):
    here = json.loads((ROOT / "data" / "manifest.json").read_text(encoding="utf-8")).get("version")
    try:
        deployed_raw = subprocess.check_output(["git", "show", "origin/main:data/manifest.json"], cwd=ROOT, text=True, stderr=subprocess.DEVNULL)
        deployed = json.loads(deployed_raw).get("version")
    except Exception:
        deployed = None
    if deployed and here == deployed:
        fail(f"manifest cache NOT bumped (still {here}) - browsers will serve stale render.js/data")
    else:
        ok(f"manifest cache bumped ({deployed} -> {here})")


def check_print_safeguards():
    r = (ROOT / "render.js").read_text(encoding="utf-8")
    (ok if 'loading="eager"' in r else fail)("chart/badge imgs eager-load" if 'loading="eager"' in r else "imgs not eager-load (lazy -> blank in print)")
    rp = r[r.find("function runPrint"): r.find("function runPrint") + 1200] if "runPrint" in r else ""
    (ok if "await" in rp and "img" in rp else fail)("runPrint awaits images before print()" if "await" in rp else "runPrint does NOT await images (charts/logos print blank)")


def check_absorption(w: dict):
    # An entry with a huge bullet count usually means bullets were absorbed from
    # a deleted/adjacent entry, or a list was never trimmed (W21: 35-and-out=11).
    for s in (w.get("numberedSections") or []) + [g for r in (w.get("researchSections") or []) for g in r.get("groups", [])]:
        for it in s.get("items", []):
            n = len(it.get("bullets", []))
            if n > 6:
                warn(f"entry '{(it.get('outlet') or it.get('title') or '?')[:40]}' has {n} bullets - possible absorption / untrimmed")


def main():
    if len(sys.argv) < 2:
        print("usage: preship_check.py W{NN}-{YYYY}"); sys.exit(2)
    week = sys.argv[1]
    w = load_payload(week)
    if w:
        check_parts(w); check_charts(w); check_absorption(w)
    check_cache_bump(week); check_print_safeguards()

    for m in oks:   print(f"  ok   {m}")
    for m in warns: print(f"  WARN {m}")
    for m in fails: print(f"  FAIL {m}")
    print(f"\n{week}: {len(oks)} ok, {len(warns)} warn, {len(fails)} fail")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
