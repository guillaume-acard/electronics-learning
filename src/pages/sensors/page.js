
// ===== Sensors page =====
const SE_ART={"seir":("<svg viewBox=\"0 0 320 200\"><path d=\"M90 160 V60 a40 40 0 0 1 80 0 V160z\" fill=\"#1e1b4b\" stroke=\"#7c3aed\" stroke-width=\"3\"/><path d=\"M110 160v30M150 160v30\" stroke=\""+PAL.ink2+"\" stroke-width=\"5\"/><g stroke=\""+PAL.violet+"\" stroke-width=\"3\" stroke-dasharray=\"6 7\"><path d=\"M175 70 L290 40\"/><path d=\"M178 95 L300 95\"/><path d=\"M175 120 L290 150\"/></g><circle cx=\"255\" cy=\"95\" r=\"26\" fill=\"#f8fafc\"/><path d=\"M233 95h44M255 73v44\" stroke=\""+PAL.ink2+"\" stroke-width=\"1.5\"/><text x=\"130\" y=\"110\" text-anchor=\"middle\" fill=\"#c4b5fd\" font-size=\"18\" font-weight=\"800\" font-family=\"system-ui\">IR</text></svg>"),"seldr": ("<svg viewBox=\"0 0 320 200\"><circle cx=\"60\" cy=\"50\" r=\"24\" fill=\""+PAL.yellowSoft+"\"/><g stroke=\""+PAL.highlight+"\" stroke-width=\"3\" stroke-dasharray=\"6 6\"><path d=\"M80 66 L150 100\"/><path d=\"M70 76 L140 120\"/><path d=\"M86 56 L165 86\"/></g><circle cx=\"190\" cy=\"105\" r=\"52\" fill=\""+PAL.orangeSoft+"\"/><circle cx=\"190\" cy=\"105\" r=\"52\" fill=\"none\" stroke=\"#fed7aa\" stroke-width=\"4\"/><path d=\"M158 82 l10 46 l10 -46 l10 46 l10 -46 l10 46 l10 -46\" stroke=\"#7c2d12\" stroke-width=\"4\" fill=\"none\"/><path d=\"M175 157 v40 M205 157 v40\" stroke=\""+PAL.ink2+"\" stroke-width=\"5\"/><text x=\"275\" y=\"60\" fill=\""+PAL.yellow+"\" font-size=\"16\" font-weight=\"800\" font-family=\"system-ui\">LDR</text></svg>"), "selm35": ("<svg viewBox=\"0 0 320 200\"><path d=\"M110 60 a50 50 0 0 1 100 0 v60 h-100z\" fill=\""+PAL.chipDark+"\" stroke=\""+PAL.slate+"\" stroke-width=\"2\"/><text x=\"160\" y=\"96\" text-anchor=\"middle\" fill=\""+PAL.ink+"\" font-size=\"20\" font-weight=\"800\" font-family=\"system-ui\">LM35</text><text x=\"160\" y=\"114\" text-anchor=\"middle\" fill=\""+PAL.muted+"\" font-size=\"11\" font-family=\"system-ui\">10 mV / \u00b0C</text><path d=\"M130 120 v66 M160 120 v66 M190 120 v66\" stroke=\""+PAL.ink2+"\" stroke-width=\"5\"/><rect x=\"250\" y=\"30\" width=\"16\" height=\"120\" rx=\"8\" fill=\""+PAL.raised+"\"/><circle cx=\"258\" cy=\"160\" r=\"16\" fill=\""+PAL.bad+"\"/><rect x=\"253\" y=\"80\" width=\"10\" height=\"80\" fill=\""+PAL.bad+"\"/><text x=\"40\" y=\"60\" fill=\""+PAL.yellow+"\" font-size=\"15\" font-weight=\"800\" font-family=\"system-ui\">23 \u00b0C</text><text x=\"40\" y=\"80\" fill=\""+PAL.muted+"\" font-size=\"13\" font-family=\"system-ui\">= 0.23 V</text></svg>"), "setouch": ("<svg viewBox=\"0 0 320 200\"><rect x=\"70\" y=\"140\" width=\"80\" height=\"20\" rx=\"3\" fill=\""+PAL.brown+"\"/><rect x=\"170\" y=\"140\" width=\"80\" height=\"20\" rx=\"3\" fill=\""+PAL.brown+"\"/><path d=\"M110 160 v30 M210 160 v30\" stroke=\""+PAL.ink2+"\" stroke-width=\"4\"/><ellipse cx=\"160\" cy=\"124\" rx=\"56\" ry=\"26\" fill=\"#fcd9b6\"/><rect x=\"128\" y=\"20\" width=\"64\" height=\"104\" rx=\"26\" fill=\"#fcd9b6\"/><path d=\"M146 116 q14 8 28 0\" stroke=\"#d6a77a\" stroke-width=\"3\" fill=\"none\"/><text x=\"270\" y=\"60\" fill=\""+PAL.yellow+"\" font-size=\"13\" font-weight=\"700\" font-family=\"system-ui\">~500 k\u03a9</text></svg>"), "sebtn": ("<svg viewBox=\"0 0 320 200\"><rect x=\"100\" y=\"50\" width=\"120\" height=\"120\" rx=\"10\" fill=\""+PAL.chip+"\" stroke=\""+PAL.slate+"\" stroke-width=\"3\"/><circle cx=\"160\" cy=\"110\" r=\"36\" fill=\"#4b5563\"/><circle cx=\"160\" cy=\"110\" r=\"28\" fill=\"#6b7280\"/><path d=\"M110 170 v26 M210 170 v26 M110 50 v-26 M210 50 v-26\" stroke=\""+PAL.ink2+"\" stroke-width=\"5\"/><text x=\"250\" y=\"70\" fill=\""+PAL.yellow+"\" font-size=\"22\" font-weight=\"800\" font-family=\"system-ui\">click</text><circle cx=\"160\" cy=\"110\" r=\"10\" fill=\""+PAL.gray+"\"/></svg>"), "sepick": ("<svg viewBox=\"0 0 320 200\"><path d=\"M10 50 Q160 80 310 50\" stroke=\""+PAL.grayLight+"\" stroke-width=\"3\" fill=\"none\"/><path d=\"M10 64 Q160 64 310 64\" stroke=\""+PAL.muted+"\" stroke-width=\"2\" fill=\"none\"/><rect x=\"70\" y=\"95\" width=\"180\" height=\"62\" rx=\"14\" fill=\""+PAL.chipDark+"\" stroke=\""+PAL.slate+"\" stroke-width=\"2\"/><g fill=\"#d1d5db\"><circle cx=\"100\" cy=\"126\" r=\"8\"/><circle cx=\"132\" cy=\"126\" r=\"8\"/><circle cx=\"164\" cy=\"126\" r=\"8\"/><circle cx=\"196\" cy=\"126\" r=\"8\"/><circle cx=\"228\" cy=\"126\" r=\"8\"/></g><path d=\"M100 170 q30 -14 60 0 t60 0\" stroke=\""+PAL.green+"\" stroke-width=\"3\" fill=\"none\"/><text x=\"160\" y=\"196\" text-anchor=\"middle\" fill=\""+PAL.muted+"\" font-size=\"11\" font-family=\"system-ui\">magnets + coil \u2192 AC voltage</text></svg>")};
sectionMenu('sensors-menu',{first:'sewhat',onSelect:id=>heroSwap('sensors',SE_ART[id])});
const sv=id=>{const c=$(id);return c&&c.offsetParent?c:null;};
const ctxOf=c=>{const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);return x;};
function box(ctx,x,y,w,h,col){ctx.fillStyle=PAL.panel;ctx.strokeStyle=col||PAL.slateDark;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,h,8);ctx.fill();ctx.stroke();}
function zig(ctx,x,y1,y2,col){const n=6,h=(y2-y1)/n;ctx.strokeStyle=col||WIRE;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,y1);for(let i=1;i<n;i++)ctx.lineTo(x+(i%2?9:-9),y1+i*h);ctx.lineTo(x,y2);ctx.stroke();}
const fmtR=r=>r>=1e6?(r/1e6).toFixed(2)+' MΩ':r>=1e3?(r/1e3).toFixed(r<1e4?2:1)+' kΩ':r.toFixed(0)+' Ω';
// ---------- LDR ----------
function drawLDR(t){const c=sv('cldr');if(!c)return;const ctx=ctxOf(c),L=+$('ldrL').value;const lux=Math.pow(10,-1+L*5);const R=Math.min(1e6,7000*Math.pow(lux/10,-0.75));const V=5*10000/(R+10000);
  // light
  const sx=130,sy=150;ctx.fillStyle=`rgba(250,204,21,${0.15+0.85*L})`;ctx.beginPath();ctx.arc(70,50,24,0,7);ctx.fill();glowAt(ctx,70,50,L,'250,204,21',60);
  const n=Math.round(L*14);for(let i=0;i<n;i++){const k=(t*0.8+i/n)%1,x=70+(sx-70)*k+Math.sin(i*7)*12,y=50+(sy-50)*k;ctx.fillStyle='rgba(253,224,71,.9)';ctx.beginPath();ctx.arc(x,y,3,0,7);ctx.fill();}
  ctx.fillStyle=PAL.orangeSoft;ctx.beginPath();ctx.arc(sx,sy,34,0,7);ctx.fill();ctx.strokeStyle='#7c2d12';ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<9;i++){const x=sx-22+i*5.5;ctx.lineTo(x,sy+(i%2?-16:16));}ctx.stroke();
  txt(ctx,'LDR',sx,sy+54,PAL.ink2,12);txt(ctx,lux<1?lux.toFixed(1)+' lux (dark)':lux<50?Math.round(lux)+' lux (dim room)':lux<2000?Math.round(lux)+' lux (lit room)':Math.round(lux/1000)+'k lux (sunlight)',sx,sy+72,PAL.yellow,12);
  // divider
  const dx=330;W(ctx,[[dx,30],[dx,50]]);txt(ctx,'+5 V',dx,22,PAL.bad,12);zig(ctx,dx,50,120,PAL.orangeSoft);txt(ctx,'LDR '+fmtR(R),dx+16,90,PAL.orangeSoft,12,'left');
  W(ctx,[[dx,120],[dx,160]]);ctx.fillStyle=WIRE;ctx.beginPath();ctx.arc(dx,140,4,0,7);ctx.fill();W(ctx,[[dx,140],[dx+70,140]],PAL.yellow,2.5);txt(ctx,'Vout = '+V.toFixed(2)+' V',dx+76,144,PAL.yellow,14,'left');
  zig(ctx,dx,160,230);txt(ctx,'10 kΩ',dx+16,200,PAL.muted,12,'left');W(ctx,[[dx,230],[dx,262]]);txt(ctx,'0 V',dx,278,PAL.muted,12);
  ctx.fillStyle=PAL.raised;ctx.fillRect(dx+80,160,90,14);ctx.fillStyle=PAL.yellow;ctx.fillRect(dx+80,160,90*V/5,14);
  // graph
  const gx=560,gy=30,gw=220,gh=220;ctx.fillStyle=PAL.panel;ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle=PAL.line;ctx.strokeRect(gx,gy,gw,gh);
  ctx.save();ctx.beginPath();ctx.rect(gx,gy,gw,gh);ctx.clip();ctx.strokeStyle=PAL.orangeSoft;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=100;i++){const l=Math.pow(10,-1+i/20),r=Math.min(1e6,7000*Math.pow(l/10,-0.75));const x=gx+i/100*gw,y=gy+gh-(Math.log10(r)-2)/4*gh;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  const px=gx+L*gw,py=gy+gh-(Math.log10(R)-2)/4*gh;ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.arc(px,py,5,0,7);ctx.fill();ctx.restore();
  txt(ctx,'resistance',gx+6,gy+14,PAL.muted,11,'left');txt(ctx,'light →',gx+gw-4,gy+gh-6,PAL.muted,11,'right');txt(ctx,'1 MΩ',gx-4,gy+gh*0+10,PAL.muted2,10,'right');txt(ctx,'100 Ω',gx-4,gy+gh,PAL.muted2,10,'right');}
