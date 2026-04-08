import { NextResponse } from 'next/server';

import type { UserResponse } from '@/features/auth/types/response';
import type { JwtAccessPayload } from '@/features/auth/types/backend';
import { getAccessTokenCookie } from '@/features/auth/server/auth.cookies';
import { toSessionResponse } from '@/features/auth/mapper';


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

export async function GET() {
  const accessToken = await getAccessTokenCookie();

  if (!accessToken) {
    return NextResponse.json(toSessionResponse(null));
  }

  try {
    const payload = decodeJwtPayload<JwtAccessPayload>(accessToken);

    if (payload.type !== 'ACCESS' || isExpired(payload.exp)) {
      return NextResponse.json(toSessionResponse(null));
    }

    const user: UserResponse = {
      id: Number(payload.sub),
      email: '',
      nickname: '',
      departmentType: '',
      role: payload.role ?? [],
    };

    return NextResponse.json(toSessionResponse(user));
  } catch {
    return NextResponse.json(toSessionResponse(null));
  }
}