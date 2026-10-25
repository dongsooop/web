'use client';

import { categoryOptions } from '@/features/restaurant/category';
import type { RestaurantCategoryFilter } from '@/features/restaurant/options';

type RestaurantHeaderProps = {
  selectedCategory: RestaurantCategoryFilter;
  onCategoryAction: (category: RestaurantCategoryFilter) => void;
};

export function RestaurantHeader({ selectedCategory, onCategoryAction }: RestaurantHeaderProps) {
  return (
    <div
      className="border-surface-border scrollbar-hidden mt-5 overflow-x-auto border-b pb-4"
      aria-label="맛집 카테고리"
    >
      <div className="flex min-w-max gap-2">
        {categoryOptions.map((category) => {
          const active = selectedCategory === category.value;

          return (
            <button
              key={category.value}
              type="button"
              onClick={() => onCategoryAction(category.value)}
              aria-pressed={active}
              className={`text-bodySm focus-visible:ring-primary min-h-11 cursor-pointer rounded-lg border px-4 font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                active
                  ? 'border-primary bg-primary text-white'
                  : 'border-surface-border text-surface-muted hover:border-primary/30 hover:text-primary bg-white'
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
