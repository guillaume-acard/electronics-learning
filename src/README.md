# Electronics Learning – sources

The site (`../build/index.html`, `../build/shopping.html`, `../build/css/`, `../build/js/`) is **generated** from the files in this folder.
Edit the sources here, then rebuild. Never edit anything in `../build/` by hand: the next build overwrites it.

Requires Python 3 (no extra packages). Works on Windows, macOS, Linux.

## Rebuild

```
python src/build_single.py     # → ../build/index.html, ../build/js/*.js, ../build/css/style.css
python src/build_shop.py       # → ../build/shopping.html (prints: required total, total with optional, item count)
```

Then open `../build/index.html` in a browser (double-click it in File Explorer; works offline). The output folder is set by `SITE` in `paths.py`.

## Where things are

| What | Files |
|---|---|
| Page bodies (HTML) | `<page>_body.html` for inductor, relay, motion (Sound & motion), sensors, formulas, chips, parts, circuits, quiz; `pages/*.html` for home, resistor, capacitor, diode, led, transistor (older pages, kept pre-built: edit their HTML directly) |
| Page scripts | `<page>.js` (+ `helpers.js`, `helpers2.js` shared drawing helpers) |
| Microchips page | `chips_body.html` (sections + left menu), `chips.js` (first demos), `chipx.js` (pinouts `CH`, inside schematics `IN`, hero art `CH_ART`), `chipmin.js` (minimal circuits `MIN`), `chipmore.js` (demos for LM339, CD4013, CD4060 + quartz, L293D). To add a chip: a section + menu link in the body, then an entry in `CH`, `IN`, `CH_ART` and `MIN` |
| Adding a component page | Body + script, then `COMP`, `COMP_ICONS`, `ORDER`, `NAMES` and the body-page list in `build_single.py`, a hero in `illus_extra.py`, type cards in `comptypes.py`, a card in `pages/index.html` |
| Circuits page | `circuits_body.html` (all sections + left menu), `circuits.js` (schematics, breadboard renderer `partOn`, layouts `BBL`), `more.js` (animated demos for p16+) |
| Hero illustrations | `illus.py`, `illus_extra.py` |
| Component "types" cards | `comptypes.py` |
| Circuit probe (click a wire) | `probe_prelude.js` (records drawings), `probe.js` (solver + panel) |
| Quiz | `quiz.js` (questions + engine), `quiz_more.js` (extra questions, already merged into quiz.js) |
| Shopping list | `build_shop.py` (list `I`: group, name, Gotronic code, price, qty, url, used in, note, optional) |
| Style | `style2.css.html` |

## Adding or changing a circuit

The newer circuits are produced by small generator scripts in `generators/` (p21, p22, p23–24, p25, p26).
Each one holds the circuit's breadboard layout, wiring steps, explanation and variants, and writes them into
`circuits_body.html`, `circuits.js` (layout `BBL.pNN`) and `more.js` (demo). They are safe to re-run.

- `secgen.py`: the HTML template of a circuit section (`SEC(...)`).
- `menugen.py`: the themed left menu + intro table. Edit `NM` (names) and `TH` (themes) there.
- Breadboard holes: rows `a–e` (top half), `f–j` (bottom half), rails `tp tn` (top + / −) and `bp bn` (bottom + / −), columns 1–60.
  Part types: `wire res led ecap ccap diode buz ldr btn chip seg7 bar npn pot batt pm box note cell sil xtal`.

To add circuit 27: copy `generators/build_p26.py`, change the id, layout, texts and the menu entry, run it, then `build_single.py`.

`legacy.zip` archives the one-time scripts that created the early pages (their output is already in the sources), plus `old_pages/`: the separate HTML pages of the old multi-page site, replaced by the single `index.html`. Kept for history only: don't extract and re-run them, they would overwrite later changes.

## Note

The claude.ai artifact (https://claude.ai/artifact/PMq2YkU4BVFW8M5MXWXPG6) only changes when it is republished from a Claude chat.
This folder is the main copy.
