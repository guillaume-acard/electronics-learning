// ===== Demos for LM339, CD4013, CD4060 (+ quartz), L293D =====
(function(){
const g=id=>document.getElementById(id);
function T(ctx,t,x,y,c='#94a3b8',s=12,a='center',b=false){ctx.fillStyle=c;ctx.font=(b?'700 ':'')+s+'px system-ui';ctx.textAlign=a;ctx.fillText(t,x,y);}
function L(ctx,pts,c='#94a3b8',w=2.5){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();}
function gnd(ctx,x,y){L(ctx,[[x-12,y],[x+12,y]]);L(ctx,[[x-7,y+5],[x+7,y+5]]);L(ctx,[[x-3,y+10],[x+3,y+10]]);}
function lamp(ctx,x,y,on,rgb='34,197,94',r=9){if(on>0.02){const gr=ctx.createRadialGradient(x,y,1,x,y,r*3.2);gr.addColorStop(0,`rgba(${rgb},${on})`);gr.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=gr;ctx.beginPath();ctx.arc(x,y,r*3.2,0,7);ctx.fill();}
  ctx.fillStyle=on>0.02?`rgba(${rgb},${0.35+0.65*on})`:'#1e293b';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.strokeStyle='#475569';ctx.lineWidth=1.5;ctx.stroke();}
function sw(ctx,x1,y1,x2,y2,closed,c){const mx=(x1+x2)/2,my=(y1+y2)/2,a=Math.atan2(y2-y1,x2-x1),h=Math.hypot(x2-x1,y2-y1);ctx.save();ctx.translate(mx,my);ctx.rotate(a);
  L(ctx,[[-h/2,0],[-14,0]],c);L(ctx,[[14,0],[h/2,0]],c);ctx.fillStyle=c;[-14,14].forEach(x=>{ctx.beginPath();ctx.arc(x,0,3.5,0,7);ctx.fill();});L(ctx,closed?[[-14,0],[14,0]]:[[-14,0],[10,-13]],c,3);ctx.restore();}
function res(ctx,x1,y1,x2,y2,lab,c='#e7c99a'){const mx=(x1+x2)/2,my=(y1+y2)/2,a=Math.atan2(y2-y1,x2-x1),h=Math.hypot(x2-x1,y2-y1);ctx.save();ctx.translate(mx,my);ctx.rotate(a);
  L(ctx,[[-h/2,0],[-20,0]]);L(ctx,[[20,0],[h/2,0]]);ctx.fillStyle='#0b1220';ctx.fillRect(-20,-8,40,16);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.strokeRect(-20,-8,40,16);ctx.restore();if(lab)T(ctx,lab,mx+14,my+4,'#e2e8f0',11,'left');}
const vis=c=>c&&c.offsetParent;

// ---------- LM339 ----------
function draw339(t){const c=g('c339');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const vs=+g('c9sig').value,vt=+g('c9thr').value,pu=g('c9pu').checked,yes=vs>vt;
  T(ctx,`Is IN− (${vs.toFixed(2)} V) higher than IN+ (${vt.toFixed(2)} V)?  ${yes?'YES → output switched to ground':'NO → output transistor off'}`,400,24,yes?'#10b981':'#cbd5e1',14,'center',true);
  // rails
  L(ctx,[[40,60],[760,60]],'#ef4444');T(ctx,'+5 V',36,64,'#f87171',12,'right');L(ctx,[[40,250],[760,250]],'#60a5fa');T(ctx,'0 V',36,254,'#60a5fa',12,'right');
  // inputs
  L(ctx,[[120,125],[250,125]],'#38bdf8');L(ctx,[[120,175],[250,175]],'#f59e0b');
  T(ctx,'signal',112,122,'#38bdf8',12,'right');T(ctx,vs.toFixed(2)+' V',112,138,'#38bdf8',12,'right');
  T(ctx,'threshold',112,172,'#f59e0b',12,'right');T(ctx,vt.toFixed(2)+' V',112,188,'#f59e0b',12,'right');
  [[150,vs,'#38bdf8',125],[200,vt,'#f59e0b',175]].forEach(([x,v,col,y])=>{ctx.fillStyle='#1e293b';ctx.fillRect(x-6,72,12,160);ctx.fillStyle=col;const h=v/5*160;ctx.fillRect(x-6,232-h,12,h);});
  ctx.fillStyle='#111c2e';ctx.strokeStyle='#cbd5e1';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(250,100);ctx.lineTo(340,150);ctx.lineTo(250,200);ctx.closePath();ctx.fill();ctx.stroke();
  T(ctx,'−',262,130,'#e2e8f0',18,'center',true);T(ctx,'+',262,182,'#e2e8f0',16,'center',true);T(ctx,'LM339',290,216,'#94a3b8',11);
  // open collector switch
  L(ctx,[[340,150],[400,150]]);T(ctx,'drives',370,142,'#64748b',10);
  const nx=470;L(ctx,[[nx,150],[nx,165]]);sw(ctx,nx,165,nx,235,yes,yes?'#10b981':'#94a3b8');L(ctx,[[nx,235],[nx,250]]);
  ctx.setLineDash([4,4]);L(ctx,[[400,150],[445,200]],'#64748b',1.5);ctx.setLineDash([]);T(ctx,'open collector',nx+14,205,'#94a3b8',11,'left');
  // pull-up
  if(pu){res(ctx,nx,60,nx,150,'10 kΩ pull-up');}else{ctx.setLineDash([3,6]);L(ctx,[[nx,70],[nx,140]],'#334155',2);ctx.setLineDash([]);T(ctx,'(no pull-up)',nx+10,104,'#64748b',11,'left');}
  ctx.fillStyle='#94a3b8';ctx.beginPath();ctx.arc(nx,150,4,0,7);ctx.fill();
  // output reading
  L(ctx,[[nx,150],[600,150]]);let vo,txt,col;
  if(yes){vo=0.05;txt='LOW (0 V)';col='#10b981';}else if(pu){vo=5;txt='HIGH (5 V)';col='#f87171';}else{vo=1.5+1.5*Math.sin(t*7.3)+Math.sin(t*23.1);vo=Math.max(0,Math.min(5,vo));txt='floating: random!';col='#fbbf24';}
  ctx.fillStyle='#111c2e';ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(600,105,160,90,10);ctx.fill();ctx.stroke();
  T(ctx,'OUT1 = '+vo.toFixed(2)+' V',680,138,'#e2e8f0',15,'center',true);T(ctx,txt,680,162,col,13);T(ctx,'what a chip input reads',680,182,'#64748b',10);}

// ---------- CD4013 ----------
const F13={d:0,q:0,clk:0,pulse:0,auto:false,acc:0,hist:[],samp:0};
function edge13(){F13.q=g('d13tog').checked?1-F13.q:F13.d;}
function setClk(v){if(v&&!F13.clk)edge13();F13.clk=v;}
g('d13clk').addEventListener('click',()=>{F13.pulse=0.25;});
g('d13d').addEventListener('click',e=>{F13.d=1-F13.d;e.target.textContent='D = '+F13.d;e.target.classList.toggle('active',!!F13.d);});
g('d13run').addEventListener('click',e=>{F13.auto=!F13.auto;e.target.textContent=F13.auto?'⏸ Auto clock':'▶ Auto clock';e.target.classList.toggle('active',F13.auto);});
g('d13r').addEventListener('click',()=>{F13.q=0;});
g('d13tog').addEventListener('change',e=>{g('d13d').disabled=e.target.checked;});
function draw4013(dt){const c=g('c4013');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const tog=g('d13tog').checked;if(tog)F13.d=1-F13.q;
  let ck=0;if(F13.pulse>0){F13.pulse-=dt;ck=1;}if(F13.auto){F13.acc=(F13.acc+dt)%1;if(F13.acc<0.5)ck=1;}setClk(ck);if(tog)F13.d=1-F13.q;
  F13.samp+=dt;while(F13.samp>=1/30){F13.samp-=1/30;F13.hist.push([F13.clk,F13.d,F13.q]);if(F13.hist.length>300)F13.hist.shift();}
  // box
  ctx.fillStyle='#111c2e';ctx.strokeStyle='#f472b6';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(90,60,140,150,10);ctx.fill();ctx.stroke();T(ctx,'D flip-flop',160,50,'#f472b6',13,'center',true);
  L(ctx,[[90,128],[102,136],[90,144]],'#cbd5e1',1.5);
  [['D',95,F13.d,'#38bdf8'],['CLK',136,F13.clk,'#fbbf24']].forEach(([n,y,v,col])=>{L(ctx,[[30,y],[90,y]],v?col:'#475569',3);T(ctx,n,108,y+4,'#e2e8f0',13,'left',true);lamp(ctx,30,y,v?1:0,'56,189,248',7);T(ctx,String(v),30,y+24,'#94a3b8',11);});
  [['Q',95,F13.q,0],['Q',175,1-F13.q,1]].forEach(([n,y,v,bar])=>{L(ctx,[[230,y],[262,y]],v?'#10b981':'#475569',3);T(ctx,n,212,y+4,'#e2e8f0',13,'right',true);if(bar)L(ctx,[[202,y-10],[212,y-10]],'#e2e8f0',1.5);lamp(ctx,270,y,v?1:0);});
  if(tog){ctx.strokeStyle='#fbbf24';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(262,175);ctx.lineTo(262,236);ctx.lineTo(55,236);ctx.lineTo(55,95);ctx.stroke();ctx.setLineDash([]);T(ctx,'Q̅ → D (toggle)',160,252,'#fbbf24',11);}
  // timing diagram
  const x0=330,x1=780;const rows=[['CLK',0,'#fbbf24',70],['D',1,'#38bdf8',140],['Q',2,'#10b981',210]];
  T(ctx,'last 10 seconds →',x1,24,'#64748b',11,'right');
  rows.forEach(([n,k,col,y])=>{T(ctx,n,x0-10,y-8,col,13,'right',true);L(ctx,[[x0,y],[x1,y]],'#1e293b',1);ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();
    const h=F13.hist,N=300;h.forEach((s,i)=>{const x=x1-(h.length-1-i)*(x1-x0)/N,yy=y-s[k]*34;if(!i)ctx.moveTo(x,yy);else{const py=y-h[i-1][k]*34;if(py!==yy)ctx.lineTo(x,py);ctx.lineTo(x,yy);}});ctx.stroke();});
  ctx.setLineDash([3,4]);ctx.strokeStyle='rgba(251,191,36,.45)';ctx.lineWidth=1;const h=F13.hist;for(let i=1;i<h.length;i++){if(h[i][0]&&!h[i-1][0]){const x=x1-(h.length-1-i)*(x1-x0)/300;ctx.beginPath();ctx.moveTo(x,36);ctx.lineTo(x,214);ctx.stroke();}}ctx.setLineDash([]);
  T(ctx,'Q only changes on a rising clock edge (dashed lines)',(x0+x1)/2,250,'#94a3b8',12);}

// ---------- CD4060 ----------
const F60={t:0,run:true};
g('d60run').addEventListener('click',e=>{F60.run=!F60.run;e.target.textContent=F60.run?'⏸ Pause':'▶ Run';e.target.classList.toggle('active',F60.run);});
g('d60rst').addEventListener('click',()=>{F60.t=0;});
const PIN60={4:7,5:5,6:4,7:6,8:14,9:13,10:15,12:1,13:2,14:3};
const fmtHz=f=>f>=1000?(f/1000).toFixed(f>=10000?1:2).replace(/\.?0+$/,'')+' kHz':(+f.toFixed(1))+' Hz';
function draw4060(dt){const c=g('c4060');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  if(F60.run)F60.t+=dt;const t=F60.t;
  // quartz
  const wob=F60.run?Math.sin(performance.now()/18)*2:0;ctx.fillStyle='#cbd5e1';ctx.beginPath();ctx.roundRect(30+wob,40,46,22,11);ctx.fill();L(ctx,[[44,62],[44,80]],'#cbd5e1',2);L(ctx,[[62,62],[62,80]],'#cbd5e1',2);
  T(ctx,'quartz',53,32,'#e2e8f0',12,'center',true);T(ctx,'32 768 Hz',53,98,'#fbbf24',12);
  L(ctx,[[84,74],[126,74]],'#fbbf24',2);ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.moveTo(132,74);ctx.lineTo(124,69);ctx.lineTo(124,79);ctx.fill();
  T(ctx,'time: '+t.toFixed(2)+' s',53,130,'#94a3b8',12);T(ctx,'Q14 rises every',53,160,'#64748b',11);T(ctx,'0.5 s exactly',53,176,'#64748b',11);
  for(let n=1;n<=14;n++){const col=(n-1)%7,row=Math.floor((n-1)/7),x=170+col*88,y=60+row*130,f=32768/Math.pow(2,n),pin=PIN60[n];
    const on=Math.floor(t*32768/Math.pow(2,n-1))%2===1,blur=f>12;
    ctx.fillStyle='#111c2e';ctx.strokeStyle=pin?'#f59e0b':'#334155';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(x-36,y-30,72,104,8);ctx.fill();ctx.stroke();
    T(ctx,'Q'+n,x,y-12,pin?'#e2e8f0':'#64748b',13,'center',true);
    if(pin)lamp(ctx,x,y+14,t===0?0:(blur?0.5:(on?1:0)),'245,158,11',10);else{ctx.fillStyle='#1e293b';ctx.beginPath();ctx.arc(x,y+14,10,0,7);ctx.fill();}
    T(ctx,fmtHz(f),x,y+46,pin?'#fbbf24':'#475569',11);T(ctx,pin?'pin '+pin:'no pin',x,y+62,pin?'#94a3b8':'#475569',10);
    if(col<6)L(ctx,[[x+36,y+14],[x+52,y+14]],'#475569',1.5);}
  L(ctx,[[734,74],[752,74],[752,142],[118,142],[118,204],[134,204]],'#475569',1.5);
  T(ctx,'each stage divides by 2 →',460,18,'#64748b',11);
  T(ctx,blurNote(),480,290,'#94a3b8',11);}
function blurNote(){return 'Above ~12 Hz the blinking is too fast for your eyes: those LEDs look half lit.';}

// ---------- quartz resonance ----------
function drawXtal(){const c=g('cXtal');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const f=+g('xtF').value,f0=32768,Q=60000,A=f=>1/Math.sqrt(1+Math.pow(2*Q*(f-f0)/f0,2)),a=A(f);
  g('xtFt').textContent=f.toLocaleString('en-US',{minimumFractionDigits:2})+' Hz';
  // tuning fork
  const ph=Math.sin(performance.now()/40)*a*14,cx=140;ctx.fillStyle='#cbd5e1';
  ctx.beginPath();ctx.moveTo(cx-30-ph,40);ctx.lineTo(cx-16-ph,40);ctx.lineTo(cx-12,170);ctx.lineTo(cx-26,170);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(cx+30+ph,40);ctx.lineTo(cx+16+ph,40);ctx.lineTo(cx+12,170);ctx.lineTo(cx+26,170);ctx.closePath();ctx.fill();
  ctx.fillRect(cx-26,170,52,16);ctx.fillRect(cx-6,186,12,30);
  T(ctx,'the quartz fork inside',cx,236,'#94a3b8',11);T(ctx,'amplitude '+Math.round(a*100)+' %',cx,254,a>0.5?'#10b981':'#fbbf24',13,'center',true);
  // curve
  const x0=300,x1=770,y0=210,y1=62,fx=v=>x0+(v-32740)/(56)*(x1-x0),ay=v=>y0-(y0-y1)*v;
  L(ctx,[[x0,y0],[x1,y0]],'#334155',1.5);L(ctx,[[x0,y0],[x0,y1]],'#334155',1.5);
  ctx.strokeStyle='#f59e0b';ctx.lineWidth=2.5;ctx.beginPath();for(let px=0;px<=x1-x0;px++){const v=32740+px/(x1-x0)*56,yy=ay(A(v));px?ctx.lineTo(x0+px,yy):ctx.moveTo(x0+px,yy);}ctx.stroke();
  ctx.fillStyle='#38bdf8';ctx.beginPath();ctx.arc(fx(f),ay(a),7,0,7);ctx.fill();L(ctx,[[fx(f),y0],[fx(f),ay(a)]],'#38bdf8',1.5);
  [32740,32754,32768,32782,32796].forEach(v=>T(ctx,v.toLocaleString('en-US'),fx(v),y0+18,'#64748b',10));
  T(ctx,'how much the quartz responds',x0+6,y1-8,'#94a3b8',11,'left');T(ctx,'push frequency (Hz)',x1,y0+36,'#94a3b8',11,'right');
  const off=Math.abs(f-f0),pc=(off/f0*100).toFixed(4);
  T(ctx,a>0.9?'Right on 32,768 Hz: it rings at full strength.':a>0.3?`Off by ${off.toFixed(2)} Hz (${pc} %): already much weaker.`:`Off by ${off.toFixed(2)} Hz (${pc} %): it barely moves.`,(x0+x1)/2,24,a>0.9?'#10b981':'#fbbf24',13,'center',true);}

// ---------- L293D ----------
const HB={mode:'F',spd:0,ang:0,t:0};
[['hbF','F'],['hbR','R'],['hbB','B'],['hbC','C']].forEach(([id,m])=>g(id).addEventListener('click',()=>{HB.mode=m;['hbF','hbR','hbB','hbC'].forEach(k=>g(k).classList.toggle('active',k===id));}));
g('hbF').classList.add('active');
function draw293(dt){const c=g('c293');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  HB.t+=dt;const duty=+g('hbS').value/100,m=HB.mode,pwmOn=(HB.t*4%1)<duty||duty>=1;
  const drive=m==='F'?1:m==='R'?-1:0,target=drive*duty;
  HB.spd+=(target-HB.spd)*Math.min(1,dt*(m==='B'?9:m==='C'?0.8:3));HB.ang+=HB.spd*dt*12;
  const on=pwmOn&&(m==='F'||m==='R');
  // switches: s1 TL, s2 BL, s3 TR, s4 BR
  const S={tl:m==='F'&&on,bl:m==='R'||m==='B',tr:m==='R'&&on,br:m==='F'||m==='B'};
  const T0=50,B0=260,Lx=200,Rx=480,My=155;
  L(ctx,[[Lx,T0],[Rx,T0]],'#ef4444');L(ctx,[[Lx,B0],[Rx,B0]],'#60a5fa');T(ctx,'VCC2 (+9 V)',340,T0-10,'#f87171',12);T(ctx,'GND',340,B0+22,'#60a5fa',12);
  sw(ctx,Lx,T0,Lx,My,S.tl,S.tl?'#10b981':'#94a3b8');sw(ctx,Lx,My,Lx,B0,S.bl,S.bl?'#10b981':'#94a3b8');
  sw(ctx,Rx,T0,Rx,My,S.tr,S.tr?'#10b981':'#94a3b8');sw(ctx,Rx,My,Rx,B0,S.br,S.br?'#10b981':'#94a3b8');
  T(ctx,'1Y (pin 3)',Lx-12,My+4,'#e2e8f0',12,'right');T(ctx,'2Y (pin 6)',Rx+12,My+4,'#e2e8f0',12,'left');
  L(ctx,[[Lx,My],[310,My]]);L(ctx,[[370,My],[Rx,My]]);
  ctx.fillStyle='#0b1220';ctx.strokeStyle='#cbd5e1';ctx.lineWidth=3;ctx.beginPath();ctx.arc(340,My,30,0,7);ctx.fill();ctx.stroke();
  ctx.save();ctx.translate(340,My);ctx.rotate(HB.ang);ctx.strokeStyle='#60a5fa';ctx.lineWidth=3;for(let i=0;i<3;i++){ctx.rotate(2.094);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(22,0);ctx.stroke();}ctx.restore();T(ctx,'M',340,My+5,'#e2e8f0',14,'center',true);
  // current path dots
  const flow=m==='F'&&on?[[Lx,T0+4],[Lx,My],[Rx,My],[Rx,B0-4]]:m==='R'&&on?[[Rx,T0+4],[Rx,My],[Lx,My],[Lx,B0-4]]:null;
  if(flow){ctx.strokeStyle='#fbbf24';ctx.lineWidth=7;ctx.lineCap='round';ctx.setLineDash([0,20]);ctx.lineDashOffset=-performance.now()/15;ctx.beginPath();flow.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.setLineDash([]);ctx.lineCap='butt';}
  // LEDs like project 24
  lamp(ctx,560,120,m==='F'&&on?1:0,'239,68,68',9);T(ctx,'red: forward',576,124,'#94a3b8',11,'left');lamp(ctx,560,160,m==='R'&&on?1:0,'34,197,94',9);T(ctx,'green: reverse',576,164,'#94a3b8',11,'left');
  // status
  const msg={F:'Forward: top-left + bottom-right closed, current flows left → right',R:'Reverse: top-right + bottom-left closed, current flows right → left',B:'Brake: both bottom switches closed, the motor is shorted and stops fast',C:'Coast: all switches open, the motor spins down by itself'}[m];
  T(ctx,msg,400,22,'#e2e8f0',13,'center',true);
  const rpm=Math.round(Math.abs(HB.spd)*9200*0.7);T(ctx,(HB.spd>=0?'↻ ':'↺ ')+rpm+' rpm',340,My+56,'#fbbf24',13,'center',true);
  // PWM trace
  if(m==='F'||m==='R'){const x0=560,w=200,y=240;T(ctx,'EN (PWM '+Math.round(duty*100)+' %)',x0,y-30,'#94a3b8',11,'left');ctx.strokeStyle='#fbbf24';ctx.lineWidth=2;ctx.beginPath();
    for(let i=0;i<=w;i++){const ph=((i/w)*4+HB.t*4)%1,v=duty>=1||ph<duty?1:0,yy=y-v*18;i?ctx.lineTo(x0+i,yy):ctx.moveTo(x0+i,yy);}ctx.stroke();}
  T(ctx,'(switches drawn as simple contacts; the chip uses transistors)',40,292,'#64748b',10,'left');}

let last=performance.now();
(function loop(now){const dt=Math.min(0.05,(now-last)/1000);last=now;const t=now/1000;
  draw339(t);draw4013(dt);draw4060(dt);drawXtal();draw293(dt);requestAnimationFrame(loop);})(performance.now());
})();
