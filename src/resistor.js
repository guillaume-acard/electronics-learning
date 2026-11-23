
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
  loopPath(ctx,X1,Y1,X2,Y2);ctx.strokeStyle='#bcd6fb';ctx.lineWidth=26;ctx.lineJoin='round';ctx.stroke();
  // narrow section: cover pipe then draw narrower
  const nw=Math.max(3,26-FL.R*2.3), a=330,b=470;
  ctx.fillStyle='#0b1220';ctx.fillRect(a,Y1-14,b-a,28);
  const P=FL.V*I, heat=Math.min(1,P/80);
  ctx.fillStyle='#64748b';ctx.fillRect(a,Y1-14,b-a,(28-nw)/2);ctx.fillRect(a,Y1+nw/2,b-a,(28-nw)/2);
  if(heat>0.02){const g=ctx.createRadialGradient((a+b)/2,Y1,4,(a+b)/2,Y1,90);g.addColorStop(0,`rgba(249,115,22,${0.7*heat})`);g.addColorStop(1,'rgba(249,115,22,0)');ctx.fillStyle=g;ctx.fillRect(a-60,Y1-80,b-a+120,160);}
  ctx.strokeStyle='#bcd6fb';ctx.lineWidth=nw;ctx.beginPath();ctx.moveTo(a,Y1);ctx.lineTo(b,Y1);ctx.stroke();
  // flow dashes (faster in narrow section: same flow through smaller pipe)
  ctx.strokeStyle='#3b82f6';ctx.lineWidth=6;ctx.setLineDash([16,14]);ctx.lineDashOffset=FL.off;
  ctx.beginPath();ctx.moveTo(X1,(Y1+Y2)/2);ctx.lineTo(X1,Y1);ctx.lineTo(a,Y1);ctx.stroke();
  ctx.beginPath();ctx.moveTo(b,Y1);ctx.lineTo(X2,Y1);ctx.lineTo(X2,Y2);ctx.lineTo(X1,Y2);ctx.lineTo(X1,(Y1+Y2)/2);ctx.stroke();
  ctx.lineWidth=Math.max(2,Math.min(6,nw-4));ctx.lineDashOffset=FL.off*26/nw;ctx.beginPath();ctx.moveTo(a,Y1);ctx.lineTo(b,Y1);ctx.stroke();ctx.setLineDash([]);
  arrowText(ctx,'narrow pipe = resistor',(a+b)/2,Y1-26,'#e2e8f0',13);
  if(heat>0.15)arrowText(ctx,'🔥 heat',(a+b)/2,Y1+40,'#fb923c',13);
  // pressure gauges
  const gauge=(x,v,l)=>{ctx.fillStyle='#1e293b';ctx.fillRect(x-42,Y1+52,84,46);ctx.strokeStyle='#2a3650';ctx.strokeRect(x-42,Y1+52,84,46);
    arrowText(ctx,l,x,Y1+68,'#94a3b8',11);arrowText(ctx,v.toFixed(1)+' V',x,Y1+90,'#fbbf24',16);};
  gauge(265,FL.V,'pressure before');gauge(535,0,'pressure after');
  arrowText(ctx,'voltage drop across the resistor: '+FL.V.toFixed(1)+' V',400,Y1+120,'#fbbf24',13);
  // pump
  const py=(Y1+Y2)/2;ctx.beginPath();ctx.arc(X1,py,34,0,7);ctx.fillStyle='#fef3c7';ctx.fill();ctx.strokeStyle='#b45309';ctx.lineWidth=3;ctx.stroke();
  arrowText(ctx,FL.V+' V',X1,py+6,'#b45309',15);arrowText(ctx,'pump = battery',X1+40,py+62,'#94a3b8',13,'left');
  arrowText(ctx,'flow (current): '+I.toFixed(1)+' mA',X2-30,Y2-24,'#60a5fa',13,'right');
}

