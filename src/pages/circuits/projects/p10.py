# Project 10 · 🔊 Sound & music   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p10'
NUM = '10'
TITLE = 'Mini speaker amp (LM386)'
MENU = 'Mini amp'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Microchips</span> The core of your Ruby amp: plug in a phone or guitar. <a class="navlink" href="#s386">📖 lesson</a></p>
  <canvas id="cp10" width="800" height="250"></canvas>'''
# "You need" list
NEED = [
    'LM386, 9 V battery',
    '10 kΩ pot (volume)',
    '220 µF + 100 nF + 10 µF capacitors',
    '8 Ω speaker, audio jack',
]
# "How it works" paragraphs
HOW = [
    '''The volume pot is a <b>voltage divider</b>: it sends a chosen fraction of the input signal to the LM386's + input (pin 3).''',
    '''The LM386 amplifies it 20× and drives the speaker with its <b>push-pull</b> output (pin 5). That output sits at 4.5 V and swings up and down around it.''',
    '''The <b>220 µF</b> blocks that steady 4.5 V and passes only the music to the speaker (the coupling trick). The <b>10 Ω + 47 nF</b> (Zobel) stops high-frequency oscillation, and the <b>100 µF</b> is a local energy reserve for loud notes.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = None
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Battery disconnected. Link the rails (top + ↔ bottom +, top − ↔ bottom −). <b>LM386</b> across the gap, notch left, columns <b>30–33</b> (pins 1–4 bottom, 8–5 top).''',
    '''<b>j33</b> (pin 4) → bottom −. <b>j31</b> (pin 2) → bottom −. <b>a32</b> (pin 6) → top +.''',
    '''<b>100 µF</b> across the top rails, near the chip (column 27): long leg in <b>+</b>, stripe in <b>−</b>.''',
    '''Volume trimmer (10 kΩ) in <b>a20 a21 a22</b>. Jumper <b>b22</b> → top −. Jumper from <b>c21</b> (wiper) to <b>h32</b> (pin 3).''',
    '''Output: <b>220 µF</b> long leg in <b>a33</b> (pin 5), stripe leg in <b>a40</b>. Speaker red wire → <b>b40</b>, black wire → top −.''',
    '''Zobel: <b>10 Ω</b> from <b>c33</b> to <b>c45</b>, then <b>47 nF</b> from <b>b45</b> to the top −.''',
    '''Input: audio jack tip → <b>b20</b> (trimmer's left leg), sleeve → top −.''',
    '''Connect the battery with the trimmer at minimum, then turn it up slowly. Variant: <b>10 µF</b> between pins 1 (+) and 8 for ×200 gain.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Add 10 µF between pins 1 and 8', 'Gain 20 → 200: much louder, and it distorts sooner.'),
    ('Remove the 220 µF', 'The speaker gets DC: a thump, hum, wasted power.'),
    ('Turn up the volume a lot', 'Clipping = overdrive.'),
]
# optional HTML at the very end (warnings)
AFTER = ''
