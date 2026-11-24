// Reference circuits for the Build lab simulator:  node tools/simtest.js
const {Circuit,diodeIs,Q4017}=require('../src/pages/build/sim.js');
let fails=0;
function check(name,got,want,tol){const ok=Math.abs(got-want)<=tol;if(!ok)fails++;
  console.log(`${ok?'ok  ':'FAIL'} ${name}: ${+got.toPrecision(4)} (expected ${want} ± ${tol})`);}
const LED_R=()=>({Is:diodeIs(1.9,2),n:2});
function battery(c,V=9){const p=c.node();c.Vs(p,0,V,1.5);return p;}

{ // 1. LED + 470 Ω on a 9 V battery
  const c=new Circuit(),p=battery(c),m=c.node();const r=c.R(p,m,470),d=c.D(m,0,LED_R().Is,2);
  c.step(1e-3);check('LED + 470 Ω current (mA)',d.i*1e3,15,1);check('LED forward voltage (V)',d.v,1.9,0.1);}
{ // 2. divider 10 k / 10 k
  const c=new Circuit(),p=battery(c),m=c.node();c.R(p,m,1e4);c.R(m,0,1e4);c.step(1e-3);check('divider (V)',c.v(m),4.5,0.01);}
{ // 3. RC charge: 10 k, 100 µF -> 63 % after 1 s
  const c=new Circuit(),p=battery(c),m=c.node();c.R(p,m,1e4);const C=c.C(m,0,100e-6);for(let i=0;i<5000;i++)c.step(2e-4);
  check('RC after one time constant (V)',C.v,9*(1-Math.exp(-1)),0.06);}
{ // 4. BC547 switch: base 10 k from +, LED + 470 Ω in the collector
  const c=new Circuit(),p=battery(c),b=c.node(),k=c.node(),col=c.node();c.R(p,b,1e4);c.R(p,k,470);const d=c.D(k,col,LED_R().Is,2);
  const q=c.Q(col,b,0,7e-15,200,2);for(let i=0;i<5;i++)c.step(1e-3);
  check('transistor: LED current (mA)',d.i*1e3,15,1.2);check('transistor: Vce saturated (V)',q.vce,0.1,0.15);
  check('transistor: base current (mA)',q.ib*1e3,0.83,0.06);}
{ // 5. NE555 astable, project 8 values: R1 1 k, R2 47 k, C 10 µF -> 1.44/((R1+2R2)C) = 1.52 Hz
  const c=new Circuit(),p=battery(c),dis=c.node(),thr=c.node(),out=c.node(),ctl=c.node();
  c.R(p,dis,1000);c.R(dis,thr,47000);c.C(thr,0,10e-6);c.C(ctl,0,10e-9);
  const t=c.T555(0,thr,out,p,ctl,thr,dis,p);let last=0,rises=[],vmax=0;
  for(let i=0;i<30000;i++){c.step(2e-4);const q=t.q;if(q&&!last)rises.push(c.t);last=q;vmax=Math.max(vmax,c.v(out));}
  const per=(rises[rises.length-1]-rises[1])/(rises.length-2);check('555 astable frequency (Hz)',1/per,1.52,0.15);
  check('555 output high (V)',vmax,7.3,0.2);}
{ // 6. LED straight on 9 V (no resistor): huge current (it would burn)
  const c=new Circuit(),p=battery(c);const d=c.D(p,0,LED_R().Is,2);c.step(1e-3);check('LED without resistor: current > 1 A',d.i>1?1:0,1,0);}
{ // 7. motor on 9 V reaches ~ no-load speed
  const c=new Circuit(),p=battery(c);const m=c.Motor(p,0,4.5,0.0086,3.3e-6,1.34e-6);for(let i=0;i<10000;i++)c.step(2e-4);
  check('motor no-load speed (rpm)',m.w*60/(2*Math.PI),8500,900);check('motor no-load current (A)',m.i,0.15,0.1);}
{ // 8. CD4017: 10 clock pulses from a square wave -> back to Q0; 3 pulses -> Q3 high, LED on it lit
  const c=new Circuit(),p=battery(c),clk=c.node(),P=[0];for(let k=1;k<=16;k++)P.push(c.node());
  const sq=c.Vs(clk,0,0,10);c.R(clk,P[14],100);c.R(P[16],p,0.01);c.R(P[8],0,0.01);c.R(P[13],0,0.01);c.R(P[15],0,0.01);
  const led=c.node(),d=c.D(led,0,LED_R().Is,2);c.R(P[7],led,470);   // pin 7 = Q3
  const u=c.C4017(P);const pulse=()=>{sq.V=9;for(let i=0;i<5;i++)c.step(1e-3);sq.V=0;for(let i=0;i<5;i++)c.step(1e-3);};
  for(let i=0;i<3;i++)pulse();check('4017: count after 3 pulses',u.count,3,0);check('4017: LED on Q3 (mA)',d.i*1e3,7.5,2);
  for(let i=0;i<7;i++)pulse();check('4017: count after 10 pulses',u.count,0,0);}
{ // 9. LM358: non-inverting amplifier, gain 1 + 10k/10k = 2, 1.5 V in -> 3 V out; comparator saturates at 9 - 1.5 V
  const c=new Circuit(),p=battery(c),vin=c.node(),o=c.node(),n=c.node();c.Vs(vin,0,1.5,1);c.R(o,n,1e4);c.R(n,0,1e4);c.R(o,0,1e4);
  const a=c.Amp(vin,n,o,0,p);for(let i=0;i<50;i++)c.step(2e-4);check('LM358 gain-2 amplifier (V)',c.v(o),3,0.02);
  const c2=new Circuit(),p2=battery(c2),i2=c2.node(),o2=c2.node();c2.Vs(i2,0,5,1);c2.R(o2,0,1e4);c2.Amp(i2,0,o2,0,p2);for(let k=0;k<10;k++)c2.step(2e-4);
  check('LM358 comparator high (V)',c2.v(o2),7.5,0.1);}
{ // 10. LM386 (gain 20): 0.1 V at 440 Hz in -> about 2 V peak on an 8 Ω speaker through 220 µF
  const c=new Circuit(),p=battery(c),i=c.node(),o=c.node(),s=c.node();c.Vac(i,0,0.1,440,10);
  c.R(p,0,2250);const a=c.Amp(i,0,o,0,p,{mode:'fixed',G:20,ro:0.5,dlo:0.5,dhi:0.8});c.C(o,s,220e-6);c.R(s,0,8);let pk=0,avg=0;
  for(let k=0;k<5000;k++){c.step(2e-4);if(k>2500){pk=Math.max(pk,Math.abs(c.v(s)));avg+=c.v(o)/2499;}}check('LM386 speaker peak (V)',pk,2,0.25);
  check('LM386 output bias, average (V)',avg,4.5,0.1);}
{ // 11. LM358 comparator with hysteresis (as in the light detector): input swept up then down over 3 s, the output follows both ways
  const c=new Circuit(),p=battery(c),src=c.node(),ip=c.node(),ref=c.node(),o=c.node();const vs=c.Vs(src,0,0,1);
  c.R(src,ip,1e4);c.R(o,ip,1e6);c.R(p,ref,1e4);c.R(ref,0,1e4);const a=c.Amp(ip,ref,o,0,p);let up=null,down=null,prev=0;
  for(let k=0;k<=400;k++){vs.V=9*(k<=200?k:400-k)/200;for(let j=0;j<40;j++)c.step(2e-4);const hi=c.v(o)>4?1:0;
    if(hi&&!prev)up=vs.V;if(!hi&&prev)down=vs.V;prev=hi;}
  check('comparator switches on near (V)',up||0,4.5,0.15);check('comparator switches off near (V)',down||0,4.45,0.15);}
console.log(fails?`${fails} failure(s)`:'all simulator tests passed');process.exit(fails?1:0);
