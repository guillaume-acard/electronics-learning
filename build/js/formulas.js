
// ================= formulas =================
(function(){
const PG=document.getElementById('page-formulas');
// ---- probe recorder (wraps drawing helpers so schematics can be clicked) ----
let __PRoff=0;function __PR(ctx,r){if(__PRoff)return;const c=ctx&&ctx.canvas;if(!c)return;const f=window.__probeFrame||0;if(c.__recF!==f){c.__recF=f;c.__rec=[];}c.__rec.push(r);}
function __wrap(fn,rec){return function(){rec.apply(this,arguments);__PRoff++;try{return fn.apply(this,arguments);}finally{__PRoff--;}};}
const __V=/^(\+?\d+(\.\d+)?\s?V|0 V|GND)$/;
if(typeof W==='function')W=__wrap(W,(ctx,pts,col,lw)=>{if((col===undefined||col==='#cbd5e1')&&(lw===undefined||lw===3))__PR(ctx,{t:'wire',pts:pts.map(p=>[p[0],p[1]])});});
if(typeof arrowText==='function')arrowText=__wrap(arrowText,(ctx,t,x,y)=>{if(typeof t==='string'&&__V.test(t.trim()))__PR(ctx,{t:'txt',s:t.trim(),x,y});});
if(typeof wire==='function')wire=__wrap(wire,(ctx,pts)=>__PR(ctx,{t:'wire',pts:pts.map(p=>[p[0],p[1]])}));
if(typeof part==='function')part=__wrap(part,(ctx,k,ax,ay,bx,by,o={})=>__PR(ctx,{t:'part',k,a:[ax,ay],b:[bx,by],o:{label:o.label,closed:o.closed,burnt:o.burnt,rgb:o.rgb}}));
if(typeof npnQ==='function')npnQ=__wrap(npnQ,(ctx,x,y,on)=>__PR(ctx,{t:'npn',x,y,on:!!on}));
if(typeof npn==='function')npn=__wrap(npn,(ctx,x,y,on)=>__PR(ctx,{t:'npn',x,y,on:!!on}));
if(typeof chipBox==='function')chipBox=__wrap(chipBox,(ctx,x,y,w,h)=>__PR(ctx,{t:'chip',x,y,w,h}));
if(typeof resV==='function')resV=__wrap(resV,(ctx,x,y1,y2,label)=>__PR(ctx,{t:'part',k:'res',a:[x,y1],b:[x,y2],o:{label}}));
if(typeof capV==='function')capV=__wrap(capV,(ctx,x,y1,y2,label)=>__PR(ctx,{t:'part',k:'cap',a:[x,y1],b:[x,y2],o:{label}}));
if(typeof capH==='function')capH=__wrap(capH,(ctx,x1,x2,y,label)=>__PR(ctx,{t:'part',k:'cap',a:[x1,y],b:[x2,y],o:{label}}));
if(typeof batt==='function')batt=__wrap(batt,(ctx,x,y1,y2,label)=>__PR(ctx,{t:'part',k:'batt',a:[x,y1],b:[x,y2],o:{label}}));
if(typeof ledV==='function')ledV=__wrap(ledV,(ctx,x,y1,y2)=>__PR(ctx,{t:'part',k:'led',a:[x,y1],b:[x,y2],o:{}}));
if(typeof gndSym==='function')gndSym=__wrap(gndSym,(ctx,x,y)=>__PR(ctx,{t:'gnd',x,y}));
if(typeof resBox==='function')resBox=__wrap(resBox,(ctx,x,y,w,h,t)=>{const hz=w>h;__PR(ctx,{t:'part',k:'res',a:hz?[x,y+h/2]:[x+w/2,y],b:hz?[x+w,y+h/2]:[x+w/2,y+h],o:{label:t}});});

const requestAnimationFrame=cb=>window.requestAnimationFrame(function tick(t){if(PG.hidden)window.requestAnimationFrame(tick);else cb(t);});
const PAL={bg:'#0b1120',canvas:'#0b1220',surface:'#101827',card:'#151e30',raised:'#1e293b',control:'#2a3650',line:'#2a3650',white:'#fff',ink:'#e2e8f0',ink2:'#cbd5e1',muted:'#94a3b8',muted2:'#64748b',link:'#93c5fd',water:'#3b82f6',waterLight:'#bcd6fb',waterBg:'#1b2e4f',warmBg:'#3a2c12',good:'#10b981',bad:'#ef4444',badBg:'#3a1a1d',yellow:'#fbbf24',amber:'#f59e0b',blue:'#60a5fa',highlight:'#fde047',accent:'#f59e0b',panel:'#111c2e',slate:'#475569',slateDark:'#334155',gray:'#9ca3af',grayLight:'#e5e7eb',chip:'#1f2937',chipDark:'#111827',chipLight:'#374151',redSoft:'#f87171',redLight:'#fca5a5',redDark:'#dc2626',green:'#22c55e',greenLight:'#86efac',greenDark:'#16a34a',tealDark:'#059669',blueDark:'#2563eb',sky:'#38bdf8',violet:'#a78bfa',purple:'#9333ea',pink:'#f472b6',orange:'#f97316',orangeSoft:'#fb923c',orangeDark:'#ea580c',gold:'#ca8a04',brown:'#b45309',yellowSoft:'#facc15'};
// ===== Core helpers shared by every page (included first in each page bundle) =====
// PAL (the colour palette from shared/css/tokens.css) is added just before this file by the build.

// One animation loop per page: fn(dt seconds since last frame (max 0.05), now ms). Paused while the page is hidden.
function loop(fn){let last=performance.now();function f(now){const dt=Math.min(0.05,(now-last)/1000);last=now;fn(dt,now);requestAnimationFrame(f);}requestAnimationFrame(f);}

// Hold-to-press button: fn(true, event) on press, fn(false) on release (mouse, touch or pen).
function hold(el,fn){el=typeof el==='string'?document.getElementById(el):el;el.style.touchAction='none';el.style.userSelect='none';
  el.addEventListener('pointerdown',e=>{e.preventDefault();fn(true,e);});['pointerup','pointerleave','pointercancel'].forEach(ev=>el.addEventListener(ev,()=>fn(false)));}

// Swap the page's hero illustration (svg = null restores the original).
function heroSwap(page,svg){const el=document.querySelector('#page-'+page+' .illus');if(!el)return;if(!el.dataset.orig)el.dataset.orig=el.innerHTML;const html=svg||el.dataset.orig;
  if(el.innerHTML!==html){el.innerHTML=html;el.animate&&el.animate([{opacity:0,transform:'scale(.94)'},{opacity:1,transform:'scale(1)'}],{duration:260,easing:'ease-out'});}}

// Left menu that shows one section at a time (<aside class="cl-menu" id="..."> with links to the page's sections).
// Adds "← previous / next →" links at the bottom of each section. opts.first: section shown by default;
// opts.onSelect(id): called when a section is shown. An <h4 data-short="..."> prefixes repeated labels.
function sectionMenu(menuId,opts={}){const menu=document.getElementById(menuId);if(!menu)return null;
  const links=[...menu.querySelectorAll('a[href^="#"]')].filter(a=>document.getElementById(a.getAttribute('href').slice(1)));
  const ids=links.map(a=>a.getAttribute('href').slice(1)),text=a=>a.lastChild.textContent.trim();
  const label=a=>{const t=text(a);if(links.filter(b=>text(b)===t).length<2)return t;let h=a.previousElementSibling;while(h&&h.tagName!=='H4')h=h.previousElementSibling;return h?(h.dataset.short||h.textContent)+': '+t:t;};
  function select(id){if(!ids.includes(id))return false;ids.forEach(k=>{document.getElementById(k).hidden=k!==id;});
    links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));const act=links[ids.indexOf(id)];
    if(window.innerWidth<820)menu.scrollLeft=act.offsetLeft-menu.clientWidth/2+act.clientWidth/2;if(opts.onSelect)opts.onSelect(id);return true;}
  function fromHash(){if(!select(location.hash.slice(1))&&!links.some(a=>a.classList.contains('active')))select(opts.first||ids[0]);}
  ids.forEach((id,i)=>{const d=document.createElement('div');d.className='qnav';
    d.innerHTML=(i>0?`<a class="navlink" href="#${ids[i-1]}">← ${label(links[i-1])}</a>`:'<span></span>')+(i<ids.length-1?`<a class="navlink" href="#${ids[i+1]}">${label(links[i+1])} →</a>`:'');
    document.getElementById(id).appendChild(d);});
  window.addEventListener('hashchange',fromHash);fromHash();return {select};}

