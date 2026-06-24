import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { toggleRestaurantLikeWithSpring } from '@/features/restaurant/server/restaurant.api';
import { parseId } from '@/features/restaurant/server/restaurant.validator';
import { ApiError } from '@/lib/api/apiError';

function parseIsAdding(value: string | null) {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return null;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { accessToken, refreshToken, appCheckToken } = extractAuthContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  if (!accessToken) {
    return createSessionExpiredResponse();
  }

  const { id: rawId } = await params;
  const id = parseId(rawId);
  const isAdding = parseIsAdding(request.nextUrl.searchParams.get('isAdding'));

  if (!id || isAdding === null) {
    return NextResponse.json(
      { message: '잘못된 요청 형식입니다.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const result = await toggleRestaurantLikeWithSpring({
      accessToken,
      refreshToken,
      appCheckToken,
      id,
      isAdding,
    });

    if (result.response.status === HttpStatusCode.UNAUTHORIZED) {
      return createSessionExpiredResponse();
    }

    if (result.response.status === HttpStatusCode.NO_CONTENT) {
      const response = new NextResponse(null, { status: HttpStatusCode.NO_CONTENT });
      applyAuthResult(response, result);
      return response;
    }

    const contentType = result.response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await result.response.json();
      const response = NextResponse.json(data, { status: result.response.status });
      applyAuthResult(response, result);
      return response;
    }

    const text = await result.response.text();
    const response = new NextResponse(text, {
      status: result.response.status,
      headers: { 'Content-Type': contentType },
    });
    applyAuthResult(response, result);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      const status =
        error.status !== HttpStatusCode.NETWORK_ERROR
          ? error.status
          : HttpStatusCode.INTERNAL_SERVER_ERROR;

      return NextResponse.json({ message: error.message }, { status });
    }

    return NextResponse.json(
      { message: '맛집 좋아요 처리 중 오류가 발생했어요.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
