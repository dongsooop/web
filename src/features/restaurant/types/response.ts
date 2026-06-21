export type RestaurantCategoryResponse =
  | 'KOREAN'
  | 'CHINESE'
  | 'JAPANESE'
  | 'WESTERN'
  | 'BUNSIK'
  | 'FAST_FOOD'
  | 'CAFE_DESSERT'
  | '한식'
  | '중식'
  | '일식'
  | '양식'
  | '분식'
  | '패스트푸드'
  | '카페/디저트';

export type RestaurantTagResponse = string;

export type RestaurantItemResponse = {
  id: number;
  name: string;
  distance: number;
  placeUrl: string;
  likeCount: number;
  tags: RestaurantTagResponse[];
  category: RestaurantCategoryResponse;
  isLikedByMe: boolean;
};

export type RestaurantListResponse = RestaurantItemResponse[];
