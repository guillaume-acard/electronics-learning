// ===== 293: data (pinout, inside, minimal circuit, hero art) + its demo =====
CHIP('293',{
pinout:{pkg:'dip',title:'L293D (DIP-16)',pins:[
 [1,'EN1,2','ctl','Enable for drivers 1 and 2 (the first H-bridge). High = outputs 1Y and 2Y follow their inputs; low = both outputs off, the motor coasts.','To + for full speed, or to a PWM signal (555, Arduino analogWrite) to set the speed. Max 7 V.'],
 [2,'1A','in','Input of driver 1: high → 1Y is connected to the motor supply, low → 1Y is connected to ground.','From a button with a 10 kΩ pull-down, or an Arduino pin. Max 7 V.'],
 [3,'1Y','out','Output of driver 1: one end of motor 1. Up to 600 mA (1.2 A peak).','To one motor terminal.'],
 [4,'GND','gnd','Ground and heat sink (the 4 middle pins are joined to the chip\'s metal frame).','To the − rail. Connect all four: they carry the heat away.'],
 [5,'GND','gnd','Ground and heat sink.','To the − rail.'],
 [6,'2Y','out','Output of driver 2: the other end of motor 1.','To the other motor terminal.'],
 [7,'2A','in','Input of driver 2.','Same as 1A. 1A ≠ 2A: the motor turns (one way or the other); 1A = 2A: it brakes.'],
 [8,'VCC2','pwr','Motor supply, 4.5–36 V: the voltage the outputs switch to the motor. The motor gets about 1.5–3 V less (lost in the chip).','To the battery + (9 V), with 100 nF (and 100 µF for big motors) to ground.'],
 [9,'EN3,4','ctl','Enable for drivers 3 and 4 (the second H-bridge).','To + to use the second bridge, or to ground if unused.'],
 [10,'3A','in','Input of driver 3.','Unused: to ground.'],
 [11,'3Y','out','Output of driver 3: one end of motor 2.','Unused: leave free.'],
 [12,'GND','gnd','Ground and heat sink.','To the − rail.'],
 [13,'GND','gnd','Ground and heat sink.','To the − rail.'],
 [14,'4Y','out','Output of driver 4: the other end of motor 2.',''],
 [15,'4A','in','Input of driver 4.','Unused: to ground.'],
 [16,'VCC1','pwr','Logic supply for the inputs: ideally 5 V. (ST\'s L293D accepts up to 36 V here; the inputs themselves must stay below 7 V.)','To +5 V (or the battery in project 24), with 100 nF to ground.']]},
inside:({ln,tx,bx,dot,tp,cmp,res,gnd,arrow})=>{let s='',pins='';const buf=(x,y)=>`<path d="M${x} ${y-16}L${x+40} ${y}L${x} ${y+16}Z" fill="${PAL.panel}" stroke="${PAL.ink2}" stroke-width="2"/>`;
  [[50,2,3],[110,7,6],[200,10,11],[260,15,14]].forEach(([y,i,o])=>{s+=ln(`40,${y} 200,${y}`,i)+buf(200,y)+ln(`240,${y} 420,${y}`,o)+`<path d="M330 ${y-14}v28" stroke="${PAL.amber}" stroke-width="2"/><path d="M322 ${y-6}l8 -8l8 8" fill="${PAL.amber}"/>`;pins+=tp(40,y,i,'l')+tp(420,y,o,'r');});
  [[150,1,[50,110]],[300,9,[200,260]]].forEach(([y,n,ys])=>{s+=ln(`40,${y} 170,${y} 170,${ys[0]+28}`,n)+ys.map(yy=>ln(`170,${yy+28} 215,${yy+28} 215,${yy+12}`,n)).join('');pins+=tp(40,y,n,'l');});
  s+=tx(300,28,'each output: switched to VCC2 (+) or GND, like its input',{s:11,c:PAL.muted});
  s+=tx(330,160,'motor 1 between 3 and 6',{s:11,c:PAL.yellow})+tx(330,176,'motor 2 between 11 and 14',{s:11,c:PAL.yellow});
  s+=tx(375,92,'built-in diodes',{s:10,c:PAL.amber,a:'start'});
  s+=tx(40,322,'16 VCC1 (logic) · 8 VCC2 (motor) · 4, 5, 12, 13 GND + heat sink',{a:'start',s:11,c:PAL.muted});
  return {vb:'-70 0 700 330',s:s+pins};},
minimal:{title:'L293D: one motor, both directions (Arduino)',sub:'logic at 5 V from the Arduino, motor at 9 V; bridge 2 unused',rows:[
 [1,[[[],'IN:Arduino D9 (PWM) = speed']],'EN1,2: high = bridge 1 on. A PWM signal here sets the speed (analogWrite). Tie to +5 V for full speed only.'],
 [2,[[[],'IN:Arduino D7 = direction A']],'1A: high → 1Y goes to +9 V, low → 1Y goes to ground.'],
 [3,[[[],'T:motor terminal 1']],'1Y: one end of the motor.'],
 [4,[[[],'GND']],'GND (and heat sink).'],[5,[[[],'GND']],'GND (and heat sink).'],
 [6,[[[],'T:motor terminal 2']],'2Y: the other end of the motor. No diodes to add: they are built in (the "D").'],
 [7,[[[],'IN:Arduino D8 = direction B']],'2A: D7 high + D8 low = forward, D7 low + D8 high = reverse, both the same = brake.'],
 [8,[[[],'V9'],[['C:100 µF+'],'GND']],'VCC2: the motor supply (9 V battery), with a 100 µF reservoir for the motor\'s current peaks.'],
 [9,[[[],'GND']],'EN3,4: low, bridge 2 off.'],[10,[[[],'GND']],'3A (unused): ground.'],[11,[[[],'NC']],'3Y: free.'],
 [12,[[[],'GND']],'GND (and heat sink).'],[13,[[[],'GND']],'GND (and heat sink).'],
 [14,[[[],'NC']],'4Y: free.'],[15,[[[],'GND']],'4A (unused): ground.'],
 [16,[[[],'V5'],[['C:100 nF'],'GND']],'VCC1: logic supply, +5 V from the Arduino, decoupled. The Arduino\'s GND and the battery − must be joined.']]},
art:dipArt('L293D',16,'H-bridge motor driver',PAL.bad)});

