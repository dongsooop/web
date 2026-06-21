export type RestaurantCategoryKey =
  | 'KOREAN'
  | 'CHINESE'
  | 'JAPANESE'
  | 'WESTERN'
  | 'BUNSIK'
  | 'FAST_FOOD'
  | 'CAFE_DESSERT';

export type RestaurantUiItem = {
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

export type RestaurantPageUi = {
  items: RestaurantUiItem[];
  hasMore: boolean;
};

export type RestaurantSearchItemUi = {
  externalMapId: string;
  name: string;
  address: string;
  placeUrl: string;
  distance: number;
};
