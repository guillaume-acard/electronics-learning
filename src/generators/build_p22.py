import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))) if os.path.basename(os.path.dirname(os.path.abspath(__file__))) in ('generators','legacy') else os.path.dirname(os.path.abspath(__file__)))
from paths import SRC, PAGES, SITE
import json,re
R,B,Y,O,U,G,P='#dc2626','#111','#ca8a04','#ea580c','#2563eb','#16a34a','#9333ea'
parts=[dict(s=1,t='pm'),
 dict(s=2,t='chip',col=4,n=8,lab='555 #1'),dict(s=2,t='wire',a='d4',b='tp4',c=R),dict(s=2,t='wire',a='j4',b='bn4',c=B),dict(s=2,t='wire',a='j7',b='bp7',c=R),
 dict(s=3,t='res',a='c4',b='c5',v=1000),dict(s=3,t='res',a='b5',b='b6',v=10000),dict(s=3,t='wire',a='a6',b='i5',c=U),dict(s=3,t='ccap',a='h5',b='bn5',lab='100n'),
 dict(s=4,t='chip',col=20,n=8,lab='555 #2'),dict(s=4,t='wire',a='d20',b='tp20',c=R),dict(s=4,t='wire',a='j20',b='bn20',c=B),dict(s=4,t='wire',a='g6',b='g23',c=P),
 dict(s=5,t='res',a='c20',b='c21',v=1000),dict(s=5,t='res',a='b21',b='b26',v=2200),dict(s=5,t='res',a='c26',b='c29',v=1000),dict(s=5,t='res',a='d29',b='d22',v=330),
 dict(s=5,t='wire',a='a22',b='i21',c=U),dict(s=5,t='ccap',a='h21',b='bn21',lab='4.7n'),
 dict(s=6,t='res',a='i22',b='i28',v=1000),dict(s=6,t='wire',a='h28',b='h55',c=O),dict(s=6,t='led',a='g55',b='g57',rgb='139,92,246'),dict(s=6,t='wire',a='j57',b='bn57',c=B),
 dict(s=7,t='npn',c='c40',b='c41',e='c42',lab='TSOP'),dict(s=7,t='wire',a='a41',b='tn41',c=B),dict(s=7,t='wire',a='a42',b='tp42',c=R),dict(s=7,t='ecap',a='b42',b='tn43',lab='10µ'),
 dict(s=8,t='res',a='tp36',b='a36',v=4700),dict(s=8,t='ecap',a='b36',b='tn37',lab='10µ'),dict(s=8,t='diode',a='d36',b='d40'),
 dict(s=9,t='npn',c='c46',b='c47',e='c48'),dict(s=9,t='wire',a='a48',b='tn49',c=B),dict(s=9,t='res',a='e36',b='e47',v=10000),dict(s=9,t='res',a='a47',b='tn47',v=10000),
 dict(s=9,t='res',a='tp44',b='a44',v=330),dict(s=9,t='led',a='b44',b='b46')]
