# Project 7 · 🔀 Transistors & relays   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p7'
NUM = '7'
TITLE = 'Relay clicker with two lamps'
MENU = 'Relay clicker'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Relay</span> A small button controls a separate circuit through a relay. <a class="navlink" href="#relay">📖 lesson</a></p>
  <canvas id="cp7" width="800" height="375"></canvas>'''
# "You need" list
NEED = [
    '5 V relay (or a relay module)',
    'BC547 + 1 kΩ + 1N4007',
    'Push button',
    '2 LEDs + 2 × 470 Ω (as "lamps") + separate 9 V battery',
]
# "How it works" paragraphs
HOW = [
    '''The button sends a small current through the 1 kΩ into the transistor's base. The transistor switches on and lets the bigger coil current (≈ 70 mA) flow through the relay coil.''',
    '''The coil becomes an electromagnet and pulls the switch arm: <b>COM</b> leaves <b>NC</b> (red LED off) and touches <b>NO</b> (green LED on). <i>Click!</i>''',
    '''When you release, the coil's field collapses. The <b>flyback diode</b> catches the spike so the transistor isn't damaged. The 10 kΩ pull-down keeps the base firmly off when the button isn't pressed.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = None
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Plug the SD80A <b>power module</b> on the left end of the board (it feeds both rail pairs) and set both jumpers to <b>5 V</b>. Leave it switched <b>off</b>.''',
    '''BC547 in the bottom half: <b>h20 h21 h22</b> (C B E, flat side facing you). Jumper <b>j22</b> (E) → bottom <b>−</b> rail.''',
    '''Button across the gap at columns <b>10–12</b>. Jumper from the top <b>+</b> rail to <b>a10</b>.''',
    '''<b>1 kΩ</b> from <b>j12</b> to <b>j21</b> (base). <b>10 kΩ</b> from <b>i21</b> to the bottom <b>−</b> rail.''',
    '''Relay coil: one coil wire to the bottom <b>+</b> rail, the other to <b>g20</b> (collector).''',
    '''<b>1N4007</b> across the coil: plain end in <b>f20</b>, <b>striped end</b> in the bottom <b>+</b> rail.''',
    '''Contacts: <b>COM</b> wire to the top <b>+</b> rail, <b>NC</b> wire to <b>a45</b>, <b>NO</b> wire to <b>a55</b>.''',
    '''Red LED: <b>220 Ω</b> from <b>b45</b> to <b>b48</b>, LED long leg <b>c48</b>, short leg <b>c49</b>, jumper <b>d49</b> → top <b>−</b>. Green the same way: <b>b55→b58</b>, LED <b>c58/c59</b>, <b>d59</b> → top <b>−</b>.''',
    '''Switch the power module on: red is lit. Press the button: <i>click</i>, green.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Press the button', 'Click: red goes off and green goes on.'),
    ('Remove the flyback diode (briefly!)', '''It works, but the transistor gets spikes: it may die over time.'''),
    ('Use a 9 V battery for the coil too', 'A 5 V relay on 9 V gets hot: match the coil voltage.'),
]
# optional HTML at the very end (warnings)
AFTER = ''
