// ===== Circuits page: shared code (loaded before projects/*.js) =====

let CT=0;
const cv=id=>{const c=$(id),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);return ctx;};
function boxChip(ctx,x,y,w,h,name,pins){__PR(ctx,{t:'chip',x,y,w,h});ctx.fillStyle=PAL.chip;ctx.fillRect(x,y,w,h);ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.strokeRect(x,y,w,h);txt(ctx,name,x+w/2,y+h/2+5,PAL.ink,13);
  (pins||[]).forEach(([n,px,py,al])=>txt(ctx,n,px,py,PAL.muted,10,al||'center'));}
const vis=id=>{const r=$(id).getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;};

// P1 LED brightness
function P1(){const ctx=cv('cp1'),vals=[220,470,1000,10000],k=Math.floor(CT/2.2)%4,R=vals[k],I=7/R*1000;
  part(ctx,'batt',80,60,80,200,{label:'9 V',left:true});wire(ctx,[[80,60],[220,60]]);part(ctx,'res',220,60,340,60,{label:fmtOhm(R),lc:Y});wire(ctx,[[340,60],[460,60],[460,95]]);
  part(ctx,'led',460,95,460,175,{glow:Math.min(1,Math.sqrt(I/20))});wire(ctx,[[460,175],[460,200],[80,200]]);dots(ctx,[[80,180],[80,60],[460,60],[460,200],[80,200]],CT*I*3);
  txt(ctx,'I = 7 V ÷ '+fmtOhm(R)+' = '+(I<10?I.toFixed(1):I.toFixed(0))+' mA',620,120,Y,15);txt(ctx,'(cycling through the 4 resistors)',620,145,PAL.muted,11);}
// P2 fade
const F2={vc:0};function P2(dt){const ctx=cv('cp2'),ph=CT%6,pressed=ph<1.5;F2.vc+=pressed?(1-F2.vc)*dt/0.05:-F2.vc*dt/1.5;
  part(ctx,'batt',80,60,80,210,{label:'9 V',left:true});wire(ctx,[[80,60],[150,60]]);part(ctx,'switch',150,60,230,60,{closed:pressed,label:'button'});wire(ctx,[[230,60],[480,60]]);
  part(ctx,'cap',320,60,320,210,{label:'1000 µF'});dot(ctx,320,60);dot(ctx,320,210);part(ctx,'res',480,60,480,120,{label:'470 Ω'});part(ctx,'led',480,130,480,200,{glow:F2.vc});wire(ctx,[[480,120],[480,130]]);wire(ctx,[[480,200],[480,210],[80,210]]);
  txt(ctx,pressed?'👆 button held: capacitor filling':'released: capacitor feeds the LED…',650,120,pressed?PAL.good:Y,13);
  ctx.fillStyle=PAL.raised;ctx.fillRect(250,100,12,70);ctx.fillStyle=PAL.blue;ctx.fillRect(250,100+70*(1-F2.vc),12,70*F2.vc);txt(ctx,'charge',256,186,PAL.blue,10);}
// P3 polarity tester
function P3(){const ctx=cv('cp3'),flip=Math.floor(CT/2.5)%2===1;
  part(ctx,'batt',80,flip?210:60,80,flip?60:210,{label:'9 V battery',left:true,flip});wire(ctx,[[80,60],[200,60]]);part(ctx,'res',200,60,300,60,{label:'1 kΩ'});wire(ctx,[[300,60],[480,60]]);
  wire(ctx,[[400,60],[400,95]]);part(ctx,'led',400,95,400,175,{glow:flip?0:1,label:'red',left:true});wire(ctx,[[400,175],[400,210]]);
  wire(ctx,[[480,60],[480,95]]);part(ctx,'led',480,175,480,95,{glow:flip?1:0,rgb:'34,197,94',label:'green'});wire(ctx,[[480,175],[480,210]]);
  wire(ctx,[[80,210],[480,210]]);dot(ctx,400,60);dot(ctx,400,210);txt(ctx,flip?'+ at the bottom: GREEN lights':'+ at the top: RED lights',660,130,flip?PAL.green:PAL.bad,14);}
// P4 traffic light
function P4(){const ctx=cv('cp4'),seq=[[1,0,0],[1,1,0],[0,0,1],[0,1,0]],s=seq[Math.floor(CT/1.8)%4],cols=['239,68,68','250,204,21','34,197,94'],nm=['red','yellow','green'];
  part(ctx,'batt',60,40,60,220,{label:'9 V',left:true});wire(ctx,[[60,40],[600,40]]);wire(ctx,[[60,220],[600,220]]);
  [0,1,2].forEach(i=>{const x=220+i*160;part(ctx,'switch',x,40,x,90,{closed:!!s[i]});part(ctx,'res',x,90,x,140,{label:'470 Ω'});part(ctx,'led',x,145,x,210,{glow:s[i],rgb:cols[i],label:nm[i]});wire(ctx,[[x,140],[x,145]]);wire(ctx,[[x,210],[x,220]]);dot(ctx,x,40);dot(ctx,x,220);});
  txt(ctx,'one resistor per LED',700,130,PAL.muted,12);}
// P5 touch switch
function P5(){const ctx=cv('cp5'),touch=(CT%4)<2;
  wire(ctx,[[60,30],[700,30]],PAL.redSoft);txt(ctx,'+9 V',56,34,PAL.redSoft,11,'right');wire(ctx,[[60,230],[700,230]],PAL.blue);txt(ctx,'0 V',56,234,PAL.blue,11,'right');
  part(ctx,'res',150,30,150,90,{label:'1 kΩ'});ctx.fillStyle='#d4af37';ctx.fillRect(140,92,20,10);ctx.fillRect(140,122,20,10);txt(ctx,'touch pads',120,116,'#d4af37',11,'right');
  if(touch)txt(ctx,'☝️',178,122,PAL.white,26);if(touch)__PR(ctx,{t:'part',k:'res',a:[150,90],b:[150,132],o:{label:'500 kΩ'}});wire(ctx,[[150,132],[150,160],[256,160]]);npnQ(ctx,290,160,touch);wire(ctx,[[300,194],[300,200],[356,200]]);npnQ(ctx,390,200,touch);wire(ctx,[[400,234],[400,230]]);
  wire(ctx,[[300,126],[300,110],[520,110]]);wire(ctx,[[400,110],[400,166]]);part(ctx,'res',520,30,520,72,{label:'470 Ω'});part(ctx,'led',520,72,520,110,{glow:touch?1:0});
  txt(ctx,touch?'finger on the pads: LED ON':'no touch: off',590,120,touch?PAL.good:PAL.muted,14);txt(ctx,'gain ≈ 200 × 200 = 40,000',590,145,PAL.muted,11);}
