import type { ReadonlyURLSearchParams } from 'next/navigation';

import { getErrorMessage } from '@/lib/errors/messages';

export type SocialCallbackResult<T> = {
  payload: T | null;
  error: string;
  errorDescription: string;
};

export type KakaoCallbackPayload = {
  code: string;
  state: string;
};

export type GoogleCallbackPayload = {
  accessToken: string;
  state: string;
};

function getHashParams() {
  if (typeof window === 'undefined') {
    return new URLSearchParams();
  }

  return new URLSearchParams(window.location.hash.replace(/^#/, ''));
}

export function resolveSocialCallbackError(error: string, description: string) {
  if (description) {
    return description;
  }

  if (error === 'access_denied') {
    return null;
  }

  return getErrorMessage('social', new Error(), 'sdk');
}

export function getGoogleCallbackResult(): SocialCallbackResult<GoogleCallbackPayload> {
  const params = getHashParams();
  const accessToken = params.get('access_token')?.trim() ?? '';
  const state = params.get('state')?.trim() ?? '';
  const error = params.get('error')?.trim() ?? '';
  const errorDescription = params.get('error_description')?.trim() ?? '';

  return {
    payload: { accessToken, state },
    error,
    errorDescription,
  };
}

export function getKakaoCallbackResult(
  searchParams: ReadonlyURLSearchParams,
): SocialCallbackResult<KakaoCallbackPayload> {
  const code = searchParams.get('code')?.trim() ?? '';
  const state = searchParams.get('state')?.trim() ?? '';
  const error = searchParams.get('error')?.trim() ?? '';
  const errorDescription = searchParams.get('error_description')?.trim() ?? '';

  return {
    payload: { code, state },
    error,
    errorDescription,
  };
}
