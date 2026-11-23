
(function(){
const PAGES=__PAGES__;
document.querySelectorAll('a[data-page]').forEach(a=>{const p=a.dataset.page==='hub'?'home':a.dataset.page;a.href='#'+p;a.removeAttribute('target');});
function show(){let id=(location.hash||'#home').slice(1),target=null;
  if(!PAGES.includes(id)){target=document.getElementById(id);const pg=target&&target.closest('.page');id=pg?pg.id.slice(5):'home';}
  PAGES.forEach(p=>{document.getElementById('page-'+p).hidden=p!==id;});
  const acc=getComputedStyle(document.getElementById('page-'+id)).getPropertyValue('--accent');
  document.querySelector('.topbar').style.setProperty('--accent',acc);
  const grp=__GROUP__.includes(id)?'components':id;document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===grp));
  const act=document.querySelector('[data-nav].active');if(act)act.scrollIntoView({block:'nearest',inline:'center'});
  document.title=(id==='home'?'Electronics Learning':document.querySelector('#page-'+id+' h1').textContent+' · Electronics Learning');
  const ca=document.querySelector('#page-'+id+' .cl-menu:not([id]) a.active');if(ca&&window.innerWidth<820){const m=ca.parentElement;m.scrollLeft=ca.offsetLeft-m.clientWidth/2+ca.clientWidth/2;}
  if(target&&!(target.matches('.cl-content > section')))target.scrollIntoView();else window.scrollTo(0,0);}
window.addEventListener('hashchange',show);show();
})();
