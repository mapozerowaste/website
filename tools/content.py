# Shared content for canvas artboards and the static site
ORGS = ['(사)사람과마을', '발달장애청년허브 사부작 사회적협동조합', '마포녹색당', '해빗투게더협동조합', '민트협동조합 봄봄마을정원사모임', '마포FM', '동네책방 개똥이네 책놀이터', '개똥이네 문화놀이터', '무지개의원', '우리동네나무그늘협동조합', '백의민족', '(사)마포사회적경제네트워크', '성미산학교', '쓸모업사이클', '알맹상점', '울림두레생협', '지구샵', '에코라미', '제로웨이스트도시랩']
PERSONS = 7
LOGOS = {'(사)사람과마을':'assets/logos/saram-maeul.png','동네책방 개똥이네 책놀이터':'assets/logos/gaeddong-books.png','개똥이네 문화놀이터':'assets/logos/gaeddong-culture.png','우리동네나무그늘협동조합':'assets/logos/woori-shade.png','(사)마포사회적경제네트워크':'assets/logos/mapo-sen.png','알맹상점':'assets/logos/almang.png','울림두레생협':'assets/logos/urim-dure.png','해빗투게더협동조합':'assets/logos/habit-together.png','마포FM':'assets/logos/mapofm.png','쓸모업사이클':'assets/logos/sslmo-upcycle.png','무지개의원':'assets/logos/rainbow-clinic.png','성미산학교':'assets/logos/sungmisan-school.png','지구샵':'assets/logos/jigushop.png','발달장애청년허브 사부작 사회적협동조합':'assets/logos/sabujak.png','백의민족':'assets/logos/baekuiminjok.png','제로웨이스트도시랩':'assets/logos/zerowaste-city-lab.png','민트협동조합 봄봄마을정원사모임':'assets/logos/mint-bombom.png'}

NEWS = [
 dict(id='press-supermarket', date='2026.11.25', cat='기자회견', title='‘2026 BFFP 슈퍼마켓 감사’ 한국 결과 발표 기자회견', text='스티로폼 92%, 리필 코너 0곳 — 5대 대형마트에 포장 감축을 요구합니다. 11월 25일(수) 오전 11시, 이마트 본사 앞에서 엽니다.', upcoming=True, when='2026-11-25 11:00'),
 dict(id='supermarket-audit', date='2026.06', cat='활동', title='#BFFP와 함께 슈퍼마켓 감사를 진행했습니다', text='#BFFP와 함께 슈퍼마켓 감사를 진행했습니다. 다정한 재단 ‘다정한 기금’의 지원으로 진행했습니다.'),
 dict(id='apartment-model', date='2026.03', cat='사업', title='제로웨이스트 공동주택 모델 만들기', text='마포구가 발주한 2026년 제로웨이스트 공동주택 모델 만들기 사업을 마포자원순환네트워크 이름으로 진행했습니다.'),
 dict(id='modu-network', date='2026.02', cat='연대', title='‘모두!자원순환네트워크’ 첫 모임', text='서울 자치구의 자원순환 네트워크가 함께하는 연대체 이름을 정하고 첫 모임을 열었습니다.'),
 dict(id='award', date='2026.02.25', cat='수상', title='서울환경연합 ‘환경디딤돌상’ 수상', text='서울환경연합이 마포자원순환네트워크에 환경디딤돌상을 수여했습니다.'),
 dict(id='court', date='2026.02.12', cat='입장', title='추가 소각장 ‘설치 취소 판결’을 환영합니다', text='서울시를 상대로 한 행정소송 2심에서 주민들이 승소했습니다.'),
 dict(id='assembly-forum', date='2026.01.30', cat='토론회', title='국회 토론회 ‘제로웨이스트로 가는 길: 예산으로 보는 자원순환정책’', text='예산으로 자원순환정책을 짚어 보는 국회 토론회를 주관했습니다.'),
 dict(id='gaia-letter', date='2025.11.24', cat='연대', title='GAIA·#BFFP 국제 공동서명 참여', text='소각을 ‘폐기물 에너지화’로 정당화하는 흐름에 항의하는 공동서명에 이름을 올렸습니다.'),
 dict(id='statement-1114', date='2025.11.14', cat='입장', title='‘소각’을 재활용에서 제외하겠다는 정부 입장 환영 성명', text='국문과 영문으로 발표했고, #BFFP 누리집에도 실렸습니다.'),
 dict(id='comment-0910', date='2025.09.10', cat='입장', title='논평: 마포구는 폐기물 감량 종합대책을 수립해야', text='1회용품 반입 금지 조례가 없는 마포구에 종합대책을 요구했습니다.'),
 dict(id='bffp', date='2025.09.04', cat='연대', title='#BFFP 핵심 멤버 가입', text=''),
 dict(id='gaia', date='2025.07.17', cat='연대', title='세계소각대안연맹(GAIA) 회원단체 승인', text=''),
 dict(id='launch', date='2025.06.30', cat='행사', title='마포자원순환네트워크 발족식과 포럼 ‘소각장 너머 제로웨이스트 도시로’', text='마포구의회 다목적실에서 발족을 선언하고 포럼을 열었습니다.'),
 dict(id='guide', date='2025.06.30', cat='발간', title='『제로 웨이스트 도시를 위한 안내서』 공식 한국어판 발간', text='마포자원순환네트워크와 서울환경연합이 제로 웨이스트 유럽(Zero Waste Europe)의 「The Zero Waste Masterplan」을 함께 번역해 공식 한국어판으로 펴냈습니다.'),
]

