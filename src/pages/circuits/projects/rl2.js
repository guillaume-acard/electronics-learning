// ===== rl2: breadboard layout =====
BBL.rl2={power:11,parts:[
  {s:1,t:'box',at:[20,8],w:110,h:56,lab:'12 V in (PCM10F)',col:PAL.chipLight,ly:28,fs:10,pins:[{n:'+',dx:35,dy:56,to:'tp1',c:W_R},{n:'−',dx:80,dy:56,to:'tn2',c:W_B}]},{s:1,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:1,t:'wire',a:'tn4',b:'bn4',c:W_B},
  {s:2,t:'res',a:'tp10',b:'a10',v:10000},{s:2,t:'ldr',a:'c10',b:'tn11'},{s:3,t:'chip',col:20,n:8,lab:'LM358'},
  {s:4,t:'wire',a:'d20',b:'tp20',c:W_R},{s:4,t:'wire',a:'j23',b:'bn23',c:W_B},{s:4,t:'ccap',a:'b20',b:'tn21',lab:'100n'},
  {s:5,t:'wire',a:'e10',b:'g22',c:W_Y},{s:6,t:'pot',h:['a12','a13','a14']},{s:6,t:'wire',a:'b12',b:'tp12',c:W_R},{s:6,t:'wire',a:'b14',b:'tn15',c:W_B},{s:6,t:'wire',a:'c13',b:'h21',c:W_U},
  {s:7,t:'res',a:'i20',b:'i22',v:1000000},{s:8,t:'npn',c:'g30',b:'g31',e:'g32'},{s:8,t:'res',a:'h20',b:'h31',v:1000},{s:8,t:'wire',a:'j32',b:'bn33',c:W_B},
  {s:9,t:'box',at:[330,350],w:120,h:62,lab:'12 V relay',col:'#1d4ed8',ly:36,pins:[{n:'coil',dx:20,dy:0,to:'bp38',c:W_R},{n:'coil',dx:45,dy:0,to:'i30',c:W_O},{n:'COM',dx:80,dy:0,to:'tp44',s:10,c:W_R},{n:'NO',dx:108,dy:0,to:[560,60],s:10,c:W_G}]},
  {s:9,t:'diode',a:'j30',b:'bp36'},
  {s:10,t:'box',at:[540,8],w:120,h:56,lab:'💡 12 V lamp',col:PAL.chipLight,ly:30,lit:{at:[600,36],c:'rgba(250,204,21,0.9)'},pins:[{n:'1',dx:20,dy:56},{n:'2',dx:100,dy:56,to:'tn48',c:W_B}]}]};

