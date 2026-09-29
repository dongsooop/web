'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAppCheckStore } from '@/store/useAppCheckStore';

import { fetchAdminReportPage } from '../client/adminReport.api';
import type { ReportFilter } from '../types';

export const ADMIN_REPORT_QUERY_KEY = ['admin-reports'];

export function useAdminReportQuery(filter: ReportFilter) {
  const { isReady, user } = useAuth();
  const isInitialized = useAppCheckStore((state) => state.isInitialized);

  const query = useInfiniteQuery({
    queryKey: [...ADMIN_REPORT_QUERY_KEY, filter],
    queryFn: ({ pageParam }) => fetchAdminReportPage(filter, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    staleTime: 0,
    enabled: isInitialized && isReady && !!user?.isAdmin,
  });

  return {
    ...query,
    items: query.data?.pages.flatMap((page) => page.items) ?? [],
    hasMore: query.hasNextPage,
    isInitialLoading: !query.data && query.isPending,
  };
}
