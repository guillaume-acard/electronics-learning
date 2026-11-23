import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))) if os.path.basename(os.path.dirname(os.path.abspath(__file__))) in ('generators','legacy') else os.path.dirname(os.path.abspath(__file__)))
from paths import SRC, PAGES, SITE
import json,re
R,B,Y,O,U,G,P='#dc2626','#111','#ca8a04','#ea580c','#2563eb','#16a34a','#9333ea'
exec(open('secgen.py').read())
c=open('circuits.js').read()
m=re.search(r'Object\.assign\(BBL,(\{"p16".*?\})\);\n',c,flags=re.S)
p19=json.loads(m.group(1))['p19']
base=[dict(p,s=1) for p in p19['parts'] if p['s']!=2 and p['t']!='batt' and not (p['t']=='wire' and p.get('a')=='h5' and p.get('b')=='h9')]
parts=base+[
 dict(s=2,t='chip',col=53,n=16,lab='CD4060'),dict(s=2,t='wire',a='a53',b='tp53',c=R),dict(s=2,t='wire',a='j60',b='bn60',c=B),dict(s=2,t='wire',a='a57',b='tn57',c=B),
 dict(s=3,t='res',a='b58',b='b59',v=10000000),dict(s=3,t='xtal',a='c58',b='c51'),dict(s=3,t='res',a='d59',b='d51',v=100000),dict(s=3,t='ccap',a='a58',b='tn58',lab='22p'),dict(s=3,t='ccap',a='a51',b='tn51',lab='22p'),
 dict(s=4,t='chip',col=2,n=14,lab='4013'),dict(s=4,t='wire',a='d2',b='tp2',c=R),dict(s=4,t='wire',a='j8',b='bn8',c=B),dict(s=4,t='wire',a='j5',b='bn5',c=B),dict(s=4,t='wire',a='j7',b='bn7',c=B),
 dict(s=4,t='wire',a='h3',b='h6',c=O),*[dict(s=4,t='wire',a=f'a{k}',b=f'tn{k}',c=B) for k in (5,6,7,8)],
 dict(s=5,t='wire',a='j55',b='i4',c=P),dict(s=5,t='wire',a='h2',b='h9',c=Y),
 dict(s=6,t='batt',at=[40,30],plus='tp1',minus='tn2')]
L26={'power':6,'parts':parts}
steps=["Build the <a class=\"navlink\" href=\"#p19\">00–99 counter (project 19)</a> completely, <b>except</b> its step 2 (the NE555 and its parts) and the jumper <b>h5 → h9</b>. The quartz time base replaces the 555.",
 "<b>CD4060</b> (oscillator + 14-stage divider) across the gap, notch left, columns <b>53–60</b> (bottom pins 1–8: Q12, Q13, Q14, Q6, Q5, Q7, Q4, VSS; top pins 16–9: VDD, Q10, Q8, Q9, RESET, φI, φO̅, φO). <b>a53</b> (VDD) → top +, <b>j60</b> (VSS) → bottom −, <b>a57</b> (RESET) → top −: it runs.",
 "The <b>quartz oscillator</b>: <b>10 MΩ</b> b58–b59 (between pin 11 and pin 10: it wakes the inverter up). <b>32.768 kHz quartz</b> from <b>c58</b> (pin 11) to <b>c51</b>. <b>100 kΩ</b> from <b>d59</b> (pin 10) to <b>d51</b> (it protects the tiny crystal from too much drive). Two <b>22 pF</b>: <b>a58</b> → top −, <b>a51</b> → top −. Keep the quartz legs short and don't touch it while it runs.",
 "<b>CD4013</b> (flip-flop) across the gap, notch left, columns <b>2–8</b> (bottom pins 1–7: Q1, Q̅1, CLK1, R1, D1, S1, VSS; top pins 14–8: VDD, Q2, Q̅2, CLK2, R2, D2, S2). <b>d2</b> → top +, <b>j8</b> → bottom −, <b>j5</b> (R1) and <b>j7</b> (S1) → bottom −. Toggle: jumper <b>h3 → h6</b> (Q̅1 → D1). The unused second flip-flop's inputs to top −: <b>a5, a6, a7, a8</b> (CMOS inputs must never float).",
 "Link the chain: <b>j55 → i4</b> (CD4060 Q14, 2 Hz → CD4013 clock) and <b>h2 → h9</b> (CD4013 Q1, 1 Hz → CD4518 CLK A).",
 "Connect the battery. Press the reset button: 00. The display now counts <b>exactly one per second</b>. Check against your phone's stopwatch: after 99 s they still agree."]
