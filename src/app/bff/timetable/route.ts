import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { createTimetable, updateTimetable } from '@/features/timetable/server/timetable.service';
import type {
  TimetableCreateRequest,
  TimetableUpdateRequest,
} from '@/features/timetable/types/request';
import type { TimetableSemester, TimetableWeekKey } from '@/features/timetable/types/response';
import { ApiError } from '@/lib/api/apiError';

function trimValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidWeek(value: string): value is TimetableWeekKey {
  return ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].includes(
    value,
  );
}

function isValidSemester(value: string): value is TimetableSemester {
  return ['FIRST', 'SECOND', 'SUMMER', 'WINTER'].includes(value);
}

function isValidRange(startAt: string, endAt: string) {
  return startAt < endAt;
}

function buildResponse(result: Awaited<ReturnType<typeof createTimetable>>) {
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
    return result.response.json().then((data) => {
      const response = NextResponse.json(data, { status: result.response.status });
      applyAuthResult(response, result);
      return response;
    });
  }

  return result.response.text().then((text) => {
    const response = new NextResponse(text, {
      status: result.response.status,
      headers: { 'Content-Type': contentType },
    });
    applyAuthResult(response, result);
    return response;
  });
}

function parseBody(rawBody: unknown) {
  const body = (rawBody ?? {}) as Partial<TimetableUpdateRequest>;
  const week = trimValue(body.week);
  const semester = trimValue(body.semester);
  const year = Number(body.year);
  const id = Number(body.id);

  return {
    endAt: trimValue(body.endAt),
    id,
    location: trimValue(body.location),
    name: trimValue(body.name),
    professor: trimValue(body.professor),
    startAt: trimValue(body.startAt),
    week,
    year,
    semester,
  };
}

function validateBody(payload: ReturnType<typeof parseBody>, requireId = false) {
  if (!payload.name || !payload.week || !payload.startAt || !payload.endAt) {
    return NextResponse.json(
      { message: '시간표 정보를 올바르게 입력해 주세요.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  if (requireId && (!Number.isInteger(payload.id) || payload.id <= 0)) {
    return NextResponse.json(
      { message: '수정할 시간표 정보를 찾을 수 없어요.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  if (!Number.isInteger(payload.year) || payload.year <= 0) {
    return NextResponse.json(
      { message: '연도를 올바르게 입력해 주세요.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  if (!isValidWeek(payload.week) || !isValidSemester(payload.semester)) {
    return NextResponse.json(
      { message: '시간표 정보를 올바르게 입력해 주세요.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  if (!isValidRange(payload.startAt, payload.endAt)) {
    return NextResponse.json(
      { message: '강의 시간을 올바르게 입력해 주세요.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  return null;
}

export async function POST(request: NextRequest) {
  const { accessToken, refreshToken, appCheckToken } = extractAuthContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
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
    const payload = parseBody(rawBody);
    const invalid = validateBody(payload);

    if (invalid) {
      return invalid;
    }

    const result = await createTimetable({
      accessToken,
      refreshToken,
      appCheckToken,
      payload: payload as TimetableCreateRequest,
    });

    return buildResponse(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: '시간표 등록 중 오류가 발생했어요.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const { accessToken, refreshToken, appCheckToken } = extractAuthContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
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
    const payload = parseBody(rawBody);
    const invalid = validateBody(payload, true);

    if (invalid) {
      return invalid;
    }

    const result = await updateTimetable({
      accessToken,
      refreshToken,
      appCheckToken,
      payload: payload as TimetableUpdateRequest,
    });

    return buildResponse(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: '시간표 수정 중 오류가 발생했어요.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
