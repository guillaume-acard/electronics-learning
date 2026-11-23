
// ===== DIP helper =====
function dip(ctx,x,y,labels,title,hl=[],sp=20){const n=labels.length,h=n/2,w=70,H=h*sp+10;
  ctx.fillStyle='#1f2937';ctx.fillRect(x,y,w,H);ctx.strokeStyle='#475569';ctx.lineWidth=1.5;ctx.strokeRect(x,y,w,H);
  ctx.fillStyle='#0b1220';ctx.beginPath();ctx.arc(x+w/2,y,8,0,Math.PI);ctx.fill();ctx.fillStyle='#94a3b8';ctx.beginPath();ctx.arc(x+12,y+12,3,0,7);ctx.fill();
  arrowText(ctx,title,x+w/2,y+H/2+4,'#e2e8f0',12);
  for(let i=0;i<h;i++){const py=y+15+i*sp;
    [[i,x-12,'right',x-16],[n-1-i,x+w,'left',x+w+16]].forEach(([k,px,al,tx])=>{const on=hl.includes(k+1);ctx.fillStyle=on?'#fbbf24':'#cbd5e1';ctx.fillRect(px,py-3,12,6);
      arrowText(ctx,(al==='right'?labels[k]+' '+(k+1):(k+1)+' '+labels[k]),tx,py+4,on?'#fbbf24':'#94a3b8',10,al);});}
  return H;}

// ===== 1. Anatomy =====
(function(){const c=$('cDip'),ctx=c.getContext('2d');const x=120,y=40,w=110,sp=36;
  ctx.fillStyle='#1f2937';ctx.fillRect(x,y,w,4*sp+10);ctx.strokeStyle='#475569';ctx.lineWidth=2;ctx.strokeRect(x,y,w,4*sp+10);
  ctx.fillStyle='#0b1220';ctx.beginPath();ctx.arc(x+w/2,y,12,0,Math.PI);ctx.fill();ctx.fillStyle='#94a3b8';ctx.beginPath();ctx.arc(x+18,y+18,5,0,7);ctx.fill();
  for(let i=0;i<4;i++){const py=y+22+i*sp;ctx.fillStyle='#cbd5e1';ctx.fillRect(x-20,py-4,20,8);ctx.fillRect(x+w,py-4,20,8);
    arrowText(ctx,String(i+1),x-28,py+5,'#fbbf24',14,'right');arrowText(ctx,String(8-i),x+w+28,py+5,'#fbbf24',14,'left');}
  ctx.strokeStyle='#fbbf24';ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.ellipse(x+w/2,y+80,w/2+50,90,0,-2.6,2.6,true);ctx.stroke();ctx.setLineDash([]);
  arrowText(ctx,'notch',x+w/2,y-14,'#94a3b8',12);arrowText(ctx,'dot = pin 1',x+30,y+42,'#94a3b8',11,'left');
  arrowText(ctx,'anticlockwise ↺',x+w/2,y+4*sp+40,'#fbbf24',13);
  // die zoom
  const dx=470,dy=40;ctx.fillStyle='#334155';ctx.fillRect(dx,dy,170,150);ctx.strokeStyle='#64748b';ctx.strokeRect(dx,dy,170,150);
  for(let i=0;i<14;i++)for(let j=0;j<12;j++){ctx.fillStyle=(i*7+j*3)%5?'#475569':'#60a5fa';ctx.fillRect(dx+8+i*11.5,dy+8+j*11.5,8,8);}
  W(ctx,[[x+w+60,y+60],[dx-10,dy+70]],'#94a3b8',1.5);
  arrowText(ctx,'inside: a silicon "die"',dx+85,dy+170,'#e2e8f0',13);arrowText(ctx,'covered in microscopic transistors,',dx+85,dy+188,'#94a3b8',12);arrowText(ctx,'resistors and wires',dx+85,dy+204,'#94a3b8',12);})();