how=["A <b>quartz</b> is a tiny slice of crystal that vibrates at one single frequency, like a tuning fork. A watch quartz vibrates at <b>32,768 times per second</b>. Inside the CD4060, an inverter (a NOT gate) keeps it vibrating: the 10 MΩ biases it, the two 22 pF and the 100 kΩ make the crystal the only thing that sets the rhythm.",
 "Why 32,768? Because it's 2¹⁵: divide it by 2 fifteen times and you get exactly 1 Hz. The CD4060 contains a chain of 14 dividers (flip-flops): 32,768 → 16,384 → 8,192 → … → its last output Q14 gives <b>2 Hz</b>. The CD4013 is one more divider: each time its clock rises, its output flips (because Q̅ is fed back to D). 2 Hz → <b>1 Hz</b>.",
 "The 1 Hz goes into the counter of project 19 instead of the 555. The NE555's rhythm depends on a resistor and a capacitor (5–10 % tolerance, and it drifts with temperature and battery). The quartz is accurate to about ±20 ppm: <b>less than 2 seconds per day</b>.",
 "💧 <b>Analogy:</b> the 555 is a bucket that fills and empties: roughly regular, depending on the tap. The quartz is a pendulum clock's pendulum: it always swings at the same pace. The dividers are the gears that turn its fast ticks into seconds."]
var=[("Start / stop","Move the RESET jumper (a57) from top − to top +: the CD4060 freezes, the count stops. Back to −: it continues. Use a switch there and you have a stopwatch."),
 ("See the 2 Hz","LED + 1 kΩ from CD4060 pin 3 (Q14, column 55 bottom) to −: it blinks twice a second. On Q12 (column 53): 8 times a second."),
 ("Count 00–59 like a clock","Add a CD4081 (AND gates): when the tens reach 6 (Q2B and Q3B both high), its output resets both counters. That's how real clocks count seconds and minutes."),
 ("Compare with the 555","Build project 19 again with its 555 next to it: after a few minutes, the two counters disagree. The quartz one matches your phone."),
 ("Touch the quartz","Pinch the crystal or its 22 pF while it runs: the count may hiccup. The oscillator is sensitive to anything that adds capacitance: that's why the legs must be short.")]
A=SEC('p26',26,'Quartz stopwatch (00–99 seconds)','Timers','The 00–99 counter of project 19, but driven by a <b>32.768 kHz watch quartz</b> instead of the NE555: it counts <b>exactly one per second</b>. A CD4060 makes the quartz vibrate and divides its 32,768 ticks per second down to 2 Hz; a CD4013 halves that to 1 Hz.',
 '<button id="p26r">↺ Reset both</button><span class="hint">The two counters run on your real clock: the 555 version drifts (3 % fast here), the quartz one stays exact.</span>','m26',
 'Top: the divider chain, from the quartz to 1 Hz. The first stages are far too fast to see; the last ones blink. Bottom: a quartz stopwatch and a 555 stopwatch started together.',
 ['32.768 kHz watch quartz (Gotronic 05220)','CD4060 oscillator + 14-stage divider (Gotronic 20318)','CD4013 dual D flip-flop (Gotronic 20273)','10 MΩ, 100 kΩ, 2 × 22 pF ceramic (Gotronic 15816)','Everything from project 19 except the 555 and its 3 timing parts'],how,steps,var)
s=open('circuits_body.html').read()
if '<section id="p26">' in s:
    a=s.index('<section id="p26">');b=s.index('</section>',a)+10;s=s[:a]+s[b:]
k=s.index('\n<section id="rl1">');s=s[:k]+A+s[k:]
mg=open('menugen.py').read().replace("'p25':'Lower the voltage',","'p25':'Lower the voltage','p26':'Quartz stopwatch',").replace("('⏱️ Timers & blinkers',['p8','p9'])","('⏱️ Timers & blinkers',['p8','p9','p26'])")
if "'p25':'Lower the voltage'" not in mg:
    mg=mg.replace("'p24':'Motor forward/reverse',","'p24':'Motor forward/reverse','p25':'Lower the voltage','p26':'Quartz stopwatch',").replace("('⚙️ Motors',['p23','p24'])","('⚙️ Motors',['p23','p24','p25'])")
exec(mg)
open('circuits_body.html','w').write(s)
open('menugen.py','w').write(mg)
c=open('circuits.js').read()
js='\n// ===== p26 layout (generated) =====\nObject.assign(BBL,'+json.dumps({'p26':L26})+');\n'
c=re.sub(r'\n// ===== p26 layout \(generated\) =====\nObject\.assign\(BBL,.*?\);\n','\n',c,flags=re.S)
c=c.replace('// wire up final + live canvases',js+'// wire up final + live canvases',1)
if "case 'xtal':" not in c:
    x="""  case 'xtal':{leg(ctx,A,B);const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;ctx.fillStyle='#cbd5e1';ctx.beginPath();ctx.roundRect(mx-12,my-5,24,10,5);ctx.fill();ctx.strokeStyle='#64748b';ctx.lineWidth=1;ctx.stroke();txt(ctx,'32k',mx,my+3,'#334155',7);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);break;}
"""
    c=c.replace("  case 'npn':",x+"  case 'npn':",1)
open('circuits.js','w').write(c)
D=open('p26_demo.js').read()
mm=open('more.js').read()
mm=re.sub(r'\n// ---------- p26: quartz stopwatch ----------.*?(?=\n// ---------- loop ----------)','',mm,flags=re.S)
mm=mm.replace('\n// ---------- loop ----------','\n'+D+'\n// ---------- loop ----------',1)
if "vis('m26')" not in mm: mm=mm.replace("if(vis('m25'))drawLV(dt);","if(vis('m25'))drawLV(dt);if(vis('m26'))drawQZ(dt);")
open('more.js','w').write(mm)
print('ok')
