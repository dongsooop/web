import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';

import { parseResponseData, executeRequest, readErrorResponse } from './clientRequest';

// Browser -> Next API 인증 요청
export async function clientRequestAuth<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await executeRequest(url, init, 'include');

  if (response.ok || response.status === HttpStatusCode.NO_CONTENT) {
    return parseResponseData<T>(response);
  }

  const { code, message } = await readErrorResponse(response);

  if (response.status === HttpStatusCode.UNAUTHORIZED && code === 'SESSION_EXPIRED') {
    useAuthStore.getState().expireSession();
  }

  throw new ApiError(response.status, message ?? 'Request failed');
}
