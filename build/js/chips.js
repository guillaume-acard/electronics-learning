
// ================= chips =================
(function(){
const PG=document.getElementById('page-chips');
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


// ===== DIP helper =====
function dip(ctx,x,y,labels,title,hl=[],sp=20){const n=labels.length,h=n/2,w=70,H=h*sp+10;
  ctx.fillStyle=PAL.chip;ctx.fillRect(x,y,w,H);ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.strokeRect(x,y,w,H);
  ctx.fillStyle=PAL.canvas;ctx.beginPath();ctx.arc(x+w/2,y,8,0,Math.PI);ctx.fill();ctx.fillStyle=PAL.muted;ctx.beginPath();ctx.arc(x+12,y+12,3,0,7);ctx.fill();
  arrowText(ctx,title,x+w/2,y+H/2+4,PAL.ink,12);
  for(let i=0;i<h;i++){const py=y+15+i*sp;
    [[i,x-12,'right',x-16],[n-1-i,x+w,'left',x+w+16]].forEach(([k,px,al,tx])=>{const on=hl.includes(k+1);ctx.fillStyle=on?PAL.yellow:PAL.ink2;ctx.fillRect(px,py-3,12,6);
      arrowText(ctx,(al==='right'?labels[k]+' '+(k+1):(k+1)+' '+labels[k]),tx,py+4,on?PAL.yellow:PAL.muted,10,al);});}
  return H;}

// ===== 1. Anatomy =====
(function(){const c=$('cDip'),ctx=c.getContext('2d');const x=120,y=40,w=110,sp=36;
  ctx.fillStyle=PAL.chip;ctx.fillRect(x,y,w,4*sp+10);ctx.strokeStyle=PAL.slate;ctx.lineWidth=2;ctx.strokeRect(x,y,w,4*sp+10);
  ctx.fillStyle=PAL.canvas;ctx.beginPath();ctx.arc(x+w/2,y,12,0,Math.PI);ctx.fill();ctx.fillStyle=PAL.muted;ctx.beginPath();ctx.arc(x+18,y+18,5,0,7);ctx.fill();
  for(let i=0;i<4;i++){const py=y+22+i*sp;ctx.fillStyle=PAL.ink2;ctx.fillRect(x-20,py-4,20,8);ctx.fillRect(x+w,py-4,20,8);
    arrowText(ctx,String(i+1),x-28,py+5,PAL.yellow,14,'right');arrowText(ctx,String(8-i),x+w+28,py+5,PAL.yellow,14,'left');}
  ctx.strokeStyle=PAL.yellow;ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.ellipse(x+w/2,y+80,w/2+50,90,0,-2.6,2.6,true);ctx.stroke();ctx.setLineDash([]);
  arrowText(ctx,'notch',x+w/2,y-14,PAL.muted,12);arrowText(ctx,'dot = pin 1',x+30,y+42,PAL.muted,11,'left');
  arrowText(ctx,'anticlockwise ↺',x+w/2,y+4*sp+40,PAL.yellow,13);
  // die zoom
  const dx=470,dy=40;ctx.fillStyle=PAL.slateDark;ctx.fillRect(dx,dy,170,150);ctx.strokeStyle=PAL.muted2;ctx.strokeRect(dx,dy,170,150);
  for(let i=0;i<14;i++)for(let j=0;j<12;j++){ctx.fillStyle=(i*7+j*3)%5?PAL.slate:PAL.blue;ctx.fillRect(dx+8+i*11.5,dy+8+j*11.5,8,8);}
  W(ctx,[[x+w+60,y+60],[dx-10,dy+70]],PAL.muted,1.5);
  arrowText(ctx,'inside: a silicon "die"',dx+85,dy+170,PAL.ink,13);arrowText(ctx,'covered in microscopic transistors,',dx+85,dy+188,PAL.muted,12);arrowText(ctx,'resistors and wires',dx+85,dy+204,PAL.muted,12);})();

// ===== 3. 555 =====
const CAPS=[[100e-6,'100 µF'],[10e-6,'10 µF'],[1e-6,'1 µF'],[100e-9,'100 nF'],[10e-9,'10 nF']];
const T5={c:1,t:0,osc:null,ctxA:null};
choices('tCch',CAPS.map(c=>c[1]),1,i=>{T5.c=i;updSnd();});
const kR=v=>Math.pow(10,+v)*1000;
function p555(){const R1=kR($('tR1').value),R2=kR($('tR2').value),C=CAPS[T5.c][0];const th=0.693*(R1+R2)*C,tl=0.693*R2*C;return{R1,R2,C,th,tl,T:th+tl,f:1/(th+tl)};}
function updSnd(){if(T5.osc){const f=p555().f;T5.osc.frequency.value=Math.min(8000,Math.max(20,f));}}
['tR1','tR2'].forEach(id=>$(id).addEventListener('input',updSnd));
$('tSnd').onclick=()=>{try{if(T5.osc){T5.osc.stop();T5.osc=null;$('tSnd').textContent='🔊 Listen';return;}
  T5.ctxA=T5.ctxA||new (window.AudioContext||window.webkitAudioContext)();const o=T5.ctxA.createOscillator(),g=T5.ctxA.createGain();o.type='square';g.gain.value=0.05;o.connect(g);g.connect(T5.ctxA.destination);o.start();T5.osc=o;updSnd();$('tSnd').textContent='🔇 Stop';}catch(e){$('tSnd').textContent='sound unavailable';}};
const fmtK=r=>r>=1e6?(r/1e6).toFixed(1)+' MΩ':r>=1000?(r/1000).toFixed(r<10000?1:0)+' kΩ':r.toFixed(0)+' Ω';
const fmtF=f=>f>=1000?(f/1000).toFixed(2)+' kHz':f>=10?f.toFixed(0)+' Hz':f.toFixed(2)+' Hz';
function draw555(dt){T5.t+=dt;const P=p555(),c=$('c555'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  dip(ctx,60,40,['GND','TRIG','OUT','RESET','CTRL','THR','DIS','VCC'],'NE555',[2,3,6,7,8]);
  const slow=P.f<8,win=slow?4:3*P.T,t0=slow?T5.t-win:0;
  const vc=t=>{const ph=((t%P.T)+P.T)%P.T;return ph<P.th?1-(2/3)*Math.exp(-ph/((P.R1+P.R2)*P.C)):(2/3)*Math.exp(-(ph-P.th)/(P.R2*P.C));};
  const out=t=>{const ph=((t%P.T)+P.T)%P.T;return ph<P.th;};
  const gx=330,gw=450,X=t=>gx+(t-t0)/win*gw;
  [[30,90,'capacitor',k=>vc(k),PAL.blue],[150,60,'output (pin 3)',k=>out(k)?1:0,PAL.good]].forEach(([gy,gh,l,fn,col])=>{ctx.fillStyle=PAL.raised;ctx.fillRect(gx,gy,gw,gh);arrowText(ctx,l,gx-6,gy+gh/2+4,PAL.muted,11,'right');
    if(l==='capacitor'){[1/3,2/3].forEach(v=>{const yy=gy+gh-v*gh;ctx.strokeStyle=PAL.amber;ctx.setLineDash([4,4]);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gx,yy);ctx.lineTo(gx+gw,yy);ctx.stroke();ctx.setLineDash([]);arrowText(ctx,v<0.5?'⅓':'⅔',gx+gw+4,yy+4,PAL.amber,11,'left');});}
    ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();for(let px=0;px<=gw;px++){const t=t0+px/gw*win,v=fn(t),yy=gy+gh-4-v*(gh-8);px?ctx.lineTo(gx+px,yy):ctx.moveTo(gx+px,yy);}ctx.stroke();});
  const on=slow?out(T5.t):true,b=slow?(on?1:0):P.th/P.T;
  const lx=250,ly=120;if(b>0.02){const g=ctx.createRadialGradient(lx,ly,2,lx,ly,40);g.addColorStop(0,`rgba(239,68,68,${b})`);g.addColorStop(1,'rgba(239,68,68,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(lx,ly,40,0,7);ctx.fill();}
  ctx.fillStyle=`rgba(239,68,68,${0.25+0.75*b})`;ctx.beginPath();ctx.arc(lx,ly,12,0,7);ctx.fill();arrowText(ctx,'LED',lx,ly+30,PAL.muted,11);
  arrowText(ctx,'R1 '+fmtK(P.R1)+' · R2 '+fmtK(P.R2)+' · C '+CAPS[T5.c][1],gx,240,PAL.ink,13,'left');
  arrowText(ctx,'→ '+fmtF(P.f)+'   (on '+Math.round(P.th/P.T*100)+'% of the time)',gx,262,PAL.yellow,15,'left');
  arrowText(ctx,slow?'slow enough to see it blink':P.f<25?'blinking fast':P.f<20000?'too fast to see: it\'s a tone! Press Listen':'ultrasonic',gx,284,PAL.muted,12,'left');}

// ===== 4. 7805 =====
const RG={hs:0,T:0,shut:false};
choices('rgChoices',['No heatsink','With heatsink'],0,i=>RG.hs=i);
function draw7805(dt){const Vin=+$('rgV').value,Il=+$('rgI').value;
  let Vout=RG.shut?0:Math.max(0,Math.min(5,Vin-2));const I=Il*Vout/5,P=Math.max(0,Vin-Vout)*I;
  const Rth=RG.hs?8:60;RG.T+=(P*Rth-RG.T)*dt/2.5;if(RG.T>100)RG.shut=true;if(RG.shut&&RG.T<70)RG.shut=false;
  const c=$('c7805'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  // TO-220 drawing
  const x=80,y=40;if(RG.hs){ctx.fillStyle=PAL.muted2;for(let i=0;i<6;i++)ctx.fillRect(x-20+i*14,y-25,8,60);}
  ctx.fillStyle=PAL.muted;ctx.fillRect(x-10,y,90,40);ctx.fillStyle=PAL.canvas;ctx.beginPath();ctx.arc(x+35,y+20,7,0,7);ctx.fill();
  const hot=Math.min(1,RG.T/100);ctx.fillStyle=`rgb(${Math.round(31+200*hot)},${Math.round(41-10*hot)},${Math.round(55-20*hot)})`;ctx.fillRect(x-10,y+40,90,60);
  arrowText(ctx,'7805',x+35,y+76,PAL.ink,14);
  ['IN','GND','OUT'].forEach((l,i)=>{ctx.fillStyle=PAL.ink2;ctx.fillRect(x+4+i*30,y+100,6,50);arrowText(ctx,String(i+1),x+7+i*30,y+164,PAL.yellow,11);arrowText(ctx,l,x+7+i*30,y+180,PAL.yellow,10);});
  // gauges
  const gauge=(gx,v,max,l,col)=>{ctx.fillStyle=PAL.raised;ctx.fillRect(gx,40,60,150);ctx.fillStyle=col;const h=Math.min(1,v/max)*150;ctx.fillRect(gx,190-h,60,h);ctx.strokeStyle=PAL.slate;ctx.strokeRect(gx,40,60,150);
    arrowText(ctx,l,gx+30,30,PAL.muted,12);arrowText(ctx,v.toFixed(l==='heat'?2:1)+(l==='heat'?' W':' V'),gx+30,210,col,15);};
  gauge(290,Vin,20,'input',PAL.amber);gauge(390,Vout,20,'output',PAL.good);gauge(490,P,5,'heat',PAL.bad);
  ctx.strokeStyle=PAL.good;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(390,190-5/20*150);ctx.lineTo(450,190-5/20*150);ctx.stroke();ctx.setLineDash([]);
  // thermometer
  const tx=600;ctx.fillStyle=PAL.raised;ctx.fillRect(tx,40,20,150);const tl=Math.min(1,RG.T/110);ctx.fillStyle=RG.T>80?PAL.bad:RG.T>50?PAL.amber:PAL.good;ctx.fillRect(tx,190-tl*150,20,tl*150);ctx.strokeStyle=PAL.slate;ctx.strokeRect(tx,40,20,150);
  arrowText(ctx,'chip temp',tx+10,30,PAL.muted,12);
  let msg,col;
  if(RG.shut){msg='Too hot: thermal shutdown! Output cut until it cools.';col=PAL.bad;}
  else if(Vin<7){msg='Input too low (needs ≥ 7 V): output sags below 5 V';col=PAL.amber;}
  else if(P>1&&!RG.hs){msg='Getting very hot: add a heatsink';col=PAL.amber;}
  else {msg='Steady 5 V out ✓';col=PAL.good;}
  wrapText(ctx,msg,640,90,150,18,col,13);
  arrowText(ctx,'heat = ('+Vin.toFixed(1)+' − '+Vout.toFixed(1)+') V × '+(I*1000).toFixed(0)+' mA',440,245,PAL.muted,12);}

// ===== 5. LM358 =====
const OA={mode:0,t:0,h:[]};
choices('oaChoices',['Comparator (yes / no)','Amplifier (with feedback)'],0,i=>{OA.mode=i;$('oaCmp').style.display=i?'none':'';$('oaAmp').style.display=i?'':'none';});
function opTri(ctx,x,y,col=PAL.ink2){ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.fillStyle=PAL.canvas;ctx.beginPath();ctx.moveTo(x,y-45);ctx.lineTo(x+80,y);ctx.lineTo(x,y+45);ctx.closePath();ctx.fill();ctx.stroke();
  arrowText(ctx,'+',x+10,y-17,PAL.redSoft,16,'left');arrowText(ctx,'−',x+10,y+27,PAL.blue,16,'left');}
function draw358(dt){OA.t+=dt;const c=$('c358'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  dip(ctx,90,40,['OUT A','IN− A','IN+ A','GND','IN+ B','IN− B','OUT B','VCC'],'LM358',[1,2,3,4,8]);
  if(!OA.mode){const vp=+$('oaP').value,vn=+$('oaN').value,hi=vp>vn,vo=hi?3.5:0;
    const x=400,y=120;opTri(ctx,x,y,hi?PAL.good:PAL.ink2);W(ctx,[[290,y-22],[x,y-22]],PAL.ink2);W(ctx,[[290,y+22],[x,y+22]],PAL.ink2);W(ctx,[[x+80,y],[550,y]],PAL.ink2);
    arrowText(ctx,'sensor '+vp.toFixed(2)+' V',292,y-30,PAL.redSoft,12,'left');arrowText(ctx,'threshold '+vn.toFixed(2)+' V',292,y+40,PAL.blue,12,'left');
    const g=ctx.createRadialGradient(575,y,2,575,y,40);if(hi){g.addColorStop(0,'rgba(250,204,21,1)');g.addColorStop(1,'rgba(250,204,21,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(575,y,40,0,7);ctx.fill();}
    ctx.fillStyle=hi?PAL.yellowSoft:'#3f3f46';ctx.beginPath();ctx.arc(575,y,13,0,7);ctx.fill();
    arrowText(ctx,'out: '+vo.toFixed(1)+' V ('+(hi?'HIGH':'LOW')+')',600,y+5,hi?PAL.good:PAL.muted,14,'left');
    // see-saw
    const sx=470,sy=225,a=Math.max(-0.3,Math.min(0.3,(vn-vp)*3));ctx.save();ctx.translate(sx,sy);ctx.rotate(a);ctx.fillStyle=PAL.muted2;ctx.fillRect(-90,-4,180,8);ctx.fillStyle=PAL.redSoft;ctx.fillRect(-90,-18,20,14);ctx.fillStyle=PAL.blue;ctx.fillRect(70,-18,20,14);ctx.restore();
    ctx.fillStyle=PAL.muted;ctx.beginPath();ctx.moveTo(sx,sy+4);ctx.lineTo(sx-10,sy+22);ctx.lineTo(sx+10,sy+22);ctx.fill();
    arrowText(ctx,hi?'+ is higher → output slams HIGH':'+ is lower → output slams LOW',580,225,PAL.ink,12,'left');arrowText(ctx,'(even 0.001 V difference is enough)',580,245,PAL.muted,11,'left');}
  else{const r=+$('oaG').value,G=1+r;const vin=0.3+0.1*Math.sin(2*Math.PI*0.8*OA.t);const vo=Math.max(0,Math.min(3.5,G*vin));
    OA.h.push({t:OA.t,vin,vo,top:3.5});prune(OA.h,OA.t,4);
    const x=330,y=110;opTri(ctx,x,y);W(ctx,[[290,y-22],[x,y-22]],PAL.ink2);arrowText(ctx,'in',292,y-30,PAL.amber,12,'left');
    W(ctx,[[x+80,y],[x+120,y],[x+120,y+70],[x+90,y+70]],PAL.ink2);resBox2(ctx,x+40,y+62,50,16,'Rf');W(ctx,[[x+40,y+70],[x-20,y+70],[x-20,y+22],[x,y+22]],PAL.ink2);
    W(ctx,[[x-20,y+70],[x-20,y+90]],PAL.ink2);resBox2(ctx,x-28,y+90,16,40,'Rg');W(ctx,[[x-20,y+130],[x-20,y+145]],PAL.ink2);gndSym(ctx,x-20,y+145);
    arrowText(ctx,'gain = 1 + Rf/Rg = '+G.toFixed(1),x-10,y-60,PAL.yellow,14,'left');
    plot(ctx,500,30,280,170,OA.h,OA.t,4,[{k:'vin',col:PAL.amber,label:'input'},{k:'vo',col:PAL.good,label:'output'},{k:'top',col:PAL.bad,dash:[5,4],lw:1,label:'max (VCC − 1.5 V)'}],0,4.2,'');
    arrowText(ctx,G*0.4>3.5?'Too much gain: output clipped at the top':'Exact copy, '+G.toFixed(1)+'× bigger',625,250,G*0.4>3.5?PAL.yellow:PAL.good,13);}}
function resBox2(ctx,x,y,w,h,t){ctx.fillStyle=PAL.canvas;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=2.5;ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);arrowText(ctx,t,w>h?x+w/2:x+w+14,w>h?y-6:y+h/2+4,PAL.ink,11);}

// ===== 6. LM386 =====
const LA={t:0,h:[],cone:0};
function draw386(dt){LA.t+=dt;const a=+$('laIn').value*0.1,k=+$('laG').value,G=20+180*k;
  const vin=a*(Math.sin(2*Math.PI*0.9*LA.t)+0.3*Math.sin(2*Math.PI*2.7*LA.t));const vo=Math.max(0.4,Math.min(8.6,4.5+G*vin*0.5));
  LA.h.push({t:LA.t,vo,hi:8.6,lo:0.4,mid:4.5});prune(LA.h,LA.t,4);
  const c=$('c386'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  dip(ctx,90,40,['GAIN','−IN','+IN','GND','OUT','VS','BYPASS','GAIN'],'LM386',[1,8,3,5]);
  arrowText(ctx,'gain knob between 1 and 8',125,165,PAL.yellow,11);
  plot(ctx,270,30,320,170,LA.h,LA.t,4,[{k:'vo',col:PAL.good,label:'output (pin 5)'},{k:'mid',col:PAL.muted,dash:[4,4],lw:1,label:'4.5 V'},{k:'hi',col:PAL.bad,dash:[5,4],lw:1,label:'limits'},{k:'lo',col:PAL.bad,dash:[5,4],lw:1}],0,9,'');
  // speaker
  const sx=680,sy=110,d=(vo-4.5)*3;ctx.fillStyle=PAL.ink2;ctx.fillRect(sx-40,sy-18,22,36);
  ctx.fillStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(sx-18,sy-18);ctx.lineTo(sx+20+d,sy-50);ctx.lineTo(sx+20+d,sy+50);ctx.lineTo(sx-18,sy+18);ctx.fill();
  ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;const amp=Math.min(1,Math.abs(vo-4.5)/4);for(let i=0;i<3;i++){ctx.globalAlpha=amp*(1-i*0.3);ctx.beginPath();ctx.arc(sx+30,sy,25+i*16,-0.7,0.7);ctx.stroke();}ctx.globalAlpha=1;
  arrowText(ctx,'push ↔ pull',sx,sy+75,PAL.muted,12);
  const clip=G*a*1.3*0.5>4.1;arrowText(ctx,'gain ≈ '+Math.round(G)+'×',420,232,PAL.yellow,15);
  arrowText(ctx,clip?'Output hits the 0 V / 9 V limits: clipping = overdrive':'Clean: the output swings around 4.5 V',420,256,clip?PAL.yellow:PAL.good,13);}

// ===== 7. CD4017 =====
const CT={q:0,acc:0,flash:0};
(function(){const s=$('ctN');for(let n=2;n<=10;n++){const o=document.createElement('option');o.value=n;o.textContent=n;s.appendChild(o);}s.value=10;})();
function pulse(){CT.q=(CT.q+1)%(+$('ctN').value);CT.flash=0.15;}
$('ctStep').onclick=pulse;
function draw4017(dt){const f=+$('ctF').value;if(f>0){CT.acc+=dt*f;while(CT.acc>=1){CT.acc-=1;pulse();}}CT.flash=Math.max(0,CT.flash-dt);
  const c=$('c4017'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  dip(ctx,80,30,['Q5','Q1','Q0','Q2','Q6','Q7','Q3','VSS','Q8','Q4','Q9','CO','EN','CLK','RST','VDD'],'CD4017',[14,15],12);
  arrowText(ctx,'14 = clock · 15 = reset',115,185,PAL.yellow,11);
  const N=+$('ctN').value;
  for(let i=0;i<10;i++){const x=260+i*52,y=110,on=i===CT.q,used=i<N;
    if(on){const g=ctx.createRadialGradient(x,y,2,x,y,34);g.addColorStop(0,'rgba(239,68,68,1)');g.addColorStop(1,'rgba(239,68,68,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,34,0,7);ctx.fill();}
    ctx.fillStyle=on?PAL.bad:used?'#3f1d1d':PAL.raised;ctx.beginPath();ctx.arc(x,y,13,0,7);ctx.fill();ctx.strokeStyle=used?'#7f1d1d':PAL.slateDark;ctx.lineWidth=1.5;ctx.stroke();
    arrowText(ctx,'Q'+i,x,y+34,used?PAL.muted:PAL.slate,12);}
  if(N<10){const x=260+N*52;ctx.strokeStyle=PAL.yellow;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,150);ctx.lineTo(x,175);ctx.lineTo(260-30,175);ctx.lineTo(230,60);ctx.stroke();arrowText(ctx,'Q'+N+' wired to RESET → counts 0…'+(N-1),x+10,195,PAL.yellow,12,'left');}
  ctx.fillStyle=CT.flash>0?PAL.yellow:PAL.slateDark;ctx.fillRect(260,40,60,20);arrowText(ctx,'CLOCK',290,54,CT.flash>0?PAL.canvas:PAL.muted,11);
  arrowText(ctx,'count = '+CT.q,500,55,PAL.ink,15);
  arrowText(ctx,f>0?(f.toFixed(1)+' pulses per second'):'clock stopped: use "One pulse"',500,235,PAL.muted,12);}

// ===== 8. 74HC595 =====
const SR={pat:[1,0,1,1,0,0,1,0],reg:[0,0,0,0,0,0,0,0],out:[0,0,0,0,0,0,0,0],step:-1,acc:0,trace:[],phase:''};
function srStart(){SR.step=0;SR.acc=0;SR.trace=[];}
$('srSend').onclick=srStart;setTimeout(srStart,600);$('srRand').onclick=()=>{SR.pat=SR.pat.map(()=>Math.random()<0.5?1:0);};
$('c595').addEventListener('click',e=>{const c=$('c595'),r=c.getBoundingClientRect(),x=(e.clientX-r.left)*c.width/r.width,y=(e.clientY-r.top)*c.height/r.height;
  if(y>250&&y<290){const i=Math.floor((x-330)/52);if(i>=0&&i<8)SR.pat[i]^=1;}});
function stepSR(dt){if(SR.step<0)return;SR.acc+=dt*(+$('srSp').value);
  while(SR.acc>=0.5){SR.acc-=0.5;const s=SR.step;
    if(s<16){const bit=SR.pat[7-Math.floor(s/2)];if(s%2===0){SR.trace.push({d:bit,c:0,l:0});SR.phase='DATA = '+bit;}else{SR.reg=[bit,...SR.reg.slice(0,7)];SR.trace.push({d:bit,c:1,l:0});SR.phase='CLOCK tick → shift';}}
    else if(s===16){SR.trace.push({d:0,c:0,l:1});SR.out=[...SR.reg];SR.phase='LATCH → all 8 outputs update at once';}
    else {SR.trace.push({d:0,c:0,l:0});SR.step=-2;}
    SR.step++;}}
function draw595(dt){stepSR(dt);const c=$('c595'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  // wires & traces
  [['DATA','d',PAL.amber],['CLOCK','c',PAL.blue],['LATCH','l',PAL.good]].forEach(([n,k,col],j)=>{const y=30+j*34;arrowText(ctx,n,70,y+4,col,12,'right');
    ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();let x=80;ctx.moveTo(x,y+10);SR.trace.forEach(p=>{const yy=p[k]?y-8:y+10;ctx.lineTo(x,yy);x+=12;ctx.lineTo(x,yy);});ctx.lineTo(Math.max(x,80),y+10);ctx.stroke();});
  arrowText(ctx,'pins: 14 DATA · 11 CLOCK · 12 LATCH · 15,1–7 outputs',560,20,PAL.muted,11);
  arrowText(ctx,SR.phase,560,50,PAL.yellow,14);
  // register cells
  arrowText(ctx,'shift register (inside)',290,149,PAL.muted,12,'right');
  for(let i=0;i<8;i++){const x=330+i*52;ctx.fillStyle=SR.reg[i]?'#1d4ed8':PAL.raised;ctx.fillRect(x,128,40,32);ctx.strokeStyle=PAL.slate;ctx.strokeRect(x,128,40,32);arrowText(ctx,String(SR.reg[i]),x+20,149,PAL.ink,14);}
  ctx.strokeStyle=PAL.muted2;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(296,144);ctx.lineTo(328,144);ctx.stroke();arrowText(ctx,'→ bits enter here',300,175,PAL.muted,10);
  arrowText(ctx,'outputs (LEDs)',320,207,PAL.muted,12,'right');
  for(let i=0;i<8;i++){const x=350+i*52,y=202,on=SR.out[i];if(on){const g=ctx.createRadialGradient(x,y,2,x,y,26);g.addColorStop(0,'rgba(34,197,94,1)');g.addColorStop(1,'rgba(34,197,94,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,26,0,7);ctx.fill();}
    ctx.fillStyle=on?PAL.green:'#14301f';ctx.beginPath();ctx.arc(x,y,11,0,7);ctx.fill();arrowText(ctx,'Q'+i,x,y+28,PAL.slate,10);}
  arrowText(ctx,'pattern to send (click):',320,276,PAL.ink,12,'right');
  for(let i=0;i<8;i++){const x=330+i*52;ctx.fillStyle=SR.pat[i]?PAL.amber:PAL.raised;ctx.fillRect(x,256,40,30);ctx.strokeStyle=PAL.amber;ctx.strokeRect(x,256,40,30);arrowText(ctx,String(SR.pat[i]),x+20,276,SR.pat[i]?PAL.canvas:PAL.muted,14);}}

loop((dt,now)=>{draw555(dt);draw7805(dt);draw358(dt);draw386(dt);draw4017(dt);draw595(dt);});


// ===== Pinout + inside-the-chip schematics =====
(function(){
const TC={pwr:PAL.bad,gnd:PAL.muted,in:PAL.blue,out:PAL.good,ctl:PAL.amber};
const TN={pwr:'Power +',gnd:'Ground',in:'Input',out:'Output',ctl:'Control / setting'};
// [pin, name, type, what it's for, how to connect]
const CH={
'555':{pkg:'dip',title:'NE555 (DIP-8)',pins:[
 [1,'GND','gnd','Ground (0 V). The return path for everything.','To the − rail.'],
 [2,'TRIG','in','Trigger: when its voltage drops below ⅓ of the supply, the output switches ON and the capacitor starts filling again.','Astable (blinker): joined to pin 6 and the timing capacitor. One-shot: to a push button with a pull-up.'],
 [3,'OUT','out','The output: high (≈ supply) or low (0 V). Can push or pull up to ~200 mA.','To an LED via a resistor, a buzzer, a transistor base resistor, or the clock of a CD4017.'],
 [4,'RESET','ctl','Low = everything stops and the output is forced OFF. High = runs normally.','Tie to + if unused. In the dice: the push button (high = roll) with a 10 kΩ pull-down.'],
 [5,'CTRL','ctl','Control voltage: direct access to the ⅔ point of the internal divider. Changing it shifts the timing.','Usually a 10 nF capacitor to ground to keep it steady (stops jitter).'],
 [6,'THR','in','Threshold: when its voltage rises above ⅔ of the supply, the output switches OFF and the discharge opens.','Joined to pin 2 and the timing capacitor.'],
 [7,'DIS','out','Discharge: an internal transistor that shorts to ground while the output is OFF, draining the capacitor.','Between R1 and R2 (R2 goes on to the capacitor).'],
 [8,'VCC','pwr','Supply, 4.5–16 V.','To the + rail, with a 100 nF capacitor to ground right beside it.']]},
'7805':{pkg:'to220',title:'L7805 (TO-220)',pins:[
 [1,'IN','pwr','Input: the raw, wobbly supply (7–20 V).','From the battery / adapter, with a 330 nF capacitor to ground close to the pin.'],
 [2,'GND','gnd','Ground, the reference the 5 V is measured from. The metal tab is also connected to it.','To the − rail. The tab can be bolted to a heatsink.'],
 [3,'OUT','out','Output: a steady 5 V, up to about 1 A (with a heatsink).','To the circuit\'s + rail, with a 100 nF capacitor to ground (plus 10–100 µF if the load changes a lot).']]},
'358':{pkg:'dip',title:'LM358 (DIP-8)',pins:[
 [1,'OUT A','out','Output of op-amp A.','To the next stage, a transistor base resistor or an LED resistor (max ~20 mA).'],
 [2,'IN− A','in','Inverting input of op-amp A. Raising it pushes the output DOWN.','Comparator: the threshold (from a pot). Amplifier: the feedback resistors.'],
 [3,'IN+ A','in','Non-inverting input of op-amp A. Raising it pushes the output UP.','Comparator: the sensor (e.g. LDR divider). Amplifier: the signal.'],
 [4,'GND','gnd','Ground (or the negative supply).','To the − rail.'],
 [5,'IN+ B','in','Non-inverting input of op-amp B.','If B is unused: tie to half the supply or ground.'],
 [6,'IN− B','in','Inverting input of op-amp B.','If B is unused: join to pin 7 (a "follower") so it stays quiet.'],
 [7,'OUT B','out','Output of op-amp B.','If unused: joined to pin 6.'],
 [8,'VCC','pwr','Supply, 3–32 V. Both op-amps share it.','To the + rail, with 100 nF to ground beside it.']]},
'386':{pkg:'dip',title:'LM386N (DIP-8)',pins:[
 [1,'GAIN','ctl','Gain setting, side 1. Nothing between 1 and 8 = gain 20. A 10 µF capacitor = gain 200.','In the Ruby: the 1 kΩ gain pot + 10 µF between pins 1 and 8.'],
 [2,'IN−','in','Inverting input.','Usually straight to ground.'],
 [3,'IN+','in','Non-inverting input: the audio signal.','From the volume pot (in the Ruby: after the JFET buffer).'],
 [4,'GND','gnd','Ground.','To the − rail.'],
 [5,'OUT','out','Power output, sitting at half the supply and swinging with the music.','Through a 220 µF capacitor to the speaker. Plus a Zobel (10 Ω + 47 nF) to ground.'],
 [6,'VS','pwr','Supply, 4–12 V.','To the + rail, with 100 nF + 100 µF to ground.'],
 [7,'BYPASS','ctl','Bypass: smooths the internal bias so supply hum and noise don\'t leak into the sound.','Optional: 10 µF to ground. Can be left unconnected.'],
 [8,'GAIN','ctl','Gain setting, side 2.','See pin 1.']]},
'4017':{pkg:'dip',title:'CD4017 (DIP-16)',pins:[
 [1,'Q5','out','Output 5: high during count 5.',''],
 [2,'Q1','out','Output 1: high during count 1.',''],
 [3,'Q0','out','Output 0: high during count 0 (right after reset).','LED via a 470 Ω–1 kΩ resistor, a diode, or a transistor base resistor (each output gives only a few mA).'],
 [4,'Q2','out','Output 2.',''],
 [5,'Q6','out','Output 6.','In the dice: wired to RESET so it counts 0–5.'],
 [6,'Q7','out','Output 7.',''],
 [7,'Q3','out','Output 3.',''],
 [8,'VSS','gnd','Ground.','To the − rail.'],
 [9,'Q8','out','Output 8.',''],
 [10,'Q4','out','Output 4.',''],
 [11,'Q9','out','Output 9.',''],
 [12,'CO','out','Carry out: high for counts 0–4, low for 5–9. One pulse every 10 counts.','To the CLK of a second 4017 to count to 100.'],
 [13,'INH','ctl','Clock inhibit (enable): low = counting, high = frozen.','To ground (never leave it floating!).'],
 [14,'CLK','in','Clock: each rising edge moves to the next output.','From the 555 output (pin 3) or a debounced button.'],
 [15,'RST','ctl','Reset: high = back to Q0 at once.','To ground through 10 kΩ, or to an output Qn to count 0…n−1.'],
 [16,'VDD','pwr','Supply, 3–15 V.','To the + rail, with 100 nF to ground.']]},

'4511':{pkg:'dip',title:'CD4511 (DIP-16)',pins:[
 [1,'B','in','Input B: the "2" bit of the number.','From the counter\'s Q2 (or a diode encoder).'],
 [2,'C','in','Input C: the "4" bit.','From the counter\'s Q3.'],
 [3,'LT','ctl','Lamp test, active LOW: low = all 7 segments on (shows 8) to check the wiring.','Tie to + for normal use.'],
 [4,'BI','ctl','Blanking, active LOW: low = all segments off.','Tie to +. Or to a PWM signal to dim the display.'],
 [5,'LE','ctl','Latch enable: low = the display follows the inputs, high = it freezes the last number.','Tie to ground (−) for normal use.'],
 [6,'D','in','Input D: the "8" bit.','From the counter\'s Q4. Tie to − if you only count to 7.'],
 [7,'A','in','Input A: the "1" bit.','From the counter\'s Q1.'],
 [8,'VSS','gnd','Ground.','To the − rail.'],
 [9,'e','out','Segment e output: high (≈ supply − 1 V) when the segment must light. Can supply ~25 mA.','Through a 470 Ω–1 kΩ resistor to the display\'s segment e pin.'],
 [10,'d','out','Segment d output.',''],[11,'c','out','Segment c output.',''],[12,'b','out','Segment b output.',''],[13,'a','out','Segment a output.',''],[14,'g','out','Segment g output.',''],[15,'f','out','Segment f output.',''],
 [16,'VDD','pwr','Supply, 3–15 V.','To the + rail, with 100 nF to ground.']]},
'4518':{pkg:'dip',title:'CD4518 (DIP-16)',pins:[
 [1,'CLK A','in','Clock of counter A: counts +1 on each rising edge (while EN A is high).','From a 555 output or a debounced button.'],
 [2,'EN A','ctl','Enable of counter A: high = counting on CLK. A falling edge here also counts +1 (if CLK A is low).','Tie to + when using CLK A.'],
 [3,'Q1A','out','Counter A, bit "1".','To the A input of a CD4511.'],
 [4,'Q2A','out','Counter A, bit "2".','To B of the CD4511.'],
 [5,'Q3A','out','Counter A, bit "4".','To C of the CD4511.'],
 [6,'Q4A','out','Counter A, bit "8". Falls when A rolls over from 9 to 0.','To D of the CD4511, and to EN B to chain the counters.'],
 [7,'RST A','ctl','Reset of counter A: high = back to 0.','To − through 10 kΩ, plus a button to + for a reset button.'],
 [8,'VSS','gnd','Ground.','To the − rail.'],
 [9,'CLK B','in','Clock of counter B.','To − (low) when counter B is driven by EN B (chained).'],
 [10,'EN B','ctl','Enable of counter B. A falling edge counts +1 when CLK B is low.','From Q4A to count the tens.'],
 [11,'Q1B','out','Counter B, bit "1".','To A of the second CD4511.'],
 [12,'Q2B','out','Counter B, bit "2".','To B.'],
 [13,'Q3B','out','Counter B, bit "4".','To C.'],
 [14,'Q4B','out','Counter B, bit "8".','To D. Could also chain a third counter (another 4518).'],
 [15,'RST B','ctl','Reset of counter B: high = back to 0.','Usually joined to RST A.'],
 [16,'VDD','pwr','Supply, 3–15 V.','To the + rail, with 100 nF to ground.']]},
'339':{pkg:'dip',title:'LM339N (DIP-14)',pins:[
 [1,'OUT2','out','Output of comparator 2. Open collector: connects to ground when IN2− is higher than IN2+, floats (off) otherwise.','Needs a pull-up resistor to + (10 kΩ), or an LED + resistor from + into the pin.'],
 [2,'OUT1','out','Output of comparator 1. Open collector: pulled to ground when IN1− > IN1+, off when IN1+ > IN1−. Sinks up to ~16 mA.','LED cathode side here, through 470 Ω to + (the LED lights when − is higher). Or 10 kΩ pull-up to + for a logic signal.'],
 [3,'VCC','pwr','Supply, 2–36 V (one supply, no negative needed).','To the + rail, with 100 nF to ground.'],
 [4,'IN1−','in','Inverting input of comparator 1. When it rises above IN1+, OUT1 goes low.','The signal (sensor), or the threshold, depending on which way you want the output to switch.'],
 [5,'IN1+','in','Non-inverting input of comparator 1. When it is above IN1−, OUT1 is off (high through the pull-up).','The threshold from a divider or trimmer, or the signal.'],
 [6,'IN2−','in','Inverting input of comparator 2.','Unused: tie to + (so the output stays off).'],
 [7,'IN2+','in','Non-inverting input of comparator 2.','Unused: tie to ground.'],
 [8,'IN3−','in','Inverting input of comparator 3.',''],
 [9,'IN3+','in','Non-inverting input of comparator 3.',''],
 [10,'IN4−','in','Inverting input of comparator 4.',''],
 [11,'IN4+','in','Non-inverting input of comparator 4.',''],
 [12,'GND','gnd','Ground.','To the − rail.'],
 [13,'OUT4','out','Output of comparator 4 (open collector).',''],
 [14,'OUT3','out','Output of comparator 3 (open collector).','']]},
'4013':{pkg:'dip',title:'CD4013 (DIP-14)',pins:[
 [1,'Q1','out','Flip-flop 1 output: a copy of what D1 was at the last rising edge of CLK1.','To what you want to drive: the next counter\'s clock, an LED through 1 kΩ, a transistor base through 10 kΩ.'],
 [2,'Q̅1','out','Flip-flop 1 inverted output: always the opposite of Q1.','Wire it to D1 (pin 5) and the flip-flop toggles: it divides the clock by 2.'],
 [3,'CLK1','in','Clock of flip-flop 1: on each rising edge (low → high), Q1 takes the value of D1.','From a clean clock: a CD4060 output, a 555, or a debounced button.'],
 [4,'R1','ctl','Reset 1, active HIGH: high forces Q1 = 0 right away, whatever the clock does.','To ground for normal use. Never leave it floating.'],
 [5,'D1','in','Data input of flip-flop 1: the value that will be copied to Q1 at the next clock edge.','From Q̅1 (pin 2) for a divide-by-2, or from any logic signal to "photograph" it.'],
 [6,'S1','ctl','Set 1, active HIGH: high forces Q1 = 1 right away.','To ground for normal use.'],
 [7,'VSS','gnd','Ground.','To the − rail.'],
 [8,'S2','ctl','Set 2, active HIGH.','To ground (unused flip-flop: all inputs to ground).'],
 [9,'D2','in','Data input of flip-flop 2.','Unused: to ground.'],
 [10,'R2','ctl','Reset 2, active HIGH.','To ground.'],
 [11,'CLK2','in','Clock of flip-flop 2.','Unused: to ground. CMOS inputs must never float.'],
 [12,'Q̅2','out','Flip-flop 2 inverted output.','Unused: leave free (outputs may float).'],
 [13,'Q2','out','Flip-flop 2 output.','Unused: leave free.'],
 [14,'VDD','pwr','Supply, 3–15 V.','To the + rail, with 100 nF to ground.']]},
'4060':{pkg:'dip',title:'CD4060 (DIP-16)',pins:[
 [1,'Q12','out','Oscillator ÷ 4,096. With a 32.768 kHz quartz: 8 Hz.','To an LED (1 kΩ) or the next chip\'s clock.'],
 [2,'Q13','out','Oscillator ÷ 8,192. With the quartz: 4 Hz.',''],
 [3,'Q14','out','Oscillator ÷ 16,384, the last stage. With the quartz: exactly 2 Hz.','To the CD4013 clock (÷2 → 1 Hz), or an LED through 1 kΩ to see it blink.'],
 [4,'Q6','out','Oscillator ÷ 64. With the quartz: 512 Hz (an audible tone).',''],
 [5,'Q5','out','Oscillator ÷ 32: 1,024 Hz.',''],
 [6,'Q7','out','Oscillator ÷ 128: 256 Hz.',''],
 [7,'Q4','out','Oscillator ÷ 16: 2,048 Hz. (Q1–Q3 and Q11 exist inside but have no pin.)',''],
 [8,'VSS','gnd','Ground.','To the − rail.'],
 [9,'φO','out','Oscillator output (in phase). Only used for an RC oscillator (resistor + capacitor instead of a quartz).','With a quartz: leave free.'],
 [10,'φO̅','out','Oscillator output (inverted): the inverter\'s output that drives the quartz.','10 MΩ to pin 11, and 100 kΩ to the far side of the quartz.'],
 [11,'φI','in','Oscillator input: the inverter\'s input, and the clock of the divider chain.','To one side of the quartz, 22 pF to ground, and the 10 MΩ from pin 10.'],
 [12,'RESET','ctl','Reset, active HIGH: high stops the oscillator and sets every Q to 0.','To ground so it runs. Or to a button with a pull-down to restart the count.'],
 [13,'Q9','out','Oscillator ÷ 512: 64 Hz.',''],
 [14,'Q8','out','Oscillator ÷ 256: 128 Hz.',''],
 [15,'Q10','out','Oscillator ÷ 1,024: 32 Hz.',''],
 [16,'VDD','pwr','Supply, 3–15 V.','To the + rail, with 100 nF to ground.']]},
'293':{pkg:'dip',title:'L293D (DIP-16)',pins:[
 [1,'EN1,2','ctl','Enable for drivers 1 and 2 (the first H-bridge). High = outputs 1Y and 2Y follow their inputs; low = both outputs off, the motor coasts.','To + for full speed, or to a PWM signal (555, Arduino analogWrite) to set the speed. Max 7 V.'],
 [2,'1A','in','Input of driver 1: high → 1Y is connected to the motor supply, low → 1Y is connected to ground.','From a button with a 10 kΩ pull-down, or an Arduino pin. Max 7 V.'],
 [3,'1Y','out','Output of driver 1: one end of motor 1. Up to 600 mA (1.2 A peak).','To one motor terminal.'],
 [4,'GND','gnd','Ground and heat sink (the 4 middle pins are joined to the chip\'s metal frame).','To the − rail. Connect all four: they carry the heat away.'],
 [5,'GND','gnd','Ground and heat sink.','To the − rail.'],
 [6,'2Y','out','Output of driver 2: the other end of motor 1.','To the other motor terminal.'],
 [7,'2A','in','Input of driver 2.','Same as 1A. 1A ≠ 2A: the motor turns (one way or the other); 1A = 2A: it brakes.'],
 [8,'VCC2','pwr','Motor supply, 4.5–36 V: the voltage the outputs switch to the motor. The motor gets about 1.5–3 V less (lost in the chip).','To the battery + (9 V), with 100 nF (and 100 µF for big motors) to ground.'],
 [9,'EN3,4','ctl','Enable for drivers 3 and 4 (the second H-bridge).','To + to use the second bridge, or to ground if unused.'],
 [10,'3A','in','Input of driver 3.','Unused: to ground.'],
 [11,'3Y','out','Output of driver 3: one end of motor 2.','Unused: leave free.'],
 [12,'GND','gnd','Ground and heat sink.','To the − rail.'],
 [13,'GND','gnd','Ground and heat sink.','To the − rail.'],
 [14,'4Y','out','Output of driver 4: the other end of motor 2.',''],
 [15,'4A','in','Input of driver 4.','Unused: to ground.'],
 [16,'VCC1','pwr','Logic supply for the inputs: ideally 5 V. (ST\'s L293D accepts up to 36 V here; the inputs themselves must stay below 7 V.)','To +5 V (or the battery in project 24), with 100 nF to ground.']]},

'3914':{pkg:'dip',title:'LM3914N (DIP-18)',pins:[
 [1,'LED1','out','Output for LED 1 (lowest level). Sinks a regulated current: LED cathode here, anode to +.','Bar-graph segment 1 (cathode side).'],
 [2,'V−','gnd','Ground.','To the − rail.'],
 [3,'V+','pwr','Supply, 3–25 V.','To +, with 2.2–10 µF to ground if the wires are long.'],
 [4,'RLO','ctl','Bottom of the internal 10-resistor ladder: the voltage where LED 1 starts.','To ground for a scale starting at 0 V.'],
 [5,'SIG','in','The signal to display.','From the sensor (LM35 output), a divider, or audio through a diode.'],
 [6,'RHI','ctl','Top of the ladder: the voltage that lights LED 10.','To REF OUT, or to a trimmer wiper to set the full scale.'],
 [7,'REF OUT','out','Reference output: always 1.25 V above REF ADJ. The current drawn from it × 10 = LED current.','A resistor to ground sets brightness: 1.25 V ÷ R × 10 (2.2 kΩ ≈ 6 mA).'],
 [8,'REF ADJ','ctl','Reference adjust: the reference sits 1.25 V above this pin.','To ground (simplest).'],
 [9,'MODE','ctl','Bar or dot: connected to V+ = bar mode, left open = dot mode.','To V+ for a bar.'],
 [10,'LED10','out','Output for LED 10 (highest).',''],[11,'LED9','out','Output for LED 9.',''],[12,'LED8','out','Output for LED 8.',''],[13,'LED7','out','Output for LED 7.',''],[14,'LED6','out','Output for LED 6.',''],[15,'LED5','out','Output for LED 5.',''],[16,'LED4','out','Output for LED 4.',''],[17,'LED3','out','Output for LED 3.',''],[18,'LED2','out','Output for LED 2.','']]},
'4056':{pkg:'dip',title:'TP4056 (SOP-8, on the module)',pins:[
 [1,'TEMP','in','Battery temperature input (for a thermistor in the battery pack). Charging pauses if out of range.','On the modules: tied to ground (feature off).'],
 [2,'PROG','ctl','Sets the charge current: I = 1200 ÷ R (in A, R in Ω). Its voltage also shows the current being delivered.','A resistor to ground: 1.2 kΩ = 1 A (module default), 2.4 kΩ = 0.5 A, 10 kΩ = 130 mA.'],
 [3,'GND','gnd','Ground.','To USB −.'],
 [4,'VCC','pwr','Supply, 4.5–8 V (5 V USB).','From USB +, with a capacitor to ground.'],
 [5,'BAT','out','Battery output: charges with constant current, then holds exactly 4.2 V.','To the cell + (through the BMS protection module).'],
 [6,'STDBY','out','"Done" signal: goes low (on) when the battery is full. Open-drain.','Green LED + 1 kΩ from VCC.'],
 [7,'CHRG','out','"Charging" signal: low (on) while charging. Open-drain.','Red LED + 1 kΩ from VCC.'],
 [8,'CE','ctl','Chip enable: high = charger on, low = off.','Tied to VCC on the modules.']]},
'328':{pkg:'dip',title:'ATmega328P (DIP-28)',pins:[
 [1,'RESET','ctl','Reset, active LOW: pull low to restart the program. Also used for uploading.','10 kΩ to +5 V (pull-up), plus the reset button to ground.'],
 [2,'D0 RX','in','Arduino D0 / serial receive (from the PC via USB).','Avoid using it while uploading.'],
 [3,'D1 TX','out','Arduino D1 / serial transmit.','Avoid using it while uploading.'],
 [4,'D2','out','Arduino D2, digital I/O (interrupt INT0).','In the dice: segment a via 330 Ω.'],
 [5,'D3','out','Arduino D3, digital I/O, PWM.','Segment b in the dice.'],
 [6,'D4','out','Arduino D4, digital I/O.',''],
 [7,'VCC','pwr','Digital supply, 1.8–5.5 V (5 V on the Uno).','+5 V with 100 nF to ground.'],
 [8,'GND','gnd','Ground.','To −.'],
 [9,'XTAL1','ctl','Crystal input: the 16 MHz clock.','16 MHz crystal between pins 9 and 10, 22 pF from each to ground.'],
 [10,'XTAL2','ctl','Crystal output.','See pin 9.'],
 [11,'D5','out','Arduino D5, digital I/O, PWM.',''],
 [12,'D6','out','Arduino D6, digital I/O, PWM.',''],
 [13,'D7','out','Arduino D7, digital I/O.',''],
 [14,'D8','out','Arduino D8, digital I/O.',''],
 [15,'D9','out','Arduino D9, digital I/O, PWM.',''],
 [16,'D10','out','Arduino D10, digital I/O, PWM.','Dice / thermometer: digit 1 transistor via 1 kΩ.'],
 [17,'D11','out','Arduino D11, PWM / MOSI (programming).','Digit 2 transistor via 1 kΩ.'],
 [18,'D12','out','Arduino D12 / MISO.','Dice button (INPUT_PULLUP).'],
 [19,'D13','out','Arduino D13 / SCK. The Uno\'s built-in "L" LED.',''],
 [20,'AVCC','pwr','Supply for the analog part (ADC).','+5 V, ideally through a small filter.'],
 [21,'AREF','ctl','Analog reference: the voltage that reads as 1023.','100 nF to ground. Don\'t connect a voltage when using INTERNAL.'],
 [22,'GND','gnd','Analog ground.','To −.'],
 [23,'A0','in','Arduino A0: analog input (ADC 0–1023) or digital I/O.','Thermometer: LM35 output.'],
 [24,'A1','in','Arduino A1: analog input.',''],[25,'A2','in','Arduino A2: analog input.',''],[26,'A3','in','Arduino A3: analog input.',''],
 [27,'A4 SDA','in','Arduino A4 / I²C data.','To I²C modules (screens, sensors).'],
 [28,'A5 SCL','in','Arduino A5 / I²C clock.','To I²C modules.']]},
'595':{pkg:'dip',title:'74HC595 (DIP-16)',pins:[
 [1,'QB','out','Output B (bit 2).','LED via resistor (keep total chip current under ~70 mA).'],
 [2,'QC','out','Output C.',''],[3,'QD','out','Output D.',''],[4,'QE','out','Output E.',''],[5,'QF','out','Output F.',''],[6,'QG','out','Output G.',''],[7,'QH','out','Output H (bit 8).',''],
 [8,'GND','gnd','Ground.','To the − rail.'],
 [9,'QH′','out','Serial out: the bit that falls off the end of the shift register.','To SER (pin 14) of the next 595 to chain them.'],
 [10,'SRCLR','ctl','Shift-register clear, active LOW: low = wipe all 8 bits to 0.','Tie to + (5 V) if unused.'],
 [11,'SRCLK','in','Shift clock: each rising edge shifts every bit one place and takes in the new one.','To a microcontroller pin ("CLOCK").'],
 [12,'RCLK','in','Latch (register) clock: a rising edge copies all 8 bits to the outputs at once.','To a microcontroller pin ("LATCH").'],
 [13,'OE','ctl','Output enable, active LOW: low = outputs on, high = outputs disconnected (off).','Tie to ground. Or to a PWM pin to dim all the LEDs.'],
 [14,'SER','in','Serial data in: the next bit (1 or 0) to shift in.','To a microcontroller pin ("DATA").'],
 [15,'QA','out','Output A (bit 1).',''],
 [16,'VCC','pwr','Supply, 2–6 V.','To the + rail (5 V), with 100 nF to ground.']]}
};
const pinOf=(k,n)=>CH[k].pins.find(p=>p[0]===n);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
// ---------- package drawings ----------
function dipSVG(k){const P=CH[k].pins,n=P.length,h=n/2,sp=n>20?28:40,top=34,H=top+h*sp+14,bx=165,bw=130;
  let s=`<svg viewBox="0 0 460 ${H+16}" class="pinsvg">`;
  s+=`<rect x="${bx}" y="${top-10}" width="${bw}" height="${h*sp+10}" rx="8" fill="${PAL.chip}" stroke="${PAL.slate}" stroke-width="2"/>`;
  s+=`<path d="M${bx+bw/2-16} ${top-10} a16 16 0 0 0 32 0" fill="${PAL.canvas}" stroke="${PAL.slate}" stroke-width="2"/><circle cx="${bx+18}" cy="${top+8}" r="5" fill="${PAL.canvas}" stroke="${PAL.muted2}"/>`;
  s+=`<text x="${bx+bw/2}" y="${top+h*sp/2}" fill="${PAL.ink2}" font-size="15" font-weight="700" text-anchor="middle" transform="rotate(-90 ${bx+bw/2} ${top+h*sp/2})">${esc(CH[k].title.split(' ')[0])}</text>`;
  P.forEach(([num,name,t])=>{const left=num<=h,r=left?num-1:n-num,y=top+r*sp+14,c=TC[t];
    const x0=left?bx-32:bx+bw;
    s+=`<g class="pp" data-pin="${num}"><rect x="${x0}" y="${y-7}" width="32" height="14" rx="2" fill="${c}" stroke="${c}"/>`;
    s+=`<text x="${left?bx+10:bx+bw-10}" y="${y+5}" fill="${PAL.ink}" font-size="13" font-weight="700" text-anchor="${left?'start':'end'}">${num}</text>`;
    s+=`<text x="${left?x0-8:x0+40}" y="${y+5}" fill="${c}" font-size="14" font-weight="700" text-anchor="${left?'end':'start'}">${esc(name)}</text>`;
    s+=`<rect x="${left?0:x0}" y="${y-16}" width="${left?bx:460-x0}" height="32" fill="transparent"/></g>`;});
  s+=`<text x="230" y="${H+10}" fill="${PAL.muted2}" font-size="12" text-anchor="middle">seen from above · notch at the top · pin 1 by the dot</text>`;
  return s+'</svg>';}
function to220SVG(k){const P=CH[k].pins;let s=`<svg viewBox="0 0 460 330" class="pinsvg">`;
  s+=`<rect x="160" y="14" width="140" height="70" rx="4" fill="${PAL.muted}" stroke="${PAL.ink2}"/><circle cx="230" cy="46" r="14" fill="${PAL.canvas}"/>`;
  s+=`<rect x="160" y="80" width="140" height="110" rx="4" fill="${PAL.chip}" stroke="${PAL.slate}" stroke-width="2"/><text x="230" y="130" fill="${PAL.ink2}" font-size="17" font-weight="700" text-anchor="middle">L7805</text><text x="230" y="152" fill="${PAL.muted2}" font-size="12" text-anchor="middle">writing facing you</text>`;
  P.forEach(([num,name,t],i)=>{const x=185+i*45,c=TC[t];s+=`<g class="pp" data-pin="${num}"><rect x="${x-6}" y="190" width="12" height="80" fill="${c}"/><text x="${x}" y="290" fill="${c}" font-size="14" font-weight="700" text-anchor="middle">${num}</text><text x="${x}" y="310" fill="${c}" font-size="14" font-weight="700" text-anchor="middle">${name}</text><rect x="${x-22}" y="186" width="44" height="130" fill="transparent"/></g>`;});
  s+=`<text x="330" y="50" fill="${PAL.muted}" font-size="12">metal tab = GND</text><text x="330" y="66" fill="${PAL.muted}" font-size="12">(bolt a heatsink here)</text>`;
  return s+'</svg>';}
// ---------- schematic helpers ----------
let CUR='';
const ln=(pts,pin,c=PAL.muted)=>`<polyline ${pin?`class="wp" data-pin="${pin}"`:''} points="${pts}" fill="none" stroke="${c}" stroke-width="2"/>`;
const tx=(x,y,t,o={})=>`<text x="${x}" y="${y}" fill="${o.c||PAL.ink2}" font-size="${o.s||12}" font-weight="${o.b?700:400}" text-anchor="${o.a||'middle'}">${esc(t)}</text>`;
const bx=(x,y,w,h,t,c=PAL.slateDark)=>{const L=t.split('\n');return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${PAL.panel}" stroke="${c}" stroke-width="2"/>`+L.map((l,i)=>tx(x+w/2,y+h/2+5+(i-(L.length-1)/2)*15,l,{s:12,b:i===0,c:i===0?PAL.ink:PAL.muted})).join('');};
const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.5" fill="${PAL.muted}"/>`;
function tp(x,y,n,side){const p=pinOf(CUR,n),c=TC[p[2]];const lab=`${n} ${p[1]}`;
  const L={l:[x-10,y+4,'end'],r:[x+10,y+4,'start'],t:[x,y-11,'middle'],b:[x,y+20,'middle']}[side];
  return `<g class="pp" data-pin="${n}"><rect x="${x-6}" y="${y-6}" width="12" height="12" rx="2" fill="${c}"/>${tx(L[0],L[1],lab,{c,b:1,a:L[2],s:13})}<rect x="${x-30}" y="${y-18}" width="60" height="36" fill="transparent"/></g>`;}
function cmp(x,y,lab,flip){const d=flip?-1:1,w=70;let s=`<path d="M${x} ${y-30}L${x+d*w} ${y}L${x} ${y+30}Z" fill="${PAL.panel}" stroke="${PAL.ink2}" stroke-width="2"/>`;
  s+=tx(x+d*10,y-8,'−',{s:15,b:1,c:PAL.ink})+tx(x+d*10,y+19,'+',{s:15,b:1,c:PAL.ink});if(lab)s+=tx(x+d*w/2,y+48,lab,{s:11,c:PAL.muted});return s;}
function res(x,y1,y2,lab,hor){const n=6;let p=[];if(!hor){const h=(y2-y1)/n;for(let i=0;i<=n;i++)p.push(`${x+(i===0||i===n?0:(i%2?8:-8))},${y1+i*h}`);return ln(p.join(' '))+(lab?tx(x+14,(y1+y2)/2+4,lab,{a:'start',s:11,c:PAL.muted}):'');}
  const w=(y2-y1)/n;for(let i=0;i<=n;i++)p.push(`${y1+i*w},${x+(i===0||i===n?0:(i%2?8:-8))}`);return ln(p.join(' '))+(lab?tx((y1+y2)/2,x-12,lab,{s:11,c:PAL.muted}):'');}
const gnd=(x,y)=>`<path d="M${x-10} ${y}h20M${x-6} ${y+5}h12M${x-2} ${y+10}h4" stroke="${PAL.muted}" stroke-width="2"/>`;
const arrow=(x1,y,x2,pin)=>ln(`${x1},${y} ${x2},${y}`,pin)+`<path d="M${x2} ${y}l-8 -5v10z" fill="${PAL.muted}"/>`;
// ---------- inside each chip ----------
const IN={
'555':()=>{let s='';
  s+=ln('40,30 90,30 90,50',8)+res(90,50,100,'5 kΩ')+ln('90,100 90,120')+res(90,120,170,'5 kΩ')+ln('90,170 90,205')+res(90,205,255,'5 kΩ')+ln('90,255 90,295 40,295',1);
  s+=ln('40,110 90,110',5)+dot(90,110)+ln('90,110 200,110')+tx(130,104,'⅔ supply',{s:11,c:PAL.yellow});
  s+=dot(90,188)+ln('90,188 200,188')+tx(130,182,'⅓ supply',{s:11,c:PAL.yellow});
  s+=ln('160,30 160,74 200,74',6)+ln('160,300 160,224 200,224',2);
  s+=cmp(200,92,'"⅔ watcher"')+cmp(200,206,'"⅓ watcher"');
  s+=arrow(270,92,300)+arrow(270,206,300)+bx(300,62,90,170,'Flip-flop\n(1-bit memory)\n\nR: off\nS: on');
  s+=ln('345,30 345,62',4);
  s+=arrow(390,100,430)+bx(430,82,70,36,'Output\nstage')+ln('500,100 530,100',3);
  s+=ln('390,196 418,196');s+=`<path d="M418 182v28M418 190l22 -14v-12M418 202l22 14v16" stroke="${PAL.ink2}" stroke-width="2" fill="none"/>`+ln('440,164 440,160 530,160',7)+gnd(440,232)+tx(440,262,'(pin 1)',{s:10,c:PAL.muted2});
  s+=tx(450,212,'discharge',{s:11,c:PAL.muted,a:'start'})+tx(450,226,'transistor',{s:11,c:PAL.muted,a:'start'});
  return {vb:'-50 0 660 320',s:s+tp(40,30,8,'t')+tp(40,295,1,'b')+tp(40,110,5,'l')+tp(160,30,6,'t')+tp(160,300,2,'b')+tp(345,30,4,'t')+tp(530,100,3,'r')+tp(530,160,7,'r')};},
'7805':()=>{let s='';
  s+=ln('40,90 200,90',1)+bx(200,65,140,50,'Pass transistor\n(the valve)',PAL.amber)+ln('340,90 530,90',3);
  s+=bx(200,10,140,34,'Heat & over-current\nprotection')+`<path d="M270 44v21" stroke="${PAL.muted}" stroke-width="2" stroke-dasharray="4 3"/>`;
  s+=dot(450,90)+ln('450,90 450,115')+res(450,115,160)+ln('450,160 450,200')+res(450,200,245)+ln('450,245 450,280');
  s+=dot(450,180)+ln('450,180 360,180')+tx(405,172,'measured',{s:11,c:PAL.muted});
  s+=bx(240,150,120,60,'Error amplifier\n"too high? too low?"');
  s+=ln('300,150 300,115')+tx(306,138,'opens / closes',{a:'start',s:11,c:PAL.yellow});
  s+=bx(100,160,100,40,'Reference\n1.25 V')+ln('200,180 240,180')+ln('150,200 150,280');
  s+=ln('150,280 450,280',2)+ln('300,210 300,280');
  return {vb:'0 0 600 320',s:s+tp(40,90,1,'t')+tp(530,90,3,'t')+tp(300,300,2,'b')+ln('300,280 300,300',2)+dot(300,280)};},
'339':()=>{let s='',pins='';
  [[110,90,4,5,2,0,'1'],[110,230,6,7,1,0,'2'],[490,90,8,9,14,1,'3'],[490,230,10,11,13,1,'4']].forEach(([x,y,m,p,o,f,l])=>{const d=f?-1:1,xin=f?560:40,xo=x+d*70,xp=f?340:260,xs=f?385:215;
    s+=ln(`${xin},${y-20} ${x},${y-20}`,m)+ln(`${xin},${y+20} ${x},${y+20}`,p)+cmp(x,y,'comparator '+l,f)+ln(`${xo},${y} ${xp},${y}`,o);
    s+=`<path d="M${xs} ${y}v10M${xs} ${y+10}l9 12M${xs} ${y+26}v4M${xs-8} ${y+30}h16M${xs-5} ${y+34}h10M${xs-2} ${y+38}h4" stroke="${PAL.good}" stroke-width="2" fill="none"/>`;
    pins+=tp(xin,y-20,m,f?'r':'l')+tp(xin,y+20,p,f?'r':'l')+tp(xp,y,o,'t');});
  s+=tx(300,160,'each output = a switch to ground',{s:11,c:PAL.good})+tx(300,176,'(closes when − is higher than +)',{s:11,c:PAL.muted});
  s+=tx(300,18,'3 VCC / 12 GND power all four',{s:11,c:PAL.muted});
  return {vb:'-70 0 730 330',s:s+pins};},
'4013':()=>{let s='',pins='';
  [[30,'1',5,3,6,4,1,2],[190,'2',9,11,8,10,13,12]].forEach(([y0,L,D,C,S,R,Q,Qb])=>{
    [[D,20],[C,45],[S,70],[R,95]].forEach(([n,dy])=>{s+=ln(`40,${y0+dy} 180,${y0+dy}`,n);pins+=tp(40,y0+dy,n,'l');});
    s+=bx(180,y0,170,120,'D flip-flop '+L+'\nQ = D at the\nclock\'s rising edge\nS / R force 1 / 0');
    s+=`<path d="M180 ${y0+38}l10 7l-10 7" fill="none" stroke="${PAL.ink2}" stroke-width="1.5"/>`;
    [[Q,30],[Qb,90]].forEach(([n,dy])=>{s+=ln(`350,${y0+dy} 470,${y0+dy}`,n);pins+=tp(470,y0+dy,n,'r');});});
  s+=tx(260,172,'tip: wire Q̅ back to D (outside) and it divides the clock by 2',{s:11,c:PAL.yellow});
  s+=tx(40,14,'14 VDD / 7 VSS power both flip-flops',{a:'start',s:11,c:PAL.muted});
  return {vb:'-70 0 700 330',s:s+pins};},
'4060':()=>{let s='',pins='';
  [[11,70],[10,110],[9,150]].forEach(([n,y])=>{s+=ln(`40,${y} 110,${y}`,n);pins+=tp(40,y,n,'l');});
  s+=bx(110,50,120,120,'Oscillator\n2 inverters\n\nquartz between\npins 11 and 10',PAL.amber)+arrow(230,110,290);
  s+=bx(290,20,190,260,'14 flip-flops\nin a chain\n\neach one ÷ 2\n\n32 768 Hz\n→ Q14 = 2 Hz');
  [[7,'÷16'],[5,'÷32'],[4,'÷64'],[6,'÷128'],[14,'÷256'],[13,'÷512'],[15,'÷1024'],[1,'÷4096'],[2,'÷8192'],[3,'÷16384']].forEach(([n,t],i)=>{const y=34+i*26;s+=ln(`480,${y} 545,${y}`,n)+tx(512,y-4,t,{s:9,c:PAL.muted});pins+=tp(545,y,n,'r');});
  s+=ln('385,280 385,300',12);pins+=tp(385,302,12,'b');
  s+=tx(40,14,'16 VDD / 8 VSS power everything',{a:'start',s:11,c:PAL.muted});
  return {vb:'-70 0 700 335',s:s+pins};},
'293':()=>{let s='',pins='';const buf=(x,y)=>`<path d="M${x} ${y-16}L${x+40} ${y}L${x} ${y+16}Z" fill="${PAL.panel}" stroke="${PAL.ink2}" stroke-width="2"/>`;
  [[50,2,3],[110,7,6],[200,10,11],[260,15,14]].forEach(([y,i,o])=>{s+=ln(`40,${y} 200,${y}`,i)+buf(200,y)+ln(`240,${y} 420,${y}`,o)+`<path d="M330 ${y-14}v28" stroke="${PAL.amber}" stroke-width="2"/><path d="M322 ${y-6}l8 -8l8 8" fill="${PAL.amber}"/>`;pins+=tp(40,y,i,'l')+tp(420,y,o,'r');});
  [[150,1,[50,110]],[300,9,[200,260]]].forEach(([y,n,ys])=>{s+=ln(`40,${y} 170,${y} 170,${ys[0]+28}`,n)+ys.map(yy=>ln(`170,${yy+28} 215,${yy+28} 215,${yy+12}`,n)).join('');pins+=tp(40,y,n,'l');});
  s+=tx(300,28,'each output: switched to VCC2 (+) or GND, like its input',{s:11,c:PAL.muted});
  s+=tx(330,160,'motor 1 between 3 and 6',{s:11,c:PAL.yellow})+tx(330,176,'motor 2 between 11 and 14',{s:11,c:PAL.yellow});
  s+=tx(375,92,'built-in diodes',{s:10,c:PAL.amber,a:'start'});
  s+=tx(40,322,'16 VCC1 (logic) · 8 VCC2 (motor) · 4, 5, 12, 13 GND + heat sink',{a:'start',s:11,c:PAL.muted});
  return {vb:'-70 0 700 330',s:s+pins};},
'358':()=>{let s='';
  s+=ln('40,110 110,110',2)+ln('40,150 110,150',3)+cmp(110,130,'op-amp A')+ln('180,130 235,130',1);
  s+=ln('560,110 490,110',6)+ln('560,150 490,150',5)+cmp(490,130,'op-amp B',1)+ln('420,130 365,130',7);
  s+=ln('300,40 300,60',8)+ln('145,60 455,60',8)+ln('145,60 145,113',8)+ln('455,60 455,113',8);
  s+=ln('300,240 300,215',4)+ln('145,215 455,215',4)+ln('145,147 145,215',4)+ln('455,147 455,215',4);
  s+=tx(300,105,'gain ≈ 100 000',{s:12,c:PAL.yellow})+tx(300,122,'(each op-amp)',{s:11,c:PAL.muted});
  return {vb:'-70 0 730 280',s:s+tp(40,110,2,'l')+tp(40,150,3,'l')+tp(235,130,1,'b')+tp(560,110,6,'r')+tp(560,150,5,'r')+tp(365,130,7,'b')+tp(300,40,8,'t')+tp(300,240,4,'b')};},
'386':()=>{let s='';
  s+=ln('40,110 110,110',3)+ln('40,170 110,170',2)+bx(110,90,100,100,'Input stage\n(transistor pair)\ncompares + / −');
  s+=arrow(210,140,255)+bx(255,115,95,50,'Gain stage');
  s+=arrow(350,140,390)+bx(390,80,85,120,'Push-pull\noutput\n↑ push\n↓ pull',PAL.good)+ln('475,140 540,140',5);
  s+=ln('430,40 430,80',6)+ln('160,40 160,90',7);
  s+=ln('40,222 430,222',4)+ln('430,200 430,222',4);
  s+=dot(505,140)+ln('505,140 505,262')+res(262,440,500,'15 kΩ',1)+ln('440,262 410,262')+dot(410,262)+res(262,320,390,'1.35 kΩ',1)+ln('390,262 410,262')+ln('320,262 300,262')+dot(300,262)+res(262,220,280,'150 Ω',1)+ln('220,262 160,262 160,190');
  s+=ln('410,262 410,290',1)+ln('300,262 300,290',8);
  s+=tx(600,296,'nothing on 1↔8: gain 20',{s:12,c:PAL.yellow,a:'end'})+tx(600,312,'10 µF on 1↔8: gain 200',{s:12,c:PAL.yellow,a:'end'});
  return {vb:'-50 0 660 320',s:s+tp(40,110,3,'l')+tp(40,170,2,'l')+tp(540,140,5,'t')+tp(430,40,6,'t')+tp(160,40,7,'t')+tp(40,222,4,'b')+tp(410,290,1,'b')+tp(300,290,8,'b')};},
'4017':()=>{let s='';const outs=[3,2,4,7,10,1,5,6,9,11];
  s+=ln('40,90 110,90',14)+ln('40,150 110,150',13)+bx(110,70,90,100,'Clock gate\n\npasses CLK\nwhile INH low');
  s+=arrow(200,120,240)+bx(240,70,110,190,'Johnson\ncounter\n\n5 flip-flops\n(counts 0–9)');
  s+=ln('40,230 240,230',15)+tx(140,222,'reset → back to 0',{s:11,c:PAL.muted});
  s+=ln('350,165 390,165')+`<path d="M390 165l-8 -5v10z" fill="${PAL.muted}"/>`+bx(390,30,80,270,'Decoder\n\n"1 of 10"');
  outs.forEach((n,i)=>{const y=44+i*26;s+=ln(`470,${y} 520,${y}`,n)+tp(520,y,n,'r');});
  s+=ln('295,260 295,300 360,300',12)+tp(360,300,12,'r');
  s+=tx(40,26,'16 VDD / 8 VSS power every block',{a:'start',s:11,c:PAL.muted});
  return {vb:'-60 0 670 320',s:s+tp(40,90,14,'l')+tp(40,150,13,'l')+tp(40,230,15,'l')};},

'4511':()=>{let s='';const ins=[[7,'A'],[1,'B'],[2,'C'],[6,'D']],outs=[13,12,11,10,9,15,14];
  ins.forEach(([n],i)=>{const y=60+i*40;s+=ln(`40,${y} 130,${y}`,n)+tp(40,y,n,'l');});
  s+=bx(130,40,100,140,'Latch\n4-bit memory\n\n(LE high =\nfreeze)');
  for(let i=0;i<4;i++){const y=70+i*30;s+=arrow(230,y,280);}
  s+=bx(280,40,120,200,'Decoder\n(logic gates)\n\n0–9 → which\nsegments?\n\n10–15 → none');
  s+=ln('40,230 180,230 180,180',5)+tp(40,230,5,'l');
  s+=ln('300,300 300,240',3)+tp(300,300,3,'b')+ln('380,300 380,240',4)+tp(380,300,4,'b');
  for(let i=0;i<4;i++){const y=70+i*40;s+=arrow(400,y,440);}
  s+=bx(440,40,70,200,'7 output\ndrivers\n(NPN)',PAL.good);
  outs.forEach((n,i)=>{const y=50+i*30;s+=ln(`510,${y} 545,${y}`,n)+tp(545,y,n,'r');});
  s+=tx(40,20,'16 VDD / 8 VSS power every block',{a:'start',s:11,c:PAL.muted});
  return {vb:'-60 0 680 330',s};},
'4518':()=>{let s='';
  [[0,'A',[1,2,7],[3,4,5,6]],[1,'B',[9,10,15],[11,12,13,14]]].forEach(([k,L,ins,outs])=>{const y0=30+k*150;
    ins.forEach((n,i)=>{const y=y0+20+i*40;s+=ln(`40,${y} 160,${y}`,n)+tp(40,y,n,'l');});
    s+=bx(160,y0,170,120,'Counter '+L+'\n4 flip-flops\ncounts 0 → 9 → 0\n(BCD)');
    outs.forEach((n,i)=>{const y=y0+15+i*30;s+=ln(`330,${y} 470,${y}`,n)+tp(470,y,n,'r');});});
  s+=`<polyline points="470,141 470,160 120,160 120,240" stroke="${PAL.yellow}" stroke-width="2" stroke-dasharray="6 4" fill="none"/>`+tx(300,176,'to chain: wire Q4A → EN B outside the chip')+('<circle cx="120" cy="240" r="4" fill="'+PAL.yellow+'"/>')+tx(300,176,'',{s:12,c:PAL.yellow});
  s+=tx(40,18,'16 VDD / 8 VSS power both counters',{a:'start',s:11,c:PAL.muted});
  return {vb:'-70 0 700 330',s};},

'3914':()=>{let s='';
  s+=ln('40,60 120,60',5)+tp(40,60,5,'l')+bx(120,40,80,40,'Buffer');
  s+=ln('360,26 330,26',6)+tp(360,26,6,'t')+ln('330,26 330,40');
  for(let i=0;i<10;i++){const y=40+i*24;s+=`<rect x="324" y="${y+3}" width="12" height="18" fill="none" stroke="${PAL.muted}" stroke-width="1.5"/>`;}
  s+=ln('330,280 330,300',4)+tp(330,300,4,'b');
  s+=ln('200,60 230,60 230,270');for(let i=0;i<10;i++){const y=274-i*24;s+=ln(`230,${y} 250,${y}`)+`<path d="M250 ${y-9}L272 ${y}L250 ${y+9}Z" fill="${PAL.panel}" stroke="${PAL.ink2}" stroke-width="1.5"/>`+ln(`324,${y-10} 272,${y-10} 262,${y-6}`);}
  s+=tx(260,24,'10 comparators',{s:11,c:PAL.muted});
  s+=bx(380,90,90,120,'Current\nregulated\nLED\noutputs',PAL.good);
  const outs=[1,18,17,16,15,14,13,12,11,10];outs.forEach((n,i)=>{const y=276-i*25;s+=ln(`470,${y>200?Math.min(y,205):Math.max(y,95)} 470,${y} 540,${y}`,n)+tp(540,y,n,'r');});
  s+=bx(80,170,110,50,'Reference\n1.25 V')+ln('40,190 80,190',8)+tp(40,190,8,'l')+ln('190,195 210,195 210,250 40,250',7)+tp(40,250,7,'l');
  s+=ln('40,120 120,120',9)+tp(40,120,9,'l')+tx(150,124,'bar / dot',{s:11,c:PAL.muted});
  s+=tx(40,18,'3 V+ / 2 V− power everything',{a:'start',s:11,c:PAL.muted});
  return {vb:'-70 0 700 330',s};},
'4056':()=>{let s='';
  s+=ln('40,80 200,80',4)+tp(40,80,4,'l')+bx(200,55,150,50,'Power transistor\n(the valve)',PAL.amber)+ln('350,80 540,80',5)+tp(540,80,5,'r');
  s+=bx(200,150,150,70,'Control loop\nconstant current →\nconstant 4.2 V');s+=ln('275,150 275,105');s+=ln('450,80 450,185 350,185');
  s+=ln('40,190 200,190',2)+tp(40,190,2,'l')+tx(120,180,'sets the current',{s:11,c:PAL.muted});
  s+=ln('40,250 200,250',1)+tp(40,250,1,'l')+bx(200,232,150,36,'Battery temp check');
  s+=ln('40,30 275,30 275,55',8)+tp(40,30,8,'l');
  s+=bx(400,200,110,60,'Status\n(open-drain)',PAL.good)+ln('510,215 540,215',7)+tp(540,215,7,'r')+ln('510,245 540,245',6)+tp(540,245,6,'r');
  s+=ln('300,300 300,268',3)+tp(300,300,3,'b');
  return {vb:'-70 0 700 330',s};},
'328':()=>{let s='';
  s+=bx(220,90,140,110,'CPU\n16 MHz\n\nruns your\nprogram',PAL.violet);
  s+=bx(220,20,140,50,'Flash 32 KB\n(program)')+bx(380,20,120,50,'RAM 2 KB\n(variables)');
  s+=ln('40,40 220,40',9)+tp(40,40,9,'l')+ln('40,70 120,70 120,110 220,110',10)+tp(40,70,10,'l')+tx(130,30,'crystal',{s:11,c:PAL.muted});
  s+=ln('40,150 220,150',1)+tp(40,150,1,'l');
  s+=bx(400,100,110,40,'Port D (D0–D7)',PAL.good)+ln('360,120 400,120')+ln('510,110 545,110',2)+tp(545,110,2,'r')+ln('510,130 545,130',3)+tp(545,130,3,'r');
  s+=bx(400,160,110,40,'Port B (D8–D13)\ntimers / PWM',PAL.good)+ln('360,180 400,180')+ln('510,170 545,170',15)+tp(545,170,15,'r')+ln('510,190 545,190',19)+tp(545,190,19,'r');
  s+=bx(220,230,140,50,'ADC 10 bit\n(analogRead)',PAL.blue)+ln('290,200 290,230')+ln('360,255 545,255',23)+tp(545,255,23,'r');
  s+=ln('40,245 220,245',21)+tp(40,245,21,'l')+ln('40,275 220,275',20)+tp(40,275,20,'l');
  s+=tx(40,312,'7 VCC / 8, 22 GND power everything',{a:'start',s:11,c:PAL.muted});
  return {vb:'-70 0 700 330',s};},
'595':()=>{let s='';const outs=[15,1,2,3,4,5,6,7];
  s+=ln('40,70 120,70',14)+ln('40,120 120,120',11)+ln('40,170 120,170',10)+bx(120,50,120,140,'Shift register\n8 cells\n(bucket brigade)');
  for(let i=0;i<4;i++){const y=80+i*25;s+=arrow(240,y,280);}s+=tx(260,68,'×8',{s:11,c:PAL.muted});
  s+=bx(280,50,110,140,'Storage latch\n8 cells\n(copy on RCLK)');
  s+=ln('40,230 335,230 335,190',12);
  for(let i=0;i<4;i++){const y=80+i*25;s+=arrow(390,y,420);}
  s+=bx(420,50,70,140,'Output\nbuffers');s+=ln('40,280 455,280 455,190',13);
  outs.forEach((n,i)=>{const y=58+i*18;s+=ln(`490,${y} 530,${y}`,n)+tp(530,y,n,'r');});
  s+=ln('240,175 255,175 255,305 530,305',9)+tp(530,305,9,'r')+tx(400,298,'→ next chip',{s:11,c:PAL.muted});
  return {vb:'-75 0 700 330',s:s+tp(40,70,14,'l')+tp(40,120,11,'l')+tp(40,170,10,'l')+tp(40,230,12,'l')+tp(40,280,13,'l')};}
};
function build(el){const k=el.dataset.chip,C=CH[k];CUR=k;const I=IN[k]();
  const leg=Object.keys(TC).map(t=>`<span><i style="background:${TC[t]}"></i>${TN[t]}</span>`).join('');
  el.innerHTML=`<div class="cx-grid"><figure><figcaption>📌 Pinout: the real chip</figcaption>${C.pkg==='dip'?dipSVG(k):to220SVG(k)}</figure>
  <figure><figcaption>🧩 Inside the chip (simplified schematic)</figcaption><svg viewBox="${I.vb}" class="pinsvg">${I.s}</svg></figure></div>
  <div class="cx-leg">${leg}</div><div class="cx-det"></div>
  <div class="cx-tw"><table class="cx-tab"><tr><td>Pin</td><td>Name</td><td>What it's for</td><td>How to connect it</td></tr>${C.pins.map(p=>`<tr data-pin="${p[0]}"><td><b style="color:${TC[p[2]]}">${p[0]}</b></td><td><b style="color:${TC[p[2]]}">${esc(p[1])}</b><br><small>${TN[p[2]]}</small></td><td>${esc(p[3])}</td><td>${esc(p[4]||(p[2]==='out'?'Same as '+C.pins.find(q=>q[2]==='out'&&q[4])[1]+'.':'—'))}</td></tr>`).join('')}</table></div>`;
  const det=el.querySelector('.cx-det');const conn=p=>p[4]||(p[2]==='out'?'Same as '+C.pins.find(q=>q[2]==='out'&&q[4])[1]+'.':'');
  function sel(n){el.querySelectorAll('[data-pin]').forEach(e=>e.classList.toggle('sel',+e.dataset.pin===n));const p=pinOf(k,n);
    det.innerHTML=`<b style="color:${TC[p[2]]}">Pin ${p[0]} · ${esc(p[1])}</b> <small>(${TN[p[2]]})</small><br>${esc(p[3])}${conn(p)?`<br><span class="cx-how">🔌 ${esc(conn(p))}</span>`:''}`;}
  el.querySelectorAll('[data-pin]').forEach(e=>{if(e.classList.contains('wp'))return;e.addEventListener('click',()=>sel(+e.dataset.pin));e.addEventListener('mouseenter',()=>sel(+e.dataset.pin));});
  sel(C.pins[0][0]);}
document.querySelectorAll('.chipx').forEach(build);

// ---------- chips menu: one chip at a time ----------

function dipArt(lab,n,sub,col){const h=n/2,w=Math.min(220,30+h*24),x0=160-w/2,y0=70;let legs='';for(let i=0;i<h;i++){const x=x0+16+i*((w-32)/(h-1||1));legs+=`<rect x="${x-4}" y="${y0-22}" width="8" height="22" fill="${PAL.ink2}"/><rect x="${x-4}" y="${y0+70}" width="8" height="22" fill="${PAL.ink2}"/>`;}
  return `<svg viewBox="0 0 320 200">${legs}<rect x="${x0}" y="${y0}" width="${w}" height="70" rx="6" fill="${PAL.chipDark}" stroke="${col}" stroke-width="2"/><path d="M${x0} ${y0+25} a10 10 0 0 1 0 20" fill="${PAL.canvas}" stroke="${col}" stroke-width="2"/><circle cx="${x0+14}" cy="${y0+56}" r="4" fill="${PAL.slate}"/><text x="160" y="${y0+40}" text-anchor="middle" fill="${PAL.ink}" font-size="${lab.length>6?18:22}" font-weight="800" font-family="ui-monospace,monospace">${lab}</text><text x="160" y="${y0+58}" text-anchor="middle" fill="${PAL.muted}" font-size="10" font-family="system-ui">${n} pins</text><text x="160" y="190" text-anchor="middle" fill="${col}" font-size="13" font-weight="700" font-family="system-ui">${sub}</text></svg>`;}
const to220Art=`<svg viewBox="0 0 320 200"><rect x="110" y="10" width="100" height="56" rx="4" fill="${PAL.muted}"/><circle cx="160" cy="36" r="12" fill="${PAL.canvas}"/><rect x="110" y="62" width="100" height="70" rx="4" fill="${PAL.chipDark}" stroke="${PAL.slate}" stroke-width="2"/><text x="160" y="104" text-anchor="middle" fill="${PAL.ink}" font-size="20" font-weight="800" font-family="ui-monospace,monospace">7805</text><path d="M130 132 v46 M160 132 v46 M190 132 v46" stroke="${PAL.ink2}" stroke-width="6"/><text x="130" y="196" text-anchor="middle" fill="${PAL.bad}" font-size="11" font-family="system-ui">IN</text><text x="160" y="196" text-anchor="middle" fill="${PAL.muted}" font-size="11" font-family="system-ui">GND</text><text x="190" y="196" text-anchor="middle" fill="${PAL.good}" font-size="11" font-family="system-ui">5 V</text></svg>`;
const CH_ART={chfam:`<svg viewBox="0 0 320 200"><text x="160" y="95" text-anchor="middle" font-size="40" font-weight="800" font-family="ui-monospace,monospace"><tspan fill="${PAL.violet}">NE</tspan><tspan fill="${PAL.green}">555</tspan><tspan fill="${PAL.amber}">P</tspan></text><text x="70" y="140" text-anchor="middle" fill="${PAL.violet}" font-size="13" font-family="system-ui">maker/family</text><text x="170" y="140" text-anchor="middle" fill="${PAL.green}" font-size="13" font-family="system-ui">function</text><text x="262" y="140" text-anchor="middle" fill="${PAL.amber}" font-size="13" font-family="system-ui">package</text></svg>`,s555:dipArt('NE555',8,'Timer',PAL.violet),s7805:to220Art,s358:dipArt('LM358',8,'Dual op-amp',PAL.blue),s386:dipArt('LM386',8,'Audio amplifier',PAL.pink),s4017:dipArt('CD4017',16,'Decade counter','#34d399'),s4511:dipArt('CD4511',16,'BCD → 7-segment decoder',PAL.bad),s4518:dipArt('CD4518',16,'Dual BCD counter',PAL.yellow),s595:dipArt('74HC595',16,'Shift register',PAL.sky),s3914:dipArt('LM3914',18,'Bar-graph driver',PAL.green),s4056:dipArt('TP4056',8,'Li-ion charger',PAL.amber),s328:dipArt('ATmega328P',28,'Arduino brain','#2dd4bf'),s339:dipArt('LM339',14,'Quad comparator',PAL.blue),s4013:dipArt('CD4013',14,'Dual D flip-flop',PAL.pink),s4060:dipArt('CD4060',16,'Oscillator + divider',PAL.amber),s293:dipArt('L293D',16,'H-bridge motor driver',PAL.bad)};

sectionMenu('chMenu',{first:'chwhat',onSelect:id=>heroSwap('chips',CH_ART[id])});
// ---------- demos: CD4511 and CD4518 ----------
function bitDots(ctx,x,y,v,names,click){names.forEach((nm,i)=>{const w=[1,2,4,8][i],on=(v&w)!==0,cx=x,cy=y+i*44;ctx.fillStyle=on?PAL.green:PAL.raised;ctx.beginPath();ctx.arc(cx,cy,16,0,7);ctx.fill();ctx.strokeStyle=PAL.slate;ctx.stroke();
  ctx.fillStyle=on?'#04210f':PAL.muted;ctx.font='700 13px system-ui';ctx.textAlign='center';ctx.fillText(on?'1':'0',cx,cy+5);ctx.fillStyle=PAL.ink2;ctx.font='12px system-ui';ctx.textAlign='left';ctx.fillText(nm+' (= '+w+')',cx+26,cy+4);});}
const D11={v:6,LT:false,BI:false,LE:false,shown:6};
function draw4511(){const c=document.getElementById('c4511');if(!c)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  if(!D11.LE)D11.shown=D11.v;const val=D11.shown;let on=val<=9?DIGITS[val]:'';if(D11.BI)on='';if(D11.LT)on='abcdefg';
  ctx.fillStyle=PAL.muted;ctx.font='12px system-ui';ctx.textAlign='left';ctx.fillText('Inputs (click a bit)',40,24);
  bitDots(ctx,60,60,D11.v,['A','B','C','D']);
  ctx.fillStyle=PAL.ink;ctx.font='700 15px system-ui';ctx.fillText('D C B A = '+D11.v.toString(2).padStart(4,'0')+'  →  '+D11.v,40,250);
  // arrows to box
  ctx.fillStyle=PAL.panel;ctx.strokeStyle=PAL.violet;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(260,50,170,150,10);ctx.fill();ctx.stroke();
  ctx.fillStyle=PAL.ink;ctx.font='700 16px system-ui';ctx.textAlign='center';ctx.fillText('CD4511',345,100);ctx.font='12px system-ui';ctx.fillStyle=PAL.muted;
  ctx.fillText(D11.LT?'LT low: all segments on':D11.BI?'BI low: blank':D11.LE?'LE high: frozen at '+D11.shown:val>9?'not a digit → blank':'lights: '+on.split('').join(' '),345,130);
  ctx.fillText('a b c d e f g',345,160);
  'abcdefg'.split('').forEach((k,i)=>{const l=on.includes(k);ctx.fillStyle=l?PAL.green:PAL.slateDark;ctx.beginPath();ctx.arc(290+i*18.3,178,6,0,7);ctx.fill();});
  ctx.strokeStyle=PAL.muted2;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(200,125);ctx.lineTo(255,125);ctx.moveTo(435,125);ctx.lineTo(530,125);ctx.stroke();
  drawDigit(ctx,560,30,1.9,on,{pad:12,glow:12});}
document.getElementById('c4511').addEventListener('click',e=>{const r=e.target.getBoundingClientRect(),x=(e.clientX-r.left)*800/r.width,y=(e.clientY-r.top)*270/r.height;
  for(let i=0;i<4;i++){if(Math.hypot(x-60,y-(60+i*44))<22){D11.v^=(1<<i);draw4511();}}});
const tg=(id,k)=>document.getElementById(id).addEventListener('click',e=>{D11[k]=!D11[k];e.target.classList.toggle('active',D11[k]);draw4511();});
tg('d11LT','LT');tg('d11BI','BI');tg('d11LE','LE');
document.getElementById('d11up').addEventListener('click',()=>{D11.v=(D11.v+1)%16;draw4511();});
draw4511();
const D18={a:0,b:0,acc:0,run:true,flash:0};
function tick18(){const was=D18.a;D18.a=(D18.a+1)%10;if(was===9&&document.getElementById('d18chain').checked){D18.b=(D18.b+1)%10;D18.flash=0.6;}}
function draw4518(dt){const c=document.getElementById('c4518');if(!c||!c.offsetParent)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  if(D18.run){D18.acc+=dt*(+document.getElementById('d18sp').value);while(D18.acc>=1){D18.acc-=1;tick18();}}D18.flash=Math.max(0,D18.flash-dt);
  ctx.textAlign='left';ctx.fillStyle=PAL.muted;ctx.font='12px system-ui';ctx.fillText('Counter B (tens): Q1B–Q4B',40,24);ctx.fillText('Counter A (units): Q1A–Q4A',600,24);
  bitDots(ctx,60,60,D18.b,['Q1B','Q2B','Q3B','Q4B']);bitDots(ctx,620,60,D18.a,['Q1A','Q2A','Q3A','Q4A']);
  drawDigit(ctx,300,40,1.4,DIGITS[D18.b],{pad:12,glow:12});drawDigit(ctx,420,40,1.4,DIGITS[D18.a],{pad:12,glow:12});
  ctx.textAlign='center';ctx.fillStyle=PAL.ink;ctx.font='700 14px system-ui';ctx.fillText('tens',342,240);ctx.fillText('units',462,240);
  if(D18.flash>0){ctx.strokeStyle=`rgba(251,191,36,${D18.flash/0.6})`;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(612,192);ctx.quadraticCurveTo(400,300,190,192);ctx.stroke();ctx.fillStyle=PAL.yellow;ctx.font='13px system-ui';ctx.fillText('Q4A fell (9 → 0): EN B counts +1',400,262);}}
document.getElementById('d18run').addEventListener('click',e=>{D18.run=!D18.run;e.target.textContent=D18.run?'⏸ Pause':'▶ Run';e.target.classList.toggle('active',D18.run);});
document.getElementById('d18tick').addEventListener('click',()=>tick18());document.getElementById('d18rst').addEventListener('click',()=>{D18.a=0;D18.b=0;D18.acc=0;});
loop((dt,now)=>{draw4518(dt);});

// ---------- demos: LM3914, TP4056, ATmega328P ----------
function draw3914(){const c=document.getElementById('c3914');if(!c||!c.offsetParent)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const v=+document.getElementById('lm39In').value,hi=+document.getElementById('lm39Hi').value,dot=document.getElementById('lm39Dot').checked;let n=0;for(let i=1;i<=10;i++)if(v>=hi*i/10)n=i;
  ctx.font='13px system-ui';ctx.textAlign='left';ctx.fillStyle=PAL.ink2;ctx.fillText('SIG = '+(v*1000).toFixed(0)+' mV',30,40);ctx.fillText('each step = RHI ÷ 10 = '+(hi*100).toFixed(0)+' mV',30,62);
  for(let i=0;i<10;i++){const y=250-i*22,th=hi*(i+1)/10,on=dot?i===n-1:i<n;ctx.fillStyle=PAL.raised;ctx.fillRect(250,y-9,90,18);ctx.fillStyle=PAL.muted;ctx.font='11px system-ui';ctx.textAlign='center';ctx.fillText((th*1000).toFixed(0)+' mV',295,y+4);
    ctx.fillStyle=v>=th?PAL.green:PAL.slate;ctx.beginPath();ctx.moveTo(355,y-8);ctx.lineTo(375,y);ctx.lineTo(355,y+8);ctx.fill();
    ctx.fillStyle=on?PAL.green:'#14301f';if(on){ctx.shadowBlur=12;ctx.shadowColor=PAL.green;}ctx.fillRect(420,y-9,160,18);ctx.shadowBlur=0;ctx.fillStyle=PAL.muted2;ctx.textAlign='left';ctx.fillText('LED'+(i+1),590,y+4);}
  ctx.fillStyle=PAL.yellow;ctx.font='14px system-ui';ctx.textAlign='left';ctx.fillText(n?(dot?'dot on LED'+n:n+' LED'+(n>1?'s':'')+' lit'):'below the first step',30,110);
  ctx.fillStyle=PAL.muted;ctx.font='12px system-ui';ctx.fillText('ladder',275,30);ctx.fillText('comparators',340,30);ctx.fillText('LEDs',480,30);}
['lm39In','lm39Hi','lm39Dot'].forEach(id=>document.getElementById(id).addEventListener('input',draw3914));
const TPS={t:0,run:true};const TPR=[[10000,'10 kΩ → 130 mA'],[4000,'4 kΩ → 300 mA'],[2400,'2.4 kΩ → 500 mA'],[1200,'1.2 kΩ → 1 A']];
document.getElementById('tpGo').addEventListener('click',e=>{TPS.t=0;TPS.run=true;});
function tpModel(tt,Ic){let v,i;const tcc=2.6*(1/Ic);if(tt<tcc){v=3.0+1.2*Math.pow(tt/tcc,0.6);i=Ic;}else{v=4.2;i=Ic*Math.exp(-(tt-tcc)/0.9);}return {v,i,done:i<Ic/10};}
function draw4056(dt){const c=document.getElementById('c4056');if(!c||!c.offsetParent)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const [R,lab]=TPR[+document.getElementById('tpR').value];document.getElementById('tpRl').textContent=lab;const Ic=1200/R;if(TPS.run)TPS.t+=dt;const T=TPS.t,m=tpModel(T,Ic);if(m.done)TPS.run=false;
  const gx=40,gy=30,gw=480,gh=200,tmax=2.6/Ic+3.5;ctx.fillStyle=PAL.panel;ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle=PAL.line;ctx.strokeRect(gx,gy,gw,gh);
  const plotF=(f,col,lo,hi)=>{ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();for(let k=0;k<=200;k++){const tt=k/200*Math.min(T,tmax);const y=gy+gh-(f(tpModel(tt,Ic))-lo)/(hi-lo)*gh;const x=gx+tt/tmax*gw;k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();};
  plotF(q=>q.v,PAL.blue,2.8,4.4);plotF(q=>q.i,PAL.amber,0,1.4);ctx.font='12px system-ui';ctx.textAlign='right';ctx.fillStyle=PAL.blue;ctx.fillText('battery voltage (→ 4.2 V)',gx+gw-8,gy+gh-28);ctx.fillStyle=PAL.amber;ctx.fillText('charge current',gx+gw-8,gy+gh-10);ctx.textAlign='left';
  const ycv=gy+gh-(4.2-2.8)/1.6*gh;ctx.setLineDash([4,4]);ctx.strokeStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(gx,ycv);ctx.lineTo(gx+gw,ycv);ctx.stroke();ctx.setLineDash([]);
  const phase=m.done?'FULL: charge stopped':m.v<4.19?'Phase 1: constant current':'Phase 2: constant voltage 4.2 V, current fading';ctx.fillStyle=PAL.ink;ctx.font='14px system-ui';ctx.fillText(phase,gx,gy+gh+28);
  ctx.textAlign='center';ctx.fillStyle=PAL.ink2;ctx.font='13px system-ui';ctx.fillText(m.v.toFixed(2)+' V · '+(m.i*1000).toFixed(0)+' mA',660,70);
  [['CHRG',!m.done,'239,68,68',620],['STDBY',m.done,'34,197,94',700]].forEach(([l,on,rgb,x])=>{ctx.fillStyle=`rgba(${rgb},${on?1:0.2})`;if(on){ctx.shadowBlur=16;ctx.shadowColor=`rgb(${rgb})`;}ctx.beginPath();ctx.arc(x,140,13,0,7);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle=PAL.muted;ctx.font='12px system-ui';ctx.fillText(l,x,172);});
  ctx.fillStyle='#0f766e';ctx.fillRect(600,200,110,34);ctx.fillStyle=PAL.green;const f=Math.min(1,(m.v-3)/1.2*0.85+(m.done?0.15:0));ctx.fillRect(604,204,102*f,26);ctx.fillStyle=PAL.white;ctx.fillText('18650',655,222);}
const AV={t:0};
function draw328(dt){const c=document.getElementById('c328');if(!c||!c.offsetParent)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);AV.t+=dt;
  const v=+document.getElementById('avA0').value,val=Math.round(v/5*1023),pwm=Math.floor(val/4),led13=Math.floor(AV.t*2)%2===0;
  ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.roundRect(300,40,200,200,10);ctx.fill();ctx.strokeStyle='#2dd4bf';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=PAL.ink;ctx.font='700 15px ui-monospace,monospace';ctx.textAlign='center';ctx.fillText('ATmega328P',400,130);ctx.fillStyle=PAL.muted;ctx.font='12px system-ui';ctx.fillText('16 million steps / s',400,152);
  ctx.textAlign='left';ctx.fillStyle=PAL.ink2;ctx.font='13px system-ui';ctx.fillText('A0 (pin 23): '+v.toFixed(2)+' V',40,90);ctx.fillText('analogRead → '+val,40,114);
  ctx.fillStyle=PAL.raised;ctx.fillRect(40,130,200,14);ctx.fillStyle=PAL.blue;ctx.fillRect(40,130,200*val/1023,14);
  ctx.strokeStyle=PAL.muted2;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(240,110);ctx.lineTo(300,110);ctx.moveTo(500,100);ctx.lineTo(600,100);ctx.moveTo(500,190);ctx.lineTo(600,190);ctx.stroke();
  const b=pwm/255;ctx.fillStyle=`rgba(250,204,21,${0.15+0.85*b})`;if(b>0.05){ctx.shadowBlur=24*b;ctx.shadowColor=PAL.yellowSoft;}ctx.beginPath();ctx.arc(630,100,14,0,7);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle=PAL.ink2;ctx.fillText('D9 (pin 15) PWM '+pwm+'/255',520,70);
  ctx.fillStyle=led13?PAL.bad:'#3b1d1d';if(led13){ctx.shadowBlur=14;ctx.shadowColor=PAL.bad;}ctx.beginPath();ctx.arc(630,190,12,0,7);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle=PAL.ink2;ctx.fillText('D13 (pin 19) blinks',520,225);
  // PWM wave
  ctx.strokeStyle=PAL.yellowSoft;ctx.lineWidth=1.5;ctx.beginPath();for(let k=0;k<=150;k++){const x=650+k,ph=(k/30)%1,y=ph<b?126:146;k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
loop((dt,now)=>{draw3914();draw4056(dt);draw328(dt);});

// ---------- part-number decoder ----------
(()=>{const PN={
 'NE555P':[['NE',PAL.violet,'Signetics linear line, 0–70 °C grade'],['555',PAL.green,'the 555 timer'],['P',PAL.amber,'plastic DIP-8: breadboard ✓']],
 'LM358N':[['LM',PAL.violet,'Linear Monolithic (National → TI)'],['358',PAL.green,'dual op-amp'],['N',PAL.amber,'DIP-8']],
 'L7805CV':[['L',PAL.violet,'made by STMicroelectronics'],['78',PAL.green,'positive fixed regulator'],['05',PAL.sky,'5 volts'],['C',PAL.muted,'commercial temperature'],['V',PAL.amber,'TO-220 package']],
 'CD4017BE':[['CD',PAL.violet,'CMOS 4000 series (originally RCA)'],['4017',PAL.green,'decade counter'],['B',PAL.muted,'buffered (standard) version'],['E',PAL.amber,'plastic DIP-16 (TI)']],
 'SN74HC595N':[['SN',PAL.violet,'Texas Instruments'],['74',PAL.green,'7400 logic family'],['HC',PAL.sky,'high-speed CMOS, 2–6 V'],['595',PAL.green,'8-bit shift register'],['N',PAL.amber,'DIP-16']],
 'ATmega328P-PU':[['AT',PAL.violet,'Atmel (now Microchip)'],['mega',PAL.sky,'the megaAVR family'],['32',PAL.green,'32 KB of program memory'],['8',PAL.green,'family member'],['P',PAL.muted,'picoPower (low power)'],['-PU',PAL.amber,'DIP-28, industrial temp']],
 'LM35DZ':[['LM',PAL.violet,'Linear Monolithic'],['35',PAL.green,'temperature sensor 10 mV/°C'],['D',PAL.muted,'accuracy grade (0–100 °C)'],['Z',PAL.amber,'TO-92 package']],
 'LM3914N':[['LM',PAL.violet,'Linear Monolithic'],['3914',PAL.green,'10-LED bar-graph driver (linear)'],['N',PAL.amber,'DIP-18']],
 'TP4056':[['TP',PAL.violet,'Top Power (NanJing)'],['4056',PAL.green,'1 A Li-ion charger'],['',PAL.amber,'sold in SOP-8 (surface-mount) only']]};
 const box=document.getElementById('pnBtns'),out=document.getElementById('pnOut');if(!box)return;
 function show(k){box.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.textContent===k));
  out.innerHTML='<div class="pnname">'+PN[k].map(([t,c])=>t?`<span style="color:${c};border-bottom:3px solid ${c}">${t}</span>`:'').join('')+'</div><ul>'+PN[k].map(([t,c,d])=>`<li><b style="color:${c}">${t||'(no suffix)'}</b> → ${d}</li>`).join('')+'</ul>';}
 Object.keys(PN).forEach(k=>{const b=document.createElement('button');b.textContent=k;b.onclick=()=>show(k);box.appendChild(b);});show('NE555P');})();
})();


// ===== Minimal circuits: every leg connected =====
(function(){
// row: [pin, branches, why]; branch = [chain, dest]; chain items 'R:1 kΩ','C:10 µF+','C:100 nF','LED:r','POT:10 kΩ','LDR','SPK','XTAL:16 MHz','BTN','D'
// dest: 'V9','V5','GND','NC','P6' (wire to pin 6), 'T:text' (to something else), 'IN:text' (signal coming in)
const MIN={
'555':{title:'NE555 blinker (9 V)',sub:'LED blinks ~1.5 times per second',rows:[
 [1,[[[],'GND']],'Ground: the − of the battery.'],
 [2,[[['C:10 µF+'],'GND'],[[],'P6']],'Trigger: joined to pin 6 and to the timing capacitor. When the capacitor drops to ⅓, the output turns on.'],
 [3,[[['R:470 Ω','LED:r'],'GND']],'Output: drives the LED through its resistor.'],
 [4,[[[],'V9']],'Reset: tied to + so the timer always runs (low = stop).'],
 [5,[[['C:10 nF'],'GND']],'Control: a small capacitor to ground keeps the ⅔ point steady.'],
 [6,[[['R:47 kΩ'],'P7'],[[],'P2']],'Threshold: joined to pin 2. R2 goes from here to pin 7. At ⅔ the output turns off.'],
 [7,[[['R:1 kΩ'],'V9']],'Discharge: sits between R1 (to +) and R2 (to pin 6). Drains the capacitor through R2.'],
 [8,[[[],'V9'],[['C:100 nF'],'GND']],'Supply + (4.5–16 V), with a 100 nF decoupling capacitor right beside it.']]},
'7805':{title:'7805: 9 V in, steady 5 V out',sub:'front view, legs down: 1 IN · 2 GND · 3 OUT',side:'left',rows:[
 [1,[[[],'IN:+9 V battery'],[['C:330 nF'],'GND']],'Input: the raw 7–20 V, with a 330 nF capacitor close to the pin.'],
 [2,[[[],'GND']],'Ground (the metal tab is ground too).'],
 [3,[[[],'T:+5 V to your circuit'],[['C:100 nF'],'GND']],'Output: steady 5 V, with 100 nF to ground (add 10–100 µF for big loads).']]},
'358':{title:'LM358: "is it dark?" comparator',sub:'LED on when the LDR sees darkness (op-amp B unused)',rows:[
 [1,[[['R:1 kΩ','LED:r'],'GND']],'Output A: high when + is above −, lights the LED.'],
 [2,[[['POT:10 kΩ'],'T:pot ends to + and −']],'Input − A: the threshold, from the trimmer\'s wiper.'],
 [3,[[['R:10 kΩ'],'V9'],[['LDR'],'GND']],'Input + A: the sensor divider (10 kΩ on top, LDR below: darker → higher voltage).'],
 [4,[[[],'GND']],'Ground.'],
 [5,[[[],'GND']],'Input + B (unused): to ground so it doesn\'t float.'],
 [6,[[[],'P7']],'Input − B (unused): joined to output B (a "follower") so op-amp B stays quiet.'],
 [7,[[[],'P6']],'Output B (unused): joined to pin 6, nothing else.'],
 [8,[[[],'V9'],[['C:100 nF'],'GND']],'Supply + (3–32 V) with 100 nF decoupling.']]},
'386':{title:'LM386: mini speaker amp (like the Ruby)',sub:'gain 200 with the 10 µF between pins 1 and 8',rows:[
 [1,[[['C:10 µF+'],'P8']],'Gain: 10 µF to pin 8 for gain 200 (leave both open for gain 20).'],
 [2,[[[],'GND']],'Input −: to ground.'],
 [3,[[['POT:10 kΩ'],'IN:audio (volume pot wiper)']],'Input +: the audio, through a volume pot (ends to signal and ground).'],
 [4,[[[],'GND']],'Ground.'],
 [5,[[['C:220 µF+','SPK'],'GND'],[['R:10 Ω','C:47 nF'],'GND']],'Output: 220 µF to the speaker (blocks the 4.5 V DC), plus the Zobel (10 Ω + 47 nF) that keeps it stable.'],
 [6,[[[],'V9'],[['C:100 µF+'],'GND']],'Supply + (4–12 V) with a big capacitor.'],
 [7,[[['C:10 µF+'],'GND']],'Bypass (optional): less hum and noise.'],
 [8,[[[],'P1']],'Gain: the other end of the gain capacitor.']]},
'3914':{title:'LM3914: LM35 bar-graph thermometer',sub:'0–50 °C, 5 °C per LED (project 21)',rows:[
 [1,[[['LED:g'],'V9']],'LED 1 (lowest). Each LED: anode to +, cathode to its pin (the chip sinks a regulated current).'],
 [2,[[[],'GND']],'V−: ground.'],
 [3,[[[],'V9'],[['C:10 µF+'],'GND']],'V+: supply, decoupled.'],
 [4,[[[],'GND']],'RLO: bottom of the scale = 0 V.'],
 [5,[[[],'IN:LM35 Vout']],'SIG: the voltage to display.'],
 [6,[[[],'T:trimmer wiper']],'RHI: top of the scale, from the trimmer (0.50 V = 50 °C).'],
 [7,[[['R:2.2 kΩ'],'GND'],[['POT:10 kΩ'],'GND']],'REF OUT (1.25 V): 2.2 kΩ sets the LED current; the trimmer between here and ground feeds RHI.'],
 [8,[[[],'GND']],'REF ADJ: ground, so REF OUT = 1.25 V.'],
 [9,[[[],'V9']],'MODE: to + for a bar (open = dot).'],
 [10,[[['LED:r'],'V9']],'LED 10 (highest).'],[11,[[['LED:r'],'V9']],'LED 9.'],[12,[[['LED:r'],'V9']],'LED 8.'],[13,[[['LED:r'],'V9']],'LED 7.'],
 [14,[[['LED:g'],'V9']],'LED 6.'],[15,[[['LED:g'],'V9']],'LED 5.'],[16,[[['LED:g'],'V9']],'LED 4.'],[17,[[['LED:g'],'V9']],'LED 3.'],[18,[[['LED:g'],'V9']],'LED 2.']]},
'4017':{title:'CD4017: 10-LED chaser',sub:'clocked by a 555 (project 9)',rows:[
 [1,[[['LED:r'],'T:shared 470 Ω → GND']],'Q5. Every LED: anode on its output, cathodes together through ONE 470 Ω to ground (only one LED is on at a time).'],
 [2,[[['LED:r'],'T:shared 470 Ω → GND']],'Q1.'],[3,[[['LED:r'],'T:shared 470 Ω → GND']],'Q0 (first after reset).'],[4,[[['LED:r'],'T:shared 470 Ω → GND']],'Q2.'],
 [5,[[['LED:r'],'T:shared 470 Ω → GND']],'Q6.'],[6,[[['LED:r'],'T:shared 470 Ω → GND']],'Q7.'],[7,[[['LED:r'],'T:shared 470 Ω → GND']],'Q3.'],
 [8,[[[],'GND']],'VSS: ground.'],
 [9,[[['LED:r'],'T:shared 470 Ω → GND']],'Q8.'],[10,[[['LED:r'],'T:shared 470 Ω → GND']],'Q4.'],[11,[[['LED:r'],'T:shared 470 Ω → GND']],'Q9.'],
 [12,[[[],'NC']],'Carry out: not needed (would clock a second 4017).'],
 [13,[[[],'GND']],'Clock inhibit: ground = counting. Never leave it floating!'],
 [14,[[[],'IN:clock from 555 pin 3']],'Clock: one step per rising edge.'],
 [15,[[['R:10 kΩ'],'GND']],'Reset: held low (pull-down). To count to N, wire it to output QN instead.'],
 [16,[[[],'V9'],[['C:100 nF'],'GND']],'VDD: supply 3–15 V, decoupled.']]},
'4511':{title:'CD4511: show a digit from 4 switches',sub:'one SC39-11SURKWA display (COM to ground)',rows:[
 [1,[[['R:10 kΩ'],'GND'],[['BTN'],'V9']],'Input B (2): pull-down + a switch or wire to + to make it 1.'],
 [2,[[['R:10 kΩ'],'GND'],[['BTN'],'V9']],'Input C (4).'],
 [3,[[[],'V9']],'LT (lamp test): high = normal.'],
 [4,[[[],'V9']],'BI (blanking): high = normal.'],
 [5,[[[],'GND']],'LE (latch): low = follow the inputs.'],
 [6,[[['R:10 kΩ'],'GND'],[['BTN'],'V9']],'Input D (8).'],
 [7,[[['R:10 kΩ'],'GND'],[['BTN'],'V9']],'Input A (1).'],
 [8,[[[],'GND']],'VSS: ground.'],
 [9,[[['R:1 kΩ'],'T:display e (pin 1)']],'Segment e.'],[10,[[['R:1 kΩ'],'T:display d (pin 2)']],'Segment d.'],[11,[[['R:1 kΩ'],'T:display c (pin 4)']],'Segment c.'],
 [12,[[['R:1 kΩ'],'T:display b (pin 6)']],'Segment b.'],[13,[[['R:1 kΩ'],'T:display a (pin 7)']],'Segment a.'],[14,[[['R:1 kΩ'],'T:display g (pin 10)']],'Segment g.'],[15,[[['R:1 kΩ'],'T:display f (pin 9)']],'Segment f.'],
 [16,[[[],'V9'],[['C:100 nF'],'GND']],'VDD: supply, decoupled. (Display COM pins 3/8 → ground.)']]},
'4518':{title:'CD4518: counting 00–99',sub:'counter A = units, counter B = tens (project 19)',rows:[
 [1,[[[],'IN:clock from 555 pin 3']],'CLK A: counts on each rising edge.'],
 [2,[[[],'V9']],'EN A: high, so CLK A counts.'],
 [3,[[[],'T:units CD4511 A (pin 7)']],'Q1A (1).'],[4,[[[],'T:units CD4511 B (pin 1)']],'Q2A (2).'],[5,[[[],'T:units CD4511 C (pin 2)']],'Q3A (4).'],
 [6,[[[],'T:units CD4511 D (pin 6)'],[[],'P10']],'Q4A (8): to the decoder AND to EN B: its fall (9 → 0) counts one ten.'],
 [7,[[['R:10 kΩ'],'GND'],[['BTN'],'V9']],'RST A: pull-down + reset button to +.'],
 [8,[[[],'GND']],'VSS: ground.'],
 [9,[[[],'GND']],'CLK B: low, so counter B counts on the falling edge of EN B.'],
 [10,[[[],'P6']],'EN B: from Q4A (the carry).'],
 [11,[[[],'T:tens CD4511 A (pin 7)']],'Q1B.'],[12,[[[],'T:tens CD4511 B (pin 1)']],'Q2B.'],[13,[[[],'T:tens CD4511 C (pin 2)']],'Q3B.'],[14,[[[],'T:tens CD4511 D (pin 6)']],'Q4B.'],
 [15,[[[],'P7']],'RST B: joined to RST A, so the button resets both.'],
 [16,[[[],'V9'],[['C:100 nF'],'GND']],'VDD: supply, decoupled.']]},
'339':{title:'LM339: "is it dark?" LED (5 V)',sub:'comparator 1 used, the 3 others parked so they stay quiet',rows:[
 [1,[[[],'NC']],'OUT2: unused output, leave it free.'],
 [2,[[['LED:r','R:470 Ω'],'V5']],'OUT1: the LED and its resistor come from +5 V INTO the pin. When the output switches to ground, current flows and the LED lights.'],
 [3,[[[],'V5'],[['C:100 nF'],'GND']],'VCC: +5 V, with 100 nF decoupling.'],
 [4,[[['R:10 kΩ'],'V5'],[['LDR'],'GND']],'IN1−: the sensor divider. Darker → the LDR\'s resistance rises → this voltage rises.'],
 [5,[[['POT:10 kΩ'],'T:pot ends to + and −']],'IN1+: the threshold, from the trimmer\'s wiper. When IN1− climbs above it, OUT1 pulls to ground: the LED lights.'],
 [6,[[[],'V5']],'IN2− (unused): to +.'],[7,[[[],'GND']],'IN2+ (unused): to ground. With − above +, the unused output stays firmly on, instead of flickering.'],
 [8,[[[],'V5']],'IN3− (unused): to +.'],[9,[[[],'GND']],'IN3+ (unused): to ground.'],
 [10,[[[],'V5']],'IN4− (unused): to +.'],[11,[[[],'GND']],'IN4+ (unused): to ground.'],
 [12,[[[],'GND']],'GND: ground.'],
 [13,[[[],'NC']],'OUT4: unused, free.'],[14,[[[],'NC']],'OUT3: unused, free.']]},
'4013':{title:'CD4013: 2 Hz in, 1 Hz out (project 26)',sub:'flip-flop 1 wired as a divide-by-2, flip-flop 2 parked',rows:[
 [1,[[[],'T:1 Hz out → CD4518 CLK A'],[['R:1 kΩ','LED:r'],'GND']],'Q1: flips at every clock edge, so it gives half the clock frequency. An LED here blinks once per second.'],
 [2,[[[],'P5']],'Q̅1: back to D1. That feedback is the whole divide-by-2 trick: D always asks for the opposite of what Q is now.'],
 [3,[[[],'IN:2 Hz from CD4060 Q14 (pin 3)']],'CLK1: the 2 Hz clock.'],
 [4,[[[],'GND']],'R1: low (inactive).'],
 [5,[[[],'P2']],'D1: from Q̅1.'],
 [6,[[[],'GND']],'S1: low (inactive).'],
 [7,[[[],'GND']],'VSS: ground.'],
 [8,[[[],'GND']],'S2 (unused): ground.'],[9,[[[],'GND']],'D2 (unused): ground.'],[10,[[[],'GND']],'R2 (unused): ground.'],[11,[[[],'GND']],'CLK2 (unused): ground. CMOS inputs must never float.'],
 [12,[[[],'NC']],'Q̅2: free.'],[13,[[[],'NC']],'Q2: free.'],
 [14,[[[],'V9'],[['C:100 nF'],'GND']],'VDD: supply, decoupled.']]},
'4060':{title:'CD4060: quartz time base (project 26)',sub:'32.768 kHz watch quartz → an LED blinking exactly 2 times per second',rows:[
 [1,[[[],'NC']],'Q12: 8 Hz (free).'],[2,[[[],'NC']],'Q13: 4 Hz (free).'],
 [3,[[['R:1 kΩ','LED:r'],'GND'],[[],'T:2 Hz → CD4013 CLK1 (pin 3)']],'Q14: 2 Hz, the slowest output. The LED blinks twice a second, exactly.'],
 [4,[[[],'NC']],'Q6: 512 Hz (free).'],[5,[[[],'NC']],'Q5: 1,024 Hz (free).'],[6,[[[],'NC']],'Q7: 256 Hz (free).'],[7,[[[],'NC']],'Q4: 2,048 Hz (free).'],
 [8,[[[],'GND']],'VSS: ground.'],
 [9,[[[],'NC']],'φO: only for an RC oscillator; free with a quartz.'],
 [10,[[['R:10 MΩ'],'P11'],[['R:100 kΩ'],'T:quartz far side (+ 22 pF to GND)']],'φO̅: the inverter\'s output. 10 MΩ back to pin 11 wakes the inverter up; 100 kΩ limits how hard it shakes the tiny quartz.'],
 [11,[[['XTAL:32.768 kHz'],'T:quartz far side'],[['C:22 pF'],'GND']],'φI: the inverter\'s input. The quartz goes from here to the far side node, which also gets the 100 kΩ and a second 22 pF to ground.'],
 [12,[[[],'GND']],'RESET: low, so it runs.'],
 [13,[[[],'NC']],'Q9: 64 Hz (free).'],[14,[[[],'NC']],'Q8: 128 Hz (free).'],[15,[[[],'NC']],'Q10: 32 Hz (free).'],
 [16,[[[],'V9'],[['C:100 nF'],'GND']],'VDD: supply, decoupled.']]},
'293':{title:'L293D: one motor, both directions (Arduino)',sub:'logic at 5 V from the Arduino, motor at 9 V; bridge 2 unused',rows:[
 [1,[[[],'IN:Arduino D9 (PWM) = speed']],'EN1,2: high = bridge 1 on. A PWM signal here sets the speed (analogWrite). Tie to +5 V for full speed only.'],
 [2,[[[],'IN:Arduino D7 = direction A']],'1A: high → 1Y goes to +9 V, low → 1Y goes to ground.'],
 [3,[[[],'T:motor terminal 1']],'1Y: one end of the motor.'],
 [4,[[[],'GND']],'GND (and heat sink).'],[5,[[[],'GND']],'GND (and heat sink).'],
 [6,[[[],'T:motor terminal 2']],'2Y: the other end of the motor. No diodes to add: they are built in (the "D").'],
 [7,[[[],'IN:Arduino D8 = direction B']],'2A: D7 high + D8 low = forward, D7 low + D8 high = reverse, both the same = brake.'],
 [8,[[[],'V9'],[['C:100 µF+'],'GND']],'VCC2: the motor supply (9 V battery), with a 100 µF reservoir for the motor\'s current peaks.'],
 [9,[[[],'GND']],'EN3,4: low, bridge 2 off.'],[10,[[[],'GND']],'3A (unused): ground.'],[11,[[[],'NC']],'3Y: free.'],
 [12,[[[],'GND']],'GND (and heat sink).'],[13,[[[],'GND']],'GND (and heat sink).'],
 [14,[[[],'NC']],'4Y: free.'],[15,[[[],'GND']],'4A (unused): ground.'],
 [16,[[[],'V5'],[['C:100 nF'],'GND']],'VCC1: logic supply, +5 V from the Arduino, decoupled. The Arduino\'s GND and the battery − must be joined.']]},
'595':{title:'74HC595: 8 LEDs from 3 Arduino pins',sub:'5 V from the Arduino',rows:[
 [1,[[['R:330 Ω','LED:r'],'GND']],'QB.'],[2,[[['R:330 Ω','LED:r'],'GND']],'QC.'],[3,[[['R:330 Ω','LED:r'],'GND']],'QD.'],[4,[[['R:330 Ω','LED:r'],'GND']],'QE.'],
 [5,[[['R:330 Ω','LED:r'],'GND']],'QF.'],[6,[[['R:330 Ω','LED:r'],'GND']],'QG.'],[7,[[['R:330 Ω','LED:r'],'GND']],'QH.'],
 [8,[[[],'GND']],'Ground.'],
 [9,[[[],'NC']],'QH′: free (or to SER of a second 595).'],
 [10,[[[],'V5']],'SRCLR: high = don\'t clear.'],
 [11,[[[],'IN:Arduino D12 (clock)']],'Shift clock.'],
 [12,[[[],'IN:Arduino D8 (latch)']],'Latch clock.'],
 [13,[[[],'GND']],'OE: low = outputs on.'],
 [14,[[[],'IN:Arduino D11 (data)']],'Serial data in.'],
 [15,[[['R:330 Ω','LED:r'],'GND']],'QA.'],
 [16,[[[],'V5'],[['C:100 nF'],'GND']],'Supply 5 V, decoupled.']]},
'4056':{title:'TP4056: the charger module\'s circuit',sub:'already built on the module: here is what\'s around the chip',rows:[
 [1,[[[],'GND']],'TEMP: no battery thermistor, so grounded.'],
 [2,[[['R:1.2 kΩ'],'GND']],'PROG: 1.2 kΩ → 1 A charge current (I = 1200 ÷ R).'],
 [3,[[[],'GND']],'Ground.'],
 [4,[[[],'IN:+5 V USB'],[['C:10 µF+'],'GND']],'VCC: USB 5 V, decoupled.'],
 [5,[[[],'T:battery + (via BMS)'],[['C:10 µF+'],'GND']],'BAT: to the cell; ends at 4.2 V.'],
 [6,[[['LED:g','R:1 kΩ'],'V5']],'STDBY: pulls the green LED low (on) when full.'],
 [7,[[['LED:r','R:1 kΩ'],'V5']],'CHRG: pulls the red LED low (on) while charging.'],
 [8,[[[],'V5']],'CE: enable, tied to 5 V.']]},
'328':{title:'ATmega328P: an "Arduino" on a breadboard',sub:'the bare minimum to run a sketch (blinks an LED on D13)',rows:[
 [1,[[['R:10 kΩ'],'V5']],'RESET: pull-up so it runs (a button to ground resets it).'],
 [2,[[[],'NC']],'D0 / RX: free (serial from a USB adapter).'],[3,[[[],'NC']],'D1 / TX: free.'],[4,[[[],'NC']],'D2: free I/O.'],[5,[[[],'NC']],'D3: free I/O.'],[6,[[[],'NC']],'D4: free I/O.'],
 [7,[[[],'V5'],[['C:100 nF'],'GND']],'VCC: 5 V, decoupled.'],
 [8,[[[],'GND']],'Ground.'],
 [9,[[['XTAL:16 MHz'],'P10'],[['C:22 pF'],'GND']],'XTAL1: 16 MHz crystal to pin 10, 22 pF to ground.'],
 [10,[[['C:22 pF'],'GND']],'XTAL2: other side of the crystal, 22 pF to ground.'],
 [11,[[[],'NC']],'D5: free.'],[12,[[[],'NC']],'D6: free.'],[13,[[[],'NC']],'D7: free.'],[14,[[[],'NC']],'D8: free.'],
 [15,[[[],'NC']],'D9: free.'],[16,[[[],'NC']],'D10: free.'],[17,[[[],'NC']],'D11: free.'],[18,[[[],'NC']],'D12: free.'],
 [19,[[['R:330 Ω','LED:r'],'GND']],'D13: the "blink" LED.'],
 [20,[[[],'V5']],'AVCC: 5 V (the ADC\'s supply). Must be connected even if unused!'],
 [21,[[['C:100 nF'],'GND']],'AREF: 100 nF to ground.'],
 [22,[[[],'GND']],'Ground (analog).'],
 [23,[[[],'NC']],'A0: free (analog in).'],[24,[[[],'NC']],'A1: free.'],[25,[[[],'NC']],'A2: free.'],[26,[[[],'NC']],'A3: free.'],[27,[[[],'NC']],'A4 / SDA: free.'],[28,[[[],'NC']],'A5 / SCL: free.']]},
};
const NS='http://www.w3.org/2000/svg';
const COL={line:PAL.muted,res:'#e7c99a',cap:PAL.blue,gnd:PAL.muted,vcc:PAL.bad,sig:PAL.sky,pin:PAL.yellow};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
function partSVG(kind,x,y,dir,below,toChip){// draws a part centred at x along a horizontal line, width 56
  const [k,lab]=kind.split(':');const L=x-28,R=x+28;let s='';const t=(tx,c)=>`<text x="${x}" y="${below?y+21:y-13}" text-anchor="middle" font-size="10.5" fill="${c||PAL.ink2}">${esc(tx)}</text>`;
  if(k==='R'){s+=`<line x1="${L}" y1="${y}" x2="${x-16}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><rect x="${x-16}" y="${y-6}" width="32" height="12" rx="2" fill="${PAL.canvas}" stroke="${COL.res}" stroke-width="2"/><line x1="${x+16}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t(lab);}
  else if(k==='C'){const pol=lab.endsWith('+');const v=pol?lab.slice(0,-1):lab;s+=`<line x1="${L}" y1="${y}" x2="${x-4}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><line x1="${x-4}" y1="${y-9}" x2="${x-4}" y2="${y+9}" stroke="${COL.cap}" stroke-width="3"/><line x1="${x+4}" y1="${y-9}" x2="${x+4}" y2="${y+9}" stroke="${COL.cap}" stroke-width="3"/><line x1="${x+4}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t(v)+(pol?`<text x="${dir<0?x+10:x-10}" y="${below?y-10:y+16}" text-anchor="middle" font-size="11" fill="${PAL.bad}">+</text>`:'');}
  else if(k==='LED'){const c=lab==='g'?PAL.green:PAL.bad;if(toChip)dir=-dir;// anode towards chip? we draw triangle pointing away from chip
    s+=`<line x1="${L}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><path d="M${x-8*dir} ${y-8}L${x+8*dir} ${y}L${x-8*dir} ${y+8}Z" fill="${c}" stroke="${c}"/><line x1="${x+8*dir}" y1="${y-8}" x2="${x+8*dir}" y2="${y+8}" stroke="${c}" stroke-width="2.5"/><path d="M${x} ${y-11}l5 -6M${x+6} ${y-9}l5 -6" stroke="${c}" stroke-width="1.5"/>`;}
  else if(k==='POT'){s+=`<line x1="${L}" y1="${y}" x2="${x-16}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><rect x="${x-16}" y="${y-6}" width="32" height="12" rx="2" fill="${PAL.canvas}" stroke="${PAL.blueDark}" stroke-width="2"/><path d="M${x-10} ${y+12}L${x+10} ${y-12}" stroke="${PAL.blueDark}" stroke-width="2"/><line x1="${x+16}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t(lab||'pot');}
  else if(k==='LDR'){s+=`<line x1="${L}" y1="${y}" x2="${x-16}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><rect x="${x-16}" y="${y-6}" width="32" height="12" rx="2" fill="${PAL.canvas}" stroke="${PAL.orangeSoft}" stroke-width="2"/><line x1="${x+16}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><path d="M${x-14} ${y-20}l7 8M${x-6} ${y-22}l7 8" stroke="${PAL.yellow}" stroke-width="1.5"/>`+t('LDR',PAL.orangeSoft);}
  else if(k==='SPK'){s+=`<line x1="${L}" y1="${y}" x2="${x-8}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><rect x="${x-8}" y="${y-6}" width="8" height="12" fill="${PAL.ink2}"/><path d="M${x} ${y-6}L${x+10} ${y-13}V${y+13}L${x} ${y+6}Z" fill="${PAL.ink2}"/><line x1="${x+10}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t('8 Ω');}
  else if(k==='XTAL'){s+=`<line x1="${L}" y1="${y}" x2="${x-9}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><rect x="${x-5}" y="${y-9}" width="10" height="18" fill="${PAL.canvas}" stroke="${PAL.ink2}" stroke-width="2"/><line x1="${x-9}" y1="${y-9}" x2="${x-9}" y2="${y+9}" stroke="${PAL.ink2}" stroke-width="2"/><line x1="${x+9}" y1="${y-9}" x2="${x+9}" y2="${y+9}" stroke="${PAL.ink2}" stroke-width="2"/><line x1="${x+9}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t(lab);}
  else if(k==='BTN'){s+=`<line x1="${L}" y1="${y}" x2="${x-12}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><line x1="${x-12}" y1="${y}" x2="${x+10}" y2="${y-9}" stroke="${PAL.ink2}" stroke-width="2"/><line x1="${x+12}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t('switch');}
  return s;}
function destSVG(d,x,y,dir){const a=dir<0?'end':'start';let s='';
  if(d==='GND'){s+=`<line x1="${x}" y1="${y}" x2="${x+8*dir}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><path d="M${x+8*dir} ${y-8}V${y+8}M${x+13*dir} ${y-5}V${y+5}M${x+18*dir} ${y-2}V${y+2}" stroke="${COL.gnd}" stroke-width="2"/><text x="${x+24*dir}" y="${y+4}" text-anchor="${a}" font-size="11" fill="${PAL.muted}">GND</text>`;}
  else if(d==='V9'||d==='V5'){const v=d==='V9'?'+9 V':'+5 V';s+=`<line x1="${x}" y1="${y}" x2="${x+10*dir}" y2="${y}" stroke="${COL.vcc}" stroke-width="2"/><line x1="${x+10*dir}" y1="${y-8}" x2="${x+10*dir}" y2="${y+8}" stroke="${COL.vcc}" stroke-width="3"/><text x="${x+16*dir}" y="${y+4}" text-anchor="${a}" font-size="11" font-weight="700" fill="${COL.vcc}">${v}</text>`;}
  else if(d==='NC'){s+=`<path d="M${x+2*dir-4} ${y-4}l8 8M${x+2*dir+4} ${y-4}l-8 8" stroke="${PAL.muted2}" stroke-width="2"/><text x="${x+12*dir}" y="${y+4}" text-anchor="${a}" font-size="11" fill="${PAL.muted2}">not connected</text>`;}
  else if(d[0]==='P'){const n=d.slice(1);s+=`<line x1="${x}" y1="${y}" x2="${x+6*dir}" y2="${y}" stroke="${COL.pin}" stroke-width="2"/><rect x="${dir<0?x-62:x+6}" y="${y-9}" width="56" height="18" rx="9" fill="none" stroke="${COL.pin}" stroke-width="1.5"/><text x="${dir<0?x-34:x+34}" y="${y+4}" text-anchor="middle" font-size="11" font-weight="700" fill="${COL.pin}">↔ pin ${n}</text>`;}
  else{const isIn=d.startsWith('IN:');const tx=d.slice(isIn?3:2);s+=`<text x="${x+4*dir}" y="${y+4}" text-anchor="${a}" font-size="11" fill="${isIn?COL.sig:PAL.ink2}">${isIn?(dir<0?'':'')+'⟵ ':''}${esc(tx)}${isIn&&dir>0?'':''}</text>`;}
  return s;}
function describe(br){return br.map(([ch,d])=>{const parts=ch.map(c=>{const [k,l]=c.split(':');return {R:'resistor '+l,C:'capacitor '+(l||'').replace('+',' (+ towards the pin)'),LED:(l==='g'?'green ':'red ')+'LED',POT:'trimmer '+(l||''),LDR:'LDR',SPK:'speaker',XTAL:'crystal '+l,BTN:'switch'}[k];});
  const dd=d==='GND'?'ground (−)':d==='V9'?'+9 V':d==='V5'?'+5 V':d==='NC'?'nothing':d[0]==='P'?'pin '+d.slice(1):d.slice(d.startsWith('IN:')?3:2);return (parts.length?parts.join(' → ')+' → ':'')+dd;}).join('<br>+ ');}
function build(el){const k=el.dataset.chip,M=MIN[k];if(!M)return;const rows=M.rows,n=rows.length,h=Math.ceil(n/2),left=M.side==='left';
  const sp=Math.max(...rows.map(r=>r[1].length))>1?86:46,top=70,cw=110,cx=440,chL=cx-cw/2,chR=cx+cw/2,H=top+(left?n:h)*sp+30;
  let s=`<svg viewBox="0 0 880 ${H}" class="pinsvg">`;
  s+=`<text x="440" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="${PAL.ink}">${esc(M.title)}</text><text x="440" y="42" text-anchor="middle" font-size="12" fill="${PAL.muted}">${esc(M.sub)}</text>`;
  s+=`<rect x="${chL}" y="${top-14}" width="${cw}" height="${(left?n:h)*sp+8}" rx="8" fill="${PAL.chip}" stroke="${PAL.slate}" stroke-width="2"/>`;
  if(!left)s+=`<path d="M${cx-14} ${top-14} a14 14 0 0 0 28 0" fill="${PAL.canvas}" stroke="${PAL.slate}" stroke-width="2"/>`;
  rows.forEach(([p,br,why],idx)=>{let side,r;if(left){side=-1;r=idx;}else{side=p<=h?-1:1;r=p<=h?p-1:n-p;}const y=top+r*sp+sp/2-10;const x0=side<0?chL:chR;
    s+=`<g class="mrow" data-pin="${p}"><rect x="${side<0?0:chR}" y="${y-sp/2+2}" width="${side<0?chL:880-chR}" height="${sp-4}" fill="transparent"/>`;
    s+=`<rect x="${side<0?x0-14:x0}" y="${y-5}" width="14" height="10" fill="${PAL.ink2}"/><text x="${side<0?x0+8:x0-8}" y="${y+4}" text-anchor="${side<0?'start':'end'}" font-size="11" font-weight="700" fill="${PAL.ink}">${p}</text>`;
    const offs=br.length>1?[-15,15]:[0];
    br.forEach(([ch,d],bi)=>{const yy=y+offs[bi];let x=x0+14*side;if(br.length>1){s+=`<line x1="${x}" y1="${y}" x2="${x+10*side}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><line x1="${x+10*side}" y1="${y}" x2="${x+10*side}" y2="${yy}" stroke="${COL.line}" stroke-width="2"/>`;x+=10*side;if(bi===0)s+=`<circle cx="${x}" cy="${y}" r="3" fill="${COL.line}"/>`;}
      s+=`<line x1="${x}" y1="${yy}" x2="${x+14*side}" y2="${yy}" stroke="${COL.line}" stroke-width="2"/>`;x+=14*side;
      ch.forEach(c=>{s+=partSVG(c,x+28*side,yy,side,bi===1,d==='V9'||d==='V5');x+=56*side;});
      s+=`<line x1="${x}" y1="${yy}" x2="${x+10*side}" y2="${yy}" stroke="${COL.line}" stroke-width="2"/>`+destSVG(d,x+10*side,yy,side);});
    s+='</g>';});
  s+=`<text x="440" y="${H-8}" text-anchor="middle" font-size="11" fill="${PAL.muted2}">${left?'legs numbered 1-2-3 from left to right, writing facing you':'same leg positions as the real chip, seen from above'}</text></svg>`;
  const pinName=p=>{const C=window.__CH&&window.__CH[k];return '';};
  el.innerHTML=`<div class="cmfig">${s}</div><div class="cx-tw"><table class="cx-tab cm-tab"><tr><td>Pin</td><td>Connect to</td><td>Why</td></tr>${rows.map(([p,br,why])=>`<tr data-pin="${p}"><td><b>${p}</b></td><td>${describe(br)}</td><td>${esc(why)}</td></tr>`).join('')}</table></div>`;
  const sel=p=>el.querySelectorAll('[data-pin]').forEach(e=>e.classList.toggle('sel',+e.dataset.pin===p));
  el.querySelectorAll('[data-pin]').forEach(e=>{e.addEventListener('mouseenter',()=>sel(+e.dataset.pin));e.addEventListener('click',()=>sel(+e.dataset.pin));});}
document.querySelectorAll('.chmin').forEach(build);
})();

// ===== Demos for LM339, CD4013, CD4060 (+ quartz), L293D =====
(function(){
const vis=c=>c&&c.offsetParent;

// ---------- LM339 ----------
function draw339(t){const c=$('c339');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const vs=+$('c9sig').value,vt=+$('c9thr').value,pu=$('c9pu').checked,yes=vs>vt;
  txt(ctx,`Is IN− (${vs.toFixed(2)} V) higher than IN+ (${vt.toFixed(2)} V)?  ${yes?'YES → output switched to ground':'NO → output transistor off'}`,400,24,yes?PAL.good:PAL.ink2,14,'center');
  // rails
  W(ctx,[[40,60],[760,60]],PAL.bad);txt(ctx,'+5 V',36,64,PAL.redSoft,12,'right');W(ctx,[[40,250],[760,250]],PAL.blue);txt(ctx,'0 V',36,254,PAL.blue,12,'right');
  // inputs
  W(ctx,[[120,125],[250,125]],PAL.sky);W(ctx,[[120,175],[250,175]],PAL.amber);
  txt(ctx,'signal',112,122,PAL.sky,12,'right');txt(ctx,vs.toFixed(2)+' V',112,138,PAL.sky,12,'right');
  txt(ctx,'threshold',112,172,PAL.amber,12,'right');txt(ctx,vt.toFixed(2)+' V',112,188,PAL.amber,12,'right');
  [[150,vs,PAL.sky,125],[200,vt,PAL.amber,175]].forEach(([x,v,col,y])=>{ctx.fillStyle=PAL.raised;ctx.fillRect(x-6,72,12,160);ctx.fillStyle=col;const h=v/5*160;ctx.fillRect(x-6,232-h,12,h);});
  ctx.fillStyle=PAL.panel;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(250,100);ctx.lineTo(340,150);ctx.lineTo(250,200);ctx.closePath();ctx.fill();ctx.stroke();
  txt(ctx,'−',262,130,PAL.ink,18,'center');txt(ctx,'+',262,182,PAL.ink,16,'center');txt(ctx,'LM339',290,216,PAL.muted,11);
  // open collector switch
  W(ctx,[[340,150],[400,150]]);txt(ctx,'drives',370,142,PAL.muted2,10);
  const nx=470;W(ctx,[[nx,150],[nx,165]]);part(ctx,'switch',nx,165,nx,235,{closed:yes,col:yes?PAL.good:PAL.muted});W(ctx,[[nx,235],[nx,250]]);
  ctx.setLineDash([4,4]);W(ctx,[[400,150],[445,200]],PAL.muted2,1.5);ctx.setLineDash([]);txt(ctx,'open collector',nx+14,205,PAL.muted,11,'left');
  // pull-up
  if(pu){part(ctx,'res',nx,60,nx,150,{label:'10 kΩ pull-up'});}else{ctx.setLineDash([3,6]);W(ctx,[[nx,70],[nx,140]],PAL.slateDark,2);ctx.setLineDash([]);txt(ctx,'(no pull-up)',nx+10,104,PAL.muted2,11,'left');}
  ctx.fillStyle=PAL.muted;ctx.beginPath();ctx.arc(nx,150,4,0,7);ctx.fill();
  // output reading
  W(ctx,[[nx,150],[600,150]]);let vo,txt,col;
  if(yes){vo=0.05;txt='LOW (0 V)';col=PAL.good;}else if(pu){vo=5;txt='HIGH (5 V)';col=PAL.redSoft;}else{vo=1.5+1.5*Math.sin(t*7.3)+Math.sin(t*23.1);vo=Math.max(0,Math.min(5,vo));txt='floating: random!';col=PAL.yellow;}
  ctx.fillStyle=PAL.panel;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(600,105,160,90,10);ctx.fill();ctx.stroke();
  txt(ctx,'OUT1 = '+vo.toFixed(2)+' V',680,138,PAL.ink,15,'center');txt(ctx,txt,680,162,col,13);txt(ctx,'what a chip input reads',680,182,PAL.muted2,10);}

// ---------- CD4013 ----------
const F13={d:0,q:0,clk:0,pulse:0,auto:false,acc:0,hist:[],samp:0};
function edge13(){F13.q=$('d13tog').checked?1-F13.q:F13.d;}
function setClk(v){if(v&&!F13.clk)edge13();F13.clk=v;}
$('d13clk').addEventListener('click',()=>{F13.pulse=0.25;});
$('d13d').addEventListener('click',e=>{F13.d=1-F13.d;e.target.textContent='D = '+F13.d;e.target.classList.toggle('active',!!F13.d);});
$('d13run').addEventListener('click',e=>{F13.auto=!F13.auto;e.target.textContent=F13.auto?'⏸ Auto clock':'▶ Auto clock';e.target.classList.toggle('active',F13.auto);});
$('d13r').addEventListener('click',()=>{F13.q=0;});
$('d13tog').addEventListener('change',e=>{$('d13d').disabled=e.target.checked;});
function draw4013(dt){const c=$('c4013');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const tog=$('d13tog').checked;if(tog)F13.d=1-F13.q;
  let ck=0;if(F13.pulse>0){F13.pulse-=dt;ck=1;}if(F13.auto){F13.acc=(F13.acc+dt)%1;if(F13.acc<0.5)ck=1;}setClk(ck);if(tog)F13.d=1-F13.q;
  F13.samp+=dt;while(F13.samp>=1/30){F13.samp-=1/30;F13.hist.push([F13.clk,F13.d,F13.q]);if(F13.hist.length>300)F13.hist.shift();}
  // box
  ctx.fillStyle=PAL.panel;ctx.strokeStyle=PAL.pink;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(90,60,140,150,10);ctx.fill();ctx.stroke();txt(ctx,'D flip-flop',160,50,PAL.pink,13,'center');
  W(ctx,[[90,128],[102,136],[90,144]],PAL.ink2,1.5);
  [['D',95,F13.d,PAL.sky],['CLK',136,F13.clk,PAL.yellow]].forEach(([n,y,v,col])=>{W(ctx,[[30,y],[90,y]],v?col:PAL.slate,3);txt(ctx,n,108,y+4,PAL.ink,13,'left');lamp(ctx,30,y,v?1:0,'56,189,248',7);txt(ctx,String(v),30,y+24,PAL.muted,11);});
  [['Q',95,F13.q,0],['Q',175,1-F13.q,1]].forEach(([n,y,v,bar])=>{W(ctx,[[230,y],[262,y]],v?PAL.good:PAL.slate,3);txt(ctx,n,212,y+4,PAL.ink,13,'right');if(bar)W(ctx,[[202,y-10],[212,y-10]],PAL.ink,1.5);lamp(ctx,270,y,v?1:0);});
  if(tog){ctx.strokeStyle=PAL.yellow;ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(262,175);ctx.lineTo(262,236);ctx.lineTo(55,236);ctx.lineTo(55,95);ctx.stroke();ctx.setLineDash([]);txt(ctx,'Q̅ → D (toggle)',160,252,PAL.yellow,11);}
  // timing diagram
  const x0=330,x1=780;const rows=[['CLK',0,PAL.yellow,70],['D',1,PAL.sky,140],['Q',2,PAL.good,210]];
  txt(ctx,'last 10 seconds →',x1,24,PAL.muted2,11,'right');
  rows.forEach(([n,k,col,y])=>{txt(ctx,n,x0-10,y-8,col,13,'right');W(ctx,[[x0,y],[x1,y]],PAL.raised,1);ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();
    const h=F13.hist,N=300;h.forEach((s,i)=>{const x=x1-(h.length-1-i)*(x1-x0)/N,yy=y-s[k]*34;if(!i)ctx.moveTo(x,yy);else{const py=y-h[i-1][k]*34;if(py!==yy)ctx.lineTo(x,py);ctx.lineTo(x,yy);}});ctx.stroke();});
  ctx.setLineDash([3,4]);ctx.strokeStyle='rgba(251,191,36,.45)';ctx.lineWidth=1;const h=F13.hist;for(let i=1;i<h.length;i++){if(h[i][0]&&!h[i-1][0]){const x=x1-(h.length-1-i)*(x1-x0)/300;ctx.beginPath();ctx.moveTo(x,36);ctx.lineTo(x,214);ctx.stroke();}}ctx.setLineDash([]);
  txt(ctx,'Q only changes on a rising clock edge (dashed lines)',(x0+x1)/2,250,PAL.muted,12);}

// ---------- CD4060 ----------
const F60={t:0,run:true};
$('d60run').addEventListener('click',e=>{F60.run=!F60.run;e.target.textContent=F60.run?'⏸ Pause':'▶ Run';e.target.classList.toggle('active',F60.run);});
$('d60rst').addEventListener('click',()=>{F60.t=0;});
const PIN60={4:7,5:5,6:4,7:6,8:14,9:13,10:15,12:1,13:2,14:3};
const fmtHz=f=>f>=1000?(f/1000).toFixed(f>=10000?1:2).replace(/\.?0+$/,'')+' kHz':(+f.toFixed(1))+' Hz';
function draw4060(dt){const c=$('c4060');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  if(F60.run)F60.t+=dt;const t=F60.t;
  // quartz
  const wob=F60.run?Math.sin(performance.now()/18)*2:0;ctx.fillStyle=PAL.ink2;ctx.beginPath();ctx.roundRect(30+wob,40,46,22,11);ctx.fill();W(ctx,[[44,62],[44,80]],PAL.ink2,2);W(ctx,[[62,62],[62,80]],PAL.ink2,2);
  txt(ctx,'quartz',53,32,PAL.ink,12,'center');txt(ctx,'32 768 Hz',53,98,PAL.yellow,12);
  W(ctx,[[84,74],[126,74]],PAL.yellow,2);ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.moveTo(132,74);ctx.lineTo(124,69);ctx.lineTo(124,79);ctx.fill();
  txt(ctx,'time: '+t.toFixed(2)+' s',53,130,PAL.muted,12);txt(ctx,'Q14 rises every',53,160,PAL.muted2,11);txt(ctx,'0.5 s exactly',53,176,PAL.muted2,11);
  for(let n=1;n<=14;n++){const col=(n-1)%7,row=Math.floor((n-1)/7),x=170+col*88,y=60+row*130,f=32768/Math.pow(2,n),pin=PIN60[n];
    const on=Math.floor(t*32768/Math.pow(2,n-1))%2===1,blur=f>12;
    ctx.fillStyle=PAL.panel;ctx.strokeStyle=pin?PAL.amber:PAL.slateDark;ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(x-36,y-30,72,104,8);ctx.fill();ctx.stroke();
    txt(ctx,'Q'+n,x,y-12,pin?PAL.ink:PAL.muted2,13,'center');
    if(pin)lamp(ctx,x,y+14,t===0?0:(blur?0.5:(on?1:0)),'245,158,11',10);else{ctx.fillStyle=PAL.raised;ctx.beginPath();ctx.arc(x,y+14,10,0,7);ctx.fill();}
    txt(ctx,fmtHz(f),x,y+46,pin?PAL.yellow:PAL.slate,11);txt(ctx,pin?'pin '+pin:'no pin',x,y+62,pin?PAL.muted:PAL.slate,10);
    if(col<6)W(ctx,[[x+36,y+14],[x+52,y+14]],PAL.slate,1.5);}
  W(ctx,[[734,74],[752,74],[752,142],[118,142],[118,204],[134,204]],PAL.slate,1.5);
  txt(ctx,'each stage divides by 2 →',460,18,PAL.muted2,11);
  txt(ctx,blurNote(),480,290,PAL.muted,11);}
function blurNote(){return 'Above ~12 Hz the blinking is too fast for your eyes: those LEDs look half lit.';}

// ---------- quartz resonance ----------
function drawXtal(){const c=$('cXtal');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const f=+$('xtF').value,f0=32768,Q=60000,A=f=>1/Math.sqrt(1+Math.pow(2*Q*(f-f0)/f0,2)),a=A(f);
  $('xtFt').textContent=f.toLocaleString('en-US',{minimumFractionDigits:2})+' Hz';
  // tuning fork
  const ph=Math.sin(performance.now()/40)*a*14,cx=140;ctx.fillStyle=PAL.ink2;
  ctx.beginPath();ctx.moveTo(cx-30-ph,40);ctx.lineTo(cx-16-ph,40);ctx.lineTo(cx-12,170);ctx.lineTo(cx-26,170);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(cx+30+ph,40);ctx.lineTo(cx+16+ph,40);ctx.lineTo(cx+12,170);ctx.lineTo(cx+26,170);ctx.closePath();ctx.fill();
  ctx.fillRect(cx-26,170,52,16);ctx.fillRect(cx-6,186,12,30);
  txt(ctx,'the quartz fork inside',cx,236,PAL.muted,11);txt(ctx,'amplitude '+Math.round(a*100)+' %',cx,254,a>0.5?PAL.good:PAL.yellow,13,'center');
  // curve
  const x0=300,x1=770,y0=210,y1=62,fx=v=>x0+(v-32740)/(56)*(x1-x0),ay=v=>y0-(y0-y1)*v;
  W(ctx,[[x0,y0],[x1,y0]],PAL.slateDark,1.5);W(ctx,[[x0,y0],[x0,y1]],PAL.slateDark,1.5);
  ctx.strokeStyle=PAL.amber;ctx.lineWidth=2.5;ctx.beginPath();for(let px=0;px<=x1-x0;px++){const v=32740+px/(x1-x0)*56,yy=ay(A(v));px?ctx.lineTo(x0+px,yy):ctx.moveTo(x0+px,yy);}ctx.stroke();
  ctx.fillStyle=PAL.sky;ctx.beginPath();ctx.arc(fx(f),ay(a),7,0,7);ctx.fill();W(ctx,[[fx(f),y0],[fx(f),ay(a)]],PAL.sky,1.5);
  [32740,32754,32768,32782,32796].forEach(v=>txt(ctx,v.toLocaleString('en-US'),fx(v),y0+18,PAL.muted2,10));
  txt(ctx,'how much the quartz responds',x0+6,y1-8,PAL.muted,11,'left');txt(ctx,'push frequency (Hz)',x1,y0+36,PAL.muted,11,'right');
  const off=Math.abs(f-f0),pc=(off/f0*100).toFixed(4);
  txt(ctx,a>0.9?'Right on 32,768 Hz: it rings at full strength.':a>0.3?`Off by ${off.toFixed(2)} Hz (${pc} %): already much weaker.`:`Off by ${off.toFixed(2)} Hz (${pc} %): it barely moves.`,(x0+x1)/2,24,a>0.9?PAL.good:PAL.yellow,13,'center');}

// ---------- L293D ----------
const HB={mode:'F',spd:0,ang:0,t:0};
[['hbF','F'],['hbR','R'],['hbB','B'],['hbC','C']].forEach(([id,m])=>$(id).addEventListener('click',()=>{HB.mode=m;['hbF','hbR','hbB','hbC'].forEach(k=>$(k).classList.toggle('active',k===id));}));
$('hbF').classList.add('active');
function draw293(dt){const c=$('c293');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  HB.t+=dt;const duty=+$('hbS').value/100,m=HB.mode,pwmOn=(HB.t*4%1)<duty||duty>=1;
  const drive=m==='F'?1:m==='R'?-1:0,target=drive*duty;
  HB.spd+=(target-HB.spd)*Math.min(1,dt*(m==='B'?9:m==='C'?0.8:3));HB.ang+=HB.spd*dt*12;
  const on=pwmOn&&(m==='F'||m==='R');
  // switches: s1 TL, s2 BL, s3 TR, s4 BR
  const S={tl:m==='F'&&on,bl:m==='R'||m==='B',tr:m==='R'&&on,br:m==='F'||m==='B'};
  const T0=50,B0=260,Lx=200,Rx=480,My=155;
  W(ctx,[[Lx,T0],[Rx,T0]],PAL.bad);W(ctx,[[Lx,B0],[Rx,B0]],PAL.blue);txt(ctx,'VCC2 (+9 V)',340,T0-10,PAL.redSoft,12);txt(ctx,'GND',340,B0+22,PAL.blue,12);
  part(ctx,'switch',Lx,T0,Lx,My,{closed:S.tl,col:S.tl?PAL.good:PAL.muted});part(ctx,'switch',Lx,My,Lx,B0,{closed:S.bl,col:S.bl?PAL.good:PAL.muted});
  part(ctx,'switch',Rx,T0,Rx,My,{closed:S.tr,col:S.tr?PAL.good:PAL.muted});part(ctx,'switch',Rx,My,Rx,B0,{closed:S.br,col:S.br?PAL.good:PAL.muted});
  txt(ctx,'1Y (pin 3)',Lx-12,My+4,PAL.ink,12,'right');txt(ctx,'2Y (pin 6)',Rx+12,My+4,PAL.ink,12,'left');
  W(ctx,[[Lx,My],[310,My]]);W(ctx,[[370,My],[Rx,My]]);
  ctx.fillStyle=PAL.canvas;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=3;ctx.beginPath();ctx.arc(340,My,30,0,7);ctx.fill();ctx.stroke();
  ctx.save();ctx.translate(340,My);ctx.rotate(HB.ang);ctx.strokeStyle=PAL.blue;ctx.lineWidth=3;for(let i=0;i<3;i++){ctx.rotate(2.094);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(22,0);ctx.stroke();}ctx.restore();txt(ctx,'M',340,My+5,PAL.ink,14,'center');
  // current path dots
  const flow=m==='F'&&on?[[Lx,T0+4],[Lx,My],[Rx,My],[Rx,B0-4]]:m==='R'&&on?[[Rx,T0+4],[Rx,My],[Lx,My],[Lx,B0-4]]:null;
  if(flow){ctx.strokeStyle=PAL.yellow;ctx.lineWidth=7;ctx.lineCap='round';ctx.setLineDash([0,20]);ctx.lineDashOffset=-performance.now()/15;ctx.beginPath();flow.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.setLineDash([]);ctx.lineCap='butt';}
  // LEDs like project 24
  lamp(ctx,560,120,m==='F'&&on?1:0,'239,68,68',9);txt(ctx,'red: forward',576,124,PAL.muted,11,'left');lamp(ctx,560,160,m==='R'&&on?1:0,'34,197,94',9);txt(ctx,'green: reverse',576,164,PAL.muted,11,'left');
  // status
  const msg={F:'Forward: top-left + bottom-right closed, current flows left → right',R:'Reverse: top-right + bottom-left closed, current flows right → left',B:'Brake: both bottom switches closed, the motor is shorted and stops fast',C:'Coast: all switches open, the motor spins down by itself'}[m];
  txt(ctx,msg,400,22,PAL.ink,13,'center');
  const rpm=Math.round(Math.abs(HB.spd)*9200*0.7);txt(ctx,(HB.spd>=0?'↻ ':'↺ ')+rpm+' rpm',340,My+56,PAL.yellow,13,'center');
  // PWM trace
  if(m==='F'||m==='R'){const x0=560,w=200,y=240;txt(ctx,'EN (PWM '+Math.round(duty*100)+' %)',x0,y-30,PAL.muted,11,'left');ctx.strokeStyle=PAL.yellow;ctx.lineWidth=2;ctx.beginPath();
    for(let i=0;i<=w;i++){const ph=((i/w)*4+HB.t*4)%1,v=duty>=1||ph<duty?1:0,yy=y-v*18;i?ctx.lineTo(x0+i,yy):ctx.moveTo(x0+i,yy);}ctx.stroke();}
  txt(ctx,'(switches drawn as simple contacts; the chip uses transistors)',40,292,PAL.muted2,10,'left');}

loop((dt,now)=>{const t=now/1000;draw339(t);draw4013(dt);draw4060(dt);drawXtal();draw293(dt);});
})();

})();
