// ===== Build lab: multimeter probes with a time chart (like a small oscilloscope) =====
// Up to two probes. On a hole (or a wire): its voltage against −. On a part: the current through it.
// Every simulator step is recorded (0.2 ms), so fast signals (a 440 Hz tone) show as a band and slow ones as a line.
const PROBE_COL=[PAL.cyan,PAL.pink],CAP_N=60000,SPANS=[[0.02,'20 ms'],[0.2,'0.2 s'],[2,'2 s'],[10,'10 s']];
let probes=[null,null],probeMode=0,span=2,ptime=0,probeVer=0,frameN=0;
const rec=[0,1].map(()=>({t:new Float64Array(CAP_N),v:new Float64Array(CAP_N),n:0,i:0}));
const probeOk=pr=>pr&&(pr.kind==='v'||findPart(pr.id));
const canCurrent=T=>T.probeI||T.pins.length===2;
function probeLabel(pr){if(pr.kind==='v')return 'Voltage at '+pr.hole;const p=findPart(pr.id);return 'Current in the '+(p?pname(p):'part');}
function probeReset(){rec.forEach(r=>{r.n=0;r.i=0;});}

// ---- placing a probe: the next click on the board
function armProbe(k){probeMode=probeMode===k?0:k;showTab('meter');renderProbeBar();
  if(probeMode)status(`Probe ${k}: click a hole (or a wire) to see its voltage, or a part to see the current through it. Esc to cancel.`);else status('');}
function placeProbe(x,y){const k=probeMode;probeMode=0;const h=nearestHole(x,y,7),p=partAt(x,y),w=!h&&!p&&wireAt(x,y);let pr=null;
  if(p&&(!h||!Object.values(p.holes).includes(h.h))){const T=PARTS[p.type];
    if(!canCurrent(T)){status(`${pname(p)}: put the probe on one of its legs (a hole) to read the voltage there.`,'warn');renderProbeBar();return;}
    pr={kind:'i',id:p.id};}
  else if(h)pr={kind:'v',hole:h.h};else if(w)pr={kind:'v',hole:w.a};
  if(!pr){status('Not on a hole, a wire or a part: the probe was not placed.','warn');renderProbeBar();return;}
  probes[k-1]=pr;probeVer++;rec[k-1].n=0;rec[k-1].i=0;renderProbeBar();renderScopes();
  status(`Probe ${k}: ${probeLabel(pr)}.${run?'':' Press ▶ Play to record.'}`,run?'run':'');}
function clearProbes(){probes=[null,null];probeVer++;probeReset();renderProbeBar();renderScopes();}   // a new board: its parts are not the old ones
function removeProbe(k){probes[k-1]=null;probeVer++;renderProbeBar();renderScopes();}

// ---- recording (called by the simulation after every step)
function probeGetter(R,pr){
  if(pr.kind==='v'){const n=R.N.of(pr.hole);if(n===R.gnd)return ()=>0;const k=R.node.get(n);return k?()=>R.c.v(k):()=>NaN;}
  const p=findPart(pr.id),el=R.els.get(pr.id);if(!p||!el)return ()=>0;const T=PARTS[p.type];
  if(T.probeI)return ()=>T.probeI(el);const e=Object.values(el).find(x=>x&&typeof x==='object'&&'t' in x&&'i' in x);return e?()=>e.i:()=>0;}
function probeSample(R,h){if(!probes[0]&&!probes[1])return;ptime+=h;
  if(R.pv!==probeVer){R.pg=probes.map(pr=>probeOk(pr)?probeGetter(R,pr):null);R.pv=probeVer;}
  R.pg.forEach((g,k)=>{if(!g)return;const r=rec[k];r.t[r.i]=ptime;r.v[r.i]=g();r.i=(r.i+1)%CAP_N;if(r.n<CAP_N)r.n++;});}

