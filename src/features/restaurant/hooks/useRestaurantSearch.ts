'use client';

import { useQuery } from '@tanstack/react-query';

import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';

import { searchRestaurants } from '../client/restaurant.api';

export function useRestaurantSearch(query: string) {
  const normalized = query.trim();
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const isQueryReady = isInitialized && normalized.length > 0;

  const search = useQuery({
    queryKey: ['restaurant-search', normalized],
    queryFn: ({ signal }) => searchRestaurants(normalized, signal),
    enabled: isQueryReady,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...search,
    isQueryReady,
    items: search.data ?? [],
    displayErrorMessage: search.error
      ? getErrorMessage('restaurant', search.error, 'search')
      : null,
  };
}
