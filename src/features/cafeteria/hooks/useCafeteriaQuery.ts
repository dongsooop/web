'use client';

import { useQuery } from '@tanstack/react-query';
import { errorMessage } from '@/lib/errors/messages';
import { mapCafeteriaResponseToUi } from '../mapper';
import { fetcher } from '@/utils/request';
import { getWeekKey } from '@/utils/date/date';
import { useAppCheckStore } from '@/store/useAppCheckStore';

export const useCafeteriaQuery = () => {
  const { isInitialized } = useAppCheckStore();
  const weekKey = getWeekKey();

  const query = useQuery({
    queryKey: ['cafeteria-data', weekKey],
    queryFn: () => fetcher('/cafeteria'),
    select: (data) => mapCafeteriaResponseToUi(data),
    staleTime: 1000 * 60 * 60 * 24 * 7,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    enabled: isInitialized,
  });

  return {
    ...query,
    displayErrorMessage: query.error ? errorMessage('cafeteria', query.error) : null,
  };
};
