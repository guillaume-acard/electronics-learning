// ===== Build lab: the page (catalog, editing, play, check, multimeter, undo, save, import) =====
const cvs=$('bdBoard'),bctx=cvs.getContext('2d');
let S={parts:[],wires:[]},NID=1;
const WIRE_COLORS=[['red',PAL.redDark],['black','#111'],['blue',PAL.blueDark],['green',PAL.greenDark],['yellow',PAL.gold],['orange',PAL.orangeDark],['white','#f8fafc']];
let wireColor=WIRE_COLORS[0][1],sel=null,drag=null,hov=null,run=null,flashIds=new Set(),flashT=0;
const undoS=[],redoS=[],smoke=[];
const status=(msg,cls='')=>{const el=$('bdStatus');el.textContent=msg;el.className='bd-status '+cls;};
const pname=p=>PARTS[p.type].name+(p.type==='res'?' '+fmtR(p.props.R):p.type==='led'?' ('+p.props.color+')':p.type==='npn'?' '+p.props.kind:'');
const findPart=id=>S.parts.find(p=>p.id===id),findWire=id=>S.wires.find(w=>w.id===id);

// ---------- history & storage ----------
const snapState=()=>JSON.stringify(S);
function commit(before){undoS.push(before);if(undoS.length>50)undoS.shift();redoS.length=0;changed();}
function changed(){try{localStorage.setItem('buildlab:current',snapState());}catch(e){}if(run)run=makeRun(S);renderProps();}
function restore(json){S=JSON.parse(json);NID=1+Math.max(0,...S.parts.map(p=>p.id),...S.wires.map(w=>w.id));if(sel&&!findPart(sel.id)&&!findWire(sel.id))sel=null;changed();}
function undo(){if(!undoS.length)return;redoS.push(snapState());restore(undoS.pop());status('Undone.');}
function redo(){if(!redoS.length)return;undoS.push(snapState());restore(redoS.pop());status('Redone.');}

// ---------- catalog ----------
(function(){const cat=$('bdCatalog');let h='';
  GROUPS.forEach(g=>{h+=`<h4>${g}</h4>`+Object.entries(PARTS).filter(([,T])=>T.group===g).map(([k,T])=>`<a class="bd-item" data-type="${k}"><span class="n">${T.icon}</span>${T.name}</a>`).join('');});
  cat.innerHTML=h;cat.querySelectorAll('.bd-item').forEach(a=>a.addEventListener('pointerdown',e=>{e.preventDefault();startNew(a.dataset.type,e);}));})();
(function(){const box=$('bdColors');WIRE_COLORS.forEach(([n,c],i)=>{const b=document.createElement('button');b.title=n+' wire';b.style.background=c;if(!i)b.classList.add('active');
  b.onclick=()=>{wireColor=c;box.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));const w=sel&&sel.kind==='wire'&&findWire(sel.id);if(w){const before=snapState();w.color=c;commit(before);}};box.appendChild(b);});})();

// ---------- pointer geometry ----------
function toBoard(e){const r=cvs.getBoundingClientRect();return [(e.clientX-r.left)*cvs.width/r.width,(e.clientY-r.top)*cvs.height/r.height,r.left<=e.clientX&&e.clientX<=r.right&&r.top<=e.clientY&&e.clientY<=r.bottom];}
function inBox(x,y,[bx,by,bw,bh]){return x>=bx&&x<=bx+bw&&y>=by&&y<=by+bh;}
function partAt(x,y){for(let i=S.parts.length-1;i>=0;i--)if(inBox(x,y,partBox(S.parts[i])))return S.parts[i];return null;}
const catEl=$('bdCatalog');
function overCatalog(e){const r=catEl.getBoundingClientRect();return r.width>0&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;}
// a leg of a 2-leg part under the pointer (it can be dragged to another hole, like a wire end)
const LEG_MAX=12*BB.dx;   // how far a leg can stretch from the other one
function legAt(x,y){let best=null,bd=5;S.parts.forEach(p=>{const T=PARTS[p.type];if(T.fixed||T.pins.length!==2)return;
  T.pins.forEach(pin=>{const [hx,hy]=HP(p.holes[pin]),d=Math.hypot(hx-x,hy-y);if(d<bd){bd=d;best={p,pin};}});});return best;}
function legTarget(d){const p=findPart(d.id),t=nearestHole(d.x,d.y,10);if(!p||!t)return null;const other=p.holes[PARTS[p.type].pins.find(k=>k!==d.pin)];
  let h=freeInStrip(S,t.h,p.id);if(h===other)h=freeInStrip(S,t.h);const [ax,ay]=HP(h),[bx,by]=HP(other);
  return {h,ok:h!==other&&Math.hypot(ax-bx,ay-by)<=LEG_MAX,far:Math.hypot(ax-bx,ay-by)>LEG_MAX,other};}
