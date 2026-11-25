# Project 4 · 💡 LEDs & basics   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p4'
NUM = '4'
TITLE = 'Mini traffic light'
MENU = 'Traffic light'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">LED</span> Three colours, each with its own resistor (and why). <a class="navlink" href="#led">📖 lesson</a></p>
  <canvas id="cp4" width="800" height="375"></canvas>'''
# "You need" list
NEED = [
    '9 V battery (or 5 V USB)',
    'Red, yellow, green LEDs',
    '3 × 470 Ω resistors',
    '3 push buttons',
]
# "How it works" paragraphs
HOW = [
    '''Three identical, independent loops share the same battery: <b>+ → button → 470 Ω → LED → −</b>. Each button closes its own loop.''',
    '''Because each LED has its <b>own</b> resistor, each gets its own ≈ 15 mA no matter how many are on. With one shared resistor, the LED with the lowest forward voltage would hog the current.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = None
# numbered wiring steps (ticked by the reader)
STEPS = [
    'Battery disconnected, red <b>+</b> rail at the top.',
    '''Place 3 buttons across the gap at columns <b>10–12</b>, <b>25–27</b> and <b>40–42</b>.''',
    '''For each button: jumper from the top <b>+</b> rail to the button's top-left leg (<b>a10</b>, <b>a25</b>, <b>a40</b>).''',
    '''For each button: a <b>470 Ω</b> resistor from its bottom-right leg (<b>j12</b>, <b>j27</b>, <b>j42</b>) to a free column (<b>j16</b>, <b>j31</b>, <b>j46</b>).''',
    '''LEDs: <b>long leg</b> in that column (<b>h16</b>, <b>h31</b>, <b>h46</b>), <b>short leg</b> 2 columns further (<b>h18</b>, <b>h33</b>, <b>h48</b>). Red, yellow, green.''',
    '''Jumpers from <b>j18</b>, <b>j33</b> and <b>j48</b> to the bottom <b>−</b> rail. Link the top and bottom <b>−</b> rails.''',
    '''Connect the battery and press the buttons in traffic-light order.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Press all 3 at once', 'All three light equally.'),
    ('Try ONE shared resistor for all 3', 'Uneven brightness: one LED hogs the current.'),
    ('Swap red for blue', '''A blue LED needs ~3 V, so it's a bit dimmer with the same resistor.'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