steps=[
 "USB <b>unplugged</b>. Plug the <b>power module</b> on the left end of the board and set <b>both</b> its jumpers to <b>5 V</b>. ⚠️ Not 9 V: the TSOP receiver dies above 5.5 V.",
 "<b>555 #1</b> (the \"burst\" maker) across the gap, notch left, columns <b>4–7</b>. Power: <b>d4</b> (pin 8) → top +, <b>j4</b> (pin 1) → bottom −. Reset (pin 4): <b>j7</b> → bottom +.",
 "555 #1 timing: <b>1 kΩ</b> c4–c5, <b>10 kΩ</b> b5–b6, jumper <b>a6 → i5</b> (pin 6 → pin 2), <b>100 nF</b> from <b>h5</b> to bottom −. It switches about 690 times per second.",
 "<b>555 #2</b> (the 38 kHz maker), notch left, columns <b>20–23</b>. Power: <b>d20</b> → top +, <b>j20</b> → bottom −. Its reset (pin 4, column 23) is driven by 555 #1's output: jumper <b>g6 → g23</b>. So 555 #2 only runs while 555 #1's output is high: bursts.",
 "555 #2 timing: <b>1 kΩ</b> c20–c21. Then three resistors in series from pin 7 to pin 6 (= 3.53 kΩ): <b>2.2 kΩ</b> b21–b26, <b>1 kΩ</b> c26–c29, <b>330 Ω</b> d29–d22. Jumper <b>a22 → i21</b>, <b>4.7 nF</b> from <b>h21</b> to bottom −. That's ≈ 38,000 Hz.",
 "<b>IR LED</b> (TSAL6200, looks like a clear or blue-ish LED): <b>1 kΩ</b> from <b>i22</b> (555 #2 output) to <b>i28</b>, jumper <b>h28 → h55</b>, LED long leg in <b>g55</b>, short leg in <b>g57</b>, <b>j57</b> → bottom −. Bend it so it points <b>left, along the board</b>.",
 "<b>TSOP38238</b> receiver in the top half: <b>c40</b> (OUT), <b>c41</b> (GND), <b>c42</b> (Vs), with the dome <b>facing you</b>. <b>a41</b> → top −, <b>a42</b> → top +. <b>10 µF</b>: + leg <b>b42</b>, − leg top −. Then gently bend it so the dome looks <b>right, at the IR LED</b>.",
 "Detector (the \"bucket\"): <b>4.7 kΩ</b> from top + to <b>a36</b>. <b>10 µF</b>: + leg <b>b36</b>, − leg top −. <b>1N4148</b>: plain end in <b>d36</b>, black-ring end in <b>d40</b> (TSOP OUT).",
 "Alarm: <b>BC547</b> flat side facing you in <b>c46</b> (C), <b>c47</b> (B), <b>c48</b> (E); <b>a48</b> → top −. <b>10 kΩ</b> e36–e47 (bucket → base) and <b>10 kΩ</b> a47 → top − (keeps it off when the bucket is low). <b>Red LED</b>: <b>330 Ω</b> from top + to <b>a44</b>, long leg <b>b44</b>, short leg <b>b46</b> (collector).",
 "Plug the USB. Aim the IR LED at the TSOP, 5–20 cm apart: the red LED stays <b>off</b> (beam seen). Put your hand or a book between them: the red LED <b>lights</b>. Tip: your phone's front camera sees IR, so you can check the IR LED is on (faint purple glow)."]
how=[
 "<b>The problem:</b> everything glows in infrared: the sun, lamps, radiators, your body. A plain IR sensor would be fooled all the time. <b>The trick:</b> the IR LED blinks <b>38,000 times per second</b>, and the <b>TSOP</b> contains a filter that only reacts to light blinking at exactly that speed. Like hearing your own name in a noisy room: everything else is ignored. TV remotes use the same trick.",
 "<b>555 #2</b> makes the 38 kHz (1 kΩ, 3.53 kΩ and 4.7 nF). <b>555 #1</b> switches it on and off about 690 times per second, in <b>bursts</b>, through 555 #2's reset pin. Why? The TSOP slowly gets used to a signal that never stops (it treats it as noise) and goes deaf. Bursts keep it listening.",
 "The TSOP's <b>OUT</b> goes <b>low</b> during each burst it receives. The diode lets it empty the 10 µF \"bucket\" at every burst, while the 4.7 kΩ slowly refills it. Beam present: the bucket is emptied 690 times a second and stays near 0.8 V. <b>Beam blocked:</b> nothing empties it, it fills to ~3.6 V in a few hundredths of a second, the BC547 turns on and the red LED lights.",
 "💧 <b>Water analogy:</b> a bucket under a small tap (4.7 kΩ), with a drain that opens at every burst (the TSOP). As long as the bursts arrive, the bucket stays empty. Block the beam: the drain stays shut, the bucket fills up and overflows into the alarm.",
 "The two 10 kΩ resistors form a <b>divider</b>: the base only gets enough voltage when the bucket is above ~1.3 V. That stops the 0.8 V \"empty\" level from half-lighting the LED. See the <a class=\"navlink\" href=\"#seir\">infrared sensors</a> page for more on the TSOP."]
