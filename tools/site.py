def page(fname, key, title, desc, main):
    html = f'''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="assets/logo.png">
<link rel="icon" href="assets/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800;900&display=swap">
<link rel="stylesheet" href="assets/style.css">
</head>
<body data-page="{key}">
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header id="site-header" class="site-header"></header>
<main id="main">
{main}
</main>
<footer id="site-footer" class="site-footer"></footer>
<script src="assets/config.js"></script>
<script src="assets/data.js"></script>
<script src="assets/site.js"></script>
</body>
</html>
'''
    open(fname, 'w').write(html)

def hero(a, b, h1, lead, extra=''):
    return f'''<section class="wave hero"><div class="wrap">
<div class="kicker"><span>{a}</span><i aria-hidden="true"></i><span>{b}</span></div>
<h1>{h1}</h1>
<p class="lead">{lead}</p>{extra}
</div></section>'''
def eb(a, b): return f'<div class="eyebrow"><span>{a}</span><i aria-hidden="true"></i><span>{b}</span></div>'
ARROW = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
MISSION = '''<div class="mission">
<div><b>01</b><h3>정책전환</h3><p>소각 중심 행정에서 감량 중심 정책으로 전환합니다.</p></div>
<div><b>02</b><h3>연대 확장</h3><p>자치구 연대로 서울자원순환네트워크를 구축합니다.</p></div>
<div><b>03</b><h3>시민행동</h3><p>시민의 실천을 모아 정책에 반영합니다.</p></div>
<div><b>04</b><h3>도시선언</h3><p>지속가능한 서울의 미래를 위한 제로웨이스트 도시를 선언합니다.</p></div>
</div>'''
INTL = '''<div class="partners">
<div><h3>GAIA 세계소각대안연맹</h3><p>소각과 매립 없는 제로웨이스트 사회를 위한 국제 연대</p><a class="more" href="https://www.no-burn.org" target="_blank" rel="noopener">no-burn.org</a></div>
<div><h3>#BFFP</h3><p>플라스틱 오염 없는 미래를 위한 국제 연대</p><a class="more" href="https://www.breakfreefromplastic.org/" target="_blank" rel="noopener">breakfreefromplastic.org</a></div>
</div>'''

