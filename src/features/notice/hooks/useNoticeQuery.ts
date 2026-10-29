'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';

import { fetchNoticePage } from '../client/notice.api';
import type { NoticeTab } from '../types/ui-model';

export function useNoticeQuery(tab: NoticeTab) {
  const { isLoggedIn, isReady, user } = useAuth();
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const departmentType = user?.departmentType ?? 'guest';

  const query = useInfiniteQuery({
    queryKey: ['notice-page', tab, isLoggedIn ? departmentType : 'guest'],
    queryFn: ({ pageParam }) => fetchNoticePage(tab, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    staleTime: 1000 * 60,
    enabled: isInitialized && isReady,
  });

  return {
    ...query,
    items: query.data?.pages.flatMap((page) => page.items) ?? [],
    hasMore: query.hasNextPage,
    isInitialLoading: !query.data && (query.isPending || query.isFetching),
    displayErrorMessage: query.error ? getErrorMessage('home', query.error) : null,
  };
}
