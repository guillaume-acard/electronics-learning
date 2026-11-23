
// ================= Breadboard renderer =================
const BB={W:800,H:440,x0:38,dx:12.4,rows:{tp:112,tn:124,a:150,b:162,c:174,d:186,e:198,f:228,g:240,h:252,i:264,j:276,bp:302,bn:314}};
function HP(h){if(Array.isArray(h))return h;const m=/^(tp|tn|bp|bn|[a-j])(\d+)$/.exec(h);if(!m)throw 'bad hole '+h;return [BB.x0+(+m[2]-1)*BB.dx,BB.rows[m[1]]];}
function drawBoard(ctx){ctx.fillStyle='#e5e7eb';ctx.beginPath();ctx.roundRect(22,98,BB.W-44,232,8);ctx.fill();
  ctx.fillStyle='#d1d5db';ctx.fillRect(28,206,BB.W-56,14);
  [['tp','#ef4444',-7],['tn','#3b82f6',7],['bp','#ef4444',-7],['bn','#3b82f6',7]].forEach(([r,c,o])=>{ctx.strokeStyle=c;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(30,BB.rows[r]+o);ctx.lineTo(BB.W-30,BB.rows[r]+o);ctx.stroke();});
  ctx.fillStyle='#9ca3af';for(let c=1;c<=60;c++){const x=BB.x0+(c-1)*BB.dx;Object.entries(BB.rows).forEach(([r,y])=>{if(r.length===2&&c%6===0)return;ctx.fillRect(x-1.8,y-1.8,3.6,3.6);});}
  ctx.fillStyle='#64748b';ctx.font='600 8px system-ui';ctx.textAlign='center';for(let c=1;c<=60;c+=(c===1?4:5)){ctx.fillText(String(c),BB.x0+(c-1)*BB.dx,140);}
  ctx.textAlign='right';'abcdefghij'.split('').forEach(r=>ctx.fillText(r,31,BB.rows[r]+3));
  ctx.fillStyle='#ef4444';ctx.font='700 10px system-ui';ctx.fillText('+',30,BB.rows.tp+4);ctx.fillText('+',30,BB.rows.bp+4);ctx.fillStyle='#3b82f6';ctx.fillText('−',30,BB.rows.tn+4);ctx.fillText('−',30,BB.rows.bn+4);}
