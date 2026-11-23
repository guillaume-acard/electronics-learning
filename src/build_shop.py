import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))) if os.path.basename(os.path.dirname(os.path.abspath(__file__))) in ('generators','legacy') else os.path.dirname(os.path.abspath(__file__)))
from paths import SRC, PAGES, SITE
import json
G='https://www.gotronic.fr/'
# (group, name, code, unit_price, qty, url, used_in, note, optional)
I=[
('Base','Breadboard kit SD80A: 840-contact board + 65 M/M jumpers + 3.3/5 V power module (USB or 6–12 V jack)','12334',9.50,1,G+'art-kit-plaque-de-montage-sd80a-25864.htm','All','The power module gives a clean 5 V from USB.',False),
('Base','9 V battery snap connector (éco, I-type)','09570',0.30,1,G+'art-connecteur-eco-9v-en-i-5696.htm','1–8, 10, 11','One battery at a time. Buy the 9 V batteries themselves anywhere.',False),
('Resistors','Pack of 10 resistors 1/4 W, 10 Ω','04012',0.20,1,G+'art-10-resistances-1-4w-10-8486-2555.htm','10 (Zobel)','',False),
('Resistors','Pack of 10 resistors 1/4 W, 100 Ω','04024',0.20,1,G+'art-10-resistances-1-4w-100-8486-2565.htm','11 (buzzer from Arduino), 21 (ladder: 9)','',False),
('Resistors','Pack of 10 resistors 1/4 W, 220 Ω','04028',0.20,1,G+'art-10-resistances-1-4w-220-8486-2568.htm','1, 2','',False),
('Resistors','Pack of 10 resistors 1/4 W, 330 Ω','04030',0.20,1,G+'art-10-resistances-1-4w-330-8486-2570.htm','12 (dice), Real parts (7-seg on 5 V)','',False),
('Resistors','Pack of 10 resistors 1/4 W, 470 Ω','04032',0.20,1,G+'art-10-resistances-1-4w-470-8486-2571.htm','1, 2, 4, 5, 7, 8, 9, 21','Most used value (4 in the LED-dot dice).',False),
('Resistors','Pack of 10 resistors 1/4 W, 1 kΩ','04036',0.20,2,G+'art-10-resistances-1-4w-1-0k-8486-2574.htm','1, 3, 5, 7, 8, 11, 15, 19, B','15 needed for the 00–99 counter.',False),
('Resistors','Pack of 10 resistors 1/4 W, 2.2 kΩ','04040',0.20,1,G+'art-10-resistances-1-4w-2-2k-8486-126.htm','LED tests, Ruby LED','',False),
('Resistors','Pack of 10 resistors 1/4 W, 4.7 kΩ','04044',0.20,1,G+'art-10-resistances-1-4w-4-7k-8486-300.htm','Divider tests','',False),
('Resistors','Pack of 10 resistors 1/4 W, 10 kΩ','04048',0.20,1,G+'art-10-resistances-1-4w-10k-8486-19.htm','1, 8, B, pull-ups','',False),
('Resistors','Pack of 10 resistors 1/4 W, 47 kΩ','04056',0.20,1,G+'art-10-resistances-1-4w-47k-8486-2588.htm','8 (R2), night-light divider','',False),
('Resistors','Pack of 10 resistors 1/4 W, 1 MΩ','04072',0.20,1,G+'art-10-resistances-1-4w-1-0m-8486-2602.htm','B (hysteresis), touch switch','',False),
('Resistors','Pack of 10 resistors 1/4 W, 33 kΩ','04054',0.20,1,G+'cat-resistances-au-carbone-1-4w-402.htm','18 (fuzz)','',False),
('Resistors','Pack of 10 resistors 1/4 W, 100 kΩ','04060',0.20,1,G+'art-10-resistances-1-4w-100k-8486-20.htm','18 (fuzz feedback), 26 (quartz)','',False),
('Resistors','Vertical trimmer potentiometer 10 kΩ','04616',0.25,1,G+'art-ajustable-vertical-10k-8486-3088.htm','10 (volume), B (threshold), divider','Breadboard-friendly.',False),
('Resistors','Vertical trimmer potentiometer 47 kΩ','04618',0.25,1,G+'art-ajustable-vertical-47k-8486-3090.htm','8, 11 (555 speed / pitch)','',False),
('Resistors','Resistor network 8 × 470 Ω, common point (SIL 9 pins)','04482',0.35,1,G+'art-reseau-de-8-x-470-8486-point-commun-2965.htm','21 (bar thermometer: segments 1–8)','Pin 1 (dot) = common, goes to +5 V.',False),
('Resistors','Resistor network 4 × 470 Ω, common point (SIL 5 pins)','15882',0.30,1,G+'art-reseau-de-4-x-470-8486-point-commun-8731.htm','13 (LED-dot dice), variant','Replaces the four 470 Ω.',True),
('Resistors','Resistor network 4 × 2.2 kΩ, isolated (SIL 8 pins)','15864',0.12,2,G+'art-reseau-de-4-x-2-2k-8486-independantes-8721.htm','14 (7-seg matrix dice), variant','Replaces the seven 2.2 kΩ.',True),
('Resistors','Resistor network 4 × 1 kΩ, isolated (SIL 8 pins)','15863',0.30,4,G+'art-reseau-de-4-x-1-0k-8486-independantes-8720.htm','15, 19 (7-seg displays), variant','2 per digit: 4 for the 00–99 counter.',True),
('Capacitors','Electrolytic 2.2 µF / 63 V','04913',0.10,1,G+'art-condensateur-radial-2-2uf-63v-109.htm','18 (fuzz input)','',False),
('Capacitors','Electrolytic 22 µF / 25 V','04922',0.10,1,G+'art-condensateur-radial-22uf-25v-284.htm','18 (fuzz)','',False),
('Capacitors','Electrolytic 10 µF / 25 V','04909',0.10,2,G+'art-condensateur-radial-10uf-25v-110.htm','8, 10, 11, 16 (flip-flop: 2), 17, 19','Two for the LED flip-flop.',False),
('Capacitors','Electrolytic 100 µF / 25 V','04935',0.20,1,G+'art-condensateur-radial-100uf-25v-3375.htm','2, 8, 10','',False),
('Capacitors','Electrolytic 220 µF / 25 V','04941',0.20,1,G+'art-condensateur-radial-220uf-25v-3380.htm','10 (speaker)','',False),
('Capacitors','Electrolytic 470 µF / 16 V','04947',0.20,1,G+'art-condensateur-radial-470uf-16v-3386.htm','2','',False),
('Capacitors','Electrolytic 1000 µF / 25 V','04953',0.40,1,G+'art-condensateur-radial-1000uf-25v-3390.htm','2, smoothing tests','',False),
('Capacitors','Ceramic 4.7 nF','04741',0.10,1,G+'art-condensateur-ceramique-4-7-nf-3205.htm','11 (high pitch)','',False),
('Capacitors','Ceramic 10 nF','04745',0.10,1,G+'art-condensateur-ceramique-10-nf-112.htm','8 (tone), 555 pin 5','',False),
('Capacitors','Ceramic 47 nF','04752',0.15,1,G+'art-condensateur-ceramique-47-nf-3212.htm','11 (buzzer tone), 10 (Zobel)','',False),
('Capacitors','Ceramic 100 nF','04755',0.20,3,G+'art-condensateur-ceramique-100-nf-3215.htm','Decoupling every chip','One per chip: 15 has 3 chips.',False),
('Semiconductors','Assortment of 50 diffused 5 mm LEDs (10 each: red, green, yellow, white, blue)','03988',4.50,1,G+'art-assortiment-de-50-leds-diffusantes-36118.htm','1–9, B','',False),
('Semiconductors','Diode 1N4007 (1 A rectifier / flyback)','02500',0.06,1,G+'art-1n4007-107.htm','3, 6, 7, B, relay','',False),
('Semiconductors','Diode 1N4148 (signal)','02524',0.06,27,G+'art-1n4148-7.htm','13–15 (dice without Arduino: 11 + 27 + 9), clipping tests','27 for the matrix dice (14), the biggest user. 13 needs 11, 15 needs 9.',False),
('Semiconductors','Transistor BC547B (NPN)','02173',0.15,4,G+'art-transistor-bc547b-1336.htm','5, 7, 11, 12, 13 (dice), B','4 for the LED-dot dice (13).',False),
('Semiconductors','Light-dependent resistor PGM1201 (4–10 kΩ at 10 lux)','03136',1.80,1,G+'art-photoresistance-pgm1201-39771.htm','B (night light)','',False),
('Chips','NE555P timer','21210',0.50,2,G+'art-ne555p-10432.htm','8, 9, 11, 17 (siren: 2), 19, 22 (IR alarm: 2)','Two needed for the police siren.',False),
('Chips','CD4017 decade counter','20277',0.85,1,G+'art-cd4017-189.htm','9 (chaser), 13–15 (dice)','',False),
('Chips','LM358N dual op-amp','21090',0.60,1,G+'art-lm358n-10314.htm','B (comparator)','',False),
('Chips','LM386N audio amplifier','21095',1.25,1,G+'art-lm386n-10319.htm','10 (mini amp)','',False),
('Chips','CD4511 BCD → 7-segment decoder','20356',1.40,2,G+'art-cd4511-319.htm','15 (dice), 19 (counter: 2), Real parts (option B)','Two for the 00–99 counter.',False),
('Chips','CD4518 dual BCD counter','20363',0.85,1,G+'art-cd4518-9963.htm','19 (counter 00–99)','',False),
('Chips','LM339N quad comparator','21087',0.70,3,G+'cat-circuits-lineaires-lm-a-lt-1319.htm','21 (bar thermometer: 3)','Three chips = 12 comparators, 10 used.',False),
('Chips','LM3914N bar-graph driver (10 LEDs)','21122',9.90,1,G+'art-lm3914n-10346.htm','21, variant (replaces the 3 LM339 + ladder)','All-in-one but expensive.',True),
('Chips','LM35DZ temperature sensor (10 mV/°C, TO-92)','21071',2.50,1,G+'art-lm35dz-10295.htm','20, 21 (thermometers)','Or reuse the LM35 module of project 20.',False),
('Chips','Bar graph DC10G, 10 green LEDs (DIL20)','03142',1.90,1,G+'art-bargraphe-10-leds-vertes-dc10g-35.htm','21 (bar thermometer)','Or 10 single LEDs from the assortment.',False),
('Chips','7-segment display SC39-11SURKWA (common cathode, red)','03099',1.90,2,G+'art-afficheur-sc39-11surkwa-40228.htm','12, 14, 15 (dice), 19 (counter), Real parts','Two needed for the Arduino dice and the counter.',False),
('Sensors','IR receiver TSOP38238, 38 kHz (pins OUT / GND / Vs, 2.5–5.5 V)','03417',0.95,1,G+'art-recepteur-infrarouge--48180.htm','22 (IR beam alarm)','Max 5.5 V: use the breadboard 5 V module, not the 9 V battery.',False),
('Sensors','IR LED TSAL6200, 940 nm, 100 mA','03458',0.35,1,G+'art-diode-emettrice-tsal6200-22603.htm','22 (IR beam alarm)','',False),
('Storage','Anti-static conductive foam MA4025, 350 × 250 × 5 mm','08203',3.85,1,G+'art-mousse-antistatique-ma4025-89.htm','Storing the chips (CD4xxx especially)','Cut it to fit a box compartment, push the chip legs in.',True),
('Timers','Quartz 32.768 kHz (watch crystal)','05220',0.60,1,G+'art-quartz-32-768khz-313.htm','26 (quartz stopwatch)','',False),
('Timers','CD4060 oscillator + 14-stage divider','20318',0.95,1,G+'art-cd4060-9931.htm','26 (quartz stopwatch)','',False),
('Timers','CD4013 dual D flip-flop','20273',0.75,1,G+'art-cd4013-9896.htm','26 (quartz stopwatch: ÷2)','',False),
('Timers','Pack of 10 resistors 1/4 W, 10 MΩ','04084',0.20,1,G+'art-10-resistances-1-4w-10m-8486-2614.htm','26 (oscillator bias)','',False),
('Timers','Ceramic capacitor 22 pF (2.54 mm pitch)','15816',0.10,2,G+'art-condensateur-ceramique-22-pf-8683.htm','26 (quartz load)','',False),
('Motors','DC motor MFA RE140/1, 3–9 V, 9200 rpm, 2 mm shaft','24851',3.90,1,G+'art-moteur-mfa-re140-1-11698.htm','23, 24 (motors)','Solder or twist short wires to its tabs.',False),
('Motors','Transistor SS8050, NPN 1.5 A (TO-92, legs E-B-C!)','43143',0.65,1,G+'cat-transistors-de-p-a-2n-1328.htm','23 (PWM speed)','The BC547 (100 mA) is too weak for a motor.',False),
('Motors','L293D dual H-bridge motor driver (diodes built in)','42327',6.90,1,G+'art-l293d-14072.htm','24 (forward/reverse)','',False),
('Switches & sound','Push button 6×6 mm KRS0611','07125',0.30,3,G+'art-bp-subminiature-krs0611-4267.htm','2, 4, 6, 7, 11, 12–15','3 for the traffic light (4).',False),
('Switches & sound','Push button with changeover contact SP86A15 (has an NC contact for STOP)','07170',2.80,1,G+'art-bouton-poussoir-sp86a15-4301.htm','Relay latch (START/STOP)','Only for the self-latching relay.',True),
('Switches & sound','Relay 5 V, 1 changeover, RWH-SS-105D (coil 70 Ω)','06400',0.95,1,G+'art-relais-5-vcc-1-rt-rwh-ss-105d-27474.htm','6 (coil kick), 7','Pins are not 2.54 mm: solder short wires to it for the breadboard.',False),
('Switches & sound','Active buzzer module 5 V GT1143','35239',2.50,1,G+'art-module-buzzer-actif-gt1143-26143.htm','11','Active: beeps on plain DC.',False),
('Switches & sound','Passive piezo buzzer PT2130PQ (needs an external oscillator)','05487',1.90,1,G+'art-buzzer-ci-3-30vdc-90db-46453.htm','11','Passive: plays the 555 / Arduino tone.',False),
('Switches & sound','Speaker HP508, 8 Ω 0.5 W, 50 mm','05518',2.80,1,G+'art-haut-parleur-hp508-3870.htm','10 (mini amp)','',False),
('Switches & sound','Female jack 6.35 mm mono TF208P (cable socket: solder 2 wires)','08453',0.80,2,G+'cat-jacks-902.htm','18 (fuzz IN and OUT)','You also need 2 ordinary guitar cables.',False),
('A. Battery charger','Li-ion charger GT060, TP4056, micro-USB, 1 A','39136',2.30,1,G+'art-module-chargeur-accu-li-47568.htm','A','Micro-USB cable not included. The page doesn\'t mention protection, hence the BMS below.',False),
('A. Battery charger','Li-ion 18650 cell 3.6 V 3500 mAh (65 mm, unprotected)','09503',9.80,1,G+'cat-accus-li-ion-18650-65-mm-2493.htm','A','65 mm long, so it fits the holder below.',False),
('A. Battery charger','18650 battery holder BH18650-1 (wire leads)','09588',1.80,1,G+'art-coupleur-d-accu-bh18650-1-5713.htm','A','For 65 mm cells only.',False),
('A. Battery charger','Protection module BMS 1S for Li-ion (overcharge, over-discharge, short circuit)','39401',3.60,1,G+'art-protection-batterie-1s-48852.htm','A','Cell on B+/B−. Charger output and load on P+/P−.',False),
('B. Night light','12 V regulated adapter PS1205S, 500 mA, 5.5×2.1 mm plug','14659',7.90,1,G+'art-adaptateur-ps1205s-31298.htm','B, 12 V relay tests','',False),
('B. Night light','Adapter PCM10F: female 5.5×2.1 jack → screw terminals','48214',1.80,1,G+'art-adaptateur-pcm10f-17984.htm','B','Brings the 12 V to your breadboard rails.',False),
('B. Night light','Relay 12 V, 1 changeover, RWH-SS-112D (coil 400 Ω)','06401',0.95,1,G+'art-relais-12-vcc-1-rt-rwh-ss-112d-27475.htm','B','',False),
('B. Night light','Bulb E10 12 V 100 mA (1.2 W)','03621',0.70,1,G+'art-ampoule-e10-e2312-100-2428.htm','B, relay demos','',False),
('B. Night light','E10 plastic lamp socket','03627',0.95,1,G+'art-douille-plastique-e10-2434.htm','B','',False),
('Optional','Arduino-compatible board Joy-It ONE-C (ATmega328PB): needed for the dice and the thermometer if you have no Arduino','38801',9.90,1,G+'art-carte-one-c-39126.htm','12 (digital dice), 20 (thermometer), Arduino versions: 7-seg, buzzer, relay','Or the official Arduino Uno R3 A000066 (code 25950, €23.90).',True),
('Optional','LM35 temperature module ST039 (10 mV/°C, 0–100 °C, pins S / Vcc / Gnd)','35208',5.60,1,G+'art-module-capteur-de-t-lm35-st039-26113.htm','20 (thermometer)','Needs the Arduino board above. The bare LM35DZ chip (21071, €2.50) works too.',True),
]
rows=json.dumps([dict(g=a,n=b,c=c,p=d,q=e,u=f,used=g,note=h,opt=i) for a,b,c,d,e,f,g,h,i in I],ensure_ascii=False)
html=f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="color-scheme" content="dark">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Shopping list · Electronics Learning</title>
<link rel="stylesheet" href="css/style.css">
<style>
  .shop td{{vertical-align:middle}} .shop td:first-child{{width:auto;font-weight:400}}
  .shop .grp td{{background:#101827;font-weight:800;color:var(--accent);padding-top:16px}}
  .shop input[type=number]{{width:52px;font:inherit;padding:4px;border-radius:6px;background:#2a3650;color:#e2e8f0;border:1px solid #2a3650}}
  .shop tr.off td{{opacity:.4}}
  .shop .code{{font-family:ui-monospace,monospace;color:#fbbf24;white-space:nowrap}}
  .shop .used{{color:var(--muted);font-size:.85rem;display:block}} .shop .note{{color:#93c5fd;font-size:.85rem;display:block}}
  .tot{{position:sticky;bottom:0;background:rgba(11,17,32,.95);backdrop-filter:blur(8px);border-top:1px solid var(--line);padding:12px 18px;display:flex;gap:14px;align-items:center;flex-wrap:wrap;justify-content:space-between;z-index:5}}
  .tot b{{font-size:1.4rem;color:#fff}}
  #copied{{color:#10b981}}
</style>
</head>
<body>
<nav class="topbar"><a href="index.html#home" class="brand">⚡ Electronics</a><div class="links"><a href="index.html#circuits">← Circuits to build</a><a href="index.html#parts">Real parts</a></div></nav>
<div class="hero" style="--accent:#22c55e"><div class="hero-inner">
  <div><span class="eyebrow">Gotronic shopping list</span><h1>Everything for the circuits</h1><p class="tag">The minimum parts to build each of the 26 "Circuits to build" projects and the two real-life builds (battery charger and night light), from gotronic.fr. Quantities are what the biggest project needs: you build one circuit at a time, then take it apart and reuse the parts for the next one.</p>
  <div class="facts"><span>✓ Tick what you need</span><span>Codes for the Gotronic search box</span><span>Prices read 18 Nov 2026</span></div></div>
  <div class="illus"><svg viewBox="0 0 320 200" aria-hidden="true"><rect x="60" y="60" width="200" height="120" rx="10" fill="#15803d"/><path d="M90 60 q70 -70 140 0" stroke="#86efac" stroke-width="10" fill="none"/><rect x="85" y="85" width="40" height="14" rx="6" fill="#d9b98a"/><circle cx="160" cy="110" r="16" fill="#ef4444"/><rect x="190" y="95" width="46" height="30" rx="3" fill="#111827"/><rect x="95" y="130" width="22" height="34" rx="5" fill="#2563eb"/><text x="200" y="160" fill="#dcfce7" font-size="22" font-weight="800" font-family="system-ui">€</text></svg></div>
</div></div>
<main>
<section>
  <h2>How to use this list</h2>
  <ul>
    <li><b>Untick</b> anything you already own (you probably have a soldering iron, wires, 9 V batteries, maybe an Arduino and a multimeter).</li>
    <li>Change quantities if you want spares. Small parts cost a few cents, so getting 2–3 extra of each is a good idea for beginners.</li>
    <li>Type the <b>code</b> into the Gotronic search box, or click the name to open the product page.</li>
    <li>"Used in" refers to the project numbers on the <a class="navlink" href="index.html#circuits">Circuits to build</a> page (A = battery charger, B = night light).</li>
  </ul>
  <div class="controls"><button id="selAll">Tick all</button><button id="selReq" class="active">Required only (no optional)</button><button id="copy">📋 Copy the list (codes + quantities)</button><span id="copied"></span></div>
</section>
<section>
  <table class="shop" id="shop"></table>
  <p class="hint" style="margin-top:14px">Prices include VAT (TTC), as shown on gotronic.fr on 18 Nov 2026, excluding delivery. They can change, and some items may go out of stock: Gotronic usually has close equivalents (same value, other brand). Resistors are sold in packs of 10, and the price shown is per pack.</p>
</section>
<section>
  <h2>Notes before you order</h2>
  <ul>
    <li><b>Li-ion safety:</b> the 18650 cell sold here is <b>unprotected</b>, and the TP4056 charger page doesn't mention protection. So the list includes a <b>BMS 1S protection board</b>. Wire it as: cell → B+/B− of the BMS. Charger output and your load → P+/P−. Never short the cell, never charge it unattended the first times.</li>
    <li><b>Relays:</b> the RWH-SS relays have pins that don't fit a breadboard well. Solder 5 short wires (or header pins) to them first.</li>
    <li><b>Mains:</b> nothing on this list uses 230 V. The "lamp" is a <b>12 V bulb</b> powered by a safe 12 V adapter.</li>
    <li><b>Not on the list:</b> 9 V batteries, a micro-USB cable for the charger, a multimeter (very useful, ~€15–25), a small screwdriver for the trimmers.</li>
    <li><b>Inductor project (6):</b> it uses the 5 V relay's <b>coil</b> as the inductor, so no extra part is needed.</li>
  </ul>
</section>
</main>
<div class="tot"><span>Selected: <span id="nSel"></span> items</span><span>Total ≈ <b id="sum"></b> TTC <span class="hint">(+ delivery)</span></span></div>
<script>
const ITEMS={rows};
const st=ITEMS.map(it=>({{on:!it.opt,q:it.q}}));
function fmt(v){{return v.toFixed(2).replace('.',',')+' €';}}
function render(){{let h='',g='';
  ITEMS.forEach((it,i)=>{{if(it.g!==g){{g=it.g;h+=`<tr class="grp"><td colspan="5">${{g}}</td></tr>`;}}
    const s=st[i];h+=`<tr class="${{s.on?'':'off'}}"><td style="width:28px"><input type="checkbox" data-i="${{i}}" ${{s.on?'checked':''}}></td>
    <td><a class="navlink" href="${{it.u}}" target="_blank" rel="noopener">${{it.n}}</a>${{it.opt?' <span class="qtopic">optional</span>':''}}<span class="used">Used in: ${{it.used}}</span>${{it.note?`<span class="note">${{it.note}}</span>`:''}}</td>
    <td class="code">${{it.c}}</td><td><input type="number" min="0" value="${{s.q}}" data-q="${{i}}"> × ${{fmt(it.p)}}</td><td style="text-align:right;white-space:nowrap">${{s.on?fmt(it.p*s.q):'—'}}</td></tr>`;}});
  document.getElementById('shop').innerHTML='<tr><td></td><td><b>Item</b></td><td><b>Code</b></td><td><b>Qty × price</b></td><td style="text-align:right"><b>Subtotal</b></td></tr>'+h;
  document.querySelectorAll('[data-i]').forEach(c=>c.onchange=()=>{{st[+c.dataset.i].on=c.checked;render();}});
  document.querySelectorAll('[data-q]').forEach(c=>c.onchange=()=>{{st[+c.dataset.q].q=Math.max(0,+c.value||0);render();}});
  let tot=0,n=0;ITEMS.forEach((it,i)=>{{if(st[i].on&&st[i].q>0){{tot+=it.p*st[i].q;n++;}}}});
  document.getElementById('sum').textContent=fmt(tot);document.getElementById('nSel').textContent=n;}}
document.getElementById('selAll').onclick=()=>{{st.forEach(s=>s.on=true);render();}};
document.getElementById('selReq').onclick=()=>{{st.forEach((s,i)=>s.on=!ITEMS[i].opt);render();}};
document.getElementById('copy').onclick=async()=>{{const lines=ITEMS.map((it,i)=>st[i].on&&st[i].q>0?`${{it.c}}\\t${{st[i].q}}\\t${{it.n}}`:null).filter(Boolean);
  const t='Gotronic order (code, qty, item)\\n'+lines.join('\\n')+'\\nTotal ≈ '+document.getElementById('sum').textContent;
  try{{await navigator.clipboard.writeText(t);document.getElementById('copied').textContent='Copied ✓';}}catch(e){{document.getElementById('copied').textContent='Copy not allowed here: select the table instead';}}}};
render();
</script>
</body>
</html>'''
open(SITE+'shopping.html','w').write(html)
tot=sum(p*q for _,_,_,p,q,_,_,_,o in I if not o);toto=sum(p*q for _,_,_,p,q,_,_,_,o in I)
print(round(tot,2),round(toto,2),len(I))
