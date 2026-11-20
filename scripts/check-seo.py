# coding: utf-8
from html.parser import HTMLParser
from pathlib import Path
import json
import xml.etree.ElementTree as ET

root=Path(__file__).resolve().parent.parent
config=json.loads((root/'seo.config.json').read_text())
origin=config['origin']
class Head(HTMLParser):
    def __init__(self):
        super().__init__(); self.title=''; self.in_title=False; self.metas={}; self.canonical=[]; self.schema=[]; self.in_json=False; self.payload=''
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='title': self.in_title=True
        if tag=='meta':
            key=a.get('name') or a.get('property')
            if key: self.metas.setdefault(key,[]).append(a.get('content',''))
        if tag=='link' and a.get('rel')=='canonical': self.canonical.append(a['href'])
        if tag=='script' and a.get('type')=='application/ld+json': self.in_json=True; self.payload=''
    def handle_endtag(self,tag):
        if tag=='title': self.in_title=False
        if tag=='script' and self.in_json:
            self.schema.append(json.loads(self.payload)); self.in_json=False
    def handle_data(self,data):
        if self.in_title: self.title+=data
        if self.in_json: self.payload+=data

ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls=[e.text for e in ET.parse(root/'sitemap.xml').findall('s:url/s:loc',ns)]
assert len(urls)==len(set(urls))
assert origin+'/' in urls and origin+'/index.html' not in urls
seen_titles=set();seen_descriptions=set();indexable=[]
for file in [root/'index.html',root/'guide.html',root/'record.html',root/'logs.html',root/'calendar.html',root/'settings.html',*sorted((root/'categories').glob('*.html')),*sorted((root/'materials').glob('*.html'))]:
    source=file.read_text();head=Head();head.feed(source)
    path='/' if file.name=='index.html' else '/'+str(file.relative_to(root))
    canonical=origin+path
    assert head.canonical==[canonical],file
    assert head.title and head.title not in seen_titles,file
    assert len(head.metas['description'])==1 and head.metas['description'][0] not in seen_descriptions,file
    assert head.metas['og:url']==[canonical],file
    assert head.metas['og:image']==[origin+'/assets/hero-learning-world.jpg'],file
    assert len(head.schema)==1,file
    seen_titles.add(head.title);seen_descriptions.add(head.metas['description'][0])
    if head.metas['robots']==['index,follow']: indexable.append(canonical)
    else: assert head.metas['robots']==['noindex,follow'] and file.name in ['summer.html','record.html','logs.html','calendar.html','settings.html'],file
    if file.parent.name=='categories' and file.name!='summer.html':
        assert 'purpose-tile' in source or 'open-material' in source,file
        if file.name!='basic-sentences.html':
            homepage=(root/'index.html').read_text()
            assert 'href="categories/'+file.name+'"' in homepage,file
    print('PASS',file.relative_to(root))
assert set(urls)==set(indexable)
assert 'Sitemap: '+origin+'/sitemap.xml' in (root/'robots.txt').read_text()
assert 'Disallow: /\n' not in (root/'robots.txt').read_text()
print('SEO: unique metadata, canonical URLs, JSON-LD, internal links and '+str(len(urls))+' sitemap URLs passed')