const RCOL=['#111','#7c3f12','#dc2626','#f97316','#facc15','#16a34a','#2563eb','#7c3aed','#9ca3af','#f8fafc'];
function bands(v){const n=Math.round(v);if(!n)return null;const s=String(n);const d1=+s[0],d2=s.length>1?+s[1]:0,m=s.length-2;return [RCOL[d1],RCOL[d2],RCOL[Math.max(0,m)]||'#111','#d4af37'];}
function pin(ctx,x,y){ctx.fillStyle='#475569';ctx.beginPath();ctx.arc(x,y,2.6,0,7);ctx.fill();}
function leg(ctx,a,b){ctx.strokeStyle='#9ca3af';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
function partOn(ctx,p,lit,T){const A=p.a?HP(p.a):null,B=p.b?HP(p.b):null;
  switch(p.t){
  case 'wire':{const d=Math.hypot(B[0]-A[0],B[1]-A[1]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-Math.min(34,8+d*0.18);
    ctx.strokeStyle=p.c||'#16a34a';ctx.lineWidth=3.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.quadraticCurveTo(mx,my,B[0],B[1]);ctx.stroke();ctx.lineCap='butt';
    if(!p.freeA)pin(ctx,A[0],A[1]);if(!p.freeB)pin(ctx,B[0],B[1]);if(p.lab){txt(ctx,p.lab,B[0],B[1]+16,'#e2e8f0',11);}break;}
  case 'res':{const d=Math.hypot(B[0]-A[0],B[1]-A[1]);const bs=bands(p.v);
    if(d<34){const cx=A[0],cy=A[1]-16;leg(ctx,A,[cx,cy]);ctx.strokeStyle='#9ca3af';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(cx,cy-9);ctx.quadraticCurveTo(cx+4,cy-20,B[0],B[1]);ctx.stroke();
      ctx.save();ctx.translate(cx,cy);ctx.fillStyle='#e7c99a';ctx.beginPath();ctx.roundRect(-4.5,-11,9,20,4);ctx.fill();if(bs)bs.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(-4.5,-8+i*4.5,9,2.4);});ctx.restore();}
    else{leg(ctx,A,B);const ang=Math.atan2(B[1]-A[1],B[0]-A[0]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;ctx.save();ctx.translate(mx,my);ctx.rotate(ang);ctx.fillStyle='#e7c99a';ctx.beginPath();ctx.roundRect(-13,-4.5,26,9,4);ctx.fill();
      if(bs)bs.forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(-9+i*5.2,-4.5,2.6,9);});ctx.restore();}
    pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);if(p.lab)txt(ctx,p.lab,(A[0]+B[0])/2,Math.min(A[1],B[1])-(d<34?32:9),'#334155',8);break;}
  case 'led':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-10,rgb=p.rgb||'239,68,68';leg(ctx,A,[mx-2,my]);leg(ctx,B,[mx+2,my]);
    if(lit){const g=ctx.createRadialGradient(mx,my,2,mx,my,26);g.addColorStop(0,`rgba(${rgb},0.95)`);g.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(mx,my,26,0,7);ctx.fill();}
    ctx.fillStyle=`rgba(${rgb},${lit?1:0.75})`;ctx.beginPath();ctx.arc(mx,my,6.5,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1;ctx.stroke();
    pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);ctx.fillStyle='#b91c1c';ctx.font='700 9px system-ui';ctx.textAlign='center';ctx.fillText('+',A[0]+(A[0]<=B[0]?-6:6),A[1]-4);break;}
  case 'ecap':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-12;leg(ctx,A,[mx-2,my+4]);leg(ctx,B,[mx+2,my+4]);ctx.fillStyle='#1d4ed8';ctx.beginPath();ctx.roundRect(mx-7,my-9,14,15,3);ctx.fill();
    const sx=B[0]>=A[0]?mx+3:mx-7;ctx.fillStyle='#cbd5e1';ctx.fillRect(sx,my-9,4,15);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);if(p.lab)txt(ctx,p.lab,mx,my-12,'#1e3a8a',8);break;}
  case 'ccap':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-9;leg(ctx,A,[mx,my]);leg(ctx,B,[mx,my]);ctx.fillStyle='#ea580c';ctx.beginPath();ctx.ellipse(mx,my,6,5,0,0,7);ctx.fill();pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);if(p.lab)txt(ctx,p.lab,mx,my-8,'#9a3412',8);break;}
  case 'diode':{leg(ctx,A,B);const ang=Math.atan2(B[1]-A[1],B[0]-A[0]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;ctx.save();ctx.translate(mx,my);ctx.rotate(ang);ctx.fillStyle='#111827';ctx.fillRect(-10,-4,20,8);ctx.fillStyle='#e5e7eb';ctx.fillRect(5,-4,3,8);ctx.restore();pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);break;}
  case 'buz':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-4;pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);ctx.fillStyle='#111827';ctx.beginPath();ctx.arc(mx,my,11,0,7);ctx.fill();ctx.strokeStyle='#475569';ctx.beginPath();ctx.arc(mx,my,4,0,7);ctx.stroke();break;}
  case 'ldr':{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-8;leg(ctx,A,[mx-2,my]);leg(ctx,B,[mx+2,my]);ctx.fillStyle='#fb923c';ctx.beginPath();ctx.arc(mx,my,6.5,0,7);ctx.fill();ctx.strokeStyle='#7c2d12';ctx.lineWidth=1.2;ctx.beginPath();for(let i=0;i<5;i++){ctx.lineTo(mx-4+i*2,my+(i%2?-2:2));}ctx.stroke();pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);break;}
  case 'btn':{const x1=HP('e'+p.col)[0],x2=HP('e'+(p.col+2))[0];['e','f'].forEach(r=>{pin(ctx,x1,BB.rows[r]);pin(ctx,x2,BB.rows[r]);});ctx.fillStyle='#1f2937';ctx.fillRect(x1-2,BB.rows.e-4,x2-x1+4,BB.rows.f-BB.rows.e+8);ctx.fillStyle='#4b5563';ctx.beginPath();ctx.arc((x1+x2)/2,213,7,0,7);ctx.fill();break;}
  case 'chip':{const n=p.n/2,xl=HP('e'+p.col)[0]-5,xr=HP('e'+(p.col+n-1))[0]+5;for(let i=0;i<n;i++){pin(ctx,HP('e'+(p.col+i))[0],BB.rows.e);pin(ctx,HP('e'+(p.col+i))[0],BB.rows.f);}
    ctx.fillStyle='#111827';ctx.fillRect(xl,BB.rows.e+2,xr-xl,BB.rows.f-BB.rows.e-4);ctx.fillStyle='#e5e7eb';ctx.beginPath();ctx.arc(xl,213,4,-Math.PI/2,Math.PI/2);ctx.fill();
    ctx.fillStyle='#d1d5db';ctx.font='700 8px system-ui';ctx.textAlign='center';ctx.fillText(p.lab,(xl+xr)/2,216);break;}
  case 'seg7':{const xl=HP('e'+p.col)[0]-6,xr=HP('e'+(p.col+4))[0]+6;for(let i=0;i<5;i++){pin(ctx,HP('e'+(p.col+i))[0],BB.rows.e);pin(ctx,HP('e'+(p.col+i))[0],BB.rows.f);}
    ctx.fillStyle='#0a0a0a';ctx.fillRect(xl,BB.rows.c,xr-xl,BB.rows.h-BB.rows.c);const segs=lit?(p.show||'abcdefg'):'';
    const ox=xl+12,oy=BB.rows.c+8,s=0.36;ctx.save();ctx.translate(ox,oy);ctx.scale(s,s);const G={a:[10,0,40,8],g:[10,49,40,8],d:[10,98,40,8],f:[2,8,8,41],b:[50,8,8,41],e:[2,57,8,41],c:[50,57,8,41]};
    Object.entries(G).forEach(([k,[x,y,w,h]])=>{ctx.fillStyle=segs.includes(k)?'#ef4444':'#2a1416';ctx.fillRect(x,y,w,h);});ctx.restore();break;}
  case 'npn':{const pts=[HP(p.c),HP(p.b),HP(p.e)];pts.forEach(q=>pin(ctx,q[0],q[1]));const x=pts[1][0],y=pts[1][1]-12;ctx.fillStyle='#111827';ctx.beginPath();ctx.arc(x,y+4,11,Math.PI,0);ctx.lineTo(x+11,y+8);ctx.lineTo(x-11,y+8);ctx.closePath();ctx.fill();
    pts.forEach(q=>leg(ctx,q,[q[0]*0.6+x*0.4,y+8]));ctx.fillStyle='#9ca3af';ctx.font='600 7px system-ui';ctx.textAlign='center';ctx.fillText('C B E',x,y+3);break;}
  case 'pot':{const pts=p.h.map(HP);pts.forEach(q=>pin(ctx,q[0],q[1]));const x=pts[1][0],y=pts[1][1]-6;ctx.fillStyle='#2563eb';ctx.fillRect(x-14,y-10,28,18);ctx.fillStyle='#f8fafc';ctx.beginPath();ctx.arc(x,y-1,6,0,7);ctx.fill();ctx.strokeStyle='#2563eb';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-3,y-1);ctx.lineTo(x+3,y-1);ctx.stroke();break;}
  case 'batt':{const [x,y]=p.at,up=y<98,ty=up?y+38:y-5;ctx.fillStyle='#111827';ctx.beginPath();ctx.roundRect(x,y,70,38,5);ctx.fill();ctx.fillStyle='#facc15';ctx.fillRect(x,up?y+29:y,70,9);txt(ctx,p.lab||'9 V',x+35,up?y+20:y+28,'#fff',13);
    ctx.fillStyle='#9ca3af';ctx.fillRect(x+16,ty,10,5);ctx.fillRect(x+44,ty,10,5);const wy=up?ty+5:ty;
    partOn(ctx,{t:'wire',a:[x+21,wy],b:p.plus,c:'#dc2626',freeA:1},lit,T);partOn(ctx,{t:'wire',a:[x+49,wy],b:p.minus,c:'#111',freeA:1},lit,T);break;}
  case 'pm':{ctx.fillStyle='#1f2937';ctx.fillRect(16,98,40,232);ctx.fillStyle='#e5e7eb';ctx.fillRect(18,190,22,26);txt(ctx,'USB',29,207,'#111',7);txt(ctx,'5V',36,170,lit?'#4ade80':'#94a3b8',10);ctx.fillStyle=lit?'#22c55e':'#334155';ctx.beginPath();ctx.arc(36,150,4,0,7);ctx.fill();break;}
  case 'box':{const [x,y]=p.at;ctx.fillStyle=p.col||'#334155';ctx.beginPath();ctx.roundRect(x,y,p.w,p.h,6);ctx.fill();txt(ctx,p.lab,x+p.w/2,y+(p.ly||16),'#fff',p.fs||11);
    if(p.lit&&lit){const [gx,gy]=p.lit.at;const g=ctx.createRadialGradient(gx,gy,1,gx,gy,22);g.addColorStop(0,p.lit.c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(gx,gy,22,0,7);ctx.fill();}
    (p.pins||[]).forEach(q=>{const from=[x+q.dx,y+q.dy];ctx.fillStyle='#cbd5e1';ctx.beginPath();ctx.arc(from[0],from[1],2.5,0,7);ctx.fill();if(q.n)txt(ctx,q.n,from[0],from[1]+(q.dy>=p.h?12:-5),'#e2e8f0',8);
      if(q.to&&(q.s===undefined||(T&&T.has(q.s))||T===null))partOn(ctx,{t:'wire',a:from,b:q.to,c:q.c||'#a3a3a3',freeA:1},lit,T);});break;}
  case 'note':{txt(ctx,p.txt,p.at[0],p.at[1],p.c||'#e2e8f0',p.fs||11,p.al||'center');break;}
  case 'cell':{const [x,y]=p.at;ctx.fillStyle='#0f766e';ctx.beginPath();ctx.roundRect(x,y,110,30,8);ctx.fill();ctx.fillStyle='#94a3b8';ctx.fillRect(x+110,y+9,6,12);txt(ctx,'18650  +',x+60,y+19,'#fff',11);break;}
  }}
