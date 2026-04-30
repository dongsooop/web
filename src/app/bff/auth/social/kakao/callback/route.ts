import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { linkKakaoSocialWithSpring } from '@/features/auth/server/auth.api';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { ApiError } from '@/lib/api/apiError';

function getSocialPage(request: NextRequest, path = '/mypage/social', message?: string) {
  const url = new URL(path, request.url);

  if (message) {
    url.searchParams.set('error', message);
  }

  return url;
}

async function exchangeCode(code: string, redirectUri: string) {
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

  const data = (await response.json()) as { access_token?: unknown };
  const token = typeof data.access_token === 'string' ? data.access_token.trim() : '';

  if (!token) {
    throw new ApiError(HttpStatusCode.BAD_REQUEST, '카카오 토큰을 확인할 수 없습니다.');
  }

  return token;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')?.trim() ?? '';
  const state = request.nextUrl.searchParams.get('state')?.trim() ?? '';
  const error = request.nextUrl.searchParams.get('error')?.trim() ?? '';
  const errorDescription = request.nextUrl.searchParams.get('error_description')?.trim() ?? '';
  const url = getSocialPage(request, '/mypage/social/kakao/callback');

  if (code) {
    url.searchParams.set('code', code);
  }

  if (state) {
    url.searchParams.set('state', state);
  }

  if (error) {
    url.searchParams.set('error', error);
  }

  if (errorDescription) {
    url.searchParams.set('error_description', errorDescription);
  }

  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  const auth = extractAuthContext(request);

  if (!auth.accessToken) {
    return createSessionExpiredResponse();
  }

  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { message: '잘못된 요청 형식입니다.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  const body = (rawBody ?? {}) as { code?: unknown };
  const code = typeof body.code === 'string' ? body.code.trim() : '';

  if (!code) {
    return NextResponse.json(
      { message: '카카오 인증 코드가 필요합니다.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const redirectUri = new URL('/bff/auth/social/kakao/callback', request.url).toString();
    const providerToken = await exchangeCode(code, redirectUri);
    const result = await linkKakaoSocialWithSpring(providerToken, {
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      appCheckToken: auth.appCheckToken,
    });

    const response = NextResponse.json(result.data, {
      status: HttpStatusCode.OK,
    });

    applyAuthResult(response, result);
    return response;
  } catch (error) {
    if (error instanceof ApiError && error.status === HttpStatusCode.UNAUTHORIZED) {
      return createSessionExpiredResponse();
    }

    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: '소셜 계정 연동 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
