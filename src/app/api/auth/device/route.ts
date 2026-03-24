import { randomUUID } from 'crypto';
import { HttpStatusCode } from '@/constants/httpStatusCode';
import { serverRequest } from '@/utils/serverRequest';
import { NextResponse } from 'next/server';
import { ApiError } from '@/lib/api/apiError';

export async function POST(request: Request) {
  const endpoint = process.env.DEVICE_ENDPOINT;
  const appCheckToken = request.headers.get('X-Firebase-AppCheck') || '';

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  if (!endpoint) {
    return NextResponse.json(
      { message: '기기 등록 서비스를 현재 사용할 수 없습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }

  try {
    const deviceToken = randomUUID();
    const deviceType = 'WEB';

    const payload = {
      deviceToken,
      type: deviceType,
    };

    console.log('[DEVICE_ROUTE] payload:', payload);

    await serverRequest(endpoint, appCheckToken, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const response = NextResponse.json({ success: true }, { status: HttpStatusCode.OK });

    response.cookies.set('device_token', deviceToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    response.cookies.set('device_type', deviceType, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: '기기 등록 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
