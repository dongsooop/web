import { NextRequest, NextResponse } from 'next/server';

import { toSessionResponse } from '@/features/auth/mapper';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { restoreSessionUser } from '@/features/auth/server/auth.service';
import { reissueWithSpring } from '@/features/auth/server/auth.api';
import { createSessionExpiredResponse, applyAuthResult } from '@/features/auth/server/auth.route';
import { getStoredSessionUserCookie } from '@/features/auth/server/auth.cookies';

export async function GET(request: NextRequest) {
  const user = await restoreSessionUser();

  if (user) {
    return NextResponse.json(toSessionResponse(user));
  }

  const { refreshToken, appCheckToken } = extractAuthContext(request);

  if (!refreshToken) {
    return createSessionExpiredResponse();
  }

  try {
    const reissuedTokens = await reissueWithSpring({
      refreshToken,
      appCheckToken,
    });

    const storedUser = await getStoredSessionUserCookie();

    if (!storedUser) {
      return createSessionExpiredResponse();
    }

    const response = NextResponse.json(toSessionResponse(storedUser));

    applyAuthResult(response, { reissuedTokens });

    return response;
  } catch {
    return createSessionExpiredResponse();
  }
}
