(()=>{
  const VERSION='card-progress-v2-complete-fields';
  const STYLE_ID='kgg-card-progress-style';
  const BADGE_CLASS='kggCardProgress';
  if(window.__kggCardProgress===VERSION)return;
  window.__kggCardProgress=VERSION;

  function stateForCount(count,total){
    const filled=Math.max(0,Number(count)||0);
    const expected=Math.max(0,Number(total)||0);
    if(filled===0)return 'open';
    if(expected>0&&filled>=expected)return 'done';
    return 'partial'
  }
  function language(){return localStorage.getItem('kggPatientLang')==='en'?'en':'de'}
  function labelForState(state,lang){
    const en=(lang||language())==='en';
    if(state==='done')return en?'✓ Done':'✓ Bearbeitet';
    if(state==='partial')return en?'◐ Partial':'◐ Teilweise';
    return en?'○ Open':'○ Offen'
  }
  function normalValueInputs(card){
    if(!card||typeof card.querySelectorAll!=='function')return [];
    return [...card.querySelectorAll('.set input.num')]
  }
  function filledCount(card){
    return completionSummary(card).filled
  }
  function completionSummary(card){
    const inputs=normalValueInputs(card);
    const filled=inputs.filter(input=>String(input&&input.value!=null?input.value:'').trim()!=='').length;
    return{filled,total:inputs.length,worked:filled>0,state:stateForCount(filled,inputs.length)}
  }
  function summariesForCards(root){
    const scope=root||document;
    if(!scope||typeof scope.querySelectorAll!=='function')return [];
    return [...scope.querySelectorAll('#list .ex')].map((card,index)=>Object.assign({index},completionSummary(card)))
  }
  function ensureStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`.${BADGE_CLASS}{display:none}body.kggCardsCollapsed .ex:not(.kggOpen) .${BADGE_CLASS},body.kggAlwaysCollapsed .ex:not(.kggOpen) .${BADGE_CLASS}{display:inline-flex!important;align-items:center;width:max-content;max-width:100%;margin:0 0 2px;padding:3px 8px;border:1px solid #cbd5e1;border-radius:999px;background:#f8fafc;color:#64748b;font-size:11px;font-weight:900;line-height:1.2;white-space:nowrap}body.kggCardsCollapsed .ex:not(.kggOpen) .${BADGE_CLASS}.kggProgressPartial,body.kggAlwaysCollapsed .ex:not(.kggOpen) .${BADGE_CLASS}.kggProgressPartial{border-color:#fcd34d;background:#fffbeb;color:#92400e}body.kggCardsCollapsed .ex:not(.kggOpen) .${BADGE_CLASS}.kggProgressDone,body.kggAlwaysCollapsed .ex:not(.kggOpen) .${BADGE_CLASS}.kggProgressDone{border-color:#86efac;background:#ecfdf5;color:#166534}`;
    document.head.appendChild(style)
  }
  function ensureBadge(card){
    let badge=card.querySelector('.'+BADGE_CLASS);
    if(badge)return badge;
    badge=document.createElement('span');
    badge.className=BADGE_CLASS;
    badge.setAttribute('aria-live','polite');
    const title=card.querySelector('h3');
    if(title&&title.insertAdjacentElement)title.insertAdjacentElement('afterend',badge);
    else card.insertBefore(badge,card.firstChild||null);
    return badge
  }
  function updateCard(card){
    if(!card)return;
    const summary=completionSummary(card),count=summary.filled,state=summary.state;
    const badge=ensureBadge(card);
    badge.className=BADGE_CLASS+' kggProgress'+state.charAt(0).toUpperCase()+state.slice(1);
    badge.textContent=labelForState(state);
    badge.dataset.kggProgress=state;
    badge.dataset.kggFilledCount=String(count);
    badge.dataset.kggExpectedCount=String(summary.total);
    badge.title=badge.textContent;
    badge.setAttribute('aria-label',badge.textContent)
  }
  function cards(){return [...document.querySelectorAll('#list .ex')]}
  function updateAll(){ensureStyle();cards().forEach(updateCard)}
  let updateTimer=0;
  function scheduleUpdate(delay){
    clearTimeout(updateTimer);
    updateTimer=setTimeout(updateAll,Number(delay)||0)
  }
  function bindEvents(){
    if(window.__kggCardProgressEvents)return;
    window.__kggCardProgressEvents=1;
    document.addEventListener('input',event=>{if(event.target&&event.target.matches&&event.target.matches('#list .set input.num'))scheduleUpdate(0)},true);
    document.addEventListener('change',event=>{if(event.target&&event.target.matches&&event.target.matches('#list .set input.num'))scheduleUpdate(0)},true);
    document.addEventListener('click',event=>{
      if(event.target&&event.target.closest&&event.target.closest('.padOk,.padCancel,.padLast,.padGrid,#days')){
        scheduleUpdate(40);setTimeout(updateAll,180);setTimeout(updateAll,360)
      }
    },true)
  }
  function observeList(){
    const list=document.getElementById('list');
    if(!list||list.dataset.kggCardProgressObserved==='1'||typeof MutationObserver==='undefined')return;
    list.dataset.kggCardProgressObserved='1';
    const observer=new MutationObserver(()=>scheduleUpdate(0));
    observer.observe(list,{childList:true,subtree:true})
  }
  function patchRender(){
    if(window.__kggCardProgressRenderPatched||typeof render!=='function')return;
    window.__kggCardProgressRenderPatched=1;
    const old=render;
    window.render=function(){const result=old.apply(this,arguments);scheduleUpdate(0);setTimeout(updateAll,120);return result}
  }
  function readTicketMeta(){
    try{
      const raw=typeof mk==='function'?localStorage.getItem(mk()):null;
      const value=JSON.parse(raw||'{}');
      return value&&typeof value==='object'&&!Array.isArray(value)?value:{}
    }catch(e){return{}}
  }
  function writeTicketMeta(value){
    if(typeof mk!=='function')return;
    localStorage.setItem(mk(),JSON.stringify(value))
  }
  function ticketCounters(meta){
    const counters=meta&&meta.ticket034&&meta.ticket034.counters;
    return counters&&typeof counters==='object'&&!Array.isArray(counters)?Object.assign({},counters):{}
  }
  function ticketSummaries(){
    const api=window.KGGPatientProgress;
    if(api&&typeof api.summariesForCards==='function')return api.summariesForCards(document);
    return [...document.querySelectorAll('#list .ex')].map((card,index)=>{
      const inputs=[...card.querySelectorAll('.set input.num')];
      const filled=inputs.filter(input=>String(input&&input.value!=null?input.value:'').trim()!=='').length;
      return{index,filled,total:inputs.length,worked:filled>0,state:stateForCount(filled,inputs.length)}
    })
  }
  function ticketWarnings(summaries,counters){
    return summaries.filter(summary=>{
      const current=Number(counters[String(summary.index)]);
      return !summary.worked&&(!Number.isInteger(current)||current<2)
    })
  }
  function ticketConfirm(summaries,counters){
    const warnings=ticketWarnings(summaries,counters);
    if(!warnings.length)return true;
    const names=warnings.map(summary=>{
      const exercise=p&&Array.isArray(p.ex)?p.ex[summary.index]:null;
      return exercise&&exercise.n?exercise.n:((localStorage.getItem('kggPatientLang')==='en'?'Exercise ':'Übung ')+(summary.index+1))
    }).join(', ');
    const en=localStorage.getItem('kggPatientLang')==='en';
    return typeof window.confirm!=='function'||window.confirm(en?`Unworked exercises: ${names}. Finish training and show QR anyway?`:`Nicht bearbeitete Übungen: ${names}. Training trotzdem beenden und QR anzeigen?`)
  }
  function nextTicketMeta(meta,summaries){
    const counters=ticketCounters(meta);
    summaries.forEach(summary=>{
      const key=String(summary.index),previous=Number(counters[key]);
      const current=Number.isInteger(previous)&&previous>=0?previous:0;
      counters[key]=summary.worked?0:Math.min(2,current+1)
    });
    return Object.assign({},meta,{ticket034:{version:1,counters}})
  }
  function patchSave(){
    if(window.__kggTicket034SavePatched||typeof window.save!=='function')return;
    const originalSave=window.save;
    window.save=function(){
      const meta=readTicketMeta(),ticketMeta=meta.ticket034;
      const result=originalSave.apply(this,arguments);
      if(ticketMeta!==undefined){
        const next=readTicketMeta();next.ticket034=ticketMeta;writeTicketMeta(next)
      }
      return result
    };
    window.__kggTicket034SavePatched=true
  }
  function patchShowQr(){
    if(window.__kggTicket034ShowQrPatched||typeof window.showQr!=='function')return;
    const originalShowQr=window.showQr;
    window.showQr=function(finalize){
      const isFinal=!!finalize,qrDay=Number(d)||1,alreadyDone=Array.isArray(done)&&done.includes(qrDay);
      if(isFinal&&Number(window.__kggTicket034FinalizeLockUntil||0)>Date.now())return;
      const summaries=isFinal&&!alreadyDone?ticketSummaries():[];
      const before=readTicketMeta(),counters=ticketCounters(before);
      if(isFinal&&!alreadyDone&&!ticketConfirm(summaries,counters))return;
      const result=originalShowQr.apply(this,arguments);
      if(isFinal&&!alreadyDone){
        const after=nextTicketMeta(before,summaries);
        writeTicketMeta(after);
        if(typeof window.save==='function')window.save()
      }
      if(isFinal)window.__kggTicket034FinalizeLockUntil=Date.now()+800;
      return result
    };
    window.__kggTicket034ShowQrPatched=true
  }
  function patchTicket034(){
    window.KGGPatientProgress={completionSummary,summariesForCards,stateForCount,filledCount,normalValueInputs};
    patchSave();patchShowQr()
  }
  function init(){
    patchTicket034();ensureStyle();bindEvents();observeList();patchRender();updateAll();
    setTimeout(()=>{observeList();patchRender();updateAll()},300);
    setTimeout(()=>{observeList();patchRender();updateAll()},1000)
  }
  if(window.__KGG_TEST__)window.__kggCardProgressTest={stateForCount,labelForState,filledCount,normalValueInputs,completionSummary,summariesForCards};
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init()
})();