# ---- index
page('index.html', 'home', '마포자원순환네트워크 — 제로웨이스트 마포', '마포 곳곳에서 자원순환 도시를 만들기 위해 애쓰는 단체·기업·개인이 연서명으로 함께하는 연대입니다.', f'''
<section class="wave hero home"><div class="wrap">
<div class="kicker"><span>제로웨이스트</span><i aria-hidden="true"></i><span>마포</span></div>
<h1>고민을 모으면,<br>마포의 자원순환이 바뀝니다</h1>
<p class="lead">‘이런 캠페인은 어떨까?’ ‘이런 정책이 필요한데!’<br>마포 곳곳에서 자원순환 도시를 만들기 위해<br>애쓰는 단체·기업·개인이 연서명으로 모였습니다.<br>혼자서는 고민으로 남던 생각을,<br>함께 머리를 맞대고 실현해 갑니다.</p>
<div class="actions"><a class="btn lg" href="join.html">연서명으로 함께하기 {ARROW}</a><a class="btn lg ghost" href="about.html">네트워크 소개</a></div>
</div></section>
<section class="wrap stats" aria-label="네트워크 현황"><div class="box">
<div class="stat"><b data-render="count-orgs">18곳</b><span>연서명 단체·기업</span></div>
<div class="stat"><b data-render="count-persons">6명</b><span>연서명 개인</span></div>
<div class="stat"><b>2025.06</b><span>마포자원순환네트워크 출범</span></div>
<div class="stat"><b style="font-size:32px">GAIA · #BFFP</b><span>국제 연대 네트워크 회원</span></div>
</div></section>
<section class="sec tight" id="home-upcoming" hidden><div class="wrap">
<div class="sec-head"><div>{eb('다가오는','일정')}<h2 class="sec-title">곧 열리는 일정</h2></div><a class="more" href="news.html">소식·일정 전체 보기</a></div>
<div data-render="upcoming"></div>
</div></section>
<section class="sec"><div class="wrap">
<div class="sec-head"><div>{eb('소식','일정')}<h2 class="sec-title">지금, 네트워크에서는</h2></div><a class="more" href="news.html">소식 전체 보기</a></div>
<div class="grid" data-render="news-cards" data-limit="3"></div>
</div></section>
<section class="guide" data-render="guide" aria-labelledby="guide-title"><div class="wrap">
<figure class="guide-cover" data-guide-cover><div class="guide-fallback" aria-hidden="true"><small>공식 한국어판</small><strong>제로 웨이스트<br>도시를 위한<br>안내서</strong><span>Zero Waste Europe<br>마포자원순환네트워크 옮김</span></div></figure>
<div class="guide-text">
<div class="eyebrow"><span>2025.06.30</span><i aria-hidden="true"></i><span>발간</span></div>
<h2 id="guide-title">『제로 웨이스트 도시를 위한 안내서』<br>공식 한국어판을 펴냈습니다</h2>
<p>국제 환경 네트워크 가이아(GAIA)의 유럽 지부 역할을 하는 제로 웨이스트 유럽(Zero Waste Europe)이 유럽 도시들의 제로웨이스트 전환 경험을 담아 펴낸 마스터플랜입니다. 마포자원순환네트워크와 서울환경연합이 함께 번역해, 누구나 무료로 내려받을 수 있도록 공개했습니다.</p>
<div class="guide-actions"><a class="btn lg" href="record.html#zw-city-guide">발간 소식 보기</a></div>
</div>
</div></section>
<section class="bg-cream sec"><div class="wrap">
<div class="split"><div>{eb('비전','미션')}<h2 class="sec-title">자원이 순환하고 공동체가 살아나는 제로웨이스트 도시, 마포</h2></div>
<p style="margin:0;align-self:flex-end">우리가 조금씩 힘을 합치면, 고민으로만 가져왔던 일을 실현할 길을 만들 수 있습니다. 함께 공부하고, 정책과 조례를 제안하고, 마포 곳곳에서 공간과 프로그램을 함께 꾸려 갑니다.</p></div>
{MISSION}
</div></section>
<section class="sec"><div class="wrap">
{eb('활동','기록')}<h2 class="sec-title">우리가 함께 하는 일</h2>
<div class="rows" data-render="activity-rows" data-limit="4"></div>
<a class="more" href="activities.html" style="margin-top:16px">모든 활동 보기</a>
</div></section>
<section class="bg-mint sec"><div class="wrap split">
<div>{eb('성명','논평')}<h2 class="sec-title" style="font-size:32px">우리의 목소리</h2><ul class="list" data-render="doc-list" data-key="statements" data-limit="3"></ul><a class="more" href="statements.html">목소리와 기록 더 보기</a></div>
<div>{eb('언론','보도')}<h2 class="sec-title" style="font-size:32px">언론 속의 우리</h2><ul class="list" data-render="doc-list" data-key="press" data-limit="3"></ul><a class="more" href="statements.html#press">언론 보도 더 보기</a></div>
</div></section>
<section class="sec"><div class="wrap">
<div class="split"><div>{eb('함께하는','사람들')}<h2 class="sec-title">이름을 올린 것으로<br>연대는 시작됩니다</h2></div>
<p class="muted" style="margin:0;align-self:flex-end">마포자원순환네트워크는 하나의 조직이 아니라, 뜻에 동의해 연서명한 단체·기업·개인의 느슨한 연대입니다.</p></div>
<ul class="chips" data-render="org-chips"></ul>
<a class="more" href="people.html" style="margin-top:20px">전체 명단 보기</a>
</div></section>
<section class="wave sec cta-band"><div class="wrap"><div class="panel">
<h2>마포의 변화, 실천을 넘어<br>‘연대’로 완성됩니다</h2>
<p>단체도, 기업도, 개인도 환영합니다. 연서명으로 이름을 올리고 정책 제안과 현장 조사, 공동 행동에 함께해 주세요.</p>
<a class="btn lg" href="join.html">연서명 참여하기</a>
</div></div></section>''')

