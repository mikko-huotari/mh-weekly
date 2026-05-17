"""Patch the German-China-policy context section of W19 (and the Wang Jisi
Spotlight link) with real URLs that the regex-based backfill missed.

Each entry is matched by a unique substring of the note (case-sensitive) so
re-running is safe.
"""
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data" / "W19-2026.js"

# (unique_note_fragment, url)
PATCHES: list[tuple[str, str]] = [
    # Wang Jisi confidential SharePoint video (password: future-china)
    (
        "A long-form sit-down",
        "https://merics365-my.sharepoint.com/:v:/g/personal/video_merics_de/IQABVshzIXwlTrQUb9psCVZWAR9cBYMBGUssUz_YudJT3wc",
    ),
    # GER subgroup
    (
        "CN calls on GER to stem",
        "https://www.bloomberg.com/news/articles/2026-05-09/china-calls-on-germany-to-stem-eu-drift-toward-protectionism",
    ),
    (
        "DIHK Au\\u00dfenwirtschaftsreport",
        "https://www.dihk.de/de/newsroom/aussenwirtschaftsreport-2026-die-trends-im-internationalen-geschaeft-176828",
    ),
    (
        "ENBW (largest provider of fast EV charging",
        "https://www.businessinsider.de/wirtschaft/enbw-china-supplier-xcharge-ev-ladesaeulen/",
    ),
    # Europe/EU subgroup
    (
        "\\u201cChina\\u2013EU investment deal should stay in deep freezer\\u201d",
        "https://www.scmp.com/news/china/diplomacy/article/3352714/china-eu-investment-deal-should-stay-deep-freezer-warns-outgoing-trade-chief",
    ),
    (
        "BEL urges EU (again) to save industry",
        "https://www.politico.eu/article/belgium-urges-eu-save-industry-getting-tough-on-china/",
    ),
    (
        "SWE arrests CN captain of suspected Russia-linked vessel",
        "https://www.reuters.com/world/china/sweden-arrests-chinese-captain-suspected-russia-linked-vessel-2026-05-04/",
    ),
    (
        "IRL data protection authorities investigate Shein",
        "https://www.heise.de/en/news/Irish-data-protection-authorities-investigate-Shein-over-data-transfer-to-China-11284890.html",
    ),
    (
        "Lobbying report by China Chamber of Commerce to the EU",
        "https://www.scmp.com/economy/china-economy/article/3352610/eu-cyber-plan-barring-chinese-suppliers-will-cost-us430-billion-report",
    ),
    (
        "Renewed Chinese efforts to shape the information environment in Brussels",
        "https://brusselsteahouse.substack.com/",
    ),
    (
        "Social democratic think tank / publisher doubles down on China overcapacity",
        "https://www.socialeurope.eu/the-china-overcapacity-debate-needs-a-rethink",
    ),
    (
        "Europe Day and EU delegation reception",
        "https://www.eeas.europa.eu/delegations/china/europe-day-2026-celebrated-china-culture-dialogue-and-partnership_en",
    ),
    (
        "\\u201cThe Ring\\u201d debate features",
        "https://www.euractiv.com/section/eu-elections/news/the-ring-meps-eu-trade-china/",
    ),
    # G7 and global context
    (
        "G7 trade ministers meet in Paris",
        "https://www.usnews.com/news/world/articles/2026-05-08/g7-trade-ministers-meet-in-paris-amid-tariff-tensions",
    ),
    (
        "US revises UN resolution on Iran but CN, RU still expected to veto",
        "https://www.reuters.com/world/china/us-revises-un-resolution-iran-china-russia-still-expected-veto-2026-05-08/",
    ),
    (
        "EU, Brazil and CN launch coalition to boost integrity",
        "https://climate.ec.europa.eu/news-other-reads/news/eu-brazil-and-china-launch-open-coalition-boost-integrity-and-effectiveness-carbon-markets-2026-05-07_en",
    ),
]


def main() -> None:
    src = DATA.read_text(encoding="utf-8")
    patched = 0
    for fragment, url in PATCHES:
        idx = src.find(fragment)
        if idx < 0:
            print(f"  ! not found: {fragment[:60]}")
            continue
        # Look BACKWARDS for the url:"#" that belongs to THIS entry (closest before fragment)
        backstop = src.rfind('url: "#"', 0, idx)
        # And forwards for safety (some context items have url AFTER note text)
        forward = src.find('url: "#"', idx)
        if backstop < 0 and forward < 0:
            print(f"  - already patched: {fragment[:60]}")
            continue
        # Pick the closest occurrence
        if backstop < 0:
            target = forward
        elif forward < 0:
            target = backstop
        else:
            target = backstop if (idx - backstop) < (forward - idx) else forward
        if abs(target - idx) > 600:
            print(f"  ! url:# too far from fragment: {fragment[:60]}")
            continue
        src = src[:target] + f'url: "{url}"' + src[target + len('url: "#"'):]
        patched += 1
    DATA.write_text(src, encoding="utf-8")
    print(f"Patched {patched} of {len(PATCHES)} context overrides.")


if __name__ == "__main__":
    main()
