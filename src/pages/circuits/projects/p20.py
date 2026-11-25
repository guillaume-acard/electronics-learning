# Project 20 · 🌡️ Sensors & detectors   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p20'
NUM = '20'
TITLE = 'Digital thermometer (LM35 + Arduino)'
MENU = 'Thermometer'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Real parts</span> The room temperature in big red digits. An <b>LM35 temperature module</b> gives 10 mV per °C, the Arduino measures it and shows it on the two <b>SC39-11SURKWA</b> displays. The whole display side is the same wiring as the <a class="navlink" href="#p12">digital dice</a>: only the sensor and the code change.</p>
  <div class="controls"><button class="big" id="thHot">🤏 Hold to warm the sensor</button><label class="slider"><input type="checkbox" id="thRef" checked> 1.1 V reference</label><label class="slider"><input type="checkbox" id="thAvg" checked> average 20 readings</label></div>
  <canvas id="m20" width="800" height="425"></canvas>
  <p class="hint">Hold the button to "pinch" the sensor and watch the chain: temperature → LM35 voltage → ADC number → °C → digits. Untick the two boxes to see why the code uses the 1.1 V reference and averaging.</p>
  <h3>Wiring summary</h3>
  <table>
    <tr><td>Part</td><td>Goes to</td></tr>
    <tr><td>Displays, 8 × 330 Ω, 2 × BC547, 2 × 1 kΩ</td><td>Exactly as in <a class="navlink" href="#p12">project 12</a> (D2–D9 segments, D10/D11 digit transistors). No button this time.</td></tr>
    <tr><td>LM35 module <b>Vcc</b> / <b>Gnd</b></td><td>Arduino <b>5V</b> / <b>GND</b> (through the breadboard rails).</td></tr>
    <tr><td>LM35 module <b>S</b></td><td>Arduino <b>A0</b>.</td></tr>
  </table>
  <h3>Arduino code</h3>
  <pre class="code"><code>// Digital thermometer: LM35 module + 2 × SC39-11SURKWA (same wiring as the dice, project 12)
const byte SEG[8]   = {2, 3, 4, 5, 6, 7, 8, 9};  // a b c d e f g dp (each via 330 Ω)
const byte DIGIT[2] = {10, 11};                  // → 1 kΩ → BC547 base, collector = display COM
const byte SENSOR   = A0;                        // LM35 module "S" pin: 10 mV per °C
const byte FONT[11] = {0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F, 0x00}; // 0–9, 10 = blank
byte value[2] = {10, 0};

void showDigit(byte d, byte n) {
  for (byte s = 0; s &lt; 8; s++) digitalWrite(SEG[s], bitRead(FONT[n], s));
  digitalWrite(DIGIT[d], HIGH);   // transistor ON → this display lights
  delay(4);
  digitalWrite(DIGIT[d], LOW);    // OFF before changing the segments
}

void refresh(unsigned long ms) {  // keep both displays lit for ms milliseconds
  unsigned long start = millis();
  while (millis() - start &lt; ms) { showDigit(0, value[0]); showDigit(1, value[1]); }
}

float readTemp() {
  long sum = 0;
  for (int i = 0; i &lt; 20; i++) sum += analogRead(SENSOR);  // average 20 readings: steadier
  float volts = sum / 20.0 * 1.1 / 1023.0;                 // 1.1 V internal reference
  return volts * 100.0;                                    // 10 mV per °C → °C
}

void setup() {
  for (byte s = 0; s &lt; 8; s++) pinMode(SEG[s], OUTPUT);
  for (byte d = 0; d &lt; 2; d++) pinMode(DIGIT[d], OUTPUT);
  analogReference(INTERNAL);      // measure 0–1.1 V instead of 0–5 V: 0.1 °C steps
  analogRead(SENSOR);             // the first reading after switching is junk
}

