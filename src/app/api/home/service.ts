import { HomeResponse } from '@/features/home/types';
import { ApiError } from '@/app/api/apiError';
import { request } from '@/utils/request';

export const getHomeData = async (): Promise<HomeResponse> => {
  const HOME_PATH = '/home';

  const response = await request(HOME_PATH, { method: 'GET' });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.message || '데이터를 가져오지 못했습니다.');
  }

  const data = await response.json();

  return data;
};
