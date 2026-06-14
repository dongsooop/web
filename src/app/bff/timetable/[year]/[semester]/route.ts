import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { fetchTimetable } from '@/features/timetable/server/timetable.service';
import type { TimetableSemester } from '@/features/timetable/types/response';
import { ApiError } from '@/lib/api/apiError';
import { NextRequest, NextResponse } from 'next/server';

type TimetableResponseBody = {
  timetable?: unknown[];
  [key: string]: unknown;
};

function normalizeTimetableResponse(data: unknown): TimetableResponseBody {
  if (Array.isArray(data)) {
    return {
      timetable: data,
    };
  }

  if (!data || typeof data !== 'object') {
    return {
      timetable: [],
    };
  }

  const body = data as TimetableResponseBody;
  const nestedTimetable =
    body.timetable ??
    (body.data && typeof body.data === 'object' && !Array.isArray(body.data)
      ? (body.data as { timetable?: unknown[] }).timetable
      : undefined);

  return {
    ...body,
    timetable: Array.isArray(nestedTimetable) ? nestedTimetable : [],
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ year: string; semester: string }> },
) {
  const { accessToken, refreshToken, appCheckToken } = extractAuthContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  const { year, semester } = await params;

  if (!['FIRST', 'SECOND', 'SUMMER', 'WINTER'].includes(semester)) {
    return NextResponse.json(
      {
        message: 'INVALID_SEMESTER',
        status: HttpStatusCode.BAD_REQUEST,
      },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const result = await fetchTimetable({
      accessToken,
      refreshToken,
      appCheckToken,
      year,
      semester: semester as TimetableSemester,
    });

    if (result.response.status === HttpStatusCode.UNAUTHORIZED) {
      return createSessionExpiredResponse();
    }

    const data = normalizeTimetableResponse(await result.response.json());
    const response = NextResponse.json(data, { status: result.response.status });

    applyAuthResult(response, result);

    return response;
  } catch (error: unknown) {
    const status =
      error instanceof ApiError && error.status !== HttpStatusCode.NETWORK_ERROR
        ? error.status
        : HttpStatusCode.INTERNAL_SERVER_ERROR;

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Network Connection Failed',
        status,
      },
      { status },
    );
  }
}
