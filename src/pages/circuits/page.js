
let CT=0;
const cv=id=>{const c=$(id),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);return ctx;};
function boxChip(ctx,x,y,w,h,name,pins){__PR(ctx,{t:'chip',x,y,w,h});ctx.fillStyle='#1f2937';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#475569';ctx.lineWidth=1.5;ctx.strokeRect(x,y,w,h);txt(ctx,name,x+w/2,y+h/2+5,'#e2e8f0',13);
  (pins||[]).forEach(([n,px,py,al])=>txt(ctx,n,px,py,'#94a3b8',10,al||'center'));}
const vis=id=>{const r=$(id).getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;};

// P1 LED brightness
function P1(){const ctx=cv('cp1'),vals=[220,470,1000,10000],k=Math.floor(CT/2.2)%4,R=vals[k],I=7/R*1000;
  part(ctx,'batt',80,60,80,200,{label:'9 V',left:true});wire(ctx,[[80,60],[220,60]]);part(ctx,'res',220,60,340,60,{label:fmtOhm(R),lc:Y});wire(ctx,[[340,60],[460,60],[460,95]]);
  part(ctx,'led',460,95,460,175,{glow:Math.min(1,Math.sqrt(I/20))});wire(ctx,[[460,175],[460,200],[80,200]]);dots(ctx,[[80,180],[80,60],[460,60],[460,200],[80,200]],CT*I*3);
  txt(ctx,'I = 7 V ÷ '+fmtOhm(R)+' = '+(I<10?I.toFixed(1):I.toFixed(0))+' mA',620,120,Y,15);txt(ctx,'(cycling through the 4 resistors)',620,145,'#94a3b8',11);}
// P2 fade
const F2={vc:0};function P2(dt){const ctx=cv('cp2'),ph=CT%6,pressed=ph<1.5;F2.vc+=pressed?(1-F2.vc)*dt/0.05:-F2.vc*dt/1.5;
  part(ctx,'batt',80,60,80,210,{label:'9 V',left:true});wire(ctx,[[80,60],[150,60]]);part(ctx,'switch',150,60,230,60,{closed:pressed,label:'button'});wire(ctx,[[230,60],[480,60]]);
  part(ctx,'cap',320,60,320,210,{label:'1000 µF'});dot(ctx,320,60);dot(ctx,320,210);part(ctx,'res',480,60,480,120,{label:'470 Ω'});part(ctx,'led',480,130,480,200,{glow:F2.vc});wire(ctx,[[480,120],[480,130]]);wire(ctx,[[480,200],[480,210],[80,210]]);
  txt(ctx,pressed?'👆 button held: capacitor filling':'released: capacitor feeds the LED…',650,120,pressed?'#10b981':Y,13);
  ctx.fillStyle='#1e293b';ctx.fillRect(250,100,12,70);ctx.fillStyle='#60a5fa';ctx.fillRect(250,100+70*(1-F2.vc),12,70*F2.vc);txt(ctx,'charge',256,186,'#60a5fa',10);}
// P3 polarity tester
function P3(){const ctx=cv('cp3'),flip=Math.floor(CT/2.5)%2===1;
  part(ctx,'batt',80,flip?210:60,80,flip?60:210,{label:'9 V battery',left:true,flip});wire(ctx,[[80,60],[200,60]]);part(ctx,'res',200,60,300,60,{label:'1 kΩ'});wire(ctx,[[300,60],[480,60]]);
  wire(ctx,[[400,60],[400,95]]);part(ctx,'led',400,95,400,175,{glow:flip?0:1,label:'red',left:true});wire(ctx,[[400,175],[400,210]]);
  wire(ctx,[[480,60],[480,95]]);part(ctx,'led',480,175,480,95,{glow:flip?1:0,rgb:'34,197,94',label:'green'});wire(ctx,[[480,175],[480,210]]);
  wire(ctx,[[80,210],[480,210]]);dot(ctx,400,60);dot(ctx,400,210);txt(ctx,flip?'+ at the bottom: GREEN lights':'+ at the top: RED lights',660,130,flip?'#22c55e':'#ef4444',14);}
// P4 traffic light
function P4(){const ctx=cv('cp4'),seq=[[1,0,0],[1,1,0],[0,0,1],[0,1,0]],s=seq[Math.floor(CT/1.8)%4],cols=['239,68,68','250,204,21','34,197,94'],nm=['red','yellow','green'];
  part(ctx,'batt',60,40,60,220,{label:'9 V',left:true});wire(ctx,[[60,40],[600,40]]);wire(ctx,[[60,220],[600,220]]);
  [0,1,2].forEach(i=>{const x=220+i*160;part(ctx,'switch',x,40,x,90,{closed:!!s[i]});part(ctx,'res',x,90,x,140,{label:'470 Ω'});part(ctx,'led',x,145,x,210,{glow:s[i],rgb:cols[i],label:nm[i]});wire(ctx,[[x,140],[x,145]]);wire(ctx,[[x,210],[x,220]]);dot(ctx,x,40);dot(ctx,x,220);});
  txt(ctx,'one resistor per LED',700,130,'#94a3b8',12);}
// P5 touch switch
function P5(){const ctx=cv('cp5'),touch=(CT%4)<2;
  wire(ctx,[[60,30],[700,30]],'#f87171');txt(ctx,'+9 V',56,34,'#f87171',11,'right');wire(ctx,[[60,230],[700,230]],'#60a5fa');txt(ctx,'0 V',56,234,'#60a5fa',11,'right');
  part(ctx,'res',150,30,150,90,{label:'1 kΩ'});ctx.fillStyle='#d4af37';ctx.fillRect(140,92,20,10);ctx.fillRect(140,122,20,10);txt(ctx,'touch pads',120,116,'#d4af37',11,'right');
  if(touch)txt(ctx,'☝️',178,122,'#fff',26);if(touch)__PR(ctx,{t:'part',k:'res',a:[150,90],b:[150,132],o:{label:'500 kΩ'}});wire(ctx,[[150,132],[150,160],[256,160]]);npnQ(ctx,290,160,touch);wire(ctx,[[300,194],[300,200],[356,200]]);npnQ(ctx,390,200,touch);wire(ctx,[[400,234],[400,230]]);
  wire(ctx,[[300,126],[300,110],[520,110]]);wire(ctx,[[400,110],[400,166]]);part(ctx,'res',520,30,520,72,{label:'470 Ω'});part(ctx,'led',520,72,520,110,{glow:touch?1:0});
  txt(ctx,touch?'finger on the pads: LED ON':'no touch: off',590,120,touch?'#10b981':'#94a3b8',14);txt(ctx,'gain ≈ 200 × 200 = 40,000',590,145,'#94a3b8',11);}
// P6 coil kick
function P6(){const ctx=cv('cp6'),ph=CT%4,on=ph<2,flash=ph>=2&&ph<2.25?1-(ph-2)/0.25:0;
  part(ctx,'batt',80,60,80,210,{label:'9 V',left:true});wire(ctx,[[80,60],[160,60]]);part(ctx,'switch',160,60,240,60,{closed:on,label:'button'});wire(ctx,[[240,60],[400,60],[400,90]]);
  part(ctx,'coil',400,90,400,180,{core:true,label:'coil'});wire(ctx,[[400,180],[400,210],[80,210]]);
  wire(ctx,[[400,75],[500,75],[500,95]]);part(ctx,'led',500,175,500,95,{glow:flash,label:'LED (backwards)'});wire(ctx,[[500,175],[500,195],[400,195]]);
  txt(ctx,on?'pressed: current builds up in the coil':flash>0?'released: FLASH! the kick lights the LED':'released',300,238,flash>0?Y:'#94a3b8',13);}
// P7 relay clicker
function P7(){const ctx=cv('cp7'),on=(CT%3)<1.5;
  wire(ctx,[[60,30],[360,30]],'#f87171');txt(ctx,'+5 V',56,34,'#f87171',11,'right');part(ctx,'switch',100,30,100,90,{closed:on,label:'button'});part(ctx,'res',100,90,100,150,{label:'1 kΩ'});wire(ctx,[[100,150],[100,170],[226,170]]);
  txt(ctx,'0 V',56,234,'#60a5fa',11,'right');
  npnQ(ctx,260,170,on);part(ctx,'coil',270,30,270,136,{label:'coil',left:true});wire(ctx,[[270,204],[270,230],[60,230]],'#60a5fa');
  wire(ctx,[[270,40],[330,40],[330,60]]);part(ctx,'diode',330,120,330,60,{col:'#10b981'});wire(ctx,[[330,120],[330,128],[270,128]]);
  // contacts
  ctx.setLineDash([4,4]);ctx.strokeStyle='#64748b';ctx.beginPath();ctx.moveTo(290,85);ctx.lineTo(450,110);ctx.stroke();ctx.setLineDash([]);
  wire(ctx,[[450,110],[450,200]],'#a78bfa');txt(ctx,'COM',440,210,'#94a3b8',10);ctx.fillStyle='#cbd5e1';ctx.save();ctx.translate(450,110);ctx.rotate(on?0.3:-0.3);ctx.fillRect(0,-2,60,4);ctx.restore();
  wire(ctx,[[512,90],[600,90]],'#a78bfa');wire(ctx,[[512,130],[600,130]],'#a78bfa');txt(ctx,'NC',520,82,'#fca5a5',10);txt(ctx,'NO',520,146,'#86efac',10);
  part(ctx,'led',600,90,700,90,{glow:on?0:1});part(ctx,'led',600,130,700,130,{glow:on?1:0,rgb:'34,197,94'});wire(ctx,[[700,90],[740,90],[740,200],[450,200]],'#a78bfa');wire(ctx,[[700,130],[740,130]],'#a78bfa');
  txt(ctx,on?'click → green':'rest → red',620,230,on?'#22c55e':'#ef4444',13);}
// P8 555
function P8(){const ctx=cv('cp8'),on=(CT%1)<0.55;
  wire(ctx,[[60,30],[620,30]],'#f87171');wire(ctx,[[60,235],[620,235]],'#60a5fa');txt(ctx,'+9 V',56,34,'#f87171',11,'right');txt(ctx,'0 V',56,239,'#60a5fa',11,'right');
  __PR(ctx,{t:'chip',x:300,y:85,w:120,h:130});ctx.fillStyle='#1f2937';ctx.fillRect(300,85,120,130);ctx.strokeStyle='#475569';ctx.lineWidth=1.5;ctx.strokeRect(300,85,120,130);txt(ctx,'NE555',360,155,'#e2e8f0',14);
  [['8',320,99],['4',345,99],['7',306,124,'left'],['6',306,184,'left'],['2',306,204,'left'],['3',414,154,'right'],['1',360,211]].forEach(([n,x,y,a])=>txt(ctx,n,x,y,'#94a3b8',10,a||'center'));
  wire(ctx,[[320,30],[320,85]]);wire(ctx,[[345,30],[345,85]]);
  part(ctx,'res',180,30,180,120,{label:'R1 1k',left:true});dot(ctx,180,120);wire(ctx,[[180,120],[300,120]]);
  part(ctx,'res',180,120,180,180,{label:'R2 47k',left:true});dot(ctx,180,180);wire(ctx,[[180,180],[300,180]]);wire(ctx,[[180,180],[180,200],[300,200]]);
  part(ctx,'cap',180,200,180,235,{label:'10 µF',left:true});wire(ctx,[[360,215],[360,235]]);
  wire(ctx,[[420,150],[460,150]]);part(ctx,'res',460,150,540,150,{label:'470 Ω'});wire(ctx,[[540,150],[570,150],[570,160]]);part(ctx,'led',570,160,570,225,{glow:on?1:0});wire(ctx,[[570,225],[570,235]]);
  txt(ctx,'≈ 1.5 blinks/s',700,130,Y,14);}
// P9 chaser
function P9(){const ctx=cv('cp9'),q=Math.floor(CT*4)%10;boxChip(ctx,40,90,90,80,'555');boxChip(ctx,220,70,120,120,'CD4017');
  wire(ctx,[[130,130],[220,130]],Y);txt(ctx,'clock (pin 3 → 14)',175,120,Y,10);
  for(let i=0;i<10;i++){const x=400+i*38,y=130;W(ctx,[[340,80+i*11],[360,80+i*11],[x,y-14]],'#475569',1.5);glowAt(ctx,x,y,i===q?1:0);ctx.fillStyle=i===q?'#ef4444':'#3f1d1d';ctx.beginPath();ctx.arc(x,y,12,0,7);ctx.fill();txt(ctx,'Q'+i,x,y+30,'#94a3b8',10);}
  txt(ctx,'each clock pulse → the next LED',585,200,'#94a3b8',12);}
// P10 mini amp
function P10(){const ctx=cv('cp10'),w=Math.sin(CT*12)*0.5+Math.sin(CT*31)*0.3;
  txt(ctx,'🎸 / 📱',50,135,'#fff',18);wire(ctx,[[80,130],[150,130]]);part(ctx,'pot',150,130,230,130,{label:'volume 10k'});wire(ctx,[[230,130],[300,130]]);
  boxChip(ctx,300,80,120,110,'LM386',[['3',296,134,'right'],['5',424,134,'left'],['6',360,76],['4',360,204]]);wire(ctx,[[360,30],[360,80]],'#f87171');wire(ctx,[[360,190],[360,230]],'#60a5fa');txt(ctx,'+9 V',372,40,'#f87171',11,'left');
  wire(ctx,[[420,130],[470,130]]);part(ctx,'cap',470,130,550,130,{label:'220 µF'});wire(ctx,[[550,130],[600,130]]);
  ctx.fillStyle='#cbd5e1';ctx.fillRect(600,115,14,30);ctx.beginPath();ctx.moveTo(614,115);ctx.lineTo(640+w*4,95);ctx.lineTo(640+w*4,165);ctx.lineTo(614,145);ctx.fill();
  ctx.strokeStyle='#60a5fa';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.globalAlpha=0.7-i*0.2;ctx.beginPath();ctx.arc(650,130,20+i*16+(CT*30)%16,-0.6,0.6);ctx.stroke();}ctx.globalAlpha=1;
  wire(ctx,[[607,145],[607,230],[60,230]],'#60a5fa');txt(ctx,'8 Ω',580,170,'#94a3b8',11);}


// ===== P11 Buzzer =====
const BZ={type:0,drv:0,pressed:false,osc:null,ac:null,g:null,clickT:-9,ph:0};
choices('bzType',['Active buzzer','Passive buzzer / piezo'],0,i=>{BZ.type=i;bzSound();});
choices('bzDrv',['Push button (steady DC)','555 oscillator','Arduino tone()'],0,i=>{BZ.drv=i;bzSound();});
function bzFreq(){const v=+$('bzF').value;return Math.pow(10,v);}
$('bzF').addEventListener('input',()=>{bzSound();});
function bzMode(){// returns {f, mode:'tone'|'click'|'pattern'|'none'}
  if(!BZ.pressed)return {mode:'none'};
  if(BZ.type===0){if(BZ.drv===0)return {mode:'tone',f:2400};if(BZ.drv===1)return {mode:'pattern',f:2400};return {mode:'tone',f:2400};}
  if(BZ.drv===0)return {mode:'click'};return {mode:'tone',f:bzFreq()};}
function bzClick(){try{BZ.ac=BZ.ac||new (window.AudioContext||window.webkitAudioContext)();const ac=BZ.ac,o=ac.createOscillator(),g=ac.createGain();o.type='square';o.frequency.value=180;g.gain.setValueAtTime(0.12,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.0001,ac.currentTime+0.04);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+0.05);}catch(e){}BZ.clickT=CT;}
function bzSound(){const m=bzMode();try{
  if(m.mode==='tone'||m.mode==='pattern'){BZ.ac=BZ.ac||new (window.AudioContext||window.webkitAudioContext)();
    if(!BZ.osc){BZ.osc=BZ.ac.createOscillator();BZ.g=BZ.ac.createGain();BZ.osc.type='square';BZ.g.gain.value=0.05;BZ.osc.connect(BZ.g);BZ.g.connect(BZ.ac.destination);BZ.osc.start();}
    BZ.osc.frequency.value=m.f;}
  else if(BZ.osc){BZ.osc.stop();BZ.osc=null;}}catch(e){}}
const bzb=$('bzBtn');bzb.style.touchAction='none';bzb.style.userSelect='none';
bzb.addEventListener('pointerdown',e=>{e.preventDefault();BZ.pressed=true;if(BZ.type===1&&BZ.drv===0)bzClick();bzSound();});
['pointerup','pointerleave','pointercancel'].forEach(ev=>bzb.addEventListener(ev,()=>{if(!BZ.pressed)return;BZ.pressed=false;if(BZ.type===1&&BZ.drv===0)bzClick();bzSound();}));
function buzzerSym(ctx,x,y,active,vib){ctx.save();ctx.translate(x,y);ctx.fillStyle='#111827';ctx.strokeStyle='#cbd5e1';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,0,26,0,7);ctx.fill();ctx.stroke();
  ctx.strokeStyle=active?'#fbbf24':'#94a3b8';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,14+vib*3,0,7);ctx.stroke();
  txt(ctx,active?'ACT':'PZ',0,4,'#94a3b8',9);ctx.restore();}
