import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';

type KakaoTokenResponse = {
  access_token?: unknown;
};

const kakaoTimeout = 10_000;

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
    throw new ApiError(HttpStatusCode.BAD_REQUEST, '카카오 인증을 완료하지 못했습니다.');
  }

  const data = (await response.json()) as KakaoTokenResponse;
  const token = typeof data.access_token === 'string' ? data.access_token.trim() : '';

  if (!token) {
    throw new ApiError(HttpStatusCode.BAD_REQUEST, '카카오 토큰을 확인할 수 없습니다.');
  }

  return token;
}
