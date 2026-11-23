import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))) if os.path.basename(os.path.dirname(os.path.abspath(__file__))) in ('generators','legacy') else os.path.dirname(os.path.abspath(__file__)))
from paths import SRC, PAGES, SITE
import json,re
R,B,Y,O,U,G,P='#dc2626','#111','#ca8a04','#ea580c','#2563eb','#16a34a','#9333ea'
MOT=lambda s,x,a,b:dict(s=s,t='box',at=[x,352],w=140,h=46,lab='⚙️ DC motor RE140/1',col='#374151',ly=28,pins=[dict(n='',dx=18,dy=0,to=a,c=Y),dict(n='',dx=122,dy=0,to=b,c=R if b.startswith('bp') else Y)])
L23={'power':9,'parts':[
 dict(s=1,t='wire',a='tp60',b='bp60',c=R),dict(s=1,t='wire',a='tn59',b='bn59',c=B),dict(s=1,t='ecap',a='tp7',b='tn8',lab='100µ'),
 dict(s=2,t='chip',col=10,n=8,lab='NE555'),dict(s=2,t='wire',a='d10',b='tp10',c=R),dict(s=2,t='wire',a='j10',b='bn10',c=B),dict(s=2,t='wire',a='j13',b='bp13',c=R),
 dict(s=3,t='res',a='c10',b='c11',v=1000),dict(s=3,t='pot',h=['a20','a21','a22']),dict(s=3,t='wire',a='d11',b='c21',c=O),
 dict(s=4,t='diode',a='b20',b='b12'),dict(s=4,t='diode',a='c12',b='c22'),dict(s=4,t='wire',a='a12',b='i11',c=U),dict(s=4,t='ccap',a='h11',b='bn11',lab='10n'),
 dict(s=5,t='res',a='i12',b='i16',v=470),dict(s=5,t='led',a='h16',b='h18'),dict(s=5,t='wire',a='j18',b='bn18',c=B),
 dict(s=6,t='npn',c='g32',b='g31',e='g30',lab='E B C'),dict(s=6,t='res',a='h12',b='h31',v=1000),dict(s=6,t='wire',a='j30',b='bn30',c=B),
 MOT(7,330,'j32','bp35'),dict(s=8,t='diode',a='i32',b='bp33'),
 dict(s=9,t='batt',at=[40,30],plus='tp1',minus='tn2')]}
L24={'power':8,'parts':[
 dict(s=1,t='wire',a='tp60',b='bp60',c=R),dict(s=1,t='wire',a='tn59',b='bn59',c=B),
 dict(s=2,t='chip',col=20,n=16,lab='L293D'),dict(s=2,t='wire',a='d20',b='tp20',c=R),dict(s=2,t='wire',a='j27',b='bp27',c=R),
 dict(s=2,t='wire',a='j23',b='bn23',c=B),dict(s=2,t='wire',a='j24',b='bn24',c=B),dict(s=2,t='wire',a='a23',b='tn23',c=B),dict(s=2,t='wire',a='a24',b='tn24',c=B),
 dict(s=3,t='res',a='i20',b='bp18',v=10000),dict(s=3,t='res',a='j20',b='bn19',v=10000),
 dict(s=4,t='btn',col=4),dict(s=4,t='wire',a='tp4',b='a4',c=R),dict(s=4,t='res',a='g6',b='g12',v=10000),dict(s=4,t='wire',a='h12',b='h21',c=G),dict(s=4,t='res',a='j21',b='bn21',v=10000),
 dict(s=5,t='btn',col=34),dict(s=5,t='wire',a='tp34',b='a34',c=R),dict(s=5,t='res',a='g36',b='g30',v=10000),dict(s=5,t='wire',a='h30',b='h26',c=U),dict(s=5,t='res',a='j26',b='bn26',v=10000),
 MOT(6,300,'j22','j25'),
 dict(s=7,t='wire',a='h22',b='h44',c=O),dict(s=7,t='wire',a='i25',b='i47',c=P),dict(s=7,t='res',a='g44',b='g46',v=1000),dict(s=7,t='led',a='f46',b='f47'),dict(s=7,t='led',a='h47',b='h46',rgb='34,197,94'),
 dict(s=8,t='batt',at=[40,30],plus='tp1',minus='tn2')]}
