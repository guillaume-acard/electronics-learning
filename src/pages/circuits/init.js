// ===== Circuits page: wiring checklists, demos of the first projects, the main loop (loaded after projects/*.js) =====
// wire up final + live canvases
const BBV=[];
document.querySelectorAll('.cl-content section').forEach(sec=>{const id=sec.id;if(!BBL[id])return;const F=document.getElementById('bbF_'+id),S=document.getElementById('bbS_'+id);
  const boxes=[...sec.querySelectorAll('.wsteps input[type=checkbox]')];BBV.push({id,F,S,boxes});});
function drawBBs(t){BBV.forEach(v=>{if(vis('bbF_'+v.id))renderBB(v.id,v.F.getContext('2d'),null,t);if(vis('bbS_'+v.id)){const T=new Set();v.boxes.forEach((b,i)=>{if(b.checked)T.add(i+1);});renderBB(v.id,v.S.getContext('2d'),T,t);}});}


// ===== Dice without Arduino: interactive demos =====
const DD={};
const DD_GROUPS={p13:{cols:['centre','↘','↙','↔'],map:[[0],[1],[0,1],[1,2],[0,1,2],[1,2,3]]},
 p14:{cols:'abcdefg'.split(''),map:['bc','abdeg','abcdg','bcfg','acdfg','acdefg'].map(s=>s.split('').map(ch=>'abcdefg'.indexOf(ch)))},
 p15:{cols:['A (1)','B (2)','C (4)'],map:[[0],[1],[0,1],[2],[0,2],[1,2]]}};
['p13','p14','p15'].forEach(id=>{const b=$('ddb_'+id);if(!b)return;DD[id]={q:2,hold:false,acc:0,t:0,pulse:0};b.style.touchAction='none';b.style.userSelect='none';
  hold(b,on=>{DD[id].hold=on;});});
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

loop((dt,now)=>{CT+=dt;
  [['cp11',P11],['cp1',P1],['cp2',P2],['cp3',P3],['cp4',P4],['cp5',P5],['cp6',P6],['cp7',P7],['cp8',P8],['cp9',P9],['cp10',P10]].forEach(([id,f])=>{if(vis(id))f(dt);});
  if(vis('cdice'))drawDice(dt);['p13','p14','p15'].forEach(id=>{if(DD[id]&&vis('dd_'+id))drawDD(id,dt);});drawBBs(CT);drawBC(dt);drawLD(dt);});

