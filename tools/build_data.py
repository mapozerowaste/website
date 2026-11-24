import sys, json
sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
import importlib, content; importlib.reload(content)
from content import *
for n in NEWS: n['upcoming']=bool(n.get('upcoming')); n.setdefault('photo',''); n.setdefault('link','')
for a in ACTIVITIES: a.setdefault('photo',''); a.setdefault('link','')
NEWS[0]['body']=['마포자원순환네트워크와 알맹상점이 「2026 BFFP 슈퍼마켓 감사 한국 결과 발표」 기자회견을 엽니다.',
 '슈퍼마켓 감사는 전 세계 2,700여 단체가 참여하는 국제 연대체 #BreakFreeFromPlastic(BFFP)의 시민과학 조사입니다. 시민이 직접 매장을 방문해 플라스틱 포장과 재사용 기반시설을 같은 조사표로 기록합니다. 한국은 올해 처음 참가해 전국 10개 시·도 53개 매장을 조사했고, 참가 51개국 가운데 조사 제출 건수 세계 5위·아시아 3위를 기록했습니다.',
 '조사 결과, 국내 5대 대형마트(이마트·롯데·홈플러스·농협하나로마트·GS더프레시)에서 포장을 줄이는 판매 방식은 찾아보기 어려웠습니다. 조사 매장의 92%가 육류·수산물 등에 스티로폼 포장을 사용했고, 농산물은 품목군 판정의 90%가 ‘주로’ 또는 ‘전부’ 포장된 상태였습니다. 건식 벌크·리필 코너는 한 곳도 없었고(2025년 글로벌 14%), 빈용기보증금제가 시행 중인데도 반납 창구가 확인된 매장은 45%에 그쳤습니다.',
 '기자회견에서는 시민의 눈으로 확인한 5대 대형마트의 포장 실태와 해외 비교 결과를 처음 공개하고, 스티로폼 트레이·PVC 랩의 유해성과 리필 판매의 부재를 짚습니다. 이어 포장재로 가득 찬 카트 퍼포먼스를 진행한 뒤 이마트 측에 요구서를 전달하고, 롯데마트·홈플러스·농협하나로마트·GS더프레시에도 같은 요구서를 발송합니다.',
 '이 결과는 시민 53명(팀)의 현장 관찰이며 전국 대표 표본은 아닙니다. 언론과 시민 여러분의 관심을 부탁드립니다.']
NEWS[0]['info']=[['일시','2026년 11월 25일(수) 오전 11시'],['장소','이마트 본사 앞 (서울 중구 세종대로7길 37, 시청역 인근)'],['주최','마포자원순환네트워크 · 알맹상점'],['사회','박정음 (수리상점 곰손)'],['발언','오현주 (제로웨이스트도시랩 대표) · 최인자 (노동환경건강연구소 박사) · 고금숙 (알맹상점 공동대표) · 성미산학교 교사·학생'],['지원','다정한 재단 ‘다정한 기금’'],['문의','mapozerowaste@gmail.com']]
ids = {'statements':['court-statement','gaia-bffp-letter','statement-251114','comment-250910'],
       'docs':['assembly-forum-book','launch-declaration','launch-forum-book','ppf30-forum-book','zw-city-guide'],
       'press':['gaia-win-261014','energydaily-260130','bffp-251114','slownews-250710','hankooki-250630','energydaily-250625']}
lists = {'statements':STATEMENTS,'docs':DOCS,'press':PRESS}
for k,L in lists.items():
    for x,i in zip(L, ids[k]):
        x['id']=i; x.setdefault('summary',''); x.setdefault('body',None); x.setdefault('photo',''); x.setdefault('file','')
        if x['href']=='#': x['href']=''
PRESS[0]['summary']='GAIA가 지난 25년간 소각장을 막아 낸 사례를 소개하는 시리즈에 서울시의 마포 소각장 계획 철회가 실렸습니다. 이 승리에 함께한 회원단체로 마포자원순환네트워크가 올라 있습니다.'
PRESS[1]['summary']='국회 토론회 ‘제로웨이스트로 가는 길: 예산으로 보는 자원순환정책’을 다룬 기사입니다.'
D=dict(news=NEWS,activities=ACTIVITIES,statements=STATEMENTS,docs=DOCS,press=PRESS,history=[dict(date=d,text=t) for d,t in HISTORY],orgs=ORGS,persons=PERSONS,partners=PARTNERS,logos=LOGOS,
       guide={'about':'record.html#zw-city-guide','download':'','cover':'assets/guide-cover.png'},
       gated={'zw-city-guide': {
         'image':'assets/guide-promo.jpg',
         'lead':'제로 웨이스트 유럽의 마스터플랜 「The Zero Waste Masterplan」 공식 한국어판',
         'body':['마포자원순환네트워크는 우리나라의 도시들도 제로웨이스트 도시로 전환해야 한다고 생각합니다.',
                 '[제로 웨이스트 유럽(Zero Waste Europe)](https://zerowasteeurope.eu/)은 국제 환경 네트워크 [가이아(GAIA)](https://www.no-burn.org/ko/)의 유럽 지부 역할을 하며 플라스틱 감축, 음식물 쓰레기 저감 등 다양한 캠페인과 연구를 이끌어 온 단체입니다. 이들이 유럽 도시들의 제로웨이스트 전환 경험을 모아 펴낸 것이 「The Zero Waste Masterplan」입니다.',
                 '이 안내서를 더 많은 사람이 읽었으면 하는 마음으로 마포자원순환네트워크와 서울환경연합이 함께 우리말로 옮겨, 2025년 6월 30일 공식 한국어판 『제로 웨이스트 도시를 위한 안내서』로 펴냈습니다.',
                 '소각과 매립에 기대지 않고 자립하는 도시를 고민하는 지방정부와 의회, 시민단체, 연구자, 그리고 시민 누구나 이 안내서를 읽고 제로웨이스트 도시로 가는 길에 함께해 주시기를 바랍니다. 그래서 누구나 무료로 내려받을 수 있도록 공개합니다.'],
         'quote':'제품, 포장재 및 원료를 책임감 있게 생산하고 소비하며 재사용하여 모든 자원을 보존하고, 그 어떤 것도 소각하지 않으며, 환경과 인체 건강에 해로운 물질을 토양, 물, 공기 중에 배출하지 않는다.',
         'quoteBy':'제로 웨이스트 국제연맹 (Zero Waste International Alliance)',
         'file':'https://drive.google.com/uc?export=download&id=1K-qHskdfvoKPCYP0Qld5ys-ILSM6CYsr',
         'fileView':'https://drive.google.com/file/d/1K-qHskdfvoKPCYP0Qld5ys-ILSM6CYsr/view',
         'fileName':'[KOR] 제로 웨이스트 도시를 위한 안내서.pdf (약 9.8MB)'}})
open('assets/data.js','w').write('// 기본 콘텐츠. 구글 시트를 연결하면(config.js) 시트 내용이 이 값을 덮어씁니다.\nwindow.MZ_DATA = ' + json.dumps(D, ensure_ascii=False, indent=1) + ';\n')
print('data ok')
