# Project 2 · 💡 LEDs & basics   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p2'
NUM = '2'
TITLE = 'LED that fades out slowly'
MENU = 'LED fade'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Capacitor</span> Watch a capacitor act as an energy reserve. <a class="navlink" href="#capacitor">📖 lesson</a></p>
  <canvas id="cp2" width="800" height="375"></canvas>'''
# "You need" list
NEED = [
    '9 V battery',
    'Push button',
    '''Electrolytic capacitors: 100 µF, 470 µF, 1000 µF (16 V or more)''',
    '470 Ω resistor, red LED',
]
# "How it works" paragraphs
HOW = [
    '''While you hold the button, the battery feeds two things at once: the LED (through its resistor) and the big <b>capacitor</b>, which fills up to 9 V almost instantly.''',
    '''When you let go, the battery is disconnected. The capacitor now acts like a small water tank: it empties <b>through the resistor and the LED</b>, so the LED keeps glowing.''',
    '''As the capacitor empties, its voltage drops, the current drops, and the LED fades. A bigger capacitor (more water) or a bigger resistor (narrower pipe) makes the fade last longer: roughly <b>time ≈ R × C</b>.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = None
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Battery disconnected. Link the rails: jumper from top <b>+</b> to bottom <b>+</b>, and from top <b>−</b> to bottom <b>−</b>.''',
    '''Push the <b>button</b> across the centre gap at columns <b>5–7</b>: two legs in the top half (row e), two in the bottom half (row f).''',
    '''Jumper from the top <b>+</b> rail to <b>a5</b> (the button's top-left leg).''',
    '''Plug the <b>1000 µF</b> capacitor: <b>long leg (+)</b> into <b>j7</b> (bottom half, same column as the button's bottom-right leg), <b>striped leg (−)</b> into the bottom <b>−</b> rail.''',
    'Put the <b>470 Ω</b> resistor from <b>h7</b> to <b>h15</b>.',
    '''LED: <b>long leg</b> into <b>g15</b>, <b>short leg</b> into <b>g18</b>. Jumper from <b>j18</b> to the bottom <b>−</b> rail.''',
    '''Connect the battery. Hold the button for one second, then release: the LED fades out. (If the LED is always on or never on, rotate the button 90°.)''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('100 µF vs 1000 µF', 'A bigger capacitor gives a longer fade (more stored charge).'),
    ('220 Ω instead of 470 Ω', 'Brighter, but a shorter fade (it empties faster).'),
    ('Remove the capacitor', 'The LED snaps off instantly.'),
    ('Measure the capacitor with a multimeter while fading', 'You can watch the voltage drop.'),
]
# optional HTML at the very end (warnings)
AFTER = ''
