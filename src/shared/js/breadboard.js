// ===== Breadboard: geometry (BB, HP), the board and the parts drawn on it (partOn). Used by Circuits and Build. =====
// Holes are named like the real board: rows a–e / f–j and columns 1–60; rails tp/tn (top + / −) and bp/bn (bottom).
const BB={W:800,H:440,x0:38,dx:12.4,rows:{tp:112,tn:124,a:150,b:162,c:174,d:186,e:198,f:228,g:240,h:252,i:264,j:276,bp:302,bn:314}};
function HP(h){if(Array.isArray(h))return h;const m=/^(tp|tn|bp|bn|[a-j])(\d+)$/.exec(h);if(!m)throw 'bad hole '+h;return [BB.x0+(+m[2]-1)*BB.dx,BB.rows[m[1]]];}
function drawBoard(ctx){ctx.fillStyle=PAL.grayLight;ctx.beginPath();ctx.roundRect(22,98,BB.W-44,232,8);ctx.fill();
  ctx.fillStyle='#d1d5db';ctx.fillRect(28,206,BB.W-56,14);
  [['tp',PAL.bad,-7],['tn',PAL.water,7],['bp',PAL.bad,-7],['bn',PAL.water,7]].forEach(([r,c,o])=>{ctx.strokeStyle=c;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(30,BB.rows[r]+o);ctx.lineTo(BB.W-30,BB.rows[r]+o);ctx.stroke();});
  ctx.fillStyle=PAL.gray;for(let c=1;c<=60;c++){const x=BB.x0+(c-1)*BB.dx;Object.entries(BB.rows).forEach(([r,y])=>{if(r.length===2&&c%6===0)return;ctx.fillRect(x-1.8,y-1.8,3.6,3.6);});}
  ctx.fillStyle=PAL.muted2;ctx.font='600 8px system-ui';ctx.textAlign='center';for(let c=1;c<=60;c+=(c===1?4:5)){ctx.fillText(String(c),BB.x0+(c-1)*BB.dx,140);}
  ctx.textAlign='right';'abcdefghij'.split('').forEach(r=>ctx.fillText(r,31,BB.rows[r]+3));
  ctx.fillStyle=PAL.bad;ctx.font='700 10px system-ui';ctx.fillText('+',30,BB.rows.tp+4);ctx.fillText('+',30,BB.rows.bp+4);ctx.fillStyle=PAL.water;ctx.fillText('−',30,BB.rows.tn+4);ctx.fillText('−',30,BB.rows.bn+4);}
