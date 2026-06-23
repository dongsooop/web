'use client';

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';

import { getErrorMessage } from '@/lib/errors/messages';

import { likeRestaurant } from '../client/restaurant.api';
import type { RestaurantPage } from '../types/ui-model';

type ToggleVars = {
  id: number;
  isAdding: boolean;
};

function patchRestaurantPage(data: InfiniteData<RestaurantPage> | undefined, vars: ToggleVars) {
  if (!data) {
    return data;
  }

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((restaurant) => {
        if (restaurant.id !== vars.id) {
          return restaurant;
        }

        const likeCount = Math.max(0, restaurant.likeCount + (vars.isAdding ? 1 : -1));

        return {
          ...restaurant,
          isLikedByMe: vars.isAdding,
          likeCount,
        };
      }),
    })),
  };
}

export function useRestaurantLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isAdding }: ToggleVars) => likeRestaurant(id, isAdding),
    onMutate: async (vars) => {
      await queryClient.cancelQueries({
        queryKey: ['restaurant-list'],
      });

      const snapshots = queryClient.getQueriesData<InfiniteData<RestaurantPage>>({
        queryKey: ['restaurant-list'],
      });

      queryClient.setQueriesData<InfiniteData<RestaurantPage>>(
        { queryKey: ['restaurant-list'] },
        (data) => patchRestaurantPage(data, vars),
      );

      return { snapshots };
    },
    onError: (_error, _vars, context) => {
      context?.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['restaurant-list'],
      });
    },
    meta: {
      errorMessage: (error: unknown) => getErrorMessage('restaurant', error, 'like'),
    },
  });
}
