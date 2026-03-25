import { useAppCheckStore } from '@/store/useAppCheckStore';
import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from './apiError';

async function safeReadJson(res: Response): Promise<unknown | null> {
  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) return null;

  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function safeReadText(res: Response): Promise<string | null> {
  try {
    const text = await res.text();
    return text ? text : null;
  } catch {
    return null;
  }
}

async function readServerMessage(res: Response): Promise<string | null> {
  const json = await safeReadJson(res);
  if (
    json &&
    typeof json === 'object' &&
    'message' in json &&
    typeof (json as any).message === 'string'
  ) {
    return (json as any).message;
  }

  return await safeReadText(res);
}

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = useAppCheckStore.getState().token;

  if (!token) {
    throw new ApiError(HttpStatusCode.NETWORK_ERROR, 'APP_CHECK_TOKEN_MISSING');
  }

  let res: Response;

  try {
    const headers = new Headers(init?.headers);
    headers.set('X-Firebase-AppCheck', token);

    const isFormData =
      typeof FormData !== 'undefined' && init?.body instanceof FormData;

    if (!isFormData && !headers.has('Content-Type') && typeof init?.body === 'string') {
      headers.set('Content-Type', 'application/json');
    }

    res = await fetch(url, {
      ...init,
      headers,
    });
  } catch {
    throw new ApiError(HttpStatusCode.NETWORK_ERROR, 'Network Failure');
  }

  if (res.status === HttpStatusCode.NO_CONTENT) {
    return undefined as T;
  }

  if (res.ok) {
    const json = await safeReadJson(res);
    if (json !== null) return json as T;

    return (await safeReadText(res)) as unknown as T;
  }

  const msg = await readServerMessage(res);
  throw new ApiError(res.status, msg ?? 'Request failed');
}
