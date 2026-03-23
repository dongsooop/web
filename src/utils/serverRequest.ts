import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from 'next/dist/server/api-utils';

export const serverRequest = async (url: string, token: string, options: RequestInit = {}) => {
  const baseURL = process.env.BASE_URL;

  if (!baseURL) {
    throw new ApiError(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      'SERVER_CONFIG_ERROR: BASE_URL is missing',
    );
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-Firebase-AppCheck': token,
    ...options.headers,
  };

  try {
    const response = await fetch(`${baseURL}${url}`, {
      ...options,
      headers,
    });

    console.log(`[Spring Response Status] ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.message || 'BACKEND_API_ERROR');
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'SERVER_CONNECTION_FAILED');
  }
};
