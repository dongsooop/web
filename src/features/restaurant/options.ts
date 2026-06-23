export type RestaurantCategoryKey =
  | 'KOREAN'
  | 'CHINESE'
  | 'JAPANESE'
  | 'WESTERN'
  | 'BUNSIK'
  | 'FAST_FOOD'
  | 'CAFE_DESSERT';

export type RestaurantCategoryLabel =
  | '한식'
  | '중식'
  | '일식'
  | '양식'
  | '분식'
  | '패스트푸드'
  | '카페/디저트';

export type RestaurantCategoryFilter = RestaurantCategoryKey | 'ALL';

export const restaurantTags = [
  { label: '맛있어요', value: 'DELICIOUS' },
  { label: '점심으로 괜찮아요', value: 'GOOD_FOR_LUNCH' },
  { label: '혼밥하기 좋아요', value: 'GOOD_FOR_SOLO' },
  { label: '양이 많아요', value: 'LARGE_PORTION' },
  { label: '가성비가 좋아요', value: 'GOOD_VALUE' },
  { label: '회식하기 좋아요', value: 'GOOD_FOR_GATHERING' },
  { label: '대화하기 괜찮아요', value: 'GOOD_FOR_CONVERSATION' },
  { label: '메뉴가 다양해요', value: 'VARIOUS_MENU' },
] as const;

export type RestaurantTagKey = (typeof restaurantTags)[number]['value'];
