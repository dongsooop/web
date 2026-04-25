import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { getSocialStateWithSpring } from '@/features/auth/server/auth.api';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { ApiError } from '@/lib/api/apiError';

export async function GET(request: NextRequest) {
  const auth = extractAuthContext(request);

  if (!auth.accessToken) {
    return createSessionExpiredResponse();
  }

  try {
    const result = await getSocialStateWithSpring({
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      appCheckToken: auth.appCheckToken,
    });

    const response = NextResponse.json(
      { list: result.list },
      { status: HttpStatusCode.OK },
    );

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
      { message: '소셜 계정 연동 상태를 조회하는 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