// layouts: s = step that adds the part (0 = always), until = step that removes it
const W_R='#dc2626',W_B='#111',W_G='#16a34a',W_Y='#ca8a04',W_O='#ea580c',W_U='#2563eb',W_P='#9333ea';
const BBL={
p1:{power:6,parts:[{s:2,t:'res',a:'tp8',b:'a10',v:470},{s:3,t:'led',a:'c10',b:'c13'},{s:4,t:'wire',a:'a13',b:'tn13',c:W_B},{s:5,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]},
p2:{power:7,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:2,t:'btn',col:5},{s:3,t:'wire',a:'tp5',b:'a5',c:W_R},{s:4,t:'ecap',a:'j7',b:'bn8',lab:'1000µ'},{s:5,t:'res',a:'h7',b:'h15',v:470},{s:6,t:'led',a:'g15',b:'g18'},{s:6,t:'wire',a:'j18',b:'bn18',c:W_B},{s:7,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]},
p3:{power:5,parts:[{s:1,t:'res',a:'a10',b:'a14',v:1000},{s:2,t:'led',a:'c14',b:'c18'},{s:3,t:'led',a:'e18',b:'e14',rgb:'34,197,94',litOff:1},{s:4,t:'wire',a:'d10',b:[150,380],c:W_Y,freeB:1,lab:'A'},{s:4,t:'wire',a:'d18',b:[260,380],c:W_U,freeB:1,lab:'B'},{s:5,t:'batt',at:[330,360],plus:[150,380],minus:[260,380]}]},
p4:{power:7,parts:[{s:2,t:'btn',col:10},{s:2,t:'btn',col:25},{s:2,t:'btn',col:40},{s:3,t:'wire',a:'tp10',b:'a10',c:W_R},{s:3,t:'wire',a:'tp25',b:'a25',c:W_R},{s:3,t:'wire',a:'tp40',b:'a40',c:W_R},
  {s:4,t:'res',a:'j12',b:'j16',v:470},{s:4,t:'res',a:'j27',b:'j31',v:470},{s:4,t:'res',a:'j42',b:'j46',v:470},{s:5,t:'led',a:'h16',b:'h18'},{s:5,t:'led',a:'h31',b:'h33',rgb:'250,204,21'},{s:5,t:'led',a:'h46',b:'h48',rgb:'34,197,94'},
  {s:6,t:'wire',a:'j18',b:'bn18',c:W_B},{s:6,t:'wire',a:'j33',b:'bn33',c:W_B},{s:6,t:'wire',a:'j48',b:'bn48',c:W_B},{s:6,t:'wire',a:'tn3',b:'bn3',c:W_B},{s:7,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]},
p5:{power:8,parts:[{s:2,t:'npn',c:'c20',b:'c21',e:'c22'},{s:2,t:'npn',c:'c30',b:'c31',e:'c32'},{s:3,t:'wire',a:'e22',b:'e31',c:W_O},{s:4,t:'wire',a:'d20',b:'d30',c:W_Y},{s:5,t:'wire',a:'b32',b:'tn33',c:W_B},
  {s:6,t:'led',a:'a36',b:'a30'},{s:6,t:'res',a:'b36',b:'tp37',v:470},{s:7,t:'res',a:'tp12',b:'a12',v:1000},{s:7,t:'wire',a:'b12',b:[150,400],c:W_U,freeB:1,lab:'pad A'},{s:7,t:'wire',a:'b21',b:[230,400],c:W_P,freeB:1,lab:'pad B'},{s:8,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'},{s:8,t:'note',at:[190,392],txt:'☝️',fs:20}]},
p6:{power:0,parts:[{s:1,t:'box',at:[330,8],w:110,h:60,lab:'5 V relay',col:'#1d4ed8',pins:[{n:'coil 1',dx:30,dy:60,to:'j12',s:3,c:W_O},{n:'coil 2',dx:80,dy:60,to:'bn16',s:3,c:W_B}]},
  {s:2,t:'btn',col:10},{s:2,t:'wire',a:'tp10',b:'a10',c:W_R},{s:4,t:'led',a:'bn13',b:'h12'},{s:5,t:'wire',a:'tn3',b:'bn3',c:W_B},{s:5,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'},{s:7,t:'note',at:[560,400],txt:'variant: 1N4007 instead of the LED',c:'#94a3b8'}]},
p7:{power:9,parts:[{s:1,t:'pm'},{s:2,t:'npn',c:'h20',b:'h21',e:'h22'},{s:2,t:'wire',a:'j22',b:'bn23',c:W_B},{s:3,t:'btn',col:10},{s:3,t:'wire',a:'tp10',b:'a10',c:W_R},
  {s:4,t:'res',a:'j12',b:'j21',v:1000},{s:4,t:'res',a:'i21',b:'bn25',v:10000},
  {s:5,t:'box',at:[300,350],w:120,h:62,lab:'5 V relay',col:'#1d4ed8',ly:34,pins:[{n:'coil',dx:20,dy:0,to:'bp17',c:W_R},{n:'coil',dx:45,dy:0,to:'g20',c:W_O},{n:'COM',dx:75,dy:0,to:'tp44',s:7,c:W_R},{n:'NC',dx:95,dy:0,to:'a45',s:7,c:W_Y},{n:'NO',dx:115,dy:0,to:'a55',s:7,c:W_G}]},
  {s:6,t:'diode',a:'f20',b:'bp19'},
  {s:8,t:'res',a:'b45',b:'b48',v:220},{s:8,t:'led',a:'c48',b:'c49'},{s:8,t:'wire',a:'d49',b:'tn49',c:W_B},{s:8,t:'res',a:'b55',b:'b58',v:220},{s:8,t:'led',a:'c58',b:'c59',rgb:'34,197,94',litOff:1},{s:8,t:'wire',a:'d59',b:'tn59',c:W_B}]},
p8:{power:8,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:1,t:'chip',col:20,n:8,lab:'NE555'},
  {s:2,t:'wire',a:'d20',b:'tp20',c:W_R},{s:2,t:'wire',a:'j23',b:'bp23',c:W_R},{s:2,t:'wire',a:'j20',b:'bn20',c:W_B},{s:3,t:'res',a:'c20',b:'c21',v:1000},{s:4,t:'res',a:'b21',b:'b22',v:47000},
  {s:5,t:'wire',a:'a22',b:'j21',c:W_U},{s:6,t:'ecap',a:'i21',b:'bn21',lab:'10µ'},{s:7,t:'res',a:'h22',b:'h28',v:470},{s:7,t:'led',a:'g28',b:'g30',blink:1},{s:7,t:'wire',a:'j30',b:'bn30',c:W_B},
  {s:8,t:'ccap',a:'a23',b:'tn24',lab:'10n'},{s:8,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]},
p9:{power:9,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:2,t:'chip',col:8,n:8,lab:'555'},{s:2,t:'wire',a:'d8',b:'tp8',c:W_R},{s:2,t:'wire',a:'j11',b:'bp11',c:W_R},{s:2,t:'wire',a:'j8',b:'bn8',c:W_B},
  {s:3,t:'res',a:'c8',b:'c9',v:1000},{s:3,t:'res',a:'b9',b:'b10',v:47000},{s:3,t:'wire',a:'a10',b:'i9',c:W_U},{s:3,t:'ecap',a:'h9',b:'bn9',lab:'10µ'},
  {s:4,t:'chip',col:35,n:16,lab:'CD4017'},{s:4,t:'wire',a:'d35',b:'tp35',c:W_R},{s:4,t:'wire',a:'j42',b:'bn42',c:W_B},{s:5,t:'wire',a:'d38',b:'bn38',c:W_B},{s:5,t:'wire',a:'c36',b:'bn36',c:W_B},
  {s:6,t:'wire',a:'g10',b:'c37',c:W_Y},
  ...[['h37',46],['h36',47],['h38',48],['h41',49],['b41',50],['h35',51],['h39',52],['h40',53],['b42',54],['b40',55]].flatMap(([o,c],i)=>[{s:7,t:'wire',a:o,b:'a'+c,c:['#16a34a','#0ea5e9','#a855f7','#f97316','#eab308','#14b8a6','#ec4899','#84cc16','#6366f1','#f43f5e'][i]},{s:7,t:'led',a:'c'+c,b:'tn'+c,chase:i}]),
  {s:8,t:'res',a:'tn57',b:'bn57',v:470},{s:9,t:'batt',at:[40,30],plus:'tp1',minus:'bn2'}]},
p10:{power:8,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:1,t:'chip',col:30,n:8,lab:'LM386'},
  {s:2,t:'wire',a:'j33',b:'bn33',c:W_B},{s:2,t:'wire',a:'j31',b:'bn31',c:W_B},{s:2,t:'wire',a:'a32',b:'tp32',c:W_R},{s:3,t:'ecap',a:'tp27',b:'tn27',lab:'100µ'},
  {s:4,t:'pot',h:['a20','a21','a22']},{s:4,t:'wire',a:'b22',b:'tn22',c:W_B},{s:4,t:'wire',a:'c21',b:'h32',c:W_Y},
  {s:5,t:'ecap',a:'a33',b:'a40',lab:'220µ'},{s:5,t:'box',at:[520,8],w:90,h:56,lab:'🔊 8 Ω',col:'#374151',ly:32,fs:13,pins:[{n:'red',dx:25,dy:56,to:'b40',c:W_R},{n:'black',dx:65,dy:56,to:'tn42',c:W_B}]},
  {s:6,t:'res',a:'c33',b:'c45',v:10},{s:6,t:'ccap',a:'b45',b:'tn46',lab:'47n'},
  {s:7,t:'box',at:[150,8],w:100,h:50,lab:'audio jack',col:'#4b5563',ly:28,pins:[{n:'tip',dx:30,dy:50,to:'b20',c:W_Y},{n:'sleeve',dx:75,dy:50,to:'tn18',c:W_B}]},
  {s:8,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]},
p11:{power:6,parts:[{s:1,t:'pm',until:4},{s:2,t:'btn',col:8,until:4},{s:2,t:'wire',a:'tp8',b:'a8',c:W_R,until:4},
  {s:2,t:'box',at:[300,8],w:110,h:56,lab:'active buzzer',col:'#111827',ly:30,until:4,pins:[{n:'S',dx:20,dy:56,to:'j10',c:W_Y},{n:'+',dx:55,dy:56,to:'tp20',c:W_R},{n:'−',dx:90,dy:56,to:'tn22',c:W_B}]},
  {s:4,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:4,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:4,t:'chip',col:20,n:8,lab:'NE555'},{s:4,t:'wire',a:'d20',b:'tp20',c:W_R},{s:4,t:'wire',a:'j23',b:'bp23',c:W_R},{s:4,t:'wire',a:'j20',b:'bn20',c:W_B},
  {s:4,t:'res',a:'c20',b:'c21',v:1000},{s:4,t:'res',a:'b21',b:'b22',v:47000,lab:'trim'},{s:4,t:'wire',a:'a22',b:'j21',c:W_U},{s:4,t:'ccap',a:'i21',b:'bn21',lab:'47n'},
  {s:5,t:'ecap',a:'h22',b:'h28',lab:'10µ'},{s:5,t:'buz',a:'g28',b:'g31'},{s:5,t:'wire',a:'j31',b:'bn31',c:W_B},{s:6,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]},
p12:{power:9,parts:[{s:1,t:'wire',a:'tn3',b:'bn3',c:W_B},
  {s:1,t:'box',at:[30,4],w:230,h:72,lab:'Arduino Uno / ONE-C',col:'#0e7490',ly:20,pins:[{n:'GND',dx:12,dy:72,to:'bn1',c:W_B},
    {n:'D2',dx:34,dy:72,to:'a2',s:4,c:W_G},{n:'D3',dx:52,dy:72,to:'a6',s:4,c:W_G},{n:'D7',dx:70,dy:72,to:'a10',s:4,c:W_G},{n:'D8',dx:88,dy:72,to:'a14',s:4,c:W_G},
    {n:'D6',dx:106,dy:72,to:'j2',s:5,c:W_U},{n:'D5',dx:124,dy:72,to:'j6',s:5,c:W_U},{n:'D4',dx:142,dy:72,to:'j10',s:5,c:W_U},{n:'D9',dx:160,dy:72,to:'j14',s:5,c:W_U},
    {n:'D10',dx:182,dy:72,to:'a40',s:8,c:W_O},{n:'D11',dx:202,dy:72,to:'a42',s:8,c:W_O},{n:'D12',dx:222,dy:72,to:'a56',s:9,c:W_P}]},
  {s:2,t:'seg7',col:20,show:'abgcd'},{s:2,t:'seg7',col:30,show:'afgcd'},
  ...[['a20','a30'],['b21','b31'],['a23','a33'],['b24','b34'],['j20','j30'],['i21','i31'],['j23','j33'],['i24','i34']].map(([a,b])=>({s:3,t:'wire',a,b,c:W_Y})),
  ...[[2,5,'d23'],[6,9,'d24'],[10,13,'d21'],[14,17,'d20']].flatMap(([k,e,d])=>[{s:4,t:'res',a:'b'+k,b:'b'+e,v:330},{s:4,t:'wire',a:'c'+e,b:d,c:W_G}]),
  ...[[2,5,'h20'],[6,9,'h21'],[10,13,'h23'],[14,17,'h24']].flatMap(([k,e,d])=>[{s:5,t:'res',a:'i'+k,b:'i'+e,v:330},{s:5,t:'wire',a:'h'+e,b:d,c:W_U}]),
  {s:6,t:'npn',c:'c45',b:'c46',e:'c47'},{s:6,t:'npn',c:'c50',b:'c51',e:'c52'},{s:6,t:'wire',a:'a47',b:'tn47',c:W_B},{s:6,t:'wire',a:'a52',b:'tn52',c:W_B},
  {s:7,t:'wire',a:'i22',b:'e45',c:W_P},{s:7,t:'wire',a:'i32',b:'e50',c:W_P},
  {s:8,t:'res',a:'b40',b:'b46',v:1000},{s:8,t:'res',a:'d42',b:'d51',v:1000},{s:9,t:'btn',col:56},{s:9,t:'wire',a:'j58',b:'bn58',c:W_B}]},
rl1:{power:7,noBoard:1,parts:[
  {s:0,t:'box',at:[40,150],w:150,h:60,lab:'18650 holder',col:'#334155',ly:34,pins:[{n:'red +',dx:150,dy:18,to:[290,168],s:2,c:W_R},{n:'black −',dx:150,dy:44,to:[290,194],s:2,c:"#94a3b8"}]},
  {s:6,t:'cell',at:[57,165]},
  {s:0,t:'box',at:[290,140],w:120,h:80,lab:'BMS 1S',col:'#1f2937',ly:44,pins:[{n:'B+',dx:0,dy:28},{n:'B−',dx:0,dy:54},{n:'P+',dx:120,dy:28},{n:'P−',dx:120,dy:54}]},
  {s:0,t:'box',at:[510,60],w:150,h:80,lab:'TP4056 charger',col:'#1d4ed8',ly:30,lit:{at:[560,120],c:'rgba(239,68,68,0.9)'},pins:[{n:'B+',dx:0,dy:58,to:[410,168],s:3,c:W_R},{n:'B−',dx:0,dy:72,to:[410,194],s:3,c:"#94a3b8"}]},
  {s:0,t:'box',at:[510,250],w:150,h:70,lab:'load (switch + LED)',col:'#374151',ly:30,pins:[{n:'+',dx:0,dy:24,to:[410,168],s:4,c:W_R},{n:'−',dx:0,dy:50,to:[410,194],s:4,c:"#94a3b8"}]},
  {s:7,t:'box',at:[690,80],w:80,h:40,lab:'USB 5 V',col:'#4b5563',ly:24,pins:[{dx:0,dy:20,to:[660,100],c:'#94a3b8'}]},
  {s:0,t:'note',at:[400,420],txt:'Not a breadboard build: the modules are wired (soldered) together.',c:'#94a3b8'}]},
rl2:{power:11,parts:[
  {s:1,t:'box',at:[20,8],w:110,h:56,lab:'12 V in (PCM10F)',col:'#374151',ly:28,fs:10,pins:[{n:'+',dx:35,dy:56,to:'tp1',c:W_R},{n:'−',dx:80,dy:56,to:'tn2',c:W_B}]},{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},
  {s:2,t:'res',a:'tp10',b:'a10',v:10000},{s:2,t:'ldr',a:'c10',b:'tn11'},{s:3,t:'chip',col:20,n:8,lab:'LM358'},
  {s:4,t:'wire',a:'d20',b:'tp20',c:W_R},{s:4,t:'wire',a:'j23',b:'bn23',c:W_B},{s:4,t:'ccap',a:'b20',b:'tn21',lab:'100n'},
  {s:5,t:'wire',a:'e10',b:'g22',c:W_Y},{s:6,t:'pot',h:['a12','a13','a14']},{s:6,t:'wire',a:'b12',b:'tp12',c:W_R},{s:6,t:'wire',a:'b14',b:'tn15',c:W_B},{s:6,t:'wire',a:'c13',b:'h21',c:W_U},
  {s:7,t:'res',a:'i20',b:'i22',v:1000000},{s:8,t:'npn',c:'g30',b:'g31',e:'g32'},{s:8,t:'res',a:'h20',b:'h31',v:1000},{s:8,t:'wire',a:'j32',b:'bn33',c:W_B},
  {s:9,t:'box',at:[330,350],w:120,h:62,lab:'12 V relay',col:'#1d4ed8',ly:36,pins:[{n:'coil',dx:20,dy:0,to:'bp38',c:W_R},{n:'coil',dx:45,dy:0,to:'i30',c:W_O},{n:'COM',dx:80,dy:0,to:'tp44',s:10,c:W_R},{n:'NO',dx:108,dy:0,to:[560,60],s:10,c:W_G}]},
  {s:9,t:'diode',a:'j30',b:'bp36'},
  {s:10,t:'box',at:[540,8],w:120,h:56,lab:'💡 12 V lamp',col:'#374151',ly:30,lit:{at:[600,36],c:'rgba(250,204,21,0.9)'},pins:[{n:'1',dx:20,dy:56},{n:'2',dx:100,dy:56,to:'tn48',c:W_B}]}]},
};
function renderBB(id,ctx,T,t){const L=BBL[id];if(!L)return;ctx.clearRect(0,0,BB.W,BB.H);const done=T===null;
  if(!L.noBoard)drawBoard(ctx);
  const lit=done||(L.power&&T.has(L.power));
  let next=null;if(!done){for(let k=1;k<=40;k++){if(!T.has(k)){next=k;break;}}}
  L.parts.forEach(p=>{const shown=done?!(p.until):(p.s===0||T.has(p.s))&&!(p.until&&T.has(p.until));const ghost=!done&&!shown&&p.s===next&&!(p.until&&T.has(p.until));
    if(done&&p.until)return;if(!shown&&!ghost)return;
    ctx.save();if(ghost)ctx.globalAlpha=0.38;
    let pl=lit;if(p.t==='led'){if(p.litOff)pl=false;if(p.chase!==undefined)pl=lit&&Math.floor(t*4)%10===p.chase;if(p.blink)pl=lit&&(t%0.7)<0.38;}
    partOn(ctx,p,pl,done?null:T);ctx.restore();
    if(ghost){const pts=[p.a,p.b].filter(h=>h&&typeof h==='string').map(HP);if(p.t==='btn'||p.t==='chip'||p.t==='seg7')pts.push(HP('e'+p.col));if(p.t==='npn')pts.push(HP(p.b));if(p.t==='pot')pts.push(HP(p.h[1]));
      ctx.strokeStyle='#f59e0b';ctx.lineWidth=2;pts.forEach(q=>{ctx.beginPath();ctx.arc(q[0],q[1],6+2*Math.sin(t*6),0,7);ctx.stroke();});}});
  if(!done&&next&&L.parts.some(p=>p.s===next))txt(ctx,'step '+next+' = glowing outline',BB.W-12,92,'#f59e0b',11,'right');
  if(lit)txt(ctx,done?'✓ finished and powered':'⚡ powered',BB.W-12,done?92:80,'#10b981',12,'right');}
// wire up final + live canvases
const BBV=[];
document.querySelectorAll('.cl-content section').forEach(sec=>{const id=sec.id;if(!BBL[id])return;const F=document.getElementById('bbF_'+id),S=document.getElementById('bbS_'+id);
  const boxes=[...sec.querySelectorAll('.wsteps input[type=checkbox]')];BBV.push({id,F,S,boxes});});
function drawBBs(t){BBV.forEach(v=>{if(vis('bbF_'+v.id))renderBB(v.id,v.F.getContext('2d'),null,t);if(vis('bbS_'+v.id)){const T=new Set();v.boxes.forEach((b,i)=>{if(b.checked)T.add(i+1);});renderBB(v.id,v.S.getContext('2d'),T,t);}});}
