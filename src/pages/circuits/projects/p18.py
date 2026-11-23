# Project 18 · 🔊 Sound & music   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p18'
NUM = '18'
TITLE = 'Fuzz pedal for your Ruby'
MENU = 'Fuzz pedal'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Guitar</span> A real guitar effect: a two-transistor <b>"Fuzz Face"</b> that goes between your guitar and the <b>Ruby amp</b>. It turns clean notes into the thick, buzzy fuzz of 60s and 70s rock.</p>
  <div class="controls"><x-slider id="m18f" min="0" max="1" step="0.01" value="0.8" grow="1">Fuzz (22 µF on Q2 emitter)</x-slider><x-slider id="m18b" min="0" max="1" step="0.01" value="0.5" grow="1">Bias trimmer</x-slider><button id="m18c">🎸 Play clean</button><button id="m18p">🔥 Play with fuzz</button></div>
  <canvas id="m18" width="800" height="300"></canvas>
  <p class="hint">Left: one guitar note going in (blue) and coming out (orange). Right: the "transfer curve": how the input is mapped to the output. Flat parts = clipping. Move the bias away from the middle: the clipping becomes lopsided and the sound gets thin and sputtery.</p>'''
# "You need" list
NEED = [
    '2 × BC547 (BC547A or BC549C also fine)',
    '10 kΩ trimmer (bias)',
    '33 kΩ, 100 kΩ, 1 kΩ, 470 Ω resistors',
    '2.2 µF and 22 µF electrolytic, 10 nF ceramic capacitors',
    '''2 × 6.35 mm mono female jacks (solder 2 wires to each) + 2 guitar cables''',
    '9 V battery + clip, breadboard + jumpers',
]
# "How it works" paragraphs
HOW = [
    '''This is a silicon <b>"Fuzz Face"</b>, the 1966 pedal heard on countless 60s/70s records. It's just two transistors in a row, with so much gain (~100 × 100) that a guitar note is amplified far beyond what the 9 V supply can hold.''',
    '''So the wave gets <b>clipped</b>: its tops and bottoms are sliced flat, and a smooth vibrating string turns into an almost <b>square</b> wave. Square waves are full of extra harmonics: that's the buzzy, sustaining fuzz sound. Same idea as the Ruby's overdrive, pushed much further.''',
    '''<b>Water analogy:</b> a powerful pump (the transistors) pushing water through a pipe with a ceiling and a floor (9 V and 0 V). Small waves pass, but the pump makes them so big they bang against the ceiling and floor and come out flat-topped.''',
    '''The <b>100 kΩ feedback</b> resistor holds both transistors at the right resting point, the <b>22 µF</b> on Q2's emitter sets how much gain the music sees (more capacitance = more fuzz), and the <b>trimmer</b> sets Q2's resting voltage: too high or too low and the fuzz becomes thin, gated and "sputtery". The 2.2 µF and 10 nF are the usual coupling capacitors that pass the music but block DC.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = '''Follow the steps in order and tick each one. Always wire with the power <b>disconnected</b>, and connect the battery <b>last</b>.'''
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Battery disconnected. Two <b>BC547</b> in the top half, flat side facing you (C B E): <b>Q1</b> in <b>c20–c22</b>, <b>Q2</b> in <b>c30–c32</b>. Q1's emitter to ground: <b>a22 → top −</b>. Q1's collector drives Q2's base directly: jumper <b>b20 → b31</b>.''',
    '''Q1's collector resistor: <b>33 kΩ</b> from top + to <b>a20</b>.''',
    '''Q2's collector load: <b>470 Ω</b> from top + to <b>b26</b>, the <b>10 kΩ trimmer</b> in <b>a26–a28</b> (used as a variable resistor: pins 1 and 2), and jumper <b>c27 → a30</b> (wiper → Q2 collector). This trimmer is the <b>bias</b> knob.''',
    '''Q2's emitter: <b>1 kΩ</b> from <b>a32</b> to top −, and <b>22 µF</b> with its <b>+ leg in b32</b> and − leg in top −. This capacitor gives the full fuzz.''',
    '''The feedback resistor that keeps everything balanced: <b>100 kΩ</b> from <b>e32</b> (Q2 emitter) to <b>e21</b> (Q1 base).''',
    '''Input: <b>2.2 µF</b>, <b>+ leg in d21</b> (Q1 base), − leg in <b>d17</b>. Input jack (solder two wires to it): tip → <b>a17</b>, sleeve → top −.''',
    '''Output: <b>10 nF</b> from <b>d30</b> (Q2 collector) to <b>d35</b>. Output jack: tip → <b>a35</b>, sleeve → top −.''',
    '''Connect the battery. Guitar → IN, OUT → your Ruby (volume low first!). Play and turn the trimmer: find the spot where the fuzz sounds fat and sustains (Q2's collector at ≈ 4.5 V if you have a multimeter).''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Replace the 22 µF with 2.2 µF', 'Less gain for the music: a milder, crunchier overdrive.'),
    ('Add a 1 kΩ in series with the 22 µF', '''A "fuzz knob" halfway: use the 10 kΩ trimmer's twin as a real knob for the full range.'''),
    ('Turn the trimmer to each end', '''Too low or too high bias: a thin, "dying battery" gated sound, a style some players love.'''),
    ('Add a 47 kΩ trimmer as a volume', '''Output → trimmer pin 1, pin 3 → −, wiper → OUT jack: tames the level before the Ruby.'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
