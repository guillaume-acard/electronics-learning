// ===== p22: breadboard layout + demo =====
BBL.p22={"power": 10, "parts": [{"s": 1, "t": "pm"}, {"s": 2, "t": "chip", "col": 4, "n": 8, "lab": "555 #1"}, {"s": 2, "t": "wire", "a": "d4", "b": "tp4", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "j4", "b": "bn4", "c": "#111"}, {"s": 2, "t": "wire", "a": "j7", "b": "bp7", "c": PAL.redDark}, {"s": 3, "t": "res", "a": "c4", "b": "c5", "v": 1000}, {"s": 3, "t": "res", "a": "b5", "b": "b6", "v": 10000}, {"s": 3, "t": "wire", "a": "a6", "b": "i5", "c": PAL.blueDark}, {"s": 3, "t": "ccap", "a": "h5", "b": "bn5", "lab": "100n"}, {"s": 4, "t": "chip", "col": 20, "n": 8, "lab": "555 #2"}, {"s": 4, "t": "wire", "a": "d20", "b": "tp20", "c": PAL.redDark}, {"s": 4, "t": "wire", "a": "j20", "b": "bn20", "c": "#111"}, {"s": 4, "t": "wire", "a": "g6", "b": "g23", "c": PAL.purple}, {"s": 5, "t": "res", "a": "c20", "b": "c21", "v": 1000}, {"s": 5, "t": "res", "a": "b21", "b": "b26", "v": 2200}, {"s": 5, "t": "res", "a": "c26", "b": "c29", "v": 1000}, {"s": 5, "t": "res", "a": "d29", "b": "d22", "v": 330}, {"s": 5, "t": "wire", "a": "a22", "b": "i21", "c": PAL.blueDark}, {"s": 5, "t": "ccap", "a": "h21", "b": "bn21", "lab": "4.7n"}, {"s": 6, "t": "res", "a": "i22", "b": "i28", "v": 1000}, {"s": 6, "t": "wire", "a": "h28", "b": "h55", "c": PAL.orangeDark}, {"s": 6, "t": "led", "a": "g55", "b": "g57", "rgb": "139,92,246"}, {"s": 6, "t": "wire", "a": "j57", "b": "bn57", "c": "#111"}, {"s": 7, "t": "npn", "c": "c40", "b": "c41", "e": "c42", "lab": "TSOP"}, {"s": 7, "t": "wire", "a": "a41", "b": "tn41", "c": "#111"}, {"s": 7, "t": "wire", "a": "a42", "b": "tp42", "c": PAL.redDark}, {"s": 7, "t": "ecap", "a": "b42", "b": "tn43", "lab": "10\u00b5"}, {"s": 8, "t": "res", "a": "tp36", "b": "a36", "v": 4700}, {"s": 8, "t": "ecap", "a": "b36", "b": "tn37", "lab": "10\u00b5"}, {"s": 8, "t": "diode", "a": "d36", "b": "d40"}, {"s": 9, "t": "npn", "c": "c46", "b": "c47", "e": "c48"}, {"s": 9, "t": "wire", "a": "a48", "b": "tn49", "c": "#111"}, {"s": 9, "t": "res", "a": "e36", "b": "e47", "v": 10000}, {"s": 9, "t": "res", "a": "a47", "b": "tn47", "v": 10000}, {"s": 9, "t": "res", "a": "tp44", "b": "a44", "v": 330}, {"s": 9, "t": "led", "a": "b44", "b": "b46"}]};
(function(){
// ---------- p22: IR beam alarm ----------
const IR22={blk:false,X:0.8,hist:[],ph:0};
function drawIR(dt){const ctx=cv('m22'),f=+$('irF').value,sens=Math.exp(-Math.pow((f-38)/2.6,2)),seen=!IR22.blk&&sens>0.45;$('irFv').textContent=f.toFixed(1)+' kHz';
  IR22.ph+=dt*0.6;const tgt=seen?0.8:3.6;IR22.X+=(tgt-IR22.X)*(1-Math.exp(-dt/(seen?0.04:0.35)));IR22.hist.push(IR22.X);if(IR22.hist.length>240)IR22.hist.shift();const alarm=IR22.X>1.3;
  const box=(x,y,w,h,t1,t2,col)=>{ctx.fillStyle=PAL.panel;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,h,8);ctx.fill();ctx.stroke();txt(ctx,t1,x+w/2,y+20,PAL.ink2,12);if(t2)txt(ctx,t2,x+w/2,y+40,PAL.muted,11);};
  const ar=(x1,y1,x2,y2,col)=>{W(ctx,[[x1,y1],[x2,y2]],col||PAL.muted2,2);const a=Math.atan2(y2-y1,x2-x1);ctx.fillStyle=col||PAL.muted2;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-9*Math.cos(a-0.4),y2-9*Math.sin(a-0.4));ctx.lineTo(x2-9*Math.cos(a+0.4),y2-9*Math.sin(a+0.4));ctx.fill();};
  box(15,20,120,52,'555 #1','bursts 690 /s',PAL.blue);ar(135,46,165,46);box(165,20,120,52,'555 #2',f.toFixed(1)+' kHz',PAL.blue);ar(285,46,315,46);
  // IR LED
  const on=Math.sin(IR22.ph*40)>0;glowAt(ctx,335,46,on?0.8:0.2,'139,92,246',34);ctx.fillStyle='#8b5cf6';ctx.beginPath();ctx.arc(335,46,12,0,7);ctx.fill();txt(ctx,'IR LED',335,86,'#c4b5fd',11);
  // beam
  for(let i=0;i<14;i++){const x=355+i*15+((IR22.ph*120)%15);if(IR22.blk&&x>445)break;const burst=Math.floor((x-IR22.ph*120)/30)%2===0;ctx.fillStyle=burst?'rgba(167,139,250,.9)':'rgba(167,139,250,.15)';ctx.fillRect(x,43,8,6);}
  txt(ctx,'invisible 940 nm light',455,28,PAL.muted2,11);if(IR22.blk){txt(ctx,'✋',462,60,PAL.white,34);}
  // TSOP
  box(580,20,110,52,'TSOP38238',sens>0.45?'hears '+f.toFixed(0)+' kHz':'deaf at '+f.toFixed(0)+' kHz',seen?PAL.green:PAL.amber);
  // row 2: bucket, transistor, LED
  ar(635,72,635,130);box(560,130,150,60,'bucket (10 µF)','X = '+IR22.X.toFixed(2)+' V',PAL.yellow);
  const lvl=Math.min(1,(IR22.X-0.5)/3.1);ctx.fillStyle='rgba(56,189,248,.35)';ctx.fillRect(715,190-60*lvl,22,60*lvl);ctx.strokeStyle=PAL.slate;ctx.strokeRect(715,130,22,60);
  ar(560,160,450,160,alarm?PAL.bad:PAL.muted2);box(330,130,120,60,'BC547',alarm?'ON':'off',alarm?PAL.bad:PAL.slate);ar(330,160,250,160,alarm?PAL.bad:PAL.muted2);
  glowAt(ctx,215,160,alarm?0.95:0,'239,68,68',60);ctx.fillStyle=alarm?PAL.bad:'rgba(239,68,68,.2)';ctx.beginPath();ctx.arc(215,160,18,0,7);ctx.fill();
  txt(ctx,alarm?'🚨 ALARM: beam cut':'beam OK',100,165,alarm?PAL.bad:PAL.green,14);
  // scopes
  const gy=230,gh=90,gw=245;const g1=[],g2=[];for(let i=0;i<120;i++){const t=i/120*4+IR22.ph*2,bu=(t%1)<0.5;g1.push(bu?(Math.sin(i*2.6)>0?1:0):0);g2.push(seen&&bu?0:1);}
  mGraph(ctx,15,gy,gw,gh,[[g1,PAL.violet]],-0.2,1.3,'IR light (38 kHz bursts)');
  mGraph(ctx,277,gy,gw,gh,[[g2,PAL.green]],-0.2,1.3,'TSOP OUT (low = burst heard)');
  mGraph(ctx,539,gy,gw,gh,[[IR22.hist,PAL.yellow],[IR22.hist.map(()=>1.3),PAL.bad,[4,4]]],0,4,'bucket X (V), red = alarm level');
  txt(ctx,'slowed down: real bursts last 0.7 ms',400,gy+gh+24,PAL.muted2,11);}
(()=>{const b=$('irBlock');hold(b,on=>{IR22.blk=on;});})();
loop((dt,now)=>{if(vis('m22'))drawIR(dt);});
})();
