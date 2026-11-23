
// ===== Formulas page =====
sectionMenu('foMenu',{first:'fobasics'});
const fv=id=>{const c=$(id);return c&&c.offsetParent?c:null;};
const fctx=c=>{const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);return x;};
const fR=r=>r>=1e6?+(r/1e6).toPrecision(3)+' MΩ':r>=1e3?+(r/1e3).toPrecision(3)+' kΩ':+r.toPrecision(3)+' Ω';
const fI=i=>i>=1?+i.toPrecision(3)+' A':i>=1e-3?+(i*1e3).toPrecision(3)+' mA':+(i*1e6).toPrecision(3)+' µA';
const fP=p=>p>=1?+p.toPrecision(3)+' W':+(p*1e3).toPrecision(3)+' mW';
const fV=v=>v>=1?+v.toPrecision(3)+' V':+(v*1e3).toPrecision(3)+' mV';
const E12S=[1,1.2,1.5,1.8,2.2,2.7,3.3,3.9,4.7,5.6,6.8,8.2];
const e12up=r=>{const d=Math.pow(10,Math.floor(Math.log10(r)));for(const m of E12S)if(m*d>=r*0.999)return m*d;return 10*d;};
const e12near=r=>{const d=Math.pow(10,Math.floor(Math.log10(r)));let best=d,bd=1e9;[...E12S,10].forEach(m=>{const v=m*d,dd=Math.abs(Math.log(v/r));if(dd<bd){bd=dd;best=v;}});return best;};
function pipe(ctx,x1,x2,y,h,col){ctx.fillStyle=col||'#1e3a5f';ctx.fillRect(x1,y-h/2,x2-x1,h);}
function flowDots(ctx,x1,x2,y,h,speed,t,col){const n=Math.max(2,Math.floor((x2-x1)/26));for(let i=0;i<n;i++){const x=x1+(((i/n)+t*speed*0.05)%1+1)%1*(x2-x1);ctx.fillStyle=col||PAL.link;ctx.beginPath();ctx.arc(x,y+(i%3-1)*h*0.22,Math.min(4,h/4),0,7);ctx.fill();}}
// ---------- basics ----------
function drawBasics(t){const c=fv('cfBasics');if(!c)return;const ctx=fctx(c);
  ctx.fillStyle='#1d4ed8';ctx.beginPath();ctx.roundRect(40,60,110,140,10);ctx.fill();txt(ctx,'pump',95,120,'#e0e7ff',14);txt(ctx,'= battery',95,140,'#bfdbfe',12);txt(ctx,'pressure = VOLTAGE',95,225,PAL.yellow,12);
  pipe(ctx,150,330,90,26);pipe(ctx,330,440,90,8,PAL.slate);pipe(ctx,440,620,90,26);pipe(ctx,620,650,90,26);pipe(ctx,150,650,190,26);ctx.fillStyle='#1e3a5f';ctx.fillRect(637,77,26,126);
  txt(ctx,'narrow pipe = RESISTANCE',385,62,PAL.pink,12);flowDots(ctx,150,650,90,22,4,t);flowDots(ctx,150,650,190,22,-4,t);txt(ctx,'flow = CURRENT',360,232,PAL.link,12);
  const a=t*4;ctx.save();ctx.translate(560,150);ctx.rotate(a);ctx.strokeStyle=PAL.yellow;ctx.lineWidth=4;for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,32);ctx.stroke();}ctx.restore();ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.arc(560,150,6,0,7);ctx.fill();txt(ctx,'wheel turns:',560,205,PAL.yellow,12);txt(ctx,'POWER = V × I',560,222,PAL.yellow,12);}
