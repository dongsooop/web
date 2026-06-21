import type {
  RestaurantCategoryResponse,
  RestaurantItemResponse,
  RestaurantListResponse,
} from './types/response';
import type { RestaurantCategoryKey, RestaurantUiItem } from './types/ui-model';

const CATEGORY_KEY_MAP: Record<RestaurantCategoryResponse, RestaurantCategoryKey> = {
  KOREAN: 'KOREAN',
  CHINESE: 'CHINESE',
  JAPANESE: 'JAPANESE',
  WESTERN: 'WESTERN',
  BUNSIK: 'BUNSIK',
  FAST_FOOD: 'FAST_FOOD',
  CAFE_DESSERT: 'CAFE_DESSERT',
  한식: 'KOREAN',
  중식: 'CHINESE',
  일식: 'JAPANESE',
  양식: 'WESTERN',
  분식: 'BUNSIK',
  패스트푸드: 'FAST_FOOD',
  '카페/디저트': 'CAFE_DESSERT',
};

const CATEGORY_LABEL_MAP: Record<RestaurantCategoryKey, string> = {
  KOREAN: '한식',
  CHINESE: '중식',
  JAPANESE: '일식',
  WESTERN: '양식',
  BUNSIK: '분식',
  FAST_FOOD: '패스트푸드',
  CAFE_DESSERT: '카페/디저트',
};

const TAG_LABEL_MAP: Record<string, string> = {
  LARGE_PORTION: '양이 많아요',
  DELICIOUS: '맛있어요',
  GOOD_FOR_LUNCH: '점심으로 괜찮아요',
  GOOD_FOR_SOLO: '혼밥하기 좋아요',
  GOOD_VALUE: '가성비가 좋아요',
  GOOD_FOR_GATHERING: '회식하기 좋아요',
  GOOD_FOR_CONVERSATION: '대화하기 괜찮아요',
  VARIOUS_MENU: '메뉴가 다양해요',
};

function formatDistance(distance: number) {
  return `${Math.round(distance)}m`;
}

function formatLikes(likeCount: number) {
  return `${likeCount}명이 좋아하는 가게예요`;
}

function mapTagLabel(tag: string) {
  return TAG_LABEL_MAP[tag] ?? tag;
}

function mapRestaurantItem(item: RestaurantItemResponse): RestaurantUiItem {
  const category = CATEGORY_KEY_MAP[item.category];

  return {
    id: item.id,
    name: item.name,
    distance: item.distance,
    distanceText: formatDistance(item.distance),
    likeCount: item.likeCount,
    likeText: formatLikes(item.likeCount),
    tags: (item.tags ?? []).map(mapTagLabel),
    externalMapId: item.externalMapId,
    category,
    categoryLabel: CATEGORY_LABEL_MAP[category],
    likedByMe: item.likedByMe,
  };
}

export function mapRestaurantListResponseToUi(items: RestaurantListResponse): RestaurantUiItem[] {
  return (items ?? []).map(mapRestaurantItem);
}
