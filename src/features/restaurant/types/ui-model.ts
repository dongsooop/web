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
  likeCount: number;
  likeText: string;
  tags: string[];
  externalMapId: string;
  category: RestaurantCategoryKey;
  categoryLabel: string;
  isLikedByMe: boolean;
};

export type RestaurantPageUi = {
  items: RestaurantUiItem[];
  hasMore: boolean;
};
