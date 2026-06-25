import type { RestaurantCategoryLabel } from '../options';

export type RestaurantTagResponse = string;

export type RestaurantResponse = {
  id: number;
  name: string;
  distance: number;
  placeUrl: string;
  likeCount: number;
  tags: RestaurantTagResponse[];
  category: RestaurantCategoryLabel;
  isLikedByMe: boolean;
};

export type RestaurantListResponse = RestaurantResponse[];

export type RestaurantSearchResponse = {
  id: unknown;
  place_name: unknown;
  road_address_name: unknown;
  place_url: unknown;
  distance?: number | string | null;
};

export type RestaurantSearchListResponse = RestaurantSearchResponse[];

export type RestaurantDuplicationResponse = {
  isDuplicate: boolean;
};
