// ===== p16: breadboard layout + demo =====
BBL.p16={"power": 6, "parts": [{"s": 1, "t": "npn", "c": "c10", "b": "c11", "e": "c12"}, {"s": 1, "t": "npn", "c": "c30", "b": "c31", "e": "c32"}, {"s": 1, "t": "wire", "a": "a12", "b": "tn13", "c": "#111"}, {"s": 1, "t": "wire", "a": "a32", "b": "tn33", "c": "#111"}, {"s": 2, "t": "res", "a": "tp7", "b": "a7", "v": 470}, {"s": 2, "t": "led", "a": "b7", "b": "b10", "blink": 1}, {"s": 2, "t": "res", "a": "tp27", "b": "a27", "v": 470}, {"s": 2, "t": "led", "a": "b27", "b": "b30", "rgb": "34,197,94", "blink": 2}, {"s": 3, "t": "res", "a": "tp11", "b": "a11", "v": 47000}, {"s": 3, "t": "res", "a": "tp31", "b": "a31", "v": 47000}, {"s": 4, "t": "ecap", "a": "e10", "b": "e14", "lab": "10\u00b5"}, {"s": 4, "t": "wire", "a": "d14", "b": "d31", "c": PAL.orangeDark}, {"s": 5, "t": "ecap", "a": "e30", "b": "e26", "lab": "10\u00b5"}, {"s": 5, "t": "wire", "a": "d26", "b": "d11", "c": PAL.blueDark}, {"s": 6, "t": "batt", "at": [40, 30], "plus": "tp1", "minus": "tn2"}]};
(function(){
// ---------- p16: flip-flop ----------
const FF={on:1,t:0,vb:[0.65,-7.8],h1:[],h2:[],acc:0};
function drawFF(dt){const c1=+$('m16c1').value*1e-6,c2=+$('m16c2').value*1e-6,R=47e3,Vb=9,ctx=cv('m16');
  // on=1 → Q1 on, Q2 off (its base recovers through 47k via C1)
  const n=4;for(let k=0;k<n;k++){const d=dt/n;if(FF.on===1){FF.vb[1]=Vb-(Vb-FF.vb[1])*Math.exp(-d/(R*c1));FF.vb[0]=0.65;if(FF.vb[1]>=0.65){FF.on=2;FF.vb[0]=0.65-(Vb-0.2);FF.vb[1]=0.65;}}
    else{FF.vb[0]=Vb-(Vb-FF.vb[0])*Math.exp(-d/(R*c2));FF.vb[1]=0.65;if(FF.vb[0]>=0.65){FF.on=1;FF.vb[1]=0.65-(Vb-0.2);FF.vb[0]=0.65;}}}
  FF.acc+=dt;if(FF.acc>0.02){FF.acc=0;FF.h1.push(FF.vb[0]);FF.h2.push(FF.vb[1]);if(FF.h1.length>180){FF.h1.shift();FF.h2.shift();}}
  const q1=FF.on===1,q2=!q1;
  // schematic
  W(ctx,[[30,30],[430,30]],PAL.bad,3);txt(ctx,'+9 V',30,22,PAL.bad,12,'left');W(ctx,[[30,280],[430,280]],PAL.muted2,3);txt(ctx,'0 V',30,296,PAL.muted,12,'left');
  [[90,q1,'239,68,68','LED 1'],[370,q2,'34,197,94','LED 2']].forEach(([x,on,rgb,l])=>{mRes(ctx,x,30,x,80,'470 Ω');W(ctx,[[x,96],[x,100]]);mLed(ctx,x,110,on,rgb);txt(ctx,l,x+(x<200?-16:16),114,PAL.ink2,11,x<200?'right':'left');W(ctx,[[x,120],[x,180]]);W(ctx,[[x,248],[x,280]]);});
  const npnM=(x,y,on)=>{ctx.save();ctx.translate(2*x,0);ctx.scale(-1,1);npnQ(ctx,x,y,on);ctx.restore();};
  npnM(100,214,q1);npnQ(ctx,360,214,q2);
  mRes(ctx,170,30,170,110,'47 kΩ');W(ctx,[[170,110],[170,214],[134,214]]);mRes(ctx,290,30,290,110,'47 kΩ');W(ctx,[[290,110],[290,214],[326,214]]);
  const cap=(x,y,lab)=>{ctx.fillStyle=PAL.canvas;ctx.fillRect(x-10,y-14,20,28);W(ctx,[[x-4,y-13],[x-4,y+13]],WIRE,3);W(ctx,[[x+4,y-13],[x+4,y+13]],WIRE,3);txt(ctx,lab,x,y-18,PAL.muted,11);};
  W(ctx,[[90,140],[290,140]]);cap(225,140,'C1');W(ctx,[[370,190],[170,190]]);cap(235,190,'C2');
  [[90,140],[290,140],[370,190],[170,190]].forEach(([x,y])=>{ctx.fillStyle=WIRE;ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill();});
  const vt=v=>(v>=0?'+':'')+v.toFixed(1)+' V';txt(ctx,vt(FF.vb[0]),150,232,FF.vb[0]<0?PAL.bad:PAL.good,12);txt(ctx,vt(FF.vb[1]),310,232,FF.vb[1]<0?PAL.bad:PAL.good,12);
  txt(ctx,q1?'Q1 ON':'Q1 off',36,266,q1?PAL.good:PAL.muted2,12,'left');txt(ctx,q2?'Q2 ON':'Q2 off',430,266,q2?PAL.good:PAL.muted2,12,'right');
  // graphs
  mGraph(ctx,460,20,320,120,[[FF.h1,PAL.bad],[FF.h1.map(()=>0.65),PAL.muted2,[4,4]]],-9,9,'Q1 base voltage (−8 … +0.6 V)');
  mGraph(ctx,460,160,320,120,[[FF.h2,PAL.green],[FF.h2.map(()=>0.65),PAL.muted2,[4,4]]],-9,9,'Q2 base voltage');
  const t1=0.69*R*c1,t2=0.69*R*c2;txt(ctx,`LED 1 on ≈ ${t1.toFixed(2)} s · LED 2 on ≈ ${t2.toFixed(2)} s`,620,298,PAL.yellow,12);}
loop((dt,now)=>{if(vis('m16'))drawFF(dt);});
})();
