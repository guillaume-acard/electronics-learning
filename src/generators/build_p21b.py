import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))) if os.path.basename(os.path.dirname(os.path.abspath(__file__))) in ('generators','legacy') else os.path.dirname(os.path.abspath(__file__)))
from paths import SRC, PAGES, SITE
import json,re
R,B,Y,O,U,G,P='#dc2626','#111','#ca8a04','#ea580c','#2563eb','#16a34a','#9333ea'
exec(open('secgen.py').read())
parts=[dict(s=1,t='pm')]
# chips
for c,lab,s in [(4,'LM339 U1',2),(13,'LM339 U2',2),(22,'LM339 U3',2)]:
    parts+= [dict(s=s,t='chip',col=c,n=14,lab=lab),dict(s=s,t='wire',a=f'j{c+2}',b=f'bp{c+2}',c=R),dict(s=s,t='wire',a=f'a{c+2}',b=f'tn{c+2}',c=B)]
# LM35
parts+=[dict(s=3,t='npn',c='c43',b='c44',e='c45',lab='LM35'),dict(s=3,t='wire',a='a43',b='tp43',c=R),dict(s=3,t='wire',a='a45',b='tn45',c=B)]
# signal chain to all IN- inputs
parts+=[dict(s=4,t='wire',a=a,b=b,c=Y) for a,b in [('b44','g25'),('h25','h27'),('i27','d19'),('c19','c17'),('b17','g18'),('h18','h16'),('i16','d10'),('c10','c8'),('b8','g9'),('h9','h7')]]
# ladder
for k in range(9):
    r='h' if k%2==0 else 'i';parts.append(dict(s=5,t='res',a=f'{r}{32+k}',b=f'{r}{33+k}',v=100))
parts+=[dict(s=5,t='res',a='j32',b='j30',v=470),dict(s=5,t='res',a='i30',b='bn30',v=330),
 dict(s=5,t='res',a='j41',b='j44',v=10000),dict(s=5,t='res',a='i44',b='i46',v=10000),dict(s=5,t='pot',h=['g46','g47','g48']),dict(s=5,t='wire',a='j47',b='bp47',c=R)]
taps=['i8','i10','b9','b7','i17','i19','b18','b16','i26','i28']
parts+=[dict(s=6,t='wire',a=f'g{32+k}',b=h,c=U) for k,h in enumerate(taps)]
# bar graph + LEDs
parts+=[dict(s=7,t='bar',col=50,cols=['g']*10,lab='DC10G'),dict(s=7,t='sil',a='j49',b='j57',lab='8 × 470 Ω'),dict(s=7,t='wire',a='i49',b='bp49',c=R),dict(s=7,t='res',a='j58',b='bp58',v=470),dict(s=7,t='res',a='j59',b='bp59',v=470)]
outs=['i5','i4','b4','b5','i14','i13','b13','b14','i23','i22']
parts+=[dict(s=8,t='wire',a=h,b=f'a{50+k}',c=G) for k,h in enumerate(outs)]
L21={'power':9,'parts':parts}
steps=["USB <b>unplugged</b>. Plug the <b>power module</b> on the left end of the board, <b>both</b> jumpers on <b>5 V</b>. A steady 5 V matters here: the thresholds are made from it, so a tired 9 V battery would shift the scale.",
 "Three <b>LM339</b> across the gap, notch left: <b>U1</b> columns 4–10, <b>U2</b> 13–19, <b>U3</b> 22–28. Each one: pin 3 (VCC, 3rd bottom pin) → bottom +: <b>j6, j15, j24</b>. Pin 12 (GND, 3rd top pin) → top −: <b>a6, a15, a24</b>.",
 "<b>LM35DZ</b> in the top half, flat side facing you: <b>c43</b> (+Vs), <b>c44</b> (Vout), <b>c45</b> (GND). <b>a43</b> → top +, <b>a45</b> → top −.",
 "The <b>temperature signal</b> goes to all ten \"−\" inputs (yellow jumpers, in this order): <b>b44→g25</b>, <b>h25→h27</b> (U3), <b>i27→d19</b>, <b>c19→c17</b>, <b>b17→g18</b>, <b>h18→h16</b> (U2), <b>i16→d10</b>, <b>c10→c8</b>, <b>b8→g9</b>, <b>h9→h7</b> (U1).",
 "The <b>ladder</b> (10 thresholds, 20 mV = 2 °C apart): nine <b>100 Ω</b> in a chain, columns 32→41, alternating rows: h32–h33, i33–i34, h34–h35, i35–i36, h36–h37, i37–i38, h38–h39, i39–i40, h40–h41. Bottom end: <b>470 Ω</b> j32–j30 + <b>330 Ω</b> i30 → bottom −. Top end: <b>10 kΩ</b> j41–j44, <b>10 kΩ</b> i44–i46, <b>10 kΩ trimmer</b> in g46–g48, wiper <b>j47</b> → bottom +.",
 "Ladder taps to the ten \"+\" inputs (blue jumpers): <b>g32→i8</b>, <b>g33→i10</b>, <b>g34→b9</b>, <b>g35→b7</b> (U1), <b>g36→i17</b>, <b>g37→i19</b>, <b>g38→b18</b>, <b>g39→b16</b> (U2), <b>g40→i26</b>, <b>g41→i28</b> (U3).",
 "<b>DC10G</b> bar graph across the gap, columns <b>50–59</b>, pin 1 (marked corner) bottom-left: bottom row = anodes 1–10, top row = cathodes. <b>Resistor network 8 × 470 Ω</b> (common point) in row j, columns <b>49–57</b>, with the <b>dotted pin 1 (common) in j49</b>: its 8 resistors land straight in the anode columns of segments 1–8, no jumper needed. Jumper <b>i49</b> → bottom +. Segments 9 and 10: two ordinary <b>470 Ω</b>, j58 → bottom + and j59 → bottom +. <b>Quick test</b>: touch a top pin (e.g. a50) with a jumper to −: that segment lights.",
 "Comparator outputs to the bar's cathodes (green jumpers): <b>i5→a50</b>, <b>i4→a51</b>, <b>b4→a52</b>, <b>b5→a53</b> (U1), <b>i14→a54</b>, <b>i13→a55</b>, <b>b13→a56</b>, <b>b14→a57</b> (U2), <b>i23→a58</b>, <b>i22→a59</b> (U3).",
 "Plug the USB. Calibrate with the trimmer: segments light at <b>16, 18, 20 … 34 °C</b>, so at 21 °C you want 3 segments. With a multimeter: <b>0.160 V</b> on g32 (or 0.340 V on g41). Pinch the LM35: the bar grows."]
