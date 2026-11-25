
// ================= circuits =================
(function(){
const PG=document.getElementById('page-circuits');
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
const PAL={bg:'#0b1120',canvas:'#0b1220',surface:'#101827',card:'#151e30',raised:'#1e293b',control:'#2a3650',line:'#2a3650',white:'#fff',ink:'#e2e8f0',ink2:'#cbd5e1',muted:'#94a3b8',muted2:'#64748b',link:'#93c5fd',water:'#3b82f6',waterLight:'#bcd6fb',waterBg:'#1b2e4f',warmBg:'#3a2c12',good:'#10b981',bad:'#ef4444',badBg:'#3a1a1d',yellow:'#fbbf24',amber:'#f59e0b',blue:'#60a5fa',highlight:'#fde047',accent:'#f59e0b',cyan:'#22d3ee',void:'#070b16',panel:'#111c2e',slate:'#475569',slateDark:'#334155',gray:'#9ca3af',grayLight:'#e5e7eb',chip:'#1f2937',chipDark:'#111827',chipLight:'#374151',redSoft:'#f87171',redLight:'#fca5a5',redDark:'#dc2626',green:'#22c55e',greenLight:'#86efac',greenDark:'#16a34a',tealDark:'#059669',blueDark:'#2563eb',sky:'#38bdf8',violet:'#a78bfa',purple:'#9333ea',pink:'#f472b6',orange:'#f97316',orangeSoft:'#fb923c',orangeDark:'#ea580c',gold:'#ca8a04',brown:'#b45309',yellowSoft:'#facc15'};
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

// ===== Breadboard: geometry (BB, HP), the board and the parts drawn on it (partOn). Used by Circuits and Build. =====
// Holes are named like the real board: rows a–e / f–j and columns 1–60; rails tp/tn (top + / −) and bp/bn (bottom).
const BB={W:800,H:440,x0:38,dx:12.4,rows:{tp:112,tn:124,a:150,b:162,c:174,d:186,e:198,f:228,g:240,h:252,i:264,j:276,bp:302,bn:314}};
function HP(h){if(Array.isArray(h))return h;const m=/^(tp|tn|bp|bn|[a-j])(\d+)$/.exec(h);if(!m)throw 'bad hole '+h;return [BB.x0+(+m[2]-1)*BB.dx,BB.rows[m[1]]];}
function drawBoard(ctx){ctx.fillStyle=PAL.grayLight;ctx.beginPath();ctx.roundRect(22,98,BB.W-44,232,8);ctx.fill();
  ctx.fillStyle='#d1d5db';ctx.fillRect(28,206,BB.W-56,14);
  [['tp',PAL.bad,-7],['tn',PAL.water,7],['bp',PAL.bad,-7],['bn',PAL.water,7]].forEach(([r,c,o])=>{ctx.strokeStyle=c;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(30,BB.rows[r]+o);ctx.lineTo(BB.W-30,BB.rows[r]+o);ctx.stroke();});
  ctx.fillStyle=PAL.gray;for(let c=1;c<=60;c++){const x=BB.x0+(c-1)*BB.dx;Object.entries(BB.rows).forEach(([r,y])=>{if(r.length===2&&c%6===0)return;ctx.fillRect(x-1.8,y-1.8,3.6,3.6);});}
  ctx.fillStyle=PAL.muted2;ctx.font='600 8px system-ui';ctx.textAlign='center';for(let c=1;c<=60;c+=(c===1?4:5)){ctx.fillText(String(c),BB.x0+(c-1)*BB.dx,140);}
  ctx.textAlign='right';'abcdefghij'.split('').forEach(r=>ctx.fillText(r,31,BB.rows[r]+3));
  ctx.fillStyle=PAL.bad;ctx.font='700 10px system-ui';ctx.fillText('+',30,BB.rows.tp+4);ctx.fillText('+',30,BB.rows.bp+4);ctx.fillStyle=PAL.water;ctx.fillText('−',30,BB.rows.tn+4);ctx.fillText('−',30,BB.rows.bn+4);}
const RCOL=['#111','#7c3f12',PAL.redDark,PAL.orange,PAL.yellowSoft,PAL.greenDark,PAL.blueDark,'#7c3aed',PAL.gray,'#f8fafc'];
function bands(v){const n=Math.round(v);if(!n)return null;const s=String(n);const d1=+s[0],d2=s.length>1?+s[1]:0,m=s.length-2;return [RCOL[d1],RCOL[d2],RCOL[Math.max(0,m)]||'#111','#d4af37'];}
function pin(ctx,x,y){ctx.fillStyle=PAL.slate;ctx.beginPath();ctx.arc(x,y,2.6,0,7);ctx.fill();}
function leg(ctx,a,b){ctx.strokeStyle=PAL.gray;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
function partOn(ctx,p,lit,T){const A=p.a?HP(p.a):null,B=p.b?HP(p.b):null;
  switch(p.t){
  case 'wire':{const d=Math.hypot(B[0]-A[0],B[1]-A[1]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-Math.min(34,8+d*0.18);
    ctx.strokeStyle=p.c||PAL.greenDark;ctx.lineWidth=3.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.quadraticCurveTo(mx,my,B[0],B[1]);ctx.stroke();ctx.lineCap='butt';
    if(!p.freeA)pin(ctx,A[0],A[1]);if(!p.freeB)pin(ctx,B[0],B[1]);if(p.lab){txt(ctx,p.lab,B[0],B[1]+16,PAL.ink,11);}break;}
  case 'res':{const d=Math.hypot(B[0]-A[0],B[1]-A[1]);const bs=bands(p.v);
    if(d<34){const cx=A[0],cy=A[1]-16;leg(ctx,A,[cx,cy]);ctx.strokeStyle=PAL.gray;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(cx,cy-9);ctx.quadraticCurveTo(cx+4,cy-20,B[0],B[1]);ctx.stroke();
      ctx.save();ctx.translate(cx,cy);ctx.fillStyle='#e7c99a';ctx.beginPath();ctx.roundRect(-4.5,-11,9,20,4);ctx.fill();if(bs)bs.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(-4.5,-8+i*4.5,9,2.4);});ctx.restore();}
    else{leg(ctx,A,B);const ang=Math.atan2(B[1]-A[1],B[0]-A[0]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;ctx.save();ctx.translate(mx,my);ctx.rotate(ang);ctx.fillStyle='#e7c99a';ctx.beginPath();ctx.roundRect(-13,-4.5,26,9,4);ctx.fill();
      if(bs)bs.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(-9+i*5.2,-4.5,2.6,9);});ctx.restore();}
    pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);if(p.lab)txt(ctx,p.lab,(A[0]+B[0])/2,Math.min(A[1],B[1])-(d<34?32:9),PAL.slateDark,8);break;}
  case 'led':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-10,rgb=p.rgb||'239,68,68';leg(ctx,A,[mx-2,my]);leg(ctx,B,[mx+2,my]);
    if(lit){const g=ctx.createRadialGradient(mx,my,2,mx,my,26);g.addColorStop(0,`rgba(${rgb},0.95)`);g.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(mx,my,26,0,7);ctx.fill();}
    ctx.fillStyle=`rgba(${rgb},${lit?1:0.75})`;ctx.beginPath();ctx.arc(mx,my,6.5,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1;ctx.stroke();
    pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);ctx.fillStyle='#b91c1c';ctx.font='700 9px system-ui';ctx.textAlign='center';ctx.fillText('+',A[0]+(A[0]<=B[0]?-6:6),A[1]-4);break;}
  case 'ecap':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-12;leg(ctx,A,[mx-2,my+4]);leg(ctx,B,[mx+2,my+4]);ctx.fillStyle='#1d4ed8';ctx.beginPath();ctx.roundRect(mx-7,my-9,14,15,3);ctx.fill();
    const sx=B[0]>=A[0]?mx+3:mx-7;ctx.fillStyle=PAL.ink2;ctx.fillRect(sx,my-9,4,15);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);if(p.lab)txt(ctx,p.lab,mx,my-12,'#1e3a8a',8);break;}
  case 'ccap':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-9;leg(ctx,A,[mx,my]);leg(ctx,B,[mx,my]);ctx.fillStyle=PAL.orangeDark;ctx.beginPath();ctx.ellipse(mx,my,6,5,0,0,7);ctx.fill();pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);if(p.lab)txt(ctx,p.lab,mx,my-8,'#9a3412',8);break;}
  case 'diode':{leg(ctx,A,B);const ang=Math.atan2(B[1]-A[1],B[0]-A[0]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;ctx.save();ctx.translate(mx,my);ctx.rotate(ang);ctx.fillStyle=PAL.chipDark;ctx.fillRect(-10,-4,20,8);ctx.fillStyle=PAL.grayLight;ctx.fillRect(5,-4,3,8);ctx.restore();pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);break;}
  case 'buz':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-4;pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.arc(mx,my,11,0,7);ctx.fill();ctx.strokeStyle=PAL.slate;ctx.beginPath();ctx.arc(mx,my,4,0,7);ctx.stroke();break;}
  case 'ldr':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-8;leg(ctx,A,[mx-2,my]);leg(ctx,B,[mx+2,my]);ctx.fillStyle=PAL.orangeSoft;ctx.beginPath();ctx.arc(mx,my,6.5,0,7);ctx.fill();ctx.strokeStyle='#7c2d12';ctx.lineWidth=1.2;ctx.beginPath();for(let i=0;i<5;i++){ctx.lineTo(mx-4+i*2,my+(i%2?-2:2));}ctx.stroke();pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);break;}
  case 'btn':{const x1=HP('e'+p.col)[0],x2=HP('e'+(p.col+2))[0];['e','f'].forEach(r=>{pin(ctx,x1,BB.rows[r]);pin(ctx,x2,BB.rows[r]);});ctx.fillStyle=PAL.chip;ctx.fillRect(x1-2,BB.rows.e-4,x2-x1+4,BB.rows.f-BB.rows.e+8);ctx.fillStyle='#4b5563';ctx.beginPath();ctx.arc((x1+x2)/2,213,7,0,7);ctx.fill();break;}
  case 'chip':{const n=p.n/2,xl=HP('e'+p.col)[0]-5,xr=HP('e'+(p.col+n-1))[0]+5;for(let i=0;i<n;i++){pin(ctx,HP('e'+(p.col+i))[0],BB.rows.e);pin(ctx,HP('e'+(p.col+i))[0],BB.rows.f);}
    ctx.fillStyle=PAL.chipDark;ctx.fillRect(xl,BB.rows.e+2,xr-xl,BB.rows.f-BB.rows.e-4);ctx.fillStyle=PAL.grayLight;ctx.beginPath();ctx.arc(xl,213,4,-Math.PI/2,Math.PI/2);ctx.fill();
    ctx.fillStyle='#d1d5db';ctx.font='700 8px system-ui';ctx.textAlign='center';ctx.fillText(p.lab,(xl+xr)/2,216);break;}
  case 'seg7':{const xl=HP('e'+p.col)[0]-6,xr=HP('e'+(p.col+4))[0]+6;for(let i=0;i<5;i++){pin(ctx,HP('e'+(p.col+i))[0],BB.rows.e);pin(ctx,HP('e'+(p.col+i))[0],BB.rows.f);}
    ctx.fillStyle='#0a0a0a';ctx.fillRect(xl,BB.rows.d+6,xr-xl,BB.rows.g-BB.rows.d-12);const segs=lit?(p.show==='DYN'?DIGITS[1+Math.floor((T&&T.t||performance.now()/1000)*0.6)%6]:p.show==='CNT'?DIGITS[(p.place?Math.floor(Math.floor(performance.now()/1000*1.5)%100/10):Math.floor(performance.now()/1000*1.5)%10)]:p.show==='CNT'?DIGITS[(p.place?Math.floor(Math.floor(performance.now()/1000*1.5)%100/10):Math.floor(performance.now()/1000*1.5)%10)]:p.show==='CNT'?DIGITS[(p.place?Math.floor(Math.floor(performance.now()/1000*1.5)%100/10):Math.floor(performance.now()/1000*1.5)%10)]:(p.show||'abcdefg')):'';
    const ox=xl+16,oy=BB.rows.d+9,s=0.28;ctx.save();ctx.translate(ox,oy);ctx.scale(s,s);const G={a:[10,0,40,8],g:[10,49,40,8],d:[10,98,40,8],f:[2,8,8,41],b:[50,8,8,41],e:[2,57,8,41],c:[50,57,8,41]};
    Object.entries(G).forEach(([k,[x,y,w,h]])=>{ctx.fillStyle=segs.includes(k)?PAL.bad:'#2a1416';ctx.fillRect(x,y,w,h);});ctx.restore();break;}
  case 'bar':{const xl=HP('e'+p.col)[0]-6,xr=HP('e'+(p.col+9))[0]+6;for(let i=0;i<10;i++){pin(ctx,HP('e'+(p.col+i))[0],BB.rows.e);pin(ctx,HP('e'+(p.col+i))[0],BB.rows.f);}
    ctx.fillStyle=PAL.chip;ctx.fillRect(xl,BB.rows.d+6,xr-xl,BB.rows.g-BB.rows.d-12);const n=lit?4+((performance.now()/1000)%6<3?0:2):0;
    for(let i=0;i<10;i++){const x=HP('e'+(p.col+i))[0],on=i<n,red=p.cols[i]==='r';ctx.fillStyle=on?(red?PAL.bad:PAL.green):(red?'#3b1d1d':'#14301f');if(on){ctx.shadowBlur=10;ctx.shadowColor=red?PAL.bad:PAL.green;}ctx.fillRect(x-4,BB.rows.d+10,8,BB.rows.g-BB.rows.d-20);ctx.shadowBlur=0;}
    txt(ctx,p.lab||'DC10RG',(xl+xr)/2,BB.rows.d+3,PAL.muted,8);break;}
  case 'sil':{const n=Math.round((B[0]-A[0])/BB.dx)+1;for(let i=0;i<n;i++)pin(ctx,A[0]+i*BB.dx,A[1]);ctx.fillStyle=PAL.chip;ctx.beginPath();ctx.roundRect(A[0]-6,A[1]-17,B[0]-A[0]+12,12,3);ctx.fill();
    ctx.strokeStyle=PAL.muted2;for(let i=0;i<n;i++){ctx.beginPath();ctx.moveTo(A[0]+i*BB.dx,A[1]-5);ctx.lineTo(A[0]+i*BB.dx,A[1]);ctx.stroke();}
    ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.arc(A[0],A[1]-11,2.2,0,7);ctx.fill();txt(ctx,p.lab||'',(A[0]+B[0])/2+4,A[1]-8,PAL.grayLight,8);break;}
  case 'xtal':{leg(ctx,A,B);const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;ctx.fillStyle=PAL.ink2;ctx.beginPath();ctx.roundRect(mx-12,my-5,24,10,5);ctx.fill();ctx.strokeStyle=PAL.muted2;ctx.lineWidth=1;ctx.stroke();txt(ctx,'32k',mx,my+3,PAL.slateDark,7);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);break;}
  case 'npn':{const pts=[HP(p.c),HP(p.b),HP(p.e)];pts.forEach(q=>pin(ctx,q[0],q[1]));const x=pts[1][0],y=pts[1][1]-12;ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.arc(x,y+4,11,Math.PI,0);ctx.lineTo(x+11,y+8);ctx.lineTo(x-11,y+8);ctx.closePath();ctx.fill();
    pts.forEach(q=>leg(ctx,q,[q[0]*0.6+x*0.4,y+8]));ctx.fillStyle=PAL.gray;ctx.font='600 7px system-ui';ctx.textAlign='center';ctx.fillText(p.lab||'C B E',x,y+3);break;}
  case 'pot':{const pts=p.h.map(HP);pts.forEach(q=>pin(ctx,q[0],q[1]));const x=pts[1][0],y=pts[1][1]-6;ctx.fillStyle=PAL.blueDark;ctx.fillRect(x-14,y-10,28,18);ctx.fillStyle='#f8fafc';ctx.beginPath();ctx.arc(x,y-1,6,0,7);ctx.fill();ctx.strokeStyle=PAL.blueDark;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-3,y-1);ctx.lineTo(x+3,y-1);ctx.stroke();break;}
  case 'batt':{const [x,y]=p.at,up=y<98,ty=up?y+38:y-5;ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.roundRect(x,y,70,38,5);ctx.fill();ctx.fillStyle=PAL.yellowSoft;ctx.fillRect(x,up?y+29:y,70,9);txt(ctx,p.lab||'9 V',x+35,up?y+20:y+28,PAL.white,13);
    ctx.fillStyle=PAL.gray;ctx.fillRect(x+16,ty,10,5);ctx.fillRect(x+44,ty,10,5);const wy=up?ty+5:ty;
    partOn(ctx,{t:'wire',a:[x+21,wy],b:p.plus,c:PAL.redDark,freeA:1},lit,T);partOn(ctx,{t:'wire',a:[x+49,wy],b:p.minus,c:'#111',freeA:1},lit,T);break;}
  case 'pm':{ctx.fillStyle=PAL.chip;ctx.fillRect(16,98,40,232);ctx.fillStyle=PAL.grayLight;ctx.fillRect(18,190,22,26);txt(ctx,'USB',29,207,'#111',7);txt(ctx,'5V',36,170,lit?'#4ade80':PAL.muted,10);ctx.fillStyle=lit?PAL.green:PAL.slateDark;ctx.beginPath();ctx.arc(36,150,4,0,7);ctx.fill();break;}
  case 'box':{const [x,y]=p.at;ctx.fillStyle=p.col||PAL.slateDark;ctx.beginPath();ctx.roundRect(x,y,p.w,p.h,6);ctx.fill();txt(ctx,p.lab,x+p.w/2,y+(p.ly||16),PAL.white,p.fs||11);
    if(p.lit&&lit){const [gx,gy]=p.lit.at;const g=ctx.createRadialGradient(gx,gy,1,gx,gy,22);g.addColorStop(0,p.lit.c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(gx,gy,22,0,7);ctx.fill();}
    (p.pins||[]).forEach(q=>{const from=[x+q.dx,y+q.dy];ctx.fillStyle=PAL.ink2;ctx.beginPath();ctx.arc(from[0],from[1],2.5,0,7);ctx.fill();if(q.n)txt(ctx,q.n,from[0],from[1]+(q.dy>=p.h?12:-5),PAL.ink,8);
      if(q.to&&(q.s===undefined||(T&&T.has(q.s))||T===null))partOn(ctx,{t:'wire',a:from,b:q.to,c:q.c||'#a3a3a3',freeA:1},lit,T);});break;}
  case 'note':{txt(ctx,p.txt,p.at[0],p.at[1],p.c||PAL.ink,p.fs||11,p.al||'center');break;}
  case 'cell':{const [x,y]=p.at;ctx.fillStyle='#0f766e';ctx.beginPath();ctx.roundRect(x,y,110,30,8);ctx.fill();ctx.fillStyle=PAL.muted;ctx.fillRect(x+110,y+9,6,12);txt(ctx,'18650  +',x+60,y+19,PAL.white,11);break;}
  }}
// wire colours used by the layouts and the builder
const W_R=PAL.redDark,W_B='#111',W_G=PAL.greenDark,W_Y=PAL.gold,W_O=PAL.orangeDark,W_U=PAL.blueDark,W_P=PAL.purple;

// ===== Circuits page: shared code (loaded before projects/*.js) =====

let CT=0;
const cv=id=>{const c=$(id),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);return ctx;};
function boxChip(ctx,x,y,w,h,name,pins){__PR(ctx,{t:'chip',x,y,w,h});ctx.fillStyle=PAL.chip;ctx.fillRect(x,y,w,h);ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.strokeRect(x,y,w,h);txt(ctx,name,x+w/2,y+h/2+5,PAL.ink,13);
  (pins||[]).forEach(([n,px,py,al])=>txt(ctx,n,px,py,PAL.muted,10,al||'center'));}
const vis=id=>{const r=$(id).getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;};

// ===== Circuit menu: show only the selected project =====
sectionMenu('circuits-menu',{first:'cintro'});

// ===== 7-segment drawing (same as the Real parts page) =====
const GEO7={a:['h',10,50,6],g:['h',10,50,55],d:['h',10,50,104],f:['v',6,10,51],b:['v',54,10,51],e:['v',6,59,100],c:['v',54,59,100]};
function seg7(ctx,k){const [t,p1,p2,p3]=GEO7[k];ctx.beginPath();
  if(t==='h'){ctx.moveTo(p1,p3);ctx.lineTo(p1+5,p3-5);ctx.lineTo(p2-5,p3-5);ctx.lineTo(p2,p3);ctx.lineTo(p2-5,p3+5);ctx.lineTo(p1+5,p3+5);}
  else{ctx.moveTo(p1,p2);ctx.lineTo(p1+5,p2+5);ctx.lineTo(p1+5,p3-5);ctx.lineTo(p1,p3);ctx.lineTo(p1-5,p3-5);ctx.lineTo(p1-5,p2+5);}ctx.closePath();}
function digitBig(ctx,x,y,s,segs,on,dp){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#111';ctx.fillRect(-10,-8,90,126);
  Object.keys(GEO7).concat(['dp']).forEach(k=>{const lit=on&&(k==='dp'?dp:segs.includes(k));ctx.shadowBlur=lit?14:0;ctx.shadowColor=PAL.bad;ctx.fillStyle=lit?PAL.bad:'#2a1416';
    if(k==='dp'){ctx.beginPath();ctx.arc(68,104,5,0,7);}else seg7(ctx,k);ctx.fill();ctx.shadowBlur=0;});ctx.restore();}

// ===== Wiring step checklists =====
document.querySelectorAll('.cl-content section').forEach(sec=>{const ol=sec.querySelector('.wsteps');if(!ol)return;const prog=sec.querySelector('.wprog'),rst=sec.querySelector('.wreset');
  const boxes=[...ol.querySelectorAll('input[type=checkbox]')];
  const upd=()=>{const n=boxes.filter(b=>b.checked).length;prog.textContent=n+' / '+boxes.length+(n===boxes.length?' ✓ done!':'');prog.className='wprog'+(n===boxes.length?' ok':'');
    boxes.forEach(b=>b.closest('li').classList.toggle('done',b.checked));const next=boxes.find(b=>!b.checked);boxes.forEach(b=>b.closest('li').classList.toggle('next',b===next));};
  boxes.forEach(b=>b.addEventListener('change',upd));rst.onclick=()=>{boxes.forEach(b=>b.checked=false);upd();};upd();});


// layouts: s = step that adds the part (0 = always), until = step that removes it
const BBL={};   // filled by projects/<id>.js
function renderBB(id,ctx,T,t){const L=BBL[id];if(!L)return;ctx.clearRect(0,0,BB.W,BB.H);const done=T===null;
  if(!L.noBoard)drawBoard(ctx);
  const lit=done||(L.power&&T.has(L.power));
  let next=null;if(!done){for(let k=1;k<=40;k++){if(!T.has(k)){next=k;break;}}}
  L.parts.forEach(p=>{const shown=done?!(p.until):(p.s===0||T.has(p.s))&&!(p.until&&T.has(p.until));const ghost=!done&&!shown&&p.s===next&&!(p.until&&T.has(p.until));
    if(done&&p.until)return;if(!shown&&!ghost)return;
    ctx.save();if(ghost)ctx.globalAlpha=0.38;
    let pl=lit;if(p.t==='led'){if(p.litOff)pl=false;if(p.grp){const f=1+Math.floor(t*0.6)%6;pl=lit&&({A:[1,3,5],B:[2,3,4,5,6],C:[4,5,6],D:[6]})[p.grp].includes(f);}if(p.chase!==undefined)pl=lit&&Math.floor(t*4)%10===p.chase;if(p.blink)pl=lit&&(((t%0.7)<0.35)!==(p.blink===2));}
    partOn(ctx,p,pl,done?null:T);ctx.restore();
    if(ghost){const pts=[p.a,p.b].filter(h=>h&&typeof h==='string').map(HP);if(p.t==='btn'||p.t==='chip'||p.t==='seg7'||p.t==='bar')pts.push(HP('e'+p.col));if(p.t==='npn')pts.push(HP(p.b));if(p.t==='pot')pts.push(HP(p.h[1]));
      ctx.strokeStyle=PAL.amber;ctx.lineWidth=2;pts.forEach(q=>{ctx.beginPath();ctx.arc(q[0],q[1],6+2*Math.sin(t*6),0,7);ctx.stroke();});}});
  if(!done&&next&&L.parts.some(p=>p.s===next))txt(ctx,'step '+next+' = glowing outline',BB.W-12,L.noBoard?380:92,PAL.amber,11,'right');
  if(lit)txt(ctx,done?'✓ finished and powered':'⚡ powered',BB.W-12,L.noBoard?400:(done?92:80),PAL.good,12,'right');}

