import type { RestaurantCategoryKey } from './types/ui-model';

export type RestaurantCategoryFilter = RestaurantCategoryKey | 'ALL';

export type RestaurantTagKey =
  | 'LARGE_PORTION'
  | 'DELICIOUS'
  | 'GOOD_FOR_LUNCH'
  | 'GOOD_FOR_SOLO'
  | 'GOOD_VALUE'
  | 'GOOD_FOR_GATHERING'
  | 'GOOD_FOR_CONVERSATION'
  | 'VARIOUS_MENU';

type CategoryOption = {
  label: string;
  value: RestaurantCategoryFilter;
};

type TagOption = {
  label: string;
  value: RestaurantTagKey;
};

export const CATEGORY_LABEL_MAP: Record<RestaurantCategoryKey, string> = {
  KOREAN: '한식',
  CHINESE: '중식',
  JAPANESE: '일식',
  WESTERN: '양식',
  BUNSIK: '분식',
  FAST_FOOD: '패스트푸드',
  CAFE_DESSERT: '카페/디저트',
};

export const TAG_LABEL_MAP: Record<RestaurantTagKey, string> = {
  LARGE_PORTION: '양이 많아요',
  DELICIOUS: '맛있어요',
  GOOD_FOR_LUNCH: '점심으로 괜찮아요',
  GOOD_FOR_SOLO: '혼밥하기 좋아요',
  GOOD_VALUE: '가성비가 좋아요',
  GOOD_FOR_GATHERING: '회식하기 좋아요',
  GOOD_FOR_CONVERSATION: '대화하기 괜찮아요',
  VARIOUS_MENU: '메뉴가 다양해요',
};

export const restaurantCategories: CategoryOption[] = [
  { label: '전체', value: 'ALL' },
  { label: '한식', value: 'KOREAN' },
  { label: '중식', value: 'CHINESE' },
  { label: '일식', value: 'JAPANESE' },
  { label: '양식', value: 'WESTERN' },
  { label: '분식', value: 'BUNSIK' },
  { label: '패스트푸드', value: 'FAST_FOOD' },
  { label: '카페/디저트', value: 'CAFE_DESSERT' },
];

export const restaurantTags: TagOption[] = [
  { label: '맛있어요', value: 'DELICIOUS' },
  { label: '점심으로 괜찮아요', value: 'GOOD_FOR_LUNCH' },
  { label: '혼밥하기 좋아요', value: 'GOOD_FOR_SOLO' },
  { label: '양이 많아요', value: 'LARGE_PORTION' },
  { label: '가성비가 좋아요', value: 'GOOD_VALUE' },
  { label: '회식하기 좋아요', value: 'GOOD_FOR_GATHERING' },
  { label: '대화하기 괜찮아요', value: 'GOOD_FOR_CONVERSATION' },
  { label: '메뉴가 다양해요', value: 'VARIOUS_MENU' },
];
