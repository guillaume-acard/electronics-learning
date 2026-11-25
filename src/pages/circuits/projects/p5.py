# Project 5 · 🔀 Transistors & relays   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p5'
NUM = '5'
TITLE = 'Touch switch (skin turns on an LED)'
MENU = 'Touch switch'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Transistor</span> Two transistors amplify the tiny current through your finger about 40,000×. <a class="navlink" href="#transistor">📖 lesson</a></p>
  <canvas id="cp5" width="800" height="370"></canvas>'''
# "You need" list
NEED = [
    '9 V battery',
    '2 × BC547 (NPN)',
    '1 kΩ + 470 Ω resistors',
    'LED, 2 bare wires as touch pads',
]
# "How it works" paragraphs
HOW = [
    '''Your skin conducts a <b>tiny</b> current (a few µA) between the two pads. That's far too little to light an LED.''',
    '''Transistor 1 amplifies it about 200×, and its output feeds the base of transistor 2, which amplifies it about 200× again. Together (a <b>Darlington pair</b>) that's ×40,000: a few µA through your finger become a few mA through the LED.''',
    '''The 1 kΩ protects the base if the pads touch each other directly, and the 470 Ω limits the LED current.''',
]
# optional extra HTML after "How it works"
EXTRA = '''<h3>🤔 Why two transistors? Isn't one enough?</h3>
  <div class="howbox">
    <p><b>A transistor is not a light switch, it's a multiplier.</b> When it's "on", it doesn't let everything through: it lets through <b>at most its gain × the current going into its base</b>. For a BC547 the gain is about <b>200</b>.</p>
    <p><b>Your finger gives almost nothing.</b> Skin is a poor conductor (about 500 kΩ, more when dry), so only about <b>17 µA</b> (millionths of an amp) flows through it. With one transistor: 200 × 17 µA = <b>3.4 mA</b> at most. The LED wants about <b>14 mA</b> to shine properly, so it only glows faintly. With dry skin (~4 µA) it's 0.8 mA: almost nothing.</p>
    <p><b>Two transistors multiply twice.</b> The first one's output becomes the second one's input: 200 × 200 = <b>40,000</b>. Now 17 µA could become 680 mA, far more than needed, so the second transistor opens <b>fully</b> and the 470 Ω resistor sets a nice 14 mA. Even dry fingers work.</p>
    <p>💧 <b>Water analogy:</b> your finger is a tiny trickle. It can only open a small valve a little. Put that small valve's flow on a big valve, and the big valve opens wide.</p>
  </div>
  <div class="controls"><button class="p5n active" data-n="2">2 transistors (Darlington)</button><button class="p5n" data-n="1">1 transistor only</button><x-slider id="p5skin" min="0" max="1" step="0.01" value="0.4" grow="1">Finger</x-slider><span class="hint">wet ← → dry</span></div>
  <canvas id="cp5w" width="800" height="230"></canvas>
  <p class="hint">Compare the "available" current with what the LED needs. With one transistor and a dry finger, the LED barely glows. Tip: click the transistors in the schematic above to see the real base and collector currents with the probe.</p>
  <h3>🔗 Why are the two collectors joined (and not on +9 V)?</h3>
  <div class="howbox">
    <p><b>Safety.</b> If the first collector went straight to +9 V and the pads got shorted (a coin, a stray wire), about 8 mA would enter transistor 1. It would then try to pass 200 × 8 mA = <b>1.6 A</b> straight into the base of transistor 2, with nothing to stop it. Both transistors would burn.</p>
    <p><b>Joined after the LED</b>, everything transistor 1 passes must first go through the <b>470 Ω and the LED</b>. The total is capped at ~14 mA, whatever happens at the pads. Bonus: transistor 1's small current also lights the LED.</p>
    <p>💧 <b>Water analogy:</b> the 470 Ω is a narrow section at the entrance. Both valves drink from after it, so neither can ever get a flood.</p>
    <p class="hint">Small cost: the pair keeps ~0.9 V across itself instead of 0.2 V, so the LED gets ~13 mA instead of 14. Ready-made Darlingtons like the TIP120 are wired exactly this way inside.</p>
  </div>'''
# wiring hint (None = the standard one)
WIRING = None
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Battery disconnected. Hold each <b>BC547</b> with the <b>flat side facing you</b>: the legs are <b>C B E</b> from left to right.''',
    '''Transistor 1 in <b>c20 c21 c22</b> (C B E). Transistor 2 in <b>c30 c31 c32</b>.''',
    '''Jumper from <b>e22</b> (E1) to <b>e31</b> (B2): this makes the Darlington pair.''',
    'Jumper <b>d20 → d30</b> to link both collectors.',
    'Jumper from <b>b32</b> (E2) to the top <b>−</b> rail.',
    '''LED: <b>short leg</b> in <b>a30</b> (the collectors), <b>long leg</b> in <b>a36</b>. Then <b>470 Ω</b> from <b>b36</b> to the top <b>+</b> rail.''',
    '''Touch pads: <b>1 kΩ</b> from the top <b>+</b> rail to <b>a12</b>. A jumper with a bare end in <b>b12</b> is pad A. A jumper with a bare end in <b>b21</b> (B1) is pad B.''',
    '''Connect the battery (red → top +, black → top −) and touch both bare ends with one finger: the LED lights.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Touch both pads with one finger', 'The LED lights: your skin lets a tiny current flow.'),
    ('''Use only one transistor: unplug the jumper e22 → e31 and connect the LED side (d30) to d20 instead''', '''Dim or nothing: 200 × a few µA is only a few mA at most. Wet your finger: it gets brighter.'''),
    ('Wet finger vs dry finger', "Wet skin conducts better, so it's brighter."),
]
# optional HTML at the very end (warnings)
AFTER = ''
