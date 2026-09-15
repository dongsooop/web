import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';

const TOKEN_URL = 'https://eclass.dongyang.ac.kr/login/token.php';
const SERVICE = 'moodle_mobile_app';

type MoodleTokenResponse = {
  token?: string;
  error?: string;
};

/**
 * 이클래스 토큰은 브라우저가 학교 서버에서 직접 받는다 — 비밀번호가 동숲 서버로 가지 않게 하기 위함이다.
 * 커스텀 헤더나 credentials 를 붙이면 프리플라이트가 생기고 학교 서버가 OPTIONS 를 403 으로 막으므로,
 * 폼 인코딩 단순 요청 형태를 유지해야 한다.
 */
export async function issueEclassToken(username: string, password: string) {
  let data: MoodleTokenResponse;

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, password, service: SERVICE }),
    });

    data = (await response.json()) as MoodleTokenResponse;
  } catch {
    throw new ApiError(
      HttpStatusCode.NETWORK_ERROR,
      '이클래스에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.',
    );
  }

  if (!data.token) {
    throw new ApiError(HttpStatusCode.BAD_REQUEST, data.error ?? '이클래스 로그인에 실패했어요.');
  }

  return data.token;
}
