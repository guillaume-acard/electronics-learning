// ===== 4060: data (pinout, inside, minimal circuit, hero art) + its demo =====
CHIP('4060',{
pinout:{pkg:'dip',title:'CD4060 (DIP-16)',pins:[
 [1,'Q12','out','Oscillator ÷ 4,096. With a 32.768 kHz quartz: 8 Hz.','To an LED (1 kΩ) or the next chip\'s clock.'],
 [2,'Q13','out','Oscillator ÷ 8,192. With the quartz: 4 Hz.',''],
 [3,'Q14','out','Oscillator ÷ 16,384, the last stage. With the quartz: exactly 2 Hz.','To the CD4013 clock (÷2 → 1 Hz), or an LED through 1 kΩ to see it blink.'],
 [4,'Q6','out','Oscillator ÷ 64. With the quartz: 512 Hz (an audible tone).',''],
 [5,'Q5','out','Oscillator ÷ 32: 1,024 Hz.',''],
 [6,'Q7','out','Oscillator ÷ 128: 256 Hz.',''],
 [7,'Q4','out','Oscillator ÷ 16: 2,048 Hz. (Q1–Q3 and Q11 exist inside but have no pin.)',''],
 [8,'VSS','gnd','Ground.','To the − rail.'],
 [9,'φO','out','Oscillator output (in phase). Only used for an RC oscillator (resistor + capacitor instead of a quartz).','With a quartz: leave free.'],
 [10,'φO̅','out','Oscillator output (inverted): the inverter\'s output that drives the quartz.','10 MΩ to pin 11, and 100 kΩ to the far side of the quartz.'],
 [11,'φI','in','Oscillator input: the inverter\'s input, and the clock of the divider chain.','To one side of the quartz, 22 pF to ground, and the 10 MΩ from pin 10.'],
 [12,'RESET','ctl','Reset, active HIGH: high stops the oscillator and sets every Q to 0.','To ground so it runs. Or to a button with a pull-down to restart the count.'],
 [13,'Q9','out','Oscillator ÷ 512: 64 Hz.',''],
 [14,'Q8','out','Oscillator ÷ 256: 128 Hz.',''],
 [15,'Q10','out','Oscillator ÷ 1,024: 32 Hz.',''],
 [16,'VDD','pwr','Supply, 3–15 V.','To the + rail, with 100 nF to ground.']]},
inside:({ln,tx,bx,dot,tp,cmp,res,gnd,arrow})=>{let s='',pins='';
  [[11,70],[10,110],[9,150]].forEach(([n,y])=>{s+=ln(`40,${y} 110,${y}`,n);pins+=tp(40,y,n,'l');});
  s+=bx(110,50,120,120,'Oscillator\n2 inverters\n\nquartz between\npins 11 and 10',PAL.amber)+arrow(230,110,290);
  s+=bx(290,20,190,260,'14 flip-flops\nin a chain\n\neach one ÷ 2\n\n32 768 Hz\n→ Q14 = 2 Hz');
  [[7,'÷16'],[5,'÷32'],[4,'÷64'],[6,'÷128'],[14,'÷256'],[13,'÷512'],[15,'÷1024'],[1,'÷4096'],[2,'÷8192'],[3,'÷16384']].forEach(([n,t],i)=>{const y=34+i*26;s+=ln(`480,${y} 545,${y}`,n)+tx(512,y-4,t,{s:9,c:PAL.muted});pins+=tp(545,y,n,'r');});
  s+=ln('385,280 385,300',12);pins+=tp(385,302,12,'b');
  s+=tx(40,14,'16 VDD / 8 VSS power everything',{a:'start',s:11,c:PAL.muted});
  return {vb:'-70 0 700 335',s:s+pins};},
minimal:{title:'CD4060: quartz time base (project 26)',sub:'32.768 kHz watch quartz → an LED blinking exactly 2 times per second',rows:[
 [1,[[[],'NC']],'Q12: 8 Hz (free).'],[2,[[[],'NC']],'Q13: 4 Hz (free).'],
 [3,[[['R:1 kΩ','LED:r'],'GND'],[[],'T:2 Hz → CD4013 CLK1 (pin 3)']],'Q14: 2 Hz, the slowest output. The LED blinks twice a second, exactly.'],
 [4,[[[],'NC']],'Q6: 512 Hz (free).'],[5,[[[],'NC']],'Q5: 1,024 Hz (free).'],[6,[[[],'NC']],'Q7: 256 Hz (free).'],[7,[[[],'NC']],'Q4: 2,048 Hz (free).'],
 [8,[[[],'GND']],'VSS: ground.'],
 [9,[[[],'NC']],'φO: only for an RC oscillator; free with a quartz.'],
 [10,[[['R:10 MΩ'],'P11'],[['R:100 kΩ'],'T:quartz far side (+ 22 pF to GND)']],'φO̅: the inverter\'s output. 10 MΩ back to pin 11 wakes the inverter up; 100 kΩ limits how hard it shakes the tiny quartz.'],
 [11,[[['XTAL:32.768 kHz'],'T:quartz far side'],[['C:22 pF'],'GND']],'φI: the inverter\'s input. The quartz goes from here to the far side node, which also gets the 100 kΩ and a second 22 pF to ground.'],
 [12,[[[],'GND']],'RESET: low, so it runs.'],
 [13,[[[],'NC']],'Q9: 64 Hz (free).'],[14,[[[],'NC']],'Q8: 128 Hz (free).'],[15,[[[],'NC']],'Q10: 32 Hz (free).'],
 [16,[[[],'V9'],[['C:100 nF'],'GND']],'VDD: supply, decoupled.']]},
art:dipArt('CD4060',16,'Oscillator + divider',PAL.amber)});

