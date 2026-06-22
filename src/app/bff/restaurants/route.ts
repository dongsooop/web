import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { categoryKeys } from '@/features/restaurant/category';
import { mapList } from '@/features/restaurant/mapper';
import {
  restaurantTags,
  type RestaurantCategoryKey,
  type RestaurantTagKey,
} from '@/features/restaurant/options';
import {
  createRestaurantWithSpring,
  fetchGuestRestaurantListWithSpring,
  fetchRestaurantListWithSpring,
} from '@/features/restaurant/server/restaurant.api';
import type { RestaurantCreateRequest } from '@/features/restaurant/types/request';
import type { RestaurantListResponse } from '@/features/restaurant/types/response';
import type { RestaurantItem, RestaurantPage } from '@/features/restaurant/types/ui-model';
import { ApiError } from '@/lib/api/apiError';

function parsePage(value: string | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.floor(parsed);
}

function parseSize(value: string | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 7;
  }

  return Math.floor(parsed);
}

function parseCategory(value: string | null): RestaurantCategoryKey | undefined {
  if (!value) {
    return undefined;
  }

  return categoryKeys.find((key) => key === value);
}

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
  return typeof value === 'string' && restaurantTags.some((tag) => tag.value === value);
}

function buildRestaurantPage(items: RestaurantItem[], hasMore: boolean): RestaurantPage {
  return {
    items,
    hasMore,
  };
}

async function hasNextGuestRestaurant(options: {
  appCheckToken?: string;
  page: number;
  size: number;
  category?: RestaurantCategoryKey;
}) {
  const probe = await fetchGuestRestaurantListWithSpring({
    appCheckToken: options.appCheckToken,
    page: options.page * options.size + options.size,
    size: 1,
    category: options.category,
  });
  const items = (await probe.json()) as RestaurantListResponse;

  return items.length > 0;
}

async function hasNextRestaurant(options: {
  accessToken?: string;
  refreshToken?: string;
  appCheckToken?: string;
  page: number;
  size: number;
  category?: RestaurantCategoryKey;
}) {
  const result = await fetchRestaurantListWithSpring({
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
    page: options.page * options.size + options.size,
    size: 1,
    category: options.category,
  });

  if (result.response.status === HttpStatusCode.UNAUTHORIZED) {
    return null;
  }

  const items = (await result.response.json()) as RestaurantListResponse;

  return {
    hasMore: items.length > 0,
    result,
  };
}

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
    if (accessToken) {
      const result = await fetchRestaurantListWithSpring({
        accessToken,
        refreshToken,
        appCheckToken,
        page,
        size,
        category,
      });

      if (result.response.status !== HttpStatusCode.UNAUTHORIZED) {
        const rawItems = (await result.response.json()) as RestaurantListResponse;
        const items = mapList(rawItems);
        const probe =
          items.length === size
            ? await hasNextRestaurant({
                accessToken,
                refreshToken,
                appCheckToken,
                page,
                size,
                category,
              })
            : { hasMore: false, result };
        const hasMore =
          probe === null
            ? await hasNextGuestRestaurant({
                appCheckToken,
                page,
                size,
                category,
              })
            : probe.hasMore;
        const response = NextResponse.json(buildRestaurantPage(items, hasMore), {
          status: result.response.status,
        });

        applyAuthResult(response, probe?.result ?? result);

        return response;
      }

      const guestResponse = await fetchGuestRestaurantListWithSpring({
        appCheckToken,
        page,
        size,
        category,
      });
      const rawGuestItems = (await guestResponse.json()) as RestaurantListResponse;
      const guestItems = mapList(rawGuestItems);
      const hasMore =
        guestItems.length === size
          ? await hasNextGuestRestaurant({
              appCheckToken,
              page,
              size,
              category,
            })
          : false;
      const response = NextResponse.json(buildRestaurantPage(guestItems, hasMore), {
        status: guestResponse.status,
      });

      applyAuthResult(response, result);

      return response;
    }

    const guestResponse = await fetchGuestRestaurantListWithSpring({
      appCheckToken,
      page,
      size,
      category,
    });
    const rawGuestItems = (await guestResponse.json()) as RestaurantListResponse;
    const guestItems = mapList(rawGuestItems);
    const hasMore =
      guestItems.length === size
        ? await hasNextGuestRestaurant({
            appCheckToken,
            page,
            size,
            category,
          })
        : false;

    return NextResponse.json(buildRestaurantPage(guestItems, hasMore), {
      status: guestResponse.status,
    });
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
      tags: Array.isArray(body.tags) ? body.tags.filter(isRestaurantTagKey) : [],
    };

    if (
      !payload.externalMapId ||
      !payload.name ||
      !payload.placeUrl ||
      distance === null ||
      !payload.category
    ) {
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