function P11(dt){const ctx=cv('cp11'),m=bzMode(),f=BZ.type===0?2400:bzFreq();$('bzFt').textContent=BZ.type===0&&BZ.drv!==2?'fixed ~2.4 kHz':Math.round(bzFreq())+' Hz';
  if(BZ.osc&&m.mode==='pattern'){const on=(CT%0.6)<0.3;BZ.g.gain.value=on?0.05:0;}
  else if(BZ.osc)BZ.g.gain.value=0.05;
  const sounding=m.mode==='tone'||(m.mode==='pattern'&&(CT%0.6)<0.3),clickNow=CT-BZ.clickT<0.12;BZ.ph+=dt*(sounding?40:0);
  const T=50,B=250;
  if(BZ.drv===0){part(ctx,'batt',70,T,70,B,{label:'9 V',left:true});wire(ctx,[[70,T],[160,T]]);part(ctx,'switch',160,T,240,T,{closed:BZ.pressed,label:'button'});wire(ctx,[[240,T],[330,T],[330,124]]);wire(ctx,[[330,176],[330,B],[70,B]]);
    txt(ctx,'+',345,120,'#f87171',13);}
  else if(BZ.drv===1){wire(ctx,[[40,T],[400,T]],'#f87171');wire(ctx,[[40,B],[400,B]],'#60a5fa');txt(ctx,'+9 V',36,T+4,'#f87171',11,'right');txt(ctx,'0 V',36,B+4,'#60a5fa',11,'right');
    __PR(ctx,{t:'chip',x:90,y:95,w:100,h:110});ctx.fillStyle='#1f2937';ctx.fillRect(90,95,100,110);ctx.strokeStyle='#475569';ctx.lineWidth=1.5;ctx.strokeRect(90,95,100,110);txt(ctx,'NE555',140,148,'#e2e8f0',13);txt(ctx,BZ.type?'tone':'beep pattern',140,166,'#94a3b8',10);
    wire(ctx,[[140,T],[140,95]]);wire(ctx,[[140,205],[140,B]]);part(ctx,'switch',60,T,60,B,{closed:BZ.pressed});
    wire(ctx,[[190,150],[230,150]]);part(ctx,'cap',230,150,290,150,{label:'10 µF'});wire(ctx,[[290,150],[330,150],[330,124]]);wire(ctx,[[330,176],[330,B]]);txt(ctx,'pin 3',196,142,'#94a3b8',10,'left');}
  else{ctx.fillStyle='#0e7490';ctx.fillRect(60,90,120,120);txt(ctx,'Arduino',120,140,'#fff',14);txt(ctx,BZ.type?'tone(8, f)':'digitalWrite(8,HIGH)',120,160,'#cffafe',10);
    wire(ctx,[[180,130],[220,130]]);part(ctx,'res',220,130,290,130,{label:'100 Ω'});wire(ctx,[[290,130],[330,130],[330,124]]);wire(ctx,[[330,176],[330,B],[120,B],[120,210]],'#60a5fa');txt(ctx,'pin 8',186,122,'#94a3b8',10,'left');txt(ctx,'GND',126,226,'#60a5fa',10,'left');}
  const vib=sounding?Math.sin(BZ.ph*6):clickNow?1:0;buzzerSym(ctx,330,150,BZ.type===0,vib);
  // sound waves
  if(sounding||clickNow){ctx.strokeStyle='#60a5fa';ctx.lineWidth=2;for(let i=0;i<4;i++){const r=(clickNow&&!sounding)?20+i*10:24+i*16+((BZ.ph*4)%16);ctx.globalAlpha=clickNow&&!sounding?0.6-i*0.15:0.7-i*0.15;ctx.beginPath();ctx.arc(330,150,r+20,-0.6,0.6);ctx.stroke();}ctx.globalAlpha=1;}
  // signal graph
  const gx=470,gw=310;ctx.fillStyle='#1e293b';ctx.fillRect(gx,40,gw,90);txt(ctx,'push on the buzzer',gx+4,34,'#94a3b8',11,'left');
  ctx.strokeStyle=Y;ctx.lineWidth=2;ctx.beginPath();const show=BZ.type===0?40:Math.min(40,f/60);
  for(let px=0;px<=gw;px++){let v=0;if(BZ.pressed){if(BZ.drv===0)v=1;else{const ph=(px/gw*show)%1;v=ph<0.5?1:0;if(BZ.type===0&&BZ.drv===1)v=1;}}const yy=120-v*70;px?ctx.lineTo(gx+px,yy):ctx.moveTo(gx+px,yy);}ctx.stroke();
  let msg,col;
  if(!BZ.pressed){msg='Hold the button…';col='#94a3b8';}
  else if(m.mode==='click'){msg='Steady DC on a passive buzzer: just a click, no tone ✗';col=Y;}
  else if(m.mode==='pattern'){msg='Active buzzer switched on/off by the 555: beep… beep…';col='#10b981';}
  else if(BZ.type===0){msg='Active buzzer: its own oscillator beeps at a fixed pitch ✓';col='#10b981';}
  else{msg='Passive buzzer plays the square wave: '+Math.round(f)+' Hz ✓';col='#10b981';}
  wrapText(ctx,msg,gx,170,gw,20,col,14);
  if(BZ.type===0&&BZ.drv===0)txt(ctx,'(steady DC in, the buzzer makes the wave inside)',gx,235,'#94a3b8',11,'left');}

// ===== Real life A: Li-ion charger =====
const BC={on:false,s:0.12,t:0,h:[],Iset:1,done:false};
choices('bcChoices',['R_PROG 1.2 kΩ → 1 A','R_PROG 2.4 kΩ → 0.5 A'],0,i=>{BC.Iset=i?0.5:1;});
$('bcGo').onclick=()=>{BC.on=!BC.on;if(BC.on&&BC.done){BC.s=0.12;BC.t=0;BC.h=[];BC.done=false;}$('bcGo').textContent=BC.on?'⏏ Unplug USB':'▶ Plug in USB';};
const ocv=s=>3.0+0.95*s+0.25*Math.pow(s,6);
function stepBC(dt){const CAP=2.5,Rin=0.12;let I=0,V=ocv(BC.s),phase='idle';
  if(BC.on&&!BC.done){const vcc=ocv(BC.s)+BC.Iset*Rin;if(vcc<4.2){I=BC.Iset;phase='CC';}else{I=Math.max(0,(4.2-ocv(BC.s))/Rin);I=Math.min(I,BC.Iset);phase='CV';}
    V=ocv(BC.s)+I*Rin;if(phase==='CV'&&I<0.1*BC.Iset){BC.done=true;}
    const mins=dt*(+$('bcSp').value);BC.t+=mins;BC.s=Math.min(1,BC.s+I*(mins/60)/CAP);BC.h.push({t:BC.t,V,I:I/BC.Iset});}
  return {I,V,phase:BC.done?'done':phase};}
function drawBC(dt){const r=stepBC(dt),ctx=cv('cBat');
  // USB + module + cell
  ctx.fillStyle='#475569';ctx.fillRect(20,120,60,40);txt(ctx,'USB 5 V',50,145,'#fff',12);wire(ctx,[[80,130],[120,130]],'#f87171');wire(ctx,[[80,150],[120,150]],'#60a5fa');
  ctx.fillStyle='#1d4ed8';ctx.fillRect(120,95,150,90);ctx.strokeStyle='#93c5fd';ctx.lineWidth=1.5;ctx.strokeRect(120,95,150,90);txt(ctx,'TP4056 + protection',195,125,'#e0e7ff',11);
  const red=BC.on&&!BC.done,blue=BC.on&&BC.done;glowAt(ctx,165,160,red?0.9:0,'239,68,68',20);glowAt(ctx,225,160,blue?0.9:0,'59,130,246',20);
  ctx.fillStyle=red?'#ef4444':'#3f1d1d';ctx.beginPath();ctx.arc(165,160,6,0,7);ctx.fill();ctx.fillStyle=blue?'#3b82f6':'#1e2a4a';ctx.beginPath();ctx.arc(225,160,6,0,7);ctx.fill();
  txt(ctx,'charging',165,178,'#94a3b8',9);txt(ctx,'full',225,178,'#94a3b8',9);
  wire(ctx,[[270,120],[320,120]],'#f87171');wire(ctx,[[270,160],[320,160]],'#60a5fa');txt(ctx,'B+',290,112,'#94a3b8',10);txt(ctx,'B−',290,176,'#94a3b8',10);
  // 18650
  const bx=320,by=90,bw=150,bh=100;ctx.fillStyle='#0f766e';ctx.beginPath();ctx.roundRect(bx,by,bw,bh,14);ctx.fill();ctx.fillStyle='#94a3b8';ctx.fillRect(bx+bw,by+35,8,30);
  ctx.fillStyle='#134e4a';ctx.fillRect(bx+12,by+14,bw-24,bh-28);ctx.fillStyle=BC.s>0.2?'#22c55e':'#f59e0b';ctx.fillRect(bx+12,by+14,(bw-24)*BC.s,bh-28);
  txt(ctx,Math.round(BC.s*100)+'%',bx+bw/2,by+bh/2+6,'#fff',18);txt(ctx,'18650 · 2500 mAh',bx+bw/2,by+bh+18,'#94a3b8',11);
  const ph={idle:['not charging','#94a3b8'],CC:['Phase 1: constant CURRENT','#fbbf24'],CV:['Phase 2: constant VOLTAGE (4.2 V)','#60a5fa'],done:['Done: charger stopped','#10b981']}[r.phase];
  txt(ctx,ph[0],245,40,ph[1],15);txt(ctx,BC.on&&!BC.done?r.V.toFixed(2)+' V · '+(r.I*1000).toFixed(0)+' mA':'',245,62,'#e2e8f0',13);
  txt(ctx,'elapsed: '+Math.floor(BC.t/60)+' h '+String(Math.floor(BC.t%60)).padStart(2,'0')+' min',245,250,'#94a3b8',12);
  // graphs vs time
  const tmax=Math.max(60,2.5/BC.Iset*60*1.25),gx=520,gw=260;
  const g=(y,h,k,min,max,col,l)=>{ctx.fillStyle='#1e293b';ctx.fillRect(gx,y,gw,h);txt(ctx,l,gx+4,y-6,col,11,'left');ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();BC.h.forEach((p,i)=>{const x=gx+p.t/tmax*gw,yy=y+h-(p[k]-min)/(max-min)*h;i?ctx.lineTo(x,yy):ctx.moveTo(x,yy);});ctx.stroke();};
  g(30,110,'V',2.9,4.3,'#60a5fa','battery voltage (3.0 → 4.2 V)');g(180,110,'I',0,1.1,Y,'charge current');
  const y42=30+110-(4.2-2.9)/1.4*110;ctx.setLineDash([4,4]);ctx.strokeStyle='#64748b';ctx.beginPath();ctx.moveTo(gx,y42);ctx.lineTo(gx+gw,y42);ctx.stroke();ctx.setLineDash([]);txt(ctx,'4.2 V',gx+gw+4,y42+4,'#94a3b8',10,'left');
  txt(ctx,'time → ('+Math.round(tmax/60*10)/10+' h)',gx+gw,310,'#94a3b8',10,'right');}

// ===== Real life B: light detector → relay → lamp =====
const LDT={on:false,auto:false,t:0,click:0};
$('ldAuto').onclick=()=>{LDT.auto=!LDT.auto;LDT.t=0;$('ldAuto').textContent=LDT.auto?'⏸ Stop':'🌅 Run a day';};
function drawLD(dt){if(LDT.auto){LDT.t+=dt;$('ldL').value=(0.5+0.5*Math.cos(LDT.t*0.35)).toFixed(3);}
  const L=+$('ldL').value,Th=+$('ldT').value,ldr=1000*Math.pow(200,1-L),Vn=12*ldr/(10000+ldr);
  const was=LDT.on;if(!LDT.on&&Vn>Th+0.3)LDT.on=true;else if(LDT.on&&Vn<Th-0.3)LDT.on=false;if(was!==LDT.on)LDT.click=0.5;LDT.click=Math.max(0,LDT.click-dt);
  const ctx=cv('cLight');
  ctx.fillStyle=`rgb(${Math.round(10+60*L)},${Math.round(15+110*L)},${Math.round(40+150*L)})`;ctx.fillRect(640,0,160,340);txt(ctx,L>0.45?'☀️':'🌙',720,70,'#fff',36);
  wire(ctx,[[40,30],[620,30]],'#f87171');txt(ctx,'+12 V',36,34,'#f87171',11,'right');wire(ctx,[[40,300],[620,300]],'#60a5fa');txt(ctx,'0 V',36,304,'#60a5fa',11,'right');
  part(ctx,'res',90,30,90,140,{label:'10 kΩ',left:true});part(ctx,'ldr',90,140,90,300,{label:'LDR '+(ldr>=1000?(ldr/1000).toFixed(ldr<1e4?1:0)+'k':Math.round(ldr)),left:true});dot(ctx,90,140);
  part(ctx,'pot',170,30,170,300,{});txt(ctx,'threshold',178,100,Y,11,'left');dot(ctx,170,165);
  // opamp
  const ox=230,oy=150;ctx.strokeStyle=LDT.on?'#10b981':WIRE;ctx.lineWidth=2.5;ctx.fillStyle=BG;ctx.beginPath();ctx.moveTo(ox,oy-40);ctx.lineTo(ox+70,oy);ctx.lineTo(ox,oy+40);ctx.closePath();ctx.fill();ctx.stroke();
  txt(ctx,'+',ox+10,oy-14,'#f87171',14,'left');txt(ctx,'−',ox+10,oy+22,'#60a5fa',14,'left');txt(ctx,'LM358',ox+28,oy+4,'#94a3b8',9);
  wire(ctx,[[90,140],[120,140],[120,132],[ox,132]]);wire(ctx,[[170,165],[200,165],[200,168],[ox,168]]);
  wire(ctx,[[ox+70,oy],[320,oy]]);part(ctx,'res',320,oy,380,oy,{label:'1 kΩ'});wire(ctx,[[380,oy],[396,oy]]);npnQ(ctx,430,oy,LDT.on);wire(ctx,[[440,oy+34],[440,300]]);
  part(ctx,'coil',440,30,440,oy-34,{label:'relay',left:true});wire(ctx,[[440,40],[490,40],[490,55]]);part(ctx,'diode',490,100,490,55,{col:'#10b981'});wire(ctx,[[490,100],[490,110],[440,110]]);
  // contact + lamp
  ctx.setLineDash([4,4]);ctx.strokeStyle='#64748b';ctx.beginPath();ctx.moveTo(458,80);ctx.lineTo(540,180);ctx.stroke();ctx.setLineDash([]);
  wire(ctx,[[540,30],[540,180]],'#a78bfa');ctx.fillStyle='#cbd5e1';ctx.save();ctx.translate(540,180);ctx.rotate(LDT.on?0.5:0.05);ctx.fillRect(0,-2,40,4);ctx.restore();
  wire(ctx,[[575,200],[600,200],[600,215]],'#a78bfa');part(ctx,'lamp',600,215,600,275,{glow:LDT.on?1:0});wire(ctx,[[600,275],[600,300]],'#a78bfa');txt(ctx,'12 V lamp',606,292,'#94a3b8',10,'left');
  if(LDT.click>0)txt(ctx,'CLICK',520,150,Y,14);
  // comparison gauge
  const gx=250,gy=250,gw=180;ctx.fillStyle='#1e293b';ctx.fillRect(gx,gy,gw,12);const X=v=>gx+v/12*gw;
  ctx.fillStyle='rgba(251,191,36,.3)';ctx.fillRect(X(Th-0.3),gy-4,X(Th+0.3)-X(Th-0.3),20);ctx.fillStyle=Y;ctx.fillRect(X(Th)-1,gy-6,2,24);
  ctx.fillStyle='#60a5fa';ctx.beginPath();ctx.arc(X(Vn),gy+6,7,0,7);ctx.fill();
  txt(ctx,'sensor '+Vn.toFixed(1)+' V vs threshold '+Th.toFixed(1)+' V',gx+gw/2,gy-12,'#e2e8f0',11);txt(ctx,'(yellow band = hysteresis)',gx+gw/2,gy+30,'#94a3b8',10);
  txt(ctx,LDT.on?'DARK: lamp ON':'BRIGHT: lamp off',720,140,'#fff',14);}


// ===== Circuit menu: show only the selected project =====
const CL_LINKS=[...document.querySelectorAll('#clMenu [data-cl]')];const CL_IDS=CL_LINKS.map(a=>a.dataset.cl);
const clLabel=id=>{const a=CL_LINKS.find(x=>x.dataset.cl===id);return a?a.textContent.replace(/^\S+/,'').trim():id;};
function clSelect(id){if(!CL_IDS.includes(id))return false;CL_IDS.forEach(k=>{const s=document.getElementById(k);if(s)s.hidden=k!==id;});
  CL_LINKS.forEach(a=>a.classList.toggle('active',a.dataset.cl===id));const act=CL_LINKS.find(a=>a.dataset.cl===id);if(act&&act.scrollIntoView&&window.innerWidth<820)act.scrollIntoView({block:'nearest',inline:'center'});return true;}
