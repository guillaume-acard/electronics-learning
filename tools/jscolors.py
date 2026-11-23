"""Replace hex colours in JS string literals by the palette (PAL.<name>, from shared/css/tokens.css).
Usage: python tools/jscolors.py file.js ...   (run from src/). Only string/template contents are touched:
  '#94a3b8'            -> PAL.muted
  `fill="#94a3b8"`     -> `fill="${PAL.muted}"`
  'a #94a3b8 b'        -> 'a '+PAL.muted+' b'
Comments and regex literals are skipped. Colours that are not tokens stay as they are."""
import re, sys

css = open('shared/css/tokens.css', encoding='utf-8').read()
HEX2KEY = {}
for name, hx in re.findall(r'--([\w-]+):\s*(#[0-9a-fA-F]{3,6})', css):
    key = re.sub(r'-(\w)', lambda m: m.group(1).upper(), name)
    if name in ('accent', 'control'): continue          # page-dependent / alias of --line
    HEX2KEY.setdefault(hx.lower(), key)
HEX = re.compile(r'#(?:[0-9a-fA-F]{6}|fff)(?![0-9a-fA-F])')

def convert(src):
    out, i, n = [], 0, len(src)
    prev_sig = ''                    # previous significant char in code (to tell regex from division)
    stack = []                       # template nesting: count of open braces inside ${...}
    count = 0
    def repl_template(text):
        nonlocal count
        def f(m):
            nonlocal count
            k = HEX2KEY.get(m.group(0).lower())
            if not k: return m.group(0)
            count += 1; return '${PAL.' + k + '}'
        return HEX.sub(f, text)
    while i < n:
        c = src[i]
        if c in '\'"':                                   # quoted string
            j = i + 1
            while src[j] != c:
                j += 2 if src[j] == '\\' else 1
            body = src[i + 1:j]
            k = HEX2KEY.get(body.lower()) if HEX.fullmatch(body) else None
            if k:
                out.append('PAL.' + k); count += 1
            elif HEX.search(body) and any(HEX2KEY.get(m.group(0).lower()) for m in HEX.finditer(body)):
                parts, last = [], 0
                for m in HEX.finditer(body):
                    kk = HEX2KEY.get(m.group(0).lower())
                    if not kk: continue
                    parts.append(c + body[last:m.start()] + c); parts.append('PAL.' + kk); last = m.end(); count += 1
                parts.append(c + body[last:] + c)
                out.append('(' + '+'.join(p for p in parts if p != c + c) + ')')
            else:
                out.append(src[i:j + 1])
            i = j + 1; prev_sig = 'a'; continue
        if c == '`' or (c == '}' and stack and stack[-1] == 0):
            # template text up to ` or ${
            if c == '}': stack.pop()
            j = i + 1; start = j
            while True:
                if src[j] == '\\': j += 2; continue
                if src[j] == '`': out.append(src[i] + repl_template(src[start:j]) + '`'); i = j + 1; prev_sig = 'a'; break
                if src.startswith('${', j): out.append(src[i] + repl_template(src[start:j]) + '${'); stack.append(0); i = j + 2; prev_sig = '('; break
                j += 1
            continue
        if c == '{' and stack: stack[-1] += 1
        if c == '}' and stack: stack[-1] -= 1
        if src.startswith('//', i):
            j = src.find('\n', i); j = n if j < 0 else j; out.append(src[i:j]); i = j; continue
        if src.startswith('/*', i):
            j = src.find('*/', i) + 2; out.append(src[i:j]); i = j; continue
        if c == '/' and (prev_sig in '(,=:[!&|?{};+-*%<>~^' or prev_sig == '' or src[max(0, i - 6):i].endswith('return')):
            j = i + 1; cls = False                       # regex literal
            while src[j] != '/' or cls:
                if src[j] == '\\': j += 2; continue
                if src[j] == '[': cls = True
                elif src[j] == ']': cls = False
                j += 1
            out.append(src[i:j + 1]); i = j + 1; prev_sig = 'a'; continue
        out.append(c)
        if not c.isspace(): prev_sig = c if not (c.isalnum() or c in '_$') else 'a'
        if c in ')]': prev_sig = ')'
        i += 1
    return ''.join(out), count

if __name__ == '__main__':
    total = 0
    for f in sys.argv[1:]:
        s = open(f, encoding='utf-8').read()
        new, k = convert(s)
        if k:
            open(f, 'w', encoding='utf-8', newline='\n').write(new)
        print(f'{f}: {k}'); total += k
    print('total', total)
