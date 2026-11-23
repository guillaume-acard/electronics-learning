const cv=id=>{const c=$(id),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);return ctx;};
// ===== left menu: one section at a time =====
sectionMenu('paMenu',{first:'rpstart'});

// ===== 7-segment helpers =====
const PINS={1:'e',2:'d',3:'COM',4:'c',5:'dp',6:'b',7:'a',8:'COM',9:'f',10:'g'};
const SEG2PIN={};Object.entries(PINS).forEach(([p,s])=>{if(s!=='COM')SEG2PIN[s]=+p;});
const GEO={a:['h',10,50,6],g:['h',10,50,55],d:['h',10,50,104],f:['v',6,10,51],b:['v',54,10,51],e:['v',6,59,100],c:['v',54,59,100]};
function segPath(ctx,k){const [t,p1,p2,p3]=GEO[k];ctx.beginPath();
  if(t==='h'){const x1=p1,x2=p2,y=p3;ctx.moveTo(x1,y);ctx.lineTo(x1+5,y-5);ctx.lineTo(x2-5,y-5);ctx.lineTo(x2,y);ctx.lineTo(x2-5,y+5);ctx.lineTo(x1+5,y+5);}
  else{const x=p1,y1=p2,y2=p3;ctx.moveTo(x,y1);ctx.lineTo(x+5,y1+5);ctx.lineTo(x+5,y2-5);ctx.lineTo(x,y2);ctx.lineTo(x-5,y2-5);ctx.lineTo(x-5,y1+5);}ctx.closePath();}
// lvl: function(seg)->0..1 brightness
function digit7(ctx,x,y,s,lvl,hl){ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle='#111';ctx.fillRect(-10,-8,90,126);
  Object.keys(GEO).concat(['dp']).forEach(k=>{const b=lvl(k);ctx.shadowBlur=b>0.05?14*b:0;ctx.shadowColor=PAL.bad;
    ctx.fillStyle=b>0.02?`rgba(239,68,68,${0.25+0.75*b})`:'#2a1416';
    if(k==='dp'){ctx.beginPath();ctx.arc(68,104,5,0,7);}else segPath(ctx,k);ctx.fill();ctx.shadowBlur=0;
    if(hl===k){ctx.strokeStyle=Y;ctx.lineWidth=2/s*1.5;ctx.stroke();}});
  ctx.restore();}
function hitSeg(ux,uy){if(Math.hypot(ux-68,uy-104)<8)return 'dp';for(const k in GEO){const [t,p1,p2,p3]=GEO[k];if(t==='h'){if(ux>=p1-2&&ux<=p2+2&&Math.abs(uy-p3)<8)return k;}else{if(Math.abs(ux-p1)<8&&uy>=p2&&uy<=p3)return k;}}return null;}
function canvasXY(c,e){const r=c.getBoundingClientRect();return [(e.clientX-r.left)*c.width/r.width,(e.clientY-r.top)*c.height/r.height];}
// package drawing with pins; returns pin positions
function pkg(ctx,x,y,lvl,pinHl){const w=150,h=180;ctx.fillStyle=PAL.chip;ctx.fillRect(x,y,w,h);ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.strokeRect(x,y,w,h);
  digit7(ctx,x+38,y+30,1.1,lvl,null);const pos={};
  for(let i=0;i<5;i++){const px=x+15+i*30;// bottom pins 1..5 left→right
    pos[i+1]=[px,y+h+30];pos[10-i]=[px,y-30];}
  Object.entries(pos).forEach(([p,[px,py]])=>{const top=py<y,hl=pinHl&&pinHl.includes(+p);ctx.fillStyle=hl?Y:PAL.ink2;ctx.fillRect(px-3,top?py:y+h,6,30);
    txt(ctx,p,px,top?py-6:py+14,hl?Y:PAL.muted,11);const s=PINS[p];txt(ctx,s,px,top?py-20:py+28,s==='COM'?PAL.blue:hl?Y:PAL.ink,11);});
  return pos;}

