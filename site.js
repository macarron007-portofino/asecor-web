document.getElementById('menu-button')?.addEventListener('click',function(){const n=document.getElementById('nav');const open=n.classList.toggle('open');this.setAttribute('aria-expanded',String(open));});
(async()=>{try{const r=await fetch('content/paginas.json',{cache:'no-store'});if(!r.ok)return;const pages=(await r.json()).filter(p=>p.publicada===true&&/^[a-z0-9-]+$/.test(p.slug||'')).sort((a,b)=>(a.orden??999)-(b.orden??999));const nav=document.getElementById('nav');const cards=document.querySelector('.cards');for(const p of pages){const href='pagina.html?id='+encodeURIComponent(p.slug);const link=document.createElement('a');link.href=href;link.textContent=p.titulo;nav?.append(link);if(cards){const card=document.createElement('a');card.href=href;card.textContent=p.titulo;cards.append(card)}}}catch(e){console.warn('No se han cargado las páginas adicionales',e)}})();

(async function(){
 const article=document.querySelector('article[data-page]');
 if(!article)return;
 const page=article.getAttribute('data-page');
 if(!/^[a-z0-9-]+$/.test(page))return;
 try{
  const response=await fetch('content/originales/'+page+'.json',{cache:'no-store'});
  if(!response.ok)return;
  const data=await response.json();
  if(typeof data.titulo==='string'&&data.titulo.trim()){
   const h=document.querySelector('.hero h1');if(h)h.textContent=data.titulo;
  }
  if(typeof data.texto!=='string')return;
  const wrapper=window.AsecorMedia.render(data.texto);
  if(typeof data.imagen==='string'&&/^\/?assets\/uploads\/[a-zA-Z0-9_./-]+\.(png|jpg|jpeg|webp|gif)$/i.test(data.imagen)&&!data.imagen.includes('..')&&!data.texto.includes(']('+data.imagen+')')&&!data.texto.includes(']('+data.imagen.replace(/^\//,'')+')')){
   const img=document.createElement('img');img.src=data.imagen.replace(/^\//,'');img.alt=data.titulo||'Imagen ASECOR';img.className='cms-feature-image';wrapper.prepend(img);
  }
  const cards=page==='index'?article.querySelector('.cards'):null;
  article.replaceChildren(wrapper);
  if(cards)article.append(cards);
 }catch(err){console.warn('Contenido CMS no disponible',err);}
})();
