
// ================= relay =================
(function(){
const PG=document.getElementById('page-relay');
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



// relay mechanism: coil at left, arm from pivot; a=0 rest (NC), a=1 pulled (NO)
function relayMech(ctx,x,y,a,on,scale=1){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  ctx.fillStyle='#334155';ctx.fillRect(0,-10,46,80);ctx.strokeStyle=on?'#f59e0b':'#b45309';ctx.lineWidth=2.5;for(let i=0;i<9;i++){ctx.beginPath();ctx.moveTo(-4,-4+i*8);ctx.lineTo(50,0+i*8);ctx.stroke();}
  ctx.fillStyle='#64748b';ctx.fillRect(14,-22,18,12);
  if(on){ctx.strokeStyle='rgba(245,158,11,.5)';ctx.lineWidth=1.5;for(let i=1;i<=3;i++){ctx.beginPath();ctx.ellipse(23,30,30+i*10,50+i*8,0,0,7);ctx.stroke();}}
  // pivot & arm
  const px=-10,py=-36,ang=-0.12+a*0.16;ctx.fillStyle='#e2e8f0';ctx.beginPath();ctx.arc(px,py,5,0,7);ctx.fill();
  ctx.save();ctx.translate(px,py);ctx.rotate(ang);ctx.fillStyle='#cbd5e1';ctx.fillRect(0,-3,190,6);ctx.restore();
  const ex=px+190*Math.cos(ang),ey=py+190*Math.sin(ang);
  // contacts
  ctx.fillStyle='#fca5a5';ctx.fillRect(170,-72,24,8);ctx.fillStyle='#86efac';ctx.fillRect(170,-12,24,8);
  ctx.restore();return {nc:[x+182*scale,y-72*scale],no:[x+182*scale,y-4*scale],com:[x+px*scale,y+py*scale],tip:[x+ex*scale,y+ey*scale]};}

// ===== 3. Hysteresis demo =====
const RL={on:false,a:0,click:0};
function drawRelay(dt){const V=+$('rlV').value;$('rlVt').textContent=V.toFixed(2)+' V';
  if(!RL.on&&V>=3.75){RL.on=true;RL.click=0.5;}if(RL.on&&V<1){RL.on=false;RL.click=0.5;}
  RL.a+=((RL.on?1:0)-RL.a)*Math.min(1,dt*25);RL.click=Math.max(0,RL.click-dt);
  const c=$('cRelay'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  // coil supply
  part(ctx,'batt',90,90,90,250,{label:V.toFixed(1)+' V',left:true});wire(ctx,[[90,90],[200,90],[200,140]]);wire(ctx,[[90,250],[200,250],[200,210]]);
  const m=relayMech(ctx,200,140,RL.a,RL.on);txt(ctx,'coil',223,240,'#f59e0b',12);
  txt(ctx,'COM',m.com[0]-12,m.com[1]+4,'#e2e8f0',11,'right');txt(ctx,'NC',m.nc[0]+26,m.nc[1]+8,'#fca5a5',12,'left');txt(ctx,'NO',m.no[0]+26,m.no[1]+8,'#86efac',12,'left');
  if(RL.click>0)txt(ctx,'CLICK!',300,40,Y,20);
  // lamp side
  const lx=560;wire(ctx,[[m.com[0],m.com[1]],[m.com[0],30],[740,30],[740,80]],'#a78bfa');part(ctx,'batt',740,80,740,280,{label:'12 V'});wire(ctx,[[740,280],[lx,280]],'#a78bfa');
  wire(ctx,[[m.nc[0]+12,m.nc[1]],[lx-40,m.nc[1]],[lx-40,100]],'#a78bfa');part(ctx,'lamp',lx-40,100,lx-40,160,{glow:RL.on?0:1});wire(ctx,[[lx-40,160],[lx-40,280],[lx,280]],'#a78bfa');
  wire(ctx,[[m.no[0]+12,m.no[1]],[lx+60,m.no[1]],[lx+60,180]],'#a78bfa');part(ctx,'lamp',lx+60,180,lx+60,240,{glow:RL.on?1:0});wire(ctx,[[lx+60,240],[lx+60,280],[lx-40,280]],'#a78bfa');
  txt(ctx,'NC lamp',lx-40,186,'#fca5a5',11);txt(ctx,'NO lamp',lx+60,262,'#86efac',11);
  txt(ctx,'separate 12 V circuit',650,312,'#a78bfa',11);
  // threshold bar
  const bx=120,by=300,bw=300;ctx.fillStyle='#1e293b';ctx.fillRect(bx,by-8,bw,8);ctx.fillStyle=RL.on?'#10b981':'#64748b';ctx.fillRect(bx,by-8,bw*V/6,8);
  [[1,'drop-out 1 V'],[3.75,'pull-in 3.75 V']].forEach(([v,l])=>{const xx=bx+bw*v/6;ctx.fillStyle=Y;ctx.fillRect(xx-1,by-14,2,20);txt(ctx,l,xx,by+18,Y,10);});}

// ===== 4A. Pin → transistor → relay → lamp =====
const RA={pin:false,full:1,a:0,hot:0};
choices('raChoices',['Pin drives the coil directly','With transistor + diode'],1,i=>RA.full=i);
$('raPin').onclick=()=>{RA.pin=!RA.pin;$('raPin').textContent='Pin: '+(RA.pin?'HIGH':'LOW');$('raPin').className=RA.pin?'active':'';};
function drawRA(dt){const pulled=RA.pin&&RA.full;RA.a+=((pulled?1:0)-RA.a)*Math.min(1,dt*25);RA.hot+=((RA.pin&&!RA.full?1:0)-RA.hot)*dt*1.5;
  const c=$('cRA'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  chipBox(ctx,30,120,100,90,'micro-','controller',RA.hot);txt(ctx,'pin',135,160,Y,11,'left');
  const cx=300;wire(ctx,[[cx,30],[cx,60]],'#f87171');txt(ctx,'+5 V',cx,22,'#f87171',11);
  if(RA.full){wire(ctx,[[130,170],[170,170]]);part(ctx,'res',170,170,230,170,{label:'1 kΩ'});wire(ctx,[[230,170],[256,170]]);npnQ(ctx,290,170,RA.pin);
    part(ctx,'coil',cx,60,cx,136,{label:'coil'});wire(ctx,[[cx,204],[cx,270],[80,270],[80,210]]);
    wire(ctx,[[cx,64],[cx-60,64],[cx-60,82]]);part(ctx,'diode',cx-60,130,cx-60,82,{col:'#10b981'});wire(ctx,[[cx-60,130],[cx-60,136],[cx,136]]);txt(ctx,'flyback',cx-66,108,'#10b981',10,'right');}
  else{wire(ctx,[[130,170],[cx,170],[cx,136]]);part(ctx,'coil',cx,60,cx,136,{label:'coil'});wire(ctx,[[80,210],[80,270],[cx,270]]);}
  txt(ctx,'common ground',190,290,'#60a5fa',11);
  // relay switch side
  const m=relayMech(ctx,430,140,RA.a,pulled,0.75);ctx.setLineDash([4,4]);ctx.strokeStyle='#64748b';ctx.beginPath();ctx.moveTo(cx+24,100);ctx.lineTo(430,140);ctx.stroke();ctx.setLineDash([]);
  txt(ctx,'magnet pulls the arm',470,215,'#94a3b8',11);
  wire(ctx,[[m.com[0],m.com[1]],[m.com[0],40],[760,40],[760,80]],'#a78bfa');part(ctx,'batt',760,80,760,270,{label:'12 V',left:true});
  wire(ctx,[[m.no[0]+9,m.no[1]],[680,m.no[1]],[680,170]],'#a78bfa');part(ctx,'lamp',680,170,680,230,{glow:pulled?1:0});wire(ctx,[[680,230],[680,270],[760,270]],'#a78bfa');
  txt(ctx,'lamp circuit (isolated)',700,295,'#a78bfa',11);
  let msg,col;if(!RA.pin){msg='Pin LOW: relay off';col='#94a3b8';}else if(RA.full){msg='Click! Lamp on ✓';col='#10b981';}else{msg='The pin can\'t supply ~70 mA: the relay doesn\'t pull in, and the chip heats ✗';col='#ef4444';}
  txt(ctx,msg,400,22,col,13);}

// ===== 4B. Latch =====
const LB={start:false,stop:false,on:false,a:0};
[['lbStart','start'],['lbStop','stop']].forEach(([id,k])=>{const b=$(id);b.style.touchAction='none';b.style.userSelect='none';b.addEventListener('pointerdown',e=>{e.preventDefault();LB[k]=true;});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>LB[k]=false));});
function drawLatch(dt){LB.on=!LB.stop&&(LB.start||LB.on);LB.a+=((LB.on?1:0)-LB.a)*Math.min(1,dt*25);
  const c=$('cLatch'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const T=50,B=250;wire(ctx,[[40,T],[400,T]],'#f87171');txt(ctx,'+12 V',36,T+4,'#f87171',12,'right');wire(ctx,[[40,B],[760,B]],'#60a5fa');txt(ctx,'0 V',36,B+4,'#60a5fa',12,'right');
  // STOP (NC) then node, START (NO) then coil; hold contact parallel to START
  wire(ctx,[[100,T],[100,70]]);part(ctx,'switch',100,70,100,120,{closed:!LB.stop,label:'STOP (NC)',col:'#fca5a5',left:true});wire(ctx,[[100,120],[100,140],[160,140]]);dot(ctx,160,140);
  part(ctx,'switch',160,140,260,140,{closed:LB.start,label:'START (NO)',col:'#86efac'});
  wire(ctx,[[160,140],[160,200]]);part(ctx,'switch',160,200,260,200,{closed:LB.on,label:'relay contact (hold)',col:'#fbbf24'});wire(ctx,[[260,200],[260,140]]);dot(ctx,260,140);
  wire(ctx,[[260,140],[320,140]]);part(ctx,'coil',320,140,320,230,{label:'relay coil'});wire(ctx,[[320,230],[320,B]]);
  if(LB.on)dots(ctx,[[100,T],[100,140],[LB.start?160:160,LB.start?140:140],...(LB.start?[[260,140]]:[[160,200],[260,200],[260,140]]),[320,140],[320,B]],performance.now()/15);
  // second contact drives a motor/lamp
  const m=relayMech(ctx,470,150,LB.a,LB.on,0.6);ctx.setLineDash([4,4]);ctx.strokeStyle='#64748b';ctx.beginPath();ctx.moveTo(340,180);ctx.lineTo(470,170);ctx.stroke();ctx.setLineDash([]);
  wire(ctx,[[m.com[0],m.com[1]],[m.com[0],T],[400,T]],'#f87171');wire(ctx,[[m.no[0]+7,m.no[1]],[700,m.no[1]],[700,160]]);part(ctx,'lamp',700,160,700,220,{glow:LB.on?1:0});wire(ctx,[[700,220],[700,B]]);
  txt(ctx,LB.on?(LB.start?'START pressed: ON':'released, but it holds itself ON (memory!)'):(LB.stop?'STOP pressed: loop broken, OFF':'OFF'),560,30,LB.on?'#10b981':'#94a3b8',13);}

let lastR2=performance.now();
function frameRl(now){const dt=Math.min(0.05,(now-lastR2)/1000);lastR2=now;drawRelay(dt);drawRA(dt);drawLatch(dt);requestAnimationFrame(frameRl);}
requestAnimationFrame(frameRl);

})();
