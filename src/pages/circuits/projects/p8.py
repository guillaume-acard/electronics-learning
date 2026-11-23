# Project 8 · ⏱️ Timers & blinkers   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p8'
NUM = '8'
TITLE = '555 blinker (and buzzer)'
MENU = '555 blinker'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Microchips</span> The classic first chip project. <a class="navlink" href="#s555">📖 lesson</a></p>
  <canvas id="cp8" width="800" height="250"></canvas>'''
# "You need" list
NEED = [
    'NE555, 9 V battery',
    'R1 1 kΩ, R2 10–100 kΩ',
    'C 10 µF',
    'LED + 470 Ω',
    '(variant) 10 nF capacitor + small speaker or piezo',
]
# "How it works" paragraphs
HOW = [
    '''The 10 µF capacitor fills through <b>R1 + R2</b>. Inside the 555, two comparators watch its voltage.''',
    '''When it reaches <b>⅔ of 9 V</b>, the 555 turns its output (pin 3) <b>off</b> and opens the discharge pin 7, which empties the capacitor through R2. When it falls to <b>⅓</b>, the output turns back <b>on</b> and filling starts again.''',
    '''That endless fill/empty cycle makes the LED blink. Frequency ≈ 1.44 ÷ ((R1 + 2·R2) × C): with 1 kΩ, 47 kΩ and 10 µF, about <b>1.5 blinks per second</b>.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = None
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Battery disconnected. Link the rails: top <b>+</b> ↔ bottom <b>+</b>, top <b>−</b> ↔ bottom <b>−</b>. Place the <b>NE555</b> across the gap, <b>notch to the left</b>, in columns <b>20–23</b> (pins 1–4 bottom row left→right, pins 8–5 top row left→right).''',
    '''Power: <b>d20</b> (pin 8) → top <b>+</b>. <b>j23</b> (pin 4) → bottom <b>+</b>. <b>j20</b> (pin 1) → bottom <b>−</b>.''',
    '''<b>R1 (1 kΩ)</b> from <b>c20</b> (pin 8) to <b>c21</b> (pin 7).''',
    '''<b>R2 (47 kΩ)</b> from <b>b21</b> (pin 7) to <b>b22</b> (pin 6).''',
    '''Jumper from <b>a22</b> (pin 6) to <b>j21</b> (pin 2), over the chip.''',
    '''<b>10 µF</b>: long leg (+) in <b>i21</b> (pin 2), striped leg in the bottom <b>−</b> rail.''',
    '''Output: <b>470 Ω</b> from <b>h22</b> (pin 3) to <b>h28</b>. LED long leg <b>g28</b>, short leg <b>g30</b>, jumper <b>j30</b> → bottom <b>−</b>.''',
    '''Optional: <b>10 nF</b> from <b>a23</b> (pin 5) to the top <b>−</b> rail. Connect the battery (red → top +, black → top −): it blinks.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Change R2 (10 k → 100 k)', 'Slower blinking.'),
    ('C 10 µF → 100 µF', '10× slower.'),
    ('C 10 nF + speaker on pin 3', 'A tone you can hear!'),
    ('A pot as R2', 'An adjustable speed (or pitch).'),
]
# optional HTML at the very end (warnings)
AFTER = ''
