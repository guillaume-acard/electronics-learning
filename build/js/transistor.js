
// ================= transistor =================
(function(){
const PG=document.getElementById('page-transistor');
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


// ===== NPN symbol =====
function npn(ctx,x,y,on,label){const col=on?PAL.good:PAL.ink2;ctx.strokeStyle=col;ctx.lineWidth=2.5;
  ctx.beginPath();ctx.arc(x,y,24,0,7);ctx.stroke();
  W(ctx,[[x-34,y],[x-8,y]],col);W(ctx,[[x-8,y-14],[x-8,y+14]],col,4);
  W(ctx,[[x-8,y-6],[x+10,y-18],[x+10,y-34]],col);W(ctx,[[x-8,y+6],[x+10,y+18],[x+10,y+34]],col);
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x+10,y+18);ctx.lineTo(x,y+17);ctx.lineTo(x+5,y+9);ctx.fill();
  if(label)arrowText(ctx,label,x+30,y+5,on?PAL.good:PAL.muted,12,'left');}
function resBox(ctx,x,y,w,h,txt){ctx.fillStyle=PAL.canvas;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=3;ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);if(txt)arrowText(ctx,txt,w>h?x+w/2:x+w+6,w>h?y-6:y+h/2+4,PAL.ink,11,w>h?'center':'left');}