function clFromHash(){const h=location.hash.slice(1);if(!clSelect(h)&&!CL_LINKS.some(a=>a.classList.contains('active')))clSelect('cintro');}
CL_IDS.forEach((id,i)=>{const s=document.getElementById(id);if(!s)return;const d=document.createElement('div');d.className='qnav';
  d.innerHTML=(i>0?`<a class="navlink" href="#${CL_IDS[i-1]}">← ${clLabel(CL_IDS[i-1])}</a>`:'<span></span>')+(i<CL_IDS.length-1?`<a class="navlink" href="#${CL_IDS[i+1]}">${clLabel(CL_IDS[i+1])} →</a>`:'');s.appendChild(d);});
window.addEventListener('hashchange',clFromHash);clFromHash();

// ===== 7-segment drawing (same as the Real parts page) =====
const GEO7={a:['h',10,50,6],g:['h',10,50,55],d:['h',10,50,104],f:['v',6,10,51],b:['v',54,10,51],e:['v',6,59,100],c:['v',54,59,100]};
const DIG7={0:'abcdef',1:'bc',2:'abged',3:'abgcd',4:'fgbc',5:'afgcd',6:'afgedc',7:'abc',8:'abcdefg',9:'abcdfg'};
function seg7(ctx,k){const [t,p1,p2,p3]=GEO7[k];ctx.beginPath();
  if(t==='h'){ctx.moveTo(p1,p3);ctx.lineTo(p1+5,p3-5);ctx.lineTo(p2-5,p3-5);ctx.lineTo(p2,p3);ctx.lineTo(p2-5,p3+5);ctx.lineTo(p1+5,p3+5);}
  else{ctx.moveTo(p1,p2);ctx.lineTo(p1+5,p2+5);ctx.lineTo(p1+5,p3-5);ctx.lineTo(p1,p3);ctx.lineTo(p1-5,p3-5);ctx.lineTo(p1-5,p2+5);}ctx.closePath();}
function digitBig(ctx,x,y,s,segs,on,dp){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#111';ctx.fillRect(-10,-8,90,126);
  Object.keys(GEO7).concat(['dp']).forEach(k=>{const lit=on&&(k==='dp'?dp:segs.includes(k));ctx.shadowBlur=lit?14:0;ctx.shadowColor='#ef4444';ctx.fillStyle=lit?'#ef4444':'#2a1416';
    if(k==='dp'){ctx.beginPath();ctx.arc(68,104,5,0,7);}else seg7(ctx,k);ctx.fill();ctx.shadowBlur=0;});ctx.restore();}

// ===== 12. Digital dice demo =====
const DC={v:[6,6],rolling:false,acc:0,wait:0.02,mode:0,t:0};
choices('dcMode',['Two dice','One die','Total (2–12)'],0,i=>DC.mode=i);
$('dcRoll').onclick=()=>{if(!DC.rolling){DC.rolling=true;DC.wait=0.02;DC.acc=0;}};
function drawDice(dt){DC.t+=dt;if(DC.rolling){DC.acc+=dt;if(DC.acc>=DC.wait){DC.acc=0;DC.v=[1+Math.floor(Math.random()*6),1+Math.floor(Math.random()*6)];DC.wait+=0.015;if(DC.wait>=0.26)DC.rolling=false;}}
  const ctx=cv('cdice'),slow=$('dcSlow').checked,act=Math.floor(DC.t/0.45)%2;
  let d1,d2;const sum=DC.v[0]+DC.v[1];
  if(DC.mode===0){d1=DC.v[0];d2=DC.v[1];}else if(DC.mode===1){d1=null;d2=DC.v[1];}else{d1=sum>=10?1:null;d2=sum%10;}
  const show=i=>!slow||act===i;
  digitBig(ctx,130,30,1.7,d1===null?'':DIG7[d1],show(0),DC.rolling);digitBig(ctx,300,30,1.7,DIG7[d2],show(1),DC.rolling);
  txt(ctx,'display 1',190,262,'#94a3b8',11);txt(ctx,'display 2',360,262,'#94a3b8',11);
  npnQ(ctx,180,300,show(0));npnQ(ctx,350,300,show(1));txt(ctx,'D10',140,304,'#94a3b8',10,'right');txt(ctx,'D11',310,304,'#94a3b8',10,'right');
  if(slow)txt(ctx,'only display '+(act+1)+' is ON right now',275,22,Y,13);
  const rx=520;txt(ctx,DC.rolling?'rolling…':DC.mode===2?'total':'result',rx+130,70,'#94a3b8',13);
  txt(ctx,DC.rolling?'🎲 🎲':DC.mode===0?DC.v[0]+' + '+DC.v[1]+' = '+sum:DC.mode===1?String(DC.v[1]):String(sum),rx+130,120,DC.rolling?Y:'#10b981',DC.rolling?30:34);
  if(!DC.rolling&&DC.mode===0&&DC.v[0]===DC.v[1])txt(ctx,'Doubles! 🎉',rx+130,160,Y,16);
  txt(ctx,slow?'4 ms per display, slowed down ×100':'each display ON 4 ms, then the other',rx+130,215,'#94a3b8',12);
  txt(ctx,'→ ~125 swaps per second: looks steady',rx+130,235,'#94a3b8',12);}

// ===== 12. Schematic =====
function drawP12(){const ctx=cv('cp12');const ay=[120,136,152,168,184,200,216,232],segs=['a','b','c','d','e','f','g','dp'],pins=[7,6,4,2,1,9,10,5];
  ctx.fillStyle='#0e7490';ctx.fillRect(30,30,120,320);txt(ctx,'Arduino',90,60,'#fff',15);txt(ctx,'Uno / ONE-C',90,78,'#cffafe',10);
  ay.forEach((y,i)=>{txt(ctx,'D'+(i+2),146,y+4,'#cffafe',10,'right');W(ctx,[[150,y],[190,y]],'#cbd5e1',2);ctx.fillStyle=BG;ctx.strokeStyle='#cbd5e1';ctx.lineWidth=1.5;ctx.fillRect(190,y-5,34,10);ctx.strokeRect(190,y-5,34,10);
    W(ctx,[[224,y],[700,y]],'#f87171',2);txt(ctx,segs[i],300,y-3,'#fca5a5',10);});
  txt(ctx,'8 × 330 Ω',207,108,'#e2e8f0',11);
  [[400,'display 1',270,'D10'],[580,'display 2',300,'D11']].forEach(([dx,l,ry,dn],k)=>{
    ctx.fillStyle='#1a1a1a';ctx.fillRect(dx,8,110,84);ctx.strokeStyle='#475569';ctx.strokeRect(dx,8,110,84);
    digitBig(ctx,dx+8,14,0.6,DIG7[k?5:3],true,false);txt(ctx,l,dx+80,40,'#94a3b8',10);txt(ctx,'SC39-11',dx+80,54,'#94a3b8',9);
    ay.forEach((y,i)=>{const x=dx+8+i*11;W(ctx,[[x,92],[x,y]],'#94a3b8',1.2);dot(ctx,x,y);txt(ctx,String(pins[i]),x,103,'#64748b',8);});
    const cx=dx+100;W(ctx,[[cx,92],[cx,251]],'#60a5fa',2);txt(ctx,'COM',cx+4,104,'#60a5fa',9,'left');
    npnQ(ctx,cx-10,285,true);W(ctx,[[cx,319],[cx,365]],'#60a5fa',2);
    // base drive
    txt(ctx,dn,146,ry+4,'#cffafe',10,'right');
    if(!k){W(ctx,[[150,ry],[250,ry]],'#cbd5e1',2);ctx.fillStyle=BG;ctx.fillRect(250,ry-5,34,10);ctx.strokeRect(250,ry-5,34,10);W(ctx,[[284,ry],[cx-54,ry],[cx-54,285],[cx-44,285]],'#cbd5e1',2);}
    else{W(ctx,[[150,ry],[330,ry]],'#cbd5e1',2);ctx.fillStyle=BG;ctx.fillRect(330,ry-5,34,10);ctx.strokeRect(330,ry-5,34,10);W(ctx,[[364,ry],[380,ry],[380,345],[cx-54,345],[cx-54,285],[cx-44,285]],'#cbd5e1',2);}
  });
  txt(ctx,'1 kΩ',267,262,'#e2e8f0',10);txt(ctx,'1 kΩ',347,292,'#e2e8f0',10);
  W(ctx,[[90,350],[90,365],[700,365]],'#60a5fa',2);txt(ctx,'GND',710,369,'#60a5fa',11,'left');
  txt(ctx,'D12',146,334,'#cffafe',10,'right');W(ctx,[[150,330],[175,330]],'#cbd5e1',2);part(ctx,'switch',175,330,245,330,{});W(ctx,[[245,330],[245,365]],'#cbd5e1',2);dot(ctx,245,365);txt(ctx,'button',210,355,'#94a3b8',10);}
drawP12();


// ===== Wiring step checklists =====
document.querySelectorAll('.cl-content section').forEach(sec=>{const ol=sec.querySelector('.wsteps');if(!ol)return;const prog=sec.querySelector('.wprog'),rst=sec.querySelector('.wreset');
  const boxes=[...ol.querySelectorAll('input[type=checkbox]')];
  const upd=()=>{const n=boxes.filter(b=>b.checked).length;prog.textContent=n+' / '+boxes.length+(n===boxes.length?' ✓ done!':'');prog.className='wprog'+(n===boxes.length?' ok':'');
    boxes.forEach(b=>b.closest('li').classList.toggle('done',b.checked));const next=boxes.find(b=>!b.checked);boxes.forEach(b=>b.closest('li').classList.toggle('next',b===next));};
  boxes.forEach(b=>b.addEventListener('change',upd));rst.onclick=()=>{boxes.forEach(b=>b.checked=false);upd();};upd();});


// ================= Breadboard renderer =================
const BB={W:800,H:440,x0:38,dx:12.4,rows:{tp:112,tn:124,a:150,b:162,c:174,d:186,e:198,f:228,g:240,h:252,i:264,j:276,bp:302,bn:314}};
function HP(h){if(Array.isArray(h))return h;const m=/^(tp|tn|bp|bn|[a-j])(\d+)$/.exec(h);if(!m)throw 'bad hole '+h;return [BB.x0+(+m[2]-1)*BB.dx,BB.rows[m[1]]];}
function drawBoard(ctx){ctx.fillStyle='#e5e7eb';ctx.beginPath();ctx.roundRect(22,98,BB.W-44,232,8);ctx.fill();
  ctx.fillStyle='#d1d5db';ctx.fillRect(28,206,BB.W-56,14);
  [['tp','#ef4444',-7],['tn','#3b82f6',7],['bp','#ef4444',-7],['bn','#3b82f6',7]].forEach(([r,c,o])=>{ctx.strokeStyle=c;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(30,BB.rows[r]+o);ctx.lineTo(BB.W-30,BB.rows[r]+o);ctx.stroke();});
  ctx.fillStyle='#9ca3af';for(let c=1;c<=60;c++){const x=BB.x0+(c-1)*BB.dx;Object.entries(BB.rows).forEach(([r,y])=>{if(r.length===2&&c%6===0)return;ctx.fillRect(x-1.8,y-1.8,3.6,3.6);});}
  ctx.fillStyle='#64748b';ctx.font='600 8px system-ui';ctx.textAlign='center';for(let c=1;c<=60;c+=(c===1?4:5)){ctx.fillText(String(c),BB.x0+(c-1)*BB.dx,140);}
  ctx.textAlign='right';'abcdefghij'.split('').forEach(r=>ctx.fillText(r,31,BB.rows[r]+3));
  ctx.fillStyle='#ef4444';ctx.font='700 10px system-ui';ctx.fillText('+',30,BB.rows.tp+4);ctx.fillText('+',30,BB.rows.bp+4);ctx.fillStyle='#3b82f6';ctx.fillText('−',30,BB.rows.tn+4);ctx.fillText('−',30,BB.rows.bn+4);}
