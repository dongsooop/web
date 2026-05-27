import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { toSignInResponse } from '@/features/auth/mapper';
import { socialSignInWithSpring } from '@/features/auth/server/auth.api';
import { resolveDeviceContext } from '@/features/auth/server/auth.context';
import {
  setAuthCookies,
  setDepartmentTypeCookie,
  setDeviceCookies,
  setStoredSessionUserCookie,
} from '@/features/auth/server/auth.cookies';
import type { BackendSignInResponse } from '@/features/auth/types/backend';
import { ApiError } from '@/lib/api/apiError';

export async function POST(request: NextRequest) {
  const appCheckToken = request.headers.get('X-Firebase-AppCheck') || '';
  const { deviceToken, deviceType } = resolveDeviceContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
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

  const body = (rawBody ?? {}) as { token?: unknown };
  const token = typeof body.token === 'string' ? body.token.trim() : '';

  if (!token) {
    return NextResponse.json(
      { message: 'Google 토큰이 필요합니다.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const data: BackendSignInResponse = await socialSignInWithSpring(
      'google',
      { token, deviceToken, deviceType },
      { appCheckToken },
    );

    const response = NextResponse.json(toSignInResponse(data), {
      status: HttpStatusCode.OK,
    });

    setAuthCookies(response, data.accessToken, data.refreshToken);
    setDeviceCookies(response, deviceToken, deviceType);

    if (data.departmentType) {
      setDepartmentTypeCookie(response, data.departmentType);
    }

    setStoredSessionUserCookie(response, {
      id: data.id,
      email: data.email,
      nickname: data.nickname,
      departmentType: data.departmentType ?? '',
      role: Array.isArray(data.role) ? data.role : [],
    });

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: '소셜 로그인 처리 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
