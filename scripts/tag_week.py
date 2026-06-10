"""Heuristic auto-tagger for data/W{NN}-{YYYY}.js.

Walks every entry in spotlight / context / research / numbered sections and
adds a `tags: [...]` list based on keyword matches against the controlled
vocabulary in data/tags.js. Run after build_week.py.

Usage:
    python scripts/tag_week.py W20-2026
    python scripts/tag_week.py W20-2026 --dry-run
"""
from __future__ import annotations
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"

# Keyword → tag id. Lower-case substring match against text fields.
# Order matters: first match wins per tag, but multiple tags can fire on one item.
RULES: list[tuple[str, list[str]]] = [
    # ---- Bilateral / geographic ----
    (r"\btrump\b.*\bxi\b|\bxi\b.*\btrump\b|trump-xi|us-china|us-cn|sino-american|"
     r"\bbessent\b|\bgreer\b|jamieson greer|white house|whitehouse",
        ["us-cn"]),
    (r"\beu[ -]china\b|brussels|european commission|\beu commission\b|"
     r"\beuropean union\b|eu-cn|\beeas\b|euractiv|von der leyen",
        ["eu-cn"]),
    (r"\bgermany\b|\bgerman\b|berlin|\bvw\b|volkswagen|merz|merkel|"
     r"\bbmwk?\b|bdi|bundes|merics|german chamber|ahk|deutschland",
        ["de-cn"]),
    (r"\bjapan\b|\btoky[oa]\b|nippon|\bjapanese\b|\bjp-cn\b|\bishiba\b",
        ["jp-cn"]),
    (r"\bindia\b|\bnew delhi\b|\bmodi\b|\bindo-pacific\b|\bin-cn\b",
        ["india-cn"]),
    (r"\btaiwan\b|\btsmc\b|\bipac\b|\bcross-strait\b|\btaipei\b|lai ching-te",
        ["twn"]),
    (r"\bhong[- ]?kong\b|\bhkma\b|\bnsl\b|article 23|\bhkfp\b",
        ["hk"]),
    (r"\bbritain\b|\bbritish\b|\bunited kingdom\b|\buk\b|downing street|"
     r"\bstarmer\b|\bsunak\b|whitehall|british steel",
        ["uk-cn"]),
    (r"\biran\b|\bhormuz\b|\btehran\b|\bmiddle east\b|\bmiddle-east\b|\bisrael\b|\bgaza\b",
        ["mid-east"]),
    (r"\brussia\b|\brussian\b|\bputin\b|\bkremlin\b|moscow|ru-cn",
        ["ru-cn"]),
    (r"\bvietnam\b|\bindonesia\b|\bphilippines\b|\bsea\b|asean|\bsingapore\b|\bmalaysia\b|"
     r"\bthailand\b|\bsouth-?east asia\b",
        ["sea"]),
    (r"\bmexico\b|\bbrazil\b|\bargentina\b|\blatam\b|latin america|\bvenezuela\b",
        ["latam"]),
    (r"\bafrica\b|\bafrican\b|\bnigeria\b|\bkenya\b|\bsouth africa\b|\bzimbabwe\b|"
     r"\bmadagascar\b",
        ["afr"]),
    (r"\bsco\b|shanghai cooperation organi[sz]ation",
        ["sco"]),
    (r"\bbrics\b|brics summit|brics\+",
        ["brics"]),

    # ---- Sectors / tech ----
    (r"\bchip\b|\bchips\b|semiconductor|\bsemcon\b|\bsemi\b|\basml\b|\btsmc\b|\bnvidia\b|"
     r"\bh100\b|\bh200\b|\bduv\b|euv|lithography|\bsmic\b|\bymtc\b|\bcxmt\b|wafer|fab\b",
        ["semcon"]),
    (r"\bai\b|artificial intelligence|\bllm\b|\bgenai\b|\bdeepseek\b|\bgpt\b|gemini|"
     r"large language model|generative",
        ["ai"]),
    (r"\bev\b|\bev[s]?\b|electric vehicle|\bxpeng\b|\bbyd\b|\bnio\b|\bli auto\b|\bzeekr\b|\bcar\b|\bautom",
        ["auto"]),
    (r"\bbatter(y|ies)\b|\bcatl\b|li-ion|lithium|\bcathod|\banod",
        ["batteries"]),
    (r"\brobot|\bhumanoid|\bunitree\b",
        ["robotics"]),
    (r"\bpharma|biotech|\bdrug\b|\bvaccine|fentanyl|\bbiopharma|merck|pharmaceutical",
        ["bio-pharma"]),
    (r"\brare earth|\brare-earth|\bmagnet|critical mineral|\bgallium\b|\bgermanium\b|\bgraphite\b|\bcobalt\b|\bindium\b",
        ["rare-earths"]),
    (r"\benergy\b|\boil\b|\bgas\b|\bsolar\b|\bwind power\b|\bgrid\b|\bgreen\b|hydrogen|nuclear power|\binverter",
        ["energy"]),
    (r"\bmilitary tech\b|defense industr|\bdrone\b|\buav\b|\bweapons\b|\bhensoldt\b|missile",
        ["mil-tech"]),
    (r"\baerospace\b|\bboeing\b|\bairbus\b|\baircraft\b|aviation|\bcomac\b",
        ["aerospace"]),

    # ---- Domestic CN ----
    (r"\bgdp\b|\bgrowth\b|\beconomic growth\b|\bmacro\b|\bdeflation\b|\binflation\b|\bcpi\b|"
     r"\bppi\b|\bstimulus\b|\bconsumption\b|consumer demand|fiscal|monetary policy|\bpboc\b|"
     r"\bunemployment\b",
        ["macro"]),
    (r"\bproperty\b|real estate|\bevergrande\b|country garden|housing market|housing crisis",
        ["property"]),
    (r"\bdemographic\b|\baging\b|\bbirths?\b|\bsociety\b|youth unemployment|\bgini\b|\bfertility\b",
        ["society"]),
    (r"\bideolog|xi jinping thought|\bccp\b|party congress|\bpolitburo\b|cadres|state council",
        ["ideology"]),
    (r"\bcorruption\b|anti-corruption|\bbribery\b|\bpurge\b",
        ["corruption"]),
    (r"\bnational security\b|state security|\bmss\b|\bespionage\b|\bcounter-?intelligence\b|"
     r"surveillance state",
        ["security"]),
    (r"\bclimate\b|\bcarbon\b|emissions|\bnet zero\b|net-zero|decarboniz|\bcop\d+\b",
        ["climate"]),
    (r"\bipo\b|\bipos\b|\ba-shares\b|hang seng|stock market|stock exchange|\bnasdaq\b|"
     r"\bcsi 300\b|stoxx|listed company|equit(y|ies)|\bbourse\b",
        ["markets"]),

    # ---- Geoeconomics tools ----
    (r"\btariff\b|\btrade\b|\bsurplus\b|\bdeficit\b|\bimport\b|\bexport\b|\bwto\b|\btrade war\b",
        ["trade"]),
    (r"export control|\beac\b|entity list|\bbis\b|foreign direct product|match act|"
     r"section 232|section 301",
        ["export-controls"]),
    (r"investment screening|cfius|inward investment|outbound investment screening|\bobins\b",
        ["investment-screening"]),
    (r"\bsanction|treasury sanction|secondary sanction|\bofac\b|asset freeze",
        ["sanctions"]),
    (r"\bfdi\b|foreign direct investment|\binvestment\b|m&a\b|merger and acquisition",
        ["investment"]),
    (r"supply chain|\bonshoring\b|\bnearshoring\b|\bfriend-?shoring\b|de-risk|derisk",
        ["supply-chain"]),
    (r"\bbri\b|belt and road|silk road|one belt one road",
        ["bri"]),
    (r"made in china 2025|\bmic 2025\b|industrial polic|industrial subsid|"
     r"overcapacity|state-led|state capitalism|china standards 2035|"
     r"strategic emerging industries|industries brief",
        ["industrial-policy"]),

    # ---- Defense & external ----
    (r"\bpla\b|people's liberation army|navy exercises|naval exercise|joint exercise|"
     r"\bplaaf\b|plan",
        ["pla"]),
    (r"\bfimi\b|foreign information manipulation|disinformation|influence operation|"
     r"\binfo-op\b|cognitive warfare",
        ["fimi"]),
    (r"\bcyber\b|\bhack\b|\bapt\b|ransomware|\bzero-day\b|salt typhoon|volt typhoon",
        ["cyber"]),
    (r"\bnuclear\b|nuclear weapon|warhead|\bdf-?\d+\b|deterrence|extended deterrence",
        ["nuclear"]),
    (r"\bmaritime\b|south china sea|east china sea|\bspratly\b|paracel|coast guard|"
     r"\bvessel|\bshipping\b",
        ["maritime"]),
    (r"\bspy\b|\bspies\b|\bespionage\b|\bspy case\b|recruited as (an?\s+)?(spy|agent|asset)|"
     r"intelligence officer|mss[- ]linked|undercover|\bmole\b|\bdefector\b",
        ["espionage"]),
    (r"\bsummit\b|state visit|bilateral meeting|head[- ]of[- ]state|\bdiplomatic\b|"
     r"foreign minister|state council|presidential visit|\benvoy\b|prime minister visit",
        ["diplomacy"]),

    # ---- Discourse ----
    (r"aisixiang|\b爱思想\b|yan xuetong|wang yi|zhou li|chinese scholars?|chinese academic|"
     r"chinese debate|cn discourse|chinese intellectual",
        ["cn-discourse"]),
    (r"\bpropaganda\b|global times|people's daily|xinhua|cctv|english.news.cn|state media|"
     r"party line",
        ["propaganda"]),
    (r"\buyghur|\bxinjiang\b|\btibet\b|\bdissident|\bhuman rights\b|"
     r"religious persecution|forced labor|forced labour|re-education|reeducation|"
     r"falun gong|press freedom|political prisoner",
        ["human-rights"]),
]


