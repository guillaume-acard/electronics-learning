import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lib'))
from paths import SRC, PAGES, SITE
import re
from illus import ILLUS, HERO
from illus_extra import EXTRA, HEXTRA
ILLUS.update(EXTRA);HERO.update(HEXTRA)
COMP=['resistor','capacitor','diode','led','transistor','inductor','relay','motion']
COMP_ICONS=[('resistor','Ω'),('capacitor','C'),('diode','D'),('led','💡'),('transistor','T'),('inductor','L'),('relay','K'),('motion','🔊')]
ORDER=['home','resistor','capacitor','diode','led','transistor','inductor','relay','motion','formulas','sensors','chips','parts','circuits','quiz']
NAMES={'home':'Home','resistor':'Resistor','capacitor':'Capacitor','diode':'Diode','led':'LED','transistor':'Transistor','inductor':'Inductor','relay':'Relay','motion':'Sound & motion','formulas':'Formulas','sensors':'Sensors','chips':'Microchips','parts':'Real parts','circuits':'Circuits','quiz':'Quiz'}

LOC={'home':'home','formulas':'formulas','sensors':'sensors','chips':'chips','parts':'parts','circuits':'circuits','quiz':'quiz'}
LOC.update({c:'components/'+c for c in COMP})
JS='shared/js/'
def rd(p): return open(p).read()
def parts(name):
    d='pages/'+LOC[name]+'/'
    main=rd(d+'page.html')
    if name=='chips':
        main=main[main.index('<main>')+6:main.index('</main>')]
        main=re.sub(r'<nav style="margin:4px 0 0">.*?</nav>\n?','',main,flags=re.S)
        js='\n'+'\n'.join(rd(f).rstrip('\n') for f in (JS+'helpers.js',d+'chips.js',d+'chipx.js',d+'chipmin.js',d+'chipmore.js'))+'\n\n'
        return main,[js]
    if name=='home': return main,[]
    if name=='capacitor': return main,[rd(d+'page.js')]
    if name in ('resistor','diode','led','transistor'): return main,['\n'+rd(JS+'helpers.js')+rd(d+'page.js')]
    return main,[rd(JS+'helpers.js'),rd(JS+'helpers2.js'),rd(d+'page.js')]+([rd(d+'demos.js')] if name=='circuits' else [])

