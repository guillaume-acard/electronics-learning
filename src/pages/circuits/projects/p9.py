# Project 9 · ⏱️ Timers & blinkers   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p9'
NUM = '9'
TITLE = 'LED chaser: 555 + CD4017'
MENU = 'LED chaser'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Microchips</span> Make a light that runs along 10 LEDs. <a class="navlink" href="#s4017">📖 lesson</a></p>
  <canvas id="cp9" width="800" height="400"></canvas>'''
# "You need" list
NEED = [
    'The 555 blinker above',
    'CD4017',
    '''10 LEDs + 10 × 470 Ω (or one shared, since only one is on at a time)''',
]
# "How it works" paragraphs
HOW = [
    '''The 555 from project 8 produces clock pulses. Each pulse arrives on the CD4017's <b>clock</b> input (pin 14).''',
    '''Inside, the 4017 counts the pulses and turns on <b>exactly one</b> of its 10 outputs: Q0, then Q1… up to Q9, then back to Q0. Each output lights its LED, so the light runs along the row.''',
    '''Only one LED is ever on, so a single shared resistor on the LEDs' common side is enough. Wiring an output to <b>reset</b> (pin 15) makes it count to a smaller number.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = None
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Battery disconnected. Link <b>only the + rails</b> (top ↔ bottom). The top <b>−</b> rail will be the LEDs' shared line, so <b>don't</b> link the − rails.''',
    '''555 across the gap, notch left, columns <b>8–11</b>. <b>d8</b> (pin 8) → top +, <b>j11</b> (pin 4) → bottom +, <b>j8</b> (pin 1) → bottom −.''',
    '''555 timing parts: <b>1 kΩ c8→c9</b>, <b>47 kΩ b9→b10</b>, jumper <b>a10 → i9</b> (pin 6 → pin 2), <b>10 µF</b> + in <b>h9</b>, stripe in bottom −.''',
    '''<b>CD4017</b> across the gap, notch left, columns <b>35–42</b> (pins 1–8 bottom, 16–9 top). <b>d35</b> (pin 16) → top +, <b>j42</b> (pin 8) → bottom −.''',
    '''<b>d38</b> (pin 13, enable) → bottom −, and <b>c36</b> (pin 15, reset) → bottom − (jumpers over the chip).''',
    '''Clock: jumper from <b>g10</b> (555 pin 3) to <b>c37</b> (4017 pin 14).''',
    '''10 LEDs in columns <b>46–55</b>: <b>long leg in row c</b>, <b>short leg in the top − rail</b>. Jumpers from the outputs to the LEDs' row a: Q0 <b>h37</b>→a46, Q1 <b>h36</b>→a47, Q2 <b>h38</b>→a48, Q3 <b>h41</b>→a49, Q4 <b>b41</b>→a50, Q5 <b>h35</b>→a51, Q6 <b>h39</b>→a52, Q7 <b>h40</b>→a53, Q8 <b>b42</b>→a54, Q9 <b>b40</b>→a55.''',
    '''Shared resistor: <b>470 Ω</b> from the top <b>−</b> rail to the bottom <b>−</b> rail (column 57).''',
    '''Connect the battery: red → top +, black → <b>bottom −</b>. The light runs from Q0 to Q9.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Change the 555 speed', 'The chaser speeds up or slows down.'),
    ('Wire Q5 to pin 15 (reset)', 'It now counts 0–4 only.'),
    ('Arrange the LEDs in a circle', 'A spinning-wheel effect.'),
]
# optional HTML at the very end (warnings)
AFTER = ''