// ---------- LM35 ----------
function drawLM35(t){const c=sv('clm35');if(!c)return;const ctx=ctxOf(c),T=+$('lmT').value,V=Math.max(0,T)*0.01;
  const tx=60,top=40,bot=220,f=(T+10)/110;ctx.fillStyle=PAL.raised;ctx.beginPath();ctx.roundRect(tx-10,top,20,bot-top,10);ctx.fill();ctx.beginPath();ctx.arc(tx,bot+14,20,0,7);ctx.fill();
  ctx.fillStyle=PAL.bad;ctx.beginPath();ctx.arc(tx,bot+14,14,0,7);ctx.fill();ctx.fillRect(tx-5,bot-(bot-top-10)*f,10,(bot-top-10)*f+10);txt(ctx,T.toFixed(1)+' °C',tx,24,PAL.ink,13);
  // chip
  const cx=230,cy=130;ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.arc(cx,cy,40,Math.PI,0);ctx.lineTo(cx+40,cy+30);ctx.lineTo(cx-40,cy+30);ctx.closePath();ctx.fill();txt(ctx,'LM35',cx,cy+10,PAL.ink2,13);
  ['+Vs','Vout','GND'].forEach((l,i)=>{const x=cx-30+i*30;W(ctx,[[x,cy+30],[x,cy+80]],PAL.gray,3);txt(ctx,l,x,cy+96,i===1?PAL.yellow:PAL.muted,11);});
  // inside hint
  box(ctx,310,40,210,110,PAL.violet);txt(ctx,'inside',415,60,PAL.muted,11);txt(ctx,'transistor "on" voltage',415,82,PAL.ink2,12);txt(ctx,'drops ~2 mV per °C',415,100,PAL.ink2,12);txt(ctx,'→ amplified & trimmed to',415,122,PAL.ink2,12);txt(ctx,'exactly 10 mV per °C',415,140,PAL.yellow,13);
  // meter
  box(ctx,330,175,170,70,PAL.yellow);txt(ctx,'Vout',415,198,PAL.muted,12);txt(ctx,(V*1000).toFixed(0)+' mV',415,230,PAL.white,22);
  // graph
  const gx=560,gy=30,gw=220,gh=220;ctx.fillStyle=PAL.panel;ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle=PAL.line;ctx.strokeRect(gx,gy,gw,gh);
  const X=v=>gx+(v+10)/110*gw,Y=v=>gy+gh-v/1.0*gh;ctx.strokeStyle=PAL.yellow;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X(-10),Y(0));ctx.lineTo(X(0),Y(0));ctx.lineTo(X(100),Y(1));ctx.stroke();
  ctx.fillStyle=PAL.white;ctx.beginPath();ctx.arc(X(T),Y(V),5,0,7);ctx.fill();txt(ctx,'1 V',gx-4,gy+10,PAL.muted2,10,'right');txt(ctx,'0 V',gx-4,gy+gh,PAL.muted2,10,'right');txt(ctx,'0 °C',X(0),gy+gh+14,PAL.muted2,10);txt(ctx,'100 °C',X(100)-8,gy+gh+14,PAL.muted2,10);}
