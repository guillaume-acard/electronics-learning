// ===== p17: breadboard layout + demo =====
BBL.p17={"power": 9, "parts": [{"s": 1, "t": "wire", "a": "tp60", "b": "bp60", "c": PAL.redDark}, {"s": 1, "t": "wire", "a": "tn59", "b": "bn59", "c": "#111"}, {"s": 2, "t": "chip", "col": 4, "n": 8, "lab": "555"}, {"s": 2, "t": "wire", "a": "d4", "b": "tp4", "c": PAL.redDark}, {"s": 2, "t": "wire", "a": "j4", "b": "bn4", "c": "#111"}, {"s": 2, "t": "wire", "a": "j7", "b": "bp7", "c": PAL.redDark}, {"s": 3, "t": "res", "a": "c4", "b": "c5", "v": 1000}, {"s": 3, "t": "res", "a": "b5", "b": "b6", "v": 47000}, {"s": 3, "t": "wire", "a": "a6", "b": "i5", "c": PAL.blueDark}, {"s": 3, "t": "ecap", "a": "h5", "b": "bn5", "lab": "10\u00b5"}, {"s": 4, "t": "res", "a": "i6", "b": "i10", "v": 470}, {"s": 4, "t": "led", "a": "h10", "b": "h13", "blink": 1}, {"s": 4, "t": "wire", "a": "j13", "b": "bn13", "c": "#111"}, {"s": 5, "t": "chip", "col": 20, "n": 8, "lab": "555"}, {"s": 5, "t": "wire", "a": "d20", "b": "tp20", "c": PAL.redDark}, {"s": 5, "t": "wire", "a": "j20", "b": "bn20", "c": "#111"}, {"s": 5, "t": "wire", "a": "j23", "b": "bp23", "c": PAL.redDark}, {"s": 6, "t": "res", "a": "c20", "b": "c21", "v": 1000}, {"s": 6, "t": "res", "a": "b21", "b": "b22", "v": 10000}, {"s": 6, "t": "wire", "a": "a22", "b": "i21", "c": PAL.blueDark}, {"s": 6, "t": "ccap", "a": "h21", "b": "bn21", "lab": "100n"}, {"s": 7, "t": "wire", "a": "h6", "b": "a14", "c": PAL.purple}, {"s": 7, "t": "res", "a": "b14", "b": "b23", "v": 10000}, {"s": 8, "t": "res", "a": "h22", "b": "h30", "v": 220}, {"s": 8, "t": "box", "at": [380, 352], "w": 130, "h": 46, "lab": "\ud83d\udd0a 8 \u03a9 speaker", "col": PAL.chipLight, "ly": 28, "pins": [{"n": "", "dx": 18, "dy": 0, "to": "j30", "c": PAL.gold}, {"n": "", "dx": 112, "dy": 0, "to": "bn32", "c": "#111"}]}, {"s": 9, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};
(function(){
// ---------- p17: siren ----------
const SR2={t:0,mode:0,f:690,osc:null,g:null,h1:[],h2:[],acc:0,play:false};
function sirTarget(){const half=0.33;const out=Math.floor(SR2.t/half)%2===0;return {out,f:out?560:880};}
function drawSiren(dt){SR2.t+=dt;const ctx=cv('m17'),T=sirTarget();if(SR2.mode===0)SR2.f=T.f;else SR2.f+=(T.f-SR2.f)*(1-Math.exp(-dt/0.18));
  if(SR2.osc)SR2.osc.frequency.setTargetAtTime(SR2.f,MZ.ac.currentTime,0.005);
  SR2.acc+=dt;if(SR2.acc>0.015){SR2.acc=0;SR2.h1.push(T.out?9:0);SR2.h2.push(SR2.f);if(SR2.h1.length>200){SR2.h1.shift();SR2.h2.shift();}}
  mGraph(ctx,20,20,560,100,[[SR2.h1,PAL.yellow]],-1,12,'555 #1 output (pin 3): 9 V ↔ 0 V, ~1.5 times per second');
  mGraph(ctx,20,150,560,120,[[SR2.h2,PAL.blue]],450,1060,'555 #2 pitch (Hz)');
  txt(ctx,'880 Hz',590,166,PAL.muted,11,'left');txt(ctx,'560 Hz',590,250,PAL.muted,11,'left');
  const x=700,y=150,k=SR2.play?Math.sin(SR2.t*SR2.f*0.05)*3:0;ctx.fillStyle=PAL.chipLight;ctx.fillRect(x-60,y-30,30,60);ctx.beginPath();ctx.moveTo(x-30,y-30);ctx.lineTo(x+10+k,y-70);ctx.lineTo(x+10+k,y+70);ctx.lineTo(x-30,y+30);ctx.closePath();ctx.fill();
  if(SR2.play)for(let i=1;i<=3;i++){ctx.strokeStyle=`rgba(96,165,250,${0.7-i*0.18})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+20,y,20+i*18+((SR2.t*60)%18),-0.7,0.7);ctx.stroke();}
  txt(ctx,Math.round(SR2.f)+' Hz',x-20,y+100,PAL.ink,16);txt(ctx,T.out?'#1 HIGH → pin 5 pulled up → low note':'#1 LOW → pin 5 pulled down → high note',300,292,PAL.yellow,12);}
$('m17play').addEventListener('click',()=>{const ac=mAC();if(SR2.play){SR2.osc.stop();SR2.osc=null;SR2.play=false;$('m17play').textContent='🔊 Play the siren';$('m17play').classList.remove('active');return;}
  SR2.osc=ac.createOscillator();SR2.osc.type='square';SR2.g=ac.createGain();SR2.g.gain.value=0.05;SR2.osc.connect(SR2.g);SR2.g.connect(ac.destination);SR2.osc.frequency.value=SR2.f;SR2.osc.start();SR2.play=true;$('m17play').textContent='⏹ Stop';$('m17play').classList.add('active');});
[['m17a',0],['m17b',1]].forEach(([id,m])=>$(id).addEventListener('click',()=>{SR2.mode=m;$('m17a').classList.toggle('active',m===0);$('m17b').classList.toggle('active',m===1);}));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&SR2.play)$('m17play').click();});
window.addEventListener('hashchange',()=>{if(SR2.play)$('m17play').click();});
loop((dt,now)=>{if(vis('m17'))drawSiren(dt);});
})();
