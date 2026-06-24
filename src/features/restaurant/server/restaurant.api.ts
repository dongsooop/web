import 'server-only';

import { serverFetch } from '@/lib/api/serverFetch';
import { serverFetchAuth } from '@/lib/api/serverFetchAuth';

import type { RestaurantCategoryKey } from '../options';
import type { RestaurantCreateRequest } from '../types/request';

type RestaurantRequestOptions = {
  appCheckToken?: string;
};

type RestaurantAuthRequestOptions = RestaurantRequestOptions & {
  accessToken?: string;
  refreshToken?: string;
};

const kakaoTimeout = 10_000;

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

function getRequiredCreateRestaurantEndpoint() {
  const endpoint = process.env.CREATE_RESTAURANTS?.trim();

  if (!endpoint) {
    throw new Error('CREATE_RESTAURANTS_MISSING');
  }

  return endpoint;
}

function getRequiredRestaurantSearchEndpoint() {
  const endpoint = process.env.KAKAO_URL?.trim();

  if (!endpoint) {
    throw new Error('KAKAO_URL_MISSING');
  }

  return endpoint;
}

function getRequiredRestaurantDuplicationEndpoint() {
  const endpoint = process.env.CHECK_RESTAURANTS_DUPLICATION?.trim();

  if (!endpoint) {
    throw new Error('CHECK_RESTAURANTS_DUPLICATION_MISSING');
  }

  return endpoint;
}

function getRequiredKakaoApiKey() {
  const apiKey = process.env.KAKAO_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('KAKAO_API_KEY_MISSING');
  }

  return apiKey;
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

function buildRestaurantSearchUrl(queryText: string) {
  const query = new URLSearchParams({
    y: '37.5002972',
    x: '126.8680825',
    radius: '1000',
    query: queryText,
  });

  return `${getRequiredRestaurantSearchEndpoint()}?${query.toString()}`;
}

function buildRestaurantDuplicationUrl(externalMapId: string) {
  const endpoint = getRequiredRestaurantDuplicationEndpoint();
  const query = new URLSearchParams({
    externalMapId,
  });
  const isAbsolute = endpoint.startsWith('http://') || endpoint.startsWith('https://');
  const url = new URL(endpoint, 'http://localhost');

  query.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  return isAbsolute ? url.toString() : `${url.pathname}${url.search}`;
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

export function searchRestaurantsWithKakao(
  options: RestaurantRequestOptions & {
    query: string;
  },
) {
  const headers = new Headers();

  if (options.appCheckToken) {
    headers.set('X-Firebase-AppCheck', options.appCheckToken);
  }

  headers.set('Authorization', `KakaoAK ${getRequiredKakaoApiKey()}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), kakaoTimeout);

  return fetch(buildRestaurantSearchUrl(options.query), {
    method: 'GET',
    headers,
    cache: 'no-store',
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeoutId);
  });
}

export function createRestaurantWithSpring(
  options: RestaurantAuthRequestOptions & {
    payload: RestaurantCreateRequest;
  },
) {
  return serverFetchAuth(getRequiredCreateRestaurantEndpoint(), {
    method: 'POST',
    body: JSON.stringify(options.payload),
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}

export function checkRestaurantDuplicationWithSpring(
  options: RestaurantAuthRequestOptions & {
    externalMapId: string;
  },
) {
  return serverFetchAuth(buildRestaurantDuplicationUrl(options.externalMapId), {
    method: 'GET',
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}
