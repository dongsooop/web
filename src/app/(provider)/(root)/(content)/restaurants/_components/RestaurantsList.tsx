'use client';

import Link from 'next/link';
import { ArrowUpRight, ChevronDown, UtensilsCrossed } from 'lucide-react';

import { useRestaurantList } from '@/features/restaurant/hooks/useRestaurantList';

import { RestaurantCard } from './RestaurantCard';
import { RestaurantCardSkeleton } from './RestaurantCardSkeleton';
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
    <div className="home-dashboard">
      <header className="home-intro">
        <div>
          <p className="home-date">DONGSOOP PICKS</p>
          <h1>
            우리 학교 근처, 맛있게. <span aria-hidden="true">✳</span>
          </h1>
          <p className="home-subtitle">동양미래대학교 학생들이 추천하는 맛집을 둘러보세요.</p>
        </div>
        <span className="home-semester">캠퍼스 맛집</span>
      </header>

      <section className="home-card flex flex-col" aria-labelledby="restaurant-list-title">
        <div className="home-card-head">
          <div className="flex items-center gap-2">
            <span
              className="bg-surface-blue flex h-9 w-9 items-center justify-center rounded-lg text-sky-700"
              aria-hidden="true"
            >
              <UtensilsCrossed className="h-5 w-5" />
            </span>
            <h2 id="restaurant-list-title">학생 추천 맛집</h2>
          </div>
          <Link
            href="/restaurants/write"
            className="home-more focus-visible:ring-primary rounded-md focus-visible:ring-2 focus-visible:outline-none"
          >
            <span className="hidden sm:inline">맛집 추천하기</span>
            <span className="sm:hidden">추천하기</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <RestaurantHeader selectedCategory={selectedCategory} onCategoryAction={selectCategory} />

        <div className="mt-5 flex flex-1 flex-col">
          {isInitialLoading ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:gap-4" aria-hidden="true">
              {Array.from({ length: 6 }, (_, index) => (
                <li key={index}>
                  <RestaurantCardSkeleton />
                </li>
              ))}
            </ul>
          ) : visibleItems.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:gap-4">
              {visibleItems.map((restaurant) => (
                <li key={restaurant.id}>
                  <RestaurantCard
                    restaurant={restaurant}
                    isLiking={isLiking && likingId === restaurant.id}
                    onLikeAction={likeRestaurant}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="home-empty min-h-56" role={isError ? 'alert' : undefined}>
              <p>
                {isError && displayErrorMessage
                  ? displayErrorMessage
                  : '조건에 맞는 맛집이 없어요.'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          {canShowMore ? (
            <button
              type="button"
              onClick={showMore}
              disabled={isFetchingNextPage}
              className="border-surface-border text-bodySm hover:border-primary/30 hover:bg-surface-blue focus-visible:ring-primary inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-white px-5 font-semibold text-sky-700 transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-wait disabled:opacity-60"
            >
              {isFetchingNextPage ? (
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
              ) : null}
              더 많은 맛집 보기
              {!isFetchingNextPage ? <ChevronDown className="h-4 w-4" aria-hidden="true" /> : null}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
