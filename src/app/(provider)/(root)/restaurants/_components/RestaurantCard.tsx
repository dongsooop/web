'use client';

import { Heart, MapPin } from 'lucide-react';

import { restaurantCategoryIcon } from '@/features/restaurant/constants';
import type { RestaurantItem } from '@/features/restaurant/types/ui-model';

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gray1 text-caption text-gray6 rounded-full px-2.5 py-1 font-medium">
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
      className="border-gray2 min-h-14 cursor-pointer rounded-2xl border bg-white p-4 sm:px-5"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="text-primary bg-gray7 flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16">
          {restaurantCategoryIcon[restaurant.category]}
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
              onClick={(e) => {
                e.stopPropagation();
                onLikeAction(restaurant);
              }}
              disabled={isLiking}
              className="text-primary hover:bg-primary/5 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
              aria-label={`${restaurant.name} 찜하기`}
            >
              <Heart
                className={`h-4 w-4 ${restaurant.isLikedByMe ? 'text-primary fill-current' : 'text-primary'} ${isLiking ? 'opacity-60' : ''}`}
              />
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