# ---- about
page('about.html', 'about', '소개 - 마포자원순환네트워크', '연대로 시스템을 바꾸는 제로웨이스트 마포. 마포자원순환네트워크의 비전, 미션, 일하는 방식과 연혁.', hero('네트워크','소개','연대로 시스템을 바꾸는<br>제로웨이스트 마포','마포 곳곳에서 자원순환 도시를 만들기 위해<br>애쓰는 단체·기업·개인이 모였습니다.') + f'''
<section class="sec"><div class="wrap split">
<h2 class="sec-title" style="margin:0">왜 모였나요</h2>
<div style="font-size:19px;line-height:1.85">
<p style="margin-top:0">마포 곳곳에는 자원순환 도시를 만들기 위해 애쓰는 사람들이 있습니다. 활동하면서 ‘이런 캠페인은 어떨까?’, ‘이런 정책이 필요한데!’ 하는 아이디어와 고민도 쌓여 왔습니다.</p>
<p>2024년 12월, 알맹상점·울림두레생협·쓸모업사이클·수리상점 곰손의 제안으로 첫 준비모임을 열었습니다. 조금씩 힘을 합치면 고민으로만 가져왔던 일을 실현할 길을 만들 수 있다는 생각이었습니다. 그렇게 모인 단체와 사람들이 2025년 6월 마포자원순환네트워크를 발족했습니다.</p>
<p class="bg-cream" style="padding:24px 28px;border-radius:16px;font-size:17px;margin-bottom:0">마포자원순환네트워크는 마포 지역에서 자원순환 활동을 하거나 관심 있는 <strong>단체·기업·개인의 연서명</strong>으로 이루어진 느슨한 연대조직입니다.</p>
</div></div></section>
<section class="bg-mint sec"><div class="wrap">
{eb('비전','미션')}
<p class="sec-title" style="max-width:900px;font-family:var(--head)">“자원이 순환하고 공동체가 살아나는 제로웨이스트 도시, 마포”</p>
{MISSION.replace('class="mission"','class="mission"')}
</div></section>
<section class="sec"><div class="wrap split">
<div><h2 class="sec-title" style="margin:0">느슨하지만<br>단단한 연대</h2><p class="muted">우리가 일하는 방식입니다.</p></div>
<div class="rows" style="margin-top:0">
<div class="row"><div style="flex:1 1 100%"><h3 style="font-size:22px">연서명으로 참여합니다</h3><p>뜻에 동의하는 단체·기업·개인이 이름을 올리는 것으로 구성원이 됩니다. 각 구성원은 자율적이고 독립적으로 활동합니다.</p></div></div>
<div class="row"><div style="flex:1 1 100%"><h3 style="font-size:22px">운영위원회가 살림을 맡습니다</h3><p>네트워크를 위해 자발적으로 활동하겠다고 나선 분들이 모여 운영위원회를 꾸렸습니다. 운영위원들이 회의와 연락, 공동 행동 준비 같은 네트워크의 살림을 맡습니다.</p></div></div>
<div class="row"><div style="flex:1 1 100%"><h3 style="font-size:22px">필요할 때 함께 움직입니다</h3><p>성명과 논평, 토론회, 정책 제안, 현장 조사처럼 함께할 일이 생기면 구성원에게 알리고 뜻이 맞는 만큼 참여합니다.</p></div></div>
</div></div></section>
<section class="bg-cream sec"><div class="wrap split">
<div>{eb('걸어온','길')}<h2 class="sec-title">연혁</h2></div>
<ol class="history" data-render="history"></ol>
</div></section>
<section class="sec"><div class="wrap">
<div class="split"><div>{eb('국제','연대')}<h2 class="sec-title">마포의 목소리,<br>세계와 함께 공명합니다</h2></div><p class="muted" style="margin:0;align-self:flex-end">전 세계 제로웨이스트 도시·단체와 데이터와 정책을 나눕니다.</p></div>
{INTL}
</div></section>''')

# ---- activities
page('activities.html', 'activities', '활동 - 마포자원순환네트워크', '공동주택, 슈퍼마켓 등 현장에서 쓰레기 감량 모델을 만들고 정책으로 잇는 마포자원순환네트워크의 활동.', hero('우리가','하는 일','쓰레기를 줄이는 시스템을<br>현장에서 만듭니다','공동주택과 동네 슈퍼마켓처럼 쓰레기가 생기는 현장에서<br>감량 모델을 만들고, 그 결과를 정책 제안으로 잇습니다.') + f'''
<section class="sec"><div class="wrap">
{eb('활동','기록')}<h2 class="sec-title">사업과 활동</h2>
<p class="muted" style="margin:12px 0 0">네트워크의 네 가지 미션에 따라 활동을 나눴습니다.</p>
<div data-render="activity-board"></div>
</div></section>
<section class="bg-cream"><div class="wrap" style="padding-top:72px;padding-bottom:72px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:24px">
<div><h2 style="font-weight:900;font-size:30px">함께할 동료를 찾고 있습니다</h2><p class="muted" style="margin:6px 0 0">쓰레기 줄이기를 함께 고민하고 실천할 이웃과 단체, 그리고 함께 바꿔 볼 아파트·가게·기관·모임을 기다립니다.</p></div><a class="btn lg" href="join.html#propose">제안합니다</a>
</div></section>''')

