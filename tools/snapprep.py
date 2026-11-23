"""Write index.snap.html next to a built index.html: the same page, but tools/snapshot.js takes over the clock
(requestAnimationFrame, performance.now, Math.random) BEFORE any page script runs, so every load is identical.
Usage: python tools/snapprep.py build .snapbase/build      then open http://localhost:8765/build/index.snap.html"""
import sys

for d in sys.argv[1:] or ['build']:
    s = open(f'{d}/index.html', encoding='utf-8').read()
    s = s.replace('<head>', '<head>\n<script src="/tools/snapshot.js"></script><script>snapEarly()</script>', 1)
    open(f'{d}/index.snap.html', 'w', encoding='utf-8', newline='\n').write(s)
    print('wrote', f'{d}/index.snap.html')
