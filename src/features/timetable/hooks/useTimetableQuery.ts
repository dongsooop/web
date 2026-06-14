'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';

import { fetchTimetable } from '../client/timetable.api';
import type { TimetableSemester } from '../types/response';

export function useTimetableQuery(year: string, semester: TimetableSemester) {
  const { isLoggedIn, isReady } = useAuth();
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const isQueryReady = isInitialized && isReady && isLoggedIn;

  const query = useQuery({
    queryKey: ['timetable-data', year, semester],
    queryFn: () => fetchTimetable(year, semester),
    select: (data) => data.timetable ?? [],
    staleTime: 1000 * 60 * 5,
    enabled: isQueryReady,
  });

  return {
    ...query,
    isQueryReady,
    displayErrorMessage: query.error ? getErrorMessage('timetable', query.error, 'fetch') : null,
  };
}
