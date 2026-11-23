
// ===== Pinout + inside-the-chip schematics =====
(function(){
const TC={pwr:PAL.bad,gnd:PAL.muted,in:PAL.blue,out:PAL.good,ctl:PAL.amber};
const TN={pwr:'Power +',gnd:'Ground',in:'Input',out:'Output',ctl:'Control / setting'};
// [pin, name, type, what it's for, how to connect]
const CH=Object.fromEntries(Object.entries(CHIPS).map(([k,c])=>[k,c.pinout]));
const pinOf=(k,n)=>CH[k].pins.find(p=>p[0]===n);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
// ---------- package drawings ----------
function dipSVG(k){const P=CH[k].pins,n=P.length,h=n/2,sp=n>20?28:40,top=34,H=top+h*sp+14,bx=165,bw=130;
  let s=`<svg viewBox="0 0 460 ${H+16}" class="pinsvg">`;
  s+=`<rect x="${bx}" y="${top-10}" width="${bw}" height="${h*sp+10}" rx="8" fill="${PAL.chip}" stroke="${PAL.slate}" stroke-width="2"/>`;
  s+=`<path d="M${bx+bw/2-16} ${top-10} a16 16 0 0 0 32 0" fill="${PAL.canvas}" stroke="${PAL.slate}" stroke-width="2"/><circle cx="${bx+18}" cy="${top+8}" r="5" fill="${PAL.canvas}" stroke="${PAL.muted2}"/>`;
  s+=`<text x="${bx+bw/2}" y="${top+h*sp/2}" fill="${PAL.ink2}" font-size="15" font-weight="700" text-anchor="middle" transform="rotate(-90 ${bx+bw/2} ${top+h*sp/2})">${esc(CH[k].title.split(' ')[0])}</text>`;
  P.forEach(([num,name,t])=>{const left=num<=h,r=left?num-1:n-num,y=top+r*sp+14,c=TC[t];
    const x0=left?bx-32:bx+bw;
    s+=`<g class="pp" data-pin="${num}"><rect x="${x0}" y="${y-7}" width="32" height="14" rx="2" fill="${c}" stroke="${c}"/>`;
    s+=`<text x="${left?bx+10:bx+bw-10}" y="${y+5}" fill="${PAL.ink}" font-size="13" font-weight="700" text-anchor="${left?'start':'end'}">${num}</text>`;
    s+=`<text x="${left?x0-8:x0+40}" y="${y+5}" fill="${c}" font-size="14" font-weight="700" text-anchor="${left?'end':'start'}">${esc(name)}</text>`;
    s+=`<rect x="${left?0:x0}" y="${y-16}" width="${left?bx:460-x0}" height="32" fill="transparent"/></g>`;});
  s+=`<text x="230" y="${H+10}" fill="${PAL.muted2}" font-size="12" text-anchor="middle">seen from above · notch at the top · pin 1 by the dot</text>`;
  return s+'</svg>';}
function to220SVG(k){const P=CH[k].pins;let s=`<svg viewBox="0 0 460 330" class="pinsvg">`;
  s+=`<rect x="160" y="14" width="140" height="70" rx="4" fill="${PAL.muted}" stroke="${PAL.ink2}"/><circle cx="230" cy="46" r="14" fill="${PAL.canvas}"/>`;
  s+=`<rect x="160" y="80" width="140" height="110" rx="4" fill="${PAL.chip}" stroke="${PAL.slate}" stroke-width="2"/><text x="230" y="130" fill="${PAL.ink2}" font-size="17" font-weight="700" text-anchor="middle">L7805</text><text x="230" y="152" fill="${PAL.muted2}" font-size="12" text-anchor="middle">writing facing you</text>`;
  P.forEach(([num,name,t],i)=>{const x=185+i*45,c=TC[t];s+=`<g class="pp" data-pin="${num}"><rect x="${x-6}" y="190" width="12" height="80" fill="${c}"/><text x="${x}" y="290" fill="${c}" font-size="14" font-weight="700" text-anchor="middle">${num}</text><text x="${x}" y="310" fill="${c}" font-size="14" font-weight="700" text-anchor="middle">${name}</text><rect x="${x-22}" y="186" width="44" height="130" fill="transparent"/></g>`;});
  s+=`<text x="330" y="50" fill="${PAL.muted}" font-size="12">metal tab = GND</text><text x="330" y="66" fill="${PAL.muted}" font-size="12">(bolt a heatsink here)</text>`;
  return s+'</svg>';}
// ---------- schematic helpers ----------
let CUR='';
const ln=(pts,pin,c=PAL.muted)=>`<polyline ${pin?`class="wp" data-pin="${pin}"`:''} points="${pts}" fill="none" stroke="${c}" stroke-width="2"/>`;
const tx=(x,y,t,o={})=>`<text x="${x}" y="${y}" fill="${o.c||PAL.ink2}" font-size="${o.s||12}" font-weight="${o.b?700:400}" text-anchor="${o.a||'middle'}">${esc(t)}</text>`;
const bx=(x,y,w,h,t,c=PAL.slateDark)=>{const L=t.split('\n');return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${PAL.panel}" stroke="${c}" stroke-width="2"/>`+L.map((l,i)=>tx(x+w/2,y+h/2+5+(i-(L.length-1)/2)*15,l,{s:12,b:i===0,c:i===0?PAL.ink:PAL.muted})).join('');};
const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.5" fill="${PAL.muted}"/>`;
function tp(x,y,n,side){const p=pinOf(CUR,n),c=TC[p[2]];const lab=`${n} ${p[1]}`;
  const L={l:[x-10,y+4,'end'],r:[x+10,y+4,'start'],t:[x,y-11,'middle'],b:[x,y+20,'middle']}[side];
  return `<g class="pp" data-pin="${n}"><rect x="${x-6}" y="${y-6}" width="12" height="12" rx="2" fill="${c}"/>${tx(L[0],L[1],lab,{c,b:1,a:L[2],s:13})}<rect x="${x-30}" y="${y-18}" width="60" height="36" fill="transparent"/></g>`;}
function cmp(x,y,lab,flip){const d=flip?-1:1,w=70;let s=`<path d="M${x} ${y-30}L${x+d*w} ${y}L${x} ${y+30}Z" fill="${PAL.panel}" stroke="${PAL.ink2}" stroke-width="2"/>`;
  s+=tx(x+d*10,y-8,'−',{s:15,b:1,c:PAL.ink})+tx(x+d*10,y+19,'+',{s:15,b:1,c:PAL.ink});if(lab)s+=tx(x+d*w/2,y+48,lab,{s:11,c:PAL.muted});return s;}
function res(x,y1,y2,lab,hor){const n=6;let p=[];if(!hor){const h=(y2-y1)/n;for(let i=0;i<=n;i++)p.push(`${x+(i===0||i===n?0:(i%2?8:-8))},${y1+i*h}`);return ln(p.join(' '))+(lab?tx(x+14,(y1+y2)/2+4,lab,{a:'start',s:11,c:PAL.muted}):'');}
  const w=(y2-y1)/n;for(let i=0;i<=n;i++)p.push(`${y1+i*w},${x+(i===0||i===n?0:(i%2?8:-8))}`);return ln(p.join(' '))+(lab?tx((y1+y2)/2,x-12,lab,{s:11,c:PAL.muted}):'');}
const gnd=(x,y)=>`<path d="M${x-10} ${y}h20M${x-6} ${y+5}h12M${x-2} ${y+10}h4" stroke="${PAL.muted}" stroke-width="2"/>`;
const arrow=(x1,y,x2,pin)=>ln(`${x1},${y} ${x2},${y}`,pin)+`<path d="M${x2} ${y}l-8 -5v10z" fill="${PAL.muted}"/>`;
// ---------- inside each chip ----------
const IN=Object.fromEntries(Object.entries(CHIPS).map(([k,c])=>[k,c.inside]));
function build(el){const k=el.dataset.chip,C=CH[k];CUR=k;const I=IN[k]({ln,tx,bx,dot,tp,cmp,res,gnd,arrow});
  const leg=Object.keys(TC).map(t=>`<span><i style="background:${TC[t]}"></i>${TN[t]}</span>`).join('');
  el.innerHTML=`<div class="cx-grid"><figure><figcaption>📌 Pinout: the real chip</figcaption>${C.pkg==='dip'?dipSVG(k):to220SVG(k)}</figure>
  <figure><figcaption>🧩 Inside the chip (simplified schematic)</figcaption><svg viewBox="${I.vb}" class="pinsvg">${I.s}</svg></figure></div>
  <div class="cx-leg">${leg}</div><div class="cx-det"></div>
  <div class="cx-tw"><table class="cx-tab"><tr><td>Pin</td><td>Name</td><td>What it's for</td><td>How to connect it</td></tr>${C.pins.map(p=>`<tr data-pin="${p[0]}"><td><b style="color:${TC[p[2]]}">${p[0]}</b></td><td><b style="color:${TC[p[2]]}">${esc(p[1])}</b><br><small>${TN[p[2]]}</small></td><td>${esc(p[3])}</td><td>${esc(p[4]||(p[2]==='out'?'Same as '+C.pins.find(q=>q[2]==='out'&&q[4])[1]+'.':'—'))}</td></tr>`).join('')}</table></div>`;
  const det=el.querySelector('.cx-det');const conn=p=>p[4]||(p[2]==='out'?'Same as '+C.pins.find(q=>q[2]==='out'&&q[4])[1]+'.':'');
  function sel(n){el.querySelectorAll('[data-pin]').forEach(e=>e.classList.toggle('sel',+e.dataset.pin===n));const p=pinOf(k,n);
    det.innerHTML=`<b style="color:${TC[p[2]]}">Pin ${p[0]} · ${esc(p[1])}</b> <small>(${TN[p[2]]})</small><br>${esc(p[3])}${conn(p)?`<br><span class="cx-how">🔌 ${esc(conn(p))}</span>`:''}`;}
  el.querySelectorAll('[data-pin]').forEach(e=>{if(e.classList.contains('wp'))return;e.addEventListener('click',()=>sel(+e.dataset.pin));e.addEventListener('mouseenter',()=>sel(+e.dataset.pin));});
  sel(C.pins[0][0]);}
document.querySelectorAll('.chipx').forEach(build);

// ---------- chips menu: one chip at a time ----------

const CH_ART={chfam:`<svg viewBox="0 0 320 200"><text x="160" y="95" text-anchor="middle" font-size="40" font-weight="800" font-family="ui-monospace,monospace"><tspan fill="${PAL.violet}">NE</tspan><tspan fill="${PAL.green}">555</tspan><tspan fill="${PAL.amber}">P</tspan></text><text x="70" y="140" text-anchor="middle" fill="${PAL.violet}" font-size="13" font-family="system-ui">maker/family</text><text x="170" y="140" text-anchor="middle" fill="${PAL.green}" font-size="13" font-family="system-ui">function</text><text x="262" y="140" text-anchor="middle" fill="${PAL.amber}" font-size="13" font-family="system-ui">package</text></svg>`,...Object.fromEntries(Object.entries(CHIPS).map(([k,c])=>['s'+k,c.art]))};

sectionMenu('chips-menu',{first:'chwhat',onSelect:id=>heroSwap('chips',CH_ART[id])});

// ---------- part-number decoder ----------
(()=>{const PN={
 'NE555P':[['NE',PAL.violet,'Signetics linear line, 0–70 °C grade'],['555',PAL.green,'the 555 timer'],['P',PAL.amber,'plastic DIP-8: breadboard ✓']],
 'LM358N':[['LM',PAL.violet,'Linear Monolithic (National → TI)'],['358',PAL.green,'dual op-amp'],['N',PAL.amber,'DIP-8']],
 'L7805CV':[['L',PAL.violet,'made by STMicroelectronics'],['78',PAL.green,'positive fixed regulator'],['05',PAL.sky,'5 volts'],['C',PAL.muted,'commercial temperature'],['V',PAL.amber,'TO-220 package']],
 'CD4017BE':[['CD',PAL.violet,'CMOS 4000 series (originally RCA)'],['4017',PAL.green,'decade counter'],['B',PAL.muted,'buffered (standard) version'],['E',PAL.amber,'plastic DIP-16 (TI)']],
 'SN74HC595N':[['SN',PAL.violet,'Texas Instruments'],['74',PAL.green,'7400 logic family'],['HC',PAL.sky,'high-speed CMOS, 2–6 V'],['595',PAL.green,'8-bit shift register'],['N',PAL.amber,'DIP-16']],
 'ATmega328P-PU':[['AT',PAL.violet,'Atmel (now Microchip)'],['mega',PAL.sky,'the megaAVR family'],['32',PAL.green,'32 KB of program memory'],['8',PAL.green,'family member'],['P',PAL.muted,'picoPower (low power)'],['-PU',PAL.amber,'DIP-28, industrial temp']],
 'LM35DZ':[['LM',PAL.violet,'Linear Monolithic'],['35',PAL.green,'temperature sensor 10 mV/°C'],['D',PAL.muted,'accuracy grade (0–100 °C)'],['Z',PAL.amber,'TO-92 package']],
 'LM3914N':[['LM',PAL.violet,'Linear Monolithic'],['3914',PAL.green,'10-LED bar-graph driver (linear)'],['N',PAL.amber,'DIP-18']],
 'TP4056':[['TP',PAL.violet,'Top Power (NanJing)'],['4056',PAL.green,'1 A Li-ion charger'],['',PAL.amber,'sold in SOP-8 (surface-mount) only']]};
 const box=document.getElementById('pnBtns'),out=document.getElementById('pnOut');if(!box)return;
 function show(k){box.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.textContent===k));
  out.innerHTML='<div class="pnname">'+PN[k].map(([t,c])=>t?`<span style="color:${c};border-bottom:3px solid ${c}">${t}</span>`:'').join('')+'</div><ul>'+PN[k].map(([t,c,d])=>`<li><b style="color:${c}">${t||'(no suffix)'}</b> → ${d}</li>`).join('')+'</ul>';}
 Object.keys(PN).forEach(k=>{const b=document.createElement('button');b.textContent=k;b.onclick=()=>show(k);box.appendChild(b);});show('NE555P');})();
})();



