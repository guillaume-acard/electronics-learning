// ===== p11: breadboard layout =====
BBL.p11={power:6,parts:[{s:1,t:'pm',until:4},{s:2,t:'btn',col:8,until:4},{s:2,t:'wire',a:'tp8',b:'a8',c:W_R,until:4},
  {s:2,t:'box',at:[300,8],w:110,h:56,lab:'active buzzer',col:PAL.chipDark,ly:30,until:4,pins:[{n:'S',dx:20,dy:56,to:'j10',c:W_Y},{n:'+',dx:55,dy:56,to:'tp20',c:W_R},{n:'−',dx:90,dy:56,to:'tn22',c:W_B}]},
  {s:4,t:'wire',a:'tp3',b:'bp3',c:W_R},{s:4,t:'wire',a:'tn4',b:'bn4',c:W_B},{s:4,t:'chip',col:20,n:8,lab:'NE555'},{s:4,t:'wire',a:'d20',b:'tp20',c:W_R},{s:4,t:'wire',a:'j23',b:'bp23',c:W_R},{s:4,t:'wire',a:'j20',b:'bn20',c:W_B},
  {s:4,t:'res',a:'c20',b:'c21',v:1000},{s:4,t:'res',a:'b21',b:'b22',v:47000,lab:'trim'},{s:4,t:'wire',a:'a22',b:'j21',c:W_U},{s:4,t:'ccap',a:'i21',b:'bn21',lab:'47n'},
  {s:5,t:'ecap',a:'h22',b:'h28',lab:'10µ'},{s:5,t:'buz',a:'g28',b:'g31'},{s:5,t:'wire',a:'j31',b:'bn31',c:W_B},{s:6,t:'batt',at:[40,30],plus:'tp1',minus:'tn2'}]};

(function(){   // demo
// ===== P11 Buzzer =====
const BZ={type:0,drv:0,pressed:false,osc:null,ac:null,g:null,clickT:-9,ph:0};
choices('bzType',['Active buzzer','Passive buzzer / piezo'],0,i=>{BZ.type=i;bzSound();});
choices('bzDrv',['Push button (steady DC)','555 oscillator','Arduino tone()'],0,i=>{BZ.drv=i;bzSound();});
function bzFreq(){const v=+$('bzF').value;return Math.pow(10,v);}
$('bzF').addEventListener('input',()=>{bzSound();});
function bzMode(){// returns {f, mode:'tone'|'click'|'pattern'|'none'}
  if(!BZ.pressed)return {mode:'none'};
  if(BZ.type===0){if(BZ.drv===0)return {mode:'tone',f:2400};if(BZ.drv===1)return {mode:'pattern',f:2400};return {mode:'tone',f:2400};}
  if(BZ.drv===0)return {mode:'click'};return {mode:'tone',f:bzFreq()};}
function bzClick(){try{BZ.ac=BZ.ac||new (window.AudioContext||window.webkitAudioContext)();const ac=BZ.ac,o=ac.createOscillator(),g=ac.createGain();o.type='square';o.frequency.value=180;g.gain.setValueAtTime(0.12,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.0001,ac.currentTime+0.04);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+0.05);}catch(e){}BZ.clickT=CT;}
function bzSound(){const m=bzMode();try{
  if(m.mode==='tone'||m.mode==='pattern'){BZ.ac=BZ.ac||new (window.AudioContext||window.webkitAudioContext)();
    if(!BZ.osc){BZ.osc=BZ.ac.createOscillator();BZ.g=BZ.ac.createGain();BZ.osc.type='square';BZ.g.gain.value=0.05;BZ.osc.connect(BZ.g);BZ.g.connect(BZ.ac.destination);BZ.osc.start();}
    BZ.osc.frequency.value=m.f;}
  else if(BZ.osc){BZ.osc.stop();BZ.osc=null;}}catch(e){}}
const bzb=$('bzBtn');bzb.style.touchAction='none';bzb.style.userSelect='none';
bzb.addEventListener('pointerdown',e=>{e.preventDefault();BZ.pressed=true;if(BZ.type===1&&BZ.drv===0)bzClick();bzSound();});
['pointerup','pointerleave','pointercancel'].forEach(ev=>bzb.addEventListener(ev,()=>{if(!BZ.pressed)return;BZ.pressed=false;if(BZ.type===1&&BZ.drv===0)bzClick();bzSound();}));
function buzzerSym(ctx,x,y,active,vib){ctx.save();ctx.translate(x,y);ctx.fillStyle=PAL.chipDark;ctx.strokeStyle=PAL.ink2;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,0,26,0,7);ctx.fill();ctx.stroke();
  ctx.strokeStyle=active?PAL.yellow:PAL.muted;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,14+vib*3,0,7);ctx.stroke();
  txt(ctx,active?'ACT':'PZ',0,4,PAL.muted,9);ctx.restore();}