// ---------- units converter ----------
(()=>{const U=[['Ω',1],['kΩ',1e3],['MΩ',1e6],['mA',1e-3],['µA',1e-6],['A',1],['µF',1e-6],['nF',1e-9],['pF',1e-12],['mV',1e-3],['V',1]];const s=$('cvFrom');U.forEach(([u,m],i)=>{const o=document.createElement('option');o.value=i;o.textContent=u;if(u==='kΩ')o.selected=true;s.appendChild(o);});
  const fam=u=>u.includes('Ω')?['Ω','kΩ','MΩ']:u.endsWith('A')?['µA','mA','A']:u.endsWith('F')?['pF','nF','µF']:['mV','V'];
  const up=()=>{const v=parseFloat($('cvIn').value.replace(',','.'));const [u,m]=U[+s.value];if(isNaN(v)){$('cvOut').textContent='?';return;}const base=v*m;
    $('cvOut').textContent=fam(u).map(x=>{const mm=U.find(q=>q[0]===x)[1];return +(base/mm).toPrecision(4)+' '+x;}).join('  =  ');};
  $('cvIn').addEventListener('input',up);s.addEventListener('change',up);up();})();
// ---------- Ohm ----------
const OH={k:'I',V:9,R:1000,I:0.009};
function ohmControls(){const box=$('ohmCtl');const mk=(id,lab,min,max,step,val)=>`<label class="slider" style="flex:1">${lab}<input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${val}" style="flex:1;width:auto"></label>`;
  let h='';if(OH.k!=='V')h+=mk('ohV','Voltage',0.5,12,0.1,OH.V);if(OH.k!=='R')h+=mk('ohR','Resistance',1,6,0.01,Math.log10(OH.R));if(OH.k!=='I')h+=mk('ohI','Current (mA)',-1,2,0.01,Math.log10(OH.I*1000));box.innerHTML=h;
  box.querySelectorAll('input').forEach(i=>i.addEventListener('input',()=>{if($('ohV'))OH.V=+$('ohV').value;if($('ohR'))OH.R=Math.pow(10,+$('ohR').value);if($('ohI'))OH.I=Math.pow(10,+$('ohI').value)/1000;}));}
document.querySelectorAll('.foSolve').forEach(b=>b.addEventListener('click',()=>{OH.k=b.dataset.k;document.querySelectorAll('.foSolve').forEach(x=>x.classList.toggle('active',x===b));ohmControls();}));ohmControls();
function drawOhm(t){const c=fv('cfOhm');if(!c)return;const ctx=fctx(c);if(OH.k==='I')OH.I=OH.V/OH.R;if(OH.k==='V')OH.V=OH.R*OH.I;if(OH.k==='R')OH.R=OH.V/OH.I;
  // triangle
  const tx=130,ty=40;ctx.strokeStyle=PAL.sky;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx+100,ty+170);ctx.lineTo(tx-100,ty+170);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(tx-62,ty+105);ctx.lineTo(tx+62,ty+105);ctx.moveTo(tx,ty+105);ctx.lineTo(tx,ty+170);ctx.stroke();
  const hl=k=>OH.k===k?PAL.yellow:PAL.ink;txt(ctx,'V',tx,ty+80,hl('V'),30);txt(ctx,'R',tx-38,ty+150,hl('R'),26);txt(ctx,'I',tx+38,ty+150,hl('I'),26);
  const f={I:'I = V ÷ R',V:'V = R × I',R:'R = V ÷ I'}[OH.k];txt(ctx,f,tx,ty+205,PAL.yellow,16);
  // water pipe
  const y=110,h=Math.max(6,Math.min(46,46-Math.log10(OH.R)*7));pipe(ctx,300,720,y,46,'#0f2744');pipe(ctx,450,570,y,h,'#1e3a5f');pipe(ctx,300,450,y,46);pipe(ctx,570,720,y,46);
  flowDots(ctx,300,720,y,Math.min(40,h),Math.min(30,Math.sqrt(OH.I*1000)*2),t);txt(ctx,'pressure '+fV(OH.V),330,y-40,hl('V'),13,'left');txt(ctx,'pipe '+fR(OH.R),510,y-40,hl('R'),13);txt(ctx,'flow '+fI(OH.I),700,y-40,hl('I'),13,'right');
  const res=OH.k==='I'?`I = ${fV(OH.V)} ÷ ${fR(OH.R)} = ${fI(OH.I)}`:OH.k==='V'?`V = ${fR(OH.R)} × ${fI(OH.I)} = ${fV(OH.V)}`:`R = ${fV(OH.V)} ÷ ${fI(OH.I)} = ${fR(OH.R)}`;
  txt(ctx,res,510,200,PAL.white,18);}
