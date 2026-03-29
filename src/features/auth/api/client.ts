import { apiFetch } from '@/lib/api/apiFetch';
import type {
  EmailValidateRequest,
  NicknameValidateRequest,
  SignInResponse,
  SignOutResponse,
  SignUpRequest,
  SignUpResponse,
} from '../types/authTypes';
import { SendCodeRequest, VerifyCodeRequest } from '../types/passwordResetTypes';

interface SignInClientPayload {
  email: string;
  password: string;
}

export async function registerWebDevice() {
  return apiFetch<{ success: boolean }>('/api/auth/device', {
    method: 'POST',
  });
}

export async function signIn(payload: SignInClientPayload) {
  return apiFetch<SignInResponse>('/api/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
    }),
  });
}

export async function signUp(payload: SignUpRequest) {
  return apiFetch<SignUpResponse>('/api/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function signOut() {
  return apiFetch<SignOutResponse>('/api/auth/sign-out', {
    method: 'POST',
  });
}

// 이메일 중복체크
export async function checkEmailDuplicate(payload: EmailValidateRequest) {
  return apiFetch('/api/auth/check/email', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 닉네임 중복체크
export async function checkNicknameDuplicate(payload: NicknameValidateRequest) {
  return apiFetch('/api/auth/check/nickname', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 인증코드 전송
export async function sendCode(payload: SendCodeRequest) {
  return apiFetch('/api/auth/sign-up/email/send-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 인증 코드 확인
export async function verifyCode(payload: VerifyCodeRequest) {
  return apiFetch<void>('/api/auth/sign-up/email/verify-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
