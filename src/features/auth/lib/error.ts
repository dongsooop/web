import type { PasswordResetErrorKey } from '@/features/auth/types/error';

const passwordResetErrorKeys: PasswordResetErrorKey[] = [
  'INVALID_INPUT',
  'EMAIL_NOT_FOUND',
  'UNKNOWN_ERROR',
  'PASSWORD_MISMATCH',
  'INVALID_PASSWORD_FORMAT',
  'CODE_LIMIT_EXCEEDED',
];

export function isPasswordResetErrorKey(error: unknown): error is PasswordResetErrorKey {
  return typeof error === 'string' && passwordResetErrorKeys.includes(error as PasswordResetErrorKey);
}
