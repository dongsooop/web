import { ApiError } from '@/app/api/apiError';
import { HttpStatusCode } from '@/constants/httpStatusCode';
import { useAppCheckStore } from '@/store/useAppCheckStore';

export const request = async (url: string, options: RequestInit = {}) => {
  const { token, isInitialized } = useAppCheckStore.getState();
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  if (!isInitialized) {
    throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'APP_CHECK_NOT_INITIALIZED');
  }

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
      throw new ApiError(response.status, 'API_ERROR');
    }

    return response;
  } catch (error) {
    throw error;
  }
};
