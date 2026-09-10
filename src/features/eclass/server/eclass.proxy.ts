import 'server-only';

import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { ApiError } from '@/lib/api/apiError';
import { serverFetchAuth } from '@/lib/api/serverFetchAuth';

const ERROR_MESSAGES: Record<number, string> = {
  [HttpStatusCode.BAD_REQUEST]: '이클래스 토큰이 유효하지 않아요. 다시 연동해 주세요.',
  [HttpStatusCode.NOT_FOUND]: '이클래스 연동 정보가 없어요.',
  429: '잠시 후 다시 시도해 주세요.',
};

function getRequiredEnv(name: 'ECLASS_ENDPOINT' | 'ECLASS_TOKEN_URL') {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name}_MISSING`);
  }

  return value;
}

/** 이클래스(Moodle) 토큰 발급. 비밀번호는 여기서만 쓰고 저장하지 않는다. */
export async function issueMoodleToken(username: string, password: string) {
  const body = new URLSearchParams({ username, password, service: 'moodle_mobile_app' });
  const response = await fetch(getRequiredEnv('ECLASS_TOKEN_URL'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });
  const data = (await response.json()) as { token?: string; error?: string };

  if (!data.token) {
    throw new ApiError(HttpStatusCode.BAD_REQUEST, data.error || '이클래스 로그인에 실패했어요.');
  }

  return data.token;
}

/**
 * 백엔드 /eclass/** 는 기기 단위라 로그인한 회원의 기기 토큰(로그인 시 등록됨)을 헤더로 넘긴다.
 * 회원에게 묶인 기기는 그 회원만 접근할 수 있으므로 액세스 토큰도 함께 보낸다.
 */
export async function proxyEclass(
  request: NextRequest,
  path: string,
  init: { method: 'GET' | 'POST' | 'DELETE'; body?: unknown } = { method: 'GET' },
) {
  const { accessToken, refreshToken, appCheckToken, deviceToken } = extractAuthContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  if (!accessToken || !deviceToken) {
    return createSessionExpiredResponse();
  }

  try {
    const result = await serverFetchAuth(`${getRequiredEnv('ECLASS_ENDPOINT')}${path}`, {
      method: init.method,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      headers: { 'X-Device-Token': deviceToken },
      accessToken,
      refreshToken,
      appCheckToken,
    });

    if (result.response.status === HttpStatusCode.UNAUTHORIZED) {
      return createSessionExpiredResponse();
    }

    const response =
      result.response.status === HttpStatusCode.NO_CONTENT
        ? new NextResponse(null, { status: HttpStatusCode.NO_CONTENT })
        : NextResponse.json(await result.response.json(), { status: result.response.status });

    applyAuthResult(response, result);

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: ERROR_MESSAGES[error.status] ?? error.message },
        { status: error.status || HttpStatusCode.INTERNAL_SERVER_ERROR },
      );
    }

    return NextResponse.json(
      { message: '이클래스 요청 중 오류가 발생했어요.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
