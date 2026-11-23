
// ===== Diode drawing helpers =====
function diodeSym(ctx,x,y,ang,col='#cbd5e1',s=12,fill='#0b1220'){ctx.save();ctx.translate(x,y);ctx.rotate(ang);
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
  ctx.strokeStyle='#bcd6fb';ctx.lineWidth=30;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();
  if(Ishow>0.5){ctx.strokeStyle='#3b82f6';ctx.lineWidth=6;ctx.setLineDash([16,14]);ctx.lineDashOffset=DV2.off;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();ctx.setLineDash([]);}
  // valve housing
  ctx.fillStyle='#64748b';ctx.fillRect(vx-40,y-45,80,12);ctx.fillRect(vx-40,y+33,80,12);
  ctx.fillStyle='#94a3b8';ctx.fillRect(vx-6,y+15,8,18); // seat
  // flap hinged at top
  const ang=open*1.1;ctx.save();ctx.translate(vx,y-33);ctx.rotate(-ang);ctx.fillStyle=V<0?'#f87171':open>0?'#10b981':'#fbbf24';ctx.fillRect(-4,0,8,52);ctx.restore();
  ctx.fillStyle='#e2e8f0';ctx.beginPath();ctx.arc(vx,y-33,5,0,7);ctx.fill();
  // spring
  ctx.strokeStyle='#cbd5e1';ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<=10;i++){const xx=vx+8+i*3.5,yy=y-30+(i%2?6:-6)+ (open*14);ctx.lineTo(xx,yy);}ctx.stroke();
  // push arrow
  if(Math.abs(V)>0.02){const L=Math.min(110,Math.abs(V)*60+20),dir=V>0?1:-1,ax=V>0?60:400;ctx.strokeStyle='#fbbf24';ctx.fillStyle='#fbbf24';ctx.lineWidth=5;
    ctx.beginPath();ctx.moveTo(ax,y-70);ctx.lineTo(ax+dir*L,y-70);ctx.stroke();ctx.beginPath();ctx.moveTo(ax+dir*(L+10),y-70);ctx.lineTo(ax+dir*L,y-78);ctx.lineTo(ax+dir*L,y-62);ctx.fill();
    arrowText(ctx,V>0?'forward push':'backward push',ax+dir*L/2,y-84,'#fbbf24',12);}
  arrowText(ctx,'anode (+) side',80,y+66,'#94a3b8',12);arrowText(ctx,'cathode (−) side',370,y+66,'#94a3b8',12);
  diodeSym(ctx,vx,y+90,0,'#e2e8f0',10);
  let msg,col;
  if(V<0){msg='Backward: flap sealed, no flow';col='#f87171';}
  else if(I<1){msg='Forward but under ~0.6 V: spring keeps it shut';col='#fbbf24';}
  else if(I<=200){msg='Open: '+I.toFixed(I<10?1:0)+' mA flowing';col='#10b981';}
  else {msg='⚠ Wide open: current is huge (a resistor must limit it!)';col='#ef4444';}
  arrowText(ctx,msg,225,y+128,col,14);
  // IV curve
  const gx=470,gy=30,gw=310,gh=210,X=v=>gx+(v+3)/4.2*gw,Y=i=>gy+gh-Math.min(i,200)/200*gh;
  ctx.fillStyle='#1e293b';ctx.fillRect(gx,gy,gw,gh);
  ctx.strokeStyle='#475569';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(X(0),gy);ctx.lineTo(X(0),gy+gh);ctx.stroke();
  ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(X(0.7),gy);ctx.lineTo(X(0.7),gy+gh);ctx.stroke();ctx.setLineDash([]);
  arrowText(ctx,'0.7 V',X(0.7),gy+gh+14,'#94a3b8',11);arrowText(ctx,'0 V',X(0),gy+gh+14,'#94a3b8',11);arrowText(ctx,'−3 V',gx,gy+gh+14,'#94a3b8',11);
  arrowText(ctx,'current',gx+4,gy-8,'#94a3b8',11,'left');arrowText(ctx,'voltage →',gx+gw,gy+gh+28,'#94a3b8',11,'right');
  ctx.strokeStyle='#60a5fa';ctx.lineWidth=2.5;ctx.beginPath();for(let v=-3;v<=1.2;v+=0.005){const xx=X(v),yy=Y(diodeI(v));v===-3?ctx.moveTo(xx,yy):ctx.lineTo(xx,yy);}ctx.stroke();
  ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(X(V),Y(I),6,0,7);ctx.fill();
  arrowText(ctx,'blocked',X(-1.5),Y(0)-10,'#f87171',12);arrowText(ctx,'conducts',X(0.95),gy+16,'#10b981',12);
}