function wireEndAt(x,y){let best=null,bd=6;S.wires.forEach(w=>['a','b'].forEach(end=>{const [hx,hy]=HP(w[end]),d=Math.hypot(hx-x,hy-y);if(d<bd){bd=d;best={w,end};}}));return best;}
function wireAt(x,y){let best=null,bd=7;S.wires.forEach(w=>{const A=HP(w.a),B=HP(w.b),d=Math.hypot(B[0]-A[0],B[1]-A[1]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-Math.min(34,8+d*0.18);
  for(let t=0;t<=1;t+=0.05){const px=(1-t)*(1-t)*A[0]+2*(1-t)*t*mx+t*t*B[0],py=(1-t)*(1-t)*A[1]+2*(1-t)*t*my+t*t*B[1],dd=Math.hypot(px-x,py-y);if(dd<bd){bd=dd;best=w;}}});return best;}

// ---------- placing parts ----------
function placement(type,x,y,rot,skip){const T=PARTS[type];
  if(T.fixed){const other=S.parts.some(p=>p.type===type&&p.id!==skip);return {holes:{...T.fixed},ok:!other};}
  const a=anchorFor(type,x,y,rot);if(!a)return null;let holes=footHoles(type,a.r,a.c,rot);
  if(!fits(S,holes,skip))for(const dc of [1,-1,2,-2,3,-3]){const h2=footHoles(type,a.r,a.c+dc,rot);if(fits(S,h2,skip)){holes=h2;break;}}
  return {holes,ok:fits(S,holes,skip)};}
function startNew(type,e){const T=PARTS[type];if(T.unique&&S.parts.some(p=>p.type===type)){status(`There is already a ${T.name} on the board.`,'warn');return;}
  drag={mode:'new',type,rot:0,pl:null};follow(e);}
function shifted(p,dr,dc){const out={};for(const [pin,h] of Object.entries(p.holes)){const q=parseHole(h);if(!q||!holeExists(q.r+dr,q.c+dc))return null;out[pin]=holeName(q.r+dr,q.c+dc);}return out;}
function follow(e){const [x,y,over]=toBoard(e);drag.x=x;drag.y=y;drag.over=over;
  if(drag.mode==='new')drag.pl=over?placement(drag.type,x,y,drag.rot):null;
  else if(drag.mode==='move'){const p=findPart(drag.id),T=PARTS[p.type];if(T.fixed){drag.pl=null;return;}
    if(Math.hypot(x-drag.x0,y-drag.y0)>4)drag.moved=true;if(!drag.moved)return;
    const nh=nearestHole(x,y,999);let dr=nh.r-drag.gh.r,dc=nh.c-drag.gh.c;
    if(T.anchor==='e'||T.anchor==='f')dr=0;if(T.anchor==='rails')dr=(nh.r<7?0:12)-parseHole(p.holes['+']).r;
    const holes=shifted(p,dr,dc);drag.pl={holes,ok:fits(S,holes,p.id)};}}
function rotate(p){const T=PARTS[p.type];if(!T.rotate){status(`${T.name} can't be turned on a breadboard.`,'warn');return;}
  const q=parseHole(p.holes[T.pins[0]]),rot=((p.rot||0)+1)%4;let holes=footHoles(p.type,q.r,q.c,rot);
  if(!fits(S,holes,p.id))for(const [dr,dc] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,-1]]){const h2=footHoles(p.type,q.r+dr,q.c+dc,rot);if(fits(S,h2,p.id)){holes=h2;break;}}
  if(!fits(S,holes,p.id)){status('No room to turn it here: move it first.','warn');return;}
  const before=snapState();p.rot=rot;p.holes=holes;commit(before);}
function removeSel(){if(!sel)return;const before=snapState();
  if(sel.kind==='part')S.parts=S.parts.filter(p=>p.id!==sel.id);else S.wires=S.wires.filter(w=>w.id!==sel.id);sel=null;commit(before);}

// ---------- pointer events ----------
cvs.addEventListener('pointerdown',e=>{const [x,y]=toBoard(e);if(e.button)return;
  const p=partAt(x,y),h=nearestHole(x,y,6);
  if(run&&p&&p.type==='btn'&&!p.burnt){p.props.pressed=true;drag={mode:'press',id:p.id};sel={kind:'part',id:p.id};renderProps();return;}
  const we=wireEndAt(x,y);
  if(we){sel={kind:'wire',id:we.w.id};drag={mode:'wend',id:we.w.id,end:we.end,x,y,x0:x,y0:y,moved:false};renderProps();return;}
  const lg=legAt(x,y);
  if(lg){sel={kind:'part',id:lg.p.id};drag={mode:'leg',id:lg.p.id,pin:lg.pin,x,y,x0:x,y0:y,moved:false};renderProps();return;}
  // off parts, any hole starts a wire. On a part: its own legs, and holes outside the legs' rows (e.g. above an LED), start a wire;
  // the rest of the part (its body over its own row) moves it.
  let wireOk=h&&!p;
  if(h&&p&&!PARTS[p.type].fixed&&h.d<=5){const legs=Object.values(p.holes),rows=new Set(legs.map(l=>parseHole(l).r));wireOk=legs.includes(h.h)||!rows.has(h.r);}
  if(wireOk){drag={mode:'wire',a:freeInStrip(S,h.h),x,y};return;}
  if(p){sel={kind:'part',id:p.id};drag={mode:'move',id:p.id,x0:x,y0:y,gh:nearestHole(x,y,999),pl:null};renderProps();return;}
  const w=wireAt(x,y);sel=w?{kind:'wire',id:w.id}:null;renderProps();});
