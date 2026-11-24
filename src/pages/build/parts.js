// ===== Build lab: the parts catalog =====
// One entry per part type. foot: the holes its legs use, as [row offset, column offset] from the anchor hole,
// in the row order of ROWS (tp tn a b c d e f g h i j bp bn); it turns with the part (rot 0–3).
// anchor: rows the anchor may use ('rails' = tp/bp only, 'e'/'f' = straddles the gap). props: default values.
// edit: what the Properties panel shows ({k, label, opts | range | toggle | hold}; opts may be a function of the part,
// show(p) hides a line, set(p) runs after a change). kind-style props (diode model, capacitor type) switch the model
// of a placed part. label(p): its full name. pinNames: what each leg is (chips). supply/optional/tie: for "Check". model(): adds the part to the simulator. watch(): what we read back
// (current, power, light...) and the limits that burn it.
const RES_VALUES=[];for(let d=10;d<=100000;d*=10)E12.forEach(v=>RES_VALUES.push(Math.round(v*d)));RES_VALUES.push(1e6);   // E12 from helpers2.js
const CAP_VALUES=[1e-9,2.2e-9,4.7e-9,10e-9,22e-9,47e-9,100e-9,220e-9,470e-9,1e-6,2.2e-6,4.7e-6,10e-6,22e-6,47e-6,100e-6,220e-6,470e-6,1000e-6];
const LEDS={red:{rgb:'239,68,68',vf:1.9},yellow:{rgb:'250,204,21',vf:2.0},green:{rgb:'34,197,94',vf:2.1},blue:{rgb:'59,130,246',vf:3.0},white:{rgb:'226,232,240',vf:3.0}};
const fmtR=r=>r>=1e6?+(r/1e6).toPrecision(3)+' MΩ':r>=1e3?+(r/1e3).toPrecision(3)+' kΩ':+r.toPrecision(3)+' Ω';
const fmtC=c=>c>=1e-6?+(c*1e6).toPrecision(3)+' µF':c>=1e-9?+(c*1e9).toPrecision(3)+' nF':+(c*1e12).toPrecision(3)+' pF';
const fmtI=i=>{i=Math.abs(i);return i<1e-6?'0 mA':i<1e-3?(i*1e6).toFixed(0)+' µA':i<1?(i*1e3).toFixed(i<0.01?2:1)+' mA':i.toFixed(2)+' A';};
const fmtV=v=>Math.abs(v)<1?(v*1000).toFixed(0)+' mV':v.toFixed(2)+' V';
const fmtP=p=>p<1?(p*1000).toFixed(0)+' mW':p.toFixed(2)+' W';
const DIODES={'1N4007':{vf:0.72,n:1.8,Imax:1,lab:'1 A'},'1N4148':{vf:0.68,n:1.9,Imax:0.2,lab:'200 mA'}};
const capValues=p=>CAP_VALUES.filter(v=>p.props.kind==='electrolytic'?v>=1e-6:v<=1e-6);
// a DIP chip straddling the centre gap: pins 1…n/2 on row f (left to right), n/2+1…n back along row e
const dip=n=>{const f=[];for(let i=0;i<n/2;i++)f.push([0,i]);for(let i=n/2-1;i>=0;i--)f.push([-1,i]);return f;};
const pinList=n=>Array.from({length:n},(_,i)=>String(i+1));
const RELAYS={'12':{R:400,L:0.5,on:0.022,off:0.005,Vn:12,lab:'12 V relay'},'5':{R:70,L:0.08,on:0.053,off:0.01,Vn:5,lab:'5 V relay'}};
const Q_PINS=['3','2','4','7','10','1','5','6','9','11'];   // CD4017: pins of Q0 … Q9

