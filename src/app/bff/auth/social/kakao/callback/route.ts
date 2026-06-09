import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { linkKakaoSocialWithSpring } from '@/features/auth/server/auth.api';
import { exchangeKakaoCode } from '@/features/auth/server/auth.kakao';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { ApiError } from '@/lib/api/apiError';

const defaultWebOrigin = 'https://www.dongsoop.site';

function getWebOrigin(request?: NextRequest) {
  if (request) {
    return new URL(request.url).origin;
  }

  return defaultWebOrigin;
}

function getSocialPage(request: NextRequest, path = '/mypage/social', message?: string) {
  const url = new URL(path, getWebOrigin(request));

  if (message) {
    url.searchParams.set('error', message);
  }

  return url;
}

function getCallbackPath(state: string) {
  if (state.startsWith('link:')) {
    return '/mypage/social/kakao/callback';
  }

  return '/sign-in/kakao/callback';
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')?.trim() ?? '';
  const state = request.nextUrl.searchParams.get('state')?.trim() ?? '';
  const error = request.nextUrl.searchParams.get('error')?.trim() ?? '';
  const errorDescription = request.nextUrl.searchParams.get('error_description')?.trim() ?? '';
  const url = getSocialPage(request, getCallbackPath(state));

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
    const redirectUri = new URL('/bff/auth/social/kakao/callback', getWebOrigin(request)).toString();
    const providerToken = await exchangeKakaoCode(code, redirectUri);
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
