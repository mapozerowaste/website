"""정적 미리 그리기: 크롬으로 페이지를 한 번 열어 완성된 머리글·본문·바닥글을 HTML에 직접 넣습니다.
검색엔진은 자바스크립트를 기다리지 않을 수 있어, 처음부터 글자가 들어 있게 하려는 것입니다.
사람이 열면 site.js가 시트 값으로 다시 그리므로 화면은 그대로입니다.
사용: python3 tools/site.py && python3 tools/prerender.py   (site.py를 먼저 돌려야 함)
"""
import os, re, subprocess, sys, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_sp = os.path.join(ROOT, 'tools', '.static_pages.txt')
PAGES = sys.argv[1:] or (['index.html', 'about.html', 'activities.html', 'statements.html', 'news.html', 'people.html', 'join.html'] + (open(_sp).read().split() if os.path.exists(_sp) else []))
PORT = 8791

srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT)], cwd=ROOT,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get('CHROME_PATH', '/usr/bin/google-chrome'), args=['--no-sandbox'])
        for fname in PAGES:
            pg = b.new_page(viewport={'width': 1200, 'height': 900})
            pg.route(re.compile(r'https://(docs\.google\.com|script\.google\.com|gc\.zgo\.at|mapozerowaste\.goatcounter\.com)/.*'), lambda r: r.abort())
            pg.goto(f'http://localhost:{PORT}/{fname}')
            pg.wait_for_timeout(1500)
            # 곧 열리는 일정 구역은 시간이 지나면 바뀌므로 숨기고 비워 둠(열면 site.js가 다시 계산)
            pg.evaluate("['home-upcoming','upcoming-sec'].forEach(function(i){var u=document.getElementById(i); if(u){u.hidden=true; var d=u.querySelector('[data-render=upcoming]'); if(d) d.innerHTML='';}})")
            parts = pg.evaluate("""() => ({
              header: document.getElementById('site-header').innerHTML,
              main: document.getElementById('main').innerHTML,
              footer: document.getElementById('site-footer').innerHTML,
              hcls: document.getElementById('site-header').className,
              fcls: document.getElementById('site-footer').className })""")
            pg.close()
            path = os.path.join(ROOT, fname)
            html = open(path, encoding='utf-8').read()
            html, n1 = re.subn(r'<header id="site-header"[^>]*></header>', lambda m: f'<header id="site-header" class="{parts["hcls"]}">{parts["header"]}</header>', html, count=1)
            html, n2 = re.subn(r'<main id="main">.*?</main>', lambda m: f'<main id="main">\n{parts["main"]}\n</main>', html, count=1, flags=re.S)
            html, n3 = re.subn(r'<footer id="site-footer"[^>]*></footer>', lambda m: f'<footer id="site-footer" class="{parts["fcls"]}">{parts["footer"]}</footer>', html, count=1)
            assert (n1, n2, n3) == (1, 1, 1), (fname, n1, n2, n3)
            open(path, 'w', encoding='utf-8').write(html)
            print('prerendered', fname, len(parts['main']), 'chars')
        b.close()
finally:
    srv.kill()
