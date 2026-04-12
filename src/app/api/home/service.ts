import type { HomeResponse } from '@/features/home/types/response';
import { serverRequest } from '@/utils/serverRequest';

export const getHomeData = async (token: string): Promise<HomeResponse> => {
  const HOME_PATH = process.env.HOME_ENDPOINT;

  if (!HOME_PATH) {
    throw new Error('환경 변수 HOME_ENDPOINT가 설정되지 않았습니다.');
  }

  const response = await serverRequest(HOME_PATH, token, { method: 'GET' });

  return response.json();
};
