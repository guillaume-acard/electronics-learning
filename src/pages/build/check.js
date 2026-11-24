// ===== Build lab: "Check circuit" =====
// Wiring rules on the board, plus a quick test run of the simulator (what would burn, what is backwards).
// Each issue: {lvl:'err'|'warn'|'ok', msg, ids:[part or wire ids to highlight]}.
function checkCircuit(S,trial){const out=[],N=nets(S),add=(lvl,msg,ids=[])=>out.push({lvl,msg,ids});
  const name=partName;
  const supplies=S.parts.filter(p=>p.type==='batt'||p.type==='usb');
  if(!S.parts.length){add('warn','The board is empty: drag parts from the catalog.');return out;}
  if(!supplies.length)add('err','No power: add a 9 V battery or the USB 5 V module, and connect it to the rails.');
  const plus=new Set(supplies.map(p=>N.of(p.holes['+']))),minus=new Set(supplies.map(p=>N.of(p.holes['−'])));
  supplies.forEach(p=>{if(N.of(p.holes['+'])===N.of(p.holes['−']))add('err',`Short circuit: the + and − of the ${name(p)} are connected together by wires or a strip.`,[p.id]);});
  // count what touches each net
  const count=new Map();S.parts.forEach(p=>Object.values(p.holes).forEach(h=>{const n=N.of(h);count.set(n,(count.get(n)||0)+1);}));
  S.wires.forEach(w=>{[w.a,w.b].forEach(h=>{const n=N.of(h);count.set(n,(count.get(n)||0)+1);});});
  S.parts.forEach(p=>{if(p.burnt)add('err',`${name(p)} is burnt: click it and press Replace.`,[p.id]);
    const T=PARTS[p.type];if(T.fixed)return;
    const ns=Object.entries(p.holes).map(([pin,h])=>[pin,N.of(h)]);
    if(ns.length===2&&ns[0][1]===ns[1][1]&&p.type!=='btn'&&!plus.has(ns[0][1]))add('warn',`${name(p)}: both legs are in the same strip, so it is short-circuited (it does nothing). Move one leg to another column or row.`,[p.id]);
    const free=n=>(count.get(n)||0)<2&&!plus.has(n)&&!minus.has(n),opt=new Set([...(T.optional||[]),...(T.tie||[]).map(t=>t[0]),...(T.supply?[T.supply.plus,T.supply.minus]:[])]);   // those have their own message
    ns.forEach(([pin,n])=>{if(free(n)&&!opt.has(pin))add('warn',`${name(p)}: leg ${legName(p,pin)} is not connected to anything.`,[p.id]);});
    if(T.supply){const n=k=>N.of(p.holes[k]),pn=k=>'pin '+legName(p,k);
      if(plus.has(n(T.supply.minus))&&minus.has(n(T.supply.plus)))add('err',`${name(p)} is powered backwards: ${pn(T.supply.plus)} must go to + and ${pn(T.supply.minus)} to −.`,[p.id]);
      else{if(!plus.has(n(T.supply.plus)))add('warn',`${name(p)}: ${pn(T.supply.plus)} (supply) should go to +.`,[p.id]);
        if(!minus.has(n(T.supply.minus)))add('warn',`${name(p)}: ${pn(T.supply.minus)} (ground) should go to −.`,[p.id]);}
      (T.tie||[]).forEach(([k,msg])=>{if(free(n(k)))add('warn',`${name(p)}: ${msg}.`,[p.id]);});}
    if(p.type==='led'&&plus.has(N.of(p.holes['+']))&&minus.has(N.of(p.holes['−']))&&N.of(p.holes['+'])!==N.of(p.holes['−']))add('err',`${name(p)} is straight across the supply with no resistor: it will burn. Put a resistor (470 Ω on 9 V) in series.`,[p.id]);
    if(p.type==='npn'&&plus.has(N.of(p.holes['B'])))add('err',`${name(p)}: its base is connected straight to +. Put a resistor (1–10 kΩ) between + and the base.`,[p.id]);
  });
  supplies.forEach(s=>{const used=S.parts.some(p=>p!==s&&Object.values(p.holes).some(h=>plus.has(N.of(h))))||S.wires.some(w=>plus.has(N.of(w.a))||plus.has(N.of(w.b)));
    if(!used)add('warn',`Nothing is connected to the + of the ${name(s)}.`,[s.id]);});
  // a short test run: what would burn, what is backwards (an LED with its + leg on − or its − leg on +: several LEDs
  // sharing one resistor, as in the chaser, are reversed when off, and that is fine)
  if(trial&&!out.some(o=>o.lvl==='err'&&/Short circuit|No power/.test(o.msg))){
    trial.forEach(({p,w})=>{if(!w)return;
      if(w.over)add('err',`${name(p)} would burn: ${w.over}.`,[p.id]);
      if(p.type==='led'&&w.vrev>1&&(minus.has(N.of(p.holes['+']))||plus.has(N.of(p.holes['−']))))add('warn',`${name(p)} is connected backwards (long leg = +): it stays off.`,[p.id]);});
    const src=trial.find(t=>t.p.type==='batt'||t.p.type==='usb');if(src&&src.w&&Math.abs(src.w.I)>1)add('err',`The supply delivers ${fmtI(src.w.I)}: that is almost a short circuit.`,[src.p.id]);}
  if(!out.length)add('ok','No problem found. Press ▶ Play.');
  return out;}
