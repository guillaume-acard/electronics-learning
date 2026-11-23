# Project A · 🏠 Real-life builds   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'rl1'
NUM = 'A'
TITLE = 'Real life: a rechargeable battery charger (Li-ion 18650)'
MENU = 'Battery charger'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Real life</span> Charge a lithium-ion cell safely from USB, like inside a power bank, torch or Bluetooth speaker.</p>
  <p><b>How lithium charging works: CC then CV.</b></p>
  <ol>
    <li><b>Constant Current (CC):</b> the charger pushes a fixed current (e.g. 1 A) while the battery voltage slowly rises from ~3.0 V towards 4.2 V. This fills about 70–80% of the battery.</li>
    <li><b>Constant Voltage (CV):</b> at <b>4.2 V</b> the charger holds the voltage exactly there, and the current <b>fades away</b> as the battery tops up, just like a capacitor filling.</li>
    <li><b>Done:</b> when the current drops to ~10% (e.g. 100 mA), the charger stops. Going above 4.2 V damages Li-ion cells and can make them catch fire, so the chip watches it precisely.</li>
  </ol>
  <p>The <b>TP4056</b> chip does all of this. The cheap blue modules also include a <b>protection chip</b> (DW01 + a MOSFET pair) that cuts the battery off if it's over-discharged (&lt; 2.5 V), over-charged or short-circuited.</p>
  <div class="controls"><button id="bcGo" class="active">▶ Plug in USB</button><span id="bcChoices"></span><x-slider id="bcSp" min="1" max="40" step="1" value="12">Speed</x-slider></div>
  <canvas id="cBat" width="800" height="330"></canvas>'''
# "You need" list
NEED = [
    'TP4056 charger module (Gotronic GT060)',
    'BMS 1S protection board (B+, B−, P+, P−)',
    '18650 Li-ion cell (65 mm) + holder with wires',
    'USB cable / 5 V phone charger',
    '''A switch + a load to test (LED + 100 Ω, or a 5 V boost module for a power bank)''',
    'Multimeter',
]
# "How it works" paragraphs
HOW = [
    '''The <b>TP4056</b> takes 5 V from USB and charges the cell in two phases. First <b>constant current</b> (1 A) while the cell voltage rises, then <b>constant voltage</b> (exactly 4.2 V) while the current fades. It stops at about 100 mA.''',
    '''The <b>BMS</b> sits between the cell and everything else. It contains a tiny chip and two MOSFET switches that disconnect the cell if it's over-charged, over-discharged (below ~2.5 V) or short-circuited.''',
    '''The charger and the load both connect to the BMS's <b>P+ / P−</b> side, so they're always protected. The cell itself only touches <b>B+ / B−</b>.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = None
# numbered wiring steps (ticked by the reader)
STEPS = [
    'Work with <b>no cell in the holder</b> and USB unplugged.',
    '''Solder the holder's <b>red</b> wire to BMS <b>B+</b> and the <b>black</b> wire to BMS <b>B−</b>.''',
    '''Solder two wires from the charger's battery pads (<b>B+ / B−</b>, sometimes <b>BAT+ / BAT−</b>) to BMS <b>P+ / P−</b>.''',
    '''Solder your load (switch + LED with 100 Ω, or a 5 V boost module) to <b>P+ / P−</b> too.''',
    '''Check with a multimeter: no short between P+ and P−, and the polarity is correct everywhere.''',
    '''Insert the 18650 cell, <b>+ end</b> to the holder's + mark. Check with the meter: ~3–4 V on P+/P−.''',
    '''Plug in USB: red LED = charging, blue LED = full. Feel the chip: warm is normal, too hot to touch means unplug.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Measure the battery voltage every 15 min', '''It rises quickly to ~3.9 V, then slowly to 4.2 V, and stays there (CV phase).'''),
    ('Measure the charge current (meter in series on B+)', '~1 A flat, then it fades in the last part: CC → CV.'),
    ('Change R<sub>PROG</sub> on the module (1.2 kΩ → 2.4 kΩ)', '''1 A → 0.5 A: twice as slow, gentler for small cells. I ≈ 1200 ÷ R<sub>PROG</sub> amps.'''),
    ('Feel the chip after 10 min', '''Warm: it burns (5 V − battery voltage) × current as heat, like the 7805.'''),
]
# optional HTML at the very end (warnings)
AFTER = '''<p class="warn"><b>⚠️ Li-ion safety:</b> never short-circuit a cell, never charge one that is swollen, dented or very hot, never charge above 4.2 V, and don't leave charging unattended at first. Use a module <b>with protection</b>. <i>Easier alternative:</i> NiMH AA cells charged with a constant current from an <b>LM317</b> (R = 1.25 V ÷ current, e.g. 6.2 Ω → 200 mA) and a timer.</p>'''
