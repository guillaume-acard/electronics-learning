"""Renders build/shopping.html from items.py."""
import json
from items import I

PAGE='''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="color-scheme" content="dark">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Shopping list · Electronics Learning</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<nav class="topbar"><a href="index.html#home" class="brand">⚡ Electronics</a><div class="links"><a href="index.html#circuits">← Circuits to build</a><a href="index.html#parts">Real parts</a></div></nav>
<div class="hero" style="--accent:#22c55e"><div class="hero-inner">
  <div><span class="eyebrow">Gotronic shopping list</span><h1>Everything for the circuits</h1><p class="tag">The minimum parts to build each of the 26 "Circuits to build" projects and the two real-life builds (battery charger and night light), from gotronic.fr. Quantities are what the biggest project needs: you build one circuit at a time, then take it apart and reuse the parts for the next one.</p>
  <div class="facts"><span>✓ Tick what you need</span><span>Codes for the Gotronic search box</span><span>Prices read 18 Nov 2026</span></div></div>
  <div class="illus"><svg viewBox="0 0 320 200" aria-hidden="true"><rect x="60" y="60" width="200" height="120" rx="10" fill="#15803d"/><path d="M90 60 q70 -70 140 0" stroke="#86efac" stroke-width="10" fill="none"/><rect x="85" y="85" width="40" height="14" rx="6" fill="#d9b98a"/><circle cx="160" cy="110" r="16" fill="#ef4444"/><rect x="190" y="95" width="46" height="30" rx="3" fill="#111827"/><rect x="95" y="130" width="22" height="34" rx="5" fill="#2563eb"/><text x="200" y="160" fill="#dcfce7" font-size="22" font-weight="800" font-family="system-ui">€</text></svg></div>
</div></div>
<main>
<section>
  <h2>How to use this list</h2>
  <ul>
    <li><b>Untick</b> anything you already own (you probably have a soldering iron, wires, 9 V batteries, maybe an Arduino and a multimeter).</li>
    <li>Change quantities if you want spares. Small parts cost a few cents, so getting 2–3 extra of each is a good idea for beginners.</li>
    <li>Type the <b>code</b> into the Gotronic search box, or click the name to open the product page.</li>
    <li>"Used in" refers to the project numbers on the <a class="navlink" href="index.html#circuits">Circuits to build</a> page (A = battery charger, B = night light).</li>
  </ul>
  <div class="controls"><button id="selAll">Tick all</button><button id="selReq" class="active">Required only (no optional)</button><button id="copy">📋 Copy the list (codes + quantities)</button><span id="copied"></span></div>
</section>
<section>
  <table class="shop" id="shop"></table>
  <p class="hint" style="margin-top:14px">Prices include VAT (TTC), as shown on gotronic.fr on 18 Nov 2026, excluding delivery. They can change, and some items may go out of stock: Gotronic usually has close equivalents (same value, other brand). Resistors are sold in packs of 10, and the price shown is per pack.</p>
</section>
<section>
  <h2>Notes before you order</h2>
  <ul>
    <li><b>Li-ion safety:</b> the 18650 cell sold here is <b>unprotected</b>, and the TP4056 charger page doesn't mention protection. So the list includes a <b>BMS 1S protection board</b>. Wire it as: cell → B+/B− of the BMS. Charger output and your load → P+/P−. Never short the cell, never charge it unattended the first times.</li>
    <li><b>Relays:</b> the RWH-SS relays have pins that don't fit a breadboard well. Solder 5 short wires (or header pins) to them first.</li>
    <li><b>Mains:</b> nothing on this list uses 230 V. The "lamp" is a <b>12 V bulb</b> powered by a safe 12 V adapter.</li>
    <li><b>Not on the list:</b> 9 V batteries, a micro-USB cable for the charger, a multimeter (very useful, ~€15–25), a small screwdriver for the trimmers.</li>
    <li><b>Inductor project (6):</b> it uses the 5 V relay's <b>coil</b> as the inductor, so no extra part is needed.</li>
  </ul>
</section>
</main>
<div class="tot"><span>Selected: <span id="nSel"></span> items</span><span>Total ≈ <b id="sum"></b> TTC <span class="hint">(+ delivery)</span></span></div>
<script>
const ITEMS={rows};
const st=ITEMS.map(it=>({{on:!it.opt,q:it.q}}));
function fmt(v){{return v.toFixed(2).replace('.',',')+' €';}}
function render(){{let h='',g='';
  ITEMS.forEach((it,i)=>{{if(it.g!==g){{g=it.g;h+=`<tr class="grp"><td colspan="5">${{g}}</td></tr>`;}}
    const s=st[i];h+=`<tr class="${{s.on?'':'off'}}"><td style="width:28px"><input type="checkbox" data-i="${{i}}" ${{s.on?'checked':''}}></td>
    <td><a class="navlink" href="${{it.u}}" target="_blank" rel="noopener">${{it.n}}</a>${{it.opt?' <span class="qtopic">optional</span>':''}}<span class="used">Used in: ${{it.used}}</span>${{it.note?`<span class="note">${{it.note}}</span>`:''}}</td>
    <td class="code">${{it.c}}</td><td><input type="number" min="0" value="${{s.q}}" data-q="${{i}}"> × ${{fmt(it.p)}}</td><td style="text-align:right;white-space:nowrap">${{s.on?fmt(it.p*s.q):'—'}}</td></tr>`;}});
  document.getElementById('shop').innerHTML='<tr><td></td><td><b>Item</b></td><td><b>Code</b></td><td><b>Qty × price</b></td><td style="text-align:right"><b>Subtotal</b></td></tr>'+h;
  document.querySelectorAll('[data-i]').forEach(c=>c.onchange=()=>{{st[+c.dataset.i].on=c.checked;render();}});
  document.querySelectorAll('[data-q]').forEach(c=>c.onchange=()=>{{st[+c.dataset.q].q=Math.max(0,+c.value||0);render();}});
  let tot=0,n=0;ITEMS.forEach((it,i)=>{{if(st[i].on&&st[i].q>0){{tot+=it.p*st[i].q;n++;}}}});
  document.getElementById('sum').textContent=fmt(tot);document.getElementById('nSel').textContent=n;}}
document.getElementById('selAll').onclick=()=>{{st.forEach(s=>s.on=true);render();}};
document.getElementById('selReq').onclick=()=>{{st.forEach((s,i)=>s.on=!ITEMS[i].opt);render();}};
document.getElementById('copy').onclick=async()=>{{const lines=ITEMS.map((it,i)=>st[i].on&&st[i].q>0?`${{it.c}}\\t${{st[i].q}}\\t${{it.n}}`:null).filter(Boolean);
  const t='Gotronic order (code, qty, item)\\n'+lines.join('\\n')+'\\nTotal ≈ '+document.getElementById('sum').textContent;
  try{{await navigator.clipboard.writeText(t);document.getElementById('copied').textContent='Copied ✓';}}catch(e){{document.getElementById('copied').textContent='Copy not allowed here: select the table instead';}}}};
render();
</script>
</body>
</html>'''


def build(site_dir):
    rows=json.dumps([dict(g=a,n=b,c=c,p=d,q=e,u=f,used=g,note=h,opt=i) for a,b,c,d,e,f,g,h,i in I],ensure_ascii=False)
    open(site_dir+'shopping.html','w').write(PAGE.format(rows=rows))
    tot=sum(p*q for _,_,_,p,q,_,_,_,o in I if not o);toto=sum(p*q for _,_,_,p,q,_,_,_,o in I)
    return round(tot,2),round(toto,2),len(I)
