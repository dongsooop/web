import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { mapRestaurantSearchResponseToUi } from '@/features/restaurant/mapper';
import { searchRestaurantsWithKakao } from '@/features/restaurant/server/restaurant.api';
import type { RestaurantSearchResponse } from '@/features/restaurant/types/response';

export async function GET(request: NextRequest) {
  const { appCheckToken } = extractAuthContext(request);

  if (!appCheckToken) {
    return NextResponse.json(
      { message: 'Unauthorized: App Check token is missing' },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  const query = request.nextUrl.searchParams.get('query')?.trim() ?? '';

  if (!query) {
    return NextResponse.json([], { status: HttpStatusCode.OK });
  }

  try {
    const response = await searchRestaurantsWithKakao({
      appCheckToken,
      query,
    });

    if (!response.ok) {
      const text = await response.text();

      return NextResponse.json(
        { message: text || '카카오 검색 중 오류가 발생했어요.' },
        { status: response.status || HttpStatusCode.INTERNAL_SERVER_ERROR },
      );
    }

    const payload = (await response.json()) as {
      documents?: RestaurantSearchResponse;
    };

    return NextResponse.json(mapRestaurantSearchResponseToUi(payload.documents ?? []), {
      status: HttpStatusCode.OK,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Network Connection Failed',
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
    );
  }
}