const $ = id => document.getElementById(id);
function loopPath(ctx, x1, y1, x2, y2){ctx.beginPath(); ctx.moveTo(x1,(y1+y2)/2); ctx.lineTo(x1,y1); ctx.lineTo(x2,y1); ctx.lineTo(x2,y2); ctx.lineTo(x1,y2); ctx.closePath();}
function arrowText(ctx, txt, x, y, color=PAL.muted, size=14, align='center'){ctx.fillStyle=color; ctx.font=`600 ${size}px system-ui,sans-serif`; ctx.textAlign=align; ctx.fillText(txt,x,y);}
// ===== Helpers for schematics and plots =====
function W(ctx,pts,col=PAL.ink2,lw=3){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.lineJoin='round';ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();}
function dot(ctx,x,y){ctx.fillStyle=PAL.ink2;ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill();}
function resV(ctx,x,y1,y2,label){const m=(y1+y2)/2;W(ctx,[[x,y1],[x,m-24]]);ctx.beginPath();ctx.moveTo(x,m-24);for(let i=0;i<6;i++)ctx.lineTo(x+(i%2?-8:8),m-20+i*8);ctx.lineTo(x,m+24);ctx.stroke();W(ctx,[[x,m+24],[x,y2]]);if(label)arrowText(ctx,label,x+14,m+4,PAL.ink2,12,'left');}
function capV(ctx,x,y1,y2,label,faded){const m=(y1+y2)/2,col=faded?PAL.slate:PAL.ink2;W(ctx,[[x,y1],[x,m-6]],col);W(ctx,[[x,m+6],[x,y2]],col);ctx.fillStyle=col;ctx.fillRect(x-18,m-8,36,4);ctx.fillRect(x-18,m+4,36,4);if(label)arrowText(ctx,label,x+24,m+4,faded?PAL.muted:PAL.blueDark,12,'left');}
function capH(ctx,x1,x2,y,label){const m=(x1+x2)/2;W(ctx,[[x1,y],[m-6,y]]);W(ctx,[[m+6,y],[x2,y]]);ctx.fillStyle=PAL.ink2;ctx.fillRect(m-8,y-18,4,36);ctx.fillRect(m+4,y-18,4,36);if(label)arrowText(ctx,label,m,y-26,PAL.blueDark,12);}
function batt(ctx,x,y1,y2,label){const m=(y1+y2)/2;W(ctx,[[x,y1],[x,m-6]]);W(ctx,[[x,m+6],[x,y2]]);ctx.fillStyle=PAL.ink2;ctx.fillRect(x-18,m-8,36,4);ctx.fillRect(x-10,m+4,20,6);arrowText(ctx,'+',x+22,m-6,PAL.redDark,14);if(label)arrowText(ctx,label,x-24,m+4,PAL.ink2,12,'right');}
function glow(ctx,x,y,b,col='255,80,60'){if(b<=0.01)return;const g=ctx.createRadialGradient(x,y,2,x,y,46);g.addColorStop(0,`rgba(${col},${0.9*b})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,46,0,7);ctx.fill();}
function ledV(ctx,x,y1,y2,b){const m=(y1+y2)/2;glow(ctx,x,m,b);W(ctx,[[x,y1],[x,m-10]]);W(ctx,[[x,m+10],[x,y2]]);ctx.fillStyle=b>0.05?`rgb(255,${Math.round(200-150*b)},${Math.round(200-160*b)})`:PAL.white;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x-12,m-10);ctx.lineTo(x+12,m-10);ctx.lineTo(x,m+10);ctx.closePath();ctx.fill();ctx.stroke();W(ctx,[[x-12,m+10],[x+12,m+10]]);arrowText(ctx,'LED',x+20,m+4,PAL.ink2,12,'left');}
function gndSym(ctx,x,y){W(ctx,[[x-14,y],[x+14,y]]);W(ctx,[[x-9,y+6],[x+9,y+6]]);W(ctx,[[x-4,y+12],[x+4,y+12]]);}
function plot(ctx,x,y,w,h,hist,tNow,span,series,min,max,title){
  ctx.fillStyle=PAL.raised;ctx.fillRect(x,y,w,h);ctx.strokeStyle=PAL.line;ctx.lineWidth=1;ctx.strokeRect(x,y,w,h);
  if(title)arrowText(ctx,title,x+2,y-7,PAL.muted,12,'left');
  const X=t=>x+w-(tNow-t)/span*w, Y=v=>y+h-(v-min)/(max-min)*h;
  if(min<0&&max>0){ctx.setLineDash([4,4]);ctx.strokeStyle=PAL.muted;ctx.beginPath();ctx.moveTo(x,Y(0));ctx.lineTo(x+w,Y(0));ctx.stroke();ctx.setLineDash([]);arrowText(ctx,'0',x-6,Y(0)+4,PAL.muted,11,'right');}
  series.forEach(s=>{ctx.setLineDash(s.dash||[]);ctx.strokeStyle=s.col;ctx.lineWidth=s.lw||2.5;ctx.beginPath();let st=false;
    hist.forEach(p=>{if(p.t<tNow-span)return;const xx=X(p.t),yy=Y(Math.max(min,Math.min(max,p[s.k])));st?ctx.lineTo(xx,yy):(ctx.moveTo(xx,yy),st=true);});ctx.stroke();ctx.setLineDash([]);});
  let lx=x;series.forEach(s=>{if(!s.label)return;ctx.fillStyle=s.col;ctx.fillRect(lx,y+h+11,12,3);arrowText(ctx,s.label,lx+16,y+h+16,s.col,11,'left');lx+=ctx.measureText(s.label).width+32;});
  return {X,Y};
}
function choices(id,labels,init,cb){const el=$(id);el.style.display='inline-flex';el.style.gap='8px';el.style.flexWrap='wrap';
  const bs=labels.map((l,i)=>{const b=document.createElement('button');b.textContent=l;b.onclick=()=>{bs.forEach(x=>x.className='');b.className='active';cb(i);};el.appendChild(b);return b;});
  bs[init].className='active';cb(init);}
function prune(h,t,span){while(h.length&&h[0].t<t-span)h.shift();}

function wrapText(ctx,txt,x,y,maxW,lh,color=PAL.ink,size=13){ctx.font=`600 ${size}px system-ui,sans-serif`;ctx.fillStyle=color;ctx.textAlign='left';
  let line='';txt.split(' ').forEach(w=>{const t=line?line+' '+w:w;if(ctx.measureText(t).width>maxW&&line){ctx.fillText(line,x,y);y+=lh;line=w;}else line=t;});if(line)ctx.fillText(line,x,y);}

const BG=PAL.canvas,WIRE=PAL.ink2,Y=PAL.yellow;
function glowAt(ctx,x,y,b,rgb='239,68,68',r=46){if(b<=0.02)return;const g=ctx.createRadialGradient(x,y,2,x,y,r);g.addColorStop(0,`rgba(${rgb},${Math.min(1,b)})`);g.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();}
function txt(ctx,t,x,y,c=PAL.muted,s=12,a='center'){arrowText(ctx,t,x,y,c,s,a);}
function wire(ctx,pts,c=WIRE){W(ctx,pts,c,3);}
function dots(ctx,pts,off,c=Y){ctx.strokeStyle=c;ctx.lineWidth=7;ctx.lineCap='round';ctx.setLineDash([0,20]);ctx.lineDashOffset=-off;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.setLineDash([]);ctx.lineCap='butt';}
// Generic two-terminal part between A and B
function part(ctx,k,ax,ay,bx,by,o={}){
  const L=Math.hypot(bx-ax,by-ay),ang=Math.atan2(by-ay,bx-ax),mx=(ax+bx)/2,my=(ay+by)/2,col=o.col||WIRE,hor=Math.abs(Math.cos(ang))>0.5;
  if(k==='led')glowAt(ctx,mx,my,o.glow||0,o.rgb||'239,68,68');
  if(k==='lamp')glowAt(ctx,mx,my,o.glow||0,'250,204,21',60);
  ctx.save();ctx.translate(mx,my);ctx.rotate(ang);ctx.strokeStyle=col;ctx.lineWidth=3;ctx.fillStyle=BG;
  const lead=(x1,x2)=>{ctx.beginPath();ctx.moveTo(x1,0);ctx.lineTo(x2,0);ctx.stroke();};
  switch(k){
    case 'wire':lead(-L/2,L/2);break;
    case 'empty':ctx.setLineDash([3,6]);ctx.strokeStyle=PAL.slate;lead(-L/2,L/2);ctx.setLineDash([]);break;
    case 'res':case 'ldr':lead(-L/2,-22);lead(22,L/2);ctx.fillRect(-22,-9,44,18);ctx.strokeRect(-22,-9,44,18);
      if(k==='ldr'){ctx.strokeStyle=Y;ctx.lineWidth=1.8;[[-10,0],[2,0]].forEach(([dx])=>{ctx.beginPath();ctx.moveTo(dx-12,-28);ctx.lineTo(dx,-14);ctx.stroke();ctx.beginPath();ctx.moveTo(dx,-14);ctx.lineTo(dx-6,-15);ctx.lineTo(dx-2,-20);ctx.closePath();ctx.fillStyle=Y;ctx.fill();});}break;
    case 'cap':lead(-L/2,-5);lead(5,L/2);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-5,-16);ctx.lineTo(-5,16);ctx.moveTo(5,-16);ctx.lineTo(5,16);ctx.stroke();break;
    case 'diode':case 'led':lead(-L/2,-12);lead(12,L/2);ctx.fillStyle=o.burnt?'#1c1917':(k==='led'&&o.glow>0.05?`rgba(${o.rgb||'239,68,68'},${0.4+0.6*Math.min(1,o.glow)})`:BG);
      ctx.beginPath();ctx.moveTo(-12,-12);ctx.lineTo(12,0);ctx.lineTo(-12,12);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(12,-12);ctx.lineTo(12,12);ctx.stroke();
      if(k==='led'){ctx.strokeStyle=Y;ctx.lineWidth=1.5;[[0],[8]].forEach(([d])=>{ctx.beginPath();ctx.moveTo(d-2,-16);ctx.lineTo(d+6,-26);ctx.stroke();});}break;
    case 'gap':ctx.setLineDash([5,4]);ctx.strokeStyle=Y;ctx.lineWidth=2;lead(-L/2,-28);lead(28,L/2);ctx.strokeRect(-28,-20,56,40);ctx.setLineDash([]);break;
    case 'switch':lead(-L/2,-16);lead(16,L/2);ctx.fillStyle=col;[-16,16].forEach(x=>{ctx.beginPath();ctx.arc(x,0,4,0,7);ctx.fill();});ctx.beginPath();ctx.moveTo(-16,0);o.closed?ctx.lineTo(16,0):ctx.lineTo(13,-15);ctx.stroke();break;
    case 'motor':lead(-L/2,-20);lead(20,L/2);ctx.beginPath();ctx.arc(0,0,20,0,7);ctx.fill();ctx.stroke();ctx.save();ctx.rotate(o.spin||0);ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.rotate(2.09);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(14,0);ctx.stroke();}ctx.restore();break;
    case 'lamp':lead(-L/2,-16);lead(16,L/2);ctx.beginPath();ctx.arc(0,0,16,0,7);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-11,-11);ctx.lineTo(11,11);ctx.moveTo(11,-11);ctx.lineTo(-11,11);ctx.stroke();break;
    case 'batt':lead(-L/2,-6);lead(6,L/2);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-6,-18);ctx.lineTo(-6,18);ctx.stroke();ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(6,-9);ctx.lineTo(6,9);ctx.stroke();break;
    case 'coil':lead(-L/2,-28);lead(28,L/2);ctx.beginPath();for(let i=0;i<4;i++){ctx.arc(-21+i*14,0,7,Math.PI,0);}ctx.stroke();if(o.core){ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-28,-12);ctx.lineTo(28,-12);ctx.moveTo(-28,-16);ctx.lineTo(28,-16);ctx.stroke();}break;
    case 'pot':lead(-L/2,-22);lead(22,L/2);ctx.fillRect(-22,-9,44,18);ctx.strokeRect(-22,-9,44,18);ctx.strokeStyle=Y;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-14,16);ctx.lineTo(14,-16);ctx.stroke();ctx.beginPath();ctx.moveTo(14,-16);ctx.lineTo(6,-14);ctx.lineTo(12,-8);ctx.closePath();ctx.fillStyle=Y;ctx.fill();break;
    case 'ac':lead(-L/2,-20);lead(20,L/2);ctx.beginPath();ctx.arc(0,0,20,0,7);ctx.fill();ctx.stroke();ctx.beginPath();for(let i=0;i<=20;i++){const x=-12+i*1.2,yy=-7*Math.sin(i/20*6.28);i?ctx.lineTo(yy,x):ctx.moveTo(yy,x);}ctx.stroke();break;
  }
  ctx.restore();
  if(k==='gap')txt(ctx,o.slot?o.slot:'?',mx,my+7,Y,20);
  if(k==='motor')txt(ctx,'M',mx,my+5,PAL.ink,13);
  if(k==='batt'){const px=ax+(bx-ax)*0.5,py=ay+(by-ay)*0.5;txt(ctx,'+',hor?px-14:px+16,hor?py-22:py-12+(o.flip?28:0),PAL.redSoft,15);}
  if(k==='led'&&o.burnt)txt(ctx,'💥',mx+(hor?0:26),my+(hor?-26:6),PAL.white,16);
  if(o.label){if(hor)txt(ctx,o.label,mx,my-28,o.lc||PAL.ink,12);else txt(ctx,o.label,mx+(o.left?-30:30),my+4,o.lc||PAL.ink,12,o.left?'right':'left');}
}
function chipBox(ctx,x,y,w,h,l1,l2,hot=0){ctx.fillStyle=hot>0.3?`rgb(${Math.round(71+160*hot)},60,60)`:PAL.slate;ctx.fillRect(x,y,w,h);txt(ctx,l1,x+w/2,y+h/2-2,PAL.white,13);if(l2)txt(ctx,l2,x+w/2,y+h/2+16,PAL.white,13);}
function npnQ(ctx,x,y,on){const c=on?PAL.good:WIRE;ctx.strokeStyle=c;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(x,y,24,0,7);ctx.stroke();
  W(ctx,[[x-34,y],[x-8,y]],c);W(ctx,[[x-8,y-14],[x-8,y+14]],c,4);W(ctx,[[x-8,y-6],[x+10,y-18],[x+10,y-34]],c);W(ctx,[[x-8,y+6],[x+10,y+18],[x+10,y+34]],c);
  ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x+10,y+18);ctx.lineTo(x,y+17);ctx.lineTo(x+5,y+9);ctx.fill();}
function miniGraph(ctx,x,y,w,h,fn,t0,t1,col,min,max,label){ctx.fillStyle=PAL.raised;ctx.fillRect(x,y,w,h);ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();
  for(let px=0;px<=w;px++){const t=t0+(t1-t0)*px/w,v=fn(t);if(v===null)continue;const yy=y+h-(Math.max(min,Math.min(max,v))-min)/(max-min)*h;px?ctx.lineTo(x+px,yy):ctx.moveTo(x+px,yy);}ctx.stroke();if(label)txt(ctx,label,x+4,y-6,PAL.muted,11,'left');}
const fmtOhm=r=>r>=1e6?+(r/1e6).toFixed(2)+' MΩ':r>=1000?+(r/1000).toFixed(r<10000?2:1)+' kΩ':Math.round(r)+' Ω';
const E12=[1,1.2,1.5,1.8,2.2,2.7,3.3,3.9,4.7,5.6,6.8,8.2];
const snapE12=v=>{const d=Math.pow(10,Math.floor(Math.log10(v)));let best=d;E12.forEach(e=>{if(Math.abs(Math.log(e*d/v))<Math.abs(Math.log(best/v)))best=e*d;});if(Math.abs(Math.log(10*d/v))<Math.abs(Math.log(best/v)))best=10*d;return best;};
// round indicator light (an LED seen from the front): on 0..1, rgb "r,g,b"
function lamp(ctx,x,y,on,rgb='34,197,94',r=9){if(on>0.02){const gr=ctx.createRadialGradient(x,y,1,x,y,r*3.2);gr.addColorStop(0,`rgba(${rgb},${on})`);gr.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=gr;ctx.beginPath();ctx.arc(x,y,r*3.2,0,7);ctx.fill();}
  ctx.fillStyle=on>0.02?`rgba(${rgb},${0.35+0.65*on})`:PAL.raised;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.stroke();}
// ===== 7-segment digits =====
// Lit segments of each digit, and the rectangle layout of a 60 x 106 digit.
const DIGITS={0:'abcdef',1:'bc',2:'abged',3:'abgcd',4:'fgbc',5:'afgcd',6:'afgedc',7:'abc',8:'abcdefg',9:'abcdfg'};
const SEG7={a:[10,0,40,8],g:[10,49,40,8],d:[10,98,40,8],f:[2,8,8,41],b:[50,8,8,41],e:[2,57,8,41],c:[50,57,8,41]};
// One digit at (x,y), scale sc. on: lit segments ('abc' or DIGITS[n]). o.pad: black margin, o.glow: glow of lit segments, o.col: lit colour.
function drawDigit(ctx,x,y,sc,on,o={}){const pad=o.pad??10,glow=o.glow||0,col=o.col||PAL.bad;
  ctx.fillStyle='#0a0a0a';ctx.fillRect(x-pad,y-pad,60*sc+2*pad,106*sc+2*pad);ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);
  Object.entries(SEG7).forEach(([k,[a,b,w,h]])=>{const l=on.includes(k);ctx.shadowBlur=l?glow:0;ctx.shadowColor=col;ctx.fillStyle=l?col:'#2a1416';ctx.fillRect(a,b,w,h);});ctx.restore();ctx.shadowBlur=0;}


// ===== Formulas page =====
sectionMenu('foMenu',{first:'fobasics'});
const fv=id=>{const c=$(id);return c&&c.offsetParent?c:null;};
const fctx=c=>{const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);return x;};
const fR=r=>r>=1e6?+(r/1e6).toPrecision(3)+' MΩ':r>=1e3?+(r/1e3).toPrecision(3)+' kΩ':+r.toPrecision(3)+' Ω';
const fI=i=>i>=1?+i.toPrecision(3)+' A':i>=1e-3?+(i*1e3).toPrecision(3)+' mA':+(i*1e6).toPrecision(3)+' µA';
const fP=p=>p>=1?+p.toPrecision(3)+' W':+(p*1e3).toPrecision(3)+' mW';
const fV=v=>v>=1?+v.toPrecision(3)+' V':+(v*1e3).toPrecision(3)+' mV';
const E12S=[1,1.2,1.5,1.8,2.2,2.7,3.3,3.9,4.7,5.6,6.8,8.2];
const e12up=r=>{const d=Math.pow(10,Math.floor(Math.log10(r)));for(const m of E12S)if(m*d>=r*0.999)return m*d;return 10*d;};
const e12near=r=>{const d=Math.pow(10,Math.floor(Math.log10(r)));let best=d,bd=1e9;[...E12S,10].forEach(m=>{const v=m*d,dd=Math.abs(Math.log(v/r));if(dd<bd){bd=dd;best=v;}});return best;};
function pipe(ctx,x1,x2,y,h,col){ctx.fillStyle=col||'#1e3a5f';ctx.fillRect(x1,y-h/2,x2-x1,h);}
function flowDots(ctx,x1,x2,y,h,speed,t,col){const n=Math.max(2,Math.floor((x2-x1)/26));for(let i=0;i<n;i++){const x=x1+(((i/n)+t*speed*0.05)%1+1)%1*(x2-x1);ctx.fillStyle=col||PAL.link;ctx.beginPath();ctx.arc(x,y+(i%3-1)*h*0.22,Math.min(4,h/4),0,7);ctx.fill();}}
// ---------- basics ----------
function drawBasics(t){const c=fv('cfBasics');if(!c)return;const ctx=fctx(c);
  ctx.fillStyle='#1d4ed8';ctx.beginPath();ctx.roundRect(40,60,110,140,10);ctx.fill();txt(ctx,'pump',95,120,'#e0e7ff',14);txt(ctx,'= battery',95,140,'#bfdbfe',12);txt(ctx,'pressure = VOLTAGE',95,225,PAL.yellow,12);
  pipe(ctx,150,330,90,26);pipe(ctx,330,440,90,8,PAL.slate);pipe(ctx,440,620,90,26);pipe(ctx,620,650,90,26);pipe(ctx,150,650,190,26);ctx.fillStyle='#1e3a5f';ctx.fillRect(637,77,26,126);
  txt(ctx,'narrow pipe = RESISTANCE',385,62,PAL.pink,12);flowDots(ctx,150,650,90,22,4,t);flowDots(ctx,150,650,190,22,-4,t);txt(ctx,'flow = CURRENT',360,232,PAL.link,12);
  const a=t*4;ctx.save();ctx.translate(560,150);ctx.rotate(a);ctx.strokeStyle=PAL.yellow;ctx.lineWidth=4;for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,32);ctx.stroke();}ctx.restore();ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.arc(560,150,6,0,7);ctx.fill();txt(ctx,'wheel turns:',560,205,PAL.yellow,12);txt(ctx,'POWER = V × I',560,222,PAL.yellow,12);}
// ---------- units converter ----------
(()=>{const U=[['Ω',1],['kΩ',1e3],['MΩ',1e6],['mA',1e-3],['µA',1e-6],['A',1],['µF',1e-6],['nF',1e-9],['pF',1e-12],['mV',1e-3],['V',1]];const s=$('cvFrom');U.forEach(([u,m],i)=>{const o=document.createElement('option');o.value=i;o.textContent=u;if(u==='kΩ')o.selected=true;s.appendChild(o);});
  const fam=u=>u.includes('Ω')?['Ω','kΩ','MΩ']:u.endsWith('A')?['µA','mA','A']:u.endsWith('F')?['pF','nF','µF']:['mV','V'];
  const up=()=>{const v=parseFloat($('cvIn').value.replace(',','.'));const [u,m]=U[+s.value];if(isNaN(v)){$('cvOut').textContent='?';return;}const base=v*m;
    $('cvOut').textContent=fam(u).map(x=>{const mm=U.find(q=>q[0]===x)[1];return +(base/mm).toPrecision(4)+' '+x;}).join('  =  ');};
  $('cvIn').addEventListener('input',up);s.addEventListener('change',up);up();})();
// ---------- Ohm ----------
const OH={k:'I',V:9,R:1000,I:0.009};
function ohmControls(){const box=$('ohmCtl');const mk=(id,lab,min,max,step,val)=>`<label class="slider" style="flex:1">${lab}<input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${val}" style="flex:1;width:auto"></label>`;
  let h='';if(OH.k!=='V')h+=mk('ohV','Voltage',0.5,12,0.1,OH.V);if(OH.k!=='R')h+=mk('ohR','Resistance',1,6,0.01,Math.log10(OH.R));if(OH.k!=='I')h+=mk('ohI','Current (mA)',-1,2,0.01,Math.log10(OH.I*1000));box.innerHTML=h;
  box.querySelectorAll('input').forEach(i=>i.addEventListener('input',()=>{if($('ohV'))OH.V=+$('ohV').value;if($('ohR'))OH.R=Math.pow(10,+$('ohR').value);if($('ohI'))OH.I=Math.pow(10,+$('ohI').value)/1000;}));}
document.querySelectorAll('.foSolve').forEach(b=>b.addEventListener('click',()=>{OH.k=b.dataset.k;document.querySelectorAll('.foSolve').forEach(x=>x.classList.toggle('active',x===b));ohmControls();}));ohmControls();
function drawOhm(t){const c=fv('cfOhm');if(!c)return;const ctx=fctx(c);if(OH.k==='I')OH.I=OH.V/OH.R;if(OH.k==='V')OH.V=OH.R*OH.I;if(OH.k==='R')OH.R=OH.V/OH.I;
  // triangle
  const tx=130,ty=40;ctx.strokeStyle=PAL.sky;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx+100,ty+170);ctx.lineTo(tx-100,ty+170);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(tx-62,ty+105);ctx.lineTo(tx+62,ty+105);ctx.moveTo(tx,ty+105);ctx.lineTo(tx,ty+170);ctx.stroke();
  const hl=k=>OH.k===k?PAL.yellow:PAL.ink;txt(ctx,'V',tx,ty+80,hl('V'),30);txt(ctx,'R',tx-38,ty+150,hl('R'),26);txt(ctx,'I',tx+38,ty+150,hl('I'),26);
  const f={I:'I = V ÷ R',V:'V = R × I',R:'R = V ÷ I'}[OH.k];txt(ctx,f,tx,ty+205,PAL.yellow,16);
  // water pipe
  const y=110,h=Math.max(6,Math.min(46,46-Math.log10(OH.R)*7));pipe(ctx,300,720,y,46,'#0f2744');pipe(ctx,450,570,y,h,'#1e3a5f');pipe(ctx,300,450,y,46);pipe(ctx,570,720,y,46);
  flowDots(ctx,300,720,y,Math.min(40,h),Math.min(30,Math.sqrt(OH.I*1000)*2),t);txt(ctx,'pressure '+fV(OH.V),330,y-40,hl('V'),13,'left');txt(ctx,'pipe '+fR(OH.R),510,y-40,hl('R'),13);txt(ctx,'flow '+fI(OH.I),700,y-40,hl('I'),13,'right');
  const res=OH.k==='I'?`I = ${fV(OH.V)} ÷ ${fR(OH.R)} = ${fI(OH.I)}`:OH.k==='V'?`V = ${fR(OH.R)} × ${fI(OH.I)} = ${fV(OH.V)}`:`R = ${fV(OH.V)} ÷ ${fI(OH.I)} = ${fR(OH.R)}`;
  txt(ctx,res,510,200,PAL.white,18);}
