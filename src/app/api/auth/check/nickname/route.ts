import { HttpStatusCode } from '@/constants/httpStatusCode';
import { serverRequest } from '@/utils/serverRequest';
import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/api/apiError';
import { NicknameValidateRequest } from '@/features/auth/types/authTypes';

export async function POST(request: NextRequest) {
  const endpoint = process.env.NICKNAME_VALIDATE_ENDPOINT;
  const appCheckToken = request.headers.get('X-Firebase-AppCheck') || '';

  if (!appCheckToken) {
    return NextResponse.json(
      { message: '인증 토큰이 누락되었습니다.' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  if (!endpoint) {
    return NextResponse.json(
      { message: '닉네임 중복검사 서비스를 현재 사용할 수 없습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }

  try {
    const body = (await request.json()) as NicknameValidateRequest;
    const nickname = body.nickname?.trim();

    if (!nickname) {
      return NextResponse.json(
        { message: '닉네임을 입력해 주세요.' },
        { status: HttpStatusCode.BAD_REQUEST },
      );
    }

    const response = await serverRequest(endpoint, appCheckToken, {
      method: 'POST',
      body: JSON.stringify({ nickname }),
    });

    if (response.status === HttpStatusCode.NO_CONTENT) {
      return new NextResponse(null, {
        status: HttpStatusCode.NO_CONTENT,
      });
    }

    if (response.status === HttpStatusCode.CONFLICT) {
      return NextResponse.json(
        { message: '이미 사용 중인 닉네임입니다.' },
        { status: HttpStatusCode.CONFLICT },
      );
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

    return NextResponse.json(
      { message: '닉네임 중복검사 처리 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}