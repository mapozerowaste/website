/**
 * 마포자원순환네트워크 — 연서명 신청·현장 제안 받기
 *
 * 하는 일
 *  1. 홈페이지 '함께하기' 양식에서 보낸 신청을 이 스프레드시트의 '신청' 탭에 한 줄씩 쌓습니다.
 *  2. 신청이 들어올 때마다 NOTIFY_TO 주소들(support@sslmo.at, mapozerowaste@gmail.com)로 알림 메일을 보냅니다.
 *
 * 설치 (mapozerowaste@gmail.com 계정으로)
 *  1. 구글 드라이브 홈페이지 폴더에 '연서명 신청' 스프레드시트를 새로 만듭니다.
 *  2. 시트 메뉴 [확장 프로그램] → [Apps Script]를 열고, 이 파일 내용을 통째로 붙여 넣고 저장합니다.
 *  3. [배포] → [새 배포] → 유형 '웹 앱'
 *       - 다음 사용자 인증 정보로 실행: 나
 *       - 액세스 권한이 있는 사용자: 모든 사용자
 *     → 배포 후 나오는 웹 앱 URL(https://script.google.com/macros/s/…/exec)을 복사합니다.
 *  4. 홈페이지 assets/config.js 의 FORM_ENDPOINT 에 그 URL을 붙여 넣습니다.
 *  5. 홈페이지에서 시험 신청을 한 번 해 보고, 시트와 메일이 들어오는지 확인합니다.
 *
 * 코드를 고친 뒤에는 [배포] → [배포 관리] → 연필 → 버전 '새 버전'으로 다시 배포해야 반영됩니다.
 */

var NOTIFY_TO = 'support@sslmo.at, mapozerowaste@gmail.com';  // 알림 받을 주소. 쉼표로 구분해 더 넣을 수 있습니다.
var SHEET_NAME = '신청';
// 신청을 쌓을 '연서명 신청' 스프레드시트의 ID (주소의 /d/ 와 /edit 사이).
// 시트 메뉴 [확장 프로그램 → Apps Script]로 만든 스크립트라면 비워 둬도 되지만, 적어 두는 것이 가장 확실합니다.
var SPREADSHEET_ID = '';
var HEADERS = ['접수일시', '구분', '유형', '이름(단체·기업명)', '담당자', '연락처', '이메일', '한마디', '명단 공개', '개인정보 동의', '처리 상태'];

function doPost(e) {
  var p = (e && e.parameter) || {};
  // 스팸 방지: 사람에게는 보이지 않는 칸이 채워져 있으면 무시합니다.
  if (p.website) return json_({ ok: true });
  if (!p.name || !p.email || p.privacy !== '동의') return json_({ ok: false, error: 'missing' });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = sheet_();
    var row = [
      new Date(),
      clean_(p.purpose || '연서명 참여'), clean_(p.kind), clean_(p.name), clean_(p.contact), clean_(p.tel),
      clean_(p.email), clean_(p.message), clean_(p.publish), clean_(p.privacy), '확인 전'
    ];
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }

  var ss = book_();
  var url = ss.getUrl() + '#gid=' + sheet_().getSheetId();
  MailApp.sendEmail({
    to: NOTIFY_TO,
    subject: '[마포자원순환네트워크] 새 ' + clean_(p.purpose || '연서명 참여') + ': ' + clean_(p.name) + ' (' + clean_(p.kind) + ')',
    body: [
      '홈페이지로 새 신청이 들어왔습니다.',
      '',
      '구분: ' + clean_(p.purpose || '연서명 참여'),
      '유형: ' + clean_(p.kind),
      '이름: ' + clean_(p.name),
      '담당자: ' + clean_(p.contact),
      '연락처: ' + clean_(p.tel),
      '이메일: ' + clean_(p.email),
      '명단 공개: ' + clean_(p.publish),
      '한마디: ' + clean_(p.message),
      '',
      '신청 목록 보기 (' + ss.getName() + ' › ' + SHEET_NAME + ' 탭): ' + url,
      '확인 후 \'홈페이지 콘텐츠\' 시트의 \'연서명명단\' 탭에 추가하면 홈페이지 명단에 나타납니다.'
    ].join('\n')
  });

  return json_({ ok: true });
}

// 주소창에서 웹앱 주소를 열었을 때 동작 확인용
function doGet() {
  return json_({ ok: true, service: 'mapozerowaste-join' });
}

function book_() {
  if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('신청을 쌓을 스프레드시트를 찾지 못했습니다. SPREADSHEET_ID 를 적어 주세요.');
  return ss;
}

function sheet_() {
  var ss = book_();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    // 새 스프레드시트의 빈 첫 탭(시트1)이 있으면 그 탭을 '신청'으로 바꿔 씁니다.
    var first = ss.getSheets()[0];
    if (ss.getSheets().length === 1 && first.getLastRow() === 0) { sh = first; sh.setName(SHEET_NAME); }
    else sh = ss.insertSheet(SHEET_NAME, 0);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sh;
}

// 설치 확인용: Apps Script 편집기에서 이 함수를 골라 [실행]하면 '신청' 탭에 시험 줄이 하나 생깁니다.
function testWrite() {
  var sh = sheet_();
  sh.appendRow([new Date(), '시험', '시험', '시험 입력', '', '', '', '', '', '', '지워도 됩니다']);
  Logger.log('기록한 곳: ' + book_().getName() + ' / ' + sh.getName() + ' 탭 / ' + book_().getUrl());
}

// 시트 수식으로 해석되지 않도록 앞에 붙은 =,+,-,@ 를 막고 길이를 제한합니다.
function clean_(v) {
  v = String(v == null ? '' : v).trim().slice(0, 2000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
