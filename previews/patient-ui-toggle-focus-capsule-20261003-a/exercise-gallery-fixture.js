(()=> {
  const CDN='https://bryllim.github.io/workout-guide/frames/';
  const items={
    'Beinpresse':'leg-press',
    'Rudern sitzend':'seated-row',
    'Brustpresse Maschine':'machine-chest-press',
    'Schulterdrücken Maschine':'machine-shoulder-press',
    'Latzug':'lat-pulldown',
    'Beinbeuger sitzend':'seated-leg-curl',
    'Plank':'plank',
    'Seitstütz mit Hüftsenken':'side-plank-hip-dip',
    'Rückenstrecker':'back-extension',
    'Beinschwünge Mobilität':'leg-swings-stretch'
  };
  function addStyle(){
    if(document.getElementById('kggDemoGalleryStyle'))return;
    const s=document.createElement('style');s.id='kggDemoGalleryStyle';
    s.textContent=`
      .kggDemoExerciseMedia{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0 2px;padding:5px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc}
      .kggDemoExerciseMedia img{display:block;width:100%;height:88px;object-fit:contain;background:#fff;border-radius:9px}
      .kggDemoExerciseMedia small{grid-column:1/-1;color:#64748b;font-size:9px;line-height:1.2}
      .kggDemoAttribution{margin:14px 0 4px;padding:9px 10px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;color:#64748b;font-size:10px;line-height:1.35}
      .kggDemoAttribution a{color:#475569}
      @media(max-width:430px){.kggDemoExerciseMedia img{height:72px}}
    `;
    document.head.appendChild(s);
  }
  function decorate(){
    addStyle();
    document.querySelectorAll('#list .ex').forEach(card=>{
      if(card.querySelector('.kggDemoExerciseMedia'))return;
      const name=(card.querySelector('h3')?.textContent||'').trim();
      const slug=items[name]; if(!slug)return;
      const box=document.createElement('div');box.className='kggDemoExerciseMedia';
      const u=n=>CDN+slug+'/frame-'+n+'.svg';
      box.innerHTML='<img loading="lazy" src="'+u(1)+'" alt="'+name+' Ausgangsposition"><img loading="lazy" src="'+u(3)+'" alt="'+name+' Endposition"><small>Testbild · Workout Guide / Everkinetic</small>';
      const meta=card.querySelector('.muted');
      (meta||card.querySelector('h3')).insertAdjacentElement('afterend',box);
    });
    const plan=document.getElementById('plan');
    if(plan&&!document.getElementById('kggDemoAttribution')){
      const a=document.createElement('div');a.id='kggDemoAttribution';a.className='kggDemoAttribution';
      a.innerHTML='Übungsbilder: <a href="https://bryllim.github.io/workout-guide/" target="_blank" rel="noopener">Workout Guide</a>, Original-Posen teils von Everkinetic · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>. Nur Test-Preview.';
      plan.appendChild(a);
    }
  }
  const mo=new MutationObserver(()=>decorate());
  mo.observe(document.documentElement,{childList:true,subtree:true});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',decorate,{once:true}):decorate();
  setTimeout(decorate,250); setTimeout(decorate,900);
})();