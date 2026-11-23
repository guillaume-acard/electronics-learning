"""Compare two snapshots made with tools/snapshot.js.
Usage: python tools/snapdiff.py before.json after.json [ignore.json]
Prints every page/section whose text or canvases changed. ignore.json lists "page/section#index"
canvases known to be non-deterministic (found by comparing two runs of the same build)."""
import json, sys

a, b = (json.load(open(p, encoding='utf-8')) for p in sys.argv[1:3])
ignore = set(json.load(open(sys.argv[3], encoding='utf-8'))) if len(sys.argv) > 3 else set()
bad = []
for page in sorted(set(a) | set(b)):
    A, B = a.get(page, {}), b.get(page, {})
    for sec in sorted(set(A) | set(B)):
        x, y = A.get(sec), B.get(sec)
        if x is None or y is None:
            bad.append(f'{page}/{sec}: section {"added" if x is None else "removed"}'); continue
        if x['t'] != y['t']:
            bad.append(f'{page}/{sec}: text changed ({x["n"]} -> {y["n"]} chars)')
        if len(x['c']) != len(y['c']):
            bad.append(f'{page}/{sec}: canvas count {len(x["c"])} -> {len(y["c"])}'); continue
        for i, (p, q) in enumerate(zip(x['c'], y['c'])):
            if p != q and f'{page}/{sec}#{i}' not in ignore:
                bad.append(f'{page}/{sec}#{i}')
for line in bad: print(line)
print('OK: identical' if not bad else f'{len(bad)} difference(s)')
sys.exit(1 if bad else 0)