var=[("Wrong frequency","Swap the 330 Ω (d29–d22) for a 2.2 kΩ: 555 #2 now blinks at ~26 kHz. The TSOP ignores it, so the alarm stays on even with the beam. That's the filter at work."),
 ("TV remote tester","Unplug the IR LED (g55). Point any TV remote at the TSOP and press a button: the red LED blinks off while it receives (remotes send 36–40 kHz bursts)."),
 ("Obstacle detector","Point the IR LED and the TSOP both upwards, side by side, with a piece of cardboard between them. A hand above reflects the IR back: the red LED goes <b>off</b> when something is there."),
 ("Stronger beam","Replace the 1 kΩ (i22–i28) with 220 Ω: the beam reaches several metres across a room. But reflections off walls can then \"go around\" your hand, so keep the 1 kΩ for a short barrier."),
 ("Read remote codes with the Arduino","TSOP OUT → ONE-C pin 2 (TSOP Vs on the board's 5 V). With the IRremote library, the serial monitor shows a different code for each button of your remote.")]
SEC=f'''
<section id="p22">
  <h2><span class="num">22</span>Infrared beam alarm</h2>
  <p><span class="qtopic">Sensors</span> An invisible infrared beam between an <b>IR LED</b> and a <b>TSOP38238</b> receiver. Cut the beam with your hand (or a cat 🐈) and the red LED turns on. Two NE555 timers make the IR LED blink at 38 kHz in bursts, so that sunlight and lamps can't fool the receiver.</p>
  <div class="controls"><button id="irBlock" style="font-size:1.05rem">✋ Hold to block the beam</button><label class="slider" style="flex:1">555 #2 frequency<input id="irF" type="range" min="26" max="50" step="0.5" value="38" style="flex:1;width:auto"></label><span class="hint" id="irFv">38 kHz</span></div>
  <canvas id="m22" width="800" height="360"></canvas>
  <p class="hint">Top: the signal path, from the two 555s to the IR LED, across the air to the TSOP, into the \"bucket\" and the alarm. Bottom: the signals, slowed down a lot. Move the frequency away from 38 kHz: the TSOP stops hearing it and the alarm goes off even with the beam.</p>
  <div style="margin-top:12px"><h3 style="margin-top:0">🧰 You need</h3><ul><li>TSOP38238 IR receiver, 38 kHz (Gotronic 03417)</li><li>TSAL6200 IR LED (Gotronic 03458), or any 940 nm IR LED</li><li>2 × NE555, 1 × BC547, 1 × 1N4148, 1 red LED</li><li>Resistors: 4 × 1 kΩ, 2.2 kΩ, 2 × 330 Ω, 4.7 kΩ, 3 × 10 kΩ</li><li>Capacitors: 4.7 nF, 100 nF, 2 × 10 µF</li><li>Breadboard with its <b>5 V</b> power module (USB). Not the 9 V battery!</li></ul></div>
  <h3>💡 How it works</h3>
  <div class="howbox">{''.join(f'<p>{p}</p>' for p in how)}</div>
  <h3>🏁 Final breadboard setup</h3>
  <p class="hint" style="margin-top:-6px">This is what your board should look like when it's finished (and powered). Compare with it at the end.</p>
  <canvas id="bbF_p22" class="bbc" width="800" height="440"></canvas>
  <h3 class="wtitle">🔌 Step-by-step wiring <span class="wprog"></span> <button class="wreset">↺ reset</button></h3>
  <p class="hint" style="margin-top:-6px">Follow the steps in order and tick each one. Wire with the USB <b>unplugged</b>, and plug it <b>last</b>. Column and hole numbers (a–j) follow the <a class="navlink" href="#cintro">breadboard map</a>.</p>
  <div class="bblive"><div class="bbcap">🧩 Your breadboard so far: parts appear as you tick the steps, and the <span style="color:#f59e0b">glowing outline</span> shows where the next step goes.</div><canvas id="bbS_p22" class="bbc" width="800" height="440"></canvas></div>
  <ol class="wsteps">{''.join(f'<li><label><input type="checkbox"><span>{t}</span></label></li>' for t in steps)}</ol>
  <h3>🧪 Variants to try</h3>
  <table>{''.join(f'<tr><td>{a}</td><td>{b}</td></tr>' for a,b in var)}</table>
</section>'''
s=open('circuits_body.html').read()
if '<section id="p22">' in s:
    a=s.index('<section id="p22">');b=s.index('</section>',a)+10;s=s[:a]+s[b:]
