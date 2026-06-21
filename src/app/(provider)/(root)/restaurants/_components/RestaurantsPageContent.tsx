'use client';

import { useState } from 'react';
import {
  Coffee,
  ChevronDown,
  Hamburger,
  Heart,
  MapPin,
  Pizza,
  Plus,
  Search,
  Soup,
  UtensilsCrossed,
  Fish,
} from 'lucide-react';

import { Skeleton, SkeletonCircle, SkeletonText } from '@/components/ui/Skeleton';
import { useRestaurantQuery } from '@/features/restaurant/hooks/useRestaurantQuery';
import type { RestaurantCategoryKey, RestaurantUiItem } from '@/features/restaurant/types/ui-model';

type Category = {
  label: string;
  value: RestaurantCategoryKey | 'ALL';
};

function BowlChopsticksIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-7 w-7"
    >
      <path d="M7 4.5 9.5 11" />
      <path d="M12.5 4.5 15 11" />
      <path d="M4 12.5c1.8-1.7 4.8-2.5 8-2.5s6.2.8 8 2.5" />
      <path d="M4 12.5c0 2.5 3.6 4.5 8 4.5s8-2 8-4.5" />
      <path d="M5 14c.8 3.4 3.7 5.5 7 5.5s6.2-2.1 7-5.5" />
    </svg>
  );
}

const categories: Category[] = [
  { label: '전체', value: 'ALL' },
  { label: '한식', value: 'KOREAN' },
  { label: '중식', value: 'CHINESE' },
  { label: '일식', value: 'JAPANESE' },
  { label: '양식', value: 'WESTERN' },
  { label: '분식', value: 'BUNSIK' },
  { label: '패스트푸드', value: 'FAST_FOOD' },
  { label: '카페/디저트', value: 'CAFE_DESSERT' },
];

const categoryIcon: Record<RestaurantCategoryKey, React.ReactNode> = {
  KOREAN: <UtensilsCrossed className="h-7 w-7" />,
  CHINESE: <BowlChopsticksIcon />,
  JAPANESE: <Fish className="h-7 w-7" />,
  WESTERN: <Pizza className="h-7 w-7" />,
  BUNSIK: <Soup className="h-7 w-7" />,
  FAST_FOOD: <Hamburger className="h-7 w-7" />,
  CAFE_DESSERT: <Coffee className="h-7 w-7" />,
};

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gray1 text-caption text-gray6 rounded-full px-2.5 py-1 font-medium">
      {children}
    </span>
  );
}

function RestaurantCard({ restaurant }: { restaurant: RestaurantUiItem }) {
  return (
    <article className="border-gray2 min-h-14 cursor-pointer rounded-2xl border bg-white px-4 py-4 sm:px-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="text-primary bg-gray7 flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16">
          {categoryIcon[restaurant.category]}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-heading truncate font-bold text-black">{restaurant.name}</h2>
              <div className="text-caption text-gray5 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {restaurant.distanceText}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5 fill-current" />
                  {restaurant.likeText}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="text-primary hover:bg-primary/5 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
              aria-label={`${restaurant.name} 찜하기`}
            >
              <Heart className={`h-4 w-4 ${restaurant.likedByMe ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Tag>{restaurant.categoryLabel}</Tag>
            {restaurant.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function RestaurantCardSkeleton() {
  return (
    <article className="border-gray2 min-h-14 rounded-2xl border bg-white px-4 py-4 sm:px-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <SkeletonCircle className="h-14 w-14 sm:h-16 sm:w-16" />
        <div className="flex-1 space-y-3">
          <SkeletonText className="h-6 w-32" />
          <SkeletonText className="w-44" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-14 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
        </div>
        <SkeletonCircle className="h-11 w-11" />
      </div>
    </article>
  );
}

export default function RestaurantsPageContent() {
  const [selectedCategory, setSelectedCategory] = useState<RestaurantCategoryKey | 'ALL'>('ALL');
  const {
    items,
    hasMore,
    isInitialLoading,
    isFetchingNextPage,
    fetchNextPage,
    isError,
    displayErrorMessage,
  } = useRestaurantQuery(selectedCategory);

  return (
    <div className="w-full">
      <div className="max-w-content mx-auto flex w-full flex-col gap-4 px-4 pb-8 sm:gap-5">
        <section className="border-gray2 rounded-3xl border bg-white px-4 py-5 sm:px-6 sm:py-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-caption text-primary font-semibold uppercase">Dongsoop Picks</p>
                <div className="space-y-1">
                  <h1 className="text-title font-bold text-black">학교 근처 맛집 추천</h1>
                  <p className="text-bodySm text-gray6 sm:text-body">
                    동미대 학생들이 추천하는 맛집을 한 화면에서 살펴보세요.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:pt-4">
                <button
                  type="button"
                  className="text-primary border-primary/10 bg-primary/5 text-bodySm hover:bg-primary/10 hidden min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 font-semibold shadow-sm transition lg:inline-flex"
                >
                  <Plus className="h-4 w-4" />
                  맛집 추가하기
                </button>

                <label className="border-gray2 flex min-h-11 w-full cursor-text items-center gap-2 rounded-2xl border bg-white px-4 lg:w-[240px]">
                  <Search className="text-gray5 h-4 w-4 cursor-pointer" />
                  <input
                    type="search"
                    placeholder="가게 검색"
                    className="text-bodySm placeholder:text-gray5 w-full bg-transparent text-black outline-none"
                  />
                </label>
              </div>
            </div>

            <div className="scrollbar-hidden overflow-x-auto overflow-y-visible py-1">
              <div className="flex min-w-max gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category.value);
                    }}
                    className={`text-bodySm h-11 cursor-pointer rounded-full border px-4 font-semibold transition ${
                      selectedCategory === category.value
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray2 bg-white text-gray6'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-gray2 rounded-3xl border bg-white px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex flex-col gap-3">
            {isInitialLoading
              ? Array.from({ length: 7 }, (_, index) => <RestaurantCardSkeleton key={index} />)
              : items.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}

            {!isInitialLoading && !items.length ? (
              <div className="text-bodySm text-gray5 flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-gray2 px-4 text-center">
                {isError && displayErrorMessage ? displayErrorMessage : '조건에 맞는 맛집이 없어요.'}
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex justify-center">
            {hasMore ? (
              <button
                type="button"
                onClick={() => {
                  fetchNextPage();
                }}
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

      <button
        type="button"
        className="bg-primary fixed right-5 bottom-6 z-30 inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full text-white lg:hidden"
        aria-label="맛집 추가하기"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
