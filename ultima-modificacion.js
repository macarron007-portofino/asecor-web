(async function(){
  const footer=document.querySelector('footer .container')||document.querySelector('footer');
  if(!footer)return;
  const label=document.createElement('small');
  label.className='ultima-modificacion';
  label.style.cssText='display:block;margin-top:12px;font-size:12px;opacity:.75';
  footer.append(label);
  try{
    const response=await fetch('https://api.github.com/repos/macarron007-portofino/asecor-web/commits/main',{cache:'no-store'});
    if(!response.ok)throw Error('GitHub no disponible');
    const commits=await response.json();
    const commit=Array.isArray(commits)?commits[0]:null;
    const date=commit?.commit?.committer?.date||commit?.commit?.author?.date;
    if(!date||isNaN(Date.parse(date)))throw Error('Fecha no disponible');
    const formatted=new Intl.DateTimeFormat('es-ES',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Madrid'}).format(new Date(date));
    label.textContent='Última modificación de la web: '+formatted;
  }catch(error){label.remove();}
})();
