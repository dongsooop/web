import type {
  RestaurantCategoryResponse,
  RestaurantItemResponse,
  RestaurantListResponse,
  RestaurantSearchItemResponse,
  RestaurantSearchResponse,
} from './types/response';
import type {
  RestaurantCategoryKey,
  RestaurantSearchItemUi,
  RestaurantUiItem,
} from './types/ui-model';
import { CATEGORY_LABEL_MAP, TAG_LABEL_MAP } from './options';

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

function formatDistance(distance: number) {
  return `${Math.round(distance)}m`;
}

function formatLikes(likeCount: number) {
  return `${likeCount}명이 좋아하는 가게예요`;
}

function mapTagLabel(tag: string) {
  return TAG_LABEL_MAP[tag as keyof typeof TAG_LABEL_MAP] ?? tag;
}

function mapRestaurantItem(item: RestaurantItemResponse): RestaurantUiItem {
  const category = CATEGORY_KEY_MAP[item.category];

  return {
    id: item.id,
    name: item.name,
    distance: item.distance,
    distanceText: formatDistance(item.distance),
    placeUrl: item.placeUrl,
    likeCount: item.likeCount,
    likeText: formatLikes(item.likeCount),
    tags: (item.tags ?? []).map(mapTagLabel),
    category,
    categoryLabel: CATEGORY_LABEL_MAP[category],
    isLikedByMe: item.isLikedByMe,
  };
}

export function mapRestaurantListResponseToUi(items: RestaurantListResponse): RestaurantUiItem[] {
  return (items ?? []).map(mapRestaurantItem);
}

function normalizeSearchDistance(value: number | string | null | undefined) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function mapRestaurantSearchItem(item: RestaurantSearchItemResponse): RestaurantSearchItemUi {
  return {
    externalMapId: item.id.trim(),
    name: item.place_name.trim(),
    address: item.road_address_name.trim(),
    placeUrl: item.place_url.trim(),
    distance: normalizeSearchDistance(item.distance),
  };
}

export function mapRestaurantSearchResponseToUi(
  items: RestaurantSearchResponse,
): RestaurantSearchItemUi[] {
  return (items ?? [])
    .map(mapRestaurantSearchItem)
    .filter((item) => item.externalMapId && item.name);
}