// ===== 2. Pinout =====
const PD={d:8,dp:false,hl:null};
choices('pdDigits',['0','1','2','3','4','5','6','7','8','9'],8,i=>{PD.d=i;PD.hl=null;drawPin();});
$('pdDp').onclick=()=>{PD.dp=!PD.dp;$('pdDp').className=PD.dp?'active':'';drawPin();};
function onSegs(){return DIGITS[PD.d]+(PD.dp?'p':'');}
function drawPin(){const ctx=cv('cPin');const segs=DIGITS[PD.d].split('').concat(PD.dp?['dp']:[]);const lvl=k=>segs.includes(k)?1:0;
  digit7(ctx,40,40,2.2,lvl,PD.hl);txt(ctx,'front view',115,325,PAL.muted,11);
  // segment letters
  const L={a:[30,0],b:[62,30],c:[62,80],d:[30,118],e:[-4,80],f:[-4,30],g:[30,46],dp:[74,118]};Object.entries(L).forEach(([k,[ux,uy]])=>txt(ctx,k,40+ux*2.2,40+uy*2.2+4,PD.hl===k?Y:PAL.muted,13));
  const pinHl=segs.map(s=>SEG2PIN[s]);if(PD.hl)pinHl.push(SEG2PIN[PD.hl]);
  const pos=pkg(ctx,300,58,lvl,PD.hl?[SEG2PIN[PD.hl]]:pinHl);PD.pos=pos;
  txt(ctx,'COM (pins 3 & 8) → GND',375,322,PAL.blue,11);
  // table
  const tx=540;txt(ctx,'To show "'+PD.d+(PD.dp?'.':'')+'": put + on',tx,40,PAL.ink,14,'left');
  segs.forEach((s,i)=>{txt(ctx,'pin '+SEG2PIN[s],tx+(i%2)*120,72+Math.floor(i/2)*24,Y,14,'left');txt(ctx,'→ '+s,tx+52+(i%2)*120,72+Math.floor(i/2)*24,PAL.ink,14,'left');});
  txt(ctx,'and connect pin 3 or 8 to GND.',tx,72+Math.ceil(segs.length/2)*24+10,PAL.blue,13,'left');
  if(PD.hl)txt(ctx,'Segment '+PD.hl+' ↔ pin '+SEG2PIN[PD.hl],tx,300,Y,15,'left');}
$('cPin').addEventListener('click',e=>{const c=$('cPin'),[cx,cy]=canvasXY(c,e);const k=hitSeg((cx-40)/2.2,(cy-40)/2.2);
  if(k){PD.hl=PD.hl===k?null:k;drawPin();return;}
  if(PD.pos)for(const [p,[px,py]] of Object.entries(PD.pos)){if(Math.abs(cx-px)<14&&Math.abs(cy-py-(py<200?15:-15))<26){const s=PINS[p];PD.hl=s==='COM'?null:s;drawPin();return;}}});
drawPin();

