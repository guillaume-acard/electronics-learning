
// ===== Circuit menu: show only the selected project =====
const CL_LINKS=[...document.querySelectorAll('#clMenu [data-cl]')];const CL_IDS=CL_LINKS.map(a=>a.dataset.cl);
const clLabel=id=>{const a=CL_LINKS.find(x=>x.dataset.cl===id);return a?a.textContent.replace(/^\S+/,'').trim():id;};
function clSelect(id){if(!CL_IDS.includes(id))return false;CL_IDS.forEach(k=>{const s=document.getElementById(k);if(s)s.hidden=k!==id;});
  CL_LINKS.forEach(a=>a.classList.toggle('active',a.dataset.cl===id));const act=CL_LINKS.find(a=>a.dataset.cl===id);if(act&&act.scrollIntoView&&window.innerWidth<820)act.scrollIntoView({block:'nearest',inline:'center'});return true;}
function clFromHash(){const h=location.hash.slice(1);if(!clSelect(h)&&!CL_LINKS.some(a=>a.classList.contains('active')))clSelect('cintro');}
CL_IDS.forEach((id,i)=>{const s=document.getElementById(id);if(!s)return;const d=document.createElement('div');d.className='qnav';
  d.innerHTML=(i>0?`<a class="navlink" href="#${CL_IDS[i-1]}">← ${clLabel(CL_IDS[i-1])}</a>`:'<span></span>')+(i<CL_IDS.length-1?`<a class="navlink" href="#${CL_IDS[i+1]}">${clLabel(CL_IDS[i+1])} →</a>`:'');s.appendChild(d);});
window.addEventListener('hashchange',clFromHash);clFromHash();

// ===== 7-segment drawing (same as the Real parts page) =====
const GEO7={a:['h',10,50,6],g:['h',10,50,55],d:['h',10,50,104],f:['v',6,10,51],b:['v',54,10,51],e:['v',6,59,100],c:['v',54,59,100]};
const DIG7={0:'abcdef',1:'bc',2:'abged',3:'abgcd',4:'fgbc',5:'afgcd',6:'afgedc',7:'abc',8:'abcdefg',9:'abcdfg'};
function seg7(ctx,k){const [t,p1,p2,p3]=GEO7[k];ctx.beginPath();
  if(t==='h'){ctx.moveTo(p1,p3);ctx.lineTo(p1+5,p3-5);ctx.lineTo(p2-5,p3-5);ctx.lineTo(p2,p3);ctx.lineTo(p2-5,p3+5);ctx.lineTo(p1+5,p3+5);}
  else{ctx.moveTo(p1,p2);ctx.lineTo(p1+5,p2+5);ctx.lineTo(p1+5,p3-5);ctx.lineTo(p1,p3);ctx.lineTo(p1-5,p3-5);ctx.lineTo(p1-5,p2+5);}ctx.closePath();}
function digitBig(ctx,x,y,s,segs,on,dp){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#111';ctx.fillRect(-10,-8,90,126);
  Object.keys(GEO7).concat(['dp']).forEach(k=>{const lit=on&&(k==='dp'?dp:segs.includes(k));ctx.shadowBlur=lit?14:0;ctx.shadowColor='#ef4444';ctx.fillStyle=lit?'#ef4444':'#2a1416';
    if(k==='dp'){ctx.beginPath();ctx.arc(68,104,5,0,7);}else seg7(ctx,k);ctx.fill();ctx.shadowBlur=0;});ctx.restore();}

// ===== 12. Digital dice demo =====
const DC={v:[6,6],rolling:false,acc:0,wait:0.02,mode:0,t:0};
choices('dcMode',['Two dice','One die','Total (2–12)'],0,i=>DC.mode=i);
$('dcRoll').onclick=()=>{if(!DC.rolling){DC.rolling=true;DC.wait=0.02;DC.acc=0;}};
function drawDice(dt){DC.t+=dt;if(DC.rolling){DC.acc+=dt;if(DC.acc>=DC.wait){DC.acc=0;DC.v=[1+Math.floor(Math.random()*6),1+Math.floor(Math.random()*6)];DC.wait+=0.015;if(DC.wait>=0.26)DC.rolling=false;}}
  const ctx=cv('cdice'),slow=$('dcSlow').checked,act=Math.floor(DC.t/0.45)%2;
  let d1,d2;const sum=DC.v[0]+DC.v[1];
  if(DC.mode===0){d1=DC.v[0];d2=DC.v[1];}else if(DC.mode===1){d1=null;d2=DC.v[1];}else{d1=sum>=10?1:null;d2=sum%10;}
  const show=i=>!slow||act===i;
  digitBig(ctx,130,30,1.7,d1===null?'':DIG7[d1],show(0),DC.rolling);digitBig(ctx,300,30,1.7,DIG7[d2],show(1),DC.rolling);
  txt(ctx,'display 1',190,262,'#94a3b8',11);txt(ctx,'display 2',360,262,'#94a3b8',11);
  npnQ(ctx,180,280,show(0));npnQ(ctx,350,280,show(1));
  if(slow)txt(ctx,'only display '+(act+1)+' is ON right now',275,22,Y,13);
  const rx=520;txt(ctx,DC.rolling?'rolling…':DC.mode===2?'total':'result',rx+130,70,'#94a3b8',13);
  txt(ctx,DC.rolling?'🎲 🎲':DC.mode===0?DC.v[0]+' + '+DC.v[1]+' = '+sum:DC.mode===1?String(DC.v[1]):String(sum),rx+130,120,DC.rolling?Y:'#10b981',DC.rolling?30:34);
  if(!DC.rolling&&DC.mode===0&&DC.v[0]===DC.v[1])txt(ctx,'Doubles! 🎉',rx+130,160,Y,16);
  txt(ctx,slow?'4 ms per display, slowed down ×100':'each display ON 4 ms, then the other',rx+130,215,'#94a3b8',12);
  txt(ctx,'→ ~125 swaps per second: looks steady',rx+130,235,'#94a3b8',12);}

