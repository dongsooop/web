import 'server-only';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const DEVICE_TOKEN_COOKIE = 'device_token';
const DEVICE_TYPE_COOKIE = 'device_type';

const AUTH_COOKIE_NAMES = [
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
] as const;

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

const DEVICE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30일
};

// ===== auth cookies =====
export async function getAuthCookieHeader(): Promise<string | null> {
  const cookieStore = await cookies();

  const cookiePairs = AUTH_COOKIE_NAMES
    .map((name) => {
      const value = cookieStore.get(name)?.value;
      return value ? `${name}=${value}` : null;
    })
    .filter((value): value is string => value !== null);

  if (cookiePairs.length === 0) {
    return null;
  }

  return cookiePairs.join('; ');
}

export async function getAccessTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getRefreshTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export async function hasAuthCookies(): Promise<boolean> {
  const cookieStore = await cookies();

  return AUTH_COOKIE_NAMES.some((name) => {
    return Boolean(cookieStore.get(name)?.value);
  });
}

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, AUTH_COOKIE_OPTIONS);
  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, AUTH_COOKIE_OPTIONS);
}

export function clearAuthCookies(response: NextResponse) {
  for (const cookieName of AUTH_COOKIE_NAMES) {
    response.cookies.set(cookieName, '', {
      ...AUTH_COOKIE_OPTIONS,
      expires: new Date(0),
    });
  }
}

/**
 * Spring이 Set-Cookie를 직접 내려주는 구조에서만 사용
 * 현재 구조가 "Next가 쿠키를 직접 세팅"이라면 사용 안 해도 됨
 */
export function applySetCookieHeaders(
  sourceResponse: Response,
  targetResponse: NextResponse,
) {
  const setCookie = sourceResponse.headers.get('set-cookie');

  if (!setCookie) return;

  targetResponse.headers.append('set-cookie', setCookie);
}

// ===== device cookies =====
export async function getDeviceTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(DEVICE_TOKEN_COOKIE)?.value ?? null;
}

export async function getDeviceTypeCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(DEVICE_TYPE_COOKIE)?.value ?? null;
}

export async function hasDeviceCookies(): Promise<boolean> {
  const cookieStore = await cookies();

  return Boolean(
    cookieStore.get(DEVICE_TOKEN_COOKIE)?.value &&
      cookieStore.get(DEVICE_TYPE_COOKIE)?.value,
  );
}

export function setDeviceCookies(
  response: NextResponse,
  deviceToken: string,
  deviceType: string,
) {
  response.cookies.set(DEVICE_TOKEN_COOKIE, deviceToken, DEVICE_COOKIE_OPTIONS);
  response.cookies.set(DEVICE_TYPE_COOKIE, deviceType, DEVICE_COOKIE_OPTIONS);
}

export function clearDeviceCookies(response: NextResponse) {
  response.cookies.set(DEVICE_TOKEN_COOKIE, '', {
    ...DEVICE_COOKIE_OPTIONS,
    expires: new Date(0),
  });

  response.cookies.set(DEVICE_TYPE_COOKIE, '', {
    ...DEVICE_COOKIE_OPTIONS,
    expires: new Date(0),
  });
}