css=open('shared/css/base.css').read()
css+='''
  .comp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
  .comp{display:flex;gap:14px;align-items:flex-start;border:1px solid var(--line);border-radius:12px;padding:16px;background:#101827;color:var(--ink);text-decoration:none;transition:.15s}
  a.comp:hover{border-color:#3b82f6;transform:translateY(-2px)}
  .comp svg{width:96px;flex-shrink:0;margin-top:8px;overflow:visible}
  .comp h3{margin:0 0 4px}.comp p{margin:0 0 6px;color:var(--muted);font-size:.95rem}
  .comp .analogy{color:#93c5fd}.comp .open{font-weight:700;color:#60a5fa}
  .soon .comp{opacity:.6}
  /* top bar */
  .topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:14px;padding:10px 18px;background:rgba(11,17,32,.85);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
  .topbar .brand{font-weight:800;color:#fff;text-decoration:none;white-space:nowrap;font-size:1.05rem}
  .topbar .links{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none}
  .topbar .links::-webkit-scrollbar{display:none}
  .topbar .links a{color:#94a3b8;text-decoration:none;font-weight:600;font-size:.92rem;padding:6px 12px;border-radius:99px;white-space:nowrap;transition:.15s}
  .topbar .links a:hover{color:#e2e8f0;background:#1e293b}
  .topbar .links a.active{color:#0b1120;background:var(--accent,#60a5fa)}
  /* hero */
  .hero{position:relative;overflow:hidden;padding:46px 22px 40px;border-bottom:1px solid var(--line);
    background:radial-gradient(circle at 78% 30%, color-mix(in srgb,var(--accent) 35%, transparent), transparent 55%),
               radial-gradient(circle at 10% 110%, color-mix(in srgb,var(--accent) 18%, transparent), transparent 50%),
               linear-gradient(160deg,#0b1120 0%,#111a2e 60%,#0b1120 100%)}
  .hero::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(148,163,184,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.07) 1px,transparent 1px);background-size:28px 28px;mask-image:linear-gradient(to bottom,#000 30%,transparent);-webkit-mask-image:linear-gradient(to bottom,#000 30%,transparent)}
  .hero-inner{position:relative;max-width:900px;margin:0 auto;display:grid;grid-template-columns:1.25fr 1fr;gap:24px;align-items:center}
  .eyebrow{display:inline-block;text-transform:uppercase;letter-spacing:.14em;font-size:.75rem;font-weight:800;color:var(--accent);background:color-mix(in srgb,var(--accent) 14%, transparent);border:1px solid color-mix(in srgb,var(--accent) 40%, transparent);padding:4px 10px;border-radius:99px}
  .hero h1{font-size:clamp(2rem,5vw,3rem);margin:12px 0 8px;line-height:1.05;letter-spacing:-.02em;
    background:linear-gradient(90deg,#fff 30%,color-mix(in srgb,var(--accent) 70%, #fff));-webkit-background-clip:text;background-clip:text;color:transparent}
  .hero .tag{color:#cbd5e1;font-size:1.12rem;margin:0 0 16px;max-width:460px}
  .facts{display:flex;flex-wrap:wrap;gap:8px}
  .facts span{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:99px;padding:5px 12px;font-size:.85rem;color:#e2e8f0}
  .illus{text-align:center}
  .illus svg{width:100%;max-width:330px;filter:drop-shadow(0 18px 30px rgba(0,0,0,.55));animation:float 6s ease-in-out infinite}
  @keyframes float{50%{transform:translateY(-8px)}}
  @media(max-width:680px){.hero-inner{grid-template-columns:1fr}.illus{order:-1}.illus svg{max-width:230px}.hero{padding-top:26px}}
  @media(prefers-reduced-motion:reduce){.illus svg{animation:none}}
  .pager{display:flex;justify-content:space-between;gap:12px;margin:26px 0 0}
  .pager a{flex:1;border:1px solid var(--line);border-radius:12px;padding:14px 16px;text-decoration:none;color:var(--ink);background:#101827;transition:.15s}
  .pager a:hover{border-color:var(--accent,#3b82f6)}
  .pager small{display:block;color:var(--muted);font-size:.8rem}
  .pager .next{text-align:right}
  .page[hidden]{display:none}
  /* circuits page: left menu */
  #page-circuits main,#page-chips main,#page-sensors main,#page-formulas main,#page-resistor main,#page-capacitor main,#page-diode main,#page-led main,#page-transistor main,#page-inductor main,#page-relay main{max-width:1180px}
  .cl-layout{display:grid;grid-template-columns:230px minmax(0,1fr);gap:20px;align-items:start;margin-top:20px}
  .cl-menu{position:sticky;top:64px;max-height:calc(100vh - 80px);overflow:auto;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:8px 8px 12px}
  .cl-menu h4{margin:12px 8px 6px;font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:var(--muted)}
  .cl-menu a{display:flex;gap:9px;align-items:center;padding:7px 10px;border-radius:8px;color:#cbd5e1;text-decoration:none;font-size:.92rem;transition:.12s}
  .cl-menu a:hover{background:#1e293b;color:#fff}
  .cl-menu a.active{background:color-mix(in srgb,var(--accent) 22%,transparent);color:#fff;font-weight:700}
  .cl-menu .n{flex-shrink:0;min-width:24px;height:24px;border-radius:50%;background:#1e293b;text-align:center;font-size:.75rem;line-height:24px;font-weight:700}
  .cl-menu a.active .n{background:var(--accent);color:#0b1120}
  .cl-content>section:first-child,.cl-content>section{margin-top:0}
  .cl-content section[hidden]{display:none}
  .bbc{display:block;width:100%;max-width:800px;margin:0 auto;background:#0b1220}
  .bblive{position:sticky;top:56px;z-index:3;background:var(--card);padding:6px 0 8px;margin-bottom:6px}
  .bblive .bbc{max-width:620px}
  .bbcap{font-size:.85rem;color:var(--muted);text-align:center;margin-bottom:4px}
  @media(max-width:820px){.bblive{position:static}}
  .howbox{background:#101827;border-left:4px solid var(--accent);border-radius:8px;padding:4px 16px}
  .howbox p{margin:10px 0}
  .pnout{background:#101827;border-left:4px solid var(--accent);border-radius:8px;padding:10px 16px}.pnname{font:800 2rem ui-monospace,monospace;letter-spacing:.04em;margin:4px 0 6px}.pnname span{margin-right:4px;padding-bottom:2px}
  .cmfig{background:#0b1220;border:1px solid var(--line);border-radius:10px;padding:6px;overflow-x:auto}.cmfig svg{min-width:640px}
  .mrow{cursor:pointer}.mrow.sel>rect:first-child{fill:rgba(253,224,71,.10)}.mrow.sel line{stroke:#fde047}
  .cm-tab tr.sel td{background:#1e293b}
  #probePanel{position:fixed;right:16px;bottom:16px;width:390px;max-height:calc(100vh - 90px);overflow:auto;max-width:calc(100vw - 32px);z-index:60;background:#0f172a;border:1px solid #fde047;border-radius:12px;padding:10px 14px 8px;box-shadow:0 8px 30px rgba(0,0,0,.6);font-size:.9rem}
  #probePanel h4{margin:2px 0 8px;font-size:1rem;padding-right:24px}#probePanel table{margin:0 0 6px;font-size:.88rem}#probePanel td{padding:3px 6px}#probePanel td:first-child{width:52%;color:#94a3b8}
  #probePanel canvas{width:100%;height:auto;display:block;border-radius:6px;margin-top:6px}#probePanel .pbleg{font-size:.75rem;color:#94a3b8;margin:2px 0 6px}#probePanel .pbflow{display:block;font-size:.82rem;color:#cbd5e1;margin:4px 0}
  #probePanel .pclose{position:absolute;right:8px;top:6px;padding:2px 8px;background:transparent;color:#94a3b8}#probePanel .pn{color:#94a3b8;font-size:.8rem;margin:4px 0}#probePanel .pq{color:#f59e0b}#probePanel .pa{color:#fde047;font-size:.8rem}
  .fsel{font:inherit;padding:7px;border-radius:8px;background:#2a3650;color:#e2e8f0;border:1px solid #2a3650}
  .cx-h{margin-top:26px}
  .cx-grid{display:grid;grid-template-columns:minmax(0,0.8fr) minmax(0,1.2fr);gap:12px}
  @media(max-width:720px){.cx-grid{grid-template-columns:1fr}}
  .cx-grid figure{margin:0;background:#0b1220;border:1px solid var(--line);border-radius:10px;padding:8px}
  .cx-grid figcaption{font-weight:700;font-size:.92rem;color:var(--muted);margin:2px 4px 6px}
  .pinsvg{width:100%;height:auto;display:block}
  .pinsvg .pp{cursor:pointer}
  .pinsvg .pp.sel rect:first-child{stroke:#fff;stroke-width:3}
  .pinsvg .pp.sel text{fill:#fff !important}
  .pinsvg polyline.wp.sel{stroke:#fde047;stroke-width:3.5}
  .cx-leg{display:flex;flex-wrap:wrap;gap:14px;margin:10px 2px;font-size:.88rem;color:var(--muted)}
  .cx-leg i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:5px;vertical-align:-1px}
  .cx-det{background:#101827;border-left:4px solid var(--accent);border-radius:8px;padding:10px 14px;min-height:72px}
  .cx-how{color:#93c5fd}
  .cx-tw{overflow-x:auto;margin-top:10px}
  .cx-tab{font-size:.9rem}
  .cx-tab tr[data-pin]{cursor:pointer}
  .cx-tab tr.sel td{background:#1e293b}
  .cx-tab small{color:var(--muted)}
  .cx-tab td:first-child{width:44px}.cx-tab td:nth-child(2){width:90px}
  .wtitle{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .wprog{font-size:.85rem;font-weight:700;color:var(--muted);background:#1e293b;padding:2px 10px;border-radius:99px}
  .wprog.ok{color:#0b1120;background:#10b981}
  .wreset{font-size:.8rem;padding:4px 10px}
  .wsteps{list-style:none;counter-reset:ws;padding:0;margin:0}
  .wsteps li{counter-increment:ws;position:relative;margin:8px 0;padding:10px 12px 10px 52px;border:1px solid var(--line);border-radius:10px;background:#101827;transition:.15s}
  .wsteps li::before{content:counter(ws);position:absolute;left:12px;top:9px;width:28px;height:28px;border-radius:50%;background:#1e293b;color:#e2e8f0;font-weight:800;text-align:center;line-height:28px}
  .wsteps li.next{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}
  .wsteps li.next::before{background:var(--accent);color:#0b1120}
  .wsteps li.done{opacity:.55}.wsteps li.done span{text-decoration:line-through;text-decoration-color:#64748b}
  .wsteps li.done::before{content:"✓";background:#10b981;color:#0b1120}
  .wsteps label{display:flex;gap:10px;align-items:flex-start;cursor:pointer}
  .wsteps input{margin-top:5px;width:18px;height:18px;flex-shrink:0;accent-color:#10b981}
  @media(max-width:820px){.cl-layout{grid-template-columns:1fr}.cl-menu{position:sticky;top:50px;z-index:4;display:flex;overflow-x:auto;max-height:none;padding:6px;gap:4px;border-radius:10px}.cl-menu h4{display:none}.cl-menu a{white-space:nowrap;padding:6px 10px}}
  /* quiz */
  .qtop{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;align-items:center}
  .qmeta{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .qtype{background:color-mix(in srgb,var(--accent) 18%,transparent);color:var(--accent);border:1px solid color-mix(in srgb,var(--accent) 45%,transparent);padding:3px 10px;border-radius:99px;font-weight:700;font-size:.85rem}
  .qtopic{background:#1e293b;padding:3px 10px;border-radius:99px;font-size:.85rem}
  .qscore{color:var(--muted)} .qscore b{color:#fff;font-size:1.1rem}
  .qdots{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
  .qd{width:34px;height:34px;padding:0;border-radius:50%;font-size:.85rem}
  .qd.cur{outline:2px solid var(--accent);outline-offset:2px}
  .qd.ok{background:#065f46;color:#d1fae5}.qd.ko{background:#7f1d1d;color:#fee2e2}
  .qopts{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}
  .qopts button{text-align:left;padding:12px 14px;font-weight:600}
  .qopts button.right{background:#065f46;color:#d1fae5}.qopts button.wrong{background:#7f1d1d;color:#fee2e2}
  button:disabled{cursor:default;opacity:.85}
  .qfb{margin-top:14px;padding:14px 16px;border-radius:10px;line-height:1.6}
  .qfb.ok{background:#052e1f;border-left:5px solid #10b981}.qfb.ko{background:#2a1215;border-left:5px solid #ef4444}
  .qnav{display:flex;justify-content:space-between;gap:10px;margin-top:16px;flex-wrap:wrap}
'''

