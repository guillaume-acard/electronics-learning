
// ================= build =================
(function(){
const PG=document.getElementById('page-build');
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

// ===== Build lab: the parts catalog =====
// One entry per part type. foot: the holes its legs use, as [row offset, column offset] from the anchor hole,
// in the row order of ROWS (tp tn a b c d e f g h i j bp bn); it turns with the part (rot 0–3).
// anchor: rows the anchor may use ('rails' = tp/bp only, 'e'/'f' = straddles the gap). props: default values.
// edit: what the Properties panel shows. model(): adds the part to the simulator. watch(): what we read back
// (current, power, light...) and the limits that burn it.
const RES_VALUES=[];for(let d=10;d<=100000;d*=10)E12.forEach(v=>RES_VALUES.push(Math.round(v*d)));RES_VALUES.push(1e6);   // E12 from helpers2.js
const CAP_VALUES=[1e-9,2.2e-9,4.7e-9,10e-9,22e-9,47e-9,100e-9,220e-9,470e-9,1e-6,2.2e-6,4.7e-6,10e-6,22e-6,47e-6,100e-6,220e-6,470e-6,1000e-6];
const LEDS={red:{rgb:'239,68,68',vf:1.9},yellow:{rgb:'250,204,21',vf:2.0},green:{rgb:'34,197,94',vf:2.1},blue:{rgb:'59,130,246',vf:3.0},white:{rgb:'226,232,240',vf:3.0}};
const fmtR=r=>r>=1e6?+(r/1e6).toPrecision(3)+' MΩ':r>=1e3?+(r/1e3).toPrecision(3)+' kΩ':+r.toPrecision(3)+' Ω';
const fmtC=c=>c>=1e-6?+(c*1e6).toPrecision(3)+' µF':c>=1e-9?+(c*1e9).toPrecision(3)+' nF':+(c*1e12).toPrecision(3)+' pF';
const fmtI=i=>{i=Math.abs(i);return i<1e-6?'0 mA':i<1e-3?(i*1e6).toFixed(0)+' µA':i<1?(i*1e3).toFixed(i<0.01?2:1)+' mA':i.toFixed(2)+' A';};
const fmtV=v=>Math.abs(v)<1?(v*1000).toFixed(0)+' mV':v.toFixed(2)+' V';
const fmtP=p=>p<1?(p*1000).toFixed(0)+' mW':p.toFixed(2)+' W';

const PARTS={
 batt:{name:'9 V battery',group:'Power',icon:'🔋',foot:[[0,0],[1,1]],pins:['+','−'],anchor:'rails',rotate:false,
   props:{V:9},edit:[{k:'V',label:'Voltage',opts:[[9,'9 V'],[4.5,'4.5 V (3 × AA)'],[3,'3 V (2 × AA)']]}],
   model:(c,n,p)=>({bat:c.Vs(n['+'],n['−'],p.props.V,1.5)}),
   watch:(el)=>({I:el.bat.i,P:Math.abs(el.bat.i*el.bat.v),info:[['Delivers',fmtI(el.bat.i)],['Voltage',fmtV(el.bat.v)]]})},
 usb:{name:'USB 5 V module',group:'Power',icon:'⚡',foot:null,pins:['+','−'],fixed:{'+':'tp1','−':'tn1'},rotate:false,unique:true,
   props:{},edit:[],
   model:(c,n)=>({src:c.Vs(n['+'],n['−'],5,0.2)}),
   watch:(el)=>({I:el.src.i,info:[['Delivers',fmtI(el.src.i)],['Voltage',fmtV(el.src.v)]],over:el.src.i>0.8?'more than 0.8 A: the module cuts out':''})},
 res:{name:'Resistor',group:'Passive',icon:'Ω',foot:[[0,0],[0,4]],pins:['1','2'],rotate:true,
   props:{R:470},edit:[{k:'R',label:'Value',opts:RES_VALUES.map(v=>[v,fmtR(v)])}],
   model:(c,n,p)=>({r:c.R(n['1'],n['2'],p.props.R)}),
   watch:(el)=>({I:el.r.i,P:el.r.p,info:[['Current',fmtI(el.r.i)],['Voltage',fmtV(el.r.v)],['Power',fmtP(el.r.p)+' (max 250 mW)']],over:el.r.p>0.25?'more than ¼ W: it overheats':''})},
 pot:{name:'Trimmer / pot',group:'Passive',icon:'⟳',foot:[[0,0],[0,1],[0,2]],pins:['1','W','3'],rotate:true,
   props:{R:10000,pos:0.5},edit:[{k:'R',label:'Value',opts:[[1000,'1 kΩ'],[10000,'10 kΩ'],[47000,'47 kΩ'],[100000,'100 kΩ']]},{k:'pos',label:'Knob',range:[0,1,0.01],live:true}],
   model:(c,n,p)=>({a:c.R(n['1'],n['W'],Math.max(1,p.props.R*p.props.pos)),b:c.R(n['W'],n['3'],Math.max(1,p.props.R*(1-p.props.pos)))}),
   update:(el,p)=>{el.a.g=1/Math.max(1,p.props.R*p.props.pos);el.b.g=1/Math.max(1,p.props.R*(1-p.props.pos));},
   watch:(el)=>({I:Math.max(Math.abs(el.a.i),Math.abs(el.b.i)),P:el.a.p+el.b.p,info:[['Wiper current',fmtI(el.a.i-el.b.i)],['Power',fmtP(el.a.p+el.b.p)]],over:el.a.p+el.b.p>0.25?'more than ¼ W':''})},
 ccap:{name:'Ceramic capacitor',group:'Passive',icon:'⊥',foot:[[0,0],[0,2]],pins:['1','2'],rotate:true,
   props:{C:100e-9,Vmax:50},edit:[{k:'C',label:'Value',opts:CAP_VALUES.filter(v=>v<=1e-6).map(v=>[v,fmtC(v)])}],
   model:(c,n,p)=>({c:c.C(n['1'],n['2'],p.props.C)}),
   watch:(el,p)=>({I:el.c.i,info:[['Voltage',fmtV(el.c.v)],['Current',fmtI(el.c.i)]],over:Math.abs(el.c.v)>p.props.Vmax?`more than ${p.props.Vmax} V`:''})},
 ecap:{name:'Electrolytic capacitor',group:'Passive',icon:'⊣',foot:[[0,0],[0,2]],pins:['+','−'],rotate:true,
   props:{C:100e-6,Vmax:25},edit:[{k:'C',label:'Value',opts:CAP_VALUES.filter(v=>v>=1e-6).map(v=>[v,fmtC(v)])},{k:'Vmax',label:'Rated',opts:[[16,'16 V'],[25,'25 V'],[63,'63 V']]}],
   model:(c,n,p)=>({c:c.C(n['+'],n['−'],p.props.C)}),
   watch:(el,p)=>({I:el.c.i,info:[['Voltage',fmtV(el.c.v)],['Charge',fmtV(el.c.v)+' / '+p.props.Vmax+' V max']],
     over:el.c.v>p.props.Vmax?`more than its ${p.props.Vmax} V rating`:el.c.v<-1.5?'connected backwards (+ on the − side)':''})},
 led:{name:'LED',group:'Semiconductors',icon:'💡',foot:[[0,0],[0,1]],pins:['+','−'],rotate:true,
   props:{color:'red'},edit:[{k:'color',label:'Colour',opts:Object.keys(LEDS).map(k=>[k,k])}],
   model:(c,n,p)=>{const L=LEDS[p.props.color];return {d:c.D(n['+'],n['−'],diodeIs(L.vf,2),2)};},
   watch:(el)=>({I:el.d.i,vrev:-el.d.v,bright:Math.min(1,Math.max(0,el.d.i)/0.012),info:[['Current',fmtI(el.d.i)+' (max 30 mA)'],['Voltage',fmtV(el.d.v)]],
     over:el.d.i>0.03?'more than 30 mA: add or increase its resistor':''})},
 d4007:{name:'Diode 1N4007',group:'Semiconductors',icon:'▷|',foot:[[0,0],[0,4]],pins:['A','K'],rotate:true,props:{},edit:[],
   model:(c,n)=>({d:c.D(n['A'],n['K'],diodeIs(0.72,1.8),1.8)}),
   watch:(el)=>({I:el.d.i,info:[['Current',fmtI(el.d.i)+' (max 1 A)'],['Voltage',fmtV(el.d.v)]],over:el.d.i>1?'more than 1 A':''})},
 d4148:{name:'Diode 1N4148',group:'Semiconductors',icon:'▷|',foot:[[0,0],[0,4]],pins:['A','K'],rotate:true,props:{},edit:[],
   model:(c,n)=>({d:c.D(n['A'],n['K'],diodeIs(0.68,1.9),1.9)}),
   watch:(el)=>({I:el.d.i,info:[['Current',fmtI(el.d.i)+' (max 200 mA)'],['Voltage',fmtV(el.d.v)]],over:el.d.i>0.2?'more than 200 mA':''})},
 npn:{name:'NPN transistor',group:'Semiconductors',icon:'T',foot:[[0,0],[0,1],[0,2]],pins:['C','B','E'],rotate:true,props:{kind:'BC547'},
   edit:[{k:'kind',label:'Model',opts:[['BC547','BC547 (small: 100 mA)'],['SS8050','SS8050 (stronger: 1.5 A)']]}],
   model:(c,n,p)=>({q:c.Q(n['C'],n['B'],n['E'],p.props.kind==='SS8050'?2e-14:7e-15,200,2)}),
   watch:(el,p)=>{const big=p.props.kind==='SS8050',Imax=big?1.5:0.1,Pmax=big?1:0.5;
     return {I:el.q.ic,P:el.q.p,info:[['Collector',fmtI(el.q.ic)+' (max '+(big?'1.5 A':'100 mA')+')'],['Base',fmtI(el.q.ib)],['C–E voltage',fmtV(el.q.vce)],['Power',fmtP(el.q.p)]],
     over:el.q.ic>Imax?'more than '+(big?'1.5 A':'100 mA')+' in the collector'+(big?'':' (for a motor, use the SS8050)'):el.q.p>Pmax?'more than '+Pmax+' W':el.q.ib>0.02?'more than 20 mA into the base: add a base resistor':''};}},
 btn:{name:'Push button',group:'Switches & sensors',icon:'⏺',foot:[[0,0],[0,2],[1,0],[1,2]],pins:['1a','2a','1b','2b'],anchor:'e',rotate:false,
   props:{pressed:false},edit:[{k:'pressed',label:'Press',hold:true}],
   model:(c,n,p)=>({k1:c.SW(n['1a'],n['1b'],true),k2:c.SW(n['2a'],n['2b'],true),s:c.SW(n['1a'],n['2a'],p.props.pressed)}),
   update:(el,p)=>{el.s.on=p.props.pressed;},
   watch:(el,p)=>({I:el.s.i,info:[['State',p.props.pressed?'pressed':'released'],['Current',fmtI(el.s.i)]]})},
 sw:{name:'Slide switch',group:'Switches & sensors',icon:'⇆',foot:[[0,0],[0,2]],pins:['1','2'],rotate:true,props:{on:true},edit:[{k:'on',label:'Switch',toggle:['ON','OFF']}],
   model:(c,n,p)=>({s:c.SW(n['1'],n['2'],p.props.on)}),update:(el,p)=>{el.s.on=p.props.on;},
   watch:(el,p)=>({I:el.s.i,info:[['State',p.props.on?'ON':'OFF'],['Current',fmtI(el.s.i)]]})},
 ldr:{name:'LDR (light sensor)',group:'Switches & sensors',icon:'☀',foot:[[0,0],[0,2]],pins:['1','2'],rotate:true,props:{light:0.5},edit:[{k:'light',label:'Light',range:[0,1,0.01],live:true}],
   model:(c,n,p)=>({r:c.R(n['1'],n['2'],Math.pow(10,6-3*p.props.light))}),update:(el,p)=>{el.r.g=1/Math.pow(10,6-3*p.props.light);},
   watch:(el,p)=>({I:el.r.i,P:el.r.p,info:[['Resistance',fmtR(Math.pow(10,6-3*p.props.light))],['Current',fmtI(el.r.i)]],over:el.r.p>0.1?'more than 100 mW':''})},
 buz:{name:'Buzzer (active)',group:'Output',icon:'🔔',foot:[[0,0],[0,3]],pins:['+','−'],rotate:true,props:{},edit:[],
   model:(c,n)=>({r:c.R(n['+'],n['−'],200)}),
   watch:(el)=>({I:el.r.i,sound:el.r.v>2.5,info:[['Voltage',fmtV(el.r.v)+' (sounds above 2.5 V)'],['Current',fmtI(el.r.i)]],over:el.r.v>15?'more than 15 V':el.r.v<-1?'connected backwards':''})},
 motor:{name:'DC motor',group:'Output',icon:'M',foot:[[0,0],[0,3]],pins:['1','2'],rotate:true,props:{},edit:[],
   model:(c,n)=>({m:c.Motor(n['1'],n['2'],4.5,0.0086,3.3e-6,1.34e-6)}),
   watch:(el)=>({I:el.m.i,spin:el.m.w,info:[['Speed',Math.round(Math.abs(el.m.w)*60/6.283)+' rpm'],['Current',fmtI(el.m.i)]],over:Math.abs(el.m.i)>2.5?'more than 2.5 A (stalled at too high a voltage)':''})},
 ne555:{name:'NE555 timer',group:'Chips',icon:'555',foot:[[0,0],[0,1],[0,2],[0,3],[-1,3],[-1,2],[-1,1],[-1,0]],pins:['1','2','3','4','5','6','7','8'],anchor:'f',rotate:false,props:{},edit:[],
   model:(c,n)=>({t:c.T555(n['1'],n['2'],n['3'],n['4'],n['5'],n['6'],n['7'],n['8'])}),
   watch:(el)=>({I:0,info:[['Supply (8 → 1)',fmtV(el.t.vcc||0)],['Output (pin 3)',el.t.q?'HIGH':'LOW']],over:(el.t.vcc||0)>16?'more than 16 V on the supply':(el.t.vcc||0)<-0.5?'powered backwards':''})},
};
const GROUPS=[...new Set(Object.values(PARTS).map(p=>p.group))];

// ===== Build lab: the breadboard model =====
// A placed part: {id, type, holes:{pin:hole}, rot, props, burnt}. A wire: {id, a:hole, b:hole, color}.
// Holes use the names of the real board (see shared/js/breadboard.js): 'a10', 'tp3'...
const ROWS=['tp','tn','a','b','c','d','e','f','g','h','i','j','bp','bn'];
const holeName=(r,c)=>ROWS[r]+c;
function parseHole(h){const m=/^(tp|tn|bp|bn|[a-j])(\d+)$/.exec(h||'');return m?{r:ROWS.indexOf(m[1]),c:+m[2]}:null;}
function holeExists(r,c){if(r<0||r>=ROWS.length||c<1||c>60)return false;return !(ROWS[r].length===2&&c%6===0);}   // rails skip every 6th
// the strip a hole belongs to: one per column for a–e and f–j, one per rail
function stripOf(h){const q=parseHole(h);const R=ROWS[q.r];return R.length===2?R:(q.r<=6?'T':'B')+q.c;}
function rotOff([dr,dc],rot){for(let k=0;k<rot;k++)[dr,dc]=[dc,-dr];return [dr,dc];}

// holes used by a part type placed at anchor (r,c) with rotation rot (null if it doesn't fit on the board)
function footHoles(type,r,c,rot){const T=PARTS[type];
  if(T.fixed)return {...T.fixed};
  const out={};for(let i=0;i<T.foot.length;i++){const [dr,dc]=rotOff(T.foot[i],rot);if(!holeExists(r+dr,c+dc))return null;out[T.pins[i]]=holeName(r+dr,c+dc);}
  return out;}
// anchor (r,c) so that the part is centred on the hole nearest to (x,y), following the part's placement rule
function anchorFor(type,x,y,rot){const T=PARTS[type],nh=nearestHole(x,y,999);if(!nh)return null;
  if(T.fixed)return {r:0,c:1};
  if(T.anchor==='rails')return {r:y<213?0:12,c:Math.max(1,Math.min(59,nh.c))};
  if(T.anchor==='e'||T.anchor==='f'){const w=Math.max(...T.foot.map(o=>o[1]));return {r:ROWS.indexOf(T.anchor),c:Math.max(1,Math.min(60-w,nh.c-Math.floor(w/2)))};}
  const offs=T.foot.map(o=>rotOff(o,rot));const mr=Math.round(offs.reduce((s,o)=>s+o[0],0)/offs.length),mc=Math.round(offs.reduce((s,o)=>s+o[1],0)/offs.length);
  return {r:nh.r-mr,c:nh.c-mc};}
function nearestHole(x,y,maxd=8){let best=null;
  for(let r=0;r<ROWS.length;r++){const yy=BB.rows[ROWS[r]];if(Math.abs(yy-y)>Math.max(maxd,7))continue;
    const c=Math.round((x-BB.x0)/BB.dx)+1;for(const cc of [c-1,c,c+1]){if(!holeExists(r,cc))continue;const xx=BB.x0+(cc-1)*BB.dx,d=Math.hypot(xx-x,yy-y);
      if(d<=maxd&&(!best||d<best.d))best={r,c:cc,d,h:holeName(r,cc)};}}
  if(!best&&maxd>=999){const r=ROWS.reduce((b,R,i)=>Math.abs(BB.rows[R]-y)<Math.abs(BB.rows[ROWS[b]]-y)?i:b,2);const c=Math.max(1,Math.min(60,Math.round((x-BB.x0)/BB.dx)+1));best={r,c,d:0,h:holeName(r,c)};}
  return best;}

// which holes are taken (by part legs and wire ends), except the ones of `skip` (a part or wire id)
function usedHoles(S,skip){const u=new Map();
  S.parts.forEach(p=>{if(p.id===skip||PARTS[p.type].fixed)return;Object.values(p.holes).forEach(h=>u.set(h,p.id));});
  S.wires.forEach(w=>{if(w.id===skip)return;u.set(w.a,w.id);u.set(w.b,w.id);});return u;}
function fits(S,holes,skip){if(!holes)return false;const u=usedHoles(S,skip);return Object.values(holes).every(h=>!u.has(h));}
// a free hole in the same strip as h (to start/end a wire next to a leg), or h itself
function freeInStrip(S,h,skip){const u=usedHoles(S,skip);if(!u.has(h))return h;const q=parseHole(h),R=ROWS[q.r],s=stripOf(h);
  const cand=[];if(R.length===2){for(let d=1;d<60;d++)for(const c of [q.c-d,q.c+d])if(holeExists(q.r,c))cand.push(holeName(q.r,c));}
  else{const rows=q.r<=6?[2,3,4,5,6]:[7,8,9,10,11];rows.sort((a,b)=>Math.abs(a-q.r)-Math.abs(b-q.r)).forEach(r=>cand.push(holeName(r,q.c)));}
  return cand.find(c=>!u.has(c)&&stripOf(c)===s)||h;}

// ---------- electrical nets: strips joined by wires (union-find) ----------
function nets(S){const par=new Map(),f=x=>{while(par.get(x)!==x){par.set(x,par.get(par.get(x)));x=par.get(x);}return x;};
  const add=x=>{if(!par.has(x))par.set(x,x);},join=(a,b)=>{add(a);add(b);a=f(a);b=f(b);if(a!==b)par.set(a,b);};
  S.parts.forEach(p=>Object.values(p.holes).forEach(h=>add(stripOf(h))));
  S.wires.forEach(w=>join(stripOf(w.a),stripOf(w.b)));
  if(S.parts.some(p=>p.type==='usb')){join('tp','bp');join('tn','bn');}      // the USB module powers both sides of the board
  return {of:h=>{const s=stripOf(h);add(s);return f(s);}};}

// ---------- drawing ----------
function holeXY(h){return HP(h);}
function partBox(p){const pts=Object.values(p.holes).map(HP);const T=PARTS[p.type];
  if(p.type==='usb')return [14,96,46,236];
  let x0=Math.min(...pts.map(q=>q[0])),x1=Math.max(...pts.map(q=>q[0])),y0=Math.min(...pts.map(q=>q[1])),y1=Math.max(...pts.map(q=>q[1]));
  if(p.type==='batt'){const up=y0<213;return up?[x0-22,24,x1-x0+58,y1-24]:[x0-22,y0,x1-x0+58,402-y0];}
  return [x0-9,y0-24,x1-x0+18,y1-y0+32];}
function drawPart(ctx,p,vis){const T=PARTS[p.type],H=p.holes,lit=vis&&vis.bright>0.02;
  switch(p.type){
    case 'res':partOn(ctx,{t:'res',a:H['1'],b:H['2'],v:p.props.R},false);break;
    case 'pot':partOn(ctx,{t:'pot',h:[H['1'],H['W'],H['3']]},false);break;
    case 'ccap':partOn(ctx,{t:'ccap',a:H['1'],b:H['2'],lab:fmtC(p.props.C).replace(' ','')},false);break;
    case 'ecap':partOn(ctx,{t:'ecap',a:H['+'],b:H['−'],lab:fmtC(p.props.C).replace(' ','')},false);break;
    case 'led':{const L=LEDS[p.props.color];partOn(ctx,{t:'led',a:H['+'],b:H['−'],rgb:L.rgb},false);
      if(lit){const A=HP(H['+']),B=HP(H['−']);glowAt(ctx,(A[0]+B[0])/2,(A[1]+B[1])/2-10,0.35+0.65*vis.bright,L.rgb,14+22*vis.bright);
        ctx.fillStyle=`rgba(${L.rgb},1)`;ctx.beginPath();ctx.arc((A[0]+B[0])/2,(A[1]+B[1])/2-10,6.5,0,7);ctx.fill();}break;}
    case 'd4007':case 'd4148':partOn(ctx,{t:'diode',a:H['A'],b:H['K']},false);
      if(p.type==='d4148'){const A=HP(H['A']),B=HP(H['K']);ctx.save();ctx.translate((A[0]+B[0])/2,(A[1]+B[1])/2);ctx.rotate(Math.atan2(B[1]-A[1],B[0]-A[0]));ctx.fillStyle='rgba(251,146,60,.85)';ctx.fillRect(-10,-4,15,8);ctx.restore();}break;
    case 'npn':partOn(ctx,{t:'npn',c:H['C'],b:H['B'],e:H['E']},false);break;
    case 'btn':{const q=parseHole(H['1a']);partOn(ctx,{t:'btn',col:q.c},false);if(p.props.pressed){const x=(HP(H['1a'])[0]+HP(H['2a'])[0])/2;ctx.fillStyle=PAL.cyan;ctx.beginPath();ctx.arc(x,213,7,0,7);ctx.fill();}break;}
    case 'sw':{const A=HP(H['1']),B=HP(H['2']);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-12;
      ctx.fillStyle=PAL.chip;ctx.beginPath();ctx.roundRect(mx-16,my-8,32,14,3);ctx.fill();ctx.fillStyle=p.props.on?PAL.green:PAL.slate;ctx.fillRect(p.props.on?mx+1:mx-13,my-6,12,10);
      leg(ctx,A,[mx-10,my+6]);leg(ctx,B,[mx+10,my+6]);break;}
    case 'ldr':partOn(ctx,{t:'ldr',a:H['1'],b:H['2']},false);break;
    case 'buz':partOn(ctx,{t:'buz',a:H['+'],b:H['−']},false);
      if(vis&&vis.sound){const A=HP(H['+']),B=HP(H['−']),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-4,t=performance.now()/1000;ctx.strokeStyle=PAL.pink;ctx.lineWidth=2;
        for(let i=0;i<3;i++){const rr=14+((t*40+i*10)%30);ctx.globalAlpha=Math.max(0,1-rr/44);ctx.beginPath();ctx.arc(mx,my,rr,-0.7,0.7);ctx.stroke();ctx.beginPath();ctx.arc(mx,my,rr,Math.PI-0.7,Math.PI+0.7);ctx.stroke();}ctx.globalAlpha=1;}break;
    case 'motor':{const A=HP(H['1']),B=HP(H['2']);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-24;leg(ctx,A,[mx-8,my+12]);leg(ctx,B,[mx+8,my+12]);
      ctx.fillStyle=PAL.gray;ctx.beginPath();ctx.arc(mx,my,15,0,7);ctx.fill();ctx.fillStyle=PAL.chipLight;ctx.beginPath();ctx.arc(mx,my,11,0,7);ctx.fill();
      p.ang=(p.ang||0)+((vis&&vis.spin)||0)*0.0015;ctx.save();ctx.translate(mx,my);ctx.rotate(p.ang);ctx.strokeStyle=PAL.sky;ctx.lineWidth=2;for(let k=0;k<3;k++){ctx.rotate(2.094);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(9,0);ctx.stroke();}ctx.restore();
      txt(ctx,'M',mx,my+4,PAL.ink,9);break;}
    case 'ne555':{const q=parseHole(H['1']);partOn(ctx,{t:'chip',col:q.c,n:8,lab:'NE555'},false);break;}
    case 'batt':{const P=HP(H['+']),up=P[1]<213;partOn(ctx,{t:'batt',at:[P[0]-20,up?30:352],plus:H['+'],minus:H['−'],lab:p.props.V+' V'},false);break;}
    case 'usb':partOn(ctx,{t:'pm'},!!(vis&&vis.on));break;
  }
  if(p.burnt)drawBurnt(ctx,p);}
function drawBurnt(ctx,p){const [x,y,w,h]=partBox(p);const cx=x+w/2,cy=y+h/2;
  const g=ctx.createRadialGradient(cx,cy,2,cx,cy,Math.max(w,h)*0.7);g.addColorStop(0,'rgba(20,10,5,.85)');g.addColorStop(1,'rgba(20,10,5,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,Math.max(w,h)*0.7,0,7);ctx.fill();txt(ctx,'🔥',cx,cy+5,PAL.white,14);}

// ===== Build lab: circuit simulator (no DOM). =====
// Nodal analysis, solved by Gaussian elimination at every time step; Newton–Raphson for diodes, LEDs and
// transistors; backward-Euler capacitors; a motor with back-EMF; a behavioural NE555.
// Sources are Norton equivalents (V/R current + 1/R conductance), so the matrix only has node voltages.
// Usage: const c=new Circuit(); const a=c.node(), ...; c.R(a,b,470); ... c.step(dt); then el.i, el.v, c.v(node).
// Node 0 is ground (0 V).
const VT=0.02585, GMIN=1e-9;

class Circuit{
  constructor(){this.n=1;this.els=[];this.x=new Float64Array(1);this.t=0;}
  node(){return this.n++;}
  v(k){return k>0?this.x[k]||0:0;}
  add(e){e.i=0;e.v=0;e.p=0;this.els.push(e);return e;}
  // ---- linear parts
  R(a,b,r){return this.add({t:'R',a,b,g:1/Math.max(r,1e-6)});}
  Vs(p,m,V,r){return this.add({t:'V',a:p,b:m,V,g:1/r});}                         // battery: V with internal resistance r
  SW(a,b,on){return this.add({t:'SW',a,b,on,g:1/0.05});}                          // switch / button contact
  C(a,b,C,vmax){return this.add({t:'C',a,b,C,vp:0});}                               // vp: voltage at the previous step
  // ---- non-linear parts
  D(a,b,Is,n){return this.add({t:'D',a,b,Is,nv:n*VT,vd:0});}                      // diode / LED: anode a, cathode b
  Q(c,b,e,Is,bf,br){return this.add({t:'Q',c,b,e,Is,bf,br,vbe:0,vbc:0});}           // NPN (Ebers–Moll)
  Motor(a,b,R,k,J,f){return this.add({t:'M',a,b,g:1/R,k,J,f,w:0});}                 // DC motor: R + back-EMF k·ω
  T555(p1,p2,p3,p4,p5,p6,p7,p8){const x=this.node();                                // internal 1/3 VCC node
    const e=this.add({t:'555',pins:[0,p1,p2,p3,p4,p5,p6,p7,p8],x,q:0,out:0});
    this.R(p8,p5,5000);this.R(p5,x,5000);this.R(x,p1,5000);this.R(p8,p1,1500);     // divider + supply current
    return e;}

  // ---- one time step (dt in seconds). Returns false if the solver did not converge.
  step(dt){
    const N=this.n;if(this.x.length<N){const nx=new Float64Array(N);nx.set(this.x);this.x=nx;}
    // NE555 logic from the previous step's voltages
    for(const e of this.els)if(e.t==='555'){const [_,p1,p2,p3,p4,p5,p6]=e.pins,g=this.v(p1),vcc=this.v(e.pins[8])-g;
      if(this.v(p4)-g<0.7||vcc<3)e.q=0;else if(this.v(p2)<this.v(e.x))e.q=1;else if(this.v(p6)>this.v(p5))e.q=0;
      e.vcc=vcc;}
    let ok=false;
    for(let it=0;it<100;it++){
      const A=Array.from({length:N},()=>new Float64Array(N)),z=new Float64Array(N),x=this.x;
      const G=(a,b,g)=>{if(a)A[a][a]+=g;if(b)A[b][b]+=g;if(a&&b){A[a][b]-=g;A[b][a]-=g;}};
      const Iin=(a,b,i)=>{if(a)z[a]-=i;if(b)z[b]+=i;};                              // current i flowing a -> b inside the part
      for(let k=1;k<N;k++)A[k][k]+=GMIN;
      let lim=false;                                                                    // a junction voltage was limited: not converged yet
      for(const e of this.els){switch(e.t){
        case 'R':G(e.a,e.b,e.g);break;
        case 'SW':if(e.on)G(e.a,e.b,e.g);break;
        case 'V':G(e.a,e.b,e.g);Iin(e.a,e.b,-e.V*e.g);break;                           // pushes V/R out of +
        case 'C':{const g=e.C/dt;G(e.a,e.b,g);Iin(e.a,e.b,-g*e.vp);break;}
        case 'M':{G(e.a,e.b,e.g);Iin(e.a,e.b,-e.g*e.k*e.w);break;}
        case 'D':{const raw=this.v(e.a)-this.v(e.b);let vd=pnlim(raw,e.vd,e.nv,e.Is);if(Math.abs(vd-raw)>1e-6)lim=true;e.vd=vd;
          const ex=Math.exp(Math.min(vd/e.nv,80)),id=e.Is*(ex-1),gd=e.Is/e.nv*ex+GMIN;G(e.a,e.b,gd);Iin(e.a,e.b,id-gd*vd);break;}
        case 'Q':{const vb=this.v(e.b);let vbe=vb-this.v(e.e),vbc=vb-this.v(e.c);
          const rbe=vbe,rbc=vbc;vbe=pnlim(vbe,e.vbe,VT,e.Is);vbc=pnlim(vbc,e.vbc,VT,e.Is);if(Math.abs(vbe-rbe)>1e-6||Math.abs(vbc-rbc)>1e-6)lim=true;e.vbe=vbe;e.vbc=vbc;
          const ef=Math.exp(Math.min(vbe/VT,80)),er=Math.exp(Math.min(vbc/VT,80)),If=e.Is*(ef-1),Ir=e.Is*(er-1),gf=e.Is/VT*ef,gr=e.Is/VT*er;
          const ic=If-Ir*(1+1/e.br),ib=If/e.bf+Ir/e.br;                               // currents INTO collector and base
          // linearise: ic = ic0 + gf·dVbe - gr(1+1/br)·dVbc ; ib = ib0 + gf/bf·dVbe + gr/br·dVbc
          const T={c:e.c,b:e.b,e:e.e};
          const stamp=(node,i0,dVbe,dVbc)=>{if(!node)return;                         // current i0 leaves `node` into the device
            // Vbe = vb - ve ; Vbc = vb - vc
            const gb=dVbe+dVbc,ge=-dVbe,gc=-dVbc;
            if(T.b)A[node][T.b]+=gb;if(T.e)A[node][T.e]+=ge;if(T.c)A[node][T.c]+=gc;
            z[node]-=i0-(dVbe*vbe+dVbc*vbc);};
          stamp(e.c,ic,gf,-gr*(1+1/e.br));stamp(e.b,ib,gf/e.bf,gr/e.br);stamp(e.e,-(ic+ib),-(gf+gf/e.bf),gr*(1+1/e.br)-gr/e.br);
          break;}
        case '555':{const [_,p1,,p3,,,,p7]=e.pins,ro=1/10;                                   // output: 10 Ω towards its target
          const vt=e.q?Math.max(0,e.vcc-1.7):0.1;G(p3,p1,ro);Iin(p3,p1,-vt*ro);
          if(!e.q)G(p7,p1,1/15);break;}
      }}
      const nx=solve(A,z,N);if(!nx)return false;
      let d=0;for(let k=1;k<N;k++){d=Math.max(d,Math.abs(nx[k]-x[k]));}
      this.x=nx;if(d<1e-6&&it>0&&!lim){ok=true;break;}
    }
    // results: currents a -> b, voltages, powers; update capacitors and motors
    for(const e of this.els){const va=this.v(e.a),vb=this.v(e.b);
      switch(e.t){
        case 'R':e.v=va-vb;e.i=e.v*e.g;break;
        case 'SW':e.v=va-vb;e.i=e.on?e.v*e.g:0;break;
        case 'V':e.v=va-vb;e.i=(e.V-e.v)*e.g;break;                                     // current delivered out of +
        case 'C':e.v=va-vb;e.i=e.C*(e.v-e.vp)/dt;e.vp=e.v;break;
        case 'D':e.v=va-vb;e.i=e.Is*(Math.exp(Math.min(e.v/e.nv,80))-1);break;
        case 'M':e.v=va-vb;e.i=(e.v-e.k*e.w)*e.g;e.w+=dt*(e.k*e.i-e.f*e.w)/e.J;break;
        case 'Q':{const vbe=this.v(e.b)-this.v(e.e),vbc=this.v(e.b)-this.v(e.c);
          const If=e.Is*(Math.exp(Math.min(vbe/VT,80))-1),Ir=e.Is*(Math.exp(Math.min(vbc/VT,80))-1);
          e.ic=If-Ir*(1+1/e.br);e.ib=If/e.bf+Ir/e.br;e.vce=this.v(e.c)-this.v(e.e);e.i=e.ic;e.v=e.vce;break;}
        case '555':e.v=e.vcc;e.i=0;break;
      }
      e.p=Math.abs(e.v*e.i);if(e.t==='Q')e.p=Math.abs(e.ic*e.vce)+Math.abs(e.ib*(this.v(e.b)-this.v(e.e)));
    }
    this.t+=dt;return ok;
  }
}
// SPICE-style junction voltage limiting: keeps Newton steps on the exponential reasonable
function pnlim(vnew,vold,nv,Is){const vcrit=nv*Math.log(nv/(Math.SQRT2*Is));
  if(vnew>vcrit&&Math.abs(vnew-vold)>2*nv){if(vold>0){const arg=1+(vnew-vold)/nv;vnew=arg>0?vold+nv*Math.log(arg):vcrit;}else vnew=nv*Math.log(vnew/nv);}
  return vnew;}
// Gaussian elimination with partial pivoting on the reduced system (node 0 = ground removed)
function solve(A,z,N){const n=N-1;if(n<=0)return new Float64Array(N);
  const M=[];for(let i=1;i<N;i++){const r=new Float64Array(n+1);for(let j=1;j<N;j++)r[j-1]=A[i][j];r[n]=z[i];M.push(r);}
  for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;
    if(Math.abs(M[p][c])<1e-18)return null;if(p!==c){const t=M[p];M[p]=M[c];M[c]=t;}
    const piv=M[c][c];for(let r=c+1;r<n;r++){const f=M[r][c]/piv;if(f)for(let k=c;k<=n;k++)M[r][k]-=f*M[c][k];}}
  const x=new Float64Array(N);for(let r=n-1;r>=0;r--){let s=M[r][n];for(let k=r+1;k<n;k++)s-=M[r][k]*x[k+1];x[r+1]=s/M[r][r];}
  return x;}
// Diode/LED parameters: Is chosen so the part drops Vf at 10 mA (n = emission coefficient)
function diodeIs(vf,n,i){return (i||0.01)/Math.exp(vf/(n*VT));}
if(typeof module!=='undefined')module.exports={Circuit,diodeIs,VT};

// ===== Build lab: "Check circuit" =====
// Wiring rules on the board, plus a quick test run of the simulator (what would burn, what is backwards).
// Each issue: {lvl:'err'|'warn'|'ok', msg, ids:[part or wire ids to highlight]}.
function checkCircuit(S,trial){const out=[],N=nets(S),add=(lvl,msg,ids=[])=>out.push({lvl,msg,ids});
  const name=p=>PARTS[p.type].name+(p.type==='res'?' '+fmtR(p.props.R):p.type==='led'?' ('+p.props.color+')':p.type==='npn'?' '+p.props.kind:'');
  const supplies=S.parts.filter(p=>p.type==='batt'||p.type==='usb');
  if(!S.parts.length){add('warn','The board is empty: drag parts from the catalog.');return out;}
  if(!supplies.length)add('err','No power: add a 9 V battery or the USB 5 V module, and connect it to the rails.');
  const plus=new Set(supplies.map(p=>N.of(p.holes['+']))),minus=new Set(supplies.map(p=>N.of(p.holes['−'])));
  supplies.forEach(p=>{if(N.of(p.holes['+'])===N.of(p.holes['−']))add('err',`Short circuit: the + and − of the ${name(p)} are connected together by wires or a strip.`,[p.id]);});
  // count what touches each net
  const count=new Map();S.parts.forEach(p=>Object.values(p.holes).forEach(h=>{const n=N.of(h);count.set(n,(count.get(n)||0)+1);}));
  S.wires.forEach(w=>{[w.a,w.b].forEach(h=>{const n=N.of(h);count.set(n,(count.get(n)||0)+1);});});
  S.parts.forEach(p=>{if(p.burnt)add('err',`${name(p)} is burnt: click it and press Replace.`,[p.id]);
    const T=PARTS[p.type];if(T.fixed)return;
    const ns=Object.entries(p.holes).map(([pin,h])=>[pin,N.of(h)]);
    if(ns.length===2&&ns[0][1]===ns[1][1]&&p.type!=='btn'&&!plus.has(ns[0][1]))add('warn',`${name(p)}: both legs are in the same strip, so it is short-circuited (it does nothing). Move one leg to another column or row.`,[p.id]);
    ns.forEach(([pin,n])=>{if((count.get(n)||0)<2&&!plus.has(n)&&!minus.has(n)&&!(p.type==='ne555'&&pin==='5'))add('warn',`${name(p)}: leg ${pin} is not connected to anything.`,[p.id]);});
    if(p.type==='led'&&plus.has(N.of(p.holes['+']))&&minus.has(N.of(p.holes['−']))&&N.of(p.holes['+'])!==N.of(p.holes['−']))add('err',`${name(p)} is straight across the supply with no resistor: it will burn. Put a resistor (470 Ω on 9 V) in series.`,[p.id]);
    if(p.type==='npn'&&plus.has(N.of(p.holes['B'])))add('err',`${name(p)}: its base is connected straight to +. Put a resistor (1–10 kΩ) between + and the base.`,[p.id]);
    if(p.type==='ne555'){const n=k=>N.of(p.holes[k]);
      if(!plus.has(n('8')))add('warn','NE555: pin 8 (supply) should go to +.',[p.id]);
      if(!minus.has(n('1')))add('warn','NE555: pin 1 (ground) should go to −.',[p.id]);
      if((count.get(n('4'))||0)<2&&!plus.has(n('4')))add('warn','NE555: pin 4 (reset) is floating: connect it to + so the timer runs.',[p.id]);}
  });
  supplies.forEach(s=>{const used=S.parts.some(p=>p!==s&&Object.values(p.holes).some(h=>plus.has(N.of(h))))||S.wires.some(w=>plus.has(N.of(w.a))||plus.has(N.of(w.b)));
    if(!used)add('warn',`Nothing is connected to the + of the ${name(s)}.`,[s.id]);});
  // a short test run: what would burn, what is backwards
  if(trial&&!out.some(o=>o.lvl==='err'&&/Short circuit|No power/.test(o.msg))){
    trial.forEach(({p,w})=>{if(!w)return;
      if(w.over)add('err',`${name(p)} would burn: ${w.over}.`,[p.id]);
      if(p.type==='led'&&w.vrev>1)add('warn',`${name(p)} is connected backwards (long leg = +): it stays off.`,[p.id]);});
    const src=trial.find(t=>t.p.type==='batt'||t.p.type==='usb');if(src&&src.w&&Math.abs(src.w.I)>1)add('err',`The supply delivers ${fmtI(src.w.I)}: that is almost a short circuit.`,[src.p.id]);}
  if(!out.length)add('ok','No problem found. Press ▶ Play.');
  return out;}

// ===== Build lab: the page (catalog, editing, play, check, multimeter, undo, save, import) =====
const cvs=$('bdBoard'),bctx=cvs.getContext('2d');
let S={parts:[],wires:[]},NID=1;
const WIRE_COLORS=[['red',PAL.redDark],['black','#111'],['blue',PAL.blueDark],['green',PAL.greenDark],['yellow',PAL.gold],['orange',PAL.orangeDark],['white','#f8fafc']];
let wireColor=WIRE_COLORS[0][1],sel=null,drag=null,hov=null,run=null,flashIds=new Set(),flashT=0;
const undoS=[],redoS=[],smoke=[];
const status=(msg,cls='')=>{const el=$('bdStatus');el.textContent=msg;el.className='bd-status '+cls;};
const pname=p=>PARTS[p.type].name+(p.type==='res'?' '+fmtR(p.props.R):p.type==='led'?' ('+p.props.color+')':p.type==='npn'?' '+p.props.kind:'');
const findPart=id=>S.parts.find(p=>p.id===id),findWire=id=>S.wires.find(w=>w.id===id);

// ---------- history & storage ----------
const snapState=()=>JSON.stringify(S);
function commit(before){undoS.push(before);if(undoS.length>50)undoS.shift();redoS.length=0;changed();}
function changed(){try{localStorage.setItem('buildlab:current',snapState());}catch(e){}if(run)run=makeRun(S);renderProps();}
function restore(json){S=JSON.parse(json);NID=1+Math.max(0,...S.parts.map(p=>p.id),...S.wires.map(w=>w.id));if(sel&&!findPart(sel.id)&&!findWire(sel.id))sel=null;changed();}
function undo(){if(!undoS.length)return;redoS.push(snapState());restore(undoS.pop());status('Undone.');}
function redo(){if(!redoS.length)return;undoS.push(snapState());restore(redoS.pop());status('Redone.');}

// ---------- catalog ----------
(function(){const cat=$('bdCatalog');let h='';
  GROUPS.forEach(g=>{h+=`<h4>${g}</h4>`+Object.entries(PARTS).filter(([,T])=>T.group===g).map(([k,T])=>`<a class="bd-item" data-type="${k}"><span class="n">${T.icon}</span>${T.name}</a>`).join('');});
  cat.innerHTML=h;cat.querySelectorAll('.bd-item').forEach(a=>a.addEventListener('pointerdown',e=>{e.preventDefault();startNew(a.dataset.type,e);}));})();
(function(){const box=$('bdColors');WIRE_COLORS.forEach(([n,c],i)=>{const b=document.createElement('button');b.title=n+' wire';b.style.background=c;if(!i)b.classList.add('active');
  b.onclick=()=>{wireColor=c;box.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));const w=sel&&sel.kind==='wire'&&findWire(sel.id);if(w){const before=snapState();w.color=c;commit(before);}};box.appendChild(b);});})();

// ---------- pointer geometry ----------
function toBoard(e){const r=cvs.getBoundingClientRect();return [(e.clientX-r.left)*cvs.width/r.width,(e.clientY-r.top)*cvs.height/r.height,r.left<=e.clientX&&e.clientX<=r.right&&r.top<=e.clientY&&e.clientY<=r.bottom];}
function inBox(x,y,[bx,by,bw,bh]){return x>=bx&&x<=bx+bw&&y>=by&&y<=by+bh;}
function partAt(x,y){for(let i=S.parts.length-1;i>=0;i--)if(inBox(x,y,partBox(S.parts[i])))return S.parts[i];return null;}
const catEl=$('bdCatalog');
function overCatalog(e){const r=catEl.getBoundingClientRect();return r.width>0&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;}
// a leg of a 2-leg part under the pointer (it can be dragged to another hole, like a wire end)
const LEG_MAX=12*BB.dx;   // how far a leg can stretch from the other one
function legAt(x,y){let best=null,bd=5;S.parts.forEach(p=>{const T=PARTS[p.type];if(T.fixed||T.pins.length!==2)return;
  T.pins.forEach(pin=>{const [hx,hy]=HP(p.holes[pin]),d=Math.hypot(hx-x,hy-y);if(d<bd){bd=d;best={p,pin};}});});return best;}
function legTarget(d){const p=findPart(d.id),t=nearestHole(d.x,d.y,10);if(!p||!t)return null;const other=p.holes[PARTS[p.type].pins.find(k=>k!==d.pin)];
  let h=freeInStrip(S,t.h,p.id);if(h===other)h=freeInStrip(S,t.h);const [ax,ay]=HP(h),[bx,by]=HP(other);
  return {h,ok:h!==other&&Math.hypot(ax-bx,ay-by)<=LEG_MAX,far:Math.hypot(ax-bx,ay-by)>LEG_MAX,other};}
function wireEndAt(x,y){let best=null,bd=6;S.wires.forEach(w=>['a','b'].forEach(end=>{const [hx,hy]=HP(w[end]),d=Math.hypot(hx-x,hy-y);if(d<bd){bd=d;best={w,end};}}));return best;}
function wireAt(x,y){let best=null,bd=7;S.wires.forEach(w=>{const A=HP(w.a),B=HP(w.b),d=Math.hypot(B[0]-A[0],B[1]-A[1]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-Math.min(34,8+d*0.18);
  for(let t=0;t<=1;t+=0.05){const px=(1-t)*(1-t)*A[0]+2*(1-t)*t*mx+t*t*B[0],py=(1-t)*(1-t)*A[1]+2*(1-t)*t*my+t*t*B[1],dd=Math.hypot(px-x,py-y);if(dd<bd){bd=dd;best=w;}}});return best;}

// ---------- placing parts ----------
function placement(type,x,y,rot,skip){const T=PARTS[type];
  if(T.fixed){const other=S.parts.some(p=>p.type===type&&p.id!==skip);return {holes:{...T.fixed},ok:!other};}
  const a=anchorFor(type,x,y,rot);if(!a)return null;let holes=footHoles(type,a.r,a.c,rot);
  if(!fits(S,holes,skip))for(const dc of [1,-1,2,-2,3,-3]){const h2=footHoles(type,a.r,a.c+dc,rot);if(fits(S,h2,skip)){holes=h2;break;}}
  return {holes,ok:fits(S,holes,skip)};}
function startNew(type,e){const T=PARTS[type];if(T.unique&&S.parts.some(p=>p.type===type)){status(`There is already a ${T.name} on the board.`,'warn');return;}
  drag={mode:'new',type,rot:0,pl:null};follow(e);}
function shifted(p,dr,dc){const out={};for(const [pin,h] of Object.entries(p.holes)){const q=parseHole(h);if(!q||!holeExists(q.r+dr,q.c+dc))return null;out[pin]=holeName(q.r+dr,q.c+dc);}return out;}
function follow(e){const [x,y,over]=toBoard(e);drag.x=x;drag.y=y;drag.over=over;
  if(drag.mode==='new')drag.pl=over?placement(drag.type,x,y,drag.rot):null;
  else if(drag.mode==='move'){const p=findPart(drag.id),T=PARTS[p.type];if(T.fixed){drag.pl=null;return;}
    if(Math.hypot(x-drag.x0,y-drag.y0)>4)drag.moved=true;if(!drag.moved)return;
    const nh=nearestHole(x,y,999);let dr=nh.r-drag.gh.r,dc=nh.c-drag.gh.c;
    if(T.anchor==='e'||T.anchor==='f')dr=0;if(T.anchor==='rails')dr=(nh.r<7?0:12)-parseHole(p.holes['+']).r;
    const holes=shifted(p,dr,dc);drag.pl={holes,ok:fits(S,holes,p.id)};}}
function rotate(p){const T=PARTS[p.type];if(!T.rotate){status(`${T.name} can't be turned on a breadboard.`,'warn');return;}
  const q=parseHole(p.holes[T.pins[0]]),rot=((p.rot||0)+1)%4;let holes=footHoles(p.type,q.r,q.c,rot);
  if(!fits(S,holes,p.id))for(const [dr,dc] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,-1]]){const h2=footHoles(p.type,q.r+dr,q.c+dc,rot);if(fits(S,h2,p.id)){holes=h2;break;}}
  if(!fits(S,holes,p.id)){status('No room to turn it here: move it first.','warn');return;}
  const before=snapState();p.rot=rot;p.holes=holes;commit(before);}
