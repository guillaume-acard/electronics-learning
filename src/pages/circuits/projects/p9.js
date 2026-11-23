// ===== p9: breadboard layout =====
BBL.p9={power:9,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:2,t:'chip',col:8,n:8,lab:'555'},{s:2,t:'wire',a:'d8',b:'tp8',c:W_R},{s:2,t:'wire',a:'j11',b:'bp11',c:W_R},{s:2,t:'wire',a:'j8',b:'bn8',c:W_B},
  {s:3,t:'res',a:'c8',b:'c9',v:1000},{s:3,t:'res',a:'b9',b:'b10',v:47000},{s:3,t:'wire',a:'a10',b:'i9',c:W_U},{s:3,t:'ecap',a:'h9',b:'bn9',lab:'10µ'},
  {s:4,t:'chip',col:35,n:16,lab:'CD4017'},{s:4,t:'wire',a:'d35',b:'tp35',c:W_R},{s:4,t:'wire',a:'j42',b:'bn42',c:W_B},{s:5,t:'wire',a:'d38',b:'bn38',c:W_B},{s:5,t:'wire',a:'c36',b:'bn36',c:W_B},
  {s:6,t:'wire',a:'g10',b:'c37',c:W_Y},
  ...[['h37',46],['h36',47],['h38',48],['h41',49],['b41',50],['h35',51],['h39',52],['h40',53],['b42',54],['b40',55]].flatMap(([o,c],i)=>[{s:7,t:'wire',a:o,b:'a'+c,c:[PAL.greenDark,'#0ea5e9','#a855f7',PAL.orange,'#eab308','#14b8a6','#ec4899','#84cc16','#6366f1','#f43f5e'][i]},{s:7,t:'led',a:'c'+c,b:'tn'+c,chase:i}]),
  {s:8,t:'res',a:'tn57',b:'bn57',v:470},{s:9,t:'batt',at:[40,30],plus:'tp1',minus:'bn2'}]};

(function(){   // demo
// P9 chaser
function P9(){const ctx=cv('cp9'),q=Math.floor(CT*4)%10;boxChip(ctx,40,90,90,80,'555');boxChip(ctx,220,70,120,120,'CD4017');
  wire(ctx,[[130,130],[220,130]],Y);txt(ctx,'clock (pin 3 → 14)',175,120,Y,10);
  for(let i=0;i<10;i++){const x=400+i*38,y=130;W(ctx,[[340,80+i*11],[360,80+i*11],[x,y-14]],PAL.slate,1.5);glowAt(ctx,x,y,i===q?1:0);ctx.fillStyle=i===q?PAL.bad:'#3f1d1d';ctx.beginPath();ctx.arc(x,y,12,0,7);ctx.fill();txt(ctx,'Q'+i,x,y+30,PAL.muted,10);}
  txt(ctx,'each clock pulse → the next LED',585,200,PAL.muted,12);}
loop((dt,now)=>{if(vis('cp9'))P9(dt);});
})();
