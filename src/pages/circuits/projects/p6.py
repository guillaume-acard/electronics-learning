# Project 6 · 🔀 Transistors & relays   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p6'
NUM = '6'
TITLE = 'The coil kick-back (inductive spike)'
MENU = 'Coil kick'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Inductor</span> Make a coil's "water hammer" visible with an LED. <a class="navlink" href="#inductor">📖 lesson</a></p>
  <canvas id="cp6" width="800" height="375"></canvas>'''
# "You need" list
NEED = [
    '9 V battery',
    'A relay (use its coil) or a small 10–100 mH inductor',
    'Push button',
    '1 LED (no resistor needed here)',
    '1N4007 diode (for the variant)',
]
# "How it works" paragraphs
HOW = [
    '''While the button is pressed, current flows through the coil and builds a magnetic field (the heavy water wheel spinning up). The LED is connected <b>backwards</b>, so it stays dark.''',
    '''When you release the button, the coil's current can't stop instantly. It forces a voltage spike in the <b>opposite direction</b>, which makes the backwards LED conduct for a split second: a <b>flash</b>.''',
    '''A flyback diode in the same position absorbs that spike silently: that's exactly why relays and motors need one.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = None
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Find the <b>coil pins</b> of the relay: with a multimeter on Ω, the two pins showing ≈ 70 Ω are the coil. Solder a short wire to each.''',
    '''Button across the gap at columns <b>10–12</b>. Jumper from the top <b>+</b> rail to <b>a10</b>.''',
    '''Coil wire 1 into <b>j12</b> (the button's other side). Coil wire 2 into the bottom <b>−</b> rail.''',
    '''LED <b>backwards</b> across the coil: <b>short leg</b> in <b>h12</b>, <b>long leg</b> in the bottom <b>−</b> rail.''',
    '''Link the top and bottom <b>−</b> rails, then connect the 9 V battery (red → top +, black → top −).''',
    '''Press for a second, then release: watch the LED flash at the moment you let go.''',
    '''Variant: replace the LED with a <b>1N4007</b> (stripe on the h12 side): no more flash.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Press, then release the button', '''The LED flashes on release: the spike reverses direction and lights it.'''),
    ('Replace the LED with a 1N4007 diode (same orientation)', '''No flash: the diode absorbs the spike safely (that's a flyback diode).'''),
    ('Use a coil with more turns', 'A bigger kick.'),
]
# optional HTML at the very end (warnings)
AFTER = ''