// ---------- Power ----------
function drawPow(t){const c=fv('cfPow');if(!c)return;const ctx=fctx(c);const V=+$('pwV').value,R=Math.pow(10,+$('pwR').value),I=V/R,P=V*I;
  const lim=0.25,hot=Math.min(1,P/lim);glowAt(ctx,170,110,hot,P>lim?'239,68,68':'249,115,22',70);ctx.fillStyle='#e7c99a';ctx.beginPath();ctx.roundRect(120,96,100,28,10);ctx.fill();W(ctx,[[60,110],[120,110]],PAL.gray,3);W(ctx,[[220,110],[280,110]],PAL.gray,3);
  ['#7c3f12','#111',PAL.redDark].forEach((col,i)=>{ctx.fillStyle=col;ctx.fillRect(140+i*16,96,7,28);});txt(ctx,'¼ W resistor',170,160,PAL.muted,12);
  txt(ctx,`I = ${fV(V)} ÷ ${fR(R)} = ${fI(I)}`,520,60,PAL.ink2,15);txt(ctx,`P = V × I = ${fP(P)}`,520,95,PAL.white,20);txt(ctx,`(also V² ÷ R = ${fP(V*V/R)})`,520,125,PAL.muted,13);
  const pct=P/lim*100;ctx.fillStyle=PAL.raised;ctx.fillRect(380,150,280,18);ctx.fillStyle=P>lim?PAL.bad:P>lim*0.6?PAL.amber:PAL.green;ctx.fillRect(380,150,Math.min(280,280*P/lim),18);ctx.strokeStyle=PAL.muted2;ctx.strokeRect(380,150,280,18);
  txt(ctx,P>lim?`🔥 ${Math.round(pct)} % of ¼ W: too hot! Use a ${P>1?'2 W':P>0.5?'1 W':'½ W'} resistor or a higher value`:P>lim*0.6?`${Math.round(pct)} % of ¼ W: warm, prefer ½ W`:`${Math.round(pct)} % of ¼ W: fine`,520,200,P>lim?PAL.bad:P>lim*0.6?PAL.amber:PAL.green,14);}
// ---------- series / parallel ----------
const SP={par:false};$('spS').addEventListener('click',()=>{SP.par=false;$('spS').classList.add('active');$('spP').classList.remove('active');});$('spP').addEventListener('click',()=>{SP.par=true;$('spP').classList.add('active');$('spS').classList.remove('active');});
function drawSP(t){const c=fv('cfSP');if(!c)return;const ctx=fctx(c);const R1=e12near(Math.pow(10,+$('spR1').value)),R2=e12near(Math.pow(10,+$('spR2').value));const Rt=SP.par?R1*R2/(R1+R2):R1+R2,V=9,I=V/Rt;
  part(ctx,'batt',60,60,60,200,{label:'9 V',left:true});
  if(!SP.par){wire(ctx,[[60,60],[150,60]]);part(ctx,'res',150,60,250,60,{label:'R1 '+fR(R1)});wire(ctx,[[250,60],[300,60]]);part(ctx,'res',300,60,400,60,{label:'R2 '+fR(R2)});wire(ctx,[[400,60],[440,60],[440,200],[60,200]]);dots(ctx,[[60,200],[60,60],[440,60],[440,200],[60,200]],t*Math.min(40,I*4000));
    txt(ctx,`V1 = ${fV(I*R1)} · V2 = ${fV(I*R2)} (they add up to 9 V)`,250,240,PAL.muted,12);}
  else{wire(ctx,[[60,60],[200,60]]);wire(ctx,[[200,60],[200,90]]);wire(ctx,[[200,60],[340,60],[340,90]]);part(ctx,'res',200,90,200,170,{label:'R1'});part(ctx,'res',340,90,340,170,{label:'R2'});wire(ctx,[[200,170],[200,200]]);wire(ctx,[[340,170],[340,200],[60,200]]);
    dots(ctx,[[60,200],[60,60],[200,60],[200,200]],t*Math.min(40,V/R1*4000));dots(ctx,[[60,60],[340,60],[340,200],[200,200]],t*Math.min(40,V/R2*4000),PAL.pink);txt(ctx,`I1 = ${fI(V/R1)} · I2 = ${fI(V/R2)} (they add up)`,250,240,PAL.muted,12);}
  txt(ctx,SP.par?'R = R1 × R2 ÷ (R1 + R2)':'R = R1 + R2',620,80,PAL.sky,18);txt(ctx,SP.par?`= ${fR(R1)} × ${fR(R2)} ÷ ${fR(R1+R2)}`:`= ${fR(R1)} + ${fR(R2)}`,620,115,PAL.ink2,14);txt(ctx,'= '+fR(Rt),620,150,PAL.white,22);txt(ctx,'battery current '+fI(I),620,185,PAL.yellow,14);
  if(SP.par)txt(ctx,'smaller than the smallest one!',620,210,PAL.muted,12);}
