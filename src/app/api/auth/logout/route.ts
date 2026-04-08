import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';

import { extractAuthContext } from '@/features/auth/server/auth.context';
import { logoutWithSpring } from '@/features/auth/server/auth.api';
import { clearAuthCookies } from '@/features/auth/server/auth.cookies';

export async function POST(request: NextRequest) {
  const { accessToken, appCheckToken, deviceToken } = extractAuthContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  if (!accessToken) {
    return NextResponse.json(
      { message: '액세스 토큰이 없습니다.' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  if (!deviceToken) {
    return NextResponse.json(
      { message: '디바이스 토큰이 없습니다.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    await logoutWithSpring({
      accessToken,
      appCheckToken,
      deviceToken,
    });

    const response = NextResponse.json({ success: true }, { status: HttpStatusCode.OK });

    clearAuthCookies(response);

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: '로그아웃 처리 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
