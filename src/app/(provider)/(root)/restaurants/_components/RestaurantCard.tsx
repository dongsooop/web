'use client';

import { Heart, MapPin } from 'lucide-react';

import { categoryIcon } from '@/features/restaurant/category';
import type { RestaurantItem } from '@/features/restaurant/types/ui-model';

function formatDistance(distance: number) {
  return `${Math.round(distance)}m`;
}

function formatLikes(likeCount: number) {
  return `${likeCount}명이 좋아하는 가게예요`;
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gray1 text-caption text-gray6 shrink-0 rounded-full px-2.5 py-1 font-medium whitespace-nowrap">
      {children}
    </span>
  );
}

type RestaurantCardProps = {
  restaurant: RestaurantItem;
  isLiking: boolean;
  onLikeAction: (restaurant: RestaurantItem) => void;
};

export function RestaurantCard({ restaurant, isLiking, onLikeAction }: RestaurantCardProps) {
  return (
    <article
      className={`relative min-h-14 bg-white py-8 sm:px-5 ${restaurant.placeUrl ? 'cursor-pointer' : ''}`}
    >
      {restaurant.placeUrl ? (
        <a
          href={restaurant.placeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-0 block cursor-pointer"
          aria-label={`${restaurant.name} 링크 열기`}
        >
          <span className="sr-only">{restaurant.name} 링크 열기</span>
        </a>
      ) : null}

      <div className="pointer-events-none relative z-10 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3">
        <div className="pointer-events-none min-w-0">
          <div className="grid gap-y-2">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3">
              <div className="text-primary bg-gray7 flex h-11 w-11 shrink-0 items-center justify-center rounded-full [&>svg]:h-6 [&>svg]:w-6">
                {categoryIcon[restaurant.category]}
              </div>

              <h2 className="text-heading truncate font-bold text-black">{restaurant.name}</h2>
            </div>

            <div className="text-caption text-gray5 inline-flex items-center gap-4">
              <span className="inline-flex shrink-0 items-center gap-1">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {formatDistance(restaurant.distance)}
                </span>
              </span>
              <span className="inline-flex min-w-0 items-center gap-1">
                <Heart className="h-3.5 w-3.5 fill-current" />
                {formatLikes(restaurant.likeCount)}
              </span>
            </div>

            <div className="scrollbar-hidden overflow-x-auto overflow-y-visible">
              <div className="flex min-w-max gap-2">
                <Tag>{restaurant.category}</Tag>
                {restaurant.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto flex h-11 w-11 items-start justify-end">
          <button
            type="button"
            onClick={() => onLikeAction(restaurant)}
            disabled={isLiking}
            className="text-primary hover:bg-primary/5 relative z-20 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
            aria-label={`${restaurant.name} 찜하기`}
          >
            <Heart
              className={`h-5 w-5 ${restaurant.isLikedByMe ? 'text-primary fill-current' : 'text-primary'} ${isLiking ? 'opacity-60' : ''}`}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
