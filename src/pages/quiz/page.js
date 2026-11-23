
// ================= Quiz engine =================
// ================= Questions =================
// each: {topic, link, type, title, prompt, options|slider|slots, correct, judge, draw(ctx,S,dt), explain(S)}
const LOOP={T:90,B:270,L:100,R:600};
const Q=[];

// 1. LED needs a resistor
Q.push({topic:'LED',link:'led',type:'pick',title:'An LED on a 9 V battery',prompt:'This red LED should light up safely from a 9 V battery. Which component goes in the gap?',
 options:['Resistor','Capacitor','Diode','Plain wire'],correct:0,
 draw(ctx,S){const {T,B,L,R}=LOOP,a=S.ans,ta=S.ta;let glow=0,burnt=false,flow=0;
  if(a===0){glow=0.85;flow=1;}else if(a===1){glow=Math.exp(-ta/0.35);flow=glow;}else if(a===2){burnt=ta>0.5;glow=burnt?0:1;flow=burnt?0:2;}else if(a===3){burnt=ta>0.15;glow=burnt?0:1;flow=burnt?0:3;}
  S.off=(S.off||0)+flow*S.dt*60;
  part(ctx,'batt',L,T,L,B,{label:'9 V',left:true});wire(ctx,[[L,T],[300,T]]);
  part(ctx,a===null?'gap':['res','cap','diode','wire'][a],300,T,400,T,{label:a===0?'470 Ω':''});
  wire(ctx,[[400,T],[R,T],[R,150]]);part(ctx,'led',R,150,R,230,{glow,burnt,label:'red LED'});wire(ctx,[[R,230],[R,B],[L,B]]);
  if(flow>0.05)dots(ctx,[[L,B-20],[L,T],[R,T],[R,B],[L,B]],S.off);
  if(burnt)txt(ctx,'LED burnt out!',R,B+30,PAL.bad,14);},
 explain:['✓ The resistor limits the current. Here (9 − 2) V ÷ 470 Ω ≈ 15 mA, so the LED is safe and bright.',
  'A capacitor in series only lets current flow while it fills, so the LED flashes once and then stays dark. Steady DC is blocked.',
  'A diode only drops 0.7 V and does nothing to limit the current, so the LED still burns.',
  'With a plain wire, nothing limits the current: the LED floods and burns out instantly.']});

// 2. LED resistor value
Q.push({topic:'LED',link:'led',type:'value',title:'Choose the LED resistor',prompt:'Same circuit: a red LED (≈ 2 V) on 9 V. You want about 10 mA. Choose the resistor.',
 slider:{min:1,max:5,def:2,unit:'Ω',fmt:v=>fmtOhm(snapE12(Math.pow(10,v))),val:v=>snapE12(Math.pow(10,v))},
 judge:R=>{const I=7/R*1000;return I>=6&&I<=15;},
 draw(ctx,S){const {T,B,L,R}=LOOP;const Rv=S.done?S.val:null;let I=Rv?7/Rv*1000:0,glow=0,burnt=false;
  if(Rv){if(I>30&&S.ta>0.4)burnt=true;glow=burnt?0:Math.min(1,Math.sqrt(I/20));}
  S.off=(S.off||0)+(burnt?0:Math.min(I,40)/10)*S.dt*60;
  part(ctx,'batt',L,T,L,B,{label:'9 V',left:true});wire(ctx,[[L,T],[300,T]]);
  part(ctx,Rv?'res':'gap',300,T,400,T,{label:Rv?fmtOhm(Rv):''});wire(ctx,[[400,T],[R,T],[R,150]]);
  part(ctx,'led',R,150,R,230,{glow,burnt,label:'red, 2 V'});wire(ctx,[[R,230],[R,B],[L,B]]);
  if(Rv&&!burnt)dots(ctx,[[L,B-20],[L,T],[R,T],[R,B],[L,B]],S.off);
  if(Rv)txt(ctx,'current = (9 − 2) V ÷ '+fmtOhm(Rv)+' = '+(I<10?I.toFixed(1):I.toFixed(0))+' mA',350,B+40,I>20?PAL.bad:I<5?Y:PAL.good,14);},
 explain:S=>'R = (9 V − 2 V) ÷ 0.010 A = <b>700 Ω</b>, so the nearest standard values are <b>680 Ω or 820 Ω</b>. Anything from about 470 Ω to 1.2 kΩ (6–15 mA) is fine. Below ~350 Ω you go over 20 mA and the LED burns.'});

// 3. Reverse battery with diode
Q.push({topic:'Diode',link:'diode',type:'mc',title:'Battery in backwards',prompt:'Someone put the battery in <b>backwards</b>. There is a diode in series with it. What happens?',
 options:['The LED lights normally','Nothing lights up, and nothing is damaged','The LED lights dimly','The diode explodes'],correct:1,
 draw(ctx,S){const {T,B,L,R}=LOOP;
  part(ctx,'batt',L,B,L,T,{label:'9 V',left:true,flip:true});txt(ctx,'battery reversed!',L+14,B+26,PAL.redSoft,13,'left');wire(ctx,[[L,T],[230,T]]);part(ctx,'diode',230,T,330,T,{label:'protection diode',col:S.ans!==null?PAL.redSoft:WIRE});
  wire(ctx,[[330,T],[400,T]]);part(ctx,'res',400,T,500,T,{label:'470 Ω'});wire(ctx,[[500,T],[R,T],[R,150]]);part(ctx,'led',R,150,R,230,{glow:0});wire(ctx,[[R,230],[R,B],[L,B]]);
  if(S.ans!==null){txt(ctx,'⛔ blocked: the valve is shut',280,T+46,PAL.redSoft,14);txt(ctx,'No current flows, so the circuit is safe',350,B+40,PAL.good,14);}},
 explain:['The battery pushes backwards, and the diode is a one-way valve that refuses that direction. No current flows, so the LED stays off.',
  '✓ The diode blocks the backward push like a closed valve. No current flows, so nothing lights and nothing is harmed. That\'s why toys and pedals have this diode.',
  'No current can flow at all backwards through the diode, not even a little.',
  'A diode blocks reverse voltage up to its rating (1N4007: 1000 V). 9 V is nothing for it.']});

// 4. Capacitor charging current
Q.push({topic:'Capacitor',link:'capacitor',type:'mc',title:'Closing the switch',prompt:'An empty capacitor, a resistor and a battery. You close the switch. What does the current do?',
 options:['It stays constant','It starts big, then falls to zero','It starts at zero, then grows','It flows back and forth forever'],correct:1,
 draw(ctx,S){const {T,B,L}=LOOP,R=440;const on=S.ans!==null,ta=on?S.ta:0,tau=1.2,I=on?Math.exp(-ta/tau):0,q=on?1-Math.exp(-ta/tau):0;
  S.off=(S.off||0)+I*S.dt*120;
  part(ctx,'batt',L,T,L,B,{label:'9 V',left:true});wire(ctx,[[L,T],[180,T]]);part(ctx,'switch',180,T,260,T,{closed:on});wire(ctx,[[260,T],[290,T]]);
  part(ctx,'res',290,T,390,T,{label:'10 kΩ'});wire(ctx,[[390,T],[R,T],[R,140]]);part(ctx,'cap',R,140,R,220,{label:'1000 µF'});wire(ctx,[[R,220],[R,B],[L,B]]);
  if(I>0.03)dots(ctx,[[L,B-20],[L,T],[R,T],[R,B],[L,B]],S.off);
  ctx.fillStyle=PAL.raised;ctx.fillRect(R-50,150,12,60);ctx.fillStyle=PAL.blue;ctx.fillRect(R-50,150+60*(1-q),12,60*q);txt(ctx,'charge',R-44,226,PAL.blue,10);
  if(on){const t1=Math.max(6,ta);miniGraph(ctx,540,50,240,90,t=>t<=ta?Math.exp(-t/tau):null,0,t1,Y,0,1.05,'current');miniGraph(ctx,540,190,240,90,t=>t<=ta?1-Math.exp(-t/tau):null,0,t1,PAL.blue,0,1.05,'capacitor charge');}},
 explain:['The current can\'t stay constant: as the capacitor fills it pushes back, so the flow slows down.',
  '✓ At first the empty capacitor doesn\'t push back, so the current is big. As it fills, it pushes back harder and the current fades to zero. "Full" means it is balanced with the battery.',
  'It\'s the reverse: the biggest current is at the very start, when the capacitor is empty.',
  'With a steady DC battery, the capacitor fills once and then nothing flows. Back-and-forth flow only happens with AC.']});