def hero(name):
    acc,eb,title,tag,facts=HERO[name]
    f=''.join(f'<span>{x}</span>' for x in facts)
    return f'''<div class="hero"><div class="hero-inner">
  <div><span class="eyebrow">{eb}</span><h1>{title}</h1><p class="tag">{tag}</p><div class="facts">{f}</div></div>
  <div class="illus">{ILLUS[name]}</div></div></div>'''

def pager(name):
    i=ORDER.index(name);h=''
    prev=ORDER[i-1] if i>0 else None;nxt=ORDER[i+1] if i<len(ORDER)-1 else None
    if name=='home': return ''
    h+=f'<a href="#{prev}"><small>← Previous</small>{NAMES[prev]}</a>' if prev else '<span></span>'
    h+=f'<a class="next" href="#{nxt}"><small>Next →</small>{NAMES[nxt]}</a>' if nxt else '<a class="next" href="#home"><small>Back to</small>Home</a>'
    return f'<div class="pager">{h}</div>'

pages_html='';scripts_js='';files={}
for n in ORDER:
    main,scripts=parts(n)
    if n=='home':
        main=main.replace('<section>\n  <h2>How to use these pages</h2>','''<section>
  <h2>🛍️ Shopping list</h2>
  <div class="comp-grid"><a class="comp" href="shopping.html"><svg viewBox="0 0 120 60"><path d="M20 12h12l10 30h50l8-22H38" stroke="#22c55e" stroke-width="4" fill="none"/><circle cx="48" cy="50" r="5" fill="#22c55e"/><circle cx="86" cy="50" r="5" fill="#22c55e"/></svg>
  <div><h3>Gotronic shopping list</h3><p>Every part for the "Circuits to build" projects and the real-life builds, with Gotronic codes, quantities, tick boxes and a live total.</p><span class="open">Open →</span></div></a></div>
</section>

<section>
  <h2>🛒 Using real parts</h2>
  <div class="comp-grid"><a class="comp" href="#parts"><svg viewBox="0 0 120 60"><rect x="38" y="4" width="44" height="52" rx="3" fill="#111"/><path d="M50 10h20M72 12v14M72 32v14M50 50h20M48 32v14M48 12v14M50 30h20" stroke="#ef4444" stroke-width="4"/></svg>
  <div><h3>From a shop page to a working circuit</h3><p>How to read a product page and datasheet, find the pinout, test the part, pick resistors and drive it. Worked example: the Kingbright SC39-11SURKWA 7-segment display.</p><span class="open">Open →</span></div></a></div>
</section>

<section>
  <h2>🏁 Test yourself</h2>
  <div class="comp-grid"><a class="comp" href="#quiz" style="--accent:#facc15"><svg viewBox="0 0 120 60"><circle cx="60" cy="30" r="24" fill="#facc15"/><text x="60" y="42" text-anchor="middle" font-size="32" font-weight="800" fill="#0b1120">?</text></svg>
  <div><h3>The Quiz</h3><p>31 interactive circuit challenges: pick the missing part, choose resistor and capacitor values, predict what happens, and build working circuits.</p><span class="open">Start the quiz →</span></div></a></div>
</section>

<section>
  <h2>How to use these pages</h2>''')
    acc=HERO[n][0]
    if n in COMP:
        import comptypes as _t, re as _re
        k=main.rfind('<section');main=main[:k]+_t.section(n)+main[k:]
        cnt=[0]
        def _rn(m):
            cnt[0]+=1;return f'<span class="num">{cnt[0]}</span>'
        main=_re.sub(r'<span class="num">\d+</span>',_rn,main)
        menu='<aside class="cl-menu"><h4>Components</h4>'+''.join(f'<a href="#{k}" data-cl="{k}" class="{"active" if k==n else ""}"><span class="n">{ic}</span>{NAMES[k]}</a>' for k,ic in COMP_ICONS)+'</aside>'
        main=f'<div class="cl-layout">{menu}<div class="cl-content">{main}</div></div>'
    pages_html+=f'\n<div class="page" id="page-{n}" style="--accent:{acc}" hidden>\n{hero(n)}\n<main>\n{main}\n{pager(n)}\n</main>\n</div>\n'
    if scripts:
        js='\n'.join(scripts)
        PRE=open(JS+'probe_prelude.js').read() if True else ''
        files[n]=f'''
// ================= {n} =================
(function(){{
const PG=document.getElementById('page-{n}');
{PRE}
const requestAnimationFrame=cb=>window.requestAnimationFrame(function tick(t){{if(PG.hidden)window.requestAnimationFrame(tick);else cb(t);}});
{js}
}})();
'''