document.addEventListener('pointermove',e=>{if(drag&&(drag.mode==='move'||drag.mode==='wend'||drag.mode==='leg')){drag.trash=drag.moved&&overCatalog(e);catEl.classList.toggle('bd-trash',!!drag.trash);}
  if(drag&&drag.mode!=='press'){if(drag.mode==='wire'||drag.mode==='wend'||drag.mode==='leg'){const [x,y]=toBoard(e);drag.x=x;drag.y=y;if(Math.hypot(x-drag.x0,y-drag.y0)>4)drag.moved=true;}else follow(e);}
  else if(e.target===cvs){const [x,y]=toBoard(e);hov={x,y};cvs.style.cursor=wireEndAt(x,y)||legAt(x,y)?'grab':'';meter();}});
cvs.addEventListener('pointerleave',()=>{hov=null;});
document.addEventListener('pointerup',e=>{if(!drag)return;const d=drag;drag=null;catEl.classList.remove('bd-trash');
  if((d.mode==='move'||d.mode==='wend'||d.mode==='leg')&&d.moved&&overCatalog(e)){const before=snapState();
    if(d.mode!=='wend'){const p=findPart(d.id);S.parts=S.parts.filter(q=>q.id!==d.id);status(`${p?pname(p):'Part'} removed (Undo brings it back).`);}
    else{S.wires=S.wires.filter(w=>w.id!==d.id);status('Wire removed (Undo brings it back).');}
    sel=null;cvs.style.cursor='';commit(before);return;}
  if(d.mode==='press'){const p=findPart(d.id);if(p)p.props.pressed=false;renderProps();return;}
  if(d.mode==='new'&&d.pl&&d.pl.ok&&d.over){const T=PARTS[d.type],before=snapState(),p={id:NID++,type:d.type,holes:d.pl.holes,rot:d.rot,props:JSON.parse(JSON.stringify(T.props)),burnt:false};
    S.parts.push(p);sel={kind:'part',id:p.id};commit(before);status(`${T.name} placed. Drag its body to move it, a leg to re-plug it, R to turn it; to wire it, drag from a free hole of its strip.`);return;}
  if(d.mode==='new'&&d.over)status('No room there (red holes): try another place.','warn');
  if(d.mode==='move'&&d.moved&&d.pl){if(d.pl.ok){const p=findPart(d.id),before=snapState();p.holes=d.pl.holes;commit(before);}else status('No room there: the part stays where it was.','warn');}
  if(d.mode==='leg'){cvs.style.cursor='';if(!d.moved)return;const p=findPart(d.id),t=legTarget(d);
    if(!t){status('Not on a hole: the leg stays where it was.','warn');return;}
    if(t.h===p.holes[d.pin])return;
    if(t.h===t.other){status('Both legs cannot go in the same hole.','warn');return;}
    if(t.far){status('Too far: a leg only stretches about 12 holes. Move the whole part instead (drag its body).','warn');return;}
    const before=snapState();p.holes[d.pin]=t.h;commit(before);
    status(stripOf(t.h)===stripOf(t.other)?`${pname(p)}: both legs are now in the same strip, so it is short-circuited.`:`${pname(p)}: leg ${d.pin} moved to ${t.h}.`,stripOf(t.h)===stripOf(t.other)?'warn':(run?'run':''));return;}
  if(d.mode==='wend'){cvs.style.cursor='';const w=findWire(d.id);if(!w||!d.moved)return;const t=nearestHole(d.x,d.y,10);
    if(!t){status('Not on a hole: the wire stays where it was.','warn');return;}
    const other=w[d.end==='a'?'b':'a'],h=freeInStrip(S,t.h,w.id);
    if(h===w[d.end])return;
    if(h===other){status('Both ends of a wire cannot go in the same hole.','warn');return;}
    const before=snapState();w[d.end]=h;commit(before);
    status(stripOf(h)===stripOf(other)?'Wire moved, but both ends are now in the same strip: it does nothing.':`Wire end moved to ${h}.`,stripOf(h)===stripOf(other)?'warn':(run?'run':''));return;}
  if(d.mode==='wire'){const t=nearestHole(d.x,d.y,10);if(t){const b=freeInStrip(S,t.h);
    if(b&&d.a&&b!==d.a){const before=snapState(),w={id:NID++,a:d.a,b,color:wireColor};S.wires.push(w);sel={kind:'wire',id:w.id};commit(before);
      if(stripOf(b)===stripOf(d.a))status('That wire joins two holes that are already connected (same strip): it does nothing.','warn');else status('Wire added. Click it to change its colour, or drag one of its ends to another hole.');}}}});