function removeSel(){if(!sel)return;const before=snapState();
  if(sel.kind==='part')S.parts=S.parts.filter(p=>p.id!==sel.id);else S.wires=S.wires.filter(w=>w.id!==sel.id);sel=null;commit(before);}

// ---------- pointer events ----------
cvs.addEventListener('pointerdown',e=>{const [x,y]=toBoard(e);if(e.button)return;
  const p=partAt(x,y),h=nearestHole(x,y,6);
  if(run&&p&&p.type==='btn'&&!p.burnt){p.props.pressed=true;drag={mode:'press',id:p.id};sel={kind:'part',id:p.id};renderProps();return;}
  const we=wireEndAt(x,y);
  if(we){sel={kind:'wire',id:we.w.id};drag={mode:'wend',id:we.w.id,end:we.end,x,y,x0:x,y0:y,moved:false};renderProps();return;}
  const lg=legAt(x,y);
  if(lg){sel={kind:'part',id:lg.p.id};drag={mode:'leg',id:lg.p.id,pin:lg.pin,x,y,x0:x,y0:y,moved:false};renderProps();return;}
  // off parts, any hole starts a wire. On a part: its own legs, and holes outside the legs' rows (e.g. above an LED), start a wire;
  // the rest of the part (its body over its own row) moves it.
  let wireOk=h&&!p;
  if(h&&p&&!PARTS[p.type].fixed&&h.d<=5){const legs=Object.values(p.holes),rows=new Set(legs.map(l=>parseHole(l).r));wireOk=legs.includes(h.h)||!rows.has(h.r);}
  if(wireOk){drag={mode:'wire',a:freeInStrip(S,h.h),x,y};return;}
  if(p){sel={kind:'part',id:p.id};drag={mode:'move',id:p.id,x0:x,y0:y,gh:nearestHole(x,y,999),pl:null};renderProps();return;}
  const w=wireAt(x,y);sel=w?{kind:'wire',id:w.id}:null;renderProps();});