const PARTS={
 batt:{name:'9 V battery',group:'Power',icon:'🔋',foot:[[0,0],[1,1]],pins:['+','−'],anchor:'rails',rotate:false,source:true,
   props:{V:9},edit:[{k:'V',label:'Voltage',opts:[[9,'9 V'],[4.5,'4.5 V (3 × AA)'],[3,'3 V (2 × AA)']]}],
   model:(c,n,p)=>({bat:c.Vs(n['+'],n['−'],p.props.V,1.5)}),
   watch:(el)=>({I:el.bat.i,P:Math.abs(el.bat.i*el.bat.v),info:[['Delivers',fmtI(el.bat.i)],['Voltage',fmtV(el.bat.v)]]})},
 usb:{name:'USB 5 V module',group:'Power',icon:'⚡',foot:null,pins:['+','−'],fixed:{'+':'tp1','−':'tn1'},rotate:false,unique:true,source:true,
   props:{},edit:[],
   model:(c,n)=>({src:c.Vs(n['+'],n['−'],5,0.2)}),
   watch:(el)=>({I:el.src.i,info:[['Delivers',fmtI(el.src.i)],['Voltage',fmtV(el.src.v)]],over:el.src.i>0.8?'more than 0.8 A: the module cuts out':''})},
 adapter:{name:'12 V adapter',group:'Power',icon:'🔌',foot:[[0,0],[1,1]],pins:['+','−'],anchor:'rails',rotate:false,source:true,props:{},edit:[],
   model:(c,n)=>({src:c.Vs(n['+'],n['−'],12,0.3)}),
   watch:(el)=>({I:el.src.i,info:[['Delivers',fmtI(el.src.i)+' (max 500 mA)'],['Voltage',fmtV(el.src.v)]],over:el.src.i>0.5?'more than 500 mA: the adapter cuts out':''})},
 sig:{name:'Audio signal (phone)',group:'Power',icon:'♪',foot:[[0,0],[0,2]],pins:['tip','sleeve'],rotate:true,dynamic:true,
   props:{f:440,vol:0.5},legName:(p,pin)=>pin==='tip'?'tip (signal)':'sleeve (ground)',
   edit:[{k:'f',label:'Tone',opts:[[110,'110 Hz (low)'],[440,'440 Hz (the note A)'],[1000,'1 kHz (high)']]},{k:'vol',label:'Volume',range:[0,1,0.01],live:true}],
   model:(c,n,p)=>({s:c.Vac(n['tip'],n['sleeve'],0.5*p.props.vol,p.props.f,32)}),update:(el,p)=>{el.s.amp=0.5*p.props.vol;},
   watch:(el,p)=>({I:el.s.i,info:[['Signal',fmtV(0.5*p.props.vol)+' peak at '+p.props.f+' Hz'],['Now',fmtV(el.s.v)]]})},
 res:{name:'Resistor',label:p=>'Resistor '+fmtR(p.props.R),group:'Passive',icon:'Ω',foot:[[0,0],[0,4]],pins:['1','2'],rotate:true,
   props:{R:470},edit:[{k:'R',label:'Value',opts:RES_VALUES.map(v=>[v,fmtR(v)])}],
   model:(c,n,p)=>({r:c.R(n['1'],n['2'],p.props.R)}),
   watch:(el)=>({I:el.r.i,P:el.r.p,info:[['Current',fmtI(el.r.i)],['Voltage',fmtV(el.r.v)],['Power',fmtP(el.r.p)+' (max 250 mW)']],over:el.r.p>0.25?'more than ¼ W: it overheats':''})},
 pot:{name:'Trimmer / pot',group:'Passive',icon:'⟳',foot:[[0,0],[0,1],[0,2]],pins:['1','W','3'],rotate:true,
   props:{R:10000,pos:0.5},edit:[{k:'R',label:'Value',opts:[[1000,'1 kΩ'],[10000,'10 kΩ'],[47000,'47 kΩ'],[100000,'100 kΩ']]},{k:'pos',label:'Knob',range:[0,1,0.01],live:true}],
   model:(c,n,p)=>({a:c.R(n['1'],n['W'],Math.max(1,p.props.R*p.props.pos)),b:c.R(n['W'],n['3'],Math.max(1,p.props.R*(1-p.props.pos)))}),
   update:(el,p)=>{el.a.g=1/Math.max(1,p.props.R*p.props.pos);el.b.g=1/Math.max(1,p.props.R*(1-p.props.pos));},
   watch:(el)=>({I:Math.max(Math.abs(el.a.i),Math.abs(el.b.i)),P:el.a.p+el.b.p,info:[['Wiper current',fmtI(el.a.i-el.b.i)],['Power',fmtP(el.a.p+el.b.p)]],over:el.a.p+el.b.p>0.25?'more than ¼ W':''})},
 cap:{name:'Capacitor',group:'Passive',icon:'⊣',foot:[[0,0],[0,2]],pins:['+','−'],rotate:true,dynamic:true,
   props:{kind:'ceramic',C:100e-9,Vmax:50},
   label:p=>(p.props.kind==='electrolytic'?'Electrolytic':'Ceramic')+' capacitor '+fmtC(p.props.C),
   legName:(p,pin)=>p.props.kind==='electrolytic'?pin:{'+':'1','−':'2'}[pin],
   edit:[{k:'kind',label:'Type',opts:[['ceramic','Ceramic: 1 nF–1 µF, no + or −'],['electrolytic','Electrolytic: 1 µF and up, has + and −']],
          set:p=>{const vs=capValues(p);if(!vs.includes(p.props.C))p.props.C=p.props.kind==='electrolytic'?vs[0]:vs[vs.length-1];p.props.Vmax=p.props.kind==='electrolytic'?25:50;}},
         {k:'C',label:'Value',opts:p=>capValues(p).map(v=>[v,fmtC(v)])},
         {k:'Vmax',label:'Rated',opts:[[16,'16 V'],[25,'25 V'],[63,'63 V']],show:p=>p.props.kind==='electrolytic'}],
   model:(c,n,p)=>({c:c.C(n['+'],n['−'],p.props.C)}),
   watch:(el,p)=>{const ele=p.props.kind==='electrolytic';return {I:el.c.i,info:[['Voltage',fmtV(el.c.v)+' / '+p.props.Vmax+' V max'],['Current',fmtI(el.c.i)]],
     over:Math.abs(el.c.v)>p.props.Vmax?`more than its ${p.props.Vmax} V rating`:ele&&el.c.v<-1.5?'connected backwards (+ on the − side)':''};}},
 led:{name:'LED',label:p=>'LED ('+p.props.color+')',group:'Semiconductors',icon:'💡',foot:[[0,0],[0,1]],pins:['+','−'],rotate:true,
   props:{color:'red'},edit:[{k:'color',label:'Colour',opts:Object.keys(LEDS).map(k=>[k,k])}],
   model:(c,n,p)=>{const L=LEDS[p.props.color];return {d:c.D(n['+'],n['−'],diodeIs(L.vf,2),2),q:0,t:0,b:0};},
   tick:(el,dt)=>{el.q+=el.d.i*dt;el.t+=dt;},                                     // average current since the last look
   watch:(el)=>{const I=el.t?el.q/el.t:el.d.i;el.q=0;el.t=0;el.b=Math.max(Math.min(1,Math.max(0,I)/0.012),el.b*0.85);
     return {I,vrev:-el.d.v,bright:el.b,info:[['Current',fmtI(I)+' (max 30 mA)'],['Voltage',fmtV(el.d.v)]],over:I>0.03?'more than 30 mA: add or increase its resistor':''};}},
 diode:{name:'Diode',group:'Semiconductors',icon:'▷|',foot:[[0,0],[0,4]],pins:['A','K'],rotate:true,props:{kind:'1N4007'},
   label:p=>'Diode '+p.props.kind,legName:(p,pin)=>pin==='A'?'A (anode)':'K (stripe)',
   edit:[{k:'kind',label:'Model',opts:[['1N4007','1N4007: rectifier, 1 A'],['1N4148','1N4148: small signal, 200 mA']]}],
   model:(c,n,p)=>{const D=DIODES[p.props.kind];return {d:c.D(n['A'],n['K'],diodeIs(D.vf,D.n),D.n)};},
   watch:(el,p)=>{const D=DIODES[p.props.kind];return {I:el.d.i,info:[['Current',fmtI(el.d.i)+' (max '+D.lab+')'],['Voltage',fmtV(el.d.v)]],over:el.d.i>D.Imax?'more than '+D.lab:''};}},
 npn:{name:'NPN transistor',group:'Semiconductors',icon:'T',foot:[[0,0],[0,1],[0,2]],pins:['C','B','E'],rotate:true,props:{kind:'BC547'},label:p=>'Transistor '+p.props.kind,
   edit:[{k:'kind',label:'Model',opts:[['BC547','BC547 (small: 100 mA)'],['SS8050','SS8050 (stronger: 1.5 A)']]}],
   model:(c,n,p)=>({q:c.Q(n['C'],n['B'],n['E'],p.props.kind==='SS8050'?2e-14:7e-15,200,2),vpk:0}),
   tick:(el)=>{if(el.q.vce>el.vpk)el.vpk=el.q.vce;},
   watch:(el,p)=>{const big=p.props.kind==='SS8050',Imax=big?1.5:0.1,Pmax=big?1:0.5,Vmax=big?25:45,pk=el.vpk;el.vpk=0;
     if(pk>Vmax)return {I:el.q.ic,kill:true,info:[],over:`a spike of ${Math.round(pk)} V between C and E (max ${Vmax} V): a coil was switched off with no flyback diode across it`};
     return {I:el.q.ic,P:el.q.p,info:[['Collector',fmtI(el.q.ic)+' (max '+(big?'1.5 A':'100 mA')+')'],['Base',fmtI(el.q.ib)],['C–E voltage',fmtV(el.q.vce)],['Power',fmtP(el.q.p)]],
     over:el.q.ic>Imax?'more than '+(big?'1.5 A':'100 mA')+' in the collector'+(big?'':' (for a motor, use the SS8050)'):el.q.p>Pmax?'more than '+Pmax+' W':el.q.ib>0.02?'more than 20 mA into the base: add a base resistor':''};}},
 btn:{name:'Push button',group:'Switches & sensors',icon:'⏺',foot:[[0,0],[0,2],[1,0],[1,2]],pins:['1a','2a','1b','2b'],pairs:[['1a','1b'],['2a','2b']],anchor:'e',rotate:false,
   props:{pressed:false},edit:[{k:'pressed',label:'Press',hold:true}],
   model:(c,n,p)=>({k1:c.SW(n['1a'],n['1b'],true),k2:c.SW(n['2a'],n['2b'],true),s:c.SW(n['1a'],n['2a'],p.props.pressed)}),
   update:(el,p)=>{el.s.on=p.props.pressed;},
   watch:(el,p)=>({I:el.s.i,info:[['State',p.props.pressed?'pressed':'released'],['Current',fmtI(el.s.i)]]})},
 sw:{name:'Slide switch',group:'Switches & sensors',icon:'⇆',foot:[[0,0],[0,2]],pins:['1','2'],rotate:true,props:{on:true},edit:[{k:'on',label:'Switch',toggle:['ON','OFF']}],
   model:(c,n,p)=>({s:c.SW(n['1'],n['2'],p.props.on)}),update:(el,p)=>{el.s.on=p.props.on;},
   watch:(el,p)=>({I:el.s.i,info:[['State',p.props.on?'ON':'OFF'],['Current',fmtI(el.s.i)]]})},
 ldr:{name:'LDR (light sensor)',group:'Switches & sensors',icon:'☀',foot:[[0,0],[0,2]],pins:['1','2'],rotate:true,props:{light:0.5},edit:[{k:'light',label:'Light',range:[0,1,0.01],live:true}],
   model:(c,n,p)=>({r:c.R(n['1'],n['2'],Math.pow(10,6-3*p.props.light))}),update:(el,p)=>{el.r.g=1/Math.pow(10,6-3*p.props.light);},
   watch:(el,p)=>({I:el.r.i,P:el.r.p,info:[['Resistance',fmtR(Math.pow(10,6-3*p.props.light))],['Current',fmtI(el.r.i)]],over:el.r.p>0.1?'more than 100 mW':''})},
 buz:{name:'Buzzer (active)',group:'Output',icon:'🔔',foot:[[0,0],[0,3]],pins:['+','−'],rotate:true,props:{},edit:[],
   model:(c,n)=>({r:c.R(n['+'],n['−'],200)}),
   watch:(el)=>({I:el.r.i,sound:el.r.v>2.5,info:[['Voltage',fmtV(el.r.v)+' (sounds above 2.5 V)'],['Current',fmtI(el.r.i)]],over:el.r.v>15?'more than 15 V':el.r.v<-1?'connected backwards':''})},
 motor:{name:'DC motor',group:'Output',icon:'M',foot:[[0,0],[0,3]],pins:['1','2'],rotate:true,props:{},edit:[],
   dynamic:true,model:(c,n)=>({m:c.Motor(n['1'],n['2'],4.5,0.0086,3.3e-6,1.34e-6)}),
   watch:(el)=>({I:el.m.i,spin:el.m.w,info:[['Speed',Math.round(Math.abs(el.m.w)*60/6.283)+' rpm'],['Current',fmtI(el.m.i)]],over:Math.abs(el.m.i)>2.5?'more than 2.5 A (stalled at too high a voltage)':''})},
 lamp:{name:'Bulb 12 V',group:'Output',icon:'🔆',foot:[[0,0],[0,3]],pins:['1','2'],rotate:true,props:{},edit:[],
   model:(c,n)=>({r:c.R(n['1'],n['2'],120)}),                                  // 12 V, 100 mA when hot
   watch:(el)=>({I:el.r.i,P:el.r.p,bright:Math.min(1,el.r.p/1.2),info:[['Voltage',fmtV(Math.abs(el.r.v))+' (made for 12 V)'],['Current',fmtI(el.r.i)],['Power',fmtP(el.r.p)]],
     over:Math.abs(el.r.v)>15?'more than 15 V: the filament blows':''})},
 relay:{name:'Relay',group:'Output',icon:'⎍',foot:[[-1,0],[-1,4],[0,0],[0,2],[0,4]],pins:['C1','C2','COM','NC','NO'],anchor:'f',rotate:false,leads:true,dynamic:true,
   props:{kind:'12'},label:p=>RELAYS[p.props.kind].lab,optional:['COM','NC','NO'],
   legName:(p,pin)=>({C1:'coil',C2:'coil',COM:'COM (common)',NC:'NC (closed at rest)',NO:'NO (open at rest)'})[pin],
   edit:[{k:'kind',label:'Model',opts:[['12','12 V, coil 400 Ω (RWH-SS-112D)'],['5','5 V, coil 70 Ω (RWH-SS-105D)']]}],
   model:(c,n,p)=>{const K=RELAYS[p.props.kind],x=c.node();
     return {K,r:c.R(n['C1'],x,K.R),l:c.L(x,n['C2'],K.L),no:c.SW(n['COM'],n['NO'],false),nc:c.SW(n['COM'],n['NC'],true),on:false,flip:0,heat:0};},
   // the contact moves when the coil current passes the pull-in value, and falls back well below it
   // kick: the coil voltage turned against its current by more than 3 V = nothing catches the switch-off spike. The simulator's
   // 0.2 ms steps are too slow to show its real height (hundreds of volts: a transistor cuts the current in microseconds).
   tick:(el,dt)=>{const i=Math.abs(el.l.i);el.heat+=(el.r.v*el.r.v/el.K.R-el.heat)*Math.min(1,dt/5);   // coil power averaged over ~5 s
     if(!el.on&&i>el.K.on||el.on&&i<el.K.off){el.on=!el.on;el.flip=typeof performance!=='undefined'?performance.now():0;}
     el.no.on=el.on;el.nc.on=!el.on;if(i>0.001&&(el.r.v+el.l.v)*Math.sign(el.l.i)<-3)el.kick=true;},
   watch:(el)=>{const K=el.K,ic=Math.abs(el.on?el.no.i:el.nc.i);
     const kick=el.kick;el.kick=false;
     return {I:el.l.i,on:el.on,flip:el.flip,kick,info:[['Coil',fmtI(el.l.i)+' (clicks in above '+fmtI(K.on)+')'],['Contact',el.on?'COM → NO closed':'COM → NC closed (at rest)'],['Contact current',fmtI(ic)]],
     over:el.heat>4*K.Vn*K.Vn/K.R?`its coil had more than twice its ${K.Vn} V for too long: it overheated`:ic>10?'more than 10 A through the contact':''};}},
 spk:{name:'Speaker 8 Ω',group:'Output',icon:'🔊',foot:[[0,0],[0,3]],pins:['+','−'],rotate:true,props:{},edit:[],dynamic:true,
   model:(c,n)=>({r:c.R(n['+'],n['−'],8),ms:0,heat:0}),
   // mean square current over the last ~50 ms (what you hear) and over ~1 s (what heats the coil)
   tick:(el,dt)=>{const i2=el.r.i*el.r.i;el.ms+=(i2-el.ms)*Math.min(1,dt/0.05);el.heat+=(i2-el.heat)*Math.min(1,dt/1);},
   watch:(el)=>{const P=el.ms*8,rms=Math.sqrt(el.ms)*8;return {I:Math.sqrt(el.ms),P,level:Math.min(1,rms/2),info:[['Signal (RMS)',fmtV(rms)],['Power',fmtP(P)+' (max 500 mW)']],
     over:el.heat*8>0.5?'more than 0.5 W for too long: the coil overheats':''};}},
 ne555:{name:'NE555 timer',group:'Chips',icon:'555',chip:'NE555',foot:dip(8),pins:pinList(8),anchor:'f',rotate:false,props:{},edit:[],dynamic:true,
   pinNames:['GND','TRIG','OUT','RESET','CTRL','THR','DIS','VCC'],supply:{plus:'8',minus:'1'},optional:['5'],
   tie:[['4','pin 4 (reset) is floating: connect it to + so the timer runs']],
   model:(c,n)=>({t:c.T555(n['1'],n['2'],n['3'],n['4'],n['5'],n['6'],n['7'],n['8'])}),
   watch:(el)=>({I:0,info:[['Supply (8 → 1)',fmtV(el.t.vcc||0)],['Output (pin 3)',el.t.q?'HIGH':'LOW']],over:(el.t.vcc||0)>16?'more than 16 V on the supply':(el.t.vcc||0)<-0.5?'powered backwards':''})},
 cd4017:{name:'CD4017 counter',group:'Chips',icon:'4017',chip:'CD4017',foot:dip(16),pins:pinList(16),anchor:'f',rotate:false,props:{},edit:[],dynamic:true,
   pinNames:['Q5','Q1','Q0','Q2','Q6','Q7','Q3','VSS (−)','Q8','Q4','Q9','CARRY','CLK INH','CLK','RESET','VDD (+)'],supply:{plus:'16',minus:'8'},
   optional:[...Q_PINS,'12'],tie:[['13','pin 13 (clock inhibit) is floating: connect it to − so the counter counts'],['15','pin 15 (reset) is floating: connect it to − (or to a reset button)']],
   model:(c,n)=>{const P=[0];for(let k=1;k<=16;k++)P.push(n[String(k)]);return {u:c.C4017(P)};},
   watch:(el)=>({I:el.u.imax||0,info:[['Supply (16 → 8)',fmtV(el.u.vdd||0)],['Count','Q'+el.u.count+' (pin '+Q_PINS[el.u.count]+') is HIGH'],['Clock (pin 14)',el.u.clk?'HIGH':'LOW']],
     over:(el.u.vdd||0)>18?'more than 18 V on the supply':(el.u.vdd||0)<-0.5?'powered backwards':(el.u.imax||0)>0.025?'more than 25 mA out of an output':''})},
 lm358:{name:'LM358 dual op-amp',group:'Chips',icon:'358',chip:'LM358',foot:dip(8),pins:pinList(8),anchor:'f',rotate:false,props:{},edit:[],dynamic:true,
   pinNames:['OUT A','IN− A','IN+ A','GND','IN+ B','IN− B','OUT B','VCC'],supply:{plus:'8',minus:'4'},optional:['1','2','3','5','6','7'],
   model:(c,n)=>({q:c.R(n['8'],n['4'],12000),a:c.Amp(n['3'],n['2'],n['1'],n['4'],n['8']),b:c.Amp(n['5'],n['6'],n['7'],n['4'],n['8'])}),
   watch:(el)=>{const vs=el.a.vs||0,imax=Math.max(Math.abs(el.a.i),Math.abs(el.b.i));
     return {I:imax,info:[['Supply (8 → 4)',fmtV(vs)],['Out A (pin 1)',fmtV(el.a.v)],['Out B (pin 7)',fmtV(el.b.v)],['Note','an output reaches at most supply − 1.5 V']],
     over:vs>32?'more than 32 V on the supply':vs<-0.5?'powered backwards':imax>0.04?'more than 40 mA out of an output':''};}},
 lm386:{name:'LM386 audio amp',group:'Chips',icon:'386',chip:'LM386',foot:dip(8),pins:pinList(8),anchor:'f',rotate:false,props:{},edit:[],dynamic:true,
   pinNames:['GAIN','IN−','IN+','GND','OUT','VS','BYPASS','GAIN'],supply:{plus:'6',minus:'4'},optional:['1','7','8'],
   model:(c,n)=>({i2:c.R(n['2'],n['4'],50000),i3:c.R(n['3'],n['4'],50000),q:c.R(n['6'],n['4'],2250),
     a:c.Amp(n['3'],n['2'],n['5'],n['4'],n['6'],{mode:'fixed',G:20,ro:0.5,dlo:0.5,dhi:0.8})}),
   watch:(el)=>{const vs=el.a.vs||0,P=(el.a.pavg||0)+Math.max(0,vs)*0.004;
     return {I:Math.abs(el.a.i),P,info:[['Supply (6 → 4)',fmtV(vs)],['Output (pin 5)',fmtV(el.a.v)],['Gain','× 20 (pins 1 and 8 open)'],['Chip heat',fmtP(P)+' (max 1.25 W)']],
     over:vs>15?'more than 15 V on the supply':vs<-0.5?'powered backwards':P>1.25?'more than 1.25 W: it overheats':''};}},
};
const partName=p=>{const T=PARTS[p.type];return T.label?T.label(p):T.name;};
const legName=(p,pin)=>{const T=PARTS[p.type];return T.legName?T.legName(p,pin):T.pinNames?pin+' '+T.pinNames[+pin-1]:pin;};
// boards saved before diodes and capacitors had a model switch
function migrate(st){(st.parts||[]).forEach(p=>{
  if(p.type==='d4007'||p.type==='d4148'){p.props={kind:p.type==='d4007'?'1N4007':'1N4148'};p.type='diode';}
  else if(p.type==='ccap'){p.holes={'+':p.holes['1'],'−':p.holes['2']};p.props={kind:'ceramic',C:p.props.C,Vmax:50};p.type='cap';}
  else if(p.type==='ecap'){p.props={kind:'electrolytic',C:p.props.C,Vmax:p.props.Vmax||25};p.type='cap';}});return st;}
const GROUPS=[...new Set(Object.values(PARTS).map(p=>p.group))];
