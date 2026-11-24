/* 마포자원순환네트워크 — 공통 머리글·바닥글, 콘텐츠 표시, 연서명 신청 */
(function () {
  var CFG = window.MZ_CONFIG || {};
  var D = window.MZ_DATA || {};
  var DEFAULT_CAT = {};
  (D.activities || []).forEach(function (x) { if (x.cat) DEFAULT_CAT[x.title] = x.cat; });
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
    return /^(https?:|mailto:|#|[a-z0-9_-]+\.html)/i.test(h) ? h : '#';
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
    news: ['소식', { id: '아이디', date: '날짜', cat: '분류', title: '제목', text: '요약', body: '본문', info: '안내', photo: '사진', upcoming: '예정' }],
    activities: ['활동', { cat: '구분', status: '상태', period: '기간', title: '사업명', text: '설명', meta: '함께한곳', photo: '사진' }],
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
      if (key === 'activities') out.forEach(function (a) { if (!a.cat) a.cat = DEFAULT_CAT[a.title] || ''; });
      if (key === 'statements' || key === 'docs' || key === 'press') out.forEach(function (n, i) {
        n.body = n.body ? n.body.split(/\n\s*\n|\n/) : null;
        if (!n.id) n.id = key + '-' + (i + 1);
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
      return loadSheet(k).catch(function () { /* 시트를 못 읽으면 기본 내용을 그대로 씁니다 */ });
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
  function photoList(v) {
    return String(v || '').split(/[\n,]+/).map(function (x) { return photoSrc(x); }).filter(Boolean);
  }
  function photoTag(v, cls, alt) {
    var src = photoList(v)[0];
    return src ? '<img class="' + cls + '" src="' + esc(src) + '" alt="' + esc(alt || '') + '" loading="lazy" onerror="this.remove()">' : '';
  }

  /* ---------- 목록 그리기 ---------- */
  function newsHref(n) { return 'post.html#' + encodeURIComponent(n.id); }
  var R = {
    'news-cards': function (el) {
      var n = parseInt(el.getAttribute('data-limit') || '3', 10);
      el.innerHTML = (D.news || []).slice(0, n).map(function (x, i) {
        return '<article class="card' + (x.upcoming ? ' feature' : '') + '">' + photoTag(x.photo, 'card-img', '') + '<div class="meta"><span class="badge">' + esc(x.upcoming ? '곧 열려요' : x.cat) + '</span><span>' + esc(x.date) + '</span></div>' +
          '<h3>' + esc(x.title) + '</h3><p>' + esc(x.text) + '</p><a class="more" href="' + newsHref(x) + '">자세히 보기</a></article>';
      }).join('');
    },
    'activity-rows': function (el) {
      var n = parseInt(el.getAttribute('data-limit') || '4', 10);
      el.innerHTML = (D.activities || []).slice(0, n).map(function (a) {
        return '<article class="row"><h3>' + esc(a.title) + '</h3><div><p>' + esc(a.text) + '</p><a class="more" href="activities.html">활동 보기</a></div></article>';
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
        var href = s.id ? 'record.html#' + encodeURIComponent(s.id) : safeHref(s.href);
        var ext = !s.id && /^https?:/.test(href);
        return '<li><a href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '><span class="d">' + esc([s.date, s.kind].filter(Boolean).join(' · ')) + '</span><span class="t">' + esc(s.title) + '</span></a></li>';
      }).join('');
    },
    'history': function (el) {
      el.innerHTML = (D.history || []).map(function (h) { return '<li><b>' + esc(h.date) + '</b><span>' + esc(h.text).replace(/\n/g, '<br>') + '</span></li>'; }).join('');
    },
    'org-chips': function (el) {
      el.innerHTML = (D.orgs || []).map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') +
        '<li class="extra">그리고 개인 ' + esc(D.persons || 0) + '명</li>';
    },
    'activity-groups': function (el) {
      var M = [['정책전환', 'm-policy', '소각 중심 행정에서 감량 중심 정책으로 전환합니다.'],
               ['연대 확장', 'm-solidarity', '자치구 연대로 서울자원순환네트워크를 구축합니다.'],
               ['시민행동', 'm-action', '시민의 실천을 모아 정책에 반영합니다.'],
               ['도시선언', 'm-declare', '지속가능한 서울의 미래를 위한 제로웨이스트 도시를 선언합니다.']];
      var acts = D.activities || [];
      el.innerHTML = M.map(function (m, i) {
        var list = acts.filter(function (a) { return (a.cat || a.status) === m[0]; });
        var cards = list.map(function (a) {
          return '<article class="card">' + photoTag(a.photo, 'card-img', '') + (a.period ? '<div class="meta"><span>' + esc(a.period) + '</span></div>' : '') +
            '<h3>' + esc(a.title) + '</h3><p>' + esc(a.text) + '</p>' + (a.meta ? '<p class="foot">' + esc(a.meta) + '</p>' : '') + '</article>';
        }).join('') || '<p class="muted">준비 중인 활동입니다.</p>';
        return '<section class="mission-group" id="' + m[1] + '"><div class="mission-head"><b>0' + (i + 1) + '</b><h3>' + m[0] + '</h3><p>' + m[2] + '</p></div>' +
          '<div class="grid" style="margin-top:20px">' + cards + '</div></section>';
      }).join('');
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
      var id = decodeURIComponent((location.hash || '').slice(1));
      var groups = [['statements', '성명·논평', '#statements'], ['docs', '자료집', '#docs'], ['press', '언론 보도', '#press']];
      var n, g;
      groups.forEach(function (gr) { (D[gr[0]] || []).forEach(function (x) { if (!n && x.id === id) { n = x; g = gr; } }); });
      if (!n) { el.innerHTML = '<p class="muted">찾는 글이 없습니다. <a href="statements.html">목소리와 기록 목록</a>으로 돌아가 주세요.</p>'; return; }
      document.title = n.title + ' - 마포자원순환네트워크';
      var body = (n.body && n.body.length ? n.body : (n.summary ? [n.summary] : [])).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
      if (!body) body = '<p class="muted">[본문을 넣어 주세요]</p>';
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
      var u = (D.news || []).filter(function (n) { return n.upcoming; });
      var sec = el.closest('section');
      if (sec) sec.hidden = !u.length;
      if (!u.length) { el.innerHTML = ''; return; }
      el.innerHTML = u.map(function (x) {
        return '<a class="upcoming" href="' + newsHref(x) + '"><div class="when">' + esc(x.date) + '<small>일시 확정 예정</small></div>' +
          '<div class="what"><strong>' + esc(x.title) + '</strong><span>' + esc(x.text) + '</span></div><span>자세히 보기 →</span></a>';
      }).join('');
    },
    'news-timeline': function (el) {
      var cat = el.getAttribute('data-cat') || '';
      var groups = { '사업': ['사업', '활동'], '입장': ['입장'], '연대': ['연대'], '행사': ['행사', '토론회', '수상'] };
      var list = (D.news || []).filter(function (n) { return !n.upcoming && (!cat || (groups[cat] || [cat]).indexOf(n.cat) >= 0); });
      el.innerHTML = list.map(function (n) {
        return '<li><div class="when"><b>' + esc(n.date) + '</b><span class="badge">' + esc(n.cat) + '</span></div><div class="what"><h3><a href="' + newsHref(n) + '">' + esc(n.title) + '</a></h3>' + (n.text ? '<p>' + esc(n.text) + '</p>' : '') + '</div></li>';
      }).join('') || '<li><p class="muted">해당하는 소식이 없습니다.</p></li>';
    },
    'post': function (el) {
      var id = decodeURIComponent((location.hash || '').slice(1));
      var list = D.news || [];
      var n = list.filter(function (x) { return x.id === id; })[0] || list[0];
      if (!n) return;
      document.title = n.title + ' - 마포자원순환네트워크';
      var body = (n.body && n.body.length ? n.body : [n.text]).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
      var info = n.info ? '<dl>' + n.info.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>' : '';
      var more = photoList(n.photo).slice(1).map(function (src) { return '<img src="' + esc(src) + '" alt="" loading="lazy" onerror="this.remove()">'; }).join('');
      el.innerHTML = '<nav aria-label="위치" class="muted"><a href="news.html">소식·일정</a> › ' + esc(n.cat) + '</nav>' +
        '<div class="meta" style="margin-top:28px"><span class="badge">' + esc(n.upcoming ? '일정' : n.cat) + '</span><span>' + esc(n.date) + ' · 마포자원순환네트워크</span></div>' +
        '<h1>' + esc(n.title) + '</h1>' + photoTag(n.photo, 'post-img', n.title) + info + '<div class="body">' + body + '</div>' + (more ? '<div class="gallery">' + more + '</div>' : '') +
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
  window.addEventListener('hashchange', function () {
    var p = document.querySelector('[data-render="post"]'); if (p) R.post(p);
    var r = document.querySelector('[data-render="record"]'); if (r) { R.record(r); window.scrollTo(0, 0); }
  });
  loadAll().then(function () { if (CFG.SHEET_ID) renderAll(); });
})();