k=s.index('\n<section id="rl1">');s=s[:k]+SEC+s[k:]
# ---- themed menu ----
NM={'p1':'LED brightness','p2':'LED fade','p3':'Polarity tester','p4':'Traffic light','p5':'Touch switch','p6':'Coil kick','p7':'Relay clicker','p16':'LED flip-flop',
 'p8':'555 blinker','p9':'LED chaser','p10':'Mini amp','p11':'Buzzer','p17':'Police siren','p18':'Fuzz pedal','p12':'Digital dice (Arduino)','p13':'Dice: LED dots','p14':'Dice: 7-seg matrix',
 'p15':'Dice: 7-seg decoder','p19':'Counter 00–99','p20':'Thermometer','p21':'Bar thermometer','p22':'IR beam alarm','rl1':'Battery charger','rl2':'Night light'}
TH=[('💡 LEDs & basics',['p1','p2','p3','p4']),('🔀 Transistors & relays',['p5','p6','p7','p16']),('⏱️ Timers & blinkers',['p8','p9']),
 ('🔊 Sound & music',['p11','p17','p10','p18']),('🎲 Dice & counters',['p12','p13','p14','p15','p19']),('🌡️ Sensors & detectors',['p20','p21','p22']),('🏠 Real-life builds',['rl1','rl2'])]
num=lambda k:{'rl1':'A','rl2':'B'}.get(k,k[1:])
menu='<aside class="cl-menu" id="clMenu"><h4>Start</h4><a href="#cintro" data-cl="cintro"><span class="n">★</span>How to use this page</a>'+''.join(
 f'<h4>{t}</h4>'+''.join(f'<a href="#{k}" data-cl="{k}"><span class="n">{num(k)}</span>{NM[k]}</a>' for k in ks) for t,ks in TH)+'<h4>Parts</h4><a href="shopping.html"><span class="n">🛍️</span>Shopping list</a></aside>'