// ===== 3. 555 =====
const CAPS=[[100e-6,'100 µF'],[10e-6,'10 µF'],[1e-6,'1 µF'],[100e-9,'100 nF'],[10e-9,'10 nF']];
const T5={c:1,t:0,osc:null,ctxA:null};
choices('tCch',CAPS.map(c=>c[1]),1,i=>{T5.c=i;updSnd();});
const kR=v=>Math.pow(10,+v)*1000;
function p555(){const R1=kR($('tR1').value),R2=kR($('tR2').value),C=CAPS[T5.c][0];const th=0.693*(R1+R2)*C,tl=0.693*R2*C;return{R1,R2,C,th,tl,T:th+tl,f:1/(th+tl)};}
function updSnd(){if(T5.osc){const f=p555().f;T5.osc.frequency.value=Math.min(8000,Math.max(20,f));}}
['tR1','tR2'].forEach(id=>$(id).addEventListener('input',updSnd));
$('tSnd').onclick=()=>{try{if(T5.osc){T5.osc.stop();T5.osc=null;$('tSnd').textContent='🔊 Listen';return;}
  T5.ctxA=T5.ctxA||new (window.AudioContext||window.webkitAudioContext)();const o=T5.ctxA.createOscillator(),g=T5.ctxA.createGain();o.type='square';g.gain.value=0.05;o.connect(g);g.connect(T5.ctxA.destination);o.start();T5.osc=o;updSnd();$('tSnd').textContent='🔇 Stop';}catch(e){$('tSnd').textContent='sound unavailable';}};