ACTIVITIES = [
 dict(cat='시민행동', status='사업 종료', period='2026.03', title='제로웨이스트 공동주택 모델 만들기', text='마포구가 발주한 2026년 사업입니다. 공동주택 단지와 함께 쓰레기를 줄이는 관리 모델을 만들었고, 마포자원순환네트워크 이름으로 계약해 진행했습니다.', meta='발주: 마포구'),
 dict(cat='시민행동', status='기자회견', period='2026.06', title='슈퍼마켓 감사', text='#BFFP와 함께 전국 10개 시·도 53개 매장의 포장 실태를 시민이 직접 조사했습니다. 결과는 2026년 11월 25일 기자회견으로 발표합니다.', meta='함께한 곳: #BFFP · 지원: 다정한 재단 ‘다정한 기금’'),
 dict(cat='도시선언', status='발간', period='2025.06.30', title='『제로 웨이스트 도시를 위한 안내서』 공식 한국어판', text='제로 웨이스트 유럽(Zero Waste Europe)이 펴낸 「The Zero Waste Masterplan」을 서울환경연합과 함께 번역했습니다. 유럽 도시들의 제로웨이스트 전환 경험을 담은 안내서를 누구나 내려받을 수 있습니다.', meta='함께 옮긴 곳: 서울환경연합 · 원저: Zero Waste Europe'),
 dict(cat='정책전환', status='상시', period='2025–', title='정책 포럼과 토론회', text='발족 포럼(2025.6.30), 서울환경연합과 함께한 종량제 30주년 포럼 시리즈, 국회 토론회(2026.1.30) 등 정책을 바꾸는 공론장을 엽니다.', meta='함께한 곳: 마포구의회 · 서울환경연합'),
 dict(cat='연대 확장', status='준비 중', period='2026.02', title='‘모두!자원순환네트워크’ — 서울 자치구 연대', text='자치구마다 생겨나는 자원순환 네트워크와 함께 서울자원순환네트워크를 준비합니다. 2026년 2월 첫 모임을 열었습니다.', meta=''),
 dict(cat='연대 확장', status='상시', period='2025–', title='국제 연대', text='세계소각대안연맹(GAIA) 회원단체이자 #BFFP 핵심 멤버로, 세계의 제로웨이스트 도시·단체와 정책을 나누고 공동서명에 참여합니다.', meta='GAIA 회원단체 · #BFFP 핵심 멤버'),
]