nav='<a href="#resistor" data-nav="components">Components</a>'+''.join(f'<a href="#{n}" data-nav="{n}">{NAMES[n]}</a>' for n in ORDER[1:] if n not in COMP)
router='''
(function(){
const PAGES=%s;
document.querySelectorAll('a[data-page]').forEach(a=>{const p=a.dataset.page==='hub'?'home':a.dataset.page;a.href='#'+p;a.removeAttribute('target');});
function show(){let id=(location.hash||'#home').slice(1),target=null;
  if(!PAGES.includes(id)){target=document.getElementById(id);const pg=target&&target.closest('.page');id=pg?pg.id.slice(5):'home';}
  PAGES.forEach(p=>{document.getElementById('page-'+p).hidden=p!==id;});
  const acc=getComputedStyle(document.getElementById('page-'+id)).getPropertyValue('--accent');
  document.querySelector('.topbar').style.setProperty('--accent',acc);
  const grp=%s.includes(id)?'components':id;document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===grp));
  const act=document.querySelector('[data-nav].active');if(act)act.scrollIntoView({block:'nearest',inline:'center'});
  document.title=(id==='home'?'Electronics Learning':document.querySelector('#page-'+id+' h1').textContent+' · Electronics Learning');
  const ca=document.querySelector('#page-'+id+' .cl-menu:not([id]) a.active');if(ca&&window.innerWidth<820){const m=ca.parentElement;m.scrollLeft=ca.offsetLeft-m.clientWidth/2+ca.clientWidth/2;}
  if(target&&!(target.matches('.cl-content > section')))target.scrollIntoView();else window.scrollTo(0,0);}
window.addEventListener('hashchange',show);show();
})();
''' % (str(ORDER).replace("'",'"'),str(COMP).replace("'",'"'))

import os
D=SITE;os.makedirs(D+'js',exist_ok=True);os.makedirs(D+'css',exist_ok=True)
for n,js in files.items(): open(D+f'js/{n}.js','w').write(js)
open(D+'js/app.js','w').write(router)
import comptypes as _ct
open(D+'css/style.css','w').write(css+_ct.CSS)
tags=''.join(f'<script src="js/{n}.js"></script>\n' for n in files)+'<script src="js/app.js"></script>'+'\n<script src="js/probe.js"></script>'
open(D+'js/probe.js','w').write(open(JS+'probe.js').read())
html=f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="color-scheme" content="dark">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Electronics Learning</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<nav class="topbar"><a href="#home" class="brand">⚡ Electronics</a><div class="links">{nav}</div></nav>
{pages_html}
{tags}
</body>
</html>'''
open(D+'index.html','w').write(html)
print(len(html))