document.addEventListener('keydown',e=>{if(!document.getElementById('page-build')||document.getElementById('page-build').hidden)return;
  if(/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName))return;
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();undo();}
  else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();redo();}
  else if(e.key==='Delete'||e.key==='Backspace'){if(sel){e.preventDefault();removeSel();}}
  else if(e.key==='r'||e.key==='R'){if(drag&&drag.mode==='new'){drag.rot=(drag.rot+1)%4;}else if(sel&&sel.kind==='part')rotate(findPart(sel.id));}
  else if(e.key==='Escape'){drag=null;sel=null;renderProps();}});

// ---------- properties panel ----------
function renderProps(){const body=$('bdPropsBody');
  if(!sel){body.className='hint';body.innerHTML='Click a part or a wire to see and change it.';return;}
  body.className='';
  if(sel.kind==='wire'){const w=findWire(sel.id);if(!w){sel=null;return renderProps();}
    body.innerHTML=`<div class="bd-row"><label>Wire</label><span>${w.a} → ${w.b}</span></div><div class="bd-row"><label>Colour</label>${WIRE_COLORS.map(([n,c])=>`<button class="bd-wc${c===w.color?' active':''}" data-c="${c}" title="${n}" style="width:22px;height:22px;padding:0;border-radius:50%;background:${c}"></button>`).join('')}</div>
      <div class="bd-row"><button class="stop" id="bdDelSel">🗑 Delete wire</button></div>`;
    body.querySelectorAll('.bd-wc').forEach(b=>b.onclick=()=>{const before=snapState();w.color=b.dataset.c;commit(before);});
    $('bdDelSel').onclick=removeSel;return;}
  const p=findPart(sel.id);if(!p){sel=null;return renderProps();}const T=PARTS[p.type];
  let h=`<div class="bd-row"><b>${pname(p)}</b>${p.burnt?' <span class="bd-burnt">🔥 burnt</span>':''}</div>`;
  if(p.burnt)h+=`<div class="bd-row"><button class="go" id="bdReplace">♻ Replace (same part)</button></div>`;
  T.edit.forEach((ed,i)=>{const v=p.props[ed.k];
    if(ed.opts)h+=`<div class="bd-row"><label>${ed.label}</label><select class="fsel" data-i="${i}">${ed.opts.map(([val,lab])=>`<option value="${val}"${String(val)===String(v)?' selected':''}>${lab}</option>`).join('')}</select></div>`;
    else if(ed.range)h+=`<div class="bd-row"><label>${ed.label}</label><input type="range" data-i="${i}" min="${ed.range[0]}" max="${ed.range[1]}" step="${ed.range[2]}" value="${v}" style="flex:1"></div>`;
    else if(ed.hold)h+=`<div class="bd-row"><label>${ed.label}</label><button id="bdHold">👆 Hold to press</button><span class="hint">or click the button on the board while playing</span></div>`;
    else if(ed.toggle)h+=`<div class="bd-row"><label>${ed.label}</label><button data-i="${i}" class="bd-tog${v?' active':''}">${v?ed.toggle[0]:ed.toggle[1]}</button></div>`;});
  h+=`<div class="bd-row">${T.rotate?'<button id="bdRotSel">↻ Rotate</button>':''}<button class="stop" id="bdDelSel">🗑 Delete</button></div>`;
  h+=`<div class="bd-row hint">Legs: ${Object.entries(p.holes).filter(()=>!T.fixed).map(([k,v])=>`${k}→${v}`).join(' · ')||'on the rails'}</div><div id="bdLive" class="bd-kv"></div>`;
  body.innerHTML=h;
  body.querySelectorAll('select[data-i]').forEach(s=>s.onchange=()=>{const ed=T.edit[+s.dataset.i],o=ed.opts.find(o=>String(o[0])===s.value);const before=snapState();p.props[ed.k]=o[0];commit(before);});
  body.querySelectorAll('input[type=range][data-i]').forEach(r=>{let before=null;r.oninput=()=>{if(!before)before=snapState();p.props[T.edit[+r.dataset.i].k]=+r.value;if(run){const pt=PARTS[p.type];const el=run.els.get(p.id);if(el&&pt.update)pt.update(el,p);}};
    r.onchange=()=>{if(before)commit(before);before=null;};});
  body.querySelectorAll('.bd-tog').forEach(b=>b.onclick=()=>{const ed=T.edit[+b.dataset.i];const before=snapState();p.props[ed.k]=!p.props[ed.k];commit(before);});
  if($('bdHold'))hold('bdHold',on=>{p.props.pressed=on;});
  if($('bdReplace'))$('bdReplace').onclick=()=>{const before=snapState();p.burnt=false;commit(before);status(`New ${T.name} in place.`,run?'run':'');};
  if($('bdRotSel'))$('bdRotSel').onclick=()=>rotate(p);
  $('bdDelSel').onclick=removeSel;}