const fmtK=r=>r>=1e6?(r/1e6).toFixed(1)+' MΩ':r>=1000?(r/1000).toFixed(r<10000?1:0)+' kΩ':r.toFixed(0)+' Ω';
const fmtF=f=>f>=1000?(f/1000).toFixed(2)+' kHz':f>=10?f.toFixed(0)+' Hz':f.toFixed(2)+' Hz';
function draw555(dt){T5.t+=dt;const P=p555(),c=$('c555'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  dip(ctx,60,40,['GND','TRIG','OUT','RESET','CTRL','THR','DIS','VCC'],'NE555',[2,3,6,7,8]);
  const slow=P.f<8,win=slow?4:3*P.T,t0=slow?T5.t-win:0;
  const vc=t=>{const ph=((t%P.T)+P.T)%P.T;return ph<P.th?1-(2/3)*Math.exp(-ph/((P.R1+P.R2)*P.C)):(2/3)*Math.exp(-(ph-P.th)/(P.R2*P.C));};
  const out=t=>{const ph=((t%P.T)+P.T)%P.T;return ph<P.th;};
  const gx=330,gw=450,X=t=>gx+(t-t0)/win*gw;
  [[30,90,'capacitor',k=>vc(k),'#60a5fa'],[150,60,'output (pin 3)',k=>out(k)?1:0,'#10b981']].forEach(([gy,gh,l,fn,col])=>{ctx.fillStyle='#1e293b';ctx.fillRect(gx,gy,gw,gh);arrowText(ctx,l,gx-6,gy+gh/2+4,'#94a3b8',11,'right');
    if(l==='capacitor'){[1/3,2/3].forEach(v=>{const yy=gy+gh-v*gh;ctx.strokeStyle='#f59e0b';ctx.setLineDash([4,4]);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gx,yy);ctx.lineTo(gx+gw,yy);ctx.stroke();ctx.setLineDash([]);arrowText(ctx,v<0.5?'⅓':'⅔',gx+gw+4,yy+4,'#f59e0b',11,'left');});}
    ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();for(let px=0;px<=gw;px++){const t=t0+px/gw*win,v=fn(t),yy=gy+gh-4-v*(gh-8);px?ctx.lineTo(gx+px,yy):ctx.moveTo(gx+px,yy);}ctx.stroke();});
  const on=slow?out(T5.t):true,b=slow?(on?1:0):P.th/P.T;
  const lx=250,ly=120;if(b>0.02){const g=ctx.createRadialGradient(lx,ly,2,lx,ly,40);g.addColorStop(0,`rgba(239,68,68,${b})`);g.addColorStop(1,'rgba(239,68,68,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(lx,ly,40,0,7);ctx.fill();}
  ctx.fillStyle=`rgba(239,68,68,${0.25+0.75*b})`;ctx.beginPath();ctx.arc(lx,ly,12,0,7);ctx.fill();arrowText(ctx,'LED',lx,ly+30,'#94a3b8',11);
  arrowText(ctx,'R1 '+fmtK(P.R1)+' · R2 '+fmtK(P.R2)+' · C '+CAPS[T5.c][1],gx,240,'#e2e8f0',13,'left');
  arrowText(ctx,'→ '+fmtF(P.f)+'   (on '+Math.round(P.th/P.T*100)+'% of the time)',gx,262,'#fbbf24',15,'left');
  arrowText(ctx,slow?'slow enough to see it blink':P.f<25?'blinking fast':P.f<20000?'too fast to see: it\'s a tone! Press Listen':'ultrasonic',gx,284,'#94a3b8',12,'left');}

// ===== 4. 7805 =====
const RG={hs:0,T:0,shut:false};
choices('rgChoices',['No heatsink','With heatsink'],0,i=>RG.hs=i);
function draw7805(dt){const Vin=+$('rgV').value,Il=+$('rgI').value;
  let Vout=RG.shut?0:Math.max(0,Math.min(5,Vin-2));const I=Il*Vout/5,P=Math.max(0,Vin-Vout)*I;
  const Rth=RG.hs?8:60;RG.T+=(P*Rth-RG.T)*dt/2.5;if(RG.T>100)RG.shut=true;if(RG.shut&&RG.T<70)RG.shut=false;
  const c=$('c7805'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  // TO-220 drawing
  const x=80,y=40;if(RG.hs){ctx.fillStyle='#64748b';for(let i=0;i<6;i++)ctx.fillRect(x-20+i*14,y-25,8,60);}
  ctx.fillStyle='#94a3b8';ctx.fillRect(x-10,y,90,40);ctx.fillStyle='#0b1220';ctx.beginPath();ctx.arc(x+35,y+20,7,0,7);ctx.fill();
  const hot=Math.min(1,RG.T/100);ctx.fillStyle=`rgb(${Math.round(31+200*hot)},${Math.round(41-10*hot)},${Math.round(55-20*hot)})`;ctx.fillRect(x-10,y+40,90,60);
  arrowText(ctx,'7805',x+35,y+76,'#e2e8f0',14);
  ['IN','GND','OUT'].forEach((l,i)=>{ctx.fillStyle='#cbd5e1';ctx.fillRect(x+4+i*30,y+100,6,50);arrowText(ctx,String(i+1),x+7+i*30,y+164,'#fbbf24',11);arrowText(ctx,l,x+7+i*30,y+180,'#fbbf24',10);});
  // gauges
  const gauge=(gx,v,max,l,col)=>{ctx.fillStyle='#1e293b';ctx.fillRect(gx,40,60,150);ctx.fillStyle=col;const h=Math.min(1,v/max)*150;ctx.fillRect(gx,190-h,60,h);ctx.strokeStyle='#475569';ctx.strokeRect(gx,40,60,150);
    arrowText(ctx,l,gx+30,30,'#94a3b8',12);arrowText(ctx,v.toFixed(l==='heat'?2:1)+(l==='heat'?' W':' V'),gx+30,210,col,15);};
  gauge(290,Vin,20,'input','#f59e0b');gauge(390,Vout,20,'output','#10b981');gauge(490,P,5,'heat','#ef4444');
  ctx.strokeStyle='#10b981';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(390,190-5/20*150);ctx.lineTo(450,190-5/20*150);ctx.stroke();ctx.setLineDash([]);
  // thermometer
  const tx=600;ctx.fillStyle='#1e293b';ctx.fillRect(tx,40,20,150);const tl=Math.min(1,RG.T/110);ctx.fillStyle=RG.T>80?'#ef4444':RG.T>50?'#f59e0b':'#10b981';ctx.fillRect(tx,190-tl*150,20,tl*150);ctx.strokeStyle='#475569';ctx.strokeRect(tx,40,20,150);
  arrowText(ctx,'chip temp',tx+10,30,'#94a3b8',12);
  let msg,col;
  if(RG.shut){msg='Too hot: thermal shutdown! Output cut until it cools.';col='#ef4444';}
  else if(Vin<7){msg='Input too low (needs ≥ 7 V): output sags below 5 V';col='#f59e0b';}
  else if(P>1&&!RG.hs){msg='Getting very hot: add a heatsink';col='#f59e0b';}
  else {msg='Steady 5 V out ✓';col='#10b981';}
  wrapText(ctx,msg,640,90,150,18,col,13);
  arrowText(ctx,'heat = ('+Vin.toFixed(1)+' − '+Vout.toFixed(1)+') V × '+(I*1000).toFixed(0)+' mA',440,245,'#94a3b8',12);}

// ===== 5. LM358 =====
const OA={mode:0,t:0,h:[]};
choices('oaChoices',['Comparator (yes / no)','Amplifier (with feedback)'],0,i=>{OA.mode=i;$('oaCmp').style.display=i?'none':'';$('oaAmp').style.display=i?'':'none';});
function opTri(ctx,x,y,col='#cbd5e1'){ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.fillStyle='#0b1220';ctx.beginPath();ctx.moveTo(x,y-45);ctx.lineTo(x+80,y);ctx.lineTo(x,y+45);ctx.closePath();ctx.fill();ctx.stroke();
  arrowText(ctx,'+',x+10,y-17,'#f87171',16,'left');arrowText(ctx,'−',x+10,y+27,'#60a5fa',16,'left');}
function draw358(dt){OA.t+=dt;const c=$('c358'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  dip(ctx,90,40,['OUT A','IN− A','IN+ A','GND','IN+ B','IN− B','OUT B','VCC'],'LM358',[1,2,3,4,8]);
  if(!OA.mode){const vp=+$('oaP').value,vn=+$('oaN').value,hi=vp>vn,vo=hi?3.5:0;
    const x=400,y=120;opTri(ctx,x,y,hi?'#10b981':'#cbd5e1');W(ctx,[[290,y-22],[x,y-22]],'#cbd5e1');W(ctx,[[290,y+22],[x,y+22]],'#cbd5e1');W(ctx,[[x+80,y],[550,y]],'#cbd5e1');
    arrowText(ctx,'sensor '+vp.toFixed(2)+' V',292,y-30,'#f87171',12,'left');arrowText(ctx,'threshold '+vn.toFixed(2)+' V',292,y+40,'#60a5fa',12,'left');
    const g=ctx.createRadialGradient(575,y,2,575,y,40);if(hi){g.addColorStop(0,'rgba(250,204,21,1)');g.addColorStop(1,'rgba(250,204,21,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(575,y,40,0,7);ctx.fill();}
    ctx.fillStyle=hi?'#facc15':'#3f3f46';ctx.beginPath();ctx.arc(575,y,13,0,7);ctx.fill();
    arrowText(ctx,'out: '+vo.toFixed(1)+' V ('+(hi?'HIGH':'LOW')+')',600,y+5,hi?'#10b981':'#94a3b8',14,'left');
    // see-saw
    const sx=470,sy=225,a=Math.max(-0.3,Math.min(0.3,(vn-vp)*3));ctx.save();ctx.translate(sx,sy);ctx.rotate(a);ctx.fillStyle='#64748b';ctx.fillRect(-90,-4,180,8);ctx.fillStyle='#f87171';ctx.fillRect(-90,-18,20,14);ctx.fillStyle='#60a5fa';ctx.fillRect(70,-18,20,14);ctx.restore();
    ctx.fillStyle='#94a3b8';ctx.beginPath();ctx.moveTo(sx,sy+4);ctx.lineTo(sx-10,sy+22);ctx.lineTo(sx+10,sy+22);ctx.fill();
    arrowText(ctx,hi?'+ is higher → output slams HIGH':'+ is lower → output slams LOW',580,225,'#e2e8f0',12,'left');arrowText(ctx,'(even 0.001 V difference is enough)',580,245,'#94a3b8',11,'left');}
  else{const r=+$('oaG').value,G=1+r;const vin=0.3+0.1*Math.sin(2*Math.PI*0.8*OA.t);const vo=Math.max(0,Math.min(3.5,G*vin));
    OA.h.push({t:OA.t,vin,vo,top:3.5});prune(OA.h,OA.t,4);
    const x=330,y=110;opTri(ctx,x,y);W(ctx,[[290,y-22],[x,y-22]],'#cbd5e1');arrowText(ctx,'in',292,y-30,'#f59e0b',12,'left');
    W(ctx,[[x+80,y],[x+120,y],[x+120,y+70],[x+90,y+70]],'#cbd5e1');resBox2(ctx,x+40,y+62,50,16,'Rf');W(ctx,[[x+40,y+70],[x-20,y+70],[x-20,y+22],[x,y+22]],'#cbd5e1');
    W(ctx,[[x-20,y+70],[x-20,y+90]],'#cbd5e1');resBox2(ctx,x-28,y+90,16,40,'Rg');W(ctx,[[x-20,y+130],[x-20,y+145]],'#cbd5e1');gndSym(ctx,x-20,y+145);
    arrowText(ctx,'gain = 1 + Rf/Rg = '+G.toFixed(1),x-10,y-60,'#fbbf24',14,'left');
    plot(ctx,500,30,280,170,OA.h,OA.t,4,[{k:'vin',col:'#f59e0b',label:'input'},{k:'vo',col:'#10b981',label:'output'},{k:'top',col:'#ef4444',dash:[5,4],lw:1,label:'max (VCC − 1.5 V)'}],0,4.2,'');
    arrowText(ctx,G*0.4>3.5?'Too much gain: output clipped at the top':'Exact copy, '+G.toFixed(1)+'× bigger',625,250,G*0.4>3.5?'#fbbf24':'#10b981',13);}}
function resBox2(ctx,x,y,w,h,t){ctx.fillStyle='#0b1220';ctx.strokeStyle='#cbd5e1';ctx.lineWidth=2.5;ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);arrowText(ctx,t,w>h?x+w/2:x+w+14,w>h?y-6:y+h/2+4,'#e2e8f0',11);}

// ===== 6. LM386 =====
const LA={t:0,h:[],cone:0};
function draw386(dt){LA.t+=dt;const a=+$('laIn').value*0.1,k=+$('laG').value,G=20+180*k;
  const vin=a*(Math.sin(2*Math.PI*0.9*LA.t)+0.3*Math.sin(2*Math.PI*2.7*LA.t));const vo=Math.max(0.4,Math.min(8.6,4.5+G*vin*0.5));
  LA.h.push({t:LA.t,vo,hi:8.6,lo:0.4,mid:4.5});prune(LA.h,LA.t,4);
  const c=$('c386'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  dip(ctx,90,40,['GAIN','−IN','+IN','GND','OUT','VS','BYPASS','GAIN'],'LM386',[1,8,3,5]);
  arrowText(ctx,'gain knob between 1 and 8',125,165,'#fbbf24',11);
  plot(ctx,270,30,320,170,LA.h,LA.t,4,[{k:'vo',col:'#10b981',label:'output (pin 5)'},{k:'mid',col:'#94a3b8',dash:[4,4],lw:1,label:'4.5 V'},{k:'hi',col:'#ef4444',dash:[5,4],lw:1,label:'limits'},{k:'lo',col:'#ef4444',dash:[5,4],lw:1}],0,9,'');
  // speaker
  const sx=680,sy=110,d=(vo-4.5)*3;ctx.fillStyle='#cbd5e1';ctx.fillRect(sx-40,sy-18,22,36);
  ctx.fillStyle='#64748b';ctx.beginPath();ctx.moveTo(sx-18,sy-18);ctx.lineTo(sx+20+d,sy-50);ctx.lineTo(sx+20+d,sy+50);ctx.lineTo(sx-18,sy+18);ctx.fill();
  ctx.strokeStyle='#60a5fa';ctx.lineWidth=2;const amp=Math.min(1,Math.abs(vo-4.5)/4);for(let i=0;i<3;i++){ctx.globalAlpha=amp*(1-i*0.3);ctx.beginPath();ctx.arc(sx+30,sy,25+i*16,-0.7,0.7);ctx.stroke();}ctx.globalAlpha=1;
  arrowText(ctx,'push ↔ pull',sx,sy+75,'#94a3b8',12);
  const clip=G*a*1.3*0.5>4.1;arrowText(ctx,'gain ≈ '+Math.round(G)+'×',420,232,'#fbbf24',15);
  arrowText(ctx,clip?'Output hits the 0 V / 9 V limits: clipping = overdrive':'Clean: the output swings around 4.5 V',420,256,clip?'#fbbf24':'#10b981',13);}

// ===== 7. CD4017 =====
const CT={q:0,acc:0,flash:0};
(function(){const s=$('ctN');for(let n=2;n<=10;n++){const o=document.createElement('option');o.value=n;o.textContent=n;s.appendChild(o);}s.value=10;})();
function pulse(){CT.q=(CT.q+1)%(+$('ctN').value);CT.flash=0.15;}
$('ctStep').onclick=pulse;
function draw4017(dt){const f=+$('ctF').value;if(f>0){CT.acc+=dt*f;while(CT.acc>=1){CT.acc-=1;pulse();}}CT.flash=Math.max(0,CT.flash-dt);
  const c=$('c4017'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  dip(ctx,80,30,['Q5','Q1','Q0','Q2','Q6','Q7','Q3','VSS','Q8','Q4','Q9','CO','EN','CLK','RST','VDD'],'CD4017',[14,15],12);
  arrowText(ctx,'14 = clock · 15 = reset',115,185,'#fbbf24',11);
  const N=+$('ctN').value;
  for(let i=0;i<10;i++){const x=260+i*52,y=110,on=i===CT.q,used=i<N;
    if(on){const g=ctx.createRadialGradient(x,y,2,x,y,34);g.addColorStop(0,'rgba(239,68,68,1)');g.addColorStop(1,'rgba(239,68,68,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,34,0,7);ctx.fill();}
    ctx.fillStyle=on?'#ef4444':used?'#3f1d1d':'#1e293b';ctx.beginPath();ctx.arc(x,y,13,0,7);ctx.fill();ctx.strokeStyle=used?'#7f1d1d':'#334155';ctx.lineWidth=1.5;ctx.stroke();
    arrowText(ctx,'Q'+i,x,y+34,used?'#94a3b8':'#475569',12);}
  if(N<10){const x=260+N*52;ctx.strokeStyle='#fbbf24';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,150);ctx.lineTo(x,175);ctx.lineTo(260-30,175);ctx.lineTo(230,60);ctx.stroke();arrowText(ctx,'Q'+N+' wired to RESET → counts 0…'+(N-1),x+10,195,'#fbbf24',12,'left');}
  ctx.fillStyle=CT.flash>0?'#fbbf24':'#334155';ctx.fillRect(260,40,60,20);arrowText(ctx,'CLOCK',290,54,CT.flash>0?'#0b1220':'#94a3b8',11);
  arrowText(ctx,'count = '+CT.q,500,55,'#e2e8f0',15);
  arrowText(ctx,f>0?(f.toFixed(1)+' pulses per second'):'clock stopped: use "One pulse"',500,235,'#94a3b8',12);}

// ===== 8. 74HC595 =====
const SR={pat:[1,0,1,1,0,0,1,0],reg:[0,0,0,0,0,0,0,0],out:[0,0,0,0,0,0,0,0],step:-1,acc:0,trace:[],phase:''};
function srStart(){SR.step=0;SR.acc=0;SR.trace=[];}
$('srSend').onclick=srStart;setTimeout(srStart,600);$('srRand').onclick=()=>{SR.pat=SR.pat.map(()=>Math.random()<0.5?1:0);};
$('c595').addEventListener('click',e=>{const c=$('c595'),r=c.getBoundingClientRect(),x=(e.clientX-r.left)*c.width/r.width,y=(e.clientY-r.top)*c.height/r.height;
  if(y>250&&y<290){const i=Math.floor((x-330)/52);if(i>=0&&i<8)SR.pat[i]^=1;}});
function stepSR(dt){if(SR.step<0)return;SR.acc+=dt*(+$('srSp').value);
  while(SR.acc>=0.5){SR.acc-=0.5;const s=SR.step;
    if(s<16){const bit=SR.pat[7-Math.floor(s/2)];if(s%2===0){SR.trace.push({d:bit,c:0,l:0});SR.phase='DATA = '+bit;}else{SR.reg=[bit,...SR.reg.slice(0,7)];SR.trace.push({d:bit,c:1,l:0});SR.phase='CLOCK tick → shift';}}
    else if(s===16){SR.trace.push({d:0,c:0,l:1});SR.out=[...SR.reg];SR.phase='LATCH → all 8 outputs update at once';}
    else {SR.trace.push({d:0,c:0,l:0});SR.step=-2;}
    SR.step++;}}
function draw595(dt){stepSR(dt);const c=$('c595'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  // wires & traces
  [['DATA','d','#f59e0b'],['CLOCK','c','#60a5fa'],['LATCH','l','#10b981']].forEach(([n,k,col],j)=>{const y=30+j*34;arrowText(ctx,n,70,y+4,col,12,'right');
    ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();let x=80;ctx.moveTo(x,y+10);SR.trace.forEach(p=>{const yy=p[k]?y-8:y+10;ctx.lineTo(x,yy);x+=12;ctx.lineTo(x,yy);});ctx.lineTo(Math.max(x,80),y+10);ctx.stroke();});
  arrowText(ctx,'pins: 14 DATA · 11 CLOCK · 12 LATCH · 15,1–7 outputs',560,20,'#94a3b8',11);
  arrowText(ctx,SR.phase,560,50,'#fbbf24',14);
  // register cells
  arrowText(ctx,'shift register (inside)',290,149,'#94a3b8',12,'right');
  for(let i=0;i<8;i++){const x=330+i*52;ctx.fillStyle=SR.reg[i]?'#1d4ed8':'#1e293b';ctx.fillRect(x,128,40,32);ctx.strokeStyle='#475569';ctx.strokeRect(x,128,40,32);arrowText(ctx,String(SR.reg[i]),x+20,149,'#e2e8f0',14);}
  ctx.strokeStyle='#64748b';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(296,144);ctx.lineTo(328,144);ctx.stroke();arrowText(ctx,'→ bits enter here',300,175,'#94a3b8',10);
  arrowText(ctx,'outputs (LEDs)',320,207,'#94a3b8',12,'right');
  for(let i=0;i<8;i++){const x=350+i*52,y=202,on=SR.out[i];if(on){const g=ctx.createRadialGradient(x,y,2,x,y,26);g.addColorStop(0,'rgba(34,197,94,1)');g.addColorStop(1,'rgba(34,197,94,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,26,0,7);ctx.fill();}
    ctx.fillStyle=on?'#22c55e':'#14301f';ctx.beginPath();ctx.arc(x,y,11,0,7);ctx.fill();arrowText(ctx,'Q'+i,x,y+28,'#475569',10);}
  arrowText(ctx,'pattern to send (click):',320,276,'#e2e8f0',12,'right');
  for(let i=0;i<8;i++){const x=330+i*52;ctx.fillStyle=SR.pat[i]?'#f59e0b':'#1e293b';ctx.fillRect(x,256,40,30);ctx.strokeStyle='#f59e0b';ctx.strokeRect(x,256,40,30);arrowText(ctx,String(SR.pat[i]),x+20,276,SR.pat[i]?'#0b1220':'#94a3b8',14);}}

let lastC=performance.now();
function frameC(now){const dt=Math.min(0.05,(now-lastC)/1000);lastC=now;draw555(dt);draw7805(dt);draw358(dt);draw386(dt);draw4017(dt);draw595(dt);requestAnimationFrame(frameC);}
requestAnimationFrame(frameC);
