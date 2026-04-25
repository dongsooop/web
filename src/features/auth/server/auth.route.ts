import { NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import type { BackendReissueResponse } from '@/features/auth/types/backend';
import { clearAuthCookies, setAuthCookies } from './auth.cookies';

type AuthRouteResult = {
  reissuedTokens?: BackendReissueResponse;
  clearAuthCookies?: boolean;
};

export function applyAuthResult(response: NextResponse, result: AuthRouteResult) {
  if (result.clearAuthCookies) {
    clearAuthCookies(response);
    return;
  }

  if (result.reissuedTokens) {
    setAuthCookies(response, result.reissuedTokens.accessToken, result.reissuedTokens.refreshToken);
  }
}

export function createSessionExpiredResponse() {
  const response = NextResponse.json(
    {
      code: 'SESSION_EXPIRED',
      message: '세션이 만료되었습니다. 다시 로그인해주세요.',
    },
    { status: HttpStatusCode.UNAUTHORIZED },
  );

  clearAuthCookies(response);
  return response;
}