// ===== 3. Water valve =====
const TV={o1:0,o2:0};const BETA=100,ICMAX=10; // mA
function drawTV(dt){const Ib=+$('tIb').value;$('tIbt').textContent=Ib+' µA';
  const Ic=Math.min(BETA*Ib/1000,ICMAX),sat=BETA*Ib/1000>=ICMAX,open=Ic/ICMAX;
  TV.o1-=Ib*dt*1.2;TV.o2-=Ic*dt*30;
  const c=$('cTV'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const y=200,gx=300;
  // main pipe
  ctx.strokeStyle=PAL.waterLight;ctx.lineWidth=44;ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(500,y);ctx.stroke();
  if(Ic>0.05){ctx.strokeStyle=PAL.water;ctx.lineWidth=8;ctx.setLineDash([18,14]);ctx.lineDashOffset=TV.o2;ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(500,y);ctx.stroke();ctx.setLineDash([]);}
  // gate housing + gate
  ctx.fillStyle=PAL.slate;ctx.fillRect(gx-16,y-110,32,84);
  const gy=y-22-open*40;ctx.fillStyle=PAL.muted;ctx.fillRect(gx-10,gy,20,44);
  // base pipe (small) from top-left into piston
  ctx.strokeStyle='#fde68a';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(gx-120,30);ctx.lineTo(gx-120,y-130);ctx.lineTo(gx-16,y-130);ctx.stroke();
  if(Ib>0){ctx.strokeStyle=PAL.amber;ctx.lineWidth=3;ctx.setLineDash([8,8]);ctx.lineDashOffset=TV.o1;ctx.beginPath();ctx.moveTo(gx-120,30);ctx.lineTo(gx-120,y-130);ctx.lineTo(gx-16,y-130);ctx.stroke();ctx.setLineDash([]);}
  // piston rod linking to gate
  ctx.strokeStyle=PAL.ink;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(gx,y-110);ctx.lineTo(gx,gy);ctx.stroke();
  arrowText(ctx,'BASE (small flow)',gx-120,22,PAL.amber,13);
  arrowText(ctx,'COLLECTOR',60,y-34,PAL.muted,12);arrowText(ctx,'EMITTER',460,y-34,PAL.muted,12);
  arrowText(ctx,'big gate',gx+24,y-80,PAL.muted,12,'left');
  const mode=Ib===0?['OFF (cutoff)',PAL.muted]:sat?['FULLY ON (saturated): switch closed',PAL.good]:['AMPLIFYING (active)',PAL.blue];
  arrowText(ctx,mode[0],260,y+56,mode[1],16);
  arrowText(ctx,'base '+Ib+' µA  →  main '+Ic.toFixed(1)+' mA'+(sat?' (max: limited by the load)':'  (×'+BETA+')'),260,y+80,PAL.ink,13);
  // graph Ic vs Ib
  const px=550,py=40,pw=230,ph=210,X=v=>px+v/150*pw,Y=v=>py+ph-v/12*ph;
  ctx.fillStyle=PAL.raised;ctx.fillRect(px,py,pw,ph);
  ctx.fillStyle='rgba(16,185,129,0.12)';ctx.fillRect(X(100),py,pw-(X(100)-px),ph);
  ctx.strokeStyle=PAL.blue;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(X(0),Y(0));ctx.lineTo(X(100),Y(10));ctx.lineTo(X(150),Y(10));ctx.stroke();
  ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.arc(X(Ib),Y(Ic),6,0,7);ctx.fill();
  arrowText(ctx,'amplifying',X(45),Y(6.5),PAL.blue,11);arrowText(ctx,'saturated',X(125),Y(10)-10,PAL.good,11);
  arrowText(ctx,'main current',px,py-8,PAL.muted,11,'left');arrowText(ctx,'base current →',px+pw,py+ph+16,PAL.muted,11,'right');}

// ===== 4A. Switch a motor (full circuit) =====
const SW={pin:false,via:1,ang:0,heat:0,off:0};
choices('swChoices',['Pin drives motor directly','Through a transistor'],1,i=>SW.via=i);
$('swPin').onclick=()=>{SW.pin=!SW.pin;$('swPin').textContent='Pin: '+(SW.pin?'HIGH (5 V)':'LOW (0 V)');$('swPin').className=SW.pin?'active':'';};
function flowDots(ctx,pts,off,col=PAL.yellow){ctx.strokeStyle=col;ctx.lineWidth=6;ctx.lineCap='round';ctx.setLineDash([0,18]);ctx.lineDashOffset=-off;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.setLineDash([]);ctx.lineCap='butt';}
function drawSw(dt){const c=$('cSw'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  let speed=0,pinI=0;if(SW.pin){if(SW.via){speed=1;pinI=4.3;}else{speed=0.08;pinI=40;}}
  SW.heat+=((pinI>20?1:0)-SW.heat)*dt*1.5;SW.ang+=speed*dt*15;SW.off+=speed*dt*60;
  const G=275,T5=40,T9=30,cx=110,cy=95,cw=110,ch=110,pinY=150;
  // ground rail
  W(ctx,[[50,G],[720,G]],PAL.blue);arrowText(ctx,'common ground (0 V): shared by BOTH batteries and the chip',385,G+22,PAL.blue,12);
  // 5 V supply for the micro
  batt(ctx,50,T5+20,G,'5V');W(ctx,[[50,T5+20],[50,T5],[cx+cw/2,T5],[cx+cw/2,cy]],PAL.redSoft);arrowText(ctx,'5 V supply (USB)',58,T5-8,PAL.redSoft,11,'left');
  // micro box
  ctx.fillStyle=SW.heat>0.3?`rgb(${Math.round(71+160*SW.heat)},60,60)`:PAL.slate;ctx.fillRect(cx,cy,cw,ch);
  arrowText(ctx,'micro-',cx+cw/2,cy+46,PAL.white,13);arrowText(ctx,'controller',cx+cw/2,cy+64,PAL.white,13);
  arrowText(ctx,'VCC',cx+cw/2,cy+14,PAL.redLight,10);arrowText(ctx,'GND',cx+cw/2,cy+ch-6,PAL.link,10);arrowText(ctx,'pin',cx+cw-4,pinY-6,PAL.yellow,10,'right');
  W(ctx,[[cx+cw/2,cy+ch],[cx+cw/2,G]],PAL.blue);dot(ctx,cx+cw/2,G);dot(ctx,50,G);
  const mx=480,my=95,bx=700;
  if(SW.via){
    W(ctx,[[cx+cw,pinY],[255,pinY]],SW.pin?PAL.yellow:PAL.ink2);resBox(ctx,255,pinY-10,70,20,'1 kΩ base resistor');W(ctx,[[325,pinY],[mx-44,pinY]],SW.pin?PAL.yellow:PAL.ink2);
    npn(ctx,mx-10,pinY,SW.pin,'NPN');
    // collector to motor, motor to +9V
    W(ctx,[[mx,pinY-34],[mx,my+24]],PAL.ink2);
    ctx.strokeStyle=PAL.ink2;ctx.lineWidth=3;ctx.beginPath();ctx.arc(mx,my,24,0,7);ctx.stroke();arrowText(ctx,'M',mx,my+6,PAL.ink,16);
    ctx.save();ctx.translate(mx,my);ctx.rotate(SW.ang);ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.rotate(2.09);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(16,0);ctx.stroke();}ctx.restore();
    W(ctx,[[mx,my-24],[mx,T9],[bx,T9]],PAL.redSoft);arrowText(ctx,'+9 V',bx-6,T9-8,PAL.redSoft,11,'right');
    // flyback diode beside motor (cathode to +9V)
    W(ctx,[[mx,T9+12],[mx+55,T9+12],[mx+55,my-12]],PAL.muted,2);
    ctx.fillStyle=PAL.canvas;ctx.strokeStyle=PAL.muted;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mx+45,my+8);ctx.lineTo(mx+65,my+8);ctx.lineTo(mx+55,my-10);ctx.closePath();ctx.fill();ctx.stroke();W(ctx,[[mx+45,my-12],[mx+65,my-12]],PAL.muted,2);
    W(ctx,[[mx+55,my+8],[mx+55,my+38],[mx,my+38]],PAL.muted,2);arrowText(ctx,'flyback diode',mx+70,my+2,PAL.muted,11,'left');
    // emitter to ground
    W(ctx,[[mx,pinY+34],[mx,G]],PAL.ink2);dot(ctx,mx,G);
    // 9 V battery
    batt(ctx,bx,T9,G,'9V');dot(ctx,bx,G);
    if(SW.pin){flowDots(ctx,[[bx,G-20],[bx,T9],[mx,T9],[mx,G],[bx,G]],SW.off);}
    arrowText(ctx,'pin gives '+(SW.pin?'4.3':'0')+' mA',255,pinY+34,PAL.yellow,12,'left');
    arrowText(ctx,'motor gets '+(SW.pin?'~500':'0')+' mA from the 9 V battery',255,pinY+54,PAL.blue,12,'left');
  } else {
    W(ctx,[[cx+cw,pinY],[mx,pinY],[mx,my+24]],SW.pin?PAL.yellow:PAL.ink2);
    ctx.strokeStyle=PAL.ink2;ctx.lineWidth=3;ctx.beginPath();ctx.arc(mx,my,24,0,7);ctx.stroke();arrowText(ctx,'M',mx,my+6,PAL.ink,16);
    ctx.save();ctx.translate(mx,my);ctx.rotate(SW.ang);ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.rotate(2.09);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(16,0);ctx.stroke();}ctx.restore();
    W(ctx,[[mx,my-24],[mx,my-45],[mx+60,my-45],[mx+60,G]],PAL.ink2);dot(ctx,mx+60,G);
    ctx.globalAlpha=0.3;batt(ctx,bx,T9+60,G,'9V');ctx.globalAlpha=1;arrowText(ctx,'not used',bx,T9+50,PAL.muted,11);
    arrowText(ctx,'motor wired straight between the pin and ground',255,pinY+34,PAL.muted,12,'left');
    if(SW.pin)arrowText(ctx,'pin asked for ~500 mA, but it can give ~20 mA',255,pinY+54,PAL.bad,12,'left');
  }
  let msg,col;
  if(!SW.pin){msg='Pin LOW: motor off';col=PAL.muted;}
  else if(SW.via){msg='Motor spinning ✓ The big current loop (dots) never goes through the chip.';col=PAL.good;}
  else {msg='✗ The motor twitches and the chip overheats';col=PAL.bad;}
  arrowText(ctx,msg,400,G+44,col,13);}