const RCOL=['#111','#7c3f12','#dc2626','#f97316','#facc15','#16a34a','#2563eb','#7c3aed','#9ca3af','#f8fafc'];
function bands(v){const n=Math.round(v);if(!n)return null;const s=String(n);const d1=+s[0],d2=s.length>1?+s[1]:0,m=s.length-2;return [RCOL[d1],RCOL[d2],RCOL[Math.max(0,m)]||'#111','#d4af37'];}
function pin(ctx,x,y){ctx.fillStyle='#475569';ctx.beginPath();ctx.arc(x,y,2.6,0,7);ctx.fill();}
function leg(ctx,a,b){ctx.strokeStyle='#9ca3af';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
function partOn(ctx,p,lit,T){const A=p.a?HP(p.a):null,B=p.b?HP(p.b):null;
  switch(p.t){
  case 'wire':{const d=Math.hypot(B[0]-A[0],B[1]-A[1]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-Math.min(34,8+d*0.18);
    ctx.strokeStyle=p.c||'#16a34a';ctx.lineWidth=3.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.quadraticCurveTo(mx,my,B[0],B[1]);ctx.stroke();ctx.lineCap='butt';
    if(!p.freeA)pin(ctx,A[0],A[1]);if(!p.freeB)pin(ctx,B[0],B[1]);if(p.lab){txt(ctx,p.lab,B[0],B[1]+16,'#e2e8f0',11);}break;}
  case 'res':{const d=Math.hypot(B[0]-A[0],B[1]-A[1]);const bs=bands(p.v);
    if(d<34){const cx=A[0],cy=A[1]-16;leg(ctx,A,[cx,cy]);ctx.strokeStyle='#9ca3af';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(cx,cy-9);ctx.quadraticCurveTo(cx+4,cy-20,B[0],B[1]);ctx.stroke();
      ctx.save();ctx.translate(cx,cy);ctx.fillStyle='#e7c99a';ctx.beginPath();ctx.roundRect(-4.5,-11,9,20,4);ctx.fill();if(bs)bs.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(-4.5,-8+i*4.5,9,2.4);});ctx.restore();}
    else{leg(ctx,A,B);const ang=Math.atan2(B[1]-A[1],B[0]-A[0]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;ctx.save();ctx.translate(mx,my);ctx.rotate(ang);ctx.fillStyle='#e7c99a';ctx.beginPath();ctx.roundRect(-13,-4.5,26,9,4);ctx.fill();
      if(bs)bs.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(-9+i*5.2,-4.5,2.6,9);});ctx.restore();}
    pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);if(p.lab)txt(ctx,p.lab,(A[0]+B[0])/2,Math.min(A[1],B[1])-(d<34?32:9),'#334155',8);break;}
  case 'led':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-10,rgb=p.rgb||'239,68,68';leg(ctx,A,[mx-2,my]);leg(ctx,B,[mx+2,my]);
    if(lit){const g=ctx.createRadialGradient(mx,my,2,mx,my,26);g.addColorStop(0,`rgba(${rgb},0.95)`);g.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(mx,my,26,0,7);ctx.fill();}
    ctx.fillStyle=`rgba(${rgb},${lit?1:0.75})`;ctx.beginPath();ctx.arc(mx,my,6.5,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1;ctx.stroke();
    pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);ctx.fillStyle='#b91c1c';ctx.font='700 9px system-ui';ctx.textAlign='center';ctx.fillText('+',A[0]+(A[0]<=B[0]?-6:6),A[1]-4);break;}
  case 'ecap':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-12;leg(ctx,A,[mx-2,my+4]);leg(ctx,B,[mx+2,my+4]);ctx.fillStyle='#1d4ed8';ctx.beginPath();ctx.roundRect(mx-7,my-9,14,15,3);ctx.fill();
    const sx=B[0]>=A[0]?mx+3:mx-7;ctx.fillStyle='#cbd5e1';ctx.fillRect(sx,my-9,4,15);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);if(p.lab)txt(ctx,p.lab,mx,my-12,'#1e3a8a',8);break;}
  case 'ccap':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-9;leg(ctx,A,[mx,my]);leg(ctx,B,[mx,my]);ctx.fillStyle='#ea580c';ctx.beginPath();ctx.ellipse(mx,my,6,5,0,0,7);ctx.fill();pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);if(p.lab)txt(ctx,p.lab,mx,my-8,'#9a3412',8);break;}
  case 'diode':{leg(ctx,A,B);const ang=Math.atan2(B[1]-A[1],B[0]-A[0]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;ctx.save();ctx.translate(mx,my);ctx.rotate(ang);ctx.fillStyle='#111827';ctx.fillRect(-10,-4,20,8);ctx.fillStyle='#e5e7eb';ctx.fillRect(5,-4,3,8);ctx.restore();pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);break;}
  case 'buz':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-4;pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);ctx.fillStyle='#111827';ctx.beginPath();ctx.arc(mx,my,11,0,7);ctx.fill();ctx.strokeStyle='#475569';ctx.beginPath();ctx.arc(mx,my,4,0,7);ctx.stroke();break;}
  case 'ldr':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-8;leg(ctx,A,[mx-2,my]);leg(ctx,B,[mx+2,my]);ctx.fillStyle='#fb923c';ctx.beginPath();ctx.arc(mx,my,6.5,0,7);ctx.fill();ctx.strokeStyle='#7c2d12';ctx.lineWidth=1.2;ctx.beginPath();for(let i=0;i<5;i++){ctx.lineTo(mx-4+i*2,my+(i%2?-2:2));}ctx.stroke();pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);break;}
  case 'btn':{const x1=HP('e'+p.col)[0],x2=HP('e'+(p.col+2))[0];['e','f'].forEach(r=>{pin(ctx,x1,BB.rows[r]);pin(ctx,x2,BB.rows[r]);});ctx.fillStyle='#1f2937';ctx.fillRect(x1-2,BB.rows.e-4,x2-x1+4,BB.rows.f-BB.rows.e+8);ctx.fillStyle='#4b5563';ctx.beginPath();ctx.arc((x1+x2)/2,213,7,0,7);ctx.fill();break;}
  case 'chip':{const n=p.n/2,xl=HP('e'+p.col)[0]-5,xr=HP('e'+(p.col+n-1))[0]+5;for(let i=0;i<n;i++){pin(ctx,HP('e'+(p.col+i))[0],BB.rows.e);pin(ctx,HP('e'+(p.col+i))[0],BB.rows.f);}
    ctx.fillStyle='#111827';ctx.fillRect(xl,BB.rows.e+2,xr-xl,BB.rows.f-BB.rows.e-4);ctx.fillStyle='#e5e7eb';ctx.beginPath();ctx.arc(xl,213,4,-Math.PI/2,Math.PI/2);ctx.fill();
    ctx.fillStyle='#d1d5db';ctx.font='700 8px system-ui';ctx.textAlign='center';ctx.fillText(p.lab,(xl+xr)/2,216);break;}
  case 'seg7':{const xl=HP('e'+p.col)[0]-6,xr=HP('e'+(p.col+4))[0]+6;for(let i=0;i<5;i++){pin(ctx,HP('e'+(p.col+i))[0],BB.rows.e);pin(ctx,HP('e'+(p.col+i))[0],BB.rows.f);}
    ctx.fillStyle='#0a0a0a';ctx.fillRect(xl,BB.rows.d+6,xr-xl,BB.rows.g-BB.rows.d-12);const segs=lit?(p.show==='DYN'?DIG7[1+Math.floor((T&&T.t||performance.now()/1000)*0.6)%6]:p.show==='CNT'?DIG7[(p.place?Math.floor(Math.floor(performance.now()/1000*1.5)%100/10):Math.floor(performance.now()/1000*1.5)%10)]:p.show==='CNT'?DIG7[(p.place?Math.floor(Math.floor(performance.now()/1000*1.5)%100/10):Math.floor(performance.now()/1000*1.5)%10)]:p.show==='CNT'?DIG7[(p.place?Math.floor(Math.floor(performance.now()/1000*1.5)%100/10):Math.floor(performance.now()/1000*1.5)%10)]:(p.show||'abcdefg')):'';
    const ox=xl+16,oy=BB.rows.d+9,s=0.28;ctx.save();ctx.translate(ox,oy);ctx.scale(s,s);const G={a:[10,0,40,8],g:[10,49,40,8],d:[10,98,40,8],f:[2,8,8,41],b:[50,8,8,41],e:[2,57,8,41],c:[50,57,8,41]};
    Object.entries(G).forEach(([k,[x,y,w,h]])=>{ctx.fillStyle=segs.includes(k)?'#ef4444':'#2a1416';ctx.fillRect(x,y,w,h);});ctx.restore();break;}
  case 'bar':{const xl=HP('e'+p.col)[0]-6,xr=HP('e'+(p.col+9))[0]+6;for(let i=0;i<10;i++){pin(ctx,HP('e'+(p.col+i))[0],BB.rows.e);pin(ctx,HP('e'+(p.col+i))[0],BB.rows.f);}
    ctx.fillStyle='#1f2937';ctx.fillRect(xl,BB.rows.d+6,xr-xl,BB.rows.g-BB.rows.d-12);const n=lit?4+((performance.now()/1000)%6<3?0:2):0;
    for(let i=0;i<10;i++){const x=HP('e'+(p.col+i))[0],on=i<n,red=p.cols[i]==='r';ctx.fillStyle=on?(red?'#ef4444':'#22c55e'):(red?'#3b1d1d':'#14301f');if(on){ctx.shadowBlur=10;ctx.shadowColor=red?'#ef4444':'#22c55e';}ctx.fillRect(x-4,BB.rows.d+10,8,BB.rows.g-BB.rows.d-20);ctx.shadowBlur=0;}
    txt(ctx,p.lab||'DC10RG',(xl+xr)/2,BB.rows.d+3,'#94a3b8',8);break;}
  case 'sil':{const n=Math.round((B[0]-A[0])/BB.dx)+1;for(let i=0;i<n;i++)pin(ctx,A[0]+i*BB.dx,A[1]);ctx.fillStyle='#1f2937';ctx.beginPath();ctx.roundRect(A[0]-6,A[1]-17,B[0]-A[0]+12,12,3);ctx.fill();
    ctx.strokeStyle='#64748b';for(let i=0;i<n;i++){ctx.beginPath();ctx.moveTo(A[0]+i*BB.dx,A[1]-5);ctx.lineTo(A[0]+i*BB.dx,A[1]);ctx.stroke();}
    ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(A[0],A[1]-11,2.2,0,7);ctx.fill();txt(ctx,p.lab||'',(A[0]+B[0])/2+4,A[1]-8,'#e5e7eb',8);break;}
  case 'xtal':{leg(ctx,A,B);const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;ctx.fillStyle='#cbd5e1';ctx.beginPath();ctx.roundRect(mx-12,my-5,24,10,5);ctx.fill();ctx.strokeStyle='#64748b';ctx.lineWidth=1;ctx.stroke();txt(ctx,'32k',mx,my+3,'#334155',7);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);break;}
  case 'npn':{const pts=[HP(p.c),HP(p.b),HP(p.e)];pts.forEach(q=>pin(ctx,q[0],q[1]));const x=pts[1][0],y=pts[1][1]-12;ctx.fillStyle='#111827';ctx.beginPath();ctx.arc(x,y+4,11,Math.PI,0);ctx.lineTo(x+11,y+8);ctx.lineTo(x-11,y+8);ctx.closePath();ctx.fill();
    pts.forEach(q=>leg(ctx,q,[q[0]*0.6+x*0.4,y+8]));ctx.fillStyle='#9ca3af';ctx.font='600 7px system-ui';ctx.textAlign='center';ctx.fillText(p.lab||'C B E',x,y+3);break;}
  case 'pot':{const pts=p.h.map(HP);pts.forEach(q=>pin(ctx,q[0],q[1]));const x=pts[1][0],y=pts[1][1]-6;ctx.fillStyle='#2563eb';ctx.fillRect(x-14,y-10,28,18);ctx.fillStyle='#f8fafc';ctx.beginPath();ctx.arc(x,y-1,6,0,7);ctx.fill();ctx.strokeStyle='#2563eb';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-3,y-1);ctx.lineTo(x+3,y-1);ctx.stroke();break;}
  case 'batt':{const [x,y]=p.at,up=y<98,ty=up?y+38:y-5;ctx.fillStyle='#111827';ctx.beginPath();ctx.roundRect(x,y,70,38,5);ctx.fill();ctx.fillStyle='#facc15';ctx.fillRect(x,up?y+29:y,70,9);txt(ctx,p.lab||'9 V',x+35,up?y+20:y+28,'#fff',13);
    ctx.fillStyle='#9ca3af';ctx.fillRect(x+16,ty,10,5);ctx.fillRect(x+44,ty,10,5);const wy=up?ty+5:ty;
    partOn(ctx,{t:'wire',a:[x+21,wy],b:p.plus,c:'#dc2626',freeA:1},lit,T);partOn(ctx,{t:'wire',a:[x+49,wy],b:p.minus,c:'#111',freeA:1},lit,T);break;}
  case 'pm':{ctx.fillStyle='#1f2937';ctx.fillRect(16,98,40,232);ctx.fillStyle='#e5e7eb';ctx.fillRect(18,190,22,26);txt(ctx,'USB',29,207,'#111',7);txt(ctx,'5V',36,170,lit?'#4ade80':'#94a3b8',10);ctx.fillStyle=lit?'#22c55e':'#334155';ctx.beginPath();ctx.arc(36,150,4,0,7);ctx.fill();break;}
  case 'box':{const [x,y]=p.at;ctx.fillStyle=p.col||'#334155';ctx.beginPath();ctx.roundRect(x,y,p.w,p.h,6);ctx.fill();txt(ctx,p.lab,x+p.w/2,y+(p.ly||16),'#fff',p.fs||11);
    if(p.lit&&lit){const [gx,gy]=p.lit.at;const g=ctx.createRadialGradient(gx,gy,1,gx,gy,22);g.addColorStop(0,p.lit.c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(gx,gy,22,0,7);ctx.fill();}
    (p.pins||[]).forEach(q=>{const from=[x+q.dx,y+q.dy];ctx.fillStyle='#cbd5e1';ctx.beginPath();ctx.arc(from[0],from[1],2.5,0,7);ctx.fill();if(q.n)txt(ctx,q.n,from[0],from[1]+(q.dy>=p.h?12:-5),'#e2e8f0',8);
      if(q.to&&(q.s===undefined||(T&&T.has(q.s))||T===null))partOn(ctx,{t:'wire',a:from,b:q.to,c:q.c||'#a3a3a3',freeA:1},lit,T);});break;}
  case 'note':{txt(ctx,p.txt,p.at[0],p.at[1],p.c||'#e2e8f0',p.fs||11,p.al||'center');break;}
  case 'cell':{const [x,y]=p.at;ctx.fillStyle='#0f766e';ctx.beginPath();ctx.roundRect(x,y,110,30,8);ctx.fill();ctx.fillStyle='#94a3b8';ctx.fillRect(x+110,y+9,6,12);txt(ctx,'18650  +',x+60,y+19,'#fff',11);break;}
  }}
