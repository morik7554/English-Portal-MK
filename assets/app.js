/* One page, one task. Studying never requires a journal entry. */
(function () {
  'use strict';
  const $=id=>document.getElementById(id);
  const page=document.body.dataset.page;
  const escNode=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  function storage(name){try{return window[name];}catch(_){return {getItem(){throw Error('blocked');},setItem(){throw Error('blocked');},removeItem(){throw Error('blocked');}};}}
  let journal;
  function getJournal(){if(!journal)journal=new LearningJournal.Journal({local:storage('localStorage'),session:storage('sessionStorage'),materials:portalMaterials});return journal;}
  function message(text){if($('pageStatus'))$('pageStatus').textContent=text;}
  function dateLabel(date){const [y,m,d]=date.split('-');return y+'年'+Number(m)+'月'+Number(d)+'日';}
  function durationLabel(minutes){if(minutes == null)return '時間未入力';const hours=Math.floor(minutes/60),rest=minutes%60;return hours?hours+'時間'+(rest?rest+'分':''):rest+'分';}
  function today(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
  function updateMode(){if(!$('saveMode'))return;const persistent=getJournal().snapshot().persist;$('saveMode').textContent=persistent?'この端末に記録を残す設定です。共有端末では保存を解除してください。':'この回だけの記録です。次回も残したいときは「記録の設定」へ。';}
  document.querySelectorAll('.open-material').forEach(link=>link.addEventListener('click',()=>getJournal().remember(link.dataset.material)));
  if(page==='material'){
    const from=new URLSearchParams(location.search).get('from');
    const material=portalMaterials.find(m=>m.id===document.body.dataset.material);
    const category=portalCategories.find(c=>c.id===from && material.categories.includes(c.id));
    if(category){$('materialBack').href='../categories/'+category.id+'.html';$('materialBack').textContent='← '+category.title+'に戻る';}
  }
  if(!['record','logs','calendar','settings'].includes(page))return;
  getJournal();
  if(journal.error)message(journal.error);
  updateMode();
  window.addEventListener('pageshow',()=>{journal.load();updateMode();if(page==='logs')renderLogs();if(page==='calendar')renderCalendar();if(page==='settings')$('persistRecords').checked=journal.snapshot().persist;});
  window.addEventListener('storage',event=>{
    if(![LearningJournal.keys.LOCAL,LearningJournal.keys.OLD_LOCAL,null].includes(event.key))return;
    journal.load();updateMode();
    if(page==='logs')renderLogs();
    if(page==='calendar')renderCalendar();
    if(page==='settings')$('persistRecords').checked=journal.snapshot().persist;
    if(page==='record')message('別のタブで記録や保存設定が変更されました。入力内容はそのままです。');
  });
  const ratingLabels=['あまり満足できなかった','もう少し取り組みたかった','まあまあ満足できた','よく取り組めた','とても満足できた'];
  if(page==='record'){
    const form=$('recordForm');form.hidden=false;
    let busy=false;
    const editId=new URLSearchParams(location.search).get('edit');
    $('studyDate').value=today();$('studyDate').max=today();
    const app=journal.lastApp();if(portalMaterials.some(m=>m.id===app))$('studyApp').value=app;
    function otherField(){const other=$('studyApp').value==='other';$('otherAppField').hidden=!other;$('otherApp').required=other;}
    $('studyApp').addEventListener('change',otherField);
    function ratingDescription(){const selected=form.querySelector('input[name="rating"]:checked');$('ratingDescription').textContent=selected?selected.value+'：'+ratingLabels[Number(selected.value)-1]+'。理解度やテストの点数ではありません。':'1〜5から一つえらぼう。テストの点数や理解度ではありません。';}
    form.querySelectorAll('input[name="rating"]').forEach(input=>input.addEventListener('change',ratingDescription));
    if(editId){
      const r=journal.snapshot().records.find(r=>r.id===editId);
      if(!r){form.hidden=true;message('修正する記録が見つかりません。振り返りログから開き直してください。');const link=escNode('a','back-link','振り返りログへ →');link.href='logs.html';$('pageStatus').after(link);return;}
      $('recordTitle').textContent='記録を修正する';$('saveRecord').textContent='変更を保存する';
      if(![...$('studyApp').options].some(o=>o.value===r.materialId)){const o=escNode('option','',r.materialName);o.value=r.materialId;$('studyApp').append(o);}
      $('studyDate').value=r.date;$('studyApp').value=r.materialId;$('otherApp').value=r.materialId==='other'?r.materialName:'';
      if(r.durationMinutes != null){$('studyHours').value=String(Math.floor(r.durationMinutes/60));$('studyMinutes').value=String(r.durationMinutes%60);}
      $('activity').value=r.activity;$('comment').value=r.comment;form.querySelector('input[name="rating"][value="'+r.rating+'"]').checked=true;ratingDescription();
    }
    otherField();
    form.addEventListener('submit',event=>{
      event.preventDefault();if(busy||!form.reportValidity())return;busy=true;$('saveRecord').disabled=true;$('formError').textContent='';
      const data=new FormData(form);
      try{
        const r=journal.upsert({date:data.get('date'),materialId:data.get('materialId'),materialName:data.get('materialName'),activity:data.get('activity'),rating:data.get('rating'),comment:data.get('comment'),durationMinutes:data.get('studyHours')==='' && data.get('studyMinutes')===''?null:Number(data.get('studyHours'))*60+Number(data.get('studyMinutes'))},editId);
        form.hidden=true;$('recordDone').hidden=false;
        $('recordDone').querySelector('h2').textContent=editId?'変更を保存しました':'記録しました';
        $('savedSummary').textContent=dateLabel(r.date)+' / '+r.materialName+' / '+durationLabel(r.durationMinutes)+' / 自己評価 '+r.rating+' / 5';
        $('savedMode').textContent=journal.snapshot().persist?'この端末に記録を残しました。':'この回の記録に残しました。次回も残す場合は、記録の設定で端末への保存を選んでください。';
        $('recordDone').focus();message('');
      }catch(e){$('formError').textContent=e.message;busy=false;$('saveRecord').disabled=false;}
    });
  }
  let shown=20;
  let selectedPeriod='week';
  function populateAppFilter(){
    const select=$('filterApp'),value=select.value;const labels=new Map(portalMaterials.map(m=>[m.id,m.name]));
    journal.snapshot().records.forEach(r=>{if(!labels.has(r.materialId))labels.set(r.materialId,r.materialName);});labels.set('other','その他');
    select.replaceChildren(new Option('すべて',''));labels.forEach((name,id)=>select.append(new Option(name,id)));if(labels.has(value))select.value=value;
  }
  function renderLegacy(){
    const legacy=journal.snapshot().legacy;const area=$('legacyList');area.replaceChildren();$('legacySection').hidden=!legacy.length;
    legacy.forEach(r=>{const article=escNode('article');article.append(escNode('h3','',r.materialName));
      [['日付',LearningJournal.validDate(r.date)?dateLabel(r.date):'日付不明'],['目標',r.goal],['結果',r.result],['メモ',r.note],['次にすること',r.nextAction]].forEach(([key,val])=>{if(val)article.append(escNode('p','',key+'：'+val));});area.append(article);});
  }
  function renderStats(rows,from,to,invalid){
    const stats=JournalStats.summarize(rows,from,to);
    const label=(JournalStats.periods.find(p=>p.id===selectedPeriod)||{label:'指定期間'}).label;
    $('periodButtons').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.period===selectedPeriod)));
    $('periodRange').textContent=invalid?'日付の条件を確認してください':label+'：'+dateLabel(from)+'〜'+dateLabel(to)+($('filterApp').value?'（アプリで絞り込み中）':'');
    const summary=$('statsSummary');summary.replaceChildren();
    [['記録した日数',stats.days+'日','同じ日の複数記録は1日として数えます'],['勉強時間',stats.timed?durationLabel(stats.minutes):'—',stats.unknown?'時間未入力 '+stats.unknown+'件':'入力した時間の合計'],['記録件数',stats.count+'件','この期間に残した取り組み']].forEach(([title,value,note])=>{
      const card=escNode('div','stat-card');card.append(escNode('h3','',title),escNode('p','stat-value',value),escNode('p','stat-note',note));summary.append(card);
    });
    const data=JournalStats.buckets(stats.rows,from,to,selectedPeriod);
    $('chartUnit').textContent=data.unit;$('chartTitle').textContent='勉強時間の積み重ね';
    const chart=$('timeChart');chart.replaceChildren();
    if(!stats.count){chart.append(escNode('p','chart-empty',invalid?'日付の条件を確認するとグラフを表示できます。':'この期間の記録を残すと、ここにグラフが表示されます。'));}
    else{
      const highest=Math.max(0,...data.items.map(b=>b.minutes));
      const max=Math.max(1,highest);
      chart.append(escNode('p','chart-scale',highest?'グラフの上端：'+durationLabel(highest):stats.timed?'記録した勉強時間は0分です。':'この期間は時間未入力の記録だけです。'));
      const frame=escNode('div','chart-frame');frame.tabIndex=0;frame.setAttribute('role','region');frame.setAttribute('aria-label',data.unit+'の勉強時間グラフ。必要に応じて横にスクロールできます。数値一覧も下にあります。');
      const bars=escNode('div','chart-bars');bars.style.setProperty('--bar-count',data.items.length);bars.style.minWidth=(data.items.length*25)+'px';
      const tableDetails=escNode('details','chart-data');tableDetails.append(escNode('summary','','グラフの数値を見る'));
      const table=escNode('table');const caption=escNode('caption','sr-only','期間ごとの記録と勉強時間');table.append(caption);
      const thead=escNode('thead'),headRow=escNode('tr');['期間','勉強時間','記録件数','時間未入力'].forEach(t=>{const th=escNode('th','',t);th.scope='col';headRow.append(th);});thead.append(headRow);table.append(thead);const tbody=escNode('tbody');
      data.items.forEach(b=>{
        const parts=b.key.split('-');const short=parts.length===3?Number(parts[2])+'日':parts.length===2?Number(parts[1])+'月':parts[0]+'年';
        const full=parts.length===3?dateLabel(b.key):parts.length===2?parts[0]+'年'+Number(parts[1])+'月':parts[0]+'年';
        const column=escNode('div','chart-column');const track=escNode('div','chart-track');const bar=escNode('span','chart-bar'+(!b.timed?' no-time':''));bar.style.height=b.timed?Math.max(2,b.minutes/max*100)+'%':'2px';track.append(bar);
        column.title=full+'：'+(b.timed?durationLabel(b.minutes):'時間未入力または記録なし')+' / '+b.count+'件';
        column.append(track,escNode('span','chart-label',short),escNode('span','chart-year',parts.length===2&&(parts[1]==='01'||data.items[0]===b)?parts[0]:''));bars.append(column);
        const row=escNode('tr'),th=escNode('th','',full);th.scope='row';row.append(th,escNode('td','',b.timed?durationLabel(b.minutes):'—'),escNode('td','',b.count+'件'),escNode('td','',b.unknown+'件'));tbody.append(row);
      });
      frame.append(bars);chart.append(frame,escNode('p','help','青：入力した勉強時間。灰色：時間未入力または記録なし。長いグラフは横に動かせます。'));table.append(tbody);tableDetails.append(table);chart.append(tableDetails);
    }
    const apps=$('appBreakdown');apps.replaceChildren();
    if(!stats.apps.length)apps.append(escNode('p','help','この期間の記録はありません。'));
    else{
      const max=Math.max(1,...stats.apps.map(a=>a.minutes));
      stats.apps.forEach(a=>{const row=escNode('div','app-stat');const header=escNode('div','app-stat-heading');header.append(escNode('h3','',a.name),escNode('span','',a.count+'件 / '+(a.timed?durationLabel(a.minutes):'時間未入力')));const track=escNode('div','app-stat-track'),bar=escNode('span');bar.style.width=(a.minutes/max*100)+'%';track.append(bar);row.append(header,track);if(a.unknown)row.append(escNode('p','help','うち時間未入力 '+a.unknown+'件'));apps.append(row);});
    }
  }

  function renderLogs(){
    if(!$('logList'))return;
    populateAppFilter();const allRecords=journal.snapshot().records;
    const bounds=JournalStats.range(selectedPeriod==='custom'?'all':selectedPeriod,today(),allRecords);
    let from=$('filterFrom').value||bounds.from,to=$('filterTo').value||bounds.to;const app=$('filterApp').value;
    if(selectedPeriod==='custom'&&!$('filterFrom').value&&from>to)from=to;
    if(selectedPeriod==='custom'&&!$('filterTo').value&&to<from)to=from;
    const invalid=from&&to&&from>to;$('filterError').textContent=invalid?'開始日は終了日より前にしてください。':'';
    const rows=invalid?[]:journal.list({from,to,app});const filtered=selectedPeriod!=='all'||Boolean(app)||Boolean($('filterFrom').value||$('filterTo').value);
    renderStats(rows,from,to,invalid);
    const calendarURL=new URL('calendar.html',location.href);calendarURL.searchParams.set('month',to.slice(0,7));calendarURL.searchParams.set('back',location.search);$('calendarLink').href=calendarURL.pathname+calendarURL.search;
    $('logCount').textContent=invalid?'日付の条件を確認してください':rows.length+'件'+(filtered?'（絞り込み中）':'の記録');
    const area=$('logList');area.replaceChildren();
    if(!rows.length&&!invalid){const empty=escNode('section','panel empty-state');empty.append(escNode('h2','',journal.snapshot().records.length?'この期間・条件に合う記録はありません':'まだ記録はありません'));
      if(journal.snapshot().records.length){const reset=escNode('button','button secondary','すべての記録を見る');reset.type='button';reset.addEventListener('click',()=>{selectedPeriod='all';$('filterFrom').value='';$('filterTo').value='';$('filterApp').value='';shown=20;updateFilterURL();renderLogs();});empty.append(reset);}
      else{const link=escNode('a','button primary','学習を記録する →');link.href='record.html';empty.append(link);}area.append(empty);}
    rows.slice(0,shown).forEach(r=>{
      const card=escNode('article','log-card');const header=escNode('div','log-card-header'),label=escNode('div');const time=escNode('time','',dateLabel(r.date));time.dateTime=r.date;
      label.append(time,escNode('h2','',r.materialName));const rating=escNode('div','log-rating',r.rating+' / 5');rating.append(escNode('small','','取り組みの自己評価'));header.append(label,rating);card.append(header);
      card.append(escNode('p','study-duration','勉強時間：'+durationLabel(r.durationMinutes)));
      if(r.activity)card.append(escNode('p','activity',r.activity));
      if(r.comment){if(r.comment.length>160||r.comment.split('\n').length>4){const details=escNode('details');details.append(escNode('summary','','感想・頑張ったことを読む'),escNode('p','comment',r.comment));card.append(details);}else card.append(escNode('p','comment',r.comment));}
      const actions=escNode('div','log-actions'),edit=escNode('a','','修正');edit.href='record.html?edit='+encodeURIComponent(r.id);edit.setAttribute('aria-label',dateLabel(r.date)+' '+r.materialName+'の記録を修正');
      const remove=escNode('button','text-button','削除');remove.type='button';remove.setAttribute('aria-label',dateLabel(r.date)+' '+r.materialName+'の記録を削除');
      remove.addEventListener('click',()=>{pendingDelete=r.id;$('deleteTarget').textContent=dateLabel(r.date)+' / '+r.materialName+' / 自己評価 '+r.rating+' / 5';$('deleteDialog').showModal();});
      actions.append(edit,remove);card.append(actions);area.append(card);
    });
    $('loadMore').hidden=rows.length<=shown;renderLegacy();updateMode();
  }
  function resetFilters(){selectedPeriod='week';$('filterFrom').value='';$('filterTo').value='';$('filterApp').value='';shown=20;updateFilterURL();renderLogs();}
  function updateFilterURL(){const url=new URL(location.href);url.searchParams.set('period',selectedPeriod);['from','to','app'].forEach(key=>{const v=$({from:'filterFrom',to:'filterTo',app:'filterApp'}[key]).value;if(v)url.searchParams.set(key,v);else url.searchParams.delete(key);});history.replaceState(null,'',url);}
  let pendingDelete=null;
  if(page==='logs'){
    $('journalUI').hidden=false;populateAppFilter();const params=new URLSearchParams(location.search);
    selectedPeriod=JournalStats.periods.some(p=>p.id===params.get('period'))?params.get('period'):'week';
    for(const [key,id] of [['from','filterFrom'],['to','filterTo'],['app','filterApp']]){if(params.has(key))$(id).value=params.get(key);}
    if($('filterFrom').value||$('filterTo').value)selectedPeriod='custom';
    if(selectedPeriod==='custom')document.querySelector('.extra-filters').open=true;
    JournalStats.periods.forEach(p=>{const button=escNode('button','',p.label);button.type='button';button.dataset.period=p.id;button.setAttribute('aria-pressed',String(p.id===selectedPeriod));button.addEventListener('click',()=>{selectedPeriod=p.id;$('filterFrom').value='';$('filterTo').value='';shown=20;updateFilterURL();renderLogs();});$('periodButtons').append(button);});
    $('filterForm').addEventListener('submit',e=>{e.preventDefault();if($('filterFrom').value||$('filterTo').value)selectedPeriod='custom';shown=20;updateFilterURL();renderLogs();});
    $('filterForm').addEventListener('change',event=>{if(event.target.name==='from'||event.target.name==='to')selectedPeriod=$('filterFrom').value||$('filterTo').value?'custom':'week';shown=20;updateFilterURL();renderLogs();});
    $('filterForm').addEventListener('reset',e=>{e.preventDefault();resetFilters();});
    $('loadMore').addEventListener('click',()=>{shown+=20;renderLogs();});
    $('cancelDelete').addEventListener('click',()=>$('deleteDialog').close());
    $('confirmDelete').addEventListener('click',()=>{try{journal.remove(pendingDelete);$('deleteDialog').close();renderLogs();message('記録を削除しました。');}catch(e){$('deleteDialog').close();message(e.message);}});
    renderLogs();
  }
  let calendarMonth=today().slice(0,7);
  function renderCalendar(){
    if(!$('calendarGrid'))return;
    const result=JournalStats.calendarMonth(journal.snapshot().records,calendarMonth);
    const [year,month]=calendarMonth.split('-');$('calendarMonthTitle').textContent=year+'年'+Number(month)+'月';
    $('calendarPrev').disabled=calendarMonth==='0001-01';$('calendarNext').disabled=calendarMonth==='9999-12';
    const summary=result.summary;
    $('calendarSummary').textContent='記録した日：'+summary.days+'日 / 勉強時間：'+(summary.timed?durationLabel(summary.minutes):summary.count?'時間未入力':'—')+' / '+summary.count+'件'+(summary.unknown?'（時間未入力 '+summary.unknown+'件）':'');
    const table=escNode('table','stamp-calendar'),caption=escNode('caption','sr-only',year+'年'+Number(month)+'月の記録。月曜から日曜の順です。');table.append(caption);
    const head=escNode('thead'),heading=escNode('tr');['月','火','水','木','金','土','日'].forEach((day,index)=>{const th=escNode('th',index>4?'weekend':'',day);th.scope='col';th.setAttribute('aria-label',day+'曜日');heading.append(th);});head.append(heading);table.append(head);
    const body=escNode('tbody');let tr;
    result.cells.forEach((d,index)=>{
      if(index%7===0){tr=escNode('tr');body.append(tr);}const td=escNode('td');tr.append(td);
      if(!d){td.className='outside-month';td.setAttribute('aria-label','この月の外');return;}
      const entry=escNode(d.count?'a':'div','calendar-day'+(d.count?' has-record':'')+(d.date===today()?' is-today':''));
      const number=escNode('span','calendar-day-number',String(Number(d.date.slice(-2))));if(d.date===today())number.setAttribute('aria-current','date');entry.append(number);
      if(d.count){
        const params=new URLSearchParams({period:'custom',from:d.date,to:d.date});entry.href='logs.html?'+params;
        entry.setAttribute('aria-label',dateLabel(d.date)+'、'+d.count+'件の記録、'+(d.timed?'合計'+durationLabel(d.minutes):'時間未入力')+(d.timed&&d.unknown?'、時間未入力 '+d.unknown+'件':'')+'。この日のログを見る');
        const stamp=escNode('span','calendar-stamp','✓');stamp.setAttribute('aria-hidden','true');entry.append(stamp);
        const time=escNode('span','stamp-time');time.setAttribute('aria-hidden','true');
        if(d.timed){const hours=Math.floor(d.minutes/60),minutes=d.minutes%60;if(hours)time.append(escNode('span','',hours+'時間'));if(minutes||!hours)time.append(escNode('span','',minutes+'分'));if(d.unknown)time.append(escNode('span','time-asterisk','＊'));}
        else time.textContent='未入力';entry.append(time);
      }else{entry.title=dateLabel(d.date)+'：記録なし';entry.append(escNode('span','calendar-no-record','—'));}
      td.append(entry);
    });
    table.append(body);$('calendarGrid').replaceChildren(table);updateMode();
  }
  function updateCalendarURL(){const url=new URL(location.href);url.searchParams.set('month',calendarMonth);history.replaceState(null,'',url);}
  if(page==='calendar'){
    const params=new URLSearchParams(location.search);if(JournalStats.validMonth(params.get('month')))calendarMonth=params.get('month');
    const back=new URLSearchParams(params.get('back')||'');const safe=new URLSearchParams();
    const period=back.get('period');if(period==='custom'||JournalStats.periods.some(p=>p.id===period))safe.set('period',period);
    for(const key of ['from','to'])if(LearningJournal.validDate(back.get(key)))safe.set(key,back.get(key));
    if(back.get('app')==='other'||portalMaterials.some(m=>m.id===back.get('app')))safe.set('app',back.get('app'));
    $('calendarLogBack').href='logs.html'+(safe.size?'?'+safe:'');$('calendarUI').hidden=false;
    $('calendarPrev').addEventListener('click',()=>{calendarMonth=JournalStats.shiftMonth(calendarMonth,-1);updateCalendarURL();renderCalendar();});
    $('calendarNext').addEventListener('click',()=>{calendarMonth=JournalStats.shiftMonth(calendarMonth,1);updateCalendarURL();renderCalendar();});
    $('calendarToday').addEventListener('click',()=>{calendarMonth=today().slice(0,7);updateCalendarURL();renderCalendar();});
    renderCalendar();
  }

  if(page==='settings'){
    $('settingsUI').hidden=false;$('clearAll').hidden=false;$('persistRecords').checked=journal.snapshot().persist;let action=null;
    const open=(kind,title,text)=>{action=kind;$('settingsDialogTitle').textContent=title;$('settingsDialogText').textContent=text;$('confirmSettings').textContent=kind==='clear'?'すべて消す':'この回だけにする';$('settingsDialog').showModal();};
    $('persistRecords').addEventListener('change',event=>{
      if(event.target.checked){try{journal.setPersistence(true);updateMode();message('この端末に記録を残す設定にしました。');}catch(e){event.target.checked=false;message(e.message);}}
      else{event.target.checked=true;open('disable','端末への保存を解除しますか？','端末に永続保存したログと以前の形式の記録を削除し、この回だけの記録へ切り替えます。このタブの記録は残ります。端末の保存記録の削除は取り消せません。');}
    });
    $('clearAll').addEventListener('click',()=>open('clear','記録をすべて消しますか？','このポータルの全ログと以前の記録を、この端末とこの回の保存領域から消します。取り消せません。外部教材の記録は消えません。'));
    $('cancelSettings').addEventListener('click',()=>$('settingsDialog').close());
    $('confirmSettings').addEventListener('click',()=>{try{if(action==='clear')journal.clearAll();else journal.setPersistence(false);$('persistRecords').checked=journal.snapshot().persist;updateMode();$('settingsDialog').close();message(action==='clear'?'このサイトの記録をすべて消しました。':'端末の保存記録を削除し、この回だけの記録に切り替えました。');}catch(e){$('settingsDialog').close();message(e.message);}});
  }
})();
