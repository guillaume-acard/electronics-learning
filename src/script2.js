<script>
// ===== Helpers for schematics and plots =====
function W(ctx,pts,col='#334155',lw=3){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.lineJoin='round';ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();}
function dot(ctx,x,y){ctx.fillStyle='#334155';ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill();}
function resV(ctx,x,y1,y2,label){const m=(y1+y2)/2;W(ctx,[[x,y1],[x,m-24]]);ctx.beginPath();ctx.moveTo(x,m-24);for(let i=0;i<6;i++)ctx.lineTo(x+(i%2?-8:8),m-20+i*8);ctx.lineTo(x,m+24);ctx.stroke();W(ctx,[[x,m+24],[x,y2]]);if(label)arrowText(ctx,label,x+14,m+4,'#334155',12,'left');}
function capV(ctx,x,y1,y2,label,faded){const m=(y1+y2)/2,col=faded?'#cbd5e1':'#334155';W(ctx,[[x,y1],[x,m-6]],col);W(ctx,[[x,m+6],[x,y2]],col);ctx.fillStyle=col;ctx.fillRect(x-18,m-8,36,4);ctx.fillRect(x-18,m+4,36,4);if(label)arrowText(ctx,label,x+24,m+4,faded?'#94a3b8':'#2563eb',12,'left');}
function capH(ctx,x1,x2,y,label){const m=(x1+x2)/2;W(ctx,[[x1,y],[m-6,y]]);W(ctx,[[m+6,y],[x2,y]]);ctx.fillStyle='#334155';ctx.fillRect(m-8,y-18,4,36);ctx.fillRect(m+4,y-18,4,36);if(label)arrowText(ctx,label,m,y-26,'#2563eb',12);}
function batt(ctx,x,y1,y2,label){const m=(y1+y2)/2;W(ctx,[[x,y1],[x,m-6]]);W(ctx,[[x,m+6],[x,y2]]);ctx.fillStyle='#334155';ctx.fillRect(x-18,m-8,36,4);ctx.fillRect(x-10,m+4,20,6);arrowText(ctx,'+',x+22,m-6,'#dc2626',14);if(label)arrowText(ctx,label,x-24,m+4,'#334155',12,'right');}
function glow(ctx,x,y,b,col='255,80,60'){if(b<=0.01)return;const g=ctx.createRadialGradient(x,y,2,x,y,46);g.addColorStop(0,`rgba(${col},${0.9*b})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,46,0,7);ctx.fill();}
function ledV(ctx,x,y1,y2,b){const m=(y1+y2)/2;glow(ctx,x,m,b);W(ctx,[[x,y1],[x,m-10]]);W(ctx,[[x,m+10],[x,y2]]);ctx.fillStyle=b>0.05?`rgb(255,${Math.round(200-150*b)},${Math.round(200-160*b)})`:'#fff';ctx.strokeStyle='#334155';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x-12,m-10);ctx.lineTo(x+12,m-10);ctx.lineTo(x,m+10);ctx.closePath();ctx.fill();ctx.stroke();W(ctx,[[x-12,m+10],[x+12,m+10]]);arrowText(ctx,'LED',x+20,m+4,'#334155',12,'left');}
function gndSym(ctx,x,y){W(ctx,[[x-14,y],[x+14,y]]);W(ctx,[[x-9,y+6],[x+9,y+6]]);W(ctx,[[x-4,y+12],[x+4,y+12]]);}
function plot(ctx,x,y,w,h,hist,tNow,span,series,min,max,title){
  ctx.fillStyle='#fff';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#e3e7ef';ctx.lineWidth=1;ctx.strokeRect(x,y,w,h);
  if(title)arrowText(ctx,title,x+2,y-7,'#5b6475',12,'left');
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

// ===== Size explorer =====
function fmtC(c){const u=[[1,'F'],[1e-3,'mF'],[1e-6,'µF'],[1e-9,'nF'],[1e-12,'pF']];for(const [v,n] of u){if(c>=v*0.999){const x=c/v;return (x>=100?x.toFixed(0):x>=10?x.toFixed(0):x.toFixed(1))+' '+n;}}return (c/1e-12).toFixed(1)+' pF';}
function fmtT(s){if(s<1e-6)return (s*1e9).toFixed(0)+' nanoseconds';if(s<1e-3)return (s*1e6).toFixed(0)+' microseconds';if(s<1)return (s*1e3).toFixed(0)+' milliseconds';if(s<120)return s.toFixed(1)+' seconds';return (s/60).toFixed(0)+' minutes';}
function drawSize(){
  const c=$('cSize'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const e=+$('sSize').value, C=Math.pow(10,e), fill=5*1000*C, k=(e+11)/11;
  const cats=[[1e-9,'🥄 Thimble','Radio tuning, high-frequency filters, crystal oscillators'],[1e-6,'☕ Cup','Decoupling next to chips, tone controls, noise filters'],[1e-4,'🪣 Bucket','Audio coupling, timing and blinking, LED fade-outs'],[0.1,'🛁 Bathtub','Power supply smoothing, amp energy reserves'],[1e9,'🏊 Swimming pool (supercap)','Memory backup, quick-charge torches, braking energy']];
  const cat=cats.find(x=>C<x[0]);
  const w=30+k*170,h=24+k*150,x0=140-w/2,y0=205-h;
  ctx.fillStyle='#bcd6fb';ctx.fillRect(x0,y0+h*0.3,w,h*0.7);ctx.strokeStyle='#334155';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0,y0+h);ctx.lineTo(x0+w,y0+h);ctx.lineTo(x0+w,y0);ctx.stroke();
  arrowText(ctx,fmtC(C),330,60,'#1d2433',34,'left');
  arrowText(ctx,cat[1],330,100,'#2563eb',20,'left');
  arrowText(ctx,'Used for: '+cat[2],330,135,'#334155',15,'left');
  const cmp=fill<1e-6?'a million times faster than a blink':fill<0.1?'faster than a blink':fill<10?'a few heartbeats':fill<300?'time to make a sandwich':'go make a coffee…';
  arrowText(ctx,'Fills through 1 kΩ in about '+fmtT(fill),330,170,'#334155',15,'left');
  arrowText(ctx,'('+cmp+')',330,193,'#5b6475',14,'left');
}
$('sSize').oninput=drawSize; drawSize();

// ===== A. Fading LED =====
const FA={C:1,pressed:false,vc:0,t:0,h:[]}, fadeTau=[0.04,0.5,4];
choices('fChoices',['10 µF','100 µF','1000 µF'],1,i=>FA.C=i);
const fp=$('fPress');
['pointerdown'].forEach(ev=>fp.addEventListener(ev,e=>{e.preventDefault();FA.pressed=true;}));
['pointerup','pointerleave','pointercancel'].forEach(ev=>fp.addEventListener(ev,()=>FA.pressed=false));
function stepFade(dt){FA.t+=dt;FA.vc+= FA.pressed?(1-FA.vc)*dt/0.05:-FA.vc*dt/fadeTau[FA.C];
  FA.b=FA.pressed?1:Math.max(0,(FA.vc-0.15)/0.85);FA.h.push({t:FA.t,b:FA.b,q:FA.vc});prune(FA.h,FA.t,8);}
function drawFade(){const c=$('cFade'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=50,B=210;batt(ctx,50,T,B,'9V');
  W(ctx,[[50,T],[100,T]]);dot(ctx,100,T);dot(ctx,150,T);
  if(FA.pressed)W(ctx,[[100,T-6],[150,T-6]],'#10b981',4);else W(ctx,[[100,T-6],[146,T-26]],'#334155',4);
  arrowText(ctx,'button',125,T+22,'#334155',12);
  W(ctx,[[150,T],[320,T]]);dot(ctx,220,T);
  capV(ctx,220,T,B,['10 µF','100 µF','1000 µF'][FA.C]);
  resV(ctx,320,T,T+80,'470 Ω');ledV(ctx,320,T+80,B,FA.b);
  W(ctx,[[50,B],[320,B]]);dot(ctx,220,B);
  // charge bar
  ctx.fillStyle='#e5e9f2';ctx.fillRect(250,T+24,12,70);ctx.fillStyle='#3b82f6';ctx.fillRect(250,T+24+70*(1-FA.vc),12,70*FA.vc);
  plot(ctx,420,30,360,170,FA.h,FA.t,8,[{k:'q',col:'#3b82f6',label:'capacitor charge'},{k:'b',col:'#ef4444',label:'LED brightness'}],-0.05,1.1,'last 8 seconds');
}

// ===== B. Smoothing =====
const PS={C:0,t:0,vout:0,h:[]}, smTau=[0,0.15,1.2,10];
choices('pChoices',['No capacitor','10 µF','100 µF','1000 µF'],0,i=>PS.C=i);
function stepSmooth(dt){PS.t+=dt;const vin=Math.max(0,Math.sin(2*Math.PI*PS.t));
  if(PS.C===0)PS.vout=vin;else if(vin>PS.vout)PS.vout=vin;else PS.vout-=PS.vout*dt/smTau[PS.C];
  PS.h.push({t:PS.t,vin,vout:PS.vout});prune(PS.h,PS.t,4);}
function drawSmooth(){const c=$('cSmooth'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=50,B=210;
  // AC source
  W(ctx,[[50,T],[50,110]]);W(ctx,[[50,150],[50,B]]);ctx.strokeStyle='#334155';ctx.lineWidth=3;ctx.beginPath();ctx.arc(50,130,20,0,7);ctx.stroke();
  ctx.beginPath();for(let i=0;i<=20;i++){const x=38+i*1.2,y=130-8*Math.sin(i/20*2*Math.PI);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  arrowText(ctx,'AC in',22,134,'#334155',12,'right');
  // diode
  W(ctx,[[50,T],[110,T]]);ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(110,T-12);ctx.lineTo(132,T);ctx.lineTo(110,T+12);ctx.closePath();ctx.fill();ctx.stroke();W(ctx,[[132,T-12],[132,T+12]]);
  arrowText(ctx,'diode (one-way valve)',122,T-20,'#334155',12);
  W(ctx,[[132,T],[320,T]]);dot(ctx,210,T);
  capV(ctx,210,T,B,PS.C?['','10 µF','100 µF','1000 µF'][PS.C]:'(none)',PS.C===0);
  // lamp
  glow(ctx,320,130,PS.vout,'255,200,60');W(ctx,[[320,T],[320,112]]);W(ctx,[[320,148],[320,B]]);
  ctx.fillStyle='#fff8';ctx.beginPath();ctx.arc(320,130,18,0,7);ctx.fill();ctx.stroke();W(ctx,[[307,117],[333,143]]);W(ctx,[[333,117],[307,143]]);
  arrowText(ctx,'lamp',346,134,'#334155',12,'left');
  W(ctx,[[50,B],[320,B]]);dot(ctx,210,B);
  plot(ctx,420,30,360,170,PS.h,PS.t,4,[{k:'vin',col:'#94a3b8',dash:[5,4],lw:2,label:'bumps after diode'},{k:'vout',col:'#3b82f6',label:'output to lamp'}],-0.05,1.1,'voltage (slowed down)');
  let mn=1;PS.h.forEach(p=>{if(p.t>PS.t-1.1)mn=Math.min(mn,p.vout);});
  arrowText(ctx,'ripple (dip): '+Math.round((1-mn)*100)+'%',780,22,mn>0.85?'#059669':'#ef4444',13,'right');
}

// ===== C. Coupling =====
const KC={C:2,t:0,vc:0.6,h:[]}, kTau=[0.03,0.2,3];
choices('kChoices',['100 pF (tinny)','1 nF (thin)','100 nF (full sound)'],2,i=>KC.C=i);
function stepCouple(dt){KC.t+=dt;const t=KC.t;const vin=0.6+0.25*Math.sin(2*Math.PI*0.7*t)+0.12*Math.sin(2*Math.PI*5*t);
  KC.vc+=(vin-KC.vc)*dt/kTau[KC.C];KC.h.push({t,vin,out:vin-KC.vc});prune(KC.h,t,4);}
function drawCouple(){const c=$('cCouple'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const y=110;
  ctx.fillStyle='#fef3c7';ctx.strokeStyle='#b45309';ctx.lineWidth=2;ctx.fillRect(20,y-35,100,70);ctx.strokeRect(20,y-35,100,70);
  arrowText(ctx,'Guitar /',70,y-6,'#b45309',13);arrowText(ctx,'previous stage',70,y+12,'#b45309',13);
  W(ctx,[[120,y],[160,y]]);capH(ctx,160,230,y,['100 pF','1 nF','100 nF'][KC.C]);W(ctx,[[230,y],[290,y]]);
  ctx.fillStyle='#ecfdf5';ctx.strokeStyle='#059669';ctx.lineWidth=2;ctx.fillRect(290,y-35,100,70);ctx.strokeRect(290,y-35,100,70);
  arrowText(ctx,'Next stage',340,y-6,'#059669',13);arrowText(ctx,'(amplifier)',340,y+12,'#059669',13);
  arrowText(ctx,'DC + music →',140,y+40,'#5b6475',12);arrowText(ctx,'music only →',262,y+40,'#5b6475',12);
  // bass/treble bars
  const g=f=>{const wt=2*Math.PI*f*kTau[KC.C];return wt/Math.sqrt(1+wt*wt);};
  [['Bass',g(0.7),'#7c3aed'],['Treble',g(5),'#0891b2']].forEach(([n,v],i)=>{const yy=190+i*28;arrowText(ctx,n,70,yy+10,'#334155',13,'right');
    ctx.fillStyle='#e5e9f2';ctx.fillRect(80,yy,240,14);ctx.fillStyle=i?'#0891b2':'#7c3aed';ctx.fillRect(80,yy,240*v,14);arrowText(ctx,Math.round(v*100)+'% gets through',330,yy+11,'#334155',12,'left');});
  plot(ctx,450,22,330,85,KC.h,KC.t,4,[{k:'vin',col:'#b45309',label:''}],-0.1,1.05,'Before the capacitor: music riding on DC');
  plot(ctx,450,150,330,85,KC.h,KC.t,4,[{k:'out',col:'#059669',label:''}],-0.5,0.5,'After the capacitor: music only, centred on 0');
}

// ===== D. Decoupling =====
const DC={on:false,t:0,v:1,h:[],glitch:0};
$('dToggle').onclick=()=>{DC.on=!DC.on;$('dToggle').className=DC.on?'active':'';$('dToggle').textContent=DC.on?'Remove the 100 nF capacitor':'Add the 100 nF capacitor';};
function stepDecouple(dt){DC.t+=dt;const load=(DC.t%0.7)<0.07?1.5:0;const Cf=DC.on?1:0.1;
  DC.v+=((1-DC.v)/0.12-load*0.6/Cf)*dt;if(DC.v<0.75)DC.glitch=0.5;DC.glitch=Math.max(0,DC.glitch-dt);
  DC.h.push({t:DC.t,v:DC.v,th:0.75});prune(DC.h,DC.t,4);}
function drawDecouple(){const c=$('cDecouple'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=50,B=210;batt(ctx,40,T,B,'5V');
  W(ctx,[[40,T],[80,T]]);ctx.strokeStyle='#334155';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(80,T);
  for(let i=0;i<=40;i++)ctx.lineTo(80+i*3,T+6*Math.sin(i/2));ctx.stroke();
  arrowText(ctx,'long wire',140,T-14,'#5b6475',12);
  W(ctx,[[200,T],[330,T],[330,95]]);dot(ctx,265,T);
  capV(ctx,265,T,B,DC.on?'100 nF':'missing!',!DC.on);
  const bad=DC.glitch>0;
  ctx.fillStyle=bad?'#fee2e2':'#1e293b';ctx.fillRect(295,95,70,70);
  for(let i=0;i<4;i++){ctx.fillStyle='#94a3b8';ctx.fillRect(285,102+i*16,10,5);ctx.fillRect(365,102+i*16,10,5);}
  arrowText(ctx,'CHIP',330,125,bad?'#b91c1c':'#fff',14);arrowText(ctx,bad?'GLITCH!':'OK',330,145,bad?'#b91c1c':'#4ade80',13);
  W(ctx,[[330,165],[330,B],[40,B]]);dot(ctx,265,B);
  arrowText(ctx,'chip takes sudden gulps of current',330,240,'#5b6475',12);
  plot(ctx,420,30,360,170,DC.h,DC.t,4,[{k:'v',col:'#3b82f6',label:'voltage at the chip'},{k:'th',col:'#ef4444',dash:[6,4],lw:1.5,label:'below this the chip glitches'}],0.3,1.05,'');
}

// ===== Loop =====
let last2=performance.now();
function frame2(now){const dt=Math.min(0.05,(now-last2)/1000);last2=now;
  stepFade(dt);stepSmooth(dt);stepCouple(dt);stepDecouple(dt);
  drawFade();drawSmooth();drawCouple();drawDecouple();requestAnimationFrame(frame2);}
requestAnimationFrame(frame2);
</script>
