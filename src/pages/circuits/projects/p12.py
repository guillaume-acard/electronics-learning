# Project 12 · 🎲 Dice & counters   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p12'
NUM = '12'
TITLE = 'Digital dice with two 7-segment displays'
MENU = 'Digital dice (Arduino)'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Real parts</span> Press a button: the two displays spin through random numbers, slow down and stop on two dice values, like rolling two real dice. It uses two <b>Kingbright SC39-11SURKWA</b> displays (see <a class="navlink" href="#parts">Using real parts</a>), an Arduino and the <b>multiplexing</b> trick: both displays share the same 8 segment wires, and two transistors switch them on one at a time, very fast.</p>
  <div class="controls"><button id="dcRoll" class="active big">🎲 Roll!</button><span class="hint">Mode:</span><span id="dcMode"></span><label class="slider"><input type="checkbox" id="dcSlow"> slow-motion multiplexing</label></div>
  <canvas id="cdice" width="800" height="335"></canvas>
  <p class="hint">Tick <b>slow-motion multiplexing</b> to see the secret: only <b>one</b> display is ever lit at a time. The Arduino swaps between them every 4 ms, which is far too fast for your eye.</p>
  <h3>Schematic</h3>
  <canvas id="cp12" width="800" height="385"></canvas>
  <table>
    <tr><td>Arduino pin</td><td>Goes to</td></tr>
    <tr><td>D2 … D9</td><td>Through a <b>330 Ω</b> resistor each, to segments <b>a b c d e f g dp</b>, i.e. display pins <b>7 6 4 2 1 9 10 5</b>. Wire the same pin of <b>both</b> displays together.</td></tr>
    <tr><td>D10, D11</td><td>Through <b>1 kΩ</b> to the base of BC547 #1 / #2. Each collector goes to the <b>COM</b> (pin 3 or 8) of display 1 / 2, and each emitter to <b>GND</b>.</td></tr>
    <tr><td>D12</td><td>Push button to <b>GND</b> (the code turns on the internal pull-up, so no resistor is needed).</td></tr>
    <tr><td>A0</td><td>Leave it <b>unconnected</b>: its random noise seeds the random-number generator.</td></tr>
  </table>
  <h3>Arduino code</h3>
<pre class="code"><code>// Digital dice: 2 × Kingbright SC39-11SURKWA (common cathode), multiplexed
const byte SEG[8]   = {2, 3, 4, 5, 6, 7, 8, 9};  // a b c d e f g dp (each via 330 Ω)
const byte DIGIT[2] = {10, 11};                  // → 1 kΩ → BC547 base, collector = display COM
const byte BUTTON   = 12;                        // push button to GND
const byte FONT[10] = {0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F}; // bit0 = a … bit6 = g
byte value[2] = {6, 6};

void showDigit(byte d, byte n) {
  for (byte s = 0; s < 8; s++) digitalWrite(SEG[s], bitRead(FONT[n], s));
  digitalWrite(DIGIT[d], HIGH);    // transistor ON → this display lights
  delay(4);
  digitalWrite(DIGIT[d], LOW);     // OFF before changing the segments (no "ghosting")
}

void refresh(unsigned long ms) {   // keep both displays lit for ms milliseconds
  unsigned long start = millis();
  while (millis() - start < ms) { showDigit(0, value[0]); showDigit(1, value[1]); }
}

void setup() {
  for (byte s = 0; s < 8; s++) pinMode(SEG[s], OUTPUT);
  for (byte d = 0; d < 2; d++) pinMode(DIGIT[d], OUTPUT);
  pinMode(BUTTON, INPUT_PULLUP);
  randomSeed(analogRead(A0));      // unconnected pin = random noise
}

