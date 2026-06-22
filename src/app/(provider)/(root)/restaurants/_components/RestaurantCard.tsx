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
      onClick={() => {
        if (!restaurant.placeUrl) {
          return;
        }

        window.open(restaurant.placeUrl, '_blank', 'noopener,noreferrer');
      }}
      className="min-h-14 cursor-pointer bg-white py-8 sm:px-5"
    >
      <div className="grid gap-y-2">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3">
          <div className="text-primary bg-gray7 flex h-11 w-11 shrink-0 items-center justify-center rounded-full [&>svg]:h-6 [&>svg]:w-6">
            {categoryIcon[restaurant.category]}
          </div>

          <h2 className="text-heading truncate font-bold text-black">{restaurant.name}</h2>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLikeAction(restaurant);
            }}
            disabled={isLiking}
            className="text-primary hover:bg-primary/5 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
            aria-label={`${restaurant.name} 찜하기`}
          >
            <Heart
              className={`h-5 w-5 ${restaurant.isLikedByMe ? 'text-primary fill-current' : 'text-primary'} ${isLiking ? 'opacity-60' : ''}`}
            />
          </button>
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
    </article>
  );
}
