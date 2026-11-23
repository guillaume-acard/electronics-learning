# Electronics Learning site

Interactive, dark-theme lessons for Guillaume, who is learning electronics (builds a Ruby guitar amp).
The site is generated: edit sources in `src/`, then run `python src/build.py` (it must end with `checks: OK`).
It writes the site to `build/` (`index.html`, `shopping.html`, `css/`, `js/`). Pages are listed in `src/sitemap.py`;
each page lives in `src/pages/<page>/` (circuit projects and chips: one data file each).
Read `src/README.md` first. Never hand-edit anything in `build/`.
Use the shared pieces instead of copying: colours from `shared/css/tokens.css` (`PAL.x` in canvas code),
`<x-…>` components, `loop()` / `hold()` / `sectionMenu()` from `shared/js/core.js`.

Style of the content:
- Site text in English; Guillaume often writes in French: answer him in French.
- Simple explanations, water analogies, animations, "why is it needed" for each part, follow-up questions added to the pages.
- Circuits: breadboard layout + numbered wiring steps + variants; parts from gotronic.fr (shopping list in `src/pages/shopping/items.py`).
- Minimum quantities: one circuit is built at a time.
After a change, open `build/index.html` in a browser and check the browser console for errors.
