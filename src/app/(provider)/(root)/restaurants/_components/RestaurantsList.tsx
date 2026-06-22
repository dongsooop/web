'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronDown, Plus } from 'lucide-react';

import { Divider } from '@/components/ui/Divider';
import { Skeleton } from '@/components/ui/Skeleton';
import { useRestaurantList } from '@/features/restaurant/hooks/useRestaurantList';

import { RestaurantCard } from './RestaurantCard';
import { RestaurantHeader } from './RestaurantHeader';

export default function RestaurantsList() {
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
      <div className="max-w-content mx-auto flex w-full flex-col gap-4 pb-8 sm:gap-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hover:bg-gray1 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
              aria-label="홈으로 돌아가기"
            >
              <ArrowLeft className="h-5 w-5 text-black" />
            </Link>

            <h1 className="text-heading sm:text-title min-w-0 font-bold text-black">
              학교 근처 맛집 추천
            </h1>
          </div>

          <p className="text-bodySm text-gray6 sm:text-body px-2">
            동미대 학생들이 추천하는 맛집을 한 화면에서 살펴보세요
          </p>
        </div>

        <RestaurantHeader selectedCategory={selectedCategory} onCategoryAction={selectCategory} />

        <section className="border-gray2 rounded-3xl border bg-white px-4 py-8">
          <div className="flex flex-col">
            {isInitialLoading ? (
              <Skeleton className="h-120 rounded-2xl sm:h-130" />
            ) : (
              visibleItems.map((restaurant, index) => (
                <div key={restaurant.id}>
                  <RestaurantCard
                    restaurant={restaurant}
                    isLiking={isLiking && likingId === restaurant.id}
                    onLikeAction={likeRestaurant}
                  />
                  {index < visibleItems.length - 1 ? <Divider className="py-6" /> : null}
                </div>
              ))
            )}

            {!isInitialLoading && !items.length ? (
              <div className="text-bodySm text-gray5 border-gray2 flex min-h-40 items-center justify-center rounded-2xl border border-dashed px-4 text-center">
                {isError && displayErrorMessage
                  ? displayErrorMessage
                  : '조건에 맞는 맛집이 없어요.'}
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex justify-center">
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
