# coding: utf-8
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.links=[]; self.labels=[]; self.fields=[]; self.h1=0
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if tag=='h1': self.h1+=1
        if tag in ('a','link','script','img'):
            value=a.get('href') or a.get('src')
            if value: self.links.append(value)
        if tag=='label' and 'for' in a: self.labels.append(a['for'])

root=Path(__file__).resolve().parent.parent
files=[root/'index.html',root/'guide.html',root/'record.html',root/'logs.html',root/'calendar.html',root/'settings.html',*sorted((root/'categories').glob('*.html')),*sorted((root/'materials').glob('*.html'))]
for file in files:
    parser=Page(); parser.feed(file.read_text())
    assert parser.h1==1, (file,'h1')
    assert len(parser.ids)==len(set(parser.ids)), (file,'duplicate IDs')
    assert all(label in parser.ids for label in parser.labels),(file,'broken labels')
    for value in parser.links:
        parts=urlsplit(value)
        if parts.scheme or parts.netloc: continue
        path=(file.parent/unquote(parts.path)).resolve() if parts.path else file
        assert path.exists(),(file,value)
        if parts.fragment and path.suffix=='.html':
            target=Page(); target.feed(path.read_text())
            assert unquote(parts.fragment) in target.ids,(file,value)
    print('PASS',file.relative_to(root))
print(str(len(files))+' pages: local links, anchors, headings, IDs and labels passed')
