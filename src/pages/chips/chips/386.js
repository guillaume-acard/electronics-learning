// ===== 386: data (pinout, inside, minimal circuit, hero art) + its demo =====
CHIP('386',{
pinout:{pkg:'dip',title:'LM386N (DIP-8)',pins:[
 [1,'GAIN','ctl','Gain setting, side 1. Nothing between 1 and 8 = gain 20. A 10 µF capacitor = gain 200.','In the Ruby: the 1 kΩ gain pot + 10 µF between pins 1 and 8.'],
 [2,'IN−','in','Inverting input.','Usually straight to ground.'],
 [3,'IN+','in','Non-inverting input: the audio signal.','From the volume pot (in the Ruby: after the JFET buffer).'],
 [4,'GND','gnd','Ground.','To the − rail.'],
 [5,'OUT','out','Power output, sitting at half the supply and swinging with the music.','Through a 220 µF capacitor to the speaker. Plus a Zobel (10 Ω + 47 nF) to ground.'],
 [6,'VS','pwr','Supply, 4–12 V.','To the + rail, with 100 nF + 100 µF to ground.'],
 [7,'BYPASS','ctl','Bypass: smooths the internal bias so supply hum and noise don\'t leak into the sound.','Optional: 10 µF to ground. Can be left unconnected.'],
 [8,'GAIN','ctl','Gain setting, side 2.','See pin 1.']]},
inside:({ln,tx,bx,dot,tp,cmp,res,gnd,arrow})=>{let s='';
  s+=ln('40,110 110,110',3)+ln('40,170 110,170',2)+bx(110,90,100,100,'Input stage\n(transistor pair)\ncompares + / −');
  s+=arrow(210,140,255)+bx(255,115,95,50,'Gain stage');
  s+=arrow(350,140,390)+bx(390,80,85,120,'Push-pull\noutput\n↑ push\n↓ pull',PAL.good)+ln('475,140 540,140',5);
  s+=ln('430,40 430,80',6)+ln('160,40 160,90',7);
  s+=ln('40,222 430,222',4)+ln('430,200 430,222',4);
  s+=dot(505,140)+ln('505,140 505,262')+res(262,440,500,'15 kΩ',1)+ln('440,262 410,262')+dot(410,262)+res(262,320,390,'1.35 kΩ',1)+ln('390,262 410,262')+ln('320,262 300,262')+dot(300,262)+res(262,220,280,'150 Ω',1)+ln('220,262 160,262 160,190');
  s+=ln('410,262 410,290',1)+ln('300,262 300,290',8);
  s+=tx(600,296,'nothing on 1↔8: gain 20',{s:12,c:PAL.yellow,a:'end'})+tx(600,312,'10 µF on 1↔8: gain 200',{s:12,c:PAL.yellow,a:'end'});
  return {vb:'-50 0 660 320',s:s+tp(40,110,3,'l')+tp(40,170,2,'l')+tp(540,140,5,'t')+tp(430,40,6,'t')+tp(160,40,7,'t')+tp(40,222,4,'b')+tp(410,290,1,'b')+tp(300,290,8,'b')};},
minimal:{title:'LM386: mini speaker amp (like the Ruby)',sub:'gain 200 with the 10 µF between pins 1 and 8',rows:[
 [1,[[['C:10 µF+'],'P8']],'Gain: 10 µF to pin 8 for gain 200 (leave both open for gain 20).'],
 [2,[[[],'GND']],'Input −: to ground.'],
 [3,[[['POT:10 kΩ'],'IN:audio (volume pot wiper)']],'Input +: the audio, through a volume pot (ends to signal and ground).'],
 [4,[[[],'GND']],'Ground.'],
 [5,[[['C:220 µF+','SPK'],'GND'],[['R:10 Ω','C:47 nF'],'GND']],'Output: 220 µF to the speaker (blocks the 4.5 V DC), plus the Zobel (10 Ω + 47 nF) that keeps it stable.'],
 [6,[[[],'V9'],[['C:100 µF+'],'GND']],'Supply + (4–12 V) with a big capacitor.'],
 [7,[[['C:10 µF+'],'GND']],'Bypass (optional): less hum and noise.'],
 [8,[[[],'P1']],'Gain: the other end of the gain capacitor.']]},
art:dipArt('LM386',8,'Audio amplifier',PAL.pink)});

(function(){
// ===== 6. LM386 =====
const LA={t:0,h:[],cone:0};
function draw386(dt){LA.t+=dt;const a=+$('laIn').value*0.1,k=+$('laG').value,G=20+180*k;
  const vin=a*(Math.sin(2*Math.PI*0.9*LA.t)+0.3*Math.sin(2*Math.PI*2.7*LA.t));const vo=Math.max(0.4,Math.min(8.6,4.5+G*vin*0.5));
  LA.h.push({t:LA.t,vo,hi:8.6,lo:0.4,mid:4.5});prune(LA.h,LA.t,4);
  const c=$('c386'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  dip(ctx,90,40,['GAIN','−IN','+IN','GND','OUT','VS','BYPASS','GAIN'],'LM386',[1,8,3,5]);
  arrowText(ctx,'gain knob between 1 and 8',125,165,PAL.yellow,11);
  plot(ctx,270,30,320,170,LA.h,LA.t,4,[{k:'vo',col:PAL.good,label:'output (pin 5)'},{k:'mid',col:PAL.muted,dash:[4,4],lw:1,label:'4.5 V'},{k:'hi',col:PAL.bad,dash:[5,4],lw:1,label:'limits'},{k:'lo',col:PAL.bad,dash:[5,4],lw:1}],0,9,'');
  // speaker
  const sx=680,sy=110,d=(vo-4.5)*3;ctx.fillStyle=PAL.ink2;ctx.fillRect(sx-40,sy-18,22,36);
  ctx.fillStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(sx-18,sy-18);ctx.lineTo(sx+20+d,sy-50);ctx.lineTo(sx+20+d,sy+50);ctx.lineTo(sx-18,sy+18);ctx.fill();
  ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;const amp=Math.min(1,Math.abs(vo-4.5)/4);for(let i=0;i<3;i++){ctx.globalAlpha=amp*(1-i*0.3);ctx.beginPath();ctx.arc(sx+30,sy,25+i*16,-0.7,0.7);ctx.stroke();}ctx.globalAlpha=1;
  arrowText(ctx,'push ↔ pull',sx,sy+75,PAL.muted,12);
  const clip=G*a*1.3*0.5>4.1;arrowText(ctx,'gain ≈ '+Math.round(G)+'×',420,232,PAL.yellow,15);
  arrowText(ctx,clip?'Output hits the 0 V / 9 V limits: clipping = overdrive':'Clean: the output swings around 4.5 V',420,256,clip?PAL.yellow:PAL.good,13);}
loop((dt,now)=>{draw386(dt);});
})();