// ---------- touch ----------
const TC2={on:false,v:0};
function drawTouch(t,dt){const c=sv('ctouch');if(!c)return;const ctx=ctxOf(c),k=+$('tcSkin').value;TC2.v+=((TC2.on?1:0)-TC2.v)*Math.min(1,dt*12);
  const Rskin=2e6*Math.pow(0.05,k),Ib=TC2.on?Math.max(0,(9-1.3)/(Rskin+1000)):0,I1=Ib*200,I2=Math.min(0.016,I1*200);
  // pads + finger
  ctx.fillStyle=PAL.brown;ctx.fillRect(40,150,60,14);ctx.fillRect(110,150,60,14);txt(ctx,'pad A',70,182,PAL.muted,11);txt(ctx,'pad B',140,182,PAL.muted,11);
  const fy=60+TC2.v*68;ctx.fillStyle='#fcd9b6';ctx.beginPath();ctx.ellipse(105,fy,38,22,0,0,7);ctx.fill();ctx.fillRect(85,fy-80,40,80);txt(ctx,'☝',105,fy+6,'#a16207',14);
  txt(ctx,'skin ≈ '+fmtR(Rskin),105,215,'#fcd9b6',13);
  const st=(x,y,l,v,col)=>{box(ctx,x,y,150,70,col);txt(ctx,l,x+75,y+24,PAL.muted,12);txt(ctx,v,x+75,y+52,PAL.white,17);};
  const fI=i=>i>=1e-3?(i*1000).toFixed(1)+' mA':(i*1e6).toFixed(1)+' µA';
  st(210,110,'skin current',fI(Ib),'#fcd9b6');st(390,110,'after transistor 1 (×200)',fI(I1),PAL.blue);st(570,110,'after transistor 2 (×200)',fI(I2),PAL.green);
  [[360,145],[540,145]].forEach(([x,y])=>{W(ctx,[[x,y],[x+24,y]],PAL.muted2,2);ctx.fillStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(x+30,y);ctx.lineTo(x+22,y-5);ctx.lineTo(x+22,y+5);ctx.fill();});
  const b=Math.min(1,I2/0.012);glowAt(ctx,645,240,b,'239,68,68',50);ctx.fillStyle=`rgba(239,68,68,${0.25+0.75*b})`;ctx.beginPath();ctx.arc(645,240,12,0,7);ctx.fill();txt(ctx,'LED',680,244,PAL.muted,12,'left');
  txt(ctx,TC2.on?(I2>0.004?'LED on: '+Math.round(I1/ Math.max(Ib,1e-12))*200+'× more current than your skin carries':'too little current: skin too dry?'):'not touching: no current',400,60,TC2.on?PAL.yellow:PAL.muted2,13);}
