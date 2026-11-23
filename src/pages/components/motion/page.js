
// ===== 3. Buzzers: active vs passive =====
const BZ={kind:1,dc:false,click:0,lastDC:false};
choices('bzKind',['Active buzzer','Passive buzzer'],1,i=>{BZ.kind=i;});
$('bzDC').onclick=()=>{BZ.dc=true;BZ.click=0.4;$('bzDC').className='active';$('bzSQ').className='';};
$('bzSQ').onclick=()=>{BZ.dc=false;$('bzSQ').className='active';$('bzDC').className='';};
const NOTE=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const noteOf=f=>{const n=Math.round(12*Math.log2(f/440))+57;return NOTE[(n%12+12)%12]+Math.floor(n/12);};
let AC=null;
$('bzPlay').onclick=()=>{try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();}catch(e){return;}
  const t0=AC.currentTime,gn=AC.createGain();gn.connect(AC.destination);gn.gain.setValueAtTime(0,t0);
  const beep=(f,a,b)=>{const o=AC.createOscillator();o.type='square';o.frequency.value=f;o.connect(gn);o.start(t0+a);o.stop(t0+b);};
  const f=+$('bzF').value;
  if(BZ.kind===0&&BZ.dc){beep(2300,0,1);gn.gain.setValueAtTime(0.04,t0);gn.gain.setValueAtTime(0,t0+1);}
  else if(BZ.kind===0){beep(2300,0,1);for(let i=0;i<5;i++){gn.gain.setValueAtTime(0.04,t0+i*0.2);gn.gain.setValueAtTime(0,t0+i*0.2+0.1);}}
  else if(BZ.dc){beep(1500,0,0.02);gn.gain.setValueAtTime(0.08,t0);gn.gain.linearRampToValueAtTime(0,t0+0.02);}
  else{beep(f,0,1);gn.gain.setValueAtTime(0.04,t0);gn.gain.setValueAtTime(0,t0+1);}};
