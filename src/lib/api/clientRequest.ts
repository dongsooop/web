import { useAppCheckStore } from '@/store/useAppCheckStore';
import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';

export type ErrorResponseBody = {
  code?: string;
  message?: string;
};

// JSON 응답을 안전하게 파싱 (실패 시 null)
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

// text 응답을 안전하게 읽기 (실패 시 null)
export async function safeReadText(res: Response): Promise<string | null> {
  try {
    const text = await res.text();
    return text ? text : null;
  } catch {
    return null;
  }
}

// 에러 응답에서 code와 message 추출
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

// App Check 및 Content-Type을 포함한 요청 헤더 생성
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

// App Check 토큰을 가져오고 없으면 에러 발생
export function getAppCheckTokenOrThrow() {
  const appCheckToken = useAppCheckStore.getState().token;

  if (!appCheckToken) {
    throw new ApiError(HttpStatusCode.NETWORK_ERROR, 'APP_CHECK_TOKEN_MISSING');
  }

  return appCheckToken;
}

// 공통 fetch 실행 (App Check + headers + credentials)
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

// Response를 실제 데이터로 변환 (성공/에러 처리 포함)
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

// 인증이 필요 없는 공통 API 요청 함수
export async function clientRequest<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await executeRequest(url, init, 'omit');
  return parseResponseData<T>(response);
}
