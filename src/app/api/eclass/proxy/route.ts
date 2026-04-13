import { NextRequest, NextResponse } from 'next/server';

const ECLASS_BASE = 'https://eclass.dongyang.ac.kr';
const PROXY_PATH = '/api/eclass/proxy';

// eclass 세션 쿠키를 우리 도메인에 eclx_ 접두사로 저장
function getEclassCookieHeader(request: NextRequest): string {
  const session = request.cookies.get('eclx_session')?.value;
  if (!session) return '';
  try {
    const cookies = JSON.parse(session) as Record<string, string>;
    return Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  } catch {
    return '';
  }
}

function mergeEclassCookies(
  existing: Record<string, string>,
  setCookieHeaders: string[],
): Record<string, string> {
  const merged = { ...existing };
  for (const header of setCookieHeaders) {
    const [nameValue] = header.split(';');
    const eqIdx = nameValue.indexOf('=');
    if (eqIdx === -1) continue;
    const name = nameValue.slice(0, eqIdx).trim();
    const value = nameValue.slice(eqIdx + 1).trim();
    merged[name] = value;
  }
  return merged;
}

// HTML 내 URL을 프록시 경로로 재작성 (내비게이션용 href/action만)
function rewriteUrls(html: string): string {
  // absolute eclass URLs → 프록시
  html = html.replace(
    /\b(href|action)="https:\/\/eclass\.dongyang\.ac\.kr(\/[^"]*)"/g,
    (_, attr, path) => `${attr}="${PROXY_PATH}?path=${encodeURIComponent(path)}"`,
  );
  // relative /path → 프록시
  html = html.replace(
    /\b(href|action)="(\/[^"#?][^"]*)"/g,
    (_, attr, path) => `${attr}="${PROXY_PATH}?path=${encodeURIComponent(path)}"`,
  );
  // src 절대경로는 직접 eclass로 (static assets)
  html = html.replace(/\bsrc="(\/[^"]*)"/g, `src="${ECLASS_BASE}$1"`);
  return html;
}

// 스크래퍼 스크립트 주입
function injectScript(html: string): string {
  const script = `
<script>
(function() {
  var PROXY = '${PROXY_PATH}';
  var SK    = 'eclassSync';

  function go(eclassPath) {
    location.replace(PROXY + '?path=' + encodeURIComponent(eclassPath));
  }

  function getState() {
    try { return JSON.parse(sessionStorage.getItem(SK) || 'null'); } catch(e) { return null; }
  }
  function setState(s) { sessionStorage.setItem(SK, JSON.stringify(s)); }
  function clearState() { sessionStorage.removeItem(SK); }

  var path = location.search.replace(/.*[?&]path=([^&]*).*/, '$1');
  try { path = decodeURIComponent(path); } catch(e) {}

  // 로그인 페이지면 아무것도 하지 않음 (사용자가 직접 로그인)
  var isLoginPage = !!document.querySelector('#login, #page-login-index, form[action*="login"]');
  if (isLoginPage) { clearState(); return; }

  // 이미 완료된 경우
  if (sessionStorage.getItem(SK + '_done') === 'true') { return; }

  var state = getState();

  // ── 1단계: /my/ 에서 수강 과목 목록 수집 ──────────────────────────
  if (!state) {
    if (!path.startsWith('/my')) {
      go('/my/'); return;
    }
    var courses = [];
    // My courses 블록의 과목 링크에서 courseId 추출
    document.querySelectorAll('a[href*="course/view.php?id="]').forEach(function(a) {
      var m = a.href.match(/course\\/view\\.php\\?id=(\\d+)/);
      if (!m) return;
      var courseId = m[1];
      if (courses.find(function(c) { return c.id === courseId; })) return;
      var name = a.textContent.trim();
      if (name) courses.push({ id: courseId, name: name });
    });

    if (courses.length === 0) {
      // 과목 없음 → 동기화 완료 처리
      finishSync([]);
      return;
    }
    state = { courses: courses, idx: 0, assignments: [] };
    setState(state);
    go('/mod/assign/index.php?id=' + courses[0].id);
    return;
  }

  // ── 2단계: 각 과목의 과제 목록 페이지에서 수집 ──────────────────────
  if (path.startsWith('/mod/assign/index.php')) {
    var courseIdParam = (path.match(/[?&]id=(\\d+)/) || [])[1] || '';
    var currentCourse = state.courses.find(function(c) { return c.id === courseIdParam; })
                     || { id: courseIdParam, name: '' };

    // 과제 테이블 파싱 (Moodle 표준 레이아웃)
    document.querySelectorAll('table.generaltable tbody tr').forEach(function(row) {
      var titleEl = row.querySelector('td:first-child a');
      if (!titleEl) return;

      var link = titleEl.href.replace(location.origin, ECLASS_BASE.replace(/\\/api.*/, ''));
      var assignIdMatch = link.match(/[?&]id=(\\d+)/);
      var eclassId = assignIdMatch ? 'a_' + assignIdMatch[1] : 'a_' + Math.random().toString(36).slice(2);

      var cells = row.querySelectorAll('td');
      var statusText = cells[1] ? cells[1].textContent.trim() : '';
      var dueDateText = cells[2] ? cells[2].textContent.trim() : '';

      state.assignments.push({
        eclassId: eclassId,
        courseId: currentCourse.id,
        courseName: currentCourse.name,
        title: titleEl.textContent.trim(),
        dueDate: dueDateText,
        isSubmitted: statusText.includes('제출') && !statusText.includes('미'),
        status: statusText,
        link: link
      });
    });

    setState(state);

    state.idx++;
    if (state.idx < state.courses.length) {
      go('/mod/assign/index.php?id=' + state.courses[state.idx].id);
    } else {
      finishSync(state.assignments);
    }
    return;
  }

  // 다른 페이지: 다음 과목으로 이동
  if (state && state.idx < state.courses.length) {
    go('/mod/assign/index.php?id=' + state.courses[state.idx].id);
  }

  function finishSync(assignments) {
    clearState();
    sessionStorage.setItem(SK + '_done', 'true');
    // 부모 창(React 앱)에 데이터를 전달하면 부모가 App Check 토큰과 함께 저장합니다
    if (window.opener) {
      window.opener.postMessage({ type: 'ECLASS_DATA_SCRAPED', assignments: assignments }, '*');
    }
    window.close();
  }
})();
</script>`;

  if (html.includes('</body>')) {
    return html.replace('</body>', script + '</body>');
  }
  return html + script;
}

