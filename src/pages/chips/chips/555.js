// ===== 555: data (pinout, inside, minimal circuit, hero art) + its demo =====
CHIP('555',{
pinout:{pkg:'dip',title:'NE555 (DIP-8)',pins:[
 [1,'GND','gnd','Ground (0 V). The return path for everything.','To the − rail.'],
 [2,'TRIG','in','Trigger: when its voltage drops below ⅓ of the supply, the output switches ON and the capacitor starts filling again.','Astable (blinker): joined to pin 6 and the timing capacitor. One-shot: to a push button with a pull-up.'],
 [3,'OUT','out','The output: high (≈ supply) or low (0 V). Can push or pull up to ~200 mA.','To an LED via a resistor, a buzzer, a transistor base resistor, or the clock of a CD4017.'],
 [4,'RESET','ctl','Low = everything stops and the output is forced OFF. High = runs normally.','Tie to + if unused. In the dice: the push button (high = roll) with a 10 kΩ pull-down.'],
 [5,'CTRL','ctl','Control voltage: direct access to the ⅔ point of the internal divider. Changing it shifts the timing.','Usually a 10 nF capacitor to ground to keep it steady (stops jitter).'],
 [6,'THR','in','Threshold: when its voltage rises above ⅔ of the supply, the output switches OFF and the discharge opens.','Joined to pin 2 and the timing capacitor.'],
 [7,'DIS','out','Discharge: an internal transistor that shorts to ground while the output is OFF, draining the capacitor.','Between R1 and R2 (R2 goes on to the capacitor).'],
 [8,'VCC','pwr','Supply, 4.5–16 V.','To the + rail, with a 100 nF capacitor to ground right beside it.']]},
inside:({ln,tx,bx,dot,tp,cmp,res,gnd,arrow})=>{let s='';
  s+=ln('40,30 90,30 90,50',8)+res(90,50,100,'5 kΩ')+ln('90,100 90,120')+res(90,120,170,'5 kΩ')+ln('90,170 90,205')+res(90,205,255,'5 kΩ')+ln('90,255 90,295 40,295',1);
  s+=ln('40,110 90,110',5)+dot(90,110)+ln('90,110 200,110')+tx(130,104,'⅔ supply',{s:11,c:PAL.yellow});
  s+=dot(90,188)+ln('90,188 200,188')+tx(130,182,'⅓ supply',{s:11,c:PAL.yellow});
  s+=ln('160,30 160,74 200,74',6)+ln('160,300 160,224 200,224',2);
  s+=cmp(200,92,'"⅔ watcher"')+cmp(200,206,'"⅓ watcher"');
  s+=arrow(270,92,300)+arrow(270,206,300)+bx(300,62,90,170,'Flip-flop\n(1-bit memory)\n\nR: off\nS: on');
  s+=ln('345,30 345,62',4);
  s+=arrow(390,100,430)+bx(430,82,70,36,'Output\nstage')+ln('500,100 530,100',3);
  s+=ln('390,196 418,196');s+=`<path d="M418 182v28M418 190l22 -14v-12M418 202l22 14v16" stroke="${PAL.ink2}" stroke-width="2" fill="none"/>`+ln('440,164 440,160 530,160',7)+gnd(440,232)+tx(440,262,'(pin 1)',{s:10,c:PAL.muted2});
  s+=tx(450,212,'discharge',{s:11,c:PAL.muted,a:'start'})+tx(450,226,'transistor',{s:11,c:PAL.muted,a:'start'});
  return {vb:'-50 0 660 320',s:s+tp(40,30,8,'t')+tp(40,295,1,'b')+tp(40,110,5,'l')+tp(160,30,6,'t')+tp(160,300,2,'b')+tp(345,30,4,'t')+tp(530,100,3,'r')+tp(530,160,7,'r')};},
minimal:{title:'NE555 blinker (9 V)',sub:'LED blinks ~1.5 times per second',rows:[
 [1,[[[],'GND']],'Ground: the − of the battery.'],
 [2,[[['C:10 µF+'],'GND'],[[],'P6']],'Trigger: joined to pin 6 and to the timing capacitor. When the capacitor drops to ⅓, the output turns on.'],
 [3,[[['R:470 Ω','LED:r'],'GND']],'Output: drives the LED through its resistor.'],
 [4,[[[],'V9']],'Reset: tied to + so the timer always runs (low = stop).'],
 [5,[[['C:10 nF'],'GND']],'Control: a small capacitor to ground keeps the ⅔ point steady.'],
 [6,[[['R:47 kΩ'],'P7'],[[],'P2']],'Threshold: joined to pin 2. R2 goes from here to pin 7. At ⅔ the output turns off.'],
 [7,[[['R:1 kΩ'],'V9']],'Discharge: sits between R1 (to +) and R2 (to pin 6). Drains the capacitor through R2.'],
 [8,[[[],'V9'],[['C:100 nF'],'GND']],'Supply + (4.5–16 V), with a 100 nF decoupling capacitor right beside it.']]},
art:dipArt('NE555',8,'Timer',PAL.violet)});