// ---------- push button ----------
const BT={press:false,mode:'pd',tP:-9,tR:-9,hist:[],acc:0};
function btnLevel(t){const pressed=BT.press,deb=$('btDeb').checked;const since=pressed?t-BT.tP:t-BT.tR;
  let closed=pressed;if(!deb&&since<0.012){closed=Math.sin(since*2600)>0?!pressed:pressed;}
  if(BT.mode==='none'){if(closed)return 1;return 0.5+0.45*Math.sin(t*37)*Math.sin(t*5.3);}
  let v=BT.mode==='pd'?(closed?1:0):(closed?0:1);if(deb){const tau=0.004,s=Math.min(1,since/tau);const from=BT.mode==='pd'?(pressed?0:1):(pressed?1:0);v=from+(v-from)*(1-Math.exp(-since/0.0015));}return v;}
function drawBtn(t,dt){const c=sv('cbtn');if(!c)return;const ctx=ctxOf(c);
  // schematic
  const x=150;W(ctx,[[x,30],[x,50]]);txt(ctx,'+5 V',x,22,PAL.bad,12);
  const pd=BT.mode==='pd',pu=BT.mode==='pu';
  // top element
  if(pu){zig(ctx,x,50,110);txt(ctx,'10 kΩ',x+14,84,PAL.muted,11,'left');}else{W(ctx,[[x,50],[x,70]]);ctx.strokeStyle=WIRE;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,70);ctx.lineTo(x+(BT.press?0:18),95);ctx.stroke();W(ctx,[[x,98],[x,110]]);txt(ctx,'button',x+24,86,PAL.muted,11,'left');}
  W(ctx,[[x,110],[x,170]]);ctx.fillStyle=WIRE;ctx.beginPath();ctx.arc(x,140,4,0,7);ctx.fill();W(ctx,[[x,140],[x+90,140]],PAL.yellow,2.5);txt(ctx,'to the chip input',x+96,144,PAL.yellow,12,'left');
  if(pd){zig(ctx,x,170,230);txt(ctx,'10 kΩ',x+14,204,PAL.muted,11,'left');}else if(pu){ctx.strokeStyle=WIRE;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,170);ctx.lineTo(x+(BT.press?0:18),195);ctx.stroke();W(ctx,[[x,198],[x,230]]);txt(ctx,'button',x+24,190,PAL.muted,11,'left');}else{txt(ctx,'nothing here:',x+14,200,PAL.bad,12,'left');txt(ctx,'the input floats',x+14,216,PAL.bad,12,'left');}
  if(BT.mode!=='none'){W(ctx,[[x,230],[x,250]]);txt(ctx,'0 V',x,266,PAL.muted,12);}
  const lv=btnLevel(t);box(ctx,40,100,70,60,lv>0.7?PAL.green:lv<0.3?PAL.muted2:PAL.bad);txt(ctx,'input',75,120,PAL.muted,11);txt(ctx,lv>0.7?'1':lv<0.3?'0':'??',75,148,PAL.white,20);
  // scope
  BT.acc+=dt;if(BT.acc>0.01){BT.acc=0;BT.hist.push(lv);if(BT.hist.length>220)BT.hist.shift();}
  const gx=420,gy=30,gw=360,gh=110;ctx.fillStyle=PAL.panel;ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle=PAL.line;ctx.strokeRect(gx,gy,gw,gh);ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;ctx.beginPath();BT.hist.forEach((v,i)=>{const px=gx+i/219*gw,py=gy+gh-10-v*(gh-20);i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.stroke();txt(ctx,'input over the last 2 s',gx+6,gy+14,PAL.muted,11,'left');
  // zoom of bounce
  const zx=420,zy=160,zw=360,zh=100;ctx.fillStyle=PAL.panel;ctx.fillRect(zx,zy,zw,zh);ctx.strokeStyle=PAL.line;ctx.strokeRect(zx,zy,zw,zh);ctx.strokeStyle=PAL.amber;ctx.beginPath();
  const deb=$('btDeb').checked;let edges=0,prev=0;for(let i=0;i<=200;i++){const s=i/200*0.02;let v;if(s<0.002)v=0;else{const q=s-0.002;if(deb)v=1-Math.exp(-q/0.0015);else v=q<0.009?(Math.sin(q*2600)>-0.2?1:0):1;}const px=zx+i/200*zw,py=zy+zh-10-v*(zh-20);i?ctx.lineTo(px,py):ctx.moveTo(px,py);const d=v>0.5?1:0;if(d&&!prev)edges++;prev=d;}ctx.stroke();
  txt(ctx,'zoom: the first 20 ms of a press',zx+6,zy+14,PAL.muted,11,'left');txt(ctx,deb?'smooth: 1 count ✓':'bounces: '+edges+' counts for one press!',zx+zw-6,zy+zh-8,deb?PAL.green:PAL.bad,12,'right');}
(()=>{const b=$('btPress');b.style.touchAction='none';b.addEventListener('pointerdown',e=>{e.preventDefault();BT.press=true;BT.tP=performance.now()/1000;});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>{if(BT.press){BT.press=false;BT.tR=performance.now()/1000;}}));
  [['btPD','pd'],['btPU','pu'],['btNone','none']].forEach(([id,m])=>$(id).addEventListener('click',()=>{BT.mode=m;['btPD','btPU','btNone'].forEach(x=>$(x).classList.toggle('active',x===id));}));
  const t=$('tcTouch');hold(t,on=>{TC2.on=on;});})();