async function proxyRequest(request: NextRequest, method: 'GET' | 'POST') {
  const url = new URL(request.url);
  const path = url.searchParams.get('path') || '/login/index.php';
  const targetUrl = `${ECLASS_BASE}${path.startsWith('/') ? path : '/' + path}`;

  const cookieHeader = getEclassCookieHeader(request);
  const existingCookies: Record<string, string> = (() => {
    try {
      return JSON.parse(request.cookies.get('eclx_session')?.value || '{}');
    } catch {
      return {};
    }
  })();

  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      'User-Agent':
        request.headers.get('User-Agent') ||
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept-Language': 'ko-KR,ko;q=0.9',
    },
    redirect: 'manual',
  };

  if (method === 'POST') {
    const body = await request.formData();
    const params = new URLSearchParams();
    body.forEach((value, key) => params.append(key, value.toString()));
    fetchOptions.body = params.toString();
    (fetchOptions.headers as Record<string, string>)['Content-Type'] =
      'application/x-www-form-urlencoded';
  }

  const eclassRes = await fetch(targetUrl, fetchOptions);

  // eclass 세션 쿠키 수집
  const setCookieHeaders: string[] = [];
  eclassRes.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') setCookieHeaders.push(value);
  });
  const updatedCookies = mergeEclassCookies(existingCookies, setCookieHeaders);

  // 리다이렉트 처리
  if (eclassRes.status >= 300 && eclassRes.status < 400) {
    const location = eclassRes.headers.get('location') || '/my/';
    const newPath = location.startsWith('http')
      ? location.replace(ECLASS_BASE, '')
      : location;
    const redirectRes = NextResponse.redirect(
      new URL(`${PROXY_PATH}?path=${encodeURIComponent(newPath)}`, request.url),
    );
    redirectRes.cookies.set('eclx_session', JSON.stringify(updatedCookies), {
      path: '/',
      sameSite: 'lax',
    });
    return redirectRes;
  }

  let html = await eclassRes.text();
  html = rewriteUrls(html);
  html = injectScript(html);

  // 보안 헤더 제거 (iframe/popup 허용)
  const response = new NextResponse(html, {
    status: eclassRes.status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });

  if (Object.keys(updatedCookies).length > 0) {
    response.cookies.set('eclx_session', JSON.stringify(updatedCookies), {
      path: '/',
      sameSite: 'lax',
    });
  }

  return response;
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, 'POST');
}