// 5. Smoothing: what to add
const ripple=(t,tau)=>{const T1=1/0.9;let v=0;const ph=t%T1;const vin=Math.max(0,Math.sin(2*Math.PI*t*0.9));if(tau===0)return vin;const peakT=T1/4;const since=ph>=peakT?ph-peakT:ph+T1-peakT;const dec=Math.exp(-since/tau);return Math.max(vin,dec);};
Q.push({topic:'Capacitor',link:'capacitor',type:'pick',title:'Stop the flicker',prompt:'After the diode, the voltage arrives in <b>bumps</b>, so the lamp flickers. Which part in the gap (from the output to ground) makes it steady?',
 options:['A big capacitor','A resistor','Another diode','A plain wire'],correct:0,
 draw(ctx,S){const {T,B,L}=LOOP,t=S.time;const a=S.ans;let v;
  if(a===0)v=ripple(t,8);else if(a===3)v=0;else if(a===1)v=ripple(t,0)*0.8;else v=ripple(t,0);
  part(ctx,'ac',L,B,L,T,{label:'AC in',left:true});wire(ctx,[[L,T],[180,T]]);part(ctx,'diode',180,T,260,T);wire(ctx,[[260,T],[470,T]]);
  part(ctx,a===null?'gap':['cap','res','diode','wire'][a],340,T,340,B,{label:a===0?'1000 µF':a===1?'1 kΩ':''});dot(ctx,340,T);dot(ctx,340,B);
  wire(ctx,[[470,T],[470,150]]);part(ctx,'lamp',470,150,470,210,{glow:v});wire(ctx,[[470,210],[470,B],[L,B]]);
  if(a===3){txt(ctx,'💥 short circuit: everything flows through the wire!',300,B+40,PAL.bad,14);}
  miniGraph(ctx,540,80,240,150,tt=>a===null?ripple(tt,0):a===0?ripple(tt,8):a===3?0:ripple(tt,0)*(a===1?0.8:1),t-4,t,PAL.good,-0.05,1.1,'voltage at the lamp');},
 explain:['✓ The capacitor is a water tower: it fills at each bump and tops up the gaps, so the lamp stays steady.',
  'A resistor just wastes some current. It can\'t store energy to fill the gaps, so the lamp still flickers.',
  'Another diode can\'t store anything either: the gaps stay empty.',
  'A wire from the output to ground is a short circuit. Nothing reaches the lamp and the diode overheats.']});

// 6. Smoothing: size
Q.push({topic:'Capacitor',link:'capacitor',type:'mc',title:'How big should it be?',prompt:'Now choose the size of that smoothing capacitor for a lamp drawing a fair amount of current.',
 options:['10 nF','1 µF','1000 µF'],correct:2,
 draw(ctx,S){const {T,B,L}=LOOP,t=S.time,a=S.ans;const tau=a===null?0:[0.004,0.1,8][a];const v=ripple(t,tau);
  part(ctx,'ac',L,B,L,T,{label:'AC in',left:true});wire(ctx,[[L,T],[180,T]]);part(ctx,'diode',180,T,260,T);wire(ctx,[[260,T],[470,T]]);
  part(ctx,a===null?'gap':'cap',340,T,340,B,{label:a===null?'':['10 nF','1 µF','1000 µF'][a]});dot(ctx,340,T);dot(ctx,340,B);
  wire(ctx,[[470,T],[470,150]]);part(ctx,'lamp',470,150,470,210,{glow:v});wire(ctx,[[470,210],[470,B],[L,B]]);
  miniGraph(ctx,540,80,240,150,tt=>ripple(tt,tau),t-4,t,PAL.good,-0.05,1.1,'voltage at the lamp');},
 explain:['10 nF is a thimble: it empties almost instantly between bumps, so the flicker barely changes. Small caps are for fast things (noise, high frequencies).',
  '1 µF is still a cup: it helps a little, but the dips are still deep.',
  '✓ Power smoothing needs a bathtub: hundreds to thousands of µF. It holds enough charge to keep the lamp fed between bumps.']});

// 7. Flyback
Q.push({topic:'Diode',link:'diode',type:'mc',title:'Switching off a motor',prompt:'A transistor switches a motor off suddenly. There is <b>no</b> flyback diode. What happens at that instant?',
 options:['The motor stops gently','A big voltage spike appears that can destroy the transistor','The motor spins backwards','The battery gets recharged'],correct:1,
 draw(ctx,S){const {T,B,L}=LOOP;const on=S.ans===null?((S.time%3)<2):false,ta=S.ans!==null?S.ta:0;S.spin=(S.spin||0)+(on?1:Math.max(0,1-ta))*S.dt*14;
  part(ctx,'batt',L,T,L,B,{label:'12 V',left:true});wire(ctx,[[L,T],[400,T],[400,110]]);part(ctx,'motor',400,110,400,170,{spin:S.spin});wire(ctx,[[400,170],[400,186]]);
  npnQ(ctx,390,220,on);wire(ctx,[[400,254],[400,B],[L,B]]);wire(ctx,[[300,220],[356,220]]);txt(ctx,on?'ON':'OFF',290,224,on?PAL.good:PAL.muted,13,'right');
  if(S.ans!==null){const sp=ta<0.6;if(sp){ctx.strokeStyle=PAL.highlight;ctx.lineWidth=2;for(let i=0;i<7;i++){const a=Math.random()*6.28,r=10+Math.random()*20;ctx.beginPath();ctx.moveTo(410,200);ctx.lineTo(410+r*Math.cos(a),200+r*Math.sin(a));ctx.stroke();}}
    miniGraph(ctx,540,70,240,170,tt=>tt<0?12*0+0:12+300*Math.exp(-tt/0.08),-0.3,2,PAL.redSoft,0,60,'voltage across the transistor');txt(ctx,'spike ≈ 300 V!',700,110,PAL.bad,14);}},
 explain:['A motor coil acts like a heavy spinning water wheel: its current can\'t stop instantly, so it doesn\'t stop gently on its own.',
  '✓ The coil\'s current has inertia. When it is cut suddenly, it forces a huge voltage spike (a "water hammer") across the transistor. A flyback diode gives the current a safe loop to fade out.',
  'The motor keeps turning the same way for a moment. The danger is the electrical spike, not the direction.',
  'The energy goes into a spike and sparks, not back into the battery.']});

// 8. Micro to motor
Q.push({topic:'Transistor',link:'transistor',type:'pick',title:'A chip that drives a motor',prompt:'A microcontroller pin (≈ 20 mA max) must switch a 500 mA motor powered by a 9 V battery. What goes in the gap?',
 options:['A transistor (with a base resistor)','A big capacitor','A diode','Nothing, just a wire to the motor'],correct:0,
 draw(ctx,S){const a=S.ans,ta=S.ta;let spin=0,hot=0;if(a===0)spin=1;else if(a===1)spin=Math.exp(-ta/0.4);else if(a===2||a===3){spin=0.08;hot=Math.min(1,ta);}
  S.spin=(S.spin||0)+spin*S.dt*15;
  chipBox(ctx,60,120,110,100,'micro-','controller',hot);txt(ctx,'pin',175,165,Y,11,'left');wire(ctx,[[170,175],[260,175]]);
  if(a===null){part(ctx,'gap',260,175,380,175);wire(ctx,[[380,175],[420,175]]);}else if(a===0){part(ctx,'res',260,175,330,175,{label:'1 kΩ'});wire(ctx,[[330,175],[376,175]]);npnQ(ctx,410,175,true);wire(ctx,[[420,141],[420,120]]);wire(ctx,[[420,209],[420,280]]);}
  else part(ctx,['','cap','diode','wire'][a],260,175,420,175);
  if(a!==0)wire(ctx,[[420,175],[420,120]]);
  part(ctx,'motor',420,60,420,120,{spin:S.spin});wire(ctx,[[420,60],[420,30],[650,30],[650,90]]);part(ctx,'batt',650,90,650,250,{label:'9 V'});wire(ctx,[[650,250],[650,280],[115,280],[115,220]]);
  if(a!==0&&a!==null)wire(ctx,[[420,280],[420,280]]);
  txt(ctx,'common ground',380,298,PAL.blue,11);
  if(a!==null)txt(ctx,a===0?'Motor at full speed, chip cool ✓':a===1?'Twitches once, then stops':'Chip overheating, motor barely turns ✗',560,330,a===0?PAL.good:PAL.bad,13);},
 explain:['✓ The pin only supplies a few mA into the base, and the transistor switches the 500 mA from the battery. It\'s a big valve opened by a small lever.',
  'A capacitor in series passes only a brief pulse: the motor twitches, then DC is blocked.',
  'A diode doesn\'t amplify anything. The pin would still have to supply all 500 mA.',
  'The pin can\'t deliver 500 mA: the motor barely moves and the chip overheats.']});

