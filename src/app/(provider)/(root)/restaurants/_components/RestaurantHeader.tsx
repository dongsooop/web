'use client';

import { Plus, Search } from 'lucide-react';

import {
  restaurantCategories,
  type RestaurantCategoryFilter,
} from '@/features/restaurant/constants';

type RestaurantHeaderProps = {
  selectedCategory: RestaurantCategoryFilter;
  onCategoryAction: (category: RestaurantCategoryFilter) => void;
};

export function RestaurantHeader({ selectedCategory, onCategoryAction }: RestaurantHeaderProps) {
  return (
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
            {restaurantCategories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => onCategoryAction(category.value)}
                className={`text-bodySm h-11 cursor-pointer rounded-full border px-4 font-semibold transition ${
                  selectedCategory === category.value
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray2 text-gray6 bg-white'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
