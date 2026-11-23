// Regression snapshot for the built site (deterministic).
// 1. Load build/index.html fresh.  2. Evaluate this file.  3. await snapInstall()  (takes over the clock)
// 4. await snapPage('<page id>') for each page (or snapAll()); results are JSON-able:
//    {page: {section: {t: textHash, n: textLength, c: [canvasPixelHash, ...]}}}
// The script replaces requestAnimationFrame, performance.now and Math.random, then steps a fixed number
// of frames per section, so animated canvases are comparable too. Compare with tools/snapdiff.py.
// Run it twice on the same build first: canvases that differ between those two runs are not deterministic
// (they depend on what ran before the takeover) and are listed in tools/snapshot_ignore.json.
(function () {
  const fnv = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
  const pix = (c) => { try { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let h = 0x811c9dc5; for (let i = 0; i < d.length; i += 12) { h ^= d[i]; h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); } catch (e) { return 'err'; } };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let Q = [], T = 0, seed = 1, early = false;
  function step(n) { for (let i = 0; i < n; i++) { T += 1000 / 60; const cbs = Q; Q = []; cbs.forEach((cb) => { try { cb(T); } catch (e) { console.error(e); } }); } }
  // Called from <head> of index.snap.html (see snapprep.py), before any page script: fully deterministic.
  window.snapEarly = function () {
    early = true; T = 1000;
    window.requestAnimationFrame = (cb) => { Q.push(cb); return Q.length; };
    performance.now = () => T;
    Math.random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  };
  window.snapInstall = async function () {
    if (early) { step(5); return; }
    T = performance.now() + 1000;
    window.requestAnimationFrame = (cb) => { Q.push(cb); return Q.length; };
    performance.now = () => T;
    Math.random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    await wait(2500);              // let every page loop move from the real rAF to ours
    seed = 1; step(5);
  };
  async function grab(root) {
    step(20);                      // a third of a second of animation, always the same
    const text = root.innerText.replace(/\s+/g, ' ').trim();
    const cs = [...root.querySelectorAll('canvas')].filter((c) => c.offsetParent), hs = [];
    for (const c of cs) { c.scrollIntoView({ block: 'center' }); step(3); hs.push(pix(c)); }   // some pages only draw on-screen canvases
    return { t: fnv(text), n: text.length, c: hs, x: text };
  }
  async function go(h) { location.hash = '#' + h; await wait(30); }
  window.snapPage = async function (pid) {
    await go(pid);
    const page = document.getElementById('page-' + pid), out = {};
    const links = [...page.querySelectorAll('.cl-menu[id] a[href^="#"]')].map((a) => a.getAttribute('href').slice(1)).filter((id) => document.getElementById(id));
    if (!links.length) { out._all = await grab(page.querySelector('main')); return out; }
    for (const id of links) { await go(id); out[id] = await grab(page.querySelector('main')); }
    return out;
  };
  window.snapPages = () => [...document.querySelectorAll('.page')].map((p) => p.id.slice(5));
  window.snapAll = async function () { const r = {}; for (const p of snapPages()) r[p] = await snapPage(p); return r; };
  // Run in the background and keep the result in localStorage (same origin for every build served by the dev server).
  // Where do two stored texts of a section differ? -> {at, a, b} (60 chars of context each)
  window.snapText = function (ka, kb, page, sec) {
    const a = snapGet(ka)[page][sec].x || '', b = snapGet(kb)[page][sec].x || '';
    let i = 0; while (i < a.length && a[i] === b[i]) i++;
    return { at: i, a: a.slice(Math.max(0, i - 60), i + 120), b: b.slice(Math.max(0, i - 60), i + 120) };
  };
  // Step two same-origin iframes identically and find the box of differing pixels in a canvas.
  window.snapStep = (n) => step(n);
  window.snapRun = function (key) {
    localStorage.removeItem('snap:' + key);
    (async () => { await snapInstall(); localStorage.setItem('snap:' + key, JSON.stringify(await snapAll())); })();
    return 'started ' + key;
  };
  // Same as snapRun, but every page is captured in a freshly loaded copy (iframe), so pages can't influence each other.
  window.snapRunIsolated = function (key) {
    localStorage.removeItem('snap:' + key);
    const url = location.pathname + '?iso=' + Date.now();
    (async () => {
      const r = {};
      for (const p of snapPages()) {
        const f = document.createElement('iframe');
        f.style.cssText = 'position:fixed;left:0;top:0;width:1200px;height:900px;opacity:0;pointer-events:none';
        document.body.appendChild(f); f.src = url + '#' + p; await new Promise((res) => (f.onload = res));
        await f.contentWindow.snapInstall(); r[p] = await f.contentWindow.snapPage(p); f.remove();
      }
      localStorage.setItem('snap:' + key, JSON.stringify(r));
    })();
    return 'started ' + key;
  };
  window.snapGet = (key) => JSON.parse(localStorage.getItem('snap:' + key) || 'null');
  // Differences between two stored runs. ignore: list of "page/section#i" to skip.
  window.snapDiff = function (ka, kb, ignore = []) {
    const a = snapGet(ka), b = snapGet(kb), out = [];
    if (!a || !b) return 'missing run: ' + (!a ? ka : kb);
    for (const p of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const A = a[p] || {}, B = b[p] || {};
      for (const s of new Set([...Object.keys(A), ...Object.keys(B)])) {
        const x = A[s], y = B[s];
        if (!x || !y) { out.push(`${p}/${s}: section ${x ? 'removed' : 'added'}`); continue; }
        if (x.t !== y.t) out.push(`${p}/${s}: text (${x.n} -> ${y.n} chars)`);
        if (x.c.length !== y.c.length) { out.push(`${p}/${s}: canvases ${x.c.length} -> ${y.c.length}`); continue; }
        x.c.forEach((h, i) => { if (h !== y.c[i] && !ignore.includes(`${p}/${s}#${i}`)) out.push(`${p}/${s}#${i}`); });
      }
    }
    return out;
  };
})();
