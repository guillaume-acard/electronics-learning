# Project 26 · ⏱️ Timers & blinkers   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p26'
NUM = '26'
TITLE = 'Quartz stopwatch (00–99 seconds)'
MENU = 'Quartz stopwatch'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Timers</span> The 00–99 counter of project 19, but driven by a <b>32.768 kHz watch quartz</b> instead of the NE555: it counts <b>exactly one per second</b>. A CD4060 makes the quartz vibrate and divides its 32,768 ticks per second down to 2 Hz; a CD4013 halves that to 1 Hz.</p>
  <div class="controls"><button id="p26r">↺ Reset both</button><span class="hint">The two counters run on your real clock: the 555 version drifts (3 % fast here), the quartz one stays exact.</span></div>
  <canvas id="m26" width="800" height="440"></canvas>
  <p class="hint">Top: the divider chain, from the quartz to 1 Hz. The first stages are far too fast to see; the last ones blink. Bottom: a quartz stopwatch and a 555 stopwatch started together.</p>'''
# "You need" list
NEED = [
    '32.768 kHz watch quartz (Gotronic 05220)',
    'CD4060 oscillator + 14-stage divider (Gotronic 20318)',
    'CD4013 dual D flip-flop (Gotronic 20273)',
    '10 MΩ, 100 kΩ, 2 × 22 pF ceramic (Gotronic 15816)',
    '''Everything from project 19 except the 555 and its 3 timing parts''',
]
# "How it works" paragraphs
HOW = [
    '''A <b>quartz</b> is a tiny slice of crystal that vibrates at one single frequency, like a tuning fork. A watch quartz vibrates at <b>32,768 times per second</b>. Inside the CD4060, an inverter (a NOT gate) keeps it vibrating: the 10 MΩ biases it, the two 22 pF and the 100 kΩ make the crystal the only thing that sets the rhythm.''',
    '''Why 32,768? Because it's 2¹⁵: divide it by 2 fifteen times and you get exactly 1 Hz. The CD4060 contains a chain of 14 dividers (flip-flops): 32,768 → 16,384 → 8,192 → … → its last output Q14 gives <b>2 Hz</b>. The CD4013 is one more divider: each time its clock rises, its output flips (because Q̅ is fed back to D). 2 Hz → <b>1 Hz</b>.''',
    '''The 1 Hz goes into the counter of project 19 instead of the 555. The NE555's rhythm depends on a resistor and a capacitor (5–10 % tolerance, and it drifts with temperature and battery). The quartz is accurate to about ±20 ppm: <b>less than 2 seconds per day</b>.''',
    '''💧 <b>Analogy:</b> the 555 is a bucket that fills and empties: roughly regular, depending on the tap. The quartz is a pendulum clock's pendulum: it always swings at the same pace. The dividers are the gears that turn its fast ticks into seconds.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = '''Follow the steps in order and tick each one. Wire with the battery <b>disconnected</b>, and connect it <b>last</b>.'''
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''Build the <a class="navlink" href="#p19">00–99 counter (project 19)</a> completely, <b>except</b> its step 2 (the NE555 and its parts) and the jumper <b>h5 → h9</b>. The quartz time base replaces the 555.''',
    '''<b>CD4060</b> (oscillator + 14-stage divider) across the gap, notch left, columns <b>53–60</b> (bottom pins 1–8: Q12, Q13, Q14, Q6, Q5, Q7, Q4, VSS; top pins 16–9: VDD, Q10, Q8, Q9, RESET, φI, φO̅, φO). <b>a53</b> (VDD) → top +, <b>j60</b> (VSS) → bottom −, <b>a57</b> (RESET) → top −: it runs.''',
    '''The <b>quartz oscillator</b>: <b>10 MΩ</b> b58–b59 (between pin 11 and pin 10: it wakes the inverter up). <b>32.768 kHz quartz</b> from <b>c58</b> (pin 11) to <b>c51</b>. <b>100 kΩ</b> from <b>d59</b> (pin 10) to <b>d51</b> (it protects the tiny crystal from too much drive). Two <b>22 pF</b>: <b>a58</b> → top −, <b>a51</b> → top −. Keep the quartz legs short and don't touch it while it runs.''',
    '''<b>CD4013</b> (flip-flop) across the gap, notch left, columns <b>2–8</b> (bottom pins 1–7: Q1, Q̅1, CLK1, R1, D1, S1, VSS; top pins 14–8: VDD, Q2, Q̅2, CLK2, R2, D2, S2). <b>d2</b> → top +, <b>j8</b> → bottom −, <b>j5</b> (R1) and <b>j7</b> (S1) → bottom −. Toggle: jumper <b>h3 → h6</b> (Q̅1 → D1). The unused second flip-flop's inputs to top −: <b>a5, a6, a7, a8</b> (CMOS inputs must never float).''',
    '''Link the chain: <b>j55 → i4</b> (CD4060 Q14, 2 Hz → CD4013 clock) and <b>h2 → h9</b> (CD4013 Q1, 1 Hz → CD4518 CLK A).''',
    '''Connect the battery. Press the reset button: 00. The display now counts <b>exactly one per second</b>. Check against your phone's stopwatch: after 99 s they still agree.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Start / stop', '''Move the RESET jumper (a57) from top − to top +: the CD4060 freezes, the count stops. Back to −: it continues. Use a switch there and you have a stopwatch.'''),
    ('See the 2 Hz', '''LED + 1 kΩ from CD4060 pin 3 (Q14, column 55 bottom) to −: it blinks twice a second. On Q12 (column 53): 8 times a second.'''),
    ('Count 00–59 like a clock', '''Add a CD4081 (AND gates): when the tens reach 6 (Q2B and Q3B both high), its output resets both counters. That's how real clocks count seconds and minutes.'''),
    ('Compare with the 555', '''Build project 19 again with its 555 next to it: after a few minutes, the two counters disagree. The quartz one matches your phone.'''),
    ('Touch the quartz', '''Pinch the crystal or its 22 pF while it runs: the count may hiccup. The oscillator is sensitive to anything that adds capacitance: that's why the legs must be short.'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
