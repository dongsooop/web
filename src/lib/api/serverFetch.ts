import 'server-only';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';

// Next -> Spring
export interface ServerFetchOptions extends RequestInit {
  appCheckToken?: string;
  acceptRedirect?: boolean;
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

  const { appCheckToken, acceptRedirect = false, ...requestInit } = options;

  const headers = new Headers(requestInit.headers);

  if (appCheckToken) {
    headers.set('X-Firebase-AppCheck', appCheckToken);
  }

  const isFormData = typeof FormData !== 'undefined' && requestInit.body instanceof FormData;

  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const fullUrl = `${baseURL}${url}`;

  try {
    const response = await fetch(fullUrl, {
      ...requestInit,
      headers,
      cache: 'no-store',
      redirect: acceptRedirect ? 'manual' : 'follow',
    });

    const isAcceptedRedirect = acceptRedirect && response.status >= 300 && response.status < 400;

    if (!response.ok && !isAcceptedRedirect) {
      const text = await response.text();

      let message = 'BACKEND_API_ERROR';

      try {
        const json = JSON.parse(text);
        if (
          json &&
          typeof json === 'object' &&
          'message' in json &&
          typeof (json as { message?: unknown }).message === 'string'
        ) {
          message = (json as { message: string }).message;
        }
      } catch {}

      throw new ApiError(response.status, message);
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'SERVER_CONNECTION_FAILED');
  }
}
