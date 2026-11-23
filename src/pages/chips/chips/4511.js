// ===== 4511: data (pinout, inside, minimal circuit, hero art) + its demo =====
CHIP('4511',{
pinout:{pkg:'dip',title:'CD4511 (DIP-16)',pins:[
 [1,'B','in','Input B: the "2" bit of the number.','From the counter\'s Q2 (or a diode encoder).'],
 [2,'C','in','Input C: the "4" bit.','From the counter\'s Q3.'],
 [3,'LT','ctl','Lamp test, active LOW: low = all 7 segments on (shows 8) to check the wiring.','Tie to + for normal use.'],
 [4,'BI','ctl','Blanking, active LOW: low = all segments off.','Tie to +. Or to a PWM signal to dim the display.'],
 [5,'LE','ctl','Latch enable: low = the display follows the inputs, high = it freezes the last number.','Tie to ground (−) for normal use.'],
 [6,'D','in','Input D: the "8" bit.','From the counter\'s Q4. Tie to − if you only count to 7.'],
 [7,'A','in','Input A: the "1" bit.','From the counter\'s Q1.'],
 [8,'VSS','gnd','Ground.','To the − rail.'],
 [9,'e','out','Segment e output: high (≈ supply − 1 V) when the segment must light. Can supply ~25 mA.','Through a 470 Ω–1 kΩ resistor to the display\'s segment e pin.'],
 [10,'d','out','Segment d output.',''],[11,'c','out','Segment c output.',''],[12,'b','out','Segment b output.',''],[13,'a','out','Segment a output.',''],[14,'g','out','Segment g output.',''],[15,'f','out','Segment f output.',''],
 [16,'VDD','pwr','Supply, 3–15 V.','To the + rail, with 100 nF to ground.']]},
inside:({ln,tx,bx,dot,tp,cmp,res,gnd,arrow})=>{let s='';const ins=[[7,'A'],[1,'B'],[2,'C'],[6,'D']],outs=[13,12,11,10,9,15,14];
  ins.forEach(([n],i)=>{const y=60+i*40;s+=ln(`40,${y} 130,${y}`,n)+tp(40,y,n,'l');});
  s+=bx(130,40,100,140,'Latch\n4-bit memory\n\n(LE high =\nfreeze)');
  for(let i=0;i<4;i++){const y=70+i*30;s+=arrow(230,y,280);}
  s+=bx(280,40,120,200,'Decoder\n(logic gates)\n\n0–9 → which\nsegments?\n\n10–15 → none');
  s+=ln('40,230 180,230 180,180',5)+tp(40,230,5,'l');
  s+=ln('300,300 300,240',3)+tp(300,300,3,'b')+ln('380,300 380,240',4)+tp(380,300,4,'b');
  for(let i=0;i<4;i++){const y=70+i*40;s+=arrow(400,y,440);}
  s+=bx(440,40,70,200,'7 output\ndrivers\n(NPN)',PAL.good);
  outs.forEach((n,i)=>{const y=50+i*30;s+=ln(`510,${y} 545,${y}`,n)+tp(545,y,n,'r');});
  s+=tx(40,20,'16 VDD / 8 VSS power every block',{a:'start',s:11,c:PAL.muted});
  return {vb:'-60 0 680 330',s};},
minimal:{title:'CD4511: show a digit from 4 switches',sub:'one SC39-11SURKWA display (COM to ground)',rows:[
 [1,[[['R:10 kΩ'],'GND'],[['BTN'],'V9']],'Input B (2): pull-down + a switch or wire to + to make it 1.'],
 [2,[[['R:10 kΩ'],'GND'],[['BTN'],'V9']],'Input C (4).'],
 [3,[[[],'V9']],'LT (lamp test): high = normal.'],
 [4,[[[],'V9']],'BI (blanking): high = normal.'],
 [5,[[[],'GND']],'LE (latch): low = follow the inputs.'],
 [6,[[['R:10 kΩ'],'GND'],[['BTN'],'V9']],'Input D (8).'],
 [7,[[['R:10 kΩ'],'GND'],[['BTN'],'V9']],'Input A (1).'],
 [8,[[[],'GND']],'VSS: ground.'],
 [9,[[['R:1 kΩ'],'T:display e (pin 1)']],'Segment e.'],[10,[[['R:1 kΩ'],'T:display d (pin 2)']],'Segment d.'],[11,[[['R:1 kΩ'],'T:display c (pin 4)']],'Segment c.'],
 [12,[[['R:1 kΩ'],'T:display b (pin 6)']],'Segment b.'],[13,[[['R:1 kΩ'],'T:display a (pin 7)']],'Segment a.'],[14,[[['R:1 kΩ'],'T:display g (pin 10)']],'Segment g.'],[15,[[['R:1 kΩ'],'T:display f (pin 9)']],'Segment f.'],
 [16,[[[],'V9'],[['C:100 nF'],'GND']],'VDD: supply, decoupled. (Display COM pins 3/8 → ground.)']]},
art:dipArt('CD4511',16,'BCD → 7-segment decoder',PAL.bad)});