(function(){
// ---------- CD4060 ----------
const F60={t:0,run:true};
$('d60run').addEventListener('click',e=>{F60.run=!F60.run;e.target.textContent=F60.run?'⏸ Pause':'▶ Run';e.target.classList.toggle('active',F60.run);});
$('d60rst').addEventListener('click',()=>{F60.t=0;});
const PIN60={4:7,5:5,6:4,7:6,8:14,9:13,10:15,12:1,13:2,14:3};
const fmtHz=f=>f>=1000?(f/1000).toFixed(f>=10000?1:2).replace(/\.?0+$/,'')+' kHz':(+f.toFixed(1))+' Hz';
function draw4060(dt){const c=$('c4060');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  if(F60.run)F60.t+=dt;const t=F60.t;
  // quartz
  const wob=F60.run?Math.sin(performance.now()/18)*2:0;ctx.fillStyle=PAL.ink2;ctx.beginPath();ctx.roundRect(30+wob,40,46,22,11);ctx.fill();W(ctx,[[44,62],[44,80]],PAL.ink2,2);W(ctx,[[62,62],[62,80]],PAL.ink2,2);
  txt(ctx,'quartz',53,32,PAL.ink,12,'center');txt(ctx,'32 768 Hz',53,98,PAL.yellow,12);
  W(ctx,[[84,74],[126,74]],PAL.yellow,2);ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.moveTo(132,74);ctx.lineTo(124,69);ctx.lineTo(124,79);ctx.fill();
  txt(ctx,'time: '+t.toFixed(2)+' s',53,130,PAL.muted,12);txt(ctx,'Q14 rises every',53,160,PAL.muted2,11);txt(ctx,'0.5 s exactly',53,176,PAL.muted2,11);
  for(let n=1;n<=14;n++){const col=(n-1)%7,row=Math.floor((n-1)/7),x=170+col*88,y=60+row*130,f=32768/Math.pow(2,n),pin=PIN60[n];
    const on=Math.floor(t*32768/Math.pow(2,n-1))%2===1,blur=f>12;
    ctx.fillStyle=PAL.panel;ctx.strokeStyle=pin?PAL.amber:PAL.slateDark;ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(x-36,y-30,72,104,8);ctx.fill();ctx.stroke();
    txt(ctx,'Q'+n,x,y-12,pin?PAL.ink:PAL.muted2,13,'center');
    if(pin)lamp(ctx,x,y+14,t===0?0:(blur?0.5:(on?1:0)),'245,158,11',10);else{ctx.fillStyle=PAL.raised;ctx.beginPath();ctx.arc(x,y+14,10,0,7);ctx.fill();}
    txt(ctx,fmtHz(f),x,y+46,pin?PAL.yellow:PAL.slate,11);txt(ctx,pin?'pin '+pin:'no pin',x,y+62,pin?PAL.muted:PAL.slate,10);
    if(col<6)W(ctx,[[x+36,y+14],[x+52,y+14]],PAL.slate,1.5);}
  W(ctx,[[734,74],[752,74],[752,142],[118,142],[118,204],[134,204]],PAL.slate,1.5);
  txt(ctx,'each stage divides by 2 →',460,18,PAL.muted2,11);
  txt(ctx,blurNote(),480,290,PAL.muted,11);}
function blurNote(){return 'Above ~12 Hz the blinking is too fast for your eyes: those LEDs look half lit.';}

// ---------- quartz resonance ----------
function drawXtal(){const c=$('cXtal');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const f=+$('xtF').value,f0=32768,Q=60000,A=f=>1/Math.sqrt(1+Math.pow(2*Q*(f-f0)/f0,2)),a=A(f);
  $('xtFt').textContent=f.toLocaleString('en-US',{minimumFractionDigits:2})+' Hz';
  // tuning fork
  const ph=Math.sin(performance.now()/40)*a*14,cx=140;ctx.fillStyle=PAL.ink2;
  ctx.beginPath();ctx.moveTo(cx-30-ph,40);ctx.lineTo(cx-16-ph,40);ctx.lineTo(cx-12,170);ctx.lineTo(cx-26,170);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(cx+30+ph,40);ctx.lineTo(cx+16+ph,40);ctx.lineTo(cx+12,170);ctx.lineTo(cx+26,170);ctx.closePath();ctx.fill();
  ctx.fillRect(cx-26,170,52,16);ctx.fillRect(cx-6,186,12,30);
  txt(ctx,'the quartz fork inside',cx,236,PAL.muted,11);txt(ctx,'amplitude '+Math.round(a*100)+' %',cx,254,a>0.5?PAL.good:PAL.yellow,13,'center');
  // curve
  const x0=300,x1=770,y0=210,y1=62,fx=v=>x0+(v-32740)/(56)*(x1-x0),ay=v=>y0-(y0-y1)*v;
  W(ctx,[[x0,y0],[x1,y0]],PAL.slateDark,1.5);W(ctx,[[x0,y0],[x0,y1]],PAL.slateDark,1.5);
  ctx.strokeStyle=PAL.amber;ctx.lineWidth=2.5;ctx.beginPath();for(let px=0;px<=x1-x0;px++){const v=32740+px/(x1-x0)*56,yy=ay(A(v));px?ctx.lineTo(x0+px,yy):ctx.moveTo(x0+px,yy);}ctx.stroke();
  ctx.fillStyle=PAL.sky;ctx.beginPath();ctx.arc(fx(f),ay(a),7,0,7);ctx.fill();W(ctx,[[fx(f),y0],[fx(f),ay(a)]],PAL.sky,1.5);
  [32740,32754,32768,32782,32796].forEach(v=>txt(ctx,v.toLocaleString('en-US'),fx(v),y0+18,PAL.muted2,10));
  txt(ctx,'how much the quartz responds',x0+6,y1-8,PAL.muted,11,'left');txt(ctx,'push frequency (Hz)',x1,y0+36,PAL.muted,11,'right');
  const off=Math.abs(f-f0),pc=(off/f0*100).toFixed(4);
  txt(ctx,a>0.9?'Right on 32,768 Hz: it rings at full strength.':a>0.3?`Off by ${off.toFixed(2)} Hz (${pc} %): already much weaker.`:`Off by ${off.toFixed(2)} Hz (${pc} %): it barely moves.`,(x0+x1)/2,24,a>0.9?PAL.good:PAL.yellow,13,'center');}
loop((dt,now)=>{draw4060(dt);drawXtal();});
})();
