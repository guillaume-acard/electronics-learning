// ===== 3914: data (pinout, inside, minimal circuit, hero art) + its demo =====
CHIP('3914',{
pinout:{pkg:'dip',title:'LM3914N (DIP-18)',pins:[
 [1,'LED1','out','Output for LED 1 (lowest level). Sinks a regulated current: LED cathode here, anode to +.','Bar-graph segment 1 (cathode side).'],
 [2,'V−','gnd','Ground.','To the − rail.'],
 [3,'V+','pwr','Supply, 3–25 V.','To +, with 2.2–10 µF to ground if the wires are long.'],
 [4,'RLO','ctl','Bottom of the internal 10-resistor ladder: the voltage where LED 1 starts.','To ground for a scale starting at 0 V.'],
 [5,'SIG','in','The signal to display.','From the sensor (LM35 output), a divider, or audio through a diode.'],
 [6,'RHI','ctl','Top of the ladder: the voltage that lights LED 10.','To REF OUT, or to a trimmer wiper to set the full scale.'],
 [7,'REF OUT','out','Reference output: always 1.25 V above REF ADJ. The current drawn from it × 10 = LED current.','A resistor to ground sets brightness: 1.25 V ÷ R × 10 (2.2 kΩ ≈ 6 mA).'],
 [8,'REF ADJ','ctl','Reference adjust: the reference sits 1.25 V above this pin.','To ground (simplest).'],
 [9,'MODE','ctl','Bar or dot: connected to V+ = bar mode, left open = dot mode.','To V+ for a bar.'],
 [10,'LED10','out','Output for LED 10 (highest).',''],[11,'LED9','out','Output for LED 9.',''],[12,'LED8','out','Output for LED 8.',''],[13,'LED7','out','Output for LED 7.',''],[14,'LED6','out','Output for LED 6.',''],[15,'LED5','out','Output for LED 5.',''],[16,'LED4','out','Output for LED 4.',''],[17,'LED3','out','Output for LED 3.',''],[18,'LED2','out','Output for LED 2.','']]},
inside:({ln,tx,bx,dot,tp,cmp,res,gnd,arrow})=>{let s='';
  s+=ln('40,60 120,60',5)+tp(40,60,5,'l')+bx(120,40,80,40,'Buffer');
  s+=ln('360,26 330,26',6)+tp(360,26,6,'t')+ln('330,26 330,40');
  for(let i=0;i<10;i++){const y=40+i*24;s+=`<rect x="324" y="${y+3}" width="12" height="18" fill="none" stroke="${PAL.muted}" stroke-width="1.5"/>`;}
  s+=ln('330,280 330,300',4)+tp(330,300,4,'b');
  s+=ln('200,60 230,60 230,270');for(let i=0;i<10;i++){const y=274-i*24;s+=ln(`230,${y} 250,${y}`)+`<path d="M250 ${y-9}L272 ${y}L250 ${y+9}Z" fill="${PAL.panel}" stroke="${PAL.ink2}" stroke-width="1.5"/>`+ln(`324,${y-10} 272,${y-10} 262,${y-6}`);}
  s+=tx(260,24,'10 comparators',{s:11,c:PAL.muted});
  s+=bx(380,90,90,120,'Current\nregulated\nLED\noutputs',PAL.good);
  const outs=[1,18,17,16,15,14,13,12,11,10];outs.forEach((n,i)=>{const y=276-i*25;s+=ln(`470,${y>200?Math.min(y,205):Math.max(y,95)} 470,${y} 540,${y}`,n)+tp(540,y,n,'r');});
  s+=bx(80,170,110,50,'Reference\n1.25 V')+ln('40,190 80,190',8)+tp(40,190,8,'l')+ln('190,195 210,195 210,250 40,250',7)+tp(40,250,7,'l');
  s+=ln('40,120 120,120',9)+tp(40,120,9,'l')+tx(150,124,'bar / dot',{s:11,c:PAL.muted});
  s+=tx(40,18,'3 V+ / 2 V− power everything',{a:'start',s:11,c:PAL.muted});
  return {vb:'-70 0 700 330',s};},
minimal:{title:'LM3914: LM35 bar-graph thermometer',sub:'0–50 °C, 5 °C per LED (project 21)',rows:[
 [1,[[['LED:g'],'V9']],'LED 1 (lowest). Each LED: anode to +, cathode to its pin (the chip sinks a regulated current).'],
 [2,[[[],'GND']],'V−: ground.'],
 [3,[[[],'V9'],[['C:10 µF+'],'GND']],'V+: supply, decoupled.'],
 [4,[[[],'GND']],'RLO: bottom of the scale = 0 V.'],
 [5,[[[],'IN:LM35 Vout']],'SIG: the voltage to display.'],
 [6,[[[],'T:trimmer wiper']],'RHI: top of the scale, from the trimmer (0.50 V = 50 °C).'],
 [7,[[['R:2.2 kΩ'],'GND'],[['POT:10 kΩ'],'GND']],'REF OUT (1.25 V): 2.2 kΩ sets the LED current; the trimmer between here and ground feeds RHI.'],
 [8,[[[],'GND']],'REF ADJ: ground, so REF OUT = 1.25 V.'],
 [9,[[[],'V9']],'MODE: to + for a bar (open = dot).'],
 [10,[[['LED:r'],'V9']],'LED 10 (highest).'],[11,[[['LED:r'],'V9']],'LED 9.'],[12,[[['LED:r'],'V9']],'LED 8.'],[13,[[['LED:r'],'V9']],'LED 7.'],
 [14,[[['LED:g'],'V9']],'LED 6.'],[15,[[['LED:g'],'V9']],'LED 5.'],[16,[[['LED:g'],'V9']],'LED 4.'],[17,[[['LED:g'],'V9']],'LED 3.'],[18,[[['LED:g'],'V9']],'LED 2.']]},
art:dipArt('LM3914',18,'Bar-graph driver',PAL.green)});

