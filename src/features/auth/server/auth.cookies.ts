import 'server-only';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { UserResponse } from '@/features/auth/types/response';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const DEVICE_TOKEN_COOKIE = 'device_token';
const DEVICE_TYPE_COOKIE = 'device_type';
const DEPARTMENT_TYPE_COOKIE = 'department_type';
const SESSION_USER_COOKIE = 'session_user';

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
  maxAge: 60 * 60 * 24 * 30,
};

const DEVICE_COOKIE_CLEAR_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 0,
  expires: new Date(0),
};

const USER_METADATA_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function getAccessTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getRefreshTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export async function getDepartmentTypeCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(DEPARTMENT_TYPE_COOKIE)?.value ?? null;
}

export async function getStoredSessionUserCookie(): Promise<UserResponse | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_USER_COOKIE)?.value;

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<UserResponse>;

    if (
      typeof parsed.id !== 'number' ||
      !Number.isFinite(parsed.id) ||
      typeof parsed.email !== 'string' ||
      typeof parsed.nickname !== 'string' ||
      typeof parsed.departmentType !== 'string' ||
      !Array.isArray(parsed.role) ||
      !parsed.role.every((role) => typeof role === 'string')
    ) {
      return null;
    }

    return {
      id: parsed.id,
      email: parsed.email,
      nickname: parsed.nickname,
      departmentType: parsed.departmentType,
      role: parsed.role,
    };
  } catch {
    return null;
  }
}

export function setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, AUTH_COOKIE_OPTIONS);
  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, AUTH_COOKIE_OPTIONS);
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, '', {
    ...AUTH_COOKIE_OPTIONS,
    expires: new Date(0),
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, '', {
    ...AUTH_COOKIE_OPTIONS,
    expires: new Date(0),
  });
}

export function setDeviceCookies(response: NextResponse, deviceToken: string, deviceType: string) {
  response.cookies.set(DEVICE_TOKEN_COOKIE, deviceToken, DEVICE_COOKIE_OPTIONS);
  response.cookies.set(DEVICE_TYPE_COOKIE, deviceType, DEVICE_COOKIE_OPTIONS);
}

export function clearDeviceCookies(response: NextResponse) {
  response.cookies.set(DEVICE_TOKEN_COOKIE, '', DEVICE_COOKIE_CLEAR_OPTIONS);
  response.cookies.set(DEVICE_TYPE_COOKIE, '', DEVICE_COOKIE_CLEAR_OPTIONS);
}

export function setDepartmentTypeCookie(response: NextResponse, departmentType: string) {
  response.cookies.set(DEPARTMENT_TYPE_COOKIE, departmentType, USER_METADATA_COOKIE_OPTIONS);
}

export function setStoredSessionUserCookie(response: NextResponse, user: UserResponse) {
  response.cookies.set(SESSION_USER_COOKIE, JSON.stringify(user), USER_METADATA_COOKIE_OPTIONS);
}

export function clearStoredSessionUserCookie(response: NextResponse) {
  response.cookies.set(SESSION_USER_COOKIE, '', {
    ...USER_METADATA_COOKIE_OPTIONS,
    expires: new Date(0),
  });
}

export function clearUserMetadataCookies(response: NextResponse) {
  response.cookies.set(DEPARTMENT_TYPE_COOKIE, '', {
    ...USER_METADATA_COOKIE_OPTIONS,
    expires: new Date(0),
  });

  response.cookies.set(SESSION_USER_COOKIE, '', {
    ...USER_METADATA_COOKIE_OPTIONS,
    expires: new Date(0),
  });
}