// ---------- divider ----------
function drawDiv(t){const c=fv('cfDiv');if(!c)return;const ctx=fctx(c);const V=+$('dvV').value,R1=e12near(Math.pow(10,+$('dvR1').value)),R2=e12near(Math.pow(10,+$('dvR2').value)),Vo=V*R2/(R1+R2);
  txt(ctx,'Vin '+fV(V),200,24,PAL.bad,13);__PR(ctx,{t:'txt',s:'+'+V+' V',x:200,y:34});__PR(ctx,{t:'txt',s:'0 V',x:200,y:216});part(ctx,'res',200,34,200,114,{label:'R1 '+fR(R1)});dot(ctx,200,125);wire(ctx,[[200,114],[200,136]]);part(ctx,'res',200,136,200,216,{label:'R2 '+fR(R2)});txt(ctx,'0 V',200,236,PAL.muted,13);
  wire(ctx,[[200,125],[300,125]]);txt(ctx,'Vout',310,129,PAL.yellow,13,'left');
  ctx.fillStyle=PAL.raised;ctx.fillRect(380,40,40,180);const h=180*Vo/V;ctx.fillStyle=PAL.yellow;ctx.fillRect(380,220-h,40,h);txt(ctx,'Vin',400,34,PAL.muted,11);
  txt(ctx,'Vout = Vin × R2 ÷ (R1 + R2)',620,70,PAL.sky,17);txt(ctx,`= ${fV(V)} × ${fR(R2)} ÷ ${fR(R1+R2)}`,620,110,PAL.ink2,14);txt(ctx,'= '+fV(Vo),620,150,PAL.white,24);txt(ctx,`(${Math.round(Vo/V*100)} % of Vin)`,620,180,PAL.muted,13);}
// ---------- LED resistor ----------
const LC={v:2,col:'red'};(()=>{const box=$('ledCol');[['red',2,PAL.bad],['yellow',2.1,PAL.yellowSoft],['green',2.2,PAL.green],['blue',3,PAL.water],['white',3.1,'#f8fafc']].forEach(([n,v,c],i)=>{const b=document.createElement('button');b.textContent=n+' ('+v+' V)';b.style.borderLeft='6px solid '+c;if(i===0)b.className='active';
  b.onclick=()=>{LC.v=v;LC.col=n;box.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));upLR();};box.appendChild(b);});})();
function upLR(){const V=+$('lrV').value,I=+$('lrI').value/1000;const d=V-LC.v;if(d<=0){$('lrOut').innerHTML=`<p>⚠️ ${V} V is not enough for a ${LC.col} LED (${LC.v} V).</p>`;return;}const R=d/I,Rs=e12up(R),Ir=d/Rs,P=d*Ir;
  $('lrOut').innerHTML=`<p>R = (${V} − ${LC.v}) V ÷ ${(I*1000).toFixed(0)} mA = <b>${fR(R)}</b> → nearest standard value above: <b>${fR(Rs)}</b></p><p>Real current with ${fR(Rs)}: <b>${fI(Ir)}</b> · power in the resistor: <b>${fP(P)}</b> ${P>0.125?'⚠️ use ½ W':'(fine for ¼ W)'}</p>`;}
