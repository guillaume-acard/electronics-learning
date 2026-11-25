// ===== p1: breadboard layout =====
BBL.p1={power:6,parts:[{s:2,t:'res',a:'tp8',b:'a10',v:470},{s:3,t:'led',a:'c10',b:'c13'},{s:4,t:'wire',a:'a13',b:'tn13',c:W_B},{s:5,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]};

(function(){   // demo
// P1 LED brightness
function P1(){const ctx=cv('cp1'),vals=[220,470,1000,10000],k=Math.floor(CT/2.2)%4,R=vals[k],I=7/R*1000;
  part(ctx,'batt',80,60,80,200,{label:'9 V',left:true});wire(ctx,[[80,60],[220,60]]);part(ctx,'res',220,60,340,60,{label:fmtOhm(R),lc:Y});wire(ctx,[[340,60],[460,60],[460,95]]);
  part(ctx,'led',460,95,460,175,{glow:Math.min(1,Math.sqrt(I/20))});wire(ctx,[[460,175],[460,200],[80,200]]);dots(ctx,[[80,180],[80,60],[460,60],[460,200],[80,200]],CT*I*3);
  txt(ctx,'I = 7 V ÷ '+fmtOhm(R)+' = '+(I<10?I.toFixed(1):I.toFixed(0))+' mA',620,120,Y,15);txt(ctx,'(cycling through the 4 resistors)',620,145,PAL.muted,11);}
// chart: the current over time, a step each time the resistor changes
function G1(){const ctx=$('cp1').getContext('2d'),vals=[220,470,1000,10000];
  mScope(ctx,15,258,770,108,{title:'LED current over time (a new resistor every 2.2 s)',span:9,lo:0,hi:35,unit:'mA',refs:[[20,'20 mA: a normal LED current']],
    traces:[{f:t=>7/vals[Math.floor(t/2.2)%4]*1000,col:PAL.redSoft,lab:'LED current'}]});}
loop((dt,now)=>{if(vis('cp1')){P1(dt);G1();}});
})();
