import { ApiError } from '@/lib/api/apiError';
import { apiFetch } from '@/lib/api/apiFetch';
import { HttpStatusCode } from '@/constants/httpStatusCode';

export interface EmailCheckResult {
  ok: boolean;
  reason: 'EMAIL_ALREADY_EXISTS' | 'EMAIL_NOT_FOUND' | 'INVALID_INPUT' | 'UNKNOWN_ERROR' | null;
}

async function requestEmailValidation(email: string) {
  try {
    await apiFetch<void>('/api/auth/check/email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    return { status: HttpStatusCode.NO_CONTENT };
  } catch (error) {
    if (error instanceof ApiError) {
      return { status: error.status };
    }

    return { status: HttpStatusCode.INTERNAL_SERVER_ERROR };
  }
}

export async function checkSignUpEmail(email: string): Promise<EmailCheckResult> {
  const response = await requestEmailValidation(email);

  if (response.status === HttpStatusCode.NO_CONTENT) {
    return { ok: true, reason: null };
  }

  if (response.status === HttpStatusCode.CONFLICT) {
    return { ok: false, reason: 'EMAIL_ALREADY_EXISTS' };
  }

  if (response.status === HttpStatusCode.BAD_REQUEST) {
    return { ok: false, reason: 'INVALID_INPUT' };
  }

  return { ok: false, reason: 'UNKNOWN_ERROR' };
}

export async function checkPasswordResetEmail(email: string): Promise<EmailCheckResult> {
  const response = await requestEmailValidation(email);

  if (response.status === HttpStatusCode.CONFLICT) {
    return { ok: true, reason: null };
  }

  if (response.status === HttpStatusCode.NO_CONTENT) {
    return { ok: false, reason: 'EMAIL_NOT_FOUND' };
  }

  if (response.status === HttpStatusCode.BAD_REQUEST) {
    return { ok: false, reason: 'INVALID_INPUT' };
  }

  return { ok: false, reason: 'UNKNOWN_ERROR' };
}
