// ===== 339: data (pinout, inside, minimal circuit, hero art) + its demo =====
CHIP('339',{
pinout:{pkg:'dip',title:'LM339N (DIP-14)',pins:[
 [1,'OUT2','out','Output of comparator 2. Open collector: connects to ground when IN2− is higher than IN2+, floats (off) otherwise.','Needs a pull-up resistor to + (10 kΩ), or an LED + resistor from + into the pin.'],
 [2,'OUT1','out','Output of comparator 1. Open collector: pulled to ground when IN1− > IN1+, off when IN1+ > IN1−. Sinks up to ~16 mA.','LED cathode side here, through 470 Ω to + (the LED lights when − is higher). Or 10 kΩ pull-up to + for a logic signal.'],
 [3,'VCC','pwr','Supply, 2–36 V (one supply, no negative needed).','To the + rail, with 100 nF to ground.'],
 [4,'IN1−','in','Inverting input of comparator 1. When it rises above IN1+, OUT1 goes low.','The signal (sensor), or the threshold, depending on which way you want the output to switch.'],
 [5,'IN1+','in','Non-inverting input of comparator 1. When it is above IN1−, OUT1 is off (high through the pull-up).','The threshold from a divider or trimmer, or the signal.'],
 [6,'IN2−','in','Inverting input of comparator 2.','Unused: tie to + (so the output stays off).'],
 [7,'IN2+','in','Non-inverting input of comparator 2.','Unused: tie to ground.'],
 [8,'IN3−','in','Inverting input of comparator 3.',''],
 [9,'IN3+','in','Non-inverting input of comparator 3.',''],
 [10,'IN4−','in','Inverting input of comparator 4.',''],
 [11,'IN4+','in','Non-inverting input of comparator 4.',''],
 [12,'GND','gnd','Ground.','To the − rail.'],
 [13,'OUT4','out','Output of comparator 4 (open collector).',''],
 [14,'OUT3','out','Output of comparator 3 (open collector).','']]},
inside:({ln,tx,bx,dot,tp,cmp,res,gnd,arrow})=>{let s='',pins='';
  [[110,90,4,5,2,0,'1'],[110,230,6,7,1,0,'2'],[490,90,8,9,14,1,'3'],[490,230,10,11,13,1,'4']].forEach(([x,y,m,p,o,f,l])=>{const d=f?-1:1,xin=f?560:40,xo=x+d*70,xp=f?340:260,xs=f?385:215;
    s+=ln(`${xin},${y-20} ${x},${y-20}`,m)+ln(`${xin},${y+20} ${x},${y+20}`,p)+cmp(x,y,'comparator '+l,f)+ln(`${xo},${y} ${xp},${y}`,o);
    s+=`<path d="M${xs} ${y}v10M${xs} ${y+10}l9 12M${xs} ${y+26}v4M${xs-8} ${y+30}h16M${xs-5} ${y+34}h10M${xs-2} ${y+38}h4" stroke="${PAL.good}" stroke-width="2" fill="none"/>`;
    pins+=tp(xin,y-20,m,f?'r':'l')+tp(xin,y+20,p,f?'r':'l')+tp(xp,y,o,'t');});
  s+=tx(300,160,'each output = a switch to ground',{s:11,c:PAL.good})+tx(300,176,'(closes when − is higher than +)',{s:11,c:PAL.muted});
  s+=tx(300,18,'3 VCC / 12 GND power all four',{s:11,c:PAL.muted});
  return {vb:'-70 0 730 330',s:s+pins};},
minimal:{title:'LM339: "is it dark?" LED (5 V)',sub:'comparator 1 used, the 3 others parked so they stay quiet',rows:[
 [1,[[[],'NC']],'OUT2: unused output, leave it free.'],
 [2,[[['LED:r','R:470 Ω'],'V5']],'OUT1: the LED and its resistor come from +5 V INTO the pin. When the output switches to ground, current flows and the LED lights.'],
 [3,[[[],'V5'],[['C:100 nF'],'GND']],'VCC: +5 V, with 100 nF decoupling.'],
 [4,[[['R:10 kΩ'],'V5'],[['LDR'],'GND']],'IN1−: the sensor divider. Darker → the LDR\'s resistance rises → this voltage rises.'],
 [5,[[['POT:10 kΩ'],'T:pot ends to + and −']],'IN1+: the threshold, from the trimmer\'s wiper. When IN1− climbs above it, OUT1 pulls to ground: the LED lights.'],
 [6,[[[],'V5']],'IN2− (unused): to +.'],[7,[[[],'GND']],'IN2+ (unused): to ground. With − above +, the unused output stays firmly on, instead of flickering.'],
 [8,[[[],'V5']],'IN3− (unused): to +.'],[9,[[[],'GND']],'IN3+ (unused): to ground.'],
 [10,[[[],'V5']],'IN4− (unused): to +.'],[11,[[[],'GND']],'IN4+ (unused): to ground.'],
 [12,[[[],'GND']],'GND: ground.'],
 [13,[[[],'NC']],'OUT4: unused, free.'],[14,[[[],'NC']],'OUT3: unused, free.']]},
art:dipArt('LM339',14,'Quad comparator',PAL.blue)});

