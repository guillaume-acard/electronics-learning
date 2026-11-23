// ===== 4056: data (pinout, inside, minimal circuit, hero art) + its demo =====
CHIP('4056',{
pinout:{pkg:'dip',title:'TP4056 (SOP-8, on the module)',pins:[
 [1,'TEMP','in','Battery temperature input (for a thermistor in the battery pack). Charging pauses if out of range.','On the modules: tied to ground (feature off).'],
 [2,'PROG','ctl','Sets the charge current: I = 1200 ÷ R (in A, R in Ω). Its voltage also shows the current being delivered.','A resistor to ground: 1.2 kΩ = 1 A (module default), 2.4 kΩ = 0.5 A, 10 kΩ = 130 mA.'],
 [3,'GND','gnd','Ground.','To USB −.'],
 [4,'VCC','pwr','Supply, 4.5–8 V (5 V USB).','From USB +, with a capacitor to ground.'],
 [5,'BAT','out','Battery output: charges with constant current, then holds exactly 4.2 V.','To the cell + (through the BMS protection module).'],
 [6,'STDBY','out','"Done" signal: goes low (on) when the battery is full. Open-drain.','Green LED + 1 kΩ from VCC.'],
 [7,'CHRG','out','"Charging" signal: low (on) while charging. Open-drain.','Red LED + 1 kΩ from VCC.'],
 [8,'CE','ctl','Chip enable: high = charger on, low = off.','Tied to VCC on the modules.']]},
inside:({ln,tx,bx,dot,tp,cmp,res,gnd,arrow})=>{let s='';
  s+=ln('40,80 200,80',4)+tp(40,80,4,'l')+bx(200,55,150,50,'Power transistor\n(the valve)',PAL.amber)+ln('350,80 540,80',5)+tp(540,80,5,'r');
  s+=bx(200,150,150,70,'Control loop\nconstant current →\nconstant 4.2 V');s+=ln('275,150 275,105');s+=ln('450,80 450,185 350,185');
  s+=ln('40,190 200,190',2)+tp(40,190,2,'l')+tx(120,180,'sets the current',{s:11,c:PAL.muted});
  s+=ln('40,250 200,250',1)+tp(40,250,1,'l')+bx(200,232,150,36,'Battery temp check');
  s+=ln('40,30 275,30 275,55',8)+tp(40,30,8,'l');
  s+=bx(400,200,110,60,'Status\n(open-drain)',PAL.good)+ln('510,215 540,215',7)+tp(540,215,7,'r')+ln('510,245 540,245',6)+tp(540,245,6,'r');
  s+=ln('300,300 300,268',3)+tp(300,300,3,'b');
  return {vb:'-70 0 700 330',s};},
minimal:{title:'TP4056: the charger module\'s circuit',sub:'already built on the module: here is what\'s around the chip',rows:[
 [1,[[[],'GND']],'TEMP: no battery thermistor, so grounded.'],
 [2,[[['R:1.2 kΩ'],'GND']],'PROG: 1.2 kΩ → 1 A charge current (I = 1200 ÷ R).'],
 [3,[[[],'GND']],'Ground.'],
 [4,[[[],'IN:+5 V USB'],[['C:10 µF+'],'GND']],'VCC: USB 5 V, decoupled.'],
 [5,[[[],'T:battery + (via BMS)'],[['C:10 µF+'],'GND']],'BAT: to the cell; ends at 4.2 V.'],
 [6,[[['LED:g','R:1 kΩ'],'V5']],'STDBY: pulls the green LED low (on) when full.'],
 [7,[[['LED:r','R:1 kΩ'],'V5']],'CHRG: pulls the red LED low (on) while charging.'],
 [8,[[[],'V5']],'CE: enable, tied to 5 V.']]},
art:dipArt('TP4056',8,'Li-ion charger',PAL.amber)});

(function(){
const TPS={t:0,run:true};const TPR=[[10000,'10 kΩ → 130 mA'],[4000,'4 kΩ → 300 mA'],[2400,'2.4 kΩ → 500 mA'],[1200,'1.2 kΩ → 1 A']];
document.getElementById('tpGo').addEventListener('click',e=>{TPS.t=0;TPS.run=true;});
function tpModel(tt,Ic){let v,i;const tcc=2.6*(1/Ic);if(tt<tcc){v=3.0+1.2*Math.pow(tt/tcc,0.6);i=Ic;}else{v=4.2;i=Ic*Math.exp(-(tt-tcc)/0.9);}return {v,i,done:i<Ic/10};}
function draw4056(dt){const c=document.getElementById('c4056');if(!c||!c.offsetParent)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const [R,lab]=TPR[+document.getElementById('tpR').value];document.getElementById('tpRl').textContent=lab;const Ic=1200/R;if(TPS.run)TPS.t+=dt;const T=TPS.t,m=tpModel(T,Ic);if(m.done)TPS.run=false;
  const gx=40,gy=30,gw=480,gh=200,tmax=2.6/Ic+3.5;ctx.fillStyle=PAL.panel;ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle=PAL.line;ctx.strokeRect(gx,gy,gw,gh);
  const plotF=(f,col,lo,hi)=>{ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();for(let k=0;k<=200;k++){const tt=k/200*Math.min(T,tmax);const y=gy+gh-(f(tpModel(tt,Ic))-lo)/(hi-lo)*gh;const x=gx+tt/tmax*gw;k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();};
  plotF(q=>q.v,PAL.blue,2.8,4.4);plotF(q=>q.i,PAL.amber,0,1.4);ctx.font='12px system-ui';ctx.textAlign='right';ctx.fillStyle=PAL.blue;ctx.fillText('battery voltage (→ 4.2 V)',gx+gw-8,gy+gh-28);ctx.fillStyle=PAL.amber;ctx.fillText('charge current',gx+gw-8,gy+gh-10);ctx.textAlign='left';
  const ycv=gy+gh-(4.2-2.8)/1.6*gh;ctx.setLineDash([4,4]);ctx.strokeStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(gx,ycv);ctx.lineTo(gx+gw,ycv);ctx.stroke();ctx.setLineDash([]);
  const phase=m.done?'FULL: charge stopped':m.v<4.19?'Phase 1: constant current':'Phase 2: constant voltage 4.2 V, current fading';ctx.fillStyle=PAL.ink;ctx.font='14px system-ui';ctx.fillText(phase,gx,gy+gh+28);
  ctx.textAlign='center';ctx.fillStyle=PAL.ink2;ctx.font='13px system-ui';ctx.fillText(m.v.toFixed(2)+' V · '+(m.i*1000).toFixed(0)+' mA',660,70);
  [['CHRG',!m.done,'239,68,68',620],['STDBY',m.done,'34,197,94',700]].forEach(([l,on,rgb,x])=>{ctx.fillStyle=`rgba(${rgb},${on?1:0.2})`;if(on){ctx.shadowBlur=16;ctx.shadowColor=`rgb(${rgb})`;}ctx.beginPath();ctx.arc(x,140,13,0,7);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle=PAL.muted;ctx.font='12px system-ui';ctx.fillText(l,x,172);});
  ctx.fillStyle='#0f766e';ctx.fillRect(600,200,110,34);ctx.fillStyle=PAL.green;const f=Math.min(1,(m.v-3)/1.2*0.85+(m.done?0.15:0));ctx.fillRect(604,204,102*f,26);ctx.fillStyle=PAL.white;ctx.fillText('18650',655,222);}
loop((dt,now)=>{draw4056(dt);});
})();
