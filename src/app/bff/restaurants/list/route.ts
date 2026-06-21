import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult } from '@/features/auth/server/auth.route';
import { mapRestaurantListResponseToUi } from '@/features/restaurant/mapper';
import {
  fetchGuestRestaurantListWithSpring,
  fetchRestaurantListWithSpring,
} from '@/features/restaurant/server/restaurant.api';
import type { RestaurantListResponse } from '@/features/restaurant/types/response';
import type { RestaurantCategoryKey, RestaurantPageUi, RestaurantUiItem } from '@/features/restaurant/types/ui-model';
import { ApiError } from '@/lib/api/apiError';
import { NextRequest, NextResponse } from 'next/server';

const CATEGORY_VALUES: RestaurantCategoryKey[] = [
  'KOREAN',
  'CHINESE',
  'JAPANESE',
  'WESTERN',
  'BUNSIK',
  'FAST_FOOD',
  'CAFE_DESSERT',
];

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

  return CATEGORY_VALUES.find((item) => item === value);
}

function buildRestaurantPage(items: RestaurantUiItem[], hasMore: boolean): RestaurantPageUi {
  return {
    items,
    hasMore,
  };
}

function logRestaurantListResult(source: 'auth' | 'guest', items: RestaurantListResponse) {
  console.info('[restaurants:list]', {
    source,
    items,
  });
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
        logRestaurantListResult('auth', rawItems);
        const items = mapRestaurantListResponseToUi(rawItems);
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
      logRestaurantListResult('guest', rawGuestItems);
      const guestItems = mapRestaurantListResponseToUi(rawGuestItems);
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
    logRestaurantListResult('guest', rawGuestItems);
    const guestItems = mapRestaurantListResponseToUi(rawGuestItems);
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
