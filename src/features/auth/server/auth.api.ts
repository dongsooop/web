import 'server-only';

import { serverFetch } from '@/lib/api/serverFetch';

import type {
  EmailValidateRequest,
  NicknameValidateRequest,
  ResetPasswordRequest,
  SendCodeRequest,
  SignInRequest,
  SignUpRequest,
  VerifyCodeRequest,
} from '../types/request';

import type { BackendSignInResponse } from '../types/backend';

interface ServerAuthRequestOptions {
  appCheckToken?: string;
  cookieHeader?: string | null;
}

interface SignInWithSpringOptions extends ServerAuthRequestOptions {
  deviceToken: string;
  deviceType: string;
}

function createHeaders(cookieHeader?: string | null) {
  const headers = new Headers();

  if (cookieHeader) {
    headers.set('Cookie', cookieHeader);
  }

  return headers;
}

function getRequiredEndpoint(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing`);
  }

  return value;
}

// Next -> Spring auth API
export async function signInWithSpring(
  payload: SignInRequest,
  options: SignInWithSpringOptions,
): Promise<BackendSignInResponse> {
  const endpoint = getRequiredEndpoint('LOGIN_ENDPOINT');
  const headers = createHeaders(options.cookieHeader);

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

export async function signUpWithSpring(
  payload: SignUpRequest,
  options: ServerAuthRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('SIGN_UP_ENDPOINT');
  const headers = createHeaders(options.cookieHeader);

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}

// 로그아웃
interface LogoutWithSpringOptions extends ServerAuthRequestOptions {
  accessToken?: string;
  deviceToken?: string;
}

export async function logoutWithSpring(options: LogoutWithSpringOptions = {}): Promise<Response> {
  const endpoint = getRequiredEndpoint('LOGOUT_ENDPOINT');
  const headers = createHeaders(options.cookieHeader);

  if (options.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`);
  }

  if (options.deviceToken) {
    headers.set('Device-Token', options.deviceToken);
  }

  return serverFetch(endpoint, {
    method: 'POST',
    headers,
    appCheckToken: options.appCheckToken,
  });
}

export async function checkEmailDuplicateWithSpring(
  payload: EmailValidateRequest,
  options: ServerAuthRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('EMAIL_VALIDATE_ENDPOINT');
  const headers = createHeaders(options.cookieHeader);

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}

export async function checkNicknameDuplicateWithSpring(
  payload: NicknameValidateRequest,
  options: ServerAuthRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('NICKNAME_VALIDATE_ENDPOINT');
  const headers = createHeaders(options.cookieHeader);

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}

export async function sendCodeWithSpring(
  payload: SendCodeRequest,
  options: ServerAuthRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('SEND_EMAIL_ENDPOINT');
  const headers = createHeaders(options.cookieHeader);

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}

export async function verifyCodeWithSpring(
  payload: VerifyCodeRequest,
  options: ServerAuthRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('CHECK_CODE_ENDPOINT');
  const headers = createHeaders(options.cookieHeader);

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}

export async function sendPasswordResetCodeWithSpring(
  payload: SendCodeRequest,
  options: ServerAuthRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('PW_SEND_EMAIL_ENDPOINT');
  const headers = createHeaders(options.cookieHeader);

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}

export async function verifyPasswordResetCodeWithSpring(
  payload: VerifyCodeRequest,
  options: ServerAuthRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('PW_CHECK_CODE_ENDPOINT');
  const headers = createHeaders(options.cookieHeader);

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}

export async function resetPasswordWithSpring(
  payload: ResetPasswordRequest,
  options: ServerAuthRequestOptions = {},
): Promise<Response> {
  const endpoint = getRequiredEndpoint('PW_RESET_ENDPOINT');
  const headers = createHeaders(options.cookieHeader);

  return serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    appCheckToken: options.appCheckToken,
  });
}
