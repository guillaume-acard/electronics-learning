// ===== 7805: data (pinout, inside, minimal circuit, hero art) + its demo =====
CHIP('7805',{
pinout:{pkg:'to220',title:'L7805 (TO-220)',pins:[
 [1,'IN','pwr','Input: the raw, wobbly supply (7–20 V).','From the battery / adapter, with a 330 nF capacitor to ground close to the pin.'],
 [2,'GND','gnd','Ground, the reference the 5 V is measured from. The metal tab is also connected to it.','To the − rail. The tab can be bolted to a heatsink.'],
 [3,'OUT','out','Output: a steady 5 V, up to about 1 A (with a heatsink).','To the circuit\'s + rail, with a 100 nF capacitor to ground (plus 10–100 µF if the load changes a lot).']]},
inside:({ln,tx,bx,dot,tp,cmp,res,gnd,arrow})=>{let s='';
  s+=ln('40,90 200,90',1)+bx(200,65,140,50,'Pass transistor\n(the valve)',PAL.amber)+ln('340,90 530,90',3);
  s+=bx(200,10,140,34,'Heat & over-current\nprotection')+`<path d="M270 44v21" stroke="${PAL.muted}" stroke-width="2" stroke-dasharray="4 3"/>`;
  s+=dot(450,90)+ln('450,90 450,115')+res(450,115,160)+ln('450,160 450,200')+res(450,200,245)+ln('450,245 450,280');
  s+=dot(450,180)+ln('450,180 360,180')+tx(405,172,'measured',{s:11,c:PAL.muted});
  s+=bx(240,150,120,60,'Error amplifier\n"too high? too low?"');
  s+=ln('300,150 300,115')+tx(306,138,'opens / closes',{a:'start',s:11,c:PAL.yellow});
  s+=bx(100,160,100,40,'Reference\n1.25 V')+ln('200,180 240,180')+ln('150,200 150,280');
  s+=ln('150,280 450,280',2)+ln('300,210 300,280');
  return {vb:'0 0 600 320',s:s+tp(40,90,1,'t')+tp(530,90,3,'t')+tp(300,300,2,'b')+ln('300,280 300,300',2)+dot(300,280)};},
minimal:{title:'7805: 9 V in, steady 5 V out',sub:'front view, legs down: 1 IN · 2 GND · 3 OUT',side:'left',rows:[
 [1,[[[],'IN:+9 V battery'],[['C:330 nF'],'GND']],'Input: the raw 7–20 V, with a 330 nF capacitor close to the pin.'],
 [2,[[[],'GND']],'Ground (the metal tab is ground too).'],
 [3,[[[],'T:+5 V to your circuit'],[['C:100 nF'],'GND']],'Output: steady 5 V, with 100 nF to ground (add 10–100 µF for big loads).']]},
art:to220Art});

(function(){
// ===== 4. 7805 =====
const RG={hs:0,T:0,shut:false};
choices('rgChoices',['No heatsink','With heatsink'],0,i=>RG.hs=i);
function draw7805(dt){const Vin=+$('rgV').value,Il=+$('rgI').value;
  let Vout=RG.shut?0:Math.max(0,Math.min(5,Vin-2));const I=Il*Vout/5,P=Math.max(0,Vin-Vout)*I;
  const Rth=RG.hs?8:60;RG.T+=(P*Rth-RG.T)*dt/2.5;if(RG.T>100)RG.shut=true;if(RG.shut&&RG.T<70)RG.shut=false;
  const c=$('c7805'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  // TO-220 drawing
  const x=80,y=40;if(RG.hs){ctx.fillStyle=PAL.muted2;for(let i=0;i<6;i++)ctx.fillRect(x-20+i*14,y-25,8,60);}
  ctx.fillStyle=PAL.muted;ctx.fillRect(x-10,y,90,40);ctx.fillStyle=PAL.canvas;ctx.beginPath();ctx.arc(x+35,y+20,7,0,7);ctx.fill();
  const hot=Math.min(1,RG.T/100);ctx.fillStyle=`rgb(${Math.round(31+200*hot)},${Math.round(41-10*hot)},${Math.round(55-20*hot)})`;ctx.fillRect(x-10,y+40,90,60);
  arrowText(ctx,'7805',x+35,y+76,PAL.ink,14);
  ['IN','GND','OUT'].forEach((l,i)=>{ctx.fillStyle=PAL.ink2;ctx.fillRect(x+4+i*30,y+100,6,50);arrowText(ctx,String(i+1),x+7+i*30,y+164,PAL.yellow,11);arrowText(ctx,l,x+7+i*30,y+180,PAL.yellow,10);});
  // gauges
  const gauge=(gx,v,max,l,col)=>{ctx.fillStyle=PAL.raised;ctx.fillRect(gx,40,60,150);ctx.fillStyle=col;const h=Math.min(1,v/max)*150;ctx.fillRect(gx,190-h,60,h);ctx.strokeStyle=PAL.slate;ctx.strokeRect(gx,40,60,150);
    arrowText(ctx,l,gx+30,30,PAL.muted,12);arrowText(ctx,v.toFixed(l==='heat'?2:1)+(l==='heat'?' W':' V'),gx+30,210,col,15);};
  gauge(290,Vin,20,'input',PAL.amber);gauge(390,Vout,20,'output',PAL.good);gauge(490,P,5,'heat',PAL.bad);
  ctx.strokeStyle=PAL.good;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(390,190-5/20*150);ctx.lineTo(450,190-5/20*150);ctx.stroke();ctx.setLineDash([]);
  // thermometer
  const tx=600;ctx.fillStyle=PAL.raised;ctx.fillRect(tx,40,20,150);const tl=Math.min(1,RG.T/110);ctx.fillStyle=RG.T>80?PAL.bad:RG.T>50?PAL.amber:PAL.good;ctx.fillRect(tx,190-tl*150,20,tl*150);ctx.strokeStyle=PAL.slate;ctx.strokeRect(tx,40,20,150);
  arrowText(ctx,'chip temp',tx+10,30,PAL.muted,12);
  let msg,col;
  if(RG.shut){msg='Too hot: thermal shutdown! Output cut until it cools.';col=PAL.bad;}
  else if(Vin<7){msg='Input too low (needs ≥ 7 V): output sags below 5 V';col=PAL.amber;}
  else if(P>1&&!RG.hs){msg='Getting very hot: add a heatsink';col=PAL.amber;}
  else {msg='Steady 5 V out ✓';col=PAL.good;}
  wrapText(ctx,msg,640,90,150,18,col,13);
  arrowText(ctx,'heat = ('+Vin.toFixed(1)+' − '+Vout.toFixed(1)+') V × '+(I*1000).toFixed(0)+' mA',440,245,PAL.muted,12);}
loop((dt,now)=>{draw7805(dt);});
})();