// ===== 3. Pin tester =====
const PT={ca:0,plus:7,minus:3};
choices('ptType',['Common cathode (this part)','Common anode (other version)'],0,i=>{PT.ca=i;drawTest();});
choices('ptPlus',Array.from({length:10},(_,i)=>String(i+1)),6,i=>{PT.plus=i+1;drawTest();});
choices('ptMinus',Array.from({length:10},(_,i)=>String(i+1)),2,i=>{PT.minus=i+1;drawTest();});
function drawTest(){const ctx=cv('cTest');let lit=null;const P=PINS[PT.plus],M=PINS[PT.minus];
  if(!PT.ca){if(M==='COM'&&P!=='COM')lit=P;}else{if(P==='COM'&&M!=='COM')lit=M;}
  const pos=pkg(ctx,320,60,k=>k===lit?1:0,[PT.plus,PT.minus]);
  part(ctx,'batt',80,60,80,200,{label:'9 V',left:true});wire(ctx,[[80,60],[150,60]],PAL.redSoft);part(ctx,'res',150,60,230,60,{label:'1 kΩ'});
  const [px,py]=pos[PT.plus],[mx,my]=pos[PT.minus];
  const ry=py<100?6:306,by2=my<100?14:316;W(ctx,[[230,60],[260,60],[260,ry],[px,ry],[px,py<100?py-22:py+22]],PAL.redSoft,2.5);
  W(ctx,[[80,200],[120,200],[120,by2],[mx+6,by2],[mx+6,my<100?my-22:my+22]],PAL.muted,2.5);
  let msg,col;
  if(PT.plus===PT.minus){msg='Both probes on the same pin: nothing.';col=PAL.muted;}
  else if(lit){msg='Segment "'+lit+'" lights → pin '+(PT.ca?PT.minus:PT.plus)+' = '+lit;col=PAL.good;}
  else if(!PT.ca&&P==='COM'&&M!=='COM'){msg='Nothing: + on COM drives the LEDs backwards. For common cathode, put − on COM.';col=Y;}
  else if(PT.ca&&M==='COM'&&P!=='COM'){msg='Nothing: for common anode, + must go on COM.';col=Y;}
  else {msg='Nothing: one probe must be on a COM pin (3 or 8).';col=PAL.muted;}
  wrapText(ctx,msg,540,90,250,20,col,14);}
drawTest();

// ===== 4. Resistor calc + sharing =====
function drawRes(){const V=+$('rcV').value,I=+$('rcI').value/1000;$('rcIt').textContent=(I*1000)+' mA';const ctx=cv('cRes');
  const R=(V-1.85)/I,Rs=snapUp(R),Ia=(V-1.85)/Rs*1000;
  txt(ctx,'R = ('+V+' V − 1.85 V) ÷ '+(I*1000)+' mA = '+Math.round(R)+' Ω',20,35,PAL.ink,15,'left');
  txt(ctx,'→ use '+fmtOhm(Rs)+' per segment (×8)',20,70,Y,20,'left');
  txt(ctx,'actual ≈ '+Ia.toFixed(1)+' mA per segment · "8." draws ≈ '+(Ia*8).toFixed(0)+' mA in total'+(Ia*8>160?' (too much for one Arduino!)':''),20,102,PAL.muted,13,'left');
  if(I*1000>20)txt(ctx,'⚠ over 20 mA: shortens its life (30 mA absolute max)',20,128,PAL.redSoft,13,'left');}
