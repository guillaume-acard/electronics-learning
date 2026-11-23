<script>
// ===== Coupling: why centred on 0 =====
const Z={t:0,vc:4.5,h:[]}, zTau=1.2;
$('zPlug').onclick=()=>{Z.vc=0;};
$('zSettled').onclick=()=>{Z.vc=4.5;};
function stepZ(dt){Z.t+=dt;const vin=4.5+0.5*Math.sin(2*Math.PI*0.8*Z.t);
  const out=vin-Z.vc; Z.vc+=out*dt/zTau; Z.h.push({t:Z.t,vin,out,vc:Z.vc});prune(Z.h,Z.t,6);}
function drawZ(){
  const c=$('cCenter'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=30,H=240,min=-1.5,max=6, Y=v=>T+H-(v-min)/(max-min)*H;
  const gL=60,gW=250,gR=500;
  const last=Z.h[Z.h.length-1]||{vin:4.5,out:0,vc:4.5};
  // scales + gridlines (same for both)
  [0,1,2,3,4,4.5,5,6,-1].forEach(v=>{if(v<min||v>max)return;
    ctx.strokeStyle=v===0?'#64748b':'#1f2a40';ctx.lineWidth=v===0?1.5:1;ctx.setLineDash(v===0?[5,4]:[]);
    [[gL,gL+gW],[gR,gR+gW]].forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(a,Y(v));ctx.lineTo(b,Y(v));ctx.stroke();});ctx.setLineDash([]);
    if(Number.isInteger(v)){arrowText(ctx,v+' V',gL-6,Y(v)+4,'#94a3b8',11,'right');arrowText(ctx,v+' V',gR-6,Y(v)+4,'#94a3b8',11,'right');}});
  // average line on input
  ctx.strokeStyle='#f59e0b';ctx.setLineDash([6,4]);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(gL,Y(4.5));ctx.lineTo(gL+gW,Y(4.5));ctx.stroke();ctx.setLineDash([]);
  arrowText(ctx,'average 4.5 V',gL+gW-4,Y(4.5)-8,'#f59e0b',11,'right');
  // traces
  const span=6, X=(x0,t)=>x0+gW-(Z.t-t)/span*gW;
  [['vin',gL,'#f59e0b'],['out',gR,'#10b981']].forEach(([k,x0,col])=>{ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();
    Z.h.forEach((p,i)=>{const x=X(x0,p.t),y=Y(p[k]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();});
  arrowText(ctx,'INPUT (DC + music)',gL+gW/2,T-10,'#f59e0b',13);
  arrowText(ctx,'OUTPUT = input − capacitor',gR+gW/2,T-10,'#10b981',13);
  // live dots
  ctx.fillStyle='#f59e0b';ctx.beginPath();ctx.arc(gL+gW,Y(last.vin),5,0,7);ctx.fill();
  ctx.fillStyle='#10b981';ctx.beginPath();ctx.arc(gR+gW,Y(last.out),5,0,7);ctx.fill();
  // middle: capacitor as a "height shifter"
  const mx=(gL+gW+gR)/2, frac=Math.max(0,Math.min(1,last.vc/4.5));
  ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(gL+gW+10,Y(last.vin));ctx.lineTo(mx-8,Y(last.vin));ctx.stroke();
  ctx.fillStyle='#cbd5e1';ctx.fillRect(mx-8,Y(last.vin)-16,4,32);ctx.fillRect(mx+4,Y(last.out)-16,4,32);
  ctx.beginPath();ctx.moveTo(mx+8,Y(last.out));ctx.lineTo(gR-10,Y(last.out));ctx.stroke();
  // held voltage bracket
  if(last.vc>0.05){ctx.strokeStyle='#60a5fa';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mx-1,Y(last.vin));ctx.lineTo(mx-1,Y(last.out));ctx.stroke();
    ctx.fillStyle='#60a5fa';ctx.beginPath();ctx.moveTo(mx-1,Y(last.out));ctx.lineTo(mx-6,Y(last.out)-9);ctx.lineTo(mx+4,Y(last.out)-9);ctx.fill();}
  arrowText(ctx,'capacitor holds',mx,Y(-1.5)+22,'#60a5fa',12);
  arrowText(ctx,last.vc.toFixed(2)+' V',mx,Y(-1.5)+40,'#60a5fa',16);
  // output average + explanation
  let s=0,n=0;Z.h.forEach(p=>{if(p.t>Z.t-1.25){s+=p.out;n++;}});const avg=n?s/n:0;
  let msg,col;
  if(avg>0.15){msg='Output average is '+avg.toFixed(2)+' V, above 0, so current flows through the resistor and keeps filling the capacitor…';col='#fbbf24';}
  else {msg='Settled: the capacitor holds the 4.5 V average, so the output wiggles around 0 V ✓';col='#10b981';}
  arrowText(ctx,msg,400,Y(-1.5)+75,col,13);
}
let lastZ=performance.now();
function frameZ(now){const dt=Math.min(0.05,(now-lastZ)/1000);lastZ=now;stepZ(dt);drawZ();requestAnimationFrame(frameZ);}
requestAnimationFrame(frameZ);
</script>
