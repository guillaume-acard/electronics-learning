// ===== 358: data (pinout, inside, minimal circuit, hero art) + its demo =====
CHIP('358',{
pinout:{pkg:'dip',title:'LM358 (DIP-8)',pins:[
 [1,'OUT A','out','Output of op-amp A.','To the next stage, a transistor base resistor or an LED resistor (max ~20 mA).'],
 [2,'IN− A','in','Inverting input of op-amp A. Raising it pushes the output DOWN.','Comparator: the threshold (from a pot). Amplifier: the feedback resistors.'],
 [3,'IN+ A','in','Non-inverting input of op-amp A. Raising it pushes the output UP.','Comparator: the sensor (e.g. LDR divider). Amplifier: the signal.'],
 [4,'GND','gnd','Ground (or the negative supply).','To the − rail.'],
 [5,'IN+ B','in','Non-inverting input of op-amp B.','If B is unused: tie to half the supply or ground.'],
 [6,'IN− B','in','Inverting input of op-amp B.','If B is unused: join to pin 7 (a "follower") so it stays quiet.'],
 [7,'OUT B','out','Output of op-amp B.','If unused: joined to pin 6.'],
 [8,'VCC','pwr','Supply, 3–32 V. Both op-amps share it.','To the + rail, with 100 nF to ground beside it.']]},
inside:({ln,tx,bx,dot,tp,cmp,res,gnd,arrow})=>{let s='';
  s+=ln('40,110 110,110',2)+ln('40,150 110,150',3)+cmp(110,130,'op-amp A')+ln('180,130 235,130',1);
  s+=ln('560,110 490,110',6)+ln('560,150 490,150',5)+cmp(490,130,'op-amp B',1)+ln('420,130 365,130',7);
  s+=ln('300,40 300,60',8)+ln('145,60 455,60',8)+ln('145,60 145,113',8)+ln('455,60 455,113',8);
  s+=ln('300,240 300,215',4)+ln('145,215 455,215',4)+ln('145,147 145,215',4)+ln('455,147 455,215',4);
  s+=tx(300,105,'gain ≈ 100 000',{s:12,c:PAL.yellow})+tx(300,122,'(each op-amp)',{s:11,c:PAL.muted});
  return {vb:'-70 0 730 280',s:s+tp(40,110,2,'l')+tp(40,150,3,'l')+tp(235,130,1,'b')+tp(560,110,6,'r')+tp(560,150,5,'r')+tp(365,130,7,'b')+tp(300,40,8,'t')+tp(300,240,4,'b')};},
minimal:{title:'LM358: "is it dark?" comparator',sub:'LED on when the LDR sees darkness (op-amp B unused)',rows:[
 [1,[[['R:1 kΩ','LED:r'],'GND']],'Output A: high when + is above −, lights the LED.'],
 [2,[[['POT:10 kΩ'],'T:pot ends to + and −']],'Input − A: the threshold, from the trimmer\'s wiper.'],
 [3,[[['R:10 kΩ'],'V9'],[['LDR'],'GND']],'Input + A: the sensor divider (10 kΩ on top, LDR below: darker → higher voltage).'],
 [4,[[[],'GND']],'Ground.'],
 [5,[[[],'GND']],'Input + B (unused): to ground so it doesn\'t float.'],
 [6,[[[],'P7']],'Input − B (unused): joined to output B (a "follower") so op-amp B stays quiet.'],
 [7,[[[],'P6']],'Output B (unused): joined to pin 6, nothing else.'],
 [8,[[[],'V9'],[['C:100 nF'],'GND']],'Supply + (3–32 V) with 100 nF decoupling.']]},
art:dipArt('LM358',8,'Dual op-amp',PAL.blue)});

