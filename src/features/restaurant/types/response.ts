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
  id: string;
  place_name: string;
  road_address_name: string;
  place_url: string;
  distance?: string;
};

export type RestaurantSearchListResponse = RestaurantSearchResponse[];

export type RestaurantDuplicationResponse = {
  isDuplicate: boolean;
};
