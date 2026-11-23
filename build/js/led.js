
// ================= led =================
(function(){
const PG=document.getElementById('page-led');
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


// ===== LED helpers =====
function ledI(V,Vf){return V<=0?0:20*Math.exp((V-Vf)/0.07);} // mA, 20 mA at Vf
function ledBulb(ctx,x,y,b,rgb='239,68,68',burnt=false,r=18){
  if(!burnt&&b>0.02){const g=ctx.createRadialGradient(x,y,2,x,y,r*3.2);g.addColorStop(0,`rgba(${rgb},${Math.min(1,b)})`);g.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*3.2,0,7);ctx.fill();}
  ctx.fillStyle=burnt?'#1c1917':`rgba(${rgb},${0.25+0.75*Math.min(1,b)})`;ctx.beginPath();ctx.arc(x,y-4,r,Math.PI,0);ctx.lineTo(x+r,y+r);ctx.lineTo(x-r,y+r);ctx.closePath();ctx.fill();
  ctx.strokeStyle=PAL.ink;ctx.lineWidth=1.5;ctx.stroke();}
const COLORS=[['Red',1.9,'239,68,68'],['Yellow',2.05,'250,204,21'],['Green',2.2,'34,197,94'],['Blue',3.1,'59,130,246'],['White',3.1,'241,245,249']];

// ===== 3. Direct vs resistor =====
const LD={res:0,burnt:false,stress:0,pop:0};
choices('ldChoices',['Directly on the voltage','Through a 150 Ω resistor'],0,i=>{LD.res=i;});
$('ldNew').onclick=()=>{LD.burnt=false;LD.stress=0;};
function solveI(Vs,R,Vf){if(!R)return ledI(Vs,Vf);let lo=0,hi=Vs/R*1000+1;for(let k=0;k<40;k++){const m=(lo+hi)/2;const Vl=Vf+0.07*Math.log(Math.max(m,1e-9)/20);(Vl+m/1000*R>Vs)?hi=m:lo=m;}return lo;}
function drawLD(dt){const Vs=+$('ldV').value;$('ldVt').textContent=Vs.toFixed(2)+' V';const R=LD.res?150:0,Vf=1.9;
  let I=LD.burnt?0:solveI(Vs,R,Vf);
  if(!LD.burnt){if(I>30)LD.stress+=dt*I/30;else LD.stress=Math.max(0,LD.stress-dt*0.3);if(LD.stress>1.5){LD.burnt=true;LD.pop=0.8;}}
  LD.pop=Math.max(0,LD.pop-dt);
  const c=$('cLD'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=50,B=200;batt(ctx,60,T,B,Vs.toFixed(1)+'V');W(ctx,[[60,T],[160,T]],PAL.ink2);
  if(R){ctx.fillStyle=PAL.canvas;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=3;ctx.fillRect(160,T-12,70,24);ctx.strokeRect(160,T-12,70,24);arrowText(ctx,'150 Ω',195,T+5,PAL.ink,12);}else W(ctx,[[160,T],[230,T]],PAL.ink2);
  W(ctx,[[230,T],[300,T],[300,105]],PAL.ink2);ledBulb(ctx,300,125,Math.sqrt(Math.min(I,25)/20),'239,68,68',LD.burnt);W(ctx,[[300,143],[300,B],[60,B]],PAL.ink2);
  if(LD.pop>0)arrowText(ctx,'💥 POP!',300,90,PAL.yellow,20);
  arrowText(ctx,LD.burnt?'burnt out':I.toFixed(I<10?1:0)+' mA',340,130,LD.burnt?PAL.bad:I>20?PAL.bad:PAL.good,15,'left');
  // graph current vs supply voltage
  const gx=440,gy=30,gw=340,gh=190,X=v=>gx+v/5*gw,Y=i=>gy+gh-Math.min(i,60)/60*gh;
  ctx.fillStyle=PAL.raised;ctx.fillRect(gx,gy,gw,gh);
  ctx.fillStyle='rgba(239,68,68,0.15)';ctx.fillRect(gx,gy,gw,Y(20)-gy);arrowText(ctx,'danger: over 20 mA',gx+gw-6,gy+16,PAL.redLight,11,'right');
  ctx.strokeStyle=PAL.redLight;ctx.setLineDash([5,4]);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gx,Y(20));ctx.lineTo(gx+gw,Y(20));ctx.stroke();ctx.setLineDash([]);
  [[0,PAL.redSoft,'directly'],[150,PAL.blue,'with 150 Ω']].forEach(([r,col,l])=>{ctx.strokeStyle=col;ctx.lineWidth=r===R?3:1.5;ctx.globalAlpha=r===R?1:0.4;ctx.beginPath();
    for(let v=0;v<=5;v+=0.02){const xx=X(v),yy=Y(solveI(v,r,Vf));v===0?ctx.moveTo(xx,yy):ctx.lineTo(xx,yy);}ctx.stroke();ctx.globalAlpha=1;});
  arrowText(ctx,'directly: a wall',X(2.1),gy+gh-60,PAL.redSoft,11,'left');arrowText(ctx,'with resistor: gentle',X(3.3),Y(solveI(3.3,150,Vf))+22,PAL.blue,11,'left');
  ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.arc(X(Vs),Y(solveI(Vs,R,Vf)),6,0,7);ctx.fill();
  arrowText(ctx,'0 V',gx,gy+gh+14,PAL.muted,11);arrowText(ctx,'5 V',gx+gw,gy+gh+14,PAL.muted,11);arrowText(ctx,'supply voltage →',gx+gw/2,gy+gh+28,PAL.muted,11);arrowText(ctx,'current (0–60 mA)',gx,gy-8,PAL.muted,11,'left');}

// ===== 4. Calculator =====
(function(){const s=$('kC');COLORS.forEach((c,i)=>{const o=document.createElement('option');o.value=i;o.textContent=c[0]+' ('+c[1]+' V)';s.appendChild(o);});
  ['kV','kC','kI'].forEach(id=>$(id).oninput=drawCalc);$('kRuby').onclick=()=>{$('kV').value=9;$('kC').value=0;$('kI').value=3;drawCalc();};})();
const E12=[1,1.2,1.5,1.8,2.2,2.7,3.3,3.9,4.7,5.6,6.8,8.2];
function nextE12(r){let d=Math.pow(10,Math.floor(Math.log10(r)));for(let k=0;k<3;k++){for(const e of E12){if(e*d>=r-1e-9)return e*d;}d*=10;}return r;}
const fmtOhm=r=>r>=1e6?+(r/1e6).toFixed(2)+' MΩ':r>=1000?+(r/1000).toFixed(2)+' kΩ':Math.round(r)+' Ω';
function drawCalc(){const c=$('cCalc'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const Vs=+$('kV').value,col=COLORS[+$('kC').value],I=+$('kI').value/1000;
  ledBulb(ctx,60,70,0.9,col[2],false,22);
  if(!(Vs>col[1])){arrowText(ctx,'The supply must be higher than the LED\'s '+col[1]+' V, or it can\'t light.',130,75,PAL.redSoft,15,'left');return;}
  const R=(Vs-col[1])/I,Rs=nextE12(R),Ia=(Vs-col[1])/Rs*1000,P=(Vs-col[1])*Ia/1000;
  arrowText(ctx,'R = ('+Vs+' V − '+col[1]+' V) ÷ '+(I*1000)+' mA = '+fmtOhm(R),130,40,PAL.ink,15,'left');
  arrowText(ctx,'Use a standard '+fmtOhm(Rs)+' resistor',130,75,PAL.yellow,22,'left');
  arrowText(ctx,'→ actual current '+Ia.toFixed(1)+' mA · heat in resistor '+(P*1000).toFixed(0)+' mW '+(P>0.2?'⚠ use a ½ W resistor':'(¼ W is fine)'),130,106,PAL.muted,13,'left');
  if(Ia>20)arrowText(ctx,'⚠ over 20 mA: lower the current',130,132,PAL.redSoft,13,'left');}
drawCalc();

// ===== 5. Legs =====
(function(){const c=$('cLegs'),ctx=c.getContext('2d');const x=260,y=60;
  const g=ctx.createRadialGradient(x,y,4,x,y,70);g.addColorStop(0,'rgba(239,68,68,0.5)');g.addColorStop(1,'rgba(239,68,68,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,70,0,7);ctx.fill();
  ctx.fillStyle='rgba(239,68,68,0.75)';ctx.beginPath();ctx.arc(x,y,28,Math.PI,0);ctx.lineTo(x+28,y+44);ctx.lineTo(x-28,y+44);ctx.closePath();ctx.fill();
  ctx.fillRect(x-34,y+44,68,8);ctx.fillStyle=PAL.canvas;ctx.fillRect(x+28,y+44,8,8); // flat side on right
  ctx.fillStyle=PAL.ink2;ctx.fillRect(x-13,y+52,4,112);ctx.fillRect(x+9,y+52,4,82);
  ctx.fillStyle=PAL.muted;ctx.fillRect(x+2,y+10,12,30);ctx.fillRect(x-12,y+22,8,18); // anvil + post
  arrowText(ctx,'long leg = ANODE (+)',x-24,y+155,PAL.redSoft,14,'right');arrowText(ctx,'short leg = CATHODE (−)',x+24,y+125,PAL.blue,14,'left');
  arrowText(ctx,'flat edge = cathode side',x+42,y+50,PAL.muted,12,'left');arrowText(ctx,'big "anvil" inside = cathode',x+42,y+22,PAL.muted,12,'left');
  // symbol
  const sx=600,sy=100;W(ctx,[[sx-80,sy],[sx-14,sy]],PAL.ink);ctx.strokeStyle=PAL.ink;ctx.fillStyle=PAL.canvas;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(sx-14,sy-14);ctx.lineTo(sx+14,sy);ctx.lineTo(sx-14,sy+14);ctx.closePath();ctx.fill();ctx.stroke();
  W(ctx,[[sx+14,sy-14],[sx+14,sy+14]],PAL.ink);W(ctx,[[sx+14,sy],[sx+80,sy]],PAL.ink);
  [[0,0],[12,6]].forEach(([dx,dy])=>{W(ctx,[[sx+2+dx,sy-20-dy],[sx+16+dx,sy-34-dy]],PAL.yellow,2);ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.moveTo(sx+18+dx,sy-36-dy);ctx.lineTo(sx+10+dx,sy-33-dy);ctx.lineTo(sx+15+dx,sy-28-dy);ctx.fill();});
  arrowText(ctx,'+',sx-80,sy-10,PAL.redSoft,16);arrowText(ctx,'−',sx+80,sy-10,PAL.blue,16);arrowText(ctx,'LED symbol: the arrows are light going out',sx,sy+44,PAL.muted,12);})();

// ===== 6A. Multi LEDs =====
const ML={ind:0,t:0};
choices('mlChoices',['One shared resistor','One resistor each'],0,i=>ML.ind=i);
function drawML(dt){ML.t+=dt;const c=$('cMulti'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const vf=[1.95,2.0,2.05];let I;
  if(!ML.ind){const tot=(9-2.0)/150*1000;const w=vf.map(v=>Math.exp(-(v-1.95)/0.06));const s=w.reduce((a,b)=>a+b);I=w.map(x=>tot*x/s);}
  else I=vf.map(v=>(9-v)/470*1000);
  const T=40,B=210;batt(ctx,50,T,B,'9V');W(ctx,[[50,T],[120,T]],PAL.ink2);W(ctx,[[50,B],[620,B]],PAL.ink2);
  const xs=[260,420,580];
  if(!ML.ind){ctx.fillStyle=PAL.canvas;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=3;ctx.fillRect(120,T-12,70,24);ctx.strokeRect(120,T-12,70,24);arrowText(ctx,'150 Ω',155,T+5,PAL.ink,12);W(ctx,[[190,T],[580,T]],PAL.ink2);
    xs.forEach(x=>W(ctx,[[x,T],[x,105]],PAL.ink2));}
  else{W(ctx,[[120,T],[580,T]],PAL.ink2);xs.forEach(x=>{W(ctx,[[x,T],[x,52]],PAL.ink2);ctx.fillStyle=PAL.canvas;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=3;ctx.fillRect(x-11,52,22,40);ctx.strokeRect(x-11,52,22,40);arrowText(ctx,'470',x+16,76,PAL.ink,11,'left');W(ctx,[[x,92],[x,105]],PAL.ink2);});}
  xs.forEach((x,i)=>{const hot=I[i]>20;ledBulb(ctx,x,125,Math.sqrt(Math.min(I[i],25)/20));W(ctx,[[x,143],[x,B]],PAL.ink2);
    arrowText(ctx,'Vf '+vf[i]+' V',x+26,118,PAL.muted,11,'left');arrowText(ctx,I[i].toFixed(1)+' mA'+(hot?' 🔥':''),x+26,136,hot?PAL.bad:I[i]<8?PAL.yellow:PAL.good,13,'left');});
  arrowText(ctx,ML.ind?'Each LED gets its own ~15 mA: equal and safe ✓':'The LED with the lowest Vf hogs the current and overheats ✗',400,240,ML.ind?PAL.good:PAL.redSoft,13);}

// ===== 6B. PWM =====
const PW={t:0};
function drawPW(dt){PW.t+=dt;const d=+$('pwD').value,f=Math.pow(10,+$('pwF').value);
  const c=$('cPWM'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const fast=f>25,phase=(PW.t*f)%1,on=phase<d,b=fast?d:(on?1:0);
  ledBulb(ctx,110,95,b,'239,68,68',false,26);
  arrowText(ctx,fast?'looks: '+Math.round(d*100)+'% bright (steady)':(on?'ON':'off'),110,175,fast?PAL.good:PAL.yellow,14);
  arrowText(ctx,f.toFixed(f<10?1:0)+' blinks per second',110,198,PAL.muted,12);
  const gx=240,gy=40,gw=540,gh=120,win=Math.min(4,8/f);
  ctx.fillStyle=PAL.raised;ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle=PAL.redSoft;ctx.lineWidth=2;ctx.beginPath();
  for(let px=0;px<=gw;px++){const t=PW.t-win+px/gw*win;const s=((t*f)%1+1)%1<d;const yy=s?gy+15:gy+gh-15;px?ctx.lineTo(gx+px,yy):ctx.moveTo(gx+px,yy);}ctx.stroke();
  ctx.strokeStyle=PAL.good;ctx.setLineDash([6,4]);ctx.beginPath();const ya=gy+gh-15-(gh-30)*d;ctx.moveTo(gx,ya);ctx.lineTo(gx+gw,ya);ctx.stroke();ctx.setLineDash([]);
  arrowText(ctx,'average = '+Math.round(d*100)+'%',gx+gw-6,ya-6,PAL.good,12,'right');
  arrowText(ctx,'on',gx-6,gy+19,PAL.muted,11,'right');arrowText(ctx,'off',gx-6,gy+gh-11,PAL.muted,11,'right');
  arrowText(ctx,'showing the last '+(win<1?(win*1000).toFixed(0)+' ms':win.toFixed(1)+' s'),gx,gy+gh+18,PAL.muted,11,'left');
  arrowText(ctx,fast?'Faster than ~25 blinks/s your eye can\'t see the flashing, only the average.':'Slow: you see it blink. Push the speed slider right.',gx+gw/2,gy+gh+48,PAL.ink,13);}

// ===== 6C. RGB =====
function drawRGB(){const c=$('cRGB'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const r=+$('rgbR').value,g=+$('rgbG').value,b=+$('rgbB').value;
  ctx.globalCompositeOperation='lighter';
  [[200,80,`rgba(255,0,0,${r/255})`],[250,80,`rgba(0,255,0,${g/255})`],[225,125,`rgba(0,0,255,${b/255})`]].forEach(([x,y,col])=>{ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,62,0,7);ctx.fill();});
  ctx.globalCompositeOperation='source-over';
  ctx.fillStyle=`rgb(${r},${g},${b})`;ctx.beginPath();ctx.arc(560,100,60,0,7);ctx.fill();ctx.strokeStyle=PAL.ink;ctx.lineWidth=2;ctx.stroke();
  arrowText(ctx,'three LEDs overlapping',225,210,PAL.muted,12);arrowText(ctx,'what your eye sees',560,190,PAL.muted,12);
  arrowText(ctx,`R ${Math.round(r/2.55)}% · G ${Math.round(g/2.55)}% · B ${Math.round(b/2.55)}%`,560,212,PAL.ink,12);}
['rgbR','rgbG','rgbB'].forEach(id=>$(id).oninput=drawRGB);drawRGB();

loop((dt,now)=>{drawLD(dt);drawML(dt);drawPW(dt);});


})();
