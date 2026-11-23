# Shared setup for every build script: work from this folder, read/write UTF-8 (needed on Windows).
import os, builtins
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = HERE if os.path.basename(HERE) == 'src' else os.path.dirname(HERE)
PAGES = os.path.join(SRC, 'pages') + os.sep
SITE = os.path.join(os.path.dirname(SRC), 'build') + os.sep  # generated site (index.html, shopping.html, css/, js/)
os.makedirs(SITE, exist_ok=True)
os.chdir(SRC)
_open = builtins.open
def _utf8_open(file, mode='r', *a, **k):
    if 'b' not in mode and 'encoding' not in k and not (a and len(a) >= 2):
        k['encoding'] = 'utf-8'
        if any(c in mode for c in 'wa') and 'newline' not in k:
            k['newline'] = '\n'  # same LF output on every OS
    return _open(file, mode, *a, **k)
builtins.open = _utf8_open
