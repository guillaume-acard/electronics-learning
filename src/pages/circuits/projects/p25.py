# Project 25 · ⚙️ Motors   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p25'
NUM = '25'
TITLE = 'Lower the voltage for a small motor'
MENU = 'Lower the voltage'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Motors</span> Small toy motors are often made for 3–6 V. How do you run one from a 9 V battery? With a resistor (bad idea, see why), with <b>diodes</b> (cheap and good), with a capacitor (doesn't work, see why), or with PWM. Build the diode version with your RE140/1 and compare.</p>
  <div class="controls"><span class="hint">Method:</span><button class="p25m" data-m="direct">Direct 9 V</button><button class="p25m" data-m="res">Resistor 12 Ω</button><button class="p25m active" data-m="dio">4 diodes</button><button class="p25m" data-m="cap">Capacitor only</button><button class="p25m" data-m="pwm">PWM 67 %</button><label class="slider" style="flex:1;min-width:220px">Load on the shaft<input id="p25l" type="range" min="0" max="1" step="0.01" value="0.2" style="flex:1;width:auto"></label></div>
  <canvas id="m25" width="800" height="300"></canvas>
  <p class="hint">Left: the voltage the motor actually gets, depending on the current it draws (graph), for each method. The dot is where the motor runs now: drag the load slider (0 = spinning free, 1 = almost blocked). Green band = the 3–6 V a small motor wants. Right: the result on the motor and the heat wasted in the "reducer".</p>'''
# "You need" list
NEED = [
    '4 × 1N4007 diodes (you have 10)',
    'DC motor RE140/1 (or any small 3–6 V motor from an old toy)',
    '1000 µF capacitor',
    '9 V battery + clip',
    'For the variants: 2 × 10 Ω, a multimeter if you have one',
]
# "How it works" paragraphs
HOW = [
    '''<b>Why not 9 V on a small 3–6 V motor?</b> Too much voltage = too much speed and current: the coil heats up, the brushes spark and wear out, and its life drops from hundreds of hours to a few. It won't explode, but it dies early. (The RE140/1 you're buying is rated 3–9 V, so 9 V is fine for <i>it</i>. This page is for smaller motors, like one from an old toy.)''',
    '''<b>A resistor?</b> A resistor drops U = R × I, so the drop <b>depends on the current</b>. A motor's current changes all the time: ~1 A when starting, 0.1 A spinning freely, more when you brake it. So the voltage it gets changes too: too little exactly when it needs it most (starting, or under load), and too much when spinning freely. And it heats up: 3 V × 0.25 A = 0.75 W burns a 1/4 W resistor.''',
    '''<b>Diodes!</b> A silicon diode drops about <b>0.7 V almost whatever the current</b> (0.65 V at 10 mA, 0.85 V at 1 A). Four in series take about 3 V off: 9 V → ~6 V, steady from start-up to full load. Each 1N4007 handles 1 A. It's the cheapest "voltage reducer" for motors. (They still turn the 3 V into heat, but spread over 4 diodes it's fine.)''',
    '''<b>And the capacitor?</b> A capacitor does <b>not</b> lower a voltage. It's a bucket that fills up to <b>the same level</b> as what feeds it: on 9 V it charges to 9 V. What it does: it <b>smooths</b> (fills the dips), and gives a short <b>boost</b> of current at start-up. With a diode in front, a diode + capacitor make a <b>rectifier</b> (turn AC into DC, as in a phone charger): that's probably the combination you heard about. To really <i>control</i> a voltage, you need either diodes (fixed drops), a zener diode + transistor, or a regulator like the 7805, which is exactly that inside a chip.''',
    '''💧 <b>Water analogy:</b> the resistor is a narrow pipe: the more water flows, the more pressure it loses. Each diode is a <b>small step</b> of fixed height (0.7 V): the water always loses the same height, whatever the flow. The capacitor is a tank on the side: it can't lower the water level, it can only keep it steady.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = '''Follow the steps in order and tick each one. Wire with the battery <b>disconnected</b>, and connect it <b>last</b>.'''
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Battery disconnected. Link the two − rails: top − ↔ bottom − (column 59).''',
    '''Four <b>1N4007</b> diodes in a chain, all with the <b>ring towards the right</b>: c10–c14, d14–d18, c18–c22, d22–d26. Jumper top <b>+</b> → <b>a10</b>, the start of the chain.''',
    '''Jumper <b>b26 → h26</b>: brings the end of the chain (≈ 9 − 4 × 0.7 = 6.2 V) to the bottom half.''',
    '''<b>Motor</b>: one wire in <b>j26</b>, the other on the bottom <b>−</b> rail.''',
    '''<b>1000 µF</b> "start-up bucket": + leg <b>i27</b>, − leg bottom −, and jumper <b>g26 → g27</b>. It doesn't lower the voltage (see below) but gives the motor a kick at start-up and hides short dips.''',
    '''Connect the battery: the motor runs as on ~6 V. Now try the experiments in the table below: bypass diodes one by one with a jumper, and compare with a resistor.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Bypass 1, 2, 3 diodes', '''Add a jumper over a diode (e.g. a10 → a14 for the first): the motor speeds up a little each time (+0.7 V per diode). With a multimeter on the motor: 9 → 8.3 → 7.6 → 6.9 → 6.2 V.'''),
    ('Replace the chain by a resistor', '''Use 2 × 10 Ω in parallel (5 Ω) instead of the diodes. Spinning free it's fast; pinch the shaft and it slows down much more than with diodes. Don't leave it running: the 1/4 W resistors get hot.'''),
    ('Unplug the battery', '''With the 1000 µF in place, the motor keeps turning a little after you disconnect: the bucket empties into it. Without it, it stops at once. But the 1000 µF never lowered the voltage.'''),
    ('Change direction?', '''Turn the motor's wires around: it spins the other way. Turn one diode around: everything stops (a diode is a one-way valve).'''),
    ('Use the PWM circuit instead', '''Project 23 lowers the <i>average</i> voltage with almost no heat. Just don't turn the trimmer past ~65 % for a 6 V motor.'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