void loop() {
  if (digitalRead(BUTTON) == LOW) {                 // button pressed: roll!
    for (int wait = 20; wait < 260; wait += 15) {   // spins fast, then slows down
      value[0] = random(1, 7);                      // 1 … 6
      value[1] = random(1, 7);
      refresh(wait);
    }
  }
  refresh(20);
}</code></pre>'''
# "You need" list
NEED = [
    '2 × Kingbright SC39-11SURKWA (Gotronic 03099)',
    'Arduino Uno or compatible (e.g. Joy-It ONE-C)',
    '8 × 330 Ω (segments), 2 × 1 kΩ (bases)',
    '2 × BC547B transistors',
    '1 push button, breadboard + jumper wires',
]
# "How it works" paragraphs
HOW = [
    '''The two displays share the same 8 segment wires, so the Arduino can't light them both with different numbers at the same moment. Instead it shows display 1 for 4 ms, then display 2 for 4 ms, again and again. Your eye blends it into two steady numbers: <b>multiplexing</b>.''',
    '''Each display's COM (the shared cathode) goes to ground through its own <b>BC547</b>. The Arduino turns one transistor on at a time (D10 or D11). The transistors carry the whole digit's current (up to 8 × 9 mA), which a single Arduino pin couldn't.''',
    '''When you press the button (D12, internal pull-up so it reads LOW when pressed), the code picks random numbers faster at first, then slower, until it stops: like a real die rolling to a stop.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = None
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''USB <b>unplugged</b>. Link the − rails (top ↔ bottom). Arduino <b>GND</b> → bottom <b>−</b> rail.''',
    '''Display 1 across the gap, decimal point bottom-right, columns <b>20–24</b> (pins 1–5 bottom row left→right, pins 10–6 top row left→right). Display 2 the same way in columns <b>30–34</b>.''',
    '''Link the matching segment pins of the two displays: top <b>a20→a30, b21→b31, a23→a33, b24→b34</b>; bottom <b>j20→j30, i21→i31, j23→j33, i24→i34</b>. <b>Not</b> columns 22/32 (COM).''',
    '''Top-half segments (a, b, f, g): Arduino wire → row a, <b>330 Ω</b> in row b, jumper from row c to the display pin. D2→<b>a2</b>, 330 Ω <b>b2→b5</b>, <b>c5→d23</b> (a). D3→<b>a6</b>, <b>b6→b9</b>, <b>c9→d24</b> (b). D7→<b>a10</b>, <b>b10→b13</b>, <b>c13→d21</b> (f). D8→<b>a14</b>, <b>b14→b17</b>, <b>c17→d20</b> (g).''',
    '''Bottom-half segments (e, d, c, dp): D6→<b>j2</b>, 330 Ω <b>i2→i5</b>, <b>h5→h20</b> (e). D5→<b>j6</b>, <b>i6→i9</b>, <b>h9→h21</b> (d). D4→<b>j10</b>, <b>i10→i13</b>, <b>h13→h23</b> (c). D9→<b>j14</b>, <b>i14→i17</b>, <b>h17→h24</b> (dp).''',
    '''Transistors (flat side facing you, C B E): #1 in <b>c45 c46 c47</b>, #2 in <b>c50 c51 c52</b>. Emitters: <b>a47</b> and <b>a52</b> → top − rail.''',
    '''COM: <b>i22</b> (display 1 pin 3) → <b>e45</b> (collector #1). <b>i32</b> (display 2 pin 3) → <b>e50</b> (collector #2).''',
    '''Bases: Arduino <b>D10</b> → <b>a40</b>, 1 kΩ <b>b40→b46</b>. <b>D11</b> → <b>a42</b>, 1 kΩ <b>d42→d51</b>.''',
    '''Button across the gap at columns <b>56–58</b>: Arduino <b>D12</b> → <b>a56</b>, jumper <b>j58</b> → bottom −. Plug in USB, upload the code and press!''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Change <code>delay(4)</code> to <code>delay(200)</code>', '''You see the displays take turns: multiplexing in slow motion.'''),
    ('One die only: set <code>value[0]</code> to blank', 'Add a blank code to FONT (0x00) and show it on display 1.'),
    ('''A 2–12 roll: show <code>value[0] + value[1]</code> on both digits''', '''Tens on the left, units on the right: a "two-dice total" display.'''),
    ('Light the decimal point while rolling', 'Set bit 7 (dp) in the FONT value during the animation.'),
    ('220 Ω instead of 330 Ω', '''Brighter. Each digit is only on half the time, so short peaks of ~14 mA are fine (the datasheet allows 185 mA pulses).'''),
    ('Remove the transistors and drive COM straight from D10/D11', '''Dimmer and risky: one pin would sink up to 8 segments × 9 mA = 72 mA, way over the ~20–40 mA an Arduino pin can handle.'''),
    ('Going further, without Arduino', '''555 clock (fast while the button is held) → CD4510 counter → CD4511 decoder → display. A great challenge using the chips from the Microchips page.'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
