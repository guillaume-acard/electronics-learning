// ===== 328: data (pinout, inside, minimal circuit, hero art) + its demo =====
CHIP('328',{
pinout:{pkg:'dip',title:'ATmega328P (DIP-28)',pins:[
 [1,'RESET','ctl','Reset, active LOW: pull low to restart the program. Also used for uploading.','10 kΩ to +5 V (pull-up), plus the reset button to ground.'],
 [2,'D0 RX','in','Arduino D0 / serial receive (from the PC via USB).','Avoid using it while uploading.'],
 [3,'D1 TX','out','Arduino D1 / serial transmit.','Avoid using it while uploading.'],
 [4,'D2','out','Arduino D2, digital I/O (interrupt INT0).','In the dice: segment a via 330 Ω.'],
 [5,'D3','out','Arduino D3, digital I/O, PWM.','Segment b in the dice.'],
 [6,'D4','out','Arduino D4, digital I/O.',''],
 [7,'VCC','pwr','Digital supply, 1.8–5.5 V (5 V on the Uno).','+5 V with 100 nF to ground.'],
 [8,'GND','gnd','Ground.','To −.'],
 [9,'XTAL1','ctl','Crystal input: the 16 MHz clock.','16 MHz crystal between pins 9 and 10, 22 pF from each to ground.'],
 [10,'XTAL2','ctl','Crystal output.','See pin 9.'],
 [11,'D5','out','Arduino D5, digital I/O, PWM.',''],
 [12,'D6','out','Arduino D6, digital I/O, PWM.',''],
 [13,'D7','out','Arduino D7, digital I/O.',''],
 [14,'D8','out','Arduino D8, digital I/O.',''],
 [15,'D9','out','Arduino D9, digital I/O, PWM.',''],
 [16,'D10','out','Arduino D10, digital I/O, PWM.','Dice / thermometer: digit 1 transistor via 1 kΩ.'],
 [17,'D11','out','Arduino D11, PWM / MOSI (programming).','Digit 2 transistor via 1 kΩ.'],
 [18,'D12','out','Arduino D12 / MISO.','Dice button (INPUT_PULLUP).'],
 [19,'D13','out','Arduino D13 / SCK. The Uno\'s built-in "L" LED.',''],
 [20,'AVCC','pwr','Supply for the analog part (ADC).','+5 V, ideally through a small filter.'],
 [21,'AREF','ctl','Analog reference: the voltage that reads as 1023.','100 nF to ground. Don\'t connect a voltage when using INTERNAL.'],
 [22,'GND','gnd','Analog ground.','To −.'],
 [23,'A0','in','Arduino A0: analog input (ADC 0–1023) or digital I/O.','Thermometer: LM35 output.'],
 [24,'A1','in','Arduino A1: analog input.',''],[25,'A2','in','Arduino A2: analog input.',''],[26,'A3','in','Arduino A3: analog input.',''],
 [27,'A4 SDA','in','Arduino A4 / I²C data.','To I²C modules (screens, sensors).'],
 [28,'A5 SCL','in','Arduino A5 / I²C clock.','To I²C modules.']]},
inside:({ln,tx,bx,dot,tp,cmp,res,gnd,arrow})=>{let s='';
  s+=bx(220,90,140,110,'CPU\n16 MHz\n\nruns your\nprogram',PAL.violet);
  s+=bx(220,20,140,50,'Flash 32 KB\n(program)')+bx(380,20,120,50,'RAM 2 KB\n(variables)');
  s+=ln('40,40 220,40',9)+tp(40,40,9,'l')+ln('40,70 120,70 120,110 220,110',10)+tp(40,70,10,'l')+tx(130,30,'crystal',{s:11,c:PAL.muted});
  s+=ln('40,150 220,150',1)+tp(40,150,1,'l');
  s+=bx(400,100,110,40,'Port D (D0–D7)',PAL.good)+ln('360,120 400,120')+ln('510,110 545,110',2)+tp(545,110,2,'r')+ln('510,130 545,130',3)+tp(545,130,3,'r');
  s+=bx(400,160,110,40,'Port B (D8–D13)\ntimers / PWM',PAL.good)+ln('360,180 400,180')+ln('510,170 545,170',15)+tp(545,170,15,'r')+ln('510,190 545,190',19)+tp(545,190,19,'r');
  s+=bx(220,230,140,50,'ADC 10 bit\n(analogRead)',PAL.blue)+ln('290,200 290,230')+ln('360,255 545,255',23)+tp(545,255,23,'r');
  s+=ln('40,245 220,245',21)+tp(40,245,21,'l')+ln('40,275 220,275',20)+tp(40,275,20,'l');
  s+=tx(40,312,'7 VCC / 8, 22 GND power everything',{a:'start',s:11,c:PAL.muted});
  return {vb:'-70 0 700 330',s};},
minimal:{title:'ATmega328P: an "Arduino" on a breadboard',sub:'the bare minimum to run a sketch (blinks an LED on D13)',rows:[
 [1,[[['R:10 kΩ'],'V5']],'RESET: pull-up so it runs (a button to ground resets it).'],
 [2,[[[],'NC']],'D0 / RX: free (serial from a USB adapter).'],[3,[[[],'NC']],'D1 / TX: free.'],[4,[[[],'NC']],'D2: free I/O.'],[5,[[[],'NC']],'D3: free I/O.'],[6,[[[],'NC']],'D4: free I/O.'],
 [7,[[[],'V5'],[['C:100 nF'],'GND']],'VCC: 5 V, decoupled.'],
 [8,[[[],'GND']],'Ground.'],
 [9,[[['XTAL:16 MHz'],'P10'],[['C:22 pF'],'GND']],'XTAL1: 16 MHz crystal to pin 10, 22 pF to ground.'],
 [10,[[['C:22 pF'],'GND']],'XTAL2: other side of the crystal, 22 pF to ground.'],
 [11,[[[],'NC']],'D5: free.'],[12,[[[],'NC']],'D6: free.'],[13,[[[],'NC']],'D7: free.'],[14,[[[],'NC']],'D8: free.'],
 [15,[[[],'NC']],'D9: free.'],[16,[[[],'NC']],'D10: free.'],[17,[[[],'NC']],'D11: free.'],[18,[[[],'NC']],'D12: free.'],
 [19,[[['R:330 Ω','LED:r'],'GND']],'D13: the "blink" LED.'],
 [20,[[[],'V5']],'AVCC: 5 V (the ADC\'s supply). Must be connected even if unused!'],
 [21,[[['C:100 nF'],'GND']],'AREF: 100 nF to ground.'],
 [22,[[[],'GND']],'Ground (analog).'],
 [23,[[[],'NC']],'A0: free (analog in).'],[24,[[[],'NC']],'A1: free.'],[25,[[[],'NC']],'A2: free.'],[26,[[[],'NC']],'A3: free.'],[27,[[[],'NC']],'A4 / SDA: free.'],[28,[[[],'NC']],'A5 / SCL: free.']]},
art:dipArt('ATmega328P',28,'Arduino brain','#2dd4bf')});

