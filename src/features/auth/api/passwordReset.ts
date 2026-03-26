import { apiFetch } from '@/lib/api/apiFetch';
import { ResetPasswordRequest, SendCodeRequest, VerifyCodeRequest } from '../types/passwordResetTypes';

export async function sendPasswordResetCode(payload: SendCodeRequest) {
  return apiFetch<void>('/api/auth/password-reset/email/send-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function verifyPasswordResetCode(payload: VerifyCodeRequest) {
  return apiFetch<void>('/api/auth/password-reset/email/verify-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: ResetPasswordRequest) {
  return apiFetch<void>('/api/auth/password-reset', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}