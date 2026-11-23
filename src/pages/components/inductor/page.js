
// ===== 3. Switch on/off with water wheel =====
const IN={on:false,diode:0,I:0,t:0,h:[],spike:0,spin:0,off:0,sparks:0};
choices('inChoices',['No diode','With flyback diode'],0,i=>IN.diode=i);
$('inSw').onclick=()=>{IN.on=!IN.on;$('inSw').textContent='Switch: '+(IN.on?'ON':'OFF');$('inSw').className=IN.on?'active':'';
  if(!IN.on&&!IN.diode&&IN.I>0.05){IN.spike=IN.I*300;IN.sparks=0.5;IN.I=0;}};
function drawInd(dt){const L=+$('inL').value;IN.t+=dt;
  if(IN.on)IN.I+=(1-IN.I)*dt/(0.4*L);else if(IN.diode)IN.I+=(0-IN.I)*dt/(0.5*L);else IN.I=0;
  IN.spike*=Math.exp(-dt/0.05);IN.sparks=Math.max(0,IN.sparks-dt);IN.spin+=IN.I*dt*10;IN.off+=IN.I*dt*70;
  const Vsw=IN.on?0:(IN.diode?(IN.I>0.02?9.7:9):9+IN.spike);
  IN.h.push({t:IN.t,I:IN.I,v:Vsw});prune(IN.h,IN.t,5);
  const c=$('cInd'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=50,B=280,Lx=60,cx=330;
  part(ctx,'batt',Lx,T,Lx,B,{label:'9 V',left:true});wire(ctx,[[Lx,T],[140,T]]);part(ctx,'switch',140,T,220,T,{closed:IN.on,label:'switch'});
  wire(ctx,[[220,T],[cx,T],[cx,100]]);part(ctx,'coil',cx,100,cx,190,{core:true,label:'coil'});wire(ctx,[[cx,190],[cx,205]]);
  part(ctx,'lamp',cx,205,cx,255,{glow:IN.I});wire(ctx,[[cx,255],[cx,B],[Lx,B]]);
  if(IN.diode){wire(ctx,[[cx,T+20],[cx+70,T+20],[cx+70,110]]);part(ctx,'diode',cx+70,190,cx+70,110,{col:PAL.good,label:'flyback'});wire(ctx,[[cx+70,190],[cx+70,230],[cx,230]]);}
  if(IN.I>0.02){if(IN.on)dots(ctx,[[Lx,B-20],[Lx,T],[cx,T],[cx,B],[Lx,B]],IN.off);else if(IN.diode)dots(ctx,[[cx,T+20],[cx,230],[cx+70,230],[cx+70,T+20],[cx,T+20]],IN.off,PAL.good);}
  // water wheel icon
  const wx=cx-80,wy=145;ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;ctx.beginPath();ctx.arc(wx,wy,22,0,7);ctx.stroke();ctx.save();ctx.translate(wx,wy);ctx.rotate(IN.spin);for(let i=0;i<6;i++){ctx.rotate(Math.PI/3);ctx.fillStyle=PAL.blue;ctx.fillRect(10,-3,14,6);}ctx.restore();
  txt(ctx,'heavy wheel',wx,wy+40,PAL.muted,11);
  if(IN.sparks>0){ctx.strokeStyle=PAL.highlight;ctx.lineWidth=2;for(let i=0;i<8;i++){const a=Math.random()*6.28,r=10+Math.random()*22;ctx.beginPath();ctx.moveTo(196,T-6);ctx.lineTo(196+r*Math.cos(a),T-6+r*Math.sin(a));ctx.stroke();}txt(ctx,'⚡ SPARK at the switch',180,T+40,PAL.highlight,13);}
  plot(ctx,500,30,280,100,IN.h,IN.t,5,[{k:'I',col:Y,label:'current'}],0,1.1,'');
  plot(ctx,500,180,280,100,IN.h,IN.t,5,[{k:'v',col:PAL.redSoft,label:'voltage across the switch'}],0,60,'');
  const pk=Math.max(...IN.h.map(p=>p.v));txt(ctx,pk>60?'spike ≈ '+Math.round(pk)+' V!':'max '+pk.toFixed(1)+' V',640,310,pk>60?PAL.bad:PAL.good,13);}

// ===== 5A. Boost =====
const BS={t:0,ph:0,I:0,h:[],ledAvg:0};
function drawBoost(dt){const f=+$('bsF').value;BS.t+=dt;BS.ph=(BS.ph+dt*f)%1;const on=BS.ph<0.5;
  if(on)BS.I=Math.min(1,BS.I+dt*f*2.2);else BS.I=Math.max(0,BS.I-dt*f*2.6);
  const node=on?0.1:(BS.I>0.01?3.2:1.5),led=!on&&BS.I>0.01?Math.min(1,BS.I*1.4):0;BS.ledAvg+=(led-BS.ledAvg)*Math.min(1,dt*6);
  BS.h.push({t:BS.t,I:BS.I,v:node,ref:3});prune(BS.h,BS.t,4);
  const c=$('cBoost'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=60,B=260,Lx=60;part(ctx,'batt',Lx,T,Lx,B,{label:'1.5 V',left:true});wire(ctx,[[Lx,T],[110,T]]);part(ctx,'coil',110,T,220,T,{label:'coil'});
  wire(ctx,[[220,T],[260,T]]);dot(ctx,260,T);wire(ctx,[[260,T],[260,128]]);npnQ(ctx,250,162,on);wire(ctx,[[260,196],[260,B]]);txt(ctx,on?'switch ON: coil charging':'switch OFF: coil kicks',250,B+28,on?PAL.good:Y,12);
  wire(ctx,[[260,T],[300,T]]);part(ctx,'diode',300,T,370,T);wire(ctx,[[370,T],[410,T],[410,130]]);
  const bright=f>1.6?BS.ledAvg*1.2:led;part(ctx,'led',410,130,410,210,{glow:bright,rgb:'241,245,249',label:'white LED',left:true});wire(ctx,[[410,210],[410,B],[Lx,B]]);
  if(on&&BS.I>0.02)dots(ctx,[[Lx,B-20],[Lx,T],[260,T],[260,B],[Lx,B]],BS.t*60);if(!on&&BS.I>0.02)dots(ctx,[[Lx,B-20],[Lx,T],[410,T],[410,B],[Lx,B]],BS.t*60,'#a5f3fc');
  plot(ctx,500,30,280,90,BS.h,BS.t,4,[{k:'I',col:Y,label:'coil current'}],0,1.1,'');
  plot(ctx,500,170,280,90,BS.h,BS.t,4,[{k:'v',col:PAL.redSoft,label:'voltage before diode'},{k:'ref',col:PAL.muted,dash:[4,4],lw:1,label:'3 V'}],0,4,'');
  txt(ctx,f>1.6?'fast switching: the LED looks steady':'slow: you see each kick',640,295,PAL.muted,12);}

// ===== 5B. LC filter =====
const LC={f:1,t:0,h:[],a:5,b:5,ia:0};
choices('lcChoices',['No filter','With LC filter'],1,i=>LC.f=i);
function drawLC(dt){LC.t+=dt;const noise=0.6*Math.sin(LC.t*47)+0.4*Math.sin(LC.t*83+1)+0.3*(Math.random()-0.5);const vin=5+noise;
  // 2nd order low-pass
  const w=6,z=0.7;LC.ia+=(w*w*(vin-LC.a)-2*z*w*LC.ia)*dt;LC.a+=LC.ia*dt;const out=LC.f?LC.a:vin;
  LC.h.push({t:LC.t,vin,out});prune(LC.h,LC.t,3);
  const c=$('cLC'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const y=90;txt(ctx,'noisy 5 V',40,y-14,PAL.amber,12,'left');wire(ctx,[[30,y],[90,y]],PAL.amber);
  if(LC.f){part(ctx,'coil',90,y,190,y,{core:true,label:'100 µH'});wire(ctx,[[190,y],[260,y]]);dot(ctx,230,y);part(ctx,'cap',230,y,230,190,{label:'470 µF'});wire(ctx,[[230,190],[230,200]]);gndSym(ctx,230,200);}
  else wire(ctx,[[90,y],[260,y]]);
  txt(ctx,'clean 5 V →',266,y+4,PAL.good,12,'left');
  plot(ctx,380,20,400,90,LC.h,LC.t,3,[{k:'vin',col:PAL.amber,label:'input'}],3,7,'');
  plot(ctx,380,145,400,80,LC.h,LC.t,3,[{k:'out',col:PAL.good,label:'output'}],3,7,'');}

// ===== 5C. Transformer =====
const TR={dc:0,t:0,h:[]};
choices('trChoices',['AC in','DC in'],0,i=>{TR.dc=i;TR.t0=TR.t;});
function drawTr(dt){TR.t+=dt;const N=+$('trN').value,ratio=N/1000;
  const vin=TR.dc?230:230*Math.sin(2*Math.PI*0.8*TR.t);const vout=TR.dc?(TR.t-(TR.t0||0)<0.08?230*ratio*0.6:0):vin*ratio;
  TR.h.push({t:TR.t,vin:vin/230,vout:vout/230});prune(TR.h,TR.t,4);
  const c=$('cTr'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  // core
  ctx.strokeStyle=PAL.muted2;ctx.lineWidth=14;ctx.strokeRect(140,50,170,150);
  const coilV=(x,n,col)=>{ctx.strokeStyle=col;ctx.lineWidth=2.5;const k=Math.max(3,Math.min(14,Math.round(n)));for(let i=0;i<k;i++){const yy=62+i*(126/k);ctx.beginPath();ctx.ellipse(x,yy+4,18,5,0,0,Math.PI);ctx.stroke();}};
  coilV(140,14,PAL.amber);coilV(310,N/30,PAL.good);
  txt(ctx,'1000 turns',140,224,PAL.amber,12);txt(ctx,N+' turns',310,224,PAL.good,12);
  wire(ctx,[[40,80],[122,80]],PAL.amber);wire(ctx,[[40,180],[122,180]],PAL.amber);txt(ctx,TR.dc?'230 V DC':'230 V AC',40,70,PAL.amber,12,'left');
  wire(ctx,[[328,80],[400,80]],PAL.good);wire(ctx,[[328,180],[400,180]],PAL.good);
  const Vo=TR.dc?0:230*ratio;txt(ctx,TR.dc?'0 V out':Vo.toFixed(1)+' V AC out',404,134,TR.dc?PAL.bad:PAL.good,15,'left');
  plot(ctx,540,20,240,90,TR.h,TR.t,4,[{k:'vin',col:PAL.amber,label:'input'}],-1.1,1.1,'');
  const rr=Math.max(ratio*1.15,0.03);plot(ctx,540,150,240,90,TR.h,TR.t,4,[{k:'vout',col:PAL.good,label:'output (zoomed in)'}],-rr,rr,'');
  txt(ctx,TR.dc?'DC: the field doesn\'t change, so nothing is induced':'Vout = 230 V × '+N+' ÷ 1000',400,262,TR.dc?PAL.bad:PAL.muted,12);}

// ===== Symbols =====
(function(){const c=$('cSymI'),ctx=c.getContext('2d');part(ctx,'coil',60,45,320,45,{});part(ctx,'coil',60,120,320,120,{core:true});})();

loop((dt,now)=>{drawInd(dt);drawBoost(dt);drawLC(dt);drawTr(dt);});
