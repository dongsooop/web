import { CafeteriaResponse } from '@/features/cafeteria/types';
import { serverRequest } from '@/utils/serverRequest';

export const getCafeteriaData = async (token: string): Promise<CafeteriaResponse> => {
  const ENDPOINT = process.env.CAFETERIA_ENDPOINT;

  if (!ENDPOINT) {
    throw new Error('환경 변수 CAFETERIA_ENDPOINT가 설정되지 않았습니다.');
  }

  const response = await serverRequest(ENDPOINT, token, {
    method: 'GET',
    cache: 'no-store',
  });

  return response.json();
};
