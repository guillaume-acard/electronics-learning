# Project 24 · ⚙️ Motors   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p24'
NUM = '24'
TITLE = 'Motor forward / reverse (H-bridge)'
MENU = 'Motor forward/reverse'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Motors</span> Two buttons: <b>FORWARD</b> spins the motor one way, <b>REVERSE</b> the other way. An <b>L293D</b> chip swaps the motor's + and − for you, with a red/green LED pair showing the current's direction.</p>
  <div class="controls"><button class="big" id="p24f">▶ Hold FORWARD</button><button class="big" id="p24r">◀ Hold REVERSE</button></div>
  <canvas id="m24" width="800" height="300"></canvas>
  <p class="hint">The H-bridge: four switches around the motor. Hold a button to see which two switches close and which way the current (dots) goes. Hold both: the two top switches close, the motor gets 0 V and stops.</p>'''
# "You need" list
NEED = [
    'L293D motor driver (Gotronic 42327)',
    'DC motor MFA RE140/1 (same as project 23)',
    '2 push buttons, 6 × 10 kΩ, 1 kΩ',
    '1 red + 1 green LED',
    '9 V battery + clip',
]
# "How it works" paragraphs
HOW = [
    '''To reverse a DC motor, you reverse the current through it: swap its two wires. The <b>L293D</b> does that electronically with an <b>H-bridge</b>: four switches arranged like the letter H, with the motor as the middle bar.''',
    '''Each output (1Y, 2Y) connects the motor end either to <b>+</b> or to <b>−</b>, copying its input (1A, 2A). FORWARD: 1Y = +, 2Y = −, the current flows left → right. REVERSE: 1Y = −, 2Y = +, right → left. Both equal (both buttons or none): no voltage across the motor, it stops (and even brakes).''',
    '''The two LEDs are wired head-to-tail, like the polarity tester (<a class="navlink" href="#p3">project 3</a>): the red one lights for one current direction, the green one for the other.''',
    '''💧 <b>Water analogy:</b> a water wheel in a pipe between two tanks. Raise the left tank and lower the right: it turns one way. Swap them: it turns the other way. The L293D is the one lifting the tanks.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = '''Follow the steps in order and tick each one. Wire with the battery <b>disconnected</b>, and connect it <b>last</b>.'''
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Battery disconnected. Link the rails: top + ↔ bottom + (column 60), top − ↔ bottom − (column 59).''',
    '''<b>L293D</b> across the gap, notch left, columns <b>20–27</b> (bottom pins 1–8, top pins 16–9). Logic supply pin 16: <b>d20</b> → top +. Motor supply pin 8: <b>j27</b> → bottom +. The 4 middle pins are ground (and heat sink): <b>j23, j24</b> → bottom −, <b>a23, a24</b> → top −.''',
    '''Enable (pin 1) at half the battery voltage: <b>10 kΩ</b> from <b>i20</b> to bottom +, <b>10 kΩ</b> from <b>j20</b> to bottom −. (The L293D's inputs must stay below 7 V, so we don't feed them 9 V directly.)''',
    '''<b>FORWARD button</b> in columns <b>4–6</b>. <b>a4</b> → top +. Its output (column 6) goes through <b>10 kΩ</b> g6–g12, then jumper <b>h12 → h21</b> to input 1A (pin 2). <b>10 kΩ</b> from <b>j21</b> to bottom − pulls the input low when released.''',
    '''<b>REVERSE button</b> in columns <b>34–36</b>. <b>a34</b> → top +. Output through <b>10 kΩ</b> g36–g30, jumper <b>h30 → h26</b> to input 2A (pin 7). <b>10 kΩ</b> from <b>j26</b> to bottom −.''',
    '''<b>Motor</b> between the two outputs: <b>j22</b> (1Y, pin 3) and <b>j25</b> (2Y, pin 6). No diode needed: the "D" in L293<b>D</b> means the protection diodes are built in.''',
    '''Direction LEDs: jumper <b>h22 → h44</b> and <b>i25 → i47</b>. <b>1 kΩ</b> g44–g46. <b>Red</b> LED long leg <b>f46</b>, short leg <b>f47</b>. <b>Green</b> LED long leg <b>h47</b>, short leg <b>h46</b> (the other way round).''',
    '''Connect the battery. Hold FORWARD: the motor spins one way, red LED on. Hold REVERSE: the other way, green LED on. Both or none: it stops.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Speed control', '''Replace the enable divider with project 23's 555 output (through 10 kΩ + 10 kΩ divider): direction from the buttons, speed from the trimmer.'''),
    ('Second motor', '''The L293D has a second H-bridge (pins 9–15). Wire it the same way with a second motor: you have the base of a small robot car.'''),
    ('Arduino control', '''Inputs 1A, 2A and EN from ONE-C pins (5 V is fine, no divider). <code>digitalWrite</code> for direction, <code>analogWrite</code> on EN for speed.'''),
    ('Feel the brake', '''Spin the shaft by hand with both buttons released, then with the battery unplugged. With the L293D connected, it's harder to turn: the shorted motor brakes itself (it's a generator!).'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
