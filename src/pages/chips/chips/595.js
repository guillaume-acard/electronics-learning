// ===== 595: data (pinout, inside, minimal circuit, hero art) + its demo =====
CHIP('595',{
pinout:{pkg:'dip',title:'74HC595 (DIP-16)',pins:[
 [1,'QB','out','Output B (bit 2).','LED via resistor (keep total chip current under ~70 mA).'],
 [2,'QC','out','Output C.',''],[3,'QD','out','Output D.',''],[4,'QE','out','Output E.',''],[5,'QF','out','Output F.',''],[6,'QG','out','Output G.',''],[7,'QH','out','Output H (bit 8).',''],
 [8,'GND','gnd','Ground.','To the − rail.'],
 [9,'QH′','out','Serial out: the bit that falls off the end of the shift register.','To SER (pin 14) of the next 595 to chain them.'],
 [10,'SRCLR','ctl','Shift-register clear, active LOW: low = wipe all 8 bits to 0.','Tie to + (5 V) if unused.'],
 [11,'SRCLK','in','Shift clock: each rising edge shifts every bit one place and takes in the new one.','To a microcontroller pin ("CLOCK").'],
 [12,'RCLK','in','Latch (register) clock: a rising edge copies all 8 bits to the outputs at once.','To a microcontroller pin ("LATCH").'],
 [13,'OE','ctl','Output enable, active LOW: low = outputs on, high = outputs disconnected (off).','Tie to ground. Or to a PWM pin to dim all the LEDs.'],
 [14,'SER','in','Serial data in: the next bit (1 or 0) to shift in.','To a microcontroller pin ("DATA").'],
 [15,'QA','out','Output A (bit 1).',''],
 [16,'VCC','pwr','Supply, 2–6 V.','To the + rail (5 V), with 100 nF to ground.']]},
inside:({ln,tx,bx,dot,tp,cmp,res,gnd,arrow})=>{let s='';const outs=[15,1,2,3,4,5,6,7];
  s+=ln('40,70 120,70',14)+ln('40,120 120,120',11)+ln('40,170 120,170',10)+bx(120,50,120,140,'Shift register\n8 cells\n(bucket brigade)');
  for(let i=0;i<4;i++){const y=80+i*25;s+=arrow(240,y,280);}s+=tx(260,68,'×8',{s:11,c:PAL.muted});
  s+=bx(280,50,110,140,'Storage latch\n8 cells\n(copy on RCLK)');
  s+=ln('40,230 335,230 335,190',12);
  for(let i=0;i<4;i++){const y=80+i*25;s+=arrow(390,y,420);}
  s+=bx(420,50,70,140,'Output\nbuffers');s+=ln('40,280 455,280 455,190',13);
  outs.forEach((n,i)=>{const y=58+i*18;s+=ln(`490,${y} 530,${y}`,n)+tp(530,y,n,'r');});
  s+=ln('240,175 255,175 255,305 530,305',9)+tp(530,305,9,'r')+tx(400,298,'→ next chip',{s:11,c:PAL.muted});
  return {vb:'-75 0 700 330',s:s+tp(40,70,14,'l')+tp(40,120,11,'l')+tp(40,170,10,'l')+tp(40,230,12,'l')+tp(40,280,13,'l')};},
minimal:{title:'74HC595: 8 LEDs from 3 Arduino pins',sub:'5 V from the Arduino',rows:[
 [1,[[['R:330 Ω','LED:r'],'GND']],'QB.'],[2,[[['R:330 Ω','LED:r'],'GND']],'QC.'],[3,[[['R:330 Ω','LED:r'],'GND']],'QD.'],[4,[[['R:330 Ω','LED:r'],'GND']],'QE.'],
 [5,[[['R:330 Ω','LED:r'],'GND']],'QF.'],[6,[[['R:330 Ω','LED:r'],'GND']],'QG.'],[7,[[['R:330 Ω','LED:r'],'GND']],'QH.'],
 [8,[[[],'GND']],'Ground.'],
 [9,[[[],'NC']],'QH′: free (or to SER of a second 595).'],
 [10,[[[],'V5']],'SRCLR: high = don\'t clear.'],
 [11,[[[],'IN:Arduino D12 (clock)']],'Shift clock.'],
 [12,[[[],'IN:Arduino D8 (latch)']],'Latch clock.'],
 [13,[[[],'GND']],'OE: low = outputs on.'],
 [14,[[[],'IN:Arduino D11 (data)']],'Serial data in.'],
 [15,[[['R:330 Ω','LED:r'],'GND']],'QA.'],
 [16,[[[],'V5'],[['C:100 nF'],'GND']],'Supply 5 V, decoupled.']]},
art:dipArt('74HC595',16,'Shift register',PAL.sky)});

(function(){
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
  [['DATA','d',PAL.amber],['CLOCK','c',PAL.blue],['LATCH','l',PAL.good]].forEach(([n,k,col],j)=>{const y=30+j*34;arrowText(ctx,n,70,y+4,col,12,'right');
    ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();let x=80;ctx.moveTo(x,y+10);SR.trace.forEach(p=>{const yy=p[k]?y-8:y+10;ctx.lineTo(x,yy);x+=12;ctx.lineTo(x,yy);});ctx.lineTo(Math.max(x,80),y+10);ctx.stroke();});
  arrowText(ctx,'pins: 14 DATA · 11 CLOCK · 12 LATCH · 15,1–7 outputs',560,20,PAL.muted,11);
  arrowText(ctx,SR.phase,560,50,PAL.yellow,14);
  // register cells
  arrowText(ctx,'shift register (inside)',290,149,PAL.muted,12,'right');
  for(let i=0;i<8;i++){const x=330+i*52;ctx.fillStyle=SR.reg[i]?'#1d4ed8':PAL.raised;ctx.fillRect(x,128,40,32);ctx.strokeStyle=PAL.slate;ctx.strokeRect(x,128,40,32);arrowText(ctx,String(SR.reg[i]),x+20,149,PAL.ink,14);}
  ctx.strokeStyle=PAL.muted2;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(296,144);ctx.lineTo(328,144);ctx.stroke();arrowText(ctx,'→ bits enter here',300,175,PAL.muted,10);
  arrowText(ctx,'outputs (LEDs)',320,207,PAL.muted,12,'right');
  for(let i=0;i<8;i++){const x=350+i*52,y=202,on=SR.out[i];if(on){const g=ctx.createRadialGradient(x,y,2,x,y,26);g.addColorStop(0,'rgba(34,197,94,1)');g.addColorStop(1,'rgba(34,197,94,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,26,0,7);ctx.fill();}
    ctx.fillStyle=on?PAL.green:'#14301f';ctx.beginPath();ctx.arc(x,y,11,0,7);ctx.fill();arrowText(ctx,'Q'+i,x,y+28,PAL.slate,10);}
  arrowText(ctx,'pattern to send (click):',320,276,PAL.ink,12,'right');
  for(let i=0;i<8;i++){const x=330+i*52;ctx.fillStyle=SR.pat[i]?PAL.amber:PAL.raised;ctx.fillRect(x,256,40,30);ctx.strokeStyle=PAL.amber;ctx.strokeRect(x,256,40,30);arrowText(ctx,String(SR.pat[i]),x+20,276,SR.pat[i]?PAL.canvas:PAL.muted,14);}}
loop((dt,now)=>{draw595(dt);});
})();
