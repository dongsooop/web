import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { toSignInResponse } from '@/features/auth/mapper';
import { socialSignInWithSpring } from '@/features/auth/server/auth.api';
import { exchangeKakaoCode } from '@/features/auth/server/auth.kakao';
import { resolveDeviceContext } from '@/features/auth/server/auth.context';
import {
  setAuthCookies,
  setDepartmentTypeCookie,
  setDeviceCookies,
  setStoredSessionUserCookie,
} from '@/features/auth/server/auth.cookies';
import type { BackendSignInResponse } from '@/features/auth/types/backend';
import { ApiError } from '@/lib/api/apiError';

const defaultWebOrigin = 'https://www.dongsoop.site';

function getWebOrigin(request?: NextRequest) {
  const site = process.env.NEXT_PUBLIC_WEB_SITE?.trim();

  if (process.env.NODE_ENV === 'production' && site) {
    return site;
  }

  const origin = request?.headers.get('origin')?.trim();

  if (origin) {
    return origin;
  }

  const host =
    request?.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ??
    request?.headers.get('host')?.trim();
  const proto =
    request?.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ??
    (host?.startsWith('localhost') || host?.startsWith('127.0.0.1') ? 'http' : 'https');

  if (host) {
    return `${proto}://${host}`;
  }

  if (request) {
    return new URL(request.url).origin;
  }

  return defaultWebOrigin;
}

function getSignInPage(request: NextRequest, path = '/sign-in', message?: string) {
  const url = new URL(path, getWebOrigin(request));

  if (message) {
    url.searchParams.set('error', message);
  }

  return url;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')?.trim() ?? '';
  const state = request.nextUrl.searchParams.get('state')?.trim() ?? '';
  const error = request.nextUrl.searchParams.get('error')?.trim() ?? '';
  const errorDescription = request.nextUrl.searchParams.get('error_description')?.trim() ?? '';
  const url = getSignInPage(request, '/sign-in/kakao/callback');

  if (code) {
    url.searchParams.set('code', code);
  }

  if (state) {
    url.searchParams.set('state', state);
  }

  if (error) {
    url.searchParams.set('error', error);
  }

  if (errorDescription) {
    url.searchParams.set('error_description', errorDescription);
  }

  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  const appCheckToken = request.headers.get('X-Firebase-AppCheck') || '';
  const { deviceToken, deviceType } = resolveDeviceContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { message: '잘못된 요청 형식입니다.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  const body = (rawBody ?? {}) as { code?: unknown };
  const code = typeof body.code === 'string' ? body.code.trim() : '';

  if (!code) {
    return NextResponse.json(
      { message: '카카오 인증 코드가 필요합니다.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const redirectUri = new URL('/bff/auth/social/kakao/callback', getWebOrigin(request)).toString();
    const token = await exchangeKakaoCode(code, redirectUri);
    const data: BackendSignInResponse = await socialSignInWithSpring(
      'kakao',
      { token, deviceToken, deviceType },
      { appCheckToken },
    );

    const response = NextResponse.json(toSignInResponse(data), {
      status: HttpStatusCode.OK,
    });

    setAuthCookies(response, data.accessToken, data.refreshToken);
    setDeviceCookies(response, deviceToken, deviceType);

    if (data.departmentType) {
      setDepartmentTypeCookie(response, data.departmentType);
    }

    setStoredSessionUserCookie(response, {
      id: data.id,
      email: data.email,
      nickname: data.nickname,
      departmentType: data.departmentType ?? '',
      role: Array.isArray(data.role) ? data.role : [],
    });

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: '소셜 로그인 처리 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