document.addEventListener('pointermove',e=>{if(drag&&(drag.mode==='move'||drag.mode==='wend'||drag.mode==='leg')){drag.trash=drag.moved&&overCatalog(e);catEl.classList.toggle('bd-trash',!!drag.trash);}
  if(drag&&drag.mode!=='press'){if(drag.mode==='wire'||drag.mode==='wend'||drag.mode==='leg'){const [x,y]=toBoard(e);drag.x=x;drag.y=y;if(Math.hypot(x-drag.x0,y-drag.y0)>4)drag.moved=true;}else follow(e);}
  else if(e.target===cvs){const [x,y]=toBoard(e);hov={x,y};cvs.style.cursor=wireEndAt(x,y)||legAt(x,y)?'grab':'';meter();}});
cvs.addEventListener('pointerleave',()=>{hov=null;});
document.addEventListener('pointerup',e=>{if(!drag)return;const d=drag;drag=null;catEl.classList.remove('bd-trash');
  if((d.mode==='move'||d.mode==='wend'||d.mode==='leg')&&d.moved&&overCatalog(e)){const before=snapState();
    if(d.mode!=='wend'){const p=findPart(d.id);S.parts=S.parts.filter(q=>q.id!==d.id);status(`${p?pname(p):'Part'} removed (Undo brings it back).`);}
    else{S.wires=S.wires.filter(w=>w.id!==d.id);status('Wire removed (Undo brings it back).');}
    sel=null;cvs.style.cursor='';commit(before);return;}
  if(d.mode==='press'){const p=findPart(d.id);if(p)p.props.pressed=false;renderProps();return;}
  if(d.mode==='new'&&d.pl&&d.pl.ok&&d.over){const T=PARTS[d.type],before=snapState(),p={id:NID++,type:d.type,holes:d.pl.holes,rot:d.rot,props:JSON.parse(JSON.stringify(T.props)),burnt:false};
    S.parts.push(p);sel={kind:'part',id:p.id};commit(before);status(`${T.name} placed. Drag its body to move it, a leg to re-plug it, R to turn it; to wire it, drag from a free hole of its strip.`);return;}
  if(d.mode==='new'&&d.over)status('No room there (red holes): try another place.','warn');
  if(d.mode==='move'&&d.moved&&d.pl){if(d.pl.ok){const p=findPart(d.id),before=snapState();p.holes=d.pl.holes;commit(before);}else status('No room there: the part stays where it was.','warn');}
  if(d.mode==='leg'){cvs.style.cursor='';if(!d.moved)return;const p=findPart(d.id),t=legTarget(d);
    if(!t){status('Not on a hole: the leg stays where it was.','warn');return;}
    if(t.h===p.holes[d.pin])return;
    if(t.h===t.other){status('Both legs cannot go in the same hole.','warn');return;}
    if(t.far){status('Too far: a leg only stretches about 12 holes. Move the whole part instead (drag its body).','warn');return;}
    const before=snapState();p.holes[d.pin]=t.h;commit(before);
    status(stripOf(t.h)===stripOf(t.other)?`${pname(p)}: both legs are now in the same strip, so it is short-circuited.`:`${pname(p)}: leg ${d.pin} moved to ${t.h}.`,stripOf(t.h)===stripOf(t.other)?'warn':(run?'run':''));return;}
  if(d.mode==='wend'){cvs.style.cursor='';const w=findWire(d.id);if(!w||!d.moved)return;const t=nearestHole(d.x,d.y,10);
    if(!t){status('Not on a hole: the wire stays where it was.','warn');return;}
    const other=w[d.end==='a'?'b':'a'],h=freeInStrip(S,t.h,w.id);
    if(h===w[d.end])return;
    if(h===other){status('Both ends of a wire cannot go in the same hole.','warn');return;}
    const before=snapState();w[d.end]=h;commit(before);
    status(stripOf(h)===stripOf(other)?'Wire moved, but both ends are now in the same strip: it does nothing.':`Wire end moved to ${h}.`,stripOf(h)===stripOf(other)?'warn':(run?'run':''));return;}
  if(d.mode==='wire'){const t=nearestHole(d.x,d.y,10);if(t){const b=freeInStrip(S,t.h);
    if(b&&d.a&&b!==d.a){const before=snapState(),w={id:NID++,a:d.a,b,color:wireColor};S.wires.push(w);sel={kind:'wire',id:w.id};commit(before);
      if(stripOf(b)===stripOf(d.a))status('That wire joins two holes that are already connected (same strip): it does nothing.','warn');else status('Wire added. Click it to change its colour, or drag one of its ends to another hole.');}}}});
