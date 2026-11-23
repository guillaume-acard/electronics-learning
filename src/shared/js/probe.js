
// ===== Circuit probe: click a wire or a part in a schematic to see its voltage and current =====
(function(){
window.__probeFrame=0;
const SEL={c:null,item:null,res:null,t:0};
// ---------- helpers ----------
const dist2seg=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy;let t=L?((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L:0;t=Math.max(0,Math.min(1,t));const x=a[0]+t*dx,y=a[1]+t*dy;return [Math.hypot(p[0]-x,p[1]-y),t];};
function parseR(lab){if(!lab)return null;const m=/(\d+(?:[.,]\d+)?)\s*(k|M|m)?\s*(Ω|ohm|R\b)?/i.exec(String(lab).replace(/R1|R2|R3|R4/g,''));if(!m)return null;let v=parseFloat(m[1].replace(',','.'));const u=m[2];if(u==='k'||u==='K')v*=1e3;else if(u==='M')v*=1e6;if(!m[3]&&!u&&!/Ω/.test(lab))return null;return v;}
function parseV(lab){const m=/(\d+(?:[.,]\d+)?)\s*V/.exec(lab||'');return m?parseFloat(m[1].replace(',','.')):null;}
const LEDVF=rgb=>!rgb?2.0:/34,197|22,163/.test(rgb)?2.1:/250,204|234,179/.test(rgb)?2.1:/59,130|37,99/.test(rgb)?3.0:2.0;
const fV=v=>v==null||isNaN(v)?'?':Math.abs(v)<0.001?'0 V':Math.abs(v)<1?(v*1000).toFixed(0)+' mV':v.toFixed(2)+' V';
const fI=i=>i==null||isNaN(i)?'?':Math.abs(i)<1e-7?'0 mA':Math.abs(i)<1e-3?(Math.abs(i)*1e6).toFixed(1)+' µA':Math.abs(i)<1?(Math.abs(i)*1e3).toFixed(Math.abs(i)<0.01?2:1)+' mA':Math.abs(i).toFixed(2)+' A';
const fR=r=>r>=1e6?+(r/1e6).toPrecision(3)+' MΩ':r>=1e3?+(r/1e3).toPrecision(3)+' kΩ':+r.toPrecision(3)+' Ω';
// ---------- build & solve the circuit drawn in a canvas ----------
function solve(rec){
  const pts=[];const pid=p=>{for(let i=0;i<pts.length;i++){if(Math.hypot(pts[i][0]-p[0],pts[i][1]-p[1])<=2.5)return i;}pts.push([p[0],p[1]]);return pts.length-1;};
  const segs=[],els=[],texts=[],chips=[],gnds=[];let hasChip=false,hasCap=false,hasAC=false,unknownR=[];
  rec.forEach(r=>{if(r.t==='wire'){for(let i=0;i<r.pts.length-1;i++){if(Math.hypot(r.pts[i][0]-r.pts[i+1][0],r.pts[i][1]-r.pts[i+1][1])<0.5)continue;segs.push({a:r.pts[i],b:r.pts[i+1],src:r});}r.pts.forEach(pid);}
    else if(r.t==='part'){pid(r.a);pid(r.b);if(r.k==='wire')segs.push({a:r.a,b:r.b,src:r});else els.push(r);}
    else if(r.t==='npn'){const B=[r.x-34,r.y],C=[r.x+10,r.y-34],E=[r.x+10,r.y+34];pid(B);pid(C);pid(E);els.push({t:'npnBE',k:'npnBE',a:B,b:E,on:r.on,src:r});els.push({t:'npnCE',k:'npnCE',a:C,b:E,on:r.on,src:r});}
    else if(r.t==='chip'){hasChip=true;chips.push(r);}else if(r.t==='txt')texts.push(r);else if(r.t==='gnd'){pid([r.x,r.y]);gnds.push([r.x,r.y]);}});
  // split wire segments at any point lying on them
  const edges=[];
  segs.forEach(s=>{const on=[];pts.forEach((p,i)=>{const [d,t]=dist2seg(p,s.a,s.b);if(d<=2.5)on.push([t,i]);});on.sort((x,y)=>x[0]-y[0]);
    for(let k=0;k<on.length-1;k++){if(on[k][1]!==on[k+1][1])edges.push({n1:on[k][1],n2:on[k+1][1],seg:s,t0:on[k][0],t1:on[k+1][0]});}});
  const N=pts.length;
  // elements -> stamps
  const E=[];// {type:'R'|'D'|'V', n1,n2, val, vf, ref}
  els.forEach(e=>{const n1=pid(e.a),n2=pid(e.b);const k=e.k,o=e.o||{};
    if(k==='batt'){E.push({type:'V',n1,n2,val:parseV(o.label)||9,ref:e});}  // a = +
    else if(k==='res'||k==='ldr'||k==='pot'){let R=parseR(o.label);if(R==null){R=k==='ldr'?10000:1000;unknownR.push(e);}E.push({type:'R',n1,n2,val:R,ref:e,guess:unknownR.includes(e)});}
    else if(k==='led'){if(!o.burnt)E.push({type:'D',n1,n2,vf:LEDVF(o.rgb),rs:5,ref:e});else E.push({type:'O',n1,n2,ref:e});}
    else if(k==='diode')E.push({type:'D',n1,n2,vf:0.7,rs:2,ref:e});
    else if(k==='switch')E.push(o.closed?{type:'R',n1,n2,val:0.01,ref:e}:{type:'O',n1,n2,ref:e});
    else if(k==='lamp')E.push({type:'R',n1,n2,val:parseR(o.label)||120,ref:e});
    else if(k==='motor')E.push({type:'R',n1,n2,val:parseR(o.label)||30,ref:e});
    else if(k==='coil')E.push({type:'R',n1,n2,val:parseR(o.label)||70,ref:e});
    else if(k==='cap'){hasCap=true;E.push({type:'O',n1,n2,ref:e});}
    else if(k==='ac'){hasAC=true;E.push({type:'O',n1,n2,ref:e});}
    else if(k==='npnBE')E.push({type:'D',n1,n2,vf:0.7,rs:50,ref:e});
    else if(k==='npnCE')E.push(e.on?{type:'R',n1,n2,val:5,ref:e}:{type:'O',n1,n2,ref:e});
    else E.push({type:'O',n1,n2,ref:e});});
  edges.forEach(ed=>E.push({type:'R',n1:ed.n1,n2:ed.n2,val:1e-3,ref:ed,wire:true}));
  // rail labels: "+9 V" / "0 V" near a wire end
  const rails=[];texts.forEach(tx=>{let best=-1,bd=30;pts.forEach((p,i)=>{const d=Math.hypot(p[0]-tx.x,p[1]-tx.y);if(d<bd){bd=d;best=i;}});if(best>=0){const v=/^(0 V|GND|−|-)$/.test(tx.s)?0:parseV(tx.s);if(v!=null)rails.push({n:best,v});}});
  // reference node
  let ref=-1;const vs=E.filter(e=>e.type==='V');if(vs.length)ref=vs[0].n2;else{const z=rails.find(r=>r.v===0);if(z)ref=z.n;else if(gnds.length)ref=pid(gnds[0]);}
  gnds.forEach(g=>{const n=pid(g);if(n!==ref&&ref>=0)E.push({type:'R',n1:n,n2:ref,val:1e-3,ref:{gnd:true}});});
  if(ref<0)return {err:'no battery or supply rail in this drawing'};
  rails.forEach(r=>{if(r.n!==ref&&!(r.v===0&&false))E.push({type:'V',n1:r.n,n2:ref,val:r.v,ref:{rail:true}});});
  // connectivity: nodes reachable from ref through non-open elements
  const adj=Array.from({length:N},()=>[]);E.forEach(e=>{if(e.type!=='O'){adj[e.n1].push(e.n2);adj[e.n2].push(e.n1);}});
  const seen=new Array(N).fill(false);const st=[ref];seen[ref]=true;while(st.length){const u=st.pop();adj[u].forEach(v=>{if(!seen[v]){seen[v]=true;st.push(v);}});}
  // chip pins: nodes touching a chip box are driven by the chip -> everything that depends on them is unknown
  const fixed=new Set([ref]);E.forEach(e=>{if(e.type==='V'){fixed.add(e.n1);fixed.add(e.n2);}});
  const pinNodes=[];pts.forEach((p,i)=>{if(chips.some(c=>p[0]>=c.x-3&&p[0]<=c.x+c.w+3&&p[1]>=c.y-3&&p[1]<=c.y+c.h+3))pinNodes.push(i);});
  const unk=new Array(N).fill(false);const q=pinNodes.filter(i=>!fixed.has(i));q.forEach(i=>unk[i]=true);
  while(q.length){const u=q.pop();adj[u].forEach(v=>{if(!unk[v]&&!fixed.has(v)){unk[v]=true;q.push(v);}});}
  for(let i=0;i<N;i++)if(unk[i])seen[i]=false;
  // MNA with piecewise-linear diodes
  const idx=new Array(N).fill(-1);let m=0;for(let i=0;i<N;i++)if(i!==ref)idx[i]=m++;const V=E.filter(e=>e.type==='V');const nv=V.length,S=m+nv;
  const D=E.filter(e=>e.type==='D');D.forEach(d=>d.on=true);let x=null;
  for(let it=0;it<40;it++){const A=Array.from({length:S},()=>new Float64Array(S)),z=new Float64Array(S);
    const g=(a,b,G)=>{const i=idx[a],j=idx[b];if(i>=0)A[i][i]+=G;if(j>=0)A[j][j]+=G;if(i>=0&&j>=0){A[i][j]-=G;A[j][i]-=G;}};
    for(let i=0;i<m;i++)A[i][i]+=1e-12;
    E.forEach(e=>{if(e.type==='R')g(e.n1,e.n2,1/e.val);else if(e.type==='O')g(e.n1,e.n2,1e-12);else if(e.type==='D'){if(e.on){const G=1/e.rs;g(e.n1,e.n2,G);const i=idx[e.n1],j=idx[e.n2];if(i>=0)z[i]+=G*e.vf;if(j>=0)z[j]-=G*e.vf;}else g(e.n1,e.n2,1e-12);}});
    V.forEach((e,k)=>{const r=m+k,i=idx[e.n1],j=idx[e.n2];if(i>=0){A[i][r]+=1;A[r][i]+=1;}if(j>=0){A[j][r]-=1;A[r][j]-=1;}z[r]=e.val;});
    // gaussian elimination
    const n=S;const M=A.map((row,i)=>{const r=Array.from(row);r.push(z[i]);return r;});
    let ok=true;for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;if(Math.abs(M[p][c])<1e-18){ok=false;break;}[M[c],M[p]]=[M[p],M[c]];for(let r=0;r<n;r++){if(r===c)continue;const f=M[r][c]/M[c][c];if(f)for(let k=c;k<=n;k++)M[r][k]-=f*M[c][k];}}
    if(!ok)return {err:'this drawing can\'t be solved (two batteries fighting, or a short?)'};
    x=new Float64Array(n);for(let i=0;i<n;i++)x[i]=M[i][n]/M[i][i];
    const nodeV=i=>i===ref?0:x[idx[i]];let changed=false;
    D.forEach(d=>{const vd=nodeV(d.n1)-nodeV(d.n2);if(d.on){const I=(vd-d.vf)/d.rs;if(I<0){d.on=false;changed=true;}}else if(vd>d.vf+1e-6){d.on=true;changed=true;}});
    if(!changed)break;}
  const nodeV=i=>i===ref?0:x[idx[i]];
  const cur=e=>{if(e.type==='R')return (nodeV(e.n1)-nodeV(e.n2))/e.val;if(e.type==='D')return e.on?(nodeV(e.n1)-nodeV(e.n2)-e.vf)/e.rs:0;if(e.type==='V'){const k=V.indexOf(e);return -x[m+k];}return 0;};
  return {pts,E,edges,ref,seen,nodeV,cur,hasChip,hasCap,hasAC,unknownR,pid};}
// ---------- picking ----------
function pick(c,px,py){const rec=c.__rec||[];let best=null,bd=1e9;
  rec.forEach(r=>{if(r.t==='part'&&r.k!=='wire'&&r.k!=='gap'&&r.k!=='empty'){const [d]=dist2seg([px,py],r.a,r.b);if(d<16&&d<bd){bd=d;best={kind:'part',r};}}
    else if(r.t==='npn'){const d=Math.hypot(px-r.x,py-r.y);if(d<26&&d<bd){bd=d;best={kind:'npn',r};}}});
  if(bd<9)return best;
  rec.forEach(r=>{const segs=r.t==='wire'?r.pts.slice(0,-1).map((p,i)=>[p,r.pts[i+1]]):(r.t==='part'&&r.k==='wire')?[[r.a,r.b]]:[];
    segs.forEach(([a,b])=>{const [d]=dist2seg([px,py],a,b);if(d<8&&d<bd){bd=d;best={kind:'wire',a,b,p:[px,py]};}});});
  return best;}
function sameItem(rec,item){// find the equivalent primitive in a new frame's records
  if(item.kind==='wire')return item;
  for(const r of rec){if(item.kind==='part'&&r.t==='part'&&r.k===item.r.k&&Math.hypot(r.a[0]-item.r.a[0],r.a[1]-item.r.a[1])<1&&Math.hypot(r.b[0]-item.r.b[0],r.b[1]-item.r.b[1])<1)return {kind:'part',r};
    if(item.kind==='npn'&&r.t==='npn'&&Math.abs(r.x-item.r.x)<1&&Math.abs(r.y-item.r.y)<1)return {kind:'npn',r};}return null;}
// ---------- panel ----------
const OK=new Set(['cp1','cp2','cp3','cp4','cp5','cp6','cp7','cp8','cSP','cLed','cDiv','cfSP','cfDiv','cInd']);
const panel=document.createElement('div');panel.id='probePanel';panel.hidden=true;document.body.appendChild(panel);
panel.innerHTML='<button class="pclose" title="close">✕</button><h4 id="pbT">🔎</h4><div id="pbBody"></div><canvas id="pbG" width="320" height="90"></canvas><div class="pbleg"><span style="color:#fde047">━ voltage across</span> <span style="color:#38bdf8">━ current</span> · last 10 s</div><label class="pbflow"><input type="checkbox" id="pbFlow" checked> 🌈 Show the whole circuit: wires coloured by voltage, dots moving with the current</label><div id="pbNotes"></div>';
panel.querySelector('.pclose').onclick=()=>close();
const NAMES={res:'Resistor',ldr:'LDR (light sensor)',pot:'Potentiometer',led:'LED',diode:'Diode',batt:'Battery',switch:'Switch / button',lamp:'Lamp',motor:'Motor',coil:'Coil',cap:'Capacitor',ac:'AC source'};
function measure(){// returns {title,rows,v,i,notes,hl,arrow} for the current selection
  const c=SEL.c;const item=sameItem(c.__rec,SEL.item);if(!item)return null;SEL.item=item;const S=solve(c.__rec);SEL.S=S;
  if(S.err)return {title:'🔎 Probe',rows:[],notes:[S.err],v:null,i:null};
  const flo=n=>!S.seen[n];const vtxt=n=>flo(n)?'<span class="pq">? (set by a chip / not simulated)</span>':fV(S.nodeV(n));const notes=[];
  if(item.kind==='wire'){let e=null,bd=1e9;S.E.forEach(el=>{if(el.wire){const a=S.pts[el.n1],b=S.pts[el.n2];const [d]=dist2seg(item.p,a,b);if(d<bd){bd=d;e=el;}}});
    if(!e)return null;const fl=flo(e.n1),I=fl?NaN:S.cur(e);SEL.hl=[S.pts[e.n1],S.pts[e.n2]];SEL.arrow=!fl&&Math.abs(I)>1e-6?(I>=0?SEL.hl:[SEL.hl[1],SEL.hl[0]]):null;
    notes.push('A wire has almost no resistance, so both ends are at the same voltage (≈ 0 V between them): the whole wire is one "node".');
    return {title:'🔎 Wire',rows:[['Voltage between its two ends','≈ 0 V'],['Voltage of this wire (vs GND)',vtxt(e.n1)],['Current flowing in it',fl?'?':fI(I)],['Resistance','≈ 0 Ω (a wire)']],v:fl?NaN:S.nodeV(e.n1),i:I,notes};}
  const r=item.r;
  if(item.kind==='npn'){const B=S.pid([r.x-34,r.y]),C=S.pid([r.x+10,r.y-34]),Ee=S.pid([r.x+10,r.y+34]);const be=S.E.find(e=>e.ref&&e.ref.src===r&&e.ref.k==='npnBE'),ce=S.E.find(e=>e.ref&&e.ref.src===r&&e.ref.k==='npnCE');
    SEL.hl=[[r.x+10,r.y-34],[r.x+10,r.y+34]];const Ic=ce&&!flo(C)?S.cur(ce):NaN;SEL.arrow=Math.abs(Ic)>1e-6?SEL.hl:null;
    notes.push('Simplified model: base–emitter = a 0.7 V diode; collector–emitter = closed switch when ON (as drawn), open when OFF.');
    return {title:'🔎 Transistor (NPN)',rows:[['Base · collector · emitter (vs GND)',vtxt(B)+' · '+vtxt(C)+' · '+vtxt(Ee)],['Base current',be&&!flo(B)?fI(S.cur(be)):'?'],['Collector current',isNaN(Ic)?'?':fI(Ic)],['Collector–emitter voltage',flo(C)?'?':fV(S.nodeV(C)-S.nodeV(Ee))]],v:flo(C)?NaN:S.nodeV(C)-S.nodeV(Ee),i:Ic,notes};}
  const n1=S.pid(r.a),n2=S.pid(r.b),el=S.E.find(e=>e.ref===r);let I=el?S.cur(el):0;const fl=flo(n1)||flo(n2);const dv=S.nodeV(n1)-S.nodeV(n2);if(r.k==='batt')I=-I;
  SEL.hl=[r.a,r.b];SEL.arrow=!fl&&Math.abs(I)>1e-6?(r.k==='batt'?[r.b,r.a]:(I>=0?[r.a,r.b]:[r.b,r.a])):null;
  const lab=r.o&&r.o.label?' '+String(r.o.label).replace(/^[A-Z]:\s*/,''):'';let Rtxt='';
  if(el&&el.type==='R')Rtxt=r.k==='switch'?'≈ 0 Ω (closed)':fR(el.val)+(el.guess?' (assumed)':'');else if(el&&el.type==='O')Rtxt=r.k==='cap'?'∞ for DC (blocks it)':'∞ (open)';else if(el&&el.type==='D')Rtxt=el.on&&Math.abs(I)>1e-7?'acts like ≈ '+fR(Math.abs(dv/I))+' right now (V ÷ I)':'∞ (not conducting)';else if(r.k==='batt')Rtxt='— (it\'s the pump)';
  const rows=[['Voltage between its two ends',fl?'?':fV(Math.abs(dv))],['Its two ends (vs GND)',vtxt(n1)+' · '+vtxt(n2)],['Current through it',fl?'?':fI(I)],['Resistance',Rtxt||'?']];
  if(!fl&&r.k!=='batt')rows.push(['Power (V × I)',(Math.abs(dv*I)*1000).toFixed(1)+' mW']);
  if(el&&el.type==='R'&&!fl&&r.k!=='switch')notes.push(`Ohm's law: I = V ÷ R = ${fV(Math.abs(dv))} ÷ ${fR(el.val)} = ${fI(I)}`);
  if(r.k==='led'||r.k==='diode')notes.push(el&&el.type==='D'?(el.on?'Conducting: it takes about '+el.vf+' V (its forward voltage), the rest goes to the resistor.':'Not conducting (reversed, or not enough voltage): no current.'):'Burnt out: no current.');
  if(r.k==='cap')notes.push('In steady DC a capacitor is full and blocks the current: 0 mA. While it charges or empties, current flows for a moment.');
  if(r.k==='switch')notes.push(r.o&&r.o.closed?'Closed: like a wire.':'Open: no current flows, so the full push can appear across it.');
  if(r.k==='batt')notes.push('The battery is the pump: its current is the total current of the circuit.');
  return {title:'🔎 '+(NAMES[r.k]||r.k)+lab,rows,v:fl?NaN:Math.abs(dv),i:fl?NaN:Math.abs(I),notes};}
function render(m){if(!m){close();return;}panel.querySelector('#pbT').innerHTML=m.title;panel.querySelector('#pbBody').innerHTML='<table>'+m.rows.map(([a,b])=>`<tr><td>${a}</td><td><b>${b}</b></td></tr>`).join('')+'</table>';
  const S=SEL.S,notes=m.notes.slice();if(S&&S.hasCap&&!(SEL.item.r&&SEL.item.r.k==='cap'))notes.push('Capacitors are treated as fully charged (steady DC): during the animation\'s charging or emptying, real values change over time.');
  if(S&&S.hasChip)notes.push('Parts wired to a chip show "?": the probe doesn\'t simulate what the chip does.');notes.push('Voltages are measured from GND (the battery −, 0 V).');
  panel.querySelector('#pbNotes').innerHTML=notes.map(n=>`<p class="pn">${n}</p>`).join('');}
function close(){SEL.c=null;SEL.item=null;SEL.S=null;SEL.hist=[];panel.hidden=true;}
document.addEventListener('click',e=>{const c=e.target;if(!(c instanceof HTMLCanvasElement)||!OK.has(c.id)||!c.__rec)return;
  const rc=c.getBoundingClientRect(),px=(e.clientX-rc.left)*c.width/rc.width,py=(e.clientY-rc.top)*c.height/rc.height;const it=pick(c,px,py);if(!it)return;
  SEL.c=c;SEL.item=it;SEL.hist=[];panel.hidden=false;const m=measure();render(m);});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
window.addEventListener('hashchange',close);
// ---------- per-frame: frame counter, overlay, live refresh, graph ----------
const vcol=(v,vmax)=>{const k=Math.max(0,Math.min(1,v/(vmax||1)));const r=Math.round(59+(239-59)*k),g=Math.round(130+(68-130)*k),b=Math.round(246+(68-246)*k);return `rgb(${r},${g},${b})`;};
let lastD=0,lastT=performance.now(),phase=0;
function graph(){const g=panel.querySelector('#pbG'),ctx=g.getContext('2d');ctx.clearRect(0,0,g.width,g.height);ctx.fillStyle='#111c2e';ctx.fillRect(0,0,g.width,g.height);
  const H=SEL.hist||[];if(H.length<2)return;const vm=Math.max(0.1,...H.map(h=>isNaN(h.v)?0:h.v))*1.15,im=Math.max(1e-6,...H.map(h=>isNaN(h.i)?0:Math.abs(h.i)))*1.15;
  [['v','#fde047',vm],['i','#38bdf8',im]].forEach(([k,col,mx])=>{ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();let st=false;H.forEach((h,j)=>{const val=Math.abs(h[k]);if(isNaN(val)){st=false;return;}const x=g.width-(H.length-1-j)*(g.width/100),y=g.height-4-val/mx*(g.height-14);if(!st){ctx.moveTo(x,y);st=true;}else ctx.lineTo(x,y);});ctx.stroke();});
  ctx.font='10px system-ui';ctx.fillStyle='#fde047';ctx.fillText('max '+fV(vm/1.15),4,11);ctx.fillStyle='#38bdf8';ctx.textAlign='right';ctx.fillText('max '+fI(im/1.15),g.width-4,11);ctx.textAlign='left';}
function frame(now){window.__probeFrame++;const dt=Math.min(0.05,(now-lastT)/1000);lastT=now;
  document.querySelectorAll('canvas').forEach(c=>{if(OK.has(c.id)&&c.style.cursor!=='crosshair'){c.style.cursor='crosshair';c.title='Click a wire or a part to see its voltage and current';}});
  if(SEL.c&&now-lastD>120){lastD=now;const m=measure();if(m){render(m);SEL.hist.push({v:m.v,i:m.i});if(SEL.hist.length>100)SEL.hist.shift();graph();}else close();}
  if(SEL.c&&SEL.S&&!SEL.S.err){const ctx=SEL.c.getContext('2d'),S=SEL.S;ctx.save();
    if(panel.querySelector('#pbFlow').checked){const vmax=Math.max(...S.pts.map((p,i)=>S.seen[i]?S.nodeV(i):0));phase+=dt;
      S.E.forEach(e=>{if(!e.wire)return;const a=S.pts[e.n1],b=S.pts[e.n2];const fl=!S.seen[e.n1];ctx.strokeStyle=fl?'rgba(100,116,139,.5)':vcol(S.nodeV(e.n1),vmax);ctx.globalAlpha=.75;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.globalAlpha=1;
        const I=fl?0:S.cur(e);if(Math.abs(I)<1e-6)return;const L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<2)return;const sp=Math.min(160,20+Math.log10(Math.abs(I)*1e6)*25);const dir=I>0?1:-1;
        for(let s=((phase*sp*dir)%18+18)%18;s<L;s+=18){const k=s/L;ctx.fillStyle='#fde047';ctx.beginPath();ctx.arc(a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,2.6,0,7);ctx.fill();}});
      const X0=SEL.c.width-200;ctx.fillStyle='rgba(11,18,32,.9)';ctx.fillRect(X0,4,196,20);ctx.font='10px system-ui';ctx.textAlign='left';ctx.fillStyle='#cbd5e1';ctx.fillText('0 V',X0+6,18);const gr=ctx.createLinearGradient(X0+30,0,X0+140,0);gr.addColorStop(0,vcol(0,1));gr.addColorStop(1,vcol(1,1));ctx.fillStyle=gr;ctx.fillRect(X0+30,10,110,8);ctx.fillStyle='#cbd5e1';ctx.fillText(vmax.toFixed(1)+' V',X0+146,18);}
    if(SEL.hl){ctx.strokeStyle='rgba(253,224,71,.9)';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(SEL.hl[0][0],SEL.hl[0][1]);ctx.lineTo(SEL.hl[1][0],SEL.hl[1][1]);ctx.stroke();}
    if(SEL.arrow){const [a,b]=SEL.arrow,mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,ang=Math.atan2(b[1]-a[1],b[0]-a[0]);ctx.translate(mx,my);ctx.rotate(ang);ctx.fillStyle='#fde047';ctx.strokeStyle='#0b1220';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(-8,-9);ctx.lineTo(-8,9);ctx.closePath();ctx.fill();ctx.stroke();}
    ctx.restore();}
  requestAnimationFrame(frame);}
requestAnimationFrame(frame);
})();
