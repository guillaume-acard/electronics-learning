# Project 22 · 🌡️ Sensors & detectors   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p22'
NUM = '22'
TITLE = 'Infrared beam alarm'
MENU = 'IR beam alarm'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Sensors</span> An invisible infrared beam between an <b>IR LED</b> and a <b>TSOP38238</b> receiver. Cut the beam with your hand (or a cat 🐈) and the red LED turns on. Two NE555 timers make the IR LED blink at 38 kHz in bursts, so that sunlight and lamps can't fool the receiver.</p>
  <div class="controls"><button class="big" id="irBlock">✋ Hold to block the beam</button><x-slider id="irF" min="26" max="50" step="0.5" value="38" grow="1">555 #2 frequency</x-slider><span class="hint" id="irFv">38 kHz</span></div>
  <canvas id="m22" width="800" height="360"></canvas>
  <p class="hint">Top: the signal path, from the two 555s to the IR LED, across the air to the TSOP, into the "bucket" and the alarm. Bottom: the signals, slowed down a lot. Move the frequency away from 38 kHz: the TSOP stops hearing it and the alarm goes off even with the beam.</p>'''
# "You need" list
NEED = [
    'TSOP38238 IR receiver, 38 kHz (Gotronic 03417)',
    'TSAL6200 IR LED (Gotronic 03458), or any 940 nm IR LED',
    '2 × NE555, 1 × BC547, 1 × 1N4148, 1 red LED',
    'Resistors: 4 × 1 kΩ, 2.2 kΩ, 2 × 330 Ω, 4.7 kΩ, 3 × 10 kΩ',
    'Capacitors: 4.7 nF, 100 nF, 2 × 10 µF',
    '''Breadboard with its <b>5 V</b> power module (USB). Not the 9 V battery!''',
]
# "How it works" paragraphs
HOW = [
    '''<b>The problem:</b> everything glows in infrared: the sun, lamps, radiators, your body. A plain IR sensor would be fooled all the time. <b>The trick:</b> the IR LED blinks <b>38,000 times per second</b>, and the <b>TSOP</b> contains a filter that only reacts to light blinking at exactly that speed. Like hearing your own name in a noisy room: everything else is ignored. TV remotes use the same trick.''',
    '''<b>555 #2</b> makes the 38 kHz (1 kΩ, 3.53 kΩ and 4.7 nF). <b>555 #1</b> switches it on and off about 690 times per second, in <b>bursts</b>, through 555 #2's reset pin. Why? The TSOP slowly gets used to a signal that never stops (it treats it as noise) and goes deaf. Bursts keep it listening.''',
    '''The TSOP's <b>OUT</b> goes <b>low</b> during each burst it receives. The diode lets it empty the 10 µF "bucket" at every burst, while the 4.7 kΩ slowly refills it. Beam present: the bucket is emptied 690 times a second and stays near 0.8 V. <b>Beam blocked:</b> nothing empties it, it fills to ~3.6 V in a few hundredths of a second, the BC547 turns on and the red LED lights.''',
    '''💧 <b>Water analogy:</b> a bucket under a small tap (4.7 kΩ), with a drain that opens at every burst (the TSOP). As long as the bursts arrive, the bucket stays empty. Block the beam: the drain stays shut, the bucket fills up and overflows into the alarm.''',
    '''The two 10 kΩ resistors form a <b>divider</b>: the base only gets enough voltage when the bucket is above ~1.3 V. That stops the 0.8 V "empty" level from half-lighting the LED. See the <a class="navlink" href="#seir">infrared sensors</a> page for more on the TSOP.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = '''Follow the steps in order and tick each one. Wire with the USB <b>unplugged</b>, and plug it <b>last</b>.'''
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''USB <b>unplugged</b>. Plug the <b>power module</b> on the left end of the board and set <b>both</b> its jumpers to <b>5 V</b>. ⚠️ Not 9 V: the TSOP receiver dies above 5.5 V.''',
    '''<b>555 #1</b> (the "burst" maker) across the gap, notch left, columns <b>4–7</b>. Power: <b>d4</b> (pin 8) → top +, <b>j4</b> (pin 1) → bottom −. Reset (pin 4): <b>j7</b> → bottom +.''',
    '''555 #1 timing: <b>1 kΩ</b> c4–c5, <b>10 kΩ</b> b5–b6, jumper <b>a6 → i5</b> (pin 6 → pin 2), <b>100 nF</b> from <b>h5</b> to bottom −. It switches about 690 times per second.''',
    '''<b>555 #2</b> (the 38 kHz maker), notch left, columns <b>20–23</b>. Power: <b>d20</b> → top +, <b>j20</b> → bottom −. Its reset (pin 4, column 23) is driven by 555 #1's output: jumper <b>g6 → g23</b>. So 555 #2 only runs while 555 #1's output is high: bursts.''',
    '''555 #2 timing: <b>1 kΩ</b> c20–c21. Then three resistors in series from pin 7 to pin 6 (= 3.53 kΩ): <b>2.2 kΩ</b> b21–b26, <b>1 kΩ</b> c26–c29, <b>330 Ω</b> d29–d22. Jumper <b>a22 → i21</b>, <b>4.7 nF</b> from <b>h21</b> to bottom −. That's ≈ 38,000 Hz.''',
    '''<b>IR LED</b> (TSAL6200, looks like a clear or blue-ish LED): <b>1 kΩ</b> from <b>i22</b> (555 #2 output) to <b>i28</b>, jumper <b>h28 → h55</b>, LED long leg in <b>g55</b>, short leg in <b>g57</b>, <b>j57</b> → bottom −. Bend it so it points <b>left, along the board</b>.''',
    '''<b>TSOP38238</b> receiver in the top half: <b>c40</b> (OUT), <b>c41</b> (GND), <b>c42</b> (Vs), with the dome <b>facing you</b>. <b>a41</b> → top −, <b>a42</b> → top +. <b>10 µF</b>: + leg <b>b42</b>, − leg top −. Then gently bend it so the dome looks <b>right, at the IR LED</b>.''',
    '''Detector (the "bucket"): <b>4.7 kΩ</b> from top + to <b>a36</b>. <b>10 µF</b>: + leg <b>b36</b>, − leg top −. <b>1N4148</b>: plain end in <b>d36</b>, black-ring end in <b>d40</b> (TSOP OUT).''',
    '''Alarm: <b>BC547</b> flat side facing you in <b>c46</b> (C), <b>c47</b> (B), <b>c48</b> (E); <b>a48</b> → top −. <b>10 kΩ</b> e36–e47 (bucket → base) and <b>10 kΩ</b> a47 → top − (keeps it off when the bucket is low). <b>Red LED</b>: <b>330 Ω</b> from top + to <b>a44</b>, long leg <b>b44</b>, short leg <b>b46</b> (collector).''',
    '''Plug the USB. Aim the IR LED at the TSOP, 5–20 cm apart: the red LED stays <b>off</b> (beam seen). Put your hand or a book between them: the red LED <b>lights</b>. Tip: your phone's front camera sees IR, so you can check the IR LED is on (faint purple glow).''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Wrong frequency', '''Swap the 330 Ω (d29–d22) for a 2.2 kΩ: 555 #2 now blinks at ~26 kHz. The TSOP ignores it, so the alarm stays on even with the beam. That's the filter at work.'''),
    ('TV remote tester', '''Unplug the IR LED (g55). Point any TV remote at the TSOP and press a button: the red LED blinks off while it receives (remotes send 36–40 kHz bursts).'''),
    ('Obstacle detector', '''Point the IR LED and the TSOP both upwards, side by side, with a piece of cardboard between them. A hand above reflects the IR back: the red LED goes <b>off</b> when something is there.'''),
    ('Stronger beam', '''Replace the 1 kΩ (i22–i28) with 220 Ω: the beam reaches several metres across a room. But reflections off walls can then "go around" your hand, so keep the 1 kΩ for a short barrier.'''),
    ('Read remote codes with the Arduino', '''TSOP OUT → ONE-C pin 2 (TSOP Vs on the board's 5 V). With the IRremote library, the serial monitor shows a different code for each button of your remote.'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
