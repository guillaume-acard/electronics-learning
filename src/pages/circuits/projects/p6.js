// ===== p6: breadboard layout =====
BBL.p6={power:0,parts:[{s:1,t:'box',at:[330,8],w:110,h:60,lab:'5 V relay',col:'#1d4ed8',pins:[{n:'coil 1',dx:30,dy:60,to:'j12',s:3,c:W_O},{n:'coil 2',dx:80,dy:60,to:'bn16',s:3,c:W_B}]},
  {s:2,t:'btn',col:10},{s:2,t:'wire',a:'tp10',b:'a10',c:W_R},{s:4,t:'led',a:'bn13',b:'h12'},{s:5,t:'wire',a:'tn3',b:'bn3',c:W_B},{s:5,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'},{s:7,t:'note',at:[560,400],txt:'variant: 1N4007 instead of the LED',c:PAL.muted}]};

(function(){   // demo
// P6 coil kick
function P6(){const ctx=cv('cp6'),ph=CT%4,on=ph<2,flash=ph>=2&&ph<2.25?1-(ph-2)/0.25:0;
  part(ctx,'batt',80,60,80,210,{label:'9 V',left:true});wire(ctx,[[80,60],[160,60]]);part(ctx,'switch',160,60,240,60,{closed:on,label:'button'});wire(ctx,[[240,60],[400,60],[400,90]]);
  part(ctx,'coil',400,90,400,180,{core:true,label:'coil'});wire(ctx,[[400,180],[400,210],[80,210]]);
  wire(ctx,[[400,75],[500,75],[500,95]]);part(ctx,'led',500,175,500,95,{glow:flash,label:'LED (backwards)'});wire(ctx,[[500,175],[500,195],[400,195]]);
  txt(ctx,on?'pressed: current builds up in the coil':flash>0?'released: FLASH! the kick lights the LED':'released',300,238,flash>0?Y:PAL.muted,13);}
loop((dt,now)=>{if(vis('cp6'))P6(dt);});
})();
