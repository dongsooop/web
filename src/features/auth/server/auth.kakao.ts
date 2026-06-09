import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';

type KakaoTokenResponse = {
  access_token?: unknown;
};

const kakaoTimeout = 10_000;

async function readKakaoError(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      const body = (await response.json()) as {
        error?: unknown;
        error_description?: unknown;
        error_code?: unknown;
      };
      const error =
        typeof body.error === 'string' && body.error.trim() ? body.error.trim() : null;
      const description =
        typeof body.error_description === 'string' && body.error_description.trim()
          ? body.error_description.trim()
          : null;
      const code =
        typeof body.error_code === 'string' && body.error_code.trim()
          ? body.error_code.trim()
          : null;

      return [error, description, code].filter(Boolean).join(' | ');
    } catch {
      return '';
    }
  }

  try {
    return (await response.text()).trim();
  } catch {
    return '';
  }
}

export async function exchangeKakaoCode(code: string, redirectUri: string) {
  const clientId = process.env.KAKAO_REST_KEY;
  const clientSecret = process.env.KAKAO_CLIENT_SECRET;

  if (!clientId) {
    throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, '카카오 로그인 설정을 확인해주세요.');
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
  });

  if (clientSecret) {
    body.set('client_secret', clientSecret);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), kakaoTimeout);

  let response: Response;

  try {
    response = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: body.toString(),
      cache: 'no-store',
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(
        HttpStatusCode.GATEWAY_TIMEOUT,
        '카카오 인증 요청 시간이 초과되었습니다.',
      );
    }

    throw new ApiError(HttpStatusCode.BAD_GATEWAY, '카카오 인증 서버와 통신하지 못했습니다.');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const detail = await readKakaoError(response);
    const message = detail
      ? `카카오 인증을 완료하지 못했습니다. (${detail})`
      : '카카오 인증을 완료하지 못했습니다.';

    throw new ApiError(HttpStatusCode.BAD_REQUEST, message);
  }

  const data = (await response.json()) as KakaoTokenResponse;
  const token = typeof data.access_token === 'string' ? data.access_token.trim() : '';

  if (!token) {
    throw new ApiError(HttpStatusCode.BAD_REQUEST, '카카오 토큰을 확인할 수 없습니다.');
  }

  return token;
}