S23=["Battery disconnected. Link the rails at the right end: top + ↔ bottom + (column 60), top − ↔ bottom − (column 59). <b>100 µF</b> across the top rails (+ leg on top +, − leg on top −): it feeds the motor's current bursts so the 555 doesn't reset.",
 "<b>NE555</b> across the gap, notch left, columns <b>10–13</b>. <b>d10</b> (pin 8) → top +, <b>j10</b> (pin 1) → bottom −, <b>j13</b> (pin 4, reset) → bottom +.",
 "<b>1 kΩ</b> c10–c11 (pin 8 → pin 7). <b>10 kΩ trimmer</b> in <b>a20–a22</b> (middle leg = wiper in a21). Jumper <b>d11 → c21</b>: pin 7 to the wiper.",
 "Two <b>1N4148</b>: plain end <b>b20</b>, ring end <b>b12</b> (left end of the trimmer → pin 6); plain end <b>c12</b>, ring end <b>c22</b> (pin 6 → right end). Jumper <b>a12 → i11</b> (pin 6 → pin 2). <b>10 nF</b> from <b>h11</b> (pin 2) to bottom −.",
 "Speed indicator: <b>470 Ω</b> i12–i16 (from pin 3, the output), red LED long leg <b>h16</b>, short leg <b>h18</b>, <b>j18</b> → bottom −. Its brightness follows the motor speed.",
 "<b>SS8050</b> transistor in the bottom half, flat side facing you: <b>g30</b> (E), <b>g31</b> (B), <b>g32</b> (C). ⚠️ Its legs are in the <b>opposite order</b> to the BC547 (E-B-C instead of C-B-E). <b>1 kΩ</b> from <b>h12</b> (pin 3) to <b>h31</b> (base). <b>j30</b> (emitter) → bottom −.",
 "<b>Motor</b>: one wire to <b>j32</b> (collector), the other to the bottom + rail. Solder or twist short jumper wires to its two tabs first. Stick a small piece of tape on the shaft as a flag, so you can see it spin.",
 "<b>1N4007</b> across the motor: plain end <b>i32</b> (collector), ring end on the bottom <b>+</b> rail. It catches the coil's voltage kick every time the transistor switches off (see <a class=\"navlink\" href=\"#p6\">6 Coil kick</a>).",
 "Connect the battery. Turn the trimmer: the motor goes from crawling to full speed, and the LED dims and brightens with it. A faint high whistle is normal: that's the 13 kHz switching."]
S24=["Battery disconnected. Link the rails: top + ↔ bottom + (column 60), top − ↔ bottom − (column 59).",
 "<b>L293D</b> across the gap, notch left, columns <b>20–27</b> (bottom pins 1–8, top pins 16–9). Logic supply pin 16: <b>d20</b> → top +. Motor supply pin 8: <b>j27</b> → bottom +. The 4 middle pins are ground (and heat sink): <b>j23, j24</b> → bottom −, <b>a23, a24</b> → top −.",
 "Enable (pin 1) at half the battery voltage: <b>10 kΩ</b> from <b>i20</b> to bottom +, <b>10 kΩ</b> from <b>j20</b> to bottom −. (The L293D's inputs must stay below 7 V, so we don't feed them 9 V directly.)",
 "<b>FORWARD button</b> in columns <b>4–6</b>. <b>a4</b> → top +. Its output (column 6) goes through <b>10 kΩ</b> g6–g12, then jumper <b>h12 → h21</b> to input 1A (pin 2). <b>10 kΩ</b> from <b>j21</b> to bottom − pulls the input low when released.",
 "<b>REVERSE button</b> in columns <b>34–36</b>. <b>a34</b> → top +. Output through <b>10 kΩ</b> g36–g30, jumper <b>h30 → h26</b> to input 2A (pin 7). <b>10 kΩ</b> from <b>j26</b> to bottom −.",
 "<b>Motor</b> between the two outputs: <b>j22</b> (1Y, pin 3) and <b>j25</b> (2Y, pin 6). No diode needed: the \"D\" in L293<b>D</b> means the protection diodes are built in.",
 "Direction LEDs: jumper <b>h22 → h44</b> and <b>i25 → i47</b>. <b>1 kΩ</b> g44–g46. <b>Red</b> LED long leg <b>f46</b>, short leg <b>f47</b>. <b>Green</b> LED long leg <b>h47</b>, short leg <b>h46</b> (the other way round).",
 "Connect the battery. Hold FORWARD: the motor spins one way, red LED on. Hold REVERSE: the other way, green LED on. Both or none: it stops."]
