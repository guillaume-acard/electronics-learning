
// ================= motion =================
(function(){
const PG=document.getElementById('page-motion');
// ---- probe recorder (wraps drawing helpers so schematics can be clicked) ----
let __PRoff=0;function __PR(ctx,r){if(__PRoff)return;const c=ctx&&ctx.canvas;if(!c)return;const f=window.__probeFrame||0;if(c.__recF!==f){c.__recF=f;c.__rec=[];}c.__rec.push(r);}
function __wrap(fn,rec){return function(){rec.apply(this,arguments);__PRoff++;try{return fn.apply(this,arguments);}finally{__PRoff--;}};}
const __V=/^(\+?\d+(\.\d+)?\s?V|0 V|GND)$/;
if(typeof W==='function')W=__wrap(W,(ctx,pts,col,lw)=>{if((col===undefined||col==='#cbd5e1')&&(lw===undefined||lw===3))__PR(ctx,{t:'wire',pts:pts.map(p=>[p[0],p[1]])});});
if(typeof arrowText==='function')arrowText=__wrap(arrowText,(ctx,t,x,y)=>{if(typeof t==='string'&&__V.test(t.trim()))__PR(ctx,{t:'txt',s:t.trim(),x,y});});
if(typeof wire==='function')wire=__wrap(wire,(ctx,pts)=>__PR(ctx,{t:'wire',pts:pts.map(p=>[p[0],p[1]])}));
if(typeof part==='function')part=__wrap(part,(ctx,k,ax,ay,bx,by,o={})=>__PR(ctx,{t:'part',k,a:[ax,ay],b:[bx,by],o:{label:o.label,closed:o.closed,burnt:o.burnt,rgb:o.rgb}}));
if(typeof npnQ==='function')npnQ=__wrap(npnQ,(ctx,x,y,on)=>__PR(ctx,{t:'npn',x,y,on:!!on}));
if(typeof npn==='function')npn=__wrap(npn,(ctx,x,y,on)=>__PR(ctx,{t:'npn',x,y,on:!!on}));
if(typeof chipBox==='function')chipBox=__wrap(chipBox,(ctx,x,y,w,h)=>__PR(ctx,{t:'chip',x,y,w,h}));
if(typeof resV==='function')resV=__wrap(resV,(ctx,x,y1,y2,label)=>__PR(ctx,{t:'part',k:'res',a:[x,y1],b:[x,y2],o:{label}}));
if(typeof capV==='function')capV=__wrap(capV,(ctx,x,y1,y2,label)=>__PR(ctx,{t:'part',k:'cap',a:[x,y1],b:[x,y2],o:{label}}));
if(typeof capH==='function')capH=__wrap(capH,(ctx,x1,x2,y,label)=>__PR(ctx,{t:'part',k:'cap',a:[x1,y],b:[x2,y],o:{label}}));
if(typeof batt==='function')batt=__wrap(batt,(ctx,x,y1,y2,label)=>__PR(ctx,{t:'part',k:'batt',a:[x,y1],b:[x,y2],o:{label}}));
if(typeof ledV==='function')ledV=__wrap(ledV,(ctx,x,y1,y2)=>__PR(ctx,{t:'part',k:'led',a:[x,y1],b:[x,y2],o:{}}));
if(typeof gndSym==='function')gndSym=__wrap(gndSym,(ctx,x,y)=>__PR(ctx,{t:'gnd',x,y}));
if(typeof resBox==='function')resBox=__wrap(resBox,(ctx,x,y,w,h,t)=>{const hz=w>h;__PR(ctx,{t:'part',k:'res',a:hz?[x,y+h/2]:[x+w/2,y],b:hz?[x+w,y+h/2]:[x+w/2,y+h],o:{label:t}});});

const requestAnimationFrame=cb=>window.requestAnimationFrame(function tick(t){if(PG.hidden)window.requestAnimationFrame(tick);else cb(t);});
const $ = id => document.getElementById(id);
function loopPath(ctx, x1, y1, x2, y2){ctx.beginPath(); ctx.moveTo(x1,(y1+y2)/2); ctx.lineTo(x1,y1); ctx.lineTo(x2,y1); ctx.lineTo(x2,y2); ctx.lineTo(x1,y2); ctx.closePath();}
function arrowText(ctx, txt, x, y, color='#94a3b8', size=14, align='center'){ctx.fillStyle=color; ctx.font=`600 ${size}px system-ui,sans-serif`; ctx.textAlign=align; ctx.fillText(txt,x,y);}
// ===== Helpers for schematics and plots =====
function W(ctx,pts,col='#cbd5e1',lw=3){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.lineJoin='round';ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();}
function dot(ctx,x,y){ctx.fillStyle='#cbd5e1';ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill();}
function resV(ctx,x,y1,y2,label){const m=(y1+y2)/2;W(ctx,[[x,y1],[x,m-24]]);ctx.beginPath();ctx.moveTo(x,m-24);for(let i=0;i<6;i++)ctx.lineTo(x+(i%2?-8:8),m-20+i*8);ctx.lineTo(x,m+24);ctx.stroke();W(ctx,[[x,m+24],[x,y2]]);if(label)arrowText(ctx,label,x+14,m+4,'#cbd5e1',12,'left');}
function capV(ctx,x,y1,y2,label,faded){const m=(y1+y2)/2,col=faded?'#475569':'#cbd5e1';W(ctx,[[x,y1],[x,m-6]],col);W(ctx,[[x,m+6],[x,y2]],col);ctx.fillStyle=col;ctx.fillRect(x-18,m-8,36,4);ctx.fillRect(x-18,m+4,36,4);if(label)arrowText(ctx,label,x+24,m+4,faded?'#94a3b8':'#2563eb',12,'left');}
function capH(ctx,x1,x2,y,label){const m=(x1+x2)/2;W(ctx,[[x1,y],[m-6,y]]);W(ctx,[[m+6,y],[x2,y]]);ctx.fillStyle='#cbd5e1';ctx.fillRect(m-8,y-18,4,36);ctx.fillRect(m+4,y-18,4,36);if(label)arrowText(ctx,label,m,y-26,'#2563eb',12);}
function batt(ctx,x,y1,y2,label){const m=(y1+y2)/2;W(ctx,[[x,y1],[x,m-6]]);W(ctx,[[x,m+6],[x,y2]]);ctx.fillStyle='#cbd5e1';ctx.fillRect(x-18,m-8,36,4);ctx.fillRect(x-10,m+4,20,6);arrowText(ctx,'+',x+22,m-6,'#dc2626',14);if(label)arrowText(ctx,label,x-24,m+4,'#cbd5e1',12,'right');}
function glow(ctx,x,y,b,col='255,80,60'){if(b<=0.01)return;const g=ctx.createRadialGradient(x,y,2,x,y,46);g.addColorStop(0,`rgba(${col},${0.9*b})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,46,0,7);ctx.fill();}
function ledV(ctx,x,y1,y2,b){const m=(y1+y2)/2;glow(ctx,x,m,b);W(ctx,[[x,y1],[x,m-10]]);W(ctx,[[x,m+10],[x,y2]]);ctx.fillStyle=b>0.05?`rgb(255,${Math.round(200-150*b)},${Math.round(200-160*b)})`:'#fff';ctx.strokeStyle='#cbd5e1';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x-12,m-10);ctx.lineTo(x+12,m-10);ctx.lineTo(x,m+10);ctx.closePath();ctx.fill();ctx.stroke();W(ctx,[[x-12,m+10],[x+12,m+10]]);arrowText(ctx,'LED',x+20,m+4,'#cbd5e1',12,'left');}
function gndSym(ctx,x,y){W(ctx,[[x-14,y],[x+14,y]]);W(ctx,[[x-9,y+6],[x+9,y+6]]);W(ctx,[[x-4,y+12],[x+4,y+12]]);}
function plot(ctx,x,y,w,h,hist,tNow,span,series,min,max,title){
  ctx.fillStyle='#1e293b';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#2a3650';ctx.lineWidth=1;ctx.strokeRect(x,y,w,h);
  if(title)arrowText(ctx,title,x+2,y-7,'#94a3b8',12,'left');
  const X=t=>x+w-(tNow-t)/span*w, Y=v=>y+h-(v-min)/(max-min)*h;
  if(min<0&&max>0){ctx.setLineDash([4,4]);ctx.strokeStyle='#94a3b8';ctx.beginPath();ctx.moveTo(x,Y(0));ctx.lineTo(x+w,Y(0));ctx.stroke();ctx.setLineDash([]);arrowText(ctx,'0',x-6,Y(0)+4,'#94a3b8',11,'right');}
  series.forEach(s=>{ctx.setLineDash(s.dash||[]);ctx.strokeStyle=s.col;ctx.lineWidth=s.lw||2.5;ctx.beginPath();let st=false;
    hist.forEach(p=>{if(p.t<tNow-span)return;const xx=X(p.t),yy=Y(Math.max(min,Math.min(max,p[s.k])));st?ctx.lineTo(xx,yy):(ctx.moveTo(xx,yy),st=true);});ctx.stroke();ctx.setLineDash([]);});
  let lx=x;series.forEach(s=>{if(!s.label)return;ctx.fillStyle=s.col;ctx.fillRect(lx,y+h+11,12,3);arrowText(ctx,s.label,lx+16,y+h+16,s.col,11,'left');lx+=ctx.measureText(s.label).width+32;});
  return {X,Y};
}
function choices(id,labels,init,cb){const el=$(id);el.style.display='inline-flex';el.style.gap='8px';el.style.flexWrap='wrap';
  const bs=labels.map((l,i)=>{const b=document.createElement('button');b.textContent=l;b.onclick=()=>{bs.forEach(x=>x.className='');b.className='active';cb(i);};el.appendChild(b);return b;});
  bs[init].className='active';cb(init);}
function prune(h,t,span){while(h.length&&h[0].t<t-span)h.shift();}

function wrapText(ctx,txt,x,y,maxW,lh,color='#e2e8f0',size=13){ctx.font=`600 ${size}px system-ui,sans-serif`;ctx.fillStyle=color;ctx.textAlign='left';
  let line='';txt.split(' ').forEach(w=>{const t=line?line+' '+w:w;if(ctx.measureText(t).width>maxW&&line){ctx.fillText(line,x,y);y+=lh;line=w;}else line=t;});if(line)ctx.fillText(line,x,y);}

const BG='#0b1220',WIRE='#cbd5e1',Y='#fbbf24';
function glowAt(ctx,x,y,b,rgb='239,68,68',r=46){if(b<=0.02)return;const g=ctx.createRadialGradient(x,y,2,x,y,r);g.addColorStop(0,`rgba(${rgb},${Math.min(1,b)})`);g.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();}
function txt(ctx,t,x,y,c='#94a3b8',s=12,a='center'){arrowText(ctx,t,x,y,c,s,a);}
function wire(ctx,pts,c=WIRE){W(ctx,pts,c,3);}
function dots(ctx,pts,off,c=Y){ctx.strokeStyle=c;ctx.lineWidth=7;ctx.lineCap='round';ctx.setLineDash([0,20]);ctx.lineDashOffset=-off;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.setLineDash([]);ctx.lineCap='butt';}
// Generic two-terminal part between A and B
function part(ctx,k,ax,ay,bx,by,o={}){
  const L=Math.hypot(bx-ax,by-ay),ang=Math.atan2(by-ay,bx-ax),mx=(ax+bx)/2,my=(ay+by)/2,col=o.col||WIRE,hor=Math.abs(Math.cos(ang))>0.5;
  if(k==='led')glowAt(ctx,mx,my,o.glow||0,o.rgb||'239,68,68');
  if(k==='lamp')glowAt(ctx,mx,my,o.glow||0,'250,204,21',60);
  ctx.save();ctx.translate(mx,my);ctx.rotate(ang);ctx.strokeStyle=col;ctx.lineWidth=3;ctx.fillStyle=BG;
  const lead=(x1,x2)=>{ctx.beginPath();ctx.moveTo(x1,0);ctx.lineTo(x2,0);ctx.stroke();};
  switch(k){
    case 'wire':lead(-L/2,L/2);break;
    case 'empty':ctx.setLineDash([3,6]);ctx.strokeStyle='#475569';lead(-L/2,L/2);ctx.setLineDash([]);break;
    case 'res':case 'ldr':lead(-L/2,-22);lead(22,L/2);ctx.fillRect(-22,-9,44,18);ctx.strokeRect(-22,-9,44,18);
      if(k==='ldr'){ctx.strokeStyle=Y;ctx.lineWidth=1.8;[[-10,0],[2,0]].forEach(([dx])=>{ctx.beginPath();ctx.moveTo(dx-12,-28);ctx.lineTo(dx,-14);ctx.stroke();ctx.beginPath();ctx.moveTo(dx,-14);ctx.lineTo(dx-6,-15);ctx.lineTo(dx-2,-20);ctx.closePath();ctx.fillStyle=Y;ctx.fill();});}break;
    case 'cap':lead(-L/2,-5);lead(5,L/2);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-5,-16);ctx.lineTo(-5,16);ctx.moveTo(5,-16);ctx.lineTo(5,16);ctx.stroke();break;
    case 'diode':case 'led':lead(-L/2,-12);lead(12,L/2);ctx.fillStyle=o.burnt?'#1c1917':(k==='led'&&o.glow>0.05?`rgba(${o.rgb||'239,68,68'},${0.4+0.6*Math.min(1,o.glow)})`:BG);
      ctx.beginPath();ctx.moveTo(-12,-12);ctx.lineTo(12,0);ctx.lineTo(-12,12);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(12,-12);ctx.lineTo(12,12);ctx.stroke();
      if(k==='led'){ctx.strokeStyle=Y;ctx.lineWidth=1.5;[[0],[8]].forEach(([d])=>{ctx.beginPath();ctx.moveTo(d-2,-16);ctx.lineTo(d+6,-26);ctx.stroke();});}break;
    case 'gap':ctx.setLineDash([5,4]);ctx.strokeStyle=Y;ctx.lineWidth=2;lead(-L/2,-28);lead(28,L/2);ctx.strokeRect(-28,-20,56,40);ctx.setLineDash([]);break;
    case 'switch':lead(-L/2,-16);lead(16,L/2);ctx.fillStyle=col;[-16,16].forEach(x=>{ctx.beginPath();ctx.arc(x,0,4,0,7);ctx.fill();});ctx.beginPath();ctx.moveTo(-16,0);o.closed?ctx.lineTo(16,0):ctx.lineTo(13,-15);ctx.stroke();break;
    case 'motor':lead(-L/2,-20);lead(20,L/2);ctx.beginPath();ctx.arc(0,0,20,0,7);ctx.fill();ctx.stroke();ctx.save();ctx.rotate(o.spin||0);ctx.strokeStyle='#60a5fa';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.rotate(2.09);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(14,0);ctx.stroke();}ctx.restore();break;
    case 'lamp':lead(-L/2,-16);lead(16,L/2);ctx.beginPath();ctx.arc(0,0,16,0,7);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-11,-11);ctx.lineTo(11,11);ctx.moveTo(11,-11);ctx.lineTo(-11,11);ctx.stroke();break;
    case 'batt':lead(-L/2,-6);lead(6,L/2);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-6,-18);ctx.lineTo(-6,18);ctx.stroke();ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(6,-9);ctx.lineTo(6,9);ctx.stroke();break;
    case 'coil':lead(-L/2,-28);lead(28,L/2);ctx.beginPath();for(let i=0;i<4;i++){ctx.arc(-21+i*14,0,7,Math.PI,0);}ctx.stroke();if(o.core){ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-28,-12);ctx.lineTo(28,-12);ctx.moveTo(-28,-16);ctx.lineTo(28,-16);ctx.stroke();}break;
    case 'pot':lead(-L/2,-22);lead(22,L/2);ctx.fillRect(-22,-9,44,18);ctx.strokeRect(-22,-9,44,18);ctx.strokeStyle=Y;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-14,16);ctx.lineTo(14,-16);ctx.stroke();ctx.beginPath();ctx.moveTo(14,-16);ctx.lineTo(6,-14);ctx.lineTo(12,-8);ctx.closePath();ctx.fillStyle=Y;ctx.fill();break;
    case 'ac':lead(-L/2,-20);lead(20,L/2);ctx.beginPath();ctx.arc(0,0,20,0,7);ctx.fill();ctx.stroke();ctx.beginPath();for(let i=0;i<=20;i++){const x=-12+i*1.2,yy=-7*Math.sin(i/20*6.28);i?ctx.lineTo(yy,x):ctx.moveTo(yy,x);}ctx.stroke();break;
  }
  ctx.restore();
  if(k==='gap')txt(ctx,o.slot?o.slot:'?',mx,my+7,Y,20);
  if(k==='motor')txt(ctx,'M',mx,my+5,'#e2e8f0',13);
  if(k==='batt'){const px=ax+(bx-ax)*0.5,py=ay+(by-ay)*0.5;txt(ctx,'+',hor?px-14:px+16,hor?py-22:py-12+(o.flip?28:0),'#f87171',15);}
  if(k==='led'&&o.burnt)txt(ctx,'💥',mx+(hor?0:26),my+(hor?-26:6),'#fff',16);
  if(o.label){if(hor)txt(ctx,o.label,mx,my-28,o.lc||'#e2e8f0',12);else txt(ctx,o.label,mx+(o.left?-30:30),my+4,o.lc||'#e2e8f0',12,o.left?'right':'left');}
}
function chipBox(ctx,x,y,w,h,l1,l2,hot=0){ctx.fillStyle=hot>0.3?`rgb(${Math.round(71+160*hot)},60,60)`:'#475569';ctx.fillRect(x,y,w,h);txt(ctx,l1,x+w/2,y+h/2-2,'#fff',13);if(l2)txt(ctx,l2,x+w/2,y+h/2+16,'#fff',13);}
function npnQ(ctx,x,y,on){const c=on?'#10b981':WIRE;ctx.strokeStyle=c;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(x,y,24,0,7);ctx.stroke();
  W(ctx,[[x-34,y],[x-8,y]],c);W(ctx,[[x-8,y-14],[x-8,y+14]],c,4);W(ctx,[[x-8,y-6],[x+10,y-18],[x+10,y-34]],c);W(ctx,[[x-8,y+6],[x+10,y+18],[x+10,y+34]],c);
  ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x+10,y+18);ctx.lineTo(x,y+17);ctx.lineTo(x+5,y+9);ctx.fill();}
function miniGraph(ctx,x,y,w,h,fn,t0,t1,col,min,max,label){ctx.fillStyle='#1e293b';ctx.fillRect(x,y,w,h);ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();
  for(let px=0;px<=w;px++){const t=t0+(t1-t0)*px/w,v=fn(t);if(v===null)continue;const yy=y+h-(Math.max(min,Math.min(max,v))-min)/(max-min)*h;px?ctx.lineTo(x+px,yy):ctx.moveTo(x+px,yy);}ctx.stroke();if(label)txt(ctx,label,x+4,y-6,'#94a3b8',11,'left');}
const fmtOhm=r=>r>=1e6?+(r/1e6).toFixed(2)+' MΩ':r>=1000?+(r/1000).toFixed(r<10000?2:1)+' kΩ':Math.round(r)+' Ω';
const E12=[1,1.2,1.5,1.8,2.2,2.7,3.3,3.9,4.7,5.6,6.8,8.2];
const snapE12=v=>{const d=Math.pow(10,Math.floor(Math.log10(v)));let best=d;E12.forEach(e=>{if(Math.abs(Math.log(e*d/v))<Math.abs(Math.log(best/v)))best=e*d;});if(Math.abs(Math.log(10*d/v))<Math.abs(Math.log(best/v)))best=10*d;return best;};



// ===== 3. Buzzers: active vs passive =====
const BZ={kind:1,dc:false,click:0,lastDC:false};
choices('bzKind',['Active buzzer','Passive buzzer'],1,i=>{BZ.kind=i;});
$('bzDC').onclick=()=>{BZ.dc=true;BZ.click=0.4;$('bzDC').className='active';$('bzSQ').className='';};
$('bzSQ').onclick=()=>{BZ.dc=false;$('bzSQ').className='active';$('bzDC').className='';};
const NOTE=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const noteOf=f=>{const n=Math.round(12*Math.log2(f/440))+57;return NOTE[(n%12+12)%12]+Math.floor(n/12);};
let AC=null;
$('bzPlay').onclick=()=>{try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();}catch(e){return;}
  const t0=AC.currentTime,gn=AC.createGain();gn.connect(AC.destination);gn.gain.setValueAtTime(0,t0);
  const beep=(f,a,b)=>{const o=AC.createOscillator();o.type='square';o.frequency.value=f;o.connect(gn);o.start(t0+a);o.stop(t0+b);};
  const f=+$('bzF').value;
  if(BZ.kind===0&&BZ.dc){beep(2300,0,1);gn.gain.setValueAtTime(0.04,t0);gn.gain.setValueAtTime(0,t0+1);}
  else if(BZ.kind===0){beep(2300,0,1);for(let i=0;i<5;i++){gn.gain.setValueAtTime(0.04,t0+i*0.2);gn.gain.setValueAtTime(0,t0+i*0.2+0.1);}}
  else if(BZ.dc){beep(1500,0,0.02);gn.gain.setValueAtTime(0.08,t0);gn.gain.linearRampToValueAtTime(0,t0+0.02);}
  else{beep(f,0,1);gn.gain.setValueAtTime(0.04,t0);gn.gain.setValueAtTime(0,t0+1);}};
function drawBuzz(dt,t){const c=$('cBuzz'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const f=+$('bzF').value,act=BZ.kind===0;BZ.click=Math.max(0,BZ.click-dt);
  // input waveform
  txt(ctx,'What you feed it',140,26,'#94a3b8',12);ctx.fillStyle='#111c2e';ctx.fillRect(30,40,220,110);
  ctx.strokeStyle=Y;ctx.lineWidth=2.5;ctx.beginPath();
  if(BZ.dc){ctx.moveTo(30,140);ctx.lineTo(60,140);ctx.lineTo(60,60);ctx.lineTo(250,60);}
  else{const per=act?60:60*Math.pow(200/f,0.66);for(let x=0;x<=220;x++){const v=((x+t*40)%per)<per/2?1:0;const y=v?60:140;x?ctx.lineTo(30+x,y):ctx.moveTo(30+x,y);}}
  ctx.stroke();txt(ctx,BZ.dc?'steady 5 V (DC)':act?'switched on/off (slow square wave)':'square wave, '+f+' Hz',140,172,Y,12);
  // the buzzer
  const bx=380,by=95;ctx.fillStyle='#111827';ctx.beginPath();ctx.arc(bx,by,48,0,7);ctx.fill();ctx.strokeStyle='#475569';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='#0b1220';ctx.beginPath();ctx.arc(bx,by,7,0,7);ctx.fill();
  txt(ctx,act?'ACTIVE':'PASSIVE',bx,by+70,act?'#f472b6':'#38bdf8',13);txt(ctx,act?'oscillator inside':'no oscillator',bx,by+88,'#94a3b8',11);
  if(act){ctx.fillStyle='#1e293b';ctx.fillRect(bx-26,by+18,52,14);txt(ctx,'osc',bx,by+29,'#f472b6',10);}
  wire(ctx,[[250,100],[332,100]],'#64748b');
  // what comes out
  let mode,msg,pitch=0;
  if(act&&BZ.dc){mode='beep';pitch=2300;msg='Beeeeep! Its own oscillator: always ~2.3 kHz';}
  else if(act){mode='chop';pitch=2300;msg='Beep-beep-beep: your signal only switches it on and off; the pitch stays 2.3 kHz';}
  else if(BZ.dc){mode='click';msg='Click... then silence: DC bends the disc once and holds it';}
  else{mode='tone';pitch=f;msg=`A ${f} Hz tone (≈ note ${noteOf(f)}): you choose the pitch`;}
  const on=mode==='beep'||mode==='tone'||(mode==='chop'&&(t*2.5%1)<0.5)||(mode==='click'&&BZ.click>0);
  if(on){const sp=mode==='click'?40:Math.max(9,60-pitch/80);ctx.lineWidth=3;
    for(let i=0;i<8;i++){const r=60+((t*(mode==='click'?60:90))%sp)+i*sp;if(r>330)break;ctx.strokeStyle=`rgba(244,114,182,${Math.max(0,0.9-r/360)})`;ctx.beginPath();ctx.arc(bx,by,r,-0.6,0.6);ctx.stroke();}}
  txt(ctx,msg,400,226,on||mode==='click'?'#e2e8f0':'#94a3b8',14);
  if(mode==='tone')txt(ctx,'higher frequency = rings closer together = higher note',400,248,'#64748b',11);}

// ===== 4. Speaker =====
const SP={dc:false,heat:0};
$('spDC').onclick=()=>{SP.dc=!SP.dc;$('spDC').className=SP.dc?'active':'';$('spDC').textContent=SP.dc?'〰 Back to audio':'⚡ Apply 9 V DC';};
function drawSpk(dt,t){const c=$('cSpk'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const f=+$('spF').value,vol=+$('spV').value;SP.heat=Math.max(0,Math.min(1,SP.heat+(SP.dc?dt*0.35:-dt*0.2)));
  const disp=SP.dc?1:vol*Math.sin(2*Math.PI*f*t),cy=135,mx=180,dx=disp*16;
  // input signal
  txt(ctx,SP.dc?'input: 9 V DC':'input: audio (AC)',70,22,'#94a3b8',11);ctx.strokeStyle=SP.dc?'#ef4444':Y;ctx.lineWidth=2;ctx.beginPath();
  for(let x=0;x<=110;x++){const v=SP.dc?1:vol*Math.sin(2*Math.PI*f*(t-(110-x)/220));const y=60-v*22;x?ctx.lineTo(15+x,y):ctx.moveTo(15+x,y);}ctx.stroke();
  // magnet
  ctx.fillStyle='#475569';ctx.fillRect(mx-110,cy-55,70,110);ctx.fillStyle='#ef4444';ctx.fillRect(mx-110,cy-55,70,24);ctx.fillStyle='#3b82f6';ctx.fillRect(mx-110,cy+31,70,24);
  txt(ctx,'N',mx-75,cy-38,'#fff',12);txt(ctx,'S',mx-75,cy+48,'#fff',12);txt(ctx,'magnet',mx-75,cy+75,'#94a3b8',11);
  // coil
  const hot=SP.heat;ctx.fillStyle=hot>0.05?`rgb(${180+75*hot},${120-80*hot},${40})`:'#d97706';ctx.fillRect(mx-40+dx,cy-26,26,52);
  for(let i=0;i<6;i++){ctx.strokeStyle='#78350f';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(mx-40+dx,cy-22+i*9);ctx.lineTo(mx-14+dx,cy-22+i*9);ctx.stroke();}
  txt(ctx,'coil',mx-27+dx,cy-34,'#fbbf24',11);
  // cone
  ctx.fillStyle='#cbd5e1';ctx.beginPath();ctx.moveTo(mx-14+dx,cy-24);ctx.lineTo(mx+56+dx,cy-95);ctx.lineTo(mx+62+dx,cy-95);ctx.lineTo(mx+62+dx,cy+95);ctx.lineTo(mx+56+dx,cy+95);ctx.lineTo(mx-14+dx,cy+24);ctx.closePath();ctx.globalAlpha=0.85;ctx.fill();ctx.globalAlpha=1;
  ctx.strokeStyle='#64748b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mx+62,cy-105);ctx.lineTo(mx+62,cy-95);ctx.moveTo(mx+62,cy+95);ctx.lineTo(mx+62,cy+105);ctx.stroke();txt(ctx,'cone',mx+30+dx,cy+118,'#94a3b8',11);
  // air
  const c0=mx+70;for(let x=c0;x<780;x+=12){const d=SP.dc?0:vol*Math.sin(2*Math.PI*f*(t-(x-c0)/220))*7;const dens=SP.dc?0.25:0.25+0.5*Math.max(0,vol*Math.cos(2*Math.PI*f*(t-(x-c0)/220)));
    ctx.fillStyle=`rgba(56,189,248,${dens})`;for(let y=cy-90;y<=cy+90;y+=14)ctx.fillRect(x+d,y+((x/12)%2)*7,3,3);}
  if(SP.dc){txt(ctx,'9 V ÷ 8 Ω ≈ 1.1 A of DC: the cone just sticks out, no sound,',530,cy-8,'#ef4444',13);txt(ctx,'and the thin coil heats up '+Math.round(25+SP.heat*120)+' °C',530,cy+12,'#ef4444',13);}
  else txt(ctx,'cone pushes → air squeezed (dense) · cone pulls → air thinned',530,262,'#94a3b8',11);}

// ===== 5. DC motor =====
const MO={rpm:0,ang:0};
function drawMotor(dt){const c=$('cMotor'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const V=+$('moV').value,Ld=+$('moL').value,R=4,Ke=9/9200,I0=0.15;
  const Ist=V/R,I=V/R<I0?V/R:I0+Ld*(Ist-I0),target=Math.max(0,(V-I*R)/Ke);
  MO.rpm+=(target-MO.rpm)*Math.min(1,dt*3);MO.ang+=MO.rpm/9200*4*2*Math.PI*dt;
  const emf=MO.rpm*Ke,Inow=V>0?Math.max(0,(V-emf)/R):0,stall=Ld>0.95&&V>1;
  // motor cross-section
  const cx=170,cy=150;ctx.fillStyle='#1f2937';ctx.beginPath();ctx.arc(cx,cy,110,0,7);ctx.fill();ctx.strokeStyle='#475569';ctx.lineWidth=3;ctx.stroke();
  ctx.lineWidth=22;ctx.strokeStyle='#ef4444';ctx.beginPath();ctx.arc(cx,cy,92,Math.PI*0.7,Math.PI*1.3);ctx.stroke();ctx.strokeStyle='#3b82f6';ctx.beginPath();ctx.arc(cx,cy,92,-Math.PI*0.3,Math.PI*0.3);ctx.stroke();
  txt(ctx,'N',cx-92,cy+5,'#fff',14);txt(ctx,'S',cx+92,cy+5,'#fff',14);
  for(let k=0;k<3;k++){const a=MO.ang+k*2*Math.PI/3;const pole=Math.cos(a)>0?'#ef4444':'#3b82f6';
    ctx.save();ctx.translate(cx,cy);ctx.rotate(a);ctx.fillStyle='#94a3b8';ctx.fillRect(10,-6,48,12);ctx.fillStyle=V>0.3?pole:'#64748b';ctx.beginPath();ctx.arc(64,0,16,-Math.PI/2,Math.PI/2);ctx.lineTo(56,16);ctx.lineTo(56,-16);ctx.fill();
    ctx.strokeStyle='#d97706';ctx.lineWidth=2;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(20+i*7,-9);ctx.lineTo(20+i*7,9);ctx.stroke();}ctx.restore();}
  ctx.fillStyle='#b45309';ctx.beginPath();ctx.arc(cx,cy,12,0,7);ctx.fill();ctx.fillStyle='#111';ctx.fillRect(cx-16,cy-4,8,8);ctx.fillRect(cx+8,cy-4,8,8);
  txt(ctx,'rotor coils (spinning)',cx,cy+132,'#94a3b8',11);txt(ctx,'brushes + commutator in the middle',cx,cy+148,'#64748b',10);
  // readouts
  const x0=360,bar=(y,lab,val,max,unit,col,fmt)=>{txt(ctx,lab,x0,y,'#cbd5e1',13,'left');ctx.fillStyle='#1e293b';ctx.fillRect(x0,y+8,300,14);ctx.fillStyle=col;ctx.fillRect(x0,y+8,300*Math.min(1,val/max),14);txt(ctx,fmt(val)+' '+unit,x0+310,y+20,col,13,'left');};
  bar(40,'Speed',MO.rpm,9200,'rpm','#60a5fa',v=>Math.round(v));
  bar(95,'Current',Inow,2.25,'A','#fbbf24',v=>v.toFixed(2));
  bar(150,'Back-EMF (the motor acting as a generator)',emf,9,'V','#a78bfa',v=>v.toFixed(1));
  txt(ctx,`battery ${V.toFixed(1)} V = back-EMF ${emf.toFixed(1)} V + current × coil resistance (${Inow.toFixed(2)} A × 4 Ω)`,x0,215,'#94a3b8',12,'left');
  const msg=V<0.6?'Too little voltage: it can\'t overcome friction, it doesn\'t start':stall?'STALLED: no back-EMF, maximum current. It heats up fast!':Ld<0.2?'Spinning freely: high back-EMF, little current':'Loaded: it slows down, the back-EMF drops, the current rises';
  txt(ctx,msg,x0,250,stall?'#ef4444':V<0.6?'#94a3b8':'#10b981',14,'left');}

let lastM=performance.now();
function frameM(now){const dt=Math.min(0.05,(now-lastM)/1000);lastM=now;const t=now/1000;drawBuzz(dt,t);drawSpk(dt,t);drawMotor(dt);requestAnimationFrame(frameM);}
requestAnimationFrame(frameM);

})();
