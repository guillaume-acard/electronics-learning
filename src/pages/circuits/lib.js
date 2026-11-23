// ===== Circuits page: shared code (loaded before projects/*.js) =====

let CT=0;
const cv=id=>{const c=$(id),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);return ctx;};
function boxChip(ctx,x,y,w,h,name,pins){__PR(ctx,{t:'chip',x,y,w,h});ctx.fillStyle=PAL.chip;ctx.fillRect(x,y,w,h);ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.strokeRect(x,y,w,h);txt(ctx,name,x+w/2,y+h/2+5,PAL.ink,13);
  (pins||[]).forEach(([n,px,py,al])=>txt(ctx,n,px,py,PAL.muted,10,al||'center'));}
const vis=id=>{const r=$(id).getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;};

// ===== Circuit menu: show only the selected project =====
sectionMenu('circuits-menu',{first:'cintro'});

// ===== 7-segment drawing (same as the Real parts page) =====
const GEO7={a:['h',10,50,6],g:['h',10,50,55],d:['h',10,50,104],f:['v',6,10,51],b:['v',54,10,51],e:['v',6,59,100],c:['v',54,59,100]};
function seg7(ctx,k){const [t,p1,p2,p3]=GEO7[k];ctx.beginPath();
  if(t==='h'){ctx.moveTo(p1,p3);ctx.lineTo(p1+5,p3-5);ctx.lineTo(p2-5,p3-5);ctx.lineTo(p2,p3);ctx.lineTo(p2-5,p3+5);ctx.lineTo(p1+5,p3+5);}
  else{ctx.moveTo(p1,p2);ctx.lineTo(p1+5,p2+5);ctx.lineTo(p1+5,p3-5);ctx.lineTo(p1,p3);ctx.lineTo(p1-5,p3-5);ctx.lineTo(p1-5,p2+5);}ctx.closePath();}
function digitBig(ctx,x,y,s,segs,on,dp){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#111';ctx.fillRect(-10,-8,90,126);
  Object.keys(GEO7).concat(['dp']).forEach(k=>{const lit=on&&(k==='dp'?dp:segs.includes(k));ctx.shadowBlur=lit?14:0;ctx.shadowColor=PAL.bad;ctx.fillStyle=lit?PAL.bad:'#2a1416';
    if(k==='dp'){ctx.beginPath();ctx.arc(68,104,5,0,7);}else seg7(ctx,k);ctx.fill();ctx.shadowBlur=0;});ctx.restore();}

// ===== Wiring step checklists =====
document.querySelectorAll('.cl-content section').forEach(sec=>{const ol=sec.querySelector('.wsteps');if(!ol)return;const prog=sec.querySelector('.wprog'),rst=sec.querySelector('.wreset');
  const boxes=[...ol.querySelectorAll('input[type=checkbox]')];
  const upd=()=>{const n=boxes.filter(b=>b.checked).length;prog.textContent=n+' / '+boxes.length+(n===boxes.length?' ✓ done!':'');prog.className='wprog'+(n===boxes.length?' ok':'');
    boxes.forEach(b=>b.closest('li').classList.toggle('done',b.checked));const next=boxes.find(b=>!b.checked);boxes.forEach(b=>b.closest('li').classList.toggle('next',b===next));};
  boxes.forEach(b=>b.addEventListener('change',upd));rst.onclick=()=>{boxes.forEach(b=>b.checked=false);upd();};upd();});


// ================= Breadboard renderer =================
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
// layouts: s = step that adds the part (0 = always), until = step that removes it
const W_R=PAL.redDark,W_B='#111',W_G=PAL.greenDark,W_Y=PAL.gold,W_O=PAL.orangeDark,W_U=PAL.blueDark,W_P=PAL.purple;
const BBL={};   // filled by projects/<id>.js
function renderBB(id,ctx,T,t){const L=BBL[id];if(!L)return;ctx.clearRect(0,0,BB.W,BB.H);const done=T===null;
  if(!L.noBoard)drawBoard(ctx);
  const lit=done||(L.power&&T.has(L.power));
  let next=null;if(!done){for(let k=1;k<=40;k++){if(!T.has(k)){next=k;break;}}}
  L.parts.forEach(p=>{const shown=done?!(p.until):(p.s===0||T.has(p.s))&&!(p.until&&T.has(p.until));const ghost=!done&&!shown&&p.s===next&&!(p.until&&T.has(p.until));
    if(done&&p.until)return;if(!shown&&!ghost)return;
    ctx.save();if(ghost)ctx.globalAlpha=0.38;
    let pl=lit;if(p.t==='led'){if(p.litOff)pl=false;if(p.grp){const f=1+Math.floor(t*0.6)%6;pl=lit&&({A:[1,3,5],B:[2,3,4,5,6],C:[4,5,6],D:[6]})[p.grp].includes(f);}if(p.chase!==undefined)pl=lit&&Math.floor(t*4)%10===p.chase;if(p.blink)pl=lit&&(((t%0.7)<0.35)!==(p.blink===2));}
    partOn(ctx,p,pl,done?null:T);ctx.restore();
    if(ghost){const pts=[p.a,p.b].filter(h=>h&&typeof h==='string').map(HP);if(p.t==='btn'||p.t==='chip'||p.t==='seg7'||p.t==='bar')pts.push(HP('e'+p.col));if(p.t==='npn')pts.push(HP(p.b));if(p.t==='pot')pts.push(HP(p.h[1]));
      ctx.strokeStyle=PAL.amber;ctx.lineWidth=2;pts.forEach(q=>{ctx.beginPath();ctx.arc(q[0],q[1],6+2*Math.sin(t*6),0,7);ctx.stroke();});}});
  if(!done&&next&&L.parts.some(p=>p.s===next))txt(ctx,'step '+next+' = glowing outline',BB.W-12,L.noBoard?380:92,PAL.amber,11,'right');
  if(lit)txt(ctx,done?'✓ finished and powered':'⚡ powered',BB.W-12,L.noBoard?400:(done?92:80),PAL.good,12,'right');}

