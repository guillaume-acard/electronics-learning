// ===== p20: breadboard layout + demo =====
BBL.p20={power:9,parts:BBL.p12.parts.filter(p=>p.s!==9).map(p=>p.t==='box'?Object.assign({},p,{w:280,pins:p.pins.filter(q=>q.n!=='D12').concat([{n:'5V',dx:244,dy:72,to:'tp55',s:9,c:W_R},{n:'A0',dx:264,dy:72,to:'b56',s:9,c:W_Y}])}):p.t==='seg7'?Object.assign({},p,{show:p.col===20?'abged':'abgcd'}):p).concat([
  {s:9,t:'box',at:[600,10],w:160,h:50,lab:'🌡️ LM35 module',col:'#9a3412',ly:22,pins:[{n:'S',dx:30,dy:50,to:'a56',c:W_Y},{n:'Vcc',dx:80,dy:50,to:'tp57',c:W_R},{n:'Gnd',dx:130,dy:50,to:'tn58',c:W_B}]}])};   // built from p12 (p12.js loads first)
(function(){
// ---------- p20: thermometer ----------
const TH={T:22,hot:false,acc:0,shown:22,code:0,calc:22};
function drawTherm(dt){const ctx=cv('m20');TH.T+=((TH.hot?34:22)-TH.T)*(1-Math.exp(-dt/(TH.hot?3:6)));
  const ref=$('thRef').checked?1.1:5,avg=$('thAvg').checked,V=TH.T*0.01;
  TH.acc+=dt;if(TH.acc>0.5){TH.acc=0;const noise=()=>(Math.random()+Math.random()+Math.random()-1.5)*2.4;let sum=0;const n=avg?20:1;for(let i=0;i<n;i++)sum+=Math.max(0,Math.round(V/ref*1023+noise()));TH.code=sum/n;TH.calc=TH.code*ref/1023*100;TH.shown=Math.max(0,Math.min(99,Math.round(TH.calc)));}
  // thermometer
  const tx0=50,top=40,bot=230,f=Math.max(0,Math.min(1,(TH.T-10)/30));ctx.fillStyle=PAL.raised;ctx.beginPath();ctx.roundRect(tx0-10,top,20,bot-top,10);ctx.fill();ctx.beginPath();ctx.arc(tx0,bot+14,20,0,7);ctx.fill();
  ctx.fillStyle=PAL.bad;ctx.beginPath();ctx.arc(tx0,bot+14,14,0,7);ctx.fill();ctx.fillRect(tx0-5,bot-(bot-top-10)*f,10,(bot-top-10)*f+10);
  for(let k=10;k<=40;k+=5){const y=bot-(bot-top-10)*((k-10)/30);txt(ctx,k+'°',tx0+18,y+4,PAL.muted2,10,'left');}
  txt(ctx,TH.T.toFixed(1)+' °C',tx0,24,PAL.ink,13);if(TH.hot)txt(ctx,'🤏',tx0+2,bot+60,PAL.white,22);
  const box=(x,y,w,h,t1,t2,col)=>{ctx.fillStyle=PAL.panel;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,h,8);ctx.fill();ctx.stroke();txt(ctx,t1,x+w/2,y+24,PAL.ink2,12);txt(ctx,t2,x+w/2,y+52,PAL.white,17);};
  const ar=(x1,x2,y)=>{W(ctx,[[x1,y],[x2-8,y]],PAL.muted2,2);ctx.fillStyle=PAL.muted2;ctx.beginPath();ctx.moveTo(x2,y);ctx.lineTo(x2-9,y-5);ctx.lineTo(x2-9,y+5);ctx.fill();};
  box(110,90,130,74,'LM35 "S" pin',(V*1000).toFixed(0)+' mV',PAL.orange);ar(240,265,127);
  box(265,90,150,74,'ADC (ref '+ref+' V)',(avg?'avg ':'')+TH.code.toFixed(avg?1:0)+' / 1023',PAL.violet);ar(415,440,127);
  box(440,90,130,74,'× '+ref+' ÷ 1023 × 100',TH.calc.toFixed(1)+' °C',PAL.green);ar(570,592,127);
  const tens=Math.floor(TH.shown/10),u=TH.shown%10;drawDigit(ctx,604,70,0.95,tens?DIGITS[tens]:'',{pad:10,glow:10});drawDigit(ctx,690,70,0.95,DIGITS[u],{pad:10,glow:10});
  txt(ctx,'one ADC step = '+(ref/1023*100).toFixed(2)+' °C',340,200,ref<2?PAL.good:PAL.yellow,13);
  txt(ctx,ref<2?'1.1 V jug: fine marks, 0.1 °C resolution':'5 V jug: coarse marks, the last digit can flip-flop',340,222,PAL.muted,12);
  txt(ctx,avg?'20 readings averaged: steady':'single reading: noisy, watch the digits jitter',340,244,PAL.muted,12);}
(()=>{const b=$('thHot');hold(b,on=>{TH.hot=on;});})();
// chart: the sensor's voltage over time (hold 🤏 to warm it)
const G20R=mRec();
function G20(){const ctx=$('m20').getContext('2d');mRecPush(G20R,TH.T*0.01);
  mScope(ctx,15,300,770,115,{title:'LM35 "S" pin: 10 mV per °C (hold the sensor to warm it)',span:30,lo:0.15,hi:0.4,unit:'V',refs:[[0.22,'22 °C'],[0.34,'34 °C']],traces:[{rec:G20R,col:PAL.orange}]});}
loop((dt,now)=>{if(vis('m20')){drawTherm(dt);G20();}});
})();