(function(){   // demo
// ===== Real life B: light detector → relay → lamp =====
const LDT={on:false,auto:false,t:0,click:0};
$('ldAuto').onclick=()=>{LDT.auto=!LDT.auto;LDT.t=0;$('ldAuto').textContent=LDT.auto?'⏸ Stop':'🌅 Run a day';};
function drawLD(dt){if(LDT.auto){LDT.t+=dt;$('ldL').value=(0.5+0.5*Math.cos(LDT.t*0.35)).toFixed(3);}
  const L=+$('ldL').value,Th=+$('ldT').value,ldr=1000*Math.pow(200,1-L),Vn=12*ldr/(10000+ldr);
  const was=LDT.on;if(!LDT.on&&Vn>Th+0.3)LDT.on=true;else if(LDT.on&&Vn<Th-0.3)LDT.on=false;if(was!==LDT.on)LDT.click=0.5;LDT.click=Math.max(0,LDT.click-dt);
  const ctx=cv('cLight');
  ctx.fillStyle=`rgb(${Math.round(10+60*L)},${Math.round(15+110*L)},${Math.round(40+150*L)})`;ctx.fillRect(640,0,160,340);txt(ctx,L>0.45?'☀️':'🌙',720,70,PAL.white,36);
  wire(ctx,[[40,30],[620,30]],PAL.redSoft);txt(ctx,'+12 V',36,34,PAL.redSoft,11,'right');wire(ctx,[[40,300],[620,300]],PAL.blue);txt(ctx,'0 V',36,304,PAL.blue,11,'right');
  part(ctx,'res',90,30,90,140,{label:'10 kΩ',left:true});part(ctx,'ldr',90,140,90,300,{label:'LDR '+(ldr>=1000?(ldr/1000).toFixed(ldr<1e4?1:0)+'k':Math.round(ldr)),left:true});dot(ctx,90,140);
  part(ctx,'pot',170,30,170,300,{});txt(ctx,'threshold',178,100,Y,11,'left');dot(ctx,170,165);
  // opamp
  const ox=230,oy=150;ctx.strokeStyle=LDT.on?PAL.good:WIRE;ctx.lineWidth=2.5;ctx.fillStyle=BG;ctx.beginPath();ctx.moveTo(ox,oy-40);ctx.lineTo(ox+70,oy);ctx.lineTo(ox,oy+40);ctx.closePath();ctx.fill();ctx.stroke();
  txt(ctx,'+',ox+10,oy-14,PAL.redSoft,14,'left');txt(ctx,'−',ox+10,oy+22,PAL.blue,14,'left');txt(ctx,'LM358',ox+28,oy+4,PAL.muted,9);
  wire(ctx,[[90,140],[120,140],[120,132],[ox,132]]);wire(ctx,[[170,165],[200,165],[200,168],[ox,168]]);
  wire(ctx,[[ox+70,oy],[320,oy]]);part(ctx,'res',320,oy,380,oy,{label:'1 kΩ'});wire(ctx,[[380,oy],[396,oy]]);npnQ(ctx,430,oy,LDT.on);wire(ctx,[[440,oy+34],[440,300]]);
  part(ctx,'coil',440,30,440,oy-34,{label:'relay',left:true});wire(ctx,[[440,40],[490,40],[490,55]]);part(ctx,'diode',490,100,490,55,{col:PAL.good});wire(ctx,[[490,100],[490,110],[440,110]]);
  // contact + lamp
  ctx.setLineDash([4,4]);ctx.strokeStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(458,80);ctx.lineTo(540,180);ctx.stroke();ctx.setLineDash([]);
  wire(ctx,[[540,30],[540,180]],PAL.violet);ctx.fillStyle=PAL.ink2;ctx.save();ctx.translate(540,180);ctx.rotate(LDT.on?0.5:0.05);ctx.fillRect(0,-2,40,4);ctx.restore();
  wire(ctx,[[575,200],[600,200],[600,215]],PAL.violet);part(ctx,'lamp',600,215,600,275,{glow:LDT.on?1:0});wire(ctx,[[600,275],[600,300]],PAL.violet);txt(ctx,'12 V lamp',606,292,PAL.muted,10,'left');
  if(LDT.click>0)txt(ctx,'CLICK',520,150,Y,14);
  // comparison gauge
  const gx=250,gy=250,gw=180;ctx.fillStyle=PAL.raised;ctx.fillRect(gx,gy,gw,12);const X=v=>gx+v/12*gw;
  ctx.fillStyle='rgba(251,191,36,.3)';ctx.fillRect(X(Th-0.3),gy-4,X(Th+0.3)-X(Th-0.3),20);ctx.fillStyle=Y;ctx.fillRect(X(Th)-1,gy-6,2,24);
  ctx.fillStyle=PAL.blue;ctx.beginPath();ctx.arc(X(Vn),gy+6,7,0,7);ctx.fill();
  txt(ctx,'sensor '+Vn.toFixed(1)+' V vs threshold '+Th.toFixed(1)+' V',gx+gw/2,gy-12,PAL.ink,11);txt(ctx,'(yellow band = hysteresis)',gx+gw/2,gy+30,PAL.muted,10);
  txt(ctx,LDT.on?'DARK: lamp ON':'BRIGHT: lamp off',720,140,PAL.white,14);}
loop((dt,now)=>{drawLD(dt);});
})();