// ----- helpers shared by the project demos -----
const MZ={t:0,ac:null};
function mAC(){MZ.ac=MZ.ac||new (window.AudioContext||window.webkitAudioContext)();if(MZ.ac.state==='suspended')MZ.ac.resume();return MZ.ac;}
function mLed(ctx,x,y,on,rgb){glowAt(ctx,x,y,on?0.9:0,rgb,30);ctx.fillStyle=`rgba(${rgb},${on?1:0.25})`;ctx.beginPath();ctx.arc(x,y,9,0,7);ctx.fill();ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.stroke();}
function mRes(ctx,x1,y1,x2,y2,lab){W(ctx,[[x1,y1],[x2,y2]],WIRE,2.5);const mx=(x1+x2)/2,my=(y1+y2)/2,v=Math.abs(y2-y1)>Math.abs(x2-x1);ctx.fillStyle=PAL.canvas;ctx.strokeStyle=WIRE;ctx.lineWidth=2;ctx.beginPath();if(v)ctx.rect(mx-7,my-16,14,32);else ctx.rect(mx-16,my-7,32,14);ctx.fill();ctx.stroke();if(lab)txt(ctx,lab,v?mx+12:mx,v?my+4:my-12,PAL.muted,11,v?'left':'center');}
function mGraph(ctx,x,y,w,h,series,lo,hi,label){ctx.fillStyle=PAL.panel;ctx.fillRect(x,y,w,h);ctx.strokeStyle=PAL.line;ctx.strokeRect(x,y,w,h);
  series.forEach(([arr,col,dash])=>{ctx.strokeStyle=col;ctx.lineWidth=2;ctx.setLineDash(dash||[]);ctx.beginPath();arr.forEach((v,i)=>{const px=x+i/(arr.length-1||1)*w,py=y+h-(v-lo)/(hi-lo)*h;i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.stroke();ctx.setLineDash([]);});
  if(label)txt(ctx,label,x+6,y+14,PAL.muted,11,'left');}
// a DC motor seen from the end (projects 23, 24, 25)
function motorDraw(ctx,x,y,ang,col){ctx.fillStyle=PAL.chipLight;ctx.beginPath();ctx.arc(x,y,46,0,7);ctx.fill();ctx.strokeStyle=PAL.muted2;ctx.lineWidth=3;ctx.stroke();
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle=col||PAL.yellow;ctx.fillRect(-4,-40,8,40);ctx.beginPath();ctx.moveTo(4,-40);ctx.lineTo(26,-34);ctx.lineTo(4,-26);ctx.fill();ctx.restore();
  ctx.fillStyle=PAL.grayLight;ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill();txt(ctx,'M',x-30,y+36,PAL.ink2,13);}


// ===== Dice without Arduino (13-15): shared demo; each project file calls ddInit(id) =====
// ===== Dice without Arduino: interactive demos =====
const DD={};
const DD_GROUPS={};   // each dice project adds its own: DD_GROUPS.pNN={cols,map}
function ddInit(id){const b=$('ddb_'+id);if(!b)return;DD[id]={q:2,hold:false,acc:0,t:0,pulse:0};b.style.touchAction='none';b.style.userSelect='none';
  hold(b,on=>{DD[id].hold=on;});}
function drawDD(id,dt){const S=DD[id],G=DD_GROUPS[id],ctx=cv('dd_'+id);S.t+=dt;if(S.hold){S.acc+=dt;S.pulse+=dt;if(S.acc>0.05){S.acc=0;S.q=(S.q+1)%6;}}
  // 555 + 4017 column
  ctx.fillStyle=PAL.chip;ctx.fillRect(20,40,90,60);txt(ctx,'555',65,66,PAL.ink,14);txt(ctx,S.hold?'pulsing':'stopped',65,86,S.hold?PAL.good:PAL.muted,11);
  if(S.hold){ctx.strokeStyle=PAL.yellow;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=40;i++){const x=24+i*2,y=((i+Math.floor(S.t*40))%8<4)?112:124;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
  txt(ctx,'button: '+(S.hold?'HELD':'released'),65,150,S.hold?PAL.good:PAL.muted,11);
  ctx.fillStyle=PAL.chip;ctx.fillRect(140,30,80,240);txt(ctx,'CD4017',180,50,PAL.ink,12);
  const ry=i=>78+i*32;
  for(let i=0;i<6;i++){const on=i===S.q;ctx.fillStyle=on?PAL.yellow:PAL.slateDark;ctx.beginPath();ctx.arc(205,ry(i),6,0,7);ctx.fill();txt(ctx,'Q'+i,170,ry(i)+4,on?PAL.yellow:PAL.muted,11);
    W(ctx,[[211,ry(i)],[250,ry(i)]],on?PAL.yellow:PAL.slate,on?3:1.5);}
  txt(ctx,'Q6 → reset',180,262,PAL.redSoft,10);
  // matrix
  const n=G.cols.length,mx0=270,mw=id==='p14'?300:240,cw=mw/n;
  G.cols.forEach((name,j)=>{const x=mx0+cw*(j+0.5);const active=G.map[S.q].includes(j);W(ctx,[[x,64],[x,270]],active?PAL.good:PAL.slate,active?3:1.5);txt(ctx,name,x,56,active?PAL.good:PAL.muted,11);});
  for(let i=0;i<6;i++){W(ctx,[[250,ry(i)],[mx0+mw,ry(i)]],i===S.q?PAL.yellow:PAL.slateDark,i===S.q?2:1);G.map[i].forEach(j=>{const x=mx0+cw*(j+0.5),y=ry(i),on=i===S.q;ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/2);
    ctx.fillStyle=on?PAL.yellow:PAL.canvas;ctx.strokeStyle=on?PAL.yellow:PAL.muted;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-6,-6);ctx.lineTo(6,0);ctx.lineTo(-6,6);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(6,-6);ctx.lineTo(6,6);ctx.stroke();ctx.restore();});}
  txt(ctx,id==='p13'?'11 diodes (↔ needs none: one output)':id==='p14'?'27 diodes = a tiny ROM':'9 diodes = binary encoder',mx0+mw/2,290,PAL.muted,11);
  // result
  const rx=id==='p14'?600:540,face=S.q+1;
  if(id==='p13'){ctx.fillStyle='#f8fafc';ctx.beginPath();ctx.roundRect(rx+40,70,170,170,24);ctx.fill();
    const P={1:[[1,1]],2:[[0,0],[2,2]],3:[[0,0],[1,1],[2,2]],4:[[0,0],[2,0],[0,2],[2,2]],5:[[0,0],[2,0],[1,1],[0,2],[2,2]],6:[[0,0],[2,0],[0,1],[2,1],[0,2],[2,2]]}[face];
    for(let gx=0;gx<3;gx++)for(let gy=0;gy<3;gy++){const x=rx+75+gx*50,y=105+gy*50,on=P.some(([a,b])=>a===gx&&b===gy);if(on){glowAt(ctx,x,y,0.9,'239,68,68',26);}ctx.fillStyle=on?PAL.bad:PAL.ink;ctx.beginPath();ctx.arc(x,y,13,0,7);ctx.fill();ctx.strokeStyle=PAL.ink2;ctx.stroke();}
    txt(ctx,S.hold?'rolling…':'result: '+face,rx+125,270,S.hold?PAL.yellow:PAL.good,16);}
  else{if(id==='p15'){ctx.fillStyle=PAL.chip;ctx.fillRect(rx,110,70,80);txt(ctx,'CD4511',rx+35,146,PAL.ink,11);txt(ctx,'bits '+[(face>>2)&1,(face>>1)&1,face&1].join(''),rx+35,166,PAL.yellow,11);W(ctx,[[rx-28,150],[rx,150]],PAL.good,3);}
    digitBig(ctx,id==='p15'?rx+100:rx+20,50,1.6,DIGITS[face],true,false);
    txt(ctx,S.hold?'rolling…':'result: '+face,id==='p15'?rx+160:rx+80,270,S.hold?PAL.yellow:PAL.good,16);
    if(id==='p14')txt(ctx,'(segments via 2.2 kΩ)',rx+80,290,PAL.muted,10);}}

// the page clock (seconds) used by several demos; registered before the project loops, so it ticks first
loop(dt=>{CT+=dt;});
