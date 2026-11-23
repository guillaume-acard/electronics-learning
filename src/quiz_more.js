// ===== More challenges for the circuits (generated block) =====
const QM_T=80,QM_B=280;
function qmMeter(ctx,x,y,label,val,col){ctx.fillStyle='#111c2e';ctx.strokeStyle=col||'#fbbf24';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,150,64,8);ctx.fill();ctx.stroke();txt(ctx,label,x+75,y+22,'#94a3b8',12);txt(ctx,val,x+75,y+50,'#fff',18);}
function qmSeg(ctx,x,y,s,on,dim){const G={a:[10,0,40,8],g:[10,49,40,8],d:[10,98,40,8],f:[2,8,8,41],b:[50,8,8,41],e:[2,57,8,41],c:[50,57,8,41]};ctx.fillStyle='#0a0a0a';ctx.fillRect(x-10,y-10,60*s+20,106*s+20);ctx.save();ctx.translate(x,y);ctx.scale(s,s);Object.entries(G).forEach(([k,[a,b,w,h]])=>{ctx.fillStyle=on.includes(k)?(dim?'#7f1d1d':'#ef4444'):'#2a1416';ctx.fillRect(a,b,w,h);});ctx.restore();}

// A. Floating input
Q.push({topic:'Sensors',link:'sebtn',type:'pick',title:'The counter that counts by itself',prompt:'A push button connects the CLOCK input of a CD4017 to +9 V. When nobody touches it, the counter still <b>counts randomly</b>. What belongs in the gap, between the input and −?',
 options:['A 10 kΩ resistor','A 100 µF capacitor','A wire','Nothing: it\'s a faulty chip'],correct:0,
 draw(ctx,S){const a=S.ans,t=S.ta||0;part(ctx,'batt',80,QM_T,80,QM_B,{label:'9 V',left:true});wire(ctx,[[80,QM_T],[200,QM_T]]);part(ctx,'switch',200,QM_T,280,QM_T,{closed:false,label:'button (released)'});wire(ctx,[[280,QM_T],[360,QM_T],[360,150]]);dot(ctx,360,150);
  wire(ctx,[[360,150],[470,150]]);chipBox(ctx,470,120,130,90,'CD4017','CLK input');part(ctx,a===null?'gap':['res','cap','wire','empty'][a],360,150,360,250,{label:a===0?'10 kΩ':a===1?'100 µF':''});wire(ctx,[[360,250],[360,QM_B],[80,QM_B]]);
  const floating=a!==0&&a!==2;const v=floating?0.5+0.45*Math.sin(t*23)*Math.sin(t*3.1):0;txt(ctx,'input: '+(floating?(v>0.6?'1':v<0.4?'0':'??')+' (floating, picks up noise)':'0 (held low)'),535,240,floating?'#ef4444':'#10b981',13);
  if(a===2)txt(ctx,'wire: pressing the button now shorts the battery! 💥',360,QM_B+30,'#ef4444',13);},
 explain:['✓ A <b>pull-down</b> resistor gently holds the input at 0 V when the button is released, and is weak enough that pressing the button still pulls it up to 9 V. That\'s the 10 kΩ on the reset pins of the dice (projects 13–15).',
  'A capacitor only slows changes: the input still floats and drifts.','With a wire, the input is stuck at 0 V, and pressing the button connects + straight to −: a short circuit!','The chip is fine: a CMOS input connected to nothing "floats" and reads random 0s and 1s from electrical noise. It needs a pull-down.']});

