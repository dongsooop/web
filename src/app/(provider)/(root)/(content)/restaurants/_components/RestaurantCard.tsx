'use client';

import { ArrowUpRight, Heart, MapPin } from 'lucide-react';

import { categoryIcon } from '@/features/restaurant/category';
import type { RestaurantItem } from '@/features/restaurant/types/ui-model';

type RestaurantCardProps = {
  restaurant: RestaurantItem;
  isLiking: boolean;
  onLikeAction: (restaurant: RestaurantItem) => void;
};

export function RestaurantCard({ restaurant, isLiking, onLikeAction }: RestaurantCardProps) {
  return (
    <article className="border-surface-border hover:border-primary/30 group relative flex h-full min-w-0 flex-col rounded-xl border bg-white p-4 transition-colors sm:p-5">
      {restaurant.placeUrl ? (
        <a
          href={restaurant.placeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-visible:ring-primary absolute inset-0 rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label={`${restaurant.name} 상세 정보 새 창에서 열기`}
        />
      ) : null}

      <div className="pointer-events-none relative flex min-w-0 items-start gap-3">
        <span
          className="bg-surface-blue flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sky-700 [&>svg]:h-6 [&>svg]:w-6"
          aria-hidden="true"
        >
          {categoryIcon[restaurant.category]}
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="text-body group-hover:text-primary truncate font-bold text-black transition-colors">
            {restaurant.name}
          </h3>
          <p className="text-caption text-surface-muted mt-1 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {Math.round(restaurant.distance)}m · {restaurant.category}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onLikeAction(restaurant)}
          disabled={isLiking}
          aria-pressed={restaurant.isLikedByMe}
          aria-label={`${restaurant.name} ${restaurant.isLikedByMe ? '좋아요 취소' : '좋아요 추가'}`}
          className="text-primary hover:bg-surface-blue focus-visible:ring-primary pointer-events-auto relative z-10 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-wait disabled:opacity-60"
        >
          <Heart
            className={`h-5 w-5 ${restaurant.isLikedByMe ? 'fill-current' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="pointer-events-none relative mt-5 flex min-h-7 min-w-0 flex-wrap gap-1.5 pb-5">
        {restaurant.tags.map((tag) => (
          <span
            key={tag}
            className="bg-surface-soft text-caption text-surface-muted rounded-md px-2 py-1 font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="border-surface-border text-caption text-surface-muted pointer-events-none relative mt-auto flex items-center justify-between gap-2 border-t pt-4 font-medium">
        <span className="flex items-center gap-1">
          <Heart className="h-3.5 w-3.5" aria-hidden="true" />
          {restaurant.likeCount}명이 좋아해요
        </span>
        {restaurant.placeUrl ? (
          <span className="group-hover:text-primary flex items-center gap-0.5 transition-colors">
            가게 보기 <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </article>
  );
}
