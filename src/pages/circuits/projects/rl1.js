// ===== rl1: breadboard layout =====
BBL.rl1={power:7,noBoard:1,parts:[
  {s:0,t:'box',at:[40,150],w:150,h:60,lab:'18650 holder',col:PAL.slateDark,ly:34,pins:[{n:'red +',dx:150,dy:18,to:[290,168],s:2,c:W_R},{n:'black −',dx:150,dy:44,to:[290,194],s:2,c:PAL.muted}]},
  {s:6,t:'cell',at:[57,165]},
  {s:0,t:'box',at:[290,140],w:120,h:80,lab:'BMS 1S',col:PAL.chip,ly:44,pins:[{n:'B+',dx:0,dy:28},{n:'B−',dx:0,dy:54},{n:'P+',dx:120,dy:28},{n:'P−',dx:120,dy:54}]},
  {s:0,t:'box',at:[510,60],w:150,h:80,lab:'TP4056 charger',col:'#1d4ed8',ly:30,lit:{at:[560,120],c:'rgba(239,68,68,0.9)'},pins:[{n:'B+',dx:0,dy:58,to:[410,168],s:3,c:W_R},{n:'B−',dx:0,dy:72,to:[410,194],s:3,c:PAL.muted}]},
  {s:0,t:'box',at:[510,250],w:150,h:70,lab:'load (switch + LED)',col:PAL.chipLight,ly:30,pins:[{n:'+',dx:0,dy:24,to:[410,168],s:4,c:W_R},{n:'−',dx:0,dy:50,to:[410,194],s:4,c:PAL.muted}]},
  {s:7,t:'box',at:[690,80],w:80,h:40,lab:'USB 5 V',col:'#4b5563',ly:24,pins:[{dx:0,dy:20,to:[660,100],c:PAL.muted}]},
  {s:0,t:'note',at:[400,420],txt:'Not a breadboard build: the modules are wired (soldered) together.',c:PAL.muted}]};