H23=["A motor's speed depends on the <b>average voltage</b> it gets. We could waste the extra voltage in a big resistor (it would get hot), but there's a smarter trick: switch the full 9 V <b>on and off very fast</b>, about 13,000 times per second. That's <b>PWM</b> (pulse-width modulation). On 30 % of the time = like 30 % of 9 V ≈ 2.7 V on average. The motor is far too heavy to follow each pulse: it just feels the average.",
 "The <b>555</b> makes the pulses. The trimmer splits its 10 kΩ in two: the capacitor <b>charges</b> through one side and <b>discharges</b> through the other (each diode lets only one direction through). Turn the knob: one side grows as the other shrinks, so the on-time changes but the total period stays the same.",
 "The 555 can't feed a motor (it would need ~200 mA, more when starting). So it drives a transistor, like in the <a class=\"navlink\" href=\"#p7\">relay clicker</a>. But the BC547 only takes 100 mA, so we use an <b>SS8050</b>: same job, up to 1.5 A. The 1N4007 handles the coil kick, exactly like for a relay.",
 "💧 <b>Water analogy:</b> instead of half-closing a tap (which wastes pressure), you open it fully and close it fully, very fast. A heavy water wheel can't follow the flicker: it turns at the average flow."]
H24=["To reverse a DC motor, you reverse the current through it: swap its two wires. The <b>L293D</b> does that electronically with an <b>H-bridge</b>: four switches arranged like the letter H, with the motor as the middle bar.",
 "Each output (1Y, 2Y) connects the motor end either to <b>+</b> or to <b>−</b>, copying its input (1A, 2A). FORWARD: 1Y = +, 2Y = −, the current flows left → right. REVERSE: 1Y = −, 2Y = +, right → left. Both equal (both buttons or none): no voltage across the motor, it stops (and even brakes).",
 "The two LEDs are wired head-to-tail, like the polarity tester (<a class=\"navlink\" href=\"#p3\">project 3</a>): the red one lights for one current direction, the green one for the other.",
 "💧 <b>Water analogy:</b> a water wheel in a pipe between two tanks. Raise the left tank and lower the right: it turns one way. Swap them: it turns the other way. The L293D is the one lifting the tanks."]
V23=[("Remove the 1N4007","Don't run it long like this! With a multimeter on the collector you'd see spikes; the transistor may survive a while, but it's being hammered by each coil kick. Put the diode back."),
 ("Change the 10 nF to 100 nF","Frequency drops to ~1.3 kHz: the motor whines loudly (you hear the PWM). Back to 10 nF for a quieter motor."),
 ("Replace the motor with the 12 V bulb","Same circuit = a lamp dimmer (with the 12 V adapter on the rails instead of the battery). The bulb filament also averages the pulses."),
 ("Arduino PWM","Unplug the 555 and drive the 1 kΩ base resistor from ONE-C pin 9 with <code>analogWrite(9, 0…255)</code>: the same thing in one line of code.")]
V24=[("Speed control","Replace the enable divider with project 23's 555 output (through 10 kΩ + 10 kΩ divider): direction from the buttons, speed from the trimmer."),
 ("Second motor","The L293D has a second H-bridge (pins 9–15). Wire it the same way with a second motor: you have the base of a small robot car."),
 ("Arduino control","Inputs 1A, 2A and EN from ONE-C pins (5 V is fine, no divider). <code>digitalWrite</code> for direction, <code>analogWrite</code> on EN for speed."),
 ("Feel the brake","Spin the shaft by hand with both buttons released, then with the battery unplugged. With the L293D connected, it's harder to turn: the shorted motor brakes itself (it's a generator!).")]