# ---- statements
def ls(id_, a, b, t, key):
    return f'<section id="{id_}" class="sec tight"><div class="wrap">{eb(a,b)}<h2 class="sec-title" style="font-size:32px">{t}</h2><ul class="list" data-render="doc-list" data-key="{key}"></ul></div></section>'
page('statements.html', 'statements', '목소리와 기록 - 마포자원순환네트워크', '마포자원순환네트워크의 성명·논평, 포럼·토론회 자료집, 언론 보도.', hero('목소리와','기록','우리의 목소리를<br>기록으로 남깁니다','성명과 논평, 포럼·토론회 자료집 등과 언론에 실린 우리의 이야기를 모았습니다.<br>자료는 누구나 내려받아 쓸 수 있습니다.') + '''
<nav class="wrap tabs" aria-label="목소리와 기록 분류" style="padding-top:32px"><a href="#statements">성명·논평</a><a href="#docs">자료집</a><a href="#press">언론 보도</a></nav>''' + ls('statements','성명','논평','성명·논평','statements') + ls('docs','자료','집','자료집·선언문','docs') + ls('press','언론','보도','언론 속의 우리','press') + '<div style="height:96px"></div>')

# ---- record (목소리와 기록 상세)
page('record.html', 'statements', '목소리와 기록 - 마포자원순환네트워크', '마포자원순환네트워크의 성명·논평, 자료집, 언론 보도', '<article class="post" data-render="record"></article>')

# ---- news
page('news.html', 'news', '소식·일정 - 마포자원순환네트워크', '마포자원순환네트워크의 다가오는 일정과 소식.', hero('소식','일정','지금, 네트워크에서는','다가오는 일정과 지나온 소식을 전합니다.') + f'''
<section class="sec tight" id="upcoming-sec" hidden><div class="wrap">{eb('다가오는','일정')}<div data-render="upcoming"></div></div></section>
<section class="sec"><div class="wrap">{eb('지난','소식')}
<div class="filters" data-target="timeline" role="group" aria-label="소식 분류" style="margin-top:20px">
<button type="button" aria-pressed="true" data-cat="">전체</button><button type="button" aria-pressed="false" data-cat="사업">사업·활동</button><button type="button" aria-pressed="false" data-cat="입장">입장</button><button type="button" aria-pressed="false" data-cat="연대">연대</button><button type="button" aria-pressed="false" data-cat="행사">행사·토론회</button>
</div>
<ol class="timeline" id="timeline" data-render="news-timeline"></ol>
</div></section>''')

# ---- post
page('post.html', 'news', '소식 - 마포자원순환네트워크', '마포자원순환네트워크 소식', '<article class="post" data-render="post"></article>')

# ---- people
page('people.html', 'people', '함께하는 사람들 - 마포자원순환네트워크', '마포자원순환네트워크에 연서명한 단체·기업과 협력 네트워크.', hero('함께하는','사람들','이름을 올린 것으로<br>연대는 시작됩니다','마포자원순환네트워크는 하나의 조직이 아니라, 뜻에 동의해 연서명한<br>단체·기업·개인의 느슨한 연대조직입니다.') + f'''
<section class="sec tight"><div class="wrap">
<div class="stats" style="margin:0"><div class="box" style="box-shadow:none;background:var(--mint);border:0">
<div class="stat"><b data-render="count-orgs">18곳</b><span>연서명 단체·기업</span></div>
<div class="stat"><b data-render="count-persons">6명</b><span>연서명 개인 (이름은 공개하지 않습니다)</span></div>
</div></div>
</div></section>
<section class="sec tight"><div class="wrap">{eb('연서명','단체·기업')}<h2 class="sec-title" style="font-size:32px">함께 이름을 올린 곳</h2><ul class="logos" data-render="org-logos"></ul></div></section>
<section class="sec"><div class="wrap">{eb('함께하는','네트워크')}<h2 class="sec-title" style="font-size:32px">협력 단체와 지원</h2><div class="partners" data-render="partners"></div>
<a class="btn lg" href="join.html" style="margin-top:48px">우리 단체도 이름 올리기</a></div></section>''')