(function(){
// ---------- LM339 ----------
function draw339(t){const c=$('c339');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const vs=+$('c9sig').value,vt=+$('c9thr').value,pu=$('c9pu').checked,yes=vs>vt;
  txt(ctx,`Is IN− (${vs.toFixed(2)} V) higher than IN+ (${vt.toFixed(2)} V)?  ${yes?'YES → output switched to ground':'NO → output transistor off'}`,400,24,yes?PAL.good:PAL.ink2,14,'center');
  // rails
  W(ctx,[[40,60],[760,60]],PAL.bad);txt(ctx,'+5 V',36,64,PAL.redSoft,12,'right');W(ctx,[[40,250],[760,250]],PAL.blue);txt(ctx,'0 V',36,254,PAL.blue,12,'right');
  // inputs
  W(ctx,[[120,125],[250,125]],PAL.sky);W(ctx,[[120,175],[250,175]],PAL.amber);
  txt(ctx,'signal',112,122,PAL.sky,12,'right');txt(ctx,vs.toFixed(2)+' V',112,138,PAL.sky,12,'right');
  txt(ctx,'threshold',112,172,PAL.amber,12,'right');txt(ctx,vt.toFixed(2)+' V',112,188,PAL.amber,12,'right');
  [[150,vs,PAL.sky,125],[200,vt,PAL.amber,175]].forEach(([x,v,col,y])=>{ctx.fillStyle=PAL.raised;ctx.fillRect(x-6,72,12,160);ctx.fillStyle=col;const h=v/5*160;ctx.fillRect(x-6,232-h,12,h);});
  ctx.fillStyle=PAL.panel;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(250,100);ctx.lineTo(340,150);ctx.lineTo(250,200);ctx.closePath();ctx.fill();ctx.stroke();
  txt(ctx,'−',262,130,PAL.ink,18,'center');txt(ctx,'+',262,182,PAL.ink,16,'center');txt(ctx,'LM339',290,216,PAL.muted,11);
  // open collector switch
  W(ctx,[[340,150],[400,150]]);txt(ctx,'drives',370,142,PAL.muted2,10);
  const nx=470;W(ctx,[[nx,150],[nx,165]]);part(ctx,'switch',nx,165,nx,235,{closed:yes,col:yes?PAL.good:PAL.muted});W(ctx,[[nx,235],[nx,250]]);
  ctx.setLineDash([4,4]);W(ctx,[[400,150],[445,200]],PAL.muted2,1.5);ctx.setLineDash([]);txt(ctx,'open collector',nx+14,205,PAL.muted,11,'left');
  // pull-up
  if(pu){part(ctx,'res',nx,60,nx,150,{label:'10 kΩ pull-up'});}else{ctx.setLineDash([3,6]);W(ctx,[[nx,70],[nx,140]],PAL.slateDark,2);ctx.setLineDash([]);txt(ctx,'(no pull-up)',nx+10,104,PAL.muted2,11,'left');}
  ctx.fillStyle=PAL.muted;ctx.beginPath();ctx.arc(nx,150,4,0,7);ctx.fill();
  // output reading
  W(ctx,[[nx,150],[600,150]]);let vo,state,col;
  if(yes){vo=0.05;state='LOW (0 V)';col=PAL.good;}else if(pu){vo=5;state='HIGH (5 V)';col=PAL.redSoft;}else{vo=1.5+1.5*Math.sin(t*7.3)+Math.sin(t*23.1);vo=Math.max(0,Math.min(5,vo));state='floating: random!';col=PAL.yellow;}
  ctx.fillStyle=PAL.panel;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(600,105,160,90,10);ctx.fill();ctx.stroke();
  txt(ctx,'OUT1 = '+vo.toFixed(2)+' V',680,138,PAL.ink,15,'center');txt(ctx,state,680,162,col,13);txt(ctx,'what a chip input reads',680,182,PAL.muted2,10);}
loop((dt,now)=>{draw339(now/1000);});
})();
