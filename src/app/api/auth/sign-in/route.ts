import { HttpStatusCode } from '@/constants/httpStatusCode';
import { serverRequest } from '@/utils/serverRequest';
import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/api/apiError';
import type { BackendSignInResponse, SignInRequest } from '@/features/auth/types';

function setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };

  response.cookies.set('access_token', accessToken, cookieOptions);
  response.cookies.set('refresh_token', refreshToken, cookieOptions);
}

export async function POST(request: NextRequest) {
  const endpoint = process.env.LOGIN_ENDPOINT;
  const appCheckToken = request.headers.get('X-Firebase-AppCheck') || '';

  const deviceToken = request.cookies.get('device_token')?.value || '';
  const deviceType = request.cookies.get('device_type')?.value || 'WEB';

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  if (!deviceToken) {
    return NextResponse.json(
      { message: '등록되지 않은 기기입니다.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  if (!endpoint) {
    return NextResponse.json(
      { message: '로그인 서비스를 현재 사용할 수 없습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }

  try {
    const body = (await request.json()) as SignInRequest;

    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: '이메일과 비밀번호를 입력해 주세요.' },
        { status: HttpStatusCode.BAD_REQUEST },
      );
    }

    const payload = {
      email: body.email,
      password: body.password,
      fcmToken: deviceToken,
      deviceType,
    };

    console.log('[SIGN_IN_ROUTE] payload:', {
      email: payload.email,
      password: '******',
      fcmToken: payload.fcmToken,
      deviceType: payload.deviceType,
    });

    const response = await serverRequest(endpoint, appCheckToken, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as BackendSignInResponse;

    const nextResponse = NextResponse.json({ user: data.user }, { status: HttpStatusCode.OK });

    setAuthCookies(nextResponse, data.accessToken, data.refreshToken);

    return nextResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: '로그인 처리 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
