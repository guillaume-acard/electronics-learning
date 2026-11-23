// ===== Demos for LM339, CD4013, CD4060 (+ quartz), L293D =====
(function(){
const vis=c=>c&&c.offsetParent;

// ---------- LM339 ----------
function draw339(t){const c=$('c339');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const vs=+$('c9sig').value,vt=+$('c9thr').value,pu=$('c9pu').checked,yes=vs>vt;
  txt(ctx,`Is IN− (${vs.toFixed(2)} V) higher than IN+ (${vt.toFixed(2)} V)?  ${yes?'YES → output switched to ground':'NO → output transistor off'}`,400,24,yes?PAL.good:PAL.ink2,14,'center');
  // rails
  W(ctx,[[40,60],[760,60]],PAL.bad);txt(ctx,'+5 V',36,64,PAL.redSoft,12,'right');W(ctx,[[40,250],[760,250]],PAL.blue);txt(ctx,'0 V',36,254,PAL.blue,12,'right');
  // inputs
  W(ctx,[[120,125],[250,125]],PAL.sky);W(ctx,[[120,175],[250,175]],PAL.amber);
  txt(ctx,'signal',112,122,PAL.sky,12,'right');txt(ctx,vs.toFixed(2)+' V',112,138,PAL.sky,12,'right');
  txt(ctx,'threshold',112,172,PAL.amber,12,'right');txt(ctx,vt.toFixed(2)+' V',112,188,PAL.amber,12,'right');
  [[150,vs,PAL.sky,125],[200,vt,PAL.amber,175]].forEach(([x,v,col,y])=>{ctx.fillStyle=PAL.raised;ctx.fillRect(x-6,72,12,160);ctx.fillStyle=col;const h=v/5*160;ctx.fillRect(x-6,232-h,12,h);});
  ctx.fillStyle=PAL.panel;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(250,100);ctx.lineTo(340,150);ctx.lineTo(250,200);ctx.closePath();ctx.fill();ctx.stroke();
  txt(ctx,'−',262,130,PAL.ink,18,'center');txt(ctx,'+',262,182,PAL.ink,16,'center');txt(ctx,'LM339',290,216,PAL.muted,11);
  // open collector switch
  W(ctx,[[340,150],[400,150]]);txt(ctx,'drives',370,142,PAL.muted2,10);
  const nx=470;W(ctx,[[nx,150],[nx,165]]);part(ctx,'switch',nx,165,nx,235,{closed:yes,col:yes?PAL.good:PAL.muted});W(ctx,[[nx,235],[nx,250]]);
  ctx.setLineDash([4,4]);W(ctx,[[400,150],[445,200]],PAL.muted2,1.5);ctx.setLineDash([]);txt(ctx,'open collector',nx+14,205,PAL.muted,11,'left');
  // pull-up
  if(pu){part(ctx,'res',nx,60,nx,150,{label:'10 kΩ pull-up'});}else{ctx.setLineDash([3,6]);W(ctx,[[nx,70],[nx,140]],PAL.slateDark,2);ctx.setLineDash([]);txt(ctx,'(no pull-up)',nx+10,104,PAL.muted2,11,'left');}
  ctx.fillStyle=PAL.muted;ctx.beginPath();ctx.arc(nx,150,4,0,7);ctx.fill();
  // output reading
  W(ctx,[[nx,150],[600,150]]);let vo,txt,col;
  if(yes){vo=0.05;txt='LOW (0 V)';col=PAL.good;}else if(pu){vo=5;txt='HIGH (5 V)';col=PAL.redSoft;}else{vo=1.5+1.5*Math.sin(t*7.3)+Math.sin(t*23.1);vo=Math.max(0,Math.min(5,vo));txt='floating: random!';col=PAL.yellow;}
  ctx.fillStyle=PAL.panel;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(600,105,160,90,10);ctx.fill();ctx.stroke();
  txt(ctx,'OUT1 = '+vo.toFixed(2)+' V',680,138,PAL.ink,15,'center');txt(ctx,txt,680,162,col,13);txt(ctx,'what a chip input reads',680,182,PAL.muted2,10);}

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

// ---------- CD4060 ----------
const F60={t:0,run:true};
$('d60run').addEventListener('click',e=>{F60.run=!F60.run;e.target.textContent=F60.run?'⏸ Pause':'▶ Run';e.target.classList.toggle('active',F60.run);});
$('d60rst').addEventListener('click',()=>{F60.t=0;});
const PIN60={4:7,5:5,6:4,7:6,8:14,9:13,10:15,12:1,13:2,14:3};
const fmtHz=f=>f>=1000?(f/1000).toFixed(f>=10000?1:2).replace(/\.?0+$/,'')+' kHz':(+f.toFixed(1))+' Hz';
function draw4060(dt){const c=$('c4060');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  if(F60.run)F60.t+=dt;const t=F60.t;
  // quartz
  const wob=F60.run?Math.sin(performance.now()/18)*2:0;ctx.fillStyle=PAL.ink2;ctx.beginPath();ctx.roundRect(30+wob,40,46,22,11);ctx.fill();W(ctx,[[44,62],[44,80]],PAL.ink2,2);W(ctx,[[62,62],[62,80]],PAL.ink2,2);
  txt(ctx,'quartz',53,32,PAL.ink,12,'center');txt(ctx,'32 768 Hz',53,98,PAL.yellow,12);
  W(ctx,[[84,74],[126,74]],PAL.yellow,2);ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.moveTo(132,74);ctx.lineTo(124,69);ctx.lineTo(124,79);ctx.fill();
  txt(ctx,'time: '+t.toFixed(2)+' s',53,130,PAL.muted,12);txt(ctx,'Q14 rises every',53,160,PAL.muted2,11);txt(ctx,'0.5 s exactly',53,176,PAL.muted2,11);
  for(let n=1;n<=14;n++){const col=(n-1)%7,row=Math.floor((n-1)/7),x=170+col*88,y=60+row*130,f=32768/Math.pow(2,n),pin=PIN60[n];
    const on=Math.floor(t*32768/Math.pow(2,n-1))%2===1,blur=f>12;
    ctx.fillStyle=PAL.panel;ctx.strokeStyle=pin?PAL.amber:PAL.slateDark;ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(x-36,y-30,72,104,8);ctx.fill();ctx.stroke();
    txt(ctx,'Q'+n,x,y-12,pin?PAL.ink:PAL.muted2,13,'center');
    if(pin)lamp(ctx,x,y+14,t===0?0:(blur?0.5:(on?1:0)),'245,158,11',10);else{ctx.fillStyle=PAL.raised;ctx.beginPath();ctx.arc(x,y+14,10,0,7);ctx.fill();}
    txt(ctx,fmtHz(f),x,y+46,pin?PAL.yellow:PAL.slate,11);txt(ctx,pin?'pin '+pin:'no pin',x,y+62,pin?PAL.muted:PAL.slate,10);
    if(col<6)W(ctx,[[x+36,y+14],[x+52,y+14]],PAL.slate,1.5);}
  W(ctx,[[734,74],[752,74],[752,142],[118,142],[118,204],[134,204]],PAL.slate,1.5);
  txt(ctx,'each stage divides by 2 →',460,18,PAL.muted2,11);
  txt(ctx,blurNote(),480,290,PAL.muted,11);}
function blurNote(){return 'Above ~12 Hz the blinking is too fast for your eyes: those LEDs look half lit.';}

// ---------- quartz resonance ----------
function drawXtal(){const c=$('cXtal');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const f=+$('xtF').value,f0=32768,Q=60000,A=f=>1/Math.sqrt(1+Math.pow(2*Q*(f-f0)/f0,2)),a=A(f);
  $('xtFt').textContent=f.toLocaleString('en-US',{minimumFractionDigits:2})+' Hz';
  // tuning fork
  const ph=Math.sin(performance.now()/40)*a*14,cx=140;ctx.fillStyle=PAL.ink2;
  ctx.beginPath();ctx.moveTo(cx-30-ph,40);ctx.lineTo(cx-16-ph,40);ctx.lineTo(cx-12,170);ctx.lineTo(cx-26,170);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(cx+30+ph,40);ctx.lineTo(cx+16+ph,40);ctx.lineTo(cx+12,170);ctx.lineTo(cx+26,170);ctx.closePath();ctx.fill();
  ctx.fillRect(cx-26,170,52,16);ctx.fillRect(cx-6,186,12,30);
  txt(ctx,'the quartz fork inside',cx,236,PAL.muted,11);txt(ctx,'amplitude '+Math.round(a*100)+' %',cx,254,a>0.5?PAL.good:PAL.yellow,13,'center');
  // curve
  const x0=300,x1=770,y0=210,y1=62,fx=v=>x0+(v-32740)/(56)*(x1-x0),ay=v=>y0-(y0-y1)*v;
  W(ctx,[[x0,y0],[x1,y0]],PAL.slateDark,1.5);W(ctx,[[x0,y0],[x0,y1]],PAL.slateDark,1.5);
  ctx.strokeStyle=PAL.amber;ctx.lineWidth=2.5;ctx.beginPath();for(let px=0;px<=x1-x0;px++){const v=32740+px/(x1-x0)*56,yy=ay(A(v));px?ctx.lineTo(x0+px,yy):ctx.moveTo(x0+px,yy);}ctx.stroke();
  ctx.fillStyle=PAL.sky;ctx.beginPath();ctx.arc(fx(f),ay(a),7,0,7);ctx.fill();W(ctx,[[fx(f),y0],[fx(f),ay(a)]],PAL.sky,1.5);
  [32740,32754,32768,32782,32796].forEach(v=>txt(ctx,v.toLocaleString('en-US'),fx(v),y0+18,PAL.muted2,10));
  txt(ctx,'how much the quartz responds',x0+6,y1-8,PAL.muted,11,'left');txt(ctx,'push frequency (Hz)',x1,y0+36,PAL.muted,11,'right');
  const off=Math.abs(f-f0),pc=(off/f0*100).toFixed(4);
  txt(ctx,a>0.9?'Right on 32,768 Hz: it rings at full strength.':a>0.3?`Off by ${off.toFixed(2)} Hz (${pc} %): already much weaker.`:`Off by ${off.toFixed(2)} Hz (${pc} %): it barely moves.`,(x0+x1)/2,24,a>0.9?PAL.good:PAL.yellow,13,'center');}

// ---------- L293D ----------
const HB={mode:'F',spd:0,ang:0,t:0};
[['hbF','F'],['hbR','R'],['hbB','B'],['hbC','C']].forEach(([id,m])=>$(id).addEventListener('click',()=>{HB.mode=m;['hbF','hbR','hbB','hbC'].forEach(k=>$(k).classList.toggle('active',k===id));}));
$('hbF').classList.add('active');
function draw293(dt){const c=$('c293');if(!vis(c))return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  HB.t+=dt;const duty=+$('hbS').value/100,m=HB.mode,pwmOn=(HB.t*4%1)<duty||duty>=1;
  const drive=m==='F'?1:m==='R'?-1:0,target=drive*duty;
  HB.spd+=(target-HB.spd)*Math.min(1,dt*(m==='B'?9:m==='C'?0.8:3));HB.ang+=HB.spd*dt*12;
  const on=pwmOn&&(m==='F'||m==='R');
  // switches: s1 TL, s2 BL, s3 TR, s4 BR
  const S={tl:m==='F'&&on,bl:m==='R'||m==='B',tr:m==='R'&&on,br:m==='F'||m==='B'};
  const T0=50,B0=260,Lx=200,Rx=480,My=155;
  W(ctx,[[Lx,T0],[Rx,T0]],PAL.bad);W(ctx,[[Lx,B0],[Rx,B0]],PAL.blue);txt(ctx,'VCC2 (+9 V)',340,T0-10,PAL.redSoft,12);txt(ctx,'GND',340,B0+22,PAL.blue,12);
  part(ctx,'switch',Lx,T0,Lx,My,{closed:S.tl,col:S.tl?PAL.good:PAL.muted});part(ctx,'switch',Lx,My,Lx,B0,{closed:S.bl,col:S.bl?PAL.good:PAL.muted});
  part(ctx,'switch',Rx,T0,Rx,My,{closed:S.tr,col:S.tr?PAL.good:PAL.muted});part(ctx,'switch',Rx,My,Rx,B0,{closed:S.br,col:S.br?PAL.good:PAL.muted});
  txt(ctx,'1Y (pin 3)',Lx-12,My+4,PAL.ink,12,'right');txt(ctx,'2Y (pin 6)',Rx+12,My+4,PAL.ink,12,'left');
  W(ctx,[[Lx,My],[310,My]]);W(ctx,[[370,My],[Rx,My]]);
  ctx.fillStyle=PAL.canvas;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=3;ctx.beginPath();ctx.arc(340,My,30,0,7);ctx.fill();ctx.stroke();
  ctx.save();ctx.translate(340,My);ctx.rotate(HB.ang);ctx.strokeStyle=PAL.blue;ctx.lineWidth=3;for(let i=0;i<3;i++){ctx.rotate(2.094);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(22,0);ctx.stroke();}ctx.restore();txt(ctx,'M',340,My+5,PAL.ink,14,'center');
  // current path dots
  const flow=m==='F'&&on?[[Lx,T0+4],[Lx,My],[Rx,My],[Rx,B0-4]]:m==='R'&&on?[[Rx,T0+4],[Rx,My],[Lx,My],[Lx,B0-4]]:null;
  if(flow){ctx.strokeStyle=PAL.yellow;ctx.lineWidth=7;ctx.lineCap='round';ctx.setLineDash([0,20]);ctx.lineDashOffset=-performance.now()/15;ctx.beginPath();flow.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.setLineDash([]);ctx.lineCap='butt';}
  // LEDs like project 24
  lamp(ctx,560,120,m==='F'&&on?1:0,'239,68,68',9);txt(ctx,'red: forward',576,124,PAL.muted,11,'left');lamp(ctx,560,160,m==='R'&&on?1:0,'34,197,94',9);txt(ctx,'green: reverse',576,164,PAL.muted,11,'left');
  // status
  const msg={F:'Forward: top-left + bottom-right closed, current flows left → right',R:'Reverse: top-right + bottom-left closed, current flows right → left',B:'Brake: both bottom switches closed, the motor is shorted and stops fast',C:'Coast: all switches open, the motor spins down by itself'}[m];
  txt(ctx,msg,400,22,PAL.ink,13,'center');
  const rpm=Math.round(Math.abs(HB.spd)*9200*0.7);txt(ctx,(HB.spd>=0?'↻ ':'↺ ')+rpm+' rpm',340,My+56,PAL.yellow,13,'center');
  // PWM trace
  if(m==='F'||m==='R'){const x0=560,w=200,y=240;txt(ctx,'EN (PWM '+Math.round(duty*100)+' %)',x0,y-30,PAL.muted,11,'left');ctx.strokeStyle=PAL.yellow;ctx.lineWidth=2;ctx.beginPath();
    for(let i=0;i<=w;i++){const ph=((i/w)*4+HB.t*4)%1,v=duty>=1||ph<duty?1:0,yy=y-v*18;i?ctx.lineTo(x0+i,yy):ctx.moveTo(x0+i,yy);}ctx.stroke();}
  txt(ctx,'(switches drawn as simple contacts; the chip uses transistors)',40,292,PAL.muted2,10,'left');}

loop((dt,now)=>{const t=now/1000;draw339(t);draw4013(dt);draw4060(dt);drawXtal();draw293(dt);});
})();