document.addEventListener('keydown',e=>{if(!document.getElementById('page-build')||document.getElementById('page-build').hidden)return;
  if(/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName))return;
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();undo();}
  else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();redo();}
  else if(e.key==='Delete'||e.key==='Backspace'){if(sel){e.preventDefault();removeSel();}}
  else if(e.key==='r'||e.key==='R'){if(drag&&drag.mode==='new'){drag.rot=(drag.rot+1)%4;}else if(sel&&sel.kind==='part')rotate(findPart(sel.id));}
  else if(e.key==='Escape'){drag=null;sel=null;renderProps();}});

// ---------- properties panel ----------
function renderProps(){const body=$('bdPropsBody');
  if(!sel){body.className='hint';body.innerHTML='Click a part or a wire to see and change it.';return;}
  body.className='';
  if(sel.kind==='wire'){const w=findWire(sel.id);if(!w){sel=null;return renderProps();}
    body.innerHTML=`<div class="bd-row"><label>Wire</label><span>${w.a} → ${w.b}</span></div><div class="bd-row"><label>Colour</label>${WIRE_COLORS.map(([n,c])=>`<button class="bd-wc${c===w.color?' active':''}" data-c="${c}" title="${n}" style="width:22px;height:22px;padding:0;border-radius:50%;background:${c}"></button>`).join('')}</div>
      <div class="bd-row"><button class="stop" id="bdDelSel">🗑 Delete wire</button></div>`;
    body.querySelectorAll('.bd-wc').forEach(b=>b.onclick=()=>{const before=snapState();w.color=b.dataset.c;commit(before);});
    $('bdDelSel').onclick=removeSel;return;}
  const p=findPart(sel.id);if(!p){sel=null;return renderProps();}const T=PARTS[p.type];
  let h=`<div class="bd-row"><b>${pname(p)}</b>${p.burnt?' <span class="bd-burnt">🔥 burnt</span>':''}</div>`;
  if(p.burnt)h+=`<div class="bd-row"><button class="go" id="bdReplace">♻ Replace (same part)</button></div>`;
  T.edit.forEach((ed,i)=>{const v=p.props[ed.k];
    if(ed.opts)h+=`<div class="bd-row"><label>${ed.label}</label><select class="fsel" data-i="${i}">${ed.opts.map(([val,lab])=>`<option value="${val}"${String(val)===String(v)?' selected':''}>${lab}</option>`).join('')}</select></div>`;
    else if(ed.range)h+=`<div class="bd-row"><label>${ed.label}</label><input type="range" data-i="${i}" min="${ed.range[0]}" max="${ed.range[1]}" step="${ed.range[2]}" value="${v}" style="flex:1"></div>`;
    else if(ed.hold)h+=`<div class="bd-row"><label>${ed.label}</label><button id="bdHold">👆 Hold to press</button><span class="hint">or click the button on the board while playing</span></div>`;
    else if(ed.toggle)h+=`<div class="bd-row"><label>${ed.label}</label><button data-i="${i}" class="bd-tog${v?' active':''}">${v?ed.toggle[0]:ed.toggle[1]}</button></div>`;});
  h+=`<div class="bd-row">${T.rotate?'<button id="bdRotSel">↻ Rotate</button>':''}<button class="stop" id="bdDelSel">🗑 Delete</button></div>`;
  h+=`<div class="bd-row hint">Legs: ${Object.entries(p.holes).filter(()=>!T.fixed).map(([k,v])=>`${k}→${v}`).join(' · ')||'on the rails'}</div><div id="bdLive" class="bd-kv"></div>`;
  body.innerHTML=h;
  body.querySelectorAll('select[data-i]').forEach(s=>s.onchange=()=>{const ed=T.edit[+s.dataset.i],o=ed.opts.find(o=>String(o[0])===s.value);const before=snapState();p.props[ed.k]=o[0];commit(before);});
  body.querySelectorAll('input[type=range][data-i]').forEach(r=>{let before=null;r.oninput=()=>{if(!before)before=snapState();p.props[T.edit[+r.dataset.i].k]=+r.value;if(run){const pt=PARTS[p.type];const el=run.els.get(p.id);if(el&&pt.update)pt.update(el,p);}};
    r.onchange=()=>{if(before)commit(before);before=null;};});
  body.querySelectorAll('.bd-tog').forEach(b=>b.onclick=()=>{const ed=T.edit[+b.dataset.i];const before=snapState();p.props[ed.k]=!p.props[ed.k];commit(before);});
  if($('bdHold'))hold('bdHold',on=>{p.props.pressed=on;});
  if($('bdReplace'))$('bdReplace').onclick=()=>{const before=snapState();p.burnt=false;commit(before);status(`New ${T.name} in place.`,run?'run':'');};
  if($('bdRotSel'))$('bdRotSel').onclick=()=>rotate(p);
  $('bdDelSel').onclick=removeSel;}

