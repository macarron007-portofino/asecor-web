(async function(){
  const article=document.querySelector('article[data-page]');
  const extra=new URLSearchParams(location.search).get('id');
  const path=article?'content/originales/'+article.dataset.page+'.json':extra?'content/paginas.json':null;
  if(!path)return;
  const footer=document.querySelector('footer .container')||document.querySelector('footer');
  if(!footer)return;
  const label=document.createElement('small');
  label.className='ultima-modificacion';
  label.style.cssText='display:block;margin-top:12px;font-size:12px;opacity:.75';
  footer.append(label);
  try{
    let date=null;
    const res=await fetch(path+'?v='+Date.now(),{cache:'no-store'});
    if(res.ok){
      const data=await res.json();
      if(extra&&Array.isArray(data)){
        const normalize=s=>String(s||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
        date=data.find(p=>normalize(p.slug||p.titulo)===normalize(extra))?.ultima_modificacion;
      }else if(!extra)date=data.ultima_modificacion;
    }
    if(!date){
      const url='https://api.github.com/repos/macarron007-portofino/asecor-web/commits?path='+encodeURIComponent(path)+'&per_page=1';
      const response=await fetch(url,{cache:'no-store'});
      if(response.ok){const commits=await response.json();date=commits[0]?.commit?.committer?.date;}
    }
    if(date&&!isNaN(Date.parse(date))){
      label.textContent='Última modificación: '+new Intl.DateTimeFormat('es-ES',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Madrid'}).format(new Date(date));
    }else label.remove();
  }catch(e){label.remove();}
})();