// B. Bounce
Q.push({topic:'Sensors',link:'sebtn',type:'mc',title:'One press, three counts',prompt:'You clock a CD4518 counter with a push button (with its pull-down). Sometimes <b>one press adds 2 or 3</b> instead of 1. Why?',
 options:['The metal contacts bounce for a few milliseconds','The battery is too weak','The pull-down resistor is too big','The counter counts both edges'],correct:0,
 draw(ctx,S){const x=60,y=60,w=680,h=200;ctx.fillStyle='#111c2e';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#2a3650';ctx.strokeRect(x,y,w,h);txt(ctx,'button voltage, zoomed on the first 20 ms of a press',x+8,y+18,'#94a3b8',12,'left');
  ctx.strokeStyle='#f59e0b';ctx.lineWidth=2.5;ctx.beginPath();for(let i=0;i<=400;i++){const q=i/400*0.02;let v=q<0.003?0:(q<0.011?(Math.sin((q-0.003)*2600)>-0.2?1:0):1);const px=x+i/400*w,py=y+h-20-v*(h-60);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();
  if(S.ans!==null){txt(ctx,'each spike = one more count →',x+w/2,y+h+28,'#fbbf24',13);}},
 explain:['✓ Mechanical contacts <b>bounce</b> like a dropped ball for 1–10 ms, so a fast counter sees several presses. Fix: a 100 nF capacitor across the button, or ignore changes for ~20 ms in code. See the <b>Sensors → Push button</b> page.',
  'A weak battery makes things dimmer, it doesn\'t add counts.','The pull-down size doesn\'t create extra pulses.','The CD4518 counts on one edge only (rising CLK). The extra counts come from the contact bouncing.']});

// C. LDR divider direction
Q.push({topic:'Sensors',link:'seldr',type:'mc',title:'More light on the divider',prompt:'The <b>LDR is on top</b> (to +5 V) and a <b>10 kΩ</b> resistor at the bottom (to 0 V). It gets brighter. What does the middle voltage do?',
 options:['It rises','It falls','It stays the same','It goes negative'],correct:0,
 draw(ctx,S){const L=S.ans!==null?0.5+0.5*Math.sin((S.ta||0)*1.5):0.3;const lux=Math.pow(10,-1+L*5),R=Math.min(1e6,7000*Math.pow(lux/10,-0.75)),V=5*10000/(R+10000);
  glowAt(ctx,120,80,L,'250,204,21',70);ctx.fillStyle=`rgba(250,204,21,${0.2+0.8*L})`;ctx.beginPath();ctx.arc(120,80,26,0,7);ctx.fill();
  txt(ctx,'+5 V',330,40,'#ef4444',12);part(ctx,'ldr',330,50,330,150,{label:S.ans!==null?'LDR '+fmtOhm(R):'LDR'});dot(ctx,330,165);wire(ctx,[[330,150],[330,180]]);part(ctx,'res',330,180,330,270,{label:'10 kΩ'});txt(ctx,'0 V',330,292,'#94a3b8',12);
  wire(ctx,[[330,165],[420,165]]);if(S.ans!==null)qmMeter(ctx,430,133,'middle voltage',V.toFixed(2)+' V');},
 explain:['✓ More light → the LDR\'s resistance drops → it "pulls" harder towards +5 V than the 10 kΩ pulls towards 0 V → the middle point rises. Swap them and it would fall instead (that\'s how the night light reacts to darkness).',
  'It falls only if the LDR is at the bottom. Here it is on top.','The LDR changes resistance, so the ratio changes, so the voltage changes.','A divider between 0 V and +5 V always stays between 0 and 5 V.']});

// D. LM35 reading
Q.push({topic:'Sensors',link:'selm35',type:'value',title:'Read the LM35',prompt:'Your multimeter shows <b>0.27 V</b> on the LM35\'s output. What temperature is it?',
 slider:{min:0,max:60,def:10,unit:'°C',fmt:v=>Math.round(v)+' °C',val:v=>Math.round(v)},judge:v=>Math.abs(v-27)<=1,
 draw(ctx,S){ctx.fillStyle='#111827';ctx.beginPath();ctx.arc(200,150,50,Math.PI,0);ctx.lineTo(250,190);ctx.lineTo(150,190);ctx.closePath();ctx.fill();txt(ctx,'LM35',200,165,'#cbd5e1',15);
  ['+Vs','Vout','GND'].forEach((l,i)=>{const x=165+i*35;W(ctx,[[x,190],[x,250]],'#9ca3af',3);txt(ctx,l,x,268,i===1?'#fbbf24':'#94a3b8',11);});wire(ctx,[[200,250],[200,290],[420,290],[420,240]]);qmMeter(ctx,400,170,'multimeter','0.27 V');
  if(S.done)txt(ctx,'your answer: '+S.val+' °C → '+(S.val*10)+' mV',600,120,Math.abs(S.val-27)<=1?'#10b981':'#ef4444',14);},
 explain:()=>'10 mV per °C, so 0.27 V = 270 mV ÷ 10 = <b>27 °C</b>. That\'s the whole trick of the LM35 (projects 20 and 21).'});

// E. Resistor power
Q.push({topic:'Formulas',link:'formulas',type:'mc',title:'Will the resistor survive?',prompt:'A <b>100 Ω</b> resistor ends up with the full <b>9 V</b> across it. It\'s a normal <b>¼ W</b> resistor. What happens?',
 options:['It overheats: it has to burn 0.81 W','Fine: 9 V is a low voltage','Fine: resistors don\'t care about power','It only works if you flip it'],correct:0,
 draw(ctx,S){part(ctx,'batt',120,QM_T,120,QM_B,{label:'9 V',left:true});wire(ctx,[[120,QM_T],[340,QM_T]]);const hot=S.ans!==null?Math.min(1,(S.ta||0)/2):0;glowAt(ctx,390,QM_T,hot,'249,115,22',60);part(ctx,'res',340,QM_T,440,QM_T,{label:'100 Ω, ¼ W'});wire(ctx,[[440,QM_T],[600,QM_T],[600,QM_B],[120,QM_B]]);
  if(S.ans!==null){txt(ctx,'P = V² ÷ R = 9 × 9 ÷ 100 = 0.81 W',360,180,'#fbbf24',16);txt(ctx,hot>0.8?'🔥 smoking: more than 3 × its ¼ W rating':'getting hot…',360,215,'#ef4444',14);}},
 explain:['✓ Power = V² ÷ R = 81 ÷ 100 = <b>0.81 W</b>, three times what a ¼ W resistor can handle: it gets very hot, smells and burns. Use 1 W, or a bigger resistance. See <b>Formulas → Power</b>.',
  'The voltage alone isn\'t the question: power = V × I. With only 100 Ω, the current is 90 mA, and 9 V × 90 mA = 0.81 W.','Every resistor turns power into heat and has a maximum: ¼ W for the usual small ones.','Resistors have no direction.']});

// F. Two LEDs in series
Q.push({topic:'LED',link:'led',type:'mc',title:'Two LEDs, one resistor',prompt:'Two red LEDs (≈ 2 V each) <b>in series</b> with one <b>470 Ω</b> resistor on 9 V. About how much current flows?',
 options:['≈ 10 mA','≈ 19 mA','≈ 40 mA','0 mA: two LEDs need two resistors'],correct:0,
 draw(ctx,S){const on=S.ans!==null;part(ctx,'batt',90,QM_T,90,QM_B,{label:'9 V',left:true});wire(ctx,[[90,QM_T],[220,QM_T]]);part(ctx,'res',220,QM_T,320,QM_T,{label:'470 Ω'});wire(ctx,[[320,QM_T],[600,QM_T],[600,110]]);
  part(ctx,'led',600,110,600,180,{glow:on?0.8:0});part(ctx,'led',600,190,600,260,{glow:on?0.8:0});wire(ctx,[[600,180],[600,190]]);wire(ctx,[[600,260],[600,QM_B],[90,QM_B]]);
  if(on)txt(ctx,'I = (9 − 2 − 2) V ÷ 470 Ω ≈ 10.6 mA',330,190,'#fbbf24',15);},
 explain:['✓ In series the same current flows through everything. The LEDs take 2 V each, the resistor gets the rest: (9 − 4) ÷ 470 ≈ <b>10.6 mA</b>. That\'s how the dice face (project 13) lights pairs of dots with one resistor.',
  '19 mA would be one LED alone with less resistance. With two LEDs, there\'s even less voltage left for the resistor.','40 mA would burn the LEDs. The resistor keeps it near 10 mA.','In series, one resistor is enough: the current is the same everywhere in the loop.']});

// G. 555 frequency
Q.push({topic:'Microchips',link:'p8',type:'value',title:'A 555 that blinks once per second',prompt:'A 555 blinker with <b>R1 = 1 kΩ</b> and <b>C = 10 µF</b>. Choose <b>R2</b> so the LED blinks about <b>once per second</b>. (f = 1.44 ÷ ((R1 + 2 × R2) × C))',
 slider:{min:3,max:6,def:3.5,unit:'Ω',fmt:v=>fmtOhm(snapE12(Math.pow(10,v))),val:v=>snapE12(Math.pow(10,v))},judge:R=>{const f=1.44/((1000+2*R)*10e-6);return f>=0.6&&f<=1.6;},
 draw(ctx,S){chipBox(ctx,300,90,160,140,'NE555','astable');const R=S.done?S.val:null;const f=R?1.44/((1000+2*R)*10e-6):0;const on=R?((S.ta||0)*f)%1<0.55:false;
  part(ctx,'led',600,110,600,220,{glow:on?0.9:0});wire(ctx,[[460,160],[600,160]]);txt(ctx,'R1 = 1 kΩ',220,110,'#94a3b8',13);txt(ctx,'R2 = '+(R?fmtOhm(R):'?'),220,140,'#fbbf24',13);txt(ctx,'C = 10 µF',220,170,'#94a3b8',13);
  if(R)txt(ctx,'f = 1.44 ÷ ((1k + 2 × '+fmtOhm(R)+') × 10 µF) = '+(f<10?f.toFixed(2):f.toFixed(0))+' Hz',400,280,f>=0.6&&f<=1.6?'#10b981':'#ef4444',14);},
 explain:()=>'1 Hz means (R1 + 2 × R2) × C ≈ 1.44, so R1 + 2 R2 ≈ 144 kΩ and <b>R2 ≈ 68–72 kΩ</b>. Anything from 47 kΩ to 100 kΩ blinks about once per second. Project 8 uses 47 kΩ: about 1.5 times per second.'});

// H. 4017 count to 5
Q.push({topic:'Microchips',link:'s4017',type:'mc',title:'Count to 5 with a CD4017',prompt:'You want 5 LEDs to chase in a loop (Q0 → Q4, then back). Which output do you wire to <b>RESET</b> (pin 15)?',
 options:['Q4','Q5','Q6','Q9'],correct:1,
 draw(ctx,S){const n=S.ans===null?10:[4,5,6,9][S.ans];const step=Math.floor((S.ta||0)*4)%n;for(let i=0;i<10;i++){const x=110+i*62,on=S.ans!==null&&i===step;glowAt(ctx,x,150,on?0.9:0,'239,68,68',30);ctx.fillStyle=on?'#ef4444':'#3b1d1d';ctx.beginPath();ctx.arc(x,150,14,0,7);ctx.fill();txt(ctx,'Q'+i,x,190,i<5?'#cbd5e1':'#64748b',12);}
  if(S.ans!==null)txt(ctx,'reset on Q'+[4,5,6,9][S.ans]+' → counts '+n+' states (Q0…Q'+(n-1)+')',400,250,S.ans===1?'#10b981':'#ef4444',15);},
 explain:['Q4 resets as soon as it\'s reached: only Q0–Q3 ever light, 4 states.','✓ The moment Q5 turns on, it resets the counter to Q0, so you see Q0 → Q4: <b>5 states</b>. Rule: to count N states, reset with output Q<i>N</i>. The dice use Q6 for 6 faces.','Q6 gives 6 states (that\'s the dice).','Q9 gives 9 states, and resetting is useless for 10: just leave RESET to ground.']});

// I. Multiplexing
Q.push({topic:'Circuits',link:'p12',type:'mc',title:'Two displays, shared wires',prompt:'In the dice and the thermometer, both 7-segment displays share the <b>same 8 segment wires</b>. How can they show different digits?',
 options:['They are lit one at a time, switching every few ms','Each segment wire carries two voltages','The second display is a mirror of the first','They can\'t: both always show the same digit'],correct:0,
 draw(ctx,S){const slow=S.ans!==null,t=S.ta||0,which=slow?Math.floor(t*1.5)%2:-1;qmSeg(ctx,250,80,1.4,'abged',which===1);qmSeg(ctx,420,80,1.4,'abgcd',which===0);
  if(slow)txt(ctx,'slow motion: display '+(which+1)+' on, the other off',400,280,'#fbbf24',14);else txt(ctx,'shows "23"',400,280,'#94a3b8',14);},
 explain:['✓ <b>Multiplexing</b>: the Arduino sets the segments for digit 1 and switches on its transistor, then 4 ms later does the same for digit 2, and so on. Your eye blends it into two steady digits.','A wire is at one voltage at a time.','They are wired the same way, but switched separately.','With the trick of switching, they can (projects 12 and 20).']});

// J. Common cathode
Q.push({topic:'Circuits',link:'parts',type:'mc',title:'Where does COM go?',prompt:'The SC39-11SURKWA is a <b>common-cathode</b> display. Where does its COM pin go?',
 options:['To − (ground)','To + (5 V)','To + through a resistor','To any segment pin'],correct:0,
 draw(ctx,S){const ok=S.ans===0;qmSeg(ctx,330,60,1.6,ok?'abcdefg':'',false);txt(ctx,'COM',360,262,'#cbd5e1',13);wire(ctx,[[360,240],[360,250]]);if(S.ans!==null)txt(ctx,ok?'all cathodes to ground: segments light when their pin goes +':'cathodes at + : no LED can be forward-biased',400,295,ok?'#10b981':'#ef4444',14);},
 explain:['✓ "Common cathode" = all the LEDs\' minus ends are joined at COM. COM goes to ground, and each segment lights when its pin gets + through its resistor.','That\'s for common-<b>anode</b> displays. Here nothing would light.','Still the anode-side idea: wrong type.','COM is the shared return of every segment.']});

// K. Base resistor missing
Q.push({topic:'Transistor',link:'transistor',type:'mc',title:'No base resistor',prompt:'An Arduino pin (5 V) is wired <b>straight</b> to a BC547\'s base, with no resistor. What happens?',
 options:['Far too much base current: the pin and the transistor overheat','It works perfectly, just brighter','Nothing: a base needs no current','The transistor only works half the time'],correct:0,
 draw(ctx,S){npnQ(ctx,400,170,S.ans!==null);wire(ctx,[[200,170],[366,170]]);chipBox(ctx,90,130,110,80,'Arduino','pin 5 V');if(S.ans!==null){glowAt(ctx,380,170,0.8,'249,115,22',50);txt(ctx,'base = a diode to ground (0.7 V): 5 V straight in = huge current',400,260,'#ef4444',13);}},
 explain:['✓ The base–emitter junction is a diode: above 0.7 V its current shoots up. With no resistor, the pin tries to push far more than its ~20–40 mA: both get damaged. A 1 kΩ gives (5 − 0.7) ÷ 1 k ≈ 4 mA, plenty.','The LED/load current is set by the transistor and its own resistor, not by more base current, and the pin is overloaded.','A bipolar transistor needs a small base current to switch on; it must be limited by a resistor.','It switches on fully, but at the cost of an overloaded pin.']});

// L. Flyback diode direction
Q.push({topic:'Diode',link:'relay',type:'mc',title:'The relay\'s diode',prompt:'A transistor drives a relay coil. Which way must the <b>flyback diode</b> across the coil go?',
 options:['Stripe (cathode) towards +','Stripe towards the transistor (−)','Either way','No diode is needed with a relay'],correct:0,
 draw(ctx,S){txt(ctx,'+9 V',300,46,'#ef4444',12);wire(ctx,[[300,55],[300,90]]);part(ctx,'coil',300,90,300,210,{label:'relay coil'});wire(ctx,[[300,210],[300,240]]);npnQ(ctx,290,274,S.ans!==null);
  wire(ctx,[[300,90],[400,90]]);wire(ctx,[[300,210],[400,210]]);part(ctx,'diode',400,210,400,90,{label:S.ans===1?'diode (stripe down)':'diode (stripe up)',col:S.ans===null?WIRE:S.ans===0?'#10b981':'#ef4444'});
  if(S.ans===1)txt(ctx,'💥 short: + straight through the diode',560,260,'#ef4444',13,'left');if(S.ans===0)txt(ctx,'off normally; catches the spike',560,260,'#10b981',13,'left');},
 explain:['✓ Normally the diode is <b>reversed</b> (stripe to +) so it carries nothing. When the transistor switches off, the coil\'s voltage flips and the diode conducts, letting the energy loop round instead of zapping the transistor (projects 6, 7 and B).','Stripe down = forward-biased: it shorts the supply as soon as the transistor turns on.','Only one way protects without shorting.','The coil kick can reach tens of volts: without the diode the transistor eventually dies.']});

// M. 555 pin 5
Q.push({topic:'Microchips',link:'p17',type:'mc',title:'Pushing on pin 5',prompt:'In the siren, the slow 555 pulls the fast 555\'s <b>pin 5 (CTRL)</b> up through 10 kΩ. What does that do to the tone?',
 options:['Lower note','Higher note','Louder, same note','The tone stops'],correct:0,
 draw(ctx,S){chipBox(ctx,320,110,160,110,'NE555','tone');txt(ctx,'pin 5 ↑',260,165,'#fbbf24',15);if(S.ans!==null){const f=2+Math.sin((S.ta||0)*4)*0.8;ctx.strokeStyle='#60a5fa';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=200;i++){const x=520+i,y=165-30*Math.sign(Math.sin(i/200*Math.PI*2*f*2));i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}},
 explain:['✓ Pin 5 is the 555\'s "⅔ mark". Raise it and the capacitor must fill higher before each flip: every cycle takes longer → a <b>lower</b> note. Pull it down → higher. That\'s the pin-pon.','The opposite: pulling pin 5 down gives the higher note.','The output still swings 0–9 V: the volume stays the same.','The 555 keeps oscillating, just at another rhythm.']});

// N. Fuzz
Q.push({topic:'Circuits',link:'p18',type:'mc',title:'Why does clipping sound fuzzy?',prompt:'The fuzz pedal slices the tops and bottoms of the guitar wave flat. Why does that sound buzzy?',
 options:['A square-ish wave contains many extra harmonics','It only makes the sound louder','It removes the bass','It adds an echo'],correct:0,
 draw(ctx,S){const k=S.ans!==null?1:0;ctx.strokeStyle='#60a5fa';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=600;i++){const x=100+i,y=170-70*Math.sin(i/600*Math.PI*8);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  if(k){ctx.strokeStyle='#f97316';ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=600;i++){const x=100+i,y=170-Math.max(-35,Math.min(35,70*Math.sin(i/600*Math.PI*8)*3));i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();txt(ctx,'blue: clean string · orange: clipped (≈ square)',400,280,'#fbbf24',14);}},
 explain:['✓ Any wave shape is a mix of sine waves. A pure-ish string note is mostly one; a square wave adds 3×, 5×, 7×… the frequency (odd harmonics). Those extra high tones are the buzz. Same as the Ruby\'s overdrive, pushed further.','It is louder too, but the character changes because of the new harmonics.','The fundamental (the bass of the note) is still there.','Echo needs a delay; clipping is instant.']});

// O. LM339 ladder scale
Q.push({topic:'Circuits',link:'p21',type:'value',title:'Set the bar-graph scale',prompt:'In the bar thermometer, a current flows through a ladder of <b>100 Ω</b> rungs, and each rung is one segment step. The LM35 gives 10 mV/°C. Which ladder current gives <b>2 °C per segment</b>?',
 slider:{min:0.05,max:0.5,def:0.35,unit:'mA',fmt:v=>v.toFixed(2)+' mA',val:v=>Math.round(v*100)/100},judge:v=>v>=0.19&&v<=0.21,
 draw(ctx,S){const v=S.done?S.val/1000:null;for(let i=0;i<10;i++){const th=v?(800+100*i)*v:null,on=v?0.22>=th:false;ctx.fillStyle=on?'#22c55e':'#14301f';ctx.fillRect(140+i*52,120,40,90);if(v)txt(ctx,(th*100).toFixed(0)+'°',160+i*52,232,'#94a3b8',11);}
  txt(ctx,'room at 22 °C → LM35 = 0.22 V',400,90,'#cbd5e1',14);if(v)txt(ctx,'each step = '+(v*100*100).toFixed(1)+' °C',400,275,Math.abs(v*1000-0.2)<=0.01?'#10b981':'#ef4444',15);},
 explain:()=>'2 °C = 20 mV. Ohm\'s law: I = U ÷ R = 0.020 V ÷ 100 Ω = <b>0.2 mA</b>. That\'s what the trimmer sets in project 21 (with 800 Ω at the bottom, the first segment lights at 16 °C).'});
// ===== end of more challenges =====