# ---- join
page('join.html', 'join', '함께하기 - 마포자원순환네트워크', '연서명으로 마포자원순환네트워크에 함께하세요. 함께할 현장과 활동도 제안해 주세요.', hero('함께','하기','이름을 올리는 것으로<br>연대가 시작됩니다','마포에서 자원순환 활동을 하거나 관심이 있다면 누구나 함께할 수 있습니다. 함께할 현장이나 활동을 제안해 주셔도 좋습니다.') + f'''
<section class="sec tight"><div class="wrap">
<h2 class="sec-title" style="font-size:34px;margin:0">누가 참여하나요</h2>
<div class="grid" style="margin-top:28px">
<div class="card"><h3>단체</h3><p>시민단체, 협동조합, 마을공동체, 학교, 생협 등 마포에서 활동하는 비영리 조직</p></div>
<div class="card"><h3>기업</h3><p>제로웨이스트 상점, 업사이클·수리·재사용 등 자원순환을 실천하는 기업과 가게</p></div>
<div class="card"><h3>개인</h3><p>쓰레기 감량과 제로웨이스트 도시에 관심 있는 주민·시민 누구나</p></div>
</div></div></section>
<section class="sec"><div class="wrap" style="display:flex;flex-wrap:wrap;gap:48px 72px;align-items:flex-start">
<div style="flex:1 1 360px">
<h2 class="sec-title" style="font-size:34px;margin:0">연서명하면<br>이렇게 함께합니다</h2>
<ol class="steps">
<li><b>01</b><span><strong>함께하는 사람들에 이름이 실립니다</strong><span>단체·기업은 이름을, 개인은 인원수만 싣습니다.</span></span></li>
<li><b>02</b><span><strong>소식과 일정을 받습니다</strong><span>회의, 포럼, 토론회, 공동 행동 소식을 전해 드립니다.</span></span></li>
<li><b>03</b><span><strong>뜻이 맞는 만큼 참여합니다</strong><span>성명 연명, 정책 제안, 현장 조사, 국제 연대 활동에 원하는 만큼 함께합니다.</span></span></li>
</ol></div>
<form id="join-form" class="form" aria-labelledby="join-title" style="flex:1 1 440px" novalidate>
<h2 id="join-title">참여 신청·제안</h2>
<fieldset><legend>무엇을 하시나요?</legend><div class="radios">
<label><input type="radio" name="purpose" value="연서명 참여" checked>연서명 참여</label>
<label><input type="radio" name="purpose" value="현장·활동 제안">현장·활동 제안</label>
</div></fieldset>
<fieldset><legend>참여 유형</legend><div class="radios">
<label><input type="radio" name="kind" value="단체" checked>단체</label>
<label><input type="radio" name="kind" value="기업">기업</label>
<label><input type="radio" name="kind" value="개인">개인</label>
</div></fieldset>
<div class="field"><label for="f-name">단체·기업명 또는 이름 <span class="muted">(필수)</span></label><input id="f-name" name="name" type="text" required autocomplete="organization"></div>
<div class="two">
<div class="field"><label for="f-contact">담당자 이름</label><input id="f-contact" name="contact" type="text" autocomplete="name"></div>
<div class="field"><label for="f-tel">연락처</label><input id="f-tel" name="tel" type="tel" autocomplete="tel"></div>
</div>
<div class="field"><label for="f-email">이메일 <span class="muted">(필수)</span></label><input id="f-email" name="email" type="email" required autocomplete="email"></div>
<div class="field"><label for="f-msg" id="f-msg-label">함께하고 싶은 활동이나 한마디 (선택)</label><textarea id="f-msg" name="message" rows="3"></textarea></div>
<div class="hp" aria-hidden="true"><label for="f-web">웹사이트</label><input id="f-web" name="website" type="text" tabindex="-1" autocomplete="off"></div>
<label class="check"><input type="checkbox" name="publish">(단체·기업) 함께하는 사람들 명단에 이름을 공개하는 데 동의합니다.</label>
<label class="check"><input type="checkbox" name="privacy">개인정보 수집·이용에 동의합니다. (필수) — 수집 항목: 이름, 담당자, 연락처, 이메일 / 목적: 연서명 확인과 소식 안내 / 보관: 탈퇴 요청 시까지</label>
<button class="btn lg" type="submit">보내기</button>
<div id="join-msg" class="notice" role="status" tabindex="-1" hidden></div>
<p class="muted" style="margin:0;font-size:14px">보내 주시면 운영위원이 확인한 뒤 연락드립니다. 개인은 이름을 공개하지 않고 인원수로만 표시합니다.</p>
</form>
</div></section>''')
print('pages ok')
