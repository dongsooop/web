'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';
import { useAuth } from '@/features/auth/hooks/useAuth';

import { fetchRestaurantPage } from '../client/restaurant.api';
import type { RestaurantCategoryKey } from '../types/ui-model';

const PAGE_SIZE = 7;

export function useRestaurantQuery(category: RestaurantCategoryKey | 'ALL') {
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const { isLoggedIn, isReady } = useAuth();

  const query = useInfiniteQuery({
    queryKey: ['restaurant-list', category, isLoggedIn],
    queryFn: ({ pageParam }) => fetchRestaurantPage(category, pageParam, PAGE_SIZE),
    initialPageParam: 0,
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
    staleTime: 1000 * 60,
    enabled: isInitialized && isReady,
  });

  return {
    ...query,
    items: query.data?.pages.flatMap((page) => page.items) ?? [],
    hasMore: query.data?.pages.at(-1)?.hasMore ?? false,
    isInitialLoading: !query.data && (query.isPending || query.isFetching || !isInitialized || !isReady),
    displayErrorMessage: query.error ? getErrorMessage('restaurant', query.error) : null,
  };
}
