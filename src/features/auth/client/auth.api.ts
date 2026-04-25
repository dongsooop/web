import { clientRequest } from '@/lib/api/clientRequest';
import { clientRequestAuth } from '@/lib/api/clientRequestAuth';

import type {
  EmailValidateRequest,
  NicknameValidateRequest,
  ResetPasswordRequest,
  SendCodeRequest,
  SignInRequest,
  SignUpRequest,
  VerifyCodeRequest,
} from '../types/request';

import type {
  SessionResponse,
  SignInResponse,
  SocialStateResponse,
  UserResponse,
} from '../types/response';

{/* 브라우저 -> Next API */}
export async function signIn(payload: SignInRequest) {
  return clientRequestAuth<SignInResponse>('/bff/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function signUp(payload: SignUpRequest) {
  return clientRequest<UserResponse>('/bff/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  return clientRequestAuth<{ success: boolean }>('/bff/auth/logout', {
    method: 'POST',
  });
}

export async function deleteAccount() {
  return clientRequestAuth<void>('/bff/auth/delete', {
    method: 'DELETE',
  });
}

export async function getSession() {
  return clientRequestAuth<SessionResponse>('/bff/auth/session', {
    method: 'GET',
  });
}

export async function getSocialState() {
  return clientRequestAuth<SocialStateResponse>('/bff/auth/social/state', {
    method: 'GET',
  });
}

export async function checkEmailDuplicate(payload: EmailValidateRequest) {
  const fullEmail = payload.email.includes('@') ? payload.email : `${payload.email}@dongyang.ac.kr`;

  return clientRequest<{ available: boolean; message?: string }>('/bff/auth/check/email', {
    method: 'POST',
    body: JSON.stringify({ email: fullEmail }),
  });
}

export async function checkNicknameDuplicate(payload: NicknameValidateRequest) {
  return clientRequest<{ available: boolean; message?: string }>('/bff/auth/check/nickname', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function sendCode(payload: SendCodeRequest) {
  return clientRequest<{ success: boolean; message?: string }>(
    '/bff/auth/sign-up/email/send-code',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export async function verifyCode(payload: VerifyCodeRequest) {
  return clientRequest<void>('/bff/auth/sign-up/email/verify-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: ResetPasswordRequest) {
  return clientRequest<void>('/bff/auth/password-reset', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function sendPasswordResetCode(payload: SendCodeRequest) {
  return clientRequest<{ success: boolean; message?: string }>(
    '/bff/auth/password-reset/email/send-code',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export async function verifyPasswordResetCode(payload: VerifyCodeRequest) {
  return clientRequest<void>('/bff/auth/password-reset/email/verify-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