(function(){
// ===== 3. 555 =====
const CAPS=[[100e-6,'100 µF'],[10e-6,'10 µF'],[1e-6,'1 µF'],[100e-9,'100 nF'],[10e-9,'10 nF']];
const T5={c:1,t:0,osc:null,ctxA:null};
choices('tCch',CAPS.map(c=>c[1]),1,i=>{T5.c=i;updSnd();});
const kR=v=>Math.pow(10,+v)*1000;
function p555(){const R1=kR($('tR1').value),R2=kR($('tR2').value),C=CAPS[T5.c][0];const th=0.693*(R1+R2)*C,tl=0.693*R2*C;return{R1,R2,C,th,tl,T:th+tl,f:1/(th+tl)};}
function updSnd(){if(T5.osc){const f=p555().f;T5.osc.frequency.value=Math.min(8000,Math.max(20,f));}}
['tR1','tR2'].forEach(id=>$(id).addEventListener('input',updSnd));
$('tSnd').onclick=()=>{try{if(T5.osc){T5.osc.stop();T5.osc=null;$('tSnd').textContent='🔊 Listen';return;}
  T5.ctxA=T5.ctxA||new (window.AudioContext||window.webkitAudioContext)();const o=T5.ctxA.createOscillator(),g=T5.ctxA.createGain();o.type='square';g.gain.value=0.05;o.connect(g);g.connect(T5.ctxA.destination);o.start();T5.osc=o;updSnd();$('tSnd').textContent='🔇 Stop';}catch(e){$('tSnd').textContent='sound unavailable';}};
const fmtK=r=>r>=1e6?(r/1e6).toFixed(1)+' MΩ':r>=1000?(r/1000).toFixed(r<10000?1:0)+' kΩ':r.toFixed(0)+' Ω';
const fmtF=f=>f>=1000?(f/1000).toFixed(2)+' kHz':f>=10?f.toFixed(0)+' Hz':f.toFixed(2)+' Hz';
function draw555(dt){T5.t+=dt;const P=p555(),c=$('c555'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  dip(ctx,60,40,['GND','TRIG','OUT','RESET','CTRL','THR','DIS','VCC'],'NE555',[2,3,6,7,8]);
  const slow=P.f<8,win=slow?4:3*P.T,t0=slow?T5.t-win:0;
  const vc=t=>{const ph=((t%P.T)+P.T)%P.T;return ph<P.th?1-(2/3)*Math.exp(-ph/((P.R1+P.R2)*P.C)):(2/3)*Math.exp(-(ph-P.th)/(P.R2*P.C));};
  const out=t=>{const ph=((t%P.T)+P.T)%P.T;return ph<P.th;};
  const gx=330,gw=450,X=t=>gx+(t-t0)/win*gw;
  [[30,90,'capacitor',k=>vc(k),PAL.blue],[150,60,'output (pin 3)',k=>out(k)?1:0,PAL.good]].forEach(([gy,gh,l,fn,col])=>{ctx.fillStyle=PAL.raised;ctx.fillRect(gx,gy,gw,gh);arrowText(ctx,l,gx-6,gy+gh/2+4,PAL.muted,11,'right');
    if(l==='capacitor'){[1/3,2/3].forEach(v=>{const yy=gy+gh-v*gh;ctx.strokeStyle=PAL.amber;ctx.setLineDash([4,4]);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gx,yy);ctx.lineTo(gx+gw,yy);ctx.stroke();ctx.setLineDash([]);arrowText(ctx,v<0.5?'⅓':'⅔',gx+gw+4,yy+4,PAL.amber,11,'left');});}
    ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();for(let px=0;px<=gw;px++){const t=t0+px/gw*win,v=fn(t),yy=gy+gh-4-v*(gh-8);px?ctx.lineTo(gx+px,yy):ctx.moveTo(gx+px,yy);}ctx.stroke();});
  const on=slow?out(T5.t):true,b=slow?(on?1:0):P.th/P.T;
  const lx=250,ly=120;if(b>0.02){const g=ctx.createRadialGradient(lx,ly,2,lx,ly,40);g.addColorStop(0,`rgba(239,68,68,${b})`);g.addColorStop(1,'rgba(239,68,68,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(lx,ly,40,0,7);ctx.fill();}
  ctx.fillStyle=`rgba(239,68,68,${0.25+0.75*b})`;ctx.beginPath();ctx.arc(lx,ly,12,0,7);ctx.fill();arrowText(ctx,'LED',lx,ly+30,PAL.muted,11);
  arrowText(ctx,'R1 '+fmtK(P.R1)+' · R2 '+fmtK(P.R2)+' · C '+CAPS[T5.c][1],gx,240,PAL.ink,13,'left');
  arrowText(ctx,'→ '+fmtF(P.f)+'   (on '+Math.round(P.th/P.T*100)+'% of the time)',gx,262,PAL.yellow,15,'left');
  arrowText(ctx,slow?'slow enough to see it blink':P.f<25?'blinking fast':P.f<20000?'too fast to see: it\'s a tone! Press Listen':'ultrasonic',gx,284,PAL.muted,12,'left');}
loop((dt,now)=>{draw555(dt);});
})();