(function(){   // demo
// ===== Real life A: Li-ion charger =====
const BC={on:false,s:0.12,t:0,h:[],Iset:1,done:false};
choices('bcChoices',['R_PROG 1.2 kΩ → 1 A','R_PROG 2.4 kΩ → 0.5 A'],0,i=>{BC.Iset=i?0.5:1;});
$('bcGo').onclick=()=>{BC.on=!BC.on;if(BC.on&&BC.done){BC.s=0.12;BC.t=0;BC.h=[];BC.done=false;}$('bcGo').textContent=BC.on?'⏏ Unplug USB':'▶ Plug in USB';};
const ocv=s=>3.0+0.95*s+0.25*Math.pow(s,6);
function stepBC(dt){const CAP=2.5,Rin=0.12;let I=0,V=ocv(BC.s),phase='idle';
  if(BC.on&&!BC.done){const vcc=ocv(BC.s)+BC.Iset*Rin;if(vcc<4.2){I=BC.Iset;phase='CC';}else{I=Math.max(0,(4.2-ocv(BC.s))/Rin);I=Math.min(I,BC.Iset);phase='CV';}
    V=ocv(BC.s)+I*Rin;if(phase==='CV'&&I<0.1*BC.Iset){BC.done=true;}
    const mins=dt*(+$('bcSp').value);BC.t+=mins;BC.s=Math.min(1,BC.s+I*(mins/60)/CAP);BC.h.push({t:BC.t,V,I:I/BC.Iset});}
  return {I,V,phase:BC.done?'done':phase};}
function drawBC(dt){const r=stepBC(dt),ctx=cv('cBat');
  // USB + module + cell
  ctx.fillStyle=PAL.slate;ctx.fillRect(20,120,60,40);txt(ctx,'USB 5 V',50,145,PAL.white,12);wire(ctx,[[80,130],[120,130]],PAL.redSoft);wire(ctx,[[80,150],[120,150]],PAL.blue);
  ctx.fillStyle='#1d4ed8';ctx.fillRect(120,95,150,90);ctx.strokeStyle=PAL.link;ctx.lineWidth=1.5;ctx.strokeRect(120,95,150,90);txt(ctx,'TP4056 + protection',195,125,'#e0e7ff',11);
  const red=BC.on&&!BC.done,blue=BC.on&&BC.done;glowAt(ctx,165,160,red?0.9:0,'239,68,68',20);glowAt(ctx,225,160,blue?0.9:0,'59,130,246',20);
  ctx.fillStyle=red?PAL.bad:'#3f1d1d';ctx.beginPath();ctx.arc(165,160,6,0,7);ctx.fill();ctx.fillStyle=blue?PAL.water:'#1e2a4a';ctx.beginPath();ctx.arc(225,160,6,0,7);ctx.fill();
  txt(ctx,'charging',165,178,PAL.muted,9);txt(ctx,'full',225,178,PAL.muted,9);
  wire(ctx,[[270,120],[320,120]],PAL.redSoft);wire(ctx,[[270,160],[320,160]],PAL.blue);txt(ctx,'B+',290,112,PAL.muted,10);txt(ctx,'B−',290,176,PAL.muted,10);
  // 18650
  const bx=320,by=90,bw=150,bh=100;ctx.fillStyle='#0f766e';ctx.beginPath();ctx.roundRect(bx,by,bw,bh,14);ctx.fill();ctx.fillStyle=PAL.muted;ctx.fillRect(bx+bw,by+35,8,30);
  ctx.fillStyle='#134e4a';ctx.fillRect(bx+12,by+14,bw-24,bh-28);ctx.fillStyle=BC.s>0.2?PAL.green:PAL.amber;ctx.fillRect(bx+12,by+14,(bw-24)*BC.s,bh-28);
  txt(ctx,Math.round(BC.s*100)+'%',bx+bw/2,by+bh/2+6,PAL.white,18);txt(ctx,'18650 · 2500 mAh',bx+bw/2,by+bh+18,PAL.muted,11);
  const ph={idle:['not charging',PAL.muted],CC:['Phase 1: constant CURRENT',PAL.yellow],CV:['Phase 2: constant VOLTAGE (4.2 V)',PAL.blue],done:['Done: charger stopped',PAL.good]}[r.phase];
  txt(ctx,ph[0],245,40,ph[1],15);txt(ctx,BC.on&&!BC.done?r.V.toFixed(2)+' V · '+(r.I*1000).toFixed(0)+' mA':'',245,62,PAL.ink,13);
  txt(ctx,'elapsed: '+Math.floor(BC.t/60)+' h '+String(Math.floor(BC.t%60)).padStart(2,'0')+' min',245,250,PAL.muted,12);
  // graphs vs time
  const tmax=Math.max(60,2.5/BC.Iset*60*1.25),gx=520,gw=260;
  const g=(y,h,k,min,max,col,l)=>{ctx.fillStyle=PAL.raised;ctx.fillRect(gx,y,gw,h);txt(ctx,l,gx+4,y-6,col,11,'left');ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();BC.h.forEach((p,i)=>{const x=gx+p.t/tmax*gw,yy=y+h-(p[k]-min)/(max-min)*h;i?ctx.lineTo(x,yy):ctx.moveTo(x,yy);});ctx.stroke();};
  g(30,110,'V',2.9,4.3,PAL.blue,'battery voltage (3.0 → 4.2 V)');g(180,110,'I',0,1.1,Y,'charge current');
  const y42=30+110-(4.2-2.9)/1.4*110;ctx.setLineDash([4,4]);ctx.strokeStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(gx,y42);ctx.lineTo(gx+gw,y42);ctx.stroke();ctx.setLineDash([]);txt(ctx,'4.2 V',gx+gw+4,y42+4,PAL.muted,10,'left');
  txt(ctx,'time → ('+Math.round(tmax/60*10)/10+' h)',gx+gw,310,PAL.muted,10,'right');}
loop((dt,now)=>{drawBC(dt);});
})();