// ---------- Power ----------
function drawPow(t){const c=fv('cfPow');if(!c)return;const ctx=fctx(c);const V=+$('pwV').value,R=Math.pow(10,+$('pwR').value),I=V/R,P=V*I;
  const lim=0.25,hot=Math.min(1,P/lim);glowAt(ctx,170,110,hot,P>lim?'239,68,68':'249,115,22',70);ctx.fillStyle='#e7c99a';ctx.beginPath();ctx.roundRect(120,96,100,28,10);ctx.fill();W(ctx,[[60,110],[120,110]],PAL.gray,3);W(ctx,[[220,110],[280,110]],PAL.gray,3);
  ['#7c3f12','#111',PAL.redDark].forEach((col,i)=>{ctx.fillStyle=col;ctx.fillRect(140+i*16,96,7,28);});txt(ctx,'¼ W resistor',170,160,PAL.muted,12);
  txt(ctx,`I = ${fV(V)} ÷ ${fR(R)} = ${fI(I)}`,520,60,PAL.ink2,15);txt(ctx,`P = V × I = ${fP(P)}`,520,95,PAL.white,20);txt(ctx,`(also V² ÷ R = ${fP(V*V/R)})`,520,125,PAL.muted,13);
  const pct=P/lim*100;ctx.fillStyle=PAL.raised;ctx.fillRect(380,150,280,18);ctx.fillStyle=P>lim?PAL.bad:P>lim*0.6?PAL.amber:PAL.green;ctx.fillRect(380,150,Math.min(280,280*P/lim),18);ctx.strokeStyle=PAL.muted2;ctx.strokeRect(380,150,280,18);
  txt(ctx,P>lim?`🔥 ${Math.round(pct)} % of ¼ W: too hot! Use a ${P>1?'2 W':P>0.5?'1 W':'½ W'} resistor or a higher value`:P>lim*0.6?`${Math.round(pct)} % of ¼ W: warm, prefer ½ W`:`${Math.round(pct)} % of ¼ W: fine`,520,200,P>lim?PAL.bad:P>lim*0.6?PAL.amber:PAL.green,14);}
