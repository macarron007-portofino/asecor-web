const asecorImageSettings=fetch('content/imagenes.json',{cache:'no-store'}).then(r=>r.ok?r.json():[]).catch(()=>[]);
function asecorApplyImageSettings(root){
 asecorImageSettings.then(items=>{
  if(!Array.isArray(items))return;
  const normalize=p=>{try{return decodeURIComponent(new URL(p,document.baseURI).pathname).replace(/^.*?\/assets\/uploads\//,'assets/uploads/')}catch(e){return ''}};
  const config=new Map(items.filter(x=>x&&typeof x.imagen==='string').map(x=>[normalize(x.imagen),x]));
  root.querySelectorAll('.asecor-figure').forEach(fig=>{
   const img=fig.querySelector('img');if(!img)return;
   const setting=config.get(normalize(img.getAttribute('src')));if(!setting)return;
   const size=['small','medium','large'].includes(setting.tamano)?setting.tamano:'medium';
   const align=['left','center','right'].includes(setting.alineacion)?setting.alineacion:'center';
   fig.classList.remove('size-small','size-medium','size-large','align-left','align-center','align-right');
   fig.classList.add('size-'+size,'align-'+align);
  });
 });
}
window.AsecorMedia={render:function(text){const root=document.createElement('div');root.className='cms-content';let list=null;for(const raw of (text||'').split('\n')){const s=raw.trim();if(!s){list=null;continue}const im=s.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);if(im){const src=im[2].replace(/^\//,'');if(!/^assets\/uploads\/[\w.\/-]+\.(png|jpe?g|webp|gif)$/i.test(src)||src.includes('..'))continue;const opts=im[1].match(/^\[(small|medium|large)(?: (left|center|right))?\] ?(.*)$/);const fig=document.createElement('figure');fig.className='asecor-figure size-'+(opts?opts[1]:'medium')+' align-'+(opts?(opts[2]||'center'):'center');const img=document.createElement('img');img.src=src;img.alt=opts?opts[3]:im[1];img.loading='lazy';fig.append(img);if(img.alt){const cap=document.createElement('figcaption');cap.textContent=img.alt;fig.append(cap)}root.append(fig);list=null;continue}const pdf=s.match(/^\[([^\]]+)\]\(([^)]+\.pdf)\)$/i);if(pdf){const src=pdf[2].replace(/^\//,'');if(/^assets\/uploads\/[\w.\/-]+\.pdf$/i.test(src)&&!src.includes('..')){const p=document.createElement('p'),a=document.createElement('a');a.href=src;a.textContent='PDF: '+pdf[1];a.target='_blank';a.rel='noopener noreferrer';p.append(a);root.append(p)}continue}const h=s.match(/^(#{1,4})\s+(.+)$/);if(h){const el=document.createElement(h[1].length<3?'h2':'h3');el.textContent=h[2];root.append(el);list=null;continue}const li=s.match(/^[-*] (.+)$/);if(li){if(!list){list=document.createElement('ul');root.append(list)}const el=document.createElement('li');el.textContent=li[1];list.append(el);continue}list=null;const p=document.createElement('p');p.textContent=s.replace(/^\x60|\x60$/g,'').replace(/^\*\*(.+)\*\*$/,'$1');root.append(p)}asecorApplyImageSettings(root);return root}};