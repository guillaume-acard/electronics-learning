// Reference circuits for the Build lab simulator:  node tools/simtest.js
const {Circuit,diodeIs}=require('../src/pages/build/sim.js');
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
console.log(fails?`${fails} failure(s)`:'all simulator tests passed');process.exit(fails?1:0);
