ILLUS = {
'resistor': '''<svg viewBox="0 0 320 200" aria-hidden="true">
  <defs><linearGradient id="rb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1dcb8"/><stop offset=".55" stop-color="#d9b98a"/><stop offset="1" stop-color="#a98557"/></linearGradient>
  <linearGradient id="lead" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8fafc"/><stop offset="1" stop-color="#94a3b8"/></linearGradient></defs>
  <rect x="10" y="96" width="300" height="8" rx="4" fill="url(#lead)"/>
  <path d="M85 70 q0-14 18-14 h20 q8 0 14 6 h46 q6-6 14-6 h20 q18 0 18 14 v60 q0 14-18 14 h-20 q-8 0-14-6 h-46 q-6 6-14 6 h-20 q-18 0-18-14z" fill="url(#rb)"/>
  <rect x="104" y="57" width="12" height="86" fill="#7c3f12"/><rect x="132" y="62" width="12" height="76" fill="#111"/>
  <rect x="160" y="62" width="12" height="76" fill="#dc2626"/><rect x="204" y="57" width="12" height="86" fill="#d4af37"/>
  <ellipse cx="160" cy="72" rx="62" ry="5" fill="#fff" opacity=".25"/>
  <text x="160" y="182" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="system-ui">brown · black · red · gold = 1 kΩ ±5%</text></svg>''',
'capacitor': '''<svg viewBox="0 0 320 200" aria-hidden="true">
  <defs><linearGradient id="can" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1e3a8a"/><stop offset=".45" stop-color="#3b82f6"/><stop offset="1" stop-color="#1e3a8a"/></linearGradient>
  <linearGradient id="cer" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fdba74"/><stop offset="1" stop-color="#c2410c"/></linearGradient></defs>
  <rect x="112" y="150" width="4" height="40" fill="#cbd5e1"/><rect x="144" y="150" width="4" height="30" fill="#cbd5e1"/>
  <rect x="90" y="20" width="80" height="134" rx="10" fill="url(#can)"/>
  <rect x="148" y="20" width="16" height="134" fill="#cbd5e1" opacity=".85"/>
  <text x="156" y="60" text-anchor="middle" fill="#1e3a8a" font-size="16" font-weight="700">−</text><text x="156" y="100" text-anchor="middle" fill="#1e3a8a" font-size="16" font-weight="700">−</text>
  <ellipse cx="130" cy="24" rx="40" ry="7" fill="#94a3b8"/><path d="M110 24h40M130 18v12" stroke="#64748b" stroke-width="2"/>
  <text x="118" y="95" text-anchor="middle" fill="#e0e7ff" font-size="12" font-family="system-ui" transform="rotate(-90 118 95)">1000µF 16V</text>
  <rect x="224" y="120" width="3" height="60" fill="#cbd5e1"/><rect x="246" y="120" width="3" height="60" fill="#cbd5e1"/>
  <ellipse cx="236" cy="104" rx="30" ry="26" fill="url(#cer)"/><text x="236" y="109" text-anchor="middle" fill="#431407" font-size="13" font-weight="700" font-family="system-ui">104</text></svg>''',
'diode': '''<svg viewBox="0 0 320 200" aria-hidden="true">
  <defs><linearGradient id="db" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b5563"/><stop offset=".5" stop-color="#1f2937"/><stop offset="1" stop-color="#030712"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fecaca" stop-opacity=".9"/><stop offset="1" stop-color="#f97316" stop-opacity=".6"/></linearGradient></defs>
  <rect x="10" y="76" width="300" height="7" rx="3" fill="#cbd5e1"/>
  <rect x="100" y="52" width="120" height="56" rx="12" fill="url(#db)"/><rect x="188" y="52" width="16" height="56" fill="#e5e7eb"/>
  <text x="146" y="85" text-anchor="middle" fill="#9ca3af" font-size="12" font-family="system-ui">1N4007</text>
  <rect x="40" y="146" width="240" height="4" rx="2" fill="#cbd5e1"/>
  <rect x="128" y="134" width="64" height="28" rx="12" fill="url(#gl)"/><rect x="174" y="134" width="7" height="28" fill="#111"/>
  <path d="M120 186h36M156 176v20M156 186l-18-10v20z" stroke="#fbbf24" stroke-width="2.5" fill="none"/><text x="200" y="191" fill="#fbbf24" font-size="13" font-family="system-ui">stripe = −</text></svg>''',
'led': '''<svg viewBox="0 0 320 200" aria-hidden="true">
  <defs><radialGradient id="glow"><stop offset="0" stop-color="#ef4444" stop-opacity=".75"/><stop offset="1" stop-color="#ef4444" stop-opacity="0"/></radialGradient>
  <linearGradient id="dome" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b91c1c"/><stop offset=".4" stop-color="#f87171"/><stop offset="1" stop-color="#991b1b"/></linearGradient></defs>
  <circle cx="160" cy="62" r="80" fill="url(#glow)"><animate attributeName="r" values="70;85;70" dur="3s" repeatCount="indefinite"/></circle>
  <rect x="146" y="118" width="5" height="78" fill="#cbd5e1"/><rect x="170" y="118" width="5" height="58" fill="#cbd5e1"/>
  <path d="M130 118v-62a30 30 0 0 1 60 0v62z" fill="url(#dome)" opacity=".95"/>
  <rect x="124" y="112" width="72" height="10" rx="2" fill="#dc2626"/><rect x="190" y="112" width="6" height="10" fill="#0b1220"/>
  <path d="M164 70h10v38h-10z" fill="#e5e7eb" opacity=".8"/><path d="M150 84h6v24h-6z" fill="#e5e7eb" opacity=".8"/>
  <ellipse cx="148" cy="56" rx="7" ry="16" fill="#fff" opacity=".35"/>
  <text x="140" y="196" text-anchor="end" fill="#fca5a5" font-size="12" font-family="system-ui">+ long</text><text x="182" y="182" fill="#93c5fd" font-size="12" font-family="system-ui">− short</text></svg>''',
'transistor': '''<svg viewBox="0 0 320 200" aria-hidden="true">
  <defs><linearGradient id="to92" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#030712"/><stop offset=".55" stop-color="#374151"/><stop offset="1" stop-color="#111827"/></linearGradient>
  <linearGradient id="to220" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#94a3b8"/><stop offset=".5" stop-color="#e2e8f0"/><stop offset="1" stop-color="#94a3b8"/></linearGradient></defs>
  <rect x="82" y="104" width="4" height="80" fill="#cbd5e1"/><rect x="100" y="104" width="4" height="86" fill="#cbd5e1"/><rect x="118" y="104" width="4" height="80" fill="#cbd5e1"/>
  <path d="M66 104v-64a36 36 0 0 1 72 0v64z" fill="url(#to92)"/><rect x="66" y="40" width="72" height="64" fill="#1f2937" opacity=".6"/>
  <text x="102" y="76" text-anchor="middle" fill="#9ca3af" font-size="11" font-family="system-ui">BC547</text>
  <text x="84" y="198" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="system-ui">C</text><text x="102" y="200" fill="#94a3b8" font-size="11" text-anchor="middle" font-family="system-ui">B</text><text x="120" y="198" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="system-ui">E</text>
  <rect x="190" y="18" width="80" height="54" rx="3" fill="url(#to220)"/><circle cx="230" cy="40" r="9" fill="#0b1220"/>
  <rect x="192" y="70" width="76" height="62" rx="3" fill="#111827"/><text x="230" y="106" text-anchor="middle" fill="#9ca3af" font-size="10" font-family="system-ui">IRLZ44N</text>
  <rect x="204" y="132" width="6" height="56" fill="#cbd5e1"/><rect x="227" y="132" width="6" height="56" fill="#cbd5e1"/><rect x="250" y="132" width="6" height="56" fill="#cbd5e1"/></svg>''',
'chips': '''<svg viewBox="0 0 320 200" aria-hidden="true">
  <defs><linearGradient id="ic" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#374151"/><stop offset="1" stop-color="#0b0f19"/></linearGradient></defs>
  <g fill="#cbd5e1">''' + ''.join(f'<rect x="{68+i*50}" y="34" width="16" height="20" rx="2"/><rect x="{68+i*50}" y="146" width="16" height="20" rx="2"/>' for i in range(4)) + '''</g>
  <rect x="40" y="50" width="220" height="100" rx="6" fill="url(#ic)"/>
  <path d="M40 92a12 12 0 0 1 0 24z" fill="#0b1220"/><circle cx="60" cy="132" r="5" fill="#4b5563"/>
  <text x="150" y="98" text-anchor="middle" fill="#cbd5e1" font-size="22" font-weight="700" font-family="ui-monospace,monospace">NE555P</text>
  <text x="150" y="122" text-anchor="middle" fill="#6b7280" font-size="12" font-family="ui-monospace,monospace">2611 · TI</text></svg>''',
'quiz': '''<svg viewBox="0 0 320 200" aria-hidden="true">
  <defs><linearGradient id="pcb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#065f46"/><stop offset="1" stop-color="#064e3b"/></linearGradient>
  <radialGradient id="qg"><stop offset="0" stop-color="#facc15" stop-opacity=".7"/><stop offset="1" stop-color="#facc15" stop-opacity="0"/></radialGradient></defs>
  <rect x="20" y="30" width="230" height="150" rx="12" fill="url(#pcb)"/>
  <path d="M40 60h60v40h50M40 150h90v-30h60M150 60h80M200 100v60h30" stroke="#d4af37" stroke-width="3" fill="none" opacity=".8"/>
  <g fill="#d4af37">''' + ''.join(f'<circle cx="{x}" cy="{y}" r="5"/>' for x,y in [(40,60),(40,150),(230,60),(230,160),(150,100),(190,120)]) + '''</g>
  <rect x="88" y="44" width="40" height="14" rx="6" fill="#d9b98a"/><rect x="96" y="44" width="5" height="14" fill="#7c3f12"/><rect x="106" y="44" width="5" height="14" fill="#111"/>
  <rect x="150" y="128" width="46" height="30" rx="3" fill="#111827"/>
  <circle cx="252" cy="62" r="56" fill="url(#qg)"/><circle cx="252" cy="62" r="34" fill="#facc15"/>
  <text x="252" y="78" text-anchor="middle" fill="#0b1120" font-size="44" font-weight="800" font-family="system-ui">?</text>
  <circle cx="60" cy="110" r="10" fill="#ef4444"/><circle cx="60" cy="110" r="22" fill="#ef4444" opacity=".25"/></svg>''',
'home': '''<svg viewBox="0 0 320 200" aria-hidden="true">
  <defs><radialGradient id="hg"><stop offset="0" stop-color="#ef4444" stop-opacity=".7"/><stop offset="1" stop-color="#ef4444" stop-opacity="0"/></radialGradient></defs>
  <path d="M20 160 H300" stroke="#334155" stroke-width="2" stroke-dasharray="4 6"/>
  <rect x="20" y="100" width="90" height="5" fill="#cbd5e1"/><rect x="40" y="88" width="52" height="28" rx="10" fill="#d9b98a"/><rect x="50" y="88" width="6" height="28" fill="#7c3f12"/><rect x="62" y="88" width="6" height="28" fill="#111"/><rect x="74" y="88" width="6" height="28" fill="#dc2626"/>
  <rect x="134" y="40" width="40" height="72" rx="6" fill="#2563eb"/><rect x="164" y="40" width="10" height="72" fill="#cbd5e1" opacity=".8"/><rect x="146" y="112" width="3" height="40" fill="#cbd5e1"/><rect x="160" y="112" width="3" height="30" fill="#cbd5e1"/>
  <circle cx="240" cy="62" r="46" fill="url(#hg)"/><path d="M224 104v-44a16 16 0 0 1 32 0v44z" fill="#ef4444"/><rect x="230" y="104" width="3" height="50" fill="#cbd5e1"/><rect x="246" y="104" width="3" height="38" fill="#cbd5e1"/>
  <rect x="30" y="138" width="74" height="40" rx="4" fill="#1f2937"/><path d="M30 152a6 6 0 0 1 0 12z" fill="#0b1220"/>''' + ''.join(f'<rect x="{38+i*16}" y="130" width="6" height="8" fill="#cbd5e1"/><rect x="{38+i*16}" y="178" width="6" height="8" fill="#cbd5e1"/>' for i in range(4)) + '''</svg>''',
}
HERO = {
 'home': ('#60a5fa','Interactive guide','Electronics, one component at a time','Simple explanations, water analogies and live animations, from the resistor to real microchips.',['💧 Water analogies','🎛️ Interactive demos','🎸 Guitar-amp examples']),
 'resistor': ('#f59e0b','Component 1 · Passive','The Resistor','The simplest component: it makes it harder for electricity to flow.',['Unit: ohm (Ω)','💧 A narrow pipe','V = I × R']),
 'capacitor': ('#3b82f6','Component 2 · Passive','The Capacitor','A tiny, very fast rechargeable store of electric charge.',['Unit: farad (F)','💧 A rubber sheet in a pipe','Q = C × V']),
 'diode': ('#f97316','Component 3 · Semiconductor','The Diode','A one-way valve for electricity.',['Forward ≈ 0.7 V','💧 A check valve','Stripe = cathode']),
 'led': ('#ef4444','Component 4 · Semiconductor','The LED','Light Emitting Diode: a one-way valve that glows.',['Max ≈ 20 mA','💧 A glowing paddle wheel','Always use a resistor']),
 'transistor': ('#10b981','Component 5 · Semiconductor','The Transistor','A valve controlled by electricity: the building block of all modern electronics.',['Gain ≈ 100×','💧 A big valve, small lever','Switch or amplifier']),
 'quiz': ('#facc15','Test yourself','The Quiz','31 interactive circuit challenges: pick the part, choose the value, predict what happens, and build circuits that work.',['🧩 Pick the part','🎚️ Choose the value','🔮 What happens?','🛠️ Build it']),
 'chips': ('#a78bfa','Integrated circuits','Common Microchips','Fifteen classic chips: what\'s inside, what they\'re for, and how to use them.',['NE555 · 7805 · LM358 · LM339 · LM386 · LM3914','CD4017 · CD4511 · CD4518 · CD4013 · CD4060','74HC595 · L293D · TP4056 · ATmega328P']),
}
