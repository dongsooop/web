'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';

import { fetchNoticePage } from '../client/notice.api';
import type { NoticeTab } from '../types/ui-model';

export function useNoticeQuery(tab: NoticeTab) {
  const isInitialized = useAppCheckStore((state) => state.isInitialized);

  const query = useInfiniteQuery({
    queryKey: ['notice-page', tab],
    queryFn: ({ pageParam }) => fetchNoticePage(tab, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    staleTime: 1000 * 60,
    enabled: isInitialized,
  });

  return {
    ...query,
    items: query.data?.pages.flatMap((page) => page.items) ?? [],
    hasMore: query.hasNextPage,
    displayErrorMessage: query.error ? getErrorMessage('home', query.error) : null,
  };
}