// 9. Base resistor
Q.push({topic:'Transistor',link:'transistor',type:'value',title:'Choose the base resistor',prompt:'The pin gives 5 V. The transistor\'s base drops 0.7 V and needs about <b>4 mA</b> to switch fully on. Choose the base resistor.',
 slider:{min:1,max:6,def:5,unit:'Ω',fmt:v=>fmtOhm(snapE12(Math.pow(10,v))),val:v=>snapE12(Math.pow(10,v))},
 judge:R=>{const I=4.3/R*1000;return I>=2&&I<=7;},
 draw(ctx,S){const Rv=S.done?S.val:null,Ib=Rv?4.3/Rv*1000:0;const on=Math.min(1,Ib/2.5);S.spin=(S.spin||0)+on*S.dt*15;const hot=Ib>20?1:0;
  chipBox(ctx,60,120,110,100,'micro-','controller',hot*Math.min(1,S.ta||0));txt(ctx,'5 V pin',175,165,Y,11,'left');wire(ctx,[[170,175],[260,175]]);
  part(ctx,Rv?'res':'gap',260,175,340,175,{label:Rv?fmtOhm(Rv):''});wire(ctx,[[340,175],[376,175]]);npnQ(ctx,410,175,on>0.5);
  wire(ctx,[[420,141],[420,120]]);part(ctx,'motor',420,60,420,120,{spin:S.spin});wire(ctx,[[420,60],[420,30],[650,30],[650,90]]);part(ctx,'batt',650,90,650,250,{label:'9 V'});
  wire(ctx,[[420,209],[420,280]]);wire(ctx,[[650,250],[650,280],[115,280],[115,220]]);
  if(Rv)txt(ctx,'base current = (5 − 0.7) V ÷ '+fmtOhm(Rv)+' = '+(Ib<10?Ib.toFixed(2):Ib.toFixed(0))+' mA',430,325,Ib>20?PAL.bad:Ib<2?Y:PAL.good,14);},
 explain:S=>'R = (5 − 0.7) V ÷ 0.004 A ≈ <b>1.1 kΩ</b>, so <b>1 kΩ</b> is the classic choice (anything ≈ 680 Ω–2.2 kΩ works). Too small (under ~220 Ω) and the pin is overloaded. Too big (10 kΩ+) and the transistor only half-opens, so the motor is weak.'});

// 10. Parallel resistors current
Q.push({topic:'Resistor',link:'resistor',type:'mc',title:'Two paths',prompt:'Two 1 kΩ resistors are connected <b>side by side</b> (in parallel) on a 9 V battery. How much current leaves the battery?',
 options:['4.5 mA','9 mA','18 mA','0 mA'],correct:2,
 draw(ctx,S){const {T,B,L}=LOOP;const on=S.ans!==null;S.off=(S.off||0)+(on?1:0)*S.dt*60;
  part(ctx,'batt',L,T,L,B,{label:'9 V',left:true});wire(ctx,[[L,T],[500,T]]);wire(ctx,[[L,B],[500,B]]);
  part(ctx,'res',300,T,300,B,{label:'1 kΩ'});part(ctx,'res',500,T,500,B,{label:'1 kΩ'});dot(ctx,300,T);dot(ctx,300,B);
  if(on){dots(ctx,[[L,B-20],[L,T],[300,T]],S.off*2);dots(ctx,[[300,T],[300,B]],S.off);dots(ctx,[[300,T],[500,T],[500,B],[300,B]],S.off);dots(ctx,[[300,B],[L,B]],S.off*2);
    txt(ctx,'9 mA',290,150,Y,13,'right');txt(ctx,'9 mA',490,150,Y,13,'right');txt(ctx,'18 mA total',200,T-12,Y,14);txt(ctx,'together they act like 500 Ω',650,180,PAL.good,13);}
  else txt(ctx,'current = ?',200,T-12,Y,14);},
 explain:['4.5 mA would be the current with the two resistors in series (2 kΩ). Side by side, it\'s easier, not harder.',
  '9 mA is what one resistor alone takes. The second path adds another 9 mA.',
  '✓ Each resistor gets the full 9 V, so 9 V ÷ 1 kΩ = 9 mA each, 18 mA in total. Two paths make it easier: together they act like 500 Ω.',
  'Both resistors are connected across the battery, so current definitely flows.']});

// 11. Divider
Q.push({topic:'Resistor',link:'resistor',type:'value',title:'Make 3 V from 9 V',prompt:'A voltage divider: R1 (top) is 10 kΩ. Choose R2 (bottom) to get about <b>3 V</b> at the output.',
 slider:{min:2,max:5,def:4,unit:'Ω',fmt:v=>fmtOhm(snapE12(Math.pow(10,v))),val:v=>snapE12(Math.pow(10,v))},
 judge:R=>{const V=9*R/(10000+R);return V>=2.6&&V<=3.4;},
 draw(ctx,S){const Rv=S.done?S.val:null,V=Rv?9*Rv/(10000+Rv):null;const x=360;
  part(ctx,'batt',LOOP.L,LOOP.T,LOOP.L,LOOP.B,{label:'9 V',left:true});wire(ctx,[[LOOP.L,LOOP.T],[x,LOOP.T]]);
  part(ctx,'res',x,LOOP.T,x,180,{label:'R1 = 10 kΩ'});part(ctx,Rv?'res':'gap',x,180,x,LOOP.B,{label:Rv?'R2 = '+fmtOhm(Rv):'R2 ?'});wire(ctx,[[x,LOOP.B],[LOOP.L,LOOP.B]]);
  dot(ctx,x,180);wire(ctx,[[x,180],[520,180]]);txt(ctx,'output',528,184,PAL.good,12,'left');
  ctx.fillStyle=PAL.raised;ctx.fillRect(600,110,150,90);ctx.strokeStyle=PAL.slate;ctx.strokeRect(600,110,150,90);txt(ctx,'voltmeter',675,130,PAL.muted,11);
  txt(ctx,V===null?'— V':V.toFixed(2)+' V',675,175,V===null?PAL.muted:(V>=2.6&&V<=3.4)?PAL.good:Y,26);},
 explain:S=>'Vout = 9 V × R2 ÷ (R1 + R2) = 3 V means R2 is half of R1: <b>R2 = 5 kΩ</b>, so a standard <b>4.7 kΩ</b> (2.9 V) or <b>5.6 kΩ</b> (3.2 V). With R2 = 10 kΩ you\'d get 4.5 V (half).'});

// 12. 555 bigger cap
Q.push({topic:'Microchips',link:'s555',type:'mc',title:'A bigger timing capacitor',prompt:'A 555 blinker uses a 10 µF timing capacitor. You replace it with <b>100 µF</b>. The LED will…',
 options:['blink 10× faster','blink 10× slower','stay on all the time','get 10× brighter'],correct:1,
 draw(ctx,S){const t=S.time;const f1=2,f2=0.2;const led=(x,f,l)=>{const on=((t*f)%1)<0.55;glowAt(ctx,x,150,on?1:0);ctx.fillStyle=on?PAL.bad:'#3f1d1d';ctx.beginPath();ctx.arc(x,150,16,0,7);ctx.fill();txt(ctx,l,x,200,PAL.ink,13);};
  ctx.fillStyle=PAL.chip;ctx.fillRect(60,100,90,110);txt(ctx,'NE555',105,160,PAL.ink,14);
  led(260,f1,'with 10 µF');txt(ctx,'2 blinks per second',260,220,PAL.muted,11);
  if(S.ans!==null){led(470,f2,'with 100 µF');txt(ctx,'1 blink every 5 s',470,220,PAL.muted,11);
    miniGraph(ctx,560,90,220,60,tt=>((tt*f1)%1)<0.55?1:0,t-5,t,PAL.good,-0.1,1.1,'10 µF');miniGraph(ctx,560,190,220,60,tt=>((tt*f2)%1)<0.55?1:0,t-5,t,PAL.good,-0.1,1.1,'100 µF');}
  else{ctx.setLineDash([5,4]);ctx.strokeStyle=Y;ctx.strokeRect(430,110,80,80);ctx.setLineDash([]);txt(ctx,'?',470,158,Y,24);}},
 explain:['It\'s the reverse: a bigger tank takes longer to fill and empty.',
  '✓ The 555 fills and drains the capacitor between ⅓ and ⅔. Ten times more capacitance takes ten times longer, so it blinks 10× slower (frequency ≈ 1.44 ÷ ((R1 + 2R2) × C)).',
  'The 555 still flips at ⅓ and ⅔. It just takes longer, so it keeps blinking.',
  'Brightness is set by the LED\'s resistor, not by the timing capacitor.']});