// ---------- series / parallel ----------
const SP={par:false};$('spS').addEventListener('click',()=>{SP.par=false;$('spS').classList.add('active');$('spP').classList.remove('active');});$('spP').addEventListener('click',()=>{SP.par=true;$('spP').classList.add('active');$('spS').classList.remove('active');});
function drawSP(t){const c=fv('cfSP');if(!c)return;const ctx=fctx(c);const R1=e12near(Math.pow(10,+$('spR1').value)),R2=e12near(Math.pow(10,+$('spR2').value));const Rt=SP.par?R1*R2/(R1+R2):R1+R2,V=9,I=V/Rt;
  part(ctx,'batt',60,60,60,200,{label:'9 V',left:true});
  if(!SP.par){wire(ctx,[[60,60],[150,60]]);part(ctx,'res',150,60,250,60,{label:'R1 '+fR(R1)});wire(ctx,[[250,60],[300,60]]);part(ctx,'res',300,60,400,60,{label:'R2 '+fR(R2)});wire(ctx,[[400,60],[440,60],[440,200],[60,200]]);dots(ctx,[[60,200],[60,60],[440,60],[440,200],[60,200]],t*Math.min(40,I*4000));
    txt(ctx,`V1 = ${fV(I*R1)} · V2 = ${fV(I*R2)} (they add up to 9 V)`,250,240,PAL.muted,12);}
  else{wire(ctx,[[60,60],[200,60]]);wire(ctx,[[200,60],[200,90]]);wire(ctx,[[200,60],[340,60],[340,90]]);part(ctx,'res',200,90,200,170,{label:'R1'});part(ctx,'res',340,90,340,170,{label:'R2'});wire(ctx,[[200,170],[200,200]]);wire(ctx,[[340,170],[340,200],[60,200]]);
    dots(ctx,[[60,200],[60,60],[200,60],[200,200]],t*Math.min(40,V/R1*4000));dots(ctx,[[60,60],[340,60],[340,200],[200,200]],t*Math.min(40,V/R2*4000),PAL.pink);txt(ctx,`I1 = ${fI(V/R1)} · I2 = ${fI(V/R2)} (they add up)`,250,240,PAL.muted,12);}
  txt(ctx,SP.par?'R = R1 × R2 ÷ (R1 + R2)':'R = R1 + R2',620,80,PAL.sky,18);txt(ctx,SP.par?`= ${fR(R1)} × ${fR(R2)} ÷ ${fR(R1+R2)}`:`= ${fR(R1)} + ${fR(R2)}`,620,115,PAL.ink2,14);txt(ctx,'= '+fR(Rt),620,150,PAL.white,22);txt(ctx,'battery current '+fI(I),620,185,PAL.yellow,14);
  if(SP.par)txt(ctx,'smaller than the smallest one!',620,210,PAL.muted,12);}
