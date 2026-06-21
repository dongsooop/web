import type {
  RestaurantCategoryLabel,
  RestaurantListResponse,
  RestaurantResponse,
  RestaurantSearchResponse,
  RestaurantSearchListResponse,
} from './types/response';
import type { RestaurantItem, RestaurantSearchItem } from './types/ui-model';
import { CATEGORY_LABEL_MAP, TAG_LABEL_MAP, type RestaurantCategoryKey } from './options';

function formatDistance(distance: number) {
  return `${Math.round(distance)}m`;
}

function formatLikes(likeCount: number) {
  return `${likeCount}명이 좋아하는 가게예요`;
}

function mapTag(tag: string) {
  return TAG_LABEL_MAP[tag as keyof typeof TAG_LABEL_MAP] ?? tag;
}

function toCategoryKey(category: RestaurantCategoryLabel): RestaurantCategoryKey {
  switch (category) {
    case '한식':
      return 'KOREAN';
    case '중식':
      return 'CHINESE';
    case '일식':
      return 'JAPANESE';
    case '양식':
      return 'WESTERN';
    case '분식':
      return 'BUNSIK';
    case '패스트푸드':
      return 'FAST_FOOD';
    case '카페/디저트':
      return 'CAFE_DESSERT';
  }
}

function toItem(item: RestaurantResponse): RestaurantItem {
  const category = toCategoryKey(item.category);

  return {
    id: item.id,
    name: item.name,
    distance: item.distance,
    distanceText: formatDistance(item.distance),
    placeUrl: item.placeUrl,
    likeCount: item.likeCount,
    likeText: formatLikes(item.likeCount),
    tags: (item.tags ?? []).map(mapTag),
    category,
    categoryLabel: CATEGORY_LABEL_MAP[category],
    isLikedByMe: item.isLikedByMe,
  };
}

export function mapList(items: RestaurantListResponse): RestaurantItem[] {
  return (items ?? []).map(toItem);
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

function toSearchItem(item: RestaurantSearchResponse): RestaurantSearchItem {
  return {
    externalMapId: item.id.trim(),
    name: item.place_name.trim(),
    address: item.road_address_name.trim(),
    placeUrl: item.place_url.trim(),
    distance: normalizeSearchDistance(item.distance),
  };
}

export function mapSearch(items: RestaurantSearchListResponse): RestaurantSearchItem[] {
  return (items ?? []).map(toSearchItem).filter((item) => item.externalMapId && item.name);
}
