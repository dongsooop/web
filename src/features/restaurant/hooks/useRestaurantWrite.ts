'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { getErrorMessage } from '@/lib/errors/messages';
import { useToastStore } from '@/store/useToastStore';

import type { RestaurantCreateRequest } from '../types/request';
import type { RestaurantSearchItem } from '../types/ui-model';
import type { RestaurantTagKey } from '../options';
import { useRestaurantCreate } from './useRestaurantCreate';
import { useRestaurantDuplication } from './useRestaurantDuplication';

export function useRestaurantWrite(selectedPlace: RestaurantSearchItem | null) {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const createRestaurant = useRestaurantCreate();
  const duplication = useRestaurantDuplication(selectedPlace?.externalMapId);
  const [category, setCategory] = useState<RestaurantCreateRequest['category'] | null>(null);
  const [selectedTags, setSelectedTags] = useState<RestaurantTagKey[]>([]);

  const displayErrorMessage =
    duplication.displayErrorMessage ??
    (createRestaurant.error
      ? getErrorMessage('restaurant', createRestaurant.error, 'create')
      : null);

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

    if (duplication.isFetching) {
      showToast('가게 중복 여부를 확인하고 있어요. 잠시만 기다려주세요.', 'error');
      return;
    }

    if (duplication.isDuplicate) {
      showToast('이미 등록된 맛집이에요.', 'error');
      return;
    }

    if (!category) {
      showToast('카테고리를 선택해주세요.', 'error');
      return;
    }

    try {
      await createRestaurant.mutateAsync({
        externalMapId: selectedPlace.externalMapId,
        name: selectedPlace.name,
        placeUrl: selectedPlace.placeUrl,
        distance: selectedPlace.distance,
        category,
        tags: selectedTags,
      });

      showToast('맛집 추천이 등록되었어요!', 'success', 'shadow-none');
      router.push('/restaurants');
    } catch (error: unknown) {
      showToast(getErrorMessage('restaurant', error, 'create'), 'error');
    }
  }

  return {
    category,
    selectedTags,
    tagCount: selectedTags.length,
    isSubmitting: createRestaurant.isPending,
    isCheckingDuplicate: duplication.isFetching,
    isDuplicate: duplication.isDuplicate,
    displayErrorMessage,
    selectCategory: setCategory,
    toggleTag,
    submit,
  };
}
