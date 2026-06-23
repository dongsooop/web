import type { RestaurantCategoryLabel } from '../options';

export type RestaurantItem = {
  id: number;
  name: string;
  distance: number;
  placeUrl: string;
  likeCount: number;
  tags: string[];
  category: RestaurantCategoryLabel;
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