const RCOL=['#111','#7c3f12',PAL.redDark,PAL.orange,PAL.yellowSoft,PAL.greenDark,PAL.blueDark,'#7c3aed',PAL.gray,'#f8fafc'];
function bands(v){const n=Math.round(v);if(!n)return null;const s=String(n);const d1=+s[0],d2=s.length>1?+s[1]:0,m=s.length-2;return [RCOL[d1],RCOL[d2],RCOL[Math.max(0,m)]||'#111','#d4af37'];}
function pin(ctx,x,y){ctx.fillStyle=PAL.slate;ctx.beginPath();ctx.arc(x,y,2.6,0,7);ctx.fill();}
function leg(ctx,a,b){ctx.strokeStyle=PAL.gray;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
function partOn(ctx,p,lit,T){const A=p.a?HP(p.a):null,B=p.b?HP(p.b):null;
  switch(p.t){
  case 'wire':{const d=Math.hypot(B[0]-A[0],B[1]-A[1]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-Math.min(34,8+d*0.18);
    ctx.strokeStyle=p.c||PAL.greenDark;ctx.lineWidth=3.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.quadraticCurveTo(mx,my,B[0],B[1]);ctx.stroke();ctx.lineCap='butt';
    if(!p.freeA)pin(ctx,A[0],A[1]);if(!p.freeB)pin(ctx,B[0],B[1]);if(p.lab){txt(ctx,p.lab,B[0],B[1]+16,PAL.ink,11);}break;}
  case 'res':{const d=Math.hypot(B[0]-A[0],B[1]-A[1]);const bs=bands(p.v);
    if(d<34){const cx=A[0],cy=A[1]-16;leg(ctx,A,[cx,cy]);ctx.strokeStyle=PAL.gray;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(cx,cy-9);ctx.quadraticCurveTo(cx+4,cy-20,B[0],B[1]);ctx.stroke();
      ctx.save();ctx.translate(cx,cy);ctx.fillStyle='#e7c99a';ctx.beginPath();ctx.roundRect(-4.5,-11,9,20,4);ctx.fill();if(bs)bs.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(-4.5,-8+i*4.5,9,2.4);});ctx.restore();}
    else{leg(ctx,A,B);const ang=Math.atan2(B[1]-A[1],B[0]-A[0]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;ctx.save();ctx.translate(mx,my);ctx.rotate(ang);ctx.fillStyle='#e7c99a';ctx.beginPath();ctx.roundRect(-13,-4.5,26,9,4);ctx.fill();
      if(bs)bs.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(-9+i*5.2,-4.5,2.6,9);});ctx.restore();}
    pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);if(p.lab)txt(ctx,p.lab,(A[0]+B[0])/2,Math.min(A[1],B[1])-(d<34?32:9),PAL.slateDark,8);break;}
  case 'led':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-10,rgb=p.rgb||'239,68,68';leg(ctx,A,[mx-2,my]);leg(ctx,B,[mx+2,my]);
    if(lit){const g=ctx.createRadialGradient(mx,my,2,mx,my,26);g.addColorStop(0,`rgba(${rgb},0.95)`);g.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(mx,my,26,0,7);ctx.fill();}
    ctx.fillStyle=`rgba(${rgb},${lit?1:0.75})`;ctx.beginPath();ctx.arc(mx,my,6.5,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1;ctx.stroke();
    pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);ctx.fillStyle='#b91c1c';ctx.font='700 9px system-ui';ctx.textAlign='center';ctx.fillText('+',A[0]+(A[0]<=B[0]?-6:6),A[1]-4);break;}
  case 'ecap':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-12;leg(ctx,A,[mx-2,my+4]);leg(ctx,B,[mx+2,my+4]);ctx.fillStyle='#1d4ed8';ctx.beginPath();ctx.roundRect(mx-7,my-9,14,15,3);ctx.fill();
    const sx=B[0]>=A[0]?mx+3:mx-7;ctx.fillStyle=PAL.ink2;ctx.fillRect(sx,my-9,4,15);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);if(p.lab)txt(ctx,p.lab,mx,my-12,'#1e3a8a',8);break;}
  case 'ccap':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-9;leg(ctx,A,[mx,my]);leg(ctx,B,[mx,my]);ctx.fillStyle=PAL.orangeDark;ctx.beginPath();ctx.ellipse(mx,my,6,5,0,0,7);ctx.fill();pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);if(p.lab)txt(ctx,p.lab,mx,my-8,'#9a3412',8);break;}
  case 'diode':{leg(ctx,A,B);const ang=Math.atan2(B[1]-A[1],B[0]-A[0]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;ctx.save();ctx.translate(mx,my);ctx.rotate(ang);ctx.fillStyle=PAL.chipDark;ctx.fillRect(-10,-4,20,8);ctx.fillStyle=PAL.grayLight;ctx.fillRect(5,-4,3,8);ctx.restore();pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);break;}
  case 'buz':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-4;pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.arc(mx,my,11,0,7);ctx.fill();ctx.strokeStyle=PAL.slate;ctx.beginPath();ctx.arc(mx,my,4,0,7);ctx.stroke();break;}
  case 'ldr':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-8;leg(ctx,A,[mx-2,my]);leg(ctx,B,[mx+2,my]);ctx.fillStyle=PAL.orangeSoft;ctx.beginPath();ctx.arc(mx,my,6.5,0,7);ctx.fill();ctx.strokeStyle='#7c2d12';ctx.lineWidth=1.2;ctx.beginPath();for(let i=0;i<5;i++){ctx.lineTo(mx-4+i*2,my+(i%2?-2:2));}ctx.stroke();pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);break;}
  case 'btn':{const x1=HP('e'+p.col)[0],x2=HP('e'+(p.col+2))[0];['e','f'].forEach(r=>{pin(ctx,x1,BB.rows[r]);pin(ctx,x2,BB.rows[r]);});ctx.fillStyle=PAL.chip;ctx.fillRect(x1-2,BB.rows.e-4,x2-x1+4,BB.rows.f-BB.rows.e+8);ctx.fillStyle='#4b5563';ctx.beginPath();ctx.arc((x1+x2)/2,213,7,0,7);ctx.fill();break;}
  case 'chip':{const n=p.n/2,xl=HP('e'+p.col)[0]-5,xr=HP('e'+(p.col+n-1))[0]+5;for(let i=0;i<n;i++){pin(ctx,HP('e'+(p.col+i))[0],BB.rows.e);pin(ctx,HP('e'+(p.col+i))[0],BB.rows.f);}
    ctx.fillStyle=PAL.chipDark;ctx.fillRect(xl,BB.rows.e+2,xr-xl,BB.rows.f-BB.rows.e-4);ctx.fillStyle=PAL.grayLight;ctx.beginPath();ctx.arc(xl,213,4,-Math.PI/2,Math.PI/2);ctx.fill();
    ctx.fillStyle='#d1d5db';ctx.font='700 8px system-ui';ctx.textAlign='center';ctx.fillText(p.lab,(xl+xr)/2,216);break;}
  case 'seg7':{const xl=HP('e'+p.col)[0]-6,xr=HP('e'+(p.col+4))[0]+6;for(let i=0;i<5;i++){pin(ctx,HP('e'+(p.col+i))[0],BB.rows.e);pin(ctx,HP('e'+(p.col+i))[0],BB.rows.f);}
    ctx.fillStyle='#0a0a0a';ctx.fillRect(xl,BB.rows.d+6,xr-xl,BB.rows.g-BB.rows.d-12);const segs=lit?(p.show==='DYN'?DIGITS[1+Math.floor((T&&T.t||performance.now()/1000)*0.6)%6]:p.show==='CNT'?DIGITS[(p.place?Math.floor(Math.floor(performance.now()/1000*1.5)%100/10):Math.floor(performance.now()/1000*1.5)%10)]:p.show==='CNT'?DIGITS[(p.place?Math.floor(Math.floor(performance.now()/1000*1.5)%100/10):Math.floor(performance.now()/1000*1.5)%10)]:p.show==='CNT'?DIGITS[(p.place?Math.floor(Math.floor(performance.now()/1000*1.5)%100/10):Math.floor(performance.now()/1000*1.5)%10)]:(p.show||'abcdefg')):'';
    const ox=xl+16,oy=BB.rows.d+9,s=0.28;ctx.save();ctx.translate(ox,oy);ctx.scale(s,s);const G={a:[10,0,40,8],g:[10,49,40,8],d:[10,98,40,8],f:[2,8,8,41],b:[50,8,8,41],e:[2,57,8,41],c:[50,57,8,41]};
    Object.entries(G).forEach(([k,[x,y,w,h]])=>{ctx.fillStyle=segs.includes(k)?PAL.bad:'#2a1416';ctx.fillRect(x,y,w,h);});ctx.restore();break;}
  case 'bar':{const xl=HP('e'+p.col)[0]-6,xr=HP('e'+(p.col+9))[0]+6;for(let i=0;i<10;i++){pin(ctx,HP('e'+(p.col+i))[0],BB.rows.e);pin(ctx,HP('e'+(p.col+i))[0],BB.rows.f);}
    ctx.fillStyle=PAL.chip;ctx.fillRect(xl,BB.rows.d+6,xr-xl,BB.rows.g-BB.rows.d-12);const n=lit?4+((performance.now()/1000)%6<3?0:2):0;
    for(let i=0;i<10;i++){const x=HP('e'+(p.col+i))[0],on=i<n,red=p.cols[i]==='r';ctx.fillStyle=on?(red?PAL.bad:PAL.green):(red?'#3b1d1d':'#14301f');if(on){ctx.shadowBlur=10;ctx.shadowColor=red?PAL.bad:PAL.green;}ctx.fillRect(x-4,BB.rows.d+10,8,BB.rows.g-BB.rows.d-20);ctx.shadowBlur=0;}
    txt(ctx,p.lab||'DC10RG',(xl+xr)/2,BB.rows.d+3,PAL.muted,8);break;}
  case 'sil':{const n=Math.round((B[0]-A[0])/BB.dx)+1;for(let i=0;i<n;i++)pin(ctx,A[0]+i*BB.dx,A[1]);ctx.fillStyle=PAL.chip;ctx.beginPath();ctx.roundRect(A[0]-6,A[1]-17,B[0]-A[0]+12,12,3);ctx.fill();
    ctx.strokeStyle=PAL.muted2;for(let i=0;i<n;i++){ctx.beginPath();ctx.moveTo(A[0]+i*BB.dx,A[1]-5);ctx.lineTo(A[0]+i*BB.dx,A[1]);ctx.stroke();}
    ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.arc(A[0],A[1]-11,2.2,0,7);ctx.fill();txt(ctx,p.lab||'',(A[0]+B[0])/2+4,A[1]-8,PAL.grayLight,8);break;}
  case 'xtal':{leg(ctx,A,B);const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;ctx.fillStyle=PAL.ink2;ctx.beginPath();ctx.roundRect(mx-12,my-5,24,10,5);ctx.fill();ctx.strokeStyle=PAL.muted2;ctx.lineWidth=1;ctx.stroke();txt(ctx,'32k',mx,my+3,PAL.slateDark,7);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);break;}
  case 'npn':{const pts=[HP(p.c),HP(p.b),HP(p.e)];pts.forEach(q=>pin(ctx,q[0],q[1]));const x=pts[1][0],y=pts[1][1]-12;ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.arc(x,y+4,11,Math.PI,0);ctx.lineTo(x+11,y+8);ctx.lineTo(x-11,y+8);ctx.closePath();ctx.fill();
    pts.forEach(q=>leg(ctx,q,[q[0]*0.6+x*0.4,y+8]));ctx.fillStyle=PAL.gray;ctx.font='600 7px system-ui';ctx.textAlign='center';ctx.fillText(p.lab||'C B E',x,y+3);break;}
  case 'pot':{const pts=p.h.map(HP);pts.forEach(q=>pin(ctx,q[0],q[1]));const x=pts[1][0],y=pts[1][1]-6;ctx.fillStyle=PAL.blueDark;ctx.fillRect(x-14,y-10,28,18);ctx.fillStyle='#f8fafc';ctx.beginPath();ctx.arc(x,y-1,6,0,7);ctx.fill();ctx.strokeStyle=PAL.blueDark;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-3,y-1);ctx.lineTo(x+3,y-1);ctx.stroke();break;}
  case 'batt':{const [x,y]=p.at,up=y<98,ty=up?y+38:y-5;ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.roundRect(x,y,70,38,5);ctx.fill();ctx.fillStyle=PAL.yellowSoft;ctx.fillRect(x,up?y+29:y,70,9);txt(ctx,p.lab||'9 V',x+35,up?y+20:y+28,PAL.white,13);
    ctx.fillStyle=PAL.gray;ctx.fillRect(x+16,ty,10,5);ctx.fillRect(x+44,ty,10,5);const wy=up?ty+5:ty;
    partOn(ctx,{t:'wire',a:[x+21,wy],b:p.plus,c:PAL.redDark,freeA:1},lit,T);partOn(ctx,{t:'wire',a:[x+49,wy],b:p.minus,c:'#111',freeA:1},lit,T);break;}
  case 'pm':{ctx.fillStyle=PAL.chip;ctx.fillRect(16,98,40,232);ctx.fillStyle=PAL.grayLight;ctx.fillRect(18,190,22,26);txt(ctx,'USB',29,207,'#111',7);txt(ctx,'5V',36,170,lit?'#4ade80':PAL.muted,10);ctx.fillStyle=lit?PAL.green:PAL.slateDark;ctx.beginPath();ctx.arc(36,150,4,0,7);ctx.fill();break;}
  case 'box':{const [x,y]=p.at;ctx.fillStyle=p.col||PAL.slateDark;ctx.beginPath();ctx.roundRect(x,y,p.w,p.h,6);ctx.fill();txt(ctx,p.lab,x+p.w/2,y+(p.ly||16),PAL.white,p.fs||11);
    if(p.lit&&lit){const [gx,gy]=p.lit.at;const g=ctx.createRadialGradient(gx,gy,1,gx,gy,22);g.addColorStop(0,p.lit.c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(gx,gy,22,0,7);ctx.fill();}
    (p.pins||[]).forEach(q=>{const from=[x+q.dx,y+q.dy];ctx.fillStyle=PAL.ink2;ctx.beginPath();ctx.arc(from[0],from[1],2.5,0,7);ctx.fill();if(q.n)txt(ctx,q.n,from[0],from[1]+(q.dy>=p.h?12:-5),PAL.ink,8);
      if(q.to&&(q.s===undefined||(T&&T.has(q.s))||T===null))partOn(ctx,{t:'wire',a:from,b:q.to,c:q.c||'#a3a3a3',freeA:1},lit,T);});break;}
  case 'note':{txt(ctx,p.txt,p.at[0],p.at[1],p.c||PAL.ink,p.fs||11,p.al||'center');break;}
  case 'cell':{const [x,y]=p.at;ctx.fillStyle='#0f766e';ctx.beginPath();ctx.roundRect(x,y,110,30,8);ctx.fill();ctx.fillStyle=PAL.muted;ctx.fillRect(x+110,y+9,6,12);txt(ctx,'18650  +',x+60,y+19,PAL.white,11);break;}
  }}
// wire colours used by the layouts and the builder
const W_R=PAL.redDark,W_B='#111',W_G=PAL.greenDark,W_Y=PAL.gold,W_O=PAL.orangeDark,W_U=PAL.blueDark,W_P=PAL.purple;
