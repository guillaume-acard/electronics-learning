// ===== p18: breadboard layout + demo =====
BBL.p18={"power": 8, "parts": [{"s": 1, "t": "npn", "c": "c20", "b": "c21", "e": "c22"}, {"s": 1, "t": "wire", "a": "a22", "b": "tn22", "c": "#111"}, {"s": 1, "t": "npn", "c": "c30", "b": "c31", "e": "c32"}, {"s": 1, "t": "wire", "a": "b20", "b": "b31", "c": PAL.gold}, {"s": 2, "t": "res", "a": "tp19", "b": "a20", "v": 33000}, {"s": 3, "t": "res", "a": "tp25", "b": "b26", "v": 470}, {"s": 3, "t": "pot", "h": ["a26", "a27", "a28"]}, {"s": 3, "t": "wire", "a": "c27", "b": "a30", "c": PAL.orangeDark}, {"s": 4, "t": "res", "a": "a32", "b": "tn33", "v": 1000}, {"s": 4, "t": "ecap", "a": "b32", "b": "tn34", "lab": "22\u00b5"}, {"s": 5, "t": "res", "a": "e32", "b": "e21", "v": 100000}, {"s": 6, "t": "ecap", "a": "d21", "b": "d17", "lab": "2.2\u00b5"}, {"s": 6, "t": "box", "at": [150, 22], "w": 110, "h": 40, "lab": "\ud83c\udfb8 IN jack", "col": PAL.chipLight, "ly": 24, "pins": [{"n": "tip", "dx": 22, "dy": 40, "to": "a17", "c": PAL.gold}, {"n": "sleeve", "dx": 86, "dy": 40, "to": "tn16", "c": "#111"}]}, {"s": 7, "t": "ccap", "a": "d30", "b": "d35", "lab": "10n"}, {"s": 7, "t": "box", "at": [440, 22], "w": 130, "h": 40, "lab": "OUT \u2192 Ruby amp", "col": PAL.chipLight, "ly": 24, "pins": [{"n": "tip", "dx": 20, "dy": 40, "to": "a35", "c": PAL.gold}, {"n": "sleeve", "dx": 104, "dy": 40, "to": "tn37", "c": "#111"}]}, {"s": 8, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};
(function(){
// ---------- p18: fuzz ----------
function fuzzCurve(x,fz,bias){const g=1+fz*60,off=(bias-0.5)*1.6;let y=Math.tanh(g*x+off)-Math.tanh(off);const top=1-Math.max(0,off)*0.9,bot=-1-Math.min(0,off)*0.9;y=Math.max(bot*0.95,Math.min(top*0.95,y));return y;}
const FZ={t:0,phase:'clean',pt:9};
function drawFuzz(dt){FZ.t+=dt;FZ.pt+=dt;const ctx=cv('m18'),fz=+$('m18f').value,bs=+$('m18b').value;
  const N=300,inp=[],out=[];for(let i=0;i<N;i++){const tt=i/N*1.2,env=Math.exp(-tt*2.2)*0.6;const v=env*(Math.sin(tt*2*Math.PI*6)+0.3*Math.sin(tt*2*Math.PI*12));inp.push(v);out.push(fuzzCurve(v,fz,bs));}
  mGraph(ctx,20,20,470,250,[[inp,PAL.blue],[out,PAL.orange]],-1.1,1.1,'one note: in (blue) → out (orange)');
  if(FZ.pt<1.6){const x=20+Math.min(1,FZ.pt/1.6)*470;ctx.strokeStyle=PAL.highlight;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,20);ctx.lineTo(x,270);ctx.stroke();}
  const cx=520,cy=20,w=250,h=250,cur=[];for(let i=0;i<=100;i++){const x=-1+i/50;cur.push(fuzzCurve(x*0.6,fz,bs));}
  mGraph(ctx,cx,cy,w,h,[[cur,PAL.orange],[cur.map((_,i)=>(-1+i/50)*0.6),PAL.muted2,[4,4]]],-1.1,1.1,'transfer curve');
  txt(ctx,'input →',cx+w-6,cy+h-6,PAL.muted,11,'right');
  const asym=Math.abs(bs-0.5);txt(ctx,fz<0.15?'Almost clean: a little warmth':asym>0.3?'Bias off-centre: thin, gated, "sputtery" fuzz':'Clipped top and bottom: thick, square-ish fuzz',255,292,PAL.yellow,12);}
function pluck(ac,dur){const sr=ac.sampleRate,n=Math.floor(sr*dur),buf=ac.createBuffer(1,n,sr),d=buf.getChannelData(0);const f=110,P=Math.round(sr/f);const ring=new Float32Array(P);for(let i=0;i<P;i++)ring[i]=Math.random()*2-1;
  for(let i=0;i<n;i++){const j=i%P,nx=(j+1)%P;const v=ring[j];ring[j]=0.996*0.5*(ring[j]+ring[nx]);d[i]=v*0.5;}return buf;}
function playFuzz(fx){const ac=mAC(),src=ac.createBufferSource();src.buffer=pluck(ac,2.2);const g=ac.createGain();g.gain.value=fx?0.12:0.35;
  if(fx){const ws=ac.createWaveShaper(),fz=+$('m18f').value,bs=+$('m18b').value,c=new Float32Array(1024);for(let i=0;i<1024;i++)c[i]=fuzzCurve((i/511.5-1)*0.6,fz,bs);ws.curve=c;ws.oversample='2x';
    const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=4500;src.connect(ws);ws.connect(lp);lp.connect(g);}else src.connect(g);
  g.connect(ac.destination);src.start();FZ.pt=0;}
$('m18c').addEventListener('click',()=>playFuzz(false));$('m18p').addEventListener('click',()=>playFuzz(true));
loop((dt,now)=>{if(vis('m18'))drawFuzz(dt);});
})();