// ---------- simulation ----------
const DYNAMIC=new Set(['ccap','ecap','motor','ne555']);
function makeRun(state){const N=nets(state),c=new Circuit(),node=new Map(),els=new Map();
  const sup=state.parts.find(p=>(p.type==='batt'||p.type==='usb')&&!p.burnt);const gnd=sup?N.of(sup.holes['−']):null;
  const nd=h=>{const n=N.of(h);if(n===gnd)return 0;if(!node.has(n))node.set(n,c.node());return node.get(n);};
  state.parts.forEach(p=>{if(p.burnt)return;const n={};Object.entries(p.holes).forEach(([pin,h])=>{n[pin]=nd(h);});els.set(p.id,PARTS[p.type].model(c,n,p));});
  return {c,N,gnd,node,els,w:new Map(),over:new Map(),dynamic:state.parts.some(p=>DYNAMIC.has(p.type)&&!p.burnt)};}
function stepRun(R,state,dt){state.parts.forEach(p=>{const T=PARTS[p.type],el=R.els.get(p.id);if(el&&T.update)T.update(el,p);});
  const n=R.dynamic?Math.max(1,Math.min(250,Math.round(dt/2e-4))):1;for(let i=0;i<n;i++)R.c.step(R.dynamic?2e-4:1e-3);
  state.parts.forEach(p=>{const el=R.els.get(p.id);R.w.set(p.id,el?PARTS[p.type].watch(el,p):null);});}
function nodeV(h){if(!run)return null;const n=run.N.of(h);if(n===run.gnd)return 0;const k=run.node.get(n);return k?run.c.v(k):null;}
function simFrame(dt){stepRun(run,S,dt);let burnt=false;
  S.parts.forEach(p=>{const w=run.w.get(p.id);if(!w||!w.over){run.over.delete(p.id);return;}const t=(run.over.get(p.id)||0)+dt;run.over.set(p.id,t);
    if(t>0.25){p.burnt=true;burnt=true;status(`💥 ${pname(p)} burnt: ${w.over}. Click it, then Replace.`,'warn');const [x,y,wd,ht]=partBox(p);for(let i=0;i<24;i++)smoke.push({x:x+wd/2,y:y+ht/2,vx:(Math.random()-0.5)*30,vy:-20-Math.random()*40,life:1.5+Math.random()});}});
  if(burnt){run=makeRun(S);try{localStorage.setItem('buildlab:current',snapState());}catch(e){}renderProps();}
  const live=$('bdLive');if(live&&sel&&sel.kind==='part'){const w=run.w.get(sel.id);live.innerHTML=w?w.info.map(([k,v])=>`<span>${k}</span><b>${v}</b>`).join(''):'';}}
function play(on){if(on){run=makeRun(S);$('bdPlay').textContent='■ Stop';$('bdPlay').className='stop';status('Running: hover a hole or a part to measure. Hold the push buttons with the mouse.','run');}
  else{run=null;$('bdPlay').textContent='▶ Play';$('bdPlay').className='go';status('Stopped.');S.parts.forEach(p=>{if(p.type==='btn')p.props.pressed=false;});}renderProps();meter();}
$('bdPlay').onclick=()=>play(!run);

// ---------- check ----------
$('bdCheck').onclick=()=>{let trial=null;
  try{const R=makeRun(S);for(let i=0;i<10;i++)stepRun(R,S,0.016);trial=S.parts.map(p=>({p,w:R.w.get(p.id)}));}catch(e){console.error(e);}
  const issues=checkCircuit(S,trial);$('bdInfoTitle').textContent='Check circuit';
  $('bdInfoBody').className='';$('bdInfoBody').innerHTML='<ul class="bd-issues">'+issues.map((it,i)=>`<li class="${it.lvl}" data-i="${i}">${it.lvl==='err'?'⛔':it.lvl==='warn'?'⚠️':'✅'} <span>${it.msg}</span></li>`).join('')+'</ul>';
  $('bdInfoBody').querySelectorAll('li').forEach(li=>li.onclick=()=>{const it=issues[+li.dataset.i];flashIds=new Set(it.ids);flashT=2.5;if(it.ids[0]){sel={kind:findPart(it.ids[0])?'part':'wire',id:it.ids[0]};renderProps();}});
  status(issues.some(i=>i.lvl==='err')?'Check: problems found (see below).':issues.some(i=>i.lvl==='warn')?'Check: a few things to look at (see below).':'Check: all good.',issues.some(i=>i.lvl!=='ok')?'warn':'run');};

