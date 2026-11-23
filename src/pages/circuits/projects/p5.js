// ===== p5: breadboard layout + demo =====
BBL.p5={power:8,parts:[{s:2,t:'npn',c:'c20',b:'c21',e:'c22'},{s:2,t:'npn',c:'c30',b:'c31',e:'c32'},{s:3,t:'wire',a:'e22',b:'e31',c:W_O},{s:4,t:'wire',a:'d20',b:'d30',c:W_Y},{s:5,t:'wire',a:'b32',b:'tn33',c:W_B},
  {s:6,t:'led',a:'a36',b:'a30'},{s:6,t:'res',a:'b36',b:'tp37',v:470},{s:7,t:'res',a:'tp12',b:'a12',v:1000},{s:7,t:'wire',a:'b12',b:[150,400],c:W_U,freeB:1,lab:'pad A'},{s:7,t:'wire',a:'b21',b:[230,400],c:W_P,freeB:1,lab:'pad B'},{s:8,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'},{s:8,t:'note',at:[190,392],txt:'☝️',fs:20}]};
(function(){
// ---------- p5: why two transistors ----------
const P5W={n:2};document.querySelectorAll('.p5n').forEach(b=>b.addEventListener('click',()=>{P5W.n=+b.dataset.n;document.querySelectorAll('.p5n').forEach(x=>x.classList.toggle('active',x===b));}));
function drawP5W(){const ctx=cv('cp5w'),k=+$('p5skin').value,R=100e3*Math.pow(20,k),Ib=(9-0.7*P5W.n)/(R+1000),G=P5W.n===2?40000:200,avail=Ib*G,need=(9-2-0.2*P5W.n)/470,I=Math.min(avail,need),b=I/need;
  const fI=i=>i>=1e-3?(i*1000).toFixed(i<0.01?1:0)+' mA':(i*1e6).toFixed(1)+' µA';
  const box=(x,y,w,t1,t2,col)=>{ctx.fillStyle=PAL.panel;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,64,8);ctx.fill();ctx.stroke();txt(ctx,t1,x+w/2,y+22,PAL.muted,11);txt(ctx,t2,x+w/2,y+50,PAL.white,17);};
  const ar=(x1,x2,y,l)=>{W(ctx,[[x1,y],[x2-8,y]],PAL.muted2,2);ctx.fillStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(x2,y);ctx.lineTo(x2-9,y-5);ctx.lineTo(x2-9,y+5);ctx.fill();txt(ctx,l,(x1+x2)/2,y-8,PAL.yellow,12);};
  box(20,20,165,'finger (≈ '+(R>=1e6?(R/1e6).toFixed(1)+' MΩ':Math.round(R/1000)+' kΩ')+')',fI(Ib),'#fcd9b6');ar(185,230,52,'× 200');
  box(230,20,165,'transistor 1: up to',fI(Ib*200),PAL.blue);
  if(P5W.n===2){ar(395,440,52,'× 200');box(440,20,165,'transistor 2: up to',fI(Ib*40000),PAL.green);}
  // need vs available
  const y=130,x0=20,w=540,lg=v=>Math.max(0,Math.min(1,(Math.log10(v)+6)/6));
  ctx.fillStyle=PAL.raised;ctx.fillRect(x0,y,w,22);ctx.fillStyle=avail>=need?PAL.green:PAL.amber;ctx.fillRect(x0,y,w*lg(avail),22);
  const nx=x0+w*lg(need);ctx.strokeStyle=PAL.bad;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(nx,y-6);ctx.lineTo(nx,y+28);ctx.stroke();txt(ctx,'LED wants 14 mA',nx,y+44,PAL.bad,12);
  txt(ctx,'current available: '+fI(avail),x0,y-8,PAL.ink2,12,'left');['1 µA','10 µA','100 µA','1 mA','10 mA','100 mA','1 A'].forEach((l,i)=>txt(ctx,l,x0+w*i/6,y+64,PAL.muted2,10));
  // LED
  glowAt(ctx,690,90,b*0.95,'239,68,68',70);ctx.fillStyle=`rgba(239,68,68,${0.2+0.8*b})`;ctx.beginPath();ctx.arc(690,90,22,0,7);ctx.fill();
  txt(ctx,'LED current: '+fI(I),690,148,PAL.white,14);txt(ctx,b>0.97?'full brightness ✓':b>0.3?'dim':'barely glows',690,170,b>0.97?PAL.green:PAL.amber,13);}
loop((dt,now)=>{if(vis('cp5w'))drawP5W();});
})();
