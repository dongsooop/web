import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';

import { extractAuthContext } from '@/features/auth/server/auth.context';
import {
  clearAuthCookies,
  clearDeviceCookies,
  clearUserMetadataCookies,
} from '@/features/auth/server/auth.cookies';
import { logoutWithSpring } from '@/features/auth/server/auth.api';
import { createSessionExpiredResponse } from '@/features/auth/server/auth.route';

function buildLogoutResponse(body: Record<string, unknown>, status: number) {
  const response = NextResponse.json(body, { status });

  clearAuthCookies(response);
  clearDeviceCookies(response);
  clearUserMetadataCookies(response);

  return response;
}

export async function POST(request: NextRequest) {
  const authContext = extractAuthContext(request);
  const { accessToken, refreshToken, appCheckToken, deviceToken } = authContext;

  try {
    if (!accessToken || !deviceToken) {
      return buildLogoutResponse({ success: true }, HttpStatusCode.OK);
    }

    const result = await logoutWithSpring({
      accessToken,
      refreshToken,
      appCheckToken,
      deviceToken,
    });

    if (result.clearAuthCookies) {
      const response = createSessionExpiredResponse();
      clearDeviceCookies(response);
      clearUserMetadataCookies(response);
      return response;
    }

    return buildLogoutResponse({ success: true }, HttpStatusCode.OK);
  } catch (error) {
    if (error instanceof ApiError) {
      return buildLogoutResponse({ message: error.message }, error.status);
    }

    return buildLogoutResponse(
      { message: '로그아웃 처리 중 오류가 발생했습니다.' },
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }
}
