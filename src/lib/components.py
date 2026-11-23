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
