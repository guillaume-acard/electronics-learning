// ===== Build lab: the breadboard model =====
// A placed part: {id, type, holes:{pin:hole}, rot, props, burnt}. A wire: {id, a:hole, b:hole, color}.
// Holes use the names of the real board (see shared/js/breadboard.js): 'a10', 'tp3'...
const ROWS=['tp','tn','a','b','c','d','e','f','g','h','i','j','bp','bn'];
const holeName=(r,c)=>ROWS[r]+c;
function parseHole(h){const m=/^(tp|tn|bp|bn|[a-j])(\d+)$/.exec(h||'');return m?{r:ROWS.indexOf(m[1]),c:+m[2]}:null;}
function holeExists(r,c){if(r<0||r>=ROWS.length||c<1||c>60)return false;return !(ROWS[r].length===2&&c%6===0);}   // rails skip every 6th
// the strip a hole belongs to: one per column for a–e and f–j, one per rail
function stripOf(h){const q=parseHole(h);const R=ROWS[q.r];return R.length===2?R:(q.r<=6?'T':'B')+q.c;}
function rotOff([dr,dc],rot){for(let k=0;k<rot;k++)[dr,dc]=[dc,-dr];return [dr,dc];}

// holes used by a part type placed at anchor (r,c) with rotation rot (null if it doesn't fit on the board)
function footHoles(type,r,c,rot){const T=PARTS[type];
  if(T.fixed)return {...T.fixed};
  const out={};for(let i=0;i<T.foot.length;i++){const [dr,dc]=rotOff(T.foot[i],rot);if(!holeExists(r+dr,c+dc))return null;out[T.pins[i]]=holeName(r+dr,c+dc);}
  return out;}
// anchor (r,c) so that the part is centred on the hole nearest to (x,y), following the part's placement rule
function anchorFor(type,x,y,rot){const T=PARTS[type],nh=nearestHole(x,y,999);if(!nh)return null;
  if(T.fixed)return {r:0,c:1};
  if(T.anchor==='rails')return {r:y<213?0:12,c:Math.max(1,Math.min(59,nh.c))};
  if(T.anchor==='e'||T.anchor==='f'){const w=Math.max(...T.foot.map(o=>o[1]));return {r:ROWS.indexOf(T.anchor),c:Math.max(1,Math.min(60-w,nh.c-Math.floor(w/2)))};}
  const offs=T.foot.map(o=>rotOff(o,rot));const mr=Math.round(offs.reduce((s,o)=>s+o[0],0)/offs.length),mc=Math.round(offs.reduce((s,o)=>s+o[1],0)/offs.length);
  return {r:nh.r-mr,c:nh.c-mc};}
function nearestHole(x,y,maxd=8){let best=null;
  for(let r=0;r<ROWS.length;r++){const yy=BB.rows[ROWS[r]];if(Math.abs(yy-y)>Math.max(maxd,7))continue;
    const c=Math.round((x-BB.x0)/BB.dx)+1;for(const cc of [c-1,c,c+1]){if(!holeExists(r,cc))continue;const xx=BB.x0+(cc-1)*BB.dx,d=Math.hypot(xx-x,yy-y);
      if(d<=maxd&&(!best||d<best.d))best={r,c:cc,d,h:holeName(r,cc)};}}
  if(!best&&maxd>=999){const r=ROWS.reduce((b,R,i)=>Math.abs(BB.rows[R]-y)<Math.abs(BB.rows[ROWS[b]]-y)?i:b,2);const c=Math.max(1,Math.min(60,Math.round((x-BB.x0)/BB.dx)+1));best={r,c,d:0,h:holeName(r,c)};}
  return best;}

// which holes are taken (by part legs and wire ends), except the ones of `skip` (a part or wire id)
function usedHoles(S,skip){const u=new Map();
  S.parts.forEach(p=>{if(p.id===skip||PARTS[p.type].fixed)return;Object.values(p.holes).forEach(h=>u.set(h,p.id));});
  S.wires.forEach(w=>{if(w.id===skip)return;u.set(w.a,w.id);u.set(w.b,w.id);});return u;}
function fits(S,holes,skip){if(!holes)return false;const u=usedHoles(S,skip);return Object.values(holes).every(h=>!u.has(h));}
// a free hole in the same strip as h (to start/end a wire next to a leg), or h itself
function freeInStrip(S,h,skip){const u=usedHoles(S,skip);if(!u.has(h))return h;const q=parseHole(h),R=ROWS[q.r],s=stripOf(h);
  const cand=[];if(R.length===2){for(let d=1;d<60;d++)for(const c of [q.c-d,q.c+d])if(holeExists(q.r,c))cand.push(holeName(q.r,c));}
  else{const rows=q.r<=6?[2,3,4,5,6]:[7,8,9,10,11];rows.sort((a,b)=>Math.abs(a-q.r)-Math.abs(b-q.r)).forEach(r=>cand.push(holeName(r,q.c)));}
  return cand.find(c=>!u.has(c)&&stripOf(c)===s)||h;}

