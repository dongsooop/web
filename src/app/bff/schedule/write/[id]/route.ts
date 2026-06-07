import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { deleteSchedule, updateSchedule } from '@/features/schedule/server/schedule.service';
import type { ScheduleCreateRequest } from '@/features/schedule/types/request';
import { ApiError } from '@/lib/api/apiError';

function trimValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function isValidRange(startAt: string, endAt: string) {
  const start = new Date(startAt);
  const end = new Date(endAt);

  return !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start < end;
}

export async function PATCH(
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
      { message: '수정할 일정 정보를 찾을 수 없어요.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { message: '잘못된 요청 형식입니다.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const body = (rawBody ?? {}) as Partial<ScheduleCreateRequest>;
    const payload: ScheduleCreateRequest = {
      color: trimValue(body.color),
      title: trimValue(body.title),
      location: trimValue(body.location),
      startAt: trimValue(body.startAt),
      endAt: trimValue(body.endAt),
    };

    if (!payload.color || !payload.title || !payload.startAt || !payload.endAt) {
      return NextResponse.json(
        { message: '일정 정보를 올바르게 입력해 주세요.' },
        { status: HttpStatusCode.BAD_REQUEST },
      );
    }

    if (!isValidRange(payload.startAt, payload.endAt)) {
      return NextResponse.json(
        { message: '일정 시간을 올바르게 입력해 주세요.' },
        { status: HttpStatusCode.BAD_REQUEST },
      );
    }

    const result = await updateSchedule({
      accessToken,
      refreshToken,
      appCheckToken,
      id,
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
      { message: '일정 수정 중 오류가 발생했어요.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
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
      { message: '삭제할 일정 정보를 찾을 수 없어요.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const result = await deleteSchedule({
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
      { message: '일정 삭제 중 오류가 발생했어요.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
