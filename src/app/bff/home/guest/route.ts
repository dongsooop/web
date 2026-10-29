import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';
import type { HomeResponse } from '@/features/home/types/response';
import { NextRequest, NextResponse } from 'next/server';

import { fetchGuestHome } from '../service';

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
  const appCheckToken = request.headers.get('X-Firebase-AppCheck') || '';

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  try {
    const result = await fetchGuestHome({
      appCheckToken,
      deviceToken: request.cookies.get('device_token')?.value,
    });

    const home: HomeResponse = await result.json();
    const data = normalizeNoticeLinks(home, schoolUrl);

    return NextResponse.json(data, { status: result.status });
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
