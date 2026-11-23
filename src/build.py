"""Build the whole site:  python src/build.py
Writes build/index.html, build/js/*.js, build/css/style.css and build/shopping.html."""
import os, sys
sys.stdout.reconfigure(encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, 'lib'), os.path.join(HERE, 'pages', 'shopping'), HERE]
from paths import SITE          # also: works from src/, writes UTF-8 with LF line endings
import sitemap
import render, shop

import checks

size = render.build_site(sitemap)
total, total_opt, n = shop.build(SITE)
print(f'site: build/index.html ({size:,} bytes) · shop: {n} items, €{total} required, €{total_opt} with optional parts')
errors, warnings = checks.run(sitemap)
for w in warnings: print('warning:', w)
for e in errors: print('ERROR:', e)
if errors:
    sys.exit(f'{len(errors)} error(s): the site was written, but fix them (see above).')
print(f'checks: OK ({len(warnings)} warning(s))')