// ----- helpers shared by the project demos -----
const MZ={t:0,ac:null};
function mAC(){MZ.ac=MZ.ac||new (window.AudioContext||window.webkitAudioContext)();if(MZ.ac.state==='suspended')MZ.ac.resume();return MZ.ac;}
function mLed(ctx,x,y,on,rgb){glowAt(ctx,x,y,on?0.9:0,rgb,30);ctx.fillStyle=`rgba(${rgb},${on?1:0.25})`;ctx.beginPath();ctx.arc(x,y,9,0,7);ctx.fill();ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.stroke();}
function mRes(ctx,x1,y1,x2,y2,lab){W(ctx,[[x1,y1],[x2,y2]],WIRE,2.5);const mx=(x1+x2)/2,my=(y1+y2)/2,v=Math.abs(y2-y1)>Math.abs(x2-x1);ctx.fillStyle=PAL.canvas;ctx.strokeStyle=WIRE;ctx.lineWidth=2;ctx.beginPath();if(v)ctx.rect(mx-7,my-16,14,32);else ctx.rect(mx-16,my-7,32,14);ctx.fill();ctx.stroke();if(lab)txt(ctx,lab,v?mx+12:mx,v?my+4:my-12,PAL.muted,11,v?'left':'center');}
function mGraph(ctx,x,y,w,h,series,lo,hi,label){ctx.fillStyle=PAL.panel;ctx.fillRect(x,y,w,h);ctx.strokeStyle=PAL.line;ctx.strokeRect(x,y,w,h);
  series.forEach(([arr,col,dash])=>{ctx.strokeStyle=col;ctx.lineWidth=2;ctx.setLineDash(dash||[]);ctx.beginPath();arr.forEach((v,i)=>{const px=x+i/(arr.length-1||1)*w,py=y+h-(v-lo)/(hi-lo)*h;i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.stroke();ctx.setLineDash([]);});
  if(label)txt(ctx,label,x+6,y+14,PAL.muted,11,'left');}
// ----- a scrolling chart of values over the last few seconds (the demos' oscilloscope) -----
// mScope(ctx, x, y, w, h, {title, span (s), lo, hi, unit, refs:[[value, label]], note, lanes,
//   traces:[{f: t => value  or  rec: mRec(), col, lab, lo, hi}]})
// f(t) is computed for t from CT − span to CT (demos that follow the page clock). A demo with its own state pushes
// its values every frame with mRecPush(rec, value). lanes: one band per trace (on/off signals, each with its own lo/hi).
function mRec(){return {d:[]};}
function mRecPush(R,v){const d=R.d;if(d.length&&CT-d[d.length-1][0]>0.5)d.length=0;d.push([CT,v]);while(d.length&&d[0][0]<CT-30)d.shift();}
const mFmt=(v,u)=>{const a=Math.abs(v);if(u==='V'&&a>0&&a<1)return Math.round(v*1000)+' mV';if(u==='mA'&&a>=1000)return +(v/1000).toPrecision(2)+' A';return +v.toFixed(a>=10||a===0||Number.isInteger(v)?0:1)+(u?' '+u:'');};
function mScope(ctx,x,y,w,h,o){const span=o.span||3,L=o.lanes?78:48,top=y+20,bot=y+h-16,px0=x+L,pw=w-L-10,n=o.traces.length;
  ctx.fillStyle=PAL.panel;ctx.fillRect(x,y,w,h);ctx.strokeStyle=PAL.line;ctx.lineWidth=1;ctx.strokeRect(x+0.5,y+0.5,w-1,h-1);
  if(o.title)txt(ctx,o.title,x+8,y+14,PAL.ink2,11,'left');
  if(!o.lanes){let lx=x+w-8;[...o.traces].reverse().forEach(tr=>{if(!tr.lab)return;ctx.font='11px system-ui';const tw=ctx.measureText(tr.lab).width;txt(ctx,tr.lab,lx,y+14,tr.col,11,'right');lx-=tw+14;});}
  for(let q=0;q<=4;q++){const gx=px0+pw*q/4;ctx.strokeStyle='rgba(148,163,184,.12)';ctx.beginPath();ctx.moveTo(gx,top);ctx.lineTo(gx,bot);ctx.stroke();}
  txt(ctx,'−'+span+' s',px0,y+h-4,PAL.muted2,9,'left');txt(ctx,'now',px0+pw,y+h-4,PAL.muted2,9,'right');if(o.note)txt(ctx,o.note,px0+pw/2,y+h-4,PAL.muted,9);
  o.traces.forEach((tr,i)=>{const bt=o.lanes?top+(bot-top)*i/n:top,bb=o.lanes?top+(bot-top)*(i+1)/n-4:bot,lo=tr.lo??o.lo,hi=tr.hi??o.hi,Y=v=>bb-(v-lo)/(hi-lo)*(bb-bt);
    if(o.lanes){txt(ctx,tr.lab||'',x+8,(bt+bb)/2+4,tr.col,11,'left');ctx.strokeStyle='rgba(148,163,184,.2)';ctx.beginPath();ctx.moveTo(px0,bb);ctx.lineTo(px0+pw,bb);ctx.stroke();}
    else if(i===0){[lo,hi].concat(lo<0&&hi>0?[0]:[]).forEach(v=>{const yy=Y(v);ctx.strokeStyle=v===0?'rgba(148,163,184,.35)':'rgba(148,163,184,.15)';ctx.beginPath();ctx.moveTo(px0,yy);ctx.lineTo(px0+pw,yy);ctx.stroke();txt(ctx,mFmt(v,o.unit),px0-5,yy+3,PAL.muted2,9,'right');});
      (o.refs||[]).forEach(([v,lab])=>{const yy=Y(v);ctx.setLineDash([4,4]);ctx.strokeStyle=PAL.amber;ctx.beginPath();ctx.moveTo(px0,yy);ctx.lineTo(px0+pw,yy);ctx.stroke();ctx.setLineDash([]);
        txt(ctx,mFmt(v,o.unit),px0-5,yy+3,PAL.amber,9,'right');if(lab)txt(ctx,lab,px0+4,yy-3,PAL.amber,9,'left');});}
    ctx.save();ctx.beginPath();ctx.rect(px0,bt-3,pw,bb-bt+6);ctx.clip();ctx.strokeStyle=tr.col;ctx.lineWidth=2;ctx.lineJoin='round';ctx.beginPath();
    let started=false,k=0;const d=tr.rec&&tr.rec.d;
    for(let c=0;c<=pw;c++){const t=CT-span+span*c/pw;let v;
      if(tr.f)v=t<0?null:tr.f(t);else{while(k<d.length-1&&d[k+1][0]<=t)k++;v=d.length&&d[k][0]<=t?d[k][1]:null;}
      if(v==null||isNaN(v)){started=false;continue;}const yy=Y(Math.max(lo-(hi-lo)*0.05,Math.min(hi+(hi-lo)*0.05,v)));if(started)ctx.lineTo(px0+c,yy);else{ctx.moveTo(px0+c,yy);started=true;}}
    ctx.stroke();ctx.restore();});}
// the 555 astable: capacitor voltage (pins 2 and 6) and output (pin 3) at time t. th, tl: high and low times (s)
function m555(t,th,tl,vcc){const p=((t%(th+tl))+(th+tl))%(th+tl),tc=th/Math.LN2,td=tl/Math.LN2;
  return p<th?{vc:vcc-(vcc*2/3)*Math.exp(-p/tc),out:vcc-1.7}:{vc:(vcc*2/3)*Math.exp(-(p-th)/td),out:0.1};}
// a DC motor seen from the end (projects 23, 24, 25)
function motorDraw(ctx,x,y,ang,col){ctx.fillStyle=PAL.chipLight;ctx.beginPath();ctx.arc(x,y,46,0,7);ctx.fill();ctx.strokeStyle=PAL.muted2;ctx.lineWidth=3;ctx.stroke();
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle=col||PAL.yellow;ctx.fillRect(-4,-40,8,40);ctx.beginPath();ctx.moveTo(4,-40);ctx.lineTo(26,-34);ctx.lineTo(4,-26);ctx.fill();ctx.restore();
  ctx.fillStyle=PAL.grayLight;ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill();txt(ctx,'M',x-30,y+36,PAL.ink2,13);}


// ===== Dice without Arduino (13-15): shared demo; each project file calls ddInit(id) =====
// ===== Dice without Arduino: interactive demos =====
const DD={};
const DD_GROUPS={};   // each dice project adds its own: DD_GROUPS.pNN={cols,map}
function ddInit(id){const b=$('ddb_'+id);if(!b)return;DD[id]={q:2,hold:false,acc:0,t:0,pulse:0};b.style.touchAction='none';b.style.userSelect='none';
  hold(b,on=>{DD[id].hold=on;});}
function drawDD(id,dt){const S=DD[id],G=DD_GROUPS[id],ctx=cv('dd_'+id);S.t+=dt;if(S.hold){S.acc+=dt;S.pulse+=dt;if(S.acc>0.05){S.acc=0;S.q=(S.q+1)%6;}}
  // 555 + 4017 column
  ctx.fillStyle=PAL.chip;ctx.fillRect(20,40,90,60);txt(ctx,'555',65,66,PAL.ink,14);txt(ctx,S.hold?'pulsing':'stopped',65,86,S.hold?PAL.good:PAL.muted,11);
  if(S.hold){ctx.strokeStyle=PAL.yellow;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=40;i++){const x=24+i*2,y=((i+Math.floor(S.t*40))%8<4)?112:124;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
  txt(ctx,'button: '+(S.hold?'HELD':'released'),65,150,S.hold?PAL.good:PAL.muted,11);
  ctx.fillStyle=PAL.chip;ctx.fillRect(140,30,80,240);txt(ctx,'CD4017',180,50,PAL.ink,12);
  const ry=i=>78+i*32;
  for(let i=0;i<6;i++){const on=i===S.q;ctx.fillStyle=on?PAL.yellow:PAL.slateDark;ctx.beginPath();ctx.arc(205,ry(i),6,0,7);ctx.fill();txt(ctx,'Q'+i,170,ry(i)+4,on?PAL.yellow:PAL.muted,11);
    W(ctx,[[211,ry(i)],[250,ry(i)]],on?PAL.yellow:PAL.slate,on?3:1.5);}
  txt(ctx,'Q6 → reset',180,262,PAL.redSoft,10);
  // matrix
  const n=G.cols.length,mx0=270,mw=id==='p14'?300:240,cw=mw/n;
  G.cols.forEach((name,j)=>{const x=mx0+cw*(j+0.5);const active=G.map[S.q].includes(j);W(ctx,[[x,64],[x,270]],active?PAL.good:PAL.slate,active?3:1.5);txt(ctx,name,x,56,active?PAL.good:PAL.muted,11);});
  for(let i=0;i<6;i++){W(ctx,[[250,ry(i)],[mx0+mw,ry(i)]],i===S.q?PAL.yellow:PAL.slateDark,i===S.q?2:1);G.map[i].forEach(j=>{const x=mx0+cw*(j+0.5),y=ry(i),on=i===S.q;ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/2);
    ctx.fillStyle=on?PAL.yellow:PAL.canvas;ctx.strokeStyle=on?PAL.yellow:PAL.muted;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-6,-6);ctx.lineTo(6,0);ctx.lineTo(-6,6);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(6,-6);ctx.lineTo(6,6);ctx.stroke();ctx.restore();});}
  txt(ctx,id==='p13'?'11 diodes (↔ needs none: one output)':id==='p14'?'27 diodes = a tiny ROM':'9 diodes = binary encoder',mx0+mw/2,290,PAL.muted,11);
  // result
  const rx=id==='p14'?600:540,face=S.q+1;
  if(id==='p13'){ctx.fillStyle='#f8fafc';ctx.beginPath();ctx.roundRect(rx+40,70,170,170,24);ctx.fill();
    const P={1:[[1,1]],2:[[0,0],[2,2]],3:[[0,0],[1,1],[2,2]],4:[[0,0],[2,0],[0,2],[2,2]],5:[[0,0],[2,0],[1,1],[0,2],[2,2]],6:[[0,0],[2,0],[0,1],[2,1],[0,2],[2,2]]}[face];
    for(let gx=0;gx<3;gx++)for(let gy=0;gy<3;gy++){const x=rx+75+gx*50,y=105+gy*50,on=P.some(([a,b])=>a===gx&&b===gy);if(on){glowAt(ctx,x,y,0.9,'239,68,68',26);}ctx.fillStyle=on?PAL.bad:PAL.ink;ctx.beginPath();ctx.arc(x,y,13,0,7);ctx.fill();ctx.strokeStyle=PAL.ink2;ctx.stroke();}
    txt(ctx,S.hold?'rolling…':'result: '+face,rx+125,270,S.hold?PAL.yellow:PAL.good,16);}
  else{if(id==='p15'){ctx.fillStyle=PAL.chip;ctx.fillRect(rx,110,70,80);txt(ctx,'CD4511',rx+35,146,PAL.ink,11);txt(ctx,'bits '+[(face>>2)&1,(face>>1)&1,face&1].join(''),rx+35,166,PAL.yellow,11);W(ctx,[[rx-28,150],[rx,150]],PAL.good,3);}
    digitBig(ctx,id==='p15'?rx+100:rx+20,50,1.6,DIGITS[face],true,false);
    txt(ctx,S.hold?'rolling…':'result: '+face,id==='p15'?rx+160:rx+80,270,S.hold?PAL.yellow:PAL.good,16);
    if(id==='p14')txt(ctx,'(segments via 2.2 kΩ)',rx+80,290,PAL.muted,10);}}

// the page clock (seconds) used by several demos; registered before the project loops, so it ticks first
loop(dt=>{CT+=dt;});

// ===== p1: breadboard layout =====
BBL.p1={power:6,parts:[{s:2,t:'res',a:'tp8',b:'a10',v:470},{s:3,t:'led',a:'c10',b:'c13'},{s:4,t:'wire',a:'a13',b:'tn13',c:W_B},{s:5,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]};

(function(){   // demo
// P1 LED brightness
function P1(){const ctx=cv('cp1'),vals=[220,470,1000,10000],k=Math.floor(CT/2.2)%4,R=vals[k],I=7/R*1000;
  part(ctx,'batt',80,60,80,200,{label:'9 V',left:true});wire(ctx,[[80,60],[220,60]]);part(ctx,'res',220,60,340,60,{label:fmtOhm(R),lc:Y});wire(ctx,[[340,60],[460,60],[460,95]]);
  part(ctx,'led',460,95,460,175,{glow:Math.min(1,Math.sqrt(I/20))});wire(ctx,[[460,175],[460,200],[80,200]]);dots(ctx,[[80,180],[80,60],[460,60],[460,200],[80,200]],CT*I*3);
  txt(ctx,'I = 7 V ÷ '+fmtOhm(R)+' = '+(I<10?I.toFixed(1):I.toFixed(0))+' mA',620,120,Y,15);txt(ctx,'(cycling through the 4 resistors)',620,145,PAL.muted,11);}
// chart: the current over time, a step each time the resistor changes
function G1(){const ctx=$('cp1').getContext('2d'),vals=[220,470,1000,10000];
  mScope(ctx,15,258,770,108,{title:'LED current over time (a new resistor every 2.2 s)',span:9,lo:0,hi:35,unit:'mA',refs:[[20,'20 mA: a normal LED current']],
    traces:[{f:t=>7/vals[Math.floor(t/2.2)%4]*1000,col:PAL.redSoft,lab:'LED current'}]});}
loop((dt,now)=>{if(vis('cp1')){P1(dt);G1();}});
})();

// ===== p10: breadboard layout =====
BBL.p10={power:8,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:1,t:'chip',col:30,n:8,lab:'LM386'},
  {s:2,t:'wire',a:'j33',b:'bn33',c:W_B},{s:2,t:'wire',a:'j31',b:'bn31',c:W_B},{s:2,t:'wire',a:'a32',b:'tp32',c:W_R},{s:3,t:'ecap',a:'tp27',b:'tn27',lab:'100µ'},
  {s:4,t:'pot',h:['a20','a21','a22']},{s:4,t:'wire',a:'b22',b:'tn22',c:W_B},{s:4,t:'wire',a:'c21',b:'h32',c:W_Y},
  {s:5,t:'ecap',a:'a33',b:'a40',lab:'220µ'},{s:5,t:'box',at:[520,8],w:90,h:56,lab:'🔊 8 Ω',col:PAL.chipLight,ly:32,fs:13,pins:[{n:'red',dx:25,dy:56,to:'b40',c:W_R},{n:'black',dx:65,dy:56,to:'tn42',c:W_B}]},
  {s:6,t:'res',a:'c33',b:'c45',v:10},{s:6,t:'ccap',a:'b45',b:'tn46',lab:'47n'},
  {s:7,t:'box',at:[150,8],w:100,h:50,lab:'audio jack',col:'#4b5563',ly:28,pins:[{n:'tip',dx:30,dy:50,to:'b20',c:W_Y},{n:'sleeve',dx:75,dy:50,to:'tn18',c:W_B}]},
  {s:8,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]};

(function(){   // demo
// P10 mini amp
function P10(){const ctx=cv('cp10'),w=Math.sin(CT*12)*0.5+Math.sin(CT*31)*0.3;
  txt(ctx,'🎸 / 📱',50,135,PAL.white,18);wire(ctx,[[80,130],[150,130]]);part(ctx,'pot',150,130,230,130,{label:'volume 10k'});wire(ctx,[[230,130],[300,130]]);
  boxChip(ctx,300,80,120,110,'LM386',[['3',296,134,'right'],['5',424,134,'left'],['6',360,76],['4',360,204]]);wire(ctx,[[360,30],[360,80]],PAL.redSoft);wire(ctx,[[360,190],[360,230]],PAL.blue);txt(ctx,'+9 V',372,40,PAL.redSoft,11,'left');
  wire(ctx,[[420,130],[470,130]]);part(ctx,'cap',470,130,550,130,{label:'220 µF'});wire(ctx,[[550,130],[600,130]]);
  ctx.fillStyle=PAL.ink2;ctx.fillRect(600,115,14,30);ctx.beginPath();ctx.moveTo(614,115);ctx.lineTo(640+w*4,95);ctx.lineTo(640+w*4,165);ctx.lineTo(614,145);ctx.fill();
  ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.globalAlpha=0.7-i*0.2;ctx.beginPath();ctx.arc(650,130,20+i*16+(CT*30)%16,-0.6,0.6);ctx.stroke();}ctx.globalAlpha=1;
  wire(ctx,[[607,145],[607,230],[60,230]],PAL.blue);txt(ctx,'8 Ω',580,170,PAL.muted,11);}
// chart: the same wave, 20 times bigger (slowed right down: a real note repeats hundreds of times per second)
function G10(){const ctx=$('cp10').getContext('2d'),w=t=>(Math.sin(t*12)*0.5+Math.sin(t*31)*0.3)/0.8;
  mScope(ctx,15,250,770,132,{title:'the same wave, 20 × bigger at the output (each lane has its own scale)',span:2,lanes:true,note:'slowed down',
    traces:[{f:t=>0.1*w(t),col:PAL.sky,lab:'in: ± 0.1 V',lo:-0.12,hi:0.12},{f:t=>4.5+2*w(t),col:Y,lab:'pin 5: 4.5 ± 2 V',lo:2,hi:7},{f:t=>2*w(t),col:PAL.green,lab:'speaker: ± 2 V',lo:-2.4,hi:2.4}]});}
loop((dt,now)=>{if(vis('cp10')){P10(dt);G10();}});
})();

// ===== p11: breadboard layout =====
BBL.p11={power:6,parts:[{s:1,t:'pm',until:4},{s:2,t:'btn',col:8,until:4},{s:2,t:'wire',a:'tp8',b:'a8',c:W_R,until:4},
  {s:2,t:'box',at:[300,8],w:110,h:56,lab:'active buzzer',col:PAL.chipDark,ly:30,until:4,pins:[{n:'S',dx:20,dy:56,to:'j10',c:W_Y},{n:'+',dx:55,dy:56,to:'tp20',c:W_R},{n:'−',dx:90,dy:56,to:'tn22',c:W_B}]},
  {s:4,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:4,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:4,t:'chip',col:20,n:8,lab:'NE555'},{s:4,t:'wire',a:'d20',b:'tp20',c:W_R},{s:4,t:'wire',a:'j23',b:'bp23',c:W_R},{s:4,t:'wire',a:'j20',b:'bn20',c:W_B},
  {s:4,t:'res',a:'c20',b:'c21',v:1000},{s:4,t:'res',a:'b21',b:'b22',v:47000,lab:'trim'},{s:4,t:'wire',a:'a22',b:'j21',c:W_U},{s:4,t:'ccap',a:'i21',b:'bn21',lab:'47n'},
  {s:5,t:'ecap',a:'h22',b:'h28',lab:'10µ'},{s:5,t:'buz',a:'g28',b:'g31'},{s:5,t:'wire',a:'j31',b:'bn31',c:W_B},{s:6,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]};

(function(){   // demo
// ===== P11 Buzzer =====
const BZ={type:0,drv:0,pressed:false,osc:null,ac:null,g:null,clickT:-9,ph:0};
choices('bzType',['Active buzzer','Passive buzzer / piezo'],0,i=>{BZ.type=i;bzSound();});
choices('bzDrv',['Push button (steady DC)','555 oscillator','Arduino tone()'],0,i=>{BZ.drv=i;bzSound();});
function bzFreq(){const v=+$('bzF').value;return Math.pow(10,v);}
$('bzF').addEventListener('input',()=>{bzSound();});
function bzMode(){// returns {f, mode:'tone'|'click'|'pattern'|'none'}
  if(!BZ.pressed)return {mode:'none'};
  if(BZ.type===0){if(BZ.drv===0)return {mode:'tone',f:2400};if(BZ.drv===1)return {mode:'pattern',f:2400};return {mode:'tone',f:2400};}
  if(BZ.drv===0)return {mode:'click'};return {mode:'tone',f:bzFreq()};}
function bzClick(){try{BZ.ac=BZ.ac||new (window.AudioContext||window.webkitAudioContext)();const ac=BZ.ac,o=ac.createOscillator(),g=ac.createGain();o.type='square';o.frequency.value=180;g.gain.setValueAtTime(0.12,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.0001,ac.currentTime+0.04);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+0.05);}catch(e){}BZ.clickT=CT;}
function bzSound(){const m=bzMode();try{
  if(m.mode==='tone'||m.mode==='pattern'){BZ.ac=BZ.ac||new (window.AudioContext||window.webkitAudioContext)();
    if(!BZ.osc){BZ.osc=BZ.ac.createOscillator();BZ.g=BZ.ac.createGain();BZ.osc.type='square';BZ.g.gain.value=0.05;BZ.osc.connect(BZ.g);BZ.g.connect(BZ.ac.destination);BZ.osc.start();}
    BZ.osc.frequency.value=m.f;}
  else if(BZ.osc){BZ.osc.stop();BZ.osc=null;}}catch(e){}}
const bzb=$('bzBtn');bzb.style.touchAction='none';bzb.style.userSelect='none';
bzb.addEventListener('pointerdown',e=>{e.preventDefault();BZ.pressed=true;if(BZ.type===1&&BZ.drv===0)bzClick();bzSound();});
['pointerup','pointerleave','pointercancel'].forEach(ev=>bzb.addEventListener(ev,()=>{if(!BZ.pressed)return;BZ.pressed=false;if(BZ.type===1&&BZ.drv===0)bzClick();bzSound();}));
function buzzerSym(ctx,x,y,active,vib){ctx.save();ctx.translate(x,y);ctx.fillStyle=PAL.chipDark;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,0,26,0,7);ctx.fill();ctx.stroke();
  ctx.strokeStyle=active?PAL.yellow:PAL.muted;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,14+vib*3,0,7);ctx.stroke();
  txt(ctx,active?'ACT':'PZ',0,4,PAL.muted,9);ctx.restore();}
