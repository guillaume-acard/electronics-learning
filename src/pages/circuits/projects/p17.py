# Project 17 · 🔊 Sound & music   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p17'
NUM = '17'
TITLE = 'Police siren (two 555s)'
MENU = 'Police siren'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">555 × 2</span> The French "pin-pon": one slow 555 switches a second, fast 555 between two notes. You'll use the mysterious <b>pin 5 (CTRL)</b> of the 555, and hear the result on a small speaker.</p>
  <div class="controls"><button id="m17play">🔊 Play the siren</button><button id="m17a" class="active">Pin-pon (two-tone)</button><button id="m17b">Wail (100 µF on pin 5)</button></div>
  <canvas id="m17" width="800" height="300"></canvas>
  <p class="hint">Top: the slow 555 output (9 V or 0 V). Bottom: the pitch of the fast 555. In "wail" mode the 100 µF capacitor on pin 5 makes the pitch glide instead of jumping.</p>'''
# "You need" list
NEED = [
    '2 × NE555',
    '1 × 10 µF, 1 × 100 nF capacitors',
    '2 × 1 kΩ, 1 × 47 kΩ, 2 × 10 kΩ, 1 × 470 Ω, 1 × 220 Ω',
    '1 LED',
    '8 Ω speaker (HP508)',
    '9 V battery + clip, breadboard + jumpers',
]
# "How it works" paragraphs
HOW = [
    '''Two 555 timers, one controlling the other. <b>555 #2</b> makes the sound: ~600–900 pulses per second, which the speaker turns into a tone. <b>555 #1</b> is slow: it flips its output between 9 V and 0 V about 1.5 times per second (the LED shows it).''',
    '''The trick is <b>pin 5 (CTRL)</b> of 555 #2: it's the ⅔ point of its internal divider (see the <a class="navlink" href="#s555">555 pinout</a>). Pull it up through 10 kΩ and the capacitor must fill higher before flipping, so each cycle is longer: a <b>lower note</b>. Pull it down and the note goes <b>higher</b>. Result: two alternating notes, the French "pin-pon".''',
    '''<b>Water analogy:</b> the tone 555 is a tank that empties each time it reaches the high mark. 555 #1 keeps sliding that high mark up and down, so the tank takes longer or shorter to fill: the rhythm (the pitch) changes.''',
    '''Want the American "wail" instead? Add a <b>100 µF</b> from 555 #2 pin 5 to −. It smooths the jumps, so the pitch <b>glides</b> up and down instead of switching.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = '''Follow the steps in order and tick each one. Always wire with the power <b>disconnected</b>, and connect the battery <b>last</b>.'''
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Battery disconnected. Link the rails at the right end: top <b>+</b> ↔ bottom <b>+</b> (column 60), top <b>−</b> ↔ bottom <b>−</b> (column 59).''',
    '''<b>555 #1</b> (the slow one) across the gap, notch left, columns <b>4–7</b>. <b>d4</b> (pin 8) → top +, <b>j4</b> (pin 1) → bottom −, <b>j7</b> (pin 4, reset) → bottom + so it always runs.''',
    '''Slow timing: <b>1 kΩ</b> c4→c5, <b>47 kΩ</b> b5→b6, jumper <b>a6 → i5</b> (pin 6 → pin 2), <b>10 µF</b> + leg in <b>h5</b>, − leg in the bottom − rail. About 1.5 switches per second.''',
    '''A "see the slow clock" LED: <b>470 Ω</b> from <b>i6</b> (pin 3) to <b>i10</b>, LED long leg <b>h10</b>, short leg <b>h13</b>, jumper <b>j13</b> → bottom −.''',
    '''<b>555 #2</b> (the tone) across the gap, columns <b>20–23</b>. <b>d20</b> → top +, <b>j20</b> → bottom −, <b>j23</b> (reset) → bottom +.''',
    '''Tone timing: <b>1 kΩ</b> c20→c21, <b>10 kΩ</b> b21→b22, jumper <b>a22 → i21</b>, <b>100 nF</b> from <b>h21</b> to the bottom − rail. Alone, this would beep at ~690 Hz.''',
    '''The link that makes it a siren: jumper <b>h6 → a14</b> (555 #1 output), then <b>10 kΩ</b> from <b>b14</b> to <b>b23</b> (555 #2 pin 5, CTRL).''',
    '''Speaker: <b>220 Ω</b> from <b>h22</b> (555 #2 output) to <b>h30</b>. Speaker wires: one to <b>j30</b>, the other to the bottom − rail.''',
    'Connect the battery: pin-pon, pin-pon! 🚓',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Add 100 µF from b23 (pin 5 of 555 #2) to −', 'American "wail": the pitch glides up and down.'),
    ('Replace the 47 kΩ (b5→b6) with 4.7 kΩ', '''The siren switches ~10 times per second: a "space laser" warble.'''),
    ('Replace the 100 nF (h21) with 47 nF', 'Both notes go up about an octave.'),
    ('Remove the jumper h6 → a14', 'Just one steady beep: 555 #1 no longer moves pin 5.'),
]
# optional HTML at the very end (warnings)
AFTER = ''