// P6 coil kick
function P6(){const ctx=cv('cp6'),ph=CT%4,on=ph<2,flash=ph>=2&&ph<2.25?1-(ph-2)/0.25:0;
  part(ctx,'batt',80,60,80,210,{label:'9 V',left:true});wire(ctx,[[80,60],[160,60]]);part(ctx,'switch',160,60,240,60,{closed:on,label:'button'});wire(ctx,[[240,60],[400,60],[400,90]]);
  part(ctx,'coil',400,90,400,180,{core:true,label:'coil'});wire(ctx,[[400,180],[400,210],[80,210]]);
  wire(ctx,[[400,75],[500,75],[500,95]]);part(ctx,'led',500,175,500,95,{glow:flash,label:'LED (backwards)'});wire(ctx,[[500,175],[500,195],[400,195]]);
  txt(ctx,on?'pressed: current builds up in the coil':flash>0?'released: FLASH! the kick lights the LED':'released',300,238,flash>0?Y:PAL.muted,13);}
// P7 relay clicker
function P7(){const ctx=cv('cp7'),on=(CT%3)<1.5;
  wire(ctx,[[60,30],[360,30]],PAL.redSoft);txt(ctx,'+5 V',56,34,PAL.redSoft,11,'right');part(ctx,'switch',100,30,100,90,{closed:on,label:'button'});part(ctx,'res',100,90,100,150,{label:'1 kΩ'});wire(ctx,[[100,150],[100,170],[226,170]]);
  txt(ctx,'0 V',56,234,PAL.blue,11,'right');
  npnQ(ctx,260,170,on);part(ctx,'coil',270,30,270,136,{label:'coil',left:true});wire(ctx,[[270,204],[270,230],[60,230]],PAL.blue);
  wire(ctx,[[270,40],[330,40],[330,60]]);part(ctx,'diode',330,120,330,60,{col:PAL.good});wire(ctx,[[330,120],[330,128],[270,128]]);
  // contacts
  ctx.setLineDash([4,4]);ctx.strokeStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(290,85);ctx.lineTo(450,110);ctx.stroke();ctx.setLineDash([]);
  wire(ctx,[[450,110],[450,200]],PAL.violet);txt(ctx,'COM',440,210,PAL.muted,10);ctx.fillStyle=PAL.ink2;ctx.save();ctx.translate(450,110);ctx.rotate(on?0.3:-0.3);ctx.fillRect(0,-2,60,4);ctx.restore();
  wire(ctx,[[512,90],[600,90]],PAL.violet);wire(ctx,[[512,130],[600,130]],PAL.violet);txt(ctx,'NC',520,82,PAL.redLight,10);txt(ctx,'NO',520,146,PAL.greenLight,10);
  part(ctx,'led',600,90,700,90,{glow:on?0:1});part(ctx,'led',600,130,700,130,{glow:on?1:0,rgb:'34,197,94'});wire(ctx,[[700,90],[740,90],[740,200],[450,200]],PAL.violet);wire(ctx,[[700,130],[740,130]],PAL.violet);
  txt(ctx,on?'click → green':'rest → red',620,230,on?PAL.green:PAL.bad,13);}
// P8 555
function P8(){const ctx=cv('cp8'),on=(CT%1)<0.55;
  wire(ctx,[[60,30],[620,30]],PAL.redSoft);wire(ctx,[[60,235],[620,235]],PAL.blue);txt(ctx,'+9 V',56,34,PAL.redSoft,11,'right');txt(ctx,'0 V',56,239,PAL.blue,11,'right');
  __PR(ctx,{t:'chip',x:300,y:85,w:120,h:130});ctx.fillStyle=PAL.chip;ctx.fillRect(300,85,120,130);ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.strokeRect(300,85,120,130);txt(ctx,'NE555',360,155,PAL.ink,14);
  [['8',320,99],['4',345,99],['7',306,124,'left'],['6',306,184,'left'],['2',306,204,'left'],['3',414,154,'right'],['1',360,211]].forEach(([n,x,y,a])=>txt(ctx,n,x,y,PAL.muted,10,a||'center'));
  wire(ctx,[[320,30],[320,85]]);wire(ctx,[[345,30],[345,85]]);
  part(ctx,'res',180,30,180,120,{label:'R1 1k',left:true});dot(ctx,180,120);wire(ctx,[[180,120],[300,120]]);
  part(ctx,'res',180,120,180,180,{label:'R2 47k',left:true});dot(ctx,180,180);wire(ctx,[[180,180],[300,180]]);wire(ctx,[[180,180],[180,200],[300,200]]);
  part(ctx,'cap',180,200,180,235,{label:'10 µF',left:true});wire(ctx,[[360,215],[360,235]]);
  wire(ctx,[[420,150],[460,150]]);part(ctx,'res',460,150,540,150,{label:'470 Ω'});wire(ctx,[[540,150],[570,150],[570,160]]);part(ctx,'led',570,160,570,225,{glow:on?1:0});wire(ctx,[[570,225],[570,235]]);
  txt(ctx,'≈ 1.5 blinks/s',700,130,Y,14);}
// P9 chaser
function P9(){const ctx=cv('cp9'),q=Math.floor(CT*4)%10;boxChip(ctx,40,90,90,80,'555');boxChip(ctx,220,70,120,120,'CD4017');
  wire(ctx,[[130,130],[220,130]],Y);txt(ctx,'clock (pin 3 → 14)',175,120,Y,10);
  for(let i=0;i<10;i++){const x=400+i*38,y=130;W(ctx,[[340,80+i*11],[360,80+i*11],[x,y-14]],PAL.slate,1.5);glowAt(ctx,x,y,i===q?1:0);ctx.fillStyle=i===q?PAL.bad:'#3f1d1d';ctx.beginPath();ctx.arc(x,y,12,0,7);ctx.fill();txt(ctx,'Q'+i,x,y+30,PAL.muted,10);}
  txt(ctx,'each clock pulse → the next LED',585,200,PAL.muted,12);}
// P10 mini amp
function P10(){const ctx=cv('cp10'),w=Math.sin(CT*12)*0.5+Math.sin(CT*31)*0.3;
  txt(ctx,'🎸 / 📱',50,135,PAL.white,18);wire(ctx,[[80,130],[150,130]]);part(ctx,'pot',150,130,230,130,{label:'volume 10k'});wire(ctx,[[230,130],[300,130]]);
  boxChip(ctx,300,80,120,110,'LM386',[['3',296,134,'right'],['5',424,134,'left'],['6',360,76],['4',360,204]]);wire(ctx,[[360,30],[360,80]],PAL.redSoft);wire(ctx,[[360,190],[360,230]],PAL.blue);txt(ctx,'+9 V',372,40,PAL.redSoft,11,'left');
  wire(ctx,[[420,130],[470,130]]);part(ctx,'cap',470,130,550,130,{label:'220 µF'});wire(ctx,[[550,130],[600,130]]);
  ctx.fillStyle=PAL.ink2;ctx.fillRect(600,115,14,30);ctx.beginPath();ctx.moveTo(614,115);ctx.lineTo(640+w*4,95);ctx.lineTo(640+w*4,165);ctx.lineTo(614,145);ctx.fill();
  ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.globalAlpha=0.7-i*0.2;ctx.beginPath();ctx.arc(650,130,20+i*16+(CT*30)%16,-0.6,0.6);ctx.stroke();}ctx.globalAlpha=1;
  wire(ctx,[[607,145],[607,230],[60,230]],PAL.blue);txt(ctx,'8 Ω',580,170,PAL.muted,11);}


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
function buzzerSym(ctx,x,y,active,vib){ctx.save();ctx.translate(x,y);ctx.fillStyle=PAL.chipDark;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,0,26,0,7);ctx.fill();ctx.stroke();
  ctx.strokeStyle=active?PAL.yellow:PAL.muted;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,14+vib*3,0,7);ctx.stroke();
  txt(ctx,active?'ACT':'PZ',0,4,PAL.muted,9);ctx.restore();}