// ---- the card: probe buttons, time span, one chart per probe
function renderProbeBar(){[1,2].forEach(k=>{const b=$('bdProbe'+k),pr=probes[k-1];if(pr&&!probeOk(pr)){probes[k-1]=null;}
  b.classList.toggle('active',probeMode===k);b.textContent=probeMode===k?`🎯 Click the board…`:probes[k-1]?`📍 Probe ${k}: move`:`📍 Probe ${k}`;});
  $('bdSpan').querySelectorAll('button').forEach(b=>b.classList.toggle('active',+b.dataset.s===span));}
(function(){const box=$('bdSpan');SPANS.forEach(([s,l])=>{const b=document.createElement('button');b.textContent=l;b.dataset.s=s;b.onclick=()=>{span=s;renderProbeBar();};box.appendChild(b);});
  [1,2].forEach(k=>{$('bdProbe'+k).onclick=()=>armProbe(k);});renderProbeBar();})();
function renderScopes(){const box=$('bdScopes');box.innerHTML=probes.map((pr,k)=>!probeOk(pr)?'':`<div class="bd-scope" style="--pc:${PROBE_COL[k]}">
    <div class="bd-scope-head"><span class="bd-pdot">${k+1}</span><span>${probeLabel(pr)}</span><b id="bdPv${k}">—</b><button class="bd-pdel" data-k="${k+1}" title="Remove this probe">✕</button></div>
    <canvas id="bdPc${k}" height="120"></canvas><div class="bd-scope-stats" id="bdPs${k}"></div></div>`).join('');
  box.querySelectorAll('.bd-pdel').forEach(b=>b.onclick=()=>removeProbe(+b.dataset.k));}
