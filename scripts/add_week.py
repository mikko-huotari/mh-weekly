"""add_week.py — register a new week in the mh-weekly archive.

Cuts the manual Sunday steps (drop PDF in pdfs/, edit index.html, edit render.js,
edit WEEKS array). With the manifest-driven loader (data/manifest.json), the
only thing that needs to happen is:

    1. PDF copied to pdfs/W{NN}-{YYYY}.pdf
    2. Empty data file scaffolded if data/W{NN}-{YYYY}.js doesn't exist
    3. Week id prepended to data/manifest.json (most recent first)
    4. (Optional) git add + commit

Usage:
    python scripts/add_week.py W21-2026 /path/to/W21-2026.pdf
    python scripts/add_week.py W21-2026 /path/to/W21-2026.pdf --no-wochenbericht
    python scripts/add_week.py W21-2026 /path/to/W21-2026.pdf --no-commit

The scaffolded data file is a stub — replace its contents with the real
build_week.py output before deploying.
"""
from __future__ import annotations
import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "data" / "manifest.json"
DATA_DIR = ROOT / "data"
PDF_DIR = ROOT / "pdfs"

WEEK_RE = re.compile(r"^W(\d{1,2})-(\d{4})$")

STUB_TEMPLATE = """// {week_id} — scaffolded by scripts/add_week.py on {today}.
// Replace with real output from build_week.py before publishing.
window.{global_name} = {{
  id: "{week_id}",
  week: {week_num},
  year: {year},
  dateRange: "TBD",
  pdf: "pdfs/{week_id}.pdf",
  spotlight: null,
  contextSections: [],
  researchSections: [],
  numberedSections: [],
  topCharts: []
}};
"""


def parse_week(week_id: str) -> tuple[int, int]:
    m = WEEK_RE.match(week_id)
    if not m:
        sys.exit(f"week id must look like W21-2026, got: {week_id!r}")
    return int(m.group(1)), int(m.group(2))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("week_id", help="e.g. W21-2026")
    ap.add_argument("pdf", type=Path, help="path to the source PDF")
    ap.add_argument("--no-wochenbericht", action="store_true",
                    help="skip the wochenbericht companion file in the manifest entry")
    ap.add_argument("--no-commit", action="store_true",
                    help="stage changes but don't commit/push")
    args = ap.parse_args()

    week_num, year = parse_week(args.week_id)

    if not args.pdf.exists():
        sys.exit(f"PDF not found: {args.pdf}")
    PDF_DIR.mkdir(exist_ok=True)
    pdf_dest = PDF_DIR / f"{args.week_id}.pdf"
    shutil.copy2(args.pdf, pdf_dest)
    print(f"[ok] copied PDF -> {pdf_dest.relative_to(ROOT)}")

    data_file = DATA_DIR / f"{args.week_id}.js"
    if not data_file.exists():
        from datetime import date
        global_name = f"W{week_num}_{year}"
        data_file.write_text(
            STUB_TEMPLATE.format(
                week_id=args.week_id,
                global_name=global_name,
                week_num=week_num,
                year=year,
                today=date.today().isoformat(),
            ),
            encoding="utf-8",
        )
        print(f"[ok] scaffolded stub -> {data_file.relative_to(ROOT)}  (REPLACE before publish)")
    else:
        print(f"[skip] data file already exists: {data_file.relative_to(ROOT)}")

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    weeks = manifest.get("weeks", [])
    if any(w.get("id") == args.week_id for w in weeks):
        print(f"[skip] manifest already lists {args.week_id}")
    else:
        weeks.insert(0, {"id": args.week_id, "has_wochenbericht": not args.no_wochenbericht})
        # Resort newest-first to be safe even if caller is replaying old weeks
        weeks.sort(key=lambda w: tuple(int(x) for x in WEEK_RE.match(w["id"]).groups()[::-1]),
                   reverse=True)
        manifest["weeks"] = weeks
        # Bump version so browsers re-fetch
        from datetime import datetime
        manifest["version"] = datetime.now().strftime("%Y%m%d") + "a"
        MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
        print(f"[ok] registered in manifest, bumped to version {manifest['version']}")

    paths = [pdf_dest.relative_to(ROOT), data_file.relative_to(ROOT), MANIFEST.relative_to(ROOT)]
    subprocess.run(["git", "add", *[str(p) for p in paths]], cwd=ROOT, check=True)
    print(f"[ok] git add: {', '.join(str(p) for p in paths)}")

    if args.no_commit:
        print("[done] staged only (--no-commit)")
        return 0

    subprocess.run(["git", "commit", "-m", f"Add {args.week_id} to archive"], cwd=ROOT, check=True)
    print(f"[ok] committed")
    print("Next: edit data/{0}.js with real content (or paste build_week.py output), then `git push`.".format(args.week_id))
    return 0


if __name__ == "__main__":
    sys.exit(main())
