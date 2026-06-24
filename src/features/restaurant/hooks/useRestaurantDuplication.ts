'use client';

import { useQuery } from '@tanstack/react-query';

import { getErrorMessage } from '@/lib/errors/messages';
import { useAppCheckStore } from '@/store/useAppCheckStore';

import { checkDuplication } from '../client/restaurant.api';

export function useRestaurantDuplication(externalMapId?: string) {
  const normalized = externalMapId?.trim() ?? '';
  const isInitialized = useAppCheckStore((state) => state.isInitialized);
  const isQueryReady = isInitialized && normalized.length > 0;

  const duplication = useQuery({
    queryKey: ['restaurant-duplication', normalized],
    queryFn: () => checkDuplication(normalized),
    enabled: isQueryReady,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...duplication,
    isQueryReady,
    isDuplicate: duplication.data?.isDuplicate ?? false,
    displayErrorMessage: duplication.error
      ? getErrorMessage('restaurant', duplication.error, 'duplicate')
      : null,
  };
}