function P11(dt){const ctx=cv('cp11'),m=bzMode(),f=BZ.type===0?2400:bzFreq();$('bzFt').textContent=BZ.type===0&&BZ.drv!==2?'fixed ~2.4 kHz':Math.round(bzFreq())+' Hz';
  if(BZ.osc&&m.mode==='pattern'){const on=(CT%0.6)<0.3;BZ.g.gain.value=on?0.05:0;}
  else if(BZ.osc)BZ.g.gain.value=0.05;
  const sounding=m.mode==='tone'||(m.mode==='pattern'&&(CT%0.6)<0.3),clickNow=CT-BZ.clickT<0.12;BZ.ph+=dt*(sounding?40:0);
  const T=50,B=250;
  if(BZ.drv===0){part(ctx,'batt',70,T,70,B,{label:'9 V',left:true});wire(ctx,[[70,T],[160,T]]);part(ctx,'switch',160,T,240,T,{closed:BZ.pressed,label:'button'});wire(ctx,[[240,T],[330,T],[330,124]]);wire(ctx,[[330,176],[330,B],[70,B]]);
    txt(ctx,'+',345,120,PAL.redSoft,13);}
  else if(BZ.drv===1){wire(ctx,[[40,T],[400,T]],PAL.redSoft);wire(ctx,[[40,B],[400,B]],PAL.blue);txt(ctx,'+9 V',36,T+4,PAL.redSoft,11,'right');txt(ctx,'0 V',36,B+4,PAL.blue,11,'right');
    __PR(ctx,{t:'chip',x:90,y:95,w:100,h:110});ctx.fillStyle=PAL.chip;ctx.fillRect(90,95,100,110);ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.strokeRect(90,95,100,110);txt(ctx,'NE555',140,148,PAL.ink,13);txt(ctx,BZ.type?'tone':'beep pattern',140,166,PAL.muted,10);
    wire(ctx,[[140,T],[140,95]]);wire(ctx,[[140,205],[140,B]]);part(ctx,'switch',60,T,60,B,{closed:BZ.pressed});
    wire(ctx,[[190,150],[230,150]]);part(ctx,'cap',230,150,290,150,{label:'10 µF'});wire(ctx,[[290,150],[330,150],[330,124]]);wire(ctx,[[330,176],[330,B]]);txt(ctx,'pin 3',196,142,PAL.muted,10,'left');}
  else{ctx.fillStyle='#0e7490';ctx.fillRect(60,90,120,120);txt(ctx,'Arduino',120,140,PAL.white,14);txt(ctx,BZ.type?'tone(8, f)':'digitalWrite(8,HIGH)',120,160,'#cffafe',10);
    wire(ctx,[[180,130],[220,130]]);part(ctx,'res',220,130,290,130,{label:'100 Ω'});wire(ctx,[[290,130],[330,130],[330,124]]);wire(ctx,[[330,176],[330,B],[120,B],[120,210]],PAL.blue);txt(ctx,'pin 8',186,122,PAL.muted,10,'left');txt(ctx,'GND',126,226,PAL.blue,10,'left');}
  const vib=sounding?Math.sin(BZ.ph*6):clickNow?1:0;buzzerSym(ctx,330,150,BZ.type===0,vib);
  // sound waves
  if(sounding||clickNow){ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;for(let i=0;i<4;i++){const r=(clickNow&&!sounding)?20+i*10:24+i*16+((BZ.ph*4)%16);ctx.globalAlpha=clickNow&&!sounding?0.6-i*0.15:0.7-i*0.15;ctx.beginPath();ctx.arc(330,150,r+20,-0.6,0.6);ctx.stroke();}ctx.globalAlpha=1;}
  // signal graph
  const gx=470,gw=310;ctx.fillStyle=PAL.raised;ctx.fillRect(gx,40,gw,90);txt(ctx,'push on the buzzer',gx+4,34,PAL.muted,11,'left');
  ctx.strokeStyle=Y;ctx.lineWidth=2;ctx.beginPath();const show=BZ.type===0?40:Math.min(40,f/60);
  for(let px=0;px<=gw;px++){let v=0;if(BZ.pressed){if(BZ.drv===0)v=1;else{const ph=(px/gw*show)%1;v=ph<0.5?1:0;if(BZ.type===0&&BZ.drv===1)v=1;}}const yy=120-v*70;px?ctx.lineTo(gx+px,yy):ctx.moveTo(gx+px,yy);}ctx.stroke();
  let msg,col;
  if(!BZ.pressed){msg='Hold the button…';col=PAL.muted;}
  else if(m.mode==='click'){msg='Steady DC on a passive buzzer: just a click, no tone ✗';col=Y;}
  else if(m.mode==='pattern'){msg='Active buzzer switched on/off by the 555: beep… beep…';col=PAL.good;}
  else if(BZ.type===0){msg='Active buzzer: its own oscillator beeps at a fixed pitch ✓';col=PAL.good;}
  else{msg='Passive buzzer plays the square wave: '+Math.round(f)+' Hz ✓';col=PAL.good;}
  wrapText(ctx,msg,gx,170,gw,20,col,14);
  if(BZ.type===0&&BZ.drv===0)txt(ctx,'(steady DC in, the buzzer makes the wave inside)',gx,235,PAL.muted,11,'left');}

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
  ctx.fillStyle=PAL.slate;ctx.fillRect(20,120,60,40);txt(ctx,'USB 5 V',50,145,PAL.white,12);wire(ctx,[[80,130],[120,130]],PAL.redSoft);wire(ctx,[[80,150],[120,150]],PAL.blue);
  ctx.fillStyle='#1d4ed8';ctx.fillRect(120,95,150,90);ctx.strokeStyle=PAL.link;ctx.lineWidth=1.5;ctx.strokeRect(120,95,150,90);txt(ctx,'TP4056 + protection',195,125,'#e0e7ff',11);
  const red=BC.on&&!BC.done,blue=BC.on&&BC.done;glowAt(ctx,165,160,red?0.9:0,'239,68,68',20);glowAt(ctx,225,160,blue?0.9:0,'59,130,246',20);
  ctx.fillStyle=red?PAL.bad:'#3f1d1d';ctx.beginPath();ctx.arc(165,160,6,0,7);ctx.fill();ctx.fillStyle=blue?PAL.water:'#1e2a4a';ctx.beginPath();ctx.arc(225,160,6,0,7);ctx.fill();
  txt(ctx,'charging',165,178,PAL.muted,9);txt(ctx,'full',225,178,PAL.muted,9);
  wire(ctx,[[270,120],[320,120]],PAL.redSoft);wire(ctx,[[270,160],[320,160]],PAL.blue);txt(ctx,'B+',290,112,PAL.muted,10);txt(ctx,'B−',290,176,PAL.muted,10);
  // 18650
  const bx=320,by=90,bw=150,bh=100;ctx.fillStyle='#0f766e';ctx.beginPath();ctx.roundRect(bx,by,bw,bh,14);ctx.fill();ctx.fillStyle=PAL.muted;ctx.fillRect(bx+bw,by+35,8,30);
  ctx.fillStyle='#134e4a';ctx.fillRect(bx+12,by+14,bw-24,bh-28);ctx.fillStyle=BC.s>0.2?PAL.green:PAL.amber;ctx.fillRect(bx+12,by+14,(bw-24)*BC.s,bh-28);
  txt(ctx,Math.round(BC.s*100)+'%',bx+bw/2,by+bh/2+6,PAL.white,18);txt(ctx,'18650 · 2500 mAh',bx+bw/2,by+bh+18,PAL.muted,11);
  const ph={idle:['not charging',PAL.muted],CC:['Phase 1: constant CURRENT',PAL.yellow],CV:['Phase 2: constant VOLTAGE (4.2 V)',PAL.blue],done:['Done: charger stopped',PAL.good]}[r.phase];
  txt(ctx,ph[0],245,40,ph[1],15);txt(ctx,BC.on&&!BC.done?r.V.toFixed(2)+' V · '+(r.I*1000).toFixed(0)+' mA':'',245,62,PAL.ink,13);
  txt(ctx,'elapsed: '+Math.floor(BC.t/60)+' h '+String(Math.floor(BC.t%60)).padStart(2,'0')+' min',245,250,PAL.muted,12);
  // graphs vs time
  const tmax=Math.max(60,2.5/BC.Iset*60*1.25),gx=520,gw=260;
  const g=(y,h,k,min,max,col,l)=>{ctx.fillStyle=PAL.raised;ctx.fillRect(gx,y,gw,h);txt(ctx,l,gx+4,y-6,col,11,'left');ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();BC.h.forEach((p,i)=>{const x=gx+p.t/tmax*gw,yy=y+h-(p[k]-min)/(max-min)*h;i?ctx.lineTo(x,yy):ctx.moveTo(x,yy);});ctx.stroke();};
  g(30,110,'V',2.9,4.3,PAL.blue,'battery voltage (3.0 → 4.2 V)');g(180,110,'I',0,1.1,Y,'charge current');
  const y42=30+110-(4.2-2.9)/1.4*110;ctx.setLineDash([4,4]);ctx.strokeStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(gx,y42);ctx.lineTo(gx+gw,y42);ctx.stroke();ctx.setLineDash([]);txt(ctx,'4.2 V',gx+gw+4,y42+4,PAL.muted,10,'left');
  txt(ctx,'time → ('+Math.round(tmax/60*10)/10+' h)',gx+gw,310,PAL.muted,10,'right');}