function snapUp(r){const d=Math.pow(10,Math.floor(Math.log10(r)));for(let k=0;k<2;k++){for(const e of E12){if(e*d*(k?10:1)>=r-1e-9)return e*d*(k?10:1);}}return r;}
['rcV','rcI'].forEach(id=>$(id).addEventListener('input',drawRes));drawRes();
const SH={shared:0,d:1};const shD=[1,7,4,8];
choices('shMode',['One resistor per segment','One shared resistor on COM'],0,i=>{SH.shared=i;drawShare();});
choices('shDigits',['1','7','4','8'],0,i=>{SH.d=shD[i];drawShare();});
function drawShare(){const ctx=cv('cShare');const segs=DIGITS[SH.d],n=segs.length,each=SH.shared?10/n:10;
  digit7(ctx,90,20,1.7,k=>segs.includes(k)?Math.min(1,each/10):0);
  // schematic sketch
  const sx=330;txt(ctx,SH.shared?'one 330 Ω on COM, shared':'8 × 330 Ω, one per segment',sx+140,30,PAL.ink,13);
  for(let i=0;i<7;i++){const x=sx+20+i*40,on=segs.includes('abcdefg'[i]);W(ctx,[[x,50],[x,70]],on?PAL.redSoft:PAL.slate,2);
    if(!SH.shared){ctx.fillStyle=BG;ctx.strokeStyle=on?PAL.ink2:PAL.slate;ctx.lineWidth=2;ctx.fillRect(x-6,70,12,30);ctx.strokeRect(x-6,70,12,30);}else W(ctx,[[x,70],[x,100]],on?PAL.redSoft:PAL.slate,2);
    W(ctx,[[x,100],[x,120]],on?PAL.redSoft:PAL.slate,2);ctx.fillStyle=on?`rgba(239,68,68,${0.3+0.7*Math.min(1,each/10)})`:'#2a1416';ctx.beginPath();ctx.moveTo(x-8,120);ctx.lineTo(x+8,120);ctx.lineTo(x,134);ctx.closePath();ctx.fill();txt(ctx,'abcdefg'[i],x,152,PAL.muted,11);}
  W(ctx,[[sx+12,160],[sx+268,160]],PAL.blue,2);for(let i=0;i<7;i++)W(ctx,[[sx+20+i*40,134],[sx+20+i*40,160]],PAL.slate,1.5);
  if(SH.shared){ctx.fillStyle=BG;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=2;W(ctx,[[sx+140,160],[sx+140,172]],PAL.blue,2);ctx.fillRect(sx+130,172,20,30);ctx.strokeRect(sx+130,172,20,30);W(ctx,[[sx+140,202],[sx+140,215]],PAL.blue,2);}
  else W(ctx,[[sx+140,160],[sx+140,215]],PAL.blue,2);txt(ctx,'GND',sx+140,230,PAL.blue,11);
  txt(ctx,'each lit segment: '+each.toFixed(1)+' mA',690,110,SH.shared&&n>2?Y:PAL.good,15);
  txt(ctx,SH.shared?(n>2?'dimmer with more segments ✗':'bright (few segments)'):'same brightness for every digit ✓',690,138,SH.shared&&n>2?PAL.redSoft:PAL.good,12);}
drawShare();

// ===== 5B. CD4511 =====
const BCD=[0,1,0,1];// D C B A
(function(){const el=$('bcdSw');['D (8)','C (4)','B (2)','A (1)'].forEach((l,i)=>{const b=document.createElement('button');const upd=()=>{b.textContent=l+': '+BCD[i];b.className=BCD[i]?'active':'';};upd();b.onclick=()=>{BCD[i]^=1;upd();drawBcd();};el.appendChild(b);});})();
function drawBcd(){const ctx=cv('cBcd'),n=BCD[0]*8+BCD[1]*4+BCD[2]*2+BCD[3],segs=n<10?DIGITS[n]:'';
  ['D','C','B','A'].forEach((l,i)=>{const y=50+i*40,on=BCD[i];ctx.fillStyle=on?PAL.good:PAL.slateDark;ctx.beginPath();ctx.roundRect(40,y-12,50,24,12);ctx.fill();ctx.fillStyle=PAL.white;ctx.beginPath();ctx.arc(on?78:52,y,9,0,7);ctx.fill();
    txt(ctx,l+' = '+[8,4,2,1][i],100,y+4,on?PAL.good:PAL.muted,12,'left');W(ctx,[[150,y],[230,y]],on?PAL.good:PAL.slate,2);});
  ctx.fillStyle=PAL.chip;ctx.fillRect(230,30,110,170);ctx.strokeStyle=PAL.slate;ctx.strokeRect(230,30,110,170);txt(ctx,'CD4511',285,118,PAL.ink,14);txt(ctx,'BCD → 7-seg',285,138,PAL.muted,10);
  for(let i=0;i<7;i++){const y=45+i*22,on=segs.includes('abcdefg'[i]);W(ctx,[[340,y],[370,y]],on?PAL.redSoft:PAL.slate,2);ctx.fillStyle=BG;ctx.strokeStyle=on?PAL.ink2:PAL.slate;ctx.lineWidth=1.5;ctx.fillRect(370,y-5,30,10);ctx.strokeRect(370,y-5,30,10);W(ctx,[[400,y],[440,y]],on?PAL.redSoft:PAL.slate,2);txt(ctx,'abcdefg'[i],446,y+4,PAL.muted,10,'left');}
  digit7(ctx,480,40,1.5,k=>segs.includes(k)?1:0);
  txt(ctx,'binary '+BCD.join('')+' = '+n,690,100,PAL.ink,16);txt(ctx,n<10?'shows "'+n+'"':'10–15: the 4511 blanks the display',690,128,n<10?PAL.good:Y,12);}
