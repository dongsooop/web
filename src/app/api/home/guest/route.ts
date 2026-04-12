import { HttpStatusCode } from '@/constants/httpStatusCode';
import { NextResponse } from 'next/server';

import { fetchGuestHome } from '../service';

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

export async function GET(request: Request) {
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
    });

    const data = normalizeNoticeLinks(await result.json(), schoolUrl);

    return NextResponse.json(data);
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
