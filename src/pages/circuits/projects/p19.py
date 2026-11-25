# Project 19 · 🎲 Dice & counters   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p19'
NUM = '19'
TITLE = '2-digit counter 00–99'
MENU = 'Counter 00–99'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Counting chips</span> Two <b>SC39-11SURKWA</b> displays count from 00 to 99 by themselves: a 555 ticks, a <b>CD4518</b> counts in decimal and carries over to the tens, and two <b>CD4511</b> light the digits. A reset button brings it back to 00.</p>
  <div class="controls"><button id="m19run" class="active">⏸ Pause</button><button id="m19tick">👆 One tick</button><button id="m19rst">↺ Reset (button)</button><x-slider id="m19sp" min="0.5" max="20" step="0.5" value="1.5">Speed</x-slider></div>
  <canvas id="m19" width="800" height="440"></canvas>
  <p class="hint">The 4 outputs of each counter are worth 8, 4, 2 and 1. Watch the units' "8" bit: when it drops (9 → 0), it ticks the tens. That's the carry.</p>'''
# "You need" list
NEED = [
    'NE555 + CD4518 + 2 × CD4511',
    '2 × SC39-11SURKWA displays',
    '15 × 1 kΩ (14 segments + 555), 1 × 47 kΩ, 1 × 10 kΩ',
    '10 µF electrolytic capacitor',
    '''Push button, 9 V battery + clip (or the USB power module), breadboard + plenty of jumpers''',
]
# "How it works" paragraphs
HOW = [
    '''The <b>555</b> ticks about 1.5 times per second. The <b>CD4518</b> contains two counters that count in <b>BCD</b> (binary-coded decimal): 0000, 0001 … 1001 (9), then back to 0000. Its 4 outputs Q1–Q4 are worth 1, 2, 4 and 8: for a "6", Q2 and Q3 are on (2 + 4).''',
    '''<b>Carrying over:</b> the units counter's Q4 (the "8") is on for 8 and 9, and drops when it rolls over from 9 to 0. Wired to the tens counter's ENABLE, that drop counts as one tick: exactly like 09 → 10 on paper.''',
    '''Each 4-bit number goes into a <b>CD4511</b>, which lights the right segments of its display (with 1 kΩ per segment). Same decoder as dice project 15, just twice.''',
    '''<b>Water analogy:</b> a bucket (the units) fills one cup per tick. When it holds the 10th cup it tips over, pours one cup into the next bucket (the tens), and starts empty again.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = '''Follow the steps in order and tick each one. Always wire with the power <b>disconnected</b>, and connect the battery <b>last</b>.'''
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Battery disconnected. Link the rails at the right end: top <b>+</b> ↔ bottom <b>+</b> (column 60), top <b>−</b> ↔ bottom <b>−</b> (column 59).''',
    '''The clock: <b>NE555</b> across the gap, notch left, columns <b>3–6</b>. <b>d3</b> → top +, <b>j3</b> → bottom −, <b>j6</b> (reset) → bottom +. Timing: <b>1 kΩ</b> c3→c4, <b>47 kΩ</b> b4→b5, jumper <b>a5 → i4</b>, <b>10 µF</b> + leg <b>h4</b>, − leg bottom −. ≈ 1.5 ticks per second.''',
    '''<b>CD4518</b> (dual BCD counter) across the gap, notch left, columns <b>9–16</b> (bottom pins 1–8: CLK A, EN A, Q1A–Q4A, RST A, VSS; top pins 16–9: VDD, RST B, Q4B–Q1B, EN B, CLK B). <b>d9</b> → top +, <b>j16</b> → bottom −, <b>j10</b> (EN A) → bottom +, <b>a16</b> (CLK B) → top −. Clock: jumper <b>h5 → h9</b> (555 pin 3 → CLK A).''',
    '''Chain the two counters: jumper <b>g14 → b15</b> (Q4A → EN B: the units' "8" bit falls when going 9 → 0 and ticks the tens). Reset: jumper <b>b10 → h15</b> (RST B → RST A), <b>10 kΩ</b> from <b>i15</b> to bottom −, push button at columns <b>50–52</b>, jumper top + → <b>a50</b>, jumper <b>i52 → j15</b>.''',
    '''Tens decoder: <b>CD4511</b>, columns <b>19–26</b> (bottom: B C LT BI LE D A VSS; top: VDD f g a b c d e). <b>d19</b> → top +, <b>j26</b> → bottom −, <b>j21</b> (LT) and <b>j22</b> (BI) → bottom +, <b>j23</b> (LE) → bottom −.''',
    '''Tens number into the decoder: <b>a14 → i25</b> (Q1B → A), <b>a13 → i19</b> (Q2B → B), <b>c12 → h20</b> (Q3B → C), <b>b11 → h24</b> (Q4B → D).''',
    '''Tens display (SC39-11SURKWA) across the gap, columns <b>28–32</b>. COM: <b>j30</b> → bottom −.''',
    '''Tens segment resistors, <b>1 kΩ</b> each: f <b>a20→a29</b>, g <b>b21→b28</b>, a <b>c22→c31</b>, b <b>d23→d32</b>, c <b>a24→g31</b>, d <b>a25→h29</b>, e <b>a26→i28</b>. The last three cross the gap.''',
    '''Units decoder: <b>CD4511</b>, columns <b>35–42</b>. <b>d35</b> → top +, <b>j42</b> → bottom −, <b>j37</b> (LT) and <b>j38</b> (BI) → bottom +, <b>j39</b> (LE) → bottom −.''',
    '''Units number into the decoder: <b>i11 → i41</b> (Q1A → A), <b>i12 → i35</b> (Q2A → B), <b>i13 → i36</b> (Q3A → C), <b>h14 → i40</b> (Q4A → D).''',
    '''Units display, columns <b>44–48</b>. COM: <b>j46</b> → bottom −.''',
    '''Units segment resistors, <b>1 kΩ</b> each: f <b>a36→a45</b>, g <b>b37→b44</b>, a <b>c38→c47</b>, b <b>d39→d48</b>, c <b>a40→g47</b>, d <b>a41→h45</b>, e <b>a42→i44</b>.''',
    '''Connect the battery: 00, 01, 02 … 99, 00. Press the button to go back to 00. (Two displays drain a 9 V battery in a few hours: the USB power module at 5 V works too, a little dimmer.)''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Replace the 10 µF with 1 µF', '10 times faster: a stopwatch counting tenths of seconds.'),
    ('Remove the jumper g14 → b15', '''The tens never move: the units count 0–9 forever. The carry is that one wire!'''),
    ('Disconnect the 555 (h5 → h9) and clock with a button', '''Count people coming in: a button from + to h9 with a 10 kΩ to −. (Add a 100 nF across the button to stop "bounce" double counts.)'''),
    ('Connect LT (j21 / j37) to −', '"Lamp test": both displays show 88.'),
    ('Resistor networks', '''The fourteen 1 kΩ can be four <b>4 × 1 kΩ isolated networks</b> (Gotronic 15863, €0.30 each), two per digit: pins 1–2, 3–4, 5–6, 7–8 are 4 separate resistors. Tidier board, fewer parts to count.'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
