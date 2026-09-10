import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { issueMoodleToken, proxyEclass } from '@/features/eclass/server/eclass.proxy';
import type { EclassLinkRequest } from '@/features/eclass/types';
import { ApiError } from '@/lib/api/apiError';

export async function GET(request: NextRequest) {
  return proxyEclass(request, '/link');
}

export async function DELETE(request: NextRequest) {
  return proxyEclass(request, '/link', { method: 'DELETE' });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Partial<EclassLinkRequest>;
  const username = body.username?.trim();
  const password = body.password ?? '';

  if (!username || !password) {
    return NextResponse.json(
      { message: '이클래스 아이디와 비밀번호를 입력해 주세요.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const token = await issueMoodleToken(username, password);

    return proxyEclass(request, '/link', { method: 'POST', body: { token } });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : HttpStatusCode.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof ApiError
        ? error.message
        : '이클래스에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.';

    return NextResponse.json({ message }, { status });
  }
}
