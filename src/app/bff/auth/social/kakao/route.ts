import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { unlinkSocialWithSpring } from '@/features/auth/server/auth.api';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { ApiError } from '@/lib/api/apiError';

const kakaoStateKey = 'kakao_oauth_state';

function getErrorPage(request: NextRequest, message: string) {
  const url = new URL('/mypage/social', request.url);
  url.searchParams.set('error', message);
  return url;
}

export async function GET(request: NextRequest) {
  const auth = extractAuthContext(request);

  if (!auth.accessToken) {
    return createSessionExpiredResponse();
  }

  const clientId = process.env.KAKAO_REST_KEY;
  const redirectUri = new URL('/bff/auth/social/kakao/callback', request.url).toString();

  if (!clientId) {
    return NextResponse.redirect(getErrorPage(request, '카카오 로그인 설정을 확인해주세요.'));
  }

  try {
    const state = randomUUID();
    const authorizeUrl = new URL('https://kauth.kakao.com/oauth/authorize');

    authorizeUrl.searchParams.set('client_id', clientId);
    authorizeUrl.searchParams.set('redirect_uri', redirectUri);
    authorizeUrl.searchParams.set('response_type', 'code');
    authorizeUrl.searchParams.set('state', state);

    const response = NextResponse.redirect(authorizeUrl);

    response.cookies.set(kakaoStateKey, state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 10,
    });

    return response;
  } catch {
    return NextResponse.redirect(getErrorPage(request, '카카오 로그인 설정을 확인해주세요.'));
  }
}

export async function DELETE(request: NextRequest) {
  const auth = extractAuthContext(request);

  if (!auth.accessToken) {
    return createSessionExpiredResponse();
  }

  try {
    const result = await unlinkSocialWithSpring('kakao', 'mobile', {
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      appCheckToken: auth.appCheckToken,
    });

    const response = new NextResponse(null, {
      status: HttpStatusCode.NO_CONTENT,
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
      { message: '소셜 계정 연동 해제 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
