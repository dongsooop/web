import type {
  RestaurantListResponse,
  RestaurantResponse,
  RestaurantSearchResponse,
  RestaurantSearchListResponse,
} from './types/response';
import type { RestaurantItem, RestaurantSearchItem } from './types/ui-model';
import { restaurantTags } from './options';

function mapTag(tag: string) {
  return restaurantTags.find((option) => option.value === tag)?.label ?? tag;
}

function toItem(item: RestaurantResponse): RestaurantItem {
  return {
    id: item.id,
    name: item.name,
    distance: item.distance,
    placeUrl: item.placeUrl,
    likeCount: item.likeCount,
    tags: (item.tags ?? []).map(mapTag),
    category: item.category,
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
