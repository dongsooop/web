import { HttpStatusCode } from '@/constants/httpStatusCode';
import { serverRequest } from '@/utils/serverRequest';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const endpoint = process.env.HOME_ENDPOINT || '/home';
  const schoolUrl = process.env.SCHOOL_URL!;
  const appCheckToken = request.headers.get('X-Firebase-AppCheck') || '';

  try {
    const res = await serverRequest(endpoint, appCheckToken, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await res.json();

    console.log('[Home API] Raw Data:', JSON.stringify(data, null, 2));
    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || 'Backend Error' },
        { status: res.status },
      );
    }
    if (data && Array.isArray(data.notices)) {
      data.notices = data.notices.map((notice: any) => ({
        ...notice,
        link: notice.link.startsWith('http')
          ? notice.link
          : `${schoolUrl}${notice.link.startsWith('/') ? '' : '/'}${notice.link}`,
      }));
    }

    console.log('[Home API] Formatted Data:', data);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Home Route Error]:', error);
    return NextResponse.json(
      {
        message: error.message || 'Network Connection Failed',
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