// ---------- electrical nets: strips joined by wires (union-find) ----------
function nets(S){const par=new Map(),f=x=>{while(par.get(x)!==x){par.set(x,par.get(par.get(x)));x=par.get(x);}return x;};
  const add=x=>{if(!par.has(x))par.set(x,x);},join=(a,b)=>{add(a);add(b);a=f(a);b=f(b);if(a!==b)par.set(a,b);};
  S.parts.forEach(p=>Object.values(p.holes).forEach(h=>add(stripOf(h))));
  S.wires.forEach(w=>join(stripOf(w.a),stripOf(w.b)));
  if(S.parts.some(p=>p.type==='usb')){join('tp','bp');join('tn','bn');}      // the USB module powers both sides of the board
  return {of:h=>{const s=stripOf(h);add(s);return f(s);}};}

// ---------- drawing ----------
function holeXY(h){return HP(h);}
function partBox(p){const pts=Object.values(p.holes).map(HP);const T=PARTS[p.type];
  if(p.type==='usb')return [14,96,46,236];
  let x0=Math.min(...pts.map(q=>q[0])),x1=Math.max(...pts.map(q=>q[0])),y0=Math.min(...pts.map(q=>q[1])),y1=Math.max(...pts.map(q=>q[1]));
  if(p.type==='batt'){const up=y0<213;return up?[x0-22,24,x1-x0+58,y1-24]:[x0-22,y0,x1-x0+58,402-y0];}
  return [x0-9,y0-24,x1-x0+18,y1-y0+32];}
