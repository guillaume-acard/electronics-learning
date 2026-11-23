// ===== Build lab: the parts catalog =====
// One entry per part type. foot: the holes its legs use, as [row offset, column offset] from the anchor hole,
// in the row order of ROWS (tp tn a b c d e f g h i j bp bn); it turns with the part (rot 0–3).
// anchor: rows the anchor may use ('rails' = tp/bp only, 'e'/'f' = straddles the gap). props: default values.
// edit: what the Properties panel shows. model(): adds the part to the simulator. watch(): what we read back
// (current, power, light...) and the limits that burn it.
const RES_VALUES=[];for(let d=10;d<=100000;d*=10)E12.forEach(v=>RES_VALUES.push(Math.round(v*d)));RES_VALUES.push(1e6);   // E12 from helpers2.js
const CAP_VALUES=[1e-9,2.2e-9,4.7e-9,10e-9,22e-9,47e-9,100e-9,220e-9,470e-9,1e-6,2.2e-6,4.7e-6,10e-6,22e-6,47e-6,100e-6,220e-6,470e-6,1000e-6];
const LEDS={red:{rgb:'239,68,68',vf:1.9},yellow:{rgb:'250,204,21',vf:2.0},green:{rgb:'34,197,94',vf:2.1},blue:{rgb:'59,130,246',vf:3.0},white:{rgb:'226,232,240',vf:3.0}};
const fmtR=r=>r>=1e6?+(r/1e6).toPrecision(3)+' MΩ':r>=1e3?+(r/1e3).toPrecision(3)+' kΩ':+r.toPrecision(3)+' Ω';
const fmtC=c=>c>=1e-6?+(c*1e6).toPrecision(3)+' µF':c>=1e-9?+(c*1e9).toPrecision(3)+' nF':+(c*1e12).toPrecision(3)+' pF';
const fmtI=i=>{i=Math.abs(i);return i<1e-6?'0 mA':i<1e-3?(i*1e6).toFixed(0)+' µA':i<1?(i*1e3).toFixed(i<0.01?2:1)+' mA':i.toFixed(2)+' A';};
const fmtV=v=>Math.abs(v)<1?(v*1000).toFixed(0)+' mV':v.toFixed(2)+' V';
const fmtP=p=>p<1?(p*1000).toFixed(0)+' mW':p.toFixed(2)+' W';