function P11(dt){const ctx=cv('cp11'),m=bzMode(),f=BZ.type===0?2400:bzFreq();$('bzFt').textContent=BZ.type===0&&BZ.drv!==2?'fixed ~2.4 kHz':Math.round(bzFreq())+' Hz';
  if(BZ.osc&&m.mode==='pattern'){const on=(CT%0.6)<0.3;BZ.g.gain.value=on?0.05:0;}
  else if(BZ.osc)BZ.g.gain.value=0.05;
  const sounding=m.mode==='tone'||(m.mode==='pattern'&&(CT%0.6)<0.3),clickNow=CT-BZ.clickT<0.12;BZ.ph+=dt*(sounding?40:0);
  const T=50,B=250;
  if(BZ.drv===0){part(ctx,'batt',70,T,70,B,{label:'9 V',left:true});wire(ctx,[[70,T],[160,T]]);part(ctx,'switch',160,T,240,T,{closed:BZ.pressed,label:'button'});wire(ctx,[[240,T],[330,T],[330,124]]);wire(ctx,[[330,176],[330,B],[70,B]]);
    txt(ctx,'+',345,120,PAL.redSoft,13);}
  else if(BZ.drv===1){wire(ctx,[[40,T],[400,T]],PAL.redSoft);wire(ctx,[[40,B],[400,B]],PAL.blue);txt(ctx,'+9 V',36,T+4,PAL.redSoft,11,'right');txt(ctx,'0 V',36,B+4,PAL.blue,11,'right');
    __PR(ctx,{t:'chip',x:90,y:95,w:100,h:110});ctx.fillStyle=PAL.chip;ctx.fillRect(90,95,100,110);ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.strokeRect(90,95,100,110);txt(ctx,'NE555',140,148,PAL.ink,13);txt(ctx,BZ.type?'tone':'beep pattern',140,166,PAL.muted,10);
    wire(ctx,[[140,T],[140,95]]);wire(ctx,[[140,205],[140,B]]);part(ctx,'switch',60,T,60,B,{closed:BZ.pressed});
    wire(ctx,[[190,150],[230,150]]);part(ctx,'cap',230,150,290,150,{label:'10 µF'});wire(ctx,[[290,150],[330,150],[330,124]]);wire(ctx,[[330,176],[330,B]]);txt(ctx,'pin 3',196,142,PAL.muted,10,'left');}
  else{ctx.fillStyle='#0e7490';ctx.fillRect(60,90,120,120);txt(ctx,'Arduino',120,140,PAL.white,14);txt(ctx,BZ.type?'tone(8, f)':'digitalWrite(8,HIGH)',120,160,'#cffafe',10);
    wire(ctx,[[180,130],[220,130]]);part(ctx,'res',220,130,290,130,{label:'100 Ω'});wire(ctx,[[290,130],[330,130],[330,124]]);wire(ctx,[[330,176],[330,B],[120,B],[120,210]],PAL.blue);txt(ctx,'pin 8',186,122,PAL.muted,10,'left');txt(ctx,'GND',126,226,PAL.blue,10,'left');}
  const vib=sounding?Math.sin(BZ.ph*6):clickNow?1:0;buzzerSym(ctx,330,150,BZ.type===0,vib);
  // sound waves
  if(sounding||clickNow){ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;for(let i=0;i<4;i++){const r=(clickNow&&!sounding)?20+i*10:24+i*16+((BZ.ph*4)%16);ctx.globalAlpha=clickNow&&!sounding?0.6-i*0.15:0.7-i*0.15;ctx.beginPath();ctx.arc(330,150,r+20,-0.6,0.6);ctx.stroke();}ctx.globalAlpha=1;}
  // signal graph
  const gx=470,gw=310;ctx.fillStyle=PAL.raised;ctx.fillRect(gx,40,gw,90);txt(ctx,'push on the buzzer',gx+4,34,PAL.muted,11,'left');
  ctx.strokeStyle=Y;ctx.lineWidth=2;ctx.beginPath();const show=BZ.type===0?40:Math.min(40,f/60);
  for(let px=0;px<=gw;px++){let v=0;if(BZ.pressed){if(BZ.drv===0)v=1;else{const ph=(px/gw*show)%1;v=ph<0.5?1:0;if(BZ.type===0&&BZ.drv===1)v=1;}}const yy=120-v*70;px?ctx.lineTo(gx+px,yy):ctx.moveTo(gx+px,yy);}ctx.stroke();
  let msg,col;
  if(!BZ.pressed){msg='Hold the button…';col=PAL.muted;}
  else if(m.mode==='click'){msg='Steady DC on a passive buzzer: just a click, no tone ✗';col=Y;}
  else if(m.mode==='pattern'){msg='Active buzzer switched on/off by the 555: beep… beep…';col=PAL.good;}
  else if(BZ.type===0){msg='Active buzzer: its own oscillator beeps at a fixed pitch ✓';col=PAL.good;}
  else{msg='Passive buzzer plays the square wave: '+Math.round(f)+' Hz ✓';col=PAL.good;}
  wrapText(ctx,msg,gx,170,gw,20,col,14);
  if(BZ.type===0&&BZ.drv===0)txt(ctx,'(steady DC in, the buzzer makes the wave inside)',gx,235,PAL.muted,11,'left');}
loop((dt,now)=>{if(vis('cp11'))P11(dt);});
})();

// ===== p12: breadboard layout =====
BBL.p12={power:9,parts:[{s:1,t:'wire',a:'tn3',b:'bn3',c:W_B},
  {s:1,t:'box',at:[30,4],w:230,h:72,lab:'Arduino Uno / ONE-C',col:'#0e7490',ly:20,pins:[{n:'GND',dx:12,dy:72,to:'bn1',c:W_B},
    {n:'D2',dx:34,dy:72,to:'a2',s:4,c:W_G},{n:'D3',dx:52,dy:72,to:'a6',s:4,c:W_G},{n:'D7',dx:70,dy:72,to:'a10',s:4,c:W_G},{n:'D8',dx:88,dy:72,to:'a14',s:4,c:W_G},
    {n:'D6',dx:106,dy:72,to:'j2',s:5,c:W_U},{n:'D5',dx:124,dy:72,to:'j6',s:5,c:W_U},{n:'D4',dx:142,dy:72,to:'j10',s:5,c:W_U},{n:'D9',dx:160,dy:72,to:'j14',s:5,c:W_U},
    {n:'D10',dx:182,dy:72,to:'a40',s:8,c:W_O},{n:'D11',dx:202,dy:72,to:'a42',s:8,c:W_O},{n:'D12',dx:222,dy:72,to:'a56',s:9,c:W_P}]},
  {s:2,t:'seg7',col:20,show:'abgcd'},{s:2,t:'seg7',col:30,show:'afgcd'},
  ...[['a20','a30'],['b21','b31'],['a23','a33'],['b24','b34'],['j20','j30'],['i21','i31'],['j23','j33'],['i24','i34']].map(([a,b])=>({s:3,t:'wire',a,b,c:W_Y})),
  ...[[2,5,'d23'],[6,9,'d24'],[10,13,'d21'],[14,17,'d20']].flatMap(([k,e,d])=>[{s:4,t:'res',a:'b'+k,b:'b'+e,v:330},{s:4,t:'wire',a:'c'+e,b:d,c:W_G}]),
  ...[[2,5,'h20'],[6,9,'h21'],[10,13,'h23'],[14,17,'h24']].flatMap(([k,e,d])=>[{s:5,t:'res',a:'i'+k,b:'i'+e,v:330},{s:5,t:'wire',a:'h'+e,b:d,c:W_U}]),
  {s:6,t:'npn',c:'c45',b:'c46',e:'c47'},{s:6,t:'npn',c:'c50',b:'c51',e:'c52'},{s:6,t:'wire',a:'a47',b:'tn47',c:W_B},{s:6,t:'wire',a:'a52',b:'tn52',c:W_B},
  {s:7,t:'wire',a:'i22',b:'e45',c:W_P},{s:7,t:'wire',a:'i32',b:'e50',c:W_P},
  {s:8,t:'res',a:'b40',b:'b46',v:1000},{s:8,t:'res',a:'d42',b:'d51',v:1000},{s:9,t:'btn',col:56},{s:9,t:'wire',a:'j58',b:'bn58',c:W_B}]};

(function(){   // demo
// ===== 12. Digital dice demo =====
const DC={v:[6,6],rolling:false,acc:0,wait:0.02,mode:0,t:0};
choices('dcMode',['Two dice','One die','Total (2–12)'],0,i=>DC.mode=i);
$('dcRoll').onclick=()=>{if(!DC.rolling){DC.rolling=true;DC.wait=0.02;DC.acc=0;}};
function drawDice(dt){DC.t+=dt;if(DC.rolling){DC.acc+=dt;if(DC.acc>=DC.wait){DC.acc=0;DC.v=[1+Math.floor(Math.random()*6),1+Math.floor(Math.random()*6)];DC.wait+=0.015;if(DC.wait>=0.26)DC.rolling=false;}}
  const ctx=cv('cdice'),slow=$('dcSlow').checked,act=Math.floor(DC.t/0.45)%2;
  let d1,d2;const sum=DC.v[0]+DC.v[1];
  if(DC.mode===0){d1=DC.v[0];d2=DC.v[1];}else if(DC.mode===1){d1=null;d2=DC.v[1];}else{d1=sum>=10?1:null;d2=sum%10;}
  const show=i=>!slow||act===i;
  digitBig(ctx,130,30,1.7,d1===null?'':DIGITS[d1],show(0),DC.rolling);digitBig(ctx,300,30,1.7,DIGITS[d2],show(1),DC.rolling);
  txt(ctx,'display 1',190,262,PAL.muted,11);txt(ctx,'display 2',360,262,PAL.muted,11);
  npnQ(ctx,180,300,show(0));npnQ(ctx,350,300,show(1));txt(ctx,'D10',140,304,PAL.muted,10,'right');txt(ctx,'D11',310,304,PAL.muted,10,'right');
  if(slow)txt(ctx,'only display '+(act+1)+' is ON right now',275,22,Y,13);
  const rx=520;txt(ctx,DC.rolling?'rolling…':DC.mode===2?'total':'result',rx+130,70,PAL.muted,13);
  txt(ctx,DC.rolling?'🎲 🎲':DC.mode===0?DC.v[0]+' + '+DC.v[1]+' = '+sum:DC.mode===1?String(DC.v[1]):String(sum),rx+130,120,DC.rolling?Y:PAL.good,DC.rolling?30:34);
  if(!DC.rolling&&DC.mode===0&&DC.v[0]===DC.v[1])txt(ctx,'Doubles! 🎉',rx+130,160,Y,16);
  txt(ctx,slow?'4 ms per display, slowed down ×100':'each display ON 4 ms, then the other',rx+130,215,PAL.muted,12);
  txt(ctx,'→ ~125 swaps per second: looks steady',rx+130,235,PAL.muted,12);}

// ===== 12. Schematic =====
function drawP12(){const ctx=cv('cp12');const ay=[120,136,152,168,184,200,216,232],segs=['a','b','c','d','e','f','g','dp'],pins=[7,6,4,2,1,9,10,5];
  ctx.fillStyle='#0e7490';ctx.fillRect(30,30,120,320);txt(ctx,'Arduino',90,60,PAL.white,15);txt(ctx,'Uno / ONE-C',90,78,'#cffafe',10);
  ay.forEach((y,i)=>{txt(ctx,'D'+(i+2),146,y+4,'#cffafe',10,'right');W(ctx,[[150,y],[190,y]],PAL.ink2,2);ctx.fillStyle=BG;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=1.5;ctx.fillRect(190,y-5,34,10);ctx.strokeRect(190,y-5,34,10);
    W(ctx,[[224,y],[700,y]],PAL.redSoft,2);txt(ctx,segs[i],300,y-3,PAL.redLight,10);});
  txt(ctx,'8 × 330 Ω',207,108,PAL.ink,11);
  [[400,'display 1',270,'D10'],[580,'display 2',300,'D11']].forEach(([dx,l,ry,dn],k)=>{
    ctx.fillStyle='#1a1a1a';ctx.fillRect(dx,8,110,84);ctx.strokeStyle=PAL.slate;ctx.strokeRect(dx,8,110,84);
    digitBig(ctx,dx+8,14,0.6,DIGITS[k?5:3],true,false);txt(ctx,l,dx+80,40,PAL.muted,10);txt(ctx,'SC39-11',dx+80,54,PAL.muted,9);
    ay.forEach((y,i)=>{const x=dx+8+i*11;W(ctx,[[x,92],[x,y]],PAL.muted,1.2);dot(ctx,x,y);txt(ctx,String(pins[i]),x,103,PAL.muted2,8);});
    const cx=dx+100;W(ctx,[[cx,92],[cx,251]],PAL.blue,2);txt(ctx,'COM',cx+4,104,PAL.blue,9,'left');
    npnQ(ctx,cx-10,285,true);W(ctx,[[cx,319],[cx,365]],PAL.blue,2);
    // base drive
    txt(ctx,dn,146,ry+4,'#cffafe',10,'right');
    if(!k){W(ctx,[[150,ry],[250,ry]],PAL.ink2,2);ctx.fillStyle=BG;ctx.fillRect(250,ry-5,34,10);ctx.strokeRect(250,ry-5,34,10);W(ctx,[[284,ry],[cx-54,ry],[cx-54,285],[cx-44,285]],PAL.ink2,2);}
    else{W(ctx,[[150,ry],[330,ry]],PAL.ink2,2);ctx.fillStyle=BG;ctx.fillRect(330,ry-5,34,10);ctx.strokeRect(330,ry-5,34,10);W(ctx,[[364,ry],[380,ry],[380,345],[cx-54,345],[cx-54,285],[cx-44,285]],PAL.ink2,2);}
  });
  txt(ctx,'1 kΩ',267,262,PAL.ink,10);txt(ctx,'1 kΩ',347,292,PAL.ink,10);
  W(ctx,[[90,350],[90,365],[700,365]],PAL.blue,2);txt(ctx,'GND',710,369,PAL.blue,11,'left');
  txt(ctx,'D12',146,334,'#cffafe',10,'right');W(ctx,[[150,330],[175,330]],PAL.ink2,2);part(ctx,'switch',175,330,245,330,{});W(ctx,[[245,330],[245,365]],PAL.ink2,2);dot(ctx,245,365);txt(ctx,'button',210,355,PAL.muted,10);}
drawP12();
loop((dt,now)=>{if(vis('cdice'))drawDice(dt);});
})();