// ---------- multimeter ----------
let meterText=null;
function meter(){const body=$('bdInfoBody');if($('bdInfoTitle').textContent!=='Multimeter')return;
  if(!run){meterText=null;body.className='hint';body.innerHTML='Press Play, then hover a hole, a wire or a part.';return;}
  if(!hov){meterText=null;return;}
  let h=nearestHole(hov.x,hov.y,7);const p=partAt(hov.x,hov.y);if(p&&h&&!Object.values(p.holes).includes(h.h))h=null;   // over a part: the part, except on its own legs
  const w=!h&&!p&&wireAt(hov.x,hov.y);body.className='';
  if(h){const v=nodeV(h.h);meterText={x:hov.x,y:hov.y,t:v==null?'not connected':fmtV(v)};body.innerHTML=`<div class="bd-kv"><span>Hole</span><b>${h.h}</b><span>Voltage (to −)</span><b>${v==null?'— not connected':fmtV(v)}</b></div>`;return;}
  if(w){const v=nodeV(w.a);meterText={x:hov.x,y:hov.y,t:v==null?'—':fmtV(v)};body.innerHTML=`<div class="bd-kv"><span>Wire</span><b>${w.a} → ${w.b}</b><span>Voltage (to −)</span><b>${v==null?'—':fmtV(v)}</b></div>`;return;}
  if(p){const ww=run.w.get(p.id);meterText=null;body.innerHTML=`<div class="bd-kv"><span>Part</span><b>${pname(p)}${p.burnt?' 🔥':''}</b>${ww?ww.info.map(([k,v])=>`<span>${k}</span><b>${v}</b>`).join(''):''}</div>`;return;}
  meterText=null;}

// ---------- drawing ----------
function drawGhost(ctx,type,holes,ok,rot){const p={id:-1,type,holes,rot,props:PARTS[type].props};ctx.save();ctx.globalAlpha=0.55;drawPart(ctx,p,null);ctx.restore();
  Object.values(holes).forEach(h=>{const [x,y]=HP(h);ctx.strokeStyle=ok?PAL.green:PAL.bad;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,5,0,7);ctx.stroke();});}
