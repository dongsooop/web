import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { linkGoogleSocialWithSpring } from '@/features/auth/server/auth.api';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { ApiError } from '@/lib/api/apiError';

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

  const body = (rawBody ?? {}) as { providerToken?: unknown };
  const token = typeof body.providerToken === 'string' ? body.providerToken.trim() : '';

  if (!token) {
    return NextResponse.json(
      { message: 'Google 토큰이 필요합니다.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const result = await linkGoogleSocialWithSpring(token, {
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
