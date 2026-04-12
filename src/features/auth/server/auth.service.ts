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

export function restoreUserFromAccessToken(
  accessToken: string,
  departmentType?: string | null,
): UserResponse | null {
  try {
    const payload = decodeJwtPayload<JwtAccessPayload>(accessToken);

    if (payload.type !== 'ACCESS') {
      return null;
    }

    if (isExpired(payload.exp)) {
      return null;
    }

    const userId = Number(payload.sub);

    if (!Number.isFinite(userId)) {
      return null;
    }

    const roles = Array.isArray(payload.role)
      ? payload.role.filter((role): role is string => typeof role === 'string')
      : [];

    return {
      id: userId,
      email: '',
      nickname: '',
      departmentType: departmentType ?? '',
      role: roles,
    };
  } catch {
    return null;
  }
}

export async function restoreSessionUser(): Promise<UserResponse | null> {
  const accessToken = await getAccessTokenCookie();
  const departmentType = await getDepartmentTypeCookie();

  if (!accessToken) {
    return null;
  }

  return restoreUserFromAccessToken(accessToken, departmentType);
}