function drawPart(ctx,p,vis){const T=PARTS[p.type],H=p.holes,lit=vis&&vis.bright>0.02;
  switch(p.type){
    case 'res':partOn(ctx,{t:'res',a:H['1'],b:H['2'],v:p.props.R},false);break;
    case 'pot':partOn(ctx,{t:'pot',h:[H['1'],H['W'],H['3']]},false);break;
    case 'cap':partOn(ctx,{t:p.props.kind==='electrolytic'?'ecap':'ccap',a:H['+'],b:H['−'],lab:fmtC(p.props.C).replace(' ','')},false);break;
    case 'led':{const L=LEDS[p.props.color];partOn(ctx,{t:'led',a:H['+'],b:H['−'],rgb:L.rgb},false);
      if(lit){const A=HP(H['+']),B=HP(H['−']);glowAt(ctx,(A[0]+B[0])/2,(A[1]+B[1])/2-10,0.35+0.65*vis.bright,L.rgb,14+22*vis.bright);
        ctx.fillStyle=`rgba(${L.rgb},1)`;ctx.beginPath();ctx.arc((A[0]+B[0])/2,(A[1]+B[1])/2-10,6.5,0,7);ctx.fill();}break;}
    case 'diode':partOn(ctx,{t:'diode',a:H['A'],b:H['K']},false);
      if(p.props.kind==='1N4148'){const A=HP(H['A']),B=HP(H['K']);ctx.save();ctx.translate((A[0]+B[0])/2,(A[1]+B[1])/2);ctx.rotate(Math.atan2(B[1]-A[1],B[0]-A[0]));ctx.fillStyle='rgba(251,146,60,.85)';ctx.fillRect(-10,-4,15,8);ctx.restore();}break;
    case 'npn':partOn(ctx,{t:'npn',c:H['C'],b:H['B'],e:H['E']},false);break;
    case 'btn':{const q=parseHole(H['1a']);partOn(ctx,{t:'btn',col:q.c},false);if(p.props.pressed){const x=(HP(H['1a'])[0]+HP(H['2a'])[0])/2;ctx.fillStyle=PAL.cyan;ctx.beginPath();ctx.arc(x,213,7,0,7);ctx.fill();}break;}
    case 'sw':{const A=HP(H['1']),B=HP(H['2']);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-12;
      ctx.fillStyle=PAL.chip;ctx.beginPath();ctx.roundRect(mx-16,my-8,32,14,3);ctx.fill();ctx.fillStyle=p.props.on?PAL.green:PAL.slate;ctx.fillRect(p.props.on?mx+1:mx-13,my-6,12,10);
      leg(ctx,A,[mx-10,my+6]);leg(ctx,B,[mx+10,my+6]);break;}
    case 'ldr':partOn(ctx,{t:'ldr',a:H['1'],b:H['2']},false);break;
    case 'buz':partOn(ctx,{t:'buz',a:H['+'],b:H['−']},false);
      if(vis&&vis.sound){const A=HP(H['+']),B=HP(H['−']),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-4,t=performance.now()/1000;ctx.strokeStyle=PAL.pink;ctx.lineWidth=2;
        for(let i=0;i<3;i++){const rr=14+((t*40+i*10)%30);ctx.globalAlpha=Math.max(0,1-rr/44);ctx.beginPath();ctx.arc(mx,my,rr,-0.7,0.7);ctx.stroke();ctx.beginPath();ctx.arc(mx,my,rr,Math.PI-0.7,Math.PI+0.7);ctx.stroke();}ctx.globalAlpha=1;}break;
    case 'motor':{const A=HP(H['1']),B=HP(H['2']);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-24;leg(ctx,A,[mx-8,my+12]);leg(ctx,B,[mx+8,my+12]);
      ctx.fillStyle=PAL.gray;ctx.beginPath();ctx.arc(mx,my,15,0,7);ctx.fill();ctx.fillStyle=PAL.chipLight;ctx.beginPath();ctx.arc(mx,my,11,0,7);ctx.fill();
      p.ang=(p.ang||0)+((vis&&vis.spin)||0)*0.0015;ctx.save();ctx.translate(mx,my);ctx.rotate(p.ang);ctx.strokeStyle=PAL.sky;ctx.lineWidth=2;for(let k=0;k<3;k++){ctx.rotate(2.094);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(9,0);ctx.stroke();}ctx.restore();
      txt(ctx,'M',mx,my+4,PAL.ink,9);break;}
    case 'spk':{const A=HP(H['+']),B=HP(H['−']);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-26,lv=(vis&&vis.level)||0;
      leg(ctx,A,[mx-8,my+14]);leg(ctx,B,[mx+8,my+14]);ctx.fillStyle=PAL.chipDark;ctx.beginPath();ctx.arc(mx,my,17,0,7);ctx.fill();
      ctx.fillStyle=PAL.gray;ctx.beginPath();ctx.arc(mx,my,13+lv*1.5*Math.sin(performance.now()/18),0,7);ctx.fill();ctx.fillStyle=PAL.chipLight;ctx.beginPath();ctx.arc(mx,my,5,0,7);ctx.fill();
      if(lv>0.01){const t=performance.now()/1000;ctx.strokeStyle=PAL.pink;ctx.lineWidth=2;for(let i=0;i<3;i++){const rr=20+((t*50+i*10)%30);ctx.globalAlpha=Math.max(0,1-rr/50)*Math.min(1,0.3+lv);
        ctx.beginPath();ctx.arc(mx,my,rr,-0.7,0.7);ctx.stroke();ctx.beginPath();ctx.arc(mx,my,rr,Math.PI-0.7,Math.PI+0.7);ctx.stroke();}ctx.globalAlpha=1;}
      txt(ctx,'+',A[0]-7,A[1]-6,PAL.red,9);break;}
    case 'sig':{const A=HP(H['tip']),B=HP(H['sleeve']);pin(ctx,A[0],A[1]);pin(ctx,B[0],B[1]);const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-24;
      leg(ctx,A,[mx-6,my+10]);leg(ctx,B,[mx+6,my+10]);ctx.fillStyle='#4b5563';ctx.beginPath();ctx.roundRect(mx-16,my-10,32,20,4);ctx.fill();
      ctx.strokeStyle=PAL.cyan;ctx.lineWidth=1.5;ctx.beginPath();for(let k=0;k<=24;k++){const x=mx-12+k,y=my+Math.sin(k/24*Math.PI*4+((vis&&vis.I)?performance.now()/120:0))*5*Math.min(1,p.props.vol*2);k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
      txt(ctx,'♪',mx,my-14,PAL.ink,10);break;}
    case 'ne555':case 'cd4017':case 'lm358':case 'lm386':{const q=parseHole(H['1']);partOn(ctx,{t:'chip',col:q.c,n:T.pins.length,lab:T.chip},false);break;}
    case 'batt':{const P=HP(H['+']),up=P[1]<213;partOn(ctx,{t:'batt',at:[P[0]-20,up?30:352],plus:H['+'],minus:H['−'],lab:p.props.V+' V'},false);break;}
    case 'usb':partOn(ctx,{t:'pm'},!!(vis&&vis.on));break;
  }
  if(p.burnt)drawBurnt(ctx,p);}
function drawBurnt(ctx,p){const [x,y,w,h]=partBox(p);const cx=x+w/2,cy=y+h/2;
  const g=ctx.createRadialGradient(cx,cy,2,cx,cy,Math.max(w,h)*0.7);g.addColorStop(0,'rgba(20,10,5,.85)');g.addColorStop(1,'rgba(20,10,5,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,Math.max(w,h)*0.7,0,7);ctx.fill();txt(ctx,'🔥',cx,cy+5,PAL.white,14);}
