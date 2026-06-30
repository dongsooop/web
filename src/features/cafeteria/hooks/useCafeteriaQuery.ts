'use client';

import { useQuery } from '@tanstack/react-query';

import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';
import { getWeekKey } from '@/utils/date';

import { fetchCafeteria } from '../client/cafeteria.api';
import { mapCafeteriaResponseToUi } from '../mapper';
import type { CafeteriaResponse } from '../types';

type UseCafeteriaQueryOptions = {
  enabled?: boolean;
};

export const useCafeteriaQuery = ({ enabled = true }: UseCafeteriaQueryOptions = {}) => {
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const weekKey = getWeekKey();

  const query = useQuery({
    queryKey: ['cafeteria-data', weekKey],
    queryFn: () => fetchCafeteria(),
    select: (data: CafeteriaResponse) => mapCafeteriaResponseToUi(data),
    staleTime: 1000 * 60 * 5,
    enabled: isInitialized && enabled,
  });

  return {
    ...query,
    displayErrorMessage: query.error ? getErrorMessage('cafeteria', query.error) : null,
  };
};
