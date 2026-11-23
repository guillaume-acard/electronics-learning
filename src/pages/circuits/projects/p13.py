# Project 13 · 🎲 Dice & counters   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p13'
NUM = '13'
TITLE = 'Dice without Arduino: LED dots'
MENU = 'Dice: LED dots'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">No microcontroller</span> A real dice face with 7 LEDs, made only of standard parts: a <b>555</b> clock, a <b>CD4017</b> counter, a few <b>diodes</b> and <b>transistors</b>. Hold the button: the dots change ~1,500 times a second. Let go: it freezes on a random face.</p>
  <div class="controls"><button id="ddb_p13" class="active big">👆 Hold to roll</button><span class="hint">Hold, then release, just like the real button.</span></div>
  <canvas id="dd_p13" width="800" height="300"></canvas>
  <p class="hint">Left: the 555 pulses and the CD4017 outputs (one is on). Middle: the diode groups, where the lit diodes are the ones conducting right now. Right: the result.</p>'''
# "You need" list
NEED = [
    'NE555 + CD4017',
    '11 × 1N4148 diodes',
    '4 × BC547',
    '7 LEDs (same colour)',
    '4 × 470 Ω, 5 × 10 kΩ, 1 × 1 kΩ, 1 × 47 kΩ',
    '10 nF ceramic capacitor',
    'Push button, 9 V battery + clip, breadboard + jumpers',
]
# "How it works" paragraphs
HOW = [
    '''The <b>555</b> runs only while the button is pressed (its reset pin 4 is pulled up by the button and held down by the 10 kΩ otherwise), producing ~1,500 pulses per second. The <b>CD4017</b> moves its single "on" output one step per pulse: Q0 → Q1 → … → Q5, and when it reaches Q6 that output resets it to Q0, so it cycles through exactly <b>6 states</b>. Nobody can stop it on purpose at that speed, so when you release the button it freezes on a random state.''',
    '''A dice face only ever uses <b>4 groups</b> of dots: the centre (faces 1, 3, 5), one diagonal pair (2–6), the other diagonal pair (4, 5, 6) and the middle pair (6). Each group is an <b>OR</b>: it must light if <i>any</i> of its outputs is on.''',
    '''That's what the <b>diodes</b> do: several outputs feed one line through one-way valves, so an active output lights the group without pushing current back into the other (inactive) outputs. This is a tiny <b>diode logic</b> circuit.''',
    '''The 4017 can only supply a few mA, so each group drives a <b>BC547</b> through 10 kΩ, and the transistor switches its LEDs (pairs in series) with a 470 Ω resistor: ≈ 10–15 mA, nice and bright.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = '''Follow the steps in order and tick each one. Always wire with the power <b>disconnected</b>, and connect the battery <b>last</b>. Steps 1–5 (clock + counter) are the same for all three dice.'''
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Battery disconnected. Link the rails at the right end: top <b>+</b> ↔ bottom <b>+</b> (column 60), top <b>−</b> ↔ bottom <b>−</b> (column 59).''',
    '''<b>NE555</b> across the gap, notch left, columns <b>4–7</b> (pins 1–4 bottom row, 8–5 top row). <b>d4</b> (pin 8) → top +. <b>j4</b> (pin 1) → bottom −.''',
    '''Fast clock parts: <b>1 kΩ</b> c4→c5 (pin 8→7), <b>47 kΩ</b> b5→b6 (pin 7→6), jumper <b>a6 → i5</b> (pin 6 → pin 2), <b>10 nF</b> from <b>h5</b> (pin 2) to the bottom − rail. That's about 1,500 pulses per second.''',
    '''Roll button across the gap at columns <b>9–11</b>. Jumper top + → <b>a9</b>. Jumper <b>i11 → i7</b> (555 pin 4, reset). <b>10 kΩ</b> from <b>h7</b> to the bottom − rail, so the 555 only runs while you press.''',
    '''<b>CD4017</b> across the gap, notch left, columns <b>14–21</b> (pins 1–8 bottom, 16–9 top). <b>d14</b> (pin 16) → top +, <b>j21</b> (pin 8) → bottom −, <b>d17</b> (pin 13, enable) → top −. Count to 6: jumper <b>c15</b> (pin 15, reset) → <b>j18</b> (pin 5 = Q6). Clock: jumper <b>g6</b> (555 pin 3) → <b>c16</b> (pin 14).''',
    '''Diodes for the <b>centre dot</b> (faces 1, 3, 5). <b>1N4148</b>, stripe on the second hole: <b>g16→f24</b> (Q0), <b>g17→g24</b> (Q2), <b>a20→h24</b> (Q4). Column 24 (bottom) is now the "centre" line.''',
    '''Diodes for the <b>diagonal ↘</b> (faces 2–6): <b>g15→f28</b> (Q1), <b>h17→g28</b> (Q2), <b>g20→h28</b> (Q3), jumper <b>i28→i29</b>, <b>b20→f29</b> (Q4), <b>g14→g29</b> (Q5).''',
    '''Diodes for the <b>diagonal ↙</b> (faces 4, 5, 6): <b>h20→f33</b> (Q3), <b>c20→g33</b> (Q4), <b>h14→h33</b> (Q5). <b>Middle pair</b> (face 6 only) needs no diode: jumper <b>i14 → f37</b> (Q5).''',
    '''4 × BC547 (flat side facing you, C B E) in the top half: <b>c23–c25</b>, <b>c28–c30</b>, <b>c32–c34</b>, <b>c36–c38</b>. Emitters <b>a25, a30, a34, a38</b> → top −. Base resistors <b>10 kΩ</b>: <b>i24→d24</b>, <b>j29→d29</b>, <b>i33→d33</b>, <b>i37→d37</b> (bottom line → top base, across the gap).''',
    '''7 LEDs across the gap (long leg row e, short leg row f) in columns <b>45–51</b>: 45 centre, 46 top-left, 47 bottom-right, 48 top-right, 49 bottom-left, 50 middle-left, 51 middle-right. <b>470 Ω</b> from top + to <b>a45, a46, a48, a50</b>. Series jumpers <b>j46→a47, j48→a49, j50→a51</b>. To the collectors: <b>j45→b23, j47→b28, j49→b32, j51→b36</b>.''',
    '''Connect the battery (red → top +, black → top −). Hold the button, release: read the dice! For a real dice face, solder the 7 LEDs on a small stripboard in the 3 × 3 pattern.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Add a 100 µF capacitor from 555 pin 4 (h7 side) to −', '''The dice keeps rolling for about a second after you let go: more suspense!'''),
    ('Remove the reset jumper (c15 → j18)', '''It now counts 10 states: 4 of them show no dots at all. That's why the reset is needed.'''),
    ('Change the 470 Ω to 1 kΩ', 'Dimmer dots, and a longer battery life.'),
    ('Build it twice', '''Two dice. Use two buttons, or one button for both: they still land on different faces because the two 555s run at slightly different speeds.'''),
    ('Resistor network', '''Replace the four 470 Ω by one <b>4 × 470 Ω network with common point</b> (Gotronic 15882, €0.30): the dotted pin 1 on the + rail, the 4 others where the resistors ended (a45, a46, a48, a50). One part instead of four.'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
