import { categoryKeys } from '../category';
import { restaurantTags, type RestaurantCategoryKey, type RestaurantTagKey } from '../options';
import type { RestaurantCreateRequest } from '../types/request';

const DEFAULT_SIZE = 7;
const MAX_SIZE = 20;
const MAX_TAGS = 3;

function trimText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parsePlaceUrl(value: unknown) {
  const urlText = trimText(value);

  if (!urlText) {
    return null;
  }

  try {
    const url = new URL(urlText);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function parseDistance(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    const distance = Number(trimmed);

    if (Number.isFinite(distance) && distance >= 0) {
      return distance;
    }
  }

  return null;
}

function isTag(value: unknown): value is RestaurantTagKey {
  return typeof value === 'string' && restaurantTags.some((tag) => tag.value === value);
}

function parseTags(value: unknown): RestaurantTagKey[] | null {
  if (value == null) {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  if (value.length > MAX_TAGS || value.some((tag) => !isTag(tag))) {
    return null;
  }

  return value;
}

function parseCreateCategory(value: unknown): RestaurantCategoryKey | null {
  if (typeof value !== 'string') {
    return null;
  }

  const category = value.trim();

  if (!category) {
    return null;
  }

  return categoryKeys.find((key) => key === category) ?? null;
}

export function parseId(value: string) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export function parsePage(value: string | null) {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 0) {
    return 0;
  }

  return page;
}

export function parseSize(value: string | null) {
  const size = Number(value);

  if (!Number.isInteger(size) || size <= 0) {
    return DEFAULT_SIZE;
  }

  return Math.min(size, MAX_SIZE);
}

export function parseCategory(value: string | null): RestaurantCategoryKey | undefined {
  if (!value) {
    return undefined;
  }

  return categoryKeys.find((key) => key === value);
}

export function parseCreate(body: Partial<RestaurantCreateRequest>) {
  const externalMapId = trimText(body.externalMapId);
  const name = trimText(body.name);
  const placeUrl = parsePlaceUrl(body.placeUrl);
  const distance = parseDistance(body.distance);
  const category = parseCreateCategory(body.category);
  const tags = parseTags(body.tags);

  if (!externalMapId || !name || !placeUrl || distance === null || !category || tags === null) {
    return null;
  }

  return {
    externalMapId,
    name,
    placeUrl,
    distance,
    category,
    tags,
  } satisfies RestaurantCreateRequest;
}