(function(){
const AV={t:0};
function draw328(dt){const c=document.getElementById('c328');if(!c||!c.offsetParent)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);AV.t+=dt;
  const v=+document.getElementById('avA0').value,val=Math.round(v/5*1023),pwm=Math.floor(val/4),led13=Math.floor(AV.t*2)%2===0;
  ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.roundRect(300,40,200,200,10);ctx.fill();ctx.strokeStyle='#2dd4bf';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=PAL.ink;ctx.font='700 15px ui-monospace,monospace';ctx.textAlign='center';ctx.fillText('ATmega328P',400,130);ctx.fillStyle=PAL.muted;ctx.font='12px system-ui';ctx.fillText('16 million steps / s',400,152);
  ctx.textAlign='left';ctx.fillStyle=PAL.ink2;ctx.font='13px system-ui';ctx.fillText('A0 (pin 23): '+v.toFixed(2)+' V',40,90);ctx.fillText('analogRead → '+val,40,114);
  ctx.fillStyle=PAL.raised;ctx.fillRect(40,130,200,14);ctx.fillStyle=PAL.blue;ctx.fillRect(40,130,200*val/1023,14);
  ctx.strokeStyle=PAL.muted2;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(240,110);ctx.lineTo(300,110);ctx.moveTo(500,100);ctx.lineTo(600,100);ctx.moveTo(500,190);ctx.lineTo(600,190);ctx.stroke();
  const b=pwm/255;ctx.fillStyle=`rgba(250,204,21,${0.15+0.85*b})`;if(b>0.05){ctx.shadowBlur=24*b;ctx.shadowColor=PAL.yellowSoft;}ctx.beginPath();ctx.arc(630,100,14,0,7);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle=PAL.ink2;ctx.fillText('D9 (pin 15) PWM '+pwm+'/255',520,70);
  ctx.fillStyle=led13?PAL.bad:'#3b1d1d';if(led13){ctx.shadowBlur=14;ctx.shadowColor=PAL.bad;}ctx.beginPath();ctx.arc(630,190,12,0,7);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle=PAL.ink2;ctx.fillText('D13 (pin 19) blinks',520,225);
  // PWM wave
  ctx.strokeStyle=PAL.yellowSoft;ctx.lineWidth=1.5;ctx.beginPath();for(let k=0;k<=150;k++){const x=650+k,ph=(k/30)%1,y=ph<b?126:146;k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
loop((dt,now)=>{draw328(dt);});
})();
