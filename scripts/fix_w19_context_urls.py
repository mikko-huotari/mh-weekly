"""One-shot: realign W19 context-section URLs after the off-by-one bug in
patch_w19_context.py shifted urls. Matches each entry by a unique substring of
its `note` and overwrites the `url:` field. Idempotent.
"""
import re
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data" / "W19-2026.js"

# (note_fragment, correct_url)
FIXES = [
    ('"China–EU investment deal should stay in deep freezer"',
     "https://www.scmp.com/news/china/diplomacy/article/3352714/china-eu-investment-deal-should-stay-deep-freezer-warns-outgoing-trade-chief"),
    ("BEL urges EU (again) to save industry",
     "https://www.politico.eu/article/belgium-urges-eu-save-industry-getting-tough-on-china/"),
    ("SWE arrests CN captain",
     "https://www.reuters.com/world/china/sweden-arrests-chinese-captain-suspected-russia-linked-vessel-2026-05-04/"),
    ("IRL data protection authorities investigate Shein",
     "https://www.heise.de/en/news/Irish-data-protection-authorities-investigate-Shein-over-data-transfer-to-China-11284890.html"),
    ("Lobbying report by China Chamber of Commerce",
     "https://www.scmp.com/economy/china-economy/article/3352610/eu-cyber-plan-barring-chinese-suppliers-will-cost-us430-billion-report"),
    ("Renewed Chinese efforts to shape the information environment",
     "https://brusselsteahouse.substack.com/"),
    ("Social democratic think tank / publisher doubles down",
     "https://www.socialeurope.eu/the-china-overcapacity-debate-needs-a-rethink"),
    ("Europe Day and EU delegation reception",
     "https://www.eeas.europa.eu/delegations/china/europe-day-2026-celebrated-china-culture-dialogue-and-partnership_en"),
    ("\"The Ring\" debate features",
     "https://www.euractiv.com/section/eu-elections/news/the-ring-meps-eu-trade-china/"),
    ("G7 trade ministers meet in Paris",
     "https://www.usnews.com/news/world/articles/2026-05-08/g7-trade-ministers-meet-in-paris-amid-tariff-tensions"),
    ("US revises UN resolution on Iran",
     "https://www.reuters.com/world/china/us-revises-un-resolution-iran-china-russia-still-expected-veto-2026-05-08/"),
    ("EU, Brazil and CN launch coalition",
     "https://climate.ec.europa.eu/news-other-reads/news/eu-brazil-and-china-launch-open-coalition-boost-integrity-and-effectiveness-carbon-markets-2026-05-07_en"),
]


def main() -> None:
    src = DATA.read_text(encoding="utf-8")
    fixed = 0
    for fragment, url in FIXES:
        # The note field comes AFTER url in the JSON object literal. Find note
        # position, then walk backwards to the immediately preceding `"url":`.
        idx = src.find(fragment)
        if idx < 0:
            print(f"  ! fragment not found: {fragment[:50]}")
            continue
        url_match = list(re.finditer(r'"url":\s*"[^"]*"', src[:idx]))
        if not url_match:
            print(f"  ! no preceding url for: {fragment[:50]}")
            continue
        last = url_match[-1]
        new_pair = f'"url": "{url}"'
        if src[last.start():last.end()] == new_pair:
            continue  # already correct
        src = src[:last.start()] + new_pair + src[last.end():]
        fixed += 1
    DATA.write_text(src, encoding="utf-8")
    print(f"Realigned {fixed} of {len(FIXES)} context URLs.")


if __name__ == "__main__":
    main()
