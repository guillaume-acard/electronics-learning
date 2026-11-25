# Project B · 🏠 Real-life builds   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'rl2'
NUM = 'B'
TITLE = 'Real life: a light detector that turns on a lamp'
MENU = 'Night light'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Real life</span> A garden or hallway light that switches on by itself at dusk. It combines almost everything: a <a data-page="resistor" class="navlink">divider</a>, an <a data-page="chips" class="navlink">op-amp comparator</a>, a <a data-page="transistor" class="navlink">transistor</a>, a <a data-page="relay" class="navlink">relay</a> and a <a data-page="diode" class="navlink">flyback diode</a>.</p>
  <ol>
    <li><b>Sensor:</b> an LDR + 10 kΩ divider. In the dark the LDR's resistance rises, so the divider voltage rises.</li>
    <li><b>Threshold knob:</b> a 10 kΩ pot sets the "how dark" voltage.</li>
    <li><b>Decision:</b> the LM358 compares the two. Sensor above threshold means dark, so the output goes HIGH. A 1 MΩ resistor adds <b>hysteresis</b> (a small dead band) so the lamp doesn't flicker at dusk.</li>
    <li><b>Muscle:</b> the output → 1 kΩ → BC547 → relay coil (+ flyback diode) → its contact switches the <b>12 V lamp</b>.</li>
  </ol>
  <div class="controls"><x-slider id="ldL" min="0" max="1" step="0.005" value="0.8" grow="1">☀️ Daylight</x-slider><x-slider id="ldT" min="1" max="8" step="0.05" value="4.5" grow="1">Threshold knob</x-slider><button id="ldAuto">🌅 Run a day</button></div>
  <canvas id="cLight" width="800" height="470"></canvas>'''
# "You need" list
NEED = [
    'LDR (photoresistor) + 10 kΩ resistor',
    '10 kΩ potentiometer (threshold)',
    'LM358 + 1 MΩ (hysteresis) + 100 nF decoupling',
    'BC547 + 1 kΩ + 1N4007',
    '12 V relay (or 5 V relay + 5 V supply)',
    '12 V lamp/LED strip + 12 V supply',
]
# "How it works" paragraphs
HOW = [
    '''The <b>10 kΩ + LDR</b> divider gives a voltage that rises as it gets darker (the LDR's resistance shoots up). The trimmer gives an adjustable <b>threshold</b> voltage.''',
    '''The <b>LM358</b> compares them. Sensor above threshold means dark, so its output jumps HIGH. The <b>1 MΩ</b> feeds a little of the output back to the + input (<b>hysteresis</b>), so once it switches it stays switched, and the lamp doesn't flicker at dusk.''',
    '''The HIGH output drives the <b>BC547</b> through 1 kΩ, the transistor powers the <b>relay coil</b>, and the relay's contact closes the separate <b>12 V lamp</b> circuit. The 1N4007 protects the transistor from the coil's switch-off spike.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = None
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''12 V adapter <b>unplugged</b>. Screw two wires into the <b>PCM10F</b>: <b>+</b> → top + rail, <b>−</b> → top − rail. Link top and bottom rails (+↔+, −↔−).''',
    '''Sensor: <b>10 kΩ</b> from the top + rail to <b>a10</b>. <b>LDR</b> from <b>c10</b> to the top − rail.''',
    '''<b>LM358</b> across the gap, notch left, columns <b>20–23</b>: pin 1 (out) bottom col 20, 2 (−in) col 21, 3 (+in) col 22, 4 (GND) col 23. Pin 8 (+) top col 20.''',
    '''<b>d20</b> (pin 8) → top +. <b>j23</b> (pin 4) → bottom −. <b>100 nF</b> from <b>b20</b> to the top − rail.''',
    'Jumper from <b>e10</b> (sensor) to <b>g22</b> (pin 3).',
    '''Threshold trimmer (10 kΩ) in <b>a12 a13 a14</b>: <b>b12</b> → top +, <b>b14</b> → top −, wiper <b>c13</b> → <b>h21</b> (pin 2).''',
    '<b>1 MΩ</b> from <b>i20</b> (pin 1) to <b>i22</b> (pin 3).',
    '''BC547 in <b>g30 g31 g32</b> (C B E). <b>1 kΩ</b> from <b>h20</b> (pin 1) to <b>h31</b> (base). Jumper <b>j32</b> (E) → bottom −.''',
    '''Relay (12 V) coil: one wire to the bottom + rail, the other to <b>i30</b> (collector). <b>1N4007</b>: plain end in <b>j30</b>, <b>stripe</b> in the bottom + rail.''',
    '''Lamp circuit: relay <b>COM</b> → top + rail, <b>NO</b> → bulb socket terminal 1, socket terminal 2 → top − rail.''',
    '''Plug in the 12 V adapter. Cover the LDR with your hand and turn the trimmer until you hear the <i>click</i>. Uncover: the lamp goes off.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Cover the LDR with your hand', 'Click: the lamp turns on.'),
    ('Turn the threshold knob', 'Changes how dark it must get.'),
    ('Remove the 1 MΩ', '''At dusk the relay chatters (on/off/on): the reason for hysteresis.'''),
    ('Swap the LDR and the 10 kΩ', 'It becomes a <b>daylight</b> detector (on when bright).'),
    ('Point the lamp at the LDR', '''It turns itself off, then on, then off… (feedback!). Keep the lamp away from the sensor.'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
