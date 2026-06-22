"""Build W25-2026-wochenbericht.js deterministically from the GER side files
(.w25_2026_ger_s1.md / s2.md / s3.md). Bypasses the broken claude-CLI JSON path.

Bullet formats:
  s1 quotes:  - **{lead} ({role})** *{text}*. (Source: „{title}", {outlet}, {DD.MM.YYYY}).
  s2 facts:   - **{lead}**: {text} (Source: „{title}", {outlet}, {DD.MM.YYYY}).
  s3 themes:  - **{title}**: {text} Prominente Quellen: „{t1}", {o1}, {d1}; „{t2}", {o2}, {d2}; ...
"""
import re, json, os, sys

VAULT = r'C:/Users/Mikko.Huotari/OneDrive - Mercator Institute for China Studies gGmbH/Dokumente/MH/5 SYSTEM'
WEEK = 'W25-2026'

def _de_date(s):
    m = re.match(r'(\d{1,2})\.(\d{1,2})\.(\d{4})', s.strip())
    if not m: return s.strip()
    d, mo, y = m.groups()
    return f'{y}-{int(mo):02d}-{int(d):02d}'

_OUTLET_NORMALIZE = {
    'handelsblatt.com': 'Handelsblatt',
    'handelsblatt': 'Handelsblatt',
    'faz.net': 'FAZ',
    'frankfurter allgemeine zeitung': 'FAZ',
    'wiwo.de': 'WirtschaftsWoche',
    'welt.de': 'Die Welt',
    'zeit.de': 'DIE ZEIT',
}

def _src(outlet, title, date):
    o = outlet.strip()
    norm = _OUTLET_NORMALIZE.get(o.lower(), o)
    return {
        'outlet': norm,
        'outletDisplay': o,
        'date': _de_date(date),
        'title': title.strip().strip('„".,'),
    }

def parse_s1(text):
    items = []
    for line in re.findall(r'^- \*\*(.+)$', text, re.M):
        # **{lead} ({role})** *{text}*. (Source: „{title}", {outlet}, {date}).
        m = re.match(r'(.+?)\*\*\s*\*(.+?)\*\.\s*\(Source:\s*„?(.+?)["”"]?,\s*([^,]+?),\s*([\d.]+)\)\.', line)
        if not m:
            # softer match
            m = re.match(r'(.+?)\*\*\s*\*(.+?)\*\.?\s*\(Source:\s*(.+?),\s*([^,]+),\s*([\d.]+)\)', line)
            if not m: continue
        head, body, title, outlet, date = m.groups()
        items.append({
            'lead': head.strip(),
            'text': body.strip(),
            'source': _src(outlet, title, date),
            'kind': 'quote',
        })
    return items

def parse_s2(text):
    items = []
    for line in re.findall(r'^- \*\*(.+)$', text, re.M):
        # **{lead}**: {text} (Source: „{title}", {outlet}, {date}).
        m = re.match(r'(.+?)\*\*:\s*(.+?)\s*\(Source:\s*„?(.+?)["”"]?,\s*([^,]+?),\s*([\d.]+)\)\.', line)
        if not m: continue
        lead, body, title, outlet, date = m.groups()
        items.append({
            'lead': lead.strip(),
            'text': body.strip(),
            'source': _src(outlet, title, date),
            'kind': 'fact',
        })
    return items

def parse_s3(text):
    items = []
    for line in re.findall(r'^- \*\*(.+)$', text, re.M):
        # **{title}**: {text} Prominente Quellen: „{t1}", {o1}, {d1}; ...
        m = re.match(r'(.+?)\*\*:\s*(.+?)\s*Prominente Quellen:\s*(.+)', line)
        if not m: continue
        title, body, sources_blob = m.groups()
        sources = []
        for sm in re.finditer(r'„(.+?)["”"]?,\s*([^,;]+?),\s*([\d.]+)\.?', sources_blob):
            t, o, d = sm.groups()
            sources.append(_src(o, t, d))
        items.append({
            'title': title.strip(),
            'text': body.strip(),
            'sources': sources,
            'kind': 'theme',
        })
    return items

s1 = open(f'{VAULT}/.w25_2026_ger_s1.md', encoding='utf-8').read()
s2 = open(f'{VAULT}/.w25_2026_ger_s2.md', encoding='utf-8').read()
s3 = open(f'{VAULT}/.w25_2026_ger_s3.md', encoding='utf-8').read()

quotes = parse_s1(s1)
facts = parse_s2(s2)
themes = parse_s3(s3)
print(f'parsed: quotes={len(quotes)} facts={len(facts)} themes={len(themes)}')

payload = {
    'label': 'Wochenbericht: CN-Beziehungen durch die DE-Medien-Brille',
    'caveat': 'Aus Factiva CN GER News (deutsche Leitmedien) – Coverage 13.–19.06.2026.',
    'sections': [
        {'slug': 'quotes', 'short': 'Zitate',
         'label': '1. Prominente Zitate und Positionen zu China-bezogenen Angelegenheiten',
         'items': quotes},
        {'slug': 'facts', 'short': 'Fakten',
         'label': '2. Wichtige China-bezogene Entwicklungen in Fakten und Zahlen',
         'items': facts},
        {'slug': 'themes', 'short': 'Themen',
         'label': '3. Fünf zentrale Themen in der deutschen China-Politik Diskussion',
         'items': themes},
    ],
}

out = 'data/W25-2026-wochenbericht.js'
js = ('// W25-2026 — Wochenbericht (German media review)\n'
      '// Generated deterministically from GER side files (s1/s2/s3.md)\n'
      'window.W25_2026_WOCHENBERICHT = ' + json.dumps(payload, ensure_ascii=False, indent=2) + ';\n')
open(out, 'w', encoding='utf-8').write(js)
print(f'wrote {out} ({os.path.getsize(out)} bytes)')
