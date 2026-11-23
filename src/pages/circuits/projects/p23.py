# Project 23 · ⚙️ Motors   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p23'
NUM = '23'
TITLE = 'Motor speed control (PWM)'
MENU = 'Motor speed (PWM)'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Motors</span> Turn a knob, the motor goes from crawling to full speed. A <b>555</b> switches the motor on and off 13,000 times per second, and the knob sets how long each "on" lasts. That trick (<b>PWM</b>) is how almost every modern device controls motors, fans and LED brightness.</p>
  <div class="controls"><x-slider id="p23d" min="0.09" max="0.98" step="0.01" value="0.5" grow="1">Trimmer: on-time</x-slider><span class="hint" id="p23v"></span></div>
  <canvas id="m23" width="800" height="300"></canvas>
  <p class="hint">Left: the 555 output, zoomed in (one period = 76 µs). The motor only feels the average (dashed line). Right: the motor speed follows that average. Below ~15 %, the motor is too weak to start.</p>'''
# "You need" list
NEED = [
    'DC motor MFA RE140/1, 3–9 V (Gotronic 24851)',
    'SS8050 NPN transistor, 1.5 A (Gotronic 43143)',
    'NE555, 10 kΩ trimmer, 2 × 1N4148, 1N4007',
    '2 × 1 kΩ, 470 Ω, red LED, 10 nF, 100 µF',
    '''9 V battery + clip (a 6 V pack of 4 AA batteries lasts longer with motors)''',
]
# "How it works" paragraphs
HOW = [
    '''A motor's speed depends on the <b>average voltage</b> it gets. We could waste the extra voltage in a big resistor (it would get hot), but there's a smarter trick: switch the full 9 V <b>on and off very fast</b>, about 13,000 times per second. That's <b>PWM</b> (pulse-width modulation). On 30 % of the time = like 30 % of 9 V ≈ 2.7 V on average. The motor is far too heavy to follow each pulse: it just feels the average.''',
    '''The <b>555</b> makes the pulses. The trimmer splits its 10 kΩ in two: the capacitor <b>charges</b> through one side and <b>discharges</b> through the other (each diode lets only one direction through). Turn the knob: one side grows as the other shrinks, so the on-time changes but the total period stays the same.''',
    '''The 555 can't feed a motor (it would need ~200 mA, more when starting). So it drives a transistor, like in the <a class="navlink" href="#p7">relay clicker</a>. But the BC547 only takes 100 mA, so we use an <b>SS8050</b>: same job, up to 1.5 A. The 1N4007 handles the coil kick, exactly like for a relay.''',
    '''💧 <b>Water analogy:</b> instead of half-closing a tap (which wastes pressure), you open it fully and close it fully, very fast. A heavy water wheel can't follow the flicker: it turns at the average flow.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = '''Follow the steps in order and tick each one. Wire with the battery <b>disconnected</b>, and connect it <b>last</b>.'''
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Battery disconnected. Link the rails at the right end: top + ↔ bottom + (column 60), top − ↔ bottom − (column 59). <b>100 µF</b> across the top rails (+ leg on top +, − leg on top −): it feeds the motor's current bursts so the 555 doesn't reset.''',
    '''<b>NE555</b> across the gap, notch left, columns <b>10–13</b>. <b>d10</b> (pin 8) → top +, <b>j10</b> (pin 1) → bottom −, <b>j13</b> (pin 4, reset) → bottom +.''',
    '''<b>1 kΩ</b> c10–c11 (pin 8 → pin 7). <b>10 kΩ trimmer</b> in <b>a20–a22</b> (middle leg = wiper in a21). Jumper <b>d11 → c21</b>: pin 7 to the wiper.''',
    '''Two <b>1N4148</b>: plain end <b>b20</b>, ring end <b>b12</b> (left end of the trimmer → pin 6); plain end <b>c12</b>, ring end <b>c22</b> (pin 6 → right end). Jumper <b>a12 → i11</b> (pin 6 → pin 2). <b>10 nF</b> from <b>h11</b> (pin 2) to bottom −.''',
    '''Speed indicator: <b>470 Ω</b> i12–i16 (from pin 3, the output), red LED long leg <b>h16</b>, short leg <b>h18</b>, <b>j18</b> → bottom −. Its brightness follows the motor speed.''',
    '''<b>SS8050</b> transistor in the bottom half, flat side facing you: <b>g30</b> (E), <b>g31</b> (B), <b>g32</b> (C). ⚠️ Its legs are in the <b>opposite order</b> to the BC547 (E-B-C instead of C-B-E). <b>1 kΩ</b> from <b>h12</b> (pin 3) to <b>h31</b> (base). <b>j30</b> (emitter) → bottom −.''',
    '''<b>Motor</b>: one wire to <b>j32</b> (collector), the other to the bottom + rail. Solder or twist short jumper wires to its two tabs first. Stick a small piece of tape on the shaft as a flag, so you can see it spin.''',
    '''<b>1N4007</b> across the motor: plain end <b>i32</b> (collector), ring end on the bottom <b>+</b> rail. It catches the coil's voltage kick every time the transistor switches off (see <a class="navlink" href="#p6">6 Coil kick</a>).''',
    '''Connect the battery. Turn the trimmer: the motor goes from crawling to full speed, and the LED dims and brightens with it. A faint high whistle is normal: that's the 13 kHz switching.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Remove the 1N4007', '''Don't run it long like this! With a multimeter on the collector you'd see spikes; the transistor may survive a while, but it's being hammered by each coil kick. Put the diode back.'''),
    ('Change the 10 nF to 100 nF', '''Frequency drops to ~1.3 kHz: the motor whines loudly (you hear the PWM). Back to 10 nF for a quieter motor.'''),
    ('Replace the motor with the 12 V bulb', '''Same circuit = a lamp dimmer (with the 12 V adapter on the rails instead of the battery). The bulb filament also averages the pulses.'''),
    ('Arduino PWM', '''Unplug the 555 and drive the 1 kΩ base resistor from ONE-C pin 9 with <code>analogWrite(9, 0…255)</code>: the same thing in one line of code.'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