// ===== Real life B: light detector → relay → lamp =====
const LDT={on:false,auto:false,t:0,click:0};
$('ldAuto').onclick=()=>{LDT.auto=!LDT.auto;LDT.t=0;$('ldAuto').textContent=LDT.auto?'⏸ Stop':'🌅 Run a day';};
function drawLD(dt){if(LDT.auto){LDT.t+=dt;$('ldL').value=(0.5+0.5*Math.cos(LDT.t*0.35)).toFixed(3);}
  const L=+$('ldL').value,Th=+$('ldT').value,ldr=1000*Math.pow(200,1-L),Vn=12*ldr/(10000+ldr);
  const was=LDT.on;if(!LDT.on&&Vn>Th+0.3)LDT.on=true;else if(LDT.on&&Vn<Th-0.3)LDT.on=false;if(was!==LDT.on)LDT.click=0.5;LDT.click=Math.max(0,LDT.click-dt);
  const ctx=cv('cLight');
  ctx.fillStyle=`rgb(${Math.round(10+60*L)},${Math.round(15+110*L)},${Math.round(40+150*L)})`;ctx.fillRect(640,0,160,340);txt(ctx,L>0.45?'☀️':'🌙',720,70,PAL.white,36);
  wire(ctx,[[40,30],[620,30]],PAL.redSoft);txt(ctx,'+12 V',36,34,PAL.redSoft,11,'right');wire(ctx,[[40,300],[620,300]],PAL.blue);txt(ctx,'0 V',36,304,PAL.blue,11,'right');
  part(ctx,'res',90,30,90,140,{label:'10 kΩ',left:true});part(ctx,'ldr',90,140,90,300,{label:'LDR '+(ldr>=1000?(ldr/1000).toFixed(ldr<1e4?1:0)+'k':Math.round(ldr)),left:true});dot(ctx,90,140);
  part(ctx,'pot',170,30,170,300,{});txt(ctx,'threshold',178,100,Y,11,'left');dot(ctx,170,165);
  // opamp
  const ox=230,oy=150;ctx.strokeStyle=LDT.on?PAL.good:WIRE;ctx.lineWidth=2.5;ctx.fillStyle=BG;ctx.beginPath();ctx.moveTo(ox,oy-40);ctx.lineTo(ox+70,oy);ctx.lineTo(ox,oy+40);ctx.closePath();ctx.fill();ctx.stroke();
  txt(ctx,'+',ox+10,oy-14,PAL.redSoft,14,'left');txt(ctx,'−',ox+10,oy+22,PAL.blue,14,'left');txt(ctx,'LM358',ox+28,oy+4,PAL.muted,9);
  wire(ctx,[[90,140],[120,140],[120,132],[ox,132]]);wire(ctx,[[170,165],[200,165],[200,168],[ox,168]]);
  wire(ctx,[[ox+70,oy],[320,oy]]);part(ctx,'res',320,oy,380,oy,{label:'1 kΩ'});wire(ctx,[[380,oy],[396,oy]]);npnQ(ctx,430,oy,LDT.on);wire(ctx,[[440,oy+34],[440,300]]);
  part(ctx,'coil',440,30,440,oy-34,{label:'relay',left:true});wire(ctx,[[440,40],[490,40],[490,55]]);part(ctx,'diode',490,100,490,55,{col:PAL.good});wire(ctx,[[490,100],[490,110],[440,110]]);
  // contact + lamp
  ctx.setLineDash([4,4]);ctx.strokeStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(458,80);ctx.lineTo(540,180);ctx.stroke();ctx.setLineDash([]);
  wire(ctx,[[540,30],[540,180]],PAL.violet);ctx.fillStyle=PAL.ink2;ctx.save();ctx.translate(540,180);ctx.rotate(LDT.on?0.5:0.05);ctx.fillRect(0,-2,40,4);ctx.restore();
  wire(ctx,[[575,200],[600,200],[600,215]],PAL.violet);part(ctx,'lamp',600,215,600,275,{glow:LDT.on?1:0});wire(ctx,[[600,275],[600,300]],PAL.violet);txt(ctx,'12 V lamp',606,292,PAL.muted,10,'left');
  if(LDT.click>0)txt(ctx,'CLICK',520,150,Y,14);
  // comparison gauge
  const gx=250,gy=250,gw=180;ctx.fillStyle=PAL.raised;ctx.fillRect(gx,gy,gw,12);const X=v=>gx+v/12*gw;
  ctx.fillStyle='rgba(251,191,36,.3)';ctx.fillRect(X(Th-0.3),gy-4,X(Th+0.3)-X(Th-0.3),20);ctx.fillStyle=Y;ctx.fillRect(X(Th)-1,gy-6,2,24);
  ctx.fillStyle=PAL.blue;ctx.beginPath();ctx.arc(X(Vn),gy+6,7,0,7);ctx.fill();
  txt(ctx,'sensor '+Vn.toFixed(1)+' V vs threshold '+Th.toFixed(1)+' V',gx+gw/2,gy-12,PAL.ink,11);txt(ctx,'(yellow band = hysteresis)',gx+gw/2,gy+30,PAL.muted,10);
  txt(ctx,LDT.on?'DARK: lamp ON':'BRIGHT: lamp off',720,140,PAL.white,14);}