// 13. Coupling
Q.push({topic:'Capacitor',link:'capacitor',type:'mc',title:'Through a series capacitor',prompt:'A signal made of <b>4.5 V steady + a small wiggle</b> goes through a capacitor into a resistor to ground. What appears at the output?',
 options:['Exactly the same signal','Only the steady 4.5 V','Only the wiggle, centred on 0 V','Nothing at all'],correct:2,
 draw(ctx,S){const t=S.time,inp=tt=>4.5+0.8*Math.sin(tt*5);
  miniGraph(ctx,40,60,250,160,inp,t-4,t,PAL.amber,-1.5,6,'input: 4.5 V + wiggle');
  wire(ctx,[[300,140],[360,140]]);part(ctx,'cap',360,140,440,140,{label:'capacitor'});wire(ctx,[[440,140],[480,140]]);part(ctx,'res',480,140,480,250,{label:'resistor to ground',left:true});
  if(S.ans!==null){miniGraph(ctx,530,60,250,160,tt=>0.8*Math.sin(tt*5),t-4,t,PAL.good,-1.5,6,'output');const y0=60+160-(0+1.5)/7.5*160;ctx.strokeStyle=PAL.muted2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(530,y0);ctx.lineTo(780,y0);ctx.stroke();ctx.setLineDash([]);txt(ctx,'0 V',526,y0+4,PAL.muted,11,'right');}
  else{ctx.setLineDash([5,4]);ctx.strokeStyle=Y;ctx.strokeRect(530,60,250,160);ctx.setLineDash([]);txt(ctx,'output = ?',655,145,Y,18);}},
 explain:['The steady part can\'t get through: it stretches the "rubber sheet" once and stops.',
  'It\'s the opposite: the capacitor blocks the steady DC and passes the changes.',
  '✓ The capacitor absorbs the steady 4.5 V (it charges to the average) and passes the changes. The resistor to ground makes the output settle around 0 V. This is a coupling capacitor.',
  'The changing part (the wiggle) does get through, because a changing push keeps breaking the balance.']});

// 14. 7805 dropout
Q.push({topic:'Microchips',link:'s7805',type:'mc',title:'A regulator with a weak battery',prompt:'A 7805 regulator is fed only <b>6 V</b>. What does it output?',
 options:['Exactly 5 V','About 4 V','6 V','0 V, and it overheats'],correct:1,
 draw(ctx,S){ctx.fillStyle=PAL.muted;ctx.fillRect(330,90,90,40);ctx.fillStyle=PAL.chip;ctx.fillRect(330,130,90,70);txt(ctx,'7805',375,170,PAL.ink,14);
  wire(ctx,[[180,165],[330,165]]);wire(ctx,[[420,165],[570,165]]);txt(ctx,'IN',300,155,PAL.muted,11);txt(ctx,'OUT',455,155,PAL.muted,11);
  const g=(x,v,l,c)=>{ctx.fillStyle=PAL.raised;ctx.fillRect(x-60,110,120,110);ctx.strokeStyle=PAL.slate;ctx.strokeRect(x-60,110,120,110);txt(ctx,l,x,135,PAL.muted,12);txt(ctx,v,x,185,c,28);};
  g(120,'6.0 V','input',PAL.amber);g(640,S.ans===null?'? V':'≈ 4.0 V','output',S.ans===null?Y:PAL.yellow);
  if(S.ans!==null)txt(ctx,'needs ≈ 2 V of "headroom": 6 − 2 = 4 V',400,270,PAL.muted,13);},
 explain:['A 7805 needs its input at least ~2 V above 5 V (7 V or more) to regulate properly.',
  '✓ Below ~7 V the regulator "drops out": its internal valve is wide open but still loses ~2 V, so the output sags to about 4 V. Feed it 7 V or more.',
  'The regulator always loses some voltage across its internal valve, so the output is never more than the input minus ~2 V.',
  'It doesn\'t shut down. A low input means less heat, not more.']});

// 15. Build: LED fade
Q.push({topic:'Build',link:'capacitor',type:'build',title:'Build: an LED that fades out slowly',prompt:'Fill slots <b>A</b> and <b>B</b> so that the LED lights while the button is held and <b>fades out slowly</b> after you let go.',
 slots:['A','B'],palette:['Wire','Resistor 470 Ω','Capacitor 1000 µF','Diode','Empty'],kinds:['wire','res','cap','diode','empty'],labels:['','470 Ω','1000 µF','',''],
 judge:s=>s.A===2&&s.B===1,
 sim(S,dt){const s=S.slots;const tt=S.ta;const pressed=S.testing&&tt<1.6;let shortC=s.A===0,burn=(s.B===0||s.B===3);
  S.vc=S.vc||0;if(s.A===2){S.vc+= pressed?(1-S.vc)*dt/0.05:(s.B===1?-S.vc*dt/2.2:s.B===2?-S.vc*dt/0.05:-S.vc*dt/0.05);}else S.vc=pressed?1:0;
  let glow=0;if(shortC&&pressed)glow=0;else if(s.B===4)glow=0;else if(s.B===2)glow=pressed?Math.max(0,1-tt/0.3):0;else glow=s.A===2?S.vc:(pressed?1:0);
  if(burn&&S.testing&&tt>0.2&&!shortC)S.burnt=true;return {pressed,glow,shortC};},
 draw(ctx,S){const s=S.slots,T=70,B=280,L=90;const r=S.testing?this.sim(S,S.dt):{pressed:false,glow:0,shortC:false};
  part(ctx,'batt',L,T,L,B,{label:'9 V',left:true});wire(ctx,[[L,T],[170,T]]);part(ctx,'switch',170,T,250,T,{closed:r.pressed,label:'button'});wire(ctx,[[250,T],[560,T]]);
  const sl=(k,ax,ay,bx,by)=>{const v=s[k];if(v===undefined)part(ctx,'gap',ax,ay,bx,by,{slot:k});else part(ctx,this.kinds[v],ax,ay,bx,by,{label:k+': '+(this.labels[v]||this.palette[v])});};
  sl('A',340,T,340,B);dot(ctx,340,T);dot(ctx,340,B);
  sl('B',560,T,560,170);part(ctx,'led',560,170,560,250,{glow:S.burnt?0:r.glow,burnt:S.burnt});wire(ctx,[[560,250],[560,B],[L,B]]);
  if(S.testing){txt(ctx,r.pressed?'👆 button held':'button released…',690,140,r.pressed?PAL.good:PAL.muted,14);if(r.shortC&&r.pressed)txt(ctx,'💥 slot A shorts the battery!',690,170,PAL.bad,13);}},
 explain:S=>{const s=S.slots;if(s.A===2&&s.B===1)return '✓ The capacitor (A) fills while the button is held, then keeps feeding the LED through the resistor (B), which also limits the current. That gives a slow fade.';
  const m=[];if(s.A===0)m.push('Slot A as a wire connects + straight to ground: a short circuit.');if(s.A!==2)m.push('Slot A needs an <b>energy reserve</b> that keeps the LED fed after you let go: a big capacitor.');
  if(s.B===0||s.B===3)m.push('Slot B must <b>limit the LED current</b>. A wire or diode lets it burn.');if(s.B===2)m.push('A capacitor in slot B blocks steady DC, so the LED only flashes.');if(s.B===4)m.push('Slot B empty means an open circuit, so the LED never lights.');
  return m.join(' ')+' <b>Answer: A = capacitor 1000 µF, B = resistor 470 Ω.</b>';}});

