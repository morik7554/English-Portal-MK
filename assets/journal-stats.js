/* Calendar-only dates: no UTC/local-time conversion or fixed 24-hour assumptions. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.JournalStats=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const periods=[{id:'week',label:'今週'},{id:'month',label:'今月'},{id:'half',label:'半年'},{id:'year',label:'1年'},{id:'all',label:'すべて'}];
  const iso=d=>[d.getUTCFullYear(),String(d.getUTCMonth()+1).padStart(2,'0'),String(d.getUTCDate()).padStart(2,'0')].join('-');
  const date=s=>new Date(s+'T00:00:00Z');
  function addDays(s,n){const d=date(s);d.setUTCDate(d.getUTCDate()+n);return iso(d);}
  function monthsAgo(s,n){const d=date(s),day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()-n);const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,last));return iso(d);}
  function range(period,today,records=[]){
    if(period==='week'){const day=date(today).getUTCDay();return {from:addDays(today,-((day+6)%7)),to:today};}
    if(period==='month')return {from:today.slice(0,7)+'-01',to:today};
    if(period==='half'||period==='year')return {from:addDays(monthsAgo(today,period==='half'?6:12),1),to:today};
    if(period==='all'){const dates=[today,...records.map(r=>r.date)].sort();return {from:dates[0],to:dates[dates.length-1]};}
    throw Error('Unknown period');
  }
  function summarize(records,from,to,app=''){
    const rows=records.filter(r=>(!from||r.date>=from)&&(!to||r.date<=to)&&(!app||r.materialId===app));
    const timed=rows.filter(r=>Number.isInteger(r.durationMinutes)&&r.durationMinutes>=0);
    const apps=new Map();
    rows.forEach(r=>{let item=apps.get(r.materialId);if(!item){item={id:r.materialId,name:r.materialName,count:0,minutes:0,timed:0,unknown:0};apps.set(r.materialId,item);}item.count++;if(Number.isInteger(r.durationMinutes)&&r.durationMinutes>=0){item.minutes+=r.durationMinutes;item.timed++;}else item.unknown++;});
    return {rows,count:rows.length,days:new Set(rows.map(r=>r.date)).size,minutes:timed.reduce((n,r)=>n+r.durationMinutes,0),timed:timed.length,unknown:rows.length-timed.length,apps:[...apps.values()].sort((a,b)=>b.minutes-a.minutes||b.count-a.count||a.id.localeCompare(b.id))};
  }
  function buckets(records,from,to,period){
    if(!from||!to||from>to)return {unit:'日別',items:[]};
    const months=(date(to).getUTCFullYear()-date(from).getUTCFullYear())*12+date(to).getUTCMonth()-date(from).getUTCMonth()+1;
    const days=Math.round((date(to)-date(from))/86400000)+1;
    const unit=period==='half'||period==='year'?'month':(period==='all'||period==='custom')?(months>24?'year':days>31?'month':'day'):'day';
    const key=s=>s.slice(0,unit==='year'?4:unit==='month'?7:10);
    const map=new Map();let cursor=unit==='year'?from.slice(0,4)+'-01-01':unit==='month'?from.slice(0,7)+'-01':from;
    while(key(cursor)<=key(to)){
      const k=key(cursor);map.set(k,{key:k,count:0,minutes:0,timed:0,unknown:0});
      const d=date(cursor);if(unit==='year')d.setUTCFullYear(d.getUTCFullYear()+1);else if(unit==='month')d.setUTCMonth(d.getUTCMonth()+1);else d.setUTCDate(d.getUTCDate()+1);cursor=iso(d);
    }
    records.filter(r=>r.date>=from&&r.date<=to).forEach(r=>{const b=map.get(key(r.date));if(!b)return;b.count++;if(Number.isInteger(r.durationMinutes)&&r.durationMinutes>=0){b.minutes+=r.durationMinutes;b.timed++;}else b.unknown++;});
    return {unit:{day:'日別',month:'月別',year:'年別'}[unit],items:[...map.values()]};
  }
  function validMonth(month){return typeof month==='string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(month) && Number(month.slice(0,4))>=1;}
  function shiftMonth(month,offset){
    if(!validMonth(month))throw Error('Invalid month');
    const d=date(month+'-01');d.setUTCMonth(d.getUTCMonth()+offset);
    if(d.getUTCFullYear()<1||d.getUTCFullYear()>9999)throw Error('Month outside supported range');
    return iso(d).slice(0,7);
  }
  function calendarMonth(records,month){
    if(!validMonth(month))throw Error('Invalid month');
    const first=month+'-01',next=month==='9999-12'?null:shiftMonth(month,1);
    const last=next?addDays(next+'-01',-1):'9999-12-31';
    const offset=(date(first).getUTCDay()+6)%7;
    const days=Number(last.slice(-2));const size=Math.ceil((offset+days)/7)*7;
    const daily=new Map();
    records.filter(r=>r.date>=first&&r.date<=last).forEach(r=>{
      let d=daily.get(r.date);if(!d){d={date:r.date,count:0,minutes:0,timed:0,unknown:0};daily.set(r.date,d);}
      d.count++;if(Number.isInteger(r.durationMinutes)&&r.durationMinutes>=0){d.minutes+=r.durationMinutes;d.timed++;}else d.unknown++;
    });
    return {month,from:first,to:last,cells:Array.from({length:size},(_,i)=>{
      const day=i-offset+1;if(day<1||day>days)return null;
      const key=month+'-'+String(day).padStart(2,'0');
      return daily.get(key)||{date:key,count:0,minutes:0,timed:0,unknown:0};
    }),summary:summarize(records,first,last)};
  }
  return {periods,range,summarize,buckets,addDays,monthsAgo,validMonth,shiftMonth,calendarMonth};
});
