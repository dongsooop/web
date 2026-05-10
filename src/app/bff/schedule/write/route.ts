import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { createSchedule } from '@/features/schedule/server/schedule.service';
import type { ScheduleCreateRequest } from '@/features/schedule/types/request';
import { ApiError } from '@/lib/api/apiError';

function trimValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: NextRequest) {
  const { accessToken, refreshToken, appCheckToken } = extractAuthContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  try {
    const body = (await request.json()) as Partial<ScheduleCreateRequest>;
    const payload: ScheduleCreateRequest = {
      title: trimValue(body.title),
      location: trimValue(body.location),
      startAt: trimValue(body.startAt),
      endAt: trimValue(body.endAt),
    };

    if (!payload.title || !payload.location || !payload.startAt || !payload.endAt) {
      return NextResponse.json(
        { message: '일정 정보를 올바르게 입력해 주세요.' },
        { status: HttpStatusCode.BAD_REQUEST },
      );
    }

    const result = await createSchedule({
      accessToken,
      refreshToken,
      appCheckToken,
      payload,
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
      { message: '일정 등록 중 오류가 발생했어요.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