// 16. Build: night light
Q.push({topic:'Build',link:'transistor',type:'build',title:'Build: an automatic night light',prompt:'Fill slots <b>A</b> (top) and <b>B</b> (bottom) of the divider on the transistor\'s base so the LED turns <b>on when it gets dark</b>. An LDR\'s resistance is low in light and high in the dark.',
 slots:['A','B'],palette:['Resistor 47 kΩ','LDR (light sensor)','Wire','Capacitor'],kinds:['res','ldr','wire','cap'],labels:['47 kΩ','LDR','',''],
 judge:s=>s.A===0&&s.B===1,
 sim(S){const s=S.slots,tt=S.ta;const light=0.5+0.5*Math.cos(tt*1.2);const ldr=1000*Math.pow(200,1-light);const R=k=>k===0?47000:k===1?ldr:k===2?0.001:1e12;
  const ra=R(s.A),rb=R(s.B);const vb=9*rb/(ra+rb);return {light,on:vb>0.7};},
 draw(ctx,S){const s=S.slots,T=40,B=290,x=260;const r=S.testing?this.sim(S):{light:1,on:false};
  ctx.fillStyle=`rgb(${Math.round(10+60*r.light)},${Math.round(15+110*r.light)},${Math.round(40+150*r.light)})`;ctx.fillRect(620,0,180,340);txt(ctx,r.light>0.5?'☀️':'🌙',710,90,PAL.white,40);
  if(S.testing)txt(ctx,r.light>0.5?'daytime':'night',710,130,PAL.white,14);
  wire(ctx,[[60,T],[560,T]],PAL.redSoft);txt(ctx,'+9 V',56,T+4,PAL.redSoft,12,'right');wire(ctx,[[60,B],[560,B]],PAL.blue);txt(ctx,'0 V',56,B+4,PAL.blue,12,'right');
  const sl=(k,ax,ay,bx,by)=>{const v=s[k];if(v===undefined)part(ctx,'gap',ax,ay,bx,by,{slot:k});else part(ctx,this.kinds[v],ax,ay,bx,by,{label:k+': '+(this.labels[v]||this.palette[v])});};
  sl('A',x,T,x,165);sl('B',x,165,x,B);dot(ctx,x,165);wire(ctx,[[x,165],[340,165]]);part(ctx,'res',340,165,420,165,{label:'10 kΩ'});wire(ctx,[[420,165],[466,165]]);
  npnQ(ctx,500,165,r.on);wire(ctx,[[510,131],[510,120]]);part(ctx,'led',510,50,510,120,{glow:r.on?1:0,rgb:'250,204,21'});wire(ctx,[[510,50],[510,T]]);wire(ctx,[[510,199],[510,B]]);
  if(S.testing)txt(ctx,'light: '+(r.on?'ON':'off'),510,320,r.on?PAL.yellowSoft:PAL.muted,14);},
 explain:S=>{const s=S.slots;if(s.A===0&&s.B===1)return '✓ In the dark the LDR (bottom) becomes a big resistance, so the base voltage rises above 0.7 V and the transistor lights the LED. In daylight the LDR is small and pulls the base low.';
  if(s.A===1&&s.B===0)return 'Close! With the LDR on top it works <b>backwards</b>: the light turns on in daylight. Swap them: <b>A = 47 kΩ, B = LDR</b>.';
  return 'You need a <b>voltage divider</b> that changes with light: a fixed resistor on top (A = 47 kΩ) and the LDR at the bottom (B), so darkness raises the base voltage. A wire forces the base fully high or low, and a capacitor blocks the steady DC.';}});

// ================= UI =================
// ===== More challenges for the circuits (generated block) =====
const QM_T=80,QM_B=280;
function qmMeter(ctx,x,y,label,val,col){ctx.fillStyle=PAL.panel;ctx.strokeStyle=col||PAL.yellow;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,150,64,8);ctx.fill();ctx.stroke();txt(ctx,label,x+75,y+22,PAL.muted,12);txt(ctx,val,x+75,y+50,PAL.white,18);}
function qmSeg(ctx,x,y,s,on,dim){drawDigit(ctx,x,y,s,on,{col:dim?'#7f1d1d':PAL.bad});}

// A. Floating input
Q.push({order:[2, 0, 3, 1],topic:'Sensors',link:'sebtn',type:'pick',title:'The counter that counts by itself',prompt:'A push button connects the CLOCK input of a CD4017 to +9 V. When nobody touches it, the counter still <b>counts randomly</b>. What belongs in the gap, between the input and −?',
 options:['A 10 kΩ resistor','A 100 µF capacitor','A wire','Nothing: it\'s a faulty chip'],correct:0,
 draw(ctx,S){const a=S.ans,t=S.ta||0;part(ctx,'batt',80,QM_T,80,QM_B,{label:'9 V',left:true});wire(ctx,[[80,QM_T],[200,QM_T]]);part(ctx,'switch',200,QM_T,280,QM_T,{closed:false,label:'button (released)'});wire(ctx,[[280,QM_T],[360,QM_T],[360,150]]);dot(ctx,360,150);
  wire(ctx,[[360,150],[470,150]]);chipBox(ctx,470,120,130,90,'CD4017','CLK input');part(ctx,a===null?'gap':['res','cap','wire','empty'][a],360,150,360,250,{label:a===0?'10 kΩ':a===1?'100 µF':''});wire(ctx,[[360,250],[360,QM_B],[80,QM_B]]);
  const floating=a!==0&&a!==2;const v=floating?0.5+0.45*Math.sin(t*23)*Math.sin(t*3.1):0;txt(ctx,'input: '+(floating?(v>0.6?'1':v<0.4?'0':'??')+' (floating, picks up noise)':'0 (held low)'),535,240,floating?PAL.bad:PAL.good,13);
  if(a===2)txt(ctx,'wire: pressing the button now shorts the battery! 💥',360,QM_B+30,PAL.bad,13);},
 explain:['✓ A <b>pull-down</b> resistor gently holds the input at 0 V when the button is released, and is weak enough that pressing the button still pulls it up to 9 V. That\'s the 10 kΩ on the reset pins of the dice (projects 13–15).',
  'A capacitor only slows changes: the input still floats and drifts.','With a wire, the input is stuck at 0 V, and pressing the button connects + straight to −: a short circuit!','The chip is fine: a CMOS input connected to nothing "floats" and reads random 0s and 1s from electrical noise. It needs a pull-down.']});

