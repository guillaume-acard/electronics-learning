# Project 21 · 🌡️ Sensors & detectors   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p21'
NUM = '21'
TITLE = 'Bar-graph thermometer (no Arduino)'
MENU = 'Bar thermometer'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">No microcontroller</span> A 10-segment green <b>DC10G</b> bar graph that grows with the temperature, one segment every 2 °C from 16 to 34 °C. Built with three <b>LM339</b> comparator chips, an <b>LM35</b> sensor and a ladder of resistors: you build by hand what an LM3914 does inside.</p>
  <div class="controls"><button class="big" id="bgHot">🤏 Hold to warm the sensor</button><x-slider id="bgRHI" min="0.15" max="0.26" step="0.002" value="0.2" grow="1">Trimmer (ladder current)</x-slider><span class="hint" id="bgI"></span></div>
  <canvas id="m21" width="800" height="430"></canvas>
  <div class="howbox" style="margin-top:10px"><p>📌 <b>DC10G pins</b> (from Gotronic's technical sheet): pins 1–10 = anodes of segments A–J (bottom row), pins 20–11 = their cathodes (top row, pin 20 above pin 1). Still do step 7's 10-second test: if nothing lights, the bar is the other way round, so turn it 180°. More in <a class="navlink" href="#pbar">Real parts: the DC10G</a>.</p></div>
  <p class="hint">Left: the LM35 voltage. Middle: the ladder and the 10 comparators; each one compares the signal with its own rung and pulls its segment to ground when the signal is higher. Right: the bar graph. The trimmer sets the ladder current, so the size of each step.</p>'''
# "You need" list
NEED = [
    '3 × LM339N quad comparator (Gotronic 21087)',
    'DC10G green 10-LED bar graph (Gotronic 03142)',
    'LM35DZ temperature sensor (Gotronic 21071)',
    '9 × 100 Ω, 470 Ω + 330 Ω, 2 × 10 kΩ, 10 kΩ trimmer',
    '''Resistor network 8 × 470 Ω with common point (Gotronic 04482) + 2 × 470 Ω''',
    'Breadboard with its 5 V power module (USB), about 35 jumpers',
]
# "How it works" paragraphs
HOW = [
    '''The <b>LM35</b> gives 10 mV per °C (0.22 V at 22 °C). Each <b>comparator</b> in the LM339 answers one question: "is the temperature signal (−) higher than my threshold (+)?". If yes, its output connects to ground and its LED lights. Three LM339 = 12 comparators; we use 10.''',
    '''The <b>ladder</b> makes the 10 thresholds: a small current (0.2 mA) flows from +5 V through 20 kΩ + the trimmer, then nine 100 Ω, then 800 Ω to ground. Each 100 Ω drops 0.2 mA × 100 Ω = <b>20 mV</b> = 2 °C. The 800 Ω at the bottom lifts the first step to 160 mV = 16 °C. The trimmer adjusts the current, so it stretches or shrinks the whole scale.''',
    '''Warmer → higher signal → it passes more rungs → more comparators say "yes" → <b>a longer bar</b>. This is exactly what is inside an LM3914, built by hand. The difference: the LM339 doesn't limit the LED current, so each LED gets its own 470 Ω (≈ 6 mA). Eight of them come in one <b>resistor network</b>: 8 resistors in one flat package, all joined on one side (pin 1, marked with a dot), which goes to +5 V.''',
    '''💧 <b>Water analogy:</b> a tall tank with 10 overflow holes at equal heights (the ladder), each feeding a little light. The warmer it is, the higher the water rises, and the more holes spill over.''',
    '''Right at a threshold, the signal wobbles by a fraction of a mV and the last segment may flicker. That's normal: a real product adds a little <b>hysteresis</b> (a 1 MΩ from each output back to its + input).''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = '''Follow the steps in order and tick each one. Wire with the USB <b>unplugged</b>, and plug it <b>last</b>.'''
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''USB <b>unplugged</b>. Plug the <b>power module</b> on the left end of the board, <b>both</b> jumpers on <b>5 V</b>. A steady 5 V matters here: the thresholds are made from it, so a tired 9 V battery would shift the scale.''',
    '''Three <b>LM339</b> across the gap, notch left: <b>U1</b> columns 4–10, <b>U2</b> 13–19, <b>U3</b> 22–28. Each one: pin 3 (VCC, 3rd bottom pin) → bottom +: <b>j6, j15, j24</b>. Pin 12 (GND, 3rd top pin) → top −: <b>a6, a15, a24</b>.''',
    '''<b>LM35DZ</b> in the top half, flat side facing you: <b>c43</b> (+Vs), <b>c44</b> (Vout), <b>c45</b> (GND). <b>a43</b> → top +, <b>a45</b> → top −.''',
    '''The <b>temperature signal</b> goes to all ten "−" inputs (yellow jumpers, in this order): <b>b44→g25</b>, <b>h25→h27</b> (U3), <b>i27→d19</b>, <b>c19→c17</b>, <b>b17→g18</b>, <b>h18→h16</b> (U2), <b>i16→d10</b>, <b>c10→c8</b>, <b>b8→g9</b>, <b>h9→h7</b> (U1).''',
    '''The <b>ladder</b> (10 thresholds, 20 mV = 2 °C apart): nine <b>100 Ω</b> in a chain, columns 32→41, alternating rows: h32–h33, i33–i34, h34–h35, i35–i36, h36–h37, i37–i38, h38–h39, i39–i40, h40–h41. Bottom end: <b>470 Ω</b> j32–j30 + <b>330 Ω</b> i30 → bottom −. Top end: <b>10 kΩ</b> j41–j44, <b>10 kΩ</b> i44–i46, <b>10 kΩ trimmer</b> in g46–g48, wiper <b>j47</b> → bottom +.''',
    '''Ladder taps to the ten "+" inputs (blue jumpers): <b>g32→i8</b>, <b>g33→i10</b>, <b>g34→b9</b>, <b>g35→b7</b> (U1), <b>g36→i17</b>, <b>g37→i19</b>, <b>g38→b18</b>, <b>g39→b16</b> (U2), <b>g40→i26</b>, <b>g41→i28</b> (U3).''',
    '''<b>DC10G</b> bar graph across the gap, columns <b>50–59</b>, pin 1 (marked corner) bottom-left: bottom row = anodes 1–10, top row = cathodes. <b>Resistor network 8 × 470 Ω</b> (common point) in row j, columns <b>49–57</b>, with the <b>dotted pin 1 (common) in j49</b>: its 8 resistors land straight in the anode columns of segments 1–8, no jumper needed. Jumper <b>i49</b> → bottom +. Segments 9 and 10: two ordinary <b>470 Ω</b>, j58 → bottom + and j59 → bottom +. <b>Quick test</b>: touch a top pin (e.g. a50) with a jumper to −: that segment lights.''',
    '''Comparator outputs to the bar's cathodes (green jumpers): <b>i5→a50</b>, <b>i4→a51</b>, <b>b4→a52</b>, <b>b5→a53</b> (U1), <b>i14→a54</b>, <b>i13→a55</b>, <b>b13→a56</b>, <b>b14→a57</b> (U2), <b>i23→a58</b>, <b>i22→a59</b> (U3).''',
    '''Plug the USB. Calibrate with the trimmer: segments light at <b>16, 18, 20 … 34 °C</b>, so at 21 °C you want 3 segments. With a multimeter: <b>0.160 V</b> on g32 (or 0.340 V on g41). Pinch the LM35: the bar grows.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Finer or coarser scale', '''Turn the trimmer: less current = smaller steps (≈ 1.6 °C per segment, 13–28 °C); more current = bigger steps (≈ 2.5 °C, 20–43 °C). Re-check with a known temperature.'''),
    ('Battery level meter', '''Unplug the LM35 signal (b44) and feed the "−" inputs from a divider on a battery (two 10 kΩ): the bar shows how full it is.'''),
    ('Add hysteresis', '''1 MΩ from U1 pin 2 (output 1) to pin 5 (its + input): segment 1 now switches on and off cleanly, no flicker.'''),
    ('With an LM3914 instead', '''One chip (€9.90) contains the 10 comparators, the ladder, a reference and the LED current limit: 3 jumpers instead of 30. See the <a class="navlink" href="#chips">Microchips</a> page.'''),
    ('Use the 2 spare comparators', '''U3 still has 2 free comparators: add two more segments (individual LEDs + 470 Ω) at 36 and 38 °C by extending the ladder with two 100 Ω.'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
