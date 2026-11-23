
// relay mechanism: coil at left, arm from pivot; a=0 rest (NC), a=1 pulled (NO)
function relayMech(ctx,x,y,a,on,scale=1){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  ctx.fillStyle='#334155';ctx.fillRect(0,-10,46,80);ctx.strokeStyle=on?'#f59e0b':'#b45309';ctx.lineWidth=2.5;for(let i=0;i<9;i++){ctx.beginPath();ctx.moveTo(-4,-4+i*8);ctx.lineTo(50,0+i*8);ctx.stroke();}
  ctx.fillStyle='#64748b';ctx.fillRect(14,-22,18,12);
  if(on){ctx.strokeStyle='rgba(245,158,11,.5)';ctx.lineWidth=1.5;for(let i=1;i<=3;i++){ctx.beginPath();ctx.ellipse(23,30,30+i*10,50+i*8,0,0,7);ctx.stroke();}}
  // pivot & arm
  const px=-10,py=-36,ang=-0.12+a*0.16;ctx.fillStyle='#e2e8f0';ctx.beginPath();ctx.arc(px,py,5,0,7);ctx.fill();
  ctx.save();ctx.translate(px,py);ctx.rotate(ang);ctx.fillStyle='#cbd5e1';ctx.fillRect(0,-3,190,6);ctx.restore();
  const ex=px+190*Math.cos(ang),ey=py+190*Math.sin(ang);
  // contacts
  ctx.fillStyle='#fca5a5';ctx.fillRect(170,-72,24,8);ctx.fillStyle='#86efac';ctx.fillRect(170,-12,24,8);
  ctx.restore();return {nc:[x+182*scale,y-72*scale],no:[x+182*scale,y-4*scale],com:[x+px*scale,y+py*scale],tip:[x+ex*scale,y+ey*scale]};}

