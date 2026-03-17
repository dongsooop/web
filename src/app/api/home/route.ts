import { HttpStatusCode } from '@/constants/httpStatusCode';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const base = process.env.BASE_URL;
  const endpoint = process.env.HOME_ENDPOINT;
  const schoolUrl = process.env.SCHOOL_URL!;

  if (!base) {
    return NextResponse.json(
      { message: 'Internal Server Error: API URL is missing' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }

  const appCheckToken = request.headers.get('X-Firebase-AppCheck') || '';

  try {
    const res = await fetch(`${base}${endpoint}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'X-Firebase-AppCheck': appCheckToken,
      },
    });

    const contentType = res.headers.get('content-type') ?? '';
    const data = contentType.includes('application/json')
      ? await res.json().catch(() => null)
      : await res.text().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        {
          message: data?.message || 'Backend Error',
          status: res.status,
        },
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

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: 'Network Connection Failed', status: HttpStatusCode.INTERNAL_SERVER_ERROR },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
