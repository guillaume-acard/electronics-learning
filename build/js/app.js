
(function(){
const PAGES=["home", "resistor", "capacitor", "diode", "led", "transistor", "inductor", "relay", "motion", "formulas", "sensors", "chips", "parts", "circuits", "build", "quiz"];
let prev=null;   // page shown before this hash change
document.querySelectorAll('a[data-page]').forEach(a=>{const p=a.dataset.page==='hub'?'home':a.dataset.page;a.href='#'+p;a.removeAttribute('target');});
function show(){let id=(location.hash||'#home').slice(1),target=null;
  if(!PAGES.includes(id)){target=document.getElementById(id);const pg=target&&target.closest('.page');id=pg?pg.id.slice(5):'home';}
  PAGES.forEach(p=>{document.getElementById('page-'+p).hidden=p!==id;});
  const acc=getComputedStyle(document.getElementById('page-'+id)).getPropertyValue('--accent');
  document.querySelector('.topbar').style.setProperty('--accent',acc);
  const grp=["resistor", "capacitor", "diode", "led", "transistor", "inductor", "relay", "motion"].includes(id)?'components':id;document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===grp));
  const act=document.querySelector('[data-nav].active');if(act)act.scrollIntoView({block:'nearest',inline:'center'});
  document.title=(id==='home'?'Electronics Learning':document.getElementById('page-'+id).dataset.title+' · Electronics Learning');
  const ca=document.querySelector('#page-'+id+' .cl-menu:not([id]) a.active');if(ca&&window.innerWidth<820){const m=ca.parentElement;m.scrollLeft=ca.offsetLeft-m.clientWidth/2+ca.clientWidth/2;}
  // Scroll: a section of the same page, or another page of the same group (Components), keeps the hero out of
  // the way: the menu + content area goes right under the top bar, so the left menu stays where it is.
  const layout=document.querySelector('#page-'+id+' .cl-layout');
  const sameArea=prev&&(prev===id||(["resistor", "capacitor", "diode", "led", "transistor", "inductor", "relay", "motion"].includes(prev)&&["resistor", "capacitor", "diode", "led", "transistor", "inductor", "relay", "motion"].includes(id)));
  if(target&&!(target.matches('.cl-content > section')))target.scrollIntoView();
  else if(sameArea&&layout){const bar=document.querySelector('.topbar').offsetHeight;window.scrollTo(0,layout.getBoundingClientRect().top+window.scrollY-bar-12);}
  else window.scrollTo(0,0);
  prev=id;}
window.addEventListener('hashchange',show);show();
})();
