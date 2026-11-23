<script>
// ===== Balance / electrons demo =====
const E={mode:1,t:0,vc:0.6,off:0,vin:0.6,I:0};
choices('eChoices',['Steady push (DC)','Music (changing push)'],1,i=>{E.mode=i;});
function stepE(dt){E.t+=dt;E.vin=E.mode===0?0.9:0.6+0.35*Math.sin(2*Math.PI*0.5*E.t);
  E.I=E.vin-E.vc;E.vc+=E.I*dt/0.35;E.off-=E.I*dt*900;}
function drawE(){const c=$('cElec'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const y=170,cx=400;
  // wires + moving charges
  ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(60,y);ctx.lineTo(cx-14,y);ctx.moveTo(cx+14,y);ctx.lineTo(740,y);ctx.stroke();
  ctx.strokeStyle='#fbbf24';ctx.lineWidth=9;ctx.lineCap='round';ctx.setLineDash([0,24]);ctx.lineDashOffset=E.off;
  ctx.beginPath();ctx.moveTo(60,y);ctx.lineTo(cx-24,y);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+24,y);ctx.lineTo(740,y);ctx.stroke();ctx.setLineDash([]);ctx.lineCap='butt';
  // plates
  ctx.fillStyle='#cbd5e1';ctx.fillRect(cx-16,y-50,6,100);ctx.fillRect(cx+10,y-50,6,100);
  const n=Math.round(Math.max(0,E.vc)*8);for(let i=0;i<n;i++){const yy=y-44+i*(88/8);arrowText(ctx,'+',cx-28,yy+8,'#f87171',14);arrowText(ctx,'−',cx+28,yy+8,'#60a5fa',14);}
  arrowText(ctx,'gap',cx,y+68,'#94a3b8',12);arrowText(ctx,'nothing crosses',cx,y+84,'#94a3b8',12);
  arrowText(ctx,'input side',150,y+40,'#94a3b8',12);arrowText(ctx,'output side',650,y+40,'#94a3b8',12);
  // balance bars
  const bx=140,bw=60,bh=90,by=20;
  [[E.vin,'#f59e0b','input push',bx],[E.vc,'#60a5fa','capacitor push-back',bx+90]].forEach(([v,col,l,x])=>{
    ctx.fillStyle='#2a3650';ctx.fillRect(x,by,bw,bh);ctx.fillStyle=col;const hh=Math.min(1,v)*bh;ctx.fillRect(x,by+bh-hh,bw,hh);
    arrowText(ctx,l,x+bw/2,by+bh+16,col,12);});
  let msg,col;
  if(Math.abs(E.I)<0.015){msg='Balanced: no flow';col='#10b981';}
  else if(E.I>0){msg='Input pushes harder: charge flows forward →';col='#fbbf24';}
  else {msg='← Capacitor pushes harder: charge flows back';col='#fbbf24';}
  arrowText(ctx,msg,330,60,col,16,'left');
  arrowText(ctx,E.mode===0?'Steady push: balances once, then stays still forever.':'Changing push: balance keeps breaking, so the charges keep sloshing.',330,88,'#cbd5e1',13,'left');
}
// ===== Race: thimble vs bathtub =====
const RC={w:0,t:0,a:0,b:0,h:[]}, waves=[{f:0.3,lab:'Slow wave (bass)'},{f:2.5,lab:'Fast wave (treble)'}], tS=0.08,tB=3;
choices('sChoices',waves.map(w=>w.lab),0,i=>{RC.w=i;RC.h=[];});
function stepR(dt){RC.t+=dt;const vin=0.8*Math.sin(2*Math.PI*waves[RC.w].f*RC.t);
  RC.a+=(vin-RC.a)*dt/tS;RC.b+=(vin-RC.b)*dt/tB;RC.h.push({t:RC.t,vin,a:RC.a,b:RC.b});prune(RC.h,RC.t,waves[RC.w].f<1?7:2.5);}
function drawR(){const c=$('cRace'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const span=waves[RC.w].f<1?7:2.5, T=45,H=170;
  [[20,'a','🥄 Small capacitor (thimble)',tS],[410,'b','🛁 Big capacitor (bathtub)',tB]].forEach(([x0,k,title,tau])=>{
    const W=370,X=t=>x0+W-(RC.t-t)/span*W,Y=v=>T+H/2-v*H/2.1;
    ctx.fillStyle='#1e293b';ctx.fillRect(x0,T,W,H);
    arrowText(ctx,title,x0+W/2,T-14,'#e2e8f0',15);
    // gap shading
    ctx.strokeStyle='rgba(16,185,129,0.35)';ctx.lineWidth=2;
    RC.h.forEach((p,i)=>{if(i%3)return;const x=X(p.t);ctx.beginPath();ctx.moveTo(x,Y(p.vin));ctx.lineTo(x,Y(p[k]));ctx.stroke();});
    [['vin','#f59e0b'],[k,'#60a5fa']].forEach(([kk,col])=>{ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();
      RC.h.forEach((p,i)=>{const x=X(p.t),y=Y(p[kk]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();});
    const wt=2*Math.PI*waves[RC.w].f*tau, g=wt/Math.sqrt(1+wt*wt);
    ctx.fillStyle='#2a3650';ctx.fillRect(x0,T+H+22,W,14);ctx.fillStyle='#10b981';ctx.fillRect(x0,T+H+22,W*g,14);
    arrowText(ctx,'gets through: '+Math.round(g*100)+'%',x0+W/2,T+H+56,g>0.6?'#10b981':'#f87171',14);
    arrowText(ctx,g>0.6?'can\'t keep up, so the wave passes':'keeps up, so the wave is cancelled',x0+W/2,T+H+74,'#94a3b8',12);
  });
}
let lastE=performance.now();
function frameE(now){const dt=Math.min(0.05,(now-lastE)/1000);lastE=now;stepE(dt);stepR(dt);drawE();drawR();requestAnimationFrame(frameE);}
requestAnimationFrame(frameE);
</script>
