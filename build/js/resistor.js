
// ================= resistor =================
(function(){
const PG=document.getElementById('page-resistor');
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


// ===== Formatting =====
const fmtR=k=>k>=1000?(k/1000).toFixed(k%1000?1:0)+' MΩ':k>=1?(+k.toFixed(1))+' kΩ':Math.round(k*1000)+' Ω'; // k in kΩ
const fmtI=mA=>mA>=1000?(mA/1000).toFixed(2)+' A':mA>=10?mA.toFixed(0)+' mA':mA.toFixed(1)+' mA';

// ===== 3. Water flow =====
const FL={V:9,R:3,off:0};
function updFL(){FL.V=+$('fV').value;FL.R=+$('fR').value;const I=FL.V/FL.R;
  $('fVt').textContent=FL.V+' V';$('fRt').textContent=FL.R+' kΩ';$('fIt').textContent=I.toFixed(1)+' mA';$('fPt').textContent=(FL.V*I).toFixed(0)+' mW';}
$('fV').oninput=updFL;$('fR').oninput=updFL;updFL();
function drawFL(dt){const c=$('cFlow'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const X1=110,X2=700,Y1=80,Y2=240,I=FL.V/FL.R; FL.off-=I*dt*40;
  loopPath(ctx,X1,Y1,X2,Y2);ctx.strokeStyle=PAL.waterLight;ctx.lineWidth=26;ctx.lineJoin='round';ctx.stroke();
  // narrow section: cover pipe then draw narrower
  const nw=Math.max(3,26-FL.R*2.3), a=330,b=470;
  ctx.fillStyle=PAL.canvas;ctx.fillRect(a,Y1-14,b-a,28);
  const P=FL.V*I, heat=Math.min(1,P/80);
  ctx.fillStyle=PAL.muted2;ctx.fillRect(a,Y1-14,b-a,(28-nw)/2);ctx.fillRect(a,Y1+nw/2,b-a,(28-nw)/2);
  if(heat>0.02){const g=ctx.createRadialGradient((a+b)/2,Y1,4,(a+b)/2,Y1,90);g.addColorStop(0,`rgba(249,115,22,${0.7*heat})`);g.addColorStop(1,'rgba(249,115,22,0)');ctx.fillStyle=g;ctx.fillRect(a-60,Y1-80,b-a+120,160);}
  ctx.strokeStyle=PAL.waterLight;ctx.lineWidth=nw;ctx.beginPath();ctx.moveTo(a,Y1);ctx.lineTo(b,Y1);ctx.stroke();
  // flow dashes (faster in narrow section: same flow through smaller pipe)
  ctx.strokeStyle=PAL.water;ctx.lineWidth=6;ctx.setLineDash([16,14]);ctx.lineDashOffset=FL.off;
  ctx.beginPath();ctx.moveTo(X1,(Y1+Y2)/2);ctx.lineTo(X1,Y1);ctx.lineTo(a,Y1);ctx.stroke();
  ctx.beginPath();ctx.moveTo(b,Y1);ctx.lineTo(X2,Y1);ctx.lineTo(X2,Y2);ctx.lineTo(X1,Y2);ctx.lineTo(X1,(Y1+Y2)/2);ctx.stroke();
  ctx.lineWidth=Math.max(2,Math.min(6,nw-4));ctx.lineDashOffset=FL.off*26/nw;ctx.beginPath();ctx.moveTo(a,Y1);ctx.lineTo(b,Y1);ctx.stroke();ctx.setLineDash([]);
  arrowText(ctx,'narrow pipe = resistor',(a+b)/2,Y1-26,PAL.ink,13);
  if(heat>0.15)arrowText(ctx,'🔥 heat',(a+b)/2,Y1+40,PAL.orangeSoft,13);
  // pressure gauges
  const gauge=(x,v,l)=>{ctx.fillStyle=PAL.raised;ctx.fillRect(x-42,Y1+52,84,46);ctx.strokeStyle=PAL.line;ctx.strokeRect(x-42,Y1+52,84,46);
    arrowText(ctx,l,x,Y1+68,PAL.muted,11);arrowText(ctx,v.toFixed(1)+' V',x,Y1+90,PAL.yellow,16);};
  gauge(265,FL.V,'pressure before');gauge(535,0,'pressure after');
  arrowText(ctx,'voltage drop across the resistor: '+FL.V.toFixed(1)+' V',400,Y1+120,PAL.yellow,13);
  // pump
  const py=(Y1+Y2)/2;ctx.beginPath();ctx.arc(X1,py,34,0,7);ctx.fillStyle='#fef3c7';ctx.fill();ctx.strokeStyle=PAL.brown;ctx.lineWidth=3;ctx.stroke();
  arrowText(ctx,FL.V+' V',X1,py+6,PAL.brown,15);arrowText(ctx,'pump = battery',X1+40,py+62,PAL.muted,13,'left');
  arrowText(ctx,'flow (current): '+I.toFixed(1)+' mA',X2-30,Y2-24,PAL.blue,13,'right');
}

// ===== 4. Ohm's law =====
const OHM={V:['V = I × R','Voltage = current × resistance','A 470 Ω resistor with 10 mA flowing through it: V = 0.010 A × 470 Ω = <b>4.7 V</b> dropped across it.'],
 I:['I = V ÷ R','Current = voltage ÷ resistance','9 V across a 1 kΩ resistor: I = 9 V ÷ 1000 Ω = 0.009 A = <b>9 mA</b>.'],
 R:['R = V ÷ I','Resistance = voltage ÷ current','You want 7 V dropped at 20 mA (an LED on 9 V): R = 7 V ÷ 0.020 A = <b>350 Ω</b>, so pick the next standard value up: 390 Ω or 470 Ω.']};
function showOhm(k){document.querySelectorAll('#ohmBtns button').forEach(b=>b.className=b.dataset.k===k?'active':'');
  const o=OHM[k];$('ohmOut').innerHTML=`<div style="font-size:1.6rem;font-weight:700;color:${PAL.yellow}">${o[0]}</div><div class="hint">${o[1]}</div><p style="margin:8px 0 0">Example: ${o[2]}</p>`;}
document.querySelectorAll('#ohmBtns button').forEach(b=>b.onclick=()=>showOhm(b.dataset.k));showOhm('V');

// ===== 5. Series / parallel =====
const SP={par:0,off:0,o1:0,o2:0};
choices('spChoices',['Series (in a row)','Parallel (side by side)'],0,i=>SP.par=i);
function drawSP(dt){const c=$('cSP'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const R1=+$('sR1').value,R2=+$('sR2').value,Rt=SP.par?R1*R2/(R1+R2):R1+R2,It=9/Rt,I1=SP.par?9/R1:It,I2=SP.par?9/R2:It;
  $('spR').textContent=Rt.toFixed(2)+' kΩ';$('spI').textContent=It.toFixed(2)+' mA';
  SP.off+=It*dt*25;SP.o1+=I1*dt*25;SP.o2+=I2*dt*25;
  const dots=(pts,off)=>{ctx.strokeStyle=PAL.yellow;ctx.lineWidth=8;ctx.lineCap='round';ctx.setLineDash([0,22]);ctx.lineDashOffset=-off;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.setLineDash([]);ctx.lineCap='butt';};
  const resH=(x,y,l,lab)=>{ctx.fillStyle=PAL.canvas;ctx.fillRect(x,y-12,70,24);ctx.strokeStyle=PAL.ink2;ctx.lineWidth=3;ctx.strokeRect(x,y-12,70,24);arrowText(ctx,l,x+35,y+5,PAL.ink,12);if(lab)arrowText(ctx,lab,x+35,y-20,PAL.yellow,12);};
  const T=50,B=220,xL=60,xR=720;
  batt(ctx,xL,T,B,'9V');
  if(!SP.par){
    W(ctx,[[xL,T],[250,T]],PAL.ink2);W(ctx,[[320,T],[450,T]],PAL.ink2);W(ctx,[[520,T],[xR,T],[xR,B],[xL,B]],PAL.ink2);__PR(ctx,{t:'part',k:'res',a:[250,T],b:[320,T],o:{label:R1+' kΩ'}});__PR(ctx,{t:'part',k:'res',a:[450,T],b:[520,T],o:{label:R2+' kΩ'}});
    dots([[xL,(T+B)/2-12],[xL,T],[xR,T],[xR,B],[xL,B],[xL,(T+B)/2+12]],SP.off);
    resH(250,T,'R1 '+R1+'k',I1.toFixed(2)+' mA');resH(450,T,'R2 '+R2+'k',I2.toFixed(2)+' mA');
    arrowText(ctx,'One path: all the current squeezes through both, so R = R1 + R2 = '+(R1+R2)+' kΩ',400,B+32,PAL.muted,13);
  } else {
    const ya=T,yb=T+90;
    W(ctx,[[xL,T],[300,T]],PAL.ink2);W(ctx,[[300,ya],[300,yb]],PAL.ink2);W(ctx,[[300,ya],[385,ya]],PAL.ink2);W(ctx,[[455,ya],[540,ya]],PAL.ink2);W(ctx,[[300,yb],[385,yb]],PAL.ink2);W(ctx,[[455,yb],[540,yb]],PAL.ink2);__PR(ctx,{t:'part',k:'res',a:[385,ya],b:[455,ya],o:{label:R1+' kΩ'}});__PR(ctx,{t:'part',k:'res',a:[385,yb],b:[455,yb],o:{label:R2+' kΩ'}});
    W(ctx,[[540,ya],[540,yb]],PAL.ink2);W(ctx,[[540,T],[xR,T],[xR,B],[xL,B]],PAL.ink2);
    dots([[xL,(T+B)/2-12],[xL,T],[300,T]],SP.off);dots([[300,ya],[540,ya]],SP.o1);dots([[300,ya],[300,yb],[540,yb],[540,ya]],SP.o2);
    dots([[540,T],[xR,T],[xR,B],[xL,B],[xL,(T+B)/2+12]],SP.off);
    resH(385,ya,'R1 '+R1+'k',I1.toFixed(2)+' mA');resH(385,yb,'R2 '+R2+'k',I2.toFixed(2)+' mA');
    arrowText(ctx,'Two paths: easier, so R = '+Rt.toFixed(2)+' kΩ, smaller than both',400,B+32,PAL.muted,13);
  }
}

// ===== 6. Heat / power rating =====
const HT={V:3,temp:0,burnt:false,smoke:[],over:0};
$('hV').oninput=e=>HT.V=+e.target.value;$('hNew').onclick=()=>{HT.temp=0;HT.burnt=false;HT.over=0;HT.smoke=[];};
function stepHT(dt){const P=HT.burnt?0:HT.V*HT.V/100;HT.temp+=(P/0.25-HT.temp)*dt/1.2;
  if(P>0.27)HT.over+=dt*(P/0.25-1);else HT.over=Math.max(0,HT.over-dt*0.3);
  if(HT.over>2.5)HT.burnt=true;
  if(!HT.burnt&&HT.temp>1.05&&Math.random()<dt*HT.temp*6)HT.smoke.push({x:400+(Math.random()-.5)*60,y:70,r:5,a:1});
  HT.smoke.forEach(s=>{s.y-=dt*28;s.r+=dt*12;s.a-=dt*0.6;});HT.smoke=HT.smoke.filter(s=>s.a>0);
  const I=HT.burnt?0:HT.V/100*1000;$('hVt').textContent=HT.V+' V';$('hI').textContent=I.toFixed(0)+' mA';$('hP').textContent=(HT.burnt?0:P).toFixed(2)+' W';
  const st=$('hS');if(HT.burnt){st.textContent='BURNT OPEN: no current flows';st.style.color=PAL.bad;}
  else if(P>0.25){st.textContent='overheating!';st.style.color=PAL.bad;}else if(P>0.18){st.textContent='warm, near the limit';st.style.color=PAL.amber;}else{st.textContent='fine';st.style.color=PAL.good;}}
function drawHT(){const c=$('cHeat'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const y=110,t=Math.min(2.5,HT.temp);
  W(ctx,[[120,y],[330,y]],PAL.ink2,4);W(ctx,[[470,y],[680,y]],PAL.ink2,4);
  if(t>0.6&&!HT.burnt){const g=ctx.createRadialGradient(400,y,5,400,y,120);g.addColorStop(0,`rgba(239,68,68,${Math.min(0.8,(t-0.6)*0.5)})`);g.addColorStop(1,'rgba(239,68,68,0)');ctx.fillStyle=g;ctx.fillRect(260,y-110,280,220);}
  // body colour: beige -> brown -> black
  const k=Math.min(1,t/2.2);const col=HT.burnt?'#1c1917':`rgb(${Math.round(222-150*k)},${Math.round(196-160*k)},${Math.round(150-130*k)})`;
  ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(330,y-26,140,52,18);ctx.fill();
  if(!HT.burnt)[['#8b4513',355],['#000',380],['#8b4513',405],['#d4af37',445]].forEach(([cc,x])=>{ctx.fillStyle=cc;ctx.fillRect(x,y-26,10,52);});
  else{ctx.strokeStyle=PAL.canvas;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(395,y-26);ctx.lineTo(405,y-4);ctx.lineTo(395,y+6);ctx.lineTo(405,y+26);ctx.stroke();arrowText(ctx,'cracked: circuit broken',400,y+50,PAL.bad,13);}
  HT.smoke.forEach(s=>{ctx.fillStyle=`rgba(148,163,184,${0.5*s.a})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.fill();});
  arrowText(ctx,'100 Ω  ¼ W',400,y-40,PAL.ink,13);
  // thermometer
  const tx=720,tt=30,th=140;ctx.fillStyle=PAL.raised;ctx.fillRect(tx,tt,18,th);ctx.fillStyle=t>1?PAL.bad:t>0.72?PAL.amber:PAL.good;
  const lv=Math.min(1,t/2.5);ctx.fillRect(tx,tt+th*(1-lv),18,th*lv);ctx.strokeStyle=PAL.ink2;ctx.lineWidth=2;ctx.strokeRect(tx,tt,18,th);
  const ly=tt+th*(1-1/2.5);ctx.strokeStyle=PAL.redLight;ctx.beginPath();ctx.moveTo(tx-6,ly);ctx.lineTo(tx+24,ly);ctx.stroke();arrowText(ctx,'¼ W limit',tx-10,ly+4,PAL.redLight,11,'right');
  arrowText(ctx,'heat',tx+9,tt+th+16,PAL.muted,11);}

// ===== 7A. LED =====
const LE={k:3,burnt:false,stress:0,pop:0}, ledR=[0,0.1,0.47,1,10];
choices('ledChoices',['No resistor','100 Ω','470 Ω','1 kΩ','10 kΩ'],2,i=>{LE.k=i;LE.stress=0;});
$('ledNew').onclick=()=>{LE.burnt=false;LE.stress=0;};
function stepLE(dt){const R=ledR[LE.k];const I=R?7/R:2000;
  if(!LE.burnt){if(I>25)LE.stress+=dt*(R?I/70:20);if(LE.stress>=3){LE.burnt=true;LE.pop=0.8;}}
  LE.pop=Math.max(0,LE.pop-dt);LE.I=LE.burnt?0:I;}
function drawLE(){const c=$('cLed'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=50,B=200,R=ledR[LE.k],I=LE.I;batt(ctx,60,T,B,'9V');
  W(ctx,[[60,T],[200,T]],PAL.ink2);
  if(R)__PR(ctx,{t:'part',k:'res',a:[200,T],b:[280,T],o:{label:['','100 Ω','470 Ω','1 kΩ','10 kΩ'][LE.k]}});else __PR(ctx,{t:'wire',pts:[[200,T],[280,T]]});
  if(R){ctx.fillStyle=PAL.canvas;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=3;ctx.fillRect(200,T-12,80,24);ctx.strokeRect(200,T-12,80,24);arrowText(ctx,['','100 Ω','470 Ω','1 kΩ','10 kΩ'][LE.k],240,T+5,PAL.ink,12);}
  else{W(ctx,[[200,T],[280,T]],PAL.bad);arrowText(ctx,'just a wire!',240,T-18,PAL.bad,12);}
  W(ctx,[[280,T],[340,T]],PAL.ink2);
  const b=LE.burnt?0:Math.min(1,Math.sqrt(I/20));ledV(ctx,340,T,B,b);if(LE.burnt&&ctx.canvas.__rec){const r=ctx.canvas.__rec.filter(r=>r.k==='led').pop();if(r)r.o.burnt=true;}W(ctx,[[340,B],[60,B]],PAL.ink2);
  if(LE.burnt){ctx.fillStyle='#1c1917';ctx.beginPath();ctx.arc(340,(T+B)/2,13,0,7);ctx.fill();arrowText(ctx,'burnt',372,(T+B)/2+22,PAL.bad,12,'left');}
  if(LE.pop>0)arrowText(ctx,'💥 POP!',340,T-10,PAL.yellow,22);
  // explanation panel
  const x=460;ctx.textAlign='left';
  arrowText(ctx,'I = (9 V − 2 V) ÷ R',x,60,PAL.yellow,16,'left');
  arrowText(ctx,R?'= 7 V ÷ '+(R*1000)+' Ω = '+fmtI(7/R):'= 7 V ÷ almost 0 Ω = HUGE',x,88,PAL.ink,15,'left');
  let msg,col;
  if(LE.burnt){msg='LED destroyed: no current flows now';col=PAL.bad;}
  else if(!R){msg='Way over 20 mA: burns instantly';col=PAL.bad;}
  else if(7/R>25){msg='Over the 20 mA limit: overheating…';col=PAL.bad;}
  else if(7/R>10){msg='Safe and bright ✓';col=PAL.good;}
  else if(7/R>3){msg='Safe, a bit dimmer ✓';col=PAL.good;}
  else {msg='Safe but dim';col=PAL.amber;}
  arrowText(ctx,msg,x,126,col,15,'left');
  ctx.fillStyle=PAL.line;ctx.fillRect(x,150,300,14);ctx.fillStyle=I>20?PAL.bad:PAL.good;ctx.fillRect(x,150,Math.min(300,300*I/40),14);
  ctx.strokeStyle=PAL.redLight;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+150,145);ctx.lineTo(x+150,169);ctx.stroke();
  arrowText(ctx,'current',x,184,PAL.muted,12,'left');arrowText(ctx,'20 mA max',x+150,184,PAL.redLight,12);}

// ===== 7B. Divider / pot =====
const DV={t:0};
function drawDV(dt){DV.t+=dt;const c=$('cDiv'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const p=+$('pot').value,Vout=9*p,x=260,top=40,bot=220;
  batt(ctx,80,top,bot,'9V');W(ctx,[[80,top],[x,top]],PAL.ink2);W(ctx,[[80,bot],[x,bot]],PAL.ink2);
  // pot body (long resistor)
  ctx.fillStyle=PAL.canvas;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=3;ctx.fillRect(x-14,top+15,28,bot-top-30);ctx.strokeRect(x-14,top+15,28,bot-top-30);
  W(ctx,[[x,top],[x,top+15]],PAL.ink2);W(ctx,[[x,bot-15],[x,bot]],PAL.ink2);
  const wy=bot-15-(bot-top-30)*p;
  __PR(ctx,{t:'part',k:'res',a:[x,top+15],b:[x,wy],o:{label:(10*(1-p)).toFixed(1)+' kΩ'}});__PR(ctx,{t:'part',k:'res',a:[x,wy],b:[x,bot-15],o:{label:(10*p).toFixed(1)+' kΩ'}});__PR(ctx,{t:'wire',pts:[[x,wy],[x+32,wy],[350,wy],[350,top+85],[380,top+85]]});
  ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.moveTo(x+16,wy);ctx.lineTo(x+32,wy-8);ctx.lineTo(x+32,wy+8);ctx.fill();
  W(ctx,[[x+32,wy],[350,wy],[350,top+85],[380,top+85]],PAL.yellow);
  arrowText(ctx,'R1 = '+(10*(1-p)).toFixed(1)+' kΩ',x-24,(top+15+wy)/2+4,PAL.muted,12,'right');
  arrowText(ctx,'R2 = '+(10*p).toFixed(1)+' kΩ',x-24,(wy+bot-15)/2+4,PAL.muted,12,'right');
  arrowText(ctx,'wiper (slider)',x+40,wy+22,PAL.yellow,11,'left');
  // amp + speaker
  ctx.fillStyle='#ecfdf5';ctx.fillRect(380,top+60,70,50);arrowText(ctx,'amp',415,top+90,PAL.tealDark,14);
  ctx.fillStyle=PAL.ink2;ctx.fillRect(470,top+70,16,30);ctx.beginPath();ctx.moveTo(486,top+70);ctx.lineTo(510,top+55);ctx.lineTo(510,top+115);ctx.lineTo(486,top+100);ctx.fill();
  W(ctx,[[450,top+85],[470,top+85]],PAL.ink2);
  ctx.strokeStyle=PAL.blue;ctx.lineWidth=3;for(let i=0;i<3;i++){const r=14+i*14+((DV.t*30)%14);ctx.globalAlpha=p*(1-i*0.3);ctx.beginPath();ctx.arc(505,top+85,r,-0.6,0.6);ctx.stroke();}ctx.globalAlpha=1;
  arrowText(ctx,'Vout = 9 V × R2 ÷ (R1 + R2)',588,top+40,PAL.yellow,14,'left');
  arrowText(ctx,'= 9 × '+(10*p).toFixed(1)+' ÷ 10 = '+Vout.toFixed(1)+' V',588,top+66,PAL.ink,14,'left');
  arrowText(ctx,'Volume: '+Math.round(p*100)+'%',588,top+110,PAL.blue,18,'left');
  arrowText(ctx,'Knob up = slider closer to +9 V',588,top+140,PAL.muted,12,'left');}

// ===== 7C. Pull-up =====
const PU={pull:1,pressed:false,t:0,v:1,h:[],n:0.5};
choices('pullChoices',['Without pull-up','With 10 kΩ pull-up'],0,i=>PU.pull=i);
const pb=$('pullBtn');hold(pb,on=>{PU.pressed=on;});
pb.style.touchAction='none';pb.style.userSelect='none';
function stepPU(dt){PU.t+=dt;PU.n+=(Math.random()-0.5)*dt*9;PU.n+= (0.5-PU.n)*dt*1.5;PU.n=Math.max(0,Math.min(1,PU.n));
  PU.v=PU.pressed?0:PU.pull?1:PU.n+0.15*Math.sin(PU.t*31);PU.h.push({t:PU.t,v:PU.v,th:0.5});prune(PU.h,PU.t,5);}
function drawPU(){const c=$('cPull'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const xin=230,y=130;
  // chip
  ctx.fillStyle=PAL.slate;ctx.fillRect(xin,y-40,90,80);arrowText(ctx,'CHIP',xin+45,y-6,PAL.white,14);
  const high=PU.v>0.5;arrowText(ctx,'reads: '+(high?'HIGH':'LOW'),xin+45,y+16,high?'#4ade80':PAL.redSoft,13);
  W(ctx,[[60,y],[xin,y]],PAL.ink2);dot(ctx,150,y);arrowText(ctx,'input pin',xin-6,y-8,PAL.muted,11,'right');
  // button to ground
  W(ctx,[[150,y],[150,y+30]],PAL.ink2);dot(ctx,150,y+30);dot(ctx,150,y+60);
  if(PU.pressed)W(ctx,[[156,y+30],[156,y+60]],PAL.good,4);else W(ctx,[[156,y+30],[176,y+56]],PAL.ink2,4);
  W(ctx,[[150,y+60],[150,y+90]],PAL.ink2);gndSym(ctx,150,y+90);arrowText(ctx,'button',170,y+48,PAL.muted,11,'left');arrowText(ctx,'0 V',172,y+100,PAL.muted,11,'left');
  // pull-up
  if(PU.pull){W(ctx,[[150,y],[150,y-20]],PAL.ink2);ctx.fillStyle=PAL.canvas;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=3;ctx.fillRect(140,y-80,20,60);ctx.strokeRect(140,y-80,20,60);
    W(ctx,[[150,y-80],[150,y-100],[100,y-100]],PAL.ink2);arrowText(ctx,'+5 V',94,y-96,PAL.redSoft,13,'right');arrowText(ctx,'10 kΩ',168,y-46,PAL.ink,12,'left');}
  else {arrowText(ctx,'⚡ noise',90,y-20,PAL.yellow,12);arrowText(ctx,'(connected to nothing)',100,y-50,PAL.muted,11);}
  plot(ctx,400,30,380,170,PU.h,PU.t,5,[{k:'v',col:PAL.blue,label:'input voltage'},{k:'th',col:PAL.bad,dash:[6,4],lw:1.5,label:'HIGH above / LOW below'}],-0.05,1.1,'what the chip sees');
  arrowText(ctx,PU.pull?'Steady HIGH, clean LOW when pressed ✓':'Not pressed: floating, random readings ✗',590,250,PU.pull?PAL.good:PAL.redSoft,13);}

// ===== 7D. RC timer =====
const RT={vc:0.33,charging:true,t:0,h:[],flash:0};
function rcR(){return Math.pow(10,+$('rcR').value);} // kΩ 1..50
function stepRT(dt){const R=rcR(),tau=R*1000*100e-6;$('rcRt').textContent=fmtR(R)+' → R×C = '+tau.toFixed(2)+' s';
  RT.t+=dt;if(RT.charging){RT.vc+=(1-RT.vc)*dt/tau;if(RT.vc>=0.667){RT.charging=false;RT.flash=1;}}
  else{RT.vc+=(0-RT.vc)*dt/tau;if(RT.vc<=0.333)RT.charging=true;}
  RT.h.push({t:RT.t,v:RT.vc,hi:0.667,lo:0.333});prune(RT.h,RT.t,8);}
function drawRT(){const c=$('cRC'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const on=!RT.charging;ledV(ctx,120,40,180,on?1:0);arrowText(ctx,on?'LED ON':'LED off',120,210,on?PAL.redSoft:PAL.muted,14);
  plot(ctx,260,20,520,170,RT.h,RT.t,8,[{k:'v',col:PAL.blue,label:'capacitor charge'},{k:'hi',col:PAL.amber,dash:[5,4],lw:1.5,label:'⅔: flash'},{k:'lo',col:PAL.muted,dash:[5,4],lw:1.5,label:'⅓: refill'}],0,1,'last 8 seconds');}

// ===== 8. Colour code =====
const COLS=[['black','#000'],['brown','#8b4513'],['red',PAL.redDark],['orange',PAL.orange],['yellow',PAL.yellowSoft],['green',PAL.greenDark],['blue',PAL.blueDark],['violet','#7c3aed'],['grey',PAL.gray],['white','#f8fafc']];
const TOL=[['gold','#d4af37','±5%'],['silver','#c0c0c0','±10%'],['brown','#8b4513','±1%']];
const CC=[1,0,2,0];
(function(){const el=$('ccSel');['1st digit','2nd digit','Multiplier','Tolerance'].forEach((l,i)=>{const lab=document.createElement('label');lab.className='slider';lab.textContent=l+' ';
  const s=document.createElement('select');s.style.cssText=('font:inherit;padding:6px;border-radius:6px;background:'+PAL.line+';color:'+PAL.ink+';border:1px solid '+PAL.line);
  (i<3?COLS:TOL).forEach((c,j)=>{const o=document.createElement('option');o.value=j;o.textContent=c[0]+(i<2?' ('+j+')':i===2?' (×'+(j?'1'+'0'.repeat(j):'1')+')':' ('+c[2]+')');s.appendChild(o);});
  s.value=CC[i];s.onchange=()=>{CC[i]=+s.value;drawCC();};lab.appendChild(s);el.appendChild(lab);});})();
function drawCC(){const c=$('cCC'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const y=60;W(ctx,[[40,y],[150,y]],PAL.ink2,4);W(ctx,[[350,y],[460,y]],PAL.ink2,4);
  ctx.fillStyle='#dec4a0';ctx.beginPath();ctx.roundRect(150,y-30,200,60,22);ctx.fill();
  [[175,COLS[CC[0]][1]],[205,COLS[CC[1]][1]],[235,COLS[CC[2]][1]],[305,TOL[CC[3]][1]]].forEach(([x,cc])=>{ctx.fillStyle=cc;ctx.fillRect(x,y-30,14,60);});
  const ohms=(CC[0]*10+CC[1])*Math.pow(10,CC[2]);
  const f=ohms>=1e6?(ohms/1e6)+' MΩ':ohms>=1e3?(ohms/1e3)+' kΩ':ohms+' Ω';
  arrowText(ctx,'('+CC[0]+CC[1]+') × '+Math.pow(10,CC[2]).toLocaleString('en')+' =',500,y-6,PAL.muted,14,'left');
  arrowText(ctx,f+'  '+TOL[CC[3]][2],500,y+24,PAL.yellow,24,'left');
  arrowText(ctx,'Common: 220 Ω red-red-brown · 1 kΩ brown-black-red · 10 kΩ brown-black-orange',400,135,PAL.muted,12);}
drawCC();

// ===== Symbols =====
(function(){const c=$('cSymR'),ctx=c.getContext('2d');ctx.strokeStyle=PAL.ink;ctx.lineWidth=3;
  let y=70;W(ctx,[[20,y],[60,y]],PAL.ink);ctx.strokeRect(60,y-12,70,24);W(ctx,[[130,y],[170,y]],PAL.ink);arrowText(ctx,'IEC / Europe',95,y+44,PAL.muted,12);
  W(ctx,[[210,y],[245,y]],PAL.ink);ctx.beginPath();ctx.moveTo(245,y);for(let i=0;i<6;i++)ctx.lineTo(251+i*11,y+(i%2?-10:10));ctx.lineTo(320,y);ctx.stroke();W(ctx,[[320,y],[360,y]],PAL.ink);arrowText(ctx,'US',285,y+44,PAL.muted,12);})();

// ===== Loop =====
loop((dt,now)=>{
  drawFL(dt);drawSP(dt);stepHT(dt);drawHT();stepLE(dt);drawLE();drawDV(dt);stepPU(dt);drawPU();stepRT(dt);drawRT();});


})();
