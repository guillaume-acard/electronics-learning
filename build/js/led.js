
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

const $ = id => document.getElementById(id);
function loopPath(ctx, x1, y1, x2, y2){ctx.beginPath(); ctx.moveTo(x1,(y1+y2)/2); ctx.lineTo(x1,y1); ctx.lineTo(x2,y1); ctx.lineTo(x2,y2); ctx.lineTo(x1,y2); ctx.closePath();}
function arrowText(ctx, txt, x, y, color='#94a3b8', size=14, align='center'){ctx.fillStyle=color; ctx.font=`600 ${size}px system-ui,sans-serif`; ctx.textAlign=align; ctx.fillText(txt,x,y);}
// ===== Helpers for schematics and plots =====
function W(ctx,pts,col='#cbd5e1',lw=3){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.lineJoin='round';ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();}
function dot(ctx,x,y){ctx.fillStyle='#cbd5e1';ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill();}
function resV(ctx,x,y1,y2,label){const m=(y1+y2)/2;W(ctx,[[x,y1],[x,m-24]]);ctx.beginPath();ctx.moveTo(x,m-24);for(let i=0;i<6;i++)ctx.lineTo(x+(i%2?-8:8),m-20+i*8);ctx.lineTo(x,m+24);ctx.stroke();W(ctx,[[x,m+24],[x,y2]]);if(label)arrowText(ctx,label,x+14,m+4,'#cbd5e1',12,'left');}
function capV(ctx,x,y1,y2,label,faded){const m=(y1+y2)/2,col=faded?'#475569':'#cbd5e1';W(ctx,[[x,y1],[x,m-6]],col);W(ctx,[[x,m+6],[x,y2]],col);ctx.fillStyle=col;ctx.fillRect(x-18,m-8,36,4);ctx.fillRect(x-18,m+4,36,4);if(label)arrowText(ctx,label,x+24,m+4,faded?'#94a3b8':'#2563eb',12,'left');}
function capH(ctx,x1,x2,y,label){const m=(x1+x2)/2;W(ctx,[[x1,y],[m-6,y]]);W(ctx,[[m+6,y],[x2,y]]);ctx.fillStyle='#cbd5e1';ctx.fillRect(m-8,y-18,4,36);ctx.fillRect(m+4,y-18,4,36);if(label)arrowText(ctx,label,m,y-26,'#2563eb',12);}
function batt(ctx,x,y1,y2,label){const m=(y1+y2)/2;W(ctx,[[x,y1],[x,m-6]]);W(ctx,[[x,m+6],[x,y2]]);ctx.fillStyle='#cbd5e1';ctx.fillRect(x-18,m-8,36,4);ctx.fillRect(x-10,m+4,20,6);arrowText(ctx,'+',x+22,m-6,'#dc2626',14);if(label)arrowText(ctx,label,x-24,m+4,'#cbd5e1',12,'right');}
function glow(ctx,x,y,b,col='255,80,60'){if(b<=0.01)return;const g=ctx.createRadialGradient(x,y,2,x,y,46);g.addColorStop(0,`rgba(${col},${0.9*b})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,46,0,7);ctx.fill();}
function ledV(ctx,x,y1,y2,b){const m=(y1+y2)/2;glow(ctx,x,m,b);W(ctx,[[x,y1],[x,m-10]]);W(ctx,[[x,m+10],[x,y2]]);ctx.fillStyle=b>0.05?`rgb(255,${Math.round(200-150*b)},${Math.round(200-160*b)})`:'#fff';ctx.strokeStyle='#cbd5e1';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x-12,m-10);ctx.lineTo(x+12,m-10);ctx.lineTo(x,m+10);ctx.closePath();ctx.fill();ctx.stroke();W(ctx,[[x-12,m+10],[x+12,m+10]]);arrowText(ctx,'LED',x+20,m+4,'#cbd5e1',12,'left');}
function gndSym(ctx,x,y){W(ctx,[[x-14,y],[x+14,y]]);W(ctx,[[x-9,y+6],[x+9,y+6]]);W(ctx,[[x-4,y+12],[x+4,y+12]]);}
function plot(ctx,x,y,w,h,hist,tNow,span,series,min,max,title){
  ctx.fillStyle='#1e293b';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#2a3650';ctx.lineWidth=1;ctx.strokeRect(x,y,w,h);
  if(title)arrowText(ctx,title,x+2,y-7,'#94a3b8',12,'left');
  const X=t=>x+w-(tNow-t)/span*w, Y=v=>y+h-(v-min)/(max-min)*h;
  if(min<0&&max>0){ctx.setLineDash([4,4]);ctx.strokeStyle='#94a3b8';ctx.beginPath();ctx.moveTo(x,Y(0));ctx.lineTo(x+w,Y(0));ctx.stroke();ctx.setLineDash([]);arrowText(ctx,'0',x-6,Y(0)+4,'#94a3b8',11,'right');}
  series.forEach(s=>{ctx.setLineDash(s.dash||[]);ctx.strokeStyle=s.col;ctx.lineWidth=s.lw||2.5;ctx.beginPath();let st=false;
    hist.forEach(p=>{if(p.t<tNow-span)return;const xx=X(p.t),yy=Y(Math.max(min,Math.min(max,p[s.k])));st?ctx.lineTo(xx,yy):(ctx.moveTo(xx,yy),st=true);});ctx.stroke();ctx.setLineDash([]);});
  let lx=x;series.forEach(s=>{if(!s.label)return;ctx.fillStyle=s.col;ctx.fillRect(lx,y+h+11,12,3);arrowText(ctx,s.label,lx+16,y+h+16,s.col,11,'left');lx+=ctx.measureText(s.label).width+32;});
  return {X,Y};
}
function choices(id,labels,init,cb){const el=$(id);el.style.display='inline-flex';el.style.gap='8px';el.style.flexWrap='wrap';
  const bs=labels.map((l,i)=>{const b=document.createElement('button');b.textContent=l;b.onclick=()=>{bs.forEach(x=>x.className='');b.className='active';cb(i);};el.appendChild(b);return b;});
  bs[init].className='active';cb(init);}
function prune(h,t,span){while(h.length&&h[0].t<t-span)h.shift();}

function wrapText(ctx,txt,x,y,maxW,lh,color='#e2e8f0',size=13){ctx.font=`600 ${size}px system-ui,sans-serif`;ctx.fillStyle=color;ctx.textAlign='left';
  let line='';txt.split(' ').forEach(w=>{const t=line?line+' '+w:w;if(ctx.measureText(t).width>maxW&&line){ctx.fillText(line,x,y);y+=lh;line=w;}else line=t;});if(line)ctx.fillText(line,x,y);}

// ===== LED helpers =====
function ledI(V,Vf){return V<=0?0:20*Math.exp((V-Vf)/0.07);} // mA, 20 mA at Vf
function ledBulb(ctx,x,y,b,rgb='239,68,68',burnt=false,r=18){
  if(!burnt&&b>0.02){const g=ctx.createRadialGradient(x,y,2,x,y,r*3.2);g.addColorStop(0,`rgba(${rgb},${Math.min(1,b)})`);g.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*3.2,0,7);ctx.fill();}
  ctx.fillStyle=burnt?'#1c1917':`rgba(${rgb},${0.25+0.75*Math.min(1,b)})`;ctx.beginPath();ctx.arc(x,y-4,r,Math.PI,0);ctx.lineTo(x+r,y+r);ctx.lineTo(x-r,y+r);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#e2e8f0';ctx.lineWidth=1.5;ctx.stroke();}
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
  const T=50,B=200;batt(ctx,60,T,B,Vs.toFixed(1)+'V');W(ctx,[[60,T],[160,T]],'#cbd5e1');
  if(R){ctx.fillStyle='#0b1220';ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.fillRect(160,T-12,70,24);ctx.strokeRect(160,T-12,70,24);arrowText(ctx,'150 Ω',195,T+5,'#e2e8f0',12);}else W(ctx,[[160,T],[230,T]],'#cbd5e1');
  W(ctx,[[230,T],[300,T],[300,105]],'#cbd5e1');ledBulb(ctx,300,125,Math.sqrt(Math.min(I,25)/20),'239,68,68',LD.burnt);W(ctx,[[300,143],[300,B],[60,B]],'#cbd5e1');
  if(LD.pop>0)arrowText(ctx,'💥 POP!',300,90,'#fbbf24',20);
  arrowText(ctx,LD.burnt?'burnt out':I.toFixed(I<10?1:0)+' mA',340,130,LD.burnt?'#ef4444':I>20?'#ef4444':'#10b981',15,'left');
  // graph current vs supply voltage
  const gx=440,gy=30,gw=340,gh=190,X=v=>gx+v/5*gw,Y=i=>gy+gh-Math.min(i,60)/60*gh;
  ctx.fillStyle='#1e293b';ctx.fillRect(gx,gy,gw,gh);
  ctx.fillStyle='rgba(239,68,68,0.15)';ctx.fillRect(gx,gy,gw,Y(20)-gy);arrowText(ctx,'danger: over 20 mA',gx+gw-6,gy+16,'#fca5a5',11,'right');
  ctx.strokeStyle='#fca5a5';ctx.setLineDash([5,4]);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gx,Y(20));ctx.lineTo(gx+gw,Y(20));ctx.stroke();ctx.setLineDash([]);
  [[0,'#f87171','directly'],[150,'#60a5fa','with 150 Ω']].forEach(([r,col,l])=>{ctx.strokeStyle=col;ctx.lineWidth=r===R?3:1.5;ctx.globalAlpha=r===R?1:0.4;ctx.beginPath();
    for(let v=0;v<=5;v+=0.02){const xx=X(v),yy=Y(solveI(v,r,Vf));v===0?ctx.moveTo(xx,yy):ctx.lineTo(xx,yy);}ctx.stroke();ctx.globalAlpha=1;});
  arrowText(ctx,'directly: a wall',X(2.1),gy+gh-60,'#f87171',11,'left');arrowText(ctx,'with resistor: gentle',X(3.3),Y(solveI(3.3,150,Vf))+22,'#60a5fa',11,'left');
  ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(X(Vs),Y(solveI(Vs,R,Vf)),6,0,7);ctx.fill();
  arrowText(ctx,'0 V',gx,gy+gh+14,'#94a3b8',11);arrowText(ctx,'5 V',gx+gw,gy+gh+14,'#94a3b8',11);arrowText(ctx,'supply voltage →',gx+gw/2,gy+gh+28,'#94a3b8',11);arrowText(ctx,'current (0–60 mA)',gx,gy-8,'#94a3b8',11,'left');}

// ===== 4. Calculator =====
(function(){const s=$('kC');COLORS.forEach((c,i)=>{const o=document.createElement('option');o.value=i;o.textContent=c[0]+' ('+c[1]+' V)';s.appendChild(o);});
  ['kV','kC','kI'].forEach(id=>$(id).oninput=drawCalc);$('kRuby').onclick=()=>{$('kV').value=9;$('kC').value=0;$('kI').value=3;drawCalc();};})();
const E12=[1,1.2,1.5,1.8,2.2,2.7,3.3,3.9,4.7,5.6,6.8,8.2];
function nextE12(r){let d=Math.pow(10,Math.floor(Math.log10(r)));for(let k=0;k<3;k++){for(const e of E12){if(e*d>=r-1e-9)return e*d;}d*=10;}return r;}
const fmtOhm=r=>r>=1e6?+(r/1e6).toFixed(2)+' MΩ':r>=1000?+(r/1000).toFixed(2)+' kΩ':Math.round(r)+' Ω';
function drawCalc(){const c=$('cCalc'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const Vs=+$('kV').value,col=COLORS[+$('kC').value],I=+$('kI').value/1000;
  ledBulb(ctx,60,70,0.9,col[2],false,22);
  if(!(Vs>col[1])){arrowText(ctx,'The supply must be higher than the LED\'s '+col[1]+' V, or it can\'t light.',130,75,'#f87171',15,'left');return;}
  const R=(Vs-col[1])/I,Rs=nextE12(R),Ia=(Vs-col[1])/Rs*1000,P=(Vs-col[1])*Ia/1000;
  arrowText(ctx,'R = ('+Vs+' V − '+col[1]+' V) ÷ '+(I*1000)+' mA = '+fmtOhm(R),130,40,'#e2e8f0',15,'left');
  arrowText(ctx,'Use a standard '+fmtOhm(Rs)+' resistor',130,75,'#fbbf24',22,'left');
  arrowText(ctx,'→ actual current '+Ia.toFixed(1)+' mA · heat in resistor '+(P*1000).toFixed(0)+' mW '+(P>0.2?'⚠ use a ½ W resistor':'(¼ W is fine)'),130,106,'#94a3b8',13,'left');
  if(Ia>20)arrowText(ctx,'⚠ over 20 mA: lower the current',130,132,'#f87171',13,'left');}
drawCalc();

// ===== 5. Legs =====
(function(){const c=$('cLegs'),ctx=c.getContext('2d');const x=260,y=60;
  const g=ctx.createRadialGradient(x,y,4,x,y,70);g.addColorStop(0,'rgba(239,68,68,0.5)');g.addColorStop(1,'rgba(239,68,68,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,70,0,7);ctx.fill();
  ctx.fillStyle='rgba(239,68,68,0.75)';ctx.beginPath();ctx.arc(x,y,28,Math.PI,0);ctx.lineTo(x+28,y+44);ctx.lineTo(x-28,y+44);ctx.closePath();ctx.fill();
  ctx.fillRect(x-34,y+44,68,8);ctx.fillStyle='#0b1220';ctx.fillRect(x+28,y+44,8,8); // flat side on right
  ctx.fillStyle='#cbd5e1';ctx.fillRect(x-13,y+52,4,112);ctx.fillRect(x+9,y+52,4,82);
  ctx.fillStyle='#94a3b8';ctx.fillRect(x+2,y+10,12,30);ctx.fillRect(x-12,y+22,8,18); // anvil + post
  arrowText(ctx,'long leg = ANODE (+)',x-24,y+155,'#f87171',14,'right');arrowText(ctx,'short leg = CATHODE (−)',x+24,y+125,'#60a5fa',14,'left');
  arrowText(ctx,'flat edge = cathode side',x+42,y+50,'#94a3b8',12,'left');arrowText(ctx,'big "anvil" inside = cathode',x+42,y+22,'#94a3b8',12,'left');
  // symbol
  const sx=600,sy=100;W(ctx,[[sx-80,sy],[sx-14,sy]],'#e2e8f0');ctx.strokeStyle='#e2e8f0';ctx.fillStyle='#0b1220';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(sx-14,sy-14);ctx.lineTo(sx+14,sy);ctx.lineTo(sx-14,sy+14);ctx.closePath();ctx.fill();ctx.stroke();
  W(ctx,[[sx+14,sy-14],[sx+14,sy+14]],'#e2e8f0');W(ctx,[[sx+14,sy],[sx+80,sy]],'#e2e8f0');
  [[0,0],[12,6]].forEach(([dx,dy])=>{W(ctx,[[sx+2+dx,sy-20-dy],[sx+16+dx,sy-34-dy]],'#fbbf24',2);ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.moveTo(sx+18+dx,sy-36-dy);ctx.lineTo(sx+10+dx,sy-33-dy);ctx.lineTo(sx+15+dx,sy-28-dy);ctx.fill();});
  arrowText(ctx,'+',sx-80,sy-10,'#f87171',16);arrowText(ctx,'−',sx+80,sy-10,'#60a5fa',16);arrowText(ctx,'LED symbol: the arrows are light going out',sx,sy+44,'#94a3b8',12);})();

// ===== 6A. Multi LEDs =====
const ML={ind:0,t:0};
choices('mlChoices',['One shared resistor','One resistor each'],0,i=>ML.ind=i);
function drawML(dt){ML.t+=dt;const c=$('cMulti'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const vf=[1.95,2.0,2.05];let I;
  if(!ML.ind){const tot=(9-2.0)/150*1000;const w=vf.map(v=>Math.exp(-(v-1.95)/0.06));const s=w.reduce((a,b)=>a+b);I=w.map(x=>tot*x/s);}
  else I=vf.map(v=>(9-v)/470*1000);
  const T=40,B=210;batt(ctx,50,T,B,'9V');W(ctx,[[50,T],[120,T]],'#cbd5e1');W(ctx,[[50,B],[620,B]],'#cbd5e1');
  const xs=[260,420,580];
  if(!ML.ind){ctx.fillStyle='#0b1220';ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.fillRect(120,T-12,70,24);ctx.strokeRect(120,T-12,70,24);arrowText(ctx,'150 Ω',155,T+5,'#e2e8f0',12);W(ctx,[[190,T],[580,T]],'#cbd5e1');
    xs.forEach(x=>W(ctx,[[x,T],[x,105]],'#cbd5e1'));}
  else{W(ctx,[[120,T],[580,T]],'#cbd5e1');xs.forEach(x=>{W(ctx,[[x,T],[x,52]],'#cbd5e1');ctx.fillStyle='#0b1220';ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.fillRect(x-11,52,22,40);ctx.strokeRect(x-11,52,22,40);arrowText(ctx,'470',x+16,76,'#e2e8f0',11,'left');W(ctx,[[x,92],[x,105]],'#cbd5e1');});}
  xs.forEach((x,i)=>{const hot=I[i]>20;ledBulb(ctx,x,125,Math.sqrt(Math.min(I[i],25)/20));W(ctx,[[x,143],[x,B]],'#cbd5e1');
    arrowText(ctx,'Vf '+vf[i]+' V',x+26,118,'#94a3b8',11,'left');arrowText(ctx,I[i].toFixed(1)+' mA'+(hot?' 🔥':''),x+26,136,hot?'#ef4444':I[i]<8?'#fbbf24':'#10b981',13,'left');});
  arrowText(ctx,ML.ind?'Each LED gets its own ~15 mA: equal and safe ✓':'The LED with the lowest Vf hogs the current and overheats ✗',400,240,ML.ind?'#10b981':'#f87171',13);}

// ===== 6B. PWM =====
const PW={t:0};
function drawPW(dt){PW.t+=dt;const d=+$('pwD').value,f=Math.pow(10,+$('pwF').value);
  const c=$('cPWM'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const fast=f>25,phase=(PW.t*f)%1,on=phase<d,b=fast?d:(on?1:0);
  ledBulb(ctx,110,95,b,'239,68,68',false,26);
  arrowText(ctx,fast?'looks: '+Math.round(d*100)+'% bright (steady)':(on?'ON':'off'),110,175,fast?'#10b981':'#fbbf24',14);
  arrowText(ctx,f.toFixed(f<10?1:0)+' blinks per second',110,198,'#94a3b8',12);
  const gx=240,gy=40,gw=540,gh=120,win=Math.min(4,8/f);
  ctx.fillStyle='#1e293b';ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle='#f87171';ctx.lineWidth=2;ctx.beginPath();
  for(let px=0;px<=gw;px++){const t=PW.t-win+px/gw*win;const s=((t*f)%1+1)%1<d;const yy=s?gy+15:gy+gh-15;px?ctx.lineTo(gx+px,yy):ctx.moveTo(gx+px,yy);}ctx.stroke();
  ctx.strokeStyle='#10b981';ctx.setLineDash([6,4]);ctx.beginPath();const ya=gy+gh-15-(gh-30)*d;ctx.moveTo(gx,ya);ctx.lineTo(gx+gw,ya);ctx.stroke();ctx.setLineDash([]);
  arrowText(ctx,'average = '+Math.round(d*100)+'%',gx+gw-6,ya-6,'#10b981',12,'right');
  arrowText(ctx,'on',gx-6,gy+19,'#94a3b8',11,'right');arrowText(ctx,'off',gx-6,gy+gh-11,'#94a3b8',11,'right');
  arrowText(ctx,'showing the last '+(win<1?(win*1000).toFixed(0)+' ms':win.toFixed(1)+' s'),gx,gy+gh+18,'#94a3b8',11,'left');
  arrowText(ctx,fast?'Faster than ~25 blinks/s your eye can\'t see the flashing, only the average.':'Slow: you see it blink. Push the speed slider right.',gx+gw/2,gy+gh+48,'#e2e8f0',13);}

// ===== 6C. RGB =====
function drawRGB(){const c=$('cRGB'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const r=+$('rgbR').value,g=+$('rgbG').value,b=+$('rgbB').value;
  ctx.globalCompositeOperation='lighter';
  [[200,80,`rgba(255,0,0,${r/255})`],[250,80,`rgba(0,255,0,${g/255})`],[225,125,`rgba(0,0,255,${b/255})`]].forEach(([x,y,col])=>{ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,62,0,7);ctx.fill();});
  ctx.globalCompositeOperation='source-over';
  ctx.fillStyle=`rgb(${r},${g},${b})`;ctx.beginPath();ctx.arc(560,100,60,0,7);ctx.fill();ctx.strokeStyle='#e2e8f0';ctx.lineWidth=2;ctx.stroke();
  arrowText(ctx,'three LEDs overlapping',225,210,'#94a3b8',12);arrowText(ctx,'what your eye sees',560,190,'#94a3b8',12);
  arrowText(ctx,`R ${Math.round(r/2.55)}% · G ${Math.round(g/2.55)}% · B ${Math.round(b/2.55)}%`,560,212,'#e2e8f0',12);}
['rgbR','rgbG','rgbB'].forEach(id=>$(id).oninput=drawRGB);drawRGB();

let lastL=performance.now();
function frameL(now){const dt=Math.min(0.05,(now-lastL)/1000);lastL=now;drawLD(dt);drawML(dt);drawPW(dt);requestAnimationFrame(frameL);}
requestAnimationFrame(frameL);


})();
