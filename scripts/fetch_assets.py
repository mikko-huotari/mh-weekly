"""Download all outlet logos (via Google's favicon service) + MERICS headshots.

Run once after this script's URL lists are updated. Idempotent — re-running
overwrites existing files in-place.
"""
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ICONS = ROOT / "assets" / "icons"
PEOPLE = ROOT / "assets" / "people"
ICONS.mkdir(parents=True, exist_ok=True)
PEOPLE.mkdir(parents=True, exist_ok=True)

# (slug, domain) — slug becomes the filename, domain feeds Google's favicon API
OUTLETS = [
    ("ft",                 "ft.com"),
    ("nyt",                "nytimes.com"),
    ("wsj",                "wsj.com"),
    ("reuters",            "reuters.com"),
    ("ap",                 "apnews.com"),
    ("bloomberg",          "bloomberg.com"),
    ("scmp",               "scmp.com"),
    ("caixin",             "caixinglobal.com"),
    ("nikkei",             "asia.nikkei.com"),
    ("chinatalk",          "chinatalk.media"),
    ("wirechina",          "thewirechina.com"),
    ("trivium",            "triviumchina.com"),
    ("straitstimes",       "straitstimes.com"),
    ("economist",          "economist.com"),
    ("foreignaffairs",     "foreignaffairs.com"),
    ("foreignpolicy",      "foreignpolicy.com"),
    ("newyorker",          "newyorker.com"),
    ("time",               "time.com"),
    ("semafor",            "semafor.com"),
    ("politico",           "politico.eu"),
    ("brookings",          "brookings.edu"),
    ("cfr",                "cfr.org"),
    ("atlanticcouncil",    "atlanticcouncil.org"),
    ("carnegie",           "carnegieendowment.org"),
    ("bbc",                "bbc.com"),
    ("lowy",               "lowyinstitute.org"),
    ("npr",                "npr.org"),
    ("afp",                "afp.com"),
    ("hudson",             "hudson.org"),
    ("rhodium",            "rhg.com"),
    ("icij",               "icij.org"),
    ("anadolu",            "aa.com.tr"),
    ("heise",              "heise.de"),
    ("usnews",             "usnews.com"),
    ("theatlantic",        "theatlantic.com"),
    ("ndr",                "ndr.de"),
    ("tagesschau",         "tagesschau.de"),
    ("deutschlandfunk",    "deutschlandfunk.de"),
    ("chinadaily",         "chinadaily.com.cn"),
    ("eastisread",         "eastisread.com"),
    ("choosingvictory",    "choosingvictory.com"),
    ("guardian",           "theguardian.com"),
    ("dihk",               "dihk.de"),
    # German
    ("faz",                "faz.net"),
    ("nzz",                "nzz.ch"),
    ("handelsblatt",       "handelsblatt.com"),
    ("spiegel",            "spiegel.de"),
    ("zeit",               "zeit.de"),
    ("sueddeutsche",       "sueddeutsche.de"),
    ("welt",               "welt.de"),
    ("bild",               "bild.de"),
    ("tagesspiegel",       "tagesspiegel.de"),
    ("wiwo",               "wiwo.de"),
    ("welt-am-sonntag",    "welt.de"),
    ("businessinsider",    "businessinsider.de"),
    ("euronews",           "euronews.com"),
    # Substack
    ("soapbox",            "soapboxtrade.substack.com"),
    ("noahbarkin",         "nbarkin.substack.com"),
    ("brusselsteahouse",   "brusselsteahouse.substack.com"),
]

# (slug, url) — MERICS staff
PEOPLE_URLS = [
    ("gunter",      "https://merics.org/sites/default/files/styles/ct_team_member_default/public/2023-11/merics-jacob-gunter-website.jpg"),
    ("legarda",     "https://merics.org/sites/default/files/2020-04/HelenaLegardaPress.jpg"),
    ("chang",       "https://merics.org/sites/default/files/2025-03/urban20250310-01-003.jpg"),
    ("krebs",       "https://merics.org/sites/default/files/styles/ct_team_member_default/public/2025-10/Johanna%20Krebs%20Photo.jpg"),
    ("soong",       "https://merics.org/sites/default/files/2025-03/Claus%20Soong_Copyright%20MERICS_Marco%20Urban_1.jpg"),
    ("drinhausen",  "https://merics.org/sites/default/files/2020-04/KatjaDrinhausenPress_0.jpg"),
    ("bartsch",     "https://merics.org/sites/default/files/styles/ct_team_member_default/public/2022-03/BernhardBartschWebsite.png"),
    ("seiwert",     "https://merics.org/sites/default/files/styles/ct_team_member_default/public/2024-10/merics-eva-seiwert-web.jpg"),
]


UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}


def download(url: str, out: Path) -> bool:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        if len(data) < 200:
            print(f"  ! too small ({len(data)}b): {out.name}")
            return False
        out.write_bytes(data)
        return True
    except Exception as exc:
        print(f"  ! failed {out.name}: {exc}")
        return False


def main() -> None:
    print("Outlet favicons (Google s2):")
    ok = fail = 0
    for slug, domain in OUTLETS:
        target = ICONS / f"{slug}.png"
        url = f"https://www.google.com/s2/favicons?domain={domain}&sz=128"
        if download(url, target):
            ok += 1
        else:
            fail += 1
    print(f"  -> {ok} ok, {fail} fail")
    print()
    print("MERICS headshots:")
    for slug, url in PEOPLE_URLS:
        ext = ".png" if url.lower().endswith(".png") else ".jpg"
        target = PEOPLE / f"{slug}{ext}"
        download(url, target)


if __name__ == "__main__":
    main()
