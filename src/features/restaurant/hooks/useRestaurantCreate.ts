'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getErrorMessage } from '@/lib/errors/messages';

import { createRestaurant } from '../client/restaurant.api';
import type { RestaurantCreateRequest } from '../types/request';

export function useRestaurantCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RestaurantCreateRequest) => createRestaurant(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['restaurant-list'],
      });
    },
    meta: {
      errorMessage: (error: unknown) => getErrorMessage('restaurant', error, 'create'),
    },
  });
}