s=re.sub(r'<aside class="cl-menu" id="clMenu">.*?</aside>',menu,s,count=1,flags=re.S)
tab='<table>\n'+''.join(f'    <tr><td>{t}</td><td>'+' · '.join(f'<a class="navlink" href="#{k}">{num(k)} {NM[k]}</a>' for k in ks)+'</td></tr>\n' for t,ks in TH)+'  </table>'
a=s.index('<table>',s.index('<section id="cintro">'));b=s.index('</table>',a)+8;s=s[:a]+tab+s[b:]
s=s.replace('Pick a project in the menu on the left.','Pick a project in the menu on the left: they are grouped by <b>theme</b>, and within a theme they go from easiest to hardest.',1)
open('circuits_body.html','w').write(s)
# ---- layout ----
c=open('circuits.js').read()
js='\n// ===== p22 layout (generated) =====\nObject.assign(BBL,'+json.dumps({'p22':{'power':10,'parts':parts}})+');\n'
c=re.sub(r'\n// ===== p22 layout \(generated\) =====\nObject\.assign\(BBL,.*?\);\n','\n',c,flags=re.S)
c=c.replace('// wire up final + live canvases',js+'// wire up final + live canvases',1)
open('circuits.js','w').write(c)
# ---- demo ----
D=r'''
// ---------- p22: IR beam alarm ----------
const IR22={blk:false,X:0.8,hist:[],ph:0};
function drawIR(dt){const ctx=cv('m22'),f=+$('irF').value,sens=Math.exp(-Math.pow((f-38)/2.6,2)),seen=!IR22.blk&&sens>0.45;$('irFv').textContent=f.toFixed(1)+' kHz';
  IR22.ph+=dt*0.6;const tgt=seen?0.8:3.6;IR22.X+=(tgt-IR22.X)*(1-Math.exp(-dt/(seen?0.04:0.35)));IR22.hist.push(IR22.X);if(IR22.hist.length>240)IR22.hist.shift();const alarm=IR22.X>1.3;
  const box=(x,y,w,h,t1,t2,col)=>{ctx.fillStyle='#111c2e';ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,h,8);ctx.fill();ctx.stroke();txt(ctx,t1,x+w/2,y+20,'#cbd5e1',12);if(t2)txt(ctx,t2,x+w/2,y+40,'#94a3b8',11);};
  const ar=(x1,y1,x2,y2,col)=>{W(ctx,[[x1,y1],[x2,y2]],col||'#64748b',2);const a=Math.atan2(y2-y1,x2-x1);ctx.fillStyle=col||'#64748b';ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-9*Math.cos(a-0.4),y2-9*Math.sin(a-0.4));ctx.lineTo(x2-9*Math.cos(a+0.4),y2-9*Math.sin(a+0.4));ctx.fill();};
  box(15,20,120,52,'555 #1','bursts 690 /s','#60a5fa');ar(135,46,165,46);box(165,20,120,52,'555 #2',f.toFixed(1)+' kHz','#60a5fa');ar(285,46,315,46);
  // IR LED
  const on=Math.sin(IR22.ph*40)>0;glowAt(ctx,335,46,on?0.8:0.2,'139,92,246',34);ctx.fillStyle='#8b5cf6';ctx.beginPath();ctx.arc(335,46,12,0,7);ctx.fill();txt(ctx,'IR LED',335,86,'#c4b5fd',11);
  // beam
  for(let i=0;i<14;i++){const x=355+i*15+((IR22.ph*120)%15);if(IR22.blk&&x>445)break;const burst=Math.floor((x-IR22.ph*120)/30)%2===0;ctx.fillStyle=burst?'rgba(167,139,250,.9)':'rgba(167,139,250,.15)';ctx.fillRect(x,43,8,6);}
  txt(ctx,'invisible 940 nm light',455,28,'#64748b',11);if(IR22.blk){txt(ctx,'✋',462,60,'#fff',34);}
  // TSOP
  box(580,20,110,52,'TSOP38238',sens>0.45?'hears '+f.toFixed(0)+' kHz':'deaf at '+f.toFixed(0)+' kHz',seen?'#22c55e':'#f59e0b');
  // row 2: bucket, transistor, LED
  ar(635,72,635,130);box(560,130,150,60,'bucket (10 µF)','X = '+IR22.X.toFixed(2)+' V','#fbbf24');
  const lvl=Math.min(1,(IR22.X-0.5)/3.1);ctx.fillStyle='rgba(56,189,248,.35)';ctx.fillRect(715,190-60*lvl,22,60*lvl);ctx.strokeStyle='#475569';ctx.strokeRect(715,130,22,60);
  ar(560,160,450,160,alarm?'#ef4444':'#64748b');box(330,130,120,60,'BC547',alarm?'ON':'off',alarm?'#ef4444':'#475569');ar(330,160,250,160,alarm?'#ef4444':'#64748b');
  glowAt(ctx,215,160,alarm?0.95:0,'239,68,68',60);ctx.fillStyle=alarm?'#ef4444':'rgba(239,68,68,.2)';ctx.beginPath();ctx.arc(215,160,18,0,7);ctx.fill();
  txt(ctx,alarm?'🚨 ALARM: beam cut':'beam OK',100,165,alarm?'#ef4444':'#22c55e',14);
  // scopes
  const gy=230,gh=90,gw=245;const g1=[],g2=[];for(let i=0;i<120;i++){const t=i/120*4+IR22.ph*2,bu=(t%1)<0.5;g1.push(bu?(Math.sin(i*2.6)>0?1:0):0);g2.push(seen&&bu?0:1);}
  mGraph(ctx,15,gy,gw,gh,[[g1,'#a78bfa']],-0.2,1.3,'IR light (38 kHz bursts)');
  mGraph(ctx,277,gy,gw,gh,[[g2,'#22c55e']],-0.2,1.3,'TSOP OUT (low = burst heard)');
  mGraph(ctx,539,gy,gw,gh,[[IR22.hist,'#fbbf24'],[IR22.hist.map(()=>1.3),'#ef4444',[4,4]]],0,4,'bucket X (V), red = alarm level');
  txt(ctx,'slowed down: real bursts last 0.7 ms',400,gy+gh+24,'#64748b',11);}
(()=>{const b=$('irBlock');b.style.touchAction='none';b.addEventListener('pointerdown',e=>{e.preventDefault();IR22.blk=true;});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>IR22.blk=false));})();
'''
m=open('more.js').read()
m=re.sub(r'\n// ---------- p22: IR beam alarm ----------.*?(?=\n// ---------- loop ----------)','',m,flags=re.S)
m=m.replace('\n// ---------- loop ----------',D+'// ---------- loop ----------',1)
if "vis('m22')" not in m: m=m.replace("if(vis('cp5w'))drawP5W();","if(vis('cp5w'))drawP5W();if(vis('m22'))drawIR(dt);")
open('more.js','w').write(m)
print('ok')