how=["The <b>LM35</b> gives 10 mV per °C (0.22 V at 22 °C). Each <b>comparator</b> in the LM339 answers one question: \"is the temperature signal (−) higher than my threshold (+)?\". If yes, its output connects to ground and its LED lights. Three LM339 = 12 comparators; we use 10.",
 "The <b>ladder</b> makes the 10 thresholds: a small current (0.2 mA) flows from +5 V through 20 kΩ + the trimmer, then nine 100 Ω, then 800 Ω to ground. Each 100 Ω drops 0.2 mA × 100 Ω = <b>20 mV</b> = 2 °C. The 800 Ω at the bottom lifts the first step to 160 mV = 16 °C. The trimmer adjusts the current, so it stretches or shrinks the whole scale.",
 "Warmer → higher signal → it passes more rungs → more comparators say \"yes\" → <b>a longer bar</b>. This is exactly what is inside an LM3914, built by hand. The difference: the LM339 doesn't limit the LED current, so each LED gets its own 470 Ω (≈ 6 mA). Eight of them come in one <b>resistor network</b>: 8 resistors in one flat package, all joined on one side (pin 1, marked with a dot), which goes to +5 V.",
 "💧 <b>Water analogy:</b> a tall tank with 10 overflow holes at equal heights (the ladder), each feeding a little light. The warmer it is, the higher the water rises, and the more holes spill over.",
 "Right at a threshold, the signal wobbles by a fraction of a mV and the last segment may flicker. That's normal: a real product adds a little <b>hysteresis</b> (a 1 MΩ from each output back to its + input)."]
var=[("Finer or coarser scale","Turn the trimmer: less current = smaller steps (≈ 1.6 °C per segment, 13–28 °C); more current = bigger steps (≈ 2.5 °C, 20–43 °C). Re-check with a known temperature."),
 ("Battery level meter","Unplug the LM35 signal (b44) and feed the \"−\" inputs from a divider on a battery (two 10 kΩ): the bar shows how full it is."),
 ("Add hysteresis","1 MΩ from U1 pin 2 (output 1) to pin 5 (its + input): segment 1 now switches on and off cleanly, no flicker."),
 ("With an LM3914 instead","One chip (€9.90) contains the 10 comparators, the ladder, a reference and the LED current limit: 3 jumpers instead of 30. See the <a class=\"navlink\" href=\"#chips\">Microchips</a> page."),
 ("Use the 2 spare comparators","U3 still has 2 free comparators: add two more segments (individual LEDs + 470 Ω) at 36 and 38 °C by extending the ladder with two 100 Ω.")]
A=SEC('p21',21,'Bar-graph thermometer (no Arduino)','No microcontroller','A 10-segment green <b>DC10G</b> bar graph that grows with the temperature, one segment every 2 °C from 16 to 34 °C. Built with three <b>LM339</b> comparator chips, an <b>LM35</b> sensor and a ladder of resistors: you build by hand what an LM3914 does inside.',
 '<button id="bgHot" style="font-size:1.05rem">🤏 Hold to warm the sensor</button><label class="slider" style="flex:1">Trimmer (ladder current)<input id="bgRHI" type="range" min="0.15" max="0.26" step="0.002" value="0.2" style="flex:1;width:auto"></label><span class="hint" id="bgI"></span>','m21',
 'Left: the LM35 voltage. Middle: the ladder and the 10 comparators; each one compares the signal with its own rung and pulls its segment to ground when the signal is higher. Right: the bar graph. The trimmer sets the ladder current, so the size of each step.',
 ['3 × LM339N quad comparator (Gotronic 21087)','DC10G green 10-LED bar graph (Gotronic 03142)','LM35DZ temperature sensor (Gotronic 21071)','9 × 100 Ω, 470 Ω + 330 Ω, 2 × 10 kΩ, 10 kΩ trimmer','Resistor network 8 × 470 Ω with common point (Gotronic 04482) + 2 × 470 Ω','Breadboard with its 5 V power module (USB), about 35 jumpers'],how,steps,var)