// ---------- pickup ----------
const PK={a:0,t:0,hist:[],acc:0};
$('pkPluck').addEventListener('click',()=>{PK.a=1;});
function drawPick(t,dt){const c=sv('cpick');if(!c)return;const ctx=ctxOf(c),h=+$('pkH').value;PK.t+=dt;PK.a*=Math.exp(-dt*0.9);
  const f=2.2,disp=PK.a*Math.sin(PK.t*2*Math.PI*f)*28,vel=PK.a*Math.cos(PK.t*2*Math.PI*f);const gap=20+h*60,sens=1/Math.pow(gap/20,2);const v=vel*sens;
  // string
  const sy=60+gap*0,mid=210;ctx.strokeStyle=PAL.grayLight;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(20,sy);ctx.quadraticCurveTo(mid,sy+disp*2,400,sy);ctx.stroke();txt(ctx,'steel string',30,sy-10,PAL.muted,11,'left');
  // pickup
  const py=sy+gap+disp*0;ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.roundRect(120,sy+gap+10,180,60,10);ctx.fill();for(let i=0;i<6;i++){ctx.fillStyle=PAL.gray;ctx.beginPath();ctx.arc(145+i*26,sy+gap+22,6,0,7);ctx.fill();}
  ctx.strokeStyle=PAL.brown;ctx.lineWidth=1;for(let i=0;i<10;i++){ctx.beginPath();ctx.ellipse(210,sy+gap+48,95-i,10,0,0,7);ctx.stroke();}txt(ctx,'magnet poles + coil (≈ 7,000 turns)',210,sy+gap+92,PAL.muted,11);
  // field lines
  const fs=0.4+0.6*Math.abs(vel)*sens;ctx.strokeStyle=`rgba(96,165,250,${0.2+0.6*PK.a})`;ctx.lineWidth=1.5;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.ellipse(mid+i*40,sy+gap/2+disp*0.6,14,gap/2+6,0,0,7);ctx.stroke();}
  // output
  PK.acc+=dt;if(PK.acc>0.01){PK.acc=0;PK.hist.push(v);if(PK.hist.length>240)PK.hist.shift();}
  const gx=440,gy=40,gw=340,gh=200;ctx.fillStyle=PAL.panel;ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle=PAL.line;ctx.strokeRect(gx,gy,gw,gh);ctx.strokeStyle=PAL.slateDark;ctx.beginPath();ctx.moveTo(gx,gy+gh/2);ctx.lineTo(gx+gw,gy+gh/2);ctx.stroke();
  ctx.strokeStyle=PAL.green;ctx.lineWidth=2;ctx.beginPath();PK.hist.forEach((q,i)=>{const x=gx+i/239*gw,y=gy+gh/2-q*80;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
  txt(ctx,'coil voltage (slowed down ×50)',gx+6,gy+14,PAL.muted,11,'left');txt(ctx,'peak ≈ '+Math.round(300*PK.a*sens)+' mV',gx+gw-6,gy+gh-8,PAL.green,12,'right');}

// ---------- infrared ----------
const IR={m:0,dist:0.4,pressed:false,tP:-9,walk:0,pirOut:0,hist:[],acc:0};
function irCtl(){const c=$('irCtl');c.innerHTML=IR.m===0?'<label class="slider" style="flex:1">Object distance<input id="irD" type="range" min="0" max="1" step="0.01" value="'+IR.dist+'" style="flex:1;width:auto"></label><label class="slider"><input type="checkbox" id="irBlack"> black surface</label>':IR.m===1?'<button id="irBtn" style="font-size:1.05rem">👆 Hold a remote button</button>':'<button id="irWalk" style="font-size:1.05rem">🚶 Walk past</button><span class="hint">or stand still and watch nothing happen</span>';
  if(IR.m===0)$('irD').addEventListener('input',e=>IR.dist=+e.target.value);
  if(IR.m===1){const b=$('irBtn');b.style.touchAction='none';b.addEventListener('pointerdown',e=>{e.preventDefault();IR.pressed=true;IR.tP=performance.now()/1000;});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>IR.pressed=false));}
  if(IR.m===2)$('irWalk').addEventListener('click',()=>{IR.walk=0.001;});IR.hist=[];}