['lrV','lrI'].forEach(id=>$(id).addEventListener('input',upLR));upLR();
// ---------- RC ----------
function drawRC(t){const c=fv('cfRC');if(!c)return;const ctx=fctx(c);const R=e12near(Math.pow(10,+$('foRcR').value)),C=+$('foRcC').value,tau=R*C;
  const gx=60,gy=30,gw=500,gh=170;ctx.fillStyle=PAL.panel;ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle=PAL.line;ctx.strokeRect(gx,gy,gw,gh);
  for(let k=1;k<=5;k++){const x=gx+k/5*gw;ctx.strokeStyle=PAL.slateDark;ctx.beginPath();ctx.moveTo(x,gy);ctx.lineTo(x,gy+gh);ctx.stroke();txt(ctx,k+'τ',x,gy+gh+16,PAL.muted2,11);}
  ctx.strokeStyle=PAL.sky;ctx.lineWidth=2.5;ctx.beginPath();for(let i=0;i<=200;i++){const x=gx+i/200*gw,v=1-Math.exp(-i/200*5);const y=gy+gh-v*gh;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  const x1=gx+gw/5,y1=gy+gh-0.632*gh;ctx.fillStyle=PAL.yellow;ctx.beginPath();ctx.arc(x1,y1,5,0,7);ctx.fill();txt(ctx,'63 % after 1 τ',x1+8,y1+18,PAL.yellow,12,'left');
  const ph=(t%6)/5,px=gx+Math.min(1,ph)*gw,pv=1-Math.exp(-Math.min(1,ph)*5);ctx.fillStyle=PAL.white;ctx.beginPath();ctx.arc(px,gy+gh-pv*gh,4,0,7);ctx.fill();
  const fs=s=>s>=1?s.toPrecision(3)+' s':(s*1000).toPrecision(3)+' ms';
  txt(ctx,'τ = R × C',690,60,PAL.sky,18);txt(ctx,`= ${fR(R)} × ${C>=1e-3?'1000 µF':C*1e6+' µF'}`,690,95,PAL.ink2,14);txt(ctx,'= '+fs(tau),690,130,PAL.white,22);txt(ctx,'≈ full after 5τ = '+fs(5*tau),690,165,PAL.muted,13);
  txt(ctx,'as a 555 (R1 = 1 kΩ, R2 = R): '+(1.44/((1000+2*R)*C)).toPrecision(3)+' Hz',690,200,PAL.yellow,12);}
// ---------- battery ----------
const BTY={mah:500,v:9,name:'9 V battery'};(()=>{const box=$('btType');[['9 V battery',500,9],['4 × AA',2500,6],['18650 cell',3500,3.6],['USB power bank',10000,5]].forEach(([n,m,v],i)=>{const b=document.createElement('button');b.textContent=n+' ('+m+' mAh)';if(i===0)b.className='active';b.onclick=()=>{Object.assign(BTY,{mah:m,v,name:n});box.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));upBT();};box.appendChild(b);});})();
function upBT(){const I=Math.pow(10,+$('btI').value)/10;const h=BTY.mah/I;const real=h*0.7;const fmt=x=>x>=48?(x/24).toFixed(1)+' days':x>=1?x.toFixed(1)+' h':(x*60).toFixed(0)+' min';
  $('btOut').innerHTML=`<p>${BTY.name}: ${BTY.mah} mAh ÷ <b>${I<1?I.toFixed(2):I.toFixed(1)} mA</b> = <b>${fmt(h)}</b> in theory, about <b>${fmt(real)}</b> in practice.</p><p class="hint">Typical draws: LM35 alone 0.06 mA · 555 blinker ≈ 10 mA · LED dice ≈ 20 mA · two 7-segment displays ≈ 60–100 mA · Arduino ≈ 45 mA + displays.</p>`;}
$('btI').addEventListener('input',upBT);upBT();
// ---------- loop ----------
let lastFo=performance.now();
loop((dt,now)=>{const t=now/1000;drawBasics(t);drawOhm(t);drawPow(t);drawSP(t);drawDiv(t);drawRC(t);});
