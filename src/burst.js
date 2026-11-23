<script>
// ===== Burst demo =====
const BU={V:9,vc:0,stress:0,broken:false,heat:0,off:0,flow:0,t:0,smoke:[],popT:0};
const RATING=16, VMAX=30;
$('bV').oninput=e=>{BU.V=+e.target.value;$('bVlab').textContent=BU.V+' V';};
$('bNew').onclick=()=>{BU.vc=0;BU.stress=0;BU.broken=false;BU.heat=0;BU.smoke=[];BU.popT=0;};
function stepBurst(dt){
  BU.t+=dt;
  if(!BU.broken){
    const I=(BU.V-BU.vc)/BU.V||0; // normalised
    BU.vc+=(BU.V-BU.vc)*dt/0.6;
    const leak = BU.vc>12 ? Math.pow((BU.vc-12)/4,2)*0.06 : 0.004*BU.vc/16;
    BU.flow=(BU.V-BU.vc)/16 + leak;
    if(BU.vc>RATING){BU.stress+=dt*(BU.vc-RATING)/5;}
    else BU.stress=Math.max(0,BU.stress-dt*0.2);
    if(BU.stress>=1){BU.broken=true;BU.popT=0.8;}
  } else {
    BU.vc+=(BU.V*0.08-BU.vc)*dt/0.1;   // shorted: almost no voltage held
    BU.flow=BU.V/12;                    // big continuous flow
    BU.heat=Math.min(1,BU.heat+dt*BU.V/40);
    if(BU.V>0 && Math.random()<dt*12) BU.smoke.push({x:400+(Math.random()-0.5)*40,y:30,a:1,r:6});
  }
  BU.popT=Math.max(0,BU.popT-dt);
  BU.smoke.forEach(s=>{s.y-=dt*30;s.r+=dt*14;s.a-=dt*0.5;});BU.smoke=BU.smoke.filter(s=>s.a>0);
  BU.off-=BU.flow*dt*260;
}
function drawBurst(){
  const c=$('cBurst'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const X1=110,X2=600,Y1=90,Y2=250,cx=360,top=40,bot=140;
  loopPath(ctx,X1,Y1,X2,Y2);ctx.strokeStyle='#bcd6fb';ctx.lineWidth=26;ctx.lineJoin='round';ctx.stroke();
  loopPath(ctx,X1,Y1,X2,Y2);ctx.strokeStyle='#3b82f6';ctx.lineWidth=6;ctx.setLineDash([16,14]);ctx.lineDashOffset=BU.off;ctx.stroke();ctx.setLineDash([]);
  // chamber (glows red when hot)
  ctx.fillStyle='#bcd6fb';ctx.fillRect(cx-70,top,140,bot-top);
  if(BU.heat>0){ctx.fillStyle=`rgba(239,68,68,${0.6*BU.heat})`;ctx.fillRect(cx-70,top,140,bot-top);}
  const ratio=BU.vc/RATING, b=Math.min(1.6,ratio)*42, mid=(top+bot)/2;
  ctx.strokeStyle='#e2e8f0';ctx.lineWidth=3;ctx.strokeRect(cx-70,top,140,bot-top);
  const sheetCol = ratio<0.75?'#10b981':ratio<=1?'#f59e0b':'#ef4444';
  if(!BU.broken){
    ctx.beginPath();ctx.moveTo(cx,top);ctx.quadraticCurveTo(cx+2*b,mid,cx,bot);
    ctx.strokeStyle=sheetCol;ctx.lineWidth=ratio>1?3:5;ctx.stroke();
    if(ratio>1){ // strain marks, shaking
      const sh=(Math.random()-0.5)*4*Math.min(1,BU.stress*2);
      ctx.strokeStyle='#fecaca';ctx.lineWidth=1.5;
      for(let i=0;i<4;i++){const yy=mid-18+i*12;ctx.beginPath();ctx.moveTo(cx+b+sh-4,yy);ctx.lineTo(cx+b+sh+4,yy+4);ctx.stroke();}
    }
  } else {
    // torn: two flaps with a hole
    ctx.strokeStyle='#ef4444';ctx.lineWidth=5;
    ctx.beginPath();ctx.moveTo(cx,top);ctx.quadraticCurveTo(cx+30,top+20,cx+44,mid-14);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,bot);ctx.quadraticCurveTo(cx+30,bot-20,cx+44,mid+14);ctx.stroke();
    arrowText(ctx,'TORN',cx+12,mid+5,'#7f1d1d',15);
  }
  BU.smoke.forEach(s=>{ctx.fillStyle=`rgba(148,163,184,${0.5*s.a})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.fill();});
  if(BU.popT>0){arrowText(ctx,'💥 POP!',cx,top-8,'#fbbf24',26);}
  arrowText(ctx,'capacitor (1000 µF, 16 V)',cx,bot+22,'#e2e8f0',13);
  // pump with pressure
  const py=(Y1+Y2)/2;ctx.beginPath();ctx.arc(X1,py,34,0,7);ctx.fillStyle='#fef3c7';ctx.fill();ctx.strokeStyle='#b45309';ctx.lineWidth=3;ctx.stroke();
  arrowText(ctx,BU.V+' V',X1,py+6,'#b45309',16);arrowText(ctx,'battery (pump)',X1,py+56,'#94a3b8',13);
  // narrow pipe
  ctx.fillStyle='#64748b';ctx.fillRect(320,Y2-15,80,8);ctx.fillRect(320,Y2+7,80,8);
  // flow label
  let flowTxt, flowCol;
  if(BU.broken){flowTxt=BU.V>0?'flow NEVER stops: short circuit!':'no push, no flow';flowCol='#ef4444';}
  else if(BU.flow>0.03){flowTxt='flowing: charging';flowCol='#3b82f6';}
  else if(BU.vc>12.5){flowTxt='flow stopped, but a small leak (strained)';flowCol='#f59e0b';}
  else {flowTxt='flow stopped: fully charged';flowCol='#10b981';}
  arrowText(ctx,flowTxt,(X1+X2)/2+30,Y2+42,flowCol,15);
  // stretch meter
  const mx=680,mt=30,mh=240,Yv=v=>mt+mh-v/VMAX*mh;
  ctx.fillStyle='#10b981';ctx.fillRect(mx,Yv(12),24,Yv(0)-Yv(12));
  ctx.fillStyle='#f59e0b';ctx.fillRect(mx,Yv(RATING),24,Yv(12)-Yv(RATING));
  ctx.fillStyle='#ef4444';ctx.fillRect(mx,Yv(VMAX),24,Yv(RATING)-Yv(VMAX));
  ctx.strokeStyle='#e2e8f0';ctx.lineWidth=2;ctx.strokeRect(mx,mt,24,mh);
  arrowText(ctx,'16 V limit',mx+30,Yv(RATING)+4,'#fca5a5',12,'left');
  arrowText(ctx,'0 V',mx+30,Yv(0)+4,'#94a3b8',12,'left');arrowText(ctx,'30 V',mx+30,Yv(VMAX)+8,'#94a3b8',12,'left');
  // markers: battery (triangle) and cap (line)
  ctx.fillStyle='#fbbf24';const yb=Yv(BU.V);ctx.beginPath();ctx.moveTo(mx-4,yb);ctx.lineTo(mx-16,yb-7);ctx.lineTo(mx-16,yb+7);ctx.fill();
  arrowText(ctx,'battery',mx-20,yb+4,'#fbbf24',11,'right');
  ctx.strokeStyle='#fff';ctx.lineWidth=4;const yc=Yv(Math.max(0,BU.vc));ctx.beginPath();ctx.moveTo(mx-2,yc);ctx.lineTo(mx+26,yc);ctx.stroke();
  arrowText(ctx,'stretch',mx+12,mt+mh+20,'#94a3b8',12);
  // readouts
  $('bVc').textContent=BU.vc.toFixed(1)+' V';
  $('bQ').textContent=(BU.broken?0:BU.vc).toFixed(1)+' mC';
  const st=$('bStat');
  if(BU.broken){st.textContent='BROKEN: replace it';st.style.color='#ef4444';}
  else if(BU.vc>RATING){st.textContent='over the limit: about to fail!';st.style.color='#ef4444';}
  else if(BU.vc>12){st.textContent='near the limit: strained';st.style.color='#f59e0b';}
  else if(BU.flow>0.03){st.textContent='charging';st.style.color='#3b82f6';}
  else {st.textContent='full and healthy';st.style.color='#10b981';}
}
let lastB=performance.now();
function frameB(now){const dt=Math.min(0.05,(now-lastB)/1000);lastB=now;stepBurst(dt);drawBurst();requestAnimationFrame(frameB);}
requestAnimationFrame(frameB);
</script>