drawBcd();

// ===== 5C. Multiplexing =====
const MX={t:0};const MXD=[1,2,3,4];
function drawMux(dt){MX.t+=dt;const fr=Math.pow(10,+$('mxF').value),fast=fr>25;$('mxFt').textContent=(fr<10?fr.toFixed(1):Math.round(fr))+' scans/s';
  const act=Math.floor(MX.t*fr*4)%4;const ctx=cv('cMux');
  MXD.forEach((d,i)=>{const on=fast||i===act;digit7(ctx,90+i*120,20,1.25,k=>on&&DIGITS[d].includes(k)?(fast?0.75:1):0);
    npnQ(ctx,140+i*120,200,!fast&&i===act);txt(ctx,'digit '+(i+1),130+i*120,246,PAL.muted,10);});
  W(ctx,[[60,175],[560,175]],PAL.slate,1.5);txt(ctx,'shared segment lines a–g',580,170,PAL.muted,11,'left');
  txt(ctx,fast?'Too fast for your eye: all 4 digits look lit ✓':'Slow: you can see one digit at a time',640,90,fast?PAL.good:Y,13);}

loop((dt,now)=>{drawMux(dt);});

// ===== Example 2: DC10G bar graph =====
// real pin numbers: anode of segment i (0=A..9=J) = i+1, cathode = 20-i
const BG_SEG='ABCDEFGHIJ';
const bgRole=p=>p<=10?{seg:p-1,an:true}:{seg:20-p,an:false};
const bgReal=(pos,rot)=>rot?((pos-1+10)%20)+1:pos;   // turning a DIL-20 by 180° moves pin n to n+10
// draws the package; lvl(i)->0..1 for segment slot i; returns {pos:{position:[x,y]}, seg:[[x,y,w,h]]}
function bgPkg(ctx,x,y,lvl,hl,rot,labels){const P=34,w=10*P+16,h=96,pos={},seg=[];
  ctx.fillStyle=PAL.chip;ctx.fillRect(x,y,w,h);ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.strokeRect(x,y,w,h);
  const cx=rot?x+w-6:x+6,cy=rot?y+6:y+h-6;ctx.fillStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+(rot?-14:14),cy);ctx.lineTo(cx,cy+(rot?14:-14));ctx.fill();
  for(let i=0;i<10;i++){const sx=x+14+i*P,b=lvl(i);seg.push([sx,y+20,22,56]);
    if(b>0.02){ctx.shadowBlur=16*b;ctx.shadowColor=PAL.green;}ctx.fillStyle=b>0.02?`rgba(34,197,94,${0.3+0.7*b})`:'#11261a';ctx.fillRect(sx,y+20,22,56);ctx.shadowBlur=0;}
  for(let k=1;k<=20;k++){const bottom=k<=10,px=x+25+(bottom?k-1:20-k)*P,py=bottom?y+h:y-26;pos[k]=[px,bottom?y+h+26:y-26];
    const on=hl&&hl.includes(k);ctx.fillStyle=on?Y:PAL.ink2;ctx.fillRect(px-3,py,6,26);
    txt(ctx,String(k),px,bottom?py+40:py-6,on?Y:PAL.muted,11);
    if(labels){const r=bgRole(bgReal(k,rot));txt(ctx,BG_SEG[r.seg]+(r.an?'+':'−'),px,bottom?py+56:py-20,r.an?PAL.redSoft:PAL.blue,11);}}
  return {pos,seg};}