// ---------- simulation ----------
const DYNAMIC=new Set(['ccap','ecap','motor','ne555']);
function makeRun(state){const N=nets(state),c=new Circuit(),node=new Map(),els=new Map();
  const sup=state.parts.find(p=>(p.type==='batt'||p.type==='usb')&&!p.burnt);const gnd=sup?N.of(sup.holes['−']):null;
  const nd=h=>{const n=N.of(h);if(n===gnd)return 0;if(!node.has(n))node.set(n,c.node());return node.get(n);};
  state.parts.forEach(p=>{if(p.burnt)return;const n={};Object.entries(p.holes).forEach(([pin,h])=>{n[pin]=nd(h);});els.set(p.id,PARTS[p.type].model(c,n,p));});
  return {c,N,gnd,node,els,w:new Map(),over:new Map(),dynamic:state.parts.some(p=>DYNAMIC.has(p.type)&&!p.burnt)};}
function stepRun(R,state,dt){state.parts.forEach(p=>{const T=PARTS[p.type],el=R.els.get(p.id);if(el&&T.update)T.update(el,p);});
  const n=R.dynamic?Math.max(1,Math.min(250,Math.round(dt/2e-4))):1;for(let i=0;i<n;i++)R.c.step(R.dynamic?2e-4:1e-3);
  state.parts.forEach(p=>{const el=R.els.get(p.id);R.w.set(p.id,el?PARTS[p.type].watch(el,p):null);});}
