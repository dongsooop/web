import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';

import { extractAuthContext } from '@/features/auth/server/auth.context';
import {
  clearAuthCookies,
  clearDeviceCookies,
  clearUserMetadataCookies,
} from '@/features/auth/server/auth.cookies';
import { deleteWithSpring } from '@/features/auth/server/auth.api';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';

function buildDeleteResponse(status = HttpStatusCode.NO_CONTENT) {
  const response = new NextResponse(null, { status });

  clearAuthCookies(response);
  clearDeviceCookies(response);
  clearUserMetadataCookies(response);

  return response;
}

export async function DELETE(request: NextRequest) {
  const authContext = extractAuthContext(request);
  const { accessToken, refreshToken, appCheckToken } = authContext;

  try {
    if (!accessToken) {
      return buildDeleteResponse();
    }

    const result = await deleteWithSpring({
      accessToken,
      refreshToken,
      appCheckToken,
    });

    if (result.shouldClearAuthCookies) {
      const response = createSessionExpiredResponse();
      clearDeviceCookies(response);
      clearUserMetadataCookies(response);
      return response;
    }

    const response = buildDeleteResponse();
    applyAuthResult(response, result);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: '계정 탈퇴 처리 중 오류가 발생했습니다.' },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