// B. Bounce
Q.push({order:[1, 3, 0, 2],topic:'Sensors',link:'sebtn',type:'mc',title:'One press, three counts',prompt:'You clock a CD4518 counter with a push button (with its pull-down). Sometimes <b>one press adds 2 or 3</b> instead of 1. Why?',
 options:['The metal contacts bounce for a few milliseconds','The battery is too weak','The pull-down resistor is too big','The counter counts both edges'],correct:0,
 draw(ctx,S){const x=60,y=60,w=680,h=200;ctx.fillStyle=PAL.panel;ctx.fillRect(x,y,w,h);ctx.strokeStyle=PAL.line;ctx.strokeRect(x,y,w,h);txt(ctx,'button voltage, zoomed on the first 20 ms of a press',x+8,y+18,PAL.muted,12,'left');
  ctx.strokeStyle=PAL.amber;ctx.lineWidth=2.5;ctx.beginPath();for(let i=0;i<=400;i++){const q=i/400*0.02;let v=q<0.003?0:(q<0.011?(Math.sin((q-0.003)*2600)>-0.2?1:0):1);const px=x+i/400*w,py=y+h-20-v*(h-60);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();
  if(S.ans!==null){txt(ctx,'each spike = one more count →',x+w/2,y+h+28,PAL.yellow,13);}},
 explain:['✓ Mechanical contacts <b>bounce</b> like a dropped ball for 1–10 ms, so a fast counter sees several presses. Fix: a 100 nF capacitor across the button, or ignore changes for ~20 ms in code. See the <b>Sensors → Push button</b> page.',
  'A weak battery makes things dimmer, it doesn\'t add counts.','The pull-down size doesn\'t create extra pulses.','The CD4518 counts on one edge only (rising CLK). The extra counts come from the contact bouncing.']});

// C. LDR divider direction
Q.push({order:[2, 1, 0, 3],topic:'Sensors',link:'seldr',type:'mc',title:'More light on the divider',prompt:'The <b>LDR is on top</b> (to +5 V) and a <b>10 kΩ</b> resistor at the bottom (to 0 V). It gets brighter. What does the middle voltage do?',
 options:['It rises','It falls','It stays the same','It goes negative'],correct:0,
 draw(ctx,S){const L=S.ans!==null?0.5+0.5*Math.sin((S.ta||0)*1.5):0.3;const lux=Math.pow(10,-1+L*5),R=Math.min(1e6,7000*Math.pow(lux/10,-0.75)),V=5*10000/(R+10000);
  glowAt(ctx,120,80,L,'250,204,21',70);ctx.fillStyle=`rgba(250,204,21,${0.2+0.8*L})`;ctx.beginPath();ctx.arc(120,80,26,0,7);ctx.fill();
  txt(ctx,'+5 V',330,40,PAL.bad,12);part(ctx,'ldr',330,50,330,150,{label:S.ans!==null?'LDR '+fmtOhm(R):'LDR'});dot(ctx,330,165);wire(ctx,[[330,150],[330,180]]);part(ctx,'res',330,180,330,270,{label:'10 kΩ'});txt(ctx,'0 V',330,292,PAL.muted,12);
  wire(ctx,[[330,165],[420,165]]);if(S.ans!==null)qmMeter(ctx,430,133,'middle voltage',V.toFixed(2)+' V');},
 explain:['✓ More light → the LDR\'s resistance drops → it "pulls" harder towards +5 V than the 10 kΩ pulls towards 0 V → the middle point rises. Swap them and it would fall instead (that\'s how the night light reacts to darkness).',
  'It falls only if the LDR is at the bottom. Here it is on top.','The LDR changes resistance, so the ratio changes, so the voltage changes.','A divider between 0 V and +5 V always stays between 0 and 5 V.']});

// D. LM35 reading
Q.push({topic:'Sensors',link:'selm35',type:'value',title:'Read the LM35',prompt:'Your multimeter shows <b>0.27 V</b> on the LM35\'s output. What temperature is it?',
 slider:{min:0,max:60,def:10,unit:'°C',fmt:v=>Math.round(v)+' °C',val:v=>Math.round(v)},judge:v=>Math.abs(v-27)<=1,
 draw(ctx,S){ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.arc(200,150,50,Math.PI,0);ctx.lineTo(250,190);ctx.lineTo(150,190);ctx.closePath();ctx.fill();txt(ctx,'LM35',200,165,PAL.ink2,15);
  ['+Vs','Vout','GND'].forEach((l,i)=>{const x=165+i*35;W(ctx,[[x,190],[x,250]],PAL.gray,3);txt(ctx,l,x,268,i===1?PAL.yellow:PAL.muted,11);});wire(ctx,[[200,250],[200,290],[420,290],[420,240]]);qmMeter(ctx,400,170,'multimeter','0.27 V');
  if(S.done)txt(ctx,'your answer: '+S.val+' °C → '+(S.val*10)+' mV',600,120,Math.abs(S.val-27)<=1?PAL.good:PAL.bad,14);},
 explain:()=>'10 mV per °C, so 0.27 V = 270 mV ÷ 10 = <b>27 °C</b>. That\'s the whole trick of the LM35 (projects 20 and 21).'});

// E. Resistor power
Q.push({order:[3, 1, 0, 2],topic:'Formulas',link:'formulas',type:'mc',title:'Will the resistor survive?',prompt:'A <b>100 Ω</b> resistor ends up with the full <b>9 V</b> across it. It\'s a normal <b>¼ W</b> resistor. What happens?',
 options:['It overheats: it has to burn 0.81 W','Fine: 9 V is a low voltage','Fine: resistors don\'t care about power','It only works if you flip it'],correct:0,
 draw(ctx,S){part(ctx,'batt',120,QM_T,120,QM_B,{label:'9 V',left:true});wire(ctx,[[120,QM_T],[340,QM_T]]);const hot=S.ans!==null?Math.min(1,(S.ta||0)/2):0;glowAt(ctx,390,QM_T,hot,'249,115,22',60);part(ctx,'res',340,QM_T,440,QM_T,{label:'100 Ω, ¼ W'});wire(ctx,[[440,QM_T],[600,QM_T],[600,QM_B],[120,QM_B]]);
  if(S.ans!==null){txt(ctx,'P = V² ÷ R = 9 × 9 ÷ 100 = 0.81 W',360,180,PAL.yellow,16);txt(ctx,hot>0.8?'🔥 smoking: more than 3 × its ¼ W rating':'getting hot…',360,215,PAL.bad,14);}},
 explain:['✓ Power = V² ÷ R = 81 ÷ 100 = <b>0.81 W</b>, three times what a ¼ W resistor can handle: it gets very hot, smells and burns. Use 1 W, or a bigger resistance. See <b>Formulas → Power</b>.',
  'The voltage alone isn\'t the question: power = V × I. With only 100 Ω, the current is 90 mA, and 9 V × 90 mA = 0.81 W.','Every resistor turns power into heat and has a maximum: ¼ W for the usual small ones.','Resistors have no direction.']});

// F. Two LEDs in series
Q.push({order:[1, 0, 2, 3],topic:'LED',link:'led',type:'mc',title:'Two LEDs, one resistor',prompt:'Two red LEDs (≈ 2 V each) <b>in series</b> with one <b>470 Ω</b> resistor on 9 V. About how much current flows?',
 options:['≈ 10 mA','≈ 19 mA','≈ 40 mA','0 mA: two LEDs need two resistors'],correct:0,
 draw(ctx,S){const on=S.ans!==null;part(ctx,'batt',90,QM_T,90,QM_B,{label:'9 V',left:true});wire(ctx,[[90,QM_T],[220,QM_T]]);part(ctx,'res',220,QM_T,320,QM_T,{label:'470 Ω'});wire(ctx,[[320,QM_T],[600,QM_T],[600,110]]);
  part(ctx,'led',600,110,600,180,{glow:on?0.8:0});part(ctx,'led',600,190,600,260,{glow:on?0.8:0});wire(ctx,[[600,180],[600,190]]);wire(ctx,[[600,260],[600,QM_B],[90,QM_B]]);
  if(on)txt(ctx,'I = (9 − 2 − 2) V ÷ 470 Ω ≈ 10.6 mA',330,190,PAL.yellow,15);},
 explain:['✓ In series the same current flows through everything. The LEDs take 2 V each, the resistor gets the rest: (9 − 4) ÷ 470 ≈ <b>10.6 mA</b>. That\'s how the dice face (project 13) lights pairs of dots with one resistor.',
  '19 mA would be one LED alone with less resistance. With two LEDs, there\'s even less voltage left for the resistor.','40 mA would burn the LEDs. The resistor keeps it near 10 mA.','In series, one resistor is enough: the current is the same everywhere in the loop.']});

// G. 555 frequency
Q.push({topic:'Microchips',link:'p8',type:'value',title:'A 555 that blinks once per second',prompt:'A 555 blinker with <b>R1 = 1 kΩ</b> and <b>C = 10 µF</b>. Choose <b>R2</b> so the LED blinks about <b>once per second</b>. (f = 1.44 ÷ ((R1 + 2 × R2) × C))',
 slider:{min:3,max:6,def:3.5,unit:'Ω',fmt:v=>fmtOhm(snapE12(Math.pow(10,v))),val:v=>snapE12(Math.pow(10,v))},judge:R=>{const f=1.44/((1000+2*R)*10e-6);return f>=0.6&&f<=1.6;},
 draw(ctx,S){chipBox(ctx,300,90,160,140,'NE555','astable');const R=S.done?S.val:null;const f=R?1.44/((1000+2*R)*10e-6):0;const on=R?((S.ta||0)*f)%1<0.55:false;
  part(ctx,'led',600,110,600,220,{glow:on?0.9:0});wire(ctx,[[460,160],[600,160]]);txt(ctx,'R1 = 1 kΩ',220,110,PAL.muted,13);txt(ctx,'R2 = '+(R?fmtOhm(R):'?'),220,140,PAL.yellow,13);txt(ctx,'C = 10 µF',220,170,PAL.muted,13);
  if(R)txt(ctx,'f = 1.44 ÷ ((1k + 2 × '+fmtOhm(R)+') × 10 µF) = '+(f<10?f.toFixed(2):f.toFixed(0))+' Hz',400,280,f>=0.6&&f<=1.6?PAL.good:PAL.bad,14);},
 explain:()=>'1 Hz means (R1 + 2 × R2) × C ≈ 1.44, so R1 + 2 R2 ≈ 144 kΩ and <b>R2 ≈ 68–72 kΩ</b>. Anything from 47 kΩ to 100 kΩ blinks about once per second. Project 8 uses 47 kΩ: about 1.5 times per second.'});

// H. 4017 count to 5
Q.push({topic:'Microchips',link:'s4017',type:'mc',title:'Count to 5 with a CD4017',prompt:'You want 5 LEDs to chase in a loop (Q0 → Q4, then back). Which output do you wire to <b>RESET</b> (pin 15)?',
 options:['Q4','Q5','Q6','Q9'],correct:1,
 draw(ctx,S){const n=S.ans===null?10:[4,5,6,9][S.ans];const step=Math.floor((S.ta||0)*4)%n;for(let i=0;i<10;i++){const x=110+i*62,on=S.ans!==null&&i===step;glowAt(ctx,x,150,on?0.9:0,'239,68,68',30);ctx.fillStyle=on?PAL.bad:'#3b1d1d';ctx.beginPath();ctx.arc(x,150,14,0,7);ctx.fill();txt(ctx,'Q'+i,x,190,i<5?PAL.ink2:PAL.muted2,12);}
  if(S.ans!==null)txt(ctx,'reset on Q'+[4,5,6,9][S.ans]+' → counts '+n+' states (Q0…Q'+(n-1)+')',400,250,S.ans===1?PAL.good:PAL.bad,15);},
 explain:['Q4 resets as soon as it\'s reached: only Q0–Q3 ever light, 4 states.','✓ The moment Q5 turns on, it resets the counter to Q0, so you see Q0 → Q4: <b>5 states</b>. Rule: to count N states, reset with output Q<i>N</i>. The dice use Q6 for 6 faces.','Q6 gives 6 states (that\'s the dice).','Q9 gives 9 states, and resetting is useless for 10: just leave RESET to ground.']});

// I. Multiplexing
Q.push({order:[2, 3, 0, 1],topic:'Circuits',link:'p12',type:'mc',title:'Two displays, shared wires',prompt:'In the dice and the thermometer, both 7-segment displays share the <b>same 8 segment wires</b>. How can they show different digits?',
 options:['They are lit one at a time, switching every few ms','Each segment wire carries two voltages','The second display is a mirror of the first','They can\'t: both always show the same digit'],correct:0,
 draw(ctx,S){const slow=S.ans!==null,t=S.ta||0,which=slow?Math.floor(t*1.5)%2:-1;qmSeg(ctx,250,80,1.4,'abged',which===1);qmSeg(ctx,420,80,1.4,'abgcd',which===0);
  if(slow)txt(ctx,'slow motion: display '+(which+1)+' on, the other off',400,280,PAL.yellow,14);else txt(ctx,'shows "23"',400,280,PAL.muted,14);},
 explain:['✓ <b>Multiplexing</b>: the Arduino sets the segments for digit 1 and switches on its transistor, then 4 ms later does the same for digit 2, and so on. Your eye blends it into two steady digits.','A wire is at one voltage at a time.','They are wired the same way, but switched separately.','With the trick of switching, they can (projects 12 and 20).']});

// J. Common cathode
Q.push({order:[1, 2, 3, 0],topic:'Circuits',link:'parts',type:'mc',title:'Where does COM go?',prompt:'The SC39-11SURKWA is a <b>common-cathode</b> display. Where does its COM pin go?',
 options:['To − (ground)','To + (5 V)','To + through a resistor','To any segment pin'],correct:0,
 draw(ctx,S){const ok=S.ans===0;qmSeg(ctx,330,60,1.6,ok?'abcdefg':'',false);txt(ctx,'COM',360,262,PAL.ink2,13);wire(ctx,[[360,240],[360,250]]);if(S.ans!==null)txt(ctx,ok?'all cathodes to ground: segments light when their pin goes +':'cathodes at + : no LED can be forward-biased',400,295,ok?PAL.good:PAL.bad,14);},
 explain:['✓ "Common cathode" = all the LEDs\' minus ends are joined at COM. COM goes to ground, and each segment lights when its pin gets + through its resistor.','That\'s for common-<b>anode</b> displays. Here nothing would light.','Still the anode-side idea: wrong type.','COM is the shared return of every segment.']});

// K. Base resistor missing
Q.push({order:[3, 0, 2, 1],topic:'Transistor',link:'transistor',type:'mc',title:'No base resistor',prompt:'An Arduino pin (5 V) is wired <b>straight</b> to a BC547\'s base, with no resistor. What happens?',
 options:['Far too much base current: the pin and the transistor overheat','It works perfectly, just brighter','Nothing: a base needs no current','The transistor only works half the time'],correct:0,
 draw(ctx,S){npnQ(ctx,400,170,S.ans!==null);wire(ctx,[[200,170],[366,170]]);chipBox(ctx,90,130,110,80,'Arduino','pin 5 V');if(S.ans!==null){glowAt(ctx,380,170,0.8,'249,115,22',50);txt(ctx,'base = a diode to ground (0.7 V): 5 V straight in = huge current',400,260,PAL.bad,13);}},
 explain:['✓ The base–emitter junction is a diode: above 0.7 V its current shoots up. With no resistor, the pin tries to push far more than its ~20–40 mA: both get damaged. A 1 kΩ gives (5 − 0.7) ÷ 1 k ≈ 4 mA, plenty.','The LED/load current is set by the transistor and its own resistor, not by more base current, and the pin is overloaded.','A bipolar transistor needs a small base current to switch on; it must be limited by a resistor.','It switches on fully, but at the cost of an overloaded pin.']});

// L. Flyback diode direction
Q.push({order:[1, 2, 0, 3],topic:'Diode',link:'relay',type:'mc',title:'The relay\'s diode',prompt:'A transistor drives a relay coil. Which way must the <b>flyback diode</b> across the coil go?',
 options:['Stripe (cathode) towards +','Stripe towards the transistor (−)','Either way','No diode is needed with a relay'],correct:0,
 draw(ctx,S){txt(ctx,'+9 V',300,46,PAL.bad,12);wire(ctx,[[300,55],[300,90]]);part(ctx,'coil',300,90,300,210,{label:'relay coil'});wire(ctx,[[300,210],[300,240]]);npnQ(ctx,290,274,S.ans!==null);
  wire(ctx,[[300,90],[400,90]]);wire(ctx,[[300,210],[400,210]]);part(ctx,'diode',400,210,400,90,{label:S.ans===1?'diode (stripe down)':'diode (stripe up)',col:S.ans===null?WIRE:S.ans===0?PAL.good:PAL.bad});
  if(S.ans===1)txt(ctx,'💥 short: + straight through the diode',560,260,PAL.bad,13,'left');if(S.ans===0)txt(ctx,'off normally; catches the spike',560,260,PAL.good,13,'left');},
 explain:['✓ Normally the diode is <b>reversed</b> (stripe to +) so it carries nothing. When the transistor switches off, the coil\'s voltage flips and the diode conducts, letting the energy loop round instead of zapping the transistor (projects 6, 7 and B).','Stripe down = forward-biased: it shorts the supply as soon as the transistor turns on.','Only one way protects without shorting.','The coil kick can reach tens of volts: without the diode the transistor eventually dies.']});

// M. 555 pin 5
Q.push({order:[2, 0, 1, 3],topic:'Microchips',link:'p17',type:'mc',title:'Pushing on pin 5',prompt:'In the siren, the slow 555 pulls the fast 555\'s <b>pin 5 (CTRL)</b> up through 10 kΩ. What does that do to the tone?',
 options:['Lower note','Higher note','Louder, same note','The tone stops'],correct:0,
 draw(ctx,S){chipBox(ctx,320,110,160,110,'NE555','tone');txt(ctx,'pin 5 ↑',260,165,PAL.yellow,15);if(S.ans!==null){const f=2+Math.sin((S.ta||0)*4)*0.8;ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=200;i++){const x=520+i,y=165-30*Math.sign(Math.sin(i/200*Math.PI*2*f*2));i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}},
 explain:['✓ Pin 5 is the 555\'s "⅔ mark". Raise it and the capacitor must fill higher before each flip: every cycle takes longer → a <b>lower</b> note. Pull it down → higher. That\'s the pin-pon.','The opposite: pulling pin 5 down gives the higher note.','The output still swings 0–9 V: the volume stays the same.','The 555 keeps oscillating, just at another rhythm.']});

// N. Fuzz
Q.push({order:[1, 3, 2, 0],topic:'Circuits',link:'p18',type:'mc',title:'Why does clipping sound fuzzy?',prompt:'The fuzz pedal slices the tops and bottoms of the guitar wave flat. Why does that sound buzzy?',
 options:['A square-ish wave contains many extra harmonics','It only makes the sound louder','It removes the bass','It adds an echo'],correct:0,
 draw(ctx,S){const k=S.ans!==null?1:0;ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=600;i++){const x=100+i,y=170-70*Math.sin(i/600*Math.PI*8);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  if(k){ctx.strokeStyle=PAL.orange;ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=600;i++){const x=100+i,y=170-Math.max(-35,Math.min(35,70*Math.sin(i/600*Math.PI*8)*3));i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();txt(ctx,'blue: clean string · orange: clipped (≈ square)',400,280,PAL.yellow,14);}},
 explain:['✓ Any wave shape is a mix of sine waves. A pure-ish string note is mostly one; a square wave adds 3×, 5×, 7×… the frequency (odd harmonics). Those extra high tones are the buzz. Same as the Ruby\'s overdrive, pushed further.','It is louder too, but the character changes because of the new harmonics.','The fundamental (the bass of the note) is still there.','Echo needs a delay; clipping is instant.']});

// O. LM339 ladder scale
Q.push({topic:'Circuits',link:'p21',type:'value',title:'Set the bar-graph scale',prompt:'In the bar thermometer, a current flows through a ladder of <b>100 Ω</b> rungs, and each rung is one segment step. The LM35 gives 10 mV/°C. Which ladder current gives <b>2 °C per segment</b>?',
 slider:{min:0.05,max:0.5,def:0.35,unit:'mA',fmt:v=>v.toFixed(2)+' mA',val:v=>Math.round(v*100)/100},judge:v=>v>=0.19&&v<=0.21,
 draw(ctx,S){const v=S.done?S.val/1000:null;for(let i=0;i<10;i++){const th=v?(800+100*i)*v:null,on=v?0.22>=th:false;ctx.fillStyle=on?PAL.green:'#14301f';ctx.fillRect(140+i*52,120,40,90);if(v)txt(ctx,(th*100).toFixed(0)+'°',160+i*52,232,PAL.muted,11);}
  txt(ctx,'room at 22 °C → LM35 = 0.22 V',400,90,PAL.ink2,14);if(v)txt(ctx,'each step = '+(v*100*100).toFixed(1)+' °C',400,275,Math.abs(v*1000-0.2)<=0.01?PAL.good:PAL.bad,15);},
 explain:()=>'2 °C = 20 mV. Ohm\'s law: I = U ÷ R = 0.020 V ÷ 100 Ω = <b>0.2 mA</b>. That\'s what the trimmer sets in project 21 (with 800 Ω at the bottom, the first segment lights at 16 °C).'});
// ===== end of more challenges =====
const ST=Q.map(()=>({ans:null,done:false,ta:0,time:0,dt:0,slots:{},val:null,testing:false}));
const RES=Q.map(()=>null);let cur=0;
const TYPE={pick:'🧩 Pick the part',value:'🎚️ Choose the value',mc:'🔮 What will happen?',build:'🛠️ Build it'};
function score(){const a=RES.filter(r=>r!==null).length,c=RES.filter(r=>r===true).length;$('qScore').innerHTML=`Score <b>${c}</b> / ${a} answered · ${Q.length} total`;}
function dotsBar(){$('qDots').innerHTML=Q.map((q,i)=>`<button class="qd ${i===cur?'cur':''} ${RES[i]===true?'ok':RES[i]===false?'ko':''}" data-i="${i}" title="${q.title}">${i+1}</button>`).join('');
  document.querySelectorAll('.qd').forEach(b=>b.onclick=()=>go(+b.dataset.i));}
function feedback(ok,html,link){const f=$('qFeedback');f.hidden=false;f.className='qfb '+(ok?'ok':'ko');
  f.innerHTML=`<b>${ok?'✓ Correct!':'✗ Not quite.'}</b> ${html}<div style="margin-top:8px"><a class="navlink" href="#${link}">📖 Review the lesson</a> &nbsp; <button id="qRetry">↺ Try again</button></div>`;
  $('qRetry').onclick=()=>{Object.assign(ST[cur],{ans:null,done:false,ta:0,slots:{},val:null,testing:false,burnt:false,vc:0,off:0});render();};}
function record(ok){if(RES[cur]===null)RES[cur]=ok;score();dotsBar();}
function render(){const q=Q[cur],S=ST[cur];$('quizResults').hidden=true;$('quizCard').hidden=false;
  $('qMeta').innerHTML=`<span class="qtype">${TYPE[q.type]}</span> <span class="qtopic">${q.topic}</span> <span class="hint">Question ${cur+1} of ${Q.length}</span>`;
  $('qTitle').textContent=q.title;$('qPrompt').innerHTML=q.prompt;$('qFeedback').hidden=true;score();dotsBar();
  const C=$('qControls');C.innerHTML='';
  if(q.type==='pick'||q.type==='mc'){const g=document.createElement('div');g.className='qopts';(q.order||q.options.map((_,k)=>k)).forEach(i=>{const o=q.options[i];const b=document.createElement('button');b.textContent=o;
      if(S.ans!==null){b.disabled=true;if(i===q.correct)b.className='right';else if(i===S.ans)b.className='wrong';}
      b.onclick=()=>{if(S.ans!==null)return;S.ans=i;S.ta=0;S.done=true;const ok=i===q.correct;record(ok);render();feedback(ok,q.explain[i]+(ok?'':' <i>'+q.explain[q.correct]+'</i>'),q.link);};g.appendChild(b);});C.appendChild(g);
    if(S.ans!==null){const ok=S.ans===q.correct;feedback(ok,q.explain[S.ans]+(ok?'':' <i>'+q.explain[q.correct]+'</i>'),q.link);}}
  else if(q.type==='value'){const sl=q.slider;if(S.sv===undefined)S.sv=sl.def;
    C.innerHTML=`<div class="controls"><label class="slider" style="flex:1">Your choice<input id="qVal" type="range" min="${sl.min}" max="${sl.max}" step="0.01" value="${S.sv}" style="flex:1;width:auto" ${S.done?'disabled':''}></label><b id="qValT" style="min-width:90px;font-size:1.2rem;color:${PAL.yellow}"></b><button id="qCheck" class="active" ${S.done?'disabled':''}>✔ Check</button></div>`;
    const upd=()=>{S.sv=+$('qVal').value;$('qValT').textContent=sl.fmt(S.sv);};$('qVal').oninput=upd;upd();
    $('qCheck').onclick=()=>{S.val=sl.val(S.sv);S.done=true;S.ta=0;const ok=q.judge(S.val);record(ok);render();};
    if(S.done){const ok=q.judge(S.val);feedback(ok,q.explain(S),q.link);}}
  else if(q.type==='build'){q.slots.forEach(k=>{const row=document.createElement('div');row.className='controls';row.innerHTML=`<b style="min-width:70px">Slot ${k}:</b>`;
      q.palette.forEach((p,i)=>{const b=document.createElement('button');b.textContent=p;if(S.slots[k]===i)b.className='active';b.disabled=S.done;b.onclick=()=>{S.slots[k]=i;S.testing=false;S.burnt=false;render();};row.appendChild(b);});C.appendChild(row);});
    const r=document.createElement('div');r.className='controls';const ready=q.slots.every(k=>S.slots[k]!==undefined);
    r.innerHTML=`<button id="qTest" class="active" ${ready?'':'disabled'}>▶ Test circuit</button>${ready?'':'<span class="hint">Fill every slot first.</span>'}`;C.appendChild(r);
    $('qTest').onclick=()=>{S.testing=true;S.ta=0;S.burnt=false;S.vc=0;if(!S.done){S.done=true;record(q.judge(S.slots));}render();};
    if(S.done){const ok=q.judge(S.slots);feedback(ok,q.explain(S),q.link);}}
  $('qPrev').disabled=cur===0;$('qNext').textContent=cur===Q.length-1?'🏁 Results':'Next →';}
function go(i){cur=Math.max(0,Math.min(Q.length-1,i));render();const card=$('quizCard');if(card.getBoundingClientRect().top<0)card.scrollIntoView({behavior:'smooth'});}
$('qPrev').onclick=()=>go(cur-1);$('qNext').onclick=()=>{if(cur===Q.length-1)results();else go(cur+1);};$('qResults').onclick=results;
$('qBack').onclick=()=>render();$('qRestart').onclick=()=>{ST.forEach((s,i)=>ST[i]={ans:null,done:false,ta:0,time:0,dt:0,slots:{},val:null,testing:false});RES.fill(null);cur=0;render();};
function results(){const c=RES.filter(r=>r===true).length,a=RES.filter(r=>r!==null).length;$('quizCard').hidden=true;$('quizResults').hidden=false;
  const topics={};Q.forEach((q,i)=>{topics[q.topic]=topics[q.topic]||{ok:0,n:0,link:q.link};if(RES[i]!==null){topics[q.topic].n++;if(RES[i])topics[q.topic].ok++;}});
  const pct=a?Math.round(c/Q.length*100):0;const msg=pct>=85?'⚡ Excellent! You\'ve really understood the lessons.':pct>=60?'👍 Good work. Review the topics below that weren\'t perfect.':'📖 A good start. Re-read the lessons below, then try again.';
  $('qResBody').innerHTML=`<p class="tldr" style="font-size:1.3rem"><b>${c} / ${Q.length}</b> correct (${a} answered). ${msg}</p><table>${Object.entries(topics).map(([t,v])=>`<tr><td>${t}</td><td>${v.n?v.ok+' / '+v.n:'not answered'} ${v.n&&v.ok<v.n?`· <a class="navlink" href="#${v.link}">review</a>`:v.n?'✓':''}</td></tr>`).join('')}</table>
  <div class="qdots" style="margin-top:14px">${Q.map((q,i)=>`<button class="qd ${RES[i]===true?'ok':RES[i]===false?'ko':''}" data-i="${i}" title="${q.title}">${i+1}</button>`).join('')}</div>`;
  document.querySelectorAll('#qResBody .qd').forEach(b=>b.onclick=()=>go(+b.dataset.i));}
render();
loop((dt,now)=>{const S=ST[cur];S.time+=dt;S.ta+=dt;S.dt=dt;
  const c=$('cQuiz'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);try{Q[cur].draw.call(Q[cur],ctx,S);}catch(e){console.error(e);}});
