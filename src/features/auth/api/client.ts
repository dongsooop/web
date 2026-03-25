import { apiFetch } from '@/lib/api/apiFetch';
import type {
  EmailDuplicateCheckRequest,
  SignInResponse,
  SignOutResponse,
  SignUpRequest,
  SignUpResponse,
} from '../types';

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

export async function checkEmailDuplicate(payload: EmailDuplicateCheckRequest) {
  return apiFetch('/api/auth/check/email', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