const PARTS={
 batt:{name:'9 V battery',group:'Power',icon:'🔋',foot:[[0,0],[1,1]],pins:['+','−'],anchor:'rails',rotate:false,
   props:{V:9},edit:[{k:'V',label:'Voltage',opts:[[9,'9 V'],[4.5,'4.5 V (3 × AA)'],[3,'3 V (2 × AA)']]}],
   model:(c,n,p)=>({bat:c.Vs(n['+'],n['−'],p.props.V,1.5)}),
   watch:(el)=>({I:el.bat.i,P:Math.abs(el.bat.i*el.bat.v),info:[['Delivers',fmtI(el.bat.i)],['Voltage',fmtV(el.bat.v)]]})},
 usb:{name:'USB 5 V module',group:'Power',icon:'⚡',foot:null,pins:['+','−'],fixed:{'+':'tp1','−':'tn1'},rotate:false,unique:true,
   props:{},edit:[],
   model:(c,n)=>({src:c.Vs(n['+'],n['−'],5,0.2)}),
   watch:(el)=>({I:el.src.i,info:[['Delivers',fmtI(el.src.i)],['Voltage',fmtV(el.src.v)]],over:el.src.i>0.8?'more than 0.8 A: the module cuts out':''})},
 res:{name:'Resistor',group:'Passive',icon:'Ω',foot:[[0,0],[0,4]],pins:['1','2'],rotate:true,
   props:{R:470},edit:[{k:'R',label:'Value',opts:RES_VALUES.map(v=>[v,fmtR(v)])}],
   model:(c,n,p)=>({r:c.R(n['1'],n['2'],p.props.R)}),
   watch:(el)=>({I:el.r.i,P:el.r.p,info:[['Current',fmtI(el.r.i)],['Voltage',fmtV(el.r.v)],['Power',fmtP(el.r.p)+' (max 250 mW)']],over:el.r.p>0.25?'more than ¼ W: it overheats':''})},
 pot:{name:'Trimmer / pot',group:'Passive',icon:'⟳',foot:[[0,0],[0,1],[0,2]],pins:['1','W','3'],rotate:true,
   props:{R:10000,pos:0.5},edit:[{k:'R',label:'Value',opts:[[1000,'1 kΩ'],[10000,'10 kΩ'],[47000,'47 kΩ'],[100000,'100 kΩ']]},{k:'pos',label:'Knob',range:[0,1,0.01],live:true}],
   model:(c,n,p)=>({a:c.R(n['1'],n['W'],Math.max(1,p.props.R*p.props.pos)),b:c.R(n['W'],n['3'],Math.max(1,p.props.R*(1-p.props.pos)))}),
   update:(el,p)=>{el.a.g=1/Math.max(1,p.props.R*p.props.pos);el.b.g=1/Math.max(1,p.props.R*(1-p.props.pos));},
   watch:(el)=>({I:Math.max(Math.abs(el.a.i),Math.abs(el.b.i)),P:el.a.p+el.b.p,info:[['Wiper current',fmtI(el.a.i-el.b.i)],['Power',fmtP(el.a.p+el.b.p)]],over:el.a.p+el.b.p>0.25?'more than ¼ W':''})},
 ccap:{name:'Ceramic capacitor',group:'Passive',icon:'⊥',foot:[[0,0],[0,2]],pins:['1','2'],rotate:true,
   props:{C:100e-9,Vmax:50},edit:[{k:'C',label:'Value',opts:CAP_VALUES.filter(v=>v<=1e-6).map(v=>[v,fmtC(v)])}],
   model:(c,n,p)=>({c:c.C(n['1'],n['2'],p.props.C)}),
   watch:(el,p)=>({I:el.c.i,info:[['Voltage',fmtV(el.c.v)],['Current',fmtI(el.c.i)]],over:Math.abs(el.c.v)>p.props.Vmax?`more than ${p.props.Vmax} V`:''})},
 ecap:{name:'Electrolytic capacitor',group:'Passive',icon:'⊣',foot:[[0,0],[0,2]],pins:['+','−'],rotate:true,
   props:{C:100e-6,Vmax:25},edit:[{k:'C',label:'Value',opts:CAP_VALUES.filter(v=>v>=1e-6).map(v=>[v,fmtC(v)])},{k:'Vmax',label:'Rated',opts:[[16,'16 V'],[25,'25 V'],[63,'63 V']]}],
   model:(c,n,p)=>({c:c.C(n['+'],n['−'],p.props.C)}),
   watch:(el,p)=>({I:el.c.i,info:[['Voltage',fmtV(el.c.v)],['Charge',fmtV(el.c.v)+' / '+p.props.Vmax+' V max']],
     over:el.c.v>p.props.Vmax?`more than its ${p.props.Vmax} V rating`:el.c.v<-1.5?'connected backwards (+ on the − side)':''})},
 led:{name:'LED',group:'Semiconductors',icon:'💡',foot:[[0,0],[0,1]],pins:['+','−'],rotate:true,
   props:{color:'red'},edit:[{k:'color',label:'Colour',opts:Object.keys(LEDS).map(k=>[k,k])}],
   model:(c,n,p)=>{const L=LEDS[p.props.color];return {d:c.D(n['+'],n['−'],diodeIs(L.vf,2),2)};},
   watch:(el)=>({I:el.d.i,vrev:-el.d.v,bright:Math.min(1,Math.max(0,el.d.i)/0.012),info:[['Current',fmtI(el.d.i)+' (max 30 mA)'],['Voltage',fmtV(el.d.v)]],
     over:el.d.i>0.03?'more than 30 mA: add or increase its resistor':''})},
 d4007:{name:'Diode 1N4007',group:'Semiconductors',icon:'▷|',foot:[[0,0],[0,4]],pins:['A','K'],rotate:true,props:{},edit:[],
   model:(c,n)=>({d:c.D(n['A'],n['K'],diodeIs(0.72,1.8),1.8)}),
   watch:(el)=>({I:el.d.i,info:[['Current',fmtI(el.d.i)+' (max 1 A)'],['Voltage',fmtV(el.d.v)]],over:el.d.i>1?'more than 1 A':''})},
 d4148:{name:'Diode 1N4148',group:'Semiconductors',icon:'▷|',foot:[[0,0],[0,4]],pins:['A','K'],rotate:true,props:{},edit:[],
   model:(c,n)=>({d:c.D(n['A'],n['K'],diodeIs(0.68,1.9),1.9)}),
   watch:(el)=>({I:el.d.i,info:[['Current',fmtI(el.d.i)+' (max 200 mA)'],['Voltage',fmtV(el.d.v)]],over:el.d.i>0.2?'more than 200 mA':''})},
 npn:{name:'NPN transistor',group:'Semiconductors',icon:'T',foot:[[0,0],[0,1],[0,2]],pins:['C','B','E'],rotate:true,props:{kind:'BC547'},
   edit:[{k:'kind',label:'Model',opts:[['BC547','BC547 (small: 100 mA)'],['SS8050','SS8050 (stronger: 1.5 A)']]}],
   model:(c,n,p)=>({q:c.Q(n['C'],n['B'],n['E'],p.props.kind==='SS8050'?2e-14:7e-15,200,2)}),
   watch:(el,p)=>{const big=p.props.kind==='SS8050',Imax=big?1.5:0.1,Pmax=big?1:0.5;
     return {I:el.q.ic,P:el.q.p,info:[['Collector',fmtI(el.q.ic)+' (max '+(big?'1.5 A':'100 mA')+')'],['Base',fmtI(el.q.ib)],['C–E voltage',fmtV(el.q.vce)],['Power',fmtP(el.q.p)]],
     over:el.q.ic>Imax?'more than '+(big?'1.5 A':'100 mA')+' in the collector'+(big?'':' (for a motor, use the SS8050)'):el.q.p>Pmax?'more than '+Pmax+' W':el.q.ib>0.02?'more than 20 mA into the base: add a base resistor':''};}},
 btn:{name:'Push button',group:'Switches & sensors',icon:'⏺',foot:[[0,0],[0,2],[1,0],[1,2]],pins:['1a','2a','1b','2b'],anchor:'e',rotate:false,
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
   model:(c,n)=>({m:c.Motor(n['1'],n['2'],4.5,0.0086,3.3e-6,1.34e-6)}),
   watch:(el)=>({I:el.m.i,spin:el.m.w,info:[['Speed',Math.round(Math.abs(el.m.w)*60/6.283)+' rpm'],['Current',fmtI(el.m.i)]],over:Math.abs(el.m.i)>2.5?'more than 2.5 A (stalled at too high a voltage)':''})},
 ne555:{name:'NE555 timer',group:'Chips',icon:'555',foot:[[0,0],[0,1],[0,2],[0,3],[-1,3],[-1,2],[-1,1],[-1,0]],pins:['1','2','3','4','5','6','7','8'],anchor:'f',rotate:false,props:{},edit:[],
   model:(c,n)=>({t:c.T555(n['1'],n['2'],n['3'],n['4'],n['5'],n['6'],n['7'],n['8'])}),
   watch:(el)=>({I:0,info:[['Supply (8 → 1)',fmtV(el.t.vcc||0)],['Output (pin 3)',el.t.q?'HIGH':'LOW']],over:(el.t.vcc||0)>16?'more than 16 V on the supply':(el.t.vcc||0)<-0.5?'powered backwards':''})},
};
const GROUPS=[...new Set(Object.values(PARTS).map(p=>p.group))];
