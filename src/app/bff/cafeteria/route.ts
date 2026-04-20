import { NextResponse } from 'next/server';
import { HttpStatusCode } from '@/constants/httpStatusCode';
import { getCafeteriaData } from './service';

export async function GET(request: Request) {
  const appCheckToken = request.headers.get('X-Firebase-AppCheck');

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'AppCheck token is required' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  try {
    const data = await getCafeteriaData(appCheckToken);
    return NextResponse.json(data);
  } catch (error: any) {
    const status = error.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal Server Error';

    return NextResponse.json({ message }, { status });
  }
}