function nodeV(h){if(!run)return null;const n=run.N.of(h);if(n===run.gnd)return 0;const k=run.node.get(n);return k?run.c.v(k):null;}
function simFrame(dt){stepRun(run,S,dt);let burnt=false;
  S.parts.forEach(p=>{const w=run.w.get(p.id);if(!w||!w.over){run.over.delete(p.id);return;}const t=(run.over.get(p.id)||0)+dt;run.over.set(p.id,t);
    if(t>0.25){p.burnt=true;burnt=true;status(`💥 ${pname(p)} burnt: ${w.over}. Click it, then Replace.`,'warn');const [x,y,wd,ht]=partBox(p);for(let i=0;i<24;i++)smoke.push({x:x+wd/2,y:y+ht/2,vx:(Math.random()-0.5)*30,vy:-20-Math.random()*40,life:1.5+Math.random()});}});
  if(burnt){run=makeRun(S);try{localStorage.setItem('buildlab:current',snapState());}catch(e){}renderProps();}
  const live=$('bdLive');if(live&&sel&&sel.kind==='part'){const w=run.w.get(sel.id);live.innerHTML=w?w.info.map(([k,v])=>`<span>${k}</span><b>${v}</b>`).join(''):'';}}
function play(on){if(on){run=makeRun(S);$('bdPlay').textContent='■ Stop';$('bdPlay').className='stop';status('Running: hover a hole or a part to measure. Hold the push buttons with the mouse.','run');}
  else{run=null;$('bdPlay').textContent='▶ Play';$('bdPlay').className='go';status('Stopped.');S.parts.forEach(p=>{if(p.type==='btn')p.props.pressed=false;});}renderProps();meter();}
