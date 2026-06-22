import { HttpStatusCode } from '@/constants/httpStatusCode';

import { mapList } from '../mapper';
import type { RestaurantCategoryKey } from '../options';
import type { RestaurantCreateRequest } from '../types/request';
import type { RestaurantListResponse } from '../types/response';
import type { RestaurantPage } from '../types/ui-model';
import {
  createRestaurantWithSpring,
  fetchGuestRestaurantListWithSpring,
  fetchRestaurantListWithSpring,
} from './restaurant.api';

type AuthResult = Awaited<ReturnType<typeof fetchRestaurantListWithSpring>>;

type ListOptions = {
  accessToken?: string;
  refreshToken?: string;
  appCheckToken?: string;
  page: number;
  size: number;
  category?: RestaurantCategoryKey;
};

type CreateOptions = {
  accessToken?: string;
  refreshToken?: string;
  appCheckToken?: string;
  payload: RestaurantCreateRequest;
};

type ListResult = {
  status: number;
  body: RestaurantPage;
  authResult?: AuthResult;
};

function buildPage(items: RestaurantListResponse, hasMore: boolean): RestaurantPage {
  return {
    items: mapList(items),
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

async function fetchGuestHasMore(options: ListOptions) {
  const response = await fetchGuestRestaurantListWithSpring({
    appCheckToken: options.appCheckToken,
    page: options.page + 1,
    size: options.size,
    category: options.category,
  });

  return readHasMore(response);
}

async function fetchAuthHasMore(options: ListOptions) {
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
    authResult: result,
  };
}

export async function fetchRestaurantPage(options: ListOptions): Promise<ListResult> {
  if (options.accessToken) {
    const authResult = await fetchRestaurantListWithSpring({
      accessToken: options.accessToken,
      refreshToken: options.refreshToken,
      appCheckToken: options.appCheckToken,
      page: options.page,
      size: options.size,
      category: options.category,
    });

    if (authResult.response.status !== HttpStatusCode.UNAUTHORIZED) {
      const items = (await authResult.response.json()) as RestaurantListResponse;
      const next =
        items.length === options.size
          ? await fetchAuthHasMore(options)
          : { hasMore: false, authResult };
      const hasMore = next === null ? await fetchGuestHasMore(options) : next.hasMore;

      return {
        status: authResult.response.status,
        body: buildPage(items, hasMore),
        authResult: next?.authResult ?? authResult,
      };
    }

    const guestResponse = await fetchGuestRestaurantListWithSpring({
      appCheckToken: options.appCheckToken,
      page: options.page,
      size: options.size,
      category: options.category,
    });
    const items = (await guestResponse.json()) as RestaurantListResponse;
    const hasMore = items.length === options.size ? await fetchGuestHasMore(options) : false;

    return {
      status: guestResponse.status,
      body: buildPage(items, hasMore),
      authResult,
    };
  }

  const guestResponse = await fetchGuestRestaurantListWithSpring({
    appCheckToken: options.appCheckToken,
    page: options.page,
    size: options.size,
    category: options.category,
  });
  const items = (await guestResponse.json()) as RestaurantListResponse;
  const hasMore = items.length === options.size ? await fetchGuestHasMore(options) : false;

  return {
    status: guestResponse.status,
    body: buildPage(items, hasMore),
  };
}

export async function createRestaurant(options: CreateOptions) {
  return createRestaurantWithSpring({
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
    payload: options.payload,
  });
}
