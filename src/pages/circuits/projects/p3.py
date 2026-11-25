# Project 3 · 💡 LEDs & basics   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p3'
NUM = '3'
TITLE = 'Polarity tester (which way is +?)'
MENU = 'Polarity tester'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Diode</span> Two LEDs back to back show which way the current flows. <a class="navlink" href="#diode">📖 lesson</a></p>
  <canvas id="cp3" width="800" height="360"></canvas>'''
# "You need" list
NEED = [
    '9 V battery',
    '1 red + 1 green LED',
    '1 kΩ resistor',
    '2 test wires',
]
# "How it works" paragraphs
HOW = [
    '''Each LED is a <b>one-way valve</b> that lights. The two LEDs are connected side by side but pointing <b>opposite ways</b>, so whichever way the current flows, exactly one of them can conduct.''',
    '''If + is on test wire A, current flows A → resistor → red LED → B. Swap the wires and it flows B → green LED → resistor → A. The 1 kΩ protects both LEDs (≈ 7 mA).''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = None
# numbered wiring steps (ticked by the reader)
STEPS = [
    'Put the <b>1 kΩ</b> resistor from <b>a10</b> to <b>a14</b>.',
    '''<b>Red</b> LED: long leg in <b>c14</b>, short leg in <b>c18</b>.''',
    '''<b>Green</b> LED, the <b>other way</b>: long leg in <b>e18</b>, short leg in <b>e14</b>.''',
    '''Test wire <b>A</b>: a jumper in <b>d10</b>. Test wire <b>B</b>: a jumper in <b>d18</b>.''',
    '''Touch A to the battery <b>+</b> and B to <b>−</b>: red lights. Swap them: green lights.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Swap the battery wires', 'The other colour lights: each LED only conducts one way.'),
    ('Add a 1N4007 diode in series', '''Only one colour can ever light: the diode blocks the other direction.'''),
    ('Measure across a lit LED', 'About 2 V (red) or 2–3 V (green): the forward voltage.'),
]
# optional HTML at the very end (warnings)
AFTER = ''
