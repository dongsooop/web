import { Coffee, Hamburger, Pizza, Soup, UtensilsCrossed, Fish } from 'lucide-react';

import type {
  RestaurantCategoryFilter,
  RestaurantCategoryKey,
  RestaurantCategoryLabel,
} from './options';

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

export const categoryMap: Record<
  RestaurantCategoryKey,
  {
    label: RestaurantCategoryLabel;
    icon: React.ReactNode;
  }
> = {
  KOREAN: {
    label: '한식',
    icon: <UtensilsCrossed className="h-6 w-6" />,
  },
  CHINESE: {
    label: '중식',
    icon: <BowlChopsticksIcon />,
  },
  JAPANESE: {
    label: '일식',
    icon: <Fish className="h-6 w-6" />,
  },
  WESTERN: {
    label: '양식',
    icon: <Pizza className="h-6 w-6" />,
  },
  BUNSIK: {
    label: '분식',
    icon: <Soup className="h-6 w-6" />,
  },
  FAST_FOOD: {
    label: '패스트푸드',
    icon: <Hamburger className="h-6 w-6" />,
  },
  CAFE_DESSERT: {
    label: '카페/디저트',
    icon: <Coffee className="h-6 w-6" />,
  },
};

export const categoryKeys = Object.keys(categoryMap) as RestaurantCategoryKey[];

export const categoryOptions: {
  label: string;
  value: RestaurantCategoryFilter;
}[] = [
  { label: '전체', value: 'ALL' },
  ...categoryKeys.map((key) => ({
    label: categoryMap[key].label,
    value: key,
  })),
];

export const categoryKey: Record<RestaurantCategoryLabel, RestaurantCategoryKey> =
  Object.fromEntries(categoryKeys.map((key) => [categoryMap[key].label, key])) as Record<
    RestaurantCategoryLabel,
    RestaurantCategoryKey
  >;

export const categoryIcon: Record<RestaurantCategoryLabel, React.ReactNode> = Object.fromEntries(
  categoryKeys.map((key) => [categoryMap[key].label, categoryMap[key].icon]),
) as Record<RestaurantCategoryLabel, React.ReactNode>;