A=A.replace('<p class="hint">Left: the LM35','<div class="howbox" style="margin-top:10px"><p>⚠️ <b>DC10G pins:</b> the steps assume the usual layout of these bar graphs: pins 1–10 = anodes of segments 1–10 (bottom row), pins 20–11 = their cathodes (top row, pin 20 above pin 1). I couldn\'t read Gotronic\'s datasheet, so do step 7\'s 10-second test. If nothing lights, the bar is the other way round: turn it 180°.</p></div>\n  <p class="hint">Left: the LM35',1)
A=A.replace('Wire with the battery <b>disconnected</b>, and connect it <b>last</b>','Wire with the USB <b>unplugged</b>, and plug it <b>last</b>')
s=open('circuits_body.html').read()
a=s.index('<section id="p21">');b=s.index('</section>',a)+10;s=s[:a]+A.strip('\n')+s[b:]
open('circuits_body.html','w').write(s)
c=open('circuits.js').read()
c=re.sub(r'// ===== p21 layout \(generated\) =====\nObject\.assign\(BBL,.*?\);\n',lambda _m:'// ===== p21 layout (generated) =====\nObject.assign(BBL,'+json.dumps({'p21':L21})+');\n',c,count=1,flags=re.S)
c=c.replace("txt(ctx,'DC10RG',(xl+xr)/2,BB.rows.d+3,'#94a3b8',8);","txt(ctx,p.lab||'DC10RG',(xl+xr)/2,BB.rows.d+3,'#94a3b8',8);")
open('circuits.js','w').write(c)
D=r'''// ---------- p21: bar-graph thermometer ----------
const BG21={T:22,hot:false};
function drawBarT(dt){const ctx=cv('m21');BG21.T+=((BG21.hot?38:22)-BG21.T)*(1-Math.exp(-dt/(BG21.hot?3:6)));
  const V=BG21.T*0.01,I=+$('bgRHI').value*1e-3;$('bgI').textContent=(I*1e3).toFixed(3)+' mA → '+(I*100*1000/10).toFixed(1)+' °C per step';
  const th=k=>(800+100*k)*I;
  ctx.fillStyle='#111c2e';ctx.strokeStyle='#f97316';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(20,90,130,90,8);ctx.fill();ctx.stroke();
  txt(ctx,'LM35',85,114,'#cbd5e1',13);txt(ctx,BG21.T.toFixed(1)+' °C',85,140,'#fff',16);txt(ctx,'signal '+(V*1000).toFixed(0)+' mV',85,165,'#fbbf24',13);if(BG21.hot)txt(ctx,'🤏',85,215,'#fff',22);
  W(ctx,[[150,135],[200,135]],'#fbbf24',3);
  const x0=230,yb=270,yt=30,h=(yb-yt)/10;txt(ctx,'+5 V via 20 kΩ + trimmer',x0+40,yt-8,'#94a3b8',11);txt(ctx,'800 Ω to GND',x0+40,yb+16,'#94a3b8',11);
  for(let i=0;i<10;i++){const y=yb-(i+1)*h+h/2,t=th(i),on=V>t;
    ctx.fillStyle='#1e293b';ctx.fillRect(x0,y-h/2+2,80,h-4);txt(ctx,(t*1000).toFixed(0)+' mV',x0+40,y+4,'#94a3b8',10);
    ctx.fillStyle=on?'#22c55e':'#475569';ctx.beginPath();ctx.moveTo(x0+90,y-8);ctx.lineTo(x0+110,y);ctx.lineTo(x0+90,y+8);ctx.closePath();ctx.fill();
    W(ctx,[[x0+110,y],[470,y]],on?'#22c55e':'#334155',2);
    const bx=480;ctx.fillStyle=on?'#22c55e':'#14301f';if(on){ctx.shadowBlur=14;ctx.shadowColor='#22c55e';}ctx.fillRect(bx,y-h/2+3,120,h-6);ctx.shadowBlur=0;
    txt(ctx,'≥ '+(t*100).toFixed(1)+' °C',bx+130,y+4,'#94a3b8',11,'left');}
  txt(ctx,'10 comparators (3 × LM339)',x0+100,yb+16,'#94a3b8',11,'left');}
(()=>{const b=$('bgHot');b.style.touchAction='none';b.addEventListener('pointerdown',e=>{e.preventDefault();BG21.hot=true;});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>BG21.hot=false));})();
'''
m=open('more.js').read()
a=m.index('// ---------- p21: bar-graph thermometer ----------');b=m.index('// ---------- p5: why two transistors')
m=m[:a]+D+'\n'+m[b:]
open('more.js','w').write(m)
print('ok',len(parts))
