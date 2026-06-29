import { HttpStatusCode } from '@/constants/httpStatusCode';
import { ApiError } from '@/lib/api/apiError';
import type { SocialErrorContext, SocialErrorKey } from '@/features/auth/types/error';

export function resolveSocialCallbackErrorKey(
  error: string,
  errorDescription: string,
): SocialErrorKey | null {
  if (error === 'access_denied') {
    return null;
  }

  if (errorDescription) {
    return 'SOCIAL_SDK';
  }

  return 'SOCIAL_SDK';
}

export function resolveSocialErrorKey(
  error: unknown,
  context: SocialErrorContext,
): SocialErrorKey {
  if (error instanceof ApiError) {
    if (context === 'login' && error.status === HttpStatusCode.BAD_REQUEST) {
      return 'SOCIAL_MISSING_LINK';
    }

    if (context === 'unlink' && error.status === HttpStatusCode.UNAUTHORIZED) {
      return 'SOCIAL_UNAUTHORIZED_UNLINK';
    }
  }

  if (context === 'login') {
    return 'SOCIAL_LOGIN';
  }

  if (context === 'link') {
    return 'SOCIAL_LINK';
  }

  return 'SOCIAL_UNLINK';
}