// ---- pinout ----
const BGP={hl:0};
function drawBarPin(){const ctx=cv('cBarPin');const s=BGP.hl,lit=i=>i===s?1:0;
  const g=bgPkg(ctx,30,96,lit,[s+1,20-s],false,true);BGP.g=g;
  txt(ctx,'top row: cathodes (−) 20 → 11',210,26,PAL.blue,12);txt(ctx,'bottom row: anodes (+) 1 → 10',210,292,PAL.redSoft,12);
  const tx=470;txt(ctx,'Segment '+BG_SEG[s]+': + on pin '+(s+1)+', − on pin '+(20-s),tx,40,Y,15,'left');
  for(let i=0;i<10;i++){const yy=78+i*20,c=i===s?Y:PAL.ink2;txt(ctx,BG_SEG[i],tx,yy,c,13,'left');txt(ctx,'anode pin '+(i+1),tx+26,yy,i===s?Y:PAL.redSoft,13,'left');txt(ctx,'↔  cathode pin '+(20-i),tx+130,yy,i===s?Y:PAL.blue,13,'left');}
  txt(ctx,'rule: anode n ↔ cathode 21 − n',tx,292,PAL.muted,12,'left');}
$('cBarPin').addEventListener('click',e=>{const c=$('cBarPin'),[cx,cy]=canvasXY(c,e),g=BGP.g;if(!g)return;
  g.seg.forEach(([sx,sy,w,h],i)=>{if(cx>=sx-4&&cx<=sx+w+4&&cy>=sy&&cy<=sy+h){BGP.hl=i;}});
  Object.entries(g.pos).forEach(([k,[px,py]])=>{if(Math.abs(cx-px)<14&&Math.abs(cy-py)<22)BGP.hl=bgRole(+k).seg;});drawBarPin();});
drawBarPin();

// ---- pin test ----
const BGT={rot:0};
['btPlus','btMinus'].forEach((id,j)=>{const el=$(id);for(let k=1;k<=20;k++){const o=document.createElement('option');o.value=k;o.textContent=k;el.appendChild(o);}el.value=j?20:1;el.addEventListener('change',drawBarTest);});
choices('btRot',['Inserted the right way','Turned round by mistake (180°)'],0,i=>{BGT.rot=i;drawBarTest();});
function drawBarTest(){const ctx=cv('cBarTest'),pl=+$('btPlus').value,mi=+$('btMinus').value,rot=!!BGT.rot;
  const a=bgRole(bgReal(pl,rot)),b=bgRole(bgReal(mi,rot));
  let litSeg=-1;if(pl!==mi&&a.an&&!b.an&&a.seg===b.seg)litSeg=a.seg;
  const rev=pl!==mi&&!a.an&&b.an&&a.seg===b.seg;
  const slot=i=>rot?9-i:i;const g=bgPkg(ctx,380,80,i=>litSeg>=0&&slot(litSeg)===i?1:0,[pl,mi],rot,false);
  part(ctx,'batt',60,60,60,200,{label:'9 V',left:true});part(ctx,'res',60,60,170,60,{label:'1 kΩ'});
  const [px,py]=g.pos[pl],[mx,my]=g.pos[mi];
  W(ctx,[[170,60],[200,60],[200,py<120?py-30:py+30],[px,py<120?py-30:py+30],[px,py<120?py-12:py+12]],PAL.redSoft,2.5);
  W(ctx,[[60,200],[140,200],[140,my<120?my-36:my+36],[mx+5,my<120?my-36:my+36],[mx+5,my<120?my-12:my+12]],PAL.muted,2.5);
  bgPkg(ctx,380,80,i=>litSeg>=0&&slot(litSeg)===i?1:0,[pl,mi],rot,false);// redraw on top of the wires
  let msg,col;
  if(pl===mi){msg='Both probes on the same pin: nothing.';col=PAL.muted;}
  else if(litSeg>=0){msg='Segment '+BG_SEG[litSeg]+' lights. '+(rot?'It lights, but at the wrong end: the bar is turned round. Pin 1 is really in position '+bgReal(1,true)+'.':'Pin '+pl+' = anode, pin '+mi+' = cathode ✓');col=PAL.good;}
  else if(rev){msg='Nothing: this LED is connected backwards. Swap the probes'+(rot?': the bar is turned round, the anodes are on the top row.':'.');col=Y;}
  else{msg='Nothing: these two pins are not the two ends of the same LED. Opposite pins in the two rows belong together.';col=PAL.muted;}
  wrapText(ctx,msg,20,252,760,18,col,13);}
