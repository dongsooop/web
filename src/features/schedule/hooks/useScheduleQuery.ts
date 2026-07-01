import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';

import { fetchSchedule } from '../client/schedule.api';
import { toModelList } from '../mapper';

export function useScheduleQuery(month: string) {
  const { isLoggedIn, isReady } = useAuth();
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const isQueryReady = isInitialized && isReady;

  const query = useQuery({
    queryKey: ['schedule-data', isLoggedIn ? 'auth' : 'guest', month],
    queryFn: () => fetchSchedule(month, isLoggedIn),
    select: toModelList,
    staleTime: 1000 * 60 * 5,
    enabled: isQueryReady,
  });

  return {
    ...query,
    isQueryReady,
    displayErrorMessage: query.error ? getErrorMessage('schedule', query.error, 'fetch') : null,
  };
}
