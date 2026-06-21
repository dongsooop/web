import 'server-only';

import { serverFetch } from '@/lib/api/serverFetch';
import { serverFetchAuth } from '@/lib/api/serverFetchAuth';

import type { RestaurantCategoryKey } from '../types/ui-model';

type RestaurantRequestOptions = {
  appCheckToken?: string;
};

type RestaurantAuthRequestOptions = RestaurantRequestOptions & {
  accessToken?: string;
  refreshToken?: string;
};

function getRequiredRestaurantsEndpoint() {
  const endpoint = process.env.RESTAURANTS?.trim();

  if (!endpoint) {
    throw new Error('RESTAURANTS_MISSING');
  }

  return endpoint;
}

function buildRestaurantUrl(options: {
  page: number;
  size: number;
  category?: RestaurantCategoryKey;
}) {
  const query = new URLSearchParams({
    page: String(options.page),
    size: String(options.size),
  });

  if (options.category) {
    query.set('category', options.category);
  }

  return `${getRequiredRestaurantsEndpoint()}?${query.toString()}`;
}

export function fetchGuestRestaurantListWithSpring(
  options: RestaurantRequestOptions & {
    page: number;
    size: number;
    category?: RestaurantCategoryKey;
  },
) {
  return serverFetch(buildRestaurantUrl(options), {
    method: 'GET',
    appCheckToken: options.appCheckToken,
  });
}

export function fetchRestaurantListWithSpring(
  options: RestaurantAuthRequestOptions & {
    page: number;
    size: number;
    category?: RestaurantCategoryKey;
  },
) {
  return serverFetchAuth(buildRestaurantUrl(options), {
    method: 'GET',
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}
