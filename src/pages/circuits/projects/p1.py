# Project 1 · 💡 LEDs & basics   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p1'
NUM = '1'
TITLE = 'LED brightness with different resistors'
MENU = 'LED brightness'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Resistor</span> See how the resistor sets the current, and so the brightness. <a class="navlink" href="#resistor">📖 lesson</a></p>
  <canvas id="cp1" width="800" height="250"></canvas>'''
# "You need" list
NEED = [
    '9 V battery + clip',
    '1 red LED (5 mm)',
    'Resistors: 220 Ω, 470 Ω, 1 kΩ, 10 kΩ',
    'Breadboard + jumper wires',
]
# "How it works" paragraphs
HOW = [
    '''The battery pushes current around one single loop: <b>+ → resistor → LED → −</b>. The resistor is the narrow pipe that sets how much current can flow, and the LED glows brighter with more current.''',
    '''The red LED always "uses" about 2 V of the 9 V. The other 7 V is dropped across the resistor, so the current is <b>I = 7 V ÷ R</b>: 220 Ω gives 32 mA (too much!), 470 Ω gives 15 mA, 1 kΩ gives 7 mA, and 10 kΩ gives 0.7 mA (a faint glow).''',
    '''Series resistors add up (harder to flow, dimmer). Parallel resistors give the current two paths (easier, brighter).''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = None
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Keep the battery <b>disconnected</b> while wiring. Put the breadboard with the red <b>+</b> rail at the top.''',
    '''Put one leg of the <b>470 Ω</b> resistor into the top <b>+</b> rail and the other leg into hole <b>a10</b> (column 10).''',
    '''Put the LED's <b>long leg</b> (+) into <b>c10</b>, the same column as the resistor, and its <b>short leg</b> into <b>c13</b>.''',
    '''Plug a jumper wire from <b>a13</b> to the top <b>−</b> rail (blue).''',
    '''Clip the 9 V snap: <b>red</b> wire into the <b>+</b> rail, <b>black</b> wire into the <b>−</b> rail.''',
    '''Snap on the battery: the LED lights. If it doesn't, turn the LED round.''',
    '''To try another resistor: <b>unclip the battery first</b>, swap the resistor, then reconnect.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Swap 220 Ω → 470 Ω → 1 kΩ → 10 kΩ', 'The LED gets dimmer as R grows (I = 7 V ÷ R).'),
    ('Put two 1 kΩ in series', 'Same as 2 kΩ: dimmer.'),
    ('Put two 1 kΩ side by side (parallel)', 'Same as 500 Ω: brighter.'),
    ('Turn the LED round', "Nothing: it's a one-way valve."),
]
# optional HTML at the very end (warnings)
AFTER = ''
