import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { ApiError } from '@/lib/api/apiError';
import type { HomeResponse } from '@/features/home/types/response';
import { NextRequest, NextResponse } from 'next/server';

import { fetchHome } from './service';

function normalizeNoticeLinks(data: HomeResponse, schoolUrl: string) {
  if (data && Array.isArray(data.notices)) {
    data.notices = data.notices.map((notice) => ({
      ...notice,
      link: notice.link.startsWith('http')
        ? notice.link
        : `${schoolUrl}${notice.link.startsWith('/') ? '' : '/'}${notice.link}`,
    }));
  }

  return data;
}

export async function GET(request: NextRequest) {
  const schoolUrl = process.env.SCHOOL_URL!;
  const { accessToken, refreshToken, appCheckToken, departmentType, deviceToken } =
    extractAuthContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  if (!departmentType) {
    return createSessionExpiredResponse();
  }

  try {
    const result = await fetchHome({
      accessToken,
      refreshToken,
      appCheckToken,
      departmentType,
      deviceToken,
    });

    if (result.response.status === HttpStatusCode.UNAUTHORIZED) {
      return createSessionExpiredResponse();
    }

    const home: HomeResponse = await result.response.json();
    const data = normalizeNoticeLinks(home, schoolUrl);
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
