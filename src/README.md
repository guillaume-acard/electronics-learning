# Electronics Learning – sources

The site in `../build/` (`index.html`, `shopping.html`, `css/`, `js/`) is **generated** from this folder.
Edit here, then run one command (Python 3, no extra packages):

```
python src/build.py
```

It builds the site and the shop, then runs the checks (broken links, duplicate ids, unbalanced tags, missing
files, shop list vs parts lists). Open `../build/index.html` in a browser (works offline). Never edit `../build/`.

## Where things are (same shape as the site)

```
src/
  build.py              one command: site + shop + checks
  sitemap.py            THE list of pages: order, top bar, Components menu, heroes, home cards, scripts
  lib/                  the build: render.py (assembles pages), components.py (<x-…> tags), checks.py, svg.py, paths.py
  shared/
    index.html          the page skeleton (top bar, scripts)
    css/                tokens.css (every colour), base.css, layout.css, components.css, probe.css
    js/                 core.js (loop, hold, heroSwap, sectionMenu), helpers.js + helpers2.js (canvas drawing),
                        router.js, probe_prelude.js + probe.js (click-a-wire probe)
  pages/
    home/                       page.html, hero.svg
    components/<name>/          page.html, page.js, hero.svg, types.py ("types you'll meet" cards)
    formulas/ sensors/ parts/ quiz/   page.html, page.js, hero.svg (+ page.css)
    chips/                      page.html (intro + the list of chips), lib.js, widgets.js, page.css
      chips/<id>.html, <id>.js  one pair per chip
    circuits/                   page.html (intro), page.py (the project template), themes.py (menu order), lib.js, init.js
      projects/<id>.py, <id>.js one pair per project: content data / breadboard layout + demo
    shopping/                   items.py (the Gotronic list), shop.py (renders shopping.html), page.css
  legacy.zip            old one-time scripts and stale copies (history only, nothing uses it)
```

Every page's scripts are bundled into `build/js/<page>.js`: the palette `PAL`, `core.js`, then the files listed
under `js` in `sitemap.py` (`@helpers`/`@helpers2` = shared drawing helpers; globs like `chips/*.js` allowed).

## Common changes

**Change a text** – edit the page's `page.html` (or a project's `projects/<id>.py`, a chip's `chips/<id>.html`).

**Change a colour or the look** – `shared/css/tokens.css`. The same names reach the canvas code as `PAL.<name>`
(`--ink-2` → `PAL.ink2`). Shared UI styles are in `components.css` / `layout.css`; a page's own styles in its `page.css`.

**Section numbers and left menus** – write `<span class="num">#</span>` in an `<h2>`: the build numbers them.
Give sections `data-menu="Label" data-icon="★" data-group="Group title"` and the page gets a left menu
(one section shown at a time, previous/next links). Start the page script with `sectionMenu('<page>-menu')`.

**UI components** (defined once in `lib/components.py`, or in a page's `page.py`):

| Tag | What it gives |
|---|---|
| `<x-slider id min max step value grow="1">Label</x-slider>` | a labelled range slider |
| `<x-cards pages="@components formulas"/>` | home-page cards (data in `sitemap.py`) |
| `<x-suggested-order/>` | the reading order, from `sitemap.py` |
| `<x-include src="file.html"/>` | insert another file of the page |
| `<x-chip-widgets chip name/>` | a chip's minimal circuit + interactive pinout |
| `<x-circuits/>`, `<x-circuits-table/>` | all circuit projects / the themes table (circuits `page.py`) |

Utility classes instead of `style="…"`: `flush`, `mt-s`, `mt-m`, `mb0`, `center`, `big`, `amber`, `val`, `box`,
`hint sub`, `pre.code`, `select.fsel`, `button.go` / `button.stop`.

**Canvas demos** – in a page script: keep a state object, write `draw…(dt)`, and register it with
`loop((dt,now)=>{drawX(dt);})`. Buttons you hold: `hold('btnId',on=>{S.pressed=on;})`.
Drawing helpers: `txt`, `W`, `wire`, `part(ctx,'res'|'led'|'switch'|…)`, `gndSym`, `glowAt`, `lamp`,
`drawDigit(ctx,x,y,scale,DIGITS[n])`, `choices(id,labels,init,cb)`.

## Adding content

**A component page** – add an entry to `sitemap.py` (`group: 'components'`, icon, hero, home card, `js`), create
`pages/components/<id>/` with `page.html`, `page.js`, `hero.svg` and optionally `types.py`.

**A microchip** – create `pages/chips/chips/<id>.html` (its section, with `data-menu`, demo controls and
`<x-chip-widgets chip="<id>" name="…"/>`) and `pages/chips/chips/<id>.js`:
`CHIP('<id>',{pinout:{pkg,title,pins:[[n,name,type,what,how],…]}, inside:({ln,tx,bx,…})=>({vb,s}), minimal:{title,sub,rows}, art:dipArt(…)})`
followed by its demo in `(function(){ … loop(…); })();`. Add `<x-include src="chips/<id>.html"/>` to `page.html`.
Copy an existing chip (e.g. `339`) as a start.

**A circuit project** – copy `pages/circuits/projects/p26.py` and `p26.js` to `pNN.py` / `pNN.js`, edit the content,
the breadboard layout (`BBL.pNN`, see the breadboard map: rows a–j, rails tp/tn/bp/bn, columns 1–60) and the demo,
then add `'pNN'` to its theme in `themes.py`. The menu, the intro table and the numbering follow.

**A shop item** – a row in `pages/shopping/items.py`. The build warns when a project's "You need" names a part
whose "used in" doesn't list that project.

## Checking a change

- `python src/build.py` must end with `checks: OK`.
- Open the page in a browser and look at the console (F12): no errors.
- Bigger refactors: `tools/snapshot.js` captures every section's text and canvas pixels deterministically.
  `python tools/snapprep.py build` writes `build/index.snap.html`; open it from the dev server
  (`.claude/launch.json`, port 8765) and run `snapRunIsolated('name')` in the console, then
  `snapDiff('before','after')` to list what changed.
