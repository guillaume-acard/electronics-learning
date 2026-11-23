// ===== p25: breadboard layout + demo =====
BBL.p25={"power": 6, "parts": [{"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "wire", "a": "tp10", "b": "a10", "c": PAL.redDark}, {"s": 2, "t": "diode", "a": "c10", "b": "c14"}, {"s": 2, "t": "diode", "a": "d14", "b": "d18"}, {"s": 2, "t": "diode", "a": "c18", "b": "c22"}, {"s": 2, "t": "diode", "a": "d22", "b": "d26"}, {"s": 3, "t": "wire", "a": "b26", "b": "h26", "c": PAL.orangeDark}, {"s": 4, "t": "box", "at": [330, 352], "w": 140, "h": 46, "lab": "\u2699\ufe0f DC motor RE140/1", "col": PAL.chipLight, "ly": 28, "pins": [{"n": "", "dx": 18, "dy": 0, "to": "j26", "c": PAL.gold}, {"n": "", "dx": 122, "dy": 0, "to": "bn32", "c": "#111"}]}, {"s": 5, "t": "ecap", "a": "i27", "b": "bn28", "lab": "1000\u00b5"}, {"s": 5, "t": "wire", "a": "g26", "b": "g27", "c": PAL.orangeDark}, {"s": 6, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};
(function(){
// ---------- p25: lower the voltage ----------
const LV={m:'dio',a:0,w:0};
document.querySelectorAll('.p25m').forEach(b=>b.addEventListener('click',()=>{LV.m=b.dataset.m;document.querySelectorAll('.p25m').forEach(x=>x.classList.toggle('active',x===b));}));
const LVF={direct:I=>9-0.5*I,cap:I=>9-0.5*I,res:I=>9-0.5*I-12*I,dio:I=>9-0.5*I-4*(0.7+0.15*I),pwm:I=>0.67*(9-0.5*I)};
const LVC={direct:PAL.bad,cap:PAL.orange,res:PAL.violet,dio:PAL.green,pwm:PAL.blue};
const LVN={direct:'direct 9 V',cap:'capacitor only',res:'resistor 12 Ω',dio:'4 diodes',pwm:'PWM 67 % (average)'};
function drawLV(dt){const ctx=cv('m25'),l=+$('p25l').value,I=0.1+0.8*l,m=LV.m,Vm=LVF[m](I),E=Vm-6*I,sp=Math.max(0,E/5.4);
  const x0=60,y0=20,w=380,h=230,X=i=>x0+i*w,Y=v=>y0+h-v/10*h;
  ctx.fillStyle=PAL.panel;ctx.fillRect(x0,y0,w,h);ctx.fillStyle='rgba(34,197,94,.12)';ctx.fillRect(x0,Y(6),w,Y(3)-Y(6));txt(ctx,'3–6 V: what a small motor wants',x0+w-6,Y(3)-6,'#4ade80',11,'right');
  ctx.strokeStyle=PAL.line;ctx.strokeRect(x0,y0,w,h);
  for(let v=0;v<=10;v+=2)txt(ctx,v+' V',x0-6,Y(v)+4,PAL.muted2,10,'right');[0,0.25,0.5,0.75,1].forEach(i=>txt(ctx,i+' A',X(i),y0+h+16,PAL.muted2,10));
  txt(ctx,'current the motor draws →',x0+w/2,y0+h+32,PAL.muted,11);txt(ctx,'voltage on the motor',x0+4,y0+14,PAL.muted,11,'left');
  Object.keys(LVF).forEach(k=>{if(k==='cap')return;const sel=k===m||(m==='cap'&&k==='direct');ctx.strokeStyle=sel?LVC[m==='cap'?'cap':k]:'rgba(148,163,184,.25)';ctx.lineWidth=sel?3:1.5;ctx.beginPath();
    for(let i=0;i<=50;i++){const c=i/50,v=Math.max(0,LVF[k](c));i?ctx.lineTo(X(c),Y(v)):ctx.moveTo(X(c),Y(v));}ctx.stroke();});
  ctx.fillStyle=PAL.white;ctx.beginPath();ctx.arc(X(I),Y(Math.max(0,Vm)),6,0,7);ctx.fill();
  ctx.fillStyle='rgba(17,28,46,.85)';ctx.fillRect(x0+6,Y(1.6),170,22);txt(ctx,'● '+LVN[m],x0+12,Y(1.6)+15,LVC[m],12,'left');
  // motor
  LV.w+=(sp-LV.w)*(1-Math.exp(-dt/0.4));LV.a+=LV.w*dt*14;motorDraw(ctx,600,90,LV.a);
  const heat=m==='res'?12*I*I:m==='dio'?4*(0.7+0.15*I)*I:m==='pwm'?0.05:0;
  const verdict=E<=0.3?['stalls: not enough voltage left',PAL.amber]:Vm>6.6?['too fast: hot coil, worn brushes, short life',PAL.bad]:Vm<2.8?['weak, may stall',PAL.amber]:['✓ happy motor',PAL.green];
  txt(ctx,'motor gets '+Math.max(0,Vm).toFixed(1)+' V at '+I.toFixed(2)+' A',600,160,PAL.white,13);txt(ctx,'speed '+Math.round(sp*100)+' % of its rated speed',600,180,PAL.ink2,12);
  txt(ctx,verdict[0],600,202,verdict[1],13);
  txt(ctx,'heat wasted in the reducer: '+heat.toFixed(2)+' W',600,232,PAL.ink2,12);
  if(m==='res'&&heat>0.25)txt(ctx,'🔥 a 1/4 W resistor burns above 0.25 W',600,252,PAL.bad,12);
  if(m==='dio')txt(ctx,(heat/4).toFixed(2)+' W per diode: fine (1N4007 ≈ 1 W)',600,252,PAL.muted,12);
  if(m==='cap')txt(ctx,'the capacitor charges to 9 V: nothing reduced',600,252,PAL.orange,12);
  if(m==='pwm')txt(ctx,'switching: almost no heat',600,252,PAL.muted,12);
  txt(ctx,l<0.05?'spinning free':l>0.9?'almost blocked (like start-up)':'with some load',600,280,PAL.muted2,11);}
loop((dt,now)=>{if(vis('m25'))drawLV(dt);});
})();