$('bdPlay').onclick=()=>play(!run);

// ---------- check ----------
$('bdCheck').onclick=()=>{let trial=null;
  try{const R=makeRun(S);for(let i=0;i<10;i++)stepRun(R,S,0.016);trial=S.parts.map(p=>({p,w:R.w.get(p.id)}));}catch(e){console.error(e);}
  const issues=checkCircuit(S,trial);$('bdInfoTitle').textContent='Check circuit';
  $('bdInfoBody').className='';$('bdInfoBody').innerHTML='<ul class="bd-issues">'+issues.map((it,i)=>`<li class="${it.lvl}" data-i="${i}">${it.lvl==='err'?'⛔':it.lvl==='warn'?'⚠️':'✅'} <span>${it.msg}</span></li>`).join('')+'</ul>';
  $('bdInfoBody').querySelectorAll('li').forEach(li=>li.onclick=()=>{const it=issues[+li.dataset.i];flashIds=new Set(it.ids);flashT=2.5;if(it.ids[0]){sel={kind:findPart(it.ids[0])?'part':'wire',id:it.ids[0]};renderProps();}});
  status(issues.some(i=>i.lvl==='err')?'Check: problems found (see below).':issues.some(i=>i.lvl==='warn')?'Check: a few things to look at (see below).':'Check: all good.',issues.some(i=>i.lvl!=='ok')?'warn':'run');};

// ---------- multimeter ----------
let meterText=null;
function meter(){const body=$('bdInfoBody');if($('bdInfoTitle').textContent!=='Multimeter')return;
  if(!run){meterText=null;body.className='hint';body.innerHTML='Press Play, then hover a hole, a wire or a part.';return;}
  if(!hov){meterText=null;return;}
  let h=nearestHole(hov.x,hov.y,7);const p=partAt(hov.x,hov.y);if(p&&h&&!Object.values(p.holes).includes(h.h))h=null;   // over a part: the part, except on its own legs
  const w=!h&&!p&&wireAt(hov.x,hov.y);body.className='';
  if(h){const v=nodeV(h.h);meterText={x:hov.x,y:hov.y,t:v==null?'not connected':fmtV(v)};body.innerHTML=`<div class="bd-kv"><span>Hole</span><b>${h.h}</b><span>Voltage (to −)</span><b>${v==null?'— not connected':fmtV(v)}</b></div>`;return;}
  if(w){const v=nodeV(w.a);meterText={x:hov.x,y:hov.y,t:v==null?'—':fmtV(v)};body.innerHTML=`<div class="bd-kv"><span>Wire</span><b>${w.a} → ${w.b}</b><span>Voltage (to −)</span><b>${v==null?'—':fmtV(v)}</b></div>`;return;}
  if(p){const ww=run.w.get(p.id);meterText=null;body.innerHTML=`<div class="bd-kv"><span>Part</span><b>${pname(p)}${p.burnt?' 🔥':''}</b>${ww?ww.info.map(([k,v])=>`<span>${k}</span><b>${v}</b>`).join(''):''}</div>`;return;}
  meterText=null;}

// ---------- drawing ----------
function drawGhost(ctx,type,holes,ok,rot){const p={id:-1,type,holes,rot,props:PARTS[type].props};ctx.save();ctx.globalAlpha=0.55;drawPart(ctx,p,null);ctx.restore();
  Object.values(holes).forEach(h=>{const [x,y]=HP(h);ctx.strokeStyle=ok?PAL.green:PAL.bad;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,5,0,7);ctx.stroke();});}
