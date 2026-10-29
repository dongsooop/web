import type { ReadonlyURLSearchParams } from 'next/navigation';
import { resolveSocialCallbackErrorKey } from '@/features/auth/lib/socialError';
import type { SocialErrorKey } from '@/features/auth/types/error';

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

export function resolveSocialCallbackError(error: string, description: string): SocialErrorKey | null {
  return resolveSocialCallbackErrorKey(error, description);
}

export function getGoogleCallbackResult(): SocialCallbackResult<GoogleCallbackPayload> {
  const params = getHashParams();
  const accessToken = params.get('access_token')?.trim() ?? '';
  const state = params.get('state')?.trim() ?? '';
  const error = params.get('error')?.trim() ?? '';
  const errorDescription = params.get('error_description')?.trim() ?? '';

  return {
    payload: accessToken || state ? { accessToken, state } : null,
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
    payload: code || state ? { code, state } : null,
    error,
    errorDescription,
  };
}
