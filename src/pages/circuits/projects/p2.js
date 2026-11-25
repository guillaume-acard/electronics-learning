// ===== p2: breadboard layout =====
BBL.p2={power:7,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:2,t:'btn',col:5},{s:3,t:'wire',a:'tp5',b:'a5',c:W_R},{s:4,t:'ecap',a:'j7',b:'bn8',lab:'1000µ'},{s:5,t:'res',a:'h7',b:'h15',v:470},{s:6,t:'led',a:'g15',b:'g18'},{s:6,t:'wire',a:'j18',b:'bn18',c:W_B},{s:7,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]};

(function(){   // demo
// P2 fade
const F2={vc:0};function P2(dt){const ctx=cv('cp2'),ph=CT%6,pressed=ph<1.5;F2.vc+=pressed?(1-F2.vc)*dt/0.05:-F2.vc*dt/1.5;
  part(ctx,'batt',80,60,80,210,{label:'9 V',left:true});wire(ctx,[[80,60],[150,60]]);part(ctx,'switch',150,60,230,60,{closed:pressed,label:'button'});wire(ctx,[[230,60],[480,60]]);
  part(ctx,'cap',320,60,320,210,{label:'1000 µF'});dot(ctx,320,60);dot(ctx,320,210);part(ctx,'res',480,60,480,120,{label:'470 Ω'});part(ctx,'led',480,130,480,200,{glow:F2.vc});wire(ctx,[[480,120],[480,130]]);wire(ctx,[[480,200],[480,210],[80,210]]);
  txt(ctx,pressed?'👆 button held: capacitor filling':'released: capacitor feeds the LED…',650,120,pressed?PAL.good:Y,13);
  ctx.fillStyle=PAL.raised;ctx.fillRect(250,100,12,70);ctx.fillStyle=PAL.blue;ctx.fillRect(250,100+70*(1-F2.vc),12,70*F2.vc);txt(ctx,'charge',256,186,PAL.blue,10);}
// charts: the capacitor empties slowly through the LED
const G2R={v:mRec(),i:mRec()};
function G2(){const ctx=$('cp2').getContext('2d'),vc=9*F2.vc;mRecPush(G2R.v,vc);mRecPush(G2R.i,Math.max(0,(vc-1.9)/470*1000));
  mScope(ctx,15,258,378,108,{title:'capacitor voltage',span:9,lo:0,hi:10,unit:'V',refs:[[1.9,'below ≈ 1.9 V the LED is off']],traces:[{rec:G2R.v,col:PAL.blue}]});
  mScope(ctx,407,258,378,108,{title:'LED current',span:9,lo:0,hi:16,unit:'mA',traces:[{rec:G2R.i,col:PAL.redSoft}]});}
loop((dt,now)=>{if(vis('cp2')){P2(dt);G2();}});
})();
