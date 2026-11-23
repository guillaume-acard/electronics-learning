
// ================= inductor =================
(function(){
const PG=document.getElementById('page-inductor');
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


// ===== 3. Switch on/off with water wheel =====
const IN={on:false,diode:0,I:0,t:0,h:[],spike:0,spin:0,off:0,sparks:0};
choices('inChoices',['No diode','With flyback diode'],0,i=>IN.diode=i);
$('inSw').onclick=()=>{IN.on=!IN.on;$('inSw').textContent='Switch: '+(IN.on?'ON':'OFF');$('inSw').className=IN.on?'active':'';
  if(!IN.on&&!IN.diode&&IN.I>0.05){IN.spike=IN.I*300;IN.sparks=0.5;IN.I=0;}};
function drawInd(dt){const L=+$('inL').value;IN.t+=dt;
  if(IN.on)IN.I+=(1-IN.I)*dt/(0.4*L);else if(IN.diode)IN.I+=(0-IN.I)*dt/(0.5*L);else IN.I=0;
  IN.spike*=Math.exp(-dt/0.05);IN.sparks=Math.max(0,IN.sparks-dt);IN.spin+=IN.I*dt*10;IN.off+=IN.I*dt*70;
  const Vsw=IN.on?0:(IN.diode?(IN.I>0.02?9.7:9):9+IN.spike);
  IN.h.push({t:IN.t,I:IN.I,v:Vsw});prune(IN.h,IN.t,5);
  const c=$('cInd'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=50,B=280,Lx=60,cx=330;
  part(ctx,'batt',Lx,T,Lx,B,{label:'9 V',left:true});wire(ctx,[[Lx,T],[140,T]]);part(ctx,'switch',140,T,220,T,{closed:IN.on,label:'switch'});
  wire(ctx,[[220,T],[cx,T],[cx,100]]);part(ctx,'coil',cx,100,cx,190,{core:true,label:'coil'});wire(ctx,[[cx,190],[cx,205]]);
  part(ctx,'lamp',cx,205,cx,255,{glow:IN.I});wire(ctx,[[cx,255],[cx,B],[Lx,B]]);
  if(IN.diode){wire(ctx,[[cx,T+20],[cx+70,T+20],[cx+70,110]]);part(ctx,'diode',cx+70,190,cx+70,110,{col:PAL.good,label:'flyback'});wire(ctx,[[cx+70,190],[cx+70,230],[cx,230]]);}
  if(IN.I>0.02){if(IN.on)dots(ctx,[[Lx,B-20],[Lx,T],[cx,T],[cx,B],[Lx,B]],IN.off);else if(IN.diode)dots(ctx,[[cx,T+20],[cx,230],[cx+70,230],[cx+70,T+20],[cx,T+20]],IN.off,PAL.good);}
  // water wheel icon
  const wx=cx-80,wy=145;ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;ctx.beginPath();ctx.arc(wx,wy,22,0,7);ctx.stroke();ctx.save();ctx.translate(wx,wy);ctx.rotate(IN.spin);for(let i=0;i<6;i++){ctx.rotate(Math.PI/3);ctx.fillStyle=PAL.blue;ctx.fillRect(10,-3,14,6);}ctx.restore();
  txt(ctx,'heavy wheel',wx,wy+40,PAL.muted,11);
  if(IN.sparks>0){ctx.strokeStyle=PAL.highlight;ctx.lineWidth=2;for(let i=0;i<8;i++){const a=Math.random()*6.28,r=10+Math.random()*22;ctx.beginPath();ctx.moveTo(196,T-6);ctx.lineTo(196+r*Math.cos(a),T-6+r*Math.sin(a));ctx.stroke();}txt(ctx,'⚡ SPARK at the switch',180,T+40,PAL.highlight,13);}
  plot(ctx,500,30,280,100,IN.h,IN.t,5,[{k:'I',col:Y,label:'current'}],0,1.1,'');
  plot(ctx,500,180,280,100,IN.h,IN.t,5,[{k:'v',col:PAL.redSoft,label:'voltage across the switch'}],0,60,'');
  const pk=Math.max(...IN.h.map(p=>p.v));txt(ctx,pk>60?'spike ≈ '+Math.round(pk)+' V!':'max '+pk.toFixed(1)+' V',640,310,pk>60?PAL.bad:PAL.good,13);}

// ===== 5A. Boost =====
const BS={t:0,ph:0,I:0,h:[],ledAvg:0};
function drawBoost(dt){const f=+$('bsF').value;BS.t+=dt;BS.ph=(BS.ph+dt*f)%1;const on=BS.ph<0.5;
  if(on)BS.I=Math.min(1,BS.I+dt*f*2.2);else BS.I=Math.max(0,BS.I-dt*f*2.6);
  const node=on?0.1:(BS.I>0.01?3.2:1.5),led=!on&&BS.I>0.01?Math.min(1,BS.I*1.4):0;BS.ledAvg+=(led-BS.ledAvg)*Math.min(1,dt*6);
  BS.h.push({t:BS.t,I:BS.I,v:node,ref:3});prune(BS.h,BS.t,4);
  const c=$('cBoost'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=60,B=260,Lx=60;part(ctx,'batt',Lx,T,Lx,B,{label:'1.5 V',left:true});wire(ctx,[[Lx,T],[110,T]]);part(ctx,'coil',110,T,220,T,{label:'coil'});
  wire(ctx,[[220,T],[260,T]]);dot(ctx,260,T);wire(ctx,[[260,T],[260,128]]);npnQ(ctx,250,162,on);wire(ctx,[[260,196],[260,B]]);txt(ctx,on?'switch ON: coil charging':'switch OFF: coil kicks',250,B+28,on?PAL.good:Y,12);
  wire(ctx,[[260,T],[300,T]]);part(ctx,'diode',300,T,370,T);wire(ctx,[[370,T],[410,T],[410,130]]);
  const bright=f>1.6?BS.ledAvg*1.2:led;part(ctx,'led',410,130,410,210,{glow:bright,rgb:'241,245,249',label:'white LED',left:true});wire(ctx,[[410,210],[410,B],[Lx,B]]);
  if(on&&BS.I>0.02)dots(ctx,[[Lx,B-20],[Lx,T],[260,T],[260,B],[Lx,B]],BS.t*60);if(!on&&BS.I>0.02)dots(ctx,[[Lx,B-20],[Lx,T],[410,T],[410,B],[Lx,B]],BS.t*60,'#a5f3fc');
  plot(ctx,500,30,280,90,BS.h,BS.t,4,[{k:'I',col:Y,label:'coil current'}],0,1.1,'');
  plot(ctx,500,170,280,90,BS.h,BS.t,4,[{k:'v',col:PAL.redSoft,label:'voltage before diode'},{k:'ref',col:PAL.muted,dash:[4,4],lw:1,label:'3 V'}],0,4,'');
  txt(ctx,f>1.6?'fast switching: the LED looks steady':'slow: you see each kick',640,295,PAL.muted,12);}

// ===== 5B. LC filter =====
const LC={f:1,t:0,h:[],a:5,b:5,ia:0};
choices('lcChoices',['No filter','With LC filter'],1,i=>LC.f=i);
function drawLC(dt){LC.t+=dt;const noise=0.6*Math.sin(LC.t*47)+0.4*Math.sin(LC.t*83+1)+0.3*(Math.random()-0.5);const vin=5+noise;
  // 2nd order low-pass
  const w=6,z=0.7;LC.ia+=(w*w*(vin-LC.a)-2*z*w*LC.ia)*dt;LC.a+=LC.ia*dt;const out=LC.f?LC.a:vin;
  LC.h.push({t:LC.t,vin,out});prune(LC.h,LC.t,3);
  const c=$('cLC'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const y=90;txt(ctx,'noisy 5 V',40,y-14,PAL.amber,12,'left');wire(ctx,[[30,y],[90,y]],PAL.amber);
  if(LC.f){part(ctx,'coil',90,y,190,y,{core:true,label:'100 µH'});wire(ctx,[[190,y],[260,y]]);dot(ctx,230,y);part(ctx,'cap',230,y,230,190,{label:'470 µF'});wire(ctx,[[230,190],[230,200]]);gndSym(ctx,230,200);}
  else wire(ctx,[[90,y],[260,y]]);
  txt(ctx,'clean 5 V →',266,y+4,PAL.good,12,'left');
  plot(ctx,380,20,400,90,LC.h,LC.t,3,[{k:'vin',col:PAL.amber,label:'input'}],3,7,'');
  plot(ctx,380,145,400,80,LC.h,LC.t,3,[{k:'out',col:PAL.good,label:'output'}],3,7,'');}

// ===== 5C. Transformer =====
const TR={dc:0,t:0,h:[]};
choices('trChoices',['AC in','DC in'],0,i=>{TR.dc=i;TR.t0=TR.t;});
function drawTr(dt){TR.t+=dt;const N=+$('trN').value,ratio=N/1000;
  const vin=TR.dc?230:230*Math.sin(2*Math.PI*0.8*TR.t);const vout=TR.dc?(TR.t-(TR.t0||0)<0.08?230*ratio*0.6:0):vin*ratio;
  TR.h.push({t:TR.t,vin:vin/230,vout:vout/230});prune(TR.h,TR.t,4);
  const c=$('cTr'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  // core
  ctx.strokeStyle=PAL.muted2;ctx.lineWidth=14;ctx.strokeRect(140,50,170,150);
  const coilV=(x,n,col)=>{ctx.strokeStyle=col;ctx.lineWidth=2.5;const k=Math.max(3,Math.min(14,Math.round(n)));for(let i=0;i<k;i++){const yy=62+i*(126/k);ctx.beginPath();ctx.ellipse(x,yy+4,18,5,0,0,Math.PI);ctx.stroke();}};
  coilV(140,14,PAL.amber);coilV(310,N/30,PAL.good);
  txt(ctx,'1000 turns',140,224,PAL.amber,12);txt(ctx,N+' turns',310,224,PAL.good,12);
  wire(ctx,[[40,80],[122,80]],PAL.amber);wire(ctx,[[40,180],[122,180]],PAL.amber);txt(ctx,TR.dc?'230 V DC':'230 V AC',40,70,PAL.amber,12,'left');
  wire(ctx,[[328,80],[400,80]],PAL.good);wire(ctx,[[328,180],[400,180]],PAL.good);
  const Vo=TR.dc?0:230*ratio;txt(ctx,TR.dc?'0 V out':Vo.toFixed(1)+' V AC out',404,134,TR.dc?PAL.bad:PAL.good,15,'left');
  plot(ctx,540,20,240,90,TR.h,TR.t,4,[{k:'vin',col:PAL.amber,label:'input'}],-1.1,1.1,'');
  const rr=Math.max(ratio*1.15,0.03);plot(ctx,540,150,240,90,TR.h,TR.t,4,[{k:'vout',col:PAL.good,label:'output (zoomed in)'}],-rr,rr,'');
  txt(ctx,TR.dc?'DC: the field doesn\'t change, so nothing is induced':'Vout = 230 V × '+N+' ÷ 1000',400,262,TR.dc?PAL.bad:PAL.muted,12);}

// ===== Symbols =====
(function(){const c=$('cSymI'),ctx=c.getContext('2d');part(ctx,'coil',60,45,320,45,{});part(ctx,'coil',60,120,320,120,{core:true});})();

loop((dt,now)=>{drawInd(dt);drawBoost(dt);drawLC(dt);drawTr(dt);});

})();
