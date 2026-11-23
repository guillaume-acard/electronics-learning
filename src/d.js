<script>
// ===== Long pipe inertia demo =====
const LP={mode:0,t:0,q:0.15,q2:0.15,S:1,d:0.15,P:1,off1:0,off2:0,h:[],glitch:0};
choices('lChoices',['No tank','Tank far away','Tank right beside the chip'],0,i=>{LP.mode=i;LP.S=1;LP.q=LP.q2=LP.d;});
function stepLP(DT){const n=10,dt=DT/n;for(let k=0;k<n;k++){
  LP.t+=dt;const ph=LP.t%0.9;const r=0.05,g=0.1;
  LP.d=0.15+1.05*(ph<r?ph/r:ph<g?1:ph<g+r?1-(ph-g)/r:0);
  const tau=0.35,tau2=0.025,C=0.6;let short;
  if(LP.mode===0){LP.q+=(LP.d-LP.q)*dt/tau;LP.q2=LP.q;LP.S=1;short=LP.d-LP.q;}
  else if(LP.mode===1){LP.q+=(LP.q2+2*(1-LP.S)-LP.q)*dt/tau;LP.q2+=(LP.d-LP.q2)*dt/tau2;LP.S=Math.min(1,Math.max(0,LP.S+(LP.q-LP.q2)*dt/C));short=LP.d-LP.q2;}
  else {LP.q+=(LP.d+2*(1-LP.S)-LP.q)*dt/tau;LP.q2=LP.d;LP.S=Math.min(1,Math.max(0,LP.S+(LP.q-LP.d)*dt/C));short=0;}
  LP.P=1-0.6*Math.max(0,short)-0.3*(1-LP.S);
  LP.off1-=LP.q*dt*300;LP.off2-=LP.q2*dt*300;
 }
 if(LP.P<0.75)LP.glitch=0.4;LP.glitch=Math.max(0,LP.glitch-DT);
 LP.h.push({t:LP.t,P:LP.P,th:0.75});prune(LP.h,LP.t,4);}
function drawLP(){const c=$('cPipe'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const y=120,x0=120,xT=650,xm=390;
  const pipe=(a,b,off)=>{ctx.strokeStyle='#bcd6fb';ctx.lineWidth=22;ctx.beginPath();ctx.moveTo(a,y);ctx.lineTo(b,y);ctx.stroke();
    ctx.strokeStyle='#3b82f6';ctx.lineWidth=6;ctx.setLineDash([16,14]);ctx.lineDashOffset=off;ctx.beginPath();ctx.moveTo(a,y);ctx.lineTo(b,y);ctx.stroke();ctx.setLineDash([]);};
  // supply tank
  ctx.fillStyle='#3b82f6';ctx.fillRect(30,40,90,140);ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.strokeRect(30,40,90,140);
  arrowText(ctx,'power',75,100,'#fff',14);arrowText(ctx,'supply',75,118,'#fff',14);
  if(LP.mode===1){pipe(x0,xm,LP.off1);pipe(xm,xT,LP.off2);}else if(LP.mode===2){pipe(x0,xT-70,LP.off1);pipe(xT-70,xT,LP.off2);}else pipe(x0,xT,LP.off1);
  arrowText(ctx,'long pipe: the water must speed up first (inertia)',x0+170,y-26,'#94a3b8',12);
  arrowText(ctx,'speed: '+Math.round(LP.q*100)+'%',x0+60,y+34,'#60a5fa',12);
  // small tank
  const tx=LP.mode===1?xm:LP.mode===2?xT-70:null;
  if(tx){const w=56,h=60,tt=y-11-h;ctx.fillStyle='#1e293b';ctx.fillRect(tx-w/2,tt,w,h);ctx.fillStyle='#60a5fa';ctx.fillRect(tx-w/2,tt+h*(1-LP.S),w,h*LP.S);
    ctx.strokeStyle='#cbd5e1';ctx.lineWidth=2;ctx.strokeRect(tx-w/2,tt,w,h);arrowText(ctx,'100 nF tank',tx,tt-8,'#60a5fa',12);}
  // tap / chip
  ctx.fillStyle=LP.glitch>0?'#fee2e2':'#475569';ctx.fillRect(xT,y-35,80,70);
  arrowText(ctx,'CHIP',xT+40,y-4,LP.glitch>0?'#b91c1c':'#fff',14);arrowText(ctx,LP.glitch>0?'GLITCH!':'OK',xT+40,y+16,LP.glitch>0?'#b91c1c':'#4ade80',13);
  // gulp stream
  const sw=4+14*(LP.d-0.15);ctx.fillStyle='#3b82f6';ctx.fillRect(xT+40-sw/2,y+35,sw,30);
  arrowText(ctx,LP.d>0.5?'GULP!':'sipping',xT+40,y+82,LP.d>0.5?'#fbbf24':'#94a3b8',12);
  // gauge
  const gx=740,gy=y-58;ctx.strokeStyle='#2a3650';ctx.lineWidth=8;ctx.beginPath();ctx.arc(gx,gy,22,Math.PI,2*Math.PI);ctx.stroke();
  ctx.strokeStyle='#ef4444';ctx.beginPath();ctx.arc(gx,gy,22,Math.PI,Math.PI*1.75);ctx.stroke();
  ctx.strokeStyle='#10b981';ctx.beginPath();ctx.arc(gx,gy,22,Math.PI*1.75,2*Math.PI);ctx.stroke();
  const a=Math.PI+Math.max(0,Math.min(1,LP.P))*Math.PI;ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(gx+20*Math.cos(a),gy+20*Math.sin(a));ctx.stroke();
  arrowText(ctx,'pressure',gx,gy+16,'#94a3b8',11);
  plot(ctx,60,230,700,80,LP.h,LP.t,4,[{k:'P',col:'#3b82f6',label:'pressure (voltage) at the chip'},{k:'th',col:'#ef4444',dash:[6,4],lw:1.5,label:'below this the chip glitches'}],0.2,1.05,'');
}
let lastLP=performance.now();
function frameLP(now){const dt=Math.min(0.05,(now-lastLP)/1000);lastLP=now;stepLP(dt);drawLP();requestAnimationFrame(frameLP);}
requestAnimationFrame(frameLP);
</script>
