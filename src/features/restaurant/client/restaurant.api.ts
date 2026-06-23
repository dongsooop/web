import { clientRequestAuth } from '@/lib/api/clientRequestAuth';

import type { RestaurantCategoryKey } from '../options';
import type { RestaurantCreateRequest } from '../types/request';
import type { RestaurantDuplicationResponse } from '../types/response';
import type { RestaurantPage, RestaurantSearchItem } from '../types/ui-model';

export async function fetchRestaurantPage(
  category: RestaurantCategoryKey | 'ALL',
  page: number,
  size: number,
) {
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  if (category !== 'ALL') {
    query.set('category', category);
  }

  return clientRequestAuth<RestaurantPage>(`/bff/restaurants?${query.toString()}`, {
    method: 'GET',
  });
}

export async function likeRestaurant(id: number, isAdding: boolean) {
  const query = new URLSearchParams({
    isAdding: String(isAdding),
  });

  return clientRequestAuth<void>(`/bff/restaurants/like/${id}?${query.toString()}`, {
    method: 'POST',
  });
}

export async function searchRestaurants(queryText: string, signal?: AbortSignal) {
  const query = new URLSearchParams({
    query: queryText,
  });

  return clientRequestAuth<RestaurantSearchItem[]>(`/bff/restaurants/search?${query.toString()}`, {
    method: 'GET',
    signal,
  });
}

export async function checkDuplication(externalMapId: string) {
  const query = new URLSearchParams({
    externalMapId,
  });

  return clientRequestAuth<RestaurantDuplicationResponse>(
    `/bff/restaurants/check-duplication?${query.toString()}`,
    {
      method: 'GET',
    },
  );
}

export async function createRestaurant(payload: RestaurantCreateRequest) {
  return clientRequestAuth<void>('/bff/restaurants', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