// ===== 3. Hysteresis demo =====
const RL={on:false,a:0,click:0};
function drawRelay(dt){const V=+$('rlV').value;$('rlVt').textContent=V.toFixed(2)+' V';
  if(!RL.on&&V>=3.75){RL.on=true;RL.click=0.5;}if(RL.on&&V<1){RL.on=false;RL.click=0.5;}
  RL.a+=((RL.on?1:0)-RL.a)*Math.min(1,dt*25);RL.click=Math.max(0,RL.click-dt);
  const c=$('cRelay'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  // coil supply
  part(ctx,'batt',90,90,90,250,{label:V.toFixed(1)+' V',left:true});wire(ctx,[[90,90],[200,90],[200,140]]);wire(ctx,[[90,250],[200,250],[200,210]]);
  const m=relayMech(ctx,200,140,RL.a,RL.on);txt(ctx,'coil',223,240,'#f59e0b',12);
  txt(ctx,'COM',m.com[0]-12,m.com[1]+4,'#e2e8f0',11,'right');txt(ctx,'NC',m.nc[0]+26,m.nc[1]+8,'#fca5a5',12,'left');txt(ctx,'NO',m.no[0]+26,m.no[1]+8,'#86efac',12,'left');
  if(RL.click>0)txt(ctx,'CLICK!',300,40,Y,20);
  // lamp side
  const lx=560;wire(ctx,[[m.com[0],m.com[1]],[m.com[0],30],[740,30],[740,80]],'#a78bfa');part(ctx,'batt',740,80,740,280,{label:'12 V'});wire(ctx,[[740,280],[lx,280]],'#a78bfa');
  wire(ctx,[[m.nc[0]+12,m.nc[1]],[lx-40,m.nc[1]],[lx-40,100]],'#a78bfa');part(ctx,'lamp',lx-40,100,lx-40,160,{glow:RL.on?0:1});wire(ctx,[[lx-40,160],[lx-40,280],[lx,280]],'#a78bfa');
  wire(ctx,[[m.no[0]+12,m.no[1]],[lx+60,m.no[1]],[lx+60,180]],'#a78bfa');part(ctx,'lamp',lx+60,180,lx+60,240,{glow:RL.on?1:0});wire(ctx,[[lx+60,240],[lx+60,280],[lx-40,280]],'#a78bfa');
  txt(ctx,'NC lamp',lx-40,186,'#fca5a5',11);txt(ctx,'NO lamp',lx+60,262,'#86efac',11);
  txt(ctx,'separate 12 V circuit',650,312,'#a78bfa',11);
  // threshold bar
  const bx=120,by=300,bw=300;ctx.fillStyle='#1e293b';ctx.fillRect(bx,by-8,bw,8);ctx.fillStyle=RL.on?'#10b981':'#64748b';ctx.fillRect(bx,by-8,bw*V/6,8);
  [[1,'drop-out 1 V'],[3.75,'pull-in 3.75 V']].forEach(([v,l])=>{const xx=bx+bw*v/6;ctx.fillStyle=Y;ctx.fillRect(xx-1,by-14,2,20);txt(ctx,l,xx,by+18,Y,10);});}

// ===== 4A. Pin → transistor → relay → lamp =====
const RA={pin:false,full:1,a:0,hot:0};
choices('raChoices',['Pin drives the coil directly','With transistor + diode'],1,i=>RA.full=i);
$('raPin').onclick=()=>{RA.pin=!RA.pin;$('raPin').textContent='Pin: '+(RA.pin?'HIGH':'LOW');$('raPin').className=RA.pin?'active':'';};
function drawRA(dt){const pulled=RA.pin&&RA.full;RA.a+=((pulled?1:0)-RA.a)*Math.min(1,dt*25);RA.hot+=((RA.pin&&!RA.full?1:0)-RA.hot)*dt*1.5;
  const c=$('cRA'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  chipBox(ctx,30,120,100,90,'micro-','controller',RA.hot);txt(ctx,'pin',135,160,Y,11,'left');
  const cx=300;wire(ctx,[[cx,30],[cx,60]],'#f87171');txt(ctx,'+5 V',cx,22,'#f87171',11);
  if(RA.full){wire(ctx,[[130,170],[170,170]]);part(ctx,'res',170,170,230,170,{label:'1 kΩ'});wire(ctx,[[230,170],[256,170]]);npnQ(ctx,290,170,RA.pin);
    part(ctx,'coil',cx,60,cx,136,{label:'coil'});wire(ctx,[[cx,204],[cx,270],[80,270],[80,210]]);
    wire(ctx,[[cx,64],[cx-60,64],[cx-60,82]]);part(ctx,'diode',cx-60,130,cx-60,82,{col:'#10b981'});wire(ctx,[[cx-60,130],[cx-60,136],[cx,136]]);txt(ctx,'flyback',cx-66,108,'#10b981',10,'right');}
  else{wire(ctx,[[130,170],[cx,170],[cx,136]]);part(ctx,'coil',cx,60,cx,136,{label:'coil'});wire(ctx,[[80,210],[80,270],[cx,270]]);}
  txt(ctx,'common ground',190,290,'#60a5fa',11);
  // relay switch side
  const m=relayMech(ctx,430,140,RA.a,pulled,0.75);ctx.setLineDash([4,4]);ctx.strokeStyle='#64748b';ctx.beginPath();ctx.moveTo(cx+24,100);ctx.lineTo(430,140);ctx.stroke();ctx.setLineDash([]);
  txt(ctx,'magnet pulls the arm',470,215,'#94a3b8',11);
  wire(ctx,[[m.com[0],m.com[1]],[m.com[0],40],[760,40],[760,80]],'#a78bfa');part(ctx,'batt',760,80,760,270,{label:'12 V',left:true});
  wire(ctx,[[m.no[0]+9,m.no[1]],[680,m.no[1]],[680,170]],'#a78bfa');part(ctx,'lamp',680,170,680,230,{glow:pulled?1:0});wire(ctx,[[680,230],[680,270],[760,270]],'#a78bfa');
  txt(ctx,'lamp circuit (isolated)',700,295,'#a78bfa',11);
  let msg,col;if(!RA.pin){msg='Pin LOW: relay off';col='#94a3b8';}else if(RA.full){msg='Click! Lamp on ✓';col='#10b981';}else{msg='The pin can\'t supply ~70 mA: the relay doesn\'t pull in, and the chip heats ✗';col='#ef4444';}
  txt(ctx,msg,400,22,col,13);}

// ===== 4B. Latch =====
const LB={start:false,stop:false,on:false,a:0};
[['lbStart','start'],['lbStop','stop']].forEach(([id,k])=>{const b=$(id);b.style.touchAction='none';b.style.userSelect='none';b.addEventListener('pointerdown',e=>{e.preventDefault();LB[k]=true;});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>LB[k]=false));});
function drawLatch(dt){LB.on=!LB.stop&&(LB.start||LB.on);LB.a+=((LB.on?1:0)-LB.a)*Math.min(1,dt*25);
  const c=$('cLatch'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=50,B=250;wire(ctx,[[40,T],[400,T]],'#f87171');txt(ctx,'+12 V',36,T+4,'#f87171',12,'right');wire(ctx,[[40,B],[760,B]],'#60a5fa');txt(ctx,'0 V',36,B+4,'#60a5fa',12,'right');
  // STOP (NC) then node, START (NO) then coil; hold contact parallel to START
  wire(ctx,[[100,T],[100,70]]);part(ctx,'switch',100,70,100,120,{closed:!LB.stop,label:'STOP (NC)',col:'#fca5a5',left:true});wire(ctx,[[100,120],[100,140],[160,140]]);dot(ctx,160,140);
  part(ctx,'switch',160,140,260,140,{closed:LB.start,label:'START (NO)',col:'#86efac'});
  wire(ctx,[[160,140],[160,200]]);part(ctx,'switch',160,200,260,200,{closed:LB.on,label:'relay contact (hold)',col:'#fbbf24'});wire(ctx,[[260,200],[260,140]]);dot(ctx,260,140);
  wire(ctx,[[260,140],[320,140]]);part(ctx,'coil',320,140,320,230,{label:'relay coil'});wire(ctx,[[320,230],[320,B]]);
  if(LB.on)dots(ctx,[[100,T],[100,140],[LB.start?160:160,LB.start?140:140],...(LB.start?[[260,140]]:[[160,200],[260,200],[260,140]]),[320,140],[320,B]],performance.now()/15);
  // second contact drives a motor/lamp
  const m=relayMech(ctx,470,150,LB.a,LB.on,0.6);ctx.setLineDash([4,4]);ctx.strokeStyle='#64748b';ctx.beginPath();ctx.moveTo(340,180);ctx.lineTo(470,170);ctx.stroke();ctx.setLineDash([]);
  wire(ctx,[[m.com[0],m.com[1]],[m.com[0],T],[400,T]],'#f87171');wire(ctx,[[m.no[0]+7,m.no[1]],[700,m.no[1]],[700,160]]);part(ctx,'lamp',700,160,700,220,{glow:LB.on?1:0});wire(ctx,[[700,220],[700,B]]);
  txt(ctx,LB.on?(LB.start?'START pressed: ON':'released, but it holds itself ON (memory!)'):(LB.stop?'STOP pressed: loop broken, OFF':'OFF'),560,30,LB.on?'#10b981':'#94a3b8',13);}

let lastR2=performance.now();
function frameRl(now){const dt=Math.min(0.05,(now-lastR2)/1000);lastR2=now;drawRelay(dt);drawRA(dt);drawLatch(dt);requestAnimationFrame(frameRl);}
requestAnimationFrame(frameRl);
