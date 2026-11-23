// ===== p10: breadboard layout =====
BBL.p10={power:8,parts:[{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:1,t:'chip',col:30,n:8,lab:'LM386'},
  {s:2,t:'wire',a:'j33',b:'bn33',c:W_B},{s:2,t:'wire',a:'j31',b:'bn31',c:W_B},{s:2,t:'wire',a:'a32',b:'tp32',c:W_R},{s:3,t:'ecap',a:'tp27',b:'tn27',lab:'100µ'},
  {s:4,t:'pot',h:['a20','a21','a22']},{s:4,t:'wire',a:'b22',b:'tn22',c:W_B},{s:4,t:'wire',a:'c21',b:'h32',c:W_Y},
  {s:5,t:'ecap',a:'a33',b:'a40',lab:'220µ'},{s:5,t:'box',at:[520,8],w:90,h:56,lab:'🔊 8 Ω',col:PAL.chipLight,ly:32,fs:13,pins:[{n:'red',dx:25,dy:56,to:'b40',c:W_R},{n:'black',dx:65,dy:56,to:'tn42',c:W_B}]},
  {s:6,t:'res',a:'c33',b:'c45',v:10},{s:6,t:'ccap',a:'b45',b:'tn46',lab:'47n'},
  {s:7,t:'box',at:[150,8],w:100,h:50,lab:'audio jack',col:'#4b5563',ly:28,pins:[{n:'tip',dx:30,dy:50,to:'b20',c:W_Y},{n:'sleeve',dx:75,dy:50,to:'tn18',c:W_B}]},
  {s:8,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]};

(function(){   // demo
// P10 mini amp
function P10(){const ctx=cv('cp10'),w=Math.sin(CT*12)*0.5+Math.sin(CT*31)*0.3;
  txt(ctx,'🎸 / 📱',50,135,PAL.white,18);wire(ctx,[[80,130],[150,130]]);part(ctx,'pot',150,130,230,130,{label:'volume 10k'});wire(ctx,[[230,130],[300,130]]);
  boxChip(ctx,300,80,120,110,'LM386',[['3',296,134,'right'],['5',424,134,'left'],['6',360,76],['4',360,204]]);wire(ctx,[[360,30],[360,80]],PAL.redSoft);wire(ctx,[[360,190],[360,230]],PAL.blue);txt(ctx,'+9 V',372,40,PAL.redSoft,11,'left');
  wire(ctx,[[420,130],[470,130]]);part(ctx,'cap',470,130,550,130,{label:'220 µF'});wire(ctx,[[550,130],[600,130]]);
  ctx.fillStyle=PAL.ink2;ctx.fillRect(600,115,14,30);ctx.beginPath();ctx.moveTo(614,115);ctx.lineTo(640+w*4,95);ctx.lineTo(640+w*4,165);ctx.lineTo(614,145);ctx.fill();
  ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.globalAlpha=0.7-i*0.2;ctx.beginPath();ctx.arc(650,130,20+i*16+(CT*30)%16,-0.6,0.6);ctx.stroke();}ctx.globalAlpha=1;
  wire(ctx,[[607,145],[607,230],[60,230]],PAL.blue);txt(ctx,'8 Ω',580,170,PAL.muted,11);}
loop((dt,now)=>{if(vis('cp10'))P10(dt);});
})();