def tags_for_text(text: str) -> list[str]:
    """Return a deduped, ordered list of tag ids that match the text."""
    low = text.lower()
    hits: list[str] = []
    seen: set[str] = set()
    for pattern, tag_ids in RULES:
        if re.search(pattern, low):
            for t in tag_ids:
                if t not in seen:
                    seen.add(t)
                    hits.append(t)
    return hits


def item_text(item: dict) -> str:
    parts: list[str] = []
    for k in ("outlet", "title", "note"):
        v = item.get(k)
        if isinstance(v, str):
            parts.append(v)
    bullets = item.get("bullets") or []
    for b in bullets:
        if isinstance(b, list):
            parts.extend(str(x) for x in b if x)
    return " ".join(parts)


def tag_items_in_section(section: dict, parent_label: str = "", fallback: list[str] | None = None) -> int:
    """Tag items in a section. If an item's text yields no tags but the
    parent's label does (e.g. subsection label 'Trump on Taiwan' → us-cn + twn),
    inherit those parent tags so context isn't lost on short bullets. As a
    last resort, fall back to the caller-supplied default tag list."""
    section_label = " ".join(filter(None, [parent_label, section.get("label") or ""]))
    parent_tags = tags_for_text(section_label)
    n = 0
    for it in section.get("items", []) or []:
        if "tags" in it and it["tags"]:
            continue
        tags = tags_for_text(item_text(it))
        if not tags and parent_tags:
            tags = list(parent_tags)
        if not tags and fallback:
            tags = list(fallback)
        if tags:
            it["tags"] = tags
            n += 1
    return n


