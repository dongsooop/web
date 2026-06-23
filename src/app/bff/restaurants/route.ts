import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import {
  createRestaurant,
  fetchRestaurantPage,
} from '@/features/restaurant/server/restaurant.service';
import {
  parseCategory,
  parseCreate,
  parsePage,
  parseSize,
} from '@/features/restaurant/server/restaurant.validator';
import type { RestaurantCreateRequest } from '@/features/restaurant/types/request';
import { ApiError } from '@/lib/api/apiError';

const requestFailedMessage = 'Request failed';

export async function GET(request: NextRequest) {
  const { accessToken, refreshToken, appCheckToken } = extractAuthContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  const page = parsePage(request.nextUrl.searchParams.get('page'));
  const size = parseSize(request.nextUrl.searchParams.get('size'));
  const category = parseCategory(request.nextUrl.searchParams.get('category'));

  try {
    const result = await fetchRestaurantPage({
      accessToken,
      refreshToken,
      appCheckToken,
      page,
      size,
      category,
    });
    const response = NextResponse.json(result.body, { status: result.status });

    if (result.authResult) {
      applyAuthResult(response, result.authResult);
    }

    return response;
  } catch (error: unknown) {
    const status =
      error instanceof ApiError && error.status !== HttpStatusCode.NETWORK_ERROR
        ? error.status
        : HttpStatusCode.INTERNAL_SERVER_ERROR;

    return NextResponse.json(
      {
        message: requestFailedMessage,
        status,
      },
      { status },
    );
  }
}

export async function POST(request: NextRequest) {
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

  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { code: 'INVALID_JSON', message: requestFailedMessage },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const payload = parseCreate((rawBody ?? {}) as Partial<RestaurantCreateRequest>);

    if (!payload) {
      return NextResponse.json(
        { code: 'INVALID_INPUT', message: requestFailedMessage },
        { status: HttpStatusCode.BAD_REQUEST },
      );
    }

    const result = await createRestaurant({
      accessToken,
      refreshToken,
      appCheckToken,
      payload,
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
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      const status =
        error.status !== HttpStatusCode.NETWORK_ERROR
          ? error.status
          : HttpStatusCode.INTERNAL_SERVER_ERROR;

      return NextResponse.json({ message: requestFailedMessage }, { status });
    }

    return NextResponse.json(
      { message: requestFailedMessage },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
