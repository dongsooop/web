import type { RestaurantCategoryKey } from '../options';

export type RestaurantItem = {
  id: number;
  name: string;
  distance: number;
  distanceText: string;
  placeUrl: string;
  likeCount: number;
  likeText: string;
  tags: string[];
  category: RestaurantCategoryKey;
  categoryLabel: string;
  isLikedByMe: boolean;
};

export type RestaurantPage = {
  items: RestaurantItem[];
  hasMore: boolean;
};

export type RestaurantSearchItem = {
  externalMapId: string;
  name: string;
  address: string;
  placeUrl: string;
  distance: number;
};
