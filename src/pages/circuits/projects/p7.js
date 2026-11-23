// ===== p7: breadboard layout =====
BBL.p7={power:9,parts:[{s:1,t:'pm'},{s:2,t:'npn',c:'h20',b:'h21',e:'h22'},{s:2,t:'wire',a:'j22',b:'bn23',c:W_B},{s:3,t:'btn',col:10},{s:3,t:'wire',a:'tp10',b:'a10',c:W_R},
  {s:4,t:'res',a:'j12',b:'j21',v:1000},{s:4,t:'res',a:'i21',b:'bn25',v:10000},
  {s:5,t:'box',at:[300,350],w:120,h:62,lab:'5 V relay',col:'#1d4ed8',ly:34,pins:[{n:'coil',dx:20,dy:0,to:'bp17',c:W_R},{n:'coil',dx:45,dy:0,to:'g20',c:W_O},{n:'COM',dx:75,dy:0,to:'tp44',s:7,c:W_R},{n:'NC',dx:95,dy:0,to:'a45',s:7,c:W_Y},{n:'NO',dx:115,dy:0,to:'a55',s:7,c:W_G}]},
  {s:6,t:'diode',a:'f20',b:'bp19'},
  {s:8,t:'res',a:'b45',b:'b48',v:220},{s:8,t:'led',a:'c48',b:'c49'},{s:8,t:'wire',a:'d49',b:'tn49',c:W_B},{s:8,t:'res',a:'b55',b:'b58',v:220},{s:8,t:'led',a:'c58',b:'c59',rgb:'34,197,94',litOff:1},{s:8,t:'wire',a:'d59',b:'tn59',c:W_B}]};

(function(){   // demo
// P7 relay clicker
function P7(){const ctx=cv('cp7'),on=(CT%3)<1.5;
  wire(ctx,[[60,30],[360,30]],PAL.redSoft);txt(ctx,'+5 V',56,34,PAL.redSoft,11,'right');part(ctx,'switch',100,30,100,90,{closed:on,label:'button'});part(ctx,'res',100,90,100,150,{label:'1 kΩ'});wire(ctx,[[100,150],[100,170],[226,170]]);
  txt(ctx,'0 V',56,234,PAL.blue,11,'right');
  npnQ(ctx,260,170,on);part(ctx,'coil',270,30,270,136,{label:'coil',left:true});wire(ctx,[[270,204],[270,230],[60,230]],PAL.blue);
  wire(ctx,[[270,40],[330,40],[330,60]]);part(ctx,'diode',330,120,330,60,{col:PAL.good});wire(ctx,[[330,120],[330,128],[270,128]]);
  // contacts
  ctx.setLineDash([4,4]);ctx.strokeStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(290,85);ctx.lineTo(450,110);ctx.stroke();ctx.setLineDash([]);
  wire(ctx,[[450,110],[450,200]],PAL.violet);txt(ctx,'COM',440,210,PAL.muted,10);ctx.fillStyle=PAL.ink2;ctx.save();ctx.translate(450,110);ctx.rotate(on?0.3:-0.3);ctx.fillRect(0,-2,60,4);ctx.restore();
  wire(ctx,[[512,90],[600,90]],PAL.violet);wire(ctx,[[512,130],[600,130]],PAL.violet);txt(ctx,'NC',520,82,PAL.redLight,10);txt(ctx,'NO',520,146,PAL.greenLight,10);
  part(ctx,'led',600,90,700,90,{glow:on?0:1});part(ctx,'led',600,130,700,130,{glow:on?1:0,rgb:'34,197,94'});wire(ctx,[[700,90],[740,90],[740,200],[450,200]],PAL.violet);wire(ctx,[[700,130],[740,130]],PAL.violet);
  txt(ctx,on?'click → green':'rest → red',620,230,on?PAL.green:PAL.bad,13);}
loop((dt,now)=>{if(vis('cp7'))P7(dt);});
})();
