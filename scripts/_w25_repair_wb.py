"""Repair malformed wochenbericht JSON (unescaped inner quotes), emit JS."""
import json, sys, os
RAW = open('data/.wochenbericht_debug.txt', 'r', encoding='utf-8').read()

def repair(s):
    out, in_str, escaped, i = [], False, False, 0
    while i < len(s):
        c = s[i]
        if escaped:
            out.append(c); escaped = False; i += 1; continue
        if c == "\\":
            out.append(c); escaped = True; i += 1; continue
        if c == '"':
            if not in_str:
                in_str = True
                out.append(c); i += 1; continue
            # Look further: real closing quote is followed by `,` then a
            # JSON property `"\w+":` OR by `}`/`]`/`:`/EOF. An inner quote
            # is followed by ` wenn`, `, dass`, etc. (lowercase/text).
            j = i + 1
            while j < len(s) and s[j] in " \t\n\r":
                j += 1
            tail = s[j:j+30]
            import re as _re
            real_close = (
                j >= len(s)
                or s[j] in ":}]"
                or (s[j] == "," and _re.match(r'\s*"[A-Za-z_]\w*"\s*:', s[j+1:]))
                or (s[j] == "," and _re.match(r'\s*\{', s[j+1:]))
                or _re.match(r'\}', tail)
            )
            if real_close:
                in_str = False
                out.append(c); i += 1; continue
            out.append('\\"'); i += 1; continue
        out.append(c); i += 1
    return "".join(out)

fixed = repair(RAW)
try:
    data = json.loads(fixed)
except Exception as e:
    print(f"STILL BROKEN: {e}")
    open('data/.wb_after_repair.txt','w',encoding='utf-8').write(fixed)
    sys.exit(1)

print(f"PARSED: quotes={len(data.get('quotes',[]))} facts={len(data.get('facts',[]))} themes={len(data.get('themes',[]))}")
js = ("// W25-2026 wochenbericht — repaired from claude output\n"
      "window.W25_2026_WOCHENBERICHT = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n")
out = 'data/W25-2026-wochenbericht.js'
open(out, 'w', encoding='utf-8').write(js)
print(f"wrote {out} ({os.path.getsize(out)} bytes)")