document.querySelectorAll('.irM').forEach(b=>b.addEventListener('click',()=>{IR.m=+b.dataset.m;document.querySelectorAll('.irM').forEach(x=>x.classList.toggle('active',x===b));irCtl();}));irCtl();
function drawIR(t,dt){const c=sv('cir');if(!c)return;const ctx=ctxOf(c);
  if(IR.m===0){const black=$('irBlack')&&$('irBlack').checked;const d=IR.dist,ox=200+d*360;const refl=black?0.08:1;const I=refl*Math.min(1,Math.pow(0.12/(0.08+d*0.9),2));const V=5-4.6*Math.min(1,I*1.4);
    ctx.fillStyle=PAL.chipDark;ctx.fillRect(60,100,90,90);ctx.fillStyle='#7c3aed';ctx.beginPath();ctx.arc(105,125,12,0,7);ctx.fill();ctx.fillStyle=PAL.chip;ctx.beginPath();ctx.arc(105,165,12,0,7);ctx.fill();txt(ctx,'IR LED',60,122,'#c4b5fd',11,'right');txt(ctx,'photo-',60,162,PAL.muted,11,'right');txt(ctx,'transistor',60,176,PAL.muted,11,'right');
    for(let i=0;i<7;i++){const k=(t*1.3+i/7)%1;const x=117+(ox-117)*Math.min(1,k*2),back=k>0.5;const xx=back?ox-(ox-117)*((k-0.5)*2):x,yy=back?125+40*((k-0.5)*2):125;if(back&&Math.random()>refl*1.2)continue;ctx.fillStyle=`rgba(167,139,250,${back?0.4+0.6*I:0.8})`;ctx.beginPath();ctx.arc(xx,yy,3,0,7);ctx.fill();}
    ctx.fillStyle=black?'#111':PAL.grayLight;ctx.fillRect(ox,70,22,150);txt(ctx,black?'black':'white',ox+11,240,PAL.muted,11);txt(ctx,Math.round(2+d*38)+' cm',ox+11,256,PAL.muted,11);
    box(ctx,600,90,170,100,I>0.35?PAL.green:PAL.muted2);txt(ctx,'collector voltage',685,114,PAL.muted,12);txt(ctx,V.toFixed(1)+' V',685,146,PAL.white,22);txt(ctx,I>0.35?'OBSTACLE':'nothing',685,174,I>0.35?PAL.green:PAL.muted2,13);
    txt(ctx,'(the eye sees nothing: IR is invisible · purple here just for the drawing)',400,282,PAL.muted2,11);}
  else if(IR.m===1){const on=IR.pressed;const since=t-IR.tP;const code=[1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,0,1,1,0,1,0,1,1,0];
    // remote
    ctx.fillStyle=PAL.chip;ctx.beginPath();ctx.roundRect(40,70,70,150,14);ctx.fill();for(let i=0;i<6;i++){ctx.fillStyle=PAL.slate;ctx.beginPath();ctx.arc(60+(i%2)*30,120+Math.floor(i/2)*30,9,0,7);ctx.fill();}
    const burst=on&&code[Math.floor(since*12)%code.length]===1;glowAt(ctx,75,72,burst?0.8:0,'167,139,250',30);
    // waveforms
    const gx=170,gw=420;ctx.fillStyle=PAL.panel;ctx.fillRect(gx,40,gw,90);ctx.fillRect(gx,160,gw,90);txt(ctx,'IR LED light (zoom: each burst = 38 kHz flashes)',gx+6,54,PAL.muted,11,'left');txt(ctx,'receiver OUT (LOW during a burst)',gx+6,174,PAL.muted,11,'left');
    ctx.strokeStyle=PAL.violet;ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<=gw;i++){const k=Math.floor((i/gw*24+(on?since*12:0)))%code.length;const b=on&&code[k]===1;const y=b?(Math.sin(i*1.6)>0?66:118):118;i?ctx.lineTo(gx+i,y):ctx.moveTo(gx+i,y);}ctx.stroke();
    ctx.strokeStyle=PAL.green;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=gw;i++){const k=Math.floor((i/gw*24+(on?since*12:0)))%code.length;const b=on&&code[k]===1;const y=b?236:186;i?ctx.lineTo(gx+i,y):ctx.moveTo(gx+i,y);}ctx.stroke();
    ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.arc(680,150,30,Math.PI,0);ctx.lineTo(710,190);ctx.lineTo(650,190);ctx.closePath();ctx.fill();txt(ctx,'TSOP',680,170,PAL.ink2,11);['OUT','GND','VS'].forEach((l,i)=>{W(ctx,[[656+i*24,190],[656+i*24,225]],PAL.gray,2.5);txt(ctx,l,656+i*24,240+(i%2)*12,PAL.muted,10);});
    const led=burst;glowAt(ctx,760,150,led?0.8:0,'239,68,68',26);ctx.fillStyle=led?PAL.bad:'#3b1d1d';ctx.beginPath();ctx.arc(760,150,9,0,7);ctx.fill();txt(ctx,'test LED',760,176,PAL.muted,10);
    txt(ctx,on?'button held: the code repeats':'press the button',400,280,on?PAL.yellow:PAL.muted2,13);}
  else{if(IR.walk>0)IR.walk+=dt*0.25;if(IR.walk>1.2)IR.walk=0;const px=IR.walk>0?60+IR.walk*600:-100;
    // zones
    for(let i=0;i<8;i++){const x0=80+i*70;ctx.fillStyle=i%2?'rgba(56,189,248,.08)':'rgba(56,189,248,.16)';ctx.beginPath();ctx.moveTo(400,40);ctx.lineTo(x0,250);ctx.lineTo(x0+70,250);ctx.closePath();ctx.fill();}
    ctx.fillStyle='#f8fafc';ctx.beginPath();ctx.arc(400,40,22,0,Math.PI);ctx.fill();txt(ctx,'PIR',400,30,PAL.ink2,11);
    if(IR.walk>0){glowAt(ctx,px,200,0.6,'249,115,22',40);ctx.fillStyle=PAL.orangeSoft;ctx.beginPath();ctx.arc(px,170,10,0,7);ctx.fill();ctx.fillRect(px-7,182,14,40);txt(ctx,'warm body',px,240,PAL.orangeSoft,11);}
    const zone=IR.walk>0?Math.floor((px-80)/70):-1;IR.acc+=dt;const sig=IR.walk>0&&zone>=0&&zone<8?Math.sin(((px-80)%70)/70*Math.PI*2)*(zone%2?1:-1):0;if(Math.abs(sig)>0.6)IR.pirOut=4;IR.pirOut=Math.max(0,IR.pirOut-dt);
    if(IR.acc>0.03){IR.acc=0;IR.hist.push([sig,IR.pirOut>0?1:0]);if(IR.hist.length>200)IR.hist.shift();}
    ctx.fillStyle=PAL.panel;ctx.fillRect(600,60,180,80);ctx.fillRect(600,160,180,80);ctx.strokeStyle=PAL.amber;ctx.lineWidth=1.5;ctx.beginPath();IR.hist.forEach(([s],i)=>{const x=600+i*0.9,y=100-s*30;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
    ctx.strokeStyle=PAL.green;ctx.lineWidth=2;ctx.beginPath();IR.hist.forEach(([,o],i)=>{const x=600+i*0.9,y=230-o*55;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();txt(ctx,'crystal signal',606,74,PAL.muted,10,'left');txt(ctx,'module OUT (stays HIGH a few s)',606,174,PAL.muted,10,'left');
    txt(ctx,IR.pirOut>0?'MOTION! OUT = HIGH':'no change in heat: OUT = LOW',690,270,IR.pirOut>0?PAL.green:PAL.muted2,13);}}
// ---------- loop ----------
loop((dt,now)=>{const t=now/1000;drawLDR(t);drawLM35(t);drawTouch(t,dt);drawBtn(t,dt);drawPick(t,dt);drawIR(t,dt);});
