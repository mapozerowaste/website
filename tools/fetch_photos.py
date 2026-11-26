"""시트의 사진 칸에 적힌 구글 드라이브 링크를 내려받아 줄인 뒤 assets/photos/drive/<파일ID>.jpg 로 저장합니다.
- '링크가 있는 모든 사용자 보기'로 공유된 파일만 받을 수 있습니다. 못 받으면 건너뛰고(오류로 끝내지 않음) 사이트는 드라이브 링크를 그대로 씁니다.
- 이미 받은 파일은 다시 받지 않습니다. 다시 받고 싶으면 해당 파일을 지우거나 환경변수 PHOTO_REFRESH=1.
- 결과(파일ID → 저장 경로)를 assets/data.js 의 driveLocal 에 적어 site.js·site.py 가 씁니다.
- 순서: build_data → sync_sheet → fetch_photos → site → prerender
- 시험용: PHOTO_MOCK_DIR 폴더의 <파일ID>.* 를 내려받기 대신 씁니다.
"""
import glob, io, json, os, re, sys, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets/photos/drive')
MAX_W, MAX_BYTES, MAX_NEW = 1600, 500 * 1024, 80
ID_RE = [re.compile(r'/d/([\w-]{20,})'), re.compile(r'[?&]id=([\w-]{20,})')]
MOCK = os.environ.get('PHOTO_MOCK_DIR')
REFRESH = os.environ.get('PHOTO_REFRESH') == '1'

try:
    from PIL import Image, ImageOps
except ImportError:
    print('Pillow가 없어 사진 내려받기를 건너뜁니다.', file=sys.stderr); sys.exit(0)

p = os.path.join(ROOT, 'assets/data.js')
src = open(p, encoding='utf-8').read()
D = json.loads(re.search(r'window\.MZ_DATA = (.*);\s*$', src, re.S).group(1))

ids = []
for k in ('news', 'activities', 'statements', 'docs', 'press'):
    for x in D.get(k, []):
        for part in re.split(r'[\n,]+', x.get('photo') or ''):
            for r in ID_RE:
                m = r.search(part)
                if m and m.group(1) not in ids:
                    ids.append(m.group(1)); break


def download(fid):
    if MOCK:
        c = glob.glob(os.path.join(MOCK, fid + '.*'))
        return open(c[0], 'rb').read() if c else None
    for url in ('https://drive.usercontent.google.com/download?id=%s&export=download&confirm=t' % fid,
                'https://drive.google.com/uc?export=download&id=%s' % fid):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (mapozerowaste-sync)'})
            with urllib.request.urlopen(req, timeout=40) as r:
                data = r.read(40 * 1024 * 1024)
            if data[:1] != b'<':   # HTML이면 안내 화면(공유 안 됨 등)이므로 실패로 봄
                return data
        except Exception as e:
            print('  내려받기 실패', fid, e, file=sys.stderr)
    return None


def shrink(data, dest):
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(data)))
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA'); bg = Image.new('RGB', im.size, 'white'); bg.paste(im, mask=im.split()[-1]); im = bg
    else:
        im = im.convert('RGB')
    w = min(MAX_W, im.width)
    while True:
        cur = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        for q in (85, 78, 70, 62):
            buf = io.BytesIO(); cur.save(buf, 'JPEG', quality=q, optimize=True, progressive=True)
            if buf.tell() <= MAX_BYTES: break
        if buf.tell() <= MAX_BYTES or w <= 800: break
        w = int(w * 0.85)
    open(dest, 'wb').write(buf.getvalue())
    return buf.tell(), cur.size


os.makedirs(OUT, exist_ok=True)
new = fail = 0
for fid in ids:
    dest = os.path.join(OUT, fid + '.jpg')
    if os.path.exists(dest) and not REFRESH: continue
    if new >= MAX_NEW:
        print('이번 실행에서 받을 수 있는 수를 넘어 나머지는 다음에 받습니다.'); break
    data = download(fid)
    if not data:
        fail += 1; print('건너뜀(공유 설정 확인):', fid); continue
    try:
        size, wh = shrink(data, dest); new += 1
        print('저장', fid, f'{wh[0]}x{wh[1]}', f'{size // 1024}KB')
    except Exception as e:
        fail += 1; print('사진이 아니거나 읽을 수 없음:', fid, e)
    if not MOCK: time.sleep(0.7)

D['driveLocal'] = {os.path.basename(f)[:-4]: 'assets/photos/drive/' + os.path.basename(f)
                   for f in sorted(glob.glob(os.path.join(OUT, '*.jpg')))}
open(p, 'w', encoding='utf-8').write(
    '// 기본 콘텐츠에 구글 시트 내용을 합쳐 굳힌 값입니다(tools/sync_sheet.py, fetch_photos.py). 시트가 바뀌면 다시 만들어집니다.\nwindow.MZ_DATA = ' + json.dumps(D, ensure_ascii=False, indent=1) + ';\n')
print(f'드라이브 사진: 링크 {len(ids)}개, 새로 저장 {new}, 건너뜀 {fail}, 저장본 {len(D["driveLocal"])}')