def SEC(id,n,title,tag,intro,ctrl,canvas,hint,need,how,steps,var,power='battery'):
    return f'''
<section id="{id}">
  <h2><span class="num">{n}</span>{title}</h2>
  <p><span class="qtopic">{tag}</span> {intro}</p>
  <div class="controls">{ctrl}</div>
  <canvas id="{canvas}" width="800" height="300"></canvas>
  <p class="hint">{hint}</p>
  <div style="margin-top:12px"><h3 style="margin-top:0">🧰 You need</h3><ul>{''.join(f'<li>{x}</li>' for x in need)}</ul></div>
  <h3>💡 How it works</h3>
  <div class="howbox">{''.join(f'<p>{p}</p>' for p in how)}</div>
  <h3>🏁 Final breadboard setup</h3>
  <p class="hint" style="margin-top:-6px">This is what your board should look like when it's finished (and powered). Compare with it at the end.</p>
  <canvas id="bbF_{id}" class="bbc" width="800" height="440"></canvas>
  <h3 class="wtitle">🔌 Step-by-step wiring <span class="wprog"></span> <button class="wreset">↺ reset</button></h3>
  <p class="hint" style="margin-top:-6px">Follow the steps in order and tick each one. Wire with the battery <b>disconnected</b>, and connect it <b>last</b>. Column and hole numbers (a–j) follow the <a class="navlink" href="#cintro">breadboard map</a>.</p>
  <div class="bblive"><div class="bbcap">🧩 Your breadboard so far: parts appear as you tick the steps, and the <span style="color:#f59e0b">glowing outline</span> shows where the next step goes.</div><canvas id="bbS_{id}" class="bbc" width="800" height="440"></canvas></div>
  <ol class="wsteps">{''.join(f'<li><label><input type="checkbox"><span>{t}</span></label></li>' for t in steps)}</ol>
  <h3>🧪 Variants to try</h3>
  <table>{''.join(f'<tr><td>{a}</td><td>{b}</td></tr>' for a,b in var)}</table>
</section>'''
A=SEC('p23',23,'Motor speed control (PWM)','Motors','Turn a knob, the motor goes from crawling to full speed. A <b>555</b> switches the motor on and off 13,000 times per second, and the knob sets how long each \"on\" lasts. That trick (<b>PWM</b>) is how almost every modern device controls motors, fans and LED brightness.',
 '<label class="slider" style="flex:1">Trimmer: on-time<input id="p23d" type="range" min="0.09" max="0.98" step="0.01" value="0.5" style="flex:1;width:auto"></label><span class="hint" id="p23v"></span>','m23',
 'Left: the 555 output, zoomed in (one period = 76 µs). The motor only feels the average (dashed line). Right: the motor speed follows that average. Below ~15 %, the motor is too weak to start.',
 ['DC motor MFA RE140/1, 3–9 V (Gotronic 24851)','SS8050 NPN transistor, 1.5 A (Gotronic 43143)','NE555, 10 kΩ trimmer, 2 × 1N4148, 1N4007','2 × 1 kΩ, 470 Ω, red LED, 10 nF, 100 µF','9 V battery + clip (a 6 V pack of 4 AA batteries lasts longer with motors)'],H23,S23,V23)
B2=SEC('p24',24,'Motor forward / reverse (H-bridge)','Motors','Two buttons: <b>FORWARD</b> spins the motor one way, <b>REVERSE</b> the other way. An <b>L293D</b> chip swaps the motor\'s + and − for you, with a red/green LED pair showing the current\'s direction.',
 '<button id="p24f" style="font-size:1.05rem">▶ Hold FORWARD</button><button id="p24r" style="font-size:1.05rem">◀ Hold REVERSE</button>','m24',
 'The H-bridge: four switches around the motor. Hold a button to see which two switches close and which way the current (dots) goes. Hold both: the two top switches close, the motor gets 0 V and stops.',
 ['L293D motor driver (Gotronic 42327)','DC motor MFA RE140/1 (same as project 23)','2 push buttons, 6 × 10 kΩ, 1 kΩ','1 red + 1 green LED','9 V battery + clip'],H24,S24,V24)