const fmtSig=(v,kind)=>v==null||isNaN(v)?'—':(v<0?'−':'')+(kind==='v'?fmtV(Math.abs(v)):fmtI(v));
function drawScopes(){frameN++;if($('bdMeterPane').hidden)return;
  probes.forEach((pr,k)=>{const cvs2=$('bdPc'+k);if(!cvs2)return;if(!probeOk(pr)){renderScopes();return;}
    const dpr=window.devicePixelRatio||1,W=Math.max(100,Math.round(cvs2.clientWidth*dpr)),H=Math.round(120*dpr);if(cvs2.width!==W||cvs2.height!==H){cvs2.width=W;cvs2.height=H;}
    const c=cvs2.getContext('2d'),r=rec[k],L=46*dpr,PW=W-L-6*dpr,t1=ptime,t0=t1-span;c.clearRect(0,0,W,H);
    // min/max per pixel column, newest sample first
    const cols=Math.max(1,Math.floor(PW)),mn=new Float64Array(cols).fill(Infinity),mx=new Float64Array(cols).fill(-Infinity);
    let lo=Infinity,hi=-Infinity,sum=0,cnt=0,m=0,last=null,rises=[],state=0;
    for(let j=0;j<r.n;j++){const ix=(r.i-1-j+CAP_N)%CAP_N,t=r.t[ix];if(t<t0)break;m++;const v=r.v[ix];if(isNaN(v))continue;if(last==null)last=v;
      const col=Math.min(cols-1,Math.floor((t-t0)/span*cols));if(v<mn[col])mn[col]=v;if(v>mx[col])mx[col]=v;if(v<lo)lo=v;if(v>hi)hi=v;sum+=v;cnt++;}
    const unit=pr.kind==='v'?'V':'A';
    // frequency: rising crossings of the middle (with 10 % hysteresis), oldest to newest
    if(cnt>4&&hi-lo>(pr.kind==='v'?0.02:2e-5)){const mid=(lo+hi)/2,hy=(hi-lo)*0.1;let first=-1;
      for(let j=m-1;j>=0;j--){const ix=(r.i-1-j+CAP_N)%CAP_N,t=r.t[ix],v=r.v[ix];if(isNaN(v))continue;
        if(state<=0&&v>mid+hy){if(state<0)rises.push(t);state=1;}else if(state>=0&&v<mid-hy)state=-1;}}
    const freq=rises.length>=2?(rises.length-1)/(rises[rises.length-1]-rises[0]):null;
    // scale: keep 0 in view, a little margin
    let a=Math.min(0,isFinite(lo)?lo:0),b=Math.max(0,isFinite(hi)?hi:0);if(b-a<(unit==='V'?0.1:1e-4)){b+=unit==='V'?0.05:5e-5;a-=a<0?(unit==='V'?0.05:5e-5):0;}
    const pad=(b-a)*0.08;a-=a<0?pad:0;b+=pad;const Y=v=>6*dpr+(H-12*dpr)*(1-(v-a)/(b-a));
    c.font=`${10*dpr}px ui-monospace,monospace`;c.textAlign='right';c.textBaseline='middle';
    [b-pad,0,a<0?a+(a<0?pad:0):null].forEach(v=>{if(v==null)return;const y=Y(v);c.strokeStyle=v===0?'rgba(148,163,184,.45)':'rgba(148,163,184,.18)';c.lineWidth=1;c.beginPath();c.moveTo(L,y);c.lineTo(W,y);c.stroke();
      c.fillStyle=PAL.muted;c.fillText(fmtSig(v,pr.kind),L-4*dpr,y);});
    for(let q=1;q<5;q++){const x=L+PW*q/5;c.strokeStyle='rgba(148,163,184,.12)';c.beginPath();c.moveTo(x,4*dpr);c.lineTo(x,H-4*dpr);c.stroke();}
    c.textAlign='left';c.fillStyle=PAL.muted;c.fillText('−'+SPANS.find(s=>s[0]===span)[1],L+3*dpr,H-8*dpr);c.textAlign='right';c.fillText('now',W-2*dpr,H-8*dpr);
    c.strokeStyle=PROBE_COL[k];c.lineWidth=1.6*dpr;c.lineJoin='round';c.beginPath();let started=false;
    for(let col=0;col<cols;col++){if(mn[col]===Infinity)continue;const x=L+col+0.5;if(!started){c.moveTo(x,Y(mn[col]));started=true;}else c.lineTo(x,Y(mn[col]));if(mx[col]!==mn[col])c.lineTo(x,Y(mx[col]));}
    c.stroke();
    if(!cnt){c.textAlign='center';c.fillStyle=PAL.muted;c.font=`${12*dpr}px system-ui`;c.fillText(run?'recording…':'Press ▶ Play to record',L+PW/2,H/2);}
    if((frameN%6)===0||!run){$('bdPv'+k).textContent=fmtSig(last,pr.kind);
      $('bdPs'+k).innerHTML=cnt?`<span>min <b>${fmtSig(lo,pr.kind)}</b></span><span>max <b>${fmtSig(hi,pr.kind)}</b></span><span>average <b>${fmtSig(sum/cnt,pr.kind)}</b></span>${freq?`<span>repeats <b>${freq>=100?Math.round(freq):freq.toPrecision(2)} times/s</b> (${freq>=1000?(freq/1000).toFixed(2)+' kHz':freq.toPrecision(3)+' Hz'})</span>`:''}`:'';}});}
// ---- markers on the board: a numbered probe tip on the hole, or a badge on the part
function drawProbeMarks(ctx){probes.forEach((pr,k)=>{if(!probeOk(pr))return;const col=PROBE_COL[k];
  if(pr.kind==='v'){const [x,y]=HP(pr.hole),tx=x+14,ty=y-22;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,5,0,7);ctx.stroke();
    ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+3,y-4);ctx.lineTo(tx,ty);ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.arc(tx,ty,8,0,7);ctx.fill();txt(ctx,String(k+1),tx,ty+4,'#0b1120',10);}
  else{const p=findPart(pr.id),[bx,by,bw]=partBox(p),x=bx+bw,y=by;ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(x-12,y-9,24,16,8);ctx.fill();txt(ctx,'A'+(k+1),x,y+3,'#0b1120',9);}});}
