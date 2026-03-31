import { clientRequest } from '@/lib/api/clientRequest';

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
  UserResponse,
} from '../types/response';

// 브라우저 -> Next API
export async function registerWebDevice() {
  return clientRequest<{ success: boolean }>('/api/auth/device', {
    method: 'POST',
  });
}

export async function signIn(payload: SignInRequest) {
  return clientRequest<SignInResponse>('/api/auth/sign-in', {
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
  return clientRequest<{ success: boolean }>('/api/auth/logout', {
    method: 'POST',
  });
}

export async function getSession() {
  return clientRequest<SessionResponse>('/api/session', {
    method: 'GET',
  });
}

// 이메일 중복 체크
export async function checkEmailDuplicate(payload: EmailValidateRequest) {
  const fullEmail = payload.email.includes('@')
    ? payload.email
    : `${payload.email}@dongyang.ac.kr`;

  return clientRequest<{ available: boolean; message?: string }>(
    '/api/auth/check/email',
    {
      method: 'POST',
      body: JSON.stringify({ email: fullEmail }),
    },
  );
}

// 닉네임 중복 체크
export async function checkNicknameDuplicate(payload: NicknameValidateRequest) {
  return clientRequest<{ available: boolean; message?: string }>(
    '/api/auth/check/nickname',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

// 인증 코드 전송
export async function sendCode(payload: SendCodeRequest) {
  return clientRequest<{ success: boolean; message?: string }>(
    '/api/auth/sign-up/email/send-code',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

// 인증 코드 검증
export async function verifyCode(payload: VerifyCodeRequest) {
  return clientRequest<void>('/api/auth/sign-up/email/verify-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 비밀번호 변경
export async function resetPassword(payload: ResetPasswordRequest) {
  return clientRequest<void>('/api/auth/password-reset', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 인증 코드 전송(비밀번호 변경화면)
export async function sendPasswordResetCode(payload: SendCodeRequest) {
  return clientRequest<{ success: boolean; message?: string }>(
    '/api/auth/password-reset/email/send-code',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

// 인증 코드 검증(비밀번호 변경화면)
export async function verifyPasswordResetCode(payload: VerifyCodeRequest) {
  return clientRequest<void>('/api/auth/password-reset/email/verify-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}