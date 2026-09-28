import 'server-only';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';

{
  /* Next -> Spring */
}
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

        if (json && typeof json === 'object') {
          // ProblemDetail 형식은 사용자에게 보여 줄 문구를 detail 에 담는다
          const body = json as { message?: unknown; detail?: unknown };

          if (typeof body.message === 'string') {
            message = body.message;
          } else if (typeof body.detail === 'string') {
            message = body.detail;
          }
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