s=open('circuits_body.html').read()
for id in ('p23','p24'):
    if f'<section id="{id}">' in s:
        a=s.index(f'<section id="{id}">');b=s.index('</section>',a)+10;s=s[:a]+s[b:]
k=s.index('\n<section id="rl1">');s=s[:k]+A+B2+s[k:]
NM={'p1':'LED brightness','p2':'LED fade','p3':'Polarity tester','p4':'Traffic light','p5':'Touch switch','p6':'Coil kick','p7':'Relay clicker','p16':'LED flip-flop',
 'p8':'555 blinker','p9':'LED chaser','p10':'Mini amp','p11':'Buzzer','p17':'Police siren','p18':'Fuzz pedal','p12':'Digital dice (Arduino)','p13':'Dice: LED dots','p14':'Dice: 7-seg matrix',
 'p15':'Dice: 7-seg decoder','p19':'Counter 00–99','p20':'Thermometer','p21':'Bar thermometer','p22':'IR beam alarm','p23':'Motor speed (PWM)','p24':'Motor forward/reverse','rl1':'Battery charger','rl2':'Night light'}
TH=[('💡 LEDs & basics',['p1','p2','p3','p4']),('🔀 Transistors & relays',['p5','p6','p7','p16']),('⏱️ Timers & blinkers',['p8','p9']),
 ('🔊 Sound & music',['p11','p17','p10','p18']),('🎲 Dice & counters',['p12','p13','p14','p15','p19']),('🌡️ Sensors & detectors',['p20','p21','p22']),('⚙️ Motors',['p23','p24']),('🏠 Real-life builds',['rl1','rl2'])]
num=lambda k:{'rl1':'A','rl2':'B'}.get(k,k[1:])
menu='<aside class="cl-menu" id="clMenu"><h4>Start</h4><a href="#cintro" data-cl="cintro"><span class="n">★</span>How to use this page</a>'+''.join(
 f'<h4>{t}</h4>'+''.join(f'<a href="#{k}" data-cl="{k}"><span class="n">{num(k)}</span>{NM[k]}</a>' for k in ks) for t,ks in TH)+'<h4>Parts</h4><a href="shopping.html"><span class="n">🛍️</span>Shopping list</a></aside>'
s=re.sub(r'<aside class="cl-menu" id="clMenu">.*?</aside>',menu,s,count=1,flags=re.S)
tab='<table>\n'+''.join(f'    <tr><td>{t}</td><td>'+' · '.join(f'<a class="navlink" href="#{k}">{num(k)} {NM[k]}</a>' for k in ks)+'</td></tr>\n' for t,ks in TH)+'  </table>'
a=s.index('<table>',s.index('<section id="cintro">'));b=s.index('</table>',a)+8;s=s[:a]+tab+s[b:]
open('circuits_body.html','w').write(s)
c=open('circuits.js').read()
js='\n// ===== p23 layout (generated) =====\nObject.assign(BBL,'+json.dumps({'p23':L23,'p24':L24})+');\n'
c=re.sub(r'\n// ===== p23 layout \(generated\) =====\nObject\.assign\(BBL,.*?\);\n','\n',c,flags=re.S)
c=c.replace('// wire up final + live canvases',js+'// wire up final + live canvases',1)
open('circuits.js','w').write(c)
D=open('motors_demo.js').read()
m=open('more.js').read()
m=re.sub(r'\n// ---------- p23/p24: motors ----------.*?(?=\n// ---------- loop ----------)','',m,flags=re.S)
m=m.replace('\n// ---------- loop ----------','\n'+D+'\n// ---------- loop ----------',1)
if "vis('m23')" not in m: m=m.replace("if(vis('m22'))drawIR(dt);","if(vis('m22'))drawIR(dt);if(vis('m23'))drawPWM(dt);if(vis('m24'))drawHB(dt);")
open('more.js','w').write(m)
print('ok')
