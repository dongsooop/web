import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';

type KakaoTokenResponse = {
  access_token?: unknown;
};

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

  const response = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    body: body.toString(),
    cache: 'no-store',
  });

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
