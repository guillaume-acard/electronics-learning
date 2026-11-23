# Project 15 · 🎲 Dice & counters   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p15'
NUM = '15'
TITLE = 'Dice without Arduino: 7-segment, decoder chip'
MENU = 'Dice: 7-seg decoder'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">No microcontroller</span> The smart version: the 6 outputs of the CD4017 are turned into a 3-bit <b>binary number</b> with just <b>9 diodes</b>, and a <b>CD4511</b> decoder chip lights the right segments of your <b>SC39-11SURKWA</b>, bright and even.</p>
  <div class="controls"><button id="ddb_p15" class="active big">👆 Hold to roll</button><span class="hint">Hold, then release, just like the real button.</span></div>
  <canvas id="dd_p15" width="800" height="300"></canvas>
  <p class="hint">Left: the 555 pulses and the CD4017 outputs (one is on). Middle: the diode encoder, where the lit diodes are the ones conducting right now. Right: the result.</p>'''
# "You need" list
NEED = [
    'NE555 + CD4017 + CD4511',
    '9 × 1N4148 diodes',
    '1 × SC39-11SURKWA display',
    '8 × 1 kΩ (7 segments + 555), 4 × 10 kΩ, 1 × 47 kΩ',
    '10 nF ceramic capacitor',
    'Push button, 9 V battery + clip, breadboard + jumpers',
]
# "How it works" paragraphs
HOW = [
    '''The <b>555</b> runs only while the button is pressed (its reset pin 4 is pulled up by the button and held down by the 10 kΩ otherwise), producing ~1,500 pulses per second. The <b>CD4017</b> moves its single "on" output one step per pulse: Q0 → Q1 → … → Q5, and when it reaches Q6 that output resets it to Q0, so it cycles through exactly <b>6 states</b>. Nobody can stop it on purpose at that speed, so when you release the button it freezes on a random state.''',
    '''Instead of 27 diodes, we turn the 6 outputs into a <b>binary number</b> (BCD) with only 9 diodes: bit A (1) is on for 1, 3, 5; bit B (2) for 2, 3, 6; bit C (4) for 4, 5, 6. For example Q4 ("5") lights A and C: 1 + 4 = 5. The 10 kΩ pull-downs make a bit read 0 when no diode is pushing it up.''',
    '''The <b>CD4511</b> decoder (see <a class="navlink" href="#parts">Using real parts</a>) reads that 4-bit number and drives the right segments itself, with plenty of current: much brighter than project 14.''',
    '''Why not a ready-made counter that counts 1–6 in binary? The ideal chip (CD4510, a presettable BCD counter) isn't sold at Gotronic, and the CD4518 can only reset to 0. Using the 4017 + a diode encoder is a neat workaround with parts you already have.''',
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
    '''The 9-diode <b>encoder</b> (1N4148, stripe on the second hole). Bit <b>A</b> (=1) line, bottom col 24: <b>g16→f24</b> (Q0), <b>g17→g24</b> (Q2), <b>a20→h24</b> (Q4). Bit <b>B</b> (=2), col 27: <b>g15→f27</b> (Q1), <b>h17→g27</b> (Q2), <b>g14→h27</b> (Q5). Bit <b>C</b> (=4), col 30: <b>g20→f30</b> (Q3), <b>b20→g30</b> (Q4), <b>h14→h30</b> (Q5).''',
    '''Pull-downs, so a bit reads 0 when no diode drives it: <b>10 kΩ</b> from <b>i24</b>, <b>i27</b> and <b>i30</b> to the bottom − rail.''',
    '''<b>CD4511</b> across the gap, notch left, columns <b>34–41</b> (pins 1–8 bottom: B C LT BI LE D A VSS; pins 16–9 top: VDD f g a b c d e). <b>d34</b> (VDD) → top +, <b>j41</b> (VSS) → bottom −, <b>j36</b> (LT) and <b>j37</b> (BI) → bottom +, <b>j38</b> (LE) and <b>j39</b> (D) → bottom −.''',
    '''Bits into the decoder: <b>j24 → i40</b> (A), <b>j27 → i34</b> (B), <b>j30 → i35</b> (C).''',
    '''Display across the gap, columns <b>50–54</b> (bottom: e d COM c dp, top: g f COM a b). <b>j52</b> (COM) → bottom −.''',
    '''Segment resistors <b>1 kΩ</b> (bend the legs, they're long): a <b>c37→c53</b>, b <b>b38→b54</b>, c <b>d39→h53</b>, d <b>c40→i51</b>, e <b>b41→g50</b>, f <b>c35→c51</b>, g <b>b36→b50</b>.''',
    '''Connect the battery. Hold the button and release: a bright number from 1 to 6.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Remove the pull-down on bit B (i27)', '''Bit B floats: some faces show wrong or flickering digits. Pull-downs matter for CMOS inputs!'''),
    ('Connect LT (j36) to − instead of +', '''"Lamp test": the display shows 8, all segments on. Handy to check the wiring.'''),
    ('''Move the reset jumper from Q6 (j18) to Q9 (j21… pin 9 is b21)''', '''Counts 10 states: the encoder only knows 1–6, so the other faces show "0" (blank bits).'''),
    ('Compare the brightness with project 14', 'Much brighter: the 4511 drives the segments itself.'),
    ('Resistor networks', '''The seven 1 kΩ between the CD4511 and the display can be two <b>4 × 1 kΩ isolated networks</b> (Gotronic 15863, €0.30 each): pins 1–2, 3–4, 5–6, 7–8 are 4 separate resistors.'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
