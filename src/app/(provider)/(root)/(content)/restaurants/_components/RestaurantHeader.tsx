'use client';

import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

import { categoryOptions } from '@/features/restaurant/category';
import type { RestaurantCategoryFilter } from '@/features/restaurant/options';

type RestaurantHeaderProps = {
  selectedCategory: RestaurantCategoryFilter;
  onCategoryAction: (category: RestaurantCategoryFilter) => void;
};

export function RestaurantHeader({ selectedCategory, onCategoryAction }: RestaurantHeaderProps) {
  return (
    <section
      className="border-gray2 flex-1 rounded-xl border bg-white px-4 py-5 sm:px-6 sm:py-7"
      aria-label="맛집 검색 및 필터"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-title text-primary font-semibold uppercase">Dongsoop Picks</h2>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Link
              href="/restaurants/write"
              className="text-primary border-primary/10 bg-primary/5 text-bodySm hover:bg-primary/10 hidden min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 font-semibold shadow-sm transition lg:inline-flex"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              맛집 추가하기
            </Link>

            <label className="border-gray2 flex min-h-11 w-full cursor-text items-center gap-2 rounded-2xl border bg-white px-4 lg:w-[240px]">
              <Search className="text-gray5 h-4 w-4" aria-hidden="true" />

              <input
                type="search"
                placeholder="가게 검색"
                aria-label="가게 검색"
                className="text-bodySm placeholder:text-gray5 w-full bg-transparent text-black outline-none"
              />
            </label>
          </div>
        </div>

        <div
          className="scrollbar-hidden overflow-x-auto overflow-y-visible py-1"
          aria-label="맛집 카테고리"
        >
          <div className="flex min-w-max gap-2">
            {categoryOptions.map((category) => {
              const isSelected = selectedCategory === category.value;

              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => onCategoryAction(category.value)}
                  aria-pressed={isSelected}
                  className={`text-bodySm min-w-11 cursor-pointer rounded-full border px-3 py-2 font-semibold transition ${
                    isSelected
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray2 text-gray4 bg-white'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
