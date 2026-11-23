// ===== Microchips page: chip registry and helpers shared by the chip files (chips/*.js) =====
// Each chip file calls CHIP(id,{pinout,inside,minimal,art}) and runs its own demo.
const CHIPS={};function CHIP(id,d){CHIPS[id]=d;}

function dipArt(lab,n,sub,col){const h=n/2,w=Math.min(220,30+h*24),x0=160-w/2,y0=70;let legs='';for(let i=0;i<h;i++){const x=x0+16+i*((w-32)/(h-1||1));legs+=`<rect x="${x-4}" y="${y0-22}" width="8" height="22" fill="${PAL.ink2}"/><rect x="${x-4}" y="${y0+70}" width="8" height="22" fill="${PAL.ink2}"/>`;}
  return `<svg viewBox="0 0 320 200">${legs}<rect x="${x0}" y="${y0}" width="${w}" height="70" rx="6" fill="${PAL.chipDark}" stroke="${col}" stroke-width="2"/><path d="M${x0} ${y0+25} a10 10 0 0 1 0 20" fill="${PAL.canvas}" stroke="${col}" stroke-width="2"/><circle cx="${x0+14}" cy="${y0+56}" r="4" fill="${PAL.slate}"/><text x="160" y="${y0+40}" text-anchor="middle" fill="${PAL.ink}" font-size="${lab.length>6?18:22}" font-weight="800" font-family="ui-monospace,monospace">${lab}</text><text x="160" y="${y0+58}" text-anchor="middle" fill="${PAL.muted}" font-size="10" font-family="system-ui">${n} pins</text><text x="160" y="190" text-anchor="middle" fill="${col}" font-size="13" font-weight="700" font-family="system-ui">${sub}</text></svg>`;}
const to220Art=`<svg viewBox="0 0 320 200"><rect x="110" y="10" width="100" height="56" rx="4" fill="${PAL.muted}"/><circle cx="160" cy="36" r="12" fill="${PAL.canvas}"/><rect x="110" y="62" width="100" height="70" rx="4" fill="${PAL.chipDark}" stroke="${PAL.slate}" stroke-width="2"/><text x="160" y="104" text-anchor="middle" fill="${PAL.ink}" font-size="20" font-weight="800" font-family="ui-monospace,monospace">7805</text><path d="M130 132 v46 M160 132 v46 M190 132 v46" stroke="${PAL.ink2}" stroke-width="6"/><text x="130" y="196" text-anchor="middle" fill="${PAL.bad}" font-size="11" font-family="system-ui">IN</text><text x="160" y="196" text-anchor="middle" fill="${PAL.muted}" font-size="11" font-family="system-ui">GND</text><text x="190" y="196" text-anchor="middle" fill="${PAL.good}" font-size="11" font-family="system-ui">5 V</text></svg>`;

// ===== DIP helper =====
function dip(ctx,x,y,labels,title,hl=[],sp=20){const n=labels.length,h=n/2,w=70,H=h*sp+10;
  ctx.fillStyle=PAL.chip;ctx.fillRect(x,y,w,H);ctx.strokeStyle=PAL.slate;ctx.lineWidth=1.5;ctx.strokeRect(x,y,w,H);
  ctx.fillStyle=PAL.canvas;ctx.beginPath();ctx.arc(x+w/2,y,8,0,Math.PI);ctx.fill();ctx.fillStyle=PAL.muted;ctx.beginPath();ctx.arc(x+12,y+12,3,0,7);ctx.fill();
  arrowText(ctx,title,x+w/2,y+H/2+4,PAL.ink,12);
  for(let i=0;i<h;i++){const py=y+15+i*sp;
    [[i,x-12,'right',x-16],[n-1-i,x+w,'left',x+w+16]].forEach(([k,px,al,tx])=>{const on=hl.includes(k+1);ctx.fillStyle=on?PAL.yellow:PAL.ink2;ctx.fillRect(px,py-3,12,6);
      arrowText(ctx,(al==='right'?labels[k]+' '+(k+1):(k+1)+' '+labels[k]),tx,py+4,on?PAL.yellow:PAL.muted,10,al);});}
  return H;}


function bitDots(ctx,x,y,v,names,click){names.forEach((nm,i)=>{const w=[1,2,4,8][i],on=(v&w)!==0,cx=x,cy=y+i*44;ctx.fillStyle=on?PAL.green:PAL.raised;ctx.beginPath();ctx.arc(cx,cy,16,0,7);ctx.fill();ctx.strokeStyle=PAL.slate;ctx.stroke();
  ctx.fillStyle=on?'#04210f':PAL.muted;ctx.font='700 13px system-ui';ctx.textAlign='center';ctx.fillText(on?'1':'0',cx,cy+5);ctx.fillStyle=PAL.ink2;ctx.font='12px system-ui';ctx.textAlign='left';ctx.fillText(nm+' (= '+w+')',cx+26,cy+4);});}

const vis=c=>c&&c.offsetParent;
