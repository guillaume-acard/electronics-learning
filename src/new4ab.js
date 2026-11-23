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
  const R=30,Gd=220,bx=250,qx=400,qy=125;const Re=4700/G;
  W(ctx,[[bx,R],[620,R]],'#f87171');arrowText(ctx,'+9 V',616,R-8,'#f87171',11,'right');
  W(ctx,[[bx-20,Gd],[qx+30,Gd]],'#60a5fa');gndSym(ctx,qx+30,Gd);
  // input
  arrowText(ctx,'🎸',40,qy+6,'#fff',20);arrowText(ctx,'small signal',40,qy+28,'#f59e0b',11);
  W(ctx,[[60,qy],[140,qy]],'#f59e0b');capH(ctx,140,200,qy,'C in');W(ctx,[[200,qy],[qx-44,qy]],'#cbd5e1');dot(ctx,bx,qy);
  // bias divider
  resV(ctx,bx,R,qy,'R1 47k');resV(ctx,bx,qy,Gd,'R2 10k');
  arrowText(ctx,'bias: base held at ~'+(1.5+vin).toFixed(2)+' V',bx+12,qy-10,'#fbbf24',11,'left');
  // transistor
  npn(ctx,qx-10,qy,true,'');
  resV(ctx,qx,R,qy-34,'Rc 4.7k');dot(ctx,qx,qy-50);
  resV(ctx,qx,qy+34,Gd,'Re '+(Re>=1000?(Re/1000).toFixed(1)+'k':Math.round(Re)));
  // output
  W(ctx,[[qx,qy-50],[500,qy-50]],'#10b981');capH(ctx,500,560,qy-50,'C out');W(ctx,[[560,qy-50],[620,qy-50]],'#10b981');arrowText(ctx,'output →',624,qy-46,'#10b981',12,'left');
  arrowText(ctx,'collector: '+vout.toFixed(2)+' V',qx+12,qy-62,'#10b981',11,'left');
  arrowText(ctx,'gain ≈ Rc ÷ Re = '+G,630,qy+40,'#fbbf24',15,'left');
  // graphs
  plot(ctx,40,270,340,150,AM.h,AM.t,4,[{k:'vin',col:'#f59e0b',label:'base (small wiggle on ~1.5 V)'}],0,9,'Input at the base');
  plot(ctx,430,270,340,150,AM.h,AM.t,4,[{k:'vout',col:'#10b981',label:'collector (bigger, upside down)'},{k:'hi',col:'#ef4444',dash:[5,4],lw:1,label:'limits'},{k:'lo',col:'#ef4444',dash:[5,4],lw:1}],0,9,'Output at the collector');
  const clipped=G*0.2>4.3;arrowText(ctx,clipped?'Too much gain: the output hits 0 V / 9 V and gets clipped (distortion)':'Clean: same shape, '+G+'× bigger, flipped upside down',400,470,clipped?'#fbbf24':'#10b981',13);}

