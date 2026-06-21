import type { RestaurantCategoryKey } from './ui-model';
import type { RestaurantTagKey } from '../options';

export type RestaurantCreateRequest = {
  externalMapId: string;
  name: string;
  placeUrl: string;
  distance: number;
  category: RestaurantCategoryKey;
  tags: RestaurantTagKey[];
};