// layouts: s = step that adds the part (0 = always), until = step that removes it
const W_R='#dc2626',W_B='#111',W_G='#16a34a',W_Y='#ca8a04',W_O='#ea580c',W_U='#2563eb',W_P='#9333ea';
const BBL={
p1:{power:6,parts:[{s:2,t:'res',a:'tp8',b:'a10',v:470},{s:3,t:'led',a:'c10',b:'c13'},{s:4,t:'wire',a:'a13',b:'tn13',c:W_B},{s:5,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]},
p2:{power:7,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:2,t:'btn',col:5},{s:3,t:'wire',a:'tp5',b:'a5',c:W_R},{s:4,t:'ecap',a:'j7',b:'bn8',lab:'1000µ'},{s:5,t:'res',a:'h7',b:'h15',v:470},{s:6,t:'led',a:'g15',b:'g18'},{s:6,t:'wire',a:'j18',b:'bn18',c:W_B},{s:7,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]},
p3:{power:5,parts:[{s:1,t:'res',a:'a10',b:'a14',v:1000},{s:2,t:'led',a:'c14',b:'c18'},{s:3,t:'led',a:'e18',b:'e14',rgb:'34,197,94',litOff:1},{s:4,t:'wire',a:'d10',b:[150,380],c:W_Y,freeB:1,lab:'A'},{s:4,t:'wire',a:'d18',b:[260,380],c:W_U,freeB:1,lab:'B'},{s:5,t:'batt',at:[330,360],plus:[150,380],minus:[260,380]}]},
p4:{power:7,parts:[{s:2,t:'btn',col:10},{s:2,t:'btn',col:25},{s:2,t:'btn',col:40},{s:3,t:'wire',a:'tp10',b:'a10',c:W_R},{s:3,t:'wire',a:'tp25',b:'a25',c:W_R},{s:3,t:'wire',a:'tp40',b:'a40',c:W_R},
  {s:4,t:'res',a:'j12',b:'j16',v:470},{s:4,t:'res',a:'j27',b:'j31',v:470},{s:4,t:'res',a:'j42',b:'j46',v:470},{s:5,t:'led',a:'h16',b:'h18'},{s:5,t:'led',a:'h31',b:'h33',rgb:'250,204,21'},{s:5,t:'led',a:'h46',b:'h48',rgb:'34,197,94'},
  {s:6,t:'wire',a:'j18',b:'bn18',c:W_B},{s:6,t:'wire',a:'j33',b:'bn33',c:W_B},{s:6,t:'wire',a:'j48',b:'bn48',c:W_B},{s:6,t:'wire',a:'tn3',b:'bn3',c:W_B},{s:7,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]},
p5:{power:8,parts:[{s:2,t:'npn',c:'c20',b:'c21',e:'c22'},{s:2,t:'npn',c:'c30',b:'c31',e:'c32'},{s:3,t:'wire',a:'e22',b:'e31',c:W_O},{s:4,t:'wire',a:'d20',b:'d30',c:W_Y},{s:5,t:'wire',a:'b32',b:'tn33',c:W_B},
  {s:6,t:'led',a:'a36',b:'a30'},{s:6,t:'res',a:'b36',b:'tp37',v:470},{s:7,t:'res',a:'tp12',b:'a12',v:1000},{s:7,t:'wire',a:'b12',b:[150,400],c:W_U,freeB:1,lab:'pad A'},{s:7,t:'wire',a:'b21',b:[230,400],c:W_P,freeB:1,lab:'pad B'},{s:8,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'},{s:8,t:'note',at:[190,392],txt:'☝️',fs:20}]},
p6:{power:0,parts:[{s:1,t:'box',at:[330,8],w:110,h:60,lab:'5 V relay',col:'#1d4ed8',pins:[{n:'coil 1',dx:30,dy:60,to:'j12',s:3,c:W_O},{n:'coil 2',dx:80,dy:60,to:'bn16',s:3,c:W_B}]},
  {s:2,t:'btn',col:10},{s:2,t:'wire',a:'tp10',b:'a10',c:W_R},{s:4,t:'led',a:'bn13',b:'h12'},{s:5,t:'wire',a:'tn3',b:'bn3',c:W_B},{s:5,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'},{s:7,t:'note',at:[560,400],txt:'variant: 1N4007 instead of the LED',c:'#94a3b8'}]},
p7:{power:9,parts:[{s:1,t:'pm'},{s:2,t:'npn',c:'h20',b:'h21',e:'h22'},{s:2,t:'wire',a:'j22',b:'bn23',c:W_B},{s:3,t:'btn',col:10},{s:3,t:'wire',a:'tp10',b:'a10',c:W_R},
  {s:4,t:'res',a:'j12',b:'j21',v:1000},{s:4,t:'res',a:'i21',b:'bn25',v:10000},
  {s:5,t:'box',at:[300,350],w:120,h:62,lab:'5 V relay',col:'#1d4ed8',ly:34,pins:[{n:'coil',dx:20,dy:0,to:'bp17',c:W_R},{n:'coil',dx:45,dy:0,to:'g20',c:W_O},{n:'COM',dx:75,dy:0,to:'tp44',s:7,c:W_R},{n:'NC',dx:95,dy:0,to:'a45',s:7,c:W_Y},{n:'NO',dx:115,dy:0,to:'a55',s:7,c:W_G}]},
  {s:6,t:'diode',a:'f20',b:'bp19'},
  {s:8,t:'res',a:'b45',b:'b48',v:220},{s:8,t:'led',a:'c48',b:'c49'},{s:8,t:'wire',a:'d49',b:'tn49',c:W_B},{s:8,t:'res',a:'b55',b:'b58',v:220},{s:8,t:'led',a:'c58',b:'c59',rgb:'34,197,94',litOff:1},{s:8,t:'wire',a:'d59',b:'tn59',c:W_B}]},
p8:{power:8,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:1,t:'chip',col:20,n:8,lab:'NE555'},
  {s:2,t:'wire',a:'d20',b:'tp20',c:W_R},{s:2,t:'wire',a:'j23',b:'bp23',c:W_R},{s:2,t:'wire',a:'j20',b:'bn20',c:W_B},{s:3,t:'res',a:'c20',b:'c21',v:1000},{s:4,t:'res',a:'b21',b:'b22',v:47000},
  {s:5,t:'wire',a:'a22',b:'j21',c:W_U},{s:6,t:'ecap',a:'i21',b:'bn21',lab:'10µ'},{s:7,t:'res',a:'h22',b:'h28',v:470},{s:7,t:'led',a:'g28',b:'g30',blink:1},{s:7,t:'wire',a:'j30',b:'bn30',c:W_B},
  {s:8,t:'ccap',a:'a23',b:'tn24',lab:'10n'},{s:8,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]},
p9:{power:9,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:2,t:'chip',col:8,n:8,lab:'555'},{s:2,t:'wire',a:'d8',b:'tp8',c:W_R},{s:2,t:'wire',a:'j11',b:'bp11',c:W_R},{s:2,t:'wire',a:'j8',b:'bn8',c:W_B},
  {s:3,t:'res',a:'c8',b:'c9',v:1000},{s:3,t:'res',a:'b9',b:'b10',v:47000},{s:3,t:'wire',a:'a10',b:'i9',c:W_U},{s:3,t:'ecap',a:'h9',b:'bn9',lab:'10µ'},
  {s:4,t:'chip',col:35,n:16,lab:'CD4017'},{s:4,t:'wire',a:'d35',b:'tp35',c:W_R},{s:4,t:'wire',a:'j42',b:'bn42',c:W_B},{s:5,t:'wire',a:'d38',b:'bn38',c:W_B},{s:5,t:'wire',a:'c36',b:'bn36',c:W_B},
  {s:6,t:'wire',a:'g10',b:'c37',c:W_Y},
  ...[['h37',46],['h36',47],['h38',48],['h41',49],['b41',50],['h35',51],['h39',52],['h40',53],['b42',54],['b40',55]].flatMap(([o,c],i)=>[{s:7,t:'wire',a:o,b:'a'+c,c:['#16a34a','#0ea5e9','#a855f7','#f97316','#eab308','#14b8a6','#ec4899','#84cc16','#6366f1','#f43f5e'][i]},{s:7,t:'led',a:'c'+c,b:'tn'+c,chase:i}]),
  {s:8,t:'res',a:'tn57',b:'bn57',v:470},{s:9,t:'batt',at:[40,30],plus:'tp1',minus:'bn2'}]},
p10:{power:8,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:1,t:'chip',col:30,n:8,lab:'LM386'},
  {s:2,t:'wire',a:'j33',b:'bn33',c:W_B},{s:2,t:'wire',a:'j31',b:'bn31',c:W_B},{s:2,t:'wire',a:'a32',b:'tp32',c:W_R},{s:3,t:'ecap',a:'tp27',b:'tn27',lab:'100µ'},
  {s:4,t:'pot',h:['a20','a21','a22']},{s:4,t:'wire',a:'b22',b:'tn22',c:W_B},{s:4,t:'wire',a:'c21',b:'h32',c:W_Y},
  {s:5,t:'ecap',a:'a33',b:'a40',lab:'220µ'},{s:5,t:'box',at:[520,8],w:90,h:56,lab:'🔊 8 Ω',col:'#374151',ly:32,fs:13,pins:[{n:'red',dx:25,dy:56,to:'b40',c:W_R},{n:'black',dx:65,dy:56,to:'tn42',c:W_B}]},
  {s:6,t:'res',a:'c33',b:'c45',v:10},{s:6,t:'ccap',a:'b45',b:'tn46',lab:'47n'},
  {s:7,t:'box',at:[150,8],w:100,h:50,lab:'audio jack',col:'#4b5563',ly:28,pins:[{n:'tip',dx:30,dy:50,to:'b20',c:W_Y},{n:'sleeve',dx:75,dy:50,to:'tn18',c:W_B}]},
  {s:8,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]},
p11:{power:6,parts:[{s:1,t:'pm',until:4},{s:2,t:'btn',col:8,until:4},{s:2,t:'wire',a:'tp8',b:'a8',c:W_R,until:4},
  {s:2,t:'box',at:[300,8],w:110,h:56,lab:'active buzzer',col:'#111827',ly:30,until:4,pins:[{n:'S',dx:20,dy:56,to:'j10',c:W_Y},{n:'+',dx:55,dy:56,to:'tp20',c:W_R},{n:'−',dx:90,dy:56,to:'tn22',c:W_B}]},
  {s:4,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:4,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:4,t:'chip',col:20,n:8,lab:'NE555'},{s:4,t:'wire',a:'d20',b:'tp20',c:W_R},{s:4,t:'wire',a:'j23',b:'bp23',c:W_R},{s:4,t:'wire',a:'j20',b:'bn20',c:W_B},
  {s:4,t:'res',a:'c20',b:'c21',v:1000},{s:4,t:'res',a:'b21',b:'b22',v:47000,lab:'trim'},{s:4,t:'wire',a:'a22',b:'j21',c:W_U},{s:4,t:'ccap',a:'i21',b:'bn21',lab:'47n'},
  {s:5,t:'ecap',a:'h22',b:'h28',lab:'10µ'},{s:5,t:'buz',a:'g28',b:'g31'},{s:5,t:'wire',a:'j31',b:'bn31',c:W_B},{s:6,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]},
p12:{power:9,parts:[{s:1,t:'wire',a:'tn3',b:'bn3',c:W_B},
  {s:1,t:'box',at:[30,4],w:230,h:72,lab:'Arduino Uno / ONE-C',col:'#0e7490',ly:20,pins:[{n:'GND',dx:12,dy:72,to:'bn1',c:W_B},
    {n:'D2',dx:34,dy:72,to:'a2',s:4,c:W_G},{n:'D3',dx:52,dy:72,to:'a6',s:4,c:W_G},{n:'D7',dx:70,dy:72,to:'a10',s:4,c:W_G},{n:'D8',dx:88,dy:72,to:'a14',s:4,c:W_G},
    {n:'D6',dx:106,dy:72,to:'j2',s:5,c:W_U},{n:'D5',dx:124,dy:72,to:'j6',s:5,c:W_U},{n:'D4',dx:142,dy:72,to:'j10',s:5,c:W_U},{n:'D9',dx:160,dy:72,to:'j14',s:5,c:W_U},
    {n:'D10',dx:182,dy:72,to:'a40',s:8,c:W_O},{n:'D11',dx:202,dy:72,to:'a42',s:8,c:W_O},{n:'D12',dx:222,dy:72,to:'a56',s:9,c:W_P}]},
  {s:2,t:'seg7',col:20,show:'abgcd'},{s:2,t:'seg7',col:30,show:'afgcd'},
  ...[['a20','a30'],['b21','b31'],['a23','a33'],['b24','b34'],['j20','j30'],['i21','i31'],['j23','j33'],['i24','i34']].map(([a,b])=>({s:3,t:'wire',a,b,c:W_Y})),
  ...[[2,5,'d23'],[6,9,'d24'],[10,13,'d21'],[14,17,'d20']].flatMap(([k,e,d])=>[{s:4,t:'res',a:'b'+k,b:'b'+e,v:330},{s:4,t:'wire',a:'c'+e,b:d,c:W_G}]),
  ...[[2,5,'h20'],[6,9,'h21'],[10,13,'h23'],[14,17,'h24']].flatMap(([k,e,d])=>[{s:5,t:'res',a:'i'+k,b:'i'+e,v:330},{s:5,t:'wire',a:'h'+e,b:d,c:W_U}]),
  {s:6,t:'npn',c:'c45',b:'c46',e:'c47'},{s:6,t:'npn',c:'c50',b:'c51',e:'c52'},{s:6,t:'wire',a:'a47',b:'tn47',c:W_B},{s:6,t:'wire',a:'a52',b:'tn52',c:W_B},
  {s:7,t:'wire',a:'i22',b:'e45',c:W_P},{s:7,t:'wire',a:'i32',b:'e50',c:W_P},
  {s:8,t:'res',a:'b40',b:'b46',v:1000},{s:8,t:'res',a:'d42',b:'d51',v:1000},{s:9,t:'btn',col:56},{s:9,t:'wire',a:'j58',b:'bn58',c:W_B}]},
rl1:{power:7,noBoard:1,parts:[
  {s:0,t:'box',at:[40,150],w:150,h:60,lab:'18650 holder',col:'#334155',ly:34,pins:[{n:'red +',dx:150,dy:18,to:[290,168],s:2,c:W_R},{n:'black −',dx:150,dy:44,to:[290,194],s:2,c:"#94a3b8"}]},
  {s:6,t:'cell',at:[57,165]},
  {s:0,t:'box',at:[290,140],w:120,h:80,lab:'BMS 1S',col:'#1f2937',ly:44,pins:[{n:'B+',dx:0,dy:28},{n:'B−',dx:0,dy:54},{n:'P+',dx:120,dy:28},{n:'P−',dx:120,dy:54}]},
  {s:0,t:'box',at:[510,60],w:150,h:80,lab:'TP4056 charger',col:'#1d4ed8',ly:30,lit:{at:[560,120],c:'rgba(239,68,68,0.9)'},pins:[{n:'B+',dx:0,dy:58,to:[410,168],s:3,c:W_R},{n:'B−',dx:0,dy:72,to:[410,194],s:3,c:"#94a3b8"}]},
  {s:0,t:'box',at:[510,250],w:150,h:70,lab:'load (switch + LED)',col:'#374151',ly:30,pins:[{n:'+',dx:0,dy:24,to:[410,168],s:4,c:W_R},{n:'−',dx:0,dy:50,to:[410,194],s:4,c:"#94a3b8"}]},
  {s:7,t:'box',at:[690,80],w:80,h:40,lab:'USB 5 V',col:'#4b5563',ly:24,pins:[{dx:0,dy:20,to:[660,100],c:'#94a3b8'}]},
  {s:0,t:'note',at:[400,420],txt:'Not a breadboard build: the modules are wired (soldered) together.',c:'#94a3b8'}]},
rl2:{power:11,parts:[
  {s:1,t:'box',at:[20,8],w:110,h:56,lab:'12 V in (PCM10F)',col:'#374151',ly:28,fs:10,pins:[{n:'+',dx:35,dy:56,to:'tp1',c:W_R},{n:'−',dx:80,dy:56,to:'tn2',c:W_B}]},{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},
  {s:2,t:'res',a:'tp10',b:'a10',v:10000},{s:2,t:'ldr',a:'c10',b:'tn11'},{s:3,t:'chip',col:20,n:8,lab:'LM358'},
  {s:4,t:'wire',a:'d20',b:'tp20',c:W_R},{s:4,t:'wire',a:'j23',b:'bn23',c:W_B},{s:4,t:'ccap',a:'b20',b:'tn21',lab:'100n'},
  {s:5,t:'wire',a:'e10',b:'g22',c:W_Y},{s:6,t:'pot',h:['a12','a13','a14']},{s:6,t:'wire',a:'b12',b:'tp12',c:W_R},{s:6,t:'wire',a:'b14',b:'tn15',c:W_B},{s:6,t:'wire',a:'c13',b:'h21',c:W_U},
  {s:7,t:'res',a:'i20',b:'i22',v:1000000},{s:8,t:'npn',c:'g30',b:'g31',e:'g32'},{s:8,t:'res',a:'h20',b:'h31',v:1000},{s:8,t:'wire',a:'j32',b:'bn33',c:W_B},
  {s:9,t:'box',at:[330,350],w:120,h:62,lab:'12 V relay',col:'#1d4ed8',ly:36,pins:[{n:'coil',dx:20,dy:0,to:'bp38',c:W_R},{n:'coil',dx:45,dy:0,to:'i30',c:W_O},{n:'COM',dx:80,dy:0,to:'tp44',s:10,c:W_R},{n:'NO',dx:108,dy:0,to:[560,60],s:10,c:W_G}]},
  {s:9,t:'diode',a:'j30',b:'bp36'},
  {s:10,t:'box',at:[540,8],w:120,h:56,lab:'💡 12 V lamp',col:'#374151',ly:30,lit:{at:[600,36],c:'rgba(250,204,21,0.9)'},pins:[{n:'1',dx:20,dy:56},{n:'2',dx:100,dy:56,to:'tn48',c:W_B}]}]},
};
function renderBB(id,ctx,T,t){const L=BBL[id];if(!L)return;ctx.clearRect(0,0,BB.W,BB.H);const done=T===null;
  if(!L.noBoard)drawBoard(ctx);
  const lit=done||(L.power&&T.has(L.power));
  let next=null;if(!done){for(let k=1;k<=40;k++){if(!T.has(k)){next=k;break;}}}
  L.parts.forEach(p=>{const shown=done?!(p.until):(p.s===0||T.has(p.s))&&!(p.until&&T.has(p.until));const ghost=!done&&!shown&&p.s===next&&!(p.until&&T.has(p.until));
    if(done&&p.until)return;if(!shown&&!ghost)return;
    ctx.save();if(ghost)ctx.globalAlpha=0.38;
    let pl=lit;if(p.t==='led'){if(p.litOff)pl=false;if(p.grp){const f=1+Math.floor(t*0.6)%6;pl=lit&&({A:[1,3,5],B:[2,3,4,5,6],C:[4,5,6],D:[6]})[p.grp].includes(f);}if(p.chase!==undefined)pl=lit&&Math.floor(t*4)%10===p.chase;if(p.blink)pl=lit&&(((t%0.7)<0.35)!==(p.blink===2));}
    partOn(ctx,p,pl,done?null:T);ctx.restore();
    if(ghost){const pts=[p.a,p.b].filter(h=>h&&typeof h==='string').map(HP);if(p.t==='btn'||p.t==='chip'||p.t==='seg7'||p.t==='bar')pts.push(HP('e'+p.col));if(p.t==='npn')pts.push(HP(p.b));if(p.t==='pot')pts.push(HP(p.h[1]));
      ctx.strokeStyle='#f59e0b';ctx.lineWidth=2;pts.forEach(q=>{ctx.beginPath();ctx.arc(q[0],q[1],6+2*Math.sin(t*6),0,7);ctx.stroke();});}});
  if(!done&&next&&L.parts.some(p=>p.s===next))txt(ctx,'step '+next+' = glowing outline',BB.W-12,L.noBoard?380:92,'#f59e0b',11,'right');
  if(lit)txt(ctx,done?'✓ finished and powered':'⚡ powered',BB.W-12,L.noBoard?400:(done?92:80),'#10b981',12,'right');}

// ===== Dice without Arduino: layouts (generated) =====
Object.assign(BBL,{"p13": {"power": 11, "dice": "face", "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "chip", "col": 4, "n": 8, "lab": "555"}, {"s": 2, "t": "wire", "a": "d4", "b": "tp4", "c": "#dc2626"}, {"s": 2, "t": "wire", "a": "j4", "b": "bn4", "c": "#111"}, {"s": 3, "t": "res", "a": "c4", "b": "c5", "v": 1000}, {"s": 3, "t": "res", "a": "b5", "b": "b6", "v": 47000}, {"s": 3, "t": "wire", "a": "a6", "b": "i5", "c": "#2563eb"}, {"s": 3, "t": "ccap", "a": "h5", "b": "bn6", "lab": "10n"}, {"s": 4, "t": "btn", "col": 9}, {"s": 4, "t": "wire", "a": "tp9", "b": "a9", "c": "#dc2626"}, {"s": 4, "t": "wire", "a": "i11", "b": "i7", "c": "#9333ea"}, {"s": 4, "t": "res", "a": "h7", "b": "bn8", "v": 10000}, {"s": 5, "t": "chip", "col": 14, "n": 16, "lab": "CD4017"}, {"s": 5, "t": "wire", "a": "d14", "b": "tp14", "c": "#dc2626"}, {"s": 5, "t": "wire", "a": "j21", "b": "bn21", "c": "#111"}, {"s": 5, "t": "wire", "a": "d17", "b": "tn17", "c": "#111"}, {"s": 5, "t": "wire", "a": "c15", "b": "j18", "c": "#ea580c"}, {"s": 5, "t": "wire", "a": "g6", "b": "c16", "c": "#ca8a04"}, {"s": 6, "t": "diode", "a": "g16", "b": "f24"}, {"s": 6, "t": "diode", "a": "g17", "b": "g24"}, {"s": 6, "t": "diode", "a": "a20", "b": "h24"}, {"s": 7, "t": "diode", "a": "g15", "b": "f28"}, {"s": 7, "t": "diode", "a": "h17", "b": "g28"}, {"s": 7, "t": "diode", "a": "g20", "b": "h28"}, {"s": 7, "t": "wire", "a": "i28", "b": "i29", "c": "#ca8a04"}, {"s": 7, "t": "diode", "a": "b20", "b": "f29"}, {"s": 7, "t": "diode", "a": "g14", "b": "g29"}, {"s": 8, "t": "diode", "a": "h20", "b": "f33"}, {"s": 8, "t": "diode", "a": "c20", "b": "g33"}, {"s": 8, "t": "diode", "a": "h14", "b": "h33"}, {"s": 8, "t": "wire", "a": "i14", "b": "f37", "c": "#9333ea"}, {"s": 9, "t": "npn", "c": "c23", "b": "c24", "e": "c25"}, {"s": 9, "t": "npn", "c": "c28", "b": "c29", "e": "c30"}, {"s": 9, "t": "npn", "c": "c32", "b": "c33", "e": "c34"}, {"s": 9, "t": "npn", "c": "c36", "b": "c37", "e": "c38"}, {"s": 9, "t": "wire", "a": "a25", "b": "tn25", "c": "#111"}, {"s": 9, "t": "wire", "a": "a30", "b": "tn30", "c": "#111"}, {"s": 9, "t": "wire", "a": "a34", "b": "tn34", "c": "#111"}, {"s": 9, "t": "wire", "a": "a38", "b": "tn38", "c": "#111"}, {"s": 9, "t": "res", "a": "i24", "b": "d24", "v": 10000}, {"s": 9, "t": "res", "a": "j29", "b": "d29", "v": 10000}, {"s": 9, "t": "res", "a": "i33", "b": "d33", "v": 10000}, {"s": 9, "t": "res", "a": "i37", "b": "d37", "v": 10000}, {"s": 10, "t": "res", "a": "tp45", "b": "a45", "v": 470}, {"s": 10, "t": "res", "a": "tp46", "b": "a46", "v": 470}, {"s": 10, "t": "res", "a": "tp48", "b": "a48", "v": 470}, {"s": 10, "t": "res", "a": "tp50", "b": "a50", "v": 470}, {"s": 10, "t": "led", "a": "e45", "b": "f45", "grp": "A"}, {"s": 10, "t": "led", "a": "e46", "b": "f46", "grp": "B"}, {"s": 10, "t": "led", "a": "e47", "b": "f47", "grp": "B"}, {"s": 10, "t": "led", "a": "e48", "b": "f48", "grp": "C"}, {"s": 10, "t": "led", "a": "e49", "b": "f49", "grp": "C"}, {"s": 10, "t": "led", "a": "e50", "b": "f50", "grp": "D"}, {"s": 10, "t": "led", "a": "e51", "b": "f51", "grp": "D"}, {"s": 10, "t": "wire", "a": "j46", "b": "a47", "c": "#ca8a04"}, {"s": 10, "t": "wire", "a": "j48", "b": "a49", "c": "#ca8a04"}, {"s": 10, "t": "wire", "a": "j50", "b": "a51", "c": "#ca8a04"}, {"s": 10, "t": "wire", "a": "j45", "b": "b23", "c": "#ea580c"}, {"s": 10, "t": "wire", "a": "j47", "b": "b28", "c": "#ea580c"}, {"s": 10, "t": "wire", "a": "j49", "b": "b32", "c": "#ea580c"}, {"s": 10, "t": "wire", "a": "j51", "b": "b36", "c": "#ea580c"}, {"s": 11, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]}, "p14": {"power": 12, "dice": "seg", "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "chip", "col": 4, "n": 8, "lab": "555"}, {"s": 2, "t": "wire", "a": "d4", "b": "tp4", "c": "#dc2626"}, {"s": 2, "t": "wire", "a": "j4", "b": "bn4", "c": "#111"}, {"s": 3, "t": "res", "a": "c4", "b": "c5", "v": 1000}, {"s": 3, "t": "res", "a": "b5", "b": "b6", "v": 47000}, {"s": 3, "t": "wire", "a": "a6", "b": "i5", "c": "#2563eb"}, {"s": 3, "t": "ccap", "a": "h5", "b": "bn6", "lab": "10n"}, {"s": 4, "t": "btn", "col": 9}, {"s": 4, "t": "wire", "a": "tp9", "b": "a9", "c": "#dc2626"}, {"s": 4, "t": "wire", "a": "i11", "b": "i7", "c": "#9333ea"}, {"s": 4, "t": "res", "a": "h7", "b": "bn8", "v": 10000}, {"s": 5, "t": "chip", "col": 14, "n": 16, "lab": "CD4017"}, {"s": 5, "t": "wire", "a": "d14", "b": "tp14", "c": "#dc2626"}, {"s": 5, "t": "wire", "a": "j21", "b": "bn21", "c": "#111"}, {"s": 5, "t": "wire", "a": "d17", "b": "tn17", "c": "#111"}, {"s": 5, "t": "wire", "a": "c15", "b": "j18", "c": "#ea580c"}, {"s": 5, "t": "wire", "a": "g6", "b": "c16", "c": "#ca8a04"}, {"s": 6, "t": "wire", "a": "j15", "b": "a23", "c": "#9333ea"}, {"s": 6, "t": "wire", "a": "j17", "b": "a25", "c": "#9333ea"}, {"s": 6, "t": "wire", "a": "d20", "b": "j26", "c": "#9333ea"}, {"s": 6, "t": "wire", "a": "j14", "b": "a27", "c": "#9333ea"}, {"s": 6, "t": "wire", "a": "j34", "b": "j35", "c": "#ca8a04"}, {"s": 6, "t": "wire", "a": "j43", "b": "j44", "c": "#ca8a04"}, {"s": 7, "t": "diode", "a": "g15", "b": "f30"}, {"s": 7, "t": "diode", "a": "g17", "b": "g30"}, {"s": 7, "t": "diode", "a": "a20", "b": "h30"}, {"s": 7, "t": "diode", "a": "g14", "b": "i30"}, {"s": 7, "t": "diode", "a": "g16", "b": "f32"}, {"s": 7, "t": "diode", "a": "h15", "b": "g32"}, {"s": 7, "t": "diode", "a": "h17", "b": "h32"}, {"s": 7, "t": "diode", "a": "g20", "b": "i32"}, {"s": 8, "t": "diode", "a": "h16", "b": "f34"}, {"s": 8, "t": "diode", "a": "i17", "b": "g34"}, {"s": 8, "t": "diode", "a": "h20", "b": "h34"}, {"s": 8, "t": "diode", "a": "b20", "b": "i34"}, {"s": 8, "t": "diode", "a": "h14", "b": "f35"}, {"s": 8, "t": "diode", "a": "i15", "b": "f37"}, {"s": 8, "t": "diode", "a": "b25", "b": "g37"}, {"s": 8, "t": "diode", "a": "c20", "b": "h37"}, {"s": 8, "t": "diode", "a": "i14", "b": "i37"}, {"s": 9, "t": "diode", "a": "b23", "b": "f39"}, {"s": 9, "t": "diode", "a": "b27", "b": "g39"}, {"s": 9, "t": "diode", "a": "i20", "b": "f41"}, {"s": 9, "t": "diode", "a": "f26", "b": "g41"}, {"s": 9, "t": "diode", "a": "c27", "b": "h41"}, {"s": 9, "t": "diode", "a": "c23", "b": "f43"}, {"s": 9, "t": "diode", "a": "c25", "b": "g43"}, {"s": 9, "t": "diode", "a": "j20", "b": "h43"}, {"s": 9, "t": "diode", "a": "g26", "b": "i43"}, {"s": 9, "t": "diode", "a": "d27", "b": "f44"}, {"s": 10, "t": "seg7", "col": 52, "show": "DYN"}, {"s": 10, "t": "wire", "a": "j54", "b": "bn54", "c": "#111"}, {"s": 11, "t": "res", "a": "j30", "b": "c55", "v": 2200}, {"s": 11, "t": "res", "a": "j32", "b": "b56", "v": 2200}, {"s": 11, "t": "res", "a": "i35", "b": "h55", "v": 2200}, {"s": 11, "t": "res", "a": "j37", "b": "i53", "v": 2200}, {"s": 11, "t": "res", "a": "j39", "b": "g52", "v": 2200}, {"s": 11, "t": "res", "a": "j41", "b": "c53", "v": 2200}, {"s": 11, "t": "res", "a": "i44", "b": "b52", "v": 2200}, {"s": 12, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]}, "p15": {"power": 12, "dice": "seg", "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "chip", "col": 4, "n": 8, "lab": "555"}, {"s": 2, "t": "wire", "a": "d4", "b": "tp4", "c": "#dc2626"}, {"s": 2, "t": "wire", "a": "j4", "b": "bn4", "c": "#111"}, {"s": 3, "t": "res", "a": "c4", "b": "c5", "v": 1000}, {"s": 3, "t": "res", "a": "b5", "b": "b6", "v": 47000}, {"s": 3, "t": "wire", "a": "a6", "b": "i5", "c": "#2563eb"}, {"s": 3, "t": "ccap", "a": "h5", "b": "bn6", "lab": "10n"}, {"s": 4, "t": "btn", "col": 9}, {"s": 4, "t": "wire", "a": "tp9", "b": "a9", "c": "#dc2626"}, {"s": 4, "t": "wire", "a": "i11", "b": "i7", "c": "#9333ea"}, {"s": 4, "t": "res", "a": "h7", "b": "bn8", "v": 10000}, {"s": 5, "t": "chip", "col": 14, "n": 16, "lab": "CD4017"}, {"s": 5, "t": "wire", "a": "d14", "b": "tp14", "c": "#dc2626"}, {"s": 5, "t": "wire", "a": "j21", "b": "bn21", "c": "#111"}, {"s": 5, "t": "wire", "a": "d17", "b": "tn17", "c": "#111"}, {"s": 5, "t": "wire", "a": "c15", "b": "j18", "c": "#ea580c"}, {"s": 5, "t": "wire", "a": "g6", "b": "c16", "c": "#ca8a04"}, {"s": 6, "t": "diode", "a": "g16", "b": "f24"}, {"s": 6, "t": "diode", "a": "g17", "b": "g24"}, {"s": 6, "t": "diode", "a": "a20", "b": "h24"}, {"s": 6, "t": "diode", "a": "g15", "b": "f27"}, {"s": 6, "t": "diode", "a": "h17", "b": "g27"}, {"s": 6, "t": "diode", "a": "g14", "b": "h27"}, {"s": 6, "t": "diode", "a": "g20", "b": "f30"}, {"s": 6, "t": "diode", "a": "b20", "b": "g30"}, {"s": 6, "t": "diode", "a": "h14", "b": "h30"}, {"s": 7, "t": "res", "a": "i24", "b": "bn24", "v": 10000}, {"s": 7, "t": "res", "a": "i27", "b": "bn27", "v": 10000}, {"s": 7, "t": "res", "a": "i30", "b": "bn30", "v": 10000}, {"s": 8, "t": "chip", "col": 34, "n": 16, "lab": "CD4511"}, {"s": 8, "t": "wire", "a": "d34", "b": "tp34", "c": "#dc2626"}, {"s": 8, "t": "wire", "a": "j41", "b": "bn41", "c": "#111"}, {"s": 8, "t": "wire", "a": "j36", "b": "bp36", "c": "#dc2626"}, {"s": 8, "t": "wire", "a": "j37", "b": "bp37", "c": "#dc2626"}, {"s": 8, "t": "wire", "a": "j38", "b": "bn38", "c": "#111"}, {"s": 8, "t": "wire", "a": "j39", "b": "bn39", "c": "#111"}, {"s": 9, "t": "wire", "a": "j24", "b": "i40", "c": "#16a34a"}, {"s": 9, "t": "wire", "a": "j27", "b": "i34", "c": "#2563eb"}, {"s": 9, "t": "wire", "a": "j30", "b": "i35", "c": "#9333ea"}, {"s": 10, "t": "seg7", "col": 50, "show": "DYN"}, {"s": 10, "t": "wire", "a": "j52", "b": "bn52", "c": "#111"}, {"s": 11, "t": "res", "a": "c37", "b": "c53", "v": 1000}, {"s": 11, "t": "res", "a": "b38", "b": "b54", "v": 1000}, {"s": 11, "t": "res", "a": "d39", "b": "h53", "v": 1000}, {"s": 11, "t": "res", "a": "c40", "b": "i51", "v": 1000}, {"s": 11, "t": "res", "a": "b41", "b": "g50", "v": 1000}, {"s": 11, "t": "res", "a": "c35", "b": "c51", "v": 1000}, {"s": 11, "t": "res", "a": "b36", "b": "b50", "v": 1000}, {"s": 12, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]}});



// ===== Next-level projects: layouts (generated) =====
Object.assign(BBL,{"p16": {"power": 6, "parts": [{"s": 1, "t": "npn", "c": "c10", "b": "c11", "e": "c12"}, {"s": 1, "t": "npn", "c": "c30", "b": "c31", "e": "c32"}, {"s": 1, "t": "wire", "a": "a12", "b": "tn13", "c": "#111"}, {"s": 1, "t": "wire", "a": "a32", "b": "tn33", "c": "#111"}, {"s": 2, "t": "res", "a": "tp7", "b": "a7", "v": 470}, {"s": 2, "t": "led", "a": "b7", "b": "b10", "blink": 1}, {"s": 2, "t": "res", "a": "tp27", "b": "a27", "v": 470}, {"s": 2, "t": "led", "a": "b27", "b": "b30", "rgb": "34,197,94", "blink": 2}, {"s": 3, "t": "res", "a": "tp11", "b": "a11", "v": 47000}, {"s": 3, "t": "res", "a": "tp31", "b": "a31", "v": 47000}, {"s": 4, "t": "ecap", "a": "e10", "b": "e14", "lab": "10\u00b5"}, {"s": 4, "t": "wire", "a": "d14", "b": "d31", "c": "#ea580c"}, {"s": 5, "t": "ecap", "a": "e30", "b": "e26", "lab": "10\u00b5"}, {"s": 5, "t": "wire", "a": "d26", "b": "d11", "c": "#2563eb"}, {"s": 6, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]}, "p17": {"power": 9, "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "chip", "col": 4, "n": 8, "lab": "555"}, {"s": 2, "t": "wire", "a": "d4", "b": "tp4", "c": "#dc2626"}, {"s": 2, "t": "wire", "a": "j4", "b": "bn4", "c": "#111"}, {"s": 2, "t": "wire", "a": "j7", "b": "bp7", "c": "#dc2626"}, {"s": 3, "t": "res", "a": "c4", "b": "c5", "v": 1000}, {"s": 3, "t": "res", "a": "b5", "b": "b6", "v": 47000}, {"s": 3, "t": "wire", "a": "a6", "b": "i5", "c": "#2563eb"}, {"s": 3, "t": "ecap", "a": "h5", "b": "bn5", "lab": "10\u00b5"}, {"s": 4, "t": "res", "a": "i6", "b": "i10", "v": 470}, {"s": 4, "t": "led", "a": "h10", "b": "h13", "blink": 1}, {"s": 4, "t": "wire", "a": "j13", "b": "bn13", "c": "#111"}, {"s": 5, "t": "chip", "col": 20, "n": 8, "lab": "555"}, {"s": 5, "t": "wire", "a": "d20", "b": "tp20", "c": "#dc2626"}, {"s": 5, "t": "wire", "a": "j20", "b": "bn20", "c": "#111"}, {"s": 5, "t": "wire", "a": "j23", "b": "bp23", "c": "#dc2626"}, {"s": 6, "t": "res", "a": "c20", "b": "c21", "v": 1000}, {"s": 6, "t": "res", "a": "b21", "b": "b22", "v": 10000}, {"s": 6, "t": "wire", "a": "a22", "b": "i21", "c": "#2563eb"}, {"s": 6, "t": "ccap", "a": "h21", "b": "bn21", "lab": "100n"}, {"s": 7, "t": "wire", "a": "h6", "b": "a14", "c": "#9333ea"}, {"s": 7, "t": "res", "a": "b14", "b": "b23", "v": 10000}, {"s": 8, "t": "res", "a": "h22", "b": "h30", "v": 220}, {"s": 8, "t": "box", "at": [380, 352], "w": 130, "h": 46, "lab": "\ud83d\udd0a 8 \u03a9 speaker", "col": "#374151", "ly": 28, "pins": [{"n": "", "dx": 18, "dy": 0, "to": "j30", "c": "#ca8a04"}, {"n": "", "dx": 112, "dy": 0, "to": "bn32", "c": "#111"}]}, {"s": 9, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]}, "p18": {"power": 8, "parts": [{"s": 1, "t": "npn", "c": "c20", "b": "c21", "e": "c22"}, {"s": 1, "t": "wire", "a": "a22", "b": "tn22", "c": "#111"}, {"s": 1, "t": "npn", "c": "c30", "b": "c31", "e": "c32"}, {"s": 1, "t": "wire", "a": "b20", "b": "b31", "c": "#ca8a04"}, {"s": 2, "t": "res", "a": "tp19", "b": "a20", "v": 33000}, {"s": 3, "t": "res", "a": "tp25", "b": "b26", "v": 470}, {"s": 3, "t": "pot", "h": ["a26", "a27", "a28"]}, {"s": 3, "t": "wire", "a": "c27", "b": "a30", "c": "#ea580c"}, {"s": 4, "t": "res", "a": "a32", "b": "tn33", "v": 1000}, {"s": 4, "t": "ecap", "a": "b32", "b": "tn34", "lab": "22\u00b5"}, {"s": 5, "t": "res", "a": "e32", "b": "e21", "v": 100000}, {"s": 6, "t": "ecap", "a": "d21", "b": "d17", "lab": "2.2\u00b5"}, {"s": 6, "t": "box", "at": [150, 22], "w": 110, "h": 40, "lab": "\ud83c\udfb8 IN jack", "col": "#374151", "ly": 24, "pins": [{"n": "tip", "dx": 22, "dy": 40, "to": "a17", "c": "#ca8a04"}, {"n": "sleeve", "dx": 86, "dy": 40, "to": "tn16", "c": "#111"}]}, {"s": 7, "t": "ccap", "a": "d30", "b": "d35", "lab": "10n"}, {"s": 7, "t": "box", "at": [440, 22], "w": 130, "h": 40, "lab": "OUT \u2192 Ruby amp", "col": "#374151", "ly": 24, "pins": [{"n": "tip", "dx": 20, "dy": 40, "to": "a35", "c": "#ca8a04"}, {"n": "sleeve", "dx": 104, "dy": 40, "to": "tn37", "c": "#111"}]}, {"s": 8, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]}, "p19": {"power": 13, "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "chip", "col": 3, "n": 8, "lab": "555"}, {"s": 2, "t": "wire", "a": "d3", "b": "tp3", "c": "#dc2626"}, {"s": 2, "t": "wire", "a": "j3", "b": "bn3", "c": "#111"}, {"s": 2, "t": "wire", "a": "j6", "b": "bp7", "c": "#dc2626"}, {"s": 2, "t": "res", "a": "c3", "b": "c4", "v": 1000}, {"s": 2, "t": "res", "a": "b4", "b": "b5", "v": 47000}, {"s": 2, "t": "wire", "a": "a5", "b": "i4", "c": "#2563eb"}, {"s": 2, "t": "ecap", "a": "h4", "b": "bn4", "lab": "10\u00b5"}, {"s": 3, "t": "chip", "col": 9, "n": 16, "lab": "CD4518"}, {"s": 3, "t": "wire", "a": "d9", "b": "tp9", "c": "#dc2626"}, {"s": 3, "t": "wire", "a": "j16", "b": "bn16", "c": "#111"}, {"s": 3, "t": "wire", "a": "j10", "b": "bp10", "c": "#dc2626"}, {"s": 3, "t": "wire", "a": "a16", "b": "tn16", "c": "#111"}, {"s": 3, "t": "wire", "a": "h5", "b": "h9", "c": "#ca8a04"}, {"s": 4, "t": "wire", "a": "g14", "b": "b15", "c": "#ea580c"}, {"s": 4, "t": "wire", "a": "b10", "b": "h15", "c": "#9333ea"}, {"s": 4, "t": "res", "a": "i15", "b": "bn15", "v": 10000}, {"s": 4, "t": "btn", "col": 50}, {"s": 4, "t": "wire", "a": "tp50", "b": "a50", "c": "#dc2626"}, {"s": 4, "t": "wire", "a": "i52", "b": "j15", "c": "#9333ea"}, {"s": 5, "t": "chip", "col": 19, "n": 16, "lab": "CD4511"}, {"s": 5, "t": "wire", "a": "d19", "b": "tp19", "c": "#dc2626"}, {"s": 5, "t": "wire", "a": "j26", "b": "bn26", "c": "#111"}, {"s": 5, "t": "wire", "a": "j21", "b": "bp21", "c": "#dc2626"}, {"s": 5, "t": "wire", "a": "j22", "b": "bp22", "c": "#dc2626"}, {"s": 5, "t": "wire", "a": "j23", "b": "bn23", "c": "#111"}, {"s": 6, "t": "wire", "a": "a14", "b": "i25", "c": "#16a34a"}, {"s": 6, "t": "wire", "a": "a13", "b": "i19", "c": "#2563eb"}, {"s": 6, "t": "wire", "a": "c12", "b": "h20", "c": "#9333ea"}, {"s": 6, "t": "wire", "a": "b11", "b": "h24", "c": "#ea580c"}, {"s": 7, "t": "seg7", "col": 28, "show": "CNT", "place": 1}, {"s": 7, "t": "wire", "a": "j30", "b": "bn31", "c": "#111"}, {"s": 8, "t": "res", "a": "a20", "b": "a29", "v": 1000}, {"s": 8, "t": "res", "a": "b21", "b": "b28", "v": 1000}, {"s": 8, "t": "res", "a": "c22", "b": "c31", "v": 1000}, {"s": 8, "t": "res", "a": "d23", "b": "d32", "v": 1000}, {"s": 8, "t": "res", "a": "a24", "b": "g31", "v": 1000}, {"s": 8, "t": "res", "a": "a25", "b": "h29", "v": 1000}, {"s": 8, "t": "res", "a": "a26", "b": "i28", "v": 1000}, {"s": 9, "t": "chip", "col": 35, "n": 16, "lab": "CD4511"}, {"s": 9, "t": "wire", "a": "d35", "b": "tp35", "c": "#dc2626"}, {"s": 9, "t": "wire", "a": "j42", "b": "bn43", "c": "#111"}, {"s": 9, "t": "wire", "a": "j37", "b": "bp37", "c": "#dc2626"}, {"s": 9, "t": "wire", "a": "j38", "b": "bp38", "c": "#dc2626"}, {"s": 9, "t": "wire", "a": "j39", "b": "bn39", "c": "#111"}, {"s": 10, "t": "wire", "a": "i11", "b": "i41", "c": "#16a34a"}, {"s": 10, "t": "wire", "a": "i12", "b": "i35", "c": "#2563eb"}, {"s": 10, "t": "wire", "a": "i13", "b": "i36", "c": "#9333ea"}, {"s": 10, "t": "wire", "a": "h14", "b": "i40", "c": "#ea580c"}, {"s": 11, "t": "seg7", "col": 44, "show": "CNT", "place": 0}, {"s": 11, "t": "wire", "a": "j46", "b": "bn47", "c": "#111"}, {"s": 12, "t": "res", "a": "a36", "b": "a45", "v": 1000}, {"s": 12, "t": "res", "a": "b37", "b": "b44", "v": 1000}, {"s": 12, "t": "res", "a": "c38", "b": "c47", "v": 1000}, {"s": 12, "t": "res", "a": "d39", "b": "d48", "v": 1000}, {"s": 12, "t": "res", "a": "a40", "b": "g47", "v": 1000}, {"s": 12, "t": "res", "a": "a41", "b": "h45", "v": 1000}, {"s": 12, "t": "res", "a": "a42", "b": "i44", "v": 1000}, {"s": 13, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]}});

// ===== p20 thermometer layout (built from p12) =====
BBL.p20={power:9,parts:BBL.p12.parts.filter(p=>p.s!==9).map(p=>p.t==='box'?Object.assign({},p,{w:280,pins:p.pins.filter(q=>q.n!=='D12').concat([{n:'5V',dx:244,dy:72,to:'tp55',s:9,c:W_R},{n:'A0',dx:264,dy:72,to:'b56',s:9,c:W_Y}])}):p.t==='seg7'?Object.assign({},p,{show:p.col===20?'abged':'abgcd'}):p).concat([
  {s:9,t:'box',at:[600,10],w:160,h:50,lab:'🌡️ LM35 module',col:'#9a3412',ly:22,pins:[{n:'S',dx:30,dy:50,to:'a56',c:W_Y},{n:'Vcc',dx:80,dy:50,to:'tp57',c:W_R},{n:'Gnd',dx:130,dy:50,to:'tn58',c:W_B}]}])};

// ===== p21 layout (generated) =====
Object.assign(BBL,{"p21": {"power": 9, "parts": [{"s": 1, "t": "pm"}, {"s": 2, "t": "chip", "col": 4, "n": 14, "lab": "LM339 U1"}, {"s": 2, "t": "wire", "a": "j6", "b": "bp6", "c": "#dc2626"}, {"s": 2, "t": "wire", "a": "a6", "b": "tn6", "c": "#111"}, {"s": 2, "t": "chip", "col": 13, "n": 14, "lab": "LM339 U2"}, {"s": 2, "t": "wire", "a": "j15", "b": "bp15", "c": "#dc2626"}, {"s": 2, "t": "wire", "a": "a15", "b": "tn15", "c": "#111"}, {"s": 2, "t": "chip", "col": 22, "n": 14, "lab": "LM339 U3"}, {"s": 2, "t": "wire", "a": "j24", "b": "bp24", "c": "#dc2626"}, {"s": 2, "t": "wire", "a": "a24", "b": "tn24", "c": "#111"}, {"s": 3, "t": "npn", "c": "c43", "b": "c44", "e": "c45", "lab": "LM35"}, {"s": 3, "t": "wire", "a": "a43", "b": "tp43", "c": "#dc2626"}, {"s": 3, "t": "wire", "a": "a45", "b": "tn45", "c": "#111"}, {"s": 4, "t": "wire", "a": "b44", "b": "g25", "c": "#ca8a04"}, {"s": 4, "t": "wire", "a": "h25", "b": "h27", "c": "#ca8a04"}, {"s": 4, "t": "wire", "a": "i27", "b": "d19", "c": "#ca8a04"}, {"s": 4, "t": "wire", "a": "c19", "b": "c17", "c": "#ca8a04"}, {"s": 4, "t": "wire", "a": "b17", "b": "g18", "c": "#ca8a04"}, {"s": 4, "t": "wire", "a": "h18", "b": "h16", "c": "#ca8a04"}, {"s": 4, "t": "wire", "a": "i16", "b": "d10", "c": "#ca8a04"}, {"s": 4, "t": "wire", "a": "c10", "b": "c8", "c": "#ca8a04"}, {"s": 4, "t": "wire", "a": "b8", "b": "g9", "c": "#ca8a04"}, {"s": 4, "t": "wire", "a": "h9", "b": "h7", "c": "#ca8a04"}, {"s": 5, "t": "res", "a": "h32", "b": "h33", "v": 100}, {"s": 5, "t": "res", "a": "i33", "b": "i34", "v": 100}, {"s": 5, "t": "res", "a": "h34", "b": "h35", "v": 100}, {"s": 5, "t": "res", "a": "i35", "b": "i36", "v": 100}, {"s": 5, "t": "res", "a": "h36", "b": "h37", "v": 100}, {"s": 5, "t": "res", "a": "i37", "b": "i38", "v": 100}, {"s": 5, "t": "res", "a": "h38", "b": "h39", "v": 100}, {"s": 5, "t": "res", "a": "i39", "b": "i40", "v": 100}, {"s": 5, "t": "res", "a": "h40", "b": "h41", "v": 100}, {"s": 5, "t": "res", "a": "j32", "b": "j30", "v": 470}, {"s": 5, "t": "res", "a": "i30", "b": "bn30", "v": 330}, {"s": 5, "t": "res", "a": "j41", "b": "j44", "v": 10000}, {"s": 5, "t": "res", "a": "i44", "b": "i46", "v": 10000}, {"s": 5, "t": "pot", "h": ["g46", "g47", "g48"]}, {"s": 5, "t": "wire", "a": "j47", "b": "bp47", "c": "#dc2626"}, {"s": 6, "t": "wire", "a": "g32", "b": "i8", "c": "#2563eb"}, {"s": 6, "t": "wire", "a": "g33", "b": "i10", "c": "#2563eb"}, {"s": 6, "t": "wire", "a": "g34", "b": "b9", "c": "#2563eb"}, {"s": 6, "t": "wire", "a": "g35", "b": "b7", "c": "#2563eb"}, {"s": 6, "t": "wire", "a": "g36", "b": "i17", "c": "#2563eb"}, {"s": 6, "t": "wire", "a": "g37", "b": "i19", "c": "#2563eb"}, {"s": 6, "t": "wire", "a": "g38", "b": "b18", "c": "#2563eb"}, {"s": 6, "t": "wire", "a": "g39", "b": "b16", "c": "#2563eb"}, {"s": 6, "t": "wire", "a": "g40", "b": "i26", "c": "#2563eb"}, {"s": 6, "t": "wire", "a": "g41", "b": "i28", "c": "#2563eb"}, {"s": 7, "t": "bar", "col": 50, "cols": ["g", "g", "g", "g", "g", "g", "g", "g", "g", "g"], "lab": "DC10G"}, {"s": 7, "t": "sil", "a": "j49", "b": "j57", "lab": "8 \u00d7 470 \u03a9"}, {"s": 7, "t": "wire", "a": "i49", "b": "bp49", "c": "#dc2626"}, {"s": 7, "t": "res", "a": "j58", "b": "bp58", "v": 470}, {"s": 7, "t": "res", "a": "j59", "b": "bp59", "v": 470}, {"s": 8, "t": "wire", "a": "i5", "b": "a50", "c": "#16a34a"}, {"s": 8, "t": "wire", "a": "i4", "b": "a51", "c": "#16a34a"}, {"s": 8, "t": "wire", "a": "b4", "b": "a52", "c": "#16a34a"}, {"s": 8, "t": "wire", "a": "b5", "b": "a53", "c": "#16a34a"}, {"s": 8, "t": "wire", "a": "i14", "b": "a54", "c": "#16a34a"}, {"s": 8, "t": "wire", "a": "i13", "b": "a55", "c": "#16a34a"}, {"s": 8, "t": "wire", "a": "b13", "b": "a56", "c": "#16a34a"}, {"s": 8, "t": "wire", "a": "b14", "b": "a57", "c": "#16a34a"}, {"s": 8, "t": "wire", "a": "i23", "b": "a58", "c": "#16a34a"}, {"s": 8, "t": "wire", "a": "i22", "b": "a59", "c": "#16a34a"}]}});

// ===== p22 layout (generated) =====
Object.assign(BBL,{"p22": {"power": 10, "parts": [{"s": 1, "t": "pm"}, {"s": 2, "t": "chip", "col": 4, "n": 8, "lab": "555 #1"}, {"s": 2, "t": "wire", "a": "d4", "b": "tp4", "c": "#dc2626"}, {"s": 2, "t": "wire", "a": "j4", "b": "bn4", "c": "#111"}, {"s": 2, "t": "wire", "a": "j7", "b": "bp7", "c": "#dc2626"}, {"s": 3, "t": "res", "a": "c4", "b": "c5", "v": 1000}, {"s": 3, "t": "res", "a": "b5", "b": "b6", "v": 10000}, {"s": 3, "t": "wire", "a": "a6", "b": "i5", "c": "#2563eb"}, {"s": 3, "t": "ccap", "a": "h5", "b": "bn5", "lab": "100n"}, {"s": 4, "t": "chip", "col": 20, "n": 8, "lab": "555 #2"}, {"s": 4, "t": "wire", "a": "d20", "b": "tp20", "c": "#dc2626"}, {"s": 4, "t": "wire", "a": "j20", "b": "bn20", "c": "#111"}, {"s": 4, "t": "wire", "a": "g6", "b": "g23", "c": "#9333ea"}, {"s": 5, "t": "res", "a": "c20", "b": "c21", "v": 1000}, {"s": 5, "t": "res", "a": "b21", "b": "b26", "v": 2200}, {"s": 5, "t": "res", "a": "c26", "b": "c29", "v": 1000}, {"s": 5, "t": "res", "a": "d29", "b": "d22", "v": 330}, {"s": 5, "t": "wire", "a": "a22", "b": "i21", "c": "#2563eb"}, {"s": 5, "t": "ccap", "a": "h21", "b": "bn21", "lab": "4.7n"}, {"s": 6, "t": "res", "a": "i22", "b": "i28", "v": 1000}, {"s": 6, "t": "wire", "a": "h28", "b": "h55", "c": "#ea580c"}, {"s": 6, "t": "led", "a": "g55", "b": "g57", "rgb": "139,92,246"}, {"s": 6, "t": "wire", "a": "j57", "b": "bn57", "c": "#111"}, {"s": 7, "t": "npn", "c": "c40", "b": "c41", "e": "c42", "lab": "TSOP"}, {"s": 7, "t": "wire", "a": "a41", "b": "tn41", "c": "#111"}, {"s": 7, "t": "wire", "a": "a42", "b": "tp42", "c": "#dc2626"}, {"s": 7, "t": "ecap", "a": "b42", "b": "tn43", "lab": "10\u00b5"}, {"s": 8, "t": "res", "a": "tp36", "b": "a36", "v": 4700}, {"s": 8, "t": "ecap", "a": "b36", "b": "tn37", "lab": "10\u00b5"}, {"s": 8, "t": "diode", "a": "d36", "b": "d40"}, {"s": 9, "t": "npn", "c": "c46", "b": "c47", "e": "c48"}, {"s": 9, "t": "wire", "a": "a48", "b": "tn49", "c": "#111"}, {"s": 9, "t": "res", "a": "e36", "b": "e47", "v": 10000}, {"s": 9, "t": "res", "a": "a47", "b": "tn47", "v": 10000}, {"s": 9, "t": "res", "a": "tp44", "b": "a44", "v": 330}, {"s": 9, "t": "led", "a": "b44", "b": "b46"}]}});


// ===== p23 layout (generated) =====
Object.assign(BBL,{"p23": {"power": 9, "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 1, "t": "ecap", "a": "tp7", "b": "tn8", "lab": "100\u00b5"}, {"s": 2, "t": "chip", "col": 10, "n": 8, "lab": "NE555"}, {"s": 2, "t": "wire", "a": "d10", "b": "tp10", "c": "#dc2626"}, {"s": 2, "t": "wire", "a": "j10", "b": "bn10", "c": "#111"}, {"s": 2, "t": "wire", "a": "j13", "b": "bp13", "c": "#dc2626"}, {"s": 3, "t": "res", "a": "c10", "b": "c11", "v": 1000}, {"s": 3, "t": "pot", "h": ["a20", "a21", "a22"]}, {"s": 3, "t": "wire", "a": "d11", "b": "c21", "c": "#ea580c"}, {"s": 4, "t": "diode", "a": "b20", "b": "b12"}, {"s": 4, "t": "diode", "a": "c12", "b": "c22"}, {"s": 4, "t": "wire", "a": "a12", "b": "i11", "c": "#2563eb"}, {"s": 4, "t": "ccap", "a": "h11", "b": "bn11", "lab": "10n"}, {"s": 5, "t": "res", "a": "i12", "b": "i16", "v": 470}, {"s": 5, "t": "led", "a": "h16", "b": "h18"}, {"s": 5, "t": "wire", "a": "j18", "b": "bn18", "c": "#111"}, {"s": 6, "t": "npn", "c": "g32", "b": "g31", "e": "g30", "lab": "E B C"}, {"s": 6, "t": "res", "a": "h12", "b": "h31", "v": 1000}, {"s": 6, "t": "wire", "a": "j30", "b": "bn30", "c": "#111"}, {"s": 7, "t": "box", "at": [330, 352], "w": 140, "h": 46, "lab": "\u2699\ufe0f DC motor RE140/1", "col": "#374151", "ly": 28, "pins": [{"n": "", "dx": 18, "dy": 0, "to": "j32", "c": "#ca8a04"}, {"n": "", "dx": 122, "dy": 0, "to": "bp35", "c": "#dc2626"}]}, {"s": 8, "t": "diode", "a": "i32", "b": "bp33"}, {"s": 9, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]}, "p24": {"power": 8, "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "chip", "col": 20, "n": 16, "lab": "L293D"}, {"s": 2, "t": "wire", "a": "d20", "b": "tp20", "c": "#dc2626"}, {"s": 2, "t": "wire", "a": "j27", "b": "bp27", "c": "#dc2626"}, {"s": 2, "t": "wire", "a": "j23", "b": "bn23", "c": "#111"}, {"s": 2, "t": "wire", "a": "j24", "b": "bn24", "c": "#111"}, {"s": 2, "t": "wire", "a": "a23", "b": "tn23", "c": "#111"}, {"s": 2, "t": "wire", "a": "a24", "b": "tn24", "c": "#111"}, {"s": 3, "t": "res", "a": "i20", "b": "bp18", "v": 10000}, {"s": 3, "t": "res", "a": "j20", "b": "bn19", "v": 10000}, {"s": 4, "t": "btn", "col": 4}, {"s": 4, "t": "wire", "a": "tp4", "b": "a4", "c": "#dc2626"}, {"s": 4, "t": "res", "a": "g6", "b": "g12", "v": 10000}, {"s": 4, "t": "wire", "a": "h12", "b": "h21", "c": "#16a34a"}, {"s": 4, "t": "res", "a": "j21", "b": "bn21", "v": 10000}, {"s": 5, "t": "btn", "col": 34}, {"s": 5, "t": "wire", "a": "tp34", "b": "a34", "c": "#dc2626"}, {"s": 5, "t": "res", "a": "g36", "b": "g30", "v": 10000}, {"s": 5, "t": "wire", "a": "h30", "b": "h26", "c": "#2563eb"}, {"s": 5, "t": "res", "a": "j26", "b": "bn26", "v": 10000}, {"s": 6, "t": "box", "at": [300, 352], "w": 140, "h": 46, "lab": "\u2699\ufe0f DC motor RE140/1", "col": "#374151", "ly": 28, "pins": [{"n": "", "dx": 18, "dy": 0, "to": "j22", "c": "#ca8a04"}, {"n": "", "dx": 122, "dy": 0, "to": "j25", "c": "#ca8a04"}]}, {"s": 7, "t": "wire", "a": "h22", "b": "h44", "c": "#ea580c"}, {"s": 7, "t": "wire", "a": "i25", "b": "i47", "c": "#9333ea"}, {"s": 7, "t": "res", "a": "g44", "b": "g46", "v": 1000}, {"s": 7, "t": "led", "a": "f46", "b": "f47"}, {"s": 7, "t": "led", "a": "h47", "b": "h46", "rgb": "34,197,94"}, {"s": 8, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]}});


// ===== p25 layout (generated) =====
Object.assign(BBL,{"p25": {"power": 6, "parts": [{"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "wire", "a": "tp10", "b": "a10", "c": "#dc2626"}, {"s": 2, "t": "diode", "a": "c10", "b": "c14"}, {"s": 2, "t": "diode", "a": "d14", "b": "d18"}, {"s": 2, "t": "diode", "a": "c18", "b": "c22"}, {"s": 2, "t": "diode", "a": "d22", "b": "d26"}, {"s": 3, "t": "wire", "a": "b26", "b": "h26", "c": "#ea580c"}, {"s": 4, "t": "box", "at": [330, 352], "w": 140, "h": 46, "lab": "\u2699\ufe0f DC motor RE140/1", "col": "#374151", "ly": 28, "pins": [{"n": "", "dx": 18, "dy": 0, "to": "j26", "c": "#ca8a04"}, {"n": "", "dx": 122, "dy": 0, "to": "bn32", "c": "#111"}]}, {"s": 5, "t": "ecap", "a": "i27", "b": "bn28", "lab": "1000\u00b5"}, {"s": 5, "t": "wire", "a": "g26", "b": "g27", "c": "#ea580c"}, {"s": 6, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]}});

// ===== p26 layout (generated) =====
Object.assign(BBL,{"p26": {"power": 6, "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 1, "t": "chip", "col": 9, "n": 16, "lab": "CD4518"}, {"s": 1, "t": "wire", "a": "d9", "b": "tp9", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "j16", "b": "bn16", "c": "#111"}, {"s": 1, "t": "wire", "a": "j10", "b": "bp10", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "a16", "b": "tn16", "c": "#111"}, {"s": 1, "t": "wire", "a": "g14", "b": "b15", "c": "#ea580c"}, {"s": 1, "t": "wire", "a": "b10", "b": "h15", "c": "#9333ea"}, {"s": 1, "t": "res", "a": "i15", "b": "bn15", "v": 10000}, {"s": 1, "t": "btn", "col": 50}, {"s": 1, "t": "wire", "a": "tp50", "b": "a50", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "i52", "b": "j15", "c": "#9333ea"}, {"s": 1, "t": "chip", "col": 19, "n": 16, "lab": "CD4511"}, {"s": 1, "t": "wire", "a": "d19", "b": "tp19", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "j26", "b": "bn26", "c": "#111"}, {"s": 1, "t": "wire", "a": "j21", "b": "bp21", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "j22", "b": "bp22", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "j23", "b": "bn23", "c": "#111"}, {"s": 1, "t": "wire", "a": "a14", "b": "i25", "c": "#16a34a"}, {"s": 1, "t": "wire", "a": "a13", "b": "i19", "c": "#2563eb"}, {"s": 1, "t": "wire", "a": "c12", "b": "h20", "c": "#9333ea"}, {"s": 1, "t": "wire", "a": "b11", "b": "h24", "c": "#ea580c"}, {"s": 1, "t": "seg7", "col": 28, "show": "CNT", "place": 1}, {"s": 1, "t": "wire", "a": "j30", "b": "bn31", "c": "#111"}, {"s": 1, "t": "res", "a": "a20", "b": "a29", "v": 1000}, {"s": 1, "t": "res", "a": "b21", "b": "b28", "v": 1000}, {"s": 1, "t": "res", "a": "c22", "b": "c31", "v": 1000}, {"s": 1, "t": "res", "a": "d23", "b": "d32", "v": 1000}, {"s": 1, "t": "res", "a": "a24", "b": "g31", "v": 1000}, {"s": 1, "t": "res", "a": "a25", "b": "h29", "v": 1000}, {"s": 1, "t": "res", "a": "a26", "b": "i28", "v": 1000}, {"s": 1, "t": "chip", "col": 35, "n": 16, "lab": "CD4511"}, {"s": 1, "t": "wire", "a": "d35", "b": "tp35", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "j42", "b": "bn43", "c": "#111"}, {"s": 1, "t": "wire", "a": "j37", "b": "bp37", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "j38", "b": "bp38", "c": "#dc2626"}, {"s": 1, "t": "wire", "a": "j39", "b": "bn39", "c": "#111"}, {"s": 1, "t": "wire", "a": "i11", "b": "i41", "c": "#16a34a"}, {"s": 1, "t": "wire", "a": "i12", "b": "i35", "c": "#2563eb"}, {"s": 1, "t": "wire", "a": "i13", "b": "i36", "c": "#9333ea"}, {"s": 1, "t": "wire", "a": "h14", "b": "i40", "c": "#ea580c"}, {"s": 1, "t": "seg7", "col": 44, "show": "CNT", "place": 0}, {"s": 1, "t": "wire", "a": "j46", "b": "bn47", "c": "#111"}, {"s": 1, "t": "res", "a": "a36", "b": "a45", "v": 1000}, {"s": 1, "t": "res", "a": "b37", "b": "b44", "v": 1000}, {"s": 1, "t": "res", "a": "c38", "b": "c47", "v": 1000}, {"s": 1, "t": "res", "a": "d39", "b": "d48", "v": 1000}, {"s": 1, "t": "res", "a": "a40", "b": "g47", "v": 1000}, {"s": 1, "t": "res", "a": "a41", "b": "h45", "v": 1000}, {"s": 1, "t": "res", "a": "a42", "b": "i44", "v": 1000}, {"s": 2, "t": "chip", "col": 53, "n": 16, "lab": "CD4060"}, {"s": 2, "t": "wire", "a": "a53", "b": "tp53", "c": "#dc2626"}, {"s": 2, "t": "wire", "a": "j60", "b": "bn60", "c": "#111"}, {"s": 2, "t": "wire", "a": "a57", "b": "tn57", "c": "#111"}, {"s": 3, "t": "res", "a": "b58", "b": "b59", "v": 10000000}, {"s": 3, "t": "xtal", "a": "c58", "b": "c51"}, {"s": 3, "t": "res", "a": "d59", "b": "d51", "v": 100000}, {"s": 3, "t": "ccap", "a": "a58", "b": "tn58", "lab": "22p"}, {"s": 3, "t": "ccap", "a": "a51", "b": "tn51", "lab": "22p"}, {"s": 4, "t": "chip", "col": 2, "n": 14, "lab": "4013"}, {"s": 4, "t": "wire", "a": "d2", "b": "tp2", "c": "#dc2626"}, {"s": 4, "t": "wire", "a": "j8", "b": "bn8", "c": "#111"}, {"s": 4, "t": "wire", "a": "j5", "b": "bn5", "c": "#111"}, {"s": 4, "t": "wire", "a": "j7", "b": "bn7", "c": "#111"}, {"s": 4, "t": "wire", "a": "h3", "b": "h6", "c": "#ea580c"}, {"s": 4, "t": "wire", "a": "a5", "b": "tn5", "c": "#111"}, {"s": 4, "t": "wire", "a": "a6", "b": "tn6", "c": "#111"}, {"s": 4, "t": "wire", "a": "a7", "b": "tn7", "c": "#111"}, {"s": 4, "t": "wire", "a": "a8", "b": "tn8", "c": "#111"}, {"s": 5, "t": "wire", "a": "j55", "b": "i4", "c": "#9333ea"}, {"s": 5, "t": "wire", "a": "h2", "b": "h9", "c": "#ca8a04"}, {"s": 6, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]}});
// wire up final + live canvases
const BBV=[];
document.querySelectorAll('.cl-content section').forEach(sec=>{const id=sec.id;if(!BBL[id])return;const F=document.getElementById('bbF_'+id),S=document.getElementById('bbS_'+id);
  const boxes=[...sec.querySelectorAll('.wsteps input[type=checkbox]')];BBV.push({id,F,S,boxes});});
function drawBBs(t){BBV.forEach(v=>{if(vis('bbF_'+v.id))renderBB(v.id,v.F.getContext('2d'),null,t);if(vis('bbS_'+v.id)){const T=new Set();v.boxes.forEach((b,i)=>{if(b.checked)T.add(i+1);});renderBB(v.id,v.S.getContext('2d'),T,t);}});}


// ===== Dice without Arduino: interactive demos =====
const DD={};
const DD_GROUPS={p13:{cols:['centre','↘','↙','↔'],map:[[0],[1],[0,1],[1,2],[0,1,2],[1,2,3]]},
 p14:{cols:'abcdefg'.split(''),map:['bc','abdeg','abcdg','bcfg','acdfg','acdefg'].map(s=>s.split('').map(ch=>'abcdefg'.indexOf(ch)))},
 p15:{cols:['A (1)','B (2)','C (4)'],map:[[0],[1],[0,1],[2],[0,2],[1,2]]}};
['p13','p14','p15'].forEach(id=>{const b=$('ddb_'+id);if(!b)return;DD[id]={q:2,hold:false,acc:0,t:0,pulse:0};b.style.touchAction='none';b.style.userSelect='none';
  b.addEventListener('pointerdown',e=>{e.preventDefault();DD[id].hold=true;});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>DD[id].hold=false));});
function drawDD(id,dt){const S=DD[id],G=DD_GROUPS[id],ctx=cv('dd_'+id);S.t+=dt;if(S.hold){S.acc+=dt;S.pulse+=dt;if(S.acc>0.05){S.acc=0;S.q=(S.q+1)%6;}}
  // 555 + 4017 column
  ctx.fillStyle='#1f2937';ctx.fillRect(20,40,90,60);txt(ctx,'555',65,66,'#e2e8f0',14);txt(ctx,S.hold?'pulsing':'stopped',65,86,S.hold?'#10b981':'#94a3b8',11);
  if(S.hold){ctx.strokeStyle='#fbbf24';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=40;i++){const x=24+i*2,y=((i+Math.floor(S.t*40))%8<4)?112:124;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
  txt(ctx,'button: '+(S.hold?'HELD':'released'),65,150,S.hold?'#10b981':'#94a3b8',11);
  ctx.fillStyle='#1f2937';ctx.fillRect(140,30,80,240);txt(ctx,'CD4017',180,50,'#e2e8f0',12);
  const ry=i=>78+i*32;
  for(let i=0;i<6;i++){const on=i===S.q;ctx.fillStyle=on?'#fbbf24':'#334155';ctx.beginPath();ctx.arc(205,ry(i),6,0,7);ctx.fill();txt(ctx,'Q'+i,170,ry(i)+4,on?'#fbbf24':'#94a3b8',11);
    W(ctx,[[211,ry(i)],[250,ry(i)]],on?'#fbbf24':'#475569',on?3:1.5);}
  txt(ctx,'Q6 → reset',180,262,'#f87171',10);
  // matrix
  const n=G.cols.length,mx0=270,mw=id==='p14'?300:240,cw=mw/n;
  G.cols.forEach((name,j)=>{const x=mx0+cw*(j+0.5);const active=G.map[S.q].includes(j);W(ctx,[[x,64],[x,270]],active?'#10b981':'#475569',active?3:1.5);txt(ctx,name,x,56,active?'#10b981':'#94a3b8',11);});
  for(let i=0;i<6;i++){W(ctx,[[250,ry(i)],[mx0+mw,ry(i)]],i===S.q?'#fbbf24':'#334155',i===S.q?2:1);G.map[i].forEach(j=>{const x=mx0+cw*(j+0.5),y=ry(i),on=i===S.q;ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/2);
    ctx.fillStyle=on?'#fbbf24':'#0b1220';ctx.strokeStyle=on?'#fbbf24':'#94a3b8';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-6,-6);ctx.lineTo(6,0);ctx.lineTo(-6,6);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(6,-6);ctx.lineTo(6,6);ctx.stroke();ctx.restore();});}
  txt(ctx,id==='p13'?'11 diodes (↔ needs none: one output)':id==='p14'?'27 diodes = a tiny ROM':'9 diodes = binary encoder',mx0+mw/2,290,'#94a3b8',11);
  // result
  const rx=id==='p14'?600:540,face=S.q+1;
  if(id==='p13'){ctx.fillStyle='#f8fafc';ctx.beginPath();ctx.roundRect(rx+40,70,170,170,24);ctx.fill();
    const P={1:[[1,1]],2:[[0,0],[2,2]],3:[[0,0],[1,1],[2,2]],4:[[0,0],[2,0],[0,2],[2,2]],5:[[0,0],[2,0],[1,1],[0,2],[2,2]],6:[[0,0],[2,0],[0,1],[2,1],[0,2],[2,2]]}[face];
    for(let gx=0;gx<3;gx++)for(let gy=0;gy<3;gy++){const x=rx+75+gx*50,y=105+gy*50,on=P.some(([a,b])=>a===gx&&b===gy);if(on){glowAt(ctx,x,y,0.9,'239,68,68',26);}ctx.fillStyle=on?'#ef4444':'#e2e8f0';ctx.beginPath();ctx.arc(x,y,13,0,7);ctx.fill();ctx.strokeStyle='#cbd5e1';ctx.stroke();}
    txt(ctx,S.hold?'rolling…':'result: '+face,rx+125,270,S.hold?'#fbbf24':'#10b981',16);}
  else{if(id==='p15'){ctx.fillStyle='#1f2937';ctx.fillRect(rx,110,70,80);txt(ctx,'CD4511',rx+35,146,'#e2e8f0',11);txt(ctx,'bits '+[(face>>2)&1,(face>>1)&1,face&1].join(''),rx+35,166,'#fbbf24',11);W(ctx,[[rx-28,150],[rx,150]],'#10b981',3);}
    digitBig(ctx,id==='p15'?rx+100:rx+20,50,1.6,DIG7[face],true,false);
    txt(ctx,S.hold?'rolling…':'result: '+face,id==='p15'?rx+160:rx+80,270,S.hold?'#fbbf24':'#10b981',16);
    if(id==='p14')txt(ctx,'(segments via 2.2 kΩ)',rx+80,290,'#94a3b8',10);}}

let lastCC=performance.now();
function frameCC(now){const dt=Math.min(0.05,(now-lastCC)/1000);lastCC=now;CT+=dt;
  [['cp11',P11],['cp1',P1],['cp2',P2],['cp3',P3],['cp4',P4],['cp5',P5],['cp6',P6],['cp7',P7],['cp8',P8],['cp9',P9],['cp10',P10]].forEach(([id,f])=>{if(vis(id))f(dt);});
  if(vis('cdice'))drawDice(dt);['p13','p14','p15'].forEach(id=>{if(DD[id]&&vis('dd_'+id))drawDD(id,dt);});drawBBs(CT);drawBC(dt);drawLD(dt);requestAnimationFrame(frameCC);}
requestAnimationFrame(frameCC);
