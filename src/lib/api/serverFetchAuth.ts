import 'server-only';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';
import { serverFetch, type ServerFetchOptions } from '@/lib/api/serverFetch';
import { reissueWithSpring } from '@/features/auth/server/auth.api';
import { buildAuthHeaders } from '@/features/auth/server/auth.header';
import type { BackendReissueResponse } from '@/features/auth/types/backend';

type ServerFetchAuthResult = {
  response: Response;
  reissuedTokens?: BackendReissueResponse;
  clearAuthCookies?: boolean;
};

function createUnauthorizedResponse() {
  return new Response(null, { status: HttpStatusCode.UNAUTHORIZED });
}

export async function serverFetchAuth(
  url: string,
  options: ServerFetchOptions & {
    accessToken?: string;
    refreshToken?: string;
  } = {},
): Promise<ServerFetchAuthResult> {
  const { accessToken, refreshToken, appCheckToken, headers: rawHeaders, ...restOptions } = options;

  if (!accessToken) {
    return {
      response: createUnauthorizedResponse(),
      clearAuthCookies: true,
    };
  }

  const requestHeaders = buildAuthHeaders({
    baseHeaders: rawHeaders,
    accessToken,
  });

  try {
    const response = await serverFetch(url, {
      ...restOptions,
      appCheckToken,
      headers: requestHeaders,
    });

    return {
      response,
    };
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }

    if (error.status !== HttpStatusCode.UNAUTHORIZED) {
      throw error;
    }

    if (!refreshToken) {
      return {
        response: createUnauthorizedResponse(),
        clearAuthCookies: true,
      };
    }

    try {
      const reissuedTokens = await reissueWithSpring({
        refreshToken,
        appCheckToken,
      });

      const retryHeaders = buildAuthHeaders({
        baseHeaders: rawHeaders,
        accessToken: reissuedTokens.accessToken,
      });

      const retryResponse = await serverFetch(url, {
        ...restOptions,
        appCheckToken,
        headers: retryHeaders,
      });

      return {
        response: retryResponse,
        reissuedTokens,
      };
    } catch (reissueError) {
      if (reissueError instanceof ApiError && reissueError.status === HttpStatusCode.UNAUTHORIZED) {
        return {
          response: createUnauthorizedResponse(),
          clearAuthCookies: true,
        };
      }

      throw reissueError;
    }
  }
}
