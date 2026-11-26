/* 마포자원순환네트워크 — 공통 머리글·바닥글, 콘텐츠 표시, 연서명 신청 */
(function () {
  var CFG = window.MZ_CONFIG || {};
  var D = window.MZ_DATA || {};
  var DEFAULT_CAT = {};
  (D.activities || []).forEach(function (x) { if (x.cat) DEFAULT_CAT[x.title] = x.cat; });
  // 시트에 링크·사진 칸이 비어 있으면 기본값(data.js)의 것을 씁니다.
  var DEF_REC = {}; ['news', 'statements', 'docs', 'press'].forEach(function (k) { (D[k] || []).forEach(function (x) { if (x.id) DEF_REC[k + ':' + x.id] = x; }); });
  var DEFAULT_ACT_LINK = {}, DEFAULT_NEWS = {};
  (D.activities || []).forEach(function (x) { if (x.link) DEFAULT_ACT_LINK[x.title] = x.link; });
  (D.news || []).forEach(function (x) { if (x.link || x.photo) DEFAULT_NEWS[x.id] = x; });
  var page = document.body.getAttribute('data-page') || '';

  var NAV = [
    ['about.html', '소개', 'about'],
    ['activities.html', '활동', 'activities'],
    ['statements.html', '목소리와 기록', 'statements'],
    ['news.html', '소식·일정', 'news'],
    ['people.html', '함께하는 사람들', 'people']
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function safeHref(h) {
    h = String(h || '').trim();
    return /^(https?:|mailto:|#|assets\/[\w./%-]+$|[a-z0-9_-]+\.html)/i.test(h) ? h : '#';
  }

  /* ---------- 일정이 지나면 ‘다가오는 일정’에서 자동으로 빠지기 ---------- */
  // 일정 날짜(`일시` 칸 또는 `날짜` 칸)의 다음 날 0시(한국 시간)에 지난 소식으로 넘어갑니다. 시간은 따지지 않습니다.
  // 날짜를 알 수 없으면(예: 2026.11) ‘예정’ 칸(Y/N)을 따릅니다.
  function parseWhen(n) {
    var m = String(n.when || '').match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})(?:\D+(\d{1,2}):(\d{2}))?/);
    if (!m) m = String(n.date || '').trim().match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/);
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3], t = m[4] != null, h = t ? +m[4] : 0, mi = t ? +m[5] : 0;
    var start = Date.UTC(y, mo - 1, d, h - 9, mi);
    return { y: y, mo: mo, d: d, h: h, mi: mi, hasTime: t, start: start, end: Date.UTC(y, mo - 1, d + 1, -9, 0) };
  }
  function isUpcoming(n) {
    if (!n.upcoming) return false;
    var w = parseWhen(n);
    return !w || Date.now() < w.end;
  }

  /* ---------- 머리글·바닥글 ---------- */
  function renderChrome() {
    var h = document.getElementById('site-header');
    if (h) {
      var links = NAV.map(function (n) {
        return '<a href="' + n[0] + '"' + (page === n[2] ? ' aria-current="page"' : '') + '>' + n[1] + '</a>';
      }).join('');
      h.className = 'site-header';
      h.innerHTML = '<div class="wrap">' +
        '<a class="logo" href="index.html" aria-label="마포자원순환네트워크 홈"><img src="assets/logo.png" alt="마포자원순환네트워크" width="60" height="52"></a>' +
        '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="메뉴 열기">' +
        '<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
        '<nav class="nav" id="main-nav" aria-label="주 메뉴">' + links +
        '<a class="cta" href="join.html"' + (page === 'join' ? ' aria-current="page"' : '') + '>연서명 참여</a></nav></div>';
      var btn = h.querySelector('.menu-btn'), nav = h.querySelector('.nav');
      btn.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      });
    }
    var f = document.getElementById('site-footer');
    if (f) {
      f.className = 'site-footer';
      f.innerHTML = '<div class="wrap"><div><strong>마포자원순환네트워크</strong>' +
        '<p>서울특별시 마포구 월드컵북로 75 4층<br><a href="mailto:mapozerowaste@gmail.com">mapozerowaste@gmail.com</a></p></div>' +
        '<nav aria-label="하단 메뉴">' + NAV.map(function (n) { return '<a href="' + n[0] + '">' + n[1] + '</a>'; }).join('') +
        '<a href="join.html">함께하기</a></nav></div>';
    }
  }

  /* ---------- 구글 시트 불러오기 (선택) ---------- */
  // 시트 탭 이름과 열 이름(첫 줄). 운영위원이 보기 쉽게 한글로 둡니다.
  var SHEETS = {
    news: ['소식', { id: '아이디', date: '날짜', cat: '분류', title: '제목', text: '요약', body: '본문', info: '안내', photo: '사진', upcoming: '예정', when: '일시', link: '링크' }],
    activities: ['활동', { cat: '구분', status: '상태', period: '기간', title: '사업명', text: '설명', meta: '함께한곳', photo: '사진', link: '링크' }],
    statements: ['논평', { id: '아이디', date: '날짜', kind: '종류', title: '제목', summary: '요약', body: '본문', photo: '사진', file: '첨부', href: '링크' }],
    docs: ['자료', { id: '아이디', date: '날짜', kind: '종류', title: '제목', summary: '요약', body: '본문', photo: '사진', file: '첨부', href: '링크' }],
    press: ['언론', { id: '아이디', date: '날짜', kind: '매체', title: '제목', summary: '요약', body: '본문', photo: '사진', file: '첨부', href: '링크' }],
    history: ['연혁', { date: '날짜', text: '내용' }],
    orgs: ['연서명명단', { kind: '유형', name: '이름', logo: '로고' }],
    partners: ['협력', { name: '이름', role: '설명' }],
    settings: ['설정', { key: '항목', value: '값' }]
  };
  function parseCSV(text) {
    var rows = [], row = [], cell = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (c === '"') q = false;
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
      else if (c !== '\r') cell += c;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }
  function loadSheet(key) {
    var spec = SHEETS[key];
    var url = 'https://docs.google.com/spreadsheets/d/' + encodeURIComponent(CFG.SHEET_ID) +
      '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(spec[0]);
    return fetch(url).then(function (r) { if (!r.ok) throw r; return r.text(); }).then(function (t) {
      var rows = parseCSV(t);
      var head = rows.shift().map(function (s) { return s.trim(); });
      var out = rows.filter(function (r) { return r.join('').trim(); }).map(function (r) {
        var o = {};
        Object.keys(spec[1]).forEach(function (k) {
          var i = head.indexOf(spec[1][k]);
          o[k] = i >= 0 ? (r[i] || '').trim() : '';
        });
        var pub = head.indexOf('게시');
        o._hide = pub >= 0 && /^(n|no|아니오|x)$/i.test((r[pub] || '').trim());
        return o;
      }).filter(function (o) { return !o._hide; });
      if (key === 'news') out.forEach(function (n) {
        n.upcoming = /^(y|yes|예|o)$/i.test(n.upcoming || '');
        n.body = n.body ? n.body.split(/\n\s*\n|\n/) : null;
        n.info = n.info ? n.info.split('\n').filter(Boolean).map(function (l) { var i = l.indexOf(':'); return i > 0 ? [l.slice(0, i).trim(), l.slice(i + 1).trim()] : ['', l.trim()]; }) : null;
        if (!n.id) n.id = (n.date + '-' + n.title).replace(/[^0-9A-Za-z가-힣-]+/g, '-');
      });
      if (key === 'activities') out.forEach(function (a) { if (!a.cat) a.cat = DEFAULT_CAT[a.title] || ''; if (!a.link) a.link = DEFAULT_ACT_LINK[a.title] || ''; });
      if (key === 'statements' || key === 'docs' || key === 'press') out.forEach(function (n, i) {
        n.body = n.body ? n.body.split(/\n\s*\n|\n/) : null;
        if (!n.id) n.id = key + '-' + (i + 1);
      });
      // 시트에서 비워 둔 사진·링크·본문·첨부 칸은 기본값(data.js)으로 채웁니다.
      if (key === 'news' || key === 'statements' || key === 'docs' || key === 'press') out.forEach(function (n) {
        var d = DEF_REC[key + ':' + n.id]; if (!d) return;
        ['photo', 'link', 'linkText', 'file'].forEach(function (f) { if (!n[f] && d[f]) n[f] = d[f]; });
        if (!n.summary && d.summary) n.summary = d.summary;
        if ((!n.body || !n.body.length) && d.body) n.body = d.body;
        if (!n.info && d.info) n.info = d.info;
      });
      if (key === 'orgs') { D.logos = D.logos || {}; out.forEach(function (o) { if (o.logo) D.logos[o.name] = o.logo; }); }
      if (key === 'orgs') out = out.filter(function (o) { return o.kind !== '개인' && o.name; }).map(function (o) { return o.name; });
      if (key === 'settings') {
        D.guide = D.guide || {};
        out.forEach(function (o) {
          if (/개인/.test(o.key) && /^\d+$/.test(o.value)) D.persons = parseInt(o.value, 10);
          if (/안내서/.test(o.key) && /내려받기/.test(o.key)) D.guide.download = o.value;
          if (/안내서/.test(o.key) && /소개/.test(o.key)) D.guide.about = o.value;
          if (/안내서/.test(o.key) && /표지/.test(o.key) && o.value) D.guide.cover = o.value;
        });
        return;
      }
      if (out.length) D[key] = out;
    });
  }
  function loadAll() {
    if (!CFG.SHEET_ID || !window.fetch) return Promise.resolve();
    return Promise.all(Object.keys(SHEETS).map(function (k) {
      return loadSheet(k).then(function () { window.__mzSheetOk = (window.__mzSheetOk || 0) + 1; }).catch(function () { /* 시트를 못 읽으면 기본 내용을 그대로 씁니다 */ });
    }));
  }

  /* ---------- 사진 주소 ---------- */
  // 구글 드라이브 공유 링크(링크가 있는 모든 사용자 보기)나 assets/photos/ 안의 파일 이름을 받아 이미지 주소로 바꿉니다.
  function photoSrc(v) {
    v = String(v || '').trim();
    if (!v) return '';
    var m = v.match(/\/d\/([\w-]{20,})/) || v.match(/[?&]id=([\w-]{20,})/);
    if (m) return 'https://drive.google.com/thumbnail?id=' + m[1] + '&sz=w1600';
    if (/^https?:\/\//.test(v)) return v;
    if (/^[\w./-]+\.(jpe?g|png|webp|gif)$/i.test(v)) return v.indexOf('/') >= 0 ? v : 'assets/photos/' + v;
    return '';
  }
  function linkAttrs(h) { return ' href="' + esc(safeHref(h)) + '"' + (/^https?:/i.test(h) ? ' target="_blank" rel="noopener"' : ''); }
  function photoList(v) {
    return String(v || '').split(/[\n,]+/).map(function (x) { return photoSrc(x); }).filter(Boolean);
  }
  function photoTag(v, cls, alt) {
    var src = photoList(v)[0];
    return src ? '<img class="' + cls + '" src="' + esc(src) + '" alt="' + esc(alt || '') + '" loading="lazy" onerror="this.remove()"' + (cls === 'post-img' ? ' onload="if(this.naturalHeight>this.naturalWidth)this.classList.add(\'tall\')"' : '') + '>' : '';
  }


  /* ---------- 신청 후 내려받는 자료 (안내서) ---------- */
  function linkify(t) {
    return esc(t).replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, function (m, a, u) { return '<a href="' + u + '" target="_blank" rel="noopener">' + a + '</a>'; });
  }
  function renderGated(el, id, n, G) {
    var title = n.title || '『제로 웨이스트 도시를 위한 안내서』 공식 한국어판';
    document.title = title + ' - 마포자원순환네트워크';
    // 페이지를 열 때마다 입력 폼을 보여 줍니다. 신청을 마친 그 화면에서만 내려받기 버튼이 나타납니다.
    var done = false;
    var body = (G.body || []).map(function (p) { return '<p>' + linkify(p) + '</p>'; }).join('');
    el.className = 'post gated';
    el.innerHTML = '<nav aria-label="위치" class="muted"><a href="statements.html">목소리와 기록</a> › <a href="statements.html#docs">자료집</a></nav>' +
      '<div class="meta" style="margin-top:28px"><span class="badge">' + esc(n.kind || '안내서') + '</span><span>' + esc(n.date || '2025.06.30') + ' 발간</span></div>' +
      '<h1>' + esc(title) + '</h1>' + (G.lead ? '<p class="gated-lead">' + esc(G.lead) + '</p>' : '') +
      (G.image ? '<img class="gated-img" src="' + esc(G.image) + '" alt="' + esc(title) + ' 소개 이미지">' : '') +
      '<div class="body">' + body + '</div>' +
      (G.quote ? '<blockquote class="gated-quote"><p>' + esc(G.quote) + '</p><cite>— ' + esc(G.quoteBy || '') + '</cite></blockquote>' : '') +
      '<section class="dl-box" id="download" aria-labelledby="dl-title">' +
        '<h2 id="dl-title">안내서 내려받기</h2>' +
        '<p class="muted">아래 정보를 남겨 주시면 바로 내려받을 수 있습니다. 안내서가 어디에서 어떻게 쓰이는지 알아야 더 많은 도시와 함께할 수 있어 여쭙니다.</p>' +
        '<div class="dl-ready"' + (done ? '' : ' hidden') + '><a class="btn lg" href="' + esc(G.file) + '" target="_blank" rel="noopener">PDF 내려받기</a>' +
          '<a class="btn lg ghost" href="' + esc(G.fileView || G.file) + '" target="_blank" rel="noopener">바로 보기</a><p class="muted" style="margin:12px 0 0;font-size:14px">' + esc(G.fileName || '') + '</p></div>' +
        '<form class="form dl-form" novalidate' + (done ? ' hidden' : '') + '>' +
          '<div class="two"><div class="field"><label for="dl-name">이름 <span class="muted">(필수)</span></label><input id="dl-name" name="name" type="text" required autocomplete="name"></div>' +
          '<div class="field"><label for="dl-email">이메일 <span class="muted">(필수)</span></label><input id="dl-email" name="email" type="email" required autocomplete="email"></div></div>' +
          '<div class="two"><div class="field"><label for="dl-org">소속 <span class="muted">(필수)</span></label><input id="dl-org" name="org" type="text" required autocomplete="organization" placeholder="소속이 없으면 ‘개인’이라고 적어 주세요" aria-describedby="dl-org-hint"><small id="dl-org-hint" class="muted">소속이 없으면 ‘개인’이라고 적어 주세요.</small></div>' +
          '<div class="field"><label for="dl-use">활용 목적 <span class="muted">(필수)</span></label><select id="dl-use" name="use" required><option value="">선택해 주세요</option><option>지방정부·의회</option><option>시민단체·활동</option><option>연구·교육</option><option>기업</option><option>개인 학습</option><option>기타</option></select></div></div>' +
          '<div class="hp" aria-hidden="true"><label for="dl-web">웹사이트</label><input id="dl-web" name="website" type="text" tabindex="-1" autocomplete="off"></div>' +
          '<fieldset class="consent"><legend>[필수] 개인정보 수집·이용 동의</legend>' +
            '<table class="consent-table"><tbody>' +
              '<tr><th scope="row">수집·이용 목적</th><td>안내서 내려받기 제공, 안내서 배포·활용 현황 파악(월별 집계)</td></tr>' +
              '<tr><th scope="row">수집 항목</th><td>이름, 이메일, 소속, 활용 목적, 신청 일시</td></tr>' +
              '<tr><th scope="row">보유·이용 기간</th><td><strong>수집일로부터 2년</strong></td></tr>' +
              '<tr><th scope="row">동의 거부 권리</th><td>동의를 거부하실 수 있습니다. 다만 거부하시면 이 페이지에서 안내서를 내려받으실 수 없습니다.</td></tr>' +
            '</tbody></table>' +
            '<label class="check"><input type="checkbox" name="privacy" required>위 내용을 확인했으며 개인정보 수집·이용에 동의합니다.</label>' +
          '</fieldset>' +
          '<fieldset class="consent"><legend>[선택] 소식 받기 동의</legend>' +
            '<table class="consent-table"><tbody>' +
              '<tr><th scope="row">수집·이용 목적</th><td>마포자원순환네트워크의 활동·행사 소식 이메일 안내</td></tr>' +
              '<tr><th scope="row">수집 항목</th><td>이름, 이메일</td></tr>' +
              '<tr><th scope="row">보유·이용 기간</th><td>수신을 거부하실 때까지</td></tr>' +
              '<tr><th scope="row">동의 거부 권리</th><td>동의하지 않으셔도 안내서는 그대로 내려받으실 수 있습니다.</td></tr>' +
            '</tbody></table>' +
            '<label class="check"><input type="checkbox" name="news">마포자원순환네트워크의 소식을 이메일로 받겠습니다.</label>' +
          '</fieldset>' +
          '<button class="btn lg" type="submit">안내서 받기</button>' +
          '<div class="notice" role="status" tabindex="-1" hidden></div>' +
        '</form>' +
      '</section>' +
      '<div class="nav-row"><a class="more" href="statements.html#docs">← 자료집 목록</a><a class="more" href="join.html">연서명으로 함께하기 →</a></div>';
    var form = el.querySelector('.dl-form'), ready = el.querySelector('.dl-ready'), msg = form.querySelector('.notice');
    function show(kind, text) { msg.className = 'notice ' + kind; msg.textContent = text; msg.hidden = false; msg.focus(); }
    function unlock() {
      form.hidden = true; ready.hidden = false;
      var a = ready.querySelector('a'); if (a) a.focus();
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.website.value) return;
      if (!form.name.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim())) { show('err', '이름과 올바른 이메일을 입력해 주세요.'); return; }
      if (!form.org.value.trim()) { show('err', '소속을 입력해 주세요. 소속이 없으면 ‘개인’이라고 적어 주세요.'); form.org.focus(); return; }
      if (!form.use.value) { show('err', '활용 목적을 골라 주세요.'); form.use.focus(); return; }
      if (!form.privacy.checked) { show('err', '개인정보 수집·이용에 동의해 주셔야 내려받을 수 있습니다.'); return; }
      var data = new URLSearchParams();
      data.append('purpose', '안내서 내려받기');
      data.append('doc', id);
      data.append('name', form.name.value.trim());
      data.append('email', form.email.value.trim());
      data.append('org', form.org.value.trim());
      data.append('use', form.use.value);
      data.append('news', form.news.checked ? '동의' : '미동의');
      data.append('privacy', '동의');
      if (!CFG.FORM_ENDPOINT) { unlock(); return; }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = '보내는 중…';
      fetch(CFG.FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', body: data })
        .then(unlock)
        .catch(function () { btn.disabled = false; btn.textContent = '안내서 받기'; show('err', '전송하지 못했습니다. 잠시 뒤 다시 시도해 주세요.'); });
    });
  }

  /* ---------- 목록 그리기 ---------- */
  var ST = D.static || { news: [], record: [] };
  function newsHref(n) { return ST.news.indexOf(n.id) >= 0 ? '/news/' + encodeURIComponent(n.id) + '.html' : 'post.html#' + encodeURIComponent(n.id); }
  function recHref(id) { return ST.record.indexOf(id) >= 0 ? '/record/' + encodeURIComponent(id) + '.html' : 'record.html#' + encodeURIComponent(id); }
  // 글 주소: 고정 주소 페이지는 data-id, 예전 post.html#아이디 주소는 해시에서 읽습니다.
  function pageId() { return document.body.getAttribute('data-id') || decodeURIComponent((location.hash || '').slice(1)); }
  // 상세 페이지가 있는 소식만 링크를 겁니다(본문·상세정보·관련 링크가 있을 때).
  function hasDetail(n) { return !!((n.body && n.body.length) || (n.info && n.info.length) || n.link || isUpcoming(n)); }
  var R = {
    'news-cards': function (el) {
      var n = parseInt(el.getAttribute('data-limit') || '3', 10);
      el.innerHTML = (D.news || []).filter(function (x) { return !isUpcoming(x); }).slice(0, n).map(function (x, i) {
        return '<article class="card">' + photoTag(x.photo, 'card-img', '') + '<div class="meta"><span class="badge">' + esc(x.cat) + '</span><span>' + esc(x.date) + '</span></div>' +
          '<h3>' + esc(x.title) + '</h3><p>' + esc(x.text) + '</p>' + (hasDetail(x) ? '<a class="more" href="' + newsHref(x) + '">자세히 보기</a>' : '') + '</article>';
      }).join('');
    },
    'activity-rows': function (el) {
      var n = parseInt(el.getAttribute('data-limit') || '4', 10);
      el.innerHTML = (D.activities || []).slice(0, n).map(function (a) {
        return '<article class="row"><h3>' + esc(a.title) + '</h3><div><p>' + esc(a.text) + '</p><a class="more"' + (a.link ? linkAttrs(a.link) : ' href="activities.html"') + '>' + (a.link ? '자세히 보기' : '활동 보기') + '</a></div></article>';
      }).join('');
    },
    'activity-cards': function (el) {
      el.innerHTML = (D.activities || []).map(function (a) {
        return '<article class="card">' + photoTag(a.photo, 'card-img', '') + '<div class="meta"><span class="badge">' + esc(a.status) + '</span>' + (a.period ? '<span>' + esc(a.period) + '</span>' : '') + '</div>' +
          '<h3>' + esc(a.title) + '</h3><p>' + esc(a.text) + '</p>' + (a.meta ? '<p class="foot">' + esc(a.meta) + '</p>' : '') + '</article>';
      }).join('');
    },
    'doc-list': function (el) {
      var list = D[el.getAttribute('data-key')] || [];
      var lim = parseInt(el.getAttribute('data-limit') || '99', 10);
      el.innerHTML = list.slice(0, lim).map(function (s) {
        var inner = '<span class="d">' + esc([s.date, s.kind].filter(Boolean).join(' · ')) + '</span><span class="t">' + esc(s.title) + '</span>';
        var ext0 = s.href && s.href !== '#' ? safeHref(s.href) : '';
        var hasPage = !!(s.id && ((D.gated || {})[s.id] || (s.body && s.body.length) || s.summary || s.file || s.photo));
        if (!hasPage && !ext0) return '<li><span class="nolink">' + inner + '</span></li>';
        var href = hasPage ? recHref(s.id) : ext0;
        var ext = !hasPage && /^https?:/.test(href);
        return '<li><a href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + inner + '</a></li>';
      }).join('');
    },
    'history': function (el) {
      el.innerHTML = (D.history || []).map(function (h) { return '<li><b>' + esc(h.date) + '</b><span>' + esc(h.text).replace(/\n/g, '<br>') + '</span></li>'; }).join('');
    },
    'org-chips': function (el) {
      el.innerHTML = (D.orgs || []).map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') +
        '<li class="extra">그리고 개인 ' + esc(D.persons || 0) + '명</li>';
    },
    'activity-board': function (el) {
      var I = {
        '정책전환': '<path d="M4 7h13l-3-3M17 7l-3 3M20 17H7l3-3M7 17l3 3"/>',
        '연대 확장': '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M15.5 14.2c3 0 5.5 1.6 5.5 4.8"/>',
        '시민행동': '<path d="M3 11v2a1 1 0 001 1h2l5 4V6L6 10H4a1 1 0 00-1 1zM15 9a4 4 0 010 6M18 6.5a8 8 0 010 11"/>',
        '도시선언': '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'
      };
      function ico(c) { return '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (I[c] || '') + '</svg>'; }
      var M = [['정책전환', 'm-policy', 'policy', '소각 중심 행정에서 감량 중심 정책으로 전환합니다.'],
               ['연대 확장', 'm-solidarity', 'solidarity', '자치구 연대로 서울자원순환네트워크를 구축합니다.'],
               ['시민행동', 'm-action', 'action', '시민의 실천을 모아 정책에 반영합니다.'],
               ['도시선언', 'm-declare', 'declare', '지속가능한 서울의 미래를 위한 제로웨이스트 도시를 선언합니다.']];
      function key(a) {
        var m = String(a.period || '').match(/(\d{4})(?:\.(\d{1,2}))?(?:\.(\d{1,2}))?/);
        return m ? (+m[1]) * 10000 + (+m[2] || 0) * 100 + (+m[3] || 0) : 0;
      }
      // 기간이 늦은 것부터(내림차순). 같으면 시트에 적은 순서를 지킵니다.
      var acts = (D.activities || []).map(function (a, i) { return { a: a, i: i, k: key(a) }; })
        .sort(function (x, y) { return y.k - x.k || x.i - y.i; }).map(function (x) { return x.a; });
      function cat(a) { return a.cat || a.status; }
      function find(c) { return M.filter(function (m) { return m[0] === c; })[0]; }
      var sel = '';
      (function () { var h = (location.hash || '').slice(1); M.forEach(function (m) { if (m[1] === h) sel = m[0]; }); })();
      function draw() {
        var tabs = '<div class="tabs mtabs" role="group" aria-label="미션별 활동 보기"><button type="button" data-m="" aria-pressed="' + (sel === '' ? 'true' : 'false') + '">전체</button>' +
          M.map(function (m) { return '<button type="button" data-m="' + esc(m[0]) + '" aria-pressed="' + (sel === m[0] ? 'true' : 'false') + '">' + ico(m[0]) + esc(m[0]) + '</button>'; }).join('') + '</div>';
        var list = acts.filter(function (a) { return !sel || cat(a) === sel; });
        var cur = find(sel);
        var panel = cur
          ? '<div class="mission-panel c-' + cur[2] + '"><span class="cat-ico c-' + cur[2] + '">' + ico(cur[0]) + '</span><div><small>미션 0' + (M.indexOf(cur) + 1) + '</small><h3>' + esc(cur[0]) + '</h3><p>' + esc(cur[3]) + '</p><em>이 미션의 활동 ' + list.length + '건</em></div></div>'
          : '<div class="mission-panel"><div><small>네트워크의 네 가지 미션</small><h3>전체 활동</h3><p>미션을 고르면 그 미션의 설명과 해당 활동만 볼 수 있습니다.</p><em>활동 ' + list.length + '건 · 최근 순</em></div></div>';
        var cards = list.map(function (a) {
          var m = find(cat(a)), src = photoList(a.photo)[0];
          var tag = m ? '<span class="cat-tag c-' + m[2] + '"><span class="cat-ico c-' + m[2] + '">' + ico(m[0]) + '</span>' + esc(m[0]) + '</span>' : '';
          return '<article class="card act' + (src ? ' has-photo' : '') + '">' + (src ? photoTag(a.photo, 'card-img', '') : '') + tag +
            (a.period ? '<div class="meta"><span>' + esc(a.period) + '</span></div>' : '') +
            '<h3>' + esc(a.title) + '</h3><p>' + esc(a.text) + '</p>' + (a.meta ? '<p class="foot">' + esc(a.meta) + '</p>' : '') + (a.link ? '<a class="more"' + linkAttrs(a.link) + '>자세히 보기</a>' : '') + '</article>';
        }).join('') || '<p class="muted">준비 중인 활동입니다.</p>';
        el.innerHTML = tabs + panel + '<div class="grid" style="margin-top:28px">' + cards + '</div>';
      }
      el.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-m]');
        if (!b) return;
        sel = b.getAttribute('data-m');
        var m = find(sel);
        try { history.replaceState(null, '', m ? '#' + m[1] : location.pathname + location.search); } catch (x) {}
        draw();
        var nb = el.querySelector('button[aria-pressed="true"]'); if (nb) nb.focus();
      });
      draw();
    },
    'org-logos': function (el) {
      var L = D.logos || {};
      el.innerHTML = (D.orgs || []).map(function (o) {
        var src = photoSrc(L[o]);
        return '<li>' + (src ? '<span class="logo-box"><img src="' + esc(src) + '" alt="' + esc(o) + ' 로고" loading="lazy" onerror="this.parentNode.classList.add(\'no-img\');this.remove()"></span>' : '<span class="logo-box no-img"></span>') +
          '<span class="logo-name">' + esc(o) + '</span></li>';
      }).join('');
    },
    'org-grid': function (el) {
      el.innerHTML = (D.orgs || []).map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('');
    },
    'record': function (el) {
      var id = pageId();
      var groups = [['statements', '성명·논평', '#statements'], ['docs', '자료집', '#docs'], ['press', '언론 보도', '#press']];
      var n, g;
      groups.forEach(function (gr) { (D[gr[0]] || []).forEach(function (x) { if (!n && x.id === id) { n = x; g = gr; } }); });
      var G = (D.gated || {})[id];
      if (G) { renderGated(el, id, n || {}, G); return; }
      if (!n) { el.innerHTML = '<p class="muted">찾는 글이 없습니다. <a href="statements.html">목소리와 기록 목록</a>으로 돌아가 주세요.</p>'; return; }
      document.title = n.title + ' - 마포자원순환네트워크';
      var body = (n.body && n.body.length ? n.body : (n.summary ? [n.summary] : [])).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
      var more = photoList(n.photo).slice(1).map(function (src) { return '<img src="' + esc(src) + '" alt="" loading="lazy" onerror="this.remove()">'; }).join('');
      var btns = '';
      if (n.file) btns += '<a class="btn lg" href="' + esc(safeHref(n.file)) + '" target="_blank" rel="noopener">자료 내려받기</a>';
      if (n.href && n.href !== '#') btns += '<a class="btn lg ghost" href="' + esc(safeHref(n.href)) + '" target="_blank" rel="noopener">' + (g[0] === 'press' ? '기사 원문 보기' : '원문 보기') + '</a>';
      el.innerHTML = '<nav aria-label="위치" class="muted"><a href="statements.html">목소리와 기록</a> › <a href="statements.html' + g[2] + '">' + g[1] + '</a></nav>' +
        '<div class="meta" style="margin-top:28px"><span class="badge">' + esc(n.kind) + '</span><span>' + esc(n.date) + '</span></div>' +
        '<h1>' + esc(n.title) + '</h1>' + photoTag(n.photo, 'post-img', n.title) +
        '<div class="body">' + body + '</div>' + (more ? '<div class="gallery">' + more + '</div>' : '') +
        (btns ? '<div class="guide-actions">' + btns + '</div>' : '') +
        '<div class="nav-row"><a class="more" href="statements.html' + g[2] + '">← 목록으로</a><a class="more" href="join.html">연서명으로 함께하기 →</a></div>';
    },
    'guide': function (el) {
      var g = D.guide || {};
      var cover = el.querySelector('[data-guide-cover]');
      var src = photoSrc(g.cover);
      if (cover && src) {
        var im = new Image();
        im.alt = '『제로 웨이스트 도시를 위한 안내서』 공식 한국어판 표지';
        im.onload = function () { cover.innerHTML = ''; cover.appendChild(im); cover.classList.add('has-img'); };
        im.src = src;
      }
      var dl = el.querySelector('[data-guide-download]');
      if (dl) { if (g.download) { dl.href = safeHref(g.download); dl.hidden = false; } else dl.hidden = true; }
      var ab = el.querySelector('[data-guide-about]');
      if (ab) { if (g.about) { ab.href = safeHref(g.about); ab.hidden = false; } else ab.hidden = true; }
    },
    'count-orgs': function (el) { el.textContent = (D.orgs || []).length + '곳'; },
    'count-persons': function (el) { el.textContent = (D.persons || 0) + '명'; },
    'partners': function (el) {
      el.innerHTML = (D.partners || []).map(function (p) { return '<div><h3>' + esc(p.name) + '</h3><p>' + esc(p.role) + '</p></div>'; }).join('');
    },
    'upcoming': function (el) {
      var u = (D.news || []).filter(isUpcoming).sort(function (x, y) {
        var a = parseWhen(x), b = parseWhen(y);
        return (a ? a.start : Infinity) - (b ? b.start : Infinity);
      });
      var sec = el.closest('section');
      if (sec) sec.hidden = !u.length;
      if (!u.length) { el.innerHTML = ''; return; }
      var WD = ['일', '월', '화', '수', '목', '금', '토'];
      el.innerHTML = u.map(function (x) {
        var w = parseWhen(x), day, time;
        if (w) {
          day = w.mo + '월 ' + w.d + '일 (' + WD[new Date(Date.UTC(w.y, w.mo - 1, w.d)).getUTCDay()] + ')';
          var h = w.h, mi = w.mi, ok = w.hasTime;
          if (!ok) { // 일시 칸이 없으면 안내의 ‘일시’ 줄에서 시간을 찾습니다 (오전 11시 / 14:30)
            var row = (x.info || []).filter(function (r) { return r[0] === '일시'; })[0], t = row && String(row[1]);
            var k = t && (t.match(/(오전|오후)\s*(\d{1,2})\s*시(?:\s*(\d{1,2})\s*분)?/) || null);
            if (k) { h = (+k[2] % 12) + (k[1] === '오후' ? 12 : 0); mi = +k[3] || 0; ok = true; }
            else if (t && (k = t.match(/(\d{1,2}):(\d{2})/))) { h = +k[1]; mi = +k[2]; ok = true; }
          }
          time = ok ? (h < 12 ? '오전 ' : '오후 ') + (h % 12 || 12) + '시' + (mi ? ' ' + mi + '분' : '') : '';
        } else { day = x.date; time = '일시 확정 예정'; }
        var place = (x.info || []).filter(function (r) { return r[0] === '장소'; })[0];
        return '<a class="upcoming" href="' + newsHref(x) + '"><div class="when">' + esc(day) + '<small>' + esc(time) + '</small></div>' +
          '<div class="what"><strong>' + esc(x.title) + '</strong><span>' + esc(x.text) + '</span>' + (place ? '<span class="where">장소 · ' + esc(place[1]) + '</span>' : '') + '</div><span>자세히 보기 →</span></a>';
      }).join('');
    },
    'news-timeline': function (el) {
      var cat = el.getAttribute('data-cat') || '';
      var groups = { '사업': ['사업', '활동'], '입장': ['입장'], '연대': ['연대'], '행사': ['행사', '토론회', '수상', '기자회견'] };
      var list = (D.news || []).filter(function (n) { return !isUpcoming(n) && (!cat || (groups[cat] || [cat]).indexOf(n.cat) >= 0); });
      el.innerHTML = list.map(function (n) {
        return '<li><div class="when"><b>' + esc(n.date) + '</b><span class="badge">' + esc(n.cat) + '</span></div><div class="what"><h3>' + (hasDetail(n) ? '<a href="' + newsHref(n) + '">' + esc(n.title) + '</a>' : esc(n.title)) + '</h3>' + (n.text ? '<p>' + esc(n.text) + '</p>' : '') + '</div></li>';
      }).join('') || '<li><p class="muted">해당하는 소식이 없습니다.</p></li>';
    },
    'post': function (el) {
      var id = pageId();
      var list = D.news || [];
      var n = list.filter(function (x) { return x.id === id; })[0] || list[0];
      if (!n) return;
      document.title = n.title + ' - 마포자원순환네트워크';
      var body = (n.body && n.body.length ? n.body : [n.text]).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
      var info = n.info ? '<dl>' + n.info.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>' : '';
      var more = photoList(n.photo).slice(1).map(function (src) { return '<img src="' + esc(src) + '" alt="" loading="lazy" onerror="this.remove()">'; }).join('');
      el.innerHTML = '<nav aria-label="위치" class="muted"><a href="news.html">소식·일정</a> › ' + esc(n.cat) + '</nav>' +
        '<div class="meta" style="margin-top:28px"><span class="badge">' + esc(isUpcoming(n) ? '일정' : n.cat) + '</span><span>' + esc(n.date) + ' · 마포자원순환네트워크</span></div>' +
        '<h1>' + esc(n.title) + '</h1>' + photoTag(n.photo, 'post-img', n.title) + info + '<div class="body">' + body + '</div>' + (more ? '<div class="gallery">' + more + '</div>' : '') +
        (n.link ? '<div class="guide-actions"><a class="btn lg"' + linkAttrs(n.link) + '>' + esc(n.linkText || '자세한 소식') + '</a></div>' : '') +
        '<div class="nav-row"><a class="more" href="news.html">← 소식 목록</a><a class="more" href="join.html">연서명으로 함께하기 →</a></div>';
    }
  };
  function renderAll() {
    document.querySelectorAll('[data-render]').forEach(function (el) {
      var f = R[el.getAttribute('data-render')];
      if (f) f(el);
    });
  }

  /* ---------- 소식 분류 버튼 ---------- */
  function bindFilters() {
    document.querySelectorAll('.filters').forEach(function (box) {
      var target = document.getElementById(box.getAttribute('data-target'));
      box.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        box.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        target.setAttribute('data-cat', b.getAttribute('data-cat') || '');
        R['news-timeline'](target);
      });
    });
  }

  /* ---------- 연서명 신청 ---------- */
  function bindForm() {
    var form = document.getElementById('join-form');
    if (!form) return;
    var msg = document.getElementById('join-msg');
    function show(kind, text) { msg.className = 'notice ' + kind; msg.textContent = text; msg.hidden = false; msg.focus(); }
    var label = document.getElementById('f-msg-label');
    function syncPurpose() {
      var p = form.purpose.value === '현장·활동 제안';
      label.textContent = p ? '제안 내용 — 어떤 현장에서 무엇을 함께하고 싶으신가요?' : '함께하고 싶은 활동이나 한마디 (선택)';
    }
    form.addEventListener('change', function (e) { if (e.target.name === 'purpose') syncPurpose(); });
    function fromHash() {
      if (location.hash === '#propose') {
        form.querySelector('input[name=purpose][value="현장·활동 제안"]').checked = true;
        syncPurpose();
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    fromHash();
    window.addEventListener('hashchange', fromHash);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.website && form.website.value) return; // 스팸 방지용 숨은 칸
      if (!form.name.value.trim() || !form.email.value.trim()) { show('err', '이름과 이메일을 입력해 주세요.'); return; }
      if (!form.privacy.checked) { show('err', '개인정보 수집·이용에 동의해 주셔야 신청할 수 있습니다.'); return; }
      var data = new URLSearchParams();
      ['purpose', 'kind', 'name', 'contact', 'tel', 'email', 'message'].forEach(function (k) { data.append(k, (form[k] && form[k].value || '').trim()); });
      data.append('publish', form.publish.checked ? '동의' : '미동의');
      data.append('privacy', '동의');
      var btn = form.querySelector('button[type="submit"]');
      var propose = form.purpose.value === '현장·활동 제안';
      if (!CFG.FORM_ENDPOINT) {
        show('ok', '미리보기 화면이라 실제로 전송되지는 않았습니다. 사이트를 공개하면 ' + (propose ? '제안' : '신청') + ' 내용이 드라이브 시트에 저장되고 담당자에게 알림 메일이 갑니다.');
        return;
      }
      btn.disabled = true; btn.textContent = '보내는 중…';
      fetch(CFG.FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', body: data })
        .then(function () { form.reset(); show('ok', (propose ? '제안해' : '신청해') + ' 주셔서 고맙습니다. 운영위원이 확인한 뒤 연락드리겠습니다.'); })
        .catch(function () { show('err', '전송하지 못했습니다. 잠시 뒤 다시 시도하시거나 mapozerowaste@gmail.com 으로 알려 주세요.'); })
        .then(function () { btn.disabled = false; btn.textContent = '보내기'; });
    });
  }

  /* ---------- 맨 위로 버튼 ---------- */
  function addTopButton() {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'to-top';
    b.setAttribute('aria-label', '맨 위로');
    b.innerHTML = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14l6-6 6 6"/></svg>TOP';
    b.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      var skip = document.querySelector('.logo');
      if (skip) skip.focus({ preventScroll: true });
    });
    document.body.appendChild(b);
    function sync() { b.classList.toggle('show', window.scrollY > 400); }
    window.addEventListener('scroll', sync, { passive: true });
    sync();
  }

  renderChrome();
  renderAll();
  bindFilters();
  bindForm();
  addTopButton();
  // 예전 주소(post.html#아이디, record.html#아이디)는 고정 주소 페이지로 보냅니다.
  (function () {
    if (document.body.getAttribute('data-id')) return;
    var id = decodeURIComponent((location.hash || '').slice(1));
    if (!id) return;
    var dir = /post\.html$/.test(location.pathname) ? 'news' : /record\.html$/.test(location.pathname) ? 'record' : '';
    if (dir && ST[dir].indexOf(id) >= 0) location.replace('/' + dir + '/' + encodeURIComponent(id) + '.html');
  })();
  window.addEventListener('hashchange', function () {
    if (document.body.getAttribute('data-id')) return;
    var p = document.querySelector('[data-render="post"]'); if (p) R.post(p);
    var r = document.querySelector('[data-render="record"]'); if (r) { R.record(r); window.scrollTo(0, 0); }
  });
  loadAll().then(function () { if (CFG.SHEET_ID) renderAll(); window.__mzReady = true; });
})();
