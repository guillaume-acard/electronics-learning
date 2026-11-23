// ===== 4013: data (pinout, inside, minimal circuit, hero art) + its demo =====
CHIP('4013',{
pinout:{pkg:'dip',title:'CD4013 (DIP-14)',pins:[
 [1,'Q1','out','Flip-flop 1 output: a copy of what D1 was at the last rising edge of CLK1.','To what you want to drive: the next counter\'s clock, an LED through 1 kΩ, a transistor base through 10 kΩ.'],
 [2,'Q̅1','out','Flip-flop 1 inverted output: always the opposite of Q1.','Wire it to D1 (pin 5) and the flip-flop toggles: it divides the clock by 2.'],
 [3,'CLK1','in','Clock of flip-flop 1: on each rising edge (low → high), Q1 takes the value of D1.','From a clean clock: a CD4060 output, a 555, or a debounced button.'],
 [4,'R1','ctl','Reset 1, active HIGH: high forces Q1 = 0 right away, whatever the clock does.','To ground for normal use. Never leave it floating.'],
 [5,'D1','in','Data input of flip-flop 1: the value that will be copied to Q1 at the next clock edge.','From Q̅1 (pin 2) for a divide-by-2, or from any logic signal to "photograph" it.'],
 [6,'S1','ctl','Set 1, active HIGH: high forces Q1 = 1 right away.','To ground for normal use.'],
 [7,'VSS','gnd','Ground.','To the − rail.'],
 [8,'S2','ctl','Set 2, active HIGH.','To ground (unused flip-flop: all inputs to ground).'],
 [9,'D2','in','Data input of flip-flop 2.','Unused: to ground.'],
 [10,'R2','ctl','Reset 2, active HIGH.','To ground.'],
 [11,'CLK2','in','Clock of flip-flop 2.','Unused: to ground. CMOS inputs must never float.'],
 [12,'Q̅2','out','Flip-flop 2 inverted output.','Unused: leave free (outputs may float).'],
 [13,'Q2','out','Flip-flop 2 output.','Unused: leave free.'],
 [14,'VDD','pwr','Supply, 3–15 V.','To the + rail, with 100 nF to ground.']]},
inside:({ln,tx,bx,dot,tp,cmp,res,gnd,arrow})=>{let s='',pins='';
  [[30,'1',5,3,6,4,1,2],[190,'2',9,11,8,10,13,12]].forEach(([y0,L,D,C,S,R,Q,Qb])=>{
    [[D,20],[C,45],[S,70],[R,95]].forEach(([n,dy])=>{s+=ln(`40,${y0+dy} 180,${y0+dy}`,n);pins+=tp(40,y0+dy,n,'l');});
    s+=bx(180,y0,170,120,'D flip-flop '+L+'\nQ = D at the\nclock\'s rising edge\nS / R force 1 / 0');
    s+=`<path d="M180 ${y0+38}l10 7l-10 7" fill="none" stroke="${PAL.ink2}" stroke-width="1.5"/>`;
    [[Q,30],[Qb,90]].forEach(([n,dy])=>{s+=ln(`350,${y0+dy} 470,${y0+dy}`,n);pins+=tp(470,y0+dy,n,'r');});});
  s+=tx(260,172,'tip: wire Q̅ back to D (outside) and it divides the clock by 2',{s:11,c:PAL.yellow});
  s+=tx(40,14,'14 VDD / 7 VSS power both flip-flops',{a:'start',s:11,c:PAL.muted});
  return {vb:'-70 0 700 330',s:s+pins};},
minimal:{title:'CD4013: 2 Hz in, 1 Hz out (project 26)',sub:'flip-flop 1 wired as a divide-by-2, flip-flop 2 parked',rows:[
 [1,[[[],'T:1 Hz out → CD4518 CLK A'],[['R:1 kΩ','LED:r'],'GND']],'Q1: flips at every clock edge, so it gives half the clock frequency. An LED here blinks once per second.'],
 [2,[[[],'P5']],'Q̅1: back to D1. That feedback is the whole divide-by-2 trick: D always asks for the opposite of what Q is now.'],
 [3,[[[],'IN:2 Hz from CD4060 Q14 (pin 3)']],'CLK1: the 2 Hz clock.'],
 [4,[[[],'GND']],'R1: low (inactive).'],
 [5,[[[],'P2']],'D1: from Q̅1.'],
 [6,[[[],'GND']],'S1: low (inactive).'],
 [7,[[[],'GND']],'VSS: ground.'],
 [8,[[[],'GND']],'S2 (unused): ground.'],[9,[[[],'GND']],'D2 (unused): ground.'],[10,[[[],'GND']],'R2 (unused): ground.'],[11,[[[],'GND']],'CLK2 (unused): ground. CMOS inputs must never float.'],
 [12,[[[],'NC']],'Q̅2: free.'],[13,[[[],'NC']],'Q2: free.'],
 [14,[[[],'V9'],[['C:100 nF'],'GND']],'VDD: supply, decoupled.']]},
art:dipArt('CD4013',14,'Dual D flip-flop',PAL.pink)});

