'use client';

import { useState } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLoginRequiredDialog } from '@/features/auth/hooks/useLoginRequiredDialog';

import type { RestaurantCategoryFilter } from '../options';
import type { RestaurantItem } from '../types/ui-model';
import { useRestaurantQuery } from './useRestaurantQuery';
import { useRestaurantLike } from './useRestaurantLike';

const INITIAL_VISIBLE_COUNT = 7;

export function useRestaurantList() {
  const [selectedCategory, setSelectedCategory] = useState<RestaurantCategoryFilter>('ALL');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const { isLoggedIn } = useAuth();
  const openLoginDialog = useLoginRequiredDialog();
  const toggleLike = useRestaurantLike();
  const query = useRestaurantQuery(selectedCategory);

  const visibleItems = query.items.slice(0, visibleCount);
  const canShowMore = visibleCount < query.items.length || query.hasMore;

  function selectCategory(category: RestaurantCategoryFilter) {
    setSelectedCategory(category);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  function likeRestaurant(restaurant: RestaurantItem) {
    if (!isLoggedIn) {
      openLoginDialog();
      return;
    }

    toggleLike.mutate({
      id: restaurant.id,
      isAdding: !restaurant.isLikedByMe,
    });
  }

  async function showMore() {
    if (visibleCount < query.items.length) {
      setVisibleCount((count) => count + INITIAL_VISIBLE_COUNT);
      return;
    }

    const result = await query.fetchNextPage();

    if (!result.isError) {
      setVisibleCount((count) => count + INITIAL_VISIBLE_COUNT);
    }
  }

  return {
    selectedCategory,
    visibleItems,
    canShowMore,
    showMore,
    selectCategory,
    likeRestaurant,
    isLiking: toggleLike.isPending,
    likingId: toggleLike.variables?.id ?? null,
    ...query,
  };
}