(function(){
const D11={v:6,LT:false,BI:false,LE:false,shown:6};
function draw4511(){const c=document.getElementById('c4511');if(!c)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  if(!D11.LE)D11.shown=D11.v;const val=D11.shown;let on=val<=9?DIGITS[val]:'';if(D11.BI)on='';if(D11.LT)on='abcdefg';
  ctx.fillStyle=PAL.muted;ctx.font='12px system-ui';ctx.textAlign='left';ctx.fillText('Inputs (click a bit)',40,24);
  bitDots(ctx,60,60,D11.v,['A','B','C','D']);
  ctx.fillStyle=PAL.ink;ctx.font='700 15px system-ui';ctx.fillText('D C B A = '+D11.v.toString(2).padStart(4,'0')+'  →  '+D11.v,40,250);
  // arrows to box
  ctx.fillStyle=PAL.panel;ctx.strokeStyle=PAL.violet;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(260,50,170,150,10);ctx.fill();ctx.stroke();
  ctx.fillStyle=PAL.ink;ctx.font='700 16px system-ui';ctx.textAlign='center';ctx.fillText('CD4511',345,100);ctx.font='12px system-ui';ctx.fillStyle=PAL.muted;
  ctx.fillText(D11.LT?'LT low: all segments on':D11.BI?'BI low: blank':D11.LE?'LE high: frozen at '+D11.shown:val>9?'not a digit → blank':'lights: '+on.split('').join(' '),345,130);
  ctx.fillText('a b c d e f g',345,160);
  'abcdefg'.split('').forEach((k,i)=>{const l=on.includes(k);ctx.fillStyle=l?PAL.green:PAL.slateDark;ctx.beginPath();ctx.arc(290+i*18.3,178,6,0,7);ctx.fill();});
  ctx.strokeStyle=PAL.muted2;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(200,125);ctx.lineTo(255,125);ctx.moveTo(435,125);ctx.lineTo(530,125);ctx.stroke();
  drawDigit(ctx,560,30,1.9,on,{pad:12,glow:12});}
document.getElementById('c4511').addEventListener('click',e=>{const r=e.target.getBoundingClientRect(),x=(e.clientX-r.left)*800/r.width,y=(e.clientY-r.top)*270/r.height;
  for(let i=0;i<4;i++){if(Math.hypot(x-60,y-(60+i*44))<22){D11.v^=(1<<i);draw4511();}}});
const tg=(id,k)=>document.getElementById(id).addEventListener('click',e=>{D11[k]=!D11[k];e.target.classList.toggle('active',D11[k]);draw4511();});
tg('d11LT','LT');tg('d11BI','BI');tg('d11LE','LE');
document.getElementById('d11up').addEventListener('click',()=>{D11.v=(D11.v+1)%16;draw4511();});
draw4511();
})();
