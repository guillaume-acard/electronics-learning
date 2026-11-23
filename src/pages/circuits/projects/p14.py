# Project 14 · 🎲 Dice & counters   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p14'
NUM = '14'
TITLE = 'Dice without Arduino: 7-segment, diode matrix'
MENU = 'Dice: 7-seg matrix'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">No microcontroller</span> The same 555 + CD4017 heart, but now showing a <b>digit</b> on your <b>SC39-11SURKWA</b> display. The trick: a hand-made <b>diode matrix</b> of 27 diodes that acts like a tiny read-only memory, turning "output 3" into the segments of a "4".</p>
  <div class="controls"><button id="ddb_p14" class="active big">👆 Hold to roll</button><span class="hint">Hold, then release, just like the real button.</span></div>
  <canvas id="dd_p14" width="800" height="300"></canvas>
  <p class="hint">Left: the 555 pulses and the CD4017 outputs (one is on). Middle: the diode matrix, where the lit diodes are the ones conducting right now. Right: the result.</p>'''
# "You need" list
NEED = [
    'NE555 + CD4017',
    '27 × 1N4148 diodes',
    '1 × SC39-11SURKWA display',
    '7 × 2.2 kΩ, 1 × 10 kΩ, 1 × 1 kΩ, 1 × 47 kΩ',
    '10 nF ceramic capacitor',
    '''Push button, 9 V battery + clip, breadboard + plenty of jumpers''',
]
# "How it works" paragraphs
HOW = [
    '''The <b>555</b> runs only while the button is pressed (its reset pin 4 is pulled up by the button and held down by the 10 kΩ otherwise), producing ~1,500 pulses per second. The <b>CD4017</b> moves its single "on" output one step per pulse: Q0 → Q1 → … → Q5, and when it reaches Q6 that output resets it to Q0, so it cycles through exactly <b>6 states</b>. Nobody can stop it on purpose at that speed, so when you release the button it freezes on a random state.''',
    '''Each output must light a different set of segments: Q0 → "1" (b, c), Q1 → "2" (a, b, d, e, g), and so on up to Q5 → "6". The <b>diode matrix</b> is a hand-built lookup table, or <b>ROM</b> (read-only memory). Each diode says "when this output is on, light this segment".''',
    '''Every segment line collects diodes from all the outputs that need it (that's an OR again), then goes through a 2.2 kΩ resistor to the display. Count them: 2 + 5 + 5 + 4 + 5 + 6 = <b>27 diodes</b>.''',
    '''The 4017 has to light up to 6 segments from one output, so each segment gets only ~2–3 mA: it works, but it's a bit dim. That's the price of the simple approach. Project 15 does the same job with only 9 diodes.''',
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
    '''Extend the busy outputs with jumpers (each output then has up to 7 holes): <b>j15→a23</b> (Q1), <b>j17→a25</b> (Q2), <b>d20→j26</b> (Q4), <b>j14→a27</b> (Q5). Join the two-column segment lines: <b>j34→j35</b> (c) and <b>j43→j44</b> (g).''',
    '''Segment lines are bottom columns: a = 30, b = 32, c = 34+35, d = 37, e = 39, f = 41, g = 43+44. Diodes (1N4148, stripe on the segment-line side) for <b>a</b>: Q1 <b>g15→f30</b>, Q2 <b>g17→g30</b>, Q4 <b>a20→h30</b>, Q5 <b>g14→i30</b>. For <b>b</b>: Q0 <b>g16→f32</b>, Q1 <b>h15→g32</b>, Q2 <b>h17→h32</b>, Q3 <b>g20→i32</b>.''',
    '''Diodes for <b>c</b>: Q0 <b>h16→f34</b>, Q2 <b>i17→g34</b>, Q3 <b>h20→h34</b>, Q4 <b>b20→i34</b>, Q5 <b>h14→f35</b>. For <b>d</b>: Q1 <b>i15→f37</b>, Q2 <b>b25→g37</b>, Q4 <b>c20→h37</b>, Q5 <b>i14→i37</b>.''',
    '''Diodes for <b>e</b>: Q1 <b>b23→f39</b>, Q5 <b>b27→g39</b>. For <b>f</b>: Q3 <b>i20→f41</b>, Q4 <b>f26→g41</b>, Q5 <b>c27→h41</b>. For <b>g</b>: Q1 <b>c23→f43</b>, Q2 <b>c25→g43</b>, Q3 <b>j20→h43</b>, Q4 <b>g26→i43</b>, Q5 <b>d27→f44</b>. That's all 27!''',
    '''Display (SC39-11SURKWA) across the gap in columns <b>52–56</b> (pins 1–5 bottom: e d COM c dp; pins 10–6 top: g f COM a b). <b>j54</b> (COM) → bottom −.''',
    '''Segment resistors <b>2.2 kΩ</b> from each line to its display pin: a <b>j30→c55</b>, b <b>j32→b56</b>, c <b>i35→h55</b>, d <b>j37→i53</b>, e <b>j39→g52</b>, f <b>j41→c53</b>, g <b>i44→b52</b>.''',
    '''Connect the battery. Hold the button and release: a number from 1 to 6.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Take out one diode of segment g', '''The middle bar disappears from exactly one digit: you just edited the memory!'''),
    ('Try 1 kΩ instead of 2.2 kΩ', '''Brighter, but the "6" (6 segments on one 4017 output) may look dimmer than the "1".'''),
    ('Add BC547 buffers (emitter followers) on the 6 outputs', '''Every digit gets full, even brightness: the transistors supply the current instead of the 4017.'''),
    ('Compare with project 15', '''Same result with 9 diodes instead of 27. Decoders exist for a reason!'''),
    ('Resistor networks', '''The seven 2.2 kΩ can be two <b>4 × 2.2 kΩ isolated networks</b> (Gotronic 15864, €0.12 each): 4 separate resistors per package, pins 1–2, 3–4, 5–6, 7–8. Plug each pair where one resistor was (a jumper may be needed to reach the far end).'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