(function(){
// ===== 5. LM358 =====
const OA={mode:0,t:0,h:[]};
choices('oaChoices',['Comparator (yes / no)','Amplifier (with feedback)'],0,i=>{OA.mode=i;$('oaCmp').style.display=i?'none':'';$('oaAmp').style.display=i?'':'none';});
function opTri(ctx,x,y,col=PAL.ink2){ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.fillStyle=PAL.canvas;ctx.beginPath();ctx.moveTo(x,y-45);ctx.lineTo(x+80,y);ctx.lineTo(x,y+45);ctx.closePath();ctx.fill();ctx.stroke();
  arrowText(ctx,'+',x+10,y-17,PAL.redSoft,16,'left');arrowText(ctx,'−',x+10,y+27,PAL.blue,16,'left');}
function draw358(dt){OA.t+=dt;const c=$('c358'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  dip(ctx,90,40,['OUT A','IN− A','IN+ A','GND','IN+ B','IN− B','OUT B','VCC'],'LM358',[1,2,3,4,8]);
  if(!OA.mode){const vp=+$('oaP').value,vn=+$('oaN').value,hi=vp>vn,vo=hi?3.5:0;
    const x=400,y=120;opTri(ctx,x,y,hi?PAL.good:PAL.ink2);W(ctx,[[290,y-22],[x,y-22]],PAL.ink2);W(ctx,[[290,y+22],[x,y+22]],PAL.ink2);W(ctx,[[x+80,y],[550,y]],PAL.ink2);
    arrowText(ctx,'sensor '+vp.toFixed(2)+' V',292,y-30,PAL.redSoft,12,'left');arrowText(ctx,'threshold '+vn.toFixed(2)+' V',292,y+40,PAL.blue,12,'left');
    const g=ctx.createRadialGradient(575,y,2,575,y,40);if(hi){g.addColorStop(0,'rgba(250,204,21,1)');g.addColorStop(1,'rgba(250,204,21,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(575,y,40,0,7);ctx.fill();}
    ctx.fillStyle=hi?PAL.yellowSoft:'#3f3f46';ctx.beginPath();ctx.arc(575,y,13,0,7);ctx.fill();
    arrowText(ctx,'out: '+vo.toFixed(1)+' V ('+(hi?'HIGH':'LOW')+')',600,y+5,hi?PAL.good:PAL.muted,14,'left');
    // see-saw
    const sx=470,sy=225,a=Math.max(-0.3,Math.min(0.3,(vn-vp)*3));ctx.save();ctx.translate(sx,sy);ctx.rotate(a);ctx.fillStyle=PAL.muted2;ctx.fillRect(-90,-4,180,8);ctx.fillStyle=PAL.redSoft;ctx.fillRect(-90,-18,20,14);ctx.fillStyle=PAL.blue;ctx.fillRect(70,-18,20,14);ctx.restore();
    ctx.fillStyle=PAL.muted;ctx.beginPath();ctx.moveTo(sx,sy+4);ctx.lineTo(sx-10,sy+22);ctx.lineTo(sx+10,sy+22);ctx.fill();
    arrowText(ctx,hi?'+ is higher → output slams HIGH':'+ is lower → output slams LOW',580,225,PAL.ink,12,'left');arrowText(ctx,'(even 0.001 V difference is enough)',580,245,PAL.muted,11,'left');}
  else{const r=+$('oaG').value,G=1+r;const vin=0.3+0.1*Math.sin(2*Math.PI*0.8*OA.t);const vo=Math.max(0,Math.min(3.5,G*vin));
    OA.h.push({t:OA.t,vin,vo,top:3.5});prune(OA.h,OA.t,4);
    const x=330,y=110;opTri(ctx,x,y);W(ctx,[[290,y-22],[x,y-22]],PAL.ink2);arrowText(ctx,'in',292,y-30,PAL.amber,12,'left');
    W(ctx,[[x+80,y],[x+120,y],[x+120,y+70],[x+90,y+70]],PAL.ink2);resBox2(ctx,x+40,y+62,50,16,'Rf');W(ctx,[[x+40,y+70],[x-20,y+70],[x-20,y+22],[x,y+22]],PAL.ink2);
    W(ctx,[[x-20,y+70],[x-20,y+90]],PAL.ink2);resBox2(ctx,x-28,y+90,16,40,'Rg');W(ctx,[[x-20,y+130],[x-20,y+145]],PAL.ink2);gndSym(ctx,x-20,y+145);
    arrowText(ctx,'gain = 1 + Rf/Rg = '+G.toFixed(1),x-10,y-60,PAL.yellow,14,'left');
    plot(ctx,500,30,280,170,OA.h,OA.t,4,[{k:'vin',col:PAL.amber,label:'input'},{k:'vo',col:PAL.good,label:'output'},{k:'top',col:PAL.bad,dash:[5,4],lw:1,label:'max (VCC − 1.5 V)'}],0,4.2,'');
    arrowText(ctx,G*0.4>3.5?'Too much gain: output clipped at the top':'Exact copy, '+G.toFixed(1)+'× bigger',625,250,G*0.4>3.5?PAL.yellow:PAL.good,13);}}
function resBox2(ctx,x,y,w,h,t){ctx.fillStyle=PAL.canvas;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=2.5;ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);arrowText(ctx,t,w>h?x+w/2:x+w+14,w>h?y-6:y+h/2+4,PAL.ink,11);}
loop((dt,now)=>{draw358(dt);});
})();
