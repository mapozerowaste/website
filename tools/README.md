# 홈페이지 생성 도구 (관리용)

방문자에게는 필요 없는 파일입니다. Claude나 담당자가 홈페이지를 고칠 때 씁니다.

- `content.py` — 기본 콘텐츠(소식·활동·연혁·명단·로고 등). 시트를 못 읽을 때 보이는 값
- `build_data.py` — `content.py`로 `assets/data.js`를 만듭니다 (안내서 상세·내려받기 설정 포함)
- `site.py` — 모든 `.html` 페이지를 만듭니다 (머리 문구, 안내서 띠, 함께하기 양식 등 고정 글)

저장소 맨 위 폴더에서 실행합니다.

```
python3 tools/build_data.py
python3 tools/site.py
```

화면 동작은 `assets/site.js`, 모양은 `assets/style.css`, 신청서 처리는 `apps-script/Code.gs`(Apps Script에 붙여 넣어 배포)입니다.