(function(){
// ---------- L293D ----------
const HB={mode:'F',spd:0,ang:0,t:0};
[['hbF','F'],['hbR','R'],['hbB','B'],['hbC','C']].forEach(([id,m])=>$(id).addEventListener('click',()=>{HB.mode=m;['hbF','hbR','hbB','hbC'].forEach(k=>$(k).classList.toggle('active',k===id));}));
$('hbF').classList.add('active');
function draw293(dt){const c=$('c293');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  HB.t+=dt;const duty=+$('hbS').value/100,m=HB.mode,pwmOn=(HB.t*4%1)<duty||duty>=1;
  const drive=m==='F'?1:m==='R'?-1:0,target=drive*duty;
  HB.spd+=(target-HB.spd)*Math.min(1,dt*(m==='B'?9:m==='C'?0.8:3));HB.ang+=HB.spd*dt*12;
  const on=pwmOn&&(m==='F'||m==='R');
  // switches: s1 TL, s2 BL, s3 TR, s4 BR
  const S={tl:m==='F'&&on,bl:m==='R'||m==='B',tr:m==='R'&&on,br:m==='F'||m==='B'};
  const T0=50,B0=260,Lx=200,Rx=480,My=155;
  W(ctx,[[Lx,T0],[Rx,T0]],PAL.bad);W(ctx,[[Lx,B0],[Rx,B0]],PAL.blue);txt(ctx,'VCC2 (+9 V)',340,T0-10,PAL.redSoft,12);txt(ctx,'GND',340,B0+22,PAL.blue,12);
  part(ctx,'switch',Lx,T0,Lx,My,{closed:S.tl,col:S.tl?PAL.good:PAL.muted});part(ctx,'switch',Lx,My,Lx,B0,{closed:S.bl,col:S.bl?PAL.good:PAL.muted});
  part(ctx,'switch',Rx,T0,Rx,My,{closed:S.tr,col:S.tr?PAL.good:PAL.muted});part(ctx,'switch',Rx,My,Rx,B0,{closed:S.br,col:S.br?PAL.good:PAL.muted});
  txt(ctx,'1Y (pin 3)',Lx-12,My+4,PAL.ink,12,'right');txt(ctx,'2Y (pin 6)',Rx+12,My+4,PAL.ink,12,'left');
  W(ctx,[[Lx,My],[310,My]]);W(ctx,[[370,My],[Rx,My]]);
  ctx.fillStyle=PAL.canvas;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=3;ctx.beginPath();ctx.arc(340,My,30,0,7);ctx.fill();ctx.stroke();
  ctx.save();ctx.translate(340,My);ctx.rotate(HB.ang);ctx.strokeStyle=PAL.blue;ctx.lineWidth=3;for(let i=0;i<3;i++){ctx.rotate(2.094);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(22,0);ctx.stroke();}ctx.restore();txt(ctx,'M',340,My+5,PAL.ink,14,'center');
  // current path dots
  const flow=m==='F'&&on?[[Lx,T0+4],[Lx,My],[Rx,My],[Rx,B0-4]]:m==='R'&&on?[[Rx,T0+4],[Rx,My],[Lx,My],[Lx,B0-4]]:null;
  if(flow){ctx.strokeStyle=PAL.yellow;ctx.lineWidth=7;ctx.lineCap='round';ctx.setLineDash([0,20]);ctx.lineDashOffset=-performance.now()/15;ctx.beginPath();flow.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.setLineDash([]);ctx.lineCap='butt';}
  // LEDs like project 24
  lamp(ctx,560,120,m==='F'&&on?1:0,'239,68,68',9);txt(ctx,'red: forward',576,124,PAL.muted,11,'left');lamp(ctx,560,160,m==='R'&&on?1:0,'34,197,94',9);txt(ctx,'green: reverse',576,164,PAL.muted,11,'left');
  // status
  const msg={F:'Forward: top-left + bottom-right closed, current flows left → right',R:'Reverse: top-right + bottom-left closed, current flows right → left',B:'Brake: both bottom switches closed, the motor is shorted and stops fast',C:'Coast: all switches open, the motor spins down by itself'}[m];
  txt(ctx,msg,400,22,PAL.ink,13,'center');
  const rpm=Math.round(Math.abs(HB.spd)*9200*0.7);txt(ctx,(HB.spd>=0?'↻ ':'↺ ')+rpm+' rpm',340,My+56,PAL.yellow,13,'center');
  // PWM trace
  if(m==='F'||m==='R'){const x0=560,w=200,y=240;txt(ctx,'EN (PWM '+Math.round(duty*100)+' %)',x0,y-30,PAL.muted,11,'left');ctx.strokeStyle=PAL.yellow;ctx.lineWidth=2;ctx.beginPath();
    for(let i=0;i<=w;i++){const ph=((i/w)*4+HB.t*4)%1,v=duty>=1||ph<duty?1:0,yy=y-v*18;i?ctx.lineTo(x0+i,yy):ctx.moveTo(x0+i,yy);}ctx.stroke();}
  txt(ctx,'(switches drawn as simple contacts; the chip uses transistors)',40,292,PAL.muted2,10,'left');}
loop((dt,now)=>{draw293(dt);});
})();
