
// ===== NPN symbol =====
function npn(ctx,x,y,on,label){const col=on?'#10b981':'#cbd5e1';ctx.strokeStyle=col;ctx.lineWidth=2.5;
  ctx.beginPath();ctx.arc(x,y,24,0,7);ctx.stroke();
  W(ctx,[[x-34,y],[x-8,y]],col);W(ctx,[[x-8,y-14],[x-8,y+14]],col,4);
  W(ctx,[[x-8,y-6],[x+10,y-18],[x+10,y-34]],col);W(ctx,[[x-8,y+6],[x+10,y+18],[x+10,y+34]],col);
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x+10,y+18);ctx.lineTo(x,y+17);ctx.lineTo(x+5,y+9);ctx.fill();
  if(label)arrowText(ctx,label,x+30,y+5,on?'#10b981':'#94a3b8',12,'left');}
function resBox(ctx,x,y,w,h,txt){ctx.fillStyle='#0b1220';ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);if(txt)arrowText(ctx,txt,w>h?x+w/2:x+w+6,w>h?y-6:y+h/2+4,'#e2e8f0',11,w>h?'center':'left');}

// ===== 3. Water valve =====
const TV={o1:0,o2:0};const BETA=100,ICMAX=10; // mA
function drawTV(dt){const Ib=+$('tIb').value;$('tIbt').textContent=Ib+' µA';
  const Ic=Math.min(BETA*Ib/1000,ICMAX),sat=BETA*Ib/1000>=ICMAX,open=Ic/ICMAX;
  TV.o1-=Ib*dt*1.2;TV.o2-=Ic*dt*30;
  const c=$('cTV'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const y=200,gx=300;
  // main pipe
  ctx.strokeStyle='#bcd6fb';ctx.lineWidth=44;ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(500,y);ctx.stroke();
  if(Ic>0.05){ctx.strokeStyle='#3b82f6';ctx.lineWidth=8;ctx.setLineDash([18,14]);ctx.lineDashOffset=TV.o2;ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(500,y);ctx.stroke();ctx.setLineDash([]);}
  // gate housing + gate
  ctx.fillStyle='#475569';ctx.fillRect(gx-16,y-110,32,84);
  const gy=y-22-open*40;ctx.fillStyle='#94a3b8';ctx.fillRect(gx-10,gy,20,44);
  // base pipe (small) from top-left into piston
  ctx.strokeStyle='#fde68a';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(gx-120,30);ctx.lineTo(gx-120,y-130);ctx.lineTo(gx-16,y-130);ctx.stroke();
  if(Ib>0){ctx.strokeStyle='#f59e0b';ctx.lineWidth=3;ctx.setLineDash([8,8]);ctx.lineDashOffset=TV.o1;ctx.beginPath();ctx.moveTo(gx-120,30);ctx.lineTo(gx-120,y-130);ctx.lineTo(gx-16,y-130);ctx.stroke();ctx.setLineDash([]);}
  // piston rod linking to gate
  ctx.strokeStyle='#e2e8f0';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(gx,y-110);ctx.lineTo(gx,gy);ctx.stroke();
  arrowText(ctx,'BASE (small flow)',gx-120,22,'#f59e0b',13);
  arrowText(ctx,'COLLECTOR',60,y-34,'#94a3b8',12);arrowText(ctx,'EMITTER',460,y-34,'#94a3b8',12);
  arrowText(ctx,'big gate',gx+24,y-80,'#94a3b8',12,'left');
  const mode=Ib===0?['OFF (cutoff)','#94a3b8']:sat?['FULLY ON (saturated): switch closed','#10b981']:['AMPLIFYING (active)','#60a5fa'];
  arrowText(ctx,mode[0],260,y+56,mode[1],16);
  arrowText(ctx,'base '+Ib+' µA  →  main '+Ic.toFixed(1)+' mA'+(sat?' (max: limited by the load)':'  (×'+BETA+')'),260,y+80,'#e2e8f0',13);
  // graph Ic vs Ib
  const px=550,py=40,pw=230,ph=210,X=v=>px+v/150*pw,Y=v=>py+ph-v/12*ph;
  ctx.fillStyle='#1e293b';ctx.fillRect(px,py,pw,ph);
  ctx.fillStyle='rgba(16,185,129,0.12)';ctx.fillRect(X(100),py,pw-(X(100)-px),ph);
  ctx.strokeStyle='#60a5fa';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(X(0),Y(0));ctx.lineTo(X(100),Y(10));ctx.lineTo(X(150),Y(10));ctx.stroke();
  ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(X(Ib),Y(Ic),6,0,7);ctx.fill();
  arrowText(ctx,'amplifying',X(45),Y(6.5),'#60a5fa',11);arrowText(ctx,'saturated',X(125),Y(10)-10,'#10b981',11);
  arrowText(ctx,'main current',px,py-8,'#94a3b8',11,'left');arrowText(ctx,'base current →',px+pw,py+ph+16,'#94a3b8',11,'right');}

// ===== 4A. Switch a motor (full circuit) =====
const SW={pin:false,via:1,ang:0,heat:0,off:0};
choices('swChoices',['Pin drives motor directly','Through a transistor'],1,i=>SW.via=i);
$('swPin').onclick=()=>{SW.pin=!SW.pin;$('swPin').textContent='Pin: '+(SW.pin?'HIGH (5 V)':'LOW (0 V)');$('swPin').className=SW.pin?'active':'';};
function flowDots(ctx,pts,off,col='#fbbf24'){ctx.strokeStyle=col;ctx.lineWidth=6;ctx.lineCap='round';ctx.setLineDash([0,18]);ctx.lineDashOffset=-off;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.setLineDash([]);ctx.lineCap='butt';}
function drawSw(dt){const c=$('cSw'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  let speed=0,pinI=0;if(SW.pin){if(SW.via){speed=1;pinI=4.3;}else{speed=0.08;pinI=40;}}
  SW.heat+=((pinI>20?1:0)-SW.heat)*dt*1.5;SW.ang+=speed*dt*15;SW.off+=speed*dt*60;
  const G=275,T5=40,T9=30,cx=110,cy=95,cw=110,ch=110,pinY=150;
  // ground rail
  W(ctx,[[50,G],[720,G]],'#60a5fa');arrowText(ctx,'common ground (0 V): shared by BOTH batteries and the chip',385,G+22,'#60a5fa',12);
  // 5 V supply for the micro
  batt(ctx,50,T5+20,G,'5V');W(ctx,[[50,T5+20],[50,T5],[cx+cw/2,T5],[cx+cw/2,cy]],'#f87171');arrowText(ctx,'5 V supply (USB)',58,T5-8,'#f87171',11,'left');
  // micro box
  ctx.fillStyle=SW.heat>0.3?`rgb(${Math.round(71+160*SW.heat)},60,60)`:'#475569';ctx.fillRect(cx,cy,cw,ch);
  arrowText(ctx,'micro-',cx+cw/2,cy+46,'#fff',13);arrowText(ctx,'controller',cx+cw/2,cy+64,'#fff',13);
  arrowText(ctx,'VCC',cx+cw/2,cy+14,'#fca5a5',10);arrowText(ctx,'GND',cx+cw/2,cy+ch-6,'#93c5fd',10);arrowText(ctx,'pin',cx+cw-4,pinY-6,'#fbbf24',10,'right');
  W(ctx,[[cx+cw/2,cy+ch],[cx+cw/2,G]],'#60a5fa');dot(ctx,cx+cw/2,G);dot(ctx,50,G);
  const mx=480,my=95,bx=700;
  if(SW.via){
    W(ctx,[[cx+cw,pinY],[255,pinY]],SW.pin?'#fbbf24':'#cbd5e1');resBox(ctx,255,pinY-10,70,20,'1 kΩ base resistor');W(ctx,[[325,pinY],[mx-44,pinY]],SW.pin?'#fbbf24':'#cbd5e1');
    npn(ctx,mx-10,pinY,SW.pin,'NPN');
    // collector to motor, motor to +9V
    W(ctx,[[mx,pinY-34],[mx,my+24]],'#cbd5e1');
    ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.beginPath();ctx.arc(mx,my,24,0,7);ctx.stroke();arrowText(ctx,'M',mx,my+6,'#e2e8f0',16);
    ctx.save();ctx.translate(mx,my);ctx.rotate(SW.ang);ctx.strokeStyle='#60a5fa';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.rotate(2.09);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(16,0);ctx.stroke();}ctx.restore();
    W(ctx,[[mx,my-24],[mx,T9],[bx,T9]],'#f87171');arrowText(ctx,'+9 V',bx-6,T9-8,'#f87171',11,'right');
    // flyback diode beside motor (cathode to +9V)
    W(ctx,[[mx,T9+12],[mx+55,T9+12],[mx+55,my-12]],'#94a3b8',2);
    ctx.fillStyle='#0b1220';ctx.strokeStyle='#94a3b8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mx+45,my+8);ctx.lineTo(mx+65,my+8);ctx.lineTo(mx+55,my-10);ctx.closePath();ctx.fill();ctx.stroke();W(ctx,[[mx+45,my-12],[mx+65,my-12]],'#94a3b8',2);
    W(ctx,[[mx+55,my+8],[mx+55,my+38],[mx,my+38]],'#94a3b8',2);arrowText(ctx,'flyback diode',mx+70,my+2,'#94a3b8',11,'left');
    // emitter to ground
    W(ctx,[[mx,pinY+34],[mx,G]],'#cbd5e1');dot(ctx,mx,G);
    // 9 V battery
    batt(ctx,bx,T9,G,'9V');dot(ctx,bx,G);
    if(SW.pin){flowDots(ctx,[[bx,G-20],[bx,T9],[mx,T9],[mx,G],[bx,G]],SW.off);}
    arrowText(ctx,'pin gives '+(SW.pin?'4.3':'0')+' mA',255,pinY+34,'#fbbf24',12,'left');
    arrowText(ctx,'motor gets '+(SW.pin?'~500':'0')+' mA from the 9 V battery',255,pinY+54,'#60a5fa',12,'left');
  } else {
    W(ctx,[[cx+cw,pinY],[mx,pinY],[mx,my+24]],SW.pin?'#fbbf24':'#cbd5e1');
    ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.beginPath();ctx.arc(mx,my,24,0,7);ctx.stroke();arrowText(ctx,'M',mx,my+6,'#e2e8f0',16);
    ctx.save();ctx.translate(mx,my);ctx.rotate(SW.ang);ctx.strokeStyle='#60a5fa';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.rotate(2.09);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(16,0);ctx.stroke();}ctx.restore();
    W(ctx,[[mx,my-24],[mx,my-45],[mx+60,my-45],[mx+60,G]],'#cbd5e1');dot(ctx,mx+60,G);
    ctx.globalAlpha=0.3;batt(ctx,bx,T9+60,G,'9V');ctx.globalAlpha=1;arrowText(ctx,'not used',bx,T9+50,'#94a3b8',11);
    arrowText(ctx,'motor wired straight between the pin and ground',255,pinY+34,'#94a3b8',12,'left');
    if(SW.pin)arrowText(ctx,'pin asked for ~500 mA, but it can give ~20 mA',255,pinY+54,'#ef4444',12,'left');
  }
  let msg,col;
  if(!SW.pin){msg='Pin LOW: motor off';col='#94a3b8';}
  else if(SW.via){msg='Motor spinning ✓ The big current loop (dots) never goes through the chip.';col='#10b981';}
  else {msg='✗ The motor twitches and the chip overheats';col='#ef4444';}
  arrowText(ctx,msg,400,G+44,col,13);}

