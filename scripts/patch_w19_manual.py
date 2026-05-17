"""One-shot manual URL overrides for W19 entries with editorial titles that
don't appear verbatim in the export (Spotlight bylines, MERICS bylines, Media
insights). Idempotent — re-running is safe.
"""
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data" / "W19-2026.js"

# Map: unique title fragment (as it appears in the JS file) -> URL.
# Each fragment must be unique enough to identify the entry.
OVERRIDES = {
    # Spotlight
    '"\\u201cKalk\\u00fcl, kein Kurswechsel\\u201d"':
        "https://www.faz.net/premium/weltwirtschaft/weltwissen/peking-und-donald-trump-kalkuel-statt-kurswechsel-accg-200803633.html",
    '"\\u201cZwei schw\\u00e4chelnde Giganten\\u201d"':
        "https://www.nzz.ch/international/wir-haben-es-mit-zwei-schwaechelnden-giganten-zu-tun-ein-china-experte-ueber-den-gipfel-bei-dem-fuer-trump-und-xi-viel-auf-dem-spiel-steht-ld.10006209",
    '"Supply-chain regulations and a Trump\\u2013Xi outlook"':
        "https://merics.org/en/podcast/china-2026-new-supply-chain-regulations-outlook-trump-xi-meeting",
    '"The Trump\\u2013Xi Summit, with Jacob Gunter and Helena Legarda"':
        "https://merics.org/en/Press_Briefing_Trump_Xi_Summit",
    # MERICS bylines from China Essentials
    '"On fuel exports"':
        "https://merics.org/en/merics-briefs/china-resumes-fuel-exports-us-oil-sanctions-emission-quotas-local-cadres",
    '"On the blocking statute and Iranian oil"':
        "https://merics.org/en/merics-briefs/china-resumes-fuel-exports-us-oil-sanctions-emission-quotas-local-cadres",
    '"On binding emission quotas for cadres"':
        "https://merics.org/en/merics-briefs/china-resumes-fuel-exports-us-oil-sanctions-emission-quotas-local-cadres",
    '"On AI-driven employment shocks"':
        "https://merics.org/en/merics-briefs/china-resumes-fuel-exports-us-oil-sanctions-emission-quotas-local-cadres",
    # Soapbox
    '"Issue 246: trade exposures and IP flows"':
        "https://soapboxtrade.substack.com/p/taiwans-export-map-tilts-toward-the",
    # Media Insights
    '"Embodied-AI report cited in \\u2018robo-cops\\u2019 piece"':
        "https://www.straitstimes.com/asia/east-asia/could-robo-cops-replace-some-traffic-police-in-china",
    '"Asia Specific: Wendy Chang on the unwound Manus deal"':
        "https://www.bbc.com/audio/play/p0njks30",
    '"Claus Soong on China\\u2019s Taiwan strategy in the run-up to the summit"':
        "https://www.straitstimes.com/asia/east-asia/ahead-of-trump-xi-summit-beijing-puts-taiwan-front-and-centre-but-will-us-make-any-concessions",
    '"Helena Legarda on export controls complicating EU\\u2013China ties"':
        "https://www.scmp.com/news/china/diplomacy/article/3352351/two-worlds-collide-regulatory-battlefield-hanging-over-eus-ties-china",
}


def main() -> None:
    src = DATA.read_text(encoding="utf-8")
    patched = 0
    for title_frag, url in OVERRIDES.items():
        # Replace the first url:"#" after this title fragment
        idx = src.find(title_frag)
        if idx < 0:
            print(f"  ! not found: {title_frag[:60]}")
            continue
        url_idx = src.find('url: "#"', idx)
        if url_idx < 0:
            print(f"  - already patched: {title_frag[:60]}")
            continue
        # Sanity: ensure url:"#" is within reasonable distance (same object)
        if url_idx - idx > 400:
            print(f"  ! url:# too far from title: {title_frag[:60]}")
            continue
        src = src[:url_idx] + f'url: "{url}"' + src[url_idx + len('url: "#"'):]
        patched += 1
    DATA.write_text(src, encoding="utf-8")
    print(f"Patched {patched} of {len(OVERRIDES)} editorial overrides.")


if __name__ == "__main__":
    main()
