
// ===== Minimal circuits: every leg connected =====
(function(){
// row: [pin, branches, why]; branch = [chain, dest]; chain items 'R:1 kΩ','C:10 µF+','C:100 nF','LED:r','POT:10 kΩ','LDR','SPK','XTAL:16 MHz','BTN','D'
// dest: 'V9','V5','GND','NC','P6' (wire to pin 6), 'T:text' (to something else), 'IN:text' (signal coming in)
const MIN={
'555':{title:'NE555 blinker (9 V)',sub:'LED blinks ~1.5 times per second',rows:[
 [1,[[[],'GND']],'Ground: the − of the battery.'],
 [2,[[['C:10 µF+'],'GND'],[[],'P6']],'Trigger: joined to pin 6 and to the timing capacitor. When the capacitor drops to ⅓, the output turns on.'],
 [3,[[['R:470 Ω','LED:r'],'GND']],'Output: drives the LED through its resistor.'],
 [4,[[[],'V9']],'Reset: tied to + so the timer always runs (low = stop).'],
 [5,[[['C:10 nF'],'GND']],'Control: a small capacitor to ground keeps the ⅔ point steady.'],
 [6,[[['R:47 kΩ'],'P7'],[[],'P2']],'Threshold: joined to pin 2. R2 goes from here to pin 7. At ⅔ the output turns off.'],
 [7,[[['R:1 kΩ'],'V9']],'Discharge: sits between R1 (to +) and R2 (to pin 6). Drains the capacitor through R2.'],
 [8,[[[],'V9'],[['C:100 nF'],'GND']],'Supply + (4.5–16 V), with a 100 nF decoupling capacitor right beside it.']]},
'7805':{title:'7805: 9 V in, steady 5 V out',sub:'front view, legs down: 1 IN · 2 GND · 3 OUT',side:'left',rows:[
 [1,[[[],'IN:+9 V battery'],[['C:330 nF'],'GND']],'Input: the raw 7–20 V, with a 330 nF capacitor close to the pin.'],
 [2,[[[],'GND']],'Ground (the metal tab is ground too).'],
 [3,[[[],'T:+5 V to your circuit'],[['C:100 nF'],'GND']],'Output: steady 5 V, with 100 nF to ground (add 10–100 µF for big loads).']]},
'358':{title:'LM358: "is it dark?" comparator',sub:'LED on when the LDR sees darkness (op-amp B unused)',rows:[
 [1,[[['R:1 kΩ','LED:r'],'GND']],'Output A: high when + is above −, lights the LED.'],
 [2,[[['POT:10 kΩ'],'T:pot ends to + and −']],'Input − A: the threshold, from the trimmer\'s wiper.'],
 [3,[[['R:10 kΩ'],'V9'],[['LDR'],'GND']],'Input + A: the sensor divider (10 kΩ on top, LDR below: darker → higher voltage).'],
 [4,[[[],'GND']],'Ground.'],
 [5,[[[],'GND']],'Input + B (unused): to ground so it doesn\'t float.'],
 [6,[[[],'P7']],'Input − B (unused): joined to output B (a "follower") so op-amp B stays quiet.'],
 [7,[[[],'P6']],'Output B (unused): joined to pin 6, nothing else.'],
 [8,[[[],'V9'],[['C:100 nF'],'GND']],'Supply + (3–32 V) with 100 nF decoupling.']]},
'386':{title:'LM386: mini speaker amp (like the Ruby)',sub:'gain 200 with the 10 µF between pins 1 and 8',rows:[
 [1,[[['C:10 µF+'],'P8']],'Gain: 10 µF to pin 8 for gain 200 (leave both open for gain 20).'],
 [2,[[[],'GND']],'Input −: to ground.'],
 [3,[[['POT:10 kΩ'],'IN:audio (volume pot wiper)']],'Input +: the audio, through a volume pot (ends to signal and ground).'],
 [4,[[[],'GND']],'Ground.'],
 [5,[[['C:220 µF+','SPK'],'GND'],[['R:10 Ω','C:47 nF'],'GND']],'Output: 220 µF to the speaker (blocks the 4.5 V DC), plus the Zobel (10 Ω + 47 nF) that keeps it stable.'],
 [6,[[[],'V9'],[['C:100 µF+'],'GND']],'Supply + (4–12 V) with a big capacitor.'],
 [7,[[['C:10 µF+'],'GND']],'Bypass (optional): less hum and noise.'],
 [8,[[[],'P1']],'Gain: the other end of the gain capacitor.']]},
'3914':{title:'LM3914: LM35 bar-graph thermometer',sub:'0–50 °C, 5 °C per LED (project 21)',rows:[
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
'4017':{title:'CD4017: 10-LED chaser',sub:'clocked by a 555 (project 9)',rows:[
 [1,[[['LED:r'],'T:shared 470 Ω → GND']],'Q5. Every LED: anode on its output, cathodes together through ONE 470 Ω to ground (only one LED is on at a time).'],
 [2,[[['LED:r'],'T:shared 470 Ω → GND']],'Q1.'],[3,[[['LED:r'],'T:shared 470 Ω → GND']],'Q0 (first after reset).'],[4,[[['LED:r'],'T:shared 470 Ω → GND']],'Q2.'],
 [5,[[['LED:r'],'T:shared 470 Ω → GND']],'Q6.'],[6,[[['LED:r'],'T:shared 470 Ω → GND']],'Q7.'],[7,[[['LED:r'],'T:shared 470 Ω → GND']],'Q3.'],
 [8,[[[],'GND']],'VSS: ground.'],
 [9,[[['LED:r'],'T:shared 470 Ω → GND']],'Q8.'],[10,[[['LED:r'],'T:shared 470 Ω → GND']],'Q4.'],[11,[[['LED:r'],'T:shared 470 Ω → GND']],'Q9.'],
 [12,[[[],'NC']],'Carry out: not needed (would clock a second 4017).'],
 [13,[[[],'GND']],'Clock inhibit: ground = counting. Never leave it floating!'],
 [14,[[[],'IN:clock from 555 pin 3']],'Clock: one step per rising edge.'],
 [15,[[['R:10 kΩ'],'GND']],'Reset: held low (pull-down). To count to N, wire it to output QN instead.'],
 [16,[[[],'V9'],[['C:100 nF'],'GND']],'VDD: supply 3–15 V, decoupled.']]},
'4511':{title:'CD4511: show a digit from 4 switches',sub:'one SC39-11SURKWA display (COM to ground)',rows:[
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
'4518':{title:'CD4518: counting 00–99',sub:'counter A = units, counter B = tens (project 19)',rows:[
 [1,[[[],'IN:clock from 555 pin 3']],'CLK A: counts on each rising edge.'],
 [2,[[[],'V9']],'EN A: high, so CLK A counts.'],
 [3,[[[],'T:units CD4511 A (pin 7)']],'Q1A (1).'],[4,[[[],'T:units CD4511 B (pin 1)']],'Q2A (2).'],[5,[[[],'T:units CD4511 C (pin 2)']],'Q3A (4).'],
 [6,[[[],'T:units CD4511 D (pin 6)'],[[],'P10']],'Q4A (8): to the decoder AND to EN B: its fall (9 → 0) counts one ten.'],
 [7,[[['R:10 kΩ'],'GND'],[['BTN'],'V9']],'RST A: pull-down + reset button to +.'],
 [8,[[[],'GND']],'VSS: ground.'],
 [9,[[[],'GND']],'CLK B: low, so counter B counts on the falling edge of EN B.'],
 [10,[[[],'P6']],'EN B: from Q4A (the carry).'],
 [11,[[[],'T:tens CD4511 A (pin 7)']],'Q1B.'],[12,[[[],'T:tens CD4511 B (pin 1)']],'Q2B.'],[13,[[[],'T:tens CD4511 C (pin 2)']],'Q3B.'],[14,[[[],'T:tens CD4511 D (pin 6)']],'Q4B.'],
 [15,[[[],'P7']],'RST B: joined to RST A, so the button resets both.'],
 [16,[[[],'V9'],[['C:100 nF'],'GND']],'VDD: supply, decoupled.']]},
'339':{title:'LM339: "is it dark?" LED (5 V)',sub:'comparator 1 used, the 3 others parked so they stay quiet',rows:[
 [1,[[[],'NC']],'OUT2: unused output, leave it free.'],
 [2,[[['LED:r','R:470 Ω'],'V5']],'OUT1: the LED and its resistor come from +5 V INTO the pin. When the output switches to ground, current flows and the LED lights.'],
 [3,[[[],'V5'],[['C:100 nF'],'GND']],'VCC: +5 V, with 100 nF decoupling.'],
 [4,[[['R:10 kΩ'],'V5'],[['LDR'],'GND']],'IN1−: the sensor divider. Darker → the LDR\'s resistance rises → this voltage rises.'],
 [5,[[['POT:10 kΩ'],'T:pot ends to + and −']],'IN1+: the threshold, from the trimmer\'s wiper. When IN1− climbs above it, OUT1 pulls to ground: the LED lights.'],
 [6,[[[],'V5']],'IN2− (unused): to +.'],[7,[[[],'GND']],'IN2+ (unused): to ground. With − above +, the unused output stays firmly on, instead of flickering.'],
 [8,[[[],'V5']],'IN3− (unused): to +.'],[9,[[[],'GND']],'IN3+ (unused): to ground.'],
 [10,[[[],'V5']],'IN4− (unused): to +.'],[11,[[[],'GND']],'IN4+ (unused): to ground.'],
 [12,[[[],'GND']],'GND: ground.'],
 [13,[[[],'NC']],'OUT4: unused, free.'],[14,[[[],'NC']],'OUT3: unused, free.']]},
'4013':{title:'CD4013: 2 Hz in, 1 Hz out (project 26)',sub:'flip-flop 1 wired as a divide-by-2, flip-flop 2 parked',rows:[
 [1,[[[],'T:1 Hz out → CD4518 CLK A'],[['R:1 kΩ','LED:r'],'GND']],'Q1: flips at every clock edge, so it gives half the clock frequency. An LED here blinks once per second.'],
 [2,[[[],'P5']],'Q̅1: back to D1. That feedback is the whole divide-by-2 trick: D always asks for the opposite of what Q is now.'],
 [3,[[[],'IN:2 Hz from CD4060 Q14 (pin 3)']],'CLK1: the 2 Hz clock.'],
 [4,[[[],'GND']],'R1: low (inactive).'],
 [5,[[[],'P2']],'D1: from Q̅1.'],
 [6,[[[],'GND']],'S1: low (inactive).'],
 [7,[[[],'GND']],'VSS: ground.'],
 [8,[[[],'GND']],'S2 (unused): ground.'],[9,[[[],'GND']],'D2 (unused): ground.'],[10,[[[],'GND']],'R2 (unused): ground.'],[11,[[[],'GND']],'CLK2 (unused): ground. CMOS inputs must never float.'],
 [12,[[[],'NC']],'Q̅2: free.'],[13,[[[],'NC']],'Q2: free.'],
 [14,[[[],'V9'],[['C:100 nF'],'GND']],'VDD: supply, decoupled.']]},
'4060':{title:'CD4060: quartz time base (project 26)',sub:'32.768 kHz watch quartz → an LED blinking exactly 2 times per second',rows:[
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
'293':{title:'L293D: one motor, both directions (Arduino)',sub:'logic at 5 V from the Arduino, motor at 9 V; bridge 2 unused',rows:[
 [1,[[[],'IN:Arduino D9 (PWM) = speed']],'EN1,2: high = bridge 1 on. A PWM signal here sets the speed (analogWrite). Tie to +5 V for full speed only.'],
 [2,[[[],'IN:Arduino D7 = direction A']],'1A: high → 1Y goes to +9 V, low → 1Y goes to ground.'],
 [3,[[[],'T:motor terminal 1']],'1Y: one end of the motor.'],
 [4,[[[],'GND']],'GND (and heat sink).'],[5,[[[],'GND']],'GND (and heat sink).'],
 [6,[[[],'T:motor terminal 2']],'2Y: the other end of the motor. No diodes to add: they are built in (the "D").'],
 [7,[[[],'IN:Arduino D8 = direction B']],'2A: D7 high + D8 low = forward, D7 low + D8 high = reverse, both the same = brake.'],
 [8,[[[],'V9'],[['C:100 µF+'],'GND']],'VCC2: the motor supply (9 V battery), with a 100 µF reservoir for the motor\'s current peaks.'],
 [9,[[[],'GND']],'EN3,4: low, bridge 2 off.'],[10,[[[],'GND']],'3A (unused): ground.'],[11,[[[],'NC']],'3Y: free.'],
 [12,[[[],'GND']],'GND (and heat sink).'],[13,[[[],'GND']],'GND (and heat sink).'],
 [14,[[[],'NC']],'4Y: free.'],[15,[[[],'GND']],'4A (unused): ground.'],
 [16,[[[],'V5'],[['C:100 nF'],'GND']],'VCC1: logic supply, +5 V from the Arduino, decoupled. The Arduino\'s GND and the battery − must be joined.']]},
'595':{title:'74HC595: 8 LEDs from 3 Arduino pins',sub:'5 V from the Arduino',rows:[
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
'4056':{title:'TP4056: the charger module\'s circuit',sub:'already built on the module: here is what\'s around the chip',rows:[
 [1,[[[],'GND']],'TEMP: no battery thermistor, so grounded.'],
 [2,[[['R:1.2 kΩ'],'GND']],'PROG: 1.2 kΩ → 1 A charge current (I = 1200 ÷ R).'],
 [3,[[[],'GND']],'Ground.'],
 [4,[[[],'IN:+5 V USB'],[['C:10 µF+'],'GND']],'VCC: USB 5 V, decoupled.'],
 [5,[[[],'T:battery + (via BMS)'],[['C:10 µF+'],'GND']],'BAT: to the cell; ends at 4.2 V.'],
 [6,[[['LED:g','R:1 kΩ'],'V5']],'STDBY: pulls the green LED low (on) when full.'],
 [7,[[['LED:r','R:1 kΩ'],'V5']],'CHRG: pulls the red LED low (on) while charging.'],
 [8,[[[],'V5']],'CE: enable, tied to 5 V.']]},
'328':{title:'ATmega328P: an "Arduino" on a breadboard',sub:'the bare minimum to run a sketch (blinks an LED on D13)',rows:[
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
};
const NS='http://www.w3.org/2000/svg';
const COL={line:PAL.muted,res:'#e7c99a',cap:PAL.blue,gnd:PAL.muted,vcc:PAL.bad,sig:PAL.sky,pin:PAL.yellow};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
function partSVG(kind,x,y,dir,below,toChip){// draws a part centred at x along a horizontal line, width 56
  const [k,lab]=kind.split(':');const L=x-28,R=x+28;let s='';const t=(tx,c)=>`<text x="${x}" y="${below?y+21:y-13}" text-anchor="middle" font-size="10.5" fill="${c||PAL.ink2}">${esc(tx)}</text>`;
  if(k==='R'){s+=`<line x1="${L}" y1="${y}" x2="${x-16}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><rect x="${x-16}" y="${y-6}" width="32" height="12" rx="2" fill="${PAL.canvas}" stroke="${COL.res}" stroke-width="2"/><line x1="${x+16}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t(lab);}
  else if(k==='C'){const pol=lab.endsWith('+');const v=pol?lab.slice(0,-1):lab;s+=`<line x1="${L}" y1="${y}" x2="${x-4}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><line x1="${x-4}" y1="${y-9}" x2="${x-4}" y2="${y+9}" stroke="${COL.cap}" stroke-width="3"/><line x1="${x+4}" y1="${y-9}" x2="${x+4}" y2="${y+9}" stroke="${COL.cap}" stroke-width="3"/><line x1="${x+4}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t(v)+(pol?`<text x="${dir<0?x+10:x-10}" y="${below?y-10:y+16}" text-anchor="middle" font-size="11" fill="${PAL.bad}">+</text>`:'');}
  else if(k==='LED'){const c=lab==='g'?PAL.green:PAL.bad;if(toChip)dir=-dir;// anode towards chip? we draw triangle pointing away from chip
    s+=`<line x1="${L}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><path d="M${x-8*dir} ${y-8}L${x+8*dir} ${y}L${x-8*dir} ${y+8}Z" fill="${c}" stroke="${c}"/><line x1="${x+8*dir}" y1="${y-8}" x2="${x+8*dir}" y2="${y+8}" stroke="${c}" stroke-width="2.5"/><path d="M${x} ${y-11}l5 -6M${x+6} ${y-9}l5 -6" stroke="${c}" stroke-width="1.5"/>`;}
  else if(k==='POT'){s+=`<line x1="${L}" y1="${y}" x2="${x-16}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><rect x="${x-16}" y="${y-6}" width="32" height="12" rx="2" fill="${PAL.canvas}" stroke="${PAL.blueDark}" stroke-width="2"/><path d="M${x-10} ${y+12}L${x+10} ${y-12}" stroke="${PAL.blueDark}" stroke-width="2"/><line x1="${x+16}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t(lab||'pot');}
  else if(k==='LDR'){s+=`<line x1="${L}" y1="${y}" x2="${x-16}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><rect x="${x-16}" y="${y-6}" width="32" height="12" rx="2" fill="${PAL.canvas}" stroke="${PAL.orangeSoft}" stroke-width="2"/><line x1="${x+16}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><path d="M${x-14} ${y-20}l7 8M${x-6} ${y-22}l7 8" stroke="${PAL.yellow}" stroke-width="1.5"/>`+t('LDR',PAL.orangeSoft);}
  else if(k==='SPK'){s+=`<line x1="${L}" y1="${y}" x2="${x-8}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><rect x="${x-8}" y="${y-6}" width="8" height="12" fill="${PAL.ink2}"/><path d="M${x} ${y-6}L${x+10} ${y-13}V${y+13}L${x} ${y+6}Z" fill="${PAL.ink2}"/><line x1="${x+10}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t('8 Ω');}
  else if(k==='XTAL'){s+=`<line x1="${L}" y1="${y}" x2="${x-9}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><rect x="${x-5}" y="${y-9}" width="10" height="18" fill="${PAL.canvas}" stroke="${PAL.ink2}" stroke-width="2"/><line x1="${x-9}" y1="${y-9}" x2="${x-9}" y2="${y+9}" stroke="${PAL.ink2}" stroke-width="2"/><line x1="${x+9}" y1="${y-9}" x2="${x+9}" y2="${y+9}" stroke="${PAL.ink2}" stroke-width="2"/><line x1="${x+9}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t(lab);}
  else if(k==='BTN'){s+=`<line x1="${L}" y1="${y}" x2="${x-12}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><line x1="${x-12}" y1="${y}" x2="${x+10}" y2="${y-9}" stroke="${PAL.ink2}" stroke-width="2"/><line x1="${x+12}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t('switch');}
  return s;}
function destSVG(d,x,y,dir){const a=dir<0?'end':'start';let s='';
  if(d==='GND'){s+=`<line x1="${x}" y1="${y}" x2="${x+8*dir}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><path d="M${x+8*dir} ${y-8}V${y+8}M${x+13*dir} ${y-5}V${y+5}M${x+18*dir} ${y-2}V${y+2}" stroke="${COL.gnd}" stroke-width="2"/><text x="${x+24*dir}" y="${y+4}" text-anchor="${a}" font-size="11" fill="${PAL.muted}">GND</text>`;}
  else if(d==='V9'||d==='V5'){const v=d==='V9'?'+9 V':'+5 V';s+=`<line x1="${x}" y1="${y}" x2="${x+10*dir}" y2="${y}" stroke="${COL.vcc}" stroke-width="2"/><line x1="${x+10*dir}" y1="${y-8}" x2="${x+10*dir}" y2="${y+8}" stroke="${COL.vcc}" stroke-width="3"/><text x="${x+16*dir}" y="${y+4}" text-anchor="${a}" font-size="11" font-weight="700" fill="${COL.vcc}">${v}</text>`;}
  else if(d==='NC'){s+=`<path d="M${x+2*dir-4} ${y-4}l8 8M${x+2*dir+4} ${y-4}l-8 8" stroke="${PAL.muted2}" stroke-width="2"/><text x="${x+12*dir}" y="${y+4}" text-anchor="${a}" font-size="11" fill="${PAL.muted2}">not connected</text>`;}
  else if(d[0]==='P'){const n=d.slice(1);s+=`<line x1="${x}" y1="${y}" x2="${x+6*dir}" y2="${y}" stroke="${COL.pin}" stroke-width="2"/><rect x="${dir<0?x-62:x+6}" y="${y-9}" width="56" height="18" rx="9" fill="none" stroke="${COL.pin}" stroke-width="1.5"/><text x="${dir<0?x-34:x+34}" y="${y+4}" text-anchor="middle" font-size="11" font-weight="700" fill="${COL.pin}">↔ pin ${n}</text>`;}
  else{const isIn=d.startsWith('IN:');const tx=d.slice(isIn?3:2);s+=`<text x="${x+4*dir}" y="${y+4}" text-anchor="${a}" font-size="11" fill="${isIn?COL.sig:PAL.ink2}">${isIn?(dir<0?'':'')+'⟵ ':''}${esc(tx)}${isIn&&dir>0?'':''}</text>`;}
  return s;}
function describe(br){return br.map(([ch,d])=>{const parts=ch.map(c=>{const [k,l]=c.split(':');return {R:'resistor '+l,C:'capacitor '+(l||'').replace('+',' (+ towards the pin)'),LED:(l==='g'?'green ':'red ')+'LED',POT:'trimmer '+(l||''),LDR:'LDR',SPK:'speaker',XTAL:'crystal '+l,BTN:'switch'}[k];});
  const dd=d==='GND'?'ground (−)':d==='V9'?'+9 V':d==='V5'?'+5 V':d==='NC'?'nothing':d[0]==='P'?'pin '+d.slice(1):d.slice(d.startsWith('IN:')?3:2);return (parts.length?parts.join(' → ')+' → ':'')+dd;}).join('<br>+ ');}
function build(el){const k=el.dataset.chip,M=MIN[k];if(!M)return;const rows=M.rows,n=rows.length,h=Math.ceil(n/2),left=M.side==='left';
  const sp=Math.max(...rows.map(r=>r[1].length))>1?86:46,top=70,cw=110,cx=440,chL=cx-cw/2,chR=cx+cw/2,H=top+(left?n:h)*sp+30;
  let s=`<svg viewBox="0 0 880 ${H}" class="pinsvg">`;
  s+=`<text x="440" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="${PAL.ink}">${esc(M.title)}</text><text x="440" y="42" text-anchor="middle" font-size="12" fill="${PAL.muted}">${esc(M.sub)}</text>`;
  s+=`<rect x="${chL}" y="${top-14}" width="${cw}" height="${(left?n:h)*sp+8}" rx="8" fill="${PAL.chip}" stroke="${PAL.slate}" stroke-width="2"/>`;
  if(!left)s+=`<path d="M${cx-14} ${top-14} a14 14 0 0 0 28 0" fill="${PAL.canvas}" stroke="${PAL.slate}" stroke-width="2"/>`;
  rows.forEach(([p,br,why],idx)=>{let side,r;if(left){side=-1;r=idx;}else{side=p<=h?-1:1;r=p<=h?p-1:n-p;}const y=top+r*sp+sp/2-10;const x0=side<0?chL:chR;
    s+=`<g class="mrow" data-pin="${p}"><rect x="${side<0?0:chR}" y="${y-sp/2+2}" width="${side<0?chL:880-chR}" height="${sp-4}" fill="transparent"/>`;
    s+=`<rect x="${side<0?x0-14:x0}" y="${y-5}" width="14" height="10" fill="${PAL.ink2}"/><text x="${side<0?x0+8:x0-8}" y="${y+4}" text-anchor="${side<0?'start':'end'}" font-size="11" font-weight="700" fill="${PAL.ink}">${p}</text>`;
    const offs=br.length>1?[-15,15]:[0];
    br.forEach(([ch,d],bi)=>{const yy=y+offs[bi];let x=x0+14*side;if(br.length>1){s+=`<line x1="${x}" y1="${y}" x2="${x+10*side}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><line x1="${x+10*side}" y1="${y}" x2="${x+10*side}" y2="${yy}" stroke="${COL.line}" stroke-width="2"/>`;x+=10*side;if(bi===0)s+=`<circle cx="${x}" cy="${y}" r="3" fill="${COL.line}"/>`;}
      s+=`<line x1="${x}" y1="${yy}" x2="${x+14*side}" y2="${yy}" stroke="${COL.line}" stroke-width="2"/>`;x+=14*side;
      ch.forEach(c=>{s+=partSVG(c,x+28*side,yy,side,bi===1,d==='V9'||d==='V5');x+=56*side;});
      s+=`<line x1="${x}" y1="${yy}" x2="${x+10*side}" y2="${yy}" stroke="${COL.line}" stroke-width="2"/>`+destSVG(d,x+10*side,yy,side);});
    s+='</g>';});
  s+=`<text x="440" y="${H-8}" text-anchor="middle" font-size="11" fill="${PAL.muted2}">${left?'legs numbered 1-2-3 from left to right, writing facing you':'same leg positions as the real chip, seen from above'}</text></svg>`;
  const pinName=p=>{const C=window.__CH&&window.__CH[k];return '';};
  el.innerHTML=`<div class="cmfig">${s}</div><div class="cx-tw"><table class="cx-tab cm-tab"><tr><td>Pin</td><td>Connect to</td><td>Why</td></tr>${rows.map(([p,br,why])=>`<tr data-pin="${p}"><td><b>${p}</b></td><td>${describe(br)}</td><td>${esc(why)}</td></tr>`).join('')}</table></div>`;
  const sel=p=>el.querySelectorAll('[data-pin]').forEach(e=>e.classList.toggle('sel',+e.dataset.pin===p));
  el.querySelectorAll('[data-pin]').forEach(e=>{e.addEventListener('mouseenter',()=>sel(+e.dataset.pin));e.addEventListener('click',()=>sel(+e.dataset.pin));});}
document.querySelectorAll('.chmin').forEach(build);
})();
