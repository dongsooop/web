import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { checkRestaurantDuplicationWithSpring } from '@/features/restaurant/server/restaurant.api';
import type { RestaurantDuplicationResponse } from '@/features/restaurant/types/response';
import { ApiError } from '@/lib/api/apiError';

function trimValue(value: string | null) {
  return value?.trim() ?? '';
}

export async function GET(request: NextRequest) {
  const { accessToken, refreshToken, appCheckToken } = extractAuthContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  const externalMapId = trimValue(request.nextUrl.searchParams.get('externalMapId'));

  if (!externalMapId) {
    return NextResponse.json(
      { message: 'externalMapId가 필요해요.' },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const result = await checkRestaurantDuplicationWithSpring({
      accessToken,
      refreshToken,
      appCheckToken,
      externalMapId,
    });

    if (result.response.status === HttpStatusCode.UNAUTHORIZED) {
      return createSessionExpiredResponse();
    }

    const data = (await result.response.json()) as RestaurantDuplicationResponse;
    const response = NextResponse.json(data, { status: result.response.status });
    applyAuthResult(response, result);

    return response;
  } catch (error: unknown) {
    const status =
      error instanceof ApiError && error.status !== HttpStatusCode.NETWORK_ERROR
        ? error.status
        : HttpStatusCode.INTERNAL_SERVER_ERROR;

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : '중복 확인 중 오류가 발생했어요.',
      },
      { status },
    );
  }
}
