import { HttpStatusCode } from '@/constants/httpStatusCode';
import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/api/apiError';
import { SignUpRequest } from '@/features/auth/types/request';
import { signUpWithSpring } from '@/features/auth/server/auth.api';

export async function POST(request: NextRequest) {
  const appCheckToken = request.headers.get('X-Firebase-AppCheck') || '';

  if (!appCheckToken) {
    return NextResponse.json(
      { message: '인증 토큰이 누락되었습니다.' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  try {
    const body = (await request.json()) as SignUpRequest;
    const { email, password, nickname, departmentType } = body;

    const payload: SignUpRequest = {
      email: email?.trim(),
      password: password?.trim(),
      nickname: nickname?.trim(),
      departmentType: departmentType?.trim(),
    };

    if (!payload.email || !payload.password || !payload.nickname || !payload.departmentType) {
      return NextResponse.json(
        { message: '모든 정보를 올바르게 입력해 주세요.' },
        { status: HttpStatusCode.BAD_REQUEST },
      );
    }

    const response = await signUpWithSpring(payload, { appCheckToken });

    if (response.status === HttpStatusCode.NO_CONTENT) {
      return new NextResponse(null, { status: HttpStatusCode.NO_CONTENT });
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    if (error instanceof Error && error.message.endsWith('is missing')) {
      return NextResponse.json(
        { message: '회원가입 서비스를 현재 사용할 수 없습니다.' },
        { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
      );
    }

    return NextResponse.json(
      { message: '회원가입 처리 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
