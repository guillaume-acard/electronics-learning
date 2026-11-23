// ===== p23: breadboard layout + demo =====
BBL.p23={"power": 9, "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 1, "t": "ecap", "a": "tp7", "b": "tn8", "lab": "100\u00b5"}, {"s": 2, "t": "chip", "col": 10, "n": 8, "lab": "NE555"}, {"s": 2, "t": "wire", "a": "d10", "b": "tp10", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "j10", "b": "bn10", "c": "#111"}, {"s": 2, "t": "wire", "a": "j13", "b": "bp13", "c": PAL.redDark}, {"s": 3, "t": "res", "a": "c10", "b": "c11", "v": 1000}, {"s": 3, "t": "pot", "h": ["a20", "a21", "a22"]}, {"s": 3, "t": "wire", "a": "d11", "b": "c21", "c": PAL.orangeDark}, {"s": 4, "t": "diode", "a": "b20", "b": "b12"}, {"s": 4, "t": "diode", "a": "c12", "b": "c22"}, {"s": 4, "t": "wire", "a": "a12", "b": "i11", "c": PAL.blueDark}, {"s": 4, "t": "ccap", "a": "h11", "b": "bn11", "lab": "10n"}, {"s": 5, "t": "res", "a": "i12", "b": "i16", "v": 470}, {"s": 5, "t": "led", "a": "h16", "b": "h18"}, {"s": 5, "t": "wire", "a": "j18", "b": "bn18", "c": "#111"}, {"s": 6, "t": "npn", "c": "g32", "b": "g31", "e": "g30", "lab": "E B C"}, {"s": 6, "t": "res", "a": "h12", "b": "h31", "v": 1000}, {"s": 6, "t": "wire", "a": "j30", "b": "bn30", "c": "#111"}, {"s": 7, "t": "box", "at": [330, 352], "w": 140, "h": 46, "lab": "\u2699\ufe0f DC motor RE140/1", "col": PAL.chipLight, "ly": 28, "pins": [{"n": "", "dx": 18, "dy": 0, "to": "j32", "c": PAL.gold}, {"n": "", "dx": 122, "dy": 0, "to": "bp35", "c": PAL.redDark}]}, {"s": 8, "t": "diode", "a": "i32", "b": "bp33"}, {"s": 9, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};
(function(){
// ---------- p23/p24: motors ----------
const MO={a23:0,w23:0,a24:0,w24:0,f:false,r:false,ph:0};
function drawPWM(dt){const ctx=cv('m23'),d=+$('p23d').value;$('p23v').textContent=Math.round(d*100)+' % on';
  const x0=44,y0=40,w=450,h=140,per=w/4;ctx.fillStyle=PAL.panel;ctx.fillRect(x0,y0,w,h);ctx.strokeStyle=PAL.line;ctx.strokeRect(x0,y0,w,h);
  const yh=y0+20,yl=y0+h-20;ctx.strokeStyle=PAL.blue;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x0,yl);
  for(let k=0;k<4;k++){const a=x0+k*per;ctx.lineTo(a,yl);ctx.lineTo(a,yh);ctx.lineTo(a+per*d,yh);ctx.lineTo(a+per*d,yl);}ctx.lineTo(x0+w,yl);ctx.stroke();
  const ya=yl-(yl-yh)*d;ctx.setLineDash([6,5]);ctx.strokeStyle=PAL.yellow;ctx.beginPath();ctx.moveTo(x0,ya);ctx.lineTo(x0+w,ya);ctx.stroke();ctx.setLineDash([]);
  txt(ctx,'9 V',x0-4,yh+4,PAL.muted,11,'right');txt(ctx,'0 V',x0-4,yl+4,PAL.muted,11,'right');txt(ctx,'average '+(9*d).toFixed(1)+' V',x0+w-6,ya-6,PAL.yellow,12,'right');
  txt(ctx,'555 output → transistor → motor (one period ≈ 76 µs)',x0,y0-12,PAL.ink2,12,'left');
  for(let k=0;k<4;k++){const a=x0+k*per;txt(ctx,'on',a+per*d/2,yh-6,PAL.link,10);}
  // motor
  const tgt=d<0.15?0:(d-0.15)/0.85*9200;MO.w23+=(tgt-MO.w23)*(1-Math.exp(-dt/0.6));MO.a23+=MO.w23/60*2*Math.PI*dt*0.02;
  motorDraw(ctx,640,110,MO.a23);txt(ctx,MO.w23<50?'stopped (too weak to start)':'≈ '+Math.round(MO.w23/100)*100+' rpm',640,190,PAL.white,14);
  txt(ctx,'(drawn 50× slower)',640,208,PAL.muted2,11);
  // LED + bar
  glowAt(ctx,110,250,d*0.9,'239,68,68',30);ctx.fillStyle=`rgba(239,68,68,${0.15+0.85*d})`;ctx.beginPath();ctx.arc(110,250,10,0,7);ctx.fill();txt(ctx,'speed LED',110,280,PAL.muted,11);
  txt(ctx,'Power wasted in the transistor: tiny, it is either fully ON or fully OFF',480,255,PAL.muted,12);}
function drawHB(dt){const ctx=cv('m24'),f=MO.f,r=MO.r;const L=f&&!r?1:0,Rr=r&&!f?1:0;const hiL=f,hiR=r;// 1Y high if FWD pressed, 2Y high if REV pressed
  MO.ph+=dt;const cx=400,top=40,bot=250,lx=250,rx=550,my=145;
  W(ctx,[[lx,top],[rx,top]],PAL.bad,3);W(ctx,[[lx,bot],[rx,bot]],PAL.water,3);txt(ctx,'+9 V',cx,top-10,PAL.bad,12);txt(ctx,'0 V',cx,bot+20,PAL.water,12);
  const sw=(x,y1,y2,on,lab)=>{W(ctx,[[x,y1],[x,y1+20]],PAL.ink2,2.5);W(ctx,[[x,y2-20],[x,y2]],PAL.ink2,2.5);ctx.strokeStyle=on?PAL.green:PAL.muted2;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y2-20);ctx.lineTo(on?x:x+18,y1+20);ctx.stroke();
    ctx.fillStyle=PAL.ink2;[y1+20,y2-20].forEach(y=>{ctx.beginPath();ctx.arc(x,y,3,0,7);ctx.fill();});txt(ctx,lab,x+(x<cx?-34:34),(y1+y2)/2+4,on?PAL.green:PAL.muted2,12);};
  sw(lx,top,my,hiL,'S1');sw(lx,my,bot,!hiL,'S2');sw(rx,top,my,hiR,'S3');sw(rx,my,bot,!hiR,'S4');
  W(ctx,[[lx,my],[cx-50,my]],PAL.ink2,2.5);W(ctx,[[cx+50,my],[rx,my]],PAL.ink2,2.5);txt(ctx,'1Y',lx+22,my-8,PAL.muted,11);txt(ctx,'2Y',rx-22,my-8,PAL.muted,11);
  const dir=L?1:Rr?-1:0;MO.w24+=(dir*1-MO.w24)*(1-Math.exp(-dt/(dir?0.5:0.25)));MO.a24+=MO.w24*dt*6;motorDraw(ctx,cx,my,MO.a24,PAL.yellow);
  if(dir){const path=dir>0?[[lx,top+2],[lx,my],[cx-50,my],[cx+50,my],[rx,my],[rx,bot-2]]:[[rx,top+2],[rx,my],[cx+50,my],[cx-50,my],[lx,my],[lx,bot-2]];
    const segs=[];let tot=0;for(let i=1;i<path.length;i++){const l=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]);segs.push(l);tot+=l;}
    for(let k=0;k<14;k++){let s=((MO.ph*120+k*tot/14)%tot);for(let i=0;i<segs.length;i++){if(s<=segs[i]){const t=s/segs[i],p=[path[i][0]+(path[i+1][0]-path[i][0])*t,path[i][1]+(path[i+1][1]-path[i][1])*t];if(!(p[0]>cx-46&&p[0]<cx+46)){ctx.fillStyle=PAL.highlight;ctx.beginPath();ctx.arc(p[0],p[1],4,0,7);ctx.fill();}break;}s-=segs[i];}}}
  // LEDs
  [[680,110,'239,68,68',L,'red: forward'],[680,180,'34,197,94',Rr,'green: reverse']].forEach(([x,y,c,on,l])=>{glowAt(ctx,x,y,on?0.9:0,c,30);ctx.fillStyle=`rgba(${c},${on?1:0.2})`;ctx.beginPath();ctx.arc(x,y,11,0,7);ctx.fill();txt(ctx,l,x+20,y+4,PAL.muted,12,'left');});
  const st=f&&r?'both pressed: S1 + S3 closed, 9 V on both ends → 0 V across the motor: stop':f?'FORWARD: S1 + S4 closed, current flows left → right':r?'REVERSE: S3 + S2 closed, current flows right → left':'no button: S2 + S4 closed, both ends at 0 V: stop';
  txt(ctx,st,cx,290,PAL.ink,13);txt(ctx,'inside the L293D',100,40,PAL.muted2,12);}
[['p24f','f'],['p24r','r']].forEach(([id,k])=>{const b=$(id);hold(b,on=>{MO[k]=on;});});
loop((dt,now)=>{if(vis('m23'))drawPWM(dt);if(vis('m24'))drawHB(dt);});
})();
