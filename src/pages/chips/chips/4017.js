// ===== 4017: data (pinout, inside, minimal circuit, hero art) + its demo =====
CHIP('4017',{
pinout:{pkg:'dip',title:'CD4017 (DIP-16)',pins:[
 [1,'Q5','out','Output 5: high during count 5.',''],
 [2,'Q1','out','Output 1: high during count 1.',''],
 [3,'Q0','out','Output 0: high during count 0 (right after reset).','LED via a 470 Ω–1 kΩ resistor, a diode, or a transistor base resistor (each output gives only a few mA).'],
 [4,'Q2','out','Output 2.',''],
 [5,'Q6','out','Output 6.','In the dice: wired to RESET so it counts 0–5.'],
 [6,'Q7','out','Output 7.',''],
 [7,'Q3','out','Output 3.',''],
 [8,'VSS','gnd','Ground.','To the − rail.'],
 [9,'Q8','out','Output 8.',''],
 [10,'Q4','out','Output 4.',''],
 [11,'Q9','out','Output 9.',''],
 [12,'CO','out','Carry out: high for counts 0–4, low for 5–9. One pulse every 10 counts.','To the CLK of a second 4017 to count to 100.'],
 [13,'INH','ctl','Clock inhibit (enable): low = counting, high = frozen.','To ground (never leave it floating!).'],
 [14,'CLK','in','Clock: each rising edge moves to the next output.','From the 555 output (pin 3) or a debounced button.'],
 [15,'RST','ctl','Reset: high = back to Q0 at once.','To ground through 10 kΩ, or to an output Qn to count 0…n−1.'],
 [16,'VDD','pwr','Supply, 3–15 V.','To the + rail, with 100 nF to ground.']]},
inside:({ln,tx,bx,dot,tp,cmp,res,gnd,arrow})=>{let s='';const outs=[3,2,4,7,10,1,5,6,9,11];
  s+=ln('40,90 110,90',14)+ln('40,150 110,150',13)+bx(110,70,90,100,'Clock gate\n\npasses CLK\nwhile INH low');
  s+=arrow(200,120,240)+bx(240,70,110,190,'Johnson\ncounter\n\n5 flip-flops\n(counts 0–9)');
  s+=ln('40,230 240,230',15)+tx(140,222,'reset → back to 0',{s:11,c:PAL.muted});
  s+=ln('350,165 390,165')+`<path d="M390 165l-8 -5v10z" fill="${PAL.muted}"/>`+bx(390,30,80,270,'Decoder\n\n"1 of 10"');
  outs.forEach((n,i)=>{const y=44+i*26;s+=ln(`470,${y} 520,${y}`,n)+tp(520,y,n,'r');});
  s+=ln('295,260 295,300 360,300',12)+tp(360,300,12,'r');
  s+=tx(40,26,'16 VDD / 8 VSS power every block',{a:'start',s:11,c:PAL.muted});
  return {vb:'-60 0 670 320',s:s+tp(40,90,14,'l')+tp(40,150,13,'l')+tp(40,230,15,'l')};},
minimal:{title:'CD4017: 10-LED chaser',sub:'clocked by a 555 (project 9)',rows:[
 [1,[[['LED:r'],'T:shared 470 Ω → GND']],'Q5. Every LED: anode on its output, cathodes together through ONE 470 Ω to ground (only one LED is on at a time).'],
 [2,[[['LED:r'],'T:shared 470 Ω → GND']],'Q1.'],[3,[[['LED:r'],'T:shared 470 Ω → GND']],'Q0 (first after reset).'],[4,[[['LED:r'],'T:shared 470 Ω → GND']],'Q2.'],
 [5,[[['LED:r'],'T:shared 470 Ω → GND']],'Q6.'],[6,[[['LED:r'],'T:shared 470 Ω → GND']],'Q7.'],[7,[[['LED:r'],'T:shared 470 Ω → GND']],'Q3.'],
 [8,[[[],'GND']],'VSS: ground.'],
 [9,[[['LED:r'],'T:shared 470 Ω → GND']],'Q8.'],[10,[[['LED:r'],'T:shared 470 Ω → GND']],'Q4.'],[11,[[['LED:r'],'T:shared 470 Ω → GND']],'Q9.'],
 [12,[[[],'NC']],'Carry out: not needed (would clock a second 4017).'],
 [13,[[[],'GND']],'Clock inhibit: ground = counting. Never leave it floating!'],
 [14,[[[],'IN:clock from 555 pin 3']],'Clock: one step per rising edge.'],
 [15,[[['R:10 kΩ'],'GND']],'Reset: held low (pull-down). To count to N, wire it to output QN instead.'],
 [16,[[[],'V9'],[['C:100 nF'],'GND']],'VDD: supply 3–15 V, decoupled.']]},
art:dipArt('CD4017',16,'Decade counter','#34d399')});

(function(){
// ===== 7. CD4017 =====
const CT={q:0,acc:0,flash:0};
(function(){const s=$('ctN');for(let n=2;n<=10;n++){const o=document.createElement('option');o.value=n;o.textContent=n;s.appendChild(o);}s.value=10;})();
function pulse(){CT.q=(CT.q+1)%(+$('ctN').value);CT.flash=0.15;}
$('ctStep').onclick=pulse;
function draw4017(dt){const f=+$('ctF').value;if(f>0){CT.acc+=dt*f;while(CT.acc>=1){CT.acc-=1;pulse();}}CT.flash=Math.max(0,CT.flash-dt);
  const c=$('c4017'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  dip(ctx,80,30,['Q5','Q1','Q0','Q2','Q6','Q7','Q3','VSS','Q8','Q4','Q9','CO','EN','CLK','RST','VDD'],'CD4017',[14,15],12);
  arrowText(ctx,'14 = clock · 15 = reset',115,185,PAL.yellow,11);
  const N=+$('ctN').value;
  for(let i=0;i<10;i++){const x=260+i*52,y=110,on=i===CT.q,used=i<N;
    if(on){const g=ctx.createRadialGradient(x,y,2,x,y,34);g.addColorStop(0,'rgba(239,68,68,1)');g.addColorStop(1,'rgba(239,68,68,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,34,0,7);ctx.fill();}
    ctx.fillStyle=on?PAL.bad:used?'#3f1d1d':PAL.raised;ctx.beginPath();ctx.arc(x,y,13,0,7);ctx.fill();ctx.strokeStyle=used?'#7f1d1d':PAL.slateDark;ctx.lineWidth=1.5;ctx.stroke();
    arrowText(ctx,'Q'+i,x,y+34,used?PAL.muted:PAL.slate,12);}
  if(N<10){const x=260+N*52;ctx.strokeStyle=PAL.yellow;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,150);ctx.lineTo(x,175);ctx.lineTo(260-30,175);ctx.lineTo(230,60);ctx.stroke();arrowText(ctx,'Q'+N+' wired to RESET → counts 0…'+(N-1),x+10,195,PAL.yellow,12,'left');}
  ctx.fillStyle=CT.flash>0?PAL.yellow:PAL.slateDark;ctx.fillRect(260,40,60,20);arrowText(ctx,'CLOCK',290,54,CT.flash>0?PAL.canvas:PAL.muted,11);
  arrowText(ctx,'count = '+CT.q,500,55,PAL.ink,15);
  arrowText(ctx,f>0?(f.toFixed(1)+' pulses per second'):'clock stopped: use "One pulse"',500,235,PAL.muted,12);}
loop((dt,now)=>{draw4017(dt);});
})();
