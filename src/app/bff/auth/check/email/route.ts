import { HttpStatusCode } from '@/constants/httpStatusCode';
import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/api/apiError';
import type { EmailValidateRequest } from '@/features/auth/types/request';
import { checkEmailDuplicateWithSpring } from '@/features/auth/server/auth.api';

export async function POST(request: NextRequest) {
  const appCheckToken = request.headers.get('X-Firebase-AppCheck') || '';

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  try {
    const body = (await request.json()) as EmailValidateRequest;
    const email = body.email?.trim();

    if (!email) {
      return NextResponse.json(
        { message: '이메일을 입력해 주세요.' },
        { status: HttpStatusCode.BAD_REQUEST },
      );
    }

    await checkEmailDuplicateWithSpring({ email }, { appCheckToken });

    return NextResponse.json({ available: true }, { status: HttpStatusCode.OK });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === HttpStatusCode.CONFLICT) {
        return NextResponse.json(
          {
            available: false,
            message: '이미 사용 중인 이메일입니다.',
          },
          { status: HttpStatusCode.CONFLICT },
        );
      }

      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    if (error instanceof Error && error.message.endsWith('is missing')) {
      return NextResponse.json(
        { message: '이메일 중복검사 서비스를 현재 사용할 수 없습니다.' },
        { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
      );
    }

    return NextResponse.json(
      { message: '이메일 중복검사 처리 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