// ===== Minimal circuits: every leg connected =====
(function(){
// row: [pin, branches, why]; branch = [chain, dest]; chain items 'R:1 kΩ','C:10 µF+','C:100 nF','LED:r','POT:10 kΩ','LDR','SPK','XTAL:16 MHz','BTN','D'
// dest: 'V9','V5','GND','NC','P6' (wire to pin 6), 'T:text' (to something else), 'IN:text' (signal coming in)
const MIN=Object.fromEntries(Object.entries(CHIPS).map(([k,c])=>[k,c.minimal]));
const NS='http://www.w3.org/2000/svg';
const COL={line:PAL.muted,res:'#e7c99a',cap:PAL.blue,gnd:PAL.muted,vcc:PAL.bad,sig:PAL.sky,pin:PAL.yellow};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
function partSVG(kind,x,y,dir,below,toChip){// draws a part centred at x along a horizontal line, width 56
  const [k,lab]=kind.split(':');const L=x-28,R=x+28;let s='';const t=(tx,c)=>`<text x="${x}" y="${below?y+21:y-13}" text-anchor="middle" font-size="10.5" fill="${c||PAL.ink2}">${esc(tx)}</text>`;
  if(k==='R'){s+=`<line x1="${L}" y1="${y}" x2="${x-16}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><rect x="${x-16}" y="${y-6}" width="32" height="12" rx="2" fill="${PAL.canvas}" stroke="${COL.res}" stroke-width="2"/><line x1="${x+16}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t(lab);}
  else if(k==='C'){const pol=lab.endsWith('+');const v=pol?lab.slice(0,-1):lab;s+=`<line x1="${L}" y1="${y}" x2="${x-4}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><line x1="${x-4}" y1="${y-9}" x2="${x-4}" y2="${y+9}" stroke="${COL.cap}" stroke-width="3"/><line x1="${x+4}" y1="${y-9}" x2="${x+4}" y2="${y+9}" stroke="${COL.cap}" stroke-width="3"/><line x1="${x+4}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t(v)+(pol?`<text x="${dir<0?x+10:x-10}" y="${below?y-10:y+16}" text-anchor="middle" font-size="11" fill="${PAL.bad}">+</text>`:'');}
  else if(k==='LED'){const c=lab==='g'?PAL.green:PAL.bad;if(toChip)dir=-dir;// anode towards chip? we draw triangle pointing away from chip
    s+=`<line x1="${L}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><path d="M${x-8*dir} ${y-8}L${x+8*dir} ${y}L${x-8*dir} ${y+8}Z" fill="${c}" stroke="${c}"/><line x1="${x+8*dir}" y1="${y-8}" x2="${x+8*dir}" y2="${y+8}" stroke="${c}" stroke-width="2.5"/><path d="M${x} ${y-11}l5 -6M${x+6} ${y-9}l5 -6" stroke="${c}" stroke-width="1.5"/>`;}
  else if(k==='POT'){s+=`<line x1="${L}" y1="${y}" x2="${x-16}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><rect x="${x-16}" y="${y-6}" width="32" height="12" rx="2" fill="${PAL.canvas}" stroke="${PAL.blueDark}" stroke-width="2"/><path d="M${x-10} ${y+12}L${x+10} ${y-12}" stroke="${PAL.blueDark}" stroke-width="2"/><line x1="${x+16}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t(lab||'pot');}
  else if(k==='LDR'){s+=`<line x1="${L}" y1="${y}" x2="${x-16}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><rect x="${x-16}" y="${y-6}" width="32" height="12" rx="2" fill="${PAL.canvas}" stroke="${PAL.orangeSoft}" stroke-width="2"/><line x1="${x+16}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><path d="M${x-14} ${y-20}l7 8M${x-6} ${y-22}l7 8" stroke="${PAL.yellow}" stroke-width="1.5"/>`+t('LDR',PAL.orangeSoft);}
  else if(k==='SPK'){s+=`<line x1="${L}" y1="${y}" x2="${x-8}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><rect x="${x-8}" y="${y-6}" width="8" height="12" fill="${PAL.ink2}"/><path d="M${x} ${y-6}L${x+10} ${y-13}V${y+13}L${x} ${y+6}Z" fill="${PAL.ink2}"/><line x1="${x+10}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t('8 Ω');}
  else if(k==='XTAL'){s+=`<line x1="${L}" y1="${y}" x2="${x-9}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><rect x="${x-5}" y="${y-9}" width="10" height="18" fill="${PAL.canvas}" stroke="${PAL.ink2}" stroke-width="2"/><line x1="${x-9}" y1="${y-9}" x2="${x-9}" y2="${y+9}" stroke="${PAL.ink2}" stroke-width="2"/><line x1="${x+9}" y1="${y-9}" x2="${x+9}" y2="${y+9}" stroke="${PAL.ink2}" stroke-width="2"/><line x1="${x+9}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t(lab);}
  else if(k==='BTN'){s+=`<line x1="${L}" y1="${y}" x2="${x-12}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><line x1="${x-12}" y1="${y}" x2="${x+10}" y2="${y-9}" stroke="${PAL.ink2}" stroke-width="2"/><line x1="${x+12}" y1="${y}" x2="${R}" y2="${y}" stroke="${COL.line}" stroke-width="2"/>`+t('switch');}
  return s;}
function destSVG(d,x,y,dir){const a=dir<0?'end':'start';let s='';
  if(d==='GND'){s+=`<line x1="${x}" y1="${y}" x2="${x+8*dir}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><path d="M${x+8*dir} ${y-8}V${y+8}M${x+13*dir} ${y-5}V${y+5}M${x+18*dir} ${y-2}V${y+2}" stroke="${COL.gnd}" stroke-width="2"/><text x="${x+24*dir}" y="${y+4}" text-anchor="${a}" font-size="11" fill="${PAL.muted}">GND</text>`;}
  else if(d==='V9'||d==='V5'){const v=d==='V9'?'+9 V':'+5 V';s+=`<line x1="${x}" y1="${y}" x2="${x+10*dir}" y2="${y}" stroke="${COL.vcc}" stroke-width="2"/><line x1="${x+10*dir}" y1="${y-8}" x2="${x+10*dir}" y2="${y+8}" stroke="${COL.vcc}" stroke-width="3"/><text x="${x+16*dir}" y="${y+4}" text-anchor="${a}" font-size="11" font-weight="700" fill="${COL.vcc}">${v}</text>`;}
  else if(d==='NC'){s+=`<path d="M${x+2*dir-4} ${y-4}l8 8M${x+2*dir+4} ${y-4}l-8 8" stroke="${PAL.muted2}" stroke-width="2"/><text x="${x+12*dir}" y="${y+4}" text-anchor="${a}" font-size="11" fill="${PAL.muted2}">not connected</text>`;}
  else if(d[0]==='P'){const n=d.slice(1);s+=`<line x1="${x}" y1="${y}" x2="${x+6*dir}" y2="${y}" stroke="${COL.pin}" stroke-width="2"/><rect x="${dir<0?x-62:x+6}" y="${y-9}" width="56" height="18" rx="9" fill="none" stroke="${COL.pin}" stroke-width="1.5"/><text x="${dir<0?x-34:x+34}" y="${y+4}" text-anchor="middle" font-size="11" font-weight="700" fill="${COL.pin}">↔ pin ${n}</text>`;}
  else{const isIn=d.startsWith('IN:');const tx=d.slice(isIn?3:2);s+=`<text x="${x+4*dir}" y="${y+4}" text-anchor="${a}" font-size="11" fill="${isIn?COL.sig:PAL.ink2}">${isIn?(dir<0?'':'')+'⟵ ':''}${esc(tx)}${isIn&&dir>0?'':''}</text>`;}
  return s;}
function describe(br){return br.map(([ch,d])=>{const parts=ch.map(c=>{const [k,l]=c.split(':');return {R:'resistor '+l,C:'capacitor '+(l||'').replace('+',' (+ towards the pin)'),LED:(l==='g'?'green ':'red ')+'LED',POT:'trimmer '+(l||''),LDR:'LDR',SPK:'speaker',XTAL:'crystal '+l,BTN:'switch'}[k];});
  const dd=d==='GND'?'ground (−)':d==='V9'?'+9 V':d==='V5'?'+5 V':d==='NC'?'nothing':d[0]==='P'?'pin '+d.slice(1):d.slice(d.startsWith('IN:')?3:2);return (parts.length?parts.join(' → ')+' → ':'')+dd;}).join('<br>+ ');}
function build(el){const k=el.dataset.chip,M=MIN[k];if(!M)return;const rows=M.rows,n=rows.length,h=Math.ceil(n/2),left=M.side==='left';
  const sp=Math.max(...rows.map(r=>r[1].length))>1?86:46,top=70,cw=110,cx=440,chL=cx-cw/2,chR=cx+cw/2,H=top+(left?n:h)*sp+30;
  let s=`<svg viewBox="0 0 880 ${H}" class="pinsvg">`;
  s+=`<text x="440" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="${PAL.ink}">${esc(M.title)}</text><text x="440" y="42" text-anchor="middle" font-size="12" fill="${PAL.muted}">${esc(M.sub)}</text>`;
  s+=`<rect x="${chL}" y="${top-14}" width="${cw}" height="${(left?n:h)*sp+8}" rx="8" fill="${PAL.chip}" stroke="${PAL.slate}" stroke-width="2"/>`;
  if(!left)s+=`<path d="M${cx-14} ${top-14} a14 14 0 0 0 28 0" fill="${PAL.canvas}" stroke="${PAL.slate}" stroke-width="2"/>`;
  rows.forEach(([p,br,why],idx)=>{let side,r;if(left){side=-1;r=idx;}else{side=p<=h?-1:1;r=p<=h?p-1:n-p;}const y=top+r*sp+sp/2-10;const x0=side<0?chL:chR;
    s+=`<g class="mrow" data-pin="${p}"><rect x="${side<0?0:chR}" y="${y-sp/2+2}" width="${side<0?chL:880-chR}" height="${sp-4}" fill="transparent"/>`;
    s+=`<rect x="${side<0?x0-14:x0}" y="${y-5}" width="14" height="10" fill="${PAL.ink2}"/><text x="${side<0?x0+8:x0-8}" y="${y+4}" text-anchor="${side<0?'start':'end'}" font-size="11" font-weight="700" fill="${PAL.ink}">${p}</text>`;
    const offs=br.length>1?[-15,15]:[0];
    br.forEach(([ch,d],bi)=>{const yy=y+offs[bi];let x=x0+14*side;if(br.length>1){s+=`<line x1="${x}" y1="${y}" x2="${x+10*side}" y2="${y}" stroke="${COL.line}" stroke-width="2"/><line x1="${x+10*side}" y1="${y}" x2="${x+10*side}" y2="${yy}" stroke="${COL.line}" stroke-width="2"/>`;x+=10*side;if(bi===0)s+=`<circle cx="${x}" cy="${y}" r="3" fill="${COL.line}"/>`;}
      s+=`<line x1="${x}" y1="${yy}" x2="${x+14*side}" y2="${yy}" stroke="${COL.line}" stroke-width="2"/>`;x+=14*side;
      ch.forEach(c=>{s+=partSVG(c,x+28*side,yy,side,bi===1,d==='V9'||d==='V5');x+=56*side;});
      s+=`<line x1="${x}" y1="${yy}" x2="${x+10*side}" y2="${yy}" stroke="${COL.line}" stroke-width="2"/>`+destSVG(d,x+10*side,yy,side);});
    s+='</g>';});
  s+=`<text x="440" y="${H-8}" text-anchor="middle" font-size="11" fill="${PAL.muted2}">${left?'legs numbered 1-2-3 from left to right, writing facing you':'same leg positions as the real chip, seen from above'}</text></svg>`;
  const pinName=p=>{const C=window.__CH&&window.__CH[k];return '';};
  el.innerHTML=`<div class="cmfig">${s}</div><div class="cx-tw"><table class="cx-tab cm-tab"><tr><td>Pin</td><td>Connect to</td><td>Why</td></tr>${rows.map(([p,br,why])=>`<tr data-pin="${p}"><td><b>${p}</b></td><td>${describe(br)}</td><td>${esc(why)}</td></tr>`).join('')}</table></div>`;
  const sel=p=>el.querySelectorAll('[data-pin]').forEach(e=>e.classList.toggle('sel',+e.dataset.pin===p));
  el.querySelectorAll('[data-pin]').forEach(e=>{e.addEventListener('mouseenter',()=>sel(+e.dataset.pin));e.addEventListener('click',()=>sel(+e.dataset.pin));});}
document.querySelectorAll('.chmin').forEach(build);
})();


// ===== anatomy of a DIP chip (first section) =====
// ===== 1. Anatomy =====
(function(){const c=$('cDip'),ctx=c.getContext('2d');const x=120,y=40,w=110,sp=36;
  ctx.fillStyle=PAL.chip;ctx.fillRect(x,y,w,4*sp+10);ctx.strokeStyle=PAL.slate;ctx.lineWidth=2;ctx.strokeRect(x,y,w,4*sp+10);
  ctx.fillStyle=PAL.canvas;ctx.beginPath();ctx.arc(x+w/2,y,12,0,Math.PI);ctx.fill();ctx.fillStyle=PAL.muted;ctx.beginPath();ctx.arc(x+18,y+18,5,0,7);ctx.fill();
  for(let i=0;i<4;i++){const py=y+22+i*sp;ctx.fillStyle=PAL.ink2;ctx.fillRect(x-20,py-4,20,8);ctx.fillRect(x+w,py-4,20,8);
    arrowText(ctx,String(i+1),x-28,py+5,PAL.yellow,14,'right');arrowText(ctx,String(8-i),x+w+28,py+5,PAL.yellow,14,'left');}
  ctx.strokeStyle=PAL.yellow;ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.ellipse(x+w/2,y+80,w/2+50,90,0,-2.6,2.6,true);ctx.stroke();ctx.setLineDash([]);
  arrowText(ctx,'notch',x+w/2,y-14,PAL.muted,12);arrowText(ctx,'dot = pin 1',x+30,y+42,PAL.muted,11,'left');
  arrowText(ctx,'anticlockwise ↺',x+w/2,y+4*sp+40,PAL.yellow,13);
  // die zoom
  const dx=470,dy=40;ctx.fillStyle=PAL.slateDark;ctx.fillRect(dx,dy,170,150);ctx.strokeStyle=PAL.muted2;ctx.strokeRect(dx,dy,170,150);
  for(let i=0;i<14;i++)for(let j=0;j<12;j++){ctx.fillStyle=(i*7+j*3)%5?PAL.slate:PAL.blue;ctx.fillRect(dx+8+i*11.5,dy+8+j*11.5,8,8);}
  W(ctx,[[x+w+60,y+60],[dx-10,dy+70]],PAL.muted,1.5);
  arrowText(ctx,'inside: a silicon "die"',dx+85,dy+170,PAL.ink,13);arrowText(ctx,'covered in microscopic transistors,',dx+85,dy+188,PAL.muted,12);arrowText(ctx,'resistors and wires',dx+85,dy+204,PAL.muted,12);})();

