"""Assembles the single-page site (build/index.html, build/js/*.js, build/css/style.css) from site.py + pages/."""
import glob, importlib.util, json, os, re
from paths import SITE
import components

JS_SHARED = {'@helpers': 'shared/js/helpers.js', '@helpers2': 'shared/js/helpers2.js'}
CSS_FILES = ['shared/css/tokens.css', 'shared/css/base.css', 'shared/css/layout.css', 'shared/css/components.css', 'shared/css/probe.css']
# + every pages/**/page.css (CSS used by one page only)


def rd(p): return open(p).read()


def load_module(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    return mod


# ---------------------------------------------------------------- pieces of a page

def hero(p):
    h = p['hero']
    facts = ''.join(f'<span>{x}</span>' for x in h['facts'])
    svg = rd(f'pages/{p["dir"]}/hero.svg').rstrip('\n')
    return f'''<div class="hero"><div class="hero-inner">
  <div><span class="eyebrow">{h["eyebrow"]}</span><h1>{h["title"]}</h1><p class="tag">{h["tag"]}</p><div class="facts">{facts}</div></div>
  <div class="illus">{svg}</div></div></div>'''


def pager(pages, i):
    if i == 0:
        return ''
    prev, nxt = pages[i - 1], pages[i + 1] if i + 1 < len(pages) else None
    h = f'<a href="#{prev["id"]}"><small>← Previous</small>{prev["name"]}</a>'
    h += f'<a class="next" href="#{nxt["id"]}"><small>Next →</small>{nxt["name"]}</a>' if nxt else '<a class="next" href="#home"><small>Back to</small>Home</a>'
    return f'<div class="pager">{h}</div>'


def types_section(p):
    """The 'types of X you'll meet' cards of a component page (pages/components/<c>/types.py)."""
    f = f'pages/{p["dir"]}/types.py'
    if not os.path.exists(f):
        return ''
    cards = ''
    for title, svg, look, pros, cons, use in load_module(f, 'types_' + p['id']).TYPES:
        cards += f'''<div class="tcard"><div class="tart">{svg}</div><h3>{title}</h3><p class="tlook">{look}</p><ul class="tpc">{''.join(f'<li class="p">✓ {x}</li>' for x in pros)}{''.join(f'<li class="c">✗ {x}</li>' for x in cons)}</ul><p class="tuse"><b>Use for:</b> {use}</p></div>'''
    return f'''<section>
  <h2><span class="num">#</span>The types of {p["types"]} you'll meet</h2>
  <p>Same job, different builds. Here's how to <b>recognise</b> each one, and its pros and cons.</p>
  <div class="tcards">{cards}</div>
</section>
'''


def group_menu(pages, p):
    items = ''.join(f'<a href="#{q["id"]}" data-cl="{q["id"]}" class="{"active" if q is p else ""}"><span class="n">{q["icon"]}</span>{q["name"]}</a>'
                    for q in pages if q.get('group') == p['group'])
    return f'<aside class="cl-menu"><h4>{p["group"].capitalize()}</h4>{items}</aside>'


def palette_js():
    """const PAL={bg:'#0b1120',ink2:'#cbd5e1',...}: the colour tokens of shared/css/tokens.css, for canvas code."""
    css = rd('shared/css/tokens.css')
    pairs = re.findall(r'--([\w-]+):\s*(#[0-9a-fA-F]{3,6})', css)
    key = lambda n: re.sub(r'-(\w)', lambda m: m.group(1).upper(), n)
    return 'const PAL={' + ','.join(f"{key(n)}:'{v}'" for n, v in pairs) + '};\n'


def page_js(p):
    files = [JS_SHARED.get(f, f'pages/{p["dir"]}/{f}') for f in p['js']]
    if not files:
        return None
    js = palette_js() + rd('shared/js/core.js') + '\n' + '\n'.join(rd(f) for f in files)
    return f'''
// ================= {p["id"]} =================
(function(){{
const PG=document.getElementById('page-{p["id"]}');
{rd('shared/js/probe_prelude.js')}
const requestAnimationFrame=cb=>window.requestAnimationFrame(function tick(t){{if(PG.hidden)window.requestAnimationFrame(tick);else cb(t);}});
{js}
}})();
'''


# ---------------------------------------------------------------- the whole site

def build_site(site):
    pages, links = site.PAGES, getattr(site, 'LINKS', {})
    pages_html, files = '', {}
    for i, p in enumerate(pages):
        ctx = {'page': p['id'], 'site': pages, 'links': links}
        main = components.expand(rd(f'pages/{p["dir"]}/page.html'), ctx)
        if p.get('group'):
            k = main.rfind('<section')
            main = main[:k] + types_section(p) + main[k:]
        main = components.number_sections(main)
        main = components.section_menu(p['id'], main)
        if p.get('group'):
            main = f'<div class="cl-layout">{group_menu(pages, p)}<div class="cl-content">{main}</div></div>'
        wide = ' wide' if 'class="cl-layout"' in main else ''      # pages with a left menu get a wider column
        pages_html += f'\n<div class="page{wide}" id="page-{p["id"]}" style="--accent:{p["accent"]}" hidden>\n{hero(p)}\n<main>\n{main}\n{pager(pages, i)}\n</main>\n</div>\n'
        js = page_js(p)
        if js:
            files[p['id']] = js

    # top bar: one link per group (to its first page) + every page that has no group
    nav, seen = '', set()
    for p in pages[1:]:
        g = p.get('group')
        if g and g not in seen:
            seen.add(g); nav += f'<a href="#{p["id"]}" data-nav="{g}">{g.capitalize()}</a>'
        elif not g:
            nav += f'<a href="#{p["id"]}" data-nav="{p["id"]}">{p["name"]}</a>'
    grouped = [p['id'] for p in pages if p.get('group')]
    router = rd('shared/js/router.js').replace('__PAGES__', json.dumps([p['id'] for p in pages])).replace('__GROUP__', json.dumps(grouped))

    os.makedirs(SITE + 'js', exist_ok=True); os.makedirs(SITE + 'css', exist_ok=True)
    for n, js in files.items():
        open(SITE + f'js/{n}.js', 'w').write(js)
    open(SITE + 'js/app.js', 'w').write(router)
    open(SITE + 'js/probe.js', 'w').write(rd('shared/js/probe.js'))
    page_css = sorted(glob.glob('pages/**/page.css', recursive=True))
    open(SITE + 'css/style.css', 'w').write('\n'.join(rd(f) for f in CSS_FILES + page_css))
    tags = ''.join(f'<script src="js/{n}.js"></script>\n' for n in files) + '<script src="js/app.js"></script>\n<script src="js/probe.js"></script>'
    html = rd('shared/index.html').replace('{{nav}}', nav).replace('{{pages}}', pages_html).replace('{{scripts}}', tags)
    open(SITE + 'index.html', 'w').write(html)
    return len(html)
