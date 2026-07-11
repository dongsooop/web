import { NextRequest, NextResponse } from 'next/server';

import { HttpStatusCode } from '@/constants/httpStatusCode';
import { extractAuthContext } from '@/features/auth/server/auth.context';
import { applyAuthResult, createSessionExpiredResponse } from '@/features/auth/server/auth.route';
import { requestChatbotWithServer } from '@/features/chatbot/server/chatbot.api';
import type { ChatbotRequest } from '@/features/chatbot/types';
import { ApiError } from '@/lib/api/apiError';

const requestFailedMessage = 'Request failed';

function trimText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: NextRequest) {
  const { accessToken, refreshToken, appCheckToken } = extractAuthContext(request);

  if (!appCheckToken) {
    console.error('[chatbot] missing app check token');

    return NextResponse.json(
      { code: 'APP_CHECK_REQUIRED', message: requestFailedMessage },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  if (!accessToken) {
    console.error('[chatbot] missing access token');

    return NextResponse.json(
      { code: 'AUTH_REQUIRED', message: requestFailedMessage },
      { status: HttpStatusCode.UNAUTHORIZED },
    );
  }

  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    console.error('[chatbot] invalid request body');

    return NextResponse.json(
      { code: 'INVALID_JSON', message: requestFailedMessage },
      { status: HttpStatusCode.BAD_REQUEST },
    );
  }

  try {
    const body = (rawBody ?? {}) as Partial<ChatbotRequest>;
    const payload: ChatbotRequest = {
      text: trimText(body.text),
    };

    if (!payload.text) {
      console.error('[chatbot] empty text payload');

      return NextResponse.json(
        { code: 'EMPTY_TEXT', message: requestFailedMessage },
        { status: HttpStatusCode.BAD_REQUEST },
      );
    }

    const result = await requestChatbotWithServer(payload, {
      accessToken,
      refreshToken,
      appCheckToken,
    });

    if (result.response.status === HttpStatusCode.UNAUTHORIZED) {
      return createSessionExpiredResponse();
    }

    const data = await result.response.json();
    const response = NextResponse.json(data, { status: result.response.status });
    applyAuthResult(response, result);

    return response;
  } catch (error) {
    const status =
      error instanceof ApiError && error.status !== HttpStatusCode.NETWORK_ERROR
        ? error.status
        : HttpStatusCode.INTERNAL_SERVER_ERROR;

    console.error('[chatbot] request failed', {
      status,
      message: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    });

    return NextResponse.json({ message: requestFailedMessage }, { status });
  }
}