// ===== 4B. Amplifier (common-emitter) =====
const AM={t:0,h:[]};
function drawAmp(dt){AM.t+=dt;const G=+$('amG').value;$('amGt').textContent='×'+G;
  const vin=0.2*Math.sin(2*Math.PI*0.8*AM.t);let vout=Math.max(0.2,Math.min(8.8,4.5-G*vin));
  AM.h.push({t:AM.t,vin:1.5+vin,vout,hi:8.8,lo:0.2});prune(AM.h,AM.t,4);
  const c=$('cAmp'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  // schematic
  const R=24,Gd=262,bx=250,qx=400,qy=150;const Re=4700/G;
  W(ctx,[[bx,R],[620,R]],PAL.redSoft);arrowText(ctx,'+9 V',616,R-8,PAL.redSoft,11,'right');
  W(ctx,[[bx-20,Gd],[qx+30,Gd]],PAL.blue);gndSym(ctx,qx+30,Gd);
  // input
  arrowText(ctx,'🎸',40,qy+6,PAL.white,20);arrowText(ctx,'small signal',40,qy+28,PAL.amber,11);
  W(ctx,[[60,qy],[140,qy]],PAL.amber);capH(ctx,140,200,qy,'C in');W(ctx,[[200,qy],[qx-44,qy]],PAL.ink2);dot(ctx,bx,qy);
  // bias divider
  resV(ctx,bx,R,qy,'R1 47k');resV(ctx,bx,qy,Gd,'R2 10k');
  arrowText(ctx,'bias ≈ '+(1.5+vin).toFixed(2)+' V',bx+12,qy+20,PAL.yellow,11,'left');
  // transistor
  npn(ctx,qx-10,qy,true,'');
  resV(ctx,qx,R,qy-72,'Rc 4.7k');W(ctx,[[qx,qy-72],[qx,qy-34]],PAL.ink2);dot(ctx,qx,qy-56);
  resV(ctx,qx,qy+34,Gd,'Re '+(Re>=1000?(Re/1000).toFixed(1)+'k':Math.round(Re)));
  // output
  W(ctx,[[qx,qy-56],[500,qy-56]],PAL.good);capH(ctx,500,560,qy-56,'C out');W(ctx,[[560,qy-56],[620,qy-56]],PAL.good);arrowText(ctx,'output →',624,qy-52,PAL.good,12,'left');
  arrowText(ctx,'collector '+vout.toFixed(2)+' V',qx+14,qy-38,PAL.good,11,'left');
  arrowText(ctx,'gain ≈ Rc ÷ Re = '+G,630,qy+40,PAL.yellow,15,'left');
  // graphs
  plot(ctx,40,315,340,150,AM.h,AM.t,4,[{k:'vin',col:PAL.amber,label:'base (small wiggle on ~1.5 V)'}],0,9,'Input at the base');
  plot(ctx,430,315,340,150,AM.h,AM.t,4,[{k:'vout',col:PAL.good,label:'collector (bigger, upside down)'},{k:'hi',col:PAL.bad,dash:[5,4],lw:1,label:'limits'},{k:'lo',col:PAL.bad,dash:[5,4],lw:1}],0,9,'Output at the collector');
  const clipped=G*0.2>4.3;arrowText(ctx,clipped?'Too much gain: the output hits 0 V / 9 V and gets clipped (distortion)':'Clean: same shape, '+G+'× bigger, flipped upside down',400,512,clipped?PAL.yellow:PAL.good,13);}

// ===== 4C. Night light =====
function drawNL(){const L=+$('nlL').value,c=$('cNL'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const sky=`rgb(${Math.round(10+60*L)},${Math.round(15+110*L)},${Math.round(40+150*L)})`;ctx.fillStyle=sky;ctx.fillRect(560,0,240,260);
  const Rl=1000*Math.pow(200,1-L),Vb=9*Rl/(47000+Rl),b=Math.max(0,Math.min(1,(Vb-0.62)/0.25));
  arrowText(ctx,b<0.5?'☀️':'🌙',680,70,PAL.white,40);
  const x=200,T=30,B=230;
  W(ctx,[[60,T],[440,T]],PAL.ink2);arrowText(ctx,'+9 V',50,T+4,PAL.redSoft,12,'right');W(ctx,[[60,B],[440,B]],PAL.ink2);arrowText(ctx,'0 V',50,B+4,PAL.blue,12,'right');
  W(ctx,[[x,T],[x,50]],PAL.ink2);resBox(ctx,x-10,50,20,40,'47 kΩ');W(ctx,[[x,90],[x,130]],PAL.ink2);dot(ctx,x,130);
  W(ctx,[[x,130],[x,150]],PAL.ink2);resBox(ctx,x-10,150,20,40,'');ctx.strokeStyle=PAL.yellow;ctx.lineWidth=1.5;[[0,0],[8,8]].forEach(([d1,d2])=>{ctx.beginPath();ctx.moveTo(x-30-d1,150+d2);ctx.lineTo(x-14-d1,160+d2);ctx.stroke();});
  arrowText(ctx,'LDR '+(Rl>=1000?(Rl/1000).toFixed(Rl<10000?1:0)+' kΩ':Rl.toFixed(0)+' Ω'),x+16,174,PAL.yellow,11,'left');W(ctx,[[x,190],[x,B]],PAL.ink2);
  W(ctx,[[x,130],[x+80,130]],PAL.ink2);resBox(ctx,x+80,120,50,20,'');W(ctx,[[x+130,130],[x+156,130]],PAL.ink2);
  npn(ctx,x+190,130,b>0.5,'');W(ctx,[[x+200,96],[x+200,90]],PAL.ink2);
  ledBulbT(ctx,x+200,70,b);W(ctx,[[x+200,52],[x+200,T]],PAL.ink2);W(ctx,[[x+200,164],[x+200,B]],PAL.ink2);
  arrowText(ctx,'base: '+Math.min(Vb,0.75).toFixed(2)+' V',x+80,112,b>0.5?PAL.good:PAL.muted,12,'left');
  wrapText(ctx,b<0.5?'Bright: the LDR is low, so the base stays below 0.7 V and the light is OFF.':'Dark: the LDR is high, so the base passes 0.7 V and the transistor turns the light ON.',575,150,210,18,PAL.white,13);}
function ledBulbT(ctx,x,y,b){if(b>0.02){const g=ctx.createRadialGradient(x,y,2,x,y,50);g.addColorStop(0,`rgba(250,204,21,${b})`);g.addColorStop(1,'rgba(250,204,21,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,50,0,7);ctx.fill();}
  ctx.fillStyle=`rgba(250,204,21,${0.3+0.7*b})`;ctx.beginPath();ctx.arc(x,y,14,0,7);ctx.fill();ctx.strokeStyle=PAL.ink;ctx.lineWidth=1.5;ctx.stroke();}
$('nlL').oninput=drawNL;drawNL();

// ===== 4D. Logic =====
const LG={g:0,A:false,B:false};
choices('lgChoices',['AND','OR','NOT'],0,i=>{LG.g=i;drawLG();});
$('lgA').onclick=()=>{LG.A=!LG.A;$('lgA').textContent='A: '+(LG.A?'ON':'off');$('lgA').className=LG.A?'active':'';drawLG();};
$('lgB').onclick=()=>{LG.B=!LG.B;$('lgB').textContent='B: '+(LG.B?'ON':'off');$('lgB').className=LG.B?'active':'';drawLG();};
function drawLG(){const c=$('cLG'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);$('lgB').style.display=LG.g===2?'none':'';
  const out=LG.g===0?LG.A&&LG.B:LG.g===1?LG.A||LG.B:!LG.A;
  const T=20,B=240,lx=260;W(ctx,[[60,T],[lx,T]],PAL.ink2);arrowText(ctx,'+5 V',50,T+4,PAL.redSoft,12,'right');W(ctx,[[60,B],[520,B]],PAL.ink2);arrowText(ctx,'0 V',50,B+4,PAL.blue,12,'right');
  W(ctx,[[lx,T],[lx,32]],PAL.ink2);resBox(ctx,lx-10,32,20,30,'');W(ctx,[[lx,62],[lx,72]],PAL.ink2);ledBulbT(ctx,lx,86,out?1:0);W(ctx,[[lx,100],[lx,110]],PAL.ink2);
  arrowText(ctx,'output LED',lx+24,90,PAL.muted,12,'left');
  const inp=(y,on,l,x)=>{W(ctx,[[90,y],[x-34,y]],on?PAL.good:PAL.slate);arrowText(ctx,l+(on?' = 1':' = 0'),84,y+4,on?PAL.good:PAL.muted,13,'right');};
  if(LG.g===0){npn(ctx,lx-10,145,LG.A,'A');npn(ctx,lx-10,212,LG.B,'B');W(ctx,[[lx,110],[lx,111]],PAL.ink2);W(ctx,[[lx,179],[lx,178]],PAL.ink2);inp(145,LG.A,'A',lx-10);inp(212,LG.B,'B',lx-10);W(ctx,[[lx,246],[lx,B]],PAL.ink2);}
  else if(LG.g===1){W(ctx,[[lx-60,110],[lx+60,110]],PAL.ink2);npn(ctx,lx-70,160,LG.A,'A');npn(ctx,lx+50,160,LG.B,'B');W(ctx,[[lx-60,194],[lx-60,B]],PAL.ink2);W(ctx,[[lx+60,194],[lx+60,B]],PAL.ink2);
    W(ctx,[[lx-60,110],[lx-60,126]],PAL.ink2);W(ctx,[[lx+60,110],[lx+60,126]],PAL.ink2);inp(160,LG.A,'A',lx-70);W(ctx,[[lx-20,140],[lx-20,160],[lx+16,160]],LG.B?PAL.good:PAL.slate);arrowText(ctx,'B',lx-28,136,LG.B?PAL.good:PAL.muted,13);}
  else{ // NOT: LED fed via resistor, transistor in parallel to LED shorting it
    W(ctx,[[lx,110],[lx,B]],PAL.ink2);W(ctx,[[lx,56],[lx+100,56],[lx+100,126]],PAL.ink2);npn(ctx,lx+90,160,LG.A,'A');W(ctx,[[lx+100,194],[lx+100,B]],PAL.ink2);
    W(ctx,[[90,160],[lx+56,160]],LG.A?PAL.good:PAL.slate);arrowText(ctx,'A'+(LG.A?' = 1':' = 0'),84,164,LG.A?PAL.good:PAL.muted,13,'right');}
  // truth table
  const tx=560,rows=LG.g===2?[[0,1],[1,0]]:[[0,0,LG.g?0:0],[0,1,LG.g?1:0],[1,0,LG.g?1:0],[1,1,1]];
  arrowText(ctx,['AND: both needed','OR: either is enough','NOT: flips it'][LG.g],tx,30,PAL.yellow,15,'left');
  const hdr=LG.g===2?['A','LED']:['A','B','LED'];hdr.forEach((h,i)=>arrowText(ctx,h,tx+20+i*60,60,PAL.muted,13));
  rows.forEach((r,j)=>{const cur=LG.g===2?(r[0]===+LG.A):(r[0]===+LG.A&&r[1]===+LG.B);if(cur){ctx.fillStyle='#1e3a5f';ctx.fillRect(tx-5,68+j*28,LG.g===2?130:190,24);}
    r.forEach((v,i)=>arrowText(ctx,String(v),tx+20+i*60,86+j*28,i===r.length-1?(v?PAL.yellow:PAL.muted):PAL.ink,14));});
  arrowText(ctx,'LED: '+(out?'ON (1)':'off (0)'),tx,B-6,out?PAL.yellow:PAL.muted,16,'left');}
drawLG();

// ===== Symbol =====
(function(){const c=$('cSymT'),ctx=c.getContext('2d');npn(ctx,190,90,false,'');W(ctx,[[90,90],[156,90]],PAL.ink);
  arrowText(ctx,'B (base)',80,94,PAL.yellow,13,'right');arrowText(ctx,'C (collector)',210,40,PAL.ink,13,'left');arrowText(ctx,'E (emitter)',210,150,PAL.ink,13,'left');
  W(ctx,[[200,56],[200,30]],PAL.ink);W(ctx,[[200,124],[200,150]],PAL.ink);})();

loop((dt,now)=>{drawTV(dt);drawSw(dt);drawAmp(dt);});


})();