function P11(dt){const ctx=cv('cp11'),m=bzMode(),f=BZ.type===0?2400:bzFreq();$('bzFt').textContent=BZ.type===0&&BZ.drv!==2?'fixed ~2.4 kHz':Math.round(bzFreq())+' Hz';
  if(BZ.osc&&m.mode==='pattern'){const on=(CT%0.6)<0.3;BZ.g.gain.value=on?0.05:0;}
  else if(BZ.osc)BZ.g.gain.value=0.05;
  const sounding=m.mode==='tone'||(m.mode==='pattern'&&(CT%0.6)<0.3),clickNow=CT-BZ.clickT<0.12;BZ.ph+=dt*(sounding?40:0);
  const T=50,B=250;
  if(BZ.drv===0){part(ctx,'batt',70,T,70,B,{label:'9 V',left:true});wire(ctx,[[70,T],[160,T]]);part(ctx,'switch',160,T,240,T,{closed:BZ.pressed,label:'button'});wire(ctx,[[240,T],[330,T],[330,124]]);wire(ctx,[[330,176],[330,B],[70,B]]);
    txt(ctx,'+',345,120,PAL.redSoft,13);}
  else if(BZ.drv===1){wire(ctx,[[40,T],[400,T]],PAL.redSoft);wire(ctx,[[40,B],[400,B]],PAL.blue);txt(ctx,'+9 V',36,T+4,PAL.redSoft,11,'right');txt(ctx,'0 V',36,B+4,PAL.blue,11,'right');
    __PR(ctx,{t:'chip',x:90,y:95,w:100,h:110});ctx.fillStyle=PAL.chip;ctx.fillRect(90,95,100,110);ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.strokeRect(90,95,100,110);txt(ctx,'NE555',140,148,PAL.ink,13);txt(ctx,BZ.type?'tone':'beep pattern',140,166,PAL.muted,10);
    wire(ctx,[[140,T],[140,95]]);wire(ctx,[[140,205],[140,B]]);part(ctx,'switch',60,T,60,B,{closed:BZ.pressed});
    wire(ctx,[[190,150],[230,150]]);part(ctx,'cap',230,150,290,150,{label:'10 µF'});wire(ctx,[[290,150],[330,150],[330,124]]);wire(ctx,[[330,176],[330,B]]);txt(ctx,'pin 3',196,142,PAL.muted,10,'left');}
  else{ctx.fillStyle='#0e7490';ctx.fillRect(60,90,120,120);txt(ctx,'Arduino',120,140,PAL.white,14);txt(ctx,BZ.type?'tone(8, f)':'digitalWrite(8,HIGH)',120,160,'#cffafe',10);
    wire(ctx,[[180,130],[220,130]]);part(ctx,'res',220,130,290,130,{label:'100 Ω'});wire(ctx,[[290,130],[330,130],[330,124]]);wire(ctx,[[330,176],[330,B],[120,B],[120,210]],PAL.blue);txt(ctx,'pin 8',186,122,PAL.muted,10,'left');txt(ctx,'GND',126,226,PAL.blue,10,'left');}
  const vib=sounding?Math.sin(BZ.ph*6):clickNow?1:0;buzzerSym(ctx,330,150,BZ.type===0,vib);
  // sound waves
  if(sounding||clickNow){ctx.strokeStyle=PAL.blue;ctx.lineWidth=2;for(let i=0;i<4;i++){const r=(clickNow&&!sounding)?20+i*10:24+i*16+((BZ.ph*4)%16);ctx.globalAlpha=clickNow&&!sounding?0.6-i*0.15:0.7-i*0.15;ctx.beginPath();ctx.arc(330,150,r+20,-0.6,0.6);ctx.stroke();}ctx.globalAlpha=1;}
  // signal graph
  const gx=470,gw=310;ctx.fillStyle=PAL.raised;ctx.fillRect(gx,40,gw,90);txt(ctx,'push on the buzzer',gx+4,34,PAL.muted,11,'left');
  ctx.strokeStyle=Y;ctx.lineWidth=2;ctx.beginPath();const show=BZ.type===0?40:Math.min(40,f/60);
  for(let px=0;px<=gw;px++){let v=0;if(BZ.pressed){if(BZ.drv===0)v=1;else{const ph=(px/gw*show)%1;v=ph<0.5?1:0;if(BZ.type===0&&BZ.drv===1)v=1;}}const yy=120-v*70;px?ctx.lineTo(gx+px,yy):ctx.moveTo(gx+px,yy);}ctx.stroke();
  let msg,col;
  if(!BZ.pressed){msg='Hold the button…';col=PAL.muted;}
  else if(m.mode==='click'){msg='Steady DC on a passive buzzer: just a click, no tone ✗';col=Y;}
  else if(m.mode==='pattern'){msg='Active buzzer switched on/off by the 555: beep… beep…';col=PAL.good;}
  else if(BZ.type===0){msg='Active buzzer: its own oscillator beeps at a fixed pitch ✓';col=PAL.good;}
  else{msg='Passive buzzer plays the square wave: '+Math.round(f)+' Hz ✓';col=PAL.good;}
  wrapText(ctx,msg,gx,170,gw,20,col,14);
  if(BZ.type===0&&BZ.drv===0)txt(ctx,'(steady DC in, the buzzer makes the wave inside)',gx,235,PAL.muted,11,'left');}
loop((dt,now)=>{if(vis('cp11'))P11(dt);});
})();
