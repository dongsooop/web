'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { getErrorMessage } from '@/lib/errors/messages';
import { useToastStore } from '@/store/useToastStore';

import type { RestaurantCreateRequest } from '../types/request';
import type { RestaurantSearchItem } from '../types/ui-model';
import type { RestaurantTagKey } from '../options';
import { useCreateRestaurant } from './useCreateRestaurant';

export function useRestaurantWrite(selectedPlace: RestaurantSearchItem | null) {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const createRestaurant = useCreateRestaurant();
  const [category, setCategory] = useState<RestaurantCreateRequest['category'] | null>(null);
  const [selectedTags, setSelectedTags] = useState<RestaurantTagKey[]>([]);

  const displayErrorMessage = createRestaurant.error
    ? getErrorMessage('restaurant', createRestaurant.error, 'create')
    : null;

  function toggleTag(tag: RestaurantTagKey) {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((item) => item !== tag);
      }

      if (prev.length >= 3) {
        return prev;
      }

      return [...prev, tag];
    });
  }

  async function submit() {
    if (!selectedPlace) {
      showToast('가게를 먼저 선택해주세요.', 'error');
      return;
    }

    if (!category) {
      showToast('카테고리를 선택해주세요.', 'error');
      return;
    }

    await createRestaurant.mutateAsync({
      externalMapId: selectedPlace.externalMapId,
      name: selectedPlace.name,
      placeUrl: selectedPlace.placeUrl,
      distance: selectedPlace.distance,
      category,
      tags: selectedTags,
    });

    router.push('/restaurants');
  }

  return {
    category,
    selectedTags,
    tagCount: selectedTags.length,
    isSubmitting: createRestaurant.isPending,
    displayErrorMessage,
    selectCategory: setCategory,
    toggleTag,
    submit,
  };
}
