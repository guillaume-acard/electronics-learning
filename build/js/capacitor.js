
// ================= capacitor =================
(function(){
const PG=document.getElementById('page-capacitor');
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

// ---------- Shared helpers ----------
const $ = id => document.getElementById(id);
function loopPath(ctx, x1, y1, x2, y2){
  ctx.beginPath(); ctx.moveTo(x1, (y1+y2)/2); ctx.lineTo(x1, y1); ctx.lineTo(x2, y1);
  ctx.lineTo(x2, y2); ctx.lineTo(x1, y2); ctx.closePath();
}
function arrowText(ctx, txt, x, y, color='#94a3b8', size=14, align='center'){
  ctx.fillStyle=color; ctx.font=`600 ${size}px system-ui,sans-serif`; ctx.textAlign=align; ctx.fillText(txt,x,y);
}

// ---------- Simulation 1: charge / hold / discharge ----------
const S = { mode:'idle', vc:0, vs:0.9, C:1.5, flow:0, t:0, hist:[], offW:0, offE:0, pumpAng:0 };
const tau = () => 0.55 * S.C;   // seconds per time constant

function setMode(m){
  S.mode = m;
  $('bCharge').className = m==='charge' ? 'active' : '';
  $('bHold').className   = m==='hold' ? 'active hold' : '';
  $('bDis').className    = m==='discharge' ? 'active dis' : '';
  const pill = $('rMode');
  const map = {idle:['idle','#2a3650','#e2e8f0'], charge:['charging','#3b82f6','#fff'], hold:['holding','#64748b','#fff'], discharge:['discharging','#f59e0b','#fff']};
  pill.textContent = map[m][0]; pill.style.background = map[m][1]; pill.style.color = map[m][2];
}
$('bCharge').onclick = () => setMode('charge');
$('bHold').onclick   = () => setMode('hold');
$('bDis').onclick    = () => setMode('discharge');
$('bReset').onclick  = () => { S.vc=0; S.hist=[]; setMode('idle'); };
$('sV').oninput = e => S.vs = +e.target.value;
$('sC').oninput = e => S.C = +e.target.value;

function step1(dt){
  let I = 0;
  if (S.mode==='charge')    I = (S.vs - S.vc);
  if (S.mode==='discharge') I = (0 - S.vc);
  S.vc += I * dt / tau();
  S.flow = I;
  S.offW -= I * dt * 260;
  S.offE += I * dt * 200;   // electrons go opposite to conventional current
  S.pumpAng += (S.mode==='charge' ? I : 0) * dt * 12;
  S.t += dt;
  S.hist.push([S.t, S.vc, I]);
  while (S.hist.length && S.hist[0][0] < S.t - 12) S.hist.shift();
}

function drawWater(){
  const c = $('cWater'), ctx = c.getContext('2d');
  ctx.clearRect(0,0,c.width,c.height);
  const X1=110, X2=700, Y1=80, Y2=240;
  // pipe body
  loopPath(ctx,X1,Y1,X2,Y2); ctx.strokeStyle='#bcd6fb'; ctx.lineWidth=26; ctx.lineJoin='round'; ctx.stroke();
  // flowing dashes
  loopPath(ctx,X1,Y1,X2,Y2); ctx.strokeStyle='#3b82f6'; ctx.lineWidth=6; ctx.setLineDash([16,14]);
  ctx.lineDashOffset = S.offW; ctx.stroke(); ctx.setLineDash([]);

  // narrow pipe (resistor) on bottom
  ctx.fillStyle='#94a3b8';
  ctx.fillRect(360,Y2-15,100,8); ctx.fillRect(360,Y2+7,100,8);
  arrowText(ctx,'narrow pipe = resistor',410,Y2+40);

  // capacitor chamber
  const cx=400, top=22, bot=138;
  const pressure = Math.max(0,Math.min(1,S.vc));
  ctx.fillStyle='#bcd6fb'; ctx.fillRect(cx-70,top,140,bot-top);
  const b = S.vc*55;
  // left (pushed) side tint
  ctx.beginPath(); ctx.moveTo(cx-70,top); ctx.lineTo(cx,top); ctx.quadraticCurveTo(cx+2*b,(top+bot)/2,cx,bot);
  ctx.lineTo(cx-70,bot); ctx.closePath();
  ctx.fillStyle=`rgba(37,99,235,${0.25+0.55*pressure})`; ctx.fill();
  ctx.strokeStyle='#cbd5e1'; ctx.lineWidth=3; ctx.strokeRect(cx-70,top,140,bot-top);
  // membrane
  ctx.beginPath(); ctx.moveTo(cx,top); ctx.quadraticCurveTo(cx+2*b,(top+bot)/2,cx,bot);
  ctx.strokeStyle='#dc2626'; ctx.lineWidth=5; ctx.stroke();
  arrowText(ctx,'rubber sheet = capacitor',cx,bot+20,'#dc2626');
  arrowText(ctx,`stretched ${Math.round(S.vc*100)}%`,cx,top-6,'#e2e8f0',13);

  // pump
  const px=X1, py=(Y1+Y2)/2, on = S.mode==='charge';
  ctx.beginPath(); ctx.arc(px,py,34,0,Math.PI*2);
  ctx.fillStyle = S.mode==='discharge' ? '#2a3650' : '#fef3c7'; ctx.fill();
  ctx.strokeStyle = S.mode==='discharge' ? '#475569' : '#b45309'; ctx.lineWidth=3; ctx.stroke();
  ctx.save(); ctx.translate(px,py); ctx.rotate(-S.pumpAng);
  ctx.strokeStyle = S.mode==='discharge' ? '#475569' : '#b45309'; ctx.lineWidth=4;
  for(let i=0;i<4;i++){ ctx.rotate(Math.PI/2); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(24,0); ctx.stroke(); }
  ctx.restore();
  arrowText(ctx, S.mode==='discharge' ? 'pump bypassed' : 'pump = battery', px+44, py+5, '#94a3b8', 13, 'left');
  if (S.mode==='discharge'){ // bypass pipe
    ctx.strokeStyle='#bcd6fb'; ctx.lineWidth=14; ctx.beginPath(); ctx.moveTo(px-50,py-50); ctx.lineTo(px-50,py+50); ctx.stroke();
  }

  // valve
  if (S.mode==='hold'){
    ctx.fillStyle='#64748b'; ctx.fillRect(225,Y1-22,10,44);
    arrowText(ctx,'valve closed: water trapped, sheet stays stretched',230+250,Y1+44,'#64748b',13);
  }
  // flow arrow text
  const f=S.flow;
  if (Math.abs(f)>0.02){
    arrowText(ctx, f>0 ? 'flow →' : '← flow', 560, Y1-22, f>0?'#3b82f6':'#f59e0b', 15);
  }
  arrowText(ctx,'No water passes through the sheet. It only bulges.',X2-24,Y2-30,'#94a3b8',13,'right');
}

function drawCircuit(){
  const c = $('cCirc'), ctx = c.getContext('2d');
  ctx.clearRect(0,0,c.width,c.height);
  const X1=110, X2=700, Y1=80, Y2=240, cx=400;
  // wires
  ctx.strokeStyle='#cbd5e1'; ctx.lineWidth=4; ctx.lineJoin='round';
  ctx.beginPath(); ctx.moveTo(X1,(Y1+Y2)/2-22); ctx.lineTo(X1,Y1); ctx.lineTo(cx-10,Y1);
  ctx.moveTo(cx+10,Y1); ctx.lineTo(X2,Y1); ctx.lineTo(X2,Y2); ctx.lineTo(450,Y2);
  ctx.moveTo(370,Y2); ctx.lineTo(X1,Y2); ctx.lineTo(X1,(Y1+Y2)/2+22); ctx.stroke();
  // electrons (dots) on wires
  ctx.strokeStyle='#f59e0b'; ctx.lineWidth=8; ctx.lineCap='round'; ctx.setLineDash([0,22]); ctx.lineDashOffset=S.offE;
  ctx.beginPath(); ctx.moveTo(X1,(Y1+Y2)/2-22); ctx.lineTo(X1,Y1); ctx.lineTo(cx-18,Y1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+18,Y1); ctx.lineTo(X2,Y1); ctx.lineTo(X2,Y2); ctx.lineTo(452,Y2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(368,Y2); ctx.lineTo(X1,Y2); ctx.lineTo(X1,(Y1+Y2)/2+22); ctx.stroke();
  ctx.setLineDash([]); ctx.lineCap='butt';

  // capacitor plates
  ctx.fillStyle='#cbd5e1'; ctx.fillRect(cx-14,Y1-45,6,90); ctx.fillRect(cx+8,Y1-45,6,90);
  const n = Math.round(Math.max(0,S.vc)*7);
  for(let i=0;i<n;i++){
    const y = Y1-38 + i*(76/6);
    arrowText(ctx,'+',cx-26,y+5,'#dc2626',16);
    arrowText(ctx,'−',cx+26,y+5,'#2563eb',16);
  }
  // field lines in gap
  if (S.vc>0.02){ ctx.strokeStyle=`rgba(124,58,237,${Math.min(1,S.vc)})`; ctx.lineWidth=1.5;
    for(let i=0;i<5;i++){ const y=Y1-34+i*17; ctx.beginPath(); ctx.moveTo(cx-6,y); ctx.lineTo(cx+6,y); ctx.stroke(); } }
  arrowText(ctx,'capacitor: 2 plates + gap',cx,Y1+68,'#cbd5e1',13);

  // resistor zigzag
  ctx.strokeStyle='#cbd5e1'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(370,Y2);
  for(let i=0;i<8;i++) ctx.lineTo(375+i*10, Y2 + (i%2?-10:10));
  ctx.lineTo(450,Y2); ctx.stroke();
  arrowText(ctx,'resistor',410,Y2+32,'#cbd5e1',13);

  // battery or bypass
  const by=(Y1+Y2)/2;
  if (S.mode==='discharge'){
    ctx.strokeStyle='#cbd5e1'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(X1,by-22); ctx.lineTo(X1,by+22); ctx.stroke();
    arrowText(ctx,'battery removed',X1+12,by+5,'#94a3b8',13,'left');
  } else {
    ctx.fillStyle='#cbd5e1'; ctx.fillRect(X1-22,by-12,44,4); ctx.fillRect(X1-12,by+8,24,6);
    arrowText(ctx,'+',X1+32,by-4,'#dc2626',16); arrowText(ctx,'−',X1+32,by+18,'#2563eb',16);
    arrowText(ctx,'battery',X1-34,by+5,'#cbd5e1',13,'right');
  }
  // switch open in hold
  if (S.mode==='hold'){
    ctx.fillStyle='#0b1220'; ctx.fillRect(215,Y1-6,40,12);
    ctx.strokeStyle='#64748b'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(215,Y1); ctx.lineTo(252,Y1-22); ctx.stroke();
    arrowText(ctx,'switch open',235,Y1-30,'#64748b',13);
  }
  arrowText(ctx,'electrons (yellow) pile onto the right plate and leave the left plate',X2-10,290,'#94a3b8',13,'right');
}

function drawGraph(){
  const c=$('cGraph'), ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height);
  const L=50,R=780,T=20,B=180, mid=(T+B)/2;
  ctx.strokeStyle='#2a3650'; ctx.lineWidth=1;
  for(let i=0;i<=4;i++){ const y=T+i*(B-T)/4; ctx.beginPath(); ctx.moveTo(L,y); ctx.lineTo(R,y); ctx.stroke(); }
  ctx.strokeStyle='#94a3b8'; ctx.beginPath(); ctx.moveTo(L,mid); ctx.lineTo(R,mid); ctx.stroke();
  arrowText(ctx,'+100%',L-6,T+5,'#94a3b8',11,'right'); arrowText(ctx,'0',L-6,mid+4,'#94a3b8',11,'right'); arrowText(ctx,'−100%',L-6,B+4,'#94a3b8',11,'right');
  arrowText(ctx,'last 12 seconds →',R,B+22,'#94a3b8',12,'right');
  const yOf=v=>mid - v*(B-T)/2, xOf=t=>R-(S.t-t)/12*(R-L);
  [[1,'#3b82f6'],[2,'#f59e0b']].forEach(([k,col])=>{
    ctx.strokeStyle=col; ctx.lineWidth=3; ctx.beginPath();
    S.hist.forEach((h,i)=>{ const x=xOf(h[0]), y=yOf(h[k]); i?ctx.lineTo(x,y):ctx.moveTo(x,y); }); ctx.stroke();
  });
  ctx.fillStyle='#3b82f6'; ctx.fillRect(L+10,B+12,14,4); arrowText(ctx,'charge stored',L+30,B+18,'#3b82f6',12,'left');
  ctx.fillStyle='#f59e0b'; ctx.fillRect(L+140,B+12,14,4); arrowText(ctx,'flow (current)',L+160,B+18,'#f59e0b',12,'left');
}

// ---------- Simulation 2: DC vs AC ----------
const A = { mode:'off', vc:0, t:0, off:0, wheel:0, flow:0, src:0 };
const tau2 = 0.22;
function setA(m){ A.mode=m; A.t=0;
  $('bDC').className = m==='dc'?'active':''; $('bAC').className = m==='ac'?'active':''; $('bOff').className = m==='off'?'active hold':''; }
$('bDC').onclick=()=>setA('dc'); $('bAC').onclick=()=>setA('ac'); $('bOff').onclick=()=>setA('off');
setA('off');

function step2(dt){
  A.t+=dt;
  A.src = A.mode==='dc' ? 0.9 : A.mode==='ac' ? 0.9*Math.sin(2*Math.PI*0.9*A.t) : 0;
  const I = A.src - A.vc;
  A.vc += I*dt/tau2; A.flow=I;
  A.off -= I*dt*260; A.wheel += I*dt*7;
}
function drawACDC(){
  const c=$('cACDC'), ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height);
  const X1=110,X2=700,Y1=70,Y2=200;
  loopPath(ctx,X1,Y1,X2,Y2); ctx.strokeStyle='#bcd6fb'; ctx.lineWidth=24; ctx.lineJoin='round'; ctx.stroke();
  loopPath(ctx,X1,Y1,X2,Y2); ctx.strokeStyle='#3b82f6'; ctx.lineWidth=6; ctx.setLineDash([16,14]); ctx.lineDashOffset=A.off; ctx.stroke(); ctx.setLineDash([]);
  // chamber + membrane
  const cx=320, top=22, bot=118, b=A.vc*45;
  ctx.fillStyle='#bcd6fb'; ctx.fillRect(cx-55,top,110,bot-top);
  ctx.strokeStyle='#cbd5e1'; ctx.lineWidth=3; ctx.strokeRect(cx-55,top,110,bot-top);
  ctx.beginPath(); ctx.moveTo(cx,top); ctx.quadraticCurveTo(cx+2*b,(top+bot)/2,cx,bot); ctx.strokeStyle='#dc2626'; ctx.lineWidth=5; ctx.stroke();
  arrowText(ctx,'capacitor',cx,bot+18,'#dc2626',13);
  // waterwheel
  const wx=560, wy=Y1;
  ctx.beginPath(); ctx.arc(wx,wy,40,0,Math.PI*2); ctx.fillStyle='#ecfdf5'; ctx.fill(); ctx.strokeStyle='#059669'; ctx.lineWidth=3; ctx.stroke();
  ctx.save(); ctx.translate(wx,wy); ctx.rotate(A.wheel);
  for(let i=0;i<6;i++){ ctx.rotate(Math.PI/3); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(38,0); ctx.stroke(); ctx.fillStyle='#059669'; ctx.fillRect(30,-6,10,12); }
  ctx.restore();
  const active = Math.abs(A.flow)>0.05;
  arrowText(ctx, active ? 'waterwheel turning: signal gets through!' : 'waterwheel still: nothing gets through', wx, wy+62, active?'#059669':'#94a3b8', 13);
  // source
  const py=(Y1+Y2)/2;
  ctx.beginPath(); ctx.arc(X1,py,32,0,Math.PI*2); ctx.fillStyle='#fef3c7'; ctx.fill(); ctx.strokeStyle='#b45309'; ctx.lineWidth=3; ctx.stroke();
  const lbl = A.mode==='dc' ? 'steady push' : A.mode==='ac' ? 'push ↔ pull' : 'off';
  arrowText(ctx,lbl,X1,py+5,'#b45309',13);
  // source arrow showing direction
  if (Math.abs(A.src)>0.05){ ctx.fillStyle='#b45309'; ctx.beginPath();
    const d = A.src>0 ? -1 : 1; ctx.moveTo(X1-50,py+d*14); ctx.lineTo(X1-60,py-d*4); ctx.lineTo(X1-40,py-d*4); ctx.fill(); }
  arrowText(ctx, A.mode==='dc' ? 'DC: one quick push, then the sheet is stretched and flow stops.' :
                 A.mode==='ac' ? 'AC: the sheet flexes back and forth, so flow never stops.' : 'Pick DC or AC above.',
                 400, 240, '#e2e8f0', 14);
}

// ---------- Symbols ----------
(function drawSym(){
  const c=$('cSym'), ctx=c.getContext('2d'); ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=4;
  // normal
  let x=95,y=80; ctx.beginPath(); ctx.moveTo(x-60,y); ctx.lineTo(x-10,y); ctx.moveTo(x+10,y); ctx.lineTo(x+60,y);
  ctx.moveTo(x-10,y-30); ctx.lineTo(x-10,y+30); ctx.moveTo(x+10,y-30); ctx.lineTo(x+10,y+30); ctx.stroke();
  arrowText(ctx,'non-polarized',x,y+60,'#94a3b8',13);
  // polarized
  x=285; ctx.beginPath(); ctx.moveTo(x-60,y); ctx.lineTo(x-10,y); ctx.moveTo(x+14,y); ctx.lineTo(x+60,y);
  ctx.moveTo(x-10,y-30); ctx.lineTo(x-10,y+30); ctx.stroke();
  ctx.beginPath(); ctx.arc(x+40,y,30,Math.PI*0.78,Math.PI*1.22); ctx.stroke();
  arrowText(ctx,'+',x-24,y-30,'#dc2626',18); arrowText(ctx,'−',x+28,y-30,'#2563eb',18);
  arrowText(ctx,'polarized',x,y+60,'#94a3b8',13);
})();

// ---------- Loop ----------
let last=performance.now();
function frame(now){
  const dt=Math.min(0.05,(now-last)/1000); last=now;
  step1(dt); step2(dt);
  drawWater(); drawCircuit(); drawGraph(); drawACDC();
  $('rQ').textContent = Math.round(S.vc*100)+'%';
  $('rI').textContent = Math.round(Math.abs(S.flow)*100)+'%' + (S.flow<-0.01?' (reversed)':'');
  requestAnimationFrame(frame);
}
setMode('idle');
requestAnimationFrame(frame);


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

// ===== Size explorer =====
function fmtC(c){const u=[[1,'F'],[1e-3,'mF'],[1e-6,'µF'],[1e-9,'nF'],[1e-12,'pF']];for(const [v,n] of u){if(c>=v*0.999){const x=c/v;return (x>=100?x.toFixed(0):x>=10?x.toFixed(0):x.toFixed(1))+' '+n;}}return (c/1e-12).toFixed(1)+' pF';}
function fmtT(s){if(s<1e-6)return (s*1e9).toFixed(0)+' nanoseconds';if(s<1e-3)return (s*1e6).toFixed(0)+' microseconds';if(s<1)return (s*1e3).toFixed(0)+' milliseconds';if(s<120)return s.toFixed(1)+' seconds';return (s/60).toFixed(0)+' minutes';}
function drawSize(){
  const c=$('cSize'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const e=+$('sSize').value, C=Math.pow(10,e), fill=5*1000*C, k=(e+11)/11;
  const cats=[[1e-9,'🥄 Thimble','Radio tuning, high-frequency filters, crystal oscillators'],[1e-6,'☕ Cup','Decoupling next to chips, tone controls, noise filters'],[1e-4,'🪣 Bucket','Audio coupling, timing and blinking, LED fade-outs'],[0.1,'🛁 Bathtub','Power supply smoothing, amp energy reserves'],[1e9,'🏊 Swimming pool (supercap)','Memory backup, quick-charge torches, braking energy']];
  const cat=cats.find(x=>C<x[0]);
  const w=30+k*170,h=24+k*150,x0=140-w/2,y0=205-h;
  ctx.fillStyle='#bcd6fb';ctx.fillRect(x0,y0+h*0.3,w,h*0.7);ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0,y0+h);ctx.lineTo(x0+w,y0+h);ctx.lineTo(x0+w,y0);ctx.stroke();
  arrowText(ctx,fmtC(C),330,60,'#e2e8f0',34,'left');
  arrowText(ctx,cat[1],330,100,'#2563eb',20,'left');
  arrowText(ctx,'Used for: '+cat[2],330,135,'#cbd5e1',15,'left');
  const cmp=fill<1e-6?'a million times faster than a blink':fill<0.1?'faster than a blink':fill<10?'a few heartbeats':fill<300?'time to make a sandwich':'go make a coffee…';
  arrowText(ctx,'Fills through 1 kΩ in about '+fmtT(fill),330,170,'#cbd5e1',15,'left');
  arrowText(ctx,'('+cmp+')',330,193,'#94a3b8',14,'left');
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
  if(FA.pressed)W(ctx,[[100,T-6],[150,T-6]],'#10b981',4);else W(ctx,[[100,T-6],[146,T-26]],'#cbd5e1',4);
  arrowText(ctx,'button',125,T+22,'#cbd5e1',12);
  W(ctx,[[150,T],[320,T]]);dot(ctx,220,T);
  capV(ctx,220,T,B,['10 µF','100 µF','1000 µF'][FA.C]);
  resV(ctx,320,T,T+80,'470 Ω');ledV(ctx,320,T+80,B,FA.b);
  W(ctx,[[50,B],[320,B]]);dot(ctx,220,B);
  // charge bar
  ctx.fillStyle='#2a3650';ctx.fillRect(180,T+44,12,70);ctx.fillStyle='#3b82f6';ctx.fillRect(180,T+44+70*(1-FA.vc),12,70*FA.vc);
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
  W(ctx,[[50,T],[50,110]]);W(ctx,[[50,150],[50,B]]);ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.beginPath();ctx.arc(50,130,20,0,7);ctx.stroke();
  ctx.beginPath();for(let i=0;i<=20;i++){const x=38+i*1.2,y=130-8*Math.sin(i/20*2*Math.PI);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  arrowText(ctx,'AC in',76,134,'#cbd5e1',12,'left');
  // diode
  W(ctx,[[50,T],[110,T]]);ctx.fillStyle='#1e293b';ctx.beginPath();ctx.moveTo(110,T-12);ctx.lineTo(132,T);ctx.lineTo(110,T+12);ctx.closePath();ctx.fill();ctx.stroke();W(ctx,[[132,T-12],[132,T+12]]);
  arrowText(ctx,'diode (one-way valve)',122,T-20,'#cbd5e1',12);
  W(ctx,[[132,T],[320,T]]);dot(ctx,210,T);
  capV(ctx,210,T,B,PS.C?['','10 µF','100 µF','1000 µF'][PS.C]:'(none)',PS.C===0);
  // lamp
  glow(ctx,320,130,PS.vout,'255,200,60');W(ctx,[[320,T],[320,112]]);W(ctx,[[320,148],[320,B]]);
  ctx.fillStyle='#1e293b';ctx.beginPath();ctx.arc(320,130,18,0,7);ctx.fill();ctx.stroke();W(ctx,[[307,117],[333,143]]);W(ctx,[[333,117],[307,143]]);
  arrowText(ctx,'lamp',346,134,'#cbd5e1',12,'left');
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
  arrowText(ctx,'DC blocked, music passes',195,y+44,'#94a3b8',12);
  // bass/treble bars
  const g=f=>{const wt=2*Math.PI*f*kTau[KC.C];return wt/Math.sqrt(1+wt*wt);};
  [['Bass',g(0.7),'#7c3aed'],['Treble',g(5),'#0891b2']].forEach(([n,v],i)=>{const yy=190+i*28;arrowText(ctx,n,70,yy+10,'#cbd5e1',13,'right');
    ctx.fillStyle='#2a3650';ctx.fillRect(80,yy,240,14);ctx.fillStyle=i?'#0891b2':'#7c3aed';ctx.fillRect(80,yy,240*v,14);arrowText(ctx,Math.round(v*100)+'% gets through',330,yy+11,'#cbd5e1',12,'left');});
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
  const T=50,B=210;batt(ctx,60,T,B,'5V');
  W(ctx,[[60,T],[80,T]]);ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(80,T);
  for(let i=0;i<=40;i++)ctx.lineTo(80+i*3,T+6*Math.sin(i/2));ctx.stroke();
  arrowText(ctx,'long wire',140,T-14,'#94a3b8',12);
  W(ctx,[[200,T],[330,T],[330,95]]);dot(ctx,265,T);
  capV(ctx,265,T,B,'',!DC.on);arrowText(ctx,DC.on?'100 nF':'missing!',240,134,DC.on?'#2563eb':'#94a3b8',12,'right');
  const bad=DC.glitch>0;
  ctx.fillStyle=bad?'#fee2e2':'#475569';ctx.fillRect(295,95,70,70);
  for(let i=0;i<4;i++){ctx.fillStyle='#94a3b8';ctx.fillRect(285,102+i*16,10,5);ctx.fillRect(365,102+i*16,10,5);}
  arrowText(ctx,'CHIP',330,125,bad?'#b91c1c':'#fff',14);arrowText(ctx,bad?'GLITCH!':'OK',330,145,bad?'#b91c1c':'#4ade80',13);
  W(ctx,[[330,165],[330,B],[60,B]]);dot(ctx,265,B);
  arrowText(ctx,'chip takes sudden gulps of current',330,240,'#94a3b8',12);
  plot(ctx,420,30,360,170,DC.h,DC.t,4,[{k:'v',col:'#3b82f6',label:'voltage at the chip'},{k:'th',col:'#ef4444',dash:[6,4],lw:1.5,label:'below this the chip glitches'}],0.3,1.05,'');
}

// ===== Loop =====
let last2=performance.now();
function frame2(now){const dt=Math.min(0.05,(now-last2)/1000);last2=now;
  stepFade(dt);stepSmooth(dt);stepCouple(dt);stepDecouple(dt);
  drawFade();drawSmooth();drawCouple();drawDecouple();requestAnimationFrame(frame2);}
requestAnimationFrame(frame2);


// ===== Burst demo =====
const BU={V:9,vc:0,stress:0,broken:false,heat:0,off:0,flow:0,t:0,smoke:[],popT:0};
const RATING=16, VMAX=30;
$('bV').oninput=e=>{BU.V=+e.target.value;$('bVlab').textContent=BU.V+' V';};
$('bNew').onclick=()=>{BU.vc=0;BU.stress=0;BU.broken=false;BU.heat=0;BU.smoke=[];BU.popT=0;};
function stepBurst(dt){
  BU.t+=dt;
  if(!BU.broken){
    const I=(BU.V-BU.vc)/BU.V||0; // normalised
    BU.vc+=(BU.V-BU.vc)*dt/0.6;
    const leak = BU.vc>12 ? Math.pow((BU.vc-12)/4,2)*0.06 : 0.004*BU.vc/16;
    BU.flow=(BU.V-BU.vc)/16 + leak;
    if(BU.vc>RATING){BU.stress+=dt*(BU.vc-RATING)/5;}
    else BU.stress=Math.max(0,BU.stress-dt*0.2);
    if(BU.stress>=1){BU.broken=true;BU.popT=0.8;}
  } else {
    BU.vc+=(BU.V*0.08-BU.vc)*dt/0.1;   // shorted: almost no voltage held
    BU.flow=BU.V/12;                    // big continuous flow
    BU.heat=Math.min(1,BU.heat+dt*BU.V/40);
    if(BU.V>0 && Math.random()<dt*12) BU.smoke.push({x:400+(Math.random()-0.5)*40,y:30,a:1,r:6});
  }
  BU.popT=Math.max(0,BU.popT-dt);
  BU.smoke.forEach(s=>{s.y-=dt*30;s.r+=dt*14;s.a-=dt*0.5;});BU.smoke=BU.smoke.filter(s=>s.a>0);
  BU.off-=BU.flow*dt*260;
}
function drawBurst(){
  const c=$('cBurst'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const X1=110,X2=600,Y1=90,Y2=250,cx=360,top=40,bot=140;
  loopPath(ctx,X1,Y1,X2,Y2);ctx.strokeStyle='#bcd6fb';ctx.lineWidth=26;ctx.lineJoin='round';ctx.stroke();
  loopPath(ctx,X1,Y1,X2,Y2);ctx.strokeStyle='#3b82f6';ctx.lineWidth=6;ctx.setLineDash([16,14]);ctx.lineDashOffset=BU.off;ctx.stroke();ctx.setLineDash([]);
  // chamber (glows red when hot)
  ctx.fillStyle='#bcd6fb';ctx.fillRect(cx-70,top,140,bot-top);
  if(BU.heat>0){ctx.fillStyle=`rgba(239,68,68,${0.6*BU.heat})`;ctx.fillRect(cx-70,top,140,bot-top);}
  const ratio=BU.vc/RATING, b=Math.min(1.6,ratio)*42, mid=(top+bot)/2;
  ctx.strokeStyle='#e2e8f0';ctx.lineWidth=3;ctx.strokeRect(cx-70,top,140,bot-top);
  const sheetCol = ratio<0.75?'#10b981':ratio<=1?'#f59e0b':'#ef4444';
  if(!BU.broken){
    ctx.beginPath();ctx.moveTo(cx,top);ctx.quadraticCurveTo(cx+2*b,mid,cx,bot);
    ctx.strokeStyle=sheetCol;ctx.lineWidth=ratio>1?3:5;ctx.stroke();
    if(ratio>1){ // strain marks, shaking
      const sh=(Math.random()-0.5)*4*Math.min(1,BU.stress*2);
      ctx.strokeStyle='#fecaca';ctx.lineWidth=1.5;
      for(let i=0;i<4;i++){const yy=mid-18+i*12;ctx.beginPath();ctx.moveTo(cx+b+sh-4,yy);ctx.lineTo(cx+b+sh+4,yy+4);ctx.stroke();}
    }
  } else {
    // torn: two flaps with a hole
    ctx.strokeStyle='#ef4444';ctx.lineWidth=5;
    ctx.beginPath();ctx.moveTo(cx,top);ctx.quadraticCurveTo(cx+30,top+20,cx+44,mid-14);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,bot);ctx.quadraticCurveTo(cx+30,bot-20,cx+44,mid+14);ctx.stroke();
    arrowText(ctx,'TORN',cx+12,mid+5,'#7f1d1d',15);
  }
  BU.smoke.forEach(s=>{ctx.fillStyle=`rgba(148,163,184,${0.5*s.a})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.fill();});
  if(BU.popT>0){arrowText(ctx,'💥 POP!',cx,top-8,'#fbbf24',26);}
  arrowText(ctx,'capacitor (1000 µF, 16 V)',cx,bot+22,'#e2e8f0',13);
  // pump with pressure
  const py=(Y1+Y2)/2;ctx.beginPath();ctx.arc(X1,py,34,0,7);ctx.fillStyle='#fef3c7';ctx.fill();ctx.strokeStyle='#b45309';ctx.lineWidth=3;ctx.stroke();
  arrowText(ctx,BU.V+' V',X1,py+6,'#b45309',16);arrowText(ctx,'battery (pump)',X1+44,py+5,'#94a3b8',13,'left');
  // narrow pipe
  ctx.fillStyle='#64748b';ctx.fillRect(320,Y2-15,80,8);ctx.fillRect(320,Y2+7,80,8);
  // flow label
  let flowTxt, flowCol;
  if(BU.broken){flowTxt=BU.V>0?'flow NEVER stops: short circuit!':'no push, no flow';flowCol='#ef4444';}
  else if(BU.flow>0.03){flowTxt='flowing: charging';flowCol='#3b82f6';}
  else if(BU.vc>12.5){flowTxt='flow stopped, but a small leak (strained)';flowCol='#f59e0b';}
  else {flowTxt='flow stopped: fully charged';flowCol='#10b981';}
  arrowText(ctx,flowTxt,(X1+X2)/2+30,Y2+42,flowCol,15);
  // stretch meter
  const mx=680,mt=30,mh=240,Yv=v=>mt+mh-v/VMAX*mh;
  ctx.fillStyle='#10b981';ctx.fillRect(mx,Yv(12),24,Yv(0)-Yv(12));
  ctx.fillStyle='#f59e0b';ctx.fillRect(mx,Yv(RATING),24,Yv(12)-Yv(RATING));
  ctx.fillStyle='#ef4444';ctx.fillRect(mx,Yv(VMAX),24,Yv(RATING)-Yv(VMAX));
  ctx.strokeStyle='#e2e8f0';ctx.lineWidth=2;ctx.strokeRect(mx,mt,24,mh);
  arrowText(ctx,'16 V limit',mx+30,Yv(RATING)+4,'#fca5a5',12,'left');
  arrowText(ctx,'0 V',mx+30,Yv(0)+4,'#94a3b8',12,'left');arrowText(ctx,'30 V',mx+30,Yv(VMAX)+8,'#94a3b8',12,'left');
  // markers: battery (triangle) and cap (line)
  ctx.fillStyle='#fbbf24';const yb=Yv(BU.V);ctx.beginPath();ctx.moveTo(mx-4,yb);ctx.lineTo(mx-16,yb-7);ctx.lineTo(mx-16,yb+7);ctx.fill();
  arrowText(ctx,'battery',mx-20,yb+4,'#fbbf24',11,'right');
  ctx.strokeStyle='#fff';ctx.lineWidth=4;const yc=Yv(Math.max(0,BU.vc));ctx.beginPath();ctx.moveTo(mx-2,yc);ctx.lineTo(mx+26,yc);ctx.stroke();
  arrowText(ctx,'stretch',mx+12,mt+mh+20,'#94a3b8',12);
  // readouts
  $('bVc').textContent=BU.vc.toFixed(1)+' V';
  $('bQ').textContent=(BU.broken?0:BU.vc).toFixed(1)+' mC';
  const st=$('bStat');
  if(BU.broken){st.textContent='BROKEN: replace it';st.style.color='#ef4444';}
  else if(BU.vc>RATING){st.textContent='over the limit: about to fail!';st.style.color='#ef4444';}
  else if(BU.vc>12){st.textContent='near the limit: strained';st.style.color='#f59e0b';}
  else if(BU.flow>0.03){st.textContent='charging';st.style.color='#3b82f6';}
  else {st.textContent='full and healthy';st.style.color='#10b981';}
}
let lastB=performance.now();
function frameB(now){const dt=Math.min(0.05,(now-lastB)/1000);lastB=now;stepBurst(dt);drawBurst();requestAnimationFrame(frameB);}
requestAnimationFrame(frameB);


// ===== Coupling: why centred on 0 =====
const Z={t:0,vc:4.5,h:[]}, zTau=1.2;
$('zPlug').onclick=()=>{Z.vc=0;};
$('zSettled').onclick=()=>{Z.vc=4.5;};
function stepZ(dt){Z.t+=dt;const vin=4.5+0.5*Math.sin(2*Math.PI*0.8*Z.t);
  const out=vin-Z.vc; Z.vc+=out*dt/zTau; Z.h.push({t:Z.t,vin,out,vc:Z.vc});prune(Z.h,Z.t,6);}
function drawZ(){
  const c=$('cCenter'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=30,H=240,min=-1.5,max=6, Y=v=>T+H-(v-min)/(max-min)*H;
  const gL=60,gW=250,gR=500;
  const last=Z.h[Z.h.length-1]||{vin:4.5,out:0,vc:4.5};
  // scales + gridlines (same for both)
  [0,1,2,3,4,4.5,5,6,-1].forEach(v=>{if(v<min||v>max)return;
    ctx.strokeStyle=v===0?'#64748b':'#1f2a40';ctx.lineWidth=v===0?1.5:1;ctx.setLineDash(v===0?[5,4]:[]);
    [[gL,gL+gW],[gR,gR+gW]].forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(a,Y(v));ctx.lineTo(b,Y(v));ctx.stroke();});ctx.setLineDash([]);
    if(Number.isInteger(v)){arrowText(ctx,v+' V',gL-6,Y(v)+4,'#94a3b8',11,'right');arrowText(ctx,v+' V',gR-6,Y(v)+4,'#94a3b8',11,'right');}});
  // average line on input
  ctx.strokeStyle='#f59e0b';ctx.setLineDash([6,4]);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(gL,Y(4.5));ctx.lineTo(gL+gW,Y(4.5));ctx.stroke();ctx.setLineDash([]);
  arrowText(ctx,'- - average 4.5 V',gL+4,Y(5.7),'#f59e0b',11,'left');
  // traces
  const span=6, X=(x0,t)=>x0+gW-(Z.t-t)/span*gW;
  [['vin',gL,'#f59e0b'],['out',gR,'#10b981']].forEach(([k,x0,col])=>{ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();
    Z.h.forEach((p,i)=>{const x=X(x0,p.t),y=Y(p[k]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();});
  arrowText(ctx,'INPUT (DC + music)',gL+gW/2,T-10,'#f59e0b',13);
  arrowText(ctx,'OUTPUT = input − capacitor',gR+gW/2,T-10,'#10b981',13);
  // live dots
  ctx.fillStyle='#f59e0b';ctx.beginPath();ctx.arc(gL+gW,Y(last.vin),5,0,7);ctx.fill();
  ctx.fillStyle='#10b981';ctx.beginPath();ctx.arc(gR+gW,Y(last.out),5,0,7);ctx.fill();
  // middle: capacitor as a "height shifter"
  const mx=(gL+gW+gR)/2, frac=Math.max(0,Math.min(1,last.vc/4.5));
  ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(gL+gW+10,Y(last.vin));ctx.lineTo(mx-8,Y(last.vin));ctx.stroke();
  ctx.fillStyle='#cbd5e1';ctx.fillRect(mx-8,Y(last.vin)-16,4,32);ctx.fillRect(mx+4,Y(last.out)-16,4,32);
  ctx.beginPath();ctx.moveTo(mx+8,Y(last.out));ctx.lineTo(gR-10,Y(last.out));ctx.stroke();
  // held voltage bracket
  if(last.vc>0.05){ctx.strokeStyle='#60a5fa';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mx-1,Y(last.vin));ctx.lineTo(mx-1,Y(last.out));ctx.stroke();
    ctx.fillStyle='#60a5fa';ctx.beginPath();ctx.moveTo(mx-1,Y(last.out));ctx.lineTo(mx-6,Y(last.out)-9);ctx.lineTo(mx+4,Y(last.out)-9);ctx.fill();}
  arrowText(ctx,'capacitor holds',mx,Y(-1.5)+22,'#60a5fa',12);
  arrowText(ctx,last.vc.toFixed(2)+' V',mx,Y(-1.5)+40,'#60a5fa',16);
  // output average + explanation
  let s=0,n=0;Z.h.forEach(p=>{if(p.t>Z.t-1.25){s+=p.out;n++;}});const avg=n?s/n:0;
  let msg,col;
  if(avg>0.15){msg='Output average is '+avg.toFixed(2)+' V, above 0, so current flows through the resistor and keeps filling the capacitor…';col='#fbbf24';}
  else {msg='Settled: the capacitor holds the 4.5 V average, so the output wiggles around 0 V ✓';col='#10b981';}
  arrowText(ctx,msg,400,Y(-1.5)+75,col,13);
}
let lastZ=performance.now();
function frameZ(now){const dt=Math.min(0.05,(now-lastZ)/1000);lastZ=now;stepZ(dt);drawZ();requestAnimationFrame(frameZ);}
requestAnimationFrame(frameZ);


// ===== Balance / electrons demo =====
const E={mode:1,t:0,vc:0.6,off:0,vin:0.6,I:0};
choices('eChoices',['Steady push (DC)','Music (changing push)'],1,i=>{E.mode=i;});
function stepE(dt){E.t+=dt;E.vin=E.mode===0?0.9:0.6+0.35*Math.sin(2*Math.PI*0.5*E.t);
  E.I=E.vin-E.vc;E.vc+=E.I*dt/0.35;E.off-=E.I*dt*900;}
function drawE(){const c=$('cElec'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const y=170,cx=400;
  // wires + moving charges
  ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(60,y);ctx.lineTo(cx-14,y);ctx.moveTo(cx+14,y);ctx.lineTo(740,y);ctx.stroke();
  ctx.strokeStyle='#fbbf24';ctx.lineWidth=9;ctx.lineCap='round';ctx.setLineDash([0,24]);ctx.lineDashOffset=E.off;
  ctx.beginPath();ctx.moveTo(60,y);ctx.lineTo(cx-24,y);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+24,y);ctx.lineTo(740,y);ctx.stroke();ctx.setLineDash([]);ctx.lineCap='butt';
  // plates
  ctx.fillStyle='#cbd5e1';ctx.fillRect(cx-16,y-50,6,100);ctx.fillRect(cx+10,y-50,6,100);
  const n=Math.round(Math.max(0,E.vc)*8);for(let i=0;i<n;i++){const yy=y-44+i*(88/8);arrowText(ctx,'+',cx-28,yy+8,'#f87171',14);arrowText(ctx,'−',cx+28,yy+8,'#60a5fa',14);}
  arrowText(ctx,'gap',cx,y+68,'#94a3b8',12);arrowText(ctx,'nothing crosses',cx,y+84,'#94a3b8',12);
  arrowText(ctx,'input side',150,y+40,'#94a3b8',12);arrowText(ctx,'output side',650,y+40,'#94a3b8',12);
  // balance bars
  const bx=60,bw=60,bh=90,by=20;
  [[E.vin,'#f59e0b','input push',bx],[E.vc,'#60a5fa','capacitor push-back',bx+150]].forEach(([v,col,l,x])=>{
    ctx.fillStyle='#2a3650';ctx.fillRect(x,by,bw,bh);ctx.fillStyle=col;const hh=Math.min(1,v)*bh;ctx.fillRect(x,by+bh-hh,bw,hh);
    arrowText(ctx,l,x+bw/2,by+bh+16,col,12);});
  let msg,col;
  if(Math.abs(E.I)<0.015){msg='Balanced: no flow';col='#10b981';}
  else if(E.I>0){msg='Input pushes harder: charge flows forward →';col='#fbbf24';}
  else {msg='← Capacitor pushes harder: charge flows back';col='#fbbf24';}
  arrowText(ctx,msg,340,60,col,16,'left');
  arrowText(ctx,E.mode===0?'Steady push: balances once, then stays still forever.':'Changing push: balance keeps breaking, so the charges keep sloshing.',340,88,'#cbd5e1',13,'left');
}
// ===== Race: thimble vs bathtub =====
const RC={w:0,t:0,a:0,b:0,h:[]}, waves=[{f:0.3,lab:'Slow wave (bass)'},{f:2.5,lab:'Fast wave (treble)'}], tS=0.08,tB=3;
choices('sChoices',waves.map(w=>w.lab),0,i=>{RC.w=i;RC.h=[];});
function stepR(dt){RC.t+=dt;const vin=0.8*Math.sin(2*Math.PI*waves[RC.w].f*RC.t);
  RC.a+=(vin-RC.a)*dt/tS;RC.b+=(vin-RC.b)*dt/tB;RC.h.push({t:RC.t,vin,a:RC.a,b:RC.b});prune(RC.h,RC.t,waves[RC.w].f<1?7:2.5);}
function drawR(){const c=$('cRace'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const span=waves[RC.w].f<1?7:2.5, T=45,H=170;
  [[20,'a','🥄 Small capacitor (thimble)',tS],[410,'b','🛁 Big capacitor (bathtub)',tB]].forEach(([x0,k,title,tau])=>{
    const W=370,X=t=>x0+W-(RC.t-t)/span*W,Y=v=>T+H/2-v*H/2.1;
    ctx.fillStyle='#1e293b';ctx.fillRect(x0,T,W,H);
    arrowText(ctx,title,x0+W/2,T-14,'#e2e8f0',15);
    // gap shading
    ctx.strokeStyle='rgba(16,185,129,0.35)';ctx.lineWidth=2;
    RC.h.forEach((p,i)=>{if(i%3)return;const x=X(p.t);ctx.beginPath();ctx.moveTo(x,Y(p.vin));ctx.lineTo(x,Y(p[k]));ctx.stroke();});
    [['vin','#f59e0b'],[k,'#60a5fa']].forEach(([kk,col])=>{ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();
      RC.h.forEach((p,i)=>{const x=X(p.t),y=Y(p[kk]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();});
    const wt=2*Math.PI*waves[RC.w].f*tau, g=wt/Math.sqrt(1+wt*wt);
    ctx.fillStyle='#2a3650';ctx.fillRect(x0,T+H+22,W,14);ctx.fillStyle='#10b981';ctx.fillRect(x0,T+H+22,W*g,14);
    arrowText(ctx,'gets through: '+Math.round(g*100)+'%',x0+W/2,T+H+56,g>0.6?'#10b981':'#f87171',14);
    arrowText(ctx,g>0.6?'can\'t keep up, so the wave passes':'keeps up, so the wave is cancelled',x0+W/2,T+H+74,'#94a3b8',12);
  });
}
let lastE=performance.now();
function frameE(now){const dt=Math.min(0.05,(now-lastE)/1000);lastE=now;stepE(dt);stepR(dt);drawE();drawR();requestAnimationFrame(frameE);}
requestAnimationFrame(frameE);


// ===== Long pipe inertia demo =====
const LP={mode:0,t:0,q:0.15,q2:0.15,S:1,d:0.15,P:1,off1:0,off2:0,h:[],glitch:0};
choices('lChoices',['No tank','Tank far away','Tank right beside the chip'],0,i=>{LP.mode=i;LP.S=1;LP.q=LP.q2=LP.d;});
function stepLP(DT){const n=10,dt=DT/n;for(let k=0;k<n;k++){
  LP.t+=dt;const ph=LP.t%0.9;const r=0.05,g=0.1;
  LP.d=0.15+1.05*(ph<r?ph/r:ph<g?1:ph<g+r?1-(ph-g)/r:0);
  const tau=0.35,tau2=0.025,C=0.6;let short;
  if(LP.mode===0){LP.q+=(LP.d-LP.q)*dt/tau;LP.q2=LP.q;LP.S=1;short=LP.d-LP.q;}
  else if(LP.mode===1){LP.q+=(LP.q2+2*(1-LP.S)-LP.q)*dt/tau;LP.q2+=(LP.d-LP.q2)*dt/tau2;LP.S=Math.min(1,Math.max(0,LP.S+(LP.q-LP.q2)*dt/C));short=LP.d-LP.q2;}
  else {LP.q+=(LP.d+2*(1-LP.S)-LP.q)*dt/tau;LP.q2=LP.d;LP.S=Math.min(1,Math.max(0,LP.S+(LP.q-LP.d)*dt/C));short=0;}
  LP.P=1-0.6*Math.max(0,short)-0.3*(1-LP.S);
  LP.off1-=LP.q*dt*300;LP.off2-=LP.q2*dt*300;
 }
 if(LP.P<0.75)LP.glitch=0.4;LP.glitch=Math.max(0,LP.glitch-DT);
 LP.h.push({t:LP.t,P:LP.P,th:0.75});prune(LP.h,LP.t,4);}
function drawLP(){const c=$('cPipe'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const y=120,x0=120,xT=650,xm=390;
  const pipe=(a,b,off)=>{ctx.strokeStyle='#bcd6fb';ctx.lineWidth=22;ctx.beginPath();ctx.moveTo(a,y);ctx.lineTo(b,y);ctx.stroke();
    ctx.strokeStyle='#3b82f6';ctx.lineWidth=6;ctx.setLineDash([16,14]);ctx.lineDashOffset=off;ctx.beginPath();ctx.moveTo(a,y);ctx.lineTo(b,y);ctx.stroke();ctx.setLineDash([]);};
  // supply tank
  ctx.fillStyle='#3b82f6';ctx.fillRect(30,40,90,140);ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.strokeRect(30,40,90,140);
  arrowText(ctx,'power',75,100,'#fff',14);arrowText(ctx,'supply',75,118,'#fff',14);
  if(LP.mode===1){pipe(x0,xm,LP.off1);pipe(xm,xT,LP.off2);}else if(LP.mode===2){pipe(x0,xT-70,LP.off1);pipe(xT-70,xT,LP.off2);}else pipe(x0,xT,LP.off1);
  arrowText(ctx,'long pipe: the water must speed up first (inertia)',400,y+34,'#94a3b8',12);
  arrowText(ctx,'speed: '+Math.round(LP.q*100)+'%',x0+60,y+34,'#60a5fa',12);
  // small tank
  const tx=LP.mode===1?xm:LP.mode===2?xT-70:null;
  if(tx){const w=56,h=60,tt=y-11-h;ctx.fillStyle='#1e293b';ctx.fillRect(tx-w/2,tt,w,h);ctx.fillStyle='#60a5fa';ctx.fillRect(tx-w/2,tt+h*(1-LP.S),w,h*LP.S);
    ctx.strokeStyle='#cbd5e1';ctx.lineWidth=2;ctx.strokeRect(tx-w/2,tt,w,h);arrowText(ctx,'100 nF tank',tx,tt-8,'#60a5fa',12);}
  // tap / chip
  ctx.fillStyle=LP.glitch>0?'#fee2e2':'#475569';ctx.fillRect(xT,y-35,80,70);
  arrowText(ctx,'CHIP',xT+40,y-4,LP.glitch>0?'#b91c1c':'#fff',14);arrowText(ctx,LP.glitch>0?'GLITCH!':'OK',xT+40,y+16,LP.glitch>0?'#b91c1c':'#4ade80',13);
  // gulp stream
  const sw=4+14*(LP.d-0.15);ctx.fillStyle='#3b82f6';ctx.fillRect(xT+40-sw/2,y+35,sw,30);
  arrowText(ctx,LP.d>0.5?'GULP!':'sipping',xT+40,y+82,LP.d>0.5?'#fbbf24':'#94a3b8',12);
  // gauge
  const gx=740,gy=y-58;ctx.strokeStyle='#2a3650';ctx.lineWidth=8;ctx.beginPath();ctx.arc(gx,gy,22,Math.PI,2*Math.PI);ctx.stroke();
  ctx.strokeStyle='#ef4444';ctx.beginPath();ctx.arc(gx,gy,22,Math.PI,Math.PI*1.75);ctx.stroke();
  ctx.strokeStyle='#10b981';ctx.beginPath();ctx.arc(gx,gy,22,Math.PI*1.75,2*Math.PI);ctx.stroke();
  const a=Math.PI+Math.max(0,Math.min(1,LP.P))*Math.PI;ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(gx+20*Math.cos(a),gy+20*Math.sin(a));ctx.stroke();
  arrowText(ctx,'pressure',gx,gy+16,'#94a3b8',11);
  plot(ctx,60,230,700,80,LP.h,LP.t,4,[{k:'P',col:'#3b82f6',label:'pressure (voltage) at the chip'},{k:'th',col:'#ef4444',dash:[6,4],lw:1.5,label:'below this the chip glitches'}],0.2,1.05,'');
}
let lastLP=performance.now();
function frameLP(now){const dt=Math.min(0.05,(now-lastLP)/1000);lastLP=now;stepLP(dt);drawLP();requestAnimationFrame(frameLP);}
requestAnimationFrame(frameLP);

})();