function draw(dt){const ctx=bctx;ctx.clearRect(0,0,cvs.width,cvs.height);drawBoard(ctx);
  S.wires.forEach(w=>{if(drag&&drag.mode==='wend'&&drag.moved&&drag.id===w.id){const o={t:'wire',a:w.a,b:w.b,c:w.color};o[drag.end]=[drag.x,drag.y];
      ctx.save();ctx.globalAlpha=0.85;partOn(ctx,o,false);ctx.restore();const t=nearestHole(drag.x,drag.y,10);
      if(t){const [hx,hy]=HP(t.h);ctx.strokeStyle=PAL.cyan;ctx.lineWidth=2;ctx.beginPath();ctx.arc(hx,hy,6,0,7);ctx.stroke();}return;}
    if(sel&&sel.kind==='wire'&&sel.id===w.id){ctx.save();ctx.shadowColor=PAL.cyan;ctx.shadowBlur=12;partOn(ctx,{t:'wire',a:w.a,b:w.b,c:w.color},false);ctx.restore();}partOn(ctx,{t:'wire',a:w.a,b:w.b,c:w.color},false);});
  S.parts.forEach(p=>{if(drag&&drag.mode==='leg'&&drag.moved&&drag.id===p.id&&!drag.trash){const t=legTarget(drag);
      const q={...p,holes:{...p.holes,[drag.pin]:t&&t.ok?t.h:[drag.x,drag.y]}};ctx.save();ctx.globalAlpha=0.85;drawPart(ctx,q,null);ctx.restore();
      if(t){const [hx,hy]=HP(t.h);ctx.strokeStyle=t.ok?PAL.cyan:PAL.bad;ctx.lineWidth=2;ctx.beginPath();ctx.arc(hx,hy,6,0,7);ctx.stroke();}return;}
    if(drag&&(drag.mode==='move'||drag.mode==='leg')&&drag.moved&&drag.id===p.id)ctx.globalAlpha=0.3;const w=run&&run.w.get(p.id);drawPart(ctx,p,p.type==='usb'?{on:!!run}:w);ctx.globalAlpha=1;});
  if(sel&&sel.kind==='wire'&&!(drag&&drag.mode==='wend'&&drag.moved)){const w=findWire(sel.id);if(w)[w.a,w.b].forEach(h=>{const [hx,hy]=HP(h);ctx.fillStyle=PAL.cyan;ctx.beginPath();ctx.arc(hx,hy,4,0,7);ctx.fill();});}
  if(sel&&sel.kind==='part'&&!(drag&&drag.mode==='leg'&&drag.moved)){const p=findPart(sel.id);if(p&&PARTS[p.type].pins.length===2&&!PARTS[p.type].fixed)Object.values(p.holes).forEach(h=>{const [hx,hy]=HP(h);ctx.fillStyle=PAL.cyan;ctx.beginPath();ctx.arc(hx,hy,3.5,0,7);ctx.fill();});}
  if(sel&&sel.kind==='part'){const p=findPart(sel.id);if(p){const [x,y,w,h]=partBox(p);ctx.setLineDash([4,3]);ctx.strokeStyle=PAL.cyan;ctx.lineWidth=1.5;ctx.strokeRect(x,y,w,h);ctx.setLineDash([]);}}
  if(flashT>0){flashT-=dt;if(Math.floor(flashT*4)%2===0)flashIds.forEach(id=>{const p=findPart(id);if(p){const [x,y,w,h]=partBox(p);ctx.strokeStyle=PAL.amber;ctx.lineWidth=3;ctx.strokeRect(x-3,y-3,w+6,h+6);}});}
  if(drag&&(drag.mode==='new'||drag.mode==='move')&&!drag.trash&&drag.pl&&drag.pl.holes)drawGhost(ctx,drag.mode==='new'?drag.type:findPart(drag.id).type,drag.pl.holes,drag.pl.ok,drag.rot);
  if(drag&&drag.mode==='wire'){const A=HP(drag.a);ctx.strokeStyle=wireColor;ctx.lineWidth=3;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(drag.x,drag.y);ctx.stroke();ctx.setLineDash([]);
    const t=nearestHole(drag.x,drag.y,10);if(t){const [x,y]=HP(t.h);ctx.strokeStyle=PAL.cyan;ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.stroke();}}
  if(hov&&!drag){const h=nearestHole(hov.x,hov.y,6);if(h){const [x,y]=HP(h.h);ctx.strokeStyle='rgba(34,211,238,.8)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,5,0,7);ctx.stroke();}}
  for(let i=smoke.length-1;i>=0;i--){const s=smoke[i];s.life-=dt;if(s.life<=0){smoke.splice(i,1);continue;}s.x+=s.vx*dt;s.y+=s.vy*dt;s.vy-=5*dt;
    ctx.fillStyle=`rgba(120,120,130,${Math.min(0.5,s.life*0.35)})`;ctx.beginPath();ctx.arc(s.x,s.y,6+(2.5-s.life)*6,0,7);ctx.fill();}
  if(meterText&&run){ctx.font='600 12px ui-monospace,monospace';const tw=ctx.measureText(meterText.t).width+12;let x=meterText.x+12,y=meterText.y-26;if(x+tw>cvs.width)x=meterText.x-tw-12;
    ctx.fillStyle='rgba(7,11,22,.92)';ctx.fillRect(x,y,tw,20);ctx.strokeStyle=PAL.cyan;ctx.strokeRect(x,y,tw,20);ctx.fillStyle=PAL.cyan;ctx.textAlign='left';ctx.fillText(meterText.t,x+6,y+14);}
  if(!S.parts.length&&!drag)txt(ctx,'Drag a part from the catalog and drop it here',cvs.width/2,380,PAL.muted,14);}
loop(dt=>{if(run)simFrame(dt);draw(dt);});

// ---------- toolbar ----------
$('bdUndo').onclick=undo;$('bdRedo').onclick=redo;$('bdDelete').onclick=removeSel;
$('bdRotate').onclick=()=>{if(sel&&sel.kind==='part')rotate(findPart(sel.id));else status('Select a part first (click it).','warn');};
$('bdClear').onclick=()=>{if(!S.parts.length&&!S.wires.length)return;const before=snapState();S={parts:[],wires:[]};sel=null;commit(before);status('Board cleared (Undo brings it back).');};

// ---------- save / open (in this browser) ----------
const STORE='buildlab:circuits';
const saved=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}');}catch(e){return {};}};
const modal=document.createElement('div');modal.className='bd-modal';modal.hidden=true;$('page-build').appendChild(modal);
function openModal(html){modal.innerHTML=`<div class="box">${html}</div>`;modal.hidden=false;modal.onclick=e=>{if(e.target===modal)modal.hidden=true;};}
$('bdSave').onclick=()=>{openModal(`<h3 class="flush">Save this circuit</h3><div class="bd-row"><input id="bdName" class="fsel" style="flex:1" placeholder="Name, e.g. LED + 470 Ω"></div><div class="bd-row"><button class="go" id="bdDoSave">💾 Save</button><button id="bdCancel">Cancel</button></div>`);
  const inp=$('bdName');inp.focus();$('bdCancel').onclick=()=>modal.hidden=true;
  const go=()=>{const n=inp.value.trim();if(!n)return;const all=saved();all[n]={at:new Date().toISOString(),s:S};try{localStorage.setItem(STORE,JSON.stringify(all));status(`Saved as "${n}".`);}catch(e){status('Could not save (browser storage blocked).','warn');}modal.hidden=true;};
  $('bdDoSave').onclick=go;inp.onkeydown=e=>{if(e.key==='Enter')go();};};
$('bdOpen').onclick=()=>{const all=saved(),names=Object.keys(all).sort();
  openModal(`<h3 class="flush">Open a saved circuit</h3>${names.length?`<ul class="bd-saved">${names.map(n=>`<li><span>${n.replace(/</g,'&lt;')}</span><button data-n="${encodeURIComponent(n)}" class="bd-o">Open</button><button data-n="${encodeURIComponent(n)}" class="bd-d stop">🗑</button></li>`).join('')}</ul>`:'<p class="hint">Nothing saved yet: build a circuit and press 💾 Save.</p>'}<div class="bd-row"><button id="bdCancel">Close</button></div>`);
  $('bdCancel').onclick=()=>modal.hidden=true;
  modal.querySelectorAll('.bd-o').forEach(b=>b.onclick=()=>{const n=decodeURIComponent(b.dataset.n);const before=snapState();S=JSON.parse(JSON.stringify(all[n].s));sel=null;NID=1+Math.max(0,...S.parts.map(p=>p.id),...S.wires.map(w=>w.id));commit(before);modal.hidden=true;status(`Opened "${n}".`);});
  modal.querySelectorAll('.bd-d').forEach(b=>b.onclick=()=>{const n=decodeURIComponent(b.dataset.n);const a2=saved();delete a2[n];try{localStorage.setItem(STORE,JSON.stringify(a2));}catch(e){}$('bdOpen').onclick();});};
try{const cur=localStorage.getItem('buildlab:current');if(cur){S=JSON.parse(cur);NID=1+Math.max(0,...S.parts.map(p=>p.id),...S.wires.map(w=>w.id));}}catch(e){}

// ---------- open a Circuits project in the lab (its final breadboard) ----------
const LED_BY_RGB={'239,68,68':'red','34,197,94':'green','250,204,21':'yellow','59,130,246':'blue','226,232,240':'white','248,250,252':'white'};
function capFrom(lab,dflt){const m=/([\d.]+)\s*([µunp])/.exec(lab||'');if(!m)return dflt;return +m[1]*{µ:1e-6,u:1e-6,n:1e-9,p:1e-12}[m[2]];}
function importLayout(L){if(!L||L.noBoard)return null;const out={parts:[],wires:[]};let id=1;const H=h=>typeof h==='string'&&parseHole(h)?h:null;
  for(const p of L.parts){if(p.until)continue;const add=(type,holes,props={})=>{if(Object.values(holes).some(h=>!h))throw 0;out.parts.push({id:id++,type,holes,rot:0,props:{...JSON.parse(JSON.stringify(PARTS[type].props)),...props},burnt:false});};
    try{switch(p.t){
      case 'wire':if(!H(p.a)||!H(p.b))return null;out.wires.push({id:id++,a:p.a,b:p.b,color:p.c||PAL.greenDark});break;
      case 'res':add('res',{'1':H(p.a),'2':H(p.b)},{R:p.v||470});break;
      case 'led':add('led',{'+':H(p.a),'−':H(p.b)},{color:LED_BY_RGB[p.rgb||'239,68,68']||'red'});break;
      case 'ecap':add('ecap',{'+':H(p.a),'−':H(p.b)},{C:capFrom(p.lab,100e-6)});break;
      case 'ccap':add('ccap',{'1':H(p.a),'2':H(p.b)},{C:capFrom(p.lab,100e-9)});break;
      case 'diode':add('d4007',{A:H(p.a),K:H(p.b)});break;
      case 'buz':add('buz',{'+':H(p.a),'−':H(p.b)});break;
      case 'ldr':add('ldr',{'1':H(p.a),'2':H(p.b)});break;
      case 'npn':add('npn',{C:H(p.c),B:H(p.b),E:H(p.e)},{kind:L.parts.some(q=>q.t==='box'&&/motor/i.test(q.lab||''))?'SS8050':'BC547'});break;
      case 'pot':add('pot',{'1':H(p.h[0]),W:H(p.h[1]),'3':H(p.h[2])});break;
      case 'btn':add('btn',{'1a':'e'+p.col,'2a':'e'+(p.col+2),'1b':'f'+p.col,'2b':'f'+(p.col+2)});break;
      case 'chip':if(p.n!==8||!/555/.test(p.lab||''))return null;{const c=p.col,hs={};for(let i=0;i<4;i++){hs[String(i+1)]='f'+(c+i);hs[String(8-i)]='e'+(c+i);}add('ne555',hs);}break;
      case 'batt':add('batt',{'+':H(p.plus),'−':H(p.minus)},{V:parseFloat(p.lab)||9});break;
      case 'pm':add('usb',{...PARTS.usb.fixed});break;
      case 'box':if(/motor/i.test(p.lab||'')&&p.pins&&p.pins.length===2){add('motor',{'1':H(p.pins[0].to),'2':H(p.pins[1].to)});break;}return null;
      case 'note':break;
      default:return null;}}catch(e){return null;}}
  return out;}
window.BUILD_LAB={canImport:L=>!!importLayout(L),load:(L,name)=>{const s=importLayout(L);if(!s)return false;const before=snapState();S=s;NID=1+Math.max(0,...S.parts.map(p=>p.id),...S.wires.map(w=>w.id));sel=null;commit(before);if(run)play(false);status(`Loaded ${name||'the project'}: press ▶ Play.`);return true;}};
document.querySelectorAll('.bd-open[data-project]').forEach(b=>{const L=window.BBL_LAYOUTS&&window.BBL_LAYOUTS[b.dataset.project];if(L&&window.BUILD_LAB.canImport(L)){b.hidden=false;
  b.onclick=()=>{window.BUILD_LAB.load(L,'project '+b.dataset.project.replace(/^p/,''));location.hash='#build';};}});
renderProps();
