// ===== Circuits page: wiring checklists, breadboard drawing (loaded after projects/*.js) =====
// wire up final + live canvases
window.BBL_LAYOUTS=BBL;   // read by the Build lab ("🔧 Build it" buttons)
const BBV=[];
document.querySelectorAll('.cl-content section').forEach(sec=>{const id=sec.id;if(!BBL[id])return;const F=document.getElementById('bbF_'+id),S=document.getElementById('bbS_'+id);
  const boxes=[...sec.querySelectorAll('.wsteps input[type=checkbox]')];BBV.push({id,F,S,boxes});});
function drawBBs(t){BBV.forEach(v=>{if(vis('bbF_'+v.id))renderBB(v.id,v.F.getContext('2d'),null,t);if(vis('bbS_'+v.id)){const T=new Set();v.boxes.forEach((b,i)=>{if(b.checked)T.add(i+1);});renderBB(v.id,v.S.getContext('2d'),T,t);}});}
loop((dt,now)=>{drawBBs(CT);});