(function(){
// ---------- CD4013 ----------
const F13={d:0,q:0,clk:0,pulse:0,auto:false,acc:0,hist:[],samp:0};
function edge13(){F13.q=$('d13tog').checked?1-F13.q:F13.d;}
function setClk(v){if(v&&!F13.clk)edge13();F13.clk=v;}
$('d13clk').addEventListener('click',()=>{F13.pulse=0.25;});
$('d13d').addEventListener('click',e=>{F13.d=1-F13.d;e.target.textContent='D = '+F13.d;e.target.classList.toggle('active',!!F13.d);});
$('d13run').addEventListener('click',e=>{F13.auto=!F13.auto;e.target.textContent=F13.auto?'⏸ Auto clock':'▶ Auto clock';e.target.classList.toggle('active',F13.auto);});
$('d13r').addEventListener('click',()=>{F13.q=0;});
$('d13tog').addEventListener('change',e=>{$('d13d').disabled=e.target.checked;});
function draw4013(dt){const c=$('c4013');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const tog=$('d13tog').checked;if(tog)F13.d=1-F13.q;
  let ck=0;if(F13.pulse>0){F13.pulse-=dt;ck=1;}if(F13.auto){F13.acc=(F13.acc+dt)%1;if(F13.acc<0.5)ck=1;}setClk(ck);if(tog)F13.d=1-F13.q;
  F13.samp+=dt;while(F13.samp>=1/30){F13.samp-=1/30;F13.hist.push([F13.clk,F13.d,F13.q]);if(F13.hist.length>300)F13.hist.shift();}
  // box
  ctx.fillStyle=PAL.panel;ctx.strokeStyle=PAL.pink;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(90,60,140,150,10);ctx.fill();ctx.stroke();txt(ctx,'D flip-flop',160,50,PAL.pink,13,'center');
  W(ctx,[[90,128],[102,136],[90,144]],PAL.ink2,1.5);
  [['D',95,F13.d,PAL.sky],['CLK',136,F13.clk,PAL.yellow]].forEach(([n,y,v,col])=>{W(ctx,[[30,y],[90,y]],v?col:PAL.slate,3);txt(ctx,n,108,y+4,PAL.ink,13,'left');lamp(ctx,30,y,v?1:0,'56,189,248',7);txt(ctx,String(v),30,y+24,PAL.muted,11);});
  [['Q',95,F13.q,0],['Q',175,1-F13.q,1]].forEach(([n,y,v,bar])=>{W(ctx,[[230,y],[262,y]],v?PAL.good:PAL.slate,3);txt(ctx,n,212,y+4,PAL.ink,13,'right');if(bar)W(ctx,[[202,y-10],[212,y-10]],PAL.ink,1.5);lamp(ctx,270,y,v?1:0);});
  if(tog){ctx.strokeStyle=PAL.yellow;ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(262,175);ctx.lineTo(262,236);ctx.lineTo(55,236);ctx.lineTo(55,95);ctx.stroke();ctx.setLineDash([]);txt(ctx,'Q̅ → D (toggle)',160,252,PAL.yellow,11);}
  // timing diagram
  const x0=330,x1=780;const rows=[['CLK',0,PAL.yellow,70],['D',1,PAL.sky,140],['Q',2,PAL.good,210]];
  txt(ctx,'last 10 seconds →',x1,24,PAL.muted2,11,'right');
  rows.forEach(([n,k,col,y])=>{txt(ctx,n,x0-10,y-8,col,13,'right');W(ctx,[[x0,y],[x1,y]],PAL.raised,1);ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();
    const h=F13.hist,N=300;h.forEach((s,i)=>{const x=x1-(h.length-1-i)*(x1-x0)/N,yy=y-s[k]*34;if(!i)ctx.moveTo(x,yy);else{const py=y-h[i-1][k]*34;if(py!==yy)ctx.lineTo(x,py);ctx.lineTo(x,yy);}});ctx.stroke();});
  ctx.setLineDash([3,4]);ctx.strokeStyle='rgba(251,191,36,.45)';ctx.lineWidth=1;const h=F13.hist;for(let i=1;i<h.length;i++){if(h[i][0]&&!h[i-1][0]){const x=x1-(h.length-1-i)*(x1-x0)/300;ctx.beginPath();ctx.moveTo(x,36);ctx.lineTo(x,214);ctx.stroke();}}ctx.setLineDash([]);
  txt(ctx,'Q only changes on a rising clock edge (dashed lines)',(x0+x1)/2,250,PAL.muted,12);}
loop((dt,now)=>{draw4013(dt);});
})();
