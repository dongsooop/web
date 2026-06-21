import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { restaurantTags, type RestaurantTagKey } from '@/features/restaurant/options';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { createRestaurantWithSpring } from '@/features/restaurant/server/restaurant.api';
import type { RestaurantCreateRequest } from '@/features/restaurant/types/request';
import { ApiError } from '@/lib/api/apiError';

function trimValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseDistance(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function isRestaurantTagKey(value: unknown): value is RestaurantTagKey {
  return (
    typeof value === 'string' && restaurantTags.some((tag) => tag.value === value)
  );
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
      { message: '잘못된 요청 형식입니다.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const body = (rawBody ?? {}) as Partial<RestaurantCreateRequest>;
    const distance = parseDistance(body.distance);
    const payload: RestaurantCreateRequest = {
      externalMapId: trimValue(body.externalMapId),
      name: trimValue(body.name),
      placeUrl: trimValue(body.placeUrl),
      distance: distance ?? 0,
      category: trimValue(body.category) as RestaurantCreateRequest['category'],
      tags: Array.isArray(body.tags)
        ? body.tags.filter(isRestaurantTagKey)
        : [],
    };

    if (!payload.externalMapId || !payload.name || !payload.placeUrl || distance === null || !payload.category) {
      return NextResponse.json(
        { message: '맛집 정보를 올바르게 입력해 주세요.' },
        { status: HttpStatusCode.BAD_REQUEST },
      );
    }

    const result = await createRestaurantWithSpring({
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
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: '맛집 등록 중 오류가 발생했어요.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