// ===== p13: breadboard layout =====
BBL.p13={"power": 11, "dice": "face", "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "chip", "col": 4, "n": 8, "lab": "555"}, {"s": 2, "t": "wire", "a": "d4", "b": "tp4", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "j4", "b": "bn4", "c": "#111"}, {"s": 3, "t": "res", "a": "c4", "b": "c5", "v": 1000}, {"s": 3, "t": "res", "a": "b5", "b": "b6", "v": 47000}, {"s": 3, "t": "wire", "a": "a6", "b": "i5", "c": PAL.blueDark}, {"s": 3, "t": "ccap", "a": "h5", "b": "bn6", "lab": "10n"}, {"s": 4, "t": "btn", "col": 9}, {"s": 4, "t": "wire", "a": "tp9", "b": "a9", "c": PAL.redDark}, {"s": 4, "t": "wire", "a": "i11", "b": "i7", "c": PAL.purple}, {"s": 4, "t": "res", "a": "h7", "b": "bn8", "v": 10000}, {"s": 5, "t": "chip", "col": 14, "n": 16, "lab": "CD4017"}, {"s": 5, "t": "wire", "a": "d14", "b": "tp14", "c": PAL.redDark}, {"s": 5, "t": "wire", "a": "j21", "b": "bn21", "c": "#111"}, {"s": 5, "t": "wire", "a": "d17", "b": "tn17", "c": "#111"}, {"s": 5, "t": "wire", "a": "c15", "b": "j18", "c": PAL.orangeDark}, {"s": 5, "t": "wire", "a": "g6", "b": "c16", "c": PAL.gold}, {"s": 6, "t": "diode", "a": "g16", "b": "f24"}, {"s": 6, "t": "diode", "a": "g17", "b": "g24"}, {"s": 6, "t": "diode", "a": "a20", "b": "h24"}, {"s": 7, "t": "diode", "a": "g15", "b": "f28"}, {"s": 7, "t": "diode", "a": "h17", "b": "g28"}, {"s": 7, "t": "diode", "a": "g20", "b": "h28"}, {"s": 7, "t": "wire", "a": "i28", "b": "i29", "c": PAL.gold}, {"s": 7, "t": "diode", "a": "b20", "b": "f29"}, {"s": 7, "t": "diode", "a": "g14", "b": "g29"}, {"s": 8, "t": "diode", "a": "h20", "b": "f33"}, {"s": 8, "t": "diode", "a": "c20", "b": "g33"}, {"s": 8, "t": "diode", "a": "h14", "b": "h33"}, {"s": 8, "t": "wire", "a": "i14", "b": "f37", "c": PAL.purple}, {"s": 9, "t": "npn", "c": "c23", "b": "c24", "e": "c25"}, {"s": 9, "t": "npn", "c": "c28", "b": "c29", "e": "c30"}, {"s": 9, "t": "npn", "c": "c32", "b": "c33", "e": "c34"}, {"s": 9, "t": "npn", "c": "c36", "b": "c37", "e": "c38"}, {"s": 9, "t": "wire", "a": "a25", "b": "tn25", "c": "#111"}, {"s": 9, "t": "wire", "a": "a30", "b": "tn30", "c": "#111"}, {"s": 9, "t": "wire", "a": "a34", "b": "tn34", "c": "#111"}, {"s": 9, "t": "wire", "a": "a38", "b": "tn38", "c": "#111"}, {"s": 9, "t": "res", "a": "i24", "b": "d24", "v": 10000}, {"s": 9, "t": "res", "a": "j29", "b": "d29", "v": 10000}, {"s": 9, "t": "res", "a": "i33", "b": "d33", "v": 10000}, {"s": 9, "t": "res", "a": "i37", "b": "d37", "v": 10000}, {"s": 10, "t": "res", "a": "tp45", "b": "a45", "v": 470}, {"s": 10, "t": "res", "a": "tp46", "b": "a46", "v": 470}, {"s": 10, "t": "res", "a": "tp48", "b": "a48", "v": 470}, {"s": 10, "t": "res", "a": "tp50", "b": "a50", "v": 470}, {"s": 10, "t": "led", "a": "e45", "b": "f45", "grp": "A"}, {"s": 10, "t": "led", "a": "e46", "b": "f46", "grp": "B"}, {"s": 10, "t": "led", "a": "e47", "b": "f47", "grp": "B"}, {"s": 10, "t": "led", "a": "e48", "b": "f48", "grp": "C"}, {"s": 10, "t": "led", "a": "e49", "b": "f49", "grp": "C"}, {"s": 10, "t": "led", "a": "e50", "b": "f50", "grp": "D"}, {"s": 10, "t": "led", "a": "e51", "b": "f51", "grp": "D"}, {"s": 10, "t": "wire", "a": "j46", "b": "a47", "c": PAL.gold}, {"s": 10, "t": "wire", "a": "j48", "b": "a49", "c": PAL.gold}, {"s": 10, "t": "wire", "a": "j50", "b": "a51", "c": PAL.gold}, {"s": 10, "t": "wire", "a": "j45", "b": "b23", "c": PAL.orangeDark}, {"s": 10, "t": "wire", "a": "j47", "b": "b28", "c": PAL.orangeDark}, {"s": 10, "t": "wire", "a": "j49", "b": "b32", "c": PAL.orangeDark}, {"s": 10, "t": "wire", "a": "j51", "b": "b36", "c": PAL.orangeDark}, {"s": 11, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};

// demo: the shared dice machinery is in lib.js
DD_GROUPS.p13={cols:['centre','↘','↙','↔'],map:[[0],[1],[0,1],[1,2],[0,1,2],[1,2,3]]};
ddInit('p13');
loop((dt,now)=>{if(DD.p13&&vis('dd_p13'))drawDD('p13',dt);});

// ===== p14: breadboard layout =====
BBL.p14={"power": 12, "dice": "seg", "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "chip", "col": 4, "n": 8, "lab": "555"}, {"s": 2, "t": "wire", "a": "d4", "b": "tp4", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "j4", "b": "bn4", "c": "#111"}, {"s": 3, "t": "res", "a": "c4", "b": "c5", "v": 1000}, {"s": 3, "t": "res", "a": "b5", "b": "b6", "v": 47000}, {"s": 3, "t": "wire", "a": "a6", "b": "i5", "c": PAL.blueDark}, {"s": 3, "t": "ccap", "a": "h5", "b": "bn6", "lab": "10n"}, {"s": 4, "t": "btn", "col": 9}, {"s": 4, "t": "wire", "a": "tp9", "b": "a9", "c": PAL.redDark}, {"s": 4, "t": "wire", "a": "i11", "b": "i7", "c": PAL.purple}, {"s": 4, "t": "res", "a": "h7", "b": "bn8", "v": 10000}, {"s": 5, "t": "chip", "col": 14, "n": 16, "lab": "CD4017"}, {"s": 5, "t": "wire", "a": "d14", "b": "tp14", "c": PAL.redDark}, {"s": 5, "t": "wire", "a": "j21", "b": "bn21", "c": "#111"}, {"s": 5, "t": "wire", "a": "d17", "b": "tn17", "c": "#111"}, {"s": 5, "t": "wire", "a": "c15", "b": "j18", "c": PAL.orangeDark}, {"s": 5, "t": "wire", "a": "g6", "b": "c16", "c": PAL.gold}, {"s": 6, "t": "wire", "a": "j15", "b": "a23", "c": PAL.purple}, {"s": 6, "t": "wire", "a": "j17", "b": "a25", "c": PAL.purple}, {"s": 6, "t": "wire", "a": "d20", "b": "j26", "c": PAL.purple}, {"s": 6, "t": "wire", "a": "j14", "b": "a27", "c": PAL.purple}, {"s": 6, "t": "wire", "a": "j34", "b": "j35", "c": PAL.gold}, {"s": 6, "t": "wire", "a": "j43", "b": "j44", "c": PAL.gold}, {"s": 7, "t": "diode", "a": "g15", "b": "f30"}, {"s": 7, "t": "diode", "a": "g17", "b": "g30"}, {"s": 7, "t": "diode", "a": "a20", "b": "h30"}, {"s": 7, "t": "diode", "a": "g14", "b": "i30"}, {"s": 7, "t": "diode", "a": "g16", "b": "f32"}, {"s": 7, "t": "diode", "a": "h15", "b": "g32"}, {"s": 7, "t": "diode", "a": "h17", "b": "h32"}, {"s": 7, "t": "diode", "a": "g20", "b": "i32"}, {"s": 8, "t": "diode", "a": "h16", "b": "f34"}, {"s": 8, "t": "diode", "a": "i17", "b": "g34"}, {"s": 8, "t": "diode", "a": "h20", "b": "h34"}, {"s": 8, "t": "diode", "a": "b20", "b": "i34"}, {"s": 8, "t": "diode", "a": "h14", "b": "f35"}, {"s": 8, "t": "diode", "a": "i15", "b": "f37"}, {"s": 8, "t": "diode", "a": "b25", "b": "g37"}, {"s": 8, "t": "diode", "a": "c20", "b": "h37"}, {"s": 8, "t": "diode", "a": "i14", "b": "i37"}, {"s": 9, "t": "diode", "a": "b23", "b": "f39"}, {"s": 9, "t": "diode", "a": "b27", "b": "g39"}, {"s": 9, "t": "diode", "a": "i20", "b": "f41"}, {"s": 9, "t": "diode", "a": "f26", "b": "g41"}, {"s": 9, "t": "diode", "a": "c27", "b": "h41"}, {"s": 9, "t": "diode", "a": "c23", "b": "f43"}, {"s": 9, "t": "diode", "a": "c25", "b": "g43"}, {"s": 9, "t": "diode", "a": "j20", "b": "h43"}, {"s": 9, "t": "diode", "a": "g26", "b": "i43"}, {"s": 9, "t": "diode", "a": "d27", "b": "f44"}, {"s": 10, "t": "seg7", "col": 52, "show": "DYN"}, {"s": 10, "t": "wire", "a": "j54", "b": "bn54", "c": "#111"}, {"s": 11, "t": "res", "a": "j30", "b": "c55", "v": 2200}, {"s": 11, "t": "res", "a": "j32", "b": "b56", "v": 2200}, {"s": 11, "t": "res", "a": "i35", "b": "h55", "v": 2200}, {"s": 11, "t": "res", "a": "j37", "b": "i53", "v": 2200}, {"s": 11, "t": "res", "a": "j39", "b": "g52", "v": 2200}, {"s": 11, "t": "res", "a": "j41", "b": "c53", "v": 2200}, {"s": 11, "t": "res", "a": "i44", "b": "b52", "v": 2200}, {"s": 12, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};

// demo: the shared dice machinery is in lib.js
DD_GROUPS.p14={cols:'abcdefg'.split(''),map:['bc','abdeg','abcdg','bcfg','acdfg','acdefg'].map(s=>s.split('').map(ch=>'abcdefg'.indexOf(ch)))};
ddInit('p14');
loop((dt,now)=>{if(DD.p14&&vis('dd_p14'))drawDD('p14',dt);});

// ===== p15: breadboard layout =====
BBL.p15={"power": 12, "dice": "seg", "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "chip", "col": 4, "n": 8, "lab": "555"}, {"s": 2, "t": "wire", "a": "d4", "b": "tp4", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "j4", "b": "bn4", "c": "#111"}, {"s": 3, "t": "res", "a": "c4", "b": "c5", "v": 1000}, {"s": 3, "t": "res", "a": "b5", "b": "b6", "v": 47000}, {"s": 3, "t": "wire", "a": "a6", "b": "i5", "c": PAL.blueDark}, {"s": 3, "t": "ccap", "a": "h5", "b": "bn6", "lab": "10n"}, {"s": 4, "t": "btn", "col": 9}, {"s": 4, "t": "wire", "a": "tp9", "b": "a9", "c": PAL.redDark}, {"s": 4, "t": "wire", "a": "i11", "b": "i7", "c": PAL.purple}, {"s": 4, "t": "res", "a": "h7", "b": "bn8", "v": 10000}, {"s": 5, "t": "chip", "col": 14, "n": 16, "lab": "CD4017"}, {"s": 5, "t": "wire", "a": "d14", "b": "tp14", "c": PAL.redDark}, {"s": 5, "t": "wire", "a": "j21", "b": "bn21", "c": "#111"}, {"s": 5, "t": "wire", "a": "d17", "b": "tn17", "c": "#111"}, {"s": 5, "t": "wire", "a": "c15", "b": "j18", "c": PAL.orangeDark}, {"s": 5, "t": "wire", "a": "g6", "b": "c16", "c": PAL.gold}, {"s": 6, "t": "diode", "a": "g16", "b": "f24"}, {"s": 6, "t": "diode", "a": "g17", "b": "g24"}, {"s": 6, "t": "diode", "a": "a20", "b": "h24"}, {"s": 6, "t": "diode", "a": "g15", "b": "f27"}, {"s": 6, "t": "diode", "a": "h17", "b": "g27"}, {"s": 6, "t": "diode", "a": "g14", "b": "h27"}, {"s": 6, "t": "diode", "a": "g20", "b": "f30"}, {"s": 6, "t": "diode", "a": "b20", "b": "g30"}, {"s": 6, "t": "diode", "a": "h14", "b": "h30"}, {"s": 7, "t": "res", "a": "i24", "b": "bn24", "v": 10000}, {"s": 7, "t": "res", "a": "i27", "b": "bn27", "v": 10000}, {"s": 7, "t": "res", "a": "i30", "b": "bn30", "v": 10000}, {"s": 8, "t": "chip", "col": 34, "n": 16, "lab": "CD4511"}, {"s": 8, "t": "wire", "a": "d34", "b": "tp34", "c": PAL.redDark}, {"s": 8, "t": "wire", "a": "j41", "b": "bn41", "c": "#111"}, {"s": 8, "t": "wire", "a": "j36", "b": "bp36", "c": PAL.redDark}, {"s": 8, "t": "wire", "a": "j37", "b": "bp37", "c": PAL.redDark}, {"s": 8, "t": "wire", "a": "j38", "b": "bn38", "c": "#111"}, {"s": 8, "t": "wire", "a": "j39", "b": "bn39", "c": "#111"}, {"s": 9, "t": "wire", "a": "j24", "b": "i40", "c": PAL.greenDark}, {"s": 9, "t": "wire", "a": "j27", "b": "i34", "c": PAL.blueDark}, {"s": 9, "t": "wire", "a": "j30", "b": "i35", "c": PAL.purple}, {"s": 10, "t": "seg7", "col": 50, "show": "DYN"}, {"s": 10, "t": "wire", "a": "j52", "b": "bn52", "c": "#111"}, {"s": 11, "t": "res", "a": "c37", "b": "c53", "v": 1000}, {"s": 11, "t": "res", "a": "b38", "b": "b54", "v": 1000}, {"s": 11, "t": "res", "a": "d39", "b": "h53", "v": 1000}, {"s": 11, "t": "res", "a": "c40", "b": "i51", "v": 1000}, {"s": 11, "t": "res", "a": "b41", "b": "g50", "v": 1000}, {"s": 11, "t": "res", "a": "c35", "b": "c51", "v": 1000}, {"s": 11, "t": "res", "a": "b36", "b": "b50", "v": 1000}, {"s": 12, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};

// demo: the shared dice machinery is in lib.js
DD_GROUPS.p15={cols:['A (1)','B (2)','C (4)'],map:[[0],[1],[0,1],[2],[0,2],[1,2]]};
ddInit('p15');
loop((dt,now)=>{if(DD.p15&&vis('dd_p15'))drawDD('p15',dt);});

// ===== p16: breadboard layout + demo =====
BBL.p16={"power": 6, "parts": [{"s": 1, "t": "npn", "c": "c10", "b": "c11", "e": "c12"}, {"s": 1, "t": "npn", "c": "c30", "b": "c31", "e": "c32"}, {"s": 1, "t": "wire", "a": "a12", "b": "tn13", "c": "#111"}, {"s": 1, "t": "wire", "a": "a32", "b": "tn33", "c": "#111"}, {"s": 2, "t": "res", "a": "tp7", "b": "a7", "v": 470}, {"s": 2, "t": "led", "a": "b7", "b": "b10", "blink": 1}, {"s": 2, "t": "res", "a": "tp27", "b": "a27", "v": 470}, {"s": 2, "t": "led", "a": "b27", "b": "b30", "rgb": "34,197,94", "blink": 2}, {"s": 3, "t": "res", "a": "tp11", "b": "a11", "v": 47000}, {"s": 3, "t": "res", "a": "tp31", "b": "a31", "v": 47000}, {"s": 4, "t": "ecap", "a": "e10", "b": "e14", "lab": "10\u00b5"}, {"s": 4, "t": "wire", "a": "d14", "b": "d31", "c": PAL.orangeDark}, {"s": 5, "t": "ecap", "a": "e30", "b": "e26", "lab": "10\u00b5"}, {"s": 5, "t": "wire", "a": "d26", "b": "d11", "c": PAL.blueDark}, {"s": 6, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};
(function(){
// ---------- p16: flip-flop ----------
const FF={on:1,t:0,vb:[0.65,-7.8],h1:[],h2:[],acc:0};
function drawFF(dt){const c1=+$('m16c1').value*1e-6,c2=+$('m16c2').value*1e-6,R=47e3,Vb=9,ctx=cv('m16');
  // on=1 → Q1 on, Q2 off (its base recovers through 47k via C1)
  const n=4;for(let k=0;k<n;k++){const d=dt/n;if(FF.on===1){FF.vb[1]=Vb-(Vb-FF.vb[1])*Math.exp(-d/(R*c1));FF.vb[0]=0.65;if(FF.vb[1]>=0.65){FF.on=2;FF.vb[0]=0.65-(Vb-0.2);FF.vb[1]=0.65;}}
    else{FF.vb[0]=Vb-(Vb-FF.vb[0])*Math.exp(-d/(R*c2));FF.vb[1]=0.65;if(FF.vb[0]>=0.65){FF.on=1;FF.vb[1]=0.65-(Vb-0.2);FF.vb[0]=0.65;}}}
  FF.acc+=dt;if(FF.acc>0.02){FF.acc=0;FF.h1.push(FF.vb[0]);FF.h2.push(FF.vb[1]);if(FF.h1.length>180){FF.h1.shift();FF.h2.shift();}}
  const q1=FF.on===1,q2=!q1;
  // schematic
  W(ctx,[[30,30],[430,30]],PAL.bad,3);txt(ctx,'+9 V',30,22,PAL.bad,12,'left');W(ctx,[[30,280],[430,280]],PAL.muted2,3);txt(ctx,'0 V',30,296,PAL.muted,12,'left');
  [[90,q1,'239,68,68','LED 1'],[370,q2,'34,197,94','LED 2']].forEach(([x,on,rgb,l])=>{mRes(ctx,x,30,x,80,'470 Ω');W(ctx,[[x,96],[x,100]]);mLed(ctx,x,110,on,rgb);txt(ctx,l,x+(x<200?-16:16),114,PAL.ink2,11,x<200?'right':'left');W(ctx,[[x,120],[x,180]]);W(ctx,[[x,248],[x,280]]);});
  const npnM=(x,y,on)=>{ctx.save();ctx.translate(2*x,0);ctx.scale(-1,1);npnQ(ctx,x,y,on);ctx.restore();};
  npnM(100,214,q1);npnQ(ctx,360,214,q2);
  mRes(ctx,170,30,170,110,'47 kΩ');W(ctx,[[170,110],[170,214],[134,214]]);mRes(ctx,290,30,290,110,'47 kΩ');W(ctx,[[290,110],[290,214],[326,214]]);
  const cap=(x,y,lab)=>{ctx.fillStyle=PAL.canvas;ctx.fillRect(x-10,y-14,20,28);W(ctx,[[x-4,y-13],[x-4,y+13]],WIRE,3);W(ctx,[[x+4,y-13],[x+4,y+13]],WIRE,3);txt(ctx,lab,x,y-18,PAL.muted,11);};
  W(ctx,[[90,140],[290,140]]);cap(225,140,'C1');W(ctx,[[370,190],[170,190]]);cap(235,190,'C2');
  [[90,140],[290,140],[370,190],[170,190]].forEach(([x,y])=>{ctx.fillStyle=WIRE;ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill();});
  const vt=v=>(v>=0?'+':'')+v.toFixed(1)+' V';txt(ctx,vt(FF.vb[0]),150,232,FF.vb[0]<0?PAL.bad:PAL.good,12);txt(ctx,vt(FF.vb[1]),310,232,FF.vb[1]<0?PAL.bad:PAL.good,12);
  txt(ctx,q1?'Q1 ON':'Q1 off',36,266,q1?PAL.good:PAL.muted2,12,'left');txt(ctx,q2?'Q2 ON':'Q2 off',430,266,q2?PAL.good:PAL.muted2,12,'right');
  // graphs
  mGraph(ctx,460,20,320,120,[[FF.h1,PAL.bad],[FF.h1.map(()=>0.65),PAL.muted2,[4,4]]],-9,9,'Q1 base voltage (−8 … +0.6 V)');
  mGraph(ctx,460,160,320,120,[[FF.h2,PAL.green],[FF.h2.map(()=>0.65),PAL.muted2,[4,4]]],-9,9,'Q2 base voltage');
  const t1=0.69*R*c1,t2=0.69*R*c2;txt(ctx,`LED 1 on ≈ ${t1.toFixed(2)} s · LED 2 on ≈ ${t2.toFixed(2)} s`,620,298,PAL.yellow,12);}
loop((dt,now)=>{if(vis('m16'))drawFF(dt);});
})();

// ===== p17: breadboard layout + demo =====
BBL.p17={"power": 9, "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "chip", "col": 4, "n": 8, "lab": "555"}, {"s": 2, "t": "wire", "a": "d4", "b": "tp4", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "j4", "b": "bn4", "c": "#111"}, {"s": 2, "t": "wire", "a": "j7", "b": "bp7", "c": PAL.redDark}, {"s": 3, "t": "res", "a": "c4", "b": "c5", "v": 1000}, {"s": 3, "t": "res", "a": "b5", "b": "b6", "v": 47000}, {"s": 3, "t": "wire", "a": "a6", "b": "i5", "c": PAL.blueDark}, {"s": 3, "t": "ecap", "a": "h5", "b": "bn5", "lab": "10\u00b5"}, {"s": 4, "t": "res", "a": "i6", "b": "i10", "v": 470}, {"s": 4, "t": "led", "a": "h10", "b": "h13", "blink": 1}, {"s": 4, "t": "wire", "a": "j13", "b": "bn13", "c": "#111"}, {"s": 5, "t": "chip", "col": 20, "n": 8, "lab": "555"}, {"s": 5, "t": "wire", "a": "d20", "b": "tp20", "c": PAL.redDark}, {"s": 5, "t": "wire", "a": "j20", "b": "bn20", "c": "#111"}, {"s": 5, "t": "wire", "a": "j23", "b": "bp23", "c": PAL.redDark}, {"s": 6, "t": "res", "a": "c20", "b": "c21", "v": 1000}, {"s": 6, "t": "res", "a": "b21", "b": "b22", "v": 10000}, {"s": 6, "t": "wire", "a": "a22", "b": "i21", "c": PAL.blueDark}, {"s": 6, "t": "ccap", "a": "h21", "b": "bn21", "lab": "100n"}, {"s": 7, "t": "wire", "a": "h6", "b": "a14", "c": PAL.purple}, {"s": 7, "t": "res", "a": "b14", "b": "b23", "v": 10000}, {"s": 8, "t": "res", "a": "h22", "b": "h30", "v": 220}, {"s": 8, "t": "box", "at": [380, 352], "w": 130, "h": 46, "lab": "\ud83d\udd0a 8 \u03a9 speaker", "col": PAL.chipLight, "ly": 28, "pins": [{"n": "", "dx": 18, "dy": 0, "to": "j30", "c": PAL.gold}, {"n": "", "dx": 112, "dy": 0, "to": "bn32", "c": "#111"}]}, {"s": 9, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};
(function(){
// ---------- p17: siren ----------
const SR2={t:0,mode:0,f:690,osc:null,g:null,h1:[],h2:[],acc:0,play:false};
function sirTarget(){const half=0.33;const out=Math.floor(SR2.t/half)%2===0;return {out,f:out?560:880};}
function drawSiren(dt){SR2.t+=dt;const ctx=cv('m17'),T=sirTarget();if(SR2.mode===0)SR2.f=T.f;else SR2.f+=(T.f-SR2.f)*(1-Math.exp(-dt/0.18));
  if(SR2.osc)SR2.osc.frequency.setTargetAtTime(SR2.f,MZ.ac.currentTime,0.005);
  SR2.acc+=dt;if(SR2.acc>0.015){SR2.acc=0;SR2.h1.push(T.out?9:0);SR2.h2.push(SR2.f);if(SR2.h1.length>200){SR2.h1.shift();SR2.h2.shift();}}
  mGraph(ctx,20,20,560,100,[[SR2.h1,PAL.yellow]],-1,12,'555 #1 output (pin 3): 9 V ↔ 0 V, ~1.5 times per second');
  mGraph(ctx,20,150,560,120,[[SR2.h2,PAL.blue]],450,1060,'555 #2 pitch (Hz)');
  txt(ctx,'880 Hz',590,166,PAL.muted,11,'left');txt(ctx,'560 Hz',590,250,PAL.muted,11,'left');
  const x=700,y=150,k=SR2.play?Math.sin(SR2.t*SR2.f*0.05)*3:0;ctx.fillStyle=PAL.chipLight;ctx.fillRect(x-60,y-30,30,60);ctx.beginPath();ctx.moveTo(x-30,y-30);ctx.lineTo(x+10+k,y-70);ctx.lineTo(x+10+k,y+70);ctx.lineTo(x-30,y+30);ctx.closePath();ctx.fill();
  if(SR2.play)for(let i=1;i<=3;i++){ctx.strokeStyle=`rgba(96,165,250,${0.7-i*0.18})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+20,y,20+i*18+((SR2.t*60)%18),-0.7,0.7);ctx.stroke();}
  txt(ctx,Math.round(SR2.f)+' Hz',x-20,y+100,PAL.ink,16);txt(ctx,T.out?'#1 HIGH → pin 5 pulled up → low note':'#1 LOW → pin 5 pulled down → high note',300,292,PAL.yellow,12);}
$('m17play').addEventListener('click',()=>{const ac=mAC();if(SR2.play){SR2.osc.stop();SR2.osc=null;SR2.play=false;$('m17play').textContent='🔊 Play the siren';$('m17play').classList.remove('active');return;}
  SR2.osc=ac.createOscillator();SR2.osc.type='square';SR2.g=ac.createGain();SR2.g.gain.value=0.05;SR2.osc.connect(SR2.g);SR2.g.connect(ac.destination);SR2.osc.frequency.value=SR2.f;SR2.osc.start();SR2.play=true;$('m17play').textContent='⏹ Stop';$('m17play').classList.add('active');});
[['m17a',0],['m17b',1]].forEach(([id,m])=>$(id).addEventListener('click',()=>{SR2.mode=m;$('m17a').classList.toggle('active',m===0);$('m17b').classList.toggle('active',m===1);}));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&SR2.play)$('m17play').click();});
window.addEventListener('hashchange',()=>{if(SR2.play)$('m17play').click();});
loop((dt,now)=>{if(vis('m17'))drawSiren(dt);});
})();

// ===== p18: breadboard layout + demo =====
BBL.p18={"power": 8, "parts": [{"s": 1, "t": "npn", "c": "c20", "b": "c21", "e": "c22"}, {"s": 1, "t": "wire", "a": "a22", "b": "tn22", "c": "#111"}, {"s": 1, "t": "npn", "c": "c30", "b": "c31", "e": "c32"}, {"s": 1, "t": "wire", "a": "b20", "b": "b31", "c": PAL.gold}, {"s": 2, "t": "res", "a": "tp19", "b": "a20", "v": 33000}, {"s": 3, "t": "res", "a": "tp25", "b": "b26", "v": 470}, {"s": 3, "t": "pot", "h": ["a26", "a27", "a28"]}, {"s": 3, "t": "wire", "a": "c27", "b": "a30", "c": PAL.orangeDark}, {"s": 4, "t": "res", "a": "a32", "b": "tn33", "v": 1000}, {"s": 4, "t": "ecap", "a": "b32", "b": "tn34", "lab": "22\u00b5"}, {"s": 5, "t": "res", "a": "e32", "b": "e21", "v": 100000}, {"s": 6, "t": "ecap", "a": "d21", "b": "d17", "lab": "2.2\u00b5"}, {"s": 6, "t": "box", "at": [150, 22], "w": 110, "h": 40, "lab": "\ud83c\udfb8 IN jack", "col": PAL.chipLight, "ly": 24, "pins": [{"n": "tip", "dx": 22, "dy": 40, "to": "a17", "c": PAL.gold}, {"n": "sleeve", "dx": 86, "dy": 40, "to": "tn16", "c": "#111"}]}, {"s": 7, "t": "ccap", "a": "d30", "b": "d35", "lab": "10n"}, {"s": 7, "t": "box", "at": [440, 22], "w": 130, "h": 40, "lab": "OUT \u2192 Ruby amp", "col": PAL.chipLight, "ly": 24, "pins": [{"n": "tip", "dx": 20, "dy": 40, "to": "a35", "c": PAL.gold}, {"n": "sleeve", "dx": 104, "dy": 40, "to": "tn37", "c": "#111"}]}, {"s": 8, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};
(function(){
// ---------- p18: fuzz ----------
function fuzzCurve(x,fz,bias){const g=1+fz*60,off=(bias-0.5)*1.6;let y=Math.tanh(g*x+off)-Math.tanh(off);const top=1-Math.max(0,off)*0.9,bot=-1-Math.min(0,off)*0.9;y=Math.max(bot*0.95,Math.min(top*0.95,y));return y;}
const FZ={t:0,phase:'clean',pt:9};
function drawFuzz(dt){FZ.t+=dt;FZ.pt+=dt;const ctx=cv('m18'),fz=+$('m18f').value,bs=+$('m18b').value;
  const N=300,inp=[],out=[];for(let i=0;i<N;i++){const tt=i/N*1.2,env=Math.exp(-tt*2.2)*0.6;const v=env*(Math.sin(tt*2*Math.PI*6)+0.3*Math.sin(tt*2*Math.PI*12));inp.push(v);out.push(fuzzCurve(v,fz,bs));}
  mGraph(ctx,20,20,470,250,[[inp,PAL.blue],[out,PAL.orange]],-1.1,1.1,'one note: in (blue) → out (orange)');
  if(FZ.pt<1.6){const x=20+Math.min(1,FZ.pt/1.6)*470;ctx.strokeStyle=PAL.highlight;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,20);ctx.lineTo(x,270);ctx.stroke();}
  const cx=520,cy=20,w=250,h=250,cur=[];for(let i=0;i<=100;i++){const x=-1+i/50;cur.push(fuzzCurve(x*0.6,fz,bs));}
  mGraph(ctx,cx,cy,w,h,[[cur,PAL.orange],[cur.map((_,i)=>(-1+i/50)*0.6),PAL.muted2,[4,4]]],-1.1,1.1,'transfer curve');
  txt(ctx,'input →',cx+w-6,cy+h-6,PAL.muted,11,'right');
  const asym=Math.abs(bs-0.5);txt(ctx,fz<0.15?'Almost clean: a little warmth':asym>0.3?'Bias off-centre: thin, gated, "sputtery" fuzz':'Clipped top and bottom: thick, square-ish fuzz',255,292,PAL.yellow,12);}
function pluck(ac,dur){const sr=ac.sampleRate,n=Math.floor(sr*dur),buf=ac.createBuffer(1,n,sr),d=buf.getChannelData(0);const f=110,P=Math.round(sr/f);const ring=new Float32Array(P);for(let i=0;i<P;i++)ring[i]=Math.random()*2-1;
  for(let i=0;i<n;i++){const j=i%P,nx=(j+1)%P;const v=ring[j];ring[j]=0.996*0.5*(ring[j]+ring[nx]);d[i]=v*0.5;}return buf;}
function playFuzz(fx){const ac=mAC(),src=ac.createBufferSource();src.buffer=pluck(ac,2.2);const g=ac.createGain();g.gain.value=fx?0.12:0.35;
  if(fx){const ws=ac.createWaveShaper(),fz=+$('m18f').value,bs=+$('m18b').value,c=new Float32Array(1024);for(let i=0;i<1024;i++)c[i]=fuzzCurve((i/511.5-1)*0.6,fz,bs);ws.curve=c;ws.oversample='2x';
    const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=4500;src.connect(ws);ws.connect(lp);lp.connect(g);}else src.connect(g);
  g.connect(ac.destination);src.start();FZ.pt=0;}
$('m18c').addEventListener('click',()=>playFuzz(false));$('m18p').addEventListener('click',()=>playFuzz(true));
loop((dt,now)=>{if(vis('m18'))drawFuzz(dt);});
})();

// ===== p19: breadboard layout + demo =====
BBL.p19={"power": 13, "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "chip", "col": 3, "n": 8, "lab": "555"}, {"s": 2, "t": "wire", "a": "d3", "b": "tp3", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "j3", "b": "bn3", "c": "#111"}, {"s": 2, "t": "wire", "a": "j6", "b": "bp7", "c": PAL.redDark}, {"s": 2, "t": "res", "a": "c3", "b": "c4", "v": 1000}, {"s": 2, "t": "res", "a": "b4", "b": "b5", "v": 47000}, {"s": 2, "t": "wire", "a": "a5", "b": "i4", "c": PAL.blueDark}, {"s": 2, "t": "ecap", "a": "h4", "b": "bn4", "lab": "10\u00b5"}, {"s": 3, "t": "chip", "col": 9, "n": 16, "lab": "CD4518"}, {"s": 3, "t": "wire", "a": "d9", "b": "tp9", "c": PAL.redDark}, {"s": 3, "t": "wire", "a": "j16", "b": "bn16", "c": "#111"}, {"s": 3, "t": "wire", "a": "j10", "b": "bp10", "c": PAL.redDark}, {"s": 3, "t": "wire", "a": "a16", "b": "tn16", "c": "#111"}, {"s": 3, "t": "wire", "a": "h5", "b": "h9", "c": PAL.gold}, {"s": 4, "t": "wire", "a": "g14", "b": "b15", "c": PAL.orangeDark}, {"s": 4, "t": "wire", "a": "b10", "b": "h15", "c": PAL.purple}, {"s": 4, "t": "res", "a": "i15", "b": "bn15", "v": 10000}, {"s": 4, "t": "btn", "col": 50}, {"s": 4, "t": "wire", "a": "tp50", "b": "a50", "c": PAL.redDark}, {"s": 4, "t": "wire", "a": "i52", "b": "j15", "c": PAL.purple}, {"s": 5, "t": "chip", "col": 19, "n": 16, "lab": "CD4511"}, {"s": 5, "t": "wire", "a": "d19", "b": "tp19", "c": PAL.redDark}, {"s": 5, "t": "wire", "a": "j26", "b": "bn26", "c": "#111"}, {"s": 5, "t": "wire", "a": "j21", "b": "bp21", "c": PAL.redDark}, {"s": 5, "t": "wire", "a": "j22", "b": "bp22", "c": PAL.redDark}, {"s": 5, "t": "wire", "a": "j23", "b": "bn23", "c": "#111"}, {"s": 6, "t": "wire", "a": "a14", "b": "i25", "c": PAL.greenDark}, {"s": 6, "t": "wire", "a": "a13", "b": "i19", "c": PAL.blueDark}, {"s": 6, "t": "wire", "a": "c12", "b": "h20", "c": PAL.purple}, {"s": 6, "t": "wire", "a": "b11", "b": "h24", "c": PAL.orangeDark}, {"s": 7, "t": "seg7", "col": 28, "show": "CNT", "place": 1}, {"s": 7, "t": "wire", "a": "j30", "b": "bn31", "c": "#111"}, {"s": 8, "t": "res", "a": "a20", "b": "a29", "v": 1000}, {"s": 8, "t": "res", "a": "b21", "b": "b28", "v": 1000}, {"s": 8, "t": "res", "a": "c22", "b": "c31", "v": 1000}, {"s": 8, "t": "res", "a": "d23", "b": "d32", "v": 1000}, {"s": 8, "t": "res", "a": "a24", "b": "g31", "v": 1000}, {"s": 8, "t": "res", "a": "a25", "b": "h29", "v": 1000}, {"s": 8, "t": "res", "a": "a26", "b": "i28", "v": 1000}, {"s": 9, "t": "chip", "col": 35, "n": 16, "lab": "CD4511"}, {"s": 9, "t": "wire", "a": "d35", "b": "tp35", "c": PAL.redDark}, {"s": 9, "t": "wire", "a": "j42", "b": "bn43", "c": "#111"}, {"s": 9, "t": "wire", "a": "j37", "b": "bp37", "c": PAL.redDark}, {"s": 9, "t": "wire", "a": "j38", "b": "bp38", "c": PAL.redDark}, {"s": 9, "t": "wire", "a": "j39", "b": "bn39", "c": "#111"}, {"s": 10, "t": "wire", "a": "i11", "b": "i41", "c": PAL.greenDark}, {"s": 10, "t": "wire", "a": "i12", "b": "i35", "c": PAL.blueDark}, {"s": 10, "t": "wire", "a": "i13", "b": "i36", "c": PAL.purple}, {"s": 10, "t": "wire", "a": "h14", "b": "i40", "c": PAL.orangeDark}, {"s": 11, "t": "seg7", "col": 44, "show": "CNT", "place": 0}, {"s": 11, "t": "wire", "a": "j46", "b": "bn47", "c": "#111"}, {"s": 12, "t": "res", "a": "a36", "b": "a45", "v": 1000}, {"s": 12, "t": "res", "a": "b37", "b": "b44", "v": 1000}, {"s": 12, "t": "res", "a": "c38", "b": "c47", "v": 1000}, {"s": 12, "t": "res", "a": "d39", "b": "d48", "v": 1000}, {"s": 12, "t": "res", "a": "a40", "b": "g47", "v": 1000}, {"s": 12, "t": "res", "a": "a41", "b": "h45", "v": 1000}, {"s": 12, "t": "res", "a": "a42", "b": "i44", "v": 1000}, {"s": 13, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};
(function(){
// ---------- p19: counter ----------
const CN={n:0,acc:0,run:true,carry:0};
function cTick(){const u=CN.n%10;CN.n=(CN.n+1)%100;if(u===9)CN.carry=0.6;}
function bits(ctx,x,y,v,lab){txt(ctx,lab,x+70,y-10,PAL.muted,12);[8,4,2,1].forEach((w,i)=>{const on=(v&w)!==0;ctx.fillStyle=on?PAL.green:PAL.raised;ctx.beginPath();ctx.arc(x+i*46,y+14,13,0,7);ctx.fill();txt(ctx,String(w),x+i*46,y+19,on?'#04210f':PAL.muted2,12);txt(ctx,'Q'+(4-i),x+i*46,y+44,PAL.muted2,10);});}
function drawCnt(dt){const ctx=cv('m19'),sp=+$('m19sp').value;if(CN.run){CN.acc+=dt*sp;while(CN.acc>=1){CN.acc-=1;cTick();}}CN.carry=Math.max(0,CN.carry-dt);
  const tens=Math.floor(CN.n/10),units=CN.n%10;drawDigit(ctx,300,40,1.4,DIGITS[tens],{pad:14,glow:12});drawDigit(ctx,420,40,1.4,DIGITS[units],{pad:14,glow:12});txt(ctx,'tens',342,240,PAL.muted,12);txt(ctx,'units',462,240,PAL.muted,12);
  bits(ctx,40,70,tens,'tens counter (CD4518 B)');bits(ctx,600,70,units,'units counter (CD4518 A)');
  txt(ctx,'BCD: '+tens.toString(2).padStart(4,'0'),110,160,PAL.ink2,13);txt(ctx,'BCD: '+units.toString(2).padStart(4,'0'),670,160,PAL.ink2,13);
  if(CN.carry>0){ctx.strokeStyle=`rgba(251,191,36,${CN.carry/0.6})`;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(600,120);ctx.quadraticCurveTo(400,290,180,120);ctx.stroke();txt(ctx,'carry! Q4 of the units dropped (9 → 0) → tens +1',400,285,PAL.yellow,13);}
  else txt(ctx,'units Q4 (the "8") → tens ENABLE',400,285,PAL.muted2,12);}
$('m19run').addEventListener('click',()=>{CN.run=!CN.run;$('m19run').textContent=CN.run?'⏸ Pause':'▶ Run';$('m19run').classList.toggle('active',CN.run);});
$('m19tick').addEventListener('click',()=>{cTick();});$('m19rst').addEventListener('click',()=>{CN.n=0;CN.acc=0;});
// chart: a timing diagram of the units counter: Q1 flips at every pulse, Q2 every 2, Q3 every 4, Q4 at 8 and 9
const G19R=[0,1,2,3,4].map(()=>mRec());
function G19(){const ctx=$('m19').getContext('2d'),u=CN.n%10;mRecPush(G19R[0],CN.run&&CN.acc<0.5?1:0);[1,2,4,8].forEach((b,i)=>mRecPush(G19R[i+1],(u&b)?1:0));
  mScope(ctx,15,300,770,132,{title:'timing diagram of the units counter',span:6,lanes:true,
    traces:[{rec:G19R[0],col:Y,lab:'clock (555)',lo:0,hi:1}].concat([1,2,4,8].map((b,i)=>({rec:G19R[i+1],col:PAL.green,lab:'Q'+(i+1)+' (the '+b+')',lo:0,hi:1})))});}
loop((dt,now)=>{if(vis('m19')){drawCnt(dt);G19();}});
})();

// ===== p2: breadboard layout =====
BBL.p2={power:7,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:2,t:'btn',col:5},{s:3,t:'wire',a:'tp5',b:'a5',c:W_R},{s:4,t:'ecap',a:'j7',b:'bn8',lab:'1000µ'},{s:5,t:'res',a:'h7',b:'h15',v:470},{s:6,t:'led',a:'g15',b:'g18'},{s:6,t:'wire',a:'j18',b:'bn18',c:W_B},{s:7,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]};

(function(){   // demo
// P2 fade
const F2={vc:0};function P2(dt){const ctx=cv('cp2'),ph=CT%6,pressed=ph<1.5;F2.vc+=pressed?(1-F2.vc)*dt/0.05:-F2.vc*dt/1.5;
  part(ctx,'batt',80,60,80,210,{label:'9 V',left:true});wire(ctx,[[80,60],[150,60]]);part(ctx,'switch',150,60,230,60,{closed:pressed,label:'button'});wire(ctx,[[230,60],[480,60]]);
  part(ctx,'cap',320,60,320,210,{label:'1000 µF'});dot(ctx,320,60);dot(ctx,320,210);part(ctx,'res',480,60,480,120,{label:'470 Ω'});part(ctx,'led',480,130,480,200,{glow:F2.vc});wire(ctx,[[480,120],[480,130]]);wire(ctx,[[480,200],[480,210],[80,210]]);
  txt(ctx,pressed?'👆 button held: capacitor filling':'released: capacitor feeds the LED…',650,120,pressed?PAL.good:Y,13);
  ctx.fillStyle=PAL.raised;ctx.fillRect(250,100,12,70);ctx.fillStyle=PAL.blue;ctx.fillRect(250,100+70*(1-F2.vc),12,70*F2.vc);txt(ctx,'charge',256,186,PAL.blue,10);}
// charts: the capacitor empties slowly through the LED
const G2R={v:mRec(),i:mRec()};
function G2(){const ctx=$('cp2').getContext('2d'),vc=9*F2.vc;mRecPush(G2R.v,vc);mRecPush(G2R.i,Math.max(0,(vc-1.9)/470*1000));
  mScope(ctx,15,258,378,108,{title:'capacitor voltage',span:9,lo:0,hi:10,unit:'V',refs:[[1.9,'below ≈ 1.9 V the LED is off']],traces:[{rec:G2R.v,col:PAL.blue}]});
  mScope(ctx,407,258,378,108,{title:'LED current',span:9,lo:0,hi:16,unit:'mA',traces:[{rec:G2R.i,col:PAL.redSoft}]});}
loop((dt,now)=>{if(vis('cp2')){P2(dt);G2();}});
})();

// ===== p20: breadboard layout + demo =====
BBL.p20={power:9,parts:BBL.p12.parts.filter(p=>p.s!==9).map(p=>p.t==='box'?Object.assign({},p,{w:280,pins:p.pins.filter(q=>q.n!=='D12').concat([{n:'5V',dx:244,dy:72,to:'tp55',s:9,c:W_R},{n:'A0',dx:264,dy:72,to:'b56',s:9,c:W_Y}])}):p.t==='seg7'?Object.assign({},p,{show:p.col===20?'abged':'abgcd'}):p).concat([
  {s:9,t:'box',at:[600,10],w:160,h:50,lab:'🌡️ LM35 module',col:'#9a3412',ly:22,pins:[{n:'S',dx:30,dy:50,to:'a56',c:W_Y},{n:'Vcc',dx:80,dy:50,to:'tp57',c:W_R},{n:'Gnd',dx:130,dy:50,to:'tn58',c:W_B}]}])};   // built from p12 (p12.js loads first)
(function(){
// ---------- p20: thermometer ----------
const TH={T:22,hot:false,acc:0,shown:22,code:0,calc:22};
function drawTherm(dt){const ctx=cv('m20');TH.T+=((TH.hot?34:22)-TH.T)*(1-Math.exp(-dt/(TH.hot?3:6)));
  const ref=$('thRef').checked?1.1:5,avg=$('thAvg').checked,V=TH.T*0.01;
  TH.acc+=dt;if(TH.acc>0.5){TH.acc=0;const noise=()=>(Math.random()+Math.random()+Math.random()-1.5)*2.4;let sum=0;const n=avg?20:1;for(let i=0;i<n;i++)sum+=Math.max(0,Math.round(V/ref*1023+noise()));TH.code=sum/n;TH.calc=TH.code*ref/1023*100;TH.shown=Math.max(0,Math.min(99,Math.round(TH.calc)));}
  // thermometer
  const tx0=50,top=40,bot=230,f=Math.max(0,Math.min(1,(TH.T-10)/30));ctx.fillStyle=PAL.raised;ctx.beginPath();ctx.roundRect(tx0-10,top,20,bot-top,10);ctx.fill();ctx.beginPath();ctx.arc(tx0,bot+14,20,0,7);ctx.fill();
  ctx.fillStyle=PAL.bad;ctx.beginPath();ctx.arc(tx0,bot+14,14,0,7);ctx.fill();ctx.fillRect(tx0-5,bot-(bot-top-10)*f,10,(bot-top-10)*f+10);
  for(let k=10;k<=40;k+=5){const y=bot-(bot-top-10)*((k-10)/30);txt(ctx,k+'°',tx0+18,y+4,PAL.muted2,10,'left');}
  txt(ctx,TH.T.toFixed(1)+' °C',tx0,24,PAL.ink,13);if(TH.hot)txt(ctx,'🤏',tx0+2,bot+60,PAL.white,22);
  const box=(x,y,w,h,t1,t2,col)=>{ctx.fillStyle=PAL.panel;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,h,8);ctx.fill();ctx.stroke();txt(ctx,t1,x+w/2,y+24,PAL.ink2,12);txt(ctx,t2,x+w/2,y+52,PAL.white,17);};
  const ar=(x1,x2,y)=>{W(ctx,[[x1,y],[x2-8,y]],PAL.muted2,2);ctx.fillStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(x2,y);ctx.lineTo(x2-9,y-5);ctx.lineTo(x2-9,y+5);ctx.fill();};
  box(110,90,130,74,'LM35 "S" pin',(V*1000).toFixed(0)+' mV',PAL.orange);ar(240,265,127);
  box(265,90,150,74,'ADC (ref '+ref+' V)',(avg?'avg ':'')+TH.code.toFixed(avg?1:0)+' / 1023',PAL.violet);ar(415,440,127);
  box(440,90,130,74,'× '+ref+' ÷ 1023 × 100',TH.calc.toFixed(1)+' °C',PAL.green);ar(570,592,127);
  const tens=Math.floor(TH.shown/10),u=TH.shown%10;drawDigit(ctx,604,70,0.95,tens?DIGITS[tens]:'',{pad:10,glow:10});drawDigit(ctx,690,70,0.95,DIGITS[u],{pad:10,glow:10});
  txt(ctx,'one ADC step = '+(ref/1023*100).toFixed(2)+' °C',340,200,ref<2?PAL.good:PAL.yellow,13);
  txt(ctx,ref<2?'1.1 V jug: fine marks, 0.1 °C resolution':'5 V jug: coarse marks, the last digit can flip-flop',340,222,PAL.muted,12);
  txt(ctx,avg?'20 readings averaged: steady':'single reading: noisy, watch the digits jitter',340,244,PAL.muted,12);}
(()=>{const b=$('thHot');hold(b,on=>{TH.hot=on;});})();
// chart: the sensor's voltage over time (hold 🤏 to warm it)
const G20R=mRec();
function G20(){const ctx=$('m20').getContext('2d');mRecPush(G20R,TH.T*0.01);
  mScope(ctx,15,300,770,115,{title:'LM35 "S" pin: 10 mV per °C (hold the sensor to warm it)',span:30,lo:0.15,hi:0.4,unit:'V',refs:[[0.22,'22 °C'],[0.34,'34 °C']],traces:[{rec:G20R,col:PAL.orange}]});}
loop((dt,now)=>{if(vis('m20')){drawTherm(dt);G20();}});
})();

// ===== p21: breadboard layout + demo =====
BBL.p21={"power": 9, "parts": [{"s": 1, "t": "pm"}, {"s": 2, "t": "chip", "col": 4, "n": 14, "lab": "LM339 U1"}, {"s": 2, "t": "wire", "a": "j6", "b": "bp6", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "a6", "b": "tn6", "c": "#111"}, {"s": 2, "t": "chip", "col": 13, "n": 14, "lab": "LM339 U2"}, {"s": 2, "t": "wire", "a": "j15", "b": "bp15", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "a15", "b": "tn15", "c": "#111"}, {"s": 2, "t": "chip", "col": 22, "n": 14, "lab": "LM339 U3"}, {"s": 2, "t": "wire", "a": "j24", "b": "bp24", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "a24", "b": "tn24", "c": "#111"}, {"s": 3, "t": "npn", "c": "c43", "b": "c44", "e": "c45", "lab": "LM35"}, {"s": 3, "t": "wire", "a": "a43", "b": "tp43", "c": PAL.redDark}, {"s": 3, "t": "wire", "a": "a45", "b": "tn45", "c": "#111"}, {"s": 4, "t": "wire", "a": "b44", "b": "g25", "c": PAL.gold}, {"s": 4, "t": "wire", "a": "h25", "b": "h27", "c": PAL.gold}, {"s": 4, "t": "wire", "a": "i27", "b": "d19", "c": PAL.gold}, {"s": 4, "t": "wire", "a": "c19", "b": "c17", "c": PAL.gold}, {"s": 4, "t": "wire", "a": "b17", "b": "g18", "c": PAL.gold}, {"s": 4, "t": "wire", "a": "h18", "b": "h16", "c": PAL.gold}, {"s": 4, "t": "wire", "a": "i16", "b": "d10", "c": PAL.gold}, {"s": 4, "t": "wire", "a": "c10", "b": "c8", "c": PAL.gold}, {"s": 4, "t": "wire", "a": "b8", "b": "g9", "c": PAL.gold}, {"s": 4, "t": "wire", "a": "h9", "b": "h7", "c": PAL.gold}, {"s": 5, "t": "res", "a": "h32", "b": "h33", "v": 100}, {"s": 5, "t": "res", "a": "i33", "b": "i34", "v": 100}, {"s": 5, "t": "res", "a": "h34", "b": "h35", "v": 100}, {"s": 5, "t": "res", "a": "i35", "b": "i36", "v": 100}, {"s": 5, "t": "res", "a": "h36", "b": "h37", "v": 100}, {"s": 5, "t": "res", "a": "i37", "b": "i38", "v": 100}, {"s": 5, "t": "res", "a": "h38", "b": "h39", "v": 100}, {"s": 5, "t": "res", "a": "i39", "b": "i40", "v": 100}, {"s": 5, "t": "res", "a": "h40", "b": "h41", "v": 100}, {"s": 5, "t": "res", "a": "j32", "b": "j30", "v": 470}, {"s": 5, "t": "res", "a": "i30", "b": "bn30", "v": 330}, {"s": 5, "t": "res", "a": "j41", "b": "j44", "v": 10000}, {"s": 5, "t": "res", "a": "i44", "b": "i46", "v": 10000}, {"s": 5, "t": "pot", "h": ["g46", "g47", "g48"]}, {"s": 5, "t": "wire", "a": "j47", "b": "bp47", "c": PAL.redDark}, {"s": 6, "t": "wire", "a": "g32", "b": "i8", "c": PAL.blueDark}, {"s": 6, "t": "wire", "a": "g33", "b": "i10", "c": PAL.blueDark}, {"s": 6, "t": "wire", "a": "g34", "b": "b9", "c": PAL.blueDark}, {"s": 6, "t": "wire", "a": "g35", "b": "b7", "c": PAL.blueDark}, {"s": 6, "t": "wire", "a": "g36", "b": "i17", "c": PAL.blueDark}, {"s": 6, "t": "wire", "a": "g37", "b": "i19", "c": PAL.blueDark}, {"s": 6, "t": "wire", "a": "g38", "b": "b18", "c": PAL.blueDark}, {"s": 6, "t": "wire", "a": "g39", "b": "b16", "c": PAL.blueDark}, {"s": 6, "t": "wire", "a": "g40", "b": "i26", "c": PAL.blueDark}, {"s": 6, "t": "wire", "a": "g41", "b": "i28", "c": PAL.blueDark}, {"s": 7, "t": "bar", "col": 50, "cols": ["g", "g", "g", "g", "g", "g", "g", "g", "g", "g"], "lab": "DC10G"}, {"s": 7, "t": "sil", "a": "j49", "b": "j57", "lab": "8 \u00d7 470 \u03a9"}, {"s": 7, "t": "wire", "a": "i49", "b": "bp49", "c": PAL.redDark}, {"s": 7, "t": "res", "a": "j58", "b": "bp58", "v": 470}, {"s": 7, "t": "res", "a": "j59", "b": "bp59", "v": 470}, {"s": 8, "t": "wire", "a": "i5", "b": "a50", "c": PAL.greenDark}, {"s": 8, "t": "wire", "a": "i4", "b": "a51", "c": PAL.greenDark}, {"s": 8, "t": "wire", "a": "b4", "b": "a52", "c": PAL.greenDark}, {"s": 8, "t": "wire", "a": "b5", "b": "a53", "c": PAL.greenDark}, {"s": 8, "t": "wire", "a": "i14", "b": "a54", "c": PAL.greenDark}, {"s": 8, "t": "wire", "a": "i13", "b": "a55", "c": PAL.greenDark}, {"s": 8, "t": "wire", "a": "b13", "b": "a56", "c": PAL.greenDark}, {"s": 8, "t": "wire", "a": "b14", "b": "a57", "c": PAL.greenDark}, {"s": 8, "t": "wire", "a": "i23", "b": "a58", "c": PAL.greenDark}, {"s": 8, "t": "wire", "a": "i22", "b": "a59", "c": PAL.greenDark}]};
(function(){
// ---------- p21: bar-graph thermometer ----------
const BG21={T:22,hot:false};
function drawBarT(dt){const ctx=cv('m21');BG21.T+=((BG21.hot?38:22)-BG21.T)*(1-Math.exp(-dt/(BG21.hot?3:6)));
  const V=BG21.T*0.01,I=+$('bgRHI').value*1e-3;$('bgI').textContent=(I*1e3).toFixed(3)+' mA → '+(I*100*1000/10).toFixed(1)+' °C per step';
  const th=k=>(800+100*k)*I;
  ctx.fillStyle=PAL.panel;ctx.strokeStyle=PAL.orange;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(20,90,130,90,8);ctx.fill();ctx.stroke();
  txt(ctx,'LM35',85,114,PAL.ink2,13);txt(ctx,BG21.T.toFixed(1)+' °C',85,140,PAL.white,16);txt(ctx,'signal '+(V*1000).toFixed(0)+' mV',85,165,PAL.yellow,13);if(BG21.hot)txt(ctx,'🤏',85,215,PAL.white,22);
  W(ctx,[[150,135],[200,135]],PAL.yellow,3);
  const x0=230,yb=270,yt=30,h=(yb-yt)/10;txt(ctx,'+5 V via 20 kΩ + trimmer',x0+40,yt-8,PAL.muted,11);txt(ctx,'800 Ω to GND',x0+40,yb+16,PAL.muted,11);
  for(let i=0;i<10;i++){const y=yb-(i+1)*h+h/2,t=th(i),on=V>t;
    ctx.fillStyle=PAL.raised;ctx.fillRect(x0,y-h/2+2,80,h-4);txt(ctx,(t*1000).toFixed(0)+' mV',x0+40,y+4,PAL.muted,10);
    ctx.fillStyle=on?PAL.green:PAL.slate;ctx.beginPath();ctx.moveTo(x0+90,y-8);ctx.lineTo(x0+110,y);ctx.lineTo(x0+90,y+8);ctx.closePath();ctx.fill();
    W(ctx,[[x0+110,y],[470,y]],on?PAL.green:PAL.slateDark,2);
    const bx=480;ctx.fillStyle=on?PAL.green:'#14301f';if(on){ctx.shadowBlur=14;ctx.shadowColor=PAL.green;}ctx.fillRect(bx,y-h/2+3,120,h-6);ctx.shadowBlur=0;
    txt(ctx,'≥ '+(t*100).toFixed(1)+' °C',bx+130,y+4,PAL.muted,11,'left');}
  txt(ctx,'10 comparators (3 × LM339)',x0+100,yb+16,PAL.muted,11,'left');}
(()=>{const b=$('bgHot');hold(b,on=>{BG21.hot=on;});})();
// chart: each dashed line is one comparator's threshold: the signal crossing it lights one more bar
const G21R=mRec();
function G21(){const ctx=$('m21').getContext('2d'),I=+$('bgRHI').value*1e-3,refs=[];for(let k=0;k<10;k++){const v=(800+100*k)*I;if(v>0.15&&v<0.45)refs.push([v,'']);}
  mRecPush(G21R,BG21.T*0.01);
  mScope(ctx,15,300,770,120,{title:'LM35 signal vs the comparator thresholds (dashed)',span:30,lo:0.15,hi:0.45,unit:'V',refs,traces:[{rec:G21R,col:PAL.yellow}]});}
loop((dt,now)=>{if(vis('m21')){drawBarT(dt);G21();}});
})();

// ===== p22: breadboard layout + demo =====
BBL.p22={"power": 10, "parts": [{"s": 1, "t": "pm"}, {"s": 2, "t": "chip", "col": 4, "n": 8, "lab": "555 #1"}, {"s": 2, "t": "wire", "a": "d4", "b": "tp4", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "j4", "b": "bn4", "c": "#111"}, {"s": 2, "t": "wire", "a": "j7", "b": "bp7", "c": PAL.redDark}, {"s": 3, "t": "res", "a": "c4", "b": "c5", "v": 1000}, {"s": 3, "t": "res", "a": "b5", "b": "b6", "v": 10000}, {"s": 3, "t": "wire", "a": "a6", "b": "i5", "c": PAL.blueDark}, {"s": 3, "t": "ccap", "a": "h5", "b": "bn5", "lab": "100n"}, {"s": 4, "t": "chip", "col": 20, "n": 8, "lab": "555 #2"}, {"s": 4, "t": "wire", "a": "d20", "b": "tp20", "c": PAL.redDark}, {"s": 4, "t": "wire", "a": "j20", "b": "bn20", "c": "#111"}, {"s": 4, "t": "wire", "a": "g6", "b": "g23", "c": PAL.purple}, {"s": 5, "t": "res", "a": "c20", "b": "c21", "v": 1000}, {"s": 5, "t": "res", "a": "b21", "b": "b26", "v": 2200}, {"s": 5, "t": "res", "a": "c26", "b": "c29", "v": 1000}, {"s": 5, "t": "res", "a": "d29", "b": "d22", "v": 330}, {"s": 5, "t": "wire", "a": "a22", "b": "i21", "c": PAL.blueDark}, {"s": 5, "t": "ccap", "a": "h21", "b": "bn21", "lab": "4.7n"}, {"s": 6, "t": "res", "a": "i22", "b": "i28", "v": 1000}, {"s": 6, "t": "wire", "a": "h28", "b": "h55", "c": PAL.orangeDark}, {"s": 6, "t": "led", "a": "g55", "b": "g57", "rgb": "139,92,246"}, {"s": 6, "t": "wire", "a": "j57", "b": "bn57", "c": "#111"}, {"s": 7, "t": "npn", "c": "c40", "b": "c41", "e": "c42", "lab": "TSOP"}, {"s": 7, "t": "wire", "a": "a41", "b": "tn41", "c": "#111"}, {"s": 7, "t": "wire", "a": "a42", "b": "tp42", "c": PAL.redDark}, {"s": 7, "t": "ecap", "a": "b42", "b": "tn43", "lab": "10\u00b5"}, {"s": 8, "t": "res", "a": "tp36", "b": "a36", "v": 4700}, {"s": 8, "t": "ecap", "a": "b36", "b": "tn37", "lab": "10\u00b5"}, {"s": 8, "t": "diode", "a": "d36", "b": "d40"}, {"s": 9, "t": "npn", "c": "c46", "b": "c47", "e": "c48"}, {"s": 9, "t": "wire", "a": "a48", "b": "tn49", "c": "#111"}, {"s": 9, "t": "res", "a": "e36", "b": "e47", "v": 10000}, {"s": 9, "t": "res", "a": "a47", "b": "tn47", "v": 10000}, {"s": 9, "t": "res", "a": "tp44", "b": "a44", "v": 330}, {"s": 9, "t": "led", "a": "b44", "b": "b46"}]};
(function(){
// ---------- p22: IR beam alarm ----------
const IR22={blk:false,X:0.8,hist:[],ph:0};
function drawIR(dt){const ctx=cv('m22'),f=+$('irF').value,sens=Math.exp(-Math.pow((f-38)/2.6,2)),seen=!IR22.blk&&sens>0.45;$('irFv').textContent=f.toFixed(1)+' kHz';
  IR22.ph+=dt*0.6;const tgt=seen?0.8:3.6;IR22.X+=(tgt-IR22.X)*(1-Math.exp(-dt/(seen?0.04:0.35)));IR22.hist.push(IR22.X);if(IR22.hist.length>240)IR22.hist.shift();const alarm=IR22.X>1.3;
  const box=(x,y,w,h,t1,t2,col)=>{ctx.fillStyle=PAL.panel;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,h,8);ctx.fill();ctx.stroke();txt(ctx,t1,x+w/2,y+20,PAL.ink2,12);if(t2)txt(ctx,t2,x+w/2,y+40,PAL.muted,11);};
  const ar=(x1,y1,x2,y2,col)=>{W(ctx,[[x1,y1],[x2,y2]],col||PAL.muted2,2);const a=Math.atan2(y2-y1,x2-x1);ctx.fillStyle=col||PAL.muted2;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-9*Math.cos(a-0.4),y2-9*Math.sin(a-0.4));ctx.lineTo(x2-9*Math.cos(a+0.4),y2-9*Math.sin(a+0.4));ctx.fill();};
  box(15,20,120,52,'555 #1','bursts 690 /s',PAL.blue);ar(135,46,165,46);box(165,20,120,52,'555 #2',f.toFixed(1)+' kHz',PAL.blue);ar(285,46,315,46);
  // IR LED
  const on=Math.sin(IR22.ph*40)>0;glowAt(ctx,335,46,on?0.8:0.2,'139,92,246',34);ctx.fillStyle='#8b5cf6';ctx.beginPath();ctx.arc(335,46,12,0,7);ctx.fill();txt(ctx,'IR LED',335,86,'#c4b5fd',11);
  // beam
  for(let i=0;i<14;i++){const x=355+i*15+((IR22.ph*120)%15);if(IR22.blk&&x>445)break;const burst=Math.floor((x-IR22.ph*120)/30)%2===0;ctx.fillStyle=burst?'rgba(167,139,250,.9)':'rgba(167,139,250,.15)';ctx.fillRect(x,43,8,6);}
  txt(ctx,'invisible 940 nm light',455,28,PAL.muted2,11);if(IR22.blk){txt(ctx,'✋',462,60,PAL.white,34);}
  // TSOP
  box(580,20,110,52,'TSOP38238',sens>0.45?'hears '+f.toFixed(0)+' kHz':'deaf at '+f.toFixed(0)+' kHz',seen?PAL.green:PAL.amber);
  // row 2: bucket, transistor, LED
  ar(635,72,635,130);box(560,130,150,60,'bucket (10 µF)','X = '+IR22.X.toFixed(2)+' V',PAL.yellow);
  const lvl=Math.min(1,(IR22.X-0.5)/3.1);ctx.fillStyle='rgba(56,189,248,.35)';ctx.fillRect(715,190-60*lvl,22,60*lvl);ctx.strokeStyle=PAL.slate;ctx.strokeRect(715,130,22,60);
  ar(560,160,450,160,alarm?PAL.bad:PAL.muted2);box(330,130,120,60,'BC547',alarm?'ON':'off',alarm?PAL.bad:PAL.slate);ar(330,160,250,160,alarm?PAL.bad:PAL.muted2);
  glowAt(ctx,215,160,alarm?0.95:0,'239,68,68',60);ctx.fillStyle=alarm?PAL.bad:'rgba(239,68,68,.2)';ctx.beginPath();ctx.arc(215,160,18,0,7);ctx.fill();
  txt(ctx,alarm?'🚨 ALARM: beam cut':'beam OK',100,165,alarm?PAL.bad:PAL.green,14);
  // scopes
  const gy=230,gh=90,gw=245;const g1=[],g2=[];for(let i=0;i<120;i++){const t=i/120*4+IR22.ph*2,bu=(t%1)<0.5;g1.push(bu?(Math.sin(i*2.6)>0?1:0):0);g2.push(seen&&bu?0:1);}
  mGraph(ctx,15,gy,gw,gh,[[g1,PAL.violet]],-0.2,1.3,'IR light (38 kHz bursts)');
  mGraph(ctx,277,gy,gw,gh,[[g2,PAL.green]],-0.2,1.3,'TSOP OUT (low = burst heard)');
  mGraph(ctx,539,gy,gw,gh,[[IR22.hist,PAL.yellow],[IR22.hist.map(()=>1.3),PAL.bad,[4,4]]],0,4,'bucket X (V), red = alarm level');
  txt(ctx,'slowed down: real bursts last 0.7 ms',400,gy+gh+24,PAL.muted2,11);}
(()=>{const b=$('irBlock');hold(b,on=>{IR22.blk=on;});})();
loop((dt,now)=>{if(vis('m22'))drawIR(dt);});
})();

// ===== p23: breadboard layout + demo =====
BBL.p23={"power": 9, "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 1, "t": "ecap", "a": "tp7", "b": "tn8", "lab": "100\u00b5"}, {"s": 2, "t": "chip", "col": 10, "n": 8, "lab": "NE555"}, {"s": 2, "t": "wire", "a": "d10", "b": "tp10", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "j10", "b": "bn10", "c": "#111"}, {"s": 2, "t": "wire", "a": "j13", "b": "bp13", "c": PAL.redDark}, {"s": 3, "t": "res", "a": "c10", "b": "c11", "v": 1000}, {"s": 3, "t": "pot", "h": ["a20", "a21", "a22"]}, {"s": 3, "t": "wire", "a": "d11", "b": "c21", "c": PAL.orangeDark}, {"s": 4, "t": "diode", "a": "b20", "b": "b12"}, {"s": 4, "t": "diode", "a": "c12", "b": "c22"}, {"s": 4, "t": "wire", "a": "a12", "b": "i11", "c": PAL.blueDark}, {"s": 4, "t": "ccap", "a": "h11", "b": "bn11", "lab": "10n"}, {"s": 5, "t": "res", "a": "i12", "b": "i16", "v": 470}, {"s": 5, "t": "led", "a": "h16", "b": "h18"}, {"s": 5, "t": "wire", "a": "j18", "b": "bn18", "c": "#111"}, {"s": 6, "t": "npn", "c": "g32", "b": "g31", "e": "g30", "lab": "E B C"}, {"s": 6, "t": "res", "a": "h12", "b": "h31", "v": 1000}, {"s": 6, "t": "wire", "a": "j30", "b": "bn30", "c": "#111"}, {"s": 7, "t": "box", "at": [330, 352], "w": 140, "h": 46, "lab": "\u2699\ufe0f DC motor RE140/1", "col": PAL.chipLight, "ly": 28, "pins": [{"n": "", "dx": 18, "dy": 0, "to": "j32", "c": PAL.gold}, {"n": "", "dx": 122, "dy": 0, "to": "bp35", "c": PAL.redDark}]}, {"s": 8, "t": "diode", "a": "i32", "b": "bp33"}, {"s": 9, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};
(function(){
// ---------- p23/p24: motors ----------
const MO={a23:0,w23:0,a24:0,w24:0,f:false,r:false,ph:0};
function drawPWM(dt){const ctx=cv('m23'),d=+$('p23d').value;$('p23v').textContent=Math.round(d*100)+' % on';
  const x0=44,y0=40,w=450,h=140,per=w/4;ctx.fillStyle=PAL.panel;ctx.fillRect(x0,y0,w,h);ctx.strokeStyle=PAL.line;ctx.strokeRect(x0,y0,w,h);
  const yh=y0+20,yl=y0+h-20;ctx.strokeStyle=PAL.blue;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x0,yl);
  for(let k=0;k<4;k++){const a=x0+k*per;ctx.lineTo(a,yl);ctx.lineTo(a,yh);ctx.lineTo(a+per*d,yh);ctx.lineTo(a+per*d,yl);}ctx.lineTo(x0+w,yl);ctx.stroke();
  const ya=yl-(yl-yh)*d;ctx.setLineDash([6,5]);ctx.strokeStyle=PAL.yellow;ctx.beginPath();ctx.moveTo(x0,ya);ctx.lineTo(x0+w,ya);ctx.stroke();ctx.setLineDash([]);
  txt(ctx,'9 V',x0-4,yh+4,PAL.muted,11,'right');txt(ctx,'0 V',x0-4,yl+4,PAL.muted,11,'right');txt(ctx,'average '+(9*d).toFixed(1)+' V',x0+w-6,ya-6,PAL.yellow,12,'right');
  txt(ctx,'555 output → transistor → motor (one period ≈ 76 µs)',x0,y0-12,PAL.ink2,12,'left');
  for(let k=0;k<4;k++){const a=x0+k*per;txt(ctx,'on',a+per*d/2,yh-6,PAL.link,10);}
  // motor
  const tgt=d<0.15?0:(d-0.15)/0.85*9200;MO.w23+=(tgt-MO.w23)*(1-Math.exp(-dt/0.6));MO.a23+=MO.w23/60*2*Math.PI*dt*0.02;
  motorDraw(ctx,640,110,MO.a23);txt(ctx,MO.w23<50?'stopped (too weak to start)':'≈ '+Math.round(MO.w23/100)*100+' rpm',640,190,PAL.white,14);
  txt(ctx,'(drawn 50× slower)',640,208,PAL.muted2,11);
  // LED + bar
  glowAt(ctx,110,250,d*0.9,'239,68,68',30);ctx.fillStyle=`rgba(239,68,68,${0.15+0.85*d})`;ctx.beginPath();ctx.arc(110,250,10,0,7);ctx.fill();txt(ctx,'speed LED',110,280,PAL.muted,11);
  txt(ctx,'Power wasted in the transistor: tiny, it is either fully ON or fully OFF',480,255,PAL.muted,12);}
function drawHB(dt){const ctx=cv('m24'),f=MO.f,r=MO.r;const L=f&&!r?1:0,Rr=r&&!f?1:0;const hiL=f,hiR=r;// 1Y high if FWD pressed, 2Y high if REV pressed
  MO.ph+=dt;const cx=400,top=40,bot=250,lx=250,rx=550,my=145;
  W(ctx,[[lx,top],[rx,top]],PAL.bad,3);W(ctx,[[lx,bot],[rx,bot]],PAL.water,3);txt(ctx,'+9 V',cx,top-10,PAL.bad,12);txt(ctx,'0 V',cx,bot+20,PAL.water,12);
  const sw=(x,y1,y2,on,lab)=>{W(ctx,[[x,y1],[x,y1+20]],PAL.ink2,2.5);W(ctx,[[x,y2-20],[x,y2]],PAL.ink2,2.5);ctx.strokeStyle=on?PAL.green:PAL.muted2;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y2-20);ctx.lineTo(on?x:x+18,y1+20);ctx.stroke();
    ctx.fillStyle=PAL.ink2;[y1+20,y2-20].forEach(y=>{ctx.beginPath();ctx.arc(x,y,3,0,7);ctx.fill();});txt(ctx,lab,x+(x<cx?-34:34),(y1+y2)/2+4,on?PAL.green:PAL.muted2,12);};
  sw(lx,top,my,hiL,'S1');sw(lx,my,bot,!hiL,'S2');sw(rx,top,my,hiR,'S3');sw(rx,my,bot,!hiR,'S4');
  W(ctx,[[lx,my],[cx-50,my]],PAL.ink2,2.5);W(ctx,[[cx+50,my],[rx,my]],PAL.ink2,2.5);txt(ctx,'1Y',lx+22,my-8,PAL.muted,11);txt(ctx,'2Y',rx-22,my-8,PAL.muted,11);
  const dir=L?1:Rr?-1:0;MO.w24+=(dir*1-MO.w24)*(1-Math.exp(-dt/(dir?0.5:0.25)));MO.a24+=MO.w24*dt*6;motorDraw(ctx,cx,my,MO.a24,PAL.yellow);
  if(dir){const path=dir>0?[[lx,top+2],[lx,my],[cx-50,my],[cx+50,my],[rx,my],[rx,bot-2]]:[[rx,top+2],[rx,my],[cx+50,my],[cx-50,my],[lx,my],[lx,bot-2]];
    const segs=[];let tot=0;for(let i=1;i<path.length;i++){const l=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]);segs.push(l);tot+=l;}
    for(let k=0;k<14;k++){let s=((MO.ph*120+k*tot/14)%tot);for(let i=0;i<segs.length;i++){if(s<=segs[i]){const t=s/segs[i],p=[path[i][0]+(path[i+1][0]-path[i][0])*t,path[i][1]+(path[i+1][1]-path[i][1])*t];if(!(p[0]>cx-46&&p[0]<cx+46)){ctx.fillStyle=PAL.highlight;ctx.beginPath();ctx.arc(p[0],p[1],4,0,7);ctx.fill();}break;}s-=segs[i];}}}
  // LEDs
  [[680,110,'239,68,68',L,'red: forward'],[680,180,'34,197,94',Rr,'green: reverse']].forEach(([x,y,c,on,l])=>{glowAt(ctx,x,y,on?0.9:0,c,30);ctx.fillStyle=`rgba(${c},${on?1:0.2})`;ctx.beginPath();ctx.arc(x,y,11,0,7);ctx.fill();txt(ctx,l,x+20,y+4,PAL.muted,12,'left');});
  const st=f&&r?'both pressed: S1 + S3 closed, 9 V on both ends → 0 V across the motor: stop':f?'FORWARD: S1 + S4 closed, current flows left → right':r?'REVERSE: S3 + S2 closed, current flows right → left':'no button: S2 + S4 closed, both ends at 0 V: stop';
  txt(ctx,st,cx,290,PAL.ink,13);txt(ctx,'inside the L293D',100,40,PAL.muted2,12);}
[['p24f','f'],['p24r','r']].forEach(([id,k])=>{const b=$(id);hold(b,on=>{MO[k]=on;});});
loop((dt,now)=>{if(vis('m23'))drawPWM(dt);if(vis('m24'))drawHB(dt);});
})();

// ===== p24: breadboard layout =====
BBL.p24={"power": 8, "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "chip", "col": 20, "n": 16, "lab": "L293D"}, {"s": 2, "t": "wire", "a": "d20", "b": "tp20", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "j27", "b": "bp27", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "j23", "b": "bn23", "c": "#111"}, {"s": 2, "t": "wire", "a": "j24", "b": "bn24", "c": "#111"}, {"s": 2, "t": "wire", "a": "a23", "b": "tn23", "c": "#111"}, {"s": 2, "t": "wire", "a": "a24", "b": "tn24", "c": "#111"}, {"s": 3, "t": "res", "a": "i20", "b": "bp18", "v": 10000}, {"s": 3, "t": "res", "a": "j20", "b": "bn19", "v": 10000}, {"s": 4, "t": "btn", "col": 4}, {"s": 4, "t": "wire", "a": "tp4", "b": "a4", "c": PAL.redDark}, {"s": 4, "t": "res", "a": "g6", "b": "g12", "v": 10000}, {"s": 4, "t": "wire", "a": "h12", "b": "h21", "c": PAL.greenDark}, {"s": 4, "t": "res", "a": "j21", "b": "bn21", "v": 10000}, {"s": 5, "t": "btn", "col": 34}, {"s": 5, "t": "wire", "a": "tp34", "b": "a34", "c": PAL.redDark}, {"s": 5, "t": "res", "a": "g36", "b": "g30", "v": 10000}, {"s": 5, "t": "wire", "a": "h30", "b": "h26", "c": PAL.blueDark}, {"s": 5, "t": "res", "a": "j26", "b": "bn26", "v": 10000}, {"s": 6, "t": "box", "at": [300, 352], "w": 140, "h": 46, "lab": "\u2699\ufe0f DC motor RE140/1", "col": PAL.chipLight, "ly": 28, "pins": [{"n": "", "dx": 18, "dy": 0, "to": "j22", "c": PAL.gold}, {"n": "", "dx": 122, "dy": 0, "to": "j25", "c": PAL.gold}]}, {"s": 7, "t": "wire", "a": "h22", "b": "h44", "c": PAL.orangeDark}, {"s": 7, "t": "wire", "a": "i25", "b": "i47", "c": PAL.purple}, {"s": 7, "t": "res", "a": "g44", "b": "g46", "v": 1000}, {"s": 7, "t": "led", "a": "f46", "b": "f47"}, {"s": 7, "t": "led", "a": "h47", "b": "h46", "rgb": "34,197,94"}, {"s": 8, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};
// its demo lives in p23.js (both motor projects share one state)

// ===== p25: breadboard layout + demo =====
BBL.p25={"power": 6, "parts": [{"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "wire", "a": "tp10", "b": "a10", "c": PAL.redDark}, {"s": 2, "t": "diode", "a": "c10", "b": "c14"}, {"s": 2, "t": "diode", "a": "d14", "b": "d18"}, {"s": 2, "t": "diode", "a": "c18", "b": "c22"}, {"s": 2, "t": "diode", "a": "d22", "b": "d26"}, {"s": 3, "t": "wire", "a": "b26", "b": "h26", "c": PAL.orangeDark}, {"s": 4, "t": "box", "at": [330, 352], "w": 140, "h": 46, "lab": "\u2699\ufe0f DC motor RE140/1", "col": PAL.chipLight, "ly": 28, "pins": [{"n": "", "dx": 18, "dy": 0, "to": "j26", "c": PAL.gold}, {"n": "", "dx": 122, "dy": 0, "to": "bn32", "c": "#111"}]}, {"s": 5, "t": "ecap", "a": "i27", "b": "bn28", "lab": "1000\u00b5"}, {"s": 5, "t": "wire", "a": "g26", "b": "g27", "c": PAL.orangeDark}, {"s": 6, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};
(function(){
// ---------- p25: lower the voltage ----------
const LV={m:'dio',a:0,w:0};
document.querySelectorAll('.p25m').forEach(b=>b.addEventListener('click',()=>{LV.m=b.dataset.m;document.querySelectorAll('.p25m').forEach(x=>x.classList.toggle('active',x===b));}));
const LVF={direct:I=>9-0.5*I,cap:I=>9-0.5*I,res:I=>9-0.5*I-12*I,dio:I=>9-0.5*I-4*(0.7+0.15*I),pwm:I=>0.67*(9-0.5*I)};
const LVC={direct:PAL.bad,cap:PAL.orange,res:PAL.violet,dio:PAL.green,pwm:PAL.blue};
const LVN={direct:'direct 9 V',cap:'capacitor only',res:'resistor 12 Ω',dio:'4 diodes',pwm:'PWM 67 % (average)'};
function drawLV(dt){const ctx=cv('m25'),l=+$('p25l').value,I=0.1+0.8*l,m=LV.m,Vm=LVF[m](I),E=Vm-6*I,sp=Math.max(0,E/5.4);
  const x0=60,y0=20,w=380,h=230,X=i=>x0+i*w,Y=v=>y0+h-v/10*h;
  ctx.fillStyle=PAL.panel;ctx.fillRect(x0,y0,w,h);ctx.fillStyle='rgba(34,197,94,.12)';ctx.fillRect(x0,Y(6),w,Y(3)-Y(6));txt(ctx,'3–6 V: what a small motor wants',x0+w-6,Y(3)-6,'#4ade80',11,'right');
  ctx.strokeStyle=PAL.line;ctx.strokeRect(x0,y0,w,h);
  for(let v=0;v<=10;v+=2)txt(ctx,v+' V',x0-6,Y(v)+4,PAL.muted2,10,'right');[0,0.25,0.5,0.75,1].forEach(i=>txt(ctx,i+' A',X(i),y0+h+16,PAL.muted2,10));
  txt(ctx,'current the motor draws →',x0+w/2,y0+h+32,PAL.muted,11);txt(ctx,'voltage on the motor',x0+4,y0+14,PAL.muted,11,'left');
  Object.keys(LVF).forEach(k=>{if(k==='cap')return;const sel=k===m||(m==='cap'&&k==='direct');ctx.strokeStyle=sel?LVC[m==='cap'?'cap':k]:'rgba(148,163,184,.25)';ctx.lineWidth=sel?3:1.5;ctx.beginPath();
    for(let i=0;i<=50;i++){const c=i/50,v=Math.max(0,LVF[k](c));i?ctx.lineTo(X(c),Y(v)):ctx.moveTo(X(c),Y(v));}ctx.stroke();});
  ctx.fillStyle=PAL.white;ctx.beginPath();ctx.arc(X(I),Y(Math.max(0,Vm)),6,0,7);ctx.fill();
  ctx.fillStyle='rgba(17,28,46,.85)';ctx.fillRect(x0+6,Y(1.6),170,22);txt(ctx,'● '+LVN[m],x0+12,Y(1.6)+15,LVC[m],12,'left');
  // motor
  LV.w+=(sp-LV.w)*(1-Math.exp(-dt/0.4));LV.a+=LV.w*dt*14;motorDraw(ctx,600,90,LV.a);
  const heat=m==='res'?12*I*I:m==='dio'?4*(0.7+0.15*I)*I:m==='pwm'?0.05:0;
  const verdict=E<=0.3?['stalls: not enough voltage left',PAL.amber]:Vm>6.6?['too fast: hot coil, worn brushes, short life',PAL.bad]:Vm<2.8?['weak, may stall',PAL.amber]:['✓ happy motor',PAL.green];
  txt(ctx,'motor gets '+Math.max(0,Vm).toFixed(1)+' V at '+I.toFixed(2)+' A',600,160,PAL.white,13);txt(ctx,'speed '+Math.round(sp*100)+' % of its rated speed',600,180,PAL.ink2,12);
  txt(ctx,verdict[0],600,202,verdict[1],13);
  txt(ctx,'heat wasted in the reducer: '+heat.toFixed(2)+' W',600,232,PAL.ink2,12);
  if(m==='res'&&heat>0.25)txt(ctx,'🔥 a 1/4 W resistor burns above 0.25 W',600,252,PAL.bad,12);
  if(m==='dio')txt(ctx,(heat/4).toFixed(2)+' W per diode: fine (1N4007 ≈ 1 W)',600,252,PAL.muted,12);
  if(m==='cap')txt(ctx,'the capacitor charges to 9 V: nothing reduced',600,252,PAL.orange,12);
  if(m==='pwm')txt(ctx,'switching: almost no heat',600,252,PAL.muted,12);
  txt(ctx,l<0.05?'spinning free':l>0.9?'almost blocked (like start-up)':'with some load',600,280,PAL.muted2,11);}
loop((dt,now)=>{if(vis('m25'))drawLV(dt);});
})();

// ===== p26: breadboard layout + demo =====
BBL.p26={"power": 6, "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 1, "t": "chip", "col": 9, "n": 16, "lab": "CD4518"}, {"s": 1, "t": "wire", "a": "d9", "b": "tp9", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "j16", "b": "bn16", "c": "#111"}, {"s": 1, "t": "wire", "a": "j10", "b": "bp10", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "a16", "b": "tn16", "c": "#111"}, {"s": 1, "t": "wire", "a": "g14", "b": "b15", "c": PAL.orangeDark}, {"s": 1, "t": "wire", "a": "b10", "b": "h15", "c": PAL.purple}, {"s": 1, "t": "res", "a": "i15", "b": "bn15", "v": 10000}, {"s": 1, "t": "btn", "col": 50}, {"s": 1, "t": "wire", "a": "tp50", "b": "a50", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "i52", "b": "j15", "c": PAL.purple}, {"s": 1, "t": "chip", "col": 19, "n": 16, "lab": "CD4511"}, {"s": 1, "t": "wire", "a": "d19", "b": "tp19", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "j26", "b": "bn26", "c": "#111"}, {"s": 1, "t": "wire", "a": "j21", "b": "bp21", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "j22", "b": "bp22", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "j23", "b": "bn23", "c": "#111"}, {"s": 1, "t": "wire", "a": "a14", "b": "i25", "c": PAL.greenDark}, {"s": 1, "t": "wire", "a": "a13", "b": "i19", "c": PAL.blueDark}, {"s": 1, "t": "wire", "a": "c12", "b": "h20", "c": PAL.purple}, {"s": 1, "t": "wire", "a": "b11", "b": "h24", "c": PAL.orangeDark}, {"s": 1, "t": "seg7", "col": 28, "show": "CNT", "place": 1}, {"s": 1, "t": "wire", "a": "j30", "b": "bn31", "c": "#111"}, {"s": 1, "t": "res", "a": "a20", "b": "a29", "v": 1000}, {"s": 1, "t": "res", "a": "b21", "b": "b28", "v": 1000}, {"s": 1, "t": "res", "a": "c22", "b": "c31", "v": 1000}, {"s": 1, "t": "res", "a": "d23", "b": "d32", "v": 1000}, {"s": 1, "t": "res", "a": "a24", "b": "g31", "v": 1000}, {"s": 1, "t": "res", "a": "a25", "b": "h29", "v": 1000}, {"s": 1, "t": "res", "a": "a26", "b": "i28", "v": 1000}, {"s": 1, "t": "chip", "col": 35, "n": 16, "lab": "CD4511"}, {"s": 1, "t": "wire", "a": "d35", "b": "tp35", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "j42", "b": "bn43", "c": "#111"}, {"s": 1, "t": "wire", "a": "j37", "b": "bp37", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "j38", "b": "bp38", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "j39", "b": "bn39", "c": "#111"}, {"s": 1, "t": "wire", "a": "i11", "b": "i41", "c": PAL.greenDark}, {"s": 1, "t": "wire", "a": "i12", "b": "i35", "c": PAL.blueDark}, {"s": 1, "t": "wire", "a": "i13", "b": "i36", "c": PAL.purple}, {"s": 1, "t": "wire", "a": "h14", "b": "i40", "c": PAL.orangeDark}, {"s": 1, "t": "seg7", "col": 44, "show": "CNT", "place": 0}, {"s": 1, "t": "wire", "a": "j46", "b": "bn47", "c": "#111"}, {"s": 1, "t": "res", "a": "a36", "b": "a45", "v": 1000}, {"s": 1, "t": "res", "a": "b37", "b": "b44", "v": 1000}, {"s": 1, "t": "res", "a": "c38", "b": "c47", "v": 1000}, {"s": 1, "t": "res", "a": "d39", "b": "d48", "v": 1000}, {"s": 1, "t": "res", "a": "a40", "b": "g47", "v": 1000}, {"s": 1, "t": "res", "a": "a41", "b": "h45", "v": 1000}, {"s": 1, "t": "res", "a": "a42", "b": "i44", "v": 1000}, {"s": 2, "t": "chip", "col": 53, "n": 16, "lab": "CD4060"}, {"s": 2, "t": "wire", "a": "a53", "b": "tp53", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "j60", "b": "bn60", "c": "#111"}, {"s": 2, "t": "wire", "a": "a57", "b": "tn57", "c": "#111"}, {"s": 3, "t": "res", "a": "b58", "b": "b59", "v": 10000000}, {"s": 3, "t": "xtal", "a": "c58", "b": "c51"}, {"s": 3, "t": "res", "a": "d59", "b": "d51", "v": 100000}, {"s": 3, "t": "ccap", "a": "a58", "b": "tn58", "lab": "22p"}, {"s": 3, "t": "ccap", "a": "a51", "b": "tn51", "lab": "22p"}, {"s": 4, "t": "chip", "col": 2, "n": 14, "lab": "4013"}, {"s": 4, "t": "wire", "a": "d2", "b": "tp2", "c": PAL.redDark}, {"s": 4, "t": "wire", "a": "j8", "b": "bn8", "c": "#111"}, {"s": 4, "t": "wire", "a": "j5", "b": "bn5", "c": "#111"}, {"s": 4, "t": "wire", "a": "j7", "b": "bn7", "c": "#111"}, {"s": 4, "t": "wire", "a": "h3", "b": "h6", "c": PAL.orangeDark}, {"s": 4, "t": "wire", "a": "a5", "b": "tn5", "c": "#111"}, {"s": 4, "t": "wire", "a": "a6", "b": "tn6", "c": "#111"}, {"s": 4, "t": "wire", "a": "a7", "b": "tn7", "c": "#111"}, {"s": 4, "t": "wire", "a": "a8", "b": "tn8", "c": "#111"}, {"s": 5, "t": "wire", "a": "j55", "b": "i4", "c": PAL.purple}, {"s": 5, "t": "wire", "a": "h2", "b": "h9", "c": PAL.gold}, {"s": 6, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};
(function(){
// ---------- p26: quartz stopwatch ----------
const QZ={t:0,t5:0};
$('p26r').addEventListener('click',()=>{QZ.t=0;QZ.t5=0;});
function drawQZ(dt){const ctx=cv('m26');QZ.t+=dt;QZ.t5+=dt*1.03;
  const st=[['quartz','32,768 Hz'],['÷2 ×4','2,048 Hz'],['÷2 ×4','128 Hz'],['Q12','8 Hz'],['Q13','4 Hz'],['Q14','2 Hz'],['4013','1 Hz']];
  const fr=[32768,2048,128,8,4,2,1];
  st.forEach(([a,b],i)=>{const x=20+i*110,y=30,f=fr[i],on=f<=10?Math.floor(QZ.t*f*2)%2===0:null;
    ctx.fillStyle=PAL.panel;ctx.strokeStyle=i===0?PAL.ink2:i===6?PAL.green:PAL.blue;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,96,60,8);ctx.fill();ctx.stroke();
    txt(ctx,a,x+48,y+20,PAL.ink2,12);txt(ctx,b,x+48,y+40,PAL.white,13);
    if(on===null){ctx.fillStyle='rgba(250,204,21,.45)';ctx.fillRect(x+30,y+48,36,6);}else{glowAt(ctx,x+48,y+52,on?0.8:0,'250,204,21',14);ctx.fillStyle=on?PAL.yellowSoft:'#3f3f1d';ctx.beginPath();ctx.arc(x+48,y+52,5,0,7);ctx.fill();}
    if(i<6){W(ctx,[[x+96,y+30],[x+110,y+30]],PAL.muted2,2);}});
  txt(ctx,'inside the CD4060: 14 divide-by-2 stages',350,108,PAL.muted2,11);txt(ctx,'blur = too fast to see',90,108,PAL.muted2,11);
  const disp=(x,lab,col,t,sub)=>{const n=Math.floor(t)%100;ctx.fillStyle='#0a0a0a';ctx.fillRect(x,140,150,90);txt(ctx,String(n).padStart(2,'0'),x+75,205,col,60);txt(ctx,lab,x+75,132,PAL.ink2,13);txt(ctx,sub,x+75,250,PAL.muted,12);};
  disp(140,'quartz version',PAL.bad,QZ.t,'±2 s per day');disp(420,'NE555 version',PAL.orange,QZ.t5,'3 % fast here');
  const diff=QZ.t5-QZ.t;txt(ctx,'after '+QZ.t.toFixed(0)+' s, the 555 is ahead by '+diff.toFixed(1)+' s',400,285,diff>1?PAL.amber:PAL.muted,13);}
// chart: every stage is half as fast as the one before
function G26(){const ctx=$('m26').getContext('2d'),u=t=>t-CT+QZ.t,sq=(t,f)=>Math.floor(u(t)*f*2)%2===0?1:0;
  mScope(ctx,15,300,770,132,{title:'timing diagram: each output flips half as often as the one before',span:2,lanes:true,
    traces:[[8,'Q12 · 8 Hz'],[4,'Q13 · 4 Hz'],[2,'Q14 · 2 Hz'],[1,'4013 · 1 Hz']].map(([f,lab],i)=>({f:t=>u(t)<0?null:sq(t,f),col:i===3?PAL.green:PAL.blue,lab,lo:0,hi:1}))});}
loop((dt,now)=>{if(vis('m26')){drawQZ(dt);G26();}});
})();

// ===== p3: breadboard layout =====
BBL.p3={power:5,parts:[{s:1,t:'res',a:'a10',b:'a14',v:1000},{s:2,t:'led',a:'c14',b:'c18'},{s:3,t:'led',a:'e18',b:'e14',rgb:'34,197,94',litOff:1},{s:4,t:'wire',a:'d10',b:[150,380],c:W_Y,freeB:1,lab:'A'},{s:4,t:'wire',a:'d18',b:[260,380],c:W_U,freeB:1,lab:'B'},{s:5,t:'batt',at:[330,360],plus:[150,380],minus:[260,380]}]};

(function(){   // demo
// P3 polarity tester
function P3(){const ctx=cv('cp3'),flip=Math.floor(CT/2.5)%2===1;
  part(ctx,'batt',80,flip?210:60,80,flip?60:210,{label:'9 V battery',left:true,flip});wire(ctx,[[80,60],[200,60]]);part(ctx,'res',200,60,300,60,{label:'1 kΩ'});wire(ctx,[[300,60],[480,60]]);
  wire(ctx,[[400,60],[400,95]]);part(ctx,'led',400,95,400,175,{glow:flip?0:1,label:'red',left:true});wire(ctx,[[400,175],[400,210]]);
  wire(ctx,[[480,60],[480,95]]);part(ctx,'led',480,175,480,95,{glow:flip?1:0,rgb:'34,197,94',label:'green'});wire(ctx,[[480,175],[480,210]]);
  wire(ctx,[[80,210],[480,210]]);dot(ctx,400,60);dot(ctx,400,210);txt(ctx,flip?'+ at the bottom: GREEN lights':'+ at the top: RED lights',660,130,flip?PAL.green:PAL.bad,14);}
// chart: one LED or the other, never both
function G3(){const ctx=$('cp3').getContext('2d'),flip=t=>Math.floor(t/2.5)%2===1;
  mScope(ctx,15,258,770,95,{title:'current in each LED (7 mA when it conducts)',span:10,lanes:true,
    traces:[{f:t=>flip(t)?0:7.1,col:PAL.redSoft,lab:'red LED',lo:0,hi:8},{f:t=>flip(t)?7.1:0,col:PAL.green,lab:'green LED',lo:0,hi:8}]});}
loop((dt,now)=>{if(vis('cp3')){P3(dt);G3();}});
})();

// ===== p4: breadboard layout =====
BBL.p4={power:7,parts:[{s:2,t:'btn',col:10},{s:2,t:'btn',col:25},{s:2,t:'btn',col:40},{s:3,t:'wire',a:'tp10',b:'a10',c:W_R},{s:3,t:'wire',a:'tp25',b:'a25',c:W_R},{s:3,t:'wire',a:'tp40',b:'a40',c:W_R},
  {s:4,t:'res',a:'j12',b:'j16',v:470},{s:4,t:'res',a:'j27',b:'j31',v:470},{s:4,t:'res',a:'j42',b:'j46',v:470},{s:5,t:'led',a:'h16',b:'h18'},{s:5,t:'led',a:'h31',b:'h33',rgb:'250,204,21'},{s:5,t:'led',a:'h46',b:'h48',rgb:'34,197,94'},
  {s:6,t:'wire',a:'j18',b:'bn18',c:W_B},{s:6,t:'wire',a:'j33',b:'bn33',c:W_B},{s:6,t:'wire',a:'j48',b:'bn48',c:W_B},{s:6,t:'wire',a:'tn3',b:'bn3',c:W_B},{s:7,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]};

(function(){   // demo
// P4 traffic light
function P4(){const ctx=cv('cp4'),seq=[[1,0,0],[1,1,0],[0,0,1],[0,1,0]],s=seq[Math.floor(CT/1.8)%4],cols=['239,68,68','250,204,21','34,197,94'],nm=['red','yellow','green'];
  part(ctx,'batt',60,40,60,220,{label:'9 V',left:true});wire(ctx,[[60,40],[600,40]]);wire(ctx,[[60,220],[600,220]]);
  [0,1,2].forEach(i=>{const x=220+i*160;part(ctx,'switch',x,40,x,90,{closed:!!s[i]});part(ctx,'res',x,90,x,140,{label:'470 Ω'});part(ctx,'led',x,145,x,210,{glow:s[i],rgb:cols[i],label:nm[i]});wire(ctx,[[x,140],[x,145]]);wire(ctx,[[x,210],[x,220]]);dot(ctx,x,40);dot(ctx,x,220);});
  txt(ctx,'one resistor per LED',700,130,PAL.muted,12);}
// chart: a timing diagram, one lane per LED
function G4(){const ctx=$('cp4').getContext('2d'),seq=[[1,0,0],[1,1,0],[0,0,1],[0,1,0]],st=(t,i)=>seq[Math.floor(t/1.8)%4][i];
  mScope(ctx,15,258,770,110,{title:'timing diagram: which LED is on (each switch closed = 15 mA)',span:10,lanes:true,
    traces:[['red',PAL.redSoft],['yellow',PAL.yellow],['green',PAL.green]].map(([n,c],i)=>({f:t=>st(t,i),col:c,lab:n,lo:0,hi:1}))});}
loop((dt,now)=>{if(vis('cp4')){P4(dt);G4();}});
})();

// ===== p5: breadboard layout + demo =====
BBL.p5={power:8,parts:[{s:2,t:'npn',c:'c20',b:'c21',e:'c22'},{s:2,t:'npn',c:'c30',b:'c31',e:'c32'},{s:3,t:'wire',a:'e22',b:'e31',c:W_O},{s:4,t:'wire',a:'d20',b:'d30',c:W_Y},{s:5,t:'wire',a:'b32',b:'tn33',c:W_B},
  {s:6,t:'led',a:'a36',b:'a30'},{s:6,t:'res',a:'b36',b:'tp37',v:470},{s:7,t:'res',a:'tp12',b:'a12',v:1000},{s:7,t:'wire',a:'b12',b:[150,400],c:W_U,freeB:1,lab:'pad A'},{s:7,t:'wire',a:'b21',b:[230,400],c:W_P,freeB:1,lab:'pad B'},{s:8,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'},{s:8,t:'note',at:[190,392],txt:'☝️',fs:20}]};
(function(){
// ---------- p5: why two transistors ----------
const P5W={n:2};document.querySelectorAll('.p5n').forEach(b=>b.addEventListener('click',()=>{P5W.n=+b.dataset.n;document.querySelectorAll('.p5n').forEach(x=>x.classList.toggle('active',x===b));}));
function drawP5W(){const ctx=cv('cp5w'),k=+$('p5skin').value,R=100e3*Math.pow(20,k),Ib=(9-0.7*P5W.n)/(R+1000),G=P5W.n===2?40000:200,avail=Ib*G,need=(9-2-0.2*P5W.n)/470,I=Math.min(avail,need),b=I/need;
  const fI=i=>i>=1e-3?(i*1000).toFixed(i<0.01?1:0)+' mA':(i*1e6).toFixed(1)+' µA';
  const box=(x,y,w,t1,t2,col)=>{ctx.fillStyle=PAL.panel;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,64,8);ctx.fill();ctx.stroke();txt(ctx,t1,x+w/2,y+22,PAL.muted,11);txt(ctx,t2,x+w/2,y+50,PAL.white,17);};
  const ar=(x1,x2,y,l)=>{W(ctx,[[x1,y],[x2-8,y]],PAL.muted2,2);ctx.fillStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(x2,y);ctx.lineTo(x2-9,y-5);ctx.lineTo(x2-9,y+5);ctx.fill();txt(ctx,l,(x1+x2)/2,y-8,PAL.yellow,12);};
  box(20,20,165,'finger (≈ '+(R>=1e6?(R/1e6).toFixed(1)+' MΩ':Math.round(R/1000)+' kΩ')+')',fI(Ib),'#fcd9b6');ar(185,230,52,'× 200');
  box(230,20,165,'transistor 1: up to',fI(Ib*200),PAL.blue);
  if(P5W.n===2){ar(395,440,52,'× 200');box(440,20,165,'transistor 2: up to',fI(Ib*40000),PAL.green);}
  // need vs available
  const y=130,x0=20,w=540,lg=v=>Math.max(0,Math.min(1,(Math.log10(v)+6)/6));
  ctx.fillStyle=PAL.raised;ctx.fillRect(x0,y,w,22);ctx.fillStyle=avail>=need?PAL.green:PAL.amber;ctx.fillRect(x0,y,w*lg(avail),22);
  const nx=x0+w*lg(need);ctx.strokeStyle=PAL.bad;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(nx,y-6);ctx.lineTo(nx,y+28);ctx.stroke();txt(ctx,'LED wants 14 mA',nx,y+44,PAL.bad,12);
  txt(ctx,'current available: '+fI(avail),x0,y-8,PAL.ink2,12,'left');['1 µA','10 µA','100 µA','1 mA','10 mA','100 mA','1 A'].forEach((l,i)=>txt(ctx,l,x0+w*i/6,y+64,PAL.muted2,10));
  // LED
  glowAt(ctx,690,90,b*0.95,'239,68,68',70);ctx.fillStyle=`rgba(239,68,68,${0.2+0.8*b})`;ctx.beginPath();ctx.arc(690,90,22,0,7);ctx.fill();
  txt(ctx,'LED current: '+fI(I),690,148,PAL.white,14);txt(ctx,b>0.97?'full brightness ✓':b>0.3?'dim':'barely glows',690,170,b>0.97?PAL.green:PAL.amber,13);}
loop((dt,now)=>{if(vis('cp5w'))drawP5W();});
})();

(function(){   // demo
// P5 touch switch
function P5(){const ctx=cv('cp5'),touch=(CT%4)<2;
  wire(ctx,[[60,30],[700,30]],PAL.redSoft);txt(ctx,'+9 V',56,34,PAL.redSoft,11,'right');wire(ctx,[[60,230],[700,230]],PAL.blue);txt(ctx,'0 V',56,234,PAL.blue,11,'right');
  part(ctx,'res',150,30,150,90,{label:'1 kΩ'});ctx.fillStyle='#d4af37';ctx.fillRect(140,92,20,10);ctx.fillRect(140,122,20,10);txt(ctx,'touch pads',120,116,'#d4af37',11,'right');
  if(touch)txt(ctx,'☝️',178,122,PAL.white,26);if(touch)__PR(ctx,{t:'part',k:'res',a:[150,90],b:[150,132],o:{label:'500 kΩ'}});wire(ctx,[[150,132],[150,160],[256,160]]);npnQ(ctx,290,160,touch);wire(ctx,[[300,194],[300,200],[356,200]]);npnQ(ctx,390,200,touch);wire(ctx,[[400,234],[400,230]]);
  wire(ctx,[[300,126],[300,110],[520,110]]);wire(ctx,[[400,110],[400,166]]);part(ctx,'res',520,30,520,72,{label:'470 Ω'});part(ctx,'led',520,72,520,110,{glow:touch?1:0});
  txt(ctx,touch?'finger on the pads: LED ON':'no touch: off',590,120,touch?PAL.good:PAL.muted,14);txt(ctx,'gain ≈ 200 × 200 = 40,000',590,145,PAL.muted,11);}
// chart: tiny current in the skin, big current in the LED
function G5(){const ctx=$('cp5').getContext('2d'),touch=t=>(t%4)<2;
  mScope(ctx,15,258,378,105,{title:'current through your finger',span:8,lo:0,hi:20,unit:'µA',traces:[{f:t=>touch(t)?17:0,col:'#d4af37'}]});
  mScope(ctx,407,258,378,105,{title:'LED current (× 40,000 thanks to the 2 transistors)',span:8,lo:0,hi:20,unit:'mA',traces:[{f:t=>touch(t)?14.7:0,col:PAL.redSoft}]});}
loop((dt,now)=>{if(vis('cp5')){P5(dt);G5();}});
})();

// ===== p6: breadboard layout =====
BBL.p6={power:0,parts:[{s:1,t:'box',at:[330,8],w:110,h:60,lab:'5 V relay',col:'#1d4ed8',pins:[{n:'coil 1',dx:30,dy:60,to:'j12',s:3,c:W_O},{n:'coil 2',dx:80,dy:60,to:'bn16',s:3,c:W_B}]},
  {s:2,t:'btn',col:10},{s:2,t:'wire',a:'tp10',b:'a10',c:W_R},{s:4,t:'led',a:'bn13',b:'h12'},{s:5,t:'wire',a:'tn3',b:'bn3',c:W_B},{s:5,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'},{s:7,t:'note',at:[560,400],txt:'variant: 1N4007 instead of the LED',c:PAL.muted}]};

(function(){   // demo
// P6 coil kick
function P6(){const ctx=cv('cp6'),ph=CT%4,on=ph<2,flash=ph>=2&&ph<2.25?1-(ph-2)/0.25:0;
  part(ctx,'batt',80,60,80,210,{label:'9 V',left:true});wire(ctx,[[80,60],[160,60]]);part(ctx,'switch',160,60,240,60,{closed:on,label:'button'});wire(ctx,[[240,60],[400,60],[400,90]]);
  part(ctx,'coil',400,90,400,180,{core:true,label:'coil'});wire(ctx,[[400,180],[400,210],[80,210]]);
  wire(ctx,[[400,75],[500,75],[500,95]]);part(ctx,'led',500,175,500,95,{glow:flash,label:'LED (backwards)'});wire(ctx,[[500,175],[500,195],[400,195]]);
  txt(ctx,on?'pressed: current builds up in the coil':flash>0?'released: FLASH! the kick lights the LED':'released',300,238,flash>0?Y:PAL.muted,13);}
// charts (slow motion: in the real circuit the current builds in ~5 ms and the kick lasts ~1 ms)
function G6(){const ctx=$('cp6').getContext('2d'),I0=120,i=t=>{const p=t%4;if(p<2)return I0*(1-Math.exp(-p/0.3));return I0*(1-Math.exp(-2/0.3))*Math.exp(-(p-2)/0.08);};
  mScope(ctx,15,258,378,110,{title:'current in the coil',span:6,lo:0,hi:140,unit:'mA',note:'slow motion',traces:[{f:i,col:PAL.orange}]});
  mScope(ctx,407,258,378,110,{title:'voltage across the coil',span:6,lo:-4,hi:10,unit:'V',note:'slow motion',refs:[[-1.9,'kick: the LED catches it']],
    traces:[{f:t=>{const p=t%4;return p<2?9:i(t)>2?-1.9:0;},col:PAL.yellow}]});}
loop((dt,now)=>{if(vis('cp6')){P6(dt);G6();}});
})();

// ===== p7: breadboard layout =====
BBL.p7={power:9,parts:[{s:1,t:'pm'},{s:2,t:'npn',c:'h20',b:'h21',e:'h22'},{s:2,t:'wire',a:'j22',b:'bn23',c:W_B},{s:3,t:'btn',col:10},{s:3,t:'wire',a:'tp10',b:'a10',c:W_R},
  {s:4,t:'res',a:'j12',b:'j21',v:1000},{s:4,t:'res',a:'i21',b:'bn25',v:10000},
  {s:5,t:'box',at:[300,350],w:120,h:62,lab:'5 V relay',col:'#1d4ed8',ly:34,pins:[{n:'coil',dx:20,dy:0,to:'bp17',c:W_R},{n:'coil',dx:45,dy:0,to:'g20',c:W_O},{n:'COM',dx:75,dy:0,to:'tp44',s:7,c:W_R},{n:'NC',dx:95,dy:0,to:'a45',s:7,c:W_Y},{n:'NO',dx:115,dy:0,to:'a55',s:7,c:W_G}]},
  {s:6,t:'diode',a:'f20',b:'bp19'},
  {s:8,t:'res',a:'b45',b:'b48',v:220},{s:8,t:'led',a:'c48',b:'c49'},{s:8,t:'wire',a:'d49',b:'tn49',c:W_B},{s:8,t:'res',a:'b55',b:'b58',v:220},{s:8,t:'led',a:'c58',b:'c59',rgb:'34,197,94',litOff:1},{s:8,t:'wire',a:'d59',b:'tn59',c:W_B}]};

(function(){   // demo
// P7 relay clicker
function P7(){const ctx=cv('cp7'),on=(CT%3)<1.5;
  wire(ctx,[[60,30],[360,30]],PAL.redSoft);txt(ctx,'+5 V',56,34,PAL.redSoft,11,'right');part(ctx,'switch',100,30,100,90,{closed:on,label:'button'});part(ctx,'res',100,90,100,150,{label:'1 kΩ'});wire(ctx,[[100,150],[100,170],[226,170]]);
  txt(ctx,'0 V',56,234,PAL.blue,11,'right');
  npnQ(ctx,260,170,on);part(ctx,'coil',270,30,270,136,{label:'coil',left:true});wire(ctx,[[270,204],[270,230],[60,230]],PAL.blue);
  wire(ctx,[[270,40],[330,40],[330,60]]);part(ctx,'diode',330,120,330,60,{col:PAL.good});wire(ctx,[[330,120],[330,128],[270,128]]);
  // contacts
  ctx.setLineDash([4,4]);ctx.strokeStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(290,85);ctx.lineTo(450,110);ctx.stroke();ctx.setLineDash([]);
  wire(ctx,[[450,110],[450,200]],PAL.violet);txt(ctx,'COM',440,210,PAL.muted,10);ctx.fillStyle=PAL.ink2;ctx.save();ctx.translate(450,110);ctx.rotate(on?0.3:-0.3);ctx.fillRect(0,-2,60,4);ctx.restore();
  wire(ctx,[[512,90],[600,90]],PAL.violet);wire(ctx,[[512,130],[600,130]],PAL.violet);txt(ctx,'NC',520,82,PAL.redLight,10);txt(ctx,'NO',520,146,PAL.greenLight,10);
  part(ctx,'led',600,90,700,90,{glow:on?0:1});part(ctx,'led',600,130,700,130,{glow:on?1:0,rgb:'34,197,94'});wire(ctx,[[700,90],[740,90],[740,200],[450,200]],PAL.violet);wire(ctx,[[700,130],[740,130]],PAL.violet);
  txt(ctx,on?'click → green':'rest → red',620,230,on?PAL.green:PAL.bad,13);}
// charts (slow motion: the real coil current takes ~1 ms to build)
function G7(){const ctx=$('cp7').getContext('2d'),I0=70,i=t=>{const p=t%3;return p<1.5?I0*(1-Math.exp(-p/0.15)):I0*(1-Math.exp(-1.5/0.15))*Math.exp(-(p-1.5)/0.15);};
  mScope(ctx,15,258,378,110,{title:'coil current',span:6,lo:0,hi:80,unit:'mA',note:'slow motion',refs:[[50,'the contact moves']],traces:[{f:i,col:PAL.orange}]});
  mScope(ctx,407,258,378,110,{title:'transistor collector voltage',span:6,lo:0,hi:7,unit:'V',note:'slow motion',refs:[[5.7,'diode: max 0.7 V above +5 V']],
    traces:[{f:t=>{const p=t%3;return p<1.5?0.1:i(t)>2?5.7:5;},col:PAL.violet}]});}
loop((dt,now)=>{if(vis('cp7')){P7(dt);G7();}});
})();

// ===== p8: breadboard layout =====
BBL.p8={power:8,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:1,t:'chip',col:20,n:8,lab:'NE555'},
  {s:2,t:'wire',a:'d20',b:'tp20',c:W_R},{s:2,t:'wire',a:'j23',b:'bp23',c:W_R},{s:2,t:'wire',a:'j20',b:'bn20',c:W_B},{s:3,t:'res',a:'c20',b:'c21',v:1000},{s:4,t:'res',a:'b21',b:'b22',v:47000},
  {s:5,t:'wire',a:'a22',b:'j21',c:W_U},{s:6,t:'ecap',a:'i21',b:'bn21',lab:'10µ'},{s:7,t:'res',a:'h22',b:'h28',v:470},{s:7,t:'led',a:'g28',b:'g30',blink:1},{s:7,t:'wire',a:'j30',b:'bn30',c:W_B},
  {s:8,t:'ccap',a:'a23',b:'tn24',lab:'10n'},{s:8,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]};

(function(){   // demo
// P8 555
const T8={th:0.693*48000*10e-6,tl:0.693*47000*10e-6};   // R1 1k, R2 47k, 10 µF: 0.33 s on, 0.33 s off
function P8(){const ctx=cv('cp8'),on=m555(CT,T8.th,T8.tl,9).out>1;
  wire(ctx,[[60,30],[620,30]],PAL.redSoft);wire(ctx,[[60,235],[620,235]],PAL.blue);txt(ctx,'+9 V',56,34,PAL.redSoft,11,'right');txt(ctx,'0 V',56,239,PAL.blue,11,'right');
  __PR(ctx,{t:'chip',x:300,y:85,w:120,h:130});ctx.fillStyle=PAL.chip;ctx.fillRect(300,85,120,130);ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.strokeRect(300,85,120,130);txt(ctx,'NE555',360,155,PAL.ink,14);
  [['8',320,99],['4',345,99],['7',306,124,'left'],['6',306,184,'left'],['2',306,204,'left'],['3',414,154,'right'],['1',360,211]].forEach(([n,x,y,a])=>txt(ctx,n,x,y,PAL.muted,10,a||'center'));
  wire(ctx,[[320,30],[320,85]]);wire(ctx,[[345,30],[345,85]]);
  part(ctx,'res',180,30,180,120,{label:'R1 1k',left:true});dot(ctx,180,120);wire(ctx,[[180,120],[300,120]]);
  part(ctx,'res',180,120,180,180,{label:'R2 47k',left:true});dot(ctx,180,180);wire(ctx,[[180,180],[300,180]]);wire(ctx,[[180,180],[180,200],[300,200]]);
  part(ctx,'cap',180,200,180,235,{label:'10 µF',left:true});wire(ctx,[[360,215],[360,235]]);
  wire(ctx,[[420,150],[460,150]]);part(ctx,'res',460,150,540,150,{label:'470 Ω'});wire(ctx,[[540,150],[570,150],[570,160]]);part(ctx,'led',570,160,570,225,{glow:on?1:0});wire(ctx,[[570,225],[570,235]]);
  txt(ctx,'≈ 1.5 blinks/s',700,130,Y,14);}
// chart: the capacitor goes up and down between ⅓ and ⅔ of 9 V; the output flips each time it reaches one of them
function G8(){const ctx=$('cp8').getContext('2d');
  mScope(ctx,15,258,770,115,{title:'555 voltages over time',span:3,lo:0,hi:9,unit:'V',refs:[[3,'⅓ of 9 V: output goes HIGH'],[6,'⅔ of 9 V: output goes LOW']],
    traces:[{f:t=>m555(t,T8.th,T8.tl,9).vc,col:PAL.blue,lab:'capacitor (pins 2 + 6)'},{f:t=>m555(t,T8.th,T8.tl,9).out,col:Y,lab:'output (pin 3) → LED'}]});}
loop((dt,now)=>{if(vis('cp8')){P8(dt);G8();}});
})();

// ===== p9: breadboard layout =====
BBL.p9={power:9,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:2,t:'chip',col:8,n:8,lab:'555'},{s:2,t:'wire',a:'d8',b:'tp8',c:W_R},{s:2,t:'wire',a:'j11',b:'bp11',c:W_R},{s:2,t:'wire',a:'j8',b:'bn8',c:W_B},
  {s:3,t:'res',a:'c8',b:'c9',v:1000},{s:3,t:'res',a:'b9',b:'b10',v:47000},{s:3,t:'wire',a:'a10',b:'i9',c:W_U},{s:3,t:'ecap',a:'h9',b:'bn9',lab:'10µ'},
  {s:4,t:'chip',col:35,n:16,lab:'CD4017'},{s:4,t:'wire',a:'d35',b:'tp35',c:W_R},{s:4,t:'wire',a:'j42',b:'bn42',c:W_B},{s:5,t:'wire',a:'d38',b:'bn38',c:W_B},{s:5,t:'wire',a:'c36',b:'bn36',c:W_B},
  {s:6,t:'wire',a:'g10',b:'c37',c:W_Y},
  ...[['h37',46],['h36',47],['h38',48],['h41',49],['b41',50],['h35',51],['h39',52],['h40',53],['b42',54],['b40',55]].flatMap(([o,c],i)=>[{s:7,t:'wire',a:o,b:'a'+c,c:[PAL.greenDark,'#0ea5e9','#a855f7',PAL.orange,'#eab308','#14b8a6','#ec4899','#84cc16','#6366f1','#f43f5e'][i]},{s:7,t:'led',a:'c'+c,b:'tn'+c,chase:i}]),
  {s:8,t:'res',a:'tn57',b:'bn57',v:470},{s:9,t:'batt',at:[40,30],plus:'tp1',minus:'bn2'}]};

(function(){   // demo
// P9 chaser
function P9(){const ctx=cv('cp9'),q=Math.floor(CT*4)%10;boxChip(ctx,40,90,90,80,'555');boxChip(ctx,220,70,120,120,'CD4017');
  wire(ctx,[[130,130],[220,130]],Y);txt(ctx,'clock (pin 3 → 14)',175,120,Y,10);
  for(let i=0;i<10;i++){const x=400+i*38,y=130;W(ctx,[[340,80+i*11],[360,80+i*11],[x,y-14]],PAL.slate,1.5);glowAt(ctx,x,y,i===q?1:0);ctx.fillStyle=i===q?PAL.bad:'#3f1d1d';ctx.beginPath();ctx.arc(x,y,12,0,7);ctx.fill();txt(ctx,'Q'+i,x,y+30,PAL.muted,10);}
  txt(ctx,'each clock pulse → the next LED',585,200,PAL.muted,12);}
// chart: a timing diagram: each rising edge of the clock moves the HIGH to the next output
function G9(){const ctx=$('cp9').getContext('2d'),q=t=>Math.floor(t*4)%10;
  mScope(ctx,15,250,770,142,{title:'timing diagram (9 V = HIGH)',span:3,lanes:true,
    traces:[{f:t=>(t*4)%1<0.5?9:0,col:Y,lab:'clock (pin 14)',lo:0,hi:9}].concat([0,1,2,3].map(k=>({f:t=>q(t)===k?9:0,col:PAL.redSoft,lab:'Q'+k+' → LED '+(k+1),lo:0,hi:9})))});}
loop((dt,now)=>{if(vis('cp9')){P9(dt);G9();}});
})();

// ===== rl1: breadboard layout =====
BBL.rl1={power:7,noBoard:1,parts:[
  {s:0,t:'box',at:[40,150],w:150,h:60,lab:'18650 holder',col:PAL.slateDark,ly:34,pins:[{n:'red +',dx:150,dy:18,to:[290,168],s:2,c:W_R},{n:'black −',dx:150,dy:44,to:[290,194],s:2,c:PAL.muted}]},
  {s:6,t:'cell',at:[57,165]},
  {s:0,t:'box',at:[290,140],w:120,h:80,lab:'BMS 1S',col:PAL.chip,ly:44,pins:[{n:'B+',dx:0,dy:28},{n:'B−',dx:0,dy:54},{n:'P+',dx:120,dy:28},{n:'P−',dx:120,dy:54}]},
  {s:0,t:'box',at:[510,60],w:150,h:80,lab:'TP4056 charger',col:'#1d4ed8',ly:30,lit:{at:[560,120],c:'rgba(239,68,68,0.9)'},pins:[{n:'B+',dx:0,dy:58,to:[410,168],s:3,c:W_R},{n:'B−',dx:0,dy:72,to:[410,194],s:3,c:PAL.muted}]},
  {s:0,t:'box',at:[510,250],w:150,h:70,lab:'load (switch + LED)',col:PAL.chipLight,ly:30,pins:[{n:'+',dx:0,dy:24,to:[410,168],s:4,c:W_R},{n:'−',dx:0,dy:50,to:[410,194],s:4,c:PAL.muted}]},
  {s:7,t:'box',at:[690,80],w:80,h:40,lab:'USB 5 V',col:'#4b5563',ly:24,pins:[{dx:0,dy:20,to:[660,100],c:PAL.muted}]},
  {s:0,t:'note',at:[400,420],txt:'Not a breadboard build: the modules are wired (soldered) together.',c:PAL.muted}]};

(function(){   // demo
// ===== Real life A: Li-ion charger =====
const BC={on:false,s:0.12,t:0,h:[],Iset:1,done:false};
choices('bcChoices',['R_PROG 1.2 kΩ → 1 A','R_PROG 2.4 kΩ → 0.5 A'],0,i=>{BC.Iset=i?0.5:1;});
$('bcGo').onclick=()=>{BC.on=!BC.on;if(BC.on&&BC.done){BC.s=0.12;BC.t=0;BC.h=[];BC.done=false;}$('bcGo').textContent=BC.on?'⏏ Unplug USB':'▶ Plug in USB';};
const ocv=s=>3.0+0.95*s+0.25*Math.pow(s,6);
function stepBC(dt){const CAP=2.5,Rin=0.12;let I=0,V=ocv(BC.s),phase='idle';
  if(BC.on&&!BC.done){const vcc=ocv(BC.s)+BC.Iset*Rin;if(vcc<4.2){I=BC.Iset;phase='CC';}else{I=Math.max(0,(4.2-ocv(BC.s))/Rin);I=Math.min(I,BC.Iset);phase='CV';}
    V=ocv(BC.s)+I*Rin;if(phase==='CV'&&I<0.1*BC.Iset){BC.done=true;}
    const mins=dt*(+$('bcSp').value);BC.t+=mins;BC.s=Math.min(1,BC.s+I*(mins/60)/CAP);BC.h.push({t:BC.t,V,I:I/BC.Iset});}
  return {I,V,phase:BC.done?'done':phase};}
function drawBC(dt){const r=stepBC(dt),ctx=cv('cBat');
  // USB + module + cell
  ctx.fillStyle=PAL.slate;ctx.fillRect(20,120,60,40);txt(ctx,'USB 5 V',50,145,PAL.white,12);wire(ctx,[[80,130],[120,130]],PAL.redSoft);wire(ctx,[[80,150],[120,150]],PAL.blue);
  ctx.fillStyle='#1d4ed8';ctx.fillRect(120,95,150,90);ctx.strokeStyle=PAL.link;ctx.lineWidth=1.5;ctx.strokeRect(120,95,150,90);txt(ctx,'TP4056 + protection',195,125,'#e0e7ff',11);
  const red=BC.on&&!BC.done,blue=BC.on&&BC.done;glowAt(ctx,165,160,red?0.9:0,'239,68,68',20);glowAt(ctx,225,160,blue?0.9:0,'59,130,246',20);
  ctx.fillStyle=red?PAL.bad:'#3f1d1d';ctx.beginPath();ctx.arc(165,160,6,0,7);ctx.fill();ctx.fillStyle=blue?PAL.water:'#1e2a4a';ctx.beginPath();ctx.arc(225,160,6,0,7);ctx.fill();
  txt(ctx,'charging',165,178,PAL.muted,9);txt(ctx,'full',225,178,PAL.muted,9);
  wire(ctx,[[270,120],[320,120]],PAL.redSoft);wire(ctx,[[270,160],[320,160]],PAL.blue);txt(ctx,'B+',290,112,PAL.muted,10);txt(ctx,'B−',290,176,PAL.muted,10);
  // 18650
  const bx=320,by=90,bw=150,bh=100;ctx.fillStyle='#0f766e';ctx.beginPath();ctx.roundRect(bx,by,bw,bh,14);ctx.fill();ctx.fillStyle=PAL.muted;ctx.fillRect(bx+bw,by+35,8,30);
  ctx.fillStyle='#134e4a';ctx.fillRect(bx+12,by+14,bw-24,bh-28);ctx.fillStyle=BC.s>0.2?PAL.green:PAL.amber;ctx.fillRect(bx+12,by+14,(bw-24)*BC.s,bh-28);
  txt(ctx,Math.round(BC.s*100)+'%',bx+bw/2,by+bh/2+6,PAL.white,18);txt(ctx,'18650 · 2500 mAh',bx+bw/2,by+bh+18,PAL.muted,11);
  const ph={idle:['not charging',PAL.muted],CC:['Phase 1: constant CURRENT',PAL.yellow],CV:['Phase 2: constant VOLTAGE (4.2 V)',PAL.blue],done:['Done: charger stopped',PAL.good]}[r.phase];
  txt(ctx,ph[0],245,40,ph[1],15);txt(ctx,BC.on&&!BC.done?r.V.toFixed(2)+' V · '+(r.I*1000).toFixed(0)+' mA':'',245,62,PAL.ink,13);
  txt(ctx,'elapsed: '+Math.floor(BC.t/60)+' h '+String(Math.floor(BC.t%60)).padStart(2,'0')+' min',245,250,PAL.muted,12);
  // graphs vs time
  const tmax=Math.max(60,2.5/BC.Iset*60*1.25),gx=520,gw=260;
  const g=(y,h,k,min,max,col,l)=>{ctx.fillStyle=PAL.raised;ctx.fillRect(gx,y,gw,h);txt(ctx,l,gx+4,y-6,col,11,'left');ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();BC.h.forEach((p,i)=>{const x=gx+p.t/tmax*gw,yy=y+h-(p[k]-min)/(max-min)*h;i?ctx.lineTo(x,yy):ctx.moveTo(x,yy);});ctx.stroke();};
  g(30,110,'V',2.9,4.3,PAL.blue,'battery voltage (3.0 → 4.2 V)');g(180,110,'I',0,1.1,Y,'charge current');
  const y42=30+110-(4.2-2.9)/1.4*110;ctx.setLineDash([4,4]);ctx.strokeStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(gx,y42);ctx.lineTo(gx+gw,y42);ctx.stroke();ctx.setLineDash([]);txt(ctx,'4.2 V',gx+gw+4,y42+4,PAL.muted,10,'left');
  txt(ctx,'time → ('+Math.round(tmax/60*10)/10+' h)',gx+gw,310,PAL.muted,10,'right');}
loop((dt,now)=>{drawBC(dt);});
})();

// ===== rl2: breadboard layout =====
BBL.rl2={power:11,parts:[
  {s:1,t:'box',at:[20,8],w:110,h:56,lab:'12 V in (PCM10F)',col:PAL.chipLight,ly:28,fs:10,pins:[{n:'+',dx:35,dy:56,to:'tp1',c:W_R},{n:'−',dx:80,dy:56,to:'tn2',c:W_B}]},{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},
  {s:2,t:'res',a:'tp10',b:'a10',v:10000},{s:2,t:'ldr',a:'c10',b:'tn11'},{s:3,t:'chip',col:20,n:8,lab:'LM358'},
  {s:4,t:'wire',a:'d20',b:'tp20',c:W_R},{s:4,t:'wire',a:'j23',b:'bn23',c:W_B},{s:4,t:'ccap',a:'b20',b:'tn21',lab:'100n'},
  {s:5,t:'wire',a:'e10',b:'g22',c:W_Y},{s:6,t:'pot',h:['a12','a13','a14']},{s:6,t:'wire',a:'b12',b:'tp12',c:W_R},{s:6,t:'wire',a:'b14',b:'tn15',c:W_B},{s:6,t:'wire',a:'c13',b:'h21',c:W_U},
  {s:7,t:'res',a:'i20',b:'i22',v:1000000},{s:8,t:'npn',c:'g30',b:'g31',e:'g32'},{s:8,t:'res',a:'h20',b:'h31',v:1000},{s:8,t:'wire',a:'j32',b:'bn33',c:W_B},
  {s:9,t:'box',at:[330,350],w:120,h:62,lab:'12 V relay',col:'#1d4ed8',ly:36,pins:[{n:'coil',dx:20,dy:0,to:'bp38',c:W_R},{n:'coil',dx:45,dy:0,to:'i30',c:W_O},{n:'COM',dx:80,dy:0,to:'tp44',s:10,c:W_R},{n:'NO',dx:108,dy:0,to:[560,60],s:10,c:W_G}]},
  {s:9,t:'diode',a:'j30',b:'bp36'},
  {s:10,t:'box',at:[540,8],w:120,h:56,lab:'💡 12 V lamp',col:PAL.chipLight,ly:30,lit:{at:[600,36],c:'rgba(250,204,21,0.9)'},pins:[{n:'1',dx:20,dy:56},{n:'2',dx:100,dy:56,to:'tn48',c:W_B}]}]};

(function(){   // demo
// ===== Real life B: light detector → relay → lamp =====
const LDT={on:false,auto:false,t:0,click:0};
$('ldAuto').onclick=()=>{LDT.auto=!LDT.auto;LDT.t=0;$('ldAuto').textContent=LDT.auto?'⏸ Stop':'🌅 Run a day';};
function drawLD(dt){if(LDT.auto){LDT.t+=dt;$('ldL').value=(0.5+0.5*Math.cos(LDT.t*0.35)).toFixed(3);}
  const L=+$('ldL').value,Th=+$('ldT').value,ldr=1000*Math.pow(200,1-L),Vn=12*ldr/(10000+ldr);
  const was=LDT.on;if(!LDT.on&&Vn>Th+0.3)LDT.on=true;else if(LDT.on&&Vn<Th-0.3)LDT.on=false;if(was!==LDT.on)LDT.click=0.5;LDT.click=Math.max(0,LDT.click-dt);
  const ctx=cv('cLight');
  ctx.fillStyle=`rgb(${Math.round(10+60*L)},${Math.round(15+110*L)},${Math.round(40+150*L)})`;ctx.fillRect(640,0,160,340);txt(ctx,L>0.45?'☀️':'🌙',720,70,PAL.white,36);
  wire(ctx,[[40,30],[620,30]],PAL.redSoft);txt(ctx,'+12 V',36,34,PAL.redSoft,11,'right');wire(ctx,[[40,300],[620,300]],PAL.blue);txt(ctx,'0 V',36,304,PAL.blue,11,'right');
  part(ctx,'res',90,30,90,140,{label:'10 kΩ',left:true});part(ctx,'ldr',90,140,90,300,{label:'LDR '+(ldr>=1000?(ldr/1000).toFixed(ldr<1e4?1:0)+'k':Math.round(ldr)),left:true});dot(ctx,90,140);
  part(ctx,'pot',170,30,170,300,{});txt(ctx,'threshold',178,100,Y,11,'left');dot(ctx,170,165);
  // opamp
  const ox=230,oy=150;ctx.strokeStyle=LDT.on?PAL.good:WIRE;ctx.lineWidth=2.5;ctx.fillStyle=BG;ctx.beginPath();ctx.moveTo(ox,oy-40);ctx.lineTo(ox+70,oy);ctx.lineTo(ox,oy+40);ctx.closePath();ctx.fill();ctx.stroke();
  txt(ctx,'+',ox+10,oy-14,PAL.redSoft,14,'left');txt(ctx,'−',ox+10,oy+22,PAL.blue,14,'left');txt(ctx,'LM358',ox+28,oy+4,PAL.muted,9);
  wire(ctx,[[90,140],[120,140],[120,132],[ox,132]]);wire(ctx,[[170,165],[200,165],[200,168],[ox,168]]);
  wire(ctx,[[ox+70,oy],[320,oy]]);part(ctx,'res',320,oy,380,oy,{label:'1 kΩ'});wire(ctx,[[380,oy],[396,oy]]);npnQ(ctx,430,oy,LDT.on);wire(ctx,[[440,oy+34],[440,300]]);
  part(ctx,'coil',440,30,440,oy-34,{label:'relay',left:true});wire(ctx,[[440,40],[490,40],[490,55]]);part(ctx,'diode',490,100,490,55,{col:PAL.good});wire(ctx,[[490,100],[490,110],[440,110]]);
  // contact + lamp
  ctx.setLineDash([4,4]);ctx.strokeStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(458,80);ctx.lineTo(540,180);ctx.stroke();ctx.setLineDash([]);
  wire(ctx,[[540,30],[540,180]],PAL.violet);ctx.fillStyle=PAL.ink2;ctx.save();ctx.translate(540,180);ctx.rotate(LDT.on?0.5:0.05);ctx.fillRect(0,-2,40,4);ctx.restore();
  wire(ctx,[[575,200],[600,200],[600,215]],PAL.violet);part(ctx,'lamp',600,215,600,275,{glow:LDT.on?1:0});wire(ctx,[[600,275],[600,300]],PAL.violet);txt(ctx,'12 V lamp',606,292,PAL.muted,10,'left');
  if(LDT.click>0)txt(ctx,'CLICK',520,150,Y,14);
  // comparison gauge
  const gx=250,gy=250,gw=180;ctx.fillStyle=PAL.raised;ctx.fillRect(gx,gy,gw,12);const X=v=>gx+v/12*gw;
  ctx.fillStyle='rgba(251,191,36,.3)';ctx.fillRect(X(Th-0.3),gy-4,X(Th+0.3)-X(Th-0.3),20);ctx.fillStyle=Y;ctx.fillRect(X(Th)-1,gy-6,2,24);
  ctx.fillStyle=PAL.blue;ctx.beginPath();ctx.arc(X(Vn),gy+6,7,0,7);ctx.fill();
  txt(ctx,'sensor '+Vn.toFixed(1)+' V vs threshold '+Th.toFixed(1)+' V',gx+gw/2,gy-12,PAL.ink,11);txt(ctx,'(yellow band = hysteresis)',gx+gw/2,gy+30,PAL.muted,10);
  txt(ctx,LDT.on?'DARK: lamp ON':'BRIGHT: lamp off',720,140,PAL.white,14);}
// charts: the sensor voltage must cross the whole yellow band to switch the lamp (hysteresis)
const LDR_={v:mRec(),hi:mRec(),lo:mRec(),on:mRec()};
function G_LD(){const ctx=$('cLight').getContext('2d'),L=+$('ldL').value,Th=+$('ldT').value,ldr=1000*Math.pow(200,1-L),Vn=12*ldr/(10000+ldr);
  mRecPush(LDR_.v,Vn);mRecPush(LDR_.hi,Th+0.3);mRecPush(LDR_.lo,Th-0.3);mRecPush(LDR_.on,LDT.on?1:0);
  mScope(ctx,15,348,500,115,{title:'sensor voltage vs threshold (move the light, or 🌅 Run a day)',span:30,lo:0,hi:12,unit:'V',
    traces:[{rec:LDR_.hi,col:PAL.amber,lab:'switch-on'},{rec:LDR_.lo,col:'#a16207',lab:'switch-off'},{rec:LDR_.v,col:PAL.sky,lab:'sensor'}]});
  mScope(ctx,527,348,258,115,{title:'lamp',span:30,lanes:true,traces:[{rec:LDR_.on,col:PAL.yellow,lab:'ON / off',lo:0,hi:1}]});}
loop((dt,now)=>{drawLD(dt);G_LD();});
})();

// ===== Circuits page: wiring checklists, breadboard drawing (loaded after projects/*.js) =====
// wire up final + live canvases
window.BBL_LAYOUTS=BBL;   // read by the Build lab ("🔧 Build it" buttons)
const BBV=[];
document.querySelectorAll('.cl-content section').forEach(sec=>{const id=sec.id;if(!BBL[id])return;const F=document.getElementById('bbF_'+id),S=document.getElementById('bbS_'+id);
  const boxes=[...sec.querySelectorAll('.wsteps input[type=checkbox]')];BBV.push({id,F,S,boxes});});
function drawBBs(t){BBV.forEach(v=>{if(vis('bbF_'+v.id))renderBB(v.id,v.F.getContext('2d'),null,t);if(vis('bbS_'+v.id)){const T=new Set();v.boxes.forEach((b,i)=>{if(b.checked)T.add(i+1);});renderBB(v.id,v.S.getContext('2d'),T,t);}});}
loop((dt,now)=>{drawBBs(CT);});


})();