(function(){
function draw3914(){const c=document.getElementById('c3914');if(!c||!c.offsetParent)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const v=+document.getElementById('lm39In').value,hi=+document.getElementById('lm39Hi').value,dot=document.getElementById('lm39Dot').checked;let n=0;for(let i=1;i<=10;i++)if(v>=hi*i/10)n=i;
  ctx.font='13px system-ui';ctx.textAlign='left';ctx.fillStyle=PAL.ink2;ctx.fillText('SIG = '+(v*1000).toFixed(0)+' mV',30,40);ctx.fillText('each step = RHI ÷ 10 = '+(hi*100).toFixed(0)+' mV',30,62);
  for(let i=0;i<10;i++){const y=250-i*22,th=hi*(i+1)/10,on=dot?i===n-1:i<n;ctx.fillStyle=PAL.raised;ctx.fillRect(250,y-9,90,18);ctx.fillStyle=PAL.muted;ctx.font='11px system-ui';ctx.textAlign='center';ctx.fillText((th*1000).toFixed(0)+' mV',295,y+4);
    ctx.fillStyle=v>=th?PAL.green:PAL.slate;ctx.beginPath();ctx.moveTo(355,y-8);ctx.lineTo(375,y);ctx.lineTo(355,y+8);ctx.fill();
    ctx.fillStyle=on?PAL.green:'#14301f';if(on){ctx.shadowBlur=12;ctx.shadowColor=PAL.green;}ctx.fillRect(420,y-9,160,18);ctx.shadowBlur=0;ctx.fillStyle=PAL.muted2;ctx.textAlign='left';ctx.fillText('LED'+(i+1),590,y+4);}
  ctx.fillStyle=PAL.yellow;ctx.font='14px system-ui';ctx.textAlign='left';ctx.fillText(n?(dot?'dot on LED'+n:n+' LED'+(n>1?'s':'')+' lit'):'below the first step',30,110);
  ctx.fillStyle=PAL.muted;ctx.font='12px system-ui';ctx.fillText('ladder',275,30);ctx.fillText('comparators',340,30);ctx.fillText('LEDs',480,30);}
['lm39In','lm39Hi','lm39Dot'].forEach(id=>document.getElementById(id).addEventListener('input',draw3914));
loop((dt,now)=>{draw3914();});
})();
