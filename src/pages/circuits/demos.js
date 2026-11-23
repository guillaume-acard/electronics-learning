
// ===== Next-level project demos (p16–p19) =====
const MZ={t:0,ac:null};
function mAC(){MZ.ac=MZ.ac||new (window.AudioContext||window.webkitAudioContext)();if(MZ.ac.state==='suspended')MZ.ac.resume();return MZ.ac;}
function mLed(ctx,x,y,on,rgb){glowAt(ctx,x,y,on?0.9:0,rgb,30);ctx.fillStyle=`rgba(${rgb},${on?1:0.25})`;ctx.beginPath();ctx.arc(x,y,9,0,7);ctx.fill();ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.stroke();}
function mRes(ctx,x1,y1,x2,y2,lab){W(ctx,[[x1,y1],[x2,y2]],WIRE,2.5);const mx=(x1+x2)/2,my=(y1+y2)/2,v=Math.abs(y2-y1)>Math.abs(x2-x1);ctx.fillStyle=PAL.canvas;ctx.strokeStyle=WIRE;ctx.lineWidth=2;ctx.beginPath();if(v)ctx.rect(mx-7,my-16,14,32);else ctx.rect(mx-16,my-7,32,14);ctx.fill();ctx.stroke();if(lab)txt(ctx,lab,v?mx+12:mx,v?my+4:my-12,PAL.muted,11,v?'left':'center');}
function mGraph(ctx,x,y,w,h,series,lo,hi,label){ctx.fillStyle=PAL.panel;ctx.fillRect(x,y,w,h);ctx.strokeStyle=PAL.line;ctx.strokeRect(x,y,w,h);
  series.forEach(([arr,col,dash])=>{ctx.strokeStyle=col;ctx.lineWidth=2;ctx.setLineDash(dash||[]);ctx.beginPath();arr.forEach((v,i)=>{const px=x+i/(arr.length-1||1)*w,py=y+h-(v-lo)/(hi-lo)*h;i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.stroke();ctx.setLineDash([]);});
  if(label)txt(ctx,label,x+6,y+14,PAL.muted,11,'left');}
// ---------- p16: flip-flop ----------
const FF={on:1,t:0,vb:[0.65,-7.8],h1:[],h2:[],acc:0};
function drawFF(dt){const c1=+$('m16c1').value*1e-6,c2=+$('m16c2').value*1e-6,R=47e3,Vb=9,ctx=cv('m16');
  // on=1 → Q1 on, Q2 off (its base recovers through 47k via C1)
  const n=4;for(let k=0;k<n;k++){const d=dt/n;if(FF.on===1){FF.vb[1]=Vb-(Vb-FF.vb[1])*Math.exp(-d/(R*c1));FF.vb[0]=0.65;if(FF.vb[1]>=0.65){FF.on=2;FF.vb[0]=0.65-(Vb-0.2);FF.vb[1]=0.65;}}
    else{FF.vb[0]=Vb-(Vb-FF.vb[0])*Math.exp(-d/(R*c2));FF.vb[1]=0.65;if(FF.vb[0]>=0.65){FF.on=1;FF.vb[1]=0.65-(Vb-0.2);FF.vb[0]=0.65;}}}
  FF.acc+=dt;if(FF.acc>0.02){FF.acc=0;FF.h1.push(FF.vb[0]);FF.h2.push(FF.vb[1]);if(FF.h1.length>180){FF.h1.shift();FF.h2.shift();}}
  const q1=FF.on===1,q2=!q1;
  // schematic
  W(ctx,[[30,30],[430,30]],PAL.bad,3);txt(ctx,'+9 V',30,22,PAL.bad,12,'left');W(ctx,[[30,280],[430,280]],PAL.muted2,3);txt(ctx,'0 V',30,296,PAL.muted,12,'left');
  [[90,q1,'239,68,68','LED 1'],[370,q2,'34,197,94','LED 2']].forEach(([x,on,rgb,l])=>{mRes(ctx,x,30,x,80,'470 Ω');W(ctx,[[x,96],[x,100]]);mLed(ctx,x,110,on,rgb);txt(ctx,l,x+(x<200?-16:16),114,PAL.ink2,11,x<200?'right':'left');W(ctx,[[x,120],[x,180]]);W(ctx,[[x,248],[x,280]]);});
  const npnM=(x,y,on)=>{ctx.save();ctx.translate(2*x,0);ctx.scale(-1,1);npnQ(ctx,x,y,on);ctx.restore();};
  npnM(100,214,q1);npnQ(ctx,360,214,q2);
  mRes(ctx,170,30,170,110,'47 kΩ');W(ctx,[[170,110],[170,214],[134,214]]);mRes(ctx,290,30,290,110,'47 kΩ');W(ctx,[[290,110],[290,214],[326,214]]);
  const cap=(x,y,lab)=>{ctx.fillStyle=PAL.canvas;ctx.fillRect(x-10,y-14,20,28);W(ctx,[[x-4,y-13],[x-4,y+13]],WIRE,3);W(ctx,[[x+4,y-13],[x+4,y+13]],WIRE,3);txt(ctx,lab,x,y-18,PAL.muted,11);};
  W(ctx,[[90,140],[290,140]]);cap(225,140,'C1');W(ctx,[[370,190],[170,190]]);cap(235,190,'C2');
  [[90,140],[290,140],[370,190],[170,190]].forEach(([x,y])=>{ctx.fillStyle=WIRE;ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill();});
  const vt=v=>(v>=0?'+':'')+v.toFixed(1)+' V';txt(ctx,vt(FF.vb[0]),150,232,FF.vb[0]<0?PAL.bad:PAL.good,12);txt(ctx,vt(FF.vb[1]),310,232,FF.vb[1]<0?PAL.bad:PAL.good,12);
  txt(ctx,q1?'Q1 ON':'Q1 off',36,266,q1?PAL.good:PAL.muted2,12,'left');txt(ctx,q2?'Q2 ON':'Q2 off',430,266,q2?PAL.good:PAL.muted2,12,'right');
  // graphs
  mGraph(ctx,460,20,320,120,[[FF.h1,PAL.bad],[FF.h1.map(()=>0.65),PAL.muted2,[4,4]]],-9,9,'Q1 base voltage (−8 … +0.6 V)');
  mGraph(ctx,460,160,320,120,[[FF.h2,PAL.green],[FF.h2.map(()=>0.65),PAL.muted2,[4,4]]],-9,9,'Q2 base voltage');
  const t1=0.69*R*c1,t2=0.69*R*c2;txt(ctx,`LED 1 on ≈ ${t1.toFixed(2)} s · LED 2 on ≈ ${t2.toFixed(2)} s`,620,298,PAL.yellow,12);}
// ---------- p17: siren ----------
const SR2={t:0,mode:0,f:690,osc:null,g:null,h1:[],h2:[],acc:0,play:false};
function sirTarget(){const half=0.33;const out=Math.floor(SR2.t/half)%2===0;return {out,f:out?560:880};}
function drawSiren(dt){SR2.t+=dt;const ctx=cv('m17'),T=sirTarget();if(SR2.mode===0)SR2.f=T.f;else SR2.f+=(T.f-SR2.f)*(1-Math.exp(-dt/0.18));
  if(SR2.osc)SR2.osc.frequency.setTargetAtTime(SR2.f,MZ.ac.currentTime,0.005);
  SR2.acc+=dt;if(SR2.acc>0.015){SR2.acc=0;SR2.h1.push(T.out?9:0);SR2.h2.push(SR2.f);if(SR2.h1.length>200){SR2.h1.shift();SR2.h2.shift();}}
  mGraph(ctx,20,20,560,100,[[SR2.h1,PAL.yellow]],-1,12,'555 #1 output (pin 3): 9 V ↔ 0 V, ~1.5 times per second');
  mGraph(ctx,20,150,560,120,[[SR2.h2,PAL.blue]],450,1060,'555 #2 pitch (Hz)');
  txt(ctx,'880 Hz',590,166,PAL.muted,11,'left');txt(ctx,'560 Hz',590,250,PAL.muted,11,'left');
  const x=700,y=150,k=SR2.play?Math.sin(SR2.t*SR2.f*0.05)*3:0;ctx.fillStyle=PAL.chipLight;ctx.fillRect(x-60,y-30,30,60);ctx.beginPath();ctx.moveTo(x-30,y-30);ctx.lineTo(x+10+k,y-70);ctx.lineTo(x+10+k,y+70);ctx.lineTo(x-30,y+30);ctx.closePath();ctx.fill();
  if(SR2.play)for(let i=1;i<=3;i++){ctx.strokeStyle=`rgba(96,165,250,${0.7-i*0.18})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+20,y,20+i*18+((SR2.t*60)%18),-0.7,0.7);ctx.stroke();}
  txt(ctx,Math.round(SR2.f)+' Hz',x-20,y+100,PAL.ink,16);txt(ctx,T.out?'#1 HIGH → pin 5 pulled up → low note':'#1 LOW → pin 5 pulled down → high note',300,292,PAL.yellow,12);}
$('m17play').addEventListener('click',()=>{const ac=mAC();if(SR2.play){SR2.osc.stop();SR2.osc=null;SR2.play=false;$('m17play').textContent='🔊 Play the siren';$('m17play').classList.remove('active');return;}
  SR2.osc=ac.createOscillator();SR2.osc.type='square';SR2.g=ac.createGain();SR2.g.gain.value=0.05;SR2.osc.connect(SR2.g);SR2.g.connect(ac.destination);SR2.osc.frequency.value=SR2.f;SR2.osc.start();SR2.play=true;$('m17play').textContent='⏹ Stop';$('m17play').classList.add('active');});
[['m17a',0],['m17b',1]].forEach(([id,m])=>$(id).addEventListener('click',()=>{SR2.mode=m;$('m17a').classList.toggle('active',m===0);$('m17b').classList.toggle('active',m===1);}));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&SR2.play)$('m17play').click();});
window.addEventListener('hashchange',()=>{if(SR2.play)$('m17play').click();});
// ---------- p18: fuzz ----------
function fuzzCurve(x,fz,bias){const g=1+fz*60,off=(bias-0.5)*1.6;let y=Math.tanh(g*x+off)-Math.tanh(off);const top=1-Math.max(0,off)*0.9,bot=-1-Math.min(0,off)*0.9;y=Math.max(bot*0.95,Math.min(top*0.95,y));return y;}
const FZ={t:0,phase:'clean',pt:9};
function drawFuzz(dt){FZ.t+=dt;FZ.pt+=dt;const ctx=cv('m18'),fz=+$('m18f').value,bs=+$('m18b').value;
  const N=300,inp=[],out=[];for(let i=0;i<N;i++){const tt=i/N*1.2,env=Math.exp(-tt*2.2)*0.6;const v=env*(Math.sin(tt*2*Math.PI*6)+0.3*Math.sin(tt*2*Math.PI*12));inp.push(v);out.push(fuzzCurve(v,fz,bs));}
  mGraph(ctx,20,20,470,250,[[inp,PAL.blue],[out,PAL.orange]],-1.1,1.1,'one note: in (blue) → out (orange)');
  if(FZ.pt<1.6){const x=20+Math.min(1,FZ.pt/1.6)*470;ctx.strokeStyle=PAL.highlight;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,20);ctx.lineTo(x,270);ctx.stroke();}
  const cx=520,cy=20,w=250,h=250,cur=[];for(let i=0;i<=100;i++){const x=-1+i/50;cur.push(fuzzCurve(x*0.6,fz,bs));}
  mGraph(ctx,cx,cy,w,h,[[cur,PAL.orange],[cur.map((_,i)=>(-1+i/50)*0.6),PAL.muted2,[4,4]]],-1.1,1.1,'transfer curve');
  txt(ctx,'input →',cx+w-6,cy+h-6,PAL.muted,11,'right');
  const asym=Math.abs(bs-0.5);txt(ctx,fz<0.15?'Almost clean: a little warmth':asym>0.3?'Bias off-centre: thin, gated, "sputtery" fuzz':'Clipped top and bottom: thick, square-ish fuzz',255,292,PAL.yellow,12);}
function pluck(ac,dur){const sr=ac.sampleRate,n=Math.floor(sr*dur),buf=ac.createBuffer(1,n,sr),d=buf.getChannelData(0);const f=110,P=Math.round(sr/f);const ring=new Float32Array(P);for(let i=0;i<P;i++)ring[i]=Math.random()*2-1;
  for(let i=0;i<n;i++){const j=i%P,nx=(j+1)%P;const v=ring[j];ring[j]=0.996*0.5*(ring[j]+ring[nx]);d[i]=v*0.5;}return buf;}
function playFuzz(fx){const ac=mAC(),src=ac.createBufferSource();src.buffer=pluck(ac,2.2);const g=ac.createGain();g.gain.value=fx?0.12:0.35;
  if(fx){const ws=ac.createWaveShaper(),fz=+$('m18f').value,bs=+$('m18b').value,c=new Float32Array(1024);for(let i=0;i<1024;i++)c[i]=fuzzCurve((i/511.5-1)*0.6,fz,bs);ws.curve=c;ws.oversample='2x';
    const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=4500;src.connect(ws);ws.connect(lp);lp.connect(g);}else src.connect(g);
  g.connect(ac.destination);src.start();FZ.pt=0;}
$('m18c').addEventListener('click',()=>playFuzz(false));$('m18p').addEventListener('click',()=>playFuzz(true));
// ---------- p19: counter ----------
const CN={n:0,acc:0,run:true,carry:0};
function cTick(){const u=CN.n%10;CN.n=(CN.n+1)%100;if(u===9)CN.carry=0.6;}
function bits(ctx,x,y,v,lab){txt(ctx,lab,x+70,y-10,PAL.muted,12);[8,4,2,1].forEach((w,i)=>{const on=(v&w)!==0;ctx.fillStyle=on?PAL.green:PAL.raised;ctx.beginPath();ctx.arc(x+i*46,y+14,13,0,7);ctx.fill();txt(ctx,String(w),x+i*46,y+19,on?'#04210f':PAL.muted2,12);txt(ctx,'Q'+(4-i),x+i*46,y+44,PAL.muted2,10);});}
function drawCnt(dt){const ctx=cv('m19'),sp=+$('m19sp').value;if(CN.run){CN.acc+=dt*sp;while(CN.acc>=1){CN.acc-=1;cTick();}}CN.carry=Math.max(0,CN.carry-dt);
  const tens=Math.floor(CN.n/10),units=CN.n%10;drawDigit(ctx,300,40,1.4,DIGITS[tens],{pad:14,glow:12});drawDigit(ctx,420,40,1.4,DIGITS[units],{pad:14,glow:12});txt(ctx,'tens',342,240,PAL.muted,12);txt(ctx,'units',462,240,PAL.muted,12);
  bits(ctx,40,70,tens,'tens counter (CD4518 B)');bits(ctx,600,70,units,'units counter (CD4518 A)');
  txt(ctx,'BCD: '+tens.toString(2).padStart(4,'0'),110,160,PAL.ink2,13);txt(ctx,'BCD: '+units.toString(2).padStart(4,'0'),670,160,PAL.ink2,13);
  if(CN.carry>0){ctx.strokeStyle=`rgba(251,191,36,${CN.carry/0.6})`;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(600,120);ctx.quadraticCurveTo(400,290,180,120);ctx.stroke();txt(ctx,'carry! Q4 of the units dropped (9 → 0) → tens +1',400,285,PAL.yellow,13);}
  else txt(ctx,'units Q4 (the "8") → tens ENABLE',400,285,PAL.muted2,12);}
$('m19run').addEventListener('click',()=>{CN.run=!CN.run;$('m19run').textContent=CN.run?'⏸ Pause':'▶ Run';$('m19run').classList.toggle('active',CN.run);});
$('m19tick').addEventListener('click',()=>{cTick();});$('m19rst').addEventListener('click',()=>{CN.n=0;CN.acc=0;});

// ---------- p20: thermometer ----------
const TH={T:22,hot:false,acc:0,shown:22,code:0,calc:22};
function drawTherm(dt){const ctx=cv('m20');TH.T+=((TH.hot?34:22)-TH.T)*(1-Math.exp(-dt/(TH.hot?3:6)));
  const ref=$('thRef').checked?1.1:5,avg=$('thAvg').checked,V=TH.T*0.01;
  TH.acc+=dt;if(TH.acc>0.5){TH.acc=0;const noise=()=>(Math.random()+Math.random()+Math.random()-1.5)*2.4;let sum=0;const n=avg?20:1;for(let i=0;i<n;i++)sum+=Math.max(0,Math.round(V/ref*1023+noise()));TH.code=sum/n;TH.calc=TH.code*ref/1023*100;TH.shown=Math.max(0,Math.min(99,Math.round(TH.calc)));}
  // thermometer
  const tx0=50,top=40,bot=230,f=Math.max(0,Math.min(1,(TH.T-10)/30));ctx.fillStyle=PAL.raised;ctx.beginPath();ctx.roundRect(tx0-10,top,20,bot-top,10);ctx.fill();ctx.beginPath();ctx.arc(tx0,bot+14,20,0,7);ctx.fill();
  ctx.fillStyle=PAL.bad;ctx.beginPath();ctx.arc(tx0,bot+14,14,0,7);ctx.fill();ctx.fillRect(tx0-5,bot-(bot-top-10)*f,10,(bot-top-10)*f+10);
  for(let k=10;k<=40;k+=5){const y=bot-(bot-top-10)*((k-10)/30);txt(ctx,k+'°',tx0+18,y+4,PAL.muted2,10,'left');}
  txt(ctx,TH.T.toFixed(1)+' °C',tx0,24,PAL.ink,13);if(TH.hot)txt(ctx,'🤏',tx0+2,bot+60,PAL.white,22);
  const box=(x,y,w,h,t1,t2,col)=>{ctx.fillStyle=PAL.panel;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,h,8);ctx.fill();ctx.stroke();txt(ctx,t1,x+w/2,y+24,PAL.ink2,12);txt(ctx,t2,x+w/2,y+52,PAL.white,17);};
  const ar=(x1,x2,y)=>{W(ctx,[[x1,y],[x2-8,y]],PAL.muted2,2);ctx.fillStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(x2,y);ctx.lineTo(x2-9,y-5);ctx.lineTo(x2-9,y+5);ctx.fill();};
  box(110,90,130,74,'LM35 "S" pin',(V*1000).toFixed(0)+' mV',PAL.orange);ar(240,265,127);
  box(265,90,150,74,'ADC (ref '+ref+' V)',(avg?'avg ':'')+TH.code.toFixed(avg?1:0)+' / 1023',PAL.violet);ar(415,440,127);
  box(440,90,130,74,'× '+ref+' ÷ 1023 × 100',TH.calc.toFixed(1)+' °C',PAL.green);ar(570,592,127);
  const tens=Math.floor(TH.shown/10),u=TH.shown%10;drawDigit(ctx,604,70,0.95,tens?DIGITS[tens]:'',{pad:10,glow:10});drawDigit(ctx,690,70,0.95,DIGITS[u],{pad:10,glow:10});
  txt(ctx,'one ADC step = '+(ref/1023*100).toFixed(2)+' °C',340,200,ref<2?PAL.good:PAL.yellow,13);
  txt(ctx,ref<2?'1.1 V jug: fine marks, 0.1 °C resolution':'5 V jug: coarse marks, the last digit can flip-flop',340,222,PAL.muted,12);
  txt(ctx,avg?'20 readings averaged: steady':'single reading: noisy, watch the digits jitter',340,244,PAL.muted,12);}
(()=>{const b=$('thHot');hold(b,on=>{TH.hot=on;});})();

// ---------- p21: bar-graph thermometer ----------
const BG21={T:22,hot:false};
function drawBarT(dt){const ctx=cv('m21');BG21.T+=((BG21.hot?38:22)-BG21.T)*(1-Math.exp(-dt/(BG21.hot?3:6)));
  const V=BG21.T*0.01,I=+$('bgRHI').value*1e-3;$('bgI').textContent=(I*1e3).toFixed(3)+' mA → '+(I*100*1000/10).toFixed(1)+' °C per step';
  const th=k=>(800+100*k)*I;
  ctx.fillStyle=PAL.panel;ctx.strokeStyle=PAL.orange;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(20,90,130,90,8);ctx.fill();ctx.stroke();
  txt(ctx,'LM35',85,114,PAL.ink2,13);txt(ctx,BG21.T.toFixed(1)+' °C',85,140,PAL.white,16);txt(ctx,'signal '+(V*1000).toFixed(0)+' mV',85,165,PAL.yellow,13);if(BG21.hot)txt(ctx,'🤏',85,215,PAL.white,22);
  W(ctx,[[150,135],[200,135]],PAL.yellow,3);
  const x0=230,yb=270,yt=30,h=(yb-yt)/10;txt(ctx,'+5 V via 20 kΩ + trimmer',x0+40,yt-8,PAL.muted,11);txt(ctx,'800 Ω to GND',x0+40,yb+16,PAL.muted,11);
  for(let i=0;i<10;i++){const y=yb-(i+1)*h+h/2,t=th(i),on=V>t;
    ctx.fillStyle=PAL.raised;ctx.fillRect(x0,y-h/2+2,80,h-4);txt(ctx,(t*1000).toFixed(0)+' mV',x0+40,y+4,PAL.muted,10);
    ctx.fillStyle=on?PAL.green:PAL.slate;ctx.beginPath();ctx.moveTo(x0+90,y-8);ctx.lineTo(x0+110,y);ctx.lineTo(x0+90,y+8);ctx.closePath();ctx.fill();
    W(ctx,[[x0+110,y],[470,y]],on?PAL.green:PAL.slateDark,2);
    const bx=480;ctx.fillStyle=on?PAL.green:'#14301f';if(on){ctx.shadowBlur=14;ctx.shadowColor=PAL.green;}ctx.fillRect(bx,y-h/2+3,120,h-6);ctx.shadowBlur=0;
    txt(ctx,'≥ '+(t*100).toFixed(1)+' °C',bx+130,y+4,PAL.muted,11,'left');}
  txt(ctx,'10 comparators (3 × LM339)',x0+100,yb+16,PAL.muted,11,'left');}
(()=>{const b=$('bgHot');hold(b,on=>{BG21.hot=on;});})();

// ---------- p5: why two transistors ----------
const P5W={n:2};document.querySelectorAll('.p5n').forEach(b=>b.addEventListener('click',()=>{P5W.n=+b.dataset.n;document.querySelectorAll('.p5n').forEach(x=>x.classList.toggle('active',x===b));}));
function drawP5W(){const ctx=cv('cp5w'),k=+$('p5skin').value,R=100e3*Math.pow(20,k),Ib=(9-0.7*P5W.n)/(R+1000),G=P5W.n===2?40000:200,avail=Ib*G,need=(9-2-0.2*P5W.n)/470,I=Math.min(avail,need),b=I/need;
  const fI=i=>i>=1e-3?(i*1000).toFixed(i<0.01?1:0)+' mA':(i*1e6).toFixed(1)+' µA';
  const box=(x,y,w,t1,t2,col)=>{ctx.fillStyle=PAL.panel;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,64,8);ctx.fill();ctx.stroke();txt(ctx,t1,x+w/2,y+22,PAL.muted,11);txt(ctx,t2,x+w/2,y+50,PAL.white,17);};
  const ar=(x1,x2,y,l)=>{W(ctx,[[x1,y],[x2-8,y]],PAL.muted2,2);ctx.fillStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(x2,y);ctx.lineTo(x2-9,y-5);ctx.lineTo(x2-9,y+5);ctx.fill();txt(ctx,l,(x1+x2)/2,y-8,PAL.yellow,12);};
  box(20,20,165,'finger (≈ '+(R>=1e6?(R/1e6).toFixed(1)+' MΩ':Math.round(R/1000)+' kΩ')+')',fI(Ib),'#fcd9b6');ar(185,230,52,'× 200');
  box(230,20,165,'transistor 1: up to',fI(Ib*200),PAL.blue);
  if(P5W.n===2){ar(395,440,52,'× 200');box(440,20,165,'transistor 2: up to',fI(Ib*40000),PAL.green);}
  // need vs available
  const y=130,x0=20,w=540,lg=v=>Math.max(0,Math.min(1,(Math.log10(v)+6)/6));
  ctx.fillStyle=PAL.raised;ctx.fillRect(x0,y,w,22);ctx.fillStyle=avail>=need?PAL.green:PAL.amber;ctx.fillRect(x0,y,w*lg(avail),22);
  const nx=x0+w*lg(need);ctx.strokeStyle=PAL.bad;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(nx,y-6);ctx.lineTo(nx,y+28);ctx.stroke();txt(ctx,'LED wants 14 mA',nx,y+44,PAL.bad,12);
  txt(ctx,'current available: '+fI(avail),x0,y-8,PAL.ink2,12,'left');['1 µA','10 µA','100 µA','1 mA','10 mA','100 mA','1 A'].forEach((l,i)=>txt(ctx,l,x0+w*i/6,y+64,PAL.muted2,10));
  // LED
  glowAt(ctx,690,90,b*0.95,'239,68,68',70);ctx.fillStyle=`rgba(239,68,68,${0.2+0.8*b})`;ctx.beginPath();ctx.arc(690,90,22,0,7);ctx.fill();
  txt(ctx,'LED current: '+fI(I),690,148,PAL.white,14);txt(ctx,b>0.97?'full brightness ✓':b>0.3?'dim':'barely glows',690,170,b>0.97?PAL.green:PAL.amber,13);}
// ---------- p22: IR beam alarm ----------
const IR22={blk:false,X:0.8,hist:[],ph:0};
function drawIR(dt){const ctx=cv('m22'),f=+$('irF').value,sens=Math.exp(-Math.pow((f-38)/2.6,2)),seen=!IR22.blk&&sens>0.45;$('irFv').textContent=f.toFixed(1)+' kHz';
  IR22.ph+=dt*0.6;const tgt=seen?0.8:3.6;IR22.X+=(tgt-IR22.X)*(1-Math.exp(-dt/(seen?0.04:0.35)));IR22.hist.push(IR22.X);if(IR22.hist.length>240)IR22.hist.shift();const alarm=IR22.X>1.3;
  const box=(x,y,w,h,t1,t2,col)=>{ctx.fillStyle=PAL.panel;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,h,8);ctx.fill();ctx.stroke();txt(ctx,t1,x+w/2,y+20,PAL.ink2,12);if(t2)txt(ctx,t2,x+w/2,y+40,PAL.muted,11);};
  const ar=(x1,y1,x2,y2,col)=>{W(ctx,[[x1,y1],[x2,y2]],col||PAL.muted2,2);const a=Math.atan2(y2-y1,x2-x1);ctx.fillStyle=col||PAL.muted2;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-9*Math.cos(a-0.4),y2-9*Math.sin(a-0.4));ctx.lineTo(x2-9*Math.cos(a+0.4),y2-9*Math.sin(a+0.4));ctx.fill();};
  box(15,20,120,52,'555 #1','bursts 690 /s',PAL.blue);ar(135,46,165,46);box(165,20,120,52,'555 #2',f.toFixed(1)+' kHz',PAL.blue);ar(285,46,315,46);
  // IR LED
  const on=Math.sin(IR22.ph*40)>0;glowAt(ctx,335,46,on?0.8:0.2,'139,92,246',34);ctx.fillStyle='#8b5cf6';ctx.beginPath();ctx.arc(335,46,12,0,7);ctx.fill();txt(ctx,'IR LED',335,86,'#c4b5fd',11);
  // beam
  for(let i=0;i<14;i++){const x=355+i*15+((IR22.ph*120)%15);if(IR22.blk&&x>445)break;const burst=Math.floor((x-IR22.ph*120)/30)%2===0;ctx.fillStyle=burst?'rgba(167,139,250,.9)':'rgba(167,139,250,.15)';ctx.fillRect(x,43,8,6);}
  txt(ctx,'invisible 940 nm light',455,28,PAL.muted2,11);if(IR22.blk){txt(ctx,'✋',462,60,PAL.white,34);}
  // TSOP
  box(580,20,110,52,'TSOP38238',sens>0.45?'hears '+f.toFixed(0)+' kHz':'deaf at '+f.toFixed(0)+' kHz',seen?PAL.green:PAL.amber);
  // row 2: bucket, transistor, LED
  ar(635,72,635,130);box(560,130,150,60,'bucket (10 µF)','X = '+IR22.X.toFixed(2)+' V',PAL.yellow);
  const lvl=Math.min(1,(IR22.X-0.5)/3.1);ctx.fillStyle='rgba(56,189,248,.35)';ctx.fillRect(715,190-60*lvl,22,60*lvl);ctx.strokeStyle=PAL.slate;ctx.strokeRect(715,130,22,60);
  ar(560,160,450,160,alarm?PAL.bad:PAL.muted2);box(330,130,120,60,'BC547',alarm?'ON':'off',alarm?PAL.bad:PAL.slate);ar(330,160,250,160,alarm?PAL.bad:PAL.muted2);
  glowAt(ctx,215,160,alarm?0.95:0,'239,68,68',60);ctx.fillStyle=alarm?PAL.bad:'rgba(239,68,68,.2)';ctx.beginPath();ctx.arc(215,160,18,0,7);ctx.fill();
  txt(ctx,alarm?'🚨 ALARM: beam cut':'beam OK',100,165,alarm?PAL.bad:PAL.green,14);
  // scopes
  const gy=230,gh=90,gw=245;const g1=[],g2=[];for(let i=0;i<120;i++){const t=i/120*4+IR22.ph*2,bu=(t%1)<0.5;g1.push(bu?(Math.sin(i*2.6)>0?1:0):0);g2.push(seen&&bu?0:1);}
  mGraph(ctx,15,gy,gw,gh,[[g1,PAL.violet]],-0.2,1.3,'IR light (38 kHz bursts)');
  mGraph(ctx,277,gy,gw,gh,[[g2,PAL.green]],-0.2,1.3,'TSOP OUT (low = burst heard)');
  mGraph(ctx,539,gy,gw,gh,[[IR22.hist,PAL.yellow],[IR22.hist.map(()=>1.3),PAL.bad,[4,4]]],0,4,'bucket X (V), red = alarm level');
  txt(ctx,'slowed down: real bursts last 0.7 ms',400,gy+gh+24,PAL.muted2,11);}
(()=>{const b=$('irBlock');hold(b,on=>{IR22.blk=on;});})();
// ---------- p23/p24: motors ----------
const MO={a23:0,w23:0,a24:0,w24:0,f:false,r:false,ph:0};
function motorDraw(ctx,x,y,ang,col){ctx.fillStyle=PAL.chipLight;ctx.beginPath();ctx.arc(x,y,46,0,7);ctx.fill();ctx.strokeStyle=PAL.muted2;ctx.lineWidth=3;ctx.stroke();
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle=col||PAL.yellow;ctx.fillRect(-4,-40,8,40);ctx.beginPath();ctx.moveTo(4,-40);ctx.lineTo(26,-34);ctx.lineTo(4,-26);ctx.fill();ctx.restore();
  ctx.fillStyle=PAL.grayLight;ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill();txt(ctx,'M',x-30,y+36,PAL.ink2,13);}
function drawPWM(dt){const ctx=cv('m23'),d=+$('p23d').value;$('p23v').textContent=Math.round(d*100)+' % on';
  const x0=44,y0=40,w=450,h=140,per=w/4;ctx.fillStyle=PAL.panel;ctx.fillRect(x0,y0,w,h);ctx.strokeStyle=PAL.line;ctx.strokeRect(x0,y0,w,h);
  const yh=y0+20,yl=y0+h-20;ctx.strokeStyle=PAL.blue;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x0,yl);
  for(let k=0;k<4;k++){const a=x0+k*per;ctx.lineTo(a,yl);ctx.lineTo(a,yh);ctx.lineTo(a+per*d,yh);ctx.lineTo(a+per*d,yl);}ctx.lineTo(x0+w,yl);ctx.stroke();
  const ya=yl-(yl-yh)*d;ctx.setLineDash([6,5]);ctx.strokeStyle=PAL.yellow;ctx.beginPath();ctx.moveTo(x0,ya);ctx.lineTo(x0+w,ya);ctx.stroke();ctx.setLineDash([]);
  txt(ctx,'9 V',x0-4,yh+4,PAL.muted,11,'right');txt(ctx,'0 V',x0-4,yl+4,PAL.muted,11,'right');txt(ctx,'average '+(9*d).toFixed(1)+' V',x0+w-6,ya-6,PAL.yellow,12,'right');
  txt(ctx,'555 output → transistor → motor (one period ≈ 76 µs)',x0,y0-12,PAL.ink2,12,'left');
  for(let k=0;k<4;k++){const a=x0+k*per;txt(ctx,'on',a+per*d/2,yh-6,PAL.link,10);}
  // motor
  const tgt=d<0.15?0:(d-0.15)/0.85*9200;MO.w23+=(tgt-MO.w23)*(1-Math.exp(-dt/0.6));MO.a23+=MO.w23/60*2*Math.PI*dt*0.02;
  motorDraw(ctx,640,110,MO.a23);txt(ctx,MO.w23<50?'stopped (too weak to start)':'≈ '+Math.round(MO.w23/100)*100+' rpm',640,190,PAL.white,14);
  txt(ctx,'(drawn 50× slower)',640,208,PAL.muted2,11);
  // LED + bar
  glowAt(ctx,110,250,d*0.9,'239,68,68',30);ctx.fillStyle=`rgba(239,68,68,${0.15+0.85*d})`;ctx.beginPath();ctx.arc(110,250,10,0,7);ctx.fill();txt(ctx,'speed LED',110,280,PAL.muted,11);
  txt(ctx,'Power wasted in the transistor: tiny, it is either fully ON or fully OFF',480,255,PAL.muted,12);}
function drawHB(dt){const ctx=cv('m24'),f=MO.f,r=MO.r;const L=f&&!r?1:0,Rr=r&&!f?1:0;const hiL=f,hiR=r;// 1Y high if FWD pressed, 2Y high if REV pressed
  MO.ph+=dt;const cx=400,top=40,bot=250,lx=250,rx=550,my=145;
  W(ctx,[[lx,top],[rx,top]],PAL.bad,3);W(ctx,[[lx,bot],[rx,bot]],PAL.water,3);txt(ctx,'+9 V',cx,top-10,PAL.bad,12);txt(ctx,'0 V',cx,bot+20,PAL.water,12);
  const sw=(x,y1,y2,on,lab)=>{W(ctx,[[x,y1],[x,y1+20]],PAL.ink2,2.5);W(ctx,[[x,y2-20],[x,y2]],PAL.ink2,2.5);ctx.strokeStyle=on?PAL.green:PAL.muted2;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y2-20);ctx.lineTo(on?x:x+18,y1+20);ctx.stroke();
    ctx.fillStyle=PAL.ink2;[y1+20,y2-20].forEach(y=>{ctx.beginPath();ctx.arc(x,y,3,0,7);ctx.fill();});txt(ctx,lab,x+(x<cx?-34:34),(y1+y2)/2+4,on?PAL.green:PAL.muted2,12);};
  sw(lx,top,my,hiL,'S1');sw(lx,my,bot,!hiL,'S2');sw(rx,top,my,hiR,'S3');sw(rx,my,bot,!hiR,'S4');
  W(ctx,[[lx,my],[cx-50,my]],PAL.ink2,2.5);W(ctx,[[cx+50,my],[rx,my]],PAL.ink2,2.5);txt(ctx,'1Y',lx+22,my-8,PAL.muted,11);txt(ctx,'2Y',rx-22,my-8,PAL.muted,11);
  const dir=L?1:Rr?-1:0;MO.w24+=(dir*1-MO.w24)*(1-Math.exp(-dt/(dir?0.5:0.25)));MO.a24+=MO.w24*dt*6;motorDraw(ctx,cx,my,MO.a24,PAL.yellow);
  if(dir){const path=dir>0?[[lx,top+2],[lx,my],[cx-50,my],[cx+50,my],[rx,my],[rx,bot-2]]:[[rx,top+2],[rx,my],[cx+50,my],[cx-50,my],[lx,my],[lx,bot-2]];
    const segs=[];let tot=0;for(let i=1;i<path.length;i++){const l=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]);segs.push(l);tot+=l;}
    for(let k=0;k<14;k++){let s=((MO.ph*120+k*tot/14)%tot);for(let i=0;i<segs.length;i++){if(s<=segs[i]){const t=s/segs[i],p=[path[i][0]+(path[i+1][0]-path[i][0])*t,path[i][1]+(path[i+1][1]-path[i][1])*t];if(!(p[0]>cx-46&&p[0]<cx+46)){ctx.fillStyle=PAL.highlight;ctx.beginPath();ctx.arc(p[0],p[1],4,0,7);ctx.fill();}break;}s-=segs[i];}}}
  // LEDs
  [[680,110,'239,68,68',L,'red: forward'],[680,180,'34,197,94',Rr,'green: reverse']].forEach(([x,y,c,on,l])=>{glowAt(ctx,x,y,on?0.9:0,c,30);ctx.fillStyle=`rgba(${c},${on?1:0.2})`;ctx.beginPath();ctx.arc(x,y,11,0,7);ctx.fill();txt(ctx,l,x+20,y+4,PAL.muted,12,'left');});
  const st=f&&r?'both pressed: S1 + S3 closed, 9 V on both ends → 0 V across the motor: stop':f?'FORWARD: S1 + S4 closed, current flows left → right':r?'REVERSE: S3 + S2 closed, current flows right → left':'no button: S2 + S4 closed, both ends at 0 V: stop';
  txt(ctx,st,cx,290,PAL.ink,13);txt(ctx,'inside the L293D',100,40,PAL.muted2,12);}
[['p24f','f'],['p24r','r']].forEach(([id,k])=>{const b=$(id);hold(b,on=>{MO[k]=on;});});

// ---------- p25: lower the voltage ----------
const LV={m:'dio',a:0,w:0};
document.querySelectorAll('.p25m').forEach(b=>b.addEventListener('click',()=>{LV.m=b.dataset.m;document.querySelectorAll('.p25m').forEach(x=>x.classList.toggle('active',x===b));}));
const LVF={direct:I=>9-0.5*I,cap:I=>9-0.5*I,res:I=>9-0.5*I-12*I,dio:I=>9-0.5*I-4*(0.7+0.15*I),pwm:I=>0.67*(9-0.5*I)};
const LVC={direct:PAL.bad,cap:PAL.orange,res:PAL.violet,dio:PAL.green,pwm:PAL.blue};
const LVN={direct:'direct 9 V',cap:'capacitor only',res:'resistor 12 Ω',dio:'4 diodes',pwm:'PWM 67 % (average)'};
function drawLV(dt){const ctx=cv('m25'),l=+$('p25l').value,I=0.1+0.8*l,m=LV.m,Vm=LVF[m](I),E=Vm-6*I,sp=Math.max(0,E/5.4);
  const x0=60,y0=20,w=380,h=230,X=i=>x0+i*w,Y=v=>y0+h-v/10*h;
  ctx.fillStyle=PAL.panel;ctx.fillRect(x0,y0,w,h);ctx.fillStyle='rgba(34,197,94,.12)';ctx.fillRect(x0,Y(6),w,Y(3)-Y(6));txt(ctx,'3–6 V: what a small motor wants',x0+w-6,Y(3)-6,'#4ade80',11,'right');
  ctx.strokeStyle=PAL.line;ctx.strokeRect(x0,y0,w,h);
  for(let v=0;v<=10;v+=2)txt(ctx,v+' V',x0-6,Y(v)+4,PAL.muted2,10,'right');[0,0.25,0.5,0.75,1].forEach(i=>txt(ctx,i+' A',X(i),y0+h+16,PAL.muted2,10));
  txt(ctx,'current the motor draws →',x0+w/2,y0+h+32,PAL.muted,11);txt(ctx,'voltage on the motor',x0+4,y0+14,PAL.muted,11,'left');
  Object.keys(LVF).forEach(k=>{if(k==='cap')return;const sel=k===m||(m==='cap'&&k==='direct');ctx.strokeStyle=sel?LVC[m==='cap'?'cap':k]:'rgba(148,163,184,.25)';ctx.lineWidth=sel?3:1.5;ctx.beginPath();
    for(let i=0;i<=50;i++){const c=i/50,v=Math.max(0,LVF[k](c));i?ctx.lineTo(X(c),Y(v)):ctx.moveTo(X(c),Y(v));}ctx.stroke();});
  ctx.fillStyle=PAL.white;ctx.beginPath();ctx.arc(X(I),Y(Math.max(0,Vm)),6,0,7);ctx.fill();
  ctx.fillStyle='rgba(17,28,46,.85)';ctx.fillRect(x0+6,Y(1.6),170,22);txt(ctx,'● '+LVN[m],x0+12,Y(1.6)+15,LVC[m],12,'left');
  // motor
  LV.w+=(sp-LV.w)*(1-Math.exp(-dt/0.4));LV.a+=LV.w*dt*14;motorDraw(ctx,600,90,LV.a);
  const heat=m==='res'?12*I*I:m==='dio'?4*(0.7+0.15*I)*I:m==='pwm'?0.05:0;
  const verdict=E<=0.3?['stalls: not enough voltage left',PAL.amber]:Vm>6.6?['too fast: hot coil, worn brushes, short life',PAL.bad]:Vm<2.8?['weak, may stall',PAL.amber]:['✓ happy motor',PAL.green];
  txt(ctx,'motor gets '+Math.max(0,Vm).toFixed(1)+' V at '+I.toFixed(2)+' A',600,160,PAL.white,13);txt(ctx,'speed '+Math.round(sp*100)+' % of its rated speed',600,180,PAL.ink2,12);
  txt(ctx,verdict[0],600,202,verdict[1],13);
  txt(ctx,'heat wasted in the reducer: '+heat.toFixed(2)+' W',600,232,PAL.ink2,12);
  if(m==='res'&&heat>0.25)txt(ctx,'🔥 a 1/4 W resistor burns above 0.25 W',600,252,PAL.bad,12);
  if(m==='dio')txt(ctx,(heat/4).toFixed(2)+' W per diode: fine (1N4007 ≈ 1 W)',600,252,PAL.muted,12);
  if(m==='cap')txt(ctx,'the capacitor charges to 9 V: nothing reduced',600,252,PAL.orange,12);
  if(m==='pwm')txt(ctx,'switching: almost no heat',600,252,PAL.muted,12);
  txt(ctx,l<0.05?'spinning free':l>0.9?'almost blocked (like start-up)':'with some load',600,280,PAL.muted2,11);}

// ---------- p26: quartz stopwatch ----------
const QZ={t:0,t5:0};
$('p26r').addEventListener('click',()=>{QZ.t=0;QZ.t5=0;});
function drawQZ(dt){const ctx=cv('m26');QZ.t+=dt;QZ.t5+=dt*1.03;
  const st=[['quartz','32,768 Hz'],['÷2 ×4','2,048 Hz'],['÷2 ×4','128 Hz'],['Q12','8 Hz'],['Q13','4 Hz'],['Q14','2 Hz'],['4013','1 Hz']];
  const fr=[32768,2048,128,8,4,2,1];
  st.forEach(([a,b],i)=>{const x=20+i*110,y=30,f=fr[i],on=f<=10?Math.floor(QZ.t*f*2)%2===0:null;
    ctx.fillStyle=PAL.panel;ctx.strokeStyle=i===0?PAL.ink2:i===6?PAL.green:PAL.blue;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,96,60,8);ctx.fill();ctx.stroke();
    txt(ctx,a,x+48,y+20,PAL.ink2,12);txt(ctx,b,x+48,y+40,PAL.white,13);
    if(on===null){ctx.fillStyle='rgba(250,204,21,.45)';ctx.fillRect(x+30,y+48,36,6);}else{glowAt(ctx,x+48,y+52,on?0.8:0,'250,204,21',14);ctx.fillStyle=on?PAL.yellowSoft:'#3f3f1d';ctx.beginPath();ctx.arc(x+48,y+52,5,0,7);ctx.fill();}
    if(i<6){W(ctx,[[x+96,y+30],[x+110,y+30]],PAL.muted2,2);}});
  txt(ctx,'inside the CD4060: 14 divide-by-2 stages',350,108,PAL.muted2,11);txt(ctx,'blur = too fast to see',90,108,PAL.muted2,11);
  const disp=(x,lab,col,t,sub)=>{const n=Math.floor(t)%100;ctx.fillStyle='#0a0a0a';ctx.fillRect(x,140,150,90);txt(ctx,String(n).padStart(2,'0'),x+75,205,col,60);txt(ctx,lab,x+75,132,PAL.ink2,13);txt(ctx,sub,x+75,250,PAL.muted,12);};
  disp(140,'quartz version',PAL.bad,QZ.t,'±2 s per day');disp(420,'NE555 version',PAL.orange,QZ.t5,'3 % fast here');
  const diff=QZ.t5-QZ.t;txt(ctx,'after '+QZ.t.toFixed(0)+' s, the 555 is ahead by '+diff.toFixed(1)+' s',400,285,diff>1?PAL.amber:PAL.muted,13);}

// ---------- loop ----------
loop((dt,now)=>{
  if(vis('m16'))drawFF(dt);if(vis('m17'))drawSiren(dt);if(vis('m18'))drawFuzz(dt);if(vis('m19'))drawCnt(dt);if(vis('m20'))drawTherm(dt);if(vis('m21'))drawBarT(dt);if(vis('cp5w'))drawP5W();if(vis('m22'))drawIR(dt);if(vis('m23'))drawPWM(dt);if(vis('m24'))drawHB(dt);if(vis('m25'))drawLV(dt);if(vis('m26'))drawQZ(dt);});