// ===== Circuit menu: show only the selected project =====
sectionMenu('circuits-menu',{first:'cintro'});

// ===== 7-segment drawing (same as the Real parts page) =====
const GEO7={a:['h',10,50,6],g:['h',10,50,55],d:['h',10,50,104],f:['v',6,10,51],b:['v',54,10,51],e:['v',6,59,100],c:['v',54,59,100]};
function seg7(ctx,k){const [t,p1,p2,p3]=GEO7[k];ctx.beginPath();
  if(t==='h'){ctx.moveTo(p1,p3);ctx.lineTo(p1+5,p3-5);ctx.lineTo(p2-5,p3-5);ctx.lineTo(p2,p3);ctx.lineTo(p2-5,p3+5);ctx.lineTo(p1+5,p3+5);}
  else{ctx.moveTo(p1,p2);ctx.lineTo(p1+5,p2+5);ctx.lineTo(p1+5,p3-5);ctx.lineTo(p1,p3);ctx.lineTo(p1-5,p3-5);ctx.lineTo(p1-5,p2+5);}ctx.closePath();}
function digitBig(ctx,x,y,s,segs,on,dp){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#111';ctx.fillRect(-10,-8,90,126);
  Object.keys(GEO7).concat(['dp']).forEach(k=>{const lit=on&&(k==='dp'?dp:segs.includes(k));ctx.shadowBlur=lit?14:0;ctx.shadowColor=PAL.bad;ctx.fillStyle=lit?PAL.bad:'#2a1416';
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
  digitBig(ctx,130,30,1.7,d1===null?'':DIGITS[d1],show(0),DC.rolling);digitBig(ctx,300,30,1.7,DIGITS[d2],show(1),DC.rolling);
  txt(ctx,'display 1',190,262,PAL.muted,11);txt(ctx,'display 2',360,262,PAL.muted,11);
  npnQ(ctx,180,300,show(0));npnQ(ctx,350,300,show(1));txt(ctx,'D10',140,304,PAL.muted,10,'right');txt(ctx,'D11',310,304,PAL.muted,10,'right');
  if(slow)txt(ctx,'only display '+(act+1)+' is ON right now',275,22,Y,13);
  const rx=520;txt(ctx,DC.rolling?'rolling…':DC.mode===2?'total':'result',rx+130,70,PAL.muted,13);
  txt(ctx,DC.rolling?'🎲 🎲':DC.mode===0?DC.v[0]+' + '+DC.v[1]+' = '+sum:DC.mode===1?String(DC.v[1]):String(sum),rx+130,120,DC.rolling?Y:PAL.good,DC.rolling?30:34);
  if(!DC.rolling&&DC.mode===0&&DC.v[0]===DC.v[1])txt(ctx,'Doubles! 🎉',rx+130,160,Y,16);
  txt(ctx,slow?'4 ms per display, slowed down ×100':'each display ON 4 ms, then the other',rx+130,215,PAL.muted,12);
  txt(ctx,'→ ~125 swaps per second: looks steady',rx+130,235,PAL.muted,12);}

// ===== 12. Schematic =====
function drawP12(){const ctx=cv('cp12');const ay=[120,136,152,168,184,200,216,232],segs=['a','b','c','d','e','f','g','dp'],pins=[7,6,4,2,1,9,10,5];
  ctx.fillStyle='#0e7490';ctx.fillRect(30,30,120,320);txt(ctx,'Arduino',90,60,PAL.white,15);txt(ctx,'Uno / ONE-C',90,78,'#cffafe',10);
  ay.forEach((y,i)=>{txt(ctx,'D'+(i+2),146,y+4,'#cffafe',10,'right');W(ctx,[[150,y],[190,y]],PAL.ink2,2);ctx.fillStyle=BG;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=1.5;ctx.fillRect(190,y-5,34,10);ctx.strokeRect(190,y-5,34,10);
    W(ctx,[[224,y],[700,y]],PAL.redSoft,2);txt(ctx,segs[i],300,y-3,PAL.redLight,10);});
  txt(ctx,'8 × 330 Ω',207,108,PAL.ink,11);
  [[400,'display 1',270,'D10'],[580,'display 2',300,'D11']].forEach(([dx,l,ry,dn],k)=>{
    ctx.fillStyle='#1a1a1a';ctx.fillRect(dx,8,110,84);ctx.strokeStyle=PAL.slate;ctx.strokeRect(dx,8,110,84);
    digitBig(ctx,dx+8,14,0.6,DIGITS[k?5:3],true,false);txt(ctx,l,dx+80,40,PAL.muted,10);txt(ctx,'SC39-11',dx+80,54,PAL.muted,9);
    ay.forEach((y,i)=>{const x=dx+8+i*11;W(ctx,[[x,92],[x,y]],PAL.muted,1.2);dot(ctx,x,y);txt(ctx,String(pins[i]),x,103,PAL.muted2,8);});
    const cx=dx+100;W(ctx,[[cx,92],[cx,251]],PAL.blue,2);txt(ctx,'COM',cx+4,104,PAL.blue,9,'left');
    npnQ(ctx,cx-10,285,true);W(ctx,[[cx,319],[cx,365]],PAL.blue,2);
    // base drive
    txt(ctx,dn,146,ry+4,'#cffafe',10,'right');
    if(!k){W(ctx,[[150,ry],[250,ry]],PAL.ink2,2);ctx.fillStyle=BG;ctx.fillRect(250,ry-5,34,10);ctx.strokeRect(250,ry-5,34,10);W(ctx,[[284,ry],[cx-54,ry],[cx-54,285],[cx-44,285]],PAL.ink2,2);}
    else{W(ctx,[[150,ry],[330,ry]],PAL.ink2,2);ctx.fillStyle=BG;ctx.fillRect(330,ry-5,34,10);ctx.strokeRect(330,ry-5,34,10);W(ctx,[[364,ry],[380,ry],[380,345],[cx-54,345],[cx-54,285],[cx-44,285]],PAL.ink2,2);}
  });
  txt(ctx,'1 kΩ',267,262,PAL.ink,10);txt(ctx,'1 kΩ',347,292,PAL.ink,10);
  W(ctx,[[90,350],[90,365],[700,365]],PAL.blue,2);txt(ctx,'GND',710,369,PAL.blue,11,'left');
  txt(ctx,'D12',146,334,'#cffafe',10,'right');W(ctx,[[150,330],[175,330]],PAL.ink2,2);part(ctx,'switch',175,330,245,330,{});W(ctx,[[245,330],[245,365]],PAL.ink2,2);dot(ctx,245,365);txt(ctx,'button',210,355,PAL.muted,10);}
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
function drawBoard(ctx){ctx.fillStyle=PAL.grayLight;ctx.beginPath();ctx.roundRect(22,98,BB.W-44,232,8);ctx.fill();
  ctx.fillStyle='#d1d5db';ctx.fillRect(28,206,BB.W-56,14);
  [['tp',PAL.bad,-7],['tn',PAL.water,7],['bp',PAL.bad,-7],['bn',PAL.water,7]].forEach(([r,c,o])=>{ctx.strokeStyle=c;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(30,BB.rows[r]+o);ctx.lineTo(BB.W-30,BB.rows[r]+o);ctx.stroke();});
  ctx.fillStyle=PAL.gray;for(let c=1;c<=60;c++){const x=BB.x0+(c-1)*BB.dx;Object.entries(BB.rows).forEach(([r,y])=>{if(r.length===2&&c%6===0)return;ctx.fillRect(x-1.8,y-1.8,3.6,3.6);});}
  ctx.fillStyle=PAL.muted2;ctx.font='600 8px system-ui';ctx.textAlign='center';for(let c=1;c<=60;c+=(c===1?4:5)){ctx.fillText(String(c),BB.x0+(c-1)*BB.dx,140);}
  ctx.textAlign='right';'abcdefghij'.split('').forEach(r=>ctx.fillText(r,31,BB.rows[r]+3));
  ctx.fillStyle=PAL.bad;ctx.font='700 10px system-ui';ctx.fillText('+',30,BB.rows.tp+4);ctx.fillText('+',30,BB.rows.bp+4);ctx.fillStyle=PAL.water;ctx.fillText('−',30,BB.rows.tn+4);ctx.fillText('−',30,BB.rows.bn+4);}
const RCOL=['#111','#7c3f12',PAL.redDark,PAL.orange,PAL.yellowSoft,PAL.greenDark,PAL.blueDark,'#7c3aed',PAL.gray,'#f8fafc'];
function bands(v){const n=Math.round(v);if(!n)return null;const s=String(n);const d1=+s[0],d2=s.length>1?+s[1]:0,m=s.length-2;return [RCOL[d1],RCOL[d2],RCOL[Math.max(0,m)]||'#111','#d4af37'];}
function pin(ctx,x,y){ctx.fillStyle=PAL.slate;ctx.beginPath();ctx.arc(x,y,2.6,0,7);ctx.fill();}
function leg(ctx,a,b){ctx.strokeStyle=PAL.gray;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
function partOn(ctx,p,lit,T){const A=p.a?HP(p.a):null,B=p.b?HP(p.b):null;
  switch(p.t){
  case 'wire':{const d=Math.hypot(B[0]-A[0],B[1]-A[1]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-Math.min(34,8+d*0.18);
    ctx.strokeStyle=p.c||PAL.greenDark;ctx.lineWidth=3.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.quadraticCurveTo(mx,my,B[0],B[1]);ctx.stroke();ctx.lineCap='butt';
    if(!p.freeA)pin(ctx,A[0],A[1]);if(!p.freeB)pin(ctx,B[0],B[1]);if(p.lab){txt(ctx,p.lab,B[0],B[1]+16,PAL.ink,11);}break;}
  case 'res':{const d=Math.hypot(B[0]-A[0],B[1]-A[1]);const bs=bands(p.v);
    if(d<34){const cx=A[0],cy=A[1]-16;leg(ctx,A,[cx,cy]);ctx.strokeStyle=PAL.gray;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(cx,cy-9);ctx.quadraticCurveTo(cx+4,cy-20,B[0],B[1]);ctx.stroke();
      ctx.save();ctx.translate(cx,cy);ctx.fillStyle='#e7c99a';ctx.beginPath();ctx.roundRect(-4.5,-11,9,20,4);ctx.fill();if(bs)bs.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(-4.5,-8+i*4.5,9,2.4);});ctx.restore();}
    else{leg(ctx,A,B);const ang=Math.atan2(B[1]-A[1],B[0]-A[0]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;ctx.save();ctx.translate(mx,my);ctx.rotate(ang);ctx.fillStyle='#e7c99a';ctx.beginPath();ctx.roundRect(-13,-4.5,26,9,4);ctx.fill();
      if(bs)bs.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(-9+i*5.2,-4.5,2.6,9);});ctx.restore();}
    pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);if(p.lab)txt(ctx,p.lab,(A[0]+B[0])/2,Math.min(A[1],B[1])-(d<34?32:9),PAL.slateDark,8);break;}
  case 'led':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-10,rgb=p.rgb||'239,68,68';leg(ctx,A,[mx-2,my]);leg(ctx,B,[mx+2,my]);
    if(lit){const g=ctx.createRadialGradient(mx,my,2,mx,my,26);g.addColorStop(0,`rgba(${rgb},0.95)`);g.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(mx,my,26,0,7);ctx.fill();}
    ctx.fillStyle=`rgba(${rgb},${lit?1:0.75})`;ctx.beginPath();ctx.arc(mx,my,6.5,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1;ctx.stroke();
    pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);ctx.fillStyle='#b91c1c';ctx.font='700 9px system-ui';ctx.textAlign='center';ctx.fillText('+',A[0]+(A[0]<=B[0]?-6:6),A[1]-4);break;}
  case 'ecap':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-12;leg(ctx,A,[mx-2,my+4]);leg(ctx,B,[mx+2,my+4]);ctx.fillStyle='#1d4ed8';ctx.beginPath();ctx.roundRect(mx-7,my-9,14,15,3);ctx.fill();
    const sx=B[0]>=A[0]?mx+3:mx-7;ctx.fillStyle=PAL.ink2;ctx.fillRect(sx,my-9,4,15);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);if(p.lab)txt(ctx,p.lab,mx,my-12,'#1e3a8a',8);break;}
  case 'ccap':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-9;leg(ctx,A,[mx,my]);leg(ctx,B,[mx,my]);ctx.fillStyle=PAL.orangeDark;ctx.beginPath();ctx.ellipse(mx,my,6,5,0,0,7);ctx.fill();pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);if(p.lab)txt(ctx,p.lab,mx,my-8,'#9a3412',8);break;}
  case 'diode':{leg(ctx,A,B);const ang=Math.atan2(B[1]-A[1],B[0]-A[0]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;ctx.save();ctx.translate(mx,my);ctx.rotate(ang);ctx.fillStyle=PAL.chipDark;ctx.fillRect(-10,-4,20,8);ctx.fillStyle=PAL.grayLight;ctx.fillRect(5,-4,3,8);ctx.restore();pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);break;}
  case 'buz':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-4;pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.arc(mx,my,11,0,7);ctx.fill();ctx.strokeStyle=PAL.slate;ctx.beginPath();ctx.arc(mx,my,4,0,7);ctx.stroke();break;}
  case 'ldr':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-8;leg(ctx,A,[mx-2,my]);leg(ctx,B,[mx+2,my]);ctx.fillStyle=PAL.orangeSoft;ctx.beginPath();ctx.arc(mx,my,6.5,0,7);ctx.fill();ctx.strokeStyle='#7c2d12';ctx.lineWidth=1.2;ctx.beginPath();for(let i=0;i<5;i++){ctx.lineTo(mx-4+i*2,my+(i%2?-2:2));}ctx.stroke();pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);break;}
  case 'btn':{const x1=HP('e'+p.col)[0],x2=HP('e'+(p.col+2))[0];['e','f'].forEach(r=>{pin(ctx,x1,BB.rows[r]);pin(ctx,x2,BB.rows[r]);});ctx.fillStyle=PAL.chip;ctx.fillRect(x1-2,BB.rows.e-4,x2-x1+4,BB.rows.f-BB.rows.e+8);ctx.fillStyle='#4b5563';ctx.beginPath();ctx.arc((x1+x2)/2,213,7,0,7);ctx.fill();break;}
  case 'chip':{const n=p.n/2,xl=HP('e'+p.col)[0]-5,xr=HP('e'+(p.col+n-1))[0]+5;for(let i=0;i<n;i++){pin(ctx,HP('e'+(p.col+i))[0],BB.rows.e);pin(ctx,HP('e'+(p.col+i))[0],BB.rows.f);}
    ctx.fillStyle=PAL.chipDark;ctx.fillRect(xl,BB.rows.e+2,xr-xl,BB.rows.f-BB.rows.e-4);ctx.fillStyle=PAL.grayLight;ctx.beginPath();ctx.arc(xl,213,4,-Math.PI/2,Math.PI/2);ctx.fill();
    ctx.fillStyle='#d1d5db';ctx.font='700 8px system-ui';ctx.textAlign='center';ctx.fillText(p.lab,(xl+xr)/2,216);break;}
  case 'seg7':{const xl=HP('e'+p.col)[0]-6,xr=HP('e'+(p.col+4))[0]+6;for(let i=0;i<5;i++){pin(ctx,HP('e'+(p.col+i))[0],BB.rows.e);pin(ctx,HP('e'+(p.col+i))[0],BB.rows.f);}
    ctx.fillStyle='#0a0a0a';ctx.fillRect(xl,BB.rows.d+6,xr-xl,BB.rows.g-BB.rows.d-12);const segs=lit?(p.show==='DYN'?DIGITS[1+Math.floor((T&&T.t||performance.now()/1000)*0.6)%6]:p.show==='CNT'?DIGITS[(p.place?Math.floor(Math.floor(performance.now()/1000*1.5)%100/10):Math.floor(performance.now()/1000*1.5)%10)]:p.show==='CNT'?DIGITS[(p.place?Math.floor(Math.floor(performance.now()/1000*1.5)%100/10):Math.floor(performance.now()/1000*1.5)%10)]:p.show==='CNT'?DIGITS[(p.place?Math.floor(Math.floor(performance.now()/1000*1.5)%100/10):Math.floor(performance.now()/1000*1.5)%10)]:(p.show||'abcdefg')):'';
    const ox=xl+16,oy=BB.rows.d+9,s=0.28;ctx.save();ctx.translate(ox,oy);ctx.scale(s,s);const G={a:[10,0,40,8],g:[10,49,40,8],d:[10,98,40,8],f:[2,8,8,41],b:[50,8,8,41],e:[2,57,8,41],c:[50,57,8,41]};
    Object.entries(G).forEach(([k,[x,y,w,h]])=>{ctx.fillStyle=segs.includes(k)?PAL.bad:'#2a1416';ctx.fillRect(x,y,w,h);});ctx.restore();break;}
  case 'bar':{const xl=HP('e'+p.col)[0]-6,xr=HP('e'+(p.col+9))[0]+6;for(let i=0;i<10;i++){pin(ctx,HP('e'+(p.col+i))[0],BB.rows.e);pin(ctx,HP('e'+(p.col+i))[0],BB.rows.f);}
    ctx.fillStyle=PAL.chip;ctx.fillRect(xl,BB.rows.d+6,xr-xl,BB.rows.g-BB.rows.d-12);const n=lit?4+((performance.now()/1000)%6<3?0:2):0;
    for(let i=0;i<10;i++){const x=HP('e'+(p.col+i))[0],on=i<n,red=p.cols[i]==='r';ctx.fillStyle=on?(red?PAL.bad:PAL.green):(red?'#3b1d1d':'#14301f');if(on){ctx.shadowBlur=10;ctx.shadowColor=red?PAL.bad:PAL.green;}ctx.fillRect(x-4,BB.rows.d+10,8,BB.rows.g-BB.rows.d-20);ctx.shadowBlur=0;}
    txt(ctx,p.lab||'DC10RG',(xl+xr)/2,BB.rows.d+3,PAL.muted,8);break;}
  case 'sil':{const n=Math.round((B[0]-A[0])/BB.dx)+1;for(let i=0;i<n;i++)pin(ctx,A[0]+i*BB.dx,A[1]);ctx.fillStyle=PAL.chip;ctx.beginPath();ctx.roundRect(A[0]-6,A[1]-17,B[0]-A[0]+12,12,3);ctx.fill();
    ctx.strokeStyle=PAL.muted2;for(let i=0;i<n;i++){ctx.beginPath();ctx.moveTo(A[0]+i*BB.dx,A[1]-5);ctx.lineTo(A[0]+i*BB.dx,A[1]);ctx.stroke();}
    ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.arc(A[0],A[1]-11,2.2,0,7);ctx.fill();txt(ctx,p.lab||'',(A[0]+B[0])/2+4,A[1]-8,PAL.grayLight,8);break;}
  case 'xtal':{leg(ctx,A,B);const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;ctx.fillStyle=PAL.ink2;ctx.beginPath();ctx.roundRect(mx-12,my-5,24,10,5);ctx.fill();ctx.strokeStyle=PAL.muted2;ctx.lineWidth=1;ctx.stroke();txt(ctx,'32k',mx,my+3,PAL.slateDark,7);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);break;}
  case 'npn':{const pts=[HP(p.c),HP(p.b),HP(p.e)];pts.forEach(q=>pin(ctx,q[0],q[1]));const x=pts[1][0],y=pts[1][1]-12;ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.arc(x,y+4,11,Math.PI,0);ctx.lineTo(x+11,y+8);ctx.lineTo(x-11,y+8);ctx.closePath();ctx.fill();
    pts.forEach(q=>leg(ctx,q,[q[0]*0.6+x*0.4,y+8]));ctx.fillStyle=PAL.gray;ctx.font='600 7px system-ui';ctx.textAlign='center';ctx.fillText(p.lab||'C B E',x,y+3);break;}
  case 'pot':{const pts=p.h.map(HP);pts.forEach(q=>pin(ctx,q[0],q[1]));const x=pts[1][0],y=pts[1][1]-6;ctx.fillStyle=PAL.blueDark;ctx.fillRect(x-14,y-10,28,18);ctx.fillStyle='#f8fafc';ctx.beginPath();ctx.arc(x,y-1,6,0,7);ctx.fill();ctx.strokeStyle=PAL.blueDark;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-3,y-1);ctx.lineTo(x+3,y-1);ctx.stroke();break;}
  case 'batt':{const [x,y]=p.at,up=y<98,ty=up?y+38:y-5;ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.roundRect(x,y,70,38,5);ctx.fill();ctx.fillStyle=PAL.yellowSoft;ctx.fillRect(x,up?y+29:y,70,9);txt(ctx,p.lab||'9 V',x+35,up?y+20:y+28,PAL.white,13);
    ctx.fillStyle=PAL.gray;ctx.fillRect(x+16,ty,10,5);ctx.fillRect(x+44,ty,10,5);const wy=up?ty+5:ty;
    partOn(ctx,{t:'wire',a:[x+21,wy],b:p.plus,c:PAL.redDark,freeA:1},lit,T);partOn(ctx,{t:'wire',a:[x+49,wy],b:p.minus,c:'#111',freeA:1},lit,T);break;}
  case 'pm':{ctx.fillStyle=PAL.chip;ctx.fillRect(16,98,40,232);ctx.fillStyle=PAL.grayLight;ctx.fillRect(18,190,22,26);txt(ctx,'USB',29,207,'#111',7);txt(ctx,'5V',36,170,lit?'#4ade80':PAL.muted,10);ctx.fillStyle=lit?PAL.green:PAL.slateDark;ctx.beginPath();ctx.arc(36,150,4,0,7);ctx.fill();break;}
  case 'box':{const [x,y]=p.at;ctx.fillStyle=p.col||PAL.slateDark;ctx.beginPath();ctx.roundRect(x,y,p.w,p.h,6);ctx.fill();txt(ctx,p.lab,x+p.w/2,y+(p.ly||16),PAL.white,p.fs||11);
    if(p.lit&&lit){const [gx,gy]=p.lit.at;const g=ctx.createRadialGradient(gx,gy,1,gx,gy,22);g.addColorStop(0,p.lit.c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(gx,gy,22,0,7);ctx.fill();}
    (p.pins||[]).forEach(q=>{const from=[x+q.dx,y+q.dy];ctx.fillStyle=PAL.ink2;ctx.beginPath();ctx.arc(from[0],from[1],2.5,0,7);ctx.fill();if(q.n)txt(ctx,q.n,from[0],from[1]+(q.dy>=p.h?12:-5),PAL.ink,8);
      if(q.to&&(q.s===undefined||(T&&T.has(q.s))||T===null))partOn(ctx,{t:'wire',a:from,b:q.to,c:q.c||'#a3a3a3',freeA:1},lit,T);});break;}
  case 'note':{txt(ctx,p.txt,p.at[0],p.at[1],p.c||PAL.ink,p.fs||11,p.al||'center');break;}
  case 'cell':{const [x,y]=p.at;ctx.fillStyle='#0f766e';ctx.beginPath();ctx.roundRect(x,y,110,30,8);ctx.fill();ctx.fillStyle=PAL.muted;ctx.fillRect(x+110,y+9,6,12);txt(ctx,'18650  +',x+60,y+19,PAL.white,11);break;}
  }}
