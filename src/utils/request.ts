import { useAppCheckStore } from '@/store/useAppCheckStore';
import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';

export const fetcher = async (url: string, options: RequestInit = {}) => {
  const token = useAppCheckStore.getState().token;

  if (!token) {
    throw new ApiError(HttpStatusCode.NETWORK_ERROR, 'APP_CHECK_TOKEN_MISSING');
  }

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'X-Firebase-AppCheck': token,
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...options,
      headers,
    });

    if (res.status === HttpStatusCode.NO_CONTENT) return null;

    if (!res.ok) {
      throw new ApiError(res.status, 'API_ERROR');
    }

    return res.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(HttpStatusCode.NETWORK_ERROR, 'NETWORK_ERROR');
  }
};
