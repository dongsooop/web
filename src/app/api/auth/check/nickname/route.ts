import { HttpStatusCode } from '@/constants/httpStatusCode';
import { NextRequest, NextResponse } from 'next/server';
import type { NicknameValidateRequest } from '@/features/auth/types/request';
import { ApiError } from '@/lib/api/apiError';
import { checkNicknameDuplicateWithSpring } from '@/features/auth/server/auth.api';

export async function POST(request: NextRequest) {
  const appCheckToken = request.headers.get('X-Firebase-AppCheck') || '';

  if (!appCheckToken) {
    return NextResponse.json(
      { message: '인증 토큰이 누락되었습니다.' },
      { status: HttpStatusCode.UNAUTHORIZED },
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

    await checkNicknameDuplicateWithSpring({ nickname }, { appCheckToken });

    return NextResponse.json({ available: true }, { status: HttpStatusCode.OK });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === HttpStatusCode.CONFLICT) {
        return NextResponse.json(
          {
            available: false,
            message: '이미 사용 중인 닉네임입니다.',
          },
          { status: HttpStatusCode.CONFLICT },
        );
      }

      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    if (error instanceof Error && error.message.endsWith('is missing')) {
      return NextResponse.json(
        { message: '닉네임 중복검사 서비스를 현재 사용할 수 없습니다.' },
        { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
      );
    }

    return NextResponse.json(
      { message: '닉네임 중복검사 처리 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