# Defaults per basket slug — used when an item's own text + section label both
# fail to match any rule. Conservative: only basket-level themes.
NUMBERED_FALLBACK = {
    "econ":      ["macro"],
    "domestic":  ["society"],
    "tech":      ["semcon"],
    "trade":     ["trade"],
    "foreign":   ["diplomacy"],   # Foreign policy / Global China
    "responses": ["diplomacy"],   # Strategic implications & responses
    "debates":   ["cn-discourse"],
}


def _all_items(payload: dict):
    """Yield every taggable entry across the payload (for the coverage check)."""
    sp = payload.get("spotlight") or {}
    yield from sp.get("items") or []
    for sub in sp.get("subsections") or []:
        yield from sub.get("items") or []
    for key in ("contextSections", "researchSections"):
        for sec in payload.get(key) or []:
            for g in sec.get("groups") or []:
                yield from g.get("items") or []
            yield from sec.get("items") or []
    for key in ("numberedSections", "chineseSourcesSections"):
        for sec in payload.get(key) or []:
            yield from sec.get("items") or []


def tag_payload(payload: dict) -> dict:
    counts = {"spotlight": 0, "context": 0, "research": 0, "numbered": 0,
              "subsections": 0, "cnsources": 0}
    sp = payload.get("spotlight") or {}
    sp_label = sp.get("title") or "Spotlight"
    # Every section carries a guaranteed fallback so NO entry is left untagged.
    counts["spotlight"] += tag_items_in_section(sp, sp_label, fallback=["diplomacy"])
    for sub in sp.get("subsections") or []:
        counts["subsections"] += tag_items_in_section(sub, sp_label, fallback=["diplomacy"])
    for sec in payload.get("contextSections") or []:
        for g in sec.get("groups") or []:
            counts["context"] += tag_items_in_section(g, sec.get("label") or "", fallback=["de-cn"])
    for sec in payload.get("researchSections") or []:
        for g in sec.get("groups") or []:
            counts["research"] += tag_items_in_section(g, sec.get("label") or "", fallback=["eu-cn"])
        counts["research"] += tag_items_in_section(sec, fallback=["eu-cn"])
    for sec in payload.get("numberedSections") or []:
        fb = NUMBERED_FALLBACK.get(sec.get("slug") or "", ["diplomacy"])
        counts["numbered"] += tag_items_in_section(sec, fallback=fb)
    # Chinese Sources (Part IV) — was never tagged before.
    for sec in payload.get("chineseSourcesSections") or []:
        counts["cnsources"] += tag_items_in_section(sec, sec.get("label") or "", fallback=["cn-discourse"])
    print("Tagged:", counts, "total:", sum(counts.values()))

    # Coverage assertion — there must be ZERO untagged entries.
    untagged = [it for it in _all_items(payload) if not it.get("tags")]
    if untagged:
        print(f"WARNING: {len(untagged)} UNTAGGED entries (vocab/fallback gap) - fix before ship:")
        for it in untagged[:10]:
            print("   -", (it.get("outlet") or item_text(it)[:55] or "(blank)"))
    else:
        print("OK: 0 untagged entries")
    return payload


_HEADER_RE = re.compile(
    r"^(?P<head>(?:.|\n)*?window\.\w+\s*=\s*)(?P<body>\{(?:.|\n)*\})(?P<tail>;\s*(?:.|\n)*)$"
)


def load_and_rewrite(path: Path, dry_run: bool) -> None:
    raw = path.read_text(encoding="utf-8")
    m = _HEADER_RE.search(raw)
    if not m:
        sys.exit(f"Could not parse JS object literal in {path}")
    head, body, tail = m.group("head"), m.group("body"), m.group("tail")
    payload = json.loads(body)
    tag_payload(payload)
    new_body = json.dumps(payload, ensure_ascii=False, indent=2)
    new_content = head + new_body + tail
    if dry_run:
        print(f"(dry-run) would write {len(new_content):,} bytes to {path}")
        return
    path.write_text(new_content, encoding="utf-8")
    print(f"Wrote {path}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("week_id", help="e.g. W20-2026")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    path = DATA / f"{args.week_id}.js"
    if not path.exists():
        sys.exit(f"Not found: {path}")
    load_and_rewrite(path, args.dry_run)
    return 0


if __name__ == "__main__":
    sys.exit(main())
