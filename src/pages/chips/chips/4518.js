// ===== 4518: data (pinout, inside, minimal circuit, hero art) + its demo =====
CHIP('4518',{
pinout:{pkg:'dip',title:'CD4518 (DIP-16)',pins:[
 [1,'CLK A','in','Clock of counter A: counts +1 on each rising edge (while EN A is high).','From a 555 output or a debounced button.'],
 [2,'EN A','ctl','Enable of counter A: high = counting on CLK. A falling edge here also counts +1 (if CLK A is low).','Tie to + when using CLK A.'],
 [3,'Q1A','out','Counter A, bit "1".','To the A input of a CD4511.'],
 [4,'Q2A','out','Counter A, bit "2".','To B of the CD4511.'],
 [5,'Q3A','out','Counter A, bit "4".','To C of the CD4511.'],
 [6,'Q4A','out','Counter A, bit "8". Falls when A rolls over from 9 to 0.','To D of the CD4511, and to EN B to chain the counters.'],
 [7,'RST A','ctl','Reset of counter A: high = back to 0.','To − through 10 kΩ, plus a button to + for a reset button.'],
 [8,'VSS','gnd','Ground.','To the − rail.'],
 [9,'CLK B','in','Clock of counter B.','To − (low) when counter B is driven by EN B (chained).'],
 [10,'EN B','ctl','Enable of counter B. A falling edge counts +1 when CLK B is low.','From Q4A to count the tens.'],
 [11,'Q1B','out','Counter B, bit "1".','To A of the second CD4511.'],
 [12,'Q2B','out','Counter B, bit "2".','To B.'],
 [13,'Q3B','out','Counter B, bit "4".','To C.'],
 [14,'Q4B','out','Counter B, bit "8".','To D. Could also chain a third counter (another 4518).'],
 [15,'RST B','ctl','Reset of counter B: high = back to 0.','Usually joined to RST A.'],
 [16,'VDD','pwr','Supply, 3–15 V.','To the + rail, with 100 nF to ground.']]},
inside:({ln,tx,bx,dot,tp,cmp,res,gnd,arrow})=>{let s='';
  [[0,'A',[1,2,7],[3,4,5,6]],[1,'B',[9,10,15],[11,12,13,14]]].forEach(([k,L,ins,outs])=>{const y0=30+k*150;
    ins.forEach((n,i)=>{const y=y0+20+i*40;s+=ln(`40,${y} 160,${y}`,n)+tp(40,y,n,'l');});
    s+=bx(160,y0,170,120,'Counter '+L+'\n4 flip-flops\ncounts 0 → 9 → 0\n(BCD)');
    outs.forEach((n,i)=>{const y=y0+15+i*30;s+=ln(`330,${y} 470,${y}`,n)+tp(470,y,n,'r');});});
  s+=`<polyline points="470,141 470,160 120,160 120,240" stroke="${PAL.yellow}" stroke-width="2" stroke-dasharray="6 4" fill="none"/>`+tx(300,176,'to chain: wire Q4A → EN B outside the chip')+('<circle cx="120" cy="240" r="4" fill="'+PAL.yellow+'"/>')+tx(300,176,'',{s:12,c:PAL.yellow});
  s+=tx(40,18,'16 VDD / 8 VSS power both counters',{a:'start',s:11,c:PAL.muted});
  return {vb:'-70 0 700 330',s};},
minimal:{title:'CD4518: counting 00–99',sub:'counter A = units, counter B = tens (project 19)',rows:[
 [1,[[[],'IN:clock from 555 pin 3']],'CLK A: counts on each rising edge.'],
 [2,[[[],'V9']],'EN A: high, so CLK A counts.'],
 [3,[[[],'T:units CD4511 A (pin 7)']],'Q1A (1).'],[4,[[[],'T:units CD4511 B (pin 1)']],'Q2A (2).'],[5,[[[],'T:units CD4511 C (pin 2)']],'Q3A (4).'],
 [6,[[[],'T:units CD4511 D (pin 6)'],[[],'P10']],'Q4A (8): to the decoder AND to EN B: its fall (9 → 0) counts one ten.'],
 [7,[[['R:10 kΩ'],'GND'],[['BTN'],'V9']],'RST A: pull-down + reset button to +.'],
 [8,[[[],'GND']],'VSS: ground.'],
 [9,[[[],'GND']],'CLK B: low, so counter B counts on the falling edge of EN B.'],
 [10,[[[],'P6']],'EN B: from Q4A (the carry).'],
 [11,[[[],'T:tens CD4511 A (pin 7)']],'Q1B.'],[12,[[[],'T:tens CD4511 B (pin 1)']],'Q2B.'],[13,[[[],'T:tens CD4511 C (pin 2)']],'Q3B.'],[14,[[[],'T:tens CD4511 D (pin 6)']],'Q4B.'],
 [15,[[[],'P7']],'RST B: joined to RST A, so the button resets both.'],
 [16,[[[],'V9'],[['C:100 nF'],'GND']],'VDD: supply, decoupled.']]},
art:dipArt('CD4518',16,'Dual BCD counter',PAL.yellow)});

(function(){
const D18={a:0,b:0,acc:0,run:true,flash:0};
function tick18(){const was=D18.a;D18.a=(D18.a+1)%10;if(was===9&&document.getElementById('d18chain').checked){D18.b=(D18.b+1)%10;D18.flash=0.6;}}
function draw4518(dt){const c=document.getElementById('c4518');if(!c||!c.offsetParent)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  if(D18.run){D18.acc+=dt*(+document.getElementById('d18sp').value);while(D18.acc>=1){D18.acc-=1;tick18();}}D18.flash=Math.max(0,D18.flash-dt);
  ctx.textAlign='left';ctx.fillStyle=PAL.muted;ctx.font='12px system-ui';ctx.fillText('Counter B (tens): Q1B–Q4B',40,24);ctx.fillText('Counter A (units): Q1A–Q4A',600,24);
  bitDots(ctx,60,60,D18.b,['Q1B','Q2B','Q3B','Q4B']);bitDots(ctx,620,60,D18.a,['Q1A','Q2A','Q3A','Q4A']);
  drawDigit(ctx,300,40,1.4,DIGITS[D18.b],{pad:12,glow:12});drawDigit(ctx,420,40,1.4,DIGITS[D18.a],{pad:12,glow:12});
  ctx.textAlign='center';ctx.fillStyle=PAL.ink;ctx.font='700 14px system-ui';ctx.fillText('tens',342,240);ctx.fillText('units',462,240);
  if(D18.flash>0){ctx.strokeStyle=`rgba(251,191,36,${D18.flash/0.6})`;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(612,192);ctx.quadraticCurveTo(400,300,190,192);ctx.stroke();ctx.fillStyle=PAL.yellow;ctx.font='13px system-ui';ctx.fillText('Q4A fell (9 → 0): EN B counts +1',400,262);}}
document.getElementById('d18run').addEventListener('click',e=>{D18.run=!D18.run;e.target.textContent=D18.run?'⏸ Pause':'▶ Run';e.target.classList.toggle('active',D18.run);});
document.getElementById('d18tick').addEventListener('click',()=>tick18());document.getElementById('d18rst').addEventListener('click',()=>{D18.a=0;D18.b=0;D18.acc=0;});
loop((dt,now)=>{draw4518(dt);});
})();