// ===== 4A. Reverse protection =====
const RP={flip:false,diode:0,fried:false,smoke:[]};
choices('rpChoices',['No diode','With protection diode'],0,i=>RP.diode=i);
$('rpFlip').onclick=()=>RP.flip=!RP.flip;$('rpNew').onclick=()=>{RP.fried=false;RP.smoke=[];};
function drawRP(dt){const c=$('cRP'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=50,B=190,bx=150;
  // battery (draw flipped)
  W(ctx,[[bx,T],[bx,(T+B)/2-8]],'#cbd5e1');W(ctx,[[bx,(T+B)/2+8],[bx,B]],'#cbd5e1');
  const m=(T+B)/2;ctx.fillStyle='#cbd5e1';if(!RP.flip){ctx.fillRect(bx-18,m-8,36,4);ctx.fillRect(bx-10,m+4,20,6);arrowText(ctx,'+',bx+24,m-6,'#f87171',15);}
  else{ctx.fillRect(bx-10,m-8,20,6);ctx.fillRect(bx-18,m+4,36,4);arrowText(ctx,'+',bx+24,m+14,'#f87171',15);}
  arrowText(ctx,RP.flip?'battery BACKWARDS':'battery OK',bx-26,m+4,RP.flip?'#f87171':'#94a3b8',12,'right');
  W(ctx,[[bx,T],[220,T]],'#cbd5e1');
  if(RP.diode){diodeSym(ctx,240,T,0,'#e2e8f0');arrowText(ctx,'diode',240,T-20,'#e2e8f0',12);}else W(ctx,[[220,T],[260,T]],'#cbd5e1');
  W(ctx,[[260,T],[380,T],[380,80]],'#cbd5e1');W(ctx,[[380,160],[380,B],[bx,B]],'#cbd5e1');
  // device
  const blocked=RP.flip&&RP.diode;
  if(RP.flip&&!RP.diode)RP.fried=true;
  ctx.fillStyle=RP.fried?'#1c1917':'#475569';ctx.fillRect(330,80,100,80);
  arrowText(ctx,'electronics',380,112,RP.fried?'#f87171':'#fff',13);
  let st,col;
  if(RP.fried){st='FRIED 💀';col='#ef4444';if(Math.random()<dt*10)RP.smoke.push({x:380+(Math.random()-.5)*60,y:80,r:5,a:1});}
  else if(blocked){st='off, but safe';col='#fbbf24';}else{st='working ✓';col='#4ade80';}
  arrowText(ctx,st,380,138,col,14);
  RP.smoke.forEach(s=>{s.y-=dt*25;s.r+=dt*12;s.a-=dt*0.5;ctx.fillStyle=`rgba(148,163,184,${0.5*Math.max(0,s.a)})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.fill();});RP.smoke=RP.smoke.filter(s=>s.a>0);
  let msg;
  if(RP.fried)msg='Reversed with no protection: current flowed the wrong way through the chips. Press Repair.';
  else if(blocked)msg='Reversed: the diode is a closed valve, so nothing flows. The circuit is protected.';
  else if(RP.diode)msg='Correct way: the diode is open. The circuit gets 9 V − 0.7 V = 8.3 V.';
  else msg='Correct way: works fine, but nothing protects it if the battery is reversed.';
  wrapText(ctx,msg,470,m-14,310,19,'#e2e8f0',13);
  // wrap text manually: shorten
}

// ===== 4B. Rectifier =====
const RCt={full:0,t:0,h:[]};
choices('rcChoices',['1 diode (half-wave)','4-diode bridge (full-wave)'],0,i=>{RCt.full=i;});
function drawRect(dt){RCt.t+=dt;const vin=Math.sin(2*Math.PI*0.8*RCt.t);const out=RCt.full?Math.max(0,Math.abs(vin)-0.07):Math.max(0,vin-0.07);
  RCt.h.push({t:RCt.t,vin,out});prune(RCt.h,RCt.t,4);
  const c=$('cRect'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  if(!RCt.full){W(ctx,[[40,120],[110,120]],'#cbd5e1');diodeSym(ctx,130,120,0,'#e2e8f0',14);W(ctx,[[144,120],[220,120]],'#cbd5e1');arrowText(ctx,'AC in',40,105,'#94a3b8',12,'left');arrowText(ctx,'DC out',220,105,'#94a3b8',12,'right');}
  else{const cx=130,cy=120,r=55;ctx.strokeStyle='#cbd5e1';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy-r);ctx.lineTo(cx+r,cy);ctx.lineTo(cx,cy+r);ctx.lineTo(cx-r,cy);ctx.closePath();ctx.stroke();
    // diodes pointing toward right corner (+) from top/bottom, and from left corner (-) to top/bottom
    [[cx+r/2,cy-r/2,Math.PI/4],[cx+r/2,cy+r/2,-Math.PI/4],[cx-r/2,cy-r/2,-Math.PI/4],[cx-r/2,cy+r/2,Math.PI/4]].forEach(([x,y,a])=>diodeSym(ctx,x,y,a,'#e2e8f0',8));
    W(ctx,[[cx,cy-r],[cx,cy-r-20],[30,cy-r-20]],'#cbd5e1');W(ctx,[[cx,cy+r],[cx,cy+r+20],[30,cy+r+20]],'#cbd5e1');arrowText(ctx,'AC in',30,cy-r-28,'#94a3b8',12,'left');
    W(ctx,[[cx+r,cy],[240,cy]],'#cbd5e1');arrowText(ctx,'+ DC',240,cy-8,'#f87171',12,'right');W(ctx,[[cx-r,cy],[cx-r-14,cy]],'#cbd5e1');arrowText(ctx,'−',cx-r-20,cy+4,'#60a5fa',14);}
  plot(ctx,290,30,490,170,RCt.h,RCt.t,4,[{k:'vin',col:'#94a3b8',dash:[5,4],lw:2,label:'AC in'},{k:'out',col:'#10b981',label:'output'}],-1.1,1.1,'');
  arrowText(ctx,RCt.full?'Both halves used: the backward half is flipped forward':'Only the forward half passes, and the backward half is wasted',535,245,RCt.full?'#10b981':'#fbbf24',13);}

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
  const T=40,B=210,x=220;batt(ctx,60,T,B,'12V');W(ctx,[[60,T],[x,T],[x,75]],'#cbd5e1');
  ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,105,28,0,7);ctx.stroke();arrowText(ctx,'M',x,111,'#e2e8f0',18);
  ctx.save();ctx.translate(x,105);ctx.rotate(FB.ang);ctx.strokeStyle='#60a5fa';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.rotate(2.09);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(18,0);ctx.stroke();}ctx.restore();
  W(ctx,[[x,133],[x,150]],'#cbd5e1');
  if(FB.diode){W(ctx,[[x,T+15],[x+60,T+15],[x+60,92]],'#cbd5e1');diodeSym(ctx,x+60,105,-Math.PI/2,'#10b981',10);W(ctx,[[x+60,118],[x+60,142],[x,142]],'#cbd5e1');arrowText(ctx,'flyback diode',x+74,109,'#10b981',12,'left');}
  // switch
  dot(ctx,x,150);dot(ctx,x,180);if(FB.on)W(ctx,[[x+5,150],[x+5,180]],'#10b981',4);else W(ctx,[[x+5,150],[x+24,174]],'#cbd5e1',4);
  W(ctx,[[x,180],[x,B],[60,B]],'#cbd5e1');arrowText(ctx,'switch',x-12,170,'#94a3b8',12,'right');
  if(FB.sparks>0){ctx.strokeStyle='#fde047';ctx.lineWidth=2;for(let i=0;i<6;i++){const a=Math.random()*6.28,r=10+Math.random()*16;ctx.beginPath();ctx.moveTo(x+10,165);ctx.lineTo(x+10+r*Math.cos(a),165+r*Math.sin(a));ctx.stroke();}arrowText(ctx,'⚡ SPARK',x+40,200,'#fde047',14,'left');}
  plot(ctx,420,30,360,170,FB.h,FB.t,4,[{k:'v',col:'#f87171',label:'voltage across the switch'}],0,60,'');
  const peak=Math.max(...FB.h.map(p=>p.v));
  arrowText(ctx,peak>60?'spike ≈ '+Math.round(peak)+' V, off the chart! Kills transistors':'max '+peak.toFixed(1)+' V: safe ✓',600,240,peak>60?'#ef4444':'#10b981',13);}

// ===== 4D. Clipping =====
const CL={t:0,h:[]};
function drawClip(dt){CL.t+=dt;const A=+$('clA').value;const vin=A*(Math.sin(2*Math.PI*0.7*CL.t)+0.25*Math.sin(2*Math.PI*2.1*CL.t));const out=0.75*Math.tanh(vin/0.75);
  CL.h.push({t:CL.t,vin,out,p:0.7,n:-0.7});prune(CL.h,CL.t,4);
  const c=$('cClip'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  // schematic
  const y=80;arrowText(ctx,'🎸',30,y+6,'#fff',22);W(ctx,[[50,y],[80,y]],'#cbd5e1');ctx.fillStyle='#0b1220';ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.fillRect(80,y-10,50,20);ctx.strokeRect(80,y-10,50,20);
  W(ctx,[[130,y],[250,y]],'#cbd5e1');dot(ctx,170,y);dot(ctx,210,y);
  W(ctx,[[170,y],[170,y+28]],'#cbd5e1');diodeSym(ctx,170,y+40,Math.PI/2,'#e2e8f0',10);W(ctx,[[170,y+52],[170,y+80]],'#cbd5e1');
  W(ctx,[[210,y],[210,y+28]],'#cbd5e1');diodeSym(ctx,210,y+40,-Math.PI/2,'#e2e8f0',10);W(ctx,[[210,y+52],[210,y+80]],'#cbd5e1');
  W(ctx,[[160,y+80],[220,y+80]],'#cbd5e1');gndSym(ctx,190,y+80);arrowText(ctx,'out →',255,y+4,'#10b981',12,'left');
  arrowText(ctx,'two diodes, opposite ways',190,y+120,'#94a3b8',12);
  plot(ctx,330,25,450,180,CL.h,CL.t,4,[{k:'vin',col:'#94a3b8',dash:[5,4],lw:2,label:'guitar in'},{k:'out',col:'#10b981',label:'after diodes'},{k:'p',col:'#f59e0b',dash:[3,4],lw:1,label:'±0.7 V'},{k:'n',col:'#f59e0b',dash:[3,4],lw:1}],-3.4,3.4,'');
  arrowText(ctx,A<0.6?'Soft playing: passes clean':'Hard playing: tops sliced off, so you hear overdrive',555,240,A<0.6?'#10b981':'#fbbf24',13);}

// ===== Symbol =====
(function(){const c=$('cSymD'),ctx=c.getContext('2d');W(ctx,[[60,50],[170,50]],'#e2e8f0');diodeSym(ctx,190,50,0,'#e2e8f0',16);W(ctx,[[206,50],[320,50]],'#e2e8f0');
  arrowText(ctx,'anode (+)',90,35,'#f87171',12);arrowText(ctx,'cathode (−)',290,35,'#60a5fa',12);arrowText(ctx,'current →',190,85,'#fbbf24',12);
  W(ctx,[[60,140],[140,140]],'#cbd5e1',3);W(ctx,[[250,140],[320,140]],'#cbd5e1',3);ctx.fillStyle='#1f2937';ctx.beginPath();ctx.roundRect(140,124,110,32,6);ctx.fill();
  ctx.fillStyle='#d1d5db';ctx.fillRect(228,124,12,32);arrowText(ctx,'stripe = cathode',234,178,'#94a3b8',12);})();

let lastD=performance.now();
function frameD(now){const dt=Math.min(0.05,(now-lastD)/1000);lastD=now;drawValve(dt);drawRP(dt);drawRect(dt);drawFly(dt);drawClip(dt);requestAnimationFrame(frameD);}
requestAnimationFrame(frameD);

