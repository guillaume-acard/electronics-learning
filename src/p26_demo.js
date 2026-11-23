// ---------- p26: quartz stopwatch ----------
const QZ={t:0,t5:0};
$('p26r').addEventListener('click',()=>{QZ.t=0;QZ.t5=0;});
function drawQZ(dt){const ctx=cv('m26');QZ.t+=dt;QZ.t5+=dt*1.03;
  const st=[['quartz','32,768 Hz'],['÷2 ×4','2,048 Hz'],['÷2 ×4','128 Hz'],['Q12','8 Hz'],['Q13','4 Hz'],['Q14','2 Hz'],['4013','1 Hz']];
  const fr=[32768,2048,128,8,4,2,1];
  st.forEach(([a,b],i)=>{const x=20+i*110,y=30,f=fr[i],on=f<=10?Math.floor(QZ.t*f*2)%2===0:null;
    ctx.fillStyle='#111c2e';ctx.strokeStyle=i===0?'#cbd5e1':i===6?'#22c55e':'#60a5fa';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,96,60,8);ctx.fill();ctx.stroke();
    txt(ctx,a,x+48,y+20,'#cbd5e1',12);txt(ctx,b,x+48,y+40,'#fff',13);
    if(on===null){ctx.fillStyle='rgba(250,204,21,.45)';ctx.fillRect(x+30,y+48,36,6);}else{glowAt(ctx,x+48,y+52,on?0.8:0,'250,204,21',14);ctx.fillStyle=on?'#facc15':'#3f3f1d';ctx.beginPath();ctx.arc(x+48,y+52,5,0,7);ctx.fill();}
    if(i<6){W(ctx,[[x+96,y+30],[x+110,y+30]],'#64748b',2);}});
  txt(ctx,'inside the CD4060: 14 divide-by-2 stages',350,108,'#64748b',11);txt(ctx,'blur = too fast to see',90,108,'#64748b',11);
  const disp=(x,lab,col,t,sub)=>{const n=Math.floor(t)%100;ctx.fillStyle='#0a0a0a';ctx.fillRect(x,140,150,90);txt(ctx,String(n).padStart(2,'0'),x+75,205,col,60);txt(ctx,lab,x+75,132,'#cbd5e1',13);txt(ctx,sub,x+75,250,'#94a3b8',12);};
  disp(140,'quartz version','#ef4444',QZ.t,'±2 s per day');disp(420,'NE555 version','#f97316',QZ.t5,'3 % fast here');
  const diff=QZ.t5-QZ.t;txt(ctx,'after '+QZ.t.toFixed(0)+' s, the 555 is ahead by '+diff.toFixed(1)+' s',400,285,diff>1?'#f59e0b':'#94a3b8',13);}
