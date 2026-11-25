// ===== p8: breadboard layout =====
BBL.p8={power:8,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:1,t:'chip',col:20,n:8,lab:'NE555'},
  {s:2,t:'wire',a:'d20',b:'tp20',c:W_R},{s:2,t:'wire',a:'j23',b:'bp23',c:W_R},{s:2,t:'wire',a:'j20',b:'bn20',c:W_B},{s:3,t:'res',a:'c20',b:'c21',v:1000},{s:4,t:'res',a:'b21',b:'b22',v:47000},
  {s:5,t:'wire',a:'a22',b:'j21',c:W_U},{s:6,t:'ecap',a:'i21',b:'bn21',lab:'10µ'},{s:7,t:'res',a:'h22',b:'h28',v:470},{s:7,t:'led',a:'g28',b:'g30',blink:1},{s:7,t:'wire',a:'j30',b:'bn30',c:W_B},
  {s:8,t:'ccap',a:'a23',b:'tn24',lab:'10n'},{s:8,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]};

(function(){   // demo
// P8 555
const T8={th:0.693*48000*10e-6,tl:0.693*47000*10e-6};   // R1 1k, R2 47k, 10 µF: 0.33 s on, 0.33 s off
function P8(){const ctx=cv('cp8'),on=m555(CT,T8.th,T8.tl,9).out>1;
  wire(ctx,[[60,30],[620,30]],PAL.redSoft);wire(ctx,[[60,235],[620,235]],PAL.blue);txt(ctx,'+9 V',56,34,PAL.redSoft,11,'right');txt(ctx,'0 V',56,239,PAL.blue,11,'right');
  __PR(ctx,{t:'chip',x:300,y:85,w:120,h:130});ctx.fillStyle=PAL.chip;ctx.fillRect(300,85,120,130);ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.strokeRect(300,85,120,130);txt(ctx,'NE555',360,155,PAL.ink,14);
  [['8',320,99],['4',345,99],['7',306,124,'left'],['6',306,184,'left'],['2',306,204,'left'],['3',414,154,'right'],['1',360,211]].forEach(([n,x,y,a])=>txt(ctx,n,x,y,PAL.muted,10,a||'center'));
  wire(ctx,[[320,30],[320,85]]);wire(ctx,[[345,30],[345,85]]);
  part(ctx,'res',180,30,180,120,{label:'R1 1k',left:true});dot(ctx,180,120);wire(ctx,[[180,120],[300,120]]);
  part(ctx,'res',180,120,180,180,{label:'R2 47k',left:true});dot(ctx,180,180);wire(ctx,[[180,180],[300,180]]);wire(ctx,[[180,180],[180,200],[300,200]]);
  part(ctx,'cap',180,200,180,235,{label:'10 µF',left:true});wire(ctx,[[360,215],[360,235]]);
  wire(ctx,[[420,150],[460,150]]);part(ctx,'res',460,150,540,150,{label:'470 Ω'});wire(ctx,[[540,150],[570,150],[570,160]]);part(ctx,'led',570,160,570,225,{glow:on?1:0});wire(ctx,[[570,225],[570,235]]);
  txt(ctx,'≈ 1.5 blinks/s',700,130,Y,14);}
// chart: the capacitor goes up and down between ⅓ and ⅔ of 9 V; the output flips each time it reaches one of them
function G8(){const ctx=$('cp8').getContext('2d');
  mScope(ctx,15,258,770,115,{title:'555 voltages over time',span:3,lo:0,hi:9,unit:'V',refs:[[3,'⅓ of 9 V: output goes HIGH'],[6,'⅔ of 9 V: output goes LOW']],
    traces:[{f:t=>m555(t,T8.th,T8.tl,9).vc,col:PAL.blue,lab:'capacitor (pins 2 + 6)'},{f:t=>m555(t,T8.th,T8.tl,9).out,col:Y,lab:'output (pin 3) → LED'}]});}
loop((dt,now)=>{if(vis('cp8')){P8(dt);G8();}});
})();
