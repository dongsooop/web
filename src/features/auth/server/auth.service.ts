import 'server-only';

import type { UserResponse } from '@/features/auth/types/response';
import type { JwtAccessPayload } from '@/features/auth/types/backend';
import { getAccessTokenCookie, getDepartmentTypeCookie } from './auth.cookies';

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

export async function restoreSessionUser(): Promise<UserResponse | null> {
  const accessToken = await getAccessTokenCookie();
  const departmentType = await getDepartmentTypeCookie();

  if (!accessToken) {
    return null;
  }

  try {
    const payload = decodeJwtPayload<JwtAccessPayload>(accessToken);

    if (payload.type !== 'ACCESS') {
      return null;
    }

    if (isExpired(payload.exp)) {
      console.log('[restoreSessionUser] token expired:', {
        exp: payload.exp,
        expMs: payload.exp * 1000,
        nowMs: Date.now(),
      });
      return null;
    }

    const restoredUser: UserResponse = {
      id: Number(payload.sub),
      email: '',
      nickname: '',
      departmentType: departmentType ?? '',
      role: payload.role ?? [],
    };

    return restoredUser;
  } catch (error) {
    return null;
  }
}
