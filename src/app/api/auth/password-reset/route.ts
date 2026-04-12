import { HttpStatusCode } from '@/constants/httpStatusCode';
import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/api/apiError';
import { ResetPasswordRequest } from '@/features/auth/types/request';
import { resetPasswordWithSpring } from '@/features/auth/server/auth.api';

export async function POST(request: NextRequest) {
  const appCheckToken = request.headers.get('X-Firebase-AppCheck') || '';

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  try {
    const body = (await request.json()) as ResetPasswordRequest;

    const email = body.email?.trim();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json(
        { message: '이메일과 비밀번호를 입력해 주세요.' },
        { status: HttpStatusCode.BAD_REQUEST },
      );
    }

    const payload: ResetPasswordRequest = {
      email,
      password,
    };

    const response = await resetPasswordWithSpring(payload, { appCheckToken });

    if (response.status === HttpStatusCode.NO_CONTENT) {
      return new NextResponse(null, {
        status: HttpStatusCode.NO_CONTENT,
      });
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        'Content-Type': contentType || 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    if (error instanceof Error && error.message.endsWith('is missing')) {
      return NextResponse.json(
        { message: '비밀번호 변경 서비스를 현재 사용할 수 없습니다.' },
        { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
      );
    }

    return NextResponse.json(
      { message: '비밀번호 변경 처리 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
