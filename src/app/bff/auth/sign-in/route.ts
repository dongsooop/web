import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';

import type { SignInRequest } from '@/features/auth/types/request';
import type { BackendSignInResponse } from '@/features/auth/types/backend';
import { signInWithSpring } from '@/features/auth/server/auth.api';
import {
  setAuthCookies,
  setDepartmentTypeCookie,
  setDeviceCookies,
  setStoredSessionUserCookie,
} from '@/features/auth/server/auth.cookies';
import { toSignInResponse } from '@/features/auth/mapper';

export async function POST(request: NextRequest) {
  const appCheckToken = request.headers.get('X-Firebase-AppCheck') || '';

  const existingDeviceToken = request.cookies.get('device_token')?.value;
  const existingDeviceType = request.cookies.get('device_type')?.value || 'WEB';

  const deviceToken = existingDeviceToken || randomUUID();
  const deviceType = existingDeviceType || 'WEB';

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

  const body = (rawBody ?? {}) as Partial<SignInRequest>;
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return NextResponse.json(
      { message: '이메일과 비밀번호를 입력해 주세요.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const data: BackendSignInResponse = await signInWithSpring(
      {
        email,
        password,
      },
      {
        appCheckToken,
        deviceToken,
        deviceType,
      },
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

    if (error instanceof Error && error.message.endsWith('is missing')) {
      return NextResponse.json(
        { message: '로그인 서비스를 현재 사용할 수 없습니다.' },
        { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
      );
    }

    return NextResponse.json(
      { message: '로그인 처리 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
