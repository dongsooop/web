import 'server-only';

import type { UserResponse } from '@/features/auth/types/response';
import type { JwtAccessPayload } from '@/features/auth/types/backend';
import { getAccessTokenCookie, getStoredSessionUserCookie } from './auth.cookies';

function decodeJwtPayload<T>(token: string): T {
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const payload = parts[1];
  const decoded = Buffer.from(payload, 'base64url').toString('utf-8');

  return JSON.parse(decoded) as T;
}

function isExpired(exp: number): boolean {
  return exp * 1000 <= Date.now();
}

function hasUsableAccessToken(accessToken: string): boolean {
  try {
    const payload = decodeJwtPayload<JwtAccessPayload>(accessToken);

    if (payload.type !== 'ACCESS') {
      return false;
    }

    if (typeof payload.exp !== 'number') {
      return false;
    }

    if (isExpired(payload.exp)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function restoreSessionUser(): Promise<UserResponse | null> {
  const accessToken = await getAccessTokenCookie();

  if (!accessToken) {
    return null;
  }

  if (!hasUsableAccessToken(accessToken)) {
    return null;
  }

  return getStoredSessionUserCookie();
}
