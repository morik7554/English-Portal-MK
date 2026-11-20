const fs = require('node:fs');
const vm = require('node:vm');
const config = JSON.parse(fs.readFileSync('seo.config.json','utf8'));
const origin = new URL(config.origin);
if (origin.protocol !== 'https:' || origin.origin !== config.origin || origin.username || origin.password) throw Error('origin must be an HTTPS origin without trailing slash or path');
const context=vm.createContext({});
vm.runInContext(fs.readFileSync('assets/categories.js','utf8')+';globalThis.categories=portalCategories;globalThis.items=portalMaterials;',context);
const escape = s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const descriptions={
  vocabulary: ['英単語の意味・つづりを練習','中学生向けの英単語教材を紹介。意味やつづり、不規則動詞を練習する教材の使い方と前提知識を確かめて選べます。小学生は先生と内容を確認して利用してください。'],
  grammar: ['中学英語の文法・基本文を学ぶ','中学英語の文法をスライドで確かめる教材や、基本文・不規則動詞の練習教材を紹介。説明を見る、問題で確かめるなど、目的に合わせた使い分けを案内します。'],
  'basic-sentences': ['中学英語の基本文・語順を練習','基本文や英文の語順を練習したい人向けの教材案内。取り組む範囲と使い方を先生と確かめ、例を見ずに文を作る練習と振り返りにつなげます。'],
  reading: ['中学英語の長文読解・読み方を練習','長文読解5STEPのレベル・テーマ選択と使い方を紹介。問いを手がかりに英文を読み、答えの根拠となる文を見つける練習と振り返りを案内します。'],
  listening: ['中学英語のリスニングを練習','Ear Builder Englishの使い方と利用条件を紹介。短い英文を文字を見ずに聞き、聞き取れないところを確かめ、速度を変えてもう一度聞く練習へ。'],
  prints: ['中学英語の文法プリント・紙での学習','中学英語の文法を紙やノートで練習する教材案内。4スライドプリントとGrammar Slideの特徴、範囲や印刷環境の確認、答えを見ずに確かめる学び方を紹介します。'],
  tests: ['中学英語の定期テスト対策・復習の進め方','定期テスト英語対策ページの教材案内。掲載範囲は特定の授業向けです。自分のテスト範囲を先生と確認し、文法・単語など必要な復習を選んでください。'],
  summer: ['長期休みの英語学習について','長期休み専用の教材は現在掲載していません。通常の教材から、先生と復習する範囲と学び方を決めて利用できます。']
};
const pages=[
  {file:'index.html',path:'/',title:'英語の学習ひろば｜小学生・中学生の英語学習ポータル',description:'小学生・中学生の英語学習ポータル。単語・文法と基本文・長文読解・リスニング・プリント・テスト対策から、使いたい教材へ進めます。振り返りと学習ログは任意で利用できます。',index:true},
  {file:'guide.html',path:'/guide.html',title:'使い方・学習記録について｜'+config.siteName,description:'英語の学習ひろばの使い方。分野から教材を開く方法、任意の1〜5の自己評価と振り返りログ、端末の保存設定、外部教材の利用時に確認することを案内します。',index:true},
  ...context.categories.map(c=>({file:'categories/'+c.id+'.html',path:'/categories/'+c.id+'.html',title:descriptions[c.id][0]+'｜'+config.siteName,description:descriptions[c.id][1],label:c.title,index:context.items.some(m=>m.categories.includes(c.id))})),
  ...fs.readdirSync('materials').filter(f=>f.endsWith('.html')).map(file=>{
    const m=context.items.find(m=>m.id===file.replace('.html',''));
    return {file:'materials/'+file,path:'/materials/'+file,title:m.name+'の使い方｜'+config.siteName,description:m.description+' '+m.prerequisite,label:m.title,index:true};
  }),
  ...[{id:'record',label:'学習を記録する',description:'アプリ・日付・勉強時間・1〜5の取り組みへの満足度と、任意の感想を残す補助ページです。'},
      {id:'logs',label:'振り返りログ',description:'このブラウザーに残した学習の記録を確認・修正・削除できます。'},
      {id:'calendar',label:'学習カレンダー',description:'月曜始まりのカレンダーで、記録した日のチェックスタンプと合計勉強時間を確認できます。'},
      {id:'settings',label:'記録の設定',description:'この端末への保存方法を選び、記録の全消去ができます。'}]
    .map(p=>({file:p.id+'.html',path:'/'+p.id+'.html',title:p.label+'｜'+config.siteName,description:p.description,label:p.label,index:false}))
];
for(const page of pages){
  const canonical=config.origin+page.path;
  const prefix=page.file.includes('/')?'../':'';
  const data=page.path==='/'?{'@context':'https://schema.org','@type':'WebSite','@id':config.origin+'/#website',url:canonical,name:config.siteName,alternateName:config.alternateName,inLanguage:'ja'}:
    {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'ホーム',item:config.origin+'/'},{'@type':'ListItem',position:2,name:page.label||'使い方',item:canonical}]};
  const verification=page.path==='/'&&config.googleSiteVerification?`\n<meta name="google-site-verification" content="${escape(config.googleSiteVerification)}">`:'';
  let source=fs.readFileSync(page.file,'utf8');
  // Preserve an existing verification token supplied independently of this script.
  const existingVerification=source.match(/<meta\s+name="google-site-verification"[^>]*>/i);
  const head=`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(page.title)}</title>
<meta name="description" content="${escape(page.description)}">
<meta name="robots" content="${page.index?'index,follow':'noindex,follow'}">
<link rel="canonical" href="${canonical}">
<meta property="og:site_name" content="${escape(config.siteName)}">
<meta property="og:title" content="${escape(page.title)}">
<meta property="og:description" content="${escape(page.description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="ja_JP">
<meta property="og:image" content="${config.origin}/assets/hero-learning-world.jpg">
<meta property="og:image:width" content="900">
<meta property="og:image:height" content="507">
<meta property="og:image:alt" content="英語の学習ひろば：ノートと英語学習のイラスト">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${prefix}assets/styles.css">${verification || (existingVerification?'\n'+existingVerification[0]:'')}
<script type="application/ld+json">${JSON.stringify(data).replace(/</g,'\\u003c')}</script>
</head>`;
  source=source.replace(/<head>[\s\S]*?<\/head>/,head);
  fs.writeFileSync(page.file,source);
}
const urls=pages.filter(p=>p.index).map(p=>'  <url><loc>'+escape(config.origin+p.path)+'</loc></url>').join('\n');
fs.writeFileSync('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls+'\n</urlset>\n');
fs.writeFileSync('robots.txt','User-agent: *\nAllow: /\n\nSitemap: '+config.origin+'/sitemap.xml\n');
console.log('SEO metadata: '+pages.length+' pages. Sitemap: '+pages.filter(p=>p.index).length+' URLs.');
