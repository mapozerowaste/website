"""고정 주소(정적) 페이지를 만들 글의 아이디 목록을 계산합니다. build_data.py와 sync_sheet.py가 함께 씁니다."""
import re

SAFE = re.compile(r'^[0-9A-Za-z가-힣_-]+$')   # 파일 이름·주소로 안전한 아이디만


def static_lists(D):
    news = [n['id'] for n in D.get('news', [])
            if n.get('id') and SAFE.match(n['id']) and (n.get('body') or n.get('info') or n.get('link') or n.get('upcoming'))]
    rec = []
    for k in ('statements', 'docs', 'press'):
        for x in D.get(k, []):
            if x.get('id') and SAFE.match(x['id']) and (x.get('body') or x.get('summary') or x.get('file') or x.get('photo')):
                rec.append(x['id'])
    rec += [g for g in (D.get('gated') or {}) if SAFE.match(g)]
    # 순서 유지하며 중복 제거
    seen = set(); rec = [i for i in rec if not (i in seen or seen.add(i))]
    return dict(news=news, record=rec)