// ===== 4. Ohm's law =====
const OHM={V:['V = I × R','Voltage = current × resistance','A 470 Ω resistor with 10 mA flowing through it: V = 0.010 A × 470 Ω = <b>4.7 V</b> dropped across it.'],
 I:['I = V ÷ R','Current = voltage ÷ resistance','9 V across a 1 kΩ resistor: I = 9 V ÷ 1000 Ω = 0.009 A = <b>9 mA</b>.'],
 R:['R = V ÷ I','Resistance = voltage ÷ current','You want 7 V dropped at 20 mA (an LED on 9 V): R = 7 V ÷ 0.020 A = <b>350 Ω</b>, so pick the next standard value up: 390 Ω or 470 Ω.']};
function showOhm(k){document.querySelectorAll('#ohmBtns button').forEach(b=>b.className=b.dataset.k===k?'active':'');
  const o=OHM[k];$('ohmOut').innerHTML=`<div style="font-size:1.6rem;font-weight:700;color:#fbbf24">${o[0]}</div><div class="hint">${o[1]}</div><p style="margin:8px 0 0">Example: ${o[2]}</p>`;}
document.querySelectorAll('#ohmBtns button').forEach(b=>b.onclick=()=>showOhm(b.dataset.k));showOhm('V');

// ===== 5. Series / parallel =====
const SP={par:0,off:0,o1:0,o2:0};
choices('spChoices',['Series (in a row)','Parallel (side by side)'],0,i=>SP.par=i);
function drawSP(dt){const c=$('cSP'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const R1=+$('sR1').value,R2=+$('sR2').value,Rt=SP.par?R1*R2/(R1+R2):R1+R2,It=9/Rt,I1=SP.par?9/R1:It,I2=SP.par?9/R2:It;
  $('spR').textContent=Rt.toFixed(2)+' kΩ';$('spI').textContent=It.toFixed(2)+' mA';
  SP.off+=It*dt*25;SP.o1+=I1*dt*25;SP.o2+=I2*dt*25;
  const dots=(pts,off)=>{ctx.strokeStyle='#fbbf24';ctx.lineWidth=8;ctx.lineCap='round';ctx.setLineDash([0,22]);ctx.lineDashOffset=-off;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.setLineDash([]);ctx.lineCap='butt';};
  const resH=(x,y,l,lab)=>{ctx.fillStyle='#0b1220';ctx.fillRect(x,y-12,70,24);ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.strokeRect(x,y-12,70,24);arrowText(ctx,l,x+35,y+5,'#e2e8f0',12);if(lab)arrowText(ctx,lab,x+35,y-20,'#fbbf24',12);};
  const T=50,B=220,xL=60,xR=720;
  batt(ctx,xL,T,B,'9V');
  if(!SP.par){
    W(ctx,[[xL,T],[250,T]],'#cbd5e1');W(ctx,[[320,T],[450,T]],'#cbd5e1');W(ctx,[[520,T],[xR,T],[xR,B],[xL,B]],'#cbd5e1');__PR(ctx,{t:'part',k:'res',a:[250,T],b:[320,T],o:{label:R1+' kΩ'}});__PR(ctx,{t:'part',k:'res',a:[450,T],b:[520,T],o:{label:R2+' kΩ'}});
    dots([[xL,(T+B)/2-12],[xL,T],[xR,T],[xR,B],[xL,B],[xL,(T+B)/2+12]],SP.off);
    resH(250,T,'R1 '+R1+'k',I1.toFixed(2)+' mA');resH(450,T,'R2 '+R2+'k',I2.toFixed(2)+' mA');
    arrowText(ctx,'One path: all the current squeezes through both, so R = R1 + R2 = '+(R1+R2)+' kΩ',400,B+32,'#94a3b8',13);
  } else {
    const ya=T,yb=T+90;
    W(ctx,[[xL,T],[300,T]],'#cbd5e1');W(ctx,[[300,ya],[300,yb]],'#cbd5e1');W(ctx,[[300,ya],[385,ya]],'#cbd5e1');W(ctx,[[455,ya],[540,ya]],'#cbd5e1');W(ctx,[[300,yb],[385,yb]],'#cbd5e1');W(ctx,[[455,yb],[540,yb]],'#cbd5e1');__PR(ctx,{t:'part',k:'res',a:[385,ya],b:[455,ya],o:{label:R1+' kΩ'}});__PR(ctx,{t:'part',k:'res',a:[385,yb],b:[455,yb],o:{label:R2+' kΩ'}});
    W(ctx,[[540,ya],[540,yb]],'#cbd5e1');W(ctx,[[540,T],[xR,T],[xR,B],[xL,B]],'#cbd5e1');
    dots([[xL,(T+B)/2-12],[xL,T],[300,T]],SP.off);dots([[300,ya],[540,ya]],SP.o1);dots([[300,ya],[300,yb],[540,yb],[540,ya]],SP.o2);
    dots([[540,T],[xR,T],[xR,B],[xL,B],[xL,(T+B)/2+12]],SP.off);
    resH(385,ya,'R1 '+R1+'k',I1.toFixed(2)+' mA');resH(385,yb,'R2 '+R2+'k',I2.toFixed(2)+' mA');
    arrowText(ctx,'Two paths: easier, so R = '+Rt.toFixed(2)+' kΩ, smaller than both',400,B+32,'#94a3b8',13);
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
  const st=$('hS');if(HT.burnt){st.textContent='BURNT OPEN: no current flows';st.style.color='#ef4444';}
  else if(P>0.25){st.textContent='overheating!';st.style.color='#ef4444';}else if(P>0.18){st.textContent='warm, near the limit';st.style.color='#f59e0b';}else{st.textContent='fine';st.style.color='#10b981';}}
function drawHT(){const c=$('cHeat'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const y=110,t=Math.min(2.5,HT.temp);
  W(ctx,[[120,y],[330,y]],'#cbd5e1',4);W(ctx,[[470,y],[680,y]],'#cbd5e1',4);
  if(t>0.6&&!HT.burnt){const g=ctx.createRadialGradient(400,y,5,400,y,120);g.addColorStop(0,`rgba(239,68,68,${Math.min(0.8,(t-0.6)*0.5)})`);g.addColorStop(1,'rgba(239,68,68,0)');ctx.fillStyle=g;ctx.fillRect(260,y-110,280,220);}
  // body colour: beige -> brown -> black
  const k=Math.min(1,t/2.2);const col=HT.burnt?'#1c1917':`rgb(${Math.round(222-150*k)},${Math.round(196-160*k)},${Math.round(150-130*k)})`;
  ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(330,y-26,140,52,18);ctx.fill();
  if(!HT.burnt)[['#8b4513',355],['#000',380],['#8b4513',405],['#d4af37',445]].forEach(([cc,x])=>{ctx.fillStyle=cc;ctx.fillRect(x,y-26,10,52);});
  else{ctx.strokeStyle='#0b1220';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(395,y-26);ctx.lineTo(405,y-4);ctx.lineTo(395,y+6);ctx.lineTo(405,y+26);ctx.stroke();arrowText(ctx,'cracked: circuit broken',400,y+50,'#ef4444',13);}
  HT.smoke.forEach(s=>{ctx.fillStyle=`rgba(148,163,184,${0.5*s.a})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.fill();});
  arrowText(ctx,'100 Ω  ¼ W',400,y-40,'#e2e8f0',13);
  // thermometer
  const tx=720,tt=30,th=140;ctx.fillStyle='#1e293b';ctx.fillRect(tx,tt,18,th);ctx.fillStyle=t>1?'#ef4444':t>0.72?'#f59e0b':'#10b981';
  const lv=Math.min(1,t/2.5);ctx.fillRect(tx,tt+th*(1-lv),18,th*lv);ctx.strokeStyle='#cbd5e1';ctx.lineWidth=2;ctx.strokeRect(tx,tt,18,th);
  const ly=tt+th*(1-1/2.5);ctx.strokeStyle='#fca5a5';ctx.beginPath();ctx.moveTo(tx-6,ly);ctx.lineTo(tx+24,ly);ctx.stroke();arrowText(ctx,'¼ W limit',tx-10,ly+4,'#fca5a5',11,'right');
  arrowText(ctx,'heat',tx+9,tt+th+16,'#94a3b8',11);}

// ===== 7A. LED =====
const LE={k:3,burnt:false,stress:0,pop:0}, ledR=[0,0.1,0.47,1,10];
choices('ledChoices',['No resistor','100 Ω','470 Ω','1 kΩ','10 kΩ'],2,i=>{LE.k=i;LE.stress=0;});
$('ledNew').onclick=()=>{LE.burnt=false;LE.stress=0;};
function stepLE(dt){const R=ledR[LE.k];const I=R?7/R:2000;
  if(!LE.burnt){if(I>25)LE.stress+=dt*(R?I/70:20);if(LE.stress>=3){LE.burnt=true;LE.pop=0.8;}}
  LE.pop=Math.max(0,LE.pop-dt);LE.I=LE.burnt?0:I;}
function drawLE(){const c=$('cLed'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=50,B=200,R=ledR[LE.k],I=LE.I;batt(ctx,60,T,B,'9V');
  W(ctx,[[60,T],[200,T]],'#cbd5e1');
  if(R)__PR(ctx,{t:'part',k:'res',a:[200,T],b:[280,T],o:{label:['','100 Ω','470 Ω','1 kΩ','10 kΩ'][LE.k]}});else __PR(ctx,{t:'wire',pts:[[200,T],[280,T]]});
  if(R){ctx.fillStyle='#0b1220';ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.fillRect(200,T-12,80,24);ctx.strokeRect(200,T-12,80,24);arrowText(ctx,['','100 Ω','470 Ω','1 kΩ','10 kΩ'][LE.k],240,T+5,'#e2e8f0',12);}
  else{W(ctx,[[200,T],[280,T]],'#ef4444');arrowText(ctx,'just a wire!',240,T-18,'#ef4444',12);}
  W(ctx,[[280,T],[340,T]],'#cbd5e1');
  const b=LE.burnt?0:Math.min(1,Math.sqrt(I/20));ledV(ctx,340,T,B,b);if(LE.burnt&&ctx.canvas.__rec){const r=ctx.canvas.__rec.filter(r=>r.k==='led').pop();if(r)r.o.burnt=true;}W(ctx,[[340,B],[60,B]],'#cbd5e1');
  if(LE.burnt){ctx.fillStyle='#1c1917';ctx.beginPath();ctx.arc(340,(T+B)/2,13,0,7);ctx.fill();arrowText(ctx,'burnt',372,(T+B)/2+22,'#ef4444',12,'left');}
  if(LE.pop>0)arrowText(ctx,'💥 POP!',340,T-10,'#fbbf24',22);
  // explanation panel
  const x=460;ctx.textAlign='left';
  arrowText(ctx,'I = (9 V − 2 V) ÷ R',x,60,'#fbbf24',16,'left');
  arrowText(ctx,R?'= 7 V ÷ '+(R*1000)+' Ω = '+fmtI(7/R):'= 7 V ÷ almost 0 Ω = HUGE',x,88,'#e2e8f0',15,'left');
  let msg,col;
  if(LE.burnt){msg='LED destroyed: no current flows now';col='#ef4444';}
  else if(!R){msg='Way over 20 mA: burns instantly';col='#ef4444';}
  else if(7/R>25){msg='Over the 20 mA limit: overheating…';col='#ef4444';}
  else if(7/R>10){msg='Safe and bright ✓';col='#10b981';}
  else if(7/R>3){msg='Safe, a bit dimmer ✓';col='#10b981';}
  else {msg='Safe but dim';col='#f59e0b';}
  arrowText(ctx,msg,x,126,col,15,'left');
  ctx.fillStyle='#2a3650';ctx.fillRect(x,150,300,14);ctx.fillStyle=I>20?'#ef4444':'#10b981';ctx.fillRect(x,150,Math.min(300,300*I/40),14);
  ctx.strokeStyle='#fca5a5';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+150,145);ctx.lineTo(x+150,169);ctx.stroke();
  arrowText(ctx,'current',x,184,'#94a3b8',12,'left');arrowText(ctx,'20 mA max',x+150,184,'#fca5a5',12);}

// ===== 7B. Divider / pot =====
const DV={t:0};
function drawDV(dt){DV.t+=dt;const c=$('cDiv'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const p=+$('pot').value,Vout=9*p,x=260,top=40,bot=220;
  batt(ctx,80,top,bot,'9V');W(ctx,[[80,top],[x,top]],'#cbd5e1');W(ctx,[[80,bot],[x,bot]],'#cbd5e1');
  // pot body (long resistor)
  ctx.fillStyle='#0b1220';ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.fillRect(x-14,top+15,28,bot-top-30);ctx.strokeRect(x-14,top+15,28,bot-top-30);
  W(ctx,[[x,top],[x,top+15]],'#cbd5e1');W(ctx,[[x,bot-15],[x,bot]],'#cbd5e1');
  const wy=bot-15-(bot-top-30)*p;
  __PR(ctx,{t:'part',k:'res',a:[x,top+15],b:[x,wy],o:{label:(10*(1-p)).toFixed(1)+' kΩ'}});__PR(ctx,{t:'part',k:'res',a:[x,wy],b:[x,bot-15],o:{label:(10*p).toFixed(1)+' kΩ'}});__PR(ctx,{t:'wire',pts:[[x,wy],[x+32,wy],[350,wy],[350,top+85],[380,top+85]]});
  ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.moveTo(x+16,wy);ctx.lineTo(x+32,wy-8);ctx.lineTo(x+32,wy+8);ctx.fill();
  W(ctx,[[x+32,wy],[350,wy],[350,top+85],[380,top+85]],'#fbbf24');
  arrowText(ctx,'R1 = '+(10*(1-p)).toFixed(1)+' kΩ',x-24,(top+15+wy)/2+4,'#94a3b8',12,'right');
  arrowText(ctx,'R2 = '+(10*p).toFixed(1)+' kΩ',x-24,(wy+bot-15)/2+4,'#94a3b8',12,'right');
  arrowText(ctx,'wiper (slider)',x+40,wy+22,'#fbbf24',11,'left');
  // amp + speaker
  ctx.fillStyle='#ecfdf5';ctx.fillRect(380,top+60,70,50);arrowText(ctx,'amp',415,top+90,'#059669',14);
  ctx.fillStyle='#cbd5e1';ctx.fillRect(470,top+70,16,30);ctx.beginPath();ctx.moveTo(486,top+70);ctx.lineTo(510,top+55);ctx.lineTo(510,top+115);ctx.lineTo(486,top+100);ctx.fill();
  W(ctx,[[450,top+85],[470,top+85]],'#cbd5e1');
  ctx.strokeStyle='#60a5fa';ctx.lineWidth=3;for(let i=0;i<3;i++){const r=14+i*14+((DV.t*30)%14);ctx.globalAlpha=p*(1-i*0.3);ctx.beginPath();ctx.arc(505,top+85,r,-0.6,0.6);ctx.stroke();}ctx.globalAlpha=1;
  arrowText(ctx,'Vout = 9 V × R2 ÷ (R1 + R2)',588,top+40,'#fbbf24',14,'left');
  arrowText(ctx,'= 9 × '+(10*p).toFixed(1)+' ÷ 10 = '+Vout.toFixed(1)+' V',588,top+66,'#e2e8f0',14,'left');
  arrowText(ctx,'Volume: '+Math.round(p*100)+'%',588,top+110,'#60a5fa',18,'left');
  arrowText(ctx,'Knob up = slider closer to +9 V',588,top+140,'#94a3b8',12,'left');}

// ===== 7C. Pull-up =====
const PU={pull:1,pressed:false,t:0,v:1,h:[],n:0.5};
choices('pullChoices',['Without pull-up','With 10 kΩ pull-up'],0,i=>PU.pull=i);
const pb=$('pullBtn');pb.addEventListener('pointerdown',e=>{e.preventDefault();PU.pressed=true;});['pointerup','pointerleave','pointercancel'].forEach(ev=>pb.addEventListener(ev,()=>PU.pressed=false));
pb.style.touchAction='none';pb.style.userSelect='none';
function stepPU(dt){PU.t+=dt;PU.n+=(Math.random()-0.5)*dt*9;PU.n+= (0.5-PU.n)*dt*1.5;PU.n=Math.max(0,Math.min(1,PU.n));
  PU.v=PU.pressed?0:PU.pull?1:PU.n+0.15*Math.sin(PU.t*31);PU.h.push({t:PU.t,v:PU.v,th:0.5});prune(PU.h,PU.t,5);}
function drawPU(){const c=$('cPull'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const xin=230,y=130;
  // chip
  ctx.fillStyle='#475569';ctx.fillRect(xin,y-40,90,80);arrowText(ctx,'CHIP',xin+45,y-6,'#fff',14);
  const high=PU.v>0.5;arrowText(ctx,'reads: '+(high?'HIGH':'LOW'),xin+45,y+16,high?'#4ade80':'#f87171',13);
  W(ctx,[[60,y],[xin,y]],'#cbd5e1');dot(ctx,150,y);arrowText(ctx,'input pin',xin-6,y-8,'#94a3b8',11,'right');
  // button to ground
  W(ctx,[[150,y],[150,y+30]],'#cbd5e1');dot(ctx,150,y+30);dot(ctx,150,y+60);
  if(PU.pressed)W(ctx,[[156,y+30],[156,y+60]],'#10b981',4);else W(ctx,[[156,y+30],[176,y+56]],'#cbd5e1',4);
  W(ctx,[[150,y+60],[150,y+90]],'#cbd5e1');gndSym(ctx,150,y+90);arrowText(ctx,'button',170,y+48,'#94a3b8',11,'left');arrowText(ctx,'0 V',172,y+100,'#94a3b8',11,'left');
  // pull-up
  if(PU.pull){W(ctx,[[150,y],[150,y-20]],'#cbd5e1');ctx.fillStyle='#0b1220';ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.fillRect(140,y-80,20,60);ctx.strokeRect(140,y-80,20,60);
    W(ctx,[[150,y-80],[150,y-100],[100,y-100]],'#cbd5e1');arrowText(ctx,'+5 V',94,y-96,'#f87171',13,'right');arrowText(ctx,'10 kΩ',168,y-46,'#e2e8f0',12,'left');}
  else {arrowText(ctx,'⚡ noise',90,y-20,'#fbbf24',12);arrowText(ctx,'(connected to nothing)',100,y-50,'#94a3b8',11);}
  plot(ctx,400,30,380,170,PU.h,PU.t,5,[{k:'v',col:'#60a5fa',label:'input voltage'},{k:'th',col:'#ef4444',dash:[6,4],lw:1.5,label:'HIGH above / LOW below'}],-0.05,1.1,'what the chip sees');
  arrowText(ctx,PU.pull?'Steady HIGH, clean LOW when pressed ✓':'Not pressed: floating, random readings ✗',590,250,PU.pull?'#10b981':'#f87171',13);}

// ===== 7D. RC timer =====
const RT={vc:0.33,charging:true,t:0,h:[],flash:0};
function rcR(){return Math.pow(10,+$('rcR').value);} // kΩ 1..50
function stepRT(dt){const R=rcR(),tau=R*1000*100e-6;$('rcRt').textContent=fmtR(R)+' → R×C = '+tau.toFixed(2)+' s';
  RT.t+=dt;if(RT.charging){RT.vc+=(1-RT.vc)*dt/tau;if(RT.vc>=0.667){RT.charging=false;RT.flash=1;}}
  else{RT.vc+=(0-RT.vc)*dt/tau;if(RT.vc<=0.333)RT.charging=true;}
  RT.h.push({t:RT.t,v:RT.vc,hi:0.667,lo:0.333});prune(RT.h,RT.t,8);}
function drawRT(){const c=$('cRC'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const on=!RT.charging;ledV(ctx,120,40,180,on?1:0);arrowText(ctx,on?'LED ON':'LED off',120,210,on?'#f87171':'#94a3b8',14);
  plot(ctx,260,20,520,170,RT.h,RT.t,8,[{k:'v',col:'#60a5fa',label:'capacitor charge'},{k:'hi',col:'#f59e0b',dash:[5,4],lw:1.5,label:'⅔: flash'},{k:'lo',col:'#94a3b8',dash:[5,4],lw:1.5,label:'⅓: refill'}],0,1,'last 8 seconds');}

// ===== 8. Colour code =====
const COLS=[['black','#000'],['brown','#8b4513'],['red','#dc2626'],['orange','#f97316'],['yellow','#facc15'],['green','#16a34a'],['blue','#2563eb'],['violet','#7c3aed'],['grey','#9ca3af'],['white','#f8fafc']];
const TOL=[['gold','#d4af37','±5%'],['silver','#c0c0c0','±10%'],['brown','#8b4513','±1%']];
const CC=[1,0,2,0];
(function(){const el=$('ccSel');['1st digit','2nd digit','Multiplier','Tolerance'].forEach((l,i)=>{const lab=document.createElement('label');lab.className='slider';lab.textContent=l+' ';
  const s=document.createElement('select');s.style.cssText='font:inherit;padding:6px;border-radius:6px;background:#2a3650;color:#e2e8f0;border:1px solid #2a3650';
  (i<3?COLS:TOL).forEach((c,j)=>{const o=document.createElement('option');o.value=j;o.textContent=c[0]+(i<2?' ('+j+')':i===2?' (×'+(j?'1'+'0'.repeat(j):'1')+')':' ('+c[2]+')');s.appendChild(o);});
  s.value=CC[i];s.onchange=()=>{CC[i]=+s.value;drawCC();};lab.appendChild(s);el.appendChild(lab);});})();
function drawCC(){const c=$('cCC'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const y=60;W(ctx,[[40,y],[150,y]],'#cbd5e1',4);W(ctx,[[350,y],[460,y]],'#cbd5e1',4);
  ctx.fillStyle='#dec4a0';ctx.beginPath();ctx.roundRect(150,y-30,200,60,22);ctx.fill();
  [[175,COLS[CC[0]][1]],[205,COLS[CC[1]][1]],[235,COLS[CC[2]][1]],[305,TOL[CC[3]][1]]].forEach(([x,cc])=>{ctx.fillStyle=cc;ctx.fillRect(x,y-30,14,60);});
  const ohms=(CC[0]*10+CC[1])*Math.pow(10,CC[2]);
  const f=ohms>=1e6?(ohms/1e6)+' MΩ':ohms>=1e3?(ohms/1e3)+' kΩ':ohms+' Ω';
  arrowText(ctx,'('+CC[0]+CC[1]+') × '+Math.pow(10,CC[2]).toLocaleString('en')+' =',500,y-6,'#94a3b8',14,'left');
  arrowText(ctx,f+'  '+TOL[CC[3]][2],500,y+24,'#fbbf24',24,'left');
  arrowText(ctx,'Common: 220 Ω red-red-brown · 1 kΩ brown-black-red · 10 kΩ brown-black-orange',400,135,'#94a3b8',12);}
drawCC();

// ===== Symbols =====
(function(){const c=$('cSymR'),ctx=c.getContext('2d');ctx.strokeStyle='#e2e8f0';ctx.lineWidth=3;
  let y=70;W(ctx,[[20,y],[60,y]],'#e2e8f0');ctx.strokeRect(60,y-12,70,24);W(ctx,[[130,y],[170,y]],'#e2e8f0');arrowText(ctx,'IEC / Europe',95,y+44,'#94a3b8',12);
  W(ctx,[[210,y],[245,y]],'#e2e8f0');ctx.beginPath();ctx.moveTo(245,y);for(let i=0;i<6;i++)ctx.lineTo(251+i*11,y+(i%2?-10:10));ctx.lineTo(320,y);ctx.stroke();W(ctx,[[320,y],[360,y]],'#e2e8f0');arrowText(ctx,'US',285,y+44,'#94a3b8',12);})();

// ===== Loop =====
let lastR=performance.now();
function frameR(now){const dt=Math.min(0.05,(now-lastR)/1000);lastR=now;
  drawFL(dt);drawSP(dt);stepHT(dt);drawHT();stepLE(dt);drawLE();drawDV(dt);stepPU(dt);drawPU();stepRT(dt);drawRT();requestAnimationFrame(frameR);}
requestAnimationFrame(frameR);
