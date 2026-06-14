import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { deleteTimetable } from '@/features/timetable/server/timetable.service';
import { ApiError } from '@/lib/api/apiError';

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { accessToken, refreshToken, appCheckToken } = extractAuthContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  const params = await context.params;
  const id = parseId(params.id);

  if (!id) {
    return NextResponse.json(
      { message: '삭제할 시간표 정보를 찾을 수 없어요.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const result = await deleteTimetable({
      accessToken,
      refreshToken,
      appCheckToken,
      id,
    });

    if (result.response.status === HttpStatusCode.UNAUTHORIZED) {
      return createSessionExpiredResponse();
    }

    if (result.response.status === HttpStatusCode.NO_CONTENT) {
      const response = new NextResponse(null, { status: HttpStatusCode.NO_CONTENT });
      applyAuthResult(response, result);
      return response;
    }

    const contentType = result.response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await result.response.json();
      const response = NextResponse.json(data, { status: result.response.status });
      applyAuthResult(response, result);
      return response;
    }

    const text = await result.response.text();
    const response = new NextResponse(text, {
      status: result.response.status,
      headers: { 'Content-Type': contentType },
    });
    applyAuthResult(response, result);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: '시간표 삭제 중 오류가 발생했어요.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
