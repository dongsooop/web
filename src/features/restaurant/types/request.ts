import type { RestaurantTagKey } from '../options';
import type { RestaurantCategoryKey } from '../options';

export type RestaurantCreateRequest = {
  externalMapId: string;
  name: string;
  placeUrl: string;
  distance: number;
  category: RestaurantCategoryKey;
  tags: RestaurantTagKey[];
};
