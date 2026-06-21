'use client';

import Link from 'next/link';
import { ChevronDown, Plus } from 'lucide-react';

import { INITIAL_VISIBLE_COUNT } from '@/features/restaurant/constants';
import { useRestaurantList } from '@/features/restaurant/hooks/useRestaurantList';

import { RestaurantCard } from './RestaurantCard';
import { RestaurantCardSkeleton } from './RestaurantCardSkeleton';
import { RestaurantHeader } from './RestaurantHeader';

export default function RestaurantsContent() {
  const {
    selectedCategory,
    selectCategory,
    items,
    visibleItems,
    canShowMore,
    showMore,
    likeRestaurant,
    isLiking,
    likingId,
    isInitialLoading,
    isFetchingNextPage,
    isError,
    displayErrorMessage,
  } = useRestaurantList();

  return (
    <div className="w-full">
      <div className="max-w-content mx-auto flex w-full flex-col gap-4 px-4 pb-8 sm:gap-5">
        <RestaurantHeader selectedCategory={selectedCategory} onCategoryAction={selectCategory} />

        <section className="border-gray2 rounded-3xl border bg-white px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex flex-col gap-3">
            {isInitialLoading
              ? Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, index) => (
                  <RestaurantCardSkeleton key={index} />
                ))
              : visibleItems.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    isLiking={isLiking && likingId === restaurant.id}
                    onLikeAction={likeRestaurant}
                  />
                ))}

            {!isInitialLoading && !items.length ? (
              <div className="text-bodySm text-gray5 border-gray2 flex min-h-40 items-center justify-center rounded-2xl border border-dashed px-4 text-center">
                {isError && displayErrorMessage
                  ? displayErrorMessage
                  : '조건에 맞는 맛집이 없어요.'}
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex justify-center">
            {canShowMore ? (
              <button
                type="button"
                onClick={showMore}
                disabled={isFetchingNextPage}
                className="border-gray2 text-bodySm hover:border-primary/20 hover:bg-primary/5 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border bg-white px-6 font-semibold text-black transition disabled:cursor-default disabled:opacity-60"
              >
                {isFetchingNextPage ? (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    aria-hidden="true"
                  />
                ) : null}
                더 많은 맛집 보기
                {!isFetchingNextPage ? <ChevronDown className="h-4 w-4" /> : null}
              </button>
            ) : null}
          </div>
        </section>
      </div>

      <Link
        href="/restaurants/write"
        className="bg-primary fixed right-5 bottom-6 z-30 inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full text-white lg:hidden"
        aria-label="맛집 추가하기"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}
