"""UI components used in page.html files, written once here.

In a page, write a tag such as  <x-cards pages="chips circuits"/>  or  <x-tag a="1">inner html</x-tag>.
The build replaces it with the HTML returned by the function registered for that tag name.
Inner tags are expanded first, so components can be nested.
"""
import html, re

TAGS = {}


def tag(name):
    """Register a component: the function receives (attrs: dict, inner: str, ctx: dict) and returns HTML."""
    def deco(fn):
        TAGS[name] = fn
        return fn
    return deco


_ATTR = re.compile(r'([\w-]+)="([^"]*)"')
_SELF = re.compile(r'<x-([\w-]+)((?:\s+[\w-]+="[^"]*")*)\s*/>')
_PAIR = re.compile(r'<x-([\w-]+)((?:\s+[\w-]+="[^"]*")*)\s*>((?:(?!<x-).)*?)</x-\1>', re.S)   # innermost first


def expand(html, ctx):
    def run(m, inner=''):
        name = m.group(1)
        if name not in TAGS:
            raise ValueError(f'unknown component <x-{name}> in {ctx.get("page", "?")}')
        return TAGS[name](dict(_ATTR.findall(m.group(2))), inner, ctx)
    while True:
        new = _SELF.sub(lambda m: run(m), html)
        new = _PAIR.sub(lambda m: run(m, m.group(3)), new)
        if new == html:
            break
        html = new
    left = re.search(r'<x-[\w-]+', html)
    if left:
        raise ValueError(f'could not expand {left.group(0)} in {ctx.get("page", "?")} (unclosed tag?)')
    return html


# ---------------------------------------------------------------- controls

@tag('slider')
def _slider(a, inner, ctx):
    """<x-slider id="v" min="0" max="9" step="0.1" value="5" grow="1">Label</x-slider>: a labelled range slider.
    grow="1": the slider takes the remaining width of its controls bar."""
    attrs = ''.join(f' {k}="{a[k]}"' for k in ('id', 'min', 'max', 'step', 'value') if k in a)
    attrs = attrs.replace(' min=', ' type="range" min=', 1) if ' min=' in attrs else attrs + ' type="range"'
    return f'<label class="slider{" grow" if a.get("grow") else ""}">{inner}<input{attrs}></label>'


# ---------------------------------------------------------------- microchips

@tag('chip-widgets')
def _chip_widgets(a, inner, ctx):
    """<x-chip-widgets chip="555" name="NE555"/>: the minimal circuit + the interactive pinout of a chip
    (drawn by pages/chips/chipmin.js and chipx.js from their data)."""
    return f'''
  <h3 class="cx-h">🔌 Minimal circuit: every leg connected</h3>
  <p class="hint">The chip as it really sits (seen from above, notch at the top): each leg goes straight out to what it connects to. Hover a leg or a table row to highlight it.</p>
  <div class="chmin" data-chip="{a["chip"]}"></div>
  <h3 class="cx-h">📌 {a["name"]} pinout and what each pin does</h3>
  <p class="hint">Tap or hover a pin (on the chip, in the schematic or in the table) to see what it does and how to wire it. Colours: red = power, grey = ground, blue = input, green = output, amber = control.</p>
  <div class="chipx" data-chip="{a["chip"]}"></div>'''


# ---------------------------------------------------------------- page structure (called by render.py)

def number_sections(page_html):
    """<span class="num">#</span> -> 1, 2, 3... in page order (other numbers, like circuit numbers, stay)."""
    n = [0]
    def f(m):
        n[0] += 1
        return f'<span class="num">{n[0]}</span>'
    return re.sub(r'<span class="num">#</span>', f, page_html)


def section_menu(page_id, page_html):
    """If sections carry data-menu="Label" (+ data-icon, data-group, data-short), wrap the page in the
    left-menu layout. The menu (id "<page>-menu") is driven by sectionMenu() in shared/js/core.js."""
    items = re.findall(r'<section id="([\w-]+)"([^>]*\bdata-menu="[^"]*"[^>]*)>', page_html)
    if not items:
        return page_html
    menu = ''
    for sid, attrs in items:
        a = dict(re.findall(r'data-([\w-]+)="([^"]*)"', attrs))
        if 'group' in a:
            short = f' data-short="{a["short"]}"' if a.get('short') else ''
            menu += f'<h4{short}>{a["group"]}</h4>'
        menu += f'<a href="#{sid}"><span class="n">{a.get("icon", "")}</span>{a["menu"]}</a>'
    return (f'<div class="cl-layout"><aside class="cl-menu" id="{page_id}-menu">{menu}</aside>'
            f'<div class="cl-content">{page_html}</div></div>')


# ---------------------------------------------------------------- home page

def card_html(pid, c):
    """One home-page card (a.comp). c: svg, title, text, analogy?, accent?, href?, open?"""
    href = f' href="{c["href"]}"' if c.get('href') else f' data-page="{pid}"'
    style = f' style="--accent:{c["accent"]}"' if c.get('accent') else ''
    analogy = f'<p class="analogy">{c["analogy"]}</p>' if c.get('analogy') else ''
    return (f'<a class="comp"{href}{style}>{c["svg"]}<div><h3>{c["title"]}</h3><p>{c["text"]}</p>{analogy}'
            f'<span class="open">{c.get("open", "Open →")}</span></div></a>')


@tag('cards')
def _cards(a, inner, ctx):
    """<x-cards pages="@components formulas sensors"/>: a grid of home cards, from site.py."""
    ids = []
    for w in a['pages'].split():
        ids += [p['id'] for p in ctx['site'] if p.get('group') == w[1:]] if w.startswith('@') else [w]
    cards = {p['id']: p['card'] for p in ctx['site'] if 'card' in p}
    cards.update(ctx['links'])
    return '<div class="comp-grid">' + ''.join(card_html(i, cards[i]) for i in ids) + '</div>'


@tag('suggested-order')
def _order(a, inner, ctx):
    """The reading order, from the page order in site.py (pages with step=None are skipped)."""
    return ' → '.join(html.escape(p.get('step', p['name'].lower())) for p in ctx['site'][1:] if p.get('step', '') is not None)
