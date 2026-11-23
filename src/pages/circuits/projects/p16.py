# Project 16 · 🔀 Transistors & relays   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p16'
NUM = '16'
TITLE = 'Two-LED flip-flop (no chip!)'
MENU = 'LED flip-flop'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Transistors only</span> Two LEDs that blink in turn, made from just <b>2 transistors, 2 capacitors and 4 resistors</b>. No chip at all: this is the circuit hidden inside the 555 and every blinker, built from loose parts so you can see how an <b>oscillator</b> works.</p>
  <div class="controls"><label class="slider">Capacitor C1 <select class="fsel" id="m16c1"><option value="1">1 µF</option><option value="10" selected>10 µF</option><option value="100">100 µF</option></select></label><label class="slider">Capacitor C2 <select class="fsel" id="m16c2"><option value="1">1 µF</option><option value="10" selected>10 µF</option><option value="100">100 µF</option></select></label></div>
  <canvas id="m16" width="800" height="300"></canvas>
  <p class="hint">Left: the circuit, with each capacitor's charge. Right: the voltage on each transistor's base. It dives below 0 V when the other transistor switches on, then climbs back up through 47 kΩ; at 0.6 V the transistor switches on and the LEDs swap. Try different C1 and C2.</p>'''
# "You need" list
NEED = [
    '2 × BC547',
    '2 × 10 µF electrolytic capacitors',
    '2 × 47 kΩ, 2 × 470 Ω',
    '2 LEDs (one red, one green)',
    '9 V battery + clip, breadboard + jumpers',
]
# "How it works" paragraphs
HOW = [
    '''Two transistors, each one able to switch the other <b>off</b> for a moment. When Q1 turns on, its collector drops from ~9 V to ~0 V. The capacitor linking it to Q2's base passes that sudden drop on, and pushes Q2's base <b>below 0 V</b>: Q2 is slammed off.''',
    '''Then Q2's base slowly climbs back up as its 47 kΩ resistor refills the capacitor. When it reaches ~0.6 V, Q2 turns on, its collector drops, and the other capacitor slams <b>Q1</b> off. And so on, forever: a <b>see-saw</b> that tips itself.''',
    '''<b>Water analogy:</b> two buckets on a see-saw, each slowly filled by a thin pipe (the 47 kΩ). When one is full it tips the see-saw, which empties the other bucket. Time per side ≈ 0.7 × R × C = 0.7 × 47 kΩ × 10 µF ≈ <b>0.33 s</b>.''',
    '''This is exactly the job a 555 does (project 8), but built from loose parts. It's also the oldest oscillator in electronics: the "astable multivibrator" from 1917, then with vacuum tubes.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = '''Follow the steps in order and tick each one. Always wire with the power <b>disconnected</b>, and connect the battery <b>last</b>.'''
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Battery disconnected. Two <b>BC547</b> in the top half, flat side facing you (C B E): <b>Q1</b> in <b>c10–c12</b>, <b>Q2</b> in <b>c30–c32</b>. Emitters to the top − rail: jumpers <b>a12 → tn13</b> and <b>a32 → tn33</b>.''',
    '''The LEDs and their resistors. <b>470 Ω</b> from top + to <b>a7</b>, red LED from <b>b7</b> (long leg) to <b>b10</b> (short leg, Q1's collector). <b>470 Ω</b> from top + to <b>a27</b>, green LED from <b>b27</b> (long leg) to <b>b30</b> (Q2's collector).''',
    '''Base resistors, the "refill pipes": <b>47 kΩ</b> from top + to <b>a11</b> (Q1 base) and <b>47 kΩ</b> from top + to <b>a31</b> (Q2 base).''',
    '''Cross-link 1: <b>10 µF</b> with its <b>+ leg in e10</b> (Q1 collector) and − leg in <b>e14</b>. Jumper <b>d14 → d31</b> (Q2 base).''',
    '''Cross-link 2: <b>10 µF</b> with its <b>+ leg in e30</b> (Q2 collector) and − leg in <b>e26</b>. Jumper <b>d26 → d11</b> (Q1 base). The two capacitors make an "X" between the transistors.''',
    '''Connect the battery (red → top +, black → top −). The LEDs take turns, about 1.5 times per second.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Change both 10 µF to 100 µF', '10 × slower: about one swap every 3 seconds.'),
    ('Use 1 µF for one and 100 µF for the other', '''Uneven blinking: one LED flashes, the other stays on long. The time on each side depends on ITS capacitor.'''),
    ('Use 1 µF for both', '''~15 swaps per second: both LEDs seem on at the same time. That's persistence of vision, the trick behind multiplexed displays (project 12).'''),
    ('Replace an LED with a speaker + 100 nF capacitors', 'Much faster swaps (~150 Hz): you hear a buzzy tone.'),
]
# optional HTML at the very end (warnings)
AFTER = ''
