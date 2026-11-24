import sys, json
sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
import importlib, content; importlib.reload(content)
from content import *
for n in NEWS: n['upcoming']=bool(n.get('upcoming')); n.setdefault('photo','')
for a in ACTIVITIES: a.setdefault('photo','')
NEWS[0]['body']=['마포자원순환네트워크는 #BFFP와 함께 2026년 6월 슈퍼마켓 감사를 진행했습니다. 이 감사는 다정한 재단 ‘다정한 기금’의 지원으로 진행했습니다.','[감사 대상과 방법, 주요 결과 요약을 넣어 주세요]','기자회견에서는 감사 결과와 함께 [정책 요구]를 발표합니다. 언론과 시민 여러분의 관심을 부탁드립니다.']
NEWS[0]['info']=[['일시','[날짜·시간 확정 후 입력]'],['장소','[장소 확정 후 입력]'],['주최','마포자원순환네트워크 · #BFFP'],['지원','다정한 재단 ‘다정한 기금’'],['문의','mapozerowaste@gmail.com']]
ids = {'statements':['court-statement','gaia-bffp-letter','statement-251114','comment-250910'],
       'docs':['assembly-forum-book','launch-declaration','launch-forum-book','ppf30-forum-book','zw-city-guide'],
       'press':['energydaily-260130','bffp-251114','slownews-250710','hankooki-250630','energydaily-250625']}
lists = {'statements':STATEMENTS,'docs':DOCS,'press':PRESS}
for k,L in lists.items():
    for x,i in zip(L, ids[k]):
        x['id']=i; x.setdefault('summary',''); x.setdefault('body',None); x.setdefault('photo',''); x.setdefault('file','')
        if x['href']=='#': x['href']=''
PRESS[0]['summary']='국회 토론회 ‘제로웨이스트로 가는 길: 예산으로 보는 자원순환정책’을 다룬 기사입니다.'
D=dict(news=NEWS,activities=ACTIVITIES,statements=STATEMENTS,docs=DOCS,press=PRESS,history=[dict(date=d,text=t) for d,t in HISTORY],orgs=ORGS,persons=PERSONS,partners=PARTNERS,logos=LOGOS,
       guide={'about':'record.html#zw-city-guide','download':'','cover':'assets/guide-cover.png'},
       gated={'zw-city-guide': {
         'image':'assets/guide-promo.jpg',
         'lead':'제로 웨이스트 유럽의 마스터플랜 공식 한국어판',
         'body':['마포자원순환네트워크와 서울환경연합은 유럽 도시들의 제로웨이스트 도시 전환을 이끌고 있는 제로웨이스트 유럽(Zero Waste Europe)이 발간한 「The Zero Waste Masterplan」을 함께 번역했습니다. 마포자원순환네트워크는 이 안내서를 한국과 지방정부의 현실에 맞게 옮겨 2025년 6월 30일 공식 한국어판으로 펴냈습니다.', '마포자원순환네트워크는 이 안내서가 소각과 매립에 기대지 않고 자립하는 도시를 고민하는 지방정부, 의회, 시민단체, 연구자, 시민 누구에게나 길잡이가 되기를 바랍니다.'],
         'quote':'제품, 포장재 및 원료를 책임감 있게 생산하고 소비하며 재사용하여 모든 자원을 보존하고, 그 어떤 것도 소각하지 않으며, 환경과 인체 건강에 해로운 물질을 토양, 물, 공기 중에 배출하지 않는다.',
         'quoteBy':'제로 웨이스트 국제연맹 (Zero Waste International Alliance)',
         'file':'https://drive.google.com/uc?export=download&id=1K-qHskdfvoKPCYP0Qld5ys-ILSM6CYsr',
         'fileView':'https://drive.google.com/file/d/1K-qHskdfvoKPCYP0Qld5ys-ILSM6CYsr/view',
         'fileName':'[KOR] 제로 웨이스트 도시를 위한 안내서.pdf (약 9.8MB)'}})
open('assets/data.js','w').write('// 기본 콘텐츠. 구글 시트를 연결하면(config.js) 시트 내용이 이 값을 덮어씁니다.\nwindow.MZ_DATA = ' + json.dumps(D, ensure_ascii=False, indent=1) + ';\n')
print('data ok')
