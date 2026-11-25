// ===== p3: breadboard layout =====
BBL.p3={power:5,parts:[{s:1,t:'res',a:'a10',b:'a14',v:1000},{s:2,t:'led',a:'c14',b:'c18'},{s:3,t:'led',a:'e18',b:'e14',rgb:'34,197,94',litOff:1},{s:4,t:'wire',a:'d10',b:[150,380],c:W_Y,freeB:1,lab:'A'},{s:4,t:'wire',a:'d18',b:[260,380],c:W_U,freeB:1,lab:'B'},{s:5,t:'batt',at:[330,360],plus:[150,380],minus:[260,380]}]};

(function(){   // demo
// P3 polarity tester
function P3(){const ctx=cv('cp3'),flip=Math.floor(CT/2.5)%2===1;
  part(ctx,'batt',80,flip?210:60,80,flip?60:210,{label:'9 V battery',left:true,flip});wire(ctx,[[80,60],[200,60]]);part(ctx,'res',200,60,300,60,{label:'1 kΩ'});wire(ctx,[[300,60],[480,60]]);
  wire(ctx,[[400,60],[400,95]]);part(ctx,'led',400,95,400,175,{glow:flip?0:1,label:'red',left:true});wire(ctx,[[400,175],[400,210]]);
  wire(ctx,[[480,60],[480,95]]);part(ctx,'led',480,175,480,95,{glow:flip?1:0,rgb:'34,197,94',label:'green'});wire(ctx,[[480,175],[480,210]]);
  wire(ctx,[[80,210],[480,210]]);dot(ctx,400,60);dot(ctx,400,210);txt(ctx,flip?'+ at the bottom: GREEN lights':'+ at the top: RED lights',660,130,flip?PAL.green:PAL.bad,14);}
// chart: one LED or the other, never both
function G3(){const ctx=$('cp3').getContext('2d'),flip=t=>Math.floor(t/2.5)%2===1;
  mScope(ctx,15,258,770,95,{title:'current in each LED (7 mA when it conducts)',span:10,lanes:true,
    traces:[{f:t=>flip(t)?0:7.1,col:PAL.redSoft,lab:'red LED',lo:0,hi:8},{f:t=>flip(t)?7.1:0,col:PAL.green,lab:'green LED',lo:0,hi:8}]});}
loop((dt,now)=>{if(vis('cp3')){P3(dt);G3();}});
})();
