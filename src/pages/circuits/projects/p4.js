// ===== p4: breadboard layout =====
BBL.p4={power:7,parts:[{s:2,t:'btn',col:10},{s:2,t:'btn',col:25},{s:2,t:'btn',col:40},{s:3,t:'wire',a:'tp10',b:'a10',c:W_R},{s:3,t:'wire',a:'tp25',b:'a25',c:W_R},{s:3,t:'wire',a:'tp40',b:'a40',c:W_R},
  {s:4,t:'res',a:'j12',b:'j16',v:470},{s:4,t:'res',a:'j27',b:'j31',v:470},{s:4,t:'res',a:'j42',b:'j46',v:470},{s:5,t:'led',a:'h16',b:'h18'},{s:5,t:'led',a:'h31',b:'h33',rgb:'250,204,21'},{s:5,t:'led',a:'h46',b:'h48',rgb:'34,197,94'},
  {s:6,t:'wire',a:'j18',b:'bn18',c:W_B},{s:6,t:'wire',a:'j33',b:'bn33',c:W_B},{s:6,t:'wire',a:'j48',b:'bn48',c:W_B},{s:6,t:'wire',a:'tn3',b:'bn3',c:W_B},{s:7,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]};

(function(){   // demo
// P4 traffic light
function P4(){const ctx=cv('cp4'),seq=[[1,0,0],[1,1,0],[0,0,1],[0,1,0]],s=seq[Math.floor(CT/1.8)%4],cols=['239,68,68','250,204,21','34,197,94'],nm=['red','yellow','green'];
  part(ctx,'batt',60,40,60,220,{label:'9 V',left:true});wire(ctx,[[60,40],[600,40]]);wire(ctx,[[60,220],[600,220]]);
  [0,1,2].forEach(i=>{const x=220+i*160;part(ctx,'switch',x,40,x,90,{closed:!!s[i]});part(ctx,'res',x,90,x,140,{label:'470 Ω'});part(ctx,'led',x,145,x,210,{glow:s[i],rgb:cols[i],label:nm[i]});wire(ctx,[[x,140],[x,145]]);wire(ctx,[[x,210],[x,220]]);dot(ctx,x,40);dot(ctx,x,220);});
  txt(ctx,'one resistor per LED',700,130,PAL.muted,12);}
// chart: a timing diagram, one lane per LED
function G4(){const ctx=$('cp4').getContext('2d'),seq=[[1,0,0],[1,1,0],[0,0,1],[0,1,0]],st=(t,i)=>seq[Math.floor(t/1.8)%4][i];
  mScope(ctx,15,258,770,110,{title:'timing diagram: which LED is on (each switch closed = 15 mA)',span:10,lanes:true,
    traces:[['red',PAL.redSoft],['yellow',PAL.yellow],['green',PAL.green]].map(([n,c],i)=>({f:t=>st(t,i),col:c,lab:n,lo:0,hi:1}))});}
loop((dt,now)=>{if(vis('cp4')){P4(dt);G4();}});
})();
