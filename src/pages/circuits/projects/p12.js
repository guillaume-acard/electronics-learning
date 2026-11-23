// ===== p12: breadboard layout =====
BBL.p12={power:9,parts:[{s:1,t:'wire',a:'tn3',b:'bn3',c:W_B},
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
  {s:8,t:'res',a:'b40',b:'b46',v:1000},{s:8,t:'res',a:'d42',b:'d51',v:1000},{s:9,t:'btn',col:56},{s:9,t:'wire',a:'j58',b:'bn58',c:W_B}]};

(function(){   // demo
// ===== 12. Digital dice demo =====
const DC={v:[6,6],rolling:false,acc:0,wait:0.02,mode:0,t:0};
choices('dcMode',['Two dice','One die','Total (2–12)'],0,i=>DC.mode=i);
$('dcRoll').onclick=()=>{if(!DC.rolling){DC.rolling=true;DC.wait=0.02;DC.acc=0;}};
function drawDice(dt){DC.t+=dt;if(DC.rolling){DC.acc+=dt;if(DC.acc>=DC.wait){DC.acc=0;DC.v=[1+Math.floor(Math.random()*6),1+Math.floor(Math.random()*6)];DC.wait+=0.015;if(DC.wait>=0.26)DC.rolling=false;}}
  const ctx=cv('cdice'),slow=$('dcSlow').checked,act=Math.floor(DC.t/0.45)%2;
  let d1,d2;const sum=DC.v[0]+DC.v[1];
  if(DC.mode===0){d1=DC.v[0];d2=DC.v[1];}else if(DC.mode===1){d1=null;d2=DC.v[1];}else{d1=sum>=10?1:null;d2=sum%10;}
  const show=i=>!slow||act===i;
  digitBig(ctx,130,30,1.7,d1===null?'':DIGITS[d1],show(0),DC.rolling);digitBig(ctx,300,30,1.7,DIGITS[d2],show(1),DC.rolling);
  txt(ctx,'display 1',190,262,PAL.muted,11);txt(ctx,'display 2',360,262,PAL.muted,11);
  npnQ(ctx,180,300,show(0));npnQ(ctx,350,300,show(1));txt(ctx,'D10',140,304,PAL.muted,10,'right');txt(ctx,'D11',310,304,PAL.muted,10,'right');
  if(slow)txt(ctx,'only display '+(act+1)+' is ON right now',275,22,Y,13);
  const rx=520;txt(ctx,DC.rolling?'rolling…':DC.mode===2?'total':'result',rx+130,70,PAL.muted,13);
  txt(ctx,DC.rolling?'🎲 🎲':DC.mode===0?DC.v[0]+' + '+DC.v[1]+' = '+sum:DC.mode===1?String(DC.v[1]):String(sum),rx+130,120,DC.rolling?Y:PAL.good,DC.rolling?30:34);
  if(!DC.rolling&&DC.mode===0&&DC.v[0]===DC.v[1])txt(ctx,'Doubles! 🎉',rx+130,160,Y,16);
  txt(ctx,slow?'4 ms per display, slowed down ×100':'each display ON 4 ms, then the other',rx+130,215,PAL.muted,12);
  txt(ctx,'→ ~125 swaps per second: looks steady',rx+130,235,PAL.muted,12);}

// ===== 12. Schematic =====
function drawP12(){const ctx=cv('cp12');const ay=[120,136,152,168,184,200,216,232],segs=['a','b','c','d','e','f','g','dp'],pins=[7,6,4,2,1,9,10,5];
  ctx.fillStyle='#0e7490';ctx.fillRect(30,30,120,320);txt(ctx,'Arduino',90,60,PAL.white,15);txt(ctx,'Uno / ONE-C',90,78,'#cffafe',10);
  ay.forEach((y,i)=>{txt(ctx,'D'+(i+2),146,y+4,'#cffafe',10,'right');W(ctx,[[150,y],[190,y]],PAL.ink2,2);ctx.fillStyle=BG;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=1.5;ctx.fillRect(190,y-5,34,10);ctx.strokeRect(190,y-5,34,10);
    W(ctx,[[224,y],[700,y]],PAL.redSoft,2);txt(ctx,segs[i],300,y-3,PAL.redLight,10);});
  txt(ctx,'8 × 330 Ω',207,108,PAL.ink,11);
  [[400,'display 1',270,'D10'],[580,'display 2',300,'D11']].forEach(([dx,l,ry,dn],k)=>{
    ctx.fillStyle='#1a1a1a';ctx.fillRect(dx,8,110,84);ctx.strokeStyle=PAL.slate;ctx.strokeRect(dx,8,110,84);
    digitBig(ctx,dx+8,14,0.6,DIGITS[k?5:3],true,false);txt(ctx,l,dx+80,40,PAL.muted,10);txt(ctx,'SC39-11',dx+80,54,PAL.muted,9);
    ay.forEach((y,i)=>{const x=dx+8+i*11;W(ctx,[[x,92],[x,y]],PAL.muted,1.2);dot(ctx,x,y);txt(ctx,String(pins[i]),x,103,PAL.muted2,8);});
    const cx=dx+100;W(ctx,[[cx,92],[cx,251]],PAL.blue,2);txt(ctx,'COM',cx+4,104,PAL.blue,9,'left');
    npnQ(ctx,cx-10,285,true);W(ctx,[[cx,319],[cx,365]],PAL.blue,2);
    // base drive
    txt(ctx,dn,146,ry+4,'#cffafe',10,'right');
    if(!k){W(ctx,[[150,ry],[250,ry]],PAL.ink2,2);ctx.fillStyle=BG;ctx.fillRect(250,ry-5,34,10);ctx.strokeRect(250,ry-5,34,10);W(ctx,[[284,ry],[cx-54,ry],[cx-54,285],[cx-44,285]],PAL.ink2,2);}
    else{W(ctx,[[150,ry],[330,ry]],PAL.ink2,2);ctx.fillStyle=BG;ctx.fillRect(330,ry-5,34,10);ctx.strokeRect(330,ry-5,34,10);W(ctx,[[364,ry],[380,ry],[380,345],[cx-54,345],[cx-54,285],[cx-44,285]],PAL.ink2,2);}
  });
  txt(ctx,'1 kΩ',267,262,PAL.ink,10);txt(ctx,'1 kΩ',347,292,PAL.ink,10);
  W(ctx,[[90,350],[90,365],[700,365]],PAL.blue,2);txt(ctx,'GND',710,369,PAL.blue,11,'left');
  txt(ctx,'D12',146,334,'#cffafe',10,'right');W(ctx,[[150,330],[175,330]],PAL.ink2,2);part(ctx,'switch',175,330,245,330,{});W(ctx,[[245,330],[245,365]],PAL.ink2,2);dot(ctx,245,365);txt(ctx,'button',210,355,PAL.muted,10);}
drawP12();
loop((dt,now)=>{if(vis('cdice'))drawDice(dt);});
})();