STATEMENTS = [
 dict(date='2026.02.12', kind='성명', title='추가 소각장 ‘설치 취소 판결’을 환영한다', href='#'),
 dict(date='2025.11.24', kind='공동서명', title='GAIA·#BFFP 국제 공동서한 연명', href='#'),
 dict(date='2025.11.14', kind='성명', title='‘소각’은 ‘재활용’에서 제외하겠다는 정부의 입장을 환영한다 (국문·영문)', href='#'),
 dict(date='2025.09.10', kind='논평', title='마포구는 폐기물 감량에 대한 종합대책을 수립해야', href='#'),
]
DOCS = [
 dict(date='2026.01.30', kind='자료집', title='국회 토론회 ‘제로웨이스트로 가는 길: 예산으로 보는 자원순환정책’ 자료집', href='#'),
 dict(date='2025.06.30', kind='선언문', title='마포자원순환네트워크 발족 선언문', href='#'),
 dict(date='2025.06.30', kind='자료집', title='포럼 ‘소각장 너머 제로웨이스트 도시로’ 발제 자료집', href='#'),
 dict(date='2025', kind='자료집', title='서울시 자원순환 정책 돌아보기: 종량제 30주년 포럼 자료집', href='#'),
 dict(date='2025.06.30', kind='안내서', title='『제로 웨이스트 도시를 위한 안내서』 공식 한국어판', href='#'),
]
PRESS = [
 dict(date='2026.01.30', kind='에너지데일리', title='국회 토론회 ‘제로웨이스트로 가는 길’ 보도', href='http://www.energydaily.co.kr/news/articleView.html?idxno=164275'),
 dict(date='2025.11.14', kind='#BFFP', title='소각을 재활용 통계에서 제외하기로 한 정부 결정을 환영합니다', href='https://www.breakfreefromplastic.org/ko/2025/11/14/mapo-statement-recycling-statistics/'),
 dict(date='2025.07.10', kind='슬로우뉴스', title='“짐승(소각장)을 만들면 계속 먹이(쓰레기)를 줘야 한다.”', href='https://slownews.kr/140752'),
 dict(date='2025.06.30', kind='데일리한국', title='포럼 ‘소각장 너머 제로웨이스트 도시로’ 보도', href='https://daily.hankooki.com/news/articleView.html?idxno=1236562'),
 dict(date='2025.06.25', kind='에너지데일리', title='종량제 30주년 포럼 보도', href='https://www.energydaily.co.kr/news/articleView.html?idxno=157321'),
]
HISTORY = [
 ('2024.12.17','마포자원순환네트워크 준비 초동모임'),
 ('2025.06.30','마포자원순환네트워크 발족식\n포럼 ‘소각장 너머 제로웨이스트 도시로’ 공동 주최\n『제로 웨이스트 도시를 위한 안내서』 공식 한국어판 발간'),
 ('2025.07.17','세계소각대안연맹(GAIA) 회원단체 승인'),
 ('2025.09.04','#BFFP 핵심 멤버 가입'),
 ('2026.01.30','국회 토론회 ‘제로웨이스트로 가는 길: 예산으로 보는 자원순환정책’ 주관'),
 ('2026.02','서울 자치구 연대 ‘모두!자원순환네트워크’ 첫 모임'),
 ('2026.02.25','서울환경연합 ‘환경디딤돌상’ 수상'),
 ('2026.03','제로웨이스트 공동주택 모델 만들기 사업 (마포구 발주)'),
 ('2026.06','#BFFP와 함께 슈퍼마켓 감사 진행 (다정한 재단 ‘다정한 기금’ 지원)'),
]
PARTNERS = [
 dict(name='서울환경연합', role='포럼·토론회 공동 주최, 환경디딤돌상 수여'),
 dict(name='GAIA 세계소각대안연맹', role='회원단체 (2025.7.17)'),
 dict(name='#BFFP', role='핵심 멤버 (2025.9.4), 슈퍼마켓 감사 협력'),
 dict(name='마포구', role='제로웨이스트 공동주택 모델 만들기 사업 발주'),
 dict(name='다정한 재단', role='‘다정한 기금’으로 슈퍼마켓 감사 지원'),
]
