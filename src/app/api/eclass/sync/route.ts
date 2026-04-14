import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { serverFetchAuth } from '@/lib/api/serverFetchAuth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { accessToken, refreshToken, appCheckToken } = extractAuthContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  const body = await request.json();

  const result = await serverFetchAuth('/eclass/assignments', {
    method: 'POST',
    accessToken,
    refreshToken,
    appCheckToken,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (result.response.status === HttpStatusCode.UNAUTHORIZED) {
    return createSessionExpiredResponse();
  }

  const data = await result.response.json();
  const response = NextResponse.json(data, { status: result.response.status });

  applyAuthResult(response, result);

  return response;
}