// ===== 12. Schematic =====
function drawP12(){const ctx=cv('cp12');const ay=[120,136,152,168,184,200,216,232],segs=['a','b','c','d','e','f','g','dp'],pins=[7,6,4,2,1,9,10,5];
  ctx.fillStyle='#0e7490';ctx.fillRect(30,30,120,320);txt(ctx,'Arduino',90,60,'#fff',15);txt(ctx,'Uno / ONE-C',90,78,'#cffafe',10);
  ay.forEach((y,i)=>{txt(ctx,'D'+(i+2),146,y+4,'#cffafe',10,'right');W(ctx,[[150,y],[190,y]],'#cbd5e1',2);ctx.fillStyle=BG;ctx.strokeStyle='#cbd5e1';ctx.lineWidth=1.5;ctx.fillRect(190,y-5,34,10);ctx.strokeRect(190,y-5,34,10);
    W(ctx,[[224,y],[700,y]],'#f87171',2);txt(ctx,segs[i],300,y-3,'#fca5a5',10);});
  txt(ctx,'8 × 330 Ω',207,108,'#e2e8f0',11);
  [[400,'display 1',270,'D10'],[580,'display 2',300,'D11']].forEach(([dx,l,ry,dn],k)=>{
    ctx.fillStyle='#1a1a1a';ctx.fillRect(dx,8,110,84);ctx.strokeStyle='#475569';ctx.strokeRect(dx,8,110,84);
    digitBig(ctx,dx+8,14,0.6,DIG7[k?5:3],true,false);txt(ctx,l,dx+80,40,'#94a3b8',10);txt(ctx,'SC39-11',dx+80,54,'#94a3b8',9);
    ay.forEach((y,i)=>{const x=dx+8+i*11;W(ctx,[[x,92],[x,y]],'#94a3b8',1.2);dot(ctx,x,y);txt(ctx,String(pins[i]),x,103,'#64748b',8);});
    const cx=dx+100;W(ctx,[[cx,92],[cx,251]],'#60a5fa',2);txt(ctx,'COM',cx+4,104,'#60a5fa',9,'left');
    npnQ(ctx,cx-10,285,true);W(ctx,[[cx,319],[cx,365]],'#60a5fa',2);
    // base drive
    txt(ctx,dn,146,ry+4,'#cffafe',10,'right');
    if(!k){W(ctx,[[150,ry],[250,ry]],'#cbd5e1',2);ctx.fillStyle=BG;ctx.fillRect(250,ry-5,34,10);ctx.strokeRect(250,ry-5,34,10);W(ctx,[[284,ry],[cx-54,ry],[cx-54,285],[cx-44,285]],'#cbd5e1',2);}
    else{W(ctx,[[150,ry],[170,ry],[170,345],[250,345]],'#cbd5e1',2);ctx.fillStyle=BG;ctx.fillRect(250,340,34,10);ctx.strokeRect(250,340,34,10);W(ctx,[[284,345],[cx-54,345],[cx-54,285],[cx-44,285]],'#cbd5e1',2);}
  });
  txt(ctx,'1 kΩ',267,262,'#e2e8f0',10);txt(ctx,'1 kΩ',267,337,'#e2e8f0',10);
  W(ctx,[[90,350],[90,365],[700,365]],'#60a5fa',2);txt(ctx,'GND',710,369,'#60a5fa',11,'left');
  txt(ctx,'D12',146,334,'#cffafe',10,'right');W(ctx,[[150,330],[160,330]],'#cbd5e1',2);
  txt(ctx,'button D12 → GND (internal pull-up)',360,262,'#94a3b8',10,'left');}
drawP12();
