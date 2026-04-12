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

import type { SessionResponse, SignInResponse, UserResponse } from '../types/response';

{/* 브라우저 -> Next API */}
export async function signIn(payload: SignInRequest) {
  return clientRequestAuth<SignInResponse>('/api/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function signUp(payload: SignUpRequest) {
  return clientRequest<UserResponse>('/api/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  return clientRequestAuth<{ success: boolean }>('/api/auth/logout', {
    method: 'POST',
  });
}

export async function getSession() {
  return clientRequestAuth<SessionResponse>('/api/auth/session', {
    method: 'GET',
  });
}

export async function checkEmailDuplicate(payload: EmailValidateRequest) {
  const fullEmail = payload.email.includes('@') ? payload.email : `${payload.email}@dongyang.ac.kr`;

  return clientRequest<{ available: boolean; message?: string }>('/api/auth/check/email', {
    method: 'POST',
    body: JSON.stringify({ email: fullEmail }),
  });
}

export async function checkNicknameDuplicate(payload: NicknameValidateRequest) {
  return clientRequest<{ available: boolean; message?: string }>('/api/auth/check/nickname', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function sendCode(payload: SendCodeRequest) {
  return clientRequest<{ success: boolean; message?: string }>(
    '/api/auth/sign-up/email/send-code',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export async function verifyCode(payload: VerifyCodeRequest) {
  return clientRequest<void>('/api/auth/sign-up/email/verify-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: ResetPasswordRequest) {
  return clientRequest<void>('/api/auth/password-reset', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function sendPasswordResetCode(payload: SendCodeRequest) {
  return clientRequest<{ success: boolean; message?: string }>(
    '/api/auth/password-reset/email/send-code',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export async function verifyPasswordResetCode(payload: VerifyCodeRequest) {
  return clientRequest<void>('/api/auth/password-reset/email/verify-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
