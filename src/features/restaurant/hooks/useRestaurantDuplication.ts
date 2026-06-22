'use client';

import { useQuery } from '@tanstack/react-query';

import { getErrorMessage } from '@/lib/errors/messages';

import { checkRestaurantDuplication } from '../client/restaurant.api';

export function useRestaurantDuplication(externalMapId?: string) {
  const normalized = externalMapId?.trim() ?? '';

  const duplication = useQuery({
    queryKey: ['restaurant-duplication', normalized],
    queryFn: () => checkRestaurantDuplication(normalized),
    enabled: normalized.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...duplication,
    isDuplicate: duplication.data?.isDuplicate ?? false,
    displayErrorMessage: duplication.error
      ? getErrorMessage('restaurant', duplication.error, 'duplicate')
      : null,
  };
}