// ---------- divider ----------
function drawDiv(t){const c=fv('cfDiv');if(!c)return;const ctx=fctx(c);const V=+$('dvV').value,R1=e12near(Math.pow(10,+$('dvR1').value)),R2=e12near(Math.pow(10,+$('dvR2').value)),Vo=V*R2/(R1+R2);
  txt(ctx,'Vin '+fV(V),200,24,PAL.bad,13);__PR(ctx,{t:'txt',s:'+'+V+' V',x:200,y:34});__PR(ctx,{t:'txt',s:'0 V',x:200,y:216});part(ctx,'res',200,34,200,114,{label:'R1 '+fR(R1)});dot(ctx,200,125);wire(ctx,[[200,114],[200,136]]);part(ctx,'res',200,136,200,216,{label:'R2 '+fR(R2)});txt(ctx,'0 V',200,236,PAL.muted,13);
  wire(ctx,[[200,125],[300,125]]);txt(ctx,'Vout',310,129,PAL.yellow,13,'left');
  ctx.fillStyle=PAL.raised;ctx.fillRect(380,40,40,180);const h=180*Vo/V;ctx.fillStyle=PAL.yellow;ctx.fillRect(380,220-h,40,h);txt(ctx,'Vin',400,34,PAL.muted,11);
  txt(ctx,'Vout = Vin × R2 ÷ (R1 + R2)',620,70,PAL.sky,17);txt(ctx,`= ${fV(V)} × ${fR(R2)} ÷ ${fR(R1+R2)}`,620,110,PAL.ink2,14);txt(ctx,'= '+fV(Vo),620,150,PAL.white,24);txt(ctx,`(${Math.round(Vo/V*100)} % of Vin)`,620,180,PAL.muted,13);}
