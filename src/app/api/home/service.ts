import { HomeResponse } from '@/features/home/types';
import { request } from '@/utils/request';

export const getHomeData = async (): Promise<HomeResponse> => {
  const HOME_PATH = '/home';

  const response = await request(HOME_PATH, { method: 'GET' });

  const data = await response.json();

  return data;
};
