import 'server-only';

import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { ApiError } from '@/lib/api/apiError';

type AuthResult = {
  response: Response;
  reissuedTokens?: { accessToken: string; refreshToken: string };
  clearAuthCookies?: boolean;
};

export type AdminRequestContext = {
  accessToken?: string;
  refreshToken?: string;
  appCheckToken: string;
};

/**
 * 관리자 API 는 서버가 ROLE_ADMIN 을 강제한다. 여기서는 토큰만 넘기고 권한 판단은 서버에 맡긴다.
 */
export function readAdminContext(request: NextRequest) {
  const { accessToken, refreshToken, appCheckToken } = extractAuthContext(request);

  if (!appCheckToken) {
    return {
      error: NextResponse.json(
        { message: 'Unauthorized: App Check token is missing' },
        { status: HttpStatusCode.UNAUTHORIZED },
      ),
    };
  }

  if (!accessToken) {
    return { error: createSessionExpiredResponse() };
  }

  return { context: { accessToken, refreshToken, appCheckToken } };
}

export async function toAdminResponse(result: AuthResult) {
  if (result.response.status === HttpStatusCode.UNAUTHORIZED) {
    return createSessionExpiredResponse();
  }

  const response =
    result.response.status === HttpStatusCode.NO_CONTENT
      ? new NextResponse(null, { status: HttpStatusCode.NO_CONTENT })
      : NextResponse.json(await result.response.json(), { status: result.response.status });

  applyAuthResult(response, result);

  return response;
}

/** 백엔드 오류의 detail 문구를 그대로 화면까지 전달한다. */
export function toAdminError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status || HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }

  return NextResponse.json(
    { message: '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.' },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
  );
}
