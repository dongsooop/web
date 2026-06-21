'use client';

import { useQuery } from '@tanstack/react-query';

import { getErrorMessage } from '@/lib/errors/messages';

import { searchRestaurants } from '../client/restaurant.api';

export function useRestaurantSearch(query: string) {
  const normalized = query.trim();

  const search = useQuery({
    queryKey: ['restaurant-search', normalized],
    queryFn: () => searchRestaurants(normalized),
    enabled: normalized.length > 0,
    staleTime: 1000 * 30,
  });

  return {
    ...search,
    items: search.data ?? [],
    displayErrorMessage: search.error ? getErrorMessage('restaurant', search.error, 'search') : null,
  };
}
