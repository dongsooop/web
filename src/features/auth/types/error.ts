import type { ApiError } from '@/lib/api/apiError';

export type AuthErrorKey =
  | 'INPUT_EMAIL_REQUIRED'
  | 'INPUT_PASSWORD_REQUIRED'
  | 'NO_USER_INFO_IN_RESPONSE';

export type AuthErrorContext =
  | 'signIn'
  | 'signInGoogle'
  | 'signInKakao'
  | 'deleteAccount';

export type AuthError = ApiError | Error | AuthErrorKey | null;

export type SignUpErrorKey =
  | 'INVALID_EMAIL_DOMAIN'
  | 'EXPIRED_CODE'
  | 'CODE_LIMIT_EXCEEDED'
  | 'INVALID_INPUT';

export type SignUpErrorContext =
  | 'checkEmail'
  | 'sendCode'
  | 'verifyCode'
  | 'checkNickname'
  | 'signUp';

export type SignUpError = ApiError | SignUpErrorKey | null;
export type SignUpRuntimeError = ApiError | Error | SignUpErrorKey | null;

export type PasswordResetErrorKey =
  | 'INVALID_INPUT'
  | 'EMAIL_NOT_FOUND'
  | 'UNKNOWN_ERROR'
  | 'PASSWORD_MISMATCH'
  | 'INVALID_PASSWORD_FORMAT'
  | 'CODE_LIMIT_EXCEEDED';

export type PasswordResetErrorContext = 'emailCheck' | 'sendCode' | 'verifyCode' | 'reset';

export type PasswordResetError = ApiError | Error | PasswordResetErrorKey | null;

export type SocialErrorKey =
  | 'SOCIAL_SDK'
  | 'SOCIAL_LOGIN'
  | 'SOCIAL_STATE'
  | 'SOCIAL_LINK'
  | 'SOCIAL_UNLINK'
  | 'SOCIAL_KAKAO_RATE_LIMIT'
  | 'SOCIAL_MISSING_LINK'
  | 'SOCIAL_UNAUTHORIZED_UNLINK';

export type SocialErrorContext = 'login' | 'link' | 'unlink';
