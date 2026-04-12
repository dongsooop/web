import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { NextRequest, NextResponse } from 'next/server';

import { fetchHome } from './service';

function normalizeNoticeLinks(data: any, schoolUrl: string) {
  if (data && Array.isArray(data.notices)) {
    data.notices = data.notices.map((notice: any) => ({
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
  const { accessToken, refreshToken, appCheckToken, departmentType } = extractAuthContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  if (!departmentType) {
    return NextResponse.json(
      { message: 'Unauthorized: departmentType is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  try {
    const result = await fetchHome({
      accessToken,
      refreshToken,
      appCheckToken,
      departmentType,
    });

    if (result.response.status === HttpStatusCode.UNAUTHORIZED) {
      return createSessionExpiredResponse();
    }

    const data = normalizeNoticeLinks(await result.response.json(), schoolUrl);
    const response = NextResponse.json(data);

    applyAuthResult(response, result);

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || 'Network Connection Failed',
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
