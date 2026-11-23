"""Checks run by build.py after building. Errors stop the build; warnings are printed.
- every #link and data-page in index.html points to an element that exists; ids are unique
- every page in sitemap.py has page.html and hero.svg
- every circuit project listed in themes.py has its data file and a breadboard layout
- every Gotronic code quoted in the pages is in the shopping list
- shop "used in" vs the projects whose "You need" list names the part (warning)"""
import glob, importlib.util, os, re
from paths import SITE


def _load(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m


VOID = {'br', 'img', 'input', 'meta', 'link', 'hr', 'source', 'wbr', 'col', 'area', 'base', 'embed', 'param', 'track'}


def unbalanced(text):
    """Tags opened and closed in the wrong order in a page source (e.g. a <label> closed by </x-slider>)."""
    from html.parser import HTMLParser
    class P(HTMLParser):
        def __init__(s): super().__init__(); s.st, s.err = [], []
        def handle_starttag(s, t, a):
            if t not in VOID: s.st.append((t, s.getpos()[0]))
        def handle_endtag(s, t):
            if t in VOID: return
            for i in range(len(s.st) - 1, -1, -1):
                if s.st[i][0] == t:
                    s.err += [f'<{x}> (line {n}) closed by </{t}>' for x, n in s.st[i + 1:]]; del s.st[i:]; return
            s.err.append(f'stray </{t}> at line {s.getpos()[0]}')
    p = P(); p.feed(text)
    return p.err


def run(sitemap):
    errors, warnings = [], []
    for f in sorted(glob.glob('pages/**/*.html', recursive=True)):
        for e in unbalanced(open(f, encoding='utf-8').read()):
            errors.append(f'{f}: {e}')
    html = open(SITE + 'index.html', encoding='utf-8').read()
    ids = re.findall(r'\bid="([^"]+)"', html)
    dup = sorted({i for i in ids if ids.count(i) > 1})
    if dup: errors.append('duplicate ids: ' + ', '.join(dup[:10]))
    idset = set(ids)
    for target in sorted(set(re.findall(r'href="#([\w-]+)"', html))):
        if target not in idset and f'page-{target}' not in idset: errors.append(f'link to #{target}: no such id')
    pages = {p['id'] for p in sitemap.PAGES}
    for target in sorted(set(re.findall(r'data-page="([\w-]+)"', html))):
        if target not in pages and target != 'hub': errors.append(f'data-page="{target}": no such page')
    for p in sitemap.PAGES:
        for f in ('page.html', 'hero.svg'):
            if not os.path.exists(f'pages/{p["dir"]}/{f}'): errors.append(f'pages/{p["dir"]}/{f} is missing')

    # circuits: data file + layout for each project in themes.py
    themes = _load('pages/circuits/themes.py', 'themes_chk').THEMES
    projects = {}
    for _, ids_ in themes:
        for pid in ids_:
            f = f'pages/circuits/projects/{pid}.py'
            if not os.path.exists(f): errors.append(f'{f} is missing (listed in themes.py)'); continue
            projects[pid] = _load(f, 'prj_' + pid)
            js = f'pages/circuits/projects/{pid}.js'
            if not (os.path.exists(js) and f'BBL.{pid}=' in open(js, encoding='utf-8').read()):
                errors.append(f'{js}: no breadboard layout (BBL.{pid}=...)')

    # shopping list
    items = _load('pages/shopping/items.py', 'items_chk').I
    codes = {it[2] for it in items}
    text = ''.join(open(f, encoding='utf-8').read() for f in glob.glob('pages/**/*.html', recursive=True) + glob.glob('pages/**/*.py', recursive=True)
                   if 'shopping' not in f)
    for code in sorted(set(re.findall(r'Gotronic(?: ref\.)? (\d{5})', text))):
        if code not in codes: errors.append(f'Gotronic {code} is quoted in the pages but not in the shopping list')

    def num(pid): return {'rl1': 'A', 'rl2': 'B'}.get(pid, pid[1:])
    def used_in(s):                                  # '1–8, 10, 13 (dice)' -> {'1','2',...,'8','10','13'}
        out = set()
        for a, b in re.findall(r'\b(\d+|[AB])\b(?:\s*–\s*(\d+))?', s):
            out |= {str(n) for n in range(int(a), int(b) + 1)} if b else {a}
        return out
    PART = {'02500': r'1N4007', '02524': r'1N4148', '02173': r'BC547', '43143': r'SS8050', '21210': r'(?<!except the )\b(?:NE)?555\b',
            '20277': r'4017', '21090': r'LM358', '21095': r'LM386', '20356': r'4511', '20363': r'4518', '21087': r'LM339',
            '03142': r'DC10G', '03099': r'SC39', '03417': r'TSOP', '03458': r'TSAL|IR LED', '05220': r'quartz', '20318': r'4060',
            '20273': r'4013', '24851': r'motor', '42327': r'L293D', '04953': r'1000 µF', '04741': r'4\.7 nF', '04044': r'4\.7 kΩ'}
    for name, code, *_rest in [(it[1], it[2], it[6]) for it in items]:
        if code not in PART: continue
        listed = used_in(_rest[0])
        for pid, m in projects.items():
            if re.search(PART[code], ' '.join(m.NEED)) and num(pid) not in listed:
                warnings.append(f'shop {code} ({name[:40]}): used in project {num(pid)} ("You need") but not in its "used in"')
    return errors, warnings
