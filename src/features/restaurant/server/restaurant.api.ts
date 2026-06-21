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

function getRequiredRestaurantLikeEndpoint() {
  const endpoint = process.env.RESTAURANT_LIKE?.trim();

  if (!endpoint) {
    throw new Error('RESTAURANT_LIKE_MISSING');
  }

  return endpoint;
}

function getRequiredRestaurantEndpoint() {
  const endpoint = process.env.RESTAURANT?.trim();

  if (!endpoint) {
    throw new Error('RESTAURANT_MISSING');
  }

  return endpoint;
}

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

function buildRestaurantLikeUrl(id: number, isAdding: boolean) {
  const query = new URLSearchParams({
    isAdding: String(isAdding),
  });

  return `${getRequiredRestaurantEndpoint()}/${id}${getRequiredRestaurantLikeEndpoint()}?${query.toString()}`;
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

export function toggleRestaurantLikeWithSpring(
  options: RestaurantAuthRequestOptions & {
    id: number;
    isAdding: boolean;
  },
) {
  return serverFetchAuth(buildRestaurantLikeUrl(options.id, options.isAdding), {
    method: 'POST',
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}