function draw(dt){const ctx=bctx;ctx.clearRect(0,0,cvs.width,cvs.height);drawBoard(ctx);
  S.wires.forEach(w=>{if(drag&&drag.mode==='wend'&&drag.moved&&drag.id===w.id){const o={t:'wire',a:w.a,b:w.b,c:w.color};o[drag.end]=[drag.x,drag.y];
      ctx.save();ctx.globalAlpha=0.85;partOn(ctx,o,false);ctx.restore();const t=nearestHole(drag.x,drag.y,10);
      if(t){const [hx,hy]=HP(t.h);ctx.strokeStyle=PAL.cyan;ctx.lineWidth=2;ctx.beginPath();ctx.arc(hx,hy,6,0,7);ctx.stroke();}return;}
    if(sel&&sel.kind==='wire'&&sel.id===w.id){ctx.save();ctx.shadowColor=PAL.cyan;ctx.shadowBlur=12;partOn(ctx,{t:'wire',a:w.a,b:w.b,c:w.color},false);ctx.restore();}partOn(ctx,{t:'wire',a:w.a,b:w.b,c:w.color},false);});
  S.parts.forEach(p=>{if(drag&&drag.mode==='leg'&&drag.moved&&drag.id===p.id&&!drag.trash){const t=legTarget(drag);
      const q={...p,holes:{...p.holes,[drag.pin]:t&&t.ok?t.h:[drag.x,drag.y]}};ctx.save();ctx.globalAlpha=0.85;drawPart(ctx,q,null);ctx.restore();
      if(t){const [hx,hy]=HP(t.h);ctx.strokeStyle=t.ok?PAL.cyan:PAL.bad;ctx.lineWidth=2;ctx.beginPath();ctx.arc(hx,hy,6,0,7);ctx.stroke();}return;}
    if(drag&&(drag.mode==='move'||drag.mode==='leg')&&drag.moved&&drag.id===p.id)ctx.globalAlpha=0.3;const w=run&&run.w.get(p.id);drawPart(ctx,p,p.type==='usb'?{on:!!run}:w);ctx.globalAlpha=1;});
  if(sel&&sel.kind==='wire'&&!(drag&&drag.mode==='wend'&&drag.moved)){const w=findWire(sel.id);if(w)[w.a,w.b].forEach(h=>{const [hx,hy]=HP(h);ctx.fillStyle=PAL.cyan;ctx.beginPath();ctx.arc(hx,hy,4,0,7);ctx.fill();});}
  if(sel&&sel.kind==='part'&&!(drag&&drag.mode==='leg'&&drag.moved)){const p=findPart(sel.id);if(p&&PARTS[p.type].pins.length===2&&!PARTS[p.type].fixed)Object.values(p.holes).forEach(h=>{const [hx,hy]=HP(h);ctx.fillStyle=PAL.cyan;ctx.beginPath();ctx.arc(hx,hy,3.5,0,7);ctx.fill();});}
  if(sel&&sel.kind==='part'){const p=findPart(sel.id);if(p){const [x,y,w,h]=partBox(p);ctx.setLineDash([4,3]);ctx.strokeStyle=PAL.cyan;ctx.lineWidth=1.5;ctx.strokeRect(x,y,w,h);ctx.setLineDash([]);}}
  if(flashT>0){flashT-=dt;if(Math.floor(flashT*4)%2===0)flashIds.forEach(id=>{const p=findPart(id);if(p){const [x,y,w,h]=partBox(p);ctx.strokeStyle=PAL.amber;ctx.lineWidth=3;ctx.strokeRect(x-3,y-3,w+6,h+6);}});}
  if(drag&&(drag.mode==='new'||drag.mode==='move')&&!drag.trash&&drag.pl&&drag.pl.holes)drawGhost(ctx,drag.mode==='new'?drag.type:findPart(drag.id).type,drag.pl.holes,drag.pl.ok,drag.rot);
  if(drag&&drag.mode==='wire'){const A=HP(drag.a);ctx.strokeStyle=wireColor;ctx.lineWidth=3;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(drag.x,drag.y);ctx.stroke();ctx.setLineDash([]);
    const t=nearestHole(drag.x,drag.y,10);if(t){const [x,y]=HP(t.h);ctx.strokeStyle=PAL.cyan;ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.stroke();}}
  if(hov&&!drag){const h=nearestHole(hov.x,hov.y,6);if(h){const [x,y]=HP(h.h);ctx.strokeStyle='rgba(34,211,238,.8)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,5,0,7);ctx.stroke();}}
  for(let i=smoke.length-1;i>=0;i--){const s=smoke[i];s.life-=dt;if(s.life<=0){smoke.splice(i,1);continue;}s.x+=s.vx*dt;s.y+=s.vy*dt;s.vy-=5*dt;
    ctx.fillStyle=`rgba(120,120,130,${Math.min(0.5,s.life*0.35)})`;ctx.beginPath();ctx.arc(s.x,s.y,6+(2.5-s.life)*6,0,7);ctx.fill();}
  if(meterText&&run){ctx.font='600 12px ui-monospace,monospace';const tw=ctx.measureText(meterText.t).width+12;let x=meterText.x+12,y=meterText.y-26;if(x+tw>cvs.width)x=meterText.x-tw-12;
    ctx.fillStyle='rgba(7,11,22,.92)';ctx.fillRect(x,y,tw,20);ctx.strokeStyle=PAL.cyan;ctx.strokeRect(x,y,tw,20);ctx.fillStyle=PAL.cyan;ctx.textAlign='left';ctx.fillText(meterText.t,x+6,y+14);}
  if(!S.parts.length&&!drag)txt(ctx,'Drag a part from the catalog and drop it here',cvs.width/2,380,PAL.muted,14);}
loop(dt=>{if(run)simFrame(dt);draw(dt);});

// ---------- toolbar ----------
$('bdUndo').onclick=undo;$('bdRedo').onclick=redo;$('bdDelete').onclick=removeSel;
$('bdRotate').onclick=()=>{if(sel&&sel.kind==='part')rotate(findPart(sel.id));else status('Select a part first (click it).','warn');};
$('bdClear').onclick=()=>{if(!S.parts.length&&!S.wires.length)return;const before=snapState();S={parts:[],wires:[]};sel=null;commit(before);status('Board cleared (Undo brings it back).');};

// ---------- save / open (in this browser) ----------
const STORE='buildlab:circuits';
const saved=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}');}catch(e){return {};}};
const modal=document.createElement('div');modal.className='bd-modal';modal.hidden=true;$('page-build').appendChild(modal);
function openModal(html){modal.innerHTML=`<div class="box">${html}</div>`;modal.hidden=false;modal.onclick=e=>{if(e.target===modal)modal.hidden=true;};}
$('bdSave').onclick=()=>{openModal(`<h3 class="flush">Save this circuit</h3><div class="bd-row"><input id="bdName" class="fsel" style="flex:1" placeholder="Name, e.g. LED + 470 Ω"></div><div class="bd-row"><button class="go" id="bdDoSave">💾 Save</button><button id="bdCancel">Cancel</button></div>`);
  const inp=$('bdName');inp.focus();$('bdCancel').onclick=()=>modal.hidden=true;
  const go=()=>{const n=inp.value.trim();if(!n)return;const all=saved();all[n]={at:new Date().toISOString(),s:S};try{localStorage.setItem(STORE,JSON.stringify(all));status(`Saved as "${n}".`);}catch(e){status('Could not save (browser storage blocked).','warn');}modal.hidden=true;};
  $('bdDoSave').onclick=go;inp.onkeydown=e=>{if(e.key==='Enter')go();};};
$('bdOpen').onclick=()=>{const all=saved(),names=Object.keys(all).sort();
  openModal(`<h3 class="flush">Open a saved circuit</h3>${names.length?`<ul class="bd-saved">${names.map(n=>`<li><span>${n.replace(/</g,'&lt;')}</span><button data-n="${encodeURIComponent(n)}" class="bd-o">Open</button><button data-n="${encodeURIComponent(n)}" class="bd-d stop">🗑</button></li>`).join('')}</ul>`:'<p class="hint">Nothing saved yet: build a circuit and press 💾 Save.</p>'}<div class="bd-row"><button id="bdCancel">Close</button></div>`);
  $('bdCancel').onclick=()=>modal.hidden=true;
  modal.querySelectorAll('.bd-o').forEach(b=>b.onclick=()=>{const n=decodeURIComponent(b.dataset.n);const before=snapState();S=JSON.parse(JSON.stringify(all[n].s));sel=null;NID=1+Math.max(0,...S.parts.map(p=>p.id),...S.wires.map(w=>w.id));commit(before);modal.hidden=true;status(`Opened "${n}".`);});
  modal.querySelectorAll('.bd-d').forEach(b=>b.onclick=()=>{const n=decodeURIComponent(b.dataset.n);const a2=saved();delete a2[n];try{localStorage.setItem(STORE,JSON.stringify(a2));}catch(e){}$('bdOpen').onclick();});};
try{const cur=localStorage.getItem('buildlab:current');if(cur){S=JSON.parse(cur);NID=1+Math.max(0,...S.parts.map(p=>p.id),...S.wires.map(w=>w.id));}}catch(e){}

// ---------- open a Circuits project in the lab (its final breadboard) ----------
const LED_BY_RGB={'239,68,68':'red','34,197,94':'green','250,204,21':'yellow','59,130,246':'blue','226,232,240':'white','248,250,252':'white'};
function capFrom(lab,dflt){const m=/([\d.]+)\s*([µunp])/.exec(lab||'');if(!m)return dflt;return +m[1]*{µ:1e-6,u:1e-6,n:1e-9,p:1e-12}[m[2]];}
function importLayout(L){if(!L||L.noBoard)return null;const out={parts:[],wires:[]};let id=1;const H=h=>typeof h==='string'&&parseHole(h)?h:null;
  for(const p of L.parts){if(p.until)continue;const add=(type,holes,props={})=>{if(Object.values(holes).some(h=>!h))throw 0;out.parts.push({id:id++,type,holes,rot:0,props:{...JSON.parse(JSON.stringify(PARTS[type].props)),...props},burnt:false});};
    try{switch(p.t){
      case 'wire':if(!H(p.a)||!H(p.b))return null;out.wires.push({id:id++,a:p.a,b:p.b,color:p.c||PAL.greenDark});break;
      case 'res':add('res',{'1':H(p.a),'2':H(p.b)},{R:p.v||470});break;
      case 'led':add('led',{'+':H(p.a),'−':H(p.b)},{color:LED_BY_RGB[p.rgb||'239,68,68']||'red'});break;
      case 'ecap':add('ecap',{'+':H(p.a),'−':H(p.b)},{C:capFrom(p.lab,100e-6)});break;
      case 'ccap':add('ccap',{'1':H(p.a),'2':H(p.b)},{C:capFrom(p.lab,100e-9)});break;
      case 'diode':add('d4007',{A:H(p.a),K:H(p.b)});break;
      case 'buz':add('buz',{'+':H(p.a),'−':H(p.b)});break;
      case 'ldr':add('ldr',{'1':H(p.a),'2':H(p.b)});break;
      case 'npn':add('npn',{C:H(p.c),B:H(p.b),E:H(p.e)},{kind:L.parts.some(q=>q.t==='box'&&/motor/i.test(q.lab||''))?'SS8050':'BC547'});break;
      case 'pot':add('pot',{'1':H(p.h[0]),W:H(p.h[1]),'3':H(p.h[2])});break;
      case 'btn':add('btn',{'1a':'e'+p.col,'2a':'e'+(p.col+2),'1b':'f'+p.col,'2b':'f'+(p.col+2)});break;
      case 'chip':if(p.n!==8||!/555/.test(p.lab||''))return null;{const c=p.col,hs={};for(let i=0;i<4;i++){hs[String(i+1)]='f'+(c+i);hs[String(8-i)]='e'+(c+i);}add('ne555',hs);}break;
      case 'batt':add('batt',{'+':H(p.plus),'−':H(p.minus)},{V:parseFloat(p.lab)||9});break;
      case 'pm':add('usb',{...PARTS.usb.fixed});break;
      case 'box':if(/motor/i.test(p.lab||'')&&p.pins&&p.pins.length===2){add('motor',{'1':H(p.pins[0].to),'2':H(p.pins[1].to)});break;}return null;
      case 'note':break;
      default:return null;}}catch(e){return null;}}
  return out;}
window.BUILD_LAB={canImport:L=>!!importLayout(L),load:(L,name)=>{const s=importLayout(L);if(!s)return false;const before=snapState();S=s;NID=1+Math.max(0,...S.parts.map(p=>p.id),...S.wires.map(w=>w.id));sel=null;commit(before);if(run)play(false);status(`Loaded ${name||'the project'}: press ▶ Play.`);return true;}};
document.querySelectorAll('.bd-open[data-project]').forEach(b=>{const L=window.BBL_LAYOUTS&&window.BBL_LAYOUTS[b.dataset.project];if(L&&window.BUILD_LAB.canImport(L)){b.hidden=false;
  b.onclick=()=>{window.BUILD_LAB.load(L,'project '+b.dataset.project.replace(/^p/,''));location.hash='#build';};}});
renderProps();

})();
