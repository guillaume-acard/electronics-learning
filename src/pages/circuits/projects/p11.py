# Project 11 · 🔊 Sound & music   (rendered by pages/circuits/page.py; order and theme: themes.py)
ID = 'p11'
NUM = '11'
TITLE = 'Buzzer: make some noise'
MENU = 'Buzzer'
# the top of the section: intro, demo controls and canvas (free HTML)
TOP = '''<p><span class="qtopic">Sound</span> Beeps for alarms, timers and "button pressed" feedback. There are two kinds of buzzer, and mixing them up is the most common beginner surprise.</p>
  <table>
    <tr><td></td><td><b>Active buzzer</b></td><td><b>Passive buzzer / piezo</b></td></tr>
    <tr><td>Inside</td><td>A tiny <b>oscillator</b> (like a mini 555) + the sound disc</td><td>Just the sound disc (piezo) or a small coil + membrane</td></tr>
    <tr><td>Give it steady DC (a battery)</td><td>✓ It <b>beeps</b> by itself, always at the same pitch (~2–3 kHz)</td><td>✗ Only a <b>click</b> when you connect and disconnect</td></tr>
    <tr><td>Give it a square wave</td><td>Works, but it's not useful (it already makes its own tone)</td><td>✓ It plays <b>that frequency</b>, so you can make melodies</td></tr>
    <tr><td>How to recognise it</td><td>Often taller, sealed black bottom, a "+" sticker or mark</td><td>Often flatter, green circuit board visible underneath</td></tr>
    <tr><td>Polarity</td><td><b>Yes</b>: + (long leg) to +</td><td>Piezo: no. Magnetic type: usually marked</td></tr>
  </table>
  <p class="mt-m"><b>Water analogy:</b> a piezo disc is a <b>flexible membrane</b>. Push water on it once and it bends once (a click). Push it back and forth 2,000 times a second and it vibrates the air: a tone. The active buzzer has its own little pump that does the back-and-forth for you.</p>
  <div class="controls"><span class="hint">Buzzer:</span><span id="bzType"></span></div>
  <div class="controls"><span class="hint">Driven by:</span><span id="bzDrv"></span></div>
  <div class="controls"><x-slider id="bzF" min="2.4" max="3.7" step="0.01" value="3" grow="1">Pitch (555 pot R2 / Arduino frequency)</x-slider><b id="bzFt" style="min-width:80px"></b>
    <button class="go" id="bzBtn">👆 Hold to sound 🔊</button></div>
  <canvas id="cp11" width="800" height="290"></canvas>
  <p class="hint">Hold the button to hear it (your device volume must be on). Try a passive buzzer on a plain button: just a click. Then drive it with the 555 and turn the pitch knob.</p>
  <h3>Arduino version</h3>
<pre class="code"><code>// Passive buzzer on pin 8 (via 100 Ω, or a BC547 driver for a louder magnetic buzzer)
void setup() {}
void loop() {
  tone(8, 1000, 200);  delay(300);   // 1 kHz beep for 200 ms
  tone(8, 1500, 200);  delay(300);   // higher beep
  noTone(8);           delay(1000);
}
// Active buzzer: just digitalWrite(8, HIGH) to beep, LOW to stop.</code></pre>'''
# "You need" list
NEED = [
    '1 active buzzer (5 V) + 1 passive buzzer or piezo disc',
    '9 V battery or 5 V supply, push button',
    '''For the tone: NE555, R1 1 kΩ, 47 kΩ potentiometer (R2) + 1 kΩ in series, C 47 nF, 10 µF to the buzzer''',
    '''(Louder / from Arduino) BC547 + 1 kΩ, and a 1N4007 if it's a <b>magnetic</b> buzzer (it's a coil!)''',
]
# "How it works" paragraphs
HOW = [
    '''<b>Active buzzer:</b> it contains its own oscillator, so steady DC is enough. The button simply turns its power on.''',
    '''<b>Passive buzzer:</b> it is just a membrane that flexes when the voltage changes. It needs a square wave. The 555 makes one (same circuit as the blinker, but with a <b>47 nF</b> capacitor, so it oscillates ~1,000 times faster: an audible tone).''',
    '''The <b>10 µF</b> in series lets the wave through but blocks the DC, so the buzzer only sees the back-and-forth part.''',
]
# optional extra HTML after "How it works"
EXTRA = ''
# wiring hint (None = the standard one)
WIRING = None
# numbered wiring steps (ticked by the reader)
STEPS = [
    '''<b>Active (module GT1143):</b> SD80A power module at the left end, set to 5 V, switched off.''',
    '''Button across the gap at columns <b>8–10</b>, jumper top + → <b>a8</b>. Module <b>+</b> → top +, <b>−</b> → top −, <b>S</b> → <b>j10</b> (button's other side).''',
    'Switch the power on and press: beep!',
    '''<b>Passive (with the 555):</b> remove the power module and buzzer module. Build project 8's 555 circuit (same holes), but with <b>C = 47 nF</b> in <b>i21</b>, and R2 = the <b>47 kΩ trimmer</b> plus a 1 kΩ in series.''',
    '''Output: <b>10 µF</b> long leg in <b>h22</b> (pin 3), other leg in <b>h28</b>. Passive buzzer from <b>g28</b> to <b>g31</b>, jumper <b>j31</b> → bottom −.''',
    '''Connect the 9 V battery (red → top +, black → top −). Turn the trimmer to change the pitch.''',
]
# "Variants to try": (name, what to do)
VARIANTS = [
    ('Passive buzzer on a plain battery + button', '''Only a "tick" when pressing and releasing: it needs a changing push, like a capacitor or speaker.'''),
    ('Turn the 555 pot', '''The pitch slides up and down. Make a siren by turning it back and forth.'''),
    ('Change C: 47 nF → 4.7 nF', '''10× higher pitch (towards 10 kHz: shrill!). 470 nF gives a low growl.'''),
    ('Active buzzer driven by the 555 blinker (C = 10 µF)', '''Beep… beep… beep: an alarm pattern. The 555 switches the buzzer's power on and off.'''),
    ('Find the loudest pitch', '''Piezos have a resonance (often 2–4 kHz) where they're much louder, like a wine glass ringing.'''),
]
# optional HTML at the very end (warnings)
AFTER = ''