// ---------- LED resistor ----------
const LC={v:2,col:'red'};(()=>{const box=$('ledCol');[['red',2,PAL.bad],['yellow',2.1,PAL.yellowSoft],['green',2.2,PAL.green],['blue',3,PAL.water],['white',3.1,'#f8fafc']].forEach(([n,v,c],i)=>{const b=document.createElement('button');b.textContent=n+' ('+v+' V)';b.style.borderLeft='6px solid '+c;if(i===0)b.className='active';
  b.onclick=()=>{LC.v=v;LC.col=n;box.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));upLR();};box.appendChild(b);});})();
function upLR(){const V=+$('lrV').value,I=+$('lrI').value/1000;const d=V-LC.v;if(d<=0){$('lrOut').innerHTML=`<p>⚠️ ${V} V is not enough for a ${LC.col} LED (${LC.v} V).</p>`;return;}const R=d/I,Rs=e12up(R),Ir=d/Rs,P=d*Ir;
  $('lrOut').innerHTML=`<p>R = (${V} − ${LC.v}) V ÷ ${(I*1000).toFixed(0)} mA = <b>${fR(R)}</b> → nearest standard value above: <b>${fR(Rs)}</b></p><p>Real current with ${fR(Rs)}: <b>${fI(Ir)}</b> · power in the resistor: <b>${fP(P)}</b> ${P>0.125?'⚠️ use ½ W':'(fine for ¼ W)'}</p>`;}
