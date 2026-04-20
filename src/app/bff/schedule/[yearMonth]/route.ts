import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { fetchSchedule } from '@/features/schedule/server/schedule.service';
import { ApiError } from '@/lib/api/apiError';
import { NextRequest, NextResponse } from 'next/server';

type ScheduleResponseBody = {
  schedules?: unknown[];
  [key: string]: unknown;
};

function normalizeScheduleResponse(data: unknown): ScheduleResponseBody {
  if (Array.isArray(data)) {
    return {
      schedules: data,
    };
  }

  if (!data || typeof data !== 'object') {
    return {
      schedules: [],
    };
  }

  const body = data as ScheduleResponseBody;
  const nestedSchedules =
    body.schedules ??
    (body.data && typeof body.data === 'object' && !Array.isArray(body.data)
      ? (body.data as { schedules?: unknown[] }).schedules
      : undefined);

  return {
    ...body,
    schedules: Array.isArray(nestedSchedules) ? nestedSchedules : [],
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ yearMonth: string }> },
) {
  const { accessToken, refreshToken, appCheckToken } = extractAuthContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  const { yearMonth } = await params;
  const isAuthenticated = !!accessToken || !!refreshToken;

  try {
    const result = await fetchSchedule({
      accessToken,
      refreshToken,
      appCheckToken,
      isAuthenticated,
      yearMonth,
    });

    if (isAuthenticated && result.response.status === HttpStatusCode.UNAUTHORIZED) {
      return createSessionExpiredResponse();
    }

    const data = normalizeScheduleResponse(await result.response.json());
    const response = NextResponse.json(data, { status: result.response.status });

    if (isAuthenticated) {
      applyAuthResult(response, result);
    }

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
