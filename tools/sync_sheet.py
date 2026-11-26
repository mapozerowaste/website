"""구글 시트 내용을 읽어 assets/data.js에 굳힙니다(검색엔진이 읽는 정적 페이지가 시트를 따라가게 하려는 것).
순서: build_data.py(기본값) → sync_sheet.py(시트 합치기) → site.py → prerender.py
사이트의 site.js가 시트를 합치는 방식을 그대로 쓰기 위해, 크롬으로 홈을 열어 합쳐진 데이터를 꺼냅니다.
시트를 읽지 못하면(성공한 탭이 5개 미만) 아무것도 바꾸지 않고 오류로 끝냅니다.
환경변수 SHEET_MOCK_DIR 가 있으면 그 폴더의 <탭이름>.csv 로 시트를 대신합니다(시험용).
"""
import json, os, re, subprocess, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from static_ids import static_lists
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from browser import launch_opts
from playwright.sync_api import sync_playwright
from urllib.parse import unquote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8792
MOCK = os.environ.get('SHEET_MOCK_DIR')

srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT)], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(**launch_opts())
        pg = b.new_page()
        if MOCK:
            def mock(route):
                tab = re.search(r'sheet=([^&]+)', route.request.url)
                f = os.path.join(MOCK, unquote(tab.group(1)) + '.csv') if tab else ''
                if f and os.path.exists(f):
                    route.fulfill(status=200, content_type='text/csv; charset=utf-8', body=open(f, encoding='utf-8').read())
                else:
                    route.abort()
            pg.route(re.compile(r'https://docs\.google\.com/.*'), mock)
        pg.route(re.compile(r'https://(gc\.zgo\.at|mapozerowaste\.goatcounter\.com|script\.google\.com)/.*'), lambda r: r.abort())
        pg.goto(f'http://localhost:{PORT}/index.html')
        pg.wait_for_function('window.__mzReady === true', timeout=60000)
        ok = pg.evaluate('window.__mzSheetOk || 0')
        data = pg.evaluate('JSON.stringify(window.MZ_DATA)')
        b.close()
finally:
    srv.kill()

if ok < 5:
    print(f'시트를 충분히 읽지 못했습니다(성공한 탭 {ok}개). data.js를 바꾸지 않습니다.', file=sys.stderr)
    sys.exit(1)
D = json.loads(data)
D['static'] = static_lists(D)
for k in ('news', 'statements', 'docs', 'press'):   # 화면용 보조 값 정리
    for x in D.get(k, []):
        x.pop('_hide', None)
open(os.path.join(ROOT, 'assets/data.js'), 'w', encoding='utf-8').write(
    '// 기본 콘텐츠에 구글 시트 내용을 합쳐 굳힌 값입니다(tools/sync_sheet.py). 시트가 바뀌면 다시 만들어집니다.\nwindow.MZ_DATA = ' + json.dumps(D, ensure_ascii=False, indent=1) + ';\n')
print(f'synced: 시트 탭 {ok}개 읽음, 소식 {len(D["news"])}건, 고정 주소 {len(D["static"]["news"])}+{len(D["static"]["record"])}개')
