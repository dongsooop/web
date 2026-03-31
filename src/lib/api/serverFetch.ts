import 'server-only';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';

// Next -> Spring
interface ServerFetchOptions extends RequestInit {
  appCheckToken?: string;
}

export async function serverFetch(
  url: string,
  options: ServerFetchOptions = {},
): Promise<Response> {
  const baseURL = process.env.BASE_URL;

  if (!baseURL) {
    throw new ApiError(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      'SERVER_CONFIG_ERROR: BASE_URL is missing',
    );
  }

  const { appCheckToken, ...requestInit } = options;

  const headers = new Headers(requestInit.headers);

  if (appCheckToken) {
    headers.set('X-Firebase-AppCheck', appCheckToken);
  }

  if (!(requestInit.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(`${baseURL}${url}`, {
      ...requestInit,
      headers,
      cache: 'no-store',
    });

    console.log(`[Spring Response Status] ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData &&
        typeof errorData === 'object' &&
        'message' in errorData &&
        typeof (errorData as { message?: unknown }).message === 'string'
          ? (errorData as { message: string }).message
          : 'BACKEND_API_ERROR';

      throw new ApiError(response.status, message);
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'SERVER_CONNECTION_FAILED');
  }
}
