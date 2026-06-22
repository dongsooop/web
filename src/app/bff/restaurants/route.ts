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

const DEFAULT_SIZE = 7;
const MAX_SIZE = 50;
const MAX_TAGS = 3;

function parsePage(value: string | null) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

function parseSize(value: string | null) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return DEFAULT_SIZE;
  }

  return Math.min(parsed, MAX_SIZE);
}

function parseCategory(value: string | null): RestaurantCategoryKey | undefined {
  if (!value) {
    return undefined;
  }

  return categoryKeys.find((key) => key === value);
}

function parseCreateCategory(value: unknown): RestaurantCategoryKey | null {
  if (typeof value !== 'string') {
    return null;
  }

  const category = value.trim();

  if (!category) {
    return null;
  }

  return categoryKeys.find((key) => key === category) ?? null;
}

function trimValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseDistance(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return null;
}

function isRestaurantTagKey(value: unknown): value is RestaurantTagKey {
  return typeof value === 'string' && restaurantTags.some((tag) => tag.value === value);
}

function parseTags(value: unknown): RestaurantTagKey[] | null {
  if (value == null) {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  if (value.length > MAX_TAGS || value.some((tag) => !isRestaurantTagKey(tag))) {
    return null;
  }

  return value;
}

function buildRestaurantPage(items: RestaurantItem[], hasMore: boolean): RestaurantPage {
  return {
    items,
    hasMore,
  };
}

async function readHasMore(response: Response) {
  if (!response.ok) {
    return false;
  }

  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    return false;
  }

  try {
    const items = (await response.json()) as RestaurantListResponse;
    return Array.isArray(items) && items.length > 0;
  } catch {
    return false;
  }
}

async function hasNextGuestRestaurant(options: {
  appCheckToken?: string;
  page: number;
  size: number;
  category?: RestaurantCategoryKey;
}) {
  const probe = await fetchGuestRestaurantListWithSpring({
    appCheckToken: options.appCheckToken,
    page: options.page + 1,
    size: options.size,
    category: options.category,
  });

  return readHasMore(probe);
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
    page: options.page + 1,
    size: options.size,
    category: options.category,
  });

  if (result.response.status === HttpStatusCode.UNAUTHORIZED) {
    return null;
  }

  return {
    hasMore: await readHasMore(result.response),
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
    const category = parseCreateCategory(body.category);
    const tags = parseTags(body.tags);
    const externalMapId = trimValue(body.externalMapId);
    const name = trimValue(body.name);
    const placeUrl = trimValue(body.placeUrl);

    if (
      !externalMapId ||
      !name ||
      !placeUrl ||
      distance === null ||
      !category ||
      tags === null
    ) {
      return NextResponse.json(
        { message: '맛집 정보를 올바르게 입력해 주세요.' },
        { status: HttpStatusCode.BAD_REQUEST },
      );
    }

    const payload: RestaurantCreateRequest = {
      externalMapId,
      name,
      placeUrl,
      distance,
      category,
      tags,
    };

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