function drawBuzz(dt,t){const c=$('cBuzz'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const f=+$('bzF').value,act=BZ.kind===0;BZ.click=Math.max(0,BZ.click-dt);
  // input waveform
  txt(ctx,'What you feed it',140,26,'#94a3b8',12);ctx.fillStyle='#111c2e';ctx.fillRect(30,40,220,110);
  ctx.strokeStyle=Y;ctx.lineWidth=2.5;ctx.beginPath();
  if(BZ.dc){ctx.moveTo(30,140);ctx.lineTo(60,140);ctx.lineTo(60,60);ctx.lineTo(250,60);}
  else{const per=act?60:60*Math.pow(200/f,0.66);for(let x=0;x<=220;x++){const v=((x+t*40)%per)<per/2?1:0;const y=v?60:140;x?ctx.lineTo(30+x,y):ctx.moveTo(30+x,y);}}
  ctx.stroke();txt(ctx,BZ.dc?'steady 5 V (DC)':act?'switched on/off (slow square wave)':'square wave, '+f+' Hz',140,172,Y,12);
  // the buzzer
  const bx=380,by=95;ctx.fillStyle='#111827';ctx.beginPath();ctx.arc(bx,by,48,0,7);ctx.fill();ctx.strokeStyle='#475569';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='#0b1220';ctx.beginPath();ctx.arc(bx,by,7,0,7);ctx.fill();
  txt(ctx,act?'ACTIVE':'PASSIVE',bx,by+70,act?'#f472b6':'#38bdf8',13);txt(ctx,act?'oscillator inside':'no oscillator',bx,by+88,'#94a3b8',11);
  if(act){ctx.fillStyle='#1e293b';ctx.fillRect(bx-26,by+18,52,14);txt(ctx,'osc',bx,by+29,'#f472b6',10);}
  wire(ctx,[[250,100],[332,100]],'#64748b');
  // what comes out
  let mode,msg,pitch=0;
  if(act&&BZ.dc){mode='beep';pitch=2300;msg='Beeeeep! Its own oscillator: always ~2.3 kHz';}
  else if(act){mode='chop';pitch=2300;msg='Beep-beep-beep: your signal only switches it on and off; the pitch stays 2.3 kHz';}
  else if(BZ.dc){mode='click';msg='Click... then silence: DC bends the disc once and holds it';}
  else{mode='tone';pitch=f;msg=`A ${f} Hz tone (≈ note ${noteOf(f)}): you choose the pitch`;}
  const on=mode==='beep'||mode==='tone'||(mode==='chop'&&(t*2.5%1)<0.5)||(mode==='click'&&BZ.click>0);
  if(on){const sp=mode==='click'?40:Math.max(9,60-pitch/80);ctx.lineWidth=3;
    for(let i=0;i<8;i++){const r=60+((t*(mode==='click'?60:90))%sp)+i*sp;if(r>330)break;ctx.strokeStyle=`rgba(244,114,182,${Math.max(0,0.9-r/360)})`;ctx.beginPath();ctx.arc(bx,by,r,-0.6,0.6);ctx.stroke();}}
  txt(ctx,msg,400,226,on||mode==='click'?'#e2e8f0':'#94a3b8',14);
  if(mode==='tone')txt(ctx,'higher frequency = rings closer together = higher note',400,248,'#64748b',11);}

// ===== 4. Speaker =====
const SP={dc:false,heat:0};
$('spDC').onclick=()=>{SP.dc=!SP.dc;$('spDC').className=SP.dc?'active':'';$('spDC').textContent=SP.dc?'〰 Back to audio':'⚡ Apply 9 V DC';};
function drawSpk(dt,t){const c=$('cSpk'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const f=+$('spF').value,vol=+$('spV').value;SP.heat=Math.max(0,Math.min(1,SP.heat+(SP.dc?dt*0.35:-dt*0.2)));
  const disp=SP.dc?1:vol*Math.sin(2*Math.PI*f*t),cy=135,mx=180,dx=disp*16;
  // input signal
  txt(ctx,SP.dc?'input: 9 V DC':'input: audio (AC)',70,22,'#94a3b8',11);ctx.strokeStyle=SP.dc?'#ef4444':Y;ctx.lineWidth=2;ctx.beginPath();
  for(let x=0;x<=110;x++){const v=SP.dc?1:vol*Math.sin(2*Math.PI*f*(t-(110-x)/220));const y=60-v*22;x?ctx.lineTo(15+x,y):ctx.moveTo(15+x,y);}ctx.stroke();
  // magnet
  ctx.fillStyle='#475569';ctx.fillRect(mx-110,cy-55,70,110);ctx.fillStyle='#ef4444';ctx.fillRect(mx-110,cy-55,70,24);ctx.fillStyle='#3b82f6';ctx.fillRect(mx-110,cy+31,70,24);
  txt(ctx,'N',mx-75,cy-38,'#fff',12);txt(ctx,'S',mx-75,cy+48,'#fff',12);txt(ctx,'magnet',mx-75,cy+75,'#94a3b8',11);
  // coil
  const hot=SP.heat;ctx.fillStyle=hot>0.05?`rgb(${180+75*hot},${120-80*hot},${40})`:'#d97706';ctx.fillRect(mx-40+dx,cy-26,26,52);
  for(let i=0;i<6;i++){ctx.strokeStyle='#78350f';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(mx-40+dx,cy-22+i*9);ctx.lineTo(mx-14+dx,cy-22+i*9);ctx.stroke();}
  txt(ctx,'coil',mx-27+dx,cy-34,'#fbbf24',11);
  // cone
  ctx.fillStyle='#cbd5e1';ctx.beginPath();ctx.moveTo(mx-14+dx,cy-24);ctx.lineTo(mx+56+dx,cy-95);ctx.lineTo(mx+62+dx,cy-95);ctx.lineTo(mx+62+dx,cy+95);ctx.lineTo(mx+56+dx,cy+95);ctx.lineTo(mx-14+dx,cy+24);ctx.closePath();ctx.globalAlpha=0.85;ctx.fill();ctx.globalAlpha=1;
  ctx.strokeStyle='#64748b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mx+62,cy-105);ctx.lineTo(mx+62,cy-95);ctx.moveTo(mx+62,cy+95);ctx.lineTo(mx+62,cy+105);ctx.stroke();txt(ctx,'cone',mx+30+dx,cy+118,'#94a3b8',11);
  // air
  const c0=mx+70;for(let x=c0;x<780;x+=12){const d=SP.dc?0:vol*Math.sin(2*Math.PI*f*(t-(x-c0)/220))*7;const dens=SP.dc?0.25:0.25+0.5*Math.max(0,vol*Math.cos(2*Math.PI*f*(t-(x-c0)/220)));
    ctx.fillStyle=`rgba(56,189,248,${dens})`;for(let y=cy-90;y<=cy+90;y+=14)ctx.fillRect(x+d,y+((x/12)%2)*7,3,3);}
  if(SP.dc){txt(ctx,'9 V ÷ 8 Ω ≈ 1.1 A of DC: the cone just sticks out, no sound,',530,cy-8,'#ef4444',13);txt(ctx,'and the thin coil heats up '+Math.round(25+SP.heat*120)+' °C',530,cy+12,'#ef4444',13);}
  else txt(ctx,'cone pushes → air squeezed (dense) · cone pulls → air thinned',530,262,'#94a3b8',11);}

// ===== 5. DC motor =====
const MO={rpm:0,ang:0};
function drawMotor(dt){const c=$('cMotor'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const V=+$('moV').value,Ld=+$('moL').value,R=4,Ke=9/9200,I0=0.15;
  const Ist=V/R,I=V/R<I0?V/R:I0+Ld*(Ist-I0),target=Math.max(0,(V-I*R)/Ke);
  MO.rpm+=(target-MO.rpm)*Math.min(1,dt*3);MO.ang+=MO.rpm/9200*4*2*Math.PI*dt;
  const emf=MO.rpm*Ke,Inow=V>0?Math.max(0,(V-emf)/R):0,stall=Ld>0.95&&V>1;
  // motor cross-section
  const cx=170,cy=150;ctx.fillStyle='#1f2937';ctx.beginPath();ctx.arc(cx,cy,110,0,7);ctx.fill();ctx.strokeStyle='#475569';ctx.lineWidth=3;ctx.stroke();
  ctx.lineWidth=22;ctx.strokeStyle='#ef4444';ctx.beginPath();ctx.arc(cx,cy,92,Math.PI*0.7,Math.PI*1.3);ctx.stroke();ctx.strokeStyle='#3b82f6';ctx.beginPath();ctx.arc(cx,cy,92,-Math.PI*0.3,Math.PI*0.3);ctx.stroke();
  txt(ctx,'N',cx-92,cy+5,'#fff',14);txt(ctx,'S',cx+92,cy+5,'#fff',14);
  for(let k=0;k<3;k++){const a=MO.ang+k*2*Math.PI/3;const pole=Math.cos(a)>0?'#ef4444':'#3b82f6';
    ctx.save();ctx.translate(cx,cy);ctx.rotate(a);ctx.fillStyle='#94a3b8';ctx.fillRect(10,-6,48,12);ctx.fillStyle=V>0.3?pole:'#64748b';ctx.beginPath();ctx.arc(64,0,16,-Math.PI/2,Math.PI/2);ctx.lineTo(56,16);ctx.lineTo(56,-16);ctx.fill();
    ctx.strokeStyle='#d97706';ctx.lineWidth=2;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(20+i*7,-9);ctx.lineTo(20+i*7,9);ctx.stroke();}ctx.restore();}
  ctx.fillStyle='#b45309';ctx.beginPath();ctx.arc(cx,cy,12,0,7);ctx.fill();ctx.fillStyle='#111';ctx.fillRect(cx-16,cy-4,8,8);ctx.fillRect(cx+8,cy-4,8,8);
  txt(ctx,'rotor coils (spinning)',cx,cy+132,'#94a3b8',11);txt(ctx,'brushes + commutator in the middle',cx,cy+148,'#64748b',10);
  // readouts
  const x0=360,bar=(y,lab,val,max,unit,col,fmt)=>{txt(ctx,lab,x0,y,'#cbd5e1',13,'left');ctx.fillStyle='#1e293b';ctx.fillRect(x0,y+8,300,14);ctx.fillStyle=col;ctx.fillRect(x0,y+8,300*Math.min(1,val/max),14);txt(ctx,fmt(val)+' '+unit,x0+310,y+20,col,13,'left');};
  bar(40,'Speed',MO.rpm,9200,'rpm','#60a5fa',v=>Math.round(v));
  bar(95,'Current',Inow,2.25,'A','#fbbf24',v=>v.toFixed(2));
  bar(150,'Back-EMF (the motor acting as a generator)',emf,9,'V','#a78bfa',v=>v.toFixed(1));
  txt(ctx,`battery ${V.toFixed(1)} V = back-EMF ${emf.toFixed(1)} V + current × coil resistance (${Inow.toFixed(2)} A × 4 Ω)`,x0,215,'#94a3b8',12,'left');
  const msg=V<0.6?'Too little voltage: it can\'t overcome friction, it doesn\'t start':stall?'STALLED: no back-EMF, maximum current. It heats up fast!':Ld<0.2?'Spinning freely: high back-EMF, little current':'Loaded: it slows down, the back-EMF drops, the current rises';
  txt(ctx,msg,x0,250,stall?'#ef4444':V<0.6?'#94a3b8':'#10b981',14,'left');}

let lastM=performance.now();
function frameM(now){const dt=Math.min(0.05,(now-lastM)/1000);lastM=now;const t=now/1000;drawBuzz(dt,t);drawSpk(dt,t);drawMotor(dt);requestAnimationFrame(frameM);}
requestAnimationFrame(frameM);
