'use client';

import {
  Coffee,
  Hamburger,
  Pizza,
  Soup,
  UtensilsCrossed,
  Fish,
} from 'lucide-react';

import { restaurantCategories } from './options';
import type { RestaurantCategoryKey } from './types/ui-model';

export const INITIAL_VISIBLE_COUNT = 7;

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

export { restaurantCategories };

export const restaurantCategoryIcon: Record<RestaurantCategoryKey, React.ReactNode> = {
  KOREAN: <UtensilsCrossed className="h-7 w-7" />,
  CHINESE: <BowlChopsticksIcon />,
  JAPANESE: <Fish className="h-7 w-7" />,
  WESTERN: <Pizza className="h-7 w-7" />,
  BUNSIK: <Soup className="h-7 w-7" />,
  FAST_FOOD: <Hamburger className="h-7 w-7" />,
  CAFE_DESSERT: <Coffee className="h-7 w-7" />,
};
