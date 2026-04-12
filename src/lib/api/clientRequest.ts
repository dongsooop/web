import { useAppCheckStore } from '@/store/useAppCheckStore';
import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';

export type ErrorResponseBody = {
  code?: string;
  message?: string;
};


export async function safeReadJson(res: Response): Promise<unknown | null> {
  const contentType = res.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function safeReadText(res: Response): Promise<string | null> {
  try {
    const text = await res.text();
    return text ? text : null;
  } catch {
    return null;
  }
}

export async function readErrorResponse(res: Response): Promise<{
  code: string | null;
  message: string | null;
}> {
  const json = await safeReadJson(res);

  if (json && typeof json === 'object') {
    const body = json as ErrorResponseBody;

    return {
      code: typeof body.code === 'string' ? body.code : null,
      message: typeof body.message === 'string' ? body.message : null,
    };
  }

  return {
    code: null,
    message: await safeReadText(res),
  };
}

export function buildRequestHeaders(init?: RequestInit, appCheckToken?: string) {
  const headers = new Headers(init?.headers);

  if (appCheckToken) {
    headers.set('X-Firebase-AppCheck', appCheckToken);
  }

  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData;

  if (!isFormData && !headers.has('Content-Type') && typeof init?.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  return headers;
}

export function getAppCheckTokenOrThrow() {
  const appCheckToken = useAppCheckStore.getState().token;

  if (!appCheckToken) {
    throw new ApiError(HttpStatusCode.NETWORK_ERROR, 'APP_CHECK_TOKEN_MISSING');
  }

  return appCheckToken;
}

export async function executeRequest(
  url: string,
  init: RequestInit = {},
  credentials: RequestCredentials = 'omit',
): Promise<Response> {
  const appCheckToken = getAppCheckTokenOrThrow();
  const headers = buildRequestHeaders(init, appCheckToken);

  try {
    return await fetch(url, {
      ...init,
      headers,
      credentials,
    });
  } catch {
    throw new ApiError(HttpStatusCode.NETWORK_ERROR, 'Network Failure');
  }
}

export async function parseResponseData<T>(response: Response): Promise<T> {
  if (response.status === HttpStatusCode.NO_CONTENT) {
    return undefined as T;
  }

  if (response.ok) {
    const json = await safeReadJson(response);

    if (json !== null) {
      return json as T;
    }

    return (await safeReadText(response)) as unknown as T;
  }

  const { message } = await readErrorResponse(response);

  throw new ApiError(response.status, message ?? 'Request failed');
}

export async function clientRequest<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await executeRequest(url, init, 'omit');
  return parseResponseData<T>(response);
}
