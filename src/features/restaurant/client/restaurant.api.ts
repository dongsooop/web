import { clientRequestAuth } from '@/lib/api/clientRequestAuth';

import type { RestaurantCreateRequest } from '../types/request';
import type {
  RestaurantCategoryKey,
  RestaurantPageUi,
  RestaurantSearchItemUi,
} from '../types/ui-model';

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

  return clientRequestAuth<RestaurantPageUi>(`/bff/restaurants/list?${query.toString()}`, {
    method: 'GET',
  });
}

export async function toggleRestaurantLike(id: number, isAdding: boolean) {
  const query = new URLSearchParams({
    isAdding: String(isAdding),
  });

  return clientRequestAuth<void>(`/bff/restaurants/like/${id}?${query.toString()}`, {
    method: 'POST',
  });
}

export async function searchRestaurants(queryText: string) {
  const query = new URLSearchParams({
    query: queryText,
  });

  return clientRequestAuth<RestaurantSearchItemUi[]>(
    `/bff/restaurants/search?${query.toString()}`,
    {
      method: 'GET',
    },
  );
}

export async function createRestaurant(payload: RestaurantCreateRequest) {
  return clientRequestAuth<void>('/bff/restaurants/write', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
