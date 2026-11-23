import math
tor=''.join(f'<line x1="{120+28*math.cos(a/22*6.283):.1f}" y1="{100+28*math.sin(a/22*6.283):.1f}" x2="{120+72*math.cos(a/22*6.283):.1f}" y2="{100+72*math.sin(a/22*6.283):.1f}"/>' for a in range(22))
holes=''.join(f'<rect x="{32+c*13}" y="{44+r*11+(12 if r>=5 else 0)}" width="4" height="4"/>' for c in range(21) for r in range(10))
segs={'a':(118,52,84,'h'),'b':(204,60,64,'v'),'c':(204,132,64,'v'),'d':(118,196,84,'h'),'e':(110,132,64,'v'),'f':(110,60,64,'v'),'g':(118,124,84,'h')}
def _seg(k,on):
    x,y,l,t=segs[k];c='#ef4444' if on else '#2a1416'
    if t=='h': return f'<path d="M{x} {y+4} l8 -8 h{l-16} l8 8 l-8 8 h-{l-16}z" fill="{c}"/>'
    return f'<path d="M{x-4} {y} l8 8 v{l-16} l-8 8 l-8 -8 v-{l-16}z" transform="translate(4,0)" fill="{c}"/>'
lit='abcdg'
seven=''.join(_seg(k,k in lit) for k in segs)
EXTRA={
'parts':f'''<svg viewBox="0 0 320 220" aria-hidden="true">
  <defs><filter id="segglow"><feGaussianBlur stdDeviation="4"/></filter></defs>
  <g fill="#cbd5e1">{''.join(f'<rect x="{102+i*28}" y="2" width="6" height="18"/><rect x="{102+i*28}" y="212" width="6" height="18"/>' for i in range(5))}</g>
  <rect x="80" y="18" width="160" height="196" rx="4" fill="#1a1a1a"/>
  <g filter="url(#segglow)" opacity=".8">{''.join(_seg(k,True) for k in lit)}</g>{seven}
  <circle cx="222" cy="200" r="8" fill="#ef4444"/>
  <text x="270" y="60" fill="#fbbf24" font-size="13" font-family="system-ui">a–g</text><text x="270" y="78" fill="#94a3b8" font-size="11" font-family="system-ui">+ dp</text></svg>''',
'inductor':f'''<svg viewBox="0 0 320 200" aria-hidden="true">
  <defs><radialGradient id="ferr" cx=".4" cy=".35"><stop offset="0" stop-color="#4b5563"/><stop offset="1" stop-color="#111827"/></radialGradient></defs>
  <circle cx="120" cy="100" r="70" fill="url(#ferr)"/><circle cx="120" cy="100" r="30" fill="#0b1120"/>
  <g stroke="#d97706" stroke-width="5" stroke-linecap="round">{tor}</g>
  <path d="M70 160 q-20 15 -40 25M170 160 q20 15 40 25" stroke="#d97706" stroke-width="4" fill="none"/>
  <rect x="200" y="98" width="110" height="5" fill="#cbd5e1"/>
  <rect x="226" y="80" width="58" height="40" rx="18" fill="#15803d"/><rect x="240" y="80" width="6" height="40" fill="#78350f"/><rect x="252" y="80" width="6" height="40" fill="#111"/><rect x="264" y="80" width="6" height="40" fill="#78350f"/>
  <text x="255" y="140" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="system-ui">choke</text></svg>''',
'relay':'''<svg viewBox="0 0 320 200" aria-hidden="true">
  <defs><linearGradient id="rly" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#1e3a8a"/></linearGradient></defs>
  <g fill="#cbd5e1"><rect x="100" y="158" width="6" height="26"/><rect x="130" y="158" width="6" height="26"/><rect x="170" y="158" width="6" height="26"/><rect x="200" y="158" width="6" height="26"/><rect x="214" y="158" width="6" height="26"/></g>
  <path d="M80 50 l20 -20 h150 l-20 20z" fill="#60a5fa"/><path d="M230 50 l20 -20 v110 l-20 20z" fill="#1e40af"/>
  <rect x="80" y="50" width="150" height="110" fill="url(#rly)"/>
  <text x="155" y="88" text-anchor="middle" fill="#e0e7ff" font-size="13" font-weight="700" font-family="system-ui">SRD-05VDC</text>
  <text x="155" y="108" text-anchor="middle" fill="#bfdbfe" font-size="10" font-family="system-ui">10A 250VAC</text>
  <path d="M110 128 h20 M120 120 v16" stroke="#bfdbfe" stroke-width="1.5"/><path d="M150 128 q6 -8 12 0 q6 8 12 0" stroke="#bfdbfe" stroke-width="1.5" fill="none"/>
  <text x="262" y="70" fill="#fbbf24" font-size="18" font-weight="800" font-family="system-ui">click!</text></svg>''',
'formulas':'''<svg viewBox="0 0 320 200" aria-hidden="true">
  <path d="M160 20 L270 180 L50 180 Z" fill="#0c4a6e" stroke="#38bdf8" stroke-width="4"/><path d="M92 120 H228 M160 120 V180" stroke="#38bdf8" stroke-width="4"/>
  <text x="160" y="100" text-anchor="middle" fill="#fbbf24" font-size="40" font-weight="800" font-family="system-ui">V</text>
  <text x="112" y="165" text-anchor="middle" fill="#e2e8f0" font-size="32" font-weight="800" font-family="system-ui">R</text>
  <text x="208" y="165" text-anchor="middle" fill="#e2e8f0" font-size="32" font-weight="800" font-family="system-ui">I</text>
  <text x="290" y="60" text-anchor="middle" fill="#f472b6" font-size="18" font-weight="800" font-family="system-ui">P=V×I</text></svg>''',
'sensors':'''<svg viewBox="0 0 320 200" aria-hidden="true">
  <circle cx="70" cy="60" r="26" fill="#facc15"/><g stroke="#facc15" stroke-width="3"><path d="M104 60 L116 60"/><path d="M94 84 L103 93"/><path d="M70 94 L70 106"/><path d="M46 84 L37 93"/><path d="M36 60 L24 60"/><path d="M46 36 L37 27"/><path d="M70 26 L70 14"/><path d="M94 36 L103 27"/></g>
  <circle cx="160" cy="110" r="34" fill="#fb923c"/><path d="M138 94 l8 32 l8 -32 l8 32 l8 -32 l8 32" stroke="#7c2d12" stroke-width="3" fill="none"/>
  <path d="M150 144 v40 M170 144 v40" stroke="#cbd5e1" stroke-width="4"/>
  <path d="M232 70 a26 26 0 0 1 52 0 v34 h-52z" fill="#111827"/><text x="258" y="92" text-anchor="middle" fill="#cbd5e1" font-size="11" font-family="system-ui" font-weight="700">LM35</text>
  <path d="M242 104 v44 M258 104 v44 M274 104 v44" stroke="#cbd5e1" stroke-width="3"/>
  <path d="M90 60 L130 92" stroke="#fde047" stroke-width="2" stroke-dasharray="4 4"/></svg>''',
'circuits':f'''<svg viewBox="0 0 320 200" aria-hidden="true">
  <rect x="20" y="30" width="280" height="150" rx="10" fill="#e5e7eb"/><rect x="20" y="100" width="280" height="10" fill="#d1d5db"/>
  <g fill="#9ca3af">{holes}</g>
  <path d="M30 38 h260" stroke="#ef4444" stroke-width="2"/><path d="M30 172 h260" stroke="#3b82f6" stroke-width="2"/>
  <path d="M60 52 q20 -30 46 0" stroke="#ef4444" stroke-width="4" fill="none"/><path d="M200 140 q40 40 70 -10" stroke="#22c55e" stroke-width="4" fill="none"/>
  <rect x="96" y="58" width="44" height="14" rx="6" fill="#d9b98a"/><rect x="104" y="58" width="5" height="14" fill="#7c3f12"/><rect x="114" y="58" width="5" height="14" fill="#111"/><rect x="124" y="58" width="5" height="14" fill="#dc2626"/>
  <circle cx="190" cy="66" r="24" fill="#ef4444" opacity=".3"/><path d="M180 82v-18a10 10 0 0 1 20 0v18z" fill="#ef4444"/>
  <rect x="210" y="86" width="64" height="38" rx="3" fill="#111827"/><text x="242" y="110" text-anchor="middle" fill="#9ca3af" font-size="10" font-family="ui-monospace,monospace">NE555</text>
  <rect x="60" y="120" width="26" height="36" rx="5" fill="#2563eb"/></svg>''',
'motion':'''<svg viewBox="0 0 320 200" aria-hidden="true">
  <circle cx="62" cy="58" r="36" fill="#111827" stroke="#475569" stroke-width="3"/><circle cx="62" cy="58" r="6" fill="#0b1120"/>
  <path d="M54 94v22M70 94v26" stroke="#cbd5e1" stroke-width="3"/>
  <g fill="none" stroke="#f472b6" stroke-width="3" stroke-linecap="round"><path d="M108 40a28 28 0 0 1 0 36"/><path d="M122 30a42 42 0 0 1 0 56" opacity=".6"/></g>
  <rect x="168" y="78" width="24" height="44" rx="3" fill="#475569"/>
  <path d="M192 84l36 -34v100l-36 -34z" fill="#cbd5e1"/><path d="M228 50l44 -24v148l-44 -24" fill="#94a3b8"/>
  <g transform="translate(70 162)"><rect x="-40" y="-18" width="62" height="36" rx="16" fill="#94a3b8"/><rect x="-46" y="-12" width="8" height="24" rx="2" fill="#b45309"/><rect x="22" y="-3" width="30" height="6" fill="#cbd5e1"/></g>
  <ellipse cx="130" cy="162" rx="8" ry="20" fill="none" stroke="#60a5fa" stroke-width="2.5" stroke-dasharray="6 5"/>
</svg>''',
}
HEXTRA={
 'parts': ('#f43f5e','Practical guide','Using Real Parts','From a shop page and a datasheet to a working circuit. Worked examples: a 7-segment display and a 10-LED bar graph.',['SC39-11SURKWA 7-segment','DC10G 10-LED bar graph','Pinout · test · resistors · drivers']),
 'inductor': ('#d97706','Component 6 · Passive','The Inductor','A coil of wire that stores energy in a magnetic field and hates sudden changes in current.',['Unit: henry (H)','💧 A heavy water wheel','Mirror of the capacitor']),
 'relay': ('#60a5fa','Component 7 · Electromechanical','The Relay','A switch flipped by an electromagnet: a small current controls a separate big one.',['COM · NO · NC','💧 A lever on a separate pipe','Isolated switching']),
 'motion': ('#f472b6','Component 8 · Sound & motion','Buzzers, Speakers &amp; Motors','Parts that turn electricity into something you hear or feel: a coil (or a crystal) pushing on air, or on a shaft.',['🔔 Active · passive buzzers','🔊 8 Ω speaker','⚙ DC motor · back-EMF']),
 'formulas': ('#38bdf8','The maths you actually need','Basic Formulas','Volts, amps, ohms and watts: the handful of formulas behind every circuit on this site, with live calculators.',['V = R × I','P = V × I','💧 Pressure × flow']),
 'sensors': ('#f59e0b','Turning the world into electricity','Sensors','How light, heat, touch, a press or a vibrating string become a voltage your circuit can use.',['☀ LDR · 🌡 LM35 · ☝ Touch','⏺ Button · 🎸 Pickup · IR','💧 Gauges and taps']),
 'circuits': ('#22c55e','Build it yourself','Circuits to Build','26 breadboard projects grouped by theme (dice, siren, fuzz pedal, counter, thermometers, infrared alarm, motors and more), with parts lists and variants to try, plus two real-life builds.',['🧰 Parts lists','🧪 Variants to test','🔊 Buzzer · 🔋 Charger · 🌙 Night lamp']),
}