void loop() {
  static unsigned long last = 0;
  if (millis() - last &gt; 500) {    // a new measurement twice per second
    last = millis();
    int t = constrain((int)(readTemp() + 0.5), 0, 99);   // round to whole degrees
    value[0] = (t &lt; 10) ? 10 : t / 10;                    // tens (blank if 0)
    value[1] = t % 10;                                     // units
  }
  refresh(20);
}</code></pre>'''
# "You need" list
NEED = [
    'LM35 temperature module ST039 (Gotronic 35208)',
    'Arduino Uno or compatible (e.g. Joy-It ONE-C) + USB cable',
    '2 × SC39-11SURKWA (Gotronic 03099)',
    '8 × 330 Ω, 2 × 1 kΩ, 2 × BC547B',
    'Breadboard + jumper wires (3 female-male for the module)',
]
# "How it works" paragraphs
HOW = [
    '''The <b>LM35</b> is a chip that gives a voltage proportional to temperature: exactly <b>10 mV per °C</b>. At 23 °C its S pin sits at 0.23 V. The module just puts it on a small board with 3 pins.''',
    '''The Arduino's <b>A0</b> pin contains an <b>analog-to-digital converter</b> (ADC): it compares the voltage with a reference and gives a number from 0 to 1023. With the normal 5 V reference, one step is 4.9 mV, so ~0.5 °C. The code switches to the chip's internal <b>1.1 V reference</b>: one step is 1.07 mV, about <b>0.1 °C</b>, and 0–110 °C still fits.''',
    '''<b>Water analogy:</b> the ADC is a measuring jug with 1024 marks. A 5 V jug for a few drops of water (0.23 V) is hard to read; the small 1.1 V jug has its marks much closer together.''',
    '''Then it's the same as the dice: 20 readings are averaged (less jitter), converted to °C, rounded, split into tens and units, and shown on the two displays with <b>multiplexing</b> (each one lit 4 ms at a time, too fast for your eye).''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = '''Follow the steps in order and tick each one. Wire with the USB <b>unplugged</b>, and plug it in <b>last</b>. Steps 1–8 are the same as the dice: if it's still on your board, jump to step 9.'''
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''USB <b>unplugged</b>. Link the − rails (top ↔ bottom). Arduino <b>GND</b> → bottom <b>−</b> rail.''',
    '''Display 1 (tens) across the gap, decimal point bottom-right, columns <b>20–24</b> (pins 1–5 bottom row left→right, pins 10–6 top row left→right). Display 2 (units) the same way in columns <b>30–34</b>.''',
    '''Link the matching segment pins of the two displays: top <b>a20→a30, b21→b31, a23→a33, b24→b34</b>; bottom <b>j20→j30, i21→i31, j23→j33, i24→i34</b>. <b>Not</b> columns 22/32 (COM).''',
    '''Top-half segments (a, b, f, g): Arduino wire → row a, <b>330 Ω</b> in row b, jumper from row c to the display pin. D2→<b>a2</b>, 330 Ω <b>b2→b5</b>, <b>c5→d23</b> (a). D3→<b>a6</b>, <b>b6→b9</b>, <b>c9→d24</b> (b). D7→<b>a10</b>, <b>b10→b13</b>, <b>c13→d21</b> (f). D8→<b>a14</b>, <b>b14→b17</b>, <b>c17→d20</b> (g).''',
    '''Bottom-half segments (e, d, c, dp): D6→<b>j2</b>, 330 Ω <b>i2→i5</b>, <b>h5→h20</b> (e). D5→<b>j6</b>, <b>i6→i9</b>, <b>h9→h21</b> (d). D4→<b>j10</b>, <b>i10→i13</b>, <b>h13→h23</b> (c). D9→<b>j14</b>, <b>i14→i17</b>, <b>h17→h24</b> (dp).''',
    '''Transistors (flat side facing you, C B E): #1 in <b>c45 c46 c47</b>, #2 in <b>c50 c51 c52</b>. Emitters: <b>a47</b> and <b>a52</b> → top − rail.''',
    '''COM: <b>i22</b> (display 1 pin 3) → <b>e45</b> (collector #1). <b>i32</b> (display 2 pin 3) → <b>e50</b> (collector #2).''',
    '''Bases: Arduino <b>D10</b> → <b>a40</b>, 1 kΩ <b>b40→b46</b>. <b>D11</b> → <b>a42</b>, 1 kΩ <b>d42→d51</b>.''',
    '''The sensor: Arduino <b>5V</b> → top <b>+</b> rail (tp55). LM35 module (3 female-male jumpers): <b>Vcc</b> → top + rail, <b>Gnd</b> → top − rail, <b>S</b> → <b>a56</b>. Arduino <b>A0</b> → <b>b56</b>. Plug in USB, upload the code: the room temperature appears. Pinch the sensor between your fingers and watch it climb!''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Show tenths: "23.5" style with the decimal point', '''Show <code>t/10</code> on display 1 <b>with dp</b> (bit 7 of FONT) and the first decimal on display 2: 0.0–9.9 … or keep 2 digits and switch to tenths below 10 °C.'''),
    ('Remove <code>analogReference(INTERNAL)</code>', '''Back to the 5 V reference: the reading jumps in ~0.5 °C steps and the display flickers between two values.'''),
    ('Average 1 reading instead of 20', 'The last digit jitters: real signals are noisy.'),
    ('Add the passive buzzer on D12 (via 100 Ω)', '''An alarm: <code>if (t &gt; 30) tone(12, 2000, 100);</code> beeps when it gets hot.'''),
    ('Fahrenheit', '<code>f = c * 9 / 5 + 32</code>: shows 73 for 23 °C.'),
    ('The bare LM35DZ chip instead of the module', '''Same thing for €2.50: flat side facing you, pins +Vs, Vout, GND (left to right).'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
