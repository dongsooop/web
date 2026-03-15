import { HttpStatusCode } from '@/constants/httpStatusCode';
import { getAppCheckToken } from '@/lib/firebase';
import { ApiError } from 'next/dist/server/api-utils';

export const request = async (url: string, options: RequestInit = {}) => {
  const token = await getAppCheckToken();
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    'X-Firebase-AppCheck': token || '',
  };

  try {
    const response = await fetch(`${baseURL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === HttpStatusCode.FORBIDDEN) {
        console.error('App Check 검증에 실패했습니다. (403)');
      }
      throw new ApiError(response.status, 'API_ERROR');
    }

    return response;
  } catch (error) {
    console.error('API Network Error:', error);
    throw error;
  }
};
