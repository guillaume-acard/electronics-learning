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


// layouts: s = step that adds the part (0 = always), until = step that removes it
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