// layouts: s = step that adds the part (0 = always), until = step that removes it
const W_R=PAL.redDark,W_B='#111',W_G=PAL.greenDark,W_Y=PAL.gold,W_O=PAL.orangeDark,W_U=PAL.blueDark,W_P=PAL.purple;
const BBL={};   // filled by projects/<id>.js
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
      ctx.strokeStyle=PAL.amber;ctx.lineWidth=2;pts.forEach(q=>{ctx.beginPath();ctx.arc(q[0],q[1],6+2*Math.sin(t*6),0,7);ctx.stroke();});}});
  if(!done&&next&&L.parts.some(p=>p.s===next))txt(ctx,'step '+next+' = glowing outline',BB.W-12,L.noBoard?380:92,PAL.amber,11,'right');
  if(lit)txt(ctx,done?'✓ finished and powered':'⚡ powered',BB.W-12,L.noBoard?400:(done?92:80),PAL.good,12,'right');}

// ----- helpers shared by the project demos -----
const MZ={t:0,ac:null};
function mAC(){MZ.ac=MZ.ac||new (window.AudioContext||window.webkitAudioContext)();if(MZ.ac.state==='suspended')MZ.ac.resume();return MZ.ac;}
function mLed(ctx,x,y,on,rgb){glowAt(ctx,x,y,on?0.9:0,rgb,30);ctx.fillStyle=`rgba(${rgb},${on?1:0.25})`;ctx.beginPath();ctx.arc(x,y,9,0,7);ctx.fill();ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.stroke();}
function mRes(ctx,x1,y1,x2,y2,lab){W(ctx,[[x1,y1],[x2,y2]],WIRE,2.5);const mx=(x1+x2)/2,my=(y1+y2)/2,v=Math.abs(y2-y1)>Math.abs(x2-x1);ctx.fillStyle=PAL.canvas;ctx.strokeStyle=WIRE;ctx.lineWidth=2;ctx.beginPath();if(v)ctx.rect(mx-7,my-16,14,32);else ctx.rect(mx-16,my-7,32,14);ctx.fill();ctx.stroke();if(lab)txt(ctx,lab,v?mx+12:mx,v?my+4:my-12,PAL.muted,11,v?'left':'center');}
function mGraph(ctx,x,y,w,h,series,lo,hi,label){ctx.fillStyle=PAL.panel;ctx.fillRect(x,y,w,h);ctx.strokeStyle=PAL.line;ctx.strokeRect(x,y,w,h);
  series.forEach(([arr,col,dash])=>{ctx.strokeStyle=col;ctx.lineWidth=2;ctx.setLineDash(dash||[]);ctx.beginPath();arr.forEach((v,i)=>{const px=x+i/(arr.length-1||1)*w,py=y+h-(v-lo)/(hi-lo)*h;i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.stroke();ctx.setLineDash([]);});
  if(label)txt(ctx,label,x+6,y+14,PAL.muted,11,'left');}
// a DC motor seen from the end (projects 23, 24, 25)
function motorDraw(ctx,x,y,ang,col){ctx.fillStyle=PAL.chipLight;ctx.beginPath();ctx.arc(x,y,46,0,7);ctx.fill();ctx.strokeStyle=PAL.muted2;ctx.lineWidth=3;ctx.stroke();
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle=col||PAL.yellow;ctx.fillRect(-4,-40,8,40);ctx.beginPath();ctx.moveTo(4,-40);ctx.lineTo(26,-34);ctx.lineTo(4,-26);ctx.fill();ctx.restore();
  ctx.fillStyle=PAL.grayLight;ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill();txt(ctx,'M',x-30,y+36,PAL.ink2,13);}
