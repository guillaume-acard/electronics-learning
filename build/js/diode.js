
// ================= diode =================
(function(){
const PG=document.getElementById('page-diode');
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


// ===== Diode drawing helpers =====
function diodeSym(ctx,x,y,ang,col=PAL.ink2,s=12,fill=PAL.canvas){ctx.save();ctx.translate(x,y);ctx.rotate(ang);
  ctx.fillStyle=fill;ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-s,-s);ctx.lineTo(s,0);ctx.lineTo(-s,s);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(s,-s);ctx.lineTo(s,s);ctx.stroke();ctx.restore();}
function diodeI(V){if(V<=0)return 0;return 100*Math.exp((V-0.75)/0.04);} // mA

// ===== 3. Check valve + IV curve =====
const DV2={off:0};
function drawValve(dt){const c=$('cValve'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const V=+$('dV').value;$('dVt').textContent=V.toFixed(2)+' V';
  const I=diodeI(V), Ishow=Math.min(I,200), open=V>0?Math.max(0,Math.min(1,(V-0.5)/0.3)):0;
  DV2.off-=Ishow*dt*3;
  const y=150,x0=30,x1=420,vx=230;
  ctx.strokeStyle=PAL.waterLight;ctx.lineWidth=30;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();
  if(Ishow>0.5){ctx.strokeStyle=PAL.water;ctx.lineWidth=6;ctx.setLineDash([16,14]);ctx.lineDashOffset=DV2.off;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();ctx.setLineDash([]);}
  // valve housing
  ctx.fillStyle=PAL.muted2;ctx.fillRect(vx-40,y-45,80,12);ctx.fillRect(vx-40,y+33,80,12);
  ctx.fillStyle=PAL.muted;ctx.fillRect(vx-6,y+15,8,18); // seat
  // flap hinged at top
  const ang=open*1.1;ctx.save();ctx.translate(vx,y-33);ctx.rotate(-ang);ctx.fillStyle=V<0?PAL.redSoft:open>0?PAL.good:PAL.yellow;ctx.fillRect(-4,0,8,52);ctx.restore();
  ctx.fillStyle=PAL.ink;ctx.beginPath();ctx.arc(vx,y-33,5,0,7);ctx.fill();
  // spring
  ctx.strokeStyle=PAL.ink2;ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<=10;i++){const xx=vx+8+i*3.5,yy=y-30+(i%2?6:-6)+ (open*14);ctx.lineTo(xx,yy);}ctx.stroke();
  // push arrow
  if(Math.abs(V)>0.02){const L=Math.min(110,Math.abs(V)*60+20),dir=V>0?1:-1,ax=V>0?60:400;ctx.strokeStyle=PAL.yellow;ctx.fillStyle=PAL.yellow;ctx.lineWidth=5;
    ctx.beginPath();ctx.moveTo(ax,y-70);ctx.lineTo(ax+dir*L,y-70);ctx.stroke();ctx.beginPath();ctx.moveTo(ax+dir*(L+10),y-70);ctx.lineTo(ax+dir*L,y-78);ctx.lineTo(ax+dir*L,y-62);ctx.fill();
    arrowText(ctx,V>0?'forward push':'backward push',ax+dir*L/2,y-84,PAL.yellow,12);}
  arrowText(ctx,'anode (+) side',80,y+66,PAL.muted,12);arrowText(ctx,'cathode (−) side',370,y+66,PAL.muted,12);
  diodeSym(ctx,vx,y+90,0,PAL.ink,10);
  let msg,col;
  if(V<0){msg='Backward: flap sealed, no flow';col=PAL.redSoft;}
  else if(I<1){msg='Forward but under ~0.6 V: spring keeps it shut';col=PAL.yellow;}
  else if(I<=200){msg='Open: '+I.toFixed(I<10?1:0)+' mA flowing';col=PAL.good;}
  else {msg='⚠ Wide open: current is huge (a resistor must limit it!)';col=PAL.bad;}
  arrowText(ctx,msg,225,y+128,col,14);
  // IV curve
  const gx=470,gy=30,gw=310,gh=210,X=v=>gx+(v+3)/4.2*gw,Y=i=>gy+gh-Math.min(i,200)/200*gh;
  ctx.fillStyle=PAL.raised;ctx.fillRect(gx,gy,gw,gh);
  ctx.strokeStyle=PAL.slate;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(X(0),gy);ctx.lineTo(X(0),gy+gh);ctx.stroke();
  ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(X(0.7),gy);ctx.lineTo(X(0.7),gy+gh);ctx.stroke();ctx.setLineDash([]);
  arrowText(ctx,'0.7 V',X(0.7),gy+gh+14,PAL.muted,11);arrowText(ctx,'0 V',X(0),gy+gh+14,PAL.muted,11);arrowText(ctx,'−3 V',gx,gy+gh+14,PAL.muted,11);
  arrowText(ctx,'current',gx+4,gy-8,PAL.muted,11,'left');arrowText(ctx,'voltage →',gx+gw,gy+gh+28,PAL.muted,11,'right');
  ctx.strokeStyle=PAL.blue;ctx.lineWidth=2.5;ctx.beginPath();for(let v=-3;v<=1.2;v+=0.005){const xx=X(v),yy=Y(diodeI(v));v===-3?ctx.moveTo(xx,yy):ctx.lineTo(xx,yy);}ctx.stroke();
  ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.arc(X(V),Y(I),6,0,7);ctx.fill();
  arrowText(ctx,'blocked',X(-1.5),Y(0)-10,PAL.redSoft,12);arrowText(ctx,'conducts',X(0.95),gy+16,PAL.good,12);
}

// ===== 4A. Reverse protection =====
const RP={flip:false,diode:0,fried:false,smoke:[]};
choices('rpChoices',['No diode','With protection diode'],0,i=>RP.diode=i);
$('rpFlip').onclick=()=>RP.flip=!RP.flip;$('rpNew').onclick=()=>{RP.fried=false;RP.smoke=[];};
function drawRP(dt){const c=$('cRP'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=50,B=190,bx=150;
  // battery (draw flipped)
  W(ctx,[[bx,T],[bx,(T+B)/2-8]],PAL.ink2);W(ctx,[[bx,(T+B)/2+8],[bx,B]],PAL.ink2);
  const m=(T+B)/2;ctx.fillStyle=PAL.ink2;if(!RP.flip){ctx.fillRect(bx-18,m-8,36,4);ctx.fillRect(bx-10,m+4,20,6);arrowText(ctx,'+',bx+24,m-6,PAL.redSoft,15);}
  else{ctx.fillRect(bx-10,m-8,20,6);ctx.fillRect(bx-18,m+4,36,4);arrowText(ctx,'+',bx+24,m+14,PAL.redSoft,15);}
  arrowText(ctx,RP.flip?'battery BACKWARDS':'battery OK',bx-26,m+4,RP.flip?PAL.redSoft:PAL.muted,12,'right');
  W(ctx,[[bx,T],[220,T]],PAL.ink2);
  if(RP.diode){diodeSym(ctx,240,T,0,PAL.ink);arrowText(ctx,'diode',240,T-20,PAL.ink,12);}else W(ctx,[[220,T],[260,T]],PAL.ink2);
  W(ctx,[[260,T],[380,T],[380,80]],PAL.ink2);W(ctx,[[380,160],[380,B],[bx,B]],PAL.ink2);
  // device
  const blocked=RP.flip&&RP.diode;
  if(RP.flip&&!RP.diode)RP.fried=true;
  ctx.fillStyle=RP.fried?'#1c1917':PAL.slate;ctx.fillRect(330,80,100,80);
  arrowText(ctx,'electronics',380,112,RP.fried?PAL.redSoft:PAL.white,13);
  let st,col;
  if(RP.fried){st='FRIED 💀';col=PAL.bad;if(Math.random()<dt*10)RP.smoke.push({x:380+(Math.random()-.5)*60,y:80,r:5,a:1});}
  else if(blocked){st='off, but safe';col=PAL.yellow;}else{st='working ✓';col='#4ade80';}
  arrowText(ctx,st,380,138,col,14);
  RP.smoke.forEach(s=>{s.y-=dt*25;s.r+=dt*12;s.a-=dt*0.5;ctx.fillStyle=`rgba(148,163,184,${0.5*Math.max(0,s.a)})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.fill();});RP.smoke=RP.smoke.filter(s=>s.a>0);
  let msg;
  if(RP.fried)msg='Reversed with no protection: current flowed the wrong way through the chips. Press Repair.';
  else if(blocked)msg='Reversed: the diode is a closed valve, so nothing flows. The circuit is protected.';
  else if(RP.diode)msg='Correct way: the diode is open. The circuit gets 9 V − 0.7 V = 8.3 V.';
  else msg='Correct way: works fine, but nothing protects it if the battery is reversed.';
  wrapText(ctx,msg,470,m-14,310,19,PAL.ink,13);
  // wrap text manually: shorten
}

// ===== 4B. Rectifier =====
const RCt={full:0,t:0,h:[]};
choices('rcChoices',['1 diode (half-wave)','4-diode bridge (full-wave)'],0,i=>{RCt.full=i;});
function drawRect(dt){RCt.t+=dt;const vin=Math.sin(2*Math.PI*0.8*RCt.t);const out=RCt.full?Math.max(0,Math.abs(vin)-0.07):Math.max(0,vin-0.07);
  RCt.h.push({t:RCt.t,vin,out});prune(RCt.h,RCt.t,4);
  const c=$('cRect'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  if(!RCt.full){W(ctx,[[40,120],[110,120]],PAL.ink2);diodeSym(ctx,130,120,0,PAL.ink,14);W(ctx,[[144,120],[220,120]],PAL.ink2);arrowText(ctx,'AC in',40,105,PAL.muted,12,'left');arrowText(ctx,'DC out',220,105,PAL.muted,12,'right');}
  else{const cx=130,cy=120,r=55;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy-r);ctx.lineTo(cx+r,cy);ctx.lineTo(cx,cy+r);ctx.lineTo(cx-r,cy);ctx.closePath();ctx.stroke();
    // diodes pointing toward right corner (+) from top/bottom, and from left corner (-) to top/bottom
    [[cx+r/2,cy-r/2,Math.PI/4],[cx+r/2,cy+r/2,-Math.PI/4],[cx-r/2,cy-r/2,-Math.PI/4],[cx-r/2,cy+r/2,Math.PI/4]].forEach(([x,y,a])=>diodeSym(ctx,x,y,a,PAL.ink,8));
    W(ctx,[[cx,cy-r],[cx,cy-r-20],[30,cy-r-20]],PAL.ink2);W(ctx,[[cx,cy+r],[cx,cy+r+20],[30,cy+r+20]],PAL.ink2);arrowText(ctx,'AC in',30,cy-r-28,PAL.muted,12,'left');
    W(ctx,[[cx+r,cy],[240,cy]],PAL.ink2);arrowText(ctx,'+ DC',240,cy-8,PAL.redSoft,12,'right');W(ctx,[[cx-r,cy],[cx-r-14,cy]],PAL.ink2);arrowText(ctx,'−',cx-r-20,cy+4,PAL.blue,14);}
  plot(ctx,290,30,490,170,RCt.h,RCt.t,4,[{k:'vin',col:PAL.muted,dash:[5,4],lw:2,label:'AC in'},{k:'out',col:PAL.good,label:'output'}],-1.1,1.1,'');
  arrowText(ctx,RCt.full?'Both halves used: the backward half is flipped forward':'Only the forward half passes, and the backward half is wasted',535,245,RCt.full?PAL.good:PAL.yellow,13);}

// ===== 4C. Flyback =====
const FB={on:false,diode:0,IL:0,t:0,spike:0,h:[],ang:0,sparks:0};
choices('fbChoices',['No diode','With flyback diode'],0,i=>FB.diode=i);
const fbb=$('fbSw');fbb.style.touchAction='none';fbb.style.userSelect='none';
fbb.addEventListener('pointerdown',e=>{e.preventDefault();FB.on=true;});
['pointerup','pointerleave','pointercancel'].forEach(ev=>fbb.addEventListener(ev,()=>{if(FB.on){FB.on=false;if(!FB.diode){FB.spike=FB.IL*300;FB.IL=0;FB.sparks=0.4;}}}));
function drawFly(dt){FB.t+=dt;
  if(FB.on)FB.IL+=(1-FB.IL)*dt/0.3;else if(FB.diode)FB.IL+=(0-FB.IL)*dt/0.35;else FB.IL=0;
  FB.spike*=Math.exp(-dt/0.04);FB.sparks=Math.max(0,FB.sparks-dt);FB.ang+=FB.IL*dt*14;
  const Vsw=FB.on?0:12+(FB.diode?(FB.IL>0.02?0.7:0):FB.spike);
  FB.h.push({t:FB.t,v:Vsw,max:60});prune(FB.h,FB.t,4);
  const c=$('cFly'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=40,B=210,x=220;batt(ctx,60,T,B,'12V');W(ctx,[[60,T],[x,T],[x,75]],PAL.ink2);
  ctx.strokeStyle=PAL.ink2;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,105,28,0,7);ctx.stroke();arrowText(ctx,'M',x,111,PAL.ink,18);
  ctx.save();ctx.translate(x,105);ctx.rotate(FB.ang);ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.rotate(2.09);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(18,0);ctx.stroke();}ctx.restore();
  W(ctx,[[x,133],[x,150]],PAL.ink2);
  if(FB.diode){W(ctx,[[x,T+15],[x+60,T+15],[x+60,92]],PAL.ink2);diodeSym(ctx,x+60,105,-Math.PI/2,PAL.good,10);W(ctx,[[x+60,118],[x+60,142],[x,142]],PAL.ink2);arrowText(ctx,'flyback diode',x+74,109,PAL.good,12,'left');}
  // switch
  dot(ctx,x,150);dot(ctx,x,180);if(FB.on)W(ctx,[[x+5,150],[x+5,180]],PAL.good,4);else W(ctx,[[x+5,150],[x+24,174]],PAL.ink2,4);
  W(ctx,[[x,180],[x,B],[60,B]],PAL.ink2);arrowText(ctx,'switch',x-12,170,PAL.muted,12,'right');
  if(FB.sparks>0){ctx.strokeStyle=PAL.highlight;ctx.lineWidth=2;for(let i=0;i<6;i++){const a=Math.random()*6.28,r=10+Math.random()*16;ctx.beginPath();ctx.moveTo(x+10,165);ctx.lineTo(x+10+r*Math.cos(a),165+r*Math.sin(a));ctx.stroke();}arrowText(ctx,'⚡ SPARK',x+40,200,PAL.highlight,14,'left');}
  plot(ctx,420,30,360,170,FB.h,FB.t,4,[{k:'v',col:PAL.redSoft,label:'voltage across the switch'}],0,60,'');
  const peak=Math.max(...FB.h.map(p=>p.v));
  arrowText(ctx,peak>60?'spike ≈ '+Math.round(peak)+' V, off the chart! Kills transistors':'max '+peak.toFixed(1)+' V: safe ✓',600,240,peak>60?PAL.bad:PAL.good,13);}

// ===== 4D. Clipping =====
const CL={t:0,h:[]};
function drawClip(dt){CL.t+=dt;const A=+$('clA').value;const vin=A*(Math.sin(2*Math.PI*0.7*CL.t)+0.25*Math.sin(2*Math.PI*2.1*CL.t));const out=0.75*Math.tanh(vin/0.75);
  CL.h.push({t:CL.t,vin,out,p:0.7,n:-0.7});prune(CL.h,CL.t,4);
  const c=$('cClip'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  // schematic
  const y=80;arrowText(ctx,'🎸',30,y+6,PAL.white,22);W(ctx,[[50,y],[80,y]],PAL.ink2);ctx.fillStyle=PAL.canvas;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=3;ctx.fillRect(80,y-10,50,20);ctx.strokeRect(80,y-10,50,20);
  W(ctx,[[130,y],[250,y]],PAL.ink2);dot(ctx,170,y);dot(ctx,210,y);
  W(ctx,[[170,y],[170,y+28]],PAL.ink2);diodeSym(ctx,170,y+40,Math.PI/2,PAL.ink,10);W(ctx,[[170,y+52],[170,y+80]],PAL.ink2);
  W(ctx,[[210,y],[210,y+28]],PAL.ink2);diodeSym(ctx,210,y+40,-Math.PI/2,PAL.ink,10);W(ctx,[[210,y+52],[210,y+80]],PAL.ink2);
  W(ctx,[[160,y+80],[220,y+80]],PAL.ink2);gndSym(ctx,190,y+80);arrowText(ctx,'out →',255,y+4,PAL.good,12,'left');
  arrowText(ctx,'two diodes, opposite ways',190,y+120,PAL.muted,12);
  plot(ctx,330,25,450,180,CL.h,CL.t,4,[{k:'vin',col:PAL.muted,dash:[5,4],lw:2,label:'guitar in'},{k:'out',col:PAL.good,label:'after diodes'},{k:'p',col:PAL.amber,dash:[3,4],lw:1,label:'±0.7 V'},{k:'n',col:PAL.amber,dash:[3,4],lw:1}],-3.4,3.4,'');
  arrowText(ctx,A<0.6?'Soft playing: passes clean':'Hard playing: tops sliced off, so you hear overdrive',555,240,A<0.6?PAL.good:PAL.yellow,13);}

// ===== Symbol =====
(function(){const c=$('cSymD'),ctx=c.getContext('2d');W(ctx,[[60,50],[170,50]],PAL.ink);diodeSym(ctx,190,50,0,PAL.ink,16);W(ctx,[[206,50],[320,50]],PAL.ink);
  arrowText(ctx,'anode (+)',90,35,PAL.redSoft,12);arrowText(ctx,'cathode (−)',290,35,PAL.blue,12);arrowText(ctx,'current →',190,85,PAL.yellow,12);
  W(ctx,[[60,140],[140,140]],PAL.ink2,3);W(ctx,[[250,140],[320,140]],PAL.ink2,3);ctx.fillStyle=PAL.chip;ctx.beginPath();ctx.roundRect(140,124,110,32,6);ctx.fill();
  ctx.fillStyle='#d1d5db';ctx.fillRect(228,124,12,32);arrowText(ctx,'stripe = cathode',234,178,PAL.muted,12);})();

loop((dt,now)=>{drawValve(dt);drawRP(dt);drawRect(dt);drawFly(dt);drawClip(dt);});


})();