// ===== 4B. Amplifier (common-emitter) =====
const AM={t:0,h:[]};
function drawAmp(dt){AM.t+=dt;const G=+$('amG').value;$('amGt').textContent='×'+G;
  const vin=0.2*Math.sin(2*Math.PI*0.8*AM.t);let vout=Math.max(0.2,Math.min(8.8,4.5-G*vin));
  AM.h.push({t:AM.t,vin:1.5+vin,vout,hi:8.8,lo:0.2});prune(AM.h,AM.t,4);
  const c=$('cAmp'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  // schematic
  const R=24,Gd=262,bx=250,qx=400,qy=150;const Re=4700/G;
  W(ctx,[[bx,R],[620,R]],'#f87171');arrowText(ctx,'+9 V',616,R-8,'#f87171',11,'right');
  W(ctx,[[bx-20,Gd],[qx+30,Gd]],'#60a5fa');gndSym(ctx,qx+30,Gd);
  // input
  arrowText(ctx,'🎸',40,qy+6,'#fff',20);arrowText(ctx,'small signal',40,qy+28,'#f59e0b',11);
  W(ctx,[[60,qy],[140,qy]],'#f59e0b');capH(ctx,140,200,qy,'C in');W(ctx,[[200,qy],[qx-44,qy]],'#cbd5e1');dot(ctx,bx,qy);
  // bias divider
  resV(ctx,bx,R,qy,'R1 47k');resV(ctx,bx,qy,Gd,'R2 10k');
  arrowText(ctx,'bias ≈ '+(1.5+vin).toFixed(2)+' V',bx+12,qy+20,'#fbbf24',11,'left');
  // transistor
  npn(ctx,qx-10,qy,true,'');
  resV(ctx,qx,R,qy-72,'Rc 4.7k');W(ctx,[[qx,qy-72],[qx,qy-34]],'#cbd5e1');dot(ctx,qx,qy-56);
  resV(ctx,qx,qy+34,Gd,'Re '+(Re>=1000?(Re/1000).toFixed(1)+'k':Math.round(Re)));
  // output
  W(ctx,[[qx,qy-56],[500,qy-56]],'#10b981');capH(ctx,500,560,qy-56,'C out');W(ctx,[[560,qy-56],[620,qy-56]],'#10b981');arrowText(ctx,'output →',624,qy-52,'#10b981',12,'left');
  arrowText(ctx,'collector '+vout.toFixed(2)+' V',qx+14,qy-38,'#10b981',11,'left');
  arrowText(ctx,'gain ≈ Rc ÷ Re = '+G,630,qy+40,'#fbbf24',15,'left');
  // graphs
  plot(ctx,40,315,340,150,AM.h,AM.t,4,[{k:'vin',col:'#f59e0b',label:'base (small wiggle on ~1.5 V)'}],0,9,'Input at the base');
  plot(ctx,430,315,340,150,AM.h,AM.t,4,[{k:'vout',col:'#10b981',label:'collector (bigger, upside down)'},{k:'hi',col:'#ef4444',dash:[5,4],lw:1,label:'limits'},{k:'lo',col:'#ef4444',dash:[5,4],lw:1}],0,9,'Output at the collector');
  const clipped=G*0.2>4.3;arrowText(ctx,clipped?'Too much gain: the output hits 0 V / 9 V and gets clipped (distortion)':'Clean: same shape, '+G+'× bigger, flipped upside down',400,512,clipped?'#fbbf24':'#10b981',13);}

// ===== 4C. Night light =====
function drawNL(){const L=+$('nlL').value,c=$('cNL'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const sky=`rgb(${Math.round(10+60*L)},${Math.round(15+110*L)},${Math.round(40+150*L)})`;ctx.fillStyle=sky;ctx.fillRect(560,0,240,260);
  const Rl=1000*Math.pow(200,1-L),Vb=9*Rl/(47000+Rl),b=Math.max(0,Math.min(1,(Vb-0.62)/0.25));
  arrowText(ctx,b<0.5?'☀️':'🌙',680,70,'#fff',40);
  const x=200,T=30,B=230;
  W(ctx,[[60,T],[440,T]],'#cbd5e1');arrowText(ctx,'+9 V',50,T+4,'#f87171',12,'right');W(ctx,[[60,B],[440,B]],'#cbd5e1');arrowText(ctx,'0 V',50,B+4,'#60a5fa',12,'right');
  W(ctx,[[x,T],[x,50]],'#cbd5e1');resBox(ctx,x-10,50,20,40,'47 kΩ');W(ctx,[[x,90],[x,130]],'#cbd5e1');dot(ctx,x,130);
  W(ctx,[[x,130],[x,150]],'#cbd5e1');resBox(ctx,x-10,150,20,40,'');ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.5;[[0,0],[8,8]].forEach(([d1,d2])=>{ctx.beginPath();ctx.moveTo(x-30-d1,150+d2);ctx.lineTo(x-14-d1,160+d2);ctx.stroke();});
  arrowText(ctx,'LDR '+(Rl>=1000?(Rl/1000).toFixed(Rl<10000?1:0)+' kΩ':Rl.toFixed(0)+' Ω'),x+16,174,'#fbbf24',11,'left');W(ctx,[[x,190],[x,B]],'#cbd5e1');
  W(ctx,[[x,130],[x+80,130]],'#cbd5e1');resBox(ctx,x+80,120,50,20,'');W(ctx,[[x+130,130],[x+156,130]],'#cbd5e1');
  npn(ctx,x+190,130,b>0.5,'');W(ctx,[[x+200,96],[x+200,90]],'#cbd5e1');
  ledBulbT(ctx,x+200,70,b);W(ctx,[[x+200,52],[x+200,T]],'#cbd5e1');W(ctx,[[x+200,164],[x+200,B]],'#cbd5e1');
  arrowText(ctx,'base: '+Math.min(Vb,0.75).toFixed(2)+' V',x+80,112,b>0.5?'#10b981':'#94a3b8',12,'left');
  wrapText(ctx,b<0.5?'Bright: the LDR is low, so the base stays below 0.7 V and the light is OFF.':'Dark: the LDR is high, so the base passes 0.7 V and the transistor turns the light ON.',575,150,210,18,'#fff',13);}
function ledBulbT(ctx,x,y,b){if(b>0.02){const g=ctx.createRadialGradient(x,y,2,x,y,50);g.addColorStop(0,`rgba(250,204,21,${b})`);g.addColorStop(1,'rgba(250,204,21,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,50,0,7);ctx.fill();}
  ctx.fillStyle=`rgba(250,204,21,${0.3+0.7*b})`;ctx.beginPath();ctx.arc(x,y,14,0,7);ctx.fill();ctx.strokeStyle='#e2e8f0';ctx.lineWidth=1.5;ctx.stroke();}
$('nlL').oninput=drawNL;drawNL();

// ===== 4D. Logic =====
const LG={g:0,A:false,B:false};
choices('lgChoices',['AND','OR','NOT'],0,i=>{LG.g=i;drawLG();});
$('lgA').onclick=()=>{LG.A=!LG.A;$('lgA').textContent='A: '+(LG.A?'ON':'off');$('lgA').className=LG.A?'active':'';drawLG();};
$('lgB').onclick=()=>{LG.B=!LG.B;$('lgB').textContent='B: '+(LG.B?'ON':'off');$('lgB').className=LG.B?'active':'';drawLG();};
function drawLG(){const c=$('cLG'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);$('lgB').style.display=LG.g===2?'none':'';
  const out=LG.g===0?LG.A&&LG.B:LG.g===1?LG.A||LG.B:!LG.A;
  const T=20,B=240,lx=260;W(ctx,[[60,T],[lx,T]],'#cbd5e1');arrowText(ctx,'+5 V',50,T+4,'#f87171',12,'right');W(ctx,[[60,B],[520,B]],'#cbd5e1');arrowText(ctx,'0 V',50,B+4,'#60a5fa',12,'right');
  W(ctx,[[lx,T],[lx,32]],'#cbd5e1');resBox(ctx,lx-10,32,20,30,'');W(ctx,[[lx,62],[lx,72]],'#cbd5e1');ledBulbT(ctx,lx,86,out?1:0);W(ctx,[[lx,100],[lx,110]],'#cbd5e1');
  arrowText(ctx,'output LED',lx+24,90,'#94a3b8',12,'left');
  const inp=(y,on,l,x)=>{W(ctx,[[90,y],[x-34,y]],on?'#10b981':'#475569');arrowText(ctx,l+(on?' = 1':' = 0'),84,y+4,on?'#10b981':'#94a3b8',13,'right');};
  if(LG.g===0){npn(ctx,lx-10,145,LG.A,'A');npn(ctx,lx-10,212,LG.B,'B');W(ctx,[[lx,110],[lx,111]],'#cbd5e1');W(ctx,[[lx,179],[lx,178]],'#cbd5e1');inp(145,LG.A,'A',lx-10);inp(212,LG.B,'B',lx-10);W(ctx,[[lx,246],[lx,B]],'#cbd5e1');}
  else if(LG.g===1){W(ctx,[[lx-60,110],[lx+60,110]],'#cbd5e1');npn(ctx,lx-70,160,LG.A,'A');npn(ctx,lx+50,160,LG.B,'B');W(ctx,[[lx-60,194],[lx-60,B]],'#cbd5e1');W(ctx,[[lx+60,194],[lx+60,B]],'#cbd5e1');
    W(ctx,[[lx-60,110],[lx-60,126]],'#cbd5e1');W(ctx,[[lx+60,110],[lx+60,126]],'#cbd5e1');inp(160,LG.A,'A',lx-70);W(ctx,[[lx-20,140],[lx-20,160],[lx+16,160]],LG.B?'#10b981':'#475569');arrowText(ctx,'B',lx-28,136,LG.B?'#10b981':'#94a3b8',13);}
  else{ // NOT: LED fed via resistor, transistor in parallel to LED shorting it
    W(ctx,[[lx,110],[lx,B]],'#cbd5e1');W(ctx,[[lx,56],[lx+100,56],[lx+100,126]],'#cbd5e1');npn(ctx,lx+90,160,LG.A,'A');W(ctx,[[lx+100,194],[lx+100,B]],'#cbd5e1');
    W(ctx,[[90,160],[lx+56,160]],LG.A?'#10b981':'#475569');arrowText(ctx,'A'+(LG.A?' = 1':' = 0'),84,164,LG.A?'#10b981':'#94a3b8',13,'right');}
  // truth table
  const tx=560,rows=LG.g===2?[[0,1],[1,0]]:[[0,0,LG.g?0:0],[0,1,LG.g?1:0],[1,0,LG.g?1:0],[1,1,1]];
  arrowText(ctx,['AND: both needed','OR: either is enough','NOT: flips it'][LG.g],tx,30,'#fbbf24',15,'left');
  const hdr=LG.g===2?['A','LED']:['A','B','LED'];hdr.forEach((h,i)=>arrowText(ctx,h,tx+20+i*60,60,'#94a3b8',13));
  rows.forEach((r,j)=>{const cur=LG.g===2?(r[0]===+LG.A):(r[0]===+LG.A&&r[1]===+LG.B);if(cur){ctx.fillStyle='#1e3a5f';ctx.fillRect(tx-5,68+j*28,LG.g===2?130:190,24);}
    r.forEach((v,i)=>arrowText(ctx,String(v),tx+20+i*60,86+j*28,i===r.length-1?(v?'#fbbf24':'#94a3b8'):'#e2e8f0',14));});
  arrowText(ctx,'LED: '+(out?'ON (1)':'off (0)'),tx,B-6,out?'#fbbf24':'#94a3b8',16,'left');}
drawLG();

// ===== Symbol =====
(function(){const c=$('cSymT'),ctx=c.getContext('2d');npn(ctx,190,90,false,'');W(ctx,[[90,90],[156,90]],'#e2e8f0');
  arrowText(ctx,'B (base)',80,94,'#fbbf24',13,'right');arrowText(ctx,'C (collector)',210,40,'#e2e8f0',13,'left');arrowText(ctx,'E (emitter)',210,150,'#e2e8f0',13,'left');
  W(ctx,[[200,56],[200,30]],'#e2e8f0');W(ctx,[[200,124],[200,150]],'#e2e8f0');})();

let lastT=performance.now();
function frameT(now){const dt=Math.min(0.05,(now-lastT)/1000);lastT=now;drawTV(dt);drawSw(dt);drawAmp(dt);requestAnimationFrame(frameT);}
requestAnimationFrame(frameT);