['lrV','lrI'].forEach(id=>$(id).addEventListener('input',upLR));upLR();
// ---------- RC ----------
function drawRC(t){const c=fv('cfRC');if(!c)return;const ctx=fctx(c);const R=e12near(Math.pow(10,+$('foRcR').value)),C=+$('foRcC').value,tau=R*C;
  const gx=60,gy=30,gw=500,gh=170;ctx.fillStyle=PAL.panel;ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle=PAL.line;ctx.strokeRect(gx,gy,gw,gh);
  for(let k=1;k<=5;k++){const x=gx+k/5*gw;ctx.strokeStyle=PAL.slateDark;ctx.beginPath();ctx.moveTo(x,gy);ctx.lineTo(x,gy+gh);ctx.stroke();txt(ctx,k+'τ',x,gy+gh+16,PAL.muted2,11);}
  ctx.strokeStyle=PAL.sky;ctx.lineWidth=2.5;ctx.beginPath();for(let i=0;i<=200;i++){const x=gx+i/200*gw,v=1-Math.exp(-i/200*5);const y=gy+gh-v*gh;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  const x1=gx+gw/5,y1=gy+gh-0.632*gh;ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.arc(x1,y1,5,0,7);ctx.fill();txt(ctx,'63 % after 1 τ',x1+8,y1+18,PAL.yellow,12,'left');
  const ph=(t%6)/5,px=gx+Math.min(1,ph)*gw,pv=1-Math.exp(-Math.min(1,ph)*5);ctx.fillStyle=PAL.white;ctx.beginPath();ctx.arc(px,gy+gh-pv*gh,4,0,7);ctx.fill();
  const fs=s=>s>=1?s.toPrecision(3)+' s':(s*1000).toPrecision(3)+' ms';
  txt(ctx,'τ = R × C',690,60,PAL.sky,18);txt(ctx,`= ${fR(R)} × ${C>=1e-3?'1000 µF':C*1e6+' µF'}`,690,95,PAL.ink2,14);txt(ctx,'= '+fs(tau),690,130,PAL.white,22);txt(ctx,'≈ full after 5τ = '+fs(5*tau),690,165,PAL.muted,13);
  txt(ctx,'as a 555 (R1 = 1 kΩ, R2 = R): '+(1.44/((1000+2*R)*C)).toPrecision(3)+' Hz',690,200,PAL.yellow,12);}
// ---------- battery ----------
const BTY={mah:500,v:9,name:'9 V battery'};(()=>{const box=$('btType');[['9 V battery',500,9],['4 × AA',2500,6],['18650 cell',3500,3.6],['USB power bank',10000,5]].forEach(([n,m,v],i)=>{const b=document.createElement('button');b.textContent=n+' ('+m+' mAh)';if(i===0)b.className='active';b.onclick=()=>{Object.assign(BTY,{mah:m,v,name:n});box.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));upBT();};box.appendChild(b);});})();
function upBT(){const I=Math.pow(10,+$('btI').value)/10;const h=BTY.mah/I;const real=h*0.7;const fmt=x=>x>=48?(x/24).toFixed(1)+' days':x>=1?x.toFixed(1)+' h':(x*60).toFixed(0)+' min';
  $('btOut').innerHTML=`<p>${BTY.name}: ${BTY.mah} mAh ÷ <b>${I<1?I.toFixed(2):I.toFixed(1)} mA</b> = <b>${fmt(h)}</b> in theory, about <b>${fmt(real)}</b> in practice.</p><p class="hint">Typical draws: LM35 alone 0.06 mA · 555 blinker ≈ 10 mA · LED dice ≈ 20 mA · two 7-segment displays ≈ 60–100 mA · Arduino ≈ 45 mA + displays.</p>`;}
$('btI').addEventListener('input',upBT);upBT();
// ---------- loop ----------
let lastFo=performance.now();
loop((dt,now)=>{const t=now/1000;drawBasics(t);drawOhm(t);drawPow(t);drawSP(t);drawDiv(t);drawRC(t);});

})();