drawBarTest();

// ---- resistors ----
function drawBarRes(){const V=+$('brV').value,I=+$('brI').value/1000;$('brIt').textContent=(I*1000)+' mA';const ctx=cv('cBarRes');
  if(V<=2.6){txt(ctx,V+' V is too close to the LED\'s 2.1–2.6 V: no room left for a resistor. Use 5 V.',400,70,Y,14);return;}
  const R=(V-2.1)/I,Rs=snapUp(R),Ia=(V-2.1)/Rs,P=Ia*Ia*Rs;
  txt(ctx,`R = (${V} V − 2.1 V) ÷ ${(I*1000)} mA = ${Math.round(R)} Ω  →  next standard value up: ${fmtOhm(Rs)}`,400,36,PAL.ink,15);
  txt(ctx,`real current ${(Ia*1000).toFixed(1)} mA per LED · ${(P*1000).toFixed(0)} mW in each resistor (a ¼ W one is plenty)`,400,70,PAL.muted,13);
  const tot=Ia*10*1000;txt(ctx,`Whole bar lit: 10 × ${(Ia*1000).toFixed(1)} mA = ${tot.toFixed(0)} mA`+(tot>150?'  ⚠️ a lot for an Arduino (≈ 200 mA max in total)':''),400,104,tot>150?Y:PAL.good,13);
  txt(ctx,'max 25 mA per LED (datasheet)',400,136,PAL.muted2,11);}
['brV','brI'].forEach(id=>$(id).addEventListener('input',drawBarRes));drawBarRes();

// ---- driving from an Arduino ----
const BGD={dot:0};
choices('bdMode',['Bar','Dot'],0,i=>{BGD.dot=i;drawBarDrive();});
function drawBarDrive(){const ctx=cv('cBarDrive'),V=+$('bdV').value,adc=Math.round(V/5*1023),n=Math.floor(adc*10/1023);
  const on=i=>BGD.dot?(i+1===n):(i<n);
  bgPkg(ctx,30,70,i=>on(i)?1:0,null,false,false);
  const tx=440;txt(ctx,`analogRead(A0) = ${adc}`,tx,60,PAL.ink,14,'left');txt(ctx,`n = map(${adc}, 0, 1023, 0, 10) = ${n}`,tx,86,Y,14,'left');
  const hi=[];for(let i=0;i<10;i++)if(on(i))hi.push('D'+(i+2));
  wrapText(ctx,'HIGH: '+(hi.length?hi.join(' '):'none'),tx,118,340,18,PAL.good,13);
  const mA=hi.length*9;txt(ctx,`current ≈ ${hi.length} × 9 mA = ${mA} mA`,tx,180,mA>150?Y:PAL.muted,13,'left');
  txt(ctx,BGD.dot?'Dot mode: only the top LED, so 10× less current':'Bar mode: every LED up to the level',tx,206,PAL.muted2,12,'left');}
$('bdV').addEventListener('input',drawBarDrive);drawBarDrive();
