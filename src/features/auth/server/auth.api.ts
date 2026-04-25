import 'server-only';

import { serverFetch } from '@/lib/api/serverFetch';
import { serverFetchAuth } from '@/lib/api/serverFetchAuth';

import type {
  EmailValidateRequest,
  NicknameValidateRequest,
  ResetPasswordRequest,
  SendCodeRequest,
  SignInRequest,
  SignUpRequest,
  VerifyCodeRequest,
} from '../types/request';

import type { BackendReissueResponse, BackendSignInResponse, SocialState } from '../types/backend';
import { buildAuthHeaders } from './auth.header';

type SpringRequestOptions = {
  appCheckToken?: string;
  cookieHeader?: string | null;
};

type SpringAuthRequestOptions = SpringRequestOptions & {
  accessToken: string;
  refreshToken?: string;
};

type SocialStateResult = {
  list: SocialState[];
  reissuedTokens?: BackendReissueResponse;
  clearAuthCookies?: boolean;
};

function getRequiredEndpoint(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing`);
  }

  return value;
}

export async function signInWithSpring(
  payload: SignInRequest,
  options: SpringRequestOptions & {
    deviceToken: string;
    deviceType: string;
  },
): Promise<BackendSignInResponse> {
  const endpoint = getRequiredEndpoint('LOGIN_ENDPOINT');

  const headers = buildAuthHeaders({
    cookieHeader: options.cookieHeader,
  });

  const requestBody = {
    email: payload.email,
    password: payload.password,
    fcmToken: options.deviceToken,
    deviceType: options.deviceType,
  };

  const response = await serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers,
    appCheckToken: options.appCheckToken,
  });

  return response.json() as Promise<BackendSignInResponse>;
}

export async function reissueWithSpring(
  options: SpringRequestOptions & {
    refreshToken: string;
  },
): Promise<BackendReissueResponse> {
  const endpoint = getRequiredEndpoint('REISSUE_ENDPOINT');

  const headers = buildAuthHeaders({
    cookieHeader: options.cookieHeader,
    baseHeaders: {
      'Content-Type': 'text/plain',
    },
  });

  const response = await serverFetch(endpoint, {
    method: 'POST',
    body: options.refreshToken,
    headers,
    appCheckToken: options.appCheckToken,
  });

  return response.json() as Promise<BackendReissueResponse>;
}

export async function signUpWithSpring(
  payload: SignUpRequest,
  options: SpringRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('SIGN_UP_ENDPOINT');

  const headers = buildAuthHeaders({
    cookieHeader: options.cookieHeader,
  });

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}

export async function getSocialStateWithSpring(
  options: SpringAuthRequestOptions,
): Promise<SocialStateResult> {
  const endpoint = getRequiredEndpoint('SOCIAL_STATE_ENDPOINT');

  const result = await serverFetchAuth(endpoint, {
    method: 'GET',
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });

  const list =
    result.response.status === 204 ? [] : ((await result.response.json()) as SocialState[]);

  return {
    list: Array.isArray(list) ? list : [],
    reissuedTokens: result.reissuedTokens,
    clearAuthCookies: result.clearAuthCookies,
  };
}

export async function logoutWithSpring(
  options: SpringAuthRequestOptions & {
    deviceToken: string;
  },
) {
  const endpoint = getRequiredEndpoint('LOGOUT_ENDPOINT');

  return serverFetchAuth(endpoint, {
    method: 'POST',
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
    acceptRedirect: true,
    headers: {
      'Device-Token': options.deviceToken,
    },
  });
}

export async function deleteWithSpring(options: SpringAuthRequestOptions) {
  const endpoint = getRequiredEndpoint('DELETE_USER_ENDPOINT');

  return serverFetchAuth(endpoint, {
    method: 'DELETE',
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    appCheckToken: options.appCheckToken,
  });
}

export async function checkEmailDuplicateWithSpring(
  payload: EmailValidateRequest,
  options: SpringRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('EMAIL_VALIDATE_ENDPOINT');

  const headers = buildAuthHeaders({
    cookieHeader: options.cookieHeader,
  });

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}

export async function checkNicknameDuplicateWithSpring(
  payload: NicknameValidateRequest,
  options: SpringRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('NICKNAME_VALIDATE_ENDPOINT');

  const headers = buildAuthHeaders({
    cookieHeader: options.cookieHeader,
  });

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}

export async function sendCodeWithSpring(
  payload: SendCodeRequest,
  options: SpringRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('SEND_EMAIL_ENDPOINT');

  const headers = buildAuthHeaders({
    cookieHeader: options.cookieHeader,
  });

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}

export async function verifyCodeWithSpring(
  payload: VerifyCodeRequest,
  options: SpringRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('CHECK_CODE_ENDPOINT');

  const headers = buildAuthHeaders({
    cookieHeader: options.cookieHeader,
  });

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}

export async function sendPasswordResetCodeWithSpring(
  payload: SendCodeRequest,
  options: SpringRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('PW_SEND_EMAIL_ENDPOINT');

  const headers = buildAuthHeaders({
    cookieHeader: options.cookieHeader,
  });

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}

export async function verifyPasswordResetCodeWithSpring(
  payload: VerifyCodeRequest,
  options: SpringRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('PW_CHECK_CODE_ENDPOINT');

  const headers = buildAuthHeaders({
    cookieHeader: options.cookieHeader,
  });

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}

export async function resetPasswordWithSpring(
  payload: ResetPasswordRequest,
  options: SpringRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('PW_RESET_ENDPOINT');

  const headers = buildAuthHeaders({
    cookieHeader: options.cookieHeader,
  });

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}
