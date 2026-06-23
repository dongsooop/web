'use client';

import Link from 'next/link';
import { ChevronDown, Plus } from 'lucide-react';

import { Divider } from '@/components/ui/Divider';
import PageHeader from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { useRestaurantList } from '@/features/restaurant/hooks/useRestaurantList';

import { RestaurantCard } from './RestaurantCard';
import { RestaurantHeader } from './RestaurantHeader';

export default function RestaurantsList() {
  const {
    selectedCategory,
    selectCategory,
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
    <div className="max-w-content mx-auto flex w-full flex-col gap-4">
      <PageHeader
        title="학교 근처 맛집 추천"
        description="동미대 학생들이 추천하는 맛집을 한 화면에서 살펴보세요"
        backHref="/"
        backLabel="홈으로 돌아가기"
      />

      <RestaurantHeader selectedCategory={selectedCategory} onCategoryAction={selectCategory} />

      <section className="border-gray2 flex min-h-40 flex-col rounded-xl border bg-white px-4 py-2">
        <div className="flex flex-1 flex-col">
          {isInitialLoading ? (
            <Skeleton className="h-[44rem] rounded-xl sm:h-[46rem]" />
          ) : visibleItems.length > 0 ? (
            visibleItems.map((restaurant, index) => (
              <div key={restaurant.id}>
                <RestaurantCard
                  restaurant={restaurant}
                  isLiking={isLiking && likingId === restaurant.id}
                  onLikeAction={likeRestaurant}
                />
                {index < visibleItems.length - 1 ? <Divider spacing={false} /> : null}
              </div>
            ))
          ) : (
            <div className="flex flex-1 items-center justify-center px-4 text-center">
              <span className="text-bodySm text-gray5 inline-flex items-center leading-none">
                {isError && displayErrorMessage
                  ? displayErrorMessage
                  : '조건에 맞는 맛집이 없어요.'}
              </span>
            </div>
          )}
        </div>

        <div className="my-6 flex justify-center">
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
