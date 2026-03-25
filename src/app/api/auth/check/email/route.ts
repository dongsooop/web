import { HttpStatusCode } from '@/constants/httpStatusCode';
import { serverRequest } from '@/utils/serverRequest';
import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/api/apiError';

interface EmailValidateRequest {
  email: string;
}

export async function POST(request: NextRequest) {
  const endpoint = process.env.EMAIL_VALIDATE_ENDPOINT;
  const appCheckToken = request.headers.get('X-Firebase-AppCheck') || '';

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  if (!endpoint) {
    return NextResponse.json(
      { message: '이메일 중복검사 서비스를 현재 사용할 수 없습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
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

    const response = await serverRequest(endpoint, appCheckToken, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (response.status === HttpStatusCode.NO_CONTENT) {
      return new NextResponse(null, {
        status: HttpStatusCode.NO_CONTENT,
      });
    }

    if (response.status === HttpStatusCode.CONFLICT) {
      return new NextResponse(null, {
        status: HttpStatusCode.CONFLICT,
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

    return NextResponse.json(
      { message: '이메일 중복검사 처리 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